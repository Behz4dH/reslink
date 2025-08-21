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
    1: 50,  // Very slow
    2: 35,  // Slow
    3: 25,  // Medium
    4: 15,  // Fast
    5: 10,  // Very fast
  };

  useEffect(() => {
    if (settings.isPlaying) {
      intervalRef.current = setInterval(() => {
        setSettings(prev => ({
          ...prev,
          currentPosition: prev.currentPosition + 1,
        }));
      }, scrollSpeeds[settings.scrollSpeed]);
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