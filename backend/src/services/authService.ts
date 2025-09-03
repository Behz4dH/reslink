import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import DatabaseService from './databaseService';
import { User, LoginRequest, AuthResponse, CreateUserRequest, JWTPayload } from '../types/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
const SALT_ROUNDS = 12;

export class AuthService {
  static async createUser(userData: CreateUserRequest): Promise<User> {
    const { username, email, password, role } = userData;
    
    // Check if user already exists
    const existingUser = await DatabaseService.executeQuerySingle<User>(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [username, email]
    );
    
    if (existingUser) {
      throw new Error('User with this username or email already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Insert new user
    const result = await DatabaseService.executeCommand(
      `INSERT INTO users (username, email, password_hash, role, is_active) 
       VALUES (?, ?, ?, ?, true)`,
      [username, email, passwordHash, role]
    );

    // Get the user ID (different for SQLite vs PostgreSQL)
    let userId: number;
    if (result.lastInsertRowid) {
      // SQLite
      userId = result.lastInsertRowid as number;
    } else {
      // PostgreSQL - get the most recently created user with this username
      const newUser = await DatabaseService.executeQuerySingle<{id: number}>(
        'SELECT id FROM users WHERE username = ? ORDER BY created_date DESC LIMIT 1',
        [username]
      );
      if (!newUser) {
        throw new Error('Failed to retrieve created user');
      }
      userId = newUser.id;
    }

    // Fetch created user
    const user = await DatabaseService.executeQuerySingle<User>(
      'SELECT id, username, email, role, created_date, last_login, is_active FROM users WHERE id = ?',
      [userId]
    );

    if (!user) {
      throw new Error('Failed to create user');
    }

    return user;
  }

  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    const { username, password } = credentials;

    // Find user
    const user = await DatabaseService.executeQuerySingle<User & { password_hash: string }>(
      'SELECT * FROM users WHERE username = ? AND is_active = true',
      [username]
    );

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Update last login
    await DatabaseService.executeCommand(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
      [user.id]
    );

    // Generate JWT
    const payload: JWTPayload = {
      userId: user.id,
      username: user.username,
      role: user.role
    };

    const options: SignOptions = { expiresIn: '24h' };
    const token = jwt.sign(payload, JWT_SECRET, options);

    // Return user without password
    const { password_hash, ...userWithoutPassword } = user;
    
    return {
      user: userWithoutPassword,
      token
    };
  }

  static async getUserById(id: number): Promise<User | null> {
    const user = await DatabaseService.executeQuerySingle<User>(
      'SELECT id, username, email, role, avatar_url, linkedin_url, created_date, last_login, is_active FROM users WHERE id = ?',
      [id]
    );
    
    return user;
  }

  static async getAllUsers(): Promise<User[]> {
    const users = await DatabaseService.executeQuery<User>(
      'SELECT id, username, email, role, created_date, last_login, is_active FROM users ORDER BY created_date DESC'
    );
    
    return users;
  }

  static verifyToken(token: string): JWTPayload {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  }
}

export default AuthService;