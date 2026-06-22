import { DB, RATES } from "./data.js";
import { register, login, logout, getSession, loadState, saveState, initializePresetUsers, adminListUsers, adminRefreshUsers, adminCreateUser, adminSetUserStatus, adminSetUserRole, adminResetPassword, adminDeleteUser, submitChangeRequest, adminListRequests, adminRefreshRequests, adminApproveRequest, adminRejectRequest } from "./store.js";
import { $, $$, toast, saved, uid, euro } from "./ui.js";
import { routeStrip, roteiro, viagem, montador, mapa, ia, paises, veiculos, hospedagens, orcamento, dicas, checklist, mochila, moedas, frases, diario, online, admin, cityChips, generatedSuggestions, daysFromRoute } from "./render.js";
import { generateAI } from "./ai.js";
import { isSupabaseConfigured, supabaseCurrentUser, supabaseSignUp, supabaseSignIn, supabaseSignOut, supabasePush, supabasePull } from "./supabaseSync.js";

let session = getSession();
let state = session ? loadState(session.id) : null;
let section = "roteiro";
let cloudSaveTimer = null;

const views = { roteiro, viagem, montador, mapa, ia, paises, veiculos, hospedagens, orcamento, dicas, checklist, mochila, moedas, frases, diario, online, admin };

function persist(message){
  saveState(session.id, state);
  saved();
  if(session && !isAdmin()) scheduleProfileCloudSave();
  if(message) toast(message);
}

function scheduleProfileCloudSave(){
  clearTimeout(cloudSaveTimer);
  cloudSaveTimer = setTimeout(async () => {
    try{ await supabasePush(state); saved(); }
    catch(err){ console.warn("Autosave do perfil falhou:", err); }
  }, 1000);
}

async function hydrateFromCloud(){
  if(!session || !state) return;

  try{
    const cloud = await supabasePull();
    if(cloud?.state){
      const keepSettings = {...(state.settings || {})};
      state = {
        ...state,
        ...cloud.state,
        settings:{
          ...(cloud.state.settings || {}),
          ...keepSettings
        }
      };
      saveState(session.id, state);
    }
  }catch(err){
    console.warn("Usando versão local/offline:", err);
  }
}

function buildPrincipalSuggestion(){
  const clean = JSON.parse(JSON.stringify(state));

  clean.dayDone = {};
  clean.dayNotes = {};
  clean.openDay = null;
  clean.diary = [];
  clean.expenses = [];
  clean.aiHistory = [];
  clean.checklist = (clean.checklist || []).map(i => ({...i, done:false}));
  clean.pack = (clean.pack || []).map(i => ({...i, done:false}));

  clean.settings ||= {};
  [
    "emergencyName","emergencyPhone","emergencyInsurance","emergencyPolicy",
    "emergencyPassport","emergencyEmbassy","emergencyHotel","emergencyNotes"
  ].forEach(k => clean.settings[k] = "");

  return clean;
}

function sectionLabel(){
  const labels = {
    roteiro:"Roteiro + Mapa", viagem:"Viagem", montador:"Montar", ia:"IA",
    paises:"Países", veiculos:"Veículos", hospedagens:"Hospedagens",
    orcamento:"Orçamento", dicas:"Dicas", checklist:"Checklist", mochila:"Mochila",
    moedas:"Moedas", frases:"Frases", diario:"Diário"
  };
  return labels[section] || section;
}

function showLogin(){
  $("#loginScreen").classList.remove("hidden");
  $("#hero").classList.add("hidden");
  $("#app").classList.add("hidden");
}

async function doLogout(){
  try{ await logout(); }catch{}
  session = null;
  state = null;
  section = "roteiro";
  showLogin();
  toast("Você saiu.");
}

function showHero(){
  $("#loginScreen").classList.add("hidden");
  $("#hero").classList.remove("hidden");
  $("#app").classList.add("hidden");
  renderStrips();
}

function showApp(){
  $("#loginScreen").classList.add("hidden");
  $("#hero").classList.add("hidden");
  $("#app").classList.remove("hidden");
  render();
}

async function enterAfterAuth(){
  section = session?.role === "admin" ? "admin" : "roteiro";

  try{
    await hydrateFromCloud();
    if(session?.role === "admin"){
      await adminRefreshUsers(session);
      await adminRefreshRequests(session);
    }
    showApp();
  }catch(err){
    console.error("Erro ao abrir o app depois do login:", err);
    toast("Login feito, mas houve erro ao abrir o painel. Recarregue a página.");
    $("#loginScreen").classList.add("hidden");
    $("#hero").classList.add("hidden");
    $("#app").classList.remove("hidden");
  }
}

function renderStrips(){
  const html = routeStrip(state?.route || []);
  const heroStrip = $("#heroRouteStrip");
  const loginStrip = $("#loginRouteStrip");

  if(heroStrip) heroStrip.innerHTML = html;
  if(loginStrip) loginStrip.innerHTML = html || routeStrip(["lisboa","barcelona","paris","berlim","veneza"]);
}

function isAdmin(){ return session?.role === "admin"; }

