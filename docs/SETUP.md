Guia de bootstrap do CodeWave CompartilhaMais

Objetivo
- Levantar o ambiente local de desenvolvimento para o CodeWave CompartilhaMais.

Pré-requisitos
- Docker ou Node.js (conforme stack do projeto)
- Acesso a ferramentas de build usadas no repositório

Passos de bootstrap
- Passo 1: instalar dependências
- Passo 2: configurar variáveis de ambiente
- Passo 3: iniciar serviços locais
- Passo 4: validar roots endpoints

- Integração: Rode frontend + backend mock em conjunto com o docker-compose para demonstrar o fluxo completo.
- Endpoints: /institutions (frontend consome), /institutions/:id, /donations, /donors (dados de demonstração).
- Comandos sugeridos:
  - docker compose up -d --build
  - curl -I http://localhost:3000/ (ver 200)
  - curl -s http://localhost:3001/institutions | head -n 5
- Testes: npm run test (Vitest) para validar store e renderização.

- Notas
- Este guia está evoluindo para incluir o fluxo frontend+backend (com backend mock) e instruções para CI/CD.
- Instruções para rodar frontend + backend juntos (local, container, CI) devem ser adicionadas na próxima edição do SETUP.md.
- Este guia é um ponto de partida; atualize conforme necessário durante o levantamento.
- Inclua instruções específicas para rodar frontend + backend (local, container, CI) na versão final do SETUP.md.
- Inclua instruções específicas para rodar frontend + backend (local, container, CI) na versão final do SETUP.md.
