import { DB, TRAINS, TIPS, PHRASES, RATES } from "../core/data.js";
import { esc, euro } from "../core/ui.js";

export function routeStrip(route){
  return route.map((id,i)=>{
    const c = DB[id];
    if(!c) return "";
    return `<span class="route-city">${c.flag} ${esc(c.name)}</span>${i < route.length-1 ? `<span class="route-arrow">→</span>` : ""}`;
  }).join("");
}

export function daysFromRoute(state){
  const days = [];
  let day = 1;
  state.route.forEach(id => {
    const c = DB[id];
    const n = state.cityDays[id] || c.sugDays || 2;
    for(let i=1;i<=n;i++){
      days.push({
        key:`${id}-${i}`,
        day:day++,
        cityId:id,
        city:c,
        localDay:i,
        cost:c.cpd,
        title:i===1 ? `Chegada em ${c.name}` : `Explorar ${c.name}`,
        activities: activitiesFor(c,i)
      });
    }
  });
  return days;
}

function activitiesFor(c,i){
  const defaults = [
    `Caminhar sem pressa e sentir a vibe: ${c.vibe}.`,
    `Escolher uma atração principal e uma experiência barata/local.`,
    `Reservar 30 minutos para revisar gastos e salvar notas no diário.`
  ];
  if(i===1) return [`Chegada, check-in e reconhecimento do bairro.`, `Ver pôr do sol ou praça central de ${c.name}.`, ...defaults.slice(1,2)];
  if(i===2) return [`Manhã para atração principal.`, `Tarde para café, mercado local ou bairro histórico.`, `Noite livre para comida típica.`];
  return defaults;
}

export function roteiro(state){
  const days = daysFromRoute(state);
  const done = days.filter(d => state.dayDone[d.key]).length;
  const pct = Math.round(done / Math.max(days.length,1) * 100);
  const totalCost = state.route.reduce((sum,id)=>sum + DB[id].cpd * (state.cityDays[id] || DB[id].sugDays), 0);
  return `
    <div class="section-header">
      <div class="gold-line"></div>
      <h2>Roteiro dia a dia</h2>
      <p>Clique em um dia para expandir atividades. Marque como concluído e adicione anotações: tudo é salvo automaticamente.</p>
    </div>
    <div class="stats-grid">
      <div class="stat-card"><div class="stat-label">Duração</div><div class="stat-value">${days.length}</div><div class="stat-sub">dias de viagem</div></div>
      <div class="stat-card"><div class="stat-label">Cidades</div><div class="stat-value">${state.route.length}</div><div class="stat-sub">${DB[state.route[0]]?.name || "-"} → ${DB[state.route.at(-1)]?.name || "-"}</div></div>
      <div class="stat-card"><div class="stat-label">Custo base</div><div class="stat-value">${euro(totalCost)}</div><div class="stat-sub">estimativa diária</div></div>
      <div class="stat-card"><div class="stat-label">Dias feitos</div><div class="stat-value">${done}</div><div class="stat-sub">de ${days.length} · ${pct}%</div></div>
    </div>
    <div class="progress-wrap">
      <div class="progress-meta"><span>Progresso da viagem</span><span>${pct}%</span></div>
      <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
    </div>
    <div class="days-grid">
      ${days.map(d => dayCard(d,state)).join("")}
    </div>
  `;
}

