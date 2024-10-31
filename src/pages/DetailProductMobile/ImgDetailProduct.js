import React, { memo } from 'react'

function Img( { children }) {
    const backroundImg = require(`../../Asset/images/${children}`)
    return ( 
        <>
            <img src={backroundImg} style={{width: '100%', height: '100%',objectFit: 'cover',borderRadius:'50%'}} />
        </>
     );
}

export default memo(Img);