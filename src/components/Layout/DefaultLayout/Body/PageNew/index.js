
import { memo } from 'react';
import Slide from'./Slide'

function App() {
    return ( 
        <div className={'backround_tintuc'}>
        <div className={'tintuc grid wide'}>
            <div className={'header_tintuc'}>                        
                <h3 className={'blog'}>Blog</h3>
                <h1 className={'title'}>TIN TỨC</h1>
            </div>
            <div className={'body_tintuc'}>
                <div className={'body_tintuc-img'}>
                    <div className={'body_tintuc-img-new-icon'}>
                        <span style={{color: '#fff', textAlign: 'center',fontStyle: 'italic', fontSize: '17px'}}>NEW</span>
                    </div>
                    <div className={'body_tintuc-img-item'}>
                            <Slide />
                    </div>
                </div>
                <div className={'body_tintuc-container'}>
                    <h2 className={'body_tintuc-container-tips'}>TIPS ẨM THỰC</h2>
                    <h1 className={'body_tintuc-container-header'}>[MN] KING BBQ BUFFET 179K – DUY NHẤT TẠI 11 TỈNH MIỀN NAM</h1>
                    <h3 className={'body_tintuc-container-time'}>18 MARCH</h3>
                    <p className={'body_tintuc-container-contain'}>🔥 Chào các đồng nướng! Tất cả mọi người đã sẵn sàng cho một cơn sốt ẩm thực tại King BBQ  chưa nào? MENU BUFFET MỚI – CHỈ 179.000 VNĐ Tặng thêm 01 phần lẩu Tokbokki cực “HOT” Buffet 179k tại King BBQ cũng là một lựa chọn tuyệt vời cho mọi dịp họp mặt, […]</p>
                    <a href="" className={'body_tintuc-container-button'}>READ MORE</a>
                </div>
            </div>
        </div>
    </div>
     );
}

export default memo(App);