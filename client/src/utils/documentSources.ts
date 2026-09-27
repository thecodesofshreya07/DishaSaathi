/**
 * DishaSaathi Official Document Procurement & Application URL Directory
 * Maps statutory citizen documents to authoritative government application portals
 */

export function getDocumentApplicationUrl(documentName: string, explicitUrl?: string): string {
  if (explicitUrl && explicitUrl.startsWith('http')) {
    return explicitUrl;
  }


  const name = (documentName || '').toLowerCase();

  // 1. Central Tax & Legal Identity
  if (name.includes('pan card') || name.includes('commercial pan') || name.includes('individual pan') || name.includes('pan')) {
    return 'https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html';
  }
  if (name.includes('aadhaar') || name.includes('aadhar') || name.includes('uidai')) {
    return 'https://myaadhaar.uidai.gov.in/';
  }
  if (name.includes('udyam') || name.includes('msme')) {
    return 'https://udyamregistration.gov.in/Government-India/Ministry-MSME-registration.htm';
  }
  if (name.includes('gst') || name.includes('taxpayer identification')) {
    return 'https://reg.gst.gov.in/registration/';
  }
  if (name.includes('incorporation') || name.includes('mca') || name.includes('partnership deed') || name.includes('moa') || name.includes('aoa')) {
    return 'https://www.mca.gov.in/content/mca/global/en/home.html';
  }

  // 2. Premises & Municipal Utilities
  if (name.includes('electricity') || name.includes('discom') || name.includes('power bill')) {
    return 'https://www.mahadiscom.in/';
  }
  if (name.includes('property tax') || name.includes('tax receipt') || name.includes('assessment')) {
    return 'https://ptaxportal.mcgm.gov.in/';
  }
  if (name.includes('rent agreement') || name.includes('lease deed') || name.includes('occupancy') || name.includes('tenancy')) {
    return 'https://igrmaharashtra.gov.in/';
  }
  if (name.includes('fire noc') || name.includes('fire safety') || name.includes('fire clearance')) {
    return 'https://portal.mcgm.gov.in/';
  }
  if (name.includes('water') || name.includes('potability') || name.includes('water test')) {
    return 'https://jaljeevanmission.gov.in/';
  }
  if (name.includes('gumasta') || name.includes('shops & establishments') || name.includes('shop registration') || name.includes('signboard')) {
    return 'https://services.india.gov.in/';
  }

  // 3. Food, Health & Safety
  if (name.includes('fssai') || name.includes('food safety') || name.includes('hygiene') || name.includes('foscos')) {
    return 'https://foscos.fssai.gov.in/';
  }
  if (name.includes('medical') || name.includes('fitness certificate') || name.includes('health')) {
    return 'https://foscos.fssai.gov.in/';
  }

  // 4. Transport & RTO
  if (name.includes('driving license') || name.includes('learner license') || name.includes('dl')) {
    return 'https://parivahan.gov.in/parivahan//en/content/driving-licence-0';
  }
  if (name.includes('registration certificate') || name.includes('rc') || name.includes('chassis') || name.includes('form 20') || name.includes('form 21')) {
    return 'https://vahan.parivahan.gov.in/vahanservice/';
  }
  if (name.includes('puc') || name.includes('pollution')) {
    return 'https://puc.parivahan.gov.in/';
  }

  // 5. Vital Records & Revenue Certificates
  if (name.includes('birth certificate') || name.includes('death certificate') || name.includes('crs')) {
    return 'https://crsorgi.gov.in/';
  }
  if (name.includes('income certificate') || name.includes('caste') || name.includes('domicile') || name.includes('tahsildar') || name.includes('ration card')) {
    return 'https://aaplesarkar.mahaonline.gov.in/';
  }

  // 6. Architecture & Building Permissions
  if (name.includes('building plan') || name.includes('autodcr') || name.includes('sanction') || name.includes('architect')) {
    return 'https://autodcr.gov.in/';
  }

  // Default fallback: National Single Window & Services Portal of India
  return 'https://services.india.gov.in/';
}

export const getOfficialDocumentApplicationUrl = getDocumentApplicationUrl;

