import { useDispatch } from "react-redux";
import useHttp from "./use-http";
import { sectionsActions } from "../store/sections-slice";
import { sectionsModulePath } from "../config";
import { useSnackbar } from "notistack";
import { useLanguage } from "../i18n/LanguageContext";

const useAddItem = (sectionNumber) =>
{
  const {
    isLoading: isLoadingAddSection,
    sendRequest: addSection
  } = useHttp();
  const { enqueueSnackbar: popMessage } = useSnackbar();
  const { t } = useLanguage();

  const dispatch = useDispatch();

  const handleAddSection = async (values, onSuccess, media) =>
  {

    const submitData = new FormData();
    for (const key in values)
    {
      if (key !== 'video' && key !== 'image') submitData.append(key, values[key]);
    }
    if (media?.video) submitData.append('video', media.video);
    if (media?.image) submitData.append('image', media.image);
    submitData.append('section', sectionNumber)

    if (media?.images)
    {
      media.images.forEach(element =>
      {
        submitData.append('images', element.file);
      });
    }

    const getResponse = ({ success, record }) =>
    {
      if (!!success)
      {
        dispatch(sectionsActions.addSectionItemData(record))
        popMessage(t("Added successfully"), { variant: "success" });
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
