import React, {useEffect, useState} from "react"

function Time(){

    const [clockState, setClockState] = useState(new Date().toLocaleTimeString('fr-FR'))
    const [inTime, setInTime] = useState()

    useEffect(() => {
        setInterval(() => {
            const date = new Date()
            setClockState(date.toLocaleTimeString('fr-FR'))
        }, 1000)
    },[])

    
    useEffect(() => {
        console.log(parseInt(clockState.slice(0,2)))
        // if(14 < parseInt(clockState.slice(0,2)) && parseInt(clockState.slice(0,2)) < 18){
            // alert(parseInt(clockState.slice(0,2)))
            if(parseInt(clockState.slice(0,2)) > 17){
            setInTime(true)
        }else{
            setInTime(false)
        }
    }, [])


    return inTime
}

export default Time;

