import React from 'react'
import { FormikContainer, Input, Password } from '../../../components/inputs'
import { loginIntialValues } from './loginInputsData'
import Btn from '../../../components/Btn'

const LoginUi = ({ isLoadingLogin, handleLogin }) =>
{
    return (
        <div className=' text-[#ccc] flex justify-center items-center h-screen w-screen'>

            <div className='border rounded-lg border-[#ef4444] p-6 max-w-[400px]'>
                <h1 className='mb-5'>Admin login</h1>
                <FormikContainer
                    initialValues={loginIntialValues}
                    onSubmit={handleLogin}
                >
                    <Input
                        name="username"
                        type="text"
                        disabled={isLoadingLogin}
                        placeholder="Username"
                        className='block md:w-full'
                        containerClassName='md:block block w-full'
                    />
                    <Password
                        name="password"
                        disabled={isLoadingLogin}
                        placeholder="Password"
                        className='block md:w-full'
                        containerClassName='md:block  w-full relative '
                    />
                    <Btn
                        isLoading={isLoadingLogin}
                        type="submit"
                        className={`mt-5 w-full`}>
                        Login
                    </Btn>
                </FormikContainer>
            </div>

        </div>
    )
}

export default LoginUi