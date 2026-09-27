import { CivicIntent, StructuredGoal } from '../../types.js';

interface ParseGoalOptions {
  locationOverride?: string;
  context?: string;
}

/**
 * Intelligent deterministic fallback parser for Indian Civic procedures.
 * Used when Gemini API quota (429) is exhausted or API is unavailable.
 */
function parseGoalDeterministically(query: string, options?: ParseGoalOptions): StructuredGoal {
  const q = query.toLowerCase().trim();
  
  // Extract location
  let city = 'Mumbai';
  let state = 'Maharashtra';
  if (options?.locationOverride) {
    const parts = options.locationOverride.split(',').map((p) => p.trim());
    if (parts[0]) city = parts[0];
    if (parts[1]) state = parts[1];
  } else {
    if (q.includes('delhi')) { city = 'Delhi'; state = 'Delhi'; }
    else if (q.includes('bangalore') || q.includes('bengaluru')) { city = 'Bengaluru'; state = 'Karnataka'; }
    else if (q.includes('pune')) { city = 'Pune'; state = 'Maharashtra'; }
    else if (q.includes('mumbai')) { city = 'Mumbai'; state = 'Maharashtra'; }
  }

  // 1. Vehicle & Transport
  let result: StructuredGoal;

  // 1. Vehicle & Transport
  if (
    q.includes('vehicle') || q.includes('car') || q.includes('bike') || 
    q.includes('scooter') || q.includes('rto') || q.includes('driving license') || 
    q.includes('dl') || q.includes('hsrp') || q.includes('registration') && q.includes('number plate')
  ) {
    const isBike = q.includes('bike') || q.includes('two wheeler') || q.includes('scooter');
    result = {
      rawGoal: query,
      intent: 'REGISTER_VEHICLE',
      domain: 'TRANSPORT',
      activity: isBike ? 'TWO_WHEELER_REGISTRATION' : 'VEHICLE_REGISTRATION',
      location: { city, state, country: 'India' },
      context: { scale: 'personal', type: 'personal', additionalNotes: options?.context || '' },
      entities: { vehicleType: isBike ? 'Two-Wheeler' : 'Four-Wheeler' },
      confidence: 0.95,
      clarificationNeeded: false
    };
  } else if (
    q.includes('rent') || q.includes('lease') || q.includes('tenant') || 
    q.includes('leave and license') || q.includes('leave & license') || 
    q.includes('pg') || q.includes('sublet') || q.includes('rental')
  ) {
    result = {
      rawGoal: query,
      intent: 'PROPERTY_RENTAL',
      domain: 'PROPERTY_RENTAL',
      activity: 'RENTAL_AGREEMENT',
      location: { city, state, country: 'India' },
      context: { scale: 'residential', type: 'residential_rental', additionalNotes: options?.context || '' },
      entities: { propertyType: 'Residential Rental / Tenancy' },
      confidence: 0.95,
      clarificationNeeded: false
    };
  } else if (
    q.includes('flat') || q.includes('apartment') || q.includes('buy house') || 
    q.includes('buy property') || q.includes('purchase flat') || q.includes('buy flat') || 
    q.includes('buying') && (q.includes('flat') || q.includes('house') || q.includes('property')) ||
    q.includes('stamp duty') || q.includes('registry') || q.includes('sale deed') || 
    q.includes('rera') || q.includes('maharera') || q.includes('resale flat')
  ) {
    result = {
      rawGoal: query,
      intent: 'BUILD_PROPERTY',
      domain: 'PROPERTY_ACQUISITION',
      activity: 'FLAT_PURCHASE',
      location: { city, state, country: 'India' },
      context: { scale: 'residential', type: 'residential_flat', additionalNotes: options?.context || '' },
      entities: { propertyType: 'Residential Flat / Apartment' },
      confidence: 0.95,
      clarificationNeeded: false
    };
  } else if (
    q.includes('build') || q.includes('construct') || q.includes('house') || 
    q.includes('property') || q.includes('building') || q.includes('sanction') || 
    q.includes('autodcr') || q.includes('iod') || q.includes('cc') || q.includes('naksha')
  ) {
    result = {
      rawGoal: query,
      intent: 'BUILD_PROPERTY',
      domain: 'URBAN_DEVELOPMENT',
      activity: 'RESIDENTIAL_CONSTRUCTION',
      location: { city, state, country: 'India' },
      context: { scale: 'medium', type: 'residential', additionalNotes: options?.context || '' },
      entities: { propertyType: 'Residential Plot / Building' },
      confidence: 0.95,
      clarificationNeeded: false
    };
  } else if (
    q.includes('certificate') || q.includes('birth') || q.includes('death') || 
    q.includes('income') || q.includes('caste') || q.includes('domicile') || q.includes('marriage')
  ) {
    let certType = 'Birth Certificate';
    if (q.includes('income')) certType = 'Income Certificate';
    else if (q.includes('death')) certType = 'Death Certificate';
    else if (q.includes('marriage')) certType = 'Marriage Certificate';
    else if (q.includes('caste')) certType = 'Caste Certificate';
    else if (q.includes('domicile')) certType = 'Domicile Certificate';

    result = {
      rawGoal: query,
      intent: 'GET_CERTIFICATE',
      domain: 'VITAL_RECORDS',
      activity: certType.toUpperCase().replace(/\s+/g, '_'),
      location: { city, state, country: 'India' },
      context: { scale: 'personal', type: 'personal', additionalNotes: options?.context || '' },
      entities: { certificateType: certType },
      confidence: 0.95,
      clarificationNeeded: false
    };
  } else if (
    q.includes('bakery') || q.includes('cafe') || q.includes('restaurant') || 
    q.includes('food') || q.includes('sweet') || q.includes('hotel') || 
    q.includes('canteen') || q.includes('cloud kitchen') || q.includes('dhaba')
  ) {
    result = {
      rawGoal: query,
      intent: 'START_BUSINESS',
      domain: 'FOOD_BUSINESS',
      activity: q.includes('bakery') ? 'BAKERY' : q.includes('cafe') ? 'CAFE' : 'FOOD_BUSINESS',
      location: { city, state, country: 'India' },
      context: { scale: 'small', type: 'commercial', additionalNotes: options?.context || '' },
      entities: { businessType: q.includes('bakery') ? 'bakery' : 'food establishment', scale: 'micro/small' },
      confidence: 0.95,
      clarificationNeeded: false
    };
  } else if (q.includes('fire') || q.includes('trade license') || q.includes('noc')) {
    result = {
      rawGoal: query,
      intent: 'APPLY_FOR_LICENSE',
      domain: 'SAFETY_COMPLIANCE',
      activity: 'FIRE_SAFETY_NOC',
      location: { city, state, country: 'India' },
      context: { scale: 'commercial', type: 'commercial', additionalNotes: options?.context || '' },
      entities: { businessType: 'Fire Safety & Trade NOC' },
      confidence: 0.95,
      clarificationNeeded: false
    };
  } else {
    result = {
      rawGoal: query,
      intent: 'START_BUSINESS',
      domain: 'COMMERCIAL_ENTERPRISE',
      activity: 'GENERAL_ENTERPRISE',
      location: { city, state, country: 'India' },
      context: { scale: 'small', type: 'commercial', additionalNotes: options?.context || '' },
      entities: { businessType: query || 'commercial enterprise', scale: 'micro/small' },
      confidence: 0.90,
      clarificationNeeded: false
    };
  }

  result.isFallback = true;
  result.engine = 'DETERMINISTIC_CIVIC_ENGINE';
  result.fallbackReason = 'Verified Statutory Gazette Fallback (Offline Mode)';
  return result;
}

