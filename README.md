# Roteiro Europa Online IA

Versão nova baseada no visual do arquivo `mochilao-europa.html`, com estrutura melhorada, login, módulos, visual premium e IA online opcional.

## O que inclui

- Login/cadastro local
- Hero visual estilo "Outono na Europa"
- Navegação horizontal igual ao modelo original
- Roteiro dia a dia
- Mapa estilizado interativo
- Montador de roteiro
- Recomendações com IA
- Países
- Trens
- Orçamento
- Dicas
- Checklist
- Mochila
- Moedas
- Frases úteis
- Diário
- PWA
- Estrutura modular
- API serverless para IA em `/api/ai.js`

## Publicar só no GitHub Pages

1. Extraia o ZIP.
2. Envie todos os arquivos para a raiz do repositório `Roteiro-Europa`.
3. Acesse:
   `https://vitorhfonseca.github.io/Roteiro-Europa/?v=online-ia-1`

No GitHub Pages o app funciona como site estático. A IA usa fallback local se nenhum endpoint for configurado.

## Ativar IA online real

O GitHub Pages não executa backend. Para a IA real, use a pasta `api/` em um deploy Vercel.

### Passo a passo

1. Crie um projeto na Vercel.
2. Envie este projeto completo para a Vercel.
3. Em Environment Variables, adicione:
   `OPENAI_API_KEY=sua_chave`
4. Faça deploy.
5. Copie a URL:
   `https://seu-projeto.vercel.app/api/ai`
6. No app, vá em **Online > Endpoint de IA** e cole a URL.

## Segurança

Não coloque chave da OpenAI no JavaScript do navegador. Use sempre `/api/ai.js` ou outro backend/proxy seguro.

## Cache

Se a versão antiga aparecer:
- Use Ctrl + F5.
- Abra em aba anônima.
- Ou DevTools > Application > Service Workers > Unregister.
