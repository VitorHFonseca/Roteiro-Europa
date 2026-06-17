export const EUROPE_CITIES = [
  { name:"Lisboa", country:"Portugal", lat:38.7223, lng:-9.1393 },
  { name:"Porto", country:"Portugal", lat:41.1579, lng:-8.6291 },
  { name:"Madrid", country:"Espanha", lat:40.4168, lng:-3.7038 },
  { name:"Barcelona", country:"Espanha", lat:41.3874, lng:2.1686 },
  { name:"Paris", country:"França", lat:48.8566, lng:2.3522 },
  { name:"Londres", country:"Reino Unido", lat:51.5072, lng:-0.1276 },
  { name:"Amsterdã", country:"Holanda", lat:52.3676, lng:4.9041 },
  { name:"Bruxelas", country:"Bélgica", lat:50.8503, lng:4.3517 },
  { name:"Berlim", country:"Alemanha", lat:52.52, lng:13.405 },
  { name:"Munique", country:"Alemanha", lat:48.1351, lng:11.582 },
  { name:"Praga", country:"República Tcheca", lat:50.0755, lng:14.4378 },
  { name:"Viena", country:"Áustria", lat:48.2082, lng:16.3738 },
  { name:"Budapeste", country:"Hungria", lat:47.4979, lng:19.0402 },
  { name:"Roma", country:"Itália", lat:41.9028, lng:12.4964 },
  { name:"Florença", country:"Itália", lat:43.7696, lng:11.2558 },
  { name:"Veneza", country:"Itália", lat:45.4408, lng:12.3155 },
  { name:"Milão", country:"Itália", lat:45.4642, lng:9.1900 },
  { name:"Zurique", country:"Suíça", lat:47.3769, lng:8.5417 },
  { name:"Copenhague", country:"Dinamarca", lat:55.6761, lng:12.5683 },
  { name:"Estocolmo", country:"Suécia", lat:59.3293, lng:18.0686 },
  { name:"Oslo", country:"Noruega", lat:59.9139, lng:10.7522 },
  { name:"Dublin", country:"Irlanda", lat:53.3498, lng:-6.2603 },
  { name:"Atenas", country:"Grécia", lat:37.9838, lng:23.7275 },
  { name:"Istambul", country:"Turquia", lat:41.0082, lng:28.9784 }
];

export function findKnownCity(name){
  const normalized = String(name || "").trim().toLowerCase();
  return EUROPE_CITIES.find(city => city.name.toLowerCase() === normalized);
}
