import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ProgressSteps } from './ProgressSteps';
import { PitchCreationSection } from './PitchCreationSection';
import { Teleprompter } from '../Teleprompter/Teleprompter';

export const Dashboard = () => {
  const [currentStep, setCurrentStep] = useState(3);
  const [showTeleprompter, setShowTeleprompter] = useState(false);
  const [script, setScript] = useState('');

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
      <Header />
      
      {/* Main Content */}
      <div className="ml-60 mt-20 p-8">
        <ProgressSteps currentStep={currentStep} />
        <PitchCreationSection 
          onStartRecording={handleStartRecording}
          script={script}
          setScript={setScript}
        />
      </div>
    </div>
  );
};