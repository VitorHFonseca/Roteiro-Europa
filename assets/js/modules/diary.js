import { escapeHTML } from "../core/dom.js";

export function renderDiary(state){
  return `
    <div class="card">
      <h2>Nova entrada no diário</h2>
      <form id="diaryForm" class="form-grid two">
        <div class="field"><label>Data</label><input id="diaryDate" type="date"></div>
        <div class="field"><label>Humor</label><select id="diaryMood"><option>😍 Incrível</option><option>🙂 Bom</option><option>😐 Normal</option><option>😴 Cansativo</option><option>🤯 Caótico</option></select></div>
        <div class="field" style="grid-column:1/-1"><label>Título</label><input id="diaryTitle" required placeholder="Ex.: Primeiro dia em Paris"></div>
        <div class="field" style="grid-column:1/-1"><label>Texto</label><textarea id="diaryText" required placeholder="O que aconteceu hoje?"></textarea></div>
        <button class="primary-btn" type="submit">Salvar no diário</button>
      </form>
    </div>

    <div class="card" style="margin-top:18px">
      <h2>Entradas</h2>
      <div class="timeline">
        ${state.diary.map(entry=>`
          <article class="timeline-item">
            <div class="row-actions" style="justify-content:space-between">
              <div>
                <strong>${escapeHTML(entry.title)}</strong>
                <p class="note">${entry.date || "-"} • ${escapeHTML(entry.mood || "")}</p>
              </div>
              <button class="danger-btn" data-delete-diary="${entry.id}">Excluir</button>
            </div>
            <p>${escapeHTML(entry.text)}</p>
          </article>
        `).join("") || `<p class="note">Nenhuma entrada no diário.</p>`}
      </div>
    </div>
  `;
}
