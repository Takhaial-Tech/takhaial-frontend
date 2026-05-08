import React, { useState } from 'react'
import WhyUi from './WhyUi'
import { useSelector } from 'react-redux';
import useGetSection from '../../../hooks/use-get-section';
import useEditItem from '../../../hooks/use-edit-item';
import useAddItem from '../../../hooks/use-add-item';

const Why = () =>
{
    const [isOpenEditModal, setIsOpenEditModal] = useState(false);
    const isAdmin = !!useSelector(state => state.auth.token);
    const isLoadingGetSection = useGetSection(3);
    const record = useSelector(state => state.sections.sectionsData)[3] || []
    const { isLoadingEditSection, handleEditSection } = useEditItem(3);
    const { isLoadingAddSection, handleAddSection } = useAddItem(3);
    const whyData = record.find((recordItem) => recordItem?.slug === 'why-main') || record[0] || { slug: 'why-main' };

    const onEdit = (values) =>
    {
        const onSuccess = () => setIsOpenEditModal(false)
        const saveValues = { ...values, slug: 'why-main' };

        if (whyData?._id)
        {
            handleEditSection(saveValues, whyData._id, onSuccess)
            return;
        }

        handleAddSection(saveValues, onSuccess)
    }

    return (
        <WhyUi 
            onEdit={onEdit}
            isLoadingEdit={isLoadingEditSection || isLoadingAddSection}
            isAdmin={isAdmin}
            isOpenEditModal={isOpenEditModal}
            setIsOpenEditModal={setIsOpenEditModal}
            isLoadingGetSection={isLoadingGetSection}
            data={whyData}
        />
    )
}

export default Why
