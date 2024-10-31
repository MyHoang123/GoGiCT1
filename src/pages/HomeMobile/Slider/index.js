import React, { memo }  from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

// import required modules
import { Pagination ,Autoplay } from 'swiper/modules';

import imgproduct1 from "../../../Asset/images/268006674_4798227233549395_9065955655470747510_n.png";
import imgproduct2 from "../../../Asset/images/130551098_3623959837642813_2071892673745677753_n.jpg";
import imgproduct3 from "../../../Asset/images/sontung1.png";
import imgproduct4 from "../../../Asset/images/102557336_3097466270292175_2765808264509443624_n.jpg";
// Scss


import  "./Slider.scss";



function PageNew( {children} ) {
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
            <div className='slider_detail' style={{backgroundImage: `url(${imgproduct1})`}}></div>
                {/* <img src={children} className="slide_swiper-img" /> */}
          </SwiperSlide>
          <SwiperSlide>
          <div className='slider_detail' style={{backgroundImage: `url(${imgproduct2})`}}></div>

                 {/* <img src={children} className="slide_swiper-img" /> */}
          </SwiperSlide>
          <SwiperSlide>
          <div className='slider_detail' style={{backgroundImage: `url(${imgproduct3})`}}></div>

                  {/* <img src={children} className="slide_swiper-img" /> */}
          </SwiperSlide>
          <SwiperSlide>
          <div className='slider_detail' style={{backgroundImage: `url(${imgproduct4})`}}></div>

                {/* <img src={children} className="slide_swiper-img" /> */}
          </SwiperSlide>
        </Swiper>
      </>
    );
  }
export default memo(PageNew);