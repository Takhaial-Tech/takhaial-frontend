import classes from "./styles/InputError.module.css"

export const InputError = (props) =>
{
    const { children } = props;
    return (
        <div
            className={classes.errorText}
        >
                {children}
        </div>
    )
}