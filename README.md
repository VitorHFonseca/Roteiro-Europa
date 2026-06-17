# Roteiro Europa — Admin Pré-configurado

## Contas iniciais

### ADM

Usuário: `admin`  
Senha: `Admin@2026!`

### Usuário comum

Usuário: `usuario`  
Senha: `Usuario@2026!`

## Mudanças desta versão

- ADM já vem cadastrado.
- Usuário comum já vem cadastrado.
- Botão **Entrar com roteiro exemplo** foi removido.
- Novos usuários ainda podem se cadastrar pela tela **Criar conta**.
- Novos usuários entram como perfil `user`, não como ADM.
- ADM continua bloqueado para editar roteiro, veículos, hospedagens, orçamento, checklist e diário.
- ADM gerencia usuários e conexões.
- Chaves continuam mascaradas.

## Publicar

Envie todos os arquivos para a raiz do GitHub Pages e acesse:

`https://vitorhfonseca.github.io/Roteiro-Europa/?v=admin-preconfigurado-1`

Se aparecer versão antiga, use Ctrl + F5 ou limpe o service worker.

## Segurança

Essas credenciais padrão são convenientes para começar, mas em produção altere a senha do ADM pela aba Admin depois do primeiro login. Nunca coloque `service_role` ou segredo real no frontend.
