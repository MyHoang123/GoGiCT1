
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../components/Layout//LoginLayout'
import { useContext, memo } from 'react'
import { Cookies } from 'react-cookie'
import axios from 'axios';
import Swal from 'sweetalert2/dist/sweetalert2.js'
import FacebookLogin from '../../Asset/images/facebooklogin.png'
import 'sweetalert2/src/sweetalert2.scss'
import GoogleLogin1 from '../../Asset/images/gogilogin.png'
import classNames from "classnames/bind"
import styles from './ModalAuthen.module.scss'
const cx = classNames.bind(styles)

function App() {
    const navigate = useNavigate()
    const cookies = new Cookies()
    // UseContext
    const { checkRegister, setCheckRegister, pass, setPass, phone, setPhone } = useContext(AuthContext)
    const handleClickLogin = async (e) => {
        e.preventDefault()
        if (phone.length > 0 && pass.length > 0) {
            try {
                const response = await axios.post(`${process.env.REACT_APP_CALL_API}/api/v12/login`, { Phone: phone, Pass: pass });
                if (response.data.massege === 'Thanh cong') {
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
    }
    return (
        <div className={cx('Body_loginuser')}>
            <div className={cx('body_loginuser_left')}>
                <div className={cx('title')}>
                    <p>BBQ</p>
                    <p>GOGI</p>
                    <p>HOUSE</p>
                </div>
            </div>
            <div className={cx('Modal_login')}>
                {checkRegister ? (
                    <div className={cx('Modal_login_container')}>
                        <h1>Đăng ký</h1>
                        <div className={cx('Modal_login_input_list')}>
                            <input value={phone} onChange={(e) => setPhone(e.target.value)} type='number' placeholder='Số điện thoại' />
                            <button onClick={() => navigate('/login/OTPAuthen')}>Tiếp theo</button>
                        </div>
                        <div className={cx('Line_OR')}>
                            <span></span>
                            <span>HOẶC</span>
                            <span></span>
                        </div>
                        <div className={cx('Modal_login_socials')}>
                            <div className={cx('Modal_login_socials_left')}>
                                <img src={FacebookLogin} />
                                <span>Facebook</span>
                            </div>
                            <div className={cx('Modal_login_socials_right')}>
                                <img src={GoogleLogin1} />
                                <span>Google</span>
                            </div>
                        </div>
                        <div className={cx('Modal_login_btn_register')}>
                            Bạn đã có tài khoảng? <span onClick={() => setCheckRegister(false)}>Đăng nhập</span>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={(e) => handleClickLogin(e)} className={cx('Modal_login_container')}>
                        <h1>Đăng nhập</h1>
                        <div className={cx('Modal_login_input_list')}>
                            <input value={phone} onChange={(e) => setPhone(e.target.value)} type='number' placeholder='Số điện thoại' />
                            <input value={pass} onChange={(e) => setPass(e.target.value)} type='password' placeholder='Mật khẩu' />
                            <button type='submit' >Đăng nhập</button>
                        </div>
                        <div className={cx('Modal_login_help')}>
                            <span>Đăng nhập với SMS</span>
                        </div>
                        <div className={cx('Line_OR')}>
                            <span></span>
                            <span>HOẶC</span>
                            <span></span>
                        </div>
                        <div className={cx('Modal_login_socials')}>
                            <div className={cx('Modal_login_socials_left')}>
                                <img src={FacebookLogin} />
                                <span>Đăng nhập với facebook</span>
                            </div>
                            <div className={cx('Modal_login_socials_right')}>
                                <img src={GoogleLogin1} />
                                <span>Google</span>
                            </div>
                        </div>
                        <div className={cx('Modal_login_btn_register')}>
                            Bạn mới biết đến GOGI?<span onClick={() => setCheckRegister(true)}>Đăng ký</span>
                        </div>
                    </form>
                )}
            </div>

        </div>
    );
}

export default memo(App);