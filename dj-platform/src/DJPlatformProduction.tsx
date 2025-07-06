import React, { useState, useEffect, useRef } from 'react';
import {
  Play, Pause, Upload, Menu, X,
  Radio, Save, Disc3,
  Zap, TrendingUp, Coins, Music, Eye, Atom
} from 'lucide-react';

import AudioEngine, { AudioTrack, HotCue, LoopInfo } from './utils/AudioEngine';
import WaveformDisplay from './components/WaveformDisplay';
import HotCueSystem from './components/HotCueSystem';
import LoopSystem from './components/LoopSystem';

// Advanced visualizer imports
import NeuralHarmonyConstellation from './visualizers/NeuralHarmonyConstellation';
import BlockchainBeatSculptor from './visualizers/BlockchainBeatSculptor';
import QuantumMixReactor from './visualizers/QuantumMixReactor';
import SynapticSoundNetworks from './visualizers/SynapticSoundNetworks';
import HolographicDNASequencer from './visualizers/HolographicDNASequencer';
import CyberneticEcosystem from './visualizers/CyberneticEcosystem';
import TemporalRiftGenerator from './visualizers/TemporalRiftGenerator';

interface DeckState {
  track: AudioTrack | null;
  isPlaying: boolean;
  currentTime: number;
  volume: number;
  gain: number;
  eq: { high: number; mid: number; low: number };
  hotCues: HotCue[];
  loop: LoopInfo | null;
  pitchBend: number;
  keyLock: boolean;
  reverse: boolean;
  slip: boolean;
}

