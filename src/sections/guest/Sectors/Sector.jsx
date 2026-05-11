import React from 'react'
import useOnScreen from '../../../hooks/use-on-screen';
import { mediaUrl } from '../../../config';
import EditSection from '../../../components/EditSection';
import { sectorInputsData } from './sectorInputs';
import { FormikControl } from '../../../components/inputs';
import DeleteItem from '../../../components/DeleteItem';
import { useLanguage } from '../../../i18n/LanguageContext';
import { getBilingualInitialValues, getLocalizedField } from '../../../i18n/localizedContent';
import { getSectorIcon } from './sectorIcons';

const Sector = (props) =>
{
    const { onChangeImage, ser, setModal, isAdmin, isOpenEditModal, setIsOpenEditModal, onEdit, index, isLoadingEdit, onChangeVideo } = props;
    const [setRef, isVisible] = useOnScreen({ threshold: 0.1 });
    const { language, t } = useLanguage();
    const title = getLocalizedField(ser, 'title', language);
    const disc = getLocalizedField(ser, 'disc', language);
    const iconSrc = ser?.image ? mediaUrl + ser.image : getSectorIcon(ser);

    return (
        <div ref={setRef} className="relative mb-[3rem] h-full">
            <div className={`flex h-full min-h-[430px] flex-col overflow-hidden border border-solid border-[red] p-5 rounded-xl transition-all duration-500 relative group/item ${isVisible ? 'shadow-3xl bg-[#000] ' : ''}`}>
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
                        initialValues={getBilingualInitialValues(ser, ['title', 'disc'])}
                    >
                        <h1>{t('Sector Icon')}</h1>
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
                        <h1>{t('Sector Video')}</h1>
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
                <div className="flex h-[88px] items-center pr-[86px]">
                    <img className="h-[76px] max-w-[96px] w-auto object-contain" alt="" src={iconSrc} />
                </div>
                <h1 className="min-h-[48px] font-bold text-larg leading-tight glitch" data-glitch={title}>{title}</h1>
                <p
                    className={`my-[10px] flex-1 overflow-hidden text-xs leading-relaxed transition-all duration-500 ${isVisible ? 'opacity-[1]' : 'opacity-0'}`}
                    style={{ display: '-webkit-box', WebkitLineClamp: 12, WebkitBoxOrient: 'vertical' }}
                >
                    {disc}
                </p>
                <button onClick={() => setModal(ser)} className={`mt-auto w-fit rounded-xl border border-solid border-[#ef4444] bg-[#262626] px-[20px] py-[10px] text-[#ef4444] transition-all duration-500 ${isVisible ? 'opacity-[1]' : 'opacity-0'}`}>
                    {t('Watch Demo')}
                </button>
                {isAdmin && <DeleteItem className="absolute bottom-[18px] right-[20px] mt-0" sectionNumber={6} itemId={ser?._id} />}
            </div>
        </div>
    );
}

export default Sector
