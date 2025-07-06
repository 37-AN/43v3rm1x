import React, { useEffect, useRef, useState } from 'react';

interface DNAStrand {
  id: string;
  x: number;
  y: number;
  z: number;
  rotation: number;
  baseSequence: string[];
  frequency: number;
  amplitude: number;
  color: string;
  phase: number;
}

interface HolographicDNASequencerProps {
  audioDataDeck1?: number[];
  audioDataDeck2?: number[];
  isPlaying1: boolean;
  isPlaying2: boolean;
  crossfaderPosition: number;
  bpm1: number;
  bpm2: number;
  trackInfo1?: any;
  trackInfo2?: any;
}

const HolographicDNASequencer: React.FC<HolographicDNASequencerProps> = ({
  audioDataDeck1 = [],
  audioDataDeck2 = [],
  isPlaying1,
  isPlaying2,
  crossfaderPosition,
  bpm1,
  bpm2,
  trackInfo1,
  trackInfo2
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const [dnaStrands, setDnaStrands] = useState<DNAStrand[]>([]);
  const [hologramDepth, setHologramDepth] = useState(0);
  const [musicDNA, setMusicDNA] = useState<string>('');

  const bases = ['A', 'T', 'G', 'C']; // DNA bases
  const baseColors = {
    'A': '#ff4444', // Adenine - Red
    'T': '#44ff44', // Thymine - Green  
    'G': '#4444ff', // Guanine - Blue
    'C': '#ffff44'  // Cytosine - Yellow
  };

  const initializeDNAStrands = () => {
    const strands: DNAStrand[] = [];
    const strandCount = 8;
    
    for (let i = 0; i < strandCount; i++) {
      const angle = (i / strandCount) * Math.PI * 2;
      const radius = 150;
      
      // Generate base sequence from audio frequencies
      const sequence = Array.from({ length: 20 }, (_, j) => {
        const freqIndex = Math.floor((j / 20) * audioDataDeck1.length);
        const amplitude = audioDataDeck1[freqIndex] || 0;
        return bases[Math.floor(amplitude * 4) % 4];
      });

      strands.push({
        id: `strand_${i}`,
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        z: 0,
        rotation: angle,
        baseSequence: sequence,
        frequency: 440 + i * 55, // Musical frequencies
        amplitude: 0,
        color: i < 4 ? '#00ffff' : '#ff00ff', // Cyan/Magenta for decks
        phase: Math.random() * Math.PI * 2
      });
    }
    
    setDnaStrands(strands);
  };

  const generateMusicDNA = () => {
    // const deck1Energy = audioDataDeck1.reduce((sum, val) => sum + val, 0) / audioDataDeck1.length;
    // const deck2Energy = audioDataDeck2.reduce((sum, val) => sum + val, 0) / audioDataDeck2.length;
    
    const dnaCode = `${trackInfo1?.key || 'C'}${Math.floor(bpm1)}${trackInfo2?.key || 'G'}${Math.floor(bpm2)}${Math.floor(crossfaderPosition)}`;
    setMusicDNA(dnaCode);
  };

  const updateDNAStrands = () => {
    if (!isPlaying1 && !isPlaying2) return;

    setDnaStrands(prevStrands => 
      prevStrands.map((strand, index) => {
        const audioData = index < 4 ? audioDataDeck1 : audioDataDeck2;
        const freqIndex = Math.floor((index % 4 / 4) * audioData.length);
        const amplitude = audioData[freqIndex] || 0;
        
        // Update base sequence based on audio
        const newSequence = strand.baseSequence.map((base, i) => {
          const segmentIndex = Math.floor((i / strand.baseSequence.length) * audioData.length);
          const segmentAmplitude = audioData[segmentIndex] || 0;
          return bases[Math.floor(segmentAmplitude * 4) % 4];
        });

        return {
          ...strand,
          amplitude: amplitude,
          baseSequence: newSequence,
          phase: strand.phase + 0.05 + amplitude * 0.1,
          z: Math.sin(strand.phase) * 50 + amplitude * 100
        };
      })
    );

    // Update hologram depth based on mix intensity
    const mixIntensity = Math.abs(crossfaderPosition - 50) / 50;
    setHologramDepth(mixIntensity * 100);
    generateMusicDNA();
  };

  const drawDNAStrand = (ctx: CanvasRenderingContext2D, strand: DNAStrand, centerX: number, centerY: number) => {
    const strandLength = strand.baseSequence.length;
    const segmentHeight = 15;
    
    for (let i = 0; i < strandLength; i++) {
      const base = strand.baseSequence[i];
      // const progress = i / strandLength;
      
      // 3D rotation calculations
      const rotatedX = strand.x * Math.cos(strand.rotation + strand.phase) - strand.z * Math.sin(strand.rotation + strand.phase);
      const rotatedZ = strand.x * Math.sin(strand.rotation + strand.phase) + strand.z * Math.cos(strand.rotation + strand.phase);
      
      // Perspective projection
      const perspective = 300;
      const projectedX = centerX + (rotatedX * perspective) / (perspective + rotatedZ + 200);
      const projectedY = centerY + (strand.y + i * segmentHeight - strandLength * segmentHeight / 2) * perspective / (perspective + rotatedZ + 200);
      
      // Calculate depth for layering
      const depth = (rotatedZ + 200) / 400;
      const alpha = Math.max(0.3, depth) * strand.amplitude;
      
      // Draw base with holographic effect
      const baseColor = baseColors[base as keyof typeof baseColors];
      const gradient = ctx.createRadialGradient(projectedX, projectedY, 0, projectedX, projectedY, 15);
      gradient.addColorStop(0, `${baseColor}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`);
      gradient.addColorStop(0.5, `${strand.color}${Math.floor(alpha * 128).toString(16).padStart(2, '0')}`);
      gradient.addColorStop(1, 'rgba(0,0,0,0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(projectedX, projectedY, 8 * depth, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw connecting bonds
      if (i > 0) {
        const prevRotatedX = strand.x * Math.cos(strand.rotation + strand.phase - 0.1) - strand.z * Math.sin(strand.rotation + strand.phase - 0.1);
        const prevRotatedZ = strand.x * Math.sin(strand.rotation + strand.phase - 0.1) + strand.z * Math.cos(strand.rotation + strand.phase - 0.1);
        const prevProjectedX = centerX + (prevRotatedX * perspective) / (perspective + prevRotatedZ + 200);
        const prevProjectedY = centerY + (strand.y + (i-1) * segmentHeight - strandLength * segmentHeight / 2) * perspective / (perspective + prevRotatedZ + 200);
        
        ctx.strokeStyle = `rgba(255,255,255,${alpha * 0.5})`;
        ctx.lineWidth = 2 * depth;
        ctx.beginPath();
        ctx.moveTo(prevProjectedX, prevProjectedY);
        ctx.lineTo(projectedX, projectedY);
        ctx.stroke();
      }
      
      // Draw base letter
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.font = `${Math.floor(10 * depth)}px monospace`;
      ctx.textAlign = 'center';
      ctx.fillText(base, projectedX, projectedY + 3);
    }
  };

  const drawHolographicEffects = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number) => {
    // Holographic interference patterns
    const time = Date.now() * 0.001;
    
    for (let i = 0; i < 5; i++) {
      const radius = 50 + i * 40 + hologramDepth;
      const alpha = (5 - i) / 5 * 0.3;
      
      ctx.strokeStyle = `hsla(${180 + time * 30 + i * 30}, 80%, 60%, ${alpha})`;
      ctx.lineWidth = 2;
      ctx.setLineDash([10, 5]);
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();
    }
    
    // Data streams
    const streamCount = 12;
    for (let i = 0; i < streamCount; i++) {
      const angle = (i / streamCount) * Math.PI * 2 + time;
      const radius = 250;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      ctx.fillStyle = `hsla(${angle * 57.3 + time * 100}, 70%, 70%, 0.6)`;
      ctx.beginPath();
      ctx.arc(x, y, 3 + Math.sin(time * 3 + i) * 2, 0, Math.PI * 2);
      ctx.fill();
      
      // Connect to center
      ctx.strokeStyle = `hsla(${angle * 57.3 + time * 100}, 70%, 70%, 0.2)`;
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 10]);
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
    
    ctx.setLineDash([]);
  };

  const drawVisualization = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear with deep space background
    const gradient = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 0, canvas.width/2, canvas.height/2, canvas.width);
    gradient.addColorStop(0, 'rgba(0, 0, 20, 1)');
    gradient.addColorStop(0.5, 'rgba(0, 10, 30, 1)');
    gradient.addColorStop(1, 'rgba(0, 0, 10, 1)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Draw holographic effects
    drawHolographicEffects(ctx, centerX, centerY);

    // Draw DNA strands
    dnaStrands.forEach(strand => {
      drawDNAStrand(ctx, strand, centerX, centerY);
    });

    // Draw music DNA code
    if (musicDNA) {
      ctx.fillStyle = 'rgba(0, 255, 255, 0.8)';
      ctx.font = '14px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`Music DNA: ${musicDNA}`, centerX, centerY + 200);
    }

    // Draw crossfader DNA fusion
    if (Math.abs(crossfaderPosition - 50) < 10) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.font = 'bold 16px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('⚡ DNA FUSION DETECTED ⚡', centerX, centerY - 200);
    }
  };

  useEffect(() => {
    initializeDNAStrands();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const animateLoop = () => {
      updateDNAStrands();
      drawVisualization();
      animationRef.current = requestAnimationFrame(animateLoop);
    };

    if (isPlaying1 || isPlaying2) {
      animationRef.current = requestAnimationFrame(animateLoop);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying1, isPlaying2, audioDataDeck1, audioDataDeck2, crossfaderPosition, dnaStrands]);

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height: '400px',
    background: 'radial-gradient(circle, rgba(0,0,20,1) 0%, rgba(0,0,10,1) 100%)',
    borderRadius: '16px',
    overflow: 'hidden',
    border: '2px solid rgba(0,255,255,0.3)',
    boxShadow: '0 0 30px rgba(0,255,255,0.2)'
  };

  const infoOverlayStyle: React.CSSProperties = {
    position: 'absolute',
    top: '10px',
    left: '10px',
    background: 'rgba(0,0,0,0.8)',
    padding: '10px',
    borderRadius: '8px',
    fontSize: '12px',
    color: '#00ffff',
    zIndex: 10,
    fontFamily: 'monospace'
  };

  return (
    <div style={containerStyle}>
      <div style={infoOverlayStyle}>
        <div><strong>🧬 HOLOGRAPHIC DNA SEQUENCER</strong></div>
        <div>Deck 1: {trackInfo1?.name || 'No Track'}</div>
        <div>Deck 2: {trackInfo2?.name || 'No Track'}</div>
        <div>DNA Strands: {dnaStrands.length}</div>
        <div>Hologram Depth: {hologramDepth.toFixed(1)}</div>
        <div>Crossfade: {crossfaderPosition}%</div>
      </div>
      
      <canvas
        ref={canvasRef}
        width={800}
        height={400}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default HolographicDNASequencer;