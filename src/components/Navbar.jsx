import React, { useEffect, useRef, useState } from "react";
import logo from '../assets/icons/logo.svg'
import CustomModal from "./CustomModal";
import ficon from '../assets/icons/ficon.svg'
import xicon from '../assets/icons/xicon.svg'
import inicon from '../assets/icons/inicon.svg'
import tagicon from '../assets/icons/tagicon.svg'
import QuickActions from "./QuickActions";

const Navbar = (props) =>
{

    const [progress, setProgress] = useState(0);
    const menuLinks = [
        // {name_ar:'عن الشركة',name:'Home',url:'section_1'},
        { name: 'About', url: 'section_2' },
        { name: 'Why', url: 'section_3' },
        { name: 'Products', url: 'section_4' },
        { name: 'Success', url: 'section_5' },
        { name: 'Sectors', url: 'section_6' },
        { name: 'Contact', url: 'section_8' },
    ]
    const [menu, setMenu] = useState(false);

    const channels = [
        { img: ficon, href: '' },
        { img: xicon, href: '' },
        { img: inicon, href: '' },
        { img: tagicon, href: '' },
    ]
    const onScrollbasic = () =>
    {
        const scrolled = window.scrollY;
        const height = document.documentElement.scrollHeight - window.innerHeight;

        const scrolledPercentage = ((scrolled / height) * 100) - 9;

        var bar = document.getElementById('nav__track');
        if (bar != null)
        {
            bar.style.width = scrolledPercentage + '%';
        }
        setProgress(scrolledPercentage);
    };

    useEffect(() =>
    {
        window.addEventListener("scroll", onScrollbasic);
        return () => window.removeEventListener("scroll", onScrollbasic);
    }, []);

    const sections = {
        section_1: useRef(null),
        section_2: useRef(null),
        section_3: useRef(null),
        section_4: useRef(null),
        section_5: useRef(null),
        section_6: useRef(null),
    };


    useEffect(() =>
    {
        const observer = new IntersectionObserver(
            (entries) =>
            {
                entries.forEach((entry) =>
                {
                    if (entry.isIntersecting)
                    {
                        // setActiveSection(entry.target.id);
                    }
                });
            },
            { rootMargin: "-50% 0px -50% 0px" }
        );

        Object.values(sections).forEach((ref) =>
        {
            if (ref.current) observer.observe(ref.current);
        });

        return () =>
        {
            Object.values(sections).forEach((ref) =>
            {
                if (ref.current) observer.unobserve(ref.current);
            });
        };
    }, [sections]);

    return (
        <>
            <div className="w-full h-[75px] fixed top-0 shadow-lg shadow-[#000]/50 backdrop-blur-md z-50 " >
                <div className={'w-full h-full flex flex-row items-center justify-between m-auto pl-[20px] '}>
                    <a href="#section_1" className="m-5">
                        <img src={logo} alt="" width={200} height={40} className="cursor-pointer hover:animate-slowspin " />
                    </a>
                    <button onClick={() => setMenu(true)} className="md:hidden block transition-all duration-500 rounded-xl mr-5 p-[6px] border border-solid border-[#ef4444] text-[#ef4444] bg-[#262626]">
                        <svg id="hamburger" className="w-[50px] h-[30px]" viewBox="0 0 60 40">
                            <g stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M10,7 L50,7 Z"></path>
                                <path d="M10,20 L50,20 Z"></path>
                                <path d="M10,33 L50,33 Z"></path>
                            </g>
                        </svg>
                    </button>


                    <nav className="top-[15px] md:block hidden relative top-0 right-0 w-[55%] text-white z-10 h-[6rem] after:content after:absolute after:top-[1.7rem] after:left-0 after:w-full after:z-[-1] after:bg-[#fff]">


                        <small id="nav__track" className={"z-10 absolute top-[1.7rem] left-[0] h-[0.3rem]  bg-[red] bottom-0 before:left-[0] before:bg-[red] before:top-[-4px]  before:z-50 before:h-[5.5px] before:content before:absolute before:w-[0] rounded-[40px]"}></small>
                        <div className="relative w-[max(150rem, 200%)] pb-[0px] pl-[0px] p-[1.5rem] h-[6rem]" data-draggable>
                            <ul className="justify-between list-img-none flex content-center m-[0px] p-[0px] after:content after:absolute after:top-[1.7rem] after:left-[0] after:w-[100%] after:h-[0.25rem] after:z-[-1] after:bg-[#fff] after:cursor-pointer after:rounded-[40px]">
                                {menuLinks.map((a, k) =>
                                    <li key={k}> <a href={"#" + a.url} className="min-w-[5rem] after:transform   text-sm after:content after:absolute after:top-0 after:left-[44%] after:w-[0.65rem] after:h-[0.65rem] after:bg-[red] after:rounded-full  relative block  pt-[1.25rem] px-[1rem] pb-[0.5rem] text-center text-white no-underline " data-link><span>{a.name}</span></a> </li>
                                )}
                            </ul>
                        </div>
                    </nav>
                </div>
            </div>

            <CustomModal isOpen={!!menu} onClose={() => setMenu(false)} onOpenChange={() => setMenu(false)} >
                <div style={{ padding: "15px 20px" }}>
                    <a href="#section_1" className="m-2" onClick={() => setMenu(false)}>
                        <img src={logo} alt="" width={120} height={20} className="cursor-pointer hover:animate-slowspin" />
                    </a>

                    <ul className={'m-0 w-full grid'} >
                        {menuLinks.map((a, k) =>
                            <a href={"#" + a.url} key={k} ><button onClick={() => setMenu(false)} key={k} className="md:hidden block transition-all duration-500  mr-5 p-[6px] border-b border-solid border-[#ef4444] text-[#ef4444] w-full"> <span>{a.name}</span></button></a>
                        )}
                    </ul>
                    <ul className=" z-30 mb-3 justify-self-center mt-5 text-white flex width-fit" >
                        {channels.map((a, k) =>
                            <button key={k} className={"hover:border-[#ef4444] hover:text-[#ef4444] transition-all duration-500 pt-[8px] pb-[5px] pr-[15px] pl-[15px] content-center bg-[#262626] rounded-full border border-[#000] " + (k < channels.length - 1 && 'mr-[10px]')} href="#">
                                <li>
                                    <img width={15} height={15} alt="" src={a.img} />
                                </li>
                            </button>
                        )}
                    </ul>


                    <QuickActions />
                </div>

            </CustomModal>

        </>
    );
}

export default Navbar