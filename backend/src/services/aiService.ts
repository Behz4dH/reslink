import OpenAI from 'openai';
import { PitchInput, GeneratedPitch } from '../types';
import dotenv from 'dotenv';
dotenv.config();


console.log("OpenAI API Key:", process.env.OPENAI_API_KEY?.slice(0,10) + "...");
console.log("OpenAI API Key loaded:", process.env.OPENAI_API_KEY ? "Yes" : "No");
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class AIService {
  static async generatePitch(input: PitchInput): Promise<GeneratedPitch> {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    const { description, resume, length = 60, tone = 'professional' } = input;

    const prompt = this.buildPrompt(description, resume, length, tone);

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are a professional pitch writer. Write ONLY the video pitch script - no explanations, no preamble, no "Here\'s a script" - just the actual words to be spoken in the video.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 300,
        temperature: 0.7,
      });

      let script = response.choices[0]?.message?.content?.trim() || '';
      
      // Clean up any potential formatting artifacts
      script = script.replace(/^["']|["']$/g, '').trim();
      
      // If still empty or too short, use a fallback
      if (!script || script.length < 50) {
        throw new Error('Failed to generate proper pitch script');
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

  private static buildPrompt(description: string, resume: string | undefined, length: number, tone: string): string {
    const toneInstructions = {
      professional: 'formal, confident, and business-appropriate',
      casual: 'friendly, approachable, and conversational',
      enthusiastic: 'energetic, passionate, and engaging',
    };

    const resumeSection = resume ? `

MY RESUME/BACKGROUND:
${resume}

` : '';

    return `Write a ${length}-second video pitch script. Use the EXACT job title and company name from the job posting. Match my resume experience to their requirements.

JOB POSTING:
${description}${resumeSection}

REQUIREMENTS:
- Start directly with the pitch (no "Here's a script" preamble)
- Use the EXACT job title and company name from the job posting
- Reference specific technologies/skills from BOTH the job posting AND my resume
- ${Math.round(length * 2.5)} words total (~${length} seconds)
- Professional tone, first person

STRUCTURE:
Opening: "Hi, I'm [my name], excited about the [exact job title] role at [exact company name]..."
Experience: Mention 2-3 specific matches between job requirements and my background
Value: Why my experience makes me perfect for this specific role  
Close: Strong, enthusiastic finish

Write ONLY the script to be spoken:`;
  }
}