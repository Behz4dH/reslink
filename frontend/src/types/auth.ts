export interface User {
  id: number;
  username: string;
  email: string;
  role: 'superuser' | 'guest';
  created_date: string;
  last_login?: string;
  is_active: boolean;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  isLoading: boolean;
}

// Explicit type-only exports for verbatimModuleSyntax compatibility
export type { User, LoginRequest, AuthResponse, AuthContextType };