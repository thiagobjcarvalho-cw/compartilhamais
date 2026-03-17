# BACKEND COMPARTILHAMAIS - SUPABASE + SYMFONY

## CONTEXTO DO PROJETO

CompartilhaMais e uma plataforma que conecta doadores a instituicoes necessitadas via geolocalizacao. O frontend em Vue 3 + TypeScript + Vuetify ja esta pronto e funcional com dados mock. Preciso do backend completo usando Supabase.

**Stack:**
- **Supabase**: PostgreSQL com PostGIS, Auth, Storage, Realtime
- **Symfony 6.4**: API REST para logica de negocio complexa
- **Redis**: Cache (opcional)

---

## ARQUITETURA

```
[Frontend Vue 3]
       |
[Supabase Client] -> Auth, Storage, Realtime subscriptions
       |
[Symfony API] -> Logica de negocio, validacoes complexas
       |
[Supabase PostgreSQL] -> Dados (via Doctrine ou direto)
```

**Decisao de rota:**
- Auth (login, register, OAuth) -> Supabase Auth direto
- Upload de imagens -> Supabase Storage direto
- Realtime notifications -> Supabase Realtime
- CRUD com regras de negocio -> Symfony API
- Queries complexas (geo, filtros) -> Symfony + Doctrine

---

## SETUP SUPABASE

### 1. Criar Projeto
- Dashboard: https://supabase.com/dashboard
- Regiao: Sao Paulo (sa-east-1)
- Anotar: URL, anon key, service_role key

### 2. Habilitar PostGIS
```sql
CREATE EXTENSION IF NOT EXISTS postgis;
```

### 3. Tabelas (criar via SQL Editor ou migrations)

#### users (extende auth.users)
```sql
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT NOT NULL,
  cpf TEXT UNIQUE,
  phone TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'donor' CHECK (role IN ('donor', 'institution', 'admin', 'moderator')),
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger para criar profile automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', 'Usuario'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

#### institutions
```sql
CREATE TABLE public.institutions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('shelter', 'education', 'health', 'elderly', 'animal', 'environment', 'food')),
  description TEXT NOT NULL,
  about TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT,
  location GEOGRAPHY(POINT, 4326),
  phone TEXT,
  email TEXT,
  whatsapp TEXT,
  website TEXT,
  images TEXT[] DEFAULT '{}',
  verified BOOLEAN DEFAULT FALSE,
  rating DECIMAL(2,1) DEFAULT 0,
  total_donations INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indice espacial
