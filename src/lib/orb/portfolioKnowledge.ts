import { siteConfig, socialLinks } from "@/app/(site)/_data/site";
import { caseStudies } from "@/src/data/caseStudies";
import { experienceItems } from "@/src/data/experience";
import { getAllProjects } from "@/src/data/projects";
import { skillGroups } from "@/src/data/skills";
import type { KnowledgeChunk } from "./types";

const MULTILINGUAL_TAG_SYNONYMS: Record<string, string[]> = {
  projects: ["project", "projets", "projet", "مشاريع", "مشروع"],
  project: ["projects", "projets", "projet", "مشاريع", "مشروع"],
  work: ["travail", "projets", "عمل", "أعمال"],
  experience: ["experiences", "expérience", "خبرة", "خبرات"],
  skills: ["skill", "compétences", "compétence", "مهارات", "مهارة"],
  skill: ["skills", "compétences", "compétence", "مهارات", "مهارة"],
  profile: ["profil", "الملف الشخصي", "نبذة"],
  overview: ["aperçu", "résumé", "نظرة عامة", "ملخص"],
  contact: ["contacts", "coordonnées", "تواصل", "اتصال"],
  resume: ["cv", "curriculum vitae", "السيرة الذاتية"],
  cv: ["resume", "curriculum vitae", "السيرة الذاتية"],
  technologies: ["technology", "tech", "technologie", "technologies", "تقنيات"],
  tech: ["technology", "technologie", "technologies", "تقنيات"],
  frontend: ["front-end", "واجهة أمامية", "الواجهة الأمامية"],
  backend: ["back-end", "arrière-end", "خلفية", "الواجهة الخلفية"],
  "full stack": ["fullstack", "développement complet", "فل ستاك"],
  "full-stack": ["full stack", "fullstack", "فل ستاك"],
  fintech: [
    "financial technology",
    "technologie financière",
    "التكنولوجيا المالية",
  ],
  "digital assets": ["actifs numériques", "أصول رقمية"],
  compliance: ["conformité", "امتثال"],
  kyc: ["know your customer", "connaissance du client", "اعرف عميلك"],
  kyb: ["know your business", "connaissance entreprise", "اعرف نشاطك"],
  visa: ["work authorization", "autorisation de travail", "تأشيرة"],
  "work authorization": ["visa", "autorisation de travail", "تصريح عمل"],
  "eligible to work": ["work eligible", "admissible au travail", "مؤهل للعمل"],
  "work eligibility": [
    "eligibility to work",
    "éligibilité au travail",
    "الأهلية للعمل",
  ],
  "right to work": ["droit au travail", "حق العمل", "مصرح بالعمل"],
  "authorized to work": ["autorisé à travailler", "مصرح له بالعمل"],
  sponsorship: ["visa sponsorship", "parrainage", "رعاية", "كفالة"],
  "visa sponsorship": [
    "sponsorship",
    "parrainage de visa",
    "رعاية التأشيرة",
    "كفالة التأشيرة",
  ],
  "no sponsorship": [
    "no visa sponsorship",
    "sans parrainage",
    "بدون رعاية",
    "لا يحتاج رعاية",
  ],
  relocation: [
    "relocate",
    "mobilité internationale",
    "انتقال",
    "الانتقال للعمل",
  ],
  availability: ["immediate availability", "disponibilité", "التوفر"],
  "immediately available": [
    "available now",
    "disponible immédiatement",
    "متاح فورا",
    "متاح حالا",
  ],
  "domain ownership": ["ownership", "propriété de domaine", "ملكية المجال"],
  ownership: ["propriété", "ownership", "ملكية", "تملك"],
  "technical ownership": [
    "propriété technique",
    "ownership technique",
    "ملكية تقنية",
  ],
  "project ownership": [
    "propriété du projet",
    "ownership du projet",
    "ملكية المشروع",
  ],
  "end-to-end ownership": [
    "ownership de bout en bout",
    "ملكية كاملة",
    "ملكية من البداية للنهاية",
  ],
  leadership: ["lead", "direction", "قيادة"],
  "technical leadership": ["leadership technique", "قيادة تقنية"],
  "team leadership": ["leadership d'équipe", "قيادة الفريق"],
  "cross-functional leadership": [
    "leadership transversal",
    "قيادة متعددة التخصصات",
  ],
  "stakeholder management": [
    "gestion des parties prenantes",
    "إدارة أصحاب المصلحة",
  ],
  "hiring manager": ["recruiter", "responsable recrutement", "مدير التوظيف"],
  recruiter: ["recruitment", "recruteur", "مسؤول توظيف", "توظيف"],
  "senior engineer": ["ingénieur senior", "مهندس أول"],
  "staff engineer": ["ingénieur staff", "مهندس خبير"],
  "trading operations": ["opérations de trading", "عمليات التداول"],
  "data visualization": ["visualisation de données", "تصور البيانات"],
  "machine learning": ["apprentissage automatique", "تعلم الآلة"],
  custody: ["garde", "conservation", "حفظ الأصول", "حفظ"],
  "institutional custody": ["garde institutionnelle", "حفظ مؤسسي"],
  whitelisting: ["liste blanche", "allowlist", "القائمة البيضاء"],
  "travel rule": ["règle de voyage", "قاعدة السفر"],
  "address book": ["carnet d'adresses", "دفتر العناوين"],
  "counterparty book": ["registre des contreparties", "سجل الأطراف المقابلة"],
  staking: ["jalonnement", "staking crypto", "التخزين", "التحصيص"],
  unstaking: [
    "déjalonnement",
    "retirer le staking",
    "فك التخزين",
    "إلغاء التحصيص",
  ],
  "rest api gateway": ["passerelle api rest", "بوابة واجهة برمجة التطبيقات"],
  "api documentation": ["documentation api", "توثيق واجهات البرمجة"],
  openapi: ["spécification openapi", "مواصفة openapi"],
  gitbook: ["documentation gitbook", "توثيق gitbook"],
  "editorial engineering": ["ingénierie éditoriale", "هندسة تحريرية"],
  editorial: ["rédaction", "تحريري", "هيئة التحرير"],
  newsroom: ["salle de rédaction", "غرفة الأخبار"],
  infographics: ["infographies", "رسوم معلوماتية", "إنفوجرافيك"],
  "chart generator": ["générateur de graphiques", "مولد الرسوم البيانية"],
  "interactive maps": ["cartes interactives", "خرائط تفاعلية"],
  "data pipelines": ["pipelines de données", "خطوط أنابيب البيانات"],
  logistics: ["logistique", "الخدمات اللوجستية", "لوجستيات"],
  shipping: ["expédition", "الشحن"],
  "shipping logistics": ["logistique d'expédition", "لوجستيات الشحن"],
  onboarding: ["intégration", "تهيئة", "ضم العملاء"],
  "workflow automation": ["automatisation des workflows", "أتمتة سير العمل"],
  rpa: ["automatisation robotisée des processus", "الأتمتة الروبوتية للعمليات"],
  "query optimization": ["optimisation des requêtes", "تحسين الاستعلامات"],
  "schema design": ["conception de schéma", "تصميم المخطط"],
  "ci/cd": [
    "intégration continue",
    "déploiement continu",
    "التكامل المستمر",
    "النشر المستمر",
  ],
  mentoring: ["encadrement", "mentorat", "إرشاد", "توجيه"],
  governance: ["gouvernance", "حوكمة"],
  "cross-chain bridging": ["pont inter-chaînes", "ربط عبر السلاسل"],
  "digital wallet": ["portefeuille numérique", "محفظة رقمية"],
  "trade finance": ["finance commerciale", "تمويل التجارة"],
  tradefi: ["finance commerciale", "تريد فاي", "تمويل تجاري"],
  "hex trust": ["هيكس تراست"],
  "crypto.com": ["كريبتو دوت كوم"],
  scmp: ["south china morning post", "ساوث تشاينا مورنينغ بوست"],
  "ai link group": ["ai link", "أي آي لينك", "ai لينك"],
  polyasia: ["بولي آسيا"],
  "creative coding hk": ["البرمجة الإبداعية هونغ كونغ"],
  "hong kong": ["hong-kong", "هونغ كونغ"],
  uae: ["émirats arabes unis", "الإمارات", "الإمارات العربية المتحدة"],
  eu: ["union européenne", "الاتحاد الأوروبي"],
};

