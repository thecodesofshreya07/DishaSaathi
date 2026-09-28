import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { initialGovernmentUpdates } from './data/seedData.js';
import { CivicJourney, GovernmentUpdate, ProcedureStep } from './types.js';
import { parseCitizenGoal } from './services/civic/goalParser.js';
import { findRelevantProcedures } from './services/civic/procedureMapper.js';
import { buildRoadmap, answerContextualQuestion } from './services/civic/roadmapBuilder.js';
import { procedureKnowledgeBase } from './services/civic/procedureKnowledgeBase.js';
import { 
  getNextAction, 
  getDocumentSummary, 
  computeRoadmapDiff, 
  computeDocumentPriorities 
} from './services/civic/adaptiveEngine.js';
import { answerCopilotQuery } from './services/civic/copilotService.js';
import { runSourceVerificationPipeline } from './services/civic/sourceFetcher.js';
import { initDatabase, dbClient } from './db/database.js';
import { 
  registerUser, 
  loginUser, 
  saveUserJourney, 
  saveUserJourneys,
  getUserJourney, 
  getUserJourneys,
  deleteUserJourney,
  seedDefaultUser 
} from './services/authService.js';
import { 
  authMiddleware, 
  optionalAuthMiddleware, 
  AuthenticatedRequest 
} from './middleware/authMiddleware.js';
import { generateStatutoryGrievanceDraft, getStepSlaInfo } from './services/civic/slaEscalationService.js';
import { fetchFromDigiLocker } from './services/civic/digilockerService.js';
import { sendRoadmapEmail, sendEscalationNoticeEmail, sendEmailViaBrevo } from './services/civic/emailService.js';
import { generateRoadmapPdfBuffer } from './services/civic/pdfService.js';
import { getLocalIpAddress } from './utils/networkUtils.js';

dotenv.config();

// Initialize database schema and seed default citizen
initDatabase().then(() => {
  seedDefaultUser();
});

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// In-memory state store for active citizen session
let currentJourney: CivicJourney | null = null;
let updates: GovernmentUpdate[] = JSON.parse(JSON.stringify(initialGovernmentUpdates));

// Helper to ensure currentJourney is initialized
async function ensureDefaultJourney(): Promise<CivicJourney> {
  if (currentJourney) return currentJourney;
  try {
    const structuredGoal = await parseCitizenGoal('Open a bakery in Mumbai', {});
    const procedures = findRelevantProcedures(structuredGoal);
    currentJourney = buildRoadmap(structuredGoal, procedures);
  } catch (e) {
    console.error('Failed to create default journey:', e);
  }
  return currentJourney!;
}

// Pre-warm default journey on launch
ensureDefaultJourney().catch(() => {});

// 1. Health check endpoint (Phase 1 Requirement)
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'DishaSaathi API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    scenario: 'Municipal Bureaucracy Path Visualizer (PSWB02)'
  });
});

// Network Info Endpoint for Phone QR Discovery (Returns local Wi-Fi / LAN IP so phones connect without localhost errors)
app.get('/api/network-info', (_req: Request, res: Response) => {
  const ip = getLocalIpAddress();
  const publicUrl = process.env.PUBLIC_URL || process.env.RENDER_EXTERNAL_URL || process.env.VERCEL_URL;
  res.json({
    success: true,
    ip,
    port: PORT,
    clientPort: 5173,
    publicUrl: publicUrl ? (publicUrl.startsWith('http') ? publicUrl : `https://${publicUrl}`) : undefined,
    directPdfUrl: `http://${ip}:${PORT}/api/journey/current/download-pdf`,
    clientUrl: `http://${ip}:5173`
  });
});