CREATE INDEX institutions_location_idx ON public.institutions USING GIST (location);
```

#### needs
```sql
CREATE TABLE public.needs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  institution_id UUID REFERENCES public.institutions(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  quantity TEXT,
  category TEXT NOT NULL CHECK (category IN ('food', 'clothes', 'hygiene', 'education', 'medical', 'shelter', 'electronics', 'volunteers', 'other')),
  urgency TEXT DEFAULT 'medium' CHECK (urgency IN ('low', 'medium', 'high', 'critical')),
  fulfilled BOOLEAN DEFAULT FALSE,
  fulfilled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### donations
```sql
CREATE TABLE public.donations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  donor_id UUID REFERENCES public.profiles(id) NOT NULL,
  institution_id UUID REFERENCES public.institutions(id) NOT NULL,
  need_id UUID REFERENCES public.needs(id),
  description TEXT NOT NULL,
  quantity TEXT,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
  type TEXT DEFAULT 'items' CHECK (type IN ('money', 'items', 'volunteer')),
  amount DECIMAL(10,2),
  photos TEXT[] DEFAULT '{}',
  feedback TEXT,
  scheduled_date TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### notifications
```sql
CREATE TABLE public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error', 'donation', 'urgent', 'system')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  icon TEXT,
  image TEXT,
  action_url TEXT,
  action_label TEXT,
  read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### favorites
```sql
CREATE TABLE public.favorites (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  institution_id UUID REFERENCES public.institutions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, institution_id)
);
```

### 4. Row Level Security (RLS)

```sql
-- Habilitar RLS em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.needs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Profiles: usuario ve e edita so o proprio
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Institutions: todos podem ver, owner pode editar
CREATE POLICY "Anyone can view institutions" ON public.institutions
  FOR SELECT USING (true);

CREATE POLICY "Owner can insert institution" ON public.institutions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Owner can update institution" ON public.institutions
  FOR UPDATE USING (auth.uid() = user_id);

-- Needs: todos podem ver, owner da institution pode editar
CREATE POLICY "Anyone can view needs" ON public.needs
  FOR SELECT USING (true);

CREATE POLICY "Institution owner can manage needs" ON public.needs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.institutions
      WHERE id = institution_id AND user_id = auth.uid()
    )
  );

-- Donations: donor e institution podem ver
CREATE POLICY "Donor can view own donations" ON public.donations
  FOR SELECT USING (auth.uid() = donor_id);

CREATE POLICY "Institution can view received donations" ON public.donations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.institutions
      WHERE id = institution_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Donor can create donation" ON public.donations
  FOR INSERT WITH CHECK (auth.uid() = donor_id);

-- Notifications: usuario ve so as proprias
CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Favorites
CREATE POLICY "Users can manage own favorites" ON public.favorites
  FOR ALL USING (auth.uid() = user_id);
```

### 5. Storage Buckets

```sql
-- Via Dashboard ou API
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('avatars', 'avatars', true),
  ('institutions', 'institutions', true),
  ('donations', 'donations', true);
```

### 6. Auth Providers

No Dashboard Supabase:
- Authentication -> Providers
- Habilitar: Email, Google, Facebook
- Configurar OAuth credentials

---

## SEED DE DADOS - 500 INSTITUICOES REALISTAS

### REQUISITO CRITICO

Criar um seed com **500 instituicoes ficticias** que parecam **REAIS**:

### Especificacoes do Seed

#### Distribuicao por Tipo (500 total)
- shelter (abrigos): 80 instituicoes
- education (educacao): 100 instituicoes
- health (saude): 70 instituicoes
- elderly (idosos): 60 instituicoes
- animal (animais): 80 instituicoes
- environment (meio ambiente): 40 instituicoes
- food (alimentacao): 70 instituicoes

#### Distribuicao Geografica
- **Sao Paulo Capital**: 200 instituicoes
- **Grande Sao Paulo**: 150 instituicoes (Guarulhos, Osasco, ABC, etc)
- **Interior SP**: 100 instituicoes (Campinas, Santos, Ribeirao Preto, etc)
- **Outras capitais**: 50 instituicoes (RJ, BH, Curitiba, POA)

#### Dados Realistas por Instituicao

**Nomes** - Usar padroes brasileiros reais:
- "Casa de Acolhimento [Nome]"
- "Instituto [Nome] de [Causa]"
- "Associacao [Nome]"
- "ONG [Nome]"
- "Lar [Nome]"
- "Centro de Apoio [Nome]"
- "Projeto [Nome]"

**Enderecos** - Usar ruas e bairros REAIS das cidades:
```javascript
{
  address: "Rua Augusta, 1234",
  city: "Sao Paulo",
  state: "SP",
  zip_code: "01304-001",
  // Coordenadas reais do endereco
  latitude: -23.5534,
  longitude: -46.6619
}
```

**Contatos** - Telefones com DDDs corretos:
- SP: (11) 9XXXX-XXXX
- RJ: (21) 9XXXX-XXXX
- BH: (31) 9XXXX-XXXX
- Emails: contato@[nome-instituicao].org.br

**Descricoes** - Textos realistas e variados:
- Missao da instituicao
- Publico atendido
- Historia resumida
- Impacto social

**Needs (2-5 por instituicao)** - Total ~1500 needs:
```javascript
// Exemplos realistas por tipo de instituicao
// Abrigo
{ title: "Cobertores para inverno", category: "shelter", urgency: "high" }
{ title: "Alimentos nao pereciveis", category: "food", urgency: "critical" }

// Educacao
{ title: "Material escolar", category: "education", urgency: "medium" }
{ title: "Livros didaticos", category: "education", urgency: "low" }

// Saude
{ title: "Fraldas geriatricas", category: "medical", urgency: "critical" }
{ title: "Medicamentos basicos", category: "medical", urgency: "high" }
```

**Ratings e Stats** - Distribuicao realista:
- rating: 3.5 a 5.0 (maioria entre 4.0-4.8)
- total_donations: 10 a 500 (distribuicao exponencial)
- verified: 70% true, 30% false

#### Script de Seed

Criar script SQL ou TypeScript que:
1. Gera 500 instituicoes com dados variados
2. Gera 2-5 needs por instituicao
3. Usa coordenadas GPS reais das cidades
4. Gera dados de contato com formatacao brasileira
5. Cria descricoes unicas e realistas
6. Pode ser executado no Supabase SQL Editor

#### Exemplo de Output Esperado

```javascript
{
  name: "Instituto Esperanca Viva",
  type: "education",
  description: "Ha 15 anos oferecendo reforco escolar gratuito para criancas de comunidades carentes. Atendemos 200 criancas de 6 a 14 anos em contraturno escolar.",
  about: "Fundado em 2009 por educadores voluntarios, o Instituto Esperanca Viva nasceu da necessidade de oferecer apoio educacional as criancas do Jardim Angela. Hoje contamos com 30 voluntarios e parceria com 5 escolas publicas da regiao.",
  address: "Rua Maria Santana, 456",
  city: "Sao Paulo",
  state: "SP",
  zip_code: "04945-020",
  latitude: -23.6821,
  longitude: -46.7456,
  phone: "(11) 94567-8901",
  email: "contato@esperancaviva.org.br",
  whatsapp: "(11) 94567-8901",
  website: "www.esperancaviva.org.br",
  verified: true,
  rating: 4.7,
  total_donations: 234,
  needs: [
    {
      title: "Kit material escolar completo",
      description: "Cadernos, lapis, canetas, borrachas e mochilas para 50 criancas do novo semestre",
      category: "education",
      quantity: "50 kits",
      urgency: "high"
    },
    {
      title: "Computadores para sala de informatica",
      description: "Computadores usados em bom estado para montar laboratorio de informatica",
      category: "electronics",
      quantity: "10 unidades",
      urgency: "medium"
    }
  ]
}
```

---

## TESTES E2E COM CYPRESS

### Setup Cypress

```bash
npm install cypress @testing-library/cypress --save-dev
```

### Configuracao (cypress.config.ts)

```typescript
import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    env: {
      SUPABASE_URL: 'http://localhost:54321',
      TEST_USER_EMAIL: 'test@compartilhamais.com',
      TEST_USER_PASSWORD: 'Test123!@#'
    }
  },
  component: {
    devServer: {
      framework: 'vue',
      bundler: 'vite'
    }
  }
})
```

### Estrutura de Testes

```
cypress/
  e2e/
    auth/
      login.cy.ts
      register.cy.ts
      social-login.cy.ts
      password-recovery.cy.ts
    institutions/
      list.cy.ts
      filter.cy.ts
      detail.cy.ts
      map.cy.ts
    donations/
      create.cy.ts
      workflow.cy.ts
      history.cy.ts
    notifications/
      list.cy.ts
      mark-read.cy.ts
      realtime.cy.ts
    favorites/
      add-remove.cy.ts
    settings/
      profile.cy.ts
      preferences.cy.ts
  support/
    commands.ts
    e2e.ts
  fixtures/
    users.json
    institutions.json
```

### Testes Obrigatorios

#### 1. Auth (auth/)

**login.cy.ts**
```typescript
describe('Login', () => {
  beforeEach(() => {
    cy.visit('/login')
  })

  it('deve fazer login com email e senha validos', () => {
    cy.get('[data-cy=email-input]').type('teste@email.com')
    cy.get('[data-cy=password-input]').type('Senha123!')
    cy.get('[data-cy=login-button]').click()
    cy.url().should('eq', Cypress.config().baseUrl + '/')
    cy.get('[data-cy=user-menu]').should('be.visible')
  })

  it('deve mostrar erro com credenciais invalidas', () => {
    cy.get('[data-cy=email-input]').type('invalido@email.com')
    cy.get('[data-cy=password-input]').type('senhaerrada')
    cy.get('[data-cy=login-button]').click()
    cy.get('[data-cy=error-message]').should('be.visible')
  })

  it('deve redirecionar para registro', () => {
    cy.get('[data-cy=register-link]').click()
    cy.url().should('include', '/register')
  })

  it('deve mostrar/ocultar senha', () => {
    cy.get('[data-cy=password-input]').type('Senha123!')
    cy.get('[data-cy=toggle-password]').click()
    cy.get('[data-cy=password-input]').should('have.attr', 'type', 'text')
  })
})
```

**register.cy.ts**
```typescript
describe('Registro', () => {
  beforeEach(() => {
    cy.visit('/register')
  })

  it('deve criar conta com dados validos', () => {
    cy.get('[data-cy=name-input]').type('Joao Silva')
    cy.get('[data-cy=email-input]').type(`test${Date.now()}@email.com`)
    cy.get('[data-cy=password-input]').type('Senha123!')
    cy.get('[data-cy=confirm-password-input]').type('Senha123!')
    cy.get('[data-cy=terms-checkbox]').check()
    cy.get('[data-cy=register-button]').click()
    cy.url().should('eq', Cypress.config().baseUrl + '/')
  })

  it('deve validar senhas diferentes', () => {
    cy.get('[data-cy=password-input]').type('Senha123!')
    cy.get('[data-cy=confirm-password-input]').type('SenhaDiferente!')
    cy.get('[data-cy=register-button]').click()
    cy.get('[data-cy=password-mismatch-error]').should('be.visible')
  })

  it('deve validar email invalido', () => {
    cy.get('[data-cy=email-input]').type('emailinvalido')
    cy.get('[data-cy=email-input]').blur()
    cy.get('[data-cy=email-error]').should('be.visible')
  })

  it('deve exigir aceite dos termos', () => {
    cy.get('[data-cy=name-input]').type('Teste')
    cy.get('[data-cy=email-input]').type('test@email.com')
    cy.get('[data-cy=password-input]').type('Senha123!')
    cy.get('[data-cy=confirm-password-input]').type('Senha123!')
    cy.get('[data-cy=register-button]').click()
    cy.get('[data-cy=terms-error]').should('be.visible')
  })
})
```

#### 2. Institutions (institutions/)

**list.cy.ts**
```typescript
describe('Lista de Instituicoes', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('deve carregar lista de instituicoes', () => {
    cy.get('[data-cy=institution-card]').should('have.length.at.least', 1)
  })

  it('deve mostrar loading enquanto carrega', () => {
    cy.get('[data-cy=loading-skeleton]').should('be.visible')
    cy.get('[data-cy=institution-card]', { timeout: 10000 }).should('be.visible')
  })

  it('deve mostrar informacoes basicas no card', () => {
    cy.get('[data-cy=institution-card]').first().within(() => {
      cy.get('[data-cy=institution-name]').should('be.visible')
      cy.get('[data-cy=institution-type]').should('be.visible')
      cy.get('[data-cy=institution-distance]').should('be.visible')
    })
  })

  it('deve navegar para detalhes ao clicar', () => {
    cy.get('[data-cy=institution-card]').first().click()
    cy.url().should('include', '/institution/')
  })
})
```

**filter.cy.ts**
```typescript
describe('Filtros de Instituicoes', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('deve filtrar por tipo', () => {
    cy.get('[data-cy=filter-type]').click()
    cy.get('[data-cy=filter-option-education]').click()
    cy.get('[data-cy=institution-card]').each(($card) => {
      cy.wrap($card).find('[data-cy=institution-type]').should('contain', 'Educacao')
    })
  })

  it('deve filtrar por distancia', () => {
    cy.get('[data-cy=filter-distance]').click()
    cy.get('[data-cy=filter-option-5km]').click()
    cy.get('[data-cy=institution-card]').each(($card) => {
      cy.wrap($card).find('[data-cy=institution-distance]')
        .invoke('text')
        .then((text) => {
          const distance = parseFloat(text)
          expect(distance).to.be.lessThan(5)
        })
    })
  })

  it('deve buscar por texto', () => {
    cy.get('[data-cy=search-input]').type('Esperanca')
    cy.get('[data-cy=institution-card]').should('have.length.at.least', 1)
    cy.get('[data-cy=institution-name]').first().should('contain', 'Esperanca')
  })

  it('deve limpar filtros', () => {
    cy.get('[data-cy=filter-type]').click()
    cy.get('[data-cy=filter-option-education]').click()
    cy.get('[data-cy=clear-filters]').click()
    cy.get('[data-cy=filter-type]').should('not.have.class', 'active')
  })
})
```

**map.cy.ts**
```typescript
describe('Mapa de Instituicoes', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('deve exibir mapa com markers', () => {
    cy.get('[data-cy=map-container]').should('be.visible')
    cy.get('.leaflet-marker-icon').should('have.length.at.least', 1)
  })

  it('deve abrir popup ao clicar no marker', () => {
    cy.get('.leaflet-marker-icon').first().click()
    cy.get('.leaflet-popup').should('be.visible')
    cy.get('[data-cy=popup-institution-name]').should('be.visible')
  })

  it('deve centralizar no usuario com geolocalizacao', () => {
    cy.window().then((win) => {
      cy.stub(win.navigator.geolocation, 'getCurrentPosition').callsFake((cb) => {
        cb({ coords: { latitude: -23.5505, longitude: -46.6333 } })
      })
    })
    cy.get('[data-cy=center-on-user]').click()
    // Verificar que mapa centralizou
  })
})
```

#### 3. Donations (donations/)

**create.cy.ts**
```typescript
describe('Criar Doacao', () => {
  beforeEach(() => {
    cy.login() // Custom command
    cy.visit('/institution/1')
  })

  it('deve abrir dialog de doacao', () => {
    cy.get('[data-cy=donate-button]').first().click()
    cy.get('[data-cy=donation-dialog]').should('be.visible')
  })

  it('deve criar doacao com dados validos', () => {
    cy.get('[data-cy=donate-button]').first().click()
    cy.get('[data-cy=donation-description]').type('10kg de arroz e feijao')
    cy.get('[data-cy=donation-quantity]').type('10kg')
    cy.get('[data-cy=donation-message]').type('Espero que ajude!')
    cy.get('[data-cy=submit-donation]').click()
    cy.get('[data-cy=success-message]').should('be.visible')
  })

  it('deve validar campos obrigatorios', () => {
    cy.get('[data-cy=donate-button]').first().click()
    cy.get('[data-cy=submit-donation]').click()
    cy.get('[data-cy=description-error]').should('be.visible')
  })

  it('deve permitir agendar data', () => {
    cy.get('[data-cy=donate-button]').first().click()
    cy.get('[data-cy=donation-description]').type('Doacao teste')
    cy.get('[data-cy=schedule-checkbox]').check()
    cy.get('[data-cy=schedule-date]').click()
    cy.get('.v-date-picker-table button').not('[disabled]').first().click()
    cy.get('[data-cy=schedule-date]').should('not.have.value', '')
  })
})
```

**workflow.cy.ts**
```typescript
describe('Workflow de Doacao', () => {
  beforeEach(() => {
    cy.login()
  })

  it('deve mostrar doacao pendente', () => {
    cy.visit('/donations')
    cy.get('[data-cy=donation-status-pending]').should('be.visible')
  })

  it('deve permitir cancelar doacao pendente', () => {
    cy.visit('/donations')
    cy.get('[data-cy=donation-card]').first().within(() => {
      cy.get('[data-cy=cancel-donation]').click()
    })
    cy.get('[data-cy=confirm-cancel]').click()
    cy.get('[data-cy=donation-status-cancelled]').should('be.visible')
  })

  it('deve mostrar historico de status', () => {
    cy.visit('/donations/1')
    cy.get('[data-cy=status-timeline]').should('be.visible')
  })
})
```

#### 4. Notifications (notifications/)

**list.cy.ts**
```typescript
describe('Notificacoes', () => {
  beforeEach(() => {
    cy.login()
    cy.visit('/notifications')
  })

  it('deve listar notificacoes', () => {
    cy.get('[data-cy=notification-item]').should('have.length.at.least', 1)
  })

  it('deve filtrar por tipo', () => {
    cy.get('[data-cy=filter-type]').click()
    cy.get('[data-cy=filter-urgent]').click()
    cy.get('[data-cy=notification-item]').each(($item) => {
      cy.wrap($item).should('have.class', 'urgent')
    })
  })

  it('deve marcar como lida', () => {
    cy.get('[data-cy=notification-item]').first().within(() => {
      cy.get('[data-cy=mark-read]').click()
    })
    cy.get('[data-cy=notification-item]').first().should('have.class', 'read')
  })

  it('deve marcar todas como lidas', () => {
    cy.get('[data-cy=mark-all-read]').click()
    cy.get('[data-cy=notification-item].unread').should('not.exist')
  })

  it('deve deletar notificacao', () => {
    cy.get('[data-cy=notification-item]').then(($items) => {
      const count = $items.length
      cy.get('[data-cy=notification-item]').first().within(() => {
        cy.get('[data-cy=delete-notification]').click()
      })
      cy.get('[data-cy=notification-item]').should('have.length', count - 1)
    })
  })
})
```

#### 5. Favorites (favorites/)

**add-remove.cy.ts**
```typescript
describe('Favoritos', () => {
  beforeEach(() => {
    cy.login()
  })

  it('deve adicionar aos favoritos', () => {
    cy.visit('/institution/1')
    cy.get('[data-cy=favorite-button]').click()
    cy.get('[data-cy=favorite-button]').should('have.class', 'active')
  })

  it('deve remover dos favoritos', () => {
    cy.visit('/institution/1')
    cy.get('[data-cy=favorite-button]').click() // Adiciona
    cy.get('[data-cy=favorite-button]').click() // Remove
    cy.get('[data-cy=favorite-button]').should('not.have.class', 'active')
  })

  it('deve listar favoritos', () => {
    cy.visit('/favorites')
    cy.get('[data-cy=favorite-item]').should('have.length.at.least', 0)
  })

  it('deve persistir favoritos apos refresh', () => {
    cy.visit('/institution/1')
    cy.get('[data-cy=favorite-button]').click()
    cy.reload()
    cy.get('[data-cy=favorite-button]').should('have.class', 'active')
  })
})
```

### Custom Commands (support/commands.ts)

```typescript
declare global {
  namespace Cypress {
    interface Chainable {
      login(email?: string, password?: string): Chainable<void>
      logout(): Chainable<void>
      resetDatabase(): Chainable<void>
    }
  }
}

Cypress.Commands.add('login', (email = 'test@compartilhamais.com', password = 'Test123!@#') => {
  cy.session([email, password], () => {
    cy.visit('/login')
    cy.get('[data-cy=email-input]').type(email)
    cy.get('[data-cy=password-input]').type(password)
    cy.get('[data-cy=login-button]').click()
    cy.url().should('not.include', '/login')
  })
})

Cypress.Commands.add('logout', () => {
  cy.get('[data-cy=user-menu]').click()
  cy.get('[data-cy=logout-button]').click()
  cy.url().should('include', '/login')
})

Cypress.Commands.add('resetDatabase', () => {
  cy.request('POST', `${Cypress.env('SUPABASE_URL')}/rest/v1/rpc/reset_test_data`, {}, {
    headers: {
      'apikey': Cypress.env('SUPABASE_ANON_KEY'),
      'Authorization': `Bearer ${Cypress.env('SUPABASE_SERVICE_KEY')}`
    }
  })
})
```

### Scripts package.json

```json
{
  "scripts": {
    "cy:open": "cypress open",
    "cy:run": "cypress run",
    "cy:run:headed": "cypress run --headed",
    "test:e2e": "start-server-and-test dev http://localhost:3000 cy:run",
    "test:e2e:open": "start-server-and-test dev http://localhost:3000 cy:open"
  }
}
```

### Data Attributes no Frontend

**IMPORTANTE**: Adicionar `data-cy` em todos os elementos testados:

```vue
<template>
  <v-text-field
    v-model="email"
    data-cy="email-input"
    label="Email"
  />
  <v-btn
    data-cy="login-button"
    @click="handleLogin"
  >
    Entrar
  </v-btn>
</template>
```

---

## ENTREGAVEIS

### Fase 1: Setup
- [ ] Projeto Supabase criado e configurado
- [ ] Tabelas criadas com SQL
- [ ] RLS policies configuradas
- [ ] Auth providers habilitados (Google, Facebook)

### Fase 2: Seed de Dados
- [ ] Script SQL/TS para 500 instituicoes
- [ ] Dados realistas (nomes, enderecos, coordenadas)
- [ ] 2-5 needs por instituicao (~1500 total)
- [ ] Usuarios de teste criados

### Fase 3: Integracao Frontend
- [ ] Supabase client configurado
- [ ] Auth migrado para Supabase
- [ ] Queries migradas
- [ ] Realtime para notifications

### Fase 4: Testes Cypress
- [ ] Setup Cypress completo
- [ ] Testes de auth (login, register)
- [ ] Testes de institutions (list, filter, detail, map)
- [ ] Testes de donations (create, workflow)
- [ ] Testes de notifications
- [ ] Testes de favorites
- [ ] Custom commands
- [ ] CI integration

### Fase 5: API Symfony (Logica Complexa)
- [ ] Conexao com Supabase PostgreSQL
- [ ] Endpoints de workflow de doacao
- [ ] Queries geoespaciais
- [ ] Stats e relatorios

---

## CREDENCIAIS E CONFIGURACAO

### Frontend (.env)
```env
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx
```

### Backend Symfony (.env)
```env
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=eyJxxx
DATABASE_URL=postgresql://postgres:xxx@db.xxx.supabase.co:5432/postgres
```

### Cypress (cypress.config.ts)
```typescript
env: {
  SUPABASE_URL: process.env.VITE_SUPABASE_URL,
  SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY
}
```

---

## OBSERVACOES FINAIS

1. **Seed realista e crucial** - Com 500 instituicoes bem distribuidas, da pra testar filtros, mapa, paginacao de verdade

2. **Testes cobrem fluxos criticos** - Login, doacao, notificacoes sao o core do app

3. **Data-cy em tudo** - Sem isso, os testes quebram

4. **Supabase simplifica muito** - Auth, storage, realtime prontos

5. **Symfony so pro necessario** - Workflow de doacao, geo queries, stats

---

Comece pelo Supabase (criar projeto, rodar SQLs), depois seed de dados, depois integrar frontend, depois testes Cypress. Pergunte se tiver duvidas!
