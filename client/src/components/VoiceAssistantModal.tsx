import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  X,
  Volume2,
  Sparkles,
  ArrowRight,
  Globe,
  RefreshCw,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTranscriptReady?: (transcript: string) => void;
  autoNavigateToCreate?: boolean;
}

type SpeechLang = 'en-IN' | 'hi-IN' | 'mr-IN';

const LANG_CONFIG: Record<SpeechLang, { name: string; nativeName: string; placeholder: string; sample: string }> = {
  'en-IN': {
    name: 'English (India)',
    nativeName: 'English',
    placeholder: 'Listening... Speak your civic goal (e.g., "I want to open a small bakery in Mumbai")',
    sample: '"How to rent an apartment in Santacruz Mumbai"'
  },
  'hi-IN': {
    name: 'Hindi',
    nativeName: 'हिन्दी',
    placeholder: 'सुन रहे हैं... अपना उद्देश्य बोलें (उदा. "मुझे मुंबई में बेकरी खोलनी है")',
    sample: '"मुंबई में 3BHK रेंट एग्रीमेंट कैसे बनाएं"'
  },
  'mr-IN': {
    name: 'Marathi',
    nativeName: 'मराठी',
    placeholder: 'ऐकत आहे... तुमचे उद्दिष्ट बोला (उदा. "मला मुंबईत बेकरी सुरू करायची आहे")',
    sample: '"सांताक्रूझ मुंबई मध्ये भाडे करार कसा करावा"'
  }
};

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  onTranscriptReady,
  autoNavigateToCreate = true
}) => {
  const navigate = useNavigate();
  const [selectedLang, setSelectedLang] = useState<SpeechLang>('en-IN');
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(true);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check Web Speech API availability
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
    }
  }, []);

  const startListening = () => {
    setErrorMessage(null);
    setTranscript('');
    setInterimTranscript('');

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      setErrorMessage('Speech Recognition is not supported in this browser. Please use Google Chrome, Edge, or Safari.');
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      const recognition = new SpeechRecognition();
      recognition.lang = selectedLang;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let finalStr = '';
        let interimStr = '';

        for (let i = 0; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalStr += result[0].transcript + ' ';
          } else {
            interimStr += result[0].transcript;
          }
        }

        if (finalStr) {
          setTranscript(finalStr.trim());
        }
        setInterimTranscript(interimStr);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setErrorMessage('Microphone access was denied. Please allow microphone permissions in your browser address bar.');
        } else if (event.error === 'no-speech') {
          // Keep listening or prompt user
        } else {
          setErrorMessage(`Voice recognition note: ${event.error}`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.error('Failed to start speech recognition', err);
      setErrorMessage('Could not initialize microphone. Please check browser permissions.');
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        // ignore
      }
    }
    setIsListening(false);
  };

  // Auto-start listening when modal opens
  useEffect(() => {
    if (isOpen && isSupported) {
      startListening();
    } else {
      stopListening();
    }

    return () => {
      stopListening();
    };
  }, [isOpen, selectedLang]);

  if (!isOpen) return null;

  const currentDisplay = transcript || interimTranscript;

  const handleSubmit = () => {
    const finalQuery = currentDisplay.trim();
    if (!finalQuery) return;

    if (onTranscriptReady) {
      onTranscriptReady(finalQuery);
    }

    if (autoNavigateToCreate) {
      navigate('/create', { state: { initialQuery: finalQuery } });
    }

    onClose();
  };

  const handleSampleClick = (sample: string) => {
    const clean = sample.replace(/^"|"$/g, '');
    setTranscript(clean);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#0D1A16] border border-[#DCE8E1] dark:border-[#1E3B32] rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Top Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#1B4D3E] via-[#153D31] to-[#0E271F] text-white flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 text-emerald-300 flex items-center justify-center shrink-0">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/20 text-white inline-block mb-1">
                AI Voice Civic Assistant
              </span>
              <h3 className="text-base sm:text-lg font-black text-white">
                Speak Your Civic Goal
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-white/70 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5">
          
          {/* Language Selector Tabs */}
          <div className="flex items-center justify-between gap-2 p-1.5 bg-[#F2F7F4] dark:bg-[#12241E] rounded-2xl border border-[#DCE8E1] dark:border-[#1E3B32]">
            {(['en-IN', 'hi-IN', 'mr-IN'] as SpeechLang[]).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => {
                  setSelectedLang(lang);
                  setTranscript('');
                  setInterimTranscript('');
                }}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                  selectedLang === lang
                    ? 'bg-[#1B4D3E] text-white shadow-sm'
                    : 'text-[#4A5D54] dark:text-[#9FB7AC] hover:text-[#1B4D3E] dark:hover:text-white'
                }`}
              >
                {LANG_CONFIG[lang].nativeName}
                <span className="text-[10px] opacity-75 ml-1 font-normal block sm:inline">
                  ({LANG_CONFIG[lang].name.split(' ')[0]})
                </span>
              </button>
            ))}
          </div>

          {/* Microphone Pulsing Interaction Zone */}
          <div className="flex flex-col items-center justify-center py-4 text-center">
            <div className="relative">
              {isListening && (
                <>
                  <div className="absolute -inset-3 rounded-full bg-emerald-400/20 dark:bg-emerald-500/20 animate-ping" />
                  <div className="absolute -inset-6 rounded-full bg-emerald-400/10 dark:bg-emerald-500/10 animate-pulse" />
                </>
              )}
              
              <button
                type="button"
                onClick={isListening ? stopListening : startListening}
                className={`relative w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all cursor-pointer ${
                  isListening
                    ? 'bg-red-500 hover:bg-red-600 text-white scale-105'
                    : 'bg-[#1B4D3E] hover:bg-[#143B2F] text-white'
                }`}
                title={isListening ? 'Click to pause' : 'Click to start speaking'}
              >
                {isListening ? (
                  <Mic className="w-8 h-8 animate-pulse" />
                ) : (
                  <MicOff className="w-8 h-8" />
                )}
              </button>
            </div>

            {/* Status indicator */}
            <div className="mt-3 flex items-center gap-2 text-xs font-bold">
              {isListening ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-emerald-700 dark:text-emerald-400 font-extrabold uppercase tracking-wide">
                    Listening in {LANG_CONFIG[selectedLang].nativeName}...
                  </span>
                </>
              ) : (
                <span className="text-slate-500 dark:text-slate-400">
                  Microphone paused. Tap mic to speak again.
                </span>
              )}
            </div>
          </div>

          {/* Transcript Box */}
          <div className="p-4 rounded-2xl bg-[#F8FAF9] dark:bg-[#08120F] border border-[#DCE8E1] dark:border-[#1E3B32] min-h-[90px] flex flex-col justify-center">
            {currentDisplay ? (
              <p className="text-sm font-bold text-[#11261F] dark:text-white leading-relaxed">
                "{currentDisplay}"
              </p>
            ) : (
              <p className="text-xs text-slate-400 dark:text-slate-500 italic">
                {LANG_CONFIG[selectedLang].placeholder}
              </p>
            )}
          </div>

          {/* Error / Alert notice */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Quick Sample Prompts */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
              Try saying:
            </span>
            <button
              type="button"
              onClick={() => handleSampleClick(LANG_CONFIG[selectedLang].sample)}
              className="text-left text-xs font-medium text-[#1B4D3E] dark:text-[#6EE7B7] hover:underline cursor-pointer bg-[#EAF2ED] dark:bg-[#153127] px-3 py-1.5 rounded-lg border border-[#D1E2D8] dark:border-[#1E4336] w-full"
            >
              {LANG_CONFIG[selectedLang].sample}
            </button>
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-between gap-3 border-t border-[#DCE8E1] dark:border-[#1E3B32]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={!currentDisplay.trim()}
              onClick={handleSubmit}
              className="px-5 py-2.5 rounded-xl bg-[#1B4D3E] hover:bg-[#143B2F] text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed active:scale-98"
            >
              <span>Build My Civic Roadmap</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
