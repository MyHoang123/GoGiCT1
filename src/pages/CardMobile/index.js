
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft,faPenToSquare,faMinus,faPlus,faAngleRight,faCertificate,faAward } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios'
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import { MobileContext } from '../../components/Layout/MobileLayout'
// Scss
import "./CardMobile.scss"
import { Link , useNavigate} from 'react-router-dom';
import { useEffect, useRef, useState,useMemo,useContext } from 'react';

function App() {
    // Route
    const navigate = useNavigate();
// State
    const [checkNote,setCheckNote] = useState(false)
    const [cardProduct,setCardProduct] = useState(JSON.parse(localStorage.getItem('card')) !== null ? JSON.parse(localStorage.getItem('card')) : [])
// Context
    const {cookies,socket} = useContext(MobileContext)
// Ref
        const qualityRef = useRef([])
        const noteProduct = useRef([])
// Gửi dữ liệu lên API
async function createBill(bill) {
    try {
       const response = await axios.post(`${process.env.REACT_APP_IP_SEVER}/api/v12/createbillorder`, bill);
       if(response.data.massege === 'Thanh cong') {
            socket.emit('newBill')
            localStorage.removeItem('card')
            navigate(`/order/billorder?token=${cookies.get('AccessTokenOrder')}`)
       }
    } catch (error) {
        console.error('Lỗi khi thêm sản phẩm:', error);
        // Xử lý lỗi tại đây.
    }
}
const handleClickOrder = () => {
    if(JSON.parse(localStorage.getItem('card')).length > 0) {
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
                const result =  JSON.parse(localStorage.getItem('card')).reduce((acc,curr) => {
                    if(noteProduct.current[curr.Id].value.length === 0) {
                        const temporary = {
                            Id: curr.Id,
                            Price: curr.Price,
                            quantity: qualityRef.current[curr.Id].innerHTML,
                            Note: '',
                            Status: 0
                        }
                    return [...acc,temporary]
                    }
                    else {
                        const temporary = {
                            Id: curr.Id,
                            Price: curr.Price,
                            quantity: qualityRef.current[curr.Id].innerHTML,
                            Note: noteProduct.current[curr.Id].value,
                            Status: 0
                        }
                    return [...acc,temporary]
                    }
                },[])
                const data = {
                    TotalPrice: totalPay,
                    Data: result,
                    token: cookies.get('AccessTokenOrder')
                }
                createBill(data)
                // 
            //   swalWithBootstrapButtons.fire({
            //     title: "Thành Công!",
            //     text: "Bạn Đã Đặt Món Thành Công !",
            //     icon: "success"
            //   }).then((result) => {
            //     if(result.isConfirmed) {
            //         navigate(`/order/buffe/${JSON.parse(localStorage.getItem('Table')).Buffe}/order/billorder`)
            //         }
            //         else {
            //         navigate(`/order/buffe/${JSON.parse(localStorage.getItem('Table')).Buffe}/order/billorder`)
            //         }
            //   });
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
const handleClickNext = (id) => {
    let quantity = parseInt(qualityRef.current[id].innerText)
        quantity += 1
        qualityRef.current[id].innerText = `${quantity}`
}
const handleClickPrev = (id) => {
    let quantity = parseInt(qualityRef.current[id].innerText)
    if(quantity <= 1) {
        const newArr = JSON.parse(localStorage.getItem('card'))
        for(let i = 0; i < newArr.length;i++) {
            if(newArr[i].Id === id) {
                newArr.splice(i,1)
                localStorage.setItem('card',JSON.stringify(newArr))
                setCardProduct(newArr)
            }
            }
    }
    else {
        quantity -= 1
    }
    qualityRef.current[id].innerHTML = `${quantity}`
}
const totalPay = useMemo(() => {
    let total = 0
    if(JSON.parse(localStorage.getItem('Table')) && JSON.parse(localStorage.getItem('Table')).Buffe !== 'All') {
        return total = 0.0000
    }
    // for(let i = 0; i < cardProductBill.length; i++) {
    //     total = total + cardProductBill[i].Price
    // }
    return total
 },[])
    return ( 
        <>
            <div className="Card_mobile">
                <div className='layout_gid_card' >
                    <header className="Card_mobile-header">
                        <Link to={`/order?token=${cookies.get('AccessTokenOrder')}`} className='Card_mobile-header-icon'>
                            <FontAwesomeIcon style={{fontSize: '16px'}} icon={faAngleLeft} />
                        </Link>
                        <span>Giỏ hàng</span>
                        </header>
                    <div className="Card_ship">
                        <button className="Card_ship-deliver">Deliver</button>
                        <button className="Card_ship-deliver active">Pick Up</button>
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
                            <span onClick={() => setCheckNote(true)}>Add Note</span>
                        </div>
                    </div>
                    {/* Product */}
                    <div className='Product_card-mobile'>
                    {cardProduct.map((product,index) => (
                        <div key={index}>
                            <div className='Product_card-item'>
                                <div className='product_card-item_left'>
                                    <div className='Product_card-item_img'>
                                            <img src={`${process.env.REACT_APP_IP_SEVER}/api/v12/showimgproduct/${product.Img}`}/>
                                    </div>
                                    <div className='Product_card-item_name'>
                                        <span style={{fontSize: '14px',color:'#333'}}>{product.Name}</span>
                                        <span style={{fontSize: '14px',color: '#7b7b7b'}}>Size L</span>
                                    </div>
                                    </div>
                                    <div className='Product_card-item_quality'>
                                        <span onClick={() => handleClickPrev(product.Id)} className='Product_card-item_quality-icon'><FontAwesomeIcon icon={faMinus} /></span>
                                        <span ref={e => qualityRef.current[product.Id] = e} style={{padding: '0px 8px',fontSize:'15px',fontWeight:'600'}}>1</span>
                                        <span onClick={() => handleClickNext(product.Id)} className='Product_card-item_quality-icon'><FontAwesomeIcon icon={faPlus} /></span>
                                    </div>
                            </div>
                                    <textarea ref={e => noteProduct.current[product.Id] = e} className={checkNote ? 'note_product_order open' : 'note_product_order'} placeholder='Them ghi chu'></textarea>
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