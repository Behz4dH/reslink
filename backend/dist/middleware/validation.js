"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePitchInput = void 0;
const validatePitchInput = (req, res, next) => {
    const { description, length, tone } = req.body;
    // Validate description
    if (!description || typeof description !== 'string') {
        return res.status(400).json({
            success: false,
            error: 'Description is required and must be a string',
        });
    }
    if (description.length < 10) {
        return res.status(400).json({
            success: false,
            error: 'Description must be at least 10 characters long',
        });
    }
    if (description.length > 2000) {
        return res.status(400).json({
            success: false,
            error: 'Description must be less than 2000 characters',
        });
    }
    // Validate length (optional)
    if (length && ![30, 60, 90].includes(length)) {
        return res.status(400).json({
            success: false,
            error: 'Length must be 30, 60, or 90 seconds',
        });
    }
    // Validate tone (optional)
    if (tone && !['professional', 'casual', 'enthusiastic'].includes(tone)) {
        return res.status(400).json({
            success: false,
            error: 'Tone must be professional, casual, or enthusiastic',
        });
    }
    next();
};
exports.validatePitchInput = validatePitchInput;
//# sourceMappingURL=validation.js.map