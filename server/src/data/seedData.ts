import { GovernmentUpdate } from '../types.js';

export const initialGovernmentUpdates: GovernmentUpdate[] = [
  {
    id: 'update-1',
    type: 'Important Update',
    date: '24 Sep 2026',
    title: 'Digital Aadhaar Authentication Mandatory for Enterprise Registration',
    description: 'Central circular requires biometric e-KYC or Aadhaar OTP verification for all new commercial enterprise filings across national portals.',
    serviceId: 'step-2',
    sourceUrl: 'https://udyamregistration.gov.in',
    previousValue: 'Self-attested physical scan accepted',
    newValue: 'Mandatory Aadhaar biometric OTP e-KYC verification',
    reviewStatus: 'Pending Review'
  },
  {
    id: 'update-2',
    type: 'Fee Update',
    date: '20 Sep 2026',
    title: 'Zero Statutory Filing Fee Reaffirmed for Micro & Small Enterprises',
    description: 'Ministry of MSME and State Directorate circular reaffirms nil official filing charges on national single-window portal.',
    serviceId: 'step-1',
    sourceUrl: 'https://services.india.gov.in',
    previousValue: 'Fee structure under annual revision',
    newValue: '100% statutory fee waiver for small business registrations',
    reviewStatus: 'Approved'
  },
  {
    id: 'update-3',
    type: 'New Service',
    date: '18 Sep 2026',
    title: 'Instant Municipal Digital Certificates Expanded Across Urban Local Bodies',
    description: 'Auto-approval of shop & establishment certificates enabled for low-risk commercial activities with immediate QR code verification.',
    serviceId: 'step-3',
    sourceUrl: 'https://services.india.gov.in',
    previousValue: 'Manual ward inspector verification (14 days)',
    newValue: 'Instant automated digital certification with self-declaration',
    reviewStatus: 'Approved'
  }
];
