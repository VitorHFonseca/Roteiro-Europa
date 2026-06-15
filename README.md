# 🍂 Mochilão Europa — Outubro

> Roteiro interativo e completo para mochilão pela Europa em outubro 2025

👉 **[Acessar agora](https://vitorhfonseca.github.io/Roteiro-Europa/)**

---

## ✨ Funcionalidades

| Seção | Descrição |
|-------|-----------|
| 📅 Roteiro | Dia a dia interativo com check, notas e fotos |
| 🗺️ Mapa | SVG interativo da Europa com marcadores clicáveis |
| ✏️ Montar | Crie seu próprio roteiro com cidades e dias |
| 🌍 Países | Guia detalhado de cada destino |
| 🚆 Trens | Conexões Eurail com tempos e preços |
| 💶 Orçamento | Calculado automaticamente pelo seu roteiro |
| 💡 Dicas | Essenciais para o mochileiro experiente |
| ✅ Checklist | Lista completa para não esquecer nada |
| 🎒 Mochila | Calculadora de peso por categoria |
| 💱 Moedas | Conversor BRL → EUR/GBP/CZK/PLN/HUF… |
| 🗣️ Frases | 8 idiomas: 🇪🇸🇫🇷🇩🇪🇮🇹🇳🇱🇵🇱🇨🇿🇭🇺 |
| 📖 Diário | Registre memórias da viagem |
| 🤖 IA | Dicas personalizadas por cidade e época |

---

## 📱 Instalar no celular (PWA)

1. Acesse pelo Chrome ou Safari
2. Toque em **"Adicionar à tela inicial"**
3. Use como um app nativo offline!

---

## 📁 Estrutura do projeto

```
├── index.html          ← App principal
├── manifest.json       ← PWA (instalável no celular)
├── sw.js               ← Service Worker (modo offline)
├── css/
│   └── styles.css      ← Todos os estilos
└── js/
    ├── data.js         ← Dados das cidades, trens, dicas
    └── app.js          ← Lógica e interatividade
```

---

## 🤖 Dicas com IA (Anthropic Claude)

A função de IA gera dicas personalizadas para cada cidade do seu roteiro.

1. Vá em ✏️ **Montar** → clique em **⚙️ API Key**
2. Insira sua chave da Anthropic
3. Confirme o roteiro e clique **✨ Gerar com IA**

Obtenha sua key em [console.anthropic.com](https://console.anthropic.com)

---

## 🛠️ Tecnologias

- **HTML5 / CSS3 / JavaScript** puro (sem frameworks)
- **Fontes:** Google Fonts (Playfair Display, DM Sans, DM Mono)
- **Imagens:** Unsplash
- **Mapas:** SVG customizado (sem dependência externa)
- **Storage:** localStorage (100% offline, nenhum servidor)
- **PWA:** Service Worker + manifest.json

---

## 🚀 Deploy no GitHub Pages

1. Fork ou clone o repositório
2. Vá em **Settings → Pages**
3. Selecione branch `main`, pasta `/root`
4. Aguarde ~1 min e acesse `https://SEU-USUARIO.github.io/Roteiro-Europa/`

---

Made with ❤️ by [VitorHFonseca](https://github.com/VitorHFonseca)
