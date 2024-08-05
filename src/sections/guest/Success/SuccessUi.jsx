import { Swiper, SwiperSlide } from 'swiper/react';
import  { Autoplay } from 'swiper/modules';
import SwiperCore from 'swiper/core';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

import logovertical from '../../../assets/icons/logovertical.svg'
import bgVideo from '../../../assets/videos/home.mp4'
import SlideNextButton from './SlideNextButton';
import { useEffect, useRef } from 'react';
SwiperCore.use([Autoplay]);
const SuccessUi = (props) =>
{
    const { title, desc, history, clients, activeStep, setActiveStep } = props;
    
    const videoRef = useRef();
    useEffect(() =>
    {
        if (videoRef?.current) videoRef.current.play();
    }, [])

    return (
        <section id="section_5" className={'min-h-[100vh] relative text-white justify-center items-center pt-[6rem] px-[20px] bg-[#000] z-[1]  relative py-[60px] '} >
            <div className="bg-gradient-radial-sec absolute top-[-4px] left-0 right-0 bottom-[-4px] z-[0]" />

            <div className="md:container md:mx-auto">

                <div className="text-center z-[10] relative">
                    <img alt="" height={90} width={90} src={logovertical} className="m-auto mb-2" />
                    <h1 className={'font-bold text-l'} >{title}</h1>
                </div>

                <div className="z-[10] relative">
                    <div className="lg:ml-[90px] ">
                        <Swiper
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
                                <SwiperSlide key={k} virtualIndex={k} className="">
                                    <div className="flex items-baseline flex-wrap mb-4">
                                        <div className="leading-tight mb-[30px] font-bold text-7xl text-white glitch w-full sm:w-auto" data-glitch={a.year}>{a.year}</div>
                                        {clients.filter(e => e.year === a.year).map((c, key) => (
                                            <div key={key} className={'ml-2 content-center' + (activeStep === k ? 'transition duration-700 delay-' + (key + 2) + '00 opacity-1' : 'opacity-0')}>
                                                <img className="m-auto" alt="" width={60} height={c.height ? c.height : 60} src={c.img} />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="">
                                        <p className={'leading-tight mb-[15px] text-l text-white '}>{a.description}</p>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>

                <h1 className={'text-center mt-10 font-bold text-l text-white relative glitch-noise'} data-glitch={desc} >{desc}</h1>
            </div>
            <video ref={videoRef} src={bgVideo} type="video/mp4" autoPlay muted loop className="rotate-100 absolute  left-0 z-[-1] top-0 bottom-0 w-full h-full object-cover"/>
        </section>
    )
}

export default SuccessUi