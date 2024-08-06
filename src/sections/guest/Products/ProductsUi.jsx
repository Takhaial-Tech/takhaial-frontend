import watchIcon from '../../../assets/icons/watch.svg'
import quoteIcon from '../../../assets/icons/qouticonrev.svg'
import productsVideo from '../../../assets/videos/products.mp4'
import CustomModal from '../../../components/CustomModal';
import { useEffect, useRef } from 'react';

const ProductsUi = (props) =>
{
    const { title, products, product, setProduct } = props;
    // enforce video to play 
    const videoRef = useRef();
    useEffect(() =>
    {
        if (videoRef.current) videoRef.current.play();
    }, [])

    return (
        <>
            <section id="section_4" className={'min-h-[100vh] content-center relative text-white flex justify-center items-center pt-[6rem] pb-[2rem]  bg-[#000] z-[1] grid'}>
                <div className="bg-gradient-radial2 absolute top-[-4px] left-0 right-0 bottom-[-4px] z-[0]" />
                <h1 className="font-bold justify-self-center text-2xl mb-4 z-[1]" >{title} </h1>
                <div className="md:container  px-10 md:mx-auto">
                    <div className="w-full  md:grid md:grid-cols-2 gap-6">
                        {products.map((product, key) => (
                            <div key={key} className={'relative md:mb-0 mb-5 '}>
                                <div className="hover:scale-105 grid items-center  border border-solid border-[red] rounded-xl hover:shadow-3xl transition-all duration-500 grid relative content-end hover:bg-[#000] hover:shadow-3xl group/item" key={key} >
                                    <div className={'flex p-4 items-center'}>
                                        <h1 className="text-center font-bold text-7xl  ml-[10px] glitch" data-glitch={product.title}>{product.title} </h1>
                                    </div>
                                    <p className="p-4  group-hover/item:text-base transition-all duration-500 transition-all duration-500  text-xs  group/edit  overflow-hidden   ">
                                        {product.description}
                                    </p>
                                    <div className="flex">
                                        <button
                                            onClick={() => setProduct(product)}
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
                <video 
                autoPlay
                controls
                    style={{ width: '100%', height: 'calc(100vh - 200px)' }} // Set default width and height
                >
                    <source src={'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'}  type="video/mp4" />
                </video>
            </CustomModal>
        </>
    )
}

export default ProductsUi
