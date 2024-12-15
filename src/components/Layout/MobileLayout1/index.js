import axios from 'axios'
import io from 'socket.io-client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft  } from '@fortawesome/free-solid-svg-icons'
import { Cookies } from 'react-cookie'
import { useState, createContext, useEffect,useRef } from "react";
import classNames from "classnames/bind"
import styles from './Mobile.module.scss'
export  const MobileContext = createContext()
const cx = classNames.bind(styles)
function AppMobile( {Children} ) {
    const cookies = new Cookies()
    const [checkRegister,setCheckRegister]=useState(false)
    const [Amount, setAmount] = useState(0)
    const [socket, setSocket] = useState(null)
    const [modalCmt,setModalCmt] = useState(false)
    const [product,setProduct] = useState([])
    const [bills, setBills] = useState([])
    const [IdBill,setIdBill] = useState(null)
    const [comment,setComment] = useState([])
    const [billUpdate, setBillUpdate] = useState(null)
    const containtCmt = useRef([])
    const starCmt = useRef([])
    const checked = useRef([])
    const modalHello = useRef()
    async function createComment(comment) {
        try {
           const response = await axios.post('https://severgogi.onrender.com/api/v12/createcomment', comment)
           if(response.data.massege === 'Thanh cong') {
            const newArr = [...bills]
            for(let i in newArr) {
                if(newArr[i].Id === comment.IdBill) {
                    newArr[i].Status = 4
                    setBills(newArr)
                }
            }
            delete comment.token
            setComment(prev => [...prev,comment])
           }
        } catch (error) {
            console.error('Lỗi khi thêm sản phẩm:', error);
        }
    }
    const handleClickComment = (IdProduct,i) => {
        const Comment = {
            Containt: containtCmt.current[i].value ? containtCmt.current[i].value : " ",
            Star: starCmt.current[i],
            IdProduct: IdProduct,
            IdBill: IdBill,
            token: cookies.get('AccessToken')
        }
        createComment(Comment)
    }
    const handleClickOpenCmtDetai = (IdBill) => {
        if(IdBill !== null) {
            const newArr = bills.find((bill) => bill.Id === IdBill)
            if(newArr.Data !== undefined && newArr.Status === 3) {
                setIdBill(IdBill)
                setProduct(JSON.parse(newArr.Data))
                setModalCmt(true)
            }
        }
    }
    const handleClickStart = () => {
        modalHello.current.classList.add('open')
    }
    const handleClickRemoveCmt = () => {
        if(containtCmt.current.length > 0) {
            for(let i = 0 ; i < product.length; i++){
                starCmt.current = []
                containtCmt.current[i].value = ''
            }
            containtCmt.current = []
        }
            for(let i = 1; i <= product.length * 5; i++) {
                if(checked.current[i] !== null) {
                    checked.current[i].checked = false
                }
            }
        setModalCmt(false)
        setComment([])
    }
    useEffect(() => {
        if(cookies.get('AccessToken') !== undefined) {
            axios.all([
                axios.post('https://severgogi.onrender.com/api/v12/showlengthcard',{token: cookies.get('AccessToken')}),
              ])
                .then(axios.spread((lengthCard) => {
                        setAmount(lengthCard.data.data)
                }))
                .catch (err => {
                    console.error()
                })
        }     
    },[])
    useEffect(() => {
        if(cookies.get('AccessToken') !== undefined) {
           const newSocket = io('https://severgogi.onrender.com',{
            auth: {
                token: cookies.get('AccessToken')
            }
           });
           setSocket(newSocket)
           return () => {
            newSocket.disconnect()
        }
        }
    },[])
    useEffect(() =>{
        if(socket) {
            socket.on('repUpdateBill',(data) => {
                if(data.IdBill !== null && bills !==  undefined) {
                    const newArr = [...bills]
                    for(let i in newArr) {
                        if(newArr[i].Id === data.IdBill) {
                        newArr[i].Status = data.Status
                        }
                    }
                        setBills(newArr)
                        setBillUpdate(data)
                    }
                })
        }
    },[socket,bills])
    return ( 
        <MobileContext.Provider value={{billUpdate,socket,cookies,Amount,handleClickOpenCmtDetai,setAmount,setCheckRegister,checkRegister,setComment, setProduct,bills,setBills, setIdBill, setProduct, setModalCmt}}>
        <div className="mobile">
            <div ref={modalHello} className='Modal_hellogogi'>
            <div className='Modale_content'>
            <h1>Gogi sizzling delight, igniting tradition masterfully.</h1>
            <p>The best grain, the finest roast, the powerful flavor.</p>
            <button onClick={handleClickStart} className='button_pay_mobile'>Get Started</button>
            </div>
            </div>
            </div>
                <div onClick={() => handleClickRemoveCmt()} style={modalCmt ? {display:'flex'} : {display:'none'}}  className={cx('modal_comment')}>
                    <div onClick={(e) => e.stopPropagation()} className={cx('comment_container')}>
                        <div className={cx('comment_container_header')}>
                            <FontAwesomeIcon style={{height:'15px'}} icon={faArrowLeft} />
                            <h2 style={{marginBottom:'0'}}>Trở về</h2>
                        </div>
                        <div className={cx('comment_container_item')}>
                            {product.map((product,i) => (
                                            <div className={cx('Purchase_content_container')} key={i}>
                                            <div className={cx('Purchase_content_body_container_body')}>
                                                <div className={cx('Purchase_content_body_container_body-left')}>
                                                    <div className={cx('Purchase_content_body_container_body-left-img')}>
                                                        <img src={`https://severgogi.onrender.com/api/v12/showimgproduct/${product.Img}`}/>
                                                    </div>
                                                    <div className={cx('Purchase_content_body_container_body-left-content')}>
                                                        <h3>{product.Name}</h3>
                                                        <h3 style={{color: 'rgba(0, 0, 0, .54)'}}>Phân loại: {product.NameCate}</h3>
                                                        <h3 style={{fontSize:'11px'}}>x{product.sl}</h3>
                                                    </div>
                                                </div>
                                                <div className={cx('Purchase_content_body_container_body-right')}>
                                                    <h3>{product.Price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫'}</h3>
                                                </div>
                                            </div>
                                            <h2>Đánh giá sản phẩm</h2>
                            {comment[i] !== undefined ? (
                                <div className={cx('comment_container_star')}>
                                        <div  className={cx('rating')}>
                                            <span></span>
                                                <input ref={null} type="radio" id={`star-1${0+(i*5)}`} name={`star-1radio-${i}`} defaultChecked = {comment[i].Star === 5 ? true : false} disabled  />
                                                <label htmlFor={`star-1${0+(i*5)}`}>
                                                    <svg style={{cursor:'default'}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path pathLength="360" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path></svg>
                                                </label>
                                                <input ref={null} type="radio" id={`star-1${1+(i*5)}`} name={`star-1radio-${i}`} defaultChecked = {comment[i].Star === 4 ? true : false} disabled  />
                                                <label htmlFor={`star-1${1+(i*5)}`}>
                                                    <svg style={{cursor:'default'}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path pathLength="360" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path></svg>
                                                </label>
                                                <input ref={null} type="radio" id={`star-1${2+(i*5)}`} name={`star-1radio-${i}`} defaultChecked = {comment[i].Star === 3 ? true : false} disabled   />
                                                <label htmlFor={`star-1${2+(i*5)}`}>
                                                    <svg style={{cursor:'default'}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path pathLength="360" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path></svg>
                                                </label>
                                                <input ref={null} type="radio" id={`star-1${3+(i*5)}`} name={`star-1radio-${i}`} defaultChecked = {comment[i].Star === 2 ? true : false} disabled   />
                                                <label htmlFor={`star-1${3+(i*5)}`}>
                                                    <svg style={{cursor:'default'}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path pathLength="360" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path></svg>
                                                </label>
                                                <input ref={null} type="radio" id={`star-1${4+(i*5)}`} name={`star-1radio-${i}`} defaultChecked = {comment[i].Star === 1 ? true : false} disabled   />
                                                <label htmlFor={`star-1${4+(i*5)}`}>
                                                    <svg style={{cursor:'default'}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path pathLength="360" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path></svg>
                                                </label>
                                    </div>
                                        <div className={cx('text_comment')}>
                                        <p style={{color:'#333',border:'1px solid #333'}} ref={e => containtCmt.current[i] = e} className={cx('comment-input')}>{comment[i].Containt}</p>
                                    </div>
                                    </div>                                   
                                ) : (
                                    <div className={cx('comment_container_star')}>
                                    <div className={cx('rating')}>
                                            <input ref={e => checked.current[1+(i*5)] = e} onChange={() => starCmt.current[i] = 5} type="radio" name={`star-${i}`} id={`star${0+(i*5)}`} />
                                            <label htmlFor={`star${0+(i*5)}`}>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path pathLength="360" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path></svg>
                                            </label>
                                            <input ref={e => checked.current[2 + (i*5)] = e} onChange={() => starCmt.current[i] = 4} type="radio" name={`star-${i}`} id={`star${1+(i*5)}`} />
                                            <label htmlFor={`star${1+(i*5)}`}>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path pathLength="360" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path></svg>
                                            </label>
                                            <input ref={e => checked.current[3 + (i*5)] = e} onChange={() => starCmt.current[i] = 3} type="radio" name={`star-${i}`} id={`star${2+(i*5)}`} />
                                            <label htmlFor={`star${2+(i*5)}`}>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path pathLength="360" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path></svg>
                                            </label>
                                            <input ref={e => checked.current[4 + (i*5)] = e} onChange={() => starCmt.current[i] = 2} type="radio" name={`star-${i}`} id={`star${3+(i*5)}`} />
                                            <label htmlFor={`star${3+(i*5)}`}>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path pathLength="360" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path></svg>
                                            </label>
                                            <input ref={e => checked.current[5 + (i*5)] = e} onChange={() => starCmt.current[i] = 1} type="radio" name={`star-${i}`} id={`star${4+(i*5)}`} />
                                            <label htmlFor={`star${4+(i*5)}`}>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path pathLength="360" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path></svg>
                                            </label>
                                        </div>
                                        <div className={cx('text_comment')}>
                                            <textarea ref={e => containtCmt.current[i] = e} className={cx('comment-input')} spellCheck={false} placeholder="Nhập bình luận và đánh giá của bạn..."></textarea>
                                        </div>
                                        <div onClick={() => handleClickComment(product.Id,i)} className={cx('button_submit-comment')}>
                                            <button className={cx('comic-button')}>Đánh Giá</button>
                                        </div>
                                    </div>
                                )}
                            
                            </div>
                ))}
        </div>
                    </div>
                </div>
                {Children}
        </MobileContext.Provider>
     );
}

export default AppMobile;