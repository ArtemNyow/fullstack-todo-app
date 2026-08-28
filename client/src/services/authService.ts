import { api } from "@/lib/api";
import type { AuthResponse } from "@/types/auth";

interface AuthCredentials {
  email: string;
  password: string;
}

export const register = async (
  credentials: AuthCredentials,
): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>("/auth/register", credentials);

  return data;
};

export const login = async (
  credentials: AuthCredentials,
): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>("/auth/login", credentials);

  return data;
};
