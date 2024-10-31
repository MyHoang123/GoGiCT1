import { createContext,useEffect,useState,useCallback } from "react";
const Globalcontext = createContext()
function GlobalcontextProvider( {children} ) {
    // State global layout
    const [checkLayout, setChecklayOut] = useState('1')
    // Ref 

        const data = {
            checkLayout,
            setChecklayOut,
        }
        
    return ( 
        <Globalcontext.Provider value={{checkLayout,setChecklayOut}}>
                {children}
        </Globalcontext.Provider>
     );
}

export {Globalcontext, GlobalcontextProvider} ;