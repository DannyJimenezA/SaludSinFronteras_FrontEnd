import { api } from "../lib/api";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

// Login
export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>("/login", payload);
  return data;
}

// Register fake
export async function register(payload: LoginPayload): Promise<{ id: string; token: string }> {
  const { data } = await api.post<{ id: string; token: string }>("/register", payload);
  return data;
}
