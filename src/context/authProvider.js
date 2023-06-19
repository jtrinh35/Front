import { createContext, useState } from "react";

export const authContext = createContext(); 

export const AuthProvider = ({children}) => {
    console.log("hello")
    const [auth, setAuth] = useState("hello from henni");

    return (
        <authContext.Provider value={{auth, setAuth}}>
            {children}
        </authContext.Provider>
    )
}

export default AuthProvider;
// export const authContext = createContext(null)
// export default  authContext 
