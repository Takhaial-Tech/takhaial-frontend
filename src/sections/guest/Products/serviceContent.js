import mobileAppsIcon from '../../../assets/icons/mobile-apps-service.svg'
import vrArIcon from '../../../assets/icons/vr-ar-service.svg'
import aiIcon from '../../../assets/icons/ai-service.svg'
import advertisingIcon from '../../../assets/icons/advertising-service.svg'

export const serviceContent = [
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
    label: service.label,
    disc: service.summary,
    lead: service.lead,
    whatWeBuild: listToText(service.whatWeBuild),
    deliverables: listToText(service.deliverables),
    sectors: listToText(service.sectors),
    proof: service.proof,
})

export const mergeServiceRecord = (service, record) =>
{
    const hasEditableContent = record?.slug === service.slug || record?.title === service.title;

    return {
        ...service,
        record,
        title: hasEditableContent ? record?.title || service.title : service.title,
        label: hasEditableContent ? record?.label || service.label : service.label,
        summary: hasEditableContent ? record?.disc || service.summary : service.summary,
        lead: hasEditableContent ? record?.lead || service.lead : service.lead,
        whatWeBuild: hasEditableContent ? textToList(record?.whatWeBuild, service.whatWeBuild) : service.whatWeBuild,
        deliverables: hasEditableContent ? textToList(record?.deliverables, service.deliverables) : service.deliverables,
        sectors: hasEditableContent ? textToList(record?.sectors, service.sectors) : service.sectors,
        proof: hasEditableContent ? record?.proof || service.proof : service.proof,
        video: record?.video,
    }
}

export const getServiceRecords = (record = []) =>
{
    const allItems = Array.isArray(record) ? record : [];
    const firstItemIsHeader = allItems[0] && !serviceContent.some(service => serviceMatchesRecord(service, allItems[0]));
    const items = firstItemIsHeader ? allItems.slice(1) : allItems;
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
