"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const dotenv_1 = __importDefault(require("dotenv"));
const errorHandler_1 = require("./middleware/errorHandler");
const pitchController_1 = require("./controllers/pitchController");
const reslinkController_1 = __importDefault(require("./controllers/reslinkController"));
const uploadController_1 = __importDefault(require("./controllers/uploadController"));
const auth_1 = __importDefault(require("./routes/auth"));
const profile_1 = __importDefault(require("./routes/profile"));
const supabaseService_1 = __importDefault(require("./services/supabaseService"));
const databaseService_1 = __importDefault(require("./services/databaseService"));
dotenv_1.default.config();
console.log("Hello World!");
console.log("Loaded OPENAI_API_KEY:", process.env.OPENAI_API_KEY?.slice(0, 10) + "...");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
// Rate limiting
const limiter = (0, express_rate_limit_1.default)({
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
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use((0, cors_1.default)({
    origin: [
        process.env.CORS_ORIGIN || 'http://localhost:3000',
        'http://localhost:5173',
        'http://localhost:5174'
    ],
    credentials: true,
}));
app.use((0, morgan_1.default)('combined'));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(limiter);
// Serve static files (avatars)
app.use('/public', express_1.default.static('public'));
// Routes
app.use('/api/auth', auth_1.default);
app.use('/api/profile', profile_1.default);
app.use('/api/pitch', pitchController_1.pitchRouter);
app.use('/api/reslinks', reslinkController_1.default);
app.use('/api/upload', uploadController_1.default);
// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        database: databaseService_1.default.isProduction() ? 'PostgreSQL' : 'SQLite'
    });
});
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        database: databaseService_1.default.isProduction() ? 'PostgreSQL' : 'SQLite'
    });
});
// Error handling
app.use(errorHandler_1.errorHandler);
app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    // Initialize database for production
    try {
        if (databaseService_1.default.isProduction()) {
            console.log('🔧 Initializing production database...');
            await databaseService_1.default.initializeProduction();
        }
        else {
            console.log('🔧 Using development SQLite database');
        }
    }
    catch (error) {
        console.error('❌ Error initializing database:', error);
    }
    // Initialize Supabase storage bucket
    try {
        const supabaseService = new supabaseService_1.default();
        await supabaseService.initializeBucket();
    }
    catch (error) {
        console.error('Error initializing Supabase storage:', error);
    }
});
exports.default = app;
//# sourceMappingURL=server.js.map