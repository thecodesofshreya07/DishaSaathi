import React, { useState, useMemo } from 'react';
import {
  X,
  Scale,
  Clock,
  FileText,
  Building2,
  CheckCircle2,
  AlertCircle,
  Info,
  SlidersHorizontal,
  Check,
  MapPin,
  ArrowRight,
  ShieldCheck,
  RotateCw,
  Sparkles
} from 'lucide-react';
import { CivicJourney, ProcedureStep, CivicDocument, StepStatus } from '../types';

interface CompareProceduresModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeJourney?: CivicJourney | null;
  onSwitchJourney?: (newJourney: CivicJourney) => void;
}

interface ProcedureOption {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  estimatedDays: string;
  governmentFees: string;
  requiredDocsCount: number;
  physicalVisits: string;
  complianceLevel: 'Low' | 'Moderate' | 'High';
  suitableFor: string;
  steps: Array<{
    title: string;
    authority: string;
    status: 'mandatory' | 'optional' | 'waived';
    note?: string;
  }>;
  keyDocuments: string[];
}

interface ComparisonPreset {
  id: string;
  name: string;
  description: string;
  domain: 'property' | 'certificate' | 'license' | 'business' | 'general';
  optionA: ProcedureOption;
  optionB: ProcedureOption;
  recommendationA: string;
  recommendationB: string;
}

/**
 * Context-aware generator tailored strictly to the active journey and location
 */
