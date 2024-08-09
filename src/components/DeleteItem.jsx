import React, { useState } from 'react'
import CustomModal from './CustomModal';
import Btn from './Btn';
import useDelete from '../hooks/use-delete';

const DeleteItem = (props) =>
{
    const { className, sectionNumber, itemId } = props;
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const { isLoadingDeleteItem, handleDeleteItem } = useDelete();
    const closeModal = () => {
        setConfirmModalOpen(false)
        

    }
    return (
        <>
            <div

                className={`mt-5 text-right delete flex justify-end ${className}`}
            >
                <button
                    title='Delete item'
                    type='button'
                    className='w-[20px]'
                    onClick={() => setConfirmModalOpen(true)}
                >
                    <svg className='fill-[#ef4444]' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                        <path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z" /></svg>
                </button>
            </div>
            <CustomModal
                isOpen={confirmModalOpen}
                onClose={() => setConfirmModalOpen(false)}
            >
                <div 
                >
                    <h1 className='m-1 mb-5'>Are you sure you want to delete the item? </h1>
                    <div className='w-full flex flex-wrap justify-center items-center'>
                        <Btn
                            className='mr-5 h-[50px]'
                            onClick={() => setConfirmModalOpen(false)}
                            disabled={isLoadingDeleteItem}
                        >
                            Cancel
                        </Btn>
                        <Btn
                            onClick={() => handleDeleteItem(sectionNumber, itemId, closeModal)}
                            isLoading={isLoadingDeleteItem}
                            className='w-[102px]  h-[50px]'
                        >
                            Confirm
                        </Btn>
                    </div>

                </div>
            </CustomModal>
        </>
    )
}

export default DeleteItem