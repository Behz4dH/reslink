import { useState } from 'react';
import { AppSidebar } from '../app-sidebar';
import { SiteHeader } from '../site-header';
import { TitleStep } from './TitleStep';
import { ResumeUploadStep } from './ResumeUploadStep';
import { PitchCreationSection } from './PitchCreationSection';
import { ProgressSteps } from './ProgressSteps';
import { Teleprompter } from '../Teleprompter/Teleprompter';
import { SimpleReslinksTable } from './SimpleReslinksTable';
import { ReslinkFilters } from './ReslinkFilters';
import { Pagination } from './Pagination';
import { useReslinks } from '../../hooks/useReslinks';
import { apiService } from '../../services/api';
import type { Reslink } from '../../types/reslink';
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/Button";

export const Dashboard = () => {
  const [currentStep, setCurrentStep] = useState(0); // 0 = dashboard view, 1-3 = create flow
  const [showTeleprompter, setShowTeleprompter] = useState(false);
  const [reslinkTitle, setReslinkTitle] = useState('');
  const [name, setName] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [script, setScript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Use the new query hook for reslinks
  const {
    data: reslinks,
    loading,
    error,
    pagination,
    params,
    search,
    sort,
    filter,
    clearSearch,
    clearFilters,
    goToPage,
    addReslink,
    refresh,
    changeItemsPerPage
  } = useReslinks();

  console.log('🏠 Dashboard received from hook:', { reslinks, reslinksLength: reslinks?.length, loading, error });

  const handleNewReslink = () => {
    setCurrentStep(1); // Start the create flow
    setReslinkTitle('');
    setName('');
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
      setIsProcessing(true);
    }
    
    if (uploadedVideoUrl) {
      try {
        // 1. Video upload successful ✅ (already done)
        console.log('✅ Video uploaded:', uploadedVideoUrl);
        
        // 2. Create reslink first to get unique_id and trackable API
        const titleParts = reslinkTitle.split(' - ');
        const newReslinkData = {
          title: reslinkTitle,
          name: name,
          position: titleParts[0] || 'Position', 
          company: titleParts[1] || 'Company',
          video_url: uploadedVideoUrl,
          resume_url: '', // Will be updated later
          status: 'published' as const,
        };
        
        const savedReslink = await apiService.createReslink(newReslinkData);
        console.log('✅ Reslink created with unique_id:', savedReslink.unique_id);
        
        // 3. Generate badged PDF and upload it as the resume
        let resumeUrl = '';
        if (resumeFile && savedReslink.id) {
          console.log('✅ Adding badge to resume...');
          const badgedPdfBlob = await apiService.addBadgeToPDF(savedReslink.id, resumeFile);
          
          // Auto-download the badged resume for user
          const downloadUrl = URL.createObjectURL(badgedPdfBlob);
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.download = `${savedReslink.name}-resume-with-reslink-badge.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(downloadUrl);
          
          // Convert badged PDF blob to File and upload as the resume
          const badgedFile = new File([badgedPdfBlob], `${savedReslink.name}-resume-badged.pdf`, { type: 'application/pdf' });
          const resumeUploadResult = await apiService.uploadResume(badgedFile);
          resumeUrl = resumeUploadResult.url;
          
          // Update reslink with badged resume URL
          await apiService.updateReslink(savedReslink.id, { resume_url: resumeUrl });
        }
        
        addReslink(savedReslink);
        
        setTimeout(() => {
          setCurrentStep(0);
          setReslinkTitle('');
          setName('');
          setResumeFile(null);
          setScript('');
          setIsProcessing(false);
          window.location.reload();
        }, 1500);
        
      } catch (error) {
        console.error('❌ Error:', error);
        setIsProcessing(false);
        setCurrentStep(0);
        setReslinkTitle('');
        setName('');
        setResumeFile(null);
        setScript('');
      }
    } else {
      setCurrentStep(0);
      setReslinkTitle('');
      setName('');
      setResumeFile(null);
      setScript('');
      setIsProcessing(false);
    }
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

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Processing your reslink...</h2>
          <p className="text-gray-600">Generating your badged resume and setting up tracking</p>
        </div>
      </div>
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

                  <div className="space-y-6">
                    {/* Filters and Search */}
                    <ReslinkFilters
                      onSearch={search}
                      onFilter={filter}
                      onSort={sort}
                      onClearSearch={clearSearch}
                      onClearFilters={clearFilters}
                      currentSearch={params.search || ''}
                      currentFilters={params.filters || {}}
                      currentSort={{
                        sortBy: params.sortBy || 'created_date',
                        sortOrder: params.sortOrder || 'desc'
                      }}
                    />

                    {/* Results Table */}
                    <SimpleReslinksTable data={reslinks} loading={loading} error={error} />

                    {/* Pagination */}
                    {pagination && pagination.totalPages > 1 && (
                      <Pagination
                        currentPage={pagination.page}
                        totalPages={pagination.totalPages}
                        totalItems={pagination.total}
                        itemsPerPage={pagination.limit}
                        onPageChange={goToPage}
                        onItemsPerPageChange={changeItemsPerPage}
                        loading={loading}
                      />
                    )}
                  </div>
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
                </>
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};