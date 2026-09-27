/**
 * Universal Multi-Provider LLM Client for DishaSaathi
 * 
 * Cascade Priority:
 * 1. Groq (Primary: Ultra-reliable, 100% Free, High Throughput)
 * 2. OpenRouter (Secondary Backup)
 * 3. Google Gemini / AI Studio (Tertiary Backup)
 * 4. GitHub Models / xAI Grok / OpenAI
 */

export interface LlmCallOptions {
  prompt: string;
  systemPrompt?: string;
  jsonMode?: boolean;
  temperature?: number;
}

export interface LlmCallResult {
  text: string;
  provider: string;
  model: string;
}

export async function callUniversalLlm(options: LlmCallOptions): Promise<LlmCallResult | null> {
  const { prompt, systemPrompt, jsonMode = false, temperature = 0.2 } = options;

  // =========================================================================
  // PRIORITY 1: Groq Cloud (100% Free, Highest Reliability & Speed)
  // =========================================================================
  if (process.env.GROQ_API_KEY && process.env.GROQ_API_KEY.trim().length > 0) {
    const groqCandidateModels = [
      process.env.GROQ_MODEL,
      'llama-3.3-70b-versatile',
      'llama-3.1-8b-instant',
      'mixtral-8x7b-32768',
      'gemma2-9b-it'
    ].filter(Boolean) as string[];

    for (const model of groqCandidateModels) {
      try {
        const messages: any[] = [];
        if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
        messages.push({ role: 'user', content: prompt });

        const body: any = {
          model,
          messages,
          temperature
        };
        if (jsonMode) {
          body.response_format = { type: 'json_object' };
        }

        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.GROQ_API_KEY.trim()}`
          },
          body: JSON.stringify(body)
        });

        if (res.ok) {
          const data = await res.json() as any;
          const text = data?.choices?.[0]?.message?.content?.trim();
          if (text) {
            return { text, provider: 'Groq', model };
          }
        } else {
          console.warn(`[DishaSaathi LLM] Groq (${model}) returned status ${res.status}. Attempting next model/provider.`);
        }
      } catch (e: any) {
        console.warn(`[DishaSaathi LLM] Groq connection error (${model}):`, e?.message);
      }
    }
  }

  // =========================================================================
  // PRIORITY 2: Google Gemini (Google AI Studio Free Tier)
  // =========================================================================
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0) {
    try {
      const { GoogleGenAI } = await import('@google/genai');
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY.trim() });
      const geminiCandidateModels = [
        process.env.GEMINI_MODEL,
        'gemini-2.5-flash',
        'gemini-2.0-flash',
        'gemini-1.5-flash'
      ].filter((m) => m && m !== 'gemini-3.8-flash') as string[];

      for (const modelName of geminiCandidateModels) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: {
              ...(systemPrompt ? { systemInstruction: systemPrompt } : {}),
              ...(jsonMode ? { responseMimeType: 'application/json' } : {})
            }
          });

          if (response && response.text) {
            return { text: response.text.trim(), provider: 'Google Gemini', model: modelName };
          }
        } catch (subErr) {
          // Continue to next candidate model
        }
      }
    } catch (e: any) {
      console.warn('[DishaSaathi LLM] Gemini call failed:', e?.message);
    }
  }

  // =========================================================================
  // PRIORITY 3: OpenRouter (Backup Multi-Model Gateway)
  // =========================================================================
  if (process.env.OPENROUTER_API_KEY && process.env.OPENROUTER_API_KEY.trim().length > 0) {
    const openRouterCandidateModels = [
      process.env.OPENROUTER_MODEL,
      'google/gemini-2.0-flash-exp:free',
      'meta-llama/llama-3.3-70b-instruct:free',
      'deepseek/deepseek-r1:free',
      'qwen/qwen-2.5-72b-instruct:free'
    ].filter(Boolean) as string[];

    for (const model of openRouterCandidateModels) {
      try {
        const messages: any[] = [];
        if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
        messages.push({ role: 'user', content: prompt });

        const body: any = {
          model,
          messages,
          temperature
        };
        if (jsonMode) {
          body.response_format = { type: 'json_object' };
        }

        const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY.trim()}`,
            'HTTP-Referer': 'http://localhost:5000',
            'X-Title': 'DishaSaathi'
          },
          body: JSON.stringify(body)
        });

        if (res.ok) {
          const data = await res.json() as any;
          const text = data?.choices?.[0]?.message?.content?.trim();
          if (text) {
            return { text, provider: 'OpenRouter', model };
          }
        }
      } catch (e: any) {
        console.warn(`[DishaSaathi LLM] OpenRouter error (${model}):`, e?.message);
      }
    }
  }

  // =========================================================================
  // PRIORITY 4: Direct OpenAI / xAI Grok (if provided)
  // =========================================================================
  if (process.env.GROK_API_KEY && process.env.GROK_API_KEY.trim().length > 0) {
    try {
      const model = process.env.GROK_MODEL || 'grok-2-latest';
      const messages: any[] = [];
      if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
      messages.push({ role: 'user', content: prompt });

      const res = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GROK_API_KEY.trim()}`
        },
        body: JSON.stringify({
          model,
          messages,
          temperature,
          ...(jsonMode ? { response_format: { type: 'json_object' } } : {})
        })
      });

      if (res.ok) {
        const data = await res.json() as any;
        const text = data?.choices?.[0]?.message?.content?.trim();
        if (text) {
          return { text, provider: 'xAI Grok', model };
        }
      }
    } catch (e: any) {
      console.warn('[DishaSaathi LLM] xAI Grok call failed:', e?.message);
    }
  }

  return null;
}
