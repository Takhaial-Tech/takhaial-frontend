import callicon from '../assets/icons/callicon.svg'
import qouticon from '../assets/icons/qouticon.svg'
import { useLanguage } from '../i18n/LanguageContext'

const QuickActions = () =>
{
    const { direction, t } = useLanguage();

    return (
        <div className="mx-auto flex w-full max-w-[180px] justify-center gap-2 rounded-2xl bg-[#202020] px-2 py-1 text-white max-[768px]:gap-1 max-[768px]:px-1.5" dir={direction}>
            <a href="tel:+96599743375" className="z-[1] flex min-w-0 flex-1 cursor-pointer items-center justify-center rounded-xl px-2 py-[7px] transition-all duration-300 hover:bg-[#2a1010] hover:shadow-3xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ef4444]">
                <span className="flex min-w-0 items-center justify-center gap-1.5">
                    <img alt={''} width={15} height={15} src={callicon} className="flex-shrink-0" />
                    <label className="cursor-pointer whitespace-nowrap text-xs leading-none max-[768px]:text-[11px]">{t('Call')}</label>
                </span>
            </a>
            <a href="#section_9" className="z-[1] flex min-w-0 flex-1 cursor-pointer items-center justify-center rounded-xl px-2 py-[7px] transition-all duration-300 hover:bg-[#2a1010] hover:shadow-3xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ef4444]">
                <span className="flex min-w-0 items-center justify-center gap-1.5">
                    <img alt={''} width={15} height={15} src={qouticon} className="flex-shrink-0" />
                    <label className="cursor-pointer whitespace-nowrap text-xs leading-none max-[768px]:text-[11px]">{t('Quote')}</label>
                </span>
            </a>
        </div>
    )
}

export default QuickActions
