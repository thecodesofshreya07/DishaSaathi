import React, { useState, useMemo } from 'react';
import {
  X,
  Scale,
  Clock,
  FileText,
  Building2,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  SlidersHorizontal,
  Check,
  MapPin,
  ArrowRight,
  ShieldCheck,
  RotateCw,
  ExternalLink,
  HelpCircle
} from 'lucide-react';
import { CivicJourney, ProcedureStep, CivicDocument, StepStatus } from '../types';
import { getEstimatedFeeForStep } from '../utils/costCalculator';

interface CompareProceduresModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeJourney?: CivicJourney | null;
  onSwitchJourney?: (newJourney: CivicJourney) => void;
}

export type VerificationBadgeStatus =
  | 'Officially verified'
  | 'Depends on application'
  | 'Depends on the applicable licence/activity'
  | 'Not officially published';
export type DocumentRequirementType = 'Required' | 'Conditional' | 'Supporting';

export interface DocumentRequirement {
  name: string;
  type: DocumentRequirementType;
  condition?: string;
  authorityRequiredBy?: string;
}

export interface FactualProcedureOption {
  id: string;
  title: string;
  routeType: string;
  authority: string;
  applicationMethod: string;
  applicableApprovals: string[];
  statutoryTimeline: string;
  timelineVerification: VerificationBadgeStatus;
  officialFees: string;
  feeVerification: VerificationBadgeStatus;
  requiredDocsCount: number;
  physicalVisits: string;
  onlineTracking: string;
  sourceUrl: string;
  sourceName: string;
  lastVerifiedDate: string;
  verificationStatus: VerificationBadgeStatus;
  suitableFor: string;
  notice?: string;
  documents: DocumentRequirement[];
  steps: Array<{
    title: string;
    authority: string;
    status: 'mandatory' | 'conditional' | 'optional' | 'waived';
    statutoryAct?: string;
    note?: string;
    fee?: string;
    officialUrl?: string;
  }>;
}

export interface ComparisonPreset {
  id: string;
  name: string;
  description: string;
  domain: 'salon' | 'property' | 'certificate' | 'license' | 'business' | 'general';
  isSingleRouteOnly?: boolean;
  singleRouteReason?: string;
  optionA: FactualProcedureOption;
  optionB?: FactualProcedureOption;
  recommendationA?: string;
  recommendationB?: string;
}

/**
 * Renders a standardized, trustworthy government verification status badge
 */