function dayCard(d,state){
  const open = state.openDay === d.key;
  const done = !!state.dayDone[d.key];
  return `
    <article class="day-card ${open ? "open" : ""} ${done ? "done" : ""}">
      <div class="day-header" data-open-day="${d.key}">
        <div class="day-num">${String(d.day).padStart(2,"0")}</div>
        <div class="day-flag">${d.city.flag}</div>
        <div class="day-info">
          <h3>${esc(d.title)}</h3>
          <p>${esc(d.city.country)} · dia ${d.localDay} · ${esc(d.city.vibe)}</p>
        </div>
        <div class="day-cost">${euro(d.cost)}</div>
        <button class="day-check ${done ? "done" : ""}" data-toggle-day="${d.key}">${done ? "✓" : ""}</button>
      </div>
      <div class="day-body">
        <div class="day-photo-grad">
          <div>
            <div class="day-photo-title">${d.city.flag} ${esc(d.city.name)}</div>
            <div class="muted">${esc(d.city.desc)}</div>
          </div>
          <span class="badge-new">${euro(d.city.cpd)}/dia</span>
        </div>
        <ul class="activity-list">
          ${d.activities.map(a=>`<li class="activity-item"><span class="activity-dot"></span><span>${esc(a)}</span></li>`).join("")}
        </ul>
        <div class="day-highlights">
          ${d.city.tags.map(t=>`<span class="hl-chip"><span class="hl-name">${esc(t)}</span></span>`).join("")}
        </div>
        <div class="note-area">
          <label>Anotações deste dia</label>
          <textarea data-day-note="${d.key}" placeholder="Escreva horários, reservas, ideias e gastos...">${esc(state.dayNotes[d.key] || "")}</textarea>
        </div>
      </div>
    </article>
  `;
}

export function montador(state){
  const countries = ["Todos",...new Set(Object.values(DB).map(c=>c.country))];
  return `
    <div class="section-header">
      <div class="gold-line"></div>
      <h2>Monte seu roteiro</h2>
      <p>Escolha cidades, ajuste dias e confirme. A IA usa este roteiro para criar sugestões personalizadas.</p>
    </div>
    <div class="builder-layout">
      <div class="panel">
        <div class="panel-header">
          <div><div class="panel-title">🌍 ${Object.keys(DB).length} cidades disponíveis</div><div class="panel-sub">Clique para adicionar/remover</div></div>
        </div>
        <div class="filter-row" id="countryFilter">${countries.map((c,i)=>`<button class="filter-btn ${i===0?"active":""}" data-country="${esc(c)}">${esc(c)}</button>`).join("")}</div>
        <div class="city-palette" id="cityPalette">${cityChips(state,"Todos")}</div>
      </div>
      <div class="panel">
        <div class="panel-header">
          <div><div class="panel-title">✈️ Seu roteiro</div><div class="panel-sub">Reordene e ajuste os dias</div></div>
        </div>
        <div class="route-list">
          ${routeRows(state)}
        </div>
        <div class="route-footer">
          <div class="route-stats-text">${routeStats(state)}</div>
          <button class="apply-btn" data-go-ai>Gerar sugestões com IA</button>
        </div>
      </div>
    </div>
  `;
}

export function cityChips(state,country){
  return Object.entries(DB)
    .filter(([_,c])=>country==="Todos" || c.country===country)
    .map(([id,c])=>`
      <div class="city-chip ${state.route.includes(id) ? "active" : ""}" data-city-chip="${id}">
        <span class="chip-flag">${c.flag}</span>
        <span class="chip-info"><span class="chip-name">${esc(c.name)}</span><span class="chip-country">${esc(c.country)}</span></span>
        <span class="chip-cpd">${euro(c.cpd)}/d</span>
      </div>
    `).join("");
}

function routeRows(state){
  if(!state.route.length) return `<div class="empty-state">Selecione cidades ao lado →</div>`;
  return state.route.map((id,i)=>{
    const c = DB[id];
    const days = state.cityDays[id] || c.sugDays || 2;
    return `
      <div class="route-row">
        <div class="route-num">${i+1}</div>
        <div class="chip-flag">${c.flag}</div>
        <div class="route-info">
          <div class="route-city-name">${esc(c.name)}</div>
          <div class="route-city-meta">${esc(c.country)} · ${euro(c.cpd)}/dia</div>
        </div>
        <div class="days-ctrl">
          <button data-days-dec="${id}">−</button><span>${days}d</span><button data-days-inc="${id}">+</button>
        </div>
        <div class="order-btns">
          <button data-move-up="${id}" ${i===0?"disabled":""}>↑</button>
          <button data-move-down="${id}" ${i===state.route.length-1?"disabled":""}>↓</button>
        </div>
        <button class="remove-btn" data-remove-city="${id}">×</button>
      </div>`;
  }).join("");
}

