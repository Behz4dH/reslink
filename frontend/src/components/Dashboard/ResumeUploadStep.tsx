import { useRef } from 'react';

interface ResumeUploadStepProps {
  resumeFile: File | null;
  setResumeFile: (file: File | null) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export const ResumeUploadStep = ({ resumeFile, setResumeFile, onNext, onPrevious }: ResumeUploadStepProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setResumeFile(file);
    } else {
      alert('Please select a PDF file only.');
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      setResumeFile(file);
    } else {
      alert('Please select a PDF file only.');
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleBrowseFiles = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    setResumeFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    return Math.round(bytes / 1024) + 'kb';
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-8">UPLOAD YOUR RESUME</h2>
      
      <div className="max-w-2xl">
        {/* Upload Area */}
        <div 
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-2 border-dashed border-blue-300 rounded-lg p-12 text-center mb-6 bg-blue-50"
        >
          <div className="text-blue-500 text-4xl mb-4">📄</div>
          <div className="text-gray-700 mb-2">Drag your file to start uploading</div>
          <div className="text-gray-500 text-sm mb-4">Only support PDF</div>
          <div className="text-gray-400 text-sm mb-4">OR</div>
          <button 
            onClick={handleBrowseFiles}
            className="border border-blue-300 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Browse files
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Uploaded File */}
        {resumeFile && (
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-blue-500 text-xl">📄</div>
              <div>
                <div className="font-medium text-gray-900">{resumeFile.name}</div>
                <div className="text-gray-500 text-sm">{formatFileSize(resumeFile.size)}</div>
              </div>
            </div>
            <button 
              onClick={handleRemoveFile}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        )}

        <div className="mb-8">
          <a href="#" className="text-blue-600 text-sm underline hover:text-blue-700">
            How to upload my resume
          </a>
        </div>

        {/* Reslink Badge Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Reslink Badge</h3>
              <p className="text-gray-600 text-sm mb-2">
                A Reslink badge is a clickable button added to your resume that links straight to your Reslink.
              </p>
              <a href="#" className="text-blue-600 text-sm underline hover:text-blue-700">
                More details
              </a>
            </div>
            <div className="text-green-600 text-sm font-medium">
              • Enabled
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <button 
            onClick={onPrevious}
            className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Previous Step
          </button>
          <button 
            onClick={onNext}
            disabled={!resumeFile}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next Step
          </button>
        </div>
      </div>
    </div>
  );
};