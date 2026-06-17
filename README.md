# Roteiro Europa — Segurança + Admin

## O que mudou

- Primeiro usuário cadastrado vira **ADM**
- ADM tem aba **Admin**
- ADM gerencia usuários locais:
  - criar usuário
  - bloquear/desbloquear
  - alterar perfil user/admin
  - resetar senha
- Senhas locais migradas para hash SHA-256 com salt
- Chaves e endpoints aparecem mascarados como `••••••`
- Botões para testar:
  - Supabase
  - IA
  - Todas as conexões
- ADM não cria nem edita roteiro, veículos, hospedagens ou orçamento
- ADM só administra usuários e conexões
- Usuários comuns continuam editando a viagem normalmente

## Segurança importante

A chave `publishable`/`anon` do Supabase é pública por natureza e pode ficar no frontend com RLS ativado. Nunca coloque `service_role` ou segredo real no navegador.

Para segredos de verdade, use backend/Vercel.

## Publicar

Envie todos os arquivos para a raiz do GitHub Pages e acesse:

`https://vitorhfonseca.github.io/Roteiro-Europa/?v=seguranca-admin-1`

Se aparecer versão antiga, use Ctrl + F5 ou limpe o service worker.
