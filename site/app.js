/* ============ Helpers ============ */
const $ = (s, p) => (p || document).querySelector(s);
const $$ = (s, p) => Array.from((p || document).querySelectorAll(s));

function shade(hex, f) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.round(((n >> 16) & 255) * f);
  const g = Math.round(((n >> 8) & 255) * f);
  const b = Math.round((n & 255) * f);
  return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
}
function beadGrad(hex) {
  return 'radial-gradient(circle at 32% 30%, rgba(255,255,255,.9), ' + hex + ' 52%, ' + shade(hex, .62) + ' 100%)';
}
const beadEl = (hex, cls) => '<span class="bead ' + (cls || '') + '" style="background:' + beadGrad(hex) + '"></span>';

/* ============ Dados ============ */
const PALETA = [
  { n: 'Branco', h: '#F7F3E8' }, { n: 'Vermelho', h: '#C0392B' }, { n: 'Azul-escuro', h: '#1F4E79' },
  { n: 'Verde', h: '#2E7D32' }, { n: 'Verde-claro', h: '#82C46B' }, { n: 'Marrom', h: '#6D4C2F' },
  { n: 'Amarelo', h: '#E3B928' }, { n: 'Dourado', h: '#C9A227' }, { n: 'Laranja', h: '#E67E22' },
  { n: 'Azul', h: '#2471A3' }, { n: 'Azul-claro', h: '#7FB8D8' }, { n: 'Roxo', h: '#6C3483' },
  { n: 'Lilás', h: '#A569BD' }, { n: 'Rosa', h: '#E884A4' }, { n: 'Coral', h: '#F2806B' },
  { n: 'Preto', h: '#2C2C2C' }, { n: 'Cristal', h: '#C8D6DF' }
];

const ORIXAS = [
  { id: 'oxala', name: 'Oxalá', group: 'Sete Linhas', cor: 'Branco', element: 'Luz', saudacao: 'Epa Babá!', meaning: 'Paz, pureza e criação. O grande pai, senhor da luz.', cores: [{ n: 'Branco', h: '#F7F3E8', w: 70 }, { n: 'Cristal', h: '#C8D6DF', w: 30 }], firma: '#F7F3E8', pendant: 'opaxoro' },
  { id: 'ogum', name: 'Ogum', group: 'Sete Linhas', cor: 'Vermelho', element: 'Fogo / Ferro', saudacao: 'Ogunhê!', meaning: 'Caminhos, proteção e abertura de estradas.', cores: [{ n: 'Vermelho', h: '#C0392B', w: 70 }, { n: 'Branco', h: '#F7F3E8', w: 30 }], firma: '#C0392B', pendant: 'espada' },
  { id: 'oxossi', name: 'Oxóssi', group: 'Sete Linhas', cor: 'Verde', element: 'Matas', saudacao: 'Okê Arô!', meaning: 'Caça, fartura e conhecimento das matas.', cores: [{ n: 'Verde', h: '#2E7D32', w: 80 }, { n: 'Verde-claro', h: '#82C46B', w: 20 }], firma: '#2E7D32', pendant: 'ofa' },
  { id: 'xango', name: 'Xangô', group: 'Sete Linhas', cor: 'Marrom', element: 'Fogo / Trovão', saudacao: 'Kaô Kabecilê!', meaning: 'Justiça, fogo e equilíbrio.', cores: [{ n: 'Marrom', h: '#6D4C2F', w: 70 }, { n: 'Vermelho', h: '#C0392B', w: 30 }], firma: '#6D4C2F', pendant: 'machado' },
  { id: 'iansa', name: 'Iansã', group: 'Sete Linhas', cor: 'Amarelo', element: 'Ventos', saudacao: 'Eparrei!', meaning: 'Ventos, tempestades e movimento.', cores: [{ n: 'Amarelo', h: '#E3B928', w: 70 }, { n: 'Laranja', h: '#E67E22', w: 30 }], firma: '#E3B928', pendant: 'raio' },
  { id: 'oxum', name: 'Oxum', group: 'Sete Linhas', cor: 'Azul', element: 'Águas doces', saudacao: 'Ora Ieiê ô!', meaning: 'Amor, rios e prosperidade.', cores: [{ n: 'Azul', h: '#2471A3', w: 70 }, { n: 'Dourado', h: '#C9A227', w: 30 }], firma: '#2471A3', pendant: 'abebe' },
  { id: 'iemanja', name: 'Iemanjá', group: 'Sete Linhas', cor: 'Azul-claro', element: 'Mares', saudacao: 'Odoyá!', meaning: 'Mares, maternidade e proteção.', cores: [{ n: 'Azul-claro', h: '#7FB8D8', w: 70 }, { n: 'Branco', h: '#F7F3E8', w: 30 }], firma: '#7FB8D8', pendant: 'estrela' },
  { id: 'nana', name: 'Nanã', group: 'Orixás complementares', cor: 'Roxo', element: 'Lama primordial', saudacao: 'Saluba Nanã!', meaning: 'Ancestralidade, sabedoria e serenidade.', cores: [{ n: 'Roxo', h: '#6C3483', w: 85 }, { n: 'Lilás', h: '#A569BD', w: 15 }], firma: '#6C3483', pendant: 'chave' },
  { id: 'obaluaie', name: 'Obaluaiê / Omolu', group: 'Orixás complementares', cor: 'Preto e branco', element: 'Cura', saudacao: 'Atotô!', meaning: 'Cura, transformação e acolhimento.', cores: [{ n: 'Preto', h: '#2C2C2C', w: 50 }, { n: 'Branco', h: '#F7F3E8', w: 50 }], firma: '#2C2C2C', pendant: 'cruzeiro' },
  { id: 'oxumare', name: 'Oxumarê', group: 'Orixás complementares', cor: 'Arco-íris', element: 'Ciclos', saudacao: 'Arroboboi!', meaning: 'Ciclos, movimento e renovação.', cores: [{ n: 'Verde', h: '#2E7D32', w: 34 }, { n: 'Amarelo', h: '#E3B928', w: 33 }, { n: 'Roxo', h: '#6C3483', w: 33 }], firma: '#2E7D32', pendant: 'arcoiris' },
  { id: 'ossain', name: 'Ossain', group: 'Orixás complementares', cor: 'Verde', element: 'Folhas', saudacao: 'Ewê Ó!', meaning: 'Folhas, medicina e ervas sagradas.', cores: [{ n: 'Verde', h: '#2E7D32', w: 60 }, { n: 'Verde-claro', h: '#82C46B', w: 40 }], firma: '#2E7D32', pendant: 'folha' },
  { id: 'exu', name: 'Exu', group: 'Linhas de trabalho', cor: 'Preto e vermelho', element: 'Encruzilhadas', saudacao: 'Laroyê!', meaning: 'Caminhos, comunicação e guardião das encruzilhadas.', cores: [{ n: 'Preto', h: '#2C2C2C', w: 50 }, { n: 'Vermelho', h: '#C0392B', w: 50 }], firma: '#2C2C2C', pendant: 'tridente' },
  { id: 'pombagira', name: 'Pombagira', group: 'Linhas de trabalho', cor: 'Preto, vermelho e rosa', element: 'Encruzilhadas', saudacao: 'Laroyê Pombagira!', meaning: 'Senhora das encruzilhadas, força feminina.', cores: [{ n: 'Preto', h: '#2C2C2C', w: 34 }, { n: 'Vermelho', h: '#C0392B', w: 33 }, { n: 'Rosa', h: '#E884A4', w: 33 }], firma: '#E884A4', pendant: 'garfo' },
  { id: 'eres', name: 'Erês / Crianças', group: 'Linhas de trabalho', cor: 'Azul-claro e rosa', element: 'Pureza', saudacao: 'Oni Beijadá!', meaning: 'Pureza, alegria e proteção das crianças.', cores: [{ n: 'Azul-claro', h: '#7FB8D8', w: 50 }, { n: 'Rosa', h: '#E884A4', w: 50 }], firma: '#E884A4', pendant: 'estrela' },
  { id: 'caboclo', name: 'Caboclos / Caboclas', group: 'Linhas de trabalho', cor: 'Verde', element: 'Matas', saudacao: 'Okê Caboclo!', meaning: 'Matas, cura e natureza.', cores: [{ n: 'Verde', h: '#2E7D32', w: 70 }, { n: 'Branco', h: '#F7F3E8', w: 30 }], firma: '#2E7D32', pendant: 'ofa' },
  { id: 'pretovelho', name: 'Pretos Velhos', group: 'Linhas de trabalho', cor: 'Preto e branco', element: 'Sabedoria', saudacao: 'Adorei as Almas!', meaning: 'Sabedoria, humildade e cura.', cores: [{ n: 'Preto', h: '#2C2C2C', w: 50 }, { n: 'Branco', h: '#F7F3E8', w: 50 }], firma: '#2C2C2C', pendant: 'cachimbo' },
  { id: 'boiadeiro', name: 'Boiadeiros', group: 'Linhas de trabalho', cor: 'Marrom e azul', element: 'Sertão', saudacao: 'Boiadeiro!', meaning: 'Força, trabalho e desatar nós.', cores: [{ n: 'Marrom', h: '#6D4C2F', w: 60 }, { n: 'Azul', h: '#2471A3', w: 40 }], firma: '#6D4C2F', pendant: 'laco' },
  { id: 'marinheiro', name: 'Marinheiros', group: 'Linhas de trabalho', cor: 'Azul e branco', element: 'Mares', saudacao: 'Salve o Marinheiro!', meaning: 'Mares, navegação e limpeza.', cores: [{ n: 'Azul', h: '#2471A3', w: 60 }, { n: 'Branco', h: '#F7F3E8', w: 40 }], firma: '#2471A3', pendant: 'ancora' },
  { id: 'cigano', name: 'Ciganos', group: 'Linhas de trabalho', cor: 'Dourado, rosa e vermelho', element: 'Estradas', saudacao: 'Salve a Estrada Cigana!', meaning: 'Liberdade, prosperidade e magia.', cores: [{ n: 'Dourado', h: '#C9A227', w: 40 }, { n: 'Rosa', h: '#E884A4', w: 30 }, { n: 'Vermelho', h: '#C0392B', w: 30 }], firma: '#C9A227', pendant: 'moeda' },
  { id: 'baiano', name: 'Baianos', group: 'Linhas de trabalho', cor: 'Verde e amarelo', element: 'Fé', saudacao: 'Saravá Baiano!', meaning: 'Fé, folia e cura.', cores: [{ n: 'Verde', h: '#2E7D32', w: 50 }, { n: 'Amarelo', h: '#E3B928', w: 50 }], firma: '#C9A227', pendant: 'chapeu' },
  { id: 'malandro', name: 'Malandros / Zé Pilintra', group: 'Linhas de trabalho', cor: 'Vermelho, preto e branco', element: 'Ruas', saudacao: 'Salve Zé Pilintra!', meaning: 'Astúcia, liberdade e desatar demandas.', cores: [{ n: 'Vermelho', h: '#C0392B', w: 40 }, { n: 'Preto', h: '#2C2C2C', w: 35 }, { n: 'Branco', h: '#F7F3E8', w: 25 }], firma: '#2C2C2C', pendant: 'bengala' }
];

