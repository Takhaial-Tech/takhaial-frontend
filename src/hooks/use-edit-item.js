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

  const handleEditSection = async (values, itemId, onSuccess, media) =>
  {
    const intialItemData = sectionData.find(ele => ele._id === itemId)
    console.log("sectionData", sectionData)
    console.log("intialItemData", intialItemData)
    const updatedData = compareObjects(intialItemData, values)
    console.log("values", values)
    const submitData = new FormData();
    for (const key in updatedData)
    {
      submitData.append(key, updatedData[key]);
    }
    if (media?.video) submitData.append('video', media.video);
    if (media?.image) submitData.append('image', media.image);

    const getResponse = ({ success, record }) =>
    {
      if (!!success)
      {
        console.log("record getResponse", record)
        dispatch(sectionsActions.updateSectionItemData(record))
        popMessage("Edited successfully", { variant: "success" });
        onSuccess()
      }
    };

    await editSection(
      {
        url: `${sectionsModulePath}/${itemId}`,
        method: "PATCH",
        body: submitData,
        contentType: "form-data"
      },
      getResponse
    );
  }

  return { isLoadingEditSection, handleEditSection }
}

export default useEditItem