import React, { createContext, useContext, useState, useCallback } from 'react';

export type Language = 'en' | 'hi' | 'mr';

export interface LanguageStrings {
  navHowItWorks: string;
  navExampleGoals: string;
  navFeatures: string;
  navAbout: string;
  navViewRoadmap: string;
  navCreateRoadmap: string;

  heroBadge: string;
  heroHeadline1: string;
  heroHeadline2: string;
  heroSubtext: string;
  heroCTA: string;
  heroSeekHow: string;
  heroTrust1: string;
  heroTrust2: string;
  heroTrust3: string;

  pipelineGoal: string;
  pipelineGoalDesc: string;
  pipelineDocs: string;
  pipelineDocsDesc: string;
  pipelineApp: string;
  pipelineAppDesc: string;
  pipelineApproval: string;
  pipelineApprovalDesc: string;
  pipelineCompletion: string;
  pipelineCompletionDesc: string;
  pipelineTitle: string;
  pipelineSubtitle: string;
  pipelineExample: string;
  pipelineTestBtn: string;

  impactVisits: string;
  impactHours: string;
  impactProcedures: string;
  impactVerified: string;
  impactLabel: string;

  stepStatus: string;
  stepEstimatedTime: string;
  stepDocuments: string;
  stepFee: string;
  stepDependencies: string;
  stepAction: string;
}

