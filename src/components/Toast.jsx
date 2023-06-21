import React from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Toast = (type, text) => {
    console.log(type)
    console.log(text)
    toast.configure({
        position: "bottom-right",
        theme: "colored",
        pauseOnFocusLoss: false,
        pauseOnHover: false,
        autoClose: 1500
    })

    const display = () => {
        switch(type){
            case "success":
                console.log("hello")
                toast.success(text)
                break
            case "error":
                toast.error(text)
                break
            default:
                return
            
        }
    } 
    return (
        <>
       {display()}
        </>
    );
};


export const ToastInternet = (type, text) => {
    console.log(type)
    console.log(text)
    toast.configure({
        position: "top-right",
        theme: "colored",
        pauseOnFocusLoss: false,
        pauseOnHover: false,
        autoClose: false,
    })

    const display = () => {
        switch(type){
            case "internet":
                toast.info(text)
                break
            case "noInternet":
                toast.warning(text)
                break
            default:
                return
            
        }
    } 
    return (
        <>
       {display()}
        </>
    );

    
};


