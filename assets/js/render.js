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
  const routeNames = state.route.map(id => DB[id]?.name).filter(Boolean).join(" → ");

  return `
    <div class="section-header">
      <div class="gold-line"></div>
      <h2>Roteiro + Mapa</h2>
      <p>Agora o roteiro e o mapa ficam juntos: você vê o caminho no OpenStreetMap e organiza os dias no mesmo lugar.</p>
    </div>

    <div class="grid two" style="margin-bottom:1rem">
      <div class="leaflet-map-card">
        <div id="leafletMap"></div>
      </div>
      <div>
        <div class="card" style="margin-bottom:1rem">
          <h3>Rota atual</h3>
          <p class="muted">${routeNames || "Nenhuma cidade no roteiro."}</p>
          <div class="mini-actions">
            <button class="primary-btn" id="fitMapRoute">Centralizar mapa</button>
            <button class="soft-btn" data-section-go="montador">Editar roteiro</button>
            <button class="soft-btn" data-section-go="veiculos">Veículos</button>
            <button class="soft-btn" data-section-go="hospedagens">Hospedagens</button>
          </div>
        </div>

        <div class="stats-grid">
          <div class="stat-card"><div class="stat-label">Duração</div><div class="stat-value">${days.length}</div><div class="stat-sub">dias</div></div>
          <div class="stat-card"><div class="stat-label">Cidades</div><div class="stat-value">${state.route.length}</div><div class="stat-sub">no roteiro</div></div>
          <div class="stat-card"><div class="stat-label">Custo base</div><div class="stat-value">${euro(totalCost)}</div><div class="stat-sub">dias/cidade</div></div>
          <div class="stat-card"><div class="stat-label">Feitos</div><div class="stat-value">${done}</div><div class="stat-sub">${pct}%</div></div>
        </div>

        <div class="progress-wrap">
          <div class="progress-meta"><span>Progresso da viagem</span><span>${pct}%</span></div>
          <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
        </div>
      </div>
    </div>

    <div class="mini-actions" style="margin-bottom:1rem">
      <button class="primary-btn" id="autoFillAll">Autopreencher sugestões do roteiro</button>
      <button class="soft-btn" data-section-go="orcamento">Ver orçamento conectado</button>
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
  const routeNames = state.route.map(id => DB[id]?.name).filter(Boolean).join(" → ");
  return `
    <div class="map-stage">
      <div class="section-header">
        <div class="gold-line"></div>
        <h2>Mapa com OpenStreetMap</h2>
        <p>Agora o mapa usa Leaflet + OpenStreetMap. Clique nos marcadores para adicionar/remover cidades do roteiro.</p>
      </div>
      <div class="grid two">
        <div class="leaflet-map-card"><div id="leafletMap"></div></div>
        <div>
          <div class="card" style="margin-bottom:1rem">
            <h3>Roteiro no mapa</h3>
            <p class="muted">${routeNames || "Nenhuma cidade no roteiro."}</p>
            <div class="mini-actions">
              <button class="primary-btn" id="fitMapRoute">Centralizar roteiro</button>
              <button class="soft-btn" data-section-go="montador">Editar roteiro</button>
            </div>
          </div>
          <div class="map-side-list">
            ${Object.entries(DB).map(([id,c])=>`
              <div class="map-side-item ${state.route.includes(id) ? "active" : ""}">
                <div class="chip-flag">${c.flag}</div>
                <div style="flex:1">
                  <strong>${esc(c.name)}</strong>
                  <div class="muted">${esc(c.country)} · ${esc(c.vibe)}</div>
                </div>
                <button class="soft-btn" data-map-list-toggle="${id}">${state.route.includes(id) ? "Remover" : "Adicionar"}</button>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
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
      <button class="danger-btn" data-del-vehicle="${v.id}">Excluir do app</button>
    </div>
    <div class="grid two">
      <div><label>Fornecedor/link</label><input data-vehicle-field="${v.id}:provider" value="${esc(v.provider || "")}"></div>
      <div><label>Custo</label><input data-vehicle-field="${v.id}:cost" value="${esc(v.cost || "")}"></div>
      <div style="grid-column:1/-1"><label>Observações editáveis</label><textarea data-vehicle-field="${v.id}:notes">${esc(v.notes || "")}</textarea></div>
    </div>
  </article>`;
}


export function hospedagens(state){
  const typeOptions = [
    ["hostel","🏠 Hostel"],["hotel","🏨 Hotel"],["airbnb","🛋️ Airbnb"],["quarto","🛏️ Quarto"],["pousada","🏡 Pousada"],["outro","✨ Outro"]
  ].map(([v,l])=>`<option value="${v}">${l}</option>`).join("");

  return `
    <div class="section-header">
      <div class="gold-line"></div>
      <h2>Hospedagens</h2>
      <p>Funciona igual à aba de veículos: começa em branco, você adiciona opções, edita, exclui e pode autopreencher com base no roteiro.</p>
    </div>
    <div class="mini-actions" style="margin-bottom:1rem">
      <button class="primary-btn" id="autoLodgings">Autopreencher hospedagens</button>
      <button class="soft-btn" id="clearLodgings">Limpar hospedagens</button>
    </div>
    <div class="card">
      <h3>Adicionar hospedagem</h3>
      <form id="lodgingForm" class="grid three">
        <div><label>Tipo</label><select id="lodType">${typeOptions}</select></div>
        <div><label>Cidade</label><input id="lodCity" list="cityNamesLodging" placeholder="Paris"></div>
        <div><label>Nome/opção</label><input id="lodName" placeholder="Hostel perto da estação"></div>
        <div><label>Check-in</label><input id="lodCheckin" type="date"></div>
        <div><label>Check-out</label><input id="lodCheckout" type="date"></div>
        <div><label>Custo</label><input id="lodCost" placeholder="€80/noite"></div>
        <div><label>Localização</label><input id="lodArea" placeholder="Centro, estação, bairro..."></div>
        <div><label>Link</label><input id="lodLink" placeholder="Booking, Hostelworld, Airbnb..."></div>
        <div><label>Status</label><select id="lodStatus"><option>Pesquisando</option><option>Favorito</option><option>Reservado</option><option>Pago</option></select></div>
        <div style="grid-column:1/-1"><label>Observações</label><textarea id="lodNotes" placeholder="Cancelamento, café, bagagem, metrô perto..."></textarea></div>
        <button class="primary-btn">Adicionar hospedagem</button>
      </form>
      <datalist id="cityNamesLodging">${Object.values(DB).map(c=>`<option value="${esc(c.name)}"></option>`).join("")}</datalist>
    </div>
    <div class="grid two" style="margin-top:1rem">
      ${state.lodgings?.length ? state.lodgings.map(lodgingCard).join("") : `<div class="empty-state" style="grid-column:1/-1">Nenhuma hospedagem adicionada ainda. Use o formulário ou o botão de autopreenchimento.</div>`}
    </div>
  `;
}

function lodgingIcon(type){return {hostel:"🏠",hotel:"🏨",airbnb:"🛋️",quarto:"🛏️",pousada:"🏡",outro:"✨"}[type] || "✨"}
function lodgingLabel(type){return {hostel:"Hostel",hotel:"Hotel",airbnb:"Airbnb",quarto:"Quarto",pousada:"Pousada",outro:"Outro"}[type] || "Outro"}
function lodgingCard(l){
  return `<article class="lodging-card">
    <div class="lodging-head">
      <div>
        <div class="lodging-title">${lodgingIcon(l.type)} ${esc(l.city || "-")} · ${esc(l.name || "Opção sem nome")}</div>
        <div class="lodging-meta"><span class="pill">${esc(lodgingLabel(l.type))}</span><span class="pill">${esc(l.status || "Pesquisando")}</span><span class="pill">${esc(l.cost || "sem custo")}</span></div>
      </div>
      <button class="danger-btn" data-del-lodging="${l.id}">Excluir do app</button>
    </div>
    <div class="grid two">
      <div><label>Nome/opção</label><input data-lodging-field="${l.id}:name" value="${esc(l.name || "")}"></div>
      <div><label>Custo</label><input data-lodging-field="${l.id}:cost" value="${esc(l.cost || "")}"></div>
      <div><label>Check-in</label><input type="date" data-lodging-field="${l.id}:checkin" value="${esc(l.checkin || "")}"></div>
      <div><label>Check-out</label><input type="date" data-lodging-field="${l.id}:checkout" value="${esc(l.checkout || "")}"></div>
      <div><label>Localização</label><input data-lodging-field="${l.id}:area" value="${esc(l.area || "")}"></div>
      <div><label>Link</label><input data-lodging-field="${l.id}:link" value="${esc(l.link || "")}"></div>
      <div style="grid-column:1/-1"><label>Observações editáveis</label><textarea data-lodging-field="${l.id}:notes">${esc(l.notes || "")}</textarea></div>
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


function parseBudgetValue(raw){
  const text = String(raw || "").replaceAll(",", ".");
  const nums = text.match(/\d+(?:\.\d+)?/g)?.map(Number) || [];
  if(!nums.length) return 0;
  if(nums.length >= 2 && /-| a |até/i.test(text)) return Math.round((nums[0] + nums[1]) / 2);
  return nums[0];
}

function routeDaysCount(state){
  return state.route.reduce((sum,id)=>sum + (state.cityDays[id] || DB[id]?.sugDays || 2), 0);
}

function lodgingNightsForCity(state, cityName){
  const found = Object.entries(DB).find(([_,c]) => c.name.toLowerCase() === String(cityName || "").toLowerCase());
  if(!found) return 1;
  const id = found[0];
  return Math.max(1, (state.cityDays[id] || DB[id].sugDays || 2) - 1);
}

function connectedBudget(state){
  const days = routeDaysCount(state);

  const vehicles = (state.vehicles || []).reduce((sum,v) => sum + parseBudgetValue(v.cost), 0);

  const lodgings = (state.lodgings || []).reduce((sum,l) => {
    const value = parseBudgetValue(l.cost);
    const perNight = /noite|night|diária|diaria/i.test(String(l.cost || ""));
    return sum + (perNight ? value * lodgingNightsForCity(state,l.city) : value);
  }, 0);

  const food = state.route.reduce((sum,id) => {
    const c = DB[id];
    const daysCity = state.cityDays[id] || c.sugDays || 2;
    return sum + Math.round(daysCity * Math.max(24, Math.min(42, c.cpd * 0.34)));
  }, 0);

  const tourism = state.route.reduce((sum,id) => {
    const c = DB[id];
    const daysCity = state.cityDays[id] || c.sugDays || 2;
    return sum + Math.round(daysCity * Math.max(12, Math.min(30, c.cpd * 0.18)));
  }, 0);

  const extras = (state.expenses || []).reduce((sum,e)=>sum+Number(e.amount||0),0);

  return {days, vehicles, lodgings, food, tourism, extras, total:vehicles+lodgings+food+tourism+extras};
}

export function orcamento(state){
  const b = connectedBudget(state);
  const rows = [
    ["🚗 Veículos", "Soma dos custos cadastrados na aba Veículos", b.vehicles, "veiculos"],
    ["🏨 Hospedagens", "Soma das hospedagens cadastradas; valores por noite são multiplicados pelas noites da cidade", b.lodgings, "hospedagens"],
    ["🍽️ Comida", `Estimativa automática pelos ${b.days} dias do roteiro`, b.food, "roteiro"],
    ["🎟️ Turismo", "Estimativa automática de passeios, museus e atrações por cidade", b.tourism, "roteiro"],
    ["✨ Extras manuais", "Gastos adicionados manualmente abaixo", b.extras, "extra"]
  ];

  return `
    <div class="section-header">
      <div class="gold-line"></div>
      <h2>Orçamento conectado</h2>
      <p>O orçamento agora é a conexão entre <strong>Veículos</strong>, <strong>Hospedagens</strong> e <strong>Roteiro</strong>. Comida e turismo são calculados automaticamente pelos dias/cidades.</p>
    </div>

    <div class="budget-total">
      <span class="muted">Total geral estimado</span>
      <strong>${euro(b.total)}</strong>
      <span class="muted">veículos + hospedagens + comida + turismo + extras</span>
    </div>

    <div class="grid two">
      <div class="card">
        <h3>Resumo conectado</h3>
        ${rows.map(([title,desc,value,target])=>{
          const pct = Math.round(value / Math.max(b.total,1) * 100);
          return `<div class="bar-row">
            <div class="bar-label">${title}</div>
            <div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div>
            <div class="bar-val">${euro(value)}</div>
          </div>
          <p class="muted" style="font-size:11px;margin:-.35rem 0 .55rem">${desc}</p>`;
        }).join("")}
      </div>

      <div class="card">
        <h3>Ações rápidas</h3>
        <p class="muted">Use os atalhos para preencher as bases que alimentam o orçamento.</p>
        <div class="mini-actions">
          <button class="primary-btn" data-section-go="veiculos">Preencher veículos</button>
          <button class="primary-btn" data-section-go="hospedagens">Preencher hospedagens</button>
          <button class="soft-btn" data-section-go="roteiro">Ajustar roteiro</button>
          <button class="soft-btn" id="autoBudget">Criar reserva extra sugerida</button>
          <button class="danger-btn" id="clearBudget">Limpar extras manuais</button>
        </div>
      </div>
    </div>

    <div class="card" style="margin-top:1rem">
      <h3>Adicionar gasto extra manual</h3>
      <form id="expenseForm" class="grid three">
        <div><label>Categoria</label><input id="expenseCat" placeholder="Emergência"></div>
        <div><label>Valor</label><input id="expenseAmount" type="number" min="0" step="1" placeholder="100"></div>
        <div><label>Descrição</label><input id="expenseDesc" placeholder="Reserva, chip, lavanderia..."></div>
        <button class="primary-btn">Adicionar extra</button>
      </form>
    </div>

    <div class="card" style="margin-top:1rem">
      <h3>Extras manuais</h3>
      <table class="table">
        <thead><tr><th>Categoria</th><th>Descrição</th><th>Valor</th><th></th></tr></thead>
        <tbody>${(state.expenses || []).map(e=>`<tr><td>${esc(e.cat)}</td><td>${esc(e.desc)}</td><td>${euro(e.amount)}</td><td><button class="danger-btn" data-del-expense="${e.id}">Excluir do app</button></td></tr>`).join("") || `<tr><td colspan="4">Nenhum extra manual.</td></tr>`}</tbody>
      </table>
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
  return `<div class="section-header"><div class="gold-line"></div><h2>Diário</h2><p>Registre memórias da viagem.</p></div><div class="card"><form id="diaryForm" class="diary-form"><div class="grid two"><div><label>Cidade</label><input id="diaryCity" placeholder="Paris"></div><div><label>Humor</label><select id="diaryMood"><option>😍 Incrível</option><option>🙂 Bom</option><option>😐 Normal</option><option>😴 Cansativo</option></select></div></div><div><label>Título</label><input id="diaryTitle" required placeholder="Um dia memorável"></div><div><label>Texto</label><textarea id="diaryText" required placeholder="Conte como foi..."></textarea></div><button class="primary-btn">Salvar memória</button></form></div><div style="margin-top:1rem">${state.diary.map(d=>`<article class="diary-entry"><div class="route-city-meta">${esc(d.city)} · ${esc(d.mood)} · ${new Date(d.createdAt).toLocaleDateString("pt-BR")}</div><h4>${esc(d.title)}</h4><p>${esc(d.text)}</p><button class="danger-btn" data-del-diary="${d.id}" style="margin-top:.7rem">Excluir do app</button></article>`).join("") || `<div class="empty-state">Nenhuma memória ainda.</div>`}</div>`;
}

export function online(state){
  const mask = value => value ? "•".repeat(Math.min(18, Math.max(8, String(value).length))) : "não configurado";

  return `<div class="section-header"><div class="gold-line"></div><h2>Nuvem</h2><p>Seu login já está no banco. Use esta tela apenas para enviar ou baixar seu roteiro.</p></div>
  <div class="grid two">
    <div class="card"><h3>☁️ Banco do app</h3>
      <p class="muted">Conexão nativa sem senha:</p>
      <div class="masked-key">URL: ${esc(mask(state.settings.supabaseUrl))}</div>
      <div class="masked-key" style="margin-top:.5rem">KEY: ${esc(mask(state.settings.supabaseAnonKey))}</div>
      <div class="mini-actions" style="margin-top:1rem">
        <button class="soft-btn" id="testSupabase">Verificar conexão</button>
      </div>
      <div class="ai-status" id="supabaseStatus">Status: aguardando teste</div>
    </div>

    <div class="card"><h3>💾 Sincronização</h3>
      <p class="muted">Salve ou recupere os dados da viagem no banco.</p>
      <div class="grid two" style="margin-top:.8rem">
        <button class="soft-btn" id="supabasePull">Baixar nuvem</button>
        <button class="primary-btn" id="supabasePush">Enviar nuvem</button>
      </div>
    </div>
  </div>`;
}

export function admin(state, users, session){
  const mask = value => value ? "•".repeat(Math.min(18, Math.max(8, String(value).length))) : "não configurado";

  return `<div class="section-header">
    <div class="gold-line"></div>
    <h2>Administração</h2>
    <p>Painel do ADM: usuários ficam no Auth custom no banco/app_users; o ADM verifica conexões e gerencia perfis.</p>
  </div>

  <div class="admin-layout">
    <div class="card">
      <h3>Usuários no banco</h3><p class="muted">O primeiro cadastro confirmado no Supabase vira ADM automaticamente. Novos usuários ficam como usuário comum até o ADM alterar.</p>
      <form id="adminCreateUserForm" class="grid three" style="margin-bottom:1rem">
        <div><label>Nome</label><input id="adminUserName" placeholder="Nome do usuário"></div>
        <div><label>Usuário/senha</label><input id="adminUserId" placeholder="ex.: vitor"></div>
        <div><label>Senha</label><input id="adminUserPass" type="password" placeholder="mínimo 6 caracteres"></div><div><label>Confirmar senha</label><input id="adminUserPass2" type="password" placeholder="repita a senha"></div>
        <div><label>Perfil</label><select id="adminUserRole"><option value="user">Usuário</option><option value="admin">ADM</option></select></div>
        <button class="primary-btn">Criar usuário no banco</button>
      </form>

      ${(users || []).map(u=>`
        <div class="user-row">
          <div><strong>${esc(u.name || u.id)}</strong><div class="muted">${esc(u.username || u.id)}</div></div>
          <div><span class="user-role">${esc(u.role || "user")}</span></div>
          <div><span class="pill">${esc(u.status || "active")}</span></div>
          <div class="mini-actions">
            <button class="soft-btn" data-admin-role="${u.id}" data-role="${u.role === "admin" ? "user" : "admin"}">${u.role === "admin" ? "Tornar usuário" : "Tornar ADM"}</button>
            <button class="soft-btn" data-admin-status="${u.id}" data-status="${u.status === "blocked" ? "active" : "blocked"}">${u.status === "blocked" ? "Ativar" : "Bloquear"}</button>
            <button class="soft-btn" data-admin-reset="${u.id}">Trocar senha</button>
            <button class="danger-btn" data-admin-delete="${u.id}">Excluir do app</button>
          </div>
        </div>
      `).join("")}
    </div>

    <div class="card">
      <h3>Conexões nativas</h3>
      <p class="muted">O ADM apenas verifica. URL e chave pública já ficam configuradas no app e são exibidas mascaradas.</p>

      <div class="security-status">
        <div class="status-card" id="adminSupabaseCard">
          <div class="status-title">Nível 1 · Supabase</div>
          <div class="status-text">URL: ${esc(mask(state.settings.supabaseUrl))}<br>KEY: ${esc(mask(state.settings.supabaseAnonKey))}</div>
        </div>
        <div class="status-card" id="adminDbCard">
          <div class="status-title">Nível 2 · Banco</div>
          <div class="status-text">Tabela esperada: app_states<br>RLS: obrigatório</div>
        </div>
        <div class="status-card" id="adminAuthCard">
          <div class="status-title">Nível 3 · Auth</div>
          <div class="status-text">Auth custom no banco + app_users no banco</div>
        </div>
        <div class="status-card ok" id="adminLocalAiCard">
          <div class="status-title">Nível 4 · IA local</div>
          <div class="status-text">Fallback local ativo no navegador</div>
        </div>
      </div>

      <div class="mini-actions" style="margin-top:1rem">
        <button class="primary-btn" id="adminTestAll">Verificar tudo</button>
        <button class="soft-btn" id="testSupabase">Testar Supabase</button>
      </div>

      <div class="ai-status" id="adminConnectionStatus">Status: aguardando verificação</div>

      <div class="code-box" style="margin-top:1rem">Conexão ativa nativamente:
- Supabase URL configurada
- Publishable key configurada
- Chaves mascaradas na interface
- ADM não edita a viagem
- Exclusão de contas locais disponível
- Para apagar usuário dentro do Auth custom no banco, é necessário backend seguro com service_role</div>
    </div>
  </div>`;
}
