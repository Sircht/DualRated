# DualRated

DualRated é um aplicativo React Native que permite que casais avaliem experiências juntos. Cada pessoa registra suas avaliações e o app calcula a média do casal automaticamente.

## ✨ Funcionalidades

- Autenticação por e-mail e senha (via Supabase Auth)
- Configuração de perfil com nome e avatar
- Geração e consumo de links de pareamento para conectar parceiros
- Feed compartilhado com histórico de avaliações e média DualRated
- Adição de avaliações com notas de 0 a 10 e comentários opcionais
- Filtro por categoria, nota mínima e ordenação
- Tela de detalhes com comparativo das notas do casal

## 🧱 Arquitetura

- **Expo / React Native** para interface mobile (Android e iOS)
- **React Navigation** para navegação em pilha, tabs e modais
- **Context API** para sessão, pareamento e avaliações
- **Supabase** como backend (Auth + tabelas de perfis e reviews)
- **Zustand** para gerenciar filtros do feed

```
src/
├── components        # componentes visuais compartilhados
├── contexts          # provedores de contexto (auth + reviews)
├── navigation        # configuração de rotas
├── screens           # telas principais
├── services          # integrações com Supabase
├── store             # stores Zustand
├── styles            # tokens de design (cores, espaçamento)
└── utils             # utilidades diversas
```

## 🔧 Configuração

1. Instale as dependências

```bash
npm install
```

2. Configure as variáveis de ambiente no `.env` (Expo)

```
EXPO_PUBLIC_SUPABASE_URL=... 
EXPO_PUBLIC_SUPABASE_ANON_KEY=...
```

3. Garanta que as tabelas/views existam no Supabase:

```sql
-- perfis de usuário
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  email text,
  display_name text,
  avatar_url text,
  pair_id uuid,
  created_at timestamp with time zone default now()
);

-- avaliações individuais
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  pair_id uuid references public.profiles (pair_id),
  author_id uuid references public.profiles (id),
  name text,
  category text,
  rating numeric,
  comment text,
  created_at timestamp with time zone default now(),
  unique(pair_id, author_id, name, category)
);

-- view que une avaliações do casal
create or replace view public.dual_reviews_view as
select
  r.id,
  r.pair_id,
  r.author_id,
  r.name,
  r.category,
  r.rating,
  r.comment,
  r.created_at,
  pr_other.id as partner_id,
  pr_other.display_name as partner_name,
  r_other.rating as partner_rating,
  r_other.comment as partner_comment,
  case
    when r_other.rating is not null then (r.rating + r_other.rating) / 2
    else null
  end as average_rating
from public.reviews r
left join public.reviews r_other
  on r_other.pair_id = r.pair_id
 and r_other.name = r.name
 and r_other.category = r.category
 and r_other.author_id <> r.author_id
left join public.profiles pr_other
  on pr_other.id = r_other.author_id;
```

4. Execute o app em modo desenvolvimento

```bash
npm start
```

### 🎨 Ícones e splash screen

Este repositório não inclui arquivos binários de ícone ou splash para facilitar a revisão do código.
Para personalizar o branding antes de publicar, adicione seus arquivos em `assets/` e
atualize as referências correspondentes no `app.json` conforme necessário.

## ✅ Checklist rápido

- [x] Fluxo completo de login → criação de perfil → pareamento → feed
- [x] Componentes e telas seguindo a identidade DualRated
- [x] Integração com Supabase organizada em serviços reutilizáveis
- [x] Tokens de design para paleta, espaçamentos e sombras

## 📄 Licença

MIT
