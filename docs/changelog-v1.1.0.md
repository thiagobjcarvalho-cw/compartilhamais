# CompartilhaMais - Changelog v1.1.0

## Data: Novembro 2025

Este documento descreve todas as melhorias e novas funcionalidades implementadas na versão 1.1.0 do CompartilhaMais.

---

## Resumo das Melhorias

Esta versão foca em conectar funcionalidades que estavam desconectadas, implementar persistência de dados e melhorar a experiência do usuário com feedback visual consistente.

---

## Novas Funcionalidades

### 1. Sistema de Favoritos com Persistência

**Arquivo:** `src/stores/favorites.ts`

- Implementação completa do sistema de favoritos usando localStorage
- Persistência automática das instituições favoritas
- Sincronização entre todas as páginas da aplicação

**Funcionalidades:**
- `addFavorite()` - Adicionar instituição aos favoritos
- `removeFavorite()` - Remover instituição dos favoritos
- `toggleFavorite()` - Alternar estado de favorito
- `clearAllFavorites()` - Limpar todos os favoritos
- Auto-save quando há mudanças

**Uso:**
```typescript
import { useFavoritesStore } from '@/stores/favorites'

const favoritesStore = useFavoritesStore()

// Verificar se é favorito
const isFav = favoritesStore.isFavorite(institutionId)

// Alternar favorito
const result = favoritesStore.toggleFavorite(institutionId)
```

---

### 2. Sistema Global de Feedback (Snackbars/Toasts)

**Arquivo:** `src/stores/ui.ts`

Store centralizado para gerenciar feedback visual em toda a aplicação.

**Métodos disponíveis:**
- `showSuccess(message)` - Mensagem de sucesso (verde)
- `showError(message)` - Mensagem de erro (vermelho)
- `showWarning(message)` - Mensagem de alerta (amarelo)
- `showInfo(message)` - Mensagem informativa (azul)
- `setLoading(boolean, message)` - Controle de loading global

**Implementação no App.vue:**
- Snackbar global na raiz da aplicação
- Overlay de loading global

**Uso:**
```typescript
import { useUiStore } from '@/stores/ui'

const uiStore = useUiStore()

uiStore.showSuccess('Operação realizada com sucesso!')
uiStore.showError('Erro ao processar solicitação')
```

---

### 3. Persistência de Configurações do Usuário

**Arquivo:** `src/stores/settings.ts`

Store para gerenciar configurações do usuário com persistência no localStorage.

**Dados persistidos:**
- Informações do perfil (nome, email, telefone, cidade)
- Preferências de doação (categorias, distância máxima)
- Configurações de notificação

**Funcionalidades:**
- `updateProfile()` - Atualizar dados do perfil
- `updatePreferences()` - Atualizar preferências
- `updateNotifications()` - Atualizar configurações de notificação
- `exportUserData()` - Exportar dados do usuário
- `clearCache()` - Limpar cache da aplicação
- `resetSettings()` - Restaurar configurações padrão

---

### 4. Exportação de Dados (CSV/JSON)

#### Exportação de Doações (CSV)

**Arquivo:** `src/pages/DonationsPage.vue`

- Exportação completa do histórico de doações em formato CSV
- Inclui ID, descrição, instituição, quantidade, status e data
- Suporte a caracteres especiais (UTF-8 BOM)
- Nome do arquivo com data atual

#### Exportação de Dados do Usuário (JSON)

**Arquivo:** `src/pages/SettingsPage.vue`

- Exportação de todas as configurações e favoritos
- Formato JSON legível
- Inclui data de exportação e versão do app

---

### 5. Dialog de Doação Conectado

**Componente:** `src/components/institution/DonationDialog.vue`

O DonationDialog agora está conectado em todas as páginas:

- **Home.vue** - Cards de instituições
- **FavoritesPage.vue** - Lista de favoritas
- **InstitutionCard.vue** - Botão de doação

**Funcionalidades:**
- Formulário validado com regras
- Seleção de forma de contato
- Agendamento de entrega
- Feedback visual após conclusão

