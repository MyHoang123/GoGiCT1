

import io from 'socket.io-client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft,faPenToSquare,faMinus,faPlus,faAngleRight,faCertificate,faAward } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios'
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import { MobileContext } from '../../components/Layout/MobileLayout/index'

// FakeImg
import ImgProduct from "./imgCard"
// Scss
import "./CardMobile.scss"
import { Link , useNavigate} from 'react-router-dom';
import { useEffect, useRef, useState,useMemo,useContext } from 'react';

function App() {
    // Route
    const navigate = useNavigate();
// State
    const [cardProduct, setCardProduct] = useState([])
    const [socket, setSocket] = useState(null)
    const [cardProductBill, setCardProductBill] = useState([])
// Context
// Ref
const qualityRef = useRef([])
// Gửi dữ liệu lên API
async function createBill(bill) {
    try {
       const response = await axios.post(`${process.env.REACT_APP_IP_SEVER}/api/v12/createbillorder`, bill);
       if(response.data.massege === "success CreateBill") {
        socket.emit('createProductTable', bill.IdTable)
       }
    } catch (error) {
        console.error('Lỗi khi thêm sản phẩm:', error);
        // Xử lý lỗi tại đây.
    }
}
const handleClickOrder = () => {
    if(cardProductBill.length > 0) {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
              confirmButton: "btn btn-success",
              cancelButton: "btn btn-danger"
            },
            buttonsStyling: false
          });
          swalWithBootstrapButtons.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Đồng Ý!",
            cancelButtonText: "Tư Chối!",
            reverseButtons: true
          }).then((result) => {
            if (result.isConfirmed) {
                // Data
                const result =  JSON.parse(localStorage.getItem('card')).reduce((acc, curr) => {
                    acc.push({ Id: curr.Id,Price: curr.Price });
                    return acc;
                  }, []);
                for(let i = 0 ; i < result.length; i++) {
                    result[i].Status = 'Chờ Lên Món !'
                }
                setCardProductBill(result)
                const data = {
                    TotalPrice: totalPay,
                    Data: JSON.stringify(result),
                    IdTable: JSON.parse(localStorage.getItem('Table')).Table
                }
                localStorage.removeItem('card')
                createBill(data)
                // 
              swalWithBootstrapButtons.fire({
                title: "Thành Công!",
                text: "Bạn Đã Đặt Món Thành Công !",
                icon: "success"
              }).then((result) => {
                if(result.isConfirmed) {
                    navigate(`/order/buffe/${JSON.parse(localStorage.getItem('Table')).Buffe}/order/billorder`)
                    }
                    else {
                    navigate(`/order/buffe/${JSON.parse(localStorage.getItem('Table')).Buffe}/order/billorder`)
                    }
              });
            }
            else if (
              /* Read more about handling dismissals below */
              result.dismiss === Swal.DismissReason.cancel
            ) {
              swalWithBootstrapButtons.fire({
                title: "Cancelled",
                text: "Your imaginary file is safe :)",
                icon: "error"
              });
            }
          });
    }
    else {
        Swal.fire({
            title: "Giỏ hàng chưa có sản phẩm !",
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
    
}
const handleClickNext = (Id,i) => {
    let quantity = parseInt(qualityRef.current[i].innerText)
        quantity += 1
        qualityRef.current[i].innerText = `${quantity}`
        const newArr = [...cardProduct]
        for(let j = 0; j < cardProductBill.length; j++) {
            if(Id === cardProductBill[j].Id) {    
                newArr[i].Price = quantity * cardProductBill[j].Price
            }
        }
        localStorage.setItem('card',JSON.stringify(newArr))
}
const handleClickPrev = (id,i) => {
    let quantity = parseInt(qualityRef.current[i].innerText)
    if(quantity <= 1) {
        const newArr = [...cardProduct]
        for(let i = 0; i < newArr.length;i++) {
            if(newArr[i].Id === id) {
                newArr.splice(i,1)
                setCardProduct(newArr)
                localStorage.setItem('card',JSON.stringify(newArr))
            }
            }
    }
    else {
        quantity -= 1
        const newArr = [...cardProduct]
        for(let j = 0; j < cardProductBill.length; j++) {
            if(id === cardProductBill[j].Id) {    
                newArr[i].Price = quantity * cardProductBill[j].Price
            }
        }
        localStorage.setItem('card',JSON.stringify(newArr))
    }
    qualityRef.current[i].innerHTML = `${quantity}`
}
useEffect(() => {
    if(JSON.parse(localStorage.getItem('card')) !== null) {
        const arr = JSON.parse(localStorage.getItem('card'))
        const uniqueArr = [...new Map(arr.map(item => [JSON.stringify(item), item])).values()];
        setCardProduct(uniqueArr)
        const products = []
        for(let i = 0; i < JSON.parse(localStorage.getItem('card')).length; i++) {
            const { Id, Price } = JSON.parse(localStorage.getItem('card'))[i]
            const product = { Id,Price }
            products.push(product)
        }
        setCardProductBill(products)
    }
    else {
        setCardProduct([])
    }
},[])
useEffect(() => {
        const newSocket = io(`${process.env.REACT_APP_IP_SEVER}`,{
            auth: {
                token: 2
            }
        });
        setSocket(newSocket)
        return () => {
            newSocket.disconnect()
        }
},[])
const totalPay = useMemo(() => {
    let total = 0
    if(JSON.parse(localStorage.getItem('Table')) && JSON.parse(localStorage.getItem('Table')).Buffe !== 'All') {
        return total = 0.0000
    }
    for(let i = 0; i < cardProductBill.length; i++) {
        total = total + cardProductBill[i].Price
    }
    return total
 },[cardProductBill])
    return ( 
        <>
            <div className="Card_mobile">
                <div className='layout_gid_card' >
                    <header className="Card_mobile-header">
                        <Link to='/' className='Card_mobile-header-icon'>
                            <FontAwesomeIcon style={{fontSize: '16px'}} icon={faAngleLeft} />
                        </Link>
                        <span>Order</span>
                        </header>
                    <div className="Card_ship">
                        <button className="Card_ship-deliver active">Deliver</button>
                        <button className="Card_ship-deliver">Pick Up</button>
                    </div>
                    <div className="Card_ship-address">
                        <h2 className="Card_ship-address-header">GoGi House</h2>
                        <div className='Card_ship-address_content'>
                            <span className="Card_ship-address-detail">
                            TTTM Vincom
                            </span>
                            <span className="Card_ship-address-country">
                            2 Đường Hùng Vương, Thới Bình, Ninh Kiều, Cần Thơ 90000, Việt Nam
                            </span>
                        </div>
                        <div className="Card_ship-address_button">
                            <span style={{marginRight: '6px'}}><FontAwesomeIcon icon={faPenToSquare} /> Edit Address</span>
                            <span>Add Note</span>
                        </div>
                    </div>
                    {/* Product */}
                    <div className='Product_card-mobile'>
                    {cardProduct.map((product,index) => (
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
                            <span>00.000đ</span>
                        </div>
                        <div style={{borderBottom: '1px solid #d4d4d4',paddingBottom:'10px'}} className='Card_checkout-price'>
                            <span>Delivery</span>
                            <span>00.000đ</span>
                        </div>
                        <div className='Card_checkout-price'>
                            <span>Total Payment</span>
                            <span>{totalPay.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫'}</span>
                        </div>
                        <div className='Card_checkout'>
                            <div className='Card_checkout-left'>
                                <span><FontAwesomeIcon style={{padding:'0',fontSize:'30px',color: 'rgba(199, 125, 77, 1)'}} icon={faAward} /></span>
                                <span className='Card_checkout-cash'>Cash</span>
                                {
                                (JSON.parse(localStorage.getItem('Table')) && JSON.parse(localStorage.getItem('Table')).Buffe !== 'All') ? (
                                   <span>00.000đ</span> 
                                ) : (
                                <span>{totalPay.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫'}</span>
                                )
                                }
                                
                            </div>
                            <span>...</span>
                        </div>
                        <div onClick={handleClickOrder} className='button_pay_mobile'>
                            <button>Order</button>
                        </div>
                    </div>

            </div>
        
        </>
     );
}

export default App;