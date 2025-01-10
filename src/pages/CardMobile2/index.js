
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft,faPenToSquare,faMinus,faPlus,faAngleRight,faCertificate,faAward,faPhone } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios'
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import { MobileContext } from '../../components/Layout/MobileLayout1';
import { Cookies } from 'react-cookie'
import VNPAY from '../../Asset/images/R.png'
import MOMO from '../../Asset/images/MOMO.png'
import HERE from '../../Asset/images/HEREPAY.jpg'
// Scss
import { Link , useNavigate} from 'react-router-dom';
import { useEffect, useRef, useState,useMemo, useContext } from 'react';
import classNames from "classnames/bind"
import styles from './CardMobile.module.scss'
const cx = classNames.bind(styles)

function App() {
    // Route
    const cookies = new Cookies()
    const navigate = useNavigate()
// State
    const [cardProduct, setCardProduct] = useState([])
    const [address, setAddress] = useState(null)
    const [payMethod, setPaymethod] = useState(null)
    const [voucher, setVoucher] = useState(0)
    const [checkNote, setCheckNote] = useState(false)
    const [phone,setPhone] = useState(cookies.get('AccessToken') !== undefined ? JSON.parse(localStorage.getItem('Account')).Sdt : '')
    const [userName, setUserName] = useState(cookies.get('AccessToken') !== undefined ? JSON.parse(localStorage.getItem('Account')).UserName : '')
    const [distance, setDistance] = useState(0);
    const [checkCard, setCheckCard] = useState([])
    const {socket} = useContext(MobileContext)
// Ref
const qualityRef = useRef([])
const noteBill = useRef()
const noteRef = useRef([])

async function CreateBill(Bill) {
    try {
        const response = await axios.post(`${process.env.REACT_APP_CALL_API}/api/v12/createbill`, Bill)
        if(response.data.massege === 'Thanh cong') {
            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                  confirmButton: "btn btn-success",
                  cancelButton: "btn btn-danger"
                },
                buttonsStyling: false
              });
            swalWithBootstrapButtons.fire({
                title: "Success!",
                text: "Cảm ơn bạn đã đặt hàng",
                icon: "success"
              }).then((result) => {
                if(result.isConfirmed) {
                    socket.emit('newBill')
                    navigate('/purchase')
                }
                else {
                    socket.emit('newBill')
                    navigate('/purchase')
                }
              })
        } else if (response.data.massege === 'Thanh Toan') {
            socket.emit('newBill')
            window.location.href = response.data.url
        }
    } catch (error) {
        alert('Có lõi xảy ra vui lòng thử lại')
        console.error('Lỗi khi thêm sản phẩm:', error);
        // Xử lý lỗi tại đây.
    }
}
const handleClickNext = (Id,i,Price,CheckCard) => {
    const productCard = CheckCard.filter((card) => card.Id === Id)
    if(productCard.length > 0) {
        let quantity = parseInt(qualityRef.current[i].innerText)
            quantity += 1
            qualityRef.current[i].innerText = `${quantity}`
            const newArr = [...CheckCard]
            newArr.forEach((Product) => {
                if(Product.Id === Id) {
                    return Product.Price = quantity * Price
                }   
            })
            const newCard = [...cardProduct]
            newCard.forEach((Product) => {
                if(Product.Id === Id) {
                    return Product.PriceNew = quantity * Price
                }   
            })
            setCardProduct(newCard)
            setCheckCard(newArr)
    }
    else {
        setCheckCard((prev) => [...prev,{Id:Id,Price:Price}])
    }
}
const handleClickChangCard = (Id,Price,CheckCard) => {
    const productCard = CheckCard.filter((card) => card.Id === Id)
    if(productCard.length > 0) {
        setCheckCard(prev => prev.filter((card) => card.Id !== Id))
    }
    else {
        setCheckCard((prev) => [...prev,{Id:Id,Price:Price}])
    }
}
const handleClickPrev = async (Id,i,Price,CheckCard) => {
    let quantity = parseInt(qualityRef.current[i].innerText)
    if(quantity <= 1) {
        try {
            const response = await axios.post(`${process.env.REACT_APP_CALL_API}/api/v12/deletecard`, {IdProduct: Id,token: cookies.get('AccessToken')})   
            if(response.data.massege === 'Thanh cong') {
                setCardProduct(prev => prev.filter(product => product.Id !== Id))
            }
        } catch (error) {
            console.error('Lỗi khi thêm sản phẩm:', error);
        }
    }
    else {
        quantity -= 1
        const newArr = [...CheckCard]
        newArr.forEach((Product) => {
            if(Product.Id === Id) {
                return Product.Price = quantity * Price
            }   
        })
        const newCard = [...cardProduct]
        newCard.forEach((Product) => {
            if(Product.Id === Id) {
                return Product.PriceNew = quantity * Price
            }   
        })
        setCardProduct(newCard)
        setCheckCard(newArr)
    }
    qualityRef.current[i].innerHTML = `${quantity}`
}