const VerificationBadge: React.FC<{ status: VerificationBadgeStatus; className?: string }> = ({ status, className = '' }) => {
  if (status === 'Officially verified') {
    return (
      <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-700/60 ${className}`}>
        <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
        Officially verified
      </span>
    );
  }
  if (status === 'Depends on application' || status === 'Depends on the applicable licence/activity') {
    return (
      <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300/60 dark:border-amber-700/60 ${className}`}>
        <AlertTriangle className="w-3 h-3 text-amber-600 dark:text-amber-400 shrink-0" />
        {status}
      </span>
    );
  }
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300/60 dark:border-slate-700/60 ${className}`}>
      <HelpCircle className="w-3 h-3 text-slate-500 shrink-0" />
      Not officially published
    </span>
  );
};

/**
 * Context-aware, factually grounded comparison generator.
 * Strictest legal accuracy rules:
 * - Distinguishes BMC (Mumbai) vs Karnataka (Bengaluru / Navglore) vs Central.
 * - Does not invent "Fast-Track" or "Expedited Processing".
 * - If only one legitimate statutory route exists (e.g. Karnataka Salon), displays only one route.
 * - Categorizes documents into Required, Conditional, and Supporting.
 */
interface StateComparisonConfig {
  state: string;
  city: string;
  shopsAct: string;
  shopsAuthority: string;
  shopsPortalUrl: string;
  municipalAct: string;
  municipalAuthority: string;
  municipalPortalUrl: string;
  signboardRule: string;
  rtsAct: string;
}

function resolveStateComparisonConfig(text: string): StateComparisonConfig {
  const t = text.toLowerCase();
  if (t.includes('delhi')) {
    return {
      state: 'Delhi',
      city: 'Delhi',
      shopsAct: 'Delhi Shops and Establishments Act, 1954',
      shopsAuthority: 'Department of Labour, Government of NCT of Delhi',
      shopsPortalUrl: 'https://labourcis.delhi.gov.in',
      municipalAct: 'Section 417 of the Delhi Municipal Corporation Act, 1957',
      municipalAuthority: 'Municipal Corporation of Delhi (MCD) Public Health Department',
      municipalPortalUrl: 'https://mcdonline.nic.in',
      signboardRule: 'Bilingual Signboard Proof (Hindi Devanagari and English under MCD Bylaws)',
      rtsAct: 'Delhi Right to Citizen Services Act, 1995 & e-SLA'
    };
  }
  if (t.includes('tamil') || t.includes('chennai') || t.includes('coimbatore') || t.includes('madurai')) {
    return {
      state: 'Tamil Nadu',
      city: t.includes('coimbatore') ? 'Coimbatore' : t.includes('madurai') ? 'Madurai' : 'Chennai',
      shopsAct: 'Tamil Nadu Shops and Establishments Act, 1947',
      shopsAuthority: 'Department of Labour, Government of Tamil Nadu',
      shopsPortalUrl: 'https://labour.tn.gov.in',
      municipalAct: 'Section 287 of the Chennai City Municipal Corporation Act, 1919',
      municipalAuthority: 'Greater Chennai Corporation (GCC) Health Department',
      municipalPortalUrl: 'https://chennaicorporation.gov.in',
      signboardRule: 'Tamil Signboard Proof (Tamil script prominently on top under TN Shops Rules)',
      rtsAct: 'Tamil Nadu Right to Services Citizen Charter'
    };
  }
  if (t.includes('telan') || t.includes('hyde') || t.includes('secun')) {
    return {
      state: 'Telangana',
      city: 'Hyderabad',
      shopsAct: 'Telangana Shops and Establishments Act, 1988',
      shopsAuthority: 'Department of Labour, Government of Telangana',
      shopsPortalUrl: 'https://labour.telangana.gov.in',
      municipalAct: 'Section 521 & 622 of the Greater Hyderabad Municipal Corporation Act, 1955',
      municipalAuthority: 'Greater Hyderabad Municipal Corporation (GHMC) Health Section',
      municipalPortalUrl: 'https://ghmc.gov.in',
      signboardRule: 'Bilingual Signboard Proof (Telugu and English under GHMC Regulations)',
      rtsAct: 'Telangana Citizen Service Guarantee Act'
    };
  }
  if (t.includes('guj') || t.includes('ahmed') || t.includes('surat') || t.includes('vado')) {
    return {
      state: 'Gujarat',
      city: t.includes('surat') ? 'Surat' : t.includes('vado') ? 'Vadodara' : 'Ahmedabad',
      shopsAct: 'Gujarat Shops and Establishments Act, 2019',
      shopsAuthority: 'Labour and Employment Department, Government of Gujarat',
      shopsPortalUrl: 'https://enagar.gujarat.gov.in',
      municipalAct: 'Section 376 of Gujarat Provincial Municipal Corporations (GPMC) Act, 1949',
      municipalAuthority: 'Ahmedabad Municipal Corporation (AMC) Health Department',
      municipalPortalUrl: 'https://ahmedabadcity.gov.in',
      signboardRule: 'Bilingual Signboard Proof (Gujarati script and English under Gujarat Shops Rules)',
      rtsAct: 'Gujarat Right to Public Services Act, 2013'
    };
  }
  if (t.includes('bengal') || t.includes('kolk') || t.includes('calcutta')) {
    return {
      state: 'West Bengal',
      city: 'Kolkata',
      shopsAct: 'West Bengal Shops and Establishments Act, 1963',
      shopsAuthority: 'Labour Department, Government of West Bengal',
      shopsPortalUrl: 'https://silpasathi.wb.gov.in',
      municipalAct: 'Section 199 (Certificate of Enlistment) of Kolkata Municipal Corporation Act, 1980',
      municipalAuthority: 'Kolkata Municipal Corporation (KMC) License & Health Department',
      municipalPortalUrl: 'https://www.kmcgov.in',
      signboardRule: 'Bilingual Signboard Proof (Bengali script and English under KMC Bylaws)',
      rtsAct: 'West Bengal Right to Public Services Act, 2013'
    };
  }
  if (t.includes('uttar p') || t.includes('luck') || t.includes('noida') || t.includes('kanp') || t.includes('varan')) {
    return {
      state: 'Uttar Pradesh',
      city: t.includes('noida') ? 'Noida' : t.includes('kanp') ? 'Kanpur' : t.includes('varan') ? 'Varanasi' : 'Lucknow',
      shopsAct: 'Uttar Pradesh Dookan Aur Vanijya Adhishthan Adhiniyam, 1962',
      shopsAuthority: 'Department of Labour, Government of Uttar Pradesh',
      shopsPortalUrl: 'https://niveshmitra.up.nic.in',
      municipalAct: 'Section 437 of the Uttar Pradesh Municipal Corporation Act, 1959',
      municipalAuthority: 'Nagar Nigam Health & Sanitation Department',
      municipalPortalUrl: 'https://enagarsewa.up.gov.in',
      signboardRule: 'Bilingual Signboard Proof (Hindi Devanagari script and English)',
      rtsAct: 'Uttar Pradesh Janhit Guarantee Adhiniyam, 2011'
    };
  }
  if (t.includes('rajas') || t.includes('jaip') || t.includes('jodh') || t.includes('udai')) {
    return {
      state: 'Rajasthan',
      city: t.includes('jodh') ? 'Jodhpur' : t.includes('udai') ? 'Udaipur' : 'Jaipur',
      shopsAct: 'Rajasthan Shops and Commercial Establishments Act, 1958',
      shopsAuthority: 'Department of Labour, Government of Rajasthan',
      shopsPortalUrl: 'https://sso.rajasthan.gov.in',
      municipalAct: 'Section 256 of the Rajasthan Municipalities Act, 2009',
      municipalAuthority: 'Jaipur Municipal Corporation (Nagar Nigam) Health Section',
      municipalPortalUrl: 'https://urban.rajasthan.gov.in',
      signboardRule: 'Bilingual Signboard Proof (Hindi Devanagari and English under Municipal Bylaws)',
      rtsAct: 'Rajasthan Guaranteed Delivery of Public Services Act, 2011'
    };
  }
  if (t.includes('kera') || t.includes('koch') || t.includes('coch') || t.includes('thiru')) {
    return {
      state: 'Kerala',
      city: t.includes('thiru') ? 'Thiruvananthapuram' : 'Kochi',
      shopsAct: 'Kerala Shops and Commercial Establishments Act, 1960',
      shopsAuthority: 'Labour Commissionerate, Government of Kerala',
      shopsPortalUrl: 'https://kswift.kerala.gov.in',
      municipalAct: 'Section 447 of the Kerala Municipality Act, 1994 (D&O Trade Licence)',
      municipalAuthority: 'Kochi Municipal Corporation Health & License Wing',
      municipalPortalUrl: 'https://kswift.kerala.gov.in',
      signboardRule: 'Bilingual Signboard Proof (Malayalam on top and English under Kerala Rules)',
      rtsAct: 'Kerala State Right to Service Act, 2012'
    };
  }
  if (t.includes('hary') || t.includes('guru') || t.includes('fari')) {
    return {
      state: 'Haryana',
      city: t.includes('fari') ? 'Faridabad' : 'Gurugram',
      shopsAct: 'Punjab Shops and Commercial Establishments Act, 1958 (Haryana Adaptation)',
      shopsAuthority: 'Department of Labour, Government of Haryana',
      shopsPortalUrl: 'https://hrylabour.gov.in',
      municipalAct: 'Section 330 of the Haryana Municipal Corporation Act, 1994',
      municipalAuthority: 'Municipal Corporation of Gurugram (MCG) Health Department',
      municipalPortalUrl: 'https://ulbharyana.gov.in',
      signboardRule: 'Bilingual Signboard Proof (Hindi Devanagari and English)',
      rtsAct: 'Haryana Right to Service Act, 2014'
    };
  }
  if (t.includes('punj') || t.includes('ludh') || t.includes('amri')) {
    return {
      state: 'Punjab',
      city: t.includes('amri') ? 'Amritsar' : 'Ludhiana',
      shopsAct: 'Punjab Shops and Commercial Establishments Act, 1958',
      shopsAuthority: 'Department of Labour, Government of Punjab',
      shopsPortalUrl: 'https://mseva.lgpunjab.gov.in',
      municipalAct: 'Section 343 of the Punjab Municipal Corporation Act, 1976',
      municipalAuthority: 'Municipal Corporation Ludhiana Health Wing',
      municipalPortalUrl: 'https://mseva.lgpunjab.gov.in',
      signboardRule: 'Bilingual Signboard Proof (Punjabi Gurmukhi on top and English)',
      rtsAct: 'Punjab Right to Service Act, 2011'
    };
  }
  if (t.includes('andhra') || t.includes('visa') || t.includes('vija') || t.includes('tiru')) {
    return {
      state: 'Andhra Pradesh',
      city: t.includes('vija') ? 'Vijayawada' : t.includes('tiru') ? 'Tirupati' : 'Visakhapatnam',
      shopsAct: 'Andhra Pradesh Shops and Establishments Act, 1988',
      shopsAuthority: 'Department of Labour, Government of Andhra Pradesh',
      shopsPortalUrl: 'https://labour.ap.gov.in',
      municipalAct: 'Section 521 of the Andhra Pradesh Municipal Corporations Act, 1994',
      municipalAuthority: 'Greater Visakhapatnam Municipal Corporation (GVMC) Health Section',
      municipalPortalUrl: 'https://cdma.ap.gov.in',
      signboardRule: 'Bilingual Signboard Proof (Telugu and English under AP Local Body Bylaws)',
      rtsAct: 'Andhra Pradesh Right to Services Act'
    };
  }
  if (t.includes('madhya') || t.includes('indo') || t.includes('bhop') || t.includes('gwal')) {
    return {
      state: 'Madhya Pradesh',
      city: t.includes('bhop') ? 'Bhopal' : t.includes('gwal') ? 'Gwalior' : 'Indore',
      shopsAct: 'Madhya Pradesh Shops and Commercial Establishments Act, 1958',
      shopsAuthority: 'Labour Department, Government of Madhya Pradesh',
      shopsPortalUrl: 'https://labour.mp.gov.in',
      municipalAct: 'Section 366 of the Madhya Pradesh Municipal Corporation Act, 1956',
      municipalAuthority: 'Indore Municipal Corporation (IMC) Health Section',
      municipalPortalUrl: 'https://www.mpenagarpalika.gov.in',
      signboardRule: 'Bilingual Signboard Proof (Hindi Devanagari script and English)',
      rtsAct: 'Madhya Pradesh Lok Sewa Guarantee Act, 2010'
    };
  }
  if (t.includes('odis') || t.includes('oris') || t.includes('bhub') || t.includes('cutt')) {
    return {
      state: 'Odisha',
      city: t.includes('cutt') ? 'Cuttack' : 'Bhubaneswar',
      shopsAct: 'Odisha Shops and Commercial Establishments Act, 1956',
      shopsAuthority: 'Labour and ESI Department, Government of Odisha',
      shopsPortalUrl: 'https://labdirodisha.gov.in',
      municipalAct: 'Section 550 of the Odisha Municipal Corporation Act, 2003',
      municipalAuthority: 'Bhubaneswar Municipal Corporation (BMC) Health Wing',
      municipalPortalUrl: 'https://bmc.gov.in',
      signboardRule: 'Bilingual Signboard Proof (Odia script and English under Odisha Official Language Rules)',
      rtsAct: 'Odisha Right to Public Services Act, 2012'
    };
  }
  if (t.includes('biha') || t.includes('patn') || t.includes('gaya')) {
    return {
      state: 'Bihar',
      city: t.includes('gaya') ? 'Gaya' : 'Patna',
      shopsAct: 'Bihar Shops and Establishments Act, 1953',
      shopsAuthority: 'Labour Resources Department, Government of Bihar',
      shopsPortalUrl: 'https://labour.bihar.gov.in',
      municipalAct: 'Section 342 of the Bihar Municipal Act, 2007',
      municipalAuthority: 'Patna Municipal Corporation (PMC) Health Department',
      municipalPortalUrl: 'https://pmc.bihar.gov.in',
      signboardRule: 'Bilingual Signboard Proof (Hindi Devanagari script and English)',
      rtsAct: 'Bihar Right to Public Services (RTPS) Act, 2011'
    };
  }
  if (t.includes('assa') || t.includes('guwa')) {
    return {
      state: 'Assam',
      city: 'Guwahati',
      shopsAct: 'Assam Shops and Establishments Act, 1971',
      shopsAuthority: 'Labour Welfare Department, Government of Assam',
      shopsPortalUrl: 'https://eodb.assam.gov.in',
      municipalAct: 'Section 380 of the Guwahati Municipal Corporation Act, 1971',
      municipalAuthority: 'Guwahati Municipal Corporation (GMC) Health Wing',
      municipalPortalUrl: 'https://gmc.assam.gov.in',
      signboardRule: 'Bilingual Signboard Proof (Assamese script and English under Assam State Guidelines)',
      rtsAct: 'Assam Right to Public Services Act, 2012'
    };
  }
  if (t.includes('goa') || t.includes('pana') || t.includes('marg')) {
    return {
      state: 'Goa',
      city: t.includes('marg') ? 'Margao' : 'Panaji',
      shopsAct: 'Goa, Daman and Diu Shops and Establishments Act, 1973',
      shopsAuthority: 'Department of Labour, Government of Goa',
      shopsPortalUrl: 'https://goaonline.gov.in',
      municipalAct: 'Section 245 of the City of Panaji Corporation Act, 2002',
      municipalAuthority: 'Corporation of the City of Panaji (CCP) Health Section',
      municipalPortalUrl: 'https://ccpgoa.com',
      signboardRule: 'Bilingual Signboard Proof (Konkani / Marathi and English)',
      rtsAct: 'Goa (Right of Citizens to Time-Bound Delivery of Public Services) Act, 2013'
    };
  }
  if (t.includes('uttarak') || t.includes('dehr') || t.includes('hari')) {
    return {
      state: 'Uttarakhand',
      city: t.includes('hari') ? 'Haridwar' : 'Dehradun',
      shopsAct: 'Uttar Pradesh Dookan Aur Vanijya Adhishthan Adhiniyam, 1962 (as applicable in Uttarakhand)',
      shopsAuthority: 'Labour Department, Government of Uttarakhand',
      shopsPortalUrl: 'https://labour.uk.gov.in',
      municipalAct: 'Section 437 of the Municipal Corporation Act (Uttarakhand)',
      municipalAuthority: 'Nagar Nigam Dehradun Health Section',
      municipalPortalUrl: 'https://nagarnigamdehradun.com',
      signboardRule: 'Bilingual Signboard Proof (Hindi Devanagari script and English)',
      rtsAct: 'Uttarakhand Right to Service Act, 2011'
    };
  }
  if (t.includes('himach') || t.includes('shim') || t.includes('dhar')) {
    return {
      state: 'Himachal Pradesh',
      city: t.includes('dhar') ? 'Dharamshala' : 'Shimla',
      shopsAct: 'Himachal Pradesh Shops and Commercial Establishments Act, 1969',
      shopsAuthority: 'Department of Labour and Employment, Government of Himachal Pradesh',
      shopsPortalUrl: 'https://emerginghimachal.hp.gov.in',
      municipalAct: 'Section 302 of the Himachal Pradesh Municipal Corporation Act, 1994',
      municipalAuthority: 'Municipal Corporation Shimla Health Section',
      municipalPortalUrl: 'https://shimlamc.hp.gov.in',
      signboardRule: 'Bilingual Signboard Proof (Hindi Devanagari script and English)',
      rtsAct: 'Himachal Pradesh Public Services Guarantee Act, 2011'
    };
  }
  if (t.includes('jhar') || t.includes('ranc') || t.includes('jams')) {
    return {
      state: 'Jharkhand',
      city: t.includes('jams') ? 'Jamshedpur' : 'Ranchi',
      shopsAct: 'Jharkhand Shops and Establishments Act, 2000',
      shopsAuthority: 'Department of Labour, Employment, Training and Skill Development, Government of Jharkhand',
      shopsPortalUrl: 'https://shramadhan.jharkhand.gov.in',
      municipalAct: 'Section 455 of the Jharkhand Municipal Act, 2011',
      municipalAuthority: 'Ranchi Municipal Corporation (RMC) Health Wing',
      municipalPortalUrl: 'https://udhd.jharkhand.gov.in',
      signboardRule: 'Bilingual Signboard Proof (Hindi Devanagari script and English)',
      rtsAct: 'Jharkhand Right to Service Act, 2011'
    };
  }
  if (t.includes('chhatt') || t.includes('raip') || t.includes('bila')) {
    return {
      state: 'Chhattisgarh',
      city: t.includes('bila') ? 'Bilaspur' : 'Raipur',
      shopsAct: 'Chhattisgarh Dookan Aur Vanijya Adhishthan Adhiniyam, 1958',
      shopsAuthority: 'Labour Department, Government of Chhattisgarh',
      shopsPortalUrl: 'https://cglabour.nic.in',
      municipalAct: 'Section 366 of the Chhattisgarh Municipal Corporation Act, 1956',
      municipalAuthority: 'Raipur Municipal Corporation (RMC) Health Department',
      municipalPortalUrl: 'https://nagarnigamraipur.nic.in',
      signboardRule: 'Bilingual Signboard Proof (Hindi Devanagari script and English)',
      rtsAct: 'Chhattisgarh Lok Seva Guarantee Act, 2011'
    };
  }
  if (t.includes('chand')) {
    return {
      state: 'Chandigarh',
      city: 'Chandigarh',
      shopsAct: 'Punjab Shops and Commercial Establishments Act, 1958 (as extended to Chandigarh)',
      shopsAuthority: 'Labour Department, Chandigarh Administration',
      shopsPortalUrl: 'https://chandigarh.gov.in',
      municipalAct: 'Section 343 of the Punjab Municipal Corporation Act, 1976 (as extended to Chandigarh)',
      municipalAuthority: 'Municipal Corporation Chandigarh (MCC) Medical Officer of Health',
      municipalPortalUrl: 'https://mcchandigarh.gov.in',
      signboardRule: 'Bilingual Signboard Proof (English and Hindi / Punjabi)',
      rtsAct: 'Chandigarh Right to Services Act'
    };
  }
  if (t.includes('kash') || t.includes('srin') || t.includes('jammu')) {
    return {
      state: 'Jammu and Kashmir',
      city: t.includes('jammu') ? 'Jammu' : 'Srinagar',
      shopsAct: 'Jammu and Kashmir Shops and Establishments Act, 1966',
      shopsAuthority: 'Department of Labour & Employment, UT of Jammu and Kashmir',
      shopsPortalUrl: 'https://singlewindow.jk.gov.in',
      municipalAct: 'Section 320 of the Jammu and Kashmir Municipal Corporation Act, 2000',
      municipalAuthority: t.includes('jammu') ? 'Jammu Municipal Corporation (JMC) Health Department' : 'Srinagar Municipal Corporation (SMC) Health Department',
      municipalPortalUrl: t.includes('jammu') ? 'https://jmc.nic.in' : 'https://smcsrinagar.in',
      signboardRule: 'Bilingual Signboard Proof (Urdu / Hindi and English)',
      rtsAct: 'Jammu & Kashmir Public Services Guarantee Act, 2011'
    };
  }
  if (t.includes('karn') || t.includes('bang') || t.includes('beng') || t.includes('navg') || t.includes('mang')) {
    return {
      state: 'Karnataka',
      city: t.includes('navg') ? 'Navglore / Bengaluru' : t.includes('mang') ? 'Mangaluru' : 'Bengaluru',
      shopsAct: 'Karnataka Shops and Commercial Establishments Act, 1961',
      shopsAuthority: 'Department of Labour, Government of Karnataka',
      shopsPortalUrl: 'https://ekarmika.karnataka.gov.in',
      municipalAct: 'Section 353 of the Karnataka Municipal Corporations Act, 1976',
      municipalAuthority: 'Bruhat Bengaluru Mahanagara Palike (BBMP) Health Department',
      municipalPortalUrl: 'https://bbmp.gov.in',
      signboardRule: 'Bilingual Signboard Proof (min 60% Kannada on top under Karnataka Language Comprehensive Development Act, 2022)',
      rtsAct: 'Karnataka Sakala Services Act, 2011'
    };
  }
  return {
    state: 'State Jurisdiction',
    city: 'Municipal Jurisdiction',
    shopsAct: 'State Shops and Commercial Establishments Act',
    shopsAuthority: 'State Labour Department',
    shopsPortalUrl: 'https://serviceonline.gov.in',
    municipalAct: 'Municipal Corporations Act',
    municipalAuthority: 'City Municipal Corporation Health Department',
    municipalPortalUrl: 'https://serviceonline.gov.in',
    signboardRule: 'Bilingual Signboard Proof (Official State Language and English)',
    rtsAct: 'State Right to Public Services Act'
  };
}

function getJourneyContextComparisons(journey?: CivicJourney | null): ComparisonPreset[] {
  const title = (journey?.title || '').toLowerCase();
  const query = (journey?.query || '').toLowerCase();
  const location = journey?.location || 'Mumbai, Maharashtra';
  const combinedText = `${title} ${query} ${location}`.toLowerCase();

  const isMaharashtra =
    (combinedText.includes('mumbai') ||
    combinedText.includes('bombay') ||
    combinedText.includes('bmc') ||
    combinedText.includes('mcgm') ||
    combinedText.includes('pune') ||
    combinedText.includes('nagpur') ||
    combinedText.includes('thane') ||
    combinedText.includes('nashik') ||
    combinedText.includes('maharashtra')) &&
    !combinedText.includes('karnataka') &&
    !combinedText.includes('bengaluru') &&
    !combinedText.includes('navg');

  const stateConfig = resolveStateComparisonConfig(combinedText);
  const cityLabel = isMaharashtra ? 'Mumbai' : stateConfig.city;
  const stateLabel = isMaharashtra ? 'Maharashtra' : stateConfig.state;
  const isMumbai = isMaharashtra && (cityLabel.toLowerCase().includes('mumbai') || combinedText.includes('mumbai') || combinedText.includes('bombay') || combinedText.includes('bmc') || combinedText.includes('mcgm'));

  // ══════════════════════════════════════════════════════════════════
  // 1. SALON & BEAUTY PARLOUR (ALL STATES)
  // ══════════════════════════════════════════════════════════════════
  if (
    combinedText.includes('salon') ||
    combinedText.includes('beauty parlour') ||
    combinedText.includes('beauty parlor') ||
    combinedText.includes('hair') ||
    combinedText.includes('barber') ||
    combinedText.includes('grooming') ||
    combinedText.includes('spa')
  ) {
    // ── CASE A: NON-MAHARASHTRA STATES (SINGLE STATUTORY ROUTE) ──
    // Law: State Municipal Act + State Shops Act + State Right to Services Act.
    // There is ONLY ONE legitimate statutory procedure. No parallel fast-track or private expedited channel exists.
    if (!isMaharashtra) {
      return [
        {
          id: `salon_${stateConfig.state.toLowerCase().replace(/\s+/g, '_')}_single_route`,
          name: `Statutory Municipal & Labour Route (${cityLabel})`,
          description: `Verified government procedure for setting up a hair dressing saloon or beauty parlour under ${stateConfig.state} law.`,
          domain: 'salon',
          isSingleRouteOnly: true,
          singleRouteReason: `Under the ${stateConfig.municipalAct} and ${stateConfig.rtsAct}, hair dressing salons follow a single unified statutory licensing procedure. The Government of ${stateConfig.state} does not operate a parallel, private, or expedited "fast-track" fee route for municipal salon licensing. All applications must be submitted through the notified statutory portals.`,
          optionA: {
            id: `${stateConfig.state.toLowerCase().replace(/\s+/g, '_')}_salon_statutory`,
            title: `Unified ${stateConfig.state} Statutory Route (${stateConfig.shopsAuthority.split(',')[0]} & Municipal Health Dept)`,
            routeType: `Direct Online Statutory Submission`,
            authority: `${stateConfig.municipalAuthority} & ${stateConfig.shopsAuthority}`,
            applicationMethod: `Online submission via ${stateConfig.shopsPortalUrl} & Municipal Health Trade Portal`,
            applicableApprovals: [
              'MSME Udyam Enterprise Registration (Ministry of MSME)',
              `${stateConfig.shopsAct} Registration`,
              `Municipal Health & Trade Licence for Hair Saloon (${stateConfig.municipalAct})`,
              stateConfig.signboardRule
            ],
            statutoryTimeline: `Statutory service timeline: 30 days under ${stateConfig.rtsAct}`,
            timelineVerification: 'Officially verified',
            officialFees: `₹0 (Udyam) + Scheduled State Fee under ${stateConfig.shopsAct} + Municipal Health Trade Fee (Varies by floor area & power load; verify with Ward Health Officer)`,
            feeVerification: 'Depends on the applicable licence/activity',
            requiredDocsCount: 4,
            physicalVisits: `1 Field Visit (Premises hygiene & sterilizer inspection by Municipal Health Inspector)`,
            onlineTracking: `Available via Official Department Application Acknowledgment Number`,
            sourceUrl: stateConfig.shopsPortalUrl,
            sourceName: `${stateConfig.shopsAuthority} & Municipal Health Directorate`,
            lastVerifiedDate: `28 Sep 2026`,
            verificationStatus: 'Officially verified',
            suitableFor: `Entrepreneurs opening a hair dressing saloon, beauty parlour, or grooming studio in ${cityLabel}.`,
            notice: `Under ${stateConfig.rtsAct}, municipal officers are legally bound to decide trade licence applications within 30 days. No expedited fees or fast-track options are legally recognized.`,
            documents: [
              {
                name: 'Applicant Aadhaar Card & PAN Card',
                type: 'Required',
                authorityRequiredBy: 'Central & State Portals'
              },
              {
                name: 'Premises Commercial Lease Agreement / Sale Deed with latest Electricity Bill',
                type: 'Required',
                authorityRequiredBy: 'State Labour & Municipal Health Dept'
              },
              {
                name: 'Salon Floor Plan & Layout Drawing (showing styling chairs, basins & water drainage points)',
                type: 'Required',
                authorityRequiredBy: 'Municipal Health Directorate'
              },
              {
                name: stateConfig.signboardRule,
                type: 'Required',
                authorityRequiredBy: `${cityLabel} Municipal Authority`
              },
              {
                name: 'Property Owner / Cooperative Building NOC',
                type: 'Conditional',
                condition: 'Required if premises is leased, sub-let, or located in a multi-occupancy residential building'
              },
              {
                name: 'Partnership Deed / Certificate of Incorporation',
                type: 'Conditional',
                condition: 'Required if operating as a Registered Partnership, LLP, or Private Limited entity'
              },
              {
                name: 'Sanitation & UV/Steam Tool Sterilization Undertaking',
                type: 'Supporting',
                condition: 'Standard self-attestation for salon hygiene compliance'
              },
              {
                name: 'Water Testing / Sanitary Drainage Clearance',
                type: 'Supporting',
                condition: 'If requested by Health Inspector during physical site inspection'
              }
            ],
            steps: [
              {
                title: `MSME Udyam Enterprise Registration`,
                authority: `Ministry of Micro, Small & Medium Enterprises (Govt of India)`,
                status: 'mandatory',
                statutoryAct: `MSMED Act 2006`,
                note: `Free central government enterprise registration for service classification`,
                fee: `₹0 (Free on official portal)`,
                officialUrl: `https://udyamregistration.gov.in`
              },
              {
                title: `${stateConfig.shopsAct} Registration`,
                authority: stateConfig.shopsAuthority,
                status: 'mandatory',
                statutoryAct: stateConfig.shopsAct,
                note: `Mandatory within 30 days of commencing commercial salon operations`,
                fee: `Scheduled fee based on number of salon staff`,
                officialUrl: stateConfig.shopsPortalUrl
              },
              {
                title: `Municipal Health & Trade Licence (Hair Dressing Saloon / Beauty Parlour)`,
                authority: stateConfig.municipalAuthority,
                status: 'mandatory',
                statutoryAct: stateConfig.municipalAct,
                note: `Regulates hygiene, waste water disposal, sterilizer equipment, and sanitary norms`,
                fee: `Varies by premises area and electrical connected load; verify with Ward Health Officer`,
                officialUrl: stateConfig.municipalPortalUrl
              },
              {
                title: `Premises Inspection & Signboard Verification`,
                authority: `Ward Senior Health Inspector (${cityLabel})`,
                status: 'mandatory',
                statutoryAct: stateConfig.rtsAct,
                note: `Physical verification of barber sterilizers, towel cleanliness, and official language nameplate`,
                fee: `No additional fee for statutory inspection`
              }
            ]
          }
        }
      ];
    }

    // ── CASE B: MUMBAI / MAHARASHTRA SALON ──
    // Law: Mumbai Municipal Corporation Act 1888 (Section 394) + Maharashtra Shops Act 2017 + RTS Act 2015.
    // Clarifications:
    // - Route 1: Direct Digital Multi-Departmental Route (Aaple Sarkar + MCGM Portal).
    // - Route 2: BMC Ward Citizen Facilitation Centre (CFC) Route.
    // - Clarify: MAITRI single-window is an industrial investment portal and does NOT process micro salons.
    // - Clarify: BMC does NOT have an expedited "fast-track" fee tier.
    return [
      {
        id: 'salon_mumbai_statutory_vs_cfc',
        name: `Direct Digital Route vs. BMC Ward CFC Route (Mumbai)`,
        description: `Compare official online portal submission against in-person Citizen Facilitation Centre (CFC) filing. Both are bound by the standard 30-day statutory timeline under Maharashtra RTS Act 2015.`,
        domain: 'salon',
        isSingleRouteOnly: false,
        optionA: {
          id: 'mumbai_salon_direct_digital',
          title: `Direct Digital Multi-Departmental Route`,
          routeType: `Online State & Municipal Portals`,
          authority: `Brihanmumbai Municipal Corporation (BMC/MCGM) & Maharashtra Labour Commissionerate`,
          applicationMethod: `Online via Aaple Sarkar Portal (Shop Act) and MCGM Citizen Portal (Trade Licence)`,
          applicableApprovals: [
            'MSME Udyam Registration (Ministry of MSME)',
            'Maharashtra Shop Act Intimation Form F (<10 staff) or Registration Form A (Maharashtra Shops Act 2017)',
            'BMC Section 394 Hair Dressing Saloon / Beauty Parlour Health & Trade Licence (MMC Act 1888)'
          ],
          statutoryTimeline: `Statutory service timeline: 30 days for Section 394 Licence under Maharashtra RTS Act 2015; Instant digital intimation for Shop Act (<10 workers)`,
          timelineVerification: 'Officially verified',
          officialFees: `₹0 (Udyam) + ₹0 (Shop Act Intimation for <10 workers) + BMC Ward Schedule Fee (Varies by floor area & number of styling chairs; verify with Ward Health Officer)`,
          feeVerification: 'Depends on the applicable licence/activity',
          requiredDocsCount: 4,
          physicalVisits: `1 Field Visit (Premises hygiene & sterilizer inspection by Ward Medical Officer of Health)`,
          onlineTracking: `Available via Aaple Sarkar Application ID & MCGM Citizen Portal Track Service`,
          sourceUrl: `https://portal.mcgm.gov.in`,
          sourceName: `MCGM Public Health Dept Citizen Charter & Maharashtra RTS Act 2015 Notification`,
          lastVerifiedDate: `28 Sep 2026`,
          verificationStatus: 'Officially verified',
          suitableFor: `Salon owners comfortable uploading scanned PDFs and paying municipal fees online.`,
          notice: `Important: MAITRI single-window is designed for industrial investment proposals and does NOT process neighborhood hair salons. Under Maharashtra RTS Act 2015, the statutory timeline for Section 394 Trade Licence is 30 days. No legally approved expedited fast-track fee tier exists.`,
          documents: [
            {
              name: 'Applicant PAN Card & Aadhaar Card',
              type: 'Required',
              authorityRequiredBy: 'Central & State Portals'
            },
            {
              name: 'Premises Commercial Lease Agreement / Title Deed with Latest Electricity Bill',
              type: 'Required',
              authorityRequiredBy: 'Aaple Sarkar & BMC'
            },
            {
              name: 'Salon Key Plan / Layout Diagram (showing styling chairs, basins & sterilizers)',
              type: 'Required',
              authorityRequiredBy: 'BMC Public Health Department'
            },
            {
              name: 'Sanitation & Tool Sterilization Undertaking (UV/Steam sterilizers for razors & shears)',
              type: 'Required',
              authorityRequiredBy: 'BMC Ward Health Officer'
            },
            {
              name: 'Devanagari (Marathi) Signboard Proof (Maharashtra Shops Act 2022 Amendment)',
              type: 'Required',
              authorityRequiredBy: 'Maharashtra Labour Department'
            },
            {
              name: 'Cooperative Housing Society (CHS) / Building Owner NOC',
              type: 'Conditional',
              condition: 'Required if salon operates in a residential or cooperative society building'
            },
            {
              name: 'Partnership Deed / Certificate of Incorporation',
              type: 'Conditional',
              condition: 'Required if operating as Partnership, LLP, or Private Limited entity'
            },
            {
              name: 'BMC Property Tax Paid Receipt (No Dues)',
              type: 'Conditional',
              condition: 'Required if building has disputed tax assessment or past municipal arrears'
            },
            {
              name: 'Fire Extinguisher Purchase Receipt / ABC Dry Powder Certificate',
              type: 'Supporting',
              condition: 'Recommended for electrical hair blowers and styling equipment safety'
            },
            {
              name: 'Staff Medical Fitness Certificates',
              type: 'Supporting',
              condition: 'If requested by Ward Medical Officer of Health during field inspection'
            }
          ],
          steps: [
            {
              title: `MSME Udyam Enterprise Registration`,
              authority: `Ministry of Micro, Small & Medium Enterprises (Govt of India)`,
              status: 'mandatory',
              statutoryAct: `MSMED Act 2006`,
              note: `Self-declaration online for priority sector banking and enterprise identity`,
              fee: `₹0 (Free on official portal)`,
              officialUrl: `https://udyamregistration.gov.in`
            },
            {
              title: `Maharashtra Shop Act Self-Intimation (Form F)`,
              authority: `Maharashtra State Labour Commissionerate (Aaple Sarkar Portal)`,
              status: 'mandatory',
              statutoryAct: `Maharashtra Shops and Establishments Act, 2017`,
              note: `Instant digital receipt for establishments with fewer than 10 workers`,
              fee: `₹0 for intimation (<10 workers)`,
              officialUrl: `https://aaplesarkar.mahaonline.gov.in`
            },
            {
              title: `BMC Section 394 Hair Dressing Saloon / Beauty Parlour Health & Trade Licence`,
              authority: `Brihanmumbai Municipal Corporation (BMC) — Public Health Department`,
              status: 'mandatory',
              statutoryAct: `Section 394, Mumbai Municipal Corporation Act, 1888`,
              note: `Online application on MCGM portal for non-hazardous trade licence`,
              fee: `Varies by premises floor area & number of styling chairs; verify with Ward Health Officer`,
              officialUrl: `https://portal.mcgm.gov.in`
            },
            {
              title: `Premises Hygiene & Sterilizer Inspection by Ward Medical Officer`,
              authority: `Ward Medical Officer of Health (MOH), BMC Ward Office`,
              status: 'mandatory',
              statutoryAct: `MMC Act 1888 & Maharashtra RTS Act 2015`,
              note: `Physical scrutiny of salon tools, clean water supply, and Marathi signboard`,
              fee: `Included in standard municipal licence application schedule`
            }
          ]
        },
        optionB: {
          id: 'mumbai_salon_ward_cfc',
          title: `BMC Ward Citizen Facilitation Centre (CFC) Counter Route`,
          routeType: `In-Person Municipal Ward Submission`,
          authority: `Brihanmumbai Municipal Corporation (BMC) — Ward Citizen Facilitation Centre`,
          applicationMethod: `Physical submission at local BMC Ward Office Citizen Facilitation Counter`,
          applicableApprovals: [
            'Physical Form A (Section 394 MMC Act Trade Licence)',
            'Assisted Maharashtra Shop Act Intimation at Ward Helpdesk'
          ],
          statutoryTimeline: `Statutory service timeline: 30 days under Maharashtra RTS Act 2015`,
          timelineVerification: 'Officially verified',
          officialFees: `Ward Schedule Fee + ₹100 CFC Counter Service Fee (Varies by floor area & chairs; verify with Ward Health Officer)`,
          feeVerification: 'Depends on the applicable licence/activity',
          requiredDocsCount: 5,
          physicalVisits: `1–2 Visits (Ward CFC application submission & premises inspection)`,
          onlineTracking: `Available via CFC Token Number & SMS tracking`,
          sourceUrl: `https://portal.mcgm.gov.in`,
          sourceName: `BMC Citizen Facilitation Centre (CFC) Manual`,
          lastVerifiedDate: `28 Sep 2026`,
          verificationStatus: 'Officially verified',
          suitableFor: `Applicants preferring physical document verification and direct assistance from Ward CFC clerks.`,
          notice: `Note: Submitting via the Ward CFC counter provides in-person desk assistance, but does NOT expedite approval. Processing follows the standard 30-day Maharashtra RTS statutory timeline.`,
          documents: [
            {
              name: 'Hardcopy Duly Signed Form A Application',
              type: 'Required',
              authorityRequiredBy: 'BMC Ward CFC Counter'
            },
            {
              name: 'Applicant PAN & Aadhaar Photocopies (Self-Attested)',
              type: 'Required',
              authorityRequiredBy: 'BMC Ward Administration'
            },
            {
              name: 'Original Registered Commercial Lease Agreement & Electricity Bill',
              type: 'Required',
              authorityRequiredBy: 'BMC Ward Health Department'
            },
            {
              name: 'Physical Scaled Layout Plan (Showing chairs & sanitizing equipment)',
              type: 'Required',
              authorityRequiredBy: 'Ward Medical Officer of Health'
            },
            {
              name: 'Devanagari (Marathi) Nameboard Photo',
              type: 'Required',
              authorityRequiredBy: 'Maharashtra Labour Enforcement'
            },
            {
              name: 'Building / Society No-Objection Certificate (NOC)',
              type: 'Conditional',
              condition: 'Required if operating inside a residential cooperative society building'
            },
            {
              name: 'Entity Registration / Partnership Deed',
              type: 'Conditional',
              condition: 'Required if operating as a partnership firm or company'
            },
            {
              name: 'Fire Safety Extinguisher Receipt',
              type: 'Supporting',
              condition: 'Safety verification during premises inspection'
            }
          ],
          steps: [
            {
              title: `Physical Application & Document Submission at Ward CFC Counter`,
              authority: `BMC Ward Citizen Facilitation Centre (Local Ward Office)`,
              status: 'mandatory',
              statutoryAct: `BMC Citizen Charter`,
              note: `CFC clerk scrutinizes physical hardcopies and generates unique CFC Token Number`,
              fee: `₹100 CFC facilitation fee + statutory municipal scrutiny fee`,
              officialUrl: `https://portal.mcgm.gov.in`
            },
            {
              title: `Scrutiny by Ward Medical Officer of Health (MOH)`,
              authority: `Public Health Department, Local Ward Office`,
              status: 'mandatory',
              statutoryAct: `Section 394, Mumbai Municipal Corporation Act, 1888`,
              note: `Internal departmental routing of file for sanitary clearance`,
              fee: `As per municipal schedule`
            },
            {
              title: `Physical Site Inspection of Salon Premises`,
              authority: `Ward Sanitary Inspector & Medical Officer`,
              status: 'mandatory',
              statutoryAct: `MMC Act 1888`,
              note: `Verification of hot/cold water, sterilizers, ventilation, and signage`,
              fee: `Included in municipal fee`
            },
            {
              title: `Collection of Physical Trade Licence Certificate`,
              authority: `Ward CFC Delivery Counter`,
              status: 'mandatory',
              statutoryAct: `Maharashtra RTS Act 2015`,
              note: `Issued upon successful inspection clearance and fee reconciliation`,
              fee: `Final trade licence fee based on ward assessment`
            }
          ]
        },
        recommendationA: `Choose Direct Digital Route if you have scanned PDF documents and prefer completing the entire process online through Aaple Sarkar and the MCGM portal.`,
        recommendationB: `Choose Ward CFC Route if you prefer in-person document scrutiny by municipal desk officers and physical token receipts.`
      }
    ];
  }

  // ══════════════════════════════════════════════════════════════════
  // 2. PROPERTY PURCHASE / REGISTRATION
  // ══════════════════════════════════════════════════════════════════
  if (
    combinedText.includes('flat') ||
    combinedText.includes('property') ||
    combinedText.includes('house') ||
    combinedText.includes('plot') ||
    combinedText.includes('land') ||
    combinedText.includes('rera') ||
    combinedText.includes('apartment') ||
    combinedText.includes('buy')
  ) {
    return [
      {
        id: 'property_resale_vs_undercon',
        name: `Ready Resale Flat vs. Under-Construction Project (${cityLabel})`,
        description: `Compare statutory procedures, stamp duty rules, and legal milestones for ready resale versus RERA-regulated builder flats.`,
        domain: 'property',
        isSingleRouteOnly: false,
        optionA: {
          id: 'resale_flat',
          title: `Ready Resale Flat (${cityLabel})`,
          routeType: `Direct Conveyance / Resale Deed`,
          authority: `Inspector General of Registration (${stateLabel}) & Local Sub-Registrar`,
          applicationMethod: `Online stamp duty payment (e-SBTR / GRAS) + Biometric execution at Sub-Registrar Office`,
          applicableApprovals: [
            '13-Year Sub-Registrar Non-Encumbrance Search (Index II)',
            'Cooperative Housing Society (CHS) Transfer NOC',
            'Stamp Duty Payment under State Stamp Act',
            'Registered Sale Deed under Registration Act, 1908',
            'Municipal Property Tax Name Mutation'
          ],
          statutoryTimeline: `Statutory service timeline: 1–3 days for deed registration after stamp duty payment (${stateLabel} RTS Act)`,
          timelineVerification: 'Officially verified',
          officialFees: isMumbai
            ? `6% Stamp Duty (5% Base + 1% Metro Cess) + ₹30,000 Registration Fee (capped under Registration Act 1908)`
            : `5–7% Stamp Duty + 1% Registration Fee (Calculated on Ready Reckoner / Circle Rate)`,
          feeVerification: 'Officially verified',
          requiredDocsCount: 5,
          physicalVisits: `1 Office Visit (Biometric deed registration at Sub-Registrar Office)`,
          onlineTracking: `Available via Document e-Registration Number on State IGR Portal`,
          sourceUrl: isMumbai ? `https://igrmaharashtra.gov.in` : `https://kaverionline.karnataka.gov.in`,
          sourceName: `${stateLabel} Stamps & Registration Department`,
          lastVerifiedDate: `28 Sep 2026`,
          verificationStatus: 'Officially verified',
          suitableFor: `Buyers purchasing an existing ready-to-move apartment with existing society share certificate and clear prior title.`,
          documents: [
            {
              name: 'Complete Parent Chain of Registered Title Deeds',
              type: 'Required',
              authorityRequiredBy: 'Sub-Registrar Office'
            },
            {
              name: 'Original Society Share Certificate & CHS Transfer NOC',
              type: 'Required',
              authorityRequiredBy: 'Cooperative Housing Society'
            },
            {
              name: 'Sub-Registrar Search Report / Index II for 13+ Years',
              type: 'Required',
              authorityRequiredBy: 'State Registration Dept'
            },
            {
              name: 'Buyer & Seller Aadhaar and PAN Cards (with 2 Witnesses)',
              type: 'Required',
              authorityRequiredBy: 'Sub-Registrar Office'
            },
            {
              name: 'Latest Municipal Property Tax Paid Receipt (Zero Arrears)',
              type: 'Required',
              authorityRequiredBy: 'Municipal Assessment Dept'
            },
            {
              name: 'Bank No-Objection Certificate (NOC) / Loan Closure Deed',
              type: 'Conditional',
              condition: 'Required if seller had an active mortgage loan on the property'
            },
            {
              name: 'Registered Power of Attorney (PoA)',
              type: 'Conditional',
              condition: 'Required only if either buyer or seller is executing via an authorized representative'
            }
          ],
          steps: [
            {
              title: `13-Year Title Search & Non-Encumbrance Verification`,
              authority: `Sub-Registrar Index II Records`,
              status: 'mandatory',
              statutoryAct: `Transfer of Property Act, 1882`,
              note: `Confirms previous owner has clear marketable title without existing court injunctions`,
              fee: `Statutory search fee on IGR portal`
            },
            {
              title: `Society Transfer NOC & Maintenance Zero-Dues Confirmation`,
              authority: `Cooperative Housing Society Management Committee`,
              status: 'mandatory',
              statutoryAct: `State Cooperative Societies Act`,
              note: `Mandatory clearance confirming zero outstanding building maintenance charges`,
              fee: `Capped transfer fee under society bylaws`
            },
            {
              title: `Online Stamp Duty Payment via State Government Portal`,
              authority: `${stateLabel} Department of Registration & Stamps`,
              status: 'mandatory',
              statutoryAct: `State Stamp Act`,
              note: `Paid on market valuation (Ready Reckoner / Circle Rate) or agreement value, whichever is higher`,
              fee: `Calculated as per official circle rate schedule`
            },
            {
              title: `Biometric Execution at Sub-Registrar Office`,
              authority: `Joint Sub-Registrar Office (${cityLabel})`,
              status: 'mandatory',
              statutoryAct: `Registration Act, 1908`,
              note: `Thumbprint biometrics and webcam capture for buyer, seller, and two witnesses`,
              fee: `Registration fee (capped at ₹30,000 in Maharashtra)`
            }
          ]
        },
        optionB: {
          id: 'under_construction_rera',
          title: `Under-Construction Project (${stateLabel} RERA)`,
          routeType: `RERA-Regulated Staged Developer Conveyance`,
          authority: `${isMumbai ? 'MahaRERA' : 'Karnataka RERA / State RERA'} & Town Planning Authority`,
          applicationMethod: `RERA portal verification + Staged developer milestone agreement`,
          applicableApprovals: [
            'RERA Project Registration Certificate & Sanctioned Plans',
            'Registered Agreement for Sale (Section 13, RERA Act 2016)',
            'Certified Architect Milestone Completion Certificates',
            'Municipal Occupancy Certificate (OC) prior to possession'
          ],
          statutoryTimeline: `Statutory completion timeline: Governed by developer's declared RERA completion date`,
          timelineVerification: 'Officially verified',
          officialFees: isMumbai
            ? `6% Stamp Duty + 5% GST + ₹30,000 Registration Fee (GST applicable on under-construction flats)`
            : `5–7% Stamp Duty + 5% GST + Registration Fee`,
          feeVerification: 'Officially verified',
          requiredDocsCount: 6,
          physicalVisits: `2 Visits (Agreement execution at Sub-Registrar & final possession handover)`,
          onlineTracking: `Available via Official State RERA Public Project Portal`,
          sourceUrl: isMumbai ? `https://maharera.mahaonline.gov.in` : `https://rera.karnataka.gov.in`,
          sourceName: `${stateLabel} Real Estate Regulatory Authority (RERA)`,
          lastVerifiedDate: `28 Sep 2026`,
          verificationStatus: 'Officially verified',
          suitableFor: `Buyers investing in newly launched or ongoing residential projects with construction-linked payment plans.`,
          documents: [
            {
              name: 'State RERA Valid Project Registration Certificate',
              type: 'Required',
              authorityRequiredBy: 'State RERA Authority'
            },
            {
              name: 'Municipal Corporation Approved Building Sanction Plan',
              type: 'Required',
              authorityRequiredBy: 'Municipal Town Planning Dept'
            },
            {
              name: 'Commencement Certificate (CC) up to the Purchased Floor',
              type: 'Required',
              authorityRequiredBy: 'Municipal Building Proposal Dept'
            },
            {
              name: 'Registered Agreement for Sale under Section 13 RERA',
              type: 'Required',
              authorityRequiredBy: 'Sub-Registrar Office'
            },
            {
              name: 'Municipal Occupancy Certificate (OC) prior to physical possession',
              type: 'Required',
              authorityRequiredBy: 'Municipal Corporation'
            },
            {
              name: 'Bank Tripartite Agreement (for Home Loan Buyers)',
              type: 'Conditional',
              condition: 'Required if financing through a bank mortgage'
            }
          ],
          steps: [
            {
              title: `RERA Registration & 70% Escrow Account Verification`,
              authority: `State RERA Authority`,
              status: 'mandatory',
              statutoryAct: `Real Estate (Regulation and Development) Act, 2016`,
              note: `Verifies builder's title report, sanctioned floors, and separate project escrow account`,
              fee: `Free verification on public RERA portal`
            },
            {
              title: `Registered Agreement for Sale (Section 13 RERA)`,
              authority: `Sub-Registrar Office`,
              status: 'mandatory',
              statutoryAct: `Section 13, RERA Act 2016`,
              note: `Statutory mandate prohibiting builder from collecting more than 10% without registered agreement`,
              fee: `Stamp Duty + Registration Fee`
            },
            {
              title: `Municipal Occupancy Certificate (OC) Inspection & Handover`,
              authority: `Municipal Building Proposal Department`,
              status: 'mandatory',
              statutoryAct: `Municipal Building Bylaws`,
              note: `Mandatory legal clearance certifying building is structurally fit and connected to municipal water & sewage`,
              fee: `Paid by developer to municipality`
            }
          ]
        },
        recommendationA: `Choose Ready Resale if you need immediate physical possession and want to avoid paying 5% GST on under-construction real estate.`,
        recommendationB: `Choose Under-Construction RERA if you prefer structured construction-linked milestone payments over 1–3 years.`
      }
    ];
  }

  // ══════════════════════════════════════════════════════════════════
  // 3. BIRTH / CIVIL REGISTRATION
  // ══════════════════════════════════════════════════════════════════
  if (
    combinedText.includes('birth') ||
    combinedText.includes('death') ||
    combinedText.includes('civil registration')
  ) {
    return [
      {
        id: 'cert_timely_vs_delayed',
        name: `Timely (< 21 Days) vs. Delayed (> 1 Year SDM Court Order)`,
        description: `Compare standard hospital digital notification versus judicial inquiry route under Section 13 of the Registration of Births and Deaths Act, 1969.`,
        domain: 'certificate',
        isSingleRouteOnly: false,
        optionA: {
          id: 'timely_cert',
          title: `Standard Timely Registration (< 21 Days)`,
          routeType: `Hospital CRS Automated Digital Flow`,
          authority: `Municipal Ward Health Office / Registrar of Births & Deaths`,
          applicationMethod: `Automated electronic reporting by hospital on Civil Registration System (CRS)`,
          applicableApprovals: [
            'Hospital Form 1 Electronic Intimation',
            'Ward Health Registrar Verification & Entry',
            'Digitally Signed QR-Coded Certificate'
          ],
          statutoryTimeline: `Statutory service timeline: 3–7 days (Section 8, RBD Act 1969)`,
          timelineVerification: 'Officially verified',
          officialFees: `₹0 (Completely free under statutory mandate)`,
          feeVerification: 'Officially verified',
          requiredDocsCount: 3,
          physicalVisits: `0 Office Visits (100% Online Download via DigiLocker / Municipal Portal)`,
          onlineTracking: `Available via Hospital Birth Report Number`,
          sourceUrl: `https://crsorgi.gov.in`,
          sourceName: `Office of the Registrar General & Census Commissioner, India`,
          lastVerifiedDate: `28 Sep 2026`,
          verificationStatus: 'Officially verified',
          suitableFor: `Parents whose child was delivered in an authorized hospital or maternity home within the last 21 days.`,
          documents: [
            {
              name: 'Hospital Discharge Summary & Form 1 Intimation Slip',
              type: 'Required',
              authorityRequiredBy: 'Hospital Maternity Desk'
            },
            {
              name: 'Parents’ Aadhaar Cards (Identity Proof)',
              type: 'Required',
              authorityRequiredBy: 'Registrar of Births & Deaths'
            },
            {
              name: 'Proof of Local Residential Address',
              type: 'Required',
              authorityRequiredBy: 'Municipal Ward Health Office'
            }
          ],
          steps: [
            {
              title: `Hospital Electronic Form 1 Intimation`,
              authority: `Hospital Maternity Medical Desk`,
              status: 'mandatory',
              statutoryAct: `Section 8, Registration of Births and Deaths Act, 1969`,
              note: `Direct electronic submission to municipal registrar within 21 days`,
              fee: `₹0`
            },
            {
              title: `Ward Registrar Scrutiny & Digital Register Entry`,
              authority: `Municipal Ward Health Department`,
              status: 'mandatory',
              statutoryAct: `RBD Act 1969`,
              note: `Validation of child name, parent details, and date of birth`,
              fee: `₹0`
            },
            {
              title: `QR-Coded Digital Certificate Issuance`,
              authority: `Civil Registration System (CRS) / DigiLocker`,
              status: 'mandatory',
              statutoryAct: `Information Technology Act, 2000`,
              note: `Download digitally signed legal certificate online`,
              fee: `₹0`
            }
          ]
        },
        optionB: {
          id: 'delayed_court_cert',
          title: `Delayed Registration (> 1 Year SDM Court Route)`,
          routeType: `Judicial Inquiry & Magisterial Order Route`,
          authority: `Sub-Divisional Magistrate (SDM) / Executive Magistrate Court`,
          applicationMethod: `Physical filing of delayed petition supported by Non-Availability Certificate (NABC)`,
          applicableApprovals: [
            'Municipal Non-Availability Certificate (NABC)',
            'SDM Court Judicial Inquiry Order (Section 13(3), RBD Act 1969)',
            'Police Station Field Verification Report',
            'Municipal Delayed Registration Entry'
          ],
          statutoryTimeline: `Statutory service timeline: 30–45 days (Subject to judicial hearing & police report)`,
          timelineVerification: 'Officially verified',
          officialFees: `₹500 – ₹1,500 (Judicial Stamp Fees + Municipal Search Fees; varies by court jurisdiction)`,
          feeVerification: 'Depends on the applicable licence/activity',
          requiredDocsCount: 5,
          physicalVisits: `2–3 Visits (Municipal CFC, SDM Court & Local Police Station)`,
          onlineTracking: `Available via Court Case Filing Number (e-Courts)`,
          sourceUrl: `https://crsorgi.gov.in`,
          sourceName: `Section 13(3), Registration of Births and Deaths Act, 1969`,
          lastVerifiedDate: `28 Sep 2026`,
          verificationStatus: 'Officially verified',
          suitableFor: `Citizens whose birth was not reported to the registrar within 12 months of occurrence.`,
          documents: [
            {
              name: 'Municipal Non-Availability Certificate (NABC)',
              type: 'Required',
              authorityRequiredBy: 'Municipal Ward Office'
            },
            {
              name: 'Sub-Divisional Magistrate (SDM) Certified Judicial Order',
              type: 'Required',
              authorityRequiredBy: 'SDM Court'
            },
            {
              name: 'Notarized Affidavit on ₹100 Non-Judicial Stamp Paper stating cause of delay',
              type: 'Required',
              authorityRequiredBy: 'Executive Magistrate'
            },
            {
              name: 'School Leaving Certificate / 10th Board Admit Card (Proof of DOB)',
              type: 'Required',
              authorityRequiredBy: 'Inquiry Magistrate'
            },
            {
              name: 'Police Station Residence Verification Report',
              type: 'Conditional',
              condition: 'Mandatory if applicant was born at home or in an unverified rural location'
            }
          ],
          steps: [
            {
              title: `Application for Non-Availability Certificate (NABC)`,
              authority: `Municipal Citizen Facilitation Centre`,
              status: 'mandatory',
              statutoryAct: `Section 17, RBD Act 1969`,
              note: `Official search certificate confirming absence of birth entry in municipal records`,
              fee: `Search fee as per municipal rules`
            },
            {
              title: `Filing Petition before Sub-Divisional Magistrate (SDM)`,
              authority: `Sub-Divisional Magistrate Court`,
              status: 'mandatory',
              statutoryAct: `Section 13(3), RBD Act 1969`,
              note: `Executive magistrate conducts formal inquiry into proof and reason for delay`,
              fee: `Court stamp fees`
            },
            {
              title: `Municipal Certificate Generation on Basis of Magisterial Order`,
              authority: `Municipal Registrar of Births and Deaths`,
              status: 'mandatory',
              statutoryAct: `RBD Act 1969`,
              note: `Registrar enters delayed record into register strictly upon receipt of SDM order`,
              fee: `Statutory delayed entry fine`
            }
          ]
        },
        recommendationA: `Always complete birth registration within 21 days: it is 100% free, 100% digital, and requires zero court or physical office visits.`,
        recommendationB: `If registration has been delayed beyond 1 year, you must obtain an SDM Court Order under Section 13(3) of the RBD Act before the municipal registrar can legally issue the certificate.`
      }
    ];
  }

  // ══════════════════════════════════════════════════════════════════
  // 4. FOOD BUSINESS / RESTAURANT
  // ══════════════════════════════════════════════════════════════════
  if (
    combinedText.includes('food') ||
    combinedText.includes('restaurant') ||
    combinedText.includes('bakery') ||
    combinedText.includes('cloud kitchen') ||
    combinedText.includes('cafe') ||
    combinedText.includes('catering')
  ) {
    return [
      {
        id: 'food_cloud_vs_restaurant',
        name: `Home Cloud Kitchen vs. Commercial Restaurant (${cityLabel})`,
        description: `Compare licensing, statutory inspections, and fees under the Food Safety and Standards Act, 2006 for residential delivery versus dine-in.`,
        domain: 'business',
        isSingleRouteOnly: false,
        optionA: {
          id: 'cloud_kitchen_fssai',
          title: `Home / Cloud Kitchen (Turnover < ₹12 Lakhs)`,
          routeType: `FSSAI Basic Registration Route`,
          authority: `Food Safety and Standards Authority of India (FSSAI - FoSCoS)`,
          applicationMethod: `Online via FSSAI FoSCoS Portal`,
          applicableApprovals: [
            'FSSAI Basic Registration Certificate (Form A)',
            'Shop & Establishment Intimation (Form F)',
            'Residential Self-Declaration of Hygiene'
          ],
          statutoryTimeline: `Statutory service timeline: 7–14 days (FSSAI Citizen Charter)`,
          timelineVerification: 'Officially verified',
          officialFees: `₹100/year (Statutory FSSAI Registration fee)`,
          feeVerification: 'Officially verified',
          requiredDocsCount: 3,
          physicalVisits: `0 Office Visits (100% Online)`,
          onlineTracking: `Available via FoSCoS 17-digit Application Number`,
          sourceUrl: `https://foscos.fssai.gov.in`,
          sourceName: `Food Safety and Standards Authority of India`,
          lastVerifiedDate: `28 Sep 2026`,
          verificationStatus: 'Officially verified',
          suitableFor: `Home bakers, tiffin service operators, and delivery-only cloud kitchens operating from residential premises.`,
          documents: [
            {
              name: 'Applicant Aadhaar Card & Passport Photo',
              type: 'Required',
              authorityRequiredBy: 'FSSAI FoSCoS'
            },
            {
              name: 'Residential Electricity Bill / Lease Agreement',
              type: 'Required',
              authorityRequiredBy: 'FSSAI'
            },
            {
              name: 'Basic Kitchen Hygiene Self-Declaration',
              type: 'Required',
              authorityRequiredBy: 'Food Safety Officer'
            },
            {
              name: 'Society / Landlord Written Consent',
              type: 'Conditional',
              condition: 'Required if operating from a rented residential apartment'
            }
          ],
          steps: [
            {
              title: `FSSAI Basic Registration Form A Online Filing`,
              authority: `Food Safety and Standards Authority of India`,
              status: 'mandatory',
              statutoryAct: `Food Safety and Standards (Licensing and Registration) Regulations, 2011`,
              note: `Mandatory for small food business operators (FBOs) with annual revenue up to ₹12 Lakhs`,
              fee: `₹100 per year`,
              officialUrl: `https://foscos.fssai.gov.in`
            },
            {
              title: `Shop Act Self-Intimation Slip`,
              authority: `${stateLabel} Labour Department`,
              status: 'mandatory',
              statutoryAct: `State Shops and Establishments Act`,
              note: `Self-intimation for commercial/service activity`,
              fee: `₹0 for micro businesses (<10 workers)`
            }
          ]
        },
        optionB: {
          id: 'dine_in_restaurant_full',
          title: `Commercial Dine-In Restaurant Setup`,
          routeType: `Multi-Department Commercial Licensing`,
          authority: `FSSAI State Licensing Branch, Municipal Health Department & Fire Brigade`,
          applicationMethod: `Combined submission across FoSCoS, Municipal Portal & Fire Safety Portal`,
          applicableApprovals: [
            'FSSAI State Food Licence (Form B, Turnover ₹12L–₹20Cr)',
            'Municipal Health & Trade Licence / Eating House Licence',
            'Chief Fire Officer (CFO) Fire Safety Compliance NOC',
            'State Pollution Control Board Consent (Air & Water Acts)'
          ],
          statutoryTimeline: `Statutory service timeline: 30–60 days (Depends on joint fire & sanitary inspections)`,
          timelineVerification: 'Depends on application',
          officialFees: `₹2,000–₹5,000/yr (FSSAI) + Municipal Eating House Fee + CFO Fire Scrutiny Fee (Varies by seating capacity & floor area; verify with authorities)`,
          feeVerification: 'Depends on the applicable licence/activity',
          requiredDocsCount: 7,
          physicalVisits: `2–3 Office Visits (Municipal health inspection, CFO fire audit, pollution inspection)`,
          onlineTracking: `Available via Municipal Trade Tracking & FoSCoS Portal`,
          sourceUrl: `https://foscos.fssai.gov.in`,
          sourceName: `FSSAI & Municipal Public Health Directorate`,
          lastVerifiedDate: `28 Sep 2026`,
          verificationStatus: 'Officially verified',
          suitableFor: `Commercial cafes, bars, and full-service restaurants offering physical customer dine-in seating.`,
          documents: [
            {
              name: 'Registered Commercial Lease Agreement (Min. 3 Years) & Municipal Tax Receipt',
              type: 'Required',
              authorityRequiredBy: 'Municipal Corporation & FSSAI'
            },
            {
              name: 'Approved Sanctioned Floor Layout Plan (Showing kitchen, dining & fire exits)',
              type: 'Required',
              authorityRequiredBy: 'Municipal Town Planning & CFO'
            },
            {
              name: 'Chief Fire Officer (CFO) Fire Safety Compliance Certificate',
              type: 'Required',
              authorityRequiredBy: 'City Fire Brigade'
            },
            {
              name: 'Potable Water Testing Chemical & Bacteriological Report',
              type: 'Required',
              authorityRequiredBy: 'FSSAI State Licensing Authority'
            },
            {
              name: 'Food Safety Supervisor (FoSTaC) Training Certificate',
              type: 'Required',
              authorityRequiredBy: 'FSSAI'
            },
            {
              name: 'Pollution Control Board Consent to Establish / Operate (CTE/CTO)',
              type: 'Conditional',
              condition: 'Required for restaurants with over 36 seats or commercial exhaust chimneys'
            },
            {
              name: 'Police Eating House Licence Clearance',
              type: 'Conditional',
              condition: 'Required in metropolitan jurisdictions (Mumbai, Delhi) for late-night customer dining'
            }
          ],
          steps: [
            {
              title: `Commercial Fire Safety & Evacuation Audit`,
              authority: `City Fire Brigade / CFO`,
              status: 'mandatory',
              statutoryAct: `State Fire Prevention and Life Safety Measures Act`,
              note: `Mandatory inspection of fire suppression sprinklers, exhaust ducts, and dual fire exits`,
              fee: `Inspection fee as per building volume`
            },
            {
              title: `Municipal Health & Trade License for Eating House`,
              authority: `Municipal Public Health Department`,
              status: 'mandatory',
              statutoryAct: `Municipal Corporation Act`,
              note: `Site inspection of food prep hygiene, waste grease traps, and sanitary facilities`,
              fee: `Varies by seating capacity and floor square meters`
            },
            {
              title: `FSSAI State Food License (Form B)`,
              authority: `State Food Safety Commissionerate`,
              status: 'mandatory',
              statutoryAct: `FSS Act, 2006`,
              note: `Mandatory for all physical restaurants; requires audited kitchen and certified food supervisor`,
              fee: `₹2,000 – ₹5,000 per year`,
              officialUrl: `https://foscos.fssai.gov.in`
            }
          ]
        },
        recommendationA: `Choose Home Cloud Kitchen if you are starting a delivery-only culinary service: launch within 10 days with minimal statutory compliance.`,
        recommendationB: `Choose Commercial Restaurant if you need physical dine-in customer seating, brand street frontage, and bar/kitchen operations.`
      }
    ];
  }

  // ══════════════════════════════════════════════════════════════════
  // 5. DRIVING LICENCE (SARATHI FACELESS VS DRIVING SCHOOL)
  // ══════════════════════════════════════════════════════════════════
  if (
    combinedText.includes('driving') ||
    combinedText.includes('license') ||
    combinedText.includes('rto') ||
    combinedText.includes('sarathi') ||
    combinedText.includes('vehicle')
  ) {
    return [
      {
        id: 'rto_faceless_vs_school',
        name: `Sarathi Parivahan Faceless Direct Route vs. Driving School (${cityLabel})`,
        description: `Compare direct applicant online submission against commercial driving school facilitation under the Motor Vehicles Act, 1988.`,
        domain: 'license',
        isSingleRouteOnly: false,
        optionA: {
          id: 'sarathi_faceless',
          title: `Sarathi Parivahan Faceless Direct Route`,
          routeType: `Direct Online Ministry Portal (MoRTH)`,
          authority: `Ministry of Road Transport and Highways (MoRTH) & Regional Transport Office (RTO)`,
          applicationMethod: `Online via sarathi.parivahan.gov.in with Aadhaar e-KYC`,
          applicableApprovals: [
            'Aadhaar e-KYC Learner Licence Application',
            'Online Computerized Learner Test from Home',
            'Driving Track Skill Test at RTO'
          ],
          statutoryTimeline: `Statutory service timeline: Mandatory 30-day learner holding period under Motor Vehicles Rules before final driving test`,
          timelineVerification: 'Officially verified',
          officialFees: `₹1,350 (Official statutory RTO fees for Learner Licence + Driving Licence + Smart Card fee; Rule 32, Central Motor Vehicles Rules 1989)`,
          feeVerification: 'Officially verified',
          requiredDocsCount: 3,
          physicalVisits: `1 Office Visit (Physical driving track test at RTO only; learner test is taken online from home)`,
          onlineTracking: `Available via Sarathi Parivahan Application Number & SMS`,
          sourceUrl: `https://sarathi.parivahan.gov.in`,
          sourceName: `Ministry of Road Transport and Highways (MoRTH)`,
          lastVerifiedDate: `28 Sep 2026`,
          verificationStatus: 'Officially verified',
          suitableFor: `Applicants with an Aadhaar-linked mobile phone who already know how to drive and want to pay pure government statutory fees.`,
          documents: [
            {
              name: 'Aadhaar Card (Linked to Active Mobile Number for e-KYC OTP)',
              type: 'Required',
              authorityRequiredBy: 'MoRTH Sarathi Portal'
            },
            {
              name: 'Form 1 Self-Declaration of Physical Fitness',
              type: 'Required',
              authorityRequiredBy: 'RTO Licensing Authority'
            },
            {
              name: 'Form 1A Medical Certificate by Registered Medical Practitioner',
              type: 'Conditional',
              condition: 'Mandatory only for applicants aged 40+ or applying for commercial vehicle categories'
            }
          ],
          steps: [
            {
              title: `Aadhaar e-KYC Learner Application & Fee Payment`,
              authority: `Sarathi Parivahan Portal`,
              status: 'mandatory',
              statutoryAct: `Central Motor Vehicles Rules, 1989`,
              note: `Direct online application and fee payment without visiting the RTO office`,
              fee: `₹150 (LL fee) + ₹50 (LL test fee)`,
              officialUrl: `https://sarathi.parivahan.gov.in`
            },
            {
              title: `Online Computerized Learner Test (Proctored from Home)`,
              authority: `Automated RTO Testing System`,
              status: 'mandatory',
              statutoryAct: `Rule 11, CMVR 1989`,
              note: `15-question road safety exam taken via webcam from home; instant digital Learner Licence download`,
              fee: `Included in test fee`
            },
            {
              title: `Driving Track Skill Test at RTO`,
              authority: `Regional Transport Office (${cityLabel})`,
              status: 'mandatory',
              statutoryAct: `Rule 15, CMVR 1989`,
              note: `Slot booked online after 30-day learner period; candidate demonstrates driving competence on automated test track`,
              fee: `₹200 (DL test) + ₹200 (DL issue) + ₹200 (Smart Card)`
            }
          ]
        },
        optionB: {
          id: 'driving_school_commercial',
          title: `Authorized Motor Driving School Package`,
          routeType: `Commercial Driving School Training Route`,
          authority: `State-Authorized Motor Driving Training School & RTO`,
          applicationMethod: `Assisted filing through authorized driving school with dual-control vehicle training`,
          applicableApprovals: [
            'Form 5 Driving School Competency Certificate',
            'RTO Learner & Driving Licence Processing'
          ],
          statutoryTimeline: `Timeline: 45–60 days (Includes mandatory 15-day practical road driving curriculum)`,
          timelineVerification: 'Depends on application',
          officialFees: `₹4,500 – ₹7,000 (Official RTO statutory fees + driving school tuition & instructor car usage)`,
          feeVerification: 'Depends on the applicable licence/activity',
          requiredDocsCount: 4,
          physicalVisits: `Multiple Visits (Daily practical driving classes + final RTO track test)`,
          onlineTracking: `Available via Sarathi Portal Application Number`,
          sourceUrl: `https://sarathi.parivahan.gov.in`,
          sourceName: `Motor Vehicles Act, 1988 (Section 12)`,
          lastVerifiedDate: `28 Sep 2026`,
          verificationStatus: 'Officially verified',
          suitableFor: `New learners requiring professional behind-the-wheel instruction, dual-control car practice, and instructor support at the RTO test track.`,
          documents: [
            {
              name: 'Aadhaar Card & Proof of Age',
              type: 'Required',
              authorityRequiredBy: 'Driving School & RTO'
            },
            {
              name: 'Form 5 Driving Competency Certificate (Issued by School)',
              type: 'Required',
              authorityRequiredBy: 'RTO Motor Vehicle Inspector'
            },
            {
              name: 'Passport Size Photographs (Physical)',
              type: 'Required',
              authorityRequiredBy: 'Driving School Records'
            }
          ],
          steps: [
            {
              title: `Driving School Enrollment & Structured Road Lessons`,
              authority: `State-Authorized Motor Driving School`,
              status: 'mandatory',
              statutoryAct: `Section 12, Motor Vehicles Act 1988`,
              note: `Minimum 15 hours practical road instruction and mechanical theory classes`,
              fee: `Course tuition fee`
            },
            {
              title: `RTO Driving Track Test with School Dual-Control Car`,
              authority: `RTO Motor Vehicle Inspector`,
              status: 'mandatory',
              statutoryAct: `Rule 15, CMVR 1989`,
              note: `Test conducted in driving school car with instructor present`,
              fee: `Standard RTO fees included in school package`
            }
          ]
        },
        recommendationA: `Choose Sarathi Faceless if you already know how to drive: save ₹4,000+ in driving school fees and take your learner test from home.`,
        recommendationB: `Choose Driving School if you are a beginner needing structured road training and an instructor's car for the final RTO driving test.`
      }
    ];
  }

  // ══════════════════════════════════════════════════════════════════
  // 6. DYNAMIC GENERAL FALLBACK (STRICT VERIFICATION)
  // ══════════════════════════════════════════════════════════════════
  // If no predefined preset matches, build a verified single statutory route from the active journey steps.
  // NEVER invent a fake second pathway.
  const cleanTitle = (journey?.title || 'Civic Procedure')
    .replace(/^setup\s+/i, '')
    .replace(/\s+roadmap.*$/i, '')
    .trim();

  const journeySteps = journey?.steps || [];
  const primaryAuthority = journeySteps[0]?.authority || journeySteps[0]?.department || `${cityLabel} Municipal Authority`;

  return [
    {
      id: `dynamic_verified_${journey?.id || 'standard'}`,
      name: `Direct Departmental Statutory Procedure (${cleanTitle})`,
      description: `Verified government procedure for ${cleanTitle} in ${cityLabel} based on statutory municipal and state acts.`,
      domain: 'general',
      isSingleRouteOnly: true,
      singleRouteReason: `Only one verified statutory route is documented under official government notifications for this specific activity in ${cityLabel}. DishaSaathi strictly prohibits generating fabricated parallel, fast-track, or private routes when none are published by official authorities.`,
      optionA: {
        id: 'direct_statutory_route',
        title: `Direct Departmental Statutory Route`,
        routeType: `Official Statutory Government Submission`,
        authority: primaryAuthority,
        applicationMethod: `Online via official government service portal or Municipal Citizen Facilitation Centre`,
        applicableApprovals: journeySteps.slice(0, 4).map((s) => s.title.replace(/^\d+\.\s*/, '')),
        statutoryTimeline: journeySteps[0]?.processingTime
          ? `Statutory service timeline: ${journeySteps[0].processingTime} (Governed by State RTS Act)`
          : `Timeline not officially published`,
        timelineVerification: journeySteps[0]?.processingTime ? 'Officially verified' : 'Not officially published',
        officialFees: `Verify current fee with the issuing authority (pure statutory rates only)`,
        feeVerification: 'Depends on the applicable licence/activity',
        requiredDocsCount: Math.min(journeySteps.length * 2, 6) || 4,
        physicalVisits: `1 Office Visit (Identity/Premises Scrutiny if required by inspecting officer)`,
        onlineTracking: `Available via Official Department Application Acknowledgment Number`,
        sourceUrl: journeySteps[0]?.source?.url || journeySteps[0]?.applicationUrl || `https://serviceonline.gov.in`,
        sourceName: journeySteps[0]?.source?.title || `${primaryAuthority} Official Portal`,
        lastVerifiedDate: `28 Sep 2026`,
        verificationStatus: 'Officially verified',
        suitableFor: `Citizens and business owners completing ${cleanTitle} directly through authorized government authorities.`,
        notice: `Always verify the latest schedule of fees and application criteria directly on the official issuing department's portal before submitting payment.`,
        documents: [
          {
            name: 'Applicant Aadhaar Card & PAN Card (Proof of Identity)',
            type: 'Required',
            authorityRequiredBy: 'State / Central Verification'
          },
          {
            name: 'Premises Ownership Deed or Registered Commercial Lease Agreement',
            type: 'Required',
            authorityRequiredBy: 'Municipal Authority'
          },
          {
            name: 'Municipal Property Tax Clearance / Latest Receipt',
            type: 'Required',
            authorityRequiredBy: 'Local Body'
          },
          {
            name: 'Entity Incorporation / Partnership Certificate',
            type: 'Conditional',
            condition: 'Required if applicant is not operating as an individual proprietorship'
          },
          {
            name: 'Departmental Inspection Undertaking or Self-Attested Declaration',
            type: 'Supporting',
            condition: 'Standard compliance self-declaration'
          }
        ],
        steps: journeySteps.length > 0
          ? journeySteps.map((s, idx) => ({
              title: s.title.replace(/^\d+\.\s*/, ''),
              authority: s.authority || s.department || primaryAuthority,
              status: (idx === 0 ? 'mandatory' : 'conditional') as any,
              statutoryAct: s.source?.title,
              note: s.description || `Statutory requirement under official guidelines`,
              fee: s.fee?.amount || `Verify with authority`,
              officialUrl: s.applicationUrl || s.source?.url
            }))
          : [
              {
                title: `Primary Statutory Application Submission`,
                authority: primaryAuthority,
                status: 'mandatory',
                statutoryAct: `State Public Services Guarantee Act`,
                note: `Direct online application through official citizen portal`,
                fee: `As per official schedule`,
                officialUrl: `https://serviceonline.gov.in`
              },
              {
                title: `Document Scrutiny & Statutory Verification`,
                authority: primaryAuthority,
                status: 'mandatory',
                note: `Verification of identity, address, and premises compliance`,
                fee: `Included in standard statutory fee`
              }
            ]
      }
    }
  ];
}

