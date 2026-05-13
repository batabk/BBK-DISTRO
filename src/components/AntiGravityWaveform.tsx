import { motion, useAnimationFrame } from "motion/react";
import React, { useEffect, useRef, useState } from "react";

export interface AntiGravityWaveformProps {
  audioUrl?: string | null;
  file?: File | null;
  barsCount?: number;
  isPlaying?: boolean;
}

export function AntiGravityWaveform({ 
  audioUrl, 
  file, 
  barsCount = 40,
  isPlaying = true 
}: AntiGravityWaveformProps) {
  const [sourceUrl, setSourceUrl] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const barsRef = useRef<(HTMLDivElement | null)[]>([]);
  const heightsRef = useRef<number[]>(Array(barsCount).fill(20));
  const targetsRef = useRef<number[]>(Array(barsCount).fill(20));

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setSourceUrl(url);
      return () => URL.revokeObjectURL(url);
    } else if (audioUrl) {
      setSourceUrl(audioUrl);
    } else {
      setSourceUrl(null);
    }
  }, [file, audioUrl]);

  useEffect(() => {
    if (!sourceUrl || !audioRef.current) return;
    
    if (!audioContextRef.current) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContextClass) return;
        audioContextRef.current = new AudioContextClass();
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;
        analyserRef.current.smoothingTimeConstant = 0.8;
        dataArrayRef.current = new Uint8Array(analyserRef.current.frequencyBinCount);
    }

    // Connect node only once
    if (!sourceNodeRef.current && audioContextRef.current && analyserRef.current) {
        sourceNodeRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
        sourceNodeRef.current.connect(analyserRef.current);
        analyserRef.current.connect(audioContextRef.current.destination);
    }

    if (isPlaying && audioContextRef.current?.state === 'suspended') {
        audioContextRef.current.resume();
    }
  }, [sourceUrl, isPlaying]);

  useEffect(() => {
     if (audioRef.current) {
         if (isPlaying) {
             audioRef.current.play().catch(e => console.log("Audio play prevented:", e));
         } else {
             audioRef.current.pause();
         }
     }
  }, [isPlaying, sourceUrl]);

  useAnimationFrame(() => {
    if (analyserRef.current && dataArrayRef.current && sourceUrl && isPlaying) {
      analyserRef.current.getByteFrequencyData(dataArrayRef.current);
      
      const step = Math.floor(dataArrayRef.current.length / barsCount);
      
      for (let i = 0; i < barsCount; i++) {
        let sum = 0;
        for (let j = 0; j < step; j++) {
            sum += dataArrayRef.current[i * step + j];
        }
        const average = sum / step;
        const normalizedHeight = Math.max(10, (average / 255) * 100);
        
        // Add a slight smoothing manually
        heightsRef.current[i] += (normalizedHeight - heightsRef.current[i]) * 0.5;

        // Ensure we don't drop below 10% visually
        const finalHeight = Math.max(10, heightsRef.current[i]);

        if (barsRef.current[i]) {
          barsRef.current[i]!.style.height = `${finalHeight}%`;
        }
      }
    } else {
      // Simulated visualizer when no audio is passed (fallback)
      for (let i = 0; i < barsCount; i++) {
        if (Math.abs(targetsRef.current[i] - heightsRef.current[i]) < 2) {
           targetsRef.current[i] = Math.floor(Math.random() * 80) + 20;
        }
        
        heightsRef.current[i] += (targetsRef.current[i] - heightsRef.current[i]) * 0.05;
        
        if (barsRef.current[i]) {
            barsRef.current[i]!.style.height = `${heightsRef.current[i]}%`;
        }
      }
    }
  });

  return (
    <div className="flex items-center justify-center space-x-1 sm:space-x-2 h-48 w-full max-w-4xl mx-auto opacity-70">
      {sourceUrl && (
        <audio 
            ref={audioRef} 
            src={sourceUrl} 
            crossOrigin="anonymous" 
            loop 
            className="hidden" 
        />
      )}
      {Array.from({ length: barsCount }).map((_, i) => (
        <motion.div
          key={i}
          ref={(el) => (barsRef.current[i] = el)}
          className="w-1 sm:w-2 bg-neon rounded-none"
          initial={{ height: "20%" }}
        />
      ))}
    </div>
  );
}
