
import { memo } from 'react';
import axios from 'axios'

import { useContext, useEffect, useState } from "react";
import { IdElementContext } from '../../IdElementContext'

function App() {
    const [bodyimg, setBodyimg] = useState([])
    const [youtubelink, setYoutubeLink] = useState(null)
    const {youtubeRef} = useContext(IdElementContext)
    useEffect(() => {
        axios.all([
            axios.get(`${process.env.REACT_APP_CALL_API}/api/v12/showimgbody`),
          ])
            .then(axios.spread((imgBody, ) => { 
              setBodyimg(imgBody.data.data)
              setYoutubeLink(`https://www.youtube.com/embed/${imgBody.data.data[3].Img}`)
            }))
            .catch (err => {
                console.error()
            })
        },[])
    return ( 
        <div className={`backround_youtube`}>
        <div className={'youtube_container'}>
            <div ref={(e) => youtubeRef.current[0] = e} style={{transform: 'translateX(-114px)',transition: 'transform .5s ease-in-out,opacity .5s ease-in-out',opacity:'0'}} className={'youtube_content'}>
                <iframe width="640" height="360" src={(bodyimg.length !== 0 ? (youtubelink) : (null))} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
            </div>
            <div className={'youtube_img'}>
                <div ref={(e) => youtubeRef.current[1] = e} className={'youtube_img-item'}>
                    <img style={{filter: 'brightness(80%)'}} src={(bodyimg.length !== 0 ? (`${process.env.REACT_APP_CALL_API}/api/v12/bodyimg/${bodyimg[0].Img}`) : (null))}/>
                    <div className={'overflow'}>
                        <h1>Đại Tiệc Nướng Lẩu Hàn Quốc</h1>
                    </div>
                </div>
                <div  ref={(e) => youtubeRef.current[2] = e}  className={'youtube_img-item-f'}>
                    <img className={'youtube_img-item-img'} src={(bodyimg.length !== 0 ? (`${process.env.REACT_APP_CALL_API}/api/v12/bodyimg/${bodyimg[1].Img}`) : (null))} />
                    <img className={'youtube_img-item-img'} src={(bodyimg.length !== 0 ? (`${process.env.REACT_APP_CALL_API}/api/v12/bodyimg/${bodyimg[2].Img}`) : (null))} />
                </div>
            </div>
        </div>
    </div>
     );
}

export default memo(App);