function routeStats(state){
  const totalDays = state.route.reduce((a,id)=>a+(state.cityDays[id] || DB[id].sugDays),0);
  const totalCost = state.route.reduce((a,id)=>a+DB[id].cpd*(state.cityDays[id] || DB[id].sugDays),0);
  return `<strong>${state.route.length}</strong> cidades · <strong>${totalDays}</strong> dias · ~<strong>${euro(totalCost)}</strong>`;
}

export function mapa(state){
  const active = new Set(state.route);
  const points = Object.entries(DB).map(([id,c])=>`
    <button class="map-point ${active.has(id)?"active":""}" style="left:${c.x}%;top:${c.y}%;" data-map-city="${id}"></button>
    <span class="map-label" style="left:${c.x}%;top:${c.y}%;">${c.flag} ${esc(c.name)}</span>
  `).join("");
  const poly = state.route.map(id => DB[id]).filter(Boolean).map(c=>`${c.x},${c.y}`).join(" ");
  return `
    <div class="section-header" style="max-width:1220px;margin-left:auto;margin-right:auto;padding:0 1rem 1rem">
      <div class="gold-line"></div>
      <h2>Mapa interativo</h2>
      <p>Mapa estilizado para GitHub Pages: cidades disponíveis e linha do roteiro. Clique nos pontos para adicionar/remover.</p>
    </div>
    <div class="map-wrap">
      <div class="map-canvas" id="mapCanvas">
        <svg class="route-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="sea" x1="0" x2="1"><stop stop-color="#071020"/><stop offset="1" stop-color="#0d1728"/></linearGradient>
          </defs>
          <rect width="100" height="100" fill="url(#sea)"></rect>
          <path d="M18 63 C22 50, 33 50, 38 58 C42 48, 50 36, 62 38 C72 34, 85 42, 80 58 C74 70, 65 74, 52 67 C42 72, 28 74, 18 63Z" fill="#1c2340" stroke="#2a3560" stroke-width=".4"></path>
          ${poly ? `<polyline points="${poly}" fill="none" stroke="rgba(232,201,122,.8)" stroke-width=".55" stroke-dasharray="1.2 1" vector-effect="non-scaling-stroke"></polyline>` : ""}
        </svg>
        ${points}
        <div class="map-tooltip" id="mapTooltip"></div>
      </div>
    </div>
    <div class="legend">
      <div class="legend-item"><span class="legend-dot" style="background:var(--gold);box-shadow:0 0 8px rgba(232,201,122,.7)"></span>No roteiro</div>
      <div class="legend-item"><span class="legend-dot" style="background:#3a3a55;border:1px solid #666"></span>Disponível</div>
      <div class="legend-item">Linha tracejada = ordem da viagem</div>
    </div>
  `;
}

export function ia(state){
  const endpoint = state.settings.aiEndpoint?.trim();
  return `
    <div class="section-header">
      <div class="gold-line"></div>
      <h2>Recomendações com IA</h2>
      <p>Gere dicas online para o roteiro atual. Se nenhum endpoint for configurado, o app usa sugestões inteligentes locais como fallback.</p>
    </div>
    <div class="ai-panel">
      <div class="ai-header">
        <div>
          <div class="ai-title">🤖 Consultor de Mochilão</div>
          <div class="ai-sub">Roteiro atual: ${state.route.map(id=>DB[id].name).join(" → ") || "vazio"}</div>
          <div class="ai-status">Status: ${endpoint ? "endpoint online configurado" : "modo fallback local"}</div>
        </div>
        <div class="ai-toolbar">
          <button class="ai-btn" data-ai-mode="outubro">✨ Dicas de outubro</button>
          <button class="ai-btn secondary" data-ai-mode="economia">💶 Economizar</button>
          <button class="ai-btn secondary" data-ai-mode="otimizar">🚆 Otimizar rota</button>
        </div>
      </div>
      <label>Pedido personalizado</label>
      <div class="ai-input-row">
        <textarea id="aiQuestion" placeholder="Ex.: quero uma viagem romântica, barata, com trem e poucos deslocamentos"></textarea>
        <button class="ai-btn" data-ai-mode="custom">Perguntar</button>
      </div>
      <div id="aiContent" class="ai-results">
        ${state.aiHistory.length ? state.aiHistory.slice(0,3).map(renderAiBlock).join("") : `<div class="ai-card"><h4>Pronto para sugerir</h4><p class="muted">Clique em um botão acima para gerar recomendações.</p></div>`}
      </div>
    </div>
  `;
}

