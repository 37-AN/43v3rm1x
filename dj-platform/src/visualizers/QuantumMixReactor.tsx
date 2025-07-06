import React, { useEffect, useRef, useState } from 'react';

interface EnergyBeam {
  angle: number;
  intensity: number;
  frequency: number;
  color: string;
  particles: BeamParticle[];
}

interface BeamParticle {
  x: number;
  y: number;
  velocity: number;
  life: number;
  size: number;
  hue: number;
}

interface CollisionEvent {
  x: number;
  y: number;
  intensity: number;
  timestamp: number;
  type: 'perfect' | 'good' | 'miss';
  nftPattern?: string;
}

interface QuantumMixReactorProps {
  audioDataDeck1?: number[];
  audioDataDeck2?: number[];
  crossfaderPosition: number;
  isPlaying1: boolean;
  isPlaying2: boolean;
  bpm1: number;
  bpm2: number;
  aiPredictions?: { 
    optimalCrossfaderPosition: number; 
    confidence: number; 
    harmonicMatch: number 
  }[];
  onCollisionEvent?: (event: CollisionEvent) => void;
}

const QuantumMixReactor: React.FC<QuantumMixReactorProps> = ({
  audioDataDeck1 = [],
  audioDataDeck2 = [],
  crossfaderPosition,
  isPlaying1,
  isPlaying2,
  bpm1,
  bpm2,
  aiPredictions = [],
  onCollisionEvent
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [energyBeams, setEnergyBeams] = useState<{ deck1: EnergyBeam[]; deck2: EnergyBeam[] }>({
    deck1: [],
    deck2: []
  });
  const [collisionEvents, setCollisionEvents] = useState<CollisionEvent[]>([]);
  const [reactorEnergy, setReactorEnergy] = useState(0);
  const [quantumField, setQuantumField] = useState<number[]>([]);

  const reactorRadius = 120;
  const beamCount = 8;

  const initializeEnergyBeams = () => {
    const createBeams = (deckId: 'deck1' | 'deck2', audioData: number[]) => {
      const beams: EnergyBeam[] = [];
      const baseAngle = deckId === 'deck1' ? 0 : Math.PI;
      
      for (let i = 0; i < beamCount; i++) {
        const frequencyIndex = Math.floor((i / beamCount) * audioData.length);
        const intensity = audioData[frequencyIndex] || 0;
        
        beams.push({
          angle: baseAngle + (i / beamCount) * Math.PI * 2,
          intensity,
          frequency: frequencyIndex * (20000 / audioData.length),
          color: deckId === 'deck1' ? 'cyan' : 'magenta',
          particles: []
        });
      }
      return beams;
    };

    setEnergyBeams({
      deck1: createBeams('deck1', audioDataDeck1),
      deck2: createBeams('deck2', audioDataDeck2)
    });
  };

  const updateEnergyBeams = () => {
    setEnergyBeams(prev => ({
      deck1: prev.deck1.map((beam, i) => {
        const frequencyIndex = Math.floor((i / beamCount) * audioDataDeck1.length);
        const newIntensity = audioDataDeck1[frequencyIndex] || 0;
        
        // Update particles along the beam
        const updatedParticles = beam.particles
          .map(particle => ({
            ...particle,
            x: particle.x + Math.cos(beam.angle) * particle.velocity,
            y: particle.y + Math.sin(beam.angle) * particle.velocity,
            life: particle.life - 1,
            velocity: particle.velocity * 0.98
          }))
          .filter(particle => particle.life > 0);
        
        // Add new particles if beam is active
        if (isPlaying1 && newIntensity > 0.1) {
          const newParticle: BeamParticle = {
            x: 0,
            y: 0,
            velocity: 2 + newIntensity * 3,
            life: 60 + newIntensity * 40,
            size: 2 + newIntensity * 4,
            hue: 180 + (i / beamCount) * 60
          };
          updatedParticles.push(newParticle);
        }
        
        return {
          ...beam,
          intensity: newIntensity,
          particles: updatedParticles
        };
      }),
      deck2: prev.deck2.map((beam, i) => {
        const frequencyIndex = Math.floor((i / beamCount) * audioDataDeck2.length);
        const newIntensity = audioDataDeck2[frequencyIndex] || 0;
        
        const updatedParticles = beam.particles
          .map(particle => ({
            ...particle,
            x: particle.x + Math.cos(beam.angle) * particle.velocity,
            y: particle.y + Math.sin(beam.angle) * particle.velocity,
            life: particle.life - 1,
            velocity: particle.velocity * 0.98
          }))
          .filter(particle => particle.life > 0);
        
        if (isPlaying2 && newIntensity > 0.1) {
          const newParticle: BeamParticle = {
            x: 0,
            y: 0,
            velocity: 2 + newIntensity * 3,
            life: 60 + newIntensity * 40,
            size: 2 + newIntensity * 4,
            hue: 300 + (i / beamCount) * 60
          };
          updatedParticles.push(newParticle);
        }
        
        return {
          ...beam,
          intensity: newIntensity,
          particles: updatedParticles
        };
      })
    }));
  };

  const detectCollisions = () => {
    const currentTime = Date.now();
    const collisionZone = {
      x: Math.cos((crossfaderPosition / 100) * Math.PI) * reactorRadius,
      y: Math.sin((crossfaderPosition / 100) * Math.PI) * reactorRadius
    };

    // Check for particle collisions at crossfader position
    energyBeams.deck1.forEach((beam1, i) => {
      energyBeams.deck2.forEach((beam2, j) => {
        beam1.particles.forEach(p1 => {
          beam2.particles.forEach(p2 => {
            const distance = Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
            
            if (distance < 20) {
              const combinedIntensity = (beam1.intensity + beam2.intensity) / 2;
              const harmonicMatch = Math.abs(beam1.frequency - beam2.frequency) < 1000 ? 1 : 0.5;
              const bpmSync = Math.abs(bpm1 - bpm2) < 5 ? 1 : 0.7;
              
              const collisionQuality = combinedIntensity * harmonicMatch * bpmSync;
              
              let eventType: 'perfect' | 'good' | 'miss' = 'miss';
              if (collisionQuality > 0.8) eventType = 'perfect';
              else if (collisionQuality > 0.5) eventType = 'good';
              
              const event: CollisionEvent = {
                x: (p1.x + p2.x) / 2,
                y: (p1.y + p2.y) / 2,
                intensity: collisionQuality,
                timestamp: currentTime,
                type: eventType,
                nftPattern: eventType === 'perfect' ? generateNFTPattern(collisionQuality) : undefined
              };
              
              setCollisionEvents(prev => [...prev.slice(-10), event]);
              if (onCollisionEvent) onCollisionEvent(event);
              
              // Update reactor energy
              setReactorEnergy(prev => Math.min(100, prev + collisionQuality * 10));
            }
          });
        });
      });
    });
  };

  const generateNFTPattern = (quality: number): string => {
    const patternData = {
      timestamp: Date.now(),
      quality,
      crossfaderPosition,
      bpm1,
      bpm2,
      randomSeed: Math.random()
    };
    return btoa(JSON.stringify(patternData)).slice(0, 12);
  };

  const updateQuantumField = () => {
    const fieldSize = 100;
    const newField: number[] = [];
    
    for (let i = 0; i < fieldSize; i++) {
      const angle = (i / fieldSize) * Math.PI * 2;
      const baseField = Math.sin(angle * 3 + Date.now() * 0.001) * 0.5 + 0.5;
      const energyInfluence = reactorEnergy / 100;
      const crossfaderInfluence = Math.sin((crossfaderPosition / 100) * Math.PI * 2) * 0.3;
      
      newField.push(baseField + energyInfluence * 0.5 + crossfaderInfluence);
    }
    
    setQuantumField(newField);
  };

  const drawReactor = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear with quantum void background
    ctx.fillStyle = 'rgba(2, 0, 10, 0.9)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Draw quantum field background
    ctx.save();
    ctx.translate(centerX, centerY);
    
    quantumField.forEach((fieldValue, i) => {
      const angle = (i / quantumField.length) * Math.PI * 2;
      const radius = reactorRadius + fieldValue * 30;
      
      ctx.strokeStyle = `hsla(240, 60%, 40%, ${fieldValue * 0.3})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, 0, radius, angle, angle + 0.1);
      ctx.stroke();
    });
    
    // Draw reactor core
    const coreGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, reactorRadius);
    coreGradient.addColorStop(0, `hsla(280, 80%, 60%, ${reactorEnergy / 100})`);
    coreGradient.addColorStop(0.7, `hsla(240, 60%, 40%, ${reactorEnergy / 200})`);
    coreGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    ctx.fillStyle = coreGradient;
    ctx.beginPath();
    ctx.arc(0, 0, reactorRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw reactor ring
    ctx.strokeStyle = `hsla(280, 80%, 70%, ${0.5 + (reactorEnergy / 200)})`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, reactorRadius, 0, Math.PI * 2);
    ctx.stroke();
    
    // Draw crossfader collision point
    const crossfaderAngle = (crossfaderPosition / 100) * Math.PI * 2;
    const collisionX = Math.cos(crossfaderAngle) * reactorRadius;
    const collisionY = Math.sin(crossfaderAngle) * reactorRadius;
    
    ctx.fillStyle = `hsla(45, 100%, 70%, ${0.8 + Math.sin(Date.now() * 0.01) * 0.2})`;
    ctx.beginPath();
    ctx.arc(collisionX, collisionY, 8, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw crossfader trajectory indicator
    ctx.strokeStyle = 'hsla(45, 80%, 60%, 0.5)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.arc(0, 0, reactorRadius, 0, crossfaderAngle);
    ctx.stroke();
    ctx.setLineDash([]);
    
    ctx.restore();

    // Draw energy beams
    ['deck1', 'deck2'].forEach(deckId => {
      const beams = energyBeams[deckId as keyof typeof energyBeams];
      const deckColor = deckId === 'deck1' ? 'cyan' : 'magenta';
      const baseHue = deckId === 'deck1' ? 180 : 300;
      
      beams.forEach(beam => {
        if (beam.intensity > 0.1) {
          // Draw beam line
          const startAngle = beam.angle - 0.05;
          const endAngle = beam.angle + 0.05;
          const beamLength = reactorRadius + beam.intensity * 50;
          
          ctx.strokeStyle = `hsla(${baseHue}, 80%, 60%, ${beam.intensity})`;
          ctx.lineWidth = beam.intensity * 8;
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.lineTo(
            centerX + Math.cos(beam.angle) * beamLength,
            centerY + Math.sin(beam.angle) * beamLength
          );
          ctx.stroke();
          
          // Draw beam particles
          beam.particles.forEach(particle => {
            const particleX = centerX + particle.x;
            const particleY = centerY + particle.y;
            const alpha = particle.life / 100;
            
            const particleGradient = ctx.createRadialGradient(
              particleX, particleY, 0,
              particleX, particleY, particle.size
            );
            particleGradient.addColorStop(0, `hsla(${particle.hue}, 90%, 80%, ${alpha})`);
            particleGradient.addColorStop(1, `hsla(${particle.hue}, 70%, 60%, 0)`);
            
            ctx.fillStyle = particleGradient;
            ctx.beginPath();
            ctx.arc(particleX, particleY, particle.size, 0, Math.PI * 2);
            ctx.fill();
          });
        }
      });
    });

    // Draw collision events
    const currentTime = Date.now();
    collisionEvents.forEach(event => {
      const age = currentTime - event.timestamp;
      if (age < 2000) { // Show for 2 seconds
        const alpha = 1 - (age / 2000);
        const size = 10 + event.intensity * 20 + (age / 100);
        
        let eventColor = '60, 100%, 50%'; // Yellow for miss
        if (event.type === 'good') eventColor = '120, 80%, 60%'; // Green
        if (event.type === 'perfect') eventColor = '280, 90%, 70%'; // Purple
        
        // Explosion effect
        const explosionGradient = ctx.createRadialGradient(
          centerX + event.x, centerY + event.y, 0,
          centerX + event.x, centerY + event.y, size
        );
        explosionGradient.addColorStop(0, `hsla(${eventColor}, ${alpha})`);
        explosionGradient.addColorStop(0.7, `hsla(${eventColor}, ${alpha * 0.5})`);
        explosionGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = explosionGradient;
        ctx.beginPath();
        ctx.arc(centerX + event.x, centerY + event.y, size, 0, Math.PI * 2);
        ctx.fill();
        
        // NFT indicator for perfect matches
        if (event.type === 'perfect' && event.nftPattern) {
          ctx.fillStyle = `hsla(45, 100%, 80%, ${alpha})`;
          ctx.font = '10px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(
            `NFT: ${event.nftPattern}`,
            centerX + event.x,
            centerY + event.y - size - 10
          );
        }
      }
    });

    // Draw AI prediction orbits
    aiPredictions.forEach((prediction, index) => {
      const predictionAngle = (prediction.optimalCrossfaderPosition / 100) * Math.PI * 2;
      const predictionX = centerX + Math.cos(predictionAngle) * (reactorRadius + 20);
      const predictionY = centerY + Math.sin(predictionAngle) * (reactorRadius + 20);
      
      // Pulsing prediction indicator
      const pulseSize = 6 + Math.sin(Date.now() * 0.01 + index) * 3;
      
      ctx.fillStyle = `hsla(120, 80%, 60%, ${prediction.confidence})`;
      ctx.beginPath();
      ctx.arc(predictionX, predictionY, pulseSize, 0, Math.PI * 2);
      ctx.fill();
      
      // Confidence ring
      ctx.strokeStyle = `hsla(120, 60%, 50%, ${prediction.confidence * 0.7})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(predictionX, predictionY, pulseSize + 8, 0, Math.PI * 2);
      ctx.stroke();
    });
  };

  const animate = () => {
    updateEnergyBeams();
    detectCollisions();
    updateQuantumField();
    drawReactor();
    
    // Decay reactor energy
    setReactorEnergy(prev => Math.max(0, prev - 0.2));
    
    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    initializeEnergyBeams();
  }, []);

  useEffect(() => {
    if (isPlaying1 || isPlaying2) {
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
  }, [isPlaying1, isPlaying2, audioDataDeck1, audioDataDeck2, crossfaderPosition]);

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height: '400px',
    background: 'radial-gradient(circle, rgba(2,0,10,1) 0%, rgba(0,0,5,1) 100%)',
    borderRadius: '12px',
    overflow: 'hidden',
    border: '2px solid rgba(128,0,255,0.3)'
  };

  const statusOverlayStyle: React.CSSProperties = {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: 'rgba(0,0,0,0.8)',
    padding: '8px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    color: '#fff',
    zIndex: 10
  };

  const energyMeterStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '10px',
    left: '10px',
    width: '200px',
    height: '20px',
    background: 'rgba(0,0,0,0.7)',
    borderRadius: '10px',
    overflow: 'hidden',
    border: '1px solid rgba(255,255,255,0.3)',
    zIndex: 10
  };

  const energyFillStyle: React.CSSProperties = {
    width: `${reactorEnergy}%`,
    height: '100%',
    background: `linear-gradient(90deg, 
      hsl(280, 80%, 60%) 0%, 
      hsl(300, 70%, 70%) 50%, 
      hsl(320, 90%, 80%) 100%)`,
    transition: 'width 0.3s ease'
  };

  return (
    <div style={containerStyle}>
      <div style={statusOverlayStyle}>
        <div>Crossfader: {crossfaderPosition}%</div>
        <div>BPM Sync: {Math.abs(bpm1 - bpm2) < 5 ? '✓' : '✗'}</div>
        <div>Collisions: {collisionEvents.length}</div>
        <div>AI Predictions: {aiPredictions.length}</div>
      </div>
      
      <div style={energyMeterStyle}>
        <div style={energyFillStyle}></div>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '10px',
          transform: 'translateY(-50%)',
          fontSize: '10px',
          color: '#fff',
          fontWeight: 'bold'
        }}>
          Reactor Energy: {reactorEnergy.toFixed(1)}%
        </div>
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

export default QuantumMixReactor;