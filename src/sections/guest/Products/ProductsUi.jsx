import watchIcon from '../../../assets/icons/watch.svg'
import quoteIcon from '../../../assets/icons/qouticonrev.svg'
import productsVideo from '../../../assets/videos/products.mp4'
import CustomModal from '../../../components/CustomModal';
import { useEffect, useState } from 'react';
import EditSection from '../../../components/EditSection';
import LoadingScreen from '../../../components/LoadingScreen';
import { productInputsData, productsTitleInput } from './productsInputs';
import { FormikControl } from '../../../components/inputs';
import { Link } from 'react-router-dom';
import CompatibleVideo from '../../../components/CompatibleVideo';
import { useLanguage } from '../../../i18n/LanguageContext';
import { getBilingualInitialValues, getLocalizedField } from '../../../i18n/localizedContent';
import { getLocalizedServiceVideos, localizeService, serviceHasDemoVideo, servicesSectionHeader } from './serviceContent';

const ProductsUi = (props) =>
{
    const { onChangeVideos, onChangeVideosAr, header, onEditTitle, setActiveIntro, activeIntro, isLoadingGetSection, services, isAdmin, onEdit, isLoadingEdit, isOpenEditModal, setIsOpenEditModal, isOpenEditTitleModal, setIsOpenEditTitleModal } = props;
    const { language, t } = useLanguage();
    const localizedTitle = getLocalizedField(header, 'title', language, servicesSectionHeader.title);
    const localizedDesc = getLocalizedField(header, 'disc', language, servicesSectionHeader.disc);
    const localizedActiveIntro = localizeService(activeIntro, language);
    const activeIntroVideos = getLocalizedServiceVideos(activeIntro, language);
    const [activeDemoIndex, setActiveDemoIndex] = useState(0);
    const activeIntroVideo = activeIntroVideos[activeDemoIndex] || activeIntroVideos[0];
    useEffect(() =>
    {
        setActiveDemoIndex(0);
    }, [activeIntro?.slug, language])

    return (
        <>
            <section id="section_4" className={'min-h-[100vh] content-center relative text-white flex justify-center items-center pt-[6rem] pb-[2rem]  bg-[#000] z-[1] grid'}>
                {isLoadingGetSection && <LoadingScreen isAbsolute={true} />}

                <div className="bg-gradient-radial2 absolute top-[-4px] left-0 right-0 bottom-[-4px] z-[0]" />
                {isAdmin &&
                    <EditSection
                        editTitle="Edit Header"
                        isOpenEditModal={isOpenEditTitleModal}
                        setIsOpenEditModal={setIsOpenEditTitleModal}
                        onEdit={onEditTitle}
                        isLoadingEdit={isLoadingEdit}
                        inputs={productsTitleInput}
                        initialValues={getBilingualInitialValues(header, ['title', 'disc'], servicesSectionHeader)}
                        className='right-[20px]'
                    />
                }
                <div className={`${isAdmin ? "mt-[5rem]" : ""} mb-[3rem] text-center z-10`}>
                    <h1 className="font-bold justify-self-center text-3xl md:text-4xl mb-4 glitch-trans" data-glitch={localizedTitle}>{localizedTitle}</h1>
                    <p className="text-[#ccc] max-w-[760px] m-auto px-[20px]">
                        {localizedDesc}
                    </p>
                </div>
                <div className="mx-auto w-full max-w-[1840px] px-4 sm:px-6 lg:px-8">
                    <div className="relative w-full grid md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 gap-7">
                        {services.map((service, key) =>
                        {
                            const localizedService = localizeService(service, language);
                            const hasDemoVideo = serviceHasDemoVideo(service);

                            return (
                            <div key={key} className={'relative md:mb-0 mb-5 '}>
                                <div className="flex h-full flex-col border border-solid border-[red] rounded-xl bg-[#000]/60 transition-all duration-500 hover:scale-105 hover:bg-[#000] hover:shadow-3xl group/item" key={key} >
                                    {isAdmin &&
                                        <EditSection
                                            isItem={true}
                                            itemId={service.slug}
                                            editTitle="Edit"
                                            className="top-[16px] right-[26px] mt-[0px]"
                                            isOpenEditModal={isOpenEditModal === service.slug}
                                            setIsOpenEditModal={setIsOpenEditModal }
                                            onEdit={(values) => onEdit(values, key)}
                                            isLoadingEdit={isLoadingEdit}
                                            inputs={productInputsData}
                                            index={key + 1}
                                            initialValues={{ disc: service.summary, discAr: service.summaryAr }}
                                        >
                                            {hasDemoVideo &&
                                                <>
                                                    <h1>{t('English Demo Videos')}</h1>
                                                    <FormikControl
                                                        disabled={isLoadingEdit}
                                                        control="input"
                                                        type="file"
                                                        name="videos"
                                                        accept="video/*"
                                                        multiple={true}
                                                        placeholder="English Demo Videos"
                                                        className="block md:w-full w-[100%]"
                                                        containerClassName="block w-full"
                                                        onChange={onChangeVideos} // Necessary to update Formik state with the selected files
                                                    />
                                                    <h1>{t('Arabic Demo Videos')}</h1>
                                                    <FormikControl
                                                        disabled={isLoadingEdit}
                                                        control="input"
                                                        type="file"
                                                        name="videosAr"
                                                        accept="video/*"
                                                        multiple={true}
                                                        placeholder="Arabic Demo Videos"
                                                        className="block md:w-full w-[100%]"
                                                        containerClassName="block w-full"
                                                        onChange={onChangeVideosAr}
                                                    />
                                                </>
                                            }
                                        </EditSection>
                                    }
                                    <div className="flex min-h-[210px] flex-col items-center p-4 text-center">
                                        <div className="flex h-[100px] w-full items-center justify-center">
                                            <img src={service.icon} alt="" className="h-[95px] max-w-[120px] object-contain" />
                                        </div>
                                        <p className="mt-4 flex min-h-[22px] items-center justify-center text-sm text-[#ef4444]">{localizedService.label}</p>
                                        <h1 className="mt-2 flex min-h-[44px] items-center justify-center whitespace-nowrap text-center text-2xl font-bold leading-tight xl:text-[28px]">
                                            {localizedService.title}
                                        </h1>
                                    </div>
                                    <p className="p-4 pt-0 group-hover/item:text-base transition-all duration-500 text-sm leading-relaxed text-[#ccc] overflow-hidden">
                                        {localizedService.summary}
                                    </p>

                                    <div className="flex mt-auto">
                                        <Link
                                            to={`/services/${service.slug}`}
                                            className={`flex w-full transition-all duration-500 ${hasDemoVideo ? 'rounded-bl-xl' : 'rounded-b-xl'} px-[20px] py-[10px] border border-solid border-[#ef4444] text-[#ef4444] bg-[#262626] justify-center items-center gap-2 whitespace-nowrap`}>
                                            {t('Read More')}  <img alt={''} width={15} height={15} src={quoteIcon} />
                                        </Link>
                                        {hasDemoVideo &&
                                            <button
                                                onClick={() => setActiveIntro(service)}
                                                className="flex w-full transition-all duration-500 rounded-br-xl px-[20px] py-[10px] border border-solid border-[#ef4444] text-[#ef4444] bg-[#262626] justify-center items-center gap-2 whitespace-nowrap">
                                                {t('Watch Demo')}  <img alt={''} width={15} height={15} src={watchIcon} />
                                            </button>
                                        }
                                    </div>

                                </div>
                            </div>
                            )
                        })}
                    </div>
                </div>

                <CompatibleVideo
                    src={productsVideo}
                    autoPlay
                    muted
                    loop
                    controls={false}
                    preload="auto"
                    className="rotate-100 absolute  left-0 z-[-1] top-0 bottom-0 w-full h-full object-cover" />
            </section>

            <CustomModal
                isOpen={!!activeIntro}
                onClose={() => { setActiveIntro(false) }}
                contentLabel={t("Demo Videos")}
            >
                {activeIntroVideo ? (
                    <div className={`grid gap-4 p-4 ${activeIntroVideos.length > 1 ? 'md:grid-cols-[220px_minmax(0,1fr)]' : ''}`}>
                        {activeIntroVideos.length > 1 &&
                            <div className="grid content-start gap-2">
                                {activeIntroVideos.map((demoVideo, index) => (
                                    <button
                                        key={`${demoVideo}-${index}`}
                                        type="button"
                                        onClick={() => setActiveDemoIndex(index)}
                                        className={`rounded-xl border border-solid px-4 py-3 text-start transition-all duration-300 ${activeDemoIndex === index ? 'border-[#ef4444] bg-[#262626] text-[#ef4444]' : 'border-[#333] bg-[#000] text-white'}`}
                                    >
                                        {t('Demo Project')} {index + 1}
                                    </button>
                                ))}
                            </div>
                        }
                        <div>
                            <h2 className="mb-3 text-xl font-bold text-[#ef4444]">
                                {localizedActiveIntro?.title} - {t('Demo Project')} {activeDemoIndex + 1}
                            </h2>
                            <CompatibleVideo
                                src={activeIntroVideo}
                                title={`${localizedActiveIntro?.title || t('Demo Videos')} - ${t('Demo Project')} ${activeDemoIndex + 1}`}
                                style={{ width: '100%', height: 'calc(100vh - 240px)' }}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="p-6 text-white bg-[#000]">
                        <h2 className="font-bold text-2xl mb-3">{localizedActiveIntro?.title}</h2>
                        <p className="text-[#ccc]">
                            {t('No introduction video is uploaded yet. You can add one from the admin edit button for this service.')}
                        </p>
                    </div>
                )}
            </CustomModal>
        </>
    )
}

export default ProductsUi