const DJPlatformProduction: React.FC = () => {
  // Audio Engine
  const audioEngineRef = useRef<AudioEngine | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // UI State
  const [isInitialized, setIsInitialized] = useState(false);
  const [activeVisualizer, setActiveVisualizer] = useState('neural');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  
  // Deck States
  const [deckA, setDeckA] = useState<DeckState>({
    track: null,
    isPlaying: false,
    currentTime: 0,
    volume: 80,
    gain: 0,
    eq: { high: 0, mid: 0, low: 0 },
    hotCues: [],
    loop: null,
    pitchBend: 0,
    keyLock: false,
    reverse: false,
    slip: false
  });
  
  const [deckB, setDeckB] = useState<DeckState>({
    track: null,
    isPlaying: false,
    currentTime: 0,
    volume: 80,
    gain: 0,
    eq: { high: 0, mid: 0, low: 0 },
    hotCues: [],
    loop: null,
    pitchBend: 0,
    keyLock: false,
    reverse: false,
    slip: false
  });
  
  // Mixer State
  const [crossfaderPosition, setCrossfaderPosition] = useState(50);
  const [masterVolume, setMasterVolume] = useState(80);
  const [headphoneVolume, setHeadphoneVolume] = useState(70);
  const [headphoneCue, setHeadphoneCue] = useState<'A' | 'B' | 'Master'>('Master');
  
  // Performance & Blockchain
  const [tokenBalance, setTokenBalance] = useState(2847);
  const [earnings, setEarnings] = useState(156.75);
  const [performance] = useState({
    mix_quality: 92,
    crowd_response: 87,
    technical_skill: 94,
    creativity: 89
  });
  
  // Audio Analysis
  const [audioData, setAudioData] = useState<{deckA: number[], deckB: number[]}>({
    deckA: new Array(256).fill(0),
    deckB: new Array(256).fill(0)
  });

  // Initialize audio engine
  useEffect(() => {
    const initAudio = async () => {
      try {
        audioEngineRef.current = new AudioEngine();
        await audioEngineRef.current.resumeContext();
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize audio:', error);
      }
    };

    initAudio();

    // Detect mobile
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Audio analysis loop
  useEffect(() => {
    if (!isInitialized) return;

    const updateAudioData = () => {
      if (audioEngineRef.current) {
        const frequency = audioEngineRef.current.getFrequencyData();
        setAudioData({
          deckA: Array.from(frequency).map(v => v / 255),
          deckB: Array.from(frequency).map(v => v / 255)
        });
      }
      requestAnimationFrame(updateAudioData);
    };

    updateAudioData();
  }, [isInitialized]);

  // Recording timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // File upload handler
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, deck: 'A' | 'B') => {
    const file = event.target.files?.[0];
    if (!file || !audioEngineRef.current) return;

    try {
      const track = await audioEngineRef.current.loadAudioFile(file);
      const processedTrack = audioEngineRef.current.createTrack(track, deck === 'A' ? 'left' : 'right');
      
      if (deck === 'A') {
        setDeckA(prev => ({ ...prev, track: processedTrack }));
      } else {
        setDeckB(prev => ({ ...prev, track: processedTrack }));
      }
      
      // Update token balance for successful upload
      setTokenBalance(prev => prev + 5);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  // Deck controls
  const handlePlay = (deck: 'A' | 'B') => {
    if (!audioEngineRef.current) return;

    const deckState = deck === 'A' ? deckA : deckB;
    const setDeckState = deck === 'A' ? setDeckA : setDeckB;

    if (deckState.track) {
      if (deckState.isPlaying) {
        audioEngineRef.current.stopTrack(deckState.track);
      } else {
        const newTrack = audioEngineRef.current.createTrack(deckState.track, deck === 'A' ? 'left' : 'right');
        audioEngineRef.current.playTrack(newTrack, deckState.currentTime);
        setDeckState(prev => ({ ...prev, track: newTrack }));
      }
      
      setDeckState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
      
      // Award tokens for mixing
      if (!deckState.isPlaying) {
        setTokenBalance(prev => prev + 2);
        setEarnings(prev => prev + 0.25);
      }
    }
  };

  const handleSeek = (deck: 'A' | 'B', time: number) => {
    const setDeckState = deck === 'A' ? setDeckA : setDeckB;
    setDeckState(prev => ({ ...prev, currentTime: time }));
  };

  const handleVolumeChange = (deck: 'A' | 'B', volume: number) => {
    const deckState = deck === 'A' ? deckA : deckB;
    const setDeckState = deck === 'A' ? setDeckA : setDeckB;
    
    if (audioEngineRef.current && deckState.track) {
      audioEngineRef.current.setTrackVolume(deckState.track, volume / 100);
    }
    
    setDeckState(prev => ({ ...prev, volume }));
  };

  const handleEQChange = (deck: 'A' | 'B', band: 'high' | 'mid' | 'low', value: number) => {
    const deckState = deck === 'A' ? deckA : deckB;
    const setDeckState = deck === 'A' ? setDeckA : setDeckB;
    
    const newEQ = { ...deckState.eq, [band]: value };
    
    if (audioEngineRef.current && deckState.track) {
      audioEngineRef.current.setEQ(deckState.track, newEQ);
    }
    
    setDeckState(prev => ({ ...prev, eq: newEQ }));
  };

  const handleCrossfader = (position: number) => {
    if (audioEngineRef.current) {
      audioEngineRef.current.setCrossfader(position / 100);
    }
    setCrossfaderPosition(position);
  };

  // Hot Cue handlers
  const handleSetHotCue = (deck: 'A' | 'B', cueNumber: number, position: number) => {
    const setDeckState = deck === 'A' ? setDeckA : setDeckB;
    setDeckState(prev => ({
      ...prev,
      hotCues: [...prev.hotCues.filter(c => c.id !== cueNumber), { id: cueNumber, position }]
    }));
  };

  const handleJumpToCue = (deck: 'A' | 'B', cueNumber: number) => {
    const deckState = deck === 'A' ? deckA : deckB;
    const cue = deckState.hotCues.find(c => c.id === cueNumber);
    if (cue) {
      handleSeek(deck, cue.position);
    }
  };

  const handleDeleteCue = (deck: 'A' | 'B', cueNumber: number) => {
    const setDeckState = deck === 'A' ? setDeckA : setDeckB;
    setDeckState(prev => ({
      ...prev,
      hotCues: prev.hotCues.filter(c => c.id !== cueNumber)
    }));
  };

  // Loop handlers
  const handleSetLoop = (deck: 'A' | 'B', start: number, end: number) => {
    const setDeckState = deck === 'A' ? setDeckA : setDeckB;
    const deckState = deck === 'A' ? deckA : deckB;
    
    const bpm = deckState.track?.bpm || 120;
    const beatLength = 60 / bpm;
    const lengthInBeats = (end - start) / beatLength;
    
    setDeckState(prev => ({
      ...prev,
      loop: { start, end, active: true, length: lengthInBeats }
    }));
  };

  const handleToggleLoop = (deck: 'A' | 'B') => {
    const setDeckState = deck === 'A' ? setDeckA : setDeckB;
    setDeckState(prev => ({
      ...prev,
      loop: prev.loop ? { ...prev.loop, active: !prev.loop.active } : null
    }));
  };

  // Recording handlers
  const handleStartRecording = async () => {
    if (!audioEngineRef.current) return;
    
    try {
      await audioEngineRef.current.startRecording();
      setIsRecording(true);
      setRecordingTime(0);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const handleStopRecording = async () => {
    if (!audioEngineRef.current) return;
    
    try {
      const blob = await audioEngineRef.current.stopRecording();
      setIsRecording(false);
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mix-${new Date().toISOString()}.webm`;
      a.click();
      
      // Award tokens for recording
      setTokenBalance(prev => prev + 50);
      setEarnings(prev => prev + 5.0);
    } catch (error) {
      console.error('Error stopping recording:', error);
    }
  };

  // Visualizer components
  const renderVisualizer = () => {
    const baseProps = {
      audioDataDeck1: audioData.deckA,
      audioDataDeck2: audioData.deckB,
      isPlaying1: deckA.isPlaying,
      isPlaying2: deckB.isPlaying,
      crossfaderPosition,
      bpm1: deckA.track?.bpm || 120,
      bpm2: deckB.track?.bpm || 120,
      trackInfo1: deckA.track,
      trackInfo2: deckB.track
    };

    switch (activeVisualizer) {
      case 'neural': 
        return <NeuralHarmonyConstellation 
          audioData={audioData.deckA}
          isPlaying={deckA.isPlaying || deckB.isPlaying}
          bpm={deckA.track?.bpm || deckB.track?.bpm || 120}
          musicalKey={deckA.track?.key || deckB.track?.key || 'C'}
          harmonicCompatibility={85}
        />;
      case 'blockchain': 
        return <BlockchainBeatSculptor 
          audioData={audioData.deckA}
          isPlaying={deckA.isPlaying || deckB.isPlaying}
          genre="Electronic"
          energy={(deckA.isPlaying ? 85 : 0) + (deckB.isPlaying ? 85 : 0)}
          tokenBalance={tokenBalance}
          recentTransactions={[]}
          royaltyPayments={[]}
        />;
      case 'quantum': 
        return <QuantumMixReactor 
          audioDataDeck1={audioData.deckA}
          audioDataDeck2={audioData.deckB}
          crossfaderPosition={crossfaderPosition}
          isPlaying1={deckA.isPlaying}
          isPlaying2={deckB.isPlaying}
          bpm1={deckA.track?.bpm || 120}
          bpm2={deckB.track?.bpm || 120}
        />;
      case 'synaptic': 
        return <SynapticSoundNetworks 
          audioDataDeck1={audioData.deckA}
          audioDataDeck2={audioData.deckB}
          trackInfo1={deckA.track ? {
            name: deckA.track.name,
            key: deckA.track.key || 'C',
            bpm: deckA.track.bpm || 120,
            genre: 'Electronic'
          } : undefined}
          trackInfo2={deckB.track ? {
            name: deckB.track.name,
            key: deckB.track.key || 'C',
            bpm: deckB.track.bpm || 120,
            genre: 'Electronic'
          } : undefined}
          mixProgress={crossfaderPosition}
          isPlaying1={deckA.isPlaying}
          isPlaying2={deckB.isPlaying}
        />;
      case 'dna': return <HolographicDNASequencer {...baseProps} />;
      case 'ecosystem': return <CyberneticEcosystem {...baseProps} />;
      case 'temporal': return <TemporalRiftGenerator {...baseProps} />;
      default: 
        return <NeuralHarmonyConstellation 
          audioData={audioData.deckA}
          isPlaying={deckA.isPlaying || deckB.isPlaying}
          bpm={deckA.track?.bpm || deckB.track?.bpm || 120}
          musicalKey={deckA.track?.key || deckB.track?.key || 'C'}
          harmonicCompatibility={85}
        />;
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 
                      flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent 
                         rounded-full mx-auto mb-4"></div>
          <h2 className="text-xl font-bold mb-2">Initializing Audio Engine</h2>
          <p className="text-gray-300">Setting up professional DJ platform...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 
                    text-white overflow-hidden">
      
      {/* Header */}
      <header className="bg-black bg-opacity-30 backdrop-blur-sm border-b border-gray-700 p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Disc3 className="w-8 h-8 text-blue-400" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 
                          bg-clip-text text-transparent">
              DJ Platform Pro
            </h1>
          </div>
          
          {/* Performance Stats */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-yellow-400" />
              <span className="font-semibold">{tokenBalance.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <span className="font-semibold">${earnings.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-400" />
              <span className="font-semibold">{performance.mix_quality}%</span>
            </div>
          </div>
          
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-700 rounded"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-screen">
        
        {/* Sidebar - Visualizers & Controls */}
        <div className={`
          ${isMobile ? (isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}
          fixed md:relative w-80 md:w-96 h-full bg-black bg-opacity-40 backdrop-blur-sm
          border-r border-gray-700 transition-transform duration-300 z-50 overflow-y-auto
        `}>
          
          {/* Visualizer Selection */}
          <div className="p-4 border-b border-gray-700">
            <h3 className="text-lg font-semibold mb-4">Visual Engine</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'neural', name: 'Neural', icon: Atom },
                { id: 'blockchain', name: 'Blockchain', icon: Zap },
                { id: 'quantum', name: 'Quantum', icon: TrendingUp },
                { id: 'synaptic', name: 'Synaptic', icon: Music },
                { id: 'dna', name: 'DNA', icon: Eye },
                { id: 'ecosystem', name: 'Ecosystem', icon: Atom },
                { id: 'temporal', name: 'Temporal', icon: TrendingUp }
              ].map(({ id, name, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveVisualizer(id)}
                  className={`
                    p-3 rounded-lg border transition-all text-sm
                    ${activeVisualizer === id
                      ? 'bg-blue-600 border-blue-400 text-white'
                      : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700'
                    }
                  `}
                >
                  <Icon className="w-4 h-4 mx-auto mb-1" />
                  {name}
                </button>
              ))}
            </div>
          </div>

          {/* Recording Controls */}
          <div className="p-4 border-b border-gray-700">
            <h3 className="text-lg font-semibold mb-4">Recording</h3>
            <div className="space-y-3">
              {!isRecording ? (
                <button
                  onClick={handleStartRecording}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 
                           bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                >
                  <Radio className="w-5 h-5" />
                  Start Recording
                </button>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={handleStopRecording}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 
                             bg-red-600 hover:bg-red-700 rounded-lg transition-colors animate-pulse"
                  >
                    <Save className="w-5 h-5" />
                    Stop & Save ({formatTime(recordingTime)})
                  </button>
                  <div className="text-center text-sm text-red-400">
                    🔴 Recording in progress
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Master Controls */}
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">Master</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Master Volume</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={masterVolume}
                  onChange={(e) => setMasterVolume(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Headphone Volume</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={headphoneVolume}
                  onChange={(e) => setHeadphoneVolume(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Headphone Cue</label>
                <div className="flex gap-1">
                  {['A', 'B', 'Master'].map((option) => (
                    <button
                      key={option}
                      onClick={() => setHeadphoneCue(option as any)}
                      className={`
                        flex-1 px-3 py-2 text-sm rounded transition-colors
                        ${headphoneCue === option
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }
                      `}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main DJ Console */}
        <div className="flex-1 p-4 overflow-y-auto">
          
          {/* Visualizer */}
          <div className="mb-6 rounded-xl overflow-hidden border border-gray-700">
            {renderVisualizer()}
          </div>

          {/* DJ Decks Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Deck A */}
            <div className="bg-black bg-opacity-40 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-blue-400">Deck A</h2>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*"
                  onChange={(e) => handleFileUpload(e, 'A')}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 
                           rounded transition-colors text-sm"
                >
                  <Upload className="w-4 h-4" />
                  Load Track
                </button>
              </div>

              {/* Track Info */}
              {deckA.track && (
                <div className="mb-4 p-3 bg-gray-800 rounded">
                  <div className="text-sm font-medium">{deckA.track.name}</div>
                  <div className="text-xs text-gray-400">{deckA.track.artist}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {deckA.track.bpm} BPM • {deckA.track.key} • {formatTime(deckA.track.duration || 0)}
                  </div>
                </div>
              )}

              {/* Waveform */}
              {deckA.track && (
                <WaveformDisplay
                  track={deckA.track}
                  isPlaying={deckA.isPlaying}
                  currentTime={deckA.currentTime}
                  duration={deckA.track.duration || 0}
                  hotCues={deckA.hotCues}
                  loop={deckA.loop}
                  onSeek={(time) => handleSeek('A', time)}
                  onSetHotCue={(cue, time) => handleSetHotCue('A', cue, time)}
                  onJumpToCue={(cue) => handleJumpToCue('A', cue)}
                  onSetLoop={(start, end) => handleSetLoop('A', start, end)}
                  className="mb-4"
                />
              )}

              {/* Deck Controls */}
              <div className="space-y-4">
                <div className="flex justify-center">
                  <button
                    onClick={() => handlePlay('A')}
                    disabled={!deckA.track}
                    className={`
                      w-16 h-16 rounded-full flex items-center justify-center transition-all
                      ${deckA.isPlaying
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-green-600 hover:bg-green-700'
                      }
                      disabled:bg-gray-600 disabled:cursor-not-allowed
                    `}
                  >
                    {deckA.isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
                  </button>
                </div>

                {/* Volume */}
                <div>
                  <label className="block text-sm font-medium mb-2">Volume</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={deckA.volume}
                    onChange={(e) => handleVolumeChange('A', Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                {/* EQ */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium">EQ</label>
                  {(['high', 'mid', 'low'] as const).map((band) => (
                    <div key={band} className="flex items-center gap-3">
                      <span className="w-12 text-xs uppercase">{band}</span>
                      <input
                        type="range"
                        min="-12"
                        max="12"
                        value={deckA.eq[band]}
                        onChange={(e) => handleEQChange('A', band, Number(e.target.value))}
                        className="flex-1"
                      />
                      <span className="w-8 text-xs">{deckA.eq[band]}dB</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hot Cues */}
              <HotCueSystem
                hotCues={deckA.hotCues}
                onSetCue={(cue, pos) => handleSetHotCue('A', cue, pos)}
                onJumpToCue={(cue) => handleJumpToCue('A', cue)}
                onDeleteCue={(cue) => handleDeleteCue('A', cue)}
                currentTime={deckA.currentTime}
                className="mt-4"
              />
            </div>

            {/* Mixer */}
            <div className="bg-black bg-opacity-40 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold text-center mb-6">Mixer</h2>
              
              {/* Crossfader */}
              <div className="mb-8">
                <label className="block text-sm font-medium mb-4 text-center">Crossfader</label>
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={crossfaderPosition}
                    onChange={(e) => handleCrossfader(Number(e.target.value))}
                    className="w-full h-8 bg-gray-700 rounded-lg appearance-none slider"
                  />
                  <div className="flex justify-between text-xs mt-2">
                    <span>A</span>
                    <span className="font-bold">{crossfaderPosition}%</span>
                    <span>B</span>
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Performance</h3>
                {Object.entries(performance).map(([key, value]) => (
                  <div key={key}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="capitalize">{key.replace('_', ' ')}</span>
                      <span>{value}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Blockchain Stats */}
              <div className="mt-6 space-y-3">
                <h3 className="text-lg font-semibold">Blockchain</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">{tokenBalance.toLocaleString()}</div>
                    <div className="text-xs text-gray-400">MIX Tokens</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">${earnings.toFixed(2)}</div>
                    <div className="text-xs text-gray-400">Earnings</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Deck B */}
            <div className="bg-black bg-opacity-40 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-purple-400">Deck B</h2>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 
                           rounded transition-colors text-sm"
                >
                  <Upload className="w-4 h-4" />
                  Load Track
                </button>
              </div>

              {/* Track Info */}
              {deckB.track && (
                <div className="mb-4 p-3 bg-gray-800 rounded">
                  <div className="text-sm font-medium">{deckB.track.name}</div>
                  <div className="text-xs text-gray-400">{deckB.track.artist}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {deckB.track.bpm} BPM • {deckB.track.key} • {formatTime(deckB.track.duration || 0)}
                  </div>
                </div>
              )}

              {/* Waveform */}
              {deckB.track && (
                <WaveformDisplay
                  track={deckB.track}
                  isPlaying={deckB.isPlaying}
                  currentTime={deckB.currentTime}
                  duration={deckB.track.duration || 0}
                  hotCues={deckB.hotCues}
                  loop={deckB.loop}
                  onSeek={(time) => handleSeek('B', time)}
                  onSetHotCue={(cue, time) => handleSetHotCue('B', cue, time)}
                  onJumpToCue={(cue) => handleJumpToCue('B', cue)}
                  onSetLoop={(start, end) => handleSetLoop('B', start, end)}
                  className="mb-4"
                />
              )}

              {/* Deck Controls */}
              <div className="space-y-4">
                <div className="flex justify-center">
                  <button
                    onClick={() => handlePlay('B')}
                    disabled={!deckB.track}
                    className={`
                      w-16 h-16 rounded-full flex items-center justify-center transition-all
                      ${deckB.isPlaying
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-green-600 hover:bg-green-700'
                      }
                      disabled:bg-gray-600 disabled:cursor-not-allowed
                    `}
                  >
                    {deckB.isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
                  </button>
                </div>

                {/* Volume */}
                <div>
                  <label className="block text-sm font-medium mb-2">Volume</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={deckB.volume}
                    onChange={(e) => handleVolumeChange('B', Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                {/* EQ */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium">EQ</label>
                  {(['high', 'mid', 'low'] as const).map((band) => (
                    <div key={band} className="flex items-center gap-3">
                      <span className="w-12 text-xs uppercase">{band}</span>
                      <input
                        type="range"
                        min="-12"
                        max="12"
                        value={deckB.eq[band]}
                        onChange={(e) => handleEQChange('B', band, Number(e.target.value))}
                        className="flex-1"
                      />
                      <span className="w-8 text-xs">{deckB.eq[band]}dB</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hot Cues */}
              <HotCueSystem
                hotCues={deckB.hotCues}
                onSetCue={(cue, pos) => handleSetHotCue('B', cue, pos)}
                onJumpToCue={(cue) => handleJumpToCue('B', cue)}
                onDeleteCue={(cue) => handleDeleteCue('B', cue)}
                currentTime={deckB.currentTime}
                className="mt-4"
              />
            </div>
          </div>

          {/* Loop Systems */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <LoopSystem
              loop={deckA.loop}
              currentTime={deckA.currentTime}
              bpm={deckA.track?.bpm || 120}
              isPlaying={deckA.isPlaying}
              onSetLoop={(start, end) => handleSetLoop('A', start, end)}
              onToggleLoop={() => handleToggleLoop('A')}
              onClearLoop={() => setDeckA(prev => ({ ...prev, loop: null }))}
              onBeatLoop={(beats) => {
                const beatLength = (60 / (deckA.track?.bpm || 120)) * beats;
                handleSetLoop('A', deckA.currentTime, deckA.currentTime + beatLength);
              }}
              onLoopRoll={() => {}} // Implement loop roll
            />
            
            <LoopSystem
              loop={deckB.loop}
              currentTime={deckB.currentTime}
              bpm={deckB.track?.bpm || 120}
              isPlaying={deckB.isPlaying}
              onSetLoop={(start, end) => handleSetLoop('B', start, end)}
              onToggleLoop={() => handleToggleLoop('B')}
              onClearLoop={() => setDeckB(prev => ({ ...prev, loop: null }))}
              onBeatLoop={(beats) => {
                const beatLength = (60 / (deckB.track?.bpm || 120)) * beats;
                handleSetLoop('B', deckB.currentTime, deckB.currentTime + beatLength);
              }}
              onLoopRoll={() => {}} // Implement loop roll
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DJPlatformProduction;