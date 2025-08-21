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

  const fontSizeClasses = {
    small: 'text-2xl',
    medium: 'text-4xl',
    large: 'text-6xl',
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <TeleprompterControls
        settings={settings}
        onPlay={play}
        onPause={pause}
        onReset={reset}
        onFontSizeChange={setFontSize}
        onScrollSpeedChange={setScrollSpeed}
        onStartRecording={startRecording}
        onStopRecording={stopRecording}
        onExit={onExit}
        isRecording={isRecording}
      />

      <div className="flex-1 relative">
        {isRecording && (
          <div className="absolute top-4 right-4 z-10">
            <video
              ref={videoRef}
              autoPlay
              muted
              className="w-48 h-36 rounded-lg border-2 border-white shadow-lg"
            />
          </div>
        )}

        <div
          ref={containerRef}
          className="h-full overflow-hidden px-8 py-12"
          style={{
            scrollBehavior: 'smooth',
          }}
        >
          <div
            className={`text-white leading-relaxed text-center max-w-4xl mx-auto ${fontSizeClasses[settings.fontSize]}`}
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
  );
};