import React from "react";
import { ErrorMessage, Field } from "formik";
import classesError from './styles/InputError.module.css'
import { InputError } from "./";

export const Input = (props) =>
{
    const {
        label,
        name,
        type,
        disabled,
        dir,
        children,
        onChange,
        onBlur,
        validateOnInput,
        formik,
        isCustomValidate,
        className,
        containerClassName,
        ...rest
    } = props;

    return (
        <Field
            name={name}
            validate={(value) => isCustomValidate && validateOnInput(value, formik, name)}
        >
            {({ field, form, meta: { touched, error } }) =>
            {
                const inputError = !!error && touched;
                const { handleBlur, setFieldValue } = form;
                const isFileInput = type === "file";
                const fieldProps = isFileInput ? { name: field.name } : field;

                return (
                    <div
                        className={`
                            md:inline-block
                            ${inputError ? classesError.formError : ""}
                            ${containerClassName}
                        `}
                        // style={{display:"inline-block"}}
                        // className='md:inline-block'
                    >
                        <ErrorMessage
                            name={name}
                            component={InputError}
                        />
                        <input
                            name={name}
                            id={name}
                            type={type}
                            label={label}
                            dir={dir}
                            {...fieldProps}
                            {...rest}
                            className={`md:w-auto w-full p-[10px] bg-[#262626] rounded-xl mb-[10px] backdrop-blur-md bg-[#262626] ${className}`}
                            onBlur={(e) =>
                            {
                                if (onBlur) onBlur(e, handleBlur);
                                else handleBlur(e);
                            }}
                            onChange={(e) =>
                            {
                                if (isFileInput)
                                {
                                    setFieldValue(name, e.currentTarget.files?.[0] || null)
                                } else
                                {
                                    setFieldValue(name, e.target.value)
                                }

                                if (onChange) onChange(e);
                            }}
                            disabled={disabled}
                        />
                        {children}
                    </div>
                );
            }}
        </Field >
    );
}
