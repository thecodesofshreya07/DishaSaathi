import { ProcedureStep } from '../types';

export interface JourneyCostSummary {
  label: string;
  minAmount: number;
  maxAmount: number;
  isFree: boolean;
  breakdown: Array<{ stepTitle: string; stepNumber: number; fee: string }>;
}

/**
 * Returns an accurate official statutory fee string for a step, providing
 * authoritative gazette defaults if fee.amount was missing or a generic string.
 */
export function getEstimatedFeeForStep(step: {
  title?: string;
  authority?: string;
  department?: string;
  fee?: { amount?: string; description?: string };
}): string {
  const existing = step.fee?.amount;
  if (existing && /\d/.test(existing)) {
    return existing.startsWith('₹') || existing.toLowerCase().includes('free') ? existing : `₹${existing}`;
  }

  const title = (step.title || '').toLowerCase();
  const auth = (step.authority || step.department || '').toLowerCase();

  // Waived or free steps
  if (
    title.includes('waived') ||
    title.includes('free') ||
    (title.includes('fire') && (title.includes('residential') || title.includes('kitchen') || title.includes('home'))) ||
    (title.includes('police') && (title.includes('eating') && (title.includes('residential') || title.includes('home')))) ||
    title.includes('udyam') ||
    title.includes('digilocker') ||
    (title.includes('aadhaar') && !title.includes('update'))
  ) {
    return '₹0 (Waived / Free)';
  }

  // FSSAI
  if (title.includes('fssai') || title.includes('food')) {
    if (title.includes('state') || title.includes('license') || title.includes('commercial')) {
      return '₹2,000 / year';
    }
    return '₹100 / year';
  }

  // Shop & Establishment
  if (title.includes('shop') || title.includes('gumasta') || title.includes('establishment')) {
    return '₹1,000';
  }

  // PAN / NSDL
  if (title.includes('pan')) {
    return '₹110';
  }

  // Driving License / RTO
  if (title.includes('learner') || title.includes('ll')) {
    return '₹350';
  }
  if (title.includes('driving') || title.includes('rto') || title.includes('dl')) {
    return '₹1,000';
  }

  // School / Education
  if (title.includes('school') || title.includes('rte') || title.includes('deo') || title.includes('recognition')) {
    return '₹10,000 – ₹25,000';
  }
  if (title.includes('trust') || title.includes('society')) {
    return '₹2,500 – ₹5,000';
  }

  // Healthcare / Clinic / Hospital
  if (title.includes('hospital') || title.includes('nursing home')) {
    return '₹15,000 – ₹30,000';
  }
  if (title.includes('clinic') || title.includes('medical council') || title.includes('bio-medical')) {
    return '₹2,500 – ₹5,000';
  }

  // Municipal Health & Trade
  if (title.includes('health') || title.includes('trade') || title.includes('municipal')) {
    return '₹2,500 – ₹5,000';
  }

  // Fire Safety NOC
  if (title.includes('fire')) {
    return '₹5,000 – ₹10,000';
  }

  // Police License
  if (title.includes('police') || title.includes('eating house')) {
    return '₹1,000 – ₹2,500';
  }

  // Property / Sub-Registrar
  if (title.includes('stamp') || title.includes('registration')) {
    return '₹30,000';
  }
  if (title.includes('mutation') || title.includes('tax transfer')) {
    return '₹500 – ₹1,500';
  }

  return '₹1,000';
}

/**
 * Calculates the total estimated statutory government fees across all steps of a civic journey.
 */
export function calculateTotalJourneyCost(steps: ProcedureStep[] = []): JourneyCostSummary {
  let minTotal = 0;
  let maxTotal = 0;
  let hasFee = false;
  const breakdown: Array<{ stepTitle: string; stepNumber: number; fee: string }> = [];

  for (const step of steps) {
    const raw = getEstimatedFeeForStep(step);
    const cleanFee = raw.trim() || '₹0 (Free)';
    breakdown.push({
      stepTitle: (step.title || '').replace(/^\d+\.\s*/, ''),
      stepNumber: step.stepNumber || 1,
      fee: cleanFee
    });

    if (!raw) continue;
    const lower = raw.toLowerCase();
    if (lower.includes('free') || lower.includes('₹0') || lower.includes('waived') || lower.includes('no extra')) {
      continue;
    }

    // Extract rupee amounts, e.g. ₹2,360, ₹1,500 - ₹5,000, ₹100
    const matches = raw.match(/₹\s*([0-9,]+)/g);
    if (matches && matches.length > 0) {
      hasFee = true;
      const parsedNums = matches
        .map((m) => parseInt(m.replace(/[^0-9]/g, ''), 10))
        .filter((n) => !isNaN(n));

      if (parsedNums.length === 1) {
        minTotal += parsedNums[0];
        maxTotal += parsedNums[0];
      } else if (parsedNums.length >= 2) {
        minTotal += parsedNums[0];
        maxTotal += parsedNums[1];
      }
    } else {
      const digitMatch = raw.match(/([0-9]{1,3}(?:,[0-9]{3})+|[0-9]{3,})/g);
      if (digitMatch && digitMatch.length > 0) {
        hasFee = true;
        const nums = digitMatch
          .map((d) => parseInt(d.replace(/,/g, ''), 10))
          .filter((n) => !isNaN(n));

        if (nums.length === 1) {
          minTotal += nums[0];
          maxTotal += nums[0];
        } else if (nums.length >= 2) {
          minTotal += nums[0];
          maxTotal += nums[1];
        }
      }
    }
  }

  if (!hasFee || (minTotal === 0 && maxTotal === 0)) {
    return {
      label: '₹0 (Free Government Filings)',
      minAmount: 0,
      maxAmount: 0,
      isFree: true,
      breakdown
    };
  }

  if (minTotal === maxTotal) {
    return {
      label: `₹${minTotal.toLocaleString('en-IN')}`,
      minAmount: minTotal,
      maxAmount: maxTotal,
      isFree: false,
      breakdown
    };
  }

  return {
    label: `₹${minTotal.toLocaleString('en-IN')} - ₹${maxTotal.toLocaleString('en-IN')}`,
    minAmount: minTotal,
    maxAmount: maxTotal,
    isFree: false,
    breakdown
  };
}
