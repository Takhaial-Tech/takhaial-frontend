import React, { useState } from 'react'
import HomeUi from './HomeUi'
import { useSelector } from 'react-redux';
import useGetSection from '../../../hooks/use-get-section';
import useEditItem from '../../../hooks/use-edit-item';

const Home = () =>
{
    const [isOpenEditModal, setIsOpenEditModal] = useState(false);
    const isAdmin = !!useSelector(state => state.auth.token);
    const isLoadingGetSection = useGetSection(1);
    const record = useSelector(state => state.sections.sectionsData)[1]
    const { isLoadingEditSection,handleEditSection } = useEditItem(1);

    const onEdit = (values) =>
    {
        const onSuccess = () => setIsOpenEditModal(false)
        handleEditSection(values, record[0]._id, onSuccess)
    }

    return (
        <HomeUi
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

export default Home