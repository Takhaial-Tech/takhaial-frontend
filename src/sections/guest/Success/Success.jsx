import React, {  useState } from 'react'
import SuccessUi from './SuccessUi'
import { useSelector } from 'react-redux';
import useGetSection from '../../../hooks/use-get-section';
import useEditItem from '../../../hooks/use-edit-item';
import useAddItem from '../../../hooks/use-add-item';


const Success = () =>
{
    const [activeStep, setActiveStep] = useState(0);
    const [isOpenEditModal, setIsOpenEditModal] = useState(false);
    const [isOpenEditTitleModal, setIsOpenEditTitleModal] = useState(false);
    const [isOpenAddModal, setIsOpenAddModal] = useState(false);
    const isAdmin = !!useSelector(state => state.auth.token);
    const isLoadingGetSection = useGetSection(5);
    const record = useSelector(state => state.sections.sectionsData)[5]
    const { isLoadingEditSection, handleEditSection } = useEditItem(5);
    const { isLoadingAddSection, handleAddSection } = useAddItem(5);
    const [images, setImages] = useState([]);

    const onEdit = (values, productIndex) =>
    {
        const onSuccess = () => { setIsOpenEditModal(false); setImages(false); }
        handleEditSection(values, record[productIndex]._id, onSuccess, { images })
    }

    const onAdd = (values) =>
    {
        const onSuccess = () => { setIsOpenAddModal(false); setImages(false); }
        handleAddSection(values, onSuccess, { images })
    }

    const onEditTitle = (values) =>
    {
        const onSuccess = () => { setIsOpenEditTitleModal(false); }
        handleEditSection(values, record[0]._id, onSuccess)
    }
    
    const history = record?.slice(1).sort((a, b) =>
    {
        if (a.title < b.title) return -1;
        if (a.title > b.title) return 1;
        return 0;
    });

    return (
        <SuccessUi
            title={record[0]?.title}
            disc={record[0]?.disc}
            history={history}
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            onEdit={onEdit}
            isLoadingEdit={isLoadingEditSection}
            isAdmin={isAdmin}
            isOpenEditModal={isOpenEditModal}
            setIsOpenEditModal={setIsOpenEditModal}
            isOpenAddModal={isOpenAddModal}
            setIsOpenAddModal={setIsOpenAddModal}
            isLoadingGetSection={isLoadingGetSection}
            images={images}
            setImages={setImages}
            onAdd={onAdd}
            isLoadingAddSection={isLoadingAddSection}
            onEditTitle={onEditTitle}
            isOpenEditTitleModal={isOpenEditTitleModal}
            setIsOpenEditTitleModal={setIsOpenEditTitleModal}
        />
    )
}

export default Success