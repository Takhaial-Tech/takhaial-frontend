import { Form, Formik } from "formik";

export const FormikContainer = (props) =>
{
    const {
        initialValues,
        validationSchema,
        onSubmit,
        enableReinitialize,
        getFormik,
        children
    } = props;

    // get from first error name of error and scroll to input of it
    const handleScrollToError = (errors, formik) =>
    {
        const firstErrorId = Object.keys(errors)[0];
        let errorElement;
        if (firstErrorId) errorElement = document.getElementById(firstErrorId);
        if (errorElement && formik.touched[firstErrorId])
        {
            errorElement.scrollIntoView({ behavior: "smooth", block: "center" })
        }
    }

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
            enableReinitialize={enableReinitialize}
        >
            {(formik) =>
            {
                handleScrollToError(formik.errors, formik);
                // to pass formik down to children
                if (getFormik) getFormik(formik);
                return (
                    <Form>
                        {children}
                    </Form>)
            }}
        </Formik>
    );
}