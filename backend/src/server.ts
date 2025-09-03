import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';
import { pitchRouter } from './controllers/pitchController';
import reslinkRouter from './controllers/reslinkController';
import uploadRouter from './controllers/uploadController';
import authRouter from './routes/auth';
import profileRouter from './routes/profile';
import SupabaseStorageService from './services/supabaseService';
import DatabaseService from './services/databaseService';

dotenv.config();
console.log("Hello World!");
console.log("Loaded OPENAI_API_KEY:", process.env.OPENAI_API_KEY?.slice(0,10) + "...");

const app = express();
const PORT = process.env.PORT || 3001;

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000'),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // Increased for development
  message: {
    error: 'Too many requests from this IP, please try again later.',
    code: 'RATE_LIMIT_EXCEEDED',
    retryAfter: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000') / 1000
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors({
  origin: [
    process.env.CORS_ORIGIN || 'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5174'
  ],
  credentials: true,
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(limiter);

// Serve static files (avatars)
app.use('/public', express.static('public'));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/profile', profileRouter);
app.use('/api/pitch', pitchRouter);
app.use('/api/reslinks', reslinkRouter);
app.use('/api/upload', uploadRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: DatabaseService.isProduction() ? 'PostgreSQL' : 'SQLite'
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: DatabaseService.isProduction() ? 'PostgreSQL' : 'SQLite'
  });
});

// Error handling
app.use(errorHandler);

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  
  // Initialize database for production
  try {
    if (DatabaseService.isProduction()) {
      console.log('🔧 Initializing production database...');
      await DatabaseService.initializeProduction();
    } else {
      console.log('🔧 Using development SQLite database');
    }
  } catch (error) {
    console.error('❌ Error initializing database:', error);
  }

  // Initialize Supabase storage bucket
  try {
    const supabaseService = new SupabaseStorageService();
    await supabaseService.initializeBucket();
  } catch (error) {
    console.error('Error initializing Supabase storage:', error);
  }
});

export default app;