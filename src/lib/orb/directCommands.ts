import { t } from "./i18n";
import type { AssistantLanguage, AssistantResponse } from "./types";
import { normalizeText } from "./textUtils";

function hasWord(text: string, word: string): boolean {
  return text.split(" ").includes(word);
}

function hasAnyToken(text: string, tokens: string[]): boolean {
  return tokens.some((token) => hasWord(text, token));
}

function hasAnyWord(text: string, words: string[]): boolean {
  return hasAnyToken(text, words);
}

function hasAnyPhrase(text: string, phrases: string[]): boolean {
  return phrases.some((phrase) => text.includes(phrase));
}

function hasAnyPattern(text: string, patterns: RegExp[]): boolean {
  return patterns.some((pattern) => pattern.test(text));
}

function isLikelyQuestion(text: string): boolean {
  return (
    hasAnyWord(text, ["what", "which", "who", "how", "why", "best"]) ||
    hasAnyPhrase(text, [
      "can you",
      "could you",
      "would you",
      "tell me about",
      "do you",
      "is there",
    ])
  );
}

function hasExplicitNavigationVerb(text: string): boolean {
  return hasAnyPattern(text, [
    /\b(go|jump|take|scroll|open|view|navigate|return|back|show)\b/,
  ]);
}

function buildResponse(
  answer: string,
  confidence: number,
  actions: AssistantResponse["actions"],
  suggestions: string[],
  language: AssistantLanguage,
): AssistantResponse {
  return {
    answer,
    language,
    confidence,
    matchedChunks: [],
    actions,
    suggestions,
  };
}

function localizedAnswer(
  language: AssistantLanguage,
  answers: Record<AssistantLanguage, string>,
): string {
  return answers[language] ?? answers.en;
}

