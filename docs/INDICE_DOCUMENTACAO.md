# ÍNDICE DE DOCUMENTAÇÃO - CodeWave CompartilhaMais

## 📁 Arquivos de Documentação

### 📖 Guias Principais
| Arquivo | Descrição |
|---------|-----------|
| `README.md` | Visão geral do projeto |
| `DOCUMENTACAO_TOTAL.md` | Documentação completa |
| `docs/PLANO_PROXIMA_SESSAO.md` | **Plano de desenvolvimento** |
| `docs/RESUMO_EXECUTIVO.md` | Resumo rápido |

### ⚙️ Setup e Configuração
| Arquivo | Descrição |
|---------|-----------|
| `docs/SETUP.md` | Guia de configuração |
| `docker-compose.yml` | Orquestração Docker |

### 📋 ADRs (Architecture Decision Records)
| Arquivo | Descrição |
|---------|-----------|
| `ADR/BOOTSTRAP-PTBR-001.md` | ADR Bootstrap |
| `ADR/ENDTOEND_PTBR-001.md` | ADR End-to-End |
| `ADR/BackendMock-PTBR-001.md` | ADR Backend Mock |

### 📝 Relatórios
| Arquivo | Descrição |
|---------|-----------|
| `RELATÓRIO_DE_MUDANÇAS.md` | Histórico de mudanças |

### 🛠️ Scripts
| Arquivo | Descrição |
|---------|-----------|
| `scripts/sanity.sh` | Script de validação |

---

## 🚀 Quick Start

```bash
# Verificar status
docker-compose ps

# Iniciar
docker-compose up -d

# Verificar
curl http://localhost:3001/healthz
# Frontend: http://localhost:3000
```

---

## 📋 CHECKLIST PRÓXIMA SESSÃO

### Backend
- [ ] POST /donations
- [ ] POST /donors
- [ ] POST /auth/login
- [ ] GET /donors/:id
- [ ] Adicionar needs às instituições

### Frontend
- [ ] Criar stores (auth, donations)
- [ ] Conectar login
- [ ] Conectar perfil

---

## 📂 Estrutura do Projeto

```
compartilhamais/
├── backend/
│   ├── server.js      # API Express
│   ├── db.json        # Dados mock
│   └── Dockerfile
├── src/
│   ├── stores/       # Pinia stores
│   ├── pages/        # Páginas Vue
│   ├── components/   # Componentes
│   └── services/     # API services
├── ADR/               # ADRs PT-BR
├── docs/              # Documentação
└── docker-compose.yml
```

---

**Última Atualização:** 17/03/2026
