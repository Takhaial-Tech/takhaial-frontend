import React, { useCallback, useEffect, useState } from "react";
import logo from '../assets/icons/logo.svg'
import CustomModal from "./CustomModal";
import QuickActions from "./QuickActions";
import useSiteSettings from "../hooks/use-site-settings";
import { buildChannels } from "../site-settings";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "../i18n/LanguageContext";

const Navbar = (props) =>
{
    const { settings } = useSiteSettings();
    const channels = buildChannels(settings);
    const { direction, t } = useLanguage();
    const isRtl = direction === 'rtl';

    const menuLinks = [
        { name: 'About', url: 'section_2' },
        { name: 'Why', url: 'section_3' },
        { name: 'Services', url: 'section_4' },
        { name: 'Sectors', url: 'section_6' },
        { name: 'Media', url: 'section_7' },
        { name: 'Clients', url: 'section_8' },
        { name: 'Contact', url: 'section_9' },
    ]
    const [menu, setMenu] = useState(false);

    const onScrollbasic = useCallback(() =>
    {
        const sections = document.querySelectorAll('section');
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        let scrolled = window.scrollY;
        let progress = 0;
        if (sections.length > 0)
        {
            const firstSectionTop = sections[0].offsetTop;
            const lastSectionBottom = sections[sections.length - 1].offsetTop + sections[sections.length - 1].offsetHeight;

            if (scrolled < firstSectionTop)
            {
                progress = 0;
            } else if (scrolled > lastSectionBottom)
            {
                progress = 100;
            } else
            {
                const visibleHeight = scrolled - firstSectionTop;
                progress = (visibleHeight / totalHeight) * 100 ;
            }
        }

        const bar = document.getElementById('nav__track');
        if (bar)
        {
            const clampedProgress = Math.max(0, Math.min(100, progress));
            bar.style.left = isRtl ? 'auto' : '0';
            bar.style.right = isRtl ? '0' : 'auto';
            bar.style.width = `${clampedProgress}%`;
        }
    }, [isRtl]);

    useEffect(() =>
    {
        window.addEventListener("scroll", onScrollbasic);
        onScrollbasic();
        return () => window.removeEventListener("scroll", onScrollbasic);
    }, [onScrollbasic]);


    return (
        <>
            <div className="w-full h-[75px] fixed top-0 shadow-lg shadow-[#000]/50 backdrop-blur-md z-50 " dir="ltr">
                <div className={'w-full h-full relative flex flex-row items-center justify-between m-auto px-[16px] md:px-[24px] '} dir="ltr">
                    <a href="#section_1" className="flex flex-shrink-0 items-center">
                        <img src={logo} alt="Takhaial" width={170} height={44} className="cursor-pointer hover:animate-slowspin max-w-[125px] md:max-w-[170px]" />
                    </a>


                    <nav className="lg:block hidden absolute left-1/2 top-[12px] w-[min(660px,calc(100vw-500px))] min-w-[560px] -translate-x-1/2 text-white z-10 h-[60px]" dir={direction}>


                        <small id="nav__track" className={`z-10 absolute top-[18px] ${isRtl ? 'right-[0] before:right-[0]' : 'left-[0] before:left-[0]'} h-[0.3rem] bg-[#ef4444] bottom-0 before:bg-[#ef4444] before:top-[-4px] before:z-50 before:h-[5.5px] before:content before:absolute before:w-[0] rounded-[40px] transition-[width] duration-150 ease-out`}></small>
                        <div className="relative w-full pb-[0px] px-[0px] pt-[18px] h-[60px]" data-draggable>
                            <ul className="justify-between list-img-none flex content-center m-[0px] p-[0px] after:content after:absolute after:top-[18px] after:left-[0] after:w-[100%] after:h-[0.25rem] after:z-[-1] after:bg-[#f5f5f5] after:cursor-pointer after:rounded-[40px]">
                                {menuLinks.map((a, k) =>
                                    <li key={k}> <a href={"#" + a.url} className={`${!k || k === menuLinks.length - 1? 'w-[5rem]' : 'w-[5rem]' } after:transform text-xs after:content after:absolute after:top-0 dots-nav after:w-[0.65rem] after:h-[0.65rem] after:bg-[#ef4444] after:rounded-full relative block pt-[1.25rem] px-[0.5rem] pb-[0.5rem] text-center text-white no-underline transition-colors duration-200 hover:text-[#ef4444] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ef4444]`}
                                        style={{ backgroundColor:"" }}
                                    data-link><span dir={direction}>{t(a.name)}</span></a> </li>
                                )}
                            </ul>
                        </div>
                    </nav>
                    <div className="flex flex-shrink-0 items-center gap-2">
                        <LanguageSwitcher />
                        <button onClick={() => setMenu(true)} className="lg:hidden block transition-all duration-500 rounded-xl p-[6px] border border-solid border-[#ef4444] text-[#ef4444] bg-[#262626]">
                            <svg id="hamburger" className="w-[42px] h-[28px]" viewBox="0 0 60 40">
                                <g stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M10,7 L50,7 Z"></path>
                                    <path d="M10,20 L50,20 Z"></path>
                                    <path d="M10,33 L50,33 Z"></path>
                                </g>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <CustomModal isOpen={!!menu} onClose={() => setMenu(false)} onOpenChange={() => setMenu(false)} >
                <div style={{ padding: "15px 20px" }}>
                    <a href="#section_1" className="m-2" onClick={() => setMenu(false)}>
                        <img src={logo} alt="Takhaial" width={105} height={28} className="cursor-pointer hover:animate-slowspin" />
                    </a>

                    <ul className={'m-0 w-full grid'} >
                        {menuLinks.map((a, k) =>
                            <a href={"#" + a.url} key={k} ><button onClick={() => setMenu(false)} key={k} className="lg:hidden block transition-all duration-500 p-[10px] border-b border-solid border-[#ef4444] text-[#ef4444] w-full text-center"> <span>{t(a.name)}</span></button></a>
                        )}
                    </ul>
                    <ul className=" z-30 mb-3 justify-self-center mt-5 text-white flex width-fit gap-3" >
                        {channels.map((a, k) =>
                            <a target="__blank" key={k} className={"hover:border-[#ef4444] hover:text-[#ef4444] transition-all duration-500 pt-[8px] pb-[5px] pr-[15px] pl-[15px] content-center bg-[#262626] rounded-full border border-[#000] "} href={a.href}>
                                <li>
                                    <img width={15} height={15} alt="" src={a.img} />
                                </li>
                            </a>
                        )}
                    </ul>


                    <QuickActions />
                </div>

            </CustomModal>

        </>
    );
}

export default Navbar
