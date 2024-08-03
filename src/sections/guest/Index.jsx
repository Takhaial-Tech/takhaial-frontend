import React, { useState, useEffect, Suspense } from 'react';
import Navbar from '../../components/Navbar';
import LoadingScreen from '../../components/LoadingScreen';

const Intro = React.lazy(() => import('./Intro/Intro'));
const Home = React.lazy(() => import('./Home/Home'));
const About = React.lazy(() => import('./About/About'));
const Why = React.lazy(() => import('./Why/Why'));
const Products = React.lazy(() => import('./Products/Products'));
const Success = React.lazy(() => import('./Success/Success'));
const Sectors = React.lazy(() => import('./Sectors/Sectors'));
const Contact = React.lazy(() => import('./Contact/Contact'));

const Index = () =>
{
    const [introLoaded, setIntroLoaded] = useState(false);
    const [step, setStep] = useState(0);

    useEffect(() =>
    {
        if (introLoaded && step < 7)
        {
            const timer = setTimeout(() => setStep(step + 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [introLoaded, step]);

    return (
        <>
            <Suspense fallback={<LoadingScreen />}>
                <Intro onIntroLoaded={() => setIntroLoaded(true)} />
            </Suspense>
            <Navbar />
            {introLoaded && step >= 1 && (
                <Home />
            )}
            {step >= 2 && (
                <About />
            )}
            {step >= 3 && (
                <Why />
            )}
            {step >= 4 && (
                <Products />
            )}
            {step >= 5 && (
                    <Success />
            )}
            {step >= 6 && (
                <Sectors />
            )}
            {step >= 7 && (
                <Contact />
            )}
        </>
    );
};

export default Index;
