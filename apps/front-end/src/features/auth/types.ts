export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  name: string;
}

export interface AuthUser {
  name: string;
  email: string;
  token: string;
}
