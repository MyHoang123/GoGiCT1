import axios from 'axios'
import ReactPaginate from 'react-paginate';
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import { ReduxSlice } from '../../../../redux/ReduxSlice';
import PageNew from './PageNew';
import PageYoutube from './PageYoutube';
import Headerbody from './Headerbody';
import ItemHeaderBody from './ItemsHeaderbody';
import Categoris from './Categoris';
import DetailProduct from './detailProduct';
import './Body.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRocketchat } from '@fortawesome/free-brands-svg-icons';
import { faChevronLeft, faChevronRight, faSquareCaretDown, faMagnifyingGlass, faHeart, faCartShopping, faBagShopping, faCaretDown, faCheckDouble } from '@fortawesome/free-solid-svg-icons';
import { IdElementContext } from '../IdElementContext'
import { useDispatch, useSelector } from 'react-redux';
import { getProduct } from '../../../../redux/ReduxSlice';
import { useContext, useEffect, useRef, useState, memo, useCallback } from 'react';
import { Cookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom'
import { RenderStar } from '../../../../hooks'
import { listProductSelectorAll } from './BodySelector';
function Body() {
    const productAll = useSelector(listProductSelectorAll)
    // Cookie
    const cookies = new Cookies();
    const navigate = useNavigate()
    const dispatch = useDispatch()
    // State
    const [products, setProducts] = useState([])
    const [page, setPage] = useState(1)
    const [productDetail, setProductDetail] = useState(null)
    const [message, setMessage] = useState([])
    const [chat, setChat] = useState(false)
    const [modalDetail, setModalDetail] = useState(false)
    // Ref
    const buttonFakeAddCard = useRef([])
    const animationRef = useRef([])
    const indexCardProduct = useRef([])
    const cardButton = useRef([])
    const startHtml = useRef([])
    const allStar = useRef()
    const valueChat = useRef()
    // Context
    const { Amount, setAmount, cartProduct, youtubeRef, bodyNhansu, socket } = useContext(IdElementContext)
    const { IdProduct } = useContext(IdElementContext)
    const addCard = async (button, IdProduct) => {
        try {
            cardButton.current[button].style.pointerEvents = 'none'
            const response = await axios.post(`${process.env.REACT_APP_CALL_API}/api/v12/addcard`, { IdProduct: IdProduct, token: cookies.get('AccessToken') });
            if (response.data.massege === 'Thanh cong') {
                cardButton.current[button].style.pointerEvents = 'auto'
                buttonFakeAddCard.current[button].classList.add('open')
                let x = 0
                let y = 0
                const speed = 0.4;
                let lastTime = 0;
                const animateAddcard = (timestamp) => {
                    if (!lastTime) lastTime = timestamp;
                    const deltaTime = timestamp - lastTime;
                    lastTime = timestamp;
                    const indexCard = cartProduct.current.getBoundingClientRect();
                    const icardProduct = cardButton.current[button].getBoundingClientRect();
                    const xTo = indexCard.left - icardProduct.left;
                    const yTo = indexCard.top - icardProduct.top;
                    const xDistance = xTo - x;
                    const yDistance = yTo - y;
                    if (Math.abs(xDistance) > 1) {
                        x += (xDistance * (deltaTime / 500) * speed);
                    }

                    if (Math.abs(yDistance) > 1) {
                        y += (yDistance * (deltaTime / 500) * speed);
                    }
                    buttonFakeAddCard.current[button].style.transform = `translate(${x.toFixed(0)}px, ${y.toFixed(0)}px)`;
                    if (Math.abs(xDistance) > 10 || Math.abs(yDistance) > 10) {
                        animationRef.current[button] = requestAnimationFrame(animateAddcard);
                    } else {
                        buttonFakeAddCard.current[button].classList.remove('open')
                    }
                };
                animationRef.current[button] = requestAnimationFrame(animateAddcard)
                setAmount(prev => prev += 1)
            }
            else {
                Swal.fire({
                    icon: "error",
                    title: "Lỗi",
                    text: "Sản phẩm đã tồn tại!",
                    footer: '<a href="#">Why do I have this issue?</a>'
                });
                cardButton.current[button].style.pointerEvents = 'auto'
            }

        } catch (error) {
            cardButton.current[button].style.pointerEvents = 'auto'
            alert('Thêm sản phẩm thất bại')
        }
    }
    async function AddHistoryUser(User) {
        try {
            await axios.post(`${process.env.REACT_APP_CALL_API}/api/v12/addhistoryuser`, User);
        } catch (error) {
            console.error('Lỗi khi thêm sản phẩm:', error);
        }
    }
    const handleClickDetailProduct = (Id, Star) => {
        const productFilter = productAll[0].filter((product) => product.Id === Id)
        setProductDetail({
            Id: productFilter[0].Id,
            Name: productFilter[0].Name,
            Price: productFilter[0].Price,
            Img: productFilter[0].Img,
            Star: Star,
            Sales: productFilter[0].Sales,
            NameCate: productFilter[0].NameCate
        })
        setModalDetail(true)
        if (cookies.get('AccessToken') !== undefined) {
            const user = {
                IdProduct: Id,
                token: cookies.get('AccessToken')
            }
            // AddHistoryUser(user)
        }
    }
    const handleClickRemoveDetailProduct = useCallback((cardDetailProduct, commentShow) => {
        setModalDetail(false)
        cardDetailProduct.current.classList.remove('open')
        commentShow.current.classList.remove('open')
    }, [])
    const hanldeClickRanDom = () => {
        dispatch(ReduxSlice.actions.randomProduct())
        if (animationRef.current.length > 0) {
            animationRef.current.forEach((ani) => {
                cancelAnimationFrame(ani)
            })
            buttonFakeAddCard.current.forEach((btn) => {
                btn.classList.remove('open')
            })
        }
    }
    const handleClickNewProduct = () => {
        dispatch(ReduxSlice.actions.newProduct())
        if (animationRef.current.length > 0) {
            animationRef.current.forEach((ani) => {
                cancelAnimationFrame(ani)
            })
            buttonFakeAddCard.current.forEach((btn) => {
                btn.classList.remove('open')
            })
        }
    }
    const handleClickMinProduct = () => {
        dispatch(ReduxSlice.actions.minProduct())
        if (animationRef.current.length > 0) {
            animationRef.current.forEach((ani) => {
                cancelAnimationFrame(ani)
            })
            buttonFakeAddCard.current.forEach((btn) => {
                btn.classList.remove('open')
            })
        }
    }
    const handleClickMaxProduct = () => {
        dispatch(ReduxSlice.actions.maxProduct())
        if (animationRef.current.length > 0) {
            animationRef.current.forEach((ani) => {
                cancelAnimationFrame(ani)
            })
            buttonFakeAddCard.current.forEach((btn) => {
                btn.classList.remove('open')
            })
        }
    }
    const handlePageChange = useCallback((selectedItem) => {
        if (animationRef.current.length > 0) {
            animationRef.current.forEach((ani) => {
                cancelAnimationFrame(ani)
            })
            buttonFakeAddCard.current.forEach((btn) => {
                btn.classList.remove('open')
            })
        }
        dispatch(ReduxSlice.actions.changePage(selectedItem.selected + 1))
    }, [])
    const handleClickSendChat = useCallback((e) => {
        e.preventDefault()
        const check = valueChat.current.value.split('').some(char => char !== ' ')
        if (check) {
            const now = new Date()
            const time = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`
            const data = {
                IdReceiver: 1,
                time: time,
                containt: valueChat.current.value
            }
            socket.emit('chat', data, (response) => {
                if (response === 'Thanh cong') {
                    data.Status = 0
                    setMessage(prev => [...prev, data])
                    valueChat.current.value = ''
                    valueChat.current.focus()
                    socket.on('repchat', (status) => {
                        if (status === null) {
                            alert('Đã xảy ra lõi vui lòng thử lại')
                        }
                        else {
                            setMessage(prev => {
                                const newArr = [...prev]
                                newArr[newArr.length - 1].Status = status.Status
                                return newArr
                            })
                            valueChat.current.value = ''
                            valueChat.current.focus()
                            socket.off('repchat')
                        }
                    })
                }
                else {
                    alert('Gửi lõi')
                }
            })
        }
    }, [message, socket])
    const handleClickOpenChat = useCallback((socket) => {
        if (socket) {
            setChat(true)
            socket.emit('sendMessage', { IdSend: 1 }, (response) => {
                if (response.message === 'Thanh Cong') {
                    setMessage(response.Data)
                }
            })
        }
    }, [])
    const handleSearchChangeInput = (e) => {
        if (page !== 1) {
            setPage(1)
        }
        const result = []
        products.forEach((product) => {
            if (product.Name.toLowerCase().includes(e.toLowerCase())) {
                result.unshift({ ...product, Status: 'visible' })
            }
            else {
                result.push({ ...product, Status: 'hidden' })
            }
        })
        if (animationRef.current.length > 0) {
            animationRef.current.forEach((ani) => {
                cancelAnimationFrame(ani)
            })
            buttonFakeAddCard.current.forEach((btn) => {
                btn.classList.remove('open')
            })
        }
        setProducts(result)
    }
    useEffect(() => {
        dispatch(getProduct())
        return () => {
            if (animationRef.current.length > 0) {
                animationRef.current.forEach((ani) => {
                    cancelAnimationFrame(ani)
                })
            }
        }
    }, [])
    useEffect(() => {
        if (socket !== null) {
            socket.on('chat', (data) => {
                const newArr = {
                    IdSend: data.IdSend,
                    IdReceiver: data.IdReceiver,
                    time: data.time,
                    containt: data.containt
                }
                if (data !== null) {
                    const repMessage = {
                        IdSend: newArr.IdSend,
                        Status: chat ? 1 : 0
                    }
                    socket.emit('repchat', repMessage)
                    setMessage(prev => [...prev, newArr])
                }
            })
            socket.on('sendMessage', (data) => {
                if (data !== null) {
                    const newArr = [...message]
                    newArr[newArr.length - 1].Status = 1
                    setMessage(newArr)
                }
            })
            return () => {
                socket.off('chat')
                socket.off('sendMessage')
            }
        }
    }, [socket, chat, message])
    return (
        <>
            <Headerbody />
            <div className={`backround_content`}>
                <div className={'grid wide app_content'}>
                    <ItemHeaderBody />
                    <div className={'app_content-product'}>
                        <div className={'row sm-gutter app_content'}>
                            <Categoris />
                        </div>
                        {/* <!-- product --> */}
                        <div id={IdProduct} className={'home-product'}>
                            <div className={`home-filter`}>
                                <div className='home-filter-left'>
                                    <h3>Sản phẩm nổi bật</h3>
                                    <div className='home-filter_search'>
                                        <div className="group">
                                            <FontAwesomeIcon className='icon' icon={faMagnifyingGlass} />
                                            <input onChange={(e) => handleSearchChangeInput(e.target.value)} className="input" type="text" placeholder="Search" />
                                        </div>
                                    </div>
                                </div>
                                <div className='home-filter-right'>
                                    <div className='button-filter'>
                                        <button onClick={() => hanldeClickRanDom()}>Ngẫu nhiên</button>
                                    </div>
                                    <div className='button-filter'>
                                        <button onClick={() => handleClickNewProduct()}>Mới nhất</button>
                                    </div>
                                    <div className='button-filter'>
                                        <button onClick={() => handleClickMinProduct()}>Giá Thấp</button>
                                    </div>
                                    <div className='button-filter'>
                                        <button onClick={() => handleClickMaxProduct()}>Giá Cao</button>
                                    </div>
                                </div>
                                <h3>
                                    {productAll[2]}/{productAll[1]}
                                </h3>
                            </div>
                            <div className={`product_container`}>
                                {productAll[0].map((product, index) => (
                                    (product.Status === 'visible' ? (
                                        <div key={index} className='product_content'>
                                            <div style={{ height: '290px', zIndex: '1', width: '220px', padding: '5px' }} className={`card`}>
                                                <div style={{ zIndex: '1' }} className="image-container">
                                                    <img src={`${process.env.REACT_APP_CALL_API}/api/v12/showimgproduct/${product.Img}`} />
                                                </div>
                                                <label className="favorite">
                                                    <input type="checkbox" />
                                                    <FontAwesomeIcon className={'heart_product'} icon={faHeart} />
                                                </label>
                                                <div className="content">
                                                    <div className={`brand`}>{product.Name}</div>
                                                    <div className="color-size-container">
                                                        <div className="colors">
                                                            <ul className="colors-container">
                                                                <span style={{ marginTop: '2px', padding: '0' }}>Giá</span>
                                                                <span className='price_product' style={{ fontSize: '16px' }}>{product.Price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫'}</span>
                                                            </ul>
                                                        </div>
                                                        <div className="sizes">
                                                            <span className='title_cate'>LOẠI</span>
                                                            <div className="size-container">
                                                                <span style={{ fontSize: '10px' }} className="name">{product.NameCate}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div ref={e => startHtml.current[index] = e} className="rating">
                                                        <RenderStar Star={product.Star} />
                                                        <span style={{ fontSize: '12px' }}>đã bán {product.Sales}</span>
                                                    </div>
                                                </div>
                                                {(product.Visible === 1 ? (
                                                    <div ref={e => indexCardProduct.current[index] = e} className="button-container">
                                                        <button onClick={() => handleClickDetailProduct(product.Id, product.Star)} className='detailproduct_button'>Xem chi tiết</button>
                                                        <button ref={e => cardButton.current[index] = e} onClick={() => addCard(index, product.Id)} className="cart-button button">
                                                            <FontAwesomeIcon icon={faCartShopping} />
                                                        </button>
                                                    </div>
                                                ) : <div className='container_product_off'><span>Hết món</span></div>)}
                                            </div>
                                            <div ref={el => buttonFakeAddCard.current[index] = el} className='button_container-fake'>
                                                <img src={`${process.env.REACT_APP_CALL_API}/api/v12/showimgproduct/${product.Img}`} style={{ width: '100%', height: '100%', objectFit: 'cover', zIndex: '100' }} />
                                            </div>
                                        </div>
                                    ) : null)
                                ))}
                            </div>
                            <ReactPaginate className='home-product_pagination'
                                pageCount={productAll[1]} // Tổng số trang
                                pageRangeDisplayed={3} // Số lượng trang hiển thị trên thanh phân trang
                                marginPagesDisplayed={1}
                                onPageChange={handlePageChange}// Số lượng trang trước và sau trang hiện tại // Hàm xử lý khi chuyển trang
                                activeClassName="active"
                                forcePage={productAll[2] - 1} // Thiết lập trang active theo currentPage
                                previousLabel={<FontAwesomeIcon style={{ color: '#333' }} icon={faChevronLeft} />}
                                nextLabel={<FontAwesomeIcon style={{ color: '#333' }} icon={faChevronRight} />}
                            />
                        </div>
                    </div>
                    <DetailProduct productDetail={productDetail} allStar={allStar} modalDetail={modalDetail} handleClickRemoveDetailProduct={handleClickRemoveDetailProduct} />
                </div>
                <PageYoutube data={{ youtubeRef }} />
                <div ref={bodyNhansu} className={'body_nhansu'}>
                    <div className={'overlay_body-nhansu'}>
                        <div className={'body_nhansu-item'}>
                            <h1>40+</h1>
                            <p>Nhà Hàng</p>
                        </div>
                        <div className={'body_nhansu-item'}>
                            <h1>120+</h1>
                            <p>Món Ăn</p>
                        </div>
                        <div className={'body_nhansu-item'}>
                            <h1>1000+</h1>
                            <p>Nhân Viên</p>
                        </div>
                        <div className={'body_nhansu-item'}>
                            <h1>100.000+</h1>
                            <p>Lượt Khách</p>
                        </div>
                    </div>
                </div>
                <PageNew />
            </div>
            <div datacount={Amount} ref={cartProduct} onClick={cookies.get('AccessToken') !== undefined ? () => navigate('/card') : () => navigate('/loginuser')} className='cart_product-container'>
                <FontAwesomeIcon className='cart_product-icon' icon={faBagShopping} />
            </div>
            <div onClick={() => handleClickOpenChat(socket)} style={chat ? { opacity: '0' } : { opacity: '1', transition: 'opacity 1s .2s ease-in-out' }} className='chat_container'>
                <span>Chat</span>
                <FontAwesomeIcon icon={faRocketchat} />
            </div>
            <div style={chat ? { opacity: '1', transform: 'scale(1)' } : { opacity: '0', transform: 'scale(0)' }} className='massage_content'>
                <div className="card_chat">
                    <div className="chat-header">
                        <span>Chat</span>
                        <div onClick={() => setChat(false)}>
                            <FontAwesomeIcon icon={faSquareCaretDown} />
                        </div>
                    </div>
                    <div className="chat-window">
                        <div>
                            {message.map((ms, index) => (
                                <div key={index}>
                                    <ul key={index} style={index === message.length - 1 ? { marginBottom: '8px' } : null} className={ms.IdReceiver !== 1 ? "message-list-rep" : "message-list-user"}>
                                        <li>
                                            {index === 0 ? (
                                                <FontAwesomeIcon className={ms.IdReceiver !== 1 ? 'massage_list-icon' : 'massage_list-icon-user'} icon={faCaretDown} />
                                            ) : (
                                                message[index - 1].IdSend !== ms.IdSend ? <FontAwesomeIcon className={ms.IdReceiver !== 1 ? 'massage_list-icon' : 'massage_list-icon-user'} icon={faCaretDown} /> : null
                                            )}
                                            <p>{ms.containt}<span className='massage_list-time'>{ms.time}</span></p>
                                        </li>
                                    </ul>
                                    {(index === message.length - 1 && ms.IdSend !== 1) ? (
                                        <div className='massage_content_body-content_status'>{ms.Status === 1 ? (<span><FontAwesomeIcon style={{ marginBottom: '1px' }} icon={faCheckDouble} />Đã Xem</span>) : (<span><FontAwesomeIcon style={{ marginBottom: '1px' }} icon={faCheckDouble} />Đã Nhận</span>)}</div>
                                    ) : null}
                                </div>

                            ))}
                        </div>
                    </div>
                    <form onSubmit={(e) => handleClickSendChat(e)} className="chat-input">
                        <input ref={valueChat} type="text" className="message-input" spellCheck={false} placeholder="Type your message here" />
                        <button type='submit' className="send-button">Send</button>
                    </form>
                </div>
            </div>
        </>
    );
}
export default memo(Body);