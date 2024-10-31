import { useState, createContext, useEffect,useRef } from "react";
export  const MobileContext = createContext()


function AppMobile( {Children} ) {
    const data = {
        a:'hihi'
    }
    return ( 
        <MobileContext.Provider value={data}>
            {/* <div className="mobile">
            <div ref={modalHello} className='Modal_hellogogi'>
            <div className='Modale_content'>
                <h1>Gogi sizzling delight, igniting tradition masterfully.</h1>
                <p>The best grain, the finest roast, the powerful flavor.</p>
                <button onClick={handleClickStar} className='button_pay_mobile'>Get Started</button>
            </div>
        </div>
            </div> */}
                {Children}
        </MobileContext.Provider>
     );
}

export default AppMobile;