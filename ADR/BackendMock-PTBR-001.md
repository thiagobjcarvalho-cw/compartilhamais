Title: Backend Mock com JSON-Server/Express e Foreground de Mock (PT-BR)
Status: Proposto

Contexto
- O objetivo é demonstrar o fluxo completo frontend+backend sem depender de serviços externos reais.
- A solução atual usa frontend com mocks; a adição de uma API backend mock aumenta a fidelidade da demonstração, especialmente para fluxos de doação, consultas, e atualização de dados.
- A arquitetura visa manter fallback para mocks no frontend para ambientes sem backend, com backend como opção de demonstração end-to-end.

Decisão
- Implementar um backend mock com duas opções: JSON Server (rápido) ou Express (com controle total).
- Será usado Docker Compose para rodar frontend + backend juntos em ambientes locais, containers ou CI, com o backend exposto em uma porta distinta (ex.: 3001).
- O frontend deve ser capaz de buscar dados do backend e usar mocks como fallback caso o backend esteja indisponível.
- Endpoints essenciais a serem suportados: 
  - GET /institutions (lista de instituições)
  - GET /institutions/:id (detalhe de uma instituição)
  - GET /donations e /donations/:id (para simular doações)
  - GET /donors e /donors/:id (para dados de doadores)

Conseqüências
- Maior fidelidade de demonstração; facilita o desenvolvimento de features conectadas ao backend.
- O ambiente de bootstrap passa a funcionar com backend integrado, mantendo fallback para mocks em caso de indisponibilidade.
- Requer manutenção de db.json para dados de demonstração (ou migração para um dataset mais completo).

Implementação / Ativos
- Backend Express com os endpoints descritos.
- db.json para dados de demonstração compatíveis com a estrutura de interfaces existentes.
- Dockerfile + docker-compose.yml para frontend + backend.
- Patch incremental para manter a compatibilidade com o frontend que consome dados via fetch.

Plano de Implementação (alto nível)
- Passo 1: consolidar backend/Express com as rotas mencionadas (institutions, donations, donors).
- Passo 2: adaptar frontend para consultar backend em container via hostname de serviço (backend) com fallback para localhost:3001.
- Passo 3: ajustar docker-compose para orquestrar frontend + backend.
- Passo 4: criar testes de integração para verificar que o frontend consome corretamente o backend.
- Passo 5: documentar o fluxo no SETUP.md (PT-BR).

Riscos / Mitigações
- Risco: configuração de rede entre containers; mitigação: usar nomes de serviços no docker-compose (ex.: http://backend:3001).
- Risco: dados sensíveis em dados de demonstração; mitigação: manter apenas mocks para demonstração.
- Risco: manter o backend sincronizado com as interfaces do frontend; mitigação: manter contratos de API estáveis e adotar ADRs para mudanças.

Testes de aceitação propostos
- Rodar a integração frontend+backend com a API simulada; confirmar que a UI exibe 8 instituições vindas do backend.
- Testes unitários com Vitest para validar a disponibilidade de endpoints e o formato das respostas.

Observações finais
- Este ADR complementa o bootstrap existente; manteremos o fallback para mocks para ambientes onde o backend não esteja disponível.
