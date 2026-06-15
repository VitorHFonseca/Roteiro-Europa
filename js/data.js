/* ============================================================
   Mochilão Europa — Dados estáticos
   Cidades, Trens, Dicas, Checklist, Mochila, Moedas, Frases
   ============================================================ */

/* ── Utilitário de imagens Unsplash ── */
const U = (id, w = 900) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

/* ── Banco de cidades ── */
const DB = {
  lisboa: {
    id: 'lisboa', name: 'Lisboa', country: 'Portugal', flag: '🇵🇹',
    lat: 38.717, lng: -9.139, color: '#4ecb8d',
    img: U('1555881400-74d7acaacd8b'), popupImg: U('1555881400-74d7acaacd8b', 400),
    cpd: 88, hostel: '€18–28/noite', ref: '€8–14', temp: '~19°C',
    moeda: 'Euro (€)', transit: 'Metro + Bonde 28', sugDays: 2,
    desc: 'Lisboa em outubro é pura magia: o outono dourado ilumina Alfama, os miradouros ficam livres das multidões e a temperatura (~19°C) é perfeita para explorar a pé.',
    hl: [['Castelo de São Jorge','€15','Reserve online'],['Mosteiro dos Jerônimos','€10 (grátis dom.)','Manuelino imperdível'],['Torre de Belém','€8','Combo com Jerônimos'],['Bonde 28','€3','Compre na máquina'],['Museu do Azulejo','€5','Fila mínima em out.'],['Miradouro da Graça','Grátis','Melhor pôr do sol']],
    days: [
      { t: 'Alfama & Centro', a: ['Chegada → metrô para o centro (€1,65)', 'Castelo de São Jorge e vielas do Alfama', 'Bonde 28 pelo centro histórico (€3)', 'Jantar no Mercado da Ribeira (€12–16)'] },
      { t: 'Belém & Partida', a: ['Mosteiro dos Jerônimos (€10) + Torre de Belém (€8)', 'Bairro do Príncipe Real e livraria Ler Devagar', 'Museu do Azulejo — fila mínima em outubro', 'Trem noturno Lusitânia Lisboa→Madrid 22h30 (economiza hostel!)'] }
    ],
    link: 'https://www.visitlisboa.com'
  },
  madrid: {
    id: 'madrid', name: 'Madrid', country: 'Espanha', flag: '🇪🇸',
    lat: 40.416, lng: -3.703, color: '#6b9fff',
    img: U('1543785734-4b6e564642f8'), popupImg: U('1543785734-4b6e564642f8', 400),
    cpd: 92, hostel: '€20–32/noite', ref: '€8–15', temp: '~17°C',
    moeda: 'Euro (€)', transit: 'Metro (€1,50/viagem)', sugDays: 2,
    desc: 'Madrid em outubro tem o Parque do Retiro coberto de folhas douradas e os melhores museus do mundo com filas curtíssimas. O Prado e o Reina Sofía são gratuitos após 18h30.',
    hl: [['Museu do Prado','€15 (grátis após 18h30)','Velázquez e Goya'],['Reina Sofía','€12 (grátis após 18h30)','Guernica de Picasso'],['Parque do Retiro','Grátis','Outono espetacular'],['Plaza Mayor','Grátis','Churros pela manhã'],['Palácio Real','€14','Exterior grátis'],['Mercado San Miguel','€8–14','Tapas e vinhos']],
    days: [
      { t: 'Museus & Retiro', a: ['Plaza Mayor, Puerta del Sol e Gran Vía', 'Parque do Retiro: lago (barco €5) e jardins', 'Prado ou Reina Sofía após 18h30 (GRÁTIS!)', 'Jantar em La Latina: tapas por €10–15'] },
      { t: 'Cultura & Partida', a: ['Mercado de San Miguel pela manhã', 'Malasaña: street art e cultura jovem', 'Palácio Real exterior + Plaza de Oriente (grátis)', 'AVE Madrid→Barcelona (2h30, €25–55)'] }
    ],
    link: 'https://www.esmadrid.com'
  },
  barcelona: {
    id: 'barcelona', name: 'Barcelona', country: 'Espanha', flag: '🇪🇸',
    lat: 41.385, lng: 2.173, color: '#818cf8',
    img: U('1539037116277-4db20889f2d4'), popupImg: U('1539037116277-4db20889f2d4', 400),
    cpd: 98, hostel: '€22–36/noite', ref: '€9–16', temp: '~20°C',
    moeda: 'Euro (€)', transit: 'Metro (€2,40/viagem)', sugDays: 2,
    desc: 'Barcelona em outubro: sem as filas colossais do verão, ~20°C ainda permite a Barceloneta, e o Bairro Gótico tem charme diferente sem as multidões.',
    hl: [['Sagrada Família','€26–38','Reserve online — essencial!'],['Park Güell','€10','Vá cedo'],['Casa Batlló','~€35 (exterior grátis)','Fotografe de fora'],['Las Ramblas','Grátis','Vá de manhã'],['Barceloneta','Grátis','~20°C: ainda dá praia!'],['El Born','Grátis','Bairro mais autêntico']],
    days: [
      { t: 'Gaudí & Gótico', a: ['Sagrada Família (reserve! €26–38)', 'Park Güell: monumental (€10) + área livre', 'Las Ramblas e Bairro Gótico', 'Jantar em El Born'] },
      { t: 'Praia & Despedida', a: ['Barceloneta: ~20°C, praia sem lotação!', 'Poblenou e rota de street art', 'Casa Batlló exterior (grátis)', 'TGV→Paris à tarde (6h30)'] }
    ],
    link: 'https://www.barcelonaturisme.com'
  },
  sevilha: {
    id: 'sevilha', name: 'Sevilha', country: 'Espanha', flag: '🇪🇸',
    lat: 37.389, lng: -5.984, color: '#f59e0b',
    img: U('1555993539-1732b9e5b763'), popupImg: U('1555993539-1732b9e5b763', 400),
    cpd: 82, hostel: '€18–28/noite', ref: '€7–13', temp: '~22°C',
    moeda: 'Euro (€)', transit: 'Metrô + Tram', sugDays: 2,
    desc: 'Outubro é O mês para Sevilha: temperatura perfeita (~22°C), turistas bem menos e a cidade andaluza fica especialmente bonita com a luz de outono.',
    hl: [['Catedral + Giralda','€12','Fila menor em outubro'],['Alcázar Real','€14,50 (grátis seg.)','Reserve!'],['Barrio de Santa Cruz','Grátis','Vielas medievais'],['Triana','Grátis','Bairro flamenco'],['El Rinconcillo','€2–5','Bar desde 1670!'],['Parque María Luisa','Grátis','Outono lindo']],
    days: [
      { t: 'Monumentos & Tapas', a: ['Catedral de Sevilha e Giralda (€12)', 'Alcázar Real (€14,50 ou grátis segunda manhã — reserve!)', 'Barrio de Santa Cruz: vielas medievais', 'Tapas em El Rinconcillo (€1,50–5)'] },
      { t: 'Bairros & Flamenco', a: ['Triana: cerâmica, flamenco e mercado colorido', 'Parque María Luisa com folhagem de outubro (grátis)', 'Show de flamenco em bar local à noite (gratuito em muitos)'] }
    ],
    link: 'https://www.visitasevilla.es'
  },
  paris: {
    id: 'paris', name: 'Paris', country: 'França', flag: '🇫🇷',
    lat: 48.856, lng: 2.352, color: '#f4a261',
    img: U('1502602898657-3e91760cbb34'), popupImg: U('1502602898657-3e91760cbb34', 400),
    cpd: 118, hostel: '€26–42/noite', ref: '€12–20', temp: '~14°C',
    moeda: 'Euro (€)', transit: 'Metrô (€2,10/viagem)', sugDays: 2,
    desc: 'Paris no outono: Champs-Élysées cobertos de folhas alaranjadas, jardins das Tulherias em tons dourados e filas bem menores na Torre Eiffel e no Louvre.',
    hl: [['Torre Eiffel','€11–30','Suba a pé até 2° andar'],['Museu do Louvre','€22','Reserve online — essencial'],['Sacré-Cœur','Grátis','Vista de Paris'],['Champ de Mars','Grátis','Piquenique (baguete+queijo+vinho ~€8)'],['Montmartre','Grátis','Artistas e cafés com lareira'],["Museu d'Orsay",'€16','Impressionistas']],
    days: [
      { t: 'Eiffel & Champs', a: ['Torre Eiffel: suba a pé até 2° andar (€11)', 'Piquenique no Champ de Mars: baguete + queijo + vinho (€8)', 'Pont de Bir-Hakeim ao pôr do sol — luz de outubro cinematográfica'] },
      { t: 'Louvre & Montmartre', a: ['Louvre (€22 — grátis ≤26 anos da UE com passaporte!)', 'Jardim Tulherias e Champs com folhagem laranja', 'Montmartre e Sacré-Cœur: melhor vista de Paris (grátis)', 'Thalys/Eurostar → Amsterdam (~3h30)'] }
    ],
    link: 'https://www.parisinfo.com'
  },
  nice: {
    id: 'nice', name: 'Nice', country: 'França', flag: '🇫🇷',
    lat: 43.710, lng: 7.262, color: '#06b6d4',
    img: U('1544967082-d9d25d867d66'), popupImg: U('1544967082-d9d25d867d66', 400),
    cpd: 98, hostel: '€22–36/noite', ref: '€10–18', temp: '~18°C',
    moeda: 'Euro (€)', transit: 'Tram + ônibus (€1,70)', sugDays: 2,
    desc: 'Nice em outubro é a Riviera no seu melhor: ~18°C (ainda dá nadar!), praias quase vazias e a Vieille Ville sem o turismo sufocante de verão.',
    hl: [['Promenade des Anglais','Grátis','Outono: quase sem turistas'],['Colline du Château','Grátis','Vista panorâmica grátis'],['Vieille Ville','Grátis','Mercados coloridos'],['Musée Chagall','€12','Melhor da Costa Azul'],['Villefranche-sur-Mer','Trem €4,50','30min — vila perfeita'],['Mônaco','Trem €4,50','25min de Nice']],
    days: [
      { t: 'Promenade & Vieille Ville', a: ['Promenade des Anglais — nadar (~18°C)', 'Vieille Ville: Cours Saleya e igrejas barrocas', 'Colline du Château: vista panorâmica grátis', 'Jantar: socca e ratatouille (€8–16)'] },
      { t: 'Riviera & Day Trip', a: ['Trem para Villefranche-sur-Mer (30min, €4,50)', 'Musée Chagall (€12)', 'Opção: Mônaco de trem (25min, €4,50)'] }
    ],
    link: 'https://www.nicetourisme.com'
  },
  amsterdam: {
    id: 'amsterdam', name: 'Amsterdam', country: 'Holanda', flag: '🇳🇱',
    lat: 52.372, lng: 4.895, color: '#c084fc',
    img: U('1534351590666-13e3e96b5017'), popupImg: U('1534351590666-13e3e96b5017', 400),
    cpd: 108, hostel: '€25–40/noite', ref: '€11–18', temp: '~12°C',
    moeda: 'Euro (€)', transit: 'Bicicleta! (€12–16/dia)', sugDays: 2,
    desc: 'Amsterdam em outubro: canais refletem folhas douradas, o Vondelpark coberto de folhas. Reserve a Casa de Anne Frank com MESES de antecedência.',
    hl: [['Casa de Anne Frank','€16','Reserve meses antes!'],['Rijksmuseum','€22,50','Fachada grátis'],['Museu Van Gogh','€22','Outubro: mais tranquilo'],['Aluguel de bicicleta','€12–16/dia','Como os locais'],['Mercado Albert Cuyp','Grátis','Queijos holandeses'],['Negen Straatjes','Grátis','9 ruas charmosas']],
    days: [
      { t: 'Museus & Canais', a: ['Casa de Anne Frank (€16 — reserve meses antes!)', 'Rijksmuseum (€22,50) — outono com grupos menores', 'Bicicleta pelos canais com folhas caindo (€12/dia)', 'Mercado Albert Cuyp: queijos e arenques'] },
      { t: 'Bairros & Despedida', a: ['Vondelpark com folhagem: imperdível e grátis', 'Jordaan e Negen Straatjes', 'Museu Van Gogh (€22)', 'IC Berlin → Berlim (~6h)'] }
    ],
    link: 'https://www.iamsterdam.com'
  },
  bruxelas: {
    id: 'bruxelas', name: 'Bruxelas', country: 'Bélgica', flag: '🇧🇪',
    lat: 50.850, lng: 4.352, color: '#fbbf24',
    img: U('1559598467-f8b76c8155d0'), popupImg: U('1559598467-f8b76c8155d0', 400),
    cpd: 88, hostel: '€20–34/noite', ref: '€9–15', temp: '~13°C',
    moeda: 'Euro (€)', transit: 'Metrô + tram (€2,10)', sugDays: 1,
    desc: 'Bruxelas é parada perfeita de 1 dia entre Paris e Amsterdam. Grand Place é a praça mais bonita da Europa, gauffres e chocolates fenomenais, cerveja belga por €2–3.',
    hl: [['Grand Place','Grátis','Mais bonita à noite iluminada'],['Manneken Pis','Grátis','Procure as roupas temáticas'],['Atomium','€16','Vista única de Bruxelas'],['Musée Magritte','€10','Surrealismo belga'],['Gauffres','€3–5','Padarias, não barracas turísticas'],['Cerveja belga','€2–4','Peça a local do estabelecimento']],
    days: [
      { t: 'Bruxelas em 1 dia', a: ['Grand Place — manhã e à noite iluminada (grátis)', 'Manneken Pis + chocolateries', 'Atomium (€16) ou Musée Magritte (€10)', 'Gauffres, moules-frites e cerveja belga (€15–22)'] }
    ],
    link: 'https://www.visitbrussels.be'
  },
  berlim: {
    id: 'berlim', name: 'Berlim', country: 'Alemanha', flag: '🇩🇪',
    lat: 52.521, lng: 13.405, color: '#94a3b8',
    img: U('1560969184-10fe8719e047'), popupImg: U('1560969184-10fe8719e047', 400),
    cpd: 90, hostel: '€20–34/noite', ref: '€8–14', temp: '~12°C',
    moeda: 'Euro (€)', transit: 'U-Bahn/S-Bahn (€3,20)', sugDays: 2,
    desc: 'Berlim em outubro combina história pesada com cultura vibrante: East Side Gallery, Portão de Brandemburgo e currywurst por €4. A cidade mais acessível da rota ocidental.',
    hl: [['East Side Gallery','Grátis','1,3km do Muro de Berlim'],['Portão de Brandemburgo','Grátis','Símbolo da reunificação'],['Memorial do Holocausto','Grátis','Impactante e silencioso'],['Ilha dos Museus','€12–19','Pergamon ou Neues Museum'],['Currywurst','€3–5','O prato berlinense!'],['Hackescher Markt','Grátis','Cafés e street art']],
    days: [
      { t: 'História & Muro', a: ['East Side Gallery: 1,3km do Muro (grátis)', 'Portão de Brandemburgo e Memorial do Holocausto (grátis)', 'Free walking tour GuruWalk (€5–10 gorjeta)', 'Currywurst + döner kebab: jantar por €4–6'] },
      { t: 'Museus & Bairros', a: ['Ilha dos Museus (Neues €12 ou Pergamon €19)', 'Checkpoint Charlie + Museu do Muro', 'Hackescher Markt e Prenzlauer Berg', 'EC Eurocity → Praga (4h30)'] }
    ],
    link: 'https://www.visitberlin.de'
  },
  munich: {
    id: 'munich', name: 'Munique', country: 'Alemanha', flag: '🇩🇪',
    lat: 48.137, lng: 11.576, color: '#84cc16',
    img: U('1513519245-b7d48e62aa00'), popupImg: U('1513519245-b7d48e62aa00', 400),
    cpd: 102, hostel: '€22–38/noite', ref: '€9–17', temp: '~11°C',
    moeda: 'Euro (€)', transit: 'U-Bahn/S-Bahn (€3,50)', sugDays: 2,
    desc: 'Munique em outubro tem charme pós-Oktoberfest: preços mais baixos, jardins ingleses cobertos de folhas e um ritmo mais autêntico. Base perfeita para Neuschwanstein.',
    hl: [['Marienplatz + Glockenspiel','Grátis','Sino às 11h e 12h'],['Englischer Garten','Grátis','Maior parque urbano da Europa'],['Deutsches Museum','€15','Maior museu de ciência do mundo'],['Residenz','€9','Palácio dos Wittelsbach'],['Nymphenburg','€8,50','Jardins de outono incríveis'],['Biergärten','€6–14','Ritual bávaro autêntico']],
    days: [
      { t: 'Centro & Jardins', a: ['Marienplatz e Glockenspiel (grátis — chegue antes das 12h)', 'Englischer Garten: folhagem dourada espetacular', 'Deutsches Museum (€15) ou BMW Welt (grátis)', 'Biergarten à tarde — o ritual bávaro (~€12)'] },
      { t: 'Castelos & Partida', a: ['Residenz + Hofgarten (€9)', 'Opção: Neuschwanstein day trip (~€35)', 'Viktualienmarkt: mercado de alimentos frescos', 'Railjet → Viena (4h) ou ICE → Berlim (4h)'] }
    ],
    link: 'https://www.muenchen.de/tourismus'
  },
  praga: {
    id: 'praga', name: 'Praga', country: 'Rep. Tcheca', flag: '🇨🇿',
    lat: 50.075, lng: 14.438, color: '#e8c97a',
    img: U('1541849546-216549ae216d'), popupImg: U('1541849546-216549ae216d', 400),
    cpd: 72, hostel: '€14–24/noite', ref: '€5–10', temp: '~12°C',
    moeda: 'CZK (Coroa Tcheca)', transit: 'Metro + bonde (CZK 40)', sugDays: 2,
    desc: 'Praga em outubro: névoa matinal sobre o Vltava, Ponte Carlos ao amanhecer e a cidade velha coberta de folhas douradas. Cerveja mais barata da Europa (CZK 40 ≈ €1,60!).',
    hl: [['Ponte Carlos','Grátis','Amanhecer com névoa de outubro'],['Castelo de Praga','CZK 250 (~€10)','Complexo mais extenso do mundo'],['Relógio Astronômico','Grátis de fora','Sino nas horas cheias'],['Josefov','Grátis passear','Antigo gueto judaico'],['Cerveja tcheca','CZK 40–60','€1,60–2,50 o chope!'],['Žižkov','Grátis','Bares mais baratos da Europa']],
    days: [
      { t: 'Cidade Velha & Cerveja', a: ['Praça da Cidade Velha e Relógio Astronômico (grátis)', 'Bairro Josefov: gueto judaico histórico', 'Svíčková + cerveja tcheca em pub local (CZK 150 ≈ €6)'] },
      { t: 'Castelo & Despedida', a: ['Ponte Carlos ao amanhecer — névoa de outubro épica!', 'Castelo de Praga + Catedral São Vito (~€10)', 'Bar hopping em Žižkov: cerveja CZK 40 ≈ €1,60!'] }
    ],
    link: 'https://www.prague.eu'
  },
  viena: {
    id: 'viena', name: 'Viena', country: 'Áustria', flag: '🇦🇹',
    lat: 48.208, lng: 16.373, color: '#f87171',
    img: null, popupImg: null,
    cpd: 98, hostel: '€22–36/noite', ref: '€9–17', temp: '~12°C',
    moeda: 'Euro (€)', transit: 'U-Bahn + bonde (€2,40)', sugDays: 2,
    desc: 'Viena em outubro: temporada de ópera em pleno vapor, jardins imperiais em tons de outono. Schönbrunn e Belvedere são ainda mais bonitos com a folhagem dourada.',
    hl: [['Schönbrunn','€20–37','Jardins de outono grátis!'],['Belvedere Superior','€16',"Klimt's O Beijo — imperdível"],['Ópera Estatal','€3–15 (em pé)','Para mochileiros'],['Hofburg','€16','Sisi e joias imperiais'],['Naschmarkt','Grátis','Mercado mais famoso'],['Prater + Roda Gigante','€13,50','Vista de Viena']],
    days: [
      { t: 'Habsburgos & Música', a: ['Schönbrunn (€20 básico, jardins de outono grátis)', 'Hofburg + Museu Imperial Sisi (€16)', 'Catedral de Santo Estêvão (grátis, torre €6)', 'Ópera Estatal: entrada de pé (€3–15)'] },
      { t: 'Arte & Belvedere', a: ['Belvedere Superior (€16) — O Beijo de Klimt', 'Jardins Belvedere: outono dourado (grátis)', 'Naschmarkt: o mercado mais famoso', 'Railjet → Budapeste (2h40) ou → Praga (4h)'] }
    ],
    link: 'https://www.wien.info'
  },
  budapeste: {
    id: 'budapeste', name: 'Budapeste', country: 'Hungria', flag: '🇭🇺',
    lat: 47.498, lng: 19.040, color: '#fb923c',
    img: U('1549893620-9c0e7c0a2c7e'), popupImg: null,
    cpd: 78, hostel: '€16–28/noite', ref: '€6–12', temp: '~14°C',
    moeda: 'HUF (Forint)', transit: 'Metro + bonde (HUF 450)', sugDays: 2,
    desc: 'Budapeste em outubro: banhos termais aconchegantes no frescor e os ruin bars do Bairro Judaico com charme outonal. Uma das cidades mais subestimadas da Europa.',
    hl: [['Parlamento','HUF 3.400 (~€8,50)','Reserve tours com antecedência'],['Bastião dos Pescadores','Grátis!','Vista espetacular de Buda'],['Castelo de Buda','Grátis exterior','Vista perfeita do Danúbio'],['Banhos Széchenyi','HUF 8.200 (~€22)','Outubro: vapor no ar frio!'],['Szimpla Ruin Bar','Grátis entrar','O mais famoso do Leste Europeu'],['Ponte das Correntes','Grátis','Foto ao pôr do sol']],
    days: [
      { t: 'Buda & Pest', a: ['Castelo de Buda + Bastião dos Pescadores (grátis)', 'Ponte das Correntes e foto do Parlamento', 'Szimpla Ruin Bar à noite', 'Lángos e goulash: HUF 1.200–2.500 (€3–6)'] },
      { t: 'Banhos & Cultura', a: ['Széchenyi Thermal Bath (~€22) — outubro: vapor incrível!', 'Great Market Hall: páprica e salame', 'Parlamento exterior e Danúbio ao pôr do sol', 'Railjet → Viena (2h40)'] }
    ],
    link: 'https://www.budapest.com'
  },
  roma: {
    id: 'roma', name: 'Roma', country: 'Itália', flag: '🇮🇹',
    lat: 41.902, lng: 12.496, color: '#f97316',
    img: U('1552832144-2abb7c6e7d7e'), popupImg: U('1552832144-2abb7c6e7d7e', 400),
    cpd: 108, hostel: '€22–38/noite', ref: '€10–18', temp: '~19°C',
    moeda: 'Euro (€)', transit: 'Metrô + ônibus (€1,50)', sugDays: 3,
    desc: 'Roma em outubro: ~19°C, filas do Vaticano e Coliseu bem menores e a cidade eterna em ritmo mais humano. Pizza al taglio por €2,50 e gelato artesanal por €2.',
    hl: [['Coliseu + Fórum Romano','€16 combo','Reserve online'],['Vaticano + Sistina','€17–22','Reserve meses antes!'],['Fontana di Trevi','Grátis','Vá antes das 8h'],['Pantheon','€5','Bem preservado'],['Trastevere','Grátis','Mais autêntico à noite'],['Pizza al taglio','€2,50/fatia','Melhor refeição barata']],
    days: [
      { t: 'Roma Antiga', a: ['Coliseu + Fórum Romano + Monte Palatino (€16 combo)', 'Circo Massimo e Aventino (grátis)', 'Pizza al taglio no Trastevere (€2,50–4)'] },
      { t: 'Vaticano & Renascença', a: ["Museus Vaticanos + Sistina (reserve! €17–22)", "Castel Sant'Angelo exterior e Lungotevere", 'Piazza Navona e Pantheon (€5)', 'Gelato artesanal em Giolitti (€2)'] },
      { t: 'Bairros & Despedida', a: ['Fontana di Trevi ao amanhecer — sem ninguém antes das 8h!', "Campo de'Fiori: mercado matinal (grátis)", 'Trastevere: bairro mais autêntico', 'Frecciarossa → Florença (1h30)'] }
    ],
    link: 'https://www.turismoroma.it'
  },
  florenca: {
    id: 'florenca', name: 'Florença', country: 'Itália', flag: '🇮🇹',
    lat: 43.769, lng: 11.255, color: '#fcd34d',
    img: U('1543429257-3eb432d6b4c4'), popupImg: U('1543429257-3eb432d6b4c4', 400),
    cpd: 95, hostel: '€20–34/noite', ref: '€9–16', temp: '~17°C',
    moeda: 'Euro (€)', transit: 'A pé + ônibus (€1,70)', sugDays: 2,
    desc: 'Florença em outubro: filas do Uffizi e David bem menores, Piazzale Michelangelo ao amanhecer com névoa do vale do Arno — uma das cenas mais bonitas da Itália.',
    hl: [['Galleria degli Uffizi','€25','Reserve com semanas!'],['David de Michelangelo','€18','Accademia — reserve sempre'],['Duomo de Florença','Grátis exterior','Fachada impressionante'],['Piazzale Michelangelo','Grátis','Névoa de outubro ao amanhecer'],['Ponte Vecchio','Grátis','Joalherias medievais'],['Oltrarno','Grátis','Bairro autêntico e acessível']],
    days: [
      { t: 'Arte & Renascença', a: ['Duomo exterior + Battistero (€5)', 'Uffizi (€25 — reserve!): Botticelli, Leonardo, Rafael', 'Ponte Vecchio e margem do Arno ao pôr do sol', 'Aperitivo no Oltrarno (€6–8 drink + petiscos grátis)'] },
      { t: 'Colinas & Despedida', a: ['Piazzale Michelangelo ao amanhecer — névoa de outubro!', 'David Accademia (€18 — reserve!)', 'San Miniato al Monte (vista grátis)', 'Frecciarossa → Roma (1h30) ou → Veneza (2h)'] }
    ],
    link: 'https://www.firenzeturismo.it'
  },
  veneza: {
    id: 'veneza', name: 'Veneza', country: 'Itália', flag: '🇮🇹',
    lat: 45.441, lng: 12.316, color: '#38bdf8',
    img: U('1516483638-8669e84440f8'), popupImg: U('1516483638-8669e84440f8', 400),
    cpd: 105, hostel: '€24–40/noite', ref: '€10–19', temp: '~16°C',
    moeda: 'Euro (€)', transit: 'Vaporetto (€9,50/dia)', sugDays: 1,
    desc: 'Veneza em outubro: turistas bem menos, ~16°C e os bacari venezianos com cichetti (€1,50) são a melhor experiência gastronômica barata.',
    hl: [['Piazza San Marco','Grátis','Outubro bem menos lotado'],['Basílica San Marco','€3','Entre de graça'],['Ponte di Rialto','Grátis','Foto ao amanhecer'],['Dorsoduro','Grátis','Bairro mais autêntico'],['Bacaro hopping','€1,50–3','Melhor experiência barata'],['Ilha de Burano','Vaporetto','Casas coloridas']],
    days: [
      { t: 'Canais & Bacari', a: ['Chegada de vaporetto — panorama dos canais', 'Piazza San Marco e Basílica (€3)', 'Rialto, Grande Canal e vielas escondidas', 'Bacaro hopping no Dorsoduro: cichetti €1,50'] }
    ],
    link: 'https://www.veneziaunica.it'
  },
  zurique: {
    id: 'zurique', name: 'Zurique', country: 'Suíça', flag: '🇨🇭',
    lat: 47.377, lng: 8.541, color: '#f43f5e',
    img: U('1530789253-347994a5dea8'), popupImg: U('1530789253-347994a5dea8', 400),
    cpd: 148, hostel: '€40–65/noite', ref: '€15–28', temp: '~13°C',
    moeda: 'CHF (Franco Suíço)', transit: 'Tram (CHF 4,40)', sugDays: 1,
    desc: 'Zurique: a mais cara da lista, mas outubro a torna especialmente bonita — o lago reflete o outono e a Altstadt medieval é encantadora. Use Lidl e Migros para economizar.',
    hl: [['Altstadt','Grátis','Centro medieval belíssimo'],['Lago Zurique','Grátis',"Outono no espelho d'água"],['Kunsthaus Zürich','CHF 26','Grande museu de arte'],['ETH Zurique','Grátis','Vista grátis da cidade'],['Lindenhügel','Grátis','Melhor vista de Zurique'],['Fondue','CHF 30–50','Experiência obrigatória na Suíça!']],
    days: [
      { t: 'Zurique em 1 dia', a: ['Altstadt: Grossmünster e Fraumünster (grátis)', 'Lago Zurique com folhagem de outono', 'Kunsthaus (CHF 26) ou ETH vista grátis', 'Fondue no Zunfthaus (CHF 35–50)'] }
    ],
    link: 'https://www.zuerich.com'
  },
  cracovia: {
    id: 'cracovia', name: 'Cracóvia', country: 'Polônia', flag: '🇵🇱',
    lat: 50.062, lng: 19.938, color: '#e879f9',
    img: U('1526129876929-5df4ce0f4e15'), popupImg: U('1526129876929-5df4ce0f4e15', 400),
    cpd: 65, hostel: '€10–20/noite', ref: '€4–9', temp: '~11°C',
    moeda: 'PLN (Zloty)', transit: 'Ônibus + bonde (PLN 4)', sugDays: 2,
    desc: 'Cracóvia: cidade medieval mais bem preservada da Europa com preços absurdamente baixos — cerveja PLN 7 ≈ €1,60, jantar completo PLN 25 ≈ €6!',
    hl: [['Rynek Główny','Grátis','Maior praça medieval da Europa'],['Castelo de Wawel','PLN 55 (~€13)','Complexo real impressionante'],['Kazimierz','Grátis','Bairro judaico histórico'],['Auschwitz-Birkenau','~€35 (tour)','Reserve com antecedência!'],['Minas Wieliczka','PLN 199 (~€46)','UNESCO — imperdível'],['Pierogis','PLN 15–22','A melhor refeição barata']],
    days: [
      { t: 'Cidade Medieval', a: ['Rynek Główny (maior praça medieval da Europa — grátis)', 'Castelo de Wawel + Catedral (~€13)', 'Kazimierz: bairro judaico, cerveja PLN 7 (€1,60!)', 'Pierogi: PLN 22 (€5) o prato'] },
      { t: 'Memória Histórica', a: ['Auschwitz-Birkenau (~€35 — reserve antes, essencial)', 'OU: Minas de Sal Wieliczka (~€46)', 'Tarde livre em Kazimierz: ruin bars poloneses'] }
    ],
    link: 'https://www.krakow.travel'
  },
  copenhague: {
    id: 'copenhague', name: 'Copenhague', country: 'Dinamarca', flag: '🇩🇰',
    lat: 55.676, lng: 12.568, color: '#22d3ee',
    img: U('1552560751-1c91fb2a4b2c'), popupImg: U('1552560751-1c91fb2a4b2c', 400),
    cpd: 135, hostel: '€32–52/noite', ref: '€13–22', temp: '~11°C',
    moeda: 'DKK (Coroa Dinamarquesa)', transit: 'Metro + bicicleta (DKK 25)', sugDays: 2,
    desc: 'Copenhague em outubro: o hygge nórdico nos cafés, Tivoli em plena temporada de Halloween e os canais de Nyhavn fotogênicos mesmo com o céu cinza nórdico.',
    hl: [['Nyhavn','Grátis','Foto mais famosa da Dinamarca'],['Tivoli Gardens','DKK 160 (~€21)','Halloween em outubro!'],['Nørrebro','Grátis','Bairro mais jovem e autêntico'],['Museu Nacional','Grátis!','Um dos melhores da Escandinávia'],['Ciclismo','DKK 100–120/dia','A cidade foi feita para bicicleta'],['Smørrebrød','DKK 65–115','Sanduíche aberto dinamarquês']],
    days: [
      { t: 'Canais & Tivoli', a: ['Nyhavn: foto obrigatória nos canais coloridos (grátis)', 'Tivoli Gardens (~€21) — outubro tem Halloween!', 'Strøget: maior rua pedestre da Europa', 'Smørrebrød no Torvehallerne Market'] },
      { t: 'Bairros & Cultura', a: ['Nørrebro: o Brooklyn de Copenhague', 'Museu Nacional Dinamarquês (GRÁTIS!)', 'Ciclismo pelos canais: DKK 100–120/dia', 'Trem → Berlim (7h30)'] }
    ],
    link: 'https://www.visitcopenhagen.com'
  }
};

