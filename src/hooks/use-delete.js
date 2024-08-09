import { useSnackbar } from 'notistack';
import { useDispatch } from 'react-redux';

import useHttp from './use-http';
import { sectionsModulePath } from '../config';
import { sectionsActions } from '../store/sections-slice';

const useDelete = () =>
{
    const {
        isLoading: isLoadingDeleteItem,
        sendRequest: deleteItem
    } = useHttp();
    const { enqueueSnackbar: popMessage } = useSnackbar();

    const dispatch = useDispatch();

    const handleDeleteItem = async (sectionNumber, itemId, closeModal) =>
    {

        const getResponse = ({ success }) =>
        {
            if (!!success)
            {
                dispatch(sectionsActions.deleteSectionItemData({sectionNumber, itemId}))
                popMessage("Deleted successfully", { variant: "success" });
                closeModal()
                document.body.style.overflow = 'auto';
            }
        };

        await deleteItem(
            {
                url: `${sectionsModulePath}/${itemId}`,
                method: "DELETE",
            },
            getResponse
        );
    }
    return { isLoadingDeleteItem, handleDeleteItem }
}

export default useDelete