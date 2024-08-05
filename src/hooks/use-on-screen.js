import { useEffect, useState } from 'react';

const useOnScreen = (options) =>
{
    const [isVisible, setIsVisible] = useState(false);
    const [ref, setRef] = useState(null);

    useEffect(() =>
    {
        if (!ref) return;

        const observer = new IntersectionObserver(([entry]) =>
        {
            setIsVisible(entry.isIntersecting);
        }, options);

        observer.observe(ref);

        return () =>
        {
            observer.unobserve(ref);
        };
    }, [ref, options]);

    return [setRef, isVisible];
};

export default useOnScreen;
