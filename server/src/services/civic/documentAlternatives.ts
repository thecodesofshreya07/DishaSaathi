/**
 * DishaSaathi Official Statutory Document Alternatives Service
 * Grounded in Indian Gazettes, Central Motor Vehicles Rules (1989),
 * RBI Master Directions on KYC, UIDAI Aadhaar Regulations,
 * Municipal Corporation Acts, and State Shops & Establishments Rules.
 */

import { callUniversalLlm } from './universalLlm.js';

export function getOfficialAlternateDocuments(
  docName: string,
  stepTitle?: string,
  jurisdiction?: string
): string[] | undefined {
  const name = (docName || '').toLowerCase().trim();
  const step = (stepTitle || '').toLowerCase();

  // -------------------------------------------------------------------------
  // 0. EXCLUSIONS: STATUTORY DOCUMENTS WITH STRICTLY NO ALTERNATIVES
  // -------------------------------------------------------------------------
  if (
    name.includes('bilingual signboard') ||
    name.includes('shop entrance') ||
    name.includes('signboard') ||
    name.includes('photo of shop') ||
    name.includes('water quality') ||
    name.includes('bacteriological') ||
    name.includes('fire safety noc') ||
    name.includes('fire noc') ||
    name.includes('learner\'s licence') ||
    name.includes('learners licence') ||
    name.includes('fsms') ||
    name.includes('food safety management') ||
    name.includes('trade licence certificate') ||
    name.includes('death certificate') ||
    name.includes('form 1a medical') ||
    name.includes('medical fitness certificate')
  ) {
    return undefined;
  }

  // -------------------------------------------------------------------------
  // 1. PREMISES & COMMERCIAL OCCUPANCY PROOF
  // -------------------------------------------------------------------------
  if (
    name.includes('rent agreement') ||
    name.includes('lease agreement') ||
    name.includes('property tax receipt') ||
    name.includes('commercial occupancy') ||
    name.includes('registered rent')
  ) {
    return [
      'Registered Commercial Lease Deed',
      'Municipal Property Tax Paid Receipt',
      'Freehold Ownership Sale Deed',
      'NOC from Property Owner with Latest Electricity Bill'
    ];
  }

  if (
    name.includes('commercial electricity bill') ||
    name.includes('electricity bill of premises') ||
    name.includes('premises electricity bill')
  ) {
    return [
      'Municipal Property Tax Assessment / Paid Receipt',
      'Commercial Water Tax Bill',
      'Piped Natural Gas (PNG) Utility Bill'
    ];
  }

  if (name.includes('premises address proof') || name.includes('operating address proof')) {
    return [
      'Registered Commercial Rent / Lease Agreement',
      'Municipal Property Tax Paid Receipt',
      'Commercial Electricity Bill'
    ];
  }

  // -------------------------------------------------------------------------
  // 2. RESIDENTIAL ADDRESS PROOF / PROOF OF RESIDENCE
  // -------------------------------------------------------------------------
  if (
    name === 'address proof' ||
    name.includes('proof of address') ||
    name.includes('residential address proof') ||
    name.includes('residence proof')
  ) {
    return [
      'Voter ID Card (EPIC)',
      'Valid Indian Passport',
      'Electricity Bill (issued within last 3 months)',
      'Registered Rent Agreement'
    ];
  }

  // -------------------------------------------------------------------------
  // 3. IDENTITY PROOF
  // -------------------------------------------------------------------------
  if (
    name === 'identity proof' ||
    name.includes('proof of identity') ||
    name.includes('photo id')
  ) {
    return [
      'Aadhaar Card',
      'Voter ID Card (EPIC)',
      'Valid Indian Passport',
      'Indian Driving Licence'
    ];
  }

  if (
    name.includes('aadhaar card of applicant') ||
    name.includes('aadhaar card of business owner') ||
    name.includes('aadhaar of applicant') ||
    (name.includes('aadhaar') && !step.includes('udyam'))
  ) {
    return [
      'Voter ID Card (EPIC)',
      'Valid Indian Passport',
      'Indian Driving Licence'
    ];
  }

  if (name.includes('voter id') || name.includes('epic card')) {
    return [
      'Aadhaar Card',
      'Valid Indian Passport',
      'Indian Driving Licence'
    ];
  }

  // -------------------------------------------------------------------------
  // 4. TAX & FINANCIAL IDENTIFIERS (PAN)
  // -------------------------------------------------------------------------
  if (name.includes('individual pan card') || name.includes('commercial pan')) {
    return [
      'Form 49A Acknowledgement Receipt (while PAN physical card is in transit)',
      'Form 60 Self-Declaration (under Rule 114B of Income Tax Rules, where permitted)'
    ];
  }

  if (
    name.includes('bank account details') ||
    name.includes('cancelled cheque') ||
    name.includes('bank passbook')
  ) {
    return [
      'First Page of Bank Passbook with Bank Seal',
      'Latest 3-Month Bank Account Statement certified by Bank Branch'
    ];
  }

  // -------------------------------------------------------------------------
  // 5. DATE OF BIRTH (DOB) / AGE PROOF
  // -------------------------------------------------------------------------
  if (
    name.includes('birth certificate') ||
    name.includes('proof of age') ||
    name.includes('date of birth proof')
  ) {
    return [
      '10th Standard School Leaving / Matriculation Certificate',
      'Valid Indian Passport',
      'Individual PAN Card'
    ];
  }

  // -------------------------------------------------------------------------
  // 6. BUSINESS ENTITY CONSTITUTION
  // -------------------------------------------------------------------------
  if (name.includes('partnership deed')) {
    return [
      'LLP Agreement (for Limited Liability Partnerships)',
      'Certificate of Incorporation (for Companies)'
    ];
  }

  if (name.includes('udyam registration certificate') || name.includes('msme certificate')) {
    return [
      'State Directorate of Industries EM-Part II Certificate',
      'Industrial License'
    ];
  }

  // -------------------------------------------------------------------------
  // 7. EDUCATIONAL QUALIFICATION PROOF
  // -------------------------------------------------------------------------
  if (
    name.includes('10th standard marksheet') ||
    name.includes('educational qualification proof') ||
    name.includes('matriculation certificate')
  ) {
    return [
      'School Leaving Certificate (SLC) / Transfer Certificate (TC) mentioning Date of Birth',
      'Matriculation Passing Certificate from recognized State/Central Board'
    ];
  }

  // -------------------------------------------------------------------------
  // 8. VEHICLE / TRANSPORT DOCUMENTS
  // -------------------------------------------------------------------------
  if (name.includes('vehicle insurance certificate') || name.includes('motor insurance')) {
    return [
      'e-Vahan DigiLocker Digital Motor Insurance Record',
      'Cover Note issued by authorized General Insurance Company'
    ];
  }

  return undefined;
}

