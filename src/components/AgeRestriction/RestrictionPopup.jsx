import React, { useState } from 'react';

const RestrictionPopup = () => {

    const [display, setDisplay] = useState(true)

    const popup = () => {

        if(display === true){
            setDisplay(false)
        }
        else{
            setDisplay(true)
        }
    }

    return (
        <>
        {display ? (
            <>
            <div className='bg-white h-full w-full absolute top-0 z-50' id="restrictedPopup">
                <button onClick={popup}>DISPLAY</button>
                Valider mon âge
            </div>
            </>
        ) : (
            <>
                <button onClick={popup}>DISPLAY</button>
            </>
        )}
       </>
    );
};

export default RestrictionPopup;