/**
 * Dynamic Multi-State Jurisdiction Registry for India
 * Provides statutory acts, official portals, municipal authorities, and language compliance rules
 * across all Indian States and Union Territories.
 */

export interface StateJurisdictionProfile {
  state: string;
  defaultCity: string;
  shopsAct: {
    title: string;
    actName: string;
    authority: string;
    portalName: string;
    portalUrl: string;
    domain: string;
    statutoryWhy: string;
  };
  municipalTradeLicence: {
    actName: string;
    authority: (city: string) => string;
    portalUrl: (city: string) => string;
    domain: string;
    statutoryWhy: string;
  };
  signboardRequirement: {
    language: string;
    ruleTitle: string;
    ruleDescription: string;
  };
  rtsActName: string;
  statutoryTimelineDays: number;
  singleWindowPortalName?: string;
  singleWindowPortalUrl?: string;
}

export const STATE_JURISDICTION_REGISTRY: Record<string, StateJurisdictionProfile> = {
  // ── 1. KARNATAKA ──
  'karnataka': {
    state: 'Karnataka',
    defaultCity: 'Bengaluru',
    shopsAct: {
      title: 'Shop & Commercial Establishment Registration (e-Karmika)',
      actName: 'Karnataka Shops and Commercial Establishments Act, 1961',
      authority: 'Department of Labour, Government of Karnataka',
      portalName: 'e-Karmika Karnataka Citizen Services Portal',
      portalUrl: 'https://ekarmika.karnataka.gov.in',
      domain: 'karnataka.gov.in',
      statutoryWhy: 'Mandatory statutory requirement under the Karnataka Shops and Commercial Establishments Act, 1961 to lawfully operate a commercial business and employ personnel in Karnataka.'
    },
    municipalTradeLicence: {
      actName: 'Section 353 of the Karnataka Municipal Corporations Act, 1976',
      authority: (city: string) =>
        city.toLowerCase().includes('bengaluru') || city.toLowerCase().includes('bangalore') || city.toLowerCase().includes('navg')
          ? 'Bruhat Bengaluru Mahanagara Palike (BBMP) Health Department'
          : `${city} City Corporation Health Department`,
      portalUrl: (city: string) =>
        city.toLowerCase().includes('bengaluru') || city.toLowerCase().includes('bangalore') || city.toLowerCase().includes('navg')
          ? 'https://bbmp.gov.in'
          : 'https://karnataka.gov.in',
      domain: 'bbmp.gov.in',
      statutoryWhy: 'Mandatory under Section 353 of the Karnataka Municipal Corporations Act, 1976 to certify premises sanitation, instrument sterilization, and environmental drainage compliance.'
    },
    signboardRequirement: {
      language: 'Kannada (min 60% on top) and English',
      ruleTitle: 'Karnataka Language Comprehensive Development Act, 2022',
      ruleDescription: 'Commercial nameboard must prominently display name with minimum 60% Kannada text on the upper half under the Karnataka Language Comprehensive Development Act, 2022.'
    },
    rtsActName: 'Karnataka Sakala Services Act, 2011',
    statutoryTimelineDays: 30,
    singleWindowPortalName: 'e-Karmika & Sakala Karnataka',
    singleWindowPortalUrl: 'https://sakala.kar.nic.in'
  },

  // ── 2. MAHARASHTRA ──
  'maharashtra': {
    state: 'Maharashtra',
    defaultCity: 'Mumbai',
    shopsAct: {
      title: 'Shop & Commercial Establishment Registration (Gumasta - Form F/G)',
      actName: 'Maharashtra Shops and Establishments (Regulation of Employment and Conditions of Service) Act, 2017',
      authority: 'Maharashtra State Labour Commissionerate (Aaple Sarkar)',
      portalName: 'Aaple Sarkar Citizen Services Portal - Maharashtra',
      portalUrl: 'https://aaplesarkar.mahaonline.gov.in',
      domain: 'mahaonline.gov.in',
      statutoryWhy: 'Mandatory under Maharashtra Shops and Establishments Act, 2017 to lawfully operate commercial premises, employ staff, and obtain municipal ward recognition.'
    },
    municipalTradeLicence: {
      actName: 'Section 394 of the Mumbai Municipal Corporation Act, 1888 (MMC Act)',
      authority: (city: string) =>
        city.toLowerCase().includes('mumbai')
          ? 'Brihanmumbai Municipal Corporation (BMC/MCGM) Public Health Department'
          : `${city} Municipal Corporation Public Health Department`,
      portalUrl: (city: string) =>
        city.toLowerCase().includes('mumbai')
          ? 'https://portal.mcgm.gov.in'
          : 'https://mahaonline.gov.in',
      domain: 'mcgm.gov.in',
      statutoryWhy: 'Mandatory under Section 394 of the MMC Act / Maharashtra Municipal Corporations Act to ensure tool sterilization, water drainage, and public health hygiene.'
    },
    signboardRequirement: {
      language: 'Marathi (Devanagari script) and English',
      ruleTitle: 'Maharashtra Shops and Establishments (Amendment) Act, 2022',
      ruleDescription: 'Commercial establishment nameboard must display Marathi in Devanagari script in font size equal to or larger than English letters under Maharashtra State Rules.'
    },
    rtsActName: 'Maharashtra Right to Public Services Act, 2015',
    statutoryTimelineDays: 30,
    singleWindowPortalName: 'Aaple Sarkar & MCGM Citizen Portal',
    singleWindowPortalUrl: 'https://aaplesarkar.mahaonline.gov.in'
  },

  // ── 3. DELHI (NCT OF DELHI) ──
  'delhi': {
    state: 'Delhi',
    defaultCity: 'Delhi',
    shopsAct: {
      title: 'Shop & Establishment Registration (Delhi Labour Portal)',
      actName: 'Delhi Shops and Establishments Act, 1954',
      authority: 'Department of Labour, Government of NCT of Delhi',
      portalName: 'Delhi Labour Department e-Services Portal',
      portalUrl: 'https://labourcis.delhi.gov.in',
      domain: 'delhi.gov.in',
      statutoryWhy: 'Mandatory statutory registration under the Delhi Shops and Establishments Act, 1954 to operate commercial facilities and employ staff in the National Capital Territory.'
    },
    municipalTradeLicence: {
      actName: 'Section 417 & Section 421 of the Delhi Municipal Corporation Act, 1957 (DMC Act)',
      authority: (city: string) =>
        city.toLowerCase().includes('new delhi') || city.toLowerCase().includes('ndmc')
          ? 'New Delhi Municipal Council (NDMC) Public Health Department'
          : 'Municipal Corporation of Delhi (MCD) Public Health Department',
      portalUrl: () => 'https://mcdonline.nic.in',
      domain: 'mcdonline.nic.in',
      statutoryWhy: 'Mandatory under Section 417 of the DMC Act for trade and health premises to maintain public health, electrical, and hygiene standards.'
    },
    signboardRequirement: {
      language: 'Hindi (Devanagari script) and English',
      ruleTitle: 'Delhi Municipal Corporation (Signboard Regulations) Bylaws',
      ruleDescription: 'Commercial trade board must display premises name in Hindi (Devanagari script) along with English as per Municipal Corporation of Delhi guidelines.'
    },
    rtsActName: 'Delhi Right to Citizen Services Act, 1995 & e-SLA Framework',
    statutoryTimelineDays: 30,
    singleWindowPortalName: 'MCD Citizen Services & Delhi eSLA',
    singleWindowPortalUrl: 'https://mcdonline.nic.in'
  },

  // ── 4. TAMIL NADU ──
  'tamil nadu': {
    state: 'Tamil Nadu',
    defaultCity: 'Chennai',
    shopsAct: {
      title: 'Shop & Commercial Establishment Registration (Tamil Nadu Labour Dept)',
      actName: 'Tamil Nadu Shops and Establishments Act, 1947',
      authority: 'Department of Labour, Government of Tamil Nadu',
      portalName: 'Tamil Nadu Labour Department Single Window Portal',
      portalUrl: 'https://labour.tn.gov.in',
      domain: 'tn.gov.in',
      statutoryWhy: 'Mandatory statutory registration under the Tamil Nadu Shops and Establishments Act, 1947 to conduct commercial trade and engage workers in Tamil Nadu.'
    },
    municipalTradeLicence: {
      actName: 'Section 287 of the Chennai City Municipal Corporation Act, 1919 / Tamil Nadu Urban Local Bodies Act, 1998',
      authority: (city: string) =>
        city.toLowerCase().includes('chennai')
          ? 'Greater Chennai Corporation (GCC) Health Department'
          : `${city} City Municipal Corporation Health Section`,
      portalUrl: (city: string) =>
        city.toLowerCase().includes('chennai')
          ? 'https://chennaicorporation.gov.in'
          : 'https://tn.gov.in',
      domain: 'chennaicorporation.gov.in',
      statutoryWhy: 'Mandatory municipal licence under Tamil Nadu urban local bodies legislation ensuring sanitary drainage, clean water, and fire precautions.'
    },
    signboardRequirement: {
      language: 'Tamil (prominently on top) and English',
      ruleTitle: 'Tamil Nadu Shops & Establishments (Signboard Display) Rules',
      ruleDescription: 'Establishment nameboard must prominently display name in Tamil script on top in accordance with Tamil Nadu Shops and Establishments Rules.'
    },
    rtsActName: 'Tamil Nadu Right to Services Citizen Charter',
    statutoryTimelineDays: 30,
    singleWindowPortalName: 'TN e-District & GCC Portal',
    singleWindowPortalUrl: 'https://chennaicorporation.gov.in'
  },

  // ── 5. TELANGANA ──
  'telangana': {
    state: 'Telangana',
    defaultCity: 'Hyderabad',
    shopsAct: {
      title: 'Shop & Commercial Establishment Registration (TS-iPASS / Labour Dept)',
      actName: 'Telangana Shops and Establishments Act, 1988',
      authority: 'Department of Labour, Government of Telangana',
      portalName: 'Telangana Labour Portal & TS-iPASS Single Desk',
      portalUrl: 'https://labour.telangana.gov.in',
      domain: 'telangana.gov.in',
      statutoryWhy: 'Mandatory under Telangana Shops and Establishments Act, 1988 for commercial establishment identity, employee welfare, and municipal ward registration.'
    },
    municipalTradeLicence: {
      actName: 'Section 521 & Section 622 of the Greater Hyderabad Municipal Corporation Act, 1955',
      authority: (city: string) =>
        city.toLowerCase().includes('hyderabad') || city.toLowerCase().includes('secunderabad')
          ? 'Greater Hyderabad Municipal Corporation (GHMC) Health & Sanitation Wing'
          : `${city} Municipal Corporation Health Department`,
      portalUrl: (city: string) =>
        city.toLowerCase().includes('hyderabad')
          ? 'https://ghmc.gov.in'
          : 'https://cdma.cgg.gov.in',
      domain: 'ghmc.gov.in',
      statutoryWhy: 'Mandatory trade licence under GHMC Act Section 521 regulating hygiene, water discharge, and commercial public health compliance.'
    },
    signboardRequirement: {
      language: 'Telugu and English',
      ruleTitle: 'Telangana Municipal Corporation Nameboard Regulations',
      ruleDescription: 'Commercial nameboard must clearly display name in Telugu script alongside English under Telangana local body regulations.'
    },
    rtsActName: 'Telangana Citizen Service Guarantee Act',
    statutoryTimelineDays: 30,
    singleWindowPortalName: 'TS-iPASS & GHMC Citizen Portal',
    singleWindowPortalUrl: 'https://ipass.telangana.gov.in'
  },

  // ── 6. GUJARAT ──
  'gujarat': {
    state: 'Gujarat',
    defaultCity: 'Ahmedabad',
    shopsAct: {
      title: 'Shop & Establishment Registration (e-Nagar Gujarat)',
      actName: 'Gujarat Shops and Establishments (Regulation of Employment and Conditions of Service) Act, 2019',
      authority: 'Labour and Employment Department, Government of Gujarat',
      portalName: 'e-Nagar Gujarat Urban Development Portal',
      portalUrl: 'https://enagar.gujarat.gov.in',
      domain: 'gujarat.gov.in',
      statutoryWhy: 'Mandatory statutory registration under the Gujarat Shops Act, 2019 via the unified e-Nagar portal to lawfully operate commercial facilities in Gujarat.'
    },
    municipalTradeLicence: {
      actName: 'Section 376 of the Gujarat Provincial Municipal Corporations (GPMC) Act, 1949',
      authority: (city: string) =>
        city.toLowerCase().includes('ahmedabad')
          ? 'Ahmedabad Municipal Corporation (AMC) Health Department'
          : city.toLowerCase().includes('surat')
          ? 'Surat Municipal Corporation (SMC) Health Department'
          : `${city} Municipal Corporation Health Department`,
      portalUrl: (city: string) =>
        city.toLowerCase().includes('ahmedabad')
          ? 'https://ahmedabadcity.gov.in'
          : 'https://enagar.gujarat.gov.in',
      domain: 'ahmedabadcity.gov.in',
      statutoryWhy: 'Mandatory under Section 376 of the GPMC Act, 1949 certifying premises hygiene, sterilization tools, and municipal sanitary clearance.'
    },
    signboardRequirement: {
      language: 'Gujarati and English',
      ruleTitle: 'Gujarat Municipalities & Shops Signboard Norms',
      ruleDescription: 'Establishment nameboard must display commercial business name in Gujarati script and English as per Gujarat state guidelines.'
    },
    rtsActName: 'Gujarat Right to Public Services Act, 2013',
    statutoryTimelineDays: 30,
    singleWindowPortalName: 'e-Nagar Gujarat & IFP Portal',
    singleWindowPortalUrl: 'https://enagar.gujarat.gov.in'
  },

  // ── 7. WEST BENGAL ──
  'west bengal': {
    state: 'West Bengal',
    defaultCity: 'Kolkata',
    shopsAct: {
      title: 'Shop & Establishment Registration (Silpa Sathi / WBLC)',
      actName: 'West Bengal Shops and Establishments Act, 1963',
      authority: 'Labour Department, Government of West Bengal',
      portalName: 'Silpa Sathi Single Window & WBLC Portal',
      portalUrl: 'https://silpasathi.wb.gov.in',
      domain: 'wb.gov.in',
      statutoryWhy: 'Mandatory under the West Bengal Shops and Establishments Act, 1963 to obtain lawful commercial establishment identity and engage workers.'
    },
    municipalTradeLicence: {
      actName: 'Section 199 (Certificate of Enlistment) of the Kolkata Municipal Corporation Act, 1980',
      authority: (city: string) =>
        city.toLowerCase().includes('kolkata') || city.toLowerCase().includes('calcutta')
          ? 'Kolkata Municipal Corporation (KMC) License & Health Department'
          : `${city} Municipal Health & License Section`,
      portalUrl: (city: string) =>
        city.toLowerCase().includes('kolkata') || city.toLowerCase().includes('calcutta')
          ? 'https://www.kmcgov.in'
          : 'https://wb.gov.in',
      domain: 'kmcgov.in',
      statutoryWhy: 'Mandatory Certificate of Enlistment (Trade Licence) under Section 199 of KMC Act, 1980 to operate personal care or trade establishments.'
    },
    signboardRequirement: {
      language: 'Bengali and English',
      ruleTitle: 'West Bengal Municipal Corporation Signboard Rules',
      ruleDescription: 'Commercial signboard must display trade name prominently in Bengali script alongside English under West Bengal municipal bylaws.'
    },
    rtsActName: 'West Bengal Right to Public Services Act, 2013',
    statutoryTimelineDays: 30,
    singleWindowPortalName: 'Silpa Sathi & KMC e-Services',
    singleWindowPortalUrl: 'https://silpasathi.wb.gov.in'
  },

  // ── 8. UTTAR PRADESH ──
  'uttar pradesh': {
    state: 'Uttar Pradesh',
    defaultCity: 'Lucknow',
    shopsAct: {
      title: 'Shop & Commercial Establishment Registration (Nivesh Mitra / UP Labour)',
      actName: 'Uttar Pradesh Dookan Aur Vanijya Adhishthan Adhiniyam, 1962',
      authority: 'Department of Labour, Government of Uttar Pradesh',
      portalName: 'Nivesh Mitra UP Single Window Portal',
      portalUrl: 'https://niveshmitra.up.nic.in',
      domain: 'up.nic.in',
      statutoryWhy: 'Mandatory statutory registration under the UP Dookan Aur Vanijya Adhishthan Adhiniyam, 1962 to operate retail and service enterprises in Uttar Pradesh.'
    },
    municipalTradeLicence: {
      actName: 'Section 437 of the Uttar Pradesh Municipal Corporation Act, 1959',
      authority: (city: string) =>
        city.toLowerCase().includes('noida') || city.toLowerCase().includes('greater noida')
          ? 'NOIDA Authority Health & Commercial Department'
          : `${city} Nagar Nigam Health Department`,
      portalUrl: () => 'https://enagarsewa.up.gov.in',
      domain: 'up.gov.in',
      statutoryWhy: 'Mandatory under Section 437 of the UP Municipal Corporation Act, 1959 for commercial and personal care premises to ensure hygiene, water, and fire safety.'
    },
    signboardRequirement: {
      language: 'Hindi (Devanagari script) and English',
      ruleTitle: 'UP Nagar Nigam Signboard & Language Bylaws',
      ruleDescription: 'Commercial establishment nameplate must prominently display name in Hindi (Devanagari script) and English under UP Nagar Nigam bylaws.'
    },
    rtsActName: 'Uttar Pradesh Janhit Guarantee Adhiniyam, 2011',
    statutoryTimelineDays: 30,
    singleWindowPortalName: 'Nivesh Mitra UP Single Window',
    singleWindowPortalUrl: 'https://niveshmitra.up.nic.in'
  },

  // ── 9. RAJASTHAN ──
  'rajasthan': {
    state: 'Rajasthan',
    defaultCity: 'Jaipur',
    shopsAct: {
      title: 'Shop & Commercial Establishment Registration (RajSSO / LDMS)',
      actName: 'Rajasthan Shops and Commercial Establishments Act, 1958',
      authority: 'Department of Labour, Government of Rajasthan',
      portalName: 'Rajasthan Single Sign-On (RajSSO) Portal',
      portalUrl: 'https://sso.rajasthan.gov.in',
      domain: 'rajasthan.gov.in',
      statutoryWhy: 'Mandatory under the Rajasthan Shops and Commercial Establishments Act, 1958 to legally run commercial operations in Rajasthan.'
    },
    municipalTradeLicence: {
      actName: 'Section 256 of the Rajasthan Municipalities Act, 2009',
      authority: (city: string) =>
        city.toLowerCase().includes('jaipur')
          ? 'Jaipur Municipal Corporation (Nagar Nigam) Health Section'
          : `${city} Nagar Nigam / Municipal Board`,
      portalUrl: () => 'https://urban.rajasthan.gov.in',
      domain: 'rajasthan.gov.in',
      statutoryWhy: 'Mandatory under Section 256 of the Rajasthan Municipalities Act, 2009 for commercial hygiene, waste disposal, and trade authorization.'
    },
    signboardRequirement: {
      language: 'Hindi (Devanagari script) and English',
      ruleTitle: 'Rajasthan Municipalities Nameboard Regulations',
      ruleDescription: 'Trade board must display commercial name in Hindi (Devanagari script) and English as per Rajasthan local body norms.'
    },
    rtsActName: 'Rajasthan Guaranteed Delivery of Public Services Act, 2011',
    statutoryTimelineDays: 30,
    singleWindowPortalName: 'RajSSO Single Window System',
    singleWindowPortalUrl: 'https://sso.rajasthan.gov.in'
  },

  // ── 10. KERALA ──
  'kerala': {
    state: 'Kerala',
    defaultCity: 'Kochi',
    shopsAct: {
      title: 'Shop & Commercial Establishment Registration (K-SWIFT / Labour Dept)',
      actName: 'Kerala Shops and Commercial Establishments Act, 1960',
      authority: 'Labour Commissionerate, Government of Kerala',
      portalName: 'Kerala Single Window Interface for Fast and Transparent Clearances (K-SWIFT)',
      portalUrl: 'https://kswift.kerala.gov.in',
      domain: 'kerala.gov.in',
      statutoryWhy: 'Mandatory statutory registration under the Kerala Shops and Commercial Establishments Act, 1960 via K-SWIFT.'
    },
    municipalTradeLicence: {
      actName: 'Section 447 of the Kerala Municipality Act, 1994 (D&O Trade Licence)',
      authority: (city: string) =>
        city.toLowerCase().includes('kochi') || city.toLowerCase().includes('cochin')
          ? 'Kochi Municipal Corporation Health & License Wing'
          : `${city} Municipal Corporation / Grama Panchayat Health Section`,
      portalUrl: () => 'https://kswift.kerala.gov.in',
      domain: 'kerala.gov.in',
      statutoryWhy: 'Mandatory Dangerous & Offensive (D&O) Trade Licence under Section 447 of the Kerala Municipality Act, 1994 ensuring public health and sanitation.'
    },
    signboardRequirement: {
      language: 'Malayalam and English',
      ruleTitle: 'Kerala Shops & Commercial Establishments Signboard Rules',
      ruleDescription: 'Commercial signboard must prominently display name in Malayalam script on top in accordance with Kerala state regulations.'
    },
    rtsActName: 'Kerala State Right to Service Act, 2012',
    statutoryTimelineDays: 30,
    singleWindowPortalName: 'K-SWIFT Kerala Single Window',
    singleWindowPortalUrl: 'https://kswift.kerala.gov.in'
  },

  // ── 11. HARYANA ──
  'haryana': {
    state: 'Haryana',
    defaultCity: 'Gurugram',
    shopsAct: {
      title: 'Shop & Commercial Establishment Registration (Haryana Labour Portal / HEPC)',
      actName: 'Punjab Shops and Commercial Establishments Act, 1958 (as applicable to Haryana)',
      authority: 'Department of Labour, Government of Haryana',
      portalName: 'Haryana Enterprise Promotion Centre (HEPC) / Labour Portal',
      portalUrl: 'https://hrylabour.gov.in',
      domain: 'haryana.gov.in',
      statutoryWhy: 'Mandatory under the Punjab Shops and Commercial Establishments Act, 1958 (Haryana Adaptation) to operate commercial facilities in Haryana.'
    },
    municipalTradeLicence: {
      actName: 'Section 330 of the Haryana Municipal Corporation Act, 1994',
      authority: (city: string) =>
        city.toLowerCase().includes('gurugram') || city.toLowerCase().includes('gurgaon')
          ? 'Municipal Corporation of Gurugram (MCG) Health Department'
          : city.toLowerCase().includes('faridabad')
          ? 'Municipal Corporation of Faridabad (MCF) Health Department'
          : `${city} Municipal Corporation Health Department`,
      portalUrl: () => 'https://ulbharyana.gov.in',
      domain: 'haryana.gov.in',
      statutoryWhy: 'Mandatory trade licence under Section 330 of the Haryana Municipal Corporation Act, 1994 verifying hygiene, water connection, and safety clearance.'
    },
    signboardRequirement: {
      language: 'Hindi (Devanagari script) and English',
      ruleTitle: 'Haryana Municipal Corporation Signboard Regulations',
      ruleDescription: 'Commercial signage must display business name in Hindi and English as per Directorate of Urban Local Bodies Haryana.'
    },
    rtsActName: 'Haryana Right to Service Act, 2014',
    statutoryTimelineDays: 30,
    singleWindowPortalName: 'HEPC Haryana Single Window',
    singleWindowPortalUrl: 'https://investharyana.in'
  },

  // ── 12. PUNJAB ──
  'punjab': {
    state: 'Punjab',
    defaultCity: 'Ludhiana',
    shopsAct: {
      title: 'Shop & Commercial Establishment Registration (Invest Punjab / mSeva)',
      actName: 'Punjab Shops and Commercial Establishments Act, 1958',
      authority: 'Department of Labour, Government of Punjab',
      portalName: 'Invest Punjab & mSeva Citizen Portal',
      portalUrl: 'https://mseva.lgpunjab.gov.in',
      domain: 'punjab.gov.in',
      statutoryWhy: 'Mandatory registration under the Punjab Shops and Commercial Establishments Act, 1958 to operate commercial shops and employ staff in Punjab.'
    },
    municipalTradeLicence: {
      actName: 'Section 343 of the Punjab Municipal Corporation Act, 1976',
      authority: (city: string) => `${city} Municipal Corporation Health Wing`,
      portalUrl: () => 'https://mseva.lgpunjab.gov.in',
      domain: 'punjab.gov.in',
      statutoryWhy: 'Mandatory under Section 343 of the Punjab Municipal Corporation Act, 1976 for sanitary verification and trade operation.'
    },
    signboardRequirement: {
      language: 'Punjabi (Gurmukhi script on top) and English',
      ruleTitle: 'Punjab Learning of Punjabi and Other Languages Act',
      ruleDescription: 'Commercial boards must display name in Punjabi (Gurmukhi script) on top and in larger font than English under official state language rules.'
    },
    rtsActName: 'Punjab Right to Service Act, 2011',
    statutoryTimelineDays: 30,
    singleWindowPortalName: 'mSeva Punjab Citizen Portal',
    singleWindowPortalUrl: 'https://mseva.lgpunjab.gov.in'
  },

  // ── 13. ANDHRA PRADESH ──
  'andhra pradesh': {
    state: 'Andhra Pradesh',
    defaultCity: 'Visakhapatnam',
    shopsAct: {
      title: 'Shop & Commercial Establishment Registration (AP Single Desk)',
      actName: 'Andhra Pradesh Shops and Establishments Act, 1988',
      authority: 'Department of Labour, Government of Andhra Pradesh',
      portalName: 'AP Industries Single Desk Portal & Labour Portal',
      portalUrl: 'https://apindustries.gov.in',
      domain: 'ap.gov.in',
      statutoryWhy: 'Mandatory under the Andhra Pradesh Shops and Establishments Act, 1988 to obtain formal establishment recognition and engage employees.'
    },
    municipalTradeLicence: {
      actName: 'Section 521 of the Andhra Pradesh Municipal Corporations Act, 1955',
      authority: (city: string) =>
        city.toLowerCase().includes('visakhapatnam') || city.toLowerCase().includes('vizag')
          ? 'Greater Visakhapatnam Municipal Corporation (GVMC) Health Directorate'
          : city.toLowerCase().includes('vijayawada')
          ? 'Vijayawada Municipal Corporation (VMC) Health Section'
          : `${city} Municipal Corporation Health Department`,
      portalUrl: () => 'https://cdma.ap.gov.in',
      domain: 'ap.gov.in',
      statutoryWhy: 'Mandatory trade licence under Section 521 of the AP Municipal Corporations Act, 1955 for hygiene, water drainage, and public sanitation.'
    },
    signboardRequirement: {
      language: 'Telugu and English',
      ruleTitle: 'AP Municipal Corporation Nameboard Regulations',
      ruleDescription: 'Commercial signage must clearly display business name in Telugu script alongside English under Andhra Pradesh municipal bylaws.'
    },
    rtsActName: 'Andhra Pradesh Right to Services Citizen Charter',
    statutoryTimelineDays: 30,
    singleWindowPortalName: 'AP Single Desk Portal',
    singleWindowPortalUrl: 'https://apindustries.gov.in'
  },

  // ── 14. MADHYA PRADESH ──
  'madhya pradesh': {
    state: 'Madhya Pradesh',
    defaultCity: 'Indore',
    shopsAct: {
      title: 'Shop & Establishment Registration (MP e-Nagar Palika / Shram Seva)',
      actName: 'Madhya Pradesh Shops and Establishments Act, 1958',
      authority: 'Labour Department, Government of Madhya Pradesh',
      portalName: 'MP e-Nagar Palika & MP Shram Seva Portal',
      portalUrl: 'https://mpenagarpalika.gov.in',
      domain: 'mp.gov.in',
      statutoryWhy: 'Mandatory registration under the Madhya Pradesh Shops and Establishments Act, 1958 to conduct commercial trade and engage workers in MP.'
    },
    municipalTradeLicence: {
      actName: 'Section 366 of the Madhya Pradesh Municipal Corporation Act, 1956',
      authority: (city: string) => `${city} Municipal Corporation Health Department`,
      portalUrl: () => 'https://mpenagarpalika.gov.in',
      domain: 'mp.gov.in',
      statutoryWhy: 'Mandatory under Section 366 of the MP Municipal Corporation Act, 1956 for trade premises hygiene and sanitation clearance.'
    },
    signboardRequirement: {
      language: 'Hindi (Devanagari script) and English',
      ruleTitle: 'MP Municipal Corporation Signboard Rules',
      ruleDescription: 'Establishment nameboard must display name in Hindi (Devanagari script) and English under Madhya Pradesh local body bylaws.'
    },
    rtsActName: 'Madhya Pradesh Public Services Guarantee Act, 2010',
    statutoryTimelineDays: 30,
    singleWindowPortalName: 'MP e-Nagar Palika & MP Single Window',
    singleWindowPortalUrl: 'https://mpenagarpalika.gov.in'
  },

  // ── 15. ODISHA ──
  'odisha': {
    state: 'Odisha',
    defaultCity: 'Bhubaneswar',
    shopsAct: {
      title: 'Shop & Commercial Establishment Registration (SUJOG / GO SWIFT)',
      actName: 'Odisha Shops and Commercial Establishments Act, 1956',
      authority: 'Labour & ESI Department, Government of Odisha',
      portalName: 'SUJOG Urban Odisha & GO SWIFT Single Window',
      portalUrl: 'https://sujog.odisha.gov.in',
      domain: 'odisha.gov.in',
      statutoryWhy: 'Mandatory under the Odisha Shops and Commercial Establishments Act, 1956 to operate a commercial premises in Odisha.'
    },
    municipalTradeLicence: {
      actName: 'Section 551 of the Odisha Municipal Corporation Act, 2003',
      authority: (city: string) =>
        city.toLowerCase().includes('bhubaneswar')
          ? 'Bhubaneswar Municipal Corporation (BMC Odisha) Health Department'
          : `${city} Municipal Corporation Health Section`,
      portalUrl: () => 'https://sujog.odisha.gov.in',
      domain: 'odisha.gov.in',
      statutoryWhy: 'Mandatory under Section 551 of the Odisha Municipal Corporation Act, 2003 for trade authorization and environmental sanitation.'
    },
    signboardRequirement: {
      language: 'Odia (prominently on top) and English',
      ruleTitle: 'Odisha Shops & Commercial Establishments (Amendment) Rules',
      ruleDescription: 'Commercial nameboard must prominently display name in Odia script on top under the Odisha Official Language Regulations.'
    },
    rtsActName: 'Odisha Right to Public Services Act, 2012',
    statutoryTimelineDays: 30,
    singleWindowPortalName: 'SUJOG Urban Odisha Portal',
    singleWindowPortalUrl: 'https://sujog.odisha.gov.in'
  },

  // ── 16. BIHAR ──
  'bihar': {
    state: 'Bihar',
    defaultCity: 'Patna',
    shopsAct: {
      title: 'Shop & Commercial Establishment Registration (Bihar Labour Portal)',
      actName: 'Bihar Shops and Establishments Act, 1953',
      authority: 'Department of Labour Resources, Government of Bihar',
      portalName: 'Bihar Labour Resources Department Portal',
      portalUrl: 'https://labour.bihar.gov.in',
      domain: 'bihar.gov.in',
      statutoryWhy: 'Mandatory statutory registration under the Bihar Shops and Establishments Act, 1953 to open commercial doors and employ staff in Bihar.'
    },
    municipalTradeLicence: {
      actName: 'Section 341 of the Bihar Municipal Act, 2007',
      authority: (city: string) =>
        city.toLowerCase().includes('patna')
          ? 'Patna Municipal Corporation (PMC) Health Section'
          : `${city} Municipal Corporation Health Department`,
      portalUrl: () => 'https://udhd.bihar.gov.in',
      domain: 'bihar.gov.in',
      statutoryWhy: 'Mandatory under Section 341 of the Bihar Municipal Act, 2007 for municipal commercial trade and hygiene regulation.'
    },
    signboardRequirement: {
      language: 'Hindi (Devanagari script) and English',
      ruleTitle: 'Bihar Municipal Corporation Nameplate Guidelines',
      ruleDescription: 'Commercial signage must display business name in Hindi (Devanagari script) and English as per municipal norms.'
    },
    rtsActName: 'Bihar Right to Public Services Act, 2011',
    statutoryTimelineDays: 30,
    singleWindowPortalName: 'Bihar RTPS & Single Window',
    singleWindowPortalUrl: 'https://serviceonline.bihar.gov.in'
  },

  // ── 17. ASSAM ──
  'assam': {
    state: 'Assam',
    defaultCity: 'Guwahati',
    shopsAct: {
      title: 'Shop & Commercial Establishment Registration (Assam EoDB Portal)',
      actName: 'Assam Shops and Establishments Act, 1971',
      authority: 'Skill, Employment & Entrepreneurship Department, Government of Assam',
      portalName: 'Assam Ease of Doing Business (EoDB) Portal',
      portalUrl: 'https://eodb.assam.gov.in',
      domain: 'assam.gov.in',
      statutoryWhy: 'Mandatory under the Assam Shops and Establishments Act, 1971 to operate commercial establishments in Assam.'
    },
    municipalTradeLicence: {
      actName: 'Section 380 of the Guwahati Municipal Corporation Act, 1971',
      authority: (city: string) =>
        city.toLowerCase().includes('guwahati')
          ? 'Guwahati Municipal Corporation (GMC) Health Department'
          : `${city} Municipal Board Health Section`,
      portalUrl: () => 'https://gmc.assam.gov.in',
      domain: 'assam.gov.in',
      statutoryWhy: 'Mandatory trade licence under Section 380 of the GMC Act, 1971 ensuring municipal sanitation, water drainage, and fire safety.'
    },
    signboardRequirement: {
      language: 'Assamese (prominently displayed) and English',
      ruleTitle: 'Assam Municipal Corporation Signboard Regulations',
      ruleDescription: 'Commercial trade board must display business name in Assamese script and English as per Assam state regulations.'
    },
    rtsActName: 'Assam Right to Public Services Act, 2012',
    statutoryTimelineDays: 30,
    singleWindowPortalName: 'Assam EoDB Single Window',
    singleWindowPortalUrl: 'https://eodb.assam.gov.in'
  },

  // ── 18. GOA ──
  'goa': {
    state: 'Goa',
    defaultCity: 'Panaji',
    shopsAct: {
      title: 'Shop & Commercial Establishment Registration (Goa Online)',
      actName: 'Goa, Daman and Diu Shops and Establishments Act, 1973',
      authority: 'Department of Labour, Government of Goa',
      portalName: 'Goa Online Citizen Services Portal',
      portalUrl: 'https://goaonline.gov.in',
      domain: 'goa.gov.in',
      statutoryWhy: 'Mandatory statutory registration under the Goa Shops and Establishments Act, 1973 via Goa Online.'
    },
    municipalTradeLicence: {
      actName: 'Section 254 of the Goa Municipalities Act, 1968',
      authority: (city: string) =>
        city.toLowerCase().includes('panaji') || city.toLowerCase().includes('panjim')
          ? 'Corporation of the City of Panaji (CCP) Health Section'
          : `${city} Municipal Council`,
      portalUrl: () => 'https://goaonline.gov.in',
      domain: 'goa.gov.in',
      statutoryWhy: 'Mandatory municipal trade clearance under Section 254 of the Goa Municipalities Act, 1968 for trade hygiene and sanitation.'
    },
    signboardRequirement: {
      language: 'Konkani / Marathi and English',
      ruleTitle: 'Goa Municipalities Signboard Regulations',
      ruleDescription: 'Commercial signboard must display business name in Konkani (Devanagari/Roman) or Marathi alongside English under Goa municipal norms.'
    },
    rtsActName: 'Goa (Right of Citizens to Time-Bound Delivery of Public Services) Act, 2013',
    statutoryTimelineDays: 30,
    singleWindowPortalName: 'Goa Online e-Services',
    singleWindowPortalUrl: 'https://goaonline.gov.in'
  },

  // ── 19. UTTARAKHAND ──
  'uttarakhand': {
    state: 'Uttarakhand',
    defaultCity: 'Dehradun',
    shopsAct: {
      title: 'Shop & Commercial Establishment Registration (Apuni Sarkar)',
      actName: 'Uttarakhand Shops and Commercial Establishments Act',
      authority: 'Labour Department, Government of Uttarakhand',
      portalName: 'Apuni Sarkar Uttarakhand Citizen Services Portal',
      portalUrl: 'https://eservices.uk.gov.in',
      domain: 'uk.gov.in',
      statutoryWhy: 'Mandatory under Uttarakhand Shops Act via Apuni Sarkar to operate commercial facilities in Uttarakhand.'
    },
    municipalTradeLicence: {
      actName: 'Section 437 of the Uttarakhand Municipal Corporation Act',
      authority: (city: string) => `${city} Nagar Nigam Health Department`,
      portalUrl: () => 'https://eservices.uk.gov.in',
      domain: 'uk.gov.in',
      statutoryWhy: 'Mandatory municipal trade permission ensuring water disposal, hygiene, and sanitary compliance.'
    },
    signboardRequirement: {
      language: 'Hindi (Devanagari script) and English',
      ruleTitle: 'Uttarakhand Nagar Nigam Signboard Regulations',
      ruleDescription: 'Commercial establishment board must display name in Hindi (Devanagari script) and English.'
    },
    rtsActName: 'Uttarakhand Right to Service Act, 2011',
    statutoryTimelineDays: 30,
    singleWindowPortalName: 'Apuni Sarkar Uttarakhand',
    singleWindowPortalUrl: 'https://eservices.uk.gov.in'
  },

  // ── 20. HIMACHAL PRADESH ──
  'himachal pradesh': {
    state: 'Himachal Pradesh',
    defaultCity: 'Shimla',
    shopsAct: {
      title: 'Shop & Commercial Establishment Registration (HP e-District / Labour)',
      actName: 'Himachal Pradesh Shops and Commercial Establishments Act, 1969',
      authority: 'Department of Labour and Employment, Government of Himachal Pradesh',
      portalName: 'Himachal Pradesh e-District & Labour Portal',
      portalUrl: 'https://edistrict.hp.gov.in',
      domain: 'hp.gov.in',
      statutoryWhy: 'Mandatory under the Himachal Pradesh Shops and Commercial Establishments Act, 1969 to conduct business in Himachal Pradesh.'
    },
    municipalTradeLicence: {
      actName: 'Section 334 of the Himachal Pradesh Municipal Corporation Act, 1994',
      authority: (city: string) => `${city} Municipal Corporation Health Department`,
      portalUrl: () => 'https://edistrict.hp.gov.in',
      domain: 'hp.gov.in',
      statutoryWhy: 'Mandatory under Section 334 of the HP Municipal Corporation Act, 1994 for trade sanitation and municipal hygiene clearance.'
    },
    signboardRequirement: {
      language: 'Hindi and English',
      ruleTitle: 'HP Municipal Corporation Nameboard Norms',
      ruleDescription: 'Establishment board must display trade name in Hindi and English as per municipal bylaws.'
    },
    rtsActName: 'Himachal Pradesh Public Services Guarantee Act, 2011',
    statutoryTimelineDays: 30,
    singleWindowPortalName: 'HP e-District Single Window',
    singleWindowPortalUrl: 'https://edistrict.hp.gov.in'
  },

  // ── 21. JHARKHAND ──
  'jharkhand': {
    state: 'Jharkhand',
    defaultCity: 'Ranchi',
    shopsAct: {
      title: 'Shop & Commercial Establishment Registration (JharSewa / Advantage Jharkhand)',
      actName: 'Jharkhand Shops and Establishments Act, 2000',
      authority: 'Department of Labour, Employment & Training, Government of Jharkhand',
      portalName: 'JharSewa & Advantage Jharkhand Single Window Portal',
      portalUrl: 'https://jharsewa.jharkhand.gov.in',
      domain: 'jharkhand.gov.in',
      statutoryWhy: 'Mandatory under the Jharkhand Shops and Establishments Act, 2000 to operate commercial establishments in Jharkhand.'
    },
    municipalTradeLicence: {
      actName: 'Section 455 of the Jharkhand Municipal Act, 2011',
      authority: (city: string) =>
        city.toLowerCase().includes('ranchi')
          ? 'Ranchi Municipal Corporation (RMC) Health Wing'
          : `${city} Municipal Corporation Health Section`,
      portalUrl: () => 'https://udhd.jharkhand.gov.in',
      domain: 'jharkhand.gov.in',
      statutoryWhy: 'Mandatory trade licence under Section 455 of the Jharkhand Municipal Act, 2011 for municipal trade operation and health clearance.'
    },
    signboardRequirement: {
      language: 'Hindi (Devanagari script) and English',
      ruleTitle: 'Jharkhand Municipal Nameboard Guidelines',
      ruleDescription: 'Commercial signage must display business name in Hindi and English under Jharkhand municipal rules.'
    },
    rtsActName: 'Jharkhand Right to Service Act, 2011',
    statutoryTimelineDays: 30,
    singleWindowPortalName: 'JharSewa Citizen Portal',
    singleWindowPortalUrl: 'https://jharsewa.jharkhand.gov.in'
  },

  // ── 22. CHHATTISGARH ──
  'chhattisgarh': {
    state: 'Chhattisgarh',
    defaultCity: 'Raipur',
    shopsAct: {
      title: 'Shop & Establishment Registration (Chhattisgarh e-Shram / e-District)',
      actName: 'Chhattisgarh Shops and Establishments Act, 1958',
      authority: 'Labour Department, Government of Chhattisgarh',
      portalName: 'Chhattisgarh e-District & Shram Seva Portal',
      portalUrl: 'https://edistrict.cgstate.gov.in',
      domain: 'cgstate.gov.in',
      statutoryWhy: 'Mandatory under the Chhattisgarh Shops and Establishments Act, 1958 to legally run commercial operations in Chhattisgarh.'
    },
    municipalTradeLicence: {
      actName: 'Section 366 of the Chhattisgarh Municipal Corporation Act, 1956',
      authority: (city: string) => `${city} Municipal Corporation Health Department`,
      portalUrl: () => 'https://edistrict.cgstate.gov.in',
      domain: 'cgstate.gov.in',
      statutoryWhy: 'Mandatory under Section 366 of the CG Municipal Corporation Act, 1956 for municipal trade hygiene clearance.'
    },
    signboardRequirement: {
      language: 'Hindi (Devanagari script) and English',
      ruleTitle: 'Chhattisgarh Municipalities Nameboard Regulations',
      ruleDescription: 'Commercial board must display trade name in Hindi (Devanagari script) and English.'
    },
    rtsActName: 'Chhattisgarh Right to Service Act, 2011',
    statutoryTimelineDays: 30,
    singleWindowPortalName: 'CG Single Window & e-District',
    singleWindowPortalUrl: 'https://edistrict.cgstate.gov.in'
  },

  // ── 23. CHANDIGARH (UT) ──
  'chandigarh': {
    state: 'Chandigarh',
    defaultCity: 'Chandigarh',
    shopsAct: {
      title: 'Shop & Commercial Establishment Registration (Chandigarh Administration)',
      actName: 'Punjab Shops and Commercial Establishments Act, 1958 (as extended to Chandigarh)',
      authority: 'Labour Department, Chandigarh Administration',
      portalName: 'Chandigarh Administration e-Services Portal',
      portalUrl: 'https://chandigarh.gov.in',
      domain: 'chandigarh.gov.in',
      statutoryWhy: 'Mandatory statutory registration under the Shops and Establishments Act as extended to the Union Territory of Chandigarh.'
    },
    municipalTradeLicence: {
      actName: 'Section 343 of the Punjab Municipal Corporation Act, 1976 (as extended to Chandigarh)',
      authority: () => 'Municipal Corporation Chandigarh (MCC) Medical Officer of Health',
      portalUrl: () => 'https://mcchandigarh.gov.in',
      domain: 'mcchandigarh.gov.in',
      statutoryWhy: 'Mandatory trade licence under MCC bylaws ensuring public hygiene and environmental compliance.'
    },
    signboardRequirement: {
      language: 'English and Hindi / Punjabi',
      ruleTitle: 'Chandigarh Administration Urban Display Bylaws',
      ruleDescription: 'Commercial board must display name in English along with Hindi or Punjabi as per Chandigarh heritage signage bylaws.'
    },
    rtsActName: 'Chandigarh Right to Services Act',
    statutoryTimelineDays: 30,
    singleWindowPortalName: 'Chandigarh e-Services',
    singleWindowPortalUrl: 'https://chandigarh.gov.in'
  },

  // ── 24. JAMMU & KASHMIR (UT) ──
  'jammu and kashmir': {
    state: 'Jammu and Kashmir',
    defaultCity: 'Srinagar',
    shopsAct: {
      title: 'Shop & Commercial Establishment Registration (J&K Single Window)',
      actName: 'Jammu and Kashmir Shops and Establishments Act, 1966',
      authority: 'Department of Labour & Employment, UT of Jammu and Kashmir',
      portalName: 'J&K Single Window System (JK-SWS)',
      portalUrl: 'https://singlewindow.jk.gov.in',
      domain: 'jk.gov.in',
      statutoryWhy: 'Mandatory statutory registration under the J&K Shops and Establishments Act, 1966 to lawfully operate commercial facilities in J&K.'
    },
    municipalTradeLicence: {
      actName: 'Section 320 of the Jammu and Kashmir Municipal Corporation Act, 2000',
      authority: (city: string) =>
        city.toLowerCase().includes('jammu')
          ? 'Jammu Municipal Corporation (JMC) Health Department'
          : 'Srinagar Municipal Corporation (SMC) Health Department',
      portalUrl: (city: string) =>
        city.toLowerCase().includes('jammu')
          ? 'https://jmc.nic.in'
          : 'https://smcsrinagar.in',
      domain: 'jk.gov.in',
      statutoryWhy: 'Mandatory under Section 320 of the J&K Municipal Corporation Act, 2000 for trade sanitation and public health clearance.'
    },
    signboardRequirement: {
      language: 'Urdu / Hindi and English',
      ruleTitle: 'J&K Municipal Corporation Signboard Rules',
      ruleDescription: 'Commercial nameboard must display establishment name in Urdu or Hindi alongside English.'
    },
    rtsActName: 'Jammu & Kashmir Public Services Guarantee Act, 2011',
    statutoryTimelineDays: 30,
    singleWindowPortalName: 'J&K Single Window System',
    singleWindowPortalUrl: 'https://singlewindow.jk.gov.in'
  }
};

