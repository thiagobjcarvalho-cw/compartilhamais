Title: End-to-End com Backend Mock (PT-BR) - Frontend + Backend
Status: Proposto

Contexto
- A demonstração atual usa backend mock via Express para o backend e mocks no frontend.
- Deseja-se ter uma experiência end-to-end realista, simulando chamadas de API para instituições, doações e doadores.
- O plano é manter fallback para mocks do frontend caso o backend não esteja disponível, assegurando que a UI ainda funciona.

Decisão
- Adotar backend mock com Express como backend favorito para demonstrações, com JSON DB opcional para dados de teste e endpoints adicionais: /institutions/:id, /donations/:id, /donors/:id.
- Orquestrar frontend + backend via Docker Compose, expondo frontend em 3000 e backend em 3001 (ou via hostname em rede de containers).
- O frontend continuará buscando dados do backend; se falhar, continuará usando mocks locais no frontend.
- Adotar a convenção de endpoints estáveis e contratos de API para facilitar migração futura para backend real.

Atores
- Equipe de frontend: mantém o código de UI e lógica de exibição.
- Equipe de backend: implementa endpoints de demonstração e mantém db.json com dados de teste.
- Equipe de QA: validações end-to-end com health checks simples.

Critérios de Aceitação
- Busca de instituições retorna 8 itens (ou quantidade equivalente do dataset de demonstração).
- Endpoints /institutions/:id, /donations/:id e /donors/:id respondem com dados válidos quando solicitados.
- Frontend renderiza os cards de instituições vindas do backend sem falhas.
- Casos de falha do backend devem aplicar fallback para dados de demonstração no frontend.

Riscos e Mitigações
- Risco: mudanças de contrato API quebram o frontend; mitigação: ADRs por mudança de contrato e testes de regressão.
- Risco: configuração de rede entre containers; mitigação: usar nomes de serviços no docker-compose e docs de wiring.

Atores de Suporte
- Equipe de infraestrutura: valida o ambiente docker/CI.
- Equipe de QA: valida cenários de uso com o backend mock ativo.

Anexos
- db.json (dados de demonstração) localizados em backend/db.json
- Dockerfile/backend e docker-compose.yml já criados no repositório para suporte
