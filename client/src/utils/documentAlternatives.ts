/**
 * DishaSaathi Official Statutory Document Alternatives Registry
 * Grounded in Indian Gazettes, Central Motor Vehicles Rules (1989),
 * RBI Master Directions on KYC, UIDAI Aadhaar Regulations,
 * Municipal Corporation Acts, and State Shops & Establishments Rules.
 *
 * Rules:
 * - If an officially accepted alternative exists -> return array of alternatives
 * - If NO alternative is legally permitted -> return undefined (shows nothing)
 * - Do not invent arbitrary alternatives; strictly reflect statutory validity
 */

import { CivicDocument, ProcedureStep } from '../types';

export function getAlternateDocuments(
  doc: CivicDocument | { name: string; description?: string; alternateDocuments?: string[] },
  step?: ProcedureStep | { title?: string; category?: string }
): string[] | undefined {
  // 1. If document already carries an explicit alternate array from the API/Engine
  if (doc.alternateDocuments && Array.isArray(doc.alternateDocuments) && doc.alternateDocuments.length > 0) {
    return doc.alternateDocuments;
  }

  const name = (doc.name || '').toLowerCase().trim();
  const desc = ((doc as any).description || '').toLowerCase();
  const stepTitle = (step?.title || '').toLowerCase();

  // -------------------------------------------------------------------------
  // 0. EXCLUSIONS: STATUTORY DOCUMENTS WITH STRICTLY NO ALTERNATIVES
  // -------------------------------------------------------------------------
  // Physical inspections, state language signboards, specific medical forms,
  // laboratory test results, and prerequisite licenses have NO legal alternatives.
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

  // Aadhaar Card when requested as identity/authentication proof
  if (
    name.includes('aadhaar card of applicant') ||
    name.includes('aadhaar card of business owner') ||
    name.includes('aadhaar of applicant') ||
    (name.includes('aadhaar') && !stepTitle.includes('udyam')) // Udyam strictly mandates Aadhaar e-KYC
  ) {
    return [
      'Voter ID Card (EPIC)',
      'Valid Indian Passport',
      'Indian Driving Licence'
    ];
  }

  // Voter ID Card
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

  // Bank Account Proof / Cancelled Cheque
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

  // No officially recognized alternate exists for this specific document
  return undefined;
}
