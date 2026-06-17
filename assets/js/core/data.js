export const DB = {
  lisboa:{name:"Lisboa", country:"Portugal", flag:"🇵🇹", cpd:70, sugDays:3, x:26, y:66, vibe:"miradouros, fado e azulejos", desc:"Chegada perfeita para começar leve, comer bem e se adaptar ao fuso.", tags:["barato","romântico","histórico"]},
  porto:{name:"Porto", country:"Portugal", flag:"🇵🇹", cpd:62, sugDays:2, x:24, y:60, vibe:"vinho, rio Douro e ruelas", desc:"Cidade compacta e charmosa para caminhar, comer barato e ver pôr do sol.", tags:["barato","vinho","walkable"]},
  madrid:{name:"Madrid", country:"Espanha", flag:"🇪🇸", cpd:78, sugDays:3, x:33, y:63, vibe:"museus, tapas e praças", desc:"Base urbana com museus excelentes, vida noturna e bate-voltas fáceis.", tags:["museus","noite","comida"]},
  barcelona:{name:"Barcelona", country:"Espanha", flag:"🇪🇸", cpd:86, sugDays:3, x:39, y:60, vibe:"Gaudí, praia e bairro gótico", desc:"Mistura de arquitetura, mar e vida cultural forte.", tags:["praia","arquitetura","popular"]},
  paris:{name:"Paris", country:"França", flag:"🇫🇷", cpd:110, sugDays:4, x:46, y:45, vibe:"museus, cafés e clássicos", desc:"Clássica, cara, mas perfeita para outubro: menos calor e luz bonita.", tags:["romântico","museus","caro"]},
  londres:{name:"Londres", country:"Reino Unido", flag:"🇬🇧", cpd:125, sugDays:4, x:42, y:35, vibe:"pubs, parques e museus gratuitos", desc:"Metrópole cara, mas com muitos museus e atrações gratuitas.", tags:["museus","caro","metrópole"]},
  amsterdam:{name:"Amsterdã", country:"Holanda", flag:"🇳🇱", cpd:105, sugDays:3, x:51, y:36, vibe:"canais, bicicleta e museus", desc:"Linda no outono, com canais, cafés e deslocamento fácil.", tags:["canais","bike","caro"]},
  bruxelas:{name:"Bruxelas", country:"Bélgica", flag:"🇧🇪", cpd:88, sugDays:2, x:49, y:40, vibe:"chocolate, cerveja e bate-voltas", desc:"Boa conexão entre Paris, Amsterdã e Alemanha.", tags:["conexão","cerveja","chocolate"]},
  zurique:{name:"Zurique", country:"Suíça", flag:"🇨🇭", cpd:145, sugDays:2, x:55, y:53, vibe:"lagos, montanhas e trens", desc:"Cara, mas estratégica para paisagens alpinas e trens cênicos.", tags:["caro","lagos","trem"]},
  milao:{name:"Milão", country:"Itália", flag:"🇮🇹", cpd:96, sugDays:2, x:56, y:58, vibe:"moda, Duomo e conexões", desc:"Entrada eficiente para Itália, com ótimo acesso de trem.", tags:["moda","conexão","duomo"]},
  veneza:{name:"Veneza", country:"Itália", flag:"🇮🇹", cpd:105, sugDays:2, x:61, y:60, vibe:"canais e romance", desc:"Única e fotogênica; outubro costuma ser mais agradável que verão.", tags:["romântico","fotogênico","caro"]},
  roma:{name:"Roma", country:"Itália", flag:"🇮🇹", cpd:92, sugDays:4, x:59, y:70, vibe:"história, massa e ruínas", desc:"Museu a céu aberto, ótima para fechar um roteiro épico.", tags:["história","comida","clássico"]},
  viena:{name:"Viena", country:"Áustria", flag:"🇦🇹", cpd:94, sugDays:3, x:66, y:52, vibe:"palácios, música e cafés", desc:"Elegante e muito organizada, boa ponte para Budapeste e Praga.", tags:["clássica","cafés","palácios"]},
  praga:{name:"Praga", country:"Tchéquia", flag:"🇨🇿", cpd:68, sugDays:3, x:62, y:47, vibe:"castelo, cerveja e arquitetura", desc:"Linda, relativamente barata e perfeita para outono.", tags:["barato","cerveja","medieval"]},
  berlim:{name:"Berlim", country:"Alemanha", flag:"🇩🇪", cpd:86, sugDays:4, x:60, y:40, vibe:"história, arte e noite", desc:"Cidade grande, criativa, cheia de museus e memória histórica.", tags:["história","noite","arte"]},
  munique:{name:"Munique", country:"Alemanha", flag:"🇩🇪", cpd:100, sugDays:2, x:60, y:52, vibe:"cervejarias, parques e Alpes", desc:"Boa para cultura bávara e conexões ao sul da Alemanha.", tags:["cerveja","alpes","caro"]},
  copenhague:{name:"Copenhague", country:"Dinamarca", flag:"🇩🇰", cpd:130, sugDays:3, x:60, y:29, vibe:"design, canais e bicicleta", desc:"Cara, mas impecável para quem ama design e cidade organizada.", tags:["design","bike","caro"]},
  budapeste:{name:"Budapeste", country:"Hungria", flag:"🇭🇺", cpd:60, sugDays:3, x:69, y:56, vibe:"termas, Danúbio e bares ruína", desc:"Excelente custo-benefício, banhos termais e vida noturna.", tags:["barato","termas","noite"]},
  split:{name:"Split", country:"Croácia", flag:"🇭🇷", cpd:74, sugDays:2, x:68, y:68, vibe:"mar, palácio e ilhas", desc:"Opção mediterrânea para adicionar praia e sol ao roteiro.", tags:["mar","ilhas","verão"]},
  atenas:{name:"Atenas", country:"Grécia", flag:"🇬🇷", cpd:72, sugDays:3, x:77, y:79, vibe:"ruínas, comida e ilhas", desc:"Mais distante do eixo de trem, mas ótima para história e comida.", tags:["história","comida","ilhas"]}
};

