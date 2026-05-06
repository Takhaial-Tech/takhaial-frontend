import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import SwiperCore from 'swiper/core';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

import logovertical from '../../../assets/icons/logovertical.svg'
import bgVideo from '../../../assets/videos/home.mp4'
import SlideNextButton from './SlideNextButton';
import { useEffect, useRef } from 'react';
import LoadingScreen from '../../../components/LoadingScreen';
import EditSection from '../../../components/EditSection';
import { successSectionInputs, yearInputsData } from './successInputs';
import { mediaUrl } from '../../../config';
import AddSection from '../../../components/AddSection';
import ImageUploader from '../../../components/inputs/ImageUploader';
import DeleteItem from '../../../components/DeleteItem';

SwiperCore.use([Autoplay]);

const SuccessUi = (props) =>
{
    const { title, disc, history, activeStep, setActiveStep,
        images, setImages,
        isOpenEditTitleModal, setIsOpenEditTitleModal, onEditTitle, isLoadingAddSection, onAdd, isOpenAddModal, setIsOpenAddModal, isLoadingGetSection, isAdmin, isOpenEditModal, setIsOpenEditModal, onEdit, isLoadingEdit
    } = props;

    // autoplay when appear
    const swiperRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() =>
    {
        const swiperInstance = swiperRef.current?.swiper;
        const containerElement = containerRef.current;

        if (!swiperInstance || !containerElement)
        {
            return undefined;
        }

        const handleIntersection = (entries) =>
        {
            entries.forEach(entry =>
            {
                if (entry.isIntersecting)
                {
                    swiperInstance.autoplay.start();
                } else
                {
                    swiperInstance.autoplay.stop();
                }
            });
        };

        const observer = new IntersectionObserver(handleIntersection, {
            threshold: 0.5, // Adjust as needed
        });

        observer.observe(containerElement);

        return () =>
        {
            observer.unobserve(containerElement);
        };
    }, []);

    // enforce video to play 
    const videoRef = useRef();
    useEffect(() =>
    {
        if (videoRef.current) videoRef.current.play();
    }, [])

    return (
        <section id="section_5" className={'min-h-[100vh] relative text-white justify-center items-center pt-[6rem] px-[20px] bg-[#000] z-[1]  relative py-[60px] '} >
            <div className="bg-gradient-radial-sec absolute top-[-4px] left-0 right-0 bottom-[-4px] z-[0]" />
            {isLoadingGetSection && <LoadingScreen isAbsolute={true} />}
            {/* Edit title & disc */}
            {isAdmin &&
                <EditSection
                    editTitle="Edit Section"
                    isOpenEditModal={isOpenEditTitleModal}
                    setIsOpenEditModal={setIsOpenEditTitleModal}
                    onEdit={onEditTitle}
                    isLoadingEdit={isLoadingEdit}
                    inputs={successSectionInputs}
                    initialValues={{ title, disc }}
                    className='right-[20px] top-[-10px]'
                />
            }
            <div className="md:container md:mx-auto">

                <div className="text-center z-[10] relative">
                    <img alt="" height={90} width={90} src={logovertical} className="m-auto mb-2" />
                    <h1 className={'font-bold text-l'} >{title}</h1>
                </div>

                <div className="z-[10] relative">
                    {isAdmin &&
                        <div className='add-media '>
                            <AddSection
                                addTitle="Add Year"
                                className="top-[0rem] right-[0px] mt-[0px]"
                                isOpenAddModal={isOpenAddModal}
                                setIsOpenAddModal={setIsOpenAddModal}
                                onAdd={onAdd}
                                isLoadingAdd={isLoadingAddSection}
                                inputs={yearInputsData}
                                initialValues={{ title: "", disc: "" }}
                            >
                                <ImageUploader defaultImages={[]} images={images} setImages={setImages} />
                            </AddSection>
                        </div>
                    }
                    <div ref={containerRef} className={`lg:ml-[90px] ${isAdmin ? 'mt-[2rem]' : ''}`}  >
                        <Swiper
                            ref={swiperRef}
                            autoplay={{
                                delay: 3000,
                                disableOnInteraction: false,
                            }}
                            className='success-slider'
                            slidesPerView={1}
                            onSlideChange={(e) => setActiveStep(e.activeIndex)}
                        >
                            <SlideNextButton activeStep={activeStep} setActiveStep={setActiveStep} history={history} />

                            {history.map((a, k) => (
                                <SwiperSlide key={k} virtualIndex={k} className={isAdmin ? "mt-[2rem] " : ''}>
                                    <div className="flex items-baseline flex-wrap mb-[30px] relative">
                                        {isAdmin &&
                                            <div className='add-media '>
                                                <EditSection
                                                    isItem={true}
                                                    itemId={a._id}
                                                    editTitle="Edit"
                                                    className="top-[16px] right-[5px] mt-[0px]"
                                                    isOpenEditModal={isOpenEditModal === a._id}
                                                    index={k + 1}
                                                    setIsOpenEditModal={setIsOpenEditModal}
                                                    onEdit={(values) => onEdit(values, k + 1)}
                                                    isLoadingEdit={isLoadingEdit}
                                                    inputs={yearInputsData}
                                                    initialValues={{ title: a?.title || "", disc: a?.disc || "" }}
                                                >
                                                    <ImageUploader defaultImages={a?.images} images={images} setImages={setImages} />
                                                </EditSection>
                                            </div>
                                        }
                                        <div className="leading-tight  font-bold text-7xl text-white glitch w-full sm:w-auto" data-glitch={a.title}>{a.title}</div>
                                        {a?.images?.map((c, key) => (
                                            <div key={key} className={'m-2 content-center' + (activeStep === k ? 'transition duration-700 delay-' + (key + 2) + '00 opacity-1' : 'opacity-0')}>
                                                <img className="m-auto h-[50px] w-[auto]" alt="" src={mediaUrl + c} />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="">
                                        <p className={'leading-tight mb-[15px] text-l text-white '}>{a.disc}</p>
                                    </div>
                                    {isAdmin && <DeleteItem sectionNumber={5} itemId={a?._id} />}

                                </SwiperSlide>
                            ))}

                        </Swiper>
                    </div>
                </div>

                <h1 className={'text-center mt-10 font-bold text-l text-white relative glitch-noise'} data-glitch={disc} >{disc}</h1>
            </div>
            <video
                ref={videoRef}
                webkit-playsinline="true"
                playsInline={true}
                src={bgVideo}
                type="video/mp4"
                autoPlay
                muted
                loop
                className="rotate-100 absolute  left-0 z-[-1] top-0 bottom-0 w-full h-full object-cover" />
        </section>
    )
}

export default SuccessUi
