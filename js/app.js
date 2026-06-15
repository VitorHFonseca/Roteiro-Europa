/* ============================================================
   Mochilão Europa — Lógica da aplicação
   Versão: 3.1 | GitHub Pages
   ============================================================ */

/* ── Estado padrão ── */
const DEFAULT_ROUTE = ['lisboa', 'madrid', 'barcelona', 'paris', 'amsterdam', 'berlim', 'praga'];

let state = {
  route: [...DEFAULT_ROUTE],
  cityDays: { lisboa: 2, madrid: 2, barcelona: 2, paris: 2, amsterdam: 2, berlim: 2, praga: 2 },
  doneDays: {},
  notes: {},
  checklist: {},
  packItems: {},
  diaryEntries: [],
  convFrom: 'BRL',
  convTo: 'EUR',
};

/* ── Persistência (localStorage) ── */
function loadState() {
  try {
    const saved = localStorage.getItem('mochilao-v3');
    if (saved) Object.assign(state, JSON.parse(saved));
  } catch (e) { console.warn('Erro ao carregar estado:', e); }
}

function saveState() {
  try {
    localStorage.setItem('mochilao-v3', JSON.stringify(state));
    const ind = document.getElementById('save-indicator');
    if (ind) { ind.classList.add('show'); setTimeout(() => ind.classList.remove('show'), 1800); }
  } catch (e) { console.warn('Erro ao salvar estado:', e); }
}

function showToast(msg, type = 'green') {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.style.background = type === 'red' ? 'var(--red)' : type === 'blue' ? 'var(--blue)' : 'var(--green)';
  t.style.color = '#09090f';
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2200);
}

/* ── Navegação ── */
function showSection(id, btn) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  const sec = document.getElementById(id);
  if (sec) sec.classList.add('active');
  if (btn) btn.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  // Renderiza a seção ativada
  const renders = {
    mapa: () => setTimeout(initMap, 100),
    paises: renderCountries,
    trens: renderTrains,
    orcamento: renderBudget,
    dicas: renderTips,
    checklist: renderChecklist,
    mochila: renderPack,
    moedas: renderCurrency,
    frases: renderPhrases,
    montador: renderBuilder,
    diario: renderDiary,
  };
  renders[id]?.();
}

/* ════════════════════════════════════════
   ROTEIRO
   ════════════════════════════════════════ */
function buildDayList() {
  const days = [];
  let d = 1;
  state.route.forEach(cid => {
    const city = DB[cid];
    if (!city) return;
    const nDays = state.cityDays[cid] || city.sugDays || 2;
    city.days.forEach((dayDef, idx) => {
      days.push({ city, dayDef, globalDay: d, key: `${cid}-${idx}` });
      d++;
    });
    // Dias extras sem agenda definida
    for (let i = city.days.length; i < nDays; i++) {
      days.push({ city, dayDef: { t: 'Dia livre', a: ['Explore o bairro no seu ritmo', 'Descanse, coma bem e anote memórias'] }, globalDay: d, key: `${cid}-${i}` });
      d++;
    }
  });
  return days;
}

function renderRoteiro() {
  const days = buildDayList();
  const total = days.length;
  const done = days.filter(d => state.doneDays[d.key]).length;
  const pct = total ? Math.round(done / total * 100) : 0;

  document.getElementById('stat-dias').textContent = total;
  document.getElementById('stat-cidades').textContent = state.route.length;
  document.getElementById('stat-cidades-sub').textContent =
    state.route.length > 1
      ? `${DB[state.route[0]]?.name || ''} → ${DB[state.route[state.route.length - 1]]?.name || ''}`
      : (DB[state.route[0]]?.name || '—');

  const totalCpd = state.route.reduce((a, cid) => {
    const city = DB[cid]; if (!city) return a;
    return a + city.cpd * (state.cityDays[cid] || city.sugDays || 2);
  }, 0);
  document.getElementById('stat-custo').textContent = `€${Math.round((totalCpd + 515) / 10) * 10}`;
  document.getElementById('done-val').textContent = done;
  document.getElementById('done-sub').textContent = `de ${total} dias · ${pct}%`;
  document.getElementById('pct-text').textContent = `${pct}%`;
  document.getElementById('prog').style.width = `${pct}%`;

  // Hero route strip
  const strip = document.getElementById('hero-route-strip');
  if (strip) {
    strip.innerHTML = state.route.map((cid, i) => {
      const c = DB[cid]; if (!c) return '';
      return `${i > 0 ? '<span class="route-arrow">→</span>' : ''}<span class="route-city">${c.flag} ${c.name}</span>`;
    }).join('');
  }

  // Day cards
  const container = document.getElementById('days-container');
  container.innerHTML = '';
  days.forEach(({ city, dayDef, globalDay, key }) => {
    const isDone = !!state.doneDays[key];
    const div = document.createElement('div');
    div.className = `day-card${isDone ? ' done' : ''}`;
    div.id = `day-${key}`;

    const photoHtml = city.img
      ? `<div class="day-photo"><img src="${city.img}" loading="lazy" alt="${city.name}">
           <div class="day-photo-overlay"><span class="day-photo-title">${dayDef.t}</span></div></div>`
      : `<div class="day-photo-grad" style="background:linear-gradient(135deg,${city.color}22,${city.color}44)">
           <span style="font-size:2rem">${city.flag}</span>
           <span style="font-family:'Playfair Display',serif;color:var(--text);font-size:.95rem">${dayDef.t}</span></div>`;

    const hlHtml = city.hl.slice(0, 4).map(h => `
      <div class="hl-chip">
        <div><div class="hl-name">${h[0]}</div></div>
        <div class="hl-cost">${h[1]}</div>
      </div>`).join('');

    const activitiesHtml = dayDef.a.map(a => `
      <div class="activity-item">
        <div class="activity-dot" style="background:${city.color}"></div>
        <span>${a}</span>
      </div>`).join('');

    const note = state.notes[key] || '';

    div.innerHTML = `
      <div class="day-header" onclick="toggleDay('${key}')">
        <div class="day-num" style="background:${city.color}22;color:${city.color}">D${globalDay}</div>
        <div class="day-flag">${city.flag}</div>
        <div class="day-info">
          <h3>${city.name} — ${dayDef.t}</h3>
          <p>${city.country} · ~€${city.cpd}/dia</p>
        </div>
        <div class="day-cost">~€${city.cpd}</div>
        <div class="day-check ${isDone ? 'done' : ''}" onclick="event.stopPropagation();toggleDone('${key}')">${isDone ? '✓' : ''}</div>
        <svg class="day-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
      </div>
      <div class="day-body">
        ${photoHtml}
        <div class="activity-list">${activitiesHtml}</div>
        <div class="day-highlights">${hlHtml}</div>
        <button class="day-note-btn" onclick="toggleNote('${key}')">📝 ${note ? 'Ver/editar nota' : 'Adicionar nota'}</button>
        <div class="day-note-area ${note ? 'open' : ''}" id="note-${key}">
          <textarea placeholder="Anote planos, reservas, dicas..." oninput="saveNote('${key}',this.value)">${note}</textarea>
        </div>
      </div>`;
    container.appendChild(div);
  });
}

