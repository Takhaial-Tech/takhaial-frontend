import * as Yup from 'yup';
import { emailNotValid, required } from '../../../assets/validationMessages/validationMessages';
import { DEFAULT_LANGUAGE, LANGUAGE_STORAGE_KEY, translateText } from '../../../i18n/translations';

const currentLanguage = () => typeof window === 'undefined'
    ? DEFAULT_LANGUAGE
    : window.localStorage.getItem(LANGUAGE_STORAGE_KEY) || DEFAULT_LANGUAGE;

const validationMessage = (text) => () => translateText(text, currentLanguage());

export const quoteRequestInitialValues = {
    name: '',
    companyName: '',
    jobTitle: '',
    email: '',
    phone: '',
    projectNature: '',
    projectDetails: '',
    timeline: '',
    budgetRange: '',
}

export const quoteRequestValidationSchema = Yup.object({
    name: Yup.string().required(required),
    companyName: Yup.string().required(required),
    jobTitle: Yup.string().required(required),
    email: Yup.string().email(emailNotValid).required(required),
    phone: Yup.string()
        .matches(/^[+0-9][0-9\s().-]{7,20}$/, validationMessage('Phone number is not valid'))
        .required(required),
    projectNature: Yup.string().required(required),
    projectDetails: Yup.string().max(1500, validationMessage('Project details cannot exceed 1500 characters')).required(required),
    timeline: Yup.string(),
    budgetRange: Yup.string(),
});
