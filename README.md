# Roteiro Europa — Login ADM Corrigido

## Correção

A versão anterior não importava corretamente a função que cria os usuários padrão.
Esta versão corrige isso e também adiciona fallback para login do ADM caso exista LocalStorage antigo/corrompido.

## Login ADM

Usuário:

`admin`

Senha:

`Admin@2026!`

## Usuário comum

Usuário:

`usuario`

Senha:

`Usuario@2026!`

## Publicar

Envie todos os arquivos para a raiz do GitHub Pages e acesse:

`https://vitorhfonseca.github.io/Roteiro-Europa/?v=admin-login-fix-2`

Se ainda carregar versão antiga:

1. Use Ctrl + F5.
2. Abra em aba anônima.
3. Ou limpe DevTools > Application > Service Workers > Unregister.
