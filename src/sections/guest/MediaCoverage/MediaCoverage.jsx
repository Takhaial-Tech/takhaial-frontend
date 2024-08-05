import elgreda from '../../../assets/images/mediaCoverage/elgreda.png';
import elraay from '../../../assets/images/mediaCoverage/elraay.svg';
import elkbs from '../../../assets/images/mediaCoverage/elkbs.png';
import startupMgzn from '../../../assets/images/mediaCoverage/startupMgzn.png';
import arabnet from '../../../assets/images/mediaCoverage/arabnet.png';
import alanba from '../../../assets/images/mediaCoverage/alanba.png';
import wamda from '../../../assets/images/mediaCoverage/wamda.png';
import zawya from '../../../assets/images/mediaCoverage/zawya.png';
import menaBytes from '../../../assets/images/mediaCoverage/menaBytes.png';
import startupBahrain from '../../../assets/images/mediaCoverage/startupBahrain.png';
import dleal from '../../../assets/images/mediaCoverage/dleal.png';
import startupScene from '../../../assets/images/mediaCoverage/startupScene.png';

import MediaCoverageUi from './MediaCoverageUi';

const MediaCoverage = () =>
{
    const list = [
        {
            img: elgreda,
            link: "http://www.aljarida.com/articles/1514307955238106000/",
        },
        {
            img: elraay,
            link: "https://www.alraimedia.com/article/1590833/%D8%A7%D9%82%D8%AA%D8%B5%D8%A7%D8%AF/%D8%B3%D9%8A%D8%A7%D8%B1%D8%A7%D8%AA/l-finesse-%D9%85%D9%86-%D9%84%D9%83%D8%B2%D8%B3-%D8%A7%D9%84%D8%B3%D8%A7%D9%8A%D8%B1-%D8%A7%D9%84%D8%A8%D8%B3%D8%A7%D8%B7%D8%A9-%D8%A7%D9%84%D8%B1%D8%A7%D9%82%D9%8A%D8%A9-%D8%A8%D8%B7%D8%A7%D8%A8%D8%B9-%D8%A7%D9%84%D8%A3%D9%86%D8%A7%D9%82%D8%A9-%D8%A7%D9%84%D9%85%D8%A8%D9%87%D8%B1%D8%A9",
        },
        {
            img: elkbs,
            link: "https://alqabas.com/article/5884278-%D9%84%D9%83%D8%B2%D8%B3-%D8%AA%D9%81%D8%AA%D8%AA%D8%AD-%D8%A8%D9%88%D8%AA%D9%8A%D9%83-Lfinesse-%D9%81%D9%8A-%D8%A7%D9%84%D8%B9%D8%A7%D8%B5%D9%85%D8%A9-%D9%85%D9%88%D9%84",
        },
        {
            img: startupMgzn,
            link: "https://www.startupmgzn.com/english/news/seedstars-wraps-up-its-middle-eastern-tour-in-kuwait-find-out-who-was-crowned-kuwaits-best-startup/",
        },
        {
            img: arabnet,
            link: "https://www.arabnet.me/english/editorials/Events/Competitions/General-Senses-Best-Startup-At-Seedstars-Kuwait-2017",
        },
        {
            img: alanba,
            link: "https://www.alanba.com.kw/ar/kuwait-news/787663/03-11-2017--%D8%B4%D8%B1%D9%83%D8%A7%D8%AA-%D9%86%D8%A7%D8%B4%D8%A6%D8%A9-%D8%AA%D8%AA%D9%86%D8%A7%D9%81%D8%B3-%D8%AA%D9%85%D8%AB%D9%8A%D9%84-%D8%A7%D9%84%D9%83%D9%88%D9%8A%D8%AA-%D9%82%D9%85%D8%A9-seed-stars-%D8%A8%D8%B3%D9%88%D9%8A%D8%B3%D8%B1%D8%A7",
        },
        {
            img: wamda,
            link: "https://www.wamda.com/2017/12/seedstars-reveals-bahrain-startup-hub-region",
        },
        {
            img: zawya,
            link: "https://www.zawya.com/en/press-release/general-senses-wins-seedstars-kuwait-2017-best-start-up-title-q9hrkkl9",
        },
        {
            img: menaBytes,
            link: "https://www.menabytes.com/seedstars-mena-2017-roundup/",
        },
        {
            img: startupBahrain,
            link: "https://www.startupbahrain.com/news/seedstars-mena-summit-2017-key-highlights/",
        },
        {
            img: dleal,
            link: "https://www.daleeeel.com/ar-kw/article/9358/%D9%84%D9%83%D8%B2%D8%B3-%D8%A7%D9%84%D8%B3%D8%A7%D9%8A%D8%B1-%D8%AA%D9%81%D8%AA%D8%AA%D8%AD-%D8%A8%D9%88%D8%AA%D9%8A%D9%83-%D8%A7%D9%84-%D9%81%D8%AA%D9%86%D8%B3-%D9%81%D9%8A-%D8%A7%D9%84%D8%B9%D8%A7%D8%B5%D9%85%D8%A9-%D9%85%D9%88%D9%84",
        },
        {
            img: startupScene,
            link: "https://thestartupscene.me/INVESTMENTS/Kuwaiti-Startup-General-Senses-Takes-the-First-Prize-at-Seedstars-Kuwait",
        },
    ];

    return (
        <MediaCoverageUi 
            title="Media Coverage"
            desc=""
            list={list}
        />
    )
}

export default MediaCoverage