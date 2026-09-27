import React, { useState, useEffect } from 'react';
import {
  Search,
  Building2,
  FileText,
  Clock,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Calendar,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Filter,
  Award,
  Sparkles,
  Sun,
  Moon
} from 'lucide-react';
import { CivicJourney, GovernmentUpdate, ProcedureStep, CivicDocumentStatus } from '../types';
import { getOfficialDocumentApplicationUrl, getDocumentProcurementInfo, OfflineOfficeDetails } from '../utils/documentSources';
import { getHowToApplyGuide } from '../utils/documentApplicationGuide';
import { OfflineDocModal } from './OfflineDocModal';
import { HowToApplyModal } from './HowToApplyModal';
import { DigiLockerModal } from './DigiLockerModal';
import { SlaEscalationModal } from './SlaEscalationModal';
import { isDigiLockerAvailable } from '../utils/digiLockerEligibility';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

// ----------------------------------------------------
// 0. EXPLORE VIEW (Civic Categories & Government Guide)
// ----------------------------------------------------
interface ExploreViewProps {
  onStartProcedure: (goal: string) => void;
  onExploreService?: () => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({ onStartProcedure, onExploreService }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const civicCategories = [
    {
      id: 'cat-food-comm',
      title: 'Commercial Enterprise & Food Businesses',
      description: 'Start shops, bakeries, cafes, retail counters, and MSME enterprises with unified licensing.',
      icon: Building2,
      badge: 'Municipal & Central',
      procedures: [
        'FSSAI Food Business License / Registration',
        'Shop & Establishment Act (Gumasta)',
        'Udyam MSME Government Certificate',
        'GSTIN Commercial Registration'
      ],
      timeEst: '3 - 21 Days',
      popularQuery: 'I want to start a small bakery in Mumbai'
    },
    {
      id: 'cat-prop-land',
      title: 'Land, Property & Building Permissions',
      description: 'Navigate municipal layout sanctions, building proposals, property cards, and municipal tax assessments.',
      icon: FileText,
      badge: 'State & Municipal',
      procedures: [
        'City Survey CTS Property Card & Mutation',
        'AutoDCR Architectural Sanction Plan',
        'Provisional & Final Fire Safety NOC',
        'Municipal Water Connection & Potability'
      ],
      timeEst: '15 - 45 Days',
      popularQuery: 'Property tax assessment and mutation'
    },
    {
      id: 'cat-transport',
      title: 'Transport, Driving & Vehicle Services',
      description: 'Streamline learner driving licences, vehicle RC transfers, emission certifications, and fitness badges.',
      icon: Clock,
      badge: 'MoRTH / State RTO',
      procedures: [
        'Learner Licence & Permanent Driving Licence',
        'Vehicle Registration Certificate (RC) & Transfer',
        'Pollution Under Control (PUC) Certification',
        'Commercial Permit & Fitness Certificate'
      ],
      timeEst: '7 - 14 Days',
      popularQuery: 'Permanent driving licence application'
    },
    {
      id: 'cat-vital-welfare',
      title: 'Vital Records & Citizen Identity',
      description: 'Essential certificates of citizenship, domicile, revenue verifications, and civil registry.',
      icon: Award,
      badge: 'District Collectorate',
      procedures: [
        'Civil Registration Birth & Death Certificates',
        'Aadhaar Demographics & Biometrics Update',
        'Permanent Account Number (PAN Card)',
        'Income, Domicile & Caste Certificate'
      ],
      timeEst: '1 - 10 Days',
      popularQuery: 'Apply for income and domicile certificate'
    }
  ];

  const filteredCategories = civicCategories.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.procedures.some((p) => p.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#1B4D3E] to-[#12352B] text-white shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/20 text-white inline-block mb-1.5">
              Civic Discovery
            </span>
            <h2 className="text-xl sm:text-2xl font-black">Explore Citizen Procedures</h2>
            <p className="text-xs text-white/80 mt-1 max-w-xl">
              Discover verified statutory requirements, government portals, and step-by-step pathways across Municipal, State, and Central authorities.
            </p>
          </div>

          <div className="w-full sm:w-72">
            <div className="relative">
              <Search className="w-4 h-4 text-white/60 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search procedures or categories..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/10 border border-white/20 text-xs text-white placeholder-white/50 focus:outline-none focus:bg-white/20"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCategories.map((cat) => {
          const Icon = cat.icon;
          return (
            <div
              key={cat.id}
              className="p-5 rounded-3xl bg-white border border-[#DCE8E1] hover:border-[#1B4D3E] shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-3">
                  <div className="w-9 h-9 rounded-xl bg-[#EAF2ED] text-[#1B4D3E] flex items-center justify-center font-bold">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#EAF2ED] text-[#1B4D3E]">
                      {cat.badge}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500">
                       {cat.timeEst}
                    </span>
                  </div>
                </div>

                <h3 className="text-base font-extrabold text-[#11261F]">
                  {cat.title}
                </h3>
                <p className="text-xs text-[#5C7066] mt-1 leading-relaxed">
                  {cat.description}
                </p>

                <div className="mt-3 pt-3 border-t border-[#EDF2EE]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                    Included Procedures:
                  </span>
                  <div className="space-y-1">
                    {cat.procedures.map((proc, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-xs text-[#3D5247]">
                        <span className="text-emerald-700 font-bold">•</span>
                        <span className="line-clamp-1">{proc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-[#EDF2EE] flex items-center justify-between">
                <button
                  onClick={() => onStartProcedure(cat.popularQuery)}
                  className="px-3.5 py-2 rounded-xl bg-[#1B4D3E] hover:bg-[#143B2F] text-white text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Start Procedure</span>
                </button>

                {onExploreService && (
                  <button
                    onClick={onExploreService}
                    className="text-xs font-bold text-[#1B4D3E] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>View All Services</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ----------------------------------------------------
// 1. EXPLORE SERVICES VIEW (All 18 Civic Procedures)
// ----------------------------------------------------
interface ServicesViewProps {
  onStartProcedure: (goal: string) => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({ onStartProcedure }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const civicServices = [
    {
      id: 'srv-1',
      title: 'Food Business & Bakery Licensing (FSSAI)',
      category: 'Food & Hospitality',
      dept: 'Food Safety and Standards Authority of India (FSSAI)',
      time: '15 - 30 days',
      fee: '₹2,000 - ₹7,500',
      docs: ['Aadhaar', 'PAN', 'Premises Proof', 'Water Test Report'],
      query: 'I want to start a small bakery in Mumbai'
    },
    {
      id: 'srv-2',
      title: 'Shop and Establishment Registration (Gumasta)',
      category: 'Commercial & Trade',
      dept: 'Municipal Corporation (BMC Ward Office)',
      time: '1 - 3 days',
      fee: '₹0 (Under 10 workers) / ₹1,200',
      docs: ['Aadhaar Card', 'PAN Card', 'Rent Agreement', 'Shop Front Photo'],
      query: 'Register a shop under Shop and Establishment Act Mumbai'
    },
    {
      id: 'srv-3',
      title: 'Udyam MSME Certificate',
      category: 'Commercial & Trade',
      dept: 'Ministry of Micro, Small and Medium Enterprises',
      time: 'Instant / 1 day',
      fee: 'Free (Govt Portal)',
      docs: ['Aadhaar linked with Mobile', 'PAN Card', 'Bank Account Details'],
      query: 'Register an MSME Udyam certificate'
    },
    {
      id: 'srv-4',
      title: 'GSTIN Registration',
      category: 'Tax & Financial',
      dept: 'Central Board of Indirect Taxes and Customs (CBIC)',
      time: '3 - 7 days',
      fee: 'Free',
      docs: ['PAN of Business', 'Aadhaar of Promoter', 'Address Proof', 'Bank Proof'],
      query: 'Apply for GST registration for small business'
    },
    {
      id: 'srv-5',
      title: 'Provisional & Final Fire Safety NOC',
      category: 'Safety & Municipal',
      dept: 'Chief Fire Officer (CFO) / Fire Brigade',
      time: '14 - 21 days',
      fee: '₹2,500 - ₹5,000',
      docs: ['Architectural Layout', 'Fire Equipment Plan', 'Premises Title'],
      query: 'Fire safety NOC approval in Mumbai'
    },
    {
      id: 'srv-6',
      title: 'Permanent Driving Licence & Vehicle Registration',
      category: 'Transport & RTO',
      dept: 'Regional Transport Office (RTO / MoRTH)',
      time: '7 - 14 days',
      fee: '₹200 - ₹1,000',
      docs: ['Learner Licence', 'Form 5/5A', 'Age Proof', 'Address Proof'],
      query: 'Permanent driving licence application'
    },
    {
      id: 'srv-7',
      title: 'Property Tax Assessment & Mutation',
      category: 'Property & Land',
      dept: 'Assessment & Collection Dept, Municipal Corp.',
      time: '15 - 45 days',
      fee: 'Variable based on Ratable Value',
      docs: ['Registered Sale Deed', 'No Objection Certificate', 'Previous Tax Bill'],
      query: 'Property tax mutation and assessment transfer'
    },
    {
      id: 'srv-8',
      title: 'Municipal Water Connection & Meter Sanction',
      category: 'Safety & Municipal',
      dept: 'Hydraulic Engineer Dept (HE), Municipal Corp.',
      time: '21 - 30 days',
      fee: '₹4,000 connection charge',
      docs: ['Property Tax Receipt', 'Approved Plumbing Layout', 'Occupancy Certificate'],
      query: 'Commercial municipal water connection sanction'
    },
    {
      id: 'srv-9',
      title: 'Trade Licence (Section 394 MMC Act)',
      category: 'Commercial & Trade',
      dept: 'Health Department, Municipal Corporation',
      time: '15 - 30 days',
      fee: '₹1,500 - ₹10,000',
      docs: ['Gumasta License', 'Fire NOC', 'Site Plan', 'Sanitary Inspection'],
      query: 'Municipal trade license application MMC Section 394'
    }
  ];

  const categories = ['All', 'Commercial & Trade', 'Food & Hospitality', 'Safety & Municipal', 'Transport & RTO', 'Property & Land', 'Tax & Financial'];

  const filtered = civicServices.filter((s) => {
    const matchesSearch = s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.dept.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'All' || s.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-xl font-black text-[#11261F]">Explore Civic Services</h3>
          <p className="text-xs text-[#6C8075]">
            18 statutory municipal, state, and central procedures grounded in active government gazettes.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#8C9B94]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search procedures or ministries..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#D5E3DB] text-xs text-[#11261F] focus:outline-hidden focus:ring-2 focus:ring-[#1B4D3E] bg-white shadow-2xs"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${selectedCategory === cat
                ? 'bg-[#1B4D3E] text-white shadow-2xs'
                : 'bg-white text-[#4A5D54] border border-[#DCE6E1] hover:bg-[#F3F7F5]'
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid of Services */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((service) => (
          <div
            key={service.id}
            className="p-5 rounded-2xl bg-white border border-[#DCE8E1] hover:border-[#1B4D3E] shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-[10px] font-bold text-[#6C8075] uppercase mb-2">
                <span className="px-2 py-0.5 rounded-md bg-[#F2F7F4] text-[#1B4D3E] border border-[#DCE8E1]">
                  {service.category}
                </span>
                <span>{service.time}</span>
              </div>

              <h4 className="text-sm font-extrabold text-[#11261F] leading-snug">
                {service.title}
              </h4>

              <div className="mt-2 text-xs text-[#5C7066] flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#8C9B94] shrink-0" />
                <span className="line-clamp-1">{service.dept}</span>
              </div>

              <div className="mt-3 pt-2.5 border-t border-[#EDF2EE]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C9B94] block mb-1">
                  Required Documents:
                </span>
                <div className="flex flex-wrap gap-1">
                  {service.docs.map((d) => (
                    <span key={d} className="text-[10px] bg-[#F5F8F6] text-[#3D5247] px-2 py-0.5 rounded-md border border-[#E2EBE6]">
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#EDF2EE] flex items-center justify-between">
              <span className="text-xs font-black text-[#1B4D3E]">
                {service.fee}
              </span>

              <button
                onClick={() => onStartProcedure(service.query)}
                className="px-3 py-1.5 rounded-xl bg-[#1B4D3E] hover:bg-[#143B2F] text-white text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>Start Roadmap</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ----------------------------------------------------
// 2. DOCUMENT LOCKER VIEW (With "Apply for Document" buttons)
// ----------------------------------------------------
interface DocumentsViewProps {
  journey: CivicJourney;
  onUpdateDocumentStatus: (stepId: string, docId: string, status: CivicDocumentStatus) => Promise<void>;
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({ journey, onUpdateDocumentStatus }) => {
  // Aggregate all unique documents from journey steps
  const docMap = new Map<string, { doc: any; step: ProcedureStep }>();
  if (journey && Array.isArray(journey.steps)) {
    journey.steps.forEach((step) => {
      if (Array.isArray(step.documents)) {
        step.documents.forEach((doc) => {
          if (!docMap.has(doc.name)) {
            docMap.set(doc.name, { doc, step });
          }
        });
      }
    });
  }

  const [activeOfflineDoc, setActiveOfflineDoc] = useState<{
    name: string;
    details: OfflineOfficeDetails;
    stepId: string;
    docId: string;
  } | null>(null);

  const [howToApplyDoc, setHowToApplyDoc] = useState<string | null>(null);
  const [digiLockerDoc, setDigiLockerDoc] = useState<{ name: string; stepId: string; docId: string } | null>(null);

  const docs = Array.from(docMap.values());
  const readyCount = docs.filter((item) => item.doc.status === 'READY' || item.doc.status === 'UPLOADED').length;

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-xl font-black text-[#11261F] dark:text-white">Citizen Document Vault</h3>
          <p className="text-xs text-[#6C8075] dark:text-[#9FB7AC]">
            {journey && journey.title
              ? `Track required statutory certificates for "${journey.title}" with instant procurement links and written steps.`
              : 'Track required statutory certificates with instant procurement links and written steps.'}
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-full bg-[#EAF2ED] dark:bg-[#18392F] text-[#1B4D3E] dark:text-[#6EE7B7] text-xs font-extrabold border border-[#CDE3D7] dark:border-[#1E3B32]">
          {readyCount} of {docs.length} Documents Ready ({docs.length > 0 ? Math.round((readyCount / docs.length) * 100) : 0}%)
        </div>
      </div>

      {docs.length === 0 ? (
        <div className="p-8 text-center bg-white dark:bg-[#0D1A16] border border-[#DCE8E1] dark:border-[#1E3B32] rounded-3xl space-y-3">
          <FileText className="w-10 h-10 text-[#1B4D3E] dark:text-[#6EE7B7] mx-auto opacity-60" />
          <h4 className="text-base font-bold text-[#11261F] dark:text-white">No Required Documents Found</h4>
          <p className="text-xs text-[#5C7066] dark:text-[#A2B9AE] max-w-md mx-auto">
            Select an active roadmap from your journeys or search a goal to view the exact statutory paperwork required.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {docs.map(({ doc, step }) => {
          const isReady = doc.status === 'READY' || doc.status === 'UPLOADED';
          const proc = getDocumentProcurementInfo(doc.name, doc.sourceUrl);
          const guide = getHowToApplyGuide(doc.name);

          return (
            <div
              key={`${step.id}-${doc.id}`}
              className={`p-4 rounded-2xl border transition-all ${isReady
                  ? 'bg-[#F2F8F5] dark:bg-[#0E201B] border-[#C2DFD0] dark:border-[#1F3E33]'
                  : 'bg-white dark:bg-[#0D1A16] border-[#DCE8E1] dark:border-[#1E3B32]'
                } shadow-2xs flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center ${isReady ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                      {isReady ? <CheckCircle2 className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-[#11261F] dark:text-white">
                        {doc.name}
                      </h4>
                      <span className="text-[10px] text-[#6C8075] dark:text-[#9FB7AC]">
                        Required for Step {step.stepNumber}: {step.title.replace(/^\d+\.\s*/, '')}
                      </span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${isReady ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300' : 'bg-amber-100 text-amber-900 dark:bg-amber-950/40 dark:text-amber-300'}`}>
                    {isReady ? 'Ready' : 'Pending'}
                  </span>
                </div>

                <p className="text-[11px] text-[#5C7066] dark:text-[#A2B9AE] mt-1 leading-relaxed">
                  {doc.description || `Statutory certificate issued by ${guide.authority} for verification.`}
                </p>
              </div>

              <div className="mt-3 pt-3 border-t border-[#EDF2EE] dark:border-[#1E3B32] flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {/* Step-by-Step "How to Apply" Card Trigger */}
                  <button
                    type="button"
                    onClick={() => setHowToApplyDoc(doc.name)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-900 dark:text-blue-300 text-xs font-bold border border-blue-200 dark:border-blue-800 transition-all cursor-pointer"
                    title="View step-by-step written procedure on how to apply for this document"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-blue-700 dark:text-blue-400" />
                    <span>How to Apply</span>
                  </button>

                  {/* DigiLocker Direct Pull Button (Only for eligible government documents) */}
                  {isDigiLockerAvailable(doc.name) && (
                    <button
                      type="button"
                      onClick={() => setDigiLockerDoc({ name: doc.name, stepId: step.id, docId: doc.id })}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-300 dark:border-emerald-800 transition-all cursor-pointer"
                      title="Fetch official verified document directly from Government DigiLocker / API Setu"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>DigiLocker</span>
                    </button>
                  )}

                  {/* Direct link to exact page */}
                  {proc.mode === 'ONLINE' ? (
                    <a
                      href={guide.directUrl || proc.url || getOfficialDocumentApplicationUrl(doc.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EAF2ED] dark:bg-[#18392F] hover:bg-[#DEEFE5] dark:hover:bg-[#22C55E]/20 text-[#1B4D3E] dark:text-[#6EE7B7] text-xs font-bold border border-[#CDE3D7] dark:border-[#1E3B32] transition-all cursor-pointer"
                    >
                      <span>Apply Online ↗</span>
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setActiveOfflineDoc({
                          name: doc.name,
                          details: proc.offlineDetails!,
                          stepId: step.id,
                          docId: doc.id
                        });
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 text-amber-900 dark:text-amber-300 text-xs font-bold border border-amber-300 dark:border-amber-800 transition-all cursor-pointer"
                      title="View office location, timings and submission checklist"
                    >
                      <Building2 className="w-3.5 h-3.5 text-amber-700" />
                      <span>Offline Center</span>
                    </button>
                  )}
                </div>

                <button
                  onClick={() => onUpdateDocumentStatus(step.id, doc.id, isReady ? 'NOT_READY' : 'READY')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${isReady
                      ? 'bg-white dark:bg-[#12231E] border border-[#D5E3DB] dark:border-[#1E3B32] text-[#4A5D54] dark:text-gray-300 hover:bg-slate-50'
                      : 'bg-[#1B4D3E] hover:bg-[#143B2F] text-white shadow-2xs'
                    }`}
                >
                  {isReady ? 'Mark Missing' : 'Mark Ready'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
      )}

      {/* Centered How to Apply Modal with Written Steps */}
      {howToApplyDoc && (() => {
        const selectedDocItem = docs.find((d) => d.doc.name === howToApplyDoc);
        return (
          <HowToApplyModal
            isOpen={!!howToApplyDoc}
            onClose={() => setHowToApplyDoc(null)}
            documentName={howToApplyDoc}
            authority={selectedDocItem?.step.authority || selectedDocItem?.step.department}
            description={selectedDocItem?.doc.description}
            category={selectedDocItem?.doc.category}
            sourceUrl={selectedDocItem?.doc.sourceUrl}
            journeyTitle={journey.title}
          />
        );
      })()}

      {/* DigiLocker Direct Verification Modal */}
      {digiLockerDoc && (
        <DigiLockerModal
          isOpen={!!digiLockerDoc}
          onClose={() => setDigiLockerDoc(null)}
          documentName={digiLockerDoc.name}
          stepId={digiLockerDoc.stepId}
          docId={digiLockerDoc.docId}
          onDocumentVerified={async (sId, dId, st) => {
            await onUpdateDocumentStatus(sId, dId, st);
            setDigiLockerDoc(null);
          }}
        />
      )}

      {/* Offline Document Modal (Item 3 & 4) */}
      {activeOfflineDoc && (
        <OfflineDocModal
          isOpen={!!activeOfflineDoc}
          onClose={() => setActiveOfflineDoc(null)}
          docName={activeOfflineDoc.name}
          details={activeOfflineDoc.details}
          onMarkSubmitted={async () => {
            await onUpdateDocumentStatus(activeOfflineDoc.stepId, activeOfflineDoc.docId, 'READY');
            setActiveOfflineDoc(null);
          }}
        />
      )}
    </div>
  );
};

// ----------------------------------------------------
// 3. GOVERNMENT GAZETTE UPDATES VIEW
// ----------------------------------------------------
interface UpdatesViewProps {
  updates: GovernmentUpdate[];
  onInspectExcerpt: (update: GovernmentUpdate) => void;
  onViewImpactDiff?: (update: GovernmentUpdate) => void;
  onOpenAdmin?: () => void;
}

export const UpdatesView: React.FC<UpdatesViewProps> = ({ updates, onInspectExcerpt, onViewImpactDiff, onOpenAdmin }) => {
  const { user } = useAuth();
  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-[#173F33] to-[#123126] text-white p-5 rounded-2xl shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-emerald-200 text-[10px] font-bold uppercase tracking-wider mb-1">
            Statutory Intelligence
          </div>
          <h3 className="text-lg sm:text-xl font-black text-white">Government Gazette Updates</h3>
          <p className="text-xs text-white/80 max-w-xl mt-0.5">
            Real-time statutory notifications and legal amendments tracked across central and municipal gazettes. Inspect impact diffs and evaluate live database synchronization.
          </p>
        </div>

        {onOpenAdmin && user?.role === 'admin' && (
          <button
            onClick={onOpenAdmin}
            className="px-4 py-2 bg-[#E8B931] hover:bg-[#D4A72C] text-[#11261F] text-xs font-black rounded-xl transition-all shadow-md flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-[#11261F]" />
            <span>Admin Review Console</span>
          </button>
        )}
      </div>

      <div className="space-y-4">
        {updates.map((update) => (
          <div
            key={update.id}
            className="p-5 rounded-2xl bg-white dark:bg-[#0D1A16] border border-[#DCE8E1] dark:border-[#1E3B32] hover:border-[#1B4D3E] shadow-2xs transition-all"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800">
                  {update.type}
                </span>
                <span className="text-xs font-semibold text-[#6C8075] dark:text-[#9FB7AC]">
                  Date: {update.date}
                </span>
              </div>

              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                update.reviewStatus === 'Approved'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                  : update.reviewStatus === 'Rejected'
                  ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
              }`}>
                {update.reviewStatus}
              </span>
            </div>

            <h4 className="text-sm font-extrabold text-[#11261F] dark:text-white">
              {update.title}
            </h4>

            <p className="text-xs text-[#4A5D54] dark:text-[#A2B9AE] mt-1.5 leading-relaxed">
              {update.description}
            </p>

            <div className="mt-4 pt-3 border-t border-[#EDF2EE] dark:border-[#1E3B32] flex flex-wrap items-center justify-between gap-3">
              <span className="text-[11px] text-[#6C8075] dark:text-[#9FB7AC]">
                Source: <strong className="text-[#11261F] dark:text-white">{update.sourceUrl || 'The Gazette of India'}</strong>
              </span>

              <div className="flex items-center gap-2 flex-wrap">
                {/* View Impact Diff Modal trigger */}
                {onViewImpactDiff && (
                  <button
                    onClick={() => onViewImpactDiff(update)}
                    className="px-3.5 py-1.5 rounded-xl bg-[#EAF2ED] dark:bg-[#18392F] hover:bg-[#DEEFE5] dark:hover:bg-[#22C55E]/20 text-[#1B4D3E] dark:text-[#6EE7B7] text-xs font-bold border border-[#CDE3D7] dark:border-[#1E3B32] transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    title="View side-by-side affected steps and roadmap impact diff"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span>View Impact Diff (Roadmap Changes)</span>
                  </button>
                )}

                {/* View AI Statutory Excerpt */}
                <button
                  onClick={() => onInspectExcerpt(update)}
                  className="px-3.5 py-1.5 rounded-xl bg-[#1B4D3E] hover:bg-[#143B2F] text-white text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5 text-emerald-300" />
                  <span>View Gazette Excerpt</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ----------------------------------------------------
// 4. STATUTORY COMPLIANCE DEADLINES VIEW (With SLA & Escalation Tracker)
// ----------------------------------------------------
export const DeadlinesView: React.FC<{ journey?: CivicJourney }> = ({ journey }) => {
  const [activeSlaStep, setActiveSlaStep] = useState<ProcedureStep | null>(null);

  const sampleProceduresForEscalation: ProcedureStep[] = [
    {
      id: 'gumasta-sla',
      stepNumber: 1,
      title: 'Maharashtra Shop & Establishment Registration (Gumasta)',
      category: 'Commercial',
      department: 'Municipal Corporation (BMC / Labour Dept)',
      authority: 'Municipal Corporation of Greater Mumbai (BMC)',
      description: 'Registration intimation under Maharashtra Shops & Establishments Act 2017.',
      whyRequired: 'Statutory trade license for commercial shop operations',
      status: 'In Progress',
      documents: [],
      prerequisites: [],
      fee: { amount: '0' },
      processingTime: '3 Days',
      applicationMode: 'Online',
      applicationUrl: 'https://lms.mahaonline.gov.in',
      source: {
        id: 'src-1',
        title: 'Maharashtra RTS Act 2015',
        url: 'https://aaplesarkar.mahaonline.gov.in',
        department: 'Labour Department',
        domain: 'mahaonline.gov.in',
        lastChecked: '2026-03-20',
        verificationStatus: 'Verified'
      }
    },
    {
      id: 'fssai-sla',
      stepNumber: 2,
      title: 'FSSAI Food Business License / Registration',
      category: 'Food Safety',
      department: 'Food Safety and Standards Authority of India (FSSAI)',
      authority: 'FSSAI / State FDA',
      description: 'Statutory food business operator licensing.',
      whyRequired: 'Mandatory for food processing, bakery, cafe or restaurant',
      status: 'In Progress',
      documents: [],
      prerequisites: [],
      fee: { amount: '2000' },
      processingTime: '30 Days',
      applicationMode: 'Online',
      applicationUrl: 'https://foscos.fssai.gov.in',
      source: {
        id: 'src-2',
        title: 'Food Safety and Standards Regulations 2011',
        url: 'https://foscos.fssai.gov.in',
        department: 'FSSAI',
        domain: 'fssai.gov.in',
        lastChecked: '2026-03-20',
        verificationStatus: 'Verified'
      }
    },
    {
      id: 'driving-sla',
      stepNumber: 3,
      title: 'Permanent Driving Licence Application / Renewal',
      category: 'Transport',
      department: 'Regional Transport Office (RTO) / MoRTH',
      authority: 'State Transport Department',
      description: 'Driving license issuance under Motor Vehicles Act.',
      whyRequired: 'Statutory permission to drive on public roads',
      status: 'In Progress',
      documents: [],
      prerequisites: [],
      fee: { amount: '200' },
      processingTime: '7 Days',
      applicationMode: 'Online',
      applicationUrl: 'https://parivahan.gov.in',
      source: {
        id: 'src-3',
        title: 'Motor Vehicles Act 1988',
        url: 'https://parivahan.gov.in',
        department: 'MoRTH',
        domain: 'parivahan.gov.in',
        lastChecked: '2026-03-20',
        verificationStatus: 'Verified'
      }
    }
  ];

  const deadlines = [
    { title: 'GSTR-3B Monthly Return Filing', date: '20th of every month', dept: 'CBIC / GSTN', status: 'Monthly Statutory' },
    { title: 'FSSAI Annual Compliance Return (Form D-1)', date: '31st May Annually', dept: 'FSSAI Ministry of Health', status: 'Annual Statutory' },
    { title: 'Commercial Property Tax 10% Early Payment Rebate', date: '30th June Annually', dept: 'Municipal Assessment Dept (BMC)', status: 'Rebate Window' },
    { title: 'Shop & Establishment Intimation Renewal', date: 'No Annual Renewal (Permanent Self-Declaration)', dept: 'Labour Dept / BMC', status: 'Exempt' },
    { title: 'Fire Safety Extinguisher Audit & Hydro-Test', date: 'Quarterly (Every 3 Months)', dept: 'Mumbai Fire Brigade', status: 'Quarterly Safety' }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h3 className="text-xl font-black text-[#11261F] dark:text-white">Statutory Deadlines & Compliance Tracker</h3>
        <p className="text-xs text-[#6C8075] dark:text-[#9FB7AC] mt-0.5">
          Real-time calendar tracking mandatory filing dates, penalty waivers, and legal SLA windows across Indian municipal and statutory bodies.
        </p>
      </div>

      {/* FEATURE 1 HERO: "Stuck? Here's what to do" (SLA & Escalation Complaint Generator) */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#173F33] via-[#1B4D3E] to-[#123126] text-white shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/15 text-emerald-200 border border-white/20 inline-block">
              Right to Public Services Act (RTS) Tracker
            </span>
            <h4 className="text-lg sm:text-xl font-black text-white">
              Stuck on a Government Application? We've Got Your Back.
            </h4>
            <p className="text-xs text-white/80 max-w-xl">
              Most government applications have a legal deadline (e.g. 3 to 15 days). If it's crossed, you have the legal right to complain. We hand you a ready-made complaint letter and tell you exactly where to submit it.
            </p>
          </div>

          <button
            onClick={() => {
              const activeStep = journey && journey.steps && journey.steps.length > 0
                ? journey.steps[0]
                : sampleProceduresForEscalation[0];
              setActiveSlaStep(activeStep);
            }}
            className="px-5 py-2.5 rounded-xl bg-[#E8B931] hover:bg-[#D4A72C] text-[#11261F] text-xs font-black transition-all shadow-md flex items-center gap-2 shrink-0 cursor-pointer hover:scale-102"
          >
            <Clock className="w-4 h-4 text-[#11261F]" />
            <span>Generate Grievance Notice</span>
          </button>
        </div>

        {/* Quick Launch Chips for Popular Escalations */}
        <div className="pt-3 border-t border-white/10 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold text-emerald-200">
            Diagnose Delay For:
          </span>
          {sampleProceduresForEscalation.map((proc) => (
            <button
              key={proc.id}
              onClick={() => setActiveSlaStep(proc)}
              className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-[11px] font-bold text-white transition-all cursor-pointer"
            >
              {proc.title.split(' ')[0]} {proc.title.split(' ')[1]} (SLA: {proc.processingTime})
            </button>
          ))}
        </div>
      </div>

      {/* UI Explanation Guide Box */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-[#EAF2ED] to-[#E2EBE5] dark:from-[#10271F] dark:to-[#143329] border border-[#CDE3D7] dark:border-[#1E3B32] space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#1B4D3E] text-white flex items-center justify-center font-bold text-xs">
            
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-[#11261F] dark:text-white">
              Why Deadlines Matter for Your Roadmap
            </h4>
            <p className="text-xs text-[#4A5D54] dark:text-[#9FB7AC]">
              Keep your civic and business procedures 100% compliant without unexpected penalty notices.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="p-3 rounded-xl bg-white/80 dark:bg-[#0D1A16]/80 border border-white/40 dark:border-[#1E3B32]">
            <span className="font-bold text-[#11261F] dark:text-white block mb-1"> Penalty Protection</span>
            <p className="text-[11px] text-[#556960] dark:text-[#A2B9AE]">
              Avoid compounding late fees under the GST and FSSAI Acts by submitting filings within monthly windows.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-white/80 dark:bg-[#0D1A16]/80 border border-white/40 dark:border-[#1E3B32]">
            <span className="font-bold text-[#11261F] dark:text-white block mb-1"> Early Rebate Windows</span>
            <p className="text-[11px] text-[#556960] dark:text-[#A2B9AE]">
              Save up to 10% on municipal commercial property tax assessments by settling challans before June 30.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-white/80 dark:bg-[#0D1A16]/80 border border-white/40 dark:border-[#1E3B32]">
            <span className="font-bold text-[#11261F] dark:text-white block mb-1"> Renewal vs Exemption</span>
            <p className="text-[11px] text-[#556960] dark:text-[#A2B9AE]">
              Instant clarity on which certificates need annual renewal versus lifetime digital self-declaration.
            </p>
          </div>
        </div>
      </div>

      {/* Deadlines Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {deadlines.map((dl) => (
          <div key={dl.title} className="p-5 rounded-2xl bg-white dark:bg-[#0D1A16] border border-[#DCE8E1] dark:border-[#1E3B32] shadow-2xs hover:shadow-xs transition-all">
            <div className="flex items-center justify-between text-[10px] font-bold text-[#6C8075] dark:text-[#9FB7AC] uppercase mb-1.5">
              <span>{dl.dept}</span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-bold">
                {dl.status}
              </span>
            </div>
            <h4 className="text-sm font-bold text-[#11261F] dark:text-white">{dl.title}</h4>
            <div className="mt-3 text-xs font-extrabold text-[#1B4D3E] dark:text-[#6EE7B7] flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#1B4D3E] dark:text-[#6EE7B7]" />
              <span>{dl.date}</span>
            </div>
          </div>
        ))}
      </div>

      {/* SLA / Escalation Grievance Modal */}
      {activeSlaStep && (
        <SlaEscalationModal
          isOpen={!!activeSlaStep}
          onClose={() => setActiveSlaStep(null)}
          step={activeSlaStep}
          journey={journey}
        />
      )}
    </div>
  );
};

// ----------------------------------------------------
// 5. CIVIC VERIFICATION QR & MULTI-JOURNEY PORTFOLIO
// ----------------------------------------------------
export const PassportView: React.FC<{
  journey: CivicJourney;
  journeys?: CivicJourney[];
  onSelectJourney?: (id: string) => void;
}> = ({ journey, journeys = [], onSelectJourney }) => {
  const [copied, setCopied] = useState(false);
  const [selectedJourneyId, setSelectedJourneyId] = useState<string>(journey?.id || 'all');

  // Sync when journey prop changes
  useEffect(() => {
    if (journey?.id && selectedJourneyId !== 'all') {
      setSelectedJourneyId(journey.id);
    }
  }, [journey?.id]);

  const allJourneys = journeys.length > 0 ? journeys : (journey ? [journey] : []);
  const isMasterPortfolio = selectedJourneyId === 'all';

  const currentJourney = isMasterPortfolio
    ? null
    : allJourneys.find((j) => j.id === selectedJourneyId) || journey || allJourneys[0];

  const verifyUrl = isMasterPortfolio
    ? `${window.location.origin}/verify`
    : `${window.location.origin}/verify/${currentJourney?.id || ''}`;

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(verifyUrl)}&margin=10`;

  // Stats calculation
  const totalStagesAcrossAll = allJourneys.reduce((sum, j) => sum + (j.steps?.length || j.totalSteps || 5), 0);
  const completedStagesAcrossAll = allJourneys.reduce(
    (sum, j) => sum + (j.steps?.filter((s) => s.status === 'Completed').length || j.completedSteps || 0),
    0
  );

  const steps = currentJourney?.steps || [];
  const completedSteps = isMasterPortfolio
    ? completedStagesAcrossAll
    : steps.filter((s) => s.status === 'Completed').length;
  const inProgressSteps = isMasterPortfolio
    ? allJourneys.reduce((sum, j) => sum + (j.steps?.filter((s) => s.status === 'In Progress').length || 0), 0)
    : steps.filter((s) => s.status === 'In Progress').length;
  const totalSteps = isMasterPortfolio ? totalStagesAcrossAll : steps.length || currentJourney?.totalSteps || 5;
  const progressPercent = Math.round((completedSteps / (totalSteps || 1)) * 100);

  const handleCopy = () => {
    navigator.clipboard.writeText(verifyUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSelect = (id: string) => {
    setSelectedJourneyId(id);
    if (id !== 'all' && onSelectJourney) {
      onSelectJourney(id);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-xl font-black text-[#11261F] dark:text-white">
            Journey Verification QR & Compliance Portfolio
          </h3>
          <p className="text-xs text-[#6C8075] dark:text-[#9FB7AC] mt-0.5">
            Generate and scan verified QR codes for any individual goal or your complete citizen compliance portfolio.
          </p>
        </div>
      </div>

      {/* Multi-Journey Switcher Pills */}
      {allJourneys.length > 1 && (
        <div className="bg-white dark:bg-[#0D1A16] p-3 rounded-2xl border border-[#DCE8E1] dark:border-[#1E3B32] shadow-2xs space-y-2">
          <div className="text-[11px] font-bold text-[#5C7066] dark:text-[#8C9B94] px-1">
            Select Civic Procedure to Generate QR:
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {/* Master Portfolio Option */}
            <button
              type="button"
              onClick={() => handleSelect('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 border ${
                isMasterPortfolio
                  ? 'bg-[#1B4D3E] text-white border-[#1B4D3E] shadow-xs'
                  : 'bg-[#F2F7F4] dark:bg-[#142B23] text-[#4A5D54] dark:text-[#9FB7AC] border-[#DCE8E0] dark:border-[#1E3B32]'
              }`}
            >
              <span>All Journeys (Master Portfolio)</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                isMasterPortfolio ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {allJourneys.length}
              </span>
            </button>

            {/* Individual Journeys */}
            {allJourneys.map((j) => {
              const isSelected = selectedJourneyId === j.id;
              const jCompleted = j.steps?.filter((s) => s.status === 'Completed').length || j.completedSteps || 0;
              const jTotal = j.steps?.length || j.totalSteps || 5;

              return (
                <button
                  key={j.id}
                  type="button"
                  onClick={() => handleSelect(j.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 border ${
                    isSelected
                      ? 'bg-[#1B4D3E] text-white border-[#1B4D3E] shadow-xs'
                      : 'bg-[#F2F7F4] dark:bg-[#142B23] text-[#4A5D54] dark:text-[#9FB7AC] border-[#DCE8E0] dark:border-[#1E3B32]'
                  }`}
                >
                  <span className="max-w-[160px] truncate">{j.title}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}>
                    {jCompleted}/{jTotal}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* Left: Scannable QR Code Card */}
        <div className="md:col-span-5 bg-white dark:bg-[#0D1A16] rounded-3xl border border-[#DCE8E1] dark:border-[#1E3B32] p-6 shadow-sm flex flex-col items-center text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-[10px] font-black uppercase tracking-wider border border-emerald-200 dark:border-emerald-800">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{isMasterPortfolio ? 'Master Portfolio QR' : 'Official Procedure QR'}</span>
          </div>

          {/* Real Scannable QR Code */}
          <div className="p-3 bg-white rounded-2xl border-2 border-[#1B4D3E]/20 shadow-md">
            <img
              src={qrCodeUrl}
              alt="Scan to verify journey status"
              className="w-48 h-48 rounded-lg object-contain"
              loading="lazy"
            />
          </div>

          <p className="text-xs text-[#5C7066] dark:text-[#8C9B94] max-w-xs leading-relaxed">
            {isMasterPortfolio
              ? 'Point any mobile camera at this code to verify all active civic journeys for this citizen account.'
              : `Point any phone camera to verify clearances for "${currentJourney?.title}".`}
          </p>

          <div className="w-full pt-2 border-t border-[#EDF2EE] dark:border-[#1E3B32] flex flex-col gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="w-full py-2 px-3 rounded-xl bg-[#1B4D3E] hover:bg-[#143B2F] text-white text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{copied ? 'Verification Link Copied!' : 'Copy Shareable Link'}</span>
            </button>

            <a
              href={verifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 px-3 rounded-xl border border-[#DCE8E1] dark:border-[#1E3B32] bg-[#F7FAF8] dark:bg-[#12241E] text-xs font-bold text-[#1B4D3E] dark:text-[#6EE7B7] hover:bg-emerald-50 transition-all flex items-center justify-center gap-1.5"
            >
              <span>Open Scanned Preview</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Right: Live Progress & Clearance Summary */}
        <div className="md:col-span-7 space-y-4">
          
          {/* Status Overview Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-[#1B4D3E] via-[#153D31] to-[#0E271F] text-white shadow-lg space-y-4 border border-[#2B6352]">
            <div className="flex items-center justify-between border-b border-white/20 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-200 block">
                  {isMasterPortfolio ? 'Unified Citizen Portfolio' : 'Public Compliance Status'}
                </span>
                <h4 className="text-base font-black text-white">
                  {isMasterPortfolio ? 'Master Citizen Compliance Portfolio' : currentJourney?.title}
                </h4>
              </div>
              <span className="text-xs font-bold text-amber-300 px-2.5 py-1 rounded-lg bg-white/10 border border-white/20">
                {progressPercent}% Cleared
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-emerald-200 text-[11px] block">
                  {isMasterPortfolio ? 'Active Civic Goals:' : 'Active Jurisdiction:'}
                </span>
                <span className="font-bold text-white mt-0.5 block">
                  {isMasterPortfolio ? `${allJourneys.length} Procedures Tracked` : currentJourney?.location || 'Mumbai, Maharashtra'}
                </span>
              </div>
              <div>
                <span className="text-emerald-200 text-[11px] block">Stages Completed:</span>
                <span className="font-bold text-white mt-0.5 block">{completedSteps} of {totalSteps} Stages</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2.5 rounded-full bg-black/30 overflow-hidden border border-white/20">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-amber-300 transition-all"
                style={{ width: `${Math.max(5, progressPercent)}%` }}
              />
            </div>
          </div>

          {/* Step-by-Step Clearance List or Master Journey List */}
          <div className="bg-white dark:bg-[#0D1A16] rounded-3xl border border-[#DCE8E1] dark:border-[#1E3B32] p-5 shadow-xs space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#11261F] dark:text-white">
              {isMasterPortfolio ? 'All Active Civic Clearances in Portfolio:' : 'What Someone Sees When Scanning:'}
            </h4>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1 scrollbar-thin">
              {isMasterPortfolio ? (
                allJourneys.map((j) => {
                  const jCompleted = j.steps?.filter((s) => s.status === 'Completed').length || j.completedSteps || 0;
                  const jTotal = j.steps?.length || j.totalSteps || 5;
                  const jPct = Math.round((jCompleted / (jTotal || 1)) * 100);

                  return (
                    <div
                      key={j.id}
                      onClick={() => handleSelect(j.id)}
                      className="p-3.5 rounded-2xl border border-[#E8ECE9] dark:border-[#1E3B32] hover:border-[#1B4D3E] transition-all cursor-pointer bg-[#FBFDFB] dark:bg-[#12241E] flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                            {j.category || 'Statutory'}
                          </span>
                          <span className="text-[10px] text-slate-400">{j.location}</span>
                        </div>
                        <h5 className="font-bold text-[#11261F] dark:text-white">{j.title}</h5>
                      </div>

                      <div className="flex flex-col items-end shrink-0">
                        <span className="font-black text-[#1B4D3E] dark:text-[#6EE7B7] text-xs">
                          {jCompleted} / {jTotal} Done
                        </span>
                        <span className="text-[10px] text-slate-500 font-bold">{jPct}%</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                steps.map((step, idx) => {
                  const isCompleted = step.status === 'Completed';
                  const isInProgress = step.status === 'In Progress';

                  return (
                    <div
                      key={step.id || idx}
                      className="p-3 rounded-xl border border-[#E8ECE9] dark:border-[#1E3B32] flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                          isCompleted
                            ? 'bg-emerald-600 text-white'
                            : isInProgress
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                        }`}>
                          {isCompleted ? '✓' : idx + 1}
                        </div>
                        <span className="font-bold text-[#11261F] dark:text-white truncate max-w-[220px]">
                          {step.title}
                        </span>
                      </div>

                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isCompleted
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : isInProgress
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}>
                        {isCompleted ? 'Cleared' : isInProgress ? 'In Progress' : 'Pending'}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

// ----------------------------------------------------
// 6. SAVED ROADMAPS VIEW
// ----------------------------------------------------
export const SavedView: React.FC<{
  journey: CivicJourney;
  onGoToJourney: () => void;
}> = ({ journey, onGoToJourney }) => {
  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <div>
        <h3 className="text-xl font-black text-[#11261F]">Saved Civic Roadmaps</h3>
        <p className="text-xs text-[#6C8075]">
          Bookmarked government procedures and persistent progress synced with your citizen account.
        </p>
      </div>

      <div className="p-5 rounded-2xl bg-white border border-[#DCE8E1] shadow-2xs hover:border-[#1B4D3E] transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
                Active Roadmap
              </span>
              <span className="text-xs text-[#6C8075]">• {journey.location}</span>
            </div>
            <h4 className="text-sm font-extrabold text-[#11261F]">{journey.title}</h4>
            <p className="text-xs text-[#5C7066] mt-0.5">
              {journey.completedSteps} of {journey.totalSteps} steps completed ({journey.totalSteps > 0 ? Math.round((journey.completedSteps / journey.totalSteps) * 100) : 0}%)
            </p>
          </div>

          <button
            onClick={onGoToJourney}
            className="px-4 py-2 rounded-xl bg-[#1B4D3E] hover:bg-[#143B2F] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <span>Resume Journey</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------
// 7. SETTINGS & PREFERENCES VIEW
// ----------------------------------------------------
export const SettingsView: React.FC<{
  onResetRoadmap: () => void;
}> = ({ onResetRoadmap }) => {
  const { setTheme, isDarkMode } = useTheme();

  return (
    <div className="space-y-5 animate-in fade-in duration-200 max-w-2xl">
      <div>
        <h3 className="text-xl font-black text-[#11261F] dark:text-white">Citizen Portal Settings</h3>
        <p className="text-xs text-[#6C8075] dark:text-[#9FB7AC]">
          Manage appearance theme, AI engine configuration, and local state.
        </p>
      </div>

      <div className="p-5 rounded-2xl bg-white dark:bg-[#0E1E19] border border-[#DCE8E1] dark:border-[#1F3E33] shadow-2xs space-y-5">
        {/* Appearance & Theme Selector */}
        <div>
          <h4 className="text-xs font-extrabold text-[#11261F] dark:text-white uppercase tracking-wider mb-2.5">
            Display Appearance & Theme
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`p-3.5 rounded-xl border flex items-center gap-3 transition-all cursor-pointer ${!isDarkMode
                  ? 'border-[#1B4D3E] bg-[#EAF2ED] text-[#1B4D3E] shadow-2xs font-bold'
                  : 'border-[#DCE8E1] dark:border-[#1F3E33] bg-[#F6FAF8] dark:bg-[#12241E] text-[#4A5D54] dark:text-[#9FB7AC] hover:bg-[#EDF5F1] dark:hover:bg-[#172D25]'
                }`}
            >
              <Sun className={`w-5 h-5 ${!isDarkMode ? 'text-[#1B4D3E]' : 'text-amber-500'}`} />
              <div className="text-left">
                <div className="text-xs font-bold">Light Mode</div>
                <div className="text-[10px] opacity-80">Day sage palette & Gateway day monument</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`p-3.5 rounded-xl border flex items-center gap-3 transition-all cursor-pointer ${isDarkMode
                  ? 'border-[#34D399] bg-[#18392F] text-[#6EE7B7] shadow-2xs font-bold'
                  : 'border-[#DCE8E1] dark:border-[#1F3E33] bg-[#F6FAF8] dark:bg-[#12241E] text-[#4A5D54] dark:text-[#9FB7AC] hover:bg-[#EDF5F1] dark:hover:bg-[#172D25]'
                }`}
            >
              <Moon className={`w-5 h-5 ${isDarkMode ? 'text-[#6EE7B7]' : 'text-[#1B4D3E]'}`} />
              <div className="text-left">
                <div className="text-xs font-bold">Dark Mode</div>
                <div className="text-[10px] opacity-80">Night emerald & Gateway illuminated night</div>
              </div>
            </button>
          </div>
        </div>

        {/* AI Engine */}
        <div className="pt-3 border-t border-[#EDF2EE] dark:border-[#1F3E33]">
          <h4 className="text-xs font-extrabold text-[#11261F] dark:text-white uppercase tracking-wider mb-2">
            AI Engine Configuration
          </h4>
          <div className="p-3.5 rounded-xl bg-[#F6FAF8] dark:bg-[#12241E] border border-[#DCEAE2] dark:border-[#1F3E33] text-xs space-y-1">
            <div className="flex items-center justify-between font-bold text-[#1B4D3E] dark:text-[#6EE7B7]">
              <span>Google Gemini API</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px]">Active</span>
            </div>
            <p className="text-[#5C7066] dark:text-[#9FB7AC] text-[11px] leading-relaxed">
              Configured via server <code className="font-mono bg-white dark:bg-[#0D1A16] px-1.5 py-0.5 rounded border border-[#D5E3DB] dark:border-[#1F3E33]">GEMINI_API_KEY</code> for real-time goal interpretation and statutory gazette rule extraction.
            </p>
          </div>
        </div>

        {/* Reset Data */}
        <div className="pt-3 border-t border-[#EDF2EE] dark:border-[#1F3E33]">
          <h4 className="text-xs font-extrabold text-[#11261F] dark:text-white uppercase tracking-wider mb-2">
            Reset Data & Clear Cache
          </h4>
          <p className="text-xs text-[#5C7066] dark:text-[#9FB7AC] mb-3 leading-relaxed">
            Reset your current civic roadmap back to initial baseline or clear local progress.
          </p>
          <button
            onClick={onResetRoadmap}
            className="px-4 py-2 rounded-xl bg-white dark:bg-[#12241E] text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-xs font-bold transition-all cursor-pointer"
          >
            Reset Active Roadmap
          </button>
        </div>
      </div>
    </div>
  );
};

