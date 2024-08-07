import { useDispatch } from 'react-redux';

import useHttp from './use-http'
import { sectionsActions } from '../store/sections-slice';
import { sectionsModulePath } from '../config';
import { useEffect } from 'react';

const useGetSection = (sectionNumber) =>
{
    const {
        isLoading: isLoadingGetSection,
        sendRequest: getSection
    } = useHttp();

    const dispatch = useDispatch();

    useEffect(() =>
    {
        const handleGetSection = async (values) =>
        {
            const getResponse = ({ success, record }) =>
            {
                if (!!success)
                {
                    console.log("record getResponse", record)
                    dispatch(sectionsActions.setSectionData(record))
                }
            };

            await getSection(
                {
                    url: `${sectionsModulePath}/${sectionNumber}`,
                    method: "GET",
                    body: values,
                },
                getResponse
            );
        }
        handleGetSection();
    }, [dispatch, getSection, sectionNumber])

    return isLoadingGetSection
}

export default useGetSection