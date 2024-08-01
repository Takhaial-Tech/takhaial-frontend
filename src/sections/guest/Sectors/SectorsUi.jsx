import React from 'react'
import CustomModal from '../../../components/CustomModal'

const SectorsUi = (props) =>
{
    const { title, desc, sectors, modal, setModal } = props;
    return (

        <>
            <section id="section_6" className={'md:container md:mx-auto content-center min-h-[100vh] relative text-white flex justify-center items-center pt-[6rem] pb-[2rem] bg-[#000] z-[1] grid'}>
                <h1 className="font-bold justify-self-center text-2xl mb-4 glitch-trans" data-glitch={title} >{title} </h1>
                {desc && <p className="mt-[30px] justify-self-center"> {desc} </p>}
                <div className="w-full md:grid md:grid-cols-3 gap-6 items-center">
                    {sectors.map((ser, key) => (
                        <div key={key} className={'relative md:mb-0 mb-5 '}>
                            <div className="overflow-hidden min-h-[200px] border border-solid border-[red] p-5 rounded-xl hover:shadow-3xl transition-all duration-500  relative hover:bg-[#000] group/item" key={key} >
                                <img alt="" className="min-h-[80px]" width={50} height={50} src={ser.icon} />
                                <h1 className="font-bold text-larg glitch" data-glitch={ser.title}>{ser.title} </h1>
                                <p className="transition-all duration-500 transition-all duration-500  text-xs group-hover/item:my-[10px] opacity-0 group/edit mb-[-100%] overflow-hidden  group-hover/item:mb-[0]  group-hover/item:opacity-[1]  ">
                                    {ser.description}
                                </p>
                                <button onClick={(e) => setModal(ser)} className="mb-[-60px] opacity-0  group-hover/item:opacity-[1] group-hover/item:mb-0 mt-3 transition-all duration-500 w-fit rounded-xl  px-[20px] py-[10px] border border-solid border-[#ef4444] text-[#ef4444] bg-[#262626]">
                                    {'watch a demo'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <CustomModal
                isOpen={!!modal}
                onClose={() => setModal(false)}
            >

                {sectors.filter(e => e.title === modal.title).map((ser, key) => (
                    <div key={key} className={'relative inline-table md:grid grid-cols-2 gap-6'}>
                        <video controls autoPlay muted
                            style={{
                                borderRadius: "0.75rem"
                            }}
                        >
                            <source src={ser.video} type="video/mp4" />
                        </video>
                        <div className="min-h-[250px] border border-solid border-[red] p-5 rounded-xl transition-all duration-500 grid relative content-end hover:bg-[#000] group/item" key={key} >
                            <img alt="" width={50} height={50} src={ser.icon} />
                            <h1 className="font-bold text-larg mt-[10px] glitch" data-glitch={ser.title}>{ser.title} </h1>
                            <p className="m-0 transition-all duration-500 transition-all duration-500  text-lg my-[10px] group/edit  group-hover/item:h-[100%]  ">
                                {ser.description}
                            </p>
                        </div>
                    </div>
                ))}

            </CustomModal>
        </>
    )
}

export default SectorsUi