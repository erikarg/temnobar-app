# TemNoBar Mobile

![Expo](https://img.shields.io/badge/Expo-52-000020?logo=expo&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-0.76-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)

> **Tem no bar? Tem.** O app que coloca o cardápio do seu bar na palma da mão.

Aplicativo mobile desenvolvido com **Expo (React Native + TypeScript)** para gerenciamento de produtos de bar, com foco em usabilidade, performance e organização de dados.

Este projeto funciona como complemento da aplicação web [temnobar-web](https://github.com/erikarg/temnobar-web), formando um ecossistema completo para gestão de bares.

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Framework | Expo SDK 52 (React Native 0.76) |
| Linguagem | TypeScript |
| Navegação | React Navigation (Native Stack) |
| Formulários | React Hook Form + Zod |
| HTTP Client | Axios |
| Autenticação | Bearer Token (AsyncStorage) |
| Upload | expo-image-picker |

---

## Início Rápido

### Pré-requisitos

- Node.js 20+
- [TemNoBar API](https://github.com/erikarg/temnobar-api) rodando localmente ou em produção

### Instalação

```bash
# Clone o repositório
git clone https://github.com/erikarg/temnobar-app.git
cd temnobar-app

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env

# Inicie o servidor de desenvolvimento
npx expo start
```

Pressione `i` para abrir no simulador iOS ou `a` para o emulador Android.

### Variáveis de Ambiente

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `EXPO_PUBLIC_API_URL` | URL base da API (com `/api/v1`) | `http://localhost:3333/api/v1` |

> iOS Simulator: `localhost` resolve para o Mac. Android Emulator: use `10.0.2.2`.

---

## Arquitetura

```
temnobar-app/
├── App.tsx                    # Entry point (AuthProvider + Navigator)
├── src/
│   ├── context/               # Gerenciamento de sessão
│   │   └── AuthContext.tsx    # Login, registro, logout, seleção de bar
│   ├── navigation/            # Navegação
│   │   └── AppNavigator.tsx   # Stack autenticado/não autenticado
│   ├── screens/               # Telas da aplicação
│   │   ├── LoginScreen.tsx
│   │   ├── RegisterScreen.tsx
│   │   ├── SelectBarScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── NewProductScreen.tsx
│   │   └── EditProductScreen.tsx
│   ├── components/            # Componentes reutilizáveis
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── ProductCard.tsx
│   │   └── ProductForm.tsx
│   ├── hooks/                 # Hooks customizados
│   │   └── useProducts.ts     # Listagem com filtros
│   ├── services/              # Camada de comunicação com a API
│   │   ├── api.ts             # Instância Axios + interceptor Bearer
│   │   ├── auth.service.ts
│   │   ├── bar.service.ts
│   │   ├── product.service.ts
│   │   └── upload.service.ts
│   └── types/                 # Definições de tipos
│       ├── user.ts
│       ├── bar.ts
│       └── product.ts
```

---

## Funcionalidades

### Autenticação

- Login e registro com validação de formulário (Zod)
- Sessão via Bearer Token persistido com AsyncStorage
- Navegação condicional (auth stack vs app stack)
- Logout com limpeza do token

### Seleção de Bar

- Lista de bares disponíveis
- Criação de novo bar com geração automática de slug
- Vinculação do usuário ao bar selecionado

### Catálogo de Produtos

- Listagem em grid de 2 colunas
- Busca por descrição em tempo real
- Filtro por status (Ativo / Inativo)
- Contagem total de produtos
- Estado vazio com ação contextual

### CRUD de Produtos

- Formulário de criação e edição com os mesmos componentes
- Upload de imagem com preview instantâneo (expo-image-picker)
- Imagens hospedadas no Cloudinary e consumidas como URLs completas
- Exibição de thumbnail no card do produto
- Exclusão com confirmação via Alert nativo

---

## Integração com API

Este app consome a [temnobar-api](https://github.com/erikarg/temnobar-api).

- A API deve retornar um campo `token` nas respostas de login/registro
- As imagens são hospedadas no **Cloudinary** e retornadas como URLs completas

---

## Licença

Este projeto é de uso pessoal. Consulte o autor para permissões de uso.