const GROUP_ORDER = ['Sete Linhas', 'Orixás complementares', 'Linhas de trabalho'];

const COST = {
  micanga100g: 6.90,
  g45_6_0: 30,
  g45_8_0: 17,
  firma: 10,
  pingente: 5,
  trancadoAdicional: 20,
  cmv: 0.20,
  lucro: 0.40
};

const PRICES = {
  tamanho: { 45: -10, 60: 0, 75: 10, 90: 20, 120: 40 },
  pingenteExtra: 20, buzios: 20, palha: 15, entremeio: 0, firmaEspecial: 15
};

function costFios(fios, tamanho, trancado) {
  const gPorFio = (state.beadCm === 0.4 ? COST.g45_6_0 : COST.g45_8_0) * (tamanho / 45);
  const g = gPorFio * fios;
  const micanga = g / 100 * COST.micanga100g;
  const base = micanga + (COST.firma * 2) + COST.pingente;
  return base + (trancado ? COST.trancadoAdicional : 0);
}

function salePrice(custo) {
  return custo * (1 + COST.cmv + COST.lucro);
}

const FIRMA_CORES = [
  { n: 'Branca', h: '#F7F3E8' }, { n: 'Vermelha', h: '#C0392B' }, { n: 'Verde', h: '#2E7D32' },
  { n: 'Marrom', h: '#6D4C2F' }, { n: 'Amarela', h: '#E3B928' }, { n: 'Azul', h: '#2471A3' },
  { n: 'Azul-clara', h: '#7FB8D8' }, { n: 'Roxa', h: '#6C3483' }, { n: 'Rosa', h: '#E884A4' },
  { n: 'Dourada', h: '#C9A227' }, { n: 'Preta', h: '#2C2C2C' }, { n: 'Cristal', h: '#C8D6DF' }
];

/* ============ Ícones de pingentes (SVG) ============ */
const ST = 'stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"';
const g = (inner) => '<g ' + ST + '>' + inner + '</g>';

