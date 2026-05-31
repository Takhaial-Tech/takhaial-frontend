import { useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'
import logo from '../../../assets/icons/logo.svg'
import LanguageSwitcher from '../../../components/LanguageSwitcher'
import { useLanguage } from '../../../i18n/LanguageContext'
import { legalPages } from './legalContent'

const labels = {
    home: {
        en: 'Back to Home',
        ar: 'العودة للرئيسية',
    },
    privacy: {
        en: 'Privacy Policy',
        ar: 'سياسة الخصوصية',
    },
    terms: {
        en: 'Terms of Service',
        ar: 'شروط الخدمة',
    },
    company: {
        en: 'Takhaial Tech',
        ar: 'تخيل تك',
    },
}

const getLocalizedValue = (value, language) => value?.[language] || value?.en || ''

const setMetaContent = (name, content) =>
{
    const selector = `meta[name="${name}"]`;
    let tag = document.head.querySelector(selector);
    if (!tag)
    {
        tag = document.createElement('meta');
        tag.setAttribute('name', name);
        document.head.appendChild(tag);
    }
    tag.setAttribute('content', content);
}

const setCanonical = (href) =>
{
    let tag = document.head.querySelector('link[rel="canonical"]');
    if (!tag)
    {
        tag = document.createElement('link');
        tag.setAttribute('rel', 'canonical');
        document.head.appendChild(tag);
    }
    tag.setAttribute('href', href);
}

const LegalPage = ({ pageKey }) =>
{
    const { language, direction } = useLanguage();
    const page = legalPages[pageKey];

    useEffect(() =>
    {
        if (!page) return;

        const title = getLocalizedValue(page.title, language);
        const description = getLocalizedValue(page.intro, language);
        const url = `https://takhaialtech.com/${pageKey}`;

        document.title = `${title} | Takhaial Tech`;
        setMetaContent('description', description);
        setCanonical(url);
    }, [language, page, pageKey]);

    if (!page)
    {
        return <Navigate to="/" replace={true} />
    }

    const title = getLocalizedValue(page.title, language);
    const intro = getLocalizedValue(page.intro, language);
    const updatedAt = getLocalizedValue(page.updatedAt, language);

    return (
        <main className="min-h-screen bg-[#000] text-white relative overflow-hidden" dir={direction}>
            <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_22%_18%,rgba(6,94,225,0.28),transparent_34%),radial-gradient(circle_at_76%_10%,rgba(239,68,68,0.22),transparent_30%),linear-gradient(180deg,#02040a_0%,#000_55%,#02040a_100%)]" />
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#ef4444] to-transparent opacity-80" />
            <div className="relative z-10 px-[20px] py-[24px] md:px-10">
                <header className="flex items-center justify-between gap-4 mb-10">
                    <Link to="/#section_1" className="flex items-center">
                        <img src={logo} alt="Takhaial" width={170} height={44} className="max-w-[145px] md:max-w-[170px]" />
                    </Link>
                    <div className="flex items-center gap-3">
                        <Link
                            to="/#section_1"
                            className="transition-all duration-300 rounded-xl px-[16px] py-[9px] border border-solid border-[#ef4444] text-[#ef4444] bg-[#262626] hover:bg-[#2a1010] hover:text-white"
                        >
                            {getLocalizedValue(labels.home, language)}
                        </Link>
                        <LanguageSwitcher />
                    </div>
                </header>

                <section className="mx-auto w-full max-w-[980px] pb-16">
                    <div className="mb-8 border border-solid border-[#ef4444]/80 rounded-2xl bg-[#030712]/80 p-5 md:p-8 shadow-[0_18px_70px_rgba(0,0,0,0.45)]">
                        <p className="text-[#ef4444] font-bold mb-3">{getLocalizedValue(labels.company, language)}</p>
                        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">{title}</h1>
                        <p className="text-[#ccc] leading-relaxed text-lg">{intro}</p>
                        <p className="mt-5 text-sm text-[#999]">{updatedAt}</p>
                    </div>

                    <div className="grid gap-5">
                        {page.sections.map((section) => (
                            <article key={getLocalizedValue(section.heading, 'en')} className="border border-solid border-[#262626] rounded-2xl bg-[#050505]/82 p-5 md:p-7">
                                <h2 className="text-2xl font-bold mb-4">{getLocalizedValue(section.heading, language)}</h2>
                                <ul className="grid gap-3 text-[#ddd] leading-relaxed">
                                    {getLocalizedValue(section.body, language).map((item) => (
                                        <li key={item} className="flex gap-3">
                                            <span className="mt-[0.7em] h-[6px] w-[6px] shrink-0 rounded-full bg-[#ef4444]" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </article>
                        ))}
                    </div>

                    <nav className="mt-8 flex flex-wrap gap-3">
                        <Link
                            to="/privacy-policy"
                            className="transition-all duration-300 rounded-xl px-[16px] py-[9px] border border-solid border-[#ef4444] text-[#ef4444] bg-[#111] hover:bg-[#2a1010] hover:text-white"
                        >
                            {getLocalizedValue(labels.privacy, language)}
                        </Link>
                        <Link
                            to="/terms-of-service"
                            className="transition-all duration-300 rounded-xl px-[16px] py-[9px] border border-solid border-[#ef4444] text-[#ef4444] bg-[#111] hover:bg-[#2a1010] hover:text-white"
                        >
                            {getLocalizedValue(labels.terms, language)}
                        </Link>
                    </nav>
                </section>
            </div>
        </main>
    )
}

export default LegalPage
