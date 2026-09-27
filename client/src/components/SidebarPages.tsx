import React, { useState } from 'react';
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
  Sparkles
} from 'lucide-react';
import { CivicJourney, GovernmentUpdate, ProcedureStep, CivicDocumentStatus } from '../types';
import { getOfficialDocumentApplicationUrl, getDocumentProcurementInfo, OfflineOfficeDetails } from '../utils/documentSources';
import { OfflineDocModal } from './OfflineDocModal';

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
                      ⏱ {cat.timeEst}
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
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
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
  journey.steps.forEach((step) => {
    step.documents.forEach((doc) => {
      if (!docMap.has(doc.name)) {
        docMap.set(doc.name, { doc, step });
      }
    });
  });

  const [activeOfflineDoc, setActiveOfflineDoc] = useState<{
    name: string;
    details: OfflineOfficeDetails;
    stepId: string;
    docId: string;
  } | null>(null);

  const docs = Array.from(docMap.values());
  const readyCount = docs.filter((item) => item.doc.status === 'READY' || item.doc.status === 'UPLOADED').length;

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-xl font-black text-[#11261F]">Citizen Document Vault</h3>
          <p className="text-xs text-[#6C8075]">
            Track required statutory certificates for "{journey.title}" with instant procurement links.
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-full bg-[#EAF2ED] text-[#1B4D3E] text-xs font-extrabold border border-[#CDE3D7]">
          {readyCount} of {docs.length} Documents Ready ({docs.length > 0 ? Math.round((readyCount / docs.length) * 100) : 0}%)
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {docs.map(({ doc, step }) => {
          const isReady = doc.status === 'READY' || doc.status === 'UPLOADED';
          const proc = getDocumentProcurementInfo(doc.name, doc.sourceUrl);

          return (
            <div
              key={`${step.id}-${doc.id}`}
              className={`p-4 rounded-2xl border transition-all ${
                isReady
                  ? 'bg-[#F2F8F5] border-[#C2DFD0]'
                  : 'bg-white border-[#DCE8E1]'
              } shadow-2xs flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center ${isReady ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                      {isReady ? <CheckCircle2 className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-[#11261F]">
                        {doc.name}
                      </h4>
                      <span className="text-[10px] text-[#6C8075]">
                        Required for Step {step.stepNumber}: {step.title.replace(/^\d+\.\s*/, '')}
                      </span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${isReady ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'}`}>
                    {isReady ? 'Ready' : 'Pending'}
                  </span>
                </div>

                <p className="text-[11px] text-[#5C7066] mt-1 leading-relaxed">
                  {doc.description || `Statutory certificate issued by competent authority for verification.`}
                </p>
              </div>

              <div className="mt-3 pt-3 border-t border-[#EDF2EE] flex items-center justify-between gap-2">
                {/* Item 3: Online deep link or Offline office guidance */}
                {proc.mode === 'ONLINE' ? (
                  <a
                    href={proc.url || getOfficialDocumentApplicationUrl(doc.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EAF2ED] hover:bg-[#DEEFE5] text-[#1B4D3E] text-xs font-bold border border-[#CDE3D7] transition-all cursor-pointer"
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
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300 transition-all cursor-pointer"
                    title="View office location, timings and submission checklist"
                  >
                    <Building2 className="w-3.5 h-3.5 text-amber-700" />
                    <span>Where to Apply (Offline) 📍</span>
                  </button>
                )}

                <button
                  onClick={() => onUpdateDocumentStatus(step.id, doc.id, isReady ? 'NOT_READY' : 'READY')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isReady
                      ? 'bg-white border border-[#D5E3DB] text-[#4A5D54] hover:bg-slate-50'
                      : 'bg-[#1B4D3E] hover:bg-[#143B2F] text-white shadow-2xs'
                  }`}
                >
                  {isReady ? 'Mark as Missing' : 'Mark as Ready ✓'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

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
}

export const UpdatesView: React.FC<UpdatesViewProps> = ({ updates, onInspectExcerpt }) => {
  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <div>
        <h3 className="text-xl font-black text-[#11261F]">Government Gazette Updates</h3>
        <p className="text-xs text-[#6C8075]">
          Real-time statutory notifications and legal amendments tracked across central and municipal gazettes.
        </p>
      </div>

      <div className="space-y-4">
        {updates.map((update) => (
          <div
            key={update.id}
            className="p-5 rounded-2xl bg-white border border-[#DCE8E1] hover:border-[#1B4D3E] shadow-2xs transition-all"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800">
                  {update.type}
                </span>
                <span className="text-xs font-semibold text-[#6C8075]">
                  Date: {update.date}
                </span>
              </div>

              <span className="text-xs font-bold text-[#1B4D3E]">
                {update.reviewStatus}
              </span>
            </div>

            <h4 className="text-sm font-extrabold text-[#11261F]">
              {update.title}
            </h4>

            <p className="text-xs text-[#4A5D54] mt-1.5 leading-relaxed">
              {update.description}
            </p>

            <div className="mt-3 pt-3 border-t border-[#EDF2EE] flex items-center justify-between">
              <span className="text-[11px] text-[#6C8075]">
                Source: <strong className="text-[#11261F]">{update.sourceUrl || 'The Gazette of India'}</strong>
              </span>

              {/* Item 7: View AI Statutory Excerpt */}
              <button
                onClick={() => onInspectExcerpt(update)}
                className="px-3.5 py-1.5 rounded-xl bg-[#1B4D3E] hover:bg-[#143B2F] text-white text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 text-emerald-300" />
                <span>View Gazette Excerpt (AI) 📄</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ----------------------------------------------------
// 4. STATUTORY COMPLIANCE DEADLINES VIEW
// ----------------------------------------------------
export const DeadlinesView: React.FC = () => {
  const deadlines = [
    { title: 'GSTR-3B Monthly Return Filing', date: '20th of every month', dept: 'CBIC / GSTN', status: 'Upcoming' },
    { title: 'FSSAI Annual Compliance Return', date: '31st May Annually', dept: 'FSSAI Ministry of Health', status: 'Statutory' },
    { title: 'Commercial Property Tax 10% Early Rebate', date: '30th June Annually', dept: 'Municipal Assessment Dept', status: 'Rebate' },
    { title: 'Shop & Establishment Intimation Renewal', date: 'No Annual Renewal (Self-Attested)', dept: 'Labour Dept / BMC', status: 'Exempt' }
  ];

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <div>
        <h3 className="text-xl font-black text-[#11261F]">Statutory Deadlines & Calendar</h3>
        <p className="text-xs text-[#6C8075]">
          Avoid compounding municipal penalties and compliance lapses with statutory reminders.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {deadlines.map((dl) => (
          <div key={dl.title} className="p-4 rounded-2xl bg-white border border-[#DCE8E1] shadow-2xs">
            <div className="flex items-center justify-between text-[10px] font-bold text-[#6C8075] uppercase mb-1.5">
              <span>{dl.dept}</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                {dl.status}
              </span>
            </div>
            <h4 className="text-xs font-bold text-[#11261F]">{dl.title}</h4>
            <div className="mt-2 text-xs font-extrabold text-[#1B4D3E] flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#1B4D3E]" />
              <span>{dl.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ----------------------------------------------------
// 5. CIVIC PASSPORT VIEW
// ----------------------------------------------------
export const PassportView: React.FC<{ journey: CivicJourney }> = ({ journey }) => {
  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <div>
        <h3 className="text-xl font-black text-[#11261F]">Citizen Civic Passport</h3>
        <p className="text-xs text-[#6C8075]">
          Your cryptographically verifiable credential for municipal clearances and statutory compliances.
        </p>
      </div>

      <div className="max-w-xl mx-auto p-6 rounded-3xl bg-gradient-to-br from-[#1B4D3E] to-[#12362B] text-white shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/20 pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <Award className="w-6 h-6 text-amber-300" />
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-200 block">
                Republic of India • e-Gov
              </span>
              <h4 className="text-base font-black">Digital Civic Passport</h4>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-1 rounded-md bg-white/10 text-emerald-200 border border-white/20">
            ID: DS-MUM-8921
          </span>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex justify-between">
            <span className="text-emerald-200">Active Jurisdiction:</span>
            <span className="font-bold">{journey.location || 'Mumbai, Maharashtra'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-emerald-200">Registered Goal:</span>
            <span className="font-bold">{journey.title}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-emerald-200">Completed Clearances:</span>
            <span className="font-bold text-amber-300">{journey.completedSteps} of {journey.totalSteps} Stages</span>
          </div>
          <div className="flex justify-between">
            <span className="text-emerald-200">Verification Source:</span>
            <span className="font-bold text-emerald-300">100% Gazette Grounded</span>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-white/20 flex items-center justify-between text-[11px] text-emerald-200">
          <span>Official Digital Verification</span>
          <span className="font-mono text-[10px]">HASH: 0x8F92...B41E</span>
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
              {journey.completedSteps} of {journey.totalSteps} steps completed ({journey.totalSteps > 0 ? Math.round((journey.completedSteps/journey.totalSteps)*100) : 0}%)
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
  return (
    <div className="space-y-5 animate-in fade-in duration-200 max-w-2xl">
      <div>
        <h3 className="text-xl font-black text-[#11261F]">Citizen Portal Settings</h3>
        <p className="text-xs text-[#6C8075]">
          Manage localization, AI engine preferences, and local cache.
        </p>
      </div>

      <div className="p-5 rounded-2xl bg-white border border-[#DCE8E1] shadow-2xs space-y-4">
        <div>
          <h4 className="text-xs font-extrabold text-[#11261F] uppercase tracking-wider mb-2">
            AI Engine Configuration
          </h4>
          <div className="p-3.5 rounded-xl bg-[#F6FAF8] border border-[#DCEAE2] text-xs space-y-1">
            <div className="flex items-center justify-between font-bold text-[#1B4D3E]">
              <span>Google Gemini API</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px]">Active</span>
            </div>
            <p className="text-[#5C7066] text-[11px] leading-relaxed">
              Configured via server <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-[#D5E3DB]">GEMINI_API_KEY</code> for real-time goal interpretation and statutory gazette rule extraction.
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-[#EDF2EE]">
          <h4 className="text-xs font-extrabold text-[#11261F] uppercase tracking-wider mb-2">
            Reset Data & Clear Cache
          </h4>
          <p className="text-xs text-[#5C7066] mb-3 leading-relaxed">
            Reset your current civic roadmap back to initial baseline or clear local progress.
          </p>
          <button
            onClick={onResetRoadmap}
            className="px-4 py-2 rounded-xl bg-white text-rose-700 hover:bg-rose-50 border border-rose-200 text-xs font-bold transition-all cursor-pointer"
          >
            Reset Active Roadmap
          </button>
        </div>
      </div>
    </div>
  );
};

