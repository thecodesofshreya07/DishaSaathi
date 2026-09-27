import React from 'react';
import { Star, CheckCircle, Quote, Building2, Clock, ShieldCheck, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const stories = [
  {
    name: 'Priya Sharma',
    role: 'Founder, The Boho Harvest Cafe',
    city: 'Mumbai, Maharashtra',
    image: '/images/citizen-success.jpg',
    badge: 'BMC Gumasta + FSSAI State',
    highlight: 'Saved ₹18,000 in broker fees',
    quote:
      'A local broker quoted me ₹22,000 and 6 weeks to get my bakery trade license and FSSAI permit. With DishaSaathi, I found out Udyam is ₹0, Gumasta is ₹2,360, and I followed the sequenced steps myself in 11 days.',
    metric: '11 Days to Open',
    stars: 5
  },
  {
    name: 'Karan Mehra',
    role: 'Co-Founder, PayFlow Labs',
    city: 'Bengaluru, Karnataka',
    image: '/images/startup-roadmap.jpg',
    badge: 'MCA SPICe+ & DPIIT Recognition',
    highlight: '4-day incorporation pathway',
    quote:
      'We incorporated our fintech company without getting stuck in name rejection loops. DishaSaathi laid out the exact RUN name guidelines, MOA/AOA attachments, and linked straight to MCA SPICe+ Part B.',
    metric: '4 Days to Certificate',
    stars: 5
  },
  {
    name: 'Vikram & Sunita Deshmukh',
    role: 'Residential Property Owners',
    city: 'South Delhi, NCR',
    image: '/images/property-mutation.jpg',
    badge: 'MCD Property Tax Mutation',
    highlight: 'Zero ward office rejection',
    quote:
      'Property mutation is notorious for repeat visits. DishaSaathi gave us the exact list of 5 certified documents and municipal indemnity bond format. Our application was accepted on the first submission.',
    metric: '1st Time Approval',
    stars: 5
  }
];

export const CivicCitizenStories: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 sm:py-28 bg-white relative overflow-hidden border-b border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EAF2ED] border border-[#1B4D3E]/20 text-xs font-bold text-[#1B4D3E] mb-4 shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
            <span>Human-Tested Across Real Civic Encounters</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#0D1F1A]">
            Built for Real Citizens & <span className="text-[#1B4D3E]">Entrepreneurs</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#4A5D54] leading-relaxed max-w-2xl mx-auto">
            See how Indian citizens, shop owners, and founders cut through bureaucracy with clarity and zero middlemen.
          </p>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stories.map((story, idx) => (
            <div
              key={idx}
              className="bg-[#FAFCF9] rounded-3xl border border-[#D8E4DC] hover:border-[#1B4D3E]/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
            >
              <div>
                {/* Photo Header */}
                <div className="relative h-48 overflow-hidden bg-slate-900">
                  <img
                    src={story.image}
                    alt={story.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white shadow-xs">
                      {story.metric}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h4 className="font-extrabold text-base leading-tight">{story.name}</h4>
                    <p className="text-[11px] text-slate-300">{story.role}</p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Rating & Badge */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center text-amber-500">
                      {[...Array(story.stars)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-[#1B4D3E] bg-[#EAF2ED] px-2.5 py-0.5 rounded-full border border-[#1B4D3E]/20 truncate max-w-[55%]">
                      {story.city}
                    </span>
                  </div>

                  <div className="text-xs font-black text-emerald-800 mb-2.5 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{story.highlight}</span>
                  </div>

                  <p className="text-xs sm:text-sm text-[#4A5D54] leading-relaxed italic">
                    "{story.quote}"
                  </p>
                </div>
              </div>

              {/* Bottom Tag */}
              <div className="p-4 bg-white border-t border-[#EDF2EE] text-[11px] font-bold text-[#6C8075] flex items-center justify-between">
                <span>Statutory Scope:</span>
                <span className="text-[#0D1F1A] font-semibold">{story.badge}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
