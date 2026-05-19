// Seed data — Mercadillo Market
// All fictional. UPCH brand colors and rules per spec.

window.MM = window.MM || {};

MM.CATEGORIES = [
  { id: 'todo',        label: 'Todo' },
  { id: 'venta',       label: 'Venta',       type: 'venta' },
  { id: 'alquiler',    label: 'Alquiler',    type: 'alquiler' },
  { id: 'busco',       label: 'Busco',       type: 'busco' },
  { id: 'libros',      label: 'Libros' },
  { id: 'laboratorio', label: 'Laboratorio' },
  { id: 'electronica', label: 'Electrónica' },
  { id: 'muebles',     label: 'Muebles' },
  { id: 'apuntes',     label: 'Apuntes' },
  { id: 'transporte',  label: 'Transporte' },
];

MM.USERS = [
  { id: 'u1', name: 'Camila Vásquez',  career: 'Medicina',             sede: 'la_molina', rating: 4.9, joined: '2024-03' },
  { id: 'u2', name: 'Renzo Castillo',  career: 'Odontología',          sede: 'la_molina', rating: 4.7, joined: '2024-08' },
  { id: 'u3', name: 'Daniela Romero',  career: 'Enfermería',           sede: 'smp',       rating: 5.0, joined: '2023-11' },
  { id: 'u4', name: 'Mateo Ríos',      career: 'Biología',             sede: 'la_molina', rating: 4.4, joined: '2025-01' },
  { id: 'u5', name: 'Lucía Paredes',   career: 'Psicología',           sede: 'la_molina', rating: 4.8, joined: '2024-05' },
  { id: 'u6', name: 'Joaquín Salinas', career: 'Medicina Veterinaria', sede: 'smp',       rating: 4.6, joined: '2024-09' },
  { id: 'u7', name: 'Valeria Núñez',   career: 'Nutrición',            sede: 'smp',       rating: 4.9, joined: '2024-02' },
  { id: 'u8', name: 'Sebastián León',  career: 'Tecnología Médica',    sede: 'smp',       rating: 4.5, joined: '2024-10' },
  { id: 'u9', name: 'Andrea Cárdenas', career: 'Farmacia',             sede: 'la_molina', rating: 4.8, joined: '2023-08' },
  { id: 'u0', name: 'Diego Mendoza',   career: 'Medicina',             sede: 'la_molina', rating: 4.7, joined: '2024-12' },
];

MM.CURRENT_USER_ID = 'u0';

