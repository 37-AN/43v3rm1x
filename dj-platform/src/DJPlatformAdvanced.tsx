import React, { useState, useEffect, useCallback } from 'react';
import { 
  Play, Pause, Zap, Coins, TrendingUp, Music, Disc3, Eye, 
  Atom, Network, Cpu, Shuffle, Settings, Menu,
  X, Maximize2, Minimize2, Home, Headphones,
  Mic, Radio, Wifi, Battery
} from 'lucide-react';

// Import all visualizers
import NeuralHarmonyConstellation from './visualizers/NeuralHarmonyConstellation';
import BlockchainBeatSculptor from './visualizers/BlockchainBeatSculptor';
import QuantumMixReactor from './visualizers/QuantumMixReactor';
import SynapticSoundNetworks from './visualizers/SynapticSoundNetworks';
import HolographicDNASequencer from './visualizers/HolographicDNASequencer';
import CyberneticEcosystem from './visualizers/CyberneticEcosystem';
import TemporalRiftGenerator from './visualizers/TemporalRiftGenerator';

interface Track {
  id: number;
  name: string;
  artist: string;
  bpm: number;
  key: string;
  genre: string;
  plays: number;
  duration: string;
  waveform?: number[];
  energy: number;
  mood: string;
}

const DJPlatformAdvanced = () => {
  // Core state
  const [isPlaying, setIsPlaying] = useState<{[key: string]: boolean}>({ deck1: false, deck2: false });
  const [crossfaderPosition, setCrossfaderPosition] = useState(50);
  const [tempo, setTempo] = useState<{[key: string]: number}>({ deck1: 128, deck2: 132 });
  const [volume, setVolume] = useState<{[key: string]: number}>({ deck1: 80, deck2: 80 });
  const [gain, setGain] = useState<{[key: string]: number}>({ deck1: 0, deck2: 0 });
  const [eq, setEq] = useState<{[key: string]: {high: number, mid: number, low: number}}>({
    deck1: { high: 50, mid: 50, low: 50 },
    deck2: { high: 50, mid: 50, low: 50 }
  });
  
  // UI state
  const [activeTab, setActiveTab] = useState('mixer');
  const [activeVisualizer, setActiveVisualizer] = useState('dna');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'cyber' | 'neon'>('cyber');
  
  // Advanced features
  const [aiSyncEnabled, setAiSyncEnabled] = useState(false);
  const [autoMixEnabled, setAutoMixEnabled] = useState(false);
  const [beatSyncEnabled, setBeatSyncEnabled] = useState(false);
  const [recordingEnabled, setRecordingEnabled] = useState(false);
  const [liveStreamEnabled, setLiveStreamEnabled] = useState(false);
  
  // Performance state
  const [tokenBalance, setTokenBalance] = useState(1250);
  const [earnings] = useState(89.50);
  const [performance, setPerformance] = useState({
    seamlessTransitions: 0,
    crowdResponse: 85,
    trackCompatibility: 92,
    energyFlow: 78
  });

  // Enhanced track library
  const [tracks] = useState<Track[]>([
    { 
      id: 1, name: "Cyberpunk Nights", artist: "Neo Tokyo", bpm: 128, key: "Am", 
      genre: "Synthwave", plays: 15420, duration: "4:32", energy: 85, mood: "Dark"
    },
    { 
      id: 2, name: "Digital Dreams", artist: "Pixel Prophet", bpm: 132, key: "Gm", 
      genre: "Techno", plays: 8932, duration: "6:45", energy: 92, mood: "Energetic"
    },
    { 
      id: 3, name: "Neural Pathways", artist: "AI Collective", bpm: 124, key: "C", 
      genre: "Ambient", plays: 12104, duration: "5:18", energy: 60, mood: "Ethereal"
    },
    { 
      id: 4, name: "Quantum Bass", artist: "Frequency Labs", bpm: 140, key: "F#", 
      genre: "Dubstep", plays: 22341, duration: "3:55", energy: 98, mood: "Aggressive"
    },
    { 
      id: 5, name: "Holographic Love", artist: "Virtual Hearts", bpm: 110, key: "Em", 
      genre: "Future R&B", plays: 18765, duration: "4:12", energy: 70, mood: "Romantic"
    },
    { 
      id: 6, name: "Temporal Shift", artist: "Chronos DJ", bpm: 175, key: "Bb", 
      genre: "Drum & Bass", plays: 31254, duration: "5:33", energy: 95, mood: "Intense"
    }
  ]);

  const [loadedTracks, setLoadedTracks] = useState({ deck1: tracks[0], deck2: tracks[1] });
  
  // Audio simulation
  const [audioData, setAudioData] = useState<{deck1: number[]; deck2: number[]}>({
    deck1: Array.from({ length: 256 }, () => Math.random()),
    deck2: Array.from({ length: 256 }, () => Math.random())
  });

  // Blockchain & social features
  const [recentTransactions] = useState<any[]>([]);
  const [royaltyPayments] = useState<any[]>([
    { artist: "Neo Tokyo", amount: 15.5, timestamp: Date.now() - 7200000 },
    { artist: "Pixel Prophet", amount: 8.2, timestamp: Date.now() - 3600000 }
  ]);
  const [aiPredictions] = useState<any[]>([
    { mixPoint: 65, confidence: 0.85, harmonicMatch: 0.92 },
    { mixPoint: 35, confidence: 0.72, harmonicMatch: 0.78 }
  ]);

  // Responsive design detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Enhanced audio simulation
  useEffect(() => {
    const updateAudioData = () => {
      if (isPlaying.deck1 || isPlaying.deck2) {
        const time = Date.now() * 0.001;
        
        setAudioData({
          deck1: isPlaying.deck1 ? Array.from({ length: 256 }, (_, i) => {
            const baseFreq = Math.sin(time * (tempo.deck1 / 60) + i * 0.1) * 0.4;
            const harmonics = Math.sin(time * 2 + i * 0.05) * 0.3;
            const noise = Math.random() * 0.3;
            const eqInfluence = (eq.deck1.low + eq.deck1.mid + eq.deck1.high) / 150;
            return Math.max(0, (baseFreq + harmonics + noise) * (volume.deck1 / 100) * eqInfluence);
          }) : Array.from({ length: 256 }, () => 0),
          deck2: isPlaying.deck2 ? Array.from({ length: 256 }, (_, i) => {
            const baseFreq = Math.sin(time * (tempo.deck2 / 60) * 1.1 + i * 0.12) * 0.4;
            const harmonics = Math.cos(time * 1.8 + i * 0.06) * 0.3;
            const noise = Math.random() * 0.3;
            const eqInfluence = (eq.deck2.low + eq.deck2.mid + eq.deck2.high) / 150;
            return Math.max(0, (baseFreq + harmonics + noise) * (volume.deck2 / 100) * eqInfluence);
          }) : Array.from({ length: 256 }, () => 0)
        });
      }
    };

    const interval = setInterval(updateAudioData, 30); // 33fps for smooth visuals
    return () => clearInterval(interval);
  }, [isPlaying, tempo, volume, eq]);

  // AI-powered features
  useEffect(() => {
    if (aiSyncEnabled && loadedTracks.deck1 && loadedTracks.deck2) {
      const avgBPM = (loadedTracks.deck1.bpm + loadedTracks.deck2.bpm) / 2;
      setTempo({ deck1: avgBPM, deck2: avgBPM });
      
      // Auto-adjust EQ for harmonic mixing
      const keyCompatibility = calculateKeyCompatibility(loadedTracks.deck1.key, loadedTracks.deck2.key);
      if (keyCompatibility > 0.8) {
        setBeatSyncEnabled(true);
      }
    }
  }, [aiSyncEnabled, loadedTracks]);

  // Performance tracking
  useEffect(() => {
    const updatePerformance = () => {
      if (isPlaying.deck1 || isPlaying.deck2) {
        const bpmSync = Math.max(0, 1 - Math.abs(tempo.deck1 - tempo.deck2) / 20);
        // const volumeBalance = 1 - Math.abs(volume.deck1 - volume.deck2) / 100;
        // const crossfaderUse = Math.abs(crossfaderPosition - 50) / 50;
        
        setPerformance(prev => ({
          seamlessTransitions: Math.min(100, prev.seamlessTransitions + bpmSync * 2),
          crowdResponse: 70 + Math.random() * 30,
          trackCompatibility: calculateKeyCompatibility(loadedTracks.deck1.key, loadedTracks.deck2.key) * 100,
          energyFlow: (loadedTracks.deck1.energy + loadedTracks.deck2.energy) / 2
        }));
      }
    };

    const interval = setInterval(updatePerformance, 2000);
    return () => clearInterval(interval);
  }, [isPlaying, tempo, volume, crossfaderPosition, loadedTracks]);

  // Utility functions
  const calculateKeyCompatibility = (key1: string, key2: string) => {
    const keyMap: {[key: string]: number} = {
      'C': 0, 'C#': 1, 'D': 2, 'D#': 3, 'E': 4, 'F': 5,
      'F#': 6, 'G': 7, 'G#': 8, 'A': 9, 'A#': 10, 'B': 11,
      'Am': 9, 'Gm': 7, 'Dm': 2, 'Em': 4
    };
    
    const diff = Math.abs((keyMap[key1] || 0) - (keyMap[key2] || 0));
    return Math.max(0, 1 - diff / 6);
  };

  const handlePlay = useCallback((deck: string) => {
    setIsPlaying(prev => ({ ...prev, [deck]: !prev[deck] }));
    if (!isPlaying[deck]) {
      setTokenBalance(prev => prev + 5);
    }
  }, [isPlaying]);

  const loadTrack = useCallback((track: Track, deck: string) => {
    setLoadedTracks(prev => ({ ...prev, [deck]: track }));
  }, []);

  // Theme styles
  const themes = {
    dark: {
      primary: '#1a1a1a',
      secondary: '#2d3748',
      accent: '#3182ce',
      text: '#ffffff',
      border: 'rgba(255,255,255,0.1)'
    },
    cyber: {
      primary: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
      secondary: 'rgba(0, 255, 255, 0.1)',
      accent: '#00ffff',
      text: '#00ffff',
      border: 'rgba(0, 255, 255, 0.3)'
    },
    neon: {
      primary: 'linear-gradient(135deg, #1a0033 0%, #330066 50%, #660099 100%)',
      secondary: 'rgba(255, 0, 255, 0.1)',
      accent: '#ff00ff',
      text: '#ffffff',
      border: 'rgba(255, 0, 255, 0.3)'
    }
  };

  const currentTheme = themes[theme];

  // Styles
  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    background: currentTheme.primary,
    color: currentTheme.text,
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    position: 'relative',
    overflow: 'hidden'
  };

  const headerStyle: React.CSSProperties = {
    background: 'rgba(0,0,0,0.3)',
    backdropFilter: 'blur(20px)',
    borderBottom: `1px solid ${currentTheme.border}`,
    padding: isMobile ? '12px 16px' : '16px 24px',
    position: 'sticky',
    top: 0,
    zIndex: 100
  };

  const cardStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    padding: isMobile ? '16px' : '24px',
    border: `1px solid ${currentTheme.border}`,
    margin: isMobile ? '8px 0' : '16px 0',
    boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
    transition: 'all 0.3s ease'
  };

  const buttonStyle: React.CSSProperties = {
    padding: isMobile ? '8px 16px' : '12px 24px',
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: isMobile ? '14px' : '16px',
    transition: 'all 0.3s ease',
    backdropFilter: 'blur(10px)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  const visualizers = [
    { id: 'dna', name: 'DNA Sequencer', icon: <Atom size={16} />, component: HolographicDNASequencer },
    { id: 'ecosystem', name: 'Cyber Ecosystem', icon: <Network size={16} />, component: CyberneticEcosystem },
    { id: 'temporal', name: 'Time Rifts', icon: <Zap size={16} />, component: TemporalRiftGenerator },
    { id: 'constellation', name: 'Neural Stars', icon: <Disc3 size={16} />, component: NeuralHarmonyConstellation },
    { id: 'sculptor', name: 'Beat Sculptor', icon: <TrendingUp size={16} />, component: BlockchainBeatSculptor },
    { id: 'reactor', name: 'Quantum Mix', icon: <Cpu size={16} />, component: QuantumMixReactor },
    { id: 'networks', name: 'Sound Networks', icon: <Radio size={16} />, component: SynapticSoundNetworks }
  ];

  const ActiveVisualizerComponent = visualizers.find(v => v.id === activeVisualizer)?.component || HolographicDNASequencer;

  return (
    <div style={containerStyle}>
      {/* Enhanced Header */}
      <header style={headerStyle}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          maxWidth: '1400px', 
          margin: '0 auto' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {isMobile && (
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                style={{
                  ...buttonStyle,
                  background: 'rgba(255,255,255,0.1)',
                  color: currentTheme.text,
                  padding: '8px'
                }}
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            )}
            
            <Disc3 size={isMobile ? 28 : 32} color={currentTheme.accent} />
            <h1 style={{ 
              fontSize: isMobile ? '20px' : '28px', 
              fontWeight: 'bold', 
              background: `linear-gradient(135deg, ${currentTheme.accent}, #fff)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              MixChain AI Pro
            </h1>
          </div>
          
          {!isMobile && (
            <nav style={{ display: 'flex', gap: '8px' }}>
              {['mixer', 'library', 'blockchain', 'settings'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    ...buttonStyle,
                    background: activeTab === tab ? currentTheme.accent : 'rgba(255,255,255,0.1)',
                    color: activeTab === tab ? '#000' : currentTheme.text
                  }}
                >
                  {tab === 'mixer' && <Disc3 size={16} />}
                  {tab === 'library' && <Music size={16} />}
                  {tab === 'blockchain' && <Coins size={16} />}
                  {tab === 'settings' && <Settings size={16} />}
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Status indicators */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {liveStreamEnabled && <Radio size={16} color="#ff4444" />}
              {recordingEnabled && <Mic size={16} color="#ff0000" />}
              <Wifi size={16} color="#00ff00" />
              <Battery size={16} color="#00ff00" />
            </div>
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              background: 'rgba(0,0,0,0.3)', 
              padding: '8px 12px', 
              borderRadius: '12px',
              border: `1px solid ${currentTheme.border}`
            }}>
              <Coins size={16} color="#fbbf24" />
              <span style={{ fontFamily: 'monospace', color: '#fbbf24' }}>{tokenBalance}</span>
            </div>
            
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              style={{
                ...buttonStyle,
                background: 'rgba(255,255,255,0.1)',
                color: currentTheme.text,
                padding: '8px'
              }}
            >
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobile && isMobileMenuOpen && (
        <div style={{
          position: 'fixed',
          top: '60px',
          left: 0,
          right: 0,
          background: 'rgba(0,0,0,0.95)',
          backdropFilter: 'blur(20px)',
          zIndex: 99,
          padding: '20px',
          borderBottom: `1px solid ${currentTheme.border}`
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {['mixer', 'library', 'blockchain', 'settings'].map(tab => (
              <button 
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setIsMobileMenuOpen(false);
                }}
                style={{
                  ...buttonStyle,
                  background: activeTab === tab ? currentTheme.accent : 'rgba(255,255,255,0.1)',
                  color: activeTab === tab ? '#000' : currentTheme.text,
                  justifyContent: 'flex-start',
                  width: '100%'
                }}
              >
                {tab === 'mixer' && <Disc3 size={16} />}
                {tab === 'library' && <Music size={16} />}
                {tab === 'blockchain' && <Coins size={16} />}
                {tab === 'settings' && <Settings size={16} />}
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}

      <div style={{ 
        maxWidth: '1400px', 
        margin: '0 auto', 
        padding: isMobile ? '16px 12px' : '32px 24px',
        marginTop: isMobile && isMobileMenuOpen ? '200px' : '0'
      }}>
        {activeTab === 'mixer' && (
          <div>
            {/* AI Controls */}
            <div style={cardStyle}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                marginBottom: '16px',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <h2 style={{ 
                  fontSize: isMobile ? '18px' : '20px', 
                  fontWeight: 'bold', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  color: currentTheme.accent
                }}>
                  <Zap size={20} />
                  AI Neural Engine
                </h2>
                
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => setAiSyncEnabled(!aiSyncEnabled)}
                    style={{
                      ...buttonStyle,
                      background: aiSyncEnabled ? '#10b981' : 'rgba(255,255,255,0.1)',
                      color: 'white',
                      fontSize: isMobile ? '12px' : '14px'
                    }}
                  >
                    <Zap size={14} />
                    AI Sync {aiSyncEnabled ? 'ON' : 'OFF'}
                  </button>
                  
                  <button
                    onClick={() => setAutoMixEnabled(!autoMixEnabled)}
                    style={{
                      ...buttonStyle,
                      background: autoMixEnabled ? '#8b5cf6' : 'rgba(255,255,255,0.1)',
                      color: 'white',
                      fontSize: isMobile ? '12px' : '14px'
                    }}
                  >
                    <Shuffle size={14} />
                    Auto Mix
                  </button>
                  
                  <button
                    onClick={() => setBeatSyncEnabled(!beatSyncEnabled)}
                    style={{
                      ...buttonStyle,
                      background: beatSyncEnabled ? '#f59e0b' : 'rgba(255,255,255,0.1)',
                      color: 'white',
                      fontSize: isMobile ? '12px' : '14px'
                    }}
                  >
                    <Radio size={14} />
                    Beat Sync
                  </button>
                </div>
              </div>
              
              {/* Performance Metrics */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', 
                gap: '12px',
                marginBottom: '16px'
              }}>
                <div style={{
                  background: 'rgba(16, 185, 129, 0.2)',
                  padding: '12px',
                  borderRadius: '12px',
                  border: '1px solid #10b981'
                }}>
                  <div style={{ fontSize: '12px', color: '#10b981' }}>Transitions</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{performance.seamlessTransitions.toFixed(0)}%</div>
                </div>
                <div style={{
                  background: 'rgba(59, 130, 246, 0.2)',
                  padding: '12px',
                  borderRadius: '12px',
                  border: '1px solid #3b82f6'
                }}>
                  <div style={{ fontSize: '12px', color: '#3b82f6' }}>Crowd Response</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{performance.crowdResponse.toFixed(0)}%</div>
                </div>
                <div style={{
                  background: 'rgba(139, 92, 246, 0.2)',
                  padding: '12px',
                  borderRadius: '12px',
                  border: '1px solid #8b5cf6'
                }}>
                  <div style={{ fontSize: '12px', color: '#8b5cf6' }}>Compatibility</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{performance.trackCompatibility.toFixed(0)}%</div>
                </div>
                <div style={{
                  background: 'rgba(245, 158, 11, 0.2)',
                  padding: '12px',
                  borderRadius: '12px',
                  border: '1px solid #f59e0b'
                }}>
                  <div style={{ fontSize: '12px', color: '#f59e0b' }}>Energy Flow</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{performance.energyFlow.toFixed(0)}%</div>
                </div>
              </div>
            </div>

            {/* Enhanced Visualizer Panel */}
            <div style={cardStyle}>
              <h3 style={{ 
                fontSize: isMobile ? '16px' : '18px', 
                fontWeight: 'bold', 
                marginBottom: '16px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                color: currentTheme.accent
              }}>
                <Eye size={20} />
                Advanced Neural Visualizers
              </h3>
              
              <div style={{ 
                display: 'flex', 
                gap: '8px', 
                marginBottom: '16px', 
                flexWrap: 'wrap',
                overflowX: isMobile ? 'scroll' : 'visible'
              }}>
                {visualizers.map(visualizer => (
                  <button
                    key={visualizer.id}
                    onClick={() => setActiveVisualizer(visualizer.id)}
                    style={{
                      ...buttonStyle,
                      background: activeVisualizer === visualizer.id ? currentTheme.accent : 'rgba(255,255,255,0.1)',
                      color: activeVisualizer === visualizer.id ? '#000' : currentTheme.text,
                      fontSize: isMobile ? '12px' : '14px',
                      padding: isMobile ? '6px 12px' : '8px 16px',
                      minWidth: isMobile ? '120px' : 'auto'
                    }}
                  >
                    {visualizer.icon}
                    {visualizer.name}
                  </button>
                ))}
              </div>

              <ActiveVisualizerComponent
                audioDataDeck1={audioData.deck1}
                audioDataDeck2={audioData.deck2}
                isPlaying1={isPlaying.deck1}
                isPlaying2={isPlaying.deck2}
                crossfaderPosition={crossfaderPosition}
                bpm1={tempo.deck1}
                bpm2={tempo.deck2}
                trackInfo1={loadedTracks.deck1}
                trackInfo2={loadedTracks.deck2}
                audioData={[...audioData.deck1, ...audioData.deck2]}
                isPlaying={isPlaying.deck1 || isPlaying.deck2}
                bpm={(tempo.deck1 + tempo.deck2) / 2}
                musicalKey={loadedTracks.deck1?.key || 'C'}
                harmonicCompatibility={calculateKeyCompatibility(loadedTracks.deck1.key, loadedTracks.deck2.key)}
                aiPredictions={aiPredictions}
                genre={loadedTracks.deck1?.genre || 'Electronic'}
                energy={(loadedTracks.deck1.energy + loadedTracks.deck2.energy) / 200}
                tokenBalance={tokenBalance}
                recentTransactions={recentTransactions}
                royaltyPayments={royaltyPayments}
                onCollisionEvent={(event: any) => {
                  if (event.type === 'perfect') {
                    setTokenBalance(prev => prev + 25);
                  }
                }}
                onNetworkFusion={(fusion: any) => {
                  if (fusion.quality > 0.8) {
                    setTokenBalance(prev => prev + 50);
                  }
                }}
                mixProgress={crossfaderPosition / 100}
              />
            </div>

            {/* Enhanced Mixer Interface */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: isMobile ? '1fr' : '1fr auto 1fr', 
              gap: isMobile ? '16px' : '24px', 
              marginTop: '24px' 
            }}>
              {/* Deck 1 */}
              <div style={cardStyle}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', color: currentTheme.accent }}>
                  <Headphones size={20} style={{ marginRight: '8px' }} />
                  Deck A
                </h3>
                
                <div style={{ marginBottom: '16px' }}>
                  <p style={{ fontWeight: 'bold', margin: '4px 0', fontSize: isMobile ? '14px' : '16px' }}>
                    {loadedTracks.deck1?.name}
                  </p>
                  <p style={{ fontSize: '14px', color: '#d1d5db', margin: '4px 0' }}>
                    {loadedTracks.deck1?.artist}
                  </p>
                  <div style={{ 
                    display: 'flex', 
                    gap: '8px', 
                    margin: '8px 0',
                    flexWrap: 'wrap'
                  }}>
                    <span style={{ 
                      fontSize: '12px', 
                      background: 'rgba(59, 130, 246, 0.2)', 
                      padding: '4px 8px', 
                      borderRadius: '6px',
                      border: '1px solid #3b82f6'
                    }}>
                      {loadedTracks.deck1?.bpm} BPM
                    </span>
                    <span style={{ 
                      fontSize: '12px', 
                      background: 'rgba(139, 92, 246, 0.2)', 
                      padding: '4px 8px', 
                      borderRadius: '6px',
                      border: '1px solid #8b5cf6'
                    }}>
                      {loadedTracks.deck1?.key}
                    </span>
                    <span style={{ 
                      fontSize: '12px', 
                      background: 'rgba(16, 185, 129, 0.2)', 
                      padding: '4px 8px', 
                      borderRadius: '6px',
                      border: '1px solid #10b981'
                    }}>
                      {loadedTracks.deck1?.genre}
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={() => handlePlay('deck1')}
                  style={{
                    ...buttonStyle,
                    background: isPlaying.deck1 ? '#ef4444' : '#10b981',
                    color: 'white',
                    marginBottom: '16px',
                    width: '100%',
                    justifyContent: 'center',
                    fontSize: '18px',
                    padding: '16px'
                  }}
                >
                  {isPlaying.deck1 ? <Pause size={24} /> : <Play size={24} />}
                  {isPlaying.deck1 ? 'PAUSE' : 'PLAY'}
                </button>

                {/* Enhanced Controls */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>
                      Tempo: {tempo.deck1.toFixed(1)} BPM
                    </label>
                    <input
                      type="range"
                      min="80"
                      max="180"
                      value={tempo.deck1}
                      onChange={(e) => setTempo(prev => ({ ...prev, deck1: parseFloat(e.target.value) }))}
                      style={{ width: '100%', height: '8px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>
                      Volume: {volume.deck1}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={volume.deck1}
                      onChange={(e) => setVolume(prev => ({ ...prev, deck1: parseInt(e.target.value) }))}
                      style={{ width: '100%', height: '8px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>
                      Gain: {gain.deck1 > 0 ? '+' : ''}{gain.deck1}dB
                    </label>
                    <input
                      type="range"
                      min="-20"
                      max="20"
                      value={gain.deck1}
                      onChange={(e) => setGain(prev => ({ ...prev, deck1: parseInt(e.target.value) }))}
                      style={{ width: '100%', height: '8px' }}
                    />
                  </div>

                  {/* EQ Controls */}
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr 1fr', 
                    gap: '8px',
                    marginTop: '12px'
                  }}>
                    <div>
                      <label style={{ fontSize: '12px' }}>HIGH</label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={eq.deck1.high}
                        onChange={(e) => setEq(prev => ({ 
                          ...prev, 
                          deck1: { ...prev.deck1, high: parseInt(e.target.value) }
                        }))}
                        style={{ width: '100%' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px' }}>MID</label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={eq.deck1.mid}
                        onChange={(e) => setEq(prev => ({ 
                          ...prev, 
                          deck1: { ...prev.deck1, mid: parseInt(e.target.value) }
                        }))}
                        style={{ width: '100%' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px' }}>LOW</label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={eq.deck1.low}
                        onChange={(e) => setEq(prev => ({ 
                          ...prev, 
                          deck1: { ...prev.deck1, low: parseInt(e.target.value) }
                        }))}
                        style={{ width: '100%' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Crossfader */}
              {!isMobile && (
                <div style={{ ...cardStyle, minWidth: '200px', textAlign: 'center' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', color: currentTheme.accent }}>
                    Neural Crossfader
                  </h3>
                  
                  <div style={{ marginBottom: '32px', position: 'relative' }}>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={crossfaderPosition}
                      onChange={(e) => setCrossfaderPosition(parseInt(e.target.value))}
                      style={{ 
                        width: '100%', 
                        height: '8px',
                        transform: 'rotate(90deg)',
                        margin: '60px 0'
                      }}
                    />
                    
                    {/* AI Prediction Indicators */}
                    {aiPredictions.map((prediction, i) => (
                      <div
                        key={i}
                        style={{
                          position: 'absolute',
                          left: '50%',
                          top: `${30 + (prediction.mixPoint / 100) * 120}px`,
                          transform: 'translateX(-50%)',
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          background: `rgba(0, 255, 0, ${prediction.confidence})`,
                          border: '2px solid #00ff00'
                        }}
                      />
                    ))}
                  </div>

                  <div style={{ fontSize: '24px', fontFamily: 'monospace', margin: '16px 0', color: currentTheme.accent }}>
                    {crossfaderPosition}%
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#9ca3af' }}>
                    <span>A</span>
                    <span>B</span>
                  </div>
                </div>
              )}

              {/* Deck 2 - Similar to Deck 1 but mirrored */}
              <div style={cardStyle}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', color: currentTheme.accent }}>
                  <Headphones size={20} style={{ marginRight: '8px' }} />
                  Deck B
                </h3>
                
                <div style={{ marginBottom: '16px' }}>
                  <p style={{ fontWeight: 'bold', margin: '4px 0', fontSize: isMobile ? '14px' : '16px' }}>
                    {loadedTracks.deck2?.name}
                  </p>
                  <p style={{ fontSize: '14px', color: '#d1d5db', margin: '4px 0' }}>
                    {loadedTracks.deck2?.artist}
                  </p>
                  <div style={{ 
                    display: 'flex', 
                    gap: '8px', 
                    margin: '8px 0',
                    flexWrap: 'wrap'
                  }}>
                    <span style={{ 
                      fontSize: '12px', 
                      background: 'rgba(59, 130, 246, 0.2)', 
                      padding: '4px 8px', 
                      borderRadius: '6px',
                      border: '1px solid #3b82f6'
                    }}>
                      {loadedTracks.deck2?.bpm} BPM
                    </span>
                    <span style={{ 
                      fontSize: '12px', 
                      background: 'rgba(139, 92, 246, 0.2)', 
                      padding: '4px 8px', 
                      borderRadius: '6px',
                      border: '1px solid #8b5cf6'
                    }}>
                      {loadedTracks.deck2?.key}
                    </span>
                    <span style={{ 
                      fontSize: '12px', 
                      background: 'rgba(16, 185, 129, 0.2)', 
                      padding: '4px 8px', 
                      borderRadius: '6px',
                      border: '1px solid #10b981'
                    }}>
                      {loadedTracks.deck2?.genre}
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={() => handlePlay('deck2')}
                  style={{
                    ...buttonStyle,
                    background: isPlaying.deck2 ? '#ef4444' : '#10b981',
                    color: 'white',
                    marginBottom: '16px',
                    width: '100%',
                    justifyContent: 'center',
                    fontSize: '18px',
                    padding: '16px'
                  }}
                >
                  {isPlaying.deck2 ? <Pause size={24} /> : <Play size={24} />}
                  {isPlaying.deck2 ? 'PAUSE' : 'PLAY'}
                </button>

                {/* Enhanced Controls for Deck 2 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>
                      Tempo: {tempo.deck2.toFixed(1)} BPM
                    </label>
                    <input
                      type="range"
                      min="80"
                      max="180"
                      value={tempo.deck2}
                      onChange={(e) => setTempo(prev => ({ ...prev, deck2: parseFloat(e.target.value) }))}
                      style={{ width: '100%', height: '8px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>
                      Volume: {volume.deck2}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={volume.deck2}
                      onChange={(e) => setVolume(prev => ({ ...prev, deck2: parseInt(e.target.value) }))}
                      style={{ width: '100%', height: '8px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>
                      Gain: {gain.deck2 > 0 ? '+' : ''}{gain.deck2}dB
                    </label>
                    <input
                      type="range"
                      min="-20"
                      max="20"
                      value={gain.deck2}
                      onChange={(e) => setGain(prev => ({ ...prev, deck2: parseInt(e.target.value) }))}
                      style={{ width: '100%', height: '8px' }}
                    />
                  </div>

                  {/* EQ Controls */}
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr 1fr', 
                    gap: '8px',
                    marginTop: '12px'
                  }}>
                    <div>
                      <label style={{ fontSize: '12px' }}>HIGH</label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={eq.deck2.high}
                        onChange={(e) => setEq(prev => ({ 
                          ...prev, 
                          deck2: { ...prev.deck2, high: parseInt(e.target.value) }
                        }))}
                        style={{ width: '100%' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px' }}>MID</label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={eq.deck2.mid}
                        onChange={(e) => setEq(prev => ({ 
                          ...prev, 
                          deck2: { ...prev.deck2, mid: parseInt(e.target.value) }
                        }))}
                        style={{ width: '100%' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px' }}>LOW</label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={eq.deck2.low}
                        onChange={(e) => setEq(prev => ({ 
                          ...prev, 
                          deck2: { ...prev.deck2, low: parseInt(e.target.value) }
                        }))}
                        style={{ width: '100%' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Crossfader */}
            {isMobile && (
              <div style={{ ...cardStyle, textAlign: 'center' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', color: currentTheme.accent }}>
                  Neural Crossfader
                </h3>
                
                <div style={{ marginBottom: '16px' }}>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={crossfaderPosition}
                    onChange={(e) => setCrossfaderPosition(parseInt(e.target.value))}
                    style={{ width: '100%', height: '12px' }}
                  />
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#9ca3af', marginTop: '8px' }}>
                    <span>Deck A</span>
                    <span style={{ fontSize: '18px', color: currentTheme.accent }}>{crossfaderPosition}%</span>
                    <span>Deck B</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Enhanced Library Tab */}
        {activeTab === 'library' && (
          <div style={cardStyle}>
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: 'bold', 
              marginBottom: '16px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              color: currentTheme.accent
            }}>
              <Music size={20} />
              AI-Enhanced Music Library
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {tracks.map(track => (
                <div key={track.id} style={{ 
                  background: 'rgba(255,255,255,0.05)', 
                  borderRadius: '12px', 
                  padding: isMobile ? '12px' : '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  border: `1px solid ${currentTheme.border}`,
                  flexDirection: isMobile ? 'column' : 'row',
                  gap: isMobile ? '12px' : '0'
                }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 'bold', margin: '0 0 4px 0', fontSize: isMobile ? '14px' : '16px' }}>
                      {track.name}
                    </p>
                    <p style={{ color: '#d1d5db', fontSize: '14px', margin: '0 0 8px 0' }}>
                      {track.artist} • {track.duration}
                    </p>
                    
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
                      <span style={{ 
                        fontSize: '12px', 
                        background: 'rgba(59, 130, 246, 0.2)', 
                        padding: '4px 8px', 
                        borderRadius: '6px',
                        border: '1px solid #3b82f6'
                      }}>
                        {track.bpm} BPM
                      </span>
                      <span style={{ 
                        fontSize: '12px', 
                        background: 'rgba(139, 92, 246, 0.2)', 
                        padding: '4px 8px', 
                        borderRadius: '6px',
                        border: '1px solid #8b5cf6'
                      }}>
                        {track.key}
                      </span>
                      <span style={{ 
                        fontSize: '12px', 
                        background: 'rgba(16, 185, 129, 0.2)', 
                        padding: '4px 8px', 
                        borderRadius: '6px',
                        border: '1px solid #10b981'
                      }}>
                        {track.genre}
                      </span>
                      <span style={{ 
                        fontSize: '12px', 
                        background: 'rgba(245, 158, 11, 0.2)', 
                        padding: '4px 8px', 
                        borderRadius: '6px',
                        border: '1px solid #f59e0b'
                      }}>
                        {track.energy}% Energy
                      </span>
                    </div>
                    
                    <p style={{ color: '#9ca3af', fontSize: '12px', margin: '0' }}>
                      {track.plays.toLocaleString()} plays • {track.mood}
                    </p>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '8px', flexDirection: isMobile ? 'row' : 'column' }}>
                    <button
                      onClick={() => loadTrack(track, 'deck1')}
                      style={{
                        ...buttonStyle,
                        background: '#3b82f6',
                        color: 'white',
                        fontSize: '12px',
                        padding: '8px 16px'
                      }}
                    >
                      <Headphones size={14} />
                      Deck A
                    </button>
                    <button
                      onClick={() => loadTrack(track, 'deck2')}
                      style={{
                        ...buttonStyle,
                        background: '#8b5cf6',
                        color: 'white',
                        fontSize: '12px',
                        padding: '8px 16px'
                      }}
                    >
                      <Headphones size={14} />
                      Deck B
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Enhanced Blockchain Tab */}
        {activeTab === 'blockchain' && (
          <div style={cardStyle}>
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: 'bold', 
              marginBottom: '16px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              color: currentTheme.accent
            }}>
              <Coins size={20} />
              Blockchain Analytics & Rewards
            </h3>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', 
              gap: '16px', 
              marginBottom: '24px' 
            }}>
              <div style={{ 
                background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', 
                borderRadius: '16px', 
                padding: '20px',
                color: '#000'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Coins size={20} />
                  <span style={{ fontSize: '14px', fontWeight: '600' }}>MIX Tokens</span>
                </div>
                <p style={{ fontSize: '28px', fontWeight: 'bold', margin: '0' }}>{tokenBalance.toLocaleString()}</p>
                <p style={{ fontSize: '12px', margin: '4px 0 0 0', opacity: 0.8 }}>+{((performance.seamlessTransitions + performance.crowdResponse) / 10).toFixed(0)} today</p>
              </div>
              
              <div style={{ 
                background: 'linear-gradient(135deg, #10b981, #047857)', 
                borderRadius: '16px', 
                padding: '20px',
                color: '#fff'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <TrendingUp size={20} />
                  <span style={{ fontSize: '14px', fontWeight: '600' }}>Earnings (ETH)</span>
                </div>
                <p style={{ fontSize: '28px', fontWeight: 'bold', margin: '0' }}>{earnings.toFixed(2)}</p>
                <p style={{ fontSize: '12px', margin: '4px 0 0 0', opacity: 0.8 }}>+{(earnings * 0.1).toFixed(2)} this week</p>
              </div>
              
              <div style={{ 
                background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', 
                borderRadius: '16px', 
                padding: '20px',
                color: '#fff'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Eye size={20} />
                  <span style={{ fontSize: '14px', fontWeight: '600' }}>NFTs Generated</span>
                </div>
                <p style={{ fontSize: '28px', fontWeight: 'bold', margin: '0' }}>15</p>
                <p style={{ fontSize: '12px', margin: '4px 0 0 0', opacity: 0.8 }}>3 this session</p>
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ 
                background: 'rgba(255,255,255,0.05)', 
                borderRadius: '12px', 
                padding: '16px',
                border: `1px solid ${currentTheme.border}`
              }}>
                <h4 style={{ fontWeight: 'bold', margin: '0 0 8px 0', color: currentTheme.accent }}>
                  Smart Contract Activity
                </h4>
                <p style={{ color: '#d1d5db', fontSize: '14px', margin: '0 0 8px 0' }}>
                  Last royalty distribution: 2 hours ago
                </p>
                <p style={{ color: '#10b981', fontSize: '14px', margin: '0' }}>
                  ✓ {royaltyPayments.length + 8} artists paid automatically
                </p>
              </div>
              
              <div style={{ 
                background: 'rgba(255,255,255,0.05)', 
                borderRadius: '12px', 
                padding: '16px',
                border: `1px solid ${currentTheme.border}`
              }}>
                <h4 style={{ fontWeight: 'bold', margin: '0 0 8px 0', color: currentTheme.accent }}>
                  Recent Neural NFTs
                </h4>
                <p style={{ color: '#d1d5db', fontSize: '14px', margin: '0 0 8px 0' }}>
                  Holographic DNA Pattern #QNX-7892
                </p>
                <p style={{ color: '#3b82f6', fontSize: '14px', margin: '0' }}>
                  → Minted 15 minutes ago
                </p>
              </div>
              
              <div style={{ 
                background: 'rgba(255,255,255,0.05)', 
                borderRadius: '12px', 
                padding: '16px',
                border: `1px solid ${currentTheme.border}`
              }}>
                <h4 style={{ fontWeight: 'bold', margin: '0 0 8px 0', color: currentTheme.accent }}>
                  Performance Achievements
                </h4>
                <p style={{ color: '#d1d5db', fontSize: '14px', margin: '0 0 8px 0' }}>
                  Perfect Neural Synchronization: {Math.floor(performance.seamlessTransitions)}
                </p>
                <p style={{ color: '#8b5cf6', fontSize: '14px', margin: '0' }}>
                  → +{Math.floor(performance.seamlessTransitions * 2)} MIX tokens earned
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div style={cardStyle}>
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: 'bold', 
              marginBottom: '16px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              color: currentTheme.accent
            }}>
              <Settings size={20} />
              Advanced Settings
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Theme Selection */}
              <div>
                <h4 style={{ margin: '0 0 12px 0', color: currentTheme.accent }}>Visual Theme</h4>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {Object.keys(themes).map(themeName => (
                    <button
                      key={themeName}
                      onClick={() => setTheme(themeName as any)}
                      style={{
                        ...buttonStyle,
                        background: theme === themeName ? currentTheme.accent : 'rgba(255,255,255,0.1)',
                        color: theme === themeName ? '#000' : currentTheme.text
                      }}
                    >
                      {themeName.charAt(0).toUpperCase() + themeName.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Audio Settings */}
              <div>
                <h4 style={{ margin: '0 0 12px 0', color: currentTheme.accent }}>Audio Engine</h4>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => setRecordingEnabled(!recordingEnabled)}
                    style={{
                      ...buttonStyle,
                      background: recordingEnabled ? '#ef4444' : 'rgba(255,255,255,0.1)',
                      color: recordingEnabled ? 'white' : currentTheme.text
                    }}
                  >
                    <Mic size={16} />
                    {recordingEnabled ? 'Stop Recording' : 'Start Recording'}
                  </button>
                  
                  <button
                    onClick={() => setLiveStreamEnabled(!liveStreamEnabled)}
                    style={{
                      ...buttonStyle,
                      background: liveStreamEnabled ? '#f59e0b' : 'rgba(255,255,255,0.1)',
                      color: liveStreamEnabled ? 'white' : currentTheme.text
                    }}
                  >
                    <Radio size={16} />
                    {liveStreamEnabled ? 'Stop Stream' : 'Start Stream'}
                  </button>
                </div>
              </div>

              {/* Performance Stats */}
              <div>
                <h4 style={{ margin: '0 0 12px 0', color: currentTheme.accent }}>Session Statistics</h4>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', 
                  gap: '12px' 
                }}>
                  <div style={{
                    background: 'rgba(255,255,255,0.05)',
                    padding: '12px',
                    borderRadius: '8px',
                    border: `1px solid ${currentTheme.border}`
                  }}>
                    <div style={{ fontSize: '12px', color: currentTheme.accent }}>Tracks Mixed</div>
                    <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                      {tracks.filter(t => t.id === loadedTracks.deck1.id || t.id === loadedTracks.deck2.id).length}
                    </div>
                  </div>
                  
                  <div style={{
                    background: 'rgba(255,255,255,0.05)',
                    padding: '12px',
                    borderRadius: '8px',
                    border: `1px solid ${currentTheme.border}`
                  }}>
                    <div style={{ fontSize: '12px', color: currentTheme.accent }}>Session Time</div>
                    <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                      {Math.floor(Date.now() / 60000) % 60}m {Math.floor(Date.now() / 1000) % 60}s
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Action Button for Mobile */}
      {isMobile && (
        <button
          onClick={() => setActiveTab(activeTab === 'mixer' ? 'library' : 'mixer')}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: currentTheme.accent,
            border: 'none',
            color: '#000',
            fontSize: '24px',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
        >
          {activeTab === 'mixer' ? <Music size={24} /> : <Home size={24} />}
        </button>
      )}
    </div>
  );
};

export default DJPlatformAdvanced;