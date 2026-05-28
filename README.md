# ServiceGO

> Plataforma digital de intermediação de serviços — conectando clientes a prestadores verificados com transparência, avaliações reais e acompanhamento em tempo real.

**Demo ao vivo:** [service-go-ten.vercel.app](https://service-go-ten.vercel.app)

---

## Sobre o Projeto

ServiceGO é um marketplace de serviços profissionais desenvolvido como projeto de extensão universitária. A plataforma resolve o problema de encontrar profissionais confiáveis, centralizando a busca, contratação e avaliação de prestadores de serviço em um único lugar.

### Funcionalidades

- **Landing page** com apresentação das categorias de serviço
- **Autenticação segura** com JWT (cadastro e login separados por papel: cliente / prestador)
- **Dashboard** com:
  - Visão geral de solicitações e estatísticas
  - Busca e filtragem de serviços
  - Gerenciamento de solicitações por status
  - Sistema de avaliações
  - Perfil do usuário
- **API REST** completa com backend independente

---

## Stack Tecnológica

### Frontend
| Tecnologia | Versão | Função |
|-----------|--------|--------|
| React | 18.3 | UI declarativa |
| TypeScript | 5.8 | Tipagem estática |
| Vite | 8.0 | Build tool |
| Tailwind CSS | 3.4 | Estilização |
| Radix UI | — | Componentes acessíveis |
| React Router | 6.30 | Roteamento SPA |
| TanStack Query | 5.83 | Cache e estado servidor |
| React Hook Form + Zod | — | Formulários validados |
| Framer Motion | — | Animações |

### Backend
| Tecnologia | Versão | Função |
|-----------|--------|--------|
| Node.js + Express | — | Servidor HTTP |
| TypeScript | 5.x | Tipagem |
| Prisma ORM | — | Acesso ao banco |
| PostgreSQL | — | Banco de dados |
| JWT (jsonwebtoken) | — | Autenticação |
| bcryptjs | — | Hash de senhas |
| Helmet | — | Headers de segurança |
| express-rate-limit | — | Proteção anti-bruteforce |
| Zod | — | Validação de schemas |

### Infraestrutura
- **Frontend:** Vercel (deploy automático via Git)
- **Backend:** Variável de ambiente `VITE_API_URL`
- **Banco:** PostgreSQL (provisionado separadamente)

---

## Segurança

- Senhas com hash bcrypt (salt rounds: 12)
- JWT com expiração configurável
- Rate limiting geral (200 req/15min) + rate limiting estrito em `/api/auth` (10 req/15min)
- Helmet.js com headers de segurança (CSP, HSTS, X-Frame-Options, etc.)
- CORS configurado por allowlist de origens
- Validação de schema Zod em todas as rotas de entrada
- Token armazenado em `sessionStorage` (limpo ao fechar a aba)

---

## Estrutura do Projeto

```
ServiceGO/
├── src/                        # Frontend React
│   ├── components/
│   │   ├── landing/            # Seções da landing page
│   │   ├── auth/               # Componentes de autenticação
│   │   └── ui/                 # Design system (Radix + Tailwind)
│   ├── contexts/               # AuthContext
│   ├── features/dashboard/     # Módulo completo do dashboard
│   ├── hooks/                  # Hooks reutilizáveis
│   ├── lib/                    # api.ts, validation.ts, utils.ts
│   └── pages/                  # Index, Login, Cadastro, Dashboard, 404
│
└── servicego-api/              # Backend Express
    ├── src/
    │   ├── modules/            # auth, users, listings, requests, reviews
    │   ├── middleware/         # auth.middleware, error.middleware
    │   ├── config/             # env.ts
    │   └── main.ts             # Entry point
    └── prisma/
        └── schema.prisma       # Modelos: User, Listing, Request, Review
```

---

## Rodando Localmente

### Pré-requisitos
- Node.js 18+
- PostgreSQL

### Frontend

```bash
npm install
npm run dev
```

### Backend

```bash
cd servicego-api
npm install
cp .env.example .env   # preencha as variáveis
npx prisma migrate dev
npx prisma db seed
npm run dev
```

### Variáveis de ambiente necessárias

**Frontend (`.env.local`):**
```
VITE_API_URL=http://localhost:3000
```

**Backend (`.env`):**
```
DATABASE_URL=postgresql://user:password@localhost:5432/servicego
JWT_SECRET=sua_chave_secreta_aqui
JWT_EXPIRES_IN=7d
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

---

## Papéis de Usuário

| Papel | Descrição |
|-------|-----------|
| `cliente` | Busca e solicita serviços, avalia prestadores |
| `prestador` | Cria anúncios, aceita/gerencia solicitações |

---

## Autores

Projeto de extensão universitária — 2025/2026.
