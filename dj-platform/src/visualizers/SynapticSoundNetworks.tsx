import React, { useEffect, useRef, useState } from 'react';

interface SoundNode {
  id: string;
  x: number;
  y: number;
  instrument: string;
  frequency: number;
  amplitude: number;
  connections: string[];
  activity: number;
  type: 'bass' | 'melody' | 'percussion' | 'harmony' | 'vocal';
  color: string;
  size: number;
  pulsePhase: number;
}

interface SynapticConnection {
  from: string;
  to: string;
  strength: number;
  activeSignal: number;
  signalDirection: number;
  type: 'harmonic' | 'rhythmic' | 'melodic' | 'structural';
  color: string;
}

interface NetworkFusion {
  id: string;
  timestamp: number;
  nodes: SoundNode[];
  connections: SynapticConnection[];
  quality: number;
  nftPattern?: string;
}

interface SynapticSoundNetworksProps {
  audioDataDeck1?: number[];
  audioDataDeck2?: number[];
  trackInfo1?: { name: string; key: string; bpm: number; genre: string };
  trackInfo2?: { name: string; key: string; bpm: number; genre: string };
  mixProgress: number;
  isPlaying1: boolean;
  isPlaying2: boolean;
  onNetworkFusion?: (fusion: NetworkFusion) => void;
}

