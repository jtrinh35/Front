import React from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Toast = (type, text) => {
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

export default Toast;