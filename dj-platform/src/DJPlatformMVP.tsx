import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Upload, Users, Zap, Coins, TrendingUp, Music, Disc3 } from 'lucide-react';

const DJPlatformMVP = () => {
  const [isPlaying, setIsPlaying] = useState<{[key: string]: boolean}>({ deck1: false, deck2: false });
  const [crossfaderPosition, setCrossfaderPosition] = useState(50);
  const [tempo, setTempo] = useState<{[key: string]: number}>({ deck1: 128, deck2: 132 });
  const [volume, setVolume] = useState<{[key: string]: number}>({ deck1: 80, deck2: 80 });
  const [aiSyncEnabled, setAiSyncEnabled] = useState(false);
  const [tokenBalance, setTokenBalance] = useState(1250);
  const [earnings] = useState(89.50);
  const [activeTab, setActiveTab] = useState('mixer');

  // Simulated audio context for demo
  const audioContext = useRef<AudioContext | null>(null);
  const [tracks] = useState([
    { id: 1, name: "Summer Vibes", artist: "DJ Alex", bpm: 128, key: "Am", genre: "House", plays: 15420 },
    { id: 2, name: "Night Drive", artist: "Luna Music", bpm: 132, key: "Gm", genre: "Techno", plays: 8932 },
    { id: 3, name: "Ocean Dreams", artist: "Wave Rider", bpm: 124, key: "C", genre: "Ambient", plays: 12104 }
  ]);

  const [loadedTracks, setLoadedTracks] = useState({ deck1: tracks[0], deck2: tracks[1] });

  // Simulated AI BPM sync
  useEffect(() => {
    if (aiSyncEnabled && loadedTracks.deck1 && loadedTracks.deck2) {
      const avgBPM = (loadedTracks.deck1.bpm + loadedTracks.deck2.bpm) / 2;
      setTempo({ deck1: avgBPM, deck2: avgBPM });
    }
  }, [aiSyncEnabled, loadedTracks]);

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

  const Waveform = ({ isActive, track }: { isActive: boolean; track: any }) => (
    <div className="h-16 bg-gray-900 rounded-lg p-2 mb-4">
      <div className="flex items-end h-full space-x-1">
        {Array.from({ length: 50 }, (_, i) => (
          <div
            key={i}
            className={`bg-gradient-to-t ${
              isActive 
                ? 'from-blue-500 to-cyan-400 animate-pulse' 
                : 'from-gray-600 to-gray-500'
            } rounded-sm`}
            style={{ 
              height: `${Math.random() * 100}%`,
              width: '2px',
              animationDelay: `${i * 50}ms`
            }}
          />
        ))}
      </div>
    </div>
  );

  const DeckComponent = ({ deckId, track, isPlaying: deckPlaying }: { deckId: string; track: any; isPlaying: boolean }) => (
    <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
      <div className="mb-4">
        <h3 className="text-white font-bold text-lg mb-2">Deck {deckId.slice(-1)}</h3>
        <div className="text-sm text-gray-300">
          <p className="font-semibold">{track?.name || 'No Track Loaded'}</p>
          <p>{track?.artist || ''}</p>
          <p className="text-xs text-gray-400">
            {track?.bpm} BPM • Key: {track?.key} • {track?.genre}
          </p>
        </div>
      </div>

      <Waveform isActive={deckPlaying} track={track} />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => handlePlay(deckId)}
            className={`p-3 rounded-full ${
              deckPlaying 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-green-500 hover:bg-green-600'
            } transition-colors`}
          >
            {deckPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          </button>
          
          <div className="text-center">
            <p className="text-white text-2xl font-mono">
              {tempo[deckId].toFixed(1)}
            </p>
            <p className="text-gray-400 text-xs">BPM</p>
          </div>
        </div>

        <div>
          <label className="text-gray-300 text-sm">Tempo</label>
          <input
            type="range"
            min="100"
            max="150"
            value={tempo[deckId]}
            onChange={(e) => setTempo(prev => ({ ...prev, [deckId]: parseFloat(e.target.value) }))}
            className="w-full mt-1 accent-blue-500"
          />
        </div>

        <div>
          <label className="text-gray-300 text-sm">Volume</label>
          <input
            type="range"
            min="0"
            max="100"
            value={volume[deckId]}
            onChange={(e) => setVolume(prev => ({ ...prev, [deckId]: parseInt(e.target.value) }))}
            className="w-full mt-1 accent-blue-500"
          />
        </div>
      </div>
    </div>
  );

  const TrackLibrary = () => (
    <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
      <h3 className="text-white font-bold text-lg mb-4 flex items-center">
        <Music className="w-5 h-5 mr-2" />
        AI-Curated Tracks
      </h3>
      <div className="space-y-3">
        {tracks.map(track => (
          <div key={track.id} className="bg-gray-700 rounded-lg p-3 hover:bg-gray-600 transition-colors">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-white font-medium">{track.name}</p>
                <p className="text-gray-300 text-sm">{track.artist}</p>
                <p className="text-gray-400 text-xs">
                  {track.bpm} BPM • {track.plays.toLocaleString()} plays
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => loadTrack(track, 'deck1')}
                  className="px-3 py-1 bg-blue-500 hover:bg-blue-600 rounded text-sm"
                >
                  Deck A
                </button>
                <button
                  onClick={() => loadTrack(track, 'deck2')}
                  className="px-3 py-1 bg-purple-500 hover:bg-purple-600 rounded text-sm"
                >
                  Deck B
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const BlockchainPanel = () => (
    <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
      <h3 className="text-white font-bold text-lg mb-4 flex items-center">
        <Coins className="w-5 h-5 mr-2" />
        Blockchain Analytics
      </h3>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg p-4">
          <p className="text-white text-sm">MIX Tokens</p>
          <p className="text-white text-2xl font-bold">{tokenBalance}</p>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg p-4">
          <p className="text-white text-sm">Earnings (ETH)</p>
          <p className="text-white text-2xl font-bold">{earnings}</p>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="bg-gray-700 rounded-lg p-3">
          <p className="text-white font-medium">Smart Contract Activity</p>
          <p className="text-gray-300 text-sm">Last royalty distribution: 2 hours ago</p>
          <p className="text-green-400 text-sm">✓ 15 artists paid automatically</p>
        </div>
        
        <div className="bg-gray-700 rounded-lg p-3">
          <p className="text-white font-medium">NFT Collections</p>
          <p className="text-gray-300 text-sm">Limited Edition Summer Mix #001</p>
          <p className="text-blue-400 text-sm">→ 50/100 minted</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-lg border-b border-gray-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Disc3 className="w-8 h-8 text-blue-500 animate-spin" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                MixChain AI
              </h1>
            </div>
            
            <nav className="flex space-x-6">
              <button
                onClick={() => setActiveTab('mixer')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'mixer' ? 'bg-blue-500' : 'hover:bg-gray-700'
                }`}
              >
                Mixer
              </button>
              <button
                onClick={() => setActiveTab('library')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'library' ? 'bg-blue-500' : 'hover:bg-gray-700'
                }`}
              >
                Library
              </button>
              <button
                onClick={() => setActiveTab('blockchain')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'blockchain' ? 'bg-blue-500' : 'hover:bg-gray-700'
                }`}
              >
                Blockchain
              </button>
            </nav>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-gray-800 px-3 py-2 rounded-lg">
                <Coins className="w-4 h-4 text-yellow-500" />
                <span className="font-mono">{tokenBalance}</span>
              </div>
              <button className="bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-colors">
                Go Live
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {activeTab === 'mixer' && (
          <div className="space-y-6">
            {/* AI Controls */}
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-yellow-500" />
                  AI-Enhanced Mixing
                </h2>
                <button
                  onClick={() => setAiSyncEnabled(!aiSyncEnabled)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    aiSyncEnabled 
                      ? 'bg-green-500 hover:bg-green-600' 
                      : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                >
                  {aiSyncEnabled ? 'AI Sync ON' : 'AI Sync OFF'}
                </button>
              </div>
              
              {aiSyncEnabled && (
                <div className="bg-green-900/30 border border-green-500 rounded-lg p-3">
                  <p className="text-green-400 text-sm">
                    ✓ AI has automatically synced BPM between decks for harmonic mixing
                  </p>
                </div>
              )}
            </div>

            {/* Mixer Interface */}
            <div className="grid lg:grid-cols-3 gap-6">
              <DeckComponent deckId="deck1" track={loadedTracks.deck1} isPlaying={isPlaying.deck1} />
              
              {/* Center Crossfader */}
              <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
                <h3 className="text-white font-bold text-lg mb-4 text-center">Crossfader</h3>
                
                <div className="relative mb-8">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={crossfaderPosition}
                    onChange={(e) => setCrossfaderPosition(parseInt(e.target.value))}
                    className="w-full h-4 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${crossfaderPosition}%, #6b7280 ${crossfaderPosition}%, #6b7280 100%)`
                    }}
                  />
                  <div className="flex justify-between text-sm text-gray-400 mt-2">
                    <span>A</span>
                    <span>B</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-gray-300 text-sm">Mix Position</p>
                    <p className="text-white text-xl font-mono">{crossfaderPosition}%</p>
                  </div>
                  
                  <button className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 py-3 rounded-lg transition-colors">
                    <Upload className="w-5 h-5 inline mr-2" />
                    Upload Mix
                  </button>
                  
                  <button className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 py-3 rounded-lg transition-colors">
                    <Users className="w-5 h-5 inline mr-2" />
                    Collaborate Live
                  </button>
                </div>
              </div>

              <DeckComponent deckId="deck2" track={loadedTracks.deck2} isPlaying={isPlaying.deck2} />
            </div>
          </div>
        )}

        {activeTab === 'library' && <TrackLibrary />}
        {activeTab === 'blockchain' && <BlockchainPanel />}
      </div>

      {/* Footer */}
      <footer className="bg-black/20 backdrop-blur-lg border-t border-gray-800 mt-12">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <p className="text-gray-400">
              © 2024 MixChain AI - Powered by AI & Blockchain Technology
            </p>
            <div className="flex items-center space-x-4 text-gray-400">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm">1,247 DJs online</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DJPlatformMVP;