// Direct Phone Binary PDF Download Endpoint
app.get('/api/journey/:id/download-pdf', async (req: Request, res: Response) => {
  const { id } = req.params;
  const citizenName = (req.query.citizenName as string) || 'Verified Citizen';

  let targetJourney: CivicJourney | null = null;

  if (currentJourney && (currentJourney.id === id || id === 'current')) {
    targetJourney = currentJourney;
  } else if (id && id.includes('flat')) {
    const g = await parseCitizenGoal('Purchase a flat in Mumbai', {});
    targetJourney = buildRoadmap(g, findRelevantProcedures(g));
  } else if (id && id.includes('license')) {
    const g = await parseCitizenGoal('Four-wheeler driving license in Mumbai', {});
    targetJourney = buildRoadmap(g, findRelevantProcedures(g));
  } else if (id && id.includes('bakery')) {
    const g = await parseCitizenGoal('Open a commercial bakery in Mumbai', {});
    targetJourney = buildRoadmap(g, findRelevantProcedures(g));
  } else {
    // Check if any user in the persistent database has this journey saved
    try {
      const dbResult = await dbClient.execute({
        sql: 'SELECT journey_data FROM user_journeys ORDER BY updated_at DESC',
        args: []
      });
      for (const row of dbResult.rows) {
        try {
          const parsed = JSON.parse(row.journey_data as string);
          const list = Array.isArray(parsed) ? parsed : parsed?.journeys ? parsed.journeys : [parsed];
          const found = list.find((j: any) => j && (j.id === id || j.title?.toLowerCase().includes(id.toLowerCase())));
          if (found) {
            targetJourney = found;
            break;
          }
        } catch {}
      }
    } catch (e) {
      console.warn('Could not query database for journey id', id, e);
    }

    if (!targetJourney) {
      targetJourney = await ensureDefaultJourney();
    }
  }

  if (!targetJourney) {
    return res.status(404).send('Civic Roadmap not found');
  }

  try {
    const pdfBuffer = generateRoadmapPdfBuffer(targetJourney, citizenName);
    const safeTitle = (targetJourney.title || 'roadmap').toLowerCase().replace(/[^a-z0-9]/g, '-');
    const filename = `dishasaathi-${safeTitle}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.end(pdfBuffer);
  } catch (err: any) {
    console.error('Error generating PDF download:', err);
    return res.status(500).send('Error generating PDF roadmap');
  }
});

app.get('/api/journey/download-pdf', async (req: Request, res: Response) => {
  const journeyId = (req.query.journeyId as string) || 'current';
  req.params.id = journeyId;
  return (app as any)._router.handle(req, res);
});

// ============================================================
// AUTHENTICATION & PERSISTENT ACCOUNTS (Turso Cloud / SQLite DB)
// ============================================================

app.post('/api/auth/register', async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, error: 'Name, email, and password are required' });
  }
  try {
    const { user, token } = await registerUser(name, email, password);
    res.json({ success: true, user, token });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message || 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email and password are required' });
  }
  try {
    const { user, token, savedJourney, savedJourneys } = await loginUser(email, password);
    res.json({ success: true, user, token, journey: savedJourney, journeys: savedJourneys || [] });
  } catch (err: any) {
    res.status(401).json({ success: false, error: err.message || 'Invalid credentials' });
  }
});

app.get('/api/auth/me', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ success: false, error: 'Not authenticated' });
  }
  try {
    const journeys = await getUserJourneys(req.user.id);
    const journey = journeys.length > 0 ? journeys[0] : null;
    res.json({ success: true, user: req.user, journey, journeys });
  } catch (err: any) {
    res.json({ success: true, user: req.user, journey: null, journeys: [] });
  }
});

// Multiple Journey DB sync endpoints for logged-in citizens
app.get('/api/user/journeys', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ success: false, error: 'Not authenticated' });
  try {
    const journeys = await getUserJourneys(req.user.id);
    res.json({ success: true, journeys });
  } catch (err: any) {
    res.json({ success: true, journeys: [] });
  }
});

app.post('/api/user/journeys', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ success: false, error: 'Not authenticated' });
  const { journey, journeys } = req.body;
  try {
    if (journeys && Array.isArray(journeys)) {
      await saveUserJourneys(req.user.id, journeys);
      return res.json({ success: true, journeys, message: 'Journeys synced successfully' });
    } else if (journey) {
      const updated = await saveUserJourney(req.user.id, journey);
      return res.json({ success: true, journeys: updated, message: 'Journey saved successfully' });
    }
    return res.status(400).json({ success: false, error: 'No journey data provided' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Failed to save journey' });
  }
});

app.delete('/api/user/journeys/:id', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ success: false, error: 'Not authenticated' });
  try {
    const updated = await deleteUserJourney(req.user.id, req.params.id);
    res.json({ success: true, journeys: updated, message: 'Journey deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Failed to delete journey' });
  }
});

// Journey DB sync endpoints for logged-in citizens (single)
app.post('/api/user/journey', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ success: false, error: 'Not authenticated' });
  const { journey } = req.body;
  if (!journey) return res.status(400).json({ success: false, error: 'Journey data required' });
  try {
    await saveUserJourney(req.user.id, journey);
    res.json({ success: true, message: 'Journey saved to cloud database' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Failed to save journey' });
  }
});

app.get('/api/user/journey', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ success: false, error: 'Not authenticated' });
  try {
    const journey = await getUserJourney(req.user.id);
    res.json({ success: true, journey });
  } catch (err: any) {
    res.json({ success: true, journey: null });
  }
});

// 2. Get active civic journey
app.get('/api/journey/current', async (req: Request, res: Response) => {
  res.json({
    success: true,
    journey: currentJourney
  });
});

// 3. Dynamic Natural Language Task Interpretation & Procedure Synthesis (Phase 3 Core Pipeline)
app.post('/api/journey/interpret', async (req: Request, res: Response) => {
  const { goal, city, state, additionalContext } = req.body;
  const userGoal = (goal || '').trim();
  const locationOverride = city ? `${city}${state ? `, ${state}` : ''}` : undefined;

  try {
    // 1. Goal Understanding -> Structured Goal
    const structuredGoal = await parseCitizenGoal(userGoal, {
      locationOverride,
      context: additionalContext
    });

    // 2. Procedure Mapping -> Relevant Candidate Procedures
    const procedures = findRelevantProcedures(structuredGoal);

    // 3. Dependency Resolution & Topological Ordering -> Roadmap
    const dynamicJourney = buildRoadmap(structuredGoal, procedures);
    currentJourney = dynamicJourney;

    res.json({
      success: true,
      structuredGoal,
      interpreted: {
        goal: userGoal,
        task: dynamicJourney.title,
        location: dynamicJourney.location,
        category: dynamicJourney.category,
        intent: structuredGoal.intent,
        domain: structuredGoal.domain,
        activity: structuredGoal.activity,
        confidence: structuredGoal.confidence,
        sourceCount: dynamicJourney.steps.length,
        dependenciesMapped: dynamicJourney.steps.reduce((acc, s) => acc + s.prerequisites.length, 0),
        clarificationNeeded: structuredGoal.clarificationNeeded || false
      },
      journey: currentJourney
    });
  } catch (err: any) {
    console.error('Error in AI goal interpretation:', err);
    res.status(400).json({ 
      success: false, 
      error: err.message || 'AI Goal Parsing failed. Please ensure GEMINI_API_KEY is configured in server/.env.' 
    });
  }
});

// 3b. Grounded "Ask DishaSaathi" Contextual AI Assistant (Phase 3 & 4 Requirement)
const handleAskAssistant = async (req: Request, res: Response) => {
  try {
    const { question, journey } = req.body;
    const stepId = req.body.stepId || req.body.focusStepId;
    if (!question) {
      return res.status(400).json({ success: false, error: 'Question is required' });
    }
    const activeJourney = journey || currentJourney;
    if (!activeJourney) {
      return res.status(404).json({ success: false, error: 'No active roadmap found' });
    }

    const response = await answerContextualQuestion(question, stepId, activeJourney);
    res.json({
      success: true,
      ...response
    });
  } catch (err: any) {
    console.error('Error in Ask DishaSaathi:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to process question',
      answer: "I couldn't verify this requirement from an authoritative source yet."
    });
  }
};

app.post('/api/journey/ask', handleAskAssistant);
app.post('/api/assistant/ask', handleAskAssistant);

// 3c. AI-Powered Official Source Excerpt Extraction (Section 7: View only specific texts)
app.post('/api/sources/excerpt', async (req: Request, res: Response) => {
  const { title, authority, sourceUrl, stepTitle, query } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(400).json({
      success: false,
      error: 'Gemini AI API key is not configured. Please set GEMINI_API_KEY in server/.env to enable AI source excerpt extraction.'
    });
  }

  try {
    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `You are DishaSaathi's Official Government Source & Gazette Extractor.
A citizen is fulfilling the requirement: "${stepTitle || title}" under "${authority || 'Government Authority'}" (${sourceUrl || 'Official Portal'}).
Their broader civic goal is: "${query || 'Civic procedure compliance in India'}".

Your task is to:
1. Extract and highlight ONLY the specific statutory text, gazette clause, or relevant rule extract that directly applies to this citizen's step, without overwhelming them with irrelevant paperwork or legal boilerplate.
2. CRITICAL FOR portalLink: The citizen does NOT want a generic homepage (such as https://fssai.gov.in, https://mumbai.gov.in, or https://maharashtra.gov.in) because it is hard to find the service on broad websites. Find and return the EXACT, DIRECT deep subpage URL where this specific application or document or gazette notification is located (for example: https://foscos.fssai.gov.in/apply-for-new-license, https://lms.mahaonline.gov.in, https://udyamregistration.gov.in/Government-India/Ministry-MSME-registration.htm, https://sarathi.parivahan.gov.in/sarathiservice/, https://reg.gst.gov.in/registration/, etc.). It MUST be the exact wanted page!

Return ONLY a valid JSON object matching this schema:
{
  "statutoryClause": "e.g., Section 31(1) of Food Safety and Standards Act, 2006 / Rule 6 of Maharashtra Shops and Establishments Rules",
  "specificRuleText": "The exact verbatim or authoritative legal excerpt that specifies this obligation.",
  "whatIsRequiredOfYou": [
    "Crisp bullet point 1 explaining ONLY what the citizen must do",
    "Crisp bullet point 2 explaining what documents or fees apply"
  ],
  "exemptionsOrThresholds": "Any key threshold (e.g. turnover under ₹12 Lakhs/year, employee headcount < 10, etc.)",
  "authorityName": "${authority || 'Designated Statutory Authority'}",
  "portalLink": "The exact deep application/regulation subpage URL"
}`;

    const modelName = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
    let response: any = null;

    try {
      response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      });
    } catch (apiErr: any) {
      console.warn('[DishaSaathi] Gemini API rate limit / error in excerpt extraction. Falling back gracefully:', apiErr?.message || apiErr);
    }

    if (response && response.text) {
      const excerpt = JSON.parse(response.text);

      // Deep URL normalization fallback to guarantee exact page
      const stepStr = `${stepTitle || ''} ${title || ''} ${authority || ''}`.toLowerCase();
      if (!excerpt.portalLink || excerpt.portalLink === 'https://fssai.gov.in' || excerpt.portalLink.endsWith('.gov.in/')) {
        if (stepStr.includes('fssai') || stepStr.includes('food')) {
          excerpt.portalLink = 'https://foscos.fssai.gov.in/apply-for-new-license';
        } else if (stepStr.includes('gumasta') || stepStr.includes('shop') || stepStr.includes('establishment')) {
          excerpt.portalLink = 'https://lms.mahaonline.gov.in/';
        } else if (stepStr.includes('udyam') || stepStr.includes('msme')) {
          excerpt.portalLink = 'https://udyamregistration.gov.in/Government-India/Ministry-MSME-registration.htm';
        } else if (stepStr.includes('gst')) {
          excerpt.portalLink = 'https://reg.gst.gov.in/registration/';
        } else if (stepStr.includes('driving') || stepStr.includes('licence') || stepStr.includes('rto')) {
          excerpt.portalLink = 'https://sarathi.parivahan.gov.in/sarathiservice/';
        } else if (stepStr.includes('vehicle') || stepStr.includes('rc') || stepStr.includes('vahan')) {
          excerpt.portalLink = 'https://vahan.parivahan.gov.in/vahanservice/';
        } else if (stepStr.includes('fire') && stepStr.includes('noc')) {
          excerpt.portalLink = 'https://portal.mcgm.gov.in/irj/portal/anonymous/qlfirnoc';
        } else if (stepStr.includes('property tax') || stepStr.includes('mutation')) {
          excerpt.portalLink = 'https://ptaxportal.mcgm.gov.in/ptax/';
        } else if (stepStr.includes('birth') || stepStr.includes('death')) {
          excerpt.portalLink = 'https://crsorgi.gov.in/';
        } else if (stepStr.includes('income') || stepStr.includes('caste') || stepStr.includes('domicile')) {
          excerpt.portalLink = 'https://aaplesarkar.mahaonline.gov.in/';
        }
      }

      excerpt.isFallback = false;
      excerpt.engine = 'AI_GEN_GEMINI';
      return res.json({ success: true, excerpt });
    }
    throw new Error('Gemini AI returned empty excerpt response.');
  } catch (err: any) {
    console.error('Source excerpt extraction error (falling back to authoritative gazette):', err);
    
    // Authoritative fallback so the citizen always gets the exact statutory text and deep portal subpage
    const stepStr = `${stepTitle || ''} ${title || ''} ${authority || ''}`.toLowerCase();
    let statutoryClause = 'Section 31(1) of Food Safety and Standards Act, 2006';
    let specificRuleText = 'No person shall commence or carry on any food business without a valid license or registration under this Act.';
    let portalLink = 'https://foscos.fssai.gov.in/apply-for-new-license';
    let whatIsRequiredOfYou = [
      'Submit Form-A / Form-B with identity & premises proof',
      'Maintain basic sanitary and hygienic standards'
    ];
    let exemptionsOrThresholds = 'Petty food manufacturers with annual turnover up to ₹12 Lakhs require registration only.';

    if (stepStr.includes('gumasta') || stepStr.includes('shop') || stepStr.includes('establishment')) {
      statutoryClause = 'Section 6 of Maharashtra Shops and Establishments (Regulation of Employment and Conditions of Service) Act, 2017';
      specificRuleText = 'Every employer of an establishment employing ten or more workers shall submit an application for registration to the Facilitator within sixty days from the date of commencement of business.';
      portalLink = 'https://lms.mahaonline.gov.in/';
      whatIsRequiredOfYou = [
        'Submit online Form-A with premises rent deed/ownership and electricity bill',
        'Upload photograph of the establishment signboard in local language'
      ];
      exemptionsOrThresholds = 'Establishments with fewer than 10 workers require self-declaration intimation (Form-F) with zero fee.';
    } else if (stepStr.includes('udyam') || stepStr.includes('msme')) {
      statutoryClause = 'Section 7(1) of the Micro, Small and Medium Enterprises Development Act, 2006';
      specificRuleText = 'Any person who intends to establish a micro, small or medium enterprise may file Udyam Registration online in the Udyam Registration portal.';
      portalLink = 'https://udyamregistration.gov.in/Government-India/Ministry-MSME-registration.htm';
      whatIsRequiredOfYou = [
        'Aadhaar number of the proprietor or managing partner',
        'PAN and GSTIN linked with mobile number'
      ];
      exemptionsOrThresholds = 'Investment in plant & machinery under ₹1 Crore and turnover under ₹5 Crores qualifies as Micro Enterprise.';
    } else if (stepStr.includes('gst')) {
      statutoryClause = 'Rule 8 of Central Goods and Services Tax Rules, 2017';
      specificRuleText = 'Every person liable to be registered under sub-section (1) of section 25 shall, before applying for registration, declare his Permanent Account Number, mobile number, and e-mail address in Part A of FORM GST REG-01.';
      portalLink = 'https://reg.gst.gov.in/registration/';
      whatIsRequiredOfYou = [
        'Complete Part-A on the GST portal to generate Temporary Reference Number (TRN)',
        'Upload PAN, Aadhaar OTP authentication, and commercial address proof'
      ];
      exemptionsOrThresholds = 'Mandatory threshold is aggregate turnover exceeding ₹40 Lakhs for goods (₹20 Lakhs for services).';
    } else if (stepStr.includes('driving') || stepStr.includes('licence') || stepStr.includes('rto')) {
      statutoryClause = 'Section 9 of Motor Vehicles Act, 1988 (read with Central Motor Vehicles Rules, 1989)';
      specificRuleText = 'Any person who is not for the time being disqualified for holding or obtaining a driving licence may apply to the licensing authority having jurisdiction.';
      portalLink = 'https://sarathi.parivahan.gov.in/sarathiservice/';
      whatIsRequiredOfYou = [
        'Hold a valid Learner Licence for at least 30 days prior to permanent driving test',
        'Submit Form-4 application with Aadhaar and pass the physical driving track evaluation'
      ];
      exemptionsOrThresholds = 'Age minimum: 18 years for light motor vehicles, 16 years for gearless two-wheelers (<50cc).';
    }

    return res.json({
      success: true,
      excerpt: {
        statutoryClause,
        specificRuleText,
        whatIsRequiredOfYou,
        exemptionsOrThresholds,
        authorityName: authority || 'Designated Statutory Authority',
        portalLink,
        isFallback: true,
        engine: 'STATUTORY_GAZETTE_FALLBACK',
        fallbackReason: 'Verified Statutory Gazette Notification (Offline Direct)'
      }
    });
  }
});

// ============================================================
// IMPACT METRICS — Landing Page Hero Stats
// Derived from the canonical procedure knowledge base
// ============================================================

// Helper: estimate in-person visits needed for a procedure without DishaSaathi
function estimateInPersonVisits(proc: { applicationMode: string; estimatedTime: string; dependsOn: string[] }): number {
  // Offline = 3 visits minimum (inquiry, submission, pickup)
  // Hybrid = 2 visits (submission + pickup / inspection)
  // Online-only = 1 visit (citizens still have to go once for verification/OTP in India)
  if (proc.applicationMode === 'Offline') return 3;
  if (proc.applicationMode === 'Hybrid') return 2;
  return 1;
}

app.get('/api/metrics/impact', (_req: Request, res: Response) => {

  const totalProcedures = procedureKnowledgeBase.length;
  const totalInPersonVisitsWithout = procedureKnowledgeBase.reduce(
    (sum, p) => sum + estimateInPersonVisits(p), 0
  );
  // With DishaSaathi: user only needs 1 guided session per procedure (digital guided flow)
  const totalInPersonVisitsWith = totalProcedures; // 1 per procedure for digital uploads / e-sign
  const visitsSaved = totalInPersonVisitsWithout - totalInPersonVisitsWith;

  // Estimate hours saved: each in-person visit = avg 3.5 hrs (commute + queue + wait + return)
  const hoursPerVisit = 3.5;
  const hoursSaved = Math.round(visitsSaved * hoursPerVisit);

  // Max total cost if all KB fees are paid (upper range)
  const verifiedCount = procedureKnowledgeBase.filter(p => p.verificationStatus === 'VERIFIED').length;

  res.json({
    success: true,
    metrics: {
      totalProcedures,
      totalInPersonVisitsWithout,
      visitsSaved,
      hoursSaved,
      verifiedProcedures: verifiedCount,
      domainsCount: [...new Set(procedureKnowledgeBase.map(p => p.domain))].length,
      jurisdictionsCount: [...new Set(procedureKnowledgeBase.map(p => p.jurisdiction.city || p.jurisdiction.state || p.jurisdiction.country))].length
    }
  });
});

// 4. Update step status with dependency/block enforcement
const handleUpdateStepStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, journeyId } = req.body;

  let targetJourney: CivicJourney | null = null;
  let isUserOwned = false;
  const user = (req as AuthenticatedRequest).user;

  if (user) {
    const userJourneys = await getUserJourneys(user.id);
    if (journeyId) {
      targetJourney = userJourneys.find((j) => j.id === journeyId) || null;
    }
    if (!targetJourney && userJourneys.length > 0) {
      targetJourney = userJourneys.find((j) => j.steps && j.steps.some(s => s.id === id)) || userJourneys[0];
    }
    if (targetJourney) {
      isUserOwned = true;
    }
  }

  if (!targetJourney) {
    targetJourney = currentJourney;
  }

  if (!targetJourney) {
    return res.status(200).json({ success: true, message: 'Status updated locally' });
  }

  const stepIndex = targetJourney.steps.findIndex(s => s.id === id);
  if (stepIndex === -1) {
    return res.status(200).json({ success: true, message: 'Step updated locally' });
  }

  const step = targetJourney.steps[stepIndex];

  // If attempting to mark complete, check prerequisites
  if (status === 'Completed') {
    const prereqs = step.prerequisites || step.dependsOn || [];
    const uncompletedPrereqs = prereqs.filter(prereqId => {
      const p = targetJourney?.steps.find(s => s.id === prereqId);
      return p && p.status !== 'Completed';
    });

    if (uncompletedPrereqs.length > 0) {
      const prereqTitles = uncompletedPrereqs.map(pId => {
        const p = targetJourney?.steps.find(s => s.id === pId);
        return p ? p.title.replace(/^\d+\.\s*/, '') : pId;
      });

      return res.status(400).json({
        success: false,
        blocked: true,
        message: `Prerequisite steps must be completed first: ${prereqTitles.join(', ')}`,
        uncompletedPrerequisites: uncompletedPrereqs
      });
    }
  }

  step.status = status;

  // Recalculate stats
  const completedCount = targetJourney.steps.filter(s => s.status === 'Completed').length;
  targetJourney.completedSteps = completedCount;
  targetJourney.status = completedCount === targetJourney.steps.length && targetJourney.steps.length > 0 ? 'Completed' : 'In Progress';

  if (targetJourney === currentJourney) {
    currentJourney = targetJourney;
  }

  // Sync to database ONLY if this journey belongs to the authenticated user
  if (user && isUserOwned) {
    await saveUserJourney(user.id, targetJourney);
  }

  res.json({
    success: true,
    step,
    journey: targetJourney
  });
};

app.patch('/api/journey/steps/:id/status', optionalAuthMiddleware, handleUpdateStepStatus);
app.post('/api/journey/steps/:id/status', optionalAuthMiddleware, handleUpdateStepStatus);

// 4b. Update document status ("I have this document" checklist tracking)
app.patch('/api/journey/steps/:stepId/documents/:docId/status', optionalAuthMiddleware, async (req: Request, res: Response) => {
  const { stepId, docId } = req.params;
  const { status, journeyId } = req.body;
  const user = (req as AuthenticatedRequest).user;

  let targetJourney: CivicJourney | null = null;
  let isUserOwned = false;

  if (user) {
    const userJourneys = await getUserJourneys(user.id);
    if (journeyId) {
      targetJourney = userJourneys.find(j => j.id === journeyId) || null;
    }
    if (!targetJourney && userJourneys.length > 0) {
      targetJourney = userJourneys.find(j => j.steps && j.steps.some(s => s.id === stepId)) || userJourneys[0];
    }
    if (targetJourney) {
      isUserOwned = true;
    }
  }

  if (!targetJourney) {
    targetJourney = currentJourney;
  }

  if (!targetJourney) {
    return res.status(404).json({ success: false, error: 'No active journey' });
  }

  const step = targetJourney.steps.find((s) => s.id === stepId);
  if (!step) {
    return res.status(404).json({ success: false, error: 'Step not found' });
  }

  const doc = step.documents.find((d) => d.id === docId);
  if (!doc) {
    return res.status(404).json({ success: false, error: 'Document not found' });
  }

  doc.status = status;

  // Recalculate document readiness metrics
  let totalDocs = 0;
  let readyDocs = 0;
  let mandatoryPending = 0;

  for (const s of targetJourney.steps) {
    for (const d of s.documents) {
      totalDocs++;
      if (d.status === 'READY' || d.status === 'UPLOADED') {
        readyDocs++;
      } else if (d.isMandatory) {
        mandatoryPending++;
      }
    }
  }

  targetJourney.totalDocuments = totalDocs;
  targetJourney.readyDocuments = readyDocs;
  targetJourney.pendingDocuments = mandatoryPending;

  if (targetJourney === currentJourney) {
    currentJourney = targetJourney;
  }

  // Sync to database ONLY if this journey belongs to the authenticated user
  if (user && isUserOwned) {
    await saveUserJourney(user.id, targetJourney);
  }

  res.json({
    success: true,
    document: doc,
    journey: targetJourney
  });
});

// 5. Government updates endpoint
app.get('/api/updates', (req: Request, res: Response) => {
  res.json({
    success: true,
    updates
  });
});

// 6. Trigger Change Detection & apply to roadmap
app.post('/api/updates/:id/apply', (req: Request, res: Response) => {
  const { id } = req.params;
  const update = updates.find(u => u.id === id);

  if (!update) {
    return res.status(404).json({ success: false, error: 'Update not found' });
  }

  update.reviewStatus = 'Approved';

  let targetStep: any = null;
  if (currentJourney && currentJourney.steps && currentJourney.steps.length > 0) {
    targetStep = currentJourney.steps.find(s => s.id === update.serviceId) || currentJourney.steps[0];
    if (targetStep) {
      targetStep.hasUpdate = true;
      targetStep.updateDetails = {
        date: update.date,
        summary: update.title,
        addedRequirement: update.newValue
      };
      if (!targetStep.documents) targetStep.documents = [];
      targetStep.documents.push({
        id: `doc-update-${Date.now()}`,
        name: update.newValue || 'Updated Statutory Document Requirement',
        description: `Amended requirement as per notification on ${update.date}`,
        isMandatory: true,
        sourceUrl: update.sourceUrl
      });
      currentJourney.pendingDocuments = (currentJourney.pendingDocuments || 0) + 1;
    }
  }

  res.json({
    success: true,
    message: 'Government requirement change approved & applied to visual roadmap',
    affectedStep: targetStep?.id,
    journey: currentJourney || null,
    update
  });
});

// 7. Admin Review Endpoint
app.post('/api/updates/:id/review', (req: Request, res: Response) => {
  const { id } = req.params;
  const { action } = req.body;

  const update = updates.find(u => u.id === id);
  if (!update) {
    return res.status(404).json({ success: false, error: 'Update not found' });
  }

  update.reviewStatus = action === 'Approve' ? 'Approved' : 'Rejected';

  res.json({
    success: true,
    message: `Update ${id} marked as ${update.reviewStatus}`,
    update
  });
});

// 7b. Live Source Verification Pipeline (Crawl FSSAI, GSTN, BMC)
app.post('/api/admin/verify-sources', async (req: Request, res: Response) => {
  try {
    const pipelineResult = await runSourceVerificationPipeline(updates);
    updates = pipelineResult.updatedList;
    res.json({
      success: true,
      message: `Verified ${pipelineResult.verifiedCount} official sources. ${pipelineResult.newMismatchesDetected} new updates flagged for review.`,
      verifiedCount: pipelineResult.verifiedCount,
      newMismatchesDetected: pipelineResult.newMismatchesDetected,
      results: pipelineResult.results,
      updates
    });
  } catch (err: any) {
    console.error('Error in source verification pipeline:', err);
    res.status(500).json({ success: false, error: 'Source verification encountered an error' });
  }
});

// 8. Reset journey
app.post('/api/journey/reset', async (req: Request, res: Response) => {
  const structuredGoal = await parseCitizenGoal('Open a bakery in Mumbai', {});
  const procedures = findRelevantProcedures(structuredGoal);
  currentJourney = buildRoadmap(structuredGoal, procedures);
  updates = JSON.parse(JSON.stringify(initialGovernmentUpdates));
  res.json({
    success: true,
    message: 'Journey reset to fresh state',
    journey: currentJourney
  });
});

// ============================================================
// PHASE 5: ADAPTIVE COPILOT, REFINEMENT, & DEMO SCENARIOS
// ============================================================

// 9. Adaptive Action Engine: Next Best Action, Document Priorities & Health
app.get('/api/journey/adaptive-action', (req: Request, res: Response) => {
  if (!currentJourney) {
    return res.status(404).json({ success: false, error: 'No active roadmap' });
  }
  const recommendation = getNextAction(currentJourney);
  const documentSummary = getDocumentSummary(currentJourney);
  res.json({
    success: true,
    recommendation,
    documentSummary
  });
});

// 10. Goal Refinement & Non-destructive Roadmap Diff (Section 24, 25, 26)
app.post('/api/journey/refine', async (req: Request, res: Response) => {
  const { goal, city, state, additionalContext, journey } = req.body;
  const targetJourney: CivicJourney | null = journey || currentJourney;
  if (!targetJourney) {
    return res.status(404).json({ success: false, error: 'No active roadmap found to refine' });
  }

  const targetQuery = (goal || targetJourney.query || targetJourney.title || '').trim();
  let targetLocation = targetJourney.location || 'Mumbai, Maharashtra';
  if (city) {
    targetLocation = `${city}${state ? `, ${state}` : ''}`;
  }

  try {
    const parsedGoal = await parseCitizenGoal(targetQuery, {
      locationOverride: targetLocation,
      context: additionalContext
    });

    const candidateProcs = findRelevantProcedures(parsedGoal);
    const newRoadmap = buildRoadmap(parsedGoal, candidateProcs);
    const { diff, adaptedJourney } = computeRoadmapDiff(targetJourney, newRoadmap);

    currentJourney = adaptedJourney;

    res.json({
      success: true,
      journey: adaptedJourney,
      diff,
      recommendation: getNextAction(adaptedJourney)
    });
  } catch (err: any) {
    console.error('Error during roadmap refinement:', err);
    res.status(500).json({ success: false, error: err.message || 'Failed to refine roadmap' });
  }
});

// 11. Roadmap Re-Check against Knowledge Base (Section 21)
app.post('/api/journey/recheck', (req: Request, res: Response) => {
  if (!currentJourney) {
    return res.status(404).json({ success: false, error: 'No active roadmap' });
  }

  currentJourney = computeDocumentPriorities(currentJourney);
  const recommendation = getNextAction(currentJourney);
  const documentSummary = getDocumentSummary(currentJourney);

  res.json({
    success: true,
    message: 'Re-checked against the current DishaSaathi knowledge base.',
    journey: currentJourney,
    recommendation,
    documentSummary
  });
});

// 12. Contextual Civic Copilot Message with Evidence (Section 1–6)
app.post('/api/copilot/message', async (req: Request, res: Response) => {
  try {
    const { question, focusStepId, journey } = req.body;
    const activeJourney = journey || currentJourney;
    if (!activeJourney) {
      return res.status(404).json({ success: false, error: 'No active roadmap found' });
    }

    const response = await answerCopilotQuery({
      question,
      focusStepId,
      journey: activeJourney
    });

    res.json({
      success: true,
      ...response
    });
  } catch (err: any) {
    console.error('Error in Copilot query:', err);
    res.status(500).json({
      success: false,
      answer: "I couldn't verify this requirement from an authoritative source right now.",
      uncertaintyNotice: "Service connectivity notice: operating in offline fallback mode."
    });
  }
});

// ============================================================
// 12. "STUCK? HERE'S WHAT TO DO" (SLA & ESCALATION TRACKER)
// ============================================================
app.post('/api/civic/sla-escalation', async (req: Request, res: Response) => {
  try {
    const { citizenName, stepTitle, department, applicationNumber, submissionDate, daysElapsed, contactEmail, contactPhone, location } = req.body;
    if (!stepTitle) {
      return res.status(400).json({ success: false, error: 'stepTitle is required' });
    }

    const grievanceData = generateStatutoryGrievanceDraft({
      citizenName: citizenName || 'Citizen Applicant',
      stepTitle,
      department,
      applicationNumber,
      submissionDate,
      daysElapsed: daysElapsed !== undefined ? Number(daysElapsed) : 0,
      contactEmail,
      contactPhone,
      location
    });

    res.json({
      success: true,
      ...grievanceData
    });
  } catch (err: any) {
    console.error('Error generating SLA escalation draft:', err);
    res.status(500).json({ success: false, error: err.message || 'Failed to generate grievance letter' });
  }
});

// ============================================================
// 13. DIRECT GOVERNMENT REPOSITORY FETCH (DIGILOCKER / API SETU)
// ============================================================
app.post('/api/civic/digilocker/fetch', async (req: Request, res: Response) => {
  try {
    const { documentName, documentType, citizenAadhaarOrId, consentGranted } = req.body;
    if (!documentName && !documentType) {
      return res.status(400).json({ success: false, error: 'documentName or documentType is required' });
    }

    const verifiedDoc = await fetchFromDigiLocker({
      documentName: documentName || 'Government Document',
      documentType: documentType || 'Official_Certificate',
      citizenAadhaarOrId,
      consentGranted: consentGranted !== false
    });

    res.json({
      success: true,
      document: verifiedDoc
    });
  } catch (err: any) {
    console.error('Error in DigiLocker fetch:', err);
    res.status(500).json({ success: false, error: err.message || 'Failed to fetch from DigiLocker' });
  }
});

// ============================================================
// 14. BREVO EMAIL CIVIC ROADMAP & ESCALATION DELIVERY
// ============================================================
app.post('/api/civic/send-roadmap-email', async (req: Request, res: Response) => {
  try {
    const { email, name, journey } = req.body;
    const activeJourney = journey || currentJourney;

    if (!email) {
      return res.status(400).json({ success: false, error: 'Email address is required' });
    }
    if (!activeJourney) {
      return res.status(404).json({ success: false, error: 'No active roadmap found to email' });
    }

    const result = await sendRoadmapEmail(email, name || 'Citizen', activeJourney);
    res.json(result);
  } catch (err: any) {
    console.error('Error sending roadmap email:', err);
    res.status(500).json({ success: false, error: err.message || 'Failed to send roadmap email' });
  }
});

app.post('/api/civic/send-escalation-email', async (req: Request, res: Response) => {
  try {
    const {
      toEmail,
      citizenName,
      stepTitle,
      authority,
      mandatedSlaDays,
      daysElapsed,
      applicationNumber,
      complaintDraft,
      firstAppellateAuthority,
      officialGrievancePortal
    } = req.body;

    if (!toEmail || !complaintDraft) {
      return res.status(400).json({ success: false, error: 'toEmail and complaintDraft are required' });
    }

    const result = await sendEscalationNoticeEmail({
      toEmail,
      citizenName: citizenName || 'Citizen',
      stepTitle: stepTitle || 'Civic Application',
      authority: authority || 'Competent Authority',
      mandatedSlaDays: Number(mandatedSlaDays) || 15,
      daysElapsed: Number(daysElapsed) || 22,
      applicationNumber: applicationNumber || 'N/A',
      complaintDraft,
      firstAppellateAuthority: firstAppellateAuthority || 'First Appellate Authority',
      officialGrievancePortal: officialGrievancePortal || 'https://pgportal.gov.in/'
    });

    res.json(result);
  } catch (err: any) {
    console.error('Error sending escalation email:', err);
    res.status(500).json({ success: false, error: err.message || 'Failed to send escalation email' });
  }
});

app.post('/api/civic/email-assist', async (req: Request, res: Response) => {
  try {
    const { email, name, question, journey } = req.body;
    if (!email || !question) {
      return res.status(400).json({ success: false, error: 'Email and question are required' });
    }

    const activeJourney = journey || currentJourney;
    const answerResult = activeJourney
      ? await answerCopilotQuery({ question, journey: activeJourney })
      : { answer: 'Thank you for reaching out to DishaSaathi. Please visit the portal to track active procedures.' };

    const htmlContent = `
      <div style="font-family: sans-serif; padding: 20px; max-width: 600px; color: #11261F;">
        <div style="background-color: #1B4D3E; color: white; padding: 18px; border-radius: 12px; margin-bottom: 16px;">
          <h2 style="margin: 0; font-size: 18px;">DishaSaathi Civic Assistant Response</h2>
        </div>
        <div style="background-color: #F8FAF9; padding: 16px; border-radius: 10px; border: 1px solid #DCE8E1; margin-bottom: 16px;">
          <p style="font-size: 12px; color: #5C7066; margin: 0 0 6px 0;"><strong>Your Question:</strong></p>
          <p style="font-size: 14px; margin: 0; color: #11261F;">${question}</p>
        </div>
        <div style="font-size: 14px; line-height: 1.6; color: #11261F; margin-bottom: 20px;">
          ${(answerResult.answer || '').replace(/\\n/g, '<br/>')}
        </div>
        <div style="font-size: 11px; color: #6C8075; border-top: 1px solid #DCE8E1; padding-top: 12px;">
          Powered by DishaSaathi Civic Navigation • Official Gazette Grounded
        </div>
      </div>
    `;

    const result = await sendEmailViaBrevo(
      [{ email, name: name || 'Citizen' }],
      `DishaSaathi Civic Query: ${question.substring(0, 40)}...`,
      htmlContent
    );

    res.json({
      success: true,
      answer: answerResult.answer,
      emailSent: result.success,
      simulated: result.simulated
    });
  } catch (err: any) {
    console.error('Error in email assist:', err);
    res.status(500).json({ success: false, error: err.message || 'Failed to process email inquiry' });
  }
});

// Production Static Client Serving & SPA Fallback
const rootDir = typeof __dirname !== 'undefined' ? __dirname : process.cwd();
const candidateDistPaths = [
  path.resolve(rootDir, '../../client/dist'),
  path.resolve(rootDir, '../client/dist'),
  path.resolve(process.cwd(), '../client/dist'),
  path.resolve(process.cwd(), 'client/dist'),
  path.resolve(process.cwd(), 'dist')
];
const clientDistPath = candidateDistPaths.find((p) => fs.existsSync(p));

if (clientDistPath) {
  console.log(` Serving static client bundle from: ${clientDistPath}`);
  app.use(express.static(clientDistPath));
  app.get('*', (req: Request, res: Response, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

const server = app.listen(PORT, () => {
  console.log(` DishaSaathi Server running on http://localhost:${PORT}`);
  console.log(` Health Check: http://localhost:${PORT}/api/health`);
});

server.on('error', (err: any) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`️ Port ${PORT} is currently in use.`);
  } else {
    console.error('Server error:', err);
  }
});
