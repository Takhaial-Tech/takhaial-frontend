import { Navigate, Route, Routes } from 'react-router-dom'
import Index from '../sections/guest/Index'

const Guest = () =>
{


    return (
        <Routes>
            <Route path='/' element={<Index />} />
            <Route path="*" element={<Navigate to="/" replace={true} />} />
        </Routes>
    )
}

export default Guest