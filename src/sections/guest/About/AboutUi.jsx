import { useEffect, useRef } from 'react';
import aboutVideo from '../../../assets/videos/about.mp4'
import LoadingScreen from '../../../components/LoadingScreen';
import EditSection from '../../../components/EditSection';
import { missionInputsData, visionInputsData } from './aboutInputsData';
import { useLanguage } from '../../../i18n/LanguageContext';
import { getBilingualInitialValues, getLocalizedField } from '../../../i18n/localizedContent';

const AboutUi = (props) =>
{
    // const { title, desc, title2, desc2 } = props;
    const { isLoadingGetSection, data, isAdmin, onEdit, isLoadingEdit, isOpenEditModal, setIsOpenEditModal, setIsOpenEditModal2, isOpenEditModal2 } = props;
    const { language } = useLanguage();
    const missionTitle = getLocalizedField(data[0], 'title', language);
    const missionDisc = getLocalizedField(data[0], 'disc', language);
    const visionTitle = getLocalizedField(data[1], 'title', language);
    const visionDisc = getLocalizedField(data[1], 'disc', language);

    // enforce video to play 
    const videoRef = useRef();
    useEffect(() =>
    {
        if (videoRef.current) videoRef.current.play();
    }, [])

    return (
        <section id="section_2" className={' min-h-[100vh] relative text-white flex justify-center items-center pt-[6rem] px-[20px] bg-[#000] z-[1]  relative py-[60px]'} >
            {isLoadingGetSection && <LoadingScreen isAbsolute={true} />}

            <div className="bg-gradient-radial absolute top-[-4px] left-0 right-0 bottom-[-4px] z-[0]" />
            <div className="w-full  md:grid md:grid-cols-2 gap-6 z-[10]">
                <div />
                <div>
                    <div className='relative '>
                        {isAdmin &&
                            <EditSection
                            className="top-[0px] right-[1px]"
                                isOpenEditModal={isOpenEditModal}
                                setIsOpenEditModal={setIsOpenEditModal}
                                onEdit={(values) => onEdit(values, 0)}
                                isLoadingEdit={isLoadingEdit}
                                inputs={visionInputsData}
                                initialValues={getBilingualInitialValues(data[0], ['title', 'disc'])}
                            />
                        }
                        <h1 className={`font-bold text-white text-3xl  glitch ${isAdmin ? 'mb-8' : 'mb-5'}`} data-glitch={missionTitle}>{missionTitle}</h1>
                        <h2 className={"leading-relaxed content-end text-sm"}> {missionDisc} </h2>
                    </div>
                    <div className='relative'>
                        {isAdmin &&
                            <EditSection
                            className="top-[0px] right-[1px]"
                                isOpenEditModal={isOpenEditModal2}
                                setIsOpenEditModal={setIsOpenEditModal2}
                                onEdit={(values) => onEdit(values, 1)}
                                isLoadingEdit={isLoadingEdit}
                                inputs={missionInputsData}
                                initialValues={getBilingualInitialValues(data[1], ['title', 'disc'])}
                            />
                        }
                        <h1 className={`ont-bold text-white text-3xl mt-10 glitch ${isAdmin ? 'mb-8' : 'mb-5'}`} data-glitch={visionTitle}  > {visionTitle}</h1>
                        <h2 className={"leading-relaxed content-end text-sm"}> {visionDisc} </h2>
                    </div>
                </div>
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

export default AboutUi
