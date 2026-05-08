import React, { useState } from 'react'
import SectorsUi from './SectorsUi'
import { useSelector } from 'react-redux';
import useGetSection from '../../../hooks/use-get-section';
import useEditItem from '../../../hooks/use-edit-item';
import useAddItem from '../../../hooks/use-add-item';

const Sectors = () =>
{
    const [modal, setModal] = useState(false);
    const [isOpenEditModal, setIsOpenEditModal] = useState(false);
    const [isOpenEditTitleModal, setIsOpenEditTitleModal] = useState(false);
    const [isOpenAddModal, setIsOpenAddModal] = useState(false);
    const isAdmin = !!useSelector(state => state.auth.token);
    const isLoadingGetSection = useGetSection(6);
    const record = useSelector(state => state.sections.sectionsData)[6]
    const { isLoadingEditSection, handleEditSection } = useEditItem(6);
    const { isLoadingAddSection, handleAddSection } = useAddItem(6);
    const [video, setVideo] = useState(false);
    const [image, setImage] = useState(false);

    const onEdit = (values, productIndex) =>
    {
        const onSuccess = () => { setIsOpenEditModal(false); setVideo(false); setImage(false); }
        handleEditSection(values, record[productIndex]._id, onSuccess, { video, image })
    }
    const onAdd = (values) =>
    {
        const onSuccess = () => { setIsOpenAddModal(false); setVideo(false); setImage(false); }
        handleAddSection(values, onSuccess, { video, image })
    }
    const onEditTitle = (values)=>{
        const onSuccess = () => { setIsOpenEditTitleModal(false); setVideo(false); setImage(false); }
        handleEditSection(values, record[0]._id, onSuccess)
    }
    const onChangeVideo = (e) =>
    {
        setVideo(e.target.files[0])
    }
    const onChangeImage = (e) =>
    {
        setImage(e.target.files[0])
    }

    return (
        <SectorsUi
            header={record[0]}
            title={record[0]?.title}
            sectors={record}
            modal={modal}
            setModal={setModal}
            onEdit={onEdit}
            isLoadingEdit={isLoadingEditSection}
            isAdmin={isAdmin}
            isOpenEditModal={isOpenEditModal}
            setIsOpenEditModal={setIsOpenEditModal}
            isOpenAddModal={isOpenAddModal}
            setIsOpenAddModal={setIsOpenAddModal}
            isLoadingGetSection={isLoadingGetSection}
            onChangeVideo={onChangeVideo}
            onChangeImage={onChangeImage}
            onAdd={onAdd}
            isLoadingAddSection={isLoadingAddSection}
            onEditTitle={onEditTitle}
            isOpenEditTitleModal={isOpenEditTitleModal}
            setIsOpenEditTitleModal={setIsOpenEditTitleModal}
        />
    )
}

export default Sectors