export function renderAiBlock(block){
  if(block.cards){
    return `<div class="ai-card"><h4>${esc(block.title || "Sugestões da IA")}</h4>${block.cards.map(card=>`
      <div class="ai-card" style="margin:.65rem 0;background:var(--bg3)">
        <h4>${esc(card.title)}</h4>
        <ul>${(card.items || []).map(i=>`<li>${esc(i)}</li>`).join("")}</ul>
      </div>
    `).join("")}<div class="ai-json-note">${esc(block.source || "")}</div></div>`;
  }
  return `<div class="ai-card"><h4>${esc(block.title || "Sugestões")}</h4><p class="muted">${esc(block.text || "")}</p><div class="ai-json-note">${esc(block.source || "")}</div></div>`;
}

export function paises(state){
  const countries = [...new Set(Object.values(DB).map(c=>c.country))];
  return `
    <div class="section-header"><div class="gold-line"></div><h2>Países e cidades</h2><p>Resumo visual das cidades disponíveis no planner.</p></div>
    <div class="grid three">
      ${countries.map(country=>{
        const cities = Object.entries(DB).filter(([_,c])=>c.country===country);
        const avg = Math.round(cities.reduce((s,[_,c])=>s+c.cpd,0)/cities.length);
        return `<article class="card country-card">
          <div class="country-hero"><div class="country-name">${esc(country)}</div><div class="muted">${cities.map(([_,c])=>c.flag+" "+c.name).join(" · ")}</div></div>
          <div class="country-body">
            <p class="muted">${cities.length} cidade(s) no banco do app.</p>
            <div class="info-grid">
              <div class="info-box"><div class="info-box-label">Média/dia</div><div class="info-box-val">${euro(avg)}</div></div>
              <div class="info-box"><div class="info-box-label">No roteiro</div><div class="info-box-val">${cities.filter(([id])=>state.route.includes(id)).length}</div></div>
            </div>
          </div>
        </article>`;
      }).join("")}
    </div>
  `;
}

export function trens(){
  return `
    <div class="section-header"><div class="gold-line"></div><h2>Trens e deslocamentos</h2><p>Rotas úteis para montar um mochilão europeu de trem.</p></div>
    <div class="card">
      <table class="table">
        <thead><tr><th>Rota</th><th>Duração</th><th>Tipo</th><th>Faixa</th></tr></thead>
        <tbody>${TRAINS.map(t=>`<tr><td>${esc(t[0])} → ${esc(t[1])}</td><td>${esc(t[2])}</td><td>${esc(t[3])}</td><td>${esc(t[4])}</td></tr>`).join("")}</tbody>
      </table>
    </div>
  `;
}

export function orcamento(state){
  const total = state.expenses.reduce((s,e)=>s+Number(e.amount||0),0);
  const cats = [...new Set(state.expenses.map(e=>e.cat))];
  return `
    <div class="section-header"><div class="gold-line"></div><h2>Orçamento</h2><p>Controle de custos estimados e gastos extras.</p></div>
    <div class="budget-total"><span class="muted">Total estimado</span><strong>${euro(total)}</strong><span class="muted">sem passagem aérea internacional</span></div>
    <div class="grid two">
      <div class="card">
        <h3>Adicionar gasto</h3>
        <form id="expenseForm" class="grid two">
          <div><label>Categoria</label><input id="expenseCat" placeholder="Hospedagem"></div>
          <div><label>Valor</label><input id="expenseAmount" type="number" min="0" step="1" placeholder="100"></div>
          <div style="grid-column:1/-1"><label>Descrição</label><input id="expenseDesc" placeholder="Hostel em Paris"></div>
          <button class="primary-btn">Adicionar</button>
        </form>
      </div>
      <div class="card">
        <h3>Por categoria</h3>
        ${cats.map(cat=>{
          const val = state.expenses.filter(e=>e.cat===cat).reduce((s,e)=>s+Number(e.amount||0),0);
          const pct = Math.round(val/Math.max(total,1)*100);
          return `<div class="bar-row"><div class="bar-label">${esc(cat)}</div><div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div><div class="bar-val">${euro(val)}</div></div>`;
        }).join("")}
      </div>
    </div>
    <div class="card" style="margin-top:1rem">
      <table class="table"><thead><tr><th>Categoria</th><th>Descrição</th><th>Valor</th><th></th></tr></thead>
      <tbody>${state.expenses.map(e=>`<tr><td>${esc(e.cat)}</td><td>${esc(e.desc)}</td><td>${euro(e.amount)}</td><td><button class="danger-btn" data-del-expense="${e.id}">Excluir</button></td></tr>`).join("")}</tbody></table>
    </div>
  `;
}

