class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterGain: GainNode | null = null;

  // Sound channels
  private waterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private runwayBeatGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;

  private isRunning: boolean = false;
  private musicInterval: any = null;
  private runwayBeatInterval: any = null;

  init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.5, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.waterGain = this.ctx.createGain();
      this.waterGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      this.waterGain.connect(this.masterGain);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      this.musicGain.connect(this.masterGain);

      // Runway Upbeat Beat Gain Channel
      this.runwayBeatGain = this.ctx.createGain();
      this.runwayBeatGain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      this.runwayBeatGain.connect(this.masterGain);

      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      this.ambientGain.connect(this.masterGain);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(0.6, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);

      this.startWaterLoop();
      this.startNightAmbience();
      this.startProceduralMelody();
      this.startRunwayBeatLoop();
      this.isRunning = true;
    } catch (e) {
      console.warn("AudioContext not allowed yet without user gesture", e);
    }
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    if (!this.isRunning) {
      this.init();
    }
  }

  setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : 0.5, this.ctx.currentTime);
    }
  }

  getMuted() {
    return this.isMuted;
  }

  // Procedural natural water waves sound
  private startWaterLoop() {
    if (!this.ctx || !this.waterGain) return;

    // Pink noise generator for gentle water currents
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      output[i] = (b0 + b1 + b2) * 0.15;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter to sound like soft lapping waves
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, this.ctx.currentTime);

    // LFO for wave swelling
    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.2, this.ctx.currentTime); // 5 sec wave period
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(140, this.ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    whiteNoise.connect(filter);
    filter.connect(this.waterGain);

    whiteNoise.start();
    lfo.start();
  }

  // Night insects and gentle breeze
  private startNightAmbience() {
    if (!this.ctx || !this.ambientGain) return;

    // High subtle cricket oscillation
    const cricket = this.ctx.createOscillator();
    cricket.type = 'triangle';
    cricket.frequency.setValueAtTime(4600, this.ctx.currentTime);

    const cricketAmp = this.ctx.createGain();
    cricketAmp.gain.setValueAtTime(0.015, this.ctx.currentTime);

    // Modulation for rhythmic chirps
    const mod = this.ctx.createOscillator();
    mod.frequency.setValueAtTime(5, this.ctx.currentTime);
    const modGain = this.ctx.createGain();
    modGain.gain.setValueAtTime(0.01, this.ctx.currentTime);
    mod.connect(modGain);
    modGain.connect(cricketAmp.gain);

    cricket.connect(cricketAmp);
    cricketAmp.connect(this.ambientGain);

    cricket.start();
    mod.start();
  }

  // Traditional Thai pentatonic bell / ranad melody generator
  private startProceduralMelody() {
    if (!this.ctx) return;

    // Thai pentatonic scale frequencies (C, D, E, G, A in octaves 4 & 5)
    const scale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99, 880.00];

    const playChime = () => {
      if (!this.ctx || !this.musicGain || this.isMuted) return;
      const freq = scale[Math.floor(Math.random() * scale.length)];
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = Math.random() > 0.4 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      const now = this.ctx.currentTime;
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.8);

      osc.connect(gain);
      gain.connect(this.musicGain);

      osc.start(now);
      osc.stop(now + 3.0);
    };

    this.musicInterval = setInterval(() => {
      if (Math.random() > 0.3) {
        playChime();
        if (Math.random() > 0.5) {
          setTimeout(playChime, 220);
        }
      }
    }, 1800);
  }

  // Runway Fashion Synth Pulse (124 BPM electronic heartbeat)
  private startRunwayBeatLoop() {
    if (!this.ctx) return;
    let step = 0;

    this.runwayBeatInterval = setInterval(() => {
      if (!this.ctx || !this.runwayBeatGain || this.isMuted) return;
      const now = this.ctx.currentTime;
      step = (step + 1) % 4;

      // Soft deep kick / sub-bass on beats
      if (step === 0 || step === 2) {
        const kickOsc = this.ctx.createOscillator();
        const kickGain = this.ctx.createGain();
        kickOsc.type = 'sine';
        kickOsc.frequency.setValueAtTime(80, now);
        kickOsc.frequency.exponentialRampToValueAtTime(32, now + 0.12);

        kickGain.gain.setValueAtTime(0.2, now);
        kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

        kickOsc.connect(kickGain);
        kickGain.connect(this.runwayBeatGain);
        kickOsc.start(now);
        kickOsc.stop(now + 0.16);
      }

      // Elegant hi-hat / shaker on off-beats
      const hatOsc = this.ctx.createOscillator();
      const hatGain = this.ctx.createGain();
      hatOsc.type = 'triangle';
      hatOsc.frequency.setValueAtTime(1200 + step * 200, now);

      hatGain.gain.setValueAtTime(0.025, now);
      hatGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

      hatOsc.connect(hatGain);
      hatGain.connect(this.runwayBeatGain);
      hatOsc.start(now);
      hatOsc.stop(now + 0.06);
    }, 242); // ~124 BPM
  }

  // Play magical release sound when krathong touches the water
  playKrathongReleaseSound() {
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const ctx = this.ctx;
    const sfx = this.sfxGain;
    const now = ctx.currentTime;

    // Magical chime ascending cascade
    const notes = [440, 554.37, 659.25, 880, 1108.73];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const noteGain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      noteGain.gain.setValueAtTime(0.001, now + idx * 0.08);
      noteGain.gain.linearRampToValueAtTime(0.18, now + idx * 0.08 + 0.02);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 1.2);

      osc.connect(noteGain);
      noteGain.connect(sfx);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 1.3);
    });
  }

  // Play mystical tarot card flip sound
  playCardFlipSound() {
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.35);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.6);
  }

  // Play festival firework rocket launch & booming explosion
  playFireworkSound() {
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const now = this.ctx.currentTime;

    // Deep sub boom
    const boomOsc = this.ctx.createOscillator();
    const boomGain = this.ctx.createGain();
    boomOsc.type = 'sine';
    boomOsc.frequency.setValueAtTime(140, now);
    boomOsc.frequency.exponentialRampToValueAtTime(30, now + 0.6);

    boomGain.gain.setValueAtTime(0.4, now);
    boomGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

    boomOsc.connect(boomGain);
    boomGain.connect(this.sfxGain);
    boomOsc.start(now);
    boomOsc.stop(now + 0.85);

    // Sparkle crackle
    for (let i = 0; i < 4; i++) {
      const snapOsc = this.ctx.createOscillator();
      const snapGain = this.ctx.createGain();
      snapOsc.type = 'triangle';
      snapOsc.frequency.setValueAtTime(600 + Math.random() * 800, now + 0.15 + i * 0.08);

      snapGain.gain.setValueAtTime(0.12, now + 0.15 + i * 0.08);
      snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25 + i * 0.08);

      snapOsc.connect(snapGain);
      snapGain.connect(this.sfxGain);
      snapOsc.start(now + 0.15 + i * 0.08);
      snapOsc.stop(now + 0.3 + i * 0.08);
    }
  }

  // Play pageant audience cheering & applause
  playCheerSound() {
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const now = this.ctx.currentTime;

    // Chime fanfare chords (G, B, D, G)
    const chords = [392, 493.88, 587.33, 783.99];
    chords.forEach((f, i) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now + i * 0.06);

      g.gain.setValueAtTime(0.01, now + i * 0.06);
      g.gain.linearRampToValueAtTime(0.15, now + i * 0.06 + 0.04);
      g.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.06 + 1.2);

      osc.connect(g);
      g.connect(this.sfxGain);
      osc.start(now + i * 0.06);
      osc.stop(now + i * 0.06 + 1.3);
    });
  }

  // Adjust positional balance based on player position
  updateSpatialZone(playerX: number, playerZ: number) {
    if (!this.ctx || !this.musicGain || !this.waterGain) return;
    const now = this.ctx.currentTime + 0.1;

    // Distance to canal (X: 0)
    const distToCanal = Math.abs(playerX);
    const canalVol = Math.max(0.12, 1 - distToCanal / 50) * 0.45;
    this.waterGain.gain.setValueAtTime(canalVol, now);

    // Distance to Pageant Stage (X: 26, Z: 8)
    const distToStage = Math.sqrt((playerX - 26) ** 2 + (playerZ - 8) ** 2);
    const stageVol = Math.max(0.02, 1 - distToStage / 60) * 0.35;
    if (this.runwayBeatGain) {
      this.runwayBeatGain.gain.setValueAtTime(stageVol, now);
    }

    // Distance to Temple (X: -38, Z: -8)
    const distToTemple = Math.sqrt((playerX - (-38)) ** 2 + (playerZ - (-8)) ** 2);
    const templeVol = Math.max(0.08, 1 - distToTemple / 65) * 0.4;
    this.musicGain.gain.setValueAtTime(templeVol, now);
  }
}

export const soundManager = new SoundManager();
