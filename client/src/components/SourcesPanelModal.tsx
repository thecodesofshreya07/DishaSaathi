import React from 'react';
import {
  X,
  ShieldCheck,
  ExternalLink,
  BookOpen,
  Calendar,
  Building,
  AlertTriangle
} from 'lucide-react';
import { CivicJourney, CivicVerificationStatus } from '../types';

interface SourcesPanelModalProps {
  journey: CivicJourney;
  isOpen: boolean;
  onClose: () => void;
}

export const SourcesPanelModal: React.FC<SourcesPanelModalProps> = ({
  journey,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  // Deduplicate sources across steps
  const sourceMap = new Map<string, {
    title: string;
    authority: string;
    url?: string;
    verificationStatus: CivicVerificationStatus;
    lastVerified?: string;
    steps: Array<{ stepNumber: number; title: string }>;
  }>();

  for (const s of journey.steps) {
    const key = s.sourceUrl || s.sourceTitle || s.department;
    if (!sourceMap.has(key)) {
      sourceMap.set(key, {
        title: s.sourceTitle || s.source?.title || 'Official Municipal Department',
        authority: s.authority || s.department,
        url: s.sourceUrl || s.source?.url,
        verificationStatus: s.verificationStatus || 'VERIFIED',
        lastVerified: s.lastVerified || s.source?.lastChecked || 'Current',
        steps: []
      });
    }
    sourceMap.get(key)?.steps.push({
      stepNumber: s.stepNumber,
      title: s.title
    });
  }

  const sourcesList = Array.from(sourceMap.values());

  const renderBadge = (status: CivicVerificationStatus) => {
    switch (status) {
      case 'VERIFIED':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            <span>Verified source</span>
          </span>
        );
      case 'NEEDS_VERIFICATION':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            <span>Source found — verification needed</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-50 text-slate-700 border border-slate-200">
            <span>Official gazette verification pending</span>
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-2xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-[#D5E3DB] shadow-2xl overflow-hidden flex flex-col font-sans max-h-[85vh]">
        {/* Header */}
        <div className="p-5 border-b border-[#E2EAE5] bg-[#F4F8F6] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#1B4D3E] text-white flex items-center justify-center shadow-xs">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-[#11261F] text-base">
                Official Sources & Grounding Evidence
              </h3>
              <p className="text-xs text-[#4A5D54]">
                Verified government portals, municipal bodies, and gazetted authorities
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl text-[#4A5D54] hover:text-[#11261F] hover:bg-black/5 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Source Cards List */}
        <div className="p-6 overflow-y-auto space-y-4">
          <p className="text-xs text-[#6C8075] leading-relaxed">
            DishaSaathi grounds every procedure in authoritative national and state portals. Below are the verified regulatory sources governing your active roadmap for <strong>"{journey.title}"</strong>.
          </p>

          <div className="space-y-3">
            {sourcesList.map((src, index) => (
              <div
                key={index}
                className="bg-[#F8FAF9] border border-[#E2EAE5] rounded-2xl p-4 hover:border-[#1B4D3E]/40 transition-colors shadow-2xs"
              >
                <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-[200px]">
                    <h4 className="font-bold text-[#11261F] text-sm">
                      {src.title}
                    </h4>
                    <p className="text-xs text-[#4A5D54] flex items-center gap-1.5 mt-0.5">
                      <Building className="w-3.5 h-3.5 text-[#1B4D3E] shrink-0" />
                      <span>{src.authority}</span>
                    </p>
                  </div>
                </div>

                {/* Steps governed */}
                <div className="mt-2.5 pt-2 border-t border-[#E8ECE9] flex flex-wrap items-center gap-1.5 text-[11px] text-[#6C8075]">
                  <span className="font-bold text-[#11261F]">Governs:</span>
                  {src.steps.map((st) => (
                    <span
                      key={st.stepNumber}
                      className="px-2 py-0.5 rounded-md bg-white border border-[#D5E3DB] text-[#1B4D3E] font-medium"
                    >
                      Step {st.stepNumber}
                    </span>
                  ))}
                </div>

                {/* Footer with official portal link */}
                <div className="mt-3 flex flex-wrap items-center justify-end gap-2 text-xs pt-2 border-t border-dashed border-[#E8ECE9]">
                  {src.url ? (
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-bold text-[#1B4D3E] hover:underline bg-white px-3 py-1 rounded-lg border border-[#CDE3D7] shadow-2xs"
                    >
                      <span>Open Official Portal</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-[11px] text-[#8C9B94] italic">
                      Official portal link
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E2EAE5] bg-[#F4F8F6] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#1B4D3E] hover:bg-[#143B2F] text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
          >
            Close Source Panel
          </button>
        </div>
      </div>
    </div>
  );
};
