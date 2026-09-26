import { CivicVerificationStatus, SourceEvidence, CivicDocument } from '../../types.js';

export interface BaseCivicProcedure {
  id: string;
  code: string;
  title: string;
  plainLanguageSummary: string; // What this means
  whyRequired: string; // Why you need it
  authority: string;
  category: string;
  jurisdiction: {
    country: string;
    state?: string;
    city?: string;
  };
  domain: string;
  dependsOn: string[]; // ids of base procedures that must complete first
  canRunInParallelWith?: string[]; // ids of base procedures that can happen at the same time
  documents: CivicDocument[];
  fee: {
    amount: string;
    description: string;
  };
  estimatedTime: string;
  applicationMode: 'Online' | 'Offline' | 'Hybrid';
  applicationUrl: string;
  source: SourceEvidence;
  verificationStatus: CivicVerificationStatus;
}

export const procedureKnowledgeBase: BaseCivicProcedure[] = [
  // ==========================================
  // 1. FOOD BUSINESS & BAKERY SCENARIO (PRIMARY DEMO)
  // ==========================================
  {
    id: 'proc-pan-entity',
    code: 'PAN_ENTITY',
    title: 'Entity Constitution & Commercial PAN Allocation',
    plainLanguageSummary: 'Establish your legal business identity (Sole Proprietorship, Partnership, or Pvt Ltd) and acquire a dedicated tax identification number.',
    whyRequired: 'You need this first because commercial bank accounts, lease agreements, and government portals require a valid PAN to issue any subsequent business licenses.',
    authority: 'Income Tax Department (CBDT) & Ministry of Corporate Affairs (MCA)',
    category: 'Legal Identity',
    jurisdiction: { country: 'India' },
    domain: 'FOOD_BUSINESS',
    dependsOn: [],
    canRunInParallelWith: [],
    documents: [
      { id: 'doc-pan-1', name: 'Aadhaar Card of Applicant / Partners', isMandatory: true, description: 'Identity and biometric authentication proof' },
      { id: 'doc-pan-2', name: 'Individual PAN Card', isMandatory: true, description: 'Personal PAN of proprietor or directors' },
      { id: 'doc-pan-3', name: 'Premises Address Proof', isMandatory: true, description: 'Electricity bill or property tax receipt of operating address' }
    ],
    fee: { amount: '₹110', description: 'NSDL / UTIITSL statutory processing fee' },
    estimatedTime: '2 - 3 business days',
    applicationMode: 'Online',
    applicationUrl: 'https://www.onlineservices.nsdl.com',
    source: {
      id: 'src-pan',
      title: 'Income Tax Department - PAN Allocation Services',
      url: 'https://www.incometax.gov.in',
      department: 'Central Board of Direct Taxes, Ministry of Finance',
      domain: 'incometax.gov.in',
      lastChecked: '2026-09-24',
      verificationStatus: 'Verified'
    },
    verificationStatus: 'VERIFIED'
  },
  {
    id: 'proc-udyam-msme',
    code: 'UDYAM_MSME',
    title: 'MSME Udyam Enterprise Registration',
    plainLanguageSummary: 'Register your bakery as a Micro enterprise on the official central government portal with zero fee.',
    whyRequired: 'Statutory national proof of being an MSME; required to access priority sector bank credit, interest subsidies, and single-window state portal permissions.',
    authority: 'Ministry of Micro, Small and Medium Enterprises (MSME)',
    category: 'National Recognition',
    jurisdiction: { country: 'India' },
    domain: 'FOOD_BUSINESS',
    dependsOn: ['proc-pan-entity'],
    canRunInParallelWith: [],
    documents: [
      { id: 'doc-udyam-1', name: 'Aadhaar of Business Owner / Authorized Signatory', isMandatory: true, description: 'Biometric OTP e-KYC linked' },
      { id: 'doc-udyam-2', name: 'Commercial PAN & Bank Account Details', isMandatory: true, description: 'Account number and IFSC code' }
    ],
    fee: { amount: '₹0 (Free of cost)', description: 'Government statutory filing fee is strictly nil' },
    estimatedTime: '1 - 2 business days',
    applicationMode: 'Online',
    applicationUrl: 'https://udyamregistration.gov.in',
    source: {
      id: 'src-udyam',
      title: 'Udyam Registration Portal - Ministry of MSME',
      url: 'https://udyamregistration.gov.in',
      department: 'Ministry of MSME, Government of India',
      domain: 'udyamregistration.gov.in',
      lastChecked: '2026-09-25',
      verificationStatus: 'Verified'
    },
    verificationStatus: 'VERIFIED'
  },
  {
    id: 'proc-gumasta-shop',
    code: 'GUMASTA_SHOP',
    title: 'Shop & Commercial Establishment Registration (Gumasta)',
    plainLanguageSummary: 'Register your physical kitchen or bakery location with the state labour department and local municipal corporation.',
    whyRequired: 'Mandatory under Maharashtra Shops and Establishments Act, 2017 to lawfully open commercial doors, hire bakers/helpers, and operate in a municipal ward.',
    authority: 'Brihanmumbai Municipal Corporation (BMC) / Maharashtra State Labour Commissionerate',
    category: 'Municipal Permitting',
    jurisdiction: { country: 'India', state: 'Maharashtra', city: 'Mumbai' },
    domain: 'FOOD_BUSINESS',
    dependsOn: ['proc-pan-entity', 'proc-udyam-msme'],
    canRunInParallelWith: [],
    documents: [
      { id: 'doc-gumasta-1', name: 'Udyam Registration Certificate', isMandatory: true, description: 'Central enterprise identification proof' },
      { id: 'doc-gumasta-2', name: 'Registered Rent Agreement or Property Tax Receipt', isMandatory: true, description: 'Proof of commercial occupancy' },
      { id: 'doc-gumasta-3', name: 'Commercial Electricity Bill of Premises', isMandatory: true, description: 'Must clearly show commercial meter category' },
      { id: 'doc-gumasta-4', name: 'Photo of Shop Entrance with Bilingual Signboard', isMandatory: true, description: 'Must display name in Marathi and English' }
    ],
    fee: { amount: '₹500 - ₹1,500', description: 'Tiered by employee headcount under Maharashtra State Rules' },
    estimatedTime: '3 - 7 working days',
    applicationMode: 'Online',
    applicationUrl: 'https://services.india.gov.in',
    source: {
      id: 'src-gumasta',
      title: 'Aaple Sarkar Citizen Services Portal - Maharashtra',
      url: 'https://services.india.gov.in',
      department: 'Labour Department, Government of Maharashtra',
      domain: 'gov.in',
      lastChecked: '2026-09-25',
      verificationStatus: 'Verified'
    },
    verificationStatus: 'VERIFIED'
  },
  {
    id: 'proc-fssai-food',
    code: 'FSSAI_FOOD',
    title: 'FSSAI Food Safety Registration / State License',
    plainLanguageSummary: 'Obtain your 14-digit food safety registration number from the national food safety regulator.',
    whyRequired: 'Section 31 of Food Safety and Standards Act 2006 makes it a criminal violation to manufacture, bake, or sell food without valid FSSAI registration.',
    authority: 'Food Safety and Standards Authority of India (FSSAI)',
    category: 'Food Safety Compliance',
    jurisdiction: { country: 'India' },
    domain: 'FOOD_BUSINESS',
    dependsOn: ['proc-pan-entity', 'proc-gumasta-shop'],
    canRunInParallelWith: ['proc-gst-registration'], // CAN RUN IN PARALLEL WITH GST!
    documents: [
      { id: 'doc-fssai-1', name: 'Passport Photograph & Photo ID of Food Business Operator', isMandatory: true, description: 'Owner or authorized manager photo' },
      { id: 'doc-fssai-2', name: 'Premises Ownership / Lease Agreement Proof', isMandatory: true, description: 'Lawful right to prepare food on site' },
      { id: 'doc-fssai-3', name: 'List of Confectionery / Baked Food Items', isMandatory: true, description: 'Bread, cakes, pastries, dry snacks catalogue' },
      { id: 'doc-fssai-4', name: 'Water Quality Potability Testing Report from NABL Lab', isMandatory: true, description: 'Confirms drinking water purity used in dough and food preparation' }
    ],
    fee: { amount: '₹100 / year (Basic) or ₹2,000 / year (State)', description: 'Turnover below ₹12L pays ₹100/yr; above ₹12L pays ₹2,000/yr' },
    estimatedTime: '7 - 14 working days',
    applicationMode: 'Online',
    applicationUrl: 'https://foscos.fssai.gov.in',
    source: {
      id: 'src-fssai',
      title: 'Food Safety Compliance System (FoSCoS) Portal',
      url: 'https://foscos.fssai.gov.in',
      department: 'Food Safety and Standards Authority of India',
      domain: 'fssai.gov.in',
      lastChecked: '2026-09-24',
      verificationStatus: 'Verified'
    },
    verificationStatus: 'VERIFIED'
  },
  {
    id: 'proc-gst-registration',
    code: 'GST_REGISTRATION',
    title: 'Goods & Services Tax Registration (GSTIN)',
    plainLanguageSummary: 'Register for a 15-digit GST number to collect tax, issue official GST tax invoices, and list on food delivery platforms.',
    whyRequired: 'Mandatory under CGST Act 2017 for interstate purchases, commercial supplies, and onboarding on Zomato/Swiggy or e-commerce delivery channels.',
    authority: 'Goods and Services Tax Network (GSTN) & CBIC',
    category: 'Indirect Taxation',
    jurisdiction: { country: 'India' },
    domain: 'FOOD_BUSINESS',
    dependsOn: ['proc-pan-entity', 'proc-gumasta-shop'],
    canRunInParallelWith: ['proc-fssai-food'], // CAN RUN IN PARALLEL WITH FSSAI!
    documents: [
      { id: 'doc-gst-1', name: 'Entity PAN & Proof of Business Constitution', isMandatory: true, description: 'Partnership deed, certificate of incorporation, or proprietorship declaration' },
      { id: 'doc-gst-2', name: 'Principal Place of Business Ownership / Lease Proof', isMandatory: true, description: 'Registered lease with rent agreement & utility bill' },
      { id: 'doc-gst-3', name: 'Bank Account Cancelled Cheque / Statement', isMandatory: true, description: 'Must display business IFSC and account number' },
      { id: 'doc-gst-4', name: 'Aadhaar Biometric e-KYC of Signatory', isMandatory: true, description: 'Central circular mandatory authentication' }
    ],
    fee: { amount: '₹0 (No official fee)', description: 'Government statutory registration fee is strictly nil' },
    estimatedTime: '3 - 7 working days',
    applicationMode: 'Online',
    applicationUrl: 'https://www.gst.gov.in',
    source: {
      id: 'src-gst',
      title: 'Official GST National Portal',
      url: 'https://www.gst.gov.in',
      department: 'GST Council & Central Board of Indirect Taxes and Customs',
      domain: 'gst.gov.in',
      lastChecked: '2026-09-25',
      verificationStatus: 'Verified'
    },
    verificationStatus: 'VERIFIED'
  },
  {
    id: 'proc-bmc-health-license',
    code: 'BMC_HEALTH_LICENSE',
    title: 'Municipal Health Trade License (Section 394 Sanction)',
    plainLanguageSummary: 'Undergo municipal sanitary inspection and obtain the official municipal health trade license for your premises.',
    whyRequired: 'Section 394 of Mumbai Municipal Corporation Act prohibits running eating houses, bakeries, or sweetmeat shops without Medical Officer of Health (MOH) sanitary approval.',
    authority: 'Municipal Corporation of Greater Mumbai (BMC) - Public Health Department',
    category: 'Municipal Health & Sanitation',
    jurisdiction: { country: 'India', state: 'Maharashtra', city: 'Mumbai' },
    domain: 'FOOD_BUSINESS',
    dependsOn: ['proc-gumasta-shop', 'proc-fssai-food'],
    canRunInParallelWith: [],
    documents: [
      { id: 'doc-bmc-1', name: 'Active FSSAI License / Application Acknowledgment', isMandatory: true, description: 'Food hygiene reference' },
      { id: 'doc-bmc-2', name: 'Shop & Establishment (Gumasta) Certificate', isMandatory: true, description: 'Commercial permit reference' },
      { id: 'doc-bmc-3', name: 'Key Plan & Site Layout Diagram (showing oven/exhaust placement)', isMandatory: true, description: 'Architectural ventilation sketch' },
      { id: 'doc-bmc-4', name: 'Medical Fitness Certificates for Food Preparation Staff', isMandatory: true, description: 'Freedom from communicable diseases' }
    ],
    fee: { amount: '₹2,500 - ₹5,000', description: 'Schedule fee based on bakery horsepower/flour consumption category' },
    estimatedTime: '14 - 21 working days',
    applicationMode: 'Online',
    applicationUrl: 'https://portal.mcgm.gov.in',
    source: {
      id: 'src-bmc-health',
      title: 'BMC Citizens Portal - Health Trade Department',
      url: 'https://portal.mcgm.gov.in',
      department: 'Public Health Department, Brihanmumbai Municipal Corporation',
      domain: 'mcgm.gov.in',
      lastChecked: '2026-09-25',
      verificationStatus: 'Verified'
    },
    verificationStatus: 'VERIFIED'
  },

  // ==========================================
  // 2. VEHICLE REGISTRATION SCENARIO (TEST 2)
  // ==========================================
  {
    id: 'proc-rto-form20',
    code: 'RTO_FORM20',
    title: 'Dealer Form 20 Application & Sales Certificate Scrutiny',
    plainLanguageSummary: 'Submit the formal application for new motor vehicle registration along with dealer sale invoice (Form 21) and roadworthiness certificate (Form 22).',
    whyRequired: 'Section 39 of Motor Vehicles Act 1988 prohibits driving any unregistered motor vehicle on public roads.',
    authority: 'Regional Transport Office (RTO) / State Transport Department',
    category: 'Transport Licensing',
    jurisdiction: { country: 'India', state: 'Maharashtra', city: 'Mumbai' },
    domain: 'TRANSPORT',
    dependsOn: [],
    canRunInParallelWith: [],
    documents: [
      { id: 'doc-rto-1', name: 'Form 21 (Sales Certificate from Dealer)', isMandatory: true, description: 'Proof of manufacturer and sale' },
      { id: 'doc-rto-2', name: 'Form 22 (Roadworthiness Certificate from Manufacturer)', isMandatory: true, description: 'Emission and technical compliance' },
      { id: 'doc-rto-3', name: 'Valid Motor Insurance Certificate', isMandatory: true, description: 'Minimum 5-year third-party cover' },
      { id: 'doc-rto-4', name: 'Aadhaar / Voter ID Address Proof of Buyer', isMandatory: true, description: 'Jurisdictional residential proof' }
    ],
    fee: { amount: '₹300 (Two-wheeler) / ₹600 (Car)', description: 'Statutory Central Motor Vehicle Rules registration fee' },
    estimatedTime: '1 - 2 business days',
    applicationMode: 'Online',
    applicationUrl: 'https://parivahan.gov.in',
    source: {
      id: 'src-parivahan',
      title: 'Parivahan Sewa - Ministry of Road Transport and Highways',
      url: 'https://parivahan.gov.in',
      department: 'Ministry of Road Transport and Highways, Govt of India',
      domain: 'parivahan.gov.in',
      lastChecked: '2026-09-22',
      verificationStatus: 'Verified'
    },
    verificationStatus: 'VERIFIED'
  },
  {
    id: 'proc-rto-tax',
    code: 'RTO_ROAD_TAX',
    title: 'One-Time Motor Vehicle Road Tax Payment',
    plainLanguageSummary: 'Pay the statutory state road tax based on invoice cost and vehicle fuel/engine displacement class.',
    whyRequired: 'State Motor Vehicle Taxation Act mandates payment of one-time lifetime tax before vehicle registration mark is assigned.',
    authority: 'State Transport Department / Motor Vehicle Treasury',
    category: 'Transport Taxation',
    jurisdiction: { country: 'India', state: 'Maharashtra', city: 'Mumbai' },
    domain: 'TRANSPORT',
    dependsOn: ['proc-rto-form20'],
    canRunInParallelWith: [],
    documents: [
      { id: 'doc-rto-tax-1', name: 'Vehicle Ex-Showroom Invoice', isMandatory: true, description: 'Tax computation base' },
      { id: 'doc-rto-tax-2', name: 'Online Vahan Payment Challan', isMandatory: true, description: 'Treasury receipt' }
    ],
    fee: { amount: '10% - 12% of Vehicle Cost (Petrol) / 7% (EV)', description: 'State motor vehicle lifetime road tax' },
    estimatedTime: 'Instant online challan',
    applicationMode: 'Online',
    applicationUrl: 'https://parivahan.gov.in',
    source: {
      id: 'src-parivahan-tax',
      title: 'Vahan Citizen Portal - Road Tax Schedule',
      url: 'https://parivahan.gov.in',
      department: 'Transport Commissionerate',
      domain: 'parivahan.gov.in',
      lastChecked: '2026-09-22',
      verificationStatus: 'Verified'
    },
    verificationStatus: 'VERIFIED'
  },
  {
    id: 'proc-rto-hsrp',
    code: 'RTO_HSRP',
    title: 'High Security Registration Plate (HSRP) & Inspection',
    plainLanguageSummary: 'Affix laser-etched tamper-proof number plates with chromium hologram and snap locks at authorized centre.',
    whyRequired: 'Central Motor Vehicles Rule 50 mandates HSRP fitment before final Registration Certificate (RC) card is dispatched.',
    authority: 'Regional Transport Office & Certified HSRP Manufacturers',
    category: 'Vehicle Fitment',
    jurisdiction: { country: 'India' },
    domain: 'TRANSPORT',
    dependsOn: ['proc-rto-tax'],
    canRunInParallelWith: [],
    documents: [
      { id: 'doc-hsrp-1', name: 'RTO Tax Receipt & Allocation Order', isMandatory: true, description: 'Assigned registration series' }
    ],
    fee: { amount: '₹400 (Two-wheeler) / ₹800 (Four-wheeler)', description: 'Standard statutory fitment tariff' },
    estimatedTime: '2 - 4 business days',
    applicationMode: 'Hybrid',
    applicationUrl: 'https://parivahan.gov.in',
    source: {
      id: 'src-hsrp',
      title: 'Ministry of Road Transport and Highways HSRP Circular',
      url: 'https://parivahan.gov.in',
      department: 'MoRTH, Government of India',
      domain: 'parivahan.gov.in',
      lastChecked: '2026-09-22',
      verificationStatus: 'Verified'
    },
    verificationStatus: 'VERIFIED'
  },
  {
    id: 'proc-rto-rc',
    code: 'RTO_RC_ISSUE',
    title: 'Smart Card Registration Certificate (RC) Issuance & DigiLocker Sync',
    plainLanguageSummary: 'Receive official chip-based Registration Certificate and sync verified digital RC in DigiLocker/mParivahan.',
    whyRequired: 'Final legal ownership deed of motor vehicle; legally required to show to traffic authorities upon demand.',
    authority: 'Regional Transport Office (RTO)',
    category: 'Ownership Deed',
    jurisdiction: { country: 'India' },
    domain: 'TRANSPORT',
    dependsOn: ['proc-rto-hsrp'],
    canRunInParallelWith: [],
    documents: [
      { id: 'doc-rc-1', name: 'HSRP Fitment Certificate & OTP Acknowledgment', isMandatory: true, description: 'Confirmation of plate installation' }
    ],
    fee: { amount: '₹200 (Smart card fee + speed post)', description: 'Card embossing and postal dispatch tariff' },
    estimatedTime: '7 - 14 working days',
    applicationMode: 'Online',
    applicationUrl: 'https://digilocker.gov.in',
    source: {
      id: 'src-digilocker-rto',
      title: 'DigiLocker Transport Services Integration',
      url: 'https://digilocker.gov.in',
      department: 'Ministry of Electronics and Information Technology',
      domain: 'digilocker.gov.in',
      lastChecked: '2026-09-24',
      verificationStatus: 'Verified'
    },
    verificationStatus: 'VERIFIED'
  },

  // ==========================================
  // 3. PROPERTY CONSTRUCTION SCENARIO (TEST 3)
  // ==========================================
  {
    id: 'proc-build-title',
    code: 'BUILD_TITLE_SEARCH',
    title: 'Demarcation & Non-Encumbrance Title Search (30 Years)',
    plainLanguageSummary: 'Verify land registry records and acquire property card / 7/12 extract confirming clean freehold ownership.',
    whyRequired: 'Municipal Town Planning will reject building applications immediately if ownership is disputed, leased, or mortgaged without bank consent.',
    authority: 'Department of Registration & Stamps (IGR) / Land Records Office',
    category: 'Land Due Diligence',
    jurisdiction: { country: 'India', state: 'Maharashtra', city: 'Mumbai' },
    domain: 'URBAN_DEVELOPMENT',
    dependsOn: [],
    canRunInParallelWith: [],
    documents: [
      { id: 'doc-bld-1', name: '7/12 Extract / CTS Property Card', isMandatory: true, description: 'Must be issued within last 90 days' },
      { id: 'doc-bld-2', name: 'Survey Map & Land Demarcation Certificate', isMandatory: true, description: 'Land records measurement' }
    ],
    fee: { amount: '₹200 - ₹500', description: 'Online search fee' },
    estimatedTime: '3 - 7 days',
    applicationMode: 'Online',
    applicationUrl: 'https://igrmaharashtra.gov.in',
    source: {
      id: 'src-igr-title',
      title: 'Inspector General of Registration & Stamps - Maharashtra',
      url: 'https://igrmaharashtra.gov.in',
      department: 'Revenue Department',
      domain: 'gov.in',
      lastChecked: '2026-09-20',
      verificationStatus: 'Verified'
    },
    verificationStatus: 'VERIFIED'
  },
  {
    id: 'proc-build-plan',
    code: 'BUILD_PLAN_SANCTION',
    title: 'Architectural Building Plan Sanction (AutoDCR/IOD)',
    plainLanguageSummary: 'Submit building blueprint through licensed architect under Development Control and Promotion Regulations (DCPR).',
    whyRequired: 'Municipal Corporation Intimation of Disapproval (IOD) / building plan sanction ensures structure adheres to FSI limits, setbacks, and seismic codes.',
    authority: 'Municipal Corporation Building Proposal Department',
    category: 'Town Planning Approval',
    jurisdiction: { country: 'India', state: 'Maharashtra', city: 'Mumbai' },
    domain: 'URBAN_DEVELOPMENT',
    dependsOn: ['proc-build-title'],
    canRunInParallelWith: [],
    documents: [
      { id: 'doc-bld-3', name: 'Architectural Drawings signed by Registered Architect', isMandatory: true, description: 'Floor plans, elevations, sections' },
      { id: 'doc-bld-4', name: 'Structural Stability Certificate signed by Structural Engineer', isMandatory: true, description: 'Soil test and structural design' }
    ],
    fee: { amount: '₹15,000 - ₹40,000', description: 'Scrutiny fee and development charges based on built-up area' },
    estimatedTime: '30 - 45 working days',
    applicationMode: 'Online',
    applicationUrl: 'https://portal.mcgm.gov.in',
    source: {
      id: 'src-bmc-autodcr',
      title: 'BMC AutoDCR Online Building Approval System',
      url: 'https://portal.mcgm.gov.in',
      department: 'Building Proposal Department, BMC',
      domain: 'mcgm.gov.in',
      lastChecked: '2026-09-24',
      verificationStatus: 'Verified'
    },
    verificationStatus: 'VERIFIED'
  },
  {
    id: 'proc-build-cc',
    code: 'BUILD_COMMENCEMENT_CERT',
    title: 'Commencement Certificate (CC) Issuance',
    plainLanguageSummary: 'Obtain formal municipal permission to excavate ground and begin foundation casting on site.',
    whyRequired: 'Section 45 of MRTP Act 1966 makes construction without Commencement Certificate illegal, leading to demolition notice.',
    authority: 'Municipal Corporation Executive Engineer (Building Proposal)',
    category: 'Construction Clearance',
    jurisdiction: { country: 'India', state: 'Maharashtra', city: 'Mumbai' },
    domain: 'URBAN_DEVELOPMENT',
    dependsOn: ['proc-build-plan'],
    canRunInParallelWith: [],
    documents: [
      { id: 'doc-bld-5', name: 'Sanctioned IOD Order', isMandatory: true, description: 'Prior plan approval' },
      { id: 'doc-bld-6', name: 'Debris Management Plan & Solid Waste NOC', isMandatory: true, description: 'Environmental clearance' }
    ],
    fee: { amount: '₹5,000 - ₹10,000', description: 'Site inspection & security deposit' },
    estimatedTime: '15 - 20 working days',
    applicationMode: 'Online',
    applicationUrl: 'https://portal.mcgm.gov.in',
    source: {
      id: 'src-mrtp-act',
      title: 'Maharashtra Regional and Town Planning Act Guidelines',
      url: 'https://services.india.gov.in',
      department: 'Urban Development Department',
      domain: 'gov.in',
      lastChecked: '2026-09-24',
      verificationStatus: 'Verified'
    },
    verificationStatus: 'VERIFIED'
  },
  {
    id: 'proc-build-oc',
    code: 'BUILD_OCCUPANCY_CERT',
    title: 'Final Completion & Occupancy Certificate (OC)',
    plainLanguageSummary: 'Municipal inspection of finished building to verify adherence to sanctioned plans before anyone can legally reside or get utility meters.',
    whyRequired: 'Water and electricity authorities cannot lawfully connect permanent domestic meters without an Occupancy Certificate.',
    authority: 'Municipal Corporation Town Planning Directorate',
    category: 'Habitation Sanction',
    jurisdiction: { country: 'India', state: 'Maharashtra', city: 'Mumbai' },
    domain: 'URBAN_DEVELOPMENT',
    dependsOn: ['proc-build-cc'],
    canRunInParallelWith: [],
    documents: [
      { id: 'doc-bld-7', name: 'Architect Completion Certificate (Form D)', isMandatory: true, description: 'Affirms building matches sanctioned plan' },
      { id: 'doc-bld-8', name: 'Fire Safety NOC & Lift Safety Certificate', isMandatory: true, description: 'Emergency egress compliance' }
    ],
    fee: { amount: '₹3,000 - ₹8,000', description: 'Completion scrutiny charge' },
    estimatedTime: '21 - 30 working days',
    applicationMode: 'Online',
    applicationUrl: 'https://portal.mcgm.gov.in',
    source: {
      id: 'src-oc-guideline',
      title: 'Municipal Corporation Occupancy Regulations',
      url: 'https://portal.mcgm.gov.in',
      department: 'Executive Engineer (Building Proposal)',
      domain: 'mcgm.gov.in',
      lastChecked: '2026-09-24',
      verificationStatus: 'Verified'
    },
    verificationStatus: 'VERIFIED'
  },

  // ==========================================
  // 4. VITAL CERTIFICATES SCENARIO (BIRTH)
  // ==========================================
  {
    id: 'proc-cert-intimation',
    code: 'CERT_INTIMATION',
    title: 'Hospital Birth Intimation & Form 1 Verification',
    plainLanguageSummary: 'Verify medical delivery discharge slip and hospital registrar Form 1 entry within 21 days of birth.',
    whyRequired: 'Mandatory under Section 8 of Registration of Births and Deaths Act 1969 to prove institutional delivery occurrence.',
    authority: 'Public Health Department & Hospital Civil Registry',
    category: 'Civil Registration',
    jurisdiction: { country: 'India' },
    domain: 'VITAL_RECORDS',
    dependsOn: [],
    canRunInParallelWith: [],
    documents: [
      { id: 'doc-crt-1', name: 'Hospital Discharge Summary / Delivery Report', isMandatory: true, description: 'Medical proof of birth' },
      { id: 'doc-crt-2', name: 'Parents Aadhaar Card & Marriage Proof', isMandatory: true, description: 'Parentage verification' }
    ],
    fee: { amount: '₹0', description: 'Free of cost if notified within 21 statutory days' },
    estimatedTime: 'Instant (1-2 days)',
    applicationMode: 'Online',
    applicationUrl: 'https://crsorgi.gov.in',
    source: {
      id: 'src-crs',
      title: 'Civil Registration System (CRS) - Registrar General of India',
      url: 'https://crsorgi.gov.in',
      department: 'Ministry of Home Affairs, Government of India',
      domain: 'crsorgi.gov.in',
      lastChecked: '2026-09-24',
      verificationStatus: 'Verified'
    },
    verificationStatus: 'VERIFIED'
  },
  {
    id: 'proc-cert-municipal-entry',
    code: 'CERT_MUNICIPAL_ENTRY',
    title: 'Municipal Ward Health Office Registry Entry',
    plainLanguageSummary: 'Municipal registrar indexes the child in the local birth registers and generates the statutory civil registry number.',
    whyRequired: 'Allocates statutory registration number required to produce legal evidentiary certificate.',
    authority: 'Municipal Corporation (Ward Health Office)',
    category: 'Municipal Register',
    jurisdiction: { country: 'India', state: 'Maharashtra', city: 'Mumbai' },
    domain: 'VITAL_RECORDS',
    dependsOn: ['proc-cert-intimation'],
    canRunInParallelWith: [],
    documents: [
      { id: 'doc-crt-3', name: 'Hospital Birth Slip & Parents Photo ID', isMandatory: true, description: 'Form 1 match' }
    ],
    fee: { amount: '₹10 - ₹20', description: 'Search & registration fee' },
    estimatedTime: '3 - 5 working days',
    applicationMode: 'Online',
    applicationUrl: 'https://services.india.gov.in',
    source: {
      id: 'src-state-civil',
      title: 'State Civil Registration Portal',
      url: 'https://services.india.gov.in',
      department: 'Department of Local Self Government',
      domain: 'gov.in',
      lastChecked: '2026-09-25',
      verificationStatus: 'Verified'
    },
    verificationStatus: 'VERIFIED'
  },
  {
    id: 'proc-cert-digital-issue',
    code: 'CERT_DIGITAL_ISSUE',
    title: 'Digital Birth Certificate Issuance & DigiLocker Sync',
    plainLanguageSummary: 'Download digitally signed certificate with verifiable QR code and sync directly to national DigiLocker.',
    whyRequired: 'Primary legal proof of citizenship, date of birth, and identity required for passport, Aadhaar, and school admission.',
    authority: 'Registrar General of India / State Health Registry',
    category: 'Civil Certification',
    jurisdiction: { country: 'India' },
    domain: 'VITAL_RECORDS',
    dependsOn: ['proc-cert-municipal-entry'],
    canRunInParallelWith: [],
    documents: [
      { id: 'doc-crt-4', name: 'Registration Acknowledgment Number', isMandatory: true, description: 'Assigned index number' }
    ],
    fee: { amount: '₹20 / copy', description: 'Statutory physical / digital copy tariff' },
    estimatedTime: '1 - 2 days',
    applicationMode: 'Online',
    applicationUrl: 'https://digilocker.gov.in',
    source: {
      id: 'src-digilocker-birth',
      title: 'National DigiLocker & CRS Integration Portal',
      url: 'https://digilocker.gov.in',
      department: 'Ministry of Electronics & Information Technology',
      domain: 'digilocker.gov.in',
      lastChecked: '2026-09-25',
      verificationStatus: 'Verified'
    },
    verificationStatus: 'VERIFIED'
  }
];
