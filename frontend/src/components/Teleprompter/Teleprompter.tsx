import React, { useState } from 'react';
import { useTeleprompter } from '../../hooks/useTeleprompter';
import { useVideoRecording } from '../../hooks/useVideoRecording';
import { Button } from '../ui/Button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Label } from '../ui/label';
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

interface TeleprompterProps {
  script?: string;
  onExit?: (uploadedVideoUrl?: string) => void;
  onBackToPitchCreation?: () => void;
}

type TeleprompterSettings = {
  fontSize: 'small' | 'medium' | 'large';
  scrollSpeed: 1 | 2 | 3 | 4 | 5;
  isPlaying: boolean;
  currentPosition: number;
};

export const Teleprompter: React.FC<TeleprompterProps> = ({ 
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
    setFontSize,
    setScrollSpeed,
  } = useTeleprompter(script);

  const {
    isRecording,
    startRecording,
    stopRecording,
    videoRef,
    uploadedVideoUrl,
    isUploading,
    error,
    recordedVideoUrl,
    hasRecording,
    uploadRecordedVideo,
    discardRecording,
    duration,
  } = useVideoRecording();

  // Auto-start teleprompter when recording starts
  const handleStartRecording = async () => {
    await startRecording();
    if (teleprompterEnabled) {
      play(); // Automatically start scrolling when recording begins
    }
  };

  // Auto-pause teleprompter when recording stops
  const handleStopRecording = () => {
    stopRecording();
    pause(); // Automatically pause scrolling when recording stops
  };

  // Handle exit with uploaded video URL
  const handleExit = () => {
    onExit(uploadedVideoUrl || undefined);
  };

  // Handle video upload confirmation
  const handleUploadVideo = async () => {
    const uploadedUrl = await uploadRecordedVideo();
    if (uploadedUrl) {
      console.log('Video uploaded successfully, completing reslink creation...');
      onExit(uploadedUrl);
    }
  };

  // Handle discard recording
  const handleDiscardRecording = () => {
    discardRecording();
    reset(); // Reset teleprompter to initial position
  };

  const getFontSizeValue = () => {
    return settings.fontSize === 'small' ? 0 : settings.fontSize === 'medium' ? 1 : 2;
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Header */}
      <div className="border-b bg-card shadow-sm">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={onBackToPitchCreation}
                disabled={isUploading}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Edit Script
              </Button>
              <Button
                variant="outline"
                onClick={handleExit}
                disabled={isUploading}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                {isUploading ? 'Uploading...' : 'Exit'}
              </Button>
            </div>
            <h1 className="text-2xl font-bold text-foreground">Record Your Pitch</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <Label htmlFor="teleprompter-toggle" className="text-sm font-medium">
              Teleprompter
            </Label>
            <Button
              id="teleprompter-toggle"
              variant="outline"
              size="sm"
              onClick={() => setTeleprompterEnabled(!teleprompterEnabled)}
              className={`gap-2 ${teleprompterEnabled ? 'text-primary' : 'text-muted-foreground'}`}
            >
              {teleprompterEnabled ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              {teleprompterEnabled ? 'On' : 'Off'}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Video Recording Area */}
        <div className="flex-1 flex items-center justify-center bg-muted/30 p-8">
          <div className="relative">
            {/* Main Video Window */}
            <Card className="w-[800px] h-[600px] p-0 overflow-hidden shadow-2xl">
              <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
                {hasRecording && recordedVideoUrl ? (
                  // Show recorded video for review
                  <div className="relative w-full h-full">
                    <video
                      src={recordedVideoUrl}
                      controls
                      className="w-full h-full object-cover"
                      controlsList="nodownload"
                    />
                    <div className="absolute top-4 right-4 z-40">
                      <Badge className="gap-1">
                        <Video className="h-3 w-3" />
                        Review Recording
                      </Badge>
                    </div>
                  </div>
                ) : (
                  // Show live camera feed
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    className="w-full h-full object-cover"
                    style={{ transform: 'scaleX(-1)' }}
                  />
                )}
                
                {/* Teleprompter Text Overlay - Only show during live recording */}
                {teleprompterEnabled && !hasRecording && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                    <div className="w-full h-full relative">
                      {/* Center line */}
                      <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-primary opacity-30 z-20"></div>
                      
                      {/* Gradient Mask */}
                      <div 
                        className="absolute inset-0 z-10"
                        style={{
                          background: `linear-gradient(
                            to bottom,
                            rgba(0,0,0,0.9) 0%,
                            rgba(0,0,0,0.3) 25%,
                            rgba(0,0,0,0) 45%,
                            rgba(0,0,0,0) 55%,
                            rgba(0,0,0,0.3) 75%,
                            rgba(0,0,0,0.9) 100%
                          )`
                        }}
                      />
                      
                      {/* Script Text */}
                      <div className="w-full h-full flex items-center justify-center px-16">
                        <div className="overflow-hidden relative w-full h-full">
                          <div
                            className={`text-white leading-relaxed font-bold text-center ${
                              settings.fontSize === 'small' ? 'text-2xl' : 
                              settings.fontSize === 'medium' ? 'text-3xl' : 'text-4xl'
                            }`}
                            style={{ 
                              transform: `translateY(-${settings.currentPosition}px)`,
                              transition: 'transform 0.1s linear',
                              textShadow: '4px 4px 12px rgba(0,0,0,0.95), 0px 0px 20px rgba(0,0,0,0.8)',
                              paddingBottom: '100vh'
                            }}
                          >
                            <div style={{ height: '35vh', marginBottom: '0' }}></div>
                            {script.split('\n').map((paragraph, index) => (
                              <p key={index} className="mb-8 leading-tight max-w-4xl mx-auto">
                                {paragraph}
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Recording Controls Overlay */}
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30">
                  {hasRecording && !isUploading ? (
                    // Review stage - show upload/discard options
                    <div className="flex gap-3">
                      <Button
                        onClick={handleDiscardRecording}
                        variant="secondary"
                        className="gap-2 shadow-lg"
                      >
                        <Trash2 className="h-4 w-4" />
                        Discard & Re-record
                      </Button>
                      <Button
                        onClick={handleUploadVideo}
                        className="gap-2 shadow-lg"
                      >
                        <Upload className="h-4 w-4" />
                        Upload & Continue
                      </Button>
                    </div>
                  ) : (
                    // Recording stage - show record button
                    <Button
                      onClick={isRecording ? handleStopRecording : handleStartRecording}
                      disabled={isUploading}
                      size="lg"
                      className={`w-20 h-20 rounded-full border-4 border-white ${
                        isRecording ? 'bg-destructive hover:bg-destructive/90' : 'bg-destructive hover:bg-destructive/90'
                      } shadow-xl`}
                    >
                      {isRecording ? (
                        <div className="w-6 h-6 bg-white rounded-sm"></div>
                      ) : (
                        <div className="w-6 h-6 bg-white rounded-full"></div>
                      )}
                    </Button>
                  )}
                </div>

                {/* Status Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2 z-30">
                  {/* Recording Timer */}
                  {isRecording && (
                    <Badge variant="destructive" className="gap-2 shadow-lg">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      Recording: {formatDuration(duration)}
                    </Badge>
                  )}

                  {/* Review Stage */}
                  {hasRecording && !isUploading && !uploadedVideoUrl && (
                    <Badge className="bg-amber-500 text-white gap-2 shadow-lg">
                      <Clock className="h-3 w-3" />
                      Ready to Review
                    </Badge>
                  )}

                  {/* Upload Status */}
                  {isUploading && (
                    <Badge className="gap-2 shadow-lg">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Uploading...
                    </Badge>
                  )}

                  {/* Upload Success */}
                  {uploadedVideoUrl && !isUploading && (
                    <Badge variant="default" className="bg-green-600 text-white gap-2 shadow-lg">
                      <CheckCircle className="h-3 w-3" />
                      Uploaded
                    </Badge>
                  )}

                  {/* Error Display */}
                  {error && (
                    <Badge variant="destructive" className="gap-2 shadow-lg">
                      <AlertCircle className="h-3 w-3" />
                      Upload failed
                    </Badge>
                  )}
                </div>
              </div>
            </Card>

            {/* Quick Controls */}
            {!hasRecording && (
              <div className="mt-6 flex justify-center gap-3">
                <Button
                  onClick={settings.isPlaying ? pause : play}
                  variant="default"
                  className="gap-2"
                >
                  {settings.isPlaying ? (
                    <>
                      <Pause className="h-4 w-4" />
                      Pause Scroll
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      Start Scroll
                    </>
                  )}
                </Button>
                <Button
                  onClick={reset}
                  variant="outline"
                  className="gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset Position
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Script & Controls */}
        <div className="w-[420px] border-l bg-card flex flex-col shadow-lg">
          <div className="p-6 border-b">
            {hasRecording ? (
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Review Your Recording</h3>
                <p className="text-sm text-muted-foreground">
                  Watch your recorded pitch and decide whether to upload it or record again.
                </p>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Script & Settings</h3>
                <p className="text-sm text-muted-foreground">
                  Toggle the teleprompter to display your script overlay while recording.
                </p>
              </div>
            )}
          </div>

          <div className="flex-1 p-6">
            {hasRecording ? (
              // Review stage content
              <div className="space-y-6">
                <div>
                  <Label className="text-base font-medium mb-4 block">Recording Details</Label>
                  <Card className="p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Duration:</span>
                        <Badge variant="outline">{formatDuration(duration)}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Status:</span>
                        <Badge className="bg-amber-100 text-amber-800 border-amber-300">
                          Ready for Review
                        </Badge>
                      </div>
                    </div>
                  </Card>
                </div>

                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Next Steps:</strong>
                    <ul className="mt-2 text-sm space-y-1">
                      <li>• Watch your recording using the video controls</li>
                      <li>• Click "Upload & Continue" if satisfied</li>
                      <li>• Click "Discard & Re-record" to try again</li>
                    </ul>
                  </AlertDescription>
                </Alert>
              </div>
            ) : (
              // Recording stage content  
              <div className="space-y-6">
                <div>
                  <Label className="text-base font-medium mb-4 block">Your Script</Label>
                  <Card className="p-4">
                    <textarea
                      value={script}
                      readOnly
                      className="w-full h-80 resize-none border-none bg-transparent text-sm leading-relaxed focus:outline-none"
                      placeholder="Your script will appear here and overlay on the video when teleprompter is enabled..."
                    />
                  </Card>
                </div>

                <Separator />

                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Settings className="h-4 w-4 text-primary" />
                    <Label className="text-base font-medium">Teleprompter Settings</Label>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <Label className="text-sm font-medium">Font Size</Label>
                        <Badge variant="secondary" className="text-xs">
                          {settings.fontSize === 'small' ? 'Small' : 
                           settings.fontSize === 'medium' ? 'Medium' : 'Large'}
                        </Badge>
                      </div>
                      <Slider
                        value={[getFontSizeValue()]}
                        onValueChange={(value) => {
                          const sizes: TeleprompterSettings['fontSize'][] = ['small', 'medium', 'large'];
                          setFontSize(sizes[value[0]]);
                        }}
                        max={2}
                        min={0}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <Label className="text-sm font-medium">Scroll Speed</Label>
                        <Badge variant="secondary" className="text-xs">
                          {settings.scrollSpeed}/5
                        </Badge>
                      </div>
                      <Slider
                        value={[settings.scrollSpeed]}
                        onValueChange={(value) => setScrollSpeed(value[0] as TeleprompterSettings['scrollSpeed'])}
                        max={5}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};