import homeVideo from '../../../assets/videos/home.mp4'
import profilePdf from '../../../assets/documents/companyProfile.pdf'
import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import EditSection from '../../../components/EditSection';
import { homeInputsData } from './homeInputsData';
import LoadingScreen from '../../../components/LoadingScreen';

const HomeUi = (props) =>
{
    const { isLoadingGetSection, data, isAdmin, onEdit, isLoadingEdit, isOpenEditModal, setIsOpenEditModal } = props;

    // enforce video to play 
    const videoRef = useRef();
    useEffect(() =>
    {
        if (videoRef.current) videoRef.current.play();
    }, [])

    return (
        <section id="section_1" className={` min-h-[100vh] relative text-white flex justify-center items-center px-[20px] bg-[#000] z-[1] relative py-[60px] home ${isAdmin ? 'pt-[10rem] ' : "pt-[6rem] "}`} >
            <div className="bg-gradient-radial absolute top-0 left-0 right-0 bottom-0 z-[0]" />
            {isLoadingGetSection && <LoadingScreen />}
            {isAdmin &&
                <EditSection
                    isOpenEditModal={isOpenEditModal}
                    setIsOpenEditModal={setIsOpenEditModal}
                    onEdit={onEdit}
                    isLoadingEdit={isLoadingEdit}
                    inputs={homeInputsData}
                    initialValues={{ title: data?.title, disc: data?.disc }}
                    className='right-[20px]'
                />
            }

            <div className="md:container md:mx-auto self-end z-[10]">
                <div className=" w-full  md:grid md:grid-cols-4 gap-10 items-start flex-wrap">
                    <h1 className="grid-cols-1 text-right leading-7 text-4xl font-bold justify-self-right">
                        {data?.title.split(' ').map((a, k) =>
                            <span key={k} className="glitch-wrapper ">
                                <span className="glitch-trans block" data-glitch={a}>{a}</span> <br />
                            </span>
                        )}
                    </h1>
                    <div className="col-span-3">
                        <h2 className="content-center text-xl max-w-[630px]">
                            {data?.disc}
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
                webkit-playsinline="true"
                playsInline={true}
                src={homeVideo}
                type="video/mp4"
                autoPlay
                muted
                loop
                className="rotate-100 absolute  left-0 z-[-1] top-0 bottom-0 w-full h-full object-cover" />
        </section>);
}

export default HomeUi