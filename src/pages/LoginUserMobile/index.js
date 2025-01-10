
import axios from 'axios';
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import { useNavigate } from 'react-router-dom'
import { Cookies } from 'react-cookie'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebookF } from '@fortawesome/free-brands-svg-icons';
import { MobileContext } from '../../components/Layout/MobileLayout1';
import styles from './LoginUser.module.scss'
import classNames from "classnames/bind"
import { useContext,  useCallback, useRef} from 'react';
const cx = classNames.bind(styles)

function App() {
    const navigate = useNavigate()
    const cookies = new Cookies()
    const {setCheckRegister, checkRegister} = useContext(MobileContext)
    const PhoneNumber = useRef(null)
    const Password = useRef(null)
    const handleClickLogin = useCallback( async (e) => {
        e.preventDefault()
        if(PhoneNumber.current.value.length > 0 && Password.current.value.length > 0) {
            try {
               const response = await axios.post(`${process.env.REACT_APP_CALL_API}/api/v12/login`, {Phone: PhoneNumber.current.value,Pass:Password.current.value});
               if(response.data.massege === 'Thanh cong') {
                localStorage.setItem('Account',JSON.stringify(response.data.data))
                cookies.set('AccessToken', response.data.token, { path: '/', maxAge: 604800 }); // 604800 giây = 7 ngày
                navigate('/')
               }
               else {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Sai tài khoản hoặc mật khẩu!",
                    footer: '<a href="#">Why do I have this issue?</a>'
                  });
               }
              } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Sai tài khoản hoặc mật khẩu!",
                    footer: '<a href="#">Why do I have this issue?</a>'
                  });
              }
        }
    },[])
    return ( 
        <div className={cx('Modal_login_user')}>
            {checkRegister ? (
                 <div className={cx('container')}>
                    <div className={cx('heading')}>Đăng ký</div>
                    <form action="" className={cx('form')}>
                    <input ref={PhoneNumber} required="" className={cx('input')} type="number" name="email" id="email" placeholder="Số điện thoại" />
                    <input className={cx('login-button')} type="submit" value="Đăng ký" />
                    
                    </form>
                    <div className={cx('social-account-container')}>
                        <span className={cx('title')}>Or Sign in with</span>
                        <div className={cx('social-accounts')}>
                        <button className={cx('social-button','google')}>
                            <svg className={cx('svg')} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 488 512">
                            <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                            </svg></button>
                        <button className={cx('social-button','apple')}>
                            <svg className={cx('svg')} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512">
                            <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"></path>
                            </svg>
                        </button>
                        <button className="social-button twitter">
                            <svg className={cx('svg')} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512">
                            <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"></path>
                            </svg>
                        </button>
                        </div>
                    </div>
                    <span className={cx('agreement')}>Bạn đã có tài khoản?<button onClick={() => setCheckRegister(false)}>Đăng nhập</button></span>
                </div> 
            ) : (
            <div className={cx('container')}>
                <div className={cx('heading')}>Đăng nhập</div>
                <form onSubmit={(e) => handleClickLogin(e)} className={cx('form')}>
                    <input ref={PhoneNumber} required="" className={cx('input')} type="number" placeholder="Số điện thoại" />
                    <input ref={Password} required="" className={cx('input')} type="password"placeholder="Password" />
                    <span className={cx('forgot-password')}><a href="#">Quên mật khẩu</a></span>
                    <input className={cx('login-button')} type="submit" value="Đăng nhập" />
                </form>
                <div className={cx('social-account-container')}>
                    <span className={cx('title')}>Hoặc đăng nhập với</span>
                    <div className={cx('social-accounts')}>
                    <button className={cx('social-button','google')}>
                        <svg className={cx('svg')} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 488 512">
                        <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                        </svg></button>
                    <button className={cx('social-button','apple')}>
                        <FontAwesomeIcon style={{color:'white'}} icon={faFacebookF} />
                    </button>
                    </div>
                </div>
                <span className={cx('agreement')}>Bạn mới biết đến GOGI?<button onClick={() => setCheckRegister(true)}>Đăng ký</button></span>
            </div>
            )}
        </div>
     );
}

export default App;