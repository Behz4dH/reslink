"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIService = void 0;
const openai_1 = __importDefault(require("openai"));
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
});
class AIService {
    static async generatePitch(input) {
        if (!process.env.OPENAI_API_KEY) {
            throw new Error('OpenAI API key not configured');
        }
        const { description, length = 60, tone = 'professional' } = input;
        const prompt = this.buildPrompt(description, length, tone);
        try {
            const response = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a professional pitch writer who creates compelling, natural-sounding introductions for video presentations.',
                    },
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
                max_tokens: 300,
                temperature: 0.7,
            });
            const script = response.choices[0]?.message?.content?.trim() || '';
            if (!script) {
                throw new Error('Failed to generate pitch script');
            }
            const wordCount = script.split(/\s+/).length;
            const estimatedDuration = Math.round((wordCount / 150) * 60); // ~150 words per minute
            return {
                script,
                wordCount,
                estimatedDuration,
                createdAt: new Date(),
            };
        }
        catch (error) {
            console.error('OpenAI API error:', error);
            throw new Error('Failed to generate pitch script');
        }
    }
    static buildPrompt(description, length, tone) {
        const toneInstructions = {
            professional: 'formal, confident, and business-appropriate',
            casual: 'friendly, approachable, and conversational',
            enthusiastic: 'energetic, passionate, and engaging',
        };
        return `Create a ${length}-second pitch script based on the following description. The tone should be ${toneInstructions[tone]}.

Description: ${description}

Requirements:
- Write in first person
- Keep it conversational and natural for video delivery
- Target approximately ${Math.round(length * 2.5)} words (${length} seconds at ~150 words/minute)
- Include: personal introduction, key experience/skills, value proposition
- Make it sound authentic, not rehearsed
- End with a strong, memorable statement

Script:`;
    }
}
exports.AIService = AIService;
//# sourceMappingURL=aiService.js.map