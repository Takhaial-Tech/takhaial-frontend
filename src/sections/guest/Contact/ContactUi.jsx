import ctaicon from '../../../assets/icons/ctaicon.svg'
import contact_img from '../../../assets/icons/callicon.svg'
import mailicon from '../../../assets/icons/mailicon.svg'
import wicon from '../../../assets/icons/wicon.svg'
import cta from '../../../assets/icons/cta.svg'
import contactVideo from '../../../assets/videos/contact.mp4'
import QuickActions from '../../../components/QuickActions'
import { FormikContainer, Input } from '../../../components/inputs'
import { contactIntialValues } from './ContactInputsData'
import Textarea from '../../../components/inputs/Textarea'
import { contactValidationSchema } from './contactValidationSchema'

const ContactUi = (props) =>
{
    const { title, desc, channels, onSendMessage } = props;

    return (
        <>
            <section id="section_9" className={' mb-20 md:mb-0 min-h-screen relative text-white flex justify-center items-center pt-[6rem] px-[20px] bg-[#020815] z-[1] grid'} >
                <div className="bg-gradient-radial absolute top-0 left-0 right-0 bottom-0 z-[0]" />

                <div className="z-30 text-center" >
                    <img alt="" className="m-auto" src={ctaicon} height={80} width={80} />
                    <h1 className="font-bold justify-self-center text-2xl" >{title} </h1>
                    <p className="mt-30 justify-self-center" >
                        {desc}
                    </p>
                </div>
                <ul className=" justify-self-center text-white flex w-fit justify-self-center z-30" >
                    <a href="tel:+96599743375" className="w-[100px] mr-10 hover:shadow-3xl transition-all duration-500 w-[100px]  pr-[10px] pl-[10px] pt-[10px] pb-[10px] content-center bg-[#262626] rounded-2xl " >
                        <li className="flex">
                            <img alt={''} className="mr-2" width={15} height={15} src={contact_img} />
                            <label className='cursor-pointer '> {'Call'} </label>
                        </li>
                    </a>
                    <a href="mailto:info@takhaialtech.com" className=" hover:shadow-3xl transition-all duration-500 w-fit  pr-[10px] pl-[10px] pt-[10px] pb-[10px] content-center bg-[#262626] rounded-2xl " >
                        <li className="flex ">
                            <img alt={''} className=" mr-2" width={15} height={15} src={mailicon} />
                            <label className="text-nowrap cursor-pointer"> {'Email'} </label>
                        </li>
                    </a>
                </ul>
                <img src={cta} alt="" width={600} height={600} className="place-self-center absolute z-0" />
                <div className="w-full mb-10 mt-10 md:mt-[10px] z-30  justify-self-center relative">
                    <FormikContainer
                        initialValues={contactIntialValues}
                        validationSchema={contactValidationSchema}
                        onSubmit={onSendMessage}>
                        <div className={'grid-cols-3 '} >
                            <Input
                                type="text"
                                placeholder={"Name"}
                                name={"name"}
                                className='mr-[10px]'
                            />
                            <Input
                                type="text"
                                name={"phone"}
                                placeholder={"Phone"}
                                className='mr-[10px]'
                            />
                            <Input
                                type="email"
                                name="email"
                                placeholder={"Email"}
                            />
                        </div>
                        <Textarea
                            name='message'
                            placeholder={"Message"}
                            rows="3"
                        />
                        <button type="submit" className="transition-all duration-500 w-fit rounded-xl  px-[20px] py-[10px] border border-solid border-[#ef4444] text-[#ef4444] bg-[#262626]">
                            {'Send'}
                        </button>
                    </FormikContainer>
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
                <p className="whitespace-break-spaces z-30 mb-3 justify-self-center text-white flex width-fit flex-wrap text-center justify-center" > © 2024 <a href="#section_1" >Takhaial.tech</a> All rights reserved. developed by <a href="https://digi-sail.com/" target="_black">DIGI-SAIL</a> </p>
                {<video
                    id="myVideo"
                    webkit-playsinline="true"
                    playsInline={true} src={contactVideo} type="video/mp4" autoPlay muted loop className=" absolute  left-0 z-[-1] top-[0] h-[100vh] bottom-[0] w-full  object-cover" />
                }
            </section>


            <a target='__blank' href="https://wa.me/+96599743375" className="overflow-visible	text-center w-fit h-fit bg-[#25d366] rounded-full content-center z-10 fixed left-5 bottom-5" >
                <img alt="" width={55} height={55} src={wicon} />
            </a>
            <div className={'rounded-2xl fixed z-50 bottom-[10px] w-[190px] right-[10px] bg-[#000] border-red-500 border-red border border-solid'} >
                <h2 className="text-white my-[5px] mx-[10px]">{'Quick action'}</h2>

                <QuickActions />
            </div>
        </>
    )
}

export default ContactUi