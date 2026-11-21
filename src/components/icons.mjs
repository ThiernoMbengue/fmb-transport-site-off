// Bibliothèque d'icônes (traits, 24×24). Ajouter une icône = ajouter une entrée ici.
// Le style du trait (épaisseur, extrémités) est défini une seule fois en CSS : classe .i
const P = {
  home: '<path d="m3.5 11 8.5-7 8.5 7"/><path d="M5.5 9.5V20h13V9.5"/><path d="M10 20v-5.5h4V20"/>',
  'arrow-right': '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
  'chevron-left': '<path d="m15 18-6-6 6-6"/>',
  'chevron-right': '<path d="m9 18 6-6-6-6"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  'check-circle': '<circle cx="12" cy="12" r="9"/><path d="m8.5 12.5 2.5 2.5 4.5-5"/>',
  alert: '<circle cx="12" cy="12" r="9"/><path d="M12 8v4.5M12 16h.01"/>',
  phone: '<path d="M21 16.5v2.6a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 1.1 3.3 2 2 0 0 1 3.1 1.1h2.6a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L6.8 8.8a16 16 0 0 0 6 6l1.1-1.1a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" transform="translate(.9 .9) scale(.92)"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m3.5 7.5 8.5 6 8.5-6"/>',
  pin: '<path d="M12 21s7-6.1 7-11.5A7 7 0 0 0 5 9.5C5 14.9 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  whatsapp: '<path d="M3.5 20.5 4.8 16A8.5 8.5 0 1 1 8 19.2z"/><path d="M9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.5-2-1-1 .8c-1-.4-2.3-1.7-2.8-2.8l.8-1-1-2z"/>',
  heart: '<path d="M12 20.5s-8-4.8-8-10.7A4.6 4.6 0 0 1 12 7a4.6 4.6 0 0 1 8 2.8c0 5.9-8 10.7-8 10.7z"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.7-3.7"/>',
  filter: '<path d="M4 6h16M7 12h10M10 18h4"/>',
  calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6"/><path d="M16 4.8a3.5 3.5 0 0 1 0 6.4M18 14.5c2.1.8 3.5 2.7 3.5 5.5"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.2 3.6-7 8-7s8 2.8 8 7"/>',
  plane: '<path d="M21 3 10.5 13.5M21 3l-6.5 18-4-7.5L3 9.5z"/>',
  car: '<path d="M4 16v-3.5l2-5A2 2 0 0 1 7.9 6h8.2a2 2 0 0 1 1.9 1.5l2 5V16"/><path d="M3 16h18v2.5H3z"/><circle cx="7.5" cy="14" r=".6"/><circle cx="16.5" cy="14" r=".6"/><path d="M5.5 18.5V20M18.5 18.5V20M5 11.5h14"/>',
  bus: '<rect x="4" y="3.5" width="16" height="14.5" rx="2.5"/><path d="M4 11h16M8 14.5h.01M16 14.5h.01M7 18v2.5M17 18v2.5M2 8v3M22 8v3"/>',
  key: '<circle cx="8" cy="15" r="4.5"/><path d="m11.5 11.5 8-8M16 7l3 3M14 9l2 2"/>',
  handshake: '<path d="m11 17 2 2a1.4 1.4 0 0 0 2-2"/><path d="m14 15.5 2.2 2.2a1.4 1.4 0 0 0 2-2L14.6 12l-2.3 1.9a2 2 0 0 1-2.8-2.8l3-3A4 4 0 0 1 17 7.5l4 1.5v7h-2.5"/><path d="M3 9l4-1.5 3 .7M3 16h2.5l4 4a1.4 1.4 0 0 0 2-2"/><path d="M3 8v9"/><path d="M21 8v9"/>',
  tag: '<path d="M3.5 12.2V4.5a1 1 0 0 1 1-1h7.7l8.3 8.3a1.5 1.5 0 0 1 0 2.1l-6.6 6.6a1.5 1.5 0 0 1-2.1 0z"/><circle cx="8" cy="8" r="1.3"/>',
  chart: '<path d="M4 20V4M4 20h16"/><path d="M8 16v-4M12 16V8M16 16v-6"/>',
  school: '<path d="m2 9.5 10-5 10 5-10 5z"/><path d="M6 11.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5M22 9.5V15"/>',
  'phone-car': '<rect x="6.5" y="2.5" width="11" height="19" rx="2.5"/><path d="M10 18.5h4M9.5 12.5l.8-2.5h3.4l.8 2.5M9 12.5h6V15H9z"/>',
  shield: '<path d="M12 21.5c-4.5-1.8-7.5-5-7.5-10V5.5L12 3l7.5 2.5v6c0 5-3 8.2-7.5 10z"/><path d="m9 12 2.2 2.2L15 10.5"/>',
  camera: '<path d="M4 8h3l1.5-2.5h7L17 8h3a1 1 0 0 1 1 1v9.5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13.5" r="3.5"/>',
  receipt: '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6"/>',
  gauge: '<path d="M4.5 17a8.5 8.5 0 1 1 15 0"/><path d="m12 13 4-4"/><circle cx="12" cy="13" r="1.2"/>',
  fuel: '<path d="M4 20V5.5A1.5 1.5 0 0 1 5.5 4h6A1.5 1.5 0 0 1 13 5.5V20M3 20h11M6.5 8h4"/><path d="M13 11h2a1.5 1.5 0 0 1 1.5 1.5v4a1.5 1.5 0 0 0 3 0V9l-2.5-2.5"/>',
  gearbox: '<circle cx="6" cy="6" r="1.8"/><circle cx="12" cy="6" r="1.8"/><circle cx="18" cy="6" r="1.8"/><circle cx="6" cy="18" r="1.8"/><circle cx="12" cy="18" r="1.8"/><path d="M6 7.8v8.4M12 7.8v8.4M18 7.8V12H6"/>',
  share: '<circle cx="18" cy="5.5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="18.5" r="2.5"/><path d="m8.2 10.8 7.6-4.1M8.2 13.2l7.6 4.1"/>',
  printer: '<path d="M7 9V3.5h10V9M7 17.5H4.5a1 1 0 0 1-1-1V10a1 1 0 0 1 1-1h15a1 1 0 0 1 1 1v6.5a1 1 0 0 1-1 1H17"/><path d="M7 14h10v6.5H7z"/>',
  star: '<path d="m12 3 2.7 5.6 6.1.8-4.5 4.3 1.1 6.1L12 16.9 6.6 19.8l1.1-6.1L3.2 9.4l6.1-.8z"/>',
  expand: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
  map: '<path d="m9 4-6 2.5v13.5l6-2.5 6 2.5 6-2.5V4l-6 2.5z"/><path d="M9 4v13.5M15 6.5V20"/>',
  sliders: '<path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/>',
  route: '<circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="6" r="2.5"/><path d="M8.5 18H15a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h6.5"/>',
  building: '<path d="M5 21V4.5A1.5 1.5 0 0 1 6.5 3h7A1.5 1.5 0 0 1 15 4.5V21M15 9h3.5A1.5 1.5 0 0 1 20 10.5V21M3 21h18M8.5 7.5h3M8.5 11.5h3M8.5 15.5h3"/>'
};
// Chaque icône n'est écrite qu'UNE fois par page (sprite <symbol>), puis référencée par <use> :
// HTML plus léger et moins de nœuds DOM qu'avec des SVG répétés.
const used = new Set();
export function icon(name, cls = '') {
  if (!P[name]) throw new Error(`Icône inconnue : ${name}`);
  used.add(name);
  return `<svg class="i i-${name}${cls ? ` ${cls}` : ''}" aria-hidden="true" focusable="false"><use href="#i-${name}"/></svg>`;
}
/** Sprite des icônes utilisées depuis le dernier appel (à insérer une fois dans la page). */
export function takeSprite() {
  const html = `<svg class="sprite" aria-hidden="true" focusable="false">${[...used].sort().map((n) => `<symbol id="i-${n}" viewBox="0 0 24 24">${P[n]}</symbol>`).join('')}</svg>`;
  used.clear();
  return html;
}
