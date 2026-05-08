import { useEffect } from 'react';
import Modal from 'react-modal';
import { useLanguage } from '../i18n/LanguageContext';


// Make sure to set the app element to avoid accessibility issues
Modal.setAppElement('#root');

const CustomModal = (props) =>
{
    const { children, isOpen, onClose, contentLabel } = props;
    const { direction } = useLanguage();

    useEffect(() =>
    {
        if (isOpen)
        {

            document.body.style.overflow = 'hidden';
        }else{
            allowScroll();
        }
    }, [isOpen])

    const allowScroll = () =>
    {
        document.body.style.overflow = 'auto';
    }

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={() => { allowScroll(); onClose(); }}
            contentLabel={contentLabel}
            className="focus:outline-none bg-[#000] dark:bg-[#000] text-[#fff] shadow-4xl m-10 rounded-xl relative"
            overlayClassName="fixed inset-0  bg-opacity-50 z-[2000] flex items-center justify-center backdrop-blur"
            bodyOpenClassName="overflow-hidden"
        >
            <div>
                {/* close btn */}
                <div className='w-full text-right' dir="ltr">
                    <button
                        onClick={onClose}
                        className="border-[#ef4444] border border-solid hover:bg-white/5 active:bg-white/10 z-[9] bg-[#000]  rounded-none text-[2rem] rounded-tr-lg rounded-bl-lg"                    >
                        <svg aria-hidden="true" fill="none" focusable="false" height="1em" role="presentation" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="1em"><path d="M18 6L6 18M6 6l12 12"></path></svg>
                    </button>
                </div>

                {/* content */}
                <div
                    className='modal-content'
                    dir={direction}
                >
                    {children}
                </div>
            </div>
        </Modal>
    )
}

export default CustomModal