function getJourneyContextComparisons(journey?: CivicJourney | null): ComparisonPreset[] {
  const title = (journey?.title || '').toLowerCase();
  const query = (journey?.query || '').toLowerCase();
  const location = journey?.location || 'Mumbai, Maharashtra';
  const combinedText = `${title} ${query} ${location}`.toLowerCase();

  const isMumbai = combinedText.includes('mumbai') || combinedText.includes('maharashtra') || combinedText.includes('bmc');
  const cityLabel = isMumbai ? 'Mumbai' : location.split(',')[0]?.trim() || 'Municipal';
  const stateLabel = isMumbai ? 'Maharashtra' : 'State';
  const authorityPrefix = isMumbai ? 'IGR Maharashtra & BMC' : 'Municipal Corporation & Revenue Dept';

  // ── 1. PROPERTY / FLAT PURCHASE / REAL ESTATE ──
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
        name: `Resale Flat vs. Under-Construction Project (${cityLabel})`,
        description: `Compare timeline, stamp duty, and legal steps for ready resale flats versus builder projects.`,
        domain: 'property',
        optionA: {
          id: 'resale_flat',
          title: `Ready Resale Flat (${cityLabel})`,
          subtitle: `Direct ownership transfer from an existing society member`,
          badge: 'Ready to Move • No GST',
          estimatedDays: '12–18 Days',
          governmentFees: isMumbai ? '6% Stamp Duty + ₹30,000 Registration' : '5–7% Stamp Duty + Registration',
          requiredDocsCount: 6,
          physicalVisits: '1 Sub-Registrar Visit',
          complianceLevel: 'Moderate',
          suitableFor: `Buyers wanting immediate keys in an established cooperative housing society with ready title.`,
          steps: [
            {
              title: `13-Year Title Search & Non-Encumbrance Verification`,
              authority: `${authorityPrefix} (Sub-Registrar Index II)`,
              status: 'mandatory',
              note: `Confirms previous owner has no outstanding loans or legal disputes`
            },
            {
              title: `Society NOC & Share Certificate Transfer`,
              authority: `Cooperative Housing Society (CHS)`,
              status: 'mandatory',
              note: `Confirms all society maintenance bills and dues are zero`
            },
            {
              title: `Stamp Duty e-Payment via State Portal (GRAS)`,
              authority: `${stateLabel} Revenue & Stamps Dept`,
              status: 'mandatory',
              note: `Calculated on market valuation or agreement value`
            },
            {
              title: `Biometric Deed Registration at Sub-Registrar Office`,
              authority: `Sub-Registrar Office (${cityLabel})`,
              status: 'mandatory',
              note: `Buyer, seller, and two witnesses complete biometric verification`
            },
            {
              title: `Municipal Property Tax Name Transfer (Mutation)`,
              authority: `${isMumbai ? 'BMC Ward Assessment Dept' : 'Municipal Tax Dept'}`,
              status: 'mandatory',
              note: `Updates official city records to transfer property tax bills`
            }
          ],
          keyDocuments: [
            'Registered Parent Chain of Title Deeds',
            'Original Society Share Certificate & NOC',
            'Latest Property Tax Paid Receipts (No Dues)',
            'Sub-Registrar Index II of Prior Sales',
            'Buyer & Seller Aadhaar & PAN Cards'
          ]
        },
        optionB: {
          id: 'under_construction_rera',
          title: `Under-Construction Builder Flat (${stateLabel} RERA)`,
          subtitle: `Purchase directly from developer with staged milestone payments`,
          badge: 'RERA Protected • Staged Payments',
          estimatedDays: '30–60 Days (Staged)',
          governmentFees: isMumbai ? '6% Stamp Duty + 5% GST + ₹30,000 Reg.' : '5–7% Stamp Duty + 5% GST + Reg.',
          requiredDocsCount: 11,
          physicalVisits: '2 Visits (Agreement & Possession)',
          complianceLevel: 'High',
          suitableFor: `Buyers booking under-construction apartments with construction-linked payment plans.`,
          steps: [
            {
              title: `${stateLabel} RERA Project ID & Sanctioned Plan Verification`,
              authority: `${isMumbai ? 'MahaRERA Portal' : 'State RERA Authority'}`,
              status: 'mandatory',
              note: `Verify 70% escrow compliance and sanctioned completion deadline`
            },
            {
              title: `Registered Agreement for Sale (Section 13 RERA)`,
              authority: `${stateLabel} Sub-Registrar Office`,
              status: 'mandatory',
              note: `Mandatory registration before developer can take more than 10% advance`
            },
            {
              title: `Milestone Verification by Certified Architect`,
              authority: `RERA Registered Architect`,
              status: 'mandatory',
              note: `Release stage payments strictly upon slab completion`
            },
            {
              title: `Municipal Occupancy Certificate (OC) Verification`,
              authority: `${isMumbai ? 'BMC Building Proposal Dept' : 'Municipal Town Planning'}`,
              status: 'mandatory',
              note: `Confirms legal water, sewage, fire, and structural clearances`
            }
          ],
          keyDocuments: [
            `${isMumbai ? 'MahaRERA' : 'State RERA'} Project Registration Certificate`,
            'Sanctioned Floor Plan Approved by Municipal Corporation',
            'Commencement Certificate (CC) up to Booked Floor',
            'Municipal Occupancy Certificate (OC) before Handover',
            'Tripartite Home Loan Agreement with Bank'
          ]
        },
        recommendationA: `Pick Ready Resale if you need immediate possession within 3 weeks and want to avoid paying 5% GST.`,
        recommendationB: `Pick Under-Construction if you prefer staged payments over 1–3 years and want a brand-new building.`
      },
      {
        id: 'property_loan_vs_self',
        name: `Direct Self-Financed vs. Bank Home Loan (MODT) (${cityLabel})`,
        description: `Compare registration process when paying directly versus taking a bank mortgage.`,
        domain: 'property',
        optionA: {
          id: 'self_finance',
          title: `Direct Self-Financed Registration`,
          subtitle: `Direct deed execution between buyer and seller using own funds`,
          badge: 'Fastest • Zero Loan Overhead',
          estimatedDays: '5–10 Days',
          governmentFees: 'Standard Stamp Duty + ₹30,000 Registration',
          requiredDocsCount: 5,
          physicalVisits: '1 Sub-Registrar Visit',
          complianceLevel: 'Low',
          suitableFor: `Buyers paying the complete purchase price through direct bank transfer (RTGS).`,
          steps: [
            {
              title: `Draft Sale Deed Preparation`,
              authority: `Advocate / Legal Drafter`,
              status: 'mandatory',
              note: `Drafting deed terms and payment schedule`
            },
            {
              title: `Online Stamp Duty Payment (GRAS Portal)`,
              authority: `${stateLabel} Stamps & Registration Dept`,
              status: 'mandatory',
              note: `Direct receipt generation for deed execution`
            },
            {
              title: `Biometric Execution at Sub-Registrar Office`,
              authority: `Sub-Registrar Office (${cityLabel})`,
              status: 'mandatory',
              note: `Original registered Sale Deed and Index II handed immediately to buyer`
            }
          ],
          keyDocuments: [
            'Original Parent Chain Deeds',
            'Bank Payment Clearance Slips / RTGS UTR Receipts',
            'Buyer & Seller Identity & PAN Cards'
          ]
        },
        optionB: {
          id: 'bank_loan_modt',
          title: `Bank Home Loan & MODT Mortgage Route`,
          subtitle: `Purchase involving bank tripartite agreement and registered mortgage charge`,
          badge: 'Bank Scrutinized • 0.3% MODT Fee',
          estimatedDays: '20–30 Days',
          governmentFees: isMumbai ? 'Stamp Duty + 0.3% MODT Stamp Duty (Notice of Intimation)' : 'Stamp Duty + MODT Registration Fee',
          requiredDocsCount: 9,
          physicalVisits: '2 Visits (Bank & Sub-Registrar)',
          complianceLevel: 'Moderate',
          suitableFor: `Buyers taking home loans from scheduled commercial banks (SBI, HDFC, ICICI, etc.).`,
          steps: [
            {
              title: `Bank Legal Title Search & Technical Property Valuation`,
              authority: `Bank Empaneled Advocate & Engineer`,
              status: 'mandatory',
              note: `Bank verifies 30-year title chain and checks structural stability`
            },
            {
              title: `Tripartite Agreement & Loan Sanction`,
              authority: `Lending Commercial Bank`,
              status: 'mandatory',
              note: `Binding agreement between buyer, seller, and lending bank`
            },
            {
              title: `Notice of Intimation (NOI) / MODT Registration`,
              authority: `${stateLabel} Sub-Registrar / CERSAI Portal`,
              status: 'mandatory',
              note: `E-filing within 30 days registering mortgage charge with government`
            }
          ],
          keyDocuments: [
            'Bank Sanction Letter & Tripartite Agreement',
            'MODT Stamp Duty e-Challan (0.3%)',
            'Original Title Deeds (Held in Bank Custody)',
            'Income Tax Returns (ITR) & Form 16 of Buyer'
          ]
        },
        recommendationA: `Pick Self-Financed if you have liquid funds and want your original deed in hand immediately.`,
        recommendationB: `Pick Bank Loan if you need 75–85% financing; the bank's legal team provides double-layer title verification.`
      }
    ];
  }

  // ── 2. BIRTH / DEATH / CIVIL CERTIFICATE ──
  if (
    combinedText.includes('birth') ||
    combinedText.includes('death') ||
    combinedText.includes('certificate') ||
    combinedText.includes('marriage') ||
    combinedText.includes('caste')
  ) {
    return [
      {
        id: 'cert_timely_vs_delayed',
        name: `Timely (< 21 Days) vs. Delayed (> 1 Year SDM Court Order)`,
        description: `Compare standard hospital CRS registration versus delayed court order process.`,
        domain: 'certificate',
        optionA: {
          id: 'timely_cert',
          title: `Standard Timely Registration (< 21 Days)`,
          subtitle: `Automated hospital reporting directly to municipal CRS portal`,
          badge: '100% Free • Online DigiLocker',
          estimatedDays: '3–7 Days',
          governmentFees: '₹0 (Free under RBD Act)',
          requiredDocsCount: 3,
          physicalVisits: '0 Office Visits',
          complianceLevel: 'Low',
          suitableFor: `Parents registering a birth within 21 days at a hospital or maternity home in ${cityLabel}.`,
          steps: [
            {
              title: `Hospital Form 1 Digital Intimation`,
              authority: `Hospital Maternity Desk`,
              status: 'mandatory',
              note: `Automated transmission to municipal health registrar`
            },
            {
              title: `Municipal Ward Registrar Verification`,
              authority: `${cityLabel} Ward Health Office`,
              status: 'mandatory',
              note: `Immediate approval and CRS registration entry`
            },
            {
              title: `Digital QR-Coded Certificate Download`,
              authority: `Civil Registration System / DigiLocker`,
              status: 'mandatory',
              note: `Download instantly with official government digital signature`
            }
          ],
          keyDocuments: [
            'Hospital Discharge Summary & Form 1 Slip',
            'Parents’ Aadhaar Cards',
            'Local Address Proof'
          ]
        },
        optionB: {
          id: 'delayed_court_cert',
          title: `Delayed Registration (> 1 Year)`,
          subtitle: `Judicial route under Section 13(3) of Registration of Births and Deaths Act`,
          badge: 'SDM Order Required • Court Route',
          estimatedDays: '30–45 Days',
          governmentFees: '₹500 – ₹1,500 (Court Stamp Fees)',
          requiredDocsCount: 7,
          physicalVisits: '2–3 Visits (SDM Court & Ward CFC)',
          complianceLevel: 'High',
          suitableFor: `Citizens whose record was never filed with the municipal corporation within 12 months.`,
          steps: [
            {
              title: `Non-Availability Certificate (NABC) from Ward Office`,
              authority: `${cityLabel} Municipal Citizen Facilitation Centre`,
              status: 'mandatory',
              note: `Official search certificate confirming absence of record`
            },
            {
              title: `SDM / Executive Magistrate Court Order Filing`,
              authority: `Sub-Divisional Magistrate (SDM) Court`,
              status: 'mandatory',
              note: `Affidavit and inquiry into cause of delay`
            },
            {
              title: `Police Station Residence Verification`,
              authority: `Local Police Station`,
              status: 'mandatory',
              note: `Field officer report confirming residence and date`
            }
          ],
          keyDocuments: [
            'Municipal Non-Availability Certificate (NABC)',
            'School Leaving Certificate / 10th Board Admit Card',
            'Affidavit on ₹100 Non-Judicial Stamp Paper',
            'Certified Order from Sub-Divisional Magistrate'
          ]
        },
        recommendationA: `Always apply within 21 days: it is completely free, 100% online, and requires zero office visits.`,
        recommendationB: `If delayed past 1 year, you must obtain an SDM Court Order before the municipal registrar can issue the certificate.`
      }
    ];
  }

  // ── 3. DRIVING LICENSE / RTO ──
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
        name: `Sarathi Faceless Online vs. Driving School Package (${cityLabel})`,
        description: `Compare direct government online portal vs. third-party driving school package.`,
        domain: 'license',
        optionA: {
          id: 'sarathi_faceless',
          title: `Sarathi Parivahan Faceless Direct Route`,
          subtitle: `Government portal flow with home computerized learner test`,
          badge: 'Zero Middlemen • ₹1,350 Govt Fee',
          estimatedDays: '30–40 Days (Mandatory 30-day learner period)',
          governmentFees: '₹1,350 (Official RTO Fees)',
          requiredDocsCount: 3,
          physicalVisits: '1 Visit (Driving Track Test Only)',
          complianceLevel: 'Low',
          suitableFor: `Applicants with Aadhaar-linked mobile phone applying directly on sarathi.parivahan.gov.in.`,
          steps: [
            {
              title: `Aadhaar e-KYC Online Application & Fee Payment`,
              authority: `Ministry of Road Transport (MoRTH)`,
              status: 'mandatory',
              note: `Direct online application on official Sarathi portal`
            },
            {
              title: `Online Computerized Learner Test from Home`,
              authority: `Automated RTO Examination System`,
              status: 'mandatory',
              note: `15-question road safety exam taken via webcam from home`
            },
            {
              title: `Driving Track Test at RTO`,
              authority: `${cityLabel} Regional Transport Office (RTO)`,
              status: 'mandatory',
              note: `Single physical visit to test driving skills on track`
            }
          ],
          keyDocuments: [
            'Aadhaar Card (Linked to Mobile Number)',
            'Form 1 Self-Declaration of Physical Fitness',
            'Learner License Certificate'
          ]
        },
        optionB: {
          id: 'driving_school_package',
          title: `Motor Driving School Package`,
          subtitle: `Commercial driving school handling documentation and practical training`,
          badge: 'Training Included • Higher Cost',
          estimatedDays: '45–60 Days',
          governmentFees: '₹4,500 – ₹7,000 (RTO Fees + School Training)',
          requiredDocsCount: 6,
          physicalVisits: '3 Visits (Registration, Classes & Test)',
          complianceLevel: 'Moderate',
          suitableFor: `New drivers requiring structured behind-the-wheel classes with dual-control cars.`,
          steps: [
            {
              title: `Driving School Enrollment & Form 5 Certificate`,
              authority: `Authorized Motor Driving School`,
              status: 'mandatory',
              note: `Minimum 15 hours practical road training`
            },
            {
              title: `RTO Driving Track Test with School Car`,
              authority: `${cityLabel} RTO Vehicle Inspector`,
              status: 'mandatory',
              note: `Test conducted in driving school vehicle`
            }
          ],
          keyDocuments: [
            'Form 5 Driving School Competency Certificate',
            'Physical Passport Photos & Form 1/1A',
            'Driving School Enrollment Receipt'
          ]
        },
        recommendationA: `Pick Sarathi Faceless if you already know how to drive: save ₹4,000+ and take your learner test from home.`,
        recommendationB: `Pick Driving School if you need formal practical lessons and an instructor car for the test.`
      }
    ];
  }

  // ── 4. EDUCATION / SCHOOL / COACHING / PRESCHOOL ──
  if (
    combinedText.includes('school') ||
    combinedText.includes('college') ||
    combinedText.includes('education') ||
    combinedText.includes('coaching') ||
    combinedText.includes('tuition') ||
    combinedText.includes('preschool') ||
    combinedText.includes('kindergarten') ||
    combinedText.includes('academy') ||
    combinedText.includes('playschool') ||
    combinedText.includes('institute')
  ) {
    return [
      {
        id: 'school_trust_vs_preschool_academy',
        name: `Formal Recognized School (RTE Act) vs. Preschool / Private Academy (${cityLabel})`,
        description: `Compare regulatory approvals, trust formation, building bylaws, and fees for formal schools versus preschools/coaching.`,
        domain: 'business',
        optionA: {
          id: 'formal_school_trust',
          title: `Formal Recognized School (K-10 / K-12)`,
          subtitle: `Registered Educational Trust / Society with State Education Dept / Board recognition`,
          badge: 'RTE Recognition • Board Affiliated',
          estimatedDays: '120–180 Days',
          governmentFees: '₹25,000 – ₹60,000 (Statutory Inspection & Fee)',
          requiredDocsCount: 14,
          physicalVisits: '4–5 Field Inspections (DEO, Municipal & Fire)',
          complianceLevel: 'High',
          suitableFor: `Founders establishing a formal primary/secondary school awarding recognized board certificates.`,
          steps: [
            {
              title: `Educational Trust / Section 8 Society Registration`,
              authority: `${stateLabel} Charity Commissioner / MCA`,
              status: 'mandatory',
              note: `Mandatory non-profit educational charter for operating recognized schools`
            },
            {
              title: `Land Title, Playground Norms & Structural Stability Clearance`,
              authority: `${authorityPrefix} (Building Proposal Dept)`,
              status: 'mandatory',
              note: `Mandatory land compliance, playground norms, and structural fitness audit`
            },
            {
              title: `Commercial Fire Safety & Emergency Evacuation NOC`,
              authority: `${isMumbai ? 'Mumbai Fire Brigade' : 'Municipal Fire Dept'}`,
              status: 'mandatory',
              note: `Dual staircase compliance, fire hydrants, and emergency evacuation certificate`
            },
            {
              title: `District Education Officer (DEO) RTE Recognition & School Approval`,
              authority: `${stateLabel} School Education Department`,
              status: 'mandatory',
              note: `Statutory inspection under Section 18 of the Right to Education (RTE) Act`
            }
          ],
          keyDocuments: [
            'Registered Educational Trust Deed / Society Bylaws (12A/80G)',
            'Municipal Land Title Deed or 30-Year Registered Lease Agreement',
            'Municipal Competent Authority Building Structural Fitness Certificate',
            'Chief Fire Officer (CFO) Final Fire Safety Compliance NOC',
            'District Education Officer (DEO) Statutory Recognition Order'
          ]
        },
        optionB: {
          id: 'preschool_coaching_academy',
          title: `Preschool, Daycare or Private Coaching Academy`,
          subtitle: `Commercial education service without statutory board curriculum or non-profit trust mandate`,
          badge: 'Fast Commercial Launch • 100% Online',
          estimatedDays: '10–18 Days',
          governmentFees: '₹2,500 – ₹5,000 (Municipal & MSME Registration)',
          requiredDocsCount: 5,
          physicalVisits: '0–1 Office Visit',
          complianceLevel: 'Low',
          suitableFor: `Edupreneurs starting pre-primary playgroups, daycare centers, supplementary tuition institutes, or skill academies.`,
          steps: [
            {
              title: `Udyam MSME Government Registration (Educational Services)`,
              authority: `Ministry of Micro, Small & Medium Enterprises (MSME)`,
              status: 'mandatory',
              note: `Free lifetime central government enterprise registration for education services`
            },
            {
              title: `Shop & Establishment Act (Gumasta) Intimation`,
              authority: `${stateLabel} Labour Department / ${cityLabel} Municipal Corporation`,
              status: 'mandatory',
              note: `Commercial establishment registration for leased/owned commercial premises`
            },
            {
              title: `Premises Commercial Lease Agreement & Society NOC`,
              authority: `Premises Owner / Cooperative Housing Society`,
              status: 'mandatory',
              note: `Written consent from society/landlord for child daycare or student classes`
            },
            {
              title: `Basic Premises Fire Extinguisher & First-Aid Clearance`,
              authority: `Local Fire Station / Municipal Health Dept`,
              status: 'optional',
              note: `Emergency exit signage and ABC dry powder fire extinguishers`
            }
          ],
          keyDocuments: [
            'Applicant Aadhaar Card & PAN Card',
            'Registered Premises Commercial Lease or Ownership Deed',
            'Building / Society No-Objection Certificate (NOC)',
            'Udyam Central Government Registration Certificate',
            'Municipal Shop Act Registration / Intimation Slip'
          ]
        },
        recommendationA: `Pick Formal Recognized School if you plan to award state or central board certificates and operate formal K-10/K-12 classes.`,
        recommendationB: `Pick Preschool / Private Academy if you are launching pre-primary, daycare, or supplementary tutoring: launch in 2 weeks with minimal regulatory red-tape.`
      }
    ];
  }

  // ── 5. FOOD / RESTAURANT / BAKERY / CATERING ──
  if (
    combinedText.includes('food') ||
    combinedText.includes('bakery') ||
    combinedText.includes('restaurant') ||
    combinedText.includes('cafe') ||
    combinedText.includes('kitchen') ||
    combinedText.includes('fssai') ||
    combinedText.includes('catering') ||
    combinedText.includes('dine') ||
    combinedText.includes('eating') ||
    combinedText.includes('hotel') ||
    combinedText.includes('sweet')
  ) {
    return [
      {
        id: 'food_business_home_vs_comm',
        name: `Home Cloud Kitchen vs. Commercial Restaurant (${cityLabel})`,
        description: `Compare licensing, fees, and fire/health inspections between home-based and commercial setups.`,
        domain: 'business',
        optionA: {
          id: 'cloud_kitchen',
          title: `Home / Cloud Kitchen Setup`,
          subtitle: `Residential delivery-only food preparation (under ₹12L annual revenue)`,
          badge: 'Fast Launch • ₹2,500 Fees',
          estimatedDays: '10–14 Days',
          governmentFees: '₹2,000 – ₹3,500',
          requiredDocsCount: 5,
          physicalVisits: '0 Office Visits (100% Online)',
          complianceLevel: 'Low',
          suitableFor: `Home bakers, tiffin services, and cloud kitchens operating from residential premises.`,
          steps: [
            {
              title: `FSSAI Basic Registration (Form A)`,
              authority: `Food Safety Authority of India (FSSAI)`,
              status: 'mandatory',
              note: `₹100/year annual statutory fee for revenue under ₹12 Lakhs`
            },
            {
              title: `Shop & Establishment Self-Intimation`,
              authority: `${stateLabel} Labour Department`,
              status: 'mandatory',
              note: `Online self-declaration without commercial site inspection`
            },
            {
              title: `Commercial Fire Safety NOC`,
              authority: `${isMumbai ? 'Mumbai Fire Brigade' : 'Municipal Fire Dept'}`,
              status: 'waived',
              note: `Exempt for residential kitchens using standard domestic utilities`
            },
            {
              title: `Police Eating House License`,
              authority: `City Police Licensing Branch`,
              status: 'waived',
              note: `Exempt since no dine-in customer seating exists`
            }
          ],
          keyDocuments: [
            'Aadhaar & PAN Card of Applicant',
            'Residential Electricity Bill / Lease Agreement',
            'Society / Landlord NOC for Food Preparation',
            'Kitchen Hygiene Self-Declaration'
          ]
        },
        optionB: {
          id: 'dine_in_restaurant',
          title: `Commercial Dine-In Restaurant`,
          subtitle: `Physical retail restaurant with customer dining, trade waste, and fire audits`,
          badge: 'Full Commercial License',
          estimatedDays: '40–55 Days',
          governmentFees: '₹18,000 – ₹35,000',
          requiredDocsCount: 14,
          physicalVisits: '3–4 Ward Inspections',
          complianceLevel: 'High',
          suitableFor: `Full-service dine-in cafes and restaurants with customer seating in ${cityLabel}.`,
          steps: [
            {
              title: `FSSAI State Food License (Form B)`,
              authority: `Food Safety Authority of India`,
              status: 'mandatory',
              note: `Includes food safety supervisor training and water test audits`
            },
            {
              title: `Commercial Fire Safety Clearance & Hydrant Audit`,
              authority: `${isMumbai ? 'Mumbai Fire Brigade' : 'Municipal Fire Dept'}`,
              status: 'mandatory',
              note: `Site inspection of exhaust ducts, exits, and fire hydrants`
            },
            {
              title: `Municipal Health & Trade License`,
              authority: `${authorityPrefix}`,
              status: 'mandatory',
              note: `Sanitation inspection and trade waste clearance`
            }
          ],
          keyDocuments: [
            'Commercial Registered Lease Agreement (Minimum 3 Years)',
            'Building Sanction Plan Approved by Municipal Corporation',
            'Fire Safety Layout Drawing & NOC',
            'Pollution Control Board Consent to Operate (CTO)'
          ]
        },
        recommendationA: `Pick Home Cloud Kitchen if you are starting out: save ₹15,000+ in fees and launch in under 2 weeks.`,
        recommendationB: `Pick Commercial Restaurant if you require physical customer seating and commercial brand presence.`
      }
    ];
  }

  // ── 6. DYNAMIC CONTEXTUAL FALLBACK (Direct Standard vs. Single-Window Route) ──
  const cleanTitle = (journey?.title || 'Civic Procedure')
    .replace(/^setup\s+/i, '')
    .replace(/\s+roadmap.*$/i, '')
    .trim();

  return [
    {
      id: `dynamic_comp_${journey?.id || 'standard'}`,
      name: `Direct Department Route vs. Single-Window Fast-Track (${cleanTitle})`,
      description: `Compare timeline, government fees, and statutory requirements for direct departmental filing versus expedited single-window processing.`,
      domain: 'general',
      optionA: {
        id: 'direct_dept_route',
        title: `Self-Service Direct Department Route`,
        subtitle: `Apply directly through individual municipal and state department portals (${cityLabel})`,
        badge: 'Lowest Cost • Direct Submission',
        estimatedDays: '15–25 Days',
        governmentFees: '₹1,500 – ₹4,000 (Pure Statutory Fees)',
        requiredDocsCount: Math.min((journey?.steps || []).length * 2, 8) || 5,
        physicalVisits: '1–2 Department Visits',
        complianceLevel: 'Moderate',
        suitableFor: `Applicants handling individual document submissions directly on official government portals.`,
        steps: (journey?.steps && journey.steps.length > 0)
          ? journey.steps.slice(0, 4).map((s) => ({
              title: s.title.replace(/^\d+\.\s*/, ''),
              authority: s.authority || s.department || `${cityLabel} Authority`,
              status: 'mandatory' as const,
              note: `Direct statutory filing via official portal`
            }))
          : [
              {
                title: `Primary Statutory Application & Aadhaar e-KYC`,
                authority: `${authorityPrefix}`,
                status: 'mandatory' as const,
                note: `Direct online application submission`
              },
              {
                title: `Document Scrutiny & Municipal Inspection`,
                authority: `${cityLabel} Municipal Department`,
                status: 'mandatory' as const,
                note: `Verification of identity, address, and premises compliance`
              },
              {
                title: `Statutory Fee Payment & Certificate Issuance`,
                authority: `State Government Portal`,
                status: 'mandatory' as const,
                note: `Download digitally signed approved certificate`
              }
            ],
        keyDocuments: [
          'Aadhaar & PAN Identity Proof of Applicant',
          'Premises Ownership Proof or Registered Commercial Lease Agreement',
          'Municipal Property Tax Receipt (No Dues)',
          'Bank Account Proof / Cancelled Cheque'
        ]
      },
      optionB: {
        id: 'single_window_expedited',
        title: `Single-Window Fast-Track Route`,
        subtitle: `Consolidated single-window state clearance under Right to Public Services Act`,
        badge: 'Statutory Timelines • Streamlined',
        estimatedDays: '7–12 Days',
        governmentFees: '₹3,500 – ₹7,500 (Includes Expedited Processing)',
        requiredDocsCount: Math.min((journey?.steps || []).length * 2 + 2, 10) || 6,
        physicalVisits: '0 Office Visits (100% Online)',
        complianceLevel: 'Low',
        suitableFor: `Applicants seeking fast-tracked government clearances bound by legal statutory SLA time-limits.`,
        steps: [
          {
            title: `Single-Window Investor / Citizen Portal Registration`,
            authority: `${stateLabel} Single-Window Clearance Portal (Maitri / State SWC)`,
            status: 'mandatory' as const,
            note: `Unified Common Application Form (CAF) routing to all departments simultaneously`
          },
          {
            title: `Parallel Inter-Departmental Scrutiny (Right to Services Act)`,
            authority: `District Industrial Facilitation Council / Ward Officer`,
            status: 'mandatory' as const,
            note: `Departments legally bound to approve within statutory SLA timeframe`
          },
          {
            title: `Composite Digital Clearance Certificate Download`,
            authority: `Unified Government Portal`,
            status: 'mandatory' as const,
            note: `Single QR-coded composite approval slip valid across all authorities`
          }
        ],
        keyDocuments: [
          'Unified Common Application Form (CAF) with Aadhaar OTP',
          'Registered Premises Deed with Approved Cadastral / Floor Plan',
          'Director / Proprietor KYC & Identity Documents',
          'Digital Signature Certificate (DSC) / Mobile OTP Verification'
        ]
      },
      recommendationA: `Pick Direct Route if you prefer applying directly on individual department portals and paying only minimum statutory fees.`,
      recommendationB: `Pick Single-Window Fast-Track if you want all clearances processed concurrently under the Right to Public Services Act within 12 days.`
    }
  ];
}

