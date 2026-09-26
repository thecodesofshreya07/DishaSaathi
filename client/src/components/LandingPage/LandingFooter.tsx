import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

export const LandingFooter: React.FC = () => {
  return (
    <footer id="about" className="relative overflow-hidden text-white">
      {/* Main footer background — solid deep civic dark */}
      <div className="absolute inset-0 bg-[#0A1F16]"/>

      {/* Tricolor top stripe */}
      <div className="relative z-10 flex h-[3px]">
        <div className="flex-1 bg-[#FF9933]"/>
        <div className="flex-1 bg-white/70"/>
        <div className="flex-1 bg-[#138808]"/>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-10 border-b border-white/10">
          {/* Brand block */}
          <div className="md:col-span-5 space-y-5">
            <div className="flex items-center gap-3">
              {/* Mini Ashoka Chakra */}
              <div className="w-12 h-12 rounded-full border-2 border-[#FF9933]/60 flex items-center justify-center bg-white/5">
                <svg viewBox="0 0 44 44" className="w-9 h-9" fill="none">
                  <circle cx="22" cy="22" r="16" stroke="#FF9933" strokeWidth="2" fill="none"/>
                  <circle cx="22" cy="22" r="3.5" fill="#FF9933"/>
                  {Array.from({ length: 24 }).map((_, i) => {
                    const a = (i * 360) / 24, r = (a * Math.PI) / 180;
                    return <line key={i}
                      x1={22 + 4.5 * Math.cos(r)} y1={22 + 4.5 * Math.sin(r)}
                      x2={22 + 13.5 * Math.cos(r)} y2={22 + 13.5 * Math.sin(r)}
                      stroke="#FF9933" strokeWidth="1" strokeLinecap="round"/>;
                  })}
                </svg>
              </div>
              <div>
                <div className="text-2xl font-black tracking-tight">DishaSaathi</div>
                <div className="text-xs text-white/50 font-medium">दिशासाथी • Your Civic GPS</div>
              </div>
            </div>

            <p className="text-sm text-white/60 leading-relaxed max-w-xs">
              AI-powered civic procedure navigator that converts fragmented government information into a personalized, source-verified, dependency-aware roadmap.
            </p>

            <div className="flex items-center gap-2 text-xs text-white/40">
              <ShieldCheck className="w-4 h-4 text-[#4CAF50]"/>
              <span>Grounded in official .gov.in municipal portals & statutory acts.</span>
            </div>

            {/* Tricolor mini bar */}
            <div className="flex gap-1 pt-1">
              <div className="h-1 w-8 rounded-full" style={{ background: '#FF9933' }}/>
              <div className="h-1 w-8 rounded-full bg-white/40"/>
              <div className="h-1 w-8 rounded-full" style={{ background: '#138808' }}/>
            </div>
          </div>

          {/* Quick links */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#FF9933]/80 mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm font-medium text-white/60">
              {[
                { to: '/', label: 'Home' },
                { to: '/create', label: 'Create My Roadmap' },
                { to: '/roadmap', label: 'View Active Journey' },
                { href: '#how-it-works', label: 'How It Works' },
                { href: '#features', label: 'Features' },
              ].map((link, i) =>
                link.href ? (
                  <li key={i}><a href={link.href} className="hover:text-white transition-colors">{link.label}</a></li>
                ) : (
                  <li key={i}><Link to={link.to!} className="hover:text-white transition-colors">{link.label}</Link></li>
                )
              )}
            </ul>
          </div>

          {/* Civic coverage */}
          <div className="md:col-span-4">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#138808]/80 mb-4">
              Municipal Coverage
            </h4>
            <ul className="space-y-2.5 text-sm text-white/60">
              {[
                'Brihanmumbai Municipal Corporation (BMC)',
                'Municipal Corporation of Delhi (MCD)',
                'Bruhat Bengaluru Mahanagara Palike (BBMP)',
                'Pune Municipal Corporation (PMC)',
                'All Indian State Single-Window Portals',
              ].map((city, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                    style={{ background: i % 2 === 0 ? '#FF9933' : '#138808' }}/>
                  <span>{city}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/30">
          <div>© {new Date().getFullYear()} DishaSaathi — Municipal Bureaucracy Path Visualizer</div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF9933]"/>Saffron = Courage
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-white/40"/>White = Truth
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#138808]"/>Green = Growth
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
