import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

export type Language = 'en' | 'hi' | 'mr';

export interface LanguageStrings {
  // Navigation & Brand
  brandName: string;
  brandTagline: string;
  navHowItWorks: string;
  navExploreServices: string;
  navGovUpdates: string;
  navAbout: string;
  navSignIn: string;
  navStartJourney: string;
  navViewRoadmap: string;
  navCreateRoadmap: string;
  adminReview: string;
  searchPlaceholder: string;
  searchAction: string;

  // Sidebar Items
  sidebarHome: string;
  sidebarJourneys: string;
  sidebarExplore: string;
  sidebarServices: string;
  sidebarUpdates: string;
  sidebarDocuments: string;
  sidebarDeadlines: string;
  sidebarSaved: string;
  sidebarPassport: string;
  sidebarSettings: string;
  sidebarQuoteTitle: string;
  sidebarQuoteDesc: string;

  // Hero Section
  heroBadge: string;
  heroHeadline1: string;
  heroHeadline2: string;
  heroSubtext: string;
  heroInputPlaceholder: string;
  heroTryAsking: string;
  heroPopBusiness: string;
  heroPopBirth: string;
  heroPopProperty: string;
  heroPopWater: string;
  heroPopTrade: string;
  heroCTA: string;
  heroExploreServices: string;

  // Hero Diagram
  fromManySources: string;
  toClearJourney: string;
  srcPortal: string;
  srcPortalSub: string;
  srcPdf: string;
  srcPdfSub: string;
  srcDept: string;
  srcDeptSub: string;
  srcApp: string;
  srcAppSub: string;
  srcMuni: string;
  srcMuniSub: string;
  srcCirc: string;
  srcCircSub: string;
  stepEligibility: string;
  stepDocs: string;
  stepReg: string;
  stepAppr: string;
  stepComp: string;
  sameGoalNote: string;

  // Trust Pillars
  trustTitle: string;
  trustP1Title: string;
  trustP1Desc: string;
  trustP2Title: string;
  trustP2Desc: string;
  trustP3Title: string;
  trustP3Desc: string;
  trustP4Title: string;
  trustP4Desc: string;
  trustP5Title: string;
  trustP5Desc: string;

  // Problem & Solution Section
  problemTitle: string;
  problemSubtext: string;
  badgePortals: string;
  badgeForms: string;
  badgePdfs: string;
  badgeNotifs: string;
  badgeDepts: string;
  badgeTerms: string;
  solveTitle: string;
  solveSub: string;
  step1Search: string;
  step1Desc: string;
  step2Und: string;
  step2Desc: string;
  step3Conn: string;
  step3Desc: string;
  step4Comp: string;
  step4Desc: string;

  // Experience Section (4 Cards)
  expTitle: string;
  expSubtitle: string;
  card1Title: string;
  card1Desc: string;
  card1Query: string;
  card2Title: string;
  card2Desc: string;
  card2Req: string;
  card2Loc: string;
  card2Goal: string;
  card3Title: string;
  card3Desc: string;
  card3Shop: string;
  card4Title: string;
  card4Desc: string;
  card4Alert: string;
  card4AlertDesc: string;
  card4Btn: string;

  // Rules Change Section
  rulesTitle1: string;
  rulesTitle2: string;
  rulesSubtitle: string;
  btnHowItWorks: string;
  before: string;
  after: string;
  reqDocs: string;
  docIdentity: string;
  docAddress: string;
  docBusiness: string;
  docPhoto: string;
  newTag: string;
  newReqAlert: string;
  photoRequired: string;
  btnWhatChanged: string;

  // Features Grid
  featTitle: string;
  featSubtitle: string;
  f1Title: string;
  f1Desc: string;
  f2Title: string;
  f2Desc: string;
  f3Title: string;
  f3Desc: string;
  f4Title: string;
  f4Desc: string;
  learnMore: string;

  // FAQ Section
  faqTitle: string;
  faqSubtitle: string;

  // Call to Action Banner & Footer
  ctaTitle: string;
  ctaSubtitle: string;
  ctaPlaceholder: string;
  ctaNoForms: string;
  ctaHandwritten: string;
  footerDisclaimer: string;
  footerAccessibility: string;
  footerPrivacy: string;
  footerTerms: string;
  btnSignUp: string;

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

  // Filters & Actions
  filterAll: string;
  filterToDo: string;
  filterCompleted: string;
  filterBlocked: string;
  filterDocuments: string;
  showingSteps: string;
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

  // Impact & Flowchart & Hero Banner
  impactProcedures: string;
  impactProceduresDesc: string;
  impactVerified: string;
  impactVerifiedDesc: string;
  impactVisits: string;
  impactVisitsDesc: string;
  impactHours: string;
  impactHoursDesc: string;
  heroTaglinePossibilities: string;
  heroWelcomeBack: string;
  heroPopularSearches: string;
  flowchartTitle: string;
  flowchartBadge: string;
  flowchartDesc: string;
  flowchartCompleted: string;
  flowchartCurrent: string;
  flowchartUpcoming: string;
  flowchartBlocked: string;
}

