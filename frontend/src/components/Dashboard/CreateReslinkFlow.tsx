import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TitleStep } from './TitleStep';
import { ResumeUploadStep } from './ResumeUploadStep';
import { PitchCreationSection } from './PitchCreationSection';
import { ProgressSteps } from './ProgressSteps';
import { RecordVideoStep } from './RecordVideoStep';
import { Button } from '../ui/Button';
import { AppLayout } from '../Layout/AppLayout';
import { apiService } from '../../services/api';

interface CreateReslinkFlowProps {}

export const CreateReslinkFlow = ({}: CreateReslinkFlowProps) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [showTeleprompter, setShowTeleprompter] = useState(false);
  const [reslinkTitle, setReslinkTitle] = useState('');
  const [name, setName] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [script, setScript] = useState('');

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStartRecording = () => {
    setCurrentStep(4);
  };

  const handleBackToPitchCreation = () => {
    setCurrentStep(3); // Go back to pitch creation step
  };

  const handleExitTeleprompter = async (uploadedVideoUrl?: string) => {
    
    try {
      let resumeUrl = '';
      
      // Create reslink in database first to get ID for badge generation
      console.log('Creating reslink in database...');
      const titleParts = reslinkTitle.split(' - ');
      const newReslinkData = {
        title: reslinkTitle,
        name: name,
        position: titleParts[0] || 'Position', 
        company: titleParts[1] || 'Company',
        video_url: uploadedVideoUrl || '',
        resume_url: '', // Will be set after processing resume
        status: 'draft' as const,
      };
      
      const savedReslink = await apiService.createReslink(newReslinkData);
      console.log('Reslink created successfully:', savedReslink);

      // Process and upload resume with badge if both video and resume exist
      if (resumeFile && uploadedVideoUrl && savedReslink.id) {
        try {
          console.log('Applying badge to resume and uploading...');
          // Add badge to PDF
          const badgedPdfBlob = await apiService.addBadgeToPDF(savedReslink.id, resumeFile);
          
          // Upload badged resume
          const badgedFile = new File([badgedPdfBlob], `${name}-resume-badged.pdf`, { type: 'application/pdf' });
          const resumeUploadResult = await apiService.uploadResume(badgedFile);
          resumeUrl = resumeUploadResult.url;
          
          // Update reslink with badged resume URL
          await apiService.updateReslink(savedReslink.id, { resume_url: resumeUrl });
          
        } catch (badgeError) {
          console.warn('Badge failed, uploading original resume:', badgeError);
          // Fallback to original resume
          const resumeUploadResult = await apiService.uploadResume(resumeFile);
          resumeUrl = resumeUploadResult.url;
          await apiService.updateReslink(savedReslink.id, { resume_url: resumeUrl });
        }
      } else if (resumeFile) {
        console.log('Uploading original resume...');
        const resumeUploadResult = await apiService.uploadResume(resumeFile);
        resumeUrl = resumeUploadResult.url;
        await apiService.updateReslink(savedReslink.id, { resume_url: resumeUrl });
      }
      
    } catch (error) {
      console.error('Error creating reslink:', error);
    } finally {
      navigate('/dashboard');
      resetFlow();
    }
  };

  const resetFlow = () => {
    setCurrentStep(1);
    setReslinkTitle('');
    setName('');
    setResumeFile(null);
    setScript('');
  };

  const handleClose = () => {
    navigate('/dashboard');
    resetFlow();
  };


  return (
    <AppLayout>
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-2 py-3 md:gap-3 md:py-4 px-4 lg:px-6">
          
          
          <div className="space-y-4">
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

            {currentStep === 4 && (
              <RecordVideoStep 
                script={script}
                onPrevious={handlePreviousStep}
                onComplete={handleExitTeleprompter}
              />
            )}
          </div>
          
          {currentStep !== 4 && (
            <div className="flex justify-between items-center mt-4 pt-4 border-t">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};