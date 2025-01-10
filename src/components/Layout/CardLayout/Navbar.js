import styles from './Card.module.scss'
import classNames from "classnames/bind"
import { Link, useNavigate } from 'react-router-dom'
import { memo } from 'react'
const cx = classNames.bind(styles)
function Navbar({ socket, cookie }) {
    const navigate = useNavigate()
    const handleClickLogOut = () => {
        socket.disconnect();
        localStorage.removeItem('Account')
        cookie.remove('AccessToken', { path: '/' })
        navigate('/')
    }
    return (
        <nav className={cx('navbar_container')}>
            <ul className={cx('navbar_content_list')}>
                <li onClick={() => navigate('/')} >Trang chủ</li>
                <li >Thực đơn</li>
                <li >Đặt bàn</li>
                <li >Trợ giúp</li>
                <li >Thông báo</li>
                {JSON.parse(localStorage.getItem('Account')) === null ? (
                    null
                ) : (
                    <li className={cx('header_navbar-item')} >
                        <div className={cx('header_navbar_img-user')}>
                            <img style={{ borderRadius: '50%' }} src={JSON.parse(localStorage.getItem('Account')).Classify === 'user' ? `${process.env.REACT_APP_CALL_API}/api/v12/avtuser/${JSON.parse(localStorage.getItem('Account')).Avt}` : `${JSON.parse(localStorage.getItem('Account')).Avt}`} className={cx('header_navbar-user-img')} />
                        </div>
                        <span className={cx('header_navbar-user-name')}>
                            {JSON.parse(localStorage.getItem('Account')).UserName}
                        </span>
                        <ul className={cx('header_navbar-user-menu')}>
                            <li style={{ padding: '0' }} className={cx('header_navbar-user-item')}>
                                <Link to='/user'>Tài khoản của tôi</Link>
                            </li>
                            <li style={{ padding: '0' }} className={cx('header_navbar-user-item')}>
                                <Link to='/purchase'>Đơn mua </Link>
                            </li>
                            <li style={{ padding: '0' }} className={cx('header_navbar-user-item')}>
                                <Link to='/card'>Giỏ hàng </Link>
                            </li>
                            <li onClick={handleClickLogOut} style={{ padding: '0' }} className={cx('header_navbar-user-item')}>
                                <span>Đăng xuất</span>
                            </li>
                        </ul>
                    </li>
                )}
            </ul>
        </nav>
    );
}

export default memo(Navbar);