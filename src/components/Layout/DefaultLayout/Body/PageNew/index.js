import axios from 'axios';
import React, { memo, useEffect, useState }  from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';


// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

// import required modules
import { Pagination ,Autoplay } from 'swiper/modules';


// Scss


import  "./PagaNew.scss";




function PageNew() {
    const [imgPageNew, setImgPageNew] = useState([])
      useEffect(() => {
        axios.all([
          axios.get('http://localhost:8080/api/v12/showimgpagenew'),
        ])
          .then(axios.spread((ImgPageNew) => {
              setImgPageNew(ImgPageNew.data.data)
          }))
          .catch (err => {
              console.error()
          })
      },[])
    return (
      <>
        <Swiper
          direction={'vertical'}
          pagination={{
            clickable: true,
          }}
          autoplay = {{
            delay: 3000,
            disableOnInteraction: false,
          }}
          modules={[Pagination,Autoplay]}
          className="mySwiper"
        >
          <SwiperSlide>
                <img src={(imgPageNew.length !== 0 ? (`http://localhost:8080/api/v12/bodyimg/${imgPageNew[0].Img}`) : (null))} className="slide_swiper-img" />
          </SwiperSlide>
          <SwiperSlide>
                 <img src={(imgPageNew.length !== 0 ? (`http://localhost:8080/api/v12/bodyimg/${imgPageNew[1].Img}`) : (null))} className="slide_swiper-img" />
          </SwiperSlide>
          <SwiperSlide>
                  <img src={(imgPageNew.length !== 0 ? (`http://localhost:8080/api/v12/bodyimg/${imgPageNew[2].Img}`) : (null))} className="slide_swiper-img" />
          </SwiperSlide>
          <SwiperSlide>
                <img src={(imgPageNew.length !== 0 ? (`http://localhost:8080/api/v12/bodyimg/${imgPageNew[3].Img}`) : (null))} className="slide_swiper-img" />
          </SwiperSlide>
        </Swiper>
      </>
    );
  }
export default memo(PageNew);