/* ── Conexões de trem ── */
const TRAINS = {
  'lisboa-madrid':    { time: '~9h30 (noturno)', cost: '€39–79',  type: '🌙 Lusitânia',      tip: 'Noturno economiza hostel!' },
  'madrid-barcelona': { time: '~2h30',           cost: '€25–55',  type: '🚄 AVE',             tip: 'Reserve com antecedência' },
  'madrid-sevilha':   { time: '~2h20',           cost: '€20–50',  type: '🚄 AVE',             tip: '' },
  'barcelona-paris':  { time: '~6h30',           cost: '€49–99',  type: '🚄 TGV',             tip: 'Reserve com semanas de antecedência' },
  'barcelona-nice':   { time: '~5h',             cost: '€35–70',  type: '🚄 TGV',             tip: '' },
  'paris-amsterdam':  { time: '~3h30',           cost: '€39–89',  type: '🚄 Thalys/Eurostar', tip: 'Eurail válido' },
  'paris-berlin':     { time: '~8h',             cost: '€49–99',  type: '🚆 ICE+Thalys',      tip: '' },
  'paris-bruxelas':   { time: '~1h20',           cost: '€29–69',  type: '🚄 Eurostar/Thalys', tip: 'Mais rápido' },
  'bruxelas-amsterdam':{ time: '~1h50',          cost: '€25–55',  type: '🚄 Thalys',          tip: '' },
  'amsterdam-berlim': { time: '~6h',             cost: '€39–79',  type: '🚆 IC Berlin',       tip: '' },
  'berlim-praga':     { time: '~4h30',           cost: '€25–49',  type: '🚆 EC Eurocity',     tip: '' },
  'berlim-copenhague':{ time: '~7h30',           cost: '€39–79',  type: '🚆 IC',              tip: '' },
  'berlim-munich':    { time: '~4h',             cost: '€29–69',  type: '🚄 ICE',             tip: '' },
  'munich-viena':     { time: '~4h',             cost: '€29–59',  type: '🚄 Railjet',         tip: '' },
  'munich-zurique':   { time: '~3h30',           cost: '€25–55',  type: '🚄 EC',              tip: '' },
  'viena-budapeste':  { time: '~2h40',           cost: '€19–39',  type: '🚄 Railjet',         tip: '' },
  'viena-praga':      { time: '~4h',             cost: '€25–49',  type: '🚄 Railjet',         tip: '' },
  'praga-viena':      { time: '~4h',             cost: '€25–49',  type: '🚄 Railjet',         tip: '' },
  'praga-cracovia':   { time: '~7h',             cost: '€25–49',  type: '🚆 RegioJet',        tip: '' },
  'budapeste-viena':  { time: '~2h40',           cost: '€19–39',  type: '🚄 Railjet',         tip: '' },
  'roma-florenca':    { time: '~1h30',           cost: '€19–39',  type: '🚄 Frecciarossa',    tip: '' },
  'florenca-veneza':  { time: '~2h',             cost: '€15–35',  type: '🚄 Frecciarossa',    tip: '' },
  'florenca-roma':    { time: '~1h30',           cost: '€19–39',  type: '🚄 Frecciarossa',    tip: '' },
  'veneza-florenca':  { time: '~2h',             cost: '€15–35',  type: '🚄 Frecciarossa',    tip: '' },
  'nice-roma':        { time: '~5h',             cost: '€39–79',  type: '🚆 TGV+IC',          tip: '' },
  'nice-barcelona':   { time: '~5h',             cost: '€35–70',  type: '🚄 TGV',             tip: '' },
  'sevilha-madrid':   { time: '~2h20',           cost: '€20–50',  type: '🚄 AVE',             tip: '' },
  'copenhague-berlim':{ time: '~7h30',           cost: '€39–79',  type: '🚆 IC',              tip: '' },
  'cracovia-viena':   { time: '~7h',             cost: '€29–59',  type: '🚆 EuroNight',       tip: 'Trem noturno!' },
  'zurique-paris':    { time: '~4h',             cost: '€35–79',  type: '🚄 TGV',             tip: '' },
};

