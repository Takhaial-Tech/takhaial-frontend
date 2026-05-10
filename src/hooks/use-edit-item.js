import { useDispatch, useSelector } from "react-redux";
import useHttp from "./use-http";
import { sectionsActions } from "../store/sections-slice";
import { compareObjects } from "../helpers/compareObjects";
import { sectionsModulePath } from "../config";
import { useSnackbar } from "notistack";
import { useLanguage } from "../i18n/LanguageContext";

const useEditItem = (sectionNumber) =>
{
  const {
    isLoading: isLoadingEditSection,
    sendRequest: editSection
  } = useHttp();
  const { enqueueSnackbar: popMessage } = useSnackbar();
  const { t } = useLanguage();

  const dispatch = useDispatch();
  const sectionData = useSelector(state => state.sections.sectionsData)[sectionNumber]

  const handleEditSection = async (values, itemId, onSuccess, media) =>
  {
    const intialItemData = sectionData.find(ele => ele._id === itemId);
    const updatedData = compareObjects(intialItemData, values);
    const submitData = new FormData();

    // Append updated data
    for (const key in updatedData)
    {
      submitData.append(key, updatedData[key]);
    }

    // Append video if present
    if (media?.video) submitData.append('video', media.video);
    if (media?.videoAr) submitData.append('videoAr', media.videoAr);

    // Append image if present
    if (media?.image) submitData.append('image', media.image);

    // Helper function to convert URL to File
    async function urlToFile(url, filename, mimeType)
    {
      try
      {
        const response = await fetch(url);
        const blob = await response.blob();
        return new File([blob], filename, { type: mimeType });
      } catch (error)
      {
        popMessage(t(error.message || "Something went wrong"), { variant: "error" })
      }
    }

    // Process images
    if (media?.images)
    {
      for (const image of media.images)
      {
        if (image.file)
        {
          // It's a new image file
          submitData.append('images', image.file);
        } else
        {
          // Fetch the image from the URL and convert it to a File
          const mimeType = 'image/jpeg'; // Adjust the MIME type as needed
          const file = await urlToFile(image.data_url, `image_123.jpg`, mimeType);
          if (file)
          {
            submitData.append('images', file);
          }
        }
      }
    }

    // Define response handler
    const getResponse = ({ success, record }) =>
    {
      if (success)
      {
        dispatch(sectionsActions.updateSectionItemData(record));
        popMessage(t("Edited successfully"), { variant: "success" });
        onSuccess();
      }
    };

    // Send request to edit section
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
