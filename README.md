# Mochilão Europa

Aplicativo estático para GitHub Pages, feito em HTML, CSS e JavaScript puro.

## Recursos

- Dashboard da viagem
- Planejador de roteiro por cidades
- Mapa com Leaflet + OpenStreetMap
- Controle de orçamento
- Checklist
- Diário de viagem
- Exportação PDF com jsPDF
- Backup/importação JSON
- PWA com service worker
- Dados 100% locais no navegador via LocalStorage

## Como publicar no GitHub Pages

1. Crie um repositório no GitHub.
2. Envie todos os arquivos deste ZIP para a raiz do repositório.
3. Vá em **Settings > Pages**.
4. Em **Build and deployment**, selecione:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/root`
5. Salve e aguarde o link do GitHub Pages.

## Observações

- O app não usa backend.
- O login foi removido porque o modo escolhido foi offline/local.
- O mapa usa Leaflet via CDN e tiles do OpenStreetMap.
- A exportação PDF usa jsPDF via CDN.
- Os dados ficam apenas no navegador onde o usuário usa o app.
