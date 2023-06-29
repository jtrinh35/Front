import Config from "./Config";
import { useContext, useEffect } from "react";
import { authContext } from '../context/authProvider';
import useRefreshToken from "./useRefreshToken";
// import useAuth from "./useAuth";

const useAxiosInterceptors = () => {
    const refresh = useRefreshToken();
    const {auth, setAuth} = useContext(authContext)
    const axiosInstance = Config()
    useEffect(() => {
        const requestIntercept = axiosInstance.interceptors.request.use(
            config => {
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${auth}`;
                }
                return config;
            }, (error) => Promise.reject(error)
        );

        const responseIntercept = axiosInstance.interceptors.response.use(
            response => response,
            async (error) => {
                const prevRequest = error?.config;
                if (error?.response?.status === 403 && !prevRequest?.sent) {

                    prevRequest.sent = true;
                    console.log("hellooo")
                    const newAccessToken = await refresh();
                    prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return axiosInstance(prevRequest);
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axiosInstance.interceptors.request.eject(requestIntercept);
            axiosInstance.interceptors.response.eject(responseIntercept);
        }
    }, [auth, refresh])

    return axiosInstance;
}

export default useAxiosInterceptors;