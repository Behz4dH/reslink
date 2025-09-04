import { Request, Response, NextFunction } from 'express';
import { PitchInput } from '../types';

export const validatePitchInput = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('🔍 Validating pitch input:', JSON.stringify(req.body, null, 2));
  const { description, resume, length, tone } = req.body as PitchInput;

  // Validate description
  if (!description || typeof description !== 'string') {
    console.log('❌ Description validation failed:', { description, type: typeof description });
    return res.status(400).json({
      success: false,
      error: 'Description is required and must be a string',
    });
  }

  if (description.length < 10) {
    console.log('❌ Description too short:', { length: description.length, description: description.substring(0, 50) });
    return res.status(400).json({
      success: false,
      error: 'Description must be at least 10 characters long',
    });
  }

  if (description.length > 5000) {
    console.log('❌ Description too long:', { length: description.length });
    return res.status(400).json({
      success: false,
      error: 'Description must be less than 5000 characters',
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

  // Validate resume (optional)
  if (resume && typeof resume !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Resume must be a string',
    });
  }

  if (resume && resume.length > 10000) {
    return res.status(400).json({
      success: false,
      error: 'Resume must be less than 10000 characters',
    });
  }

  next();
};