const translations: Record<Language, LanguageStrings> = {
  en: {
    navHowItWorks: 'How It Works',
    navExampleGoals: 'Example Goals',
    navFeatures: 'Features',
    navAbout: 'About',
    navViewRoadmap: 'View Active Roadmap',
    navCreateRoadmap: 'Create My Roadmap',

    heroBadge: 'Civic Guidance Engine for Indian Municipal & State Services',
    heroHeadline1: 'Tell us what you want to do.',
    heroHeadline2: "We'll show you how to get there.",
    heroSubtext:
      'DishaSaathi turns complicated government procedures into a personalized, verified roadmap of actions, required documents, prerequisite dependencies and departmental approvals.',
    heroCTA: 'Create My Roadmap',
    heroSeekHow: 'See How It Works',
    heroTrust1: 'No legal or department jargon needed',
    heroTrust2: 'Ward-specific municipal rules',
    heroTrust3: 'Grounded in official .gov.in sources',

    pipelineGoal: 'Goal',
    pipelineGoalDesc: 'Natural language task intake',
    pipelineDocs: 'Documents',
    pipelineDocsDesc: 'Prerequisites & checklist verification',
    pipelineApp: 'Application',
    pipelineAppDesc: 'Official single-window portal filings',
    pipelineApproval: 'Approval',
    pipelineApprovalDesc: 'Municipal NOC & departmental sign-off',
    pipelineCompletion: 'Completion',
    pipelineCompletionDesc: 'Lawful license & active compliance',
    pipelineTitle: 'Interactive Civic Pipeline',
    pipelineSubtitle: 'How fragmented bureaucracy becomes a structured journey',
    pipelineExample: '"I want to start a small bakery in Mumbai" automatically resolves 6 sequential dependencies.',
    pipelineTestBtn: 'Test your own goal',

    impactVisits: 'in-person visits saved',
    impactHours: 'hours saved per citizen',
    impactProcedures: 'civic procedures in knowledge base',
    impactVerified: 'officially source-verified',
    impactLabel: 'What DishaSaathi saves citizens',

    stepStatus: 'Status',
    stepEstimatedTime: 'Estimated Time',
    stepDocuments: 'Required Documents',
    stepFee: 'Fee',
    stepDependencies: 'Dependencies',
    stepAction: 'Start this step',
  },

  hi: {
    navHowItWorks: 'यह कैसे काम करता है',
    navExampleGoals: 'उदाहरण लक्ष्य',
    navFeatures: 'विशेषताएं',
    navAbout: 'के बारे में',
    navViewRoadmap: 'सक्रिय रोडमैप देखें',
    navCreateRoadmap: 'मेरा रोडमैप बनाएं',

    heroBadge: 'भारतीय नगर पालिका और राज्य सेवाओं के लिए नागरिक मार्गदर्शन इंजन',
    heroHeadline1: 'हमें बताएं आप क्या करना चाहते हैं।',
    heroHeadline2: 'हम आपको रास्ता दिखाएंगे।',
    heroSubtext:
      'DishaSaathi जटिल सरकारी प्रक्रियाओं को आपके व्यक्तिगत, सत्यापित रोडमैप में बदलता है — आवश्यक दस्तावेज़, निर्भरताएं और विभागीय अनुमोदन सहित।',
    heroCTA: 'मेरा रोडमैप बनाएं',
    heroSeekHow: 'देखें यह कैसे काम करता है',
    heroTrust1: 'कोई कानूनी या विभागीय शब्दजाल की जरूरत नहीं',
    heroTrust2: 'वार्ड-विशिष्ट नगर पालिका नियम',
    heroTrust3: 'आधिकारिक .gov.in स्रोतों पर आधारित',

    pipelineGoal: 'लक्ष्य',
    pipelineGoalDesc: 'सरल भाषा में कार्य सेवन',
    pipelineDocs: 'दस्तावेज़',
    pipelineDocsDesc: 'पूर्वापेक्षाएं और जांच सूची',
    pipelineApp: 'आवेदन',
    pipelineAppDesc: 'एकल खिड़की पोर्टल',
    pipelineApproval: 'स्वीकृति',
    pipelineApprovalDesc: 'NOC और विभागीय हस्ताक्षर',
    pipelineCompletion: 'पूर्णता',
    pipelineCompletionDesc: 'वैध लाइसेंस और अनुपालन',
    pipelineTitle: 'इंटरएक्टिव नागरिक पाइपलाइन',
    pipelineSubtitle: 'जटिल नौकरशाही एक संरचित यात्रा बन जाती है',
    pipelineExample: '"मैं मुंबई में छोटी बेकरी शुरू करना चाहता हूं" 6 क्रमिक निर्भरताएं स्वचालित रूप से हल करता है।',
    pipelineTestBtn: 'अपना लक्ष्य आज़माएं',

    impactVisits: 'प्रत्यक्ष विज़िट बचाए',
    impactHours: 'प्रति नागरिक घंटे बचाए',
    impactProcedures: 'ज्ञान आधार में प्रक्रियाएं',
    impactVerified: 'आधिकारिक रूप से सत्यापित',
    impactLabel: 'DishaSaathi नागरिकों की क्या बचत करता है',

    stepStatus: 'स्थिति',
    stepEstimatedTime: 'अनुमानित समय',
    stepDocuments: 'आवश्यक दस्तावेज़',
    stepFee: 'शुल्क',
    stepDependencies: 'निर्भरताएं',
    stepAction: 'यह चरण शुरू करें',
  },

  mr: {
    navHowItWorks: 'हे कसे कार्य करते',
    navExampleGoals: 'उदाहरण उद्दिष्टे',
    navFeatures: 'वैशिष्ट्ये',
    navAbout: 'बद्दल',
    navViewRoadmap: 'सक्रिय रोडमॅप पहा',
    navCreateRoadmap: 'माझा रोडमॅप तयार करा',

    heroBadge: 'भारतीय महानगरपालिका आणि राज्य सेवांसाठी नागरी मार्गदर्शन इंजिन',
    heroHeadline1: 'तुम्हाला काय करायचे आहे ते सांगा.',
    heroHeadline2: 'आम्ही तुम्हाला मार्ग दाखवू.',
    heroSubtext:
      'DishaSaathi क्लिष्ट सरकारी प्रक्रियांना तुमच्या वैयक्तिक, सत्यापित रोडमॅपमध्ये रूपांतरित करतो — आवश्यक कागदपत्रे, अवलंबित्व आणि विभागीय मंजुरी सह.',
    heroCTA: 'माझा रोडमॅप तयार करा',
    heroSeekHow: 'हे कसे कार्य करते ते पहा',
    heroTrust1: 'कोणत्याही कायदेशीर किंवा विभागीय शब्दजालाची गरज नाही',
    heroTrust2: 'प्रभाग-विशिष्ट महानगरपालिका नियम',
    heroTrust3: 'अधिकृत .gov.in स्त्रोतांवर आधारित',

    pipelineGoal: 'उद्दिष्ट',
    pipelineGoalDesc: 'सहज भाषेत कार्य',
    pipelineDocs: 'कागदपत्रे',
    pipelineDocsDesc: 'पूर्वावश्यकता आणि तपासणी यादी',
    pipelineApp: 'अर्ज',
    pipelineAppDesc: 'एकल खिडकी पोर्टल',
    pipelineApproval: 'मंजुरी',
    pipelineApprovalDesc: 'NOC आणि विभागीय सही',
    pipelineCompletion: 'पूर्णता',
    pipelineCompletionDesc: 'कायदेशीर परवाना आणि अनुपालन',
    pipelineTitle: 'परस्परसंवादी नागरी पाइपलाइन',
    pipelineSubtitle: 'विखुरलेली नोकरशाही एक संरचित प्रवास बनते',
    pipelineExample: '"मला मुंबईत छोटी बेकरी सुरू करायची आहे" आपोआप 6 अनुक्रमिक अवलंबित्वे सोडवतो.',
    pipelineTestBtn: 'तुमचे उद्दिष्ट वापरून पहा',

    impactVisits: 'प्रत्यक्ष भेटी वाचवल्या',
    impactHours: 'प्रति नागरिक तास वाचवले',
    impactProcedures: 'ज्ञानकोशातील प्रक्रिया',
    impactVerified: 'अधिकृतपणे सत्यापित',
    impactLabel: 'DishaSaathi नागरिकांची काय बचत करतो',

    stepStatus: 'स्थिती',
    stepEstimatedTime: 'अंदाजित वेळ',
    stepDocuments: 'आवश्यक कागदपत्रे',
    stepFee: 'शुल्क',
    stepDependencies: 'अवलंबित्वे',
    stepAction: 'हे पाऊल सुरू करा',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: LanguageStrings;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: translations.en,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    document.documentElement.lang = lang;
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
