import menugogi from "../../../../Asset/images/gia-menu-gogi-house-221122-removebg-preview.png"
import { memo } from "react";


function Headerbody() {
    return ( 
        <>
            <div className={`header_body`}>
                <img className={'menugogi_backround'} src={menugogi} alt=""/>
            </div>
        </>

     );
}

export default memo(Headerbody);