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
  ,sao_paulo:{name:"São Paulo",country:"Brasil",flag:"🇧🇷",cpd:55,sugDays:1,x:22,y:88,vibe:"aeroportos, gastronomia e conexão",desc:"Boa origem para voos internacionais e conexões no Brasil.",tags:["origem","aeroporto","comida"],lat:-23.5558,lng:-46.6396,image:"https://images.unsplash.com/photo-1543059080-f9b1272213d5?auto=format&fit=crop&w=1200&q=80"}
  ,rio_de_janeiro:{name:"Rio de Janeiro",country:"Brasil",flag:"🇧🇷",cpd:60,sugDays:2,x:20,y:90,vibe:"praias, cartões-postais e aeroporto",desc:"Origem ou conexão brasileira com paisagens clássicas.",tags:["origem","praia","aeroporto"],lat:-22.9068,lng:-43.1729,image:"https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=1200&q=80"}
  ,belo_horizonte:{name:"Belo Horizonte",country:"Brasil",flag:"🇧🇷",cpd:45,sugDays:1,x:21,y:87,vibe:"origem, comida mineira e conexão",desc:"Base brasileira para organizar saída e documentos antes da Europa.",tags:["origem","comida","conexão"],lat:-19.9167,lng:-43.9345,image:"https://images.unsplash.com/photo-1583511655826-05700442b31b?auto=format&fit=crop&w=1200&q=80"}
  ,brasilia:{name:"Brasília",country:"Brasil",flag:"🇧🇷",cpd:52,sugDays:1,x:23,y:84,vibe:"capital, aeroporto e organização",desc:"Origem brasileira com boa malha aérea e serviços consulares.",tags:["origem","capital","aeroporto"],lat:-15.7939,lng:-47.8828,image:"https://images.unsplash.com/photo-1599586120429-48281b6f0ece?auto=format&fit=crop&w=1200&q=80"}
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


export const COUNTRY_CITY_GROUPS = Object.values(DB).reduce((acc,c)=>{
  (acc[c.country] ||= []).push(c.name);
  return acc;
},{});

export const VEHICLE_CURRENCIES = ["EUR","BRL","CHF","GBP","USD","CZK","DKK","HUF"];

export const PHRASE_COUNTRIES = [
  {id:"brasil",country:"Brasil",flag:"🇧🇷",lang:"PT",label:"Brasil / Português"},
  {id:"portugal",country:"Portugal",flag:"🇵🇹",lang:"PT",label:"Portugal / Português"},
  {id:"espanha",country:"Espanha",flag:"🇪🇸",lang:"ES",label:"Espanha / Espanhol"},
  {id:"franca",country:"França",flag:"🇫🇷",lang:"FR",label:"França / Francês"},
  {id:"italia",country:"Itália",flag:"🇮🇹",lang:"IT",label:"Itália / Italiano"},
  {id:"alemanha",country:"Alemanha",flag:"🇩🇪",lang:"DE",label:"Alemanha / Alemão"},
  {id:"suica",country:"Suíça",flag:"🇨🇭",lang:"DE",label:"Suíça / Alemão base"},
  {id:"reino_unido",country:"Reino Unido",flag:"🇬🇧",lang:"EN",label:"Reino Unido / Inglês"},
  {id:"tchequia",country:"Tchéquia",flag:"🇨🇿",lang:"EN",label:"Tchéquia / Inglês de apoio"},
  {id:"dinamarca",country:"Dinamarca",flag:"🇩🇰",lang:"EN",label:"Dinamarca / Inglês de apoio"}
];