function toggleDay(key) {
  document.getElementById(`day-${key}`)?.classList.toggle('open');
}
function toggleDone(key) {
  state.doneDays[key] = !state.doneDays[key];
  saveState();
  renderRoteiro();
}
function toggleNote(key) {
  document.getElementById(`note-${key}`)?.classList.toggle('open');
}
function saveNote(key, val) {
  state.notes[key] = val;
  saveState();
}

/* ════════════════════════════════════════
   MAPA SVG
   ════════════════════════════════════════ */
function latLngToSVG(lat, lng) {
  const minLng = -12, maxLng = 42, minLat = 35, maxLat = 72;
  const x = ((lng - minLng) / (maxLng - minLng)) * 950 + 25;
  const y = ((maxLat - lat) / (maxLat - minLat)) * 560 + 20;
  return { x, y };
}

let activeTooltipCid = null;
let mapRendered = false;

function initMap() {
  if (mapRendered) { updateMapMarkers(); return; }
  mapRendered = true;
  updateMapMarkers();
  document.getElementById('svg-map')?.addEventListener('click', e => {
    const tag = e.target.tagName.toLowerCase();
    if (['svg', 'rect', 'path', 'line'].includes(tag)) hideTooltip();
  });
}

function updateMapMarkers() {
  const markersG = document.getElementById('city-markers');
  const linesG = document.getElementById('route-lines');
  if (!markersG || !linesG) return;

  const routeCities = state.route.map(cid => DB[cid]).filter(Boolean);
  let linesHTML = '';
  for (let i = 0; i < routeCities.length - 1; i++) {
    const a = latLngToSVG(routeCities[i].lat, routeCities[i].lng);
    const b = latLngToSVG(routeCities[i + 1].lat, routeCities[i + 1].lng);
    linesHTML += `<line x1="${a.x.toFixed(1)}" y1="${a.y.toFixed(1)}" x2="${b.x.toFixed(1)}" y2="${b.y.toFixed(1)}" stroke="rgba(232,201,122,0.5)" stroke-width="1.5" stroke-dasharray="6,5"/>`;
  }
  linesG.innerHTML = linesHTML;

  let markersHTML = '';
  Object.values(DB).forEach(city => {
    const inRoute = state.route.includes(city.id);
    const { x, y } = latLngToSVG(city.lat, city.lng);
    const color = inRoute ? city.color : '#555';
    const r = inRoute ? 8 : 5;
    const glow = inRoute ? `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r + 6}" fill="${city.color}22"/>` : '';
    markersHTML += `
      <g class="city-dot" data-cid="${city.id}" style="cursor:pointer" onclick="showCityTooltip('${city.id}',event)">
        ${glow}
        <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}" fill="${color}" stroke="${inRoute ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.3)'}" stroke-width="${inRoute ? 1.5 : 1}"/>
        ${inRoute ? `<text x="${(x + r + 3).toFixed(1)}" y="${(y + 4).toFixed(1)}" fill="${city.color}" font-size="9" font-family="DM Sans,sans-serif" font-weight="600" style="pointer-events:none">${city.name}</text>` : ''}
      </g>`;
  });
  markersG.innerHTML = markersHTML;
}

