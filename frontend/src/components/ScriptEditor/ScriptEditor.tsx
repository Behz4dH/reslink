import { useState } from 'react';
import { Button } from '../ui/Button';
import { TextArea } from '../ui/TextArea';
import type { GeneratedPitch } from '../../types';

interface ScriptEditorProps {
  pitch: GeneratedPitch;
  onScriptChange: (script: string) => void;
  onPractice: () => void;
  onStartOver: () => void;
}

export const ScriptEditor = ({ 
  pitch, 
  onScriptChange, 
  onPractice, 
  onStartOver 
}: ScriptEditorProps) => {
  const [script, setScript] = useState(pitch.script);
  const [hasChanges, setHasChanges] = useState(false);

  const handleScriptChange = (value: string) => {
    setScript(value);
    setHasChanges(value !== pitch.script);
    onScriptChange(value);
  };

  const handleReset = () => {
    setScript(pitch.script);
    setHasChanges(false);
    onScriptChange(pitch.script);
  };

  const wordCount = script.trim().split(/\s+/).length;
  const estimatedDuration = Math.round((wordCount / 150) * 60);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Generated Pitch</h2>
        <p className="text-gray-600">Review and edit your pitch script before practicing</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TextArea
            label="Pitch Script"
            value={script}
            onChange={(e) => handleScriptChange(e.target.value)}
            rows={12}
            className="font-mono leading-relaxed"
            helperText="Edit your script as needed. Changes will be saved automatically."
          />
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-3">Script Stats</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Word Count:</span>
                <span className="font-medium">{wordCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Est. Duration:</span>
                <span className="font-medium">{estimatedDuration}s</span>
              </div>
              <div className="flex justify-between">
                <span>Generated:</span>
                <span className="font-medium">
                  {new Date(pitch.createdAt).toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={onPractice}
              className="w-full"
              size="lg"
            >
              Practice with Teleprompter
            </Button>

            {hasChanges && (
              <Button
                onClick={handleReset}
                variant="secondary"
                className="w-full"
              >
                Reset to Original
              </Button>
            )}

            <Button
              onClick={onStartOver}
              variant="secondary"
              className="w-full"
            >
              Start Over
            </Button>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Tips for Better Delivery</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Speak naturally and maintain eye contact</li>
              <li>• Use the teleprompter as a guide, not a strict script</li>
              <li>• Practice a few times before recording</li>
              <li>• Adjust scroll speed to match your pace</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};