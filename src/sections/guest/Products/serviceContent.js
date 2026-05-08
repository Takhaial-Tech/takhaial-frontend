import mobileAppsIcon from '../../../assets/icons/mobile-apps-service.svg'
import vrArIcon from '../../../assets/icons/vr-ar-service.svg'
import aiIcon from '../../../assets/icons/ai-service.svg'
import advertisingIcon from '../../../assets/icons/advertising-service.svg'
import { LANGUAGES, translateText } from '../../../i18n/translations'

const baseServiceContent = [
    {
        slug: 'mobile-apps',
        title: 'Mobile Apps',
        label: 'Digital platforms',
        icon: mobileAppsIcon,
        summary: 'We design and build mobile-first platforms that connect users, content, services, payments, bookings, and operations in one controlled experience.',
        lead: 'Mobile apps are the operational layer of a digital service. We turn ideas into usable products with clear journeys, admin control, secure APIs, and room to grow.',
        whatWeBuild: [
            'iOS and Android applications for customers, teams, visitors, and field operations',
            'Admin panels, dashboards, content controls, and approval workflows',
            'Booking, ordering, loyalty, notifications, forms, and account systems',
            'Backend APIs and integrations with payment, CRM, maps, analytics, and existing systems',
        ],
        sectors: ['Retail', 'Real estate', 'Education', 'Events', 'Tourism', 'Operations'],
        deliverables: ['UX flows', 'UI design', 'Mobile app', 'Backend API', 'Admin dashboard', 'Deployment support'],
        proof: 'Built to support the same service logic behind Takhaial projects: interactive journeys, managed content, and measurable user actions.',
    },
    {
        slug: 'vr-ar',
        title: 'VR / AR',
        label: 'Immersive experiences',
        icon: vrArIcon,
        summary: 'We create VR, AR, and MR experiences that let people explore spaces, products, training scenarios, museums, and future projects before they physically exist.',
        lead: 'Our XR work turns complex products and environments into interactive experiences. From virtual showrooms to AR information layers, the goal is always better understanding and stronger engagement.',
        whatWeBuild: [
            'Virtual showrooms for automotive, real estate, retail, and destination marketing',
            'AR product visualization, information layers, and guided real-world overlays',
            'VR training simulators for education, safety, vocational skills, and high-risk procedures',
            'Virtual museums, cultural storytelling, tourism journeys, and mixed reality presentations',
        ],
        sectors: ['Automotive', 'Real estate', 'Education', 'Tourism', 'Museums', 'Industry', 'Defense'],
        deliverables: ['3D assets', 'VR app', 'AR app', 'MR demo', 'Interactive scenes', 'Event-ready build'],
        proof: 'Reference material includes Lexus-style virtual showrooms, education/training VR, museums, tourism, smart city, and automotive experiences.',
    },
    {
        slug: 'ai',
        title: 'AI',
        label: 'Intelligent systems',
        icon: aiIcon,
        summary: 'We integrate AI into products and immersive experiences so they can explain, guide, analyze, personalize, predict, and respond in real time.',
        lead: 'AI becomes powerful when it is connected to a real workflow. We use it for assistants, analytics, adaptive learning, digital twins, prediction, and smarter user journeys.',
        whatWeBuild: [
            'AI assistants for websites, exhibitions, museums, cities, products, and customer support',
            'AI-powered guides inside VR/AR experiences and virtual sales environments',
            'Data analysis, visitor analytics, recommendation flows, and lead qualification',
            'Predictive maintenance, digital twin intelligence, and operational decision support',
        ],
        sectors: ['Smart cities', 'Education', 'Museums', 'Retail', 'Industry', 'Security', 'Healthcare'],
        deliverables: ['AI workflow design', 'Assistant logic', 'Prompt system', 'Data integration', 'Analytics view', 'XR integration'],
        proof: 'The business plan highlights XR/AI as an integrated offer for training, commercial showrooms, digital twins, visitor analytics, and command solutions.',
    },
    {
        slug: 'advertising',
        title: 'Advertising',
        label: 'Cinematic content',
        icon: advertisingIcon,
        summary: 'We produce visual campaigns, 3D animations, CGI films, AI-assisted concept videos, and short social cuts that make products and destinations easy to understand.',
        lead: 'Advertising is not just a nice video. It is a clear visual argument. We build cinematic content that explains the offer, shows the use case, and gives sales teams material they can actually use.',
        whatWeBuild: [
            '3D animation, CGI product films, architectural visualization, and cinematic project films',
            'AI-assisted concept films for fast early-stage visualization and pitch development',
            'Social media cutdowns, launch videos, event screens, and presentation-ready visual assets',
            'Anamorphic, curved, double-screen, and high-impact display content for campaigns and venues',
        ],
        sectors: ['Real estate', 'Automotive', 'Events', 'Government', 'Tourism', 'Retail', 'Education'],
        deliverables: ['Creative concept', 'Storyboard', '3D/AI film', 'Social cuts', 'Still renders', 'Campaign assets'],
        proof: 'The Car City proposal references cinematic masterplans, AI films, CGI, social versions, zoning visuals, and still renders as core deliverables.',
    },
]

