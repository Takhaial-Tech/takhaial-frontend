import homeVideo from '../../../assets/videos/home.mp4'
import defaultProfilePdf from '../../../assets/documents/companyProfile.pdf'
import EditSection from '../../../components/EditSection';
import { homeInputsData } from './homeInputsData';
import { useLanguage } from '../../../i18n/LanguageContext';
import { getBilingualInitialValues, getLocalizedField } from '../../../i18n/localizedContent';
import CompatibleVideo from '../../../components/CompatibleVideo';

const HomeUi = (props) =>
{
    const { data, isAdmin, onEdit, isLoadingEdit, isOpenEditModal, setIsOpenEditModal, isOpenProfileModal, setIsOpenProfileModal, isLoadingEditSettings, onEditProfilePdf, setProfilePdfFile, siteSettings } = props;
    const { language, isArabic, t } = useLanguage();
    const profilePdfHref = siteSettings?.profilePdfUrl || defaultProfilePdf;
    const heroTitle = isArabic ? 'تخيل تك' : 'Takhaial Tech';
    const heroSince = isArabic ? 'منذ 2022' : 'Since 2022';
    const desc = getLocalizedField(data, 'disc', language);

    return (
        <section id="section_1" className={` min-h-[100vh] relative text-white flex justify-center items-center px-[20px] bg-[#000] z-[1] relative py-[60px] home ${isAdmin ? 'pt-[10rem] ' : "pt-[6rem] "}`} >
            <div className="bg-gradient-radial absolute top-0 left-0 right-0 bottom-0 z-[0]" />
            {isAdmin &&
                <EditSection
                    isOpenEditModal={isOpenEditModal}
                    setIsOpenEditModal={setIsOpenEditModal}
                    onEdit={onEdit}
                    isLoadingEdit={isLoadingEdit}
                    inputs={homeInputsData}
                    initialValues={getBilingualInitialValues(data, ['title', 'disc'])}
                    className='right-[20px]'
                />
            }
            {isAdmin &&
                <EditSection
                    editTitle="Edit Profile PDF"
                    isOpenEditModal={isOpenProfileModal}
                    setIsOpenEditModal={setIsOpenProfileModal}
                    onEdit={onEditProfilePdf}
                    isLoadingEdit={isLoadingEditSettings}
                    initialValues={{}}
                    actionTitle="Upload Profile"
                    className='right-[160px]'
                >
                    <div className="mb-4">
                        <label className="block text-white mb-2">
                            {t('Company profile PDF')}
                        </label>
                        <input
                            type="file"
                            accept="application/pdf"
                            className="block w-full p-[10px] bg-[#262626] rounded-xl mb-[10px] text-white"
                            onChange={(event) => setProfilePdfFile(event.currentTarget.files?.[0] || null)}
                        />
                    </div>
                </EditSection>
            }

            <div className="md:container md:mx-auto z-[10] flex min-h-[calc(100vh-10rem)] w-full flex-col justify-end gap-8">
                <div className={`w-full flex flex-col gap-6 ${isArabic ? 'text-right' : 'text-left'}`}>
                    <div className="w-full">
                        <h1 className={`leading-[1.12] text-[2.25rem] sm:text-[3rem] md:text-[3.75rem] font-bold ${isArabic ? 'text-right' : 'text-left'}`}>
                            {heroTitle.split(' ').filter(Boolean).map((a, k) =>
                                <span key={k} className="glitch-wrapper inline-block me-[0.35em]">
                                    <span className="glitch-trans inline-block" data-glitch={a}>{a}</span>
                                </span>
                            )}
                        </h1>
                        <p className={`mt-2 leading-tight text-[1.35rem] sm:text-[1.75rem] md:text-[2.1rem] font-semibold text-white/75 ${isArabic ? 'text-right' : 'text-left'}`}>
                            {heroSince}
                        </p>
                    </div>
                    <div className="w-full">
                        <h2 className="text-xl max-w-[630px]">
                            {desc}
                        </h2>
                        <a
                            href={profilePdfHref}
                            target="_blank"
                            rel="noreferrer"
                            download
                            className="inline-block mt-[16px] transition-all duration-500 w-fit rounded-xl  px-[20px] py-[10px] border border-solid border-[#ef4444] text-[#ef4444] bg-[#262626]"
                        >
                            {t('Download Profile')}
                        </a>
                    </div>
                </div>
            </div>

            <CompatibleVideo
                src={homeVideo}
                autoPlay
                muted
                loop
                controls={false}
                preload="auto"
                className="rotate-100 absolute  left-0 z-[-1] top-0 bottom-0 w-full h-full object-cover" />
        </section>);
}

export default HomeUi
