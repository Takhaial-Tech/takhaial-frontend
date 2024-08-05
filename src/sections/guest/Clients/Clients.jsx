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
import fourteen from '../../../assets/images/clients/14.jpg';
import fifteen from '../../../assets/images/clients/15.png';
import sixteen from '../../../assets/images/clients/16.webp';
import seventeen from '../../../assets/images/clients/17.png';
import eighteen from '../../../assets/images/clients/18.png';
import ClientsUi from './ClientsUi';

const Clients = () =>
{
    const list = [
        {
            img: one,
        },
        {
            img:  three,
        },
        {
            img: two,
        },
        {
            img: sixteen,
        },
        {
            img: ten ,
        },
        {
            img: seven,
        },
        {
            img: four,
        },
        {
            img: six,
        },
        {
            img: nine,
        },
    ];

    return (
        <ClientsUi 
            title="Some Of Our Valued Clients"
            desc=""
            list={list}
        />
    )
}

export default Clients