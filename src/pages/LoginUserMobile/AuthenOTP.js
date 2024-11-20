
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebookF } from '@fortawesome/free-brands-svg-icons';
import styles from './LoginUser.module.scss'
import classNames from "classnames/bind"
const cx = classNames.bind(styles)

function App() {
    return ( 
        <div className={cx('Modal_login_user')}>
                <form className={cx('otp-Form')}>
                    <span className={cx('mainHeading')}>Nhập mã OTP</span>
                    <p className={cx('otpSubheading')}>Mã OTP sẽ được gửi đến (84+) 832047271</p>
                    <div className={cx('inputContainer')}>
                        <input required="required" maxlength="1" type="text" className={cx('otp-input')} id="otp-input1"/>
                        <input required="required" maxlength="1" type="text" className={cx('otp-input')} id="otp-input2"/>
                        <input required="required" maxlength="1" type="text" className={cx('otp-input')} id="otp-input3"/>
                        <input required="required" maxlength="1" type="text" className={cx('otp-input')} id="otp-input4"/> 
                        <input required="required" maxlength="1" type="text" className={cx('otp-input')} id="otp-input4"/> 
                        <input required="required" maxlength="1" type="text" className={cx('otp-input')} id="otp-input4"/> 
                    </div>
                    <button className={cx('verifyButton')} type="submit">Verify</button>
                        <button className={cx('exitBtn')}>×</button>
                        <p className={cx('resendNote')}>Didn't receive the code? <button className={cx('resendBtn')}>Resend Code</button></p>
                </form>
        </div>
     );
}

export default App;