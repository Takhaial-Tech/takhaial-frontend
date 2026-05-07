import ficon from './assets/icons/ficon.svg'
import xicon from './assets/icons/xicon.svg'
import inicon from './assets/icons/inicon.svg'
import tagicon from './assets/icons/tagicon.svg'

export const defaultSiteSettings = {
    email: 'info@takhaialtech.com',
    phone: '+201500683889',
    whatsapp: '+201033930216',
    facebook: 'https://www.facebook.com/profile.php?id=61557579825313&mibextid=LQQJ4d',
    x: 'https://x.com/TakhaialTechx',
    linkedin: 'https://www.linkedin.com/company/takhaialtechx/',
    instagram: 'https://www.instagram.com/takhaial.tech?igsh=YTU4a3N0N3Z3YjYz',
    hasProfilePdf: false,
    profilePdfFilename: null,
    profilePdfUpdatedAt: null,
    profilePdfUrl: null,
}

export const buildChannels = (settings = defaultSiteSettings) => (
    [
        { img: ficon, href: settings.facebook },
        { img: xicon, href: settings.x },
        { img: inicon, href: settings.linkedin },
        { img: tagicon, href: settings.instagram },
    ].filter(channel => !!channel.href)
)

export const buildWhatsappHref = (phone) =>
{
    if (!phone) return '#';

    const cleanPhone = String(phone).replace(/[^\d+]/g, '');
    return `https://wa.me/${cleanPhone}`;
}
