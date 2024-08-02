import React from 'react'

// import Navbar from '../../components/Navbar'

const Intro = React.lazy(() => import('./Intro/Intro'))
// const Home = React.lazy(() => import('./Home/Home'))
// const About = React.lazy(() => import('./About/About'))
// const Why = React.lazy(() => import('./Why/Why'))
// const Products = React.lazy(() => import('./Products/Products'))
// const Success = React.lazy(() => import('./Success/Success'))
// const Sectors = React.lazy(() => import('./Sectors/Sectors'))
// const Contact = React.lazy(() => import('./Contact/Contact'))

const Index = () =>
{
    return (
        <>
            {/* <Navbar /> */}
            {/* <Home/>
            <About/>
            <Why/>
            <Products/>
            <Success/>
            <Sectors/>
            <Contact/> */}
            <Intro/>
        </>
    )
}

export default Index