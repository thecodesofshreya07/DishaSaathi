/**
 * Text-to-Speech (TTS) engine for DishaSaathi
 * Supports English (en-IN), Hindi (hi-IN), and Marathi (mr-IN)
 * Handles Chrome long-speech pause workarounds, voice selection, and sentence chunking.
 */

export type SpeechLanguage = 'en' | 'hi' | 'mr';

const LANG_CODE_MAP: Record<SpeechLanguage, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
  mr: 'mr-IN'
};

interface SpeakOptions {
  text: string;
  lang: SpeechLanguage;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
}

let activeSentences: string[] = [];
let activeSentenceIndex = 0;
let activeUtterance: SpeechSynthesisUtterance | null = null;
let heartbeatInterval: any = null;
let activeOnEndCallback: (() => void) | null = null;
let activeOnErrorCallback: ((err: any) => void) | null = null;
let isCurrentlySpeaking = false;

/**
 * Check if the browser supports Web Speech Synthesis
 */
export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
}

/**
 * Get available speech synthesis voices, awaiting voiceschanged if necessary
 */
export function getAvailableVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (!isSpeechSynthesisSupported()) {
      resolve([]);
      return;
    }

    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      resolve(voices);
      return;
    }

    let resolved = false;
    const handleVoicesChanged = () => {
      if (resolved) return;
      resolved = true;
      window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
      resolve(window.speechSynthesis.getVoices() || []);
    };

    window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
    setTimeout(() => {
      if (!resolved) {
        resolved = true;
        resolve(window.speechSynthesis.getVoices() || []);
      }
    }, 400);
  });
}

/**
 * Pick the most natural voice for the target language (Hindi, Marathi, or English)
 */
export function pickVoiceForLanguage(
  voices: SpeechSynthesisVoice[],
  lang: SpeechLanguage
): SpeechSynthesisVoice | undefined {
  if (!voices || voices.length === 0) return undefined;

  const normalize = (str: string) => str.toLowerCase().replace(/_/g, '-');

  if (lang === 'hi') {
    return (
      voices.find((v) => normalize(v.lang) === 'hi-in') ||
      voices.find((v) => normalize(v.lang).startsWith('hi')) ||
      voices.find((v) => v.name.toLowerCase().includes('hindi') || v.name.includes('हिन्दी'))
    );
  }

  if (lang === 'mr') {
    // 1. Try to find a dedicated Marathi voice
    const mrVoice =
      voices.find((v) => normalize(v.lang) === 'mr-in') ||
      voices.find((v) => normalize(v.lang).startsWith('mr')) ||
      voices.find((v) => v.name.toLowerCase().includes('marathi') || v.name.includes('मराठी'));

    if (mrVoice) return mrVoice;

    // 2. Fallback to Hindi voice: Marathi uses the Devanagari script, which Hindi voices pronounce with high phonetic fidelity
    return (
      voices.find((v) => normalize(v.lang) === 'hi-in') ||
      voices.find((v) => normalize(v.lang).startsWith('hi')) ||
      voices.find((v) => v.name.toLowerCase().includes('hindi') || v.name.includes('हिन्दी'))
    );
  }

  // English — prefer Indian English (en-IN) for accurate pronunciation of civic and departmental terms
  return (
    voices.find((v) => normalize(v.lang) === 'en-in') ||
    voices.find((v) => normalize(v.lang).startsWith('en'))
  );
}

/**
 * Split text into natural sentences to prevent Chrome's known ~14s freeze and buffer overflow
 */