const SynapticSoundNetworks: React.FC<SynapticSoundNetworksProps> = ({
  audioDataDeck1 = [],
  audioDataDeck2 = [],
  trackInfo1,
  trackInfo2,
  mixProgress,
  isPlaying1,
  isPlaying2,
  onNetworkFusion
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [networks, setNetworks] = useState<{ deck1: SoundNode[]; deck2: SoundNode[] }>({
    deck1: [],
    deck2: []
  });
  const [connections, setConnections] = useState<{ deck1: SynapticConnection[]; deck2: SynapticConnection[] }>({
    deck1: [],
    deck2: []
  });
  const [fusionEvents, setFusionEvents] = useState<NetworkFusion[]>([]);
  const [neuralActivity, setNeuralActivity] = useState(0);

  const instrumentTypes = ['bass', 'melody', 'percussion', 'harmony', 'vocal'] as const;
  const connectionTypes = ['harmonic', 'rhythmic', 'melodic', 'structural'] as const;

  const typeColors = {
    bass: '#ff4444',
    melody: '#44ff44',
    percussion: '#ffff44',
    harmony: '#4444ff',
    vocal: '#ff44ff'
  };

  const connectionColors = {
    harmonic: '#ffaa44',
    rhythmic: '#44aaff',
    melodic: '#aa44ff',
    structural: '#44ffaa'
  };

  const generateNetwork = (deckId: 'deck1' | 'deck2', audioData: number[], trackInfo?: any) => {
    const nodes: SoundNode[] = [];
    const nodeCount = 12;
    const centerX = deckId === 'deck1' ? 200 : 600;
    const centerY = 200;
    const networkRadius = 120;

    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * Math.PI * 2;
      const radius = networkRadius + (Math.random() - 0.5) * 40;
      const instrumentType = instrumentTypes[i % instrumentTypes.length];
      
      const frequencyIndex = Math.floor((i / nodeCount) * audioData.length);
      const amplitude = audioData[frequencyIndex] || 0;
      
      nodes.push({
        id: `${deckId}_node_${i}`,
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        instrument: `${instrumentType}_${i}`,
        frequency: frequencyIndex * (20000 / audioData.length),
        amplitude,
        connections: [],
        activity: amplitude,
        type: instrumentType,
        color: typeColors[instrumentType],
        size: 8 + amplitude * 12,
        pulsePhase: Math.random() * Math.PI * 2
      });
    }

    // Generate connections based on musical relationships
    const connections: SynapticConnection[] = [];
    
    nodes.forEach((node, i) => {
      const nearbyNodes = nodes.filter((other, j) => {
        if (i === j) return false;
        const distance = Math.sqrt((node.x - other.x) ** 2 + (node.y - other.y) ** 2);
        return distance < 80;
      });

      nearbyNodes.forEach(otherNode => {
        // Determine connection type based on instrument types
        let connectionType: typeof connectionTypes[number] = 'structural';
        if (node.type === 'bass' && otherNode.type === 'percussion') connectionType = 'rhythmic';
        if (node.type === 'melody' && otherNode.type === 'harmony') connectionType = 'harmonic';
        if (node.type === 'vocal' && otherNode.type === 'melody') connectionType = 'melodic';

        const strength = (node.amplitude + otherNode.amplitude) / 2;
        
        if (strength > 0.1) {
          connections.push({
            from: node.id,
            to: otherNode.id,
            strength,
            activeSignal: 0,
            signalDirection: 0,
            type: connectionType,
            color: connectionColors[connectionType]
          });
          
          node.connections.push(otherNode.id);
        }
      });
    });

    return { nodes, connections };
  };

  const updateNetworks = () => {
    if (!isPlaying1 && !isPlaying2) return;

    setNetworks(prevNetworks => ({
      deck1: prevNetworks.deck1.map((node, i) => {
        const frequencyIndex = Math.floor((i / prevNetworks.deck1.length) * audioDataDeck1.length);
        const newAmplitude = audioDataDeck1[frequencyIndex] || 0;
        
        return {
          ...node,
          amplitude: newAmplitude,
          activity: newAmplitude * 0.8 + node.activity * 0.2, // Smoothed activity
          size: 8 + newAmplitude * 12,
          pulsePhase: node.pulsePhase + 0.1 + newAmplitude * 0.2
        };
      }),
      deck2: prevNetworks.deck2.map((node, i) => {
        const frequencyIndex = Math.floor((i / prevNetworks.deck2.length) * audioDataDeck2.length);
        const newAmplitude = audioDataDeck2[frequencyIndex] || 0;
        
        return {
          ...node,
          amplitude: newAmplitude,
          activity: newAmplitude * 0.8 + node.activity * 0.2,
          size: 8 + newAmplitude * 12,
          pulsePhase: node.pulsePhase + 0.1 + newAmplitude * 0.2
        };
      })
    }));

    setConnections(prevConnections => ({
      deck1: prevConnections.deck1.map(conn => {
        const fromNode = networks.deck1.find(n => n.id === conn.from);
        const toNode = networks.deck1.find(n => n.id === conn.to);
        
        if (fromNode && toNode) {
          const newStrength = (fromNode.activity + toNode.activity) / 2;
          const signalActivity = Math.sin(Date.now() * 0.01 + conn.signalDirection) * newStrength;
          
          return {
            ...conn,
            strength: newStrength,
            activeSignal: signalActivity,
            signalDirection: conn.signalDirection + 0.1
          };
        }
        return conn;
      }),
      deck2: prevConnections.deck2.map(conn => {
        const fromNode = networks.deck2.find(n => n.id === conn.from);
        const toNode = networks.deck2.find(n => n.id === conn.to);
        
        if (fromNode && toNode) {
          const newStrength = (fromNode.activity + toNode.activity) / 2;
          const signalActivity = Math.sin(Date.now() * 0.01 + conn.signalDirection) * newStrength;
          
          return {
            ...conn,
            strength: newStrength,
            activeSignal: signalActivity,
            signalDirection: conn.signalDirection + 0.1
          };
        }
        return conn;
      })
    }));

    // Update neural activity
    const totalActivity = [...networks.deck1, ...networks.deck2]
      .reduce((sum, node) => sum + node.activity, 0) / (networks.deck1.length + networks.deck2.length);
    
    setNeuralActivity(totalActivity);
  };

  const detectNetworkFusion = () => {
    if (mixProgress < 0.3 || mixProgress > 0.7) return; // Only fuse during active mixing

    const fusionNodes: SoundNode[] = [];
    const fusionConnections: SynapticConnection[] = [];

    // Find nodes that are creating fusion connections
    networks.deck1.forEach(node1 => {
      networks.deck2.forEach(node2 => {
        const distance = Math.sqrt((node1.x - node2.x) ** 2 + (node1.y - node2.y) ** 2);
        
        if (distance < 150 && node1.type === node2.type && node1.activity > 0.5 && node2.activity > 0.5) {
          // Create fusion point
          const fusionNode: SoundNode = {
            id: `fusion_${node1.id}_${node2.id}`,
            x: (node1.x + node2.x) / 2,
            y: (node1.y + node2.y) / 2,
            instrument: `fused_${node1.instrument}_${node2.instrument}`,
            frequency: (node1.frequency + node2.frequency) / 2,
            amplitude: (node1.amplitude + node2.amplitude) / 2,
            connections: [...node1.connections, ...node2.connections],
            activity: (node1.activity + node2.activity) / 2,
            type: node1.type,
            color: blendColors(node1.color, node2.color),
            size: Math.max(node1.size, node2.size) + 5,
            pulsePhase: (node1.pulsePhase + node2.pulsePhase) / 2
          };

          fusionNodes.push(fusionNode);

          // Create fusion connection
          fusionConnections.push({
            from: node1.id,
            to: node2.id,
            strength: fusionNode.activity,
            activeSignal: 1,
            signalDirection: 0,
            type: 'structural',
            color: '#ffffff'
          });
        }
      });
    });

    if (fusionNodes.length > 2) {
      const fusionQuality = fusionNodes.reduce((sum, node) => sum + node.activity, 0) / fusionNodes.length;
      
      const fusion: NetworkFusion = {
        id: `fusion_${Date.now()}`,
        timestamp: Date.now(),
        nodes: fusionNodes,
        connections: fusionConnections,
        quality: fusionQuality,
        nftPattern: fusionQuality > 0.8 ? generateNeuralNFT(fusionNodes) : undefined
      };

      setFusionEvents(prev => [...prev.slice(-5), fusion]);
      if (onNetworkFusion) onNetworkFusion(fusion);
    }
  };

  const blendColors = (color1: string, color2: string): string => {
    // Simple color blending - in production, use proper color space blending
    return '#aa44aa'; // Purple blend for demonstration
  };

  const generateNeuralNFT = (nodes: SoundNode[]): string => {
    const patternData = {
      timestamp: Date.now(),
      nodeCount: nodes.length,
      averageActivity: nodes.reduce((sum, n) => sum + n.activity, 0) / nodes.length,
      instrumentTypes: nodes.map(n => n.type),
      networkComplexity: nodes.reduce((sum, n) => sum + n.connections.length, 0)
    };
    return btoa(JSON.stringify(patternData)).slice(0, 10);
  };

  const drawNetwork = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear with neural background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, 'rgba(5, 5, 20, 0.95)');
    gradient.addColorStop(0.5, 'rgba(10, 10, 30, 0.95)');
    gradient.addColorStop(1, 'rgba(15, 5, 25, 0.95)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw network background grids
    ctx.strokeStyle = 'rgba(100, 100, 150, 0.1)';
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

    // Draw connections first (behind nodes)
    ['deck1', 'deck2'].forEach(deckId => {
      const deckConnections = connections[deckId as keyof typeof connections];
      const deckNodes = networks[deckId as keyof typeof networks];
      
      deckConnections.forEach(conn => {
        const fromNode = deckNodes.find(n => n.id === conn.from);
        const toNode = deckNodes.find(n => n.id === conn.to);
        
        if (fromNode && toNode && conn.strength > 0.1) {
          // Draw connection line
          ctx.strokeStyle = `${conn.color}${Math.floor(conn.strength * 255).toString(16).padStart(2, '0')}`;
          ctx.lineWidth = 2 + conn.strength * 4;
          ctx.beginPath();
          ctx.moveTo(fromNode.x, fromNode.y);
          ctx.lineTo(toNode.x, toNode.y);
          ctx.stroke();
          
          // Draw signal traveling along connection
          if (conn.activeSignal > 0) {
            const progress = (Math.sin(conn.signalDirection) + 1) / 2;
            const signalX = fromNode.x + (toNode.x - fromNode.x) * progress;
            const signalY = fromNode.y + (toNode.y - fromNode.y) * progress;
            
            ctx.fillStyle = `${conn.color}FF`;
            ctx.beginPath();
            ctx.arc(signalX, signalY, 3 + conn.activeSignal * 3, 0, Math.PI * 2);
            ctx.fill();
          }
          
          // Draw connection type indicator
          const midX = (fromNode.x + toNode.x) / 2;
          const midY = (fromNode.y + toNode.y) / 2;
          
          ctx.fillStyle = `${conn.color}80`;
          ctx.font = '8px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(conn.type.charAt(0).toUpperCase(), midX, midY + 2);
        }
      });
    });

    // Draw nodes
    ['deck1', 'deck2'].forEach(deckId => {
      const deckNodes = networks[deckId as keyof typeof networks];
      
      deckNodes.forEach(node => {
        if (node.activity > 0.05) {
          // Node body
          const pulseSize = node.size + Math.sin(node.pulsePhase) * node.activity * 5;
          const nodeGradient = ctx.createRadialGradient(
            node.x, node.y, 0,
            node.x, node.y, pulseSize
          );
          nodeGradient.addColorStop(0, `${node.color}FF`);
          nodeGradient.addColorStop(0.7, `${node.color}AA`);
          nodeGradient.addColorStop(1, `${node.color}00`);
          
          ctx.fillStyle = nodeGradient;
          ctx.beginPath();
          ctx.arc(node.x, node.y, pulseSize, 0, Math.PI * 2);
          ctx.fill();
          
          // Node core
          ctx.fillStyle = node.color;
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.size * 0.5, 0, Math.PI * 2);
          ctx.fill();
          
          // Activity ring
          ctx.strokeStyle = `${node.color}${Math.floor(node.activity * 255).toString(16).padStart(2, '0')}`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.size + 8, 0, Math.PI * 2 * node.activity);
          ctx.stroke();
          
          // Node label
          ctx.fillStyle = '#ffffff';
          ctx.font = '10px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(node.type, node.x, node.y - node.size - 5);
          
          // Frequency indicator
          ctx.fillStyle = '#cccccc';
          ctx.font = '8px monospace';
          ctx.fillText(
            `${(node.frequency / 1000).toFixed(1)}k`,
            node.x,
            node.y + node.size + 15
          );
        }
      });
    });

    // Draw fusion events
    const currentTime = Date.now();
    fusionEvents.forEach(fusion => {
      const age = currentTime - fusion.timestamp;
      if (age < 3000) { // Show for 3 seconds
        const alpha = 1 - (age / 3000);
        
        fusion.nodes.forEach(fusionNode => {
          // Fusion explosion effect
          const explosionSize = 20 + (age / 100);
          const explosionGradient = ctx.createRadialGradient(
            fusionNode.x, fusionNode.y, 0,
            fusionNode.x, fusionNode.y, explosionSize
          );
          explosionGradient.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
          explosionGradient.addColorStop(0.3, `rgba(255, 100, 255, ${alpha * 0.8})`);
          explosionGradient.addColorStop(0.7, `rgba(100, 100, 255, ${alpha * 0.5})`);
          explosionGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
          
          ctx.fillStyle = explosionGradient;
          ctx.beginPath();
          ctx.arc(fusionNode.x, fusionNode.y, explosionSize, 0, Math.PI * 2);
          ctx.fill();
        });
        
        // NFT indicator for high-quality fusions
        if (fusion.nftPattern) {
          const centerX = fusion.nodes.reduce((sum, n) => sum + n.x, 0) / fusion.nodes.length;
          const centerY = fusion.nodes.reduce((sum, n) => sum + n.y, 0) / fusion.nodes.length;
          
          ctx.fillStyle = `rgba(255, 215, 0, ${alpha})`;
          ctx.font = '12px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(`Neural DNA: ${fusion.nftPattern}`, centerX, centerY - 30);
        }
      }
    });

    // Draw mixing bridge when tracks are being mixed
    if (mixProgress > 0.1 && mixProgress < 0.9) {
      const bridgeAlpha = Math.sin(mixProgress * Math.PI) * 0.5;
      const bridgeGradient = ctx.createLinearGradient(200, 200, 600, 200);
      bridgeGradient.addColorStop(0, `rgba(255, 255, 255, 0)`);
      bridgeGradient.addColorStop(0.5, `rgba(255, 255, 255, ${bridgeAlpha})`);
      bridgeGradient.addColorStop(1, `rgba(255, 255, 255, 0)`);
      
      ctx.strokeStyle = bridgeGradient;
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(320, 200);
      ctx.lineTo(480, 200);
      ctx.stroke();
      
      // Bridge activity particles
      for (let i = 0; i < 10; i++) {
        const x = 320 + (480 - 320) * (i / 10) + Math.sin(Date.now() * 0.01 + i) * 10;
        const y = 200 + Math.cos(Date.now() * 0.01 + i) * 5;
        
        ctx.fillStyle = `rgba(255, 255, 255, ${bridgeAlpha * Math.random()})`;
        ctx.beginPath();
        ctx.arc(x, y, 2 + Math.random() * 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  };

  const animate = () => {
    updateNetworks();
    detectNetworkFusion();
    drawNetwork();
    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (trackInfo1) {
      const result1 = generateNetwork('deck1', audioDataDeck1, trackInfo1);
      setNetworks(prev => ({ ...prev, deck1: result1.nodes }));
      setConnections(prev => ({ ...prev, deck1: result1.connections }));
    }
  }, [trackInfo1]);

  useEffect(() => {
    if (trackInfo2) {
      const result2 = generateNetwork('deck2', audioDataDeck2, trackInfo2);
      setNetworks(prev => ({ ...prev, deck2: result2.nodes }));
      setConnections(prev => ({ ...prev, deck2: result2.connections }));
    }
  }, [trackInfo2]);

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
  }, [isPlaying1, isPlaying2, networks, connections, mixProgress]);

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height: '400px',
    background: 'linear-gradient(135deg, rgba(5,5,20,1) 0%, rgba(15,5,25,1) 100%)',
    borderRadius: '12px',
    overflow: 'hidden',
    border: '1px solid rgba(100,100,255,0.3)'
  };

  const networkStatsStyle: React.CSSProperties = {
    position: 'absolute',
    top: '10px',
    left: '10px',
    background: 'rgba(0,0,0,0.8)',
    padding: '10px',
    borderRadius: '6px',
    fontSize: '12px',
    color: '#fff',
    zIndex: 10
  };

  const neuralActivityStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '10px',
    right: '10px',
    background: 'rgba(0,0,0,0.8)',
    padding: '8px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    color: '#fff',
    zIndex: 10
  };

  return (
    <div style={containerStyle}>
      <div style={networkStatsStyle}>
        <div><strong>Neural Networks</strong></div>
        <div>Deck 1 Nodes: {networks.deck1.length}</div>
        <div>Deck 2 Nodes: {networks.deck2.length}</div>
        <div>Total Connections: {connections.deck1.length + connections.deck2.length}</div>
        <div>Fusion Events: {fusionEvents.length}</div>
        <div>Mix Progress: {(mixProgress * 100).toFixed(1)}%</div>
      </div>
      
      <div style={neuralActivityStyle}>
        <div>Neural Activity: {(neuralActivity * 100).toFixed(1)}%</div>
        <div style={{
          width: '100px',
          height: '6px',
          background: 'rgba(255,255,255,0.2)',
          borderRadius: '3px',
          marginTop: '4px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${neuralActivity * 100}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #4444ff, #ff44ff)',
            transition: 'width 0.3s ease'
          }} />
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

export default SynapticSoundNetworks;