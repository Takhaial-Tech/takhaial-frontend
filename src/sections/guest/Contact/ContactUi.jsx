import ctaicon from '../../../assets/icons/ctaicon.svg'
import contact_img from '../../../assets/icons/callicon.svg'
import mailicon from '../../../assets/icons/mailicon.svg'
import cta from '../../../assets/icons/cta.svg'
import contactVideo from '../../../assets/videos/contact.mp4'
import QuickActions from '../../../components/QuickActions'
import FutureChatbot from '../../../components/FutureChatbot'
import { FormikContainer, Input } from '../../../components/inputs'
import { contactIntialValues } from './ContactInputsData'
import Textarea from '../../../components/inputs/Textarea'
import { contactValidationSchema } from './contactValidationSchema'
import { useState } from 'react'
import Btn from '../../../components/Btn'
import EditSection from '../../../components/EditSection'
import { contactSettingsInputs } from './contactSettingsInputs'
import { useLanguage } from '../../../i18n/LanguageContext'
import { getLocalizedField } from '../../../i18n/localizedContent'
import CompatibleVideo from '../../../components/CompatibleVideo'

const ContactUi = (props) =>
{
    const { channels, settings, onEditSettings, onSendMessage, isAdmin, isLoadingEditSettings, logout } = props;
    const { language, t } = useLanguage();
    const title = getLocalizedField(settings, 'contactTitle', language);
    const desc = getLocalizedField(settings, 'contactDesc', language);
    const [isOpenEditSettingsModal, setIsOpenEditSettingsModal] = useState(false);
    return (
        <>
            <section id="section_9" className={' mb-20 md:mb-0 min-h-screen relative text-white flex justify-center items-center pt-[6rem] pb-[7rem] md:pb-0 px-[20px] bg-[#020815] z-[1] grid'} >
                <div className="bg-gradient-radial absolute top-0 left-0 right-0 bottom-0 z-[0]" />
                {isAdmin &&
                    <EditSection
                        editTitle="Edit Contact Info"
                        isOpenEditModal={isOpenEditSettingsModal}
                        setIsOpenEditModal={setIsOpenEditSettingsModal}
                        onEdit={(values) => onEditSettings(values, () => setIsOpenEditSettingsModal(false))}
                        isLoadingEdit={isLoadingEditSettings}
                        inputs={contactSettingsInputs}
                        initialValues={{
                            contactTitle: settings.contactTitle,
                            contactTitleAr: settings.contactTitleAr,
                            contactDesc: settings.contactDesc,
                            contactDescAr: settings.contactDescAr,
                            email: settings.email,
                            phone: settings.phone,
                            whatsapp: settings.whatsapp,
                            facebook: settings.facebook,
                            x: settings.x,
                            linkedin: settings.linkedin,
                            instagram: settings.instagram,
                            tiktok: settings.tiktok,
                        }}
                        actionTitle="Save Contact Info"
                        className='right-[20px]'
                    />
                }

                <div className="z-30 text-center" >
                    <img alt="" className="m-auto" src={ctaicon} height={80} width={80} />
                    <h1 className="font-bold justify-self-center text-2xl" >{title} </h1>
                    <p className="mt-30 justify-self-center" >
                        {desc}
                    </p>
                </div>
                <ul className=" justify-self-center text-white flex w-fit justify-self-center z-30 gap-4" >
                    <a href={`tel:${settings.phone}`} className="w-[100px] hover:shadow-3xl transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ef4444] pr-[10px] pl-[10px] pt-[10px] pb-[10px] content-center bg-[#262626] rounded-2xl " >
                        <li className="flex items-center justify-center gap-2">
                            <img alt={''} width={15} height={15} src={contact_img} />
                            <label className='cursor-pointer '> {t('Call')} </label>
                        </li>
                    </a>
                    <a href={`mailto:${settings.email}`} className=" hover:shadow-3xl transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ef4444] w-fit  pr-[10px] pl-[10px] pt-[10px] pb-[10px] content-center bg-[#262626] rounded-2xl " >
                        <li className="flex items-center justify-center gap-2">
                            <img alt={''} width={15} height={15} src={mailicon} />
                            <label className="text-nowrap cursor-pointer"> {t('Email')} </label>
                        </li>
                    </a>
                </ul>
                <img src={cta} alt="" width={600} height={600} className="place-self-center absolute z-0" />
                <div className="w-full mb-10 mt-10 md:mt-[10px] z-30  justify-self-center relative">
                    <FormikContainer
                        initialValues={contactIntialValues}
                        validationSchema={contactValidationSchema}
                        onSubmit={onSendMessage}>
                        <div className={'grid-cols-3 '} >
                            <Input
                                type="text"
                                placeholder={t("Name")}
                                name={"name"}
                                className='mr-[10px]'
                            />
                            <Input
                                type="text"
                                name={"phone"}
                                placeholder={t("Phone")}
                                className='mr-[10px]'
                            />
                            <Input
                                type="email"
                                name="email"
                                placeholder={t("Email")}
                            />
                        </div>
                        <Textarea
                            name='message'
                            placeholder={t("Message")}
                            rows="3"
                        />
                        <button type="submit" className="transition-all duration-300 w-fit rounded-xl px-[20px] py-[10px] border border-solid border-[#ef4444] text-[#ef4444] bg-[#262626] hover:bg-[#2a1010] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ef4444]">
                            {t('Send')}
                        </button>
                    </FormikContainer>
                </div>
                <ul className=" z-30 mb-3 justify-self-center text-white flex width-fit gap-3" >
                    {channels.map((a, k) =>
                        <a target='__blank' key={k} className={"hover:border-[#ef4444] hover:text-[#ef4444] transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ef4444] pt-[8px] pb-[5px] pr-[15px] pl-[15px] content-center bg-[#262626] rounded-full border border-[#111] "} href={a.href}>
                            <li>
                                <img width={15} height={15} alt="" src={a.img} />
                            </li>
                        </a>
                    )}
                </ul>
                <p className="whitespace-break-spaces z-30 mb-3 justify-self-center text-white flex width-fit flex-wrap text-center justify-center gap-1" > &copy; {new Date().getFullYear()} <a href="#section_1" >takhaialtech.com</a> {t('All rights reserved.')} </p>
                {<CompatibleVideo
                    src={contactVideo}
                    autoPlay
                    muted
                    loop
                    controls={false}
                    preload="auto"
                    className=" absolute  left-0 z-[-1] top-[0] h-[100vh] bottom-[0] w-full  object-cover" />
                }
            </section>


            <div className="future-chatbot-anchor future-chatbot-anchor--floating">
                <FutureChatbot />
            </div>
            <div className={'quick-action-floating rounded-2xl fixed z-40 right-[20px] w-[300px] max-w-[calc(100vw-40px)] bg-[#050505]/95 border-[#ef4444] border border-solid p-2 shadow-[0_18px_48px_rgba(0,0,0,0.42)]'} style={{ bottom: 'max(20px, env(safe-area-inset-bottom))' }} >
                <h2 className="quick-action-title text-white mb-2 px-1">{t('Quick action')}</h2>

                {isAdmin ? <Btn className={"w-full "} type="button" onClick={logout}>{t('Logout')}</Btn> : <QuickActions />}
            </div>
        </>
    )
}

export default ContactUi
