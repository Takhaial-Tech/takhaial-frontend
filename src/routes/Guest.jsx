import { Navigate, Route, Routes } from 'react-router-dom'
import Index from '../sections/guest/Index'
import Login from '../sections/admin/Login/Login'
import { useSelector } from 'react-redux'

const Guest = () =>
{
    const isAdmin = !!useSelector(state => state.auth.token);

    return (
        <Routes>
            <Route path='/' element={<Index />} />
            <Route path="*" element={<Navigate to="/" replace={true} />} />
            {!isAdmin && <Route path='/admin-login' element={<Login />} />}
            {!isAdmin && <Route path='/admin-log' element={<Login />} />}
        </Routes>
    )
}

export default Guest
