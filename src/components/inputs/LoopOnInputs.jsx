
import { FormikControl } from './';

export const LoopOnInputs = (props) =>
{
    const { inputs, disabled, isEdit, formik } = props;
    
    return (
        <div
            
        >
            {inputs.map(({ size, xs, ...input }, index) =>{
                const columns = !!size ? size : 12;
                return (
                    <div
                        key={index}
                        
                    >
                        <FormikControl
                            disabled={disabled}
                            isEdit={isEdit}
                            formik={formik}
                            {...input}
                        />
                    </div>
                )
            })}
        </div>
    )
}