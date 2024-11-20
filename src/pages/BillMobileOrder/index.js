
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios'
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import { MobileContext } from '../../components/Layout/MobileLayout'
import { faAngleLeft,faPenToSquare,faAngleRight,faCertificate,faAward } from '@fortawesome/free-solid-svg-icons';
// FakeImg
// import ImgProduct from "./imgCard"
// Scss
import "./BillMobileOrder.scss"
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState,useContext, useMemo } from 'react';
function App() {
    // Route
    const navigate = useNavigate();
// State
    const [bill, setBill] = useState([])
    const [products, setProducts] = useState([])
    const [checkBill, setCheckBill] = useState()
// context
    const {cookies,socket} = useContext(MobileContext)
// Ref

const notiOrder = useRef([])
//     // All Mobile,CreateQR
//     const checkout = (newSocket) => {
//         Swal.fire({
//             title: "Cảm Ơn Bạn Đã Thanh Toán. Đánh Giá",
//             html: `
//                 <div class="TitleCheckout" style="background-color: #f1f1f1; padding: 10px 20px; border-radius: 5px;">
//                     <div class="rating">
//                     <input type="radio" id="star-1" name="star-radio" value="star-1">
//                     <label for="star-1">
//                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path pathLength="360" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path></svg>
//                     </label>
//                     <input type="radio" id="star-2" name="star-radio" value="star-1">
//                     <label for="star-2">
//                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path pathLength="360" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path></svg>
//                     </label>
//                     <input type="radio" id="star-3" name="star-radio" value="star-1">
//                     <label for="star-3">
//                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path pathLength="360" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path></svg>
//                     </label>
//                     <input type="radio" id="star-4" name="star-radio" value="star-1">
//                     <label for="star-4">
//                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path pathLength="360" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path></svg>
//                     </label>
//                     <input type="radio" id="star-5" name="star-radio" value="star-1">
//                     <label for="star-5">
//                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path pathLength="360" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path></svg>
//                     </label>
//                 </div>
//             </div>
//                 `,
//             icon: "success"
//           }).then((result) => {
//             if(result.isConfirmed) {
//                 // Xử lý sự kiện khi kết nối bị đóng
//                 const IdClient = JSON.parse(localStorage.getItem('Table')).Table
//                 newSocket.emit('disconnection', IdClient);
//                 newSocket.disconnect();
//                 localStorage.removeItem('Table')
//                 localStorage.removeItem('card')
//                 navigate('/')
//                 }
//                 else {
//                 // Xử lý sự kiện khi kết nối bị đóng
//                 const IdClient = JSON.parse(localStorage.getItem('Table')).Table
//                 newSocket.emit('disconnection', IdClient);
//                 newSocket.disconnect();
//                 localStorage.removeItem('Table')
//                 localStorage.removeItem('card')
//                 navigate('/')
//                 }
//           });
//     }
const checkout = () => {
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
        
            }
            else {
            // Xử lý sự kiện khi kết nối bị đóng

            }
      });
}
const handleClickCheckout = () => {
    socket.emit('checkoutuser')
    checkout()
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
    if(cookies.get('AccessTokenOrder') !== undefined) {
        axios.all([
          axios.get(`${process.env.REACT_APP_IP_SEVER}/api/v12/getproductbillorder?token=${cookies.get('AccessTokenOrder')}`),
          axios.get(`${process.env.REACT_APP_IP_SEVER}/api/v12/getbillorder?token=${cookies.get('AccessTokenOrder')}`),
        ])
          .then(axios.spread((Products,Bill) => {
              setProducts(Products.data.data)
              setBill(Bill.data.data)
          }))
          .catch (err => {
              console.error()
          })
    }
},[checkBill])
useEffect(() => {
        if(socket !== null) {
            socket.on('updateProduct',(Products) => {
                const newProduct = [...products]
                newProduct.forEach((product) => {
                    if(product.Id === Products.IdProduct) {
                        product.Status = Products.Status
                    }
                })
                setProducts(newProduct)
            })
            return () => {
                socket.off('updateProduct')
            }
        }
},[products])
const totalPay = useMemo(() => {
    let totalAll = 0
    if(bill.Price > 0) {
       const total = bill.Price * 0.08;
       totalAll = bill.Price + total
    }
    return totalAll
    // for(let i = 0; i < cardProductBill.length; i++) {
    //     total = total + cardProductBill[i].Price
    // }
 },[bill])
    return ( 
        <>
            <div className="Card_mobile">
                <div className='layout_gid_card' >
                    <header className="Card_mobile-header">
                        <Link to={`/order?token=${cookies.get('AccessTokenOrder')}`} className='Card_mobile-header-icon'>
                            <FontAwesomeIcon style={{fontSize: '16px'}} icon={faAngleLeft} />
                        </Link>
                        <span>Hóa Đơn</span>
                        </header>
                    <div className="Card_ship">
                        <button className="Card_ship-deliver">Deliver</button>
                        <button className="Card_ship-deliver active">Pick Up</button>
                    </div>
                    <div className="Card_ship-address">
                        <h2 className="Card_ship-address-header">{bill.typeName}</h2>
                        <div className='Card_ship-address_content'>
                           <h2>{bill.tableName}</h2>
                        </div>
                    </div>
                    {/* Product */}
                    <div className='Product_card-mobile'>
                    {products.map((product,index) => (
                        <div style={{flexDirection:'column'}} key={index} className='Product_card-item'>
                            <div className='product_card-item_left'>
                                <div className='Product_card-item_img'>
                                    <img src={`${process.env.REACT_APP_IP_SEVER}/api/v12/showimgproduct/${product.Img}`}/>
                                </div>
                                <div className='Product_card-item_name'>
                                    <span style={{fontSize: '14px',color:'#333'}}>{product.Name}</span>
                                    <span style={{fontSize: '14px',color: '#7b7b7b'}}>Size L</span>
                                </div>
                                <div className='Product_card-item_quality-price'>
                                   <h2>x{product.Quantity}</h2>
                                </div>
                                </div>
                                <span className='product_card-item_left_status' ref={e => notiOrder.current[index] = e} style={{color: product.Status === 1 ? '#3fb800' : product.Status === 0 ? '#afaf00' : '#ba3939'}}>{product.Status === 1 ? 'Đã giao': product.Status === 0 ? 'Chờ lên món !':'Đã hủy !'}</span>
                        </div>
                    ))}
                        </div>
                    </div>
                    <span className='fake_border'></span>
                    {/* Coupon */}
                    <div className='layout_gid_card_footer' >
                        <h2 className='Payment_header'>Payment Summary</h2>
                        <div className='Card_checkout-price'>
                            <span>Price</span>
                            <span className='Card_checkout-total'>{bill.Price > 0 ? bill.Price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫' : null}</span>
                        </div>
                        <div style={{borderBottom: '1px solid #d4d4d4',paddingBottom:'10px'}} className='Card_checkout-price'>
                            <span>VAT</span>
                            <span>8%</span>
                        </div>
                        <div className='Card_checkout-price'>
                            <span>Total Payment</span>                   
                                    <span>{totalPay.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫'}</span>
                        </div>
                        <div className='Card_checkout'>
                            <div className='Card_checkout-left'>
                                <span><FontAwesomeIcon style={{padding:'0',fontSize:'30px',color: 'rgba(199, 125, 77, 1)'}} icon={faAward} /></span>
                                <span className='Card_checkout-cash'>Cash</span>
                                    <span className='Card_checkout-total'>{totalPay.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫'}</span>
                            </div>
                            <span>...</span>
                        </div>
                        <div onClick={() => handleClickCheckout()} className='button_pay_mobile'>
                            <button>Gọi Thanh Toán</button>
                        </div>
                    </div>

            </div>
        
        </>
     );
}

export default App;