import React, { useEffect, useRef, useState } from 'react';

interface TimeRift {
  id: string;
  x: number;
  y: number;
  size: number;
  depth: number;
  timeFlow: number;
  dimension: 'past' | 'present' | 'future';
  stability: number;
  particleField: TimeParticle[];
}

interface TimeParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
  maxAge: number;
  dimension: 'past' | 'present' | 'future';
  frequency: number;
}

interface TemporalRiftGeneratorProps {
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

const TemporalRiftGenerator: React.FC<TemporalRiftGeneratorProps> = ({
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
  const [rifts, setRifts] = useState<TimeRift[]>([]);
  const [temporalField, setTemporalField] = useState<TimeParticle[]>([]);
  const [chronoSync, setChronoSync] = useState(0);
  const [dimensionalShift, setDimensionalShift] = useState('present');

  const dimensionColors = {
    past: { primary: '#ff6b35', secondary: '#f7931e', glow: '#ffaa44' },
    present: { primary: '#4ecdc4', secondary: '#44a08d', glow: '#66ffcc' },
    future: { primary: '#6c5ce7', secondary: '#a29bfe', glow: '#9966ff' }
  };

  const initializeRifts = () => {
    const newRifts: TimeRift[] = [];
    const riftCount = 6;
    
    for (let i = 0; i < riftCount; i++) {
      const dimension: 'past' | 'present' | 'future' = 
        i < 2 ? 'past' : i < 4 ? 'present' : 'future';
      
      newRifts.push({
        id: `rift_${i}`,
        x: Math.random() * 600 + 100,
        y: Math.random() * 200 + 100,
        size: 30 + Math.random() * 40,
        depth: Math.random() * 100,
        timeFlow: Math.random() * 2 - 1, // -1 to 1 (reverse to forward time)
        dimension,
        stability: 0.5 + Math.random() * 0.5,
        particleField: []
      });
    }
    
    setRifts(newRifts);
  };

  const generateTimeParticles = () => {
    const particles: TimeParticle[] = [];
    const particleCount = 200;
    
    for (let i = 0; i < particleCount; i++) {
      const freqIndex = Math.floor((i / particleCount) * audioDataDeck1.length);
      const amplitude = (audioDataDeck1[freqIndex] || 0) + (audioDataDeck2[freqIndex] || 0);
      
      particles.push({
        x: Math.random() * 800,
        y: Math.random() * 400,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        age: 0,
        maxAge: 100 + Math.random() * 200,
        dimension: i < 67 ? 'past' : i < 134 ? 'present' : 'future',
        frequency: amplitude * 20000
      });
    }
    
    setTemporalField(particles);
  };

  const updateTemporalField = () => {
    if (!isPlaying1 && !isPlaying2) return;

    // Calculate temporal synchronization based on BPM alignment
    const bpmDiff = Math.abs(bpm1 - bpm2);
    const sync = Math.max(0, 1 - bpmDiff / 50);
    setChronoSync(sync);

    // Determine dimensional shift based on crossfader and audio analysis
    const bassEnergy = audioDataDeck1.slice(0, 20).reduce((sum, val) => sum + val, 0) / 20;
    const trebleEnergy = audioDataDeck1.slice(-20).reduce((sum, val) => sum + val, 0) / 20;
    
    if (crossfaderPosition < 30 && bassEnergy > 0.7) {
      setDimensionalShift('past');
    } else if (crossfaderPosition > 70 && trebleEnergy > 0.7) {
      setDimensionalShift('future');
    } else {
      setDimensionalShift('present');
    }

    setRifts(prevRifts => 
      prevRifts.map(rift => {
        // Update rift properties based on audio
        const freqStart = rift.dimension === 'past' ? 0 : rift.dimension === 'present' ? 0.3 : 0.6;
        const freqEnd = rift.dimension === 'past' ? 0.3 : rift.dimension === 'present' ? 0.7 : 1.0;
        
        const relevantFreqs = [
          ...audioDataDeck1.slice(Math.floor(freqStart * audioDataDeck1.length), Math.floor(freqEnd * audioDataDeck1.length)),
          ...audioDataDeck2.slice(Math.floor(freqStart * audioDataDeck2.length), Math.floor(freqEnd * audioDataDeck2.length))
        ];
        
        const avgAmplitude = relevantFreqs.reduce((sum, val) => sum + val, 0) / relevantFreqs.length;
        
        // Rift responds to relevant frequencies
        const newSize = rift.size + (avgAmplitude - 0.5) * 10;
        const newDepth = rift.depth + avgAmplitude * 20;
        const newStability = Math.max(0.1, Math.min(1, rift.stability + (sync - 0.5) * 0.1));
        
        // Update time flow based on BPM and crossfader
        let newTimeFlow = rift.timeFlow;
        if (rift.dimension === 'past') {
          newTimeFlow = -1 + (crossfaderPosition / 100);
        } else if (rift.dimension === 'future') {
          newTimeFlow = 1 - (crossfaderPosition / 100);
        } else {
          newTimeFlow = Math.sin(Date.now() * 0.001) * sync;
        }
        
        // Generate particles around active rifts
        const particleField: TimeParticle[] = [];
        if (avgAmplitude > 0.3) {
          for (let i = 0; i < 10; i++) {
            const angle = (i / 10) * Math.PI * 2;
            const radius = rift.size + Math.random() * 20;
            
            particleField.push({
              x: rift.x + Math.cos(angle) * radius,
              y: rift.y + Math.sin(angle) * radius,
              vx: Math.cos(angle) * newTimeFlow * 2,
              vy: Math.sin(angle) * newTimeFlow * 2,
              age: 0,
              maxAge: 50 + Math.random() * 100,
              dimension: rift.dimension,
              frequency: avgAmplitude * 1000
            });
          }
        }
        
        return {
          ...rift,
          size: Math.max(20, Math.min(100, newSize)),
          depth: Math.max(0, Math.min(200, newDepth)),
          stability: newStability,
          timeFlow: newTimeFlow,
          particleField
        };
      })
    );

    setTemporalField(prevParticles => 
      prevParticles.map(particle => ({
        ...particle,
        x: particle.x + particle.vx,
        y: particle.y + particle.vy,
        age: particle.age + 1,
        vx: particle.vx * 0.99 + (Math.random() - 0.5) * 0.1,
        vy: particle.vy * 0.99 + (Math.random() - 0.5) * 0.1
      })).filter(particle => 
        particle.age < particle.maxAge &&
        particle.x > -50 && particle.x < 850 &&
        particle.y > -50 && particle.y < 450
      )
    );
  };

  const drawTimeRift = (ctx: CanvasRenderingContext2D, rift: TimeRift) => {
    const colors = dimensionColors[rift.dimension];
    const time = Date.now() * 0.001;
    
    // Draw rift portal with swirling effect
    const spiralCount = 8;
    for (let i = 0; i < spiralCount; i++) {
      const spiralRadius = rift.size * (1 - i / spiralCount);
      const spiralAngle = time * rift.timeFlow * 2 + i * 0.5;
      
      const gradient = ctx.createRadialGradient(
        rift.x, rift.y, 0,
        rift.x, rift.y, spiralRadius
      );
      gradient.addColorStop(0, `${colors.primary}${Math.floor(rift.stability * 255).toString(16).padStart(2, '0')}`);
      gradient.addColorStop(0.5, `${colors.secondary}80`);
      gradient.addColorStop(1, 'rgba(0,0,0,0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(rift.x, rift.y, spiralRadius, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw spiral arms
      ctx.strokeStyle = `${colors.glow}${Math.floor(rift.stability * 128).toString(16).padStart(2, '0')}`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let angle = 0; angle < Math.PI * 4; angle += 0.1) {
        const radius = (spiralRadius * angle) / (Math.PI * 4);
        const x = rift.x + Math.cos(angle + spiralAngle) * radius;
        const y = rift.y + Math.sin(angle + spiralAngle) * radius;
        
        if (angle === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
    }
    
    // Draw rift core
    ctx.fillStyle = colors.glow;
    ctx.beginPath();
    ctx.arc(rift.x, rift.y, rift.size * 0.2, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw depth indicator
    ctx.strokeStyle = `rgba(255,255,255,${rift.stability})`;
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.arc(rift.x, rift.y, rift.size + rift.depth * 0.5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw dimensional label
    ctx.fillStyle = colors.glow;
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(rift.dimension.toUpperCase(), rift.x, rift.y - rift.size - 15);
    
    // Draw time flow indicator
    const flowIntensity = Math.abs(rift.timeFlow);
    const flowDirection = rift.timeFlow > 0 ? '⟶' : '⟵';
    ctx.fillStyle = `rgba(255,255,255,${flowIntensity})`;
    ctx.font = `${Math.floor(16 * flowIntensity)}px monospace`;
    ctx.fillText(flowDirection, rift.x, rift.y + rift.size + 25);
  };

  const drawTimeParticle = (ctx: CanvasRenderingContext2D, particle: TimeParticle) => {
    const colors = dimensionColors[particle.dimension];
    const life = 1 - (particle.age / particle.maxAge);
    const alpha = life * 0.8;
    
    ctx.fillStyle = `${colors.primary}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, 2 + life * 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw particle trail
    ctx.strokeStyle = `${colors.secondary}${Math.floor(alpha * 128).toString(16).padStart(2, '0')}`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(particle.x, particle.y);
    ctx.lineTo(particle.x - particle.vx * 5, particle.y - particle.vy * 5);
    ctx.stroke();
  };

  const drawTemporalEffects = (ctx: CanvasRenderingContext2D) => {
    const time = Date.now() * 0.001;
    
    // Draw chronosync waves
    if (chronoSync > 0.7) {
      for (let i = 0; i < 5; i++) {
        const waveRadius = 100 + i * 60 + Math.sin(time * 2) * 20;
        ctx.strokeStyle = `rgba(255,255,255,${chronoSync * 0.3})`;
        ctx.lineWidth = 2;
        ctx.setLineDash([10, 10]);
        ctx.beginPath();
        ctx.arc(400, 200, waveRadius, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.setLineDash([]);
    }
    
    // Draw dimensional shift indicators
    const shiftColors = dimensionColors[dimensionalShift as keyof typeof dimensionColors];
    ctx.fillStyle = `${shiftColors.glow}20`;
    ctx.fillRect(0, 0, 800, 400);
    
    // Draw temporal grid distortion
    ctx.strokeStyle = `${shiftColors.primary}40`;
    ctx.lineWidth = 1;
    for (let x = 0; x < 800; x += 50) {
      const distortion = Math.sin(time + x * 0.01) * 10;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + distortion, 400);
      ctx.stroke();
    }
    
    for (let y = 0; y < 400; y += 50) {
      const distortion = Math.cos(time + y * 0.01) * 10;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(800, y + distortion);
      ctx.stroke();
    }
  };

  const drawVisualization = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear with spacetime background
    const gradient = ctx.createLinearGradient(0, 0, 800, 400);
    gradient.addColorStop(0, 'rgba(0, 0, 15, 1)');
    gradient.addColorStop(0.5, 'rgba(5, 0, 25, 1)');
    gradient.addColorStop(1, 'rgba(0, 5, 20, 1)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawTemporalEffects(ctx);
    
    // Draw time particles
    temporalField.forEach(particle => drawTimeParticle(ctx, particle));
    
    // Draw rift particles
    rifts.forEach(rift => {
      rift.particleField.forEach(particle => drawTimeParticle(ctx, particle));
    });
    
    // Draw rifts
    rifts.forEach(rift => drawTimeRift(ctx, rift));
    
    // Draw interdimensional connections
    rifts.forEach((rift1, i) => {
      rifts.slice(i + 1).forEach(rift2 => {
        if (rift1.dimension !== rift2.dimension) {
          const distance = Math.sqrt((rift1.x - rift2.x) ** 2 + (rift1.y - rift2.y) ** 2);
          if (distance < 200) {
            const alpha = Math.max(0, 1 - distance / 200) * chronoSync * 0.5;
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.lineWidth = 3;
            ctx.setLineDash([10, 20]);
            ctx.beginPath();
            ctx.moveTo(rift1.x, rift1.y);
            ctx.lineTo(rift2.x, rift2.y);
            ctx.stroke();
            ctx.setLineDash([]);
          }
        }
      });
    });
  };

  useEffect(() => {
    initializeRifts();
    generateTimeParticles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const animateLoop = () => {
      updateTemporalField();
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
  }, [isPlaying1, isPlaying2, audioDataDeck1, audioDataDeck2, rifts, temporalField]);

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height: '400px',
    background: 'linear-gradient(135deg, rgba(0,0,15,1) 0%, rgba(5,0,25,1) 50%, rgba(0,5,20,1) 100%)',
    borderRadius: '16px',
    overflow: 'hidden',
    border: `2px solid ${dimensionColors[dimensionalShift as keyof typeof dimensionColors].glow}`
  };

  const infoOverlayStyle: React.CSSProperties = {
    position: 'absolute',
    top: '10px',
    left: '10px',
    background: 'rgba(0,0,0,0.8)',
    padding: '10px',
    borderRadius: '8px',
    fontSize: '12px',
    color: dimensionColors[dimensionalShift as keyof typeof dimensionColors].glow,
    zIndex: 10,
    fontFamily: 'monospace'
  };

  return (
    <div style={containerStyle}>
      <div style={infoOverlayStyle}>
        <div><strong>⏰ TEMPORAL RIFT GENERATOR</strong></div>
        <div>Active Rifts: {rifts.length}</div>
        <div>Dimension: {dimensionalShift.toUpperCase()}</div>
        <div>Chrono-Sync: {(chronoSync * 100).toFixed(1)}%</div>
        <div>Time Particles: {temporalField.length}</div>
        <div>BPM Δ: {Math.abs(bpm1 - bpm2).toFixed(1)}</div>
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

export default TemporalRiftGenerator;