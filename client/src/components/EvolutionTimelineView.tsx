import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  History,
  Play,
  Pause,
  Clock,
  ShieldCheck,
  CheckCircle2,
  FileCheck2,
  ArrowRight,
  TrendingDown,
  Building2,
  FileText,
  Car,
  Landmark,
  Layers,
  Award
} from 'lucide-react';

interface EvolutionMilestone {
  year: number;
  label: string;
  eraTitle: string;
  gazetteRef: string;
  gazetteDate: string;
  statutoryAct: string;
  slaDays: number;
  physicalVisits: number;
  statutoryCost: string;
  paperCopiesRequired: number;
  systemMode: 'Manual & Bureaucratic' | 'Hybrid Transition' | 'Digital Public Infrastructure (DPI)';
  description: string;
  eliminatedBottlenecks: string[];
  activeSteps: {
    title: string;
    authority: string;
    mode: 'Physical Queue' | 'Online Portal' | 'Instant API';
    sla: string;
  }[];
}

interface ProcedureScenario {
  id: string;
  title: string;
  shortTitle: string;
  jurisdiction: string;
  category: string;
  summary: string;
  milestones: EvolutionMilestone[];
}

const EVOLUTION_SCENARIOS: ProcedureScenario[] = [
  {
    id: 'food-bakery',
    title: 'Commercial Food & Bakery Establishment License',
    shortTitle: 'Food & Bakery License',
    jurisdiction: 'Mumbai (BMC) & Central FSSAI',
    category: 'Commercial Business & Health',
    summary: 'Chronological transition of Mumbai bakery and food business setup from 6 manual ward queues to instant single-window digital licensing.',
    milestones: [
      {
        year: 2020,
        label: '2020 (Legacy Era)',
        eraTitle: 'Paper Dossiers & Physical Ward Queues',
        gazetteRef: 'BMC Health By-laws 2014 / S&E Manual Act',
        gazetteDate: '15 March 2020',
        statutoryAct: 'Mumbai Municipal Corporation (MMC) Act 1888, Section 394',
        slaDays: 45,
        physicalVisits: 6,
        statutoryCost: 'Rs 4,500 + Agent Overhead',
        paperCopiesRequired: 18,
        systemMode: 'Manual & Bureaucratic',
        description: 'Applicants were required to physically buy paper forms at the BMC Ward Office, gather 4 physical NOCs (Fire, Health, Building, Police), and track sanitary inspectors for manual diary signoffs.',
        eliminatedBottlenecks: [
          'Manual physical queue at BMC Ward Token counter',
          'Physical notarization on 100-rupee stamp paper',
          'Multiple visits to track sanitary inspector diary'
        ],
        activeSteps: [
          { title: 'Physical Gumasta Shop Act Registration Form at Ward', authority: 'BMC Ward Health Department', mode: 'Physical Queue', sla: '14 Days' },
          { title: 'Central FSSAI Physical Form B Submission', authority: 'State Food & Drug Administration (FDA)', mode: 'Physical Queue', sla: '21 Days' },
          { title: 'Physical Fire Station NOC & Building Plan Blueprints', authority: 'Mumbai Fire Brigade Headquarters', mode: 'Physical Queue', sla: '15 Days' },
          { title: 'Sanitary Inspector Site Visit & Diary Signoff', authority: 'Municipal Ward Health Inspector', mode: 'Physical Queue', sla: '10 Days' }
        ]
      },
      {
        year: 2022,
        label: '2022 (FoSCoS Transition)',
        eraTitle: 'FSSAI Digitalization & Aaple Sarkar Pilot',
        gazetteRef: 'FSSAI Order 01-14/FoSCoS/2021',
        gazetteDate: '10 June 2022',
        statutoryAct: 'Food Safety and Standards (Licensing) Regulations 2011',
        slaDays: 25,
        physicalVisits: 3,
        statutoryCost: 'Rs 3,200 Statutory Fee (Online Payment)',
        paperCopiesRequired: 8,
        systemMode: 'Hybrid Transition',
        description: 'FSSAI migrated to the unified FoSCoS portal with online payment. However, municipal health trade licenses still required in-person document scrutiny.',
        eliminatedBottlenecks: [
          'Eliminated Central FSSAI paper dossiers',
          'Digital fee receipt generation via GRAS portal'
        ],
        activeSteps: [
          { title: 'Aaple Sarkar Online Shop Act 24/7 Form', authority: 'Maharashtra Labour Department', mode: 'Online Portal', sla: '7 Days' },
          { title: 'FoSCoS Food Business License e-Filing', authority: 'FSSAI Regional Licensing', mode: 'Online Portal', sla: '14 Days' },
          { title: 'Physical Ward Document Audit & Scrutiny', authority: 'BMC Ward Health Officer', mode: 'Physical Queue', sla: '7 Days' }
        ]
      },
      {
        year: 2024,
        label: '2024 (RTS Act Enforcement)',
        eraTitle: 'Maharashtra Right to Services SLA Mandates',
        gazetteRef: 'Govt Resolution No. RTS-2023/CR-88/PR-2',
        gazetteDate: '12 January 2024',
        statutoryAct: 'Maharashtra Right to Public Services Act 2015 (Strict 15-Day SLA)',
        slaDays: 14,
        physicalVisits: 1,
        statutoryCost: 'Rs 2,100 Statutory Fee',
        paperCopiesRequired: 2,
        systemMode: 'Hybrid Transition',
        description: 'Enforcement of legal statutory deadlines under Section 8 of the RTS Act. If a Ward Officer delays approval past 14 days, citizens hold the legal right to file an instant appellate grievance.',
        eliminatedBottlenecks: [
          'Eliminated indefinite delays through statutory appeal rights',
          'Mandatory DigiLocker Aadhaar e-KYC integration'
        ],
        activeSteps: [
          { title: 'Aaple Sarkar Integrated Shop Act with Aadhaar OTP', authority: 'Maharashtra Labour Department', mode: 'Instant API', sla: '2 Days' },
          { title: 'Unified Single-Window Municipal Trade License', authority: 'BMC Public Health Department', mode: 'Online Portal', sla: '7 Days' },
          { title: 'FoSCoS Auto-Approval on Clear Scrutiny', authority: 'FSSAI Licensing Portal', mode: 'Online Portal', sla: '5 Days' }
        ]
      },
      {
        year: 2026,
        label: '2026 (Modern DPI)',
        eraTitle: 'Paperless Digital Public Infrastructure & Instant QR License',
        gazetteRef: 'Central DPI & Ease of Business Gazette 2025/Vol-9',
        gazetteDate: '01 February 2026',
        statutoryAct: 'National Single Window System (NSWS) & Maharashtra DPI Mandate',
        slaDays: 3,
        physicalVisits: 0,
        statutoryCost: 'Rs 1,650 Transparent Statutory Fee (UPI Instant)',
        paperCopiesRequired: 0,
        systemMode: 'Digital Public Infrastructure (DPI)',
        description: 'Complete end-to-end paperless execution. DigiLocker pulls verified identity & electricity bills automatically, single-window Aaple Sarkar routes data to BMC & FSSAI simultaneously, and QR-coded digital licenses are issued directly to citizen devices.',
        eliminatedBottlenecks: [
          'Zero physical ward visits (100% Contactless)',
          'Zero paper forms - Instant DigiLocker document fetch',
          'Instant UPI payment without bank challan queues'
        ],
        activeSteps: [
          { title: 'DigiLocker 1-Click Identity & Utility Fetch', authority: 'National API Setu / UIDAI', mode: 'Instant API', sla: 'Instant (1 min)' },
          { title: 'National Single Window System (NSWS) Combined Filing', authority: 'Invest India / State Single Window', mode: 'Instant API', sla: '24 Hours' },
          { title: 'QR-Coded Digital Food & Shop Certificate Delivery', authority: 'BMC & FSSAI Integrated Engine', mode: 'Instant API', sla: '48 Hours' }
        ]
      }
    ]
  },
  {
    id: 'rent-agreement',
    title: 'Residential Rent Agreement & Tenant Police Intimation',
    shortTitle: 'Rent & Tenancy Agreement',
    jurisdiction: 'Mumbai & Pune (Maharashtra IGR)',
    category: 'Tenancy & Housing Law',
    summary: 'Evolution of Maharashtra Leave and License registration from physical Sub-Registrar biometrics to 100% digital Aadhaar OTP e-Registration.',
    milestones: [
      {
        year: 2020,
        label: '2020 (Physical Sub-Registrar)',
        eraTitle: 'Physical Stamp Paper & In-Person Witnesses',
        gazetteRef: 'Maharashtra Stamp Rules 1939',
        gazetteDate: '04 January 2020',
        statutoryAct: 'Maharashtra Rent Control Act 1999, Section 55',
        slaDays: 21,
        physicalVisits: 4,
        statutoryCost: 'Rs 1,000 Stamp Duty + Rs 1,000 Reg + Agent Fee',
        paperCopiesRequired: 12,
        systemMode: 'Manual & Bureaucratic',
        description: 'Landlord, tenant, and two physical witnesses had to travel to the Sub-Registrar office, stand in queue for physical biometric thumb impressions, and visit the police station.',
        eliminatedBottlenecks: ['Physical presence of 2 witnesses', 'Physical police station submission queue'],
        activeSteps: [
          { title: 'Purchase of Non-Judicial Physical Stamp Paper', authority: 'Licensed Stamp Vendor Counter', mode: 'Physical Queue', sla: '2 Days' },
          { title: 'Physical Biometrics at Sub-Registrar Office', authority: 'Inspector General of Registration (IGR)', mode: 'Physical Queue', sla: '14 Days' },
          { title: 'Physical Police Tenant Intimation Form', authority: 'Local Police Station', mode: 'Physical Queue', sla: '5 Days' }
        ]
      },
      {
        year: 2024,
        label: '2024 (e-Registration Pilot)',
        eraTitle: 'Aadhaar e-Sign & Automated Police API',
        gazetteRef: 'IGR Notification 2023/Leave-License/e-Sign',
        gazetteDate: '15 March 2024',
        statutoryAct: 'Information Technology Act 2000 & Maharashtra Rent Control Act',
        slaDays: 3,
        physicalVisits: 0,
        statutoryCost: 'Rs 1,000 Stamp Duty + Rs 1,000 Govt Reg Fee',
        paperCopiesRequired: 0,
        systemMode: 'Digital Public Infrastructure (DPI)',
        description: 'Citizens e-Sign agreements using UIDAI Aadhaar biometric or OTP authentication from home, with background police intimation dispatch.',
        eliminatedBottlenecks: ['Zero physical Sub-Registrar visits', 'Automated background police intimation dispatch'],
        activeSteps: [
          { title: 'IGR Maharashtra e-Filing Draft & GRAS e-Challan', authority: 'IGR Maharashtra Portal', mode: 'Online Portal', sla: '2 Hours' },
          { title: 'UIDAI Aadhaar OTP Digital e-Sign', authority: 'UIDAI e-Sign Gateway', mode: 'Instant API', sla: 'Instant' },
          { title: 'Automated Sub-Registrar Approval & Police Intimation', authority: 'IGR & Police API', mode: 'Instant API', sla: '24-48 Hours' }
        ]
      },
      {
        year: 2026,
        label: '2026 (Instant Smart DPI)',
        eraTitle: 'DigiLocker Verified Tenancy & Instant Stamp Delivery',
        gazetteRef: 'DPI Tenancy Standard Mandate 2025/IGR-04',
        gazetteDate: '18 January 2026',
        statutoryAct: 'Digital Public Infrastructure Act & Maharashtra Smart Registration Rules',
        slaDays: 1,
        physicalVisits: 0,
        statutoryCost: 'Rs 1,000 Stamp Duty (Exact Rate)',
        paperCopiesRequired: 0,
        systemMode: 'Digital Public Infrastructure (DPI)',
        description: 'Instant property title verification via Mahabhumi 7/12 land records API and DigiLocker verified tenancy credentials.',
        eliminatedBottlenecks: ['Eliminated fraudulent property ownership claims', 'Instant digital stamp certificate with cryptographic timestamp'],
        activeSteps: [
          { title: 'DigiLocker 1-Tap Credential Linkage', authority: 'API Setu / DigiLocker', mode: 'Instant API', sla: 'Instant (2 mins)' },
          { title: 'Mahabhumi Property Ownership Automated Audit', authority: 'Land Revenue Registry', mode: 'Instant API', sla: 'Instant' },
          { title: 'Instant Registered Certificate Delivery', authority: 'IGR Maharashtra DPI Service', mode: 'Instant API', sla: 'Under 6 Hours' }
        ]
      }
    ]
  },
  {
    id: 'driving-license',
    title: 'Driver\'s License & Inter-State Vehicle Transfer (RTO)',
    shortTitle: 'Driver License & RTO',
    jurisdiction: 'National (MoRTH) & State RTOs',
    category: 'Transport & Motor Vehicles',
    summary: 'Transformation of Regional Transport Offices from crowded agent halls into contactless online testing and automated computerized sensor tracks.',
    milestones: [
      {
        year: 2020,
        label: '2020 (Manual RTO Files)',
        eraTitle: 'Physical Token Queues & Paper Learner Test',
        gazetteRef: 'Central Motor Vehicles Rules 1989',
        gazetteDate: '01 February 2020',
        statutoryAct: 'Motor Vehicles Act 1988',
        slaDays: 30,
        physicalVisits: 4,
        statutoryCost: 'Rs 500 Govt Fee + Agent Overhead',
        paperCopiesRequired: 10,
        systemMode: 'Manual & Bureaucratic',
        description: 'Learners had to stand in long physical queues at RTOs for physical eye tests, written paper exams, and physical RC book dispatch.',
        eliminatedBottlenecks: ['Physical queue for Learner License theory exam', 'Paper Form 28 / Form 29 vehicle transfer booklets'],
        activeSteps: [
          { title: 'Physical File Submission at RTO Inspection Hall', authority: 'Regional Transport Office (RTO)', mode: 'Physical Queue', sla: '7 Days' },
          { title: 'In-Person Written Classroom Exam for LL', authority: 'RTO Motor Vehicle Inspector', mode: 'Physical Queue', sla: '14 Days' },
          { title: 'Physical Permanent Driving Test on Public Road', authority: 'RTO Testing Track', mode: 'Physical Queue', sla: '21 Days' }
        ]
      },
      {
        year: 2023,
        label: '2023 (Faceless Parivahan)',
        eraTitle: 'Contactless Aadhaar-Linked Learner\'s License',
        gazetteRef: 'MoRTH Notification G.S.R. 138(E)',
        gazetteDate: '04 March 2023',
        statutoryAct: 'Central Motor Vehicles (Faceless Services) Amendment Rules 2021',
        slaDays: 7,
        physicalVisits: 1,
        statutoryCost: 'Rs 1,350 (Includes Smart Card & Automated Track Fee)',
        paperCopiesRequired: 0,
        systemMode: 'Digital Public Infrastructure (DPI)',
        description: 'MoRTH launched 58 contactless faceless transport services. Citizens can take the Learner License exam on their home device using AI proctoring.',
        eliminatedBottlenecks: ['Zero RTO visits for Learner License', 'mParivahan digital license recognized nationwide'],
        activeSteps: [
          { title: 'Sarathi Online Application with Aadhaar e-KYC', authority: 'Parivahan Sarathi Gateway', mode: 'Instant API', sla: 'Instant' },
          { title: 'AI-Proctored Online Learner Exam from Home', authority: 'Automated Sarathi Testing Engine', mode: 'Instant API', sla: '10 Mins' },
          { title: 'Automated Computerized Driving Test Track Slot', authority: 'RTO Automated Track', mode: 'Physical Queue', sla: '7 Days' }
        ]
      },
      {
        year: 2026,
        label: '2026 (Automated Smart Mobility)',
        eraTitle: 'Sensor-Track Scoring & Instant Digital Wallet DL',
        gazetteRef: 'National Transport Automation Directive 2025/RTO-9',
        gazetteDate: '10 January 2026',
        statutoryAct: 'Motor Vehicles (Automated Testing & Digital Integration) Rules',
        slaDays: 2,
        physicalVisits: 1,
        statutoryCost: 'Rs 1,350 Transparent Statutory Fee',
        paperCopiesRequired: 0,
        systemMode: 'Digital Public Infrastructure (DPI)',
        description: 'Driving track evaluations are 100% judged by high-precision overhead sensors and video analytics. Digital license is pushed directly to digital wallet.',
        eliminatedBottlenecks: ['Zero human corruption in test track results (Sensor scoring)', 'Instant digital certificate issuance'],
        activeSteps: [
          { title: 'DigiLocker Verified Medical Self-Declaration Form 1A', authority: 'National Telehealth / API Setu', mode: 'Instant API', sla: 'Instant' },
          { title: 'Computerized Sensor Track Driving Test', authority: 'Automated RTO Sensor Track', mode: 'Physical Queue', sla: 'Same Day' },
          { title: 'Instant Digital Driving License Delivery to Phone Wallet', authority: 'DigiLocker & MoRTH DPI Engine', mode: 'Instant API', sla: '2 Hours' }
        ]
      }
    ]
  },
  {
    id: 'building-construction',
    title: 'Residential Building Plan Sanction & AutoDCR Approval',
    shortTitle: 'Building Plan & AutoDCR',
    jurisdiction: 'Maharashtra & Delhi Municipal Corporations',
    category: 'Urban Development & Construction',
    summary: 'Evolution from manual drafting table blueprint reviews and 8 department NOC visits to automated AutoDCR algorithmic building compliance.',
    milestones: [
      {
        year: 2020,
        label: '2020 (Manual Blueprints)',
        eraTitle: 'Blueprints, Ammonia Prints & Physical NOCs',
        gazetteRef: 'Development Control Regulations (DCR 1991)',
        gazetteDate: '12 January 2020',
        statutoryAct: 'Maharashtra Regional and Town Planning (MRTP) Act 1966',
        slaDays: 90,
        physicalVisits: 8,
        statutoryCost: 'Rs 25,000 Scrutiny Fee + Architect Liaison',
        paperCopiesRequired: 24,
        systemMode: 'Manual & Bureaucratic',
        description: 'Architects had to submit physical ammonia blueprint sheets to 8 different municipal departments (Fire, Tree Authority, Water, Sewage, Stormwater, Traffic).',
        eliminatedBottlenecks: ['Ammonia blueprint sheet submissions', 'Individual physical visits to 8 municipal desks'],
        activeSteps: [
          { title: 'Physical Blueprint Submission to Building Proposal Dept', authority: 'BMC Building Proposal (BP) Cell', mode: 'Physical Queue', sla: '30 Days' },
          { title: 'Physical Tree Authority & Environmental Scrutiny', authority: 'Municipal Gardens & Tree Dept', mode: 'Physical Queue', sla: '21 Days' },
          { title: 'Chief Fire Officer (CFO) Blueprint Signoff', authority: 'Mumbai Fire Department', mode: 'Physical Queue', sla: '25 Days' }
        ]
      },
      {
        year: 2024,
        label: '2024 (AutoDCR Single Window)',
        eraTitle: 'Algorithmic CAD Scrutiny & Single Window Portal',
        gazetteRef: 'Urban Development Notification UD-33/2023',
        gazetteDate: '20 February 2024',
        statutoryAct: 'Unified Development Control and Promotion Regulations (UDCPR 2020)',
        slaDays: 30,
        physicalVisits: 1,
        statutoryCost: 'Rs 18,500 Online Scrutiny Fee',
        paperCopiesRequired: 0,
        systemMode: 'Hybrid Transition',
        description: 'Building CAD files are uploaded to the AutoDCR engine, which automatically checks FSI, setbacks, light & ventilation rules through code.',
        eliminatedBottlenecks: ['Eliminated manual CAD measuring errors', 'Single-window NOC routing'],
        activeSteps: [
          { title: 'AutoDCR CAD File Automated Rule Engine Verification', authority: 'State Urban Single Window', mode: 'Online Portal', sla: '7 Days' },
          { title: 'Unified Online Municipal Clearance & Fire NOC', authority: 'Municipal Fire & Engineering Cell', mode: 'Online Portal', sla: '14 Days' }
        ]
      },
      {
        year: 2026,
        label: '2026 (Instant GIS & AutoDCR 3.0)',
        eraTitle: 'Geotagged Drone Survey & Automated Intimation of Disapproval (IOD)',
        gazetteRef: 'National Building Automation Code 2025/Vol-12',
        gazetteDate: '15 January 2026',
        statutoryAct: 'National Building Code & Smart Urban Infrastructure Directive',
        slaDays: 7,
        physicalVisits: 0,
        statutoryCost: 'Rs 15,000 Standard Statutory Fee',
        paperCopiesRequired: 0,
        systemMode: 'Digital Public Infrastructure (DPI)',
        description: '100% digital sanction. Land coordinates checked via satellite GIS database, building clearance calculated algorithmically, and IOD generated in 7 days.',
        eliminatedBottlenecks: ['Zero in-person municipal visits', 'Automated satellite GIS plot boundary verification'],
        activeSteps: [
          { title: 'BIM / 3D CAD Algorithmic Verification Engine', authority: 'Municipal Smart Engineering Core', mode: 'Instant API', sla: '24 Hours' },
          { title: 'Instant Digitally Signed Intimation of Disapproval (IOD)', authority: 'Municipal Corporation Portal', mode: 'Instant API', sla: '7 Days' }
        ]
      }
    ]
  },
  {
    id: 'rts-certificates',
    title: 'Income, Domicile & Caste Statutory Certificates',
    shortTitle: 'Income & Domicile RTS',
    jurisdiction: 'Maharashtra (Tehsildar / Revenue Department)',
    category: 'Citizen Identity & Welfare',
    summary: 'Transformation of revenue certifications from physical Tehsil court affidavits into instant DigiLocker verified citizen certificates.',
    milestones: [
      {
        year: 2020,
        label: '2020 (Tehsil Queue)',
        eraTitle: 'Physical Affidavits & Executive Magistrate Seals',
        gazetteRef: 'Maharashtra Land Revenue Manual 1966',
        gazetteDate: '10 January 2020',
        statutoryAct: 'Maharashtra Land Revenue Code 1966',
        slaDays: 30,
        physicalVisits: 5,
        statutoryCost: 'Rs 150 Govt Fee + Rs 1,500 Notary & Agent',
        paperCopiesRequired: 14,
        systemMode: 'Manual & Bureaucratic',
        description: 'Citizens stood in long lines outside Tehsil offices to get notary affidavits, physical ration card copies, and school leaving certificates attested.',
        eliminatedBottlenecks: ['Court notary stamps on judicial paper', 'Multiple visits to Tehsildar inward counter'],
        activeSteps: [
          { title: 'Physical Affidavit Drafting & Notarization at Court', authority: 'Executive Magistrate Office', mode: 'Physical Queue', sla: '7 Days' },
          { title: 'Physical Document Inward at Talathi Office', authority: 'Revenue Talathi & Circle Officer', mode: 'Physical Queue', sla: '14 Days' },
          { title: 'Physical In-Person Verification by Naib Tehsildar', authority: 'Tehsil Office', mode: 'Physical Queue', sla: '14 Days' }
        ]
      },
      {
        year: 2024,
        label: '2024 (Aaple Sarkar Seva)',
        eraTitle: 'Online e-District Filing with Barcode Verification',
        gazetteRef: 'MahaOnline RTS Notification 2022/CR-104',
        gazetteDate: '01 June 2024',
        statutoryAct: 'Maharashtra Right to Public Services Act 2015',
        slaDays: 15,
        physicalVisits: 1,
        statutoryCost: 'Rs 58 Statutory Service Charge',
        paperCopiesRequired: 1,
        systemMode: 'Hybrid Transition',
        description: 'Applications filed online via Aaple Sarkar portal with scanned PDF uploads. Delivery with 2D barcode and digital signature of Tehsildar.',
        eliminatedBottlenecks: ['Eliminated physical affidavit notarization', 'Direct tracking of officer SLA on dashboard'],
        activeSteps: [
          { title: 'Aaple Sarkar Online e-KYC Application', authority: 'Revenue Department MahaOnline', mode: 'Online Portal', sla: '3 Days' },
          { title: 'Digital Scrutiny & Talathi Field Verification', authority: 'Circle Inspector Desk', mode: 'Online Portal', sla: '10 Days' }
        ]
      },
      {
        year: 2026,
        label: '2026 (Instant Entitlement DPI)',
        eraTitle: 'Auto-Verified Income via IT Return API & DigiLocker',
        gazetteRef: 'Digital Entitlements Directive 2025/Maha-01',
        gazetteDate: '05 January 2026',
        statutoryAct: 'Digital Public Infrastructure & Transparent Welfare Act',
        slaDays: 1,
        physicalVisits: 0,
        statutoryCost: 'Rs 30 Transparent Statutory Fee',
        paperCopiesRequired: 0,
        systemMode: 'Digital Public Infrastructure (DPI)',
        description: 'System automatically verifies income from Income Tax / GSTN API and land records from Mahabhumi. Domicile is verified via DigiLocker school records in under 24 hours.',
        eliminatedBottlenecks: ['Zero paper attachments', 'Instant verification via direct government database APIs'],
        activeSteps: [
          { title: 'DigiLocker 1-Click Educational & Ration Records Link', authority: 'API Setu / UIDAI', mode: 'Instant API', sla: 'Instant' },
          { title: 'Automated Tax & Land Holding Registry Check', authority: 'IT Dept & Land Records API', mode: 'Instant API', sla: 'Instant' },
          { title: 'Instant Digitally Signed Certificate Dispatch', authority: 'State DPI Engine', mode: 'Instant API', sla: 'Same Day' }
        ]
      }
    ]
  },
  {
    id: 'msme-udyam',
    title: 'MSME Udyam & Statutory Enterprise Registration',
    shortTitle: 'MSME & Udyam Setup',
    jurisdiction: 'National (Ministry of MSME & State Industries)',
    category: 'Commercial Industry & Enterprise',
    summary: 'Chronological progression of small business industrial registration from manual District Industries Centre (DIC) files to instant paperless Udyam.',
    milestones: [
      {
        year: 2020,
        label: '2020 (DIC Manual Files)',
        eraTitle: 'EM-II Physical Forms & District Industry Verification',
        gazetteRef: 'MSMED Act Gazette Notification 2006',
        gazetteDate: '01 January 2020',
        statutoryAct: 'Micro, Small and Medium Enterprises Development Act 2006',
        slaDays: 30,
        physicalVisits: 4,
        statutoryCost: 'Rs 2,500 Documentation & Stamp Expenses',
        paperCopiesRequired: 16,
        systemMode: 'Manual & Bureaucratic',
        description: 'Entrepreneurs submitted Entrepreneurs Memorandum (EM Part-II) with physical electricity bills, rent deeds, and plant machinery invoices to the District Industries Centre.',
        eliminatedBottlenecks: ['Physical submission of plant machinery invoices', 'Manual DIC inspector review queues'],
        activeSteps: [
          { title: 'Physical EM-II Dossier Submission at DIC', authority: 'District Industries Centre (DIC)', mode: 'Physical Queue', sla: '14 Days' },
          { title: 'Industrial Officer Factory & Power Connection Audit', authority: 'State Directorate of Industries', mode: 'Physical Queue', sla: '15 Days' }
        ]
      },
      {
        year: 2023,
        label: '2023 (Udyam Single Portal)',
        eraTitle: 'Paperless Self-Declaration on Udyam Portal',
        gazetteRef: 'Ministry of MSME S.O. 2119(E)',
        gazetteDate: '26 June 2023',
        statutoryAct: 'MSME Classification and Registration Regulations 2020',
        slaDays: 2,
        physicalVisits: 0,
        statutoryCost: 'Rs 0 (Completely Free Government Service)',
        paperCopiesRequired: 0,
        systemMode: 'Digital Public Infrastructure (DPI)',
        description: 'Udyam Registration integrates with Income Tax and GST systems. Zero paper uploads required, purely based on Aadhaar and PAN verification.',
        eliminatedBottlenecks: ['Zero paper document uploads', 'Zero registration fees'],
        activeSteps: [
          { title: 'Aadhaar OTP & PAN Verification on Udyam Portal', authority: 'Ministry of MSME Portal', mode: 'Instant API', sla: 'Instant' },
          { title: 'Automated CBDT / GSTN Investment Turnover Sync', authority: 'Income Tax & GSTN API', mode: 'Instant API', sla: '24 Hours' }
        ]
      },
      {
        year: 2026,
        label: '2026 (Instant DPI Enterprise Stack)',
        eraTitle: '1-Click Bank Account, Mudra Credit & Export Code Linkage',
        gazetteRef: 'National MSME DPI Directive 2025/Ent-08',
        gazetteDate: '12 January 2026',
        statutoryAct: 'National Single Window & Integrated Commerce Act',
        slaDays: 1,
        physicalVisits: 0,
        statutoryCost: 'Rs 0 (100% Free Statutory DPI Service)',
        paperCopiesRequired: 0,
        systemMode: 'Digital Public Infrastructure (DPI)',
        description: 'Udyam registration automatically provisions a commercial current account, syncs Mudra credit eligibility, and generates an Import Export Code (IEC) in minutes.',
        eliminatedBottlenecks: ['Zero friction bank account opening', 'Automated credit rating integration'],
        activeSteps: [
          { title: 'DigiLocker 1-Tap Enterprise Creation', authority: 'National MSME DPI Engine', mode: 'Instant API', sla: 'Instant (2 mins)' },
          { title: 'Instant QR Udyam Certificate & Current Account Sync', authority: 'RBI Account Aggregator & MSME', mode: 'Instant API', sla: 'Instant (5 mins)' }
        ]
      }
    ]
  }
];

