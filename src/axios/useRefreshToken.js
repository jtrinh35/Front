import { useContext } from 'react';
import Config from './Config';
import { authContext } from '../context/authProvider';


const useRefreshToken = () => {
    const { setAuth } = useContext(authContext)
    const axiosInstance = Config()

    const refresh = async () => {
        const response = await axiosInstance.get('/refresh', {
            withCredentials: true
        });
        setAuth(response.data)
        return response.data;
    }
    return refresh;
};

export default useRefreshToken;