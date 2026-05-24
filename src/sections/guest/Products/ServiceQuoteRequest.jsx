import { Link, Navigate, useParams } from 'react-router-dom'
import logo from '../../../assets/icons/logo.svg'
import productsVideo from '../../../assets/videos/products.mp4'
import Btn from '../../../components/Btn'
import { FormikContainer, Input } from '../../../components/inputs'
import Textarea from '../../../components/inputs/Textarea'
import useSiteSettings from '../../../hooks/use-site-settings'
import useGetSection from '../../../hooks/use-get-section'
import LoadingScreen from '../../../components/LoadingScreen'
import LanguageSwitcher from '../../../components/LanguageSwitcher'
import { getServiceBySlug, getServiceRecords, localizeService } from './serviceContent'
import { quoteRequestInitialValues, quoteRequestValidationSchema } from './quoteRequestValidationSchema'
import { useLanguage } from '../../../i18n/LanguageContext'
import { useSelector } from 'react-redux'

const encodeMailBody = (value) => encodeURIComponent(value).replace(/%20/g, '+')

const ServiceQuoteRequest = () =>
{
    const { serviceSlug } = useParams();
    const isLoadingGetSection = useGetSection(4);
    const record = useSelector(state => state.sections.sectionsData)[4] || [];
    const fallbackService = getServiceBySlug(serviceSlug);
    const rawService = getServiceRecords(record).find(item => item.slug === serviceSlug) || fallbackService;
    const { settings } = useSiteSettings();
    const { language, t } = useLanguage();
    const service = localizeService(rawService, language);

    if (!fallbackService)
    {
        return <Navigate to="/" replace={true} />
    }

    const onSubmit = (values) =>
    {
        const subject = `${t('Quote request')} - ${service.title} - ${values.companyName}`;
        const body = [
            `${t('Service')}: ${service.title}`,
            '',
            `${t('Name')}: ${values.name}`,
            `${t('Company')}: ${values.companyName}`,
            `${t('Job Title')}: ${values.jobTitle}`,
            `${t('Email')}: ${values.email}`,
            `${t('Phone')}: ${values.phone}`,
            '',
            `${t('Project Nature')}:`,
            values.projectNature,
            '',
            `${t('Project Details')}:`,
            values.projectDetails,
            '',
            `${t('Expected Timeline')}: ${values.timeline || t('Not specified')}`,
            `${t('Budget Range')}: ${values.budgetRange || t('Not specified')}`,
        ].join('\r\n');

        window.open(`mailto:${settings.email}?subject=${encodeURIComponent(subject)}&body=${encodeMailBody(body)}`, '_blank');
    }

    return (
        <main className="min-h-screen bg-[#000] text-white relative overflow-hidden">
            {isLoadingGetSection && <LoadingScreen isAbsolute={true} />}
            <div className="bg-gradient-radial2 absolute top-0 left-0 right-0 bottom-0 z-[0]" />
            <video
                autoPlay
                muted
                loop
                playsInline={true}
                webkit-playsinline="true"
                src={productsVideo}
                className="rotate-100 absolute left-0 top-0 w-full h-full object-cover opacity-25 z-[0]"
            />
            <div className="relative z-10 px-[20px] py-[28px] md:px-10">
                <header className="flex items-center justify-between gap-4 mb-10">
                    <Link to="/#section_1">
                        <img src={logo} alt="Takhaial" width={170} height={44} />
                    </Link>
                    <div className="flex items-center gap-3">
                        <Link
                            to={`/services/${rawService.slug}`}
                            className="transition-all duration-500 rounded-xl px-[18px] py-[9px] border border-solid border-[#ef4444] text-[#ef4444] bg-[#262626]"
                        >
                            {t('Back to Service')}
                        </Link>
                        <LanguageSwitcher />
                    </div>
                </header>

                <section className="md:container md:mx-auto grid lg:grid-cols-[360px_1fr] gap-8 items-start">
                    <aside className="border border-solid border-[#ef4444] rounded-xl p-6 bg-[#000]/75">
                        <img src={service.icon} alt="" className="max-h-[140px] m-auto mb-6" />
                        <p className="text-[#ef4444] font-bold mb-3">{service.label}</p>
                        <h1 className="text-4xl font-bold leading-tight mb-4">{service.title}</h1>
                        <p className="text-[#ccc] leading-relaxed">{service.summary}</p>
                    </aside>

                    <section className="border border-solid border-[#ef4444] rounded-xl p-5 md:p-8 bg-[#000]/75 mb-12">
                        <h2 className="text-3xl font-bold mb-2">{t('Request a Quote')}</h2>
                        <p className="text-[#ccc] mb-8">
                            {t('Tell us enough about the project so our team can understand the scope and contact the right person.')}
                        </p>

                        <FormikContainer
                            initialValues={quoteRequestInitialValues}
                            validationSchema={quoteRequestValidationSchema}
                            onSubmit={onSubmit}
                        >
                            <div className="grid md:grid-cols-2 gap-x-4">
                                <Input
                                    type="text"
                                    name="name"
                                    placeholder={t("Full Name")}
                                    className="block md:w-full w-[100%]"
                                    containerClassName="block w-full"
                                />
                                <Input
                                    type="text"
                                    name="companyName"
                                    placeholder={t("Company Name")}
                                    className="block md:w-full w-[100%]"
                                    containerClassName="block w-full"
                                />
                                <Input
                                    type="text"
                                    name="jobTitle"
                                    placeholder={t("Your Role / Job Title")}
                                    className="block md:w-full w-[100%]"
                                    containerClassName="block w-full"
                                />
                                <Input
                                    type="email"
                                    name="email"
                                    placeholder={t("Email")}
                                    className="block md:w-full w-[100%]"
                                    containerClassName="block w-full"
                                />
                                <Input
                                    type="text"
                                    name="phone"
                                    placeholder={t("Contact Number")}
                                    className="block md:w-full w-[100%]"
                                    containerClassName="block w-full"
                                />
                                <Input
                                    type="text"
                                    name="timeline"
                                    placeholder={t("Expected Timeline")}
                                    className="block md:w-full w-[100%]"
                                    containerClassName="block w-full"
                                />
                            </div>
                            <Textarea
                                name="projectNature"
                                placeholder={t("Project Nature")}
                                rows="4"
                            />
                            <Textarea
                                name="projectDetails"
                                placeholder={t("Project Details / Goals")}
                                rows="6"
                            />
                            <Input
                                type="text"
                                name="budgetRange"
                                placeholder={t("Budget Range (Optional)")}
                                className="block md:w-full w-[100%]"
                                containerClassName="block w-full"
                            />
                            <Btn type="submit" className="mt-3">
                                {t('Send Quote Request')}
                            </Btn>
                        </FormikContainer>
                    </section>
                </section>
            </div>
        </main>
    )
}

export default ServiceQuoteRequest
