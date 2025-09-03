import OpenAI from 'openai';
import { PitchInput, GeneratedPitch } from '../types';
import dotenv from 'dotenv';
dotenv.config();


console.log("Together API Key:", process.env.OPENAI_API_KEY);
console.log("Together API Key loaded:", process.env.OPENAI_API_KEY ? "Yes" : "No");
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://api.together.xyz/v1", // 👈 important
});

export class AIService {
  static async generatePitch(input: PitchInput): Promise<GeneratedPitch> {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    const { description, length = 60, tone = 'professional' } = input;

    const prompt = this.buildPrompt(description, length, tone);

    try {
      const response = await openai.chat.completions.create({
        model: 'deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free',
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
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error('Failed to generate pitch script');
    }
  }

  private static buildPrompt(description: string, length: number, tone: string): string {
    const toneInstructions = {
      professional: 'formal, confident, and business-appropriate',
      casual: 'friendly, approachable, and conversational',
      enthusiastic: 'energetic, passionate, and engaging',
    };

    return `You are an expert career coach and script writer. Create a highly personalized ${length}-second video pitch script that will help the candidate stand out for this specific job opportunity.

${description}

ANALYSIS REQUIREMENTS:
1. Extract the key requirements, skills, and company values from the job description
2. Identify what makes this role/company unique
3. Understand the ideal candidate profile they're seeking

SCRIPT REQUIREMENTS:
- Tone: ${toneInstructions[tone as keyof typeof toneInstructions]}
- Length: Approximately ${Math.round(length * 2.5)} words (${length} seconds at ~150 words/minute)
- First person perspective, conversational for video delivery
- Authentic and natural, not rehearsed or generic

SCRIPT STRUCTURE:
1. **Hook Opening** (5-10 seconds): Grab attention with specific reference to the role/company
2. **Relevant Experience** (20-30 seconds): Highlight 2-3 most relevant skills/experiences that directly match their needs
3. **Unique Value** (15-20 seconds): What differentiates you from other candidates for THIS specific role
4. **Strong Close** (5-10 seconds): Memorable statement that reinforces your fit and enthusiasm

PERSONALIZATION REQUIREMENTS:
- Reference specific technologies, methodologies, or values mentioned in the job description
- Connect your background directly to their stated needs
- Show you understand their business/industry challenges
- Avoid generic phrases like "I'm passionate" or "team player"

Write ONLY the script, no additional commentary:`;
  }
}