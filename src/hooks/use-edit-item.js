import { useDispatch, useSelector } from "react-redux";
import useHttp from "./use-http";
import { sectionsActions } from "../store/sections-slice";
import { compareObjects } from "../helpers/compareObjects";
import { sectionsModulePath } from "../config";
import { useSnackbar } from "notistack";

const useEditItem = (sectionNumber) =>
{
  const {
    isLoading: isLoadingEditSection,
    sendRequest: editSection
  } = useHttp();
  const { enqueueSnackbar: popMessage } = useSnackbar();

  const dispatch = useDispatch();
  const sectionData = useSelector(state => state.sections.sectionsData)[sectionNumber]

  const handleEditSection = async (values, itemId, onSuccess) =>
  {
    const intialItemData = sectionData.find(ele => ele._id === itemId)
    console.log("sectionData", sectionData)
    console.log("intialItemData", intialItemData)
    const updatedData = compareObjects(intialItemData, values)

    const getResponse = ({ success, record }) =>
    {
      if (!!success)
      {
        console.log("record getResponse", record)
        dispatch(sectionsActions.updateSectionItemData(record))
        popMessage("Edited successfully", {variant:"success"});
        onSuccess()
      }
    };

    await editSection(
      {
        url: `${sectionsModulePath}/${itemId}`,
        method: "PATCH",
        body: updatedData,
      },
      getResponse
    );
  }

  return { isLoadingEditSection, handleEditSection }
}

export default useEditItem