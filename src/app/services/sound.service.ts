import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SoundService {
  private audioCtx: AudioContext | null = null;
  public soundEnabled = true;

  private initCtx() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  playSoulshot() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.audioCtx) return;

    const ctx = this.audioCtx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.22);
  }

  playAttack() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.audioCtx) return;

    const ctx = this.audioCtx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  }

  playMagic() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.audioCtx) return;

    const ctx = this.audioCtx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.25);

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  }

  playCrit() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.audioCtx) return;

    const ctx = this.audioCtx;
    // Low punch
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'square';
    osc1.frequency.setValueAtTime(150, ctx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.25);
    gain1.gain.setValueAtTime(0.4, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start();
    osc1.stop(ctx.currentTime + 0.25);

    // High metal ping
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1800, ctx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.2);
    gain2.gain.setValueAtTime(0.3, ctx.currentTime);
    gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start();
    osc2.stop(ctx.currentTime + 0.2);
  }

  playLevelUp() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.audioCtx) return;

    const ctx = this.audioCtx;
    const notes = [261.63, 329.63, 392.00, 523.25]; // C E G C
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

      gain.gain.setValueAtTime(0.25, ctx.currentTime + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + idx * 0.08 + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + idx * 0.08);
      osc.stop(ctx.currentTime + idx * 0.08 + 0.35);
    });
  }

  playCoin() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.audioCtx) return;

    const ctx = this.audioCtx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(987.77, ctx.currentTime); // B5
    osc.frequency.setValueAtTime(1318.51, ctx.currentTime + 0.07); // E6

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  }

  playHammerStrike() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.audioCtx) return;

    const ctx = this.audioCtx;
    // Anvil metal clank
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(650, ctx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.12);
    gain1.gain.setValueAtTime(0.4, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start();
    osc1.stop(ctx.currentTime + 0.15);

    // High metal ring
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(2400, ctx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(1800, ctx.currentTime + 0.25);
    gain2.gain.setValueAtTime(0.25, ctx.currentTime);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start();
    osc2.stop(ctx.currentTime + 0.25);
  }

  playEnchantSuccess() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.audioCtx) return;

    const ctx = this.audioCtx;
    // Triumphant ascending magical arpeggio (C5, E5, G5, C6, E6, G6)
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
    notes.forEach((f, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = i > 3 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(f, ctx.currentTime + i * 0.05);

      gain.gain.setValueAtTime(0.3, ctx.currentTime + i * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.05 + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + i * 0.05);
      osc.stop(ctx.currentTime + i * 0.05 + 0.4);
    });

    // Shimmering high sparkle bell
    const shimmer = ctx.createOscillator();
    const shimmerGain = ctx.createGain();
    shimmer.type = 'sine';
    shimmer.frequency.setValueAtTime(2093.00, ctx.currentTime + 0.25);
    shimmer.frequency.exponentialRampToValueAtTime(3135.96, ctx.currentTime + 0.55);

    shimmerGain.gain.setValueAtTime(0.2, ctx.currentTime + 0.25);
    shimmerGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

    shimmer.connect(shimmerGain);
    shimmerGain.connect(ctx.destination);
    shimmer.start(ctx.currentTime + 0.25);
    shimmer.stop(ctx.currentTime + 0.6);
  }

  playEnchantFail() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.audioCtx) return;

    const ctx = this.audioCtx;

    // 1. Descending pitch distortion (item breaking)
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(480, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.5);

    gain.gain.setValueAtTime(0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);

    // 2. Glass shatter noise buffer simulation
    try {
      const bufferSize = ctx.sampleRate * 0.3;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(3500, ctx.currentTime);
      filter.Q.setValueAtTime(3, ctx.currentTime);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.35, ctx.currentTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      noise.start();
      noise.stop(ctx.currentTime + 0.3);
    } catch {
      // Fallback if buffer generation fails
    }
  }
}
