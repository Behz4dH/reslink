import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TextArea } from '@/components/ui/TextArea';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Zap, X, Info } from 'lucide-react';
import { GeneratedScriptModal } from './GeneratedScriptModal';

interface PitchAIModalProps {
  onClose?: () => void;
  onScriptGenerated?: (script: string) => void;
  resumeFile?: File | null;
}

export const PitchAIModal: React.FC<PitchAIModalProps> = ({ 
  onClose = () => {}, 
  onScriptGenerated = () => {}, 
  resumeFile = null 
}) => {
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedScript, setGeneratedScript] = useState('');
  const [showGeneratedScript, setShowGeneratedScript] = useState(false);
  const [error, setError] = useState('');

  const validateForm = () => {
    if (!jobTitle.trim()) {
      setError('Job title is required');
      return false;
    }
    if (jobTitle.trim().length < 2) {
      setError('Job title must be at least 2 characters');
      return false;
    }
    if (!jobDescription.trim()) {
      setError('Job description is required');
      return false;
    }
    if (jobDescription.trim().length < 50) {
      setError('Job description must be at least 50 characters for better results');
      return false;
    }
    setError('');
    return true;
  };

  const handleGenerate = async () => {
    if (!validateForm()) return;
    
    setIsGenerating(true);
    setError('');
    
    try {
      // Call the actual API
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/pitch/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: `Job Title: ${jobTitle}\n\nJob Description: ${jobDescription}`,
          length: 60,
          tone: 'professional'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate script');
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to generate script');
      }
      
      setGeneratedScript(result.data.script);
      setShowGeneratedScript(true);
      setIsGenerating(false);
    } catch (error) {
      setIsGenerating(false);
      setError('Failed to generate script. Please try again.');
      console.error('Error generating script:', error);
    }
  };

  const handleScriptSaved = (script: string) => {
    onScriptGenerated(script);
    onClose();
  };

  if (showGeneratedScript) {
    return (
      <GeneratedScriptModal
        script={generatedScript}
        onClose={onClose}
        onSave={handleScriptSaved}
      />
    );
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Reslink PitchAI
          </DialogTitle>
          <DialogDescription>
            Generate a personalized video pitch script tailored to your resume and the specific job you're applying for.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Info Alert */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Provide the job title and description for the most accurate, personalized script generation.
            </AlertDescription>
          </Alert>

          {/* Job Title Input */}
          <div className="space-y-2">
            <Label htmlFor="jobTitle" className="text-base font-semibold">
              Job Title
            </Label>
            <Input
              id="jobTitle"
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g., UX/UI Designer, Software Engineer, Product Manager"
              className="h-12"
              disabled={isGenerating}
            />
          </div>

          {/* Job Description Input */}
          <div className="space-y-2">
            <Label htmlFor="jobDescription" className="text-base font-semibold">
              Job Description
            </Label>
            <div className="bg-muted/50 rounded-lg p-4">
              <textarea
                id="jobDescription"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the complete job description here. Include requirements, responsibilities, and company information for the best results..."
                rows={6}
                disabled={isGenerating}
                className="w-full bg-transparent border-none resize-none focus:outline-none text-sm leading-relaxed placeholder:text-muted-foreground"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {jobDescription.length}/500+ characters recommended
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isGenerating}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleGenerate}
            disabled={!jobTitle.trim() || !jobDescription.trim() || isGenerating}
            className="gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4" />
                Generate Script
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};