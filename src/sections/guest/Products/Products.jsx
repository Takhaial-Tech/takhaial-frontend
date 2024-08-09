import React, { useState } from 'react'
import ProductsUi from './ProductsUi'
import { useSelector } from 'react-redux';
import useGetSection from '../../../hooks/use-get-section';
import useEditItem from '../../../hooks/use-edit-item';
import useAddItem from '../../../hooks/use-add-item';

const Products = () =>
{
    const [product, setProduct] = useState(false);
    const [isOpenEditModal, setIsOpenEditModal] = useState(false);
    const [isOpenAddModal, setIsOpenAddModal] = useState(false);
    const isAdmin = !!useSelector(state => state.auth.token);
    const isLoadingGetSection = useGetSection(4);
    const record = useSelector(state => state.sections.sectionsData)[4]
    const { isLoadingEditSection, handleEditSection } = useEditItem(4);
    const { isLoadingAddSection, handleAddSection } = useAddItem(4);

    const [video, setVideo] = useState(false);
    const [isOpenEditTitleModal, setIsOpenEditTitleModal] = useState(false);
    const onAdd = (values) =>
    {
        const onSuccess = () => { setIsOpenAddModal(false); setVideo(false);}
        handleAddSection(values, onSuccess, { video })
    }
    const onEdit = (values, productIndex) =>
    {
        const onSuccess = () => { setIsOpenEditModal(false) }
        handleEditSection(values, record[productIndex]._id, onSuccess,{video})
    }

    const onChangeVideo = (e) =>
    {
        setVideo(e.target.files[0])
    }
    const onEditTitle = (values) =>
    {
        const onSuccess = () => { setIsOpenEditTitleModal(false);  }
        handleEditSection(values, record[0]._id, onSuccess)
    }
    return (
        <ProductsUi
            product={product}
            setProduct={setProduct}
            title={record[0]?.title}
            onEdit={onEdit}
            isLoadingEdit={isLoadingEditSection}
            isAdmin={isAdmin}
            isOpenEditModal={isOpenEditModal}
            setIsOpenEditModal={setIsOpenEditModal}
            isLoadingGetSection={isLoadingGetSection}
            isOpenAddModal={isOpenAddModal}
            setIsOpenAddModal={setIsOpenAddModal}
            data={record}
            onChangeVideo={onChangeVideo}
            onEditTitle={onEditTitle}
            isOpenEditTitleModal={isOpenEditTitleModal}
            setIsOpenEditTitleModal={setIsOpenEditTitleModal}
            isLoadingAddSection={isLoadingAddSection}
            onAdd={onAdd}
        />
    )
}

export default Products