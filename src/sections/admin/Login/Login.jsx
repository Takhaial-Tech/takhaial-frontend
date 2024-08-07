import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useDispatch } from 'react-redux';

import LoginUi from './LoginUi'
import useHttp from '../../../hooks/use-http';
import { authModulePath } from '../../../config';
import { authActions } from '../../../store/auth-slice';

const Login = () =>
{
    // const dispatch = useDispatch();
    const navigate = useNavigate();
    const {
        isLoading: isLoadingLogin,
        sendRequest: login
    } = useHttp();

    const { enqueueSnackbar: popMessage } = useSnackbar();
    const dispatch = useDispatch();

    const handleLogin = async (values) =>
    {
        const getResponse = ({ message, token, data }) =>
        {
            if (!!token)
            {
                navigate("/", { replace: true });
                dispatch(authActions.login(token))
                popMessage("Login successfully", { variant: "success" })
            }
        };

        await login(
            {
                url: `${authModulePath}/signin`,
                method: "POST",
                body: values,
            },
            getResponse
        );
    }

    return (
        <LoginUi
            handleLogin={handleLogin}
            isLoadingLogin={isLoadingLogin}
        />
    )
}

export default Login