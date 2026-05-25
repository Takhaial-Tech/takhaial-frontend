import React from 'react'

const Btn = (props) =>
{
    const { children, isLoading, className, ...rest } = props;
    return (
        <button
            className={`${isLoading ? 'cursor-not-allowed opacity-60' : ''} transition-all duration-300 w-fit rounded-xl px-[20px] py-[10px] border border-solid border-[#ef4444] text-[#ef4444] bg-[#262626] hover:bg-[#2a1010] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ef4444] ${className}`}
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