function render(){
  renderStrips();

  document.body.classList.toggle("admin-mode", isAdmin());

  $$(".nav-btn").forEach(btn => {
    const sec = btn.dataset.section;
    const isAdminTab = sec === "admin";
    const hiddenForAdmin = new Set(["checklist","mochila","frases","diario","online","moedas"]);
    const hiddenForUser = new Set(["online"]);
    const show = sec
      ? ((!isAdminTab || isAdmin()) && !(isAdmin() ? hiddenForAdmin.has(sec) : hiddenForUser.has(sec)))
      : true;
    btn.classList.toggle("hidden", !show);
  });

  const sessionUserLabel = $("#sessionUserLabel");
  if(sessionUserLabel){
    const mode = isAdmin() ? "ADM · PRINCIPAL" : "USER · MINHA VERSÃO";
    sessionUserLabel.textContent = session ? `${mode} · ${session.name || session.username || ""}` : "";
  }

  $$(".admin-only").forEach(el => el.classList.toggle("hidden", !isAdmin()));

  if(section === "admin"){
    $("#view").className = "section active";
    $("#view").innerHTML = admin(state, adminListUsers(session), session, adminListRequests(session));
  }else{
    const view = views[section] || roteiro;
    const isReadOnlyPrincipal = isAdmin();
    $("#view").className = section === "mapa"
      ? `section full-map active ${isReadOnlyPrincipal ? "readonly-cover" : ""}`
      : `section active ${isReadOnlyPrincipal ? "readonly-cover" : ""}`;

    const banner = isReadOnlyPrincipal
      ? `<div class="mode-banner"><div>👑 <strong>ADM visualizando o Principal/oficial.</strong><br><span class="muted">Edição direta bloqueada. O Principal só muda quando você aprova uma solicitação na Administração.</span></div><button class="soft-btn" data-section-go="admin">Ver solicitações</button></div>`
      : `<div class="mode-banner user"><div>👤 <strong>Minha versão.</strong><br><span class="muted">Suas alterações ficam na sua conta. Para mudar o Principal, envie uma solicitação ao ADM.</span></div><button class="primary-btn" id="requestChangeBtn">Solicitar alteração</button></div>`;

    $("#view").innerHTML = banner + view(state);
  }

  $$(".nav-btn").forEach(b => b.classList.toggle("active", b.dataset.section && b.dataset.section === section));
  bind();
  if(section === "mapa" || section === "roteiro") setTimeout(initLeafletMap, 80);
}
function routeSegments(){
  const segments = [];
  for(let i=0;i<state.route.length-1;i++){
    const a = DB[state.route[i]];
    const b = DB[state.route[i+1]];
    if(a && b) segments.push({from:a.name,to:b.name,fromId:state.route[i],toId:state.route[i+1]});
  }
  return segments;
}


function calcDurationFromDates(departAt, arriveAt){
  if(!departAt || !arriveAt) return "";
  const start = new Date(departAt);
  const end = new Date(arriveAt);
  const diff = end - start;
  if(!Number.isFinite(diff) || diff <= 0) return "";
  const mins = Math.round(diff / 60000);
  const d = Math.floor(mins / 1440);
  const h = Math.floor((mins % 1440) / 60);
  const m = mins % 60;
  return `${d ? d + "d " : ""}${h ? h + "h" : ""}${m ? String(m).padStart(2,"0") + "m" : ""}`.trim() || "0m";
}
function convertVehicleCost(amount, currency, fxRate){
  const value = Number(amount || 0);
  const cur = currency || "EUR";
  const rate = Number(fxRate || RATES[cur] || 1);
  return cur === "EUR" ? value : value / Math.max(rate,0.0001);
}
function updateVehicleDurationPreview(){
  const out = $("#vehDurationAuto");
  if(out) out.value = calcDurationFromDates($("#vehDepartAt")?.value, $("#vehArriveAt")?.value);
}
function updateVehicleFx(){
  const cur = $("#vehCurrency")?.value || "EUR";
  const fx = $("#vehFxRate");
  if(fx && (!fx.value || cur !== "BRL")) fx.value = RATES[cur] || 1;
}
function normalizeVehicle(v){
  v.duration = calcDurationFromDates(v.departAt, v.arriveAt) || v.duration || "";
  v.costEUR = convertVehicleCost(v.costAmount, v.currency, v.fxRate);
  v.cost = v.costAmount ? `${v.currency || "EUR"} ${Number(v.costAmount).toFixed(2)}` : "";
  v.from = v.fromCity || v.from || "";
  v.to = v.toCity || v.to || "";
  return v;
}

function suggestVehicleForSegment(seg){
  const long = ["Lisboa","Atenas","Copenhague"].includes(seg.from) || ["Lisboa","Atenas","Copenhague"].includes(seg.to);
  return {
    id:uid(),
    type: long ? "aviao" : "trem",
    fromCountry:seg.fromCountry || "",
    fromCity:seg.from,
    toCountry:seg.toCountry || "",
    toCity:seg.to,
    from:seg.from,
    to:seg.to,
    duration: long ? "2h-4h" : "2h-7h",
    costAmount: long ? 110 : 60,
    currency:"EUR",
    fxRate:1,
    costEUR: long ? 110 : 60,
    cost: long ? "EUR 110.00" : "EUR 60.00",
    provider: long ? "Skyscanner / Google Flights" : "Omio / Trainline / site oficial",
    notes: long ? "Opção rápida. Verificar bagagem e deslocamento até aeroporto." : "Opção confortável. Comparar preço com ônibus e reservar cedo."
  };
}

