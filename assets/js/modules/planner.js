import { EUROPE_CITIES } from "../core/europe-cities.js";
import { escapeHTML } from "../core/dom.js";

export function renderPlanner(state){
  const options = EUROPE_CITIES.map(c => `<option value="${escapeHTML(c.name)}">${escapeHTML(c.name)} - ${escapeHTML(c.country)}</option>`).join("");

  return `
    <div class="card">
      <h2>Adicionar cidade ao roteiro</h2>
      <form id="cityForm" class="form-grid">
        <div class="field">
          <label>Cidade</label>
          <input id="cityName" list="cityOptions" placeholder="Ex.: Paris" required>
          <datalist id="cityOptions">${options}</datalist>
        </div>
        <div class="field">
          <label>País</label>
          <input id="cityCountry" placeholder="Ex.: França">
        </div>
        <div class="field">
          <label>Chegada</label>
          <input id="cityStart" type="date">
        </div>
        <div class="field">
          <label>Saída</label>
          <input id="cityEnd" type="date">
        </div>
        <div class="field" style="grid-column:1/-1">
          <label>Notas</label>
          <textarea id="cityNotes" placeholder="Hospedagem, atrações, transporte, lembretes..."></textarea>
        </div>
        <button class="primary-btn" type="submit">Adicionar ao roteiro</button>
      </form>
    </div>

    <div class="card" style="margin-top:18px">
      <h2>Roteiro</h2>
      <div class="table-wrap">
        <table>
          <thead><tr><th>#</th><th>Cidade</th><th>Período</th><th>Notas</th><th>Ações</th></tr></thead>
          <tbody>
            ${state.cities.map((city,index)=>`
              <tr>
                <td>${index+1}</td>
                <td><strong>${escapeHTML(city.name)}</strong><br><span class="note">${escapeHTML(city.country || "")}</span></td>
                <td>${city.startDate || "-"}<br>${city.endDate || "-"}</td>
                <td>${escapeHTML(city.notes || "")}</td>
                <td class="row-actions">
                  <button class="ghost-btn" data-move-city="${city.id}" data-dir="-1">↑</button>
                  <button class="ghost-btn" data-move-city="${city.id}" data-dir="1">↓</button>
                  <button class="danger-btn" data-delete-city="${city.id}">Excluir</button>
                </td>
              </tr>
            `).join("") || `<tr><td colspan="5">Nenhuma cidade adicionada ainda.</td></tr>`}
          </tbody>
        </table>
      </div>
    </div>
  `;
}
