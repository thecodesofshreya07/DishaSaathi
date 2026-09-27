import { CivicJourney, DATA_VERSION } from '../types';

export const initialDefaultJourneys: CivicJourney[] = [
  {
    id: 'journey-demo-bakery',
    title: 'Commercial Bakery Setup & Licensing',
    query: 'I want to open a commercial bakery in Mumbai',
    location: 'Mumbai, Maharashtra',
    category: 'Business & Commerce',
    dataVersion: DATA_VERSION,
    jurisdictionScope: 'Municipal (Mumbai) & State (Maharashtra)',
    totalSteps: 5,
    completedSteps: 2,
    totalDocuments: 6,
    readyDocuments: 4,
    pendingDocuments: 2,
    lastUpdated: 'Today',
    status: 'In Progress',
    steps: [
      {
        id: 'step-1',
        stepNumber: 1,
        title: 'Udyam MSME Enterprise Registration',
        category: 'Business Registration',
        department: 'Ministry of Micro, Small and Medium Enterprises (MSME)',
        authority: 'Government of India',
        description: 'Permanent digital identity for your micro enterprise with 100% statutory fee waiver and fast-track loan access.',
        plainLanguageSummary: 'Official government ID registering your commercial bakery business as an MSME.',
        whyRequired: 'Mandatory prerequisite to qualify for government subsidies, priority bank lending, and municipal utility connections.',
        status: 'Completed',
        documents: [
          { id: 'doc-1', name: 'Aadhaar Card of Business Owner', isMandatory: true, status: 'READY', category: 'IDENTITY' },
          { id: 'doc-2', name: 'PAN Card of Enterprise / Proprietor', isMandatory: true, status: 'READY', category: 'IDENTITY' },
          { id: 'doc-3', name: 'Bank Account Details & Cancelled Cheque', isMandatory: true, status: 'READY', category: 'FINANCIAL' }
        ],
        prerequisites: [],
        fee: { amount: '₹0 (Free statutory portal registration)', description: 'Government fee waived' },
        processingTime: 'Instant (15 Minutes)',
        applicationMode: 'Online',
        applicationUrl: 'https://udyamregistration.gov.in',
        source: {
          id: 'src-1',
          title: 'Official Udyam Registration Portal',
          url: 'https://udyamregistration.gov.in',
          department: 'Ministry of MSME',
          domain: 'udyamregistration.gov.in',
          lastChecked: '2026-09-27',
          verificationStatus: 'Verified'
        }
      },
      {
        id: 'step-2',
        stepNumber: 2,
        title: 'Shop & Establishment Registration (Gumasta)',
        category: 'Municipal Licensing',
        department: 'Brihanmumbai Municipal Corporation (BMC)',
        authority: 'Municipal Corporation of Greater Mumbai',
        description: 'Statutory municipal registration granting legal permission to operate a commercial shop or establishment within Mumbai municipal jurisdiction.',
        plainLanguageSummary: 'BMC municipal trade license allowing your bakery shop to operate legally in Mumbai.',
        whyRequired: 'Mandatory under Maharashtra Shops & Establishments Act to employ staff and operate retail/commercial counters.',
        status: 'In Progress',
        documents: [
          { id: 'doc-4', name: 'Registered Commercial Lease Agreement or Electricity Bill', isMandatory: true, status: 'READY', category: 'PROPERTY' },
          { id: 'doc-5', name: 'Shop Frontage Signboard Photo in Marathi (Devanagari)', isMandatory: true, status: 'NOT_READY', category: 'PHOTOGRAPH' }
        ],
        prerequisites: ['step-1'],
        fee: { amount: '₹2,360', description: 'Municipal registration charge' },
        processingTime: '1 - 3 Working Days',
        applicationMode: 'Online',
        applicationUrl: 'https://aaplesarkar.mahaonline.gov.in',
        source: {
          id: 'src-2',
          title: 'Aaple Sarkar Maharashtra Portal',
          url: 'https://aaplesarkar.mahaonline.gov.in',
          department: 'Labour Department, Maharashtra',
          domain: 'aaplesarkar.mahaonline.gov.in',
          lastChecked: '2026-09-27',
          verificationStatus: 'Verified'
        }
      },
      {
        id: 'step-3',
        stepNumber: 3,
        title: 'FSSAI Food Business State License',
        category: 'Food Safety & Hygiene',
        department: 'Food Safety and Standards Authority of India (FSSAI)',
        authority: 'Ministry of Health & Family Welfare',
        description: 'Mandatory statutory food safety clearance certifying compliance with sanitary baking standards and ingredient regulations.',
        plainLanguageSummary: 'Food safety certificate ensuring your baked goods meet national hygiene standards.',
        whyRequired: 'Legal obligation for all food preparation, storage, packaging, and commercial sales in India.',
        status: 'Pending',
        documents: [
          { id: 'doc-6', name: 'Food Safety Management Plan (FSMS) & Water Potability Test Report', isMandatory: true, status: 'NOT_READY', category: 'OTHER' }
        ],
        prerequisites: ['step-1', 'step-2'],
        fee: { amount: '₹2,000 / year', description: 'Annual state food license fee' },
        processingTime: '7 - 14 Days',
        applicationMode: 'Online',
        applicationUrl: 'https://foscos.fssai.gov.in',
        source: {
          id: 'src-3',
          title: 'FSSAI FoSCoS Portal',
          url: 'https://foscos.fssai.gov.in',
          department: 'FSSAI Central & State Authority',
          domain: 'foscos.fssai.gov.in',
          lastChecked: '2026-09-27',
          verificationStatus: 'Verified'
        }
      },
      {
        id: 'step-4',
        stepNumber: 4,
        title: 'Mumbai Fire Brigade Safety NOC',
        category: 'Fire Safety & Clearance',
        department: 'Mumbai Fire Brigade (BMC)',
        authority: 'Chief Fire Officer, Mumbai',
        description: 'Fire hazard assessment and clearance for commercial ovens, LPG/gas piping, and kitchen safety exits.',
        plainLanguageSummary: 'Fire safety clearance for bakery ovens and commercial kitchen equipment.',
        whyRequired: 'Mandatory for commercial kitchens with baking ovens or high-power electric connections.',
        status: 'Pending',
        documents: [
          { id: 'doc-7', name: 'Fire Extinguisher Installation Audit & Layout Plan', isMandatory: true, status: 'NOT_READY', category: 'OTHER' }
        ],
        prerequisites: ['step-2'],
        fee: { amount: '₹1,500', description: 'Inspection & certification fee' },
        processingTime: '5 - 7 Days',
        applicationMode: 'Hybrid',
        applicationUrl: 'https://portal.mcgm.gov.in',
        source: {
          id: 'src-4',
          title: 'BMC Citizen Portal',
          url: 'https://portal.mcgm.gov.in',
          department: 'Mumbai Fire Brigade',
          domain: 'portal.mcgm.gov.in',
          lastChecked: '2026-09-27',
          verificationStatus: 'Verified'
        }
      },
      {
        id: 'step-5',
        stepNumber: 5,
        title: 'GST Identification Number (GSTIN)',
        category: 'Taxation & Revenue',
        department: 'Goods and Services Tax Network (GSTN)',
        authority: 'Central Board of Indirect Taxes & Customs',
        description: 'Single national indirect tax registration enabling input tax credits and inter-state purchase of raw materials.',
        plainLanguageSummary: 'GST tax number to issue official tax invoices and claim tax input credits.',
        whyRequired: 'Required for commercial tax compliance and purchasing bulk baking ingredients with tax invoice.',
        status: 'Pending',
        documents: [
          { id: 'doc-8', name: 'Bank Statement & Electricity Bill of Bakery Premises', isMandatory: true, status: 'READY', category: 'FINANCIAL' }
        ],
        prerequisites: ['step-1'],
        fee: { amount: '₹0 (Free portal registration)', description: 'Government filing charge waived' },
        processingTime: '3 - 7 Working Days',
        applicationMode: 'Online',
        applicationUrl: 'https://www.gst.gov.in',
        source: {
          id: 'src-5',
          title: 'Official GST Portal',
          url: 'https://www.gst.gov.in',
          department: 'GSTN',
          domain: 'gst.gov.in',
          lastChecked: '2026-09-27',
          verificationStatus: 'Verified'
        }
      }
    ]
  },
  {
    id: 'journey-demo-flat',
    title: 'Buying a New Flat in Mumbai',
    query: 'Buy a new flat in Mumbai',
    location: 'Mumbai, Maharashtra',
    category: 'Property & Housing',
    dataVersion: DATA_VERSION,
    jurisdictionScope: 'MahaRERA & Inspector General of Registration (IGR Maharashtra)',
    totalSteps: 6,
    completedSteps: 2,
    totalDocuments: 7,
    readyDocuments: 5,
    pendingDocuments: 2,
    lastUpdated: 'Yesterday',
    status: 'In Progress',
    steps: [
      {
        id: 'flat-step-1',
        stepNumber: 1,
        title: 'MahaRERA Registration & Title Search Verification',
        category: 'Legal Due Diligence',
        department: 'Maharashtra Real Estate Regulatory Authority (MahaRERA)',
        authority: 'Govt of Maharashtra',
        description: 'Verify project RERA approval, builder litigation record, sanctioned building plans, and 30-year title search certificate.',
        plainLanguageSummary: 'Check builder legal approvals and make sure the property has clear legal ownership.',
        whyRequired: 'Protects buyer against unauthorized construction, encumbrances, and project delays.',
        status: 'Completed',
        documents: [
          { id: 'fdoc-1', name: 'MahaRERA Project Registration Certificate', isMandatory: true, status: 'READY', category: 'PROPERTY' },
          { id: 'fdoc-2', name: '30-Year Title Search & Non-Encumbrance Report', isMandatory: true, status: 'READY', category: 'PROPERTY' }
        ],
        prerequisites: [],
        fee: { amount: '₹0 (Public search)', description: 'RERA portal free inspection' },
        processingTime: 'Instant / 1 Day',
        applicationMode: 'Online',
        applicationUrl: 'https://maharera.maharashtra.gov.in',
        source: {
          id: 'fsrc-1',
          title: 'MahaRERA Official Public Portal',
          url: 'https://maharera.maharashtra.gov.in',
          department: 'MahaRERA',
          domain: 'maharera.maharashtra.gov.in',
          lastChecked: '2026-09-27',
          verificationStatus: 'Verified'
        }
      },
      {
        id: 'flat-step-2',
        stepNumber: 2,
        title: 'Draft Agreement for Sale & Allotment Letter',
        category: 'Legal Drafting',
        department: 'Legal Advocate / Builder Sales Desk',
        authority: 'State Bar Council & MahaRERA Model Format',
        description: 'Execution of standard MahaRERA Annexure-A Agreement for Sale detailing carpet area, parking slot, and payment milestones.',
        plainLanguageSummary: 'Written legal contract between you and the seller specifying exact carpet area and terms.',
        whyRequired: 'Statutory basis for calculating stamp duty and registering property ownership at the sub-registrar.',
        status: 'Completed',
        documents: [
          { id: 'fdoc-3', name: 'Signed Allotment Letter & Sanctioned Floor Plan', isMandatory: true, status: 'READY', category: 'PROPERTY' },
          { id: 'fdoc-4', name: 'Buyer & Co-Applicant Aadhaar & PAN Card', isMandatory: true, status: 'READY', category: 'IDENTITY' }
        ],
        prerequisites: ['flat-step-1'],
        fee: { amount: '₹5,000 - ₹15,000', description: 'Legal drafting fee' },
        processingTime: '2 - 3 Days',
        applicationMode: 'Hybrid',
        applicationUrl: 'https://igrmaharashtra.gov.in',
        source: {
          id: 'fsrc-2',
          title: 'Department of Registration & Stamps, Maharashtra',
          url: 'https://igrmaharashtra.gov.in',
          department: 'IGR Maharashtra',
          domain: 'igrmaharashtra.gov.in',
          lastChecked: '2026-09-27',
          verificationStatus: 'Verified'
        }
      },
      {
        id: 'flat-step-3',
        stepNumber: 3,
        title: 'Stamp Duty & Registration Fee E-Challan (GRAS)',
        category: 'State Tax & Revenue',
        department: 'Government Receipt Accounting System (GRAS / Mahakosh)',
        authority: 'Finance Department, Maharashtra',
        description: 'Statutory stamp duty payment (6% for Mumbai: 5% stamp duty + 1% metro cess) and 1% registration fee (capped at ₹30,000).',
        plainLanguageSummary: 'Payment of Maharashtra state stamp duty tax online via government portal.',
        whyRequired: 'Legal requirement under Maharashtra Stamp Act to validate transfer of immovable property.',
        status: 'In Progress',
        documents: [
          { id: 'fdoc-5', name: 'E-Challan MTR Form No. 6 (GRAS Payment Receipt)', isMandatory: true, status: 'READY', category: 'FINANCIAL' }
        ],
        prerequisites: ['flat-step-2'],
        fee: { amount: '6% of Market Value + ₹30,000', description: 'Stamp duty + Registration fee' },
        processingTime: 'Instant (Online NetBanking / NEFT)',
        applicationMode: 'Online',
        applicationUrl: 'https://gras.mahakosh.gov.in',
        source: {
          id: 'fsrc-3',
          title: 'GRAS Mahakosh Portal',
          url: 'https://gras.mahakosh.gov.in',
          department: 'Govt of Maharashtra',
          domain: 'gras.mahakosh.gov.in',
          lastChecked: '2026-09-27',
          verificationStatus: 'Verified'
        }
      },
      {
        id: 'flat-step-4',
        stepNumber: 4,
        title: 'Sub-Registrar Office Biometric Registration',
        category: 'Property Registration',
        department: 'Sub-Registrar of Assurances (Mumbai / Mumbai Suburban)',
        authority: 'IGR Maharashtra',
        description: 'Biometric thumb impression, webcam photograph capture, and witness execution of the Sale Deed before Sub-Registrar.',
        plainLanguageSummary: 'Physical or e-registration appointment where government officially records the sale in public records.',
        whyRequired: 'Mandatory under Indian Registration Act 1908 for transfer of immovable property.',
        status: 'Pending',
        documents: [
          { id: 'fdoc-6', name: 'Original Agreement with E-Challan & 2 Witnesses ID Proofs', isMandatory: true, status: 'NOT_READY', category: 'PROPERTY' }
        ],
        prerequisites: ['flat-step-3'],
        fee: { amount: '₹0 (Included in Step 3)', description: 'No extra counter charges' },
        processingTime: '1 Day (Appointment slot)',
        applicationMode: 'Hybrid',
        applicationUrl: 'https://igrmaharashtra.gov.in',
        source: {
          id: 'fsrc-4',
          title: 'IGR Maharashtra E-Stepin Booking',
          url: 'https://igrmaharashtra.gov.in',
          department: 'IGR Maharashtra',
          domain: 'igrmaharashtra.gov.in',
          lastChecked: '2026-09-27',
          verificationStatus: 'Verified'
        }
      },
      {
        id: 'flat-step-5',
        stepNumber: 5,
        title: 'Download Index-II & Digital Certified Copy',
        category: 'Public Record Recordation',
        department: 'Department of Registration & Stamps',
        authority: 'Inspector General of Registration',
        description: 'Download the official Index-II extract proving registration details, registered volume number, and ownership indexation.',
        plainLanguageSummary: 'Official document proving the government has indexed you as the legal flat owner.',
        whyRequired: 'Bank home loan closure, municipal tax transfer, and future resale.',
        status: 'Pending',
        documents: [
          { id: 'fdoc-7', name: 'Registered Document Serial Number & Token Receipt', isMandatory: true, status: 'NOT_READY', category: 'PROPERTY' }
        ],
        prerequisites: ['flat-step-4'],
        fee: { amount: '₹100', description: 'Digital copy download fee' },
        processingTime: 'Instant (24 Hours post-registration)',
        applicationMode: 'Online',
        applicationUrl: 'https://igrmaharashtra.gov.in',
        source: {
          id: 'fsrc-5',
          title: 'IGR Maharashtra E-Search',
          url: 'https://igrmaharashtra.gov.in',
          department: 'IGR Maharashtra',
          domain: 'igrmaharashtra.gov.in',
          lastChecked: '2026-09-27',
          verificationStatus: 'Verified'
        }
      },
      {
        id: 'flat-step-6',
        stepNumber: 6,
        title: 'Society Share Certificate & BMC Property Tax Mutation',
        category: 'Municipal Record Transfer',
        department: 'Cooperative Housing Society (CHS) & BMC Assessment Dept',
        authority: 'Brihanmumbai Municipal Corporation',
        description: 'Issue of Co-operative Housing Society Share Certificate and mutation of BMC Property Tax assessment ledger in buyer’s name.',
        plainLanguageSummary: 'Transfer municipal property tax bills and housing society membership to your name.',
        whyRequired: 'Ensures water bill, electricity meter, and municipal property tax are billed directly to you.',
        status: 'Pending',
        documents: [],
        prerequisites: ['flat-step-5'],
        fee: { amount: '₹600', description: 'Society transfer & BMC mutation fee' },
        processingTime: '15 - 30 Days',
        applicationMode: 'Hybrid',
        applicationUrl: 'https://portal.mcgm.gov.in',
        source: {
          id: 'fsrc-6',
          title: 'BMC Property Tax Citizen Portal',
          url: 'https://portal.mcgm.gov.in',
          department: 'BMC Assessment & Collection Dept',
          domain: 'portal.mcgm.gov.in',
          lastChecked: '2026-09-27',
          verificationStatus: 'Verified'
        }
      }
    ]
  },
  {
    id: 'journey-demo-license',
    title: 'Permanent Driving License (LMV)',
    query: 'Apply for driving license in Mumbai',
    location: 'Bandra RTO, Mumbai, Maharashtra',
    category: 'Transport & Licensing',
    dataVersion: DATA_VERSION,
    jurisdictionScope: 'Ministry of Road Transport & Highways (MoRTH) & Maharashtra Motor Vehicles Dept',
    totalSteps: 4,
    completedSteps: 2,
    totalDocuments: 4,
    readyDocuments: 3,
    pendingDocuments: 1,
    lastUpdated: '3 days ago',
    status: 'In Progress',
    steps: [
      {
        id: 'dl-step-1',
        stepNumber: 1,
        title: 'Learner’s License (LLR) & Online Traffic Signs Test',
        category: 'Initial Permit',
        department: 'Motor Vehicles Department, Maharashtra',
        authority: 'Ministry of Road Transport & Highways (MoRTH)',
        description: 'Online application on Parivahan Sarathi, Aadhaar-based authentication, and instant online computerized traffic rules exam.',
        plainLanguageSummary: 'Initial 6-month permit allowing you to practice driving with an instructor.',
        whyRequired: 'Statutory prerequisite under Motor Vehicles Act before booking practical driving track test.',
        status: 'Completed',
        documents: [
          { id: 'dldoc-1', name: 'Aadhaar Card (Aadhaar e-KYC)', isMandatory: true, status: 'READY', category: 'IDENTITY' },
          { id: 'dldoc-2', name: 'Form 1 Medical Self-Declaration', isMandatory: true, status: 'READY', category: 'IDENTITY' }
        ],
        prerequisites: [],
        fee: { amount: '₹200', description: 'LLR test & application fee' },
        processingTime: 'Instant (Online test)',
        applicationMode: 'Online',
        applicationUrl: 'https://sarathi.parivahan.gov.in',
        source: {
          id: 'dlsrc-1',
          title: 'Parivahan Sarathi National Portal',
          url: 'https://sarathi.parivahan.gov.in',
          department: 'MoRTH',
          domain: 'parivahan.gov.in',
          lastChecked: '2026-09-27',
          verificationStatus: 'Verified'
        }
      },
      {
        id: 'dl-step-2',
        stepNumber: 2,
        title: 'Mandatory 30-Day Driving Training Completion',
        category: 'Training & Certification',
        department: 'Government Authorized Motor Driving School',
        authority: 'State Transport Authority',
        description: 'Complete minimum 30 days holding Learner’s License and obtain Form-5 training completion certificate if trained at certified school.',
        plainLanguageSummary: 'Mandatory waiting period & practice after getting your learner permit.',
        whyRequired: 'Motor Vehicle Rules require minimum 30-day interval from LL issuance before taking permanent test.',
        status: 'Completed',
        documents: [
          { id: 'dldoc-3', name: 'Valid Learner’s License Copy', isMandatory: true, status: 'READY', category: 'IDENTITY' }
        ],
        prerequisites: ['dl-step-1'],
        fee: { amount: '₹0 (Self) or Driving School Fee', description: 'Practice completion' },
        processingTime: '30 Days Minimum',
        applicationMode: 'Offline',
        applicationUrl: 'https://sarathi.parivahan.gov.in',
        source: {
          id: 'dlsrc-2',
          title: 'Parivahan Sarathi Portal',
          url: 'https://sarathi.parivahan.gov.in',
          department: 'MoRTH',
          domain: 'parivahan.gov.in',
          lastChecked: '2026-09-27',
          verificationStatus: 'Verified'
        }
      },
      {
        id: 'dl-step-3',
        stepNumber: 3,
        title: 'Book RTO Automated Driving Test Track Slot',
        category: 'Practical Test Appointment',
        department: 'Bandra RTO (MH-02), Mumbai',
        authority: 'Transport Commissionerate, Maharashtra',
        description: 'Select RTO test slot, pay statutory DL driving test fee, and bring vehicle with valid Insurance & PUC for automated test track.',
        plainLanguageSummary: 'Schedule your in-person driving test appointment at the local RTO.',
        whyRequired: 'Practical test of vehicle handling (H-track, 8-track, parallel parking, gradient stop).',
        status: 'In Progress',
        documents: [
          { id: 'dldoc-4', name: 'Vehicle Registration Certificate (RC) & Valid PUC / Insurance', isMandatory: true, status: 'NOT_READY', category: 'PROPERTY' }
        ],
        prerequisites: ['dl-step-2'],
        fee: { amount: '₹300', description: 'Driving test fee' },
        processingTime: 'Slot selection (Available 7-10 days ahead)',
        applicationMode: 'Online',
        applicationUrl: 'https://sarathi.parivahan.gov.in',
        source: {
          id: 'dlsrc-3',
          title: 'Parivahan Sarathi Slot Booking',
          url: 'https://sarathi.parivahan.gov.in',
          department: 'MoRTH',
          domain: 'parivahan.gov.in',
          lastChecked: '2026-09-27',
          verificationStatus: 'Verified'
        }
      },
      {
        id: 'dl-step-4',
        stepNumber: 4,
        title: 'Biometric Capture & Smart Card DL Speed Post Dispatch',
        category: 'Licensing & Smart Card',
        department: 'Transport Department, Maharashtra',
        authority: 'Govt of Maharashtra',
        description: 'Pass driving test, capture biometric photo and signature at RTO counter, and receive official Smart Card DL via India Post Speed Post.',
        plainLanguageSummary: 'Final photo capture at RTO and receiving your permanent driving license card at home.',
        whyRequired: 'Legal authorization to drive motor vehicles across India and internationally (with IDP).',
        status: 'Pending',
        documents: [],
        prerequisites: ['dl-step-3'],
        fee: { amount: '₹200 (Smart Card fee) + ₹50 (Postal charge)', description: 'Card printing & dispatch' },
        processingTime: '7 - 10 Working Days for Speed Post Delivery',
        applicationMode: 'Hybrid',
        applicationUrl: 'https://sarathi.parivahan.gov.in',
        source: {
          id: 'dlsrc-4',
          title: 'Sarathi DL Tracking',
          url: 'https://sarathi.parivahan.gov.in',
          department: 'MoRTH',
          domain: 'parivahan.gov.in',
          lastChecked: '2026-09-27',
          verificationStatus: 'Verified'
        }
      }
    ]
  }
];