function autoVehicles(){
  state.vehicles = routeSegments().map(suggestVehicleForSegment);
  persist("Veículos autopreenchidos.");
  render();
}

function autoBudget(){
  const days = state.route.reduce((sum,id)=>sum+(state.cityDays[id]||DB[id].sugDays||2),0);
  state.expenses = [
    {id:uid(),cat:"Reserva",desc:"Reserva extra para imprevistos, lavanderia, chip, taxas e variações de preço",amount:Math.max(100, days * 10)}
  ];
  persist("Reserva extra sugerida criada.");
  render();
}


function autoLodgings(){
  state.lodgings = state.route.map(id => {
    const c = DB[id];
    const nights = Math.max(1, (state.cityDays[id] || c.sugDays || 2) - 1);
    const type = c.cpd >= 110 ? "hostel" : "hotel";
    return {
      id:uid(), type, city:c.name,
      name:type === "hostel" ? `Hostel central em ${c.name}` : `Hotel econômico em ${c.name}`,
      checkin:"", checkout:"",
      cost:`€${Math.round((c.cpd * 0.45) || 40)}/noite`,
      area:"Perto do centro ou estação principal",
      link:"", status:"Pesquisando",
      notes:`Autopreenchido para ${nights} noite(s). Verificar cancelamento grátis, locker/bagagem e distância do transporte.`
    };
  });
  persist("Hospedagens autopreenchidas.");
  render();
}

function initLeafletMap(){
  const el = $("#leafletMap");
  if(!el) return;

  if(!window.L){
    el.innerHTML = "<div class='empty-state'>Leaflet não carregou. Verifique a conexão.</div>";
    return;
  }

  if(window.__mochilaoMap){
    window.__mochilaoMap.remove();
    window.__mochilaoMap = null;
  }

  const map = L.map(el, {
    scrollWheelZoom:true,
    worldCopyJump:true
  }).setView([48.8, 10.5], 4);

  window.__mochilaoMap = map;

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom:19,
    attribution:"© OpenStreetMap"
  }).addTo(map);

  const routeIds = (state.route || []).filter(id => DB[id] && typeof DB[id].lat === "number" && typeof DB[id].lng === "number");
  const routeLatLngs = routeIds.map(id => [DB[id].lat, DB[id].lng]);

  const markerById = {};
  const allMarkers = [];

  Object.entries(DB).forEach(([id,c]) => {
    if(typeof c.lat !== "number" || typeof c.lng !== "number") return;

    const inRoute = routeIds.includes(id);
    const routeIndex = routeIds.indexOf(id);

    const marker = L.marker([c.lat,c.lng]).addTo(map);
    markerById[id] = marker;
    allMarkers.push(marker);

    const orderBadge = inRoute ? `<div class="map-popup-meta">Parada ${routeIndex + 1} no roteiro</div>` : "";

    marker.bindPopup(`
      <img class="map-popup-img" src="${c.image}" alt="${c.name}">
      <div class="map-popup-title">${c.flag} ${c.name}</div>
      <div class="map-popup-meta">${c.country} · ${c.vibe}</div>
      ${orderBadge}
      <button class="map-popup-btn" data-popup-toggle="${id}">${inRoute ? "Remover do roteiro" : "Adicionar ao roteiro"}</button>
    `);

    marker.on("popupopen", () => {
      setTimeout(() => {
        document.querySelector(`[data-popup-toggle="${id}"]`)?.addEventListener("click", () => {
          if(state.route.includes(id)){
            state.route = state.route.filter(x => x !== id);
          }else{
            state.route.push(id);
            state.cityDays[id] ||= c.sugDays || 2;
          }
          persist("Roteiro atualizado pelo mapa.");
          render();
        });
      }, 20);
    });
  });

  if(routeLatLngs.length > 1){
    const line = L.polyline(routeLatLngs, {
      weight:4,
      opacity:.9,
      smoothFactor:1.2
    }).addTo(map);

    // Numera cada parada na ordem real do roteiro
    routeIds.forEach((id,index) => {
      const c = DB[id];
      L.circleMarker([c.lat,c.lng], {
        radius:13,
        weight:2,
        fillOpacity:.95
      }).addTo(map).bindTooltip(String(index + 1), {
        permanent:true,
        direction:"center",
        className:"route-number-tooltip"
      });
    });

    map.fitBounds(line.getBounds(), {padding:[35,35]});
  }else if(routeLatLngs.length === 1){
    map.setView(routeLatLngs[0], 8);
  }else if(allMarkers.length){
    map.fitBounds(L.featureGroup(allMarkers).getBounds(), {padding:[35,35]});
  }

  $("#fitMapRoute")?.addEventListener("click", () => {
    if(routeLatLngs.length > 1){
      map.fitBounds(L.polyline(routeLatLngs).getBounds(), {padding:[35,35]});
    }else if(routeLatLngs.length === 1){
      map.setView(routeLatLngs[0], 8);
    }
  });

  setTimeout(() => map.invalidateSize(), 250);
}


