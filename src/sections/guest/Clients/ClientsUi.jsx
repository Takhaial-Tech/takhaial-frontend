import React from 'react'

const ClientsUi = (props) =>
{
    const { title, list } = props;
    return (
        <section id="section_8" className={'bg-[#494e53] p-[20px]  mx-auto content-center min-h-[100vh] relative text-white flex justify-center items-center pt-[6rem] pb-[2rem] bg-[#000] z-[1] grid'}>
            <h1 className="text-center font-bold justify-self-center text-2xl mb-6 glitch-trans" data-glitch={title}>{title}</h1>
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 items-center ">
                {list.map((item, key) => (
                    <a href={item.link} target="__blank" key={key} className={'t flex items-center justify-center  relative md:mb-0 mb-5'}>
                        <img alt="" className="max-w-[150px]  max-h-[150px]" src={item.img} />
                    </a>
                ))}
            </div>
        </section>
    )
}

export default ClientsUi
