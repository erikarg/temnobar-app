# TemNoBar Mobile

![Expo](https://img.shields.io/badge/Expo-52-000020?logo=expo&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-0.76-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)

> **Tem no bar? Tem.** O app que coloca o cardapio do seu bar na palma da mao.

Aplicativo mobile desenvolvido com **Expo (React Native + TypeScript)** para gerenciamento de produtos de bar, com foco em usabilidade, performance e organizacao de dados.

Este projeto funciona como complemento da aplicacao web [temnobar-web](../temnobar-web), formando um ecossistema completo para gestao de bares.

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Framework | Expo SDK 52 (React Native 0.76) |
| Linguagem | TypeScript |
| Navegacao | React Navigation (Native Stack) |
| Formularios | React Hook Form + Zod |
| HTTP Client | Axios |
| Autenticacao | Bearer Token (AsyncStorage) |
| Upload | expo-image-picker |

---

## Inicio Rapido

### Pre-requisitos

- Node.js 20+
- [TemNoBar API](https://github.com/erikarg/temnobar-api) rodando localmente ou em producao

### Instalacao

```bash
# Clone o repositorio
git clone https://github.com/erikarg/temnobar-app.git
cd temnobar-app

# Instale as dependencias
npm install

# Configure as variaveis de ambiente
cp .env.example .env

# Inicie o servidor de desenvolvimento
npx expo start
```

Pressione `i` para abrir no simulador iOS ou `a` para o emulador Android.

### Variaveis de Ambiente

| Variavel | Descricao | Exemplo |
|----------|-----------|---------|
| `EXPO_PUBLIC_API_URL` | URL base da API (com `/api/v1`) | `http://localhost:3333/api/v1` |

> iOS Simulator: `localhost` resolve para o Mac. Android Emulator: use `10.0.2.2`.

---

## Arquitetura

```
temnobar-app/
├── App.tsx                    # Entry point (AuthProvider + Navigator)
├── src/
│   ├── context/               # Gerenciamento de sessao
│   │   └── AuthContext.tsx     #   Login, registro, logout, selecao de bar
│   ├── navigation/            # Navegacao
│   │   └── AppNavigator.tsx   #   Stack autenticado/nao-autenticado
│   ├── screens/               # Telas da aplicacao
│   │   ├── LoginScreen.tsx
│   │   ├── RegisterScreen.tsx
│   │   ├── SelectBarScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── NewProductScreen.tsx
│   │   └── EditProductScreen.tsx
│   ├── components/            # Componentes reutilizaveis
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── ProductCard.tsx
│   │   └── ProductForm.tsx
│   ├── hooks/                 # Hooks customizados
│   │   └── useProducts.ts     #   Listagem com filtros
│   ├── services/              # Camada de comunicacao com a API
│   │   ├── api.ts             #   Instancia Axios + interceptor Bearer
│   │   ├── auth.service.ts
│   │   ├── bar.service.ts
│   │   ├── product.service.ts
│   │   └── upload.service.ts
│   └── types/                 # Definicoes de tipos
│       ├── user.ts
│       ├── bar.ts
│       └── product.ts
```

---

## Funcionalidades

### Autenticação

- Login e registro com validacao de formulario (Zod)
- Sessao via Bearer Token persistido com AsyncStorage
- Navegacao condicional (auth stack vs app stack)
- Logout com limpeza de token

### Seleção de Bar

- Lista de bares disponiveis
- Criacao de novo bar com geracao automatica de slug
- Vinculacao do usuario ao bar selecionado

### Catálogo de Produtos

- Listagem em grid de 2 colunas
- Busca por descricao em tempo real
- Filtro por status (Ativo / Inativo)
- Contagem total de produtos
- Estado vazio com acao contextual

### CRUD de Produtos

- Formulario de criacao e edicao com os mesmos componentes
- Upload de imagem com preview instantaneo (expo-image-picker)
- Imagens hospedadas no Cloudinary e consumidas como URLs completas
- Exibicao de thumbnail no card do produto
- Exclusao com confirmacao via Alert nativo

---

## Integracao com API

Este app consome a [temnobar-api](../temnobar-api).

- A API deve retornar um campo `token` nas respostas de login/registro
- As imagens sao hospedadas no **Cloudinary** e retornadas como URLs completas

---

## Licenca

Este projeto e de uso pessoal. Consulte o autor para permissoes de uso.
