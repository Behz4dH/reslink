import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import type { TeleprompterSettings } from '../../types';

interface TeleprompterControlsProps {
  settings: TeleprompterSettings;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onFontSizeChange: (size: TeleprompterSettings['fontSize']) => void;
  onScrollSpeedChange: (speed: TeleprompterSettings['scrollSpeed']) => void;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onExit: () => void;
  isRecording: boolean;
}

const fontSizeOptions = [
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
];

const scrollSpeedOptions = [
  { value: 1, label: 'Very Slow' },
  { value: 2, label: 'Slow' },
  { value: 3, label: 'Medium' },
  { value: 4, label: 'Fast' },
  { value: 5, label: 'Very Fast' },
];

export const TeleprompterControls = ({
  settings,
  onPlay,
  onPause,
  onReset,
  onFontSizeChange,
  onScrollSpeedChange,
  onStartRecording,
  onStopRecording,
  onExit,
  isRecording,
}: TeleprompterControlsProps) => {
  return (
    <div className="bg-black bg-opacity-80 text-white p-4 space-y-4">
      <div className="flex flex-wrap gap-3 items-center justify-center">
        <Button
          onClick={settings.isPlaying ? onPause : onPlay}
          variant="primary"
          size="sm"
        >
          {settings.isPlaying ? 'Pause' : 'Play'}
        </Button>

        <Button
          onClick={onReset}
          variant="secondary"
          size="sm"
        >
          Reset
        </Button>

        <Button
          onClick={isRecording ? onStopRecording : onStartRecording}
          variant={isRecording ? 'danger' : 'primary'}
          size="sm"
        >
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </Button>

        <Button
          onClick={onExit}
          variant="secondary"
          size="sm"
        >
          Exit
        </Button>
      </div>

      <div className="flex flex-wrap gap-4 items-center justify-center">
        <div className="flex items-center gap-2">
          <label className="text-sm">Font Size:</label>
          <Select
            value={settings.fontSize}
            onChange={(e) => onFontSizeChange(e.target.value as TeleprompterSettings['fontSize'])}
            options={fontSizeOptions}
            className="text-black text-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm">Speed:</label>
          <Select
            value={settings.scrollSpeed}
            onChange={(e) => onScrollSpeedChange(Number(e.target.value) as TeleprompterSettings['scrollSpeed'])}
            options={scrollSpeedOptions}
            className="text-black text-sm"
          />
        </div>
      </div>

      {isRecording && (
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-red-600 px-3 py-1 rounded-full">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">RECORDING</span>
          </div>
        </div>
      )}
    </div>
  );
};