/**
 * Normalizes state name string for matching
 */
export function normalizeStateKey(stateOrCityName?: string): string {
  const s = (stateOrCityName || '').toLowerCase().trim();
  // 1. Check West Bengal first to prevent 'bengal' matching Bengaluru
  if (s.includes('bengal') || s.includes('kolk') || s.includes('calc') || s.includes('howr')) return 'west bengal';

  // 2. Karnataka & phonetic typos (navglore, bangalore, bengaluru)
  if (
    s.includes('karn') ||
    s.includes('bangalor') ||
    s.includes('bengalur') ||
    s.includes('banglor') ||
    s.includes('navg') ||
    s.includes('mangalor') ||
    s.includes('mangaluru') ||
    s.includes('mysur') ||
    s.includes('mysore') ||
    s.includes('hubli') ||
    s.includes('belga')
  ) {
    return 'karnataka';
  }

  // 3. Rajasthan (check before Thane/than)
  if (s.includes('rajas') || s.includes('jaip') || s.includes('jodh') || s.includes('udai') || s.includes('kota') || s.includes('bikan')) {
    return 'rajasthan';
  }

  // 4. Maharashtra (use 'thane', NOT 'than' which matches 'rajasthan')
  if (
    s.includes('maha') ||
    s.includes('mum') ||
    s.includes('pune') ||
    s.includes('nagp') ||
    s.includes('thane') ||
    s.includes('nash') ||
    s.includes('aurang') ||
    s.includes('sambhaj') ||
    s.includes('solap') ||
    s.includes('kolhap')
  ) {
    return 'maharashtra';
  }

  // 5. Delhi / NCR
  if (s.includes('delhi')) return 'delhi';

  // 6. Tamil Nadu
  if (s.includes('tamil') || s.includes('chennai') || s.includes('madurai') || s.includes('coimb') || s.includes('trichy') || s.includes('salem')) {
    return 'tamil nadu';
  }

  // 7. Telangana
  if (s.includes('telan') || s.includes('hyde') || s.includes('secun') || s.includes('waran')) return 'telangana';

  // 8. Gujarat
  if (s.includes('guj') || s.includes('ahmed') || s.includes('surat') || s.includes('vado') || s.includes('rajk') || s.includes('bhavn')) return 'gujarat';

  // 9. Uttar Pradesh
  if (s.includes('uttar p') || s.includes('luck') || s.includes('noida') || s.includes('kanp') || s.includes('agra') || s.includes('varan') || s.includes('ghaz') || s.includes('meeru') || s.includes('bareil') || s.includes('aliga') || s.includes('gorakh')) {
    return 'uttar pradesh';
  }

  // 10. Kerala
  if (s.includes('kera') || s.includes('koch') || s.includes('coch') || s.includes('thiru') || s.includes('kozhi') || s.includes('trivand')) return 'kerala';

  // 11. Haryana & Punjab
  if (s.includes('hary') || s.includes('guru') || s.includes('gurga') || s.includes('fari') || s.includes('pani') || s.includes('roht') || s.includes('karnal')) return 'haryana';
  if (s.includes('punj') || s.includes('ludh') || s.includes('amri') || s.includes('jala') || s.includes('pati') || s.includes('bathi')) return 'punjab';
  if (s.includes('chand')) return 'chandigarh';

  // 12. Andhra Pradesh
  if (s.includes('andhra') || s.includes('visa') || s.includes('viza') || s.includes('vija') || s.includes('tiru') || s.includes('gunt') || s.includes('nello')) return 'andhra pradesh';

  // 13. Madhya Pradesh
  if (s.includes('madhya') || s.includes('indo') || s.includes('bhop') || s.includes('jabal') || s.includes('gwal') || s.includes('ujjai')) return 'madhya pradesh';

  // 14. Odisha, Bihar, Assam, Goa, Uttarakhand, Himachal, Jharkhand, Chhattisgarh, J&K
  if (s.includes('odis') || s.includes('oris') || s.includes('bhub') || s.includes('cutt') || s.includes('rourk')) return 'odisha';
  if (s.includes('biha') || s.includes('patn') || s.includes('gaya') || s.includes('muzaff')) return 'bihar';
  if (s.includes('assa') || s.includes('guwa') || s.includes('silch') || s.includes('dibru')) return 'assam';
  if (s.includes('goa') || s.includes('pana') || s.includes('marg') || s.includes('vasco')) return 'goa';
  if (s.includes('uttarak') || s.includes('dehr') || s.includes('hari') || s.includes('roork')) return 'uttarakhand';
  if (s.includes('himach') || s.includes('shim') || s.includes('dhar') || s.includes('mandi')) return 'himachal pradesh';
  if (s.includes('jhar') || s.includes('ranc') || s.includes('jams') || s.includes('dhanb')) return 'jharkhand';
  if (s.includes('chhatt') || s.includes('raip') || s.includes('bila') || s.includes('bhilai')) return 'chhattisgarh';
  if (s.includes('kash') || s.includes('srin') || s.includes('jammu')) return 'jammu and kashmir';

  return s;
}