/* ── Dicas essenciais ── */
const TIPS = [
  { icon: '🎒', color: 'rgba(78,203,141,0.15)',   title: 'Bagagem de mão',        text: 'Vá com mochila de 40–50L como bagagem de mão. Economiza taxas de despacho (~€50–80 por voo) e não perde tempo no aeroporto. Ryanair/EasyJet aceitam 40x20x25cm na cabine.' },
  { icon: '💳', color: 'rgba(107,159,255,0.15)',  title: 'Cartão Wise / Nomad',   text: 'Abra antes de viajar. Sem IOF (economize 5,38%), câmbio na cotação real, aceito em toda Europa. Em caixas eletrônicos europeus, sempre escolha "debitar em moeda local".' },
  { icon: '📱', color: 'rgba(192,132,252,0.15)',  title: 'eSIM europeu',          text: 'Compre um eSIM antes de sair — Airalo ou Holafly têm planos de 30 dias com dados em toda Europa por ~€20. Não precisa trocar o chip físico.' },
  { icon: '🏥', color: 'rgba(239,68,68,0.15)',    title: 'Seguro viagem',         text: 'ESSENCIAL. Mínimo US$30.000 cobertura médica. Primetravel ou Assistcard cobram ~€50 por mês. Salva de gastos de €5.000+ em emergências médicas.' },
  { icon: '🏨', color: 'rgba(232,201,122,0.15)', title: 'Hostels em outubro',    text: 'Outubro = baixa temporada = 20–30% mais barato. Reserve no Hostelworld ou Booking.com. Dormitórios 4–6 camas são confortáveis e ótimos para conhecer viajantes.' },
  { icon: '🍽️', color: 'rgba(244,162,97,0.15)', title: 'Comer barato',          text: 'Mercados locais, supermercados (Lidl, Aldi, Carrefour) para café e almoço. "Menú del día" na Espanha = prato+bebida+sobremesa por €10–12. Piqueniques no parque são ótimos!' },
  { icon: '🚂', color: 'rgba(34,211,238,0.15)',   title: 'Eurail Pass',           text: 'Para não-europeus, o Eurail Global Pass é obrigatório. 10 viagens/2meses custa ~€385 (adulto) ou €290 (youth <27). Compre antes de sair — mais barato e prático.' },
  { icon: '🗺️', color: 'rgba(78,203,141,0.15)',  title: 'Aplicativos essenciais', text: 'Maps.me (offline), Rome2Rio (conexões), Hostelworld, Trainline (reservas de trem), XE Currency, Duolingo (frases básicas). Baixe mapas offline antes de sair do hotel!' },
  { icon: '🌧️', color: 'rgba(107,159,255,0.15)', title: 'Outubro na Europa',     text: 'Temperaturas de 10–20°C segundo o destino. Leve 1 casaco impermeável, camadas leves e roupas para dias mais frescos. Outubro tem mais chuva que verão — guarda-chuva compacto ajuda.' },
  { icon: '💡', color: 'rgba(232,201,122,0.15)', title: 'Reservas essenciais',   text: 'Sagrada Família, Casa de Anne Frank, Museus Vaticanos e Auschwitz: reserve MESES antes — esgotam. Louvre, Coliseu: semanas antes. Os demais: dias antes ou na hora.' },
];

