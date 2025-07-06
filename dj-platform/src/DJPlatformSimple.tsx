import React, { useState, useEffect } from 'react';
import { Play, Pause, Upload, Users, Zap, Coins, TrendingUp, Music, Disc3 } from 'lucide-react';

const DJPlatformSimple = () => {
  const [isPlaying, setIsPlaying] = useState<{[key: string]: boolean}>({ deck1: false, deck2: false });
  const [crossfaderPosition, setCrossfaderPosition] = useState(50);
  const [tempo, setTempo] = useState<{[key: string]: number}>({ deck1: 128, deck2: 132 });
  const [volume, setVolume] = useState<{[key: string]: number}>({ deck1: 80, deck2: 80 });
  const [aiSyncEnabled, setAiSyncEnabled] = useState(false);
  const [tokenBalance, setTokenBalance] = useState(1250);
  const [earnings] = useState(89.50);
  const [activeTab, setActiveTab] = useState('mixer');

  const [tracks] = useState([
    { id: 1, name: "Summer Vibes", artist: "DJ Alex", bpm: 128, key: "Am", genre: "House", plays: 15420 },
    { id: 2, name: "Night Drive", artist: "Luna Music", bpm: 132, key: "Gm", genre: "Techno", plays: 8932 },
    { id: 3, name: "Ocean Dreams", artist: "Wave Rider", bpm: 124, key: "C", genre: "Ambient", plays: 12104 }
  ]);

  const [loadedTracks, setLoadedTracks] = useState({ deck1: tracks[0], deck2: tracks[1] });

  useEffect(() => {
    if (aiSyncEnabled && loadedTracks.deck1 && loadedTracks.deck2) {
      const avgBPM = (loadedTracks.deck1.bpm + loadedTracks.deck2.bpm) / 2;
      setTempo({ deck1: avgBPM, deck2: avgBPM });
    }
  }, [aiSyncEnabled, loadedTracks]);

  const handlePlay = (deck: string) => {
    setIsPlaying(prev => ({ ...prev, [deck]: !prev[deck] }));
    if (!isPlaying[deck]) {
      setTimeout(() => setTokenBalance(prev => prev + 5), 1000);
    }
  };

  const loadTrack = (track: any, deck: string) => {
    setLoadedTracks(prev => ({ ...prev, [deck]: track }));
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

  const primaryButton: React.CSSProperties = {
    ...buttonStyle,
    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
    color: 'white'
  };

  const playButton: React.CSSProperties = {
    ...buttonStyle,
    background: '#10b981',
    color: 'white',
    borderRadius: '50%',
    width: '60px',
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const pauseButton: React.CSSProperties = {
    ...playButton,
    background: '#ef4444'
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <header style={headerStyle}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Disc3 size={32} color="#3b82f6" />
            <h1 style={{ 
              fontSize: '28px', 
              fontWeight: 'bold', 
              background: 'linear-gradient(135deg, #60a5fa, #a855f7)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              MixChain AI
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

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
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

            {/* Mixer Interface */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px', marginTop: '24px' }}>
              {/* Deck 1 */}
              <div style={cardStyle}>
                <div style={{ marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>Deck 1</h3>
                  <div style={{ fontSize: '14px', color: '#d1d5db' }}>
                    <p style={{ fontWeight: 'bold', margin: '4px 0' }}>{loadedTracks.deck1?.name || 'No Track Loaded'}</p>
                    <p style={{ margin: '4px 0' }}>{loadedTracks.deck1?.artist || ''}</p>
                    <p style={{ fontSize: '12px', color: '#9ca3af', margin: '4px 0' }}>
                      {loadedTracks.deck1?.bpm} BPM • Key: {loadedTracks.deck1?.key} • {loadedTracks.deck1?.genre}
                    </p>
                  </div>
                </div>

                {/* Waveform */}
                <div style={{ 
                  height: '64px', 
                  background: '#111827', 
                  borderRadius: '8px', 
                  padding: '8px', 
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'end',
                  gap: '2px'
                }}>
                  {Array.from({ length: 30 }, (_, i) => (
                    <div
                      key={i}
                      style={{
                        height: `${Math.random() * 80 + 20}%`,
                        width: '4px',
                        background: isPlaying.deck1 ? 'linear-gradient(to top, #3b82f6, #06b6d4)' : 'linear-gradient(to top, #4b5563, #6b7280)',
                        borderRadius: '2px',
                        opacity: isPlaying.deck1 ? 1 : 0.7
                      }}
                    />
                  ))}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <button
                    onClick={() => handlePlay('deck1')}
                    style={isPlaying.deck1 ? pauseButton : playButton}
                  >
                    {isPlaying.deck1 ? <Pause size={24} /> : <Play size={24} />}
                  </button>
                  
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '24px', fontFamily: 'monospace', margin: '0' }}>
                      {tempo.deck1.toFixed(1)}
                    </p>
                    <p style={{ fontSize: '12px', color: '#9ca3af', margin: '0' }}>BPM</p>
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ color: '#d1d5db', fontSize: '14px' }}>Tempo</label>
                  <input
                    type="range"
                    min="100"
                    max="150"
                    value={tempo.deck1}
                    onChange={(e) => setTempo(prev => ({ ...prev, deck1: parseFloat(e.target.value) }))}
                    style={{ width: '100%', marginTop: '4px' }}
                  />
                </div>

                <div>
                  <label style={{ color: '#d1d5db', fontSize: '14px' }}>Volume</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume.deck1}
                    onChange={(e) => setVolume(prev => ({ ...prev, deck1: parseInt(e.target.value) }))}
                    style={{ width: '100%', marginTop: '4px' }}
                  />
                </div>
              </div>

              {/* Crossfader */}
              <div style={cardStyle}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', textAlign: 'center' }}>Crossfader</h3>
                
                <div style={{ marginBottom: '32px' }}>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={crossfaderPosition}
                    onChange={(e) => setCrossfaderPosition(parseInt(e.target.value))}
                    style={{ width: '100%', height: '16px' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#9ca3af', marginTop: '8px' }}>
                    <span>A</span>
                    <span>B</span>
                  </div>
                </div>

                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                  <p style={{ color: '#d1d5db', fontSize: '14px', margin: '0' }}>Mix Position</p>
                  <p style={{ fontSize: '20px', fontFamily: 'monospace', margin: '8px 0' }}>{crossfaderPosition}%</p>
                </div>
                
                <button style={{
                  ...buttonStyle,
                  background: 'linear-gradient(135deg, #ec4899, #f43f5e)',
                  color: 'white',
                  width: '100%',
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}>
                  <Upload size={20} />
                  Upload Mix
                </button>
                
                <button style={{
                  ...buttonStyle,
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  color: 'white',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}>
                  <Users size={20} />
                  Collaborate Live
                </button>
              </div>

              {/* Deck 2 */}
              <div style={cardStyle}>
                <div style={{ marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>Deck 2</h3>
                  <div style={{ fontSize: '14px', color: '#d1d5db' }}>
                    <p style={{ fontWeight: 'bold', margin: '4px 0' }}>{loadedTracks.deck2?.name || 'No Track Loaded'}</p>
                    <p style={{ margin: '4px 0' }}>{loadedTracks.deck2?.artist || ''}</p>
                    <p style={{ fontSize: '12px', color: '#9ca3af', margin: '4px 0' }}>
                      {loadedTracks.deck2?.bpm} BPM • Key: {loadedTracks.deck2?.key} • {loadedTracks.deck2?.genre}
                    </p>
                  </div>
                </div>

                {/* Waveform */}
                <div style={{ 
                  height: '64px', 
                  background: '#111827', 
                  borderRadius: '8px', 
                  padding: '8px', 
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'end',
                  gap: '2px'
                }}>
                  {Array.from({ length: 30 }, (_, i) => (
                    <div
                      key={i}
                      style={{
                        height: `${Math.random() * 80 + 20}%`,
                        width: '4px',
                        background: isPlaying.deck2 ? 'linear-gradient(to top, #8b5cf6, #a855f7)' : 'linear-gradient(to top, #4b5563, #6b7280)',
                        borderRadius: '2px',
                        opacity: isPlaying.deck2 ? 1 : 0.7
                      }}
                    />
                  ))}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <button
                    onClick={() => handlePlay('deck2')}
                    style={isPlaying.deck2 ? pauseButton : playButton}
                  >
                    {isPlaying.deck2 ? <Pause size={24} /> : <Play size={24} />}
                  </button>
                  
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '24px', fontFamily: 'monospace', margin: '0' }}>
                      {tempo.deck2.toFixed(1)}
                    </p>
                    <p style={{ fontSize: '12px', color: '#9ca3af', margin: '0' }}>BPM</p>
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ color: '#d1d5db', fontSize: '14px' }}>Tempo</label>
                  <input
                    type="range"
                    min="100"
                    max="150"
                    value={tempo.deck2}
                    onChange={(e) => setTempo(prev => ({ ...prev, deck2: parseFloat(e.target.value) }))}
                    style={{ width: '100%', marginTop: '4px' }}
                  />
                </div>

                <div>
                  <label style={{ color: '#d1d5db', fontSize: '14px' }}>Volume</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume.deck2}
                    onChange={(e) => setVolume(prev => ({ ...prev, deck2: parseInt(e.target.value) }))}
                    style={{ width: '100%', marginTop: '4px' }}
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
                      {track.bpm} BPM • {track.plays.toLocaleString()} plays
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
              Blockchain Analytics
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
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
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ background: 'rgba(55, 65, 81, 0.8)', borderRadius: '8px', padding: '12px' }}>
                <p style={{ fontWeight: 'bold', margin: '0 0 4px 0' }}>Smart Contract Activity</p>
                <p style={{ color: '#d1d5db', fontSize: '14px', margin: '0 0 4px 0' }}>Last royalty distribution: 2 hours ago</p>
                <p style={{ color: '#10b981', fontSize: '14px', margin: '0' }}>✓ 15 artists paid automatically</p>
              </div>
              
              <div style={{ background: 'rgba(55, 65, 81, 0.8)', borderRadius: '8px', padding: '12px' }}>
                <p style={{ fontWeight: 'bold', margin: '0 0 4px 0' }}>NFT Collections</p>
                <p style={{ color: '#d1d5db', fontSize: '14px', margin: '0 0 4px 0' }}>Limited Edition Summer Mix #001</p>
                <p style={{ color: '#3b82f6', fontSize: '14px', margin: '0' }}>→ 50/100 minted</p>
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
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '24px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between' 
        }}>
          <p style={{ color: '#9ca3af', margin: '0' }}>
            © 2024 MixChain AI - Powered by AI & Blockchain Technology
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#9ca3af' }}>
            <TrendingUp size={16} />
            <span style={{ fontSize: '14px' }}>1,247 DJs online</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DJPlatformSimple;