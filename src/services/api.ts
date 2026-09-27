import axios from "axios";

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3333/api/v1";

// A sessao e o cookie httpOnly que a API envia no login: a camada de rede
// nativa guarda e reenvia o cookie, e a API nunca devolve o token no corpo.
export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});