export const EvolutionTimelineView: React.FC = () => {
  const navigate = useNavigate();
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('food-bakery');
  const [milestoneIndex, setMilestoneIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const playTimerRef = useRef<any>(null);

  const activeScenario = EVOLUTION_SCENARIOS.find((s) => s.id === selectedScenarioId) || EVOLUTION_SCENARIOS[0];
  const activeMilestone = activeScenario.milestones[milestoneIndex] || activeScenario.milestones[0];

  useEffect(() => {
    if (isPlaying) {
      playTimerRef.current = setInterval(() => {
        setMilestoneIndex((prev) => {
          if (prev >= activeScenario.milestones.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 3500);
    } else {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    }

    return () => {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    };
  }, [isPlaying, activeScenario]);

  const handlePlayToggle = () => {
    if (milestoneIndex >= activeScenario.milestones.length - 1) {
      setMilestoneIndex(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const oldestMilestone = activeScenario.milestones[0];
  const newestMilestone = activeScenario.milestones[activeScenario.milestones.length - 1];
  const slaReductionPercent = Math.round(((oldestMilestone.slaDays - newestMilestone.slaDays) / oldestMilestone.slaDays) * 100);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner inside Dashboard */}
      <div className="bg-gradient-to-r from-[#1B4D3E] via-[#153D31] to-[#0E271F] text-white p-6 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-emerald-300 text-[10px] font-bold border border-white/20">
            <History className="w-3 h-3" />
            <span>Government Journey Replay</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Civic Procedure Statutory Evolution
          </h2>
          <p className="text-xs text-emerald-100/90 max-w-2xl font-normal leading-relaxed">
            Replay how government procedures transformed across 2020 to 2026 from manual paper dossiers into instant Digital Public Infrastructure.
          </p>
        </div>

        <button
          type="button"
          onClick={handlePlayToggle}
          className="px-5 py-2.5 rounded-2xl bg-white text-[#1B4D3E] hover:bg-emerald-50 text-xs font-black shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95 shrink-0"
        >
          {isPlaying ? (
            <>
              <Pause className="w-3.5 h-3.5 fill-[#1B4D3E]" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-[#1B4D3E]" />
              <span>{milestoneIndex >= activeScenario.milestones.length - 1 ? 'Replay 2020' : 'Play Timeline'}</span>
            </>
          )}
        </button>
      </div>

      {/* 6 Scenario Tabs with Clean Text & Icons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {EVOLUTION_SCENARIOS.map((scenario) => {
          const isSelected = scenario.id === activeScenario.id;
          return (
            <button
              key={scenario.id}
              type="button"
              onClick={() => {
                setSelectedScenarioId(scenario.id);
                setMilestoneIndex(0);
                setIsPlaying(false);
              }}
              className={`p-3 rounded-2xl font-bold text-xs transition-all text-left flex flex-col justify-between cursor-pointer border ${
                isSelected
                  ? 'bg-[#1B4D3E] text-white border-[#1B4D3E] shadow-sm'
                  : 'bg-white dark:bg-[#0D1A16] text-[#4A5D54] dark:text-[#9FB7AC] border-[#DCE8E1] dark:border-[#1E3B32] hover:border-[#1B4D3E]'
              }`}
            >
              <span className="text-[10px] uppercase font-bold opacity-75 block mb-1">
                {scenario.category.split(' ')[0]}
              </span>
              <span className="font-extrabold text-xs leading-snug">
                {scenario.shortTitle}
              </span>
            </button>
          );
        })}
      </div>

      {/* Stepper Card */}
      <div className="bg-white dark:bg-[#0D1A16] p-6 rounded-3xl border border-[#DCE8E1] dark:border-[#1E3B32] shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#1B4D3E] dark:text-[#6EE7B7]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#11261F] dark:text-white">
              {activeScenario.title} ({activeMilestone.year})
            </span>
          </div>
          <div className="text-xs font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <TrendingDown className="w-4 h-4" />
            <span>{slaReductionPercent}% SLA Reduction</span>
          </div>
        </div>

        {/* Progression Dots */}
        <div className="relative">
          <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 h-1.5 bg-[#EDF2EE] dark:bg-[#1E3B32] rounded-full z-0" />
          <div
            className="absolute top-1/2 -translate-y-1/2 left-4 h-1.5 bg-[#1B4D3E] dark:bg-[#6EE7B7] rounded-full transition-all duration-300 z-0"
            style={{
              width: `${(milestoneIndex / (activeScenario.milestones.length - 1)) * 100}%`
            }}
          />

          <div className="relative z-10 flex items-center justify-between">
            {activeScenario.milestones.map((m, idx) => {
              const isActive = idx === milestoneIndex;
              const isPassed = idx < milestoneIndex;
              return (
                <button
                  key={m.year}
                  type="button"
                  onClick={() => {
                    setMilestoneIndex(idx);
                    setIsPlaying(false);
                  }}
                  className="flex flex-col items-center gap-1.5 cursor-pointer"
                >
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-xs transition-all shadow-md ${
                    isActive
                      ? 'bg-[#1B4D3E] dark:bg-[#6EE7B7] text-white dark:text-[#08120F] scale-125 ring-4 ring-[#1B4D3E]/20'
                      : isPassed
                      ? 'bg-[#1B4D3E] text-white'
                      : 'bg-white dark:bg-[#142B23] text-slate-500 border border-[#DCE8E1] dark:border-[#1E3B32]'
                  }`}>
                    {m.year}
                  </div>
                  <span className={`text-[10px] font-black uppercase ${isActive ? 'text-[#1B4D3E] dark:text-[#6EE7B7]' : 'text-slate-400'}`}>
                    {m.year}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Milestone Details & Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Narrative */}
        <div className="lg:col-span-7 bg-white dark:bg-[#0D1A16] rounded-3xl border border-[#DCE8E1] dark:border-[#1E3B32] p-5 sm:p-6 shadow-sm space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#EDF2EE] dark:border-[#1E3B32]">
            <div>
              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                activeMilestone.systemMode === 'Digital Public Infrastructure (DPI)'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
              }`}>
                {activeMilestone.systemMode}
              </span>
              <h3 className="text-lg font-black text-[#11261F] dark:text-white mt-1">
                {activeMilestone.eraTitle}
              </h3>
            </div>
            <span className="text-2xl font-black text-[#1B4D3E] dark:text-[#6EE7B7]">
              {activeMilestone.year}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F8FAF9] dark:bg-[#08120F] border border-[#DCE8E1] dark:border-[#1E3B32] space-y-1">
            <span className="text-[10px] font-bold text-[#1B4D3E] dark:text-[#6EE7B7] uppercase block">
              Statutory Gazette Reference:
            </span>
            <p className="font-bold text-[#11261F] dark:text-white">{activeMilestone.statutoryAct}</p>
            <p className="text-[11px] text-slate-500">{activeMilestone.gazetteRef} &bull; {activeMilestone.gazetteDate}</p>
          </div>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            {activeMilestone.description}
          </p>

          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200 block">
              Eliminated Friction Points:
            </span>
            {activeMilestone.eliminatedBottlenecks.map((b, i) => (
              <div key={i} className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{b}</span>
              </div>
            ))}
          </div>

          {/* Procedural Steps in this Era */}
          <div className="space-y-2 pt-2">
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200 block">
              Procedural Execution in {activeMilestone.year}:
            </span>
            <div className="space-y-1.5">
              {activeMilestone.activeSteps.map((step, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-[#F8FAF9] dark:bg-[#12241E] border border-[#DCE8E1] dark:border-[#1E3B32] flex items-center justify-between gap-2">
                  <div>
                    <div className="font-bold text-[#11261F] dark:text-white">{step.title}</div>
                    <div className="text-[10px] text-slate-500">{step.authority}</div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-white dark:bg-black/30 border border-slate-200 dark:border-slate-700">
                      {step.mode}
                    </span>
                    <span className="font-bold text-[#1B4D3E] dark:text-[#6EE7B7] text-[10px]">
                      {step.sla}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="lg:col-span-5 bg-white dark:bg-[#0D1A16] rounded-3xl border border-[#DCE8E1] dark:border-[#1E3B32] p-5 shadow-sm space-y-3.5 text-xs">
          <h4 className="text-xs font-black uppercase text-[#11261F] dark:text-white flex items-center gap-1.5">
            <FileCheck2 className="w-4 h-4 text-[#1B4D3E] dark:text-[#6EE7B7]" />
            <span>Metrics in {activeMilestone.year}</span>
          </h4>

          <div className="p-3 rounded-2xl bg-[#F8FAF9] dark:bg-[#08120F] border border-[#DCE8E1] dark:border-[#1E3B32] space-y-1">
            <div className="flex justify-between font-bold">
              <span className="text-slate-500">Processing SLA</span>
              <span className="text-[#11261F] dark:text-white font-black">{activeMilestone.slaDays} Days</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-600"
                style={{ width: `${Math.max(10, (1 - activeMilestone.slaDays / 90) * 100)}%` }}
              />
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#F8FAF9] dark:bg-[#08120F] border border-[#DCE8E1] dark:border-[#1E3B32] flex justify-between font-bold">
            <span className="text-slate-500">Physical Office Visits</span>
            <span className="text-[#11261F] dark:text-white font-black">{activeMilestone.physicalVisits} Visits</span>
          </div>

          <div className="p-3 rounded-2xl bg-[#F8FAF9] dark:bg-[#08120F] border border-[#DCE8E1] dark:border-[#1E3B32] space-y-0.5">
            <span className="text-slate-500 block">Statutory Cost</span>
            <span className="text-[#1B4D3E] dark:text-[#6EE7B7] font-black">{activeMilestone.statutoryCost}</span>
          </div>

          <div className="p-3 rounded-2xl bg-[#F8FAF9] dark:bg-[#08120F] border border-[#DCE8E1] dark:border-[#1E3B32] flex justify-between font-bold">
            <span className="text-slate-500">Paper Copies</span>
            <span className="text-[#11261F] dark:text-white font-black">{activeMilestone.paperCopiesRequired} Sheets</span>
          </div>

          <button
            type="button"
            onClick={() => navigate('/create', { state: { initialQuery: `I want to apply for ${activeScenario.title}` } })}
            className="w-full py-2.5 rounded-xl bg-[#1B4D3E] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm mt-2 cursor-pointer"
          >
            <span>Start 2026 Roadmap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
