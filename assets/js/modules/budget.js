import { formatCurrency, escapeHTML } from "../core/dom.js";

const categories = ["Hospedagem","Transporte","Alimentação","Passeios","Compras","Emergência","Outros"];

export function renderBudget(state){
  const total = state.expenses.reduce((sum,e)=>sum + Number(e.amount || 0),0);
  const byCategory = categories.map(cat => ({
    cat,
    total: state.expenses.filter(e=>e.category===cat).reduce((sum,e)=>sum + Number(e.amount || 0),0)
  })).filter(i => i.total > 0);

  return `
    <div class="grid cols-3">
      <article class="card stat"><span>Total gasto</span><strong>${formatCurrency(total, state.profile.baseCurrency)}</strong></article>
      <article class="card stat"><span>Lançamentos</span><strong>${state.expenses.length}</strong></article>
      <article class="card stat"><span>Maior categoria</span><strong>${escapeHTML(byCategory.sort((a,b)=>b.total-a.total)[0]?.cat || "-")}</strong></article>
    </div>

    <div class="card" style="margin-top:18px">
      <h2>Novo gasto</h2>
      <form id="expenseForm" class="form-grid">
        <div class="field"><label>Descrição</label><input id="expenseDescription" required placeholder="Ex.: Hostel em Roma"></div>
        <div class="field"><label>Categoria</label><select id="expenseCategory">${categories.map(c=>`<option>${c}</option>`).join("")}</select></div>
        <div class="field"><label>Valor</label><input id="expenseAmount" required type="number" min="0" step="0.01"></div>
        <div class="field"><label>Data</label><input id="expenseDate" type="date"></div>
        <button class="primary-btn" type="submit">Adicionar gasto</button>
      </form>
    </div>

    <div class="grid cols-2" style="margin-top:18px">
      <div class="card">
        <h2>Gastos por categoria</h2>
        ${byCategory.map(item => `
          <p><strong>${escapeHTML(item.cat)}</strong> <span class="badge">${formatCurrency(item.total, state.profile.baseCurrency)}</span></p>
        `).join("") || `<p class="note">Nenhum gasto lançado.</p>`}
      </div>

      <div class="card">
        <h2>Lançamentos</h2>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Data</th><th>Descrição</th><th>Categoria</th><th>Valor</th><th></th></tr></thead>
            <tbody>
              ${state.expenses.map(e=>`
                <tr>
                  <td>${e.date || "-"}</td>
                  <td>${escapeHTML(e.description)}</td>
                  <td>${escapeHTML(e.category)}</td>
                  <td>${formatCurrency(e.amount, state.profile.baseCurrency)}</td>
                  <td><button class="danger-btn" data-delete-expense="${e.id}">Excluir</button></td>
                </tr>
              `).join("") || `<tr><td colspan="5">Nenhum lançamento.</td></tr>`}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}
