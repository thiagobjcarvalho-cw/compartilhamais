# PLANO DE PRÓXIMA SESSÃO - CodeWave CompartilhaMais

## Estado Atual do Projeto

### ✅ Concluído
- **Docker Compose**: Frontend (porta 3000) + Backend (porta 3001) funcionando
- **Backend Mock**: 8 instituições, donations, donors
- **Frontend**: Vue 3 com fallback para mock data
- **Documentação**: ADRs, relatórios, guides

---

## O QUE FALTA IMPLEMENTAR

### 1. BACKEND - Endpoints API

#### 1.1 Endpoints Existentes (funcionando)
| Endpoint | Método | Descrição | Status |
|----------|--------|-----------|--------|
| `/healthz` | GET | Health check | ✅ OK |
| `/institutions` | GET | Lista todas instituições | ✅ OK |
| `/institutions/:id` | GET | Detalhe instituição | ✅ OK |
| `/institutions/:id/needs` | GET | Necessidades da instituição | ✅ OK |
| `/donations` | GET | Lista doações | ✅ OK |
| `/donations/:id` | GET | Detalhe doação | ✅ OK |
| `/donors` | GET | Lista doadores | ✅ OK |

#### 1.2 Endpoints FALTANDO (BACKLOG)

##### PRIORIDADE ALTA (MVP)
| Endpoint | Método | Descrição | Frontend Precisa |
|----------|--------|-----------|------------------|
| `POST /donations` | POST | Criar nova doação | Doar item |
| `POST /donors` | POST | Criar/cadastrar doador | Cadastro |
| `POST /auth/login` | POST | Login do doador | Login |
| `GET /donors/:id` | GET | Perfil do doador | Perfil |
| `PUT /donors/:id` | PUT | Atualizar perfil | Editar perfil |

##### PRIORIDADE MÉDIA
| Endpoint | Método | Descrição | Frontend Precisa |
|----------|--------|-----------|------------------|
| `GET /institutions/:id/donations` | GET | Doações para instituição | Perfil instituição |
| `GET /donors/:id/donations` | GET | Doações do doador | Perfil doador |
| `GET /institutions/search` | GET | Buscar instituições | Busca |
| `GET /needs` | GET | Lista todas necessidades | Home needs |
| `GET /needs/urgent` | GET | Necessidades urgentes | Home urgentes |

##### PRIORIDADE BAIXA
| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `POST /institutions` | POST | Criar instituição |
| `PUT /institutions/:id` | PUT | Atualizar instituição |
| `POST /institutions/:id/needs` | POST | Adicionar necessidade |
| `PUT /donations/:id/status` | PUT | Atualizar status doação |

---

### 2. FRONTEND - Páginas e Componentes

#### 2.1 Páginas Existentes
| Página | Rota | Status |
|--------|------|--------|
| Home | `/` | ✅ Funcionando |
| InstitutionProfile | `/institution/:id` | ⚠️ Parcial |
| Login | `/login` | ⚠️ Parcial |
| DonorProfile | `/profile` | ⚠️ Parcial |
| Donations | `/donations` | ⚠️ Parcial |
| Favorites | `/favorites` | ⚠️ Parcial |
| Settings | `/settings` | ⚠️ Parcial |
| Notifications | `/notifications` | ⚠️ Parcial |

#### 2.2 Funcionalidades FALTANDO

##### Home Page (`/`)
- [ ] Mostrar Needs Urgentes (seção)
- [ ] Mapa com pins das instituições
- [ ] Filtros funcionando
- [ ] Busca por nome

##### Institution Profile (`/institution/:id`)
- [ ] Carregar do backend (não mock)
- [ ] Mostrar needs específicos
- [ ] Botão "Fazer Doação" funcionando
- [ ] Lista de doações recebidas

##### Login/Cadastro
- [ ] Formulário de login funcional
- [ ] Integração com backend
- [ ] Cadastro de novo doador

##### Perfil do Doador (`/profile`)
- [ ] Carregar dados do backend
- [ ] Editar informações
- [ ] Ver histórico de doações
- [ ] Ver instituições ajudadas

---

### 3. INTEGRAÇÃO FRONTEND-BACKEND

#### 3.1 Store (Pinia) - O que ajustar

| Store | Arquivo | Status | O que Fazer |
|-------|---------|--------|--------------|
| institutions | `src/stores/institutions.ts` | ✅ Parcial | Conectar todos os endpoints |
| donations | `src/stores/donations.ts` | ❌ Não existe | Criar store |
| donors | `src/stores/donors.ts` | ❌ Não existe | Criar store |
| auth | `src/stores/auth.ts` | ❌ Não existe | Criar store |

#### 3.2 Services API - O que criar

| Service | Arquivo | Descrição |
|---------|---------|-----------|
| api.ts | `src/services/api.ts` | Cliente axios base |
| institutionsService.ts | `src/services/institutions.ts` | Endpoints instituições |
| donationsService.ts | `src/services/donations.ts` | Endpoints doações |
| donorsService.ts | `src/services/donors.ts` | Endpoints doadores |
| authService.ts | `src/services/auth.ts` | Login/register |

---

### 4. DATABASE (db.json)

#### Dados Atuais
- 8 instituições (sem `needs` preenchidos)
- 2 donations demo
- 2 donors demo

#### O que adicionar
- [ ] Adicionar `needs` às instituições
- [ ] Mais donations de exemplo
- [ ] Mais donors de exemplo

---

## CHECKLIST DA PRÓXIMA SESSÃO

### Passo 1: Backend - Criar Stores e Services
- [ ] Criar `src/stores/auth.ts`
- [ ] Criar `src/stores/donations.ts`
- [ ] Criar `src/services/api.ts`
- [ ] Criar `src/services/institutions.ts`

### Passo 2: Backend - Adicionar Endpoints
- [ ] POST `/donations`
- [ ] POST `/donors`
- [ ] POST `/auth/login`
- [ ] GET `/donors/:id`
- [ ] PUT `/donors/:id`

### Passo 3: Frontend - Integrar Home
- [ ] Conectar fetchInstitutions ao backend
- [ ] Adicionar needs às instituições no db.json
- [ ] Criar endpoint GET `/needs`

### Passo 4: Frontend - Páginas
- [ ] Login funcional
- [ ] Perfil doador mostrando dados reais

---

## ARQUIVOS DE REFERÊNCIA

### Backend
- `backend/server.js` - Servidor Express
- `backend/db.json` - Dados mock

### Frontend
- `src/stores/institutions.ts` - Store de instituições
- `src/router/index.ts` - Rotas
- `src/types/interfaces.ts` - Tipos TypeScript

### Docker
- `docker-compose.yml` - Orquestração
- `Dockerfile` - Frontend
- `backend/Dockerfile` - Backend

---

## VARIÁVEIS DE AMBIENTE

```
Frontend:
- VITE_BACKEND_BASE=http://backend:3001

Backend:
- PORT=3001
```

---

## TESTES

### Verificar se containers estão rodando
```bash
docker-compose ps
```

### Testar backend
```bash
curl http://localhost:3001/healthz
curl http://localhost:3001/institutions
```

### Testar frontend
```bash
curl http://localhost:3000
```

---

## PRÓXIMO PASSO RECOMENDADO

1. **Criar stores e services** para conectar frontend com backend
2. **Adicionar endpoint POST /donations** para permitir doações
3. **Adicionar needs às instituições** no db.json
4. **Conectar Home page** ao backend completamente

---

**Última Atualização:** 17/03/2026
**Versão:** 1.0
