import React, { useState } from 'react'
import ProductsUi from './ProductsUi'
import { useSelector } from 'react-redux';
import useGetSection from '../../../hooks/use-get-section';
import useEditItem from '../../../hooks/use-edit-item';
import useAddItem from '../../../hooks/use-add-item';
import { getServiceRecords, serviceToFormValues, servicesSectionHeader } from './serviceContent';

const Products = () =>
{
    const [activeIntro, setActiveIntro] = useState(false);
    const [isOpenEditModal, setIsOpenEditModal] = useState(false);
    const [isOpenEditTitleModal, setIsOpenEditTitleModal] = useState(false);
    const isAdmin = !!useSelector(state => state.auth.token);
    const isLoadingGetSection = useGetSection(4);
    const record = useSelector(state => state.sections.sectionsData)[4] || []
    const { isLoadingEditSection, handleEditSection } = useEditItem(4);
    const { isLoadingAddSection, handleAddSection } = useAddItem(4);

    const [video, setVideo] = useState(false);
    const services = getServiceRecords(record);
    const headerRecord = record.find((item) => item?.slug === servicesSectionHeader.slug);
    const header = headerRecord || servicesSectionHeader;

    const onEdit = (values, serviceIndex) =>
    {
        const selectedService = services[serviceIndex];
        const onSuccess = () => { setIsOpenEditModal(false); setVideo(false); }
        const serviceValues = {
            ...serviceToFormValues(selectedService),
            ...values,
            slug: selectedService.slug,
            disc: values.disc || selectedService.summary,
            discAr: values.discAr || selectedService.summaryAr,
        }

        if (selectedService.record?._id)
        {
            handleEditSection(serviceValues, selectedService.record._id, onSuccess, { video })
            return;
        }

        handleAddSection(serviceValues, onSuccess, { video })
    }

    const onChangeVideo = (e) =>
    {
        setVideo(e.target.files[0])
    }

    const onEditTitle = (values) =>
    {
        const onSuccess = () => setIsOpenEditTitleModal(false);
        const saveValues = { ...values, slug: servicesSectionHeader.slug };

        if (headerRecord?._id)
        {
            handleEditSection(saveValues, headerRecord._id, onSuccess)
            return;
        }

        handleAddSection(saveValues, onSuccess)
    }

    return (
        <ProductsUi
            activeIntro={activeIntro}
            setActiveIntro={setActiveIntro}
            header={header}
            onEditTitle={onEditTitle}
            onEdit={onEdit}
            isLoadingEdit={isLoadingEditSection || isLoadingAddSection}
            isAdmin={isAdmin}
            isOpenEditModal={isOpenEditModal}
            setIsOpenEditModal={setIsOpenEditModal}
            isOpenEditTitleModal={isOpenEditTitleModal}
            setIsOpenEditTitleModal={setIsOpenEditTitleModal}
            isLoadingGetSection={isLoadingGetSection}
            services={services}
            onChangeVideo={onChangeVideo}
        />
    )
}

export default Products