function showCityTooltip(cid, event) {
  event.stopPropagation();
  const city = DB[cid];
  if (!city) return;
  activeTooltipCid = cid;
  const inRoute = state.route.includes(cid);

  const photoHtml = city.popupImg
    ? `<img src="${city.popupImg}" class="popup-img" alt="${city.name}" loading="lazy">`
    : `<div class="popup-grad" style="background:linear-gradient(135deg,${city.color}44,${city.color}22)">${city.flag}</div>`;

  const btnHtml = inRoute
    ? `<button class="popup-add-btn" style="background:rgba(239,68,68,.1);border-color:rgba(239,68,68,.3);color:#ef4444" onclick="toggleRouteMap('${cid}')">✕ Remover do roteiro</button>`
    : `<button class="popup-add-btn" onclick="toggleRouteMap('${cid}')">+ Adicionar ao roteiro</button>`;

  const tooltip = document.getElementById('map-tooltip');
  tooltip.innerHTML = `
    ${photoHtml}
    <div class="popup-name">${city.flag} ${city.name}</div>
    <div class="popup-sub">${city.country} · ${city.temp} em outubro</div>
    <div class="popup-desc">${city.desc}</div>
    <div class="popup-info">
      <div class="popup-info-box"><div class="popup-info-label">Hostel</div><div class="popup-info-val">${city.hostel}</div></div>
      <div class="popup-info-box"><div class="popup-info-label">Refeição</div><div class="popup-info-val">${city.ref}</div></div>
    </div>
    ${btnHtml}`;

  const container = document.querySelector('.map-container');
  const rect = container.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const clickY = event.clientY - rect.top;

  tooltip.classList.add('show');
  const tw = 268, th = 320;
  let left = clickX + 12;
  let top = clickY - 40;
  if (left + tw > rect.width - 10) left = clickX - tw - 12;
  if (top + th > rect.height - 10) top = rect.height - th - 10;
  if (top < 5) top = 5;
  if (left < 5) left = 5;
  tooltip.style.left = left + 'px';
  tooltip.style.top = top + 'px';
}

function hideTooltip() {
  document.getElementById('map-tooltip')?.classList.remove('show');
  activeTooltipCid = null;
}

function toggleRouteMap(cid) {
  const city = DB[cid];
  if (state.route.includes(cid)) {
    state.route = state.route.filter(x => x !== cid);
    showToast(`${city.name} removida do roteiro`);
  } else {
    state.route.push(cid);
    if (!state.cityDays[cid]) state.cityDays[cid] = city.sugDays || 2;
    showToast(`${city.flag} ${city.name} adicionada!`);
  }
  saveState();
  renderRoteiro();
  updateMapMarkers();
  hideTooltip();
}

/* ════════════════════════════════════════
   MONTADOR
   ════════════════════════════════════════ */
let builderFilter = 'todos';

function renderBuilder() {
  const countries = [...new Set(Object.values(DB).map(c => c.country))].sort();
  const pf = document.getElementById('palette-filter');
  if (pf) {
    pf.innerHTML = ['Todos', ...countries].map(c => `
      <button class="pf-btn ${(c === 'Todos' ? 'todos' : c) === builderFilter ? 'active' : ''}"
        onclick="setBuilderFilter('${c === 'Todos' ? 'todos' : c}')">${c}</button>`).join('');
  }
  const filtered = Object.values(DB).filter(c => builderFilter === 'todos' || c.country === builderFilter);
  const palette = document.getElementById('city-palette');
  if (palette) {
    palette.innerHTML = filtered.map(city => `
      <div class="city-chip ${state.route.includes(city.id) ? 'active' : ''}" onclick="toggleBuilderCity('${city.id}')">
        <span class="chip-flag">${city.flag}</span>
        <div class="chip-info"><span class="chip-name">${city.name}</span><span class="chip-country">${city.country}</span></div>
        <span class="chip-cpd" style="color:${city.color}">€${city.cpd}/d</span>
      </div>`).join('');
  }
  renderRouteList();
}

function setBuilderFilter(f) { builderFilter = f; renderBuilder(); }

function toggleBuilderCity(cid) {
  if (state.route.includes(cid)) {
    state.route = state.route.filter(x => x !== cid);
  } else {
    state.route.push(cid);
    if (!state.cityDays[cid]) state.cityDays[cid] = DB[cid].sugDays || 2;
  }
  renderBuilder();
}

function renderRouteList() {
  const list = document.getElementById('route-list');
  if (!list) return;
  if (!state.route.length) {
    list.innerHTML = '<div class="route-empty">Selecione cidades ao lado →</div>';
    document.getElementById('route-stats').innerHTML = 'Selecione cidades para começar';
    return;
  }
  list.innerHTML = state.route.map((cid, i) => {
    const city = DB[cid];
    const nDays = state.cityDays[cid] || city.sugDays || 2;
    return `
      <div class="route-row">
        <div class="route-num">${i + 1}</div>
        <div class="route-flag">${city.flag}</div>
        <div class="route-info">
          <div class="route-city-name">${city.name}</div>
          <div class="route-city-meta">€${city.cpd}/dia · ${city.temp}</div>
        </div>
        <div class="days-ctrl">
          <button onclick="changeRouteDays('${cid}',-1)">−</button>
          <span>${nDays}d</span>
          <button onclick="changeRouteDays('${cid}',1)">+</button>
        </div>
        <div class="order-btns">
          <button ${i === 0 ? 'disabled' : ''} onclick="moveRoute(${i},-1)">↑</button>
          <button ${i === state.route.length - 1 ? 'disabled' : ''} onclick="moveRoute(${i},1)">↓</button>
        </div>
        <button class="remove-btn" onclick="removeRoute('${cid}')" title="Remover">✕</button>
      </div>`;
  }).join('');

  const totalDays = state.route.reduce((a, cid) => a + (state.cityDays[cid] || DB[cid].sugDays || 2), 0);
  const totalCost = state.route.reduce((a, cid) => a + DB[cid].cpd * (state.cityDays[cid] || DB[cid].sugDays || 2), 0);
  document.getElementById('route-stats').innerHTML =
    `<strong>${state.route.length}</strong> cidades · <strong>${totalDays}</strong> dias · ~<strong>€${totalCost + 515}</strong>`;
}

