import callicon from '../assets/icons/callicon.svg'
import qouticon from '../assets/icons/qouticon.svg'
import { useLanguage } from '../i18n/LanguageContext'

const QuickActions = () =>
{
    const { direction, t } = useLanguage();

    return (
        <div className="mx-auto flex w-full max-w-[180px] justify-center gap-2 rounded-2xl bg-[#262626] px-2 py-1 text-white" dir={direction}>
            <a href="tel:+96599743375" className="z-[1] flex min-w-0 flex-1 cursor-pointer items-center justify-center rounded-xl px-2 py-[6px] transition-all duration-500 hover:shadow-3xl">
                <span className="flex min-w-0 items-center justify-center gap-1.5">
                    <img alt={''} width={15} height={15} src={callicon} className="flex-shrink-0" />
                    <label className="cursor-pointer whitespace-nowrap text-xs leading-none">{t('Call')}</label>
                </span>
            </a>
            <a href="#section_9" className="z-[1] flex min-w-0 flex-1 cursor-pointer items-center justify-center rounded-xl px-2 py-[6px] transition-all duration-500 hover:shadow-3xl">
                <span className="flex min-w-0 items-center justify-center gap-1.5">
                    <img alt={''} width={15} height={15} src={qouticon} className="flex-shrink-0" />
                    <label className="cursor-pointer whitespace-nowrap text-xs leading-none">{t('Quote')}</label>
                </span>
            </a>
        </div>
    )
}

export default QuickActions
