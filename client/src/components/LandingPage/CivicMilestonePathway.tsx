import React from 'react';
import {
  Check,
  Clock,
  AlertCircle,
  FileText,
  CreditCard,
  Building,
  ArrowRight,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CivicMilestonePathway: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 sm:py-24 bg-[#F9FAF8] relative overflow-hidden border-b border-[#E5EAE7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── SECTION 7: ONE GOAL. ONE CLEAR JOURNEY. ── */}
        <div className="mb-20">
          <div className="text-left max-w-3xl mb-8">
            <h2 className="text-3xl sm:text-4xl lg:text-[2.5rem] font-extrabold text-[#0D1F1A] tracking-tight">
              One goal. One clear journey.
            </h2>
            <p className="mt-2 text-base sm:text-lg text-[#5A6D64]">
              Everything confusion, just a clear path from start to finish.
            </p>

            {/* Status Legend Pills */}
            <div className="flex items-center gap-4 flex-wrap mt-4 text-xs font-bold text-[#4A5D54]">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" /> Completed
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> In Progress
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300" /> Upcoming
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500" /> Updates
              </span>
            </div>
          </div>

          {/* Panoramic Pathway with Bridge/Waterfront Illustration Backdrop */}
          <div className="bg-white rounded-3xl border border-[#DCE4DF] p-6 sm:p-10 shadow-sm relative overflow-hidden">
            {/* Horizontal Milestone Nodes */}
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-4 relative z-10 text-center mb-6">
              {/* Milestone 1 */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-xs mb-2">
                  <Check className="w-5 h-5 stroke-[3]" />
                </div>
                <span className="text-xs font-bold text-[#0D1F1A]">Start</span>
              </div>

              {/* Milestone 2 */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-xs mb-2">
                  <Check className="w-5 h-5 stroke-[3]" />
                </div>
                <span className="text-xs font-bold text-[#0D1F1A]">Eligibility</span>
              </div>

              {/* Milestone 3 */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-xs mb-2">
                  <Check className="w-5 h-5 stroke-[3]" />
                </div>
                <span className="text-xs font-bold text-[#0D1F1A]">Documents</span>
              </div>

              {/* Milestone 4 (In Progress) */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-xs shadow-xs mb-2 animate-pulse">
                  <Clock className="w-5 h-5 stroke-[2.5]" />
                </div>
                <span className="text-xs font-bold text-amber-800">Application</span>
              </div>

              {/* Milestone 5 */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs mb-2">
                  5
                </div>
                <span className="text-xs font-bold text-slate-500">Approval</span>
              </div>

              {/* Milestone 6 */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs mb-2">
                  6
                </div>
                <span className="text-xs font-bold text-slate-500">Complete</span>
              </div>
            </div>

            {/* Scenic Bridge Watercolor Artwork Panorama */}
            <div className="mt-4 -mx-6 sm:-mx-10 -mb-6 sm:-mb-10 relative h-36 sm:h-48 overflow-hidden rounded-b-3xl border-t border-[#E8ECE9]">
              <img
                src="/images/howrah-bridge.jpg"
                alt="Civic Pathway Across India"
                className="w-full h-full object-cover object-bottom"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-white/60" />
            </div>
          </div>
        </div>

        {/* ── SECTION 8: KNOW WHEN SOMETHING CHANGES. ── */}
        <div>
          <div className="text-left max-w-3xl mb-8">
            <h2 className="text-3xl sm:text-4xl lg:text-[2.5rem] font-extrabold text-[#0D1F1A] tracking-tight">
              Know when something changes.
            </h2>
            <p className="mt-2 text-base sm:text-lg text-[#5A6D64]">
              Get the latest updates on types, fees, documents and services.
            </p>
          </div>

          {/* 3 Real-Time Update Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Update Card 1 */}
            <div className="bg-white rounded-3xl p-6 border border-[#DCE4DF] shadow-sm flex flex-col justify-between text-left hover:border-[#1B4D3E]/40 transition-all">
              <div>
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#FF9933] flex items-center gap-1.5 mb-2">
                  <FileText className="w-3.5 h-3.5" />
                  <span>DOCUMENT UPDATE</span>
                </div>

                <h4 className="text-sm font-extrabold text-[#0D1F1A] mb-2 leading-snug">
                  Photograph requirement updated for this registration
                </h4>

                <div className="text-[11px] text-[#5A6D64] space-y-1 mb-5">
                  <div>24 Sep 2026 • Ministry of Home Affairs</div>
                  <div className="text-slate-400">Source: Official Portal</div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#EDF2EE]">
                <button
                  onClick={() => navigate('/roadmap')}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#1B4D3E] hover:underline cursor-pointer"
                >
                  <span>View Change</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Update Card 2 */}
            <div className="bg-white rounded-3xl p-6 border border-[#DCE4DF] shadow-sm flex flex-col justify-between text-left hover:border-[#1B4D3E]/40 transition-all">
              <div>
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#B85C00] flex items-center gap-1.5 mb-2">
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>FEE UPDATE</span>
                </div>

                <h4 className="text-sm font-extrabold text-[#0D1F1A] mb-2 leading-snug">
                  Application fee schedule updated
                </h4>

                <div className="text-[11px] text-[#5A6D64] space-y-1 mb-5">
                  <div>18 Sep 2026 • Ministry of Finance</div>
                  <div className="text-slate-400">Source: Official Portal</div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#EDF2EE]">
                <button
                  onClick={() => navigate('/roadmap')}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#1B4D3E] hover:underline cursor-pointer"
                >
                  <span>View Change</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Update Card 3 */}
            <div className="bg-white rounded-3xl p-6 border border-[#DCE4DF] shadow-sm flex flex-col justify-between text-left hover:border-[#1B4D3E]/40 transition-all">
              <div>
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-teal-700 flex items-center gap-1.5 mb-2">
                  <Building className="w-3.5 h-3.5" />
                  <span>SERVICE UPDATE</span>
                </div>

                <h4 className="text-sm font-extrabold text-[#0D1F1A] mb-2 leading-snug">
                  Online application now available
                </h4>

                <div className="text-[11px] text-[#5A6D64] space-y-1 mb-5">
                  <div>12 Sep 2026 • Department of Food Safety</div>
                  <div className="text-slate-400">Source: Official Portal</div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#EDF2EE]">
                <button
                  onClick={() => navigate('/roadmap')}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#1B4D3E] hover:underline cursor-pointer"
                >
                  <span>View Change</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
