export interface SlaInfo {
  stepId: string;
  stepTitle: string;
  department: string;
  actName: string;
  mandatedSlaDays: number;
  designatedOfficer: string;
  firstAppellateAuthority: string;
  grievancePortalUrl: string;
  portalName: string;
  penaltyClause?: string;
}

export const STATUTORY_SLA_DIRECTORY: Record<string, SlaInfo> = {
  'pan': {
    stepId: 'pan',
    stepTitle: 'Permanent Account Number (PAN) Allocation',
    department: 'Income Tax Department / NSDL (Protean)',
    actName: 'Income Tax Act 1961 & Citizen Charter',
    mandatedSlaDays: 15,
    designatedOfficer: 'Assessing Officer (PAN Cell)',
    firstAppellateAuthority: 'Joint Commissioner of Income Tax (Admn)',
    grievancePortalUrl: 'https://www.incometax.gov.in/iec/foportal/e-grievance',
    portalName: 'e-Nivaran / Income Tax Grievance Portal',
    penaltyClause: 'Priority redressal within 30 days under Citizen Charter'
  },
  'gumasta': {
    stepId: 'gumasta',
    stepTitle: 'Maharashtra Shop & Establishment Registration (Gumasta)',
    department: 'Municipal Corporation (BMC / Municipal Ward Office)',
    actName: 'Maharashtra Shops and Establishments (Regulation of Employment and Conditions of Service) Act, 2017 & RTS Act 2015',
    mandatedSlaDays: 3,
    designatedOfficer: 'Senior Inspector (Shops & Establishments)',
    firstAppellateAuthority: 'Assistant Municipal Commissioner / Ward Officer',
    grievancePortalUrl: 'https://grievances.maharashtra.gov.in/',
    portalName: 'Aaple Sarkar Grievance Redressal Portal',
    penaltyClause: 'Deemed approval after 3 working days if no objection raised'
  },
  'fssai': {
    stepId: 'fssai',
    stepTitle: 'FSSAI Food Business License / Registration',
    department: 'Food Safety and Standards Authority of India (FSSAI)',
    actName: 'Food Safety and Standards (Licensing and Registration of Food Businesses) Regulations, 2011',
    mandatedSlaDays: 30,
    designatedOfficer: 'Designated Food Safety Officer (DO)',
    firstAppellateAuthority: 'Commissioner of Food Safety (State FDA)',
    grievancePortalUrl: 'https://foscos.fssai.gov.in/',
    portalName: 'FoSCoS Helpdesk & CPGRAMS',
    penaltyClause: 'Deemed registration if scrutiny not initiated within 30 days'
  },
  'fire': {
    stepId: 'fire',
    stepTitle: 'Fire Safety Compliance Certificate & NOC',
    department: 'Directorate of Maharashtra Fire Services / Municipal Fire Brigade',
    actName: 'Maharashtra Fire Prevention and Life Safety Measures Act, 2006',
    mandatedSlaDays: 30,
    designatedOfficer: 'Divisional Fire Officer (DFO)',
    firstAppellateAuthority: 'Chief Fire Officer (CFO)',
    grievancePortalUrl: 'https://grievances.maharashtra.gov.in/',
    portalName: 'Aaple Sarkar / MCGM Citizen Portal',
    penaltyClause: 'Statutory inspection report must be delivered within 15 days of site visit'
  },
  'gst': {
    stepId: 'gst',
    stepTitle: 'Goods and Services Tax (GSTIN) Registration',
    department: 'Central Board of Indirect Taxes and Customs (CBIC) / State GST',
    actName: 'Rule 9 of the Central Goods and Services Tax (CGST) Rules, 2017',
    mandatedSlaDays: 7,
    designatedOfficer: 'Superintendent / Proper Officer (GST Range)',
    firstAppellateAuthority: 'Assistant Commissioner (Appeals)',
    grievancePortalUrl: 'https://selfservice.gstsystem.in/',
    portalName: 'GST Self-Service Grievance Redressal Portal',
    penaltyClause: 'Deemed registration on 7th day if notice in Form GST REG-03 not issued'
  },
  'water': {
    stepId: 'water',
    stepTitle: 'Municipal Water Connection & Potability Testing',
    department: 'Hydraulic Engineer Department (Municipal Corporation)',
    actName: 'Mumbai Municipal Corporation (MMC) Act & Maharashtra RTS Act 2015',
    mandatedSlaDays: 21,
    designatedOfficer: 'Assistant Engineer (Water Works)',
    firstAppellateAuthority: 'Executive Engineer (Water Supply)',
    grievancePortalUrl: 'https://portal.mcgm.gov.in/',
    portalName: 'MCGM 1916 Civic Helpline & Portal',
    penaltyClause: 'Daily statutory delay penalty under Maharashtra RTS Act'
  },
  'driving': {
    stepId: 'driving',
    stepTitle: 'Permanent Driving Licence / Renewal',
    department: 'Regional Transport Office (RTO) / MoRTH',
    actName: 'Motor Vehicles Act, 1988 & Central Motor Vehicles Rules',
    mandatedSlaDays: 7,
    designatedOfficer: 'Assistant Regional Transport Officer (ARTO)',
    firstAppellateAuthority: 'Regional Transport Officer (RTO)',
    grievancePortalUrl: 'https://parivahan.gov.in/',
    portalName: 'Sarathi Grievance & CPGRAMS',
    penaltyClause: 'Dispatch within 7 working days of passing driving test'
  },
  'property': {
    stepId: 'property',
    stepTitle: 'Property Card Mutation & City Survey (CTS) Update',
    department: 'Land Records & Revenue Department / Talathi Office',
    actName: 'Maharashtra Land Revenue Code, 1966 & RTS Act 2015',
    mandatedSlaDays: 30,
    designatedOfficer: 'City Survey Officer / Talathi',
    firstAppellateAuthority: 'Sub-Divisional Officer (SDO) / Tahsildar',
    grievancePortalUrl: 'https://grievances.maharashtra.gov.in/',
    portalName: 'Aaple Sarkar Revenue Grievance',
    penaltyClause: 'Mandatory certification of undisputed mutations within 30 days'
  }
};

