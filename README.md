# Roteiro Europa — Orçamento Sync Fix

## Correção

O card do roteiro que antes mostrava **Custo base** agora acompanha o mesmo total do **Orçamento conectado**.

Antes:
- Roteiro mostrava custo antigo por cidade/dia, exemplo `€1.406`
- Orçamento mostrava o total real conectado, exemplo `€718`

Agora:
- O roteiro mostra **Orçamento**
- O valor vem de:
  - veículos preenchidos
  - hospedagens preenchidas
  - comida automática
  - turismo automático
  - extras manuais

Ou seja, se o orçamento conectado estiver em `€718`, o painel do roteiro também mostra `€718`.

## Publicar

Envie os arquivos para o GitHub Pages e acesse:

`https://vitorhfonseca.github.io/Roteiro-Europa/?v=orcamento-sync-fix-1`

Se aparecer versão antiga, use Ctrl + F5 ou limpe o service worker.
