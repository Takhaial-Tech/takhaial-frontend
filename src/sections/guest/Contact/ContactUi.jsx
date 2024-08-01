import ctaicon from '../../../assets/icons/ctaicon.svg'
import contact_img from '../../../assets/icons/callicon.svg'
import mailicon from '../../../assets/icons/mailicon.svg'
import wicon from '../../../assets/icons/wicon.svg'
import cta from '../../../assets/icons/cta.svg'
import contactVideo from '../../../assets/videos/contact.mp4'
import QuickActions from '../../../components/QuickActions'

const ContactUi = (props) =>
{
    const { title, desc, channels } = props;
    return (
        <>
            <section id="section_8" className={' mb-20 md:mb-0 min-h-screen relative text-white flex justify-center items-center pt-[6rem] px-[20px] bg-[#020815] z-[1] grid'} >
                <div className="bg-gradient-radial absolute top-0 left-0 right-0 bottom-0 z-[0]" />

                <div className="z-30 text-center" >
                    <img alt="" className="m-auto" src={ctaicon} height={80} width={80} />
                    <h1 className="font-bold justify-self-center text-2xl" >{title} </h1>
                    <p className="mt-30 justify-self-center" >
                        {desc}
                    </p>
                </div>
                <ul className=" justify-self-center text-white flex w-fit justify-self-center z-30" >
                    <button href="#" className="w-[100px] mr-10 hover:shadow-3xl transition-all duration-500 w-[100px]  pr-[10px] pl-[10px] pt-[10px] pb-[10px] content-center bg-[#262626] rounded-2xl " >
                        <li className="flex">
                            <img alt={''} className="mr-2" width={15} height={15} src={contact_img} />
                            <label> {'Call'} </label>
                        </li>
                    </button>
                    <button className=" hover:shadow-3xl transition-all duration-500 w-fit  pr-[10px] pl-[10px] pt-[10px] pb-[10px] content-center bg-[#262626] rounded-2xl " >
                        <li className="flex ">
                            <img alt={''} className=" mr-2" width={15} height={15} src={mailicon} />
                            <label className="text-nowrap"> {'Email'} </label>
                        </li>
                    </button>
                </ul>
                <img src={cta} alt="" width={600} height={600} className="place-self-center absolute z-0" />
                <div className="mb-10 mt-10 md:mt-[10px] z-30  justify-self-center relative">
                    <form className="">
                        <div className={'grid-cols-3'} >
                            <input
                                type="text"
                                className="md:w-auto w-full p-[10px] bg-[#262626] rounded-xl mr-[10px] mb-[10px] backdrop-blur-md bg-[#262626]"
                                placeholder={"Name"}
                            />
                            <input
                                type="text"
                                className="md:w-auto w-full p-[10px] bg-[#262626] rounded-xl mr-[10px] mb-[10px] backdrop-blur-md bg-[#262626]"
                                placeholder={"Phone"}
                            />
                            <input
                                type="email"
                                className="md:w-auto w-full p-[10px] bg-[#262626] rounded-xl mb-[10px] backdrop-blur-md bg-[#262626]"
                                placeholder={"Email"}
                            />
                        </div>
                        <textarea
                            placeholder={"Messsage"}
                            className="w-full p-[10px] bg-[#262626] rounded-xl mr-[10px] mb-[10px] backdrop-blur-md bg-[#262626]"
                            rows="3"
                        ></textarea>
                        <button type="submit" className="transition-all duration-500 w-fit rounded-xl  px-[20px] py-[10px] border border-solid border-[#ef4444] text-[#ef4444] bg-[#262626]">
                            {'Send'}
                        </button>
                    </form>
                </div>
                <ul className=" z-30 mb-3 justify-self-center text-white flex width-fit" >
                    {channels.map((a, k) =>
                        <button key={k} className={"hover:border-[#ef4444] hover:text-[#ef4444] transition-all duration-500 pt-[8px] pb-[5px] pr-[15px] pl-[15px] content-center bg-[#262626] rounded-full border border-[#000] " + (k < channels.length - 1 && 'mr-[10px]')} href="#">
                            <li>
                                <img width={15} height={15} alt="" src={a.img} />
                            </li>
                        </button>
                    )}
                </ul>
                <p className="whitespace-break-spaces z-30 mb-3 justify-self-center text-white flex width-fit" > © 2024 <a href="#section_1" >Takhaial.tech</a> All rights reserved. developed by <a href="https://digi-sail.com/" target="_black">DIGI-SAIL</a> </p>
                {<video autoPlay muted loop className=" absolute  left-0 z-[-1] top-[0] h-[100vh] bottom-[0] w-full  object-cover">
                    <source src={contactVideo} type="video/mp4" />
                </video>}
            </section>


            {/* <Modal backdrop={'blur'} placement={'center'} isOpen={Boolean(quote)} onOpenChange={() => setQuote(false)} classNames={{ base: "focus:outline-none bg-[#000] dark:bg-[#000] text-[#fff] shadow-4xl m-10 rounded-xl", closeButton: "p-1 border-[#ef4444] border border-solid hover:bg-white/5 active:bg-white/10 z-[9] bg-[#000] right-0 top-0  rounded-none text-[2rem] rounded-tr-lg rounded-bl-lg", }}>
                <ModalContent >
                    <ModalBody className="w-full grid">
                        <a href="#section_1" className="m-2" onClick={() => setQuote(false)}>
                            <img src={"/" + state.navLogo} alt="" width={120} height={20} className="cursor-pointer hover:animate-slowspin" />
                        </a>


                        <ul className="w-full  justify-self-center text-white flex w-fit" >
                            <button href="#" className="w-full hover:shadow-3xl transition-all border-r border-solid border-[#ef4444] duration-500  rounded-l pr-[10px] pl-[10px] pt-[10px] pb-[10px] content-center bg-[#262626] rounded-s-2xl ">
                                <li className="flex"> <img alt={''} width={15} className="mr-2" height={15} src="callicon.svg" /> <label> {props.lan == 1 ? 'اتصل' : 'Call'} </label> </li>
                            </button>
                            <button href="#" className="w-full hover:shadow-3xl transition-all duration-500  rounded-l pr-[10px] pl-[10px] pt-[10px] pb-[10px] content-center bg-[#262626] rounded-e-2xl rounded-s-none ">

                                <li className="flex"> <img alt={''} width={15} className="mr-2" height={15} src="qouticon.svg" /> <label className="text-nowrap"> {props.lan == 1 ? 'عرض سعر' : 'Quote'} </label> </li>
                            </button>
                        </ul>
                    </ModalBody>
                </ModalContent>
            </Modal> */}


            <button href="#" className="overflow-visible	text-center w-fit h-fit bg-[#25d366] rounded-full content-center z-10 fixed left-5 bottom-5" >
                <img alt="" width={55} height={55} src={wicon} />
            </button>
            <div className={'rounded-2xl fixed z-50 bottom-[10px] w-[190px] right-[10px] bg-[#000] border-red-500 border-red border border-solid'} >
                <h2 className="text-white my-[5px] mx-[10px]">{'Quick action'}</h2>

                <QuickActions  />
            </div>
        </>
    )
}

export default ContactUi