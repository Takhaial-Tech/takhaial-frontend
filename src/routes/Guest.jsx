import { Navigate, Route, Routes } from 'react-router-dom'
import Index from '../sections/guest/Index'
import Login from '../sections/admin/Login/Login'
import { useSelector } from 'react-redux'
import ServiceDetail from '../sections/guest/Products/ServiceDetail'
import ServiceQuoteRequest from '../sections/guest/Products/ServiceQuoteRequest'

const Guest = () =>
{
    const isAdmin = !!useSelector(state => state.auth.token);

    return (
        <Routes>
            <Route path='/' element={<Index />} />
            <Route path='/services/:serviceSlug/request-quote' element={<ServiceQuoteRequest />} />
            <Route path='/services/:serviceSlug' element={<ServiceDetail />} />
            {!isAdmin && <Route path='/admin-login' element={<Login />} />}
            {!isAdmin && <Route path='/admin-log' element={<Login />} />}
            <Route path="*" element={<Navigate to="/" replace={true} />} />
        </Routes>
    )
}

export default Guest
