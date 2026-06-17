import { escapeHTML } from "../core/dom.js";

let map;
let layerGroup;

export function renderMapView(state){
  const cityList = state.cities.map((city,index)=>`
    <li class="list-item">
      <div>
        <strong>${index+1}. ${escapeHTML(city.name)}</strong>
        <p class="note">${escapeHTML(city.country || "")}</p>
      </div>
      <span class="badge">${city.lat?.toFixed?.(2) || "?"}, ${city.lng?.toFixed?.(2) || "?"}</span>
    </li>
  `).join("");

  return `
    <div class="grid cols-3">
      <div class="card" style="grid-column:span 2">
        <h2>Mapa do roteiro</h2>
        <p class="note">Marcadores e linha do roteiro são gerados a partir das cidades adicionadas.</p>
        <div id="routeMap" class="map"></div>
      </div>
      <div class="card">
        <h2>Ordem de visita</h2>
        <ul class="list">${cityList || `<li class="note">Adicione cidades no roteiro.</li>`}</ul>
      </div>
    </div>
  `;
}

export function mountMap(state){
  const el = document.getElementById("routeMap");
  if(!el) return;

  setTimeout(() => {
    if(!window.L){
      el.innerHTML = "<p style='padding:16px'>Leaflet não carregou. Verifique sua conexão para usar o mapa online.</p>";
      return;
    }

    if(map){
      map.remove();
      map = null;
    }

    map = L.map(el).setView([50, 10], 4);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      attribution: "&copy; OpenStreetMap"
    }).addTo(map);

    layerGroup = L.layerGroup().addTo(map);

    const points = state.cities
      .filter(c => Number.isFinite(Number(c.lat)) && Number.isFinite(Number(c.lng)))
      .map(c => [Number(c.lat), Number(c.lng), c]);

    points.forEach(([lat,lng,city], index) => {
      L.marker([lat,lng]).addTo(layerGroup)
        .bindPopup(`<strong>${index+1}. ${escapeHTML(city.name)}</strong><br>${escapeHTML(city.country || "")}`);
    });

    if(points.length > 1){
      const line = L.polyline(points.map(p => [p[0], p[1]]), { weight: 4 }).addTo(layerGroup);
      map.fitBounds(line.getBounds(), { padding: [30,30] });
    }else if(points.length === 1){
      map.setView([points[0][0], points[0][1]], 9);
    }
  }, 80);
}
