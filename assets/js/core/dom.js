export const $ = (selector, scope=document) => scope.querySelector(selector);
export const $$ = (selector, scope=document) => [...scope.querySelectorAll(selector)];

export function toast(message){
  const el = $("#toast");
  el.textContent = message;
  el.classList.add("show");
  window.clearTimeout(window.__toastTimer);
  window.__toastTimer = window.setTimeout(() => el.classList.remove("show"), 2400);
}

export function formatCurrency(value, currency="EUR"){
  return new Intl.NumberFormat("pt-BR", { style:"currency", currency }).format(Number(value || 0));
}

export function formatDate(date){
  if(!date) return "-";
  return new Intl.DateTimeFormat("pt-BR", { timeZone:"UTC" }).format(new Date(date + "T00:00:00Z"));
}

export function daysBetween(a,b){
  if(!a || !b) return 0;
  const start = new Date(a + "T00:00:00Z");
  const end = new Date(b + "T00:00:00Z");
  return Math.max(1, Math.round((end-start)/(1000*60*60*24))+1);
}

export function escapeHTML(value){
  return String(value ?? "")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}
