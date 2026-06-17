export const DB = {
  lisboa:{name:"Lisboa",country:"Portugal",flag:"🇵🇹",cpd:70,sugDays:3,x:18,y:72,vibe:"miradouros, fado e azulejos",desc:"Chegada perfeita para começar leve, comer bem e se adaptar ao fuso.",tags:["barato","romântico","histórico"],lat:38.7223,lng:-9.1393,image:"https://images.unsplash.com/photo-1585208798174-6cedd86e019a?auto=format&fit=crop&w=1200&q=80"},
  porto:{name:"Porto",country:"Portugal",flag:"🇵🇹",cpd:62,sugDays:2,x:17,y:66,vibe:"vinho, rio Douro e ruelas",desc:"Cidade compacta e charmosa para caminhar, comer barato e ver pôr do sol.",tags:["barato","vinho","walkable"],lat:41.1579,lng:-8.6291,image:"https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=1200&q=80"},
  madrid:{name:"Madrid",country:"Espanha",flag:"🇪🇸",cpd:78,sugDays:3,x:30,y:70,vibe:"museus, tapas e praças",desc:"Base urbana com museus excelentes, vida noturna e bate-voltas fáceis.",tags:["museus","noite","comida"],lat:40.4168,lng:-3.7038,image:"https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=1200&q=80"},
  barcelona:{name:"Barcelona",country:"Espanha",flag:"🇪🇸",cpd:86,sugDays:3,x:38,y:67,vibe:"Gaudí, praia e bairro gótico",desc:"Mistura de arquitetura, mar e vida cultural forte.",tags:["praia","arquitetura","popular"],lat:41.3874,lng:2.1686,image:"https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=1200&q=80"},
  paris:{name:"Paris",country:"França",flag:"🇫🇷",cpd:110,sugDays:4,x:47,y:45,vibe:"museus, cafés e clássicos",desc:"Clássica, cara, mas perfeita para outubro: menos calor e luz bonita.",tags:["romântico","museus","caro"],lat:48.8566,lng:2.3522,image:"https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80"},
  londres:{name:"Londres",country:"Reino Unido",flag:"🇬🇧",cpd:125,sugDays:4,x:40,y:36,vibe:"pubs, parques e museus gratuitos",desc:"Metrópole cara, mas com muitos museus e atrações gratuitas.",tags:["museus","caro","metrópole"],lat:51.5072,lng:-0.1276,image:"https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80"},
  amsterdam:{name:"Amsterdã",country:"Holanda",flag:"🇳🇱",cpd:105,sugDays:3,x:52,y:36,vibe:"canais, bicicleta e museus",desc:"Linda no outono, com canais, cafés e deslocamento fácil.",tags:["canais","bike","caro"],lat:52.3676,lng:4.9041,image:"https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=1200&q=80"},
  bruxelas:{name:"Bruxelas",country:"Bélgica",flag:"🇧🇪",cpd:88,sugDays:2,x:49,y:41,vibe:"chocolate, cerveja e bate-voltas",desc:"Boa conexão entre Paris, Amsterdã e Alemanha.",tags:["conexão","cerveja","chocolate"],lat:50.8503,lng:4.3517,image:"https://images.unsplash.com/photo-1491557345352-5929e343eb89?auto=format&fit=crop&w=1200&q=80"},
  zurique:{name:"Zurique",country:"Suíça",flag:"🇨🇭",cpd:145,sugDays:2,x:55,y:55,vibe:"lagos, montanhas e trens",desc:"Cara, mas estratégica para paisagens alpinas e trens cênicos.",tags:["caro","lagos","trem"],lat:47.3769,lng:8.5417,image:"https://images.unsplash.com/photo-1543946207-39bd91e70ca7?auto=format&fit=crop&w=1200&q=80"},
  milao:{name:"Milão",country:"Itália",flag:"🇮🇹",cpd:96,sugDays:2,x:57,y:60,vibe:"moda, Duomo e conexões",desc:"Entrada eficiente para Itália, com ótimo acesso de trem.",tags:["moda","conexão","duomo"],lat:45.4642,lng:9.19,image:"https://images.unsplash.com/photo-1520175480921-4edfa2983e0f?auto=format&fit=crop&w=1200&q=80"},
  veneza:{name:"Veneza",country:"Itália",flag:"🇮🇹",cpd:105,sugDays:2,x:62,y:62,vibe:"canais e romance",desc:"Única e fotogênica; outubro costuma ser mais agradável que verão.",tags:["romântico","fotogênico","caro"],lat:45.4408,lng:12.3155,image:"https://images.unsplash.com/photo-1514890547357-a9ee288728e0?auto=format&fit=crop&w=1200&q=80"},
  roma:{name:"Roma",country:"Itália",flag:"🇮🇹",cpd:92,sugDays:4,x:60,y:75,vibe:"história, massa e ruínas",desc:"Museu a céu aberto, ótima para fechar um roteiro épico.",tags:["história","comida","clássico"],lat:41.9028,lng:12.4964,image:"https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80"},
  viena:{name:"Viena",country:"Áustria",flag:"🇦🇹",cpd:94,sugDays:3,x:68,y:54,vibe:"palácios, música e cafés",desc:"Elegante e muito organizada, boa ponte para Budapeste e Praga.",tags:["clássica","cafés","palácios"],lat:48.2082,lng:16.3738,image:"https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&w=1200&q=80"},
  praga:{name:"Praga",country:"Tchéquia",flag:"🇨🇿",cpd:68,sugDays:3,x:63,y:47,vibe:"castelo, cerveja e arquitetura",desc:"Linda, relativamente barata e perfeita para outono.",tags:["barato","cerveja","medieval"],lat:50.0755,lng:14.4378,image:"https://images.unsplash.com/photo-1541849546-216549ae216d?auto=format&fit=crop&w=1200&q=80"},
  berlim:{name:"Berlim",country:"Alemanha",flag:"🇩🇪",cpd:86,sugDays:4,x:61,y:39,vibe:"história, arte e noite",desc:"Cidade grande, criativa, cheia de museus e memória histórica.",tags:["história","noite","arte"],lat:52.52,lng:13.405,image:"https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=1200&q=80"},
  munique:{name:"Munique",country:"Alemanha",flag:"🇩🇪",cpd:100,sugDays:2,x:61,y:54,vibe:"cervejarias, parques e Alpes",desc:"Boa para cultura bávara e conexões ao sul da Alemanha.",tags:["cerveja","alpes","caro"],lat:48.1351,lng:11.582,image:"https://images.unsplash.com/photo-1595867818082-083862f3d630?auto=format&fit=crop&w=1200&q=80"},
  copenhague:{name:"Copenhague",country:"Dinamarca",flag:"🇩🇰",cpd:130,sugDays:3,x:61,y:29,vibe:"design, canais e bicicleta",desc:"Cara, mas impecável para quem ama design e cidade organizada.",tags:["design","bike","caro"],lat:55.6761,lng:12.5683,image:"https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?auto=format&fit=crop&w=1200&q=80"},
  budapeste:{name:"Budapeste",country:"Hungria",flag:"🇭🇺",cpd:60,sugDays:3,x:70,y:59,vibe:"termas, Danúbio e bares ruína",desc:"Excelente custo-benefício, banhos termais e vida noturna.",tags:["barato","termas","noite"],lat:47.4979,lng:19.0402,image:"https://images.unsplash.com/photo-1549877452-9c387954fbc2?auto=format&fit=crop&w=1200&q=80"},
  split:{name:"Split",country:"Croácia",flag:"🇭🇷",cpd:74,sugDays:2,x:68,y:73,vibe:"mar, palácio e ilhas",desc:"Opção mediterrânea para adicionar praia e sol ao roteiro.",tags:["mar","ilhas","verão"],lat:43.5081,lng:16.4402,image:"https://images.unsplash.com/photo-1555990793-da11153b2473?auto=format&fit=crop&w=1200&q=80"},
  atenas:{name:"Atenas",country:"Grécia",flag:"🇬🇷",cpd:72,sugDays:3,x:79,y:84,vibe:"ruínas, comida e ilhas",desc:"Mais distante do eixo de trem, mas ótima para história e comida.",tags:["história","comida","ilhas"],lat:37.9838,lng:23.7275,image:"https://images.unsplash.com/photo-1555993539-1732b0258235?auto=format&fit=crop&w=1200&q=80"}
};

export const START_ROUTE = ["lisboa","barcelona","zurique","paris","berlim","copenhague","veneza"];

export const VEHICLE_TYPES = [
  ["trem","🚆 Trem"],
  ["aviao","✈️ Avião"],
  ["onibus","🚌 Ônibus"],
  ["carro","🚗 Carro"],
  ["ferry","⛴️ Ferry"],
  ["metro","🚇 Metrô"],
  ["caminhada","🚶 Caminhada"],
  ["bike","🚲 Bike"],
  ["outro","✨ Outro"]
];

export const TIPS = [
  ["🎫","Reserve deslocamentos cedo","Rotas internacionais e voos costumam ficar mais caros perto da data. Pesquise com 60–90 dias de antecedência."],
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
