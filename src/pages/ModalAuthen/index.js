import axios from 'axios';
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import { useNavigate } from 'react-router-dom'
import { Cookies } from 'react-cookie'
import { AuthContext } from '../../components/Layout/LoginUser';
import FacebookLogin from '../../Asset/images/facebooklogin.png'
import GoogleLogin1 from '../../Asset/images/gogilogin.png'
import { LoginSocialFacebook } from 'reactjs-social-login';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import classNames from "classnames/bind"
import styles from './ModalAuthen.module.scss'
import { useCallback, useMemo, useState, useContext } from 'react'
const cx = classNames.bind(styles)

function App() {
    const navigate = useNavigate()
    const cookies = new Cookies()
    const [checkOTP,setCheckOTP] = useState(false)
    // UseContext
    const {checkRegister, setCheckRegister, pass, setPass, phone, setPhone  } = useContext(AuthContext)
    // Gửi dữ liệu lên API
    async function chekcLogin(Account) {
        try {
         const response = await axios.post('https://severgogi.onrender.com/api/v12/checkuser', Account);
         if(response.data.massege === 'Thanh cong') {
            localStorage.setItem('Account',JSON.stringify(response.data.data))
            cookies.set('AccessToken', response.data.token, { path: '/', maxAge: 604800 }); // 604800 giây = 7 ngày
            navigate('/')
           }
        } catch (error) {
          console.error('Lỗi khi thêm sản phẩm:', error);
          // Xử lý lỗi tại đây.
        }
      }
    const checkBtnSuccess = useMemo(() => {
        if(checkOTP) {
            if(phone.length > 0) {
                return true
            }
            else {
                return false
            }
        }
        else if (checkRegister) {
            if(phone.length > 0){
                return true
            }
            else {
                return false
            }
        }
        else {
            if(phone.length > 0 && pass.length > 0) {
                return true
            }
            else {
                return false
            }
        }
    },[phone,pass])
    const handleClickSendOTP = useCallback( async (phone) => {
        if(phone.length === 10) {
            try {
                axios.post('https://severgogi.onrender.com/api/v12/sendotp', {Phone: phone});
                navigate('/loginuser/authenotp')
              } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Có lõi xảy ra vui lòng thử lại !",
                    footer: '<a href="#">Why do I have this issue?</a>'
                  });
              }
        }
        else {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Vui lòng nhập đúng số điện thoại !",
                footer: '<a href="#">Why do I have this issue?</a>'
              });
        }
    },[])
    const handleClickSendOTPRegister = useCallback( async (phone) => {
        if(phone.length === 10) {
            try {
                axios.post('https://severgogi.onrender.com/api/v12/sendotpregister', {Phone: phone});
                navigate('/loginuser/authenotp')
              } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Có lõi xảy ra vui lòng thử lại !",
                    footer: '<a href="#">Why do I have this issue?</a>'
                  });
              }
        }
        else {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Vui lòng nhập đúng số điện thoại !",
                footer: '<a href="#">Why do I have this issue?</a>'
              });
        }
    },[])
    const handleClickLogin = useCallback( async (Phone,Pass) => {
        if(Phone.length > 0 && Pass.length > 0) {
            try {
               const response = await axios.post('https://severgogi.onrender.com/api/v12/login', {Phone: Phone,Pass:Pass});
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
        <div className={cx('Body_loginuser')}>
        <div className={cx('body_loginuser_left')}>
            <div className={cx('title')}>
                <p>BBQ</p>
                <p style={{marginTop: '20px'}}>GOGI</p>
                <p style={{marginLeft: '13%', marginTop: '20px'}}>HOUSE</p>
            </div>
        </div>
        <div className={cx('Modal_login')}>
            {checkRegister ? (
                                        <div className={cx('Modal_login_container')}>
                                        <h1>Đăng ký</h1>
                                        <div style={{marginBottom:'10px'}} className={cx('Modal_login_input_list')}>
                                            <input value={phone} onChange={(e) => setPhone(e.target.value)} type='number' placeholder='Số điện thoại'/>
                                            <button onClick={() => handleClickSendOTPRegister(phone)} style={checkBtnSuccess ? {cursor:'pointer',backgroundColor:'#990000'} : {cursor:'not-allowed',backgroundColor:'#ae5050'}}>Tiếp theo</button>
                                        </div>
                                        <div className={cx('Line_OR')}>
                                            <span></span>
                                            <span>HOẶC</span>
                                            <span></span>
                                        </div>
                                        <div className={cx('Modal_login_socials')}>
                                            <div className={cx('Modal_login_socials_left')}>
                                                 <img src={FacebookLogin}/>
                                                 <span>Facebook</span>
                                            </div>
                                            <div className={cx('Modal_login_socials_right')}>
                                                <img src={GoogleLogin1}/>
                                                <span>Google</span>
                                            </div>
                                        </div>
                                            <div className={cx('Modal_login_btn_register')}>
                                                Bạn đã có tài khoảng? <span onClick={() => setCheckRegister(false)}>Đăng nhập</span> 
                                            </div>              
                                    </div>
                                    ) : (
                                        <div className={cx('Modal_login_container')}>
                                        <h1>Đăng nhập</h1>
                                        <div className={cx('Modal_login_input_list')}>
                                            <input value={phone} onChange={(e) => setPhone(e.target.value)} type='number' placeholder='Số điện thoại'/>
                                            {checkOTP ? null : (
                                                <input value={pass} onChange={(e) => setPass(e.target.value)} type='password' placeholder='Mật khẩu'/>
                                            )}
                                            {checkOTP ? (
                                                <button onClick={() => handleClickSendOTP(phone)} style={checkBtnSuccess ? {cursor:'pointer',backgroundColor:'#990000'} : {cursor:'not-allowed',backgroundColor:'#ae5050'}}>Kế tiếp</button>
                                                ) : (
                                                <button onClick={() => handleClickLogin(phone,pass)} style={checkBtnSuccess ? {cursor:'pointer',backgroundColor:'#990000'} : {cursor:'not-allowed',backgroundColor:'#ae5050'}}>Đăng nhập</button>
                                            )}
                                        </div>
                                        <div className={cx('Modal_login_help')}>
                                            <span></span>
                                            {checkOTP ? (
                                                 <span onClick={() => setCheckOTP(false)}>Đăng nhập với mật khẩu</span>
                                            ) : (
                                                 <span onClick={() => setCheckOTP(true)}>Đăng nhập với SMS</span>
                                            )}
                                        </div>
                                        <div className={cx('Line_OR')}>
                                            <span></span>
                                            <span>HOẶC</span>
                                            <span></span>
                                        </div>
                                        <div className={cx('Modal_login_socials')}>
                                                 <LoginSocialFacebook
                                                    className={cx('Modal_login_socials_left')}
                                                    appId="1849390372235152"
                                                    onResolve={(res) => {
                                                        const account = {
                                                            UserName: res.data.name,
                                                            Email: res.data.email,
                                                            Avt: res.data.picture.data.url
                                                        } 
                                                        chekcLogin(account)
                                                    }}
                                                    >
                                                 <img src={FacebookLogin}/>
                                                 <span>Đăng nhập với facebook</span>
                                                        {/* <FacebookLoginButton  style={{fontSize: '12px'}} className={cx('auth-form_socials-span')} /> */}
                                                    </LoginSocialFacebook>
                                            <GoogleLogin
                                            className={cx('Modal_login_socials_right')}
                                                            onSuccess={(response) => {
                                                                const decode = jwtDecode(response.credential)
                                                                const account = {
                                                                    UserName: decode.name,
                                                                    Avt: decode.picture,
                                                                    Email: decode.email ,
                                                                }
                                                                chekcLogin(account)
                                                            }}
                                                            onError={() => {
                                                                console.log('Login fail')
                                                            }}
                                                        
                                                        >
                                                    {/* <img src={GoogleLogin1}/>
                                                    <span>Google</span> */}
                                                        </GoogleLogin>
                                        </div>
                                            <div className={cx('Modal_login_btn_register')}>
                                                Bạn mới biết đến GOGI? <span onClick={() => setCheckRegister(true)}>Đăng ký</span> 
                                            </div>
                               </div>
            )}


        </div>
        
    </div>
     );
}

export default App;