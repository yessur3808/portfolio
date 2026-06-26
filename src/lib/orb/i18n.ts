import type { AssistantLanguage } from "./types";

type UiLocale = {
  confidenceHigh: string;
  confidenceModerate: string;
  confidenceLow: string;
  sectionProjects: string;
  sectionExperience: string;
  sectionSkills: string;
  sectionCapabilities: string;
  sectionContact: string;
  sectionResume: string;
  sectionProfile: string;
  singleMatch: string;
  multiMatch: string;
  fallbackNotEnough: string;
  fallbackGeneric: string;
  inputFallback: string;
  engineErrorFallback: string;
  suggestions: {
    showProjects: string;
    skillsListed: string;
    contact: string;
    projectsTech: string;
    showSkills: string;
    backendExperience: string;
    openContact: string;
    contactHow: string;
    workAuthorization: string;
    downloadResume: string;
    showFeaturedWork: string;
    whatBuilt: string;
    moreExperience: string;
    mostRecentRole: string;
  };
};

const locales: Record<AssistantLanguage, UiLocale> = {
  en: {
    confidenceHigh: "high confidence",
    confidenceModerate: "moderate confidence",
    confidenceLow: "tentative confidence",
    sectionProjects: "projects",
    sectionExperience: "experience",
    sectionSkills: "skills",
    sectionCapabilities: "capabilities",
    sectionContact: "contact",
    sectionResume: "resume",
    sectionProfile: "profile",
    singleMatch:
      'I found a {{confidence}} match in the {{section}} section for "{{query}}". {{body}}',
    multiMatch:
      'I found a few relevant portfolio matches for "{{query}}". {{body}}',
    fallbackNotEnough:
      'I could not find enough information in the portfolio data to answer "{{query}}" confidently. Try asking about projects, experience, skills, contact details, or the resume.',
    fallbackGeneric:
      "I couldn't find a strong match for that yet. Try asking about projects, experience, skills, contact details, or the resume.",
    inputFallback:
      "Please type a question to get started. You can ask about projects, skills, experience, contact details, or resume.",
    engineErrorFallback:
      "I ran into a temporary issue while searching the portfolio data. Please try again in a moment.",
    suggestions: {
      showProjects: "Show projects",
      skillsListed: "What skills are listed?",
      contact: "How can I contact you?",
      projectsTech: "What technologies were used?",
      showSkills: "Show skills",
      backendExperience: "What backend experience is listed?",
      openContact: "Open contact details",
      contactHow: "Show me how to get in touch",
      workAuthorization: "What is your work authorization status?",
      downloadResume: "Download the resume",
      showFeaturedWork: "Show featured work",
      whatBuilt: "What did you build there?",
      moreExperience: "Tell me more about your experience",
      mostRecentRole: "Which role is most recent?",
    },
  },
  ar: {
    confidenceHigh: "بثقة عالية",
    confidenceModerate: "بثقة متوسطة",
    confidenceLow: "بثقة مبدئية",
    sectionProjects: "المشاريع",
    sectionExperience: "الخبرة",
    sectionSkills: "المهارات",
    sectionCapabilities: "القدرات",
    sectionContact: "التواصل",
    sectionResume: "السيرة الذاتية",
    sectionProfile: "الملف الشخصي",
    singleMatch:
      'وجدت تطابقا {{confidence}} في قسم {{section}} لسؤالك "{{query}}". {{body}}',
    multiMatch:
      'وجدت عدة نتائج مناسبة من معلومات البورتفوليو لسؤالك "{{query}}". {{body}}',
    fallbackNotEnough:
      'لم أجد معلومات كافية في بيانات البورتفوليو للإجابة عن "{{query}}" بثقة. جرّب السؤال عن المشاريع أو الخبرة أو المهارات أو التواصل أو السيرة الذاتية.',
    fallbackGeneric:
      "لم أجد تطابقا قويا لهذا السؤال بعد. يمكنك السؤال عن المشاريع أو الخبرة أو المهارات أو التواصل أو السيرة الذاتية.",
    inputFallback:
      "اكتب سؤالك للبدء. يمكنك السؤال عن المشاريع أو المهارات أو الخبرة أو التواصل أو السيرة الذاتية.",
    engineErrorFallback:
      "حدثت مشكلة مؤقتة أثناء البحث في بيانات البورتفوليو. حاول مرة أخرى بعد قليل.",
    suggestions: {
      showProjects: "اعرض المشاريع",
      skillsListed: "ما المهارات المذكورة؟",
      contact: "كيف يمكن التواصل معك؟",
      projectsTech: "ما التقنيات المستخدمة؟",
      showSkills: "اعرض المهارات",
      backendExperience: "ما خبرات الباك إند المذكورة؟",
      openContact: "افتح معلومات التواصل",
      contactHow: "اعرض طرق التواصل",
      workAuthorization: "ما حالة تصريح العمل لديك؟",
      downloadResume: "حمّل السيرة الذاتية",
      showFeaturedWork: "اعرض أبرز الأعمال",
      whatBuilt: "ماذا بنيت هناك؟",
      moreExperience: "أخبرني أكثر عن خبرتك",
      mostRecentRole: "ما أحدث منصب لديك؟",
    },
  },
  fr: {
    confidenceHigh: "avec une grande confiance",
    confidenceModerate: "avec une confiance modérée",
    confidenceLow: "avec une confiance préliminaire",
    sectionProjects: "projets",
    sectionExperience: "expérience",
    sectionSkills: "compétences",
    sectionCapabilities: "capacités",
    sectionContact: "contact",
    sectionResume: "CV",
    sectionProfile: "profil",
    singleMatch:
      'J\'ai trouvé une correspondance {{confidence}} dans la section {{section}} pour "{{query}}". {{body}}',
    multiMatch:
      'J\'ai trouvé plusieurs éléments pertinents du portfolio pour "{{query}}". {{body}}',
    fallbackNotEnough:
      "Je n'ai pas trouvé assez d'informations dans les données du portfolio pour répondre à \"{{query}}\" avec confiance. Essayez de demander les projets, l'expérience, les compétences, le contact ou le CV.",
    fallbackGeneric:
      "Je n'ai pas encore trouvé de correspondance forte pour cela. Essayez de demander les projets, l'expérience, les compétences, le contact ou le CV.",
    inputFallback:
      "Saisissez une question pour commencer. Vous pouvez demander des informations sur les projets, compétences, expérience, contact ou CV.",
    engineErrorFallback:
      "J'ai rencontré un problème temporaire lors de la recherche dans les données du portfolio. Veuillez réessayer dans un instant.",
    suggestions: {
      showProjects: "Afficher les projets",
      skillsListed: "Quelles compétences sont listées ?",
      contact: "Comment puis-je vous contacter ?",
      projectsTech: "Quelles technologies ont été utilisées ?",
      showSkills: "Afficher les compétences",
      backendExperience: "Quelle expérience backend est listée ?",
      openContact: "Ouvrir les informations de contact",
      contactHow: "Montrer comment vous contacter",
      workAuthorization: "Quel est votre statut d'autorisation de travail ?",
      downloadResume: "Télécharger le CV",
      showFeaturedWork: "Afficher les travaux phares",
      whatBuilt: "Qu'avez-vous construit là-bas ?",
      moreExperience: "Parlez-moi davantage de votre expérience",
      mostRecentRole: "Quel est le poste le plus récent ?",
    },
  },
};

export function t(language: AssistantLanguage): UiLocale {
  return locales[language] ?? locales.en;
}

export function interpolate(
  template: string,
  values: Record<string, string>,
): string {
  return Object.entries(values).reduce(
    (out, [key, value]) => out.replaceAll(`{{${key}}}`, value),
    template,
  );
}
