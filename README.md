# CodeWave CompartilhaMais

Plataforma de 连接 corações generosos - Conectando doadores a instituições que precisam de ajuda.

## 🚀 Quick Start

### Pré-requisitos
- Docker
- Docker Compose

### Executar o Projeto

```bash
# Clone o projeto
cd compartilhamais

# Iniciar containers
docker-compose up --build

# Acessar
# Frontend: http://localhost:3000
# Backend: http://localhost:3001
```

### Verificar Status

```bash
# Health check backend
curl http://localhost:3001/healthz

# Listar instituições
curl http://localhost:3001/institutions
```

---

## 📡 API Endpoints

### Backend Mock (Porta 3001)

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/healthz` | GET | Health check |
| `/institutions` | GET | Lista todas instituições |
| `/institutions/:id` | GET | Detalhe instituição |
| `/institutions/:id/needs` | GET | Necessidades da instituição |
| `/donations` | GET | Lista doações |
| `/donations/:id` | GET | Detalhe doação |
| `/donors` | GET | Lista doadores |

### Endpoints Pendentes (BACKLOG)
- `POST /donations` - Criar doação
- `POST /donors` - Cadastrar doador
- `POST /auth/login` - Login
- `GET /donors/:id` - Perfil doador
- `GET /needs` - Todas necessidades
- `GET /needs/urgent` - Neces. urgentes

---

## 🏗️ Arquitetura

```
compartilhamais/
├── frontend/          # Vue 3 + Vite
│   ├── src/
│   │   ├── components/  # Componentes Vue
│   │   ├── pages/       # Páginas
│   │   ├── stores/      # Pinia stores
│   │   ├── services/    # API services
│   │   ├── types/       # TypeScript types
│   │   └── router/      # Vue Router
│   └── Dockerfile
│
├── backend/           # Express Mock
│   ├── server.js      # Servidor
│   ├── db.json        # Dados demo
│   └── Dockerfile
│
├── docker-compose.yml
├── ADR/              # Architecture Decision Records
└── docs/             # Documentação
```

---

## 📦 Stacks

| Camada | Tecnologia |
|--------|------------|
| Frontend | Vue 3 + TypeScript + Vite |
| State | Pinia |
| Router | Vue Router |
| Backend | Express.js |
| Container | Docker + Compose |
| Styles | CSS customizado |

---

## 📄 Documentação

| Arquivo | Descrição |
|---------|-----------|
| `docs/PLANO_PROXIMA_SESSAO.md` | Plano de desenvolvimento |
| `docs/SETUP.md` | Guia de configuração |
| `ADR/BOOTSTRAP-PTBR-001.md` | ADR Bootstrap |
| `ADR/ENDTOEND_PTBR-001.md` | ADR End-to-End |
| `ADR/BackendMock-PTBR-001.md` | ADR Backend Mock |

---

## 🎯 Funcionalidades

### MVP
- [x] Listar instituições
- [x] Ver detalhes de instituição
- [x] Fallback para dados mock
- [x] Docker Compose

### Em Desenvolvimento
- [ ] Criar doação
- [ ] Login/Cadastro
- [ ] Perfil doador
- [ ] Needs urgentes

---

## 🔧 Desenvolvimento

### Comandos Docker

```bash
# Rebuild
docker-compose build

# Start
docker-compose up

# Stop
docker-compose down

# Logs
docker-compose logs -f
```

### Variáveis de Ambiente

```
VITE_BACKEND_BASE=http://backend:3001
PORT=3001
```

---

## 📝 Licença

MIT
