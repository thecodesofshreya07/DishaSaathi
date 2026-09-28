import { useState, useEffect, useCallback, useRef } from 'react';
import {
  SpeechLanguage,
  isSpeechSynthesisSupported,
  speakText,
  stopSpeech
} from '../utils/textToSpeech';
import { useLanguage } from '../context/LanguageContext';

export interface UseTextToSpeechReturn {
  isSpeaking: boolean;
  activeId: string | null;
  isSupported: boolean;
  speak: (text: string, id?: string, langOverride?: SpeechLanguage) => Promise<void>;
  stop: () => void;
  toggle: (text: string, id?: string, langOverride?: SpeechLanguage) => Promise<void>;
}

export const useTextToSpeech = (): UseTextToSpeechReturn => {
  const { language } = useLanguage();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isSupported] = useState<boolean>(() => isSpeechSynthesisSupported());

  const isMountedRef = useRef(true);
  const activeIdRef = useRef<string | null>(null);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      stopSpeech();
    };
  }, []);

  const stop = useCallback(() => {
    stopSpeech();
    if (isMountedRef.current) {
      setIsSpeaking(false);
      setActiveId(null);
      activeIdRef.current = null;
    }
  }, []);

  const speak = useCallback(
    async (text: string, id = 'default', langOverride?: SpeechLanguage) => {
      if (!isSupported || !text.trim()) return;

      const langToUse: SpeechLanguage = langOverride || (language as SpeechLanguage) || 'en';
      activeIdRef.current = id;
      setActiveId(id);

      await speakText({
        text,
        lang: langToUse,
        onStart: () => {
          if (isMountedRef.current) {
            setIsSpeaking(true);
          }
        },
        onEnd: () => {
          if (isMountedRef.current && activeIdRef.current === id) {
            setIsSpeaking(false);
            setActiveId(null);
            activeIdRef.current = null;
          }
        },
        onError: () => {
          if (isMountedRef.current && activeIdRef.current === id) {
            setIsSpeaking(false);
            setActiveId(null);
            activeIdRef.current = null;
          }
        }
      });
    },
    [isSupported, language]
  );

  const toggle = useCallback(
    async (text: string, id = 'default', langOverride?: SpeechLanguage) => {
      if (isSpeaking && activeIdRef.current === id) {
        stop();
      } else {
        await speak(text, id, langOverride);
      }
    },
    [isSpeaking, speak, stop]
  );

  return {
    isSpeaking,
    activeId,
    isSupported,
    speak,
    stop,
    toggle
  };
};
