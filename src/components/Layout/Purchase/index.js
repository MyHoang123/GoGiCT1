
import axios from 'axios'
import io from 'socket.io-client'
import { Cookies } from 'react-cookie'
import Footer from '../DefaultLayout/Footer'
import { createContext, useEffect, useState, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faTicket, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { faBell as faBellRegular, faClipboard as faClipboardRegular, faUser as faUserRegular } from '@fortawesome/free-regular-svg-icons';
import logo from '../../../Asset/images/logo-gogi-house-X5 (1).png'
import classNames from "classnames/bind"
import styles from './Purchase.module.scss'
export const ContextPurchase = createContext()
const cx = classNames.bind(styles)
function Purchase({ Children }) {
    const cookie = new Cookies()
    const [Avt, setAvt] = useState(cookie.get('AccessToken') !== undefined ? JSON.parse(localStorage.getItem('Account')).Avt : "")
    const [Active, setActive] = useState(null)
    const [bills, setBills] = useState([])
    const [socket, setSocket] = useState(null)
    const [IdBill, setIdBill] = useState(null)
    const [product, setProduct] = useState([])
    const [modalCmt, setModalCmt] = useState(false)
    const [comment, setComment] = useState([])
    const [billUpdate, setBillUpdate] = useState(null)
    const navigate = useNavigate()
    const location = useLocation()
    const containtCmt = useRef([])
    const starCmt = useRef([])
    const checked = useRef([])

    async function createComment(Comment, i) {
        try {
            const response = await axios.post(`${process.env.REACT_APP_CALL_API}/api/v12/createcomment`, Comment)
            if (response.data.massege === 'Thanh cong') {
                const newArr = [...bills]
                for (let i in newArr) {
                    if (newArr[i].Id === comment.IdBill) {
                        newArr[i].Status = 4
                        setBills(newArr)
                    }
                }
                setBillUpdate({ IdBill: Comment.IdBill, Status: 4 })
                delete Comment.IdBill
                delete Comment.token
                const newComment = [...comment]
                newComment[i] = Comment
                setComment(newComment)
            }
        } catch (error) {
            console.error('Lỗi khi thêm sản phẩm:', error);
            // Xử lý lỗi tại đây.
        }
    }
    async function showComment(User) {
        try {
            const response = await axios.post(`${process.env.REACT_APP_CALL_API}/api/v12/showcommentuser`, User)
            if (response.data.massege === 'Thanh cong') {
                setComment(response.data.data)
                setModalCmt(true)
            }
        } catch (error) {
            console.error('Lỗi khi thêm sản phẩm:', error);
            // Xử lý lỗi tại đây.
        }
    }
    const handleClickShowComment = (IdBill, data) => {
        if (IdBill !== null) {
            setIdBill(IdBill)
            const user = {
                IdBill: IdBill,
                token: cookie.get('AccessToken')
            }
            setProduct(JSON.parse(data))
            showComment(user)
        }
    }
    const handleClickLogOut = () => {
        socket.disconnect();
        localStorage.removeItem('Account')
        cookie.remove('AccessToken', { path: '/' })
        navigate('/')
    }
    // Funtion
    const handleClickComment = (IdProduct, i) => {
        const Comment = {
            Containt: containtCmt.current[i].value ? containtCmt.current[i].value : " ",
            Star: starCmt.current[i],
            IdProduct: IdProduct,
            IdBill: IdBill,
            token: cookie.get('AccessToken')
        }
        createComment(Comment, i)
    }
    const handleClickRemoveCmt = () => {
        setModalCmt(false)
        setComment([])
    }
    const handleClickOpenCmtDetai = (IdBill) => {
        if (IdBill !== null) {
            const newArr = bills.find((bill) => bill.Id === IdBill)
            if (newArr.Data !== undefined && newArr.Status === 3) {
                setIdBill(IdBill)
                setProduct(JSON.parse(newArr.Data))
                setModalCmt(true)
            }
        }
    }
    useEffect(() => {
        if (cookie.get('AccessToken') === undefined) {
            navigate('/')
        } else {
            const newSocket = io(`${process.env.REACT_APP_CALL_API}`, {
                auth: {
                    token: cookie.get('AccessToken')
                }
            })
            setSocket(newSocket)
            const urlSegments = location.pathname.split('/')
            const userSegment = urlSegments[urlSegments.length - 1]
            if (userSegment === 'user') {
                setActive(0)
            } else if (userSegment === 'purchase') {
                setActive(1)
            }
            return () => {
                newSocket.off('repUpdateBill')
                newSocket.disconnect()
            }
        }
    }, [])
    useEffect(() => {
        if (socket) {
            socket.on('repUpdateBill', (data) => {
                if (data.IdBill !== null && bills !== undefined) {
                    const newArr = [...bills]
                    for (let i in newArr) {
                        if (newArr[i].Id === data.IdBill) {
                            newArr[i].Status = data.Status
                        }
                    }
                    setBills(newArr)
                    setBillUpdate(data)
                }
            })
        }
    }, [socket, bills])
    if (cookie.get('AccessToken') !== undefined) {
        return (
            <>
                <div className={cx('content')}>
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
                                            <Link to='/user' onClick={() => setActive(0)}>Tài khoản của tôi</Link>
                                        </li>
                                        <li style={{ padding: '0' }} className={cx('header_navbar-user-item')}>
                                            <Link to='/purchase' onClick={() => setActive(1)}>Đơn mua </Link>
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
                    <div className={cx('body_purchase')}>
                        <div className={cx('header_body_purchase')}>
                            <div className={cx('header_body_purchase-grid')}>
                                <div onClick={() => navigate('/')} className={cx('header_body_purchase-left')}>
                                    <div className={cx('header_body_purchase-lef_content')}>
                                        <div className={cx('header_body_purchase-left_item')}>
                                            <img src={logo} />
                                        </div>
                                        <div className={cx('header_body_purchase-left_item')}>
                                            <h1>Đơn mua</h1>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={cx('body_purchase_content')}>
                            <div className={cx('body_purchase_content_container')}>
                                <div className={cx('body_purchase_content_container-item-info')}>
                                    <div className={cx('body_purchase_content_container-item-info_header')}>
                                        <div className={cx('body_purchase_content_container-item-info_header-img')}>
                                            <img src={JSON.parse(localStorage.getItem('Account')).Classify === 'user' ? `${process.env.REACT_APP_CALL_API}/api/v12/avtuser/${JSON.parse(localStorage.getItem('Account')).Avt}` : `${JSON.parse(localStorage.getItem('Account')).Avt}`} />
                                        </div>
                                        <div className={cx('body_purchase_content_container-item-info_header-username')}>
                                            <h3>{JSON.parse(localStorage.getItem('Account')).UserName}</h3>
                                            <div className={cx('body_purchase_content_container-item-info_header-username_edit')}>
                                                <FontAwesomeIcon icon={faPen} />
                                                <span style={{ marginLeft: '8px' }}>Sửa hồ sơ</span>
                                            </div>
                                        </div>
                                    </div>
                                    <ul className={cx('body_purchase_content_container-item-info_list')}>
                                        <li>
                                            <FontAwesomeIcon style={{ color: '#0046ab' }} icon={faUserRegular} />
                                            <Link onClick={() => setActive(0)} className={Active === 0 ? cx('active') : null} to='/user'>Tài Khoản Của Tôi</Link>
                                        </li>
                                        <li>
                                            <FontAwesomeIcon style={{ color: '#0046ab' }} icon={faClipboardRegular} />
                                            <Link onClick={() => setActive(1)} className={Active === 1 ? cx('active') : null} to='/purchase'>Đơn Mua</Link>
                                        </li>
                                        <li>
                                            <FontAwesomeIcon style={{ color: '#990000' }} icon={faBellRegular} />
                                            <Link onClick={() => setActive(2)} className={Active === 2 ? cx('active') : null}>Thông Báo</Link>
                                        </li>
                                        <li>
                                            <FontAwesomeIcon style={{ color: '#990000' }} icon={faTicket} />
                                            <Link onClick={() => setActive(3)} className={Active === 3 ? cx('active') : null}>Kho Voucher</Link>
                                        </li>
                                    </ul>
                                </div>
                                <div className={cx('body_purchase_content_container-item-page')}>
                                    <ContextPurchase.Provider value={{ handleClickOpenCmtDetai, setComment, setProduct, Avt, setAvt, socket, billUpdate, bills, setBills, setIdBill, setProduct, setModalCmt, handleClickShowComment }}>
                                        {Children}
                                    </ContextPurchase.Provider>
                                </div>
                                <div onClick={() => handleClickRemoveCmt()} style={modalCmt ? { display: 'flex' } : { display: 'none' }} className={cx('modal_comment')}>
                                    <div onClick={(e) => e.stopPropagation()} className={cx('comment_container')}>
                                        <div className={cx('comment_container_header')}>
                                            <FontAwesomeIcon style={{ height: '15px' }} icon={faArrowLeft} />
                                            <h2 style={{ marginBottom: '0' }}>Trở về</h2>
                                        </div>
                                        <div className={cx('comment_container_item')}>
                                            {product.map((product, i) => (
                                                <div key={i}>
                                                    <div className={cx('Purchase_content_body_container_body')} style={{ padding: '2px 10px' }}>
                                                        <div className={cx('Purchase_content_body_container_body-left')}>
                                                            <div className={cx('Purchase_content_body_container_body-left-img')}>
                                                                <img style={{ width: '90%', objectFit: 'cover' }} src={`${process.env.REACT_APP_CALL_API}/api/v12/showimgproduct/${product.Img}`} />
                                                            </div>
                                                            <div className={cx('Purchase_content_body_container_body-left-content')}>
                                                                <h3>{product.Name}</h3>
                                                                <h3 style={{ color: 'rgba(0, 0, 0, .54)' }}>Phân loại: {product.NameCate}</h3>
                                                                <h3 style={{ fontSize: '14px' }}>x{product.sl}</h3>
                                                            </div>
                                                        </div>
                                                        <div className={cx('Purchase_content_body_container_body-right')}>
                                                            <h3>{product.Price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫'}</h3>
                                                        </div>
                                                    </div>
                                                    <h2>Đánh giá sản phẩm</h2>
                                                    {comment.length > 0 ? (
                                                        (comment[i].Star !== null ? (
                                                            <div className={cx('comment_container_star')}>
                                                                <div className={cx('rating')}>
                                                                    <span></span>
                                                                    <input ref={null} type="radio" id={`star-1${0 + (i * 5)}`} name={`star-1radio-${i}`} defaultChecked={comment[i].Star === 5 ? true : false} disabled />
                                                                    <label htmlFor={`star-1${0 + (i * 5)}`}>
                                                                        <svg style={{ cursor: 'default' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path pathLength="360" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path></svg>
                                                                    </label>
                                                                    <input ref={null} type="radio" id={`star-1${1 + (i * 5)}`} name={`star-1radio-${i}`} defaultChecked={comment[i].Star === 4 ? true : false} disabled />
                                                                    <label htmlFor={`star-1${1 + (i * 5)}`}>
                                                                        <svg style={{ cursor: 'default' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path pathLength="360" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path></svg>
                                                                    </label>
                                                                    <input ref={null} type="radio" id={`star-1${2 + (i * 5)}`} name={`star-1radio-${i}`} defaultChecked={comment[i].Star === 3 ? true : false} disabled />
                                                                    <label htmlFor={`star-1${2 + (i * 5)}`}>
                                                                        <svg style={{ cursor: 'default' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path pathLength="360" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path></svg>
                                                                    </label>
                                                                    <input ref={null} type="radio" id={`star-1${3 + (i * 5)}`} name={`star-1radio-${i}`} defaultChecked={comment[i].Star === 2 ? true : false} disabled />
                                                                    <label htmlFor={`star-1${3 + (i * 5)}`}>
                                                                        <svg style={{ cursor: 'default' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path pathLength="360" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path></svg>
                                                                    </label>
                                                                    <input ref={null} type="radio" id={`star-1${4 + (i * 5)}`} name={`star-1radio-${i}`} defaultChecked={comment[i].Star === 1 ? true : false} disabled />
                                                                    <label htmlFor={`star-1${4 + (i * 5)}`}>
                                                                        <svg style={{ cursor: 'default' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path pathLength="360" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path></svg>
                                                                    </label>
                                                                </div>
                                                                <div className={cx('text_comment')}>
                                                                    <p style={{ color: '#333', border: '1px solid #333' }} ref={e => containtCmt.current[i] = e} className={cx('comment-input')}>{comment[i].Containt}</p>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className={cx('comment_container_star')}>
                                                                <div className={cx('rating')}>
                                                                    <input ref={e => checked.current[1 + (i * 5)] = e} onChange={() => starCmt.current[i] = 5} type="radio" name={`star-${i}`} id={`star${0 + (i * 5)}`} />
                                                                    <label htmlFor={`star${0 + (i * 5)}`}>
                                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path pathLength="360" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path></svg>
                                                                    </label>
                                                                    <input ref={e => checked.current[2 + (i * 5)] = e} onChange={() => starCmt.current[i] = 4} type="radio" name={`star-${i}`} id={`star${1 + (i * 5)}`} />
                                                                    <label htmlFor={`star${1 + (i * 5)}`}>
                                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path pathLength="360" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path></svg>
                                                                    </label>
                                                                    <input ref={e => checked.current[3 + (i * 5)] = e} onChange={() => starCmt.current[i] = 3} type="radio" name={`star-${i}`} id={`star${2 + (i * 5)}`} />
                                                                    <label htmlFor={`star${2 + (i * 5)}`}>
                                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path pathLength="360" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path></svg>
                                                                    </label>
                                                                    <input ref={e => checked.current[4 + (i * 5)] = e} onChange={() => starCmt.current[i] = 2} type="radio" name={`star-${i}`} id={`star${3 + (i * 5)}`} />
                                                                    <label htmlFor={`star${3 + (i * 5)}`}>
                                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path pathLength="360" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path></svg>
                                                                    </label>
                                                                    <input ref={e => checked.current[5 + (i * 5)] = e} onChange={() => starCmt.current[i] = 1} type="radio" name={`star-${i}`} id={`star${4 + (i * 5)}`} />
                                                                    <label htmlFor={`star${4 + (i * 5)}`}>
                                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path pathLength="360" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path></svg>
                                                                    </label>
                                                                </div>
                                                                <div className={cx('text_comment')}>
                                                                    <textarea ref={e => containtCmt.current[i] = e} className={cx('comment-input')} spellCheck={false} placeholder="Nhập bình luận và đánh giá của bạn..."></textarea>
                                                                </div>
                                                                <div onClick={() => handleClickComment(product.Id, i)} className={cx('button_submit-comment')}>
                                                                    <button className={cx('comic-button')}>Đánh Giá</button>
                                                                </div>
                                                            </div>
                                                        )))
                                                        : null}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={cx('footer')}>
                    <Footer />
                </div>
            </>
        );
    }
}

export default Purchase;