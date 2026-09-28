import { ProcedureStep } from '../types';
import { SpeechLanguage } from './textToSpeech';

/**
 * Extracts and formats the entire procedure step modal content into a natural spoken script
 * tailored for English, Hindi, or Marathi.
 * If the DOM has been translated by Google Translate or the browser, visible translated text is harvested.
 */
export function getStepModalSpokenText(
  step: ProcedureStep,
  lang: SpeechLanguage,
  containerEl?: HTMLElement | null
): string {
  // 1. Try to read visible rendered text from DOM (in case of dynamic Google Translate translation)
  let title = step.title.replace(/^\d+\.\s*/, '');
  let authority = step.authority || step.department || '';
  let summary = step.plainLanguageSummary || step.description || '';
  let why = step.whyRequired || '';
  let fee = step.fee?.amount || '';
  let time = step.processingTime || '';
  let mode: string = step.applicationMode || '';
  let docs: string[] = (step.documents || []).map((d) => d.name);
  let isBlocked = false;
  let isParallel = (step.parallelWith || []).length > 0;

  if (containerEl) {
    const elTitle = containerEl.querySelector('[data-speech-id="title"]');
    if (elTitle?.textContent?.trim()) {
      title = elTitle.textContent.trim().replace(/^\d+\.\s*/, '');
    }

    const elAuth = containerEl.querySelector('[data-speech-id="authority"]');
    if (elAuth?.textContent?.trim()) {
      authority = elAuth.textContent.trim();
    }

    const elSummary = containerEl.querySelector('[data-speech-id="summary"]');
    if (elSummary?.textContent?.trim()) {
      summary = elSummary.textContent.trim();
    }

    const elWhy = containerEl.querySelector('[data-speech-id="why"]');
    if (elWhy?.textContent?.trim()) {
      why = elWhy.textContent.trim();
    }

    const elFee = containerEl.querySelector('[data-speech-id="fee"]');
    if (elFee?.textContent?.trim()) {
      fee = elFee.textContent.trim();
    }

    const elTime = containerEl.querySelector('[data-speech-id="time"]');
    if (elTime?.textContent?.trim()) {
      time = elTime.textContent.trim();
    }

    const elMode = containerEl.querySelector('[data-speech-id="mode"]');
    if (elMode?.textContent?.trim()) {
      mode = elMode.textContent.trim();
    }

    const docEls = containerEl.querySelectorAll('[data-speech-id="doc-name"]');
    if (docEls.length > 0) {
      const extractedDocs: string[] = [];
      docEls.forEach((de) => {
        const text = de.textContent?.trim();
        if (text) extractedDocs.push(text);
      });
      if (extractedDocs.length > 0) docs = extractedDocs;
    }

    const elBlocked = containerEl.querySelector('[data-speech-id="blocked"]');
    if (elBlocked) isBlocked = true;

    const elParallel = containerEl.querySelector('[data-speech-id="parallel"]');
    if (elParallel) isParallel = true;
  }

  // 2. Format localized narrative based on target language
  if (lang === 'hi') {
    let script = `चरण ${step.stepNumber}: ${title}। `;
    if (authority) script += `प्राधिकरण: ${authority}। `;
    if (isBlocked) script += `कृपया ध्यान दें: यह चरण पिछले आवश्यक चरणों के पूरा होने तक रुका हुआ है। `;
    if (summary) script += `इसका विवरण: ${summary}। `;
    if (why) script += `यह क्यों आवश्यक है: ${why}। `;
    if (fee) script += `सरकारी शुल्क: ${fee}। `;
    if (time) script += `प्रसंस्करण समय: ${time}। `;
    if (mode) script += `आवेदन का माध्यम: ${mode}। `;
    if (docs.length > 0) script += `आवश्यक दस्तावेज़: ${docs.join(', ')}। `;
    if (isParallel) script += `सुविधा: आप इस प्रक्रिया को संबंधित अन्य चरणों के साथ भी शुरू कर सकते हैं। `;
    return script;
  }

  if (lang === 'mr') {
    let script = `टप्पा ${step.stepNumber}: ${title}। `;
    if (authority) script += `प्राधिकरण: ${authority}। `;
    if (isBlocked) script += `कृपया लक्ष द्या: मागील आवश्यक टप्पे पूर्ण होईपर्यंत हा टप्पा थांबवला आहे. `;
    if (summary) script += `याचा अर्थ काय: ${summary}। `;
    if (why) script += `हे का गरजेचे आहे: ${why}। `;
    if (fee) script += `शासकीय शुल्क: ${fee}। `;
    if (time) script += `प्रक्रिया कालावधी: ${time}। `;
    if (mode) script += `अर्जाचा प्रकार: ${mode}। `;
    if (docs.length > 0) script += `आवश्यक कागदपत्रे: ${docs.join(', ')}। `;
    if (isParallel) script += `सुलभता: ही प्रक्रिया इतर समांतर टप्प्यांसोबत एकाच वेळी सुरू करता येऊ शकते. `;
    return script;
  }

  // Default English
  let script = `Step ${step.stepNumber}: ${title}. `;
  if (authority) script += `Authority: ${authority}. `;
  if (isBlocked) script += `Notice: This step is currently blocked until earlier prerequisite steps are completed. `;
  if (summary) script += `What this means: ${summary}. `;
  if (why) script += `Why you need it: ${why}. `;
  if (fee) script += `Official fee: ${fee}. `;
  if (time) script += `Processing time: ${time}. `;
  if (mode) script += `Application mode: ${mode}. `;
  if (docs.length > 0) script += `Required documents: ${docs.join(', ')}. `;
  if (isParallel) script += `Parallel execution: This procedure can be processed simultaneously with parallel steps. `;
  return script;
}
