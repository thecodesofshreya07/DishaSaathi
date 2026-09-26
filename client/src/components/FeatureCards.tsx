import React from 'react';
import {
  Building2,
  Workflow,
  ShieldCheck,
  Volume2
} from 'lucide-react';

interface FeatureCardsProps {
  onOpenAiAssistant: () => void;
  onExploreServices: () => void;
  onHowItWorks: () => void;
  onWhyDishaSaathi: () => void;
}

export const FeatureCards: React.FC<FeatureCardsProps> = ({
  onOpenAiAssistant,
  onExploreServices,
  onHowItWorks,
  onWhyDishaSaathi
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* 1. DishaSaathi AI Assistant */}
      <div className="rounded-2xl bg-white border border-[#E2EAE5] p-5 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between">
        <div>
          <div className="flex items-start gap-3 mb-2">
            {/* Phone device mockup */}
            <div className="w-10 h-14 rounded-lg border-2 border-[#1E3E37] bg-white flex flex-col items-center justify-between p-1 flex-shrink-0 shadow-2xs">
              <div className="w-3 h-0.5 rounded-full bg-[#1E3E37]"></div>
              <div className="w-6 h-6 rounded-full bg-[#EAF2ED] text-[#1B4D3E] flex items-center justify-center">
                <Volume2 className="w-3.5 h-3.5 text-[#1B4D3E]" />
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-[#1E3E37]"></div>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs font-bold text-[#11261F]">
                  DishaSaathi AI Assistant
                </h3>
                <span className="px-1.5 py-0.2 rounded-full bg-[#1B4D3E] text-white text-[9px] font-bold">
                  New
                </span>
              </div>
              <p className="text-[11px] text-[#6C8075] mt-1 leading-snug font-normal">
                Ask anything about government services, documents, fees and more.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onOpenAiAssistant}
          className="mt-3 w-fit py-1.5 px-4 rounded-full bg-[#1B4D3E] hover:bg-[#133A2E] text-white text-[11px] font-bold flex items-center gap-1.5 transition-all shadow-xs"
        >
          <span>Chat Now</span>
          <span>→</span>
        </button>
      </div>

      {/* 2. Explore Services */}
      <div className="rounded-2xl bg-white border border-[#E2EAE5] p-5 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between">
        <div>
          <div className="w-8 h-8 rounded-lg bg-[#EAF2ED] text-[#1B4D3E] flex items-center justify-center mb-2.5">
            <Building2 className="w-4 h-4" />
          </div>

          <h3 className="text-xs font-bold text-[#11261F]">
            Explore Services
          </h3>
          <p className="text-[11px] text-[#6C8075] mt-1 leading-relaxed font-normal">
            Browse all government services by department or category.
          </p>
        </div>

        <button
          onClick={onExploreServices}
          className="mt-3 text-[11px] font-bold text-[#2C3F36] hover:text-[#1B4D3E] flex items-center gap-1 transition-colors self-start"
        >
          <span>Explore</span>
          <span>→</span>
        </button>
      </div>

      {/* 3. How It Works */}
      <div className="rounded-2xl bg-white border border-[#E2EAE5] p-5 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between">
        <div>
          <div className="w-8 h-8 rounded-lg bg-[#EAF2ED] text-[#1B4D3E] flex items-center justify-center mb-2.5">
            <Workflow className="w-4 h-4" />
          </div>

          <h3 className="text-xs font-bold text-[#11261F]">
            How It Works
          </h3>
          <p className="text-[11px] text-[#6C8075] mt-1 leading-relaxed font-normal">
            See how DishaSaathi finds, verifies and connects information for you.
          </p>
        </div>

        <button
          onClick={onHowItWorks}
          className="mt-3 text-[11px] font-bold text-[#2C3F36] hover:text-[#1B4D3E] flex items-center gap-1 transition-colors self-start"
        >
          <span>Learn More</span>
          <span>→</span>
        </button>
      </div>

      {/* 4. Why DishaSaathi? */}
      <div className="rounded-2xl bg-white border border-[#E2EAE5] p-5 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between">
        <div>
          <div className="w-8 h-8 rounded-lg bg-[#EAF2ED] text-[#1B4D3E] flex items-center justify-center mb-2.5">
            <ShieldCheck className="w-4 h-4" />
          </div>

          <h3 className="text-xs font-bold text-[#11261F]">
            Why DishaSaathi?
          </h3>
          <p className="text-[11px] text-[#6C8075] mt-1 leading-relaxed font-normal">
            Trusted. Verified. Updated. Always.
          </p>
        </div>

        <button
          onClick={onWhyDishaSaathi}
          className="mt-3 text-[11px] font-bold text-[#2C3F36] hover:text-[#1B4D3E] flex items-center gap-1 transition-colors self-start"
        >
          <span>Our Story</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
};
