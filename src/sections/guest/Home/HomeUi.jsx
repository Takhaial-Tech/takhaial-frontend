import homeVideo from '../../../assets/videos/home.mp4'
import profilePdf from '../../../assets/documents/companyProfile.pdf'
import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';

const HomeUi = (props) =>
{
    const { title, desc } = props;
    const videoRef = useRef();
    useEffect(() =>
    {
        if (videoRef?.current) videoRef.current.play();
    }, [])
    return (
        <section id="section_1" className={'min-h-[100vh] relative text-white flex justify-center items-center pt-[6rem] px-[20px] bg-[#000] z-[1] relative py-[60px] home'} >
            <div className="bg-gradient-radial absolute top-0 left-0 right-0 bottom-0 z-[0]" />

            <div className="md:container md:mx-auto self-end z-[10]">
                <div className=" w-full  md:grid md:grid-cols-4 gap-10 items-end flex-wrap">
                    <h1 className="grid-cols-1 text-right leading-7 text-4xl font-bold justify-self-right">
                        {title.split(' ').map((a, k) =>
                            <span key={k} className="glitch-wrapper ">
                                <span className="glitch-trans block" data-glitch={a}>{a}</span> <br />
                            </span>
                        )}
                    </h1>
                    <div className="col-span-3">
                        <h2 className="content-center text-xl max-w-[630px]">
                            {desc}
                        </h2>
                        <Link
                            to={profilePdf}
                            target="_blank"
                            download
                            className="block mt-[10px] transition-all duration-500 w-fit rounded-xl  px-[20px] py-[10px] border border-solid border-[#ef4444] text-[#ef4444] bg-[#262626]"
                        >
                            {'Download Profile'}
                        </Link>
                    </div>
                </div>
            </div>

            <video
                ref={videoRef}
                id="myVideo"
                webkit-playsinline="true"
                playsInline={true}
                src={homeVideo} type="video/mp4" autoPlay muted loop className="rotate-100 absolute  left-0 z-[-1] top-0 bottom-0 w-full h-full object-cover" />
        </section>);
}

export default HomeUi