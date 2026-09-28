import React from 'react';
import { X, ExternalLink, Clock, IndianRupee, ShieldCheck, CheckCircle, Lightbulb, BookOpen } from 'lucide-react';
import { getHowToApplyGuide } from '../utils/documentApplicationGuide';

interface HowToApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentName: string;
  authority?: string;
  description?: string;
  category?: string;
  sourceUrl?: string;
  journeyTitle?: string;
}

export const HowToApplyModal: React.FC<HowToApplyModalProps> = ({
  isOpen,
  onClose,
  documentName,
  authority,
  description,
  category,
  sourceUrl,
  journeyTitle
}) => {
  if (!isOpen) return null;

  const guide = getHowToApplyGuide(documentName, {
    authority,
    description,
    category,
    sourceUrl,
    journeyTitle
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#0D1A16] border border-[#D5E3DB] dark:border-[#1E3B32] rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden flex flex-col font-sans max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#E2EAE5] dark:border-[#1E3B32] bg-[#F4F8F6] dark:bg-[#12231E] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1B4D3E] dark:bg-[#18392F] text-white dark:text-[#6EE7B7] flex items-center justify-center shadow-xs">
              <BookOpen className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#1B4D3E]/10 dark:bg-[#22C55E]/10 text-[#1B4D3E] dark:text-[#6EE7B7]">
                Procurement Guide
              </span>
              <h3 className="font-extrabold text-[#11261F] dark:text-white text-base mt-0.5">
                How to Apply: {documentName}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl text-[#4A5D54] dark:text-gray-400 hover:text-[#11261F] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* Metadata chips */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 rounded-2xl bg-gray-50 dark:bg-[#12231E] border border-gray-100 dark:border-[#1E3B32] text-xs">
            <div>
              <span className="text-[10px] text-gray-400 uppercase font-semibold block">Official Portal</span>
              <span className="font-bold text-[#11261F] dark:text-white line-clamp-1">{guide.portalName}</span>
            </div>
            <div>
              <span className="text-[10px] text-gray-400 uppercase font-semibold block">Processing Time</span>
              <span className="font-bold text-[#1B4D3E] dark:text-[#6EE7B7] flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {guide.estimatedTime}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-gray-400 uppercase font-semibold block">Statutory Fee</span>
              <span className="font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1">
                <IndianRupee className="w-3 h-3" />
                {guide.fee}
              </span>
            </div>
          </div>

          {/* Direct Portal Link CTA */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
            <div>
              <h4 className="text-xs font-bold text-emerald-950 dark:text-emerald-200">
                Direct Procurement Webpage
              </h4>
              <p className="text-[11px] text-emerald-800 dark:text-emerald-300">
                Open the exact filing window on the government portal.
              </p>
            </div>
            <a
              href={guide.directUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1B4D3E] hover:bg-[#143B2F] text-white text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer active:scale-95"
            >
              <span>Open Portal ↗</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Step-by-Step Procedure */}
          <div>
            <h4 className="text-xs font-extrabold text-[#11261F] dark:text-white uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-[#1B4D3E] dark:text-[#22C55E]" />
              <span>Step-by-Step Instructions</span>
            </h4>
            <div className="space-y-2.5">
              {guide.steps.map((step, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-xl bg-white dark:bg-[#0D1A16] border border-[#E8ECE9] dark:border-[#1E3B32] shadow-2xs"
                >
                  <div className="w-6 h-6 rounded-full bg-[#E6F0EB] dark:bg-[#18392F] text-[#1B4D3E] dark:text-[#6EE7B7] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-xs text-gray-700 dark:text-gray-200 leading-relaxed font-medium">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Helpful Tips */}
          {guide.tips && guide.tips.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 dark:text-amber-300">
                <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                <span>Important Citizen Tips:</span>
              </div>
              <ul className="space-y-1 pl-5 list-disc text-[11px] text-amber-800 dark:text-amber-200/90">
                {guide.tips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-gray-50 dark:bg-[#12231E] border-t border-gray-200 dark:border-[#1E3B32] flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#1B4D3E] hover:bg-[#143B2F] text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
