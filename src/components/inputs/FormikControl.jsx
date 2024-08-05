import
{
    Input,
    InputArray,
    Password,
} from './'

export const FormikControl = (props) =>
{
    const { control, size, isEdit, ...rest } = props;
    switch (control)
    {
        case "input":
            return <Input {...rest} />;
        case "password":
            return <Password {...rest} />;
        case "array":
            return <InputArray {...rest} />;

        default:
            return null;
    }
}