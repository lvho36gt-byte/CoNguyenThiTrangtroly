/**
 * Audio Service for English Spark:
 * - Speech Synthesis (Text-to-Speech)
 * - Web Audio API procedural sound effects (Success chime, try-again tone, star fanfare)
 * - Speech Recognition with fallback
 */

class AudioService {
  private soundEnabled: boolean = true;
  private audioCtx: AudioContext | null = null;
  private recognitionInstance: any = null;

  constructor() {
    const saved = localStorage.getItem('english_spark_sound_enabled');
    if (saved !== null) {
      this.soundEnabled = saved === 'true';
    }
  }

  public isSoundEnabled(): boolean {
    return this.soundEnabled;
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
    localStorage.setItem('english_spark_sound_enabled', enabled ? 'true' : 'false');
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.audioCtx = new AudioCtx();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  // Text to Speech
  public speak(text: string, rate: number = 0.85, pitch: number = 1.05): Promise<void> {
    return new Promise((resolve) => {
      if (!this.soundEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) {
        resolve();
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = rate; // child-friendly cadence
      utterance.pitch = pitch;

      // Try selecting an English voice if available
      const voices = window.speechSynthesis.getVoices();
      const englishVoice = voices.find(
        (v) => (v.lang.startsWith('en-US') || v.lang.startsWith('en-GB')) && !v.name.includes('Google')
      ) || voices.find((v) => v.lang.startsWith('en'));

      if (englishVoice) {
        utterance.voice = englishVoice;
      }

      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();

      window.speechSynthesis.speak(utterance);
    });
  }

  public stopSpeaking() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  // Play procedural sounds with Web Audio API
  public playSuccessSound() {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Ascending major chord (C5 -> E5 -> G5)
      [523.25, 659.25, 783.99].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.15, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.35);
      });
    } catch {
      // Ignore audio context errors gracefully
    }
  }

  public playTryAgainSound() {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Gentle soft two tones (F4 -> D4)
      [349.23, 293.66].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);

        gain.gain.setValueAtTime(0, now + idx * 0.12);
        gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.12 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.3);
      });
    } catch {
      // Ignore audio context errors gracefully
    }
  }

  public playStarSound() {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Celebratory sparkle arpeggio
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);

        gain.gain.setValueAtTime(0, now + idx * 0.07);
        gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.07 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.45);
      });
    } catch {
      // Ignore audio context errors gracefully
    }
  }

  public playClickSound() {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {}
  }

  // Web Speech API - Recognition
  public isSpeechRecognitionSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return Boolean((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
  }

  public startListening(
    onResult: (transcript: string) => void,
    onError: (error: string) => void,
    onEnd: () => void
  ): { stop: () => void } {
    if (!this.isSpeechRecognitionSupported()) {
      onError('Trình duyệt không hỗ trợ nhận dạng giọng nói trực tiếp. Em có thể dùng ô nhập câu để thực hành nhé!');
      onEnd();
      return { stop: () => {} };
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event: any) => {
        const transcript = event.results?.[0]?.[0]?.transcript || '';
        onResult(transcript);
      };

      recognition.onerror = (event: any) => {
        let errorMsg = 'Chưa nghe rõ âm thanh';
        if (event.error === 'not-allowed') {
          errorMsg = 'Em hãy cho phép trình duyệt truy cập microphone để luyện nói nhé!';
        } else if (event.error === 'no-speech') {
          errorMsg = 'Chưa phát hiện giọng nói. Em hãy bấm lại và nói to, rõ ràng nhé!';
        }
        onError(errorMsg);
      };

      recognition.onend = () => {
        onEnd();
      };

      recognition.start();
      this.recognitionInstance = recognition;

      return {
        stop: () => {
          try {
            recognition.stop();
          } catch {}
        },
      };
    } catch (err: any) {
      onError('Không thể khởi động microphone.');
      onEnd();
      return { stop: () => {} };
    }
  }

  // Compare spoken text with target word/phrase
  public evaluatePronunciation(spoken: string, target: string): {
    accuracy: number;
    match: boolean;
    feedback: string;
  } {
    const cleanSpoken = spoken.trim().toLowerCase().replace(/[.,!?'"]/g, '');
    const cleanTarget = target.trim().toLowerCase().replace(/[.,!?'"]/g, '');

    if (!cleanSpoken) {
      return {
        accuracy: 0,
        match: false,
        feedback: 'Sparky chưa nghe rõ giọng nói. Em thử nói lại thật to và rõ nhé!',
      };
    }

    if (cleanSpoken === cleanTarget) {
      return {
        accuracy: 100,
        match: true,
        feedback: 'Tuyệt vời! Em phát âm từ rất rõ ràng và chuẩn xác! ⭐',
      };
    }

    // Substring or fuzzy check
    if (cleanSpoken.includes(cleanTarget) || cleanTarget.includes(cleanSpoken)) {
      return {
        accuracy: 85,
        match: true,
        feedback: 'Rất tốt! Em đã phát âm rất gần chuẩn. Cùng nghe lại để chuẩn xác hơn nhé!',
      };
    }

    // Levenshtein similarity calculation
    const similarity = this.calculateSimilarity(cleanSpoken, cleanTarget);
    if (similarity >= 0.7) {
      return {
        accuracy: Math.round(similarity * 100),
        match: true,
        feedback: 'Khá tốt! Em hãy lắng nghe mẫu và nhấn mạnh lại âm đuôi nhé!',
      };
    }

    return {
      accuracy: Math.round(similarity * 100),
      match: false,
      feedback: `Hệ thống nhận diện được: "${spoken}". Em hãy nghe lại phát âm mẫu và thử lại nhé!`,
    };
  }

  private calculateSimilarity(s1: string, s2: string): number {
    const longer = s1.length > s2.length ? s1 : s2;
    const shorter = s1.length > s2.length ? s2 : s1;
    if (longer.length === 0) return 1.0;

    let costs = new Array();
    for (let i = 0; i <= longer.length; i++) {
      let lastValue = i;
      for (let j = 0; j <= shorter.length; j++) {
        if (i === 0) costs[j] = j;
        else {
          if (j > 0) {
            let newValue = costs[j - 1];
            if (longer.charAt(i - 1) !== shorter.charAt(j - 1)) {
              newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
            }
            costs[j - 1] = lastValue;
            lastValue = newValue;
          }
        }
      }
      if (i > 0) costs[shorter.length] = lastValue;
    }

    return (longer.length - costs[shorter.length]) / longer.length;
  }
}

export const audioService = new AudioService();
