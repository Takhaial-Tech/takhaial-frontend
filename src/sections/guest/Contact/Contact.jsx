import React from 'react'
import ContactUi from './ContactUi'
import ficon from '../../../assets/icons/ficon.svg'
import xicon from '../../../assets/icons/xicon.svg'
import inicon from '../../../assets/icons/inicon.svg'
import tagicon from '../../../assets/icons/tagicon.svg'
const Contact = () =>
{
    const channels = [
        { img: ficon, href: '' },
        { img: xicon, href: '' },
        { img: inicon, href: '' },
        { img: tagicon, href: '' },
    ]
    const onSendMessage = (values) =>
    {
        const emailDraft = `mailto:info@takhaialtech.com?subject=Email from ${values.name}&body=Phone: ${encodeURIComponent(values.phone)}%0D%0AEmail: ${encodeURIComponent(values.email)}%0D%0AMessage: ${encodeURIComponent(values.message)}`;
        window.open(emailDraft, '_blank');
    }
    
    return (
        <ContactUi
            title="Contact Us"
            desc="We look forward to learning more about you and how we can help you achieve your goals!"
            channels={channels}
            onSendMessage={onSendMessage}
        />
    )
}

export default Contact