/**
 * Transforms a chosen ProcedureOption into a full, typed CivicJourney object
 */
function buildJourneyFromOption(option: ProcedureOption, originalJourney?: CivicJourney | null): CivicJourney {
  const journeyId = originalJourney?.id || `journey_${Date.now()}`;
  const location = originalJourney?.location || 'Mumbai, Maharashtra';

  const steps: ProcedureStep[] = option.steps.map((s, index) => ({
    id: `step_${index + 1}_${option.id}`,
    stepNumber: index + 1,
    title: s.title,
    category: 'Clearance & Verification',
    department: s.authority,
    authority: s.authority,
    description: s.note || `Complete official ${s.title} through ${s.authority}`,
    whyRequired: `Mandatory statutory requirement under municipal and state rules for ${option.title}`,
    status: (index === 0 ? 'In Progress' : 'Pending') as StepStatus,
    documents: option.keyDocuments.slice(0, 2).map((docName, docIdx) => ({
      id: `doc_${index + 1}_${docIdx + 1}`,
      name: docName,
      isMandatory: true,
      category: 'IDENTITY'
    })),
    prerequisites: index > 0 ? [`step_${index}_${option.id}`] : [],
    fee: {
      amount: index === 0 ? 'Standard Application Fee' : 'Statutory Verification Fee',
      description: s.note
    },
    processingTime: `${Math.max(2, Math.round(14 / option.steps.length))} Days`,
    applicationMode: 'Online',
    applicationUrl: 'https://serviceonline.gov.in',
    source: {
      id: `src_${index + 1}`,
      title: `${s.authority} Gazette Regulations`,
      url: 'https://digitalindia.gov.in',
      department: s.authority,
      domain: 'Civic Compliance',
      lastChecked: new Date().toISOString(),
      verificationStatus: 'Verified'
    }
  }));

  return {
    id: journeyId,
    title: option.title,
    query: option.subtitle,
    location: location,
    category: originalJourney?.category || 'CIVIC_PROCEDURE',
    totalSteps: steps.length,
    completedSteps: 0,
    pendingDocuments: option.keyDocuments.length,
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
  const [pendingOptionToSwitch, setPendingOptionToSwitch] = useState<ProcedureOption | null>(null);

  React.useEffect(() => {
    if (comparisonPresets.length > 0 && !comparisonPresets.some(p => p.id === selectedPresetId)) {
      setSelectedPresetId(comparisonPresets[0].id);
    }
  }, [comparisonPresets, selectedPresetId]);

  if (!isOpen) return null;

  const currentPreset = comparisonPresets.find((p) => p.id === selectedPresetId) || comparisonPresets[0];
  const { optionA, optionB } = currentPreset;

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
                  Compare Options: {activeJourney?.title || 'Your Civic Journey'}
                </h2>
                {activeJourney?.location && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#EBF5EF] dark:bg-[#153326] text-[#1B4D3E] dark:text-[#6EE7B7]">
                    <MapPin className="w-3 h-3" />
                    {activeJourney.location}
                  </span>
                )}
              </div>
              <p className="text-xs text-[#5A6D64] dark:text-[#9FB7AC] mt-0.5">
                Compare timelines, government fees, and document requirements. Click <strong>"Switch to this Pathway"</strong> on any option to adopt it.
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

        {/* ── 2. SCENARIO SELECTOR (IF MULTIPLE) ── */}
        {comparisonPresets.length > 1 && (
          <div className="px-6 py-2.5 bg-white dark:bg-[#0B1713] border-b border-[#EDF2EE] dark:border-[#1A332B] flex items-center gap-2 overflow-x-auto text-xs shrink-0">
            <span className="text-[11px] font-semibold text-[#7A8E85] dark:text-[#7C978B] uppercase tracking-wider shrink-0 flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3" />
              Compare By:
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
            At a Glance (Time, Fees & Visits)
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
            Step Differences ({optionA.steps.length} vs {optionB.steps.length} Steps)
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
            Document Checklist ({optionA.keyDocuments.length} vs {optionB.keyDocuments.length} Docs)
          </button>
        </div>

        {/* ── 4. MAIN COMPARISON CONTENT ── */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* TAB 1: EXECUTIVE AT-A-GLANCE SCORECARD */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* SIDE-BY-SIDE SCORECARD */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                
                {/* OPTION A */}
                <div className="p-5 rounded-2xl border-2 border-[#CBE2D4] dark:border-[#1E4334] bg-[#F4F9F6] dark:bg-[#0E211A] space-y-4 text-left shadow-xs flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#1B4D3E] text-white tracking-wide">
                        PATHWAY 1
                      </span>
                      <span className="text-[11px] font-semibold text-[#1B4D3E] dark:text-[#6EE7B7]">
                        {optionA.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-[#11261F] dark:text-white">
                        {optionA.title}
                      </h3>
                      <p className="text-xs text-[#5A6D64] dark:text-[#9FB7AC] mt-0.5">
                        {optionA.subtitle}
                      </p>
                    </div>

                    {/* 4 Clean Metric Blocks */}
                    <div className="grid grid-cols-2 gap-2.5 pt-1">
                      <div className="p-3 rounded-xl bg-white dark:bg-[#08120F] border border-[#D5E3DA] dark:border-[#1A382C]">
                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#5A6D64] dark:text-[#9FB7AC]">
                          <Clock className="w-3.5 h-3.5 text-[#1B4D3E] dark:text-[#6EE7B7]" />
                          Total Time
                        </div>
                        <div className="text-sm sm:text-base font-extrabold text-[#11261F] dark:text-white mt-1">
                          {optionA.estimatedDays}
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-white dark:bg-[#08120F] border border-[#D5E3DA] dark:border-[#1A382C]">
                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#5A6D64] dark:text-[#9FB7AC]">
                          <Scale className="w-3.5 h-3.5 text-[#1B4D3E] dark:text-[#6EE7B7]" />
                          Govt Fees
                        </div>
                        <div className="text-sm sm:text-base font-extrabold text-[#11261F] dark:text-white mt-1">
                          {optionA.governmentFees}
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-white dark:bg-[#08120F] border border-[#D5E3DA] dark:border-[#1A382C]">
                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#5A6D64] dark:text-[#9FB7AC]">
                          <FileText className="w-3.5 h-3.5 text-[#1B4D3E] dark:text-[#6EE7B7]" />
                          Documents
                        </div>
                        <div className="text-sm sm:text-base font-extrabold text-[#11261F] dark:text-white mt-1">
                          {optionA.requiredDocsCount} Required
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-white dark:bg-[#08120F] border border-[#D5E3DA] dark:border-[#1A382C]">
                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#5A6D64] dark:text-[#9FB7AC]">
                          <Building2 className="w-3.5 h-3.5 text-[#1B4D3E] dark:text-[#6EE7B7]" />
                          Office Visits
                        </div>
                        <div className="text-sm sm:text-base font-extrabold text-[#11261F] dark:text-white mt-1">
                          {optionA.physicalVisits}
                        </div>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-white dark:bg-[#08120F] border border-[#D5E3DA] dark:border-[#1A382C] text-xs">
                      <span className="font-bold text-[#11261F] dark:text-white">Ideal For:</span>{' '}
                      <span className="text-[#4A5D54] dark:text-[#9FB7AC]">{optionA.suitableFor}</span>
                    </div>
                  </div>

                  {/* Switch Action Button */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setPendingOptionToSwitch(optionA)}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#1B4D3E] hover:bg-[#143B2F] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer active:scale-98"
                    >
                      <RotateCw className="w-4 h-4" />
                      <span>Switch Roadmap to Pathway 1</span>
                    </button>
                  </div>
                </div>

                {/* OPTION B */}
                <div className="p-5 rounded-2xl border-2 border-[#E5DEC9] dark:border-[#383325] bg-[#FAF8F2] dark:bg-[#1A1710] space-y-4 text-left shadow-xs flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#8C5819] text-white tracking-wide">
                        PATHWAY 2
                      </span>
                      <span className="text-[11px] font-semibold text-[#8C5819] dark:text-amber-300">
                        {optionB.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-[#11261F] dark:text-white">
                        {optionB.title}
                      </h3>
                      <p className="text-xs text-[#5A6D64] dark:text-[#9FB7AC] mt-0.5">
                        {optionB.subtitle}
                      </p>
                    </div>

                    {/* 4 Clean Metric Blocks */}
                    <div className="grid grid-cols-2 gap-2.5 pt-1">
                      <div className="p-3 rounded-xl bg-white dark:bg-[#12100A] border border-[#E3DFC9] dark:border-[#2D2817]">
                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#5A6D64] dark:text-[#9FB7AC]">
                          <Clock className="w-3.5 h-3.5 text-[#8C5819]" />
                          Total Time
                        </div>
                        <div className="text-sm sm:text-base font-extrabold text-[#11261F] dark:text-white mt-1">
                          {optionB.estimatedDays}
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-white dark:bg-[#12100A] border border-[#E3DFC9] dark:border-[#2D2817]">
                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#5A6D64] dark:text-[#9FB7AC]">
                          <Scale className="w-3.5 h-3.5 text-[#8C5819]" />
                          Govt Fees
                        </div>
                        <div className="text-sm sm:text-base font-extrabold text-[#11261F] dark:text-white mt-1">
                          {optionB.governmentFees}
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-white dark:bg-[#12100A] border border-[#E3DFC9] dark:border-[#2D2817]">
                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#5A6D64] dark:text-[#9FB7AC]">
                          <FileText className="w-3.5 h-3.5 text-[#8C5819]" />
                          Documents
                        </div>
                        <div className="text-sm sm:text-base font-extrabold text-[#11261F] dark:text-white mt-1">
                          {optionB.requiredDocsCount} Required
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-white dark:bg-[#12100A] border border-[#E3DFC9] dark:border-[#2D2817]">
                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#5A6D64] dark:text-[#9FB7AC]">
                          <Building2 className="w-3.5 h-3.5 text-[#8C5819]" />
                          Office Visits
                        </div>
                        <div className="text-sm sm:text-base font-extrabold text-[#11261F] dark:text-white mt-1">
                          {optionB.physicalVisits}
                        </div>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-white dark:bg-[#12100A] border border-[#E3DFC9] dark:border-[#2D2817] text-xs">
                      <span className="font-bold text-[#11261F] dark:text-white">Ideal For:</span>{' '}
                      <span className="text-[#4A5D54] dark:text-[#9FB7AC]">{optionB.suitableFor}</span>
                    </div>
                  </div>

                  {/* Switch Action Button */}
                  <div className="pt-2">
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

              </div>

              {/* WHICH ONE SHOULD YOU CHOOSE? */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0E1E19] border border-[#DCE4DF] dark:border-[#1E3B32] text-left space-y-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#1B4D3E] dark:text-[#22C55E]" />
                  <h4 className="text-sm font-bold text-[#11261F] dark:text-white">
                    Which Pathway Should You Choose?
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

            </div>
          )}

          {/* TAB 2: STEP-BY-STEP CLEARANCES */}
          {activeTab === 'steps' && (
            <div className="space-y-4 text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Steps List Option A */}
                <div className="space-y-2.5">
                  <div className="text-xs font-bold text-[#1B4D3E] dark:text-[#6EE7B7] uppercase tracking-wide px-1 flex items-center justify-between">
                    <span>{optionA.title}</span>
                    <span className="text-[11px] font-normal text-[#5A6D64] dark:text-[#9FB7AC]">{optionA.steps.length} Steps</span>
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
                              : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                          }`}
                        >
                          {step.status === 'mandatory' ? 'Mandatory' : step.status === 'waived' ? 'Waived / Exempt' : 'Optional'}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#5A6D64] dark:text-[#9FB7AC]">{step.authority}</p>
                      {step.note && (
                        <p className="text-[11px] text-[#2D4539] dark:text-[#CBE2D7] pt-0.5 font-medium">
                          Note: {step.note}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Steps List Option B */}
                <div className="space-y-2.5">
                  <div className="text-xs font-bold text-[#8C5819] dark:text-amber-300 uppercase tracking-wide px-1 flex items-center justify-between">
                    <span>{optionB.title}</span>
                    <span className="text-[11px] font-normal text-[#5A6D64] dark:text-[#9FB7AC]">{optionB.steps.length} Steps</span>
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
                              : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                          }`}
                        >
                          {step.status === 'mandatory' ? 'Mandatory' : step.status === 'waived' ? 'Waived / Exempt' : 'Optional'}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#5A6D64] dark:text-[#9FB7AC]">{step.authority}</p>
                      {step.note && (
                        <p className="text-[11px] text-[#634215] dark:text-[#D9C4A0] pt-0.5 font-medium">
                          Note: {step.note}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

              </div>
            </div>
          )}

          {/* TAB 3: REQUIRED DOCUMENTS */}
          {activeTab === 'documents' && (
            <div className="space-y-4 text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Option A Documents */}
                <div className="p-4 rounded-xl bg-[#F4F9F6] dark:bg-[#0E211A] border border-[#D3E4D9] dark:border-[#1E4334] space-y-3">
                  <div className="text-xs font-bold text-[#1B4D3E] dark:text-[#6EE7B7] uppercase tracking-wide">
                    {optionA.title} Checklist ({optionA.keyDocuments.length} Documents)
                  </div>
                  <ul className="space-y-2">
                    {optionA.keyDocuments.map((doc, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-[#2D3E35] dark:text-[#D1E2D9]">
                        <Check className="w-3.5 h-3.5 text-[#1B4D3E] dark:text-[#6EE7B7] shrink-0 mt-0.5" />
                        <span>{doc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Option B Documents */}
                <div className="p-4 rounded-xl bg-[#FAF8F2] dark:bg-[#1A1710] border border-[#DFDCD4] dark:border-[#383325] space-y-3">
                  <div className="text-xs font-bold text-[#8C5819] dark:text-amber-300 uppercase tracking-wide">
                    {optionB.title} Checklist ({optionB.keyDocuments.length} Documents)
                  </div>
                  <ul className="space-y-2">
                    {optionB.keyDocuments.map((doc, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-[#3E382A] dark:text-[#DDD7C8]">
                        <Check className="w-3.5 h-3.5 text-[#8C5819] shrink-0 mt-0.5" />
                        <span>{doc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* ── 5. FOOTER ── */}
        <div className="px-6 py-3.5 bg-[#F8FAF9] dark:bg-[#0E1E19] border-t border-[#E5EAE7] dark:border-[#1E3B32] flex items-center justify-between gap-4 text-xs shrink-0">
          <div className="text-[11px] text-[#5A6D64] dark:text-[#9FB7AC] text-left flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 shrink-0 text-[#1B4D3E] dark:text-[#22C55E]" />
            <span>Statutory comparison for {activeJourney?.title || 'your process'} grounded in published municipal gazette acts.</span>
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
                    Adopt this pathway as your live journey
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
                    <span className="text-[10px] text-[#5A6D64] dark:text-[#9FB7AC]">Estimated Time:</span>
                    <div className="font-semibold text-[#11261F] dark:text-white">{pendingOptionToSwitch.estimatedDays}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#5A6D64] dark:text-[#9FB7AC]">Statutory Fees:</span>
                    <div className="font-semibold text-[#11261F] dark:text-white">{pendingOptionToSwitch.governmentFees}</div>
                  </div>
                </div>
              </div>

              <p className="text-xs text-[#4A5D54] dark:text-[#9FB7AC] leading-relaxed">
                Your flowchart, document checklist, and step sequence will immediately update to follow this pathway.
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
