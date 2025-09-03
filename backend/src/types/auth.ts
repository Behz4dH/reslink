export interface User {
  id: number;
  username: string;
  email: string;
  role: 'superuser' | 'guest';
  created_date: string;
  last_login?: string;
  is_active: boolean;
  avatar_url?: string;
  linkedin_url?: string;
}

export interface UserWithPassword extends User {
  password_hash: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  user: Omit<User, 'password_hash'>;
  token: string;
}

export interface JWTPayload {
  userId: number;
  username: string;
  role: 'superuser' | 'guest';
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  role: 'superuser' | 'guest';
}