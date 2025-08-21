import { Router, Request, Response } from 'express';
import { validatePitchInput } from '../middleware/validation';
import { AIService } from '../services/aiService';
import { PitchInput, ApiResponse, GeneratedPitch } from '../types';

const router = Router();

router.post('/generate', validatePitchInput, async (req: Request, res: Response) => {
  try {
    const input: PitchInput = req.body;
    
    const generatedPitch = await AIService.generatePitch(input);
    
    const response: ApiResponse<GeneratedPitch> = {
      success: true,
      data: generatedPitch,
    };
    
    res.json(response);
  } catch (error) {
    console.error('Pitch generation error:', error);
    
    const response: ApiResponse<never> = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate pitch',
    };
    
    res.status(500).json(response);
  }
});

export { router as pitchRouter };