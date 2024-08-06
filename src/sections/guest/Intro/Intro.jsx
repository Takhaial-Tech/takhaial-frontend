import { useEffect, useRef, useState } from 'react';
import { ReactComponent as LogoIcon } from '../../../assets/icons/logoname.svg';
import introVideo from '../../../assets/videos/intro.mp4';

const Intro = ({ onIntroLoaded }) =>
{
    // const navigate = useNavigate();
    const videoRef = useRef(null);
    const [introEnd, setIntroEnd] = useState(false)

    useEffect(() =>
    {
        document.body.style.overflowY = 'hidden';
        const handleOnPlay = () =>
        {
            onIntroLoaded();
            setTimeout(() =>
            {
                document.getElementById('content').classList.remove('opacity-0');
            }, 5000);

            setTimeout(() =>
            {
                setIntroEnd(true)
                document.body.style.overflowY = 'auto';
            }, 7000);
        };

        if (videoRef.current)
        {
            videoRef.current.addEventListener('play', handleOnPlay);
        }

        return () =>
        {
            if (videoRef.current)
            {
                videoRef.current.removeEventListener('play', handleOnPlay);
            }
        };
    }, [onIntroLoaded]);

    return (
        <div className={"h-full w-full fixed inset-0 z-[100] bg-[#000] transition duration-700 ease-in-out" + (introEnd ? ' pointer-events-none opacity-0' : '')}>
            {/* logo */}
            <div id="content" className={"justify-self-center fixed left-[50%] bottom-[18%] transform transform-navbar transition duration-500 opacity-0"} style={{ transform: 'translate(-50%, 0px)' }}>
                <LogoIcon alt="takhaial" className="w-full object-cover" />
            </div>

            {/* background video */}
            <video
                ref={videoRef}
                muted
                src={introVideo}
                type="video/mp4"
                webkit-playsinline="true"
                playsInline={true}
                autoPlay
                className="rotate-100 absolute left-0 z-[-1] top-0 bottom-0 w-full h-full object-cover"
            />
        </div>
    );
};

export default Intro;
