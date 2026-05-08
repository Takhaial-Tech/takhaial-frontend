import React from 'react'
import useOnScreen from '../../../hooks/use-on-screen';
import { mediaUrl } from '../../../config';
import EditSection from '../../../components/EditSection';
import { sectorInputsData } from './sectorInputs';
import { FormikControl } from '../../../components/inputs';
import DeleteItem from '../../../components/DeleteItem';

const Sector = (props) =>
{
    const { onChangeImage, ser, setModal, isAdmin, isOpenEditModal, setIsOpenEditModal, onEdit, index, isLoadingEdit, onChangeVideo } = props;
    const [setRef, isVisible] = useOnScreen({ threshold: 0.1 });

    return (
        <div ref={setRef} className={`relative  mb-[3rem]   `}>
            <div className={`overflow-hidden min-h-[200px] border border-solid border-[red] p-5 rounded-xl transition-all duration-500 relative  group/item  ${isVisible ? 'shadow-3xl bg-[#000] ' : ''}`}>
                {isAdmin &&
                    <EditSection
                        isItem={true}
                        itemId={ser._id}
                        editTitle="Edit"
                        className="top-[16px] right-[20px] mt-[0px]"
                        isOpenEditModal={isOpenEditModal === ser._id}
                        index={index}
                        setIsOpenEditModal={setIsOpenEditModal}
                        onEdit={(values) => onEdit(values, index)}
                        isLoadingEdit={isLoadingEdit}
                        inputs={sectorInputsData}
                        initialValues={{ title: ser?.title || "", disc: ser?.disc || "" }}
                    >
                        <h1>Sector Icon</h1>
                        <FormikControl
                            disabled={isLoadingEdit}
                            control="input"
                            type="file"
                            name='image'
                            accept="image/*"
                            placeholder="Sector Icon"
                            className="block md:w-full w-[100%]"
                            containerClassName="block w-full"
                            onChange={onChangeImage} // Necessary to update Formik state with the selected file
                        />
                        <h1>Sector Video</h1>
                        <FormikControl
                            disabled={isLoadingEdit}
                            control="input"
                            type="file"
                            name='video'
                            accept="video/*"
                            placeholder="Sector Video"
                            className="block md:w-full w-[100%]"
                            containerClassName="block w-full"
                            onChange={onChangeVideo} // Necessary to update Formik state with the selected file
                        />
                    </EditSection>
                }
                {ser?.image && <img className="max-h-[80px] max-w-full w-auto h-auto object-contain" alt="" src={mediaUrl + ser?.image} />}
                <h1 className="font-bold text-larg glitch" data-glitch={ser.title}>{ser.title}</h1>
                <p className={` transition-all duration-500 text-xs opacity-0  mb-[-100%] overflow-hidden  ${isVisible ? 'opacity-[1] my-[10px] mb-[0]' : ''}`}>
                    {ser.disc}
                </p>
                <button onClick={() => setModal(ser)} className={`mb-[-60px] opacity-0   mt-3 transition-all duration-500 w-fit rounded-xl px-[20px] py-[10px] border border-solid border-[#ef4444] text-[#ef4444] bg-[#262626] ${isVisible ? 'opacity-[1] my-[10px] mb-[0] ' : ''}`}>
                    {'watch a demo'}
                </button>
                {isAdmin && <DeleteItem sectionNumber={6} itemId={ser?._id} />}
            </div>
        </div>
    );
}

export default Sector
