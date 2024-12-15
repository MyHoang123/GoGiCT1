



import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faHouse,faUser,faBasketShopping, faClipboard, } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { MobileContext } from '../../components/Layout/MobileLayout1'

import noProduct from'../../Asset/images/5fafbb923393b712b964.png'
import classNames from "classnames/bind"
import styles from './PurchaseMobile.module.scss'
import { useState, useEffect,useContext } from 'react';
const cx = classNames.bind(styles)
function App() {
    const [checkNav, setCheckNav] = useState(0)
    // const [bills, setBills] = useState([])
    const {Amount,bills, setBills, setIdBill, setComment, setModalCmt, setProduct, cookies} = useContext(MobileContext)
    async function showComment(User) {
        try {
           const response = await axios.post('https://severgogi.onrender.com/api/v12/showcommentuser', User)
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
            const user = {
                IdBill: IdBill,
                IdProduct: product,
                token: cookies.get('AccessToken')
            }
            setIdBill(IdBill)
            setProduct(JSON.parse(data))
            showComment(user)
        }
    }
    useEffect(() => {
        if(cookies.get('AccessToken') !== undefined) {
            if(checkNav === 3) {
                axios.all([
                    axios.post('https://severgogi.onrender.com/api/v12/showbill',{token: cookies.get('AccessToken')}),
                ])
                .then(axios.spread((Bill, ) => {
                        setBills(Bill.data.data)
                    }))
                    .catch (err => {
                        console.error()
                    })
            }else if (checkNav === 0) {
                axios.all([
                    axios.post('https://severgogi.onrender.com/api/v12/showbilluser',{
                        token: cookies.get('AccessToken'),
                        Status: 0
                    }),
                    ])
                    .then(axios.spread((Bill, ) => {
                        setBills(Bill.data.data)
                    }))
                    .catch (err => {
                        console.error()
                    })
            }else if(checkNav === 1) {
                axios.all([
                    axios.post('https://severgogi.onrender.com/api/v12/showbilluser',{
                        token: cookies.get('AccessToken'),
                        Status: 1
                    }),
                    ])
                    .then(axios.spread((Bill, ) => {
                        setBills(Bill.data.data)
                    }))
                    .catch (err => {
                        console.error()
                    })
            }else if(checkNav === 2) {
                axios.all([
                    axios.post('https://severgogi.onrender.com/api/v12/showbilluser',{
                        token: cookies.get('AccessToken'),
                        Status: 2
                    }),
                    ])
                    .then(axios.spread((Bill, ) => {
                        console.log("🚀 ~ .then ~ Bill:", Bill)
                        setBills(Bill.data.data)
                    }))
                    .catch (err => {
                        console.error()
                    })
            }
    }
    },[checkNav])
    return ( 
        <div className={cx('Purchase_container')}>
            <nav className={cx('Purchase_container-nav')}>
                <ul className={cx('Purchase_container-nav_list')}>
                    <li className={checkNav === 0 ? cx('Active') : null}  onClick={()=> setCheckNav(0)}>Đã đặt</li>
                    <li className={checkNav === 1 ? cx('Active') : null}  onClick={()=> setCheckNav(1)}>Đã nhận</li>
                    <li className={checkNav === 2 ? cx('Active') : null}  onClick={()=> setCheckNav(2)}>Đang giao</li>
                    <li className={checkNav === 3 ? cx('Active') : null}  onClick={()=> setCheckNav(3)}>Lịch sử</li>
                    <li className={checkNav === 4 ? cx('Active') : null}  onClick={()=> setCheckNav(4)}>Đã hủy</li>
                </ul>
            </nav>
            <div className={cx('Purchase_product_container')}>
                {bills === undefined ? (
                     <div className={cx('Purchase_product_container_noproduct')}>
                            <img src={noProduct}/>
                            <h3>Chưa có sản phẩm</h3>
                    </div> 
                ) : (
                 bills.map((bill,i) => (
                      <div key={i} className={cx('Purchase_product_container-item')}>
                         <header className={cx('Purchase_product_container-item-header')}>
                             <div className={cx('Purchase_product_container-item-Id')}>
                                 <h3>Mã đơn: <span>#KTPM0120{bill.Id}</span></h3>
                             </div>
                             <div className={cx('Purchase_product_container-item-TIME')}>
                                <Link to={`/purchase/${bill.Id}`}><span>Xem chi tiết</span></Link>
                             </div>
                         </header>
                         <div className={cx('Purchase_product_container-item-body')}>
                            {JSON.parse(bill.Data).map((product,i) => (
                             <div key={i} className={cx('Purchase_product_body_product')}>
                                 <div className={cx('Purchase_product_body_product-info')}>
                                     <div className={cx('Purchase_product_body_product-img')}>
                                         <img src={`https://severgogi.onrender.com/api/v12/showimgproduct/${product.Img}`}/>
                                     </div>
                                     <div className={cx('Purchase_product_body_product-name')}>
                                         <h3>{product.Name}</h3>
                                         <h4>Phân loại: {product.NameCate}</h4>
                                         <h5>x{product.sl}</h5>
                                     </div>
                                 </div>
                                 <div className={cx('Purchase_product_body_product-price')}>
                                     <h3>120.000đ</h3>
                                 </div>
                             </div>
                            ))}
                         </div>
                             <footer className={cx('Purchase_product_container-item-footer')}>
                                <h2>{bill.DateOnly}</h2>
                                 <div className={cx('Purchase_product_container-item-footer-btn')}>
                                    {bill.Status === 3 ? (
                                        <>
                                            <button className={cx('active')} onClick={() => handleClickOpenCmt(bill.Id,bill.Data)}>Đánh giá</button>
                                            <button>Đặt lại</button>
                                        </>
                                    ) : (
                                        bill.Status === 4 ? (
                                            <>
                                            <button onClick={() => handleClickShowComment(bill.Id,bill.Data)}>Xem đánh giá</button>
                                            <button className={cx('active')}>Đặt lại</button>
                                        </>
                                        ) : (
                                             <>
                                                <button>Đặt lại</button>
                                            </>
                                        )
                                       
                                    )}
                                 </div>
                             </footer>
                     </div> 
                    
                ))
                )}
            </div>
            <div className={cx('navbar_footer')}>
                <div className={cx('navbar_footer-content')}>
                    <Link to='/'>
                            <FontAwesomeIcon icon={faHouse} />
                    </Link>
                    <Link to='/purchase' className={cx('Active')}>
                        <FontAwesomeIcon icon={faClipboard} />
                    </Link>
                    <Link datacount = {Amount} className={cx('navbar_footer-content_card')} to='/card' >
                        <FontAwesomeIcon icon={faBasketShopping} /> 
                    </Link>
                    <Link to='/user'>
                        <FontAwesomeIcon icon={faUser} />
                    </Link>
                </div>
            </div>
        </div>

     );
}

export default App;