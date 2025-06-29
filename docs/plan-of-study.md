# Plano de Estudos para o Fábio

A ideia é progredir gradualmente em tarefas pequenas para aprender Vue na prática.

## Etapa 1 – Ambiente e Familiarização

- [ ] Clonar o repositório e instalar dependências (`npm install`).
- [ ] Rodar `npm run dev` e navegar entre as rotas existentes.
- [ ] Ler a [Visão Geral da Arquitetura](overview.md).

## Etapa 2 – Primeiro Componente

- [ ] Criar um componente simples (exemplo em `docs/examples/ComponentExample.vue`).
- [ ] Importar esse componente em `HomeView.vue` para exibir uma mensagem qualquer.
- [ ] Executar `npm run lint` e `npm run format` antes de commitar.

## Etapa 3 – Lógica com Stores

- [ ] Ler o exemplo `docs/examples/store-example.ts`.
- [ ] Criar um novo store no diretório `src/stores` para controlar um contador de cliques.
- [ ] Exibir o valor do contador no componente criado na etapa anterior.

## Etapa 4 – Serviços e Modelos

- [ ] Analisar o exemplo de serviço e modelo em `docs/examples`.
- [ ] Criar `src/services/exampleService.ts` com uma função mock que retorna dados estáticos.
- [ ] Consumir esse serviço no componente e mostrar os dados na tela.

## Etapa 5 – Pequenas Histórias de Usuário (HUs)

1. **HU01 - Listagem de Instituições**
   - Como usuário desejo ver uma lista simples de instituições para ter ideia do que existe perto de mim.
2. **HU02 - Contador de Doações**
   - Como usuário quero um contador de doações feitas para acompanhar meu impacto.
3. **HU03 - Página Sobre**
   - Como usuário posso acessar uma página com informações do projeto.

Essas histórias são bem enxutas e servem para praticar o fluxo de criação de componentes, stores e rotas.

Concentre-se primeiro na lógica e em exibir dados básicos. A parte visual pode ser melhorada posteriormente.
