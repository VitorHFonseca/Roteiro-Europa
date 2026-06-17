import { DB, VEHICLE_TYPES, TIPS, PHRASES, RATES } from "./data.js";
import { esc, euro } from "./ui.js";

export function routeStrip(route){
  return route.map((id,i)=>{
    const c = DB[id];
    if(!c) return "";
    return `<span class="route-city">${c.flag} ${esc(c.name)}</span>${i < route.length-1 ? `<span class="route-arrow">→</span>` : ""}`;
  }).join("");
}

export function generatedSuggestions(day){
  const c = day.city;
  if(day.localDay === 1){
    return [
      `Chegada, check-in e reconhecimento do bairro em ${c.name}.`,
      `Ver um miradouro, praça central ou ponto clássico da cidade.`,
      `Comprar água/lanche no mercado e salvar reservas no celular.`,
      `Noite leve: jantar perto da hospedagem e dormir bem.`
    ].join("\n");
  }
  if(day.localDay === 2){
    return [
      `Manhã: atração principal ligada a ${c.vibe}.`,
      `Tarde: caminhar por bairro histórico e parar em café/local típico.`,
      `Fim de tarde: pôr do sol ou passeio gratuito.`,
      `Noite: comida típica sem exagerar no orçamento.`
    ].join("\n");
  }
  return [
    `Escolher uma experiência local em ${c.name}.`,
    `Separar uma janela flexível para chuva, descanso ou deslocamento.`,
    `Revisar orçamento do dia e registrar uma memória no diário.`,
    `Deixar documentos e próximo transporte prontos para amanhã.`
  ].join("\n");
}

export function daysFromRoute(state){
  const days = [];
  let day = 1;
  state.route.forEach(id => {
    const c = DB[id];
    if(!c) return;
    const n = state.cityDays[id] || c.sugDays || 2;
    for(let i=1;i<=n;i++){
      const key = `${id}-${i}`;
      days.push({
        key, day:day++, cityId:id, city:c, localDay:i, cost:c.cpd,
        title:i===1 ? `Chegada em ${c.name}` : `Explorar ${c.name}`,
        suggestions: state.daySuggestions[key] || generatedSuggestions({city:c, localDay:i})
      });
    }
  });
  return days;
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
      <p>Agora cada dia vem com imagem do local e sugestões editáveis. Você pode trocar o texto, salvar notas e regenerar as dicas quando quiser.</p>
    </div>
    <div class="mini-actions" style="margin-bottom:1rem">
      <button class="primary-btn" id="autoFillAll">Autopreencher sugestões do roteiro</button>
      <button class="soft-btn" data-section-go="veiculos">Montar veículos</button>
      <button class="soft-btn" data-section-go="orcamento">Montar orçamento</button>
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
    <div class="days-grid">${days.map(d => dayCard(d,state)).join("")}</div>
  `;
}

function dayCard(d,state){
  const open = state.openDay === d.key;
  const done = !!state.dayDone[d.key];
  const suggestionsList = (d.suggestions || "").split("\n").filter(Boolean);
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
        <div class="day-photo">
          <img src="${esc(d.city.image)}" alt="${esc(d.city.name)}" loading="lazy">
          <div class="day-photo-info">
            <div class="day-photo-title">${d.city.flag} ${esc(d.city.name)}</div>
            <div class="muted">${esc(d.city.desc)}</div>
          </div>
        </div>
        <ul class="activity-list">
          ${suggestionsList.map(a=>`<li class="activity-item"><span class="activity-dot"></span><span>${esc(a)}</span></li>`).join("")}
        </ul>
        <div class="suggestion-editor">
          <label>Dicas do dia editáveis</label>
          <textarea data-day-suggestions="${d.key}">${esc(d.suggestions)}</textarea>
          <div class="mini-actions">
            <button class="soft-btn" data-reset-suggestions="${d.key}" data-city="${d.cityId}" data-local-day="${d.localDay}">Regerar dicas deste dia</button>
          </div>
        </div>
        <div class="day-highlights">${d.city.tags.map(t=>`<span class="hl-chip"><span class="hl-name">${esc(t)}</span></span>`).join("")}</div>
        <div class="note-area">
          <label>Anotações livres deste dia</label>
          <textarea data-day-note="${d.key}" placeholder="Horários, reservas, ideias, gastos...">${esc(state.dayNotes[d.key] || "")}</textarea>
        </div>
      </div>
    </article>
  `;
}

