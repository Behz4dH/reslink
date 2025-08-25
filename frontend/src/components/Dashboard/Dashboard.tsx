import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { TitleStep } from './TitleStep';
import { ResumeUploadStep } from './ResumeUploadStep';
import { PitchCreationSection } from './PitchCreationSection';
import { ProgressSteps } from './ProgressSteps';
import { Teleprompter } from '../Teleprompter/Teleprompter';
import { SimpleReslinksTable } from './SimpleReslinksTable';
import { mockReslinks } from '../../types/reslink';

export const Dashboard = () => {
  const [currentStep, setCurrentStep] = useState(0); // 0 = dashboard view, 1-3 = create flow
  const [showTeleprompter, setShowTeleprompter] = useState(false);
  const [reslinkTitle, setReslinkTitle] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [script, setScript] = useState('');
  const [reslinks] = useState(mockReslinks);

  const handleNewReslink = () => {
    setCurrentStep(1); // Start the create flow
    setReslinkTitle('');
    setResumeFile(null);
    setScript('');
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStartRecording = () => {
    setShowTeleprompter(true);
  };

  const handleExitTeleprompter = () => {
    setShowTeleprompter(false);
    // Reset back to dashboard
    setCurrentStep(0);
  };

  const handleBackToDashboard = () => {
    setCurrentStep(0);
  };

  if (showTeleprompter) {
    return (
      <Teleprompter 
        script={script}
        onExit={handleExitTeleprompter}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Header onNewReslink={handleNewReslink} />
      
      {/* Main Content */}
      <div className="ml-60 mt-20 p-8">
        {currentStep === 0 && (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Reslinks</h1>
              <p className="text-gray-600">Manage your professional video introductions</p>
            </div>

            <SimpleReslinksTable data={reslinks} />
          </>
        )}

        {currentStep > 0 && (
          <>
            <div className="mb-4">
              <button 
                onClick={handleBackToDashboard}
                className="text-blue-600 hover:text-blue-800 flex items-center gap-2 mb-4"
              >
                ← Back to Dashboard
              </button>
            </div>
            
            <ProgressSteps currentStep={currentStep} />
            
            {currentStep === 1 && (
              <TitleStep 
                title={reslinkTitle}
                setTitle={setReslinkTitle}
                onNext={handleNextStep}
              />
            )}

            {currentStep === 2 && (
              <ResumeUploadStep 
                resumeFile={resumeFile}
                setResumeFile={setResumeFile}
                onNext={handleNextStep}
                onPrevious={handlePreviousStep}
              />
            )}

            {currentStep === 3 && (
              <PitchCreationSection 
                onStartRecording={handleStartRecording}
                onPrevious={handlePreviousStep}
                script={script}
                setScript={setScript}
                resumeFile={resumeFile}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};