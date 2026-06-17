export const STORAGE_KEY = "mochilaoEuropa.v1";

export const defaultState = {
  profile: {
    tripName: "Mochilão Europa",
    traveler: "",
    startDate: "",
    endDate: "",
    baseCurrency: "EUR",
    dailyBudget: 70
  },
  cities: [],
  expenses: [],
  checklist: [
    { id: crypto.randomUUID(), text: "Passaporte válido", category: "Documentos", done: false },
    { id: crypto.randomUUID(), text: "Seguro viagem", category: "Documentos", done: false },
    { id: crypto.randomUUID(), text: "Reservas de hospedagem", category: "Reservas", done: false },
    { id: crypto.randomUUID(), text: "Passagens e deslocamentos", category: "Transporte", done: false },
    { id: crypto.randomUUID(), text: "Cartão internacional / Wise", category: "Dinheiro", done: false }
  ],
  diary: []
};

export function loadState(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return structuredClone(defaultState);
    return { ...structuredClone(defaultState), ...JSON.parse(raw) };
  }catch(error){
    console.error(error);
    return structuredClone(defaultState);
  }
}

export function saveState(state){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function resetState(){
  localStorage.removeItem(STORAGE_KEY);
}

export function exportBackup(state){
  const blob = new Blob([JSON.stringify(state,null,2)], {type:"application/json"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "mochilao-europa-backup.json";
  a.click();
  URL.revokeObjectURL(url);
}
