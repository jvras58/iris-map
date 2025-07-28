
# 🌈 IRIS Map - Sistema Colaborativo de Espaços Seguros LGBTQIA+ - Equipe Mapose

## 📚 Sumário

- [Sobre o Projeto](#sobre-o-projeto)
- [Stack Tecnológica Principal](#stack-tecnológica-principal)
- [Arquitetura do Projeto](#arquitetura-do-projeto)
- [Instalação e Configuração](#instalação-e-configuração)
- [Funcionalidades Principais](#funcionalidades-principais)
- [Documentação](#documentação)
- [Autores](#autores)
- [Licença](#licença)
- [Referências Técnicas](#referências-técnicas)

---

## 📖 Sobre o Projeto

O **Conexão Iris** é uma plataforma comunitária colaborativo é uma rede comunitária feita para pessoas LGBTQIAPN+.

![Next.js](https://img.shields.io/badge/Next.js-15.x.x-black)
![TypeScript](https://img.shields.io/badge/TypeScript-blue)
![Prisma](https://img.shields.io/badge/Prisma-5.x.x-2D3748)

---

## 🛠️ Stack Tecnológica Principal

Tecnologias principais utilizadas no projeto:

| **Categoria**         | **Tecnologia**    | **Versão**       |
|-----------------------|-------------------|------------------|
| **Runtime**           | Node.js           | v20.x.x          |
| **Frontend**          | Next.js           | v15.x.x          |
| **ORM**               | Prisma            | v5.x.x           |
| **Linguagem**         | TypeScript        | -                |
| **Componentes UI**    | shadcn/UI         | -                |
| **Gerenciador de pacotes** | pnpm         | v5.x.x           |

Outras bibliotecas:
- **Zod** para validação de dados
- **React Hook Form** para formulários
- **TanStack** para manipulação avançada de dados

---

## 🧱 Arquitetura do Projeto

Este é um projeto next.js com a seguinte estrutura principal:

```bash
IRIS-MAP/
├── components.json         # Configurações dos componentes shadcn/ui
├── eslint.config.mjs      # Configuração do ESLint
├── middleware.ts          # Proteção das rotas
├── next.config.ts         # Configuração do Next.js
├── package.json           # Dependências e scripts
├── README.md              # Documentação do projeto
├── app/                   # App Router do Next.js 15
│   ├── globals.css        # Estilos globais
│   ├── layout.tsx         # Layout raiz da aplicação
│   ├── page.tsx           # Landing page (página inicial)
│   ├── (auth)/            # Grupo de rotas - Autenticação
│   │   ├── layout.tsx     # Layout específico para auth
│   │   └── auth/
│   │       └── page.tsx   # Página de login/registro
│   ├── (map)/             # Grupo de rotas - Mapa
│   │   └── ...            # Páginas relacionadas ao mapa
│   └── api/               # API Routes
│       └── auth/          # Endpoints de autenticação (Auth.js)
│           └── [...nextauth]/
│               └── route.ts
├── components/            # Componentes globais reutilizáveis
│   ├── mode-toggle.tsx    # Toggle tema claro/escuro
│   ├── navbar.tsx         # Barra de navegação
│   └── ui/                # Componentes do shadcn/ui
├── lib/                   # Utilitários e configurações
│   ├── auth.ts            # Configuração Auth.js
│   ├── prisma.ts          # Cliente Prisma singleton
│   └── utils.ts           # Funções utilitárias
├── modules/               # Feature modules (Domain-driven)
│   └── auth/              # Módulo de autenticação
│       ├── actions/       # Server Actions
│       │   └── register.ts
│       ├── components/    # Componentes específicos
│       │   ├── AuthTabsClient.tsx
│       │   ├── LoginForm.tsx
│       │   ├── navbar.tsx
│       │   └── RegisterForm.tsx
│       ├── hooks/         # Hooks customizados
│       │   └── use-auth-tabs.tsx
│       └── schemas/       # Schemas de validação (Zod)
│           ├── login-schema.ts
│           └── register-schema.ts
├── prisma/                # Configuração do banco de dados
│   ├── schema.prisma      # Modelos e schema do BD
│   └── migrations/        # Histórico de migrações
├── providers/             # Context Providers
│   ├── queryProviders.tsx # TanStack Query
│   ├── root-app-provider.tsx # Provider principal
│   └── theme-provider.tsx # Tema shadcn/ui
└── docs/                  # Documentação adicional
    ├── iris.md           # Documentação técnica
    └── DBML.png          # Diagrama do banco

```



---

## ⚙️ Instalação e Configuração

Siga os passos abaixo para rodar o projeto localmente:

### 1. Clone o repositório

```bash
git clone https://github.com/[SEU-USER]/iris-mapa
cd iris-map
```

### 2. Instale as dependências

```bash
pnpm install
```

### 3. Configure variáveis de ambiente

Crie um arquivo `.env` baseado em `.env-example` com as credenciais necessárias.

### 4. Configure o banco de dados

```bash
npx prisma generate
npx prisma db push
pnpm run db:seed
```

### 5. Inicie o ambiente de desenvolvimento

```bash
pnpm dev
```

Acesse em: [http://localhost:3000](http://localhost:3000)

---

## 💻 Funcionalidades Principais

* Página inicial
* Mapa interativo

## WEB:


## Funcionalidades:
[🔗 Acesse a Landing Page](http://localhost:3000/)
[Auth Page](http://localhost:3000/auth)
[Mapa](http://localhost:3000/map)

## 📖 Testes:

Execute os testes do projeto com os comandos abaixo:

| Comando                | Descrição                                              |
|------------------------|--------------------------------------------------------|
| `pnpm run test`        | Executa todos os testes uma vez (modo padrão)          |
| `pnpm run test:watch`  | Executa os testes em modo watch (atualização contínua) |
| `pnpm run test:cov`    | Executa os testes e exibe o relatório de cobertura     |

---

## 📘 Documentação

> Documentação técnica interna detalhada:

[📁 Documentação Técnica do Projeto](/docs/iris.md)

[📄DBML BANCO DE DADOS](/docs/DBML.png)

---

## 🧑‍💻 Autores

* [Jonathas-Vinicius](https://github.com/jvras58)
* [Rafael-Samico](https://github.com/rafaelsamico)
* [Antonio-Rodrigues](https://github.com/AntonioCar0lin0)


---

## 📜 Licença

Este projeto ainda não possui uma licença definida.

---

## 🔍 Referências Técnicas

* [Next.js 15 Docs](https://nextjs.org/docs/getting-started)
* [Next.js Caching](https://nextjs.org/docs/app/building-your-application/caching)
* [TanStack](https://tanstack.com/)
* [React Hook Form](https://react-hook-form.com/)
* [Zod](https://zod.dev/)
