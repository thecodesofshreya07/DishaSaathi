import { ProcedureStep } from '../types';

export interface JourneyCostSummary {
  label: string;
  minAmount: number;
  maxAmount: number;
  isFree: boolean;
  breakdown: Array<{ stepTitle: string; stepNumber: number; fee: string }>;
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
    const raw = step.fee?.amount || '';
    const cleanFee = raw.trim() || '₹0 (Free)';
    breakdown.push({
      stepTitle: step.title.replace(/^\d+\.\s*/, ''),
      stepNumber: step.stepNumber,
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
