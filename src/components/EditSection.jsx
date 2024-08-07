import Btn from './Btn';
import CustomModal from './CustomModal';
import { FormikContainer, LoopOnInputs } from './inputs';

const EditSection = (props) =>
{
    const { children, isOpenEditModal, setIsOpenEditModal, initialValues, onEdit, isLoadingEdit, validationSchema, inputs, actionTitle } = props;

    return (
        <>
            <div>
                {/* Admin edit btn */}
                <Btn
                    type='button'
                    className="absolute right-[10px] top-20 z-[11] block mt-[10px]   "
                    onClick={() => setIsOpenEditModal(true)}
                >
                    Edit Section
                </Btn>

                <CustomModal
                    isOpen={isOpenEditModal}
                    onClose={() => { setIsOpenEditModal(false) }}
                    contentLabel="Edit page"
                >
                    <div className=' w-[500px] max-w-[100%] mt-1 p-1 '>

                        <FormikContainer
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={onEdit}
                        >
                            {inputs && <LoopOnInputs inputs={inputs} disabled={isLoadingEdit} />}
                            {children}
                            <Btn
                                type="submit" 
                                className="w-full mt-8"
                                isLoading={isLoadingEdit}
                            >
                                {actionTitle || "Confirm Edit"}
                            </Btn>
                        </FormikContainer>
                    </div>
                </CustomModal>
            </div>
        </>
    )
}

export default EditSection