import { useContext, useEffect } from "react";
import useEdenredConfig from "./useEdenredConfig";
import useEdenredRefresh from "./useEdenredRefresh";

const useEdenredInterceptors = () => {
    const refresh = useEdenredRefresh();
    const axiosInstance = useEdenredConfig()
    useEffect(() => {

        const responseIntercept = axiosInstance.interceptors.response.use(
            response => response,
            async (error) => {
                const prevRequest = error?.config;
                if (error?.response?.status === 401 && !prevRequest?.sent)
                {
                    console.log()
                    prevRequest.sent = true;
                    const newAccessToken = await refresh();
                    const body = JSON.parse(prevRequest.data)
                    body.access_token = newAccessToken
                    // prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    prevRequest.data = body
                    return axiosInstance(prevRequest);
                }
                return Promise.reject(error);
            }
        );

        return () => {
            // axiosInstance.interceptors.request.eject(requestIntercept);
            axiosInstance.interceptors.response.eject(responseIntercept);
        }
    }, [refresh])

    return axiosInstance;
}

export default useEdenredInterceptors;