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
const supabaseService_1 = __importDefault(require("./services/supabaseService"));
dotenv_1.default.config();
console.log("Hello World!");
console.log("Loaded OPENAI_API_KEY:", process.env.OPENAI_API_KEY?.slice(0, 10) + "...");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
// Rate limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000'),
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '10'),
    message: 'Too many requests from this IP, please try again later.',
});
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
}));
app.use((0, morgan_1.default)('combined'));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(limiter);
// Routes
console.log('Registering routes...');
console.log('Upload router:', typeof uploadController_1.default);
app.use('/api/pitch', pitchController_1.pitchRouter);
app.use('/api/reslinks', reslinkController_1.default);
app.use('/api/upload', (req, res, next) => {
    console.log(`Upload request: ${req.method} ${req.path}`);
    next();
}, uploadController_1.default);
console.log('Routes registered successfully');
// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});
// Error handling
app.use(errorHandler_1.errorHandler);
app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
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