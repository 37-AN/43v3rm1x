import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Upload, Users, Zap, Coins, TrendingUp, Music, Disc3, Eye, Atom, Network, Cpu } from 'lucide-react';
import NeuralHarmonyConstellation from './visualizers/NeuralHarmonyConstellation';
import BlockchainBeatSculptor from './visualizers/BlockchainBeatSculptor';
import QuantumMixReactor from './visualizers/QuantumMixReactor';
import SynapticSoundNetworks from './visualizers/SynapticSoundNetworks';

const DJPlatformEnhanced = () => {
  const [isPlaying, setIsPlaying] = useState<{[key: string]: boolean}>({ deck1: false, deck2: false });
  const [crossfaderPosition, setCrossfaderPosition] = useState(50);
  const [tempo, setTempo] = useState<{[key: string]: number}>({ deck1: 128, deck2: 132 });
  const [volume, setVolume] = useState<{[key: string]: number}>({ deck1: 80, deck2: 80 });
  const [aiSyncEnabled, setAiSyncEnabled] = useState(false);
  const [tokenBalance, setTokenBalance] = useState(1250);
  const [earnings] = useState(89.50);
  const [activeTab, setActiveTab] = useState('mixer');
  const [activeVisualizer, setActiveVisualizer] = useState('constellation');

  // Simulated audio context for demo
  const audioContext = useRef<AudioContext | null>(null);
  const [tracks] = useState([
    { id: 1, name: "Summer Vibes", artist: "DJ Alex", bpm: 128, key: "Am", genre: "House", plays: 15420 },
    { id: 2, name: "Night Drive", artist: "Luna Music", bpm: 132, key: "Gm", genre: "Techno", plays: 8932 },
    { id: 3, name: "Ocean Dreams", artist: "Wave Rider", bpm: 124, key: "C", genre: "Ambient", plays: 12104 }
  ]);

  const [loadedTracks, setLoadedTracks] = useState({ deck1: tracks[0], deck2: tracks[1] });
  
  // Simulated audio data for visualizers
  const [audioData, setAudioData] = useState<{deck1: number[]; deck2: number[]}>({
    deck1: Array.from({ length: 256 }, () => Math.random()),
    deck2: Array.from({ length: 256 }, () => Math.random())
  });

  // Blockchain transaction simulation
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [royaltyPayments, setRoyaltyPayments] = useState<any[]>([
    { artist: "DJ Alex", amount: 15.5, timestamp: Date.now() - 7200000 },
    { artist: "Luna Music", amount: 8.2, timestamp: Date.now() - 3600000 }
  ]);

  // AI predictions for mixing
  const [aiPredictions, setAiPredictions] = useState<any[]>([
    { mixPoint: 65, confidence: 0.85, harmonicMatch: 0.92 },
    { mixPoint: 35, confidence: 0.72, harmonicMatch: 0.78 }
  ]);

  // Simulated AI BPM sync
  useEffect(() => {
    if (aiSyncEnabled && loadedTracks.deck1 && loadedTracks.deck2) {
      const avgBPM = (loadedTracks.deck1.bpm + loadedTracks.deck2.bpm) / 2;
      setTempo({ deck1: avgBPM, deck2: avgBPM });
    }
  }, [aiSyncEnabled, loadedTracks]);

  // Simulate audio data updates
  useEffect(() => {
    const updateAudioData = () => {
      if (isPlaying.deck1 || isPlaying.deck2) {
        setAudioData({
          deck1: isPlaying.deck1 ? Array.from({ length: 256 }, (_, i) => 
            Math.sin(Date.now() * 0.001 + i * 0.1) * 0.5 + 
            Math.random() * 0.3 + 
            Math.sin(Date.now() * 0.01 + i * 0.05) * 0.2
          ) : Array.from({ length: 256 }, () => 0),
          deck2: isPlaying.deck2 ? Array.from({ length: 256 }, (_, i) => 
            Math.sin(Date.now() * 0.0012 + i * 0.12) * 0.5 + 
            Math.random() * 0.3 + 
            Math.cos(Date.now() * 0.008 + i * 0.06) * 0.2
          ) : Array.from({ length: 256 }, () => 0)
        });
      }
    };

    const interval = setInterval(updateAudioData, 50);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Simulate blockchain transactions
  useEffect(() => {
    const generateTransaction = () => {
      if (isPlaying.deck1 || isPlaying.deck2) {
        const transaction = {
          type: Math.random() > 0.5 ? 'token_reward' : 'royalty_payment',
          amount: Math.random() * 50 + 10,
          timestamp: Date.now(),
          x: Math.random() * 40,
          y: Math.random() * 40,
          intensity: Math.random() * 0.8 + 0.2
        };
        
        setRecentTransactions(prev => [...prev.slice(-5), transaction]);
        
        if (transaction.type === 'token_reward') {
          setTokenBalance(prev => prev + Math.floor(transaction.amount / 10));
        }
      }
    };

    const interval = setInterval(generateTransaction, 3000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handlePlay = (deck: string) => {
    setIsPlaying(prev => ({ ...prev, [deck]: !prev[deck] }));
    // Simulate earning tokens when playing
    if (!isPlaying[deck]) {
      setTimeout(() => setTokenBalance(prev => prev + 5), 1000);
    }
  };

  const loadTrack = (track: any, deck: string) => {
    setLoadedTracks(prev => ({ ...prev, [deck]: track }));
  };

  const handleVisualizerCollision = (event: any) => {
    console.log('Quantum collision detected:', event);
    if (event.type === 'perfect') {
      setTokenBalance(prev => prev + 25);
    }
  };

  const handleNetworkFusion = (fusion: any) => {
    console.log('Neural network fusion:', fusion);
    if (fusion.quality > 0.8) {
      setTokenBalance(prev => prev + 50);
    }
  };

  const calculateHarmonicCompatibility = () => {
    if (!loadedTracks.deck1 || !loadedTracks.deck2) return 0;
    
    // Simple harmonic compatibility calculation
    const key1 = loadedTracks.deck1.key;
    const key2 = loadedTracks.deck2.key;
    const bpmDiff = Math.abs(loadedTracks.deck1.bpm - loadedTracks.deck2.bpm);
    
    let keyCompatibility = 0.5;
    if (key1 === key2) keyCompatibility = 1;
    else if (key1.charAt(0) === key2.charAt(0)) keyCompatibility = 0.8;
    
    const bpmCompatibility = Math.max(0, 1 - (bpmDiff / 20));
    
    return (keyCompatibility + bpmCompatibility) / 2;
  };

  const getTrackEnergy = () => {
    const avgAmplitude = [...audioData.deck1, ...audioData.deck2]
      .reduce((sum, val) => sum + val, 0) / (audioData.deck1.length + audioData.deck2.length);
    return Math.min(1, avgAmplitude);
  };

  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1f2937 0%, #7c3aed 50%, #8b5cf6 100%)',
    color: 'white',
    fontFamily: 'Arial, sans-serif'
  };

  const headerStyle: React.CSSProperties = {
    background: 'rgba(0,0,0,0.2)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    padding: '16px 24px'
  };

  const cardStyle: React.CSSProperties = {
    background: 'rgba(31, 41, 55, 0.8)',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
    margin: '16px 0'
  };

  const buttonStyle: React.CSSProperties = {
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'all 0.3s ease'
  };

  const visualizerButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    margin: '4px',
    padding: '8px 16px',
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  };

  const mixProgress = crossfaderPosition / 100;

  return (
    <div style={containerStyle}>
      {/* Header */}
      <header style={headerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Disc3 size={32} color="#3b82f6" />
            <h1 style={{ 
              fontSize: '28px', 
              fontWeight: 'bold', 
              background: 'linear-gradient(135deg, #60a5fa, #a855f7)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              MixChain AI Enhanced
            </h1>
          </div>
          
          <nav style={{ display: 'flex', gap: '16px' }}>
            <button 
              onClick={() => setActiveTab('mixer')}
              style={{
                ...buttonStyle,
                background: activeTab === 'mixer' ? '#3b82f6' : 'rgba(255,255,255,0.1)',
                color: 'white'
              }}
            >
              Mixer
            </button>
            <button 
              onClick={() => setActiveTab('library')}
              style={{
                ...buttonStyle,
                background: activeTab === 'library' ? '#3b82f6' : 'rgba(255,255,255,0.1)',
                color: 'white'
              }}
            >
              Library
            </button>
            <button 
              onClick={() => setActiveTab('blockchain')}
              style={{
                ...buttonStyle,
                background: activeTab === 'blockchain' ? '#3b82f6' : 'rgba(255,255,255,0.1)',
                color: 'white'
              }}
            >
              Blockchain
            </button>
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              background: 'rgba(31, 41, 55, 0.8)', 
              padding: '8px 16px', 
              borderRadius: '8px' 
            }}>
              <Coins size={16} color="#fbbf24" />
              <span style={{ fontFamily: 'monospace' }}>{tokenBalance}</span>
            </div>
            <button style={{
              ...buttonStyle,
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              color: 'white'
            }}>
              Go Live
            </button>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 24px' }}>
        {activeTab === 'mixer' && (
          <div>
            {/* AI Controls */}
            <div style={cardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Zap size={20} color="#fbbf24" />
                  AI-Enhanced Mixing
                </h2>
                <button
                  onClick={() => setAiSyncEnabled(!aiSyncEnabled)}
                  style={{
                    ...buttonStyle,
                    background: aiSyncEnabled ? '#10b981' : 'rgba(255,255,255,0.1)',
                    color: 'white'
                  }}
                >
                  {aiSyncEnabled ? 'AI Sync ON' : 'AI Sync OFF'}
                </button>
              </div>
              
              {aiSyncEnabled && (
                <div style={{ 
                  background: 'rgba(16, 185, 129, 0.2)', 
                  border: '1px solid #10b981', 
                  borderRadius: '8px', 
                  padding: '12px' 
                }}>
                  <p style={{ color: '#10b981', fontSize: '14px', margin: 0 }}>
                    ✓ AI has automatically synced BPM between decks for harmonic mixing
                  </p>
                </div>
              )}
            </div>

            {/* Enhanced Visualizer Panel */}
            <div style={cardStyle}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Eye size={20} />
                Advanced Audio Visualizers
              </h3>
              
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setActiveVisualizer('constellation')}
                  style={{
                    ...visualizerButtonStyle,
                    background: activeVisualizer === 'constellation' ? '#3b82f6' : 'rgba(255,255,255,0.1)',
                    color: 'white'
                  }}
                >
                  <Atom size={14} />
                  Neural Constellation
                </button>
                <button
                  onClick={() => setActiveVisualizer('sculptor')}
                  style={{
                    ...visualizerButtonStyle,
                    background: activeVisualizer === 'sculptor' ? '#3b82f6' : 'rgba(255,255,255,0.1)',
                    color: 'white'
                  }}
                >
                  <TrendingUp size={14} />
                  Blockchain Sculptor
                </button>
                <button
                  onClick={() => setActiveVisualizer('reactor')}
                  style={{
                    ...visualizerButtonStyle,
                    background: activeVisualizer === 'reactor' ? '#3b82f6' : 'rgba(255,255,255,0.1)',
                    color: 'white'
                  }}
                >
                  <Zap size={14} />
                  Quantum Reactor
                </button>
                <button
                  onClick={() => setActiveVisualizer('networks')}
                  style={{
                    ...visualizerButtonStyle,
                    background: activeVisualizer === 'networks' ? '#3b82f6' : 'rgba(255,255,255,0.1)',
                    color: 'white'
                  }}
                >
                  <Network size={14} />
                  Synaptic Networks
                </button>
              </div>

              {activeVisualizer === 'constellation' && (
                <NeuralHarmonyConstellation
                  audioData={[...audioData.deck1, ...audioData.deck2]}
                  isPlaying={isPlaying.deck1 || isPlaying.deck2}
                  bpm={(tempo.deck1 + tempo.deck2) / 2}
                  musicalKey={loadedTracks.deck1?.key || 'C'}
                  harmonicCompatibility={calculateHarmonicCompatibility()}
                  aiPredictions={aiPredictions}
                />
              )}

              {activeVisualizer === 'sculptor' && (
                <BlockchainBeatSculptor
                  audioData={[...audioData.deck1, ...audioData.deck2]}
                  isPlaying={isPlaying.deck1 || isPlaying.deck2}
                  genre={loadedTracks.deck1?.genre || 'House'}
                  energy={getTrackEnergy()}
                  tokenBalance={tokenBalance}
                  recentTransactions={recentTransactions}
                  royaltyPayments={royaltyPayments}
                />
              )}

              {activeVisualizer === 'reactor' && (
                <QuantumMixReactor
                  audioDataDeck1={audioData.deck1}
                  audioDataDeck2={audioData.deck2}
                  crossfaderPosition={crossfaderPosition}
                  isPlaying1={isPlaying.deck1}
                  isPlaying2={isPlaying.deck2}
                  bpm1={tempo.deck1}
                  bpm2={tempo.deck2}
                  aiPredictions={aiPredictions.map(p => ({
                    optimalCrossfaderPosition: p.mixPoint,
                    confidence: p.confidence,
                    harmonicMatch: p.harmonicMatch
                  }))}
                  onCollisionEvent={handleVisualizerCollision}
                />
              )}

              {activeVisualizer === 'networks' && (
                <SynapticSoundNetworks
                  audioDataDeck1={audioData.deck1}
                  audioDataDeck2={audioData.deck2}
                  trackInfo1={loadedTracks.deck1}
                  trackInfo2={loadedTracks.deck2}
                  mixProgress={mixProgress}
                  isPlaying1={isPlaying.deck1}
                  isPlaying2={isPlaying.deck2}
                  onNetworkFusion={handleNetworkFusion}
                />
              )}
            </div>

            {/* Mixer Interface - Simplified for space */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '24px', marginTop: '24px' }}>
              {/* Deck 1 */}
              <div style={cardStyle}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>Deck 1</h3>
                <div style={{ marginBottom: '16px' }}>
                  <p style={{ fontWeight: 'bold', margin: '4px 0' }}>{loadedTracks.deck1?.name}</p>
                  <p style={{ fontSize: '14px', color: '#d1d5db', margin: '4px 0' }}>{loadedTracks.deck1?.artist}</p>
                  <p style={{ fontSize: '12px', color: '#9ca3af', margin: '4px 0' }}>
                    {loadedTracks.deck1?.bpm} BPM • {loadedTracks.deck1?.key} • {loadedTracks.deck1?.genre}
                  </p>
                </div>
                
                <button
                  onClick={() => handlePlay('deck1')}
                  style={{
                    ...buttonStyle,
                    background: isPlaying.deck1 ? '#ef4444' : '#10b981',
                    color: 'white',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  {isPlaying.deck1 ? <Pause size={20} /> : <Play size={20} />}
                  {isPlaying.deck1 ? 'Pause' : 'Play'}
                </button>

                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>Tempo: {tempo.deck1.toFixed(1)} BPM</label>
                  <input
                    type="range"
                    min="100"
                    max="150"
                    value={tempo.deck1}
                    onChange={(e) => setTempo(prev => ({ ...prev, deck1: parseFloat(e.target.value) }))}
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>Volume: {volume.deck1}%</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume.deck1}
                    onChange={(e) => setVolume(prev => ({ ...prev, deck1: parseInt(e.target.value) }))}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              {/* Crossfader */}
              <div style={{ ...cardStyle, minWidth: '200px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', textAlign: 'center' }}>Crossfader</h3>
                
                <div style={{ marginBottom: '32px' }}>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={crossfaderPosition}
                    onChange={(e) => setCrossfaderPosition(parseInt(e.target.value))}
                    style={{ 
                      width: '100%', 
                      height: '16px',
                      writingMode: 'vertical-lr' as any,
                      WebkitAppearance: 'slider-vertical'
                    }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#9ca3af', marginTop: '8px' }}>
                    <span>A</span>
                    <span>B</span>
                  </div>
                </div>

                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                  <p style={{ fontSize: '20px', fontFamily: 'monospace', margin: '8px 0' }}>{crossfaderPosition}%</p>
                </div>
              </div>

              {/* Deck 2 */}
              <div style={cardStyle}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>Deck 2</h3>
                <div style={{ marginBottom: '16px' }}>
                  <p style={{ fontWeight: 'bold', margin: '4px 0' }}>{loadedTracks.deck2?.name}</p>
                  <p style={{ fontSize: '14px', color: '#d1d5db', margin: '4px 0' }}>{loadedTracks.deck2?.artist}</p>
                  <p style={{ fontSize: '12px', color: '#9ca3af', margin: '4px 0' }}>
                    {loadedTracks.deck2?.bpm} BPM • {loadedTracks.deck2?.key} • {loadedTracks.deck2?.genre}
                  </p>
                </div>
                
                <button
                  onClick={() => handlePlay('deck2')}
                  style={{
                    ...buttonStyle,
                    background: isPlaying.deck2 ? '#ef4444' : '#10b981',
                    color: 'white',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  {isPlaying.deck2 ? <Pause size={20} /> : <Play size={20} />}
                  {isPlaying.deck2 ? 'Pause' : 'Play'}
                </button>

                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>Tempo: {tempo.deck2.toFixed(1)} BPM</label>
                  <input
                    type="range"
                    min="100"
                    max="150"
                    value={tempo.deck2}
                    onChange={(e) => setTempo(prev => ({ ...prev, deck2: parseFloat(e.target.value) }))}
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px' }}>Volume: {volume.deck2}%</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume.deck2}
                    onChange={(e) => setVolume(prev => ({ ...prev, deck2: parseInt(e.target.value) }))}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}


        {activeTab === 'library' && (
          <div style={cardStyle}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Music size={20} />
              AI-Curated Tracks
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {tracks.map(track => (
                <div key={track.id} style={{ 
                  background: 'rgba(55, 65, 81, 0.8)', 
                  borderRadius: '8px', 
                  padding: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <p style={{ fontWeight: 'bold', margin: '0 0 4px 0' }}>{track.name}</p>
                    <p style={{ color: '#d1d5db', fontSize: '14px', margin: '0 0 4px 0' }}>{track.artist}</p>
                    <p style={{ color: '#9ca3af', fontSize: '12px', margin: '0' }}>
                      {track.bpm} BPM • {track.key} • {track.genre} • {track.plays.toLocaleString()} plays
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => loadTrack(track, 'deck1')}
                      style={{
                        ...buttonStyle,
                        background: '#3b82f6',
                        color: 'white',
                        fontSize: '12px',
                        padding: '6px 12px'
                      }}
                    >
                      Deck A
                    </button>
                    <button
                      onClick={() => loadTrack(track, 'deck2')}
                      style={{
                        ...buttonStyle,
                        background: '#8b5cf6',
                        color: 'white',
                        fontSize: '12px',
                        padding: '6px 12px'
                      }}
                    >
                      Deck B
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'blockchain' && (
          <div style={cardStyle}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Coins size={20} />
              Enhanced Blockchain Analytics
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div style={{ 
                background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', 
                borderRadius: '8px', 
                padding: '16px' 
              }}>
                <p style={{ fontSize: '14px', margin: '0 0 8px 0' }}>MIX Tokens</p>
                <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0' }}>{tokenBalance}</p>
              </div>
              <div style={{ 
                background: 'linear-gradient(135deg, #10b981, #047857)', 
                borderRadius: '8px', 
                padding: '16px' 
              }}>
                <p style={{ fontSize: '14px', margin: '0 0 8px 0' }}>Earnings (ETH)</p>
                <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0' }}>{earnings}</p>
              </div>
              <div style={{ 
                background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', 
                borderRadius: '8px', 
                padding: '16px' 
              }}>
                <p style={{ fontSize: '14px', margin: '0 0 8px 0' }}>NFTs Generated</p>
                <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0' }}>7</p>
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ background: 'rgba(55, 65, 81, 0.8)', borderRadius: '8px', padding: '12px' }}>
                <p style={{ fontWeight: 'bold', margin: '0 0 4px 0' }}>Smart Contract Activity</p>
                <p style={{ color: '#d1d5db', fontSize: '14px', margin: '0 0 4px 0' }}>Last royalty distribution: 2 hours ago</p>
                <p style={{ color: '#10b981', fontSize: '14px', margin: '0' }}>✓ 15 artists paid automatically</p>
              </div>
              
              <div style={{ background: 'rgba(55, 65, 81, 0.8)', borderRadius: '8px', padding: '12px' }}>
                <p style={{ fontWeight: 'bold', margin: '0 0 4px 0' }}>Recent Visualizer NFTs</p>
                <p style={{ color: '#d1d5db', fontSize: '14px', margin: '0 0 4px 0' }}>Neural Constellation Pattern #QNX-7892</p>
                <p style={{ color: '#3b82f6', fontSize: '14px', margin: '0' }}>→ Minted 15 minutes ago</p>
              </div>
              
              <div style={{ background: 'rgba(55, 65, 81, 0.8)', borderRadius: '8px', padding: '12px' }}>
                <p style={{ fontWeight: 'bold', margin: '0 0 4px 0' }}>Quantum Reactor Achievements</p>
                <p style={{ color: '#d1d5db', fontSize: '14px', margin: '0 0 4px 0' }}>Perfect Mix Collisions: 3</p>
                <p style={{ color: '#8b5cf6', fontSize: '14px', margin: '0' }}>→ +75 MIX tokens earned</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer style={{
        background: 'rgba(0,0,0,0.2)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        marginTop: '48px'
      }}>
        <div style={{ 
          maxWidth: '1400px', 
          margin: '0 auto', 
          padding: '24px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between' 
        }}>
          <p style={{ color: '#9ca3af', margin: '0' }}>
            © 2024 MixChain AI Enhanced - Next-Gen Visualizer Technology
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#9ca3af' }}>
            <TrendingUp size={16} />
            <span style={{ fontSize: '14px' }}>1,247 DJs online • 89 NFTs minted today</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DJPlatformEnhanced;