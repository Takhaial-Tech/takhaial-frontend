import React from 'react'
import { FormikContainer, Input, Password } from '../../../components/inputs'
import { loginIntialValues } from './loginInputsData'
import Btn from '../../../components/Btn'
import { loginValidationSchema } from './loginValidationSchema'
import { useLanguage } from '../../../i18n/LanguageContext'
import LanguageSwitcher from '../../../components/LanguageSwitcher'

const LoginUi = ({ isLoadingLogin, handleLogin }) =>
{
    const { t } = useLanguage();

    return (
        <div className=' text-[#ccc] flex justify-center items-center h-screen w-screen'>
            <div className="fixed top-[18px] right-[20px]">
                <LanguageSwitcher />
            </div>

            <div className='border rounded-lg border-[#ef4444] p-6 max-w-[400px]'>
                <h1 className='mb-5'>{t('Admin login')}</h1>
                <FormikContainer
                    initialValues={loginIntialValues}
                    validationSchema={loginValidationSchema}
                    onSubmit={handleLogin}
                >
                    <Input
                        name="username"
                        type="text"
                        disabled={isLoadingLogin}
                        placeholder={t("Username")}
                        className='block md:w-full'
                        containerClassName='md:block block w-full'
                    />
                    <Password
                        name="password"
                        disabled={isLoadingLogin}
                        placeholder={t("Password")}
                        className='block md:w-full'
                        containerClassName='md:block  w-full relative '
                    />
                    <Btn
                        isLoading={isLoadingLogin}
                        type="submit"
                        className={`mt-5 w-full`}>
                        {t('Login')}
                    </Btn>
                </FormikContainer>
            </div>

        </div>
    )
}

export default LoginUi
