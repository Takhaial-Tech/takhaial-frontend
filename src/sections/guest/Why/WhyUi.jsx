import  whyBG from '../../../assets/icons/battern.svg'
import  takhaialLogo from '../../../assets/icons/logoname.svg'

const WhyUi = (props) =>
{
    const {title, desc} = props;
    return (
        <section dir={'ltr'} id="section_3" className={'min-h-[100vh] relative text-white flex justify-center items-center pt-[2rem] bg-[#000] z-[1]  relative py-[60px] overflow-hidden '} >

            <div className="w-full bg-gradient-radial2 min-h-[80vh] content-center">

                <div className="px-[20px]  md:container md:mx-auto md:grid md:grid-cols-5 gap-6 items-center">
                    <img src={whyBG} alt=''  height={130} width={230} className="absolute  right-[-20px] z-[-10] " />
                    <div className="" >
                    </div>
                    <div className="col-span-3">
                        <div className='flex items-start'>
                            <h1 className={'font-bold text-white text-2xl mb-5 flex glitch-trans'} data-glitch={title}>{title}  </h1>
                            <img src={takhaialLogo} alt="" height={100} width={155}  className="mt-[5px] ml-[-10px]" />
                        </div>

                        {desc.split('.').map((a, k) =>
                            <p key={k} className={"leading-relaxed content-end text-sm "} >{a}.</p>
                        )}

                    </div>
                </div>
            </div>
        </section>
    )
}

export default WhyUi