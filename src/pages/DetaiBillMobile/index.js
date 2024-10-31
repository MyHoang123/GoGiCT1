import { useCallback, useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationCrosshairs, faChevronLeft, faPhoneVolume } from '@fortawesome/free-solid-svg-icons';
import { faClipboard as faClipboardRegular , faStar as faStarRerular} from '@fortawesome/free-regular-svg-icons'; 
import test from '../../Asset/images/avt.jpg'
import classNames from "classnames/bind"
import styles from './DetailbillMobile.module.scss'
import Map from './map'
const cx = classNames.bind(styles)

function App() {
    const Line = useRef()
    const mapContainer = useRef(null)
    const navRef = useRef(null)
    const handleClickRemoveNav = useCallback(() => {
        if(navRef.current.style.top === '180px') {
            navRef.current.style.top = '0px'
        }else {
            navRef.current.style.top = '180px'
        }
    },[])
    return ( 
        <div  className={cx('Detailbill_body')}>
                <div ref={mapContainer} className={cx('Detailbill_body_map')}>
                    <div className={cx('Detailbill_body_map_button')}>
                        <div className={cx('Detailbill_body_map_button_left')}>
                            <FontAwesomeIcon className={cx('Detailbill_body_map_button_left-icon')} icon={faChevronLeft} />
                        </div>
                        <div className={cx('Detailbill_body_map_button_right')}>
                            <FontAwesomeIcon className={cx('Detailbill_body_map_button_left-icon')} icon={faLocationCrosshairs} />
                        </div>
                    </div>
                        <Map mapContainer = {mapContainer}/>
                </div>
                <div ref={navRef} className={cx('Detailbill_body_info')}>
                <div onClick={handleClickRemoveNav} className={cx('Detailbill_body_info_buttonhiden')}></div>
                    <div className={cx('Detailbill_body_info_header')}>
                        <h2>5 minutes left</h2>
                        <h3>Delivery to: <strong>Thoi Binh Can Tho</strong></h3>
                        <div className={cx('show_detail_bill_body_status')}>
                    <div className={cx('show_detail_bill_body_status-item')}>
                        <div className={cx('show_detail_bill_body_status-item-icon-1')}>
                            <FontAwesomeIcon style={{height:'18px',color:'#2dc258'}} icon={faClipboardRegular} />
                        </div>
                        <div className={cx('show_detail_bill_body_status-item_title')}>
                            <h2 style={{marginBottom:'0',fontSize:'12px',textAlign:'center'}}>Đã Đặt</h2>
                            <h3 style={{textAlign:'center',color: 'rgba(0, 0, 0, .26)',marginBottom:'0',fontSize:'12px'}}>20/11/2024</h3>
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
                            <h2 style={{marginBottom:'0',fontSize:'12px',textAlign:'center'}}>Chế Biến</h2>
                            <h3 style={{textAlign:'center',color: 'rgba(0, 0, 0, .26)',marginBottom:'0',fontSize:'12px'}}>20/11/2024</h3>
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
                            <h2 style={{marginBottom:'0',fontSize:'12px',textAlign:'center'}}>Đang Giao</h2>
                            <h3 style={{textAlign:'center',color: 'rgba(0, 0, 0, .26)',marginBottom:'0',fontSize:'12px'}}>20/11/2024</h3>
                        </div>
                        
                    </div>
                    <div className={cx('show_detail_bill_body_status-item')}>
                        <div className={cx('show_detail_bill_body_status-item-icon')}>
                            <FontAwesomeIcon style={{height:'18px',color:'#2dc258'}} icon={faStarRerular} />
                        </div>
                        <div className={cx('show_detail_bill_body_status-item_title')}>
                            <h2 style={{marginBottom:'0',fontSize:'12px',textAlign:'center'}}>Đánh giá</h2>
                            <h3 style={{textAlign:'center',color: 'rgba(0, 0, 0, .26)',marginBottom:'0',fontSize:'12px'}}>20/11/2024</h3>
                        </div>
                    </div>
                </div>
                <div ref={Line} className={cx('show_detail_bill_body_line')}></div>
                <div className={cx('show_detail_bill_body_line_1')}></div>
                <div className={cx('show_detail_bill_body_line_2')}></div>
                </div>
                <div className={cx('detail_allprice')}>
                    <h3>Tổng tiền hàng: 30.000đ</h3>
                    <h3>Phí ship: 15.000đ</h3>
                    <h3>Giảm giá: 30.000đ</h3>
                </div>
                <div className={cx('detailbill_infoshiper')}>
                    <div className={cx('detailbill_infoshiper_container')}>
                        <div className={cx('detailbill_infoshiper_container-img')}>
                             <img src={test}/>
                        </div>
                        <div className={cx('detailbill_infoshiper_container-info')}>
                            <h2>Trần Hoàng Mỹ</h2>
                            <h3>Nhân viên chính thức</h3>
                        </div>
                    </div>
                    <div className={cx('detailbill_infoshiper_phone')}>
                        <FontAwesomeIcon style={{height:'20px',color:'#797979'}} icon={faPhoneVolume} />
                    </div>
                </div>
                </div>
        </div>
     );
}

export default App;