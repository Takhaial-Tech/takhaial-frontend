import React, { useState } from 'react'
import AboutUi from './AboutUi'
import { useSelector } from 'react-redux';
import useGetSection from '../../../hooks/use-get-section';
import useEditItem from '../../../hooks/use-edit-item';

const About = () =>
{
    const [isOpenEditModal, setIsOpenEditModal] = useState(false);
    const [isOpenEditModal2, setIsOpenEditModal2] = useState(false);
    const isAdmin = !!useSelector(state => state.auth.token);
    const isLoadingGetSection = useGetSection(2);
    const record = useSelector(state => state.sections.sectionsData)[2]
    const { isLoadingEditSection, handleEditSection } = useEditItem(2);

    const onEdit = (values, productIndex) =>
    {
        const onSuccess = () => {!productIndex ? setIsOpenEditModal(false) : setIsOpenEditModal2(false)}
        handleEditSection(values, record[productIndex]._id, onSuccess)
    }

    return (
        <AboutUi
            onEdit={onEdit}
            isLoadingEdit={isLoadingEditSection}
            isAdmin={isAdmin}
            isOpenEditModal={isOpenEditModal}
            setIsOpenEditModal={setIsOpenEditModal}
            isLoadingGetSection={isLoadingGetSection}
            isOpenEditModal2={isOpenEditModal2}
            setIsOpenEditModal2={setIsOpenEditModal2}
            data={record}
        />
    )
}

export default About