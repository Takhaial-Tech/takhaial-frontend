import React, { useState } from 'react'
import SectorsUi from './SectorsUi'
import automotive from '../../../assets/icons/automotive.svg';
import tourism from '../../../assets/icons/tourism.svg';
import realestate from '../../../assets/icons/realestate.svg';
import education from '../../../assets/icons/education.svg';
import healthcare from '../../../assets/icons/healthcare.svg';
import others from '../../../assets/icons/others.svg';
import testVideo from '../../../assets/videos/products.mp4'
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
    // const sectors = [
    //     {
    //         // video: 'https://arglb.blob.core.windows.net/video/vecteezy_abstract-glowing-line-particles-wave-dark-background_34769234.mp4',
    //         icon: automotive,
    //         title_ar: 'السيارات',
    //         title: 'Automotive',
    //         description_ar: 'صالات العرض الإلكترونية الرقمية الواقع الافتراضي. الواقع الافتراضي تكوينات المركبات المخصصة. الواقع المعزز إسقاطات واقعية. الواقع المعزز تكوينات المركبات المخصصة',
    //         description: 'Virtual Reality Digital E-Showrooms. Virtual Reality Custom Vehicle Configurators. Augmented Reality True-To-Life Projections. Augmented Reality Custom Vehicle Configurators.'
    //     },
    //     {
    //         // video: testVideo,
    //         icon: tourism,
    //         title_ar: 'سياحة',
    //         title: 'Tourism',
    //         description_ar: '',
    //         description: 'Virtual Reality Digital E-Showrooms. Virtual Reality Custom Vehicle Configurators. Augmented Reality True-To-Life Projections. Augmented Reality Custom Vehicle Configurators.'
    //     },
    //     {
    //         // video: testVideo,
    //         icon: realestate,
    //         title_ar: 'عقارات',
    //         title: 'Real Estate',
    //         description_ar: '',
    //         description: 'Virtual Reality Digital E-Showrooms. Virtual Reality Custom Vehicle Configurators. Augmented Reality True-To-Life Projections. Augmented Reality Custom Vehicle Configurators.'
    //     },
    //     {
    //         // video: testVideo,
    //         icon: education,
    //         title_ar: 'تعليم',
    //         title: 'Educational',
    //         description_ar: '',
    //         description: 'Virtual Reality Digital E-Showrooms. Virtual Reality Custom Vehicle Configurators. Augmented Reality True-To-Life Projections. Augmented Reality Custom Vehicle Configurators.'
    //     },
    //     {
    //         // video: testVideo,
    //         icon: healthcare,
    //         title_ar: 'صحة',
    //         title: 'Healthcare',
    //         description_ar: '',
    //         description: 'Virtual Reality Digital E-Showrooms. Virtual Reality Custom Vehicle Configurators. Augmented Reality True-To-Life Projections. Augmented Reality Custom Vehicle Configurators.'
    //     },
    //     {
    //         // video: testVideo,
    //         icon: others,
    //         title_ar: 'أخرى',
    //         title: 'Other services',
    //         description_ar: '',
    //         description: 'Virtual Reality Digital E-Showrooms. Virtual Reality Custom Vehicle Configurators. Augmented Reality True-To-Life Projections. Augmented Reality Custom Vehicle Configurators.'
    //     },
    // ];


    return (
        <SectorsUi
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