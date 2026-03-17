# Documentação Completa — CodeWave CompartilhaMais

Data: 2026-03-17
Autor: OpenCode Agent

Resumo
- Sistema com frontend (Vue 3 + Vite) e backend mock (Express) executando em containers via Docker Compose; fallback para mocks do frontend quando backend indisponível.
- ADRs PT-BR ativos (End-to-End, Backend Mock) com caminhos para migrações futuras para backend real.
- CLI de validação rápida existente (sanity.sh) para verificar endpoints do backend e renderização do frontend.

1) Visão Geral do Sistema
- Objetivo: exibir UI de doações e instituições de forma estável, com backend mock disponível para demonstrações e fallback para mocks locais no frontend.
- Arquitetura (alto nível):
  - Frontend: CodeWave CompartilhaMais (porta 3000) dentro de container.
  - Backend: Backend Mock (Express) (porta 3001) dentro de container.
  - Orquestração: Docker Compose gerencia frontend + backend na mesma rede com DNS interno (backend). URL base do backend no container via VITE_BACKEND_BASE.
- Dados: backend/db.json com 8 instituições, doações e doadores. O backend expõe /institutions, /institutions/:id, /institutions/:id/needs, /donations, /donations/:id, /donors, /donors/:id, e /healthz.
- ADRs PT-BR: ENDTOEND_PTBR-001.md; BackendMock-PTBR-001.md; BootSTRAP-PTBR-001.md (referenciados).
- Documentos de suporte: SETUP.md (fluxo de bootstrap), ARCHITECTURE PT-BR, RELATÓRIO_DE_MUDANÇAS.md.

2) Mudanças Realizadas (Resumo de Change Log)
- Backend:
  - Endpoints expandidos: /institutions/:id, /institutions/:id/needs, /donations/:id, /donors/:id, /healthz.
  - CORS básico implementado para facilitar chamadas entre containers.
  - Dados de demonstração expandidos (8 instituições; 2 doações; 2 doadores) no db.json.
  - App exportado (module.exports = app) para facilitar testes com Supertest.
  - Adicionado Health Check /healthz e logs de diagnóstico ao boot.
- Frontend:
  - Lógica de fetch para instituições com fallback: VITE_BACKEND_BASE > http://backend:3001 > http://localhost:3001 > mocks.
  - Cards de instituições renderizados na Home.vue; rotas para /institution/:id já disponíveis.
  - Dockerfile frontend ajustado para instalação de dependências (npm ci/ install) e dev server com --host 0.0.0.0.
- Infra/Documentação:
  - ADRs PT-BR atualizados (ENDTOEND_PTBR-001.md, BackendMock-PTBR-001.md).
  - SETUP PT-BR com steps de bootstrap (local/containers/CI).
  - RELATÓRIO_DE_MUDANÇAS.md atualizado com o status da sessão atual.

3) Fluxo de Funcionamento Atual (end-to-end)
- O frontend consulta o backend via base URL configurável; se backend indisponível, o frontend usa dados mock.
- O backend retorna dados estruturados conforme o contrato de API: instituições, necessidades, doações e usuários (doadores).
- O setup permite rodar em container com Docker Compose ou executar localmente com Node.

4) Comandos-chave (curto e direto)
- Iniciar (ou Reiniciar) containers e rebuild:
  - docker compose down -v
  - docker compose up -d --build

- Validar endpoints no backend:
  - curl -s http://localhost:3001/healthz
  - curl -s http://localhost:3001/institutions
  - curl -s http://localhost:3001/institutions/1
  - curl -s http://localhost:3001/institutions/1/needs
- Validar frontend (UI):
  - Acesse http://localhost:3000/
  - Verifique se aparecem cards de instituições

5) Observações de Status
- Não foram removidos containers existentes. Caso haja necessidade de reset completo, informe e eu gero um plano de rollback/restore.
- Se qualquer endpoint falhar, consultar logs com docker logs para backend/frontend e validar db.json para consistência de dados.

6) Referências de Arquivos (paths completos)
- Backend
  - /home/thiago/Developer/projetos/codewave/compartilhamais/backend/server.js
  - /home/thiago/Developer/projetos/codewave/compartilhamais/backend/db.json
  - /home/thiago/Developer/projetos/codewave/compartilhamais/backend/Dockerfile
- Frontend
  - /home/thiago/Developer/projetos/codewave/compartilhamais/Dockerfile
  - /home/thiago/Developer/projetos/codewave/compartilhamais/docker-compose.yml
  - /home/thiago/Developer/projetos/codewave/compartilhamais/vite.config.ts
  - /home/thiago/Developer/projetos/codewave/compartilhamais/src/stores/institutions.ts
- ADRs PT-BR
  - /home/thiago/Developer/projetos/codewave/compartilhamais/ADR/ENDTOEND_PTBR-001.md
  - /home/thiago/Developer/projetos/codewave/compartilhamais/ADR/BackendMock-PTBR-001.md
- Documentação e Relatórios
  - /home/thiago/Developer/projetos/codewave/compartilhamais/docs/SETUP.md
  - /home/thiago/Developer/opencode Arch/ARCHITECTURE.md
  - /home/thiago/Developer/projetos/codewave/compartilhamais/RELATÓRIO_DE_MUDANÇAS.md
- Scripts utilitários
  - /home/thiago/Developer/projetos/codewave/compartilhamais/scripts/sanity.sh

7) Riscos e Mitigações
- Risco de falha de rede entre containers: use DNS interno do Docker (nomes de serviço) e fallback para mocks.
- Risco de mudanças de contrato de API: ADRs PT-BR, contratos de API e testes futuros para regressão.
- Risco de dependências de build no container: fixar versões estáveis ou usar lockfile (package-lock.json).

8) Observações Finais
- Este documento deve servir como fonte única de referência para o estado atual e para a próxima sessão de migração. Mantemos tudo no repositório e atualizamos conforme necessário.
