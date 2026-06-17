import { DB } from "./core/data.js";
import { register, login, logout, getSession, demoSession, loadState, saveState } from "./core/store.js";
import { $, $$, toast, saved, uid } from "./core/ui.js";
import { routeStrip, roteiro, montador, mapa, ia, paises, trens, orcamento, dicas, checklist, mochila, moedas, frases, diario, online, cityChips } from "./modules/render.js";
import { generateAI } from "./modules/ai.js";

let session = getSession();
let state = session ? loadState(session.id) : null;
let section = "roteiro";

const views = { roteiro, montador, mapa, ia, paises, trens, orcamento, dicas, checklist, mochila, moedas, frases, diario, online };

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

function render(){
  renderStrips();
  const view = views[section] || roteiro;
  $("#view").className = section === "mapa" ? "section full-map active" : "section active";
  $("#view").innerHTML = view(state);
  $$(".nav-btn").forEach(b => b.classList.toggle("active", b.dataset.section === section));
  bind();
}

function bind(){
  $$("[data-section]").forEach(btn => btn.onclick = () => { section = btn.dataset.section; render(); });

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

  $$("[data-city-chip]").forEach(chip => chip.onclick = () => {
    const id = chip.dataset.cityChip;
    if(state.route.includes(id)){
      state.route = state.route.filter(x => x !== id);
    }else{
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

  $("[data-go-ai]")?.addEventListener("click", () => { section = "ia"; render(); });

  $$("[data-map-city]").forEach(point => {
    point.onclick = () => {
      const id = point.dataset.mapCity;
      const c = DB[id];
      const tip = $("#mapTooltip");
      tip.innerHTML = `
        <div class="tooltip-name">${c.flag} ${c.name}</div>
        <div class="tooltip-meta">${c.country} · ${c.vibe}</div>
        <div class="tooltip-desc">${c.desc}</div>
        <button class="primary-btn full" data-map-toggle="${id}">${state.route.includes(id) ? "Remover do roteiro" : "Adicionar ao roteiro"}</button>
      `;
      tip.style.left = Math.min(75, c.x + 2) + "%";
      tip.style.top = Math.max(8, c.y - 12) + "%";
      tip.classList.add("show");
      tip.querySelector("[data-map-toggle]").onclick = () => {
        if(state.route.includes(id)) state.route = state.route.filter(x => x !== id);
        else state.route.push(id);
        persist("Mapa atualizado.");
        render();
      };
    };
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
      content.innerHTML = `<div class="ai-card"><h4>Erro na IA online</h4><p class="muted">${err.message}</p><p class="muted">Confira o endpoint em Online & IA ou use sem endpoint para fallback local.</p></div>`;
      toast("Erro na IA online.");
    }finally{
      btn.disabled = false;
    }
  });

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
  $("#curAmount")?.addEventListener("input", e => updateCurrency());
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

  $("#saveAiEndpoint")?.addEventListener("click", () => {
    state.settings.aiEndpoint = $("#aiEndpoint").value.trim();
    state.settings.syncEndpoint = $("#syncEndpoint")?.value.trim() || state.settings.syncEndpoint;
    persist("Configuração online salva.");
    render();
  });

  $("#pushSync")?.addEventListener("click", pushSync);
  $("#pullSync")?.addEventListener("click", pullSync);
}

function updateCurrency(){
  const amount = Number($("#curAmount")?.value || 100);
  const result = $("#currencyResult");
  if(!result) return;
  const from = state.settings.currencyFrom || "EUR";
  const to = state.settings.currencyTo || "BRL";
  const rates = { EUR:1, BRL:5.9, USD:1.08, GBP:.86, CHF:.95, CZK:25.1, DKK:7.46, HUF:390 };
  const value = amount * ((rates[to] || 1) / (rates[from] || 1));
  result.textContent = `${value.toFixed(2)} ${to}`;
}

async function pushSync(){
  const endpoint = $("#syncEndpoint").value.trim();
  state.settings.syncEndpoint = endpoint;
  if(!endpoint) return toast("Informe um endpoint de sincronização.");
  const res = await fetch(endpoint, {method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({user:session.id,state})});
  if(!res.ok) return toast("Erro ao enviar para nuvem.");
  persist("Dados enviados para nuvem.");
}

async function pullSync(){
  const endpoint = $("#syncEndpoint").value.trim();
  state.settings.syncEndpoint = endpoint;
  if(!endpoint) return toast("Informe um endpoint de sincronização.");
  const res = await fetch(`${endpoint}?user=${encodeURIComponent(session.id)}`);
  if(!res.ok) return toast("Erro ao baixar da nuvem.");
  const data = await res.json();
  if(data.state){
    state = data.state;
    persist("Dados baixados da nuvem.");
    render();
  }else toast("Endpoint não retornou state.");
}

$("#tabLogin").onclick = () => {
  $("#tabLogin").classList.add("active"); $("#tabRegister").classList.remove("active");
  $("#loginForm").classList.remove("hidden"); $("#registerForm").classList.add("hidden");
};
$("#tabRegister").onclick = () => {
  $("#tabRegister").classList.add("active"); $("#tabLogin").classList.remove("active");
  $("#registerForm").classList.remove("hidden"); $("#loginForm").classList.add("hidden");
};

$("#loginForm").addEventListener("submit", e => {
  e.preventDefault();
  try{
    session = login({user:$("#loginUser").value, password:$("#loginPass").value});
    state = loadState(session.id);
    showHero();
    toast("Login realizado.");
  }catch(err){ toast(err.message); }
});

$("#registerForm").addEventListener("submit", e => {
  e.preventDefault();
  try{
    session = register({name:$("#regName").value, user:$("#regUser").value, password:$("#regPass").value});
    state = loadState(session.id);
    showHero();
    toast("Conta criada.");
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
  navigator.serviceWorker.register("./service-worker.js?v=online-ia-1").catch(()=>{});
}

if(session && state) showHero();
else showLogin();

renderStrips();