const PEND = {
  opaxoro: { name: 'Opaxorô', orixa: ['oxala'], svg: () => g('<line x1="24" y1="42" x2="24" y2="9"/><line x1="14" y1="22" x2="34" y2="22"/><line x1="14" y1="16" x2="34" y2="16"/><line x1="14" y1="28" x2="34" y2="28"/><circle cx="24" cy="6" r="2.6" fill="currentColor" stroke="none"/>') },
  pomba: { name: 'Pomba', orixa: ['oxala'], svg: () => g('<path d="M12 27c5-7 12-10 20-6-5 1-8 3-10 5 3 2 3 6 0 8-4 3-9 2-10-1-1-2-1-4 0-6z"/><path d="M25 20l8-5"/>') },
  cruz: { name: 'Cruz', orixa: ['oxala', 'obaluaie'], svg: () => g('<path d="M24 6v36M15 15h18"/>') },
  espada: { name: 'Espada', orixa: ['ogum', 'iansa'], svg: () => g('<path d="M37 9L21 27"/><path d="M33 8l4 1-1 4"/><line x1="16" y1="23" x2="26" y2="33"/><path d="M24 34l8 8" />') },
  facao: { name: 'Facão', orixa: ['ogum'], svg: () => g('<path d="M10 38c4-10 10-18 18-22 4 6 0 10-4 14-2 4-6 8-10 10z"/><line x1="10" y1="38" x2="20" y2="44"/>') },
  lanca: { name: 'Lança', orixa: ['ogum'], svg: () => g('<line x1="24" y1="8" x2="24" y2="42"/><path d="M24 8c-6 0-8 6-8 10 8 0 16 0 16 0 0-4-2-10-8-10z"/>') },
  ofa: { name: 'Ofá', orixa: ['oxossi', 'caboclo'], svg: () => g('<path d="M14 8v34c10 0 16-8 18-17-2-9-8-17-18-17z"/><line x1="12" y1="34" x2="38" y2="10"/><path d="M38 10l-6-1M38 10l-1 6"/>') },
  folha: { name: 'Folha', orixa: ['ossain', 'oxossi'], svg: () => g('<path d="M24 6c10 6 12 20 4 34-8-14-6-28-4-34z"/><line x1="24" y1="6" x2="22" y2="38"/>') },
  machado: { name: 'Machado', orixa: ['xango'], svg: () => g('<line x1="24" y1="12" x2="24" y2="42"/><path d="M8 12h16v9H8zM40 12H24v9h16z"/><path d="M8 12L24 4l16 8"/>') },
  balanca: { name: 'Balança', orixa: ['xango'], svg: () => g('<circle cx="24" cy="6" r="3"/><line x1="24" y1="9" x2="24" y2="40"/><line x1="8" y1="15" x2="40" y2="15"/><path d="M8 15l-4 12M40 15l4 12"/><path d="M2 27h6v6h-6zM42 27h-6v6h6z"/>') },
  chave: { name: 'Chave', orixa: ['nana', 'xango'], svg: () => g('<circle cx="17" cy="17" r="8"/><line x1="23" y1="23" x2="39" y2="39"/><line x1="30" y1="30" x2="37" y2="30"/><line x1="34" y1="34" x2="38" y2="34"/>') },
  raio: { name: 'Raio', orixa: ['iansa'], svg: () => g('<path d="M27 6L14 26h8l-6 16 18-24h-8l6-12z"/>') },
  ventarola: { name: 'Ventarola', orixa: ['iansa'], svg: () => g('<path d="M12 34h24c0-10-8-18-18-20-4 2-6 10-6 20z"/><line x1="15" y1="34" x2="22" y2="17"/><line x1="24" y1="34" x2="24" y2="15"/><line x1="33" y1="34" x2="27" y2="17"/>') },
  abebe: { name: 'Abebé', orixa: ['oxum', 'iemanja'], svg: () => g('<circle cx="24" cy="23" r="14"/><circle cx="24" cy="23" r="9"/><path d="M24 27c-1-3-6-3-6-6 0-2 3-3 3-3s3 1 3 3c0-2 3-3 3-3s3 1 3 3c0 3-5 3-6 6z" fill="currentColor" stroke="none"/>') },
  peixe: { name: 'Peixe', orixa: ['oxum', 'iemanja'], svg: () => g('<path d="M10 24c6-8 16-10 24-6v12c-8 4-18 2-24-6z"/><path d="M36 18c4-6 8-6 8-6 0 4-2 8-6 12 4 4 6 8 6 12 0 0-4 0-8-6z"/><circle cx="18" cy="23" r="1.4" fill="currentColor" stroke="none"/>') },
  coracao: { name: 'Coração', orixa: ['oxum'], svg: () => g('<path d="M24 40c-2-8-14-9-14-17 0-5 5-8 9-8 3 0 5 2 5 2s2-2 5-2c4 0 9 3 9 8 0 8-12 9-14 17z"/>') },
  estrela: { name: 'Estrela', orixa: ['iemanja', 'eres'], svg: () => g('<path d="M24 4l5 12h12l-9 8 4 13-12-7-12 7 4-13-9-8h12z"/>') },
  ancora: { name: 'Âncora', orixa: ['iemanja', 'marinheiro'], svg: () => g('<circle cx="24" cy="8" r="3"/><line x1="24" y1="11" x2="24" y2="36"/><line x1="14" y1="28" x2="34" y2="28"/><path d="M24 36c-8 0-10-8-8-12 3-1 6-1 8 1M24 36c8 0 10-8 8-12-3-1-6-1-8 1"/>') },
  concha: { name: 'Concha', orixa: ['iemanja'], svg: () => g('<path d="M12 12c12 2 20 10 20 24-10 2-20-4-24-14 2-4 4-8 4-10z"/><path d="M16 14c6 6 8 14 4 22M22 12c8 6 10 16 4 24"/>') },
  ondas: { name: 'Ondas', orixa: ['iemanja', 'marinheiro'], svg: () => g('<path d="M8 18c4-4 8-4 12 0s8 4 12 0 8-4 12 0M8 26c4-4 8-4 12 0s8 4 12 0 8-4 12 0M8 34c4-4 8-4 12 0s8 4 12 0 8-4 12 0"/>') },
  tridente: { name: 'Tridente', orixa: ['exu'], svg: () => g('<line x1="14" y1="8" x2="14" y2="18"/><line x1="34" y1="8" x2="34" y2="18"/><line x1="24" y1="16" x2="24" y2="42"/><line x1="10" y1="18" x2="38" y2="18"/><path d="M20 7h8M19 3h10"/>') },
  garfo: { name: 'Garfo', orixa: ['pombagira'], svg: () => g('<path d="M16 10v14M24 10v14M32 10v14M16 24h16"/><path d="M16 24l-3 14M24 24v14M32 24l3 14"/>') },
  cachimbo: { name: 'Cachimbo', orixa: ['pretovelho'], svg: () => g('<circle cx="16" cy="34" r="8"/><path d="M22 30l16-6"/><path d="M38 24l2-5"/>') },
  rosario: { name: 'Rosário', orixa: ['pretovelho'], svg: () => g('<circle cx="24" cy="24" r="13"/><path d="M24 8v5M24 35v5M8 24h5M35 24h5"/><circle cx="24" cy="24" r="1.8" fill="currentColor" stroke="none"/>') },
  figa: { name: 'Figa', orixa: ['pretovelho', 'cigano'], svg: () => g('<path d="M14 34c0-9 5-17 11-23 4 1 6 4 6 8 2 2 3 5 3 8 0 5-3 9-8 10-4 1-9 0-12-3z"/><path d="M31 21l10-6"/>') },
  moeda: { name: 'Moeda', orixa: ['cigano'], svg: () => g('<circle cx="24" cy="24" r="14"/><circle cx="24" cy="24" r="9"/><path d="M24 20l3 5h-6z"/>') },
  taca: { name: 'Taça', orixa: ['cigano'], svg: () => g('<path d="M14 8h20l-3 10H17z"/><line x1="14" y1="8" x2="34" y2="8"/><line x1="24" y1="18" x2="24" y2="34"/><path d="M15 40h18l-2-6H17z"/>') },
  trevo: { name: 'Trevo', orixa: ['cigano'], svg: () => g('<circle cx="14" cy="16" r="7"/><circle cx="28" cy="21" r="7"/><circle cx="18" cy="27" r="7"/><path d="M21 32v12"/>') },
  cruzeiro: { name: 'Cruzeiro', orixa: ['obaluaie'], svg: () => g('<path d="M24 6v30M16 12h16M16 24h16"/><line x1="12" y1="38" x2="36" y2="38"/><line x1="8" y1="43" x2="40" y2="43"/>') },
  arcoiris: { name: 'Arco-íris', orixa: ['oxumare'], svg: () => g('<path d="M8 34c0-16 12-26 28-26M12 38c0-12 9-20 24-20M16 42c0-9 7-15 18-15"/>') },
  cobra: { name: 'Cobra', orixa: ['oxumare'], svg: () => g('<path d="M8 30c6-8 12-8 14-2s4 8 10 4c4-3 4-10 8-16"/><circle cx="41" cy="15" r="3"/><circle cx="41" cy="15" r="1" fill="currentColor" stroke="none"/>') },
  laco: { name: 'Laço', orixa: ['boiadeiro'], svg: () => g('<circle cx="24" cy="24" r="14"/><path d="M24 10c0-5 5-6 6-2M24 10h6"/><path d="M30 8l-9-6"/>') },
  chapeu: { name: 'Chapéu', orixa: ['baiano', 'malandro'], svg: () => g('<path d="M10 28h28M14 28c0-8 3-12 8-12s8 4 8 12z"/><path d="M14 24h20"/>') },
  bengala: { name: 'Bengala', orixa: ['malandro'], svg: () => g('<path d="M26 42V16c0-4-3-6-7-6"/><circle cx="18" cy="10" r="2.2"/>') },
  sino: { name: 'Sino', orixa: ['cigano', 'eres'], svg: () => g('<path d="M14 20c0-8 4-14 10-14s10 6 10 14c0 6-2 10-2 12H16c0-2-2-6-2-12z"/><circle cx="24" cy="36" r="2.4"/><line x1="15" y1="34" x2="33" y2="34"/>') }
};

