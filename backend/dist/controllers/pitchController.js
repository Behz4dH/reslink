"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pitchRouter = void 0;
const express_1 = require("express");
const validation_1 = require("../middleware/validation");
const aiService_1 = require("../services/aiService");
const router = (0, express_1.Router)();
exports.pitchRouter = router;
router.post('/generate', validation_1.validatePitchInput, async (req, res) => {
    try {
        const input = req.body;
        const generatedPitch = await aiService_1.AIService.generatePitch(input);
        const response = {
            success: true,
            data: generatedPitch,
        };
        res.json(response);
    }
    catch (error) {
        console.error('Pitch generation error:', error);
        const response = {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to generate pitch',
        };
        res.status(500).json(response);
    }
});
//# sourceMappingURL=pitchController.js.map