const translations: Record<Language, LanguageStrings> = {
  en: {
    brandName: 'DishaSaathi',
    brandTagline: 'Your GPS for Government Services',
    navHowItWorks: 'How it Works',
    navExploreServices: 'Explore Services',
    navGovUpdates: 'Government Updates',
    navAbout: 'About',
    navSignIn: 'Sign In',
    navStartJourney: 'Start Your Journey',
    navViewRoadmap: 'View Active Roadmap',
    navCreateRoadmap: 'Create My Roadmap',
    adminReview: 'Admin Review',
    searchPlaceholder: 'What are you trying to do? (e.g. "I want to start a small business")',
    searchAction: 'Search',

    sidebarHome: 'Home',
    sidebarJourneys: 'My Journeys',
    sidebarExplore: 'Explore',
    sidebarServices: 'Services',
    sidebarUpdates: 'Government Updates',
    sidebarDocuments: 'Documents',
    sidebarDeadlines: 'Deadlines',
    sidebarSaved: 'Saved',
    sidebarPassport: 'Civic Passport',
    sidebarSettings: 'Settings',
    sidebarQuoteTitle: 'Less confusion. More action.',
    sidebarQuoteDesc: 'DishaSaathi simplifies government processes with verified information, clear steps and real-time updates.',

    heroBadge: 'Simpler • Faster • Trusted',
    heroHeadline1: 'Government processes',
    heroHeadline2: 'shouldn’t feel like a maze.',
    heroSubtext: 'Tell us what you’re trying to do. DishaSaathi turns fragmented government information into one clear, verified journey.',
    heroInputPlaceholder: 'I want to start a small business in Mumbai',
    heroTryAsking: 'Try asking:',
    heroPopBirth: 'Birth Certificate',
    heroPopBusiness: 'Start a Business',
    heroPopProperty: 'Property Registration',
    heroPopWater: 'Water Connection',
    heroPopTrade: 'Trade License',
    heroCTA: 'Build My Roadmap',
    heroExploreServices: 'Explore Government Services',

    fromManySources: 'From many sources...',
    toClearJourney: '...to one clear journey',
    srcPortal: 'Government Portal',
    srcPortalSub: 'Websites & Portals',
    srcPdf: 'PDF Notification',
    srcPdfSub: 'Notices & Circulars',
    srcDept: 'Department Website',
    srcDeptSub: 'Information & Forms',
    srcApp: 'Application Form',
    srcAppSub: 'Download & Fill',
    srcMuni: 'Municipal Service',
    srcMuniSub: 'Local Bodies',
    srcCirc: 'Government Circular',
    srcCircSub: 'Policy Updates',
    stepEligibility: 'Eligibility',
    stepDocs: 'Documents',
    stepReg: 'Registration',
    stepAppr: 'Approval',
    stepComp: 'Completed',
    sameGoalNote: 'Same goal. Less confusion.',

    trustTitle: 'Built around official information',
    trustP1Title: 'Official sources',
    trustP1Desc: 'Direct links to government portals',
    trustP2Title: 'Source verification',
    trustP2Desc: 'Trusted & authentic information',
    trustP3Title: 'Latest updates',
    trustP3Desc: 'Real-time rule & policy changes',
    trustP4Title: 'Clear explanations',
    trustP4Desc: 'Simple, easy to understand',
    trustP5Title: 'Personalized journeys',
    trustP5Desc: 'Tailored to your needs',

    problemTitle: "Government information is everywhere. The right path isn't.",
    problemSubtext: 'Information is scattered across multiple departments, websites, forms and notifications. DishaSaathi brings the relevant information together and turns it into one understandable journey.',
    badgePortals: 'Multiple websites and portals',
    badgeForms: 'Various forms',
    badgePdfs: 'PDFs & circulars',
    badgeNotifs: 'Notifications & updates',
    badgeDepts: 'Different departments',
    badgeTerms: 'Different terminology',
    solveTitle: 'How DishaSaathi solves it',
    solveSub: 'One goal. A clear path.',
    step1Search: 'Search',
    step1Desc: 'Tell us what you want to do',
    step2Und: 'Understand',
    step2Desc: 'We analyze your intent',
    step3Conn: 'Connect',
    step3Desc: 'Find relevant government sources',
    step4Comp: 'Complete',
    step4Desc: 'Get your step-by-step roadmap',

    expTitle: 'The DishaSaathi Experience',
    expSubtitle: 'From a simple question to a clear, step-by-step journey.',
    card1Title: 'Tell us what you need',
    card1Desc: 'Use natural language to share your goal.',
    card1Query: 'I want to open a small bakery in Mumbai',
    card2Title: 'DishaSaathi understands',
    card2Desc: 'We analyze your intent and find the right information.',
    card2Req: 'Your request: Start Food Business',
    card2Loc: 'Location: Mumbai',
    card2Goal: 'Business registration + required permissions',
    card3Title: 'Your journey is created',
    card3Desc: 'Get a personalized roadmap with all steps, documents and departments.',
    card3Shop: 'Shop & Establishment',
    card4Title: 'Stay updated',
    card4Desc: 'Get notified when there are changes in rules, fees or documents.',
    card4Alert: 'Government update detected',
    card4AlertDesc: 'An additional document is now required for this procedure.',
    card4Btn: 'Update My Journey',

    rulesTitle1: 'Government rules change.',
    rulesTitle2: 'Your roadmap should too.',
    rulesSubtitle: 'Get real-time updates on new rules, fees, documents and procedures — so you never miss an important change.',
    btnHowItWorks: 'See How It Works',
    before: 'Before',
    after: 'After',
    reqDocs: 'Required documents:',
    docIdentity: 'Identity Proof',
    docAddress: 'Address Proof',
    docBusiness: 'Business Details',
    docPhoto: 'Photograph',
    newTag: 'New',
    newReqAlert: 'New requirement detected',
    photoRequired: 'Photograph now required for this registration.',
    btnWhatChanged: 'See What Changed',

    featTitle: 'Powerful features for a smoother journey',
    featSubtitle: 'Everything you need, in one place.',
    f1Title: 'Clear Roadmaps',
    f1Desc: 'Turn complicated procedures into easy visual journeys.',
    f2Title: 'Verified Information',
    f2Desc: 'Every requirement connects back to its official source.',
    f3Title: 'Stay Updated',
    f3Desc: 'Know when fees, documents, rules or procedures change.',
    f4Title: 'Your Civic Journey',
    f4Desc: 'Save, resume, share and track your progress.',
    learnMore: 'Learn more',

    faqTitle: 'Frequently Asked Questions',
    faqSubtitle: 'Everything you need to know about how DishaSaathi works and its features.',

    ctaTitle: 'Start with what you need to do.',
    ctaSubtitle: "Tell DishaSaathi your goal. We'll help you understand the path.",
    ctaPlaceholder: 'What are you trying to accomplish?',
    ctaNoForms: 'No complicated forms to begin. Just tell us what you need.',
    ctaHandwritten: 'Your journey to easier services starts here.',
    footerDisclaimer: 'Information is provided with links to official sources. Always verify requirements with the relevant government authority before submitting an application.',
    footerAccessibility: 'Accessibility',
    footerPrivacy: 'Privacy Policy',
    footerTerms: 'Terms of Service',
    btnSignUp: 'Sign Up',

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
    viewOfficialSource: 'View Official Source',
    viewSourceExcerpt: 'View Gazette Excerpt',
    sourceEvidenceTitle: 'Official Sources & Grounding Evidence',
    sourceEvidenceSubtitle: 'Verified government portals, municipal bodies, and gazetted authorities',
    stepsProgress: 'Steps Progress',
    documentReadiness: 'Document Readiness',
    backToHome: 'Back to Home',
    resetRoadmap: 'Reset Journey',

    impactProcedures: 'Procedures Mapped',
    impactProceduresDesc: 'Civic procedures mapped across municipal, state & central ministries.',
    impactVerified: 'Verified Sources',
    impactVerifiedDesc: '100% verified against active gazettes, statutory acts and official .gov.in portals.',
    impactVisits: 'Visits Saved',
    impactVisitsDesc: 'Avoided redundant trips to municipal ward offices & departments.',
    impactHours: 'Citizen Hours Saved',
    impactHoursDesc: 'Estimated citizen time saved navigating confusing queues and paperwork.',
    heroTaglinePossibilities: 'Simpler Steps. Greater Possibilities.',
    heroWelcomeBack: 'WELCOME BACK',
    heroPopularSearches: 'Popular searches:',
    flowchartTitle: 'Civic Procedure Flowchart',
    flowchartBadge: 'Linear & Parallel Dependencies',
    flowchartDesc: 'Interactive visual flowchart. Click any small step node to inspect statutory obligations.',
    flowchartCompleted: 'Completed',
    flowchartCurrent: 'Current',
    flowchartUpcoming: 'Upcoming',
    flowchartBlocked: 'Blocked',
  },

  hi: {
    brandName: 'DishaSaathi',
    brandTagline: 'सरकारी सेवाओं के लिए आपका जीपीएस',
    navHowItWorks: 'यह कैसे काम करता है',
    navExploreServices: 'सेवाएं देखें',
    navGovUpdates: 'सरकारी अपडेट',
    navAbout: 'के बारे में',
    navSignIn: 'साइन इन करें',
    navStartJourney: 'अपनी यात्रा शुरू करें',
    navViewRoadmap: 'सक्रिय रोडमैप देखें',
    navCreateRoadmap: 'मेरा रोडमैप बनाएं',
    adminReview: 'प्रशासक समीक्षा',
    searchPlaceholder: 'आप क्या करना चाहते हैं? (उदा. "मुझे छोटा व्यवसाय शुरू करना है")',
    searchAction: 'खोजें',

    sidebarHome: 'होम',
    sidebarJourneys: 'मेरी यात्राएं',
    sidebarExplore: 'एक्सप्लोर',
    sidebarServices: 'सेवाएं खोजें',
    sidebarUpdates: 'सरकारी अपडेट',
    sidebarDocuments: 'दस्तावेज़',
    sidebarDeadlines: 'समय सीमा',
    sidebarSaved: 'सहेजा गया',
    sidebarPassport: 'नागरिक पासपोर्ट',
    sidebarSettings: 'सेटिंग्स',
    sidebarQuoteTitle: 'कम उलझन। अधिक कार्रवाई।',
    sidebarQuoteDesc: 'दिशासाथी सत्यापित जानकारी, स्पष्ट चरणों और वास्तविक समय के अपडेट के साथ सरकारी प्रक्रियाओं को सरल बनाता है।',

    heroBadge: 'सरल • तेज़ • विश्वसनीय',
    heroHeadline1: 'सरकारी प्रक्रियाएं',
    heroHeadline2: 'भूलभुलैया जैसी नहीं होनी चाहिए।',
    heroSubtext: 'हमें बताएं कि आप क्या करने का प्रयास कर रहे हैं। दिशासाथी खंडित सरकारी जानकारी को एक स्पष्ट, सत्यापित यात्रा में बदलता है।',
    heroInputPlaceholder: 'मुझे मुंबई में छोटा व्यवसाय शुरू करना है',
    heroTryAsking: 'पूछ कर देखें:',
    heroPopBirth: 'जन्म प्रमाण पत्र',
    heroPopBusiness: 'व्यवसाय शुरू करें',
    heroPopProperty: 'संपत्ति पंजीकरण',
    heroPopWater: 'पानी कनेक्शन',
    heroPopTrade: 'व्यापार लाइसेंस',
    heroCTA: 'मेरा रोडमैप बनाएं',
    heroExploreServices: 'सरकारी सेवाएं देखें',

    fromManySources: 'अनेक स्रोतों से...',
    toClearJourney: '...एक स्पष्ट यात्रा तक',
    srcPortal: 'सरकारी पोर्टल',
    srcPortalSub: 'वेबसाइट्स और पोर्टल',
    srcPdf: 'पीडीएफ अधिसूचना',
    srcPdfSub: 'नोटिस व परिपत्रक',
    srcDept: 'विभागीय वेबसाइट',
    srcDeptSub: 'जानकारी व फॉर्म',
    srcApp: 'आवेदन फॉर्म',
    srcAppSub: 'डाउनलोड और भरें',
    srcMuni: 'नगर निगम सेवा',
    srcMuniSub: 'स्थानीय निकाय',
    srcCirc: 'सरकारी परिपत्रक',
    srcCircSub: 'नीति अपडेट',
    stepEligibility: 'पात्रता',
    stepDocs: 'दस्तावेज़',
    stepReg: 'पंजीकरण',
    stepAppr: 'स्वीकृति',
    stepComp: 'पूर्ण',
    sameGoalNote: 'वही लक्ष्य। कम उलझन।',

    trustTitle: 'आधिकारिक जानकारी पर आधारित',
    trustP1Title: 'आधिकारिक स्रोत',
    trustP1Desc: 'सरकारी पोर्टल्स के सीधे लिंक',
    trustP2Title: 'स्रोतों का सत्यापन',
    trustP2Desc: 'विश्वसनीय और प्रामाणिक जानकारी',
    trustP3Title: 'नवीनतम अपडेट',
    trustP3Desc: 'नियम और नीतियों में वास्तविक समय बदलाव',
    trustP4Title: 'स्पष्ट व्याख्या',
    trustP4Desc: 'सरल और समझने में आसान',
    trustP5Title: 'व्यक्तिगत यात्राएं',
    trustP5Desc: 'आपकी आवश्यकताओं के अनुसार',

    problemTitle: 'सरकारी जानकारी हर जगह है। सही रास्ता नहीं।',
    problemSubtext: 'जानकारी कई विभागों, वेबसाइटों, फॉर्म और सूचनाओं में बिखरी हुई है। दिशासाथी प्रासंगिक जानकारी को एक साथ लाकर एक समझने योग्य यात्रा बनाता है।',
    badgePortals: 'अनेक वेबसाइट्स और पोर्टल',
    badgeForms: 'विभिन्न फॉर्म',
    badgePdfs: 'पीडीएफ व परिपत्रक',
    badgeNotifs: 'अधिसूचनाएं और अपडेट',
    badgeDepts: 'अलग-अलग विभाग',
    badgeTerms: 'जटिल शब्दजाल',
    solveTitle: 'दिशासाथी इसे कैसे हल करता है',
    solveSub: 'एक लक्ष्य। एक स्पष्ट मार्ग।',
    step1Search: 'खोजें',
    step1Desc: 'हमें बताएं आप क्या करना चाहते हैं',
    step2Und: 'समझें',
    step2Desc: 'हम आपके इरादे का विश्लेषण करते हैं',
    step3Conn: 'जोड़ें',
    step3Desc: 'प्रासंगिक सरकारी स्रोत खोजें',
    step4Comp: 'पूर्ण करें',
    step4Desc: 'अपना चरण-दर-चरण रोडमैप पाएं',

    expTitle: 'दिशासाथी का अनुभव',
    expSubtitle: 'एक साधारण प्रश्न से एक स्पष्ट, चरण-दर-चरण यात्रा तक।',
    card1Title: 'हमें बताएं आपको क्या चाहिए',
    card1Desc: 'अपने लक्ष्य को साझा करने के लिए सरल भाषा का प्रयोग करें।',
    card1Query: 'मुझे मुंबई में एक छोटी बेकरी खोलनी है',
    card2Title: 'दिशासाथी समझता है',
    card2Desc: 'हम आपके इरादे का विश्लेषण करते हैं और सही जानकारी ढूंढते हैं।',
    card2Req: 'आपका अनुरोध: खाद्य व्यवसाय शुरू करें',
    card2Loc: 'स्थान: मुंबई',
    card2Goal: 'व्यवसाय पंजीकरण + आवश्यक अनुमतियां',
    card3Title: 'आपकी यात्रा तैयार है',
    card3Desc: 'सभी चरणों, दस्तावेजों और विभागों के साथ व्यक्तिगत रोडमैप पाएं।',
    card3Shop: 'दुकान और स्थापना',
    card4Title: 'अपडेट रहें',
    card4Desc: 'नियमों, शुल्कों या दस्तावेजों में बदलाव होने पर सूचना पाएं।',
    card4Alert: 'सरकारी अपडेट का पता चला',
    card4AlertDesc: 'इस प्रक्रिया के लिए अब एक अतिरिक्त दस्तावेज़ की आवश्यकता है।',
    card4Btn: 'मेरी यात्रा अपडेट करें',

    rulesTitle1: 'सरकारी नियम बदलते हैं।',
    rulesTitle2: 'आपका रोडमैप भी बदलना चाहिए।',
    rulesSubtitle: 'नए नियमों, शुल्कों, दस्तावेजों और प्रक्रियाओं पर वास्तविक समय में अपडेट प्राप्त करें — ताकि आपसे कोई महत्वपूर्ण बदलाव न छूटे।',
    btnHowItWorks: 'देखें यह कैसे काम करता है',
    before: 'पहले',
    after: 'बाद में',
    reqDocs: 'आवश्यक दस्तावेज़:',
    docIdentity: 'पहचान प्रमाण',
    docAddress: 'पते का प्रमाण',
    docBusiness: 'व्यवसाय विवरण',
    docPhoto: 'फोटो (पासपोर्ट साइज़)',
    newTag: 'नया',
    newReqAlert: 'नई आवश्यकता का पता चला',
    photoRequired: 'इस पंजीकरण के लिए अब फोटो आवश्यक है।',
    btnWhatChanged: 'देखें क्या बदला',

    featTitle: 'सुगम यात्रा के लिए शक्तिशाली सुविधाएं',
    featSubtitle: 'सब कुछ एक ही जगह पर।',
    f1Title: 'स्पष्ट रोडमैप',
    f1Desc: 'जटिल प्रक्रियाओं को आसान दृश्य यात्राओं में बदलें।',
    f2Title: 'सत्यापित जानकारी',
    f2Desc: 'प्रत्येक आवश्यकता अपने आधिकारिक स्रोत से जुड़ी है।',
    f3Title: 'अपडेट रहें',
    f3Desc: 'जानें कि शुल्क, दस्तावेज, नियम या प्रक्रियाएं कब बदलती हैं।',
    f4Title: 'आपकी नागरिक यात्रा',
    f4Desc: 'अपनी प्रगति को सहेजें, पुनः आरंभ करें, साझा करें और ट्रैक करें।',
    learnMore: 'और जानें',

    faqTitle: 'अक्सर पूछे जाने वाले प्रश्न',
    faqSubtitle: 'दिशासाथी कैसे काम करता है और इसकी विशेषताओं के बारे में सब कुछ।',

    ctaTitle: 'आपको जो करना है उससे शुरुआत करें।',
    ctaSubtitle: 'दिशासाथी को अपना लक्ष्य बताएं। हम आपको रास्ता समझने में मदद करेंगे।',
    ctaPlaceholder: 'आप क्या पूरा करना चाहते हैं?',
    ctaNoForms: 'शुरुआत के लिए कोई जटिल फॉर्म नहीं। बस बताएं आपको क्या चाहिए।',
    ctaHandwritten: 'सरल सेवाओं की आपकी यात्रा यहीं से शुरू होती है।',
    footerDisclaimer: 'जानकारी आधिकारिक स्रोतों के लिंक के साथ प्रदान की जाती है। आवेदन जमा करने से पहले हमेशा संबंधित सरकारी प्राधिकरण के साथ आवश्यकताओं को सत्यापित करें।',
    footerAccessibility: 'सुलभता',
    footerPrivacy: 'गोपनीयता नीति',
    footerTerms: 'सेवा की शर्तें',
    btnSignUp: 'साइन अप करें',

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
    viewOfficialSource: 'आधिकारिक स्रोत देखें',
    viewSourceExcerpt: 'राजपत्र उद्धरण देखें',
    sourceEvidenceTitle: 'आधिकारिक स्रोत और साक्ष्य',
    sourceEvidenceSubtitle: 'सत्यापित सरकारी पोर्टल, नगरपालिका निकाय और राजपत्रित प्राधिकरण',
    stepsProgress: 'प्रक्रिया प्रगति',
    documentReadiness: 'दस्तावेज़ तैयारी',
    backToHome: 'होम पर वापस',
    resetRoadmap: 'रोडमॅप रीसेट करें',

    impactProcedures: 'प्रक्रियाएं मैप की गईं',
    impactProceduresDesc: 'नगरपालिका, राज्य और केंद्रीय मंत्रालयों में मैप की गई नागरिक प्रक्रियाएं।',
    impactVerified: 'सत्यापित स्रोत',
    impactVerifiedDesc: 'सक्रिय राजपत्रों और आधिकारिक .gov.in पोर्टलों के विरुद्ध 100% सत्यापित।',
    impactVisits: 'बचाए गए दौरे',
    impactVisitsDesc: 'नगरपालिका वार्ड कार्यालयों और विभागों के अनावश्यक चक्करों से बचाव।',
    impactHours: 'बचाए गए नागरिक घंटे',
    impactHoursDesc: 'उलझन भरी कतारों और कागजी कार्रवाई से बचा अनुमानित समय।',
    heroTaglinePossibilities: 'सरल कदम। असीम संभावनाएं।',
    heroWelcomeBack: 'वापसी पर स्वागत है',
    heroPopularSearches: 'लोकप्रिय खोजें:',
    flowchartTitle: 'नागरिक प्रक्रिया फ्लोचार्ट',
    flowchartBadge: 'रैखिक और समानांतर निर्भरताएं',
    flowchartDesc: 'इंटरैक्टिव दृश्य फ्लोचार्ट। दायित्वों का निरीक्षण करने के लिए किसी भी चरण पर क्लिक करें।',
    flowchartCompleted: 'पूर्ण',
    flowchartCurrent: 'प्रगति में',
    flowchartUpcoming: 'आगामी',
    flowchartBlocked: 'अवरुद्ध',
  },

  mr: {
    brandName: 'DishaSaathi',
    brandTagline: 'सरकारी सेवांसाठी आपला जीपीएस',
    navHowItWorks: 'हे कसे कार्य करते',
    navExploreServices: 'सेवा शोधा',
    navGovUpdates: 'सरकारी अद्यतने',
    navAbout: 'माहिती',
    navSignIn: 'साइन इन',
    navStartJourney: 'प्रवास सुरू करा',
    navViewRoadmap: 'सक्रिय रोडमॅप पहा',
    navCreateRoadmap: 'माझा रोडमॅप तयार करा',
    adminReview: 'प्रशासक पुनरावलोकन',
    searchPlaceholder: 'तुम्हाला काय करायचे आहे? (उदा. "मला छोटा व्यवसाय सुरू करायचा आहे")',
    searchAction: 'शोधा',

    sidebarHome: 'होम',
    sidebarJourneys: 'माझे मार्ग',
    sidebarExplore: 'एक्सप्लोर करा',
    sidebarServices: 'सेवा शोधा',
    sidebarUpdates: 'सरकारी अद्यतने',
    sidebarDocuments: 'कागदपत्रे',
    sidebarDeadlines: 'मुदत / कॅलेंडर',
    sidebarSaved: 'जतन केलेले',
    sidebarPassport: 'नागरी पारपत्र',
    sidebarSettings: 'सेटिंग्ज',
    sidebarQuoteTitle: 'कमी गोंधळ. अधिक कृती.',
    sidebarQuoteDesc: 'दिशासाथी पडताळलेली माहिती, स्पष्ट पावले आणि थेट अद्यतनांसह सरकारी प्रक्रिया सुलभ करते.',

    heroBadge: 'सोपे • जलद • विश्वासार्ह',
    heroHeadline1: 'सरकारी प्रक्रिया',
    heroHeadline2: 'चक्रव्यूहासारख्या वाटू नयेत.',
    heroSubtext: 'तुम्ही काय करू इच्छिता ते सांगा. दिशासाथी विखुरलेली सरकारी माहिती एका स्पष्ट, पडताळलेल्या प्रवासात रूपांतरित करते.',
    heroInputPlaceholder: 'मला मुंबईत छोटा व्यवसाय सुरू करायचा आहे',
    heroTryAsking: 'विचारून पहा:',
    heroPopBirth: 'जन्म प्रमाणपत्र',
    heroPopBusiness: 'व्यवसाय सुरू करा',
    heroPopProperty: 'मालमत्ता नोंदणी',
    heroPopWater: 'पाणी जोडणी',
    heroPopTrade: 'व्यवसाय परवाना',
    heroCTA: 'माझा रोडमॅप तयार करा',
    heroExploreServices: 'सरकारी सेवा शोधा',

    fromManySources: 'अनेक स्त्रोतांतून...',
    toClearJourney: '...एका स्पष्ट प्रवासात',
    srcPortal: 'शासकीय पोर्टल',
    srcPortalSub: 'संकेतस्थळे',
    srcPdf: 'पीडीएफ अधिसूचना',
    srcPdfSub: 'सूचना व परिपत्रके',
    srcDept: 'विभागीय संकेतस्थळ',
    srcDeptSub: 'माहिती व फॉर्म',
    srcApp: 'अर्जाचा नमुना',
    srcAppSub: 'डाऊनलोड व भरा',
    srcMuni: 'महानगरपालिका सेवा',
    srcMuniSub: 'स्थानिक स्वराज्य संस्था',
    srcCirc: 'शासकीय परिपत्रक',
    srcCircSub: 'धोरण अद्यतने',
    stepEligibility: 'पात्रता',
    stepDocs: 'कागदपत्रे',
    stepReg: 'नोंदणी',
    stepAppr: 'मंजुरी',
    stepComp: 'पूर्ण झाले',
    sameGoalNote: 'तेच उद्दिष्ट। कमी गोंधळ।',

    trustTitle: 'अधिकृत माहितीवर आधारित',
    trustP1Title: 'अधिकृत स्त्रोत',
    trustP1Desc: 'शासकीय पोर्टल्सच्या थेट लिंक्स',
    trustP2Title: 'स्त्रोत पडताळणी',
    trustP2Desc: 'विश्वासार्ह आणि खरी माहिती',
    trustP3Title: 'थेट अद्यतने',
    trustP3Desc: 'नियम व धोरणांमधील थेट बदल',
    trustP4Title: 'सोपे स्पष्टीकरण',
    trustP4Desc: 'सोपे आणि समजायला सुलभ',
    trustP5Title: 'वैयक्तिक प्रवास',
    trustP5Desc: 'आपल्या गरजेनुसार तयार',

    problemTitle: 'सरकारी माहिती सर्वत्र आहे. योग्य मार्ग नाही.',
    problemSubtext: 'माहिती विविध विभाग, संकेतस्थळे आणि फॉर्ममध्ये विखुरलेली आहे. दिशासाथी ही माहिती एकत्रित करून एक सोपा मार्ग तयार करते.',
    badgePortals: 'अनेक संकेतस्थळे आणि पोर्टल्स',
    badgeForms: 'विविध फॉर्म्स',
    badgePdfs: 'पीडीएफ व परिपत्रके',
    badgeNotifs: 'सूचना आणि अद्यतने',
    badgeDepts: 'विविध सरकारी विभाग',
    badgeTerms: 'क्लिष्ट शब्दरचना',
    solveTitle: 'दिशासाथी हे कसे सोडवते',
    solveSub: 'एक उद्दिष्ट। एक स्पष्ट मार्ग.',
    step1Search: 'शोधा',
    step1Desc: 'तुम्हाला काय करायचे आहे ते सांगा',
    step2Und: 'समजून घ्या',
    step2Desc: 'आम्ही तुमच्या गरजेचा अभ्यास करतो',
    step3Conn: 'जोडा',
    step3Desc: 'संबंधित शासकीय स्त्रोत शोधा',
    step4Comp: 'पूर्ण करा',
    step4Desc: 'आपला सविस्तर रोडमॅप मिळवा',

    expTitle: 'दिशासाथीचा अनुभव',
    expSubtitle: 'एका साध्या प्रश्नापासून ते एका स्पष्ट, टप्प्याटप्प्याच्या प्रवासापर्यंत.',
    card1Title: 'तुम्हाला काय हवे आहे ते सांगा',
    card1Desc: 'आपले उद्दिष्ट सांगण्यासाठी साध्या भाषेचा वापर करा.',
    card1Query: 'मला मुंबईत एक लहान बेकरी सुरू करायची आहे',
    card2Title: 'दिशासाथी समजून घेते',
    card2Desc: 'आम्ही आपली गरज ओळखून योग्य माहिती शोधतो.',
    card2Req: 'तुमची विनंती: अन्न व्यवसाय सुरू करा',
    card2Loc: 'स्थान: मुंबई',
    card2Goal: 'व्यवसाय नोंदणी + आवश्यक परवानग्या',
    card3Title: 'आपला प्रवास तयार होतो',
    card3Desc: 'सर्व टप्पे, कागदपत्रे आणि मंजुऱ्यांसह वैयक्तिक रोडमॅप मिळवा.',
    card3Shop: 'गुमास्ता / दुकाने व आस्थापना',
    card4Title: 'अद्ययावत राहा',
    card4Desc: 'नियम, शुल्क किंवा कागदपत्रांत बदल झाल्यास सूचना मिळवा.',
    card4Alert: 'शासकीय अद्यतन आढळले',
    card4AlertDesc: 'या प्रक्रियेसाठी आता एका अतिरिक्त कागदपत्राची आवश्यकता आहे.',
    card4Btn: 'माझा प्रवास अद्यतन करा',

    rulesTitle1: 'सरकारी नियम बदलतात.',
    rulesTitle2: 'आपला रोडमॅपही बदलायला हवा.',
    rulesSubtitle: 'नवीन नियम, शुल्क, कागदपत्रे आणि कार्यपद्धतींवर थेट अद्यतने मिळवा — जेणेकरून कोणताही महत्त्वाचा बदल सुटणार नाही.',
    btnHowItWorks: 'हे कसे कार्य करते ते पहा',
    before: 'पूर्वी',
    after: 'नंतर',
    reqDocs: 'आवश्यक कागदपत्रे:',
    docIdentity: 'ओळखपत्र पुरावा',
    docAddress: 'पत्त्याचा पुरावा',
    docBusiness: 'व्यवसायाचा तपशील',
    docPhoto: 'छायाचित्र (पासपोर्ट आकाराचे)',
    newTag: 'नवीन',
    newReqAlert: 'नवीन अट समाविष्ट',
    photoRequired: 'या नोंदणीसाठी आता छायाचित्र आवश्यक आहे.',
    btnWhatChanged: 'काय बदलले ते पहा',

    featTitle: 'सुलभ प्रवासासाठी शक्तिशाली वैशिष्ट्ये',
    featSubtitle: 'सर्व काही एकाच ठिकाणी.',
    f1Title: 'स्पष्ट रोडमॅप',
    f1Desc: 'क्लिष्ट प्रक्रियांचे सोप्या दृश्य प्रवासात रूपांतर करा.',
    f2Title: 'पडताळलेली माहिती',
    f2Desc: 'प्रत्येक आवश्यकता थेट अधिकृत स्त्रोताशी जोडलेली आहे.',
    f3Title: 'थेट अद्यतने',
    f3Desc: 'शुल्क, कागदपत्रे किंवा नियमांमध्ये बदल झाल्यास त्वरित माहिती मिळवा.',
    f4Title: 'आपला नागरी प्रवास',
    f4Desc: 'आपली प्रगती जतन करा, पुन्हा सुरू करा आणि ट्रॅक करा.',
    learnMore: 'अधिक जाणून घ्या',

    faqTitle: 'नेहमी विचारले जाणारे प्रश्न',
    faqSubtitle: 'दिशासाथी कसे कार्य करते आणि त्याची वैशिष्ट्ये याबद्दल सर्व माहिती.',

    ctaTitle: 'तुम्हाला जे करायचे आहे त्यापासून सुरुवात करा.',
    ctaSubtitle: 'दिशासाथीला आपले उद्दिष्ट सांगा. आम्ही आपल्याला अचूक मार्ग समजावून सांगू.',
    ctaPlaceholder: 'तुम्ही काय साध्य करू इच्छिता?',
    ctaNoForms: 'सुरुवातीला कोणतेही कठीण फॉर्म नाहीत. फक्त आपल्याला काय हवे ते सांगा.',
    ctaHandwritten: 'सुलभ सरकारी सेवांचा आपला प्रवास येथून सुरू होतो.',
    footerDisclaimer: 'माहिती अधिकृत स्त्रोतांच्या लिंक्ससह दिली आहे. अर्ज सादर करण्यापूर्वी संबंधित शासकीय प्राधिकरणाकडून अटींची खात्री करा.',
    footerAccessibility: 'सुलभता',
    footerPrivacy: 'गोपनीयता धोरण',
    footerTerms: 'सेवा अटी',
    btnSignUp: 'साइन अप करा',

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
    viewOfficialSource: 'अधिकृत स्त्रोत पहा',
    viewSourceExcerpt: 'राजपत्र उतारा पहा',
    sourceEvidenceTitle: 'अधिकृत स्त्रोत आणि पुरावे',
    sourceEvidenceSubtitle: 'सत्यापित शासकीय संकेतस्थळे आणि राजपत्रित प्राधिकरण',
    stepsProgress: 'प्रक्रिया प्रगती',
    documentReadiness: 'कागदपत्रांची सज्जता',
    backToHome: 'मुख्यपृष्ठ',
    resetRoadmap: 'रोडमॅप रीसेट करा',

    impactProcedures: 'मॅप केलेल्या प्रक्रिया',
    impactProceduresDesc: 'महानगरपालिका, राज्य आणि केंद्रीय मंत्रालयांमध्ये नकाशाबद्ध केलेल्या नागरी प्रक्रिया.',
    impactVerified: 'सत्यापित स्त्रोत',
    impactVerifiedDesc: 'सक्रिय राजपत्रे आणि अधिकृत .gov.in पोर्टल्सवर १००% पडताळलेले.',
    impactVisits: 'वाचलेल्या फेऱ्या',
    impactVisitsDesc: 'महानगरपालिका वॉर्ड कार्यालयांच्या अनावश्यक चकरा टळल्या.',
    impactHours: 'नागरिकांचे वाचलेले तास',
    impactHoursDesc: 'रांगा आणि कागदपत्रांच्या त्रासातून वाचलेला अंदाजित वेळ.',
    heroTaglinePossibilities: 'सोपी पावले. अमर्याद संधी.',
    heroWelcomeBack: 'पुन्हा स्वागत आहे',
    heroPopularSearches: 'लोकप्रिय शोध:',
    flowchartTitle: 'नागरी प्रक्रिया फ्लोचार्ट',
    flowchartBadge: 'अचूक आणि समांतर अवलंबित्वे',
    flowchartDesc: 'इंटरॅक्टिव्ह व्हिज्युअल फ्लोचार्ट. वैधानिक माहिती पाहण्यासाठी कोणत्याही टप्प्यावर क्लिक करा.',
    flowchartCompleted: 'पूर्ण झाले',
    flowchartCurrent: 'सुरू आहे',
    flowchartUpcoming: 'पुढील',
    flowchartBlocked: 'थांबलेले',
  },
};

