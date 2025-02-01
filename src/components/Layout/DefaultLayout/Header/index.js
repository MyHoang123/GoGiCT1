import { useRef, useState, useEffect, memo, useContext } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getBestSeller, getUser, logout, getNoti, sendNoti, resetHeader } from './reduxBody/HeaderSlice'
import { getLengthCard } from '../Body/reduxBody/BodySlice'
import { listBestSeller, infoUser, showNoti } from './reduxBody/HeaderSelector'
import { Cookies } from 'react-cookie'
import Slogan from "~/Asset/images/shipper-co-giao-hang-khi-gian-cach_2707111247.jpg"
import io from 'socket.io-client'
import GetAddRess from "./GetAddRess";
import BestSeller from "./BestSeller";
import classNames from "classnames/bind";
import styles from "./Header.module.scss";
import LogoGogi from '../../../../Asset/images/logo-gogi-house-X5 (1).png'
import Wood from '../../../../Asset/images/0622-angle-2-removebg-preview.png'
import Salad from '../../../../Asset/images/Romaine-removebg-preview.png'
import Tomato from '../../../../Asset/images/lovepik-little-tomato-png-image_400974636_wh860-removebg-preview.png'
const cx = classNames.bind(styles);

function NavbarComponent({ anchoring, getSocket }) {
    const cookies = new Cookies()
    const dispatch = useDispatch()
    const User = useSelector(infoUser)
    const NotiList = useSelector(showNoti)
    const handleClickLogOut = () => {
        cookies.remove('AccessToken')
        dispatch(logout())
    }
    const handleMouseLeave = () => {
        if(cookies.get('AccessToken') !== undefined) {
            dispatch(sendNoti(cookies.get('AccessToken')))
        }
    }
    useEffect(() => {
        let newSocket
        if (cookies.get('AccessToken') !== undefined) {
            dispatch(getUser(cookies.get('AccessToken')))
            dispatch(getNoti(cookies.get('AccessToken')))
            dispatch(getLengthCard(cookies.get('AccessToken')))
            newSocket = io(`${process.env.REACT_APP_CALL_API}`, {
                auth: {
                    token: cookies.get('AccessToken')
                }
            })
            newSocket.on('repUpdateBill', async () => {
                dispatch(getNoti(cookies.get('AccessToken')))
            })
            getSocket(newSocket)
            return () => {
                newSocket.disconnect()
                newSocket.off('repUpdateBill')

            }
        }
    }, [])
    return (
        <header>
            {sessionStorage.getItem('Address') === null ? <GetAddRess /> : null}
            <nav ref={anchoring}>
                <ul>
                    <li><Link to='/'>Trang chủ</Link></li>
                    <li>Thực đơn</li>
                    <li>Đặt bàn</li>
                    <li style={{ pointerEvents: 'none' }}>
                        <img className={cx('logo_gogi')} src={LogoGogi} alt="" />
                    </li>
                    <li>Trợ giúp</li>
                    <li onMouseLeave={() => handleMouseLeave()} className={cx('header_navbar-item_noti')}>Thông báo
                        {NotiList[0] > 0 ? (
                            <span className={cx('header_navbar-item_amount')}>{NotiList[0]}</span>
                        ) : null}
                        <div className={cx('header_notify')}>
                            <div className={cx('header_notify-header')}>
                                <h3>Thông báo mới nhận</h3>
                            </div>
                            {NotiList[1].map((Noti, i) => (
                                <div key={i} className={cx('header_notify-list')}>
                                    <div className={cx('header_notify-list_img')}>
                                        <img src={Slogan} />
                                    </div>
                                    <div className={cx('header_notify-list_content')}>
                                        <h2>{Noti.Containt}</h2>
                                        <h3>Thông báo tự động biến mất sau 24h</h3>
                                        <h4>{Noti.Time}</h4>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </li>
                    {Object.keys(User).length > 0 ? (
                        <li className={cx('header_navbar-item')} >
                            <div className={cx('header_navbar_img-user')}>
                                <img src={`${process.env.REACT_APP_CALL_API}/api/v12/avtuser/${User.Avt}`} className={cx('header_navbar-user-img')} />
                            </div>
                            <span className={cx('header_navbar-user-name')}>
                                {User.UserName}
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
                                <li style={{ padding: '0' }} className={cx('header_navbar-user-item')}>
                                    <a onClick={handleClickLogOut}>Đăng xuất</a>
                                </li>
                            </ul>
                        </li>
                    ) : (
                        <li><Link to='/login'>Đăng nhập</Link></li>
                    )}
                </ul>
            </nav>
        </header>
    )
}
function HeaderComponent({ indexSlide, setIndexSlide, Animation, anchoring, buttonAction, getSocket }) {
    const dispatch = useDispatch()
    const Products = useSelector(listBestSeller)
    const [countContent, setCountContent] = useState(0)
    const image = useRef()
    let rotate = useRef(0)
    let active = useRef(0)
    const imgProductSlide = useRef([])
    let countItem = 6;
    let rotateAdd = 360 / countItem;
    const show = (rotate, active) => {
        setCountContent(active)
        image.current.style.setProperty("--rotate", rotate + 'deg');
        image.current.style.setProperty("--rotate", rotate + 'deg');
    }
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
        dispatch(getBestSeller())
        return () => {
            dispatch(resetHeader())
        }
    }, [])
    return (
        <>
            <Navbar getSocket={getSocket} anchoring={anchoring} />
            <div ref={e => Animation.current[0] = e} className={cx('slider')}>
                <div className={cx('title')}>
                    <p>BBQ</p>
                    <p>GOGI</p>
                    <p>HOUSE</p>
                </div>
                <div ref={image} className={cx('images')}>
                    <div className={indexSlide[0] === 5 ? cx('item', 'Active') : cx('item')} style={{ '--i': 1 }}>
                        <img src={Products.length > 0 ? (`${process.env.REACT_APP_CALL_API}/api/v12/bodyimg/${Products[5].Img}`) : null} ref={(e) => imgProductSlide.current[5] = e} />
                    </div>
                    <div className={indexSlide[0] === 4 ? cx('item', 'Active') : cx('item')} style={{ '--i': 2 }}>
                        <img src={Products.length > 0 ? (`${process.env.REACT_APP_CALL_API}/api/v12/bodyimg/${Products[4].Img}`) : null} ref={(e) => imgProductSlide.current[4] = e} />
                    </div>
                    <div className={indexSlide[0] === 3 ? cx('item', 'Active') : cx('item')} style={{ '--i': 3 }}>
                        <img src={Products.length > 0 ? (`${process.env.REACT_APP_CALL_API}/api/v12/bodyimg/${Products[3].Img}`) : null} ref={(e) => imgProductSlide.current[3] = e} />
                    </div>
                    <div className={indexSlide[0] === 2 ? cx('item', 'Active') : cx('item')} style={{ '--i': 4 }}>
                        <img src={Products.length > 0 ? (`${process.env.REACT_APP_CALL_API}/api/v12/bodyimg/${Products[2].Img}`) : null} ref={(e) => imgProductSlide.current[2] = e} />
                    </div>
                    <div className={indexSlide[0] === 1 ? cx('item', 'Active') : cx('item')} style={{ '--i': 5 }}>
                        <img src={Products.length > 0 ? (`${process.env.REACT_APP_CALL_API}/api/v12/bodyimg/${Products[1].Img}`) : null} ref={(e) => imgProductSlide.current[1] = e} />
                    </div>
                    <div className={indexSlide[0] === 0 ? cx('item', 'Active') : cx('item')} style={{ '--i': 6 }}>
                        <img src={Products.length > 0 ? (`${process.env.REACT_APP_CALL_API}/api/v12/bodyimg/${Products[0].Img}`) : null} ref={(e) => imgProductSlide.current[0] = e} />
                    </div>
                </div>
                <div className={cx('content')}>
                    <div className={countContent === 0 ? cx('item', 'active') : cx('item')}>
                        <h1>{(Products.length !== 0 ? (Products[0].Name) : (null))}</h1>
                        <div className={cx('des')}>
                            {(Products.length !== 0 ? (Products[0].Dsription) : (null))}
                        </div>
                        <button>See more</button>
                    </div>
                    <div className={countContent === 1 ? cx('item', 'active') : cx('item')}>
                        <h1>{(Products.length !== 0 ? (Products[1].Name) : (null))}</h1>
                        <div className={cx('des')}>
                            {(Products.length !== 0 ? (Products[1].Dsription) : (null))}
                        </div>
                        <button>See more</button>
                    </div>
                    <div className={countContent === 2 ? cx('item', 'active') : cx('item')}>
                        <h1>{(Products.length !== 0 ? (Products[2].Name) : (null))}</h1>
                        <div className={cx('des')}>
                            {(Products.length !== 0 ? (Products[2].Dsription) : (null))}
                        </div>
                        <button>See more</button>
                    </div>
                    <div className={countContent === 3 ? cx('item', 'active') : cx('item')}>
                        <h1>{(Products.length !== 0 ? (Products[3].Name) : (null))}</h1>
                        <div className={cx('des')}>
                            {(Products.length !== 0 ? (Products[3].Dsription) : (null))}
                        </div>
                        <button>See more</button>
                    </div>
                    <div className={countContent === 4 ? cx('item', 'active') : cx('item')}>
                        <h1>{(Products.length !== 0 ? (Products[4].Name) : (null))}</h1>
                        <div className={cx('des')}>
                            {(Products.length !== 0 ? (Products[4].Dsription) : (null))}
                        </div>
                        <button>See more</button>
                    </div>
                    <div className={countContent === 5 ? cx('item', 'active') : cx('item')}>
                        <h1>{(Products.length !== 0 ? (Products[5].Name) : (null))}</h1>
                        <div className={cx('des')}>
                            {(Products.length !== 0 ? (Products[5].Dsription) : (null))}
                        </div>
                        <button>See more</button>
                    </div>
                </div>
                <div ref={buttonAction} className={cx('button_container')}>
                    <button onClick={prevSlider} id={cx('prev')}>&lt;</button>
                    <button onClick={nextSlider} id={cx('next')}>&gt;</button>
                </div>
            </div>
            <div className={cx('product_desciption')}>
                <div className={cx('product_desciption_left')}>
                    <div className={cx('product_desciption_left_container')}>
                        <img className={cx('product_desciption_left_container_wood')} src={Wood} alt="" />
                        <img className={cx('product_desciption_left_container_Romaine')} src={Salad} alt="" />
                        <img className={cx('product_desciption_left_container_Tomato')} src={Tomato} alt="" />
                    </div>
                </div>
                <section className={cx('product_desciption_right')}>
                    <h2>{(Products.length !== 0 ? (Products[indexSlide[0]].Name) : (null))}</h2>
                    <p>
                        {(Products.length !== 0 ? (Products[indexSlide[0]].Dsription) : (null))}</p>
                </section>
            </div>
            <BestSeller indexSlide={indexSlide} Animation={Animation} cx={cx} />
        </>
    );
}
export const Navbar = memo(NavbarComponent)
export const Header = memo(HeaderComponent)
