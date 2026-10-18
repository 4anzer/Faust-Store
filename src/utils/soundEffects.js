// Web Audio API Synthesizer for Project Moon & SCP Interface Sound Effects
// Works without any external audio files, 100% lightweight and zero latency!

class SoundSystem {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playClick() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch {
      // Audio not permitted or supported yet
    }
  }

  playBeep() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
      osc.frequency.setValueAtTime(1600, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch {
      // Audio not permitted
    }
  }

  playHazard() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(180, this.ctx.currentTime + 0.2);

      gain.gain.setValueAtTime(0.07, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
    } catch {
      // Audio not permitted
    }
  }

  playEquip() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      
      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'triangle';

      osc1.frequency.setValueAtTime(440, now);
      osc1.frequency.exponentialRampToValueAtTime(880, now + 0.12);

      osc2.frequency.setValueAtTime(660, now + 0.04);
      osc2.frequency.exponentialRampToValueAtTime(1320, now + 0.16);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now + 0.04);
      osc1.stop(now + 0.2);
      osc2.stop(now + 0.2);
    } catch {
      // Audio not permitted
    }
  }

  playGlitch() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const bufferSize = this.ctx.sampleRate * 0.05;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1800, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      whiteNoise.start(now);
    } catch {
      // Audio not permitted
    }
  }

  // Dramatic cinematic audio for "Proelium Fatale" loading screen intro
  playProeliumIntro() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // 0. Initial Slash Impact Noise
      try {
        const bufferSize = Math.floor(this.ctx.sampleRate * 0.08);
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
        const slashNoise = this.ctx.createBufferSource();
        slashNoise.buffer = buffer;
        const slashFilter = this.ctx.createBiquadFilter();
        slashFilter.type = 'highpass';
        slashFilter.frequency.setValueAtTime(1400, now);
        const slashGain = this.ctx.createGain();
        slashGain.gain.setValueAtTime(0.14, now);
        slashGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        slashNoise.connect(slashFilter);
        slashFilter.connect(slashGain);
        slashGain.connect(this.ctx.destination);
        slashNoise.start(now);
      } catch {
        // ignore
      }

      // 1. Heavy Sub-Bass Boom
      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(95, now);
      subOsc.frequency.exponentialRampToValueAtTime(32, now + 1.2);
      subGain.gain.setValueAtTime(0.28, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 2.0);
      subOsc.connect(subGain);
      subGain.connect(this.ctx.destination);
      subOsc.start(now);
      subOsc.stop(now + 2.0);

      // 2. Metallic Gong / Bell Resonance (Limbus Company Bell)
      [196, 330, 440, 784].forEach((freq, idx) => {
        const bellOsc = this.ctx.createOscillator();
        const bellGain = this.ctx.createGain();
        bellOsc.type = idx % 2 === 0 ? 'triangle' : 'sine';
        bellOsc.frequency.setValueAtTime(freq, now);
        bellGain.gain.setValueAtTime(0.06 / (idx + 1), now);
        bellGain.gain.exponentialRampToValueAtTime(0.0005, now + 1.8);
        bellOsc.connect(bellGain);
        bellGain.connect(this.ctx.destination);
        bellOsc.start(now);
        bellOsc.stop(now + 1.8);
      });

      // 3. Tension Drone / Filtered Saw Sweep
      const droneOsc = this.ctx.createOscillator();
      const droneFilter = this.ctx.createBiquadFilter();
      const droneGain = this.ctx.createGain();
      droneOsc.type = 'sawtooth';
      droneOsc.frequency.setValueAtTime(65.4, now); // C2 note
      droneFilter.type = 'lowpass';
      droneFilter.frequency.setValueAtTime(150, now);
      droneFilter.frequency.exponentialRampToValueAtTime(600, now + 0.8);
      droneFilter.frequency.exponentialRampToValueAtTime(100, now + 2.2);
      droneGain.gain.setValueAtTime(0.08, now);
      droneGain.gain.exponentialRampToValueAtTime(0.001, now + 2.2);
      droneOsc.connect(droneFilter);
      droneFilter.connect(droneGain);
      droneGain.connect(this.ctx.destination);
      droneOsc.start(now);
      droneOsc.stop(now + 2.2);

    } catch {
      // Audio not permitted
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }
}

export const soundEffects = new SoundSystem();