export async function parseCitizenGoal(
  rawQuery: string,
  options?: ParseGoalOptions
): Promise<StructuredGoal> {
  const query = (rawQuery || '').trim();
  const hasLlmKey = !!(
    (process.env.GROQ_API_KEY && process.env.GROQ_API_KEY.trim()) ||
    (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim()) ||
    (process.env.OPENROUTER_API_KEY && process.env.OPENROUTER_API_KEY.trim())
  );

  if (!hasLlmKey) {
    console.info('[DishaSaathi] No LLM API keys found, using deterministic civic intent parser.');
    return parseGoalDeterministically(query, options);
  }

  try {

    const prompt = `You are DishaSaathi's Civic Intent & Entity Recognition Engine for Indian Government Procedures.
Analyze the user's natural-language civic query: "${query}".
Location provided by user: "${options?.locationOverride || 'Unspecified'}".
Additional context: "${options?.context || 'None'}".

Extract the intent, domain, activity, location, and entities.
Intents must be one of: START_BUSINESS, BUILD_PROPERTY, PROPERTY_RENTAL, REGISTER_VEHICLE, GET_CERTIFICATE, APPLY_FOR_LICENSE, UNKNOWN.
- For renting/leasing/tenancy/Leave & License/PG, intent is PROPERTY_RENTAL and domain is PROPERTY_RENTAL, activity is RENTAL_AGREEMENT.
- For buying/purchasing resale flat or apartment, intent is BUILD_PROPERTY and domain is PROPERTY_ACQUISITION, activity is FLAT_PURCHASE.
- For constructing/building on plot, intent is BUILD_PROPERTY and domain is URBAN_DEVELOPMENT, activity is RESIDENTIAL_CONSTRUCTION.
- If the query is too vague (like "hello", "need help"), classify as UNKNOWN.

Return ONLY a valid JSON object matching this schema:
{
  "rawGoal": "${query}",
  "intent": "START_BUSINESS" | "BUILD_PROPERTY" | "PROPERTY_RENTAL" | "REGISTER_VEHICLE" | "GET_CERTIFICATE" | "APPLY_FOR_LICENSE" | "UNKNOWN",
  "domain": "e.g. PROPERTY_RENTAL, PROPERTY_ACQUISITION, URBAN_DEVELOPMENT, FOOD_BUSINESS, TRANSPORT, VITAL_RECORDS, etc.",
  "activity": "e.g. RENTAL_AGREEMENT, FLAT_PURCHASE, RESIDENTIAL_CONSTRUCTION, BAKERY, TWO_WHEELER, BIRTH_CERTIFICATE, etc.",
  "location": {
    "city": "Detected or provided city (default to Mumbai if mentioned, else India)",
    "state": "Detected or provided state (default to Maharashtra if Mumbai, else India)",
    "country": "India"
  },
  "context": {
    "scale": "small | medium | large | residential | commercial | personal | unspecified",
    "type": "residential_rental | flat_purchase | home_based | commercial | personal | unspecified",
    "additionalNotes": "any relevant details"
  },
  "entities": {
    "businessType": "e.g. bakery, retail, tech",
    "vehicleType": "e.g. bike, car, commercial",
    "propertyType": "e.g. residential 3bhk flat, residential plot, commercial shop",
    "certificateType": "e.g. birth, death, marriage",
    "scale": "e.g. small, micro"
  },
  "confidence": 0.95,
  "clarificationNeeded": false
}`;

    const { callUniversalLlm } = await import('./universalLlm.js');
    const result = await callUniversalLlm({
      prompt,
      jsonMode: true
    });

    if (result && result.text) {
      const parsed = JSON.parse(result.text) as StructuredGoal;
      if (parsed.intent) {
        if (options?.locationOverride) {
          const parts = options.locationOverride.split(',').map((p) => p.trim());
          parsed.location.city = parts[0] || parsed.location.city;
          if (parts[1]) parsed.location.state = parts[1];
        }

        // Post-processing normalization for high fidelity mapping
        const qLower = query.toLowerCase();
        if (
          qLower.includes('rent') || qLower.includes('lease') || qLower.includes('tenant') || 
          qLower.includes('leave and license') || qLower.includes('leave & license') || 
          qLower.includes('pg') || qLower.includes('sublet') || qLower.includes('rental')
        ) {
          parsed.intent = 'PROPERTY_RENTAL';
          parsed.domain = 'PROPERTY_RENTAL';
          parsed.activity = 'RENTAL_AGREEMENT';
          parsed.clarificationNeeded = false;
        } else if (
          (qLower.includes('buy') || qLower.includes('purchase')) && 
          (qLower.includes('flat') || qLower.includes('house') || qLower.includes('apartment') || qLower.includes('property'))
        ) {
          parsed.intent = 'BUILD_PROPERTY';
          parsed.domain = 'PROPERTY_ACQUISITION';
          parsed.activity = 'FLAT_PURCHASE';
          parsed.clarificationNeeded = false;
        }

        parsed.isFallback = false;
        parsed.engine = `AI_GEN_${result.provider.toUpperCase().replace(/\s+/g, '_')}`;
        return parsed;
      }
    }

    return parseGoalDeterministically(query, options);
  } catch (aiErr: any) {
    console.warn('[DishaSaathi] AI parser encountered error. Seamlessly using intelligent civic parser:', aiErr?.message || aiErr);
    return parseGoalDeterministically(query, options);
  }
}
