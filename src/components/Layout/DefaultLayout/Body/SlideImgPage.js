import axios from "axios";
import { memo, useContext, useEffect, useState } from "react";
function SlideImgPage({ cx }) {
    const [bodyimg, setBodyimg] = useState([])
    const [youtubelink, setYoutubeLink] = useState(null)
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
        <div className={cx('SlideImgPage_Container')}>
            <div className={cx('SlideImgPage_Container_contain')}>
                <div className={cx('SlideImgPage_Container_contain_ytb')}>
                    <iframe width="100%" height="100%" src={(bodyimg.length !== 0 ? (youtubelink) : (null))} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                </div>
                <div className={cx('SlideImgPage_Container_contain_img')}>
                    <img className={cx('SlideImgPage_Container_contain_img-item')} src={(bodyimg.length !== 0 ? (`${process.env.REACT_APP_CALL_API}/api/v12/bodyimg/${bodyimg[0].Img}`) : (null))} />
                </div>
                <div className={cx('SlideImgPage_Container_contain_img-mini')}>
                    <img src={(bodyimg.length !== 0 ? (`${process.env.REACT_APP_CALL_API}/api/v12/bodyimg/${bodyimg[1].Img}`) : (null))} className={cx('SlideImgPage_Container_contain_img-mini-left')} />
                    <img src={(bodyimg.length !== 0 ? (`${process.env.REACT_APP_CALL_API}/api/v12/bodyimg/${bodyimg[2].Img}`) : (null))} className={cx('SlideImgPage_Container_contain_img-mini-right')} />
                </div>
            </div>
        </div>
    );
}

export default memo(SlideImgPage);