/* ── Checklist de viagem ── */
const CHECKLIST = [
  { cat: '📄 Documentos' },
  { id: 'cl-passaporte', text: 'Passaporte válido (mín. 6 meses após retorno)' },
  { id: 'cl-visto',      text: 'Visto Schengen solicitado e aprovado' },
  { id: 'cl-seguro',     text: 'Seguro viagem contratado' },
  { id: 'cl-foto-doc',   text: 'Fotos dos documentos salvas na nuvem' },
  { id: 'cl-cartao',     text: 'Cartão Wise/Nomad aberto e ativo' },
  { id: 'cl-eurail',     text: 'Eurail Pass comprado' },
  { cat: '📱 Tecnologia' },
  { id: 'cl-esim',       text: 'eSIM europeu ativado (Airalo/Holafly)' },
  { id: 'cl-adaptor',    text: 'Adaptador de tomada (Tipo C europeu)' },
  { id: 'cl-powerbank',  text: 'Power bank carregado e testado' },
  { id: 'cl-app',        text: 'Aplicativos offline instalados (Maps.me)' },
  { id: 'cl-backup',     text: 'Backup automático de fotos configurado' },
  { cat: '🎒 Mochila' },
  { id: 'cl-lock',       text: 'Cadeado TSA para a mochila' },
  { id: 'cl-bag',        text: 'Mochila testada (≤10kg com tudo)' },
  { id: 'cl-roupas',     text: 'Roupas para clima 10–20°C' },
  { id: 'cl-capa',       text: 'Capa de chuva / casaco impermeável' },
  { id: 'cl-kit',        text: 'Kit primeiros socorros (analgésico, band-aid)' },
  { cat: '🏨 Reservas' },
  { id: 'cl-voos',       text: 'Passagens aéreas confirmadas' },
  { id: 'cl-hostels',    text: 'Primeira e última noite reservadas' },
  { id: 'cl-sagrada',    text: 'Sagrada Família reservada (se for a Barcelona)' },
  { id: 'cl-frank',      text: 'Casa de Anne Frank reservada (se for a Amsterdam)' },
  { id: 'cl-vaticano',   text: 'Museus Vaticanos reservados (se for a Roma)' },
  { cat: '💰 Finanças' },
  { id: 'cl-aviso',      text: 'Avisou o banco sobre viagem internacional' },
  { id: 'cl-euro',       text: '€150–200 em espécie separados' },
  { id: 'cl-orcamento',  text: 'Orçamento diário definido' },
];

