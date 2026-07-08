import { APICall, type Tokens } from "../apiCall";
import { ENDPOINTS } from "../config";

export interface AuthUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

export interface AuthResponse {
  user: AuthUser;
  tokens: Tokens;
}

export function login(email: string, password: string) {
  return APICall<AuthResponse>(ENDPOINTS.auth.login, {
    method: "POST",
    body: { email, password },
    auth: false,
  });
}

export function register(input: {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}) {
  return APICall<AuthResponse>(ENDPOINTS.auth.register, {
    method: "POST",
    body: input,
    auth: false,
  });
}

export function getMe() {
  return APICall<AuthUser>(ENDPOINTS.auth.me);
}
