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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Create your video pitch in <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">seconds</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Effortlessly generate a standout video pitch using our built-in AI tool, customized to your experience and the job you're applying for.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <TextArea
              label="Describe Your Pitch"
              placeholder={placeholderText}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              error={error}
              helperText={`${description.length}/2000 characters`}
              className="bg-slate-900/50 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Pitch Length"
                value={length}
                onChange={(e) => setLength(Number(e.target.value) as 30 | 60 | 90)}
                options={lengthOptions}
                className="bg-slate-900/50 border-slate-600 text-white focus:border-blue-500"
              />

              <Select
                label="Tone"
                value={tone}
                onChange={(e) => setTone(e.target.value as 'professional' | 'casual' | 'enthusiastic')}
                options={toneOptions}
                className="bg-slate-900/50 border-slate-600 text-white focus:border-blue-500"
              />
            </div>

            <Button
              type="submit"
              loading={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              size="lg"
            >
              Generate Pitch
            </Button>
          </form>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="text-center p-6 bg-slate-800/30 rounded-xl border border-slate-700/30">
            <div className="w-12 h-12 bg-blue-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <span className="text-white font-bold">AI</span>
            </div>
            <h3 className="text-white font-semibold mb-2">AI-Powered</h3>
            <p className="text-slate-400 text-sm">Generate personalized pitches using advanced AI</p>
          </div>
          
          <div className="text-center p-6 bg-slate-800/30 rounded-xl border border-slate-700/30">
            <div className="w-12 h-12 bg-green-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <span className="text-white font-bold">📹</span>
            </div>
            <h3 className="text-white font-semibold mb-2">Record & Practice</h3>
            <p className="text-slate-400 text-sm">Built-in teleprompter with video recording</p>
          </div>
          
          <div className="text-center p-6 bg-slate-800/30 rounded-xl border border-slate-700/30">
            <div className="w-12 h-12 bg-purple-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <span className="text-white font-bold">⚡</span>
            </div>
            <h3 className="text-white font-semibold mb-2">Quick & Easy</h3>
            <p className="text-slate-400 text-sm">Create professional pitches in seconds</p>
          </div>
        </div>
      </div>
    </div>
  );
};