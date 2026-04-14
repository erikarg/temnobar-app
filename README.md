# TemNoBar Mobile

Aplicativo mobile desenvolvido com **Expo (React Native + TypeScript)** para gerenciamento de produtos de bar, com foco em usabilidade, performance e organização de dados.  

Este projeto funciona como complemento da aplicação web [temnobar-web](../temnobar-web), formando um ecossistema completo para gestão de bares.

---

## ✨ Principais Funcionalidades

- 🔐 Autenticação completa (Login / Cadastro) com Bearer Token persistido
- 🍺 Seleção e criação de bares
- 📦 Gestão completa de produtos (CRUD)
- 🔎 Busca e filtro por status (ativo/inativo)
- 🖼️ Upload de imagens com preview em tempo real
- 🎯 Destaque visual para produtos ativos e sinalização clara para inativos

---

## 🚀 Stack Tecnológica

- **Expo SDK 52** (React Native 0.76)
- **React Navigation** (Native Stack)
- **Axios** com interceptor para autenticação
- **React Hook Form + Zod** para validação robusta
- **expo-image-picker** para manipulação de imagens
- **AsyncStorage** para persistência de sessão

---

## 🧠 Decisões Técnicas

- Estrutura modular com separação clara entre **contextos, serviços e UI**
- Uso de **interceptors no Axios** para centralizar autenticação
- Validação tipada com **Zod**, garantindo consistência entre front e back
- Persistência de sessão desacoplada da UI via **Context API**
- Foco em **componentização reutilizável** e escalável

---

## 📁 Estrutura do Projeto

```
src/
  context/       AuthContext (gerenciamento de sessão)
  services/      Configuração da API + módulos (auth, bar, product, upload)
  types/         Tipagens TypeScript (User, Bar, Product)
  hooks/         useProducts
  components/    Componentes reutilizáveis (Button, Input, etc.)
  screens/       Telas da aplicação
  navigation/    Navegação (fluxo autenticado)
```

---

## ⚙️ Como Executar

```bash
npm install
npx expo start
```

- Pressione `i` para abrir no simulador iOS  
- Pressione `a` para abrir no emulador Android  

---

## 🌐 Configuração de Ambiente

Crie um arquivo `.env` baseado no `.env.example`:

```
EXPO_PUBLIC_API_URL=http://localhost:3333/api/v1
```

- iOS Simulator: `localhost`
- Android Emulator: `10.0.2.2`

---

## 🔗 Integração com API

Este app consome a [temnobar-api](../temnobar-api).

- A API deve retornar um campo `token` nas autenticações
- As imagens são hospedadas no **Cloudinary** e consumidas como URLs completas
