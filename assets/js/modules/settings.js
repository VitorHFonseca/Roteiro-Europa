import { exportBackup } from "../core/storage.js";
import { escapeHTML } from "../core/dom.js";

export function renderSettings(state){
  return `
    <div class="grid cols-2">
      <div class="card">
        <h2>Dados da viagem</h2>
        <form id="profileForm" class="form-grid two">
          <div class="field"><label>Nome da viagem</label><input id="tripName" value="${escapeHTML(state.profile.tripName)}"></div>
          <div class="field"><label>Viajante</label><input id="traveler" value="${escapeHTML(state.profile.traveler)}"></div>
          <div class="field"><label>Início</label><input id="tripStart" type="date" value="${state.profile.startDate || ""}"></div>
          <div class="field"><label>Fim</label><input id="tripEnd" type="date" value="${state.profile.endDate || ""}"></div>
          <div class="field"><label>Moeda</label><select id="baseCurrency"><option>EUR</option><option>BRL</option><option>USD</option><option>GBP</option></select></div>
          <div class="field"><label>Orçamento diário</label><input id="dailyBudget" type="number" value="${state.profile.dailyBudget || 70}"></div>
          <button class="primary-btn" type="submit">Salvar configurações</button>
        </form>
      </div>

      <div class="card">
        <h2>Backup e dados</h2>
        <p class="note">O app funciona offline e salva tudo no LocalStorage deste navegador.</p>
        <div class="row-actions">
          <button id="backupBtn" class="secondary-btn">Baixar backup JSON</button>
          <button id="importBtn" class="secondary-btn">Importar backup</button>
          <input id="importFile" type="file" accept="application/json" class="hidden">
          <button id="resetBtn" class="danger-btn">Apagar tudo</button>
        </div>
      </div>
    </div>
  `;
}

export function attachSettingsEvents(state, saveAndRender){
  const currency = document.getElementById("baseCurrency");
  if(currency) currency.value = state.profile.baseCurrency || "EUR";

  document.getElementById("backupBtn")?.addEventListener("click", () => exportBackup(state));
  document.getElementById("importBtn")?.addEventListener("click", () => document.getElementById("importFile").click());
  document.getElementById("importFile")?.addEventListener("change", async event => {
    const file = event.target.files[0];
    if(!file) return;
    const imported = JSON.parse(await file.text());
    Object.assign(state, imported);
    saveAndRender("Backup importado.");
  });
}
