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
  
  // Create demo tracks for immediate playability
  const createDemoTrack = (name: string, artist: string, bpm: number, key: string): AudioTrack => ({
    id: `demo-${name.toLowerCase().replace(' ', '-')}`,
    name,
    artist,
    file: new File([], `${name}.mp3`, { type: 'audio/mp3' }),
    bpm,
    key,
    duration: 180, // 3 minutes
    waveformData: Array.from({ length: 1000 }, () => Math.random() * 0.8 + 0.1)
  });

  // Deck States
  const [deckA, setDeckA] = useState<DeckState>({
    track: createDemoTrack('Summer Vibes', 'DJ Alex', 128, 'Am'),
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
    track: createDemoTrack('Night Drive', 'Luna Music', 132, 'Gm'),
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

  // Mobile audio context reference for direct control
  const mobileAudioRef = useRef<{
    context?: AudioContext;
    oscillators?: { [key: string]: OscillatorNode };
  }>({});

  // Initialize mobile-friendly audio
  const initMobileAudio = async () => {
    try {
      if (!mobileAudioRef.current.context) {
        mobileAudioRef.current.context = new (window.AudioContext || (window as any).webkitAudioContext)();
        mobileAudioRef.current.oscillators = {};
        console.log('Mobile audio context created');
      }
      
      if (mobileAudioRef.current.context.state === 'suspended') {
        await mobileAudioRef.current.context.resume();
        console.log('Mobile audio context resumed');
      }
      
      return true;
    } catch (error) {
      console.error('Mobile audio initialization failed:', error);
      return false;
    }
  };

  // Initialize audio engine
  useEffect(() => {
    const initAudio = async () => {
      try {
        // Skip complex audio engine initialization on first load
        // Will be initialized on first play button press
        console.log('Deferring audio engine initialization until user interaction');
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize audio:', error);
        setIsInitialized(true);
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

  // Demo track time progression
  useEffect(() => {
    let interval: NodeJS.Timeout;
    const updatePlaybackTime = () => {
      if (deckA.isPlaying) {
        setDeckA(prev => ({
          ...prev,
          currentTime: Math.min((prev.currentTime + 1), prev.track?.duration || 180)
        }));
      }
      if (deckB.isPlaying) {
        setDeckB(prev => ({
          ...prev,
          currentTime: Math.min((prev.currentTime + 1), prev.track?.duration || 180)
        }));
      }
    };
    
    if (deckA.isPlaying || deckB.isPlaying) {
      interval = setInterval(updatePlaybackTime, 1000);
    }
    
    return () => clearInterval(interval);
  }, [deckA.isPlaying, deckB.isPlaying]);

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
  const handlePlay = async (deck: 'A' | 'B') => {
    const deckState = deck === 'A' ? deckA : deckB;
    const setDeckState = deck === 'A' ? setDeckA : setDeckB;

    console.log(`Attempting to ${deckState.isPlaying ? 'stop' : 'play'} deck ${deck}`);

    if (deckState.track) {
      // Try mobile audio first
      const mobileAudioReady = await initMobileAudio();
      
      if (mobileAudioReady && mobileAudioRef.current.context) {
        try {
          const audioContext = mobileAudioRef.current.context;
          const oscillators = mobileAudioRef.current.oscillators!;
          
          if (deckState.isPlaying) {
            // Stop audio
            if (oscillators[deck]) {
              oscillators[deck].stop();
              delete oscillators[deck];
              console.log(`Stopped mobile audio for deck ${deck}`);
            }
          } else {
            // Start audio - create a simple tone for demo
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            // Different frequencies for different decks to simulate tracks
            const frequency = deck === 'A' ? 220 : 330; // Lower frequencies, more pleasant
            oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
            oscillator.type = 'square'; // More electronic sound
            
            // Very low volume but audible
            gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
            
            // Add some modulation to make it more interesting
            const lfo = audioContext.createOscillator();
            const lfoGain = audioContext.createGain();
            lfo.connect(lfoGain);
            lfoGain.connect(oscillator.frequency);
            lfo.frequency.setValueAtTime(deck === 'A' ? 2 : 3, audioContext.currentTime);
            lfoGain.gain.setValueAtTime(10, audioContext.currentTime);
            lfo.start();
            
            oscillator.start();
            oscillators[deck] = oscillator;
            
            console.log(`Started mobile audio for deck ${deck} at ${frequency}Hz with modulation`);
          }
        } catch (error) {
          console.log('Mobile audio playback error:', error);
        }
      }

      // Try to initialize full audio engine if not already done
      if (!audioEngineRef.current && !deckState.isPlaying) {
        try {
          console.log('Attempting to initialize full audio engine...');
          audioEngineRef.current = new AudioEngine();
          await audioEngineRef.current.resumeContext();
          console.log('Full audio engine initialized successfully');
        } catch (error) {
          console.log('Full audio engine failed, continuing with mobile audio:', error);
        }
      }

      // Try to use full audio engine if available
      if (audioEngineRef.current) {
        try {
          if (deckState.isPlaying) {
            audioEngineRef.current.stopTrack(deckState.track);
          } else {
            const newTrack = audioEngineRef.current.createTrack(deckState.track, deck === 'A' ? 'left' : 'right');
            audioEngineRef.current.playTrack(newTrack, deckState.currentTime);
            setDeckState(prev => ({ ...prev, track: newTrack }));
          }
        } catch (error) {
          console.log('Full audio engine error, using mobile audio:', error);
        }
      }
      
      // Always toggle play state for UI feedback
      setDeckState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
      console.log(`Deck ${deck} is now ${!deckState.isPlaying ? 'playing' : 'stopped'}`);
      
      // Award tokens for mixing
      if (!deckState.isPlaying) {
        setTokenBalance(prev => prev + 2);
        setEarnings(prev => prev + 0.25);
      }

      // Provide haptic feedback on mobile
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
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
          <h2 className="text-xl font-bold mb-2">🎧 DJ Platform Ready</h2>
          <p className="text-gray-300 mb-4">Demo tracks loaded • Mobile optimized</p>
          <button 
            onClick={async () => {
              console.log('Initializing platform...');
              await initMobileAudio();
              setIsInitialized(true);
            }}
            className="px-6 py-3 bg-green-500 hover:bg-green-600 rounded-lg transition-colors font-medium text-lg shadow-lg"
          >
            🚀 Start DJing
          </button>
          <p className="text-xs text-gray-400 mt-3">Tap to enable audio on mobile devices</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`
      min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white
      ${isMobile ? 'overflow-x-hidden' : 'overflow-hidden'}
    `}>
      
      {/* Header */}
      <header className="bg-black bg-opacity-30 backdrop-blur-sm border-b border-gray-700 p-3 md:p-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
          {/* Top Row - Logo and Menu */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 md:gap-4">
              <Disc3 className="w-6 h-6 md:w-8 md:h-8 text-blue-400" />
              <h1 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 
                            bg-clip-text text-transparent">
                DJ Platform Pro
              </h1>
            </div>
            
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-700 rounded-lg touch-manipulation"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
          
          {/* Performance Stats - Mobile Optimized */}
          <div className="flex items-center justify-between md:gap-6">
            <div className="flex items-center gap-3 md:gap-6">
              <div className="flex items-center gap-1 md:gap-2 bg-gray-800 bg-opacity-50 px-2 py-1 rounded-lg">
                <Coins className="w-3 h-3 md:w-5 md:h-5 text-yellow-400" />
                <span className="font-semibold text-sm md:text-base">{tokenBalance.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1 md:gap-2 bg-gray-800 bg-opacity-50 px-2 py-1 rounded-lg">
                <TrendingUp className="w-3 h-3 md:w-5 md:h-5 text-green-400" />
                <span className="font-semibold text-sm md:text-base">${earnings.toFixed(2)}</span>
              </div>
              <div className="hidden sm:flex items-center gap-1 md:gap-2 bg-gray-800 bg-opacity-50 px-2 py-1 rounded-lg">
                <Zap className="w-3 h-3 md:w-5 md:h-5 text-purple-400" />
                <span className="font-semibold text-sm md:text-base">{performance.mix_quality}%</span>
              </div>
            </div>
            
            {/* Recording Status - Mobile Visible */}
            {isRecording && (
              <div className="flex items-center gap-1 bg-red-600 bg-opacity-20 px-2 py-1 rounded-lg animate-pulse">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-xs text-red-400">{formatTime(recordingTime)}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className={`flex flex-col md:flex-row ${isMobile ? 'h-auto min-h-screen' : 'h-screen'}`}>
        
        {/* Sidebar - Visualizers & Controls */}
        <div className={`
          ${isMobile ? (isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}
          ${isMobile ? 'fixed' : 'md:relative'} w-full md:w-80 lg:w-96 
          ${isMobile ? 'h-screen' : 'h-full'}
          bg-black bg-opacity-50 backdrop-blur-sm border-r border-gray-700 
          transition-transform duration-300 z-50 overflow-y-auto
          ${isMobile ? 'top-0 left-0 pt-20' : ''}
        `}>
          
          {/* Mobile Back Button */}
          {isMobile && (
            <div className="p-4 border-b border-gray-700">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 
                         bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors mb-4"
              >
                <X className="w-5 h-5" />
                Back to Mixer
              </button>
            </div>
          )}

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
        <div className={`flex-1 p-2 md:p-4 ${isMobile ? 'overflow-visible pb-20' : 'overflow-y-auto'}`}>
          
          {/* Visualizer - Responsive Height with Mobile Controls */}
          <div className="mb-4 md:mb-6 rounded-xl overflow-hidden border border-gray-700">
            {isMobile && (
              <div className="bg-black bg-opacity-50 p-2 flex justify-between items-center border-b border-gray-600">
                <span className="text-sm font-medium">Visual: {activeVisualizer}</span>
                <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs transition-colors touch-manipulation"
                >
                  <Eye className="w-4 h-4 inline mr-1" />
                  Change
                </button>
              </div>
            )}
            <div className="h-48 md:h-64 lg:h-80">
              {renderVisualizer()}
            </div>
          </div>

          {/* Mobile Controls - Quick Access */}
          {isMobile && (
            <div className="mb-3 bg-black bg-opacity-80 backdrop-blur-sm rounded-lg p-4 border-2 border-blue-500 shadow-xl relative z-10 mx-1">
              {/* Mobile Play Controls - Prominent */}
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-white mb-4">🎧 DJ Controls</h3>
                <div className="flex justify-center items-center gap-6">
                  <div className="flex flex-col items-center gap-2">
                    <button
                      onClick={() => {
                        console.log('Deck A button clicked');
                        handlePlay('A');
                      }}
                      onTouchStart={(e) => {
                        e.preventDefault();
                        console.log('Deck A touch started');
                      }}
                      className={`
                        w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-xl border-4
                        ${deckA.isPlaying 
                          ? 'bg-red-600 hover:bg-red-700 border-red-300 animate-pulse' 
                          : 'bg-green-500 hover:bg-green-600 border-green-300'
                        }
                        touch-manipulation active:scale-90 transform hover:scale-105 cursor-pointer
                      `}
                      style={{ WebkitTapHighlightColor: 'transparent' }}
                    >
                      {deckA.isPlaying ? <Pause className="w-8 h-8 text-white" /> : <Play className="w-8 h-8 text-white" />}
                    </button>
                    <span className="text-sm font-bold text-white">DECK A</span>
                    <span className="text-xs text-blue-300 font-medium">{deckA.track?.name || 'No Track'}</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <button
                      onClick={() => {
                        console.log('Deck B button clicked');
                        handlePlay('B');
                      }}
                      onTouchStart={(e) => {
                        e.preventDefault();
                        console.log('Deck B touch started');
                      }}
                      className={`
                        w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-xl border-4
                        ${deckB.isPlaying 
                          ? 'bg-red-600 hover:bg-red-700 border-red-300 animate-pulse' 
                          : 'bg-purple-500 hover:bg-purple-600 border-purple-300'
                        }
                        touch-manipulation active:scale-90 transform hover:scale-105 cursor-pointer
                      `}
                      style={{ WebkitTapHighlightColor: 'transparent' }}
                    >
                      {deckB.isPlaying ? <Pause className="w-8 h-8 text-white" /> : <Play className="w-8 h-8 text-white" />}
                    </button>
                    <span className="text-sm font-bold text-white">DECK B</span>
                    <span className="text-xs text-purple-300 font-medium">{deckB.track?.name || 'No Track'}</span>
                  </div>
                </div>
              </div>

              {/* Mobile Debug Info */}
              {isMobile && (
                <div className="mb-3 text-center">
                  <div className="text-xs text-gray-400 bg-gray-800 bg-opacity-50 rounded px-2 py-1 inline-block">
                    🔊 Audio: {mobileAudioRef.current.context ? 'Ready' : 'Initializing'} | 
                    Engine: {audioEngineRef.current ? 'Loaded' : 'Demo'}
                  </div>
                </div>
              )}
              
              {/* Mobile Crossfader - Compact */}
              <div className="mb-3">
                <label className="block text-xs font-medium mb-1 text-center">Crossfader</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={crossfaderPosition}
                  onChange={(e) => handleCrossfader(Number(e.target.value))}
                  className="w-full h-6 bg-gray-700 rounded-lg appearance-none touch-manipulation"
                  style={{
                    background: `linear-gradient(90deg, #3b82f6 0%, #3b82f6 ${crossfaderPosition}%, #6b7280 ${crossfaderPosition}%, #6b7280 100%)`
                  }}
                />
                <div className="flex justify-between text-xs mt-1">
                  <span className="text-blue-400">A</span>
                  <span className="font-bold text-xs">{crossfaderPosition}%</span>
                  <span className="text-purple-400">B</span>
                </div>
              </div>
              
              {/* Upload Controls - Mobile */}
              <div className="mb-3">
                <div className="grid grid-cols-2 gap-2">
                  <label className="flex flex-col items-center justify-center p-2 bg-gray-700 hover:bg-gray-600 rounded-lg cursor-pointer transition-colors text-xs touch-manipulation min-h-12">
                    <Upload className="w-4 h-4 mb-1" />
                    Load A
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="audio/*"
                      onChange={(e) => handleFileUpload(e, 'A')}
                      className="hidden"
                    />
                  </label>
                  <label className="flex flex-col items-center justify-center p-2 bg-gray-700 hover:bg-gray-600 rounded-lg cursor-pointer transition-colors text-xs touch-manipulation min-h-12">
                    <Upload className="w-4 h-4 mb-1" />
                    Load B
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={(e) => handleFileUpload(e, 'B')}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Recording Button - Compact */}
              <div>
                {!isRecording ? (
                  <button
                    onClick={handleStartRecording}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 
                             bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-sm
                             touch-manipulation min-h-10"
                  >
                    <Radio className="w-3 h-3" />
                    Record
                  </button>
                ) : (
                  <button
                    onClick={handleStopRecording}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 
                             bg-red-600 hover:bg-red-700 rounded-lg transition-colors animate-pulse text-sm
                             touch-manipulation min-h-10"
                  >
                    <Save className="w-3 h-3" />
                    Stop ({formatTime(recordingTime)})
                  </button>
                )}
              </div>
            </div>
          )}

          {/* DJ Decks Layout - Mobile Optimized */}
          <div className={`
            ${isMobile 
              ? 'flex flex-col gap-4' 
              : 'grid grid-cols-1 lg:grid-cols-3 gap-6'
            }
          `}>
            
            {/* Deck A */}
            <div className={`
              bg-black bg-opacity-40 backdrop-blur-sm rounded-xl border border-gray-700
              ${isMobile ? 'p-4' : 'p-6'}
            `}>
              <div className="flex justify-between items-center mb-3 md:mb-4">
                <h2 className={`font-bold text-blue-400 ${isMobile ? 'text-lg' : 'text-xl'}`}>
                  Deck A
                </h2>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*"
                  onChange={(e) => handleFileUpload(e, 'A')}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className={`
                    flex items-center gap-2 bg-blue-600 hover:bg-blue-700 
                    rounded transition-colors
                    ${isMobile ? 'px-2 py-2 text-xs' : 'px-3 py-2 text-sm'}
                  `}
                >
                  <Upload className="w-3 h-3 md:w-4 md:h-4" />
                  {!isMobile && 'Load Track'}
                </button>
              </div>

              {/* Track Info */}
              {deckA.track && (
                <div className={`bg-gray-800 rounded ${isMobile ? 'mb-3 p-2' : 'mb-4 p-3'}`}>
                  <div className={`font-medium ${isMobile ? 'text-xs' : 'text-sm'}`}>
                    {deckA.track.name}
                  </div>
                  <div className={`text-gray-400 ${isMobile ? 'text-xs' : 'text-xs'}`}>
                    {deckA.track.artist}
                  </div>
                  <div className={`text-gray-400 mt-1 ${isMobile ? 'text-xs' : 'text-xs'}`}>
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
                  className={isMobile ? 'mb-3' : 'mb-4'}
                />
              )}

              {/* Deck Controls */}
              <div className={`${isMobile ? 'space-y-1' : 'space-y-4'}`}>
                {!isMobile && (
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
                )}

                {/* Volume */}
                <div>
                  <label className={`block font-medium ${isMobile ? 'text-xs mb-1' : 'text-sm mb-2'}`}>
                    Vol ({deckA.volume}%)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={deckA.volume}
                    onChange={(e) => handleVolumeChange('A', Number(e.target.value))}
                    className={`w-full ${isMobile ? 'h-5' : 'h-8'} bg-gray-700 rounded-lg appearance-none touch-manipulation`}
                    style={{
                      background: `linear-gradient(90deg, #3b82f6 0%, #3b82f6 ${deckA.volume}%, #374151 ${deckA.volume}%, #374151 100%)`
                    }}
                  />
                </div>

                {/* EQ - Ultra Compact for Mobile */}
                <div className={`${isMobile ? 'space-y-1' : 'space-y-2'}`}>
                  <label className={`block font-medium ${isMobile ? 'text-xs' : 'text-sm'}`}>
                    EQ
                  </label>
                  <div className={`${isMobile ? 'grid grid-cols-3 gap-1' : 'space-y-2'}`}>
                    {(['high', 'mid', 'low'] as const).map((band) => (
                      <div key={band} className={`${isMobile ? 'flex flex-col items-center' : 'flex items-center gap-3'}`}>
                        <span className={`text-xs uppercase ${isMobile ? 'mb-1' : 'w-12'}`}>
                          {band}
                        </span>
                        <input
                          type="range"
                          min="-12"
                          max="12"
                          value={deckA.eq[band]}
                          onChange={(e) => handleEQChange('A', band, Number(e.target.value))}
                          className={`${isMobile ? 'w-full h-4' : 'flex-1 h-6'} bg-gray-700 rounded-lg appearance-none touch-manipulation`}
                          style={{
                            background: `linear-gradient(90deg, ${deckA.eq[band] < 0 ? '#ef4444' : '#10b981'} 0%, ${deckA.eq[band] < 0 ? '#ef4444' : '#10b981'} ${((deckA.eq[band] + 12) / 24) * 100}%, #374151 ${((deckA.eq[band] + 12) / 24) * 100}%, #374151 100%)`
                          }}
                        />
                        <span className={`text-xs ${isMobile ? 'mt-1' : 'w-8'}`}>
                          {deckA.eq[band] > 0 ? '+' : ''}{deckA.eq[band]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Hot Cues - Conditional for Mobile */}
              {!isMobile && (
                <HotCueSystem
                  hotCues={deckA.hotCues}
                  onSetCue={(cue, pos) => handleSetHotCue('A', cue, pos)}
                  onJumpToCue={(cue) => handleJumpToCue('A', cue)}
                  onDeleteCue={(cue) => handleDeleteCue('A', cue)}
                  currentTime={deckA.currentTime}
                  className="mt-4"
                />
              )}

              {/* Mobile Hot Cues - Simplified */}
              {isMobile && deckA.hotCues.length > 0 && (
                <div className="mt-3">
                  <h4 className="text-xs font-medium text-white mb-2">Hot Cues</h4>
                  <div className="grid grid-cols-4 gap-1">
                    {deckA.hotCues.slice(0, 4).map((cue, index) => (
                      <button
                        key={cue.id}
                        onClick={() => handleJumpToCue('A', cue.id)}
                        className="p-2 bg-blue-600 hover:bg-blue-700 rounded text-xs text-white"
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Mixer - Mobile Optimized */}
            <div className={`
              bg-black bg-opacity-40 backdrop-blur-sm rounded-xl border border-gray-700
              ${isMobile ? 'p-4 order-first' : 'p-6'}
            `}>
              <h2 className={`font-bold text-center ${isMobile ? 'text-lg mb-4' : 'text-xl mb-6'}`}>
                Mixer
              </h2>
              
              {/* Crossfader - Hidden on Mobile (in Quick Controls) */}
              {!isMobile && (
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
              )}

              {/* Performance Metrics */}
              <div className={`${isMobile ? 'space-y-1' : 'space-y-4'}`}>
                <h3 className={`font-semibold ${isMobile ? 'text-sm' : 'text-lg'}`}>
                  Performance
                </h3>
                {Object.entries(performance).slice(0, isMobile ? 2 : 4).map(([key, value]) => (
                  <div key={key}>
                    <div className={`flex justify-between mb-1 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                      <span className="capitalize">{key.replace('_', ' ')}</span>
                      <span>{value}%</span>
                    </div>
                    <div className={`w-full bg-gray-700 rounded-full ${isMobile ? 'h-1' : 'h-2'}`}>
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${value}%`,
                          height: isMobile ? '4px' : '8px'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Blockchain Stats */}
              <div className={`mt-4 space-y-3 ${isMobile ? 'mt-3' : 'mt-6'}`}>
                <h3 className={`font-semibold ${isMobile ? 'text-base' : 'text-lg'}`}>
                  Blockchain
                </h3>
                <div className={`grid grid-cols-2 gap-3 ${isMobile ? 'gap-2' : 'gap-4'}`}>
                  <div className="text-center bg-gray-800 bg-opacity-50 p-3 rounded-lg">
                    <div className={`font-bold text-yellow-400 ${isMobile ? 'text-lg' : 'text-2xl'}`}>
                      {tokenBalance.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-400">MIX Tokens</div>
                  </div>
                  <div className="text-center bg-gray-800 bg-opacity-50 p-3 rounded-lg">
                    <div className={`font-bold text-green-400 ${isMobile ? 'text-lg' : 'text-2xl'}`}>
                      ${earnings.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-400">Earnings</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Deck B */}
            <div className={`
              bg-black bg-opacity-40 backdrop-blur-sm rounded-xl border border-gray-700
              ${isMobile ? 'p-4' : 'p-6'}
            `}>
              <div className="flex justify-between items-center mb-3 md:mb-4">
                <h2 className={`font-bold text-purple-400 ${isMobile ? 'text-lg' : 'text-xl'}`}>
                  Deck B
                </h2>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className={`
                    flex items-center gap-2 bg-purple-600 hover:bg-purple-700 
                    rounded transition-colors
                    ${isMobile ? 'px-2 py-2 text-xs' : 'px-3 py-2 text-sm'}
                  `}
                >
                  <Upload className="w-3 h-3 md:w-4 md:h-4" />
                  {!isMobile && 'Load Track'}
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

          {/* Loop Systems - Hidden on Mobile */}
          {!isMobile && (
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
          )}

          {/* Mobile Gesture Overlay - Compact */}
          {isMobile && (
            <div className="mt-3 mb-4 bg-black bg-opacity-40 backdrop-blur-sm rounded-lg p-3 border border-gray-700">
              <h3 className="text-sm font-bold mb-2 text-center">Touch Controls</h3>
              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <div className="bg-gray-800 bg-opacity-50 p-2 rounded">
                  <div className="text-blue-400 font-medium text-xs">Tap</div>
                  <div className="text-xs text-gray-400">Seek track</div>
                </div>
                <div className="bg-gray-800 bg-opacity-50 p-2 rounded">
                  <div className="text-purple-400 font-medium text-xs">Swipe</div>
                  <div className="text-xs text-gray-400">Fine control</div>
                </div>
                <div className="bg-gray-800 bg-opacity-50 p-2 rounded">
                  <div className="text-green-400 font-medium text-xs">Pinch</div>
                  <div className="text-xs text-gray-400">Zoom view</div>
                </div>
                <div className="bg-gray-800 bg-opacity-50 p-2 rounded">
                  <div className="text-yellow-400 font-medium text-xs">Hold</div>
                  <div className="text-xs text-gray-400">Set cue</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Overlay - Close sidebar when tapping outside */}
        {isMobile && isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default DJPlatformProduction;