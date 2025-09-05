import React, { useState, useEffect } from 'react';
import { useTeleprompter } from '../../hooks/useTeleprompter';
import { useVideoRecording } from '../../hooks/useVideoRecording';
import { Button } from '../ui/Button';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import { Slider } from '../ui/slider';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { 
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

interface RecordVideoStepProps {
  script: string;
  onPrevious: () => void;
  onComplete: (videoUrl?: string) => void;
}

export const RecordVideoStep: React.FC<RecordVideoStepProps> = ({ 
  script, 
  onPrevious, 
  onComplete 
}) => {
  const [teleprompterEnabled, setTeleprompterEnabled] = useState(true);
  
  const {
    settings,
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
    initializeCamera,
    cleanup,
  } = useVideoRecording();

  // Start camera when component mounts
  useEffect(() => {
    initializeCamera();
  }, []);

  const handleStartRecording = async () => {
    await startRecording();
    if (teleprompterEnabled) {
      play();
    }
  };

  const handleStopRecording = () => {
    stopRecording();
    pause();
  };

  const handleUploadVideo = async () => {
    const uploadedUrl = await uploadRecordedVideo();
    if (uploadedUrl) {
      onComplete(uploadedUrl);
    }
  };

  const handleDiscardRecording = async () => {
    discardRecording();
    reset();
    // Restart camera after discarding
    await initializeCamera();
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
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Record Your Video</h2>
        <p className="text-muted-foreground">
          Use the teleprompter to guide your pitch and record your video
        </p>
      </div>

      <div className="flex gap-6">
        {/* Recording Card - Exact copy from original teleprompter */}
        <div className="flex-1 flex items-center justify-center bg-muted/30 p-4">
          <div className="relative">
            {/* Main Video Window */}
            <Card className="w-[560px] h-[400px] p-0 overflow-hidden shadow-2xl">
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

        {/* Teleprompter Settings Card */}
        <Card className="w-80 p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-primary" />
                <Label className="text-sm font-medium">Teleprompter</Label>
              </div>
              <Button
                onClick={() => setTeleprompterEnabled(!teleprompterEnabled)}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                {teleprompterEnabled ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {teleprompterEnabled ? 'Disable' : 'Enable'}
              </Button>
            </div>

            <div>
              <Label className="text-sm font-medium mb-3 block">Your Script</Label>
              <textarea
                value={script}
                readOnly
                className="w-full h-48 p-3 text-sm border rounded-md bg-muted/50 resize-none leading-relaxed"
                placeholder="Your script will appear here..."
              />
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label className="text-sm font-medium">Font Size</Label>
                  <Badge variant="secondary" className="text-xs">
                    {settings.fontSize === 'small' ? 'Small' : 
                     settings.fontSize === 'medium' ? 'Medium' : 'Large'}
                  </Badge>
                </div>
                <Slider
                  value={[getFontSizeValue()]}
                  onValueChange={(value) => {
                    const sizes = ['small', 'medium', 'large'];
                    setFontSize(sizes[value[0]] as any);
                  }}
                  max={2}
                  min={0}
                  step={1}
                  className="w-full"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label className="text-sm font-medium">Scroll Speed</Label>
                  <Badge variant="secondary" className="text-xs">
                    {settings.scrollSpeed}/3
                  </Badge>
                </div>
                <Slider
                  value={[settings.scrollSpeed]}
                  onValueChange={(value) => setScrollSpeed(value[0] as any)}
                  max={3}
                  min={0}
                  step={0.1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Controls</Label>
                <div className="flex flex-col gap-2">
                  <Button
                    onClick={settings.isPlaying ? pause : play}
                    variant="outline"
                    size="sm"
                    className="gap-2 justify-start"
                  >
                    {settings.isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    {settings.isPlaying ? 'Pause' : 'Start'}
                  </Button>
                  <Button
                    onClick={reset}
                    variant="outline"
                    size="sm"
                    className="gap-2 justify-start"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Reset
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-6">
        <Button variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        {hasRecording && uploadedVideoUrl && (
          <Button onClick={() => onComplete(uploadedVideoUrl)}>
            Complete
          </Button>
        )}
      </div>
    </div>
  );
};