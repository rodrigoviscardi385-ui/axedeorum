document.addEventListener('DOMContentLoaded', () => {
  const isLoggedIn = <% = isLoggedIn %>;
  const user = <% = JSON.stringify(user) %>;
  
  // Orixá data
  const orixas = <%= JSON.stringify(orixas) %>;

  // Inicializar cards de Orixá
  function initOrixaCards() {
    const container = document.getElementById('orixa-cards');
    if (!container) return;

    container.innerHTML = orixas.map(orixa => `
      <div class="orixa-card" data-orixa="${orixa.id}" role="button" tabindex="0" aria-label=" ${orixa.nome} - ${orixa.cor}">
        <div class="orixa-color" style="background: ${getOrixaColor(orixa.id)}"></div>
        <h4>${orixa.nome}</h4>
        <p>${orixa.elemento}</p>
      </div>
    `).join('');

    container.querySelectorAll('.orixa-card').forEach(card => {
      card.addEventListener('click', () => selectOrixa(parseInt(card.dataset.orixa)));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') selectOrixa(parseInt(card.dataset.orixa));
      });
    });
  }

  function getOrixaColor(id) {
    const colors = [ '#FFD700', '#FFFFFF', '#FFE5B4', '#FF4136', '#008000', '#FFFFFF', '#C14A4A', '#000000' ];
    return colors[id - 1] || '#FFD700';
  }

  // Selecionar Orixá no builder
  window.selectOrixa = function(id) {
    orixas.forEach(o => {
      document.querySelector(`[data-orixa="${o.id}"]`).classList.toggle('active', o.id === id);
    });
    // Atualizar preview e campos hidden
    const orixaSelect = orixas.find(o => o.id === id);
    if (orixaSelect) {
      document.querySelector('input[name="orixa"]').value = orixaSelect.nome;
    }
  };

  // Inicializar preview SVG (simplificado)
  function initPreview() {
    const preview = document.getElementById('preview-svg');
    if (!preview) return;
    preview.innerHTML = `
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="#F5F0E9"/>
        <circle cx="100" cy="50" r="30" fill="#C9A227"/>
        <circle cx="100" cy="150" r="25" fill="#C9A227"/>
        <line x1="50" y1="100" x2="150" y2="100" stroke="#C9A227" stroke-width="8"/>
      </svg>
    `;
  }

  // Inicializar galeria de pingentes
  function initPingenteGaleria() {
    const gallery = document.getElementById('pingente-galeria');
    if (!gallery) return;

    const pingentes = [
      { name: 'Oxum', img: '/images/pendures/oxum.png', color: '#FFD700' },
      { name: 'Iemanjá', img: '/images/pendentes/iemanja.png', color: '#FFFFFF' },
      { name: 'Oshun', img: '/images/pendentes/osun.png', color: '#FFE5B4' },
      { name: 'Shango', img: '/images/pendentes/shango.png', color: '#FF4136' },
      { name: 'Exu', img: '/images/pendentes/exu.png', color: '#000000' }
    ];

    gallery.innerHTML = pingentes.map(p => `
      <div class="pingente-item" data-pendente="${p.name}" role="button" tabindex="0" aria-label="Pingente ${p.name}">
        <img src="${p.img}" alt="${p.name}" style="filter: grayscale(0%);">
        <h4>${p.name}</h4>
      </div>
    `).join('');

    gallery.querySelectorAll('.pingente-item').forEach(item => {
      item.addEventListener('click', () => selectPingente(item.dataset.pingente));
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') selectPingente(item.dataset.pingente);
      });
    });
  }

  function selectPingente(name) {
    // Atualizar UI
    document.querySelectorAll('.pingente-item').forEach(i => i.classList.remove('selected'));
    const selected = document.querySelector(`[data-pingente="${name}"]`);
    if (selected) selected.classList.add('selected');

    // Atualizar campo hidden
    document.querySelector('input[name="pendente"]').value = name;

    // Fechar preview lateral se aberto
    const aside = document.querySelector('.builder-panel');
    if (aside) aside.classList.remove('expanded');
  }

  // Inicializar toggles de cores
  function initColorToggles() {
    const modeRadios = document.querySelectorAll('input[name="colorMode"]');
    const recomendas = document.getElementById('cores-recomendadas');
    const personalizar = document.getElementById('cores-personalizar');

    modeRadios.forEach(radio => {
      radio.addEventListener('change', () => {
        if (radio.value === 'personalizar') {
          recomendas.hidden = true;
          personalizar.hidden = false;
        } else {
          recomendas.hidden = false;
          personalizar.hidden = true;
        }
      });
    });
  }

  // Inicializar
  initOrixaCards();
  initPreview();
  initPingenteGaleria();
  initColorToggles();
});
