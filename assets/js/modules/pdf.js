import { formatCurrency } from "../core/dom.js";

export function exportPdf(state){
  if(!window.jspdf?.jsPDF){
    alert("Biblioteca jsPDF não carregou. Conecte-se à internet e tente novamente.");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  let y = 16;

  const line = (text, size=11) => {
    if(y > 280){
      doc.addPage();
      y = 16;
    }
    doc.setFontSize(size);
    doc.text(String(text), 14, y);
    y += size > 13 ? 9 : 7;
  };

  line(state.profile.tripName || "Mochilão Europa", 18);
  line(`Viajante: ${state.profile.traveler || "-"}`);
  line(`Período: ${state.profile.startDate || "-"} até ${state.profile.endDate || "-"}`);
  y += 4;

  line("Roteiro", 15);
  state.cities.forEach((city,index)=>{
    line(`${index+1}. ${city.name} - ${city.country || ""} (${city.startDate || "-"} até ${city.endDate || "-"})`);
    if(city.notes) line(`   Notas: ${city.notes}`);
  });

  y += 4;
  line("Orçamento", 15);
  const total = state.expenses.reduce((sum,e)=>sum + Number(e.amount || 0),0);
  line(`Total: ${formatCurrency(total, state.profile.baseCurrency)}`);
  state.expenses.forEach(e => line(`${e.date || "-"} | ${e.category} | ${e.description} | ${formatCurrency(e.amount, state.profile.baseCurrency)}`));

  y += 4;
  line("Checklist", 15);
  state.checklist.forEach(i => line(`${i.done ? "[x]" : "[ ]"} ${i.category} - ${i.text}`));

  y += 4;
  line("Diário", 15);
  state.diary.forEach(d => {
    line(`${d.date || "-"} | ${d.mood || ""} | ${d.title}`);
    line(d.text);
  });

  doc.save("roteiro-mochilao-europa.pdf");
}
