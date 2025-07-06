import React, { useState, useEffect } from 'react';
import { LoopInfo } from '../utils/AudioEngine';

interface LoopSystemProps {
  loop: LoopInfo | null;
  currentTime: number;
  bpm: number;
  isPlaying: boolean;
  onSetLoop: (start: number, end: number) => void;
  onToggleLoop: () => void;
  onClearLoop: () => void;
  onBeatLoop: (beats: number) => void;
  onLoopRoll: (beats: number) => void;
  className?: string;
}

const LoopSystem: React.FC<LoopSystemProps> = ({
  loop,
  currentTime,
  bpm,
  isPlaying,
  onSetLoop,
  onToggleLoop,
  onClearLoop,
  onBeatLoop,
  onLoopRoll,
  className = ''
}) => {
  const [isSettingLoop, setIsSettingLoop] = useState(false);
  const [loopStart, setLoopStart] = useState<number | null>(null);
  const [rollActive, setRollActive] = useState<number | null>(null);

  const beatOptions = [0.25, 0.5, 1, 2, 4, 8, 16, 32];
  
  useEffect(() => {
    // Reset loop setting state when loop is set externally
    if (loop && isSettingLoop) {
      setIsSettingLoop(false);
      setLoopStart(null);
    }
  }, [loop, isSettingLoop]);

  const calculateBeatLength = (beats: number): number => {
    if (bpm <= 0) return beats; // Fallback if BPM not available
    return (beats * 60) / bpm; // Convert beats to seconds
  };

  const handleManualLoopStart = () => {
    if (!isSettingLoop) {
      setIsSettingLoop(true);
      setLoopStart(currentTime);
    } else {
      // Set loop end
      if (loopStart !== null) {
        onSetLoop(loopStart, currentTime);
        setIsSettingLoop(false);
        setLoopStart(null);
      }
    }
  };

  const handleBeatLoop = (beats: number) => {
    const loopLength = calculateBeatLength(beats);
    const startTime = currentTime;
    const endTime = startTime + loopLength;
    onSetLoop(startTime, endTime);
  };

  const handleLoopRoll = (beats: number) => {
    setRollActive(beats);
    onLoopRoll(beats);
    
    // Auto-release after the specified duration
    const rollDuration = calculateBeatLength(beats);
    setTimeout(() => {
      setRollActive(null);
    }, rollDuration * 1000);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    return `${mins}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  const formatBeats = (beats: number): string => {
    if (beats < 1) {
      return `1/${1/beats}`;
    }
    return beats.toString();
  };

  return (
    <div className={`loop-system bg-gray-800 p-4 rounded-lg ${className}`}>
      <h3 className="text-sm font-semibold text-white mb-4">Loop System</h3>
      
      {/* Loop Status */}
      <div className="mb-4 p-3 bg-gray-700 rounded">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-300">Loop Status</span>
          <div className={`w-3 h-3 rounded-full ${loop?.active ? 'bg-green-500' : 'bg-gray-500'}`} />
        </div>
        
        {loop ? (
          <div className="text-xs text-white space-y-1">
            <div>Start: {formatTime(loop.start)}</div>
            <div>End: {formatTime(loop.end)}</div>
            <div>Length: {formatTime(loop.end - loop.start)} ({loop.length.toFixed(1)} beats)</div>
          </div>
        ) : (
          <div className="text-xs text-gray-400">No loop set</div>
        )}
      </div>

      {/* Manual Loop Controls */}
      <div className="mb-4">
        <h4 className="text-xs font-medium text-gray-300 mb-2">Manual Loop</h4>
        <div className="flex gap-2">
          <button
            onClick={handleManualLoopStart}
            className={`
              flex-1 px-3 py-2 text-xs rounded transition-all
              ${isSettingLoop 
                ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
              }
            `}
          >
            {isSettingLoop ? 'Set End' : 'Set Start'}
          </button>
          
          <button
            onClick={onToggleLoop}
            disabled={!loop}
            className={`
              px-4 py-2 text-xs rounded transition-all
              ${loop?.active 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-green-600 hover:bg-green-700 text-white'
              }
              disabled:bg-gray-600 disabled:cursor-not-allowed
            `}
          >
            {loop?.active ? 'Exit' : 'Loop'}
          </button>
          
          <button
            onClick={onClearLoop}
            disabled={!loop}
            className="px-3 py-2 text-xs bg-gray-600 hover:bg-gray-700 
                     text-white rounded transition-colors
                     disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            Clear
          </button>
        </div>
        
        {isSettingLoop && (
          <div className="mt-2 text-xs text-yellow-400 text-center">
            Loop start set at {formatTime(loopStart || 0)}. Click "Set End" to complete.
          </div>
        )}
      </div>

      {/* Beat Loop Buttons */}
      <div className="mb-4">
        <h4 className="text-xs font-medium text-gray-300 mb-2">Beat Loops</h4>
        <div className="grid grid-cols-4 gap-1">
          {beatOptions.map((beats) => (
            <button
              key={beats}
              onClick={() => handleBeatLoop(beats)}
              disabled={!isPlaying}
              className={`
                px-2 py-2 text-xs rounded transition-all
                ${loop?.active && Math.abs(loop.length - beats) < 0.1
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-600 hover:bg-gray-500 text-white'
                }
                disabled:bg-gray-700 disabled:cursor-not-allowed disabled:text-gray-500
              `}
            >
              {formatBeats(beats)}
            </button>
          ))}
        </div>
      </div>

      {/* Loop Roll */}
      <div className="mb-4">
        <h4 className="text-xs font-medium text-gray-300 mb-2">Loop Roll</h4>
        <div className="grid grid-cols-4 gap-1">
          {beatOptions.slice(0, 6).map((beats) => (
            <button
              key={`roll-${beats}`}
              onMouseDown={() => handleLoopRoll(beats)}
              onTouchStart={() => handleLoopRoll(beats)}
              disabled={!isPlaying}
              className={`
                px-2 py-2 text-xs rounded transition-all
                ${rollActive === beats
                  ? 'bg-yellow-600 text-white animate-pulse'
                  : 'bg-purple-600 hover:bg-purple-500 text-white'
                }
                disabled:bg-gray-700 disabled:cursor-not-allowed disabled:text-gray-500
              `}
            >
              {formatBeats(beats)}
            </button>
          ))}
        </div>
        <div className="text-xs text-gray-400 mt-1 text-center">
          Hold for temporary loop
        </div>
      </div>

      {/* Loop Information */}
      <div className="text-xs text-gray-400 space-y-1">
        <div>BPM: {bpm || 'Unknown'}</div>
        <div>Beat Length: {bpm > 0 ? `${(60/bpm).toFixed(3)}s` : 'Unknown'}</div>
        {loop && isPlaying && (
          <div>
            Loop Progress: {(((currentTime - loop.start) % (loop.end - loop.start)) / (loop.end - loop.start) * 100).toFixed(1)}%
          </div>
        )}
      </div>

      {/* Advanced Loop Options */}
      <div className="mt-4 pt-3 border-t border-gray-600">
        <h4 className="text-xs font-medium text-gray-300 mb-2">Advanced</h4>
        <div className="flex gap-2">
          <button
            onClick={() => {
              if (loop) {
                const halfLength = (loop.end - loop.start) / 2;
                onSetLoop(loop.start, loop.start + halfLength);
              }
            }}
            disabled={!loop}
            className="flex-1 px-2 py-1 text-xs bg-gray-600 hover:bg-gray-500 
                     text-white rounded transition-colors
                     disabled:bg-gray-700 disabled:cursor-not-allowed"
          >
            Half
          </button>
          
          <button
            onClick={() => {
              if (loop) {
                const doubleLength = (loop.end - loop.start) * 2;
                onSetLoop(loop.start, loop.start + doubleLength);
              }
            }}
            disabled={!loop}
            className="flex-1 px-2 py-1 text-xs bg-gray-600 hover:bg-gray-500 
                     text-white rounded transition-colors
                     disabled:bg-gray-700 disabled:cursor-not-allowed"
          >
            Double
          </button>
          
          <button
            onClick={() => {
              if (loop) {
                const loopLength = loop.end - loop.start;
                onSetLoop(currentTime, currentTime + loopLength);
              }
            }}
            disabled={!loop || !isPlaying}
            className="flex-1 px-2 py-1 text-xs bg-gray-600 hover:bg-gray-500 
                     text-white rounded transition-colors
                     disabled:bg-gray-700 disabled:cursor-not-allowed"
          >
            Move
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoopSystem;