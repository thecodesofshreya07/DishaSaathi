import React from 'react';
import {
  X,
  FileDiff,
  ExternalLink,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { GovernmentUpdate } from '../types';

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
  if (!update) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-amber-50 to-rose-50/60 border-b border-amber-200 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md">
              <FileDiff className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200 uppercase tracking-wider">
                {update.type}
              </span>
              <h2 className="text-lg font-extrabold text-slate-900 mt-0.5">
                What Changed?
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <div>
            <span className="text-[11px] font-semibold text-slate-500">
              Notification Date: {update.date}
            </span>
            <h3 className="text-base font-bold text-slate-900 mt-0.5">
              {update.title}
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              {update.description}
            </p>
          </div>

          {/* Semantic Diff Visualizer (Hackathon Killer Feature) */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <FileDiff className="w-4 h-4 text-emerald-700" />
              <span>Semantic Regulatory Diff</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Previous version */}
              <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200 text-xs">
                <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider block mb-1">
                  Previous Government Norm
                </span>
                <p className="text-slate-700 leading-snug font-medium">
                  {update.previousValue || '3 documents required (Identity, Address, Food products)'}
                </p>
              </div>

              {/* Current version */}
              <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-300 text-xs shadow-2xs">
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block mb-1">
                  New Official Requirement
                </span>
                <p className="text-slate-900 font-bold leading-snug">
                  {update.newValue || '4 documents required (+ Passport-Sized Photograph of FBO)'}
                </p>
                <div className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-700 bg-emerald-100/90 px-2 py-0.5 rounded">
                  + 1 Document Added
                </div>
              </div>
            </div>
          </div>

          {/* Official Source Provenance */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Official Source Authority
              </span>
              <span className="font-bold text-slate-800">
                Food Safety and Standards Authority of India (FoSCoS)
              </span>
            </div>
            {update.sourceUrl && (
              <a
                href={update.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-emerald-700 font-bold hover:underline"
              >
                <span>Gazette Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          {/* Impact Statement */}
          <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-100 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-emerald-950 font-medium">
              <strong className="font-bold">Roadmap Impact:</strong> {update.description || 'Your active roadmap reflects official statutory circular updates with verified document and fee requirements.'}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onOpenAdmin}
            className="text-xs font-bold text-slate-600 hover:text-slate-900 underline"
          >
            Review in Admin Console
          </button>

          <button
            onClick={() => onApplyToRoadmap(update.id)}
            className="px-4 py-2 rounded-xl bg-[#16805C] hover:bg-[#12694C] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Apply Update to My Roadmap</span>
          </button>
        </div>
      </div>
    </div>
  );
};
