
import { FormikControl } from './';

export const LoopOnInputs = (props) =>
{
    const { inputs, disabled } = props;

    return (
        <>
            {inputs.map((input, index) =>
            {
                return (
                    <FormikControl
                        key={index}
                        disabled={disabled}
                        {...input}
                    />
                )
            })}
        </>
    )
}