import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Cookies } from 'react-cookie'
import {faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { faClipboard as faClipboardRegular , faStar as faStarRerular} from '@fortawesome/free-regular-svg-icons'; 
import {Link, useParams} from 'react-router-dom';
import classNames from "classnames/bind"
import styles from './Detail.module.scss'
import { useContext, useEffect, useRef, useState } from 'react';
import { ContextPurchase } from "../../components/Layout/Purchase"
import Map from './map'
const cx = classNames.bind(styles)

function App() {
    const { IdBill } = useParams()
    const [bill,setBill] = useState([])
    const cookie = new Cookies()
    // Ref
    const Line = useRef()
    const LastItemRef = useRef()
    // 
    const { billUpdate, handleClickShowComment } = useContext(ContextPurchase)
// API
    // Gửi dữ liệu lên API
    async function CheckPayStatus(IdPay) {
        try {
        const response =  await axios.post('https://severgogi.onrender.com/api/v12/CheckPayOrder', {app_trans_id:IdPay});
        console.log(response)
        if(response.data.result.return_code === 1) {
            const newArr = [...bill]
            newArr.StatusPay = 1
            setBill(newArr)
        }else {
            const newArr = [...bill]
            newArr.StatusPay = 2
            setBill(newArr)
        }
        } catch (error) {
          console.error('Lỗi khi thêm sản phẩm:', error);
          // Xử lý lỗi tại đây.
        }
      }
useEffect(() => {
    if(cookie.get('AccessToken') !== undefined) {	
        if(billUpdate !== null && bill.length !== 0) {
            const newArr = [...bill]
            newArr[0].Status = billUpdate.Status
            setBill(newArr)
            Line.current.style.width = billUpdate.Status === 1 ? '20%' : billUpdate.Status === 2 ? '40%' : billUpdate.Status === 3 ? '60%' : billUpdate.Status === 4 ? '80%' : bill.Status === 5 ? '0%' : null
            if(billUpdate.Status === 3){
                LastItemRef.current.style.cursor = 'pointer'
            }
            else if(billUpdate.Status === 4) {
                LastItemRef.current.style.cursor = 'auto'
                LastItemRef.current.classList.add(cx('open'))
            }
        }
    }
  },[billUpdate])
useEffect(() => {
    if(cookie.get('AccessToken') !== undefined) {
        axios.all([
          axios.post('https://severgogi.onrender.com/api/v12/getbill',{
            IdBill: IdBill,
            token: cookie.get('AccessToken')
          }),
        ])
          .then(axios.spread((Bill) => {
            if(Bill.data.data[0].PayMent.length > 0 && Bill.data.data[0].StatusPay !== 1 ) {
                CheckPayStatus(Bill.data.data[0].PayMent)
            }
            setBill(Bill.data.data)
            if(Bill.data.data[0].Status === 0 ) {
                Line.current.style.width = '0'
            }else if(Bill.data.data[0].Status === 1) {
                Line.current.style.width = '20%'
            }else if(Bill.data.data[0].Status === 2) {
                Line.current.style.width = '40%'
            }else if (Bill.data.data[0].Status === 3){
                Line.current.style.width = '60%'
                LastItemRef.current.style.cursor = 'pointer'
            }else if (Bill.data.data[0].Status === 4){
                Line.current.style.width = '80%'
                LastItemRef.current.style.cursor = 'pointer'
                LastItemRef.current.classList.add(cx('open'))
            }else if (Bill.data.data[0].Status === 5){
                Line.current.style.width = '0%'
                LastItemRef.current.style.cursor = 'pointer'
            }
          }))
          .catch (err => {
              console.error()
          })
    }else {
        alert('Có lõi xảy ra vui lòng thử lại sau')
    }
  }, [])

    return (  
        <div className={cx('show_detail_bill')}>
            <div className={cx('show_detail_bill_header')}>
                <Link to='/purchase' className={cx('show_detail_bill_header-left')}>
                    <FontAwesomeIcon icon={faChevronLeft} />
                    <span style={{marginBottom:'0'}}>Trở lại</span>
                </Link>
                <div className={cx('show_detail_bill_header-right')}>
                    <div className={cx('show_detail_bill_header-right_idbill')}>
                        <h2 style={{marginBottom:'0'}}>Mã Đơn Hàng: </h2>
                        {bill.length > 0 ? (
                            <strong style={{marginBottom:'0'}}>{bill[0].Id}KTPM0120</strong>
                        ) : null}
                    </div>
                    {bill.length > 0 ? (
                        <div className={cx('show_detail_bill_header-right_status')}>
                            {bill[0].Status === 0 ? (
                                <h3 style={{marginBottom:'0', color:'#990000'}}>Chờ xác nhận</h3>
                            ) : (
                                bill[0].Status === 1 ? (
                                    <h3 style={{marginBottom:'0', color:'#990000'}}>Chờ giao hàng</h3>
                                ) : (
                                    bill[0].Status === 2 ? (
                                    <h3 style={{marginBottom:'0', color:'#990000'}}>Đang giao</h3>
                                    ) : (
                                        bill[0].Status === 3 ? (
                                               <h3 style={{marginBottom:'0', color:'#990000'}}>Đã Nhận</h3>
                                        ) : (
                                            bill[0].Status === 4 ? (<h3 style={{marginBottom:'0', color:'#990000'}}>Đánh giá</h3>) : (<h3 style={{marginBottom:'0', color:'#990000'}}>Đã hủy</h3>)
                                        )
                                    )
                                )
                            )}
                        </div>
                    ) : null}
                </div>
            </div>
            <div className={cx('show_detail_bill_body')}>
                <div className={cx('show_detail_bill_body_status')}>
                    <div className={cx('show_detail_bill_body_status-item')}>
                        <div className={cx('show_detail_bill_body_status-item-icon-1')}>
                            <FontAwesomeIcon style={{width:'30px',height:'26px',color:'#2dc258'}} icon={faClipboardRegular} />
                        </div>
                        <div className={cx('show_detail_bill_body_status-item_title')}>
                            <h2 style={{marginBottom:'0'}}>Đơn Hàng Đã Đặt</h2>
                            <h3 style={{textAlign:'center',color: 'rgba(0, 0, 0, .26)',marginBottom:'0'}}>{bill.length > 0 ? bill[0].DateOnly : null}</h3>
                        </div>
                    </div>
                    <div className={cx('show_detail_bill_body_status-item')}>
                        <div className={cx('show_detail_bill_body_status-item-cook')}>
                            <div className={cx('loader')}>
                            <div className={cx('panWrapper')}>
                                <div className={cx('pan')}>
                                <div className={cx('food')}></div>
                                <div className={cx('panBase')}></div>
                                <div className={cx('panHandle')}></div>
                                </div>
                            </div>
                            </div>
                        </div>
                        <div className={cx('show_detail_bill_body_status-item_title')}>
                            <h2>Chờ Chế Biến</h2>
                            <h3 style={{textAlign:'center',color: 'rgba(0, 0, 0, .26)'}}>{bill.length > 0 ? bill[0].DateOnly : null}</h3>
                        </div>
                    </div>
                    <div className={cx('show_detail_bill_body_status-item')}>
                        <div className={cx('show_detail_bill_body_status-item-car')}>
                        <div className={cx('loader')}>
                            <div className={cx('truckWrapper')}>
                                <div className={cx('truckBody')}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 198 93"
                                    className={cx('trucksvg')}
                                >
                                    <path
                                    strokeWidth="3"
                                    stroke="#282828"
                                    fill="#F83D3D"
                                    d="M135 22.5H177.264C178.295 22.5 179.22 23.133 179.594 24.0939L192.33 56.8443C192.442 57.1332 192.5 57.4404 192.5 57.7504V89C192.5 90.3807 191.381 91.5 190 91.5H135C133.619 91.5 132.5 90.3807 132.5 89V25C132.5 23.6193 133.619 22.5 135 22.5Z"
                                    ></path>
                                    <path
                                    strokeWidth="3"
                                    stroke="#282828"
                                    fill="#7D7C7C"
                                    d="M146 33.5H181.741C182.779 33.5 183.709 34.1415 184.078 35.112L190.538 52.112C191.16 53.748 189.951 55.5 188.201 55.5H146C144.619 55.5 143.5 54.3807 143.5 53V36C143.5 34.6193 144.619 33.5 146 33.5Z"
                                    ></path>
                                    <path
                                    strokeWidth="2"
                                    stroke="#282828"
                                    fill="#282828"
                                    d="M150 65C150 65.39 149.763 65.8656 149.127 66.2893C148.499 66.7083 147.573 67 146.5 67C145.427 67 144.501 66.7083 143.873 66.2893C143.237 65.8656 143 65.39 143 65C143 64.61 143.237 64.1344 143.873 63.7107C144.501 63.2917 145.427 63 146.5 63C147.573 63 148.499 63.2917 149.127 63.7107C149.763 64.1344 150 64.61 150 65Z"
                                    ></path>
                                    <rect
                                    strokeWidth="2"
                                    stroke="#282828"
                                    fill="#FFFCAB"
                                    rx="1"
                                    height="7"
                                    width="5"
                                    y="63"
                                    x="187"
                                    ></rect>
                                    <rect
                                    strokeWidth="2"
                                    stroke="#282828"
                                    fill="#282828"
                                    rx="1"
                                    height="11"
                                    width="4"
                                    y="81"
                                    x="193"
                                    ></rect>
                                    <rect
                                    strokeWidth="3"
                                    stroke="#282828"
                                    fill="#DFDFDF"
                                    rx="2.5"
                                    height="90"
                                    width="121"
                                    y="1.5"
                                    x="6.5"
                                    ></rect>
                                    <rect
                                    strokeWidth="2"
                                    stroke="#282828"
                                    fill="#DFDFDF"
                                    rx="2"
                                    height="4"
                                    width="6"
                                    y="84"
                                    x="1"
                                    ></rect>
                                </svg>
                                </div>
                                <div className={cx('truckTires')}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 30 30"
                                    className={cx('tiresvg')}
                                >
                                    <circle
                                    strokeWidth="3"
                                    stroke="#282828"
                                    fill="#282828"
                                    r="13.5"
                                    cy="15"
                                    cx="15"
                                    ></circle>
                                    <circle fill="#DFDFDF" r="7" cy="15" cx="15"></circle>
                                </svg>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 30 30"
                                    className={cx('tiresvg')}
                                >
                                    <circle
                                    strokeWidth="3"
                                    stroke="#282828"
                                    fill="#282828"
                                    r="13.5"
                                    cy="15"
                                    cx="15"
                                    ></circle>
                                    <circle fill="#DFDFDF" r="7" cy="15" cx="15"></circle>
                                </svg>
                                </div>
                                <div className={cx('road')}></div>
                            </div>
                            </div>
                        </div>
                        <div className={cx('show_detail_bill_body_status-item_title')}>
                            <h2>Đang Giao</h2>
                            <h3 style={{textAlign:'center',color: 'rgba(0, 0, 0, .26)'}}>{bill.length > 0 ? bill[0].DateOnly : null}</h3>
                        </div>
                        
                    </div>
                    <div className={cx('show_detail_bill_body_status-item')}>
                        <div className={cx('show_detail_bill_body_status-item-coin')}>
                             <div className={cx('coin')}>
                                 <span className={cx('engraving')}>$</span>
                            </div>
                        </div>
                        <div className={cx('show_detail_bill_body_status-item_title')}>
                            <h2>Đã Nhận Hàng</h2>
                            <h3 style={{textAlign:'center',color: 'rgba(0, 0, 0, .26)'}}>{bill.length > 0 ? bill[0].DateOnly : null}</h3>
                        </div>
                    </div>
                    <div onClick={bill.length > 0 ? bill[0].Status === 3 ? () => handleClickShowComment(bill[0].Id,bill[0].Data) : null : null} className={cx('show_detail_bill_body_status-item')}>
                        <div ref={LastItemRef} className={cx('show_detail_bill_body_status-item-icon')}>
                            <FontAwesomeIcon style={{width:'30px',height:'30px'}} icon={faStarRerular} />
                        </div>
                        <div className={cx('show_detail_bill_body_status-item_title')}>
                            <h2>Đánh giá</h2>
                            <h3 style={{textAlign:'center',color: 'rgba(0, 0, 0, .26)'}}>{bill.length > 0 ? bill[0].DateOnly : null}</h3>
                        </div>
                    </div>
                </div>
                <div ref={Line} className={cx('show_detail_bill_body_line')}></div>
                <div className={cx('show_detail_bill_body_line_1')}></div>
                <div className={cx('show_detail_bill_body_line_2')}></div>
                {/* Hih */}
                <div className={cx('show_detail_bill_footer')}>
                    <header>Thông Tin Nhận Hàng</header>
                </div>
            </div>
            <div className={cx('show_detail_bill_footer_container')}>
                {bill.length > 0 ? (
                    <>
                        <div className={cx('show_detail_bill_footer_container-left')}>
                            <h2>{bill[0].Name}</h2>
                            <h3 style={{color:'#555',margin:'10px 0'}}>(+84) {bill[0].Sdt}</h3>
                            <h3 style={{color:'#555'}}>{bill[0].Address}</h3>
                            {bill[0].StatusPay === 0 ? (
                                               <h4 style={{marginTop:'20px'}}>Thanh toán khi nhận hàng</h4>
                                            ) : (
                                                bill[0].StatusPay === 1 ? ( <h4 style={{marginTop:'20px'}}>Đã thanh toán</h4>) : ( <h4 style={{marginTop:'20px'}}>Chờ thanh toán</h4>)
                                            )}
                        </div>
                        <div className={cx('show_detail_bill_footer_container-right')}>
                            {bill.length > 0 ? (
                                <Map Destination = {bill[0].Destination} />
                            ) : null}
                        </div>
                    </>
                ) : null}
            </div>
        </div>
    );
}

export default App;