/**
 * AI-powered statutory alternative resolver for custom/unfamiliar documents
 * using Universal LLM (Groq / Gemini / OpenRouter).
 */
export async function resolveAlternateDocumentViaAi(
  docName: string,
  stepTitle: string,
  jurisdiction?: string
): Promise<string[] | undefined> {
  // First check deterministic gazette rules
  const deterministic = getOfficialAlternateDocuments(docName, stepTitle, jurisdiction);
  if (deterministic && deterministic.length > 0) {
    return deterministic;
  }

  const prompt = `You are an Indian administrative law expert reviewing statutory procedure document requirements.
Document Required: "${docName}"
Procedure Step: "${stepTitle}"
Jurisdiction: "${jurisdiction || 'India'}"

TASK:
Determine if the document "${docName}" has an officially accepted statutory alternative under Indian government rules or state gazettes.
If YES, return a JSON array containing the exact name(s) of the legally accepted alternate document(s).
If NO (e.g. it is an irreplaceable mandatory certificate, inspection photo, specific doctor form, laboratory report, or unique statutory clearance that has NO legal substitute), return an empty array [].

CRITICAL RULES:
- Do NOT make up arbitrary alternatives.
- Only return legally valid alternatives accepted by the competent authority.
- Output ONLY valid JSON: ["Alternate 1", "Alternate 2"] or []`;

  try {
    const res = await callUniversalLlm({ prompt, jsonMode: true });
    if (res && res.text) {
      const cleaned = res.text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.filter((item: any) => typeof item === 'string' && item.trim().length > 0);
      }
    }
  } catch (e: any) {
    // Graceful fallback to undefined
  }

  return undefined;
}
