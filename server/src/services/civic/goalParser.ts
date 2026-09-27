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
  if (
    q.includes('vehicle') || q.includes('car') || q.includes('bike') || 
    q.includes('scooter') || q.includes('rto') || q.includes('driving license') || 
    q.includes('dl') || q.includes('hsrp') || q.includes('registration') && q.includes('number plate')
  ) {
    const isBike = q.includes('bike') || q.includes('two wheeler') || q.includes('scooter');
    return {
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
  }

  // 2. Property & Construction
  if (
    q.includes('build') || q.includes('construct') || q.includes('house') || 
    q.includes('property') || q.includes('building') || q.includes('sanction') || 
    q.includes('autodcr') || q.includes('iod') || q.includes('cc') || q.includes('naksha')
  ) {
    return {
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
  }

  // 3. Certificates & Vital Records
  if (
    q.includes('certificate') || q.includes('birth') || q.includes('death') || 
    q.includes('income') || q.includes('caste') || q.includes('domicile') || q.includes('marriage')
  ) {
    let certType = 'Birth Certificate';
    if (q.includes('income')) certType = 'Income Certificate';
    else if (q.includes('death')) certType = 'Death Certificate';
    else if (q.includes('marriage')) certType = 'Marriage Certificate';
    else if (q.includes('caste')) certType = 'Caste Certificate';
    else if (q.includes('domicile')) certType = 'Domicile Certificate';

    return {
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
  }

  // 4. Food Businesses (Bakery, Cafe, Restaurant, etc.)
  const isFood = q.includes('bakery') || q.includes('cafe') || q.includes('restaurant') || 
                 q.includes('food') || q.includes('sweet') || q.includes('hotel') || 
                 q.includes('canteen') || q.includes('cloud kitchen') || q.includes('dhaba');

  if (isFood) {
    return {
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
  }

  // 5. Licenses (Fire NOC, Trade License, etc.)
  if (q.includes('fire') || q.includes('trade license') || q.includes('noc')) {
    return {
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
  }

  // 6. General Business (Retail, Tech, Agency, Clothing, Services, etc.)
  return {
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

export async function parseCitizenGoal(
  rawQuery: string,
  options?: ParseGoalOptions
): Promise<StructuredGoal> {
  const query = (rawQuery || '').trim();
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.info('[DishaSaathi] No GEMINI_API_KEY found, using deterministic civic intent parser.');
    return parseGoalDeterministically(query, options);
  }

  try {
    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `You are DishaSaathi's Civic Intent & Entity Recognition Engine for Indian Government Procedures.
Analyze the user's natural-language civic query: "${query}".
Location provided by user: "${options?.locationOverride || 'Unspecified'}".
Additional context: "${options?.context || 'None'}".

Extract the intent, domain, activity, location, and entities.
Intents must be one of: START_BUSINESS, BUILD_PROPERTY, REGISTER_VEHICLE, GET_CERTIFICATE, APPLY_FOR_LICENSE, UNKNOWN.
If the query is too vague (like "hello", "need help"), classify as UNKNOWN.

Return ONLY a valid JSON object matching this schema:
{
  "rawGoal": "${query}",
  "intent": "START_BUSINESS" | "BUILD_PROPERTY" | "REGISTER_VEHICLE" | "GET_CERTIFICATE" | "APPLY_FOR_LICENSE" | "UNKNOWN",
  "domain": "e.g. FOOD_BUSINESS, LAND_REVENUE, TRANSPORT, VITAL_RECORDS, etc.",
  "activity": "e.g. BAKERY, RESIDENTIAL_HOUSE, TWO_WHEELER, BIRTH_CERTIFICATE, etc.",
  "location": {
    "city": "Detected or provided city (default to Mumbai if mentioned, else India)",
    "state": "Detected or provided state (default to Maharashtra if Mumbai, else India)",
    "country": "India"
  },
  "context": {
    "scale": "small | medium | large | unspecified",
    "type": "home_based | commercial | personal | unspecified",
    "additionalNotes": "any relevant details"
  },
  "entities": {
    "businessType": "e.g. bakery, retail, tech",
    "vehicleType": "e.g. bike, car, commercial",
    "propertyType": "e.g. residential plot, flat",
    "certificateType": "e.g. birth, death, marriage",
    "scale": "e.g. small, micro"
  },
  "confidence": 0.95,
  "clarificationNeeded": false
}`;

    const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    
    // Make 1 single call to avoid exhausting the user's API quota
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    if (response && response.text) {
      const parsed = JSON.parse(response.text) as StructuredGoal;
      if (parsed.intent) {
        if (options?.locationOverride) {
          const parts = options.locationOverride.split(',').map((p) => p.trim());
          parsed.location.city = parts[0] || parsed.location.city;
          if (parts[1]) parsed.location.state = parts[1];
        }
        return parsed;
      }
    }

    return parseGoalDeterministically(query, options);
  } catch (aiErr: any) {
    console.warn('[DishaSaathi] Gemini API rate limit / error encountered. Seamlessly using intelligent civic parser without exhausting API key:', aiErr?.message || aiErr);
    // When 429 (Resource Exhausted) or any network/API error occurs, return deterministic goal immediately without breaking the user flow
    return parseGoalDeterministically(query, options);
  }
}
