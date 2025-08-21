import { useState } from 'react';
import { apiService } from '../services/api';
import type { PitchInput, GeneratedPitch } from '../types';

export const usePitchGeneration = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pitch, setPitch] = useState<GeneratedPitch | null>(null);

  const generatePitch = async (input: PitchInput) => {
    setLoading(true);
    setError(null);

    try {
      const generatedPitch = await apiService.generatePitch(input);
      setPitch(generatedPitch);
      return generatedPitch;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate pitch';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearPitch = () => {
    setPitch(null);
    setError(null);
  };

  return {
    loading,
    error,
    pitch,
    generatePitch,
    clearPitch,
  };
};