import
{
    Input,
    InputArray,
    Password,
} from './'
import Textarea from './Textarea';
import { useLanguage } from '../../i18n/LanguageContext';

export const FormikControl = (props) =>
{
    const { control, size, isEdit, ...rest } = props;
    const { isArabic, t } = useLanguage();
    const localizedProps = {
        ...rest,
        placeholder: t(isArabic && rest.placeholderAr ? rest.placeholderAr : rest.placeholder),
    };

    switch (control)
    {
        case "input":
            return <Input {...localizedProps} />;
        case "password":
            return <Password {...localizedProps} />;
        case "textarea":
            return <Textarea {...localizedProps} />;
        case "array":
            return <InputArray {...localizedProps} />;

        default:
            return null;
    }
}