/**
 * Finds or synthesizes statutory SLA for a step
 */
export function getStepSlaInfo(stepTitle: string, department?: string): SlaInfo {
  const lower = (stepTitle + ' ' + (department || '')).toLowerCase();
  
  if (lower.includes('pan')) return STATUTORY_SLA_DIRECTORY['pan'];
  if (lower.includes('gumasta') || lower.includes('shop')) return STATUTORY_SLA_DIRECTORY['gumasta'];
  if (lower.includes('fssai') || lower.includes('food')) return STATUTORY_SLA_DIRECTORY['fssai'];
  if (lower.includes('fire') || lower.includes('noc')) return STATUTORY_SLA_DIRECTORY['fire'];
  if (lower.includes('gst') || lower.includes('tax')) return STATUTORY_SLA_DIRECTORY['gst'];
  if (lower.includes('water') || lower.includes('utility')) return STATUTORY_SLA_DIRECTORY['water'];
  if (lower.includes('driving') || lower.includes('licence') || lower.includes('license') || lower.includes('rto')) return STATUTORY_SLA_DIRECTORY['driving'];
  if (lower.includes('property') || lower.includes('mutation') || lower.includes('land') || lower.includes('cts')) return STATUTORY_SLA_DIRECTORY['property'];

  // Default fallback for any general civic service
  return {
    stepId: 'generic',
    stepTitle,
    department: department || 'Competent Municipal / State Authority',
    actName: 'State Right to Public Services Act & Citizens Charter',
    mandatedSlaDays: 15,
    designatedOfficer: 'Designated Public Grievance Officer',
    firstAppellateAuthority: 'First Appellate Authority (RTS / RTI)',
    grievancePortalUrl: 'https://pgportal.gov.in/',
    portalName: 'CPGRAMS Central & State Grievance Portal',
    penaltyClause: 'Statutory time-bound delivery guarantee under Citizen Charter'
  };
}

export interface GrievanceDraftRequest {
  citizenName: string;
  stepTitle: string;
  department?: string;
  applicationNumber?: string;
  submissionDate?: string;
  daysElapsed?: number;
  contactEmail?: string;
  contactPhone?: string;
  location?: string;
}

export interface GrievanceDraftResponse {
  slaInfo: SlaInfo;
  mandatedSlaDays: number;
  daysElapsed: number;
  overdueDays: number;
  isOverdue: boolean;
  grievanceLetterText: string;
  firstAppellateAuthority: string;
  designatedOfficer: string;
  officialGrievancePortal: string;
  statutoryLegalGrounds: string;
}

