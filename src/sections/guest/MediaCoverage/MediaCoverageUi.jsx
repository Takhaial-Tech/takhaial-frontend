import React, { useEffect, useRef } from 'react'
// import aboutVideo from '../../../assets/videos/about.mp4'
import EditSection from '../../../components/EditSection';
import { mediaItemInputsData, mediaTitleInput } from './mediaInputs';
import { FormikControl } from '../../../components/inputs';
import AddSection from '../../../components/AddSection';
import { mediaUrl } from '../../../config';
import DeleteItem from '../../../components/DeleteItem';
import LoadingScreen from '../../../components/LoadingScreen';
import { useLanguage } from '../../../i18n/LanguageContext';
import { getBilingualInitialValues, getLocalizedField } from '../../../i18n/localizedContent';

const MediaCoverageUi = (props) =>
{
    const { list, header, title, isOpenEditTitleModal, setIsOpenEditTitleModal, onEditTitle, isLoadingAddSection, onAdd, isOpenAddModal, setIsOpenAddModal, isLoadingGetSection, onChangeImage, isAdmin, isOpenEditModal, setIsOpenEditModal, onEdit, isLoadingEdit } = props;
    const { language, t } = useLanguage();
    const localizedTitle = getLocalizedField(header || { title }, 'title', language);

    // enforce video to play 
    const videoRef = useRef();
    useEffect(() =>
    {
        if (videoRef.current) videoRef.current.play();
    }, [])

    return (
        <section id="section_7" className={'background media p-[20px]  mx-auto content-center min-h-[100vh] relative text-white flex justify-center items-center  py-[10rem]  z-[1] grid media-coverage'}>
            {/* <div className='glow '></div> */}
            <div className="radial absolute top-[-4px] left-0 right-0 bottom-[-4px] z-[0]" />

            {/* <div className="absolute top-[-4px] left-0 right-0 bottom-[-4px] z-[0]" /> */}
            {isLoadingGetSection && <LoadingScreen isAbsolute={true} />}

            {/* Edit title */}
            {isAdmin &&
                <EditSection
                    editTitle="Edit Header"
                    isOpenEditModal={isOpenEditTitleModal}
                    setIsOpenEditModal={setIsOpenEditTitleModal}
                    onEdit={onEditTitle}
                    isLoadingEdit={isLoadingEdit}
                    inputs={mediaTitleInput}
                    initialValues={getBilingualInitialValues(header || { title }, ['title'])}
                    className='right-[20px] top-[20px]'
                />
            }

            <h1 className="font-bold justify-self-center text-2xl mb-6 glitch-trans" data-glitch={localizedTitle}>{localizedTitle}</h1>
            {isAdmin &&
                <div className={`relative w-full min-w-[125px] h-[70px] button:right-[0px] add-media `}  >
                    <AddSection
                        addTitle="Add Media"
                        className="top-[-20px] mt-[0px] "
                        isOpenAddModal={isOpenAddModal}
                        setIsOpenAddModal={setIsOpenAddModal}
                        onAdd={(values) => onAdd(values)}
                        isLoadingAdd={isLoadingAddSection}
                        inputs={mediaItemInputsData}
                        initialValues={{ title: "" }}
                    >
                        <h1>{t('Media Image')}</h1>
                        <FormikControl
                            disabled={isLoadingAddSection}
                            control="input"
                            type="file"
                            name="image"
                            accept="image/*"
                            placeholder="Media Image"
                            className="block md:w-full w-[100%]"
                            containerClassName="block w-full"
                            onChange={onChangeImage} // Necessary to update Formik state with the selected file
                        />
                    </AddSection>
                </div>}

            <div className="w-auto grid grid-cols-1  grid-cols-3 gap-10 items-center justify-center">
                {list.slice(1).map((item, key) => (
                    <div key={key} className={isAdmin ? 'z-[10] h-full relative pb-6 ' : ''}>
                        {isAdmin && (
                            <div className='relative h-[70px] add-media '>
                                <EditSection
                                    isItem={true}
                                    itemId={item._id}
                                    editTitle="Edit"
                                    className="top-[0px] top-0 right-[-10px] mt-[0px]  "
                                    isOpenEditModal={isOpenEditModal === item._id}
                                    setIsOpenEditModal={setIsOpenEditModal}
                                    onEdit={(values) => onEdit(values, key + 1)}
                                    isLoadingEdit={isLoadingEdit}
                                    inputs={mediaItemInputsData}
                                    initialValues={{ title: item.title }}
                                >
                                    <h1>{t('Media Image')}</h1>
                                    <FormikControl
                                        disabled={isLoadingAddSection}
                                        control="input"
                                        type="file"
                                        name="image"
                                        accept="image/*"
                                        placeholder="Media Image"
                                        className="block md:w-full w-[100%]"
                                        containerClassName="block w-full"
                                        onChange={onChangeImage} // Necessary to update Formik state with the selected file
                                    />
                                </EditSection>

                            </div>
                        )}
                        <a href={item.title} target="__blank" key={key} className={'flex items-center justify-center  relative md:mb-0 mb-5'}>
                            <img alt="" className="max-w-[200px] max-h-[100px] h-[auto]" src={mediaUrl + item.image} />
                        </a>
                        {isAdmin && <DeleteItem className='absolute bottom-[0px] right-0' sectionNumber={7} itemId={item?._id} />}
                    </div>
                ))}
            </div>

            {/* <video
                ref={videoRef}
                webkit-playsinline="true"
                playsInline={true}
                src={aboutVideo}
                type="video/mp4"
                autoPlay
                muted
                loop
                className="rotate-100 absolute  left-0 z-[-1] top-0 bottom-0 w-full h-full object-cover" /> */}

        </section>
    )
}

export default MediaCoverageUi
