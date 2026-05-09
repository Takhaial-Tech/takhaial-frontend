import { useEffect, useRef, useState } from 'react';
import ukFlag from '../assets/icons/uk-flag.svg';
import arabLeagueFlag from '../assets/icons/arab-league-flag.svg';
import { useLanguage } from '../i18n/LanguageContext';
import { LANGUAGES } from '../i18n/translations';

const languageOptions = [
    {
        code: LANGUAGES.en.code,
        label: 'English',
        flag: ukFlag,
    },
    {
        code: LANGUAGES.ar.code,
        label: 'Arabic',
        flag: arabLeagueFlag,
    },
];

const LanguageIcon = () => (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" stroke="currentColor" strokeWidth="1.8" />
        <path d="M3.6 9h16.8M3.6 15h16.8M12 3c2.1 2.4 3.2 5.4 3.2 9s-1.1 6.6-3.2 9M12 3C9.9 5.4 8.8 8.4 8.8 12s1.1 6.6 3.2 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
);

const LanguageSwitcher = ({ className = '' }) =>
{
    const { language, setLanguage, t } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [menuAlign, setMenuAlign] = useState('right');
    const containerRef = useRef(null);
    const activeOption = languageOptions.find((option) => option.code === language) || languageOptions[0];

    useEffect(() =>
    {
        const closeOnOutsideClick = (event) =>
        {
            if (containerRef.current && !containerRef.current.contains(event.target))
            {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', closeOnOutsideClick);
        return () => document.removeEventListener('mousedown', closeOnOutsideClick);
    }, []);

    useEffect(() =>
    {
        if (!isOpen || !containerRef.current) return;

        const updateMenuAlign = () =>
        {
            const rect = containerRef.current.getBoundingClientRect();
            const dropdownWidth = 170;
            const viewportPadding = 12;
            const wouldOverflowLeft = rect.right - dropdownWidth < viewportPadding;

            setMenuAlign(wouldOverflowLeft ? 'left' : 'right');
        };

        updateMenuAlign();
        window.addEventListener('resize', updateMenuAlign);
        return () => window.removeEventListener('resize', updateMenuAlign);
    }, [isOpen]);

    const menuPositionClass = menuAlign === 'left' ? 'left-0 right-auto' : 'right-0 left-auto';

    return (
        <div ref={containerRef} className={`relative z-[60] ${className}`} dir="ltr">
            <button
                type="button"
                aria-label={t('Language')}
                className="flex items-center justify-center gap-2 h-[42px] min-w-[42px] rounded-xl border border-solid border-[#ef4444] bg-[#262626] px-3 text-[#ef4444] transition-all duration-500 hover:bg-[#000]"
                onClick={() => setIsOpen((value) => !value)}
            >
                <LanguageIcon />
                <img src={activeOption.flag} alt="" className="h-[14px] w-[21px] rounded-[2px] object-cover" />
            </button>

            {isOpen &&
                <div className={`absolute ${menuPositionClass} mt-2 w-[170px] overflow-hidden rounded-xl border border-solid border-[#ef4444] bg-[#050505] shadow-3xl`}>
                    {languageOptions.map((option) => (
                        <button
                            key={option.code}
                            type="button"
                            className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-all duration-300 hover:bg-[#262626] ${language === option.code ? 'text-[#ef4444]' : 'text-white'}`}
                            onClick={() =>
                            {
                                setLanguage(option.code);
                                setIsOpen(false);
                            }}
                        >
                            <img src={option.flag} alt="" className="h-[14px] w-[21px] rounded-[2px] object-cover" />
                            <span>{t(option.label)}</span>
                        </button>
                    ))}
                </div>
            }
        </div>
    );
};

export default LanguageSwitcher;
