import React from 'react';

const Edenred = () => {
    "lucasismael@yopmail.com"
    "Edenred2021*"
    "5543"
   
    const redirect_uri = "http://localhost:3000/cart"
    const url = `https://sso.sbx.edenred.io/connect/authorize?response_type=code&client_id=427b16d007b048c5b7416ec28cf69e37&scope=openid%20edg-xp-mealdelivery-api%20offline_access&redirect_uri=${redirect_uri}&state=abc123&nonce=456azerty&acr_values=tenant%3Afr-ctrtku&ui_locales=fr`
    const open = () => {
        window.open(url, "_blank")
    }
    return (
        // <a className='h-20 w-auto bg-black' href={url} target='_blank'>
        // </a>
        <button className='h-20 w-auto bg-black' onClick={open}>
            
        </button>

        
    );
};

export default Edenred;