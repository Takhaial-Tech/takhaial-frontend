import { useEffect } from 'react'

const usePreventClose = (waitingFlag) =>
{
    // for make window or tab not close or reload until waitingFlag become false
    useEffect(() =>
    {
        function beforeUnload(e)
        {
            if (!waitingFlag) return;
            e.preventDefault();
        }

        window.addEventListener('beforeunload', beforeUnload);

        return () =>
        {
            window.removeEventListener('beforeunload', beforeUnload);
        };

    }, [waitingFlag]);
}

export default usePreventClose