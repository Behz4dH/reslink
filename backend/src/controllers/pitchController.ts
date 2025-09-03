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

router.post('/modify', async (req: Request, res: Response) => {
  try {
    const { script, modification } = req.body;
    
    if (!script || !modification) {
      const response: ApiResponse<never> = {
        success: false,
        error: 'Script and modification parameters are required',
      };
      return res.status(400).json(response);
    }
    
    const modifiedScript = await AIService.modifyScript(script, modification);
    
    const response: ApiResponse<{ script: string }> = {
      success: true,
      data: { script: modifiedScript },
    };
    
    res.json(response);
  } catch (error) {
    console.error('Script modification error:', error);
    
    const response: ApiResponse<never> = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to modify script',
    };
    
    res.status(500).json(response);
  }
});

export { router as pitchRouter };