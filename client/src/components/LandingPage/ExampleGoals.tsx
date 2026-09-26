import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Store,
  Home,
  Car,
  FileBadge,
  UtensilsCrossed,
  ArrowRight,
  MapPin,
  Sparkles
} from 'lucide-react';
import { useRoadmap } from '../../context/RoadmapContext';

export const ExampleGoals: React.FC = () => {
  const navigate = useNavigate();
  const { setIntake } = useRoadmap();

  const exampleGoals = [
    {
      id: 'bakery',
      category: 'Start a Business',
      title: 'Small Bakery / Food Outlet',
      goal: 'I want to start a small bakery in Mumbai.',
      city: 'Mumbai',
      state: 'Maharashtra',
      context: 'This will be a small home-based bakery with under 5 employees.',
      icon: Store,
      accent: 'bg-[#FFF8F0] text-[#B85C00] border-[#FFD199]',
      stepsCount: '6 Steps'
    },
    {
      id: 'home',
      category: 'Build a Home',
      title: 'Residential House Construction',
      goal: 'I want to construct a house on my property.',
      city: 'Pune',
      state: 'Maharashtra',
      context: 'G+1 residential structure on freehold ancestral land.',
      icon: Home,
      accent: 'bg-[#F0F2FF] text-[#000080] border-[#C5C9F0]',
      stepsCount: '5 Steps'
    },
    {
      id: 'vehicle',
      category: 'Register a Vehicle',
      title: 'New Commercial Vehicle RTO',
      goal: 'I want to register a new vehicle.',
      city: 'Mumbai',
      state: 'Maharashtra',
      context: 'New four-wheeler passenger vehicle purchased from authorized dealer.',
      icon: Car,
      accent: 'bg-[#F2F8F5] text-[#1B4D3E] border-[#C2DFD0]',
      stepsCount: '4 Steps'
    },
    {
      id: 'certificate',
      category: 'Get a Certificate',
      title: 'Civil Registration Certificate',
      goal: 'I need to apply for a government certificate.',
      city: 'Delhi',
      state: 'Delhi',
      context: 'Applying for institutional birth registration and digital certificate.',
      icon: FileBadge,
      accent: 'bg-[#F0F4F2] text-[#4A5D54] border-[#D5E3DB]',
      stepsCount: '3 Steps'
    },
    {
      id: 'food',
      category: 'Start a Food Business',
      title: 'Food Service & Cafe Setup',
      goal: 'I want to open a small food business.',
      city: 'Mumbai',
      state: 'Maharashtra',
      context: 'Quick-service takeaway counter operating in commercial zone.',
      icon: UtensilsCrossed,
      accent: 'bg-[#FDF0ED] text-[#C53929] border-[#F7D2CC]',
      stepsCount: '6 Steps'
    }
  ];

  const handleSelectExample = (ex: typeof exampleGoals[0]) => {
    // Populate the intake state without submitting
    setIntake({
      goal: ex.goal,
      city: ex.city,
      state: ex.state,
      additionalContext: ex.context
    });
    // Navigate to /create where the user remains in complete control
    navigate('/create');
  };

  return (
    <section id="example-goals" className="py-20 sm:py-28 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 flex">
        <div className="flex-1" style={{ background: '#FF9933' }}/>
        <div className="flex-1 bg-[#000080]"/>
        <div className="flex-1 bg-[#138808]"/>
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#FF9933]/40 bg-[#FFF8F0] text-xs font-bold text-[#B85C00] mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF9933]"/>
              Ready-To-Explore Scenarios
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-[#11261F] tracking-tight mt-1.5">
              What do you want to do?
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#4A5D54]">
              Select an example scenario below to load it into the intake generator. You can customize the details before generating.
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-[#6C8075] font-semibold">
            <Sparkles className="w-4 h-4 text-[#1B4D3E]" />
            <span>Clicking populates the goal input for you to edit</span>
          </div>
        </div>

        {/* Example cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {exampleGoals.map((ex) => {
            const Icon = ex.icon;
            return (
              <div
                key={ex.id}
                onClick={() => handleSelectExample(ex)}
                className="rounded-3xl bg-white border border-[#E2ECE7] p-5 sm:p-6 flex flex-col justify-between hover:border-[#1B4D3E] hover:shadow-md transition-all cursor-pointer group"
              >
                <div>
                  {/* Category & Step Count */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#6C8075]">
                      {ex.category}
                    </span>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#EAF2ED] text-[#1B4D3E] border border-[#CDE3D7]">
                      {ex.stepsCount}
                    </span>
                  </div>

                  {/* Icon & Title */}
                  <div className="flex items-start gap-3.5 mb-3">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border flex-shrink-0 shadow-2xs ${ex.accent}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#11261F] group-hover:text-[#1B4D3E] transition-colors leading-snug">
                        {ex.title}
                      </h3>
                      <div className="flex items-center gap-1 text-[11px] text-[#6C8075] font-medium mt-0.5">
                        <MapPin className="w-3 h-3 text-[#8C9B94]" />
                        <span>{ex.city}, {ex.state}</span>
                      </div>
                    </div>
                  </div>

                  {/* Goal Prompt */}
                  <div className="p-3 rounded-2xl bg-[#F7FAF8] border border-[#E8ECE9] text-xs font-semibold text-[#11261F] leading-relaxed">
                    "{ex.goal}"
                  </div>
                </div>

                {/* Card Action footer */}
                <div className="mt-5 pt-3 border-t border-[#EDF2EE] flex items-center justify-between text-xs font-bold text-[#1B4D3E]">
                  <span>Load this goal</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}

          {/* Custom Goal Card */}
          <div
            onClick={() => {
              setIntake({
                goal: '',
                city: 'Mumbai',
                state: 'Maharashtra',
                additionalContext: ''
              });
              navigate('/create');
            }}
            className="rounded-3xl bg-[#1B4D3E] hover:bg-[#143B30] text-white p-5 sm:p-6 flex flex-col justify-between hover:shadow-lg transition-all cursor-pointer group"
          >
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#A8D5C2]">
                Custom Civic Task
              </span>
              <h3 className="text-lg font-black text-white mt-2 leading-snug">
                Have a unique municipal objective?
              </h3>
              <p className="text-xs text-[#C8E4D7] mt-2 leading-relaxed font-normal">
                Describe any government registration, commercial permit, utility connection or legal approval in your own words.
              </p>
            </div>

            <div className="mt-6 pt-3 border-t border-white/15 flex items-center justify-between text-xs font-bold text-white">
              <span>Write your own goal</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
