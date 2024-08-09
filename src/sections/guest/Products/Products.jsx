import React, { useState } from 'react'
import ProductsUi from './ProductsUi'
import { useSelector } from 'react-redux';
import useGetSection from '../../../hooks/use-get-section';
import useEditItem from '../../../hooks/use-edit-item';

const Products = () =>
{
    const [product, setProduct] = useState(false);
    const [isOpenEditModal, setIsOpenEditModal] = useState(false);
    const [isOpenEditModal2, setIsOpenEditModal2] = useState(false);
    const isAdmin = !!useSelector(state => state.auth.token);
    const isLoadingGetSection = useGetSection(4);
    const record = useSelector(state => state.sections.sectionsData)[4]
    const { isLoadingEditSection, handleEditSection } = useEditItem(4);
    const [video, setVideo] = useState(false);

    const onEdit = (values, productIndex) =>
    {
        const onSuccess = () => { !productIndex ? setIsOpenEditModal(false) : setIsOpenEditModal2(false) }
        handleEditSection(values, record[productIndex]._id, onSuccess,{video})
    }

    const onChangeVideo = (e) =>
    {
        setVideo(e.target.files[0])
    }

    return (
        <ProductsUi
            product={product}
            setProduct={setProduct}

            onEdit={onEdit}
            isLoadingEdit={isLoadingEditSection}
            isAdmin={isAdmin}
            isOpenEditModal={isOpenEditModal}
            setIsOpenEditModal={setIsOpenEditModal}
            isLoadingGetSection={isLoadingGetSection}
            isOpenEditModal2={isOpenEditModal2}
            setIsOpenEditModal2={setIsOpenEditModal2}
            data={record}
            onChangeVideo={onChangeVideo}
        />
    )
}

export default Products