const serviceArabicContent = {
    'mobile-apps': {
        titleAr: 'تطبيقات الموبايل',
        labelAr: 'منصات رقمية',
        summaryAr: 'نصمم ونطور منصات موبايل تربط المستخدمين والمحتوى والخدمات والمدفوعات والحجوزات والعمليات في تجربة واحدة قابلة للإدارة.',
        leadAr: 'تطبيقات الموبايل هي طبقة التشغيل للخدمة الرقمية. نحول الأفكار إلى منتجات قابلة للاستخدام برحلات واضحة ولوحات تحكم وواجهات API آمنة وقابلية للنمو.',
        whatWeBuildAr: [
            'تطبيقات iOS وAndroid للعملاء والفرق والزوار وعمليات الميدان',
            'لوحات إدارة ولوحات بيانات وتحكم في المحتوى ومسارات موافقات',
            'أنظمة حجز وطلب وولاء وإشعارات ونماذج وحسابات مستخدمين',
            'واجهات API وتكاملات مع الدفع وCRM والخرائط والتحليلات والأنظمة الحالية',
        ],
        sectorsAr: ['التجزئة', 'العقارات', 'التعليم', 'الفعاليات', 'السياحة', 'العمليات'],
        deliverablesAr: ['رحلات UX', 'تصميم UI', 'تطبيق موبايل', 'Backend API', 'لوحة إدارة', 'دعم الإطلاق'],
        proofAr: 'مبنية لدعم نفس منطق الخدمة في مشاريع تخيل: رحلات تفاعلية ومحتوى مدار وإجراءات مستخدم قابلة للقياس.',
    },
    'vr-ar': {
        titleAr: 'الواقع الافتراضي / المعزز',
        labelAr: 'تجارب غامرة',
        summaryAr: 'ننشئ تجارب VR وAR وMR تتيح للناس استكشاف المساحات والمنتجات والتدريب والمتاحف والمشروعات المستقبلية قبل وجودها فعليا.',
        leadAr: 'عملنا في XR يحول المنتجات والبيئات المعقدة إلى تجارب تفاعلية. من المعارض الافتراضية إلى طبقات المعلومات بالواقع المعزز، الهدف دائما فهم أفضل وتفاعل أقوى.',
        whatWeBuildAr: [
            'معارض افتراضية للسيارات والعقارات والتجزئة وتسويق الوجهات',
            'تصور منتجات بالواقع المعزز وطبقات معلومات وإرشاد فوق الواقع',
            'محاكيات تدريب VR للتعليم والسلامة والمهارات المهنية والإجراءات عالية الخطورة',
            'متاحف افتراضية وسرد ثقافي ورحلات سياحية وعروض واقع مختلط',
        ],
        sectorsAr: ['السيارات', 'العقارات', 'التعليم', 'السياحة', 'المتاحف', 'الصناعة', 'الدفاع'],
        deliverablesAr: ['أصول ثلاثية الأبعاد', 'تطبيق VR', 'تطبيق AR', 'عرض MR', 'مشاهد تفاعلية', 'نسخة جاهزة للفعاليات'],
        proofAr: 'المواد المرجعية تشمل معارض سيارات افتراضية وتدريب VR ومتاحف وسياحة ومدن ذكية وتجارب سيارات.',
    },
    ai: {
        titleAr: 'الذكاء الاصطناعي',
        labelAr: 'أنظمة ذكية',
        summaryAr: 'ندمج الذكاء الاصطناعي داخل المنتجات والتجارب الغامرة حتى تشرح وترشد وتحلل وتخصص وتتنبأ وتتفاعل في الوقت الحقيقي.',
        leadAr: 'يصبح الذكاء الاصطناعي قويا عندما يرتبط بسير عمل حقيقي. نستخدمه للمساعدين والتحليلات والتعلم التكيفي والتوائم الرقمية والتنبؤ ورحلات المستخدم الذكية.',
        whatWeBuildAr: [
            'مساعدون أذكياء للمواقع والمعارض والمتاحف والمدن والمنتجات ودعم العملاء',
            'مرشدون بالذكاء الاصطناعي داخل تجارب VR/AR وبيئات البيع الافتراضية',
            'تحليل بيانات وتحليلات زوار وتوصيات وتأهيل عملاء محتملين',
            'صيانة تنبؤية وذكاء للتوائم الرقمية ودعم قرارات التشغيل',
        ],
        sectorsAr: ['المدن الذكية', 'التعليم', 'المتاحف', 'التجزئة', 'الصناعة', 'الأمن', 'الصحة'],
        deliverablesAr: ['تصميم سير عمل AI', 'منطق المساعد', 'نظام Prompt', 'تكامل بيانات', 'عرض تحليلات', 'تكامل XR'],
        proofAr: 'خطة العمل تبرز XR/AI كعرض متكامل للتدريب والمعارض التجارية والتوائم الرقمية وتحليلات الزوار وحلول القيادة.',
    },
    advertising: {
        titleAr: 'الإعلانات',
        labelAr: 'محتوى سينمائي',
        summaryAr: 'ننتج حملات بصرية وأنيميشن ثلاثي الأبعاد وأفلام CGI وفيديوهات مفاهيم مدعومة بالذكاء الاصطناعي ونسخ قصيرة للسوشيال توضح المنتجات والوجهات بسرعة.',
        leadAr: 'الإعلان ليس مجرد فيديو جميل. هو حجة بصرية واضحة. نبني محتوى سينمائي يشرح العرض ويعرض حالة الاستخدام ويمنح فرق المبيعات مواد قابلة للاستخدام فعلا.',
        whatWeBuildAr: [
            'أنيميشن ثلاثي الأبعاد وأفلام CGI للمنتجات وتصوير معماري وأفلام مشاريع سينمائية',
            'أفلام مفاهيم مدعومة بالذكاء الاصطناعي للتصور السريع وتطوير العروض',
            'نسخ قصيرة للسوشيال وفيديوهات إطلاق وشاشات فعاليات وأصول جاهزة للعروض',
            'محتوى للشاشات الأنمورفية والمنحنية والمزدوجة والعروض عالية التأثير',
        ],
        sectorsAr: ['العقارات', 'السيارات', 'الفعاليات', 'الحكومة', 'السياحة', 'التجزئة', 'التعليم'],
        deliverablesAr: ['فكرة إبداعية', 'Storyboard', 'فيلم 3D/AI', 'نسخ سوشيال', 'صور ثابتة', 'أصول حملة'],
        proofAr: 'مقترح Car City يشير إلى مخططات سينمائية وأفلام AI وCGI ونسخ اجتماعية ومرئيات مناطق وصور ثابتة كمخرجات أساسية.',
    },
}

