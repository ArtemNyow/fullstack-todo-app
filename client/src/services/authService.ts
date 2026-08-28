import { api } from "@/lib/api";
import type { AuthResponse, User } from "@/types/auth";

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

export const getCurrentUser = async (): Promise<User> => {
  const { data } = await api.get<{ user: User }>("/auth/me");

  return data.user;
};
