Relatório de Mudanças - CodeWave CompartilhaMais

Data: 2026-03-17
Autor: OpenCode Agent

Resumo executivo
- Re-estabilização do sistema frontend+backend com backend mock enriquecido, migrando para uma arquitetura com fallback para mocks no frontend.
- Adicionadas rotas e dados no backend; serviços frontend+backend orquestrados via Docker Compose; frontend consome backend com fallback para mocks.
- ADRs PT-BR atualizados para End-to-End e Backend Mock; SETUP.md atualizado com fluxo de bootstrap completo.

1. Mudanças na arquitetura e código
- Backend: Express com endpoints novos (/institutions/:id, /institutions/:id/needs, /donations/:id, /donors/:id) e healthz. CORS básico implementado para facilitar acesso entre containers. db.json com 8 instituições + doações/donadores para demonstração.
- Frontend: Estratégia de fetch com fallback para mocks; BASES de backend com fallback para http://backend:3001 e http://localhost:3001; docker-compose ajustado para apontar backend dentro do container.
- Docker: Dockerfile do frontend ajustado para usar npm ci (fallback) e instalar as dependências; docker-compose.yml atualizado para disponibilizar backend na porta 3001 e frontend na 3000; backend Dockerfile existente ajustado.
- ADRs PT-BR: END-TO-END PTBR 001; BackendMock PTBR 001; Boot PT-BR 001 (existente).
- Setup: SETUP.md atualizado para cobrir fluxo de bootstrap frontend+backend (local/containers/CI) com health checks.

2. Arquivos modificados/academados
- backend/server.js: adicionado CORS, endpoints adicionais, healthz; exporta app para testability.
- backend/db.json: dados atualizados com 8 instituições + doações + doadores.
- docker-compose.yml: adicionada variável VITE_BACKEND_BASE e endpoints; backend/ frontend definidas.
- frontend/Dockerfile: ajustado para usar npm install (ou npm ci) durante build.
- vitest.config.ts, tests/unit/BackendSpec.ts, tests/unit/HomeRender.spec.ts (entrada inicial para testes; não será executado neste ciclo, mas presente para migração futura).
- ADR/ENDTOEND_PTBR-001.md (End-to-End PT-BR) existente; ADR/BackendMock-PTBR-001.md consolidado.
- SETUP.md: fluxo de bootstrap completo com docker-compose, health checks, endpoints e validações.
- RELATÓRIO_DE_MUDANÇAS.md: relatório completo deste conjunto de mudanças (novo).
- REPORTADO de status dos containers: a verificação atual mostra backend ativo, frontend ativo após rebuilds, com logs mostrando falhas de plugin Vue resolvidas pelo ajuste de dependencies.

3. Como validar rapidamente
- Verifique containers: docker ps -a
- Verifique endpoints do backend: curl -s http://localhost:3001/institutions; curl -s http://localhost:3001/healthz
- Verifique frontend: acesse http://localhost:3000/ e confirme os cards de instituições.
- Em caso de falha do frontend, verifique logs: docker logs compartilhamais-codewave-1 --tail 200

4. Próximos passos sugeridos
- Reforçar contrato de API com ADR PT-BR End-to-End, incluindo o fluxo de migração para backend real quando disponível.
- Adicionar checks rápidos de health para cada tela (frontend) e endpoints (backend) no SETUP.md.
- Consolidar a documentação de bootstrap no SETUP.md para ambientes CI/CD com passos exatos (comandos Fish, scripts, etc).

Fim do relatório. Este documento deve orientar a próxima sessão de migração e validação completa.
