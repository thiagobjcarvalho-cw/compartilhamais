Title: Bootstrap do CodeWave CompartilhaMais (PT-BR)
Status: Proposto

Contexto
- O CodeWave CompartilhaMais é uma SPA frontend baseada em Vue 3 + TypeScript, utilizando Vite para o dev server.
- Atualmente não há Dockerfile/docker-compose.yml no repositório; bootstrap foi definido para facilitar levantamentos locais rápidos e repetíveis.
- O objetivo deste ADR é consolidar a decisão de bootstrap, incluindo a introdução de containers como opção de ambiente reproduzível.

Decisão
- Adotar bootstrap em Node.js + Vite para desenvolvimento local, com a opção de containerização usando Docker (via Dockerfile + docker-compose.yml).
- Não forçar o uso de Docker por padrão; manter o fluxo atual (dev server local) como base, com containerization como alternativa opcional.
- Fornecer documentação de bootstrap em SETUP.md / INDEX.md, e registrar a decisão em ADR PT-BR.

Consequências
- Onboarding mais rápido para novos desenvolvedores, com um caminho claro para levantar o ambiente local.
- Possibilidade de rodar o frontend via container, facilitando CI/CD e ambientes isolados.
- Necessidade de manter as instruções de bootstrap atualizadas conforme mudanças no stack (ver ADRs futuras).

Impacto técnico
- Será criado Dockerfile para frontend (Node 18) e docker-compose.yml com serviço frontend exposto na porta 3000.
- Adição de .dockerignore para evitar envio de node_modules e outros artefatos desnecessários ao build.

Plano de implementação (alto nível)
- Criar Dockerfile com base no Node 18 Alpine, instalar dependências, copiar código e rodar dev server via npm run dev -- --host 0.0.0.0.
- Criar docker-compose.yml para orquestrar o serviço frontend com a porta 3000 exposta.
- Adicionar .dockerignore com node_modules e dist.
- Atualizar SETUP.md com comandos exatos para bootstrap com ou sem Docker.
- Deixar instrução no ADR PT-BR para consulta futura.

Validações de sucesso
- Rodar docker compose build e docker compose up -d; verificar que o container está rodando.
- Acessar http://localhost:3000/ e confirmar que a aplicação carrega (status 200).
- Validar que hot-reloading funciona em mudanças de código durante o desenvolvimento (opcional, com volumes).

Notas finais
- Este ADR pode evoluir com a adoção de pipelines CI/CD mais completos no futuro.
