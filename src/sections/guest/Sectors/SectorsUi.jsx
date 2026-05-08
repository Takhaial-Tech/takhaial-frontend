import React from 'react';
import CustomModal from '../../../components/CustomModal';
import Sector from './Sector';
import { mediaUrl } from '../../../config';
import LoadingScreen from '../../../components/LoadingScreen';
import AddSection from '../../../components/AddSection';
import { sectorInputsData, sectorTitleInput } from './sectorInputs';
import { FormikControl } from '../../../components/inputs';
import EditSection from '../../../components/EditSection';


const SectorsUi = (props) =>
{
    const { title, desc, isOpenEditTitleModal, setIsOpenEditTitleModal, onEditTitle, isLoadingAddSection, onAdd, isOpenAddModal, setIsOpenAddModal, isLoadingGetSection, onChangeImage, onChangeVideo, isAdmin, sectors, modal, setModal, isOpenEditModal, setIsOpenEditModal, onEdit, isLoadingEdit } = props;

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
                        initialValues={{ title }}
                        className='right-[6px]'
                    />
                }
                <h1 className={`${isAdmin ? "mt-[5rem] mb-[6rem]" : ""} mb-[3rem] font-bold justify-self-center text-2xl mb-4 glitch-trans`} data-glitch={title}>{title}</h1>
                {desc && <p className="mt-[30px] justify-self-center">{desc}</p>}
                <div className="relative min-w-[134px]  px-[20px] w-full md:grid md:grid-cols-3 gap-10 items-center">
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
                        initialValues={{ title: "", disc: "" }}
                    >
                        <h1>Sector Icon</h1>
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
                        <h1>Sector Video</h1>
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
                {sectors.filter(e => e.title === modal.title).map((ser, key) => (
                    <div key={key} className={`modal-video relative inline-table  grid-cols-2 gap-6 flex items-center pb-[40px] ${ser?.video ? 'md:grid' : "max-w-[400px]"}`} >
                        {ser?.video && <video controls autoPlay style={{ borderRadius: "0.75rem", width: "100%" }}>
                            <source src={mediaUrl + ser.video} />
                        </video>}
                        <div className="min-h-[250px] border border-solid border-[red] p-5 rounded-xl transition-all duration-500 grid relative content-end bg-[#000] group/item">
                            {ser?.image && <img className="max-h-[80px] max-w-full w-auto h-auto object-contain" alt="" src={mediaUrl + ser?.image} />}
                            <h1 className="font-bold text-larg mt-[10px] glitch" data-glitch={ser.title}>{ser.title}</h1>
                            <p className="m-0 transition-all duration-500 text-lg my-[10px] group/edit group-hover:item:h-[100%]">
                                {ser.disc}
                            </p>
                        </div>
                    </div>
                ))}
            </CustomModal>
        </>
    );
}

export default SectorsUi;
