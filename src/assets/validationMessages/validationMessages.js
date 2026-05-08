import { DEFAULT_LANGUAGE, LANGUAGE_STORAGE_KEY, translateText } from "../../i18n/translations";

const currentLanguage = () =>
{
    if (typeof window === 'undefined') return DEFAULT_LANGUAGE;
    return window.localStorage.getItem(LANGUAGE_STORAGE_KEY) || DEFAULT_LANGUAGE;
};

const message = (text) => translateText(text, currentLanguage());

export const required = () => message("Required");

export const emailNotValid = () => message("Email isn't valid");

export const passwordMin = () => message("Password must be at least 8 characters");

export const messageMax = () => message("Message cannot exceed 1000 characters")

export const phoneNotValid = () => message('Phone number is not valid')

