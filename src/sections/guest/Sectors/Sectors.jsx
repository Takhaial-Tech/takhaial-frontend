import React, { useState } from 'react'
import SectorsUi from './SectorsUi'
import automotive from '../../../assets/icons/automotive.svg';
import tourism from '../../../assets/icons/tourism.svg';
import realestate from '../../../assets/icons/realestate.svg';
import education from '../../../assets/icons/education.svg';
import healthcare from '../../../assets/icons/healthcare.svg';
import others from '../../../assets/icons/others.svg';
import testVideo from '../../../assets/videos/products.mp4'

const Sectors = () =>
{
    const [modal, setModal] = useState(false);

    const sectors = [
        {
            video: 'https://arglb.blob.core.windows.net/video/vecteezy_abstract-glowing-line-particles-wave-dark-background_34769234.mp4',
            icon: automotive,
            title_ar: 'السيارات',
            title: 'Automotive',
            description_ar: 'صالات العرض الإلكترونية الرقمية الواقع الافتراضي. الواقع الافتراضي تكوينات المركبات المخصصة. الواقع المعزز إسقاطات واقعية. الواقع المعزز تكوينات المركبات المخصصة',
            description: 'Virtual Reality Digital E-Showrooms. Virtual Reality Custom Vehicle Configurators. Augmented Reality True-To-Life Projections. Augmented Reality Custom Vehicle Configurators.'
        },
        {
            video: testVideo,
            icon: tourism,
            title_ar: 'سياحة',
            title: 'Tourism',
            description_ar: '',
            description: 'Virtual Reality Digital E-Showrooms. Virtual Reality Custom Vehicle Configurators. Augmented Reality True-To-Life Projections. Augmented Reality Custom Vehicle Configurators.'
        },
        {
            video: testVideo,
            icon: realestate,
            title_ar: 'عقارات',
            title: 'Real Estate',
            description_ar: '',
            description: 'Virtual Reality Digital E-Showrooms. Virtual Reality Custom Vehicle Configurators. Augmented Reality True-To-Life Projections. Augmented Reality Custom Vehicle Configurators.'
        },
        {
            video: testVideo,
            icon: education,
            title_ar: 'تعليم',
            title: 'Educational',
            description_ar: '',
            description: 'Virtual Reality Digital E-Showrooms. Virtual Reality Custom Vehicle Configurators. Augmented Reality True-To-Life Projections. Augmented Reality Custom Vehicle Configurators.'
        },
        {
            video: testVideo,
            icon: healthcare,
            title_ar: 'صحة',
            title: 'Healthcare',
            description_ar: '',
            description: 'Virtual Reality Digital E-Showrooms. Virtual Reality Custom Vehicle Configurators. Augmented Reality True-To-Life Projections. Augmented Reality Custom Vehicle Configurators.'
        },
        {
            video: testVideo,
            icon: others,
            title_ar: 'أخرى',
            title: 'Others',
            description_ar: '',
            description: 'Virtual Reality Digital E-Showrooms. Virtual Reality Custom Vehicle Configurators. Augmented Reality True-To-Life Projections. Augmented Reality Custom Vehicle Configurators.'
        },
    ];

    return (
        <SectorsUi 
            title="INDUSTRIES OF FOCUS"
            desc=""
            sectors={sectors}
            modal={modal}
            setModal={setModal}
        
        />
    )
}

export default Sectors