function autoAllDaySuggestions(){
  daysFromRoute(state).forEach(day => {
    state.daySuggestions[day.key] = generatedSuggestions(day);
  });
  persist("Sugestões dos dias autopreenchidas.");
  render();
}

function bind(){
  $$("[data-section]").forEach(btn => btn.onclick = () => { section = btn.dataset.section; render(); });
  $$("[data-section-go]").forEach(btn => btn.onclick = () => { section = btn.dataset.sectionGo; render(); });

  $("#autoFillAll")?.addEventListener("click", autoAllDaySuggestions);

  $$("[data-open-day]").forEach(el => el.onclick = (e) => {
    if(e.target.closest("[data-toggle-day]")) return;
    state.openDay = state.openDay === el.dataset.openDay ? null : el.dataset.openDay;
    persist();
    render();
  });

  $$("[data-toggle-day]").forEach(btn => btn.onclick = (e) => {
    e.stopPropagation();
    const key = btn.dataset.toggleDay;
    state.dayDone[key] = !state.dayDone[key];
    persist("Dia atualizado.");
    render();
  });

  $$("[data-day-note]").forEach(area => area.oninput = () => {
    state.dayNotes[area.dataset.dayNote] = area.value;
    persist();
  });

  $$("[data-day-suggestions]").forEach(area => area.oninput = () => {
    state.daySuggestions[area.dataset.daySuggestions] = area.value;
    persist();
  });

  $$("[data-reset-suggestions]").forEach(btn => btn.onclick = () => {
    const c = DB[btn.dataset.city];
    state.daySuggestions[btn.dataset.resetSuggestions] = generatedSuggestions({city:c, localDay:Number(btn.dataset.localDay)});
    persist("Dicas do dia regeneradas.");
    render();
  });

  $$("[data-city-chip]").forEach(chip => chip.onclick = () => {
    const id = chip.dataset.cityChip;
    if(state.route.includes(id)) state.route = state.route.filter(x => x !== id);
    else {
      state.route.push(id);
      state.cityDays[id] ||= DB[id].sugDays || 2;
    }
    persist("Roteiro atualizado.");
    render();
  });

  $$("[data-country]").forEach(btn => btn.onclick = () => {
    $$("#countryFilter .filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    $("#cityPalette").innerHTML = cityChips(state, btn.dataset.country);
    bind();
  });

  $$("[data-days-dec],[data-days-inc]").forEach(btn => btn.onclick = () => {
    const id = btn.dataset.daysDec || btn.dataset.daysInc;
    const delta = btn.dataset.daysInc ? 1 : -1;
    state.cityDays[id] = Math.min(7, Math.max(1, (state.cityDays[id] || DB[id].sugDays || 2) + delta));
    persist("Dias alterados.");
    render();
  });

  $$("[data-move-up],[data-move-down]").forEach(btn => btn.onclick = () => {
    const id = btn.dataset.moveUp || btn.dataset.moveDown;
    const i = state.route.indexOf(id);
    const j = i + (btn.dataset.moveUp ? -1 : 1);
    if(j < 0 || j >= state.route.length) return;
    [state.route[i], state.route[j]] = [state.route[j], state.route[i]];
    persist("Ordem alterada.");
    render();
  });

  $$("[data-remove-city]").forEach(btn => btn.onclick = () => {
    state.route = state.route.filter(x => x !== btn.dataset.removeCity);
    persist("Cidade removida.");
    render();
  });

  $$("[data-map-city]").forEach(point => {
    point.onclick = () => {
      const id = point.dataset.mapCity;
      const c = DB[id];
      const tip = $("#mapTooltip");
      tip.innerHTML = `<div class="tooltip-img"><img src="${c.image}" alt="${c.name}" loading="lazy"></div><div class="tooltip-name">${c.flag} ${c.name}</div><div class="tooltip-meta">${c.country} · ${c.vibe}</div><div class="tooltip-desc">${c.desc}</div><button class="primary-btn full" data-map-toggle="${id}">${state.route.includes(id) ? "Remover do roteiro" : "Adicionar ao roteiro"}</button>`;
      const x = Math.min(78, Math.max(4, c.x + 2));
      const y = Math.min(70, Math.max(5, c.y - 18));
      tip.style.left = x + "%";
      tip.style.top = y + "%";
      tip.classList.add("show");
      tip.querySelector("[data-map-toggle]").onclick = () => {
        if(state.route.includes(id)) state.route = state.route.filter(x => x !== id);
        else state.route.push(id);
        persist("Mapa atualizado.");
        render();
      };
    };
  });


  $$("[data-map-list-toggle]").forEach(btn => btn.onclick = () => {
    const id = btn.dataset.mapListToggle;
    if(state.route.includes(id)) state.route = state.route.filter(x => x !== id);
    else { state.route.push(id); state.cityDays[id] ||= DB[id].sugDays || 2; }
    persist("Roteiro atualizado pelo mapa.");
    render();
  });

  $("#autoVehicles")?.addEventListener("click", autoVehicles);
  $("#clearVehicles")?.addEventListener("click", () => { state.vehicles = []; persist("Veículos limpos."); render(); });

  $("#vehDepartAt")?.addEventListener("input", updateVehicleDurationPreview);
  $("#vehArriveAt")?.addEventListener("input", updateVehicleDurationPreview);
  $("#vehCurrency")?.addEventListener("change", updateVehicleFx);

  $("#vehicleForm")?.addEventListener("submit", e => {
    e.preventDefault();
    const vehicle = normalizeVehicle({
      id:uid(),
      type:$("#vehType").value,
      fromCountry:$("#vehFromCountry").value,
      fromCity:$("#vehFromCity").value,
      toCountry:$("#vehToCountry").value,
      toCity:$("#vehToCity").value,
      departAt:$("#vehDepartAt").value,
      arriveAt:$("#vehArriveAt").value,
      costAmount:Number($("#vehCostAmount").value || 0),
      currency:$("#vehCurrency").value,
      fxRate:Number($("#vehFxRate").value || 1),
      provider:$("#vehProvider").value,
      notes:$("#vehNotes").value
    });
    state.vehicles.push(vehicle);
    persist("Veículo adicionado.");
    render();
  });

  $$("[data-del-vehicle]").forEach(btn => btn.onclick = () => {
    state.vehicles = state.vehicles.filter(v => v.id !== btn.dataset.delVehicle);
    persist("Veículo removido.");
    render();
  });

  $$("[data-vehicle-field]").forEach(input => input.oninput = input.onchange = () => {
    const [id,field] = input.dataset.vehicleField.split(":");
    const v = state.vehicles.find(x => x.id === id);
    if(v){
      v[field] = input.type === "number" ? Number(input.value || 0) : input.value;
      normalizeVehicle(v);
    }
    persist();
  });


  $("#autoLodgings")?.addEventListener("click", autoLodgings);
  $("#clearLodgings")?.addEventListener("click", () => {
    state.lodgings = [];
    persist("Hospedagens limpas.");
    render();
  });
  $("#lodgingForm")?.addEventListener("submit", e => {
    e.preventDefault();
    state.lodgings ||= [];
    state.lodgings.push({
      id:uid(), type:$("#lodType").value, city:$("#lodCity").value, name:$("#lodName").value,
      checkin:$("#lodCheckin").value, checkout:$("#lodCheckout").value, cost:$("#lodCost").value,
      area:$("#lodArea").value, link:$("#lodLink").value, status:$("#lodStatus").value, notes:$("#lodNotes").value
    });
    persist("Hospedagem adicionada.");
    render();
  });
  $$("[data-del-lodging]").forEach(btn => btn.onclick = () => {
    state.lodgings = (state.lodgings || []).filter(l => l.id !== btn.dataset.delLodging);
    persist("Hospedagem removida.");
    render();
  });
  $$("[data-lodging-field]").forEach(input => input.oninput = () => {
    const [id,field] = input.dataset.lodgingField.split(":");
    const l = (state.lodgings || []).find(x => x.id === id);
    if(l) l[field] = input.value;
    persist();
  });

  $$("[data-ai-mode]").forEach(btn => btn.onclick = async () => {
    const mode = btn.dataset.aiMode;
    const question = $("#aiQuestion")?.value || "";
    const content = $("#aiContent");
    content.innerHTML = `<div class="ai-loading"><div class="ai-spinner"></div>Gerando sugestões...</div>`;
    btn.disabled = true;
    try{
      const result = await generateAI(state, mode, question);
      state.aiHistory.unshift(result);
      state.aiHistory = state.aiHistory.slice(0,8);
      persist("Sugestões geradas.");
      render();
    }catch(err){
      content.innerHTML = `<div class="ai-card"><h4>Erro na IA online</h4><p class="muted">${err.message}</p></div>`;
      toast("Erro na IA online.");
    }finally{ btn.disabled = false; }
  });

  $("#autoBudget")?.addEventListener("click", autoBudget);
  $("#clearBudget")?.addEventListener("click", () => { state.expenses = []; persist("Extras manuais limpos."); render(); });

  $("#expenseForm")?.addEventListener("submit", e => {
    e.preventDefault();
    state.expenses.push({id:uid(), cat:$("#expenseCat").value || "Outros", desc:$("#expenseDesc").value || "Gasto", amount:Number($("#expenseAmount").value || 0)});
    persist("Gasto adicionado.");
    render();
  });

  $$("[data-del-expense]").forEach(btn => btn.onclick = () => {
    state.expenses = state.expenses.filter(e => e.id !== btn.dataset.delExpense);
    persist("Gasto removido.");
    render();
  });

  $$("[data-toggle-check]").forEach(item => item.onclick = () => {
    const x = state.checklist.find(c => c.id === item.dataset.toggleCheck);
    if(x) x.done = !x.done;
    persist("Checklist atualizado.");
    render();
  });

  $$("[data-toggle-pack]").forEach(item => item.onclick = () => {
    const x = state.pack.find(p => p.id === item.dataset.togglePack);
    if(x) x.done = !x.done;
    persist("Mochila atualizada.");
    render();
  });

  $("#curFrom")?.addEventListener("change", e => { state.settings.currencyFrom = e.target.value; persist(); render(); });
  $("#curTo")?.addEventListener("change", e => { state.settings.currencyTo = e.target.value; persist(); render(); });
  $("#curAmount")?.addEventListener("input", updateCurrency);
  $("#swapCurrency")?.addEventListener("click", () => {
    [state.settings.currencyFrom,state.settings.currencyTo] = [state.settings.currencyTo,state.settings.currencyFrom];
    persist();
    render();
  });
  updateCurrency();

  $$("[data-lang]").forEach(btn => btn.onclick = () => {
    state.settings.phraseLang = btn.dataset.lang;
    persist();
    render();
  });


  $("#phraseCountry")?.addEventListener("change", e => { state.settings.phraseCountry = e.target.value; persist(); render(); });
  $("#phraseCategory")?.addEventListener("change", e => { state.settings.phraseCategory = e.target.value; persist(); render(); });
  $("#phraseSearch")?.addEventListener("input", e => { state.settings.phraseSearch = e.target.value; persist(); render(); });
  $("#tipCountry")?.addEventListener("change", e => { state.settings.tipCountry = e.target.value; persist(); render(); });
  $("#tipType")?.addEventListener("change", e => { state.settings.tipType = e.target.value; persist(); render(); });
  $("#tipSearch")?.addEventListener("input", e => { state.settings.tipSearch = e.target.value; persist(); render(); });

  $$("[data-copy]").forEach(card => card.onclick = async () => {
    await navigator.clipboard?.writeText(card.dataset.copy);
    toast("Frase copiada.");
  });

  $("#diaryForm")?.addEventListener("submit", e => {
    e.preventDefault();
    state.diary.unshift({id:uid(), city:$("#diaryCity").value, mood:$("#diaryMood").value, title:$("#diaryTitle").value, text:$("#diaryText").value, createdAt:new Date().toISOString()});
    persist("Memória salva.");
    render();
  });

  $$("[data-del-diary]").forEach(btn => btn.onclick = () => {
    state.diary = state.diary.filter(d => d.id !== btn.dataset.delDiary);
    persist("Memória removida.");
    render();
  });


  $("#adminCreateUserForm")?.addEventListener("submit", async e => {
    e.preventDefault();
    try{
      await adminCreateUser(session,{
        name:$("#adminUserName").value,
        user:$("#adminUserId").value || $("#adminUserName").value,
        password:$("#adminUserPass").value,
        password2:$("#adminUserPass2")?.value,
        role:$("#adminUserRole").value
      });
      toast("Usuário criado no banco.");
      await adminRefreshUsers(session);
      render();
    }catch(err){ toast(err.message); }
  });

  $$("[data-admin-status]").forEach(btn => btn.onclick = async () => {
    try{
      await adminSetUserStatus(session, btn.dataset.adminStatus, btn.dataset.status);
      toast("Status atualizado no banco.");
      render();
    }catch(err){ toast(err.message); }
  });

  $$("[data-admin-role]").forEach(btn => btn.onclick = async () => {
    try{
      await adminSetUserRole(session, btn.dataset.adminRole, btn.dataset.role);
      toast("Perfil atualizado no banco.");
      render();
    }catch(err){ toast(err.message); }
  });

  $$("[data-admin-reset]").forEach(btn => btn.onclick = async () => {
    const pass = prompt("Digite a nova senha para este usuário:");
    if(!pass) return;
    const pass2 = prompt("Confirme a nova senha:");
    if(pass !== pass2){ toast("As senhas não conferem."); return; }
    try{
      await adminResetPassword(session, btn.dataset.adminReset, pass);
      toast("Senha trocada pelo ADM.");
    }catch(err){ toast(err.message); }
  });


  $$("[data-admin-delete]").forEach(btn => btn.onclick = async () => {
    const userId = btn.dataset.adminDelete;
    if(!confirm("Excluir/bloquear esta conta no banco do app? O usuário não conseguirá mais entrar no app.")) return;
    try{
      await adminDeleteUser(session, userId);
      toast("Conta excluída do app.");
      render();
    }catch(err){ toast(err.message); }
  });

  $("#testSupabase")?.addEventListener("click", testSupabaseConnection);
  $("#testAI")?.addEventListener("click", testAIConnection);
  $("#testAllConnections")?.addEventListener("click", testAllConnections);
  $("#adminTestAll")?.addEventListener("click", testAllConnections);


  $$("[data-setting]").forEach(input => {
    input.oninput = () => {
      state.settings[input.dataset.setting] = input.value;
      persist();
    };
  });

  $("#backupJson")?.addEventListener("click", () => {
    const payload = {
      exportedAt:new Date().toISOString(),
      user:session ? {id:session.id,name:session.name,role:session.role} : null,
      state
    };
    const blob = new Blob([JSON.stringify(payload,null,2)], {type:"application/json"});
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `roteiro-europa-backup-${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(a.href);
    toast("Backup baixado.");
  });

  $("#backupFile")?.addEventListener("change", async e => {
    const file = e.target.files?.[0];
    if(!file) return;
    try{
      const text = await file.text();
      const parsed = JSON.parse(text);
      const imported = parsed.state || parsed;
      state = {...state, ...imported, settings:{...state.settings, ...(imported.settings || {})}};
      persist("Backup importado.");
      render();
    }catch(err){
      toast("Backup inválido.");
    }
  });

  $("#syncNow")?.addEventListener("click", async () => {
    try{
      await supabasePush(state);
      toast("Viagem enviada para nuvem.");
    }catch(err){
      toast(err.message);
    }
  });

  $("#globalLogoutBtn")?.addEventListener("click", doLogout);


  $("#requestChangeBtn")?.addEventListener("click", async () => {
    try{
      const defaultTitle = `Alteração em ${sectionLabel()}`;
      const title = prompt("Título da solicitação:", defaultTitle);
      if(!title) return;

      const reason = prompt("Explique o motivo da alteração para o ADM:", "");
      if(reason === null) return;

      await submitChangeRequest(session, {
        type:sectionLabel(),
        title,
        reason,
        suggestedState:buildPrincipalSuggestion()
      });

      toast("Solicitação enviada para o ADM.");
    }catch(err){ toast(err.message); }
  });

  $$("[data-approve-request]").forEach(btn => btn.onclick = async () => {
    const comment = prompt("Comentário do ADM ao aprovar:", "Aprovado.");
    if(comment === null) return;

    try{
      await adminApproveRequest(session, btn.dataset.approveRequest, comment);
      await adminRefreshRequests(session);
      await hydrateFromCloud();
      toast("Solicitação aprovada. Principal atualizado.");
      render();
    }catch(err){ toast(err.message); }
  });

  $$("[data-reject-request]").forEach(btn => btn.onclick = async () => {
    const comment = prompt("Motivo da rejeição:", "Rejeitado.");
    if(comment === null) return;

    try{
      await adminRejectRequest(session, btn.dataset.rejectRequest, comment);
      await adminRefreshRequests(session);
      toast("Solicitação rejeitada.");
      render();
    }catch(err){ toast(err.message); }
  });

  bindSupabase();
}

function updateCurrency(){
  const amount = Number($("#curAmount")?.value || 100);
  const result = $("#currencyResult");
  if(!result) return;
  const from = state.settings.currencyFrom || "EUR";
  const to = state.settings.currencyTo || "BRL";
  const value = amount * ((RATES[to] || 1) / (RATES[from] || 1));
  result.textContent = `${value.toFixed(2)} ${to}`;
}

function saveSupabaseFields(){
  if($("#supabaseUrl")) state.settings.supabaseUrl = $("#supabaseUrl").value.trim();
  if($("#supabaseAnonKey")) state.settings.supabaseAnonKey = $("#supabaseAnonKey").value.trim();
  if($("#supabaseEmail")) state.settings.supabaseEmail = $("#supabaseEmail").value.trim();
  saveState(session.id, state);
}

async function updateSupabaseStatus(userOverride){
  const el = $("#supabaseStatus");
  if(!el) return;
  try{
    if(!isSupabaseConfigured(state)){ el.textContent = "Status: Supabase não configurado"; return; }
    const user = userOverride === undefined ? await supabaseCurrentUser(state) : userOverride;
    el.textContent = user ? `Status: conectado como ${user.email || user.id}` : "Status: configurado, mas sem login";
  }catch{ el.textContent = "Status: configurado, mas sem login"; }
}


async function testSupabaseConnection(){
  const status = $("#supabaseStatus") || $("#adminConnectionStatus");
  const url = state.settings.supabaseUrl;
  const key = state.settings.supabaseAnonKey;

  try{
    if(!url || !key) throw new Error("Supabase não configurado.");

    const cleanUrl = url.replace(/\/rest\/v1\/?$/,"").replace(/\/$/,"");

    const res = await fetch(`${cleanUrl}/rest/v1/rpc/app_current_user`, {
      method:"POST",
      headers:{
        apikey:key,
        Authorization:`Bearer ${key}`,
        "Content-Type":"application/json"
      },
      body:JSON.stringify({p_token:"teste"})
    });

    if(res.status !== 400 && res.status !== 401 && res.status !== 200){
      throw new Error(`RPC respondeu ${res.status}`);
    }

    if(status) status.textContent = "Supabase ativo: RPCs de auth custom responderam.";
    $("#adminSupabaseCard")?.classList.add("ok");
    $("#adminSupabaseCard")?.classList.remove("bad");
    $("#adminDbCard")?.classList.add("ok");
    $("#adminDbCard")?.classList.remove("bad");
    $("#adminAuthCard")?.classList.add("ok");
    $("#adminAuthCard")?.classList.remove("bad");

    return {ok:true,text:"Supabase ativo"};
  }catch(err){
    if(status) status.textContent = `Supabase falhou: ${err.message}`;
    $("#adminSupabaseCard")?.classList.add("bad");
    $("#adminSupabaseCard")?.classList.remove("ok");
    $("#adminDbCard")?.classList.add("bad");
    $("#adminDbCard")?.classList.remove("ok");
    return {ok:false,text:err.message};
  }
}

async function testAIConnection(){
  const status = $("#aiStatus") || $("#adminConnectionStatus");
  try{
    if(!state.settings.aiEndpoint) throw new Error("Endpoint IA não configurado.");
    const res = await fetch(state.settings.aiEndpoint, {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({mode:"ping",question:"teste de conexão",route:[]})
    });
    if(!res.ok) throw new Error(`IA retornou ${res.status}`);
    if(status) status.textContent = "IA ativa: endpoint respondeu.";
    return {ok:true,text:"IA ativa"};
  }catch(err){
    if(status) status.textContent = `IA: ${err.message}`;
    return {ok:false,text:err.message};
  }
}

async function testAllConnections(){
  const supa = await testSupabaseConnection();
  const iaLocal = {ok:true,text:"IA local ativa"};
  const msg = `Supabase: ${supa.ok ? "ativo" : "falhou"} | IA local: ativa`;
  $("#adminConnectionStatus") && ($("#adminConnectionStatus").textContent = msg);
  $("#adminLocalAiCard")?.classList.add("ok");
  $("#adminLocalAiCard")?.classList.remove("bad");
  toast(msg);
}

function bindSupabase(){
  $("#saveAiEndpoint")?.addEventListener("click", () => {
    state.settings.aiEndpoint = $("#aiEndpoint").value.trim();
    persist("Endpoint de IA salvo.");
    render();
  });

  $("#saveSupabaseConfig")?.addEventListener("click", () => {
    saveSupabaseFields();
    persist("Configuração Supabase salva.");
    updateSupabaseStatus();
  });

  $("#copySupabaseSql")?.addEventListener("click", async () => {
    await navigator.clipboard?.writeText($("#supabaseSql").innerText);
    toast("SQL copiado.");
  });

  $("#supabaseSignup")?.addEventListener("click", async () => {
    try{
      saveSupabaseFields();
      const user = await supabaseSignUp(state, $("#supabaseEmail").value.trim(), $("#supabasePassword").value);
      persist("Conta Supabase criada.");
      await updateSupabaseStatus(user);
    }catch(err){ toast(err.message); }
  });

  $("#supabaseLogin")?.addEventListener("click", async () => {
    try{
      saveSupabaseFields();
      const user = await supabaseSignIn(state, $("#supabaseEmail").value.trim(), $("#supabasePassword").value);
      persist("Login Supabase realizado.");
      await updateSupabaseStatus(user);
    }catch(err){ toast(err.message); }
  });

  $("#supabaseLogout")?.addEventListener("click", async () => {
    try{ await supabaseSignOut(state); toast("Você saiu do Supabase."); await updateSupabaseStatus(null); }
    catch(err){ toast(err.message); }
  });

  $("#supabasePush")?.addEventListener("click", async () => {
    try{ saveSupabaseFields(); await supabasePush(state); persist("Dados enviados para o Supabase."); await updateSupabaseStatus(); }
    catch(err){ toast(err.message); }
  });

  $("#supabasePull")?.addEventListener("click", async () => {
    try{
      saveSupabaseFields();
      const keep = {...state.settings};
      const cloud = await supabasePull(state);
      state = {...state, ...cloud.state, settings:{...(cloud.state.settings || {}), ...keep}};
      persist("Dados baixados do Supabase.");
      render();
    }catch(err){ toast(err.message); }
  });

  updateSupabaseStatus();
}

$("#tabLogin").onclick = () => {
  $("#tabLogin").classList.add("active"); $("#tabRegister").classList.remove("active");
  $("#loginForm").classList.remove("hidden"); $("#registerForm").classList.add("hidden");
};
$("#tabRegister").onclick = () => {
  $("#tabRegister").classList.add("active"); $("#tabLogin").classList.remove("active");
  $("#registerForm").classList.remove("hidden"); $("#loginForm").classList.add("hidden");
};

$("#loginForm").addEventListener("submit", async e => {
  e.preventDefault();
  try{
    session = await login({user:$("#loginUser").value, password:$("#loginPass").value});
    state = loadState(session.id);
    await enterAfterAuth();
    toast("Login realizado.");
  }catch(err){ toast(err.message); }
});

$("#registerForm").addEventListener("submit", async e => {
  e.preventDefault();
  try{
    session = await register({name:$("#regName").value, user:$("#regName").value, password:$("#regPass").value, password2:$("#regPass2").value});
    state = loadState(session.id);
    await enterAfterAuth();
    toast(session.role === "admin" ? "Conta ADM criada." : "Conta criada.");
  }catch(err){ toast(err.message); }
});



const forgotPassButton = $("#forgotPassBtn");
if(forgotPassButton){
  forgotPassButton.onclick = () => {
    alert("Para trocar sua senha, entre em contato com o Vitor. A troca será feita pela conta ADM.");
  };
}

const openAppButton = $("#openAppBtn");
if(openAppButton) openAppButton.onclick = showApp;
const logoutButton = $("#logoutBtn");
if(logoutButton) logoutButton.onclick = doLogout;

if("serviceWorker" in navigator){
  navigator.serviceWorker.register("./service-worker.js?v=grupo-pro-1").catch(()=>{});
}

async function boot(){
  try{
    await initializePresetUsers();
  }catch(err){
    console.error("Erro ao inicializar usuários padrão:", err);
    toast("Erro ao preparar login. Atualize a página.");
  }

  session = getSession();
  state = session ? loadState(session.id) : null;

  if(session && state) await enterAfterAuth();
  else showLogin();

  renderStrips();
}

boot();
