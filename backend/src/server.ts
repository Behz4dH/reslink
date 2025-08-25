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
import SupabaseStorageService from './services/supabaseService';

dotenv.config();
console.log("Hello World!");
console.log("Loaded OPENAI_API_KEY:", process.env.OPENAI_API_KEY?.slice(0,10) + "...");

const app = express();
const PORT = process.env.PORT || 3001;

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000'),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '10'),
  message: 'Too many requests from this IP, please try again later.',
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(limiter);

// Routes
app.use('/api/pitch', pitchRouter);
app.use('/api/reslinks', reslinkRouter);
app.use('/api/upload', uploadRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling
app.use(errorHandler);

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  
  // Initialize Supabase storage bucket
  try {
    const supabaseService = new SupabaseStorageService();
    await supabaseService.initializeBucket();
  } catch (error) {
    console.error('Error initializing Supabase storage:', error);
  }
});

export default app;