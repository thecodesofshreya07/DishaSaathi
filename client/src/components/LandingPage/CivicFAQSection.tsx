import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLanguage, Language } from '../../context/LanguageContext';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_DATA: Record<Language, FAQItem[]> = {
  en: [
    {
      question: 'How does DishaSaathi turn confusing government procedures into a clear roadmap?',
      answer:
        'Simply type your civic goal in everyday words (e.g. "I want to open a small bakery in Mumbai" or "Apply for driving license"). DishaSaathi extracts your location, entity type, and regulatory domain, and generates a sequenced, numbered roadmap showing every statutory approval in the exact order required by law.'
    },
    {
      question: 'Are the steps, documents, and fees grounded in official government sources?',
      answer:
        'Yes. Every procedure is mapped directly from published Central & State Gazettes, Municipal bylaws (such as BMC, MCD, BBMP), and official single-window government portals (like FoSCoS, Parivahan Sarathi, MCA SPICe+, and Udyam). Every step provides direct outbound links to verified .gov.in and .nic.in portals.'
    },
    {
      question: 'What is the Prerequisite Dependency Sequence, and why does it prevent rejections?',
      answer:
        'In India, over 65% of municipal applications fail because applicants apply for subsequent approvals before obtaining foundational certificates (e.g. applying for a Municipal Health License before getting an FSSAI certificate or Udyam registration). Our Dependency Engine sequences steps mathematically so prerequisite gates unlock only when prior approvals are ready.'
    },
    {
      question: 'How do real-time government regulatory change alerts work?',
      answer:
        'When government departments update challan fees, introduce new mandatory document attachments (such as photo dimensions or notary requirements), or digitize a new service, DishaSaathi flags the change with a clear Before vs. After diff summary and updates your active roadmap automatically.'
    },
    {
      question: 'Can I export print-ready PDF blueprints and ask questions to the AI Copilot?',
      answer:
        'Yes! You can export high-resolution Visual Dependency Graphs and comprehensive Compliance PDF reports with one click. You can also consult our AI Civic Copilot at any stage to clarify municipal jargon, affidavit formats, or ward-specific procedures in English, Hindi, or Marathi.'
    },
    {
      question: 'Is DishaSaathi completely free to use for citizens and business owners?',
      answer:
        'Yes, 100% free! DishaSaathi is built as an open civic utility for Indian citizens, shopkeepers, and founders to eliminate middleman commissions, prevent bureaucratic delays, and provide radical transparency across Indian public administration.'
    }
  ],
  hi: [
    {
      question: 'दिशासाथी जटिल सरकारी प्रक्रियाओं को एक स्पष्ट रोडमैप में कैसे बदलता है?',
      answer:
        'बस अपने नागरिक लक्ष्य को आसान शब्दों में लिखें (उदा. "मुझे मुंबई में एक छोटी बेकरी खोलनी है")। दिशासाथी आपके स्थान, सेवा प्रकार और नियमों का विश्लेषण करके कानून द्वारा आवश्यक सही क्रम में एक चरण-दर-चरण रोडमैप तैयार करता है।'
    },
    {
      question: 'क्या कदम, दस्तावेज और शुल्क आधिकारिक सरकारी स्रोतों पर आधारित हैं?',
      answer:
        'हाँ। प्रत्येक प्रक्रिया सीधे प्रकाशित केंद्रीय और राज्य राजपत्रों, नगरपालिका उपनियमों (जैसे BMC, MCD, BBMP) और आधिकारिक सरकारी पोर्टलों से मैप की जाती है। प्रत्येक चरण आधिकारिक .gov.in पोर्टल्स के लिंक प्रदान करता है।'
    },
    {
      question: 'पूर्व-अपेक्षित निर्भरता क्रम क्या है, और यह अस्वीकृति को कैसे रोकता है?',
      answer:
        'भारत में 65% से अधिक आवेदन इसलिए विफल होते हैं क्योंकि आवेदक बुनियादी प्रमाण पत्र प्राप्त करने से पहले ही आगे की अनुमतियों के लिए आवेदन कर देते हैं। हमारा डिपेंडेंसी इंजन चरणों को गणितीय रूप से क्रमबद्ध करता है ताकि पूर्व-अपेक्षित शर्तें पूरी होने पर ही आगे के कदम खुलें।'
    },
    {
      question: 'सरकारी नियमों में बदलाव के वास्तविक समय अलर्ट कैसे काम करते हैं?',
      answer:
        'जब सरकारी विभाग शुल्क बदलते हैं, नए अनिवार्य दस्तावेज़ जोड़ते हैं या नई सेवा डिजिटाइज़ करते हैं, तो दिशासाथी स्पष्ट पहले बनाम बाद में सारांश के साथ परिवर्तन को चिह्नित करता है और आपके रोडमैप को स्वचालित रूप से अपडेट करता है।'
    },
    {
      question: 'क्या मैं पीडीएफ ब्लूप्रिंट डाउनलोड कर सकता हूँ और एआई से सवाल पूछ सकता हूँ?',
      answer:
        'हाँ! आप एक क्लिक से संपूर्ण दृश्य निर्भरता ग्राफ और अनुपालन रिपोर्ट पीडीएफ के रूप में डाउनलोड कर सकते हैं। आप किसी भी चरण में हमारे एआई साथी से हिंदी, अंग्रेजी या मराठी में सवाल भी पूछ सकते हैं।'
    },
    {
      question: 'क्या दिशासाथी नागरिकों और व्यापार मालिकों के लिए पूरी तरह से मुफ़्त है?',
      answer:
        'हाँ, 100% मुफ़्त! दिशासाथी भारतीय नागरिकों, दुकानदारों और उद्यमियों के लिए बिचौलियों के कमीशन को समाप्त करने और नौकरशाही की देरी को रोकने के लिए एक खुला नागरिक उपकरण है।'
    }
  ],
  mr: [
    {
      question: 'दिशासाथी गुंतागुंतीच्या सरकारी प्रक्रियांचे एका स्पष्ट रोडमॅपमध्ये कसे रूपांतर करते?',
      answer:
        'फक्त आपले उद्दिष्ट साध्या शब्दांत लिहा (उदा. "मला मुंबईत लहान बेकरी सुरू करायची आहे")। दिशासाथी आपले स्थान आणि सेवा प्रकार ओळखून नियमांनुसार योग्य त्या क्रमाने टप्प्याटप्प्याचा रोडमॅप तयार करते.'
    },
    {
      question: 'सर्व टप्पे, कागदपत्रे आणि शुल्क अधिकृत शासकीय स्त्रोतांवर आधारित आहेत का?',
      answer:
        'होय. प्रत्येक प्रक्रिया केंद्र व राज्य राजपत्रे, महानगरपालिका उपनियम आणि अधिकृत शासकीय संकेतस्थळांवरून थेट पडताळली जाते. प्रत्येक पायरीवर थेट .gov.in पोर्टल लिंक्स मिळतात.'
    },
    {
      question: 'अगोदरच्या पूर्वअटींचा क्रम काय आहे आणि यामुळे अर्ज नाकारणे कसे टाळता येते?',
      answer:
        'भारतात अनेक अर्ज यासाठी नाकारले जातात कारण नागरिक मूलभूत परवाने मिळवण्यापूर्वीच पुढील मंजुरीसाठी अर्ज करतात. आमचे सिस्टीम सर्व पायऱ्या अचूक क्रमाने लावते जेणेकरून आधीची कागदपत्रे तयार झाल्यावरच पुढील मार्ग खुला होतो.'
    },
    {
      question: 'शासकीय नियमांतील बदलांचे थेट अलर्ट कसे कार्य करतात?',
      answer:
        'जेव्हा सरकारी विभाग शुल्क किंवा नियमात बदल करतात, तेव्हा दिशासाथी पूर्वी विरुद्ध नंतर असा स्पष्ट फरक दाखवून आपल्याला त्वरित सूचना देते आणि आपला रोडमॅप अद्यतनित करते.'
    },
    {
      question: 'मी पीडीएफ ब्लूप्रिंट डाउनलोड करू शकतो का आणि एआई ची मदत घेऊ शकतो का?',
      answer:
        'होय! आपण एका क्लिकवर संपूर्ण रोडमॅप पीडीएफ स्वरूपात डाउनलोड करू शकता आणि कोणत्याही पायरीवर इंग्रजी, मराठी किंवा हिंदीमध्ये एआई सहकाऱ्याची मदत घेऊ शकता.'
    },
    {
      question: 'दिशासाथी नागरिकांसाठी पूर्णपणे मोफत आहे का?',
      answer:
        'होय, 100% मोफत! दिशासाथी भारतीय नागरिकांसाठी दलाल आणि विलंब टाळण्यासाठी बनवलेली एक खुली आणि मोफत नागरी सेवा आहे.'
    }
  ]
};

