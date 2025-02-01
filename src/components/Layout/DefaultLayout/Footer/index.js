import ImgQR from "../../../../Asset/images/d91264e165ed6facc6178994d5afae79.png"
import AppStore from "../../../../Asset/images/appstore.png"
import ChPlat from "../../../../Asset/images/chplay.png"
import classNames from "classnames/bind";
import styles from "./Footer.module.scss";
import { memo } from "react";
const cx = classNames.bind(styles);

function Footer() {
    return (
        <div className={cx('Footer_Container')}>
            <div className={cx('Footer_Container_list')}>
                <ul className={cx('Footer_Container_list-item')}>
                    <li className={cx('Footer_Container_list-item--title')}>Chăm sóc khách hàng</li>
                    <li>Điều khoảng sử dụng</li>
                    <li>Chính sách đổi trả</li>
                    <li>Chính sách thành viên</li>
                    <li>Chính sách bảo mật</li>
                </ul>
                <ul className={cx('Footer_Container_list-item')}>
                    <li className={cx('Footer_Container_list-item--title')}>Giới thiệu</li>
                    <li>Giới thiệu</li>
                    <li>Tuyển dụng</li>
                    <li>Điều khoản</li>
                </ul>
                <ul className={cx('Footer_Container_list-item')}>
                    <li className={cx('Footer_Container_list-item--title')}>Danh mục</li>
                    <li>Bán lẽ</li>
                    <li>Buffer</li>
                    <li>Combo</li>
                </ul>
                <ul className={cx('Footer_Container_list-item')}>
                    <li className={cx('Footer_Container_list-item--title')}>Theo dỗi chúng tôi trên</li>
                    <li>Facebook</li>
                    <li>Instagram</li>
                    <li>Youtube</li>
                </ul>
                <div className={cx('Footer_Container_list-item')}>
                    <h4 className={cx('Footer_Container_list-item--title')}>Vào cửa hàng trên ứng dung</h4>
                    <div className={cx('Footer_Container_list-item--img')}>
                        <img className={cx('Footer_Container_list-item--img_QR')} src={ImgQR} />
                        <img className={cx('Footer_Container_list-item--img_AppStore')} src={AppStore} />
                        <img className={cx('Footer_Container_list-item--img_ChPlay')} src={ChPlat} />
                    </div>
                </div>
            </div>
            <div className={cx('Footer_Container_info')}>
                <p className={cx('footer_text')}>Địa chỉ: Tầng 4-5-6, Tòa nhà Capital Place, số 29 đường Liễu Giai, Phường Ngọc Khánh, Quận Ba Đình, Thành phố Hà Nội, Việt Nam. Tổng đài hỗ trợ: 19001221 - Email:  support.hn@ggg.com.vn</p>
                <p className={cx('footer_text')}>Chịu Trách Nhiệm Quản Lý Nội Dung: Nguyễn Đức Trí - Điện thoại liên hệ: 024 73081221 (ext 4678)</p>
                <p className={cx('footer_text')}>Mã số doanh nghiệp: 0106773786 do Sở Kế hoạch & Đầu tư TP Hà Nội cấp lần đầu ngày 10/02/2015</p>
                <p className={cx('footer_text')}>© 2022 - Bản quyền thuộc về CÔNG TY CỔ PHẦN TẬP ĐOÀN GOLDEN GATE</p>
            </div>
        </div>
    );
}

export default memo(Footer);