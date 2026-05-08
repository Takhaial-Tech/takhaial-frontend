import whyBG from '../../../assets/icons/battern.svg'
import takhaialLogo from '../../../assets/icons/logoname.svg'
import EditSection from '../../../components/EditSection';
import LoadingScreen from '../../../components/LoadingScreen';
import { whyInputsData } from './whyInputsData';
import { useLanguage } from '../../../i18n/LanguageContext';
import { getBilingualInitialValues, getLocalizedField } from '../../../i18n/localizedContent';

const WhyUi = (props) =>
{
    const { isLoadingGetSection, data, isAdmin, onEdit, isLoadingEdit, isOpenEditModal, setIsOpenEditModal } = props;
    const { language } = useLanguage();
    const title = getLocalizedField(data, 'title', language);
    const disc = getLocalizedField(data, 'disc', language);

    return (
        <section id="section_3" className={'min-h-[100vh] relative text-white flex flex-wrap justify-center items-center pt-[2rem] bg-[#000] z-[1]  py-[60px] overflow-hidden '} >
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
                        initialValues={getBilingualInitialValues(data, ['title', 'disc'])}
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
                        <div className='flex flex-wrap items-start gap-2'>
                            <h1 className={'font-bold text-white text-2xl mb-5 flex glitch-trans'} data-glitch={title}>{title}  </h1>
                            <img src={takhaialLogo} alt="" height={100} width={155} className="mt-[5px]" />
                        </div>

                        {(disc || '').split('.').filter(Boolean).map((a, k) =>
                            <p key={k} className={"leading-relaxed content-end text-sm "} >{a}.</p>
                        )}

                    </div>
                </div>
            </div>
        </section>
    )
}

export default WhyUi
