import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

export type Language = 'en' | 'hi' | 'mr';

export interface LanguageStrings {
  // Navigation & Brand
  brandName: string;
  brandTagline: string;
  navHowItWorks: string;
  navFeatures: string;
  navAbout: string;
  navViewRoadmap: string;
  navCreateRoadmap: string;
  adminReview: string;
  searchPlaceholder: string;
  searchAction: string;

  // Sidebar Items
  sidebarHome: string;
  sidebarJourneys: string;
  sidebarServices: string;
  sidebarUpdates: string;
  sidebarDocuments: string;
  sidebarDeadlines: string;
  sidebarSaved: string;
  sidebarPassport: string;
  sidebarSettings: string;
  sidebarQuoteTitle: string;
  sidebarQuoteDesc: string;

  // Hero Section & Maze Banner
  heroWelcomeBack: string;
  heroMazeTitle1: string;
  heroMazeTitle2: string;
  heroMazeSubtitle: string;
  heroInputPlaceholder: string;
  heroPopularSearches: string;
  heroTaglinePossibilities: string;
  heroPopBusiness: string;
  heroPopBirth: string;
  heroPopProperty: string;
  heroPopWater: string;
  heroPopTrade: string;

  heroBadge: string;
  heroHeadline1: string;
  heroHeadline2: string;
  heroSubtext: string;
  heroCTA: string;
  heroSeekHow: string;
  heroTrust1: string;
  heroTrust2: string;
  heroTrust3: string;
  heroTrust4: string;

  // Flowchart
  flowchartTitle: string;
  flowchartBadge: string;
  flowchartDesc: string;
  flowchartCompleted: string;
  flowchartCurrent: string;
  flowchartUpcoming: string;
  flowchartBlocked: string;

  // Pipeline
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
  pipelineTestBtn: string;

  // Impact Numbers
  impactVisits: string;
  impactVisitsDesc: string;
  impactHours: string;
  impactHoursDesc: string;
  impactProcedures: string;
  impactProceduresDesc: string;
  impactVerified: string;
  impactVerifiedDesc: string;
  impactLabel: string;

  // Roadmap & Step Details
  yourNextStep: string;
  whyThisMatters: string;
  viewRequirements: string;
  stepStatus: string;
  stepEstimatedTime: string;
  stepDocuments: string;
  stepFee: string;
  stepDependencies: string;
  stepAction: string;
  stepCompleted: string;
  stepCurrent: string;
  stepBlocked: string;
  stepUpcoming: string;
  stepVerified: string;
  whatThisMeans: string;
  whyYouNeedIt: string;
  authority: string;
  processingTime: string;
  applicationMode: string;

  // Filters
  filterAll: string;
  filterToDo: string;
  filterCompleted: string;
  filterBlocked: string;
  filterDocuments: string;
  showingSteps: string;

  // Document Checklist & Actions
  docsReady: string;
  applyForDoc: string;
  haveDoc: string;
  markCompleted: string;
  markSubmitted: string;
  reopenStep: string;
  closeCard: string;
  askDishaSaathi: string;
  whyAmISeeingThis: string;
  openOfficialPortal: string;
  viewOfficialSource: string;
  viewSourceExcerpt: string;
  sourceEvidenceTitle: string;
  sourceEvidenceSubtitle: string;
  stepsProgress: string;
  documentReadiness: string;
  backToHome: string;
  resetRoadmap: string;
}