const handleClickCheckOut = () => {
    const regex = /^\d{9}$/;
    const isvalidSdt = regex.test(phone);
    if(isvalidSdt) {
        if(payMethod !== null) {
            if(sessionStorage.getItem('destination')!== undefined) {
                const swalWithBootstrapButtons = Swal.mixin({
                    customClass: {
                      confirmButton: "btn btn-success",
                      cancelButton: "btn btn-danger"
                    },
                    buttonsStyling: false
                  });
                  swalWithBootstrapButtons.fire({
                    title: "Giao tại",
                    text: `${sessionStorage.getItem('Address')}`,
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Đồng ý",
                    cancelButtonText: "Từ chối",
                    reverseButtons: true
                  }).then((result) => {
                    if (result.isConfirmed) {
                        console.log(noteRef)
                        const result = checkCard.reduce((acc,curr, index) => {
                            if(noteRef.current[curr.Id].value.length === 0) {
                                const temporary = {
                                    Id: curr.Id,
                                    Price: curr.Price
                                }
                            return [...acc,temporary]
                            }
                            else {
                                const temporary = {
                                    Id: curr.Id,
                                    Price: curr.Price,
                                    Note: noteRef.current[curr.Id].value
                                }
                            return [...acc,temporary]
                            }
                        },[])
                        const bill = {
                            TotalPrice: totalPay[1],
                            Data: result,
                            Address: `${sessionStorage.getItem('Address')}`,
                            Name: userName,
                            Sdt: phone,
                            Destination: sessionStorage.getItem('destination'),
                            Note: noteBill.current.value,
                            PayMethod:payMethod,
                            token: cookies.get('AccessToken')
                        }
                        CreateBill(bill)
                  }
                  })
            }
            else {
                if(address === null || address === '') {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Vui lòng nhập địa chỉ cụ thể",
                        footer: '<a href="#">Why do I have this issue?</a>'
                      });
                }else {
                    const swalWithBootstrapButtons = Swal.mixin({
                        customClass: {
                          confirmButton: "btn btn-success",
                          cancelButton: "btn btn-danger"
                        },
                        buttonsStyling: false
                      });
                      swalWithBootstrapButtons.fire({
                        title: "Giao tại",
                        text: `${address}, ${sessionStorage.getItem('Address')}`,
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonText: "Đồng ý",
                        cancelButtonText: "Từ chối",
                        reverseButtons: true
                      }).then((result) => {
                        if (result.isConfirmed) {
                            const result = checkCard.reduce((acc,curr) => {
                                if(noteRef.current[curr.Id].value.length === 0) {
                                    const temporary = {
                                        Id: curr.Id,
                                        Price: curr.Price
                                    }
                                return [...acc,temporary]
                                }
                                else {
                                    const temporary = {
                                        Id: curr.Id,
                                        Price: curr.Price,
                                        Note: noteRef.current[curr.Id].value
                                    }
                                return [...acc,temporary]
                                }
                            },[])
                            const bill = {
                                TotalPrice: totalPay[1],
                                Data: JSON.stringify(result),
                                Address: `${sessionStorage.getItem('Address')}`,
                                Name: userName,
                                Destination: sessionStorage.getItem('destination'),
                                PayMethod:payMethod,
                                token: cookies.get('AccessToken')
                            }
                            CreateBill(bill)
                        } else if (
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
            }
        }
        else {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Vui lòng chọn phương thức thanh toán !",
                footer: '<a href="#">Why do I have this issue?</a>'
              });
        }
    }else {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Vui lòng nhập số điện thoại !",
            footer: '<a href="#">Why do I have this issue?</a>'
          });
    }
}
const handleClickCheckVoucher = async () => {
    let priceVoucher = 0
    const { value: voucher } = await  Swal.fire({
        title: "Nhập mã giảm giá",
        input: "text",
        inputValidator: async (value) => {
          if (!value) {
            return "Không hợp lệ !";
          }
          else {
            try {
                const response =  await axios.post(`${process.env.REACT_APP_CALL_API}/api/v12/checkvoucher`, {voucher: value,token: cookies.get('AccessToken')})
                if(response.data.massege === "voucher khong ton tai") {
                  setVoucher(0)
                  return `Voucher không hợp lệ !`
                }
                else {
                  priceVoucher = response.data.data[0].PriceVoucher
                  setVoucher(response.data.data[0].PriceVoucher)
                  return null; 
                }
              } catch (error) {
                  console.error('Lỗi khi thêm sản phẩm:', error);
              }
          }
        }
      });
      if (voucher) {
        Swal.fire(`Bạn được giảm ${priceVoucher.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫'}`);
      }
}
useEffect(() => {
    if(cookies.get('AccessToken') !== undefined) {
        axios.all([
            axios.get(`${process.env.REACT_APP_CALL_API}/api/v12/showcard?token=${cookies.get('AccessToken')}`),
          ])
            .then(axios.spread((Card,) => {
                if(Card.data.massege === 'Thanh Cong') {
                    setCardProduct(Card.data.data)
                }
            
            }))
            .catch (err => {
                console.error()
            })
    }
},[])
useEffect(() => {
    if(sessionStorage.getItem('destination')) {
        const start = sessionStorage.getItem('destination') ? sessionStorage.getItem('destination').split(',') : null
        const end = ['10.045260','105.780017']
        axios.all([
            axios.get(`https://api.mapbox.com/directions/v5/mapbox/driving/${start[1]}%2C${start[0]}%3B${end[1]}%2C${end[0]}?alternatives=true&geometries=geojson&language=en&overview=full&steps=true&access_token=pk.eyJ1IjoibXlob2FuZzEyMyIsImEiOiJjbTFlZzF2d2cydWR0MmtvajFwYnB5OW42In0.-CeNZom6cnNBEsAWVumPuQ`),
          ])
            .then(axios.spread((Distance) => {
                if(Distance.data.code === "Ok") {
                    setDistance(Distance.data.routes[Distance.data.routes.length-1].distance)
                }
            }))
            .catch (err => {
                console.error()
            })
    }
},[])
const totalPay = useMemo(() => {
    let total = 0
    let totalAll = 0
    let totalShip = 0
    for(let i = 0; i < checkCard.length; i++) {
        total = total + checkCard[i].Price
    }
    // totalShip = Math.round(distance/1000) * 4500
    totalAll = (total + 15000) - voucher
    return [total,totalAll,totalShip]
 },[checkCard,voucher])
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
                        <button className={cx('Card_ship-deliver','active')}>Deliver</button>
                        <button className={cx('Card_ship-deliver')}>Pick Up</button>
                    </div>
                    <div className={cx('Card_ship-address')}>
                            <h2 className={cx('Card_ship-address-header')}>GOGI HOUSE</h2>
                        <div className={cx('Card_ship-address_content')}>
                            <span className={cx('Card_ship-address-detail')}>
                            <p style={{width:'100%'}}><FontAwesomeIcon style={{paddingRight:'2px'}} icon={faPhone} />(84<FontAwesomeIcon style={{padding:'0',fontSize:'70%',paddingBottom:'1px'}} icon={faPlus} />) {phone}</p>
                            </span>
                            <span className={cx('Card_ship-address-country')}>
                                {sessionStorage.getItem('Address')}
                            </span>
                        </div>
                        <div className={cx('Card_ship-address_button')}>
                            <span style={{marginRight: '6px'}}><FontAwesomeIcon icon={faPenToSquare} /> Edit Address</span>
                            <span onClick={() => setCheckNote(true)}>Add Note</span>
                            <textarea style={checkNote ? {display:'block'}:{display:'none'}} ref={noteBill} className={cx('Card_ship_address_button_note-container')} placeholder='Nhập ghi chú'></textarea>
                        </div>
                    </div>
                    {/* Product */}
                    <div className={cx('Product_card-mobile')}>
                    {cardProduct.map((product,index) => (
                        <div  key={index}>
                        <input checked={checkCard.some((pr) => pr.Id === product.Id)} id={`CheckBox_Product_card_${index}`}className={cx('CheckBox_Product_card')} type="checkbox" disabled   />
                        <label htmlFor={`CheckBox_Product_card_${index}`} className={cx('Product_card-item')}>
                            <div onClick={() => handleClickChangCard(product.Id,product.Price,checkCard)} className={cx('product_card-item_left')}>
                                <div className={cx('Product_card-item_img')}>
                                     <img src={`${process.env.REACT_APP_CALL_API}/api/v12/showimgproduct/${product.Img}`}  style={{width: '100%', height: '100%',objectFit: 'cover'}} />
                                </div>
                                <div className={cx('Product_card-item_name')}>
                                    <span style={{fontSize: '14px',color:'#333'}}>{product.Name}</span>
                                    {product.PriceNew !== undefined ? (
                                        <span style={{fontSize: '14px',color: '#7b7b7b'}}>{product.PriceNew.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫'}</span>
                                    ) : (
                                        <span style={{fontSize: '14px',color: '#7b7b7b'}}>{product.Price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫'}</span>
                                    )}
                                </div>
                                </div>
                                <div className='Product_card-item_quality'>
                                    <span onClick={() => handleClickPrev(product.Id,index,product.Price,checkCard)} className='Product_card-item_quality-icon'><FontAwesomeIcon icon={faMinus} /></span>
                                    <span ref={e => qualityRef.current[index] = e} style={{padding: '0px 8px',fontSize:'15px',fontWeight:'600'}}>1</span>
                                    <span onClick={() => handleClickNext(product.Id,index,product.Price,checkCard)} className='Product_card-item_quality-icon'><FontAwesomeIcon icon={faPlus} /></span>
                                </div>
                        </label>
                        
                            <textarea ref={e => noteRef.current[product.Id] = e} style={checkCard.some((pr) => pr.Id === product.Id) ? {display:'block'} : {display:'none'}} className={cx('Product_card_note')} placeholder='Ghi chú'></textarea>
                        </div>
                    ))}
                        </div>
                    </div>
                    <span className={cx('fake_border')}></span>
                    {/* Coupon */}
                    <div className={cx('layout_gid_card_footer')}>
                        <div  onClick={handleClickCheckVoucher} className={cx('Card_coupon_container')}>
                            <div className={cx('Card_coupon_container-left')}>
                                <FontAwesomeIcon style={{fontSize: '20px',paddingRight: '14px',color: 'rgba(199, 125, 77, 1)'}} icon={faCertificate} />
                                <h2>Mã giảm giá</h2>
                            </div>
                            <FontAwesomeIcon style={{fontSize: '16px'}} icon={faAngleRight} />
                        </div>
                        <h2 className={cx('Payment_header')}>Payment Summary</h2>
                        <div className={cx('Card_checkout-price')}>
                            <span>Price</span>
                            <span>{totalPay[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫'}</span>
                        </div>
                        <div className={cx('Card_checkout-price')}>
                            <span>Giảm giá</span>
                            <span>- {voucher.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫'}</span>
                        </div>
                        <div className={cx('Card_checkout-price')}>
                            <span>Delivery</span>
                            <span>15.000đ</span>
                        </div>
                        <div className={cx('Card_checkout-pay')}>
                            <span>Phương thức thanh toán</span>
                            <div className={cx('pay_method_container')}>
                                        <input checked = {payMethod === '1'} onChange={(e) => setPaymethod(e.target.value)} className={cx('pay_method_item_check')} type='radio' id="vnpay" name="paymethod" value="1"/>
                                            <label htmlFor='vnpay' className={cx('pay_method_item')}>
                                                <img className={cx('pay_method_item_logo')} src={VNPAY}/>
                                            </label>
                                                <input checked = {payMethod === '2'} onChange={(e) => setPaymethod(e.target.value)}  className={cx('pay_method_item_check')} type='radio' id="momo" name="paymethod" value="2"/>
                                            <label htmlFor='momo' className={cx('pay_method_item')}>
                                                <img  style={{height:'30px'}} className={cx('pay_method_item_logo')} src={MOMO}/>
                                            </label>
                                                <input checked = {payMethod === '3'} onChange={(e) => setPaymethod(e.target.value)}  className={cx('pay_method_item_check')} type='radio' id="here" name="paymethod" value="3"/>
                                            <label htmlFor='here' className={cx('pay_method_item')}>
                                                <img style={{height:'30px',width:'50px'}} className={cx('pay_method_item_logo')} src={HERE}/>
                                            </label>
                                    </div>
                        </div>
                        <div className={cx('Card_checkout')}>
                            <div className='Card_checkout-left'>
                                <span><FontAwesomeIcon style={{padding:'0',fontSize:'30px',color: 'rgba(199, 125, 77, 1)'}} icon={faAward} /></span>
                                <span className='Card_checkout-cash'>Cash</span>  
                                <span>{totalPay[1].toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫'}</span>
                            </div>
                            <span>...</span>
                        </div>
                        <div onClick={handleClickCheckOut} className={cx('button_pay_mobile')}>
                            <button>Order</button>
                        </div>
                    </div>

            </div>
        
        </>
     );
}

export default App;