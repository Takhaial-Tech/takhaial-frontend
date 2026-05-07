import watchIcon from '../../../assets/icons/watch.svg'
import quoteIcon from '../../../assets/icons/qouticonrev.svg'
import productsVideo from '../../../assets/videos/products.mp4'
import CustomModal from '../../../components/CustomModal';
import { useEffect, useRef } from 'react';
import EditSection from '../../../components/EditSection';
import LoadingScreen from '../../../components/LoadingScreen';
import { productInputsData } from './productsInputs';
import { FormikControl } from '../../../components/inputs';
import { mediaUrl } from '../../../config';
import { Link } from 'react-router-dom';

const ProductsUi = (props) =>
{
    const { onChangeVideo, title, setActiveIntro, activeIntro, isLoadingGetSection, services, isAdmin, onEdit, isLoadingEdit, isOpenEditModal, setIsOpenEditModal } = props;
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
                <div className={`${isAdmin ? "mt-[5rem]" : ""} mb-[3rem] text-center z-10`}>
                    <h1 className="font-bold justify-self-center text-3xl md:text-4xl mb-4 glitch-trans" data-glitch={title}>{title}</h1>
                    <p className="text-[#ccc] max-w-[760px] m-auto px-[20px]">
                        We build digital services across mobile, immersive technology, AI, and advertising content.
                    </p>
                </div>
                <div className="md:container  px-10 md:mx-auto">
                    <div className="relative w-full grid md:grid-cols-2 xl:grid-cols-4 gap-6">
                        {services.map((service, key) => (
                            <div key={key} className={'relative md:mb-0 mb-5 '}>
                                <div className="h-full hover:scale-105 grid items-start border border-solid border-[red] rounded-xl hover:shadow-3xl transition-all duration-500 relative content-end hover:bg-[#000] hover:shadow-3xl group/item bg-[#000]/60" key={key} >
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
                                            initialValues={{ title: service.title, disc: service.summary }}
                                        >
                                            <h1>Introduction Video</h1>
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
                                    <div className={'p-4 items-center min-h-[180px]'}>
                                        <img src={service.icon} alt="" className="h-[95px] m-auto mb-5" />
                                        <p className="text-[#ef4444] text-sm text-center mb-2">{service.label}</p>
                                        <h1 className="text-center font-bold text-3xl leading-tight">{service.title}</h1>
                                    </div>
                                    <p className="p-4 pt-0 group-hover/item:text-base transition-all duration-500 text-sm leading-relaxed text-[#ccc] overflow-hidden">
                                        {service.summary}
                                    </p>

                                    <div className="flex mt-auto">
                                        <Link
                                            to={`/services/${service.slug}`}
                                            className="flex w-full transition-all duration-500  rounded-bl-xl  px-[20px] py-[10px] border border-solid border-[#ef4444] text-[#ef4444] bg-[#262626] flex justify-center items-center">
                                            {'Read More'}  <img alt={''} width={15} className="ml-2" height={15} src={quoteIcon} />
                                        </Link>
                                        <button
                                            onClick={() => setActiveIntro(service)}
                                            className="flex w-full transition-all duration-500  rounded-br-xl  px-[20px] py-[10px] border border-solid border-[#ef4444] text-[#ef4444] bg-[#262626] flex justify-center items-center">
                                            {'Introduction'}  <img alt={''} width={15} className="ml-2" height={15} src={watchIcon} />
                                        </button>
                                    </div>

                                </div>
                            </div>
                        ))}
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
                contentLabel="Introduction video"
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
                        <h2 className="font-bold text-2xl mb-3">{activeIntro?.title}</h2>
                        <p className="text-[#ccc]">
                            No introduction video is uploaded yet. You can add one from the admin edit button for this service.
                        </p>
                    </div>
                )}
            </CustomModal>
        </>
    )
}

export default ProductsUi
