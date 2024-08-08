import watchIcon from '../../../assets/icons/watch.svg'
import quoteIcon from '../../../assets/icons/qouticonrev.svg'
import productsVideo from '../../../assets/videos/products.mp4'
import CustomModal from '../../../components/CustomModal';
import { useEffect, useRef } from 'react';
import EditSection from '../../../components/EditSection';
import LoadingScreen from '../../../components/LoadingScreen';
import { productInputsData } from './productsInputs';
import { FormikControl } from '../../../components/inputs';
import { mediaUrl } from '../../../config';

const ProductsUi = (props) =>
{
    // const { title, products, product, setProduct } = props;
    const { onChangeVideo, setProduct, product, isLoadingGetSection, data, isAdmin, onEdit, isLoadingEdit, isOpenEditModal, setIsOpenEditModal, setIsOpenEditModal2, isOpenEditModal2 } = props;
    // enforce video to play 
    const videoRef = useRef();
    useEffect(() =>
    {
        if (videoRef.current) videoRef.current.play();
    }, [])
    console.log("v", product)
    return (
        <>
            <section id="section_4" className={'min-h-[100vh] content-center relative text-white flex justify-center items-center pt-[6rem] pb-[2rem]  bg-[#000] z-[1] grid'}>
                {isLoadingGetSection && <LoadingScreen />}

                <div className="bg-gradient-radial2 absolute top-[-4px] left-0 right-0 bottom-[-4px] z-[0]" />
                <h1 className="font-bold justify-self-center text-2xl mb-4 z-[1]" >{"Our Products"} </h1>
                <div className="md:container  px-10 md:mx-auto">
                    <div className="w-full  md:grid md:grid-cols-2 gap-6">
                        {data.map((productItem, key) => (
                            <div key={key} className={'relative md:mb-0 mb-5 '}>
                                <div className="hover:scale-105 grid items-center  border border-solid border-[red] rounded-xl hover:shadow-3xl transition-all duration-500 grid relative content-end hover:bg-[#000] hover:shadow-3xl group/item" key={key} >
                                    {isAdmin &&
                                        <EditSection
                                            editTitle="Edit"
                                            className="top-[16px] right-[26px] mt-[0px]"
                                            isOpenEditModal={!key ? isOpenEditModal : isOpenEditModal2}
                                            setIsOpenEditModal={!key ? setIsOpenEditModal : setIsOpenEditModal2}
                                            onEdit={(values) => onEdit(values, key)}
                                            isLoadingEdit={isLoadingEdit}
                                            inputs={productInputsData}
                                            initialValues={{ title: productItem?.title || "", disc: productItem?.disc || "" }}
                                        >
                                            <FormikControl
                                                disabled={isLoadingEdit}
                                                control="input"
                                                type="file"
                                                name="video"
                                                accept="video/*"
                                                placeholder="Product Video"
                                                className="block md:w-full w-[100%]"
                                                containerClassName="block w-full"
                                                onChange={onChangeVideo} // Necessary to update Formik state with the selected file
                                            />
                                        </EditSection>
                                    }
                                    <div className={'flex p-4 items-center'}>
                                        <h1 className="text-center font-bold text-7xl  ml-[10px] glitch" data-glitch={productItem.title}>{productItem.title} </h1>
                                    </div>
                                    <p className="p-4  group-hover/item:text-base transition-all duration-500 transition-all duration-500  text-xs  group/edit  overflow-hidden   ">
                                        {productItem.disc}
                                    </p>
                                    <div className="flex">
                                        <button
                                            onClick={() => setProduct(productItem)}
                                            className="flex w-full transition-all duration-500  rounded-bl-xl  px-[20px] py-[10px] border border-solid border-[#ef4444] text-[#ef4444] bg-[#262626] flex justify-center items-center">
                                            {'watch'}  <img alt={''} width={15} className="ml-2" height={15} src={watchIcon} />
                                        </button>
                                        <a
                                            href="#section_9"
                                            className="flex w-full transition-all duration-500  rounded-br-xl  px-[20px] py-[10px] border border-solid border-[#ef4444] text-[#ef4444] bg-[#262626] flex justify-center items-center">
                                            {'quote'}  <img alt={''} width={15} className="ml-2" height={15} src={quoteIcon} />
                                        </a>
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <video
                    ref={videoRef}
                    autoPlay
                    webkit-playsinline="true"
                    playsInline={true}
                    muted
                    src={productsVideo}
                    type="video/mp4"
                    loop
                    className="rotate-100 absolute  left-0 z-[-1] top-0 bottom-0 w-full h-full object-cover" />
            </section>

            <CustomModal
                isOpen={!!product}
                onClose={() => { setProduct(false) }}
                contentLabel="Product page"
            >
                {product?.video && <video
                    autoPlay
                    controls
                    style={{ width: '100%', height: 'calc(100vh - 200px)' }} // Set default width and height
                >
                    <source src={`${mediaUrl}${product.video}`} />
                </video>}
            </CustomModal>
        </>
    )
}

export default ProductsUi
