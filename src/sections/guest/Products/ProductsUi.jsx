import watchIcon from '../../../assets/icons/watch.svg'
import quoteIcon from '../../../assets/icons/qouticonrev.svg'
import productsVideo from '../../../assets/videos/products.mp4'
import CustomModal from '../../../components/CustomModal';
import { useEffect, useRef } from 'react';
import EditSection from '../../../components/EditSection';
import LoadingScreen from '../../../components/LoadingScreen';
import { productInputsData, productsTitleInput } from './productsInputs';
import { FormikControl } from '../../../components/inputs';
import { mediaUrl } from '../../../config';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../../i18n/LanguageContext';
import { getBilingualInitialValues, getLocalizedField } from '../../../i18n/localizedContent';
import { localizeService, servicesSectionHeader } from './serviceContent';

const ProductsUi = (props) =>
{
    const { onChangeVideo, header, onEditTitle, setActiveIntro, activeIntro, isLoadingGetSection, services, isAdmin, onEdit, isLoadingEdit, isOpenEditModal, setIsOpenEditModal, isOpenEditTitleModal, setIsOpenEditTitleModal } = props;
    const { language, t } = useLanguage();
    const localizedTitle = getLocalizedField(header, 'title', language, servicesSectionHeader.title);
    const localizedDesc = getLocalizedField(header, 'disc', language, servicesSectionHeader.disc);
    const localizedActiveIntro = localizeService(activeIntro, language);
    // enforce video to play 
    const videoRef = useRef();
    useEffect(() =>
    {
        if (videoRef.current) videoRef.current.play();
    }, [])

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
                <div className="md:container px-6 md:px-10 md:mx-auto">
                    <div className="relative w-full grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                        {services.map((service, key) =>
                        {
                            const localizedService = localizeService(service, language);

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
                                            <h1>{t('Introduction Video')}</h1>
                                            <FormikControl
                                                disabled={isLoadingEdit}
                                                control="input"
                                                type="file"
                                                name="video"
                                                accept="video/*"
                                                placeholder="Introduction Video"
                                                className="block md:w-full w-[100%]"
                                                containerClassName="block w-full"
                                                onChange={onChangeVideo} // Necessary to update Formik state with the selected file
                                            />
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
                                            className="flex w-full transition-all duration-500  rounded-bl-xl  px-[20px] py-[10px] border border-solid border-[#ef4444] text-[#ef4444] bg-[#262626] justify-center items-center gap-2">
                                            {t('Read More')}  <img alt={''} width={15} height={15} src={quoteIcon} />
                                        </Link>
                                        <button
                                            onClick={() => setActiveIntro(service)}
                                            className="flex w-full transition-all duration-500  rounded-br-xl  px-[20px] py-[10px] border border-solid border-[#ef4444] text-[#ef4444] bg-[#262626] justify-center items-center gap-2">
                                            {t('Introduction')}  <img alt={''} width={15} height={15} src={watchIcon} />
                                        </button>
                                    </div>

                                </div>
                            </div>
                            )
                        })}
                    </div>
                </div>

                <video
                    ref={videoRef}
                    autoPlay
                    webkit-playsinline="true"
                    playsInline={true}
                    muted
                    src={productsVideo}
                    type="video/mp4"
                    loop
                    className="rotate-100 absolute  left-0 z-[-1] top-0 bottom-0 w-full h-full object-cover" />
            </section>

            <CustomModal
                isOpen={!!activeIntro}
                onClose={() => { setActiveIntro(false) }}
                contentLabel={t("Introduction video")}
            >
                {activeIntro?.video ? (
                    <video
                        autoPlay
                        controls
                        style={{ width: '100%', height: 'calc(100vh - 200px)' }}
                    >
                        <source src={`${mediaUrl}${activeIntro.video}`} />
                    </video>
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
