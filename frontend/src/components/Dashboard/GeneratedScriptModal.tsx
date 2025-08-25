import { useState } from 'react';

interface GeneratedScriptModalProps {
  script: string;
  onClose: () => void;
  onSave: (script: string) => void;
}

export const GeneratedScriptModal = ({ script, onClose, onSave }: GeneratedScriptModalProps) => {
  const [currentScript, setCurrentScript] = useState(script);
  const [customEdit, setCustomEdit] = useState('');

  const handleEditAction = (action: string) => {
    // In a real implementation, these would make API calls to modify the script
    console.log(`Editing script with action: ${action}`);
  };

  const handleSave = () => {
    onSave(currentScript);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
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
            <p className="text-gray-700 mb-4">
              Here's a tailored 60-90 second video script for your software developer application, 
              based on your resume and the placeholder job description:
            </p>
            
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-gray-800 leading-relaxed">
              <textarea
                value={currentScript}
                onChange={(e) => setCurrentScript(e.target.value)}
                className="w-full h-64 bg-transparent border-none resize-none focus:outline-none"
              />
            </div>
          </div>

          {/* Editing Options */}
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => handleEditAction('shorten')}
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              ✂️ Shorten it
            </button>
            <button 
              onClick={() => handleEditAction('casual')}
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              😊 Make it casual
            </button>
            <button 
              onClick={() => handleEditAction('lengthen')}
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              📏 Lengthen it
            </button>
            <button 
              onClick={() => handleEditAction('formal')}
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              👔 Make it formal
            </button>
          </div>

          {/* Custom Input */}
          <div>
            <input
              type="text"
              value={customEdit}
              onChange={(e) => setCustomEdit(e.target.value)}
              placeholder="✏️ Tell us what you want to change in the script"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-6 border-t border-gray-200">
          <button 
            onClick={handleSave}
            className="w-full bg-lime-400 text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-lime-500 transition-colors flex items-center justify-center gap-2"
          >
            ✓ Save
          </button>
        </div>
      </div>
    </div>
  );
};