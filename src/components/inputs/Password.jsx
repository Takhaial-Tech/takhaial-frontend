import { useState } from 'react'

import { Input } from './'
import { ReactComponent as Visibility } from '../../assets/icons/visibility.svg'
import { ReactComponent as VisibilityOff } from '../../assets/icons/visibilityOff.svg'

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
                type='button'
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
                className='absolute right-[-10px] top-[0] password-icon-btn '
            >
                {showPassword ?
                    <Visibility />
                    :
                    <VisibilityOff />
                }
            </button>
        </Input>
    )
}