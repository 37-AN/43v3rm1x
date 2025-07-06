import React, { useEffect, useRef, useState } from 'react';

interface CyberOrganism {
  id: string;
  x: number;
  y: number;
  z: number;
  type: 'bass' | 'mid' | 'treble' | 'vocal' | 'synth';
  size: number;
  health: number;
  energy: number;
  connections: string[];
  behavior: 'feeding' | 'reproducing' | 'migrating' | 'dormant';
  lifespan: number;
  generation: number;
  dna: number[];
}

interface CyberneticEcosystemProps {
  audioDataDeck1?: number[];
  audioDataDeck2?: number[];
  isPlaying1: boolean;
  isPlaying2: boolean;
  crossfaderPosition: number;
  bpm1: number;
  bpm2: number;
}

const CyberneticEcosystem: React.FC<CyberneticEcosystemProps> = ({
  audioDataDeck1 = [],
  audioDataDeck2 = [],
  isPlaying1,
  isPlaying2,
  crossfaderPosition,
  bpm1,
  bpm2
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const [organisms, setOrganisms] = useState<CyberOrganism[]>([]);
  const [ecosystemHealth, setEcosystemHealth] = useState(100);
  const [generationCount, setGenerationCount] = useState(1);
  const [evolutionEvents, setEvolutionEvents] = useState<string[]>([]);

  const organismTypes = {
    bass: { color: '#ff3366', frequency: [0, 0.1], behavior: 'feeding' },
    mid: { color: '#33ff66', frequency: [0.1, 0.6], behavior: 'migrating' },
    treble: { color: '#3366ff', frequency: [0.6, 0.9], behavior: 'reproducing' },
    vocal: { color: '#ff6633', frequency: [0.3, 0.7], behavior: 'feeding' },
    synth: { color: '#6633ff', frequency: [0.2, 0.8], behavior: 'dormant' }
  };

  const initializeEcosystem = () => {
    const newOrganisms: CyberOrganism[] = [];
    const populationSize = 30;
    
    for (let i = 0; i < populationSize; i++) {
      const types = Object.keys(organismTypes) as Array<keyof typeof organismTypes>;
      const type = types[Math.floor(Math.random() * types.length)];
      
      newOrganisms.push({
        id: `org_${i}`,
        x: Math.random() * 800,
        y: Math.random() * 400,
        z: Math.random() * 100,
        type: type,
        size: 5 + Math.random() * 10,
        health: 50 + Math.random() * 50,
        energy: Math.random() * 100,
        connections: [],
        behavior: organismTypes[type].behavior as any,
        lifespan: 1000 + Math.random() * 2000,
        generation: 1,
        dna: Array.from({ length: 8 }, () => Math.random())
      });
    }
    
    setOrganisms(newOrganisms);
  };

  const calculateEnvironmentalFactors = () => {
    const deck1Energy = audioDataDeck1.reduce((sum, val) => sum + val, 0) / audioDataDeck1.length;
    const deck2Energy = audioDataDeck2.reduce((sum, val) => sum + val, 0) / audioDataDeck2.length;
    const totalEnergy = (deck1Energy + deck2Energy) / 2;
    
    const bpmStability = 1 - Math.abs(bpm1 - bpm2) / Math.max(bpm1, bpm2, 1);
    const mixBalance = 1 - Math.abs(crossfaderPosition - 50) / 50;
    
    return {
      energyLevel: totalEnergy,
      stability: bpmStability,
      harmony: mixBalance,
      toxicity: totalEnergy > 0.8 ? (totalEnergy - 0.8) * 5 : 0
    };
  };

  const evolveOrganisms = () => {
    if (!isPlaying1 && !isPlaying2) return;

    const environment = calculateEnvironmentalFactors();
    
    setOrganisms(prevOrganisms => {
      const newOrganisms = [...prevOrganisms];
      const currentTime = Date.now();
      
      newOrganisms.forEach((organism, index) => {
        // Get frequency data for this organism's type
        const typeInfo = organismTypes[organism.type];
        const freqRange = typeInfo.frequency;
        const startIdx = Math.floor(freqRange[0] * audioDataDeck1.length);
        const endIdx = Math.floor(freqRange[1] * audioDataDeck1.length);
        
        const relevantFreqs = [
          ...audioDataDeck1.slice(startIdx, endIdx),
          ...audioDataDeck2.slice(startIdx, endIdx)
        ];
        const avgAmplitude = relevantFreqs.reduce((sum, val) => sum + val, 0) / relevantFreqs.length;
        
        // Update organism based on its environment
        organism.energy += avgAmplitude * 10 - 1; // Gain energy from relevant frequencies
        organism.energy = Math.max(0, Math.min(100, organism.energy));
        
        // Health affected by environmental factors
        organism.health += environment.harmony * 2 - environment.toxicity;
        organism.health = Math.max(0, Math.min(100, organism.health));
        
        // Behavior changes based on energy and health
        if (organism.energy > 80 && organism.health > 70) {
          organism.behavior = 'reproducing';
        } else if (organism.energy < 30) {
          organism.behavior = 'feeding';
        } else if (organism.health < 40) {
          organism.behavior = 'dormant';
        } else {
          organism.behavior = 'migrating';
        }
        
        // Movement based on behavior
        switch (organism.behavior) {
          case 'feeding':
            // Move towards energy sources
            organism.x += (Math.random() - 0.5) * avgAmplitude * 20;
            organism.y += (Math.random() - 0.5) * avgAmplitude * 20;
            break;
          case 'migrating':
            // Smooth movement
            organism.x += Math.sin(currentTime * 0.001 + index) * 2;
            organism.y += Math.cos(currentTime * 0.001 + index) * 2;
            break;
          case 'reproducing':
            // Spiral movement
            const angle = currentTime * 0.002 + index;
            organism.x += Math.cos(angle) * 3;
            organism.y += Math.sin(angle) * 3;
            break;
          case 'dormant':
            // Minimal movement
            organism.x += (Math.random() - 0.5) * 0.5;
            organism.y += (Math.random() - 0.5) * 0.5;
            break;
        }
        
        // Keep organisms within bounds
        organism.x = Math.max(20, Math.min(780, organism.x));
        organism.y = Math.max(20, Math.min(380, organism.y));
        
        // Size changes based on health and energy
        organism.size = 5 + (organism.health / 100) * 10 + (organism.energy / 100) * 5;
        
        // Lifespan countdown
        organism.lifespan -= 1;
      });
      
      // Remove dead organisms
      const survivors = newOrganisms.filter(org => org.lifespan > 0 && org.health > 0);
      
      // Reproduction - create new organisms when conditions are right
      const reproducers = survivors.filter(org => 
        org.behavior === 'reproducing' && 
        org.energy > 70 && 
        org.health > 80 &&
        Math.random() < 0.01 // 1% chance per frame
      );
      
      reproducers.forEach(parent => {
        if (survivors.length < 50) { // Population limit
          const child: CyberOrganism = {
            id: `org_${Date.now()}_${Math.random()}`,
            x: parent.x + (Math.random() - 0.5) * 50,
            y: parent.y + (Math.random() - 0.5) * 50,
            z: parent.z + (Math.random() - 0.5) * 20,
            type: parent.type,
            size: parent.size * 0.5,
            health: Math.min(100, parent.health * 0.8 + Math.random() * 20),
            energy: parent.energy * 0.5,
            connections: [],
            behavior: 'feeding',
            lifespan: parent.lifespan * 0.8 + Math.random() * 500,
            generation: parent.generation + 1,
            dna: parent.dna.map(gene => gene + (Math.random() - 0.5) * 0.1)
          };
          
          survivors.push(child);
          parent.energy -= 30; // Reproduction cost
          
          if (child.generation > generationCount) {
            setGenerationCount(child.generation);
            setEvolutionEvents(prev => [...prev.slice(-3), `Generation ${child.generation} ${child.type} evolved!`]);
          }
        }
      });
      
      // Update ecosystem health
      const avgHealth = survivors.reduce((sum, org) => sum + org.health, 0) / survivors.length;
      setEcosystemHealth(avgHealth);
      
      return survivors;
    });
  };

  const drawOrganism = (ctx: CanvasRenderingContext2D, organism: CyberOrganism) => {
    const typeInfo = organismTypes[organism.type];
    const alpha = (organism.health / 100) * (organism.energy / 100);
    
    // Draw organism body with cybernetic enhancements
    const gradient = ctx.createRadialGradient(organism.x, organism.y, 0, organism.x, organism.y, organism.size);
    gradient.addColorStop(0, `${typeInfo.color}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`);
    gradient.addColorStop(0.7, `${typeInfo.color}80`);
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(organism.x, organism.y, organism.size, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw cybernetic core
    ctx.fillStyle = organism.behavior === 'reproducing' ? '#ffffff' : typeInfo.color;
    ctx.beginPath();
    ctx.arc(organism.x, organism.y, organism.size * 0.3, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw behavior indicators
    const behaviorSymbols = {
      feeding: '⚡',
      reproducing: '💎',
      migrating: '→',
      dormant: '●'
    };
    
    ctx.fillStyle = '#ffffff';
    ctx.font = `${Math.floor(organism.size)}px monospace`;
    ctx.textAlign = 'center';
    ctx.fillText(behaviorSymbols[organism.behavior], organism.x, organism.y - organism.size - 5);
    
    // Draw DNA quality indicator
    const dnaStability = organism.dna.reduce((sum, gene) => sum + Math.abs(gene - 0.5), 0) / organism.dna.length;
    if (dnaStability < 0.1) {
      ctx.strokeStyle = '#00ff00';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(organism.x, organism.y, organism.size + 5, 0, Math.PI * 2);
      ctx.stroke();
    }
    
    // Draw energy/health bars
    const barWidth = organism.size * 2;
    const barHeight = 3;
    
    // Energy bar
    ctx.fillStyle = 'rgba(255,255,0,0.8)';
    ctx.fillRect(organism.x - barWidth/2, organism.y + organism.size + 8, barWidth * (organism.energy/100), barHeight);
    
    // Health bar
    ctx.fillStyle = 'rgba(255,0,0,0.8)';
    ctx.fillRect(organism.x - barWidth/2, organism.y + organism.size + 12, barWidth * (organism.health/100), barHeight);
  };

  const drawEcosystemEffects = (ctx: CanvasRenderingContext2D) => {
    const environment = calculateEnvironmentalFactors();
    
    // Draw environmental effects
    if (environment.toxicity > 0.5) {
      // Toxic environment effect
      ctx.fillStyle = `rgba(255, 0, 0, ${environment.toxicity * 0.1})`;
      ctx.fillRect(0, 0, 800, 400);
    }
    
    if (environment.harmony > 0.8) {
      // Harmony effect - golden glow
      ctx.fillStyle = `rgba(255, 215, 0, ${environment.harmony * 0.1})`;
      ctx.fillRect(0, 0, 800, 400);
    }
    
    // Draw energy fields
    const time = Date.now() * 0.001;
    for (let i = 0; i < 10; i++) {
      const x = Math.sin(time + i) * 300 + 400;
      const y = Math.cos(time + i * 0.7) * 150 + 200;
      const radius = environment.energyLevel * 50;
      
      ctx.fillStyle = `hsla(${i * 36 + time * 30}, 60%, 50%, 0.1)`;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const drawVisualization = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear with cybernetic grid background
    ctx.fillStyle = 'rgba(0, 10, 20, 0.9)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    drawEcosystemEffects(ctx);
    
    // Draw organisms
    organisms.forEach(organism => drawOrganism(ctx, organism));
    
    // Draw connections between nearby organisms
    organisms.forEach((org1, i) => {
      organisms.slice(i + 1).forEach(org2 => {
        const distance = Math.sqrt((org1.x - org2.x) ** 2 + (org1.y - org2.y) ** 2);
        if (distance < 80 && org1.type === org2.type) {
          const alpha = Math.max(0, 1 - distance / 80) * 0.3;
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(org1.x, org1.y);
          ctx.lineTo(org2.x, org2.y);
          ctx.stroke();
        }
      });
    });
  };

  useEffect(() => {
    initializeEcosystem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const animateLoop = () => {
      evolveOrganisms();
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
  }, [isPlaying1, isPlaying2, audioDataDeck1, audioDataDeck2, organisms]);

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height: '400px',
    background: 'linear-gradient(135deg, rgba(0,10,20,1) 0%, rgba(0,20,30,1) 100%)',
    borderRadius: '16px',
    overflow: 'hidden',
    border: '2px solid rgba(0,255,255,0.3)'
  };

  const statsOverlayStyle: React.CSSProperties = {
    position: 'absolute',
    top: '10px',
    right: '10px',
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
      <div style={statsOverlayStyle}>
        <div><strong>🔬 CYBERNETIC ECOSYSTEM</strong></div>
        <div>Population: {organisms.length}</div>
        <div>Generation: {generationCount}</div>
        <div>Ecosystem Health: {ecosystemHealth.toFixed(1)}%</div>
        <div>Environment: {calculateEnvironmentalFactors().energyLevel.toFixed(2)}</div>
        {evolutionEvents.slice(-1).map((event, i) => (
          <div key={i} style={{ color: '#00ff00' }}>{event}</div>
        ))}
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

export default CyberneticEcosystem;