function changeRouteDays(cid, delta) {
  state.cityDays[cid] = Math.min(7, Math.max(1, (state.cityDays[cid] || DB[cid].sugDays || 2) + delta));
  renderRouteList();
}
function moveRoute(i, dir) {
  const j = i + dir;
  [state.route[i], state.route[j]] = [state.route[j], state.route[i]];
  renderBuilder();
}
function removeRoute(cid) {
  state.route = state.route.filter(x => x !== cid);
  renderBuilder();
}
function applyRoute() {
  saveState();
  renderRoteiro();
  showToast('✓ Roteiro confirmado e salvo!');
  document.querySelectorAll('.nav-btn').forEach(b => {
    b.classList.toggle('active', b.textContent.includes('Roteiro'));
  });
  showSection('roteiro', document.querySelector('.nav-btn[onclick*="roteiro"]'));
}

/* ════════════════════════════════════════
   INTELIGÊNCIA ARTIFICIAL
   ════════════════════════════════════════ */
function toggleAiKeyForm() {
  document.getElementById('ai-key-form')?.classList.toggle('open');
}

function saveAiKey() {
  const input = document.getElementById('ai-key-input');
  const key = input?.value?.trim();
  if (!key || !key.startsWith('sk-')) {
    showToast('Chave inválida. Deve começar com "sk-"', 'red');
    return;
  }
  localStorage.setItem('anthropic-key', key);
  document.getElementById('ai-key-form')?.classList.remove('open');
  showToast('🔑 Chave salva com sucesso!');
}

async function callAI() {
  const apiKey = localStorage.getItem('anthropic-key');
  if (!apiKey) {
    document.getElementById('ai-key-form')?.classList.add('open');
    showToast('Insira sua API Key da Anthropic para usar esta função', 'blue');
    return;
  }

  const btn = document.getElementById('ai-btn');
  const content = document.getElementById('ai-content');
  btn.disabled = true;
  content.innerHTML = `<div class="ai-loading"><div class="ai-spinner"></div>Gerando dicas personalizadas com IA…</div>`;

  const cities = state.route.map(cid => DB[cid]).filter(Boolean).map(c => c.name).join(', ');
  const prompt = `Você é especialista em mochilão pela Europa em outubro. O roteiro é: ${cities}.
Para cada cidade, dê 2 dicas exclusivas de outubro (clima/eventos sazonais) e 2 dicas de economia específicas.
Seja bem prático e específico. Ao final, um resumo motivacional de 2 linhas sobre este roteiro.
Responda APENAS em JSON com esta estrutura:
{"cities":[{"name":"Nome","flag":"🏳","outubro":["dica1","dica2"],"economia":["dica1","dica2"]}],"resumo":"texto"}`;

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-opus-4-5',
        max_tokens: 1200,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `HTTP ${res.status}`);
    }

    const data = await res.json();
    const text = data.content?.map(b => b.text || '').join('') || '';
    const clean = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);

    content.innerHTML = `
      <div class="ai-results">
        ${parsed.cities.map(c => `
          <div class="ai-city-block">
            <div class="ai-city-top"><span class="ai-city-emoji">${c.flag}</span><span class="ai-city-name">${c.name}</span></div>
            <div class="ai-city-body">
              <div><div class="ai-col-title">🍂 Dicas de outubro</div>${c.outubro.map(t => `<div class="ai-tip-item">${t}</div>`).join('')}</div>
              <div><div class="ai-col-title">💶 Economize assim</div>${c.economia.map(t => `<div class="ai-tip-item">${t}</div>`).join('')}</div>
            </div>
          </div>`).join('')}
        <div class="ai-resumo">✨ ${parsed.resumo}</div>
      </div>`;
  } catch (e) {
    content.innerHTML = `<div class="ai-error">⚠️ Erro: ${e.message}. Verifique sua API Key e tente novamente.</div>`;
  }
  btn.disabled = false;
}

/* ════════════════════════════════════════
   PAÍSES
   ════════════════════════════════════════ */
let countryFilter = 'todos';

