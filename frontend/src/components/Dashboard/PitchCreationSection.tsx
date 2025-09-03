import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/card';
import { TextArea } from '@/components/ui/TextArea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Video, 
  Upload, 
  ArrowLeft, 
  Zap, 
  Crown, 
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

      <div className="grid lg:grid-cols-3 gap-8 mb-8">
        {/* Left Section - Recording Options */}
        <div className="lg:col-span-2">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Record Video Option */}
            <Card className="p-8 text-center hover:shadow-md transition-shadow">
              <div className="mb-6">
                <Video className="h-16 w-16 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Record Video Pitch
                </h3>
                <p className="text-muted-foreground">
                  Use our built-in recorder to capture your pitch in minutes with optional teleprompter support.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Play className="h-4 w-4" />
                  <span>Built-in recorder</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <MessageSquare className="h-4 w-4" />
                  <span>Teleprompter support</span>
                </div>
                
                <Button 
                  onClick={handleStartRecording}
                  className="w-full gap-2"
                  size="lg"
                >
                  <Video className="h-4 w-4" />
                  Start Recording
                </Button>
              </div>
            </Card>

            {/* Upload Video Option */}
            <Card className="p-8 text-center hover:shadow-md transition-shadow border-dashed">
              <div className="mb-6">
                <Upload className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Upload Custom Video
                </h3>
                <p className="text-muted-foreground">
                  Already have a professionally edited video or custom pitch? Upload your own file.
                </p>
              </div>
              
              <div className="space-y-4">
                <Badge variant="secondary" className="mx-auto">
                  <Crown className="h-3 w-3 mr-1" />
                  Premium Feature
                </Badge>
                
                <Button 
                  variant="outline" 
                  className="w-full gap-2" 
                  size="lg"
                  disabled
                >
                  <Crown className="h-4 w-4" />
                  Upgrade to Premium
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Right Section - Teleprompter Script */}
        <div className="lg:col-span-1">
          <Card className="p-6 h-full">
            <div className="space-y-6">
              {/* Teleprompter Header */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground">Teleprompter</h3>
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
                
                <p className="text-sm text-muted-foreground">
                  Toggle on the teleprompter to display your script while recording your video pitch.
                </p>
              </div>

              <Separator />

              {/* Script Editor */}
              <div className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-4" style={{ minHeight: '300px' }}>
                  <textarea
                    value={script}
                    onChange={(e) => setScript(e.target.value)}
                    className="w-full h-full min-h-[260px] resize-none border-none bg-transparent text-foreground text-sm leading-relaxed focus:outline-none placeholder:text-muted-foreground"
                    placeholder="Use this space to draft your script and stay on point while recording your video. Our AI can help generate a personalized pitch based on your resume!"
                  />
                </div>

                <Button 
                  onClick={handleWriteWithPitchAI}
                  variant="secondary"
                  className="w-full gap-2"
                >
                  <Zap className="h-4 w-4" />
                  Write with PitchAI
                </Button>

                {script && (
                  <div className="text-xs text-muted-foreground text-center">
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