export function splitTextIntoSentences(text: string): string[] {
  if (!text || !text.trim()) return [];

  // Clean extra markdown characters, asterisks, URLs, and excessive whitespace
  const clean = text
    .replace(/[*_#`~[\]]/g, ' ')
    .replace(/https?:\/\/\S+/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

  // Split on full stop, Hindi/Marathi purna viram (।), exclamation mark, question mark, or newline
  const parts = clean.split(/(?<=[.?!।\n])\s+/);
  const sentences: string[] = [];

  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;

    // If an individual sentence is too long (> 180 chars), split on commas/semicolons
    if (trimmed.length > 180) {
      const subParts = trimmed.split(/(?<=[,;])\s+/);
      for (const sp of subParts) {
        const subTrim = sp.trim();
        if (subTrim) sentences.push(subTrim);
      }
    } else {
      sentences.push(trimmed);
    }
  }

  return sentences.length > 0 ? sentences : [clean];
}

/**
 * Chrome keep-alive heartbeat to prevent speech synthesis from abruptly stopping during long passages
 */
function startHeartbeat() {
  stopHeartbeat();
  heartbeatInterval = setInterval(() => {
    if (isSpeechSynthesisSupported() && window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      window.speechSynthesis.resume();
    }
  }, 10000);
}

function stopHeartbeat() {
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
    heartbeatInterval = null;
  }
}

/**
 * Stop any current speech synthesis immediately
 */
export function stopSpeech(): void {
  stopHeartbeat();
  activeSentences = [];
  activeSentenceIndex = 0;
  isCurrentlySpeaking = false;

  if (isSpeechSynthesisSupported()) {
    try {
      window.speechSynthesis.cancel();
    } catch (err) {
      console.warn('Speech cancellation error:', err);
    }
  }

  if (activeOnEndCallback) {
    const cb = activeOnEndCallback;
    activeOnEndCallback = null;
    cb();
  }
  activeOnErrorCallback = null;
  activeUtterance = null;
}

/**
 * Speak text in the requested language (en, hi, mr)
 */
export async function speakText(options: SpeakOptions): Promise<void> {
  const { text, lang, onStart, onEnd, onError } = options;

  if (!isSpeechSynthesisSupported()) {
    console.warn('SpeechSynthesis is not supported in this browser.');
    onError?.('SpeechSynthesis not supported');
    return;
  }

  // Cancel prior speech
  stopSpeech();

  const sentences = splitTextIntoSentences(text);
  if (sentences.length === 0) {
    onEnd?.();
    return;
  }

  activeSentences = sentences;
  activeSentenceIndex = 0;
  activeOnEndCallback = onEnd || null;
  activeOnErrorCallback = onError || null;
  isCurrentlySpeaking = true;

  const voices = await getAvailableVoices();
  const selectedVoice = pickVoiceForLanguage(voices, lang);
  const langCode = LANG_CODE_MAP[lang] || 'en-IN';

  startHeartbeat();
  if (onStart) onStart();

  function speakNextChunk() {
    if (!isCurrentlySpeaking || activeSentenceIndex >= activeSentences.length) {
      stopHeartbeat();
      isCurrentlySpeaking = false;
      const doneCb = activeOnEndCallback;
      activeOnEndCallback = null;
      activeOnErrorCallback = null;
      doneCb?.();
      return;
    }

    const chunk = activeSentences[activeSentenceIndex];
    activeSentenceIndex++;

    const utterance = new SpeechSynthesisUtterance(chunk);
    utterance.lang = langCode;
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    // Set appropriate rate and pitch for natural clarity
    utterance.rate = lang === 'en' ? 0.95 : 0.90;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      speakNextChunk();
    };

    utterance.onerror = (e) => {
      // 'canceled' and 'interrupted' are fired when stopSpeech() is invoked intentionally
      if (e.error === 'canceled' || e.error === 'interrupted') {
        return;
      }
      console.warn('SpeechSynthesis utterance warning:', e.error);
      // Attempt to continue next chunk on non-fatal error
      speakNextChunk();
    };

    activeUtterance = utterance;
    try {
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Failed to call window.speechSynthesis.speak:', err);
      stopSpeech();
      onError?.(err);
    }
  }

  speakNextChunk();
}

/**
 * Returns whether speech is currently in progress
 */
export function getIsSpeaking(): boolean {
  return isCurrentlySpeaking;
}