export const PHRASE_ITEMS = [
  {cat:"geral",pt:"Olá",EN:"Hello",FR:"Bonjour",ES:"Hola",IT:"Ciao",DE:"Hallo"},
  {cat:"geral",pt:"Bom dia",EN:"Good morning",FR:"Bonjour",ES:"Buenos días",IT:"Buongiorno",DE:"Guten Morgen"},
  {cat:"geral",pt:"Boa noite",EN:"Good evening",FR:"Bonsoir",ES:"Buenas noches",IT:"Buonasera",DE:"Guten Abend"},
  {cat:"geral",pt:"Por favor",EN:"Please",FR:"S'il vous plaît",ES:"Por favor",IT:"Per favore",DE:"Bitte"},
  {cat:"geral",pt:"Obrigado",EN:"Thank you",FR:"Merci",ES:"Gracias",IT:"Grazie",DE:"Danke"},
  {cat:"geral",pt:"Desculpe",EN:"Sorry",FR:"Pardon",ES:"Perdón",IT:"Scusi",DE:"Entschuldigung"},
  {cat:"geral",pt:"Eu não falo bem o idioma",EN:"I don't speak the language well",FR:"Je ne parle pas bien la langue",ES:"No hablo bien el idioma",IT:"Non parlo bene la lingua",DE:"Ich spreche die Sprache nicht gut"},
  {cat:"geral",pt:"Você fala inglês?",EN:"Do you speak English?",FR:"Parlez-vous anglais ?",ES:"¿Habla inglés?",IT:"Parla inglese?",DE:"Sprechen Sie Englisch?"},
  {cat:"geral",pt:"Pode repetir?",EN:"Can you repeat that?",FR:"Pouvez-vous répéter ?",ES:"¿Puede repetir?",IT:"Può ripetere?",DE:"Können Sie das wiederholen?"},
  {cat:"geral",pt:"Quanto custa?",EN:"How much does it cost?",FR:"Combien ça coûte ?",ES:"¿Cuánto cuesta?",IT:"Quanto costa?",DE:"Wie viel kostet das?"},
  {cat:"transporte",pt:"Onde fica a estação?",EN:"Where is the station?",FR:"Où est la gare ?",ES:"¿Dónde está la estación?",IT:"Dov'è la stazione?",DE:"Wo ist der Bahnhof?"},
  {cat:"transporte",pt:"Onde fica o aeroporto?",EN:"Where is the airport?",FR:"Où est l'aéroport ?",ES:"¿Dónde está el aeropuerto?",IT:"Dov'è l'aeroporto?",DE:"Wo ist der Flughafen?"},
  {cat:"transporte",pt:"Qual plataforma?",EN:"Which platform?",FR:"Quel quai ?",ES:"¿Qué andén?",IT:"Quale binario?",DE:"Welcher Bahnsteig?"},
  {cat:"transporte",pt:"Este trem vai para... ?",EN:"Does this train go to...?",FR:"Ce train va à... ?",ES:"¿Este tren va a...?",IT:"Questo treno va a...?",DE:"Fährt dieser Zug nach...?"},
  {cat:"transporte",pt:"A passagem é só de ida",EN:"One-way ticket",FR:"Un aller simple",ES:"Billete de ida",IT:"Biglietto di sola andata",DE:"Eine einfache Fahrt"},
  {cat:"transporte",pt:"Ida e volta",EN:"Round trip",FR:"Aller-retour",ES:"Ida y vuelta",IT:"Andata e ritorno",DE:"Hin und zurück"},
  {cat:"transporte",pt:"O ônibus já passou?",EN:"Has the bus already passed?",FR:"Le bus est-il déjà passé ?",ES:"¿Ya pasó el autobús?",IT:"L'autobus è già passato?",DE:"Ist der Bus schon weg?"},
  {cat:"transporte",pt:"Preciso validar o bilhete?",EN:"Do I need to validate the ticket?",FR:"Dois-je valider le billet ?",ES:"¿Tengo que validar el billete?",IT:"Devo convalidare il biglietto?",DE:"Muss ich das Ticket entwerten?"},
  {cat:"transporte",pt:"Onde compro o bilhete?",EN:"Where can I buy a ticket?",FR:"Où puis-je acheter un billet ?",ES:"¿Dónde compro un billete?",IT:"Dove posso comprare un biglietto?",DE:"Wo kann ich ein Ticket kaufen?"},
  {cat:"transporte",pt:"Quanto tempo demora?",EN:"How long does it take?",FR:"Combien de temps cela prend ?",ES:"¿Cuánto tarda?",IT:"Quanto tempo ci vuole?",DE:"Wie lange dauert es?"},
  {cat:"direções",pt:"Onde fica o banheiro?",EN:"Where is the restroom?",FR:"Où sont les toilettes ?",ES:"¿Dónde está el baño?",IT:"Dov'è il bagno?",DE:"Wo ist die Toilette?"},
  {cat:"direções",pt:"Fica perto daqui?",EN:"Is it near here?",FR:"C'est près d'ici ?",ES:"¿Está cerca de aquí?",IT:"È vicino a qui?",DE:"Ist es in der Nähe?"},
  {cat:"direções",pt:"Pode me mostrar no mapa?",EN:"Can you show me on the map?",FR:"Pouvez-vous me montrer sur la carte ?",ES:"¿Puede mostrarme en el mapa?",IT:"Può mostrarmelo sulla mappa?",DE:"Können Sie es mir auf der Karte zeigen?"},
  {cat:"direções",pt:"Vire à direita",EN:"Turn right",FR:"Tournez à droite",ES:"Gire a la derecha",IT:"Giri a destra",DE:"Biegen Sie rechts ab"},
  {cat:"direções",pt:"Vire à esquerda",EN:"Turn left",FR:"Tournez à gauche",ES:"Gire a la izquierda",IT:"Giri a sinistra",DE:"Biegen Sie links ab"},
  {cat:"direções",pt:"Siga em frente",EN:"Go straight",FR:"Allez tout droit",ES:"Siga recto",IT:"Vada dritto",DE:"Gehen Sie geradeaus"},
  {cat:"comida",pt:"Uma mesa para dois",EN:"A table for two",FR:"Une table pour deux",ES:"Una mesa para dos",IT:"Un tavolo per due",DE:"Ein Tisch für zwei"},
  {cat:"comida",pt:"Cardápio, por favor",EN:"Menu, please",FR:"Le menu, s'il vous plaît",ES:"El menú, por favor",IT:"Il menù, per favore",DE:"Die Speisekarte, bitte"},
  {cat:"comida",pt:"Água sem gás",EN:"Still water",FR:"Eau plate",ES:"Agua sin gas",IT:"Acqua naturale",DE:"Stilles Wasser"},
  {cat:"comida",pt:"Água com gás",EN:"Sparkling water",FR:"Eau gazeuse",ES:"Agua con gas",IT:"Acqua frizzante",DE:"Mineralwasser mit Kohlensäure"},
  {cat:"comida",pt:"Sou alérgico a...",EN:"I am allergic to...",FR:"Je suis allergique à...",ES:"Soy alérgico a...",IT:"Sono allergico a...",DE:"Ich bin allergisch gegen..."},
  {cat:"comida",pt:"Sem carne, por favor",EN:"No meat, please",FR:"Sans viande, s'il vous plaît",ES:"Sin carne, por favor",IT:"Senza carne, per favore",DE:"Ohne Fleisch, bitte"},
  {cat:"comida",pt:"A conta, por favor",EN:"The bill, please",FR:"L'addition, s'il vous plaît",ES:"La cuenta, por favor",IT:"Il conto, per favore",DE:"Die Rechnung, bitte"},
  {cat:"comida",pt:"Pode separar a conta?",EN:"Can you split the bill?",FR:"Pouvez-vous séparer l'addition ?",ES:"¿Puede dividir la cuenta?",IT:"Può dividere il conto?",DE:"Können Sie die Rechnung teilen?"},
  {cat:"comida",pt:"Para viagem",EN:"Takeaway",FR:"À emporter",ES:"Para llevar",IT:"Da asporto",DE:"Zum Mitnehmen"},
  {cat:"comida",pt:"Qual é o prato típico?",EN:"What is the typical dish?",FR:"Quel est le plat typique ?",ES:"¿Cuál es el plato típico?",IT:"Qual è il piatto tipico?",DE:"Was ist das typische Gericht?"},
  {cat:"hospedagem",pt:"Tenho uma reserva",EN:"I have a reservation",FR:"J'ai une réservation",ES:"Tengo una reserva",IT:"Ho una prenotazione",DE:"Ich habe eine Reservierung"},
  {cat:"hospedagem",pt:"Check-in, por favor",EN:"Check-in, please",FR:"Check-in, s'il vous plaît",ES:"Check-in, por favor",IT:"Check-in, per favore",DE:"Check-in, bitte"},
  {cat:"hospedagem",pt:"Posso deixar a mala aqui?",EN:"Can I leave my bag here?",FR:"Puis-je laisser mon sac ici ?",ES:"¿Puedo dejar mi maleta aquí?",IT:"Posso lasciare la valigia qui?",DE:"Kann ich meine Tasche hier lassen?"},
  {cat:"hospedagem",pt:"Qual é a senha do Wi‑Fi?",EN:"What is the Wi‑Fi password?",FR:"Quel est le mot de passe Wi‑Fi ?",ES:"¿Cuál es la contraseña del Wi‑Fi?",IT:"Qual è la password del Wi‑Fi?",DE:"Wie lautet das WLAN-Passwort?"},
  {cat:"hospedagem",pt:"O quarto tem banheiro?",EN:"Does the room have a bathroom?",FR:"La chambre a-t-elle une salle de bain ?",ES:"¿La habitación tiene baño?",IT:"La camera ha il bagno?",DE:"Hat das Zimmer ein Bad?"},
  {cat:"hospedagem",pt:"Que horas é o check-out?",EN:"What time is check-out?",FR:"À quelle heure est le départ ?",ES:"¿A qué hora es el check-out?",IT:"A che ora è il check-out?",DE:"Wann ist der Check-out?"},
  {cat:"compras",pt:"Aceita cartão?",EN:"Do you accept cards?",FR:"Acceptez-vous les cartes ?",ES:"¿Aceptan tarjeta?",IT:"Accettate carte?",DE:"Akzeptieren Sie Karten?"},
  {cat:"compras",pt:"Tem desconto?",EN:"Is there a discount?",FR:"Y a-t-il une réduction ?",ES:"¿Hay descuento?",IT:"C'è uno sconto?",DE:"Gibt es einen Rabatt?"},
  {cat:"compras",pt:"Só estou olhando",EN:"I'm just looking",FR:"Je regarde seulement",ES:"Solo estoy mirando",IT:"Sto solo guardando",DE:"Ich schaue nur"},
  {cat:"compras",pt:"Preciso de recibo",EN:"I need a receipt",FR:"J'ai besoin d'un reçu",ES:"Necesito un recibo",IT:"Ho bisogno di una ricevuta",DE:"Ich brauche eine Quittung"},
  {cat:"turismo",pt:"Quanto custa a entrada?",EN:"How much is the entrance fee?",FR:"Combien coûte l'entrée ?",ES:"¿Cuánto cuesta la entrada?",IT:"Quanto costa l'ingresso?",DE:"Wie viel kostet der Eintritt?"},
  {cat:"turismo",pt:"Tem ingresso para hoje?",EN:"Are there tickets for today?",FR:"Y a-t-il des billets pour aujourd'hui ?",ES:"¿Hay entradas para hoy?",IT:"Ci sono biglietti per oggi?",DE:"Gibt es Tickets für heute?"},
  {cat:"turismo",pt:"Pode tirar uma foto?",EN:"Can you take a photo?",FR:"Pouvez-vous prendre une photo ?",ES:"¿Puede tomar una foto?",IT:"Può fare una foto?",DE:"Können Sie ein Foto machen?"},
  {cat:"turismo",pt:"Onde é a entrada?",EN:"Where is the entrance?",FR:"Où est l'entrée ?",ES:"¿Dónde está la entrada?",IT:"Dov'è l'ingresso?",DE:"Wo ist der Eingang?"},
  {cat:"emergência",pt:"Preciso de ajuda",EN:"I need help",FR:"J'ai besoin d'aide",ES:"Necesito ayuda",IT:"Ho bisogno di aiuto",DE:"Ich brauche Hilfe"},
  {cat:"emergência",pt:"Chame a polícia",EN:"Call the police",FR:"Appelez la police",ES:"Llame a la policía",IT:"Chiami la polizia",DE:"Rufen Sie die Polizei"},
  {cat:"emergência",pt:"Chame uma ambulância",EN:"Call an ambulance",FR:"Appelez une ambulance",ES:"Llame a una ambulancia",IT:"Chiami un'ambulanza",DE:"Rufen Sie einen Krankenwagen"},
  {cat:"emergência",pt:"Perdi meu passaporte",EN:"I lost my passport",FR:"J'ai perdu mon passeport",ES:"Perdí mi pasaporte",IT:"Ho perso il passaporto",DE:"Ich habe meinen Reisepass verloren"},
  {cat:"emergência",pt:"Preciso ir ao hospital",EN:"I need to go to the hospital",FR:"Je dois aller à l'hôpital",ES:"Necesito ir al hospital",IT:"Devo andare in ospedale",DE:"Ich muss ins Krankenhaus"},
  {cat:"emergência",pt:"Estou perdido",EN:"I am lost",FR:"Je suis perdu",ES:"Estoy perdido",IT:"Mi sono perso",DE:"Ich habe mich verlaufen"},
  {cat:"emergência",pt:"Este é meu endereço",EN:"This is my address",FR:"Voici mon adresse",ES:"Esta es mi dirección",IT:"Questo è il mio indirizzo",DE:"Das ist meine Adresse"},
  {cat:"emergência",pt:"Fale devagar, por favor",EN:"Speak slowly, please",FR:"Parlez lentement, s'il vous plaît",ES:"Hable despacio, por favor",IT:"Parli lentamente, per favore",DE:"Sprechen Sie bitte langsam"},
  {cat:"saúde",pt:"Preciso de uma farmácia",EN:"I need a pharmacy",FR:"J'ai besoin d'une pharmacie",ES:"Necesito una farmacia",IT:"Ho bisogno di una farmacia",DE:"Ich brauche eine Apotheke"},
  {cat:"saúde",pt:"Tenho dor de cabeça",EN:"I have a headache",FR:"J'ai mal à la tête",ES:"Tengo dolor de cabeza",IT:"Ho mal di testa",DE:"Ich habe Kopfschmerzen"},
  {cat:"saúde",pt:"Tenho febre",EN:"I have a fever",FR:"J'ai de la fièvre",ES:"Tengo fiebre",IT:"Ho la febbre",DE:"Ich habe Fieber"},
  {cat:"saúde",pt:"Pode me ajudar?",EN:"Can you help me?",FR:"Pouvez-vous m'aider ?",ES:"¿Puede ayudarme?",IT:"Può aiutarmi?",DE:"Können Sie mir helfen?"}
];

