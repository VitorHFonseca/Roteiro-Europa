import { DB, RATES } from "./data.js";
import { register, login, logout, getSession, demoSession, loadState, saveState, adminListUsers, adminCreateUser, adminSetUserStatus, adminSetUserRole, adminResetPassword } from "./store.js";
import { $, $$, toast, saved, uid, euro } from "./ui.js";
import { routeStrip, roteiro, montador, mapa, ia, paises, veiculos, hospedagens, orcamento, dicas, checklist, mochila, moedas, frases, diario, online, admin, cityChips, generatedSuggestions, daysFromRoute } from "./render.js";
import { generateAI } from "./ai.js";
import { isSupabaseConfigured, supabaseCurrentUser, supabaseSignUp, supabaseSignIn, supabaseSignOut, supabasePush, supabasePull } from "./supabaseSync.js";

let session = getSession();
let state = session ? loadState(session.id) : null;
let section = "roteiro";

const views = { roteiro, montador, mapa, ia, paises, veiculos, hospedagens, orcamento, dicas, checklist, mochila, moedas, frases, diario, online, admin };

function persist(message){
  saveState(session.id, state);
  saved();
  if(message) toast(message);
}

function showLogin(){
  $("#loginScreen").classList.remove("hidden");
  $("#hero").classList.add("hidden");
  $("#app").classList.add("hidden");
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

function renderStrips(){
  const html = routeStrip(state?.route || []);
  $("#heroRouteStrip").innerHTML = html;
  $("#loginRouteStrip").innerHTML = html || routeStrip(["lisboa","barcelona","paris","berlim","veneza"]);
}

function isAdmin(){ return session?.role === "admin"; }

function render(){
  renderStrips();

  $$(".admin-only").forEach(el => el.classList.toggle("hidden", !isAdmin()));

  if(isAdmin() && section !== "admin" && section !== "online"){
    const view = views[section] || roteiro;
    $("#view").className = section === "mapa" ? "section full-map active readonly-cover" : "section active readonly-cover";
    $("#view").innerHTML = `<div class="lock-banner">🛡️ Modo ADM: visualização liberada, edição de viagem bloqueada. Use a aba Admin para gerenciar usuários.</div>` + view(state);
  }else if(section === "admin"){
    $("#view").className = "section active";
    $("#view").innerHTML = admin(state, adminListUsers(session), session);
  }else{
    const view = views[section] || roteiro;
    $("#view").className = section === "mapa" ? "section full-map active" : "section active";
    $("#view").innerHTML = view(state);
  }

  $$(".nav-btn").forEach(b => b.classList.toggle("active", b.dataset.section === section));
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

function suggestVehicleForSegment(seg){
  const long = ["Lisboa","Atenas","Copenhague"].includes(seg.from) || ["Lisboa","Atenas","Copenhague"].includes(seg.to);
  return {
    id:uid(),
    type: long ? "aviao" : "trem",
    from:seg.from,
    to:seg.to,
    duration: long ? "2h-4h" : "2h-7h",
    cost: long ? "€60-160" : "€25-120",
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
  if(window.__mochilaoMap){ window.__mochilaoMap.remove(); window.__mochilaoMap = null; }
  const map = L.map(el, { scrollWheelZoom:true }).setView([50, 9], 4);
  window.__mochilaoMap = map;
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {maxZoom:19, attribution:"© OpenStreetMap"}).addTo(map);
  const routeLatLngs = [];
  const markers = [];
  Object.entries(DB).forEach(([id,c]) => {
    if(typeof c.lat !== "number" || typeof c.lng !== "number") return;
    const inRoute = state.route.includes(id);
    const marker = L.marker([c.lat,c.lng]).addTo(map);
    markers.push(marker);
    if(inRoute) routeLatLngs.push([c.lat,c.lng]);
    marker.bindPopup(`
      <img class="map-popup-img" src="${c.image}" alt="${c.name}">
      <div class="map-popup-title">${c.flag} ${c.name}</div>
      <div class="map-popup-meta">${c.country} · ${c.vibe}</div>
      <button class="map-popup-btn" data-popup-toggle="${id}">${inRoute ? "Remover do roteiro" : "Adicionar ao roteiro"}</button>
    `);
    marker.on("popupopen", () => {
      setTimeout(() => {
        document.querySelector(`[data-popup-toggle="${id}"]`)?.addEventListener("click", () => {
          if(state.route.includes(id)) state.route = state.route.filter(x => x !== id);
          else { state.route.push(id); state.cityDays[id] ||= c.sugDays || 2; }
          persist("Roteiro atualizado pelo mapa.");
          render();
        });
      }, 20);
    });
  });
  if(routeLatLngs.length > 1){
    const line = L.polyline(routeLatLngs, {weight:4}).addTo(map);
    map.fitBounds(line.getBounds(), {padding:[35,35]});
  }else if(routeLatLngs.length === 1){
    map.setView(routeLatLngs[0], 8);
  }else if(markers.length){
    map.fitBounds(L.featureGroup(markers).getBounds(), {padding:[35,35]});
  }
  $("#fitMapRoute")?.addEventListener("click", () => {
    if(routeLatLngs.length > 1) map.fitBounds(L.polyline(routeLatLngs).getBounds(), {padding:[35,35]});
    else if(routeLatLngs.length === 1) map.setView(routeLatLngs[0], 8);
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

  $("#vehicleForm")?.addEventListener("submit", e => {
    e.preventDefault();
    state.vehicles.push({
      id:uid(),
      type:$("#vehType").value,
      from:$("#vehFrom").value,
      to:$("#vehTo").value,
      duration:$("#vehDuration").value,
      cost:$("#vehCost").value,
      provider:$("#vehProvider").value,
      notes:$("#vehNotes").value
    });
    persist("Veículo adicionado.");
    render();
  });

  $$("[data-del-vehicle]").forEach(btn => btn.onclick = () => {
    state.vehicles = state.vehicles.filter(v => v.id !== btn.dataset.delVehicle);
    persist("Veículo removido.");
    render();
  });

  $$("[data-vehicle-field]").forEach(input => input.oninput = () => {
    const [id,field] = input.dataset.vehicleField.split(":");
    const v = state.vehicles.find(x => x.id === id);
    if(v) v[field] = input.value;
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
        user:$("#adminUserId").value,
        password:$("#adminUserPass").value,
        role:$("#adminUserRole").value
      });
      toast("Usuário criado.");
      render();
    }catch(err){ toast(err.message); }
  });

  $$("[data-admin-status]").forEach(btn => btn.onclick = () => {
    try{
      adminSetUserStatus(session, btn.dataset.adminStatus, btn.dataset.status);
      toast("Status atualizado.");
      render();
    }catch(err){ toast(err.message); }
  });

  $$("[data-admin-role]").forEach(btn => btn.onclick = () => {
    try{
      adminSetUserRole(session, btn.dataset.adminRole, btn.dataset.role);
      toast("Perfil atualizado.");
      render();
    }catch(err){ toast(err.message); }
  });

  $$("[data-admin-reset]").forEach(btn => btn.onclick = async () => {
    const pass = prompt("Digite a nova senha temporária:");
    if(!pass) return;
    try{
      await adminResetPassword(session, btn.dataset.adminReset, pass);
      toast("Senha resetada.");
    }catch(err){ toast(err.message); }
  });

  $("#testSupabase")?.addEventListener("click", testSupabaseConnection);
  $("#testAI")?.addEventListener("click", testAIConnection);
  $("#testAllConnections")?.addEventListener("click", testAllConnections);
  $("#adminTestAll")?.addEventListener("click", testAllConnections);

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
  try{
    if(!state.settings.supabaseUrl || !state.settings.supabaseAnonKey) throw new Error("Supabase não configurado.");
    await supabaseCurrentUser(state);
    if(status) status.textContent = "Supabase ativo: SDK conectado. Login pode ser necessário para dados.";
    return {ok:true,text:"Supabase ativo"};
  }catch(err){
    if(status) status.textContent = `Supabase: ${err.message}`;
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
  const ai = await testAIConnection();
  const msg = `Supabase: ${supa.ok ? "ativo" : "falhou"} | IA: ${ai.ok ? "ativa" : "falhou"}`;
  $("#adminConnectionStatus") && ($("#adminConnectionStatus").textContent = msg);
  $("#adminSupabaseCard")?.classList.toggle("ok", supa.ok);
  $("#adminSupabaseCard")?.classList.toggle("bad", !supa.ok);
  $("#adminAiCard")?.classList.toggle("ok", ai.ok);
  $("#adminAiCard")?.classList.toggle("bad", !ai.ok);
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
    showHero();
    toast("Login realizado.");
  }catch(err){ toast(err.message); }
});

$("#registerForm").addEventListener("submit", async e => {
  e.preventDefault();
  try{
    session = await register({name:$("#regName").value, user:$("#regUser").value, password:$("#regPass").value});
    state = loadState(session.id);
    showHero();
    toast(session.role === "admin" ? "Conta ADM criada." : "Conta criada.");
  }catch(err){ toast(err.message); }
});

$("#demoBtn").onclick = () => {
  session = demoSession();
  state = loadState(session.id);
  showHero();
  toast("Demonstração carregada.");
};

$("#openAppBtn").onclick = showApp;
$("#logoutBtn").onclick = () => {
  logout();
  session = null; state = null;
  showLogin();
  toast("Você saiu.");
};

if("serviceWorker" in navigator){
  navigator.serviceWorker.register("./service-worker.js?v=plus-veiculos-1").catch(()=>{});
}

if(session && state) showHero();
else showLogin();
renderStrips();