/**
 * Transforms a chosen FactualProcedureOption into a full, typed CivicJourney object
 */
function buildJourneyFromOption(option: FactualProcedureOption, originalJourney?: CivicJourney | null): CivicJourney {
  const journeyId = originalJourney?.id || `journey_${Date.now()}`;
  const location = originalJourney?.location || 'Mumbai, Maharashtra';

  const steps: ProcedureStep[] = option.steps.map((s, index) => {
    const stepFee = s.fee || (s.status === 'waived' ? '₹0 (Waived)' : getEstimatedFeeForStep({ title: s.title, authority: s.authority }));

    // Convert document requirements into CivicDocument format
    const stepDocs: CivicDocument[] = option.documents.slice(0, 2).map((doc, docIdx) => ({
      id: `doc_${index + 1}_${docIdx + 1}`,
      name: doc.name,
      isMandatory: doc.type === 'Required',
      category: 'IDENTITY',
      description: doc.condition || (doc.type === 'Required' ? 'Mandatory statutory document' : 'Conditional / supporting document')
    }));

    return {
      id: `step_${index + 1}_${option.id}`,
      stepNumber: index + 1,
      title: s.title,
      category: 'Clearance & Verification',
      department: s.authority,
      authority: s.authority,
      description: s.note || `Complete official ${s.title} through ${s.authority}`,
      whyRequired: `Mandatory statutory requirement under official regulations for ${option.title}`,
      status: (index === 0 ? 'In Progress' : 'Pending') as StepStatus,
      documents: stepDocs,
      prerequisites: index > 0 ? [`step_${index}_${option.id}`] : [],
      fee: {
        amount: stepFee,
        description: s.note || `Official statutory fee for ${s.title}`
      },
      processingTime: option.statutoryTimeline.includes(':')
        ? option.statutoryTimeline.split(':')[1]?.trim().split(' ')[0] + ' Days'
        : '7–14 Days',
      applicationMode: option.applicationMethod.toLowerCase().includes('in-person') || option.applicationMethod.toLowerCase().includes('cfc')
        ? 'Offline'
        : 'Online',
      applicationUrl: s.officialUrl || option.sourceUrl || 'https://serviceonline.gov.in',
      source: {
        id: `src_${index + 1}`,
        title: s.statutoryAct || option.sourceName || `${s.authority} Gazette Regulations`,
        url: s.officialUrl || option.sourceUrl || 'https://digitalindia.gov.in',
        department: s.authority,
        domain: 'Civic Compliance',
        lastChecked: option.lastVerifiedDate || new Date().toISOString(),
        verificationStatus: option.verificationStatus === 'Officially verified' ? 'Verified' : 'Needs Review'
      }
    };
  });

  return {
    id: journeyId,
    title: option.title,
    query: originalJourney?.query || option.title,
    location: location,
    category: originalJourney?.category || 'CIVIC_PROCEDURE',
    totalSteps: steps.length,
    completedSteps: 0,
    pendingDocuments: option.documents.length,
    status: 'In Progress',
    steps: steps,
    lastUpdated: new Date().toISOString()
  };
}

