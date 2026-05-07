import { Link, Navigate, useParams } from 'react-router-dom'
import logo from '../../../assets/icons/logo.svg'
import productsVideo from '../../../assets/videos/products.mp4'
import Btn from '../../../components/Btn'
import { FormikContainer, Input } from '../../../components/inputs'
import Textarea from '../../../components/inputs/Textarea'
import useSiteSettings from '../../../hooks/use-site-settings'
import { getServiceBySlug } from './serviceContent'
import { quoteRequestInitialValues, quoteRequestValidationSchema } from './quoteRequestValidationSchema'

const encodeMailBody = (value) => encodeURIComponent(value).replace(/%20/g, '+')

const ServiceQuoteRequest = () =>
{
    const { serviceSlug } = useParams();
    const service = getServiceBySlug(serviceSlug);
    const { settings } = useSiteSettings();

    if (!service)
    {
        return <Navigate to="/" replace={true} />
    }

    const onSubmit = (values) =>
    {
        const subject = `Quote request - ${service.title} - ${values.companyName}`;
        const body = [
            `Service: ${service.title}`,
            '',
            `Name: ${values.name}`,
            `Company: ${values.companyName}`,
            `Job Title: ${values.jobTitle}`,
            `Email: ${values.email}`,
            `Phone: ${values.phone}`,
            '',
            `Project Nature:`,
            values.projectNature,
            '',
            `Project Details:`,
            values.projectDetails,
            '',
            `Expected Timeline: ${values.timeline || 'Not specified'}`,
            `Budget Range: ${values.budgetRange || 'Not specified'}`,
        ].join('\r\n');

        window.open(`mailto:${settings.email}?subject=${encodeURIComponent(subject)}&body=${encodeMailBody(body)}`, '_blank');
    }

    return (
        <main className="min-h-screen bg-[#000] text-white relative overflow-hidden">
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
                        <img src={logo} alt="Takhaial" width={190} height={40} />
                    </Link>
                    <Link
                        to={`/services/${service.slug}`}
                        className="transition-all duration-500 rounded-xl px-[18px] py-[9px] border border-solid border-[#ef4444] text-[#ef4444] bg-[#262626]"
                    >
                        Back to Service
                    </Link>
                </header>

                <section className="md:container md:mx-auto grid lg:grid-cols-[360px_1fr] gap-8 items-start">
                    <aside className="border border-solid border-[#ef4444] rounded-xl p-6 bg-[#000]/75">
                        <img src={service.icon} alt="" className="max-h-[140px] m-auto mb-6" />
                        <p className="text-[#ef4444] font-bold mb-3">{service.label}</p>
                        <h1 className="text-4xl font-bold leading-tight mb-4">{service.title}</h1>
                        <p className="text-[#ccc] leading-relaxed">{service.summary}</p>
                    </aside>

                    <section className="border border-solid border-[#ef4444] rounded-xl p-5 md:p-8 bg-[#000]/75 mb-12">
                        <h2 className="text-3xl font-bold mb-2">Request a Quote</h2>
                        <p className="text-[#ccc] mb-8">
                            Tell us enough about the project so our team can understand the scope and contact the right person.
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
                                    placeholder="Full Name"
                                    className="block md:w-full w-[100%]"
                                    containerClassName="block w-full"
                                />
                                <Input
                                    type="text"
                                    name="companyName"
                                    placeholder="Company Name"
                                    className="block md:w-full w-[100%]"
                                    containerClassName="block w-full"
                                />
                                <Input
                                    type="text"
                                    name="jobTitle"
                                    placeholder="Your Role / Job Title"
                                    className="block md:w-full w-[100%]"
                                    containerClassName="block w-full"
                                />
                                <Input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    className="block md:w-full w-[100%]"
                                    containerClassName="block w-full"
                                />
                                <Input
                                    type="text"
                                    name="phone"
                                    placeholder="Contact Number"
                                    className="block md:w-full w-[100%]"
                                    containerClassName="block w-full"
                                />
                                <Input
                                    type="text"
                                    name="timeline"
                                    placeholder="Expected Timeline"
                                    className="block md:w-full w-[100%]"
                                    containerClassName="block w-full"
                                />
                            </div>
                            <Textarea
                                name="projectNature"
                                placeholder="Project Nature"
                                rows="4"
                            />
                            <Textarea
                                name="projectDetails"
                                placeholder="Project Details / Goals"
                                rows="6"
                            />
                            <Input
                                type="text"
                                name="budgetRange"
                                placeholder="Budget Range (Optional)"
                                className="block md:w-full w-[100%]"
                                containerClassName="block w-full"
                            />
                            <Btn type="submit" className="mt-3">
                                Send Quote Request
                            </Btn>
                        </FormikContainer>
                    </section>
                </section>
            </div>
        </main>
    )
}

export default ServiceQuoteRequest