export function detectDirectCommand(
  input: string,
  language: AssistantLanguage = "en",
): AssistantResponse | null {
  const text = normalizeText(input);
  if (!text) return null;
  const l = t(language);
  const allowNavigationShortcut =
    !isLikelyQuestion(text) || hasExplicitNavigationVerb(text);

  if (
    hasAnyWord(text, ["years", "experience", "seniority", "tenure"]) ||
    hasAnyPhrase(text, [
      "how many years",
      "years of experience",
      "how experienced are you",
      "what is your experience level",
    ])
  ) {
    return buildResponse(
      localizedAnswer(language, {
        en: "I am a Senior Full Stack Software Engineer with 8+ years of hands-on experience shipping production systems across regulated fintech, digital assets, trade finance, and media environments.",
        ar: "أنا مهندس برمجيات Full Stack أول بخبرة عملية تزيد عن 8 سنوات في بناء أنظمة إنتاجية ضمن بيئات fintech المنظمة والأصول الرقمية والتمويل التجاري والإعلام.",
        fr: "Je suis Ingénieur Full Stack Senior avec plus de 8 ans d'expérience pratique dans la livraison de systèmes de production dans la fintech réglementée, les actifs numériques, le trade finance et les environnements médias.",
      }),
      0.99,
      [
        { type: "scroll", targetId: "about" },
        { type: "highlight", targetId: "about", durationMs: 1600 },
      ],
      [
        localizedAnswer(language, {
          en: "What are your strongest domains?",
          ar: "ما هي أقوى مجالات خبرتك؟",
          fr: "Quels sont vos domaines les plus forts ?",
        }),
        localizedAnswer(language, {
          en: "Tell me about your fintech experience",
          ar: "أخبرني عن خبرتك في التكنولوجيا المالية",
          fr: "Parlez-moi de votre expérience en fintech",
        }),
        l.suggestions.showProjects,
      ],
      language,
    );
  }

  if (
    hasAnyPhrase(text, [
      "best programming language",
      "strongest programming language",
      "primary programming language",
      "main programming language",
      "best language",
      "strongest language",
      "favorite programming language",
      "top programming language",
    ]) ||
    (hasAnyWord(text, ["programming", "language", "languages"]) &&
      hasAnyWord(text, ["best", "strongest", "primary", "main", "top"]))
  ) {
    return buildResponse(
      localizedAnswer(language, {
        en: "If I had to pick one, TypeScript is my strongest day-to-day programming language for production web platforms. I also work heavily with JavaScript and Node.js, and I use Python and Go where they are the best fit.",
        ar: "إذا كان علي اختيار لغة واحدة، فـ TypeScript هي أقوى لغة برمجة أستخدمها يوميًا في بناء منصات الويب الإنتاجية. كما أستخدم JavaScript و Node.js بشكل كبير، وأستخدم Python و Go عندما تكون الأنسب للمهمة.",
        fr: "Si je dois en choisir une, TypeScript est mon langage de programmation le plus fort au quotidien pour les plateformes web en production. J'utilise aussi beaucoup JavaScript et Node.js, et j'utilise Python et Go quand ce sont les meilleurs choix.",
      }),
      0.97,
      [
        { type: "scroll", targetId: "stack" },
        { type: "highlight", targetId: "stack", durationMs: 1600 },
      ],
      [
        localizedAnswer(language, {
          en: "What backend experience is listed?",
          ar: "ما خبرات الباك إند المذكورة؟",
          fr: "Quelle expérience backend est listée ?",
        }),
        localizedAnswer(language, {
          en: "Tell me about your strongest domains",
          ar: "أخبرني عن أقوى مجالات خبرتك",
          fr: "Parlez-moi de vos domaines les plus forts",
        }),
        l.suggestions.showProjects,
      ],
      language,
    );
  }

  if (
    hasAnyWord(text, [
      "domain",
      "domains",
      "specialty",
      "specialties",
      "strength",
      "strengths",
      "expertise",
    ]) ||
    hasAnyPhrase(text, [
      "strongest domains",
      "core strengths",
      "what are you strongest at",
      "what are your specialties",
      "where do you have the most experience",
    ])
  ) {
    return buildResponse(
      localizedAnswer(language, {
        en: "My strongest domains are regulated fintech and institutional digital assets, full-stack React/Next.js platform ownership, Node.js API integration, MongoDB data layer design and optimization, compliance-focused workflows such as KYC/KYB, and internal operations/trading support systems.",
        ar: "أقوى مجالاتي تشمل fintech المنظمة والأصول الرقمية المؤسسية، وامتلاك منصات React/Next.js من البداية إلى النهاية، وتكامل واجهات Node.js، وتصميم وتحسين طبقة بيانات MongoDB، وسير عمل الامتثال مثل KYC/KYB، وأنظمة دعم العمليات والتداول.",
        fr: "Mes domaines les plus solides sont la fintech réglementée et les actifs numériques institutionnels, l'ownership complet de plateformes React/Next.js, l'intégration d'API Node.js, la conception et l'optimisation de la couche de données MongoDB, les workflows de conformité KYC/KYB, ainsi que les systèmes internes d'opérations et de trading.",
      }),
      0.98,
      [
        { type: "scroll", targetId: "about" },
        { type: "highlight", targetId: "about", durationMs: 1600 },
      ],
      [
        localizedAnswer(language, {
          en: "Tell me about your experience",
          ar: "أخبرني عن خبرتك",
          fr: "Parlez-moi de votre expérience",
        }),
        l.suggestions.workAuthorization,
        l.suggestions.showProjects,
      ],
      language,
    );
  }

  if (
    hasAnyWord(text, [
      "visa",
      "authorization",
      "authorized",
      "citizen",
      "resident",
    ]) ||
    hasAnyPhrase(text, [
      "do you need a visa",
      "work authorization",
      "eligible to work",
      "can you work in the us",
      "can you work in hong kong",
      "can you work in egypt",
    ])
  ) {
    return buildResponse(
      localizedAnswer(language, {
        en: "I do not need a visa to work in the United States because I am a U.S. citizen, I do not need a visa to work in Hong Kong because I am a Hong Kong permanent resident, and I do not need a visa to work in Egypt because I am an Egyptian citizen.",
        ar: "لا أحتاج إلى تأشيرة للعمل في الولايات المتحدة لأنني مواطن أمريكي، ولا أحتاج إلى تأشيرة للعمل في هونغ كونغ لأنني مقيم دائم في هونغ كونغ، ولا أحتاج إلى تأشيرة للعمل في مصر لأنني مواطن مصري.",
        fr: "Je n'ai pas besoin de visa pour travailler aux États-Unis car je suis citoyen américain, je n'ai pas besoin de visa pour travailler à Hong Kong car je suis résident permanent de Hong Kong, et je n'ai pas besoin de visa pour travailler en Égypte car je suis citoyen égyptien.",
      }),
      0.99,
      [{ type: "scroll", targetId: "about" }],
      [
        localizedAnswer(language, {
          en: "Tell me about your experience",
          ar: "أخبرني عن خبرتك",
          fr: "Parlez-moi de votre expérience",
        }),
        l.suggestions.showProjects,
        l.suggestions.contact,
      ],
      language,
    );
  }

  const wantsNavigation = hasAnyPattern(text, [
    /\b(go|jump|take|scroll|open|show|view)\b.*\b(contact|email|reach|hire)\b/,
    /\b(go|jump|take|scroll|open|show|view)\b.*\b(project|projects|portfolio|work)\b/,
    /\b(go|jump|take|scroll|open|show|view)\b.*\b(experience|background|career|history)\b/,
    /\b(go|jump|take|scroll|open|show|view)\b.*\b(skill|skills|stack|technology|technologies|tools)\b/,
  ]);

  if (
    allowNavigationShortcut &&
    (wantsNavigation ||
      hasAnyWord(text, ["contact", "email", "reach", "hire"]) ||
      hasAnyPhrase(text, [
        "get in touch",
        "contact me",
        "reach out",
        "find me",
      ]))
  ) {
    return buildResponse(
      localizedAnswer(language, {
        en: "Taking you to the contact section.",
        ar: "سأنتقل بك إلى قسم التواصل.",
        fr: "Je vous emmène vers la section contact.",
      }),
      0.95,
      [
        { type: "scroll", targetId: "contact" },
        { type: "highlight", targetId: "contact", durationMs: 1600 },
      ],
      [
        l.suggestions.showProjects,
        localizedAnswer(language, {
          en: "Tell me about your experience",
          ar: "أخبرني عن خبرتك",
          fr: "Parlez-moi de votre expérience",
        }),
        l.suggestions.contact,
      ],
      language,
    );
  }

  if (
    allowNavigationShortcut &&
    (hasAnyWord(text, ["project", "projects", "portfolio", "work", "builds"]) ||
      hasAnyPhrase(text, [
        "show projects",
        "view projects",
        "what have you built",
        "best work",
      ]))
  ) {
    return buildResponse(
      localizedAnswer(language, {
        en: "Jumping to featured projects.",
        ar: "سأنتقل بك إلى المشاريع المميزة.",
        fr: "Je vous amène vers les projets phares.",
      }),
      0.93,
      [
        { type: "scroll", targetId: "work" },
        { type: "highlight", targetId: "work", durationMs: 1600 },
      ],
      [
        localizedAnswer(language, {
          en: "Tell me about your experience",
          ar: "أخبرني عن خبرتك",
          fr: "Parlez-moi de votre expérience",
        }),
        localizedAnswer(language, {
          en: "What skills do you use?",
          ar: "ما المهارات التي تستخدمها؟",
          fr: "Quelles compétences utilisez-vous ?",
        }),
        l.suggestions.contact,
      ],
      language,
    );
  }

  if (
    allowNavigationShortcut &&
    (hasAnyWord(text, [
      "experience",
      "background",
      "career",
      "journey",
      "jobs",
      "roles",
    ]) ||
      hasAnyPhrase(text, [
        "work history",
        "professional experience",
        "past roles",
        "where have you worked",
      ]))
  ) {
    return buildResponse(
      localizedAnswer(language, {
        en: "Taking you to the experience section.",
        ar: "سأنتقل بك إلى قسم الخبرة.",
        fr: "Je vous emmène vers la section expérience.",
      }),
      0.92,
      [
        { type: "scroll", targetId: "experience" },
        { type: "highlight", targetId: "experience", durationMs: 1600 },
      ],
      [
        l.suggestions.showProjects,
        localizedAnswer(language, {
          en: "What skills do you use?",
          ar: "ما المهارات التي تستخدمها؟",
          fr: "Quelles compétences utilisez-vous ?",
        }),
        l.suggestions.contact,
      ],
      language,
    );
  }

  if (
    allowNavigationShortcut &&
    (hasAnyWord(text, [
      "skills",
      "skill",
      "stack",
      "technology",
      "technologies",
      "tools",
    ]) ||
      hasAnyPhrase(text, [
        "what do you know",
        "what tech do you use",
        "your stack",
      ]))
  ) {
    return buildResponse(
      localizedAnswer(language, {
        en: "Opening the skills and tech stack section.",
        ar: "سأفتح قسم المهارات والتقنيات.",
        fr: "J'ouvre la section compétences et stack technique.",
      }),
      0.9,
      [
        { type: "scroll", targetId: "stack" },
        { type: "highlight", targetId: "stack", durationMs: 1600 },
      ],
      [
        l.suggestions.showProjects,
        localizedAnswer(language, {
          en: "Tell me about your experience",
          ar: "أخبرني عن خبرتك",
          fr: "Parlez-moi de votre expérience",
        }),
        l.suggestions.contact,
      ],
      language,
    );
  }

  if (
    allowNavigationShortcut &&
    (hasAnyWord(text, ["about", "profile", "bio", "who", "intro"]) ||
      hasAnyPhrase(text, [
        "about you",
        "your profile",
        "who are you",
        "tell me about yourself",
      ]))
  ) {
    return buildResponse(
      localizedAnswer(language, {
        en: "Taking you to the profile overview section.",
        ar: "سأنتقل بك إلى قسم نبذة الملف الشخصي.",
        fr: "Je vous emmène vers la section aperçu du profil.",
      }),
      0.9,
      [
        { type: "scroll", targetId: "about" },
        { type: "highlight", targetId: "about", durationMs: 1600 },
      ],
      [
        localizedAnswer(language, {
          en: "Show my experience",
          ar: "اعرض خبرتي",
          fr: "Afficher mon expérience",
        }),
        l.suggestions.showProjects,
        l.suggestions.contact,
      ],
      language,
    );
  }

  if (
    allowNavigationShortcut &&
    (hasAnyWord(text, ["top", "hero", "home", "start", "beginning"]) ||
      hasAnyPhrase(text, ["go to top", "back to top", "go home", "back home"]))
  ) {
    return buildResponse(
      localizedAnswer(language, {
        en: "Returning to the top of the page.",
        ar: "سأعود بك إلى أعلى الصفحة.",
        fr: "Je retourne en haut de la page.",
      }),
      0.9,
      [
        { type: "scroll", targetId: "home" },
        { type: "highlight", targetId: "home", durationMs: 1400 },
      ],
      [
        l.suggestions.showProjects,
        localizedAnswer(language, {
          en: "Tell me about your experience",
          ar: "أخبرني عن خبرتك",
          fr: "Parlez-moi de votre expérience",
        }),
        l.suggestions.contact,
      ],
      language,
    );
  }

  if (
    allowNavigationShortcut &&
    (hasAnyWord(text, ["resume", "cv", "curriculum"]) ||
      hasAnyPhrase(text, ["download resume", "view resume", "open resume"]))
  ) {
    return buildResponse(
      localizedAnswer(language, {
        en: "Opening the resume.",
        ar: "سأفتح السيرة الذاتية.",
        fr: "J'ouvre le CV.",
      }),
      0.94,
      [{ type: "download", href: "/resume.pdf", filename: "Yaser-Resume.pdf" }],
      [
        l.suggestions.showProjects,
        localizedAnswer(language, {
          en: "Tell me about your experience",
          ar: "أخبرني عن خبرتك",
          fr: "Parlez-moi de votre expérience",
        }),
        l.suggestions.contact,
      ],
      language,
    );
  }

  return null;
}
