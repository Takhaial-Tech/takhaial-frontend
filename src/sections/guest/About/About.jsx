import React, { useState } from 'react'
import AboutUi from './AboutUi'
import { useSelector } from 'react-redux';
import useGetSection from '../../../hooks/use-get-section';
import useEditItem from '../../../hooks/use-edit-item';
import useAddItem from '../../../hooks/use-add-item';

const ABOUT_BLOCKS = [
    { slug: 'about-mission', legacyIndex: 0 },
    { slug: 'about-vision', legacyIndex: 1 },
]

const About = () =>
{
    const [isOpenEditModal, setIsOpenEditModal] = useState(false);
    const [isOpenEditModal2, setIsOpenEditModal2] = useState(false);
    const isAdmin = !!useSelector(state => state.auth.token);
    const isLoadingGetSection = useGetSection(2);
    const record = useSelector(state => state.sections.sectionsData)[2] || []
    const { isLoadingEditSection, handleEditSection } = useEditItem(2);
    const { isLoadingAddSection, handleAddSection } = useAddItem(2);
    const legacyRecord = record.filter(recordItem => !recordItem?.slug);
    const aboutData = ABOUT_BLOCKS.map((block) =>
    {
        const item = record.find((recordItem) => recordItem?.slug === block.slug) || legacyRecord[block.legacyIndex] || {};
        return { ...item, slug: block.slug };
    })

    const onEdit = (values, productIndex) =>
    {
        const onSuccess = () => {!productIndex ? setIsOpenEditModal(false) : setIsOpenEditModal2(false)}
        const item = aboutData[productIndex];
        const saveValues = { ...values, slug: item.slug };

        if (item?._id)
        {
            handleEditSection(saveValues, item._id, onSuccess)
            return;
        }

        handleAddSection(saveValues, onSuccess)
    }

    return (
        <AboutUi
            onEdit={onEdit}
            isLoadingEdit={isLoadingEditSection || isLoadingAddSection}
            isAdmin={isAdmin}
            isOpenEditModal={isOpenEditModal}
            setIsOpenEditModal={setIsOpenEditModal}
            isLoadingGetSection={isLoadingGetSection}
            isOpenEditModal2={isOpenEditModal2}
            setIsOpenEditModal2={setIsOpenEditModal2}
            data={aboutData}
        />
    )
}

export default About