/**
 * Builds a formal, court/officer-ready legal grievance letter
 */
export function generateStatutoryGrievanceDraft(req: GrievanceDraftRequest): GrievanceDraftResponse {
  const sla = getStepSlaInfo(req.stepTitle, req.department);
  const mandatedDays = sla.mandatedSlaDays;
  const daysElapsed = typeof req.daysElapsed === 'number' && !isNaN(req.daysElapsed) ? req.daysElapsed : 0;
  const overdueDays = Math.max(0, daysElapsed - mandatedDays);
  const isOverdue = daysElapsed > mandatedDays;
  const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const ackNo = req.applicationNumber || 'APP/' + Math.floor(100000 + Math.random() * 900000);
  const subDate = req.submissionDate || new Date(Date.now() - daysElapsed * 86400000).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  const timelineElapsedText = isOverdue
    ? `• Actual Time Elapsed to Date : ${daysElapsed} Days (${overdueDays} Days Overdue)`
    : `• Actual Time Elapsed to Date : ${daysElapsed} Days (Current Status: Within Mandated SLA Window - ${Math.max(0, mandatedDays - daysElapsed)} Days Remaining)`;

  const subjectLine = isOverdue
    ? `STATUTORY GRIEVANCE / FIRST APPEAL FOR UNREASONABLE DELAY BEYOND MANDATED CITIZEN CHARTER SLA`
    : `FORMAL INTIMATION & STATUTORY TRACKING REQUEST UNDER CITIZEN CHARTER SLA`;

  const reliefSought = isOverdue
    ? `In view of the statutory delay of ${overdueDays} days beyond the legal SLA, I respectfully request:
   a) Immediate disposal and issuance of the requested certificate / license.
   b) In the alternative, a written explanation specifying the cogent reasons for the delay in accordance with statutory obligations.`
    : `As the application is currently within the notified statutory processing window, I respectfully request:
   a) Verification and processing within the legally guaranteed ${mandatedDays}-day Citizen Charter timeline.
   b) Immediate formal intimation if any additional verification is necessitated.`;

  const letter = `To,
The First Appellate Authority / Designated Grievance Officer,
${sla.department},
${req.location || 'Municipal Corporation / State Jurisdiction'}, Republic of India.

Date: ${today}

SUBJECT: ${subjectLine}
Ref: Application / Acknowledgement Receipt No: ${ackNo}
Service: ${req.stepTitle}
Statutory Authority: ${sla.actName}

Respected Sir / Madam,

I, ${req.citizenName || 'the Applicant'}, am writing to formally place on record an official communication regarding the processing and issuance of my application for "${req.stepTitle}".

1. APPLICATION DETAILS & TIMELINE:
   • Application Reference Number : ${ackNo}
   • Date of Formal Submission   : ${subDate}
   • Legally Mandated SLA Window : ${mandatedDays} Calendar/Working Days (Under ${sla.actName})
   ${timelineElapsedText}
   • Current Application Status  : In Scrutiny / Pending Official Action

2. STATUTORY LEGAL GROUNDS:
   Under the provisions of the Right to Public Services (RTS) Act and the Departmental Citizens' Charter, citizens are legally entitled to receive notified public services within the prescribed timeline of ${mandatedDays} days. 
   
   All required statutory documents and fees were duly remitted at the time of initial application. No deficiency memo (Form Rejection/Query) was communicated to me within the statutory scrutiny period.

3. RELIEF SOUGHT:
   ${reliefSought}

Thanking You,

Yours Faithfully,
${req.citizenName || 'Applicant'}
Contact Email : ${req.contactEmail || 'N/A'}
Contact Phone : ${req.contactPhone || 'N/A'}
Generated via DishaSaathi Civic Navigation Platform`;

  return {
    slaInfo: sla,
    mandatedSlaDays: mandatedDays,
    daysElapsed,
    overdueDays,
    isOverdue,
    grievanceLetterText: letter,
    firstAppellateAuthority: sla.firstAppellateAuthority,
    designatedOfficer: sla.designatedOfficer,
    officialGrievancePortal: sla.grievancePortalUrl,
    statutoryLegalGrounds: `Guaranteed under ${sla.actName}. Mandated delivery within ${mandatedDays} days.`
  };
}
