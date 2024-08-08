import React, { useState } from 'react'
import WhyUi from './WhyUi'
import { useSelector } from 'react-redux';
import useGetSection from '../../../hooks/use-get-section';
import useEditItem from '../../../hooks/use-edit-item';

const Why = () =>
{
    const [isOpenEditModal, setIsOpenEditModal] = useState(false);
    const isAdmin = !!useSelector(state => state.auth.token);
    const isLoadingGetSection = useGetSection(3);
    const record = useSelector(state => state.sections.sectionsData)[3]
    const { isLoadingEditSection, handleEditSection } = useEditItem(3);

    const onEdit = (values) =>
    {
        const onSuccess = () => setIsOpenEditModal(false)
        handleEditSection(values, record[0]._id, onSuccess)
    }

    return (
        <WhyUi 
            onEdit={onEdit}
            isLoadingEdit={isLoadingEditSection}
            isAdmin={isAdmin}
            isOpenEditModal={isOpenEditModal}
            setIsOpenEditModal={setIsOpenEditModal}
            isLoadingGetSection={isLoadingGetSection}
            data={record[0]}
        />
    )
}

export default Why