import React, { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  frequency: number;
  harmonicIndex: number;
  intensity: number;
  hue: number;
  life: number;
}

interface NeuralHarmonyConstellationProps {
  audioData?: number[];
  isPlaying: boolean;
  bpm: number;
  musicalKey: string;
  harmonicCompatibility: number;
  aiPredictions?: { mixPoint: number; confidence: number }[];
}

const NeuralHarmonyConstellation: React.FC<NeuralHarmonyConstellationProps> = ({
  audioData = [],
  isPlaying,
  bpm,
  musicalKey,
  harmonicCompatibility,
  aiPredictions = []
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [constellationPattern, setConstellationPattern] = useState<string>('');

  // Musical key to color mapping
  const keyColorMap: { [key: string]: number } = {
    'C': 0, 'C#': 30, 'D': 60, 'D#': 90, 'E': 120, 'F': 150,
    'F#': 180, 'G': 210, 'G#': 240, 'A': 270, 'A#': 300, 'B': 330,
    'Am': 15, 'Gm': 225, 'Dm': 75, 'Em': 135
  };

  const initializeParticles = () => {
    const newParticles: Particle[] = [];
    const particleCount = 150;
    
    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        x: (Math.random() - 0.5) * 400,
        y: (Math.random() - 0.5) * 400,
        z: (Math.random() - 0.5) * 200,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        vz: (Math.random() - 0.5) * 1,
        frequency: Math.random() * 20000,
        harmonicIndex: Math.floor(Math.random() * 12),
        intensity: Math.random(),
        hue: keyColorMap[musicalKey] || 180,
        life: Math.random() * 100 + 50
      });
    }
    setParticles(newParticles);
  };

  const updateParticles = () => {
    if (!isPlaying) return;

    setParticles(prevParticles => 
      prevParticles.map(particle => {
        // Get frequency data for this particle
        const frequencyIndex = Math.floor((particle.frequency / 20000) * audioData.length);
        const amplitude = audioData[frequencyIndex] || 0;
        
        // Update particle based on audio and harmonic analysis
        const harmonicInfluence = Math.sin(Date.now() * 0.001 + particle.harmonicIndex) * 0.5 + 0.5;
        const bpmInfluence = Math.sin(Date.now() * (bpm / 60) * 0.001) * 0.3;
        
        return {
          ...particle,
          x: particle.x + particle.vx + harmonicInfluence * 2,
          y: particle.y + particle.vy + bpmInfluence * 2,
          z: particle.z + particle.vz + amplitude * 0.1,
          vx: particle.vx * 0.99 + (Math.random() - 0.5) * 0.1,
          vy: particle.vy * 0.99 + (Math.random() - 0.5) * 0.1,
          vz: particle.vz * 0.99 + (Math.random() - 0.5) * 0.05,
          intensity: amplitude * harmonicCompatibility,
          hue: (keyColorMap[musicalKey] || 180) + harmonicInfluence * 60,
          life: particle.life - 0.5
        };
      }).filter(particle => particle.life > 0)
    );
  };

  const drawConstellation = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas with fade effect
    ctx.fillStyle = 'rgba(0, 5, 15, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Draw particles
    particles.forEach((particle, index) => {
      const screenX = centerX + particle.x + Math.sin(particle.z * 0.01) * 20;
      const screenY = centerY + particle.y + Math.cos(particle.z * 0.01) * 20;
      const size = (particle.intensity + 0.2) * 3 * (particle.life / 100);
      
      // Particle glow effect - ensure valid values
      const validSize = Math.max(1, Math.abs(size) || 1);
      const validX = isFinite(screenX) ? screenX : 0;
      const validY = isFinite(screenY) ? screenY : 0;
      const validIntensity = Math.max(0, Math.min(1, particle.intensity || 0));
      
      const gradient = ctx.createRadialGradient(validX, validY, 0, validX, validY, validSize * 2);
      gradient.addColorStop(0, `hsla(${particle.hue}, 80%, 70%, ${validIntensity})`);
      gradient.addColorStop(0.5, `hsla(${particle.hue}, 60%, 50%, ${validIntensity * 0.5})`);
      gradient.addColorStop(1, `hsla(${particle.hue}, 40%, 30%, 0)`);
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(validX, validY, validSize, 0, Math.PI * 2);
      ctx.fill();

      // Draw connections to nearby particles
      particles.slice(index + 1).forEach(otherParticle => {
        const distance = Math.sqrt(
          Math.pow(particle.x - otherParticle.x, 2) +
          Math.pow(particle.y - otherParticle.y, 2) +
          Math.pow(particle.z - otherParticle.z, 2)
        );

        if (distance < 80 && Math.abs(particle.harmonicIndex - otherParticle.harmonicIndex) <= 2) {
          const otherScreenX = centerX + otherParticle.x + Math.sin(otherParticle.z * 0.01) * 20;
          const otherScreenY = centerY + otherParticle.y + Math.cos(otherParticle.z * 0.01) * 20;
          
          const connectionIntensity = (particle.intensity + otherParticle.intensity) * 0.3 * (1 - distance / 80);
          ctx.strokeStyle = `hsla(${(particle.hue + otherParticle.hue) / 2}, 60%, 60%, ${connectionIntensity})`;
          ctx.lineWidth = connectionIntensity * 2;
          ctx.beginPath();
          ctx.moveTo(screenX, screenY);
          ctx.lineTo(otherScreenX, otherScreenY);
          ctx.stroke();
        }
      });
    });

    // Draw AI prediction indicators
    aiPredictions.forEach((prediction, index) => {
      const angle = (index / aiPredictions.length) * Math.PI * 2;
      const radius = 150 + prediction.confidence * 50;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      ctx.fillStyle = `hsla(120, 80%, 60%, ${prediction.confidence})`;
      ctx.beginPath();
      ctx.arc(x, y, 8 * prediction.confidence, 0, Math.PI * 2);
      ctx.fill();
      
      // Pulsing ring
      ctx.strokeStyle = `hsla(120, 60%, 50%, ${prediction.confidence * 0.5})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, 15 + Math.sin(Date.now() * 0.005) * 5, 0, Math.PI * 2);
      ctx.stroke();
    });

    // Draw harmonic compatibility indicator
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(Date.now() * 0.001);
    
    const compatibilityRadius = 200;
    const compatibilityGlow = harmonicCompatibility * 0.8;
    
    ctx.strokeStyle = `hsla(${keyColorMap[musicalKey] || 180}, 70%, 60%, ${compatibilityGlow})`;
    ctx.lineWidth = 3;
    ctx.setLineDash([10, 5]);
    ctx.beginPath();
    ctx.arc(0, 0, compatibilityRadius, 0, Math.PI * 2 * harmonicCompatibility);
    ctx.stroke();
    ctx.restore();
  };


  const generateConstellationNFT = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Create unique pattern ID based on current state
    const patternData = {
      timestamp: Date.now(),
      musicalKey,
      bpm,
      harmonicCompatibility,
      particleCount: particles.length,
      averageIntensity: particles.reduce((sum, p) => sum + p.intensity, 0) / particles.length
    };
    
    const patternId = btoa(JSON.stringify(patternData)).slice(0, 16);
    setConstellationPattern(patternId);
    
    // In a real implementation, this would mint an NFT with the canvas data
    console.log('Constellation NFT Pattern Generated:', patternId);
    console.log('Canvas data URL:', canvas.toDataURL());
  };

  useEffect(() => {
    initializeParticles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [musicalKey]);

  useEffect(() => {
    const animateLoop = () => {
      updateParticles();
      drawConstellation();
      animationRef.current = requestAnimationFrame(animateLoop);
    };

    if (isPlaying) {
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
  }, [isPlaying, audioData, particles]);

  // Generate NFT when exceptional patterns occur
  useEffect(() => {
    if (harmonicCompatibility > 0.8 && particles.length > 100) {
      generateConstellationNFT();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [harmonicCompatibility, particles.length]);

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height: '300px',
    background: 'radial-gradient(ellipse at center, rgba(0,20,40,0.9) 0%, rgba(0,5,15,1) 100%)',
    borderRadius: '12px',
    overflow: 'hidden',
    border: '1px solid rgba(255,255,255,0.1)'
  };

  const infoOverlayStyle: React.CSSProperties = {
    position: 'absolute',
    top: '10px',
    left: '10px',
    background: 'rgba(0,0,0,0.7)',
    padding: '8px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    color: '#fff',
    zIndex: 10
  };

  const nftIndicatorStyle: React.CSSProperties = {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: 'rgba(255,215,0,0.2)',
    border: '1px solid #ffd700',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '10px',
    color: '#ffd700',
    zIndex: 10,
    display: constellationPattern ? 'block' : 'none'
  };

  return (
    <div style={containerStyle}>
      <div style={infoOverlayStyle}>
        <div>Key: {musicalKey} | BPM: {bpm}</div>
        <div>Harmony: {(harmonicCompatibility * 100).toFixed(1)}%</div>
        <div>Particles: {particles.length}</div>
      </div>
      
      <div style={nftIndicatorStyle}>
        NFT Pattern: {constellationPattern}
      </div>
      
      <canvas
        ref={canvasRef}
        width={800}
        height={300}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default NeuralHarmonyConstellation;