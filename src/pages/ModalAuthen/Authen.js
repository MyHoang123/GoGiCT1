
import { useEffect, useContext, useRef, useState, memo } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { faCircleCheck as faCircleCheckRegular } from '@fortawesome/free-regular-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../components/Layout/LoginLayout';
import { Cookies } from 'react-cookie'
import axios from 'axios';
import phoneMessege from '../../Asset/images/phonemessege.png'
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import classNames from "classnames/bind"
import styles from './ModalAuthen.module.scss'
const cx = classNames.bind(styles)

function OTPAuthen() {
    const navigate = useNavigate()
    const cookies = new Cookies()
    const [valueOTP, setValueOTP] = useState('') 
    const [token, setToken] = useState('') 
    const [user, setUser] = useState({}) 
    const [stepRegister, setStepRegister] = useState(1) 
    const [time, setTime] = useState(60)
    const [gender, setGender] = useState(null)
    // useRef
    const inputRef = useRef([])
    const lineStatus = useRef()
    const titleStatus = useRef([])
    const radiusStatus = useRef([])
    let timeout = useRef()
    const hightpass = useRef()
    const notiRegisterSuccess = useRef()
    const checkpassword = useRef([])
    const { pass, passn, setPass, setPassn, phone, setPhone } = useContext(AuthContext)
    const handleChangeInput = (i, e) => {
        if (inputRef.current[i].value.length > 0) {
            setValueOTP(prev => {
                return `${prev}${e.target.value}`
            })
            if (i < 6) {
                inputRef.current[i + 1].focus()
            }
        }
        else {
            setValueOTP(prev => {
                const newArr = prev.slice(0, i - 1) + prev.slice(i)
                return newArr
            })
            if (i > 1) {
                inputRef.current[i - 1].focus()
            }
        }
    }
    const handleClickVerifyOTPRegister = async (OTPsend, Phone) => {
        if (OTPsend.length === 6) {
            const OTPverify = {
                Phone: Phone,
                OTP: OTPsend
            }
            try {
                const response = await axios.post(`${process.env.REACT_APP_CALL_API}/api/v12/verifyregister`, OTPverify);
                console.log(response)
                if (response.data.massege === 'Thanh cong') {
                    setPhone(response.data.token)
                    setStepRegister(2)
                    lineStatus.current.style.width = '12vw'
                    radiusStatus.current[2].style.backgroundColor = '#2dc258'
                    radiusStatus.current[2].style.color = '#fff'
                    titleStatus.current[2].style.color = '#2dc258'
                }
                else if (response.data.massege === 'Ton tai') {
                    setStepRegister(4)
                    setUser(response.data.data)
                    setToken(response.data.token)
                }
                else {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Something went wrong!",
                        footer: '<a href="#">Why do I have this issue?</a>'
                      });
                }
            } catch (error) {
                alert('Đã có lõi xảy ra vui lòng thử lại')
            }
        }
        else {
            alert('Vui lòng nhập đủ OTP')
        }
    }
    const handleClickPassword = (e) => {
        const value = e.target.value
         const regexUpper = /^(?=.*[A-Z]).+$/;
         const regex = /^.{6,}$/;
         const isValidUpper = regexUpper.test(value);
         const isValid = regex.test(value);
         setPass(value)
         if(value.length === 0 ) {
            hightpass.current.style.width = '0%'
         }
        else if(value.length === 1 ) {
            hightpass.current.style.width = '10%'
            hightpass.current.style.backgroundColor = 'red'
         }
        else if(value.length === 2 ) {
            hightpass.current.style.width = '20%'
            hightpass.current.style.backgroundColor = 'rgb(219 179 0)'
         }
       else if(value.length === 3 ) {
            hightpass.current.style.width = '30%'
            hightpass.current.style.backgroundColor = 'rgb(219 179 0)'
         }
       else  if(value.length === 4 ) {
            hightpass.current.style.width = '40%'
            hightpass.current.style.backgroundColor = 'rgb(219 179 0)'
         }
       else  if(value.length === 5 ) {
            hightpass.current.style.width = '50%'
            hightpass.current.style.backgroundColor = 'rgb(219 179 0)'
         }
       else if(value.length === 6 ) {
            hightpass.current.style.width = '60%'
            hightpass.current.style.backgroundColor = 'rgb(219 179 0)'
         }
        else if(value.length === 7 ) {
            hightpass.current.style.width = '70%'
            hightpass.current.style.backgroundColor = 'rgb(219 179 0)'
         }
        else if(value.length === 9 ) {
            hightpass.current.style.width = '90%'
            hightpass.current.style.backgroundColor = '#32ae00'
         }
         else {
            hightpass.current.style.width = '100%'
            hightpass.current.style.backgroundColor = '#32ae00'
         }
         if(isValidUpper) {
            checkpassword.current[0].style.color = '#32ae00'
         }
         else {
            checkpassword.current[0].style.color = 'red'
         }
         if(isValid) {
            checkpassword.current[1].style.color = '#32ae00'
         }
         else {
            checkpassword.current[1].style.color = 'red'
         }
    }
    const handleClickRegister = async (Pass,Passn,Phone,Gender) => {
        if(Pass === Passn) {
            const regexUpper = /^(?=.*[A-Z]).+$/;
            const regex = /^.{6,}$/;
            const isValid = regex.test(Pass);
            const isValidUpper = regexUpper.test(Pass);
            if(isValid && isValidUpper && Gender !== null) {
                try {
                    const response = await axios.post(`${process.env.REACT_APP_CALL_API}/api/v12/updatepassregister`, {token: Phone,Pass: Pass, Gender:Gender});
                    if(response.data.massege === 'Thanh cong') {
                        setStepRegister(3)
                        lineStatus.current.style.width = '25vw'
                        radiusStatus.current[3].style.backgroundColor = '#2dc258'
                        radiusStatus.current[3].style.color = '#fff'
                        titleStatus.current[3].style.color = '#2dc258'
                    }
                    else {
                     alert('Đã có lõi xảy ra vui lòng thử lại')
                    }
                   } catch (error) {
                      console.error('Lỗi khi thêm sản phẩm:', error);
                   }
            }   
            else {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Vui lòng đúng định dạng !",
                    footer: '<a href="#">Why do I have this issue?</a>'
                  });
            }
        }
        else {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Nhập lại mật khẩu không đúng !",
                footer: '<a href="#">Why do I have this issue?</a>'
              });
        }
    }
    const handleClickLoginUser = (user,token) => {
        localStorage.setItem('Account',JSON.stringify(user))
        cookies.set('AccessToken', token, { path: '/', maxAge: 604800 }); // 604800 giây = 7 ngày
        navigate('/')
    }
    useEffect(() => {
        radiusStatus.current[1].style.backgroundColor = '#2dc258'
        radiusStatus.current[1].style.color = '#fff'
        titleStatus.current[1].style.color = '#2dc258'
        timeout.current = setInterval(() => {
            if (time > 0) {
                return setTime(time - 1)
            }
            else {
                return clearInterval(timeout.current)
            }
        }, 1000)
        return () => {
            clearInterval(timeout.current)
        }
    }, [time])
    return (
        <div className={cx('Modal_authen_OTP')}>
            <div className={cx('Modal_authen_OTP_header_step')}>
                <div className={cx('Modal_authen_OTP_header_step-item')}>
                    <div ref={e => radiusStatus.current[1] = e} className={cx('Modal_authen_OTP_header_step-item_radius')}>1</div>
                    <div ref={e => titleStatus.current[1] = e} className={cx('Modal_authen_OTP_header_step-item_title')}>Xác minh số điện thoại</div>
                </div>
                <div className={cx('Modal_authen_OTP_header_step-item')}>
                    <div ref={e => radiusStatus.current[2] = e} className={cx('Modal_authen_OTP_header_step-item_radius')}>2</div>
                    <div ref={e => titleStatus.current[2] = e} className={cx('Modal_authen_OTP_header_step-item_title')}>Tạo mật khẩu</div>
                </div>
                <div className={cx('Modal_authen_OTP_header_step-item')}>
                    <div ref={e => radiusStatus.current[3] = e} className={cx('Modal_authen_OTP_header_step-item_radius')}><FontAwesomeIcon icon={faCheck} /></div>
                    <div ref={e => titleStatus.current[3] = e} className={cx('Modal_authen_OTP_header_step-item_title')}>Hoàn thành</div>
                </div>
                <div className={cx('Modal_authen_OTP_header_step_line_box')}>
                    <div ref={lineStatus} className={cx('Modal_authen_OTP_header_step_line')}></div>
                    <div className={cx('Modal_authen_OTP_header_step_line1')}></div>
                </div>
            </div>
            <div className={cx('Modal_authen_OTP_container')}>
                {stepRegister === 1 ? (
                    <>
                        <div className={cx('Modal_authen_OTP_header')}>
                            <Link to='/login'>
                                <FontAwesomeIcon icon={faArrowLeft} />
                            </Link>
                            <h1>Nhập mã xác nhận</h1>
                        </div>
                        <div className={cx('Modal_authen_OTP_body')}>
                            <h2>Mã xác thực sẽ được gửi đến</h2>
                            <div className={cx('Modal_authen_OTP_body_phone')}>
                                <img src={phoneMessege} />
                                <h3>(+84)<span>{phone}</span></h3>
                            </div>
                        </div>
                        <div className={cx('box_OTP')}>
                            <input ref={e => inputRef.current[1] = e} onChange={(e) => handleChangeInput(1, e)} className={cx('input_OTP')} type="text" maxLength="1" />
                            <input ref={e => inputRef.current[2] = e} onChange={(e) => handleChangeInput(2, e)} className={cx('input_OTP')} type="text" maxLength="1" />
                            <input ref={e => inputRef.current[3] = e} onChange={(e) => handleChangeInput(3, e)} className={cx('input_OTP')} type="text" maxLength="1" />
                            <input ref={e => inputRef.current[4] = e} onChange={(e) => handleChangeInput(4, e)} className={cx('input_OTP')} type="text" maxLength="1" />
                            <input ref={e => inputRef.current[5] = e} onChange={(e) => handleChangeInput(5, e)} className={cx('input_OTP')} type="text" maxLength="1" />
                            <input ref={e => inputRef.current[6] = e} onChange={(e) => handleChangeInput(6, e)} className={cx('input_OTP')} type="text" maxLength="1" />
                        </div>
                        <div className={cx('OTP_time')}>Vui lòng chờ <span>{time}</span> giây để gửi lại</div>
                        <button onClick={() => handleClickVerifyOTPRegister(valueOTP, phone)}>Kế tiếp</button>
                    </>
                ) : (stepRegister === 2 ? (
                    <>
                        <div className={cx('Modal_authen_OTP_header')}>
                            <Link to='/login'>
                                <FontAwesomeIcon icon={faArrowLeft} />
                            </Link>
                            <h1>Nhập mật khẩu</h1>
                        </div>
                        <div className={cx('Modal_login_input_list')}>
                            <input onChange={(e) => handleClickPassword(e)} type='password' placeholder='Mật khẩu' />
                            <span ref={hightpass} className={cx('fake_pass')}></span>
                            <ul className={cx('noti_password')}>
                                <li ref={(e) => checkpassword.current[0] = e}>Chữ Hoa</li>
                                <li ref={(e) => checkpassword.current[1] = e}>6 Ký Tự</li>
                            </ul>
                            <input onChange={(e) => setPassn(e.target.value)} type='password' placeholder='Nhập lại mật khẩu' />
                            <div className={cx('Modal_gender_container')}>
                                <div className={cx('gender-card')}>
                                    <p className={cx('heading')}>Giới tính</p>
                                    <div className={cx('radio-wrapper')}>
                                        <input
                                            onChange={(e) => setGender(e.target.value)}
                                            className={cx('gender-radio-buttons')}
                                            id={cx('male')}
                                            value="1"
                                            name="gender"
                                            type="radio"
                                        />
                                        <label className={cx('genderlabel', 'malebutton')} htmlFor={cx('male')}>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 50 90"
                                                className={cx('malesmallsvg')}
                                            >
                                                <circle
                                                    strokeWidth="6"
                                                    stroke="#76E3FE"
                                                    r="22"
                                                    cy="25"
                                                    cx="25"
                                                ></circle>
                                                <path
                                                    strokeLinecap="round"
                                                    strokeWidth="6"
                                                    stroke="#76E3FE"
                                                    d="M25 47L25 87"
                                                ></path>
                                                <path
                                                    strokeLinecap="round"
                                                    strokeWidth="6"
                                                    stroke="#76E3FE"
                                                    d="M25 86.6958L38.6958 73"
                                                ></path>
                                                <path
                                                    strokeLinecap="round"
                                                    strokeWidth="6"
                                                    stroke="#76E3FE"
                                                    d="M11 73L24.6958 86.6958"
                                                ></path></svg>
                                            Male
                                        </label>
                                        <input
                                            className={cx('gender-radio-buttons')}
                                            id={cx('female')}
                                            value="2"
                                            name="gender"
                                            type="radio"
                                            onChange={(e) => setGender(e.target.value)}
                                        />
                                        <label className={cx('genderlabel', 'femalebutton')} htmlFor={cx('female')}>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 50 90"
                                                className={cx('smallsvg')}
                                            >
                                                <circle
                                                    strokeWidth="6"
                                                    stroke="#F57CB3"
                                                    r="22"
                                                    cy="25"
                                                    cx="25"
                                                ></circle>
                                                <path
                                                    strokeLinecap="round"
                                                    strokeWidth="6"
                                                    stroke="#F57CB3"
                                                    d="M25 47L25 87"
                                                ></path>
                                                <path
                                                    strokeLinecap="round"
                                                    strokeWidth="6"
                                                    stroke="#F57CB3"
                                                    d="M12 73H38"
                                                ></path></svg>
                                            Female
                                        </label>
                                        <input
                                            className={cx('gender-radio-buttons')}
                                            id={cx('other')}
                                            value="other"
                                            name="gender"
                                            type="radio"
                                            onChange={(e) => setGender(e.target.value)}
                                        />
                                        <label className={cx('genderlabel', 'otherbutton')} htmlFor={cx('other')}>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 78 75"
                                                className={cx('other-gender')}
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeWidth="6"
                                                    stroke="#9B4AED"
                                                    d="M73.4657 16.6983L48.2159 16.6984L19.9816 58.0001L2.99911 58"
                                                ></path>
                                                <path
                                                    strokeLinecap="round"
                                                    strokeWidth="6"
                                                    stroke="#9B4AED"
                                                    d="M73.1641 16.698L59.4705 2.99992"
                                                ></path>
                                                <path
                                                    strokeLinecap="round"
                                                    strokeWidth="6"
                                                    stroke="#9B4AED"
                                                    d="M59.4648 30.696L73.1629 17.0024"
                                                ></path>
                                                <path
                                                    strokeLinecap="round"
                                                    strokeWidth="6"
                                                    stroke="#9B4AED"
                                                    d="M74.022 57.8121L51.1697 57.8121L19.9997 16.9999L3 17"
                                                ></path>
                                                <path
                                                    strokeLinecap="round"
                                                    strokeWidth="6"
                                                    stroke="#9B4AED"
                                                    d="M73.748 57.8123L61.3547 71.51"
                                                ></path>
                                                <path
                                                    strokeLinecap="round"
                                                    strokeWidth="6"
                                                    stroke="#9B4AED"
                                                    d="M61.3496 43.8147L73.747 57.5079"
                                                ></path>
                                            </svg>
                                            Other
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => handleClickRegister(pass, passn, phone, gender)}>Hoàn thành</button>
                        </div>
                    </>
                ) : (stepRegister === 3 ? (
                    <div ref={notiRegisterSuccess} className={cx('Modal_authen_OTP_container_success')}>
                        <h1>Thành Công</h1>
                        <FontAwesomeIcon style={{ fontSize: '1vw', color: '#2dc258' }} icon={faCircleCheckRegular} />
                        <button><Link to='/'>Bất đầu mua sắm</Link></button>
                    </div>
                ) : (stepRegister === 4 ? (
                    <>
                        <div className={cx('Modal_authen_OTP_header')}>
                            <Link to='/login'>
                                <FontAwesomeIcon icon={faArrowLeft} />
                            </Link>
                            <h1>Bạn đã có tài khoản</h1>
                        </div>
                        <div className={cx('Modal_login_input_list')}>
                            <div className={cx('Info_user_container')}>
                                <img style={{ borderRadius: '50%' }} src={user.Classify === 'user' ? `${process.env.REACT_APP_CALL_API}/api/v12/avtuser/${user.Avt}` : `${user.Avt}`} className={cx('Img_user_login')} />
                                <h2 className={cx('Info_user_container_name')}>{user.UserName}</h2>
                                <h3 className={cx('Info_user_container_phone')}>(84+) {user.Sdt}</h3>
                                <button onClick={() => handleClickLoginUser(user, token)}>Đăng nhập</button>
                            </div>
                        </div>
                    </>
                ) : null
                )
                )
                )}
            </div>
        </div>
    );
}

export default memo(OTPAuthen);