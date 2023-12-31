import React, { useEffect, useState } from 'react';
import useAxiosInterceptors from '../axios/useAxios';
import HomeLoader from "../components/HomeLoader";
import { Page } from '@react-pdf/renderer';

const TestScreen = () => {
    const axiosInstance = useAxiosInterceptors()
    const location = new URLSearchParams(window.location.search).get("code");
    const session = new URLSearchParams(window.location.search).get("session_state");
    const [close, setClosed] = useState(false)

    axiosInstance.put('/edenred/info', {code: location, session: session})
    .then(function(response){
        console.log(response.data)
        localStorage.setItem('Edenred', JSON.stringify(response.data))
        setClosed(true)
    })
    
    useEffect(async() => {
        if(close === true){
            
            window.close()

        }
    }, [close])
    return (
        <HomeLoader />
    );
};

export default TestScreen;