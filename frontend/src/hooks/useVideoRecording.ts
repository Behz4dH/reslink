import { useState, useRef, useCallback, useEffect } from 'react';
import type { VideoRecordingState, MediaConstraints } from '../types';
import { apiService } from '../services/api';

const DEFAULT_CONSTRAINTS: MediaConstraints = {
  video: {
    width: { ideal: 1280 },
    height: { ideal: 720 },
    frameRate: { ideal: 30 },
  },
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
  },
};

export const useVideoRecording = () => {
  const [state, setState] = useState<VideoRecordingState>({
    isRecording: false,
    isPaused: false,
    recordedBlob: null,
    duration: 0,
    error: null,
  });

  const [uploadedVideoUrl, setUploadedVideoUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [recordedVideoBlob, setRecordedVideoBlob] = useState<Blob | null>(null);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startTimeRef = useRef<number>(0);
  const durationIntervalRef = useRef<number | null>(null);

  // Initialize camera without starting recording
  const initializeCamera = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, error: null }));

      // Request media permissions
      const stream = await navigator.mediaDevices.getUserMedia(DEFAULT_CONSTRAINTS);
      streamRef.current = stream;

      // Set up video preview
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      console.log('Camera initialized successfully');
    } catch (error) {
      console.error('Error initializing camera:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to initialize camera',
      }));
    }
  }, []);

  const startRecording = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, error: null }));

      // If camera isn't already initialized, initialize it first
      if (!streamRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia(DEFAULT_CONSTRAINTS);
        streamRef.current = stream;

        // Set up video preview
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }

      // Set up MediaRecorder
      const mediaRecorder = new MediaRecorder(streamRef.current, {
        mimeType: 'video/webm;codecs=vp9,opus',
      });

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      // Download the recorded video
      // const url = URL.createObjectURL(blob);
      // const a = document.createElement('a');
      // a.href = url;
      // a.download = `pitch-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.webm`;
      // document.body.appendChild(a);
      // a.click();
      // document.body.removeChild(a);
      // URL.revokeObjectURL(url);
      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        setState(prev => ({
          ...prev,
          recordedBlob: blob,
          isRecording: false,
          isPaused: false,
        }));

        // Create local URL for preview (no upload yet)
        const localVideoUrl = URL.createObjectURL(blob);
        setRecordedVideoBlob(blob);
        setRecordedVideoUrl(localVideoUrl);

        console.log('Video recorded successfully. Ready for review.');

        // Clean up
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
      };

      // Start recording
      mediaRecorder.start(1000); // Collect data every second
      startTimeRef.current = Date.now();
      
      setState(prev => ({
        ...prev,
        isRecording: true,
        duration: 0,
      }));

      // Start duration counter
      durationIntervalRef.current = setInterval(() => {
        setState(prev => ({
          ...prev,
          duration: Math.floor((Date.now() - startTimeRef.current) / 1000),
        }));
      }, 1000);

    } catch (error) {
      console.error('Error starting recording:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to start recording',
      }));
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && state.isRecording) {
      mediaRecorderRef.current.stop();
      
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
        durationIntervalRef.current = null;
      }
    }
  }, [state.isRecording]);

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && state.isRecording && !state.isPaused) {
      mediaRecorderRef.current.pause();
      setState(prev => ({ ...prev, isPaused: true }));
      
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
        durationIntervalRef.current = null;
      }
    }
  }, [state.isRecording, state.isPaused]);

  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && state.isRecording && state.isPaused) {
      mediaRecorderRef.current.resume();
      setState(prev => ({ ...prev, isPaused: false }));
      
      // Resume duration counter
      const pausedDuration = state.duration;
      startTimeRef.current = Date.now() - (pausedDuration * 1000);
      
      durationIntervalRef.current = setInterval(() => {
        setState(prev => ({
          ...prev,
          duration: Math.floor((Date.now() - startTimeRef.current) / 1000),
        }));
      }, 1000);
    }
  }, [state.isRecording, state.isPaused, state.duration]);

  // Upload the recorded video to Supabase
  const uploadRecordedVideo = useCallback(async (): Promise<string | null> => {
    if (!recordedVideoBlob) {
      console.error('No recorded video to upload');
      return null;
    }

    try {
      setIsUploading(true);
      const filename = `pitch-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.webm`;
      const videoFile = new File([recordedVideoBlob], filename, { type: 'video/webm' });
      
      console.log('Uploading video to Supabase...');
      const uploadResult = await apiService.uploadVideo(videoFile);
      
      console.log('Video uploaded successfully:', uploadResult.url);
      setUploadedVideoUrl(uploadResult.url);
      
      return uploadResult.url;
      
    } catch (error) {
      console.error('Video upload failed:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to upload video',
      }));
      return null;
    } finally {
      setIsUploading(false);
    }
  }, [recordedVideoBlob]);

  // Discard the recorded video
  const discardRecording = useCallback(() => {
    if (recordedVideoUrl) {
      URL.revokeObjectURL(recordedVideoUrl);
    }
    setRecordedVideoBlob(null);
    setRecordedVideoUrl(null);
    setUploadedVideoUrl(null);
    setState(prev => ({ ...prev, recordedBlob: null, error: null }));
  }, [recordedVideoUrl]);

  // Cleanup function to stop camera and microphone
  const cleanup = useCallback(() => {
    // Stop recording if active
    if (mediaRecorderRef.current && state.isRecording) {
      mediaRecorderRef.current.stop();
    }

    // Clear duration interval
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
      durationIntervalRef.current = null;
    }

    // Stop all media tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
        console.log(`Stopped ${track.kind} track`);
      });
      streamRef.current = null;
    }

    // Clean up video element
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    // Clean up recorded video URL
    if (recordedVideoUrl) {
      URL.revokeObjectURL(recordedVideoUrl);
    }

    console.log('Camera and microphone cleanup completed');
  }, [state.isRecording, recordedVideoUrl]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Stop recording if active
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }

      // Clear duration interval
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }

      // Stop all media tracks
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => {
          track.stop();
          console.log(`Hook cleanup: Stopped ${track.kind} track`);
        });
      }

      console.log('useVideoRecording hook cleanup completed');
    };
  }, []); // Empty dependency array to only run on mount/unmount

  return {
    ...state,
    initializeCamera,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    uploadRecordedVideo,
    discardRecording,
    cleanup,
    videoRef,
    uploadedVideoUrl,
    isUploading,
    recordedVideoUrl,
    hasRecording: !!recordedVideoBlob,
  };
};