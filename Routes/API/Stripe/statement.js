export const statement = (saveCard, customerId) => {

    let statement; 
    if(saveCard === true){
        statement = 'register'
    }
    else if(customerId.length > 0){
        statement = 'FP'
    }
    else{
        statement = 'classic'
    }

    return statement

}