export const CivicFAQSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const { language, t } = useLanguage();
  const currentFaqs = FAQ_DATA[language] || FAQ_DATA.en;

  const toggleAccordion = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-14 sm:py-24 bg-white relative overflow-hidden border-b border-[#E5EAE7]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-left mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-4xl lg:text-[2.5rem] font-extrabold text-[#0D1F1A] tracking-tight">
            {t.faqTitle}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[#5A6D64]">
            {t.faqSubtitle}
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3 sm:space-y-4">
          {currentFaqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'border-[#1B4D3E]/40 bg-[#FAFCF9] shadow-xs'
                    : 'border-[#E0EBE4] bg-white hover:border-[#CBD5E1]'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(idx)}
                  className="w-full text-left px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-3 sm:gap-4 cursor-pointer focus:outline-hidden"
                >
                  <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
                    <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#EAF2ED] text-[#1B4D3E] font-bold text-[10px] sm:text-xs flex items-center justify-center shrink-0">
                      0{idx + 1}
                    </span>
                    <span className="font-extrabold text-xs sm:text-sm md:text-base text-[#0D1F1A] leading-snug">
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-[#1B4D3E] transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-1 text-xs sm:text-sm text-[#4A5D54] leading-relaxed border-t border-[#EDF2EE] pl-10 sm:pl-16">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
