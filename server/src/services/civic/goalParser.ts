import { CivicIntent, StructuredGoal } from '../../types.js';

interface ParseGoalOptions {
  locationOverride?: string;
  context?: string;
}

/**
 * Dynamic location extractor supporting Indian cities and common phonetic typos (e.g. navglore)
 */
export function extractLocationFromQuery(query: string, options?: ParseGoalOptions): { city: string; state: string } {
  const q = (query || '').toLowerCase().trim();
  let city = 'Mumbai';
  let state = 'Maharashtra';

  if (options?.locationOverride) {
    const parts = options.locationOverride.split(',').map((p) => p.trim());
    if (parts[0]) city = parts[0];
    if (parts[1]) state = parts[1];
    return { city, state };
  }

  // 1. Karnataka cities & common phonetic typos (e.g. navglore, bangalore, mangalore)
  if (
    q.includes('navglore') ||
    q.includes('bangalore') ||
    q.includes('bengaluru') ||
    q.includes('banglore') ||
    q.includes('बंगळुरू') ||
    q.includes('बेंगळुरू')
  ) {
    return { city: 'Bengaluru', state: 'Karnataka' };
  }
  if (q.includes('mangalore') || q.includes('mangaluru')) return { city: 'Mangaluru', state: 'Karnataka' };
  if (q.includes('mysore') || q.includes('mysuru')) return { city: 'Mysuru', state: 'Karnataka' };
  if (q.includes('hubli') || q.includes('dharwad')) return { city: 'Hubli-Dharwad', state: 'Karnataka' };
  if (q.includes('belgaum') || q.includes('belagavi')) return { city: 'Belagavi', state: 'Karnataka' };
  if (q.includes('karnataka')) return { city: 'Bengaluru', state: 'Karnataka' };

  // 2. Maharashtra
  if (q.includes('pune') || q.includes('पुणे')) return { city: 'Pune', state: 'Maharashtra' };
  if (q.includes('nagpur') || q.includes('नागपूर')) return { city: 'Nagpur', state: 'Maharashtra' };
  if (q.includes('nashik') || q.includes('नाशिक')) return { city: 'Nashik', state: 'Maharashtra' };
  if (q.includes('thane') || q.includes('ठाणे')) return { city: 'Thane', state: 'Maharashtra' };
  if (q.includes('navi mumbai') || q.includes('नवी मुंबई')) return { city: 'Navi Mumbai', state: 'Maharashtra' };
  if (q.includes('mumbai') || q.includes('मुंबई') || q.includes('bombay')) return { city: 'Mumbai', state: 'Maharashtra' };
  if (q.includes('maharashtra')) return { city: 'Mumbai', state: 'Maharashtra' };

  // 3. Delhi / NCR
  if (q.includes('delhi') || q.includes('दिल्ली') || q.includes('ncr')) return { city: 'Delhi', state: 'Delhi' };

  // 4. Telangana & Andhra Pradesh
  if (q.includes('hyderabad') || q.includes('हैदराबाद') || q.includes('secunderabad') || q.includes('telangana')) {
    return { city: 'Hyderabad', state: 'Telangana' };
  }
  if (q.includes('visakhapatnam') || q.includes('vizag')) return { city: 'Visakhapatnam', state: 'Andhra Pradesh' };
  if (q.includes('vijayawada')) return { city: 'Vijayawada', state: 'Andhra Pradesh' };
  if (q.includes('andhra')) return { city: 'Visakhapatnam', state: 'Andhra Pradesh' };

  // 5. Tamil Nadu
  if (q.includes('chennai') || q.includes('चेन्नई') || q.includes('madras')) return { city: 'Chennai', state: 'Tamil Nadu' };
  if (q.includes('coimbatore') || q.includes('madurai') || q.includes('tiruchirappalli') || q.includes('tamil nadu')) {
    return { city: q.includes('coimbatore') ? 'Coimbatore' : q.includes('madurai') ? 'Madurai' : 'Chennai', state: 'Tamil Nadu' };
  }

  // 6. West Bengal
  if (q.includes('kolkata') || q.includes('कलकत्ता') || q.includes('कोलकाता') || q.includes('calcutta') || q.includes('west bengal')) {
    return { city: 'Kolkata', state: 'West Bengal' };
  }

  // 7. Gujarat
  if (q.includes('ahmedabad') || q.includes('अहमदाबाद')) return { city: 'Ahmedabad', state: 'Gujarat' };
  if (q.includes('surat')) return { city: 'Surat', state: 'Gujarat' };
  if (q.includes('vadodara') || q.includes('baroda')) return { city: 'Vadodara', state: 'Gujarat' };
  if (q.includes('gujarat')) return { city: 'Ahmedabad', state: 'Gujarat' };

  // 8. Rajasthan
  if (q.includes('jaipur') || q.includes('जयपुर')) return { city: 'Jaipur', state: 'Rajasthan' };
  if (q.includes('jodhpur')) return { city: 'Jodhpur', state: 'Rajasthan' };
  if (q.includes('udaipur')) return { city: 'Udaipur', state: 'Rajasthan' };
  if (q.includes('rajasthan')) return { city: 'Jaipur', state: 'Rajasthan' };

  // 9. Uttar Pradesh
  if (q.includes('lucknow') || q.includes('लखनऊ')) return { city: 'Lucknow', state: 'Uttar Pradesh' };
  if (q.includes('noida') || q.includes('greater noida')) return { city: 'Noida', state: 'Uttar Pradesh' };
  if (q.includes('kanpur') || q.includes('varanasi') || q.includes('banaras') || q.includes('agra') || q.includes('uttar pradesh') || q.includes('u.p.') || q.includes('up')) {
    const matchedCity = q.includes('kanpur') ? 'Kanpur' : q.includes('varanasi') || q.includes('banaras') ? 'Varanasi' : q.includes('agra') ? 'Agra' : 'Lucknow';
    return { city: matchedCity, state: 'Uttar Pradesh' };
  }

  // 10. Kerala
  if (q.includes('kochi') || q.includes('cochin') || q.includes('thiruvananthapuram') || q.includes('trivandrum') || q.includes('kozhikode') || q.includes('calicut') || q.includes('kerala')) {
    const matchedCity = q.includes('thiruvananthapuram') || q.includes('trivandrum') ? 'Thiruvananthapuram' : q.includes('kozhikode') || q.includes('calicut') ? 'Kozhikode' : 'Kochi';
    return { city: matchedCity, state: 'Kerala' };
  }

  // 11. Haryana & Punjab
  if (q.includes('gurugram') || q.includes('gurgaon') || q.includes('faridabad') || q.includes('panipat') || q.includes('haryana')) {
    return { city: q.includes('faridabad') ? 'Faridabad' : 'Gurugram', state: 'Haryana' };
  }
  if (q.includes('ludhiana') || q.includes('amritsar') || q.includes('jalandhar') || q.includes('punjab')) {
    return { city: q.includes('amritsar') ? 'Amritsar' : q.includes('jalandhar') ? 'Jalandhar' : 'Ludhiana', state: 'Punjab' };
  }
  if (q.includes('chandigarh')) return { city: 'Chandigarh', state: 'Chandigarh' };

  // 12. Madhya Pradesh
  if (q.includes('indore') || q.includes('bhopal') || q.includes('gwalior') || q.includes('madhya pradesh') || q.includes('m.p.') || q.includes('mp')) {
    return { city: q.includes('bhopal') ? 'Bhopal' : 'Indore', state: 'Madhya Pradesh' };
  }

  // 13. Odisha, Bihar, Assam, Goa, Uttarakhand, Himachal, Jharkhand, Chhattisgarh, J&K
  if (q.includes('bhubaneswar') || q.includes('cuttack') || q.includes('odisha') || q.includes('orissa')) return { city: 'Bhubaneswar', state: 'Odisha' };
  if (q.includes('patna') || q.includes('bihar')) return { city: 'Patna', state: 'Bihar' };
  if (q.includes('guwahati') || q.includes('assam')) return { city: 'Guwahati', state: 'Assam' };
  if (q.includes('panaji') || q.includes('goa')) return { city: 'Panaji', state: 'Goa' };
  if (q.includes('dehradun') || q.includes('uttarakhand')) return { city: 'Dehradun', state: 'Uttarakhand' };
  if (q.includes('shimla') || q.includes('himachal')) return { city: 'Shimla', state: 'Himachal Pradesh' };
  if (q.includes('ranchi') || q.includes('jharkhand')) return { city: 'Ranchi', state: 'Jharkhand' };
  if (q.includes('raipur') || q.includes('chhattisgarh')) return { city: 'Raipur', state: 'Chhattisgarh' };
  if (q.includes('srinagar') || q.includes('jammu')) return { city: 'Srinagar', state: 'Jammu and Kashmir' };

  // Regex pattern to extract "in <location>" or "at <location>"
  const locMatch = q.match(/\b(?:in|at|for|near)\s+([a-zA-Z\u0900-\u097F]+)/i);
  if (locMatch && locMatch[1]) {
    const rawPlace = locMatch[1].trim();
    const ignored = ['a', 'the', 'my', 'this', 'our', 'commercial', 'small', 'new', 'shop', 'salon', 'parlour', 'business', 'india'];
    if (!ignored.includes(rawPlace.toLowerCase())) {
      city = rawPlace.charAt(0).toUpperCase() + rawPlace.slice(1);
      state = `${city} State Jurisdiction`;
      return { city, state };
    }
  }

  return { city, state };
}

