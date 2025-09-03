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
import { apiService } from '../../services/api';

interface CreateReslinkFlowProps {
  open: boolean;
  onClose: () => void;
  onComplete: (reslink: any) => void;
}

export const CreateReslinkFlow = ({ open, onClose, onComplete }: CreateReslinkFlowProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showTeleprompter, setShowTeleprompter] = useState(false);
  const [reslinkTitle, setReslinkTitle] = useState('');
  const [name, setName] = useState('');
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

  const handleExitTeleprompter = async (uploadedVideoUrl?: string) => {
    setShowTeleprompter(false);
    
    try {
      let resumeUrl = '';
      
      // Upload resume file if provided
      if (resumeFile) {
        console.log('Uploading resume file...');
        const resumeUploadResult = await apiService.uploadResume(resumeFile);
        resumeUrl = resumeUploadResult.url;
      }

      // Create reslink in database
      console.log('Creating reslink in database...');
      const titleParts = reslinkTitle.split(' - ');
      const newReslinkData = {
        title: reslinkTitle,
        name: name,
        position: titleParts[0] || 'Position', 
        company: titleParts[1] || 'Company',
        video_url: uploadedVideoUrl || '',
        resume_url: resumeUrl,
        status: 'draft' as const,
      };
      
      const savedReslink = await apiService.createReslink(newReslinkData);
      console.log('Reslink created successfully:', savedReslink);
      
      onComplete(savedReslink);
    } catch (error) {
      console.error('Error creating reslink:', error);
      // Still complete the flow even if save fails, but with local data
      const titleParts = reslinkTitle.split(' - ');
      const fallbackReslink = {
        id: Date.now().toString(),
        title: reslinkTitle,
        name: name,
        position: titleParts[0] || 'Position',
        company: titleParts[1] || 'Company',
        createdDate: new Date().toISOString().split('T')[0],
        videoUrl: uploadedVideoUrl || '/videos/new-recording.mp4',
        resumeUrl: resumeFile ? URL.createObjectURL(resumeFile) : '',
        status: 'draft' as const,
      };
      onComplete(fallbackReslink);
    } finally {
      onClose();
      resetFlow();
    }
  };

  const resetFlow = () => {
    setCurrentStep(1);
    setReslinkTitle('');
    setName('');
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
              key="titlestep"
              title={reslinkTitle}
              name={name}
              setTitle={setReslinkTitle}
              setName={setName}
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