# RESUMO EXECUTIVO

## O que foi feito
- Frontend Vue 3 rodando na porta 3000
- Backend Express mock rodando na porta 3001
- Docker Compose configurado
- 8 instituições cadastradas no db.json
- Fallback para dados mock no frontend

## O que falta (BACKLOG)

### Backend Endpoints
| # | Endpoint | Método | Prioridade |
|---|----------|--------|------------|
| 1 | POST /donations | POST | ALTA |
| 2 | POST /donors | POST | ALTA |
| 3 | POST /auth/login | POST | ALTA |
| 4 | GET /donors/:id | GET | ALTA |
| 5 | GET /needs | GET | MÉDIA |
| 6 | GET /needs/urgent | GET | MÉDIA |

### Frontend
| # | Funcionalidade | Prioridade |
|---|----------------|------------|
| 1 | Criar stores (auth, donations, donors) | ALTA |
| 2 | Login funcional | ALTA |
| 3 | Needs nas instituições | ALTA |
| 4 | Perfil doador | MÉDIA |
| 5 | Mapa com pins | MÉDIA |

---

## Próxima Sessão - Passo a Passo

### 1. Criar Stores
```
src/stores/auth.ts       → Autenticação
src/stores/donations.ts  → Doações
```

### 2. Criar Services
```
src/services/api.ts           → Axios base
src/services/institutions.ts → Endpoints instituições
src/services/auth.ts          → Login
```

### 3. Adicionar Needs
Adicionar array `needs` às 8 instituições no `backend/db.json`

### 4. Criar Endpoint
```
GET /needs → Retorna todas necessidades
```

---

## Arquivos Principais

| Arquivo | Descrição |
|---------|-----------|
| `backend/server.js` | Servidor Express |
| `backend/db.json` | Dados mock |
| `src/stores/institutions.ts` | Store de instituições |
| `docker-compose.yml` | Orquestração Docker |

---

## Quick Reference

```bash
# Ver containers
docker-compose ps

# Logs
docker-compose logs -f

# Reiniciar
docker-compose down && docker-compose up -d --build
```
