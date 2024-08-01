import aboutVideo from '../../../assets/videos/about.mp4'

const AboutUi = (props) =>
{
    const { title, desc, title2, desc2 } = props;
    
    return (
        <section id="section_2" className={' min-h-[100vh] relative text-white flex justify-center items-center pt-[6rem] px-[20px] bg-[#000] z-[1]  relative py-[60px]'} >

            <div className="bg-gradient-radial absolute top-[-4px] left-0 right-0 bottom-[-4px] z-[0]" />
            <div className="w-full  md:grid md:grid-cols-2 gap-6 z-[10]">
                <div />
                <div>
                    <h1 className={'font-bold text-white text-3xl mb-5 glitch'} data-glitch={title}   >  {title}</h1>
                    <h2 className={"leading-relaxed content-end text-sm"}> {desc} </h2>

                    <h1 className={'font-bold text-white text-3xl mt-10 mb-5 glitch'} data-glitch={title2}  > {title2}</h1>
                    <h2 className={"leading-relaxed content-end text-sm"}> {desc2} </h2>
                </div>
            </div>
            <video autoPlay muted loop className="rotate-100 absolute  left-0 z-[-1] top-0 bottom-0 w-full h-full object-cover">
                <source src={aboutVideo} type="video/mp4" />
            </video>
        </section>
    )
}

export default AboutUi