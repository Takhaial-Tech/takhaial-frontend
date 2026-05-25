import React from 'react';
import CustomModal from '../../../components/CustomModal';
import CompatibleVideo from '../../../components/CompatibleVideo';
import Sector from './Sector';
import { mediaUrl } from '../../../config';
import LoadingScreen from '../../../components/LoadingScreen';
import AddSection from '../../../components/AddSection';
import { sectorInputsData, sectorTitleInput } from './sectorInputs';
import { FormikControl } from '../../../components/inputs';
import EditSection from '../../../components/EditSection';
import { useLanguage } from '../../../i18n/LanguageContext';
import { getBilingualInitialValues, getLocalizedField } from '../../../i18n/localizedContent';
import { getSectorIcon } from './sectorIcons';


const SectorsUi = (props) =>
{
    const { header, title, isOpenEditTitleModal, setIsOpenEditTitleModal, onEditTitle, isLoadingAddSection, onAdd, isOpenAddModal, setIsOpenAddModal, isLoadingGetSection, onChangeImage, onChangeVideo, isAdmin, sectors, modal, setModal, isOpenEditModal, setIsOpenEditModal, onEdit, isLoadingEdit } = props;
    const { language, t } = useLanguage();
    const localizedTitle = getLocalizedField(header || { title }, 'title', language);

    return (
        <>
            <section id="section_6" className="w-[90%] mx-auto md:container md:mx-auto content-center min-h-[100vh] relative text-white flex justify-center items-center pt-[6rem] pb-[2rem] bg-[#000] z-[1] grid">
                {isLoadingGetSection && <LoadingScreen isAbsolute={true} />}

                {/* Edit title */}
                {isAdmin &&
                    <EditSection
                        editTitle="Edit Header"
                        isOpenEditModal={isOpenEditTitleModal}
                        setIsOpenEditModal={setIsOpenEditTitleModal}
                        onEdit={onEditTitle}
                        isLoadingEdit={isLoadingEdit}
                        inputs={sectorTitleInput}
                        initialValues={getBilingualInitialValues(header || { title }, ['title'])}
                        className='right-[6px]'
                    />
                }
                <h1 className={`${isAdmin ? "mt-[5rem] mb-[6rem]" : ""} mb-[3rem] font-bold justify-self-center text-2xl mb-4 glitch-trans`} data-glitch={localizedTitle}>{localizedTitle}</h1>
                <div className="relative min-w-[134px] w-full px-[20px] md:grid md:grid-cols-2 xl:grid-cols-3 md:auto-rows-fr gap-8 xl:gap-10 items-stretch">
                    {sectors.slice(1).map((ser, key) =>
                        <Sector
                            isAdmin={isAdmin}
                            isOpenEditModal={isOpenEditModal}
                            setIsOpenEditModal={setIsOpenEditModal}
                            onEdit={onEdit}
                            isLoadingEdit={isLoadingEdit}
                            setModal={setModal}
                            ser={ser}
                            key={key}
                            onChangeVideo={onChangeVideo}
                            onChangeImage={onChangeImage}
                            index={key + 1}
                        />
                    )}
                    {isAdmin && <AddSection
                        addTitle="Add Sector"
                        className="top-[-5rem] right-[6px] mt-[0px]"
                        isOpenAddModal={isOpenAddModal}
                        setIsOpenAddModal={setIsOpenAddModal}
                        onAdd={(values) => onAdd(values, sectors.length + 1)}
                        isLoadingAdd={isLoadingAddSection}
                        inputs={sectorInputsData}
                        initialValues={{ title: "", titleAr: "", disc: "", discAr: "" }}
                    >
                        <h1>{t('Sector Icon')}</h1>
                        <FormikControl
                            disabled={isLoadingAddSection}
                            control="input"
                            type="file"
                            name="image"
                            accept="image/*"
                            placeholder="Sector Icon"
                            className="block md:w-full w-[100%]"
                            containerClassName="block w-full"
                            onChange={onChangeImage} // Necessary to update Formik state with the selected file
                        />
                        <h1>{t('Sector Video')}</h1>
                        <FormikControl
                            disabled={isLoadingAddSection}
                            control="input"
                            type="file"
                            name="video"
                            accept="video/*"
                            placeholder="Sector Video"
                            className="block md:w-full w-[100%]"
                            containerClassName="block w-full"
                            onChange={onChangeVideo} // Necessary to update Formik state with the selected file
                        />
                    </AddSection>}
                </div>
            </section>

            <CustomModal isOpen={!!modal} onClose={() => setModal(false)}>
                {sectors.filter(e => modal?._id ? e._id === modal._id : e.title === modal.title).map((ser, key) => {
                    const modalIcon = ser?.image ? mediaUrl + ser.image : getSectorIcon(ser);

                    return (
                    <div key={key} className={`modal-video relative grid grid-cols-1 gap-6 pb-[40px] ${ser?.video ? 'md:grid-cols-2 md:items-start' : "max-w-[520px]"}`} >
                        {ser?.video &&
                            <CompatibleVideo
                                src={ser.video}
                                title={getLocalizedField(ser, 'title', language)}
                                style={{ borderRadius: "0.75rem", width: "100%" }}
                            />
                        }
                        <div className="min-h-[250px] rounded-xl border border-solid border-[#ef4444]/70 p-5 transition-all duration-300 grid relative content-end bg-[#05070d]/95 group/item">
                            <img className="max-h-[80px] max-w-[96px] w-auto h-auto object-contain" alt="" src={modalIcon} />
                            <h1 className="font-bold text-larg mt-[10px] glitch" data-glitch={getLocalizedField(ser, 'title', language)}>{getLocalizedField(ser, 'title', language)}</h1>
                            <p className="m-0 transition-all duration-500 text-lg my-[10px] group/edit group-hover:item:h-[100%]">
                                {getLocalizedField(ser, 'disc', language)}
                            </p>
                        </div>
                    </div>
                    )
                })}
            </CustomModal>
        </>
    );
}

export default SectorsUi;