export function montador(state){
  const countries = ["Todos",...new Set(Object.values(DB).map(c=>c.country))];
  return `
    <div class="section-header"><div class="gold-line"></div><h2>Monte seu roteiro</h2><p>Escolha cidades, ajuste dias e depois use os autopreenchimentos para veículos, orçamento e sugestões diárias.</p></div>
    <div class="builder-layout">
      <div class="panel">
        <div class="panel-header"><div><div class="panel-title">🌍 ${Object.keys(DB).length} cidades disponíveis</div><div class="panel-sub">Clique para adicionar/remover</div></div></div>
        <div class="filter-row" id="countryFilter">${countries.map((c,i)=>`<button class="filter-btn ${i===0?"active":""}" data-country="${esc(c)}">${esc(c)}</button>`).join("")}</div>
        <div class="city-palette" id="cityPalette">${cityChips(state,"Todos")}</div>
      </div>
      <div class="panel">
        <div class="panel-header"><div><div class="panel-title">✈️ Seu roteiro</div><div class="panel-sub">Reordene e ajuste os dias</div></div></div>
        <div class="route-list">${routeRows(state)}</div>
        <div class="route-footer">
          <div class="route-stats-text">${routeStats(state)}</div>
          <button class="apply-btn" data-section-go="roteiro">Ver roteiro</button>
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
        <div class="route-info"><div class="route-city-name">${esc(c.name)}</div><div class="route-city-meta">${esc(c.country)} · ${euro(c.cpd)}/dia</div></div>
        <div class="days-ctrl"><button data-days-dec="${id}">−</button><span>${days}d</span><button data-days-inc="${id}">+</button></div>
        <div class="order-btns"><button data-move-up="${id}" ${i===0?"disabled":""}>↑</button><button data-move-down="${id}" ${i===state.route.length-1?"disabled":""}>↓</button></div>
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
    <button class="map-point ${active.has(id)?"active":""}" style="left:${c.x}%;top:${c.y}%;" data-map-city="${id}" title="${esc(c.name)}"></button>
    <span class="map-label" style="left:${c.x}%;top:${c.y}%;">${c.flag} ${esc(c.name)}</span>
  `).join("");
  const linePoints = state.route.map(id => DB[id]).filter(Boolean).map(c=>`${c.x},${c.y}`).join(" ");
  return `
    <div class="map-stage">
      <div class="section-header"><div class="gold-line"></div><h2>Mapa interativo corrigido</h2><p>Mapa visual responsivo: clique nos pontos para adicionar/remover cidades. Imagens voltaram no popup.</p></div>
    </div>
    <div class="map-wrap">
      <div class="map-canvas" id="mapCanvas">
        <svg class="route-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
          <rect width="100" height="100" fill="#071020"></rect>
          <path d="M14 70 C20 58, 30 55, 38 66 C42 54, 50 40, 63 43 C77 38, 88 48, 82 65 C76 78, 65 80, 53 70 C43 77, 28 80, 14 70Z" fill="#1c2340" stroke="#2a3560" stroke-width=".5"></path>
          <path d="M48 30 C58 21, 70 20, 79 28 C85 35, 82 46, 72 49 C62 51, 54 44, 48 30Z" fill="#1c2340" stroke="#2a3560" stroke-width=".5"></path>
          ${linePoints ? `<polyline points="${linePoints}" fill="none" stroke="rgba(232,201,122,.85)" stroke-width=".55" stroke-dasharray="1.4 1" vector-effect="non-scaling-stroke"></polyline>` : ""}
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

export function veiculos(state){
  const typeOptions = VEHICLE_TYPES.map(([v,l])=>`<option value="${v}">${l}</option>`).join("");
  return `
    <div class="section-header">
      <div class="gold-line"></div>
      <h2>Veículos e deslocamentos</h2>
      <p>A tela vem em branco. Você adiciona quantas opções quiser: trem, avião, ônibus, carro, ferry, metrô, caminhada, bike ou outro. Também dá para autopreencher opções com base no roteiro.</p>
    </div>
    <div class="mini-actions" style="margin-bottom:1rem">
      <button class="primary-btn" id="autoVehicles">Autopreencher opções do roteiro</button>
      <button class="soft-btn" id="clearVehicles">Limpar veículos</button>
    </div>
    <div class="card">
      <h3>Adicionar opção</h3>
      <form id="vehicleForm" class="grid three">
        <div><label>Tipo</label><select id="vehType">${typeOptions}</select></div>
        <div><label>Origem</label><input id="vehFrom" list="cityNames" placeholder="Lisboa"></div>
        <div><label>Destino</label><input id="vehTo" list="cityNames" placeholder="Paris"></div>
        <div><label>Duração</label><input id="vehDuration" placeholder="2h45"></div>
        <div><label>Custo</label><input id="vehCost" placeholder="€40"></div>
        <div><label>Fornecedor/link</label><input id="vehProvider" placeholder="Omio, FlixBus, SNCF..."></div>
        <div style="grid-column:1/-1"><label>Observações</label><textarea id="vehNotes" placeholder="Horário, bagagem, reserva, opção A/B..."></textarea></div>
        <button class="primary-btn">Adicionar veículo</button>
      </form>
      <datalist id="cityNames">${Object.values(DB).map(c=>`<option value="${esc(c.name)}"></option>`).join("")}</datalist>
    </div>
    <div class="grid two" style="margin-top:1rem">
      ${state.vehicles.length ? state.vehicles.map(v=>vehicleCard(v)).join("") : `<div class="empty-state" style="grid-column:1/-1">Nenhum veículo adicionado ainda. Use o formulário ou o botão de autopreenchimento.</div>`}
    </div>
  `;
}

function vehicleIcon(type){
  return {trem:"🚆",aviao:"✈️",onibus:"🚌",carro:"🚗",ferry:"⛴️",metro:"🚇",caminhada:"🚶",bike:"🚲",outro:"✨"}[type] || "✨";
}
function vehicleLabel(type){
  return (VEHICLE_TYPES.find(x=>x[0]===type)?.[1] || "✨ Outro").replace(/^.+?\s/,"");
}
function vehicleCard(v){
  return `<article class="vehicle-card">
    <div class="vehicle-head">
      <div>
        <div class="vehicle-type">${vehicleIcon(v.type)} ${esc(v.from || "-")} → ${esc(v.to || "-")}</div>
        <div class="vehicle-meta"><span class="pill">${esc(vehicleLabel(v.type))}</span> <span class="pill">${esc(v.duration || "sem duração")}</span> <span class="pill">${esc(v.cost || "sem custo")}</span></div>
      </div>
      <button class="danger-btn" data-del-vehicle="${v.id}">Excluir</button>
    </div>
    <div class="grid two">
      <div><label>Fornecedor/link</label><input data-vehicle-field="${v.id}:provider" value="${esc(v.provider || "")}"></div>
      <div><label>Custo</label><input data-vehicle-field="${v.id}:cost" value="${esc(v.cost || "")}"></div>
      <div style="grid-column:1/-1"><label>Observações editáveis</label><textarea data-vehicle-field="${v.id}:notes">${esc(v.notes || "")}</textarea></div>
    </div>
  </article>`;
}

export function ia(state){
  const endpoint = state.settings.aiEndpoint?.trim();
  return `
    <div class="section-header"><div class="gold-line"></div><h2>Recomendações com IA</h2><p>Use IA online se tiver endpoint configurado, ou fallback local inteligente.</p></div>
    <div class="ai-panel">
      <div class="ai-header">
        <div>
          <div class="ai-title">🤖 Consultor de Mochilão</div>
          <div class="ai-sub">Roteiro atual: ${state.route.map(id=>DB[id].name).join(" → ") || "vazio"}</div>
          <div class="ai-status">Status: ${endpoint ? "endpoint online configurado" : "modo fallback local"}</div>
        </div>
        <div class="ai-toolbar">
          <button class="ai-btn" data-ai-mode="dia">✨ Dicas do dia</button>
          <button class="ai-btn secondary" data-ai-mode="economia">💶 Economizar</button>
          <button class="ai-btn secondary" data-ai-mode="veiculos">🚗 Veículos</button>
        </div>
      </div>
      <label>Pedido personalizado</label>
      <div class="ai-input-row">
        <textarea id="aiQuestion" placeholder="Ex.: quero opções de deslocamento baratas e dicas para dias de chuva"></textarea>
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
    <div class="section-header"><div class="gold-line"></div><h2>Países e cidades</h2><p>As imagens dos locais voltaram nos cartões.</p></div>
    <div class="grid three">
      ${countries.map(country=>{
        const cities = Object.entries(DB).filter(([_,c])=>c.country===country);
        const avg = Math.round(cities.reduce((s,[_,c])=>s+c.cpd,0)/cities.length);
        const img = cities[0]?.[1].image || "";
        return `<article class="card country-card">
          <div class="country-hero" style="background-image:linear-gradient(to top,rgba(0,0,0,.75),transparent),url('${esc(img)}')"><div class="country-name">${esc(country)}</div><div class="muted">${cities.map(([_,c])=>c.flag+" "+c.name).join(" · ")}</div></div>
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

export function orcamento(state){
  const total = state.expenses.reduce((s,e)=>s+Number(e.amount||0),0);
  const cats = [...new Set(state.expenses.map(e=>e.cat))];
  return `
    <div class="section-header"><div class="gold-line"></div><h2>Orçamento</h2><p>Controle de custos. Pode adicionar manualmente ou autopreencher baseado no roteiro e veículos.</p></div>
    <div class="mini-actions" style="margin-bottom:1rem">
      <button class="primary-btn" id="autoBudget">Autopreencher orçamento</button>
      <button class="soft-btn" id="clearBudget">Limpar orçamento</button>
    </div>
    <div class="budget-total"><span class="muted">Total estimado</span><strong>${euro(total)}</strong><span class="muted">editável</span></div>
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
        ${cats.length ? cats.map(cat=>{
          const val = state.expenses.filter(e=>e.cat===cat).reduce((s,e)=>s+Number(e.amount||0),0);
          const pct = Math.round(val/Math.max(total,1)*100);
          return `<div class="bar-row"><div class="bar-label">${esc(cat)}</div><div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div><div class="bar-val">${euro(val)}</div></div>`;
        }).join("") : `<p class="muted">Nenhum gasto ainda.</p>`}
      </div>
    </div>
    <div class="card" style="margin-top:1rem">
      <table class="table"><thead><tr><th>Categoria</th><th>Descrição</th><th>Valor</th><th></th></tr></thead>
      <tbody>${state.expenses.map(e=>`<tr><td>${esc(e.cat)}</td><td>${esc(e.desc)}</td><td>${euro(e.amount)}</td><td><button class="danger-btn" data-del-expense="${e.id}">Excluir</button></td></tr>`).join("") || `<tr><td colspan="4">Nenhum gasto.</td></tr>`}</tbody></table>
    </div>
  `;
}

export function dicas(){
  return `<div class="section-header"><div class="gold-line"></div><h2>Dicas rápidas</h2><p>Boas práticas para economizar e viajar melhor.</p></div><div class="grid three">${TIPS.map(t=>`<div class="card"><h3>${t[0]} ${esc(t[1])}</h3><p class="muted">${esc(t[2])}</p></div>`).join("")}</div>`;
}

export function checklist(state){
  const grouped = {};
  state.checklist.forEach(i => (grouped[i.cat] ||= []).push(i));
  const done = state.checklist.filter(i=>i.done).length;
  const pct = Math.round(done/Math.max(state.checklist.length,1)*100);
  return `<div class="section-header"><div class="gold-line"></div><h2>Checklist</h2><p>${done} de ${state.checklist.length} itens concluídos.</p></div><div class="progress-wrap"><div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div></div><div class="check-grid">${Object.entries(grouped).map(([cat,items])=>`<div class="category-title">${esc(cat)}</div>${items.map(i=>`<div class="check-item ${i.done?"checked":""}" data-toggle-check="${i.id}"><div class="check-box">${i.done?"✓":""}</div><div class="check-text">${esc(i.text)}</div></div>`).join("")}`).join("")}</div>`;
}

export function mochila(state){
  const doneWeight = state.pack.filter(i=>i.done).reduce((s,i)=>s+Number(i.weight),0);
  const totalWeight = state.pack.reduce((s,i)=>s+Number(i.weight),0);
  const grouped = {};
  state.pack.forEach(i => (grouped[i.cat] ||= []).push(i));
  return `<div class="section-header"><div class="gold-line"></div><h2>Mochila inteligente</h2><p>Peso marcado: ${doneWeight.toFixed(1)}kg de ${totalWeight.toFixed(1)}kg sugeridos.</p></div><div class="pack-grid">${Object.entries(grouped).map(([cat,items])=>`<div class="category-title">${esc(cat)}</div>${items.map(i=>`<div class="pack-item ${i.done?"checked":""}" data-toggle-pack="${i.id}"><div class="pack-check">${i.done?"✓":""}</div><div><div class="pack-name">${i.icon} ${esc(i.name)}</div><div class="pack-meta">${i.weight}kg</div></div></div>`).join("")}`).join("")}</div>`;
}

export function moedas(state){
  const from = state.settings.currencyFrom || "EUR";
  const to = state.settings.currencyTo || "BRL";
  const rate = (RATES[to] || 1) / (RATES[from] || 1);
  return `<div class="section-header"><div class="gold-line"></div><h2>Moedas</h2><p>Conversor aproximado para planejamento.</p></div><div class="card"><div class="currency-grid"><div><label>De</label><select id="curFrom">${Object.keys(RATES).map(c=>`<option ${c===from?"selected":""}>${c}</option>`).join("")}</select><input id="curAmount" type="number" value="100" style="margin-top:.5rem"></div><button class="swap-btn" id="swapCurrency">⇄</button><div><label>Para</label><select id="curTo">${Object.keys(RATES).map(c=>`<option ${c===to?"selected":""}>${c}</option>`).join("")}</select></div></div><div class="currency-result"><span class="muted">Resultado</span><br><strong id="currencyResult">${(100*rate).toFixed(2)} ${to}</strong></div></div>`;
}

export function frases(state){
  const lang = state.settings.phraseLang || "EN";
  const idx = {EN:2,FR:3,ES:4,IT:5,DE:6}[lang] || 2;
  return `<div class="section-header"><div class="gold-line"></div><h2>Frases úteis</h2><p>Toque em uma frase para copiar.</p></div><div class="filter-row" style="border:0;background:transparent;padding:0;margin-bottom:1rem">${["EN","FR","ES","IT","DE"].map(l=>`<button class="filter-btn ${l===lang?"active":""}" data-lang="${l}">${l}</button>`).join("")}</div><div class="phrases-grid">${PHRASES.map(p=>`<div class="phrase-card" data-copy="${esc(p[idx])}"><div><div class="chip-country">${esc(p[0])}</div><strong>${esc(p[1])}</strong><div style="color:var(--gold);font-style:italic">${esc(p[idx])}</div></div></div>`).join("")}</div>`;
}

export function diario(state){
  return `<div class="section-header"><div class="gold-line"></div><h2>Diário</h2><p>Registre memórias da viagem.</p></div><div class="card"><form id="diaryForm" class="diary-form"><div class="grid two"><div><label>Cidade</label><input id="diaryCity" placeholder="Paris"></div><div><label>Humor</label><select id="diaryMood"><option>😍 Incrível</option><option>🙂 Bom</option><option>😐 Normal</option><option>😴 Cansativo</option></select></div></div><div><label>Título</label><input id="diaryTitle" required placeholder="Um dia memorável"></div><div><label>Texto</label><textarea id="diaryText" required placeholder="Conte como foi..."></textarea></div><button class="primary-btn">Salvar memória</button></form></div><div style="margin-top:1rem">${state.diary.map(d=>`<article class="diary-entry"><div class="route-city-meta">${esc(d.city)} · ${esc(d.mood)} · ${new Date(d.createdAt).toLocaleDateString("pt-BR")}</div><h4>${esc(d.title)}</h4><p>${esc(d.text)}</p><button class="danger-btn" data-del-diary="${d.id}" style="margin-top:.7rem">Excluir</button></article>`).join("") || `<div class="empty-state">Nenhuma memória ainda.</div>`}</div>`;
}

export function online(state){
  const sql = `create table public.trip_states (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state jsonb not null,
  updated_at timestamptz default now()
);

alter table public.trip_states enable row level security;

create policy "select own trip state" on public.trip_states for select using (auth.uid() = user_id);
create policy "insert own trip state" on public.trip_states for insert with check (auth.uid() = user_id);
create policy "update own trip state" on public.trip_states for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "delete own trip state" on public.trip_states for delete using (auth.uid() = user_id);`;

  return `<div class="section-header"><div class="gold-line"></div><h2>Online & IA</h2><p>Supabase continua disponível para banco grátis. Cole URL, anon key e sincronize.</p></div>
  <div class="grid two">
    <div class="card"><h3>☁️ Supabase</h3><label>Project URL</label><input id="supabaseUrl" value="${esc(state.settings.supabaseUrl || "")}" placeholder="https://xxxx.supabase.co"><label style="margin-top:.65rem;display:block">Anon public key</label><input id="supabaseAnonKey" value="${esc(state.settings.supabaseAnonKey || "")}" placeholder="eyJhbGciOi..."><button class="primary-btn" id="saveSupabaseConfig" style="margin-top:.8rem">Salvar configuração</button></div>
    <div class="card"><h3>🔐 Conta online</h3><label>E-mail</label><input id="supabaseEmail" value="${esc(state.settings.supabaseEmail || "")}" placeholder="voce@email.com"><label style="margin-top:.65rem;display:block">Senha</label><input id="supabasePassword" type="password" placeholder="mínimo 6 caracteres"><div class="grid two" style="margin-top:.8rem"><button class="soft-btn" id="supabaseSignup">Criar conta</button><button class="primary-btn" id="supabaseLogin">Entrar</button></div><div class="grid two" style="margin-top:.8rem"><button class="soft-btn" id="supabasePull">Baixar nuvem</button><button class="primary-btn" id="supabasePush">Enviar nuvem</button></div><button class="danger-btn full" id="supabaseLogout" style="margin-top:.8rem">Sair Supabase</button><div class="ai-status" id="supabaseStatus">Status: aguardando conexão</div></div>
  </div>
  <div class="grid two" style="margin-top:1rem">
    <div class="card"><h3>🧱 SQL</h3><p class="muted">Execute no SQL Editor do Supabase.</p><pre class="code-box" id="supabaseSql">${esc(sql)}</pre><button class="soft-btn" id="copySupabaseSql" style="margin-top:.8rem">Copiar SQL</button></div>
    <div class="card"><h3>🤖 Endpoint IA</h3><label>URL do endpoint IA</label><input id="aiEndpoint" value="${esc(state.settings.aiEndpoint || "")}" placeholder="https://seu-projeto.vercel.app/api/ai"><button class="primary-btn" id="saveAiEndpoint" style="margin-top:.7rem">Salvar endpoint IA</button></div>
  </div>`;
}
