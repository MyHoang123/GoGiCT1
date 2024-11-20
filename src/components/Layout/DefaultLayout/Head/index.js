import axios from 'axios'
import { useEffect, useRef, useState, useContext, memo, useCallback } from 'react'
import io from 'socket.io-client'
import { Cookies } from 'react-cookie'
import { Link } from 'react-router-dom'
import styles from './Card.module.scss'
import classNames from "classnames/bind"
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import { IdElementContext } from '../IdElementContext'
import { faPause,faPlay, faStar,faStarHalfStroke,faHeart,faCartShopping } from '@fortawesome/free-solid-svg-icons'
import { LoginSocialFacebook } from 'reactjs-social-login'
import { FacebookLoginButton } from "react-social-login-buttons"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook,faGoogle } from '@fortawesome/free-brands-svg-icons'
import Avtmale from "~/Asset/images/avtmale.png"
import Hihi from "~/Asset/Vidoe/gogi.mp4"
import WoodBase from "~/Asset/images/0622-angle-2-removebg-preview.png"
import Tomato1 from "~/Asset/images/lovepik-little-tomato-png-image_400974636_wh860-removebg-preview.png"
import Salad from "~/Asset/images/Romaine-removebg-preview.png"
import Slogan from "~/Asset/images/shipper-co-giao-hang-khi-gian-cach_2707111247.jpg"
import { RenderStar } from '~/hooks'

