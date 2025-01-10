import { useContext, memo } from 'react';
import { IdElementContext } from '../IdElementContext'
import iconHeaderBody1 from "../../../../Asset/images/iconHeaderBody1.png";
import iconHeaderBody2 from "../../../../Asset/images/iconHeaderBody2.png";
import iconHeaderBody3 from "../../../../Asset/images/iconHeaderBody3.png";
import iconHeaderBody4 from "../../../../Asset/images/iconHeaderBody4.png";


function ItemHeaderBody() {
    const { titleHeaderBody, itemHeaderBody, headerBodyContent } = useContext(IdElementContext)
    return (
        <div ref={titleHeaderBody} className={`header_app-content`}>
            <h3 ref={headerBodyContent}>Your Best Choice</h3>
            <div className={'header_app-content-list-icon'}>
                <div className={'header_app-content-item'}>
                    <div ref={(e) => itemHeaderBody.current[0] = e} className={'header_app-content_icon-list'}>
                        <img src={iconHeaderBody1} alt="" className={'headerAppContentIcon'} />
                    </div>
                    <div className={`header_app-content-item-slogan`}>
                        <h2>CHUẨN VỊ NƯỚNG HÀNG</h2>
                    </div>
                </div>
                <div className={'header_app-content-item'}>
                    <div ref={(e) => itemHeaderBody.current[1] = e} className={'header_app-content_icon-list'}>
                        <img src={iconHeaderBody2} alt="" className={'headerAppContentIcon'} />
                    </div>
                    <div className={`header_app-content-item-slogan`}>
                        <h2>THỰC ĐƠN ĐA DẠNG</h2>
                    </div>
                </div>
                <div className={'header_app-content-item'}>
                    <div ref={(e) => itemHeaderBody.current[2] = e} className={'header_app-content_icon-list'}>
                        <img src={iconHeaderBody3} alt="" className={'headerAppContentIcon'} />
                    </div>
                    <div className={`header_app-content-item-slogan`}>
                        <h2>KHÔNG GIAN ẤM CÚNG</h2>
                    </div>
                </div>
                <div className={'header_app-content-item'}>
                    <div ref={(e) => itemHeaderBody.current[3] = e} className={'header_app-content_icon-list'}>
                        <img src={iconHeaderBody4} alt="" className={'headerAppContentIcon'} />
                    </div>
                    <div className={`header_app-content-item-slogan`}>
                        <h2>PHỤC VỤ TẬN TÌNH</h2>
                    </div>
                </div>

            </div>
        </div>

    );
}

export default memo(ItemHeaderBody);