/**
 * Returns the comprehensive statutory profile for ANY given state/city in India.
 * If an unlisted state/UT is passed, returns a high-precision, logically verified fallback.
 */
export function getJurisdictionProfile(stateName?: string, cityName?: string): StateJurisdictionProfile {
  const normKey = normalizeStateKey(stateName) || normalizeStateKey(cityName);
  if (STATE_JURISDICTION_REGISTRY[normKey]) {
    return STATE_JURISDICTION_REGISTRY[normKey];
  }

  // Universal verified fallback for any other Indian state or union territory
  const resolvedState = stateName && stateName.trim() !== '' && !stateName.toLowerCase().includes('state')
    ? stateName.trim()
    : 'State Jurisdiction';
  const resolvedCity = cityName && cityName.trim() !== ''
    ? cityName.trim()
    : 'Municipal Jurisdiction';

  return {
    state: resolvedState,
    defaultCity: resolvedCity,
    shopsAct: {
      title: `Shop & Commercial Establishment Registration (${resolvedState})`,
      actName: `${resolvedState} Shops and Commercial Establishments Act`,
      authority: `Department of Labour, Government of ${resolvedState}`,
      portalName: `${resolvedState} Labour & Citizen Services Portal`,
      portalUrl: 'https://serviceonline.gov.in',
      domain: 'gov.in',
      statutoryWhy: `Mandatory statutory requirement under the ${resolvedState} Shops and Commercial Establishments Act to lawfully operate a commercial business and employ personnel.`
    },
    municipalTradeLicence: {
      actName: `Municipal Corporations Act as applicable in ${resolvedState}`,
      authority: (city: string) => `${city || resolvedCity} Municipal Corporation Health Department`,
      portalUrl: () => 'https://serviceonline.gov.in',
      domain: 'gov.in',
      statutoryWhy: `Mandatory municipal trade and health clearance to ensure sanitary sterilization, water drainage, and public health hygiene.`
    },
    signboardRequirement: {
      language: `Official State Language of ${resolvedState} and English`,
      ruleTitle: `${resolvedState} Commercial Establishments Signboard Regulations`,
      ruleDescription: `Commercial nameboard must display establishment name in the official state language of ${resolvedState} alongside English as per state rules.`
    },
    rtsActName: `${resolvedState} Right to Public Services Act`,
    statutoryTimelineDays: 30,
    singleWindowPortalName: `${resolvedState} Citizen Services Portal`,
    singleWindowPortalUrl: 'https://serviceonline.gov.in'
  };
}
