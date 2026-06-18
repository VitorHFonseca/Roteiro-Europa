# Roteiro Europa — Auth Custom no Banco

## Por que esta versão existe

A versão anterior usava Supabase Auth por trás e o Supabase ainda disparava fluxo de e-mail.
Isso causava erros como:

`email rate limit exceeded`

Esta versão remove totalmente o Supabase Auth/email.

## Agora é assim

- Cadastro: Nome + Senha + Confirmar senha
- Login: Nome + Senha
- Usuários ficam na tabela `app_users`
- Senhas são salvas como hash `crypt()` no banco
- Sessões ficam na tabela `app_sessions`
- Dados da viagem ficam na tabela `app_states`
- Primeiro usuário cadastrado vira ADM
- Próximos usuários viram comuns
- ADM pode criar, bloquear, excluir e trocar senha

## SQL obrigatório

Rode no Supabase:

`SUPABASE-AUTH-CUSTOM.sql`

Caminho:

Supabase > SQL Editor > New query > colar SQL > Run

## Publicar

Envie os arquivos para o GitHub Pages e acesse:

`https://vitorhfonseca.github.io/Roteiro-Europa/?v=auth-custom-banco-1`

## Troca de senha

Usuário comum clica em **Trocar senha** e vê a orientação para falar com Vitor/ADM.

No painel ADM, use **Trocar senha** no usuário desejado.
