import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/card';
import { TextArea } from '@/components/ui/TextArea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Video, 
  ArrowLeft, 
  Zap, 
  MessageSquare,
  Play,
  Eye,
  EyeOff 
} from 'lucide-react';
import { PitchAIModal } from './PitchAIModal';

interface PitchCreationSectionProps {
  onStartRecording?: () => void;
  onPrevious?: () => void;
  script?: string;
  setScript?: (script: string) => void;
  resumeFile?: File | null;
}

export const PitchCreationSection: React.FC<PitchCreationSectionProps> = ({ 
  onStartRecording = () => {},
  onPrevious = () => {},
  script = '',
  setScript = () => {},
  resumeFile = null
}) => {
  const [showPitchAI, setShowPitchAI] = useState(false);
  const [teleprompterEnabled, setTeleprompterEnabled] = useState(true);

  const handleStartRecording = () => {
    // If no script, show PitchAI modal first
    if (!script.trim()) {
      setShowPitchAI(true);
    } else {
      onStartRecording();
    }
  };

  const handlePitchAIClose = () => {
    setShowPitchAI(false);
  };

  const handleScriptGenerated = (generatedScript: string) => {
    setScript(generatedScript);
    setShowPitchAI(false);
    // After script is generated, proceed to recording
    onStartRecording();
  };

  const handleWriteWithPitchAI = () => {
    setShowPitchAI(true);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Create Your Pitch
        </h1>
        <p className="text-muted-foreground text-lg">
          Choose how you'd like to create your video pitch and optionally use our teleprompter.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-8" style={{ minHeight: '600px' }}>
        {/* Left Section - Recording Options */}
        <div>
          {/* Record Video Option */}
          <Card className="p-10 text-center hover:shadow-md transition-shadow h-full flex flex-col justify-between">
            <div className="mb-8">
              <Video className="h-20 w-20 text-primary mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-foreground mb-4">
                Record Video Pitch
              </h3>
              <p className="text-muted-foreground text-lg">
                Use our built-in recorder to capture your pitch in minutes with optional teleprompter support.
              </p>
            </div>
            
            <div className="space-y-6 flex-grow flex flex-col justify-end">
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-3 text-base text-muted-foreground">
                  <Play className="h-5 w-5" />
                  <span>Built-in recorder</span>
                </div>
                <div className="flex items-center justify-center gap-3 text-base text-muted-foreground">
                  <MessageSquare className="h-5 w-5" />
                  <span>Teleprompter support</span>
                </div>
              </div>
              
              <Button 
                onClick={handleStartRecording}
                className="w-full gap-2 mt-8 text-lg py-6"
                size="lg"
              >
                <Video className="h-5 w-5" />
                Start Recording
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Section - Teleprompter Script */}
        <div>
          <Card className="p-8 h-full flex flex-col">
            {/* Teleprompter Header */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-semibold text-foreground">Teleprompter</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setTeleprompterEnabled(!teleprompterEnabled)}
                  className={`gap-2 ${teleprompterEnabled ? 'text-primary' : 'text-muted-foreground'}`}
                >
                  {teleprompterEnabled ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  {teleprompterEnabled ? 'Enabled' : 'Disabled'}
                </Button>
              </div>
              
              <p className="text-muted-foreground text-lg">
                Toggle on the teleprompter to display your script while recording your video pitch.
              </p>
            </div>

            <Separator className="mb-6" />

            {/* Script Editor - Flex grow to fill available space */}
            <div className="flex-1 flex flex-col space-y-6">
              <div className="bg-muted/50 rounded-lg p-6 flex-1" style={{ minHeight: '350px' }}>
                <textarea
                  value={script}
                  onChange={(e) => setScript(e.target.value)}
                  className="w-full h-full resize-none border-none bg-transparent text-foreground text-base leading-relaxed focus:outline-none placeholder:text-muted-foreground"
                  placeholder="Use this space to draft your script and stay on point while recording your video. Our AI can help generate a personalized pitch based on your resume!"
                />
              </div>

              <div className="space-y-4">
                <Button 
                  onClick={handleWriteWithPitchAI}
                  variant="secondary"
                  className="w-full gap-2 text-lg py-6"
                  size="lg"
                >
                  <Zap className="h-5 w-5" />
                  Write with PitchAI
                </Button>

                {script && (
                  <div className="text-sm text-muted-foreground text-center">
                    {script.trim().split(' ').length} words • ~{Math.ceil(script.trim().split(' ').length / 150)} min read
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>

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
          Step 3 of 3
        </div>
        
        <div className="w-32"></div> {/* Spacer for alignment */}
      </div>

      {/* PitchAI Modal */}
      {showPitchAI && (
        <PitchAIModal
          onClose={handlePitchAIClose}
          onScriptGenerated={handleScriptGenerated}
          resumeFile={resumeFile}
        />
      )}
    </div>
  );
};