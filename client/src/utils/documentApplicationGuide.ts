export interface DocumentHowToApplyGuide {
  documentName: string;
  portalName: string;
  directUrl: string;
  authority: string;
  estimatedTime: string;
  fee: string;
  steps: string[];
  tips: string[];
}

export const documentApplicationGuides: Record<string, DocumentHowToApplyGuide> = {
  // 1. Aadhaar Card (Real Application & Enrolment / Update Steps)
  'Aadhaar': {
    documentName: 'Aadhaar Card (New Enrolment / Biometric Update / e-KYC)',
    portalName: 'UIDAI myAadhaar Portal & Seva Kendra System',
    directUrl: 'https://appointments.uidai.gov.in/bookappointment.aspx',
    authority: 'Unique Identification Authority of India (UIDAI)',
    estimatedTime: 'Appointment: 1 Day | Enrolment Generation: 5 - 10 Days',
    fee: '₹0 (New Enrolment) / ₹50 (Demographic Update) / ₹100 (Biometric Update)',
    steps: [
      'Open the official UIDAI appointment booking portal (https://appointments.uidai.gov.in).',
      'Select your City/Location (e.g., Mumbai, Pune, Thane) and click "Proceed to Book Appointment".',
      'Enter your mobile number, solve captcha, and enter the generated OTP.',
      'Select procedure type: "New Aadhaar Enrolment" or "Update Existing Aadhaar".',
      'Fill in applicant demographic information (Full Legal Name, Date of Birth, Gender, Residential Address).',
      'Upload and select valid Proof of Identity (PoI) and Proof of Address (PoA) documents (e.g. Passport, Voter ID, Ration Card, School Leaving Certificate).',
      'Select a convenient time slot at your nearest Aadhaar Seva Kendra (ASK) and download the Appointment Token Slip.',
      'Visit the ASK center on the scheduled date for biometric capture (fingerprints, iris scan, live photograph).',
      'Receive your 14-digit Enrolment ID (EID) acknowledgement receipt and track generation status online.'
    ],
    tips: [
      'Ensure your mobile number is actively registered with your Aadhaar for instant OTP verification on all business and taxation portals.',
      'Minors turning 5 and 15 years old must complete mandatory biometric update at any authorized center.'
    ]
  },

  // 2. PAN Card (Permanent Account Number) Application
  'PAN': {
    documentName: 'PAN Card (Permanent Account Number - Form 49A / e-PAN)',
    portalName: 'Income Tax e-Filing & Protean NSDL Portal',
    directUrl: 'https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html',
    authority: 'Income Tax Department, Ministry of Finance, Govt of India',
    estimatedTime: 'Instant (10 Mins via Aadhaar OTP) / 7 - 10 Days for Physical Card',
    fee: '₹0 (Instant e-PAN) / ₹107 (Physical card dispatched via Speed Post)',
    steps: [
      'Open the Protean NSDL Online PAN portal (or Income Tax Instant e-PAN portal).',
      'Select Application Type: "Form 49A - Indian Citizen" and Category (Individual / Partnership Firm / Company).',
      'Fill in applicant personal details, contact email, and active mobile number.',
      'Generate a Temporary Token Number to save application progress.',
      'Fill in Personal Details, Parents Information, Source of Income, and Address for Communication.',
      'Choose verification mode: "Submit digitally through e-KYC & e-Sign (Paperless)" using Aadhaar OTP.',
      'Provide Assessing Officer (AO) Code (auto-populated based on your city and area pin code).',
      'Pay the statutory fee (₹107) using NetBanking, Debit Card, or UPI.',
      'Download the 15-digit PAN Application Acknowledgement Receipt and receive your digitally signed e-PAN via email.'
    ],
    tips: [
      'Your Aadhaar details (Name, DOB, Gender) must match your PAN application exactly to avoid rejection.',
      'For business firms or companies, apply for PAN using Certificate of Incorporation / Partnership Deed.'
    ]
  },

  // 3. Bank Current / Business Account Application
  'Bank': {
    documentName: 'Commercial Business Current Account & Cancelled Cheque',
    portalName: 'Scheduled Commercial Bank Corporate Portal',
    directUrl: 'https://www.rbi.org.in',
    authority: 'RBI Scheduled Commercial Bank (e.g. HDFC, ICICI, SBI, Axis, Bank of Baroda)',
    estimatedTime: '1 - 3 Working Days (Digital Verification)',
    fee: '₹0 Account Opening (Requires Average Monthly Balance / Initial Cheque Deposit)',
    steps: [
      'Choose your preferred bank and visit their Corporate Banking / Digital Current Account portal or local branch.',
      'Click on "Open Business Current Account" and select your constitution (Sole Proprietorship / Partnership / Private Limited).',
      'Submit primary entity registration proofs (Shop & Establishment Gumasta Certificate, Udyam MSME, or GSTIN).',
      'Upload identity and address proofs of all partners/directors (PAN Card and Aadhaar Card).',
      'Provide registered business address proof (Commercial Lease Agreement + recent Electricity Bill in owner name).',
      'Schedule a Video-KYC session or branch executive visit for on-site premises verification.',
      'Fund the initial account opening deposit through online transfer or bearer cheque.',
      'Receive official Welcome Kit, Account Number, IFSC Code, Corporate NetBanking access, and printed Chequebook.'
    ],
    tips: [
      'A cancelled cheque (marked "CANCELLED" in bold ink across the leaf) is required as verified proof of banking for GST and subsidy claims.',
      'Ensure the business trade name printed on the cheque matches your official municipal license.'
    ]
  },

  // 4. Shop & Establishment Certificate (Gumasta)
  'Shop': {
    documentName: 'Shop & Establishment Certificate (Gumasta Act Registration)',
    portalName: 'Aaple Sarkar Maharashtra Labour Single Window Portal',
    directUrl: 'https://aaplesarkar.mahaonline.gov.in',
    authority: 'Labour Department, Govt of Maharashtra & Municipal Ward Office',
    estimatedTime: 'Instant Intimation (<10 Workers) / 3 - 5 Days Registration (10+ Workers)',
    fee: '₹0 (Under 10 workers - Form F Intimation) / ₹2,360+ (10+ workers Form A)',
    steps: [
      'Open the official Aaple Sarkar portal (https://aaplesarkar.mahaonline.gov.in).',
      'Create a Citizen User ID and Login; navigate to "Industries, Energy & Labour Department".',
      'Select "Registration of Shop and Establishment" (Form A or Form F for self-intimation).',
      'Enter business details: Trade Name, Category (Retail / Bakery / Service), and exact premises address with Pin Code.',
      'Provide details of the Employer (Proprietor/Managing Partner) and number of male/female employees.',
      'Upload mandatory attachments: Commercial Lease/Rent Agreement, Owner Consent NOC, latest Electricity Bill, and PAN/Aadhaar of proprietor.',
      'Upload a clear photograph of the shop storefront showing the signboard prominently written in Marathi (Devanagari script).',
      'Review the draft application, digitally sign using Aadhaar OTP e-Sign, and pay online fees if applicable.',
      'Download your official digitally signed Shop Act Certificate containing QR code and Registration Number.'
    ],
    tips: [
      'Under Maharashtra Amendment, establishments employing fewer than 10 persons enjoy lifetime zero-fee self-intimation without annual renewal.',
      'The signboard must display Marathi text in equal or larger font size than any English text.'
    ]
  },

  // 5. FSSAI Food Safety Registration / State License
  'FSSAI': {
    documentName: 'FSSAI Food Business State License / Registration Certificate',
    portalName: 'FoSCoS (Food Safety Compliance System) National Portal',
    directUrl: 'https://foscos.fssai.gov.in',
    authority: 'Food Safety and Standards Authority of India (FSSAI)',
    estimatedTime: '7 - 14 Days (Basic Registration) / 15 - 30 Days (State License)',
    fee: '₹100/year (Basic Registration Turnover < ₹12L) / ₹2,000/year (State License Turnover ₹12L - ₹20Cr)',
    steps: [
      'Open the official FoSCoS portal (https://foscos.fssai.gov.in).',
      'Click on "Apply for New License/Registration" on the top navigation bar.',
      'Select State: "Maharashtra" and choose Head of Business (e.g. Food Services / Bakery Manufacturing / Retail).',
      'Select appropriate scale based on expected annual turnover: Basic (Form A) or State License (Form B).',
      'Fill in manufacturing unit address, installed production capacity (kg/day), and select applicable food category numbers.',
      'Upload required documentation: Proprietor photo, Premises proof (Rent Agreement), Water Potability Test Report (IS 10500), and Equipment list.',
      'Upload Food Safety Management System (FSMS) plan or self-declaration of hygienic manufacturing practices.',
      'Pay online statutory fee for chosen tenure (1 to 5 years) via Bharatkosh / NetBanking.',
      'Submit the application and note your 14-digit FoSCoS Application Reference Number (ARN) for tracking.',
      'Upon Food Safety Officer (FSO) scrutiny or premises inspection, download your 14-digit FSSAI License Certificate.'
    ],
    tips: [
      'Any commercial food prep unit using potable water must attach a certified water testing report from an NABL accredited lab.',
      'The FSSAI registration number must be printed on all food packaging, invoices, and the front entrance display.'
    ]
  },

  // 6. Fire Safety Clearance (Fire NOC)
  'Fire': {
    documentName: 'Fire Safety Compliance Clearance (Fire NOC)',
    portalName: 'Municipal Citizen Portal (MCGM / PMC / TMC)',
    directUrl: 'https://portal.mcgm.gov.in',
    authority: 'Chief Fire Officer & Municipal Fire Brigade',
    estimatedTime: '7 - 15 Working Days',
    fee: '₹1,500 - ₹5,000 (Based on floor area and fire hazard category)',
    steps: [
      'Open the Municipal Corporation Citizen Portal (e.g. portal.mcgm.gov.in).',
      'Log in to Citizen Services and navigate to "Fire Brigade Services > Application for Fire Safety Clearance".',
      'Enter Property Assessment Number (SAC), Ward jurisdiction, and proposed commercial activity (Bakery / Commercial Kitchen / Restaurant).',
      'Upload architectural floor plan detailing entry/exit routes, ventilation shafts, kitchen exhaust chimneys, and LPG/PNG piping.',
      'Upload installation receipt of required Fire Fighting Equipment (ABC dry chemical extinguishers, CO2 cylinders, fire blanket).',
      'Submit application and pay statutory inspection fees online.',
      'The Ward Fire Officer visits the premises for on-site inspection of emergency exits, hose reels, and alarm systems.',
      'Upon satisfactory inspection, Chief Fire Officer issues the digitally signed Provisional/Final Fire Safety NOC.'
    ],
    tips: [
      'Ensure commercial ovens have dedicated fire extinguishers positioned within 3 meters.',
      'Passageways to fire exits must remain unblocked at all times.'
    ]
  },

  // 7. GSTIN Certificate (GST Registration)
  'GST': {
    documentName: 'GST Registration Certificate (Form GST REG-06)',
    portalName: 'Goods and Services Tax (GST) Official Portal',
    directUrl: 'https://reg.gst.gov.in/registration/',
    authority: 'Goods and Services Tax Network (GSTN) & Central Board of Indirect Taxes (CBIC)',
    estimatedTime: '3 - 7 Working Days (Fast-Track with Aadhaar e-KYC)',
    fee: '₹0 (Free statutory government filing)',
    steps: [
      'Open the official GST Portal (https://www.gst.gov.in) and click Services > Registration > "New Registration".',
      'Fill Part-A: Select "Taxpayer", State "Maharashtra", District, Legal Name of Business, PAN, Email, and Mobile Number.',
      'Submit Part-A to generate your 15-digit Temporary Reference Number (TRN).',
      'Log in with TRN and OTP to complete Part-B within 15 days.',
      'Fill in Business Details: Trade Name, Constitution, Reason to Obtain Registration, and Date of Commencement of Business.',
      'Add Promoter/Partner details: Name, Designation, Residential Address, Identity Proofs, and Passport Photograph.',
      'Enter Principal Place of Business with Floor/Shop Number, Municipal Ward, and upload Rent Agreement + Electricity Bill.',
      'Enter top 5 goods/services with HSN/SAC codes (e.g. HSN 1905 for Bakery/Pastry items).',
      'Choose Aadhaar Authentication for Promoters (enables instant algorithmic approval in 3 days without physical officer inspection).',
      'Submit with digital signature / Aadhaar OTP and download Form GST REG-06 Certificate with GSTIN upon approval.'
    ],
    tips: [
      'Consent letter on ₹100 stamp paper is required if commercial electricity bill is in the property owner name.',
      'Voluntary GST registration allows you to claim full input tax credit on commercial machinery and raw materials.'
    ]
  },

  // 8. Water Potability Test Report
  'Water': {
    documentName: 'Water Potability & Chemical Analysis Test Report (IS 10500)',
    portalName: 'Public Health Laboratory / NABL Accredited Testing Lab',
    directUrl: 'https://www.nabl-india.org',
    authority: 'NABL Accredited Laboratory / Municipal Public Health Dept',
    estimatedTime: '3 - 5 Working Days',
    fee: '₹1,200 - ₹2,500 per testing sample',
    steps: [
      'Obtain a clean, sterilized 2-liter glass/food-grade container from an authorized testing laboratory.',
      'Collect water sample from the direct tap/filter outlet used in your food preparation or commercial facility.',
      'Fill out the Laboratory Sample Requisition Form specifying tests required: "Drinking Water Quality as per IS 10500:2012 Standards".',
      'Submit sample to your nearest NABL accredited food/water testing laboratory or Municipal Health Lab (e.g., BMC Dadar Lab).',
      'Laboratory conducts 22 physical, chemical, and microbiological parameters (pH, Turbidity, Total Dissolved Solids, Coliform bacteria, E. coli, Heavy Metals).',
      'Pay laboratory testing fee and collect the official sealed Test Report certifying water is fit for commercial consumption.'
    ],
    tips: [
      'Sample must reach the laboratory within 6 to 12 hours of collection for valid microbiological test results.',
      'Keep the original sealed laboratory report ready for FSSAI licensing and health audits.'
    ]
  },

  // 9. Trade License / Factory Permit
  'Trade': {
    documentName: 'Municipal Health / Trade License (Section 394 MMC Act)',
    portalName: 'Municipal Corporation Citizen Services Portal (Aaple Sarkar / BMC)',
    directUrl: 'https://portal.mcgm.gov.in',
    authority: 'Public Health Department & Municipal Ward Health Officer (MOH)',
    estimatedTime: '10 - 20 Working Days',
    fee: '₹3,000 - ₹12,000 (Based on floor area and power load in HP)',
    steps: [
      'Open the Municipal Corporation portal and select "Citizen Services > Health Department > Apply for Trade License".',
      'Select trade commodity schedule (e.g. Schedule M-13 for Bakeries / Food Prep Establishments).',
      'Enter property details, commercial floor area in sq. meters, and total electric motor load (HP / Kilowatts).',
      'Upload mandatory documents: Property Tax Receipt / Assessment Bill, Commercial Lease Deed, Gumasta Certificate, and Site Plan.',
      'Upload Fire Safety NOC, Pest Control Contract, and Medical Fitness Certificates for food handlers.',
      'Submit application and pay statutory scrutiny charges online.',
      'Medical Officer of Health (MOH) and Ward Inspector conduct physical site inspection of sanitation and drainage connections.',
      'Pay scheduled license fee and download the official Municipal Health Trade License with QR verification.'
    ],
    tips: [
      'All commercial food manufacturing units with motor machinery must secure Section 394 license before commencing operations.',
      'Display the license copy framed at the entrance of the commercial unit.'
    ]
  },

  // 10. Udyam MSME Certificate
  'Udyam': {
    documentName: 'Udyam MSME Registration Certificate',
    portalName: 'National Udyam Registration Portal (Ministry of MSME)',
    directUrl: 'https://udyamregistration.gov.in',
    authority: 'Ministry of Micro, Small and Medium Enterprises, Govt of India',
    estimatedTime: 'Instant Online Generation (1 - 2 Days)',
    fee: '₹0 (100% Free Government Portal - Beware of fraudulent paid sites)',
    steps: [
      'Visit the only official government portal: https://udyamregistration.gov.in.',
      'Click on "For New Entrepreneurs who are not Registered yet as MSME".',
      'Enter your 12-digit Aadhaar Number and Name as per Aadhaar; click "Validate & Generate OTP".',
      'Validate OTP and select Type of Organization (Proprietorship / Partnership / Private Limited) and PAN.',
      'PAN validation automatically fetches ITR and GST records from income tax databases.',
      'Enter enterprise name, plant/unit location addresses, and official mobile/email.',
      'Select National Industry Classification (NIC) Code (e.g. NIC 10712 for Bakery Manufacture).',
      'Enter number of persons employed and written-down value of investment in plant & machinery.',
      'Submit final OTP and download your permanent Udyam Registration Certificate containing dynamic QR code.'
    ],
    tips: [
      'Udyam registration is 100% free; never pay any third-party agency on non-gov.in sites.',
      'Unlocks 15% collateral-free credit loan schemes (CGTMSE) and 50% concession on trademark filings.'
    ]
  }
};

