
import useEdenredConfig from './useEdenredConfig';

const useEdenredRefresh = () => {

    const axiosInstance = useEdenredConfig()

    const refresh = async () => {
        const response = await axiosInstance.post('/edenred/refresh')
        const Edenred = JSON.parse(localStorage.getItem('Edenred'))
        Edenred.access_token = response.data
        localStorage.setItem('Edenred', JSON.stringify(Edenred))
        return response.data;
    }
    return refresh;
};
//   axiosInstance.post('/edenred/refresh')
    // .then(function(response){

    //     const Edenred = JSON.parse(localStorage.getItem('Edenred'))
    //     Edenred.access_token = response.data
    //     localStorage.setItem('Edenred', JSON.stringify(Edenred))
    //   })
export default useEdenredRefresh;