import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ProgressSteps } from './ProgressSteps';
import { TitleStep } from './TitleStep';
import { ResumeUploadStep } from './ResumeUploadStep';
import { PitchCreationSection } from './PitchCreationSection';
import { Teleprompter } from '../Teleprompter/Teleprompter';

export const Dashboard = () => {
  const [currentStep, setCurrentStep] = useState(0); // 0 = not started, 1-3 = steps
  const [showTeleprompter, setShowTeleprompter] = useState(false);
  const [script, setScript] = useState('');
  const [reslinkTitle, setReslinkTitle] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const handleNewReslink = () => {
    setCurrentStep(1);
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
          <div className="text-center py-16">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Reslink</h1>
            <p className="text-gray-600 mb-8">Click "New Reslink" to get started with creating your professional introduction</p>
          </div>
        )}

        {currentStep > 0 && <ProgressSteps currentStep={currentStep} />}
        
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
      </div>
    </div>
  );
};