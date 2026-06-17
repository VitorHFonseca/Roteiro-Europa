import { loadState, saveState, resetState } from "./core/storage.js";
import { $, $$, toast } from "./core/dom.js";
import { findKnownCity } from "./core/europe-cities.js";
import { renderDashboard } from "./modules/dashboard.js";
import { renderPlanner } from "./modules/planner.js";
import { renderMapView, mountMap } from "./modules/map.js";
import { renderBudget } from "./modules/budget.js";
import { renderChecklist } from "./modules/checklist.js";
import { renderDiary } from "./modules/diary.js";
import { renderSettings, attachSettingsEvents } from "./modules/settings.js";
import { exportPdf } from "./modules/pdf.js";

let state = loadState();
let currentView = "dashboard";

const titles = {
  dashboard: "Dashboard",
  planner: "Roteiro",
  map: "Mapa",
  budget: "Orçamento",
  checklist: "Checklist",
  diary: "Diário",
  settings: "Configurações"
};

function persist(message="Salvo."){
  saveState(state);
  toast(message);
}

function saveAndRender(message="Salvo."){
  persist(message);
  render();
}

function render(){
  $("#pageTitle").textContent = titles[currentView];

  $("#dashboardView").innerHTML = renderDashboard(state);
  $("#plannerView").innerHTML = renderPlanner(state);
  $("#mapView").innerHTML = renderMapView(state);
  $("#budgetView").innerHTML = renderBudget(state);
  $("#checklistView").innerHTML = renderChecklist(state);
  $("#diaryView").innerHTML = renderDiary(state);
  $("#settingsView").innerHTML = renderSettings(state);

  $$(".view").forEach(view => view.classList.remove("active"));
  $(`#${currentView}View`).classList.add("active");

  $$(".nav-link").forEach(btn => btn.classList.toggle("active", btn.dataset.view === currentView));

  attachEvents();

  if(currentView === "map") mountMap(state);
}

function attachEvents(){
  $("#cityForm")?.addEventListener("submit", event => {
    event.preventDefault();
    const name = $("#cityName").value.trim();
    const known = findKnownCity(name);
    const city = {
      id: crypto.randomUUID(),
      name,
      country: $("#cityCountry").value.trim() || known?.country || "",
      startDate: $("#cityStart").value,
      endDate: $("#cityEnd").value,
      notes: $("#cityNotes").value.trim(),
      lat: known?.lat ?? null,
      lng: known?.lng ?? null
    };
    state.cities.push(city);
    saveAndRender("Cidade adicionada ao roteiro.");
  });

  $$("[data-delete-city]").forEach(btn => btn.onclick = () => {
    state.cities = state.cities.filter(c => c.id !== btn.dataset.deleteCity);
    saveAndRender("Cidade removida.");
  });

  $$("[data-move-city]").forEach(btn => btn.onclick = () => {
    const index = state.cities.findIndex(c => c.id === btn.dataset.moveCity);
    const dir = Number(btn.dataset.dir);
    const newIndex = index + dir;
    if(index < 0 || newIndex < 0 || newIndex >= state.cities.length) return;
    const [item] = state.cities.splice(index, 1);
    state.cities.splice(newIndex, 0, item);
    saveAndRender("Roteiro reorganizado.");
  });

  $("#expenseForm")?.addEventListener("submit", event => {
    event.preventDefault();
    state.expenses.push({
      id: crypto.randomUUID(),
      description: $("#expenseDescription").value.trim(),
      category: $("#expenseCategory").value,
      amount: Number($("#expenseAmount").value || 0),
      date: $("#expenseDate").value
    });
    saveAndRender("Gasto adicionado.");
  });

  $$("[data-delete-expense]").forEach(btn => btn.onclick = () => {
    state.expenses = state.expenses.filter(e => e.id !== btn.dataset.deleteExpense);
    saveAndRender("Gasto removido.");
  });

  $("#checklistForm")?.addEventListener("submit", event => {
    event.preventDefault();
    state.checklist.push({
      id: crypto.randomUUID(),
      text: $("#checkText").value.trim(),
      category: $("#checkCategory").value,
      done: false
    });
    saveAndRender("Item adicionado.");
  });

  $$("[data-toggle-check]").forEach(input => input.onchange = () => {
    const item = state.checklist.find(i => i.id === input.dataset.toggleCheck);
    if(item) item.done = input.checked;
    saveAndRender("Checklist atualizado.");
  });

  $$("[data-delete-check]").forEach(btn => btn.onclick = () => {
    state.checklist = state.checklist.filter(i => i.id !== btn.dataset.deleteCheck);
    saveAndRender("Item removido.");
  });

  $("#diaryForm")?.addEventListener("submit", event => {
    event.preventDefault();
    state.diary.unshift({
      id: crypto.randomUUID(),
      date: $("#diaryDate").value,
      mood: $("#diaryMood").value,
      title: $("#diaryTitle").value.trim(),
      text: $("#diaryText").value.trim()
    });
    saveAndRender("Entrada salva no diário.");
  });

  $$("[data-delete-diary]").forEach(btn => btn.onclick = () => {
    state.diary = state.diary.filter(d => d.id !== btn.dataset.deleteDiary);
    saveAndRender("Entrada removida.");
  });

  $("#profileForm")?.addEventListener("submit", event => {
    event.preventDefault();
    state.profile = {
      tripName: $("#tripName").value.trim(),
      traveler: $("#traveler").value.trim(),
      startDate: $("#tripStart").value,
      endDate: $("#tripEnd").value,
      baseCurrency: $("#baseCurrency").value,
      dailyBudget: Number($("#dailyBudget").value || 0)
    };
    saveAndRender("Configurações salvas.");
  });

  $("#resetBtn")?.addEventListener("click", () => {
    if(confirm("Apagar todos os dados deste navegador?")){
      resetState();
      state = loadState();
      saveAndRender("Dados apagados.");
    }
  });

  attachSettingsEvents(state, saveAndRender);
}