/**
 * Convert numbers (0-9) to Devanagari numerals (०-९) for Hindi and Marathi
 */
export const formatNumberForLang = (num: number | string, lang: Language): string => {
  const str = String(num);
  if (lang === 'en') return str;
  const devanagariDigits: Record<string, string> = {
    '0': '०', '1': '१', '2': '२', '3': '३', '4': '४',
    '5': '५', '6': '६', '7': '७', '8': '८', '9': '९'
  };
  return str.replace(/[0-9]/g, (d) => devanagariDigits[d] || d);
};

/**
 * Triggers Google Translate dynamically across the entire DOM
 */
export const triggerGoogleTranslate = (lang: Language) => {
  try {
    const googleCode = lang === 'en' ? '' : lang;
    const hostname = window.location.hostname;

    // Cookie management for Google Translate
    if (lang === 'en') {
      const expired = 'expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = `googtrans=; ${expired}`;
      document.cookie = `googtrans=/en/en; path=/;`;
      if (hostname && hostname !== 'localhost') {
        document.cookie = `googtrans=; ${expired} domain=${hostname};`;
        document.cookie = `googtrans=; ${expired} domain=.${hostname};`;
        document.cookie = `googtrans=/en/en; path=/; domain=${hostname};`;
        document.cookie = `googtrans=/en/en; path=/; domain=.${hostname};`;
      }
    } else {
      document.cookie = `googtrans=/en/${lang}; path=/;`;
      document.cookie = `googtrans=/auto/${lang}; path=/;`;
      if (hostname && hostname !== 'localhost') {
        document.cookie = `googtrans=/en/${lang}; path=/; domain=.${hostname};`;
        document.cookie = `googtrans=/en/${lang}; path=/; domain=${hostname};`;
        document.cookie = `googtrans=/auto/${lang}; path=/; domain=.${hostname};`;
        document.cookie = `googtrans=/auto/${lang}; path=/; domain=${hostname};`;
      }
    }

    // Function to trigger DOM select element
    const applySelect = (): boolean => {
      const select = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
      if (select) {
        if (select.value !== googleCode) {
          select.value = googleCode;
        }
        select.dispatchEvent(new Event('change', { bubbles: true }));
        select.dispatchEvent(new Event('input', { bubbles: true }));
        if (typeof (select as any).onchange === 'function') {
          (select as any).onchange();
        }
        return true;
      }
      return false;
    };

    // Immediate attempt + progressive polling if script is still rendering widget
    if (!applySelect()) {
      const delays = [50, 150, 300, 600, 1000, 1500, 2500, 4000];
      delays.forEach((delay) => {
        setTimeout(applySelect, delay);
      });
    }
  } catch (err) {
    console.warn('Google Translate sync error:', err);
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: LanguageStrings;
  formatNumber: (num: number | string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => { },
  t: translations.en,
  formatNumber: (n) => String(n)
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    // Only restore a saved language if the user EXPLICITLY changed it (flag check)
    // This prevents auto-translating for new visitors who share the same browser/deploy
    const saved = localStorage.getItem('dishasaathi_lang') as Language;
    const userChose = localStorage.getItem('dishasaathi_lang_chosen') === 'true';
    if (userChose && (saved === 'hi' || saved === 'mr' || saved === 'en')) return saved;
    return 'en';
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('dishasaathi_lang', lang);
    localStorage.setItem('dishasaathi_lang_chosen', 'true'); // mark as explicit user choice
    document.documentElement.lang = lang;
    triggerGoogleTranslate(lang);
  }, []);

  const formatNumber = useCallback(
    (num: number | string) => formatNumberForLang(num, language),
    [language]
  );

  useEffect(() => {
    document.documentElement.lang = language;
    // Only auto-trigger Google Translate on mount if language is non-English
    // Prevents new visitors from seeing a translated page unexpectedly
    if (language !== 'en') {
      triggerGoogleTranslate(language);
    }
  }, [language]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t: translations[language] || translations.en,
        formatNumber
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
