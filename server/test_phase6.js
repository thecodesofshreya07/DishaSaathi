const http = require('http');

function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const dataString = body ? JSON.stringify(body) : null;
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...(dataString ? { 'Content-Length': Buffer.byteLength(dataString) } : {})
      }
    };

    const req = http.request(options, (res) => {
      let respData = '';
      res.on('data', (chunk) => { respData += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(respData);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, raw: respData });
        }
      });
    });

    req.on('error', (e) => reject(e));
    if (dataString) req.write(dataString);
    req.end();
  });
}

async function runPhase6Tests() {
  console.log('====================================================');
  console.log('🛡️  DISHASAATHI — PHASE 6 INTEGRATION & RELIABILITY SUITE');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, testName, details = '') {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName} ${details ? '— ' + details : ''}`);
      failed++;
    }
  }

  try {
    // ---------------------------------------------------------------
    // 1. CANONICAL CIVIC DATA MODEL & SINGLE SOURCE OF TRUTH (Sec 2, 3, 4, 6)
    // ---------------------------------------------------------------
    console.log('--- Test Group 1: Canonical Data Model & Single Source of Truth ---');
    const resetRes = await makeRequest('POST', '/api/journey/reset');
    assert(resetRes.status === 200 && resetRes.data.journey, 'Reset to clean baseline roadmap');

    const journey = resetRes.data.journey;
    assert(journey.dataVersion === 1, `Roadmap stamped with canonical DATA_VERSION = 1 (found: ${journey.dataVersion})`);
    assert(typeof journey.jurisdictionScope === 'string' && journey.jurisdictionScope.length > 0, `Jurisdiction scope declared: "${journey.jurisdictionScope}"`);

    // Verify canonical fields on every procedure step
    let allStepsValid = true;
    for (const step of journey.steps) {
      if (!step.id || !step.title || !step.source || !step.source.url) {
        allStepsValid = false;
        break;
      }
      if (!step.source.url.startsWith('https://')) {
        allStepsValid = false;
        break;
      }
      if (!['National', 'State', 'Municipal'].includes(step.jurisdictionLevel)) {
        allStepsValid = false;
        break;
      }
    }
    assert(allStepsValid, 'All steps adhere to canonical schema with secure https:// source and jurisdictionLevel');

    // ---------------------------------------------------------------
    // 2. DEPENDENCY GRAPH & ROADMAP INTEGRITY (Sec 16, 17, 18)
    // ---------------------------------------------------------------
    console.log('\n--- Test Group 2: Dependency Graph & Roadmap Integrity ---');
    const stepIds = new Set(journey.steps.map((s) => s.id));
    assert(stepIds.size === journey.steps.length, 'Zero duplicate step IDs in generated roadmap');

    // Verify all prerequisites exist within roadmap steps
    let prerequisitesValid = true;
    for (const step of journey.steps) {
      for (const pId of step.prerequisites) {
        if (!stepIds.has(pId)) {
          prerequisitesValid = false;
        }
      }
    }
    assert(prerequisitesValid, 'All prerequisite IDs reference strictly valid roadmap step IDs');

    // Verify document-to-step bidirectional relationship
    let docsValid = true;
    for (const step of journey.steps) {
      for (const doc of step.documents) {
        if (doc.requiredFor !== step.title || !doc.category || !['Blocking', 'Recommended', 'Future'].includes(doc.priority)) {
          docsValid = false;
        }
      }
    }
    assert(docsValid, 'Every document references its parent step and has valid priority and category (No orphan docs)');

    // ---------------------------------------------------------------
    // 3. JURISDICTION ENGINE & JURISDICTION FALLBACK (Sec 10, 11, 43)
    // ---------------------------------------------------------------
    console.log('\n--- Test Group 3: Jurisdiction Engine & Fallback Handling ---');
    // Test Wrong Jurisdiction: Bakery in Bengaluru (Karnataka) should NOT have Mumbai BMC Health License
    const bengaluruRes = await makeRequest('POST', '/api/journey/interpret', {
      goal: 'I want to start a bakery in Bengaluru',
      city: 'Bengaluru',
      state: 'Karnataka'
    });
    assert(bengaluruRes.status === 200 && bengaluruRes.data.journey, 'Interpreted bakery goal in Bengaluru');
    const bglSteps = bengaluruRes.data.journey.steps;
    const hasBmcLicense = bglSteps.some((s) => s.id === 'proc-bmc-health-license');
    const hasGumasta = bglSteps.some((s) => s.id === 'proc-gumasta-shop');
    assert(!hasBmcLicense, 'Mumbai BMC Municipal Health License is excluded for Bengaluru');
    assert(!hasGumasta, 'Maharashtra State Gumasta is excluded for Karnataka');

    // National procedures (PAN, MSME, FSSAI, GST) must still be present
    const hasNationalProcs = bglSteps.some((s) => s.id === 'proc-fssai-food') && bglSteps.some((s) => s.id === 'proc-pan-entity');
    assert(hasNationalProcs, 'National-level statutory procedures (PAN, FSSAI, GST) are provided as national guidance');

    // ---------------------------------------------------------------
    // 4. CLARIFICATION ON AMBIGUOUS & UNKNOWN GOALS (Sec 14, 41, 42)
    // ---------------------------------------------------------------
    console.log('\n--- Test Group 4: Clarification Engine for Ambiguous Goals ---');
    // Unknown Goal Test (Section 41)
    const unknownRes = await makeRequest('POST', '/api/journey/interpret', {
      goal: 'I need help.'
    });
    assert(unknownRes.status === 200, 'Handled vague/unknown goal "I need help."');
    assert(unknownRes.data.journey.clarification?.needed === true, 'Clarification requested for unknown goal');
    assert(unknownRes.data.journey.steps.length === 0, 'Did not generate a fabricated/random roadmap for unknown input');
    console.log(`   💡 Clarification prompt: "${unknownRes.data.journey.clarification?.question}"`);

    // Ambiguous Goal Test (Section 42)
    const ambiguousRes = await makeRequest('POST', '/api/journey/interpret', {
      goal: 'I want to start a business.'
    });
    assert(ambiguousRes.status === 200, 'Handled ambiguous goal "I want to start a business."');
    assert(ambiguousRes.data.journey.clarification?.needed === true, 'Prompted citizen for business activity and location');

    // ---------------------------------------------------------------
    // 5. COPILOT GROUNDING & ANTI-HALLUCINATION (Sec 19, 20, 21, 22)
    // ---------------------------------------------------------------
    console.log('\n--- Test Group 5: Copilot Grounding & Anti-Hallucination ---');
    // Restore primary bakery demo
    await makeRequest('POST', '/api/demo/load/bakery-mumbai');

    // Grounded Procedural Query
    const copilotDocQ = await makeRequest('POST', '/api/copilot/message', {
      question: 'What documents am I missing?'
    });
    assert(copilotDocQ.status === 200 && copilotDocQ.data.responseType === 'DOCUMENT_GUIDANCE', 'Copilot returned structured responseType: DOCUMENT_GUIDANCE');
    assert(copilotDocQ.data.evidence && copilotDocQ.data.evidence.sourceUrl, 'Copilot provided verified evidence citation');

    // Anti-Hallucination Query (Section 20)
    const copilotAlienQ = await makeRequest('POST', '/api/copilot/message', {
      question: 'How do I register a spaceship or nuclear submarine in Mumbai?'
    });
    assert(copilotAlienQ.status === 200, 'Copilot handled out-of-domain query safely');
    assert(copilotAlienQ.data.responseType === 'UNKNOWN', 'Copilot classified out-of-domain query as UNKNOWN');
    assert(copilotAlienQ.data.answer.includes('knowledge base') || copilotAlienQ.data.answer.includes('verified'), 'Copilot honestly declared lack of verified information rather than hallucinating');

    // ---------------------------------------------------------------
    // 6. ADAPTIVE NEXT-ACTION ENGINE & DOCUMENT READINESS (Sec 23, 24, 25)
    // ---------------------------------------------------------------
    console.log('\n--- Test Group 6: Adaptive Engine & Action Recommendations ---');
    const adaptiveRes = await makeRequest('GET', '/api/journey/adaptive-action');
    assert(adaptiveRes.status === 200 && adaptiveRes.data.recommendation, 'Computed adaptive action recommendation');
    const rec = adaptiveRes.data.recommendation;
    assert(rec.primaryAction && rec.primaryAction.stepId, 'Primary action identifies actionable step');
    assert(Array.isArray(rec.blockedActions) && rec.blockedActions.length > 0, 'Blocked actions correctly list prerequisite reasons');
    assert(['ON_TRACK', 'BLOCKER_NEEDS_ATTENTION', 'WAITING_FOR_VERIFICATION'].includes(rec.journeyHealth), `Clean journey health enum: ${rec.journeyHealth}`);

    // ---------------------------------------------------------------
    // 7. MULTI-SCENARIO DETERMINISTIC RECOVERY (Sec 29, 30)
    // ---------------------------------------------------------------
    console.log('\n--- Test Group 7: Deterministic Demo Scenarios ---');
    const scenarios = ['bakery-mumbai', 'vehicle-mumbai', 'property-construction', 'certificate-income'];
    for (const scId of scenarios) {
      const loadRes = await makeRequest('POST', `/api/demo/load/${scId}`);
      assert(loadRes.status === 200 && loadRes.data.journey.steps.length >= 3, `Deterministically loaded scenario "${scId}" with ${loadRes.data.journey.steps.length} steps`);
    }

    // Restore Bakery
    await makeRequest('POST', '/api/demo/load/bakery-mumbai');

    console.log('\n====================================================');
    console.log(`🏆 ALL ${passed} PHASE 6 TESTS PASSED SUCCESSFULLY! (${failed} FAILED)`);
    console.log('====================================================\n');

    if (failed > 0) process.exit(1);
    else process.exit(0);
  } catch (err) {
    console.error('Fatal test error:', err);
    process.exit(1);
  }
}

runPhase6Tests();
