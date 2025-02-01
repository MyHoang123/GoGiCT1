
import { useSelector, useDispatch } from "react-redux"
import { infoUser } from "../../components/Layout/DefaultLayout/Header/reduxBody/HeaderSelector"
import { updateAvt, updateInfo } from "../../components/Layout/DefaultLayout/Header/reduxBody/HeaderSlice"
import { memo, useRef, useState } from "react"
import { Cookies } from "react-cookie"
import classNames from "classnames/bind"
import styles from './User.module.scss'

const cx = classNames.bind(styles)
function User() {
    const dispatch = useDispatch()
    const [checkEdit, setCheckEdit] = useState(false)

    const InfoUser = useSelector(infoUser)
    const cookies = new Cookies()
    const fileRef = useRef()
    const PhoneRef = useRef()
    const UserNameRef = useRef()
    const BirthDayRef = useRef()
    const GmailRef = useRef()

    const handleClickOpenFile = () => {
        fileRef.current.click()
    }
    const handleUploadFile = (e) => {
        const updateFile = {
            file: e.target.files[0],
            token: cookies.get('AccessToken')
        }
        dispatch(updateAvt(updateFile))
    }
    const handleSubmitUpdateUser = (e) => {
        e.preventDefault()
        if(UserNameRef.current.value.length > 0 && PhoneRef.current.value.length > 0){
            const newUser = {
                UserName: UserNameRef.current.value,
                PhoneNumber: PhoneRef.current.value,
                Birthday: BirthDayRef.current.value,
                Email: GmailRef.current.value,
                token: cookies.get('AccessToken')
            }
            dispatch(updateInfo(newUser))
        }
    }
    return (
        <div className={cx('info_user')}>
            <div className={cx('info_user_container')}>
                <div className={cx('info_user_header')}>
                    <h2>Hồ sơ của tôi</h2>
                    <h3>Quản lý thông tin để bảo mật tài khoản</h3>
                </div>
                <div className={cx('info_user_body')}>
                    <div className={cx('info_user_body_containt')}>
                        <section className={cx('container')}>
                            <form onSubmit={(e) => handleSubmitUpdateUser(e)} className={cx('form')}>
                                <div className={cx('input-box')}>
                                    <label>Tên tài khoản</label>
                                    <label onClick={() => setCheckEdit(true)} style={{paddingLeft:'20px',fontSize:'.8vw',color:'#4080ee',cursor:'pointer'}}>Thay đổi</label>
                                    <input ref={UserNameRef} defaultValue={InfoUser.UserName} required="" placeholder="Enter full name" spellCheck={false} type="text" />
                                </div>
                                <div className={cx('column')}>
                                    <div className={cx('input-box')}>
                                        <label>Phone Number</label>
                                        <input ref={PhoneRef} defaultValue={InfoUser.Sdt} required="" placeholder="Enter phone number" type="telephone" />
                                    </div>
                                    <div className={cx('input-box')}>
                                        <label>Birth Date</label>
                                        <input defaultValue={InfoUser.Birthday} ref={BirthDayRef} placeholder="Enter birth date" type="date" />
                                    </div>
                                </div>
                                <div className={cx('input-box')}>
                                    <label>Email</label>
                                    <input ref={GmailRef} defaultValue={InfoUser.Email} required="" type="email" />
                                </div>
                                {checkEdit ? (
                                         <button type="submit">Lưu thông tin</button>
                                    ) : null}
                            </form>
                        </section>
                    </div>
                    <div className={cx('info_user_body_avt')}>
                        <div className={cx('info_user_body_avt_containt')}>
                            <div className={cx('card')}>
                                <div className={cx('card__img')}></div>
                                <div className={cx('card__avatar')}><img src={`${process.env.REACT_APP_CALL_API}/api/v12/avtuser/${InfoUser.Avt}`} /></div>
                                <div className={cx('card__title')}>{InfoUser.UserName}</div>
                                <div className={cx('card__subtitle')}>Thành viên bạc</div>
                                <div className={cx('card__wrapper')}>
                                    <button onClick={handleClickOpenFile} className={cx('card__btn')}>Chọn Ảnh</button>
                                    <input ref={fileRef} onChange={(e) => handleUploadFile(e)} style={{ display: 'none' }} type="file" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default memo(User);