import * as THREE from './assets/three/three.module.js';
import { OrbitControls } from './assets/three/OrbitControls.js';

const guia3d = (() => {
  let container, renderer, scene, camera, controls;
  let group = null;
  let available = false;
  let current = null;
  let pendTexCache = {};

  function init() {
    container = document.getElementById('preview-3d');
    if (!container) return;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch (e) {
      available = false;
      return;
    }
    available = true;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, -1.4, 10.5);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, -1.4, 0);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enablePan = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.9;
    controls.minDistance = 3.5;
    controls.maxDistance = 20;

    scene.add(new THREE.AmbientLight(0xfff2dc, 0.75));
    const key = new THREE.DirectionalLight(0xfff6e8, 1.1);
    key.position.set(4, 6, 6);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xbfd8ff, 0.45);
    rim.position.set(-5, 2, -4);
    scene.add(rim);
    const fill = new THREE.PointLight(0xc9a227, 0.7, 30);
    fill.position.set(0, 2, 4);
    scene.add(fill);

    resize();
    window.addEventListener('resize', resize);
    renderer.setAnimationLoop(animate);
  }

  function resize() {
    if (!renderer || !container) return;
    const w = container.clientWidth || 300;
    const h = container.clientHeight || 300;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  function animate() {
    if (!available) return;
    if (container && container.offsetParent === null) return;
    controls.update();
    renderer.render(scene, camera);
  }

  const S = 0.03;

  function hexColor(hex) {
    return new THREE.Color(hex || '#C0392B');
  }

  function disposeGroup() {
    if (!group) return;
    scene.remove(group);
    group.traverse((o) => {
      if (o.geometry) o.geometry.dispose();
      if (o.material) {
        const mats = Array.isArray(o.material) ? o.material : [o.material];
        mats.forEach((m) => {
          if (m.map) m.map.dispose();
          m.dispose();
        });
      }
    });
    group = null;
  }

  function strandCurve(s, fios, trancado) {
    const mid = (fios - 1) / 2;
    const off = (s - mid);
    const yOff = trancado ? off * 0.05 : off * 0.42;
    const zOff = trancado ? 0 : off * 0.12;
    const p0 = new THREE.Vector3(-4.62, 1.5 + yOff, 0.7 + zOff);
    const p1 = new THREE.Vector3(0, -4.1 + yOff, -0.7 + zOff);
    const p2 = new THREE.Vector3(4.62, 1.5 + yOff, 0.7 + zOff);
    return new THREE.QuadraticBezierCurve3(p0, p1, p2);
  }

  function pointAt(curve, t, s, fios, trancado) {
    const p = curve.getPointAt(t);
    if (trancado && fios > 1) {
      p.z += 0.14 * Math.sin(t * Math.PI * fios * 3 + (s * Math.PI * 2) / fios);
      p.y += 0.06 * Math.cos(t * Math.PI * fios * 3 + (s * Math.PI * 2) / fios);
    }
    return p;
  }

  function sphereMat(color, metal = 0.25, rough = 0.35, extra) {
    const m = new THREE.MeshPhysicalMaterial({
      color: hexColor(color),
      metalness: metal,
      roughness: rough,
      clearcoat: 0.35,
      clearcoatRoughness: 0.4
    });
    if (extra) Object.assign(m, extra);
    return m;
  }

  function goldMat() {
    return new THREE.MeshStandardMaterial({
      color: 0xe4c66b, metalness: 0.9, roughness: 0.28
    });
  }

  function addBeadGroup(p, r, mat) {
    const geo = new THREE.SphereGeometry(r, 20, 16);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.copy(p);
    group.add(mesh);
  }

  function firmaMesh(p, r, color, type) {
    const core = new THREE.Mesh(
      new THREE.SphereGeometry(r, 24, 20),
      sphereMat(color, 0.3, 0.3)
    );
    core.position.copy(p);
    group.add(core);
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(r * 0.62, r * 0.16, 12, 32),
      goldMat()
    );
    ring.position.copy(p);
    ring.rotation.x = Math.PI / 2;
    group.add(ring);
    if (type === 'olho') {
      const pupil = new THREE.Mesh(
        new THREE.SphereGeometry(r * 0.34, 16, 12),
        new THREE.MeshStandardMaterial({ color: 0x2a1a0f, roughness: 0.2 })
      );
      pupil.position.set(p.x + r * 0.45, p.y + r * 0.1, p.z + r * 0.45);
      group.add(pupil);
    }
  }

  function pendantSprite(svgStr, scale) {
    return new Promise((resolve) => {
      if (pendTexCache[svgStr]) {
        resolve(makeSprite(pendTexCache[svgStr], scale));
        return;
      }
      const url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style="color:#e4c66b">' + svgStr + '</svg>'
      );
      const img = new Image();
      img.onload = () => {
        const c = document.createElement('canvas');
        c.width = 128; c.height = 128;
        const ctx = c.getContext('2d');
        ctx.drawImage(img, 28, 28, 72, 72);
        const tex = new THREE.CanvasTexture(c);
        tex.colorSpace = THREE.SRGBColorSpace;
        pendTexCache[svgStr] = tex;
        resolve(makeSprite(tex, scale));
      };
      img.onerror = () => {
        pendTexCache[svgStr] = null;
        resolve(null);
      };
      img.src = url;
    });
  }

  function makeSprite(tex, scale) {
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: true });
    const spr = new THREE.Sprite(mat);
    spr.scale.set(scale, scale, 1);
    return spr;
  }

  function gem(p, size) {
    const mesh = new THREE.Mesh(new THREE.OctahedronGeometry(size, 0), goldMat());
    mesh.position.copy(p);
    group.add(mesh);
  }

  async function build(payload) {
    disposeGroup();
    group = new THREE.Group();
    scene.add(group);

    const { colors, seq, fios, trancado, firma, firmaType, buzios, entremeio, beadCm } = payload;
    const beadR = beadCm === 0.4 ? 0.225 : 0.186;
    const firmaR = beadR * 1.85;
    const n = seq.length;
    const mid = (fios - 1) / 2;

    const strandOrder = [];
    for (let i = 0; i < fios; i++) strandOrder.push(i);
    strandOrder.sort((a, b) => Math.abs(a - mid) - Math.abs(b - mid));

    for (const s of strandOrder) {
      const curve = strandCurve(s, fios, trancado);
      const last = n - 1;
      for (let k = 0; k < n; k++) {
        const frac = k / last;
        const p = pointAt(curve, frac, s, fios, trancado);
        const isEnd = k === 0 || k === last;
        const isCenter = k === Math.round(n / 2) && s === mid;
        const shellEvery = Math.max(1, Math.floor(n / 5));
        const isShell = buzios && ((k + Math.floor(n / 5) * (s % 3)) % shellEvery === 0) && !isEnd && !isCenter;
        if (isShell) {
          addBeadGroup(p, beadR * 1.1, new THREE.MeshStandardMaterial({ color: 0xefe3c6, roughness: 0.6 }));
          continue;
        }
        if (isEnd || isCenter) {
          firmaMesh(p, firmaR, firma, firmaType);
          continue;
        }
        if (entremeio && k > 0 && seq[k] !== seq[k - 1]) {
          addBeadGroup(p, beadR * 0.55, goldMat());
          addBeadGroup(p, beadR, sphereMat(colors[seq[k]] ? colors[seq[k]].h : '#C0392B', 0.2, 0.4));
          continue;
        }
        addBeadGroup(p, beadR, sphereMat(colors[seq[k]] ? colors[seq[k]].h : '#C0392B', 0.2, 0.4));
      }
    }

    const midCurve = strandCurve(mid, fios, trancado);
    const bot = pointAt(midCurve, 0.5, mid, fios, trancado);

    const wire = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 0.75, 8),
      goldMat()
    );
    wire.position.set(bot.x, bot.y - 0.37, bot.z + 0.1);
    group.add(wire);

    const gemP = new THREE.Vector3(bot.x, bot.y - 0.85, bot.z + 0.1);
    gem(gemP, 0.16);

    if (payload.pend1 && payload.pend1.svg) {
      const spr = await pendantSprite(payload.pend1.svg, 1.05);
      if (spr) {
        spr.position.set(gemP.x, gemP.y - 0.28, gemP.z);
        group.add(spr);
      }
    }

    if (payload.pend2 && payload.pend2.svg && payload.showPend2) {
      const pL = pointAt(midCurve, 0.38, mid, fios, trancado);
      const pR = pointAt(midCurve, 0.62, mid, fios, trancado);
      const sprL = await pendantSprite(payload.pend2.svg, 0.75);
      const sprR = await pendantSprite(payload.pend2.svg, 0.75);
      if (sprL) {
        sprL.position.set(pL.x, pL.y - 0.5, pL.z + 0.2);
        group.add(sprL);
      }
      if (sprR) {
        sprR.position.set(pR.x, pR.y - 0.5, pR.z + 0.2);
        group.add(sprR);
      }
    }
  }

  function render(payload) {
    if (!available) return;
    current = payload;
    build(payload);
  }

  init();

  return {
    get available() { return available; },
    render,
    resize
  };
})();

window.guia3d = guia3d;