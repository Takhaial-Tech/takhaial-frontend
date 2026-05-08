import whyBG from '../../../assets/icons/battern.svg'
import takhaialLogo from '../../../assets/icons/logoname.svg'
import EditSection from '../../../components/EditSection';
import LoadingScreen from '../../../components/LoadingScreen';
import { whyInputsData } from './whyInputsData';

const WhyUi = (props) =>
{
    const { isLoadingGetSection, data, isAdmin, onEdit, isLoadingEdit, isOpenEditModal, setIsOpenEditModal } = props;

    return (
        <section dir={'ltr'} id="section_3" className={'min-h-[100vh] relative text-white flex flex-wrap justify-center items-center pt-[2rem] bg-[#000] z-[1]  py-[60px] overflow-hidden '} >
            {isLoadingGetSection && <LoadingScreen isAbsolute={true} />}

            {isAdmin &&
                <div className="w-screen relative "
                >
                    <EditSection
                        isOpenEditModal={isOpenEditModal}
                        setIsOpenEditModal={setIsOpenEditModal}
                        onEdit={onEdit}
                        isLoadingEdit={isLoadingEdit}
                        inputs={whyInputsData}
                        initialValues={{ title: data?.title || "", disc: data?.disc || "" }}
                        className="top-[-20px] right-[20px]"
                    />
                </div>

            }
            <div className="w-full bg-gradient-radial2 min-h-[80vh] content-center">

                <div className="px-[20px]  md:container md:mx-auto md:grid md:grid-cols-5 gap-6 items-center">
                    <img src={whyBG} alt='' height={130} width={230} className="absolute  right-[-20px] z-[-10] " />
                    <div className="" >
                    </div>
                    <div className="col-span-3">
                        <div className='flex items-start'>
                            <h1 className={'font-bold text-white text-2xl mb-5 flex glitch-trans'} data-glitch={data?.title}>{data?.title}  </h1>
                            <img src={takhaialLogo} alt="" height={100} width={155} className="mt-[5px] ml-[-10px]" />
                        </div>

                        {(data?.disc || '').split('.').filter(Boolean).map((a, k) =>
                            <p key={k} className={"leading-relaxed content-end text-sm "} >{a}.</p>
                        )}

                    </div>
                </div>
            </div>
        </section>
    )
}

export default WhyUi
