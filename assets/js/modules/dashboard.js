import { formatCurrency, daysBetween, escapeHTML } from "../core/dom.js";

export function renderDashboard(state){
  const countries = new Set(state.cities.map(c => c.country).filter(Boolean));
  const totalBudget = state.expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const done = state.checklist.filter(i => i.done).length;
  const pending = state.checklist.length - done;
  const tripDays = daysBetween(state.profile.startDate, state.profile.endDate);
  const idealBudget = tripDays * Number(state.profile.dailyBudget || 0);

  return `
    <div class="grid cols-4">
      <article class="card stat"><span>Cidades</span><strong>${state.cities.length}</strong></article>
      <article class="card stat"><span>Países</span><strong>${countries.size}</strong></article>
      <article class="card stat"><span>Gastos</span><strong>${formatCurrency(totalBudget, state.profile.baseCurrency)}</strong></article>
      <article class="card stat"><span>Checklist pendente</span><strong>${pending}</strong></article>
    </div>

    <div class="grid cols-2" style="margin-top:18px">
      <article class="card">
        <h2>Resumo da viagem</h2>
        <p class="note">
          <strong>${escapeHTML(state.profile.tripName || "Mochilão Europa")}</strong><br>
          Viajante: ${escapeHTML(state.profile.traveler || "não informado")}<br>
          Período: ${state.profile.startDate || "-"} até ${state.profile.endDate || "-"}<br>
          Duração estimada: ${tripDays || 0} dia(s)<br>
          Orçamento ideal: ${formatCurrency(idealBudget, state.profile.baseCurrency)}
        </p>
      </article>

      <article class="card">
        <h2>Próximas cidades</h2>
        <div class="timeline">
          ${state.cities.slice(0,5).map((city,index)=>`
            <div class="timeline-item">
              <strong>${index+1}. ${escapeHTML(city.name)}</strong>
              <p class="note">${escapeHTML(city.country || "")} • ${city.startDate || "-"} até ${city.endDate || "-"}</p>
            </div>
          `).join("") || `<p class="note">Adicione cidades no roteiro para montar sua viagem.</p>`}
        </div>
      </article>
    </div>

    <div class="card" style="margin-top:18px">
      <h2>Status do checklist</h2>
      <p class="note">${done} concluído(s), ${pending} pendente(s).</p>
      <progress value="${done}" max="${Math.max(state.checklist.length,1)}" style="width:100%;height:18px"></progress>
    </div>
  `;
}
