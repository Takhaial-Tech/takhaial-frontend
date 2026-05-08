import React, { useState } from 'react'
import HomeUi from './HomeUi'
import { useSelector } from 'react-redux';
import useGetSection from '../../../hooks/use-get-section';
import useEditItem from '../../../hooks/use-edit-item';
import useSiteSettings from '../../../hooks/use-site-settings';
import { useSnackbar } from 'notistack';
import { useLanguage } from '../../../i18n/LanguageContext';

const Home = () =>
{
    const [isOpenEditModal, setIsOpenEditModal] = useState(false);
    const [isOpenProfileModal, setIsOpenProfileModal] = useState(false);
    const [profilePdfFile, setProfilePdfFile] = useState(null);
    const isAdmin = !!useSelector(state => state.auth.token);
    const isLoadingGetSection = useGetSection(1);
    const record = useSelector(state => state.sections.sectionsData)[1]
    const { isLoadingEditSection,handleEditSection } = useEditItem(1);
    const { enqueueSnackbar: popMessage } = useSnackbar();
    const { isSavingSettings, settings, updateSiteSettings } = useSiteSettings();
    const { t } = useLanguage();

    const onEdit = (values) =>
    {
        const onSuccess = () => setIsOpenEditModal(false)
        handleEditSection(values, record[0]._id, onSuccess)
    }

    const onEditProfilePdf = () =>
    {
        if (!profilePdfFile)
        {
            popMessage(t("Choose a PDF file first"), { variant: "error" });
            return;
        }

        updateSiteSettings({}, { profilePdf: profilePdfFile }, () =>
        {
            setProfilePdfFile(null);
            setIsOpenProfileModal(false);
        });
    }

    return (
        <HomeUi
            onEdit={onEdit}
            isLoadingEdit={isLoadingEditSection}
            isAdmin={isAdmin}
            isOpenEditModal={isOpenEditModal}
            setIsOpenEditModal={setIsOpenEditModal}
            isOpenProfileModal={isOpenProfileModal}
            setIsOpenProfileModal={setIsOpenProfileModal}
            isLoadingEditSettings={isSavingSettings}
            isLoadingGetSection={isLoadingGetSection}
            onEditProfilePdf={onEditProfilePdf}
            setProfilePdfFile={setProfilePdfFile}
            siteSettings={settings}
            data={record[0]}
        />
    )
}

export default Home
