import axios from 'axios';
import { Cookies } from 'react-cookie'
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import { Link, useNavigate } from 'react-router-dom'
import React, { useState ,useEffect, useRef , useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTruckFast,faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { ContextPurchase } from "../../components/Layout/Purchase"
import BillNull from '../../Asset/images/5fafbb923393b712b964.png'
import classNames from "classnames/bind"
import styles from './Purchase.module.scss'
const cx = classNames.bind(styles)

function Purchase() {
    const cookie = new Cookies()
    const navigate = useNavigate()
    const { bills, setBills, setIdBill, setComment, setModalCmt, setProduct } = useContext(ContextPurchase)
    // State
    const [Active,setActive] = useState(0)
    const [AmountStatus, setAmountStatus] = useState([
        {dadat: 0},
        {chogiao: 0},
        {danggiao: 0},
        {dagiao: 0},
    ])
    async function showComment(User) {
        try {
           const response = await axios.post('http://localhost:8080/api/v12/showcommentuser', User)
           if(response.data.massege === 'Thanh cong') {
                setComment(response.data.data)
                setModalCmt(true)
            }
        } catch (error) {
            console.error('Lỗi khi thêm sản phẩm:', error);
            // Xử lý lỗi tại đây.
        }
    }
    const handleClickOpenCmt = (IdBill,data) => {
        if(IdBill !== null && data !== null) {
            setIdBill(IdBill)
            setProduct(JSON.parse(data))
            setModalCmt(true)
        }
    }
    const handleClickShowComment = (IdBill,data) => {
        if(IdBill !== null) {
            const product = JSON.parse(data).reduce((acc,curr) => {
                return [...acc,curr.Id]
            },[])
            setIdBill(IdBill)
            const user = {
                IdBill: IdBill,
                IdProduct: product,
                token: cookie.get('AccessToken')
            }
            setProduct(JSON.parse(data))
            showComment(user)
        }
    }
    // API
    useEffect(() => {
        if(cookie.get('AccessToken') !== undefined) {
            if(Active === 0) {
                axios.all([
                   axios.post('http://localhost:8080/api/v12/showbill',{token: cookie.get('AccessToken')}),
                  ])
                    .then(axios.spread((Bill, ) => {
                        setBills(Bill.data.data)
                        let dadat = 0
                        let chogiao = 0
                        let danggiao = 0
                        let dagiao = 0
                         for(let i = 0; i < Bill.data.data.length; i++) {
                           if(Bill.data.data[i].Status === 0) {
                               dadat = dadat + 1
                           }
                           else if (Bill.data.data[i].Status === 1) {
                             chogiao = chogiao + 1
                           }
                           else if (Bill.data.data[i].Status === 2) {
                             danggiao = danggiao + 1
                           }
                           else if (Bill.data.data[i].Status === 3) {
                                dagiao = dagiao + 1
                           }
                         }
                         const newAmount = [
                            {dadat: dadat},
                            {chogiao: chogiao},
                            {danggiao: danggiao},
                            {dagiao: dagiao},
                         ]
                         setAmountStatus(newAmount)
                    }))
                    .catch (err => {
                        console.error()
                    })
            }else if (Active === 1) {
                axios.all([
                    axios.post('http://localhost:8080/api/v12/showbilluser',{
                        token: cookie.get('AccessToken'),
                        Status: 0
                    }),
                    ])
                    .then(axios.spread((Bill, ) => {
                        setBills(Bill.data.data)
                    }))
                    .catch (err => {
                        console.error()
                    })
            }else if(Active === 2) {
                axios.all([
                    axios.post('http://localhost:8080/api/v12/showbilluser',{
                        token: cookie.get('AccessToken'),
                        Status: 1
                    }),
                    ])
                    .then(axios.spread((Bill, ) => {
                        setBills(Bill.data.data)
                    }))
                    .catch (err => {
                        console.error()
                    })
            }else if(Active === 3) {
                axios.all([
                    axios.post('http://localhost:8080/api/v12/showbilluser',{
                        token: cookie.get('AccessToken'),
                        Status: 2
                    }),
                    ])
                    .then(axios.spread((Bill, ) => {
                        setBills(Bill.data.data)
                    }))
                    .catch (err => {
                        console.error()
                    })
            }else if(Active === 4) {
                axios.all([
                    axios.post('http://localhost:8080/api/v12/showbilluser',{
                        token: cookie.get('AccessToken'),
                        Status: 3
                    }),
                    ])
                    .then(axios.spread((Bill, ) => {
                        setBills(Bill.data.data)
                    }))
                    .catch (err => {
                        console.error()
                    })
            }else {
                axios.all([
                    axios.post('http://localhost:8080/api/v12/showbilluser',{
                        token: cookie.get('AccessToken'),
                        Status: 4
                    }),
                    ])
                    .then(axios.spread((Bill, ) => {
                        setBills(Bill.data.data)
                    }))
                    .catch (err => {
                        console.error()
                    })
            }
    }
    },[Active])
    useEffect(() => {
        if(bills !== null) {
            let dadat = 0
            let chogiao = 0
            let danggiao = 0
            let dagiao = 0
            for(let i in bills) {
                if(bills[i].Status === 0) {
                    dadat = dadat + 1
                }
                else if (bills[i].Status === 1) {
                  chogiao = chogiao + 1
                }
                else if (bills[i].Status === 2) {
                  danggiao = danggiao + 1
                }
                else if (bills[i].Status === 3) {
                    dagiao = dagiao + 1
                }
            }
            const newAmount = [
                {dadat: dadat},
                {chogiao: chogiao},
                {danggiao: danggiao},
                {dagiao: dagiao},
             ]
             setAmountStatus(newAmount)
        }
    },[bills])
        return ( 
            <>
                <div className={cx('Purchase_content')}>
                    <ul className={cx('Purchase_content_header')}>
                        <li onClick={() => setActive(0)} className={Active === 0 ? cx('active') : null }>Tất cả</li>
                        <li onClick={() => setActive(1)} className={Active === 1 ? cx('active') : null }>Chờ xác nhận 
                            {AmountStatus[0].dadat !== 0 ? (
                                <span className={cx('Purchase_content_header_noti')}>{AmountStatus[0].dadat}</span>
                            ) : null} 
                            </li>
                        <li onClick={() => setActive(2)} className={Active === 2 ? cx('active') : null }>Chờ giao hàng
                        {AmountStatus[1].chogiao !== 0 ? (
                                <span className={cx('Purchase_content_header_noti')}>{AmountStatus[1].chogiao}</span>
                            ) : null} 
                            </li>
                        <li onClick={() => setActive(3)} className={Active === 3 ? cx('active') : null }>Đang giao
                        {AmountStatus[2].danggiao !== 0 ? (
                                <span className={cx('Purchase_content_header_noti')}>{AmountStatus[2].danggiao}</span>
                            ) : null} 
                            </li>
                        <li onClick={() => setActive(4)} className={Active === 4 ? cx('active') : null }>Hoàng thành
                        {AmountStatus[3].dagiao !== 0 ? (
                                <span className={cx('Purchase_content_header_noti')}>{AmountStatus[3].dagiao}</span>
                            ) : null} 
                        </li>
                        <li onClick={() => setActive(5)} className={Active === 5 ? cx('active') : null }>Đã hủy</li>
                    </ul>
                    {bills === undefined ? (
                        <div className={cx('Bill_null_container')}>
                            <div className={cx('Bill_null_content')}>
                                <img src={BillNull}/>
                                <h2>Chưa có đơn hàng</h2>
                            </div>
                        </div>
                    ) : (
                        (bills.map((bill,i) => (
                            <div key={i} className={cx('Purchase_content_body')}>                        
                                <div className={cx('Purchase_content_body_container')}>
                                    <div className={cx('Purchase_content_body_container_header')}>
                                        <div className={cx('Purchase_content_body_container_header-item')}>
                                            <div className={cx('Purchase_content_body_container_header-item_status')}>
                                                {bill.Status === 0 ? (
                                                    <>
                                                       <FontAwesomeIcon style={{color:'rgb(255 203 94)'}} icon={faTruckFast} />
                                                       <span style={{color:' rgb(255 203 94)'}}>Chờ quán xác nhận</span> 
                                                       </>                                                                                             
                                                ) : (bill.Status === 1 ? (
                                                    <>
                                                    <FontAwesomeIcon style={{marginRight:'8px'}} icon={faTruckFast} />
                                                    <span>Chờ giao hàng</span> 
                                                    </>
                                                ) : (
                                                    bill.Status === 2 ? (
                                                        <>
                                                        <FontAwesomeIcon style={{marginRight:'8px'}} icon={faTruckFast} />
                                                        <span>Đang giao hàng</span> 
                                                        </>
                                                    ) : bill.Status === 3 ? (
                                                        <>
                                                        <FontAwesomeIcon style={{marginRight:'8px'}} icon={faTruckFast} />
                                                        <span>Hoàng thành</span> 
                                                        </>
                                                    ) : bill.Status === 4 ? (
                                                        <>
                                                        <FontAwesomeIcon style={{marginRight:'8px'}} icon={faTruckFast} />
                                                        <span>Đã đánh giá</span> 
                                                        </>
                                                    ) : (
                                                        <>
                                                        <FontAwesomeIcon style={{marginRight:'8px'}} icon={faTruckFast} />
                                                        <span>Đã hủy</span> 
                                                        </>
                                                    )
                                                )
                                                )}

                                            </div>
                                            {bill.Comment === 1 ? (
                                                <span className={cx('Purchase_content_body_container_header-item_comment')}>Hoàng Thành</span>
    
                                            ) : (
                                                <Link to={`/purchase/${bill.Id}`} className={cx('Purchase_content_body_container_header-item_comment')}>Xem chi tiết</Link>
                                            )}
                                        </div>
                                    </div>
                                    {JSON.parse(bill.Data).map((product,i) => (
                                        <div key={i} className={cx('Purchase_content_body_container_body')}>
                                            <div className={cx('Purchase_content_body_container_body-left')}>
                                                <div className={cx('Purchase_content_body_container_body-left-img')}>
                                                    <img style={{width:'100%',objectFit:'cover'}} src={`http://localhost:8080/api/v12/showimgproduct/${product.Img}`}/>
                                                </div>
                                                <div className={cx('Purchase_content_body_container_body-left-content')}>
                                                    <h3>{product.Name}</h3>
                                                    <h3 style={{color: 'rgba(0, 0, 0, .54)',fontSize:'12px'}}>Phân loại: Thịt bò</h3>
                                                    <h3 style={{fontSize:'14px', marginBottom:'0'}}>x{product.sl}</h3>
                                                </div>
                                            </div>
                                            <div className={cx('Purchase_content_body_container_body-right')}>
                                                <h3>{product.Price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫'}</h3>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className={cx('Purchase_content_body_footer')}>
                                    <div className={cx('Purchase_content_body_footer-totalpay')}>
                                        <div className={cx('Purchase_content_body_footer-totalpay_container')}>
                                            <div className={cx('Purchase_content_body_footer-totalpay_container-text')}>
                                                <svg width="25" height="16" viewBox="0 0 253 263" fill="none" xmlns="http://www.w3.org/2000/svg"><title>Shopee Guarantee</title><path fillRule="evenodd" clipRule="evenodd" d="M126.5 0.389801C126.5 0.389801 82.61 27.8998 5.75 26.8598C5.08763 26.8507 4.43006 26.9733 3.81548 27.2205C3.20091 27.4677 2.64159 27.8346 2.17 28.2998C1.69998 28.7657 1.32713 29.3203 1.07307 29.9314C0.819019 30.5425 0.688805 31.198 0.689995 31.8598V106.97C0.687073 131.07 6.77532 154.78 18.3892 175.898C30.003 197.015 46.7657 214.855 67.12 227.76L118.47 260.28C120.872 261.802 123.657 262.61 126.5 262.61C129.343 262.61 132.128 261.802 134.53 260.28L185.88 227.73C206.234 214.825 222.997 196.985 234.611 175.868C246.225 154.75 252.313 131.04 252.31 106.94V31.8598C252.31 31.1973 252.178 30.5414 251.922 29.9303C251.667 29.3191 251.292 28.7649 250.82 28.2998C250.35 27.8358 249.792 27.4696 249.179 27.2225C248.566 26.9753 247.911 26.852 247.25 26.8598C170.39 27.8998 126.5 0.389801 126.5 0.389801Z" fill="#990009"></path><path fillRule="evenodd" clipRule="evenodd" d="M207.7 149.66L119.61 107.03C116.386 105.472 113.914 102.697 112.736 99.3154C111.558 95.9342 111.772 92.2235 113.33 88.9998C114.888 85.7761 117.663 83.3034 121.044 82.1257C124.426 80.948 128.136 81.1617 131.36 82.7198L215.43 123.38C215.7 120.38 215.85 117.38 215.85 114.31V61.0298C215.848 60.5592 215.753 60.0936 215.57 59.6598C215.393 59.2232 215.128 58.8281 214.79 58.4998C214.457 58.1705 214.063 57.909 213.63 57.7298C213.194 57.5576 212.729 57.4727 212.26 57.4798C157.69 58.2298 126.5 38.6798 126.5 38.6798C126.5 38.6798 95.31 58.2298 40.71 57.4798C40.2401 57.4732 39.7735 57.5602 39.3376 57.7357C38.9017 57.9113 38.5051 58.1719 38.1709 58.5023C37.8367 58.8328 37.5717 59.2264 37.3913 59.6604C37.2108 60.0943 37.1186 60.5599 37.12 61.0298V108.03L118.84 147.57C121.591 148.902 123.808 151.128 125.129 153.884C126.45 156.64 126.797 159.762 126.113 162.741C125.429 165.72 123.755 168.378 121.363 170.282C118.972 172.185 116.006 173.221 112.95 173.22C110.919 173.221 108.915 172.76 107.09 171.87L40.24 139.48C46.6407 164.573 62.3785 186.277 84.24 200.16L124.49 225.7C125.061 226.053 125.719 226.24 126.39 226.24C127.061 226.24 127.719 226.053 128.29 225.7L168.57 200.16C187.187 188.399 201.464 170.892 209.24 150.29C208.715 150.11 208.2 149.9 207.7 149.66Z" fill="#fff"></path></svg>
                                                <h3 style={{fontSize:'14px'}}>Thành tiền:</h3>
                                            </div>
                                            <div className={cx('Purchase_content_body_footer-totalpay_container-price')}>
                                                <h2>{bill.TotalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫'}</h2>
                                            </div>
                                        </div>
                                        <div className={cx('Purchase_content_body_footer-totalpay_status')}>
                                            {bill.StatusPay === 0 ? (
                                                <span>Thanh toán khi nhận hàng</span>
                                            ) : (
                                                bill.StatusPay === 1 ? (<span>Đã thanh toán</span>) : (<span>Chờ thanh toán</span>)
                                            )}
                                        </div>
                                    </div>
                                    <div className={cx('Purchase_content_body_footer-button')}>
                                        <div className={cx('Purchase_content_body_footer-button-left')}>
                                            <h3>Chờ bạn đánh giá</h3>
                                        </div>
                                        <div className={cx('Purchase_content_body_footer-button-right')}>
                                            {bill.Status === 3 ? (
                                                    <button onClick={() => handleClickOpenCmt(bill.Id,bill.Data)} className={cx('active')}>Đánh giá</button>
                                            ) : (
                                                (bill.Status === 4 ? (
                                                    <>
                                                        <button className={cx('active')}>Mua lại</button>
                                                        <button onClick={() => handleClickShowComment(bill.Id,bill.Data)}>Xem đánh giá</button>
                                                    </>
                                                ) : (
                                                    // <button className={cx('active')}>Đánh giá</button>
                                                    null
                                                ))
                                            )}
                                            <button>Liên Hệ Người Bán</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )))
                    )}
                </div>
                {/* <div onClick={() => handleClickRemoveCmt()} style={modalCmt ? {display:'flex'} : {display:'none'}} className={cx('modal_comment')}>
                    <div onClick={(e) => e.stopPropagation()} className={cx('comment_container')}>
                        <div className={cx('comment_container_header')}>
                             <FontAwesomeIcon style={{height:'15px'}} icon={faArrowLeft} />
                             <h2 style={{marginBottom:'0'}}>Trở về</h2>
                        </div>
                        <div className={cx('comment_container_item')}>
                            {product.map((product,i) => (
                                            <div key={i}>
                                            <div className={cx('Purchase_content_body_container_body')} style={{padding:'2px 10px'}}>
                                                <div className={cx('Purchase_content_body_container_body-left')}>
                                                    <div className={cx('Purchase_content_body_container_body-left-img')}>
                                                        <img style={{width:'90%',objectFit:'cover'}} src={`http://localhost:8080/api/v12/showimgproduct/${product.Img}`}/>
                                                    </div>
                                                    <div className={cx('Purchase_content_body_container_body-left-content')}>
                                                        <h3>{product.Name}</h3>
                                                        <h3 style={{color: 'rgba(0, 0, 0, .54)'}}>Phân loại: Thịt bò</h3>
                                                        <h3 style={{fontSize:'14px'}}>x{product.sl}</h3>
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
                                                            <input ref={e => checked.current[1+(i*5)] = e} onChange={() => starCmt.current[i] = 5} type="radio" id={`star${0+(i*5)}`} />
                                                            <label htmlFor={`star${0+(i*5)}`}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path pathLength="360" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path></svg>
                                                            </label>
                                                            <input ref={e => checked.current[2 + (i*5)] = e} onChange={() => starCmt.current[i] = 4} type="radio" id={`star${1+(i*5)}`} />
                                                            <label htmlFor={`star${1+(i*5)}`}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path pathLength="360" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path></svg>
                                                            </label>
                                                            <input ref={e => checked.current[3 + (i*5)] = e} onChange={() => starCmt.current[i] = 3} type="radio" id={`star${2+(i*5)}`} />
                                                            <label htmlFor={`star${2+(i*5)}`}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path pathLength="360" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path></svg>
                                                            </label>
                                                            <input ref={e => checked.current[4 + (i*5)] = e} onChange={() => starCmt.current[i] = 2} type="radio" id={`star${3+(i*5)}`} />
                                                            <label htmlFor={`star${3+(i*5)}`}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path pathLength="360" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path></svg>
                                                            </label>
                                                            <input ref={e => checked.current[5 + (i*5)] = e} onChange={() => starCmt.current[i] = 1} type="radio" id={`star${4+(i*5)}`} />
                                                            <label htmlFor={`star-${4+(i*5)}`}>
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
                </div> */}
            </>
         );
}

export default Purchase;