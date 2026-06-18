# Roteiro Europa — Contas no Banco

## Mudança principal

As contas agora saíram do `localStorage` e passaram para o banco/Supabase:

- Login principal: **Supabase Auth**
- Perfis, roles e status: tabela **public.profiles**
- Dados da viagem: tabela **public.trip_states**
- Primeiro cadastro confirmado vira **ADM**
- Novos cadastros entram como **usuário comum**
- ADM lista usuários do banco
- ADM bloqueia/desbloqueia usuários no banco
- ADM altera perfil usuário/ADM no banco
- ADM exclui/bloqueia conta dentro do app via `status = deleted`
- Reset de senha agora envia e-mail de redefinição pelo Supabase

## Passo obrigatório no Supabase

Antes de usar esta versão, rode o arquivo SQL:

`SUPABASE-CONTAS-NO-BANCO.sql`

No Supabase:

1. SQL Editor
2. New query
3. Cole o SQL inteiro
4. Run

## Como criar ADM

1. Publique o app.
2. Abra o app.
3. Clique em **Criar conta**.
4. Cadastre seu e-mail e senha.
5. Se o Supabase pedir confirmação, confirme o e-mail.
6. Entre com esse e-mail.

O primeiro usuário confirmado vira ADM automaticamente.

## Publicar

Envie todos os arquivos para a raiz do GitHub Pages e acesse:

`https://vitorhfonseca.github.io/Roteiro-Europa/?v=contas-no-banco-1`

## Segurança

A `publishable key` do Supabase é pública e pode ficar no frontend com RLS ativado.

Não coloque `service_role` no HTML/JS.

Para excluir usuários diretamente do `auth.users`, seria necessário backend seguro com `service_role`. Esta versão faz exclusão lógica no app (`status = deleted`), que impede o usuário de entrar no app.