MM.LISTINGS = [
  { id: 'l01', userId: 'u1', type: 'venta',    category: 'electronica', title: 'Calculadora Casio fx-991ES Plus', description: 'Usada solo un ciclo. Sin rayones, con tapa original. La compré para Estadística pero ya no la necesito.', price: 95,  sede: 'la_molina', condition: 'Casi nueva', placeholder: 'calculator', daysAgo: 1 },
  { id: 'l02', userId: 'u2', type: 'venta',    category: 'libros',      title: 'Netter — Atlas de Anatomía Humana 8va ed.', description: 'Edición física en buen estado, algunas marcas con resaltador en sistema nervioso.', price: 220, sede: 'la_molina', condition: 'Usado', placeholder: 'book', daysAgo: 2 },
  { id: 'l03', userId: 'u5', type: 'venta',    category: 'laboratorio', title: 'Bata blanca talla M (manga larga)', description: 'Bata nueva sin estrenar, talla M. Compré dos por error.', price: 55, sede: 'la_molina', condition: 'Nuevo', placeholder: 'coat', daysAgo: 0 },
  { id: 'l04', userId: 'u9', type: 'venta',    category: 'apuntes',     title: 'Apuntes a mano de Bioquímica (ciclo 2025-I)', description: '180 hojas escaneadas en PDF + cuaderno físico. Aprobé con 17.', price: 30, sede: 'la_molina', condition: 'Usado', placeholder: 'notes', daysAgo: 3 },
  { id: 'l05', userId: 'u4', type: 'venta',    category: 'transporte',  title: 'Bicicleta urbana aro 26', description: 'Marca genérica, le cambié las llantas hace poco. Perfecta para moverte por La Molina.', price: 480, sede: 'la_molina', condition: 'Usado', placeholder: 'bike', daysAgo: 5 },
  { id: 'l06', userId: 'u3', type: 'venta',    category: 'laboratorio', title: 'Estetoscopio Littmann Classic III', description: 'Color negro, usado en rotaciones. Funciona perfecto, vendo porque ya tengo Cardiology IV.', price: 380, sede: 'smp', condition: 'Usado', placeholder: 'stetho', daysAgo: 2 },
  { id: 'l07', userId: 'u7', type: 'venta',    category: 'libros',      title: 'Guyton & Hall — Fisiología Médica 14ed', description: 'Casi sin uso. Lo vendo porque ya pasé el curso.', price: 180, sede: 'smp', condition: 'Casi nueva', placeholder: 'book', daysAgo: 4 },
  { id: 'l08', userId: 'u6', type: 'venta',    category: 'electronica', title: 'Tablet Android 10" con lapicero', description: 'Ideal para tomar apuntes. Incluye funda y vidrio templado nuevo.', price: 420, sede: 'smp', condition: 'Usado', placeholder: 'tablet', daysAgo: 1 },
  { id: 'l09', userId: 'u5', type: 'alquiler', category: 'laboratorio', title: 'Microscopio binocular (alquiler)', description: 'Para prácticas de Histología. Lo alquilo por días o semanas. Pago al recoger.', price: 35, sede: 'la_molina', deposit: 200, placeholder: 'microscope', occupied: [2,3,4,10,11,18,19,20], daysAgo: 8 },
  { id: 'l10', userId: 'u1', type: 'alquiler', category: 'muebles',     title: 'Escritorio plegable para cuarto', description: 'Para alquilar durante el ciclo. Ideal para alumnos de provincia que alquilan cuarto cerca al campus.', price: 8, sede: 'la_molina', deposit: 80, placeholder: 'desk', occupied: [0,1,2,3,4,5,6,7,8,9], daysAgo: 12 },
  { id: 'l11', userId: 'u9', type: 'alquiler', category: 'electronica', title: 'Cámara Canon Rebel T7 + lente 18-55', description: 'Alquiler por día. Ideal para proyectos de investigación visual o salidas.', price: 45, sede: 'la_molina', deposit: 300, placeholder: 'camera', occupied: [5,6,12,13,14], daysAgo: 6 },
  { id: 'l12', userId: 'u3', type: 'alquiler', category: 'laboratorio', title: 'Modelo anatómico de cráneo (alquiler)', description: 'Cráneo desarmable para estudiar. Lo alquilo por semanas en época de parciales.', price: 12, sede: 'smp', deposit: 120, placeholder: 'skull', occupied: [7,8,9,15,16,17], daysAgo: 9 },
  { id: 'l13', userId: 'u8', type: 'alquiler', category: 'muebles',     title: 'Silla ergonómica de estudio', description: 'Por días o semanas. Perfecta para sesiones largas de estudio.', price: 6, sede: 'smp', deposit: 50, placeholder: 'chair', occupied: [1,2,22,23], daysAgo: 4 },
  { id: 'l14', userId: 'u2', type: 'busco',    category: 'libros',      title: 'Busco: Robbins — Patología Estructural y Funcional', description: 'Pago hasta S/ 200. Preferible 10ma edición o más reciente.', priceMax: 200, sede: 'la_molina', placeholder: 'book', daysAgo: 1 },
  { id: 'l15', userId: 'u6', type: 'busco',    category: 'laboratorio', title: 'Busco: alquiler de microscopio por 2 semanas', description: 'Necesito uno para prácticas de junio. Pago hasta S/ 40 por día.', priceMax: 40, sede: 'smp', placeholder: 'microscope', daysAgo: 0 },
  { id: 'l16', userId: 'u7', type: 'busco',    category: 'electronica', title: 'Busco: tablet usada en buen estado', description: 'Para tomar apuntes. Pago hasta S/ 450. Cualquier marca.', priceMax: 450, sede: 'smp', placeholder: 'tablet', daysAgo: 2 },
  { id: 'l17', userId: 'u0', type: 'busco',    category: 'laboratorio', title: 'Busco: bata blanca talla M', description: 'Nueva o casi nueva, manga larga. Para prácticas de fisiología.', priceMax: 70, sede: 'la_molina', placeholder: 'coat', daysAgo: 0 },
  { id: 'l18', userId: 'u0', type: 'busco',    category: 'libros',      title: 'Busco: Netter de Anatomía', description: 'Cualquier edición desde la 7ma. Pago hasta S/ 250.', priceMax: 250, sede: 'la_molina', placeholder: 'book', daysAgo: 4 },
];