const normalizeTagKey = (value: string): string => {
  return value
    .trim()
    .toLowerCase()
    .replace(/[\-_/.,:;()\[\]{}]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const getMultilingualTagVariants = (tag: string): string[] => {
  const rawKey = tag.trim().toLowerCase();
  const normalizedKey = normalizeTagKey(tag);
  const direct = MULTILINGUAL_TAG_SYNONYMS[rawKey] ?? [];
  const normalized = MULTILINGUAL_TAG_SYNONYMS[normalizedKey] ?? [];
  return Array.from(new Set([tag, ...direct, ...normalized]));
};

const makeTags = (...values: Array<string | undefined>): string[] => {
  return Array.from(
    new Set(
      values
        .flatMap((value) => (value ? getMultilingualTagVariants(value) : []))
        .map((value) => value.trim())
        .filter(Boolean),
    ),
  )
    .map((value) => value.trim())
    .filter(Boolean);
};

const projectChunks = (): KnowledgeChunk[] => {
  return getAllProjects().map((project) => ({
    id: `project:${project.slug}`,
    title: project.title,
    content: [
      project.summary,
      project.description,
      `Impact: ${project.impact}`,
      project.company ? `Company: ${project.company}` : null,
      project.period ? `Period: ${project.period}` : null,
      `Technologies: ${project.technologies.join(", ")}`,
      `Themes: ${project.themes.join(", ")}`,
    ]
      .filter((part): part is string => Boolean(part))
      .join(" "),
    sectionId: "work",
    type: "project",
    tags: makeTags(
      "projects",
      "work",
      project.slug,
      project.company,
      ...project.technologies,
      ...project.themes,
    ),
    relatedActions: project.links.demo
      ? [{ type: "open", href: project.links.demo, newTab: true }]
      : [],
  }));
};

const experienceChunks = (): KnowledgeChunk[] => {
  return experienceItems.map((item) => ({
    id: `experience:${item.company.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    title: `${item.role} at ${item.company}`,
    content: [
      item.summary,
      `Location: ${item.location}`,
      `Period: ${item.period}`,
      `Highlights: ${item.highlights.join(" ")}`,
      `Technologies: ${item.technologies.join(", ")}`,
    ].join(" "),
    sectionId: "experience",
    type: "experience",
    tags: makeTags(
      "experience",
      item.company,
      item.role,
      item.location,
      ...item.technologies,
    ),
  }));
};

const skillChunks = (): KnowledgeChunk[] => {
  return skillGroups.flatMap((group) => {
    const chunk: KnowledgeChunk = {
      id: `skills:${group.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      title: group.title,
      content: group.skills.map((skill) => skill.name).join(", "),
      sectionId: "stack",
      type: "skill",
      tags: makeTags(
        "skills",
        group.title,
        ...group.skills.map((skill) => skill.name),
      ),
    };

    return [chunk];
  });
};

const caseStudyChunks = (): KnowledgeChunk[] => {
  return caseStudies.map((study) => ({
    id: `case-study:${study.id}`,
    title: study.title,
    content: [
      study.summary,
      study.description,
      `Impact: ${study.impact}`,
      `Technologies: ${study.technologies.join(", ")}`,
      `Themes: ${study.themes.join(", ")}`,
    ].join(" "),
    sectionId: "work",
    type: "project",
    tags: makeTags("case study", ...study.technologies, ...study.themes),
  }));
};

const contactChunks = (): KnowledgeChunk[] => {
  return [
    {
      id: "contact:profile",
      title: "Contact and profile details",
      content: [
        `${siteConfig.siteName} is a portfolio for ${siteConfig.description}`,
        `Location: ${siteConfig.location}`,
        socialLinks.map((link) => `${link.label}: ${link.href}`).join(" "),
      ].join(" "),
      sectionId: "contact",
      type: "contact",
      tags: makeTags(
        "contact",
        siteConfig.location,
        ...socialLinks.map((link) => link.label),
      ),
      relatedActions: socialLinks
        .filter((link) => link.external)
        .slice(0, 2)
        .map((link) => ({ type: "open", href: link.href, newTab: true })),
    },
  ];
};

const deepExperienceChunks = (): KnowledgeChunk[] => {
  return [
    {
      id: "experience:hex-trust-overview-deep",
      title: "Hex Trust - overall scope and leadership",
      content:
        "At Hex Trust, Yaser worked across strategic products and internal platforms supporting institutional digital asset custody, transaction operations, client-facing infrastructure, compliance workflows, and trading operations. The role grew beyond implementation into technical ownership and project leadership across cross-functional initiatives with engineering, design, operations, compliance, and business stakeholders.",
      sectionId: "experience",
      type: "experience",
      tags: makeTags(
        "hex trust",
        "institutional custody",
        "digital assets",
        "technical ownership",
        "project leadership",
        "cross-functional",
      ),
    },
    {
      id: "experience:hex-trust-gryfyn-wallet",
      title: "Hex Trust - Gryfyn Wallet and Animoca Brands partnership",
      content:
        "Yaser worked on Gryfyn Wallet, built in partnership with Animoca Brands, to integrate digital asset wallet functionality into gaming ecosystems. The product supported NFT-to-crypto trading and in-game NFT utility, including titles such as MotoGP. Contributions covered frontend and backend features, including TypeScript customization of a web-based camera library and publishing both a public package and a specialized internal version in a private registry.",
      sectionId: "experience",
      type: "project",
      tags: makeTags(
        "gryfyn wallet",
        "animoca brands",
        "gaming",
        "nft",
        "motogp",
        "typescript",
        "camera library",
      ),
    },
    {
      id: "experience:hex-trust-hex-safe-2",
      title: "Hex Trust - Hex Safe 2 wallet platform",
      content:
        "Yaser worked extensively on Hex Safe 2, a custodial wallet platform for enterprise and institutional clients. Work included EVM network integration such as BNB Smart Chain and Polygon, token standards including ERC-20, ERC-721, and ERC-1155, and transaction workflow implementation for deposits, withdrawals, staking, and unstaking.",
      sectionId: "experience",
      type: "project",
      tags: makeTags(
        "hex safe 2",
        "custodial wallet",
        "evm",
        "bnb smart chain",
        "polygon",
        "erc20",
        "erc721",
        "erc1155",
        "staking",
      ),
    },
    {
      id: "experience:hex-trust-travel-rule-whitelisting",
      title:
        "Hex Trust - Address Book, Whitelisting, and Travel Rule initiative",
      content:
        "Yaser led a major multi-part initiative covering Address Book (Counterparty Book), Whitelisting, and Travel Rule across frontend and backend systems. The backend used Go, Kafka, and PostgreSQL, and the frontend used React, MUI, and TypeScript. The work covered transaction controls, KYC and KYB-linked flows, and jurisdiction-specific compliance logic for Hong Kong, Singapore, the EU, and the UAE, with architecture designed for expansion into additional regions including Middle East, Southeast Asia, and South America. Travel Rule scope affected address management, whitelisting, deposits, withdrawals, staking, unstaking, KYC, KYB, and account-level regional restrictions.",
      sectionId: "experience",
      type: "experience",
      tags: makeTags(
        "address book",
        "counterparty book",
        "whitelisting",
        "travel rule",
        "go",
        "kafka",
        "postgresql",
        "react",
        "mui",
        "typescript",
        "kyc",
        "kyb",
        "hong kong",
        "singapore",
        "eu",
        "uae",
      ),
    },
    {
      id: "experience:hex-trust-api-gateway-docs",
      title: "Hex Trust - REST API gateway and GitBook documentation",
      content:
        "Yaser led development of a REST API Gateway and client-facing GitBook documentation for external integrations. Internal services were largely JSON-RPC, so he designed a REST-compatible external gateway and also built a documentation pipeline using jq to transform and combine multiple OpenAPI YAML specs into one master OpenAPI document used to generate and maintain GitBook docs.",
      sectionId: "experience",
      type: "project",
      tags: makeTags(
        "rest api gateway",
        "json-rpc",
        "openapi",
        "gitbook",
        "jq",
        "api documentation",
      ),
    },
    {
      id: "experience:hex-trust-trading-platform",
      title: "Hex Trust - trading operations platform",
      content:
        "Yaser led a Python Streamlit trade booking, monitoring, and alerting platform for trading operations. The platform tracked ongoing, completed, and failed trades, integrated with internal systems and external exchange accounts such as Binance, surfaced stuck or failed transactions for faster intervention, and later added balance monitoring with threshold-based alerts for operational risk reduction.",
      sectionId: "experience",
      type: "project",
      tags: makeTags(
        "python",
        "streamlit",
        "trading operations",
        "alerting",
        "binance",
        "monitoring",
      ),
    },
    {
      id: "experience:hex-trust-security-identity",
      title: "Hex Trust - identity and security enhancements",
      content:
        "Yaser contributed to identity and security improvements in Hex Safe 2, including passkey customization for the deployed Keycloak version and security updates involving Argon2 encryption. This work improved authentication experience and platform security posture while fitting existing identity infrastructure constraints.",
      sectionId: "experience",
      type: "capability",
      tags: makeTags(
        "security",
        "identity",
        "passkeys",
        "keycloak",
        "argon2",
        "authentication",
      ),
    },
    {
      id: "experience:hex-trust-overall-scope-statement",
      title: "Hex Trust - overall scope statement",
      content:
        "Overall scope at Hex Trust combined full stack engineering, backend systems design, frontend product development, technical leadership, and project ownership across business-critical initiatives. Work regularly required navigating technically complex and highly regulated problem spaces where engineering decisions had to account for implementation quality, operational efficiency, client usability, and evolving regional compliance requirements.",
      sectionId: "experience",
      type: "experience",
      tags: makeTags(
        "overall scope",
        "regulated environment",
        "technical leadership",
        "project ownership",
      ),
    },
    {
      id: "experience:crypto-com-overview-deep",
      title: "Crypto.com - broad full-stack and blockchain tooling scope",
      content:
        "At Crypto.com, Yaser worked across frontend and backend product features, internal blockchain tools, and data-driven interfaces. Frontend stack included React, JavaScript, TypeScript, CSS, LESS, and Electron. Backend work included Node.js with Yarn and NPM, Python utilities, and project-dependent PostgreSQL and GraphQL usage.",
      sectionId: "experience",
      type: "experience",
      tags: makeTags(
        "crypto.com",
        "react",
        "electron",
        "node.js",
        "graphql",
        "postgresql",
        "python",
      ),
    },
    {
      id: "experience:crypto-com-product-platform",
      title: "Crypto.com - Chain DeFi wallet and Cronos tooling",
      content:
        "Yaser contributed to the Chain DeFi desktop wallet built with Electron, React, TypeScript, and Docker, and worked on the internal Cronos portal and related blockchain tools, including cross-chain bridging support for Cronos. He also contributed to main websites and shared platform features as business priorities required.",
      sectionId: "experience",
      type: "project",
      tags: makeTags(
        "chain defi wallet",
        "cronos",
        "cross-chain bridging",
        "electron",
        "docker",
      ),
    },
    {
      id: "experience:crypto-com-data-viz",
      title: "Crypto.com - high-traffic token data visualization",
      content:
        "A major contribution area was D3.js-based data visualization for crypto market and token pricing interfaces. Yaser implemented real-time token price visualizations for more than 250 cryptocurrencies in a high-traffic product using TypeScript, GraphQL, and Node.js.",
      sectionId: "experience",
      type: "project",
      tags: makeTags(
        "d3.js",
        "real-time",
        "250+ cryptocurrencies",
        "token price visualization",
        "high-traffic",
      ),
    },
    {
      id: "experience:crypto-com-testing-governance",
      title:
        "Crypto.com - governance features, testing, and cross-team support",
      content:
        "Yaser contributed to governance proposal-related functionality, internal operational tools, and quality improvements through unit, integration, and end-to-end testing with Jest and Cypress. He also supported design input, translations, knowledge sharing, and was encouraged to deepen blockchain exposure in Solidity and Rust.",
      sectionId: "experience",
      type: "capability",
      tags: makeTags(
        "governance",
        "jest",
        "cypress",
        "solidity",
        "rust",
        "cross-team collaboration",
      ),
    },
    {
      id: "experience:crypto-com-overall-scope-statement",
      title: "Crypto.com - overall scope statement",
      content:
        "At Crypto.com, the role was broad and required contribution across end-user products, internal blockchain infrastructure, analytics and visualization features, testing, and general engineering support. Beyond implementation, Yaser also contributed to UI and UX direction, translations, technical knowledge sharing, and flexible support across multiple concurrent priorities.",
      sectionId: "experience",
      type: "experience",
      tags: makeTags(
        "overall scope",
        "ui ux",
        "translations",
        "knowledge sharing",
        "multi-project",
      ),
    },
    {
      id: "experience:ai-link-overview-deep",
      title: "AI Link Group (TradeFi) - full-stack system ownership",
      content:
        "At AI Link Group, Yaser worked across onboarding, compliance, operations platforms, workflow automation, data analysis, and cloud setup. The role included frontend and backend delivery plus system design, data modeling, process improvement, stakeholder collaboration, and junior engineer support. Frontend included React, Next.js, JavaScript, TypeScript, and WordPress. Backend included Node.js, Express, MongoDB, Docker, Yarn, NPM, PM2, Python, and Power BI support.",
      sectionId: "experience",
      type: "experience",
      tags: makeTags(
        "ai link group",
        "tradefi",
        "next.js",
        "node.js",
        "express",
        "mongodb",
        "docker",
        "power bi",
      ),
    },
    {
      id: "experience:ai-link-kyc-platform",
      title: "AI Link Group - KYC and compliance platform rebuild",
      content:
        "Yaser rebuilt the KYC and compliance platform using Node.js, Express, MongoDB, and Docker, redesigning backend workflows and API support for verification and review processes. The improvements reduced verification time by about 40 percent and increased maintainability. He also led MongoDB document modeling, schema design, indexing strategy, and query optimization for production compliance workflows.",
      sectionId: "experience",
      type: "project",
      tags: makeTags(
        "kyc",
        "compliance",
        "40% reduction",
        "mongodb indexing",
        "query optimization",
      ),
    },
    {
      id: "experience:ai-link-finance-portal",
      title: "AI Link Group - internal finance portal",
      content:
        "Yaser designed and built an internal finance portal to improve visibility into applicants, submitted applications, and supporting information. The portal streamlined review workflows by aligning implementation to day-to-day finance operations and practical usability needs.",
      sectionId: "experience",
      type: "project",
      tags: makeTags(
        "internal finance portal",
        "workflow optimization",
        "stakeholder collaboration",
      ),
    },
    {
      id: "experience:ai-link-rpa-automation",
      title: "AI Link Group - RPA and workflow automation",
      content:
        "Yaser delivered automation and RPA initiatives for internal and client-related workflows, including automation for shipment slot placement and purchasing with shipping companies. These projects reduced manual effort, improved consistency, and scaled operational throughput.",
      sectionId: "experience",
      type: "project",
      tags: makeTags("rpa", "workflow automation", "shipping", "operations"),
    },
    {
      id: "experience:ai-link-client-admin-platform",
      title:
        "AI Link Group - authenticated client and admin logistics platform",
      content:
        "Yaser helped deliver a replacement React and Next.js platform with authenticated client and administrator portals for shipping, logistics, and data analysis workflows. The work focused on modernizing architecture, access control, maintainability, and long-term operational fit.",
      sectionId: "experience",
      type: "project",
      tags: makeTags(
        "authenticated portal",
        "client admin platform",
        "shipping logistics",
        "access control",
      ),
    },
    {
      id: "experience:ai-link-data-ops-azure",
      title:
        "AI Link Group - data operations, schema redesign, and Azure support",
      content:
        "Yaser supported data-heavy operations with Python and Power BI, assisted visualization and analysis work with data science stakeholders, redesigned database schema for efficiency and scalability, and helped with Azure planning and setup for HKU research team requirements.",
      sectionId: "experience",
      type: "experience",
      tags: makeTags(
        "python",
        "power bi",
        "data analysis",
        "schema redesign",
        "azure",
        "hku",
      ),
    },
    {
      id: "experience:ai-link-quality-team-support",
      title: "AI Link Group - testing, CI/CD, and team support",
      content:
        "Yaser improved CI/CD pipelines and built tests with Jest and Cypress to reduce regressions and improve release confidence. He also supported junior engineers through reviews and implementation guidance while coordinating across teams to unblock delivery and align technical work with business operations.",
      sectionId: "experience",
      type: "capability",
      tags: makeTags(
        "ci/cd",
        "jest",
        "cypress",
        "mentoring",
        "delivery quality",
      ),
    },
    {
      id: "experience:ai-link-overall-scope-statement",
      title: "AI Link Group - overall scope statement",
      content:
        "Overall scope at AI Link Group was broader than feature implementation. Yaser worked across frontend and backend systems while also owning workflow redesign, data modeling, internal platform development, process automation, and stakeholder collaboration. The environment emphasized practical and scalable engineering tightly aligned with real operational constraints.",
      sectionId: "experience",
      type: "experience",
      tags: makeTags(
        "overall scope",
        "workflow redesign",
        "operational constraints",
        "practical engineering",
      ),
    },
    {
      id: "experience:ai-link-technology-summary",
      title: "AI Link Group - technologies used",
      content:
        "Technology summary for AI Link Group work: Frontend included React, Next.js, JavaScript, TypeScript, CSS, LESS, Electron, and D3.js. Backend included Node.js, Express, GraphQL, and Python. Databases included MongoDB and PostgreSQL. Testing and delivery included Jest, Cypress, Docker, and CI/CD pipelines. Other day-to-day tools included Yarn and NPM.",
      sectionId: "experience",
      type: "capability",
      tags: makeTags(
        "technologies used",
        "react",
        "next.js",
        "node.js",
        "express",
        "graphql",
        "mongodb",
        "postgresql",
        "docker",
      ),
    },
    {
      id: "experience:scmp-overview-deep",
      title: "SCMP - editorial engineering and newsroom platform scope",
      content:
        "At South China Morning Post, Yaser worked across frontend and backend engineering to build interactive editorial products, reusable newsroom tools, data pipelines, and internal platforms for infographics, design, editorial, analytics, and engineering teams. Frontend work used JavaScript, jQuery, D3.js, and related tooling. Backend work included Node.js, Express, LoopBack.js, SQL, Python, WebSockets, and JSON-based workflows.",
      sectionId: "experience",
      type: "experience",
      tags: makeTags(
        "scmp",
        "newsroom tools",
        "infographics",
        "d3.js",
        "loopback",
        "websockets",
      ),
    },
    {
      id: "experience:scmp-infographics-templates",
      title: "SCMP - interactive infographics and reusable templates",
      content:
        "Yaser built public-facing interactive infographics and data visualizations for high-traffic editorial content, then created reusable templates so design teams could publish visual stories faster without one-off engineering support each time.",
      sectionId: "experience",
      type: "project",
      tags: makeTags(
        "interactive infographics",
        "editorial storytelling",
        "reusable templates",
        "high-traffic",
      ),
    },
    {
      id: "experience:scmp-generators-embed-platform",
      title: "SCMP - chart generators and embed/widget platform",
      content:
        "Yaser built internal chart generators that consumed JSON, CSV, and Google Sheets data to produce reusable comparison charts. He also built embed and widget tooling for image comparisons, slideshows, weather widgets, storm warning modules, and interactive maps, enabling teams to create rich content with less engineering overhead.",
      sectionId: "experience",
      type: "project",
      tags: makeTags(
        "chart generator",
        "json",
        "csv",
        "google sheets",
        "widget platform",
        "interactive maps",
      ),
    },
    {
      id: "experience:scmp-design-system-covid",
      title: "SCMP - internal design system and COVID tracker workflows",
      content:
        "Yaser contributed to internal shared libraries and a newsroom-focused design system, and developed front-page support for infographics teams. He also built scripts and backend workflows for live editorial data, including the SCMP COVID-19 tracker, where data from multiple sources was collected, processed, and transformed into structured JSON for reliable team reuse.",
      sectionId: "experience",
      type: "project",
      tags: makeTags(
        "design system",
        "covid tracker",
        "live data",
        "json pipelines",
        "editorial workflows",
      ),
    },
    {
      id: "experience:scmp-backend-automation-impact",
      title: "SCMP - backend automation and cross-team impact",
      content:
        "Yaser built APIs and automation workflows with LoopBack.js, Express, Node.js, Python, SQL, JSON pipelines, and WebSockets to support both internal and public-facing systems. His work consistently focused on turning repeated newsroom pain points into reusable products with long-term operational value, and contributed to storytelling initiatives that later received gold and silver awards.",
      sectionId: "experience",
      type: "capability",
      tags: makeTags(
        "api development",
        "automation",
        "cross-team impact",
        "award-winning storytelling",
      ),
    },
    {
      id: "experience:scmp-google-tools-and-front-page",
      title: "SCMP - Google tools support and infographics front-page work",
      content:
        "Yaser wrote scripts and workflow helpers in Google Sheets and Google Docs to help researchers and reporters clean, format, and display data with less manual effort. He also developed the infographics team front page and supported internal newsroom platform digitalization through reusable workflows and structured tooling.",
      sectionId: "experience",
      type: "project",
      tags: makeTags(
        "google sheets",
        "google docs",
        "front page",
        "infographics team",
        "newsroom platform",
      ),
    },
    {
      id: "experience:scmp-overall-scope-statement",
      title: "SCMP - overall scope statement",
      content:
        "Overall scope at SCMP combined frontend engineering, backend systems development, newsroom tooling, data visualization, automation, and internal platform design. A key theme was operating across product, editorial, and engineering boundaries to improve both public storytelling output and internal workflows.",
      sectionId: "experience",
      type: "experience",
      tags: makeTags(
        "overall scope",
        "editorial engineering",
        "internal platform design",
        "automation",
      ),
    },
    {
      id: "experience:polyasia-overview",
      title: "PolyAsia - infrastructure, ERP, and cloud support",
      content:
        "At PolyAsia, Yaser worked across infrastructure support, enterprise systems, ERP customization, and cloud deployment for internal and client environments. He was promoted from trainee to associate within three months and later supported final implementation work while helping lead two colleagues.",
      sectionId: "experience",
      type: "experience",
      tags: makeTags(
        "polyasia",
        "enterprise systems",
        "erp",
        "cloud",
        "promotion",
        "team leadership",
      ),
    },
    {
      id: "experience:polyasia-network-recovery",
      title: "PolyAsia - network operations and recovery readiness",
      content:
        "Yaser handled network administration, security, diagnostics, and operational maintenance, including routing, switching, firewall setup, DNS, DHCP, SSH, SFTP, Active Directory, Group Policy, and basic Cisco VoIP exposure. He also supported backup operations, disaster recovery, and troubleshooting services.",
      sectionId: "experience",
      type: "capability",
      tags: makeTags(
        "routing",
        "switching",
        "firewalls",
        "dns",
        "dhcp",
        "active directory",
        "disaster recovery",
      ),
    },
    {
      id: "experience:polyasia-technology-summary",
      title: "PolyAsia - technologies used summary",
      content:
        "PolyAsia technology summary: Infrastructure and systems included routing, switching, firewalls, DNS, DHCP, SSH, SFTP, Active Directory, Group Policy, and Cisco VoIP exposure. Cloud and virtualization included Microsoft Azure and VMware. ERP and development included Microsoft Dynamics NAV, Microsoft Dynamics GP, CSIDE, and C#. Web and CMS work included Joomla, HTML5, PHP, and CSS3. Business tooling included Power BI, Excel, Word, PowerPoint, Outlook, and Teams.",
      sectionId: "experience",
      type: "capability",
      tags: makeTags(
        "technologies used",
        "dynamics nav",
        "dynamics gp",
        "azure",
        "vmware",
        "active directory",
        "joomla",
      ),
    },
    {
      id: "experience:polyasia-erp-and-web",
      title: "PolyAsia - Dynamics customization and web support",
      content:
        "Yaser customized Microsoft Dynamics NAV and GP using CSIDE and C#, supported Azure deployment and VMware-related environments, and also maintained company web properties using Joomla, HTML5, PHP, and CSS3 alongside everyday use of business tooling such as Power BI, Excel, Word, PowerPoint, Outlook, and Teams.",
      sectionId: "experience",
      type: "experience",
      tags: makeTags(
        "microsoft dynamics nav",
        "microsoft dynamics gp",
        "c#",
        "cside",
        "azure",
        "vmware",
        "joomla",
      ),
    },
    {
      id: "experience:creative-coding-hk",
      title: "Creative Coding HK - STEM teaching support",
      content:
        "Yaser worked part-time for two to three weeks teaching children aged 5 to 12 coding, robotics, math, and science fundamentals using tools such as mBot, Edison, and Arduino, alongside other instructors.",
      sectionId: "experience",
      type: "experience",
      tags: makeTags(
        "creative coding hk",
        "teaching",
        "robotics",
        "arduino",
        "mbot",
        "edison",
      ),
    },
  ];
};

const narrativeExperienceChunks = (): KnowledgeChunk[] => {
  return [
    {
      id: "narrative:hex-trust-full",
      title: "Hex Trust - full narrative",
      content:
        "At Hex Trust, my work spanned strategic products and internal platforms for institutional digital asset custody, transaction operations, client-facing infrastructure, compliance workflows, and trading operations. The role grew from implementation into technical ownership and project leadership with engineering, design, operations, compliance, and business stakeholders. I worked on Gryfyn Wallet, developed with Animoca Brands for gaming ecosystem wallet integration, enabling NFT-to-token trading and in-game NFT utility including MotoGP. My Gryfyn work covered frontend and backend, including TypeScript customization of a web camera library for product-specific UX and technical needs, plus publishing a public version and maintaining a specialized internal version in a private registry. I worked extensively on Hex Safe 2, a custodial wallet platform for enterprise and institutional clients. Responsibilities included EVM chain integration such as BNB Smart Chain and Polygon, support for ERC-20, ERC-721, and ERC-1155, and transaction workflows for deposits, withdrawals, staking, and unstaking. One of my largest initiatives was Address Book (Counterparty Book), Whitelisting, and Travel Rule across frontend and backend. Backend stack: Go, Kafka, PostgreSQL. Frontend stack: React, MUI, TypeScript. Address Book supported structured crypto address management for institutional transfer workflows. Whitelisting governed transaction permissions to approved addresses and region-specific controls. Travel Rule introduced jurisdiction-specific logic for Hong Kong, Singapore, EU, and UAE, while staying extensible to additional markets in the Middle East, Southeast Asia, and South America. Travel Rule scope influenced address management, whitelisting, deposits, withdrawals, staking, unstaking, KYC, KYB, and regional restrictions at account level. I worked closely with design on frontend UX, partnered on backend architecture and data model design, and helped lead delivery through evolving compliance interpretation and implementation constraints. I also led a REST API gateway and client-facing GitBook documentation effort. Internal services were largely JSON-RPC, but external clients needed REST-compatible interfaces, so I built a gateway layer and documentation pipeline using jq to merge and transform multiple OpenAPI YAML specs into a master OpenAPI source for GitBook docs. This improved external integration usability and long-term documentation maintainability. Another initiative I led was a Python Streamlit trade booking, monitoring, and alerting platform for trading operations, integrating internal systems and external exchange accounts such as Binance, surfacing stuck or failed trades, and adding threshold-based balance monitoring to reduce operational risk. I also contributed identity and security enhancements in Hex Safe 2, including passkey customization for the deployed Keycloak version and Argon2-related security updates. Overall, my Hex Trust scope combined full stack engineering, backend systems design, frontend product development, technical leadership, and project ownership in highly regulated environments where engineering quality, operational efficiency, client usability, and regional compliance all had to be balanced.",
      sectionId: "experience",
      type: "experience",
      tags: makeTags(
        "hex trust full narrative",
        "gryfyn",
        "hex safe 2",
        "travel rule",
        "address book",
        "whitelisting",
        "rest gateway",
        "gitbook",
        "streamlit",
      ),
    },
    {
      id: "narrative:crypto-com-full",
      title: "Crypto.com - full narrative",
      content:
        "At Crypto.com, my work spanned frontend and backend engineering across product features, internal platforms, blockchain tooling, and data-driven interfaces. Frontend stack included React, JavaScript, TypeScript, CSS, LESS, and Electron. Backend stack centered on Node.js, with Yarn and NPM tooling, plus Python scripts for utilities and automation. Depending on project context, I also worked with PostgreSQL and GraphQL. The role was broad and covered end-user products, internal blockchain infrastructure, analytics and visualization features, testing, and cross-team engineering support. I contributed to the Chain DeFi desktop wallet built with Electron, React, TypeScript, and Docker for secure digital asset management use cases. I also worked on the internal Cronos portal and related internal blockchain tools, including cross-chain bridging support for Cronos. In parallel, I contributed to company websites and platform features across frontend and backend needs. A major contribution area was data visualization: I implemented real-time token price visualizations in D3.js for more than 250 cryptocurrencies in a high-traffic product built with TypeScript, GraphQL, and Node.js. I also supported governance proposal-related features, internal testing and operational tools, and quality improvements through unit, integration, and end-to-end tests with Jest and Cypress. Beyond implementation, I contributed design input, translations, and technical knowledge sharing. I was encouraged to deepen blockchain exposure in Solidity and Rust, which I began studying and continue to build on.",
      sectionId: "experience",
      type: "experience",
      tags: makeTags(
        "crypto.com full narrative",
        "chain defi",
        "cronos",
        "d3",
        "250 cryptocurrencies",
        "jest",
        "cypress",
      ),
    },
    {
      id: "narrative:ai-link-full",
      title: "AI Link Group (TradeFi) - full narrative",
      content:
        "At AI Link Group (TradeFi), I worked as a full stack engineer across onboarding, compliance workflows, internal operations platforms, workflow automation, data analysis, and cloud setup. The role covered implementation plus system design, data modeling, process improvement, stakeholder collaboration, and junior engineer support. Frontend work included React, Next.js, JavaScript, TypeScript, and WordPress-related work. Backend work included Node.js and Express with MongoDB, Docker, Yarn, NPM, and PM2. I also worked with Python, Power BI, Jest, and Cypress. A major area was rebuilding the KYC and compliance platform using Node.js, Express, MongoDB, and Docker, redesigning workflows and APIs, reducing verification time by about 40 percent, and improving maintainability. I also led MongoDB data-layer improvements including document modeling, schema design, indexing strategy, and query optimization for production compliance workflows. I designed and built an internal finance portal to improve visibility and workflow efficiency for finance teams reviewing applicants and application data. I delivered RPA and workflow automation projects, including shipment slot placement and purchasing automation for shipping workflows, reducing manual effort and improving consistency. I helped deliver a replacement React and Next.js platform with authenticated client and admin portals for shipping, logistics, and data analysis workflows, improving maintainability and operational fit. I worked on registration-style forms and other frontend workflows where structured data collection and validation were important, and contributed to website updates through WordPress. I supported data-heavy operations and analysis using Python and Power BI, assisted previous data science work in visualization and analysis, redesigned database schema to improve efficiency and scalability, and supported Azure planning/setup for HKU research requirements. I improved CI/CD, added Jest and Cypress coverage, and supported junior engineers through reviews and guidance while working across teams to align technical delivery with operational realities. Overall, my scope was broader than feature delivery: workflow redesign, internal platform development, data modeling, process automation, and stakeholder-centric engineering in environments with tight real-world constraints. Technology summary includes React, Next.js, JavaScript, TypeScript, CSS, LESS, Electron, D3.js, Node.js, Express, GraphQL, Python, MongoDB, PostgreSQL, Jest, Cypress, Docker, CI/CD, Yarn, and NPM.",
      sectionId: "experience",
      type: "experience",
      tags: makeTags(
        "ai link full narrative",
        "tradefi",
        "kyc",
        "40 percent",
        "rpa",
        "finance portal",
        "hku",
      ),
    },
    {
      id: "narrative:scmp-full",
      title: "SCMP - full narrative",
      content:
        "At SCMP, my role spanned frontend and backend engineering with focus on interactive editorial products, reusable newsroom tools, data pipelines, and internal platforms for infographics, design, editorial, analytics, and engineering teams. Frontend work used JavaScript, jQuery, D3.js, and vanilla JavaScript plus supporting libraries. Backend work used Node.js, Express.js, LoopBack.js, SQL, Python, WebSockets, and JSON-based workflows. Over time, I moved beyond implementation into reusable systems and internal products that increased non-engineering team autonomy. I built interactive infographics and visual content embedded directly in SCMP articles for high-traffic storytelling use cases. I created reusable templates and foundations so designers could publish visualizations with less one-off engineering effort. I built internal chart generators supporting JSON, CSV, and Google Sheets URLs to generate reusable comparison charts and visualization outputs. I built an internal embed and widget generation platform for image comparisons, slideshows, weather widgets, storm warning modules, and interactive maps. I contributed to internal shared libraries and newsroom-oriented design-system work, and developed front-page support for infographics teams. I built and supported scripts and backend workflows for continuously updated editorial data, including the SCMP COVID-19 tracker, transforming multi-source scraped data into structured JSON for team consumption. I launched reusable visualization templates and live-data workflows for faster news response. I also wrote Google Sheets and Google Docs workflow helpers to reduce manual data effort for researchers and reporters. On backend systems, I built APIs with LoopBack and Express and delivered automation pipelines using Node.js, Python, SQL, JSON pipelines, and WebSockets for both internal and public-facing systems. A major theme was converting repeated newsroom bottlenecks into reusable platforms, with end-to-end collaboration across design, editorial, research, and engineering. Some supported storytelling outputs later received gold and silver awards.",
      sectionId: "experience",
      type: "experience",
      tags: makeTags(
        "scmp full narrative",
        "infographics",
        "chart generator",
        "covid tracker",
        "google sheets",
        "loopback",
      ),
    },
    {
      id: "narrative:polyasia-full",
      title: "PolyAsia - full narrative",
      content:
        "At PolyAsia, I worked across infrastructure support, enterprise systems, ERP customization, and cloud deployment for internal and client environments, with focus on network setup, system administration, troubleshooting, and implementation support. I was promoted from Trainee to Associate within three months. Network and infrastructure scope included routing, switching, firewall setup, diagnostics, and operational maintenance. I worked with DNS, DHCP, SSH, SFTP, Active Directory, Group Policy, and had exposure to Cisco VoIP. I supported backup operations, disaster recovery, and troubleshooting services, and contributed to Azure deployment with some VMware exposure. On ERP and application side, I customized Microsoft Dynamics NAV and GP with CSIDE and C#, and before leaving helped lead two colleagues and final implementation work around GP projects. Additional responsibilities included Joomla, HTML5, PHP, and CSS3 website maintenance and regular use of Power BI, Excel, Word, PowerPoint, Outlook, and Teams in delivery operations.",
      sectionId: "experience",
      type: "experience",
      tags: makeTags(
        "polyasia full narrative",
        "dynamics nav",
        "dynamics gp",
        "active directory",
        "disaster recovery",
      ),
    },
    {
      id: "narrative:creative-coding-full",
      title: "Creative Coding HK - full narrative",
      content:
        "At Creative Coding HK, I worked part-time for around two to three weeks teaching children aged 5 to 12 coding basics, robotics, mathematics, and science concepts with other instructors, using tools such as mBot, Edison, and Arduino.",
      sectionId: "experience",
      type: "experience",
      tags: makeTags(
        "creative coding full narrative",
        "teaching children",
        "robotics",
        "arduino",
      ),
    },
  ];
};

const verbatimSourceChunks = (): KnowledgeChunk[] => {
  return [
    {
      id: "verbatim:hex-trust-overview",
      title: "Verbatim Source - Hex Trust - Overview",
      content:
        "At Hex Trust, my work spanned multiple strategic products and internal platforms supporting institutional digital asset custody, transaction operations, client-facing infrastructure, compliance workflows, and trading operations. Over time, my role grew beyond implementation into technical ownership and project leadership across several cross-functional initiatives involving engineering, design, operations, compliance, and business stakeholders.",
      sectionId: "experience",
      type: "experience",
      tags: makeTags("verbatim", "source", "hex trust", "overview"),
    },
    {
      id: "verbatim:hex-trust-gryfyn",
      title: "Verbatim Source - Hex Trust - Gryfyn Wallet",
      content:
        "I initially worked on Gryfyn Wallet, a platform developed in partnership with Animoca Brands and designed to integrate digital asset wallet functionality into gaming ecosystems. The product enabled users to trade NFTs for crypto tokens, while also allowing NFTs to be used across supported games for in-game utility, including titles such as MotoGP. My work on Gryfyn covered both frontend and backend features across the platform. One notable contribution was the customization of a web-based camera library in TypeScript to meet the product’s specific technical and user experience requirements. I also published a public version of the library, alongside a more specialized internal version maintained within the company’s private registry.",
      sectionId: "experience",
      type: "project",
      tags: makeTags(
        "verbatim",
        "source",
        "hex trust",
        "gryfyn wallet",
        "animoca brands",
      ),
    },
    {
      id: "verbatim:hex-trust-hex-safe-2",
      title: "Verbatim Source - Hex Trust - Hex Safe 2",
      content:
        "I later worked extensively on Hex Safe 2, Hex Trust’s custodial wallet platform for businesses, enterprises, and institutional organizations. My responsibilities included building and enhancing wallet and transaction capabilities across EVM-based networks and assets. This included integration of EVM chains such as BNB Smart Chain and Polygon, as well as support for token standards including ERC-20, ERC-721, and ERC-1155. I also contributed to the design and implementation of transaction workflows covering deposits, withdrawals, staking, and unstaking for multiple token types on EVM chains. Beyond core wallet functionality, my work on Hex Safe 2 increasingly involved ownership of more complex product areas where technical decisions had direct operational and compliance implications.",
      sectionId: "experience",
      type: "project",
      tags: makeTags(
        "verbatim",
        "source",
        "hex safe 2",
        "evm",
        "erc-20",
        "erc-721",
        "erc-1155",
      ),
    },
    {
      id: "verbatim:hex-trust-travel-rule",
      title:
        "Verbatim Source - Hex Trust - Address Book, Whitelisting, Travel Rule",
      content:
        "One of the most significant initiatives I led at Hex Trust was a large, multi-part project covering Address Book, Whitelisting, and Travel Rule functionality across both backend and frontend systems. This was a highly cross-functional effort with implications across custody operations, transaction controls, KYC and KYB, and jurisdiction-specific compliance requirements. The backend stack for this work included Go, Kafka, and PostgreSQL, while the frontend was built using React, MUI, and TypeScript. The Address Book, also referred to as the Counterparty Book, was designed to allow businesses and institutional clients to organize, store, and manage crypto addresses in a structured way. The system supported operational workflows around transfers, deposits, and withdrawals, while also reflecting organizational structure and regional requirements. Whitelisting was closely integrated with this capability and governed whether transactions could be made only to pre-approved addresses. This functionality also incorporated KYC-related workflows and controls depending on the region in which the client organization operated. The Travel Rule component introduced jurisdiction-specific logic to ensure the platform could support different compliance and custody requirements across Hong Kong, Singapore, the EU, and the UAE, while remaining flexible enough to support future expansion into additional markets such as other Middle Eastern countries, Southeast Asia, and South America. Travel Rule requirements influenced a broad set of workflows and controls across the platform, including address management, whitelisting, deposits, withdrawals, staking, unstaking, KYC, KYB, and account-level regional restrictions. Because these areas were deeply interconnected, the project required careful system design and coordination to ensure the resulting solution was scalable, compliant, and operationally practical. In this initiative, I worked closely with design on the frontend experience, partnered on backend architecture and data model design, and helped lead engineering delivery across the wider team. A major part of the role involved bringing structure to a problem space where product requirements, compliance interpretation, and implementation constraints were all evolving in parallel.",
      sectionId: "experience",
      type: "experience",
      tags: makeTags(
        "verbatim",
        "source",
        "travel rule",
        "address book",
        "whitelisting",
        "kyc",
        "kyb",
      ),
    },
    {
      id: "verbatim:hex-trust-rest-api-gateway",
      title:
        "Verbatim Source - Hex Trust - REST API Gateway and Client Documentation",
      content:
        "I also led the development of a REST API Gateway and associated client-facing GitBook documentation for externally exposed APIs. Internally, many services were built around JSON-RPC, but external clients required a more conventional REST-based interface for public integration. To address this, I built a gateway service that presented client-facing APIs in a REST-compatible format while interfacing with internal services behind the scenes. This included support for externally exposed APIs related to whitelisting and other client operations. As part of this work, I also designed a documentation pipeline that used CLI tools such as jq to filter, transform, and combine multiple OpenAPI YAML files from different microservices into a single master OpenAPI specification. That master specification was then used to generate and maintain GitBook-based API documentation for clients. This project improved the usability and accessibility of external integrations, while also creating a more maintainable process for managing API documentation across multiple services.",
      sectionId: "experience",
      type: "project",
      tags: makeTags(
        "verbatim",
        "source",
        "rest api gateway",
        "gitbook",
        "openapi",
      ),
    },
    {
      id: "verbatim:hex-trust-trading-platform",
      title: "Verbatim Source - Hex Trust - Trading Operations Platform",
      content:
        "Another initiative I led was the development of a trade booking, monitoring, and alerting platform for the trading team. This was built as a Python-based Streamlit application and designed to provide operational visibility into the lifecycle of trades, including ongoing, completed, and failed transactions. The system integrated with internal databases and account systems, as well as external exchange accounts such as Binance. The platform was used to surface failed trades and trades that were stuck in processing due to account issues, transaction issues, or operational exceptions, allowing the operations team to intervene more quickly and effectively. A second phase of this work focused on monitoring balances across both internal trade accounts and external exchange accounts. This included threshold-based alerting to ensure accounts and token balances remained above required operational levels, reducing risk and improving the reliability of trading workflows.",
      sectionId: "experience",
      type: "project",
      tags: makeTags("verbatim", "source", "streamlit", "trading", "binance"),
    },
    {
      id: "verbatim:hex-trust-security-and-scope",
      title:
        "Verbatim Source - Hex Trust - Identity/Security and Overall Scope",
      content:
        "In addition to product and platform work, I contributed to authentication and security improvements within Hex Safe 2. This included customizing passkey support for the version of Keycloak used by the platform, as well as implementing security-related updates involving Argon2 encryption. This work formed part of a broader effort to improve the security posture and user authentication experience of the platform while working within the constraints of the existing identity infrastructure. Overall, my role at Hex Trust combined full stack engineering, backend systems design, frontend product development, technical leadership, and project ownership across a range of business-critical initiatives. Much of the work involved navigating technically complex and highly regulated problem spaces, where engineering decisions needed to account not only for implementation quality, but also for operational efficiency, client usability, and evolving regional compliance requirements.",
      sectionId: "experience",
      type: "experience",
      tags: makeTags(
        "verbatim",
        "source",
        "keycloak",
        "argon2",
        "overall scope",
      ),
    },
    {
      id: "verbatim:crypto-overview-and-stack",
      title: "Verbatim Source - Crypto.com - Overview and Stack",
      content:
        "My work spanned both frontend and backend engineering across product features, internal platforms, blockchain tooling, and data-driven interfaces. On the frontend, I worked primarily with React, JavaScript, TypeScript, CSS, LESS, and Electron. On the backend, I mainly used Node.js, supported by JavaScript tooling such as Yarn and NPM, and also wrote Python scripts for internal utilities and automation. Depending on the project, I also worked with PostgreSQL and GraphQL. The role was broad in scope and required contributing across end-user products, internal blockchain infrastructure, analytics and visualisation features, testing, and general engineering support. In addition to core development work, I also contributed to UI/UX decisions, translations, knowledge sharing, and cross-team support.",
      sectionId: "experience",
      type: "experience",
      tags: makeTags("verbatim", "source", "crypto.com", "frontend", "backend"),
    },
    {
      id: "verbatim:crypto-product-and-viz",
      title:
        "Verbatim Source - Crypto.com - Product Work and Data Visualisation",
      content:
        "I contributed to the Chain DeFi desktop wallet, built with Electron, React, TypeScript, and Docker, supporting secure digital asset management use cases. I also worked on the internal Cronos portal and related internal blockchain tools, including support for cross-chain bridging functionality for Cronos. In addition, I contributed to the company’s main websites and platform features, helping deliver frontend and backend work where needed and supporting teammates across shared engineering initiatives. A major area of contribution was data visualisation, particularly around crypto market and token pricing interfaces. I implemented real-time token price visualisations in D3.js for more than 250 cryptocurrencies, contributing to a high-traffic product built with TypeScript, GraphQL, and Node.js.",
      sectionId: "experience",
      type: "project",
      tags: makeTags("verbatim", "source", "chain defi", "cronos", "250+"),
    },
    {
      id: "verbatim:crypto-testing-broader",
      title:
        "Verbatim Source - Crypto.com - Governance, Testing, Broader Contributions",
      content:
        "I also worked on governance proposal-related features and a range of internal testing and operational tools designed to support development workflows and platform reliability. To improve quality across projects, I developed unit, integration, and end-to-end tests using Jest and Cypress. Beyond implementation, I regularly supported the team with design input, translations, and sharing knowledge on tools and technologies where useful. The role required flexibility and collaboration, and I often contributed across multiple projects at the same time depending on business priorities. I was also encouraged to deepen my technical exposure in blockchain development, particularly in Solidity and Rust, which I began studying and continue to build on.",
      sectionId: "experience",
      type: "experience",
      tags: makeTags(
        "verbatim",
        "source",
        "governance",
        "jest",
        "cypress",
        "solidity",
        "rust",
      ),
    },
    {
      id: "verbatim:ai-link-overview-and-stack",
      title: "Verbatim Source - AI Link Group - Overview and Stack",
      content:
        "At AI Link Group Ltd. (TradeFi), I worked as a full stack engineer across a broad range of business-critical systems, including client onboarding, compliance workflows, internal operations platforms, workflow automation, data analysis, and cloud setup. My role covered both frontend and backend development, but it also extended into system design, data modeling, process improvement, stakeholder collaboration, and support for junior engineers. On the frontend, I mainly worked with React, Next.js, JavaScript, and TypeScript, as well as website-related work through WordPress. On the backend, I primarily used Node.js and Express, supported by tools such as MongoDB, Docker, Yarn, NPM, and PM2. I also worked with Python, Power BI, and testing tools such as Jest and Cypress depending on the project.",
      sectionId: "experience",
      type: "experience",
      tags: makeTags("verbatim", "source", "ai link", "tradefi", "full stack"),
    },
    {
      id: "verbatim:ai-link-kyc-finance-rpa",
      title: "Verbatim Source - AI Link Group - KYC, Finance Portal, RPA",
      content:
        "One of my main areas of ownership was the redesign and rebuild of the company’s KYC and compliance system. I rebuilt the platform using Node.js, Express, MongoDB, and Docker, with the goal of making the onboarding and verification process more efficient, maintainable, and better suited to real operational needs. This involved redesigning backend workflows, improving how applicant and compliance data was handled, and creating APIs that better supported the business’s verification and review processes. The improvements reduced verification time by approximately 40%, while also making the system easier to operate and extend. As part of this work, I also led improvements to the MongoDB data layer, including document modeling, schema design, indexing strategy, and query optimization for production compliance workflows. I designed and built an internal finance portal to give the finance team a clearer and more structured way to view applicants, submitted applications, and related supporting information. I also worked on automation and RPA projects, including automating placement and purchasing of shipment slots from shipping companies for forwarding workflows.",
      sectionId: "experience",
      type: "project",
      tags: makeTags(
        "verbatim",
        "source",
        "kyc",
        "40%",
        "finance portal",
        "rpa",
      ),
    },
    {
      id: "verbatim:ai-link-platform-data-quality",
      title: "Verbatim Source - AI Link Group - Platform, Data, Azure, Quality",
      content:
        "Another significant area of work was delivering a replacement React/Next.js platform with authenticated client and administrator portals for shipping, logistics, and data analysis workflows. On the frontend side, I worked on registration-style forms and user-facing workflows using React and contributed to company website updates through WordPress. I supported data-heavy operational work and data analysis using Python scripts and Power BI, assisted prior data science visualization and analysis tasks, and redesigned database schema for efficiency and maintainability as requirements evolved. I also helped with Azure cloud planning and setup in support of HKU research team requirements. In testing and team support, I improved CI/CD pipelines, developed unit and integration tests with Jest and Cypress, and supported junior engineers via code reviews and implementation guidance. Overall, my role at AI Link Group was broader than feature development, spanning workflow redesign, data modeling, internal platform development, process automation, and close collaboration with business stakeholders in operationally constrained environments.",
      sectionId: "experience",
      type: "experience",
      tags: makeTags(
        "verbatim",
        "source",
        "authenticated portals",
        "azure",
        "hku",
        "ci/cd",
      ),
    },
    {
      id: "verbatim:ai-link-technologies-used",
      title: "Verbatim Source - AI Link Group - Technologies Used",
      content:
        "Technologies Used. Frontend: React, Next.js, JavaScript, TypeScript, CSS, LESS, Electron, D3.js. Backend: Node.js, Express, GraphQL, Python. Databases: MongoDB, PostgreSQL. Testing and Delivery: Jest, Cypress, Docker, CI/CD pipelines. Other Tools: Yarn, NPM. I was also encouraged to develop further in blockchain engineering by learning Solidity and Rust, which I continue to study.",
      sectionId: "experience",
      type: "capability",
      tags: makeTags(
        "verbatim",
        "source",
        "technologies used",
        "graphql",
        "docker",
      ),
    },
    {
      id: "verbatim:scmp-overview-and-visualisation",
      title:
        "Verbatim Source - SCMP - Overview, Infographics, and Editorial Visualisation",
      content:
        "At SCMP, my role spanned both frontend and backend engineering, with a strong focus on building interactive editorial products, reusable newsroom tools, data pipelines, and internal platforms that supported infographics, design, editorial, analytics, and engineering teams. A large part of my work sat at the intersection of engineering, design, and editorial storytelling. On the frontend, I built interactive infographics, embeddable visualisations, and editorial tools using JavaScript, jQuery, D3.js, and vanilla JavaScript. On the backend, I worked with Node.js, Express.js, LoopBack.js, SQL, Python, WebSockets, and JSON-based workflows. Over time, my role grew beyond implementation into building reusable systems and internal products that allowed non-engineering teams to move faster and work more independently.",
      sectionId: "experience",
      type: "experience",
      tags: makeTags("verbatim", "source", "scmp", "infographics", "editorial"),
    },
    {
      id: "verbatim:scmp-generators-widgets",
      title:
        "Verbatim Source - SCMP - Templates, Generators, and Widget Platform",
      content:
        "To improve delivery speed and reduce repeated engineering effort, I built reusable templates and foundations so designers could add visualisations and publish without custom engineering each time. I built an interactive chart generator using data from JSON, CSV, and Google Sheets URLs to produce reusable comparison charts and visualisations. I also built an internal embed and widget generation platform for image comparisons, slideshows, weather widgets, storm warning modules, and interactive maps. This created reusable internal products that reduced repeated manual requests and increased interactive storytelling throughput.",
      sectionId: "experience",
      type: "project",
      tags: makeTags(
        "verbatim",
        "source",
        "chart generator",
        "widgets",
        "google sheets",
      ),
    },
    {
      id: "verbatim:scmp-covid-data-and-impact",
      title:
        "Verbatim Source - SCMP - COVID Tracker, Data Workflows, and Cross-Team Impact",
      content:
        "I built and supported scripts and backend workflows that continuously updated major data sources used in editorial products, including the SCMP COVID-19 tracker. I gathered data from multiple sources, scraped and processed it, and transformed it into structured JSON for reuse by my team and other development teams. I also launched reusable visualisation templates and live-data workflows for ongoing editorial coverage. I wrote Google Sheets and Google Docs workflow helpers to reduce manual effort for researchers and reporters. On backend systems, I built APIs with LoopBack.js and Express.js and delivered data-processing, scraping, and automation workflows with Node.js, Python, SQL, JSON pipelines, and WebSockets. A major theme of my contribution was converting repeated newsroom needs into reusable products with end-to-end collaboration across designers, editorial stakeholders, researchers, and engineers. Some supported storytelling outputs later received gold and silver awards.",
      sectionId: "experience",
      type: "experience",
      tags: makeTags(
        "verbatim",
        "source",
        "covid tracker",
        "json pipelines",
        "awards",
      ),
    },
    {
      id: "verbatim:polyasia-full",
      title: "Verbatim Source - PolyAsia - Full Scope",
      content:
        "In this role, I worked across infrastructure support, enterprise systems, ERP customisation, and cloud deployment. Responsibilities covered internal operations and client environments, with strong focus on network setup, system administration, troubleshooting, and implementation support. I was promoted from Trainee to Associate within three months. A major part of my work involved network administration, maintenance, security, and diagnostics, including routing, switching, firewalls, and day-to-day maintenance. I worked with DNS, DHCP, SSH, SFTP, Active Directory, Group Policy, and had exposure to Cisco VoIP. I supported backup operations, disaster recovery, and troubleshooting services, and contributed to Azure deployment with VMware exposure. On the application side, I customized Microsoft Dynamics NAV and GP using CSIDE and C#, led two colleagues for around two months before leaving, and supported final implementation work. I also helped maintain the company website with Joomla, HTML5, PHP, and CSS3, and regularly used Power BI, Excel, Word, PowerPoint, Outlook, and Teams.",
      sectionId: "experience",
      type: "experience",
      tags: makeTags(
        "verbatim",
        "source",
        "polyasia",
        "erp",
        "network",
        "azure",
      ),
    },
    {
      id: "verbatim:creative-coding-hk",
      title: "Verbatim Source - Creative Coding HK",
      content:
        "I taught children from ages 5 to 12 basics of coding, robotics, mathematics, and science, using learning tools such as mBot, Edison, and Arduino, alongside other teachers and instructors for two to three weeks as a part-time role.",
      sectionId: "experience",
      type: "experience",
      tags: makeTags("verbatim", "source", "creative coding hk", "teaching"),
    },
  ];
};

export const getPortfolioKnowledge = (): KnowledgeChunk[] => {
  return [
    {
      id: "profile:overview",
      title: "Portfolio overview",
      content: [
        siteConfig.siteName,
        siteConfig.description,
        `Location: ${siteConfig.location}`,
        `Primary focus: clean, practical web products and reliable interfaces.`,
      ].join(" "),
      sectionId: "about",
      type: "profile",
      tags: makeTags(
        "profile",
        "overview",
        siteConfig.location,
        siteConfig.siteName,
      ),
    },
    {
      id: "profile:senior-summary",
      title: "Senior full stack profile summary",
      content:
        "Senior Full Stack Software Engineer with 8+ years of experience building and maintaining production web applications, internal platforms, and financial technology systems across regulated fintech, digital asset, trade finance, and media environments. Strong hands-on expertise in React, Next.js, TypeScript, Node.js, REST APIs, MongoDB, and cloud-based production systems. Experienced in end-to-end feature ownership including API integration, authentication flows, data layer design, production support, and collaboration with product, operations, compliance, and business stakeholders. Based in Hong Kong and immediately available.",
      sectionId: "about",
      type: "profile",
      tags: makeTags(
        "senior full stack engineer",
        "8+ years",
        "fintech",
        "digital assets",
        "trade finance",
        "media",
        "hong kong",
        "immediately available",
      ),
    },
    {
      id: "profile:strongest-domains",
      title: "Strongest domains",
      content:
        "Strongest domains include: regulated fintech and institutional digital assets, full-stack web platform engineering, React and Next.js application ownership, backend service integration with Node.js and REST APIs, MongoDB-backed data layer design and optimization, compliance and KYC/KYB workflows, internal operations and trading support platforms, and high-traffic data visualization products.",
      sectionId: "about",
      type: "capability",
      tags: makeTags(
        "strongest domains",
        "domain expertise",
        "regulated fintech",
        "institutional custody",
        "react",
        "next js",
        "node js",
        "mongodb",
        "compliance",
        "kyc",
        "trading operations",
        "data visualization",
      ),
    },
    {
      id: "profile:work-authorization",
      title: "Work authorization",
      content:
        "Work authorization status: I do not need a visa to work in the United States because I am a U.S. citizen, I do not need a visa to work in Hong Kong because I am a Hong Kong permanent resident, and I do not need a visa to work in Egypt because I am an Egyptian citizen.",
      sectionId: "about",
      type: "capability",
      tags: makeTags(
        "work authorization",
        "visa",
        "us citizen",
        "hong kong permanent resident",
        "egyptian citizen",
        "relocation",
        "global hiring",
      ),
    },
    ...projectChunks(),
    ...caseStudyChunks(),
    ...experienceChunks(),
    ...deepExperienceChunks(),
    ...narrativeExperienceChunks(),
    ...verbatimSourceChunks(),
    ...skillChunks(),
    ...contactChunks(),
  ];
};
