import { Link, Navigate, useParams } from 'react-router-dom'
import logo from '../../../assets/icons/logo.svg'
import productsVideo from '../../../assets/videos/products.mp4'
import { getServiceBySlug } from './serviceContent'

const ServiceDetail = () =>
{
    const { serviceSlug } = useParams();
    const service = getServiceBySlug(serviceSlug);

    if (!service)
    {
        return <Navigate to="/" replace={true} />
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
                className="rotate-100 absolute left-0 top-0 w-full h-full object-cover opacity-30 z-[0]"
            />
            <div className="relative z-10 px-[20px] py-[28px] md:px-10">
                <header className="flex items-center justify-between gap-4 mb-12">
                    <Link to="/#section_1">
                        <img src={logo} alt="Takhaial" width={190} height={40} />
                    </Link>
                    <Link
                        to="/#section_4"
                        className="transition-all duration-500 rounded-xl px-[18px] py-[9px] border border-solid border-[#ef4444] text-[#ef4444] bg-[#262626]"
                    >
                        Back to Services
                    </Link>
                </header>

                <section className="md:container md:mx-auto">
                    <div className="grid md:grid-cols-[220px_1fr] gap-8 items-start mb-12">
                        <div className="border border-solid border-[#ef4444] rounded-xl p-6 bg-[#000]/70">
                            <img src={service.icon} alt="" className="max-h-[180px] m-auto" />
                        </div>
                        <div>
                            <p className="text-[#ef4444] font-bold mb-3">{service.label}</p>
                            <h1 className="text-4xl md:text-7xl font-bold leading-tight glitch" data-glitch={service.title}>
                                {service.title}
                            </h1>
                            <p className="mt-5 text-xl leading-relaxed max-w-[900px] text-[#ccc]">
                                {service.lead}
                            </p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-10">
                        <section className="border border-solid border-[#ef4444] rounded-xl p-6 bg-[#000]/70">
                            <h2 className="text-2xl font-bold mb-4">What we build</h2>
                            <ul className="grid gap-3 text-[#ddd] leading-relaxed">
                                {service.whatWeBuild.map((item) => (
                                    <li key={item} className="border-b border-solid border-[#262626] pb-3">{item}</li>
                                ))}
                            </ul>
                        </section>

                        <section className="border border-solid border-[#ef4444] rounded-xl p-6 bg-[#000]/70">
                            <h2 className="text-2xl font-bold mb-4">Deliverables</h2>
                            <div className="flex flex-wrap gap-3">
                                {service.deliverables.map((item) => (
                                    <span key={item} className="rounded-xl px-[14px] py-[8px] bg-[#262626] text-[#ef4444]">
                                        {item}
                                    </span>
                                ))}
                            </div>
                            <h2 className="text-2xl font-bold mt-8 mb-4">Sectors</h2>
                            <div className="grid sm:grid-cols-2 gap-3 text-[#ddd]">
                                {service.sectors.map((item) => (
                                    <span key={item} className="border border-solid border-[#262626] rounded-xl p-3">
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </section>
                    </div>

                    <section className="border border-solid border-[#ef4444] rounded-xl p-6 bg-[#000]/70 mb-12">
                        <h2 className="text-2xl font-bold mb-3">How Takhaial approaches it</h2>
                        <p className="text-[#ddd] leading-relaxed mb-5">
                            We start by understanding the business goal, audience, content, and success metric. Then we shape the user journey, build the visual or technical prototype, test the experience, and prepare a production-ready version for web, mobile, events, headsets, or campaign channels.
                        </p>
                        <p className="text-[#ccc] leading-relaxed">
                            {service.proof}
                        </p>
                    </section>

                    <div className="flex flex-wrap gap-4 mb-16">
                        <Link
                            to="/#section_9"
                            className="transition-all duration-500 rounded-xl px-[20px] py-[10px] border border-solid border-[#ef4444] text-[#ef4444] bg-[#262626]"
                        >
                            Request a Quote
                        </Link>
                        <Link
                            to="/#section_4"
                            className="transition-all duration-500 rounded-xl px-[20px] py-[10px] border border-solid border-[#ef4444] text-[#ef4444] bg-[#000]"
                        >
                            View All Services
                        </Link>
                    </div>
                </section>
            </div>
        </main>
    )
}

export default ServiceDetail
