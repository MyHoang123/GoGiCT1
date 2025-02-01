import IconHeader1 from '../../../../Asset/images/iconHeaderBody1.png'
import IconHeader2 from '../../../../Asset/images/iconHeaderBody2.png'
import IconHeader3 from '../../../../Asset/images/iconHeaderBody3.png'
import IconHeader4 from '../../../../Asset/images/iconHeaderBody4.png'
import { memo } from 'react'

function HeaderBody({ cx }) {
    return (
        <div className={cx('HeaderBody_Container')}>
            <h1>Your Best Choice</h1>
            <div className={cx('HeaderBody_Container_list')}>
                <section className={cx('HeaderBody_Container_list-item')}>
                    <img src={IconHeader1} />
                    <span>CHUẨN VỊ NƯỚNG HÀNG</span>
                </section>
                <section className={cx('HeaderBody_Container_list-item')}>
                    <img src={IconHeader2} />
                    <span>THỰC ĐƠN ĐA DẠNG</span>
                </section>
                <section className={cx('HeaderBody_Container_list-item')}>
                    <img src={IconHeader3} />
                    <span>KHÔNG GIAN ẤM CÚNG</span>
                </section>
                <section className={cx('HeaderBody_Container_list-item')}>
                    <img src={IconHeader4} />
                    <span>PHỤC VỤ TẬN TÌNH</span>
                </section>
            </div>
        </div>
    );
}
function LogoResource({ cx }) {
    return (
        <div className={cx('Logo_Resource')}>
            <div className={cx('Logo_Resource_list')}>
                <div className={cx('Logo_Resource_item')}>
                    <h1>40+</h1>
                    <p>Nhà Hàng</p>
                </div>
                <div className={cx('Logo_Resource_item')}>
                    <h1>120+</h1>
                    <p>Món Ăn</p>
                </div>
                <div className={cx('Logo_Resource_item')}>
                    <h1>1000+</h1>
                    <p>Nhân Viên</p>
                </div>
                <div className={cx('Logo_Resource_item')}>
                    <h1>100.000+</h1>
                    <p>Lượt Khách</p>
                </div>
            </div>
        </div>
    );
}
export const MemoizedHeaderBody = memo(HeaderBody);
export const MemoizedLogoResource = memo(LogoResource);