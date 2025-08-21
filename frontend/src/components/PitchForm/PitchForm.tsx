import { useState } from 'react';
import { Button } from '../ui/Button';
import { TextArea } from '../ui/TextArea';
import { Select } from '../ui/Select';
import type { PitchInput } from '../../types';

interface PitchFormProps {
  onSubmit: (input: PitchInput) => void;
  loading?: boolean;
}

const lengthOptions = [
  { value: 30, label: '30 seconds' },
  { value: 60, label: '60 seconds' },
  { value: 90, label: '90 seconds' },
];

const toneOptions = [
  { value: 'professional', label: 'Professional' },
  { value: 'casual', label: 'Casual' },
  { value: 'enthusiastic', label: 'Enthusiastic' },
];

export const PitchForm = ({ onSubmit, loading = false }: PitchFormProps) => {
  const [description, setDescription] = useState('');
  const [length, setLength] = useState<30 | 60 | 90>(60);
  const [tone, setTone] = useState<'professional' | 'casual' | 'enthusiastic'>('professional');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!description.trim()) {
      setError('Please enter a description for your pitch');
      return;
    }

    if (description.length < 10) {
      setError('Description must be at least 10 characters long');
      return;
    }

    if (description.length > 2000) {
      setError('Description must be less than 2000 characters');
      return;
    }

    onSubmit({
      description: description.trim(),
      length,
      tone,
    });
  };

  const placeholderText = `I'm Sarah Chen, a Senior Marketing Manager with 8 years of experience in B2B SaaS companies. I specialize in growth marketing and have increased user acquisition by 150% at my current company. I'm looking to connect with other marketing leaders at this networking event.`;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">PitchCraft</h1>
        <p className="text-gray-600">Create your perfect pitch with AI assistance</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <TextArea
          label="Describe Your Pitch"
          placeholder={placeholderText}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={6}
          error={error}
          helperText={`${description.length}/2000 characters`}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Pitch Length"
            value={length}
            onChange={(e) => setLength(Number(e.target.value) as 30 | 60 | 90)}
            options={lengthOptions}
          />

          <Select
            label="Tone"
            value={tone}
            onChange={(e) => setTone(e.target.value as 'professional' | 'casual' | 'enthusiastic')}
            options={toneOptions}
          />
        </div>

        <Button
          type="submit"
          loading={loading}
          className="w-full"
          size="lg"
        >
          Generate Pitch
        </Button>
      </form>
    </div>
  );
};