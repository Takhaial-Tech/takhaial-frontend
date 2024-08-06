import one from '../../../assets/images/clients/1.png';
import two from '../../../assets/images/clients/2.png';
import three from '../../../assets/images/clients/3.png';
import four from '../../../assets/images/clients/4.png';
import six from '../../../assets/images/clients/6.png';
import seven from '../../../assets/images/clients/7.png';
import nine from '../../../assets/images/clients/9.png';
import ten from '../../../assets/images/clients/10.png';
import sixteen from '../../../assets/images/clients/16.webp';
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