function renderCountries() {
  const countries = [...new Set(Object.values(DB).map(c => c.country))].sort();
  const cf = document.getElementById('country-filter');
  if (cf) {
    cf.innerHTML = ['Todos', ...countries].map(c => {
      const cnt = c === 'Todos' ? Object.keys(DB).length : Object.values(DB).filter(x => x.country === c).length;
      return `<button class="cf-btn ${(c === 'Todos' ? 'todos' : c) === countryFilter ? 'active' : ''}"
        onclick="filterCountry('${c === 'Todos' ? 'todos' : c}')">
        ${c} <span class="cf-count">${cnt}</span></button>`;
    }).join('');
  }

  const filtered = Object.values(DB).filter(c => countryFilter === 'todos' || c.country === countryFilter);
  const container = document.getElementById('countries-container');
  if (!container) return;

  container.innerHTML = filtered.map(city => {
    const inRoute = state.route.includes(city.id);
    const photoHtml = city.img
      ? `<img src="${city.img}" alt="${city.name}" loading="lazy">`
      : `<div style="height:200px;background:linear-gradient(135deg,${city.color}44,${city.color}22);display:flex;align-items:center;justify-content:center;font-size:4rem">${city.flag}</div>`;
    const hlItems = city.hl.map(h => `
      <div class="country-hl-item">
        <div class="country-hl-name">${h[0]}</div>
        <div class="country-hl-meta"><span class="country-hl-cost">${h[1]}</span><span class="country-hl-tip">${h[2]}</span></div>
      </div>`).join('');
    return `
      <div class="country-card">
        <div class="country-photo">
          ${photoHtml}
          <div class="country-photo-overlay">
            <div><div class="country-photo-name">${city.flag} ${city.name}</div><div class="country-photo-sub">${city.country}</div></div>
            <span style="background:${city.color};color:#09090f;padding:3px 10px;border-radius:100px;font-size:11px;font-weight:700">${city.temp}</span>
          </div>
        </div>
        <div class="country-body">
          <p class="country-desc">${city.desc}</p>
          <div class="info-grid">
            <div class="info-box"><div class="info-box-label">Hostel/noite</div><div class="info-box-val">${city.hostel}</div></div>
            <div class="info-box"><div class="info-box-label">Refeição local</div><div class="info-box-val">${city.ref}</div></div>
            <div class="info-box"><div class="info-box-label">Moeda</div><div class="info-box-val">${city.moeda}</div></div>
            <div class="info-box"><div class="info-box-label">Transporte</div><div class="info-box-val">${city.transit}</div></div>
          </div>
          <div class="country-hl-grid">${hlItems}</div>
          <div class="flex-between mt-sm">
            <a href="${city.link}" target="_blank" rel="noopener" class="country-link">↗ Site oficial</a>
            <button class="popup-add-btn" style="width:auto;padding:5px 14px;${inRoute ? 'background:rgba(239,68,68,.1);border-color:rgba(239,68,68,.3);color:#ef4444' : ''}"
              onclick="toggleRouteFromCountry('${city.id}',this)">
              ${inRoute ? '✕ Remover' : '+ Adicionar ao roteiro'}
            </button>
          </div>
        </div>
      </div>`;
  }).join('');
}

function filterCountry(f) { countryFilter = f; renderCountries(); }
function toggleRouteFromCountry(cid, btn) {
  if (state.route.includes(cid)) {
    state.route = state.route.filter(x => x !== cid);
    btn.textContent = '+ Adicionar ao roteiro';
    btn.style.cssText = 'width:auto;padding:5px 14px;';
    showToast(`${DB[cid].name} removida`);
  } else {
    state.route.push(cid);
    if (!state.cityDays[cid]) state.cityDays[cid] = DB[cid].sugDays || 2;
    btn.textContent = '✕ Remover';
    btn.style.cssText = 'width:auto;padding:5px 14px;background:rgba(239,68,68,.1);border-color:rgba(239,68,68,.3);color:#ef4444';
    showToast(`${DB[cid].flag} ${DB[cid].name} adicionada!`);
  }
  saveState();
  renderRoteiro();
}

/* ════════════════════════════════════════
   TRENS
   ════════════════════════════════════════ */
function renderTrains() {
  const container = document.getElementById('trains-container');
  if (!container) return;
  container.innerHTML = '';
  for (let i = 0; i < state.route.length - 1; i++) {
    const from = state.route[i], to = state.route[i + 1];
    const key = `${from}-${to}`;
    const train = TRAINS[key] || { time: 'Ver horários', cost: '€20–80', type: '🚆 Trem', tip: '' };
    const cf = DB[from], ct = DB[to];
    if (!cf || !ct) continue;
    const div = document.createElement('div');
    div.className = 'train-row';
    div.innerHTML = `
      <div class="train-icons">${cf.flag}<span class="train-dash">───</span>${ct.flag}</div>
      <div class="train-meta">
        <div class="train-route">${cf.name} → ${ct.name}</div>
        <div class="train-detail">${train.type}${train.tip ? ` · <span style="color:var(--gold)">${train.tip}</span>` : ''}</div>
      </div>
      <div class="train-right">
        <div class="train-time">${train.time}</div>
        <div class="train-cost">${train.cost}</div>
      </div>`;
    container.appendChild(div);
  }
  if (!container.innerHTML) {
    container.innerHTML = '<div class="empty-state">Adicione mais cidades ao roteiro para ver as conexões de trem.</div>';
  }
}

/* ════════════════════════════════════════
   ORÇAMENTO
   ════════════════════════════════════════ */
