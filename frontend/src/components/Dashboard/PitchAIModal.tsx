import { useState } from 'react';
import { GeneratedScriptModal } from './GeneratedScriptModal';

interface PitchAIModalProps {
  onClose: () => void;
  onScriptGenerated: (script: string) => void;
  resumeFile: File | null;
}

export const PitchAIModal = ({ onClose, onScriptGenerated, resumeFile }: PitchAIModalProps) => {
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedScript, setGeneratedScript] = useState('');
  const [showGeneratedScript, setShowGeneratedScript] = useState(false);

  const handleGenerate = async () => {
    if (!jobTitle.trim() || !jobDescription.trim()) return;
    
    setIsGenerating(true);
    
    try {
      // Simulate API call - replace with actual API integration
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockScript = `Hi [Recruiter's Name], my name is Behzad Hatamikia. I saw that you're hiring for a ${jobTitle} role and wanted to reach out personally to express my interest.

With a background in Applied Artificial Intelligence from the University of Huddersfield, and hands-on experience in high-pressure, collaborative environments, I bring a unique balance of technical understanding and real-world problem-solving. Whether I was managing a team in a busy restaurant or handling logistics with precision, I've consistently demonstrated strong attention to detail, time management, and communication—traits that directly translate to success in software development.

What sets me apart is my adaptability and ability to learn fast. In my previous roles, I quickly picked up safety protocols, managed new team members, and implemented feedback systems—all of which required structured thinking and process improvement, key to great software development. I'm passionate about logic, systems, and user experience, and I'm now excited to channel that energy into designing code that delivers real impact.`;
      
      setGeneratedScript(mockScript);
      setShowGeneratedScript(true);
      setIsGenerating(false);
    } catch (error) {
      setIsGenerating(false);
      console.error('Error generating script:', error);
    }
  };

  const handleScriptSaved = (script: string) => {
    onScriptGenerated(script);
    onClose();
  };

  if (showGeneratedScript) {
    return (
      <GeneratedScriptModal
        script={generatedScript}
        onClose={onClose}
        onSave={handleScriptSaved}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-2xl mx-4">
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-200 relative">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚡</span>
            <h2 className="text-xl font-semibold text-gray-900">Reslink PitchAI</h2>
          </div>
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What is the job title?
            </label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="ex. UX/UI Designer"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Description
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste job description here..."
              rows={5}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-6 border-t border-gray-200">
          <button 
            onClick={handleGenerate}
            disabled={!jobTitle.trim() || !jobDescription.trim() || isGenerating}
            className="w-full bg-lime-400 text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-lime-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                Generating...
              </>
            ) : (
              <>
                ⚡ Generate
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};