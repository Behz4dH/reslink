import { useState } from 'react';
import { TitleStep } from './TitleStep';
import { ResumeUploadStep } from './ResumeUploadStep';
import { PitchCreationSection } from './PitchCreationSection';
import { ProgressSteps } from './ProgressSteps';
import { Teleprompter } from '../Teleprompter/Teleprompter';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

interface CreateReslinkFlowProps {
  open: boolean;
  onClose: () => void;
  onComplete: (reslink: any) => void;
}

export const CreateReslinkFlow = ({ open, onClose, onComplete }: CreateReslinkFlowProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showTeleprompter, setShowTeleprompter] = useState(false);
  const [reslinkTitle, setReslinkTitle] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [script, setScript] = useState('');

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
    // Here you would typically save the reslink and complete the flow
    const newReslink = {
      id: Date.now().toString(),
      title: reslinkTitle,
      name: reslinkTitle.split(' - ')[0] || reslinkTitle,
      position: reslinkTitle.split(' - ')[1] || 'Position',
      company: reslinkTitle.split(' - ')[2] || 'Company',
      createdDate: new Date().toISOString().split('T')[0],
      videoUrl: '/videos/new-recording.mp4', // This would be the actual recorded video
      resumeUrl: resumeFile ? URL.createObjectURL(resumeFile) : '',
      status: 'completed' as const,
    };
    onComplete(newReslink);
    onClose();
    resetFlow();
  };

  const resetFlow = () => {
    setCurrentStep(1);
    setReslinkTitle('');
    setResumeFile(null);
    setScript('');
    setShowTeleprompter(false);
  };

  const handleClose = () => {
    onClose();
    resetFlow();
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
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            CREATE A RESLINK
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto p-6">
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
        </div>
        
        <div className="flex justify-between items-center p-6 border-t">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};