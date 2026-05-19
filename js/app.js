// Mercadillo Market — vanilla state + routing + event handling

(function() {

  // ---------- STATE ----------
  const state = {
    page: 'feed',
    detailId: null,

    sede: 'ambas',
    query: '',
    chip: 'todo',
    density: 4,
    emptyState: 'full',
    debugMode: false,
    expandedDebug: new Set(),

    currentUser: null,
    extraListings: [],
    customMatches: [],
    calendarOverrides: {},
    calendarRange: { from: null, to: null },

    // login modal
    loginReason: null,
    loginStep: 'email',
    loginEmail: '',
    loginCode: ['', '', '', ''],
    loginError: '',
    profileDraft: { name: '', career: '', sede: 'la_molina' },

    // publish
    publishStep: 1,
    publishDraft: {
      title: '', description: '', category: 'libros',
      price: '', priceMax: '', condition: 'Usado', sede: 'la_molina',
      deposit: '', placeholder: 'book', type: null,
    },

    // agent
    agentRunning: false,

    // tweaks
    tweaksOpen: false,
  };

  // ---------- RENDER ----------
  const root = document.getElementById('mm-root');

  function render() {
    // Save focused element identity so we can restore after re-render
    const focusKey = (() => {
      const el = document.activeElement;
      if (!el) return null;
      const sel = el.getAttribute('id') || el.getAttribute('data-pub-field')
        || el.getAttribute('data-prof-field') || el.getAttribute('data-code-idx');
      return sel ? { key: sel, start: el.selectionStart, end: el.selectionEnd } : null;
    })();

    let mainHtml = '';
    if (state.page === 'feed')    mainHtml = MM.feedPage(state);
    if (state.page === 'detail')  mainHtml = MM.detailPage(state);
    if (state.page === 'publish') mainHtml = MM.publishPage(state);
    if (state.page === 'profile') mainHtml = MM.profilePage(state);
    if (state.page === 'matches') mainHtml = MM.matchesPage(state);

    root.innerHTML = `
      ${MM.header(state)}
      <main class="mm-frame-body" id="mm-main">${mainHtml}</main>
      ${state.loginReason ? MM.loginModal(state) : ''}
      ${MM.tweaksPanel(state)}
      <button id="mm-tweaks-fab" title="Tweaks" data-toggle-tweaks
        style="position:fixed; bottom:20px; right:20px; width:44px; height:44px; border-radius:50%;
               background:white; border:1px solid var(--slate-200); cursor:pointer; z-index:49;
               display:${state.tweaksOpen ? 'none' : 'flex'}; align-items:center; justify-content:center;
               box-shadow:0 4px 14px rgba(0,0,0,0.12); color:var(--slate-700);">
        ${MM.icon('edit', 18)}
      </button>
    `;

    // Restore focus
    if (focusKey) {
      let el;
      if (focusKey.key) {
        el = document.getElementById(focusKey.key)
          || document.querySelector(`[data-pub-field="${focusKey.key}"]`)
          || document.querySelector(`[data-prof-field="${focusKey.key}"]`)
          || document.querySelector(`[data-code-idx="${focusKey.key}"]`);
      }
      if (el) {
        el.focus();
        if (typeof focusKey.start === 'number' && el.setSelectionRange) {
          try { el.setSelectionRange(focusKey.start, focusKey.end); } catch (e) {}
        }
      }
    }
  }

  function setState(patch) {
    Object.assign(state, patch);
    render();
  }

  // ---------- NAVIGATION ----------
  function navigate(page, opts = {}) {
    state.page = page;
    if (opts.id) state.detailId = opts.id;
    if (page !== 'detail') state.calendarRange = { from: null, to: null };
    render();
    const main = document.getElementById('mm-main');
    if (main) main.scrollTop = 0;
  }

  function openListing(id) {
    state.detailId = id;
    state.page = 'detail';
    state.calendarRange = { from: null, to: null };
    render();
  }

  function openLogin(reason) {
    state.loginReason = reason || 'general';
    state.loginStep = 'email';
    state.loginEmail = '';
    state.loginCode = ['', '', '', ''];
    state.loginError = '';
    state.profileDraft = { name: '', career: '', sede: 'la_molina' };
    render();
  }
  function closeLogin() { state.loginReason = null; render(); }

  function loginAs(profile) {
    state.currentUser = {
      id: 'u0',
      name: profile.name || 'Diego Mendoza',
      career: profile.career || 'Medicina',
      sede: profile.sede || 'la_molina',
      rating: 4.7, joined: '2024-12',
    };
    state.loginReason = null;
    render();
  }

  function logout() {
    state.currentUser = null;
    state.page = 'feed';
    render();
  }

  // ---------- AGENT (matching) ----------
  function runAgent(newListing) {
    state.agentRunning = true;
    render();
    setTimeout(() => {
      if (newListing) {
        const all = MM.LISTINGS.concat(state.extraListings);
        const newMatches = [];
        all.forEach((c, i) => {
          if (c.id === newListing.id) return;
          let pedido, oferta;
          if (newListing.type === 'busco') {
            if (!['venta', 'alquiler'].includes(c.type)) return;
            if (c.category !== newListing.category) return;
            const p = parseFloat(c.price), mx = parseFloat(newListing.priceMax);
            if (isNaN(p) || isNaN(mx) || p > mx) return;
            pedido = newListing; oferta = c;
          } else {
            if (c.type !== 'busco') return;
            if (c.category !== newListing.category) return;
            const p = parseFloat(newListing.price), mx = parseFloat(c.priceMax);
            if (isNaN(p) || isNaN(mx) || p > mx) return;
            pedido = c; oferta = newListing;
          }
          const ou = MM.USERS.find(u => u.id === oferta.userId) || state.currentUser;
          const sameSede = pedido.sede === oferta.sede;
          const score = (sameSede ? 10 : 5) + (ou?.rating || 4);
          newMatches.push({
            id: `cm${Date.now()}${i}`,
            pedidoId: pedido.id,
            ofertaId: oferta.id,
            score, status: 'new',
            reasons: [
              { rule: 'misma_categoria', detail: `${pedido.category} = ${oferta.category}`, points: '+base' },
              { rule: 'precio_dentro_rango', detail: `S/ ${oferta.price || '-'} ≤ S/ ${pedido.priceMax}`, points: 'cumple' },
              { rule: sameSede ? 'misma_sede' : 'sede_distinta',
                detail: `${pedido.sede} ${sameSede ? '=' : '≠'} ${oferta.sede}`,
                points: sameSede ? '+10' : '+5' },
              { rule: 'reputacion_vendedor', detail: `rating ${(ou?.rating || 4).toFixed(1)}`, points: `+${(ou?.rating || 4).toFixed(1)}` },
            ],
          });
        });
        state.customMatches = state.customMatches.concat(newMatches);
      }
      state.agentRunning = false;
      render();
    }, 2000);
  }

  // ---------- EVENT DELEGATION ----------
  // Clicks
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-nav], [data-open-listing], [data-login], [data-close-login], [data-overlay], ' +
      '[data-sede], [data-chip], [data-clear-filters], [data-cal-pick], [data-cal-toggle], [data-cal-clear], ' +
      '[data-reserve], [data-sale-contact], [data-pub-type], [data-pub-sede], [data-pub-next], [data-pub-back], [data-pub-submit], ' +
      '[data-login-submit-email], [data-login-submit-code], [data-login-finish], [data-login-quick], [data-login-demo], ' +
      '[data-prof-sede], [data-toggle-debug], [data-toggle-tweaks], [data-tweak-density], [data-tweak-empty], [data-tweak-debug], ' +
      '[data-run-agent], [data-logout], [data-shortcut]');
    if (!t) return;

    // Plain navigation
    if (t.hasAttribute('data-nav')) {
      navigate(t.getAttribute('data-nav'));
      return;
    }
    if (t.hasAttribute('data-open-listing')) {
      openListing(t.getAttribute('data-open-listing'));
      return;
    }
    if (t.hasAttribute('data-shortcut')) {
      openListing(t.getAttribute('data-shortcut'));
      return;
    }
    if (t.hasAttribute('data-login')) { openLogin(t.getAttribute('data-login')); return; }
    if (t.hasAttribute('data-close-login')) { closeLogin(); return; }
    if (t.hasAttribute('data-overlay') && e.target === t) { closeLogin(); return; }

    // Feed
    if (t.hasAttribute('data-sede')) { state.sede = t.getAttribute('data-sede'); render(); return; }
    if (t.hasAttribute('data-chip')) { state.chip = t.getAttribute('data-chip'); render(); return; }
    if (t.hasAttribute('data-clear-filters')) {
      state.query = ''; state.chip = 'todo'; state.emptyState = 'full';
      const inp = document.getElementById('mm-search-input'); if (inp) inp.value = '';
      render(); return;
    }

    // Calendar
    if (t.hasAttribute('data-cal-pick')) {
      const day = parseInt(t.getAttribute('data-cal-pick'), 10);
      const r = state.calendarRange;
      if (r.from == null || (r.from != null && r.to != null)) {
        state.calendarRange = { from: day, to: day };
      } else if (day < r.from) {
        state.calendarRange = { from: day, to: r.from };
      } else {
        state.calendarRange = { from: r.from, to: day };
      }
      render(); return;
    }
    if (t.hasAttribute('data-cal-toggle')) {
      const day = parseInt(t.getAttribute('data-cal-toggle'), 10);
      // find rental container
      const container = t.closest('[data-rental-mgr]');
      if (!container) return;
      const lid = container.getAttribute('data-rental-mgr');
      const listing = MM.LISTINGS.concat(state.extraListings).find(l => l.id === lid);
      if (!listing) return;
      const baseOcc = (listing.occupied || []).includes(day);
      const ovs = { ...(state.calendarOverrides[lid] || {}) };
      const currentlyOcc = (ovs[day] != null) ? ovs[day] : baseOcc;
      const newOcc = !currentlyOcc;
      if (newOcc === baseOcc) delete ovs[day]; else ovs[day] = newOcc;
      state.calendarOverrides = { ...state.calendarOverrides, [lid]: ovs };
      render(); return;
    }
    if (t.hasAttribute('data-cal-clear')) {
      state.calendarRange = { from: null, to: null }; render(); return;
    }

    // Reserve
    if (t.hasAttribute('data-reserve')) {
      if (!state.currentUser) { openLogin('reservar'); return; }
      const lid = t.getAttribute('data-reserve');
      const l = MM.LISTINGS.concat(state.extraListings).find(x => x.id === lid);
      const r = state.calendarRange;
      const today = new Date();
      const f1 = new Date(today); f1.setDate(today.getDate() + Math.min(r.from, r.to));
      const f2 = new Date(today); f2.setDate(today.getDate() + Math.max(r.from, r.to));
      const fmt = d => d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short' });
      const msg = encodeURIComponent(`Hola, vi en Mercadillo Market que alquilas tu ${l.title.toLowerCase()}. Quisiera reservarlo del ${fmt(f1)} al ${fmt(f2)}. ¿Sigue disponible?`);
      window.open(`https://wa.me/51999000000?text=${msg}`, '_blank');
      return;
    }

    // Sale contact
    if (t.hasAttribute('data-sale-contact')) {
      if (!state.currentUser) { openLogin('contactar'); return; }
      const lid = t.getAttribute('data-sale-contact');
      const l = MM.LISTINGS.concat(state.extraListings).find(x => x.id === lid);
      const owner = MM.USERS.find(u => u.id === l.userId);
      const msg = encodeURIComponent(`Hola ${owner.name.split(' ')[0]}, vi en Mercadillo Market tu publicación "${l.title}". ¿Sigue disponible?`);
      window.open(`https://wa.me/51999000000?text=${msg}`, '_blank');
      return;
    }

    // Publish
    if (t.hasAttribute('data-pub-type')) {
      const type = t.getAttribute('data-pub-type');
      const placeholderForType = { venta: 'book', alquiler: 'microscope', busco: 'book' }[type] || 'book';
      state.publishDraft.type = type;
      state.publishDraft.placeholder = placeholderForType;
      render(); return;
    }
    if (t.hasAttribute('data-pub-sede')) { state.publishDraft.sede = t.getAttribute('data-pub-sede'); render(); return; }
    if (t.hasAttribute('data-pub-next')) { state.publishStep = Math.min(4, state.publishStep + 1); render(); return; }
    if (t.hasAttribute('data-pub-back')) { state.publishStep = Math.max(1, state.publishStep - 1); render(); return; }
    if (t.hasAttribute('data-pub-submit')) {
      const d = state.publishDraft;
      const newListing = {
        id: 'lnew' + Date.now(),
        userId: state.currentUser.id,
        type: d.type, category: d.category,
        title: d.title, description: d.description,
        sede: d.sede, condition: d.condition, deposit: d.deposit ? parseFloat(d.deposit) : undefined,
        price: d.price ? parseFloat(d.price) : undefined,
        priceMax: d.priceMax ? parseFloat(d.priceMax) : undefined,
        placeholder: d.placeholder || 'book',
        daysAgo: 0,
      };
      state.extraListings = [newListing, ...state.extraListings];
      // reset draft
      state.publishStep = 1;
      state.publishDraft = { title: '', description: '', category: 'libros', price: '', priceMax: '', condition: 'Usado', sede: 'la_molina', deposit: '', placeholder: 'book', type: null };
      const isBusco = newListing.type === 'busco';
      navigate(isBusco ? 'matches' : 'profile');
      runAgent(newListing);
      return;
    }

    // Login
    if (t.hasAttribute('data-login-submit-email')) {
      const email = (document.getElementById('mm-login-email')?.value || '').trim();
      state.loginEmail = email;
      if (!/^[^\s@]+@upch\.pe$/i.test(email)) {
        state.loginError = 'Solo correos @upch.pe son válidos. Otros dominios no pueden registrarse.';
        render(); return;
      }
      state.loginError = ''; state.loginStep = 'code'; render();
      setTimeout(() => { const a = document.querySelector('[data-code-idx="0"]'); if (a) a.focus(); }, 50);
      return;
    }
    if (t.hasAttribute('data-login-submit-code')) {
      if (state.loginCode.join('').length === 4) { state.loginStep = 'profile'; render(); }
      return;
    }
    if (t.hasAttribute('data-login-finish')) {
      loginAs(state.profileDraft); return;
    }
    if (t.hasAttribute('data-login-quick') || t.hasAttribute('data-login-demo')) {
      loginAs({ name: 'Diego Mendoza', career: 'Medicina', sede: 'la_molina' }); return;
    }
    if (t.hasAttribute('data-prof-sede')) {
      state.profileDraft.sede = t.getAttribute('data-prof-sede'); render(); return;
    }

    // Matches debug toggle
    if (t.hasAttribute('data-toggle-debug')) {
      const bid = t.getAttribute('data-toggle-debug');
      if (state.expandedDebug.has(bid)) state.expandedDebug.delete(bid);
      else state.expandedDebug.add(bid);
      render(); return;
    }

    // Tweaks
    if (t.hasAttribute('data-toggle-tweaks')) { state.tweaksOpen = !state.tweaksOpen; render(); return; }
    if (t.hasAttribute('data-tweak-density')) { state.density = parseInt(t.getAttribute('data-tweak-density'), 10); render(); return; }
    if (t.hasAttribute('data-tweak-empty'))   { state.emptyState = t.getAttribute('data-tweak-empty'); render(); return; }
    if (t.hasAttribute('data-tweak-debug'))   { state.debugMode = !state.debugMode; render(); return; }
    if (t.hasAttribute('data-run-agent'))     { navigate('matches'); runAgent(null); return; }
    if (t.hasAttribute('data-logout'))        { logout(); return; }
  });

  // Inputs
  document.addEventListener('input', (e) => {
    const el = e.target;
    if (el.id === 'mm-search-input') {
      state.query = el.value;
      if (state.page !== 'feed') state.page = 'feed';
      render();
      // Keep focus + cursor at end
      const r = document.getElementById('mm-search-input');
      if (r) { r.focus(); const v = r.value; r.setSelectionRange(v.length, v.length); }
      return;
    }
    if (el.hasAttribute('data-pub-field')) {
      const k = el.getAttribute('data-pub-field');
      state.publishDraft[k] = el.value;
      // light update — don't re-render heavy form unless needed
      // re-render only if affects continue button
      if (k === 'title') render();
      return;
    }
    if (el.hasAttribute('data-prof-field')) {
      const k = el.getAttribute('data-prof-field');
      state.profileDraft[k] = el.value;
      return;
    }
    if (el.hasAttribute('data-code-idx')) {
      const i = parseInt(el.getAttribute('data-code-idx'), 10);
      const v = el.value.replace(/\D/g, '').slice(-1);
      state.loginCode[i] = v;
      if (v && i < 3) {
        const next = document.querySelector(`[data-code-idx="${i+1}"]`);
        if (next) next.focus();
      }
      // re-render to enable button when full
      if (state.loginCode.join('').length === 4) render();
      return;
    }
  });

  // Change for selects
  document.addEventListener('change', (e) => {
    const el = e.target;
    if (el.hasAttribute('data-pub-field')) {
      state.publishDraft[el.getAttribute('data-pub-field')] = el.value;
      return;
    }
    if (el.hasAttribute('data-prof-field')) {
      state.profileDraft[el.getAttribute('data-prof-field')] = el.value;
      return;
    }
  });

  // Keyboard for code inputs (backspace, enter)
  document.addEventListener('keydown', (e) => {
    const el = e.target;
    if (el.hasAttribute && el.hasAttribute('data-code-idx')) {
      const i = parseInt(el.getAttribute('data-code-idx'), 10);
      if (e.key === 'Backspace' && !state.loginCode[i] && i > 0) {
        const prev = document.querySelector(`[data-code-idx="${i-1}"]`);
        if (prev) prev.focus();
      }
      if (e.key === 'Enter' && state.loginCode.join('').length === 4) {
        state.loginStep = 'profile'; render();
      }
    }
    if (el && el.id === 'mm-login-email' && e.key === 'Enter') {
      document.querySelector('[data-login-submit-email]')?.click();
    }
  });

  // ---------- BOOT ----------
  render();

})();
