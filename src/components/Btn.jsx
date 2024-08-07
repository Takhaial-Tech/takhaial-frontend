import React from 'react'

const Btn = (props) =>
{
    const { children, isLoading, className, ...rest } = props;
    return (
        <button
            className={`${isLoading ? 'cursor-not-allowed' : ''} transition-all duration-500 w-fit rounded-xl  px-[20px] py-[10px] border border-solid border-[#ef4444] text-[#ef4444] bg-[#262626] ${className}`}
            onClick={rest.onClick}
            disabled={isLoading}
            {...rest}
        >
            {!!isLoading ?
                <div className='loading-spinner m-auto sm-loading'></div> :
                <>{children}</>
            }
        </button>
    )
}

export default Btn