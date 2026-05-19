// Mercadillo Market — render helpers (templates returning HTML strings)
// All references go through MM.* (from data.js) + the state passed in.

(function() {
  const T = MM;
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  // ---------- TINY COMPONENTS ----------
  T.logo = () => `
    <button class="mm-logo" data-nav="feed" aria-label="Inicio">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M3 12 12 3h8v8l-9 9z" stroke="#A32D2D" stroke-width="2" stroke-linejoin="round" fill="white"/>
        <circle cx="16" cy="8" r="1.6" fill="#A32D2D"/>
      </svg>
      <span class="mm-logo-text">
        <span class="a">Mercadillo</span>
        <span class="b">Market · UPCH</span>
      </span>
    </button>`;

  T.badge = (type) => {
    const lbl = { venta: 'Venta', alquiler: 'Alquiler', busco: 'Busco' }[type] || type;
    return `<span class="mm-badge mm-badge-${type}">${lbl}</span>`;
  };
  T.sedeDot = (sede, withLabel = true) => `
    <span class="mm-sede ${sede}">
      <span class="dot"></span>${withLabel ? esc(T.sedeLabel(sede)) : ''}
    </span>`;
  T.initials = (name) => name.split(' ').map(s => s[0]).slice(0, 2).join('');

  // ---------- CARD ----------
  T.card = (l) => {
    const user = T.USERS.find(u => u.id === l.userId);
    const price = l.type === 'busco'
      ? `Hasta S/ ${l.priceMax}`
      : `S/ ${l.price}${l.type === 'alquiler' ? '<small> /día</small>' : ''}`;
    return `
      <button class="mm-card" data-open-listing="${l.id}">
        ${T.photo(l.placeholder)}
        <div class="row">
          ${T.badge(l.type)}
          ${T.sedeDot(l.sede)}
        </div>
        <h3>${esc(l.title)}</h3>
        <div class="foot">
          <span class="pr">${price}</span>
          ${user ? `<span class="rating">${T.icon('star', 11, '#D4A017')}${user.rating.toFixed(1)}</span>` : ''}
        </div>
      </button>`;
  };

  // ---------- HEADER ----------
  T.header = (state) => {
    const matchCount = state.customMatches.filter(m => m.status === 'new').length || (state.currentUser ? 2 : 0);
    const nav = [
      { id: 'feed',    icon: 'home',    label: 'Inicio' },
      { id: 'matches', icon: 'sparkle', label: 'Matches', badge: matchCount },
      { id: 'profile', icon: 'user',    label: 'Perfil' },
    ];
    return `
      <header class="mm-header">
        ${T.logo()}
        <div class="mm-search">
          <span class="ico">${T.icon('search', 16)}</span>
          <input id="mm-search-input" type="text" placeholder="Buscar calculadora, libros, batas…" value="${esc(state.query)}"/>
        </div>
        <nav class="mm-nav">
          ${nav.map(n => `
            <button class="mm-nav-item ${state.page === n.id ? 'active' : ''}" data-nav="${n.id}">
              ${T.icon(n.icon, 16)}${n.label}
              ${n.badge > 0 ? `<span class="badge">${n.badge}</span>` : ''}
            </button>
          `).join('')}
        </nav>
        <button class="mm-btn mm-btn-primary" data-nav="publish">
          ${T.icon('plus', 16, 'white')}Publicar
        </button>
        ${state.currentUser
          ? `<button class="mm-avatar" data-nav="profile" style="background: oklch(0.85 0.04 ${(state.currentUser.id.charCodeAt(1) * 47) % 360})">${T.initials(state.currentUser.name)}</button>`
          : `<button class="mm-btn mm-btn-outline" data-login="general">Iniciar sesión</button>`}
      </header>`;
  };

  // ---------- FEED ----------
  T.feedPage = (state) => {
    let visible = T.LISTINGS.slice().concat(state.extraListings);
    if (state.emptyState === 'empty') visible = [];
    if (state.sede !== 'ambas') visible = visible.filter(l => l.sede === state.sede);
    if (state.chip !== 'todo') {
      const cat = T.CATEGORIES.find(c => c.id === state.chip);
      if (cat?.type) visible = visible.filter(l => l.type === cat.type);
      else visible = visible.filter(l => l.category === state.chip);
    }
    if (state.query.trim()) {
      const q = state.query.toLowerCase();
      visible = visible.filter(l => l.title.toLowerCase().includes(q) || (l.description || '').toLowerCase().includes(q));
    }
    visible.sort((a, b) => a.daysAgo - b.daysAgo);

    const chips = T.CATEGORIES.map(c => {
      const active = state.chip === c.id;
      const typeClass = c.type && active ? `type-${c.type}` : '';
      return `<button class="mm-chip ${active ? 'active' : ''} ${typeClass}" data-chip="${c.id}">${esc(c.label)}</button>`;
    }).join('');

    const sedeSwitch = ['la_molina', 'smp', 'ambas'].map(id => {
      const label = id === 'ambas' ? 'Ambas' : (id === 'la_molina' ? 'La Molina' : 'SMP');
      const dot = id !== 'ambas' ? `<span class="dot" style="background: var(--${id === 'la_molina' ? 'la-molina' : 'smp'})"></span>` : '';
      return `<button class="${state.sede === id ? 'active' : ''}" data-sede="${id}">${dot}${label}</button>`;
    }).join('');

    const empty = `
      <div class="mm-empty">
        <div class="ico-wrap">${T.icon('search', 22)}</div>
        <h3>Nada por aquí en ${esc(T.sedeLabel(state.sede))}</h3>
        <p>Cambia los filtros o crea un "Busco" para que el agente te avise cuando aparezca.</p>
        <button class="mm-btn mm-btn-outline" data-clear-filters>Limpiar filtros</button>
      </div>`;

    return `
      <div class="mm-page">
        <div class="mm-toolbar">
          <div class="mm-sede-switch">${sedeSwitch}</div>
          <div class="chips-wrap"><div class="mm-chips">${chips}</div></div>
        </div>
        <div class="mm-section-title">
          <div>
            <h2>Recientes en ${esc(T.sedeLabel(state.sede))}</h2>
            <p>${visible.length} ${visible.length === 1 ? 'publicación' : 'publicaciones'} · actualizado hace un momento</p>
          </div>
          <button class="clear" data-clear-filters>Limpiar filtros</button>
        </div>
        ${visible.length === 0 ? empty :
          `<div class="mm-grid cols-${state.density}">${visible.map(l => T.card(l)).join('')}</div>`}
      </div>`;
  };

  // ---------- CALENDAR ----------
  T.calendar = (occupied, range, days = 28, editable = false) => {
    const today = new Date();
    let html = '';
    for (let i = 0; i < days; i++) {
      const d = new Date(today); d.setDate(today.getDate() + i);
      const dayNum = d.getDate();
      const dow = d.toLocaleDateString('es-PE', { weekday: 'short' }).slice(0, 2);
      const isOcc = occupied.has(i);
      const inRange = range && range.from != null && range.to != null &&
        i >= Math.min(range.from, range.to) && i <= Math.max(range.from, range.to);
      const isSel = range && (i === range.from || i === range.to);
      const cls = [
        isOcc ? 'occ' : '',
        inRange && !isSel ? 'in-range' : '',
        isSel ? 'selected' : '',
      ].filter(Boolean).join(' ');
      const action = editable ? `data-cal-toggle="${i}"` : `data-cal-pick="${i}"`;
      html += `<button class="${cls}" ${action}><span class="dow">${dow}</span>${dayNum}</button>`;
    }
    return `<div class="mm-cal">${html}</div>`;
  };

  // ---------- DETAIL ----------
  T.detailPage = (state) => {
    const all = T.LISTINGS.concat(state.extraListings);
    const l = all.find(x => x.id === state.detailId);
    if (!l) return '<div class="mm-page">Publicación no encontrada.</div>';
    const owner = T.USERS.find(u => u.id === l.userId);
    const ageTxt = l.daysAgo === 0 ? 'unas horas' : `${l.daysAgo} día${l.daysAgo === 1 ? '' : 's'}`;

    let cta = '';
    if (l.type === 'alquiler') cta = T.rentalCTA(state, l);
    else if (l.type === 'busco') cta = `
      <div class="mm-info-banner">
        <strong>Esta es una publicación "Busco".</strong>
        Si tienes lo que esta persona necesita, publícalo y el agente la notificará automáticamente.
      </div>`;
    else cta = `
      <button class="mm-btn mm-btn-wa mm-btn-full mm-btn-lg" data-sale-contact="${l.id}">
        ${T.icon('whatsapp', 17, 'white')}Contactar por WhatsApp
      </button>
      <p class="mm-cta-hint">${state.currentUser ? 'Te abrimos un mensaje con la info del artículo.' : 'Necesitas iniciar sesión con tu correo @upch.pe.'}</p>`;

    return `
      <div class="mm-page">
        <button class="mm-back" data-nav="feed">${T.icon('al', 14)} Volver al feed</button>
        <div class="mm-detail">
          <div>
            <div class="mm-gallery">${T.photo(l.placeholder)}</div>
            <div class="mm-thumbs">
              ${[0,1,2,3].map(i => `<div class="mm-thumb ${i === 0 ? 'first' : ''}">foto ${i+1}</div>`).join('')}
            </div>
          </div>
          <div>
            <div class="mm-row-meta">
              ${T.badge(l.type)} ${T.sedeDot(l.sede)}
              <span class="mm-meta-dot">·</span>
              <span class="mm-meta-time">hace ${ageTxt}</span>
            </div>
            <h1>${esc(l.title)}</h1>
            <div class="mm-price-row">
              <span class="price-big">${l.type === 'busco' ? `Hasta S/ ${l.priceMax}` : `S/ ${l.price}`}</span>
              ${l.type === 'alquiler' ? `<span class="price-unit">/día</span>` : ''}
            </div>
            ${l.condition ? `<p class="mm-extra-meta">Estado: <strong>${esc(l.condition)}</strong></p>` : ''}
            ${l.deposit ? `<p class="mm-extra-meta">Depósito reembolsable: <strong>S/ ${l.deposit}</strong></p>` : ''}
            <p class="desc">${esc(l.description)}</p>
            ${owner ? `
              <div class="mm-owner">
                <div class="av" style="background: oklch(0.85 0.04 ${(owner.id.charCodeAt(1) * 47) % 360})">${T.initials(owner.name)}</div>
                <div style="flex:1">
                  <div style="font-size:14px; font-weight:500">${esc(owner.name)}</div>
                  <div style="font-size:12px; color:var(--slate-500)">${esc(owner.career)}</div>
                </div>
                <div style="display:inline-flex; align-items:center; gap:4px; font-size:13px; color:var(--slate-700)">
                  ${T.icon('star', 14, '#D4A017')}${owner.rating.toFixed(1)}
                </div>
              </div>` : ''}
            <div style="margin-top:24px">${cta}</div>
          </div>
        </div>
      </div>`;
  };

  // ---------- RENTAL CTA ----------
  T.rentalCTA = (state, l) => {
    const occ = new Set(l.occupied || []);
    const ovs = state.calendarOverrides[l.id] || {};
    Object.entries(ovs).forEach(([d, o]) => { o ? occ.add(+d) : occ.delete(+d); });

    const range = state.calendarRange;
    let valid = false, btnLabel = 'Selecciona fechas primero', disabled = true, variant = 'mm-btn-outline';
    if (range.from != null && range.to != null) {
      const a = Math.min(range.from, range.to), b = Math.max(range.from, range.to);
      let collide = false;
      for (let i = a; i <= b; i++) if (occ.has(i)) { collide = true; break; }
      if (collide) {
        btnLabel = 'Esas fechas chocan con ocupados';
        variant = 'mm-btn-wa';
      } else {
        const days = b - a + 1;
        valid = true; disabled = false;
        btnLabel = `Reservar ${days} día${days === 1 ? '' : 's'} por WhatsApp`;
        variant = 'mm-btn-wa';
      }
    }

    return `
      <h3 class="mm-cal-title">${T.icon('calendar', 16)}Disponibilidad</h3>
      ${T.calendar(occ, range)}
      <div class="mm-cal-legend">
        <span><span class="sw" style="background:var(--venta-bg)"></span>libre</span>
        <span><span class="sw" style="background:var(--slate-200)"></span>ocupado</span>
        <span><span class="sw" style="background:var(--brand)"></span>tu selección</span>
        ${range.from != null ? `<button class="clr" data-cal-clear>Limpiar</button>` : '<span></span>'}
      </div>
      <button class="mm-btn ${variant} mm-btn-full mm-btn-lg" ${disabled ? 'disabled' : ''} data-reserve="${l.id}">
        ${valid ? T.icon('whatsapp', 17, 'white') : ''}${btnLabel}
      </button>
      <p class="mm-cta-hint">El pago y la entrega se coordinan por WhatsApp. ${!state.currentUser ? 'Necesitas iniciar sesión.' : ''}</p>`;
  };

  // ---------- PUBLISH FLOW ----------
  T.publishPage = (state) => {
    if (!state.currentUser) return `<div class="mm-page" style="text-align:center; color:var(--slate-500); padding-top:80px">Necesitas iniciar sesión para publicar.</div>`;
    const steps = ['Tipo', 'Información', 'Detalles', 'Confirmar'];
    const s = state.publishStep;
    const d = state.publishDraft;

    const stepperHtml = steps.map((label, i) => {
      const stepNum = i + 1;
      const cls = s > stepNum ? 'done' : (s === stepNum ? 'current' : '');
      const inner = s > stepNum ? '✓' : stepNum;
      return `
        <div class="step ${cls}">
          <span class="num">${inner}</span>
          <span class="lbl">${label}</span>
        </div>
        ${i < steps.length - 1 ? '<div class="sep"></div>' : ''}`;
    }).join('');

    let body = '';
    if (s === 1) {
      const types = [
        { id: 'venta',    title: 'Vender',   desc: 'Algo que ya no usas' },
        { id: 'alquiler', title: 'Alquilar', desc: 'Lo prestas por días' },
        { id: 'busco',    title: 'Busco',    desc: 'Lo necesitas tú' },
      ];
      body = `
        <h3 style="font-size:16px; font-weight:500; margin:0 0 16px">¿Qué quieres hacer?</h3>
        <div class="mm-types">
          ${types.map(t => `
            <button class="mm-type-card ${d.type === t.id ? 'sel-' + t.id : ''}" data-pub-type="${t.id}">
              ${T.badge(t.id)}
              <div class="title">${t.title}</div>
              <div class="desc">${t.desc}</div>
            </button>`).join('')}
        </div>
        <div class="mm-actions end">
          <button class="mm-btn mm-btn-primary" ${d.type ? '' : 'disabled'} data-pub-next>Continuar</button>
        </div>`;
    } else if (s === 2) {
      const cats = ['libros','laboratorio','electronica','muebles','apuntes','transporte'];
      const priceKey = d.type === 'busco' ? 'priceMax' : 'price';
      const priceLabel = d.type === 'busco' ? 'Precio máximo (S/)' : (d.type === 'alquiler' ? 'Precio por día (S/)' : 'Precio (S/)');
      body = `
        <label class="mm-field"><div class="label">Título</div>
          <input class="mm-input" data-pub-field="title" value="${esc(d.title)}"
            placeholder="${d.type === 'busco' ? 'Busco: calculadora científica' : 'Calculadora Casio fx-991ES Plus'}"/>
        </label>
        <div class="mm-spacer-12"></div>
        <label class="mm-field"><div class="label">Descripción</div>
          <textarea class="mm-textarea" data-pub-field="description" rows="4"
            placeholder="Estado real, lo que incluye, cualquier detalle relevante.">${esc(d.description)}</textarea>
        </label>
        <div class="mm-spacer-12"></div>
        <div class="mm-2col">
          <label class="mm-field"><div class="label">Categoría</div>
            <select class="mm-select" data-pub-field="category">
              ${cats.map(c => `<option value="${c}" ${d.category === c ? 'selected' : ''}>${esc(T.CATEGORIES.find(x => x.id === c)?.label || c)}</option>`).join('')}
            </select>
          </label>
          <label class="mm-field"><div class="label">${priceLabel}</div>
            <input class="mm-input" data-pub-field="${priceKey}" value="${esc(d[priceKey])}" placeholder="0"/>
          </label>
        </div>
        <div class="mm-spacer-12"></div>
        <label class="mm-field"><div class="label">Fotos</div>
          <div class="mm-photos-up">
            ${[0,1,2,3].map(() => `<div class="mm-photo-up">${T.icon('plus', 20)}</div>`).join('')}
          </div>
        </label>
        <div class="mm-actions">
          <button class="mm-btn mm-btn-ghost" data-pub-back>Atrás</button>
          <button class="mm-btn mm-btn-primary" ${d.title.trim() ? '' : 'disabled'} data-pub-next>Continuar</button>
        </div>`;
    } else if (s === 3) {
      const sedeBtns = [['la_molina','La Molina'], ['smp','SMP']].map(([id, label]) => `
        <button class="${d.sede === id ? 'active' : ''}" data-pub-sede="${id}">
          <span class="dot" style="background: var(--${id === 'la_molina' ? 'la-molina' : 'smp'})"></span>${label}
        </button>`).join('');
      let extra = '';
      if (d.type === 'venta') {
        extra = `
          <div class="mm-spacer-12"></div>
          <label class="mm-field"><div class="label">Condición</div>
            <select class="mm-select" data-pub-field="condition">
              ${['Nuevo','Casi nueva','Usado','Para piezas/partes'].map(c => `<option ${d.condition === c ? 'selected' : ''}>${c}</option>`).join('')}
            </select>
          </label>`;
      } else if (d.type === 'alquiler') {
        extra = `
          <div class="mm-spacer-12"></div>
          <label class="mm-field"><div class="label">Depósito reembolsable (opcional)</div>
            <input class="mm-input" data-pub-field="deposit" value="${esc(d.deposit)}" placeholder="0"/>
          </label>
          <p class="mm-extra-meta">Podrás marcar días ocupados desde tu perfil cuando cierres un trato.</p>`;
      } else {
        extra = `
          <div class="mm-info-banner">
            <strong>${T.icon('cpu', 13, '#1d4ed8')} El agente buscará por ti</strong>
            Al confirmar, el motor lógico cruzará tu "Busco" con todas las ofertas activas y te avisará si hay coincidencias.
          </div>`;
      }
      body = `
        <label class="mm-field"><div class="label">Sede de entrega</div>
          <div class="mm-sede-choice">${sedeBtns}</div>
        </label>
        ${extra}
        <div class="mm-actions">
          <button class="mm-btn mm-btn-ghost" data-pub-back>Atrás</button>
          <button class="mm-btn mm-btn-primary" data-pub-next>Revisar</button>
        </div>`;
    } else if (s === 4) {
      body = `
        <h3 style="font-size:16px; font-weight:500; margin:0 0 12px">Revisa tu publicación</h3>
        <div style="border:1px solid var(--slate-200); border-radius:12px; padding:16px; background:white">
          <div style="display:flex; gap:14px">
            <div style="width:100px">${T.photo(d.placeholder || 'book')}</div>
            <div style="flex:1">
              <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px">
                ${T.badge(d.type)} ${T.sedeDot(d.sede)}
              </div>
              <div style="font-size:16px; font-weight:500">${esc(d.title)}</div>
              <div style="font-size:13px; color:var(--slate-600); margin-top:4px; text-wrap:pretty">
                ${d.description ? esc(d.description) : '<em style="color:var(--slate-400)">sin descripción</em>'}
              </div>
              <div style="font-size:18px; font-weight:500; margin-top:10px">
                ${d.type === 'busco' ? `Hasta S/ ${d.priceMax || 0}` : `S/ ${d.price || 0}${d.type === 'alquiler' ? ' /día' : ''}`}
              </div>
            </div>
          </div>
        </div>
        <div class="mm-actions">
          <button class="mm-btn mm-btn-ghost" data-pub-back>Atrás</button>
          <button class="mm-btn mm-btn-primary mm-btn-lg" data-pub-submit>Publicar</button>
        </div>`;
    }

    return `
      <div class="mm-page-narrow">
        <h1 style="margin:0; font-size:24px; font-weight:500; letter-spacing:-0.2px">Nueva publicación</h1>
        <div class="mm-stepper">${stepperHtml}</div>
        ${body}
      </div>`;
  };

  // ---------- PROFILE ----------
  T.profilePage = (state) => {
    if (!state.currentUser) return `<div class="mm-page" style="text-align:center; color:var(--slate-500); padding-top:80px">Necesitas iniciar sesión para ver tu perfil.</div>`;
    const me = state.currentUser;
    const all = T.LISTINGS.concat(state.extraListings);
    const mine = all.filter(l => l.userId === me.id);
    const myBuscos = mine.filter(l => l.type === 'busco');
    const myRentals = mine.filter(l => l.type === 'alquiler');
    const allMatches = T.MATCHES.concat(state.customMatches);
    const myMatches = allMatches.filter(m => {
      const p = all.find(l => l.id === m.pedidoId);
      return p && p.userId === me.id;
    });

    const stats = [
      ['Publicaciones', mine.length],
      ['Busco activos', myBuscos.length],
      ['Matches', myMatches.length],
      ['Reputación', (me.rating || 4.7).toFixed(1)],
    ];

    const buscosHtml = myBuscos.length === 0
      ? `<div class="mm-empty"><p>No tienes ningún 'Busco' activo.</p></div>`
      : myBuscos.map(b => {
          const ms = myMatches.filter(m => m.pedidoId === b.id);
          return `
            <div class="mm-busco-row" style="margin-bottom:12px">
              <div class="top">
                ${T.badge('busco')}
                <span class="ti">${esc(b.title)}</span>
                <span class="ct ${ms.length ? 'has' : 'none'}">${ms.length} match${ms.length === 1 ? '' : 'es'}</span>
              </div>
              ${ms.length ? `<div class="ms">${ms.map(m => {
                const o = all.find(l => l.id === m.ofertaId);
                if (!o) return '';
                return `
                  <button class="m" data-open-listing="${o.id}">
                    <span style="font-size:11px; color:var(--slate-500); width:60px">score <strong style="color:var(--brand); font-weight:500">${m.score.toFixed(1)}</strong></span>
                    <span style="flex:1; font-size:13px">${esc(o.title)}</span>
                    ${T.sedeDot(o.sede, false)}
                    ${T.icon('cr', 14, '#94a3b8')}
                  </button>`;
              }).join('')}</div>` : ''}
            </div>`;
        }).join('');

    return `
      <div class="mm-page-medium">
        <div class="mm-profile-head">
          <div class="av" style="background: oklch(0.85 0.04 ${(me.id.charCodeAt(1) * 47) % 360})">${T.initials(me.name)}</div>
          <div style="flex:1">
            <h1 style="margin:0; font-size:22px; font-weight:500; letter-spacing:-0.2px">${esc(me.name)}</h1>
            <div class="meta">
              <span>${esc(me.career)}</span>
              <span class="sep">·</span>
              ${T.sedeDot(me.sede)}
              <span class="sep">·</span>
              <span style="display:inline-flex; align-items:center; gap:4px">${T.icon('star', 13, '#D4A017')}${(me.rating || 4.7).toFixed(1)} · ${me.joined || '2024'}</span>
            </div>
          </div>
          <button class="mm-btn mm-btn-outline mm-btn-sm" data-logout>${T.icon('logout', 14)}Cerrar sesión</button>
        </div>

        <div class="mm-stats">
          ${stats.map(([l, v]) => `<div class="mm-stat"><div class="v">${v}</div><div class="l">${l}</div></div>`).join('')}
        </div>

        <div class="mm-block">
          <h2>Mis publicaciones activas <span class="count">· ${mine.length}</span></h2>
          ${mine.length === 0
            ? `<div class="mm-empty"><p>Aún no has publicado nada.</p></div>`
            : `<div class="mm-grid cols-3">${mine.map(l => T.card(l)).join('')}</div>`}
        </div>

        ${myRentals.length ? `
          <div class="mm-block">
            <h2>Gestor de calendario · alquileres</h2>
            <p class="sub">Toca un día para marcarlo como ocupado o disponible. Hazlo cuando cierres un trato por WhatsApp.</p>
            <div class="mm-grid cols-3" style="grid-template-columns:1fr 1fr">
              ${myRentals.map(l => {
                const occ = new Set(l.occupied || []);
                const ovs = state.calendarOverrides[l.id] || {};
                Object.entries(ovs).forEach(([d, o]) => { o ? occ.add(+d) : occ.delete(+d); });
                return `
                  <div class="mm-rental-mgr" data-rental-mgr="${l.id}">
                    <div class="head">
                      <div class="ph">${T.photo(l.placeholder)}</div>
                      <div style="flex:1">
                        <div class="ti">${esc(l.title)}</div>
                        <div class="me">S/ ${l.price} /día · ${occ.size} días ocupados</div>
                      </div>
                    </div>
                    ${T.calendar(occ, null, 28, true)}
                  </div>`;
              }).join('')}
            </div>
          </div>` : ''}

        <div class="mm-block">
          <h2>Mis 'Busco' y matches <span class="count">· ${myBuscos.length}</span></h2>
          ${buscosHtml}
        </div>

        <div class="mm-block">
          <h2>Historial</h2>
          <div style="border:1px solid var(--slate-200); border-radius:12px; background:white">
            ${[
              { date: '12 may', text: 'Vendiste "Apuntes de Histología" a Mateo Ríos', tag: 'venta' },
              { date: '04 may', text: 'Alquilaste "Calculadora Casio" por 5 días a Lucía P.', tag: 'alquiler' },
              { date: '22 abr', text: 'Compraste "Bata blanca M" a Andrea C.', tag: 'compra' },
            ].map(r => `
              <div class="mm-history-row">
                <span class="date">${r.date}</span>
                <span class="txt">${esc(r.text)}</span>
                <span class="tag">${r.tag}</span>
              </div>`).join('')}
          </div>
        </div>
      </div>`;
  };

  // ---------- MATCHES ----------
  T.matchesPage = (state) => {
    if (!state.currentUser) return `<div class="mm-page" style="text-align:center; color:var(--slate-500); padding-top:80px">Necesitas iniciar sesión para ver tus matches.</div>`;
    const me = state.currentUser;
    const all = T.LISTINGS.concat(state.extraListings);
    const myBuscos = all.filter(l => l.userId === me.id && l.type === 'busco');
    const allMatches = T.MATCHES.concat(state.customMatches);

    const matchesHtml = `
      <div class="mm-agent-status ${state.agentRunning ? 'run' : ''}">
        <div class="ico">${T.icon('cpu', 18)}</div>
        <div style="flex:1">
          <div class="ti">${state.agentRunning ? 'Agente analizando reglas…' : 'Agente en reposo'}</div>
          <div class="sub">${state.agentRunning
            ? `<code>?- match(PedidoId, OfertaId, Score).</code>`
            : 'Última corrida: hace unos segundos · 3 reglas activas'}</div>
        </div>
      </div>
      ${myBuscos.length === 0
        ? `<div class="mm-empty" style="margin-top:20px"><p>Crea un 'Busco' desde Publicar y el agente buscará por ti.</p></div>`
        : `<div style="display:flex; flex-direction:column; gap:16px; margin-top:20px">
            ${myBuscos.map(b => T.buscoMatchCard(b, allMatches.filter(m => m.pedidoId === b.id), all, state)).join('')}
          </div>`}
    `;

    const chatHtml = `
      <div class="mm-chatbot">
        <div class="mm-cb-hdr">
          <div class="ico">${T.icon('sparkle', 16, 'white')}</div>
          <div style="flex:1">
            <div class="ti">Mercadillo Bot</div>
            <div class="su">Asistente de inteligencia artificial</div>
          </div>
        </div>
        <div class="mm-cb-body">
          <div class="mm-cb-msg bot">
            ¡Hola! Soy el agente de Mercadillo Market. ¿En qué te puedo ayudar hoy?
          </div>
          <div class="mm-cb-msg user">
            Hola, ¿hay calculadoras en La Molina?
          </div>
          <div class="mm-cb-msg bot">
            He encontrado 2 calculadoras en La Molina. Te sugiero crear un "Busco" para que te notifique apenas se publique una nueva.
          </div>
        </div>
        <div class="mm-cb-input">
          <input type="text" placeholder="Pregúntale al agente..." disabled />
          <button disabled>${T.icon('send', 14, 'white')}</button>
        </div>
      </div>
    `;

    return `
      <div class="mm-page-large mm-matches-head">
        <div style="display:flex; align-items:center; gap:10px; margin-bottom:6px">
          <h1>Tus matches</h1>
          <span class="mm-prolog-badge">${T.icon('cpu', 11, '#854d0e')} motor lógico · Prolog</span>
        </div>
        <p style="margin:0 0 24px; font-size:13px; color:var(--slate-500)">
          El agente cruza tus "Busco" con las ofertas activas y te avisa cuando aparece algo compatible.
        </p>
        
        <div class="mm-matches-layout">
          <div class="col-matches">${matchesHtml}</div>
          <div class="col-chat">${chatHtml}</div>
        </div>
      </div>`;
  };

  T.buscoMatchCard = (busco, matches, all, state) => {
    const hasNew = matches.some(m => m.status === 'new');
    const showDebug = state.debugMode || state.expandedDebug.has(busco.id);
    return `
      <div class="mm-match-card ${matches.length ? 'has-rows' : ''}">
        <div class="head">
          ${T.badge('busco')}
          <div style="flex:1">
            <div class="ti">${esc(busco.title)}</div>
            <div class="me">Hasta S/ ${busco.priceMax} · ${esc(MM.sedeLabel(busco.sede))}</div>
          </div>
          ${hasNew ? `<span class="mm-new-pill"><span class="blip"></span>Nuevos matches</span>` : ''}
          <button class="mm-debug-toggle ${showDebug ? 'on' : ''}" data-toggle-debug="${busco.id}">
            ${T.icon('cpu', 11)} ${showDebug ? 'Ocultar lógica' : 'Ver lógica del agente'}
          </button>
        </div>
        ${matches.length === 0
          ? `<div style="padding:20px; font-size:13px; color:var(--slate-500); text-align:center">Aún no hay coincidencias. El agente vuelve a correr cada vez que se publica algo nuevo.</div>`
          : matches.map(m => {
              const o = all.find(l => l.id === m.ofertaId);
              const ou = o && MM.USERS.find(u => u.id === o.userId);
              if (!o) return '';
              return `
                <div>
                  <button class="mm-match-row" data-open-listing="${o.id}">
                    <div class="ph">${T.photo(o.placeholder)}</div>
                    <div style="flex:1">
                      <div class="ti">${esc(o.title)}</div>
                      <div class="meta">
                        ${T.badge(o.type)} ${T.sedeDot(o.sede)} ${ou ? `<span>· ${esc(ou.name)}</span>` : ''}
                      </div>
                    </div>
                    <div class="score-block">
                      <div class="l">score</div>
                      <div class="v">${m.score.toFixed(1)}</div>
                    </div>
                    ${T.icon('cr', 16, '#94a3b8')}
                  </button>
                  ${showDebug ? T.prologDebug(m, busco, o, ou) : ''}
                </div>`;
            }).join('')}
      </div>`;
  };

  T.prologDebug = (m, busco, oferta, ou) => `
    <div class="mm-prolog">
      <div class="head">─── matcher.pl · evaluación de la regla match/3</div>
      <div>?- match(${busco.id}, ${oferta.id}, Score).</div>
      <div class="ind">
        <div class="dim">pedido(${busco.id}, ${busco.category}, ${busco.priceMax}, _, _, ${busco.sede}).</div>
        <div class="dim">oferta(${oferta.id}, ${oferta.category}, ${oferta.price || 'rango'}, ${oferta.sede}, ${ou?.rating || '?'}).</div>
        ${m.reasons.map(r => `<div class="ok">  ✓ ${r.rule}(…)  % ${r.detail}  → ${r.points}</div>`).join('')}
      </div>
      <div class="result">Score = ${m.score.toFixed(1)}.  <span class="dim">true.</span></div>
    </div>`;

  // ---------- LOGIN MODAL ----------
  T.loginModal = (state) => {
    const r = state.loginReason;
    const reasonText = {
      publicar:  'Para publicar necesitas verificar que eres alumno UPCH.',
      reservar:  'Para reservar fechas necesitamos un correo UPCH verificado.',
      contactar: 'Para ver los datos de contacto, verifica tu correo UPCH.',
      matches:   'Para crear un "Busco" y recibir matches, ingresa con tu correo UPCH.',
    }[r] || 'Ingresa con tu correo institucional UPCH.';

    let body = '';
    if (state.loginStep === 'email') {
      body = `
        <h2>Ingresa con tu correo UPCH</h2>
        <p class="sub">${reasonText}</p>
        <label class="mm-field"><div class="label">Correo institucional</div>
          <input id="mm-login-email" class="mm-input ${state.loginError ? 'err' : ''}" placeholder="apellido.nombre@upch.pe" value="${esc(state.loginEmail)}"/>
        </label>
        ${state.loginError ? `<p class="mm-err">${T.icon('x', 12)}${esc(state.loginError)}</p>` : ''}
        <div style="margin-top:20px">
          <button class="mm-btn mm-btn-primary mm-btn-full mm-btn-lg" data-login-submit-email>Enviar código</button>
        </div>
        <button class="mm-link" data-login-quick>(Demo: ingresar como Diego Mendoza)</button>`;
    } else if (state.loginStep === 'code') {
      body = `
        <h2>Verifica tu correo</h2>
        <p class="sub">Te enviamos un código a <strong style="color:var(--slate-800); font-weight:500">${esc(state.loginEmail)}</strong></p>
        <div class="mm-code-row">
          ${[0,1,2,3].map(i => `<input data-code-idx="${i}" maxlength="1" value="${esc(state.loginCode[i] || '')}"/>`).join('')}
        </div>
        <p style="font-size:12px; color:var(--slate-500); text-align:center; margin:0 0 16px">
          Código de prueba: <strong style="color:var(--slate-800); font-weight:500">1234</strong>
        </p>
        <button class="mm-btn mm-btn-primary mm-btn-full mm-btn-lg" ${state.loginCode.join('').length === 4 ? '' : 'disabled'} data-login-submit-code>Verificar</button>`;
    } else {
      body = `
        <h2>Completa tu perfil</h2>
        <p class="sub">Solo se mostrará a otros alumnos UPCH.</p>
        <label class="mm-field"><div class="label">Nombre completo</div>
          <input class="mm-input" data-prof-field="name" value="${esc(state.profileDraft.name)}" placeholder="Diego Mendoza"/>
        </label>
        <div class="mm-spacer-12"></div>
        <label class="mm-field"><div class="label">Carrera</div>
          <select class="mm-select" data-prof-field="career">
            <option value="">Selecciona…</option>
            ${['Medicina','Odontología','Enfermería','Biología','Psicología','Medicina Veterinaria','Nutrición','Tecnología Médica','Farmacia','Salud Pública'].map(c => `<option ${state.profileDraft.career === c ? 'selected' : ''}>${c}</option>`).join('')}
          </select>
        </label>
        <div class="mm-spacer-12"></div>
        <label class="mm-field"><div class="label">Sede principal</div>
          <div class="mm-sede-choice">
            ${[['la_molina','La Molina'], ['smp','SMP']].map(([id, label]) => `
              <button class="${state.profileDraft.sede === id ? 'active' : ''}" data-prof-sede="${id}">
                <span class="dot" style="background: var(--${id === 'la_molina' ? 'la-molina' : 'smp'})"></span>${label}
              </button>`).join('')}
          </div>
        </label>
        <div style="margin-top:22px">
          <button class="mm-btn mm-btn-primary mm-btn-full mm-btn-lg" data-login-finish>Empezar</button>
        </div>`;
    }

    return `
      <div class="mm-overlay" data-overlay>
        <div class="mm-modal">
          <button class="mm-modal-close" data-close-login>${T.icon('x', 20)}</button>
          ${T.logo()}
          ${body}
        </div>
      </div>`;
  };

  // ---------- TWEAKS PANEL ----------
  T.tweaksPanel = (state) => `
    <div class="mm-tweaks ${state.tweaksOpen ? 'open' : ''}">
      <div class="hdr">
        <span>Tweaks · Mercadillo Market</span>
        <button data-toggle-tweaks>${T.icon('x', 16)}</button>
      </div>
      <div class="body">
        <div class="grp">
          <h4>Layout</h4>
          <div class="mm-tweak-row"><span class="lab">Densidad del feed</span></div>
          <div class="mm-tweak-radio">
            ${[3,4,5].map(n => `<button class="${state.density === n ? 'active' : ''}" data-tweak-density="${n}">${n} col</button>`).join('')}
          </div>
          <div style="height:8px"></div>
          <div class="mm-tweak-row"><span class="lab">Estado del feed</span></div>
          <div class="mm-tweak-radio">
            ${[['full','Con datos'], ['empty','Vacío']].map(([v, l]) => `<button class="${state.emptyState === v ? 'active' : ''}" data-tweak-empty="${v}">${l}</button>`).join('')}
          </div>
        </div>
        <div class="grp">
          <h4>Motor lógico</h4>
          <div class="mm-tweak-row">
            <span class="lab">Lógica Prolog siempre visible</span>
            <button class="mm-toggle ${state.debugMode ? 'on' : ''}" data-tweak-debug><span class="thumb"></span></button>
          </div>
          <button class="mm-tweak-btn" data-run-agent>${T.icon('cpu', 13)} Correr agente ahora</button>
        </div>
        <div class="grp">
          <h4>Sesión</h4>
          ${state.currentUser
            ? `<button class="mm-tweak-btn" data-logout>${T.icon('logout', 13)} Cerrar sesión</button>`
            : `<button class="mm-tweak-btn" data-login-demo>${T.icon('user', 13)} Ingresar como demo (Diego)</button>`}
        </div>
        <div class="grp">
          <h4>Atajos</h4>
          <button class="mm-tweak-btn" data-shortcut="l01">Ver detalle de venta</button>
          <button class="mm-tweak-btn" data-shortcut="l09">Ver detalle de alquiler</button>
          <button class="mm-tweak-btn" data-nav="matches">Ver pantalla de matches</button>
          <button class="mm-tweak-btn" data-nav="publish">Flujo de publicar</button>
        </div>
      </div>
    </div>`;

  T.esc = esc;
})();