---

## Melhorias de UI/UX

### Botão de Favorito nos Cards

**Arquivo:** `src/components/institution/InstitutionCard.vue`

- Adicionado botão de estrela para favoritar
- Indicador visual do estado (preenchido/vazio)
- Integração com store de favoritos

### Navegação Melhorada

- Uso de `router.push()` ao invés de `window.open()`
- Links internos mais rápidos e consistentes
- Melhor experiência de navegação

### Feedback Visual Consistente

Todas as ações do usuário agora têm feedback visual:
- Salvar configurações
- Adicionar/remover favoritos
- Exportar dados
- Erros de validação
- Carregamento de dados

---

## Estrutura de Arquivos Novos

```
src/stores/
├── favorites.ts    # Store de favoritos (NOVO)
├── settings.ts     # Store de configurações (NOVO)
└── ui.ts           # Store de UI/feedback (NOVO)
```

---

## Atualizações em Arquivos Existentes

### App.vue
- Importação dos novos stores
- Snackbar global
- Overlay de loading global
- Inicialização do store de favoritos

### Home.vue
- Integração com stores de favoritos e UI
- Feedback visual para favoritos e doações

### FavoritesPage.vue
- Uso do novo store de favoritos
- DonationDialog integrado
- Feedback via store de UI

### DonationsPage.vue
- Exportação CSV funcional
- Integração com store de UI

### SettingsPage.vue
- Persistência real no localStorage
- Exportação de dados funcional
- Limpeza de cache
- Exclusão de conta com logout

### InstitutionCard.vue
- Botão de favorito adicionado
- Integração com store de favoritos
- Emit de evento de favorito

---

## Correções de Bugs

1. **Navegação de Favoritos**: Corrigido uso de `window.open()` para `router.push()`
2. **Persistência**: Configurações agora são mantidas entre sessões
3. **Feedback**: Todas as ações têm confirmação visual
4. **Validação**: Formulários com validação e feedback de erros

---

## Padrões de Código

### Uso do Store de UI

```typescript
// Em qualquer componente
import { useUiStore } from '@/stores/ui'

const uiStore = useUiStore()

// Após uma ação bem-sucedida
uiStore.showSuccess('Mensagem de sucesso')

// Após um erro
uiStore.showError('Mensagem de erro')

// Durante carregamento
uiStore.setLoading(true, 'Processando...')
```

### Uso do Store de Favoritos

```typescript
import { useFavoritesStore } from '@/stores/favorites'

const favoritesStore = useFavoritesStore()

// Verificar se é favorito
const isFavorite = favoritesStore.isFavorite(id)

// Alternar favorito com feedback
const result = favoritesStore.toggleFavorite(id)
if (result.added) {
  uiStore.showSuccess(`${result.institutionName} adicionada aos favoritos`)
} else {
  uiStore.showWarning(`${result.institutionName} removida dos favoritos`)
}
```

---

## Próximos Passos (v1.2.0)

1. **Integração com Backend** - Substituir dados mock por API real
2. **Autenticação Real** - Implementar OAuth/JWT
3. **PWA** - Adicionar suporte offline
4. **Testes** - Criar suite de testes unitários e e2e
5. **i18n** - Adicionar suporte a múltiplos idiomas
6. **Notificações Push** - Implementar notificações em tempo real
7. **Chat** - Sistema de mensagens entre doador e instituição

---

## Compatibilidade

- Vue 3.5+
- Vuetify 3.8+
- TypeScript 5.8+
- Navegadores modernos com suporte a ES2020+
- localStorage disponível

---

## Guia de Migração

Se você está atualizando de uma versão anterior:

1. Limpe o cache do navegador
2. Os favoritos anteriores serão perdidos (nova estrutura)
3. As configurações precisarão ser refeitas

---

## Contribuição

Para contribuir com o projeto:

1. Fork o repositório
2. Crie uma branch para sua feature
3. Faça commit das mudanças
4. Abra um Pull Request

---

## Licença

MIT License - veja o arquivo LICENSE para detalhes.