/* ============ Ícones de pontos riscados (firmas) ============ */
const PG = 'stroke="currentColor" stroke-width="1.9" fill="none" stroke-linecap="round" stroke-linejoin="round"';
const pt = (inner) => '<g ' + PG + '>' + inner + '</g>';

const FIRMAS_SYMBOLS = [
  { id: 'oxala', name: 'Cruz e sol', orixa: 'Oxalá', svg: () => pt('<circle cx="24" cy="24" r="15"/><path d="M24 12v24M14 21h20"/><path d="M24 7v4M24 37v4M7 24h4M37 24h4"/>') },
  { id: 'ogum', name: 'Espada', orixa: 'Ogum', svg: () => pt('<circle cx="24" cy="24" r="15"/><path d="M33 12L17 34"/><path d="M12 16l11 10"/><circle cx="35" cy="11" r="2" fill="currentColor" stroke="none"/>') },
  { id: 'oxossi', name: 'Ofá', orixa: 'Oxóssi', svg: () => pt('<circle cx="24" cy="24" r="15"/><path d="M12 20c8 0 13 4 13 10 0-6 5-10 13-10"/><path d="M20 32l10-12"/><path d="M28 20h4M28 20l1 4"/>') },
  { id: 'xango', name: 'Machado e Salomão', orixa: 'Xangô', svg: () => pt('<circle cx="24" cy="24" r="15"/><path d="M24 7l9 9-9 9-9-9zM24 23l9 9-9 9-9-9z"/><path d="M24 12v24"/><path d="M24 12l-6 6 6 6 6-6z"/>') },
  { id: 'iansa', name: 'Raio e lua', orixa: 'Iansã', svg: () => pt('<circle cx="24" cy="24" r="15"/><path d="M25 12l-8 12h7l-5 12 13-16h-7l6-8z"/><path d="M34 10c4 4 4 9 0 13"/>') },
  { id: 'oxum', name: 'Coração e meia-lua', orixa: 'Oxum', svg: () => pt('<circle cx="24" cy="24" r="15"/><path d="M24 31c-2-5-8-6-8-10 0-3 3-4 5-4 2 0 3 1 3 1s1-1 3-1c2 0 5 1 5 4 0 4-6 5-8 10z"/><path d="M35 12c-4 3-6 7-7 11"/>') },
  { id: 'iemanja', name: 'Estrela e ondas', orixa: 'Iemanjá', svg: () => pt('<circle cx="24" cy="24" r="15"/><path d="M24 14l3 6h6l-5 4 2 6-6-4-6 4 2-6-5-4h6z" fill="currentColor" stroke="none" opacity=".85"/><path d="M12 35c3-2 6-2 9 0s6 2 9 0"/>') },
  { id: 'nana', name: 'Chuva e coração', orixa: 'Nanã', svg: () => pt('<circle cx="24" cy="24" r="15"/><path d="M13 14v14M18 16v12M22 14v14"/><path d="M31 30c-1-3-5-3-5-6 0-2 3-2 3-2s2 1 2 2c0-1 2-2 2-2s3 0 3 2c0 3-4 3-5 6z" fill="currentColor" stroke="none"/>') },
  { id: 'obaluaie', name: 'Cruzeiro das almas', orixa: 'Obaluaiê', svg: () => pt('<circle cx="24" cy="24" r="15"/><path d="M24 10v26M16 15h16M16 24h16"/><circle cx="16" cy="15" r="1.5" fill="currentColor" stroke="none"/><circle cx="32" cy="15" r="1.5" fill="currentColor" stroke="none"/><circle cx="16" cy="24" r="1.5" fill="currentColor" stroke="none"/><circle cx="32" cy="24" r="1.5" fill="currentColor" stroke="none"/><path d="M24 36l-6 4M24 36l6 4"/>') },
  { id: 'oxumare', name: 'Arco-íris', orixa: 'Oxumarê', svg: () => pt('<circle cx="24" cy="24" r="15"/><path d="M14 31c0-9 5-15 12-15M17 35c0-6 4-10 9-10M20 39c0-4 3-7 7-7"/>') },
  { id: 'exu', name: 'Tridente e encruzilhada', orixa: 'Exu', svg: () => pt('<circle cx="24" cy="24" r="15"/><path d="M24 12v16M17 12h14M15 12v6M24 12v6M33 12v6M15 18h18"/><path d="M24 28l-6 8M24 28l6 8"/>') },
  { id: 'pombagira', name: 'Garfo', orixa: 'Pombagira', svg: () => pt('<circle cx="24" cy="24" r="15"/><path d="M16 10v16M24 10v16M32 10v16M16 26h16"/><path d="M16 26l-3 12M24 26v12M32 26l3 12"/><path d="M34 8c-4 4-4 8-2 12M36 20c-2 3-2 5-1 7"/>') },
  { id: 'pretovelho', name: 'Cachimbo e rosário', orixa: 'Pretos Velhos', svg: () => pt('<circle cx="24" cy="24" r="15"/><circle cx="16" cy="31" r="5"/><path d="M20 29l11-7"/><circle cx="33" cy="20" r="1.5" fill="currentColor" stroke="none"/><circle cx="36" cy="14" r="1.5" fill="currentColor" stroke="none"/><circle cx="31" cy="12" r="1.5" fill="currentColor" stroke="none"/>') },
  { id: 'ossain', name: 'Folha', orixa: 'Ossain', svg: () => pt('<circle cx="24" cy="24" r="15"/><path d="M24 12c7 4 9 12 4 20-6-9-5-16-4-20z"/><path d="M24 12l-3 20"/><path d="M24 22l6 4M24 16l6 3"/>') },
  { id: 'baiano', name: 'Chapéu e folha', orixa: 'Baianos', svg: () => pt('<circle cx="24" cy="24" r="15"/><path d="M13 22h22M16 22c0-4 3-6 8-6s8 2 8 6z"/><path d="M16 22c0 6 4 10 8 12"/><path d="M24 30l5 6"/>') },
  { id: 'caboclo', name: 'Flecha', orixa: 'Caboclos', svg: () => pt('<circle cx="24" cy="24" r="15"/><path d="M12 14v18c3 0 5-1 6-4 1 3 3 4 6 4"/><path d="M24 28v-8"/><path d="M20 24l4-4 4 4"/>') },
  { id: 'marinheiro', name: 'Âncora e ondas', orixa: 'Marinheiros', svg: () => pt('<circle cx="24" cy="24" r="15"/><circle cx="24" cy="14" r="2.2"/><path d="M24 16v20M18 24h12"/><path d="M24 36c-5 0-7-4-6-7M24 36c5 0 7-4 6-7"/>') },
  { id: 'cigano', name: 'Taça e moeda', orixa: 'Ciganos', svg: () => pt('<circle cx="24" cy="24" r="15"/><path d="M15 12h10l-2 8h-6z"/><path d="M18 20v5M22 20v5"/><path d="M15 25h12"/><circle cx="31" cy="16" r="4"/><circle cx="31" cy="16" r="1.8"/>') },
  { id: 'boiadeiro', name: 'Laço', orixa: 'Boiadeiros', svg: () => pt('<circle cx="24" cy="24" r="15"/><circle cx="24" cy="24" r="9"/><path d="M24 15c0-5 5-6 6-2M24 15h6"/><path d="M30 13l-9-6"/>') },
  { id: 'malandro', name: 'Bengala e cartola', orixa: 'Malandros', svg: () => pt('<circle cx="24" cy="24" r="15"/><path d="M22 38V22c0-3-2-4-5-4"/><circle cx="17" cy="18" r="1.6" fill="currentColor" stroke="none"/><path d="M14 12h18M16 12c0-4 4-4 4-4s4 0 4 4"/>') },
  { id: 'eres', name: 'Estrela e balões', orixa: 'Erês', svg: () => pt('<circle cx="24" cy="24" r="15"/><path d="M24 13l2 5h5l-4 3 2 5-5-3-5 3 2-5-4-3h5z" fill="currentColor" stroke="none" opacity=".85"/><circle cx="16" cy="33" r="3"/><circle cx="31" cy="34" r="3"/><path d="M16 36l-4 4M31 37l-4 4"/>') }
];

