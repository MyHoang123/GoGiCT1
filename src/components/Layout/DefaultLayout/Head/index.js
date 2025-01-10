import axios from 'axios'
import styles from './Card.module.scss'
import classNames from "classnames/bind"
import Swal from 'sweetalert2/dist/sweetalert2.js'
import Betseller from './Bestseller'
import WoodBase from "../../../../Asset/images/0622-angle-2-removebg-preview.png"
import Tomato1 from "../../../../Asset/images/lovepik-little-tomato-png-image_400974636_wh860-removebg-preview.png"
import Salad from "../../../../Asset/images/Romaine-removebg-preview.png"
import Slogan from "../../../../Asset/images/shipper-co-giao-hang-khi-gian-cach_2707111247.jpg"
import 'sweetalert2/src/sweetalert2.scss'
import { IdElementContext } from '../IdElementContext'
import { faPause, faPlay } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useRef, useState, useContext, memo, useCallback } from 'react'
import { Cookies } from 'react-cookie'
import { Link } from 'react-router-dom'
const cx = classNames.bind(styles);
function Header() {
    const { socket, setSocket, setAmount, btn, navbar, setModelProfile, imgProductSlide, desProduct, indexSlide, setIndexSlide, autoNext, sloganProduct } = useContext(IdElementContext)
    const image = useRef()
    // ClassName
    const [countContent, setCountContent] = useState(0)
    const [error, setError] = useState(null)
    const [countActiveNavbar, setCountActiveNavbar] = useState(0)
    const [playSlider, setPlaySlider] = useState(true)
    const [notifis, setNotifis] = useState([])
    const [products, setProducts] = useState([])
    const [AmountNoti, setAmountNoti] = useState(0)
    // Cookie
    const cookies = new Cookies();
    const contentItem1 = [
        cx('item', 'active'),
        cx('item'),
    ]
    const activeNavbar = [
        cx('header_navbar-item', 'active'),
        cx('header_navbar-item'),
    ]
    // Xoay
    let rotate = useRef(0);
    let active = useRef(0);
    let countItem = 6;
    let rotateAdd = 360 / countItem;
    const nextSlider = () => {
        setIndexSlide(() => {
            const newImg = [...indexSlide]
            const lastImage = newImg.shift();
            newImg.push(lastImage);
            return newImg
        })
        active.current = active.current + 1 > countItem - 1 ? 0 : active.current + 1;
        rotate.current = rotate.current + rotateAdd;
        show(rotate.current, active.current);
    }
    const prevSlider = () => {
        setIndexSlide(() => {
            const newImg = [...indexSlide]
            const lastImage = newImg.pop();
            newImg.unshift(lastImage);
            return newImg
        })
        active.current = active.current - 1 < 0 ? countItem - 1 : active.current - 1;
        rotate.current = rotate.current - rotateAdd;
        show(rotate.current, active.current);

    }
    const pauseSlider = () => {
        if (playSlider) {
            clearInterval(autoNext.current)
            setPlaySlider(false)
        } else {
            setPlaySlider(true)
            nextSlider()
        }
    }
    const show = (rotate, active) => {
        setCountContent(active)
        setPlaySlider(true)
        image.current.style.setProperty("--rotate", rotate + 'deg');
        image.current.style.setProperty("--rotate", rotate + 'deg');
    }
    const handleClickLogOut = useCallback((socket) => {
        if (JSON.parse(localStorage.getItem('Account')).Classify === 'user') {
            localStorage.removeItem('Account')
            cookies.remove('AccessToken', { path: '/' })
            setAmountNoti(0)
            setAmount(0)
            setModelProfile(false)
            socket.disconnect()
            setSocket(null)
        }
        else {
            localStorage.removeItem('Account')
        }
    }, [])
    const handleMouseLeave = useCallback(async () => {
        try {
            axios.post('http://localhost:5000/api/v12/sendnoti', { token: cookies.get('AccessToken') });
        } catch (error) {
            alert('Có lói xảy ra vui lòng thử lại')
        }
    }, [])

    // useEffect(() => {
    //     autoNext.current = setInterval(() => {
    //         nextSlider()
    //     },4000)
    //     return () => {
    //         clearInterval(autoNext.current)
    //     }
    // },[countContent])
    useEffect(() => {
        for (let i = 0; i <= 5; i++) {
            if (i === 0) {
                imgProductSlide.current[indexSlide[i]].style.opacity = '1'
            }
            else if (i === 1) {
                imgProductSlide.current[indexSlide[i]].style.opacity = '1'
            }
            else if (i === 5) {
                imgProductSlide.current[indexSlide[i]].style.opacity = '1'
            }
            else {
                imgProductSlide.current[indexSlide[i]].style.opacity = '0'
            }
        }
    }, [indexSlide])
    useEffect(() => {
        if (cookies.get('AccessToken') !== undefined) {
            axios.all([
                axios.get(`${process.env.REACT_APP_CALL_API}/api/v12/showbestellerCategoris`),
                axios.post(`${process.env.REACT_APP_CALL_API}/api/v12/showlengthcard`, { token: cookies.get('AccessToken') }),
                axios.post(`${process.env.REACT_APP_CALL_API}/api/v12/shownotifi`, { token: cookies.get('AccessToken') }),
            ])
                .then(axios.spread((Product, lengthCard, Noti) => {
                    if (Noti.data.data !== null) {
                        setNotifis(Noti.data.data)
                    }
                    setProducts(Product.data.data)
                    setAmount(lengthCard.data.data)
                    setAmountNoti(Noti.data.lenght)
                }))
                .catch(err => {
                    console.error()
                })
        }
        else {
            axios.all([
                axios.get(`${process.env.REACT_APP_CALL_API}/api/v12/showbestellerCategoris`),
            ])
                .then(axios.spread((Product) => {
                    setProducts(Product.data.data)
                }))
                .catch(err => {
                    console.error()
                })
        }
    }, [])
    useEffect(() => {
        if (sessionStorage.getItem('Address') === null) {
            Swal.fire({
                title: "Truy cập vị trí?",
                text: "Vui lòng cho phép truy cập vị trí!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3ec59d",
                cancelButtonColor: "#d33",
                confirmButtonText: "Cho phép"
            }).then((result) => {
                if (result.isConfirmed) {
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(
                            (position) => {
                                const { latitude, longitude } = position.coords
                                getAddress(latitude, longitude)
                            },
                            (err) => {
                                setError(err.message);
                            }
                        );
                    } else {
                        setError("Trình duyệt của bạn không hỗ trợ Geolocation.");
                    }
                }
                else {
                    setError("Bạn đã từ chối quyền truy cập vị trí.");
                }
                const getAddress = async (latitude, longitude) => {
                    const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
                    try {
                        const response = await fetch(url);
                        const data = await response.json();
                        if (data && data.display_name) {
                            sessionStorage.setItem('Address', data.display_name)
                            sessionStorage.setItem('destination', `${latitude},${longitude}`)
                        } else {
                            setError("Không tìm thấy địa chỉ.");
                        }
                    } catch (error) {
                        setError("Lỗi khi lấy địa chỉ.");
                    }
                }
            });
        }
    }, [])
    useEffect(() => {
        if (cookies.get('AccessToken') !== undefined) {
            if (socket !== null) {
                socket.on('repUpdateBill', async () => {
                    try {
                        const response = await axios.post(`${process.env.REACT_APP_CALL_API}/api/v12/shownotifi`, { token: cookies.get('AccessToken') })
                        console.log(response)
                        if (response.data.massege === 'Thanh cong') {
                            setNotifis(response.data.data)
                            setAmountNoti(response.data.lenght)
                        }
                    } catch (error) {
                        console.log('Đã xảy ra lỗi')
                    }
                })
                return () => {
                    socket.off('repUpdateBill')
                }
            }
        }
    }, [socket, notifis])
    return (
        <>
            <div className={cx('header_content')}>
                <nav ref={navbar} className={cx('navbar_container')}>
                    <div ref={btn} className={cx('navbar_content')}>
                        <ul className={cx('navbar_content_left')}>
                            <li className={(countActiveNavbar === 0 ? activeNavbar[0] : activeNavbar[1])} onClick={() => setCountActiveNavbar(0)} >Trang chủ</li>
                            <li className={(countActiveNavbar === 1 ? activeNavbar[0] : activeNavbar[1])} onClick={() => setCountActiveNavbar(1)} >Thực đơn</li>
                            <li className={(countActiveNavbar === 2 ? activeNavbar[0] : activeNavbar[1])} onClick={() => setCountActiveNavbar(2)} >Tin tức</li>
                        </ul>
                        <div className={cx('logo_gogi')} style={{ pointerEvents: 'none' }} >
                            <div className={cx('logo_nav')}>
                                <img src={`${process.env.REACT_APP_CALL_API}/api/v12/header/logo-gogi-house-X5%20(1).png`} alt="" />
                            </div>
                        </div>
                        <ul className={cx('navbar_content_right')}>
                            <li className={(countActiveNavbar === 3 ? activeNavbar[0] : activeNavbar[1])} onClick={() => setCountActiveNavbar(3)} >Trợ giúp</li>
                            {cookies.get('AccessToken') ? (
                                <li onMouseLeave={() => handleMouseLeave()} className={cx('header_navbar-item_noti')} onClick={() => setCountActiveNavbar(4)} >
                                    {AmountNoti > 0 ? (
                                        <span className={cx('header_navbar-item_amount')}>{AmountNoti}</span>
                                    ) : null}
                                    <a style={{ width: '100%' }} className={cx('header_navbar-tile--no-pointer')}>
                                        Thông Báo
                                    </a>
                                    <div className={cx('header_notify')}>
                                        <header className={cx('header_notify-header')}>
                                            <h3>Thông báo mới nhận</h3>
                                        </header>
                                        {notifis.map((noti, i) => (
                                            <div key={i} style={noti.Status === 0 ? { backgroundColor: '#f1faff' } : null} className={cx('header_notify-list')}>
                                                <div className={cx('header_notify-list_img')}>
                                                    <img src={Slogan} />
                                                </div>
                                                <div className={cx('header_notify-list_content')}>
                                                    <h2>{noti.Containt}</h2>
                                                    <h3>Thông báo tự động biến mất sau 24h</h3>
                                                    <h4>{noti.Time}</h4>
                                                </div>
                                            </div>
                                        ))}
                                        <div className={cx('header_notify-footer')}>
                                            <a href="" className={cx('header_notify-footer-btn')}>Xem tất cả</a>
                                        </div>

                                    </div>
                                </li>
                            ) : (
                                <li >Thông báo</li>
                            )}
                            {JSON.parse(localStorage.getItem('Account')) === null ? (
                                <li className={(countActiveNavbar === 4 ? activeNavbar[0] : activeNavbar[1])} ><Link to='/loginuser'>Đăng nhập</Link></li>
                            ) : (
                                <li style={{ width: '210px' }} className={cx('header_navbar-item')} >
                                    <div className={cx('header_navbar_img-user')}>
                                        <img style={{ borderRadius: '50%' }} src={JSON.parse(localStorage.getItem('Account')).Classify === 'user' ? `${process.env.REACT_APP_CALL_API}/api/v12/avtuser/${JSON.parse(localStorage.getItem('Account')).Avt}` : `${JSON.parse(localStorage.getItem('Account')).Avt}`} className={cx('header_navbar-user-img')} />
                                    </div>
                                    <span className={cx('header_navbar-user-name')}>
                                        {JSON.parse(localStorage.getItem('Account')).UserName}
                                    </span>
                                    <ul className={cx('header_navbar-user-menu')}>
                                        <li style={{ padding: '0' }} className={cx('header_navbar-user-item')}>
                                            <Link to='/user'>Tài khoản của tôi</Link>
                                        </li>
                                        <li style={{ padding: '0' }} className={cx('header_navbar-user-item')}>
                                            <Link to='/purchase'>Đơn mua </Link>
                                        </li>
                                        <li style={{ padding: '0' }} className={cx('header_navbar-user-item')}>
                                            <Link to='/card'>Giỏ hàng </Link>
                                        </li>
                                        <li onClick={() => handleClickLogOut(socket)} style={{ padding: '0' }} className={cx('header_navbar-user-item')}>
                                            <span>Đăng xuất</span>
                                        </li>
                                    </ul>
                                </li>
                            )}
                        </ul>


                    </div>
                </nav>
                <div className={cx('slider')}>
                    <div className={cx('title')}>
                        <p>BBQ</p>
                        <p style={{ marginTop: '20px' }}>GOGI</p>
                        <p style={{ marginLeft: '20%', marginTop: '20px' }}>HOUSE</p>
                    </div>
                    <div ref={image} className={cx('images')}>
                        <div className={cx('item')} style={{ '--i': 1 }}>
                            <img className={cx('Img_slide')} ref={(e) => imgProductSlide.current[5] = e} src={(products.length !== 0 ? (`${process.env.REACT_APP_CALL_API}/api/v12/bodyimg/${products[5].Img}`) : (null))} />
                        </div>
                        <div className={cx('item')} style={{ '--i': 2 }}>
                            <img className={cx('Img_slide')} ref={(e) => imgProductSlide.current[4] = e} src={(products.length !== 0 ? (`${process.env.REACT_APP_CALL_API}/api/v12/bodyimg/${products[4].Img}`) : (null))} />
                        </div>
                        <div className={cx('item')} style={{ '--i': 3 }}>
                            <img className={cx('Img_slide')} ref={(e) => imgProductSlide.current[3] = e} src={(products.length !== 0 ? (`${process.env.REACT_APP_CALL_API}/api/v12/bodyimg/${products[3].Img}`) : (null))} />
                        </div>
                        <div className={cx('item')} style={{ '--i': 4 }}>
                            <img className={cx('Img_slide')} ref={(e) => imgProductSlide.current[2] = e} src={(products.length !== 0 ? (`${process.env.REACT_APP_CALL_API}/api/v12/bodyimg/${products[2].Img}`) : (null))} />
                        </div>
                        <div className={cx('item')} style={{ '--i': 5 }}>
                            <img className={cx('Img_slide')} ref={(e) => imgProductSlide.current[1] = e} src={(products.length !== 0 ? (`${process.env.REACT_APP_CALL_API}/api/v12/bodyimg/${products[1].Img}`) : (null))} />
                        </div>
                        <div className={cx('item')} style={{ '--i': 6 }}>
                            <img className={cx('Img_slide')} ref={(e) => imgProductSlide.current[0] = e} src={(products.length !== 0 ? (`${process.env.REACT_APP_CALL_API}/api/v12/bodyimg/${products[0].Img}`) : (null))} />
                        </div>
                    </div>
                    <div className={cx('content')}>
                        <div className={(countContent === 0 ? contentItem1[0] : contentItem1[1])}>
                            {/* <img style={{width:'250px'}} src={Slogan}/> */}
                            <h1>{(products.length !== 0 ? (products[0].Name) : (null))} </h1>
                            <div className={cx('des')}>
                                {(products.length !== 0 ? (products[0].Dsription) : (null))}
                            </div>
                            <button>See more</button>
                        </div>
                        <div className={(countContent === 1 ? contentItem1[0] : contentItem1[1])}>
                            <h1>{(products.length !== 0 ? (products[1].Name) : (null))}</h1>
                            <div className={cx('des')}>
                                {(products.length !== 0 ? (products[1].Dsription) : (null))}
                            </div>
                            <button>See more</button>
                        </div>
                        <div className={(countContent === 2 ? contentItem1[0] : contentItem1[1])}>
                            <h1>{(products.length !== 0 ? (products[2].Name) : (null))}</h1>
                            <div className={cx('des')}>
                                {(products.length !== 0 ? (products[2].Dsription) : (null))}
                            </div>
                            <button>See more</button>
                        </div>
                        <div className={(countContent === 3 ? contentItem1[0] : contentItem1[1])}>
                            <h1>{(products.length !== 0 ? (products[3].Name) : (null))}</h1>
                            <div className={cx('des')}>
                                {(products.length !== 0 ? (products[3].Dsription) : (null))}
                            </div>
                            <button>See more</button>
                        </div>
                        <div className={(countContent === 4 ? contentItem1[0] : contentItem1[1])}>
                            <h1>{(products.length !== 0 ? (products[4].Name) : (null))}</h1>
                            <div className={cx('des')}>
                                {(products.length !== 0 ? (products[4].Dsription) : (null))}
                            </div>
                            <button>See more</button>
                        </div>
                        <div className={(countContent === 5 ? contentItem1[0] : contentItem1[1])}>
                            <h1>{(products.length !== 0 ? (products[5].Name) : (null))}</h1>
                            <div className={cx('des')}>
                                {(products.length !== 0 ? (products[5].Dsription) : (null))}
                            </div>
                            <button>See more</button>
                        </div>
                    </div>
                    <div className={cx('button_click_slider')}>
                        <div className={cx('button_click_slider-item')}>
                            <button onClick={prevSlider} id={cx('prev')}>&lt;</button>
                        </div>
                        <div className={cx('button_click_slider-item')}>
                            <button onClick={pauseSlider} id={cx('next')}>
                                {(playSlider ? (
                                    <FontAwesomeIcon style={{ height: '55px', transform: 'translate(8px,-14px)' }} icon={faPause} />
                                ) : (
                                    <FontAwesomeIcon style={{ height: '55px', width: '50px', transform: 'translate(8px,-14px)' }} icon={faPlay} />
                                ))}
                            </button>
                        </div>
                        <div className={cx('button_click_slider-item')}>
                            <button onClick={nextSlider} id={cx('next')}>&gt;</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className={cx('desproduct_container')}>
                <div className={cx('desproduct_container-content')}>
                    <div className={cx('desproduct_content-item')}>
                        <div className={cx('desproduct_slogan')}>
                            <img ref={sloganProduct} />
                        </div>
                        <div className={cx('desproduct_woodbase')}>
                            <img className={cx('desproduct_img')} src={WoodBase} />
                        </div>
                        <div className={cx('desproduct_tomato')}>
                            <img className={cx('desproduct_tomato-item')} src={Tomato1} />
                        </div>
                        <div className={cx('desproduct_salad')}>
                            <img className={cx('desproduct_salad-item')} src={Salad} />
                        </div>
                    </div>
                    <div className={cx('desproduct_content-item')}>
                        <div className={cx('desproduct_content-des')}>
                            <h1 ref={(e) => desProduct.current[0] = e}>{(products.length !== 0 ? (products[indexSlide[0]].Name) : (null))} </h1>
                            <span ref={(e) => desProduct.current[1] = e}>{(products.length !== 0 ? (products[indexSlide[0]].Dsription) : (null))}</span>
                        </div>
                    </div>
                </div>
                <h1 className={cx('Modal_bestseller_header')}>Best Seller</h1>
            </div>
            <Betseller cx={cx} products={products} />
        </>
    );
}

export default memo(Header);