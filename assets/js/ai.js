import { DB } from "./data.js";

function localSuggestions(state, mode, question=""){
  const route = state.route.map(id => DB[id]).filter(Boolean);
  const cards = [];

  if(mode === "veiculos"){
    cards.push({title:"🚗 Opções de veículos", items:[
      "Para trechos curtos, compare trem, ônibus e carro compartilhado.",
      "Para trechos longos, considere avião, trem noturno ou uma cidade intermediária.",
      "Dentro das cidades, use metrô + caminhada; bike funciona bem em Amsterdã e Copenhague."
    ]});
  }else if(mode === "economia"){
    cards.push({title:"💶 Plano para economizar", items:[
      "Controle hospedagem em cidades caras e compense com Praga/Budapeste quando possível.",
      "Use mercado no jantar e almoço executivo quando houver.",
      "Crie duas opções de veículo por trecho: rápida e econômica."
    ]});
  }else{
    cards.push({title:"✨ Dicas do dia", items:[
      "Tenha uma atração principal, uma caminhada livre e uma opção coberta para chuva.",
      "Deixe o primeiro dia de cada cidade mais leve para check-in e adaptação.",
      "Edite as sugestões no roteiro para virar seu plano real."
    ]});
  }

  route.slice(0,6).forEach(c => cards.push({
    title:`${c.flag} ${c.name}`,
    items:[
      `Foco: ${c.vibe}.`,
      `Custo: ${c.cpd <= 75 ? "bom custo-benefício" : c.cpd >= 110 ? "cidade cara, planeje bem" : "custo médio"}.`,
      `Sugestão: ${c.sugDays} dia(s), com uma opção de chuva.`
    ]
  }));

  if(question){
    cards.unshift({ title:"Pedido personalizado", items:[`Você pediu: ${question}`, "Sem endpoint online, a resposta foi gerada pelo fallback local."] });
  }

  return {title:"Sugestões inteligentes", cards, source:"fallback local"};
}

export async function generateAI(state, mode, question=""){
  const endpoint = state.settings.aiEndpoint?.trim();
  if(!endpoint) return localSuggestions(state, mode, question);

  const route = state.route.map(id => {
    const c = DB[id];
    return { name:c.name, country:c.country, days:state.cityDays[id] || c.sugDays, costPerDay:c.cpd, vibe:c.vibe };
  });

  const res = await fetch(endpoint, {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({mode, question, route, vehicles:state.vehicles, language:"pt-BR"})
  });

  if(!res.ok) throw new Error(`Endpoint IA retornou erro ${res.status}.`);
  const data = await res.json();
  if(data.cards) return {title:data.title || "Sugestões da IA", cards:data.cards, source:"IA online"};
  if(data.answer) return {title:"Resposta da IA", text:data.answer, source:"IA online"};
  return {title:"Resposta da IA", text:JSON.stringify(data,null,2), source:"IA online"};
}
