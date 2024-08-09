import React, { useEffect, useState } from 'react'
import SuccessUi from './SuccessUi'
import one from '../../../assets/images/clients/1.png';
import two from '../../../assets/images/clients/2.png';
import lexus from '../../../assets/images/clients/lexus.png';
import four from '../../../assets/images/clients/4.png';
import five from '../../../assets/images/clients/5.png';
import six from '../../../assets/images/clients/5.png';
import seven from '../../../assets/images/clients/7.png';
import eight from '../../../assets/images/clients/8.png';
import nine from '../../../assets/images/clients/9.png';
import ten from '../../../assets/images/clients/10.png';
import eleven from '../../../assets/images/clients/11.png';
import generalSenses from '../../../assets/images/clients/generalSenses.jpg';
import fifteen from '../../../assets/images/clients/15.png';
import sixteen from '../../../assets/images/clients/16.webp';
import seventeen from '../../../assets/images/clients/17.png';
import ghaliah from '../../../assets/images/clients/ghaliah.jpg';
import corona from '../../../assets/images/clients/corona.png';
import ndg from '../../../assets/images/clients/ndg.png';
import giu from '../../../assets/images/clients/giu.png';
import unknownClient from '../../../assets/images/clients/unknownClient.jpg';
import NMEC from '../../../assets/images/clients/NMEC.jpg';
import tmdeen from '../../../assets/images/clients/tmdeen.jpg';
import beeHive from '../../../assets/images/clients/beeHive.jpg';
import GUC from '../../../assets/images/clients/GUC.jpg';
import awdet from '../../../assets/images/clients/awdet.jpg';
import ibm from '../../../assets/images/clients/ibm.jpg';
import { useSelector } from 'react-redux';
import useGetSection from '../../../hooks/use-get-section';
import useEditItem from '../../../hooks/use-edit-item';
import useAddItem from '../../../hooks/use-add-item';


const Success = () =>
{
    const [activeStep, setActiveStep] = useState(0);

    //     const history = [
    //         {
    //             year: '2015', description_ar: 'تم إطلاق شركة General Senses، التي تأسست في المملكة المتحدة، باعتبارها الشركة الرائدة في مجال الواقع الافتراضي والواقع المعزز في الشرق الأوسط. التركيز الكامل على البحث والتطوير',
    //             description: `The vision and idea of General
    // Senses are conceived, marking
    // the birth of a pioneering brand
    // dedicated to VR and AR
    // innovations in the Middle East.
    // ` },
    //         {
    //             year: '2016', description_ar: '',
    //             description: `General Senses’ first customers &
    // success stories, Real Estate VR &
    // AR projects in France and
    // Belgium.

    // ` },
    //         {
    //             year: '2017', description_ar: '', description: `General Senses is awarded
    // Startup of the Year by
    // SeedStars for its innovations in
    // VR and AR technology.

    // ` },
    //         {
    //             year: '2018', description_ar: '', description:
    //                 `General Senses strengthens its
    // presence in the VR and AR
    // industry, establishing a solid
    // foundation for future growth and
    // innovation. work done for MOI,
    // KIB, Alargan.
    // `
    //         },
    //         {
    //             year: '2019', description_ar: '',
    //             description:
    //                 `GeneralSenses sees substantialgrowth,
    // securingpartnerships withmajorclients
    // includingJaguarandtheGovernmentof
    // Kuwait.
    // `
    //         },
    //         {
    //             year: '2020', description_ar: '',
    //             description:
    //                 `Covidhits,negativelyimpacting most global industries and
    // economies, yet strongly
    // boosting VR and AR and their
    // valuepropositions
    // `
    //         },
    //         {
    //             year: '2021', description_ar: '',
    //             description:
    //                 `acebook rebrands to Meta, announces Metaverse, and new
    // company direction focus
    // on VR & AR.
    // Announcement triggers
    // goldrush of inexperienced
    // late-joiners to the VR & AR
    // technology industry`
    //         },
    //         {
    //             year: '2022', description_ar: '',
    //             description:
    //                 `GS is experiencing explosive
    // growth due to the gold rush,
    // closing historical deals with
    // Lexus, NDG and MOU with GUC
    // and GIU.`
    //         },
    //         {
    //             year: '2023', description_ar: '',
    //             description:
    //                 `2023 Apple announces the Apple Vision Pro, the world’s most advanced Mixed Reality headset, kickstarting a new phase of explosive growth and enthusiasm for Virtual Reality, Augmented Reality and the Metaverse.

    // `
    //         },
    //         {
    //             year: '2024', description_ar: '', description:
    //                 `General Senses turns into a brand Takhaial.tech, a specialized VR/AR brand in joint venture with the innovative technology company Beehive and Ghaliah , signifying a strategic management restructuring and a renewed commitment to cutting-edge virtual experiences.
    // `
    //         },
    //     ]

    //     const clients = [
    //         { year: '2015', img: generalSenses, href: '', },
    //         { year: '2016', img: four, href: '',  },
    //         { year: '2017', img: fifteen, href: '',  },
    //         { year: '2020', img: corona, href: '', },
    //         { year: '2022', img: sixteen, href: '' },
    //         { year: '2023', img: seventeen, href: ''},
    //         { year: '2023', img: lexus, href: ''},
    //         { year: '2023', img: unknownClient, href: ''},
    //         { year: '2023', img: NMEC, href: ''},
    //         { year: '2024', img: ghaliah, href: '' },
    //         { year: '2024', img: lexus, href: '' },
    //         { year: '2024', img: tmdeen, href: '' },
    //         { year: '2024', img: beeHive, href: '' },
    //         { year: '2022', img: one, href: '' },
    //         { year: '2019', img: two, href: '' },
    //         { year: '2022', img: lexus, href: '' },
    //         { year: '2018', img: six, href: '' },
    //         { year: '2018', img: seven, href: '' },
    //         { year: '2018', img: eight, href: '' },
    //         { year: '2016', img: nine, href: '' },
    //         { year: '2019', img: ten, href: '' },
    //         { year: '2021', img: eleven, href: '' },
    //         { year: '2022', img: ndg, href: '' },
    //         { year: '2022', img: GUC, href: '' },
    //         { year: '2022', img: giu, href: '' },
    //         { year: '2021', img: awdet, href: '' },
    //         { year: '2024', img: ibm, href: '' },

    //     ];

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
            // title="History"
            // desc="Pioneering the Metaverse Before It Existed"
            title={record[0]?.title}
            disc={record[0]?.disc}
            history={history}
            // clients={clients}
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