import *  as Yup from 'yup';
import
{
    messageMax,
    emailNotValid,
    required,
    phoneNotValid
} from '../../../assets/validationMessages/validationMessages.js';

export const contactValidationSchema = Yup.object({
    name: Yup.string()
        .required(required),
    email: Yup.string()
        .email(emailNotValid)
        .required(required),
    phone: Yup.string()
        .matches(
            /^((\+|00)\d{1,3})?(\d{10})$/,
            phoneNotValid
        )
        .required(required),
    message: Yup.string()
        .max(1000, messageMax)
        .required(required),
});