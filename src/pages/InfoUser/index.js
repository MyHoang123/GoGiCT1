


import { Cookies } from 'react-cookie'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import React, { useState} from 'react';
import classNames from "classnames/bind"
import styles from './InfoUser.module.scss'
import { Link } from 'react-router-dom';
const cx = classNames.bind(styles)


function App() {
    const cookies = new Cookies()

    const [Avt, setAvt] = useState(cookies.get('AccessToken') !== undefined  ? JSON.parse(localStorage.getItem('Account')).Avt : "")

    return ( 
        <div className={cx('Modal_info-user')}>
            <div className={cx('Modal_info-user_header')}>
                <Link to='/'><FontAwesomeIcon style={{height:'15px'}} icon={faChevronLeft} /></Link>
                <h2>Hồ Sơ</h2>
            </div>
            <div className={cx('Modal_info-user_img')}>
                <div className={cx('card')}>
                                <div className={cx('card__img')}></div>
                                <div className={cx('card__avatar')}><img src={JSON.parse(localStorage.getItem('Account')).Classify === 'user' ? `https://severgogi.onrender.com/api/v12/avtuser/${Avt}`: `${Avt}` }/></div>
                                <div className={cx('card__subtitle')}>Thành viên bạc</div>
                                {JSON.parse(localStorage.getItem('Account')).Classify === 'user' ? (
                                    <div className={cx('card__wrapper')}>
                                        <button className={cx('card__btn')}>Chọn Ảnh</button>
                                        <input style={{display:'none'}}  type="file"/>
                                    </div>
                                ) : null}
                    </div>
            </div>
            <div className={cx('Modal_info-user_Name-phone')}>
                <div className={cx('Modal_info-user_Name')}>
                    <span>Tên</span>
                    <h2></h2>
                </div>
                <div className={cx('Modal_info-user_phone')}>
                    <span>Điện thoại</span>
                    <h2>0832047271</h2>
                </div>
            </div>
            <div className={cx('Modal_info-user_Gender-Bday')}>
                <div className={cx('Modal_info-user_Gender')}>
                        <span>Giới tính</span>
                        <h2>Nam</h2>
                </div>
                <div className={cx('Modal_info-user_Bday')}>
                        <span>Ngày sinh</span>
                        <h2>04/01/2002</h2>
                </div>
            </div>
            <div className={cx('Modal_info-user_email')}>
                <div className={cx('Modal_info-user_email-item')}>
                        <span>Email</span>
                        {/* <h2>Nam</h2> */}
                </div>
            </div>
            <div className={cx('Modal_info-user_logout')}>
                <button>Đăng xuất</button>
            </div>
        </div>
     );
}

export default App;