const translations: Record<Language, LanguageStrings> = {
  en: {
    brandName: 'DishaSaathi',
    brandTagline: 'Your GPS for Government Services',
    navHowItWorks: 'How It Works',
    navFeatures: 'Features',
    navAbout: 'About',
    navViewRoadmap: 'View Active Roadmap',
    navCreateRoadmap: 'Create My Roadmap',
    adminReview: 'Admin Review',
    searchPlaceholder: 'What are you trying to do? (e.g. "I want to start a small business")',
    searchAction: 'Search',

    sidebarHome: 'Home',
    sidebarJourneys: 'My Journeys',
    sidebarServices: 'Explore Services',
    sidebarUpdates: 'Government Updates',
    sidebarDocuments: 'Documents',
    sidebarDeadlines: 'Deadlines',
    sidebarSaved: 'Saved',
    sidebarPassport: 'Civic Passport',
    sidebarSettings: 'Settings',
    sidebarQuoteTitle: 'Less confusion. More action.',
    sidebarQuoteDesc: 'DishaSaathi simplifies government processes with verified information, clear steps and real-time updates.',

    heroWelcomeBack: 'WELCOME BACK',
    heroMazeTitle1: 'Government processes',
    heroMazeTitle2: "shouldn't feel like a maze.",
    heroMazeSubtitle: "Tell us what you're trying to do. DishaSaathi turns fragmented government information into one clear, verified roadmap.",
    heroInputPlaceholder: 'What are you trying to accomplish?',
    heroPopularSearches: 'Popular searches:',
    heroTaglinePossibilities: 'Simpler Steps. Greater Possibilities.',
    heroPopBusiness: 'Register a small business',
    heroPopBirth: 'Birth Certificate',
    heroPopProperty: 'Property Title Registration',
    heroPopWater: 'New Water Connection',
    heroPopTrade: 'Municipal Trade License',

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
    heroTrust4: 'Free · No signup required',

    flowchartTitle: 'Civic Procedure Flowchart',
    flowchartBadge: 'Linear & Parallel Dependencies',
    flowchartDesc: 'Interactive visual flowchart. Click any small step node to inspect statutory obligations.',
    flowchartCompleted: 'Completed',
    flowchartCurrent: 'Current',
    flowchartUpcoming: 'Upcoming',
    flowchartBlocked: 'Blocked',

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
    pipelineTestBtn: 'Test your own goal',

    impactVisits: 'Visits Saved',
    impactVisitsDesc: 'Avoided redundant trips to municipal ward offices & government counters',
    impactHours: 'Hours Saved',
    impactHoursDesc: 'Estimated citizen time saved navigating confusing queues and paperwork',
    impactProcedures: 'Procedures Mapped',
    impactProceduresDesc: 'Government services mapped across municipal, state & central ministries',
    impactVerified: 'Verified Sources',
    impactVerifiedDesc: '100% verified against active gazettes, statutory acts and official .gov.in portals',
    impactLabel: 'What DishaSaathi saves citizens',

    yourNextStep: 'YOUR NEXT STEP',
    whyThisMatters: 'Why this matters:',
    viewRequirements: 'View Requirements',
    stepStatus: 'Status',
    stepEstimatedTime: 'Estimated Time',
    stepDocuments: 'Required Documents',
    stepFee: 'Fee',
    stepDependencies: 'Dependencies',
    stepAction: 'Start this step',
    stepCompleted: 'COMPLETED',
    stepCurrent: 'CURRENT',
    stepBlocked: 'BLOCKED',
    stepUpcoming: 'UPCOMING',
    stepVerified: 'Verified source',
    whatThisMeans: 'What this means:',
    whyYouNeedIt: 'Why you need it:',
    authority: 'Authority:',
    processingTime: 'Processing Time:',
    applicationMode: 'Application Mode:',

    filterAll: 'All',
    filterToDo: 'To Do',
    filterCompleted: 'Completed',
    filterBlocked: 'Blocked',
    filterDocuments: 'Documents',
    showingSteps: 'Showing',

    docsReady: 'ready',
    applyForDoc: 'Apply for this document ↗',
    haveDoc: 'I have this document',
    markCompleted: 'Mark as Completed',
    markSubmitted: 'Mark as Submitted',
    reopenStep: 'Reopen Step',
    closeCard: 'Close Card',
    askDishaSaathi: 'Ask DishaSaathi',
    whyAmISeeingThis: 'Why am I seeing this?',
    openOfficialPortal: 'Open Official Portal ↗',
    viewOfficialSource: 'View Official Source ↗',
    viewSourceExcerpt: 'View Gazette Excerpt (AI) 📄',
    sourceEvidenceTitle: 'Official Sources & Grounding Evidence',
    sourceEvidenceSubtitle: 'Verified government portals, municipal bodies, and gazetted authorities',
    stepsProgress: 'Steps Progress',
    documentReadiness: 'Document Readiness',
    backToHome: 'Back to Home',
    resetRoadmap: 'Reset Journey',
  },

  hi: {
    brandName: 'DishaSaathi',
    brandTagline: 'सरकारी सेवाओं के लिए आपका जीपीएस',
    navHowItWorks: 'यह कैसे काम करता है',
    navFeatures: 'विशेषताएं',
    navAbout: 'के बारे में',
    navViewRoadmap: 'सक्रिय रोडमैप देखें',
    navCreateRoadmap: 'मेरा रोडमैप बनाएं',
    adminReview: 'प्रशासक समीक्षा',
    searchPlaceholder: 'आप क्या करना चाहते हैं? (उदा. "मुझे छोटा व्यवसाय शुरू करना है")',
    searchAction: 'खोजें',

    sidebarHome: 'होम',
    sidebarJourneys: 'मेरी यात्राएं',
    sidebarServices: 'सेवाएं खोजें',
    sidebarUpdates: 'सरकारी अपडेट',
    sidebarDocuments: 'दस्तावेज़',
    sidebarDeadlines: 'समय सीमा',
    sidebarSaved: 'सहेजा गया',
    sidebarPassport: 'नागरिक पासपोर्ट',
    sidebarSettings: 'सेटिंग्स',
    sidebarQuoteTitle: 'कम उलझन। अधिक कार्रवाई।',
    sidebarQuoteDesc: 'दिशासाथी सत्यापित जानकारी, स्पष्ट चरणों और वास्तविक समय के अपडेट के साथ सरकारी प्रक्रियाओं को सरल बनाता है।',

    heroWelcomeBack: 'वापसी पर स्वागत है',
    heroMazeTitle1: 'सरकारी प्रक्रियाएं',
    heroMazeTitle2: 'भूलभुलैया जैसी नहीं होनी चाहिए।',
    heroMazeSubtitle: 'हमें बताएं कि आप क्या करने का प्रयास कर रहे हैं। दिशासाथी खंडित सरकारी जानकारी को एक स्पष्ट, सत्यापित रोडमैप में बदलता है।',
    heroInputPlaceholder: 'आप क्या करना चाहते हैं?',
    heroPopularSearches: 'लोकप्रिय खोजें:',
    heroTaglinePossibilities: 'सरल कदम। असीम संभावनाएं।',
    heroPopBusiness: 'छोटा व्यवसाय पंजीकृत करें',
    heroPopBirth: 'जन्म प्रमाण पत्र',
    heroPopProperty: 'संपत्ति शीर्षक पंजीकरण',
    heroPopWater: 'नया पानी कनेक्शन',
    heroPopTrade: 'नगर निगम व्यापार लाइसेंस',

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
    heroTrust4: 'निःशुल्क · साइनअप की आवश्यकता नहीं',

    flowchartTitle: 'नागरिक प्रक्रिया फ्लोचार्ट',
    flowchartBadge: 'रैखिक और समानांतर निर्भरताएं',
    flowchartDesc: 'संवादात्मक दृश्य फ्लोचार्ट। वैधानिक दायित्वों की जांच करने के लिए किसी भी छोटे चरण नोड पर क्लिक करें।',
    flowchartCompleted: 'पूर्ण',
    flowchartCurrent: 'वर्तमान',
    flowchartUpcoming: 'आगामी',
    flowchartBlocked: 'अवरुद्ध',

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
    pipelineTestBtn: 'अपना लक्ष्य आज़माएं',

    impactVisits: 'विज़िट बचाए',
    impactVisitsDesc: 'नगर निगम और सरकारी कार्यालयों के अनावश्यक चक्करों से मुक्ति',
    impactHours: 'घंटे बचाए',
    impactHoursDesc: 'नागरिकों का लंबी कतारों और कागजी कार्रवाई में बर्बाद होने वाला समय बचाया',
    impactProcedures: 'प्रक्रियाएं मैप की गईं',
    impactProceduresDesc: 'नगर पालिका, राज्य और केंद्रीय मंत्रालयों में मैप की गई सेवाएं',
    impactVerified: 'सत्यापित स्रोत',
    impactVerifiedDesc: '100% आधिकारिक राजपत्रों, अधिनियमों और .gov.in पोर्टल्स से सत्यापित',
    impactLabel: 'दिशासाथी नागरिकों की क्या बचत करता है',

    yourNextStep: 'आपका अगला कदम',
    whyThisMatters: 'यह क्यों मायने रखता है:',
    viewRequirements: 'आवश्यकताएं देखें',
    stepStatus: 'स्थिति',
    stepEstimatedTime: 'अनुमानित समय',
    stepDocuments: 'आवश्यक दस्तावेज़',
    stepFee: 'शुल्क',
    stepDependencies: 'निर्भरताएं',
    stepAction: 'यह चरण शुरू करें',
    stepCompleted: 'पूर्ण',
    stepCurrent: 'वर्तमान',
    stepBlocked: 'अवरुद्ध',
    stepUpcoming: 'आगामी',
    stepVerified: 'सत्यापित स्रोत',
    whatThisMeans: 'इसका क्या अर्थ है:',
    whyYouNeedIt: 'आपको इसकी आवश्यकता क्यों है:',
    authority: 'प्राधिकरण:',
    processingTime: 'प्रसंस्करण समय:',
    applicationMode: 'आवेदन मोड:',

    filterAll: 'सभी',
    filterToDo: 'करने योग्य',
    filterCompleted: 'पूर्ण',
    filterBlocked: 'अवरुद्ध',
    filterDocuments: 'दस्तावेज़',
    showingSteps: 'दिखा रहा है',

    docsReady: 'तैयार',
    applyForDoc: 'इस दस्तावेज़ के लिए आवेदन करें ↗',
    haveDoc: 'मेरे पास यह दस्तावेज़ है',
    markCompleted: 'पूर्ण के रूप में चिह्नित करें',
    markSubmitted: 'सबमिट किया गया चिह्नित करें',
    reopenStep: 'चरण पुनः खोलें',
    closeCard: 'कार्ड बंद करें',
    askDishaSaathi: 'दिशासाथी से पूछें',
    whyAmISeeingThis: 'मुझे यह क्यों दिखाई दे रहा है?',
    openOfficialPortal: 'आधिकारिक पोर्टल खोलें ↗',
    viewOfficialSource: 'आधिकारिक स्रोत देखें ↗',
    viewSourceExcerpt: 'राजपत्र उद्धरण देखें (AI) 📄',
    sourceEvidenceTitle: 'आधिकारिक स्रोत और साक्ष्य',
    sourceEvidenceSubtitle: 'सत्यापित सरकारी पोर्टल, नगरपालिका निकाय और राजपत्रित प्राधिकरण',
    stepsProgress: 'प्रक्रिया प्रगति',
    documentReadiness: 'दस्तावेज़ तैयारी',
    backToHome: 'होम पर वापस',
    resetRoadmap: 'रोडमॅप रीसेट करें',
  },

  mr: {
    brandName: 'DishaSaathi',
    brandTagline: 'सरकारी सेवांसाठी आपला जीपीएस',
    navHowItWorks: 'हे कसे कार्य करते',
    navFeatures: 'वैशिष्ट्ये',
    navAbout: 'माहिती',
    navViewRoadmap: 'सक्रिय रोडमॅप पहा',
    navCreateRoadmap: 'माझा रोडमॅप तयार करा',
    adminReview: 'प्रशासक पुनरावलोकन',
    searchPlaceholder: 'तुम्हाला काय करायचे आहे? (उदा. "मला छोटा व्यवसाय सुरू करायचा आहे")',
    searchAction: 'शोधा',

    sidebarHome: 'होम',
    sidebarJourneys: 'माझे मार्ग',
    sidebarServices: 'सेवा शोधा',
    sidebarUpdates: 'सरकारी अद्यतने',
    sidebarDocuments: 'कागदपत्रे',
    sidebarDeadlines: 'मुदत / कॅलेंडर',
    sidebarSaved: 'जतन केलेले',
    sidebarPassport: 'नागरी पारपत्र',
    sidebarSettings: 'सेटिंग्ज',
    sidebarQuoteTitle: 'कमी गोंधळ. अधिक कृती.',
    sidebarQuoteDesc: 'दिशासाथी पडताळलेली माहिती, स्पष्ट पावले आणि थेट अद्यतनांसह सरकारी प्रक्रिया सुलभ करते.',

    heroWelcomeBack: 'पुन्हा स्वागत आहे',
    heroMazeTitle1: 'सरकारी प्रक्रिया',
    heroMazeTitle2: 'चक्रव्यूहासारख्या वाटू नयेत.',
    heroMazeSubtitle: 'तुम्ही काय करू इच्छिता ते आम्हाला सांगा. दिशासाथी विखुरलेली सरकारी माहिती एका स्पष्ट, पडताळलेल्या मार्गामध्ये रूपांतरित करते.',
    heroInputPlaceholder: 'तुम्ही काय साध्य करू इच्छिता?',
    heroPopularSearches: 'लोकप्रिय शोध:',
    heroTaglinePossibilities: 'सोपी पावले. अधिक शक्यता.',
    heroPopBusiness: 'लहान व्यवसाय नोंदणी करा',
    heroPopBirth: 'जन्म प्रमाणपत्र',
    heroPopProperty: 'मालमत्ता शीर्षक नोंदणी',
    heroPopWater: 'नवीन पाणी जोडणी',
    heroPopTrade: 'महानगरपालिका व्यवसाय परवाना',

    heroBadge: 'महानगरपालिका आणि राज्य सेवांसाठी नागरी मार्गदर्शन इंजिन',
    heroHeadline1: 'तुम्हाला काय करायचे आहे ते सांगा.',
    heroHeadline2: 'आम्ही तुम्हाला अचूक मार्ग दाखवू.',
    heroSubtext:
      'DishaSaathi क्लिष्ट सरकारी प्रक्रियांचे रूपांतर आपल्या वैयक्तिक, पडताळलेल्या रोडमॅपमध्ये करते — आवश्यक कागदपत्रे, पूर्वअटी आणि मंजुऱ्यांसह.',
    heroCTA: 'माझा रोडमॅप तयार करा',
    heroSeekHow: 'हे कसे चालते ते पहा',
    heroTrust1: 'कोणत्याही कायदेशीर भाषेची गरज नाही',
    heroTrust2: 'वॉर्डनुसार स्थानिक पालिकेचे नियम',
    heroTrust3: 'अधिकृत .gov.in स्त्रोतांवर आधारित',
    heroTrust4: 'विनामूल्य · नोंदणीची सक्ती नाही',

    flowchartTitle: 'नागरी प्रक्रिया प्रवाह तक्ता',
    flowchartBadge: 'रेषीय आणि समांतर अवलंबित्व',
    flowchartDesc: 'परस्परसंवादी दृश्य फ्लोचार्ट. वैधानिक बंधने तपासण्यासाठी कोणत्याही छोट्या पायरीवर क्लिक करा.',
    flowchartCompleted: 'पूर्ण झाले',
    flowchartCurrent: 'सध्याचे',
    flowchartUpcoming: 'पुढील',
    flowchartBlocked: 'अडवलेले',

    pipelineGoal: 'उद्दिष्ट',
    pipelineGoalDesc: 'साध्या भाषेत कार्य स्वीकारणे',
    pipelineDocs: 'कागदपत्रे',
    pipelineDocsDesc: 'आवश्यक बाबींची पडताळणी',
    pipelineApp: 'अर्ज',
    pipelineAppDesc: 'अधिकृत पोर्टलवर नोंदणी',
    pipelineApproval: 'मंजुरी',
    pipelineApprovalDesc: 'पालिकेची एनओसी व मंजुरी',
    pipelineCompletion: 'यशस्वी पूर्णता',
    pipelineCompletionDesc: 'अधिकृत परवाना आणि अनुपालन',
    pipelineTitle: 'परस्परसंवादी नागरी प्रक्रिया',
    pipelineSubtitle: 'क्लिष्ट सरकारी कामे आता एका सोप्या प्रवासात',
    pipelineTestBtn: 'तुमचे उद्दिष्ट तपासा',

    impactVisits: 'वाचलेल्या फेऱ्या',
    impactVisitsDesc: 'महानगरपालिका आणि सरकारी कार्यालयांच्या नाहक फेऱ्या टळल्या',
    impactHours: 'वाचलेले तास',
    impactHoursDesc: 'नागरिकांचा रांगांमध्ये आणि कागदपत्रांमध्ये वाया जाणारा वेळ वाचवला',
    impactProcedures: 'प्रक्रिया मॅप केल्या',
    impactProceduresDesc: 'महानगरपालिका, राज्य आणि केंद्रीय मंत्रालयांमधील सेवा एकत्रित',
    impactVerified: 'सत्यापित स्त्रोत',
    impactVerifiedDesc: '100% अधिकृत राजपत्र, कायदे आणि .gov.in संकेतस्थळांवरून सत्यापित',
    impactLabel: 'DishaSaathi नागरिकांची काय बचत करतो',

    yourNextStep: 'तुमचे पुढील पाऊल',
    whyThisMatters: 'हे का महत्त्वाचे आहे:',
    viewRequirements: 'आवश्यक बाबी पहा',
    stepStatus: 'स्थिती',
    stepEstimatedTime: 'अंदाजित वेळ',
    stepDocuments: 'आवश्यक कागदपत्रे',
    stepFee: 'शुल्क',
    stepDependencies: 'अवलंबित्वे',
    stepAction: 'हे पाऊल सुरू करा',
    stepCompleted: 'पूर्ण झाले',
    stepCurrent: 'सध्याचे पाऊल',
    stepBlocked: 'अडचणीत / थांबलेले',
    stepUpcoming: 'पुढील',
    stepVerified: 'सत्यापित स्त्रोत',
    whatThisMeans: 'याचा नेमका अर्थ काय:',
    whyYouNeedIt: 'हे का गरजेचे आहे:',
    authority: 'प्राधिकरण:',
    processingTime: 'प्रक्रिया कालावधी:',
    applicationMode: 'अर्जाचा प्रकार:',

    filterAll: 'सर्व',
    filterToDo: 'करावयाचे',
    filterCompleted: 'पूर्ण',
    filterBlocked: 'अडचणीत',
    filterDocuments: 'कागदपत्रे',
    showingSteps: 'दाखवत आहे',

    docsReady: 'तयार',
    applyForDoc: 'या कागदपत्रासाठी अर्ज करा ↗',
    haveDoc: 'माझ्याकडे हे कागदपत्र आहे',
    markCompleted: 'पूर्ण झाले म्हणून चिन्हांकित करा',
    markSubmitted: 'अर्ज सबमिट केला',
    reopenStep: 'पुन्हा उघडा',
    closeCard: 'कार्ड बंद करा',
    askDishaSaathi: 'DishaSaathi ला विचारा',
    whyAmISeeingThis: 'मला हे पाऊल का दिसत आहे?',
    openOfficialPortal: 'अधिकृत पोर्टल उघडा ↗',
    viewOfficialSource: 'अधिकृत स्त्रोत पहा ↗',
    viewSourceExcerpt: 'राजपत्र उतारा पहा (AI) 📄',
    sourceEvidenceTitle: 'अधिकृत स्त्रोत आणि पुरावे',
    sourceEvidenceSubtitle: 'सत्यापित शासकीय संकेतस्थळे आणि राजपत्रित प्राधिकरण',
    stepsProgress: 'प्रक्रिया प्रगती',
    documentReadiness: 'कागदपत्रांची सज्जता',
    backToHome: 'मुख्यपृष्ठ',
    resetRoadmap: 'रोडमॅप रीसेट करा',
  },
};

/**
 * Triggers Google Translate dynamically across the DOM
 */
export const triggerGoogleTranslate = (lang: Language) => {
  try {
    const googleCode = lang;
    const hostname = window.location.hostname;

    // Set translation cookies
    document.cookie = `googtrans=/en/${googleCode}; path=/;`;
    if (hostname && hostname !== 'localhost') {
      document.cookie = `googtrans=/en/${googleCode}; path=/; domain=.${hostname};`;
      document.cookie = `googtrans=/en/${googleCode}; path=/; domain=${hostname};`;
    }

    // Trigger select element in DOM if Google Translate widget is rendered
    const select = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
    if (select) {
      select.value = googleCode;
      select.dispatchEvent(new Event('change'));
    }
  } catch (err) {
    console.warn('Google Translate sync:', err);
  }
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
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('dishasaathi_lang') as Language;
    return saved === 'hi' || saved === 'mr' || saved === 'en' ? saved : 'en';
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('dishasaathi_lang', lang);
    document.documentElement.lang = lang;
    triggerGoogleTranslate(lang);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    // Apply Google Translate trigger on mount / lang change
    triggerGoogleTranslate(language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] || translations.en }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
