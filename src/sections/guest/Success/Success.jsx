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
import thirteen from '../../../assets/images/clients/13.png';


const Success = () =>
{
    const [activeStep, setActiveStep] = useState(0);

    const history = [
        { year: '2015', description_ar: 'تم إطلاق شركة General Senses، التي تأسست في المملكة المتحدة، باعتبارها الشركة الرائدة في مجال الواقع الافتراضي والواقع المعزز في الشرق الأوسط. التركيز الكامل على البحث والتطوير', description: 'General Senses incorporated in UK, launches as the Middle East’s VR and AR pioneer. Full focus on R&D.' },
        { year: '2016', description_ar: '', description: 'General Senses’ first customers & success stories, Real Estate VR & AR projects in France and Belgium.' },
        { year: '2018', description_ar: '', description: 'General Senses closes $0.5 million round of investment, establishes GCC HQ in Kuwait.' },
        { year: '2019', description_ar: '', description: 'General Senses experiences exponential growth and lands multiple major clients, such as Jaguar and Government of Kuwait.' },
        { year: '2020', description_ar: '', description: 'Covid hits, negatively impacting most global industries and economies, yet strongly boosting VR and AR and their value propositions.' },
        { year: '2021', description_ar: '', description: 'Facebook rebrands to Meta, announces Metaverse, and new company direction focus on VR & AR. Announcement triggers goldrush of inexperienced late joiners to the VR & AR technology industry.' },
        { year: '2022', description_ar: '', description: 'GS is experiencing explosive growth due to the gold rush, closing historical deals with Lexus, NDG and MOU with GUC and GIU.' },
        { year: '2024', description_ar: '', description: 'General Senses, Rebranded as Takhaial.com and partnered with Kuwait top content and media company Ghaliah.' },
    ]

    const clients = [
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
        { year: '2022', img: twelve, href: '' },
        { year: '2023', img: thirteen, href: '' },
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