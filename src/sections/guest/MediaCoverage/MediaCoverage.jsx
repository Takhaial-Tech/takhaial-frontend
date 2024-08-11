import MediaCoverageUi from './MediaCoverageUi';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import useGetSection from '../../../hooks/use-get-section';
import useEditItem from '../../../hooks/use-edit-item';
import useAddItem from '../../../hooks/use-add-item';

const MediaCoverage = () =>
{

    const [isOpenEditModal, setIsOpenEditModal] = useState(false);
    const [isOpenEditTitleModal, setIsOpenEditTitleModal] = useState(false);
    const [isOpenAddModal, setIsOpenAddModal] = useState(false);
    const isAdmin = !!useSelector(state => state.auth.token);
    const isLoadingGetSection = useGetSection(7);
    const record = useSelector(state => state.sections.sectionsData)[7]
    const { isLoadingEditSection, handleEditSection } = useEditItem(7);
    const { isLoadingAddSection, handleAddSection } = useAddItem(7);
    const [image, setImage] = useState(false);

    const onEdit = (values, productIndex) =>
    {
        const onSuccess = () => { setIsOpenEditModal(false);  setImage(false); }
        handleEditSection(values, record[productIndex]._id, onSuccess, {  image })
    }
    const onAdd = (values) =>
    {
        const onSuccess = () => { setIsOpenAddModal(false);  setImage(false); }
        handleAddSection(values, onSuccess, {  image })
    }
    const onEditTitle = (values) =>
    {
        const onSuccess = () => { setIsOpenEditTitleModal(false); setImage(false); }
        handleEditSection(values, record[0]._id, onSuccess)
    }
    const onChangeImage = (e) =>
    {
        setImage(e.target.files[0])
    }

    return (
        <MediaCoverageUi 
            list={record}
            title={record[0]?.title}
            sectors={record}
            onEdit={onEdit}
            isLoadingEdit={isLoadingEditSection}
            isAdmin={isAdmin}
            isOpenEditModal={isOpenEditModal}
            setIsOpenEditModal={setIsOpenEditModal}
            isOpenAddModal={isOpenAddModal}
            setIsOpenAddModal={setIsOpenAddModal}
            isLoadingGetSection={isLoadingGetSection}
            onChangeImage={onChangeImage}
            onAdd={onAdd}
            isLoadingAddSection={isLoadingAddSection}
            onEditTitle={onEditTitle}
            isOpenEditTitleModal={isOpenEditTitleModal}
            setIsOpenEditTitleModal={setIsOpenEditTitleModal}
        />
    )
}

export default MediaCoverage