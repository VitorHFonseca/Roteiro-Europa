import { escapeHTML } from "../core/dom.js";

const categories = ["Documentos","Reservas","Transporte","Mochila","Dinheiro","Saúde","Tecnologia","Outros"];

export function renderChecklist(state){
  const done = state.checklist.filter(i=>i.done).length;
  return `
    <div class="card">
      <h2>Checklist do mochilão</h2>
      <p class="note">${done} de ${state.checklist.length} item(ns) concluído(s).</p>
      <form id="checklistForm" class="form-grid three">
        <div class="field"><label>Item</label><input id="checkText" required placeholder="Ex.: Adaptador universal"></div>
        <div class="field"><label>Categoria</label><select id="checkCategory">${categories.map(c=>`<option>${c}</option>`).join("")}</select></div>
        <div class="field"><label>&nbsp;</label><button class="primary-btn" type="submit">Adicionar</button></div>
      </form>
    </div>

    <div class="card" style="margin-top:18px">
      <ul class="list">
        ${state.checklist.map(item=>`
          <li class="list-item ${item.done ? "done" : ""}">
            <div>
              <label>
                <input type="checkbox" data-toggle-check="${item.id}" ${item.done ? "checked" : ""} style="width:auto;margin-right:8px">
                <strong>${escapeHTML(item.text)}</strong>
              </label>
              <p class="note">${escapeHTML(item.category)}</p>
            </div>
            <button class="danger-btn" data-delete-check="${item.id}">Excluir</button>
          </li>
        `).join("") || `<li class="note">Nenhum item.</li>`}
      </ul>
    </div>
  `;
}