/**
 * Intelligent deterministic fallback parser for Indian Civic procedures.
 * Used when Gemini API quota (429) is exhausted or API is unavailable.
 */
function parseGoalDeterministically(query: string, options?: ParseGoalOptions): StructuredGoal {
  const q = query.toLowerCase().trim();
  const { city, state } = extractLocationFromQuery(query, options);

  // 1. Driving Licence (RTO / Sarathi Parivahan) - English, Marathi, Hindi & Phonetic
  const isDrivingLicence =
    q.includes('driving') ||
    q.includes('license') ||
    q.includes('licence') ||
    q.includes('liscence') ||
    q.includes('lisence') ||
    q.includes('dl') ||
    q.includes('learner') ||
    q.includes('parwana') ||
    q.includes('perwana') ||
    q.includes('लायसन्स') ||
    q.includes('ड्रायव्हिंग') ||
    q.includes('परवाना') ||
    q.includes('चालक') ||
    (q.includes('sarathi') && !q.includes('disha'));

  let result: StructuredGoal;

  if (isDrivingLicence) {
    result = {
      rawGoal: query,
      intent: 'APPLY_FOR_LICENSE',
      domain: 'TRANSPORT',
      activity: 'DRIVING_LICENSE',
      location: { city, state, country: 'India' },
      context: { scale: 'personal', type: 'personal', additionalNotes: options?.context || '' },
      entities: { licenseType: 'Driving Licence (Learner / Permanent DL)' },
      confidence: 0.98,
      clarificationNeeded: false
    };
  } else if (
    q.includes('vehicle') || q.includes('car') || q.includes('bike') ||
    q.includes('scooter') || q.includes('rto') || q.includes('hsrp') ||
    q.includes('vahan') || q.includes('gadi') || q.includes('gaadi') ||
    q.includes('वाहन') || q.includes('गाडी') ||
    (q.includes('registration') && (q.includes('number plate') || q.includes('rc')))
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
    q.includes('pg') || q.includes('sublet') || q.includes('rental') ||
    q.includes('भाडे') || q.includes('करार') || q.includes('bhade')
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
    q.includes('salon') || q.includes('saloon') || q.includes('parlour') ||
    q.includes('parlor') || q.includes('beauty') || q.includes('hair') ||
    q.includes('spa') || q.includes('barber')
  ) {
    result = {
      rawGoal: query,
      intent: 'START_BUSINESS',
      domain: 'PERSONAL_CARE_SERVICES',
      activity: 'SALON_SETUP',
      location: { city, state, country: 'India' },
      context: { scale: 'small', type: 'commercial', additionalNotes: options?.context || '' },
      entities: { businessType: 'Hair Dressing Saloon / Beauty Parlour', scale: 'micro/small' },
      confidence: 0.98,
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
IMPORTANT: The query may be phrased in Marathi (मराठी), Hindi (हिन्दी), English, or phonetic Romanized Indic (e.g. "mala mumbai madhe driving liscence poayjhe" means "I need a driving licence in Mumbai", "भाडे करार" means "rental agreement", "जन्म दाखला" means "birth certificate").
Intents must be one of: START_BUSINESS, BUILD_PROPERTY, PROPERTY_RENTAL, REGISTER_VEHICLE, GET_CERTIFICATE, APPLY_FOR_LICENSE, UNKNOWN.
- For driving licence, learner's licence, driving permit, RTO driving tests (including Marathi "ड्रायव्हिंग लायसन्स", "परवाना", "driving liscence", "DL"), intent is APPLY_FOR_LICENSE, domain is TRANSPORT, activity is DRIVING_LICENSE.
- For registering a vehicle/car/bike/scooter (including Marathi "गाडी नोंदणी", "RTO registration"), intent is REGISTER_VEHICLE, domain is TRANSPORT, activity is VEHICLE_REGISTRATION or TWO_WHEELER_REGISTRATION.
- For renting/leasing/tenancy/Leave & License/PG (including Marathi "भाडे करार"), intent is PROPERTY_RENTAL and domain is PROPERTY_RENTAL, activity is RENTAL_AGREEMENT.
- For buying/purchasing resale flat or apartment (including Marathi "फ्लॅट खरेदी"), intent is BUILD_PROPERTY and domain is PROPERTY_ACQUISITION, activity is FLAT_PURCHASE.
- For constructing/building on plot, intent is BUILD_PROPERTY and domain is URBAN_DEVELOPMENT, activity is RESIDENTIAL_CONSTRUCTION.
- If the query is too vague (like "hello", "need help"), classify as UNKNOWN.

Return ONLY a valid JSON object matching this schema:
{
  "rawGoal": "${query}",
  "intent": "START_BUSINESS" | "BUILD_PROPERTY" | "PROPERTY_RENTAL" | "REGISTER_VEHICLE" | "GET_CERTIFICATE" | "APPLY_FOR_LICENSE" | "UNKNOWN",
  "domain": "e.g. PROPERTY_RENTAL, PROPERTY_ACQUISITION, URBAN_DEVELOPMENT, FOOD_BUSINESS, TRANSPORT, VITAL_RECORDS, etc.",
  "activity": "e.g. DRIVING_LICENSE, RENTAL_AGREEMENT, FLAT_PURCHASE, RESIDENTIAL_CONSTRUCTION, BAKERY, TWO_WHEELER, BIRTH_CERTIFICATE, etc.",
  "location": {
    "city": "The exact city extracted from user query (e.g. if user says 'in navglore' or 'in bangalore', extract 'Bengaluru'; if 'in mangalore', extract 'Mangaluru'; if 'in pune', extract 'Pune'; if 'in delhi', extract 'Delhi'; only use Mumbai if user actually specifies Mumbai or Maharashtra context)",
    "state": "The corresponding state (e.g. 'Karnataka' for Bengaluru/Mangaluru/Navglore, 'Maharashtra' for Mumbai/Pune, 'Delhi' for Delhi, etc.)",
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
    "licenseType": "e.g. Driving Licence (Learner / Permanent)",
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

        // Check for driving licence in any language or typo
        const isDL =
          qLower.includes('driving') ||
          qLower.includes('license') ||
          qLower.includes('licence') ||
          qLower.includes('liscence') ||
          qLower.includes('lisence') ||
          qLower.includes('dl') ||
          qLower.includes('learner') ||
          qLower.includes('parwana') ||
          qLower.includes('perwana') ||
          qLower.includes('लायसन्स') ||
          qLower.includes('ड्रायव्हिंग') ||
          qLower.includes('परवाना') ||
          qLower.includes('चालक') ||
          (qLower.includes('sarathi') && !qLower.includes('disha'));

        if (isDL) {
          parsed.intent = 'APPLY_FOR_LICENSE';
          parsed.domain = 'TRANSPORT';
          parsed.activity = 'DRIVING_LICENSE';
          parsed.clarificationNeeded = false;
        } else if (
          qLower.includes('rent') || qLower.includes('lease') || qLower.includes('tenant') ||
          qLower.includes('leave and license') || qLower.includes('leave & license') ||
          qLower.includes('pg') || qLower.includes('sublet') || qLower.includes('rental') ||
          qLower.includes('भाडे') || qLower.includes('करार') || qLower.includes('bhade')
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

        const detectedLoc = extractLocationFromQuery(query, options);
        if (
          qLower.includes('navglore') ||
          qLower.includes('bangalore') ||
          qLower.includes('bengaluru') ||
          qLower.includes('banglore') ||
          qLower.includes('mangalore') ||
          qLower.includes('mysore')
        ) {
          parsed.location.city = detectedLoc.city;
          parsed.location.state = 'Karnataka';
        } else if (
          parsed.location.city?.toLowerCase() === 'mumbai' &&
          !qLower.includes('mumbai') &&
          !qLower.includes('bombay') &&
          !qLower.includes('मुंबई')
        ) {
          parsed.location.city = detectedLoc.city;
          parsed.location.state = detectedLoc.state;
        }

        // Salon & Beauty Parlour setup
        if (
          qLower.includes('salon') || qLower.includes('saloon') || qLower.includes('parlour') ||
          qLower.includes('parlor') || qLower.includes('beauty') || qLower.includes('hair') ||
          qLower.includes('spa') || qLower.includes('barber')
        ) {
          parsed.intent = 'START_BUSINESS';
          parsed.domain = 'PERSONAL_CARE_SERVICES';
          parsed.activity = 'SALON_SETUP';
          parsed.entities = {
            ...parsed.entities,
            businessType: 'Hair Dressing Saloon / Beauty Parlour'
          };
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
