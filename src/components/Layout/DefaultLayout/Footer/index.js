import './Footer.scss'
import Qrdowload from '../../../../Asset/images/d91264e165ed6facc6178994d5afae79.png'
import CHPlay from '../../../../Asset/images/chplay.png'
import AppStore from '../../../../Asset/images/appstore.png'



function Footer() {
    return (  
        <>
                    <div className='grid wide'>
                        <div className='row'>
                            <div className='footer_content col l-2-4 m-4 c-6'>
                                <h3 className='footer_heading'>Chăm sóc khách hàng</h3>
                                <ul className='footer_list'>
                                    <li className='footer_item'>
                                        <a href="" className='footer_item-link'>Điều khoảng sử dụng</a>
                                    </li>
                                    <li className='footer_item'>
                                        <a href="" className='footer_item-link'>Chính sách đổi trả</a>
                                    </li>
                                    <li className='footer_item'>
                                        <a href="" className='footer_item-link'>Chính sách thành viên</a>
                                    </li>
                                    <li className='footer_item'>
                                        <a href="" className='footer_item-link'>Chính sách bảo mật</a>
                                    </li> 
                                </ul>
                            </div>
                            <div className='footer_content col l-2-4 m-4 c-6'>
                                <h3 className='footer_heading'>Giới thiệu</h3>
                                <ul className='footer_list'>
                                    <li className='footer_item'>
                                        <a href="" className='footer_item-link'>Giới thiệu</a>
                                    </li>
                                    <li className='footer_item'>
                                        <a href="" className='footer_item-link'>Tuyển dụng</a>
                                    </li>
                                    <li className='footer_item'>
                                        <a href="" className='footer_item-link'>Điều khoản</a>
                                    </li>
                                </ul>
        
                            </div>
                            <div className='footer_content col l-2-4 m-4 c-6'>
                                <h3 className='footer_heading'>Danh mục</h3>
                                <ul className='footer_list'>
                                    <li className='footer_item'>
                                        <a href="" className='footer_item-link'>Bán lẽ</a>
                                    </li>
                                    <li className='footer_item'>
                                        <a href="" className='footer_item-link'>Buffer</a>
                                    </li>
                                    <li className='footer_item'>
                                        <a href="" className='footer_item-link'>Combo</a>
                                    </li>
                                </ul>
                            </div>
                            <div className='footer_content col l-2-4 m-4 c-6'>
                                <h3 className='footer_heading'>Theo dỗi chúng tôi trên</h3>
                                <ul className='footer_list'>
                                    <li className='footer_item'>
                                        <a href="" className='footer_item-link'>
                                            <i className="footer_item-icon fa-brands fa-facebook"></i>
                                            Facebook
                                        </a>
                                    </li>
                                    <li className='footer_item'>
                                        <a href="" className='footer_item-link'>
                                            <i className="footer_item-icon fa-brands fa-instagram"></i>
                                            Instagram
                                        </a>
                                    </li>
                                    <li className='footer_item'>
                                        <a href="" className='footer_item-link'>
                                            <i className="footer_item-icon fa-brands fa-youtube"></i>
                                            Youtube
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div className="footer_content col l-2-4 m-4 c-6">
                                <h3 className='footer_heading'>Vào cửa hàng trên ứng dụng</h3>
                                <div className="footer_download">
                                    <img src={Qrdowload} alt="DownloadQR" className="footer_dowload-qr" />
                                    <div className="footer_download-apps">
                                        <img src={AppStore} alt="AppStore" className="footer_download-apps-img"/>
                                        <img src={CHPlay} alt="GooglePlay" className="footer_download-apps-img"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                <div className="footer_bottom">
                    <div className="grid wide">
                        <p className="footer_text">Địa chỉ: Tầng 4-5-6, Tòa nhà Capital Place, số 29 đường Liễu Giai, Phường Ngọc Khánh, Quận Ba Đình, Thành phố Hà Nội, Việt Nam. Tổng đài hỗ trợ: 19001221 - Email:  support.hn@ggg.com.vn</p>
                        <p className="footer_text">Chịu Trách Nhiệm Quản Lý Nội Dung: Nguyễn Đức Trí - Điện thoại liên hệ: 024 73081221 (ext 4678)</p>
                        <p className="footer_text">Mã số doanh nghiệp: 0106773786 do Sở Kế hoạch & Đầu tư TP Hà Nội cấp lần đầu ngày 10/02/2015</p>
                        <p className="footer_text">© 2022 - Bản quyền thuộc về CÔNG TY CỔ PHẦN TẬP ĐOÀN GOLDEN GATE</p>
                    </div>
                </div>
            </>
    );
}

export default Footer;