import { useState } from 'react';
import { useTeleprompter } from '../../hooks/useTeleprompter';
import { useVideoRecording } from '../../hooks/useVideoRecording';
import { Button } from '../ui/Button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Label } from '../ui/label';

interface TeleprompterProps {
  script: string;
  onExit: (uploadedVideoUrl?: string) => void;
}

type TeleprompterSettings = {
  fontSize: 'small' | 'medium' | 'large';
  scrollSpeed: 1 | 2 | 3 | 4 | 5;
  isPlaying: boolean;
  currentPosition: number;
};

export const Teleprompter = ({ script, onExit }: TeleprompterProps) => {
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
    play(); // Automatically start scrolling when recording begins
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
      // Video uploaded successfully - automatically complete the flow
      console.log('Video uploaded successfully, completing reslink creation...');
      onExit(uploadedUrl); // Pass the uploadedUrl directly
    }
  };

  // Handle discard recording
  const handleDiscardRecording = () => {
    discardRecording();
    reset(); // Reset teleprompter to initial position
  };

  return (
    <div className="fixed inset-0 bg-gray-100 z-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Button
            variant="outline"
            onClick={handleExit}
            disabled={isUploading}
            className="flex items-center gap-2"
          >
            ← Back {isUploading && '(Uploading...)'}
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">RECORD YOUR PITCH</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <Label htmlFor="teleprompter-toggle" className="text-gray-600 font-medium">
            Teleprompter
          </Label>
          <button
            id="teleprompter-toggle"
            onClick={() => setTeleprompterEnabled(!teleprompterEnabled)}
            className={`w-14 h-7 rounded-full transition-colors ${
              teleprompterEnabled ? 'bg-blue-600' : 'bg-gray-300'
            } relative`}
          >
            <div className={`w-6 h-6 bg-white rounded-full absolute top-0.5 transition-transform ${
              teleprompterEnabled ? 'translate-x-7' : 'translate-x-0.5'
            }`}></div>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-100px)]">
        {/* Video Recording Area */}
        <div className="flex-1 flex items-center justify-center bg-gray-50 p-8">
          <div className="relative">
            {/* Main Video Window */}
            <div className="w-[800px] h-[600px] bg-black rounded-2xl overflow-hidden relative shadow-2xl border-4 border-white">
              {hasRecording && recordedVideoUrl ? (
                // Show recorded video for review with overlay message
                <div className="relative w-full h-full">
                  <video
                    src={recordedVideoUrl}
                    controls
                    className="w-full h-full object-cover"
                    controlsList="nodownload"
                  />
                  {/* Review overlay message */}
                  <div className="absolute top-4 right-4 z-40">
                    <Badge className="bg-black/70 text-white px-3 py-2 shadow-lg">
                      📹 Review Your Recording
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
              
              {/* Teleprompter Text Overlay - Behind all other elements - Only show during live recording */}
              {teleprompterEnabled && !hasRecording && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                  <div className="w-full h-full relative">
                    {/* Blue center line */}
                    <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-blue-500 opacity-30 z-20"></div>
                    
                    {/* Gradient Mask Overlay */}
                    <div 
                      className="absolute inset-0 z-10 pointer-events-none"
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
                    
                    {/* Text Content - First sentence starts at center line */}
                    <div className="w-full h-full flex items-center justify-center px-16">
                      <div
                        className="overflow-hidden relative w-full"
                        style={{ height: '100%' }}
                      >
                        <div
                          className={`text-white leading-relaxed font-bold text-center ${
                            settings.fontSize === 'small' ? 'text-2xl' : 
                            settings.fontSize === 'medium' ? 'text-3xl' : 'text-4xl'
                          }`}
                          style={{ 
                            transform: `translateY(-${settings.currentPosition}px)`,
                            transition: 'transform 0.1s linear',
                            textShadow: '4px 4px 12px rgba(0,0,0,0.95), 0px 0px 20px rgba(0,0,0,0.8), 0px 0px 40px rgba(0,0,0,0.6)',
                            paddingBottom: '100vh'
                          }}
                        >
                          {/* Add spacer to push first sentence to center */}
                          <div style={{ height: '70vh', marginBottom: '0' }}></div>
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

              {/* Recording Controls Overlay - Above teleprompter */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30">
                {hasRecording && !isUploading ? (
                  // Review stage - show upload/discard options
                  <div className="flex gap-4">
                    <Button
                      onClick={handleDiscardRecording}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 shadow-lg"
                      variant="default"
                    >
                      🗑️ Discard & Re-record
                    </Button>
                    <Button
                      onClick={handleUploadVideo}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 shadow-lg"
                      variant="default"
                    >
                      ✅ Upload & Continue
                    </Button>
                  </div>
                ) : (
                  // Recording stage - show record button
                  <Button
                    onClick={isRecording ? handleStopRecording : handleStartRecording}
                    disabled={isUploading}
                    className={`w-20 h-20 rounded-full border-4 border-white flex items-center justify-center ${
                      isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'
                    } transition-all duration-200 shadow-lg ${isUploading ? 'opacity-50' : ''}`}
                    variant="default"
                  >
                    {isRecording ? (
                      <div className="w-8 h-8 bg-white rounded-sm"></div>
                    ) : (
                      <div className="w-8 h-8 bg-white rounded-full"></div>
                    )}
                  </Button>
                )}
              </div>

              {/* Status Badges - Above teleprompter */}
              <div className="absolute top-6 left-6 flex flex-col gap-2 z-30">
                {/* Recording Timer */}
                {isRecording && (
                  <Badge className="bg-red-600 text-white px-4 py-2 flex items-center gap-2 shadow-lg">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    Recording: {Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')}
                  </Badge>
                )}

                {/* Review Stage */}
                {hasRecording && !isUploading && !uploadedVideoUrl && (
                  <Badge className="bg-yellow-600 text-white px-4 py-2 flex items-center gap-2 shadow-lg">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    Ready to Review
                  </Badge>
                )}

                {/* Upload Status */}
                {isUploading && (
                  <Badge className="bg-blue-600 text-white px-4 py-2 flex items-center gap-2 shadow-lg">
                    <div className="w-2 h-2 bg-white rounded-full animate-spin"></div>
                    Uploading...
                  </Badge>
                )}

                {/* Upload Success */}
                {uploadedVideoUrl && !isUploading && (
                  <Badge className="bg-green-600 text-white px-4 py-2 flex items-center gap-2 shadow-lg">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    Uploaded ✓
                  </Badge>
                )}

                {/* Error Display */}
                {error && (
                  <Badge className="bg-red-600 text-white px-4 py-2 shadow-lg">
                    Upload failed: {error}
                  </Badge>
                )}
              </div>
            </div>

            {/* Quick Controls */}
            <div className="mt-6 flex justify-center gap-4">
              <Button
                onClick={settings.isPlaying ? pause : play}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
              >
                {settings.isPlaying ? '⏸️ Pause Scroll' : '▶️ Start Scroll'}
              </Button>
              <Button
                onClick={reset}
                variant="outline"
                className="px-6 py-3 shadow-lg"
              >
                🔄 Reset Position
              </Button>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Script & Controls */}
        <div className="w-[480px] bg-white border-l border-gray-200 flex flex-col shadow-lg">
          <div className="p-8 border-b border-gray-200">
            {hasRecording ? (
              // Review stage header
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Review Your Recording</h3>
                <p className="text-sm text-gray-600">
                  Watch your recorded pitch and decide whether to upload it or record again.
                </p>
              </div>
            ) : (
              // Recording stage header
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Script & Settings</h3>
                <p className="text-sm text-gray-600">
                  Toggle the teleprompter to display your script overlay while recording your pitch video.
                </p>
              </div>
            )}
          </div>

          <div className="flex-1 p-8">
            {hasRecording ? (
              // Review stage content
              <div className="h-full flex flex-col">
                <Label className="text-base font-medium text-gray-900 mb-4 block">
                  Recording Details
                </Label>
                <div className="bg-gray-50 rounded-xl p-6 flex-1 border border-gray-200">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">{Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <Badge className="bg-yellow-100 text-yellow-800">Ready for Review</Badge>
                    </div>
                    <Separator />
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Next Steps:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Watch your recording using the video controls</li>
                        <li>• Click "Upload & Continue" if satisfied</li>
                        <li>• Click "Discard & Re-record" to try again</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Recording stage content  
              <div>
                <Label className="text-base font-medium text-gray-900 mb-4 block">
                  Your Script
                </Label>
                <div className="bg-gray-50 rounded-xl p-6 h-full border border-gray-200">
                  <textarea
                    value={script}
                    readOnly
                    className="w-full h-full resize-none border-none bg-transparent text-gray-700 text-base leading-relaxed focus:outline-none"
                    placeholder="Your script will appear here and overlay on the video when teleprompter is enabled..."
                  />
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Enhanced Controls - Only show during recording stage */}
          {!hasRecording && (
            <div className="p-8 space-y-6">
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-700">
                  Font Size: {settings.fontSize === 'small' ? 'Small (14px)' : settings.fontSize === 'medium' ? 'Medium (16px)' : 'Large (18px)'}
                </Label>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="1"
                  value={settings.fontSize === 'small' ? 0 : settings.fontSize === 'medium' ? 1 : 2}
                  onChange={(e) => {
                    const sizes: TeleprompterSettings['fontSize'][] = ['small', 'medium', 'large'];
                    setFontSize(sizes[Number(e.target.value)]);
                  }}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-700">
                  Scroll Speed: {settings.scrollSpeed} (1=Slow, 5=Fast)
                </Label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={settings.scrollSpeed}
                  onChange={(e) => setScrollSpeed(Number(e.target.value) as TeleprompterSettings['scrollSpeed'])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};