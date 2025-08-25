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
    <div className="fixed inset-0 bg-gray-100 z-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onExit}
            className="text-gray-600 hover:text-gray-800 flex items-center gap-2"
          >
            ← Back
          </button>
          <h1 className="text-xl font-semibold text-gray-900">RECORD YOUR PITCH</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-gray-600">Teleprompter</span>
          <button
            onClick={() => {/* Toggle teleprompter */}}
            className={`w-12 h-6 rounded-full transition-colors ${
              true ? 'bg-blue-600' : 'bg-gray-300'
            } relative`}
          >
            <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
              true ? 'translate-x-6' : 'translate-x-0.5'
            }`}></div>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Video Recording Area */}
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="relative">
            {/* Main Video Window */}
            <div className="w-[500px] h-[375px] bg-black rounded-xl overflow-hidden relative">
              <video
                ref={videoRef}
                autoPlay
                muted
                className="w-full h-full object-cover"
                style={{ transform: 'scaleX(-1)' }}
              />
              
              {/* Recording Controls Overlay */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <button
                  onClick={isRecording ? handleStopRecording : handleStartRecording}
                  className={`w-16 h-16 rounded-full border-4 border-white flex items-center justify-center ${
                    isRecording ? 'bg-red-600' : 'bg-red-500 hover:bg-red-600'
                  } transition-colors`}
                >
                  {isRecording ? (
                    <div className="w-6 h-6 bg-white rounded-sm"></div>
                  ) : (
                    <div className="w-6 h-6 bg-white rounded-full"></div>
                  )}
                </button>
              </div>

              {/* Recording Timer */}
              {isRecording && (
                <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  1:24
                </div>
              )}

              {/* Teleprompter Text Overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-full max-w-md text-center px-6">
                  <div
                    className="overflow-hidden relative"
                    style={{ height: '150px' }}
                  >
                    <div
                      className={`text-white leading-relaxed font-medium ${
                        settings.fontSize === 'small' ? 'text-sm' : 
                        settings.fontSize === 'medium' ? 'text-base' : 'text-lg'
                      }`}
                      style={{ 
                        paddingBottom: '300px',
                        transform: `translateY(-${settings.currentPosition}px)`,
                        transition: 'transform 0.1s linear',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
                      }}
                    >
                      {script.split('\n').map((paragraph, index) => (
                        <p key={index} className="mb-4">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Controls */}
            <div className="mt-4 flex justify-center gap-3">
              <button
                onClick={settings.isPlaying ? pause : play}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {settings.isPlaying ? '⏸️ Pause' : '▶️ Play'}
              </button>
              <button
                onClick={reset}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                🔄 Reset
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Script & Controls */}
        <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Teleprompter</h3>
              <span className="text-sm text-gray-500">Toggle on the teleprompter to display your script while recording.</span>
            </div>
          </div>

          <div className="flex-1 p-6">
            <div className="bg-gray-50 rounded-lg p-4 h-full">
              <textarea
                value={script}
                readOnly
                className="w-full h-full resize-none border-none bg-transparent text-gray-700 text-sm leading-relaxed"
                placeholder="Use this space to draft your script and stay on point while recording your video."
              />
            </div>
          </div>

          {/* Speed Controls */}
          <div className="p-6 border-t border-gray-200 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Font Size: {settings.fontSize === 'small' ? '14' : settings.fontSize === 'medium' ? '16' : '18'}
              </label>
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
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Speed: {settings.scrollSpeed}
              </label>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={settings.scrollSpeed}
                onChange={(e) => setScrollSpeed(Number(e.target.value) as TeleprompterSettings['scrollSpeed'])}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};