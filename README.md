# TemNoBar Mobile

![Expo](https://img.shields.io/badge/Expo-52-000020?logo=expo&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-0.76-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)

> **Tem no bar? Tem.** The app that puts your bar's menu in the palm of your hand.

Mobile app built with **Expo (React Native + TypeScript)** for bar staff to manage their menu: sign in, pick a bar and create, edit or delete products with photos.

It is part of the TemNoBar trio:

| Repo | What it is | Live |
|------|-----------|------|
| [temnobar-api](https://github.com/erikarg/temnobar-api) | REST API (Express + Prisma + PostgreSQL) | https://temnobar-api.vercel.app ([docs](https://temnobar-api.vercel.app/docs)) |
| [temnobar-web](https://github.com/erikarg/temnobar-web) | Web back office and public menu (Next.js) | https://temnobar-web.vercel.app |
| **temnobar-app** | This mobile app (Expo) | — |

---

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Expo SDK 52 (React Native 0.76) |
| Language | TypeScript |
| Navigation | React Navigation (Native Stack) |
| Forms | React Hook Form + Zod |
| HTTP client | Axios |
| Auth | httpOnly session cookie set by the API |
| Images | expo-image-picker → API upload → Cloudinary |

---

## Getting started

### Prerequisites

- Node.js 20+
- A running [TemNoBar API](https://github.com/erikarg/temnobar-api) — local, or the live one at `https://temnobar-api.vercel.app/api/v1`
- Android Studio (Android emulator) and/or Xcode (iOS simulator) for a local native build

### Install

```bash
git clone https://github.com/erikarg/temnobar-app.git
cd temnobar-app
npm install
cp .env.example .env   # then set EXPO_PUBLIC_API_URL
```

### Run

This project stays on **Expo SDK 52**. The Expo Go app from the stores follows the newest SDK, and the current Expo docs only list SDK 54 and later. Whether a store build of Expo Go still opens an SDK 52 project has **not been verified**. The reliable route is a local native (debug) build, which runs the app against Metro:

```bash
npx expo run:android   # Android emulator or USB device (needs Android SDK)
npx expo run:ios       # iOS simulator (needs Xcode, macOS only)
```

Once the native app is installed, `npx expo start` is enough to serve new JS changes to it. If you do have an Expo Go build that supports SDK 52 (for example one the Expo CLI installs on a simulator), `npx expo start` and pressing `a` / `i` also works.

To check that the JS bundle builds without a device:

```bash
npx expo export --platform android
```

### Environment variables

| Variable | Description | Example |
|----------|-------------|---------|
| `EXPO_PUBLIC_API_URL` | API base URL, including `/api/v1` | `http://localhost:3333/api/v1` |

`EXPO_PUBLIC_*` values are inlined into the bundle at build time, so restart Metro after changing them. iOS simulator: `localhost` is your Mac. Android emulator: use `10.0.2.2` instead of `localhost`. A physical device needs your machine's LAN IP or the live https API.

### Checks

```bash
npx tsc --noEmit        # type check
npx expo-doctor         # Expo config and SDK 52 dependency versions
```

There is no ESLint setup in this project.

---

## How auth works

The API never returns the JWT in a response body. On `login`, `register` and `select-bar` it sets it as an **httpOnly cookie** (`token`, 7 days).

- React Native's native networking keeps that cookie and sends it back automatically: `api.ts` creates Axios with `withCredentials: true`, which iOS maps to `HTTPShouldHandleCookies` and Android to its persistent cookie jar. The app never sees or stores the token.
- On start, the app calls `GET /auth/me`. A valid cookie restores the session; a `401` shows the login screen.
- `POST /auth/logout` makes the API clear the cookie.
- The API's CSRF origin guard only rejects requests whose `Origin` header is not allowed. Native requests send no `Origin`, so they pass.
- In production the cookie is `Secure; SameSite=None`, so the API must be on **https** (as the live one is). In development it is `SameSite=Lax` and not `Secure`, so it also works over plain http.

The API also accepts `Authorization: Bearer <token>`, but the app has no token to send, so it does not use it.

---

## Architecture

```
temnobar-app/
├── App.tsx                    # Entry point (AuthProvider + Navigator)
├── app.json                   # Expo config
└── src/
    ├── context/AuthContext.tsx   # Session: login, register, select bar, logout
    ├── navigation/AppNavigator.tsx
    ├── screens/               # Login, Register, SelectBar, Home, New/EditProduct
    ├── components/            # Button, Input, ProductCard, ProductForm
    ├── hooks/useProducts.ts   # List with filters
    ├── services/              # Axios instance and one module per API resource
    └── types/                 # user, bar, product
```

---

## Features

- **Auth:** login and sign-up with form validation (Zod); the stack switches between signed-out and signed-in screens.
- **Bar selection:** list bars, create one (slug generated from the name) and link the user to it.
- **Products:** 2-column grid, live search by description, filter by status (active / inactive), total count, empty state.
- **Create / edit / delete:** one form for both; photo picked from the library, uploaded to the API (stored on Cloudinary, returned as full https URLs); delete asks for confirmation.

The API also returns `preco` (price in cents), `tags` and `category_id`. They are typed, but the app does not show or edit them yet. Editing a product keeps them, because the update only sends the fields the form changes.

---

## License

Personal-use project. Ask the author before reusing it.

---

<details>
<summary>Português</summary>

# TemNoBar Mobile

> **Tem no bar? Tem.** O app que coloca o cardápio do seu bar na palma da mão.

App mobile feito com **Expo (React Native + TypeScript)** para a equipe do bar gerenciar o cardápio: entrar, escolher o bar e criar, editar ou excluir produtos com foto.

Faz parte do trio TemNoBar:

| Repositório | O que é | No ar |
|-------------|---------|-------|
| [temnobar-api](https://github.com/erikarg/temnobar-api) | API REST (Express + Prisma + PostgreSQL) | https://temnobar-api.vercel.app ([docs](https://temnobar-api.vercel.app/docs)) |
| [temnobar-web](https://github.com/erikarg/temnobar-web) | Back office web e cardápio público (Next.js) | https://temnobar-web.vercel.app |
| **temnobar-app** | Este app mobile (Expo) | — |

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Framework | Expo SDK 52 (React Native 0.76) |
| Linguagem | TypeScript |
| Navegação | React Navigation (Native Stack) |
| Formulários | React Hook Form + Zod |
| HTTP | Axios |
| Autenticação | Cookie de sessão httpOnly definido pela API |
| Imagens | expo-image-picker → upload na API → Cloudinary |

## Início rápido

### Pré-requisitos

- Node.js 20+
- A [TemNoBar API](https://github.com/erikarg/temnobar-api) rodando — local, ou a do ar em `https://temnobar-api.vercel.app/api/v1`
- Android Studio (emulador Android) e/ou Xcode (simulador iOS) para o build nativo local

### Instalação

```bash
git clone https://github.com/erikarg/temnobar-app.git
cd temnobar-app
npm install
cp .env.example .env   # depois ajuste EXPO_PUBLIC_API_URL
```

### Execução

O projeto continua no **Expo SDK 52**. O Expo Go das lojas acompanha o SDK mais recente, e a documentação atual da Expo só lista o SDK 54 em diante. **Não foi verificado** se uma versão do Expo Go das lojas ainda abre um projeto SDK 52. O caminho confiável é um build nativo local (debug), que roda o app ligado ao Metro:

```bash
npx expo run:android   # emulador Android ou aparelho via USB (precisa do Android SDK)
npx expo run:ios       # simulador iOS (precisa do Xcode, só no macOS)
```

Com o app nativo instalado, `npx expo start` basta para enviar as mudanças de JS. Se você tiver um Expo Go compatível com o SDK 52 (por exemplo, um que o Expo CLI instale no simulador), `npx expo start` e as teclas `a` / `i` também funcionam.

Para conferir que o bundle JS compila sem aparelho:

```bash
npx expo export --platform android
```

### Variáveis de ambiente

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `EXPO_PUBLIC_API_URL` | URL base da API, com `/api/v1` | `http://localhost:3333/api/v1` |

Variáveis `EXPO_PUBLIC_*` são embutidas no bundle no build, então reinicie o Metro depois de mudá-las. Simulador iOS: `localhost` é o seu Mac. Emulador Android: use `10.0.2.2` no lugar de `localhost`. Em aparelho físico, use o IP da sua máquina na rede local ou a API https do ar.

### Verificações

```bash
npx tsc --noEmit        # checagem de tipos
npx expo-doctor         # config do Expo e versões das dependências do SDK 52
```

O projeto não tem ESLint configurado.

## Como funciona a autenticação

A API nunca devolve o JWT no corpo da resposta. Em `login`, `register` e `select-bar`, ela o envia como **cookie httpOnly** (`token`, 7 dias).

- A rede nativa do React Native guarda esse cookie e o reenvia sozinha: o `api.ts` cria o Axios com `withCredentials: true`, que no iOS vira `HTTPShouldHandleCookies` e no Android usa o cookie jar persistente. O app nunca vê nem guarda o token.
- Ao abrir, o app chama `GET /auth/me`. Com cookie válido, a sessão volta; com `401`, aparece o login.
- `POST /auth/logout` faz a API apagar o cookie.
- A proteção contra CSRF da API só rejeita requisições cujo header `Origin` não esteja liberado. Requisições nativas não enviam `Origin`, então passam.
- Em produção o cookie é `Secure; SameSite=None`, então a API precisa estar em **https** (como a do ar). Em desenvolvimento ele é `SameSite=Lax` e não é `Secure`, então funciona também em http.

A API também aceita `Authorization: Bearer <token>`, mas o app não tem token para enviar, então não usa esse caminho.

## Arquitetura

```
temnobar-app/
├── App.tsx                    # Entrada (AuthProvider + Navigator)
├── app.json                   # Config do Expo
└── src/
    ├── context/AuthContext.tsx   # Sessão: login, registro, seleção de bar, logout
    ├── navigation/AppNavigator.tsx
    ├── screens/               # Login, Register, SelectBar, Home, New/EditProduct
    ├── components/            # Button, Input, ProductCard, ProductForm
    ├── hooks/useProducts.ts   # Listagem com filtros
    ├── services/              # Instância do Axios e um módulo por recurso da API
    └── types/                 # user, bar, product
```

## Funcionalidades

- **Autenticação:** login e cadastro com validação (Zod); a navegação alterna entre as telas de quem está ou não logado.
- **Seleção de bar:** lista os bares, cria um novo (slug gerado a partir do nome) e vincula o usuário a ele.
- **Produtos:** grid de 2 colunas, busca por descrição em tempo real, filtro por status (ativo / inativo), contagem total e estado vazio.
- **Criar / editar / excluir:** o mesmo formulário para os dois casos; foto escolhida da galeria e enviada à API (guardada no Cloudinary e devolvida como URL https completa); exclusão com confirmação.

A API também devolve `preco` (preço em centavos), `tags` e `category_id`. Eles estão tipados, mas o app ainda não os mostra nem edita. Editar um produto os preserva, porque a atualização só envia os campos que o formulário altera.

## Licença

Projeto de uso pessoal. Consulte a autora antes de reutilizar.

</details>
