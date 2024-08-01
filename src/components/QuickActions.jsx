import callicon from '../assets/icons/callicon.svg'
import qouticon from '../assets/icons/qouticon.svg'

const QuickActions = () =>
{
    return (
            <ul className="w-full justify-self-center text-white flex w-fit bg-[#262626] rounded-2xl" >
                <a href="#section_1" className="z-[1] cursor-pointer hover:shadow-3xl transition-all duration-500 w-[100px] rounded-l pl-[10px] py-[5px] content-center  rounded-s-2xl " style={{ marginRight: "10px" }}>
                    <li className="flex"> <img alt={''} width={15} className="mr-2" height={15} src={callicon} /> <label className="text-nowrap cursor-pointer"> {'Call'} </label> </li>
                </a>
                <a href="#section_1" className="z-[1] cursor-pointer hover:shadow-3xl transition-all duration-500 w-[100px] rounded-l pl-[10px] py-[5px] content-center  rounded-e-2xl rounded-s-none " >
                    <li className="flex"
                    //  onClick={() => setQuote(true)}
                    > <img alt={''} width={15} className="mr-2" height={15} src={qouticon} /> <label className="text-nowrap cursor-pointer"> {'Quote'} </label> </li>
                </a>
            </ul>
    )
}

export default QuickActions