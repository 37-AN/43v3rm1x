import React, { useEffect, useRef, useState } from 'react';

interface TerrainPoint {
  x: number;
  y: number;
  z: number;
  baseHeight: number;
  audioInfluence: number;
  blockchainActivity: number;
}

interface BlockchainTransaction {
  type: 'token_reward' | 'royalty_payment' | 'nft_trade';
  amount: number;
  timestamp: number;
  x: number;
  y: number;
  intensity: number;
}

interface BlockchainBeatSculptorProps {
  audioData?: number[];
  isPlaying: boolean;
  genre: string;
  energy: number;
  tokenBalance: number;
  recentTransactions: BlockchainTransaction[];
  royaltyPayments: { artist: string; amount: number; timestamp: number }[];
}

const BlockchainBeatSculptor: React.FC<BlockchainBeatSculptorProps> = ({
  audioData = [],
  isPlaying,
  genre,
  energy,
  tokenBalance,
  recentTransactions = [],
  royaltyPayments = []
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const [terrain, setTerrain] = useState<TerrainPoint[][]>([]);
  const [transactionStreams, setTransactionStreams] = useState<BlockchainTransaction[]>([]);
  const [landscapeTheme, setLandscapeTheme] = useState<string>('default');

  const terrainSize = 40;
  const terrainScale = 8;

  // Genre-based landscape themes
  const genreThemes: { [key: string]: { baseColor: string; accent: string; roughness: number } } = {
    'House': { baseColor: 'hsl(240, 60%, 40%)', accent: 'hsl(280, 80%, 60%)', roughness: 0.3 },
    'Techno': { baseColor: 'hsl(0, 60%, 30%)', accent: 'hsl(20, 90%, 70%)', roughness: 0.8 },
    'Ambient': { baseColor: 'hsl(180, 40%, 50%)', accent: 'hsl(120, 60%, 80%)', roughness: 0.1 },
    'Drum & Bass': { baseColor: 'hsl(120, 80%, 30%)', accent: 'hsl(60, 100%, 80%)', roughness: 0.9 },
    'default': { baseColor: 'hsl(220, 50%, 40%)', accent: 'hsl(260, 70%, 60%)', roughness: 0.5 }
  };

  const initializeTerrain = () => {
    const newTerrain: TerrainPoint[][] = [];
    const theme = genreThemes[genre] || genreThemes.default;
    
    for (let x = 0; x < terrainSize; x++) {
      newTerrain[x] = [];
      for (let y = 0; y < terrainSize; y++) {
        const baseHeight = Math.sin(x * 0.1) * Math.cos(y * 0.1) * 20 +
                          Math.sin(x * 0.05 + y * 0.05) * 10 +
                          (Math.random() - 0.5) * theme.roughness * 15;
        
        newTerrain[x][y] = {
          x: (x - terrainSize / 2) * terrainScale,
          y: (y - terrainSize / 2) * terrainScale,
          z: baseHeight,
          baseHeight,
          audioInfluence: 0,
          blockchainActivity: 0
        };
      }
    }
    setTerrain(newTerrain);
  };

  const updateTerrain = () => {
    if (!isPlaying || terrain.length === 0) return;

    setTerrain(prevTerrain => 
      prevTerrain.map((row, x) =>
        row.map((point, y) => {
          // Calculate audio influence based on frequency data
          const frequencyIndex = Math.floor((x * y / (terrainSize * terrainSize)) * audioData.length);
          const amplitude = audioData[frequencyIndex] || 0;
          const bassInfluence = audioData[Math.floor(audioData.length * 0.1)] || 0;
          const midInfluence = audioData[Math.floor(audioData.length * 0.5)] || 0;
          const trebleInfluence = audioData[Math.floor(audioData.length * 0.9)] || 0;
          
          // Calculate blockchain activity influence
          const blockchainInfluence = recentTransactions.reduce((sum, tx) => {
            const distance = Math.sqrt((tx.x - x) ** 2 + (tx.y - y) ** 2);
            return sum + (tx.intensity / (distance + 1)) * 0.1;
          }, 0);
          
          // Dynamic height calculation
          const audioHeight = bassInfluence * 30 + midInfluence * 15 + trebleInfluence * 10;
          const energyMultiplier = 1 + energy * 0.5;
          
          return {
            ...point,
            z: point.baseHeight + 
                (audioHeight * energyMultiplier) + 
                (blockchainInfluence * 25) +
                Math.sin(Date.now() * 0.001 + x * 0.1 + y * 0.1) * 5,
            audioInfluence: amplitude,
            blockchainActivity: blockchainInfluence
          };
        })
      )
    );
  };

  const updateTransactionStreams = () => {
    const currentTime = Date.now();
    
    // Add new transactions as streams
    const newStreams = recentTransactions
      .filter(tx => currentTime - tx.timestamp < 5000) // Show for 5 seconds
      .map(tx => ({
        ...tx,
        x: Math.random() * terrainSize,
        y: Math.random() * terrainSize,
        intensity: Math.min(tx.amount / 100, 1) // Normalize intensity
      }));
    
    setTransactionStreams(newStreams);
  };

  const drawLandscape = () => {
    const canvas = canvasRef.current;
    if (!canvas || terrain.length === 0) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear with cosmic background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, 'rgba(5, 0, 20, 1)');
    gradient.addColorStop(0.5, 'rgba(10, 5, 30, 1)');
    gradient.addColorStop(1, 'rgba(20, 10, 40, 1)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const perspective = 200;
    const theme = genreThemes[genre] || genreThemes.default;

    // Draw terrain mesh
    for (let x = 0; x < terrainSize - 1; x++) {
      for (let y = 0; y < terrainSize - 1; y++) {
        const point1 = terrain[x][y];
        const point2 = terrain[x + 1][y];
        const point3 = terrain[x][y + 1];
        const point4 = terrain[x + 1][y + 1];

        // 3D to 2D projection
        const project = (point: TerrainPoint) => ({
          x: centerX + (point.x * perspective) / (perspective + point.y + 100),
          y: centerY - (point.z * perspective) / (perspective + point.y + 100)
        });

        const p1 = project(point1);
        const p2 = project(point2);
        const p3 = project(point3);
        const p4 = project(point4);

        // Calculate lighting based on height and audio influence
        const avgHeight = (point1.z + point2.z + point3.z + point4.z) / 4;
        const avgAudio = (point1.audioInfluence + point2.audioInfluence + point3.audioInfluence + point4.audioInfluence) / 4;
        const avgBlockchain = (point1.blockchainActivity + point2.blockchainActivity + point3.blockchainActivity + point4.blockchainActivity) / 4;
        
        const lightness = Math.max(0.2, Math.min(0.8, (avgHeight + 50) / 100));
        const audioGlow = avgAudio * 0.5;
        const blockchainGlow = avgBlockchain * 0.3;
        
        // Color calculation with blockchain influence
        const hueMatch = theme.baseColor.match(/\d+/);
        const hue = parseInt(hueMatch?.[0] || '220') + avgBlockchain * 60;
        const saturation = 60 + audioGlow * 40;
        const brightness = lightness * 100 + audioGlow * 30 + blockchainGlow * 20;
        
        ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${brightness}%, 0.8)`;
        ctx.strokeStyle = `hsla(${hue + 30}, 80%, 70%, ${audioGlow + blockchainGlow})`;
        ctx.lineWidth = 1;

        // Draw quad
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineTo(p4.x, p4.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
    }

    // Draw blockchain transaction streams
    transactionStreams.forEach(stream => {
      const streamX = centerX + (stream.x - terrainSize / 2) * 10;
      const streamY = centerY + (stream.y - terrainSize / 2) * 10;
      
      // Draw flowing river of light
      const streamLength = 50;
      const segments = 20;
      
      for (let i = 0; i < segments; i++) {
        const progress = i / segments;
        const x = streamX + Math.sin(Date.now() * 0.005 + progress * Math.PI * 2) * 20;
        const y = streamY - progress * streamLength;
        const size = stream.intensity * 5 * (1 - progress);
        const opacity = stream.intensity * (1 - progress);
        
        const streamColor = stream.type === 'token_reward' ? 'gold' : 
                           stream.type === 'royalty_payment' ? 'cyan' : 'magenta';
        
        ctx.fillStyle = `hsla(${streamColor === 'gold' ? '45' : streamColor === 'cyan' ? '180' : '300'}, 80%, 60%, ${opacity})`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw connecting lines
        if (i > 0) {
          const prevX = streamX + Math.sin(Date.now() * 0.005 + (progress - 1/segments) * Math.PI * 2) * 20;
          const prevY = streamY - (progress - 1/segments) * streamLength;
          
          ctx.strokeStyle = `hsla(${streamColor === 'gold' ? '45' : streamColor === 'cyan' ? '180' : '300'}, 60%, 50%, ${opacity * 0.5})`;
          ctx.lineWidth = stream.intensity * 2;
          ctx.beginPath();
          ctx.moveTo(prevX, prevY);
          ctx.lineTo(x, y);
          ctx.stroke();
        }
      }
    });

    // Draw token balance indicator as a floating crystal
    const crystalX = centerX + Math.sin(Date.now() * 0.002) * 100;
    const crystalY = 50 + Math.cos(Date.now() * 0.003) * 20;
    const crystalSize = 15 + (tokenBalance / 1000) * 10;
    
    const validCrystalX = isFinite(crystalX) ? crystalX : centerX;
    const validCrystalY = isFinite(crystalY) ? crystalY : 50;
    const validCrystalSize = Math.max(1, crystalSize || 15);
    
    const crystalGradient = ctx.createRadialGradient(validCrystalX, validCrystalY, 0, validCrystalX, validCrystalY, validCrystalSize);
    crystalGradient.addColorStop(0, 'hsla(45, 100%, 80%, 0.9)');
    crystalGradient.addColorStop(0.7, 'hsla(45, 80%, 60%, 0.6)');
    crystalGradient.addColorStop(1, 'hsla(45, 60%, 40%, 0.3)');
    
    ctx.fillStyle = crystalGradient;
    ctx.beginPath();
    ctx.arc(validCrystalX, validCrystalY, validCrystalSize, 0, Math.PI * 2);
    ctx.fill();
    
    // Crystal glow
    ctx.strokeStyle = `hsla(45, 100%, 70%, 0.5)`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(crystalX, crystalY, crystalSize + 5, 0, Math.PI * 2);
    ctx.stroke();
  };

  const animate = () => {
    updateTerrain();
    updateTransactionStreams();
    drawLandscape();
    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    initializeTerrain();
    setLandscapeTheme(genre);
  }, [genre]);

  useEffect(() => {
    const animateLoop = () => {
      updateTerrain();
      updateTransactionStreams();
      drawLandscape();
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
  }, [isPlaying, audioData, terrain, recentTransactions]);

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height: '350px',
    background: 'linear-gradient(135deg, rgba(5,0,20,1) 0%, rgba(20,10,40,1) 100%)',
    borderRadius: '12px',
    overflow: 'hidden',
    border: '1px solid rgba(255,255,255,0.1)'
  };

  const statsOverlayStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '10px',
    left: '10px',
    background: 'rgba(0,0,0,0.7)',
    padding: '8px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    color: '#fff',
    zIndex: 10
  };

  const themeIndicatorStyle: React.CSSProperties = {
    position: 'absolute',
    top: '10px',
    left: '10px',
    background: 'rgba(0,0,0,0.7)',
    padding: '6px 10px',
    borderRadius: '4px',
    fontSize: '11px',
    color: genreThemes[genre]?.accent || '#fff',
    border: `1px solid ${genreThemes[genre]?.accent || '#666'}`,
    zIndex: 10
  };

  return (
    <div style={containerStyle}>
      <div style={themeIndicatorStyle}>
        🎵 {genre} Landscape
      </div>
      
      <div style={statsOverlayStyle}>
        <div>Energy: {(energy * 100).toFixed(1)}%</div>
        <div>Token Balance: {tokenBalance}</div>
        <div>Active Streams: {transactionStreams.length}</div>
        <div>Recent Payments: {royaltyPayments.length}</div>
      </div>
      
      <canvas
        ref={canvasRef}
        width={800}
        height={350}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default BlockchainBeatSculptor;