
import axios from 'axios'
import io from 'socket.io-client';
import Footer from '../DefaultLayout/Footer';
import { useEffect, useRef, useState,useMemo, memo, useCallback } from 'react'
import { Cookies } from 'react-cookie'
import {Link, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import Map from './map'
import logo from '../../../Asset/images/logo-gogi-house-X5 (1).png'
import styles from './Card.module.scss'
import classNames from "classnames/bind"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faMinus, faPlus, faSpinner, faLocationDot, faPhone } from '@fortawesome/free-solid-svg-icons'
import {faUser as faUserRegular } from '@fortawesome/free-regular-svg-icons'; 
import { useDebounce } from '~/hooks'
import card from "../../../Asset/images/cart.png"
const cx = classNames.bind(styles)
function Card() {
    const cookie = new Cookies()
    const navigate = useNavigate()
    // State
    const [cards, setCards] = useState([])
    const [ll, setLl] = useState(null)
    const [address, setAddress] = useState(null)
    const [location, setLocation] = useState('');
    const [distance, setDistance] = useState(0);
    const [modalCheckout, setModalCheckout] = useState(false)
    const [socket, setSocket] = useState(null)
    const [CheckCard, setCheckCard] = useState([])
    const [voucher, setVoucher] = useState(0)
    const [vouchertext,setVouchertext] = useState('')
    const [searchValue, setSearchValue] = useState('')
    const [loadSearch, setLoadSearch] = useState(false);
    const [editInfo, setEditInfo] = useState(false);
    const [userName, setUserName] = useState(cookie.get('AccessToken') !== undefined ? JSON.parse(localStorage.getItem('Account')).UserName : '')
    const [phone,setPhone] = useState(cookie.get('AccessToken') !== undefined ? JSON.parse(localStorage.getItem('Account')).Sdt : '')
    const [modalMap,setModalMap] = useState(false)
    // Debounce
    const debounce = useDebounce(searchValue,500)
    // Ref
    const quantityProductPay = useRef([])
    const cardAllCheck = useRef()
    const notiCoupon = useRef()
    const modalCheckoutRef = useRef()
    const noteBill = useRef()
    const noteRef = useRef([])
       // Gửi dữ liệu lên API
   async function checkvoucher(voucher) {
    try {
      const response =  await axios.post('http://localhost:8080/api/v12/checkvoucher', voucher)
      if(response.data.massege === "voucher khong ton tai") {
          Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Voucher không hợp lệ !",
              footer: '<a href="#">Why do I have this issue?</a>'
            });
        setVoucher(0)
      }
      else {
        setVoucher(response.data.data[0].PriceVoucher)
        notiCoupon.current.innerText = 'Thành Công'
        notiCoupon.current.style.color = '#3a5d2e'
        notiCoupon.current.style.display = 'block'
      }
    } catch (error) {
        console.error('Lỗi khi thêm sản phẩm:', error);
        // Xử lý lỗi tại đây.
    }
    }
    async function deleteCard(id) {
        try {
            const response = await axios.post('http://localhost:8080/api/v12/deletecard', id)
            if(response.data.massege === 'Thanh cong') {
                setCards(prev => prev.filter(product => product.Id !== id.IdProduct))
                setCheckCard(prev => prev.filter(product => product.Id !== id.IdProduct))
            }
        } catch (error) {
            console.error('Lỗi khi thêm sản phẩm:', error);
            // Xử lý lỗi tại đây.
        }
    }
        async function CreateBill(Bill) {
            try {
                const response = await axios.post('http://localhost:8080/api/v12/createbill', Bill)
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
                            socket.emit('newBill',response.data.data)
                            navigate('/purchase')
                        }
                        else {
                            socket.emit('newBill',response.data.data)
                            navigate('/purchase')
                        }
                      })
                }
            } catch (error) {
                alert('Có lõi xảy ra vui lòng thử lại')
                console.error('Lỗi khi thêm sản phẩm:', error);
                // Xử lý lỗi tại đây.
            }
        }
    // }
    const handleClickChangCard = useCallback((Id,Price,CheckCard) => {
            const productCard = CheckCard.filter((card) => card.Id === Id)
            if(productCard.length > 0) {
                setCheckCard(prev => prev.filter((card) => card.Id !== Id))
            }
            else {
                setCheckCard((prev) => [...prev,{Id:Id,Price:Price}])
            }
        },[])
        const handleClickAllCard = useCallback((e,cards) => {
            if(e.target.checked === true) {
                const newArr = cards.reduce((acc,cur) => {
                    if(cur.Status === 'visible') {
                        return [...acc,{Id:cur.Id,Price:cur.Price}]
                    }else {
                        return [...acc]
                    }
                },[])
                setCheckCard(prev => [...prev,...newArr])
            }
            else{
                setCheckCard([])
            }
        },[])
        const handleClickNextPay = useCallback((id,i,CheckCard,cards) => {
            let quantity = parseInt(quantityProductPay.current[i].innerText)
            quantity += 1
            quantityProductPay.current[i].innerText = `${quantity}`
            const newArr = [...CheckCard]
            for(let j = 0; j < cards.length; j++) {
                if(id === cards[j].Id) {    
                    newArr[i].Price = quantity * cards[j].Price
                }
            }
            setCheckCard(newArr)
        },[])
        const handleClickPrevPay = useCallback((id,i,CheckCard,cards) => {
            let quantity = parseInt(quantityProductPay.current[i].innerText)
            if(quantity <= 1) {
                quantity = 1
            }
            else {
                quantity -= 1
            }
            quantityProductPay.current[i].innerHTML = `${quantity}`
            const newArr = [...CheckCard]
            for(let j = 0; j < cards.length; j++) {
                if(id === cards[j].Id) {    
                    newArr[i].Price = quantity * cards[j].Price
                }
            }
            setCheckCard(newArr)
        },[])
        const handleCheckVoucher = useCallback((text) => {
            const voucher = {
                voucher: text,
                token: cookie.get('AccessToken')
            }
            checkvoucher(voucher)
        },[])
        const handleSetTextVoucher = useCallback((e) => {
            if(notiCoupon.current.innerText === 'Thành Công') {
                 setVoucher(0)
                 notiCoupon.current.style.display = 'none'
            }
            setVouchertext(e.target.value)
        },[])
        const handleChangeSearch = useCallback((e) => {
            if(cardAllCheck.current.checked === true) {
                cardAllCheck.current.checked = false
            }
            setSearchValue(e)
            setLoadSearch(true)
        },[])
        const handleClickLogOut = () => {
            socket.disconnect();
            localStorage.removeItem('Account')
            cookie.remove('AccessToken', { path: '/' })
            navigate('/')
        }
        const handleClickRemoveModalCheckout = () => {
            setModalCheckout(false)
            setModalMap(false)
            modalCheckoutRef.current.style.transform = ''
        }
        const handleClickDeleteCard = useCallback((id,i) => {
            const IdCard = {
                IdProduct: id,
                token: cookie.get('AccessToken')
            }
            // if(checkBoxCard.current[i].checked === true) {
            //     checkBoxCard.current[i].checked = false
            //     deleteCard(IdCard)
            // }
            deleteCard(IdCard)
        },[])
        const handleClickOpenMap = useCallback(() => {
            setModalMap(true)
            modalCheckoutRef.current.style.transform = 'translateX(-210px)'
        },[])
        const handleClickPay = useCallback((Check) => {
        if(JSON.parse(localStorage.getItem('Account')) !== null ) {
        if(Check > 0) {
            setModalCheckout(true)
         }
         else {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Vui lòng chọn sản phẩm !",
                footer: '<a href="#">Why do I have this issue?</a>'
              });
         }
        }
        else {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Vui lòng đăng nhập",
                footer: '<a href="#">Why do I have this issue?</a>'
              });
        }
    },[])
    const handleClickCheckOut = () => {
        const regex = /^\d{9}$/;
        const isvalidSdt = regex.test(phone);
        if(isvalidSdt) {
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
                        const result = CheckCard.reduce((acc,curr, index) => {
                            if(noteRef.current[index].value.length === 0) {
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
                                    Note: noteRef.current[index].value
                                }
                            return [...acc,temporary]
                            }
                        },[])
                        const bill = {
                            TotalPrice: totalPay[1],
                            Data: JSON.stringify(result),
                            Address: `${sessionStorage.getItem('Address')}`,
                            Name: userName,
                            Sdt: phone,
                            Destination: sessionStorage.getItem('destination'),
                            Note: noteBill.current.value,
                            token: cookie.get('AccessToken')
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
                            const result = CheckCard.reduce((acc,curr,index) => {
                                if(noteRef.current[index].value.length === 0) {
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
                                        Note: noteRef.current[index].value
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
                                token: cookie.get('AccessToken')
                            }
                            CreateBill(bill)
                        } else if (
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
    useEffect(() => {
        if(cookie.get('AccessToken') !== undefined) {
            const newSocket = io('http://localhost:8080',{
                auth: {
                    token: cookie.get('AccessToken')
                }
               })
               setSocket(newSocket)
            axios.all([
                axios.post('http://localhost:8080/api/v12/showcard',{
                    token: cookie.get('AccessToken')
                }),
              ])
                .then(axios.spread((Card, ) => {
                    console.log("🚀 ~ .then ~ Card:", Card)
                    setCards(Card.data.data)
                }))
                .catch (err => {
                    console.error()
                })
                return () => newSocket.disconnect()
        }
    },[])
    useEffect(() => {
        if(!debounce.trim()) {
            const result = [...cards]
            for(let i in result){         
                result[i].Status = 'visible'
            }
            setCards(result)
            setLoadSearch(false)
            return
        }
        // const result = []
        const newArr = [...cards]
        for(let i in newArr){
            if(newArr[i].Name.toLowerCase().includes(debounce.toLowerCase())) {
                newArr[i].Status = 'visible'
            }
            else {
                newArr[i].Status = 'hiden'
            }
        }
        setCards(newArr)
        // cards.map(product => 
        //     product.Name.toLowerCase().includes(debounce.toLowerCase()) ? {...product,Status: 'visible'} : result.push({...product,Status: 'hiden'})
        // )
        // setCards(result)
        setLoadSearch(false)
     },[debounce])
    const totalPay = useMemo(() => {
        let total = 0
        let totalAll = 0
        let totalShip = 0
        for(let i = 0; i < CheckCard.length; i++) {
            total = total + CheckCard[i].Price
        }
        totalShip = Math.round(distance/1000) * 4500
        totalAll = (total + totalShip) - voucher
        return [total,totalAll,totalShip]
     },[CheckCard,voucher])
     const checkCardNull = useMemo(() => {
        if(cards.length !== 0) {
            const newArr = cards.filter((product) => product.Status === 'hiden')
            if(newArr.length === cards.length) {
                return false
            }
                return true
        }
        else {
            return false
        }
     },[cards])
     const handleInputChange = (event) => {
        setLocation(event.target.value);
      };
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
    // useEffect(() => {
    //     if(cards.length > 0 && CheckCard.length > 0) {
    //         for(let i in cards) {
    //             for(let j in CheckCard) {
    //                 if(cards[i].Id !== CheckCard[j].Id) {
    //                     checkBoxCard.current[cards[i].Id].checked = false
    //                 }
    //             }
    //     }
    //     }
    // },[CheckCard,cards])
    if(cookie.get('AccessToken') !== undefined) {
        return ( 
            <>
                <div className={cx('content')}>
                    <nav className={cx('navbar_container')}>
                        <ul className={cx('navbar_content_list')}>
                        <li onClick={() => navigate('/')} >Trang chủ</li>
                        <li >Thực đơn</li>
                        <li >Đặt bàn</li>
                        <li >Trợ giúp</li>
                        <li >Thông báo</li>
                {JSON.parse(localStorage.getItem('Account')) === null ? (
                    null
                        ) : (
                        <li className={cx('header_navbar-item')} >
                        <div className={cx('header_navbar_img-user')}>
                            <img style={{borderRadius:'50%'}} src={JSON.parse(localStorage.getItem('Account')).Classify === 'user' ? `http://localhost:8080/api/v12/avtuser/${JSON.parse(localStorage.getItem('Account')).Avt}`: `${JSON.parse(localStorage.getItem('Account')).Avt}` } className={cx('header_navbar-user-img')}/>
                        </div>
                            <span className={cx('header_navbar-user-name')}>
                                {JSON.parse(localStorage.getItem('Account')).UserName}
                            </span>
                            <ul className={cx('header_navbar-user-menu')}>
                                <li style={{padding:'0'}} className={cx('header_navbar-user-item')}>
                                    <Link to='/user'>Tài khoản của tôi</Link>
                                </li>
                                <li style={{padding:'0'}} className={cx('header_navbar-user-item')}>
                                    <Link to='/purchase'>Đơn mua </Link>     
                                </li>                           
                                <li style={{padding:'0'}} className={cx('header_navbar-user-item')}>
                                    <Link to='/card'>Giỏ hàng </Link>                   
                                </li>             
                                <li onClick={handleClickLogOut} style={{padding:'0'}} className={cx('header_navbar-user-item')}>
                                    <span>Đăng xuất</span>                                
                                </li>
                            </ul>
                        </li>  
                        )}
                        </ul>
                    </nav>
                    <div className={cx('body_card')}>
                        <div className={cx('header_body_card')}>
                            <div className={cx('header_body_card-grid')}>
                                <div onClick={() => navigate('/')} className={cx('header_body_card-left')}>
                                    <div className={cx('header_body_card-lef_content')}>
                                        <div className={cx('header_body_card-left_item')}>
                                            <img src={logo} />
                                        </div>
                                        <div className={cx('header_body_card-left_item')}>
                                        <h1>Giỏ hàng</h1>
                                        </div>
                                    </div>
                                </div>
                                <div className={cx('header_body_card-right')}>
                                    <div className={cx('header_body_card-right_content')}>
                                                <div className={cx('header_body-card-right_input')}>
                                                    <input onChange={(e) => handleChangeSearch(e.target.value)} style={{width:'100%',height:'100%'}} type='text' placeholder='Tìm kiếm' />
                                                    <FontAwesomeIcon style={{margin:'auto',fontSize:'20px',position:'absolute',right:'4px',top:'8px'}} className={loadSearch ? cx('search_load_card_open') : cx('search_load_card')} icon={faSpinner} />
                                                </div>
                                                <div className={cx('header_body_card-right_icon')}>
                                                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                                                </div>
                                        </div>
                                </div>
                            </div>
                        </div>
                            <div className={cx('body_card_content')}>
                                    <div className={cx('body_card_content_container_address')}>
                                        <FontAwesomeIcon style={{color:'#99000'}} icon={faLocationDot} />
                                    </div>
                                <div className={cx('body_card_content_container')}>
                                    <div className={cx('body_card_content_container-item-product')}>    
                                        <div className={cx('body_card_content_container-item-product_header')}>
                                            <div className={cx('body_card_content_container-item-product_header-left')}>
                                                <div className={cx('body_card_content_container-item-product_header-left-checkbox')}>
                                                <input ref={cardAllCheck} onChange={(e) => handleClickAllCard(e,cards)} type="checkbox" className={cx('cyberpunk-checkbox')}/>
                                                </div>
                                                <h2>Sản phẩm</h2>
                                            </div>
                                            <div className={cx('body_card_content_container-item-product_header-right')}>
                                                <h2>Giá</h2>
                                                <h2>Hình Ảnh</h2>
                                                <h2>Xóa</h2>
                                            </div>
                                        </div>
                                                     {cards.map((card,i) => (
                                                            <label htmlFor={`checkedProduct${i}`} key={i} className={card.Status === 'visible' ? cx('body_card_content_container-item-product_body') : cx('body_card_content_container-item-product_body_unative')}>
                                                                <div className={cx('body_card_content_container-item-product_body-name')}>
                                                                    <div className={cx('body_card_content_container-item-product_body-name-checkbox')}>
                                                                        <input checked={CheckCard.some((product) => product.Id === card.Id)} id={`checkedProduct${i}`} name='product' onChange={(e) => handleClickChangCard(card.Id,card.Price,CheckCard)} type="checkbox" className={cx('cyberpunk-checkbox')}/>
                                                                    </div>
                                                                    <h2>{card.Name}</h2>
                                                                </div>
                                                                <div className={cx('body_card_content_container-item-product_body-sl-price-img')}>
                                                                    <h2>{card.Price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫'}</h2>
                                                                    <div className={cx('body_card_content_container-item-product_body-sl-price-img-item')}>
                                                                        <img style={{width:'60%',height:'100%',objectFit:'cover'}} src={`http://localhost:8080/api/v12/showimgproduct/${card.Img}`}/>
                                                                    </div>
                                                                    <div className={cx('body_card_content_container-item-product_body-delete')}>
                                                                        <button  onClick={() => handleClickDeleteCard(card.Id,i)} className="button_delete">
                                                                            <svg viewBox="0 0 448 512" className="svgIcon_delete"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path></svg>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </label>
                                                        ))}
                                            <div className={checkCardNull ? 'img_card-container' : 'img_card-container_open'}>
                                                <img className='img_card-null' src={card}/>
                                                <h2>Không tìm thấy sản phẩm</h2>
                                            </div>
                                    </div>
                                    <div className={cx('body_card_content_container-item-checkout')}>
                                        <div className='model_pay'>
                                            <div className="master-container">  
                                                        <div className="card_pay cart_pay">
                                                            <label className="title_cartpay">Your cart</label>
                                                            {CheckCard.map((product,i) =>(
                                                                (cards.map((productCard) => (
                                                                    (product.Id === productCard.Id ? (
                                                                    <div key={i} className="products_cartpay">                                                                      
                                                                                    <div className="product_cartpay">
                                                                                        <div className='product_cartpay_img'>
                                                                                        <img className="product_cartpay_img" src={`http://localhost:8080/api/v12/showimgproduct/${productCard.Img}`} style={{width: '100%', height: '100%',objectFit: 'cover'}} />
                                                                                        </div>
                                                                                    <div>
                                                                                    <div className='name_pay'>
                                                                                        <span>{productCard.Name}</span>
                                                                                        <p>Size M</p>
                                                                                    </div>
                                                                                    </div>
                                                                                    
                                                                                    <div className="quantity_cartpay">
                                                                                        <button onClick={() => handleClickPrevPay(product.Id,i,CheckCard,cards)}>
                                                                                            <FontAwesomeIcon icon={faMinus} />
                                                                                        </button>
                                                                                    <label ref={e => quantityProductPay.current[i] = e}>1</label>
                                                                                        <button onClick={() => handleClickNextPay(product.Id,i,CheckCard,cards)}>
                                                                                            <FontAwesomeIcon icon={faPlus} />  
                                                                                        </button>
                                                                                    </div>
                                                                                    <label className="price_cartpay small_cartpay">{product.Price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫'}</label>
                                                                                     <textarea ref={(e) => noteRef.current[i] = e} className={cx('note_card')} placeholder='Thêm ghi chú'></textarea>
                                                                                </div>                                        
                                                                    </div>
                                                                    ):null)
                                                                )))
                                                            ))}
                                                        </div>
    
                                                        <div className="card_pay coupons_cartpay">
                                                            <label className="title_cartpay">Apply coupons <span ref={notiCoupon}  className='noti-coupon' style={{paddingLeft: '8px',fontSize:'14px'}}></span></label>                           
                                                            <div className="form_cartpay">
                                                                <input value={vouchertext} onChange={(e) => handleSetTextVoucher(e)} type="text" placeholder="Apply your coupons here" className="input_field_cartpay"/>
                                                                <button onClick={() => handleCheckVoucher(vouchertext)} className="btn_pay"> Check
                                                                </button>
                                                            </div>
                                                        </div>
    
                                                        <div className="card_pay checkout_cartpay">
                                                            <label className="title_cartpay">Checkout</label>
                                                            <div className="details_cartpay">
                                                            <span>Tổng tiền hàng:</span>
                                                            <span>{totalPay[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫'}</span>
                                                            <span>Voucher giảm giá:</span>
                                                            <span>{voucher.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫'}</span>
                                                            <span>Tổng tiền phí vận chuyển: {Math.round(distance / 1000)}km</span>
                                                            <span>{totalPay[2].toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫'}</span>
                                                            </div>
                                                            <div className="checkout--footer_cartpay">
                                                            <label className="price_cartpay">{totalPay[1].toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫'}          
                                                                </label>
                                                            <button onClick={() => handleClickPay(CheckCard.length)} style={{fontSize: '16px'}} className="Btn">
                                                                Pay
                                                            <svg className="svgIcon" viewBox="0 0 576 512"><path d="M512 80c8.8 0 16 7.2 16 16v32H48V96c0-8.8 7.2-16 16-16H512zm16 144V416c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V224H528zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm56 304c-13.3 0-24 10.7-24 24s10.7 24 24 24h48c13.3 0 24-10.7 24-24s-10.7-24-24-24H120zm128 0c-13.3 0-24 10.7-24 24s10.7 24 24 24H360c13.3 0 24-10.7 24-24s-10.7-24-24-24H248z"></path></svg>
                                                            </button>
                                                            </div>
                                                        </div>
                                                        </div>
                                        </div>
                                    </div>
                                </div>
                                <div className={cx('Suggest_container')}>
                                    <h2>có thể bạn cũng thích</h2>
                                    <div className={cx('Suggest_content')}>
                                        <div className={cx('Suggest_content-item')}></div>
                                        <div className={cx('Suggest_content-item')}></div>
                                        <div className={cx('Suggest_content-item')}></div>
                                        <div className={cx('Suggest_content-item')}></div>
                                        <div className={cx('Suggest_content-item')}></div>
                                        <div className={cx('Suggest_content-item')}></div>
                                        <div className={cx('Suggest_content-item')}></div>
                                        <div className={cx('Suggest_content-item')}></div>
                                        <div className={cx('Suggest_content-item')}></div>
                                        <div className={cx('Suggest_content-item')}></div>
                                        <div className={cx('Suggest_content-item')}></div>
                                        <div className={cx('Suggest_content-item')}></div>
                                    </div>
                                </div>
                            </div>
                    </div>
                    <div onClick={handleClickRemoveModalCheckout} className={modalCheckout ? cx('modal_form_open') : cx('modal_form')}>
                        <div className={cx('modal_form_container')}>
                            <div ref={modalCheckoutRef}  onClick={(e) => e.stopPropagation()} className={modalMap ? cx('container_open') : cx('container')}>
                              <div className={cx('card_cart')}>
                                <label className={cx('title')}>THANH TOÁN</label>
                                <div className={cx('steps')}>
                                <div className={cx('step')}>
                                    <div className={cx('step-item')}>
                                    <div className={cx('Info_user')}>
                                        <span>Thông tin nhận hàng</span>
                                        {editInfo ? (
                                            <h3 onClick={() => setEditInfo(false)}>Trở lại</h3>
                                        ) : (
                                            <h3 onClick={() => setEditInfo(true)}>Thay đổi</h3>
                                        )}
                                    </div>
                                    {editInfo ? (
                                        <div className={cx('edit_infouser_container')}>
                                            <input placeholder="Tên" className={cx('input-style')} type="text"/>
                                            <input placeholder="Số điện thoại" className={cx('input-style')} type="text"/>
                                            <span>Địa chỉ</span>
                                            {ll === null ? (
                                                 <h4>Vui lòng chọn vị trí từ bản đồ !</h4>
                                            ) : (
                                                <h3>{ll}</h3>
                                            ) }
                                            <textarea style={{marginTop:'10px',width:'200px'}} placeholder="Địa chỉ cụ thể, tên đường/số nhà" className={cx('input-style')} type="text"/>
                                        <span style={{color:'#4080ee'}} className={cx('edit_infouser_container_save')}>Lưu</span>
                                        <button onClick={handleClickOpenMap} className={cx('edit_infouser_container_edit_address')}>Chọn từ bản đồ</button>
                                        </div>
                                    ) : (
                                        <>
                                        <div className={cx('edit_infouser_container_name')}><FontAwesomeIcon style={{paddingRight:'10px'}} icon={faUserRegular} />
                                           <span>{userName}</span> 
                                           </div>
                                        {JSON.parse(localStorage.getItem('Account')).Sdt === 0 ? (
                                            <input onChange={(e) => setPhone(e.target.value)} placeholder="Số điện thoại" className={cx('input-style')} type="text"/>
                                        ) : (
                                            <p style={{width:'100%'}}><FontAwesomeIcon style={{paddingRight:'8px'}} icon={faPhone} />(84<FontAwesomeIcon style={{padding:'0',fontSize:'8px',paddingBottom:'1px'}} icon={faPlus} />) {phone}</p>
                                        )}
                                        {sessionStorage.getItem('destination') !== undefined ? (
                                            <p><FontAwesomeIcon style={{paddingRight:'8px'}} icon={faLocationDot} />{sessionStorage.getItem('Address')}</p>
                                        ) : (
                                            <textarea spellcheck={false} onChange={(e) => setAddress(e.target.value)} style={{width:'200px'}} placeholder="Địa chỉ cụ thể, tên đường/số nhà" className={cx('input-style')} type="text"/>
                                        )}
                                        </>
                                    )}
                                    </div>
                                    <hr/>
                                    <div>
                                    <span>Phương Thức Thanh Toán</span>
                                    <p>Visa</p>
                                    <p>**** **** **** 4243</p>
                                    </div>
                                    <hr/>
                                    <div className="promo">
                                        <span>Ghi chú</span>
                                        <form className="form">
                                            <textarea spellCheck={false} ref={noteBill} className={cx('input_field_note')} placeholder="Thêm ghi chú" type="text"/>
                                        </form>
                                    </div>
                                </div>
                                </div>
                            <div className={cx('card_checkout')}>
                                <div className={cx('footer')}>
                                <label className={cx('price')}>{totalPay[1].toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫'} </label>
                                <div className={cx('container')}>
                                      <button onClick={handleClickCheckOut} className={cx('button')}>Đặt Hàng</button>
                                </div>
                                {/* <button className={cx('checkout-btn')}>Đặt Hàng</button> */}
                                </div>
                            </div>
                            </div>
                            </div>
                                {modalCheckout ? (
                            <div onClick={(e) => e.stopPropagation()} style={modalMap ? {display:'block'}:{display:'none'}} className={cx('modal_map_container')}>
                                       <Map children = {setLl} />
                            </div>
                                ) : null}
                            </div>
                    </div>
                </div>
                <div className='footer'>
                     <Footer />
                </div>
            </>
         );
    }
}

export default memo(Card);