/* ── Itens da mochila ── */
const PACK_ITEMS = [
  { cat: '👕 Roupas', items: [
    { id: 'p-camiseta',   name: 'Camisetas (×4)',        weight: 0.60 },
    { id: 'p-calca',      name: 'Calças (×2)',           weight: 0.80 },
    { id: 'p-shorts',     name: 'Shorts / calça leve',  weight: 0.30 },
    { id: 'p-agasalho',   name: 'Moletom / fleece',     weight: 0.50 },
    { id: 'p-casaco',     name: 'Casaco impermeável',   weight: 0.60 },
    { id: 'p-meia',       name: 'Meias (×6 pares)',     weight: 0.30 },
    { id: 'p-cueca',      name: 'Cuecas (×6)',          weight: 0.20 },
    { id: 'p-tenis',      name: 'Tênis confortável',    weight: 0.80 },
    { id: 'p-sandalia',   name: 'Sandália leve',        weight: 0.40 },
    { id: 'p-gorro',      name: 'Gorro / cachecol',     weight: 0.20 },
  ]},
  { cat: '🧴 Higiene', items: [
    { id: 'p-shampoo',    name: 'Shampoo sólido',              weight: 0.10 },
    { id: 'p-desodorante',name: 'Desodorante (sólido)',        weight: 0.08 },
    { id: 'p-escova',     name: 'Escova + pasta dental',       weight: 0.15 },
    { id: 'p-barbeador',  name: 'Barbeador',                   weight: 0.10 },
    { id: 'p-protetor',   name: 'Protetor solar FPS 30+',      weight: 0.10 },
    { id: 'p-kit-med',    name: 'Kit medicamentos',            weight: 0.20 },
    { id: 'p-absorvente', name: 'Absorvente / higiene fem.',   weight: 0.10 },
  ]},
  { cat: '💻 Eletrônicos', items: [
    { id: 'p-cel',        name: 'Celular + carregador',    weight: 0.35 },
    { id: 'p-powerbank',  name: 'Power bank 20.000mAh',   weight: 0.45 },
    { id: 'p-adaptor',    name: 'Adaptador tomada Tipo C', weight: 0.10 },
    { id: 'p-fone',       name: 'Fone de ouvido',         weight: 0.15 },
    { id: 'p-notebook',   name: 'Notebook (opcional)',     weight: 1.50 },
    { id: 'p-camera',     name: 'Câmera (opcional)',       weight: 0.40 },
  ]},
  { cat: '🎒 Acessórios', items: [
    { id: 'p-cadeado',    name: 'Cadeado TSA',              weight: 0.10 },
    { id: 'p-toalha',     name: 'Toalha de microfibra',     weight: 0.20 },
    { id: 'p-garrafa',    name: 'Garrafa de água reutilizável', weight: 0.25 },
    { id: 'p-capinha',    name: 'Capa de chuva mochila',    weight: 0.15 },
    { id: 'p-saco',       name: 'Saco de compressão',       weight: 0.10 },
    { id: 'p-cintura',    name: 'Pochete tiracolo',         weight: 0.12 },
    { id: 'p-guarda',     name: 'Guarda-chuva compacto',    weight: 0.25 },
  ]},
];

