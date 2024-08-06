import React from 'react';
import CustomModal from '../../../components/CustomModal';
import Sector from './Sector';


const SectorsUi = (props) =>
{
    const { title, desc, sectors, modal, setModal } = props;

    return (
        <>
            <section id="section_6" className="w-[90%] mx-auto md:container md:mx-auto content-center min-h-[100vh] relative text-white flex justify-center items-center pt-[6rem] pb-[2rem] bg-[#000] z-[1] grid">
                <h1 className="mb-[3rem] font-bold justify-self-center text-2xl mb-4 glitch-trans" data-glitch={title}>{title}</h1>
                {desc && <p className="mt-[30px] justify-self-center">{desc}</p>}
                <div className="px-[20px] w-full md:grid md:grid-cols-3 gap-6 items-center">
                    {sectors.map((ser, key) =>
                        <Sector setModal={setModal} ser={ser} key={key} />
                    )}
                </div>
            </section>

            <CustomModal isOpen={!!modal} onClose={() => setModal(false)}>
                {sectors.filter(e => e.title === modal.title).map((ser, key) => (
                    <div key={key} className="modal-video relative inline-table md:grid grid-cols-2 gap-6 flex items-center pb-[40px]" >
                        <video className='' controls autoPlay style={{ borderRadius: "0.75rem", width: "100%" }}>
                            <source src={'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'} type="video/mp4" />
                        </video>
                        <div className="min-h-[250px] border border-solid border-[red] p-5 rounded-xl transition-all duration-500 grid relative content-end bg-[#000] group/item">
                            <img alt="" width={50} height={50} src={ser.icon} />
                            <h1 className="font-bold text-larg mt-[10px] glitch" data-glitch={ser.title}>{ser.title}</h1>
                            <p className="m-0 transition-all duration-500 text-lg my-[10px] group/edit group-hover:item:h-[100%]">
                                {ser.description}
                            </p>
                        </div>
                    </div>
                ))}
            </CustomModal>
        </>
    );
}

export default SectorsUi;
