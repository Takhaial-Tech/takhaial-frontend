import
{
    Input,
    InputArray,
    Password,
} from './'
import Textarea from './Textarea';

export const FormikControl = (props) =>
{
    const { control, size, isEdit, ...rest } = props;
    switch (control)
    {
        case "input":
            return <Input {...rest} />;
        case "password":
            return <Password {...rest} />;
        case "textarea":
            return <Textarea {...rest} />;
        case "array":
            return <InputArray {...rest} />;

        default:
            return null;
    }
}