import { useState, useEffect, useRef } from 'react';
import type { TeleprompterSettings } from '../types';

export const useTeleprompter = (_script: string) => {
  const [settings, setSettings] = useState<TeleprompterSettings>({
    fontSize: 'medium',
    scrollSpeed: 3,
    isPlaying: false,
    currentPosition: 0,
  });

  const intervalRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const scrollSpeeds = {
    1: 2,   // Very slow - 2px per 50ms
    2: 3,   // Slow - 3px per 50ms  
    3: 4,   // Medium - 4px per 50ms
    4: 6,   // Fast - 6px per 50ms
    5: 8,   // Very fast - 8px per 50ms
  };

  useEffect(() => {
    if (settings.isPlaying) {
      intervalRef.current = setInterval(() => {
        setSettings(prev => ({
          ...prev,
          currentPosition: prev.currentPosition + scrollSpeeds[settings.scrollSpeed],
        }));
      }, 50); // Scroll every 50ms for smooth movement
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [settings.isPlaying, settings.scrollSpeed]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = settings.currentPosition;
    }
  }, [settings.currentPosition]);

  const play = () => {
    setSettings(prev => ({ ...prev, isPlaying: true }));
  };

  const pause = () => {
    setSettings(prev => ({ ...prev, isPlaying: false }));
  };

  const reset = () => {
    setSettings(prev => ({
      ...prev,
      isPlaying: false,
      currentPosition: 0,
    }));
  };

  const setFontSize = (fontSize: TeleprompterSettings['fontSize']) => {
    setSettings(prev => ({ ...prev, fontSize }));
  };

  const setScrollSpeed = (scrollSpeed: TeleprompterSettings['scrollSpeed']) => {
    setSettings(prev => ({ ...prev, scrollSpeed }));
  };

  return {
    settings,
    containerRef,
    play,
    pause,
    reset,
    setFontSize,
    setScrollSpeed,
  };
};