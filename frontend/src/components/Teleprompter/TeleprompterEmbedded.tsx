import React, { useState } from 'react';
import { useTeleprompter } from '../../hooks/useTeleprompter';
import { useVideoRecording } from '../../hooks/useVideoRecording';
import { Button } from '../ui/Button';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import { Slider } from '../ui/slider';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  Video,
  Upload,
  Trash2,
  Eye,
  EyeOff,
  Settings,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';

interface TeleprompterEmbeddedProps {
  script?: string;
  onExit?: (uploadedVideoUrl?: string) => void;
  onBackToPitchCreation?: () => void;
}

export const TeleprompterEmbedded: React.FC<TeleprompterEmbeddedProps> = ({ 
  script = '', 
  onExit = () => {},
  onBackToPitchCreation = () => {}
}) => {
  const [teleprompterEnabled, setTeleprompterEnabled] = useState(true);
  const {
    settings,
    containerRef,
    play,
    pause,
    reset,
    setScrollSpeed,
    setFontSize
  } = useTeleprompter();

  const {
    isRecording,
    hasRecorded,
    recordingTime,
    videoBlob,
    videoUrl,
    error,
    permissionError,
    startRecording,
    stopRecording,
    deleteRecording,
    uploadRecording
  } = useVideoRecording();

  const handleStartRecording = async () => {
    await startRecording();
    if (teleprompterEnabled) {
      play();
    }
  };

  const handleStopRecording = () => {
    stopRecording();
    if (teleprompterEnabled) {
      pause();
    }
  };

  const handleUploadAndExit = async () => {
    if (videoBlob) {
      const uploadedUrl = await uploadRecording();
      onExit(uploadedUrl);
    } else {
      onExit();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getFontSizeClass = () => {
    switch (settings.fontSize) {
      case 'small': return 'text-lg';
      case 'medium': return 'text-xl';
      case 'large': return 'text-2xl';
      default: return 'text-xl';
    }
  };

  return (
    <div className="w-full h-full bg-black relative">
      {/* Teleprompter Content Area */}
      <div className="relative h-full flex items-center justify-center">
        {teleprompterEnabled ? (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Center Line */}
            <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-primary opacity-30 z-20"></div>
            
            {/* Scrolling Text Container */}
            <div
              ref={containerRef}
              className="absolute inset-0 z-10 overflow-hidden"
              style={{
                maskImage: 'linear-gradient(to bottom, transparent 0%, black 25%, black 75%, transparent 100%)'
              }}
            >
              <div className={`
                text-white text-center px-8 py-4 leading-relaxed
                ${getFontSizeClass()}
              `}>
                {script.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-6">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-white text-center">
            <Video className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">Teleprompter is disabled</p>
            <p className="text-sm opacity-70 mt-2">Record without the scrolling text</p>
          </div>
        )}

        {/* Recording Controls - Bottom Center */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30">
          <Card className="p-4 bg-background/90 backdrop-blur border">
            <div className="flex items-center gap-4">
              {!isRecording && !hasRecorded && (
                <Button 
                  onClick={handleStartRecording}
                  disabled={!!permissionError}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  <Video className="h-4 w-4 mr-2" />
                  Start Recording
                </Button>
              )}
              
              {isRecording && (
                <>
                  <Button 
                    onClick={handleStopRecording}
                    className="bg-red-700 hover:bg-red-800 text-white"
                  >
                    <Pause className="h-4 w-4 mr-2" />
                    Stop Recording
                  </Button>
                  <Badge variant="outline" className="bg-red-100 text-red-700">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatTime(recordingTime)}
                  </Badge>
                </>
              )}

              {hasRecorded && !isRecording && (
                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleUploadAndExit}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Save & Complete
                  </Button>
                  <Button
                    onClick={deleteRecording}
                    variant="outline"
                    className="text-red-600 border-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Settings - Top Left */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-30">
          <Card className="p-3 bg-background/90 backdrop-blur border">
            <div className="flex items-center gap-2 mb-3">
              <Settings className="h-4 w-4" />
              <span className="text-sm font-medium">Controls</span>
            </div>
            
            <div className="space-y-3">
              {/* Teleprompter Toggle */}
              <Button
                size="sm"
                variant="outline"
                onClick={() => setTeleprompterEnabled(!teleprompterEnabled)}
                className="w-full justify-start"
              >
                {teleprompterEnabled ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
                {teleprompterEnabled ? 'Hide Text' : 'Show Text'}
              </Button>

              {teleprompterEnabled && (
                <>
                  {/* Playback Controls */}
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" onClick={play}>
                      <Play className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={pause}>
                      <Pause className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={reset}>
                      <RotateCcw className="h-3 w-3" />
                    </Button>
                  </div>

                  {/* Speed Control */}
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">Speed: {settings.scrollSpeed}</label>
                    <Slider
                      value={[settings.scrollSpeed]}
                      onValueChange={(value) => setScrollSpeed(value[0] as 1 | 2 | 3 | 4 | 5)}
                      max={5}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  {/* Font Size Control */}
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant={settings.fontSize === 'small' ? 'default' : 'outline'}
                      onClick={() => setFontSize('small')}
                      className="text-xs"
                    >
                      A
                    </Button>
                    <Button
                      size="sm"
                      variant={settings.fontSize === 'medium' ? 'default' : 'outline'}
                      onClick={() => setFontSize('medium')}
                      className="text-sm"
                    >
                      A
                    </Button>
                    <Button
                      size="sm"
                      variant={settings.fontSize === 'large' ? 'default' : 'outline'}
                      onClick={() => setFontSize('large')}
                      className="text-base"
                    >
                      A
                    </Button>
                  </div>
                </>
              )}
            </div>
          </Card>
        </div>

        {/* Back Button - Top Right */}
        <div className="absolute top-4 right-4 z-40">
          <Button
            onClick={onBackToPitchCreation}
            variant="outline"
            className="bg-background/90 backdrop-blur"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Script
          </Button>
        </div>
      </div>

      {/* Error Messages */}
      {(error || permissionError) && (
        <div className="absolute top-20 left-4 right-4 z-50">
          <Alert className="bg-destructive/90 text-destructive-foreground border-destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {permissionError || error}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Video Preview */}
      {videoUrl && (
        <div className="absolute bottom-20 right-4 z-30">
          <Card className="p-2 bg-background/90 backdrop-blur">
            <video 
              src={videoUrl} 
              controls 
              className="w-48 h-32 rounded"
            />
          </Card>
        </div>
      )}
    </div>
  );
};