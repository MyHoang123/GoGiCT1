import classNames from "classnames/bind"
import styles from './User.module.scss'
import axios from 'axios'
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import { Cookies } from 'react-cookie'
import { useContext, useRef, useState } from "react";
import { ContextPurchase } from "../../components/Layout/Purchase"
const cx = classNames.bind(styles)
function App() {
    const cookies = new Cookies()
    const [checkEdit, setCheckEdit] = useState(false)
    const [userName, setUserName] = useState(JSON.parse(localStorage.getItem('Account')) !== undefined ? JSON.parse(localStorage.getItem('Account')).UserName : '')
    const [Phone, setPhone] = useState(JSON.parse(localStorage.getItem('Account')) !== 0 ? JSON.parse(localStorage.getItem('Account')).Sdt : '')
    const [Mail, setMail] = useState(JSON.parse(localStorage.getItem('Account')) !== undefined ? JSON.parse(localStorage.getItem('Account')).Email : '')
    const [genDer, setGender] = useState(JSON.parse(localStorage.getItem('Account')) !== undefined ? JSON.parse(localStorage.getItem('Account')).Gender : 0)
    const [BirthDay, setBirthDay] = useState(JSON.parse(localStorage.getItem('Account')) !== undefined ? JSON.parse(localStorage.getItem('Account')).Birthday : '')
    const fileRef = useRef()
    const {Avt, setAvt} = useContext(ContextPurchase)
    //   // Gửi dữ liệu lên API Update
  async function updateUser(user) {  
    try {
      const response = await axios.put(`${process.env.REACT_APP_CALL_API}/api/v12/updateinfo`,user)
        if(response.data.massege === 'Thanh cong') {
            const useNew = {
                ...JSON.parse(localStorage.getItem('Account')),
                UserName: user.UserName,
                Sdt: user.PhoneNumber,
                Birthday: user.Birthday,
                Email: user.Email,
                Gender: user.Gender,
            }
            localStorage.setItem('Account',JSON.stringify(useNew))            
            setCheckEdit(false)
            Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Your work has been saved",
            showConfirmButton: false,
            timer: 1500
            });
        }
        else {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Email đã tồn tại !",
                footer: '<a href="#">Why do I have this issue?</a>'
              });
        }
    } catch (error) {
        alert('Có lõi xảy ra vui lòng thử lại !')
    }
  }
   // Gửi dữ liệu lên API
   async function updateAvt(file) {
    try {
        const formData = new FormData();
        formData.append('file', file.file, `${file.file.name}_avt`)
        const response = await axios.post(`${process.env.REACT_APP_CALL_API}/api/v12/updateavt`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': cookies.get('AccessToken')
              }
          });
        if(response.data.message === "Thanh cong"){
            const newAcc = {
                ...JSON.parse(localStorage.getItem('Account')),
                Avt: response.data.fileName
            }
            localStorage.setItem('Account',JSON.stringify(newAcc))
            setAvt(response.data.fileName)
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Your work has been saved",
                showConfirmButton: false,
                timer: 1500
              });
        }
    } catch (error) {
        console.error('Lỗi khi thêm sản phẩm:', error);
        // Xử lý lỗi tại đây.
    }

    }
  const handleSubmit = (e) => {
    e.preventDefault()
    const user = {
        UserName: userName,
        PhoneNumber: Phone,
        Email: Mail,
        Gender: genDer,
        Birthday: BirthDay,
        token: cookies.get('AccessToken')
    }
    updateUser(user)
  }
  const handleClickOpenFile = () => {
    fileRef.current.click()
  }
  const handleUploadFile = (e) => {
    const updateFile = {
        file: e.target.files[0],
    }
    updateAvt(updateFile)
}
    return ( 
        <div className={cx('info_user')}>
            <div className={cx('info_user_container')}>
                <div className={cx('info_user_header')}>
                    <h3>Hồ sơ của tôi</h3>
                    <h4>Quản lý thông tin để bảo mật tài khoản</h4>
                </div>
                <div className={cx('info_user_body')}>
                    <div className={cx('info_user_body_containt')}>
                                <section className={cx('container')}>
                                <form onSubmit={(e) => handleSubmit(e)} className={cx('form')}>
                                    <div className={cx('input-box')}>
                                        <label>Tên tài khoản</label>
                                        <label onClick={() => setCheckEdit(true)} style={{paddingLeft:'20px',fontSize:'10px',color:'#4080ee',cursor:'pointer'}}>Thay đổi</label>
                                        <input onChange={checkEdit ? (e) => setUserName(e.target.value) :() => setUserName(userName)} value={`${userName}`} required="" placeholder="Enter full name" spellCheck={false} type="text"/>
                                    </div>
                                    <div className={cx('column')}>
                                        <div className={cx('input-box')}>
                                            <label>Phone Number</label>
                                            <input onChange={checkEdit ? (e) => setPhone(e.target.value) : () => setPhone(Phone)} value={`${Phone}`}  required="" placeholder="Enter phone number" type="telephone"/>
                                        </div>
                                        <div className={cx('input-box')}>
                                            <label>Birth Date</label>
                                            <input  onChange={checkEdit ? (e) => setBirthDay(e.target.value) : () => setPhone(BirthDay)} value={`${BirthDay}`} placeholder="Enter birth date" type="date"/>
                                        </div>
                                    </div>
                                    <div className={cx('input-box')}>
                                        <label>Email</label>
                                        <input onChange={checkEdit ? (e) => setMail(e.target.value) : () => setMail(Mail)} required="" value={Mail !== null ? `${Mail}` : ''} type="email"/>
                                    </div>
                                    <div className={cx('gender-box')}>
                                        <label>Gender</label>
                                        <div className={cx('gender-option')}>
                                        <div className={cx('gender')}>
                                            <input onChange={() => setGender(1)} defaultChecked={genDer === 1 ? true : false}  name="gender" id="check-male" type="radio"/>
                                            <label htmlFor={cx('check-male')}>Male</label>
                                        </div>
                                        <div className={cx('gender')}>
                                            <input onChange={() => setGender(2)} defaultChecked={genDer === 2 ? true : false} name="gender" id="check-female" type="radio"/>
                                            <label htmlFor="check-female">Female</label>
                                        </div>
                                        <div className={cx('gender')}>
                                            <input onChange={() => setGender(3)} defaultChecked={genDer === 3 ? true : false} name="gender" id="check-other" type="radio"/>
                                            <label htmlFor="check-other">Prefer not to say</label>
                                        </div>
                                        </div>
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
                            <div className={cx('card__avatar')}><img src={JSON.parse(localStorage.getItem('Account')).Classify === 'user' ? `${process.env.REACT_APP_CALL_API}/api/v12/avtuser/${Avt}`: `${Avt}` }/></div>
                            <div className={cx('card__title')}>{userName}</div>
                            <div className={cx('card__subtitle')}>Thành viên bạc</div>
                            {JSON.parse(localStorage.getItem('Account')).Classify === 'user' ? (
                                <div className={cx('card__wrapper')}>
                                    <button onClick={handleClickOpenFile} className={cx('card__btn')}>Chọn Ảnh</button>
                                    <input onChange={(e) => handleUploadFile(e)} style={{display:'none'}} ref={fileRef} type="file"/>
                                </div>
                            ) : null}
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
     );
}

export default App;