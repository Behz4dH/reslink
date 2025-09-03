import { Request, Response } from 'express';
import AuthService from '../services/authService';
import { LoginRequest, CreateUserRequest } from '../types/auth';
import { AuthenticatedRequest } from '../middleware/auth';

export class AuthController {
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { username, password }: LoginRequest = req.body;

      if (!username || !password) {
        res.status(400).json({ error: 'Username and password are required' });
        return;
      }

      const authResponse = await AuthService.login({ username, password });
      res.json(authResponse);
    } catch (error) {
      console.error('Login error:', error);
      res.status(401).json({ error: 'Invalid credentials' });
    }
  }

  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { username, email, password, role }: CreateUserRequest = req.body;

      if (!username || !email || !password || !role) {
        res.status(400).json({ error: 'All fields are required' });
        return;
      }

      if (!['superuser', 'guest'].includes(role)) {
        res.status(400).json({ error: 'Invalid role' });
        return;
      }

      const user = await AuthService.createUser({ username, email, password, role });
      res.status(201).json({ user });
    } catch (error) {
      console.error('Registration error:', error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Registration failed' });
      }
    }
  }

  static async me(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const user = await AuthService.getUserById(req.user.userId);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.json({ user });
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({ error: 'Failed to get user information' });
    }
  }

  static async getAllUsers(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const users = await AuthService.getAllUsers();
      res.json({ users });
    } catch (error) {
      console.error('Get users error:', error);
      res.status(500).json({ error: 'Failed to get users' });
    }
  }
}

export default AuthController;