/* ============ Estado ============ */
const state = {
  orixa: 'oxala',
  colorMode: 'recomendadas',
  colors: ORIXAS[0].cores.map(c => ({ ...c })),
  custom: [],
  fios: 1,
  trancado: false,
  tamanho: 60,
  beadCm: 0.4,
  firma: '#F7F3E8',
  firmaType: 'lisa',
  pend1: 'opaxoro',
  pend2: null,
  showPend2: false,
  buzios: false,
  palha: false,
  entremeio: false
};

const orixaOf = (id) => ORIXAS.find(o => o.id === id);
const curColors = () => (state.colorMode === 'personalizar' ? state.custom : state.colors);
const firmaName = (hex) => { const f = FIRMA_CORES.find(c => c.h.toLowerCase() === hex.toLowerCase()); return f ? f.n : 'Personalizada'; };

/* ============ Render: paleta de cores ============ */
function renderPaleta() {
  const wrap = $('#orixa-cards');
  wrap.innerHTML = '';
  for (const gName of GROUP_ORDER) {
    const list = ORIXAS.filter(o => o.group === gName);
    for (const o of list) {
      const beads = o.cores.map(c => beadEl(c.h)).join('');
      const div = document.createElement('article');
      div.className = 'orixa-card reveal';
      div.innerHTML =
        '<div class="orixa-beads">' + beads + '</div>' +
        '<h3>' + o.name + '</h3>' +
        '<p class="orixa-group">' + o.group + '</p>' +
        '<p class="orixa-cor"><strong>Cor:</strong> ' + o.cor + ' · <strong>Elemento:</strong> ' + o.element + '</p>' +
        '<p class="orixa-meaning">' + o.meaning + '</p>' +
        '<p class="orixa-saudacao">' + o.saudacao + '</p>';
      wrap.appendChild(div);
    }
  }
}

/* ============ Render: seletor de Orixá ============ */
function renderOrixaGrid() {
  const grid = $('#orixa-grid');
  grid.innerHTML = '';
  for (const o of ORIXAS) {
    const label = document.createElement('label');
    label.className = 'orixa-opt' + (o.id === state.orixa ? ' selected' : '');
    const dot = beadEl(o.cores[0].h);
    label.innerHTML =
      '<input type="radio" name="orixa" value="' + o.id + '" style="position:absolute;opacity:0" ' + (o.id === state.orixa ? 'checked' : '') + '>' +
      dot + '<b>' + o.name + '</b><span>' + o.group.split(' ')[0] + '</span>';
    label.addEventListener('click', () => selectOrixa(o.id));
    grid.appendChild(label);
  }
}

function selectOrixa(id) {
  state.orixa = id;
  const o = orixaOf(id);
  if (state.colorMode === 'recomendadas') {
    state.colors = o.cores.map(c => ({ ...c }));
  } else {
    state.custom = o.cores.map(c => ({ ...c }));
  }
  state.firma = o.firma;
  state.pend1 = o.pendant;
  state.pend2 = null;
  state.showPend2 = false;
  $('#second-pendant-toggle').checked = false;
  $('#second-pendant-wrap').hidden = true;
  renderOrixaGrid();
  renderColorArea();
  renderFirmaColors();
  renderPingenteGrids();
  refresh();
}

/* ============ Render: cores ============ */
function renderColorArea() {
  const rec = $('#cores-recomendadas');
  const per = $('#cores-personalizar');

  if (state.colorMode === 'recomendadas') {
    rec.hidden = false;
    per.hidden = true;
    renderColorItems(rec, state.colors, 'colors');
  } else {
    rec.hidden = true;
    per.hidden = false;
    renderPaletteChips();
    renderColorItems($('#custom-color-list'), state.custom, 'custom');
  }
}

function renderColorItems(wrap, arr, mode) {
  wrap.innerHTML = '';
  arr.forEach((c, i) => {
    const item = document.createElement('div');
    item.className = 'color-item';
    item.innerHTML =
      beadEl(c.h) +
      '<div><div class="ci-name">' + c.n + '</div><div class="ci-weight">Proporção: <strong>' + c.w + '%</strong></div></div>' +
      '<div style="display:flex;align-items:center;gap:10px">' +
      '<input type="range" min="1" max="100" value="' + c.w + '" aria-label="Proporção de ' + c.n + '">' +
      (mode === 'custom' ? '<button class="ci-del" type="button" aria-label="Remover ' + c.n + '">&times;</button>' : '') +
      '</div>';
    const range = $('input[type=range]', item);
    range.addEventListener('input', () => {
      c.w = parseInt(range.value, 10);
      $('.ci-weight', item).innerHTML = 'Proporção: <strong>' + c.w + '%</strong>';
      refresh();
    });
    if (mode === 'custom') {
      const del = $('.ci-del', item);
      del.addEventListener('click', () => {
        if (state.custom.length <= 1) return;
        state.custom.splice(i, 1);
        renderColorArea();
        refresh();
      });
    }
    wrap.appendChild(item);
  });
}

function renderPaletteChips() {
  const chips = $('#palette-chips');
  chips.innerHTML = '';
  const used = new Set(state.custom.map(c => c.h.toLowerCase()));
  for (const c of PALETA) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'chip' + (used.has(c.h.toLowerCase()) ? ' used' : '');
    btn.innerHTML = beadEl(c.h, 'sm') + c.n;
    btn.disabled = used.has(c.h.toLowerCase());
    btn.addEventListener('click', () => {
      if (used.has(c.h.toLowerCase())) return;
      state.custom.push({ n: c.n, h: c.h, w: 34 });
      renderColorArea();
      refresh();
    });
    chips.appendChild(btn);
  }
  const count = state.custom.length;
  $('#color-count').textContent = count + (count === 1 ? ' cor selecionada' : ' cores selecionadas');
}

