import { useTeleprompter } from '../../hooks/useTeleprompter';
import { useVideoRecording } from '../../hooks/useVideoRecording';
import { TeleprompterControls } from './TeleprompterControls';

interface TeleprompterProps {
  script: string;
  onExit: () => void;
}

export const Teleprompter = ({ script, onExit }: TeleprompterProps) => {
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

  const fontSizeClasses = {
    small: 'text-2xl',
    medium: 'text-4xl',
    large: 'text-6xl',
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 z-50 flex">
      {/* Left Panel - Controls */}
      <div className="w-80 bg-slate-800/90 backdrop-blur-xl border-r border-slate-700/50 p-6 flex flex-col">
        <h2 className="text-white text-xl font-semibold mb-6">Teleprompter</h2>
        
        <TeleprompterControls
          settings={settings}
          onPlay={play}
          onPause={pause}
          onReset={reset}
          onFontSizeChange={setFontSize}
          onScrollSpeedChange={setScrollSpeed}
          onStartRecording={handleStartRecording}
          onStopRecording={handleStopRecording}
          onExit={onExit}
          isRecording={isRecording}
        />
      </div>

      {/* Right Panel - Video + Script */}
      <div className="flex-1 relative">
        {/* Video Preview Window */}
        <div className="absolute top-6 right-6 z-20">
          <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-4 shadow-2xl">
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                muted
                className="w-80 h-60 rounded-lg bg-gray-800"
                style={{ transform: 'scaleX(-1)' }}
              />
              
              {/* Recording Timer Overlay */}
              {isRecording && (
                <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-sm font-medium flex items-center gap-1">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  06:07 / 05:00
                </div>
              )}
              
              {/* Script Text Overlay on Video */}
              <div className="absolute inset-0 bg-black/60 rounded-lg flex items-start justify-center pt-4 px-4">
                <div
                  className="max-h-full overflow-hidden relative"
                  style={{ height: '200px' }}
                >
                  <div
                    className={`text-white text-center leading-relaxed font-medium ${
                      settings.fontSize === 'small' ? 'text-xs' : 
                      settings.fontSize === 'medium' ? 'text-sm' : 'text-base'
                    }`}
                    style={{ 
                      paddingBottom: '400px',
                      transform: `translateY(-${settings.currentPosition}px)`,
                      transition: 'transform 0.1s linear'
                    }}
                  >
                    {script.split('\n').map((paragraph, index) => (
                      <p key={index} className="mb-4 px-2">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                  {/* Reading line indicator */}
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-blue-400/60 transform -translate-y-1/2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Large Script Display */}
        <div className="h-full flex items-center justify-center p-12">
          <div
            className="max-w-4xl w-full overflow-hidden"
            style={{ height: '60vh' }}
          >
            <div
              ref={containerRef}
              className="h-full overflow-hidden"
              style={{ scrollBehavior: 'smooth' }}
            >
              <div
                className={`text-white leading-relaxed text-center ${fontSizeClasses[settings.fontSize]}`}
                style={{
                  lineHeight: '1.6',
                  paddingBottom: '100vh',
                }}
              >
                {script.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-8">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};