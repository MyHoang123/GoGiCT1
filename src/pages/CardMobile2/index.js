
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft,faPenToSquare,faMinus,faPlus,faAngleRight,faCertificate,faAward } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios'
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import { MobileContext } from '../../components/Layout/MobileLayout'
// FakeImg
import ImgProduct from "./imgCard"
// Scss
import { Link , useNavigate} from 'react-router-dom';
import { useEffect, useRef, useState,useMemo,useContext } from 'react';
import classNames from "classnames/bind"
import styles from './CardMobile.module.scss'
const cx = classNames.bind(styles)

function App() {
    // Route
    const navigate = useNavigate();
// State
    const [cardProduct, setCardProduct] = useState([])
    const [cardProductBill, setCardProductBill] = useState([])
// Ref
const qualityRef = useRef([])
    return ( 
        <>
            <div className={cx('Card_mobile')}>
                <div className={cx('layout_gid_card')} >
                    <header className={cx('Card_mobile-header')}>
                        <Link to='/' className={cx('Card_mobile-header-icon')}>
                            <FontAwesomeIcon style={{fontSize: '16px'}} icon={faAngleLeft} />
                        </Link>
                        <span>Order</span>
                        </header>
                    <div className={cx('Card_ship')}>
                        <button className={cx('Card_ship-deliver')}>Deliver</button>
                        <button className={cx('Card_ship-deliver')}>Pick Up</button>
                    </div>
                    <div className={cx('Card_ship-address')}>
                        <h2 className={cx('Card_ship-address-header')}>GoGi House</h2>
                        <div className={cx('Card_ship-address_content')}>
                            <span className={cx('Card_ship-address-detail')}>
                            TTTM Vincom
                            </span>
                            <span className={cx('Card_ship-address-country')}>
                            2 Đường Hùng Vương, Thới Bình, Ninh Kiều, Cần Thơ 90000, Việt Nam
                            </span>
                        </div>
                        <div className={cx('Card_ship-address_button')}>
                            <span style={{marginRight: '6px'}}><FontAwesomeIcon icon={faPenToSquare} /> Edit Address</span>
                            <span>Add Note</span>
                        </div>
                    </div>
                    {/* Product */}
                    <div className={cx('Product_card-mobile')}>
                    {/* {cardProduct.map((product,index) => (
                        <div key={index} className='Product_card-item'>
                            <div className='product_card-item_left'>
                                <div className='Product_card-item_img'>
                                    <ImgProduct children={product.Img} />
                                </div>
                                <div className='Product_card-item_name'>
                                    <span style={{fontSize: '14px',color:'#333'}}>{product.Name}</span>
                                    <span style={{fontSize: '14px',color: '#7b7b7b'}}>Size L</span>
                                </div>
                                </div>
                                <div className='Product_card-item_quality'>
                                    <span onClick={() => handleClickPrev(product.Id,index)} className='Product_card-item_quality-icon'><FontAwesomeIcon icon={faMinus} /></span>
                                    <span ref={e => qualityRef.current[index] = e} style={{padding: '0px 8px',fontSize:'15px',fontWeight:'600'}}>1</span>
                                    <span onClick={() => handleClickNext(product.Id,index)} className='Product_card-item_quality-icon'><FontAwesomeIcon icon={faPlus} /></span>
                                </div>
                        </div>
                    ))} */}
                        </div>
                    </div>
                    <span className={cx('fake_border')}></span>
                    {/* Coupon */}
                    <div className={cx('layout_gid_card_footer')}>
                        <div className={cx('Card_coupon_container')}>
                            <div className={cx('Card_coupon_container-left')}>
                                <FontAwesomeIcon style={{fontSize: '20px',paddingRight: '14px',color: 'rgba(199, 125, 77, 1)'}} icon={faCertificate} />
                                <h2>1 Discount is applied</h2>
                            </div>
                            <FontAwesomeIcon style={{fontSize: '16px'}} icon={faAngleRight} />
                        </div>
                        <h2 className={cx('Payment_header')}>Payment Summary</h2>
                        <div className={cx('Card_checkout-price')}>
                            <span>Price</span>
                            <span>00.000đ</span>
                        </div>
                        <div style={{borderBottom: '1px solid #d4d4d4',paddingBottom:'10px'}} className={cx('Card_checkout-price')}>
                            <span>Delivery</span>
                            <span>00.000đ</span>
                        </div>
                        <div className={cx('Card_checkout-price')}>
                            <span>Total Payment</span>
                            {/* <span>{totalPay.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫'}</span> */}
                        </div>
                        <div className={cx('Card_checkout')}>
                            {/* <div className='Card_checkout-left'>
                                <span><FontAwesomeIcon style={{padding:'0',fontSize:'30px',color: 'rgba(199, 125, 77, 1)'}} icon={faAward} /></span>
                                <span className='Card_checkout-cash'>Cash</span>
                                {
                                (JSON.parse(localStorage.getItem('Table')) && JSON.parse(localStorage.getItem('Table')).Buffe !== 'All') ? (
                                   <span>00.000đ</span> 
                                ) : (
                                <span>{totalPay.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫'}</span>
                                )
                                }
                                
                            </div> */}
                            <span>...</span>
                        </div>
                        <div className={cx('button_pay_mobile')}>
                            <button>Order</button>
                        </div>
                    </div>

            </div>
        
        </>
     );
}

export default App;