$$(".nav-link").forEach(btn => {
  btn.addEventListener("click", () => {
    currentView = btn.dataset.view;
    render();
  });
});

$("#exportPdfBtn").addEventListener("click", () => exportPdf(state));

$("#sampleDataBtn").addEventListener("click", () => {
  state.profile = {
    tripName: "Mochilão Europa 2027",
    traveler: "Vitor",
    startDate: "2027-10-25",
    endDate: "2027-11-12",
    baseCurrency: "EUR",
    dailyBudget: 80
  };
  state.cities = [
    { id: crypto.randomUUID(), name:"Lisboa", country:"Portugal", startDate:"2027-10-25", endDate:"2027-10-28", notes:"Chegada, Alfama, Belém e miradouros.", lat:38.7223, lng:-9.1393 },
    { id: crypto.randomUUID(), name:"Paris", country:"França", startDate:"2027-10-29", endDate:"2027-11-02", notes:"Torre Eiffel, Louvre, Montmartre.", lat:48.8566, lng:2.3522 },
    { id: crypto.randomUUID(), name:"Roma", country:"Itália", startDate:"2027-11-03", endDate:"2027-11-07", notes:"Coliseu, Vaticano, Trastevere.", lat:41.9028, lng:12.4964 },
    { id: crypto.randomUUID(), name:"Barcelona", country:"Espanha", startDate:"2027-11-08", endDate:"2027-11-12", notes:"Sagrada Família, Gótico, praia.", lat:41.3874, lng:2.1686 }
  ];
  state.expenses = [
    { id: crypto.randomUUID(), description:"Hostel Lisboa", category:"Hospedagem", amount:120, date:"2027-10-25" },
    { id: crypto.randomUUID(), description:"Trem/voo interno", category:"Transporte", amount:180, date:"2027-10-28" },
    { id: crypto.randomUUID(), description:"Passeios Paris", category:"Passeios", amount:90, date:"2027-10-30" }
  ];
  state.diary = [
    { id: crypto.randomUUID(), date:"2027-10-25", mood:"😍 Incrível", title:"Começo da aventura", text:"Cheguei na Europa e comecei o mochilão por Lisboa." }
  ];
  saveAndRender("Dados de exemplo carregados.");
});

let deferredPrompt;
window.addEventListener("beforeinstallprompt", event => {
  event.preventDefault();
  deferredPrompt = event;
  $("#installPwaBtn").classList.remove("hidden");
});

$("#installPwaBtn")?.addEventListener("click", async () => {
  if(!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
  $("#installPwaBtn").classList.add("hidden");
});

if("serviceWorker" in navigator){
  navigator.serviceWorker.register("./service-worker.js").catch(console.error);
}

render();
