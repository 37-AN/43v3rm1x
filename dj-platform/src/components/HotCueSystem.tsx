import React, { useState } from 'react';
import { HotCue } from '../utils/AudioEngine';

interface HotCueSystemProps {
  hotCues: HotCue[];
  onSetCue: (cueNumber: number, position: number) => void;
  onJumpToCue: (cueNumber: number) => void;
  onDeleteCue: (cueNumber: number) => void;
  currentTime: number;
  className?: string;
}

const HotCueSystem: React.FC<HotCueSystemProps> = ({
  hotCues,
  onSetCue,
  onJumpToCue,
  onDeleteCue,
  currentTime,
  className = ''
}) => {
  const [pressedCue, setPressedCue] = useState<number | null>(null);
  
  const cueColors = [
    '#FF6B6B', // Red
    '#4ECDC4', // Teal
    '#45B7D1', // Blue
    '#96CEB4', // Mint
    '#FFEAA7', // Yellow
    '#DDA0DD', // Plum
    '#98D8C8', // Aqua
    '#F7DC6F'  // Gold
  ];

  const handleCuePress = (cueNumber: number) => {
    setPressedCue(cueNumber);
    
    const cue = hotCues.find(c => c.id === cueNumber);
    if (cue) {
      onJumpToCue(cueNumber);
    } else {
      onSetCue(cueNumber, currentTime);
    }
  };

  const handleCueRelease = () => {
    setPressedCue(null);
  };

  const handleDeleteCue = (cueNumber: number, event: React.MouseEvent) => {
    event.stopPropagation();
    onDeleteCue(cueNumber);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`hot-cue-system ${className}`}>
      <h3 className="text-sm font-semibold text-white mb-3">Hot Cues</h3>
      
      <div className="grid grid-cols-2 gap-2">
        {Array.from({ length: 8 }, (_, index) => {
          const cueNumber = index;
          const cue = hotCues.find(c => c.id === cueNumber);
          const isPressed = pressedCue === cueNumber;
          const isEmpty = !cue;
          
          return (
            <div
              key={cueNumber}
              className={`
                relative h-16 rounded-lg border-2 cursor-pointer
                transition-all duration-150 select-none
                ${isEmpty 
                  ? 'border-gray-600 bg-gray-700 hover:bg-gray-600' 
                  : `border-opacity-60 hover:border-opacity-100`
                }
                ${isPressed ? 'scale-95 shadow-inner' : 'hover:scale-105'}
              `}
              style={{
                backgroundColor: isEmpty ? undefined : cueColors[index],
                borderColor: isEmpty ? undefined : cueColors[index],
                boxShadow: isPressed 
                  ? `inset 0 2px 8px rgba(0,0,0,0.4)` 
                  : `0 0 20px ${isEmpty ? 'transparent' : cueColors[index]}40`
              }}
              onMouseDown={() => handleCuePress(cueNumber)}
              onMouseUp={handleCueRelease}
              onMouseLeave={handleCueRelease}
              onTouchStart={() => handleCuePress(cueNumber)}
              onTouchEnd={handleCueRelease}
            >
              {/* Cue number */}
              <div className="absolute top-1 left-2 text-xs font-bold text-white opacity-80">
                {cueNumber + 1}
              </div>
              
              {/* Delete button */}
              {!isEmpty && (
                <button
                  onClick={(e) => handleDeleteCue(cueNumber, e)}
                  className="absolute top-1 right-1 w-4 h-4 rounded-full bg-black bg-opacity-30 
                           hover:bg-opacity-50 flex items-center justify-center text-white text-xs"
                >
                  ×
                </button>
              )}
              
              {/* Cue content */}
              <div className="flex flex-col items-center justify-center h-full px-2">
                {isEmpty ? (
                  <div className="text-center">
                    <div className="text-xs text-gray-400">Set Cue</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Click or press {cueNumber + 1}
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="text-xs font-medium text-white">
                      {cue.label || `Cue ${cueNumber + 1}`}
                    </div>
                    <div className="text-xs text-white opacity-80 mt-1">
                      {formatTime(cue.position)}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Active indicator */}
              {!isEmpty && (
                <div 
                  className={`
                    absolute bottom-1 left-1/2 transform -translate-x-1/2 
                    w-2 h-2 rounded-full transition-all duration-200
                    ${isPressed ? 'bg-white scale-125' : 'bg-white bg-opacity-60'}
                  `}
                />
              )}
            </div>
          );
        })}
      </div>
      
      {/* Keyboard shortcuts info */}
      <div className="mt-4 text-xs text-gray-400">
        <div className="flex justify-between">
          <span>Keys 1-8: Jump to cues</span>
          <span>Shift+Click waveform: Set cue</span>
        </div>
      </div>
      
      {/* Cue actions */}
      <div className="mt-3 flex gap-2">
        <button
          onClick={() => {
            hotCues.forEach((_, index) => onDeleteCue(index));
          }}
          className="flex-1 px-3 py-2 text-xs bg-red-600 hover:bg-red-700 
                   text-white rounded transition-colors"
        >
          Clear All
        </button>
        
        <button
          onClick={() => {
            // Auto-set cues at intro, build, drop, breakdown points
            const positions = [8, 32, 64, 96]; // Example positions in seconds
            positions.forEach((pos, index) => {
              if (index < 4) onSetCue(index, pos);
            });
          }}
          className="flex-1 px-3 py-2 text-xs bg-blue-600 hover:bg-blue-700 
                   text-white rounded transition-colors"
        >
          Auto Set
        </button>
      </div>
    </div>
  );
};

export default HotCueSystem;