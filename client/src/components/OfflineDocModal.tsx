import React from 'react';
import {
  Building2,
  Clock,
  MapPin,
  FileCheck,
  CheckCircle2,
  X,
  AlertCircle,
  HelpCircle,
  Calendar
} from 'lucide-react';
import { OfflineOfficeDetails } from '../utils/documentSources';

interface OfflineDocModalProps {
  isOpen: boolean;
  onClose: () => void;
  docName: string;
  details: OfflineOfficeDetails;
  onMarkSubmitted?: () => void;
}

export const OfflineDocModal: React.FC<OfflineDocModalProps> = ({
  isOpen,
  onClose,
  docName,
  details,
  onMarkSubmitted
}) => {
  if (!isOpen) return null;

  const handleSubmitted = () => {
    if (onMarkSubmitted) {
      onMarkSubmitted();
    }
    onClose(); // Requirement 4: Close the card after doing submitted
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-xl w-full border border-[#D5E3DB] shadow-2xl overflow-hidden flex flex-col font-sans max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E2EAE5] bg-[#F4F8F6] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1B4D3E] text-white flex items-center justify-center shadow-xs">
              <Building2 className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                  Offline In-Person Procedure
                </span>
                <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                  Ward Counter
                </span>
              </div>
              <h3 className="font-extrabold text-[#11261F] text-base mt-0.5 line-clamp-1">
                {docName}
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
          {/* Where to Apply */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#11261F] uppercase tracking-wider">
              <MapPin className="w-4 h-4 text-[#1B4D3E]" />
              <span>Where to Apply</span>
            </div>
            <div className="space-y-1 text-xs">
              <div>
                <strong className="text-slate-900 font-extrabold block text-[13px]">
                  {details.officeName}
                </strong>
                <span className="text-slate-600 font-medium">
                  {details.department}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-200/80">
                📍 Location: <strong className="text-slate-700">{details.location}</strong>
              </p>
            </div>
          </div>

          {/* Office Timings Card */}
          <div className="p-4 rounded-2xl bg-[#EAF2ED] border border-[#CDE3D7] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-extrabold text-[#1B4D3E] uppercase tracking-wider">
                <Clock className="w-4 h-4 text-[#1B4D3E]" />
                <span>Designated Office Timings</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                Official Working Hours
              </span>
            </div>
            <div className="text-sm font-extrabold text-[#11261F] tracking-tight">
              {details.officeTimings}
            </div>
            {details.tokenTimings && (
              <div className="text-[11px] text-[#285747] font-semibold bg-white/70 p-2 rounded-xl border border-[#CDE3D7]/60 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <span>Counter Note: {details.tokenTimings}</span>
              </div>
            )}
          </div>

          {/* What to Bring Checklist */}
          {details.whatToBring && details.whatToBring.length > 0 && (
            <div className="p-4 rounded-2xl bg-[#FAFBF9] border border-[#E2EAE5]">
              <h4 className="text-xs font-bold text-[#11261F] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-emerald-700" />
                <span>What to Bring / Required Documents</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-[#3C4F46]">
                {details.whatToBring.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-700 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Turnaround & Guidance */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Turnaround Time
              </span>
              <span className="font-extrabold text-slate-800 mt-0.5 block">
                {details.turnaround}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Procedure Mode
              </span>
              <span className="font-extrabold text-slate-800 mt-0.5 block">
                In-Person Physical Visit
              </span>
            </div>
          </div>

          {details.instructions && (
            <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed">
              <strong className="text-slate-800 block mb-0.5 font-bold">Officer Instructions:</strong>
              {details.instructions}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-[#E2EAE5] bg-[#F4F8F6] flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            Close
          </button>

          {onMarkSubmitted && (
            <button
              onClick={handleSubmitted}
              className="px-5 py-2.5 rounded-xl bg-[#1B4D3E] hover:bg-[#143B2F] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer ml-auto"
              title="Confirm that you visited and submitted this document in person"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>I Have Submitted This / Mark as Ready ✓</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
