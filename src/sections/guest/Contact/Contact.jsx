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

    return (
        <ContactUi
            title="Contact Us"
            desc="We look forward to learning more about you and how we can help you achieve your goals!"
            channels={channels}
        />
    )
}

export default Contact