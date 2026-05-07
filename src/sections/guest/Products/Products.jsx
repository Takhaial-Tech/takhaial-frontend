import React, { useState } from 'react'
import ProductsUi from './ProductsUi'
import { useSelector } from 'react-redux';
import useGetSection from '../../../hooks/use-get-section';
import useEditItem from '../../../hooks/use-edit-item';
import useAddItem from '../../../hooks/use-add-item';
import { serviceContent, serviceMatchesRecord } from './serviceContent';

const Products = () =>
{
    const [activeIntro, setActiveIntro] = useState(false);
    const [isOpenEditModal, setIsOpenEditModal] = useState(false);
    const isAdmin = !!useSelector(state => state.auth.token);
    const isLoadingGetSection = useGetSection(4);
    const record = useSelector(state => state.sections.sectionsData)[4] || []
    const { isLoadingEditSection, handleEditSection } = useEditItem(4);
    const { isLoadingAddSection, handleAddSection } = useAddItem(4);

    const [video, setVideo] = useState(false);
    const getServiceRecords = () =>
    {
        const items = record.slice(1);
        const usedIds = new Set();

        return serviceContent.map((service, index) =>
        {
            let item = items.find((recordItem) => !usedIds.has(recordItem._id) && serviceMatchesRecord(service, recordItem));

            if (!item)
            {
                item = items[index] && !usedIds.has(items[index]._id) ? items[index] : null;
            }

            if (item) usedIds.add(item._id);

            return {
                ...service,
                record: item,
                video: item?.video,
                adminDescription: item?.disc,
            }
        })
    }

    const services = getServiceRecords();

    const onEdit = (values, serviceIndex) =>
    {
        const selectedService = services[serviceIndex];
        const onSuccess = () => { setIsOpenEditModal(false); setVideo(false); }
        const serviceValues = {
            title: selectedService.title,
            disc: values.disc || selectedService.summary,
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
    return (
        <ProductsUi
            activeIntro={activeIntro}
            setActiveIntro={setActiveIntro}
            title="Services"
            onEdit={onEdit}
            isLoadingEdit={isLoadingEditSection || isLoadingAddSection}
            isAdmin={isAdmin}
            isOpenEditModal={isOpenEditModal}
            setIsOpenEditModal={setIsOpenEditModal}
            isLoadingGetSection={isLoadingGetSection}
            services={services}
            onChangeVideo={onChangeVideo}
        />
    )
}

export default Products
