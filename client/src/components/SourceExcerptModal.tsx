import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  ExternalLink,
  BookOpen,
  FileText,
  AlertCircle,
  Copy,
  Check,
  Sparkles,
  Scale
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface SourceExcerptModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  authority: string;
  sourceUrl?: string;
  stepTitle?: string;
  query?: string;
}

interface ExcerptData {
  statutoryClause: string;
  specificRuleText: string;
  whatIsRequiredOfYou: string[];
  exemptionsOrThresholds?: string;
  authorityName?: string;
  portalLink?: string;
}

export const SourceExcerptModal: React.FC<SourceExcerptModalProps> = ({
  isOpen,
  onClose,
  title,
  authority,
  sourceUrl,
  stepTitle,
  query
}) => {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [excerpt, setExcerpt] = useState<ExcerptData | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setExcerpt(null);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    fetch('/api/sources/excerpt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        authority,
        sourceUrl,
        stepTitle,
        query
      })
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Failed to extract official source text');
        }
        setExcerpt(data.excerpt);
      })
      .catch((err) => {
        console.error('Failed to fetch source excerpt:', err);
        setError(err.message || 'Unable to connect to official gazette extractor.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [isOpen, title, authority, sourceUrl, stepTitle, query]);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (!excerpt) return;
    const textToCopy = `[${excerpt.statutoryClause}]\n${excerpt.specificRuleText}\nAuthority: ${excerpt.authorityName || authority}\nSource: ${excerpt.portalLink || sourceUrl}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-[#D5E3DB] shadow-2xl overflow-hidden flex flex-col font-sans max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#E2EAE5] bg-[#F4F8F6] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1B4D3E] text-white flex items-center justify-center shadow-xs">
              <Scale className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#1B4D3E]/10 text-[#1B4D3E] flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  AI Verified Rule Extract
                </span>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                  Authoritative
                </span>
              </div>
              <h3 className="font-extrabold text-[#11261F] text-base mt-0.5">
                Specific Statutory Rule & Gazette Excerpt
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl text-[#4A5D54] hover:text-[#11261F] hover:bg-black/5 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="text-xs text-[#556960] flex items-center justify-between border-b border-[#EDF2EE] pb-2">
            <span>
              Target Requirement: <strong className="text-[#11261F]">{stepTitle || title}</strong>
            </span>
            <span>
              Authority: <strong className="text-[#11261F]">{authority}</strong>
            </span>
          </div>

          {loading && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-10 h-10 border-3 border-[#1B4D3E]/20 border-t-[#1B4D3E] rounded-full animate-spin"></div>
              <p className="text-xs font-bold text-[#1B4D3E]">
                Scanning official government gazette and extracting specific rule text...
              </p>
              <p className="text-[11px] text-[#6C8075] max-w-sm">
                Filtering out generic boilerplate to display only the specific statutory text that applies to your procedure.
              </p>
            </div>
          )}

          {error && !loading && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-950">
                <AlertCircle className="w-4 h-4 text-amber-700" />
                <span>Notice regarding AI Source Extraction</span>
              </div>
              <p>{error}</p>
              <p className="text-[11px] text-amber-800">
                You can still open the complete official portal directly below to verify full guidelines.
              </p>
              {sourceUrl && (
                <div className="pt-2">
                  <a
                    href={sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-amber-300 font-bold text-amber-900 hover:bg-amber-100"
                  >
                    <span>Open Official Portal ↗</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          )}

          {excerpt && !loading && (
            <div className="space-y-4">
              {/* Clause Badge */}
              <div className="p-3 rounded-2xl bg-[#EAF2ED] border border-[#CDE3D7]">
                <div className="flex items-center gap-2 text-xs text-[#1B4D3E]">
                  <BookOpen className="w-4 h-4 text-[#1B4D3E] shrink-0" />
                  <span className="font-extrabold">{excerpt.statutoryClause}</span>
                </div>
              </div>

              {/* Exact Specific Legal Rule Text */}
              <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-200/80 relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-slate-600" />
                    Exact Official Excerpt
                  </span>
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1B4D3E] hover:underline cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Citation</span>
                      </>
                    )}
                  </button>
                </div>
                <blockquote className="text-xs sm:text-[13px] text-slate-800 font-serif leading-relaxed italic border-l-2 border-[#1B4D3E] pl-3 py-0.5">
                  "{excerpt.specificRuleText}"
                </blockquote>
              </div>

              {/* What is Required of You */}
              {excerpt.whatIsRequiredOfYou && excerpt.whatIsRequiredOfYou.length > 0 && (
                <div className="p-4 rounded-2xl bg-[#FAFBF9] border border-[#E2EAE5]">
                  <h4 className="text-xs font-bold text-[#11261F] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>What Is Required Of You (In Plain Terms)</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-[#3C4F46]">
                    {excerpt.whatIsRequiredOfYou.map((req, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-700 font-bold">•</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Exemptions or Thresholds */}
              {excerpt.exemptionsOrThresholds && (
                <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900">
                  <strong className="font-bold block mb-0.5">Key Scale Exemptions / Thresholds:</strong>
                  <span>{excerpt.exemptionsOrThresholds}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-[#E2EAE5] bg-[#F4F8F6] flex flex-wrap items-center justify-between gap-3">
          {(excerpt?.portalLink || sourceUrl) && (
            <a
              href={excerpt?.portalLink || sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1B4D3E] hover:underline"
            >
              <span>Verify full page on official government portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
          <button
            onClick={onClose}
            className="ml-auto px-5 py-2 rounded-xl bg-[#1B4D3E] hover:bg-[#143B2F] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            {t.closeCard || 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
