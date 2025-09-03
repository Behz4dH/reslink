import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, FileText, X, ArrowLeft, ArrowRight, CheckCircle, Info } from 'lucide-react';

interface ResumeUploadStepProps {
  resumeFile?: File | null;
  setResumeFile?: (file: File | null) => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

export const ResumeUploadStep: React.FC<ResumeUploadStepProps> = ({ 
  resumeFile = null,
  setResumeFile = () => {},
  onNext = () => {},
  onPrevious = () => {}
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string>('');

  const validateFile = (file: File) => {
    if (file.type !== 'application/pdf') {
      return 'Please select a PDF file only.';
    }
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      return 'File size must be less than 10MB.';
    }
    return null;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const errorMsg = validateFile(file);
      if (errorMsg) {
        setError(errorMsg);
        return;
      }
      setError('');
      setResumeFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      const errorMsg = validateFile(file);
      if (errorMsg) {
        setError(errorMsg);
        return;
      }
      setError('');
      setResumeFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleBrowseFiles = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    setResumeFile(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + ' KB';
    return Math.round(bytes / (1024 * 1024)) + ' MB';
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Upload Your Resume
        </h1>
        <p className="text-muted-foreground text-lg">
          Upload your PDF resume to include with your Reslink application.
        </p>
      </div>

      {/* Upload Section */}
      <Card className="p-8 mb-6">
        <div className="space-y-6">
          {/* Upload Area */}
          <div 
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`
              border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer
              ${dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}
              ${resumeFile ? 'border-green-500 bg-green-50/50' : ''}
              hover:border-primary hover:bg-muted/50
            `}
            onClick={handleBrowseFiles}
          >
            <div className="flex flex-col items-center">
              {resumeFile ? (
                <>
                  <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">Resume Uploaded Successfully!</h3>
                  <p className="text-muted-foreground mb-4">Click to upload a different file</p>
                </>
              ) : (
                <>
                  <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">Drop your resume here</h3>
                  <p className="text-muted-foreground mb-4">or click to browse your files</p>
                  <Badge variant="secondary" className="mb-4">PDF files only • Max 10MB</Badge>
                </>
              )}
              
              <Button variant="outline" type="button" className="gap-2">
                <Upload className="h-4 w-4" />
                {resumeFile ? 'Choose Different File' : 'Browse Files'}
              </Button>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Uploaded File Display */}
          {resumeFile && (
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">{resumeFile.name}</p>
                    <p className="text-sm text-muted-foreground">{formatFileSize(resumeFile.size)}</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile();
                  }}
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  Remove
                </Button>
              </div>
            </Card>
          )}
        </div>
      </Card>

      {/* Reslink Badge Info */}
      <Card className="p-6 mb-8">
        <div className="flex items-start gap-4">
          <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-foreground">Reslink Badge</h3>
              <Badge variant="default" className="bg-green-100 text-green-800 border-green-300">
                <CheckCircle className="h-3 w-3 mr-1" />
                Enabled
              </Badge>
            </div>
            <p className="text-muted-foreground mb-3">
              A clickable button will be automatically added to your resume that links directly to your Reslink, 
              making it easy for recruiters to view your video pitch.
            </p>
            <Button variant="link" className="p-0 h-auto text-primary">
              Learn more about resume badges →
            </Button>
          </div>
        </div>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button 
          variant="outline" 
          onClick={onPrevious}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Previous Step
        </Button>
        
        <div className="text-sm text-muted-foreground">
          Step 2 of 3
        </div>
        
        <Button 
          onClick={onNext}
          disabled={!resumeFile}
          size="lg"
          className="gap-2"
        >
          Next Step
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};