import React, { useState ,useEffect, useReducer, useRef } from 'react';
import axios from 'axios'
import './showSlider.scss'
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import {getIndex, setImg, getImg, updateImg, getImgMini, getImgBody, getImgPagenew, updateLinkYoutube} from './action'
import reducer, { initState } from './reducer'
import logger from './logger';
function App() {
    const [checkEdit, setCheckEdit] = useState(false)
    const [idYoutube, setIdYoutube] = useState('')
    const [state, dispatch] = useReducer(reducer, initState)
    const { img, imgs, index, imgsMini, imgBodys, imgPageNews } = state
    const inputRef = useRef()
    const inputRefMini = useRef()
    const inputRefBody = useRef()
    const inputRefPageNew = useRef()
    const slideRef = useRef()
    const slidesRef = useRef([])
  // Call Api
     //   // Gửi dữ liệu lên API Update
  async function updateSlider(slide) {
    try {
      const formData = new FormData();
      formData.append('fileupdate', slide, `${slide.name}_slider`);
      formData.append('Name', img.img);
      const response = await axios.put('http://localhost:8080/api/v12/updateslider', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      dispatch(updateImg([index,response.data.fileName]))
      dispatch(setImg(response.data.fileName))
    } catch (error) {
      console.error('Lỗi khi thêm sản phẩm:', error);
    }
  }
      //   // Gửi dữ liệu lên API Update
      async function updateLinkYtb(Link) {
      try {
        const response = await axios.put('http://localhost:8080/api/v12/updatelinkytb', Link);
        if(response.data.message === 'Success') {
          dispatch(updateLinkYoutube(Link.newName))
          setIdYoutube('')
        }
      } catch (error) {
        console.error('Lỗi khi thêm sản phẩm:', error);
      }
    }
    const handleChangeFile = (e) => {
        // Xử lý file đã chọn
        updateSlider(e.target.files[0])
      };
    const handleClickImg = (img,i) => {
        dispatch(getIndex(i))
        dispatch(setImg(img))
    }
    const handleClickPickFile = () => {
        inputRef.current.click()
    }
    const handleClickPickFileMini = () => {
      inputRefMini.current.click()
    }
    const handleClickPickFileBody = () => {
      inputRefBody.current.click()
    }
    const handleClickPickFilePageNew = () => {
      inputRefPageNew.current.click()
    }
    const handleClickEdit = (e) => {
      if(e.target.checked === true) {
        setCheckEdit(true)
      }
      else {
        setCheckEdit(false)
      }
    }
    const handleClickSaveLinkYoutube = () => {
      if(idYoutube.length > 0) {
         const videoId = idYoutube.split('v=')[1];
         const Link = {
          newName: videoId,
          Name: imgBodys[3].Img
         }
         updateLinkYtb(Link)
      }
      else {
        Swal.fire("Vui Lòng Nhập Link !");
      }
    }
    useEffect(()=> {
        axios.all([
            axios.get('http://localhost:8080/api/v12/showslide'),
            axios.get('http://localhost:8080/api/v12/showslidemini'),
            axios.get('http://localhost:8080/api/v12/showimgbody'),
            axios.get('http://localhost:8080/api/v12/showimgpagenew'),
          ])
            .then(axios.spread((Slide, SlideMini, ImgBody, ImgPageNew) => {
                dispatch(getImg(Slide.data.data))
                dispatch(getImgMini(SlideMini.data.data))
                dispatch(getImgBody(ImgBody.data.data))
                dispatch(getImgPagenew(ImgPageNew.data.data))
            }))
            .catch (err => {
                console.error()
            })
    },[])
    return (
        <>
        <div className='Slider_box'>
              <div className='Button_checkEdit-container'>
                <div className='Checkedit_content'>
                    <p>Chế độ chỉnh sửa:</p>
                    <div className='button_edit-slider'>
                      <label className="switch">
                        <input onChange={e => handleClickEdit(e)} type="checkbox" className="input"/>
                        <span className="slider_checkedit"></span>
                      </label>
                    </div>
                    <p>{checkEdit ? ('Bật') : ('Tắt')}</p>
                </div>
              </div>
          <div className='Header_slider' style={(checkEdit ? {cursor: 'pointer'} : null)}>
            <div className="Container_ShowSlider">
                <input  ref={inputRef} type="file" style={{display: 'none'}} onChange={handleChangeFile} />
              {checkEdit ? (
                  <div className='Slider_content'>         
                      <input value={(imgs.length !== 0 ? (img.author) : (null))} className='author_slide' />
                      <div>
                        <input value={(imgs.length !== 0 ? (img.title) : (null))} className='title_slide'/>
                      </div>
                      <div>
                        <input value={(imgs.length !== 0 ? (img.topic) : (null))} className='topic_slide'/>
                      </div>
                      <div className='des_slide'>
                        <textarea spellCheck="false" value={(imgs.length !== 0 ? (img.des) : (null))} type="text" className='des_slide-content'/>
                      </div>
                  </div>
              ) : (
                <div className='Slider_content'>         
                <div className='author_slide'>{(imgs.length !== 0 ? (img.author) : (null))}</div>
                <div className='title_slide'>{(imgs.length !== 0 ? (img.title) : (null))}</div>
                <div className='topic_slide'>{(imgs.length !== 0 ? (img.topic) : (null))}</div>
                <p style={{fontSize: '12px'}} spellCheck="false" type="text" className='des_slide-content'>{(imgs.length !== 0 ? (img.des) : (null))}</p>
                 </div>
              )}
              <img ref={slideRef} onClick={ checkEdit ? handleClickPickFile : null} src={(imgs.length !== 0 ? (`http://localhost:8080/api/v12/header/${img.img}`) : (null)) } className="ShowSlider-content"/>
            <div className='ShowSlider-box'>
                <div ref={e => slidesRef.current[0] = e} onClick={() => handleClickImg((imgs.length !== 0 ? (imgs[0].img) : (null)),0)} style={(imgs.length !== 0 ? {backgroundImage: `url(http://localhost:8080/api/v12/header/${imgs[0].img})`} : {})} className="ShowSlider-item"></div>  
                <div ref={e => slidesRef.current[1] = e} onClick={() => handleClickImg((imgs.length !== 0 ? (imgs[1].img) : (null)),1)} style={(imgs.length !== 0 ? {backgroundImage: `url(http://localhost:8080/api/v12/header/${imgs[1].img})`} : {})} className="ShowSlider-item"></div>  
                <div ref={e => slidesRef.current[2] = e} onClick={() => handleClickImg((imgs.length !== 0 ? (imgs[2].img) : (null)),2)} style={(imgs.length !== 0 ? {backgroundImage: `url(http://localhost:8080/api/v12/header/${imgs[2].img})`} : {})} className="ShowSlider-item"></div>  
                <div ref={e => slidesRef.current[3] = e} onClick={() => handleClickImg((imgs.length !== 0 ? (imgs[3].img) : (null)),3)} style={(imgs.length !== 0 ? {backgroundImage: `url(http://localhost:8080/api/v12/header/${imgs[3].img})`} : {})} className="ShowSlider-item"></div>                        
            </div>
            </div>
          </div>
              <div className='Slider_mini'>
                <div style={(checkEdit ? {cursor: 'pointer'} : null)} className='Slider_mini_container'>
                    <div  className='Slider_mini-box'>
                   <input  ref={inputRefMini} type="file" style={{display: 'none'}} />
                        <div onClick={ checkEdit ? handleClickPickFileMini : null} className='Slider_mini-item'>
                              <img src={(imgsMini.length !== 0 ? (`http://localhost:8080/api/v12/header/${imgsMini[0].Img}`) : (null))} />
                        </div>
                        <div onClick={ checkEdit ? handleClickPickFileMini : null} className='Slider_mini-item'>
                             <img src={(imgsMini.length !== 0 ? (`http://localhost:8080/api/v12/header/${imgsMini[1].Img}`) : (null))} />
                        </div>
                    </div>
                    <div className='Slider_mini-box'>
                        <div onClick={ checkEdit ? handleClickPickFileMini : null} className='Slider_mini-item'>
                               <img src={(imgsMini.length !== 0 ? (`http://localhost:8080/api/v12/header/${imgsMini[2].Img}`) : (null))} />
                        </div>
                        <div onClick={ checkEdit ? handleClickPickFileMini : null} className='Slider_mini-item'>
                              <img src={(imgsMini.length !== 0 ? (`http://localhost:8080/api/v12/header/${imgsMini[3].Img}`) : (null))} />
                        </div>
                    </div>
                    <div className='Slider_mini-box'>
                        <div onClick={ checkEdit ? handleClickPickFileMini : null} className='Slider_mini-item'>
                              <img src={(imgsMini.length !== 0 ? (`http://localhost:8080/api/v12/header/${imgsMini[4].Img}`) : (null))} />
                        </div>
                        <div onClick={ checkEdit ? handleClickPickFileMini : null} className='Slider_mini-item'>
                             <img src={(imgsMini.length !== 0 ? (`http://localhost:8080/api/v12/header/${imgsMini[5].Img}`) : (null))} />
                        </div>
                    </div>
                </div>

              </div>
              <div className='Page_img'>
                <div className='Page_img-container'>
                     <input  ref={inputRefBody} type="file" style={{display: 'none'}} />
                    <div className={'youtube_content'}>
                                {checkEdit ? (
                                  <div className='Input_youtube'>
                                      <div className="inputBox">
                                        <input onChange={(e) => setIdYoutube(e.target.value)} type="text" value={idYoutube} />
                                        <span>Nhập vào link youtube</span>
                                      </div>
                                      <div className='btn-savelink'>
                                          <button onClick={handleClickSaveLinkYoutube} className="button">Lưu</button>
                                      </div>
                                  <iframe style={{marginTop: '20px'}} width="560" height="315" src={`https://www.youtube.com/embed/${(imgBodys.length !== 0 ? (imgBodys[3].Img) : (null))}`}title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                                  </div>
                                ) : (
                                  <iframe width="560" height="315" src={`https://www.youtube.com/embed/${(imgBodys.length !== 0 ? (imgBodys[3].Img) : (null))}`}title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                                )}
                            </div>
                    </div>
                <div  style={(checkEdit ? {cursor: 'pointer'} : null)} className='Page_img-container'>
                    <div  onClick={ checkEdit ? handleClickPickFileBody : null}  className='Page_img-item'>
                      <img style={{filter: 'brightness(80%)', objectFit: 'cover', height:'100%'}} src={(imgBodys.length !== 0 ? (`http://localhost:8080/api/v12/bodyimg/${imgBodys[0].Img}`) : (null))}/>
                    </div>
                  <div className='Page_img-item'>
                      <div className='Page_img-item_mini'>
                          <img  onClick={ checkEdit ? handleClickPickFileBody : null}  className={'youtube_img-item-img'} src={(imgBodys.length !== 0 ? (`http://localhost:8080/api/v12/bodyimg/${imgBodys[1].Img}`) : (null))} />
                      </div>
                      <div className='Page_img-item_mini'>
                          <img  onClick={ checkEdit ? handleClickPickFileBody : null}  className={'youtube_img-item-img'} src={(imgBodys.length !== 0 ? (`http://localhost:8080/api/v12/bodyimg/${imgBodys[2].Img}`) : (null))} />
                      </div>
                  </div>
                </div>
              </div>
              <div className='Slide_page-new'>
                  <div className='Slider_page-new_container' style={(checkEdit ? {cursor: 'pointer'} : null)}>
                  <input  ref={inputRefPageNew} type="file" style={{display: 'none'}} />
                      <div  onClick={ checkEdit ? handleClickPickFilePageNew : null}  className='Slider_page-new_item'>
                           <img src={(imgPageNews.length !== 0 ? (`http://localhost:8080/api/v12/bodyimg/${imgPageNews[0].Img}`) : (null))} className="slide_swiper-img" />
                      </div>
                      <div onClick={ checkEdit ? handleClickPickFilePageNew : null}  className='Slider_page-new_item'>
                           <img src={(imgPageNews.length !== 0 ? (`http://localhost:8080/api/v12/bodyimg/${imgPageNews[1].Img}`) : (null))} className="slide_swiper-img" />
                      </div>
                      <div onClick={ checkEdit ? handleClickPickFilePageNew : null}  className='Slider_page-new_item'>
                            <img src={(imgPageNews.length !== 0 ? (`http://localhost:8080/api/v12/bodyimg/${imgPageNews[2].Img}`) : (null))} className="slide_swiper-img" />
                      </div>
                      <div onClick={ checkEdit ? handleClickPickFilePageNew : null}  className='Slider_page-new_item'>
                            <img src={(imgPageNews.length !== 0 ? (`http://localhost:8080/api/v12/bodyimg/${imgPageNews[3].Img}`) : (null))} className="slide_swiper-img" />
                      </div>
                  </div>
              </div>
        </div>
        </>
     );
} 
export default App;