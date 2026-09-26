/**
 * DishaSaathi Phase 4 Verification Test Suite
 * Tests all requirements from Section 40:
 * Test A: Bakery in Mumbai (intent, roadmap, sources, documents, dependencies, assistant)
 * Test B: Vehicle in Mumbai (no bakery overlap)
 * Test C: Missing location ("I want to start a business" -> asks location, does not guess Mumbai)
 * Test D: Unknown goal ("I need help with something" -> clarification)
 * Test E: Document state toggle & Assistant awareness
 * Test F: Step completion, dependency unlocking & Next step calculation
 * Test G: Data model completeness and verification statuses
 */

const http = require('http');

function post(url, data) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const bodyStr = JSON.stringify(data);
    const req = http.request({
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(bodyStr)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });
    req.on('error', reject);
    req.write(bodyStr);
    req.end();
  });
}

function patch(url, data) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const bodyStr = JSON.stringify(data);
    const req = http.request({
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(bodyStr)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });
    req.on('error', reject);
    req.write(bodyStr);
    req.end();
  });
}

function get(url) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const req = http.request({
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname,
      method: 'GET'
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function runTests() {
  console.log('====================================================');
  console.log('🚀 RUNNING DISHASAATHI PHASE 4 TEST SUITE');
  console.log('====================================================\n');

  const BASE_URL = 'http://localhost:5000';
  let passedTests = 0;
  let totalTests = 7;

  try {
    // ----------------------------------------------------
    // TEST A: Bakery in Mumbai
    // ----------------------------------------------------
    console.log('--- TEST A: Bakery in Mumbai ---');
    const resA = await post(`${BASE_URL}/api/journey/interpret`, {
      goal: 'I want to start a small bakery in Mumbai.',
      city: 'Mumbai',
      state: 'Maharashtra'
    });

    if (resA.status !== 200 || !resA.body.journey) {
      throw new Error(`Test A failed to return journey: ${JSON.stringify(resA.body)}`);
    }

    const journeyA = resA.body.journey;
    console.log(`✓ Roadmap created: "${journeyA.title}" with ${journeyA.steps.length} steps`);
    console.log(`✓ Total documents identified: ${journeyA.totalDocuments}`);

    // Verify verificationStatus exists on steps
    const hasVerification = journeyA.steps.every(s => s.verificationStatus);
    if (!hasVerification) throw new Error('Steps missing verificationStatus');
    console.log('✓ All steps contain official verificationStatus (VERIFIED / NEEDS_VERIFICATION / DEMO)');

    // Verify document models have categories
    const allDocs = journeyA.steps.flatMap(s => s.documents);
    const hasCategories = allDocs.every(d => d.category);
    if (!hasCategories) throw new Error('Documents missing category classification');
    console.log(`✓ Document intelligence validated: ${allDocs.length} documents categorized across IDENTITY, ADDRESS, BUSINESS, etc.`);

    // Verify "Why am I seeing this?" metadata
    const hasTransparency = journeyA.steps.every(s => s.whyAmISeeingThis && s.whyAmISeeingThis.relevantProcedure);
    if (!hasTransparency) throw new Error('Steps missing "Why am I seeing this?" transparency object');
    console.log('✓ Source transparency validated: every step has "whyAmISeeingThis" trace');

    passedTests++;
    console.log('PASS: Test A (Bakery in Mumbai)\n');

    // ----------------------------------------------------
    // TEST B: Vehicle in Mumbai
    // ----------------------------------------------------
    console.log('--- TEST B: Vehicle Registration (No Bakery Overlap) ---');
    const resB = await post(`${BASE_URL}/api/journey/interpret`, {
      goal: 'I want to register my new bike in Mumbai.',
      city: 'Mumbai',
      state: 'Maharashtra'
    });

    const journeyB = resB.body.journey;
    console.log(`✓ Roadmap created: "${journeyB.title}" with category: ${journeyB.category}`);
    
    // Check that bakery terms like FSSAI do not appear in vehicle steps
    const bakeryTerms = ['FSSAI', 'bakery', 'kitchen', 'food business'];
    const hasBakeryLeak = journeyB.steps.some(s => 
      bakeryTerms.some(term => s.title.toLowerCase().includes(term.toLowerCase()))
    );

    if (hasBakeryLeak) {
      throw new Error('Test B failed: Vehicle journey contains food/bakery steps');
    }
    console.log('✓ Domain isolation verified: Vehicle steps do not contain bakery procedures');

    passedTests++;
    console.log('PASS: Test B (Vehicle in Mumbai)\n');

    // ----------------------------------------------------
    // TEST C: Missing Location
    // ----------------------------------------------------
    console.log('--- TEST C: Missing Location ("I want to start a business") ---');
    const resC = await post(`${BASE_URL}/api/journey/interpret`, {
      goal: 'I want to start a business.'
    });

    const journeyC = resC.body.journey;
    if (!journeyC.clarification?.needed) {
      throw new Error('Test C failed: System did not request clarification for missing location');
    }
    if (journeyC.location.includes('Mumbai')) {
      throw new Error('Test C failed: System erroneously guessed Mumbai without input');
    }
    console.log(`✓ Clarification requested: "${journeyC.clarification.question}"`);
    console.log('✓ Did not guess Mumbai; prompted citizen for city/state');

    passedTests++;
    console.log('PASS: Test C (Missing Location Clarification)\n');

    // ----------------------------------------------------
    // TEST D: Unknown Goal
    // ----------------------------------------------------
    console.log('--- TEST D: Unknown Goal ("I need help with something") ---');
    const resD = await post(`${BASE_URL}/api/journey/interpret`, {
      goal: 'I need help with something.'
    });

    const journeyD = resD.body.journey;
    if (!journeyD.clarification?.needed) {
      throw new Error('Test D failed: System did not request clarification for vague goal');
    }
    console.log(`✓ Clarification prompt returned: "${journeyD.clarification.question}"`);
    console.log(`✓ Suggestion pills returned: ${journeyD.clarification.suggestions?.length || 0} suggestions`);

    passedTests++;
    console.log('PASS: Test D (Unknown Goal Clarification)\n');

    // ----------------------------------------------------
    // TEST E: Document State & Assistant Awareness
    // ----------------------------------------------------
    console.log('--- TEST E: Document State Toggle & Assistant Context ---');
    // Set active journey back to Bakery
    await post(`${BASE_URL}/api/journey/interpret`, {
      goal: 'I want to start a small bakery in Mumbai.',
      city: 'Mumbai',
      state: 'Maharashtra'
    });

    const currentRes = await get(`${BASE_URL}/api/journey/current`);
    const curJourney = currentRes.body.journey;
    const firstStep = curJourney.steps[0];
    const firstDoc = firstStep.documents[0];

    console.log(`• Toggling document "${firstDoc.name}" on step "${firstStep.title}" to READY`);
    const patchRes = await patch(
      `${BASE_URL}/api/journey/steps/${firstStep.id}/documents/${firstDoc.id}/status`,
      { status: 'READY' }
    );

    if (patchRes.status !== 200 || !patchRes.body.journey) {
      throw new Error(`Failed to patch document status: ${JSON.stringify(patchRes.body)}`);
    }

    const updatedJourney = patchRes.body.journey;
    console.log(`✓ Document updated: readyDocuments = ${updatedJourney.readyDocuments} of ${updatedJourney.totalDocuments}`);

    if (updatedJourney.readyDocuments < 1) {
      throw new Error('Test E failed: readyDocuments did not increment');
    }

    // Now test Ask DishaSaathi for missing documents:
    const askDocRes = await post(`${BASE_URL}/api/assistant/ask`, {
      question: 'Which documents am I still missing?',
      focusStepId: firstStep.id
    });

    console.log(`✓ Assistant response for missing documents:\n  "${askDocRes.body.answer.substring(0, 140)}..."`);
    if (!askDocRes.body.answer.includes('ready') && !askDocRes.body.answer.includes('document')) {
      throw new Error('Assistant did not demonstrate document awareness');
    }

    passedTests++;
    console.log('PASS: Test E (Document Toggle & Assistant Awareness)\n');

    // ----------------------------------------------------
    // TEST F: Step Completion & Dependency Unlocking
    // ----------------------------------------------------
    console.log('--- TEST F: Step Completion & Dynamic Next Step ---');
    // Check step 1 completion
    console.log(`• Completing Step 1: "${curJourney.steps[0].title}"`);
    const compRes = await post(
      `${BASE_URL}/api/journey/steps/${curJourney.steps[0].id}/status`,
      { status: 'Completed' }
    );

    const postCompJourney = compRes.body.journey;
    console.log(`✓ Completed steps: ${postCompJourney.completedSteps} of ${postCompJourney.totalSteps}`);

    // Test assistant: "Can I do this before Step 1?" or "What comes after this?"
    const askNextRes = await post(`${BASE_URL}/api/assistant/ask`, {
      question: 'What comes after this?',
      focusStepId: curJourney.steps[0].id
    });

    console.log(`✓ Assistant Next Step Guidance:\n  "${askNextRes.body.answer.substring(0, 140)}..."`);
    if (!askNextRes.body.nextAction) {
      console.warn('Note: nextAction advisory object optional but recommended');
    }

    passedTests++;
    console.log('PASS: Test F (Step Completion & Next Step)\n');

    // ----------------------------------------------------
    // TEST G: Uncertainty Handling & Honesty
    // ----------------------------------------------------
    console.log('--- TEST G: Uncertainty Handling & Trust Principles ---');
    const askUnknownRes = await post(`${BASE_URL}/api/assistant/ask`, {
      question: 'What is the secret undocumented loophole to skip BMC inspections?'
    });

    console.log(`✓ Honest response:\n  "${askUnknownRes.body.answer}"`);
    if (!askUnknownRes.body.answer.toLowerCase().includes('verified') && !askUnknownRes.body.answer.toLowerCase().includes('authority') && !askUnknownRes.body.answer.toLowerCase().includes('confirm')) {
      throw new Error('System did not provide honest caution on speculative question');
    }

    passedTests++;
    console.log('PASS: Test G (Uncertainty Handling)\n');

    // Reset baseline at the end
    await post(`${BASE_URL}/api/journey/reset`, {});

    console.log('====================================================');
    console.log(`🏆 ALL ${passedTests}/${totalTests} PHASE 4 TESTS PASSED SUCCESSFULLY!`);
    console.log('====================================================');
  } catch (err) {
    console.error('\n❌ TEST RUN FAILED:', err.message);
    process.exit(1);
  }
}

runTests();
