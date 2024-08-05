import React from 'react'
import useOnScreen from '../../../hooks/use-on-screen';

const Sector = (props) =>
{
    const {  ser, setModal } = props;
    const [setRef, isVisible] = useOnScreen({ threshold: 0.1 });

    return (
        <div ref={setRef} className={`relative md:mb-0 mb-5 `}>
            <div className={`overflow-hidden min-h-[200px] border border-solid border-[red] p-5 rounded-xl transition-all duration-500 relative  group/item  ${isVisible ? 'shadow-3xl bg-[#000] ' : ''}`}>
                <img alt="" className="min-h-[80px]" width={50} height={50} src={ser.icon} />
                <h1 className="font-bold text-larg glitch" data-glitch={ser.title}>{ser.title}</h1>
                <p className={` transition-all duration-500 text-xs opacity-0  mb-[-100%] overflow-hidden  ${isVisible ? 'opacity-[1] my-[10px] mb-[0]' : ''}`}>
                    {ser.description}
                </p>
                <button onClick={() => setModal(ser)} className={`mb-[-60px] opacity-0   mt-3 transition-all duration-500 w-fit rounded-xl px-[20px] py-[10px] border border-solid border-[#ef4444] text-[#ef4444] bg-[#262626] ${isVisible ? 'opacity-[1] my-[10px] mb-[0] ' : ''}`}>
                    {'watch a demo'}
                </button>
            </div>
        </div>
    );
}

export default Sector