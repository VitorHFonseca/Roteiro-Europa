# Roteiro Europa — Principal + Solicitações

## Nova regra do app

Esta versão implementa a arquitetura combinada:

- ADM visualiza o **Principal/oficial**
- ADM não edita diretamente roteiro, veículos, hospedagens, orçamento etc.
- Usuário comum edita a **Minha versão**
- Usuário comum pode enviar **Solicitação de alteração**
- ADM aprova ou rejeita na aba **Administração**
- Só a aprovação do ADM altera o **Principal/oficial**

## O que muda na interface

### Para ADM

- Todas as abas aparecem para visualização
- Edição direta fica bloqueada
- Aba Administração mostra:
  - usuários
  - solicitações pendentes
  - histórico recente
  - conexões

### Para usuários

- Todas as abas continuam editáveis
- Alterações ficam na própria conta
- Botão **Solicitar alteração** envia o estado sugerido para o ADM

## SQL obrigatório

Rode novamente:

`SUPABASE-AUTH-CUSTOM.sql`

Ele cria/atualiza:

- `app_master_state`
- `app_change_requests`
- funções de aprovação/rejeição
- `app_get_state`
- `app_save_state`

## Publicar

Envie os arquivos para o GitHub Pages e acesse:

`https://vitorhfonseca.github.io/Roteiro-Europa/?v=principal-solicitacoes-1`

Se aparecer versão antiga, use Ctrl + F5 ou limpe o service worker.