/* ── Frases em vários idiomas ── */
const PHRASES = {
  basico: [
    { pt: 'Olá / Bom dia',     es: 'Hola / Buenos días',       fr: 'Bonjour',                de: 'Hallo / Guten Morgen',    it: 'Ciao / Buongiorno',     nl: 'Hallo / Goedemorgen',        pl: 'Cześć / Dzień dobry',    cs: 'Ahoj / Dobré ráno',  hu: 'Szia / Jó reggelt' },
    { pt: 'Obrigado(a)',        es: 'Gracias',                  fr: 'Merci',                  de: 'Danke',                    it: 'Grazie',                nl: 'Dank je',                    pl: 'Dziękuję',               cs: 'Děkuji',             hu: 'Köszönöm' },
    { pt: 'Por favor',          es: 'Por favor',                fr: "S'il vous plaît",        de: 'Bitte',                    it: 'Per favore',            nl: 'Alsjeblieft',                pl: 'Proszę',                 cs: 'Prosím',             hu: 'Kérem' },
    { pt: 'Desculpe',           es: 'Perdón',                   fr: 'Pardon',                 de: 'Entschuldigung',           it: 'Scusi',                 nl: 'Sorry',                      pl: 'Przepraszam',            cs: 'Promiňte',           hu: 'Elnézést' },
    { pt: 'Sim / Não',          es: 'Sí / No',                  fr: 'Oui / Non',              de: 'Ja / Nein',                it: 'Sì / No',               nl: 'Ja / Nee',                   pl: 'Tak / Nie',              cs: 'Ano / Ne',           hu: 'Igen / Nem' },
    { pt: 'Não entendo',        es: 'No entiendo',              fr: 'Je ne comprends pas',    de: 'Ich verstehe nicht',       it: 'Non capisco',           nl: 'Ik begrijp het niet',        pl: 'Nie rozumiem',           cs: 'Nerozumím',          hu: 'Nem értem' },
  ],
  comida: [
    { pt: 'A conta, por favor', es: 'La cuenta, por favor',    fr: "L'addition, s'il vous plaît", de: 'Die Rechnung, bitte',  it: 'Il conto, per favore', nl: 'De rekening, alsjeblieft',   pl: 'Rachunek, proszę',       cs: 'Účet, prosím',       hu: 'A számlát kérem' },
    { pt: 'Está delicioso!',    es: '¡Está delicioso!',         fr: "C'est délicieux!",       de: 'Das ist lecker!',          it: 'È delizioso!',          nl: 'Het is lekker!',             pl: 'Jest pyszne!',           cs: 'Je to výborné!',     hu: 'Finom!' },
    { pt: 'Sou vegetariano(a)', es: 'Soy vegetariano/a',       fr: 'Je suis végétarien(ne)', de: 'Ich bin Vegetarier',       it: 'Sono vegetariano/a',    nl: 'Ik ben vegetariër',          pl: 'Jestem wegetarianinem',  cs: 'Jsem vegetarián',    hu: 'Vegetáriánus vagyok' },
    { pt: 'Uma cerveja, por favor', es: 'Una cerveza, por favor', fr: "Une bière, s'il vous plaît", de: 'Ein Bier, bitte',   it: 'Una birra, per favore', nl: 'Een biertje, alsjeblieft',   pl: 'Jedno piwo, proszę',     cs: 'Jedno pivo, prosím', hu: 'Egy sört kérek' },
    { pt: 'Água, por favor',    es: 'Agua, por favor',          fr: "De l'eau, s'il vous plaît", de: 'Wasser, bitte',         it: 'Acqua, per favore',     nl: 'Water, alsjeblieft',         pl: 'Wodę, proszę',           cs: 'Vodu, prosím',       hu: 'Vizet kérek' },
  ],
  transporte: [
    { pt: 'Onde fica...?',      es: '¿Dónde está...?',          fr: 'Où est...?',             de: 'Wo ist...?',               it: "Dov'è...?",             nl: 'Waar is...?',                pl: 'Gdzie jest...?',          cs: 'Kde je...?',         hu: 'Hol van...?' },
    { pt: 'Estação de trem',    es: 'Estación de tren',         fr: 'Gare',                   de: 'Bahnhof',                  it: 'Stazione',              nl: 'Station',                    pl: 'Dworzec',                cs: 'Nádraží',            hu: 'Vasútállomás' },
    { pt: 'Aeroporto',          es: 'Aeropuerto',               fr: 'Aéroport',               de: 'Flughafen',                it: 'Aeroporto',             nl: 'Luchthaven',                 pl: 'Lotnisko',               cs: 'Letiště',            hu: 'Repülőtér' },
    { pt: 'Um bilhete para…',   es: 'Un billete para…',         fr: 'Un billet pour…',        de: 'Eine Fahrkarte nach…',     it: 'Un biglietto per…',     nl: 'Een kaartje naar…',          pl: 'Bilet do…',              cs: 'Jízdenku do…',       hu: 'Egy jegyet…' },
    { pt: 'Quanto custa?',      es: '¿Cuánto cuesta?',          fr: 'Combien ça coûte?',      de: 'Wie viel kostet das?',     it: 'Quanto costa?',         nl: 'Hoeveel kost het?',          pl: 'Ile to kosztuje?',       cs: 'Kolik to stojí?',    hu: 'Mennyibe kerül?' },
  ],
  emergencia: [
    { pt: 'Preciso de ajuda!',  es: '¡Necesito ayuda!',         fr: "J'ai besoin d'aide!",    de: 'Ich brauche Hilfe!',       it: 'Ho bisogno di aiuto!',  nl: 'Ik heb hulp nodig!',         pl: 'Potrzebuję pomocy!',     cs: 'Potřebuji pomoc!',   hu: 'Segítség kell!' },
    { pt: 'Chame a polícia!',   es: '¡Llame a la policía!',     fr: 'Appelez la police!',     de: 'Rufen Sie die Polizei!',   it: 'Chiami la polizia!',    nl: 'Bel de politie!',            pl: 'Zadzwońcie na policję!', cs: 'Zavolejte policii!', hu: 'Hívja a rendőrséget!' },
    { pt: 'Hospital',           es: 'Hospital',                 fr: 'Hôpital',                de: 'Krankenhaus',              it: 'Ospedale',              nl: 'Ziekenhuis',                 pl: 'Szpital',                cs: 'Nemocnice',          hu: 'Kórház' },
    { pt: 'Fui roubado(a)',     es: 'Me han robado',            fr: "On m'a volé",            de: 'Ich wurde bestohlen',      it: 'Sono stato derubato',   nl: 'Ik ben bestolen',            pl: 'Zostałem okradziony',    cs: 'Byl jsem okraden',   hu: 'Megloptak' },
  ],
};

