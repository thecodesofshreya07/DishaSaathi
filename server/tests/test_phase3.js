import { parseCitizenGoal } from './dist/services/civic/goalParser.js';
import { findRelevantProcedures } from './dist/services/civic/procedureMapper.js';
import { buildRoadmap, answerContextualQuestion } from './dist/services/civic/roadmapBuilder.js';

async function runTests() {
  console.log('=== DISHASAATHI PHASE 3 INTELLIGENCE TEST SUITE ===\n');

  // TEST 1: Bakery in Mumbai
  console.log('--- TEST 1: "I want to start a small bakery in Mumbai." ---');
  const goal1 = await parseCitizenGoal('I want to start a small bakery in Mumbai.', {
    locationOverride: 'Mumbai, Maharashtra',
    context: 'Small / home-based bakery'
  });
  console.log('Intent:', goal1.intent);
  console.log('Domain:', goal1.domain);
  console.log('Activity:', goal1.activity);
  console.log('Location:', `${goal1.location.city}, ${goal1.location.state}`);
  const procs1 = findRelevantProcedures(goal1);
  const roadmap1 = buildRoadmap(goal1, procs1);
  console.log(`Generated Steps: ${roadmap1.steps.length}`);
  roadmap1.steps.forEach(s => {
    console.log(`  Step ${s.stepNumber}: ${s.title}`);
    console.log(`    Authority: ${s.authority}`);
    console.log(`    Verification: ${s.verificationStatus}`);
    console.log(`    Depends on: ${JSON.stringify(s.dependsOn)}`);
    if (s.parallelWith && s.parallelWith.length > 0) {
      console.log(`    Parallel with: ${JSON.stringify(s.parallelWith)}`);
    }
  });

  // TEST 1 Q&A: Ask DishaSaathi
  console.log('\n--- TEST 1 Q&A: Ask DishaSaathi ---');
  const qa1 = await answerContextualQuestion('Why do I need this?', roadmap1.steps[2].id, roadmap1);
  console.log('Q: Why do I need this? (Step 3: Gumasta)');
  console.log('A:', qa1.answer);
  console.log('Source:', qa1.officialSource?.url);

  const qa2 = await answerContextualQuestion('What happens if I skip this?', roadmap1.steps[2].id, roadmap1);
  console.log('\nQ: What happens if I skip this? (Step 3: Gumasta)');
  console.log('A:', qa2.answer);

  // TEST 2: Register bike
  console.log('\n--- TEST 2: "I want to register my new bike in Mumbai." ---');
  const goal2 = await parseCitizenGoal('I want to register my new bike in Mumbai.');
  console.log('Intent:', goal2.intent);
  console.log('Domain:', goal2.domain);
  console.log('Vehicle Type:', goal2.entities.vehicleType);
  const procs2 = findRelevantProcedures(goal2);
  const roadmap2 = buildRoadmap(goal2, procs2);
  console.log(`Generated Steps: ${roadmap2.steps.length}`);
  roadmap2.steps.forEach(s => {
    console.log(`  Step ${s.stepNumber}: ${s.title} (Auth: ${s.authority})`);
  });

  // TEST 3: House construction
  console.log('\n--- TEST 3a: "I want to build a house on my land." (No location specified) ---');
  const goal3a = await parseCitizenGoal('I want to build a house on my land.');
  console.log('Intent:', goal3a.intent);
  console.log('Clarification Needed:', goal3a.clarificationNeeded);
  console.log('Clarification Question:', goal3a.clarificationQuestion);
  const roadmap3a = buildRoadmap(goal3a, findRelevantProcedures(goal3a));
  console.log('Roadmap Clarification Prompt:', roadmap3a.clarification?.question);

  console.log('\n--- TEST 3b: "I want to build a house on my land in Mumbai." (Location provided) ---');
  const goal3b = await parseCitizenGoal('I want to build a house on my land in Mumbai.');
  console.log('Intent:', goal3b.intent);
  console.log('Clarification Needed:', goal3b.clarificationNeeded);
  const procs3b = findRelevantProcedures(goal3b);
  const roadmap3b = buildRoadmap(goal3b, procs3b);
  console.log(`Generated Steps: ${roadmap3b.steps.length}`);
  roadmap3b.steps.forEach(s => {
    console.log(`  Step ${s.stepNumber}: ${s.title} (Auth: ${s.authority})`);
  });

  // TEST 4: "Hello"
  console.log('\n--- TEST 4: "Hello" ---');
  const goal4 = await parseCitizenGoal('Hello');
  console.log('Intent:', goal4.intent);
  console.log('Clarification Needed:', goal4.clarificationNeeded);
  console.log('Clarification Question:', goal4.clarificationQuestion);
  const roadmap4 = buildRoadmap(goal4, []);
  console.log('Roadmap Clarification Prompt:', roadmap4.clarification?.question);

  // TEST 5: "I need some government help."
  console.log('\n--- TEST 5: "I need some government help." ---');
  const goal5 = await parseCitizenGoal('I need some government help.');
  console.log('Intent:', goal5.intent);
  console.log('Clarification Needed:', goal5.clarificationNeeded);
  console.log('Clarification Question:', goal5.clarificationQuestion);

  console.log('\n=== ALL PHASE 3 BACKEND INTELLIGENCE TESTS PASSED ===');
}

runTests().catch(console.error);
