

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faTicket, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { faBell as faBellRegular, faClipboard as faClipboardRegular, faUser as faUserRegular } from '@fortawesome/free-regular-svg-icons';
import { createContext, useEffect, useState, useRef, memo, useCallback } from 'react'
import { infoUser } from "../DefaultLayout/Header/reduxBody/HeaderSelector"
import { Link, } from 'react-router-dom'
import { Navbar } from '../DefaultLayout/Header';
import { updateBill, getComment, resetComment, commentAction } from './reduxPurchase/PurchaseSlice'
import { listComment } from './reduxPurchase/PurchaseSelector'
import { useDispatch, useSelector } from 'react-redux';
import { Cookies } from 'react-cookie';
import Footer from '../DefaultLayout/Footer';
import classNames from "classnames/bind"
import styles from './Purchase.module.scss'
const cx = classNames.bind(styles)
export const ContextPurchase = createContext()
function Purchase({ Children }) {
    const dispatch = useDispatch()
    const cookies = new Cookies()
    const User = useSelector(infoUser)
    const comment = useSelector(listComment)
    const [socket, setSocket] = useState(null)
    const [IdBill, setIdBill] = useState(null)
    const [product, setProduct] = useState([])
    const modalComment = useRef()
    const containtCmt = useRef([])
    const checked = useRef([])
    const starCmt = useRef([])
    const getSocket = (socket) => {
        setSocket(socket)
    }
    const handleClickShowComment = useCallback((IdBill, data, token) => {
        modalComment.current.classList.add(cx('open'))
        setIdBill(IdBill)
        if (IdBill !== null) {
            const user = {
                IdBill,
                token
            }
            dispatch(getComment(user))
            setProduct(JSON.parse(data))
        }
    }, [])
    const handleClickRemoveCmt = () => {
        modalComment.current.classList.remove(cx('open'))
        setProduct()
        dispatch(resetComment())
    }
    const handleClickComment = (IdProduct, i) => {
        const Comment = {
            Containt: containtCmt.current[i].value ? containtCmt.current[i].value : " ",
            Star: starCmt.current[i],
            IdProduct: IdProduct,
            IdBill: IdBill,
            token: cookies.get('AccessToken'),
            i
        }
        dispatch(commentAction(Comment, i))
    }
    useEffect(() => {
        if (socket) {
            socket.on('repUpdateBill', (data) => {
                if (data.IdBill !== null) {
                    dispatch(updateBill([data.IdBill, data.Status]))
                }
            })
        }
    }, [socket])
    return (
        <div className={cx('body_purchase')}>
            <div className={cx('header_body_purchase')}>
                <Navbar getSocket={getSocket} />
                <div className={cx('header_body_purchase-grid')}>
                    <h1>Đơn mua</h1>
                </div>
            </div>
            <div className={cx('body_purchase_content')}>
                <div className={cx('body_purchase_content_container')}>
                    <div className={cx('body_purchase_content_container-item-info')}>
                        <div className={cx('body_purchase_content_container-item-info_header')}>
                            <div className={cx('body_purchase_content_container-item-info_header-img')}>
                                <img src={`${process.env.REACT_APP_CALL_API}/api/v12/avtuser/${User.Avt}`} />
                            </div>
                            <div className={cx('body_purchase_content_container-item-info_header-username')}>
                                <h3>{User.UserName}</h3>
                                <div className={cx('body_purchase_content_container-item-info_header-username_edit')}>
                                    <FontAwesomeIcon style={{height: '.7vw'}} icon={faPen} />
                                    <span>Sửa hồ sơ</span>
                                </div>
                            </div>
                        </div>
                        <ul className={cx('body_purchase_content_container-item-info_list')}>
                            <li>
                                <FontAwesomeIcon style={{ color: '#0046ab' }} icon={faUserRegular} />
                                <Link to='/user'>Tài Khoản Của Tôi</Link>
                            </li>
                            <li>
                                <FontAwesomeIcon style={{ color: '#0046ab' }} icon={faClipboardRegular} />
                                <Link to='/purchase'>Đơn Mua</Link>
                            </li>
                            <li>
                                <FontAwesomeIcon style={{ color: '#990000' }} icon={faBellRegular} />
                                <Link>Thông Báo</Link>
                            </li>
                            <li>
                                <FontAwesomeIcon style={{ color: '#990000' }} icon={faTicket} />
                                <Link>Kho Voucher</Link>
                            </li>
                        </ul>
                    </div>
                    <div className={cx('body_purchase_content_container-item-page')}>
                        <ContextPurchase.Provider value={{ handleClickShowComment }}>
                            {Children}
                        </ContextPurchase.Provider>
                    </div>
                    <div onClick={handleClickRemoveCmt} ref={modalComment} className={cx('modal_comment')}>
                        <div onClick={(e) => e.stopPropagation()} className={cx('comment_container')}>
                            <div className={cx('comment_container_header')}>
                                <FontAwesomeIcon style={{ height: '1vw' }} icon={faArrowLeft} />
                                <h2 style={{ marginBottom: '0' }}>Trở về</h2>
                            </div>
                            <div className={cx('comment_container_item')}>
                                {comment.length > 0 ? (
                                    (product.map((product, i) => (
                                        <div key={i}>
                                            <div className={cx('Purchase_content_body_container_body')} style={{ padding: '.2vw 1vw' }}>
                                                <div className={cx('Purchase_content_body_container_body-left')}>
                                                    <div className={cx('Purchase_content_body_container_body-left-img')}>
                                                        <img style={{ width: '90%', objectFit: 'cover' }} src={`${process.env.REACT_APP_CALL_API}/api/v12/showimgproduct/${product.Img}`} />
                                                    </div>
                                                    <div className={cx('Purchase_content_body_container_body-left-content')}>
                                                        <h3>{product.Name}</h3>
                                                        <h3 style={{ color: 'rgba(0, 0, 0, .54)' }}>Phân loại: {product.NameCate}</h3>
                                                        <h3 style={{ fontSize: '1vw' }}>x{product.sl}</h3>
                                                    </div>
                                                </div>
                                                <div className={cx('Purchase_content_body_container_body-right')}>
                                                    <h3>{product.Price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫'}</h3>
                                                </div>
                                            </div>
                                            <h2>Đánh giá sản phẩm</h2>
                                            {comment[i].Star !== null ? (
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
                                            )}
                                        </div>
                                    )))
                                ) : (null)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default memo(Purchase);