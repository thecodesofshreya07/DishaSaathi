import React from 'react';
import {
  X,
  FileDiff,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  Volume2,
  VolumeX
} from 'lucide-react';
import { GovernmentUpdate } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import { SpeechLanguage } from '../utils/textToSpeech';

interface ChangeDetectionModalProps {
  update: GovernmentUpdate | null;
  onClose: () => void;
  onApplyToRoadmap: (updateId: string) => void;
  onOpenAdmin: () => void;
}

export const ChangeDetectionModal: React.FC<ChangeDetectionModalProps> = ({
  update,
  onClose,
  onApplyToRoadmap,
  onOpenAdmin
}) => {
  const { t, language } = useLanguage();
  const { isSpeaking, speak, stop, isSupported } = useTextToSpeech();
  const contentRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  if (!update) return null;

  const handleToggleVoice = () => {
    if (isSpeaking) {
      stop();
      return;
    }

    // Try to get visible translated text if Google Translate translated the DOM
    let title = update.title;
    let desc = update.description;
    let prev = update.previousValue || '3 documents required';
    let next = update.newValue || '4 documents required';

    if (contentRef.current) {
      const elTitle = contentRef.current.querySelector('[data-speech-id="update-title"]');
      if (elTitle?.textContent?.trim()) title = elTitle.textContent.trim();

      const elDesc = contentRef.current.querySelector('[data-speech-id="update-desc"]');
      if (elDesc?.textContent?.trim()) desc = elDesc.textContent.trim();

      const elPrev = contentRef.current.querySelector('[data-speech-id="update-prev"]');
      if (elPrev?.textContent?.trim()) prev = elPrev.textContent.trim();

      const elNext = contentRef.current.querySelector('[data-speech-id="update-next"]');
      if (elNext?.textContent?.trim()) next = elNext.textContent.trim();
    }

    let speechText = '';
    if (language === 'hi') {
      speechText = `सरकारी नियम बदलाव। अधिसूचना: ${title}। विवरण: ${desc}। पिछला नियम: ${prev}। नया नियम: ${next}। यह बदलाव आपके सक्रिय रोडमैप में शामिल किया जाएगा।`;
    } else if (language === 'mr') {
      speechText = `शासकीय नियम बदल. सूचना: ${title}. माहिती: ${desc}. पूर्वीचा नियम: ${prev}. नवीन नियम: ${next}. हा बदल आपल्या सक्रिय रोडमॅपमध्ये अद्यतनित केला जाईल.`;
    } else {
      speechText = `Government regulation change. Notification: ${title}. Description: ${desc}. Previous government norm: ${prev}. New official requirement: ${next}. Applying this update will adjust your active roadmap.`;
    }

    speak(speechText, 'change-modal', language as SpeechLanguage);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      {/* Backdrop overlay */}
      <div
        className="absolute inset-0"
        onClick={() => {
          stop();
          onClose();
        }}
      />

      {/* Centered Modal Dialog Card (Strictly bounded to viewport height, never overflows) */}
      <div className="relative w-full max-w-lg max-h-[85vh] bg-white dark:bg-[#0D1A16] rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-[#1E3B32] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-10">
        {/* Compact Header */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-amber-50 to-rose-50/60 dark:from-[#18231C] dark:to-[#221B19] border-b border-amber-200/80 dark:border-[#2E332B] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs shrink-0">
              <FileDiff className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50 uppercase tracking-wider">
                {update.type}
              </span>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white leading-tight">
                What Changed?
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {isSupported && (
              <button
                type="button"
                onClick={handleToggleVoice}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow-2xs ${
                  isSpeaking
                    ? 'bg-emerald-600 text-white animate-pulse'
                    : 'bg-white dark:bg-[#18382F] hover:bg-slate-100 dark:hover:bg-[#1E453A] text-slate-700 dark:text-[#6EE7B7] border border-slate-200 dark:border-[#245244]'
                }`}
                title={isSpeaking ? (t.voiceStopReading || 'Stop') : (t.voiceReadStep || 'Listen')}
                aria-label={isSpeaking ? 'Stop reading' : 'Read aloud'}
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-white" />
                    <span className="text-[11px]">{t.voiceStopReading || 'Stop'}</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-emerald-700 dark:text-[#6EE7B7]" />
                    <span className="text-[11px]">{t.voiceReadStep || 'Listen'}</span>
                  </>
                )}
              </button>
            )}

            <button
              onClick={() => {
                stop();
                onClose();
              }}
              className="p-1.5 rounded-xl hover:bg-slate-200/80 dark:hover:bg-[#1E3B32] text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Speaking indicator banner */}
        {isSpeaking && (
          <div className="bg-emerald-50 dark:bg-emerald-950/60 border-b border-emerald-200 dark:border-emerald-800/60 px-5 py-1.5 flex items-center justify-between text-xs text-emerald-900 dark:text-emerald-200 animate-in fade-in duration-150 shrink-0">
            <div className="flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 animate-bounce" />
              <span className="font-semibold text-[11px]">{t.voiceReadingNow || 'Reading aloud...'}</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-bold uppercase">
                {language === 'hi' ? 'हिन्दी' : language === 'mr' ? 'मराठी' : 'English'}
              </span>
            </div>
            <button
              type="button"
              onClick={stop}
              className="text-emerald-700 dark:text-emerald-300 hover:underline font-bold cursor-pointer text-[11px]"
            >
              {t.voiceStopReading || 'Stop'}
            </button>
          </div>
        )}

        {/* Scrollable Content Body */}
        <div ref={contentRef} className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 space-y-3.5 bg-white dark:bg-[#0D1A16]">
          <div>
            <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-400 block uppercase tracking-wider">
              Notification Date: {update.date}
            </span>
            <h3 data-speech-id="update-title" className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mt-0.5 leading-snug">
              {update.title}
            </h3>
            <p data-speech-id="update-desc" className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
              {update.description}
            </p>
          </div>

          {/* Semantic Diff Visualizer (Compact & Responsive) */}
          <div className="p-3 sm:p-3.5 rounded-xl bg-slate-50 dark:bg-[#12221D] border border-slate-200 dark:border-[#1E3B32]">
            <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <FileDiff className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
              <span>Semantic Regulatory Diff</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Previous version */}
              <div className="p-2.5 rounded-lg bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-xs">
                <span className="text-[10px] font-bold text-rose-800 dark:text-rose-300 uppercase tracking-wider block mb-0.5">
                  Previous Government Norm
                </span>
                <p data-speech-id="update-prev" className="text-slate-700 dark:text-slate-300 leading-snug font-medium text-[11px]">
                  {update.previousValue || '3 documents required (Identity, Address, Food products)'}
                </p>
              </div>

              {/* Current version */}
              <div className="p-2.5 rounded-lg bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800/60 text-xs shadow-2xs">
                <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider block mb-0.5">
                  New Official Requirement
                </span>
                <p data-speech-id="update-next" className="text-slate-900 dark:text-white font-bold leading-snug text-[11px]">
                  {update.newValue || '4 documents required (+ Passport-Sized Photograph of FBO)'}
                </p>
                <div className="mt-1 inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-700 dark:text-emerald-300 bg-emerald-100/90 dark:bg-emerald-900/50 px-1.5 py-0.5 rounded">
                  + 1 Document Added
                </div>
              </div>
            </div>
          </div>

          {/* Official Source Provenance */}
          <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50 dark:bg-[#12221D] border border-slate-200 dark:border-[#1E3B32] text-xs flex items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Official Source Authority
              </span>
              <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                Food Safety and Standards Authority of India (FoSCoS)
              </span>
            </div>
            {update.sourceUrl && (
              <a
                href={update.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-bold hover:underline text-xs shrink-0"
              >
                <span>Gazette Portal</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          {/* Impact Statement */}
          <div className="p-2.5 sm:p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 flex items-start gap-2 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-emerald-950 dark:text-emerald-200 font-medium leading-relaxed">
              <strong className="font-bold">Roadmap Impact:</strong> {update.description || 'Your active roadmap reflects official statutory circular updates with verified document and fee requirements.'}
            </p>
          </div>
        </div>

        {/* Compact Footer (Always visible, firmly locked at the bottom) */}
        <div className="px-5 py-3 bg-slate-50 dark:bg-[#10201A] border-t border-slate-200 dark:border-[#1E3B32] flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={() => {
              stop();
              onOpenAdmin();
            }}
            className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white underline cursor-pointer"
          >
            Review in Admin
          </button>

          <button
            onClick={() => {
              stop();
              onApplyToRoadmap(update.id);
            }}
            className="px-3.5 py-2 rounded-xl bg-[#16805C] hover:bg-[#12694C] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs shrink-0 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Apply Update to My Roadmap</span>
          </button>
        </div>
      </div>
    </div>
  );
};
