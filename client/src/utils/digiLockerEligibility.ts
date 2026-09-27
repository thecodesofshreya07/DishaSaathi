/**
 * Helper to determine whether a statutory document is legitimately available
 * in the citizen's personal DigiLocker / API Setu national repository.
 */
export function isDigiLockerAvailable(docName: string): boolean {
  if (!docName) return false;
  const lower = docName.toLowerCase();

  // EXCLUSIONS: Private contracts, physical photos, laboratory tests, third-party/parents' IDs
  if (
    lower.includes('parent') ||
    lower.includes('father') ||
    lower.includes('mother') ||
    lower.includes('spouse') ||
    lower.includes('marriage') ||
    lower.includes('rent') ||
    lower.includes('lease') ||
    lower.includes('tenancy') ||
    lower.includes('agreement') ||
    lower.includes('photo') ||
    lower.includes('signboard') ||
    lower.includes('layout') ||
    lower.includes('blueprint') ||
    lower.includes('architect') ||
    lower.includes('autodcr') ||
    lower.includes('water test') ||
    lower.includes('potability') ||
    lower.includes('lab') ||
    lower.includes('medical') ||
    lower.includes('fitness certificate') ||
    lower.includes('noc from landlord') ||
    lower.includes('affidavit') ||
    lower.includes('declaration')
  ) {
    return false;
  }

  // INCLUSIONS: Legitimate Central/State Gov e-Repository credentials issued to the individual
  if (
    lower.includes('aadhaar') ||
    lower.includes('pan card') ||
    lower.includes('permanent account number') ||
    lower.includes('driving licence') ||
    lower.includes('driving license') ||
    lower.includes('vehicle registration') ||
    lower.includes('rc book') ||
    lower.includes('rc card') ||
    lower.includes('electricity') ||
    lower.includes('power bill') ||
    lower.includes('utility bill') ||
    lower.includes('udyam') ||
    lower.includes('msme') ||
    lower.includes('gumasta') ||
    lower.includes('caste') ||
    lower.includes('domicile') ||
    lower.includes('income certificate') ||
    lower.includes('property card') ||
    lower.includes('cts card') ||
    lower.includes('7/12')
  ) {
    return true;
  }

  return false;
}
