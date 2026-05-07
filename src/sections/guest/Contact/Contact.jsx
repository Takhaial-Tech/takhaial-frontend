import React from 'react'
import ContactUi from './ContactUi'
import { useDispatch, useSelector } from 'react-redux'
import { authActions } from '../../../store/auth-slice'
import { useSnackbar } from 'notistack'
import useSiteSettings from '../../../hooks/use-site-settings'
import { buildChannels } from '../../../site-settings'

const Contact = () =>
{
    const isAdmin = !!useSelector(state => state.auth.token);
    const dispatch = useDispatch();
    const { enqueueSnackbar: popMessage } = useSnackbar();
    const { isSavingSettings, settings, updateSiteSettings } = useSiteSettings();
    const channels = buildChannels(settings);
    const logout = () => { dispatch(authActions.logout()); popMessage("Logout successfully", { variant: "success" }) };

    const onSendMessage = (values) =>
    {
        const emailDraft = `mailto:${settings.email}?subject=Email from ${values.name}&body=Phone: ${encodeURIComponent(values.phone)}%0D%0AEmail: ${encodeURIComponent(values.email)}%0D%0AMessage: ${encodeURIComponent(values.message)}`;
        window.open(emailDraft, '_blank');
    }

    const onEditSettings = (values, onSuccess) =>
    {
        updateSiteSettings(values, null, onSuccess);
    }

    return (
        <ContactUi
            isAdmin={isAdmin}
            isLoadingEditSettings={isSavingSettings}
            title="Contact Us"
            desc="We look forward to learning more about you and how we can help you achieve your goals!"
            channels={channels}
            settings={settings}
            onEditSettings={onEditSettings}
            onSendMessage={onSendMessage}
            logout={logout}
        />
    )
}

export default Contact
