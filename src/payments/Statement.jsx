import React from 'react';

const Statement = (payMethod, cartItems) => {
    let state;
    console.log(JSON.parse(localStorage.getItem('Edenred')).balance.amount)
    console.log(payMethod)

    if (payMethod.TR && payMethod.TR.length > 0 && cartItems.itemsPrice === cartItems.itemsPrice_TR && cartItems.itemsPrice_TR <= 25){
        if(payMethod.TR === 'conecs' && JSON.parse(localStorage.getItem('Conecs')).balance/100 >= cartItems.itemsPrice) state = 'TR only'
        else if(payMethod.TR === 'edenred' && (JSON.parse(localStorage.getItem('Edenred')).balance.amount)/100 >= cartItems.itemsPrice) state ='TR only'
        else if((payMethod.TR === 'conecs'||  payMethod.TR === 'edenred') && payMethod.CB.includes("cb")) state = 'CB and TR'
    }

    else if(payMethod.CB){
        if (payMethod.CB.includes("cb") && (!payMethod.TR || payMethod.TR.length === 0)){
            state ='CB only'
        }
        else if(payMethod.CB.includes("cb") && payMethod.TR && payMethod.TR.length > 0) {
            state ='CB and TR'
        }
    }
   

    
    else {
        console.log("hello")
        state ='Payment cannot be determined'
    }
    console.log(state)
    return state
};

export default Statement;