export const serviceContent = baseServiceContent.map((service) => ({
    ...service,
    ...serviceArabicContent[service.slug],
}))

export const servicesSectionHeader = {
    slug: 'services-header',
    title: 'Services',
    titleAr: 'الخدمات',
    disc: 'We build digital services across mobile, immersive technology, AI, and advertising content.',
    discAr: 'نبني خدمات رقمية في تطبيقات الموبايل والتقنيات الغامرة والذكاء الاصطناعي والمحتوى الإعلاني.',
}

const normalize = (value) => String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '')

export const getServiceBySlug = (slug) => serviceContent.find(service => service.slug === slug)

export const listToText = (items) => Array.isArray(items) ? items.join('\n') : String(items || '')

export const textToList = (value, fallback = []) =>
{
    if (Array.isArray(value)) return value;
    if (!value) return fallback;

    const items = String(value)
        .split(/\r?\n/)
        .map(item => item.trim())
        .filter(Boolean);

    return items.length ? items : fallback;
}

export const serviceToFormValues = (service) => ({
    slug: service.slug,
    title: service.title,
    titleAr: service.titleAr || translateText(service.title, LANGUAGES.ar.code),
    label: service.label,
    labelAr: service.labelAr || translateText(service.label, LANGUAGES.ar.code),
    disc: service.summary,
    discAr: service.summaryAr || translateText(service.summary, LANGUAGES.ar.code),
    lead: service.lead,
    leadAr: service.leadAr || translateText(service.lead, LANGUAGES.ar.code),
    whatWeBuild: listToText(service.whatWeBuild),
    whatWeBuildAr: listToText(service.whatWeBuildAr || service.whatWeBuild.map((item) => translateText(item, LANGUAGES.ar.code))),
    deliverables: listToText(service.deliverables),
    deliverablesAr: listToText(service.deliverablesAr || service.deliverables.map((item) => translateText(item, LANGUAGES.ar.code))),
    sectors: listToText(service.sectors),
    sectorsAr: listToText(service.sectorsAr || service.sectors.map((item) => translateText(item, LANGUAGES.ar.code))),
    proof: service.proof,
    proofAr: service.proofAr || translateText(service.proof, LANGUAGES.ar.code),
})