/* ============ Render: firma ============ */
function renderFirmaColors() {
  const wrap = $('#firma-colors');
  wrap.innerHTML = '';
  for (const f of FIRMA_CORES) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'chip' + (state.firma.toLowerCase() === f.h.toLowerCase() ? ' active' : '');
    btn.innerHTML = beadEl(f.h, 'sm') + f.n;
    btn.addEventListener('click', () => {
      state.firma = f.h;
      renderFirmaColors();
      refresh();
    });
    wrap.appendChild(btn);
  }
}

/* ============ Render: pingentes ============ */
function pendantsFor(orixaId) {
  const direct = Object.entries(PEND).filter(([id, p]) => p.orixa.includes(orixaId)).map(([id]) => id);
  if (direct.length) return direct;
  return Object.keys(PEND);
}

function renderPingenteGrids() {
  renderPingenteGrid('#pingente-grid', 'pend1');
  renderPingenteGrid('#pingente-grid-2', 'pend2');
}

function renderPingenteGrid(sel, key) {
  const wrap = $(sel);
  wrap.innerHTML = '';
  for (const id of pendantsFor(state.orixa)) {
    const p = PEND[id];
    const opt = document.createElement('div');
    opt.className = 'pingente-opt' + (state[key] === id ? ' selected' : '');
    opt.innerHTML = pendMedia(id, p) + '<b>' + p.name + '</b>';
    opt.addEventListener('click', () => {
      if (key === 'pend1') { state.pend1 = id; }
      else { state.pend2 = (state.pend2 === id ? null : id); }
      renderPingenteGrids();
      refresh();
    });
    wrap.appendChild(opt);
  }
}

function pendMedia(id, p) {
  return '<span class="pend-media">' +
    '<img class="pend-img" src="assets/pingentes/' + id + '.png" alt="' + p.name + '" loading="lazy" onerror="this.style.display=\'none\';this.parentNode.querySelector(\'.pend-fallback\').style.display=\'\';">' +
    '<span class="pend-fallback" style="color:#A8852A;display:none">' + p.svg() + '</span>' +
    '</span>';
}

function renderPingenteGaleria() {
  const wrap = $('#pingente-galeria');
  wrap.innerHTML = '';
  for (const [id, p] of Object.entries(PEND)) {
    const o = orixaOf(p.orixa[0]);
    const card = document.createElement('div');
    card.className = 'pg-card reveal';
    card.innerHTML =
      pendMedia(id, p) +
      '<b>' + p.name + '</b><span>' + (o ? o.name : '') + '</span><em>+R$20 extra</em>';
    card.addEventListener('click', () => {
      selectOrixa(p.orixa[0]);
      state.pend1 = id;
      state.pend2 = null;
      state.showPend2 = false;
      $('#second-pendant-toggle').checked = false;
      $('#second-pendant-wrap').hidden = true;
      renderPingenteGrids();
      refresh();
      document.getElementById('criar').scrollIntoView({ behavior: 'smooth' });
    });
    wrap.appendChild(card);
  }
}

/* ============ Render: firmas (pontos riscados) ============ */
function renderFirmas() {
  const wrap = $('#firmas-grid');
  wrap.innerHTML = '';
  for (const s of FIRMAS_SYMBOLS) {
    const item = document.createElement('div');
    item.className = 'firma-item reveal';
    item.innerHTML =
      '<div class="firma-disc" style="color:#EFE3C6">' +
      '<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' + s.svg() + '</svg>' +
      '</div>' +
      '<h4>' + s.name + '</h4><span>' + s.orixa + '</span>';
    wrap.appendChild(item);
  }
}

/* ============ Render: preços ============ */
function renderPrecos() {
  const wrap = $('#preco-grid');
  const cards = [
    { t: '1 fio', v: 'R$ ' + Math.round(salePrice(costFios(1, 60, false))).toLocaleString('pt-BR'), d: 'Guia de uma linha de contas' },
    { t: '2 fios', v: 'R$ ' + Math.round(salePrice(costFios(2, 60, false))).toLocaleString('pt-BR'), d: 'Dois fios de contas' },
    { t: '3 fios', v: 'R$ ' + Math.round(salePrice(costFios(3, 60, false))).toLocaleString('pt-BR'), d: 'Três fios de contas' },
    { t: '3 fios trançados', v: 'R$ ' + Math.round(salePrice(costFios(3, 60, true))).toLocaleString('pt-BR'), d: 'Três fios entrelaçados', feat: true }
  ];
  wrap.innerHTML = '';
  for (const c of cards) {
    const div = document.createElement('div');
    div.className = 'preco-card reveal' + (c.feat ? ' feat' : '');
    div.innerHTML = '<h3>' + c.t + '</h3><div class="pc-valor">' + c.v + '</div><p>' + c.d + '</p>';
    wrap.appendChild(div);
  }
  const extra = document.createElement('div');
  extra.className = 'preco-card reveal';
  extra.innerHTML =
    '<h3>Tamanhos e extras</h3><p style="text-align:left">' +
    '45 cm −10% · 60 cm (base) · 75 cm +10% · 90 cm +20% · 120 cm +40%<br>' +
    'Pingente extra +R$20 · Búzios +R$20 · Palha da costa +R$15 · Firma especial +R$15</p>';
  wrap.appendChild(extra);
}

/* ============ Preview ============ */
function quadPoint(p0, p1, p2, t) {
  const a = (1 - t) * (1 - t), b = 2 * (1 - t) * t, c = t * t;
  return { x: a * p0[0] + b * p1[0] + c * p2[0], y: a * p0[1] + b * p1[1] + c * p2[1] };
}

function arcLut(p0, p1, p2, samples) {
  const lut = [];
  let cum = 0, prev = quadPoint(p0, p1, p2, 0);
  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const p = quadPoint(p0, p1, p2, t);
    if (i > 0) cum += Math.hypot(p.x - prev.x, p.y - prev.y);
    lut.push({ t, l: cum, x: p.x, y: p.y });
    prev = p;
  }
  return lut;
}

function pointAtFrac(lut, frac) {
  const target = frac * lut[lut.length - 1].l;
  let lo = 0, hi = lut.length - 1;
  while (lo < hi) { const m = (lo + hi) >> 1; if (lut[m].l < target) lo = m + 1; else hi = m; }
  return lut[lo];
}

function colorSeq(n) {
  const BLOCK = 7;
  const colors = curColors();
  if (!colors.length) return [];
  const weights = colors.map(c => Math.max(c.w, 1));
  const tot = weights.reduce((a, b) => a + b, 0);
  const nb = Math.max(1, Math.floor(n / BLOCK));
  const seq = [];

  const alloc = colors.map((c, i) => Math.floor(nb * weights[i] / tot));
  let rem = nb - alloc.reduce((a, b) => a + b, 0);
  const frac = weights.map((w, i) => (w * nb) / tot - Math.floor((w * nb) / tot));
  const order = weights.map((w, i) => i).sort((a, b) => frac[b] - frac[a]);
  for (let i = 0; i < rem; i++) alloc[order[i % order.length]]++;

  const err = alloc.map(() => 0);
  for (let b = 0; b < nb; b++) {
    let best = 0;
    for (let i = 0; i < alloc.length; i++) {
      err[i] += alloc[i];
      if (err[i] > err[best]) best = i;
    }
    err[best] -= nb;
    for (let k = 0; k < BLOCK; k++) seq.push(best);
  }

  const rest = n - seq.length;
  for (let k = 0; k < rest; k++) seq.push(k % colors.length);
  return seq;
}

function beadSVG(x, y, r, hex) {
  return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + hex + '" stroke="' + shade(hex, .55) + '" stroke-width="1"/>' +
    '<circle cx="' + (x - r * .32) + '" cy="' + (y - r * .38) + '" r="' + (r * .42) + '" fill="#fff" opacity=".5"/>';
}

