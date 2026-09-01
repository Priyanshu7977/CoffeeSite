// Procedural Web Audio API soundscape generator for NOIR ROAST
class NoirAudioManager {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private masterGain: GainNode | null = null;
  private vinylGain: GainNode | null = null;
  private droneGain: GainNode | null = null;
  private steamGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private vinylNode: AudioBufferSourceNode | null = null;
  private steamNode: AudioBufferSourceNode | null = null;
  private osc1: OscillatorNode | null = null;
  private osc2: OscillatorNode | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
    }
  }

  private createVinylNoiseBuffer(duration: number = 5): AudioBuffer {
    if (!this.ctx) throw new Error('AudioContext missing');
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      let noise = white * 0.04;
      if (Math.random() < 0.0008) {
        noise += (Math.random() * 2 - 1) * 0.45;
      }
      data[i] = noise;
    }
    return buffer;
  }

  private createSteamNoiseBuffer(duration: number = 4): AudioBuffer {
    if (!this.ctx) throw new Error('AudioContext missing');
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      lastOut = (lastOut + 0.02 * white) / 1.02;
      data[i] = lastOut * 0.22;
    }
    return buffer;
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  public start() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const now = this.ctx.currentTime;

    // 1. Vinyl noise
    const vinylBuffer = this.createVinylNoiseBuffer(5);
    this.vinylNode = this.ctx.createBufferSource();
    this.vinylNode.buffer = vinylBuffer;
    this.vinylNode.loop = true;

    const vinylFilter = this.ctx.createBiquadFilter();
    vinylFilter.type = 'bandpass';
    vinylFilter.frequency.setValueAtTime(2200, now);
    vinylFilter.Q.setValueAtTime(0.8, now);

    this.vinylGain = this.ctx.createGain();
    this.vinylGain.gain.setValueAtTime(0.35, now);

    this.vinylNode.connect(vinylFilter);
    vinylFilter.connect(this.vinylGain);
    this.vinylGain.connect(this.masterGain);
    this.vinylNode.start(0);

    // 2. Steam vapor whisper
    const steamBuffer = this.createSteamNoiseBuffer(4);
    this.steamNode = this.ctx.createBufferSource();
    this.steamNode.buffer = steamBuffer;
    this.steamNode.loop = true;

    const steamFilter = this.ctx.createBiquadFilter();
    steamFilter.type = 'lowpass';
    steamFilter.frequency.setValueAtTime(1400, now);

    this.steamGain = this.ctx.createGain();
    this.steamGain.gain.setValueAtTime(0.12, now);

    this.steamNode.connect(steamFilter);
    steamFilter.connect(this.steamGain);
    this.steamGain.connect(this.masterGain);
    this.steamNode.start(0);

    // 3. Warm Roaster Drone (low frequency harmonic hum)
    this.osc1 = this.ctx.createOscillator();
    this.osc1.type = 'sine';
    this.osc1.frequency.setValueAtTime(55, now); // A1 note

    this.osc2 = this.ctx.createOscillator();
    this.osc2.type = 'sine';
    this.osc2.frequency.setValueAtTime(110.2, now); // Warm harmonic

    this.droneGain = this.ctx.createGain();
    this.droneGain.gain.setValueAtTime(0.04, now);

    this.osc1.connect(this.droneGain);
    this.osc2.connect(this.droneGain);
    this.droneGain.connect(this.masterGain);

    this.osc1.start(0);
    this.osc2.start(0);

    // Smooth fade-in
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(0, now);
    this.masterGain.gain.linearRampToValueAtTime(0.35, now + 1.2);

    this.isPlaying = true;
  }

  public stop() {
    if (!this.ctx || !this.masterGain || !this.isPlaying) return;
    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.linearRampToValueAtTime(0.001, now + 0.6);

    setTimeout(() => {
      try {
        this.vinylNode?.stop();
        this.steamNode?.stop();
        this.osc1?.stop();
        this.osc2?.stop();
      } catch {
        // Ignored
      }
      this.isPlaying = false;
    }, 700);
  }

  public getAudioFrequencyData(): number {
    if (!this.analyser || !this.isPlaying) return 0;
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i];
    }
    return sum / dataArray.length / 255;
  }

  public getPlayingState(): boolean {
    return this.isPlaying;
  }
}

export const noirAudio = new NoirAudioManager();
