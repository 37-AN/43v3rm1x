import React, { useEffect, useRef, useState, useCallback } from 'react';
import { AudioTrack, HotCue, LoopInfo } from '../utils/AudioEngine';

interface WaveformDisplayProps {
  track: AudioTrack | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  hotCues: HotCue[];
  loop: LoopInfo | null;
  onSeek: (time: number) => void;
  onSetHotCue: (cueNumber: number, time: number) => void;
  onJumpToCue: (cueNumber: number) => void;
  onSetLoop: (start: number, end: number) => void;
  className?: string;
}

const WaveformDisplay: React.FC<WaveformDisplayProps> = ({
  track,
  isPlaying,
  currentTime,
  duration,
  hotCues,
  loop,
  onSeek,
  onSetHotCue,
  onJumpToCue,
  onSetLoop,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const offset = 0; // Fixed offset for now
  const [isDragging, setIsDragging] = useState(false);
  const [isSettingLoop, setIsSettingLoop] = useState(false);
  const [loopStart, setLoopStart] = useState<number | null>(null);

  const drawWaveform = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !track?.waveformData) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas;
    const waveformData = track.waveformData;
    
    // Clear canvas
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, width, height);

    // Calculate visible range based on zoom and offset
    const samplesPerPixel = waveformData.length / (width * zoom);
    const startSample = Math.floor(offset * samplesPerPixel);
    const endSample = Math.min(startSample + width * samplesPerPixel, waveformData.length);

    // Draw background grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i < width; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }

    // Draw waveform
    const centerY = height / 2;
    const maxAmplitude = Math.max(...waveformData.slice(startSample, endSample));
    
    ctx.strokeStyle = '#4ECDC4';
    ctx.lineWidth = 2;
    ctx.beginPath();

    for (let x = 0; x < width; x++) {
      const sampleIndex = Math.floor(startSample + x * samplesPerPixel);
      if (sampleIndex >= waveformData.length) break;
      
      const amplitude = waveformData[sampleIndex] || 0;
      const normalizedAmplitude = amplitude / maxAmplitude;
      const y = centerY - (normalizedAmplitude * centerY * 0.8);
      
      if (x === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();

    // Draw mirror for bottom half
    ctx.strokeStyle = '#4ECDC4';
    ctx.beginPath();
    for (let x = 0; x < width; x++) {
      const sampleIndex = Math.floor(startSample + x * samplesPerPixel);
      if (sampleIndex >= waveformData.length) break;
      
      const amplitude = waveformData[sampleIndex] || 0;
      const normalizedAmplitude = amplitude / maxAmplitude;
      const y = centerY + (normalizedAmplitude * centerY * 0.8);
      
      if (x === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();

    // Draw playhead
    if (duration > 0) {
      const playheadX = (currentTime / duration) * width;
      ctx.strokeStyle = '#FF6B6B';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(playheadX, 0);
      ctx.lineTo(playheadX, height);
      ctx.stroke();

      // Draw progress overlay
      ctx.fillStyle = 'rgba(255, 107, 107, 0.1)';
      ctx.fillRect(0, 0, playheadX, height);
    }

    // Draw hot cues
    hotCues.forEach((cue, index) => {
      if (cue.position <= duration) {
        const cueX = (cue.position / duration) * width;
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'];
        
        ctx.fillStyle = colors[index] || '#FFFFFF';
        ctx.fillRect(cueX - 2, 0, 4, height);
        
        // Draw cue number
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '12px Arial';
        ctx.fillText((index + 1).toString(), cueX + 5, 15);
      }
    });

    // Draw loop region
    if (loop && loop.active && duration > 0) {
      const loopStartX = (loop.start / duration) * width;
      const loopEndX = (loop.end / duration) * width;
      
      ctx.fillStyle = 'rgba(255, 255, 0, 0.2)';
      ctx.fillRect(loopStartX, 0, loopEndX - loopStartX, height);
      
      ctx.strokeStyle = '#FFFF00';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(loopStartX, 0);
      ctx.lineTo(loopStartX, height);
      ctx.moveTo(loopEndX, 0);
      ctx.lineTo(loopEndX, height);
      ctx.stroke();
    }

    // Draw beat markers (assuming 4/4 time)
    if (track.bpm && duration > 0) {
      const beatInterval = 60 / track.bpm; // seconds per beat
      const numBeats = Math.floor(duration / beatInterval);
      
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1;
      
      for (let beat = 0; beat < numBeats; beat++) {
        const beatTime = beat * beatInterval;
        const beatX = (beatTime / duration) * width;
        
        ctx.beginPath();
        ctx.moveTo(beatX, height - 20);
        ctx.lineTo(beatX, height);
        ctx.stroke();
        
        // Emphasize downbeats
        if (beat % 4 === 0) {
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(beatX, height - 30);
          ctx.lineTo(beatX, height);
          ctx.stroke();
          ctx.lineWidth = 1;
        }
      }
    }

  }, [track, currentTime, duration, hotCues, loop, zoom, offset]);

  useEffect(() => {
    drawWaveform();
  }, [drawWaveform]);

  useEffect(() => {
    if (isPlaying) {
      const animate = () => {
        drawWaveform();
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, drawWaveform]);

  const handleMouseDown = (event: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas || !duration) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const clickTime = (x / canvas.width) * duration;

    if (event.shiftKey) {
      // Setting hot cue
      const cueNumber = hotCues.length;
      if (cueNumber < 8) {
        onSetHotCue(cueNumber, clickTime);
      }
    } else if (event.ctrlKey || event.metaKey) {
      // Setting loop
      if (!isSettingLoop) {
        setIsSettingLoop(true);
        setLoopStart(clickTime);
      } else {
        if (loopStart !== null) {
          onSetLoop(loopStart, clickTime);
          setIsSettingLoop(false);
          setLoopStart(null);
        }
      }
    } else {
      // Normal seek
      onSeek(clickTime);
      setIsDragging(true);
    }
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!isDragging || !duration) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const seekTime = (x / canvas.width) * duration;
    
    onSeek(seekTime);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (event: React.WheelEvent) => {
    event.preventDefault();
    const zoomFactor = event.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.5, Math.min(5, zoom * zoomFactor));
    setZoom(newZoom);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    // Hot cue triggers (1-8 keys)
    const key = parseInt(event.key);
    if (key >= 1 && key <= 8) {
      const cueIndex = key - 1;
      if (hotCues[cueIndex]) {
        onJumpToCue(cueIndex);
      }
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`waveform-container relative border border-gray-600 rounded-lg overflow-hidden ${className}`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <canvas
        ref={canvasRef}
        width={800}
        height={120}
        className="w-full h-full cursor-pointer"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
      />
      
      {/* Waveform controls */}
      <div className="absolute top-2 right-2 flex gap-2">
        <button
          onClick={() => setZoom(Math.max(0.5, zoom * 0.8))}
          className="px-2 py-1 bg-gray-700 text-white text-xs rounded hover:bg-gray-600"
        >
          -
        </button>
        <span className="px-2 py-1 bg-gray-800 text-white text-xs rounded">
          {zoom.toFixed(1)}x
        </span>
        <button
          onClick={() => setZoom(Math.min(5, zoom * 1.2))}
          className="px-2 py-1 bg-gray-700 text-white text-xs rounded hover:bg-gray-600"
        >
          +
        </button>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-2 left-2 text-xs text-gray-400">
        Click: Seek | Shift+Click: Set Cue | Ctrl+Click: Set Loop | 1-8: Jump to Cue
      </div>

      {/* Time display */}
      <div className="absolute bottom-2 right-2 text-xs text-white bg-gray-800 px-2 py-1 rounded">
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>

      {/* Loop indicator */}
      {isSettingLoop && (
        <div className="absolute top-2 left-2 text-xs text-yellow-400 bg-gray-800 px-2 py-1 rounded">
          Setting loop start... Click again to set end
        </div>
      )}
    </div>
  );
};

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default WaveformDisplay;