import { useState } from 'react'

import { Input } from './'
export const Password = (props) =>
{
    const {
        ...rest
    } = props;
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) =>
    {
        event.preventDefault();
    };

    return (
        <Input
            type={showPassword ? 'text' : 'password'}
            {...rest}
        >
            <button
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
                // className={classes.iconButton}
            >
                {/* {showPassword ?
                    <VisibilityOffIcon
                        className={classes.icon}
                    /> :
                    <VisibilityIcon
                        className={classes.icon}
                    />} */}
            </button>
        </Input>
    )
}