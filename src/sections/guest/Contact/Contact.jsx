import React from 'react'
import ContactUi from './ContactUi'
import { useDispatch, useSelector } from 'react-redux'
import { authActions } from '../../../store/auth-slice'
import { useSnackbar } from 'notistack'
import useSiteSettings from '../../../hooks/use-site-settings'
import { buildChannels } from '../../../site-settings'
import { useLanguage } from '../../../i18n/LanguageContext'

const Contact = () =>
{
    const isAdmin = !!useSelector(state => state.auth.token);
    const dispatch = useDispatch();
    const { enqueueSnackbar: popMessage } = useSnackbar();
    const { isSavingSettings, settings, updateSiteSettings } = useSiteSettings();
    const channels = buildChannels(settings);
    const { t } = useLanguage();
    const logout = () => { dispatch(authActions.logout()); popMessage(t("Logout successfully"), { variant: "success" }) };

    const onSendMessage = (values) =>
    {
        const subject = `${t('Email from')} ${values.name}`;
        const body = [
            `${t('Phone')}: ${values.phone}`,
            `${t('Email')}: ${values.email}`,
            `${t('Message')}: ${values.message}`,
        ].join('\r\n');
        const emailDraft = `mailto:${settings.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
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
            channels={channels}
            settings={settings}
            onEditSettings={onEditSettings}
            onSendMessage={onSendMessage}
            logout={logout}
        />
    )
}

export default Contact
