import Btn from './Btn';
import CustomModal from './CustomModal';
import { FormikContainer, LoopOnInputs } from './inputs';
import { useLanguage } from '../i18n/LanguageContext';

const AddSection = (props) =>
{
    const { children, addTitle, isOpenAddModal, setIsOpenAddModal, initialValues, onAdd, isLoadingAdd, validationSchema, inputs, actionTitle, className } = props;
    const { t } = useLanguage();

    return (
        <>
            <>
                {/* Admin Add btn */}
                <Btn
                    type='button'
                    className={`absolute right-[10px] top-20 z-[11] block mt-[10px] ${className}`}
                    onClick={() => setIsOpenAddModal(true)}
                >
                    {t(addTitle ||"Add Section"  )}
                </Btn>

                <CustomModal
                    isOpen={isOpenAddModal}
                    onClose={() => { setIsOpenAddModal(false) }}
                    contentLabel={t("Add page")}
                >
                    <div className=' w-[500px] max-w-[100%] mt-1 p-1 '>

                        <FormikContainer
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={onAdd}
                            enableReinitialize={true}
                        >
                            {inputs && <LoopOnInputs inputs={inputs} disabled={isLoadingAdd} />}
                            {children}
                            <Btn
                                type="submit"
                                className="w-full mt-8"
                                isLoading={isLoadingAdd}
                            >
                                {t(actionTitle || "Confirm Add")}
                            </Btn>
                        </FormikContainer>
                    </div>
                </CustomModal>
            </>
        </>
    )
}

export default AddSection
