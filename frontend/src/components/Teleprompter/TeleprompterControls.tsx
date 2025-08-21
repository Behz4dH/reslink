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
    <div className="space-y-6 flex-1">
      {/* Playback Controls */}
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={settings.isPlaying ? onPause : onPlay}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            size="sm"
          >
            {settings.isPlaying ? '⏸️ Pause' : '▶️ Play'}
          </Button>

          <Button
            onClick={onReset}
            variant="secondary"
            className="bg-slate-700 hover:bg-slate-600 text-white"
            size="sm"
          >
            🔄 Reset
          </Button>
        </div>

        <Button
          onClick={isRecording ? onStopRecording : onStartRecording}
          className={`w-full ${
            isRecording 
              ? 'bg-red-600 hover:bg-red-700' 
              : 'bg-green-600 hover:bg-green-700'
          } text-white font-semibold`}
          size="lg"
        >
          {isRecording ? '⏹️ Stop Recording' : '🔴 Start Recording'}
        </Button>
      </div>

      {/* Font Size Slider */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-white font-medium">Font size</label>
          <span className="text-slate-300 text-sm">
            {settings.fontSize === 'small' ? '24' : settings.fontSize === 'medium' ? '32' : '40'}
          </span>
        </div>
        <div className="relative">
          <input
            type="range"
            min="0"
            max="2"
            step="1"
            value={settings.fontSize === 'small' ? 0 : settings.fontSize === 'medium' ? 1 : 2}
            onChange={(e) => {
              const sizes: TeleprompterSettings['fontSize'][] = ['small', 'medium', 'large'];
              onFontSizeChange(sizes[Number(e.target.value)]);
            }}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
        <div className="flex justify-between text-xs text-slate-400">
          <span>A</span>
          <span className="text-base">A</span>
        </div>
      </div>

      {/* Speed Slider */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-white font-medium">Teleprompter Speed</label>
          <span className="text-slate-300 text-sm">{settings.scrollSpeed}</span>
        </div>
        <div className="relative">
          <input
            type="range"
            min="1"
            max="5"
            step="1"
            value={settings.scrollSpeed}
            onChange={(e) => onScrollSpeedChange(Number(e.target.value) as TeleprompterSettings['scrollSpeed'])}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
        <div className="flex justify-between text-xs text-slate-400">
          <span>🐌</span>
          <span>🚀</span>
        </div>
      </div>

      {/* Countdown */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-white font-medium">Countdown</label>
          <span className="text-slate-300 text-sm">3</span>
        </div>
        <div className="relative">
          <input
            type="range"
            min="0"
            max="10"
            step="1"
            value="3"
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
        <div className="flex justify-between text-xs text-slate-400">
          <span>⏰</span>
          <span>⏰</span>
        </div>
      </div>

      <div className="pt-6">
        <Button
          onClick={onExit}
          variant="secondary"
          className="w-full bg-slate-700 hover:bg-slate-600 text-white"
        >
          ← Back to Editor
        </Button>
      </div>

      {/* Recording Status */}
      {isRecording && (
        <div className="bg-red-600/20 border border-red-500/30 rounded-lg p-3">
          <div className="flex items-center gap-2 justify-center">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-red-400 font-medium text-sm">RECORDING</span>
          </div>
        </div>
      )}
    </div>
  );
};