export const COUNTRY_TIPS = [
  {country:"Brasil",type:"saída",title:"Chegue cedo no aeroporto",text:"Para voo internacional saindo do Brasil, planeje chegar com folga e já deixe documentos salvos offline."},
  {country:"Brasil",type:"documentos",title:"Comprovantes no celular",text:"Salve seguro, reservas, passagens e passaporte em PDF antes de sair."},
  {country:"Portugal",type:"transporte",title:"Cartão e metrô",text:"Lisboa e Porto funcionam bem com transporte público; valide sempre o bilhete."},
  {country:"Portugal",type:"comida",title:"Menu do dia",text:"Procure menus executivos no almoço para economizar sem comer mal."},
  {country:"Espanha",type:"comida",title:"Horários mais tarde",text:"Jantar costuma ser mais tarde; planeje lanche se você come cedo."},
  {country:"Espanha",type:"turismo",title:"Reserve Gaudí",text:"Em Barcelona, atrações famosas podem esgotar. Reserve com antecedência."},
  {country:"França",type:"comportamento",title:"Cumprimente primeiro",text:"Entrar falando bonjour/bonsoir antes de pedir ajuda costuma melhorar o atendimento."},
  {country:"França",type:"transporte",title:"Bilhete validado",text:"Em trens e metrôs, mantenha o bilhete até sair da estação."},
  {country:"Itália",type:"comida",title:"Coperto",text:"Alguns restaurantes cobram couvert/coperto. Confira no cardápio antes."},
  {country:"Itália",type:"turismo",title:"Fontes de água",text:"Em Roma, leve garrafa e use as fontes públicas quando possível."},
  {country:"Suíça",type:"comportamento",title:"Escada rolante",text:"Fique à direita e deixe a esquerda livre para quem está com pressa."},
  {country:"Suíça",type:"orçamento",title:"Mercado ajuda muito",text:"Comer em mercado/padaria reduz bastante o custo diário."},
  {country:"Suíça",type:"transporte",title:"Pontualidade real",text:"Trens suíços costumam ser muito pontuais. Chegue antes da plataforma."},
  {country:"Alemanha",type:"transporte",title:"Validação e zona",text:"Confira zona/tarifa e valide quando necessário; fiscalização pode ser rígida."},
  {country:"Alemanha",type:"comportamento",title:"Dinheiro ainda ajuda",text:"Alguns lugares menores podem preferir dinheiro ou cartão local."},
  {country:"Tchéquia",type:"moeda",title:"Coroa tcheca",text:"Evite casas de câmbio muito turísticas; prefira cartão ou caixas confiáveis."},
  {country:"Tchéquia",type:"turismo",title:"Centro cedo",text:"Praga fica muito cheia; vá cedo aos pontos clássicos."},
  {country:"Dinamarca",type:"orçamento",title:"Cidade cara",text:"Copenhague é cara; mercados e comida rápida local ajudam no orçamento."},
  {country:"Dinamarca",type:"transporte",title:"Bicicletas mandam",text:"Atenção às ciclovias; não caminhe nelas sem perceber."},
  {country:"Reino Unido",type:"transporte",title:"Olhe para o lado certo",text:"No Reino Unido a mão é invertida; olhe sempre as marcações no chão."},
  {country:"Holanda",type:"transporte",title:"Ciclovia é séria",text:"Em Amsterdã, evite parar na ciclovia para foto ou mapa."},
  {country:"Bélgica",type:"bate-volta",title:"Trens para cidades próximas",text:"Bruxelas permite bate-voltas fáceis para Bruges, Gent e Antuérpia."},
  {country:"Áustria",type:"comportamento",title:"Organização",text:"Em Viena, transporte e filas costumam ser bem organizados; siga sinalizações."},
  {country:"Hungria",type:"saúde",title:"Termais",text:"Leve chinelo/toalha se for aos banhos termais para economizar aluguel."},
  {country:"Croácia",type:"turismo",title:"Ilhas e ferry",text:"Confira horários de ferry com antecedência; fora da alta temporada muda bastante."},
  {country:"Grécia",type:"calor",title:"Água sempre",text:"Mesmo fora do verão, carregue água ao visitar ruínas e áreas abertas."}
];

export const RATES = { EUR:1, BRL:5.9, USD:1.08, GBP:0.86, CHF:0.95, CZK:25.1, DKK:7.46, HUF:390 };