/**
 * Dynamically resolves or generates a high-quality, comprehensive, realistic
 * Step-by-Step Application Guide for ANY civic/legal document.
 */
export function getHowToApplyGuide(
  docName: string,
  docContext?: {
    authority?: string;
    description?: string;
    category?: string;
    sourceUrl?: string;
    journeyTitle?: string;
  }
): DocumentHowToApplyGuide {
  const lower = (docName || '').toLowerCase();

  // 1. Check exact or partial key match in curated dictionary
  for (const [key, guide] of Object.entries(documentApplicationGuides)) {
    if (lower.includes(key.toLowerCase())) {
      return guide;
    }
  }

  // 2. Intelligent Dynamic Generator for any non-dictionary custom document
  const authorityName = docContext?.authority || 'Competent Municipal / State Statutory Authority';
  const portalName = docContext?.sourceUrl ? `${authorityName} Official Portal` : 'Aaple Sarkar / National Government Services Portal';
  const directUrl = docContext?.sourceUrl || 'https://services.india.gov.in';

  // Tailor steps dynamically based on keywords in document name
  let generatedSteps: string[] = [];
  let generatedTips: string[] = [];
  let estTime = '3 - 7 Working Days';
  let fee = 'Nominal Statutory Fee';

  if (lower.includes('deed') || lower.includes('agreement') || lower.includes('rent') || lower.includes('lease')) {
    estTime = '1 - 2 Working Days';
    fee = '₹500 - ₹1,000 (Stamp Paper & Notary Charges)';
    generatedSteps = [
      `Draft the legal terms of ${docName} on official government non-judicial e-stamp paper.`,
      'Include precise premises boundaries, carpet area, monthly consideration value, and commercial usage clause.',
      'Both parties (Licensor and Licensee/Owner and Tenant) sign each page in the presence of two independent witnesses.',
      'Visit the authorized Sub-Registrar office or certified Notary Advocate with original Aadhaar and PAN cards.',
      'Complete biometric e-registration / notarization and secure the executed, stamp-affixed legal document.'
    ];
    generatedTips = [
      'Ensure the commercial rent agreement is registered or notarized for valid statutory license submissions.',
      'Attach electricity bill of the premises in the owner name along with an explicit NOC letter.'
    ];
  } else if (lower.includes('noc') || lower.includes('clearance') || lower.includes('consent')) {
    estTime = '7 - 14 Working Days';
    fee = 'Statutory Scrutiny Fee';
    generatedSteps = [
      `Open the ${authorityName} citizen services portal (${directUrl}).`,
      `Navigate to Single Window Clearance and select "Application for ${docName}".`,
      'Fill in applicant personal identification, enterprise constitution, and site address details.',
      'Upload site layout blueprints, safety compliance proofs, and ownership authorization documents.',
      'Pay the statutory processing fee online and receive your official filing token receipt.',
      'Coordinate with the departmental inspection officer for on-site physical verification.',
      `Upon satisfactory field compliance, download the digitally signed ${docName} with official seal.`
    ];
    generatedTips = [
      'Keep copies of previous building approvals and property tax receipts handy for the inspection officer.',
      'Ensure all safety norms and equipment specified in municipal guidelines are installed before the visit.'
    ];
  } else if (lower.includes('certificate') || lower.includes('license') || lower.includes('permit')) {
    estTime = '5 - 10 Working Days';
    fee = 'Government Scheduled Fee';
    generatedSteps = [
      `Visit the official ${authorityName} portal (${directUrl}).`,
      `Select "Citizen Online Services" and click "Apply for ${docName}".`,
      'Register/Login using your Aadhaar or mobile OTP.',
      'Complete the statutory application form with accurate applicant and commercial data.',
      'Upload scanned PDF copies of required supporting documents (ID proof, address proof, premises ownership).',
      'Pay online statutory fee through the integrated government treasury gateway (GRAS / Bharatkosh / UPI).',
      'Track real-time application processing using your unique Application Reference Number (ARN).',
      `Download and print the official digitally signed ${docName} featuring the verification QR code.`
    ];
    generatedTips = [
      'Verify that all uploaded PDF scans are sharp, unaltered, and within the 2MB file size limit.',
      'The applicant name must strictly match the name printed on your primary identity card.'
    ];
  } else {
    // Standard dynamic statutory procurement steps
    generatedSteps = [
      `Open the designated government portal (${directUrl}).`,
      `Locate the department service window for "${docName}".`,
      'Create an account with Citizen ID / Mobile number and complete Aadhaar e-KYC validation.',
      'Fill out the official statutory requisition form with accurate details.',
      'Upload required primary identity, address, and premises ownership documentation.',
      'Submit the statutory fee via online NetBanking / UPI / Treasury e-Challan.',
      `Obtain the application acknowledgment slip and download the verified ${docName} once approved.`
    ];
    generatedTips = [
      'Keep the application acknowledgment token saved in your records for status inquiries.',
      'Digital certificates issued with government QR codes are legally valid across all Indian courts and departments.'
    ];
  }

  return {
    documentName: docName,
    portalName: portalName,
    directUrl: directUrl,
    authority: authorityName,
    estimatedTime: estTime,
    fee: fee,
    steps: generatedSteps,
    tips: generatedTips
  };
}