function firmaSVG(x, y, r, hex, type) {
  const inner = '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="url(#firma-' + type + ')" stroke="#C9A227" stroke-width="2.4"/>' +
    '<circle cx="' + x + '" cy="' + y + '" r="' + (r - 2.6) + '" fill="none" stroke="#E4C66B" stroke-width="0.8"/>';
  if (type === 'olho') {
    return inner + '<circle cx="' + x + '" cy="' + y + '" r="' + (r * .28) + '" fill="#3A2416" stroke="#E4C66B" stroke-width="1"/>' +
      '<circle cx="' + (x - r * .08) + '" cy="' + (y - r * .08) + '" r="' + (r * .07) + '" fill="#fff"/>';
  }
  return inner;
}

function shellSVG(x, y, r) {
  return '<g transform="translate(' + x + ',' + y + ') scale(' + (r / 8) + ')" fill="#EFE3C6" stroke="#A8852A" stroke-width="1.4">' +
    '<path d="M-6 2C-4-5 2-8 7-5c3 6-1 10-7 12-6-2-8-7-6-9z"/><path d="M-3-1c3 2 4 6 2 9M0-3c4 2 5 7 2 10"/></g>';
}

function renderPreview() {
  const colors = curColors();
  const wrap = $('#preview-svg');
  const W = 400, H = 300;
  const beadR = state.beadCm === 0.4 ? 7.5 : 6.2;
  const firmaR = beadR * 1.85;
  const fios = state.fios;
  const mid = (fios - 1) / 2;
  const perFio = Math.min(Math.round((state.tamanho * 1.9) / state.beadCm), 78);
  const n = Math.max(24, perFio);
  const seq = colorSeq(n);

  const firmaColors = { lisa: state.firma, listrada: state.firma, aurora: state.firma, olho: state.firma };
  const defs =
    '<defs>' +
    '<radialGradient id="firma-lisa" cx="32%" cy="30%"><stop offset="0%" stop-color="#fff" stop-opacity=".95"/><stop offset="45%" stop-color="' + state.firma + '"/><stop offset="100%" stop-color="' + shade(state.firma, .55) + '"/></radialGradient>' +
    '<linearGradient id="firma-listrada" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="' + state.firma + '"/><stop offset="30%" stop-color="#fff"/><stop offset="50%" stop-color="' + state.firma + '"/><stop offset="70%" stop-color="#fff"/><stop offset="100%" stop-color="' + state.firma + '"/></linearGradient>' +
    '<radialGradient id="firma-aurora" cx="35%" cy="30%"><stop offset="0%" stop-color="#F6D97B"/><stop offset="45%" stop-color="#C96BB0"/><stop offset="100%" stop-color="#5A7BD8"/></radialGradient>' +
    '<radialGradient id="firma-olho" cx="35%" cy="30%"><stop offset="0%" stop-color="#fff"/><stop offset="40%" stop-color="#5A3A22"/><stop offset="100%" stop-color="#2A1A0F"/></radialGradient>' +
    '</defs>';

  const strands = [];
  for (let i = 0; i < fios; i++) strands.push(i);
  const order = strands.slice().sort((a, b) => Math.abs(a - mid) - Math.abs(b - mid));

  const out = [];
  out.push('<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">' + defs);

  for (const s of order) {
    const off = (s - mid) * 13;
    const p0 = [46, 66 + off], p1 = [200, 248 + off], p2 = [354, 66 + off];
    const lut = arcLut(p0, p1, p2, 240);
    for (let k = 0; k < n; k++) {
      const frac = k / (n - 1);
      const ptB = pointAtFrac(lut, frac);
      const ci = seq[k];
      const c = colors[ci];
      const isEnd = k === 0 || k === n - 1;
      const isCenter = k === Math.round(n / 2) && s === mid;
      const isShell = state.buzios && ((k + Math.floor(n / 5) * (s % 3)) % Math.floor(n / 5) === 0) && !isEnd && !isCenter;
      if (isShell) {
        out.push(shellSVG(ptB.x, ptB.y, beadR * 1.15));
      } else if (isEnd || isCenter) {
        out.push(firmaSVG(ptB.x, ptB.y, firmaR, firmaColors[state.firmaType], state.firmaType));
      } else if (state.entremeio && k > 0 && seq[k] !== seq[k - 1]) {
        out.push(beadSVG(ptB.x, ptB.y, beadR * .72, '#E4C66B'));
      } else {
        out.push(beadSVG(ptB.x, ptB.y, beadR, c.h));
      }
    }
  }

  const midPoint = pointAtFrac(arcLut([46, 66], [200, 248], [354, 66], 240), 0.5);
  out.push('<line x1="' + midPoint.x + '" y1="' + midPoint.y + '" x2="' + midPoint.x + '" y2="' + (midPoint.y + 14) + '" stroke="#C9A227" stroke-width="1.6"/>');

  const pendScale = 0.9;
  out.push('<g transform="translate(' + (midPoint.x - 24 * pendScale) + ',' + (midPoint.y + 14) + ') scale(' + pendScale + ')" style="color:#E4C66B">' + (PEND[state.pend1] ? PEND[state.pend1].svg() : '') + '</g>');

  if (state.showPend2 && state.pend2) {
    const lutL = arcLut([46, 66], [200, 248], [354, 66], 240);
    const pL = pointAtFrac(lutL, 0.38);
    const pR = pointAtFrac(lutL, 0.62);
    out.push('<g transform="translate(' + (pL.x - 19) + ',' + (pL.y + 22) + ') scale(0.8)" style="color:#E4C66B">' + (PEND[state.pend2] ? PEND[state.pend2].svg() : '') + '</g>');
    out.push('<g transform="translate(' + (pR.x - 19) + ',' + (pR.y + 22) + ') scale(0.8)" style="color:#E4C66B">' + (PEND[state.pend2] ? PEND[state.pend2].svg() : '') + '</g>');
  }

  out.push('</svg>');
  wrap.innerHTML = out.join('');
}

/* ============ Resumo e preço ============ */
function computeCost() {
  const custo = costFios(state.fios, state.tamanho, state.trancado);
  let extras = 0;
  if (state.showPend2 && state.pend2) extras += PRICES.pingenteExtra;
  if (state.buzios) extras += PRICES.buzios;
  if (state.palha) extras += PRICES.palha;
  if (state.firmaType !== 'lisa') extras += PRICES.firmaEspecial;
  return custo + extras;
}

function computePrice() {
  return salePrice(computeCost());
}

