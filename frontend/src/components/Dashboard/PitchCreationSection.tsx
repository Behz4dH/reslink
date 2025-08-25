import { useState } from 'react';
import { PitchAIModal } from './PitchAIModal';

interface PitchCreationSectionProps {
  onStartRecording: () => void;
  onPrevious: () => void;
  script: string;
  setScript: (script: string) => void;
  resumeFile: File | null;
}

export const PitchCreationSection = ({ onStartRecording, onPrevious, script, setScript, resumeFile }: PitchCreationSectionProps) => {
  const [showPitchAI, setShowPitchAI] = useState(false);
  const [teleprompterEnabled, setTeleprompterEnabled] = useState(true);

  const handleStartRecording = () => {
    // If no script, show PitchAI modal first
    if (!script.trim()) {
      setShowPitchAI(true);
    } else {
      onStartRecording();
    }
  };

  const handlePitchAIClose = () => {
    setShowPitchAI(false);
  };

  const handleScriptGenerated = (generatedScript: string) => {
    setScript(generatedScript);
    setShowPitchAI(false);
    // After script is generated, proceed to recording
    onStartRecording();
  };

  const handleWriteWithPitchAI = () => {
    setShowPitchAI(true);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-8">CREATE YOUR PITCH</h2>
      
      <div className="flex gap-12">
        {/* Left Column - Recording Options */}
        <div className="flex-1">
          <div className="grid grid-cols-2 gap-8">
            {/* Record Video Option */}
            <div className="text-center p-8 bg-white rounded-lg border border-gray-200">
              <div className="text-4xl mb-4">📹</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Record a video pitch
              </h3>
              <p className="text-gray-600 text-sm mb-6">
                Use our built-in recorder to capture your pitch in minutes.
              </p>
              <button 
                onClick={handleStartRecording}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Start Recording
              </button>
            </div>

            {/* Upload Video Option */}
            <div className="text-center p-8 bg-white rounded-lg border border-gray-200">
              <div className="text-4xl mb-4">⬆️</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Have a custom video? Upload Video
              </h3>
              <p className="text-gray-600 text-sm mb-6">
                Already have a professionally edited video or a custom pitch?
              </p>
              <button className="bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors">
                👑 Upgrade to Premium
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Script Area */}
        <div className="w-96">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Teleprompter</h3>
              <button
                onClick={() => setTeleprompterEnabled(!teleprompterEnabled)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  teleprompterEnabled ? 'bg-blue-600' : 'bg-gray-300'
                } relative`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                  teleprompterEnabled ? 'translate-x-6' : 'translate-x-0.5'
                }`}></div>
              </button>
            </div>
            
            <p className="text-sm text-gray-500 mb-4">
              Toggle on the teleprompter to display your script while recording.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-4" style={{ height: '320px' }}>
              <textarea
                value={script}
                onChange={(e) => setScript(e.target.value)}
                className="w-full h-full resize-none border-none bg-transparent text-gray-700 text-sm leading-relaxed focus:outline-none"
                placeholder="Use this space to draft your script and stay on point while recording your video."
              />
            </div>

            <button 
              onClick={handleWriteWithPitchAI}
              className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
            >
              ⚡ Write with PitchAI
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-12">
        <button 
          onClick={onPrevious}
          className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          Previous Step
        </button>
      </div>

      {/* PitchAI Modal */}
      {showPitchAI && (
        <PitchAIModal
          onClose={handlePitchAIClose}
          onScriptGenerated={handleScriptGenerated}
          resumeFile={resumeFile}
        />
      )}
    </div>
  );
};