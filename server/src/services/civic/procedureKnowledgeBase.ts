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
    domain: 'COMMERCIAL_SERVICES',
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
    plainLanguageSummary: 'Register your enterprise as a Micro or Small business on the official central government portal with zero fee.',
    whyRequired: 'Statutory national proof of being an MSME; required to access priority sector bank credit, interest subsidies, and single-window state portal permissions.',
    authority: 'Ministry of Micro, Small and Medium Enterprises (MSME)',
    category: 'National Recognition',
    jurisdiction: { country: 'India' },
    domain: 'COMMERCIAL_SERVICES',
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
    plainLanguageSummary: 'Register your physical commercial premises or establishment location with the state labour department and local municipal corporation.',
    whyRequired: 'Mandatory under Maharashtra Shops and Establishments Act, 2017 to lawfully open commercial doors, hire employees and staff, and operate in a municipal ward.',
    authority: 'Brihanmumbai Municipal Corporation (BMC) / Maharashtra State Labour Commissionerate',
    category: 'Municipal Permitting',
    jurisdiction: { country: 'India', state: 'Maharashtra', city: 'Mumbai' },
    domain: 'COMMERCIAL_SERVICES',
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
    id: 'proc-salon-health-license',
    code: 'SALON_HEALTH_LICENSE',
    title: 'Municipal Health & Trade Licence (Hair Dressing Saloon / Beauty Parlour)',
    plainLanguageSummary: 'Obtain statutory municipal health and trade clearance to lawfully operate a personal grooming, salon, or beauty establishment.',
    whyRequired: 'Mandatory under municipal law (MMC Act Section 394 in Mumbai / Karnataka Municipal Corporations Act in Bengaluru) ensuring sanitary sterilisation equipment, clean water drainage, and public health sanitation compliance.',
    authority: 'Municipal Corporation Health Department (Public Health Department)',
    category: 'Health & Municipal Clearance',
    jurisdiction: { country: 'India' },
    domain: 'PERSONAL_CARE_SERVICES',
    dependsOn: ['proc-pan-entity', 'proc-udyam-msme', 'proc-gumasta-shop'],
    canRunInParallelWith: ['proc-gst-registration'],
    documents: [
      { id: 'doc-salon-1', name: 'Commercial Premises Lease Deed / Property Tax Receipt', isMandatory: true, description: 'Registered proof of commercial occupancy' },
      { id: 'doc-salon-2', name: 'Aadhaar & PAN Identity Proof of Applicant', isMandatory: true, description: 'Statutory personal identification' },
      { id: 'doc-salon-3', name: 'Premises Floor Plan Layout Showing Styling Chairs & Steriliser', isMandatory: true, description: 'CAD or scaled drawing of salon work area' },
      { id: 'doc-salon-4', name: 'Sterilisation & Hot Water Facility Declaration', isMandatory: true, description: 'Hygiene and equipment sanitation proof' },
      { id: 'doc-salon-5', name: 'Society / Landlord No-Objection Certificate (NOC)', isMandatory: false, description: 'Conditional: required if premises is in a co-operative housing society' }
    ],
    fee: { amount: 'Schedule of Fees (Varies by area & chairs)', description: 'Statutory municipal fee schedule; verify current rate with local Ward Health Officer' },
    estimatedTime: 'Statutory 30 days under Right to Public Services Act (RTS / Sakala)',
    applicationMode: 'Online',
    applicationUrl: 'https://serviceonline.gov.in',
    source: {
      id: 'src-salon-licence',
      title: 'Municipal Public Health & Trade Licensing Regulations',
      url: 'https://serviceonline.gov.in',
      department: 'Municipal Corporation Public Health Department',
      domain: 'gov.in',
      lastChecked: '2026-09-28',
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
    plainLanguageSummary: 'Register for a 15-digit GST number to collect tax, issue official GST tax invoices, and conduct commercial transactions.',
    whyRequired: 'Mandatory under CGST Act 2017 for taxable turnover above statutory threshold, interstate commercial supplies, and e-commerce transactions.',
    authority: 'Goods and Services Tax Network (GSTN) & CBIC',
    category: 'Indirect Taxation',
    jurisdiction: { country: 'India' },
    domain: 'COMMERCIAL_SERVICES',
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
  },

  // ==========================================
  // 5. RESIDENTIAL FLAT & PROPERTY PURCHASE
  // ==========================================
  {
    id: 'proc-flat-rera-title',
    code: 'FLAT_RERA_TITLE',
    title: 'MahaRERA Project Sanction & 30-Year Encumbrance Verification',
    plainLanguageSummary: 'Verify RERA project registration, carpet area sanction, developer escrow account, and obtain 30-year non-encumbrance title search report from IGR.',
    whyRequired: 'Mandatory under Section 3 & 4 of Real Estate (Regulation and Development) Act 2016 to prevent purchasing unauthorized or disputed property.',
    authority: 'Maharashtra Real Estate Regulatory Authority (MahaRERA) / IGR Maharashtra',
    category: 'Property Due Diligence',
    jurisdiction: { country: 'India', state: 'Maharashtra', city: 'Mumbai' },
    domain: 'PROPERTY_ACQUISITION',
    dependsOn: [],
    canRunInParallelWith: [],
    documents: [
      { id: 'doc-flt-1', name: 'MahaRERA Project Registration Certificate & Approved Layout Plan', isMandatory: true, description: 'Valid RERA project listing' },
      { id: 'doc-flt-2', name: '30-Year Title Search & Non-Encumbrance Report', isMandatory: true, description: 'Issued by Advocate / SRO Search' },
      { id: 'doc-flt-3', name: 'Commencement Certificate (CC) & Approved Floor Sanction', isMandatory: true, description: 'Municipal building approval' }
    ],
    fee: { amount: '₹500 - ₹2,000', description: 'Online IGR search and RERA public register inspection fee' },
    estimatedTime: '3 - 7 working days',
    applicationMode: 'Online',
    applicationUrl: 'https://maharera.mahaonline.gov.in',
    source: {
      id: 'src-maharera',
      title: 'MahaRERA Public Project Verification Portal',
      url: 'https://maharera.mahaonline.gov.in',
      department: 'Maharashtra Real Estate Regulatory Authority',
      domain: 'mahaonline.gov.in',
      lastChecked: '2026-09-25',
      verificationStatus: 'Verified'
    },
    verificationStatus: 'VERIFIED'
  },
  {
    id: 'proc-flat-stamp-duty',
    code: 'FLAT_STAMP_DUTY',
    title: 'Stamp Duty Assessment & e-Challan Payment (GRAS Portal)',
    plainLanguageSummary: 'Calculate stamp duty and registration charges based on Ready Reckoner Rate (RRR) and pay online via Government Receipt Accounting System (GRAS).',
    whyRequired: 'Mandatory under Maharashtra Stamp Act; un-stamped or under-stamped property sale deeds are legally inadmissible as evidence of ownership.',
    authority: 'Department of Registration & Stamps (IGR Maharashtra) / Finance Department',
    category: 'Property Taxation',
    jurisdiction: { country: 'India', state: 'Maharashtra', city: 'Mumbai' },
    domain: 'PROPERTY_ACQUISITION',
    dependsOn: ['proc-flat-rera-title'],
    canRunInParallelWith: [],
    documents: [
      { id: 'doc-flt-4', name: 'Draft Agreement for Sale / Sale Deed', isMandatory: true, description: 'Executed terms and consideration value' },
      { id: 'doc-flt-5', name: 'Ready Reckoner Market Value Assessment Sheet', isMandatory: true, description: 'Calculated stamp valuation' },
      { id: 'doc-flt-6', name: 'PAN Cards & Aadhaar of Buyer and Seller', isMandatory: true, description: 'Tax identity verification' }
    ],
    fee: { amount: '5% - 6% of Agreement Value + 1% Metro Cess + ₹30,000 Reg. Fee', description: 'Statutory Maharashtra stamp duty and registration tariff' },
    estimatedTime: 'Instant online challan generation',
    applicationMode: 'Online',
    applicationUrl: 'https://gras.mahakosh.gov.in/',
    source: {
      id: 'src-gras',
      title: 'Government Receipt Accounting System (GRAS) - Maharashtra Treasury',
      url: 'https://gras.mahakosh.gov.in/',
      department: 'Finance Department, Government of Maharashtra',
      domain: 'mahakosh.gov.in',
      lastChecked: '2026-09-25',
      verificationStatus: 'Verified'
    },
    verificationStatus: 'VERIFIED'
  },
  {
    id: 'proc-flat-deed-registration',
    code: 'FLAT_DEED_REGISTRATION',
    title: 'Sub-Registrar Office Deed Registration & Biometric Index-II Extraction',
    plainLanguageSummary: 'Attend Joint Sub-Registrar office or complete e-Registration with biometric Aadhaar authentication and two witnesses to receive registered Index-II.',
    whyRequired: 'Section 17 of the Registration Act, 1908 makes registration of immovable property transactions above ₹100 compulsory to confer legal title.',
    authority: 'Sub-Registrar of Assurances (SRO Mumbai) / IGR Maharashtra',
    category: 'Title Registration',
    jurisdiction: { country: 'India', state: 'Maharashtra', city: 'Mumbai' },
    domain: 'PROPERTY_ACQUISITION',
    dependsOn: ['proc-flat-stamp-duty'],
    canRunInParallelWith: [],
    documents: [
      { id: 'doc-flt-7', name: 'Original Stamped Agreement for Sale with GRAS e-Challan & MTR-6 Receipt', isMandatory: true, description: 'Duty paid proof' },
      { id: 'doc-flt-8', name: 'Biometric Aadhaar Authentication of Buyer, Seller & 2 Witnesses', isMandatory: true, description: 'Physical / e-KYC presence' },
      { id: 'doc-flt-9', name: 'TDS Payment Challan (Form 26QB @ 1% for property value >= ₹50 Lakhs)', isMandatory: true, description: 'Income Tax Act 194-IA' }
    ],
    fee: { amount: '₹100 - ₹500 (Document handling fee)', description: 'Biometric registration scanning and Index-II generation' },
    estimatedTime: '1 - 2 business days (Slot appointment)',
    applicationMode: 'Hybrid',
    applicationUrl: 'https://igrmaharashtra.gov.in',
    source: {
      id: 'src-igr-reg',
      title: 'Inspector General of Registration - Public Data Entry & e-Step-in',
      url: 'https://igrmaharashtra.gov.in',
      department: 'Department of Registration and Stamps',
      domain: 'igrmaharashtra.gov.in',
      lastChecked: '2026-09-25',
      verificationStatus: 'Verified'
    },
    verificationStatus: 'VERIFIED'
  },
  {
    id: 'proc-flat-property-tax-mutation',
    code: 'FLAT_MUTATION_TRANSFER',
    title: 'Municipal Property Tax Mutation & Society Share Certificate Transfer',
    plainLanguageSummary: 'Submit registered Index-II to Municipal Assessment Department to update Property Tax bill name and obtain Co-op Housing Society Share Certificate.',
    whyRequired: 'Ensures municipal tax records, utility bills, and housing society voting rights reflect you as the undisputed registered owner.',
    authority: 'Brihanmumbai Municipal Corporation (BMC) - Assessment & Collection Dept & Co-op Housing Society',
    category: 'Municipal Ownership Record',
    jurisdiction: { country: 'India', state: 'Maharashtra', city: 'Mumbai' },
    domain: 'PROPERTY_ACQUISITION',
    dependsOn: ['proc-flat-deed-registration'],
    canRunInParallelWith: [],
    documents: [
      { id: 'doc-flt-10', name: 'Registered Index-II & Sale Deed Copy', isMandatory: true, description: 'Official ownership proof' },
      { id: 'doc-flt-11', name: 'NOC / Membership Application to Co-op Housing Society (Form 20 & 21)', isMandatory: true, description: 'Society share transfer' },
      { id: 'doc-flt-12', name: 'Latest Paid Municipal Property Tax Receipt', isMandatory: true, description: 'Zero dues confirmation' }
    ],
    fee: { amount: '₹500 (Society transfer fee max under Bye-laws) + ₹100 Municipal mutation fee', description: 'Statutory municipal mutation and society membership tariff' },
    estimatedTime: '15 - 30 working days',
    applicationMode: 'Hybrid',
    applicationUrl: 'https://ptaxportal.mcgm.gov.in/ptax/',
    source: {
      id: 'src-bmc-ptax',
      title: 'BMC Citizen Portal - Property Tax Mutation & Transfer',
      url: 'https://ptaxportal.mcgm.gov.in/ptax/',
      department: 'Assessment & Collection Department, BMC',
      domain: 'mcgm.gov.in',
      lastChecked: '2026-09-25',
      verificationStatus: 'Verified'
    },
    verificationStatus: 'VERIFIED'
  },

  // ==========================================
  // 6. RESIDENTIAL RENTAL, LEASE & TENANT VERIFICATION
  // ==========================================
  {
    id: 'proc-rent-leave-license',
    code: 'RENT_LEAVE_LICENSE',
    title: 'Registered Leave & License Agreement (IGR e-Registration)',
    plainLanguageSummary: 'Execute and e-register the 11-month or multi-year rental agreement with official 0.25% stamp duty and biometric Aadhaar authentication.',
    whyRequired: 'Section 55 of Maharashtra Rent Control Act 1999 makes registration of tenancy agreements mandatory in writing; un-registered rent agreements cannot be enforced in court.',
    authority: 'Department of Registration & Stamps (IGR Maharashtra)',
    category: 'Tenancy Legal Registration',
    jurisdiction: { country: 'India', state: 'Maharashtra', city: 'Mumbai' },
    domain: 'PROPERTY_RENTAL',
    dependsOn: [],
    canRunInParallelWith: [],
    documents: [
      { id: 'doc-rnt-1', name: 'Draft Leave & License Agreement (Rent, Deposit & Tenure)', isMandatory: true, description: 'Agreed monthly rental & security terms' },
      { id: 'doc-rnt-2', name: 'Aadhaar Card & PAN of Landlord (Owner) and Tenant', isMandatory: true, description: 'Biometric identity verification' },
      { id: 'doc-rnt-3', name: 'Electricity Bill or Property Tax Receipt of Rented Flat', isMandatory: true, description: 'Ownership and address proof' },
      { id: 'doc-rnt-4', name: 'Two Identifier / Witness Aadhaar Verification', isMandatory: true, description: 'Statutory witness presence' }
    ],
    fee: { amount: '0.25% of Total Rent + Deposit + ₹1,000 Reg. Fee', description: 'Statutory Maharashtra e-Registration stamp tariff' },
    estimatedTime: '1 - 2 business days (Online e-Registration)',
    applicationMode: 'Online',
    applicationUrl: 'https://efilingigr.maharashtra.gov.in/ereg/',
    source: {
      id: 'src-igr-rent',
      title: 'IGR Maharashtra e-Registration Portal for Leave & License',
      url: 'https://efilingigr.maharashtra.gov.in/ereg/',
      department: 'Department of Registration and Stamps, Government of Maharashtra',
      domain: 'maharashtra.gov.in',
      lastChecked: '2026-09-26',
      verificationStatus: 'Verified'
    },
    verificationStatus: 'VERIFIED'
  },
  {
    id: 'proc-rent-police-verification',
    code: 'RENT_POLICE_VERIFICATION',
    title: 'Online Police Tenant Information Intimation (Police Clearance)',
    plainLanguageSummary: 'Submit tenant details, workplace info, permanent address, and landlord declaration on the official City Police citizen portal.',
    whyRequired: 'Mandatory under Section 144 of the Code of Criminal Procedure (CrPC) and Police Commissioner notifications to ensure neighborhood safety.',
    authority: 'Mumbai Police (Citizen Portal) / Maharashtra State Police',
    category: 'Security & Police Verification',
    jurisdiction: { country: 'India', state: 'Maharashtra', city: 'Mumbai' },
    domain: 'PROPERTY_RENTAL',
    dependsOn: ['proc-rent-leave-license'],
    canRunInParallelWith: [],
    documents: [
      { id: 'doc-rnt-5', name: 'Registered Leave & License Agreement Copy / Index-II', isMandatory: true, description: 'Proof of lawful tenancy' },
      { id: 'doc-rnt-6', name: 'Tenant Permanent Address Proof & Passport Photograph', isMandatory: true, description: 'Native address verification' },
      { id: 'doc-rnt-7', name: 'Tenant Company / College ID Card', isMandatory: true, description: 'Employment or student enrollment proof' }
    ],
    fee: { amount: '₹0 (Free of cost)', description: 'Government police online intimation is completely free' },
    estimatedTime: 'Instant online acknowledgment token',
    applicationMode: 'Online',
    applicationUrl: 'https://mumbaipolice.gov.in/',
    source: {
      id: 'src-police-tenant',
      title: 'Mumbai Police Citizen Portal - Tenant Information Submission',
      url: 'https://mumbaipolice.gov.in/',
      department: 'Mumbai Police / Home Department, Maharashtra',
      domain: 'mumbaipolice.gov.in',
      lastChecked: '2026-09-26',
      verificationStatus: 'Verified'
    },
    verificationStatus: 'VERIFIED'
  },
  {
    id: 'proc-rent-society-intimation',
    code: 'RENT_SOCIETY_NOC',
    title: 'Co-op Housing Society Tenant Intimation & Move-in Gate Pass',
    plainLanguageSummary: 'Submit copy of registered agreement and police verification receipt to the Housing Society Office to receive the Move-in Gate Pass.',
    whyRequired: 'Model Bye-Law No. 43 of Maharashtra Co-operative Housing Societies requires official intimation of sub-letting before tenant takes physical possession.',
    authority: 'Co-operative Housing Society Managing Committee',
    category: 'Housing Society Clearance',
    jurisdiction: { country: 'India', state: 'Maharashtra', city: 'Mumbai' },
    domain: 'PROPERTY_RENTAL',
    dependsOn: ['proc-rent-police-verification'],
    canRunInParallelWith: [],
    documents: [
      { id: 'doc-rnt-8', name: 'Registered Agreement Copy with Index-II', isMandatory: true, description: 'Official agreement' },
      { id: 'doc-rnt-9', name: 'Police Verification Acknowledgment Receipt', isMandatory: true, description: 'Police portal token' },
      { id: 'doc-rnt-10', name: 'Society Appendix 27 Subletting Intimation Form', isMandatory: true, description: 'Standard society form' }
    ],
    fee: { amount: 'Max ₹100 / month non-occupancy charges', description: 'Statutory ceiling per Maharashtra State Co-op Dept Circular' },
    estimatedTime: '1 - 3 days',
    applicationMode: 'Hybrid',
    applicationUrl: 'https://sahakarayukta.maharashtra.gov.in/',
    source: {
      id: 'src-coop-dept',
      title: 'Department of Co-operation, Marketing & Textiles - Maharashtra',
      url: 'https://sahakarayukta.maharashtra.gov.in/',
      department: 'Co-operation Department, Government of Maharashtra',
      domain: 'maharashtra.gov.in',
      lastChecked: '2026-09-26',
      verificationStatus: 'Verified'
    },
    verificationStatus: 'VERIFIED'
  },
  // ==========================================
  // 6. DRIVING LICENCE (SARATHI PARIVAHAN / RTO)
  // ==========================================
  {
    id: 'proc-dl-learner',
    code: 'DL_LEARNER',
    title: "Online Learner's Licence (LL) Application & Aadhaar e-KYC Test (Form 2)",
    plainLanguageSummary: "Apply online for a Learner's Licence on Parivahan Sarathi, submit Form 1 self-declaration of fitness, and clear the computerized road safety test from home via Aadhaar biometric authentication.",
    whyRequired: "Under Section 3 of the Motor Vehicles Act, 1988, holding a valid Learner's Licence is mandatory before you can practice driving or book a permanent driving test slot.",
    authority: 'Ministry of Road Transport & Highways (MoRTH) & Maharashtra Motor Vehicles Department',
    category: 'Provisional Licensing',
    jurisdiction: { country: 'India', state: 'Maharashtra' },
    domain: 'TRANSPORT',
    dependsOn: [],
    canRunInParallelWith: [],
    documents: [
      { id: 'doc-dl-1', name: 'Aadhaar Card (Linked with Mobile for OTP e-KYC)', isMandatory: true, description: 'National identity and residential address authentication' },
      { id: 'doc-dl-2', name: 'Age Proof (Birth Certificate / 10th Marksheet / Passport)', isMandatory: true, description: 'Verification of minimum 18 years age requirement' },
      { id: 'doc-dl-3', name: 'Form 1 Medical Self-Declaration of Physical Fitness', isMandatory: true, description: 'Statutory eyesight and physical fitness declaration under Rule 5' }
    ],
    fee: { amount: '₹350', description: 'Statutory LL application & online computer test fee (MoRTH Gazette)' },
    estimatedTime: '1 - 2 business days (Instant test upon slot)',
    applicationMode: 'Online',
    applicationUrl: 'https://sarathi.parivahan.gov.in/sarathiservice/',
    source: {
      id: 'src-parivahan-sarathi',
      title: 'Parivahan Sarathi Citizen Portal - MoRTH',
      url: 'https://sarathi.parivahan.gov.in/sarathiservice/',
      department: 'Ministry of Road Transport & Highways, Government of India',
      domain: 'parivahan.gov.in',
      lastChecked: '2026-09-28',
      verificationStatus: 'Verified'
    },
    verificationStatus: 'VERIFIED'
  },
  {
    id: 'proc-dl-slot',
    code: 'DL_SLOT',
    title: 'RTO Driving Track Slot Booking & Biometric Scheduling (Form 4)',
    plainLanguageSummary: "After holding your Learner's Licence for at least 30 days, submit Form 4 on Parivahan Sarathi and choose your preferred date and time slot at your regional RTO test track.",
    whyRequired: 'Mandatory statutory scheduling under Central Motor Vehicles Rule 15; secures official track capacity at RTO Mumbai (Tardeo MH-01, Andheri MH-02, or Wadala MH-03).',
    authority: 'Regional Transport Office (RTO), Maharashtra Motor Vehicles Department',
    category: 'Appointment Scheduling',
    jurisdiction: { country: 'India', state: 'Maharashtra', city: 'Mumbai' },
    domain: 'TRANSPORT',
    dependsOn: ['proc-dl-learner'],
    canRunInParallelWith: [],
    documents: [
      { id: 'doc-dl-4', name: "Valid Learner's Licence Copy (Downloaded from Parivahan)", isMandatory: true, description: 'Must have completed minimum 30 days from issue' },
      { id: 'doc-dl-5', name: 'Application Form 4 Printout & Fee Challan', isMandatory: true, description: 'Form 4 statutory application reference' }
    ],
    fee: { amount: '₹0 (Included in Test Fee)', description: 'Slot selection carries zero extra surcharge' },
    estimatedTime: 'Immediate online confirmation',
    applicationMode: 'Online',
    applicationUrl: 'https://sarathi.parivahan.gov.in/sarathiservice/',
    source: {
      id: 'src-rto-slot',
      title: 'Parivahan Sarathi - Driving Test Appointment System',
      url: 'https://sarathi.parivahan.gov.in/sarathiservice/',
      department: 'Transport Commissionerate, Maharashtra',
      domain: 'parivahan.gov.in',
      lastChecked: '2026-09-28',
      verificationStatus: 'Verified'
    },
    verificationStatus: 'VERIFIED'
  },
  {
    id: 'proc-dl-test',
    code: 'DL_PRACTICAL_TEST',
    title: 'Practical Driving Skill Test on Automated Driving Test Track (ADTT)',
    plainLanguageSummary: 'Bring your vehicle along with a licensed driver to the RTO track. Perform required maneuvers (H-track, 8-figure, parallel parking, and gradient slope stop-and-go) under sensor-based evaluation.',
    whyRequired: 'Statutory compliance under Section 9 of the Motor Vehicles Act to prove driving competence and road safety awareness before a Motor Vehicle Inspector (MVI).',
    authority: 'Motor Vehicle Inspector (MVI) Board, RTO Mumbai',
    category: 'Physical Examination',
    jurisdiction: { country: 'India', state: 'Maharashtra', city: 'Mumbai' },
    domain: 'TRANSPORT',
    dependsOn: ['proc-dl-slot'],
    canRunInParallelWith: [],
    documents: [
      { id: 'doc-dl-6', name: 'Valid Test Vehicle RC (Registration Certificate) & PUC', isMandatory: true, description: 'Original RC Smart Card and Pollution Certificate' },
      { id: 'doc-dl-7', name: 'Valid Comprehensive Vehicle Insurance Policy', isMandatory: true, description: 'Insurance certificate valid on test date' },
      { id: 'doc-dl-8', name: "Accompanist's Original Driving Licence", isMandatory: true, description: 'Licensed driver supervising test candidate' }
    ],
    fee: { amount: '₹300', description: 'Statutory driving test fee per vehicle class (LMV/MCWG)' },
    estimatedTime: '1 day (Track session approx. 2 hours)',
    applicationMode: 'Offline',
    applicationUrl: 'https://transport.maharashtra.gov.in/',
    source: {
      id: 'src-mumbai-rto',
      title: 'Maharashtra Motor Vehicles Department - Driving Test Regulations',
      url: 'https://transport.maharashtra.gov.in/',
      department: 'Maharashtra Transport Department',
      domain: 'transport.maharashtra.gov.in',
      lastChecked: '2026-09-28',
      verificationStatus: 'Verified'
    },
    verificationStatus: 'VERIFIED'
  },
  {
    id: 'proc-dl-smartcard',
    code: 'DL_SMARTCARD_ISSUE',
    title: 'Permanent Smart Card Driving Licence Issuance & DigiLocker / mParivahan Sync',
    plainLanguageSummary: 'Upon passing the driving test, your official Smart Card DL is dispatched to your registered address via India Post Speed Post with digital credentials instantly accessible in DigiLocker.',
    whyRequired: 'Final statutory motor driving permit under Section 9(1) of Motor Vehicles Act; universally valid across all Indian states and Union Territories.',
    authority: 'Licensing Authority & Regional Transport Office',
    category: 'Final Certification',
    jurisdiction: { country: 'India', state: 'Maharashtra', city: 'Mumbai' },
    domain: 'TRANSPORT',
    dependsOn: ['proc-dl-test'],
    canRunInParallelWith: [],
    documents: [
      { id: 'doc-dl-9', name: 'Passed Test Endorsement Token / Bio-metrics Slip', isMandatory: true, description: 'Digitally signed MVI test clearance sheet' }
    ],
    fee: { amount: '₹350', description: 'Smart card printing (₹200) + Speed Post postal dispatch (₹150)' },
    estimatedTime: '3 - 7 days (Instant in DigiLocker)',
    applicationMode: 'Hybrid',
    applicationUrl: 'https://sarathi.parivahan.gov.in/sarathiservice/',
    source: {
      id: 'src-dl-issuance',
      title: 'National Register for Driving Licences - Sarathi',
      url: 'https://sarathi.parivahan.gov.in/sarathiservice/',
      department: 'Ministry of Road Transport & Highways, Government of India',
      domain: 'parivahan.gov.in',
      lastChecked: '2026-09-28',
      verificationStatus: 'Verified'
    },
    verificationStatus: 'VERIFIED'
  }
];
