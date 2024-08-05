import React, { useState } from 'react'
import SuccessUi from './SuccessUi'
import one from '../../../assets/images/clients/1.png';
import two from '../../../assets/images/clients/2.png';
import three from '../../../assets/images/clients/3.png';
import four from '../../../assets/images/clients/4.png';
import five from '../../../assets/images/clients/5.png';
import six from '../../../assets/images/clients/6.png';
import seven from '../../../assets/images/clients/7.png';
import eight from '../../../assets/images/clients/8.png';
import nine from '../../../assets/images/clients/9.png';
import ten from '../../../assets/images/clients/10.png';
import eleven from '../../../assets/images/clients/11.png';
import twelve from '../../../assets/images/clients/12.png';
import fourteen from '../../../assets/images/clients/14.jpg';
import fifteen from '../../../assets/images/clients/15.png';
import sixteen from '../../../assets/images/clients/16.webp';
import seventeen from '../../../assets/images/clients/17.png';
import eighteen from '../../../assets/images/clients/18.png';


const Success = () =>
{
    const [activeStep, setActiveStep] = useState(0);

    const history = [
        {
            year: '2015', description_ar: 'تم إطلاق شركة General Senses، التي تأسست في المملكة المتحدة، باعتبارها الشركة الرائدة في مجال الواقع الافتراضي والواقع المعزز في الشرق الأوسط. التركيز الكامل على البحث والتطوير',
            description: `The vision and idea of General
Senses are conceived, marking
the birth of a pioneering brand
dedicated to VR and AR
innovations in the Middle East.
` },
        {
            year: '2016', description_ar: '',
            description: `General Senses’ first customers &
success stories, Real Estate VR &
AR projects in France and
Belgium.

` },
        {
            year: '2017', description_ar: '', description: `General Senses is awarded
Startup of the Year by
SeedStars for its innovations in
VR and AR technology.

` },
        {
            year: '2018', description_ar: '', description:
                `General Senses strengthens its
presence in the VR and AR
industry, establishing a solid
foundation for future growth and
innovation. work done for MOI,
KIB, Alargan.
`
        },
        {
            year: '2019', description_ar: '',
            description:
                `GeneralSenses sees substantialgrowth,
securingpartnerships withmajorclients
includingJaguarandtheGovernmentof
Kuwait.
`
        },
        {
            year: '2020', description_ar: '',
            description:
                `Covidhits,negativelyimpacting most global industries and
economies, yet strongly
boosting VR and AR and their
valuepropositions
`
        },
        {
            year: '2021', description_ar: '',
            description:
                `acebook rebrands to Meta, announces Metaverse, and new
company direction focus
on VR & AR.
Announcement triggers
goldrush of inexperienced
late-joiners to the VR & AR
technology industry`
        },
        {
            year: '2022', description_ar: '',
            description:
                `GS is experiencing explosive
growth due to the gold rush,
closing historical deals with
Lexus, NDG and MOU with GUC
and GIU.`
        },
        {
            year: '2023', description_ar: '',
            description:
                `2023 Apple announces the Apple
Vision Pro, the world’s most
advanced Mixed Reality headset,
kickstarting a new phase of
explosive growth and enthusiasm
for Virtual Reality, Augmented
Reality and the Metaverse.
`
        },
        {
            year: '2024', description_ar: '', description:
                `General Senses rebrands to 
a specialized VR/AR brand in joint venture
with the innovative technology company
 Ghaliah, signifying a strategic management restructuring and a renewed
commitment to cutting-edge virtual
experiences.
`
        },
    ]

    const clients = [
        { year: '2015', img: fourteen, href: '', width: 150 },
        { year: '2016', img: four, href: '', width: 80 },
        { year: '2017', img: fifteen, href: '', width: 120 },
        { year: '2022', img: sixteen, href: '', width: 40 },
        { year: '2023', img: seventeen, href: '', width: 80 },
        { year: '2024', img: eighteen, href: '', width: 90 },

        { year: '2022', img: one, href: '' },
        { year: '2019', img: two, href: '' },
        { year: '2022', img: three, href: '' },
        { year: '', img: four, href: '' },
        { year: '', img: five, href: '' },
        { year: '2018', img: six, href: '' },
        { year: '2018', img: seven, href: '' },
        { year: '2018', img: eight, href: '' },
        { year: '2016', img: nine, href: '' },
        { year: '2019', img: ten, href: '' },
        { year: '2021', img: eleven, href: '' },
        { year: '2022', img: twelve, href: '', width: 80 },
    ];


    return (
        <SuccessUi
            title="History"
            desc="Pioneering the Metaverse Before It Existed"
            history={history}
            clients={clients}
            activeStep={activeStep}
            setActiveStep={setActiveStep}
        />
    )
}

export default Success