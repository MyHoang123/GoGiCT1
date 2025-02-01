
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import ImgPageNew1 from "../../../../Asset/images/426107323_757068556608540_6240491754554966160_n.jpg"
import ImgPageNew2 from "../../../../Asset/images/432768602_122163813026077687_6238129544873236612_n.jpg"
import ImgPageNew3 from "../../../../Asset/images/440347019_745612817754114_1046494978454736200_n.jpg"
import ImgPageNew4 from "../../../../Asset/images/backround2.jpg"
import { memo } from 'react';

function Slide( {cx} ) {
    return (
        <Swiper
            direction={'vertical'}
            pagination={{
                clickable: true,
            }}
            autoplay={{
                delay: 3000,
                disableOnInteraction: false,
            }}
            modules={[Pagination, Autoplay]}
            className={cx('mySwiper')}
        >
            <SwiperSlide>
                <img src={ImgPageNew1} className={cx('slide_swiper-img')} />
            </SwiperSlide>
            <SwiperSlide>
                <img src={ImgPageNew2} className={cx('slide_swiper-img')} />
            </SwiperSlide>
            <SwiperSlide>
                <img src={ImgPageNew3} className={cx('slide_swiper-img')} />
            </SwiperSlide>
            <SwiperSlide>
                <img src={ImgPageNew4} className={cx('slide_swiper-img')} />
            </SwiperSlide>
        </Swiper>
    )
}

function PageNews({ cx }) {
    return (
        <div className={cx('PageNews_Container')}>
            <div className={cx('PageNews_Container_header')}>
                <h2 className={cx('PageNews_Container_header-Blog')}>Blog</h2>
                <h1 className={cx('PageNews_Container_header-news')}>TIN TỨC</h1>
                <div className={cx('PageNews_Container_contain')}>
                    <div className={cx('PageNews_Container_contain-lef')}>
                        <div className={cx('PageNews_Container_contain-lef--slide')}>
                            <Slide cx = {cx} />
                        </div>
                    </div>
                    <div className={cx('PageNews_Container_contain-right')}>
                        <section className={cx('PageNews_Container_contain-right--content')}>
                            <h2 className={cx('PageNews_Container_contain-right--content_tip')}>Tips Ẩm Thực</h2>
                            <h1 className={cx('PageNews_Container_contain-right--content_intro')}>[MN] KING BBQ BUFFET 179K – DUY NHẤT TẠI 11 TỈNH MIỀN NAM</h1>
                            <h3 className={cx('PageNews_Container_contain-right--content_time')} >18 MARCH</h3>
                            <p className={cx('PageNews_Container_contain-right--content_speech')}>🔥 Chào các đồng nướng! Tất cả mọi người đã sẵn sàng cho một cơn sốt ẩm thực tại King BBQ chưa nào? MENU BUFFET MỚI – CHỈ 179.000 VNĐ Tặng thêm 01 phần lẩu Tokbokki cực “HOT” Buffet 179k tại King BBQ cũng là một lựa chọn tuyệt vời cho mọi dịp họp mặt, […]</p>
                        </section>
                        <button>READ MORE</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default memo(PageNews);