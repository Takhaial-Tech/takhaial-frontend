import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { backendUrl, settingsModulePath } from '../config';
import { defaultSiteSettings } from '../site-settings';
import { useLanguage } from '../i18n/LanguageContext';

const normalizeSettings = (record = {}) =>
{
    const mergedSettings = {
        ...defaultSiteSettings,
        ...record,
    };

    return {
        ...mergedSettings,
        profilePdfUrl: mergedSettings.hasProfilePdf
            ? `${backendUrl}${settingsModulePath}/company-profile${mergedSettings.profilePdfUpdatedAt ? `?v=${encodeURIComponent(mergedSettings.profilePdfUpdatedAt)}` : ''}`
            : null,
    };
}

const useSiteSettings = () =>
{
    const [settings, setSettings] = useState(defaultSiteSettings);
    const [isLoadingSettings, setIsLoadingSettings] = useState(false);
    const [isSavingSettings, setIsSavingSettings] = useState(false);
    const token = useSelector((state) => state.auth.token);
    const { enqueueSnackbar: popMessage } = useSnackbar();
    const { t } = useLanguage();

    const getSiteSettings = useCallback(async () =>
    {
        setIsLoadingSettings(true);

        try
        {
            const response = await fetch(`${backendUrl}${settingsModulePath}`);
            const data = await response.json();

            if (!response.ok || !data.success)
            {
                throw new Error(data.message || t('Unable to load site settings'));
            }

            setSettings(normalizeSettings(data.record));
        } catch (error)
        {
            setSettings(defaultSiteSettings);
        }

        setIsLoadingSettings(false);
    }, [t]);

    const updateSiteSettings = useCallback(async (values = {}, media = {}, onSuccess) =>
    {
        setIsSavingSettings(true);

        try
        {
            const submitData = new FormData();

            Object.keys(values).forEach((key) =>
            {
                submitData.append(key, values[key] || '');
            });

            if (media?.profilePdf)
            {
                submitData.append('profilePdf', media.profilePdf);
            }

            const response = await fetch(`${backendUrl}${settingsModulePath}`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: submitData,
            });
            const data = await response.json();

            if (!response.ok || !data.success)
            {
                throw new Error(data.message || t('Unable to update site settings'));
            }

            const nextSettings = normalizeSettings(data.record);
            setSettings(nextSettings);
            popMessage(t('Settings updated successfully'), { variant: 'success' });
            if (onSuccess) onSuccess(nextSettings);
        } catch (error)
        {
            popMessage(t(error.message || 'Something went wrong'), { variant: 'error' });
        }

        setIsSavingSettings(false);
    }, [popMessage, t, token]);

    useEffect(() =>
    {
        getSiteSettings();
    }, [getSiteSettings]);

    return {
        getSiteSettings,
        isLoadingSettings,
        isSavingSettings,
        settings,
        updateSiteSettings,
    };
}

export default useSiteSettings;
