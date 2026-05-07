import * as Yup from 'yup';
import { emailNotValid, required } from '../../../assets/validationMessages/validationMessages';

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
        .matches(/^[+0-9][0-9\s().-]{7,20}$/, 'Phone number is not valid')
        .required(required),
    projectNature: Yup.string().required(required),
    projectDetails: Yup.string().max(1500, 'Project details cannot exceed 1500 characters').required(required),
    timeline: Yup.string(),
    budgetRange: Yup.string(),
});
