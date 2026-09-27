import { CivicIntent, StructuredGoal } from '../../types.js';

interface ParseGoalOptions {
  locationOverride?: string;
  context?: string;
}

export async function parseCitizenGoal(
  rawQuery: string,
  options?: ParseGoalOptions
): Promise<StructuredGoal> {
  const query = (rawQuery || '').trim();
  const apiKey = process.env.GEMINI_API_KEY;

  // 1. Strictly execute AI Goal Understanding via Gemini (no regex fallback)
  if (!apiKey) {
    throw new Error(
      'Gemini AI API key is not configured. Please set GEMINI_API_KEY in server/.env with your API key.'
    );
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
If the query is too vague (like "hello", "need help", "government"), classify as UNKNOWN and ask a helpful clarification question.

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
  "clarificationNeeded": boolean,
  "clarificationQuestion": "Helpful question if intent is UNKNOWN or ambiguous",
  "clarificationSuggestions": ["Suggestion 1", "Suggestion 2", "Suggestion 3"]
}`;

    const modelName = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
    let response: any = null;
    let lastErr: any = null;

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        response = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            responseMimeType: 'application/json'
          }
        });
        if (response && response.text) break;
      } catch (err: any) {
        lastErr = err;
        if (attempt < 3 && (err?.message?.includes('503') || err?.message?.includes('high demand') || err?.message?.includes('429'))) {
          await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
          continue;
        }
        throw err;
      }
    }

    if (response && response.text) {
      const parsed = JSON.parse(response.text) as StructuredGoal;
      if (parsed.intent) {
        // If locationOverride was explicitly supplied, ensure it takes precedence
        if (options?.locationOverride) {
          const parts = options.locationOverride.split(',').map((p) => p.trim());
          parsed.location.city = parts[0] || parsed.location.city;
          if (parts[1]) parsed.location.state = parts[1];
        }
        return parsed;
      }
    }

    throw lastErr || new Error('Gemini AI returned an empty or invalid response format.');
  } catch (aiErr: any) {
    console.error('Gemini AI Goal Parsing Error:', aiErr);
    throw new Error(`AI Goal Parsing failed: ${aiErr?.message || aiErr}.`);
  }
}
