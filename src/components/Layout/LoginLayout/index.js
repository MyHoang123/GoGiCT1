import logo from '../../../Asset/images/logo-gogi-house-X5 (1).png'
import { useNavigate } from 'react-router-dom'
import Footer from '../DefaultLayout/Footer'
import { useState, createContext, memo } from 'react'
import classNames from "classnames/bind"
import styles from './LoginLayout.module.scss'
export const AuthContext = createContext()
const cx = classNames.bind(styles)

function LoginLayout({ Children }) {

    const navigate = useNavigate()
    const [checkRegister, setCheckRegister] = useState(false)
    const [passn, setPassn] = useState('')
    const [pass, setPass] = useState('')
    const [phone, setPhone] = useState('')
    return (
        <>
            <header className={cx('Header_loginuser')}>
                <div className={cx('header_body_card')}>
                    <div className={cx('header_body_card-grid')}>
                        <div onClick={() => navigate('/')} className={cx('header_body_card-left')}>
                            <div className={cx('header_body_card-lef_content')}>
                                <div className={cx('header_body_card-left_item')}>
                                    <img src={logo} />
                                </div>
                                <div className={cx('header_body_card-left_item')}>
                                    {checkRegister ? (
                                        <h1>Đăng ký</h1>
                                    ) : (
                                        <h1>Đăng nhập</h1>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <AuthContext.Provider value={{ checkRegister, setCheckRegister, passn, pass, setPassn, setPass, phone, setPhone }}>
                {Children}
            </AuthContext.Provider>
            <Footer />
        </>
    );
}

export default memo(LoginLayout);