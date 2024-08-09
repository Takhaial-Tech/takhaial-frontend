import React from 'react'
import LoadingScreen from '../../../components/LoadingScreen';
import EditSection from '../../../components/EditSection';
import { clientTitleInput } from './clientsInputs';
import { FormikControl } from '../../../components/inputs';
import DeleteItem from '../../../components/DeleteItem';
import AddSection from '../../../components/AddSection';
import { mediaUrl } from '../../../config';

const ClientsUi = (props) =>
{
    const { list, title, isOpenEditTitleModal, setIsOpenEditTitleModal, onEditTitle, isLoadingAddSection, onAdd, isOpenAddModal, setIsOpenAddModal, isLoadingGetSection, onChangeImage, isAdmin, isOpenEditModal, setIsOpenEditModal, onEdit, isLoadingEdit } = props;

    return (
        <section id="section_8" className={'clients p-[20px]  mx-auto content-center min-h-[100vh] relative text-white flex justify-center items-center pt-[6rem] pb-[4rem] bg-[#000] z-[1] grid'}>
            {isLoadingGetSection && <LoadingScreen />}

            {/* Edit title */}
            {isAdmin &&
                <EditSection
                    editTitle="Edit Header"
                    isOpenEditModal={isOpenEditTitleModal}
                    setIsOpenEditModal={setIsOpenEditTitleModal}
                    onEdit={onEditTitle}
                    isLoadingEdit={isLoadingEdit}
                    inputs={clientTitleInput}
                    initialValues={{ title }}
                    className='right-[20px] top-[20px]'
                />
            }
            <h1 className="text-center font-bold justify-self-center text-2xl mb-6 glitch-trans" data-glitch={title}>{title}</h1>
            {isAdmin &&
                <div className={`relative w-full min-w-[125px] h-[70px] button:right-[0px] add-media `}  >
                    <AddSection
                        addTitle="Add Media"
                        className="top-[-20px] mt-[0px] "
                        isOpenAddModal={isOpenAddModal}
                        setIsOpenAddModal={setIsOpenAddModal}
                        onAdd={(values) => onAdd(values)}
                        isLoadingAdd={isLoadingAddSection}
                        initialValues={{}}
                    >
                        <h1>Media Image</h1>
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
                    </AddSection>
                </div>}
            <div className="w-full grid grid-cols-1 grid-cols-3 gap-14 items-center ">
                {list.slice(1).map((item, key) => (
                    <div className='z-[10] h-full relative pb-6'>
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
                                    initialValues={{ title: item.title }}
                                >
                                    <h1>Client Image</h1>
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
                                </EditSection>

                            </div>
                        )}
                        <div className={'flex items-center justify-center  relative md:mb-0 mb-5'} >
                            <img alt="" className="max-w-[180px] max-h-[120px]" src={mediaUrl + item.image} />
                        </div>
                        {isAdmin && <DeleteItem className='absolute bottom-[0px] right-0' sectionNumber={8} itemId={item?._id} />}
                    </div>

                ))}
            </div>
        </section>
    )
}

export default ClientsUi
