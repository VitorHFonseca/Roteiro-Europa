# Roteiro Europa — Viagem Pro

## Análise do que faltava para uso real em viagem

Esta versão melhora os pontos essenciais para depender do app durante a viagem:

1. Botão **Sair** visível depois do login
2. Central da viagem com próximo dia/foco
3. Status online/offline
4. Backup JSON para baixar no celular
5. Importação de backup
6. Envio rápido para nuvem
7. Bloco de emergência offline
8. Documentos importantes
9. Base/hospedagem atual
10. Datas de início/fim da viagem
11. Correção do SQL para `pgcrypto` no schema `extensions`

## SQL obrigatório

Rode ou atualize com:

`SUPABASE-AUTH-CUSTOM.sql`

Se já rodou antes e teve erro `gen_salt`, esta versão já vem corrigida com:

`create extension if not exists pgcrypto with schema extensions`

e funções com:

`set search_path = public, extensions`

## Publicar

Envie todos os arquivos para o GitHub Pages e acesse:

`https://vitorhfonseca.github.io/Roteiro-Europa/?v=viagem-pro-1`

## Uso recomendado na viagem

- Antes de sair: preencha Central da Viagem
- Baixe um backup JSON
- Envie para nuvem
- Use checklist/mochila offline
- Salve endereço da hospedagem atual e seguro viagem
- Se o mapa não carregar, o roteiro e dados continuam funcionando
