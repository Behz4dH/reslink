import { useState, useEffect } from 'react';
import { AppSidebar } from '../app-sidebar';
import { SiteHeader } from '../site-header';
import { TitleStep } from './TitleStep';
import { ResumeUploadStep } from './ResumeUploadStep';
import { PitchCreationSection } from './PitchCreationSection';
import { ProgressSteps } from './ProgressSteps';
import { Teleprompter } from '../Teleprompter/Teleprompter';
import { SimpleReslinksTable } from './SimpleReslinksTable';
import { apiService } from '../../services/api';
import type { Reslink } from '../../types/reslink';
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

export const Dashboard = () => {
  const [currentStep, setCurrentStep] = useState(0); // 0 = dashboard view, 1-3 = create flow
  const [showTeleprompter, setShowTeleprompter] = useState(false);
  const [reslinkTitle, setReslinkTitle] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [script, setScript] = useState('');
  const [reslinks, setReslinks] = useState<Reslink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch reslinks from API
  useEffect(() => {
    const fetchReslinks = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiService.getAllReslinks();
        setReslinks(data);
      } catch (err) {
        console.error('Failed to fetch reslinks:', err);
        setError(err instanceof Error ? err.message : 'Failed to load reslinks');
        setReslinks([]); // Fallback to empty array
      } finally {
        setLoading(false);
      }
    };

    fetchReslinks();
  }, []);

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

  const handleExitTeleprompter = async (uploadedVideoUrl?: string) => {
    console.log('🔥 handleExitTeleprompter called with uploadedVideoUrl:', uploadedVideoUrl);
    setShowTeleprompter(false);
    
    if (uploadedVideoUrl) {
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
        const newReslinkData = {
          title: reslinkTitle,
          name: reslinkTitle.split(' - ')[0] || reslinkTitle,
          position: reslinkTitle.split(' - ')[1] || 'Position', 
          company: reslinkTitle.split(' - ')[2] || 'Company',
          video_url: uploadedVideoUrl,
          resume_url: resumeUrl,
          status: 'draft' as const,
        };
        
        const savedReslink = await apiService.createReslink(newReslinkData);
        console.log('Reslink created successfully:', savedReslink);
        
        // Add the new reslink to the list
        setReslinks(prev => [savedReslink, ...prev]);
        
      } catch (error) {
        console.error('Error creating reslink:', error);
        setError('Failed to create reslink. Please try again.');
      }
    }
    
    // Reset back to dashboard
    setCurrentStep(0);
    // Reset form data
    setReslinkTitle('');
    setResumeFile(null);
    setScript('');
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
    <SidebarProvider
      style={
        {
          "--sidebar-width": "15rem",
          "--header-height": "5rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader onNewReslink={handleNewReslink} />
        <div className="flex flex-1 flex-col">
          <div className="flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
              {currentStep === 0 && (
                <>
                  <div className="mb-8">
                    <h1 className="text-2xl font-semibold tracking-tight mb-2">My Reslinks</h1>
                    <p className="text-muted-foreground">Manage your professional video introductions</p>
                  </div>

                  <SimpleReslinksTable data={reslinks} loading={loading} error={error} />
                </>
              )}

              {currentStep > 0 && (
                <>
                  <div className="mb-4">
                    <Button 
                      variant="ghost"
                      onClick={handleBackToDashboard}
                      className="mb-4 p-0 h-auto"
                    >
                      ← Back to Dashboard
                    </Button>
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
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};