// import Slogan from "../../../../Asset/images/1.png"
import { GoogleLogin } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'
const cx = classNames.bind(styles);
function Header() {
    const {socket, setSocket, modalVideoBest, videoBest, listProductBest, imgBestSeller, handleClickOpenLogin, modelBody, setModelLogin, modelLogin, setAmount, btn, navbar, darkMode, setModelProfile,imgProductSlide, desProduct, indexSlide, setIndexSlide,autoNext, checkAutoNext, sloganProduct } = useContext(IdElementContext)
    const image = useRef()
    // ClassName
    const [countContent,setCountContent ] = useState(0)
    
    const [error, setError] = useState(null)
    const [countActiveNavbar,setCountActiveNavbar ] = useState(0)
    const [Acc,setAcc] = useState()
    const [Pass,setPass] = useState(null)
    const [Passn,setPassn] = useState()
    const [playSlider,setPlaySlider ] = useState(true)
    const [loginSMS,setLoginSMS ] = useState(false)
	const [notifis,setNotifis] = useState([])
    const [products,setProducts ] = useState([])
    const [AmountNoti, setAmountNoti] = useState(0)
    const [CheckNoti, setCheckNoti] = useState(null)
// Cookie
    const cookies = new Cookies();
    const contentItem1 = [
        cx('item', 'active'),
        cx('item'),
    ]
    const activeNavbar = [
        cx('header_navbar-item','active'),
        cx('header_navbar-item'),
    ]
    const headerUser = cx('header_navbar-user-name-item', {
        darkmode: darkMode
    })
    const buttonprimary = cx('btn','button-login')
    const forgetPassWord = cx('auth-form_help-link' , 'auth-form_help-forget')
    const loginFacebook = cx('auth-form_socials-facebook','btn','btn--sizeS','btn--with-icon')
    const loginGoogle = cx('auth-form_socials-google', 'btn','btn--sizeS' ,'btn--with-icon')
    const notificeLogin = useRef()
    const notiPass = useRef()
    const notiPhone = useRef()
    const passlow = useRef()
    const hightpass = useRef()
    const checkpassword = useRef([])

    //Context
    // Xoay
    let rotate = useRef(0);
    let active = useRef(0);

    let countItem = 6;
    let rotateAdd = 360 / countItem;
    const nextSlider = () =>{
        setIndexSlide(() => {
            const newImg = [...indexSlide]
            const lastImage = newImg.shift();
            newImg.push(lastImage);
            return newImg
            })
        active.current = active.current + 1 > countItem - 1 ? 0 : active.current + 1;
        rotate.current = rotate.current + rotateAdd; 
        show(rotate.current,active.current);
    }
    const prevSlider = () =>{
        setIndexSlide(() => {
            const newImg = [...indexSlide]
            const lastImage = newImg.pop();
            newImg.unshift(lastImage);
            return newImg
            })
        active.current = active.current - 1 < 0 ? countItem - 1 : active.current - 1;
        rotate.current = rotate.current - rotateAdd; 
        show(rotate.current,active.current);     
         
    }
    const pauseSlider = () =>{
        if(playSlider) {
            clearInterval(autoNext.current)
            setPlaySlider(false)
        }else{
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
        // Gửi dữ liệu lên API
        async function chekcLogin(Account) {
            try {
             const response = await axios.post('http://localhost:5000/api/v12/checkuser', Account);
             if(response.data.massege === 'Thanh cong') {
                localStorage.setItem('Account',JSON.stringify(response.data.data))
                cookies.set('AccessToken', response.data.token, { path: '/', maxAge: 604800 }); // 604800 giây = 7 ngày
                const newSocket = io('http://localhost:8080',{
                    auth: {
                        token: response.data.token
                    }
                });
                setSocket(newSocket)
                setModelLogin(false)
             }
            } catch (error) {
              console.error('Lỗi khi thêm sản phẩm:', error);
              // Xử lý lỗi tại đây.
            }
          }
        async function login(Account) {
            try {
                    const response = await axios.post('http://localhost:5000/api/v12/login', Account);
                    console.log("🚀 ~ login ~ response:", response)
                    if(response.data.massege === 'that bai') {
                        notificeLogin.current.style.display = 'block'
                    }
                    else {
                        localStorage.setItem('Account',JSON.stringify(response.data.data))
                        cookies.set('AccessToken', response.data.token, { path: '/', maxAge: 604800 }); // 604800 giây = 7 ngày
                        setModelLogin(false)
                        setAmount(response.data.lengthCard)
                        const newSocket = io('http://localhost:8080',{
                                auth: {
                                    token: response.data.token
                                }
                            });
                        setSocket(newSocket)
                        notificeLogin.current.style.display = 'none'
                    }
                } catch (error) {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Vui lòng nhập đúng số điện thoại",
                        footer: '<a href="#">Why do I have this issue?</a>'
                      });
                    // Xử lý lỗi tại đây.
                }
            }
            async function registerAccount(Account) {
                try {
                 const response = await axios.post('http://localhost:8080/api/v12/createaccount', Account)
                if(response.data.massege === 'that bai') {
                    Swal.fire({
                        icon: "error",
                        title: "Số Điện Thoại Đã Tồn Tại",
                        text: "Nhập lại số điện thoại",
                        footer: '<a href="#">Why do I have this issue?</a>'
                      });
                }
                else {
                    let timerInterval;
                        Swal.fire({
                        title: "Đăng ký tài khoảng thành công",
                        html: "Trở lại sau <b></b> giây.",
                        timer: 2000,
                        timerProgressBar: true,
                        didOpen: () => {
                            Swal.showLoading();
                            const timer = Swal.getPopup().querySelector("b");
                            timerInterval = setInterval(() => {
                            timer.textContent = `${Swal.getTimerLeft()}`;
                            }, 100);
                        },
                        willClose: () => {
                            clearInterval(timerInterval);
                            handleClickRemove()
                        }
                        }).then((result) => {
                        /* Read more about handling dismissals below */
                        if (result.dismiss === Swal.DismissReason.timer) {
                            console.log("I was closed by the timer");
                        }
                        });
                }
                } catch (error) {
                  console.error('Lỗi khi thêm sản phẩm:', error);
                  // Xử lý lỗi tại đây.
               
                }
              }
        async function updateNoti(Token) {
        try {
                const response = await axios.post('http://localhost:5000/api/v12/updatenoti', Token);
            } catch (error) {
                    alert('Có lói xảy ra vui lòng thử lại')
                // Xử lý lỗi tại đây.
            }
        }
    const handleClickLogOut = useCallback((socket) => {
        localStorage.removeItem('Account')
        cookies.remove('AccessToken', { path: '/' })
        setAmountNoti(0)
        setAmount(0)
        setModelProfile(false)
        socket.disconnect()
        setSocket(null)
    },[])
    const handleClickRemove = useCallback(() => {
        setModelLogin(false)
        notificeLogin.current.style.display = 'none'
        notiPass.current.style.display = 'none'
        notiPhone.current.style.display = 'none'
        passlow.current.style.display = 'none'
    },[])
    const handleSubmitLogin = useCallback((e,Acc,Pass) => {
        e.preventDefault()
        if(Acc !== null && Pass !== null) {
            const Account = {
                Acc: Acc,
                Pass: Pass
            }
            // console.log(Account)
            login(Account)
        }
        else{
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Vui lòng nhập số điện thoại",
                footer: '<a href="#">Why do I have this issue?</a>'
              });
        }
    },[])
    const handleClickSigIn = useCallback(() => {
        modelBody.current[1].style.display = 'block'
        modelBody.current[0].style.display = 'none'
    },[])
    const handleClickLogin = useCallback(() => {
        modelBody.current[0].style.display = 'block'
        modelBody.current[1].style.display = 'none'
    },[])
    const handleSubmitSigin = useCallback((e) => {
        e.preventDefault()
        const phoneRegex = /^0\d{9}$/ // Biểu thức chính quy: 10 chữ số từ 0-9
        const isValid = phoneRegex.test(Acc);
        const regexUpper = /^(?=.*[A-Z]).+$/;
        const regex = /^.{8,}$/;
        const isValidUpper = regexUpper.test(Pass);
        const isValidpass = regex.test(Pass);
        if(Pass !== Passn) {
            notiPass.current.style.display = 'block'
        }
        else {
            notiPass.current.style.display = 'none'
            if(isValid) {
                if(isValidUpper && isValidpass) {
                    const Account = {
                        Name: Acc,
                        Pass: Pass,
                        Classify: 'user'
                    }
                    notiPhone.current.style.display = 'none'
                    console.log(Account)
                    // registerAccount(Account)
                }
                else {
                    passlow.current.style.display = 'block'
                }
            }
            else {
                notiPhone.current.style.display = 'block'
            }
        }
    },[])
    const handleMouseEnter = useCallback(() => {
		if(AmountNoti !== 0) {
			if(cookies.get('AccessToken') !== undefined) {
				const Token = {
					token: cookies.get('AccessToken')
				}
				updateNoti(Token)
			}
		}
		// Thực hiện các hành động khác khi hover
	  },[])
	  const handleMouseLeave = useCallback((notifis) => {
		if(AmountNoti !== 0) {
			const result = notifis.reduce((acc,curr) => {
				const temp = {...curr}
				temp.Status = 1
				return [...acc,temp]
			},[])
			setNotifis(result)
            setAmountNoti(0)
		}
		// Thực hiện các hành động khác khi rời chuột ra khỏi phần tử
	  },[])
  
    // useEffect(() => {
    //     autoNext.current = setInterval(() => {
    //         nextSlider()
    //     },4000)
    //     return () => {
    //         clearInterval(autoNext.current)
    //     }
    // },[countContent,checkAutoNext])
        useEffect(() => {
            for(let i = 0; i <= 5; i++) {
                if(i === 0) {
                    imgProductSlide.current[indexSlide[i]].style.opacity = '1'
                }
                else if(i === 1) {
                    imgProductSlide.current[indexSlide[i]].style.opacity = '1'
                }
                else if (i === 5) {
                    imgProductSlide.current[indexSlide[i]].style.opacity = '1'
                }
                else {
                    imgProductSlide.current[indexSlide[i]].style.opacity = '0'
                }
            }
    },[indexSlide])
    useEffect(() => {
        if(cookies.get('AccessToken') !== undefined) {
            axios.all([
                axios.get('http://localhost:8080/api/v12/showbestellerCategoris'),
                axios.post('http://localhost:8080/api/v12/showlengthcard',{token: cookies.get('AccessToken')}),
                axios.post('http://localhost:8080/api/v12/shownotifi',{token: cookies.get('AccessToken')}),
              ])
                .then(axios.spread((Product,lengthCard, Noti) => {
                        if(Noti.data.data !== null) {
                            setNotifis(Noti.data.data)
                        }
                        setProducts(Product.data.data)
                        setAmount(lengthCard.data.data)
                        setAmountNoti(Noti.data.lenght)
                }))
                .catch (err => {
                    console.error()
                })
        }
        else {
            axios.all([
                axios.get('http://localhost:8080/api/v12/showbestellerCategoris'),
                 ])
                .then(axios.spread((Product) => {
                    setProducts(Product.data.data)
                }))
                .catch (err => {
                    console.error()
                })
        }
        
    },[])
    useEffect(() => {
        if(sessionStorage.getItem('Address') === null) {
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
                        sessionStorage.setItem('Address',data.display_name)
                        sessionStorage.setItem('destination',`${latitude},${longitude}`)
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
        if(cookies.get('AccessToken') !== undefined) {	
            if(socket !== null) {
                socket.on('repConfirm', (data) => {
                    const newArr = [...notifis]
                    let Amount = 0
                    const temp = {
                        Containt: "Đơn hàng của bạn đã được duyệt",
                        IdBill: data,
                        Status: 0,
                        Time: "0 Giây trước"
                    }
                    newArr.unshift(temp)
                    setNotifis(newArr)
                    for(let i in newArr) {
                        if(newArr[i].Status === 0) {
                            Amount = Amount + 1
                        }
                    }
                    setAmountNoti(Amount)
                })
            }
        }
      }, [socket,notifis])
    return ( 
        <>
<div className={cx('header_content')}>
    <nav ref={navbar} className={cx('navbar_container')}>
        <div ref={btn} className={cx('navbar_content')}>
            <ul className={cx('navbar_content_left')}>
                <li className={(countActiveNavbar === 0 ? activeNavbar[0] : activeNavbar[1])} onClick={() => setCountActiveNavbar(0)} >Trang chủ</li>
                <li className={(countActiveNavbar === 1 ? activeNavbar[0] : activeNavbar[1])} onClick={() => setCountActiveNavbar(1)} >Thực đơn</li>
                <li className={(countActiveNavbar === 2 ? activeNavbar[0] : activeNavbar[1])} onClick={() => setCountActiveNavbar(2)} >Đặt bàn</li>
            </ul>
            <div className={cx('logo_gogi')} style={{pointerEvents:'none'}} >
                <div className={cx('logo_nav')}>
                    <img src={'http://localhost:8080/api/v12/header/logo-gogi-house-X5%20(1).png'} alt=""/>
                </div>
            </div>
            <ul className={cx('navbar_content_right')}>
            <li className={(countActiveNavbar === 3 ? activeNavbar[0] : activeNavbar[1])} onClick={() => setCountActiveNavbar(3)} >Trợ giúp</li>
            <li onMouseEnter={handleMouseEnter} onMouseLeave={() => handleMouseLeave(notifis)} className={cx('header_navbar-item_noti')} onClick={() => setCountActiveNavbar(4)} >
                {AmountNoti > 0 ? (
                    <span className={cx('header_navbar-item_amount')}>{AmountNoti}</span>
                ) : null}
                    <a style={{width: '100%'}} className={cx('header_navbar-tile--no-pointer')}>
                            Thông Báo
                    </a>
                    <div className={cx('header_notify')}>
                                <header className={cx('header_notify-header')}>
                                    <h3>Thông báo mới nhận</h3>
                                </header>
                                        {notifis.map((noti,i) => (
                                            <div key={i} style={noti.Status === 0 ? {backgroundColor:'#f1faff'} : null} className={cx('header_notify-list')}>
                                                <div className={cx('header_notify-list_img')}>
                                                        <img src={Slogan}/>
                                                </div>
                                                <div className={cx('header_notify-list_content')}>
                                                    <h2>{noti.Containt}</h2>
                                                    <h3>Đơn hàng sẽ được giao trong 40p nữa</h3>
                                                    <h4>{noti.Time}</h4>
                                                </div>
                                            </div>
                                        ))}     
                                <div className={cx('header_notify-footer')}>
                                    <a href="" className={cx('header_notify-footer-btn')}>Xem tất cả</a>
                                </div>
        
                            </div>
            </li>
            {JSON.parse(localStorage.getItem('Account')) === null ? (
                <li className={(countActiveNavbar === 4 ? activeNavbar[0] : activeNavbar[1])} ><Link to='/loginuser'>Đăng nhập</Link></li>
                    ) : (
                    <li style={{width:'210px'}} className={cx('header_navbar-item')} >
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
                            <li onClick={() => handleClickLogOut(socket)} style={{padding:'0'}} className={cx('header_navbar-user-item')}>
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
            <p style={{marginTop: '20px'}}>GOGI</p>
            <p style={{marginLeft: '20%', marginTop: '20px'}}>HOUSE</p>
        </div>
        <div ref={image} className={cx('images')}>
            <div className={cx('item')} style={{'--i': 1}}>
                <img className={cx('Img_slide')} ref={(e) => imgProductSlide.current[5] = e} src={(products.length !== 0 ? (`http://localhost:8080/api/v12/bodyimg/${products[5].Img}`) : (null)) } />
            </div>
            <div className={cx('item')} style={{'--i': 2}}>
                <img className={cx('Img_slide')} ref={(e) => imgProductSlide.current[4] = e} src={(products.length !== 0 ? (`http://localhost:8080/api/v12/bodyimg/${products[4].Img}`) : (null)) } />
            </div>
            <div className={cx('item')} style={{'--i': 3}}>
                <img className={cx('Img_slide')} ref={(e) => imgProductSlide.current[3] = e} src={(products.length !== 0 ? (`http://localhost:8080/api/v12/bodyimg/${products[3].Img}`) : (null)) } />
            </div>
            <div className={cx('item')} style={{'--i': 4}}>
                <img className={cx('Img_slide')} ref={(e) => imgProductSlide.current[2] = e} src={(products.length !== 0 ? (`http://localhost:8080/api/v12/bodyimg/${products[2].Img}`) : (null)) } />
            </div>
            <div className={cx('item')} style={{'--i': 5}}>
                <img className={cx('Img_slide')} ref={(e) => imgProductSlide.current[1] = e} src={(products.length !== 0 ? (`http://localhost:8080/api/v12/bodyimg/${products[1].Img}`) : (null)) } />
            </div>
            <div className={cx('item')} style={{'--i': 6}}>
                <img className={cx('Img_slide')} ref={(e) => imgProductSlide.current[0] = e} src={(products.length !== 0 ? (`http://localhost:8080/api/v12/bodyimg/${products[0].Img}`) : (null)) } />
            </div>
        </div>
        <div className={cx('content')}>
            <div className={(countContent === 0 ? contentItem1[0] : contentItem1[1])}>
                    {/* <img style={{width:'250px'}} src={Slogan}/> */}
                <h1>{(products.length !== 0 ? (products[0].Name) : (null)) } </h1>
                <div className={cx('des')}>
                    {(products.length !== 0 ? (products[0].Dsription) : (null)) }
                </div>
                <button>See more</button>
            </div>
            <div className={(countContent === 1 ? contentItem1[0] : contentItem1[1])}>
                <h1>{(products.length !== 0 ? (products[1].Name) : (null)) }</h1>
                <div className={cx('des')}>
                    {(products.length !== 0 ? (products[1].Dsription) : (null)) }
                </div>
                <button>See more</button>
            </div>
            <div className={(countContent === 2 ? contentItem1[0] : contentItem1[1])}>
                <h1>{(products.length !== 0 ? (products[2].Name) : (null)) }</h1>
                <div className={cx('des')}>
                    {(products.length !== 0 ? (products[2].Dsription) : (null)) }
                </div>
                <button>See more</button>
            </div>
            <div className={(countContent === 3 ? contentItem1[0] : contentItem1[1])}>
                <h1>{(products.length !== 0 ? (products[3].Name) : (null)) }</h1>
                <div className={cx('des')}>
                    {(products.length !== 0 ? (products[3].Dsription) : (null)) }
                </div>    
                <button>See more</button>
            </div>
            <div className={(countContent === 4 ? contentItem1[0] : contentItem1[1])}>
                <h1>{(products.length !== 0 ? (products[4].Name) : (null)) }</h1>
                <div className={cx('des')}>
                    {(products.length !== 0 ? (products[4].Dsription) : (null)) }
                </div>
                <button>See more</button>
            </div>
            <div className={(countContent === 5 ? contentItem1[0] : contentItem1[1])}>
                <h1>{(products.length !== 0 ? (products[5].Name) : (null)) }</h1>
                <div className={cx('des')}>
                    {(products.length !== 0 ? (products[5].Dsription) : (null)) }
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
                        <FontAwesomeIcon style={{height: '55px', transform: 'translate(8px,-14px)'}} icon={faPause} />
                    ) : (
                        <FontAwesomeIcon style={{height: '55px',width: '50px', transform: 'translate(8px,-14px)'}} icon={faPlay} /> 
                    ))}
                    
                </button>
            </div>
            <div className={cx('button_click_slider-item')}>
                <button onClick={nextSlider} id={cx('next')}>&gt;</button>
            </div>
        </div>
    </div>
</div>
    {/* Model Login */}

    <div className={cx('desproduct_container')}>
        <div className={cx('desproduct_container-content')}>
            <div className={cx('desproduct_content-item')}>
                <div className={cx('desproduct_slogan')}>
                    <img ref={sloganProduct} />
                </div>
                <div className={cx('desproduct_woodbase')}>
                    <img className={cx('desproduct_img')} src={WoodBase}/>
                </div>
                <div className={cx('desproduct_tomato')}>
                    <img className={cx('desproduct_tomato-item')} src={Tomato1}/>
                </div>
                <div className={cx('desproduct_salad')}>
                    <img className={cx('desproduct_salad-item')} src={Salad}/>
                </div>
            </div>
            <div className={cx('desproduct_content-item')}>
                <div className={cx('desproduct_content-des')}>
                    <h1 ref={(e) => desProduct.current[0] = e}>{(products.length !== 0 ? (products[indexSlide[0]].Name) : (null)) } </h1>
                    <span ref={(e) => desProduct.current[1] = e}>{(products.length !== 0 ? (products[indexSlide[0]].Dsription) : (null)) }</span>
                </div>
            </div>
        </div>
    <h1 className={cx('Modal_bestseller_header')}>Best Seller</h1>
    </div>
    <div className={cx('Modal_bestseller')}>
        <div className={cx('bestseller_container')}>
        {products.length !== 0 ? (
            <>
                <div className={cx('bestseller_item')}>
                <div className={cx('card')}>
                <label className={cx('favorite')}>
                    <FontAwesomeIcon className={cx('heart_product')} icon={faHeart} style={{fontSize: '15px'}} />
                </label>
                <div className={cx('image_container')}>
                    <img ref={e => imgBestSeller.current[0] = e} className={cx('image_animate_best')} src={`http://localhost:8080/api/v12/showimgproduct/${(products.length !== 0 ? (products[indexSlide[5]].Img) : (null))}`} style={{width: '100%', height: '100%',objectFit: 'cover'}} />
                </div>
                <div className={cx('title_card')}>
                    <span>{(products.length !== 0 ? (products[indexSlide[5]].Name) : (null)) }</span>
                </div>
                <ul style={{paddingLeft: '0',color:'#D9D9D9',marginBottom:'0'}} className="colors-container">
                    <span style={{marginTop: '2px',fontSize: '14px',marginRight:'10px'}}>Giá:</span>
                    <span className='price_product' style={{fontSize: '6px'}}>{(products.length !== 0 ? (products[indexSlide[5]].Price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫') : (null)) }</span>
                </ul>
                <div className={cx('size')}>
                    <div className='svg four-star-svg'>
                        <RenderStar Star = {(products.length !== 0 ? (products[indexSlide[5]].Star) : (null)) }/>
                    </div>
                    <div style={{color:'#a8a8a8'}} className={cx('Sales_product')}> Đã bán:  {products.length !== 0 ? (products[indexSlide[5]].Sales) : null}</div>
                </div>
                <div className={cx('action')}>
                    <button className={cx('cart-button')}>
                                    <FontAwesomeIcon icon={faCartShopping} />
                    <span>Add to cart</span>
                    </button>
                </div>
                </div>
            </div>
            <div className={cx('bestseller_item')}>
            <div className={cx('card')}>
            <label className={cx('favorite')}>
                    <FontAwesomeIcon className={cx('heart_product')} icon={faHeart} style={{fontSize: '15px'}} />
                </label>
                <div className={cx('image_container')}>
                                                        
                </div>
                <div className={cx('title_card')}>
                    <span>{(products.length !== 0 ? (products[indexSlide[0]].Name) : (null)) } </span>
                </div>
                <ul style={{paddingLeft: '0',color:'#D9D9D9',marginBottom:'0'}} className="colors-container">
                    <span style={{marginTop: '2px',fontSize: '14px',marginRight:'10px'}}>Giá:</span>
                    <span className='price_product' style={{fontSize: '6px'}}>{(products.length !== 0 ? (products[indexSlide[0]].Price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫') : (null)) } </span>
                </ul>
                <div className={cx('size')}>
                    <div className='svg four-star-svg'>
                        <RenderStar Star = {(products.length !== 0 ? (products[indexSlide[0]].Star) : (null)) }/>
                    </div>
                    <div style={{color:'#a8a8a8'}} className={cx('Sales_product')}> Đã bán: {products.length !== 0 ? (products[indexSlide[0]].Sales) : null}</div>
                </div>
                <div className={cx('action')}>
                    <button className={cx('cart-button')}>
                    <FontAwesomeIcon icon={faCartShopping} />
                    <span>Add to cart</span>
                    </button>
                </div>
                </div>
            </div>
            <div className={cx('bestseller_item')}>
            <div className={cx('card')}>
            <label className={cx('favorite')}>
                    <FontAwesomeIcon className={cx('heart_product')} icon={faHeart} style={{fontSize: '15px'}} />
                </label>
                <div className={cx('image_container')}>
                     <img ref={e => imgBestSeller.current[1] = e} className={cx('image_animate_best')} src={`http://localhost:8080/api/v12/showimgproduct/${(products.length !== 0 ? (products[indexSlide[1]].Img) : (null))}`} style={{width: '100%', height: '100%',objectFit: 'cover'}} />
                </div>
                <div className={cx('title_card')}>
                    <span>{(products.length !== 0 ? (products[indexSlide[1]].Name) : (null)) }</span>
                </div>
                <ul style={{paddingLeft: '0',color:'#D9D9D9',marginBottom:'0'}} className="colors-container">
                    <span style={{marginTop: '2px',fontSize: '14px',marginRight:'10px'}}>Giá:</span>
                    <span className='price_product' style={{fontSize: '6px'}}>{(products.length !== 0 ? (products[indexSlide[1]].Price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫') : (null)) }</span>
                </ul>
                <div className={cx('size')}>
                    <div className='svg four-star-svg'>
                    <RenderStar Star = {(products.length !== 0 ? (products[indexSlide[1]].Star) : (null)) }/>
                    </div>
                    <div style={{color:'#a8a8a8'}} className={cx('Sales_product')}> Đã bán:  {products.length !== 0 ? (products[indexSlide[1]].Sales) : null}</div>
                </div>
                <div className={cx('action')}>
                    <button className={cx('cart-button')}>
                                    <FontAwesomeIcon icon={faCartShopping} />
                    <span>Add to cart</span>
                    </button>
                </div>
                </div>
            </div>
            <div className={cx('bestseller_item')}>
            <div className={cx('card')}>
            <label className={cx('favorite')}>
                    <FontAwesomeIcon className={cx('heart_product')} icon={faHeart} style={{fontSize: '15px'}} />
                </label>
                <div className={cx('image_container')}>
                    <img  className={cx('image_animate_best')} ref={e => listProductBest.current[0] = e} src={`http://localhost:8080/api/v12/showimgproduct/${(products.length !== 0 ? (products[indexSlide[2]].Img) : (null))}`} style={{width: '100%', height: '100%',objectFit: 'cover'}} />
                </div>
                <div className={cx('title_card')}>
                    <span>{(products.length !== 0 ? (products[indexSlide[2]].Name) : (null)) }</span>
                </div>
                <ul style={{paddingLeft: '0',color:'#D9D9D9',marginBottom:'0'}} className="colors-container">
                    <span style={{marginTop: '2px',fontSize: '14px',marginRight:'10px'}}>Giá:</span>
                    <span className='price_product' style={{fontSize: '6px'}}>{(products.length !== 0 ? (products[indexSlide[2]].Price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫') : (null)) }</span>
                </ul>
                <div className={cx('size')}>
                    <div className='svg four-star-svg'>
                        <RenderStar Star = {(products.length !== 0 ? (products[indexSlide[2]].Star) : (null)) }/>
                    </div>
                    <div style={{color:'#a8a8a8'}} className={cx('Sales_product')}> Đã bán:  {products.length !== 0 ? (products[indexSlide[2]].Sales) : null}</div>
                </div>
                <div className={cx('action')}>
                    <button className={cx('cart-button')}>
                                    <FontAwesomeIcon icon={faCartShopping} />
                    <span>Add to cart</span>
                    </button>
                </div>
                </div>
            </div>
            <div className={cx('bestseller_item')}>
                <div className={cx('card')}>
                    <label className={cx('favorite')}>
                        <FontAwesomeIcon className={cx('heart_product')} icon={faHeart} style={{fontSize: '15px'}} />
                    </label>
                    <div className={cx('image_container')}>
                        <img  className={cx('image_animate_best')} ref={e => listProductBest.current[1] = e} src={`http://localhost:8080/api/v12/showimgproduct/${(products.length !== 0 ? (products[indexSlide[3]].Img) : (null))}`} style={{width: '100%', height: '100%',objectFit: 'cover'}} />
                    </div>
                    <div className={cx('title_card')}>
                        <span>{(products.length !== 0 ? (products[indexSlide[3]].Name) : (null)) }</span>
                    </div>
                    <ul style={{paddingLeft: '0',color:'#D9D9D9',marginBottom:'0'}} className="colors-container">
                        <span style={{marginTop: '2px',fontSize: '14px',marginRight:'10px'}}>Giá:</span>
                        <span className='price_product' style={{fontSize: '6px'}}>{(products.length !== 0 ? (products[indexSlide[3]].Price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫') : (null)) }</span>
                    </ul>
                    <div className={cx('size')}>
                        <div className='svg four-star-svg'>
                            <RenderStar Star = {(products.length !== 0 ? (products[indexSlide[3]].Star) : (null)) }/>
                        </div>
                        <div style={{color:'#a8a8a8'}} className={cx('Sales_product')}> Đã bán:  {products.length !== 0 ? (products[indexSlide[3]].Sales) : null}</div>
                    </div>
                    <div className={cx('action')}>
                        <button className={cx('cart-button')}>
                                        <FontAwesomeIcon icon={faCartShopping} />
                        <span>Add to cart</span>
                        </button>
                    </div>
                </div>
            </div>
            <div className={cx('bestseller_item')}>
            <div className={cx('card')}>
            <label className={cx('favorite')}>
                    <FontAwesomeIcon className={cx('heart_product')} icon={faHeart} style={{fontSize: '15px'}} />
                </label>
                <div className={cx('image_container')}>
                    <img className={cx('image_animate_best')} ref={e => listProductBest.current[2] = e} src={`http://localhost:8080/api/v12/showimgproduct/${(products.length !== 0 ? (products[indexSlide[4]].Img) : (null))}`} style={{width: '100%', height: '100%',objectFit: 'cover'}} />
                </div>
                <div className={cx('title_card')}>
                    <span>{(products.length !== 0 ? (products[indexSlide[4]].Name) : (null)) }</span>
                </div>
                <ul style={{paddingLeft: '0',color:'#D9D9D9',marginBottom:'0'}} className="colors-container">
                    <span style={{marginTop: '2px',fontSize: '14px',marginRight:'10px'}}>Giá:</span>
                    <span className='price_product' style={{fontSize: '6px'}}>{(products.length !== 0 ? (products[indexSlide[4]].Price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫') : (null)) }</span>
                </ul>
                <div className={cx('size')}>
                    <div className='svg four-star-svg'>
                        <RenderStar Star = {(products.length !== 0 ? (products[indexSlide[4]].Star) : (null)) }/>
                    </div>
                    <div style={{color:'#a8a8a8'}} className={cx('Sales_product')}> Đã bán:  {products.length !== 0 ? (products[indexSlide[4]].Sales) : null}</div>
                </div>
                <div className={cx('action')}>
                    <button className={cx('cart-button')}>
                                    <FontAwesomeIcon icon={faCartShopping} />
                    <span>Add to cart</span>
                    </button>
                </div>
                </div>
            </div>
            </>
) : null}

        </div>
        <div className={cx('bestseller_video')}>
            <video ref={videoBest} className={cx('bestseller_video-item')} muted autoPlay loop>
                <source src={Hihi} type="video/mp4" />
            </video>
            <div ref={modalVideoBest} className={cx('bestseller_modal_video')}></div>
        </div>
    </div>
        </>
     );
}

export default memo(Header);