MM.MATCHES = [
  { id: 'm01', pedidoId: 'l17', ofertaId: 'l03', score: 14.8, status: 'new',
    reasons: [
      { rule: 'misma_categoria', detail: 'laboratorio = laboratorio', points: '+base' },
      { rule: 'precio_dentro_rango', detail: 'S/ 55 ≤ S/ 70', points: 'cumple' },
      { rule: 'misma_sede', detail: 'la_molina = la_molina', points: '+10' },
      { rule: 'reputacion_vendedor', detail: 'rating 4.8', points: '+4.8' },
    ]},
  { id: 'm02', pedidoId: 'l18', ofertaId: 'l02', score: 14.7, status: 'new',
    reasons: [
      { rule: 'misma_categoria', detail: 'libros = libros', points: '+base' },
      { rule: 'precio_dentro_rango', detail: 'S/ 220 ≤ S/ 250', points: 'cumple' },
      { rule: 'misma_sede', detail: 'la_molina = la_molina', points: '+10' },
      { rule: 'reputacion_vendedor', detail: 'rating 4.7', points: '+4.7' },
    ]},
  { id: 'm03', pedidoId: 'l18', ofertaId: 'l07', score: 9.9, status: 'seen',
    reasons: [
      { rule: 'misma_categoria', detail: 'libros = libros', points: '+base' },
      { rule: 'precio_dentro_rango', detail: 'S/ 180 ≤ S/ 250', points: 'cumple' },
      { rule: 'sede_distinta', detail: 'la_molina ≠ smp', points: '+5' },
      { rule: 'reputacion_vendedor', detail: 'rating 4.9', points: '+4.9' },
    ]},
];

// Sede labels
MM.sedeLabel = (s) => s === 'la_molina' ? 'La Molina' : (s === 'smp' ? 'SMP' : 'ambas sedes');

// Icons as inline SVG strings (small library — keys mirror the React version)
MM.icon = (name, size = 18, color = 'currentColor', stroke = 1.6) => {
  const p = `width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round"`;
  const paths = {
    search:   `<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>`,
    home:     `<path d="M3 11 12 3l9 8"/><path d="M5 10v10h14V10"/>`,
    plus:     `<path d="M12 5v14M5 12h14"/>`,
    user:     `<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6"/>`,
    star:     `<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>`,
    calendar: `<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>`,
    cr:       `<path d="m9 6 6 6-6 6"/>`,
    al:       `<path d="M19 12H5M11 5l-6 7 6 7"/>`,
    whatsapp: `<path fill="${color}" stroke="none" d="M17.5 14.4c-.3-.2-1.7-.8-2-.9-.3-.1-.5-.2-.7.2s-.8.9-1 1.1c-.2.2-.4.2-.7 0-1.7-.8-2.7-1.5-3.8-3.4-.3-.5.3-.5.8-1.6.1-.2 0-.4 0-.6 0-.2-.7-1.7-1-2.3-.3-.6-.6-.5-.8-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.2-1.2 3s1.2 3.5 1.4 3.7c.2.2 2.4 3.7 5.9 5.1.8.3 1.5.5 2 .7.8.3 1.6.2 2.2.1.7-.1 2-.8 2.3-1.6.3-.8.3-1.5.2-1.6-.1-.2-.3-.3-.6-.4z"/><path d="M12 2a10 10 0 0 0-8.6 15L2 22l5-1.3A10 10 0 1 0 12 2z"/>`,
    check:    `<path d="m4 12 5 5L20 6"/>`,
    x:        `<path d="M6 6l12 12M6 18 18 6"/>`,
    sparkle:  `<path d="M12 3v6M12 15v6M3 12h6M15 12h6M5.6 5.6l4 4M14.4 14.4l4 4M5.6 18.4l4-4M14.4 9.6l4-4"/>`,
    tag:      `<path d="M3 12 12 3h8v8l-9 9z"/><circle cx="16" cy="8" r="1.5"/>`,
    logout:   `<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5M21 12H9"/>`,
    cpu:      `<rect x="5" y="5" width="14" height="14" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3"/>`,
    edit:     `<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4z"/>`,
  };
  return `<svg ${p}>${paths[name] || ''}</svg>`;
};

// Placeholder photo (returns innerHTML)
MM.PLACEHOLDERS = {
  calculator:{hue:220,label:'CALC',  icon:'rect'},
  book:      {hue:30, label:'BOOK',  icon:'book'},
  coat:      {hue:200,label:'BATA',  icon:'coat'},
  notes:     {hue:50, label:'NOTES', icon:'lines'},
  bike:      {hue:180,label:'BIKE',  icon:'bike'},
  stetho:    {hue:350,label:'STETHO',icon:'stetho'},
  tablet:    {hue:260,label:'TABLET',icon:'rect'},
  microscope:{hue:160,label:'MICRO', icon:'micro'},
  desk:      {hue:25, label:'DESK',  icon:'desk'},
  camera:    {hue:280,label:'CAMERA',icon:'cam'},
  skull:     {hue:0,  label:'SKULL', icon:'skull'},
  chair:     {hue:100,label:'CHAIR', icon:'chair'},
};