function renderBudget() {
  const fixedCosts = 515; // Eurail + reservas + seguro + eSIM + misc
  const hostelTotal = state.route.reduce((a, cid) => {
    const c = DB[cid]; if (!c) return a;
    const n = state.cityDays[cid] || c.sugDays || 2;
    return a + 25 * n;
  }, 0);
  const foodTotal = state.route.reduce((a, cid) => {
    const c = DB[cid]; if (!c) return a;
    return a + 22 * (state.cityDays[cid] || c.sugDays || 2);
  }, 0);
  const musTotal = state.route.reduce((a, cid) => {
    const c = DB[cid]; if (!c) return a;
    return a + 15 * (state.cityDays[cid] || c.sugDays || 2);
  }, 0);
  const transTotal = state.route.reduce((a, cid) => {
    const c = DB[cid]; if (!c) return a;
    return a + 6 * (state.cityDays[cid] || c.sugDays || 2);
  }, 0);
  const totalDays = state.route.reduce((a, cid) => a + (state.cityDays[cid] || DB[cid]?.sugDays || 2), 0);
  const grandTotal = hostelTotal + foodTotal + fixedCosts + musTotal + transTotal;

  document.getElementById('budget-total').textContent = `€${grandTotal}`;
  document.getElementById('budget-days').textContent = `${totalDays} dias`;
  document.getElementById('bd-hostel').textContent = `€${hostelTotal}`;
  document.getElementById('bd-food').textContent = `€${foodTotal}`;
  document.getElementById('bd-mus').textContent = `€${musTotal}`;
  document.getElementById('bd-trans').textContent = `€${transTotal}`;

  const cats = [
    { label: 'Acomodação',     val: hostelTotal, color: 'var(--blue)' },
    { label: 'Alimentação',    val: foodTotal,   color: 'var(--green)' },
    { label: 'Eurail Pass',    val: 290,         color: 'var(--gold)' },
    { label: 'Atrações',       val: musTotal,    color: 'var(--purple)' },
    { label: 'Trans. local',   val: transTotal,  color: 'var(--amber)' },
    { label: 'Outros',         val: fixedCosts - 290, color: 'var(--muted)' },
  ];
  document.getElementById('budget-bars').innerHTML = cats.map(c => `
    <div class="budget-bar-item">
      <div class="budget-bar-label">${c.label}</div>
      <div class="budget-bar-track"><div class="budget-bar-fill" style="width:${Math.round(c.val / grandTotal * 100)}%;background:${c.color}"></div></div>
      <div class="budget-bar-val">€${c.val}</div>
    </div>`).join('');

  document.getElementById('city-costs').innerHTML = state.route.map(cid => {
    const c = DB[cid]; if (!c) return '';
    return `<div class="city-cost-card">
      <div class="city-cost-flag">${c.flag}</div>
      <div class="city-cost-name">${c.name}</div>
      <div class="city-cost-val">€${c.cpd}/dia</div>
    </div>`;
  }).join('');
}

/* ════════════════════════════════════════
   DICAS
   ════════════════════════════════════════ */
function renderTips() {
  const container = document.getElementById('tips-container');
  if (!container) return;
  container.innerHTML = TIPS.map(t => `
    <div class="tip-card">
      <div class="tip-icon-wrap" style="background:${t.color}"><span>${t.icon}</span></div>
      <div class="tip-title">${t.title}</div>
      <div class="tip-text">${t.text}</div>
    </div>`).join('');
}

/* ════════════════════════════════════════
   CHECKLIST
   ════════════════════════════════════════ */
function renderChecklist() {
  const container = document.getElementById('checklist-container');
  if (!container) return;
  const total = CHECKLIST.filter(i => i.id).length;
  const done = CHECKLIST.filter(i => i.id && state.checklist[i.id]).length;
  const pct = total ? Math.round(done / total * 100) : 0;
  document.getElementById('cl-pct').textContent = `${pct}%`;
  document.getElementById('cl-prog').style.width = `${pct}%`;

  container.innerHTML = CHECKLIST.map(item => {
    if (item.cat) return `<div class="cl-category">${item.cat}</div>`;
    const checked = !!state.checklist[item.id];
    return `<div class="check-item ${checked ? 'checked' : ''}" onclick="toggleCheck('${item.id}')">
      <div class="check-box">${checked ? '✓' : ''}</div>
      <div class="check-text">${item.text}</div>
    </div>`;
  }).join('');
}

function toggleCheck(id) {
  state.checklist[id] = !state.checklist[id];
  saveState();
  renderChecklist();
}

/* ════════════════════════════════════════
   MOCHILA
   ════════════════════════════════════════ */
let packCat = PACK_ITEMS[0].cat;

function renderPack() {
  const cats = document.getElementById('pack-cats');
  if (cats) {
    cats.innerHTML = PACK_ITEMS.map(g => `
      <button class="pack-cat-btn ${packCat === g.cat ? 'active' : ''}" onclick="setPackCat('${g.cat.replace(/'/g, "\\'")}')">${g.cat}</button>`).join('');
  }

  const group = PACK_ITEMS.find(g => g.cat === packCat);
  const grid = document.getElementById('pack-items');
  if (grid && group) {
    grid.innerHTML = group.items.map(item => {
      const checked = !!state.packItems[item.id];
      return `<div class="pack-item ${checked ? 'checked' : ''}" onclick="togglePack('${item.id}')">
        <div class="pack-item-info">
          <div class="pack-item-name">${item.name}</div>
          <div class="pack-item-weight">~${item.weight}kg</div>
        </div>
        <div class="pack-check">${checked ? '✓' : ''}</div>
      </div>`;
    }).join('');
  }

  let totalW = 0;
  const summary = {};
  PACK_ITEMS.forEach(g => {
    let gW = 0;
    g.items.forEach(item => {
      if (state.packItems[item.id]) { totalW += item.weight; gW += item.weight; }
    });
    summary[g.cat] = gW;
  });

  const maxW = 15;
  const weightEl = document.getElementById('pack-total-weight');
  const progEl = document.getElementById('pack-prog');
  if (weightEl) weightEl.textContent = `${totalW.toFixed(2)} kg`;
  if (progEl) {
    progEl.style.width = `${Math.min(100, totalW / maxW * 100)}%`;
    progEl.style.background = totalW <= 8 ? 'var(--green)' : totalW <= 12 ? 'var(--amber)' : 'var(--red)';
  }

  const summaryEl = document.getElementById('pack-summary');
  if (summaryEl) {
    summaryEl.innerHTML = PACK_ITEMS.map(g => `
      <div class="pack-weight-box">
        <div class="pack-weight-label">${g.cat.split(' ')[0]}</div>
        <div class="pack-weight-val" style="color:${summary[g.cat] > 0 ? 'var(--gold)' : 'var(--muted)'}">${summary[g.cat].toFixed(1)}kg</div>
      </div>`).join('');
  }
}

