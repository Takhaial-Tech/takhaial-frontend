import callicon from '../assets/icons/callicon.svg'
import qouticon from '../assets/icons/qouticon.svg'
import wicon from '../assets/icons/wicon.svg'
import { buildWhatsappHref } from '../site-settings'
import { useLanguage } from '../i18n/LanguageContext'
import { trackTikTokEvent } from '../helpers/tiktokPixel'

const EGYPT_PHONE = '+201033930216';

const QuickActions = () =>
{
    const { direction, t } = useLanguage();

    return (
        <div className="mx-auto flex w-full max-w-[270px] justify-center gap-2 rounded-2xl bg-[#202020] px-2 py-1 text-white max-[768px]:max-w-[240px] max-[768px]:gap-1 max-[768px]:px-1.5" dir={direction}>
            <a
                href={`tel:${EGYPT_PHONE}`}
                onClick={() => trackTikTokEvent('Contact', {
                    content_type: 'quick_action',
                    content_name: 'Phone call',
                    method: 'phone',
                })}
                className="z-[1] flex min-w-0 flex-1 cursor-pointer items-center justify-center rounded-xl px-2 py-[7px] transition-all duration-300 hover:bg-[#2a1010] hover:shadow-3xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ef4444]"
            >
                <span className="flex min-w-0 items-center justify-center gap-1.5">
                    <img alt={''} width={15} height={15} src={callicon} className="flex-shrink-0" />
                    <label className="cursor-pointer whitespace-nowrap text-xs leading-none max-[768px]:text-[11px] max-[340px]:hidden">{t('Call')}</label>
                </span>
            </a>
            <a
                target="_blank"
                rel="noreferrer"
                href={buildWhatsappHref(EGYPT_PHONE)}
                onClick={() => trackTikTokEvent('Contact', {
                    content_type: 'quick_action',
                    content_name: 'WhatsApp',
                    method: 'whatsapp',
                })}
                className="z-[1] flex min-w-0 flex-1 cursor-pointer items-center justify-center rounded-xl px-2 py-[7px] transition-all duration-300 hover:bg-[#17351f] hover:shadow-3xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25d366]"
            >
                <span className="flex min-w-0 items-center justify-center gap-1.5">
                    <img alt={''} width={15} height={15} src={wicon} className="flex-shrink-0" />
                    <label className="cursor-pointer whitespace-nowrap text-xs leading-none max-[768px]:text-[11px] max-[340px]:hidden">{t('WhatsApp')}</label>
                </span>
            </a>
            <a
                href="#section_9"
                onClick={() => trackTikTokEvent('Contact', {
                    content_type: 'quick_action',
                    content_name: 'Quote',
                    method: 'quote',
                })}
                className="z-[1] flex min-w-0 flex-1 cursor-pointer items-center justify-center rounded-xl px-2 py-[7px] transition-all duration-300 hover:bg-[#2a1010] hover:shadow-3xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ef4444]"
            >
                <span className="flex min-w-0 items-center justify-center gap-1.5">
                    <img alt={''} width={15} height={15} src={qouticon} className="flex-shrink-0" />
                    <label className="cursor-pointer whitespace-nowrap text-xs leading-none max-[768px]:text-[11px] max-[340px]:hidden">{t('Quote')}</label>
                </span>
            </a>
        </div>
    )
}

export default QuickActions
