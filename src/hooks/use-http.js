import { useState, useCallback, } from "react";
import { useSnackbar } from "notistack";
import { trimObject } from "../helpers/trimObject";
import { useDispatch, useSelector } from "react-redux";

import { backendUrl } from "../config";
import usePreventClose from "./use-prevent-close";
import { authActions } from "../store/auth-slice";
const useHttp = () =>
{
    const [isLoading, setIsLoading] = useState(false);
    const { enqueueSnackbar: popMessage } = useSnackbar();
    const token = useSelector((state) => state.auth.token)

    // stop from reload or close until isLoading ended
    usePreventClose(isLoading)
    const dispatch = useDispatch()
    
    const sendRequest = useCallback(async (requestConfig, applyData) =>
    {
        setIsLoading(true);
        const requestData = requestConfig?.contentType === "form-data" ? {
            method: requestConfig?.method ? requestConfig.method : "GET",
            headers: {
                'Authorization': 'Bearer ' + token,
            },
            body: requestConfig?.body
        } : {
            method: requestConfig?.method ? requestConfig.method : "GET",
            headers: {
                'Authorization': 'Bearer ' + token,
                "Content-Type": "application/json",
            },
            body: requestConfig.body ?
                JSON.stringify(trimObject(requestConfig.body)) :
                null
        }
        try
        {
            const response =
                await fetch(
                    `${requestConfig.baseUrl ?
                        requestConfig.baseUrl :
                        backendUrl}${requestConfig.url}`,
                    requestData);

            const data = await response.json();
            applyData(data);

            if (!response.ok)
            {
                throw new Error(data.message)
            }

            let message = data.message;
            if (message)
            {
                message = message.toLowerCase();
                if (!message.includes("success")) { throw new Error(data.message) }
            }
        } catch (error)
        {
            if (error.message.toLowerCase() === 'unauthorized')
            {
                dispatch(authActions.logout());
                error.message+=" ,Logged out...";
                popMessage("Login again to can edit.")
                window.location.reload();
            }
            setIsLoading(false)
            popMessage(error.message || "Something went wrong", { variant: "error" })
        }
        setIsLoading(false)
    }, [dispatch, popMessage, token])

    return {
        isLoading,
        sendRequest,
    }
}

export default useHttp;