export function dicas(){
  return `
    <div class="section-header"><div class="gold-line"></div><h2>Dicas rápidas</h2><p>Boas práticas para economizar e viajar melhor.</p></div>
    <div class="grid three">${TIPS.map(t=>`<div class="card"><h3>${t[0]} ${esc(t[1])}</h3><p class="muted">${esc(t[2])}</p></div>`).join("")}</div>
  `;
}

export function checklist(state){
  const grouped = {};
  state.checklist.forEach(i => (grouped[i.cat] ||= []).push(i));
  const done = state.checklist.filter(i=>i.done).length;
  const pct = Math.round(done/Math.max(state.checklist.length,1)*100);
  return `
    <div class="section-header"><div class="gold-line"></div><h2>Checklist</h2><p>${done} de ${state.checklist.length} itens concluídos.</p></div>
    <div class="progress-wrap"><div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div></div>
    <div class="check-grid">
      ${Object.entries(grouped).map(([cat,items])=>`<div class="category-title">${esc(cat)}</div>${items.map(i=>`
        <div class="check-item ${i.done?"checked":""}" data-toggle-check="${i.id}">
          <div class="check-box">${i.done?"✓":""}</div><div class="check-text">${esc(i.text)}</div>
        </div>`).join("")}`).join("")}
    </div>
  `;
}

export function mochila(state){
  const doneWeight = state.pack.filter(i=>i.done).reduce((s,i)=>s+Number(i.weight),0);
  const totalWeight = state.pack.reduce((s,i)=>s+Number(i.weight),0);
  const grouped = {};
  state.pack.forEach(i => (grouped[i.cat] ||= []).push(i));
  return `
    <div class="section-header"><div class="gold-line"></div><h2>Mochila inteligente</h2><p>Peso marcado: ${doneWeight.toFixed(1)}kg de ${totalWeight.toFixed(1)}kg sugeridos.</p></div>
    <div class="pack-grid">
      ${Object.entries(grouped).map(([cat,items])=>`<div class="category-title">${esc(cat)}</div>${items.map(i=>`
        <div class="pack-item ${i.done?"checked":""}" data-toggle-pack="${i.id}">
          <div class="pack-check">${i.done?"✓":""}</div><div><div class="pack-name">${i.icon} ${esc(i.name)}</div><div class="pack-meta">${i.weight}kg</div></div>
        </div>`).join("")}`).join("")}
    </div>
  `;
}

export function moedas(state){
  const from = state.settings.currencyFrom || "EUR";
  const to = state.settings.currencyTo || "BRL";
  const rate = (RATES[to] || 1) / (RATES[from] || 1);
  return `
    <div class="section-header"><div class="gold-line"></div><h2>Moedas</h2><p>Conversor aproximado para planejamento. Atualize taxas manualmente se precisar de precisão.</p></div>
    <div class="card">
      <div class="currency-grid">
        <div><label>De</label><select id="curFrom">${Object.keys(RATES).map(c=>`<option ${c===from?"selected":""}>${c}</option>`).join("")}</select><input id="curAmount" type="number" value="100" style="margin-top:.5rem"></div>
        <button class="swap-btn" id="swapCurrency">⇄</button>
        <div><label>Para</label><select id="curTo">${Object.keys(RATES).map(c=>`<option ${c===to?"selected":""}>${c}</option>`).join("")}</select></div>
      </div>
      <div class="currency-result"><span class="muted">Resultado</span><br><strong id="currencyResult">${(100*rate).toFixed(2)} ${to}</strong></div>
    </div>
  `;
}

