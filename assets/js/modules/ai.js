import { DB } from "../core/data.js";

function localSuggestions(state, mode, question=""){
  const route = state.route.map(id => DB[id]).filter(Boolean);
  const cards = [];

  if(mode === "economia"){
    cards.push({
      title:"💶 Plano para economizar",
      items:[
        "Troque 1 cidade cara por uma cidade de melhor custo-benefício, como Praga ou Budapeste.",
        "Use mercado no jantar em cidades caras como Zurique, Londres, Copenhague e Paris.",
        "Reserve hospedagem perto de estação central quando o roteiro tiver muitos trens."
      ]
    });
  } else if(mode === "otimizar"){
    cards.push({
      title:"🚆 Otimização de rota",
      items:[
        "Agrupe cidades por eixo: Península Ibérica → França/Benelux → Alemanha/Centro Europeu → Itália.",
        "Evite saltos muito longos entre extremos no mesmo dia; use uma cidade de conexão.",
        "Considere trem noturno apenas quando economizar hospedagem e não destruir o dia seguinte."
      ]
    });
  } else {
    cards.push({
      title:"🍂 Outubro na Europa",
      items:[
        "Leve camadas: manhã/noite frias e tardes amenas em várias cidades.",
        "Priorize museus e cafés em dias de chuva; outubro costuma alternar céu bonito e tempo instável.",
        "Chegue cedo nas atrações famosas: menos fila e luz melhor para fotos."
      ]
    });
  }

  route.slice(0,6).forEach(c => cards.push({
    title:`${c.flag} ${c.name}`,
    items:[
      `Foco da cidade: ${c.vibe}.`,
      `Estimativa econômica: ${c.cpd <= 75 ? "ótimo custo-benefício" : c.cpd >= 110 ? "cidade cara, controle hospedagem e alimentação" : "custo médio, dá para equilibrar"}.`,
      `Dica prática: reserve ${c.sugDays} dia(s) e deixe uma margem para deslocamento.`
    ]
  }));

  if(question){
    cards.unshift({ title:"Pedido personalizado", items:[`Você pediu: ${question}`, "Sem endpoint online, gerei uma resposta local baseada no roteiro."] });
  }

  return {
    title:"Sugestões inteligentes",
    cards,
    source:"fallback local — configure um endpoint para IA online real"
  };
}

export async function generateAI(state, mode, question=""){
  const endpoint = state.settings.aiEndpoint?.trim();

  if(!endpoint){
    return localSuggestions(state, mode, question);
  }

  const route = state.route.map(id => {
    const c = DB[id];
    return {
      name:c.name,
      country:c.country,
      days:state.cityDays[id] || c.sugDays,
      costPerDay:c.cpd,
      vibe:c.vibe
    };
  });

  const payload = {
    mode,
    question,
    route,
    preferences:{
      month:"outubro",
      style:"mochilão de trem",
      budget:"econômico a médio",
      language:"pt-BR"
    }
  };

  const res = await fetch(endpoint, {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify(payload)
  });

  if(!res.ok){
    throw new Error(`Endpoint IA retornou erro ${res.status}.`);
  }

  const data = await res.json();
  if(data.cards) return {title:data.title || "Sugestões da IA", cards:data.cards, source:"IA online"};
  if(data.answer) return {title:"Resposta da IA", text:data.answer, source:"IA online"};
  return {title:"Resposta da IA", text:JSON.stringify(data,null,2), source:"IA online"};
}
