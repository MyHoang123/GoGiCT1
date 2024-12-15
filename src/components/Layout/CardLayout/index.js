
import axios from 'axios'
import io from 'socket.io-client';
import Footer from '../DefaultLayout/Footer';
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import logo from '../../../Asset/images/logo-gogi-house-X5 (1).png'
import styles from './Card.module.scss'
import classNames from "classnames/bind"
import card from "../../../Asset/images/cart.png"
import Navbar from './Navbar';
import Suggests from './Suggest';
import Youcard from './YourCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faSpinner} from '@fortawesome/free-solid-svg-icons'
import { useDebounce } from '~/hooks'
import { useEffect, useRef, useState,useMemo, memo } from 'react'
import { resetData } from '../DefaultLayout/Body/BodySlice';
import { useDispatch, useSelector } from 'react-redux';
import { listProductCard } from './CardSelector';
import { Cookies } from 'react-cookie'
import {useNavigate, useLocation  } from 'react-router-dom'
import { getProductCard } from './CardSlice';
const cx = classNames.bind(styles)
function Card() {
    const cookie = new Cookies()
    const navigate = useNavigate()
    const location = useLocation();
    const dispatch = useDispatch()
    const productCard = useSelector(listProductCard)
    // State
    const [cards, setCards] = useState([])
    const [socket, setSocket] = useState(null)
    const [CheckCard, setCheckCard] = useState([])
    const [searchValue, setSearchValue] = useState('')
    const [loadSearch, setLoadSearch] = useState(false);

    const debounce = useDebounce(searchValue,500)
    // Ref
    const cardAllCheck = useRef()
    const noteRef = useRef([])
    async function deleteCard(id) {
        try {
            const response = await axios.post('https://severgogi.onrender.com/api/v12/deletecard', id)   
            if(response.data.massege === 'Thanh cong') {
                setCards(prev => prev.filter(product => product.Id !== id.IdProduct))
                setCheckCard(prev => prev.filter(product => product.Id !== id.IdProduct))
            }
        } catch (error) {
            console.error('Lỗi khi thêm sản phẩm:', error);
        }
    }
    const handleClickChangCard = (Id,Price,Name,Img,CheckCard) => {
            const productCard = CheckCard.filter((card) => card.Id === Id)
            if(productCard.length > 0) {
                setCheckCard(prev => prev.filter((card) => card.Id !== Id))
            }
            else {
                setCheckCard((prev) => [...prev,{Id:Id,Price:Price,Name:Name,Img:Img}])
            }
        }
        const handleClickAllCard = (e,cards) => {
            if(e.target.checked === true) {
                const newArr = cards.reduce((acc,cur) => {
                    if(cur.Status === 'visible') {
                        return [...acc,{Id:cur.Id,Price:cur.Price,Name:cur.Name,Img:cur.Img}]
                    }else {
                        return [...acc]
                    }
                },[])
                setCheckCard(prev => [...prev,...newArr])
            }
            else{
                setCheckCard([])
            }
        }

        const handleChangeSearch = (e) => {
            if(cardAllCheck.current.checked === true) {
                cardAllCheck.current.checked = false
            }
            setSearchValue(e)
            setLoadSearch(true)
        }
        const handleClickDeleteCard = (id) => {
            const IdCard = {
                IdProduct: id,
                token: cookie.get('AccessToken')
            }
            deleteCard(IdCard)
        }
      
    useEffect(() => {
        if(cookie.get('AccessToken') !== undefined) {
            const newSocket = io('https://severgogi.onrender.com',{
                auth: {
                    token: cookie.get('AccessToken')
                }
               })
            setSocket(newSocket)
            dispatch(getProductCard({token: cookie.get('AccessToken')}))
            dispatch(resetData())
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
        setLoadSearch(false)
     },[debounce])
     const checkCardNull = useMemo(() => {
        if(productCard.length !== 0) {
            const newArr = productCard.filter((product) => product.Status === 'hiden')
            if(newArr.length === productCard.length) {
                return false
            }
                return true
        }
        else {
            return false
        }
     },[productCard])
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const status = params.get('status');
        if (status === '1') {
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
                    navigate('/purchase')
                }
                else {
                    navigate('/purchase')
                }
              })
        } else if (status === '0') {
            alert('Giao dịch không thành công!');
        } 
    }, [location]);
    if(cookie.get('AccessToken') !== undefined) {
        return ( 
            <>
            <Navbar socket = {socket} cookie = {cookie} />
                <div className={cx('content')}>
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
                                                     {productCard.map((card,i) => (
                                                            <label htmlFor={`checkedProduct${i}`} key={i} className={card.Status === 'visible' ? cx('body_card_content_container-item-product_body') : cx('body_card_content_container-item-product_body_unative')}>
                                                                <div className={cx('body_card_content_container-item-product_body-name')}>
                                                                    <div className={cx('body_card_content_container-item-product_body-name-checkbox')}>
                                                                        <input checked={CheckCard.some((product) => product.Id === card.Id)} id={`checkedProduct${i}`} name='product' onChange={() => handleClickChangCard(card.Id,card.Price,card.Name,card.Img,CheckCard)} type="checkbox" className={cx('cyberpunk-checkbox')}/>
                                                                    </div>
                                                                    <h2>{card.Name}</h2>
                                                                </div>
                                                                <div className={cx('body_card_content_container-item-product_body-sl-price-img')}>
                                                                    <h2>{card.Price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫'}</h2>
                                                                    <div className={cx('body_card_content_container-item-product_body-sl-price-img-item')}>
                                                                        <img style={{width:'60%',height:'100%',objectFit:'cover'}} src={`https://severgogi.onrender.com/api/v12/showimgproduct/${card.Img}`}/>
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
                                        <Youcard CheckCard = {CheckCard} setCheckCard = {setCheckCard} cards = {cards} noteRef = {noteRef} cx = {cx} socket = {socket} />
                                    </div>
                                </div>
                                <Suggests CheckCard = {CheckCard} setCheckCard = {setCheckCard} />
                            </div>
                    </div>
              {/* Bill */}
                </div>
                <div className='footer'>
                     <Footer />
                </div>
            </>
         );
    }
}

export default memo(Card);