import { useDispatch } from "react-redux";
import useHttp from "./use-http";
import { sectionsActions } from "../store/sections-slice";
import { sectionsModulePath } from "../config";
import { useSnackbar } from "notistack";

const useAddItem = (sectionNumber) =>
{
  const {
    isLoading: isLoadingAddSection,
    sendRequest: addSection
  } = useHttp();
  const { enqueueSnackbar: popMessage } = useSnackbar();

  const dispatch = useDispatch();

  const handleAddSection = async (values, onSuccess, media) =>
  {

    console.log("values", values)
    const submitData = new FormData();
    for (const key in values)
    {
      submitData.append(key, values[key]);
    }
    if (media?.video) submitData.append('video', media.video);
    if (media?.image) submitData.append('image', media.image);
    submitData.append('section', sectionNumber)
    const getResponse = ({ success, record }) =>
    {
      if (!!success)
      {
        console.log("record getResponse", record)
        dispatch(sectionsActions.addSectionItemData(record))
        popMessage("Added successfully", { variant: "success" });
        onSuccess()
      }
    };

    await addSection(
      {
        url: `${sectionsModulePath}`,
        method: "POST",
        body: submitData,
        contentType: "form-data"
      },
      getResponse
    );
  }

  return { isLoadingAddSection, handleAddSection }
}

export default useAddItem