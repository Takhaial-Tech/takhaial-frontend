import React from 'react'
import ContactUi from './ContactUi'
import ficon from '../../../assets/icons/ficon.svg'
import xicon from '../../../assets/icons/xicon.svg'
import inicon from '../../../assets/icons/inicon.svg'
import tagicon from '../../../assets/icons/tagicon.svg'
import { useDispatch, useSelector } from 'react-redux'
import { authActions } from '../../../store/auth-slice'
import { useSnackbar } from 'notistack'

export const channels = [
    { img: ficon, href: 'https://www.facebook.com/profile.php?id=61557579825313&mibextid=LQQJ4d' },
    { img: xicon, href: 'https://x.com/TakhaialTechx' },
    { img: inicon, href: 'https://www.linkedin.com/company/takhaialtechx/' },
    { img: tagicon, href: 'https://www.instagram.com/takhaial.tech?igsh=YTU4a3N0N3Z3YjYz' },
]

const Contact = () =>
{
    const isAdmin = !!useSelector(state => state.auth.token);
    const dispatch = useDispatch();
    const { enqueueSnackbar: popMessage } = useSnackbar();
    const logout = () => { dispatch(authActions.logout()); popMessage("Logout successfully", { variant: "success" }) };

    const onSendMessage = (values) =>
    {
        const emailDraft = `mailto:info@takhaialtech.com?subject=Email from ${values.name}&body=Phone: ${encodeURIComponent(values.phone)}%0D%0AEmail: ${encodeURIComponent(values.email)}%0D%0AMessage: ${encodeURIComponent(values.message)}`;
        window.open(emailDraft, '_blank');
    }

    return (
        <ContactUi
            isAdmin={isAdmin}
            title="Contact Us"
            desc="We look forward to learning more about you and how we can help you achieve your goals!"
            channels={channels}
            onSendMessage={onSendMessage}
            logout={logout}
        />
    )
}

export default Contact