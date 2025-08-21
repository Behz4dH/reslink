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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Your Generated Pitch</h2>
          <p className="text-slate-300">Review and edit your pitch script before practicing</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Script Editor Card */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 shadow-2xl">
              <TextArea
                label="Pitch Script"
                value={script}
                onChange={(e) => handleScriptChange(e.target.value)}
                rows={12}
                className="bg-slate-900/50 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500 font-mono leading-relaxed"
                helperText="Edit your script as needed. Changes will be saved automatically."
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats Card */}
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 shadow-xl">
              <h3 className="font-semibold text-white mb-4">Script Stats</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-300">Word Count:</span>
                  <span className="font-medium text-white">{wordCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Est. Duration:</span>
                  <span className="font-medium text-white">{estimatedDuration}s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Generated:</span>
                  <span className="font-medium text-white">
                    {new Date(pitch.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions Card */}
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 shadow-xl">
              <div className="space-y-3">
                <Button
                  onClick={onPractice}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                  size="lg"
                >
                  Practice with Teleprompter
                </Button>

                {hasChanges && (
                  <Button
                    onClick={handleReset}
                    variant="secondary"
                    className="w-full bg-slate-700 hover:bg-slate-600 text-white border-slate-600"
                  >
                    Reset to Original
                  </Button>
                )}

                <Button
                  onClick={onStartOver}
                  variant="secondary"
                  className="w-full bg-slate-700 hover:bg-slate-600 text-white border-slate-600"
                >
                  Start Over
                </Button>
              </div>
            </div>

            {/* Tips Card */}
            <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-xl rounded-2xl border border-blue-700/30 p-6">
              <h4 className="font-semibold text-white mb-3">Tips for Better Delivery</h4>
              <ul className="text-sm text-slate-300 space-y-2">
                <li>• Speak naturally and maintain eye contact</li>
                <li>• Use the teleprompter as a guide, not a strict script</li>
                <li>• Practice a few times before recording</li>
                <li>• Adjust scroll speed to match your pace</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};