export const DEFAULT_ROUTE = ["lisboa","barcelona","zuriquecorretor"].filter(Boolean);
export const START_ROUTE = ["lisboa","barcelona","zurique","paris","berlim","copenhague","veneza"];

export const TRAINS = [
  ["Lisboa","Madrid","10h","noturno/ônibus+trem","€45-90"],
  ["Madrid","Barcelona","2h45","AVE", "€25-80"],
  ["Barcelona","Paris","6h45","TGV/AVE", "€60-140"],
  ["Paris","Bruxelas","1h25","Eurostar", "€29-90"],
  ["Bruxelas","Amsterdã","2h", "Intercity", "€25-55"],
  ["Amsterdã","Berlim","6h20","IC/ICE", "€35-100"],
  ["Berlim","Praga","4h15","EuroCity", "€25-65"],
  ["Praga","Viena","4h10","Railjet", "€20-60"],
  ["Viena","Budapeste","2h40","Railjet", "€15-45"],
  ["Viena","Veneza","7h30","Railjet/noturno", "€45-110"],
  ["Veneza","Roma","3h45","Frecciarossa", "€35-90"]
];

export const TIPS = [
  ["🎫","Compre trens cedo","Rotas internacionais costumam ficar mais caras perto da data. Pesquise com 60–90 dias de antecedência."],
  ["🎒","Leve mochila leve","Outubro pede camadas: camiseta, fleece, jaqueta corta-vento/impermeável e calçado confortável."],
  ["🏨","Hospedagem central","Às vezes pagar um pouco mais economiza transporte e tempo em cidades grandes."],
  ["🍽️","Almoço econômico","Faça a refeição principal no almoço e deixe mercado/lanche para a noite."],
  ["🌧️","Plano para chuva","Tenha sempre 1 museu/café/mercado coberto salvo por cidade."],
  ["📱","Internet e mapas","Baixe mapas offline e salve reservas em PDF antes de sair."]
];

export const CHECKS = {
  "Documentos":["Passaporte válido","Seguro viagem","Comprovantes de hospedagem","Passagens principais","Cópias digitais"],
  "Dinheiro":["Cartão internacional","Wise/Revolut","Reserva em dinheiro","Avisar banco sobre viagem"],
  "Tecnologia":["Carregador","Power bank","Adaptador universal","Chip/eSIM","Mapas offline"],
  "Mochila":["Jaqueta impermeável","Tênis confortável","Cadeado","Necessaire transparente","Remédios básicos"]
};

export const PACK = [
  ["Roupas","👕","5 camisetas",0.8],["Roupas","🧥","1 jaqueta impermeável",0.7],["Roupas","👖","2 calças",0.9],
  ["Roupas","🧦","7 meias",0.25],["Roupas","🩲","7 roupas íntimas",0.25],["Calçados","👟","Tênis confortável",0.9],
  ["Tecnologia","🔌","Adaptador universal",0.12],["Tecnologia","🔋","Power bank",0.25],["Tecnologia","📱","Celular + cabo",0.25],
  ["Higiene","🧴","Necessaire compacta",0.5],["Segurança","🔒","Cadeado",0.12],["Saúde","💊","Remédios básicos",0.2]
];

export const PHRASES = [
  ["geral","Olá","Hello","Bonjour","Hola","Ciao","Hallo"],
  ["geral","Obrigado","Thank you","Merci","Gracias","Grazie","Danke"],
  ["transporte","Onde fica a estação?","Where is the station?","Où est la gare?","¿Dónde está la estación?","Dov'è la stazione?","Wo ist der Bahnhof?"],
  ["transporte","Quanto custa a passagem?","How much is the ticket?","Combien coûte le billet?","¿Cuánto cuesta el billete?","Quanto costa il biglietto?","Was kostet die Fahrkarte?"],
  ["comida","Uma água, por favor","Water, please","De l'eau, s'il vous plaît","Agua, por favor","Acqua, per favore","Wasser, bitte"],
  ["comida","A conta, por favor","The bill, please","L'addition, s'il vous plaît","La cuenta, por favor","Il conto, per favore","Die Rechnung, bitte"],
  ["emergência","Preciso de ajuda","I need help","J'ai besoin d'aide","Necesito ayuda","Ho bisogno di aiuto","Ich brauche Hilfe"]
];

export const RATES = { EUR:1, BRL:5.9, USD:1.08, GBP:0.86, CHF:0.95, CZK:25.1, DKK:7.46, HUF:390 };
