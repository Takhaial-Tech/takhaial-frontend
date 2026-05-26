import { Link, Navigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import logo from '../../../assets/icons/logo.svg'
import productsVideo from '../../../assets/videos/products.mp4'
import useGetSection from '../../../hooks/use-get-section'
import useEditItem from '../../../hooks/use-edit-item'
import useAddItem from '../../../hooks/use-add-item'
import EditSection from '../../../components/EditSection'
import LoadingScreen from '../../../components/LoadingScreen'
import { FormikControl } from '../../../components/inputs'
import CompatibleVideo from '../../../components/CompatibleVideo'
import { getLocalizedServiceVideo, getServiceBySlug, getServiceRecords, localizeService, serviceHasDemoVideo, serviceToFormValues } from './serviceContent'
import { serviceDetailInputs } from './productsInputs'
import { useLanguage } from '../../../i18n/LanguageContext'
import LanguageSwitcher from '../../../components/LanguageSwitcher'

const ServiceDetail = () =>
{
    const { serviceSlug } = useParams();
    const [isOpenEditModal, setIsOpenEditModal] = useState(false);
    const [video, setVideo] = useState(null);
    const [videoAr, setVideoAr] = useState(null);
    const isAdmin = !!useSelector(state => state.auth.token);
    const isLoadingGetSection = useGetSection(4);
    const record = useSelector(state => state.sections.sectionsData)[4] || [];
    const { isLoadingEditSection, handleEditSection } = useEditItem(4);
    const { isLoadingAddSection, handleAddSection } = useAddItem(4);
    const { language, t } = useLanguage();
    const fallbackService = getServiceBySlug(serviceSlug);
    const service = getServiceRecords(record).find(item => item.slug === serviceSlug) || fallbackService;
    const localizedService = localizeService(service, language);
    const hasDemoVideo = serviceHasDemoVideo(service);
    const selectedVideo = getLocalizedServiceVideo(service, language);

    if (!fallbackService)
    {
        return <Navigate to="/" replace={true} />
    }

    const onChangeVideo = (e) =>
    {
        setVideo(e.target.files?.[0] || null)
    }

    const onChangeVideoAr = (e) =>
    {
        setVideoAr(e.target.files?.[0] || null)
    }

    const onEdit = (values) =>
    {
        const serviceValues = {
            ...values,
            slug: service.slug,
        }
        const onSuccess = () =>
        {
            setIsOpenEditModal(false);
            setVideo(null);
            setVideoAr(null);
        }

        if (service.record?._id)
        {
            handleEditSection(serviceValues, service.record._id, onSuccess, {
                video,
                videoAr,
            })
            return;
        }

        handleAddSection(serviceValues, onSuccess, { video, videoAr })
    }

    const isSaving = isLoadingEditSection || isLoadingAddSection;

    return (
        <main className="min-h-screen bg-[#000] text-white relative overflow-hidden">
            {isLoadingGetSection && <LoadingScreen isAbsolute={true} />}
            <div className="bg-gradient-radial2 absolute top-0 left-0 right-0 bottom-0 z-[0]" />
            <CompatibleVideo
                src={productsVideo}
                autoPlay
                muted
                loop
                controls={false}
                preload="auto"
                className="rotate-100 absolute left-0 top-0 w-full h-full object-cover opacity-30 z-[0]"
            />
            <div className="relative z-10 px-[20px] py-[28px] md:px-10">
                <header className="flex items-center justify-between gap-4 mb-12">
                    <Link to="/#section_1">
                        <img src={logo} alt="Takhaial" width={170} height={44} />
                    </Link>
                    <div className="flex items-center gap-3">
                        <Link
                            to="/#section_4"
                            className="transition-all duration-500 rounded-xl px-[18px] py-[9px] border border-solid border-[#ef4444] text-[#ef4444] bg-[#262626]"
                        >
                            {t('Back to Services')}
                        </Link>
                        <LanguageSwitcher />
                    </div>
                </header>
                {isAdmin &&
                    <EditSection
                        editTitle="Edit Service"
                        isOpenEditModal={isOpenEditModal}
                        setIsOpenEditModal={setIsOpenEditModal}
                        onEdit={onEdit}
                        isLoadingEdit={isSaving}
                        inputs={serviceDetailInputs}
                        initialValues={serviceToFormValues(service)}
                        className="right-[20px] top-[92px] md:right-[40px]"
                    >
                        {hasDemoVideo &&
                            <>
                                <h1>{t('English Demo Video')}</h1>
                                <FormikControl
                                    disabled={isSaving}
                                    control="input"
                                    type="file"
                                    name="video"
                                    accept="video/*"
                                    placeholder="English Demo Video"
                                    className="block md:w-full w-[100%]"
                                    containerClassName="block w-full"
                                    onChange={onChangeVideo}
                                />
                                <h1>{t('Arabic Demo Video')}</h1>
                                <FormikControl
                                    disabled={isSaving}
                                    control="input"
                                    type="file"
                                    name="videoAr"
                                    accept="video/*"
                                    placeholder="Arabic Demo Video"
                                    className="block md:w-full w-[100%]"
                                    containerClassName="block w-full"
                                    onChange={onChangeVideoAr}
                                />
                            </>
                        }
                    </EditSection>
                }

                <section className="md:container md:mx-auto">
                    <div className="grid md:grid-cols-[220px_1fr] gap-8 items-start mb-12">
                        <div className="border border-solid border-[#ef4444] rounded-xl p-6 bg-[#000]/70">
                            <img src={service.icon} alt="" className="max-h-[180px] m-auto" />
                        </div>
                        <div>
                            <p className="text-[#ef4444] font-bold mb-3">{localizedService.label}</p>
                            <h1 className="text-4xl md:text-7xl font-bold leading-tight">
                                {localizedService.title}
                            </h1>
                            <p className="mt-5 text-xl leading-relaxed max-w-[900px] text-[#ccc]">
                                {localizedService.lead}
                            </p>
                        </div>
                    </div>

                    {hasDemoVideo && (selectedVideo || isAdmin) &&
                        <section className="border border-solid border-[#ef4444] rounded-xl p-6 bg-[#000]/70 mb-10">
                            <h2 className="text-2xl font-bold mb-4">{t('Demo Video')}</h2>
                            {selectedVideo ? (
                                <CompatibleVideo
                                    src={selectedVideo}
                                    title={`${localizedService.title} - ${t('Demo Video')}`}
                                    className="w-full max-h-[70vh] rounded-xl bg-[#000]"
                                />
                            ) : (
                                <p className="text-[#ccc] leading-relaxed">
                                    {t('No introduction video is uploaded yet. Use Edit Service to upload one.')}
                                </p>
                            )}
                        </section>
                    }

                    <div className="grid md:grid-cols-2 gap-6 mb-10">
                        <section className="border border-solid border-[#ef4444] rounded-xl p-6 bg-[#000]/70">
                            <h2 className="text-2xl font-bold mb-4">{t('What we build')}</h2>
                            <ul className="grid gap-3 text-[#ddd] leading-relaxed">
                                {localizedService.whatWeBuild.map((item) => (
                                    <li key={item} className="border-b border-solid border-[#262626] pb-3">{item}</li>
                                ))}
                            </ul>
                        </section>

                        <section className="border border-solid border-[#ef4444] rounded-xl p-6 bg-[#000]/70">
                            <h2 className="text-2xl font-bold mb-4">{t('Deliverables')}</h2>
                            <div className="flex flex-wrap gap-3">
                                {localizedService.deliverables.map((item) => (
                                    <span key={item} className="rounded-xl px-[14px] py-[8px] bg-[#262626] text-[#ef4444]">
                                        {item}
                                    </span>
                                ))}
                            </div>
                            <h2 className="text-2xl font-bold mt-8 mb-4">{t('Sectors')}</h2>
                            <div className="grid sm:grid-cols-2 gap-3 text-[#ddd]">
                                {localizedService.sectors.map((item) => (
                                    <span key={item} className="border border-solid border-[#262626] rounded-xl p-3">
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </section>
                    </div>

                    <section className="border border-solid border-[#ef4444] rounded-xl p-6 bg-[#000]/70 mb-12">
                        <h2 className="text-2xl font-bold mb-3">{t('How Takhaial approaches it')}</h2>
                        <p className="text-[#ddd] leading-relaxed mb-5">
                            {t('We start by understanding the business goal, audience, content, and success metric. Then we shape the user journey, build the visual or technical prototype, test the experience, and prepare a production-ready version for web, mobile, events, headsets, or campaign channels.')}
                        </p>
                        <p className="text-[#ccc] leading-relaxed">
                            {localizedService.proof}
                        </p>
                    </section>

                    <div className="flex flex-wrap gap-4 mb-16">
                        <Link
                            to={`/services/${service.slug}/request-quote`}
                            className="transition-all duration-500 rounded-xl px-[20px] py-[10px] border border-solid border-[#ef4444] text-[#ef4444] bg-[#262626]"
                        >
                            {t('Request a Quote')}
                        </Link>
                        <Link
                            to="/#section_4"
                            className="transition-all duration-500 rounded-xl px-[20px] py-[10px] border border-solid border-[#ef4444] text-[#ef4444] bg-[#000]"
                        >
                            {t('View All Services')}
                        </Link>
                    </div>
                </section>
            </div>
        </main>
    )
}

export default ServiceDetail