export const mergeServiceRecord = (service, record) =>
{
    const hasEditableContent = record?.slug === service.slug || record?.title === service.title;
    const englishSummary = hasEditableContent ? record?.disc || service.summary : service.summary;
    const englishLead = hasEditableContent ? record?.lead || service.lead : service.lead;
    const englishProof = hasEditableContent ? record?.proof || service.proof : service.proof;
    const englishWhatWeBuild = hasEditableContent ? textToList(record?.whatWeBuild, service.whatWeBuild) : service.whatWeBuild;
    const englishDeliverables = hasEditableContent ? textToList(record?.deliverables, service.deliverables) : service.deliverables;
    const englishSectors = hasEditableContent ? textToList(record?.sectors, service.sectors) : service.sectors;

    return {
        ...service,
        record,
        title: hasEditableContent ? record?.title || service.title : service.title,
        titleAr: hasEditableContent ? record?.titleAr || service.titleAr || translateText(record?.title || service.title, LANGUAGES.ar.code) : service.titleAr,
        label: hasEditableContent ? record?.label || service.label : service.label,
        labelAr: hasEditableContent ? record?.labelAr || service.labelAr || translateText(record?.label || service.label, LANGUAGES.ar.code) : service.labelAr,
        summary: englishSummary,
        summaryAr: hasEditableContent ? record?.discAr || service.summaryAr || translateText(englishSummary, LANGUAGES.ar.code) : service.summaryAr,
        lead: englishLead,
        leadAr: hasEditableContent ? record?.leadAr || service.leadAr || translateText(englishLead, LANGUAGES.ar.code) : service.leadAr,
        whatWeBuild: englishWhatWeBuild,
        whatWeBuildAr: hasEditableContent ? textToList(record?.whatWeBuildAr, service.whatWeBuildAr || englishWhatWeBuild.map((item) => translateText(item, LANGUAGES.ar.code))) : service.whatWeBuildAr,
        deliverables: englishDeliverables,
        deliverablesAr: hasEditableContent ? textToList(record?.deliverablesAr, service.deliverablesAr || englishDeliverables.map((item) => translateText(item, LANGUAGES.ar.code))) : service.deliverablesAr,
        sectors: englishSectors,
        sectorsAr: hasEditableContent ? textToList(record?.sectorsAr, service.sectorsAr || englishSectors.map((item) => translateText(item, LANGUAGES.ar.code))) : service.sectorsAr,
        proof: englishProof,
        proofAr: hasEditableContent ? record?.proofAr || service.proofAr || translateText(englishProof, LANGUAGES.ar.code) : service.proofAr,
        video: hasEditableContent ? record?.video : null,
    }
}

export const localizeService = (service, language) =>
{
    if (!service || language !== LANGUAGES.ar.code) return service;

    return {
        ...service,
        title: service.titleAr || translateText(service.title, language),
        label: service.labelAr || translateText(service.label, language),
        summary: service.summaryAr || translateText(service.summary, language),
        lead: service.leadAr || translateText(service.lead, language),
        whatWeBuild: service.whatWeBuildAr?.length ? service.whatWeBuildAr : service.whatWeBuild.map((item) => translateText(item, language)),
        deliverables: service.deliverablesAr?.length ? service.deliverablesAr : service.deliverables.map((item) => translateText(item, language)),
        sectors: service.sectorsAr?.length ? service.sectorsAr : service.sectors.map((item) => translateText(item, language)),
        proof: service.proofAr || translateText(service.proof, language),
    }
}

export const getServiceRecords = (record = []) =>
{
    const allItems = Array.isArray(record) ? record : [];
    const withoutHeaders = allItems.filter((item, index) => item?.slug !== 'services-header' && !(index === 0 && !serviceContent.some(service => serviceMatchesRecord(service, item))));
    const items = withoutHeaders;
    const usedIds = new Set();

    return serviceContent.map((service, index) =>
    {
        let item = items.find((recordItem) => !usedIds.has(recordItem._id) && recordItem?.slug === service.slug);

        if (!item)
        {
            item = items.find((recordItem) => !usedIds.has(recordItem._id) && serviceMatchesRecord(service, recordItem));
        }

        if (!item)
        {
            item = items[index] && !usedIds.has(items[index]._id) ? items[index] : null;
        }

        if (item) usedIds.add(item._id);

        return mergeServiceRecord(service, item);
    })
}

export const serviceMatchesRecord = (service, record) =>
{
    const title = normalize(record?.title)

    if (record?.slug === service.slug) return true
    if (!title) return false
    if (normalize(service.title) === title) return true
    if (service.slug === 'vr-ar' && ['vr', 'ar', 'vrar', 'xr'].includes(title)) return true
    if (service.slug === 'ai' && title === 'ai') return true
    if (service.slug === 'advertising' && ['advertising', 'ads', '3danimation'].includes(title)) return true
    if (service.slug === 'mobile-apps' && ['mobileapps', 'apps', 'app'].includes(title)) return true

    return false
}