function renderResumo() {
  const o = orixaOf(state.orixa);
  const colors = curColors();
  const list = $('#resumo-lista');
  const lines = [];
  lines.push('<li><b>Orixá/Linha:</b> ' + o.name + '</li>');
  lines.push('<li><b>Cores:</b> ' + colors.map(c => c.n + ' (' + c.w + '%)').join(', ') + '</li>');
  lines.push('<li><b>Fios:</b> ' + state.fios + (state.trancado ? ' trançados' : '') + ' · <b>Tamanho:</b> ' + state.tamanho + ' cm · <b>Miçanga:</b> ' + (state.beadCm === 0.4 ? '6/0 (4mm)' : '8/0 (3mm)') + '</li>');
  const ft = { lisa: 'lisa', listrada: 'listrada', aurora: 'aurora', olho: 'olho de boi' };
  lines.push('<li><b>Firma:</b> ' + firmaName(state.firma) + ' (' + ft[state.firmaType] + ')</li>');
  const pends = [PEND[state.pend1] ? PEND[state.pend1].name : ''];
  if (state.showPend2 && state.pend2 && PEND[state.pend2]) pends.push(PEND[state.pend2].name);
  lines.push('<li><b>Pingentes:</b> ' + pends.join(' e ') + '</li>');
  const extras = [];
  if (state.buzios) extras.push('Búzios');
  if (state.palha) extras.push('Palha da costa');
  if (state.entremeio) extras.push('Entremeios dourados');
  lines.push('<li><b>Extras:</b> ' + (extras.length ? extras.join(', ') : 'nenhum') + '</li>');
  list.innerHTML = lines.join('');

  const perFio = Math.round(state.tamanho / state.beadCm);
  $('#contagem').innerHTML = 'Cerca de <strong>' + perFio + '</strong> contas por fio · total aproximado <strong>' + (perFio * state.fios) + '</strong> contas';
  $('#preco').innerHTML =
    'R$ ' + computePrice().toLocaleString('pt-BR') +
    '<small>preço estimado — confirmado no WhatsApp</small>';
}

function buildMessage() {
  const o = orixaOf(state.orixa);
  const colors = curColors();
  const ft = { lisa: 'lisa', listrada: 'listrada', aurora: 'aurora', olho: 'olho de boi' };
  const pends = [PEND[state.pend1] ? PEND[state.pend1].name : ''];
  if (state.showPend2 && state.pend2 && PEND[state.pend2]) pends.push(PEND[state.pend2].name);
  const extras = [];
  if (state.buzios) extras.push('búzios');
  if (state.palha) extras.push('palha da costa');
  if (state.entremeio) extras.push('entremeios dourados');
  const msg =
    'Olá, Axé de Orum! Gostaria de fazer um pedido:\n\n' +
    'Guia de: ' + o.name + '\n' +
    'Cores: ' + colors.map(c => c.n + ' (' + c.w + '%)').join(', ') + '\n' +
    'Fios: ' + state.fios + (state.trancado ? ' trançado(s)' : ' fio(s)') + ' | ' + state.tamanho + ' cm | miçanga ' + (state.beadCm === 0.4 ? '6/0 (4mm)' : '8/0 (3mm)') + '\n' +
    'Firma: ' + firmaName(state.firma) + ' (' + ft[state.firmaType] + ')\n' +
    'Pingentes: ' + pends.join(' e ') + '\n' +
    'Extras: ' + (extras.length ? extras.join(', ') : 'nenhum') + '\n' +
    'Preço estimado: R$ ' + computePrice().toLocaleString('pt-BR') + '\n' +
    (state.obs && state.obs.trim() ? 'Recado: ' + state.obs.trim() + '\n' : '') +
    '\nObrigado(a) e Axé!';
  return msg;
}

function updateWa() {
  const url = 'https://wa.me/5513997781447?text=' + encodeURIComponent(buildMessage());
  $('#wa-btn').setAttribute('href', url);
}

function refresh() {
  renderPreview();
  renderResumo();
  updateWa();
}

function syncTrancadoToggle() {
  const toggle = $('#trancado-toggle');
  const wrap = $('#trancado-wrap');
  if (!toggle) return;
  if (state.fios === 3) {
    wrap.hidden = false;
  } else {
    wrap.hidden = true;
    toggle.checked = false;
    state.trancado = false;
  }
}

/* ============ Beads divisor (hero) ============ */
function renderHeroBeads() {
  const wrap = $('#hero-beads');
  const seven = ['#F7F3E8', '#C0392B', '#2E7D32', '#6D4C2F', '#E3B928', '#2471A3', '#7FB8D8'];
  const beads = [];
  for (let i = 0; i < 28; i++) {
    const c = seven[i % 7];
    beads.push('<circle cx="' + (12 + i * 18) + '" cy="22" r="9" fill="' + c + '" stroke="rgba(0,0,0,.35)" stroke-width="1"/>' +
      '<circle cx="' + (12 + i * 18 - 3) + '" cy="19" r="3.5" fill="#fff" opacity=".5"/>');
  }
  wrap.innerHTML = '<svg viewBox="0 0 510 34" xmlns="http://www.w3.org/2000/svg" width="100%" height="auto" preserveAspectRatio="xMidYMid meet" style="max-width:510px;height:auto">' + beads.join('') + '</svg>';
}

/* ============ Reveal ============ */
let ro;
function observeReveal() {
  if (!ro) {
    ro = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); } });
    }, { threshold: 0.12 });
  }
  $$('.reveal').forEach(el => ro.observe(el));
}

/* ============ Eventos ============ */
function bindEvents() {
  $('#nav-toggle').addEventListener('click', () => {
    const nav = $('#site-nav');
    const btn = $('#nav-toggle');
    const open = nav.classList.toggle('open');
    btn.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
  });

  $$('#site-nav a').forEach(a => a.addEventListener('click', () => {
    $('#site-nav').classList.remove('open');
    $('#nav-toggle').classList.remove('open');
    $('#nav-toggle').setAttribute('aria-expanded', 'false');
  }));

  $$('input[name="colorMode"]').forEach(r => r.addEventListener('change', (e) => {
    state.colorMode = e.target.value;
    if (state.colorMode === 'personalizar' && !state.custom.length) {
      state.custom = state.colors.map(c => ({ ...c }));
    }
    renderColorArea();
    refresh();
  }));

  $$('input[name="fios"]').forEach(r => r.addEventListener('change', (e) => {
    state.fios = parseInt(e.target.value, 10);
    syncTrancadoToggle();
    refresh();
  }));
  $$('input[name="tamanho"]').forEach(r => r.addEventListener('change', (e) => { state.tamanho = parseInt(e.target.value, 10); refresh(); }));
  $$('input[name="miçanga"]').forEach(r => r.addEventListener('change', (e) => { state.beadCm = parseFloat(e.target.value); refresh(); }));

  $('#trancado-toggle').addEventListener('change', (e) => {
    state.trancado = e.target.checked;
    refresh();
  });

  $$('input[name="firmaType"]').forEach(r => r.addEventListener('change', (e) => { state.firmaType = e.target.value; refresh(); }));

  $('#second-pendant-toggle').addEventListener('change', (e) => {
    state.showPend2 = e.target.checked;
    if (state.showPend2 && !state.pend2) {
      const list = pendantsFor(state.orixa).filter(id => id !== state.pend1);
      state.pend2 = list[0] || null;
    }
    $('#second-pendant-wrap').hidden = !state.showPend2;
    renderPingenteGrids();
    refresh();
  });

  $('#ext-buzios').addEventListener('change', (e) => { state.buzios = e.target.checked; refresh(); });
  $('#ext-palha').addEventListener('change', (e) => { state.palha = e.target.checked; refresh(); });
  $('#ext-entremeio').addEventListener('change', (e) => { state.entremeio = e.target.checked; refresh(); });

  const obs = $('#obs');
  obs.addEventListener('input', () => { state.obs = obs.value; updateWa(); });

  $('#year').textContent = new Date().getFullYear();
}

/* ============ Init ============ */
function init() {
  $('#year').textContent = new Date().getFullYear();
  renderPaleta();
  renderOrixaGrid();
  renderColorArea();
  renderFirmaColors();
  renderPingenteGrids();
  renderPingenteGaleria();
  renderFirmas();
  renderPrecos();
  renderHeroBeads();
  renderPreview();
  renderResumo();
  updateWa();
  bindEvents();
  syncTrancadoToggle();
  observeReveal();
}

document.addEventListener('DOMContentLoaded', init);
