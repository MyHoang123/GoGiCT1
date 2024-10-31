

import io from 'socket.io-client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios'
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import ImgProduct from '../CardMobile/imgCard';
import { faAngleLeft,faPenToSquare,faAngleRight,faCertificate,faAward } from '@fortawesome/free-solid-svg-icons';
// FakeImg
// import ImgProduct from "./imgCard"
// Scss
// import "./BillMobileOrder.scss"
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState,useContext } from 'react';
function App() {
    // Route
    const navigate = useNavigate();

// State
    const [socket, setSocket] = useState(null)
    const [billProduct, setBillProduct] = useState([])
    const [products, setProducts] = useState([])
    const [checkBill, setCheckBill] = useState()
// context
// Ref

const notiOrder = useRef([])
    // All Mobile,CreateQR
    const checkout = (newSocket) => {
        Swal.fire({
            title: "Cảm Ơn Bạn Đã Thanh Toán. Đánh Giá",
            html: `
                <div class="TitleCheckout" style="background-color: #f1f1f1; padding: 10px 20px; border-radius: 5px;">
                    <div class="rating">
                    <input type="radio" id="star-1" name="star-radio" value="star-1">
                    <label for="star-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path pathLength="360" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path></svg>
                    </label>
                    <input type="radio" id="star-2" name="star-radio" value="star-1">
                    <label for="star-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path pathLength="360" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path></svg>
                    </label>
                    <input type="radio" id="star-3" name="star-radio" value="star-1">
                    <label for="star-3">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path pathLength="360" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path></svg>
                    </label>
                    <input type="radio" id="star-4" name="star-radio" value="star-1">
                    <label for="star-4">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path pathLength="360" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path></svg>
                    </label>
                    <input type="radio" id="star-5" name="star-radio" value="star-1">
                    <label for="star-5">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path pathLength="360" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path></svg>
                    </label>
                </div>
            </div>
                `,
            icon: "success"
          }).then((result) => {
            if(result.isConfirmed) {
                // Xử lý sự kiện khi kết nối bị đóng
                const IdClient = JSON.parse(localStorage.getItem('Table')).Table
                newSocket.emit('disconnection', IdClient);
                newSocket.disconnect();
                localStorage.removeItem('Table')
                localStorage.removeItem('card')
                navigate('/')
                }
                else {
                // Xử lý sự kiện khi kết nối bị đóng
                const IdClient = JSON.parse(localStorage.getItem('Table')).Table
                newSocket.emit('disconnection', IdClient);
                newSocket.disconnect();
                localStorage.removeItem('Table')
                localStorage.removeItem('card')
                navigate('/')
                }
          });
    }
const handleClickPay = () => {
    socket.emit('checkout',JSON.parse(localStorage.getItem('Table')).Table)
    Swal.fire({
        title: "Xin Quý Khách Vui Lòng Đợi Trong Giây Lát",
        showClass: {
          popup: `
            animate__animated
            animate__fadeInUp
            animate__faster
          `
        },
        hideClass: {
          popup: `
            animate__animated
            animate__fadeOutDown
            animate__faster
          `
        }
      });
}
useEffect(() => {
    if(localStorage.getItem('Table')) {
        const table = {
            IdTable: JSON.parse(localStorage.getItem('Table')).Table
        }
        axios.all([
          axios.post(`${process.env.REACT_APP_IP_SEVER}/api/v12/showbillorderuser`,table),
        ])
          .then(axios.spread((Bill) => {
            setBillProduct(Bill.data.data)
            setProducts(JSON.parse(Bill.data.data.Data))
          }))
          .catch (err => {
              console.error()
          })
    }
},[checkBill])
useEffect(() => {
    const newSocket = io(`${process.env.REACT_APP_IP_SEVER}`,{
        auth: {
            token: 2
        }
    });
    newSocket.on('repsuccessproduct', (data) => {
        setCheckBill(data.data)
    });
    newSocket.on('repcheckoutsuccess', () => {
        checkout(newSocket)
    });
    setSocket(newSocket)
    return () => {
        newSocket.disconnect()
    }
},[])
    return ( 
        <>
            <div className="Card_mobile">
                <div className='layout_gid_card' >
                    <header className="Card_mobile-header">
                        <Link to='/' className='Card_mobile-header-icon'>
                            <FontAwesomeIcon style={{fontSize: '16px'}} icon={faAngleLeft} />
                        </Link>
                        <span>Hóa Đơn</span>
                        </header>
                    <div className="Card_ship">
                        <button className="Card_ship-deliver active">Deliver</button>
                        <button className="Card_ship-deliver">Pick Up</button>
                    </div>
                    <div className="Card_ship-address">
                        <h2 className="Card_ship-address-header">Delivery Address</h2>
                        <div className='Card_ship-address_content'>
                           <h2>Bàn Số {JSON.parse(localStorage.getItem('Table')).Table}</h2>
                        </div>
                        <div className="Card_ship-address_button">
                            <span style={{marginRight: '6px'}}><FontAwesomeIcon icon={faPenToSquare} /> Edit Address</span>
                            <span>Add Note</span>
                        </div>
                    </div>
                    {/* Product */}
                    <div className='Product_card-mobile'>
                    {products.map((product,index) => (
                        <div style={{flexDirection:'column'}} key={index} className='Product_card-item'>
                            <div className='product_card-item_left'>
                                <div className='Product_card-item_img'>
                                    <ImgProduct children={product.Img} />
                                </div>
                                <div className='Product_card-item_name'>
                                    <span style={{fontSize: '14px',color:'#333'}}>{product.Name}</span>
                                    <span style={{fontSize: '14px',color: '#7b7b7b'}}>Size L</span>
                                </div>
                                <div className='Product_card-item_quality-price'>
                                   <h2>x{product.sl}</h2>
                                {
                                (JSON.parse(localStorage.getItem('Table')) && JSON.parse(localStorage.getItem('Table')).Buffe !== 'All') ? (
                                    <h2 style={{fontSize:'12px',paddingTop: '5px'}}>00.000đ</h2>
                                ) : (
                                    <h2 style={{fontSize:'12px',paddingTop: '5px'}}>{product.Price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫'}</h2>
                                )
                                }
                                   
                                </div>
                                </div>
                                <span ref={e => notiOrder.current[index] = e} style={{color: product.Status === 'Đã Giao' ? '#3fb800' : product.Status === 'Chờ Lên Món !' ? '#afaf00' : '#ba3939'}}>{product.Status}</span>
                        </div>
                    ))}
                        </div>
                    </div>
                    <span className='fake_border'></span>
                    {/* Coupon */}
                    <div className='layout_gid_card_footer' >
                        <div className='Card_coupon_container'>
                            <div className='Card_coupon_container-left'>
                                <FontAwesomeIcon style={{fontSize: '20px',paddingRight: '14px',color: 'rgba(199, 125, 77, 1)'}} icon={faCertificate} />
                                <h2>1 Discount is applied</h2>
                            </div>
                            <FontAwesomeIcon style={{fontSize: '16px'}} icon={faAngleRight} />
                        </div>
                        <h2 className='Payment_header'>Payment Summary</h2>
                        <div className='Card_checkout-price'>
                            <span>Price</span>
                            {JSON.parse(localStorage.getItem('Table')) && JSON.parse(localStorage.getItem('Table')).Buffe !== 'All' ? (
                                 <span>00.000đ</span>
                            ) : (
                                products.length > 0 ? (
                                    <span className='Card_checkout-total'>{billProduct.Price ? billProduct.Price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫' : null}</span>
                                ) : null
                            )}
                        </div>
                        <div style={{borderBottom: '1px solid #d4d4d4',paddingBottom:'10px'}} className='Card_checkout-price'>
                            <span>VAT</span>
                            <span>8%</span>
                        </div>
                        <div className='Card_checkout-price'>
                            <span>Total Payment</span>
                            {JSON.parse(localStorage.getItem('Table')) && JSON.parse(localStorage.getItem('Table')).Buffe !== 'All' ? (
                                 <span>00.000đ</span>
                            ) : (
                                products.length > 0 ? (
                                    <span>{billProduct.Price ? billProduct.Price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫' : null}</span>
                                ) : null
                            )}
                          
                        </div>
                        <div className='Card_checkout'>
                            <div className='Card_checkout-left'>
                                <span><FontAwesomeIcon style={{padding:'0',fontSize:'30px',color: 'rgba(199, 125, 77, 1)'}} icon={faAward} /></span>
                                <span className='Card_checkout-cash'>Cash</span>
                                {JSON.parse(localStorage.getItem('Table')) && JSON.parse(localStorage.getItem('Table')).Buffe !== 'All' ? (
                                 <span>00.000đ</span>
                            ) : (
                                products.length > 0 ? (
                                    <span className='Card_checkout-total'>{billProduct.Price ? billProduct.Price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫' : null}</span>
                                ) : null
                            )}
                          
                            </div>
                            <span>...</span>
                        </div>
                        <div onClick={handleClickPay} className='button_pay_mobile'>
                            <button>Gọi Thanh Toán</button>
                        </div>
                    </div>

            </div>
        
        </>
     );
}

export default App;