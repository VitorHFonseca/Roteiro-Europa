# Roteiro Europa — Login por Nome + Senha

## Mudança da tela de login

Agora não aparece e-mail para o usuário.

Cadastro:

- Nome
- Senha
- Confirmar senha

Login:

- Nome
- Senha

O app cria internamente um e-mail técnico para o Supabase Auth, mas o usuário não vê isso.

## Troca de senha

Na tela de login existe o botão **Trocar senha**.

Ele mostra a mensagem:

> Para trocar sua senha, entre em contato com o Vitor. A troca será feita pela conta ADM.

No painel ADM, o botão **Trocar senha** permite definir uma nova senha para o usuário.

## SQL obrigatório

Rode o arquivo abaixo no Supabase:

`SUPABASE-USUARIO-SENHA.sql`

Caminho:

Supabase > SQL Editor > New query > colar SQL > Run

## Primeiro ADM

O primeiro usuário criado/confirmado vira ADM automaticamente.

## Publicar

Envie os arquivos para o GitHub Pages e acesse:

`https://vitorhfonseca.github.io/Roteiro-Europa/?v=usuario-senha-banco-1`