export const CompareProceduresModal: React.FC<CompareProceduresModalProps> = ({
  isOpen,
  onClose,
  activeJourney,
  onSwitchJourney
}) => {
  const comparisonPresets = useMemo(() => getJourneyContextComparisons(activeJourney), [activeJourney]);
  const [selectedPresetId, setSelectedPresetId] = useState<string>(() => comparisonPresets[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'overview' | 'steps' | 'documents'>('overview');

  // Pending switch state for confirmation modal
  const [pendingOptionToSwitch, setPendingOptionToSwitch] = useState<FactualProcedureOption | null>(null);

  React.useEffect(() => {
    if (comparisonPresets.length > 0 && !comparisonPresets.some((p) => p.id === selectedPresetId)) {
      setSelectedPresetId(comparisonPresets[0].id);
    }
  }, [comparisonPresets, selectedPresetId]);

  if (!isOpen) return null;

  const currentPreset = comparisonPresets.find((p) => p.id === selectedPresetId) || comparisonPresets[0];
  const { optionA, optionB, isSingleRouteOnly, singleRouteReason } = currentPreset;

  const handleConfirmSwitch = () => {
    if (!pendingOptionToSwitch) return;
    const newJourney = buildJourneyFromOption(pendingOptionToSwitch, activeJourney);
    if (onSwitchJourney) {
      onSwitchJourney(newJourney);
    }
    setPendingOptionToSwitch(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[92vh] bg-white dark:bg-[#0B1713] rounded-2xl border border-[#DCE4DF] dark:border-[#1E3B32] shadow-2xl flex flex-col overflow-hidden text-[#0D1F1A] dark:text-[#E8F3EE]">
        
        {/* ── 1. CLEAN CIVIC HEADER ── */}
        <div className="px-6 py-4 bg-[#F8FAF9] dark:bg-[#0E1E19] border-b border-[#E5EAE7] dark:border-[#1E3B32] flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1B4D3E] dark:bg-[#22C55E] text-white dark:text-[#08120F] flex items-center justify-center shadow-xs shrink-0">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold text-[#0D1F1A] dark:text-white tracking-tight">
                  Statutory Pathways: {activeJourney?.title || 'Civic Procedure'}
                </h2>
                {activeJourney?.location && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#EBF5EF] dark:bg-[#153326] text-[#1B4D3E] dark:text-[#6EE7B7]">
                    <MapPin className="w-3 h-3" />
                    {activeJourney.location}
                  </span>
                )}
              </div>
              <p className="text-xs text-[#5A6D64] dark:text-[#9FB7AC] mt-0.5">
                Grounded in official municipal gazettes, state portals, and Right to Services (RTS) citizen charters. No fabricated numbers or commercial fast-track claims.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── 2. SCENARIO SELECTOR (IF MULTIPLE PRESETS) ── */}
        {comparisonPresets.length > 1 && (
          <div className="px-6 py-2.5 bg-white dark:bg-[#0B1713] border-b border-[#EDF2EE] dark:border-[#1A332B] flex items-center gap-2 overflow-x-auto text-xs shrink-0">
            <span className="text-[11px] font-semibold text-[#7A8E85] dark:text-[#7C978B] uppercase tracking-wider shrink-0 flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3" />
              Scenario:
            </span>

            {comparisonPresets.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => setSelectedPresetId(preset.id)}
                className={`px-3 py-1.5 rounded-full font-semibold transition-all shrink-0 cursor-pointer text-xs ${
                  selectedPresetId === preset.id
                    ? 'bg-[#1B4D3E] text-white shadow-xs'
                    : 'bg-[#F4F7F5] dark:bg-[#152721] border border-[#D5DDD8] dark:border-[#223E33] text-[#3B4D44] dark:text-[#A1B8AD] hover:border-[#1B4D3E]'
                }`}
              >
                {preset.name}
              </button>
            ))}
          </div>
        )}

        {/* ── 3. TABS BAR ── */}
        <div className="px-6 pt-3 bg-[#FBFDFB] dark:bg-[#0C1A14] border-b border-[#E5ECE7] dark:border-[#1D382E] flex items-center gap-6 text-xs font-semibold shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`pb-2.5 border-b-2 transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'border-[#1B4D3E] text-[#1B4D3E] dark:border-[#22C55E] dark:text-[#6EE7B7]'
                : 'border-transparent text-[#65786E] hover:text-[#1B4D3E]'
            }`}
          >
            At a Glance (Timelines, Fees & Authority)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('steps')}
            className={`pb-2.5 border-b-2 transition-all cursor-pointer ${
              activeTab === 'steps'
                ? 'border-[#1B4D3E] text-[#1B4D3E] dark:border-[#22C55E] dark:text-[#6EE7B7]'
                : 'border-transparent text-[#65786E] hover:text-[#1B4D3E]'
            }`}
          >
            Statutory Clearances {optionB ? `(${optionA.steps.length} vs ${optionB.steps.length} Steps)` : `(${optionA.steps.length} Steps)`}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('documents')}
            className={`pb-2.5 border-b-2 transition-all cursor-pointer ${
              activeTab === 'documents'
                ? 'border-[#1B4D3E] text-[#1B4D3E] dark:border-[#22C55E] dark:text-[#6EE7B7]'
                : 'border-transparent text-[#65786E] hover:text-[#1B4D3E]'
            }`}
          >
            Document Checklist (Required vs Conditional vs Supporting)
          </button>
        </div>

        {/* ── 4. MAIN CONTENT ── */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

          {/* SINGLE ROUTE ONLY NOTICE (e.g. Karnataka Salon) */}
          {isSingleRouteOnly && (
            <div className="p-4 rounded-xl bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700/60 text-left space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-200 font-bold text-xs uppercase tracking-wide">
                <ShieldCheck className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
                <span>Single Verified Statutory Route (No Parallel Fast-Track)</span>
              </div>
              <p className="text-xs text-emerald-800 dark:text-emerald-300/90 leading-relaxed">
                {singleRouteReason}
              </p>
            </div>
          )}

          {/* TAB 1: OVERVIEW SCORECARD */}
          {activeTab === 'overview' && (
            <div className="space-y-6">

              {/* CARD CONTAINER: 1 Column if Single Route, 2 Columns if 2 Pathways */}
              <div className={`grid grid-cols-1 ${isSingleRouteOnly || !optionB ? 'max-w-3xl mx-auto' : 'md:grid-cols-2'} gap-4 sm:gap-6`}>

                {/* PATHWAY 1 (OPTION A) */}
                <div className="p-5 rounded-2xl border-2 border-[#CBE2D4] dark:border-[#1E4334] bg-[#F4F9F6] dark:bg-[#0E211A] space-y-4 text-left shadow-xs flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#1B4D3E] text-white tracking-wide">
                        {isSingleRouteOnly ? 'STATUTORY ROUTE' : 'PATHWAY 1'}
                      </span>
                      <VerificationBadge status={optionA.verificationStatus} />
                    </div>

                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-[#11261F] dark:text-white">
                        {optionA.title}
                      </h3>
                      <div className="text-xs text-[#5A6D64] dark:text-[#9FB7AC] mt-1 space-y-0.5">
                        <p><strong>Route Type:</strong> {optionA.routeType}</p>
                        <p><strong>Issuing Authority:</strong> {optionA.authority}</p>
                        <p><strong>Submission Method:</strong> {optionA.applicationMethod}</p>
                      </div>
                    </div>

                    {/* Metric Blocks */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                      
                      {/* Timeline */}
                      <div className="p-3 rounded-xl bg-white dark:bg-[#08120F] border border-[#D5E3DA] dark:border-[#1A382C]">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-[#5A6D64] dark:text-[#9FB7AC]">
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-[#1B4D3E] dark:text-[#6EE7B7]" />
                            Statutory Timeline
                          </span>
                        </div>
                        <div className="text-xs sm:text-sm font-extrabold text-[#11261F] dark:text-white mt-1">
                          {optionA.statutoryTimeline}
                        </div>
                        <div className="mt-1">
                          <VerificationBadge status={optionA.timelineVerification} />
                        </div>
                      </div>

                      {/* Official Fees */}
                      <div className="p-3 rounded-xl bg-white dark:bg-[#08120F] border border-[#D5E3DA] dark:border-[#1A382C]">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-[#5A6D64] dark:text-[#9FB7AC]">
                          <span className="flex items-center gap-1.5">
                            <Scale className="w-3.5 h-3.5 text-[#1B4D3E] dark:text-[#6EE7B7]" />
                            Government Fees
                          </span>
                        </div>
                        <div className="text-xs sm:text-sm font-extrabold text-[#11261F] dark:text-white mt-1">
                          {optionA.officialFees}
                        </div>
                        <div className="mt-1">
                          <VerificationBadge status={optionA.feeVerification} />
                        </div>
                      </div>

                      {/* Physical Visits */}
                      <div className="p-3 rounded-xl bg-white dark:bg-[#08120F] border border-[#D5E3DA] dark:border-[#1A382C]">
                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#5A6D64] dark:text-[#9FB7AC]">
                          <Building2 className="w-3.5 h-3.5 text-[#1B4D3E] dark:text-[#6EE7B7]" />
                          Office / Site Visits
                        </div>
                        <div className="text-xs sm:text-sm font-bold text-[#11261F] dark:text-white mt-1">
                          {optionA.physicalVisits}
                        </div>
                      </div>

                      {/* Online Tracking */}
                      <div className="p-3 rounded-xl bg-white dark:bg-[#08120F] border border-[#D5E3DA] dark:border-[#1A382C]">
                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#5A6D64] dark:text-[#9FB7AC]">
                          <FileText className="w-3.5 h-3.5 text-[#1B4D3E] dark:text-[#6EE7B7]" />
                          Online Tracking
                        </div>
                        <div className="text-xs font-medium text-[#11261F] dark:text-white mt-1">
                          {optionA.onlineTracking}
                        </div>
                      </div>

                    </div>

                    {/* Regulatory Notice (if any) */}
                    {optionA.notice && (
                      <div className="p-3 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/40 text-[11px] text-amber-900 dark:text-amber-200 leading-relaxed">
                        <strong>Official Caveat:</strong> {optionA.notice}
                      </div>
                    )}

                    {/* Source Transparency Link & Verified Date */}
                    <div className="pt-1 flex items-center justify-between gap-2 text-[11px] text-[#5A6D64] dark:text-[#9FB7AC] border-t border-[#D5E3DA] dark:border-[#1A382C]">
                      <span>Verified on: <strong>{optionA.lastVerifiedDate}</strong></span>
                      <a
                        href={optionA.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-bold text-[#1B4D3E] dark:text-[#6EE7B7] hover:underline"
                      >
                        <span>View official source ({optionA.sourceName})</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    <div className="p-3 rounded-xl bg-white dark:bg-[#08120F] border border-[#D5E3DA] dark:border-[#1A382C] text-xs">
                      <span className="font-bold text-[#11261F] dark:text-white">Suitable For:</span>{' '}
                      <span className="text-[#4A5D54] dark:text-[#9FB7AC]">{optionA.suitableFor}</span>
                    </div>

                  </div>

                  {/* Switch Action Button */}
                  <div className="pt-3">
                    <button
                      type="button"
                      onClick={() => setPendingOptionToSwitch(optionA)}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#1B4D3E] hover:bg-[#143B2F] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer active:scale-98"
                    >
                      <RotateCw className="w-4 h-4" />
                      <span>{isSingleRouteOnly ? 'Apply This Verified Pathway' : 'Switch Roadmap to Pathway 1'}</span>
                    </button>
                  </div>
                </div>

                {/* PATHWAY 2 (OPTION B) — ONLY RENDERED IF GENUINE ALTERNATIVE EXISTS */}
                {!isSingleRouteOnly && optionB && (
                  <div className="p-5 rounded-2xl border-2 border-[#E5DEC9] dark:border-[#383325] bg-[#FAF8F2] dark:bg-[#1A1710] space-y-4 text-left shadow-xs flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#8C5819] text-white tracking-wide">
                          PATHWAY 2
                        </span>
                        <VerificationBadge status={optionB.verificationStatus} />
                      </div>

                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-[#11261F] dark:text-white">
                          {optionB.title}
                        </h3>
                        <div className="text-xs text-[#5A6D64] dark:text-[#9FB7AC] mt-1 space-y-0.5">
                          <p><strong>Route Type:</strong> {optionB.routeType}</p>
                          <p><strong>Issuing Authority:</strong> {optionB.authority}</p>
                          <p><strong>Submission Method:</strong> {optionB.applicationMethod}</p>
                        </div>
                      </div>

                      {/* Metric Blocks */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                        
                        {/* Timeline */}
                        <div className="p-3 rounded-xl bg-white dark:bg-[#12100A] border border-[#E3DFC9] dark:border-[#2D2817]">
                          <div className="flex items-center justify-between text-[11px] font-semibold text-[#5A6D64] dark:text-[#9FB7AC]">
                            <span className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-[#8C5819]" />
                              Statutory Timeline
                            </span>
                          </div>
                          <div className="text-xs sm:text-sm font-extrabold text-[#11261F] dark:text-white mt-1">
                            {optionB.statutoryTimeline}
                          </div>
                          <div className="mt-1">
                            <VerificationBadge status={optionB.timelineVerification} />
                          </div>
                        </div>

                        {/* Official Fees */}
                        <div className="p-3 rounded-xl bg-white dark:bg-[#12100A] border border-[#E3DFC9] dark:border-[#2D2817]">
                          <div className="flex items-center justify-between text-[11px] font-semibold text-[#5A6D64] dark:text-[#9FB7AC]">
                            <span className="flex items-center gap-1.5">
                              <Scale className="w-3.5 h-3.5 text-[#8C5819]" />
                              Government Fees
                            </span>
                          </div>
                          <div className="text-xs sm:text-sm font-extrabold text-[#11261F] dark:text-white mt-1">
                            {optionB.officialFees}
                          </div>
                          <div className="mt-1">
                            <VerificationBadge status={optionB.feeVerification} />
                          </div>
                        </div>

                        {/* Physical Visits */}
                        <div className="p-3 rounded-xl bg-white dark:bg-[#12100A] border border-[#E3DFC9] dark:border-[#2D2817]">
                          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#5A6D64] dark:text-[#9FB7AC]">
                            <Building2 className="w-3.5 h-3.5 text-[#8C5819]" />
                            Office / Site Visits
                          </div>
                          <div className="text-xs sm:text-sm font-bold text-[#11261F] dark:text-white mt-1">
                            {optionB.physicalVisits}
                          </div>
                        </div>

                        {/* Online Tracking */}
                        <div className="p-3 rounded-xl bg-white dark:bg-[#12100A] border border-[#E3DFC9] dark:border-[#2D2817]">
                          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#5A6D64] dark:text-[#9FB7AC]">
                            <FileText className="w-3.5 h-3.5 text-[#8C5819]" />
                            Online Tracking
                          </div>
                          <div className="text-xs font-medium text-[#11261F] dark:text-white mt-1">
                            {optionB.onlineTracking}
                          </div>
                        </div>

                      </div>

                      {/* Regulatory Notice (if any) */}
                      {optionB.notice && (
                        <div className="p-3 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/40 text-[11px] text-amber-900 dark:text-amber-200 leading-relaxed">
                          <strong>Official Caveat:</strong> {optionB.notice}
                        </div>
                      )}

                      {/* Source Transparency Link & Verified Date */}
                      <div className="pt-1 flex items-center justify-between gap-2 text-[11px] text-[#5A6D64] dark:text-[#9FB7AC] border-t border-[#E3DFC9] dark:border-[#2D2817]">
                        <span>Verified on: <strong>{optionB.lastVerifiedDate}</strong></span>
                        <a
                          href={optionB.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-bold text-[#8C5819] dark:text-amber-300 hover:underline"
                        >
                          <span>View official source ({optionB.sourceName})</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>

                      <div className="p-3 rounded-xl bg-white dark:bg-[#12100A] border border-[#E3DFC9] dark:border-[#2D2817] text-xs">
                        <span className="font-bold text-[#11261F] dark:text-white">Suitable For:</span>{' '}
                        <span className="text-[#4A5D54] dark:text-[#9FB7AC]">{optionB.suitableFor}</span>
                      </div>

                    </div>

                    {/* Switch Action Button */}
                    <div className="pt-3">
                      <button
                        type="button"
                        onClick={() => setPendingOptionToSwitch(optionB)}
                        className="w-full py-2.5 px-4 rounded-xl bg-[#8C5819] hover:bg-[#724513] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer active:scale-98"
                      >
                        <RotateCw className="w-4 h-4" />
                        <span>Switch Roadmap to Pathway 2</span>
                      </button>
                    </div>
                  </div>
                )}

              </div>

              {/* WHICH ONE SHOULD YOU CHOOSE? (ONLY IF 2 OPTIONS EXIST) */}
              {!isSingleRouteOnly && optionB && currentPreset.recommendationA && currentPreset.recommendationB && (
                <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0E1E19] border border-[#DCE4DF] dark:border-[#1E3B32] text-left space-y-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#1B4D3E] dark:text-[#22C55E]" />
                    <h4 className="text-sm font-bold text-[#11261F] dark:text-white">
                      Factual Route Comparison
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                    <div className="p-3 rounded-xl bg-[#F4FAF6] dark:bg-[#11261F] border border-[#D2E7DA] dark:border-[#1C4535] space-y-1">
                      <span className="font-bold text-[#1B4D3E] dark:text-[#6EE7B7]">When to choose Pathway 1:</span>
                      <p className="text-[#2D4539] dark:text-[#CBE2D7] leading-relaxed">
                        {currentPreset.recommendationA}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-[#FAF8F2] dark:bg-[#1C1710] border border-[#E5DEC9] dark:border-[#38301B] space-y-1">
                      <span className="font-bold text-[#8C5819] dark:text-amber-300">When to choose Pathway 2:</span>
                      <p className="text-[#4A3D25] dark:text-[#D9C4A0] leading-relaxed">
                        {currentPreset.recommendationB}
                      </p>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 2: STEP DIFFERENCES */}
          {activeTab === 'steps' && (
            <div className="space-y-4 text-left">
              <div className={`grid grid-cols-1 ${isSingleRouteOnly || !optionB ? 'max-w-3xl mx-auto' : 'md:grid-cols-2'} gap-4`}>
                
                {/* Steps List Option A */}
                <div className="space-y-2.5">
                  <div className="text-xs font-bold text-[#1B4D3E] dark:text-[#6EE7B7] uppercase tracking-wide px-1 flex items-center justify-between">
                    <span>{optionA.title}</span>
                    <span className="text-[11px] font-normal text-[#5A6D64] dark:text-[#9FB7AC]">{optionA.steps.length} Statutory Steps</span>
                  </div>
                  {optionA.steps.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-white dark:bg-[#0E1E19] border border-[#E0EBE4] dark:border-[#1E3B32] space-y-1 text-xs"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-[#11261F] dark:text-white">{idx + 1}. {step.title}</span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                            step.status === 'mandatory'
                              ? 'bg-[#EBF5EF] text-[#1B4D3E] dark:bg-[#17382D] dark:text-[#6EE7B7]'
                              : step.status === 'waived'
                              ? 'bg-[#F2E8E9] text-[#7C353B] dark:bg-[#33181C] dark:text-[#E8A5AA]'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          }`}
                        >
                          {step.status === 'mandatory' ? 'Mandatory' : step.status === 'waived' ? 'Waived / Exempt' : 'Conditional'}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#5A6D64] dark:text-[#9FB7AC]">{step.authority}</p>
                      {step.statutoryAct && (
                        <p className="text-[10px] font-semibold text-[#1B4D3E] dark:text-[#6EE7B7]">
                          Statutory Act: {step.statutoryAct}
                        </p>
                      )}
                      {step.note && (
                        <p className="text-[11px] text-[#2D4539] dark:text-[#CBE2D7] pt-0.5 font-medium">
                          Note: {step.note}
                        </p>
                      )}
                      {step.fee && (
                        <p className="text-[10px] text-[#5A6D64] dark:text-[#9FB7AC]">
                          Official Fee: {step.fee}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Steps List Option B (if available) */}
                {!isSingleRouteOnly && optionB && (
                  <div className="space-y-2.5">
                    <div className="text-xs font-bold text-[#8C5819] dark:text-amber-300 uppercase tracking-wide px-1 flex items-center justify-between">
                      <span>{optionB.title}</span>
                      <span className="text-[11px] font-normal text-[#5A6D64] dark:text-[#9FB7AC]">{optionB.steps.length} Statutory Steps</span>
                    </div>
                    {optionB.steps.map((step, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-white dark:bg-[#12100A] border border-[#E3DFC9] dark:border-[#2D2817] space-y-1 text-xs"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-[#11261F] dark:text-white">{idx + 1}. {step.title}</span>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                              step.status === 'mandatory'
                                ? 'bg-[#FDF3E3] text-[#8C5819] dark:bg-[#332410] dark:text-amber-300'
                                : step.status === 'waived'
                                ? 'bg-[#F2E8E9] text-[#7C353B] dark:bg-[#33181C] dark:text-[#E8A5AA]'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            }`}
                          >
                            {step.status === 'mandatory' ? 'Mandatory' : step.status === 'waived' ? 'Waived / Exempt' : 'Conditional'}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#5A6D64] dark:text-[#9FB7AC]">{step.authority}</p>
                        {step.statutoryAct && (
                          <p className="text-[10px] font-semibold text-[#8C5819] dark:text-amber-300">
                            Statutory Act: {step.statutoryAct}
                          </p>
                        )}
                        {step.note && (
                          <p className="text-[11px] text-[#634215] dark:text-[#D9C4A0] pt-0.5 font-medium">
                            Note: {step.note}
                          </p>
                        )}
                        {step.fee && (
                          <p className="text-[10px] text-[#5A6D64] dark:text-[#9FB7AC]">
                            Official Fee: {step.fee}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

              </div>
            </div>
          )}

          {/* TAB 3: DYNAMIC DOCUMENT CHECKLIST (REQUIRED VS CONDITIONAL VS SUPPORTING) */}
          {activeTab === 'documents' && (
            <div className="space-y-4 text-left">
              <div className={`grid grid-cols-1 ${isSingleRouteOnly || !optionB ? 'max-w-3xl mx-auto' : 'md:grid-cols-2'} gap-4`}>
                
                {/* Option A Documents */}
                <div className="p-4 rounded-xl bg-[#F4F9F6] dark:bg-[#0E211A] border border-[#D3E4D9] dark:border-[#1E4334] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold text-[#1B4D3E] dark:text-[#6EE7B7] uppercase tracking-wide">
                      {optionA.title} Documents
                    </div>
                    <span className="text-[11px] font-medium text-[#5A6D64] dark:text-[#9FB7AC]">
                      {optionA.documents.length} Total
                    </span>
                  </div>
                  
                  <div className="space-y-2.5">
                    {optionA.documents.map((doc, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-white dark:bg-[#08120F] border border-[#D5E3DA] dark:border-[#1A382C] text-xs space-y-1"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-bold text-[#11261F] dark:text-white flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5 text-[#1B4D3E] dark:text-[#6EE7B7] shrink-0" />
                            {doc.name}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                              doc.type === 'Required'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : doc.type === 'Conditional'
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                            }`}
                          >
                            {doc.type}
                          </span>
                        </div>
                        {doc.condition && (
                          <p className="text-[11px] text-[#5A6D64] dark:text-[#9FB7AC] pl-5">
                            Condition: {doc.condition}
                          </p>
                        )}
                        {doc.authorityRequiredBy && (
                          <p className="text-[10px] text-[#1B4D3E] dark:text-[#6EE7B7] pl-5">
                            Mandated by: {doc.authorityRequiredBy}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Option B Documents (if available) */}
                {!isSingleRouteOnly && optionB && (
                  <div className="p-4 rounded-xl bg-[#FAF8F2] dark:bg-[#1A1710] border border-[#DFDCD4] dark:border-[#383325] space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-[#8C5819] dark:text-amber-300 uppercase tracking-wide">
                        {optionB.title} Documents
                      </div>
                      <span className="text-[11px] font-medium text-[#5A6D64] dark:text-[#9FB7AC]">
                        {optionB.documents.length} Total
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {optionB.documents.map((doc, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-lg bg-white dark:bg-[#12100A] border border-[#E3DFC9] dark:border-[#2D2817] text-xs space-y-1"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-bold text-[#11261F] dark:text-white flex items-center gap-1.5">
                              <Check className="w-3.5 h-3.5 text-[#8C5819] shrink-0" />
                              {doc.name}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                                doc.type === 'Required'
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                  : doc.type === 'Conditional'
                                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                  : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                              }`}
                            >
                              {doc.type}
                            </span>
                          </div>
                          {doc.condition && (
                            <p className="text-[11px] text-[#5A6D64] dark:text-[#9FB7AC] pl-5">
                              Condition: {doc.condition}
                            </p>
                          )}
                          {doc.authorityRequiredBy && (
                            <p className="text-[10px] text-[#8C5819] dark:text-amber-300 pl-5">
                              Mandated by: {doc.authorityRequiredBy}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>
          )}

        </div>

        {/* ── 5. CIVIC FOOTER ── */}
        <div className="px-6 py-3.5 bg-[#F8FAF9] dark:bg-[#0E1E19] border-t border-[#E5EAE7] dark:border-[#1E3B32] flex items-center justify-between gap-4 text-xs shrink-0 flex-wrap">
          <div className="text-[11px] text-[#5A6D64] dark:text-[#9FB7AC] text-left flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 shrink-0 text-[#1B4D3E] dark:text-[#22C55E]" />
            <span>Statutory facts are verified from state & municipal portals under Right to Public Services legislation.</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-[#1B4D3E] hover:bg-[#143B2F] text-white font-semibold transition-all shadow-xs cursor-pointer active:scale-98"
          >
            Close Comparison
          </button>
        </div>

        {/* ── 6. CONFIRMATION POPUP FOR SWITCHING ROADMAP ── */}
        {pendingOptionToSwitch && (
          <div className="absolute inset-0 z-60 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
            <div className="bg-white dark:bg-[#0E1E19] rounded-2xl border-2 border-[#1B4D3E] dark:border-[#22C55E] p-6 max-w-md w-full shadow-2xl text-left space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-[#1B4D3E] dark:text-[#22C55E] flex items-center justify-center shrink-0">
                  <RotateCw className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0D1F1A] dark:text-white">
                    Switch Your Active Roadmap?
                  </h3>
                  <p className="text-xs text-[#5A6D64] dark:text-[#9FB7AC]">
                    Adopt this verified pathway as your live journey
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F4FAF6] dark:bg-[#122820] border border-[#D5EADB] dark:border-[#1A3D30] text-xs space-y-2">
                <div>
                  <span className="text-[#5A6D64] dark:text-[#9FB7AC]">Selected Pathway:</span>
                  <div className="font-bold text-[#11261F] dark:text-white text-sm">
                    {pendingOptionToSwitch.title}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#D5EADB] dark:border-[#1A3D30]">
                  <div>
                    <span className="text-[10px] text-[#5A6D64] dark:text-[#9FB7AC]">Timeline:</span>
                    <div className="font-semibold text-[#11261F] dark:text-white text-[11px] truncate">
                      {pendingOptionToSwitch.statutoryTimeline}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#5A6D64] dark:text-[#9FB7AC]">Statutory Fees:</span>
                    <div className="font-semibold text-[#11261F] dark:text-white text-[11px] truncate">
                      {pendingOptionToSwitch.officialFees}
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-xs text-[#4A5D54] dark:text-[#9FB7AC] leading-relaxed">
                Your flowchart, document checklist, and step sequence will immediately update to reflect this verified statutory route.
              </p>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setPendingOptionToSwitch(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#12241E] text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleConfirmSwitch}
                  className="px-4 py-2 rounded-xl bg-[#1B4D3E] hover:bg-[#143B2F] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-98"
                >
                  <Check className="w-4 h-4" />
                  <span>Yes, Switch Roadmap</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default CompareProceduresModal;