export function frases(state){
  const lang = state.settings.phraseLang || "EN";
  const idx = {EN:2,FR:3,ES:4,IT:5,DE:6}[lang] || 2;
  return `
    <div class="section-header"><div class="gold-line"></div><h2>Frases úteis</h2><p>Toque em uma frase para copiar.</p></div>
    <div class="filter-row" style="border:0;background:transparent;padding:0;margin-bottom:1rem">
      ${["EN","FR","ES","IT","DE"].map(l=>`<button class="filter-btn ${l===lang?"active":""}" data-lang="${l}">${l}</button>`).join("")}
    </div>
    <div class="phrases-grid">
      ${PHRASES.map(p=>`<div class="phrase-card" data-copy="${esc(p[idx])}">
        <div><div class="chip-country">${esc(p[0])}</div><strong>${esc(p[1])}</strong><div style="color:var(--gold);font-style:italic">${esc(p[idx])}</div></div>
      </div>`).join("")}
    </div>
  `;
}

export function diario(state){
  return `
    <div class="section-header"><div class="gold-line"></div><h2>Diário</h2><p>Registre memórias da viagem.</p></div>
    <div class="card">
      <form id="diaryForm" class="diary-form">
        <div class="grid two"><div><label>Cidade</label><input id="diaryCity" placeholder="Paris"></div><div><label>Humor</label><select id="diaryMood"><option>😍 Incrível</option><option>🙂 Bom</option><option>😐 Normal</option><option>😴 Cansativo</option></select></div></div>
        <div><label>Título</label><input id="diaryTitle" required placeholder="Um dia memorável"></div>
        <div><label>Texto</label><textarea id="diaryText" required placeholder="Conte como foi..."></textarea></div>
        <button class="primary-btn">Salvar memória</button>
      </form>
    </div>
    <div style="margin-top:1rem">${state.diary.map(d=>`
      <article class="diary-entry"><div class="route-city-meta">${esc(d.city)} · ${esc(d.mood)} · ${new Date(d.createdAt).toLocaleDateString("pt-BR")}</div><h4>${esc(d.title)}</h4><p>${esc(d.text)}</p><button class="danger-btn" data-del-diary="${d.id}" style="margin-top:.7rem">Excluir</button></article>
    `).join("") || `<div class="empty-state">Nenhuma memória ainda.</div>`}</div>
  `;
}

export function online(state){
  return `
    <div class="section-header"><div class="gold-line"></div><h2>Online & IA</h2><p>Configure endpoints para transformar o app estático do GitHub Pages em um app com IA online e sincronização externa.</p></div>
    <div class="grid two">
      <div class="card">
        <h3>Endpoint de IA</h3>
        <p class="muted">Use uma URL segura do seu backend, Vercel ou Netlify. Exemplo: https://seu-projeto.vercel.app/api/ai</p>
        <label>URL do endpoint</label>
        <input id="aiEndpoint" value="${esc(state.settings.aiEndpoint || "")}" placeholder="https://.../api/ai">
        <button class="primary-btn" id="saveAiEndpoint" style="margin-top:.7rem">Salvar endpoint</button>
      </div>
      <div class="card">
        <h3>Sincronização online</h3>
        <p class="muted">Opcional: configure um endpoint próprio para guardar o JSON da viagem na nuvem.</p>
        <label>URL de sincronização</label>
        <input id="syncEndpoint" value="${esc(state.settings.syncEndpoint || "")}" placeholder="https://.../api/sync">
        <div class="grid two" style="margin-top:.7rem">
          <button class="soft-btn" id="pullSync">Baixar nuvem</button>
          <button class="primary-btn" id="pushSync">Enviar nuvem</button>
        </div>
      </div>
    </div>
    <div class="card" style="margin-top:1rem">
      <h3>Como publicar com IA real</h3>
      <div class="code-box">1. Suba a pasta api/ em um projeto Vercel.
2. Adicione a variável OPENAI_API_KEY no Vercel.
3. Copie a URL https://seu-projeto.vercel.app/api/ai.
4. Cole acima em Endpoint de IA.</div>
    </div>
  `;
}
