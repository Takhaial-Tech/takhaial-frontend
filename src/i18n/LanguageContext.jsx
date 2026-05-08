import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { DEFAULT_LANGUAGE, LANGUAGES, LANGUAGE_STORAGE_KEY, translateText } from './translations';

const LanguageContext = createContext({
    direction: LANGUAGES.en.dir,
    isArabic: false,
    language: DEFAULT_LANGUAGE,
    setLanguage: () => {},
    t: (value) => value,
});

const getInitialLanguage = () =>
{
    if (typeof window === 'undefined') return DEFAULT_LANGUAGE;

    const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return LANGUAGES[storedLanguage] ? storedLanguage : DEFAULT_LANGUAGE;
};

export const LanguageProvider = ({ children }) =>
{
    const [language, setLanguageState] = useState(getInitialLanguage);
    const direction = LANGUAGES[language]?.dir || LANGUAGES.en.dir;
    const isArabic = language === LANGUAGES.ar.code;

    const setLanguage = useCallback((nextLanguage) =>
    {
        if (!LANGUAGES[nextLanguage]) return;

        setLanguageState(nextLanguage);
        window.localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
    }, []);

    useEffect(() =>
    {
        document.documentElement.lang = language;
        document.documentElement.dir = direction;
        document.body.dir = direction;
    }, [direction, language]);

    const value = useMemo(() => ({
        direction,
        isArabic,
        language,
        setLanguage,
        t: (text) => translateText(text, language),
    }), [direction, isArabic, language, setLanguage]);

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