MM.photo = (kind = 'book') => {
  const p = MM.PLACEHOLDERS[kind] || MM.PLACEHOLDERS.book;
  const bg = `oklch(0.93 0.04 ${p.hue})`;
  const fg = `oklch(0.42 0.08 ${p.hue})`;
  const size = 200, cx = size/2, cy = size/2 - 6, s = size * 0.36;
  let sym = '';
  switch (p.icon) {
    case 'book':   sym = `<rect x="${cx-s/2}" y="${cy-s*0.6}" width="${s}" height="${s*1.2}" rx="3" fill="${fg}" opacity="0.18"/><line x1="${cx}" y1="${cy-s*0.55}" x2="${cx}" y2="${cy+s*0.55}" stroke="${fg}" stroke-width="2"/>`; break;
    case 'rect':   sym = `<rect x="${cx-s/2}" y="${cy-s*0.7}" width="${s}" height="${s*1.4}" rx="6" fill="${fg}" opacity="0.2"/>`; break;
    case 'lines':  sym = Array.from({length:5}, (_,i)=>`<rect x="${cx-s/2+4}" y="${cy-s*0.6+i*(s*0.28)}" width="${s-8}" height="3" rx="1.5" fill="${fg}" opacity="0.4"/>`).join(''); break;
    case 'coat':   sym = `<path d="M${cx-s*0.4} ${cy-s*0.6} L${cx} ${cy-s*0.4} L${cx+s*0.4} ${cy-s*0.6} L${cx+s*0.5} ${cy+s*0.7} L${cx-s*0.5} ${cy+s*0.7} Z" fill="${fg}" opacity="0.2"/>`; break;
    case 'bike':   sym = `<circle cx="${cx-s*0.35}" cy="${cy+s*0.2}" r="${s*0.35}" stroke="${fg}" stroke-width="2" fill="none"/><circle cx="${cx+s*0.35}" cy="${cy+s*0.2}" r="${s*0.35}" stroke="${fg}" stroke-width="2" fill="none"/>`; break;
    case 'stetho': sym = `<circle cx="${cx}" cy="${cy+s*0.35}" r="${s*0.28}" stroke="${fg}" stroke-width="2.5" fill="none"/><path d="M${cx-s*0.45} ${cy-s*0.55} v${s*0.4} a${s*0.45} ${s*0.45} 0 0 0 ${s*0.9} 0 v-${s*0.4}" stroke="${fg}" stroke-width="2.5" fill="none"/>`; break;
    case 'micro':  sym = `<rect x="${cx-s*0.15}" y="${cy-s*0.55}" width="${s*0.3}" height="${s*0.7}" fill="${fg}" opacity="0.25"/><circle cx="${cx}" cy="${cy+s*0.4}" r="${s*0.18}" fill="${fg}" opacity="0.35"/><rect x="${cx-s*0.4}" y="${cy+s*0.55}" width="${s*0.8}" height="4" fill="${fg}" opacity="0.4"/>`; break;
    case 'desk':   sym = `<rect x="${cx-s*0.55}" y="${cy-s*0.15}" width="${s*1.1}" height="5" fill="${fg}" opacity="0.35"/><rect x="${cx-s*0.5}" y="${cy-s*0.1}" width="4" height="${s*0.7}" fill="${fg}" opacity="0.3"/><rect x="${cx+s*0.46}" y="${cy-s*0.1}" width="4" height="${s*0.7}" fill="${fg}" opacity="0.3"/>`; break;
    case 'cam':    sym = `<rect x="${cx-s*0.5}" y="${cy-s*0.3}" width="${s}" height="${s*0.7}" rx="4" fill="${fg}" opacity="0.25"/><circle cx="${cx}" cy="${cy+s*0.05}" r="${s*0.22}" stroke="${fg}" stroke-width="2" fill="none"/>`; break;
    case 'skull':  sym = `<circle cx="${cx}" cy="${cy}" r="${s*0.45}" stroke="${fg}" stroke-width="2" fill="none"/><circle cx="${cx-s*0.15}" cy="${cy}" r="3" fill="${fg}"/><circle cx="${cx+s*0.15}" cy="${cy}" r="3" fill="${fg}"/>`; break;
    case 'chair':  sym = `<rect x="${cx-s*0.3}" y="${cy-s*0.5}" width="${s*0.6}" height="${s*0.5}" rx="3" fill="${fg}" opacity="0.25"/><rect x="${cx-s*0.35}" y="${cy+s*0.05}" width="${s*0.7}" height="5" fill="${fg}" opacity="0.35"/>`; break;
  }
  return `<div class="mm-photo" style="background:${bg}">
    <svg viewBox="0 0 ${size} ${size}" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
      <defs><pattern id="pp-${kind}" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="14" stroke="${fg}" stroke-width="1" opacity="0.07"/></pattern></defs>
      <rect width="${size}" height="${size}" fill="url(#pp-${kind})"/>${sym}
    </svg>
    <span class="mm-photo-label" style="color:${fg}">${p.label}</span>
  </div>`;
};
