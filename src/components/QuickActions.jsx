import callicon from '../assets/icons/callicon.svg'
import qouticon from '../assets/icons/qouticon.svg'
import { useLanguage } from '../i18n/LanguageContext'

const QuickActions = () =>
{
    const { t } = useLanguage();

    return (
        <ul className="w-full justify-self-center text-white flex w-fit bg-[#262626] rounded-2xl" >
            <a href="tel:+96599743375" className="z-[1] cursor-pointer hover:shadow-3xl transition-all duration-500 w-[100px] rounded-l pl-[10px] py-[5px] content-center  rounded-s-2xl " style={{ marginRight: "10px" }}>
                <li className="flex items-center gap-2"> <img alt={''} width={15} height={15} src={callicon} /> <label className="text-nowrap cursor-pointer"> {t('Call')} </label> </li>
            </a>
            <a href="#section_9" className="z-[1] cursor-pointer hover:shadow-3xl transition-all duration-500 w-[100px] rounded-l pl-[10px] py-[5px] content-center  rounded-e-2xl rounded-s-none " >
                <li className="flex items-center gap-2"
                //  onClick={() => setQuote(true)}
                > <img alt={''} width={15} height={15} src={qouticon} /> <label className="text-nowrap cursor-pointer"> {t('Quote')} </label> </li>
            </a>
        </ul>
    )
}

export default QuickActions