const LANG_NAMES = {
  es: 'Espanhol 🇪🇸',
  fr: 'Francês 🇫🇷',
  de: 'Alemão 🇩🇪',
  it: 'Italiano 🇮🇹',
  nl: 'Holandês 🇳🇱',
  pl: 'Polonês 🇵🇱',
  cs: 'Tcheco 🇨🇿',
  hu: 'Húngaro 🇭🇺',
};

/* ── Taxas de câmbio (referência 2025) ── */
const RATES = {
  EUR: { flag: '🇪🇺', name: 'Euro',                  brl: 5.35 },
  GBP: { flag: '🇬🇧', name: 'Libra',                 brl: 6.75 },
  CZK: { flag: '🇨🇿', name: 'Coroa Tcheca',          brl: 0.24 },
  PLN: { flag: '🇵🇱', name: 'Zloty',                 brl: 1.35 },
  HUF: { flag: '🇭🇺', name: 'Forint',                brl: 0.015 },
  CHF: { flag: '🇨🇭', name: 'Franco Suíço',          brl: 6.05 },
  DKK: { flag: '🇩🇰', name: 'Coroa Dinamarquesa',    brl: 0.77 },
  SEK: { flag: '🇸🇪', name: 'Coroa Sueca',           brl: 0.51 },
  NOK: { flag: '🇳🇴', name: 'Coroa Norueguesa',      brl: 0.50 },
};
