# I18n Character Budget Table

Rule: for each key, keep each locale string length <= budget.

Budget formula: `budget = max(current EN, FR, AR lengths) + 2` (minimum 8).

| Key | EN | FR | AR | EN len | FR len | AR len | Budget |
|---|---|---|---:|---:|---:|---:|---:|
| common.language | Language | Langue | اللغة | 8 | 6 | 5 | 10 |
| common.actions.open | Open | Ouvrir | فتح | 4 | 6 | 3 | 8 |
| common.actions.live | Live | En direct | مباشر | 4 | 9 | 5 | 11 |
| navBar.mobile.openMenu | Open navigation menu | Ouvrir le menu de navigation | فتح قائمة التنقل | 20 | 28 | 16 | 30 |
| navBar.mobile.closeMenu | Close navigation menu | Fermer le menu de navigation | إغلاق قائمة التنقل | 21 | 28 | 18 | 30 |
| navBar.mobile.openLabel | Open menu | Ouvrir le menu | فتح القائمة | 9 | 14 | 11 | 16 |
| navBar.mobile.closeLabel | Close menu | Fermer le menu | إغلاق القائمة | 10 | 14 | 13 | 16 |
| navBar.items.about | About | À propos | نبذة | 5 | 8 | 4 | 10 |
| navBar.items.experience | Experience | Expérience | الخبرة | 10 | 10 | 6 | 12 |
| navBar.items.work | Work | Projets | الأعمال | 4 | 7 | 7 | 9 |
| navBar.items.capabilities | Capabilities | Capacités | القدرات | 12 | 9 | 7 | 14 |
| navBar.items.metrics | Metrics | Métriques | المؤشرات | 7 | 9 | 8 | 11 |
| navBar.items.contact | Contact | Contact | التواصل | 7 | 7 | 7 | 9 |
| navBar.items.portfolio | Portfolio | Portfolio | المعرض | 9 | 9 | 6 | 11 |
| aboutSection.cta.label | View Work | Voir mes projets | مشاريعي | 9 | 16 | 7 | 18 |
| caseStudiesSection.viewFullPortfolio | View Full Portfolio | Voir tout le portfolio | كل المشاريع | 19 | 22 | 11 | 24 |
| caseStudiesSection.viewDetails | View Details | Détails | التفاصيل | 12 | 7 | 8 | 14 |
| caseStudiesSection.open | Open | Ouvrir | فتح | 4 | 6 | 3 | 8 |
| caseStudiesSection.code | Code | Code | الكود | 4 | 4 | 5 | 8 |
| caseStudiesSection.article | Article | Article | مقال | 7 | 7 | 4 | 9 |
| portfolioPage.backToHomeShowcase | Back to Home Showcase | Retour accueil | العودة للرئيسية | 21 | 14 | 15 | 23 |
| portfolioPage.sortOrder | Sort Order | Tri | الترتيب | 10 | 3 | 7 | 12 |
| portfolioPage.latestToEarliest | Latest to earliest | Plus récents | الأحدث | 18 | 12 | 6 | 20 |
| portfolioPage.earliestToLatest | Earliest to latest | Plus anciens | الأقدم | 18 | 12 | 6 | 20 |
| portfolioPage.titleAsc | Title A-Z | Titre A→Z | العنوان أ-ي | 9 | 9 | 11 | 13 |
| portfolioPage.titleDesc | Title Z-A | Titre Z→A | العنوان ي-أ | 9 | 9 | 11 | 13 |
| projectDetailPage.backToPortfolio | Back to Portfolio | Retour portfolio | إلى المعرض | 17 | 16 | 10 | 19 |
| projectDetailPage.backToHome | Back to Home | Accueil | الرئيسية | 12 | 7 | 8 | 14 |
| orbAssistant.send | Send | Envoyer | إرسال | 4 | 7 | 5 | 9 |
| orbAssistant.reset | Reset | Réinitialiser | إعادة تعيين | 5 | 13 | 11 | 15 |
| orbAssistant.tryNext | Try one of these | Essayez une question | جرّب سؤالاً | 16 | 20 | 11 | 22 |
| orbAssistant.newConversation | New conversation | Nouvelle conversation | محادثة جديدة | 16 | 21 | 12 | 23 |
| orbAssistant.copyMessage | Copy message | Copier le message | نسخ الرسالة | 12 | 17 | 11 | 19 |
| orbAssistant.copiedMessage | Message copied | Message copié | تم نسخ الرسالة | 14 | 13 | 14 | 16 |

Last updated: 2026-06-27