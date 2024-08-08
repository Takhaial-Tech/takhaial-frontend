import React, { useEffect, useRef } from 'react'
import aboutVideo from '../../../assets/videos/about.mp4'

const MediaCoverageUi = (props) =>
{
    const { title, list } = props;
    
    // enforce video to play 
    const videoRef = useRef();
    useEffect(() =>
    {
        if (videoRef.current) videoRef.current.play();
    }, [])

    return (
        <section id="section_7" className={'media p-[20px]  mx-auto content-center min-h-[100vh] relative text-white flex justify-center items-center pt-[6rem] pb-[4rem]  z-[1] grid media-coverage'}>
            <div className="absolute top-[-4px] left-0 right-0 bottom-[-4px] z-[0]" />

            <h1 className="font-bold justify-self-center text-2xl mb-6 glitch-trans" data-glitch={title}>{title}</h1>
            <div className="w-full grid grid-cols-1  grid-cols-3 gap-10 items-center justify-center">
                {list.map((item, key) => (
                    <a href={item.link} target="__blank" key={key} className={'flex items-center justify-center  relative md:mb-0 mb-5'}>
                        <img alt="" className="max-w-[200px] max-h-[100px] h-[auto]" src={item.img} />
                    </a>
                ))}
            </div>

            <video
                ref={videoRef}
                webkit-playsinline="true"
                playsInline={true}
                src={aboutVideo}
                type="video/mp4"
                autoPlay
                muted
                loop
                className="rotate-100 absolute  left-0 z-[-1] top-0 bottom-0 w-full h-full object-cover" />

        </section>
    )
}

export default MediaCoverageUi