function setPackCat(cat) { packCat = cat; renderPack(); }
function togglePack(id) {
  state.packItems[id] = !state.packItems[id];
  saveState();
  renderPack();
}

/* ════════════════════════════════════════
   MOEDAS
   ════════════════════════════════════════ */
let convSwapped = false;

function renderCurrency() {
  updateConverter();
  const chips = document.getElementById('conv-chips');
  if (chips) {
    chips.innerHTML = '<span style="font-size:11px;color:var(--muted)">Rápido:</span>' +
      [10, 20, 50, 100, 200, 500].map(v =>
        `<button class="currency-chip" onclick="document.getElementById('conv-amount').value=${v};updateConverter()">${v}</button>`
      ).join('');
  }
  const ratesGrid = document.getElementById('rates-grid');
  if (ratesGrid) {
    ratesGrid.innerHTML = Object.entries(RATES).map(([k, r]) => `
      <div class="rate-card">
        <div class="rate-flag">${r.flag}</div>
        <div class="rate-currency">${k}</div>
        <div class="rate-value">R$ ${r.brl.toFixed(2)}</div>
        <div class="rate-unit">por 1 ${k}</div>
      </div>`).join('');
  }
}

function updateConverter() {
  const amount = parseFloat(document.getElementById('conv-amount')?.value) || 100;
  const currency = document.getElementById('conv-currency')?.value || 'EUR';
  const rate = RATES[currency];
  if (!rate) return;

  const resultEl = document.getElementById('conv-result');
  const labelEl = document.getElementById('conv-label');
  const rateEl = document.getElementById('conv-rate');

  if (!convSwapped) {
    const result = amount / rate.brl;
    if (resultEl) resultEl.textContent = `${rate.flag} ${result.toFixed(2)} ${currency}`;
    if (labelEl) labelEl.textContent = `BRL → ${currency}`;
    if (rateEl) rateEl.textContent = `R$ 1 ≈ ${currency} ${(1 / rate.brl).toFixed(4)}`;
  } else {
    const result = amount * rate.brl;
    if (resultEl) resultEl.textContent = `R$ ${result.toFixed(2)}`;
    if (labelEl) labelEl.textContent = `${currency} → BRL`;
    if (rateEl) rateEl.textContent = `1 ${currency} ≈ R$ ${rate.brl.toFixed(2)}`;
  }
}

function swapCurrencies() {
  convSwapped = !convSwapped;
  updateConverter();
}

/* ════════════════════════════════════════
   FRASES
   ════════════════════════════════════════ */
let phrasesCat = 'basico', phrasesLang = 'es';

function renderPhrases() {
  const filterDiv = document.getElementById('phrases-filter');
  const cats = [
    { id: 'basico', label: '🙋 Básico' },
    { id: 'comida', label: '🍽️ Comida' },
    { id: 'transporte', label: '🚆 Transporte' },
    { id: 'emergencia', label: '🆘 Emergência' }
  ];
  if (filterDiv) {
    filterDiv.innerHTML = cats.map(c =>
      `<button class="phrase-cat-btn ${phrasesCat === c.id ? 'active' : ''}" onclick="setPhrasesCat('${c.id}')">${c.label}</button>`
    ).join('');
  }

  const grid = document.getElementById('phrases-grid');
  if (!grid) return;
  const langBar = `<div class="phrase-lang-bar">${Object.entries(LANG_NAMES).map(([k, v]) =>
    `<button class="phrase-lang-tab ${phrasesLang === k ? 'active' : ''}" onclick="setPhrasesLang('${k}')">${v}</button>`
  ).join('')}</div>`;

  const items = PHRASES[phrasesCat] || [];
  grid.innerHTML = langBar + items.map(p => {
    const translation = p[phrasesLang] || '—';
    const safeTranslation = translation.replace(/'/g, "\\'");
    return `<div class="phrase-card" onclick="copyPhrase('${safeTranslation}')">
      <div class="phrase-pt">${p.pt}</div>
      <div class="phrase-translation">${translation}</div>
      <div class="phrase-copy">Toque para copiar</div>
    </div>`;
  }).join('');
}

function setPhrasesCat(cat) { phrasesCat = cat; renderPhrases(); }
function setPhrasesLang(lang) { phrasesLang = lang; renderPhrases(); }
function copyPhrase(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text)
      .then(() => showToast(`✓ Copiado: "${text}"`))
      .catch(() => showToast(`"${text}"`));
  } else {
    showToast(`"${text}"`);
  }
}

/* ════════════════════════════════════════
   DIÁRIO DE VIAGEM
   ════════════════════════════════════════ */
function renderDiary() {
  const sel = document.getElementById('diary-city-sel');
  if (sel) {
    sel.innerHTML = state.route.map(cid => {
      const c = DB[cid]; if (!c) return '';
      return `<option value="${cid}">${c.flag} ${c.name}</option>`;
    }).join('');
  }

  const entries = state.diaryEntries;
  const countEl = document.getElementById('diary-count');
  if (countEl) {
    countEl.textContent = entries.length
      ? `${entries.length} entrada${entries.length > 1 ? 's' : ''} registrada${entries.length > 1 ? 's' : ''}`
      : 'Nenhuma entrada ainda';
  }

  const statsBar = document.getElementById('diary-stats-bar');
  if (statsBar && entries.length > 0) {
    const totalSpent = entries.reduce((a, e) => a + (parseFloat(e.spent) || 0), 0);
    const avgRating = (entries.reduce((a, e) => a + (parseInt(e.rating) || 5), 0) / entries.length).toFixed(1);
    const cities = [...new Set(entries.map(e => e.city))].length;
    statsBar.style.display = 'flex';
    statsBar.innerHTML = `
      <div class="diary-stat"><div class="diary-stat-val">${entries.length}</div><div class="diary-stat-label">Entradas</div></div>
      <div class="diary-stat"><div class="diary-stat-val">${cities}</div><div class="diary-stat-label">Cidades</div></div>
      <div class="diary-stat"><div class="diary-stat-val">R$${totalSpent.toFixed(0)}</div><div class="diary-stat-label">Gastos</div></div>
      <div class="diary-stat"><div class="diary-stat-val">${avgRating}★</div><div class="diary-stat-label">Nota média</div></div>`;
  } else if (statsBar) {
    statsBar.style.display = 'none';
  }

  const container = document.getElementById('diary-entries');
  if (!container) return;
  if (!entries.length) {
    container.innerHTML = '<div class="diary-empty"><span class="diary-empty-emoji">📖</span>Nenhuma entrada ainda.<br>Comece a documentar sua aventura!</div>';
    return;
  }

  container.innerHTML = [...entries].reverse().map((e, ri) => {
    const i = entries.length - 1 - ri;
    const city = DB[e.city];
    const stars = '⭐'.repeat(parseInt(e.rating) || 5);
    // ✅ BUG CORRIGIDO: removido o '}' extra que estava quebrando o template
    const dateLine = `${e.date || ''} · ${city?.name || e.city}${e.spent ? ` · R$${parseFloat(e.spent).toFixed(2)}` : ''}`;
    return `<div class="diary-entry">
      <div class="diary-entry-header">
        <div class="diary-entry-flag">${city?.flag || '🌍'}</div>
        <div class="diary-entry-meta">
          <div class="diary-entry-city">${e.title || city?.name || e.city}</div>
          <div class="diary-entry-date">${dateLine}</div>
        </div>
        <div class="diary-entry-mood">${e.mood || '😊'}</div>
        <button class="diary-entry-del" onclick="deleteDiaryEntry(${i})" title="Apagar entrada">✕</button>
      </div>
      ${e.text ? `<div class="diary-entry-body">${e.text}<div class="diary-entry-rating">${stars}</div></div>` : ''}
    </div>`;
  }).join('');
}

function toggleDiaryForm() {
  document.getElementById('diary-form')?.classList.toggle('open');
}

function saveDiaryEntry() {
  const city = document.getElementById('diary-city-sel')?.value;
  const date = document.getElementById('diary-date')?.value;
  const mood = document.getElementById('diary-mood')?.value;
  const rating = document.getElementById('diary-rating')?.value;
  const title = document.getElementById('diary-title')?.value.trim() || '';
  const text = document.getElementById('diary-text')?.value.trim() || '';
  const spent = document.getElementById('diary-spent')?.value || '';

  if (!text && !title) { showToast('Escreva algo antes de salvar!', 'red'); return; }

  state.diaryEntries.push({ city, date, mood, rating, title, text, spent, ts: Date.now() });
  saveState();
  document.getElementById('diary-form')?.classList.remove('open');
  // Limpa o formulário
  ['diary-text', 'diary-title', 'diary-spent'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  renderDiary();
  showToast('📖 Entrada salva com carinho!');
}

function deleteDiaryEntry(i) {
  if (confirm('Apagar esta entrada do diário? Esta ação não pode ser desfeita.')) {
    state.diaryEntries.splice(i, 1);
    saveState();
    renderDiary();
    showToast('Entrada removida');
  }
}

/* ════════════════════════════════════════
   COMPARTILHAR (Web Share API)
   ════════════════════════════════════════ */
function shareApp() {
  const cities = state.route.map(cid => DB[cid]?.name).filter(Boolean).join(' → ');
  const shareData = {
    title: '🍂 Mochilão Europa — Outubro',
    text: `Meu roteiro: ${cities}. Veja o app completo!`,
    url: window.location.href,
  };
  if (navigator.share) {
    navigator.share(shareData).catch(() => {});
  } else {
    navigator.clipboard?.writeText(window.location.href)
      .then(() => showToast('🔗 Link copiado!'))
      .catch(() => showToast('🔗 ' + window.location.href));
  }
}

/* ════════════════════════════════════════
   SCROLL TO TOP
   ════════════════════════════════════════ */
function initScrollToTop() {
  const btn = document.getElementById('scroll-top-btn');
  const shareBtn = document.getElementById('share-btn');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    const visible = window.scrollY > 400;
    btn.classList.toggle('visible', visible);
    shareBtn?.classList.toggle('visible', visible);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ════════════════════════════════════════
   SERVICE WORKER (PWA)
   ════════════════════════════════════════ */
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('SW registrado:', reg.scope))
      .catch(err => console.warn('SW não registrado:', err));
  }
}

/* ════════════════════════════════════════
   INICIALIZAÇÃO
   ════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  loadState();
  renderRoteiro();

  // Define data de hoje no diário
  const diaryDate = document.getElementById('diary-date');
  if (diaryDate) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    diaryDate.value = `${yyyy}-${mm}-${dd}`;
  }

  initScrollToTop();
  registerServiceWorker();

  // Suporte a parâmetro ?section=xxx na URL
  const params = new URLSearchParams(window.location.search);
  const section = params.get('section');
  if (section) {
    const btn = document.querySelector(`.nav-btn[onclick*="${section}"]`);
    showSection(section, btn);
  }
});
