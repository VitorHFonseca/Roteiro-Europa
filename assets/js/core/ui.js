export const $ = selector => document.querySelector(selector);
export const $$ = selector => [...document.querySelectorAll(selector)];

export function esc(value){
  return String(value ?? "").replace(/[&<>"']/g, m => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;"
  }[m]));
}

export function toast(message){
  const el = $("#toast");
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(window.__toast);
  window.__toast = setTimeout(() => el.classList.remove("show"), 2500);
}

export function saved(){
  const el = $("#saveIndicator");
  el.classList.add("show");
  clearTimeout(window.__saved);
  window.__saved = setTimeout(() => el.classList.remove("show"), 1200);
}

export function euro(value){
  return "€" + Math.round(Number(value || 0)).toLocaleString("pt-BR");
}

export function uid(){
  return crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random());
}
