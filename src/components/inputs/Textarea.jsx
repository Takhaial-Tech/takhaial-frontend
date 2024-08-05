import React from "react";
import { Field, ErrorMessage } from "formik";
import { InputError } from "./";
import classesError from './styles/InputError.module.css'

function Textarea(props)
{
    const { label, name, disable, size, className, disabled, ...rest } = props;
    return (
        

            <Field
                name={name}
                style={{display:"block"}}
                className='block'
            >
                {({ field, form, meta: { touched, error } }) =>
                {
                    const inputError = !!error && touched;

                    return (
                        <div
                            className={`
                            ${inputError ? classesError.formError : ""}
                        `}
                        >
                            <ErrorMessage
                                name={name}
                                component={InputError}
                            />
                            <textarea
                                name={name}
                                id={name}
                                label={label}
                                {...field}
                                {...rest}
                                className={`w-full p-[10px] bg-[#262626] rounded-xl mr-[10px] mb-[10px] backdrop-blur-md bg-[#262626] ${className}`}
                                disabled={disabled}
                            />

                        </div>
                    );
                }}
            </Field >

    );
}

export default Textarea;
