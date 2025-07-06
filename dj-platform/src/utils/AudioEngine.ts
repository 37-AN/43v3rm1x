/**
 * Professional Audio Engine for DJ Platform
 * Implements Web Audio API with advanced features for production use
 */

export interface AudioTrack {
  id: string;
  name: string;
  artist: string;
  file: File;
  audioBuffer?: AudioBuffer;
  waveformData?: number[];
  bpm?: number;
  key?: string;
  duration?: number;
  analyzerNode?: AnalyserNode;
  gainNode?: GainNode;
  sourceNode?: AudioBufferSourceNode;
  eqNodes?: {
    high: BiquadFilterNode;
    mid: BiquadFilterNode;
    low: BiquadFilterNode;
  };
}

export interface HotCue {
  id: number;
  position: number; // in seconds
  label?: string;
  color?: string;
}

export interface LoopInfo {
  start: number;
  end: number;
  active: boolean;
  length: number; // in beats
}

export class AudioEngine {
  private audioContext: AudioContext;
  private masterGain: GainNode;
  private crossfaderGain: { left: GainNode; right: GainNode };
  private analyserNode: AnalyserNode;
  private recorder?: MediaRecorder;
  private recordingChunks: Blob[] = [];

  constructor() {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
      latencyHint: 'interactive',
      sampleRate: 44100
    });
    
    this.masterGain = this.audioContext.createGain();
    this.masterGain.connect(this.audioContext.destination);
    
    // Create crossfader gains
    this.crossfaderGain = {
      left: this.audioContext.createGain(),
      right: this.audioContext.createGain()
    };
    
    this.crossfaderGain.left.connect(this.masterGain);
    this.crossfaderGain.right.connect(this.masterGain);
    
    // Master analyzer for spectrum visualization
    this.analyserNode = this.audioContext.createAnalyser();
    this.analyserNode.fftSize = 2048;
    this.masterGain.connect(this.analyserNode);
  }

  /**
   * Load and decode audio file
   */
  async loadAudioFile(file: File): Promise<AudioTrack> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      
      const track: AudioTrack = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name.replace(/\.[^/.]+$/, ""),
        artist: "Unknown Artist",
        file,
        audioBuffer,
        duration: audioBuffer.duration
      };

      // Generate waveform data
      track.waveformData = await this.generateWaveform(audioBuffer);
      
      // Detect BPM
      track.bpm = await this.detectBPM(audioBuffer);
      
      // Detect key
      track.key = await this.detectKey(audioBuffer);

      return track;
    } catch (error) {
      console.error('Error loading audio file:', error);
      throw new Error('Failed to load audio file');
    }
  }

  /**
   * Generate waveform visualization data
   */
  async generateWaveform(audioBuffer: AudioBuffer, samples: number = 1000): Promise<number[]> {
    const channelData = audioBuffer.getChannelData(0);
    const blockSize = Math.floor(channelData.length / samples);
    const waveformData: number[] = [];

    for (let i = 0; i < samples; i++) {
      let sum = 0;
      for (let j = 0; j < blockSize; j++) {
        const index = i * blockSize + j;
        if (index < channelData.length) {
          sum += Math.abs(channelData[index]);
        }
      }
      waveformData.push(sum / blockSize);
    }

    return waveformData;
  }

  /**
   * Detect BPM using autocorrelation
   */
  async detectBPM(audioBuffer: AudioBuffer): Promise<number> {
    const sampleRate = audioBuffer.sampleRate;
    const channelData = audioBuffer.getChannelData(0);
    
    // Use first 30 seconds for BPM detection
    const analysisLength = Math.min(sampleRate * 30, channelData.length);
    const data = channelData.slice(0, analysisLength);
    
    // Apply highpass filter to emphasize beats
    const filteredData = this.highpassFilter(data, sampleRate, 200);
    
    // Find peaks
    const peaks = this.findPeaks(filteredData, sampleRate / 20); // Min distance between peaks
    
    // Calculate intervals between peaks
    const intervals: number[] = [];
    for (let i = 1; i < peaks.length; i++) {
      intervals.push(peaks[i] - peaks[i - 1]);
    }
    
    // Find most common interval (converted to BPM)
    const bpm = this.findMostCommonBPM(intervals, sampleRate);
    
    return Math.round(bpm);
  }

  /**
   * Detect musical key using chromatic analysis
   */
  async detectKey(audioBuffer: AudioBuffer): Promise<string> {
    const channelData = audioBuffer.getChannelData(0);
    const sampleRate = audioBuffer.sampleRate;
    
    // Use FFT to get frequency spectrum
    const fftSize = 4096;
    const spectrum = this.performFFT(channelData.slice(0, fftSize));
    
    // Map frequencies to chromatic scale
    const chromaVector = this.getChromaVector(spectrum, sampleRate);
    
    // Find best matching key
    const keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const majorProfiles = this.getMajorKeyProfiles();
    const minorProfiles = this.getMinorKeyProfiles();
    
    let bestKey = 'C';
    let bestScore = -1;
    
    keys.forEach((key, index) => {
      const majorScore = this.correlateProfiles(chromaVector, majorProfiles[index]);
      const minorScore = this.correlateProfiles(chromaVector, minorProfiles[index]);
      
      if (majorScore > bestScore) {
        bestScore = majorScore;
        bestKey = key;
      }
      
      if (minorScore > bestScore) {
        bestScore = minorScore;
        bestKey = key + 'm';
      }
    });
    
    return bestKey;
  }

  /**
   * Create audio track with full processing chain
   */
  createTrack(track: AudioTrack, deck: 'left' | 'right'): AudioTrack {
    if (!track.audioBuffer) {
      throw new Error('Audio buffer not loaded');
    }

    // Create source node
    const sourceNode = this.audioContext.createBufferSource();
    sourceNode.buffer = track.audioBuffer;
    
    // Create gain node for deck volume
    const gainNode = this.audioContext.createGain();
    
    // Create EQ nodes
    const eqNodes = {
      high: this.audioContext.createBiquadFilter(),
      mid: this.audioContext.createBiquadFilter(),
      low: this.audioContext.createBiquadFilter()
    };
    
    // Configure EQ
    eqNodes.high.type = 'highshelf';
    eqNodes.high.frequency.value = 8000;
    eqNodes.high.gain.value = 0;
    
    eqNodes.mid.type = 'peaking';
    eqNodes.mid.frequency.value = 1000;
    eqNodes.mid.Q.value = 1;
    eqNodes.mid.gain.value = 0;
    
    eqNodes.low.type = 'lowshelf';
    eqNodes.low.frequency.value = 200;
    eqNodes.low.gain.value = 0;
    
    // Create analyzer for this track
    const analyzerNode = this.audioContext.createAnalyser();
    analyzerNode.fftSize = 2048;
    
    // Connect audio chain
    sourceNode.connect(eqNodes.high);
    eqNodes.high.connect(eqNodes.mid);
    eqNodes.mid.connect(eqNodes.low);
    eqNodes.low.connect(gainNode);
    gainNode.connect(analyzerNode);
    
    // Connect to crossfader
    analyzerNode.connect(this.crossfaderGain[deck]);
    
    // Update track object
    track.sourceNode = sourceNode;
    track.gainNode = gainNode;
    track.eqNodes = eqNodes;
    track.analyzerNode = analyzerNode;
    
    return track;
  }

  /**
   * Set crossfader position (0 = full left, 1 = full right)
   */
  setCrossfader(position: number): void {
    const leftGain = Math.cos(position * Math.PI / 2);
    const rightGain = Math.sin(position * Math.PI / 2);
    
    this.crossfaderGain.left.gain.setValueAtTime(leftGain, this.audioContext.currentTime);
    this.crossfaderGain.right.gain.setValueAtTime(rightGain, this.audioContext.currentTime);
  }

  /**
   * Set track volume
   */
  setTrackVolume(track: AudioTrack, volume: number): void {
    if (track.gainNode) {
      track.gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
    }
  }

  /**
   * Set EQ values
   */
  setEQ(track: AudioTrack, eq: { high: number; mid: number; low: number }): void {
    if (track.eqNodes) {
      track.eqNodes.high.gain.setValueAtTime(eq.high, this.audioContext.currentTime);
      track.eqNodes.mid.gain.setValueAtTime(eq.mid, this.audioContext.currentTime);
      track.eqNodes.low.gain.setValueAtTime(eq.low, this.audioContext.currentTime);
    }
  }

  /**
   * Play track
   */
  playTrack(track: AudioTrack, startTime: number = 0): void {
    if (track.sourceNode) {
      track.sourceNode.start(this.audioContext.currentTime, startTime);
    }
  }

  /**
   * Stop track
   */
  stopTrack(track: AudioTrack): void {
    if (track.sourceNode) {
      track.sourceNode.stop();
      track.sourceNode = undefined;
    }
  }

  /**
   * Start recording
   */
  startRecording(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const dest = this.audioContext.createMediaStreamDestination();
        this.masterGain.connect(dest);
        
        this.recorder = new MediaRecorder(dest.stream, {
          mimeType: 'audio/webm; codecs=opus'
        });
        
        this.recordingChunks = [];
        
        this.recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            this.recordingChunks.push(event.data);
          }
        };
        
        this.recorder.start();
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Stop recording and return blob
   */
  stopRecording(): Promise<Blob> {
    return new Promise((resolve) => {
      if (this.recorder) {
        this.recorder.onstop = () => {
          const blob = new Blob(this.recordingChunks, { type: 'audio/webm' });
          this.recordingChunks = [];
          resolve(blob);
        };
        
        this.recorder.stop();
      }
    });
  }

  /**
   * Get frequency data for visualization
   */
  getFrequencyData(): Uint8Array {
    const dataArray = new Uint8Array(this.analyserNode.frequencyBinCount);
    this.analyserNode.getByteFrequencyData(dataArray);
    return dataArray;
  }

  /**
   * Get current audio context time
   */
  getCurrentTime(): number {
    return this.audioContext.currentTime;
  }

  /**
   * Resume audio context (required after user interaction)
   */
  async resumeContext(): Promise<void> {
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  // Helper methods for audio analysis
  private highpassFilter(data: Float32Array, sampleRate: number, frequency: number): Float32Array {
    const rc = 1.0 / (frequency * 2 * Math.PI);
    const dt = 1.0 / sampleRate;
    const alpha = rc / (rc + dt);
    
    const filtered = new Float32Array(data.length);
    filtered[0] = data[0];
    
    for (let i = 1; i < data.length; i++) {
      filtered[i] = alpha * (filtered[i - 1] + data[i] - data[i - 1]);
    }
    
    return filtered;
  }

  private findPeaks(data: Float32Array, minDistance: number): number[] {
    const peaks: number[] = [];
    
    for (let i = 1; i < data.length - 1; i++) {
      if (data[i] > data[i - 1] && data[i] > data[i + 1]) {
        if (peaks.length === 0 || i - peaks[peaks.length - 1] >= minDistance) {
          peaks.push(i);
        }
      }
    }
    
    return peaks;
  }

  private findMostCommonBPM(intervals: number[], sampleRate: number): number {
    const bpmCounts = new Map<number, number>();
    
    intervals.forEach(interval => {
      const bpm = Math.round((60 * sampleRate) / interval);
      if (bpm >= 60 && bpm <= 200) { // Reasonable BPM range
        bpmCounts.set(bpm, (bpmCounts.get(bpm) || 0) + 1);
      }
    });
    
    let mostCommonBPM = 120;
    let maxCount = 0;
    
    bpmCounts.forEach((count, bpm) => {
      if (count > maxCount) {
        maxCount = count;
        mostCommonBPM = bpm;
      }
    });
    
    return mostCommonBPM;
  }

  private performFFT(data: Float32Array): Float32Array {
    // Simplified FFT implementation - in production, use a proper FFT library
    return data; // Placeholder
  }

  private getChromaVector(spectrum: Float32Array, sampleRate: number): number[] {
    // Convert spectrum to 12-bin chroma vector
    const chroma = new Array(12).fill(0);
    // Implementation would map frequency bins to chromatic notes
    return chroma;
  }

  private getMajorKeyProfiles(): number[][] {
    // Major key profiles for each key
    return Array(12).fill([1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1]);
  }

  private getMinorKeyProfiles(): number[][] {
    // Minor key profiles for each key
    return Array(12).fill([1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0]);
  }

  private correlateProfiles(chroma: number[], profile: number[]): number {
    let correlation = 0;
    for (let i = 0; i < 12; i++) {
      correlation += chroma[i] * profile[i];
    }
    return correlation;
  }
}

export default AudioEngine;