import axios from 'axios'
import ReactPaginate from 'react-paginate';
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import Accordion from 'react-bootstrap/Accordion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRocketchat } from '@fortawesome/free-brands-svg-icons';
import { faChevronLeft, faChevronRight, faSquareCaretDown, faMagnifyingGlass, faListUl,faHeart,faCartShopping,faBagShopping,faCaretDown,faCheckDouble, faSpinner, faArrowLeft,faStarHalfStroke,faArrowLeftLong,faStar } from '@fortawesome/free-solid-svg-icons';
import { IdElementContext } from '../IdElementContext';
import './Body.scss'
import iconHeaderBody1 from "../../../../Asset/images/iconHeaderBody1.png";
import iconHeaderBody2 from "../../../../Asset/images/iconHeaderBody2.png";
import iconHeaderBody3 from "../../../../Asset/images/iconHeaderBody3.png";
import iconHeaderBody4 from "../../../../Asset/images/iconHeaderBody4.png";
import menugogi from "../../../../Asset/images/gia-menu-gogi-house-221122-removebg-preview.png"
// Page
import PageNew from './PageNew';
import { useContext, useEffect, useMemo, useRef, useState,memo, useCallback } from 'react';
import { Cookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom'

//Custom Hook
import { useDebounce, RenderStar } from '~/hooks'
function Body() {
    // let socket
    // Cookie
    const cookies = new Cookies();
    const navigate = useNavigate()
// State
    const [loadSearch, setLoadSearch] = useState(false);
    const [products, setProducts] = useState([])
    const [categoris, setCategoris] = useState([])
    const [types, setTypes] = useState([])
    const [menu, setMenu] = useState([])
    const [detailType, setDetailType] = useState([])
    const [page, setPage] = useState(1)
    const [productDetail, setProductDetail] = useState({
        Img:'',
        Name:'',
        Price:'',
    })
    const [message, setMessage] = useState([])
    const [Star,setStar] = useState()
    const [cmtContent,setCmtContent] = useState(null)
    const [bodyimg, setBodyimg] = useState([])
    const [youtubelink, setYoutubeLink] = useState(null)
    const [searchValue, setSearchValue] = useState('')
    const [chat,setChat] = useState(false)
    const debounce = useDebounce(searchValue,500)
// Ref
    const modalDetailProduct = useRef()
    const buttonFakeAddCard = useRef([])
    const imgAddCard = useRef()
    const animationRef = useRef()
    const iconMenuArrow = useRef([])
    const indexCardProduct = useRef([])
    const cardButton = useRef([])
    const cardDetailProduct = useRef()
    const commentShow = useRef()
    const startHtml = useRef([])
    const allStar = useRef()
    const valueChat = useRef()
    // Context
    const {handleClickOpenLogin, Amount, setAmount, cartProduct,darkMode, titleHeaderBody,headerBodyContent,gogiBackround, itemHeaderBody,youtubeRef,bodyNhansu, socket } = useContext(IdElementContext)
    // ClassName
    const { IdProduct } = useContext(IdElementContext)
      // Api
    async function getChat(Account) {
        try {
                const response = await axios.post('http://localhost:8080/api/v12/showchat', Account);
                if(response.data.massege === 'Thanh cong') {
                    setMessage(response.data.data)
                }
            } catch (error) {
             alert('Có lói xảy ra vui lòng thử lại')
                // Xử lý lỗi tại đây.
            }
        }
    // Gửi dữ liệu lên API
     async function filterCategori(Filter) {
          try {
            const response = await axios.post('http://localhost:8080/api/v12/filtercategori', Filter);
            if(response.data.massege === 'Thanh cong') {
                setPage(1)
                setProducts(response.data.data)
            }
          } catch (error) {
            console.error('Lỗi khi thêm sản phẩm:', error);
            // Xử lý lỗi tại đây.
          }
        }
    async function addCard(IdProduct,button,Img) {
        try {
            cardButton.current[button].style.pointerEvents = 'none'
           const response = await axios.post('http://localhost:8080/api/v12/addcard', {IdProduct: IdProduct,token: cookies.get('AccessToken')});
           if(response.data.massege === 'Thanh cong') {
                    setAmount(prev => prev + 1)
                    cardButton.current[button].style.pointerEvents = 'auto'
                    imgAddCard.current.src = `http://localhost:8080/api/v12/showimgproduct/${Img}`
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
                            animationRef.current = requestAnimationFrame(animateAddcard);
                        }else {
                            buttonFakeAddCard.current[button].classList.remove('open')
                        }
                    };
                    animationRef.current = requestAnimationFrame(animateAddcard)

           }
           else if (response.data.massege === 'Tồn tại') {
                Swal.fire({
                    icon: "error",
                    title: "Lỗi",
                    text: "Sản phẩm đã tồn tại!",
                    footer: '<a href="#">Why do I have this issue?</a>'
                });
                cardButton.current[button].style.pointerEvents = 'auto'
           }
           else {
            cardButton.current[button].style.pointerEvents = 'auto'
            alert('Thêm sản phẩm thất bại')
           }
        } catch (error) {
            cardButton.current[button].style.pointerEvents = 'auto'
            console.error('Lỗi khi thêm sản phẩm:', error);
            // Xử lý lỗi tại đây.
        }
    }
   async function showComment(Id) {
    try {
        const response = await axios.post('http://localhost:8080/api/v12/showcomment', Id);
        if(response.data.massege === "Thanh Cong") {
            setCmtContent(response.data.data)
        }
       else {
        setCmtContent(null)
       }
    } catch (error) {
        console.error('Lỗi khi thêm sản phẩm:', error);
        // Xử lý lỗi tại đây.
    }
    }
    const handleClickFilterCategori = useCallback((Id) => {
        const Filter = {
            IdType: null,
            IdCate: Id
        }
        filterCategori(Filter)
    },[])
    const handleClickFilterProduct = useCallback((IdType,Idcate) => {
        const Filter = {
            IdType: IdType,
            IdCate:Idcate
        }
        filterCategori(Filter)
    },[])
    const handleClickAll = useCallback(() => {
        const Filter = {
            IdType: null,
            IdCate: null,
        }
        filterCategori(Filter)
    },[])
    const handleClickDetailProduct = useCallback((Id,Star,products) => {
        const newStar = Star + 0
        const productFilter = products.filter((product) => product.Id === Id )
        setProductDetail({
            Id: productFilter[0].Id,
            Name: productFilter[0].Name,
            Price: productFilter[0].Price,
            Img: productFilter[0].Img,
            Star: Star,
            Sales: productFilter[0].Sales,
        })
        modalDetailProduct.current.style.display = 'flex'
            allStar.current.innerText = `${newStar}/5`
        setStar(Star)
    },[products])
    const handleClickRemoveDetailProduct = useCallback(() => {
        modalDetailProduct.current.style.display = 'none'
        cardDetailProduct.current.classList.remove('open')
        commentShow.current.classList.remove('open')
    },[])
    const handleClickAddCard =  useCallback(async(button,Img,Id) => {
        if(button !== null) {
        addCard(Id,button,Img)
        }
        else {
            imgAddCard.current.classList.add('open')
           const timoutCard = setTimeout(()=> {
                imgAddCard.current.classList.remove('open')
            },700)
            return () => {       
                clearTimeout(timoutCard)
            } 
        }

    },[])
    const handleClickShowMenu = useCallback((e,index) => {
        for(let i = 0; i < iconMenuArrow.current.length; i++ ) {
            if(iconMenuArrow.current[i] !== index || e.target.ariaExpanded === 'false') {
                iconMenuArrow.current[i].style.transform = 'rotate(0)'
            }
            }
            if(e.target.ariaExpanded === 'true') {
                iconMenuArrow.current[index].style.transform = 'rotate(0)'
            }
            else if(e.target.ariaExpanded === 'false') {
                iconMenuArrow.current[index].style.transform = 'rotate(-90deg)'
            }
    },[])
    const handleClickShowComment = useCallback((Id) => {
        const IdProduct = {
            IdProduct: Id,
            token: cookies.get('AccessToken')
        }
        showComment(IdProduct)
        cardDetailProduct.current.classList.add('open')
        commentShow.current.classList.add('open')
    },[])
    const hanldeClickRanDom = useCallback((products) => {
        const count = products.filter(item =>  item.Status === 'visible').length
        const Array = [...products]
        const newArr = Array.splice(0,count)
        for (let i = newArr.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
        }
        setProducts([...newArr,...Array])
    },[])
    const handleClickNewProduct = useCallback((products) => {
        const count = products.filter(item =>  item.Status === 'visible').length
        const Array = [...products]
        const newArr = Array.splice(0,count)
        for (let i = 0; i < newArr.length - 1; i++) {
            for (let j = 0; j < newArr.length - 1 - i; j++) {
                if (newArr[j].Id < newArr[j + 1].Id) {
                    // Hoán đổi vị trí hai phần tử nếu thứ tự sai
                    let temp = newArr[j];
                    newArr[j] = newArr[j + 1];
                    newArr[j + 1] = temp;
                }
            }
        }
        setProducts([...newArr, ...Array])
        },[])
    const handleClickMinProduct = useCallback((products) => {
        const count = products.filter(item =>  item.Status === 'visible').length
        const Array = [...products]
        const newArr = Array.splice(0,count)
        for (let i = 0; i < newArr.length - 1; i++) {
            for (let j = 0; j < newArr.length - 1 - i; j++) {
              if (newArr[j].Price > newArr[j + 1].Price) {
                // Hoán đổi vị trí hai phần tử nếu thứ tự sai
                let temp = newArr[j];
                newArr[j] = newArr[j + 1];
                newArr[j + 1] = temp;
              }
            }
          }
          setProducts([...newArr, ...Array])
    },[])
    const handleClickMaxProduct = useCallback((products) => {
        const count = products.filter(item =>  item.Status === 'visible').length
        const Array = [...products]
        const newArr = Array.splice(0,count)
        for (let i = 0; i < newArr.length - 1; i++) {
            for (let j = 0; j < newArr.length - 1 - i; j++) {
              if (newArr[j].Price < newArr[j + 1].Price) {
                // Hoán đổi vị trí hai phần tử nếu thứ tự sai
                let temp = newArr[j];
                newArr[j] = newArr[j + 1];
                newArr[j + 1] = temp;
              }
            }
          }
          setProducts([...newArr, ...Array])
    },[])
    const handleChangeSearch = useCallback((e) => {
        setSearchValue(e)
        setLoadSearch(true)
    },[])
    const handlePageChange = useCallback((selectedItem) => {
        setPage(selectedItem.selected + 1)
      },[])
    const handleClickSendChat = useCallback((e) => {
        e.preventDefault()
       const check = valueChat.current.value.split('').some(char => char !== ' ')
       if(check) {
        const now = new Date()
        const time = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`
            const data = {
                IdReceiver: 1,
                time: time,
                containt: valueChat.current.value
            }
            socket.emit('chat',data,(response) => {
                if(response === 'Thanh cong') {
                    data.Status = 0
                    setMessage(prev => [...prev,data])
                    valueChat.current.value = ''
                    valueChat.current.focus()
                    socket.on('repchat',(status) => {
                        if(status === null) {
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
        
        // else {
        //     const data = {
        //         IdReceiver: 1,
        //         time: time,
        //         containt: valueChat.current.value
        //     }
        //     socket.emit('chat',data,(response) => {
        //         if(response === 'Thanh cong') {
        //             data.Status = 0
        //             setMessage(prev => [...prev,data])
        //             valueChat.current.value = ''
        //             valueChat.current.focus()
        //             socket.on('repchat',(status) => {
        //                 if(status === null) {
        //                     alert('Đã xảy ra lõi vui lòng thử lại')
        //                 }
        //                 else {
        //                     data.Status = status.Status
        //                     data.IdSend = status.IdSend
        //                     setMessage(prev => [...prev,data])
        //                     valueChat.current.value = ''
        //                     valueChat.current.focus()
        //                     socket.off('repchat')
        //                 }
        //             })
        //         }
        //         else {
        //             alert('Gửi lõi')
        //         }
        //     })
        // }
       }
    },[message,socket])
    const handleClickOpenChat = useCallback((socket) => {
        if(socket) {
            setChat(true)
        socket.emit('sendMessage',{IdSend:1},(response)=> {
            if(response.message === 'Thanh Cong') {
                setMessage(response.Data)
            }
        })
        }
        // if(cookies.get('AccessToken') !== undefined) {
        //     if(message.length === 0) {
        //         const Account = {
        //             IdSend: 1,
        //             token: cookies.get('AccessToken')
        //         }
        //         getChat(Account)
        //     }
        //     if(message.length > 0) {
            //     }
            //     setChat(true)
            // }

    },[])
    useEffect(() => {
        axios.all([
            axios.get('http://localhost:8080/api/v12/showproduct'),
            axios.get('http://localhost:8080/api/v12/showcategori'),
            axios.get('http://localhost:8080/api/v12/showtype'),
            axios.get('http://localhost:8080/api/v12/showmenu'),
            axios.get('http://localhost:8080/api/v12/showdetailtypes'),
            axios.get('http://localhost:8080/api/v12/showimgbody'),
          ])
            .then(axios.spread((Product, Categori,Types,Menu,detailType, imgBody, ) => { 
              setProducts(Product.data.data)
              setCategoris(Categori.data.data)
              setTypes(Types.data.data)
              setMenu(Menu.data.data)
              setDetailType(detailType.data.data)
              setBodyimg(imgBody.data.data)
              setYoutubeLink(`https://www.youtube.com/embed/${imgBody.data.data[3].Img}`)
            }))
            .catch (err => {
                console.error()
            })
            return () => {
                cancelAnimationFrame(animationRef.current)
            }
        },[])
     // Phân trang
     const productPage = useMemo(() => {
        const count = products.filter(item =>  item.Status === 'visible').length
         let trang = Math.ceil(count / 8)
         let from = (page - 1) * 8;
         let to = from + 7;
         let productPage = [];
        for (let i = from; i <= to; i++) {
            if (!products[i]) {
                break
            }
            productPage.push(products[i])
        }
        return [productPage,trang,page]
     },[page,products])
     useEffect(() => {
        if(!debounce.trim()) {
            const result = []
            products.map(product => 
               result.push({...product,Status: 'visible'})
            )
            setProducts(result)
            setLoadSearch(false)
            return
        }
        const result = []
        products.map(product => 
            product.Name.toLowerCase().includes(debounce.toLowerCase()) ? result.unshift({...product,Status: 'visible'}) : result.push({...product,Status: 'hidden'})
        )
        setProducts(result)
        setLoadSearch(false)
     },[debounce])
     useEffect(() => {
        if(socket !== null) {
            socket.on('chat',(data) => {
                const newArr = {    
                    IdSend: data.IdSend,
                    IdReceiver: data.IdReceiver,
                    time: data.time,
                    containt: data.containt
                }
                if(data !== null) {
                    const repMessage = {
                        IdSend: newArr.IdSend,
                        Status: chat ? 1 : 0
                    }
                    socket.emit('repchat',repMessage)
                    setMessage(prev => [...prev,newArr])
                }
            })
            socket.on('sendMessage',(data)=> {
                if(data !== null) {
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
     },[socket,chat,message])
        return (    
        <>
        {/* <div className='backround_header_body'></div> */}
            <div className={`header_body ${darkMode ? 'darkmode' : ''}`}>
                {/* <div className={'img_intro'}>
                    <News />
                </div> */}
                <img ref={gogiBackround} className={'menugogi_backround'} src={menugogi} alt=""/>
            </div>
            <div className={`backround_content ${darkMode ? 'darkmode' : ''}`}>
                 <div className={'grid wide app_content'}>
                   <div ref={titleHeaderBody} className={`header_app-content ${darkMode ? 'darkmode' : ''}`}>
                        <h3 ref={headerBodyContent}>Your Best Choice</h3>
                <div  className={'header_app-content-list-icon'}>
                    <div className={'header_app-content-item'}>
                        <div ref={(e) => itemHeaderBody.current[0] = e} className={'header_app-content_icon-list'}>
                            <img src={iconHeaderBody1} alt="" className={'headerAppContentIcon'} />
                        </div>
                        <div className={`header_app-content-item-slogan ${darkMode ? 'darkmode' : ''}`}>
                            <h2>CHUẨN VỊ NƯỚNG HÀNG</h2>
                        </div>
                    </div>
                    <div className={'header_app-content-item'}>
                         <div ref={(e) => itemHeaderBody.current[1] = e} className={'header_app-content_icon-list'}>
                            <img src={iconHeaderBody2} alt="" className={'headerAppContentIcon'} />
                        </div>
                        <div className={`header_app-content-item-slogan ${darkMode ? 'darkmode' : ''}`}>
                            <h2>THỰC ĐƠN ĐA DẠNG</h2>
                        </div>
                    </div>
                    <div className={'header_app-content-item'}>
                         <div ref={(e) => itemHeaderBody.current[2] = e} className={'header_app-content_icon-list'}>
                            <img src={iconHeaderBody3} alt="" className={'headerAppContentIcon'} />
                        </div>
                        <div className={`header_app-content-item-slogan ${darkMode ? 'darkmode' : ''}`}>
                            <h2>KHÔNG GIAN ẤM CÚNG</h2>
                        </div>
                    </div>
                    <div className={'header_app-content-item'}>
                         <div ref={(e) => itemHeaderBody.current[3] = e} className={'header_app-content_icon-list'}>
                            <img src={iconHeaderBody4} alt=""className={'headerAppContentIcon'} />
                        </div>
                        <div className={`header_app-content-item-slogan ${darkMode ? 'darkmode' : ''}`}>
                            <h2>PHỤC VỤ TẬN TÌNH</h2>
                        </div>
                    </div>

                </div>
                </div>
             {/* <!-- Contain Sp --> */}
                <div className={'app_content-product'}>
            {/* <!-- Category --> */}
                            <div className={'row sm-gutter app_content'}>
                                <nav className={`category ${darkMode ? 'darkmode' : ''}`}>
                                    <h3 className={`category_heading ${darkMode ? 'darkmode' : ''}`}>
                                      <FontAwesomeIcon className={'category_heading-icon'} icon={faListUl} />
                                        Danh mục Sản Phẩm
                                    </h3>
                                    <ul className={'category-list'}>
                                <Accordion>
                                    {menu.map((value,index)=>(
                                            <Accordion.Item style={{width: '100%',position:'relative'}} onClick={(e) => handleClickShowMenu(e,index)} key={index} eventKey={index}>
                                                <Accordion.Header style={{position: 'relative'}}  className={'category-item__link'}> <span style={{fontWeight: '500',zIndex: '10'}}>{value.Name} <span ref={e => iconMenuArrow.current[index] = e} className='arrow_menu'><FontAwesomeIcon icon={faArrowLeft} /></span></span> </Accordion.Header>
                                                    <Accordion.Body>
                                                        <ul key={index} className={'category-list-item'}>
                                                            <Accordion  key={value.Id}>
                                                            {types.map((valueType,indexType) => {
                                                                if(value.Id === valueType.IdMenu) {
                                                                    if(!valueType.Name.trim()) {
                                                                        return (
                                                                        <ul key={indexType} className={'category-list-item'}>
                                                                                {categoris.map((valueCate,IndexCate) => (
                                                                                    <li onClick={() => handleClickFilterCategori(valueCate.Id)} style={{fontWeight: '400'}} key={IndexCate}>{valueCate.Name}</li>
                                                                                ))}
                                                                            </ul>
                                                                        )
                                                                    }
                                                                    else {
                                                                   return (
                                                                                <Accordion.Item key={indexType} eventKey={indexType}>
                                                                                    <Accordion.Header className={'category-item__link'}><span style={{fontSize: '12px',fontWeight: '600'}} key={indexType}>{valueType.Name}</span></Accordion.Header>
                                                                                        <Accordion.Body>
                                                                                        <ul key={indexType} className={'category-list-item'}>
                                                                                                {detailType.map((valueDetailType,IndexDetailType) => (
                                                                                                    (valueType.Id === valueDetailType.IdType ? (                                                                                 
                                                                                                          <ul key={IndexDetailType} style={{fontSize: '10px'}} className={'category-list-item'}>
                                                                                                            {categoris.map((valuaCate,indexCate) => (
                                                                                                                (valuaCate.Id === valueDetailType.IdCategoris ? (
                                                                                                                        <li onClick={() => handleClickFilterProduct(valueDetailType.IdType,valuaCate.Id)} style={{fontWeight: '400'}} key={indexCate}>{valuaCate.Name}</li>
                                                                                                                ) : null )
                                                                                                                 ))}
                                                                                                           </ul>                                                                      
                                                                                                    ) : null)
                                                                                                ))}                                                                                                                                                        
                                                                                            </ul>
                                                                                        </Accordion.Body>
                                                                                </Accordion.Item>
                                                                            )          
                                                                        }                                                                 
                                                                    }else {
                                                                        return null
                                                                    }
                                                                  })}                                                                                                   
                                                                </Accordion>
                                                            </ul>
                                                                                
                                                        </Accordion.Body>
                                                </Accordion.Item>
                                                    ))}
                                            </Accordion>
                                            <li className={'category-item'}>     
                                                <h3 onClick={handleClickAll} className={'category-item__link'}>Tất cả</h3>
                                            </li>                            
                                        </ul>
                                </nav>
                            </div>
                        {/* <!-- product --> */}
                        <div id={IdProduct} className={'home-product'}>
                            <div className={`home-filter ${darkMode ? 'darkmode' : ''}`}>
                                <div className='home-filter-left'>
                                    <h3>Sản phẩm nổi bật</h3>
                                    <div className='home-filter_search'>
                                        <div className="group">
                                                <FontAwesomeIcon className='icon' icon={faMagnifyingGlass} />
                                                <input onChange={(e) => handleChangeSearch(e.target.value)} className="input" type="text" placeholder="Search"/>
                                                <FontAwesomeIcon className={loadSearch ? 'icon_loading open' : 'icon_loading'} icon={faSpinner} />
                                        </div>
                                        </div>
                                </div>
                                <div className='home-filter-right'>
                                    <div className='button-filter'>
                                        <button onClick={() => hanldeClickRanDom(products)}>Ngẫu nhiên</button>
                                    </div>
                                    <div className='button-filter'>
                                        <button onClick={() => handleClickNewProduct(products)}>Mới nhất</button>
                                    </div>
                                    <div className='button-filter'>
                                        <button onClick={() => handleClickMinProduct(products)}>Giá Thấp</button>
                                    </div>
                                    <div className='button-filter'>
                                        <button onClick={() => handleClickMaxProduct(products)}>Giá Cao</button>
                                    </div>
                                </div>
                                    <h3>
                                        {page}/{productPage[1]}
                                    </h3>
                                 </div>
                             <div className={`product_container ${darkMode ? 'darkmode' : ''}`}>
                                {productPage[0].map((product, index) => (
                                (product.Status === 'visible' ? (
                                <div key={index} className='product_content'>    
                                          <div style={{height: '320px',zIndex: '1'}} className={`card ${darkMode ? 'darkmode' : ''}`}>
                                                    {/* <div className='Lidoverlay_modal'>
                                                        <img ref={(e) => openLid.current[index] = e} className='Lidoverlay_modal-img' src={Lid} style={{width: '75%',height:'150px'}}/>
                                                    </div> */}
                                                    <div style={{zIndex:'1'}} className="image-container">
                                                        <img src={`http://localhost:8080/api/v12/showimgproduct/${product.Img}`} style={{width: '100%', height: '100%',objectFit: 'cover', zIndex: '100'}} />
                                                    </div>
                                                    <label className="favorite">
                                                        <input type="checkbox"/>
                                                        <FontAwesomeIcon className={'heart_product'} icon={faHeart} />
                                                    </label>
                                                        {/* Content */}
                                                    <div className="content">
                                                        <div className={`brand ${darkMode ? 'darkmode' : ''}`}>{product.Name}</div>
                                                        {/* giá */}
                                                        <div className="color-size-container">
                                                            <div className="colors">
                                                                {/* Color */}
                                                                <ul className="colors-container">
                                                                    <span style={{marginTop: '2px',padding: '0'}}>Giá</span>
                                                                        <span className='price_product' style={{fontSize: '16px'}}>{product.Price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫'}</span>
                                                                </ul>
                                                            </div>
                                                            {/* Size */}
                                                            <div className="sizes">
                                                                Size
                                                                <ul className="size-container">
                                                                    <li className="size">
                                                                        <label className="size-radio">
                                                                            <input type="radio"/>
                                                                            <span style={{fontSize: '10px'}} className="name">S</span>
                                                                        </label>
                                                                    </li>
                                                                    <li className="size">
                                                                        <label className="size-radio">
                                                                            <input type="radio"/>
                                                                            <span style={{fontSize: '10px'}} className="name">M</span>
                                                                        </label>
                                                                    </li>
                                                                    <li className="size">
                                                                        <label className="size-radio">
                                                                            <input  type="radio"/>
                                                                            <span style={{fontSize: '10px'}} className="name">L</span>
                                                                        </label>
                                                                    </li>                                                    
                                                                </ul>
                                                            </div>
                                                        </div>
                                                        {/* Sao */}
                                                        <div ref={e => startHtml.current[index] = e} className="rating">
                                                            <RenderStar Star={product.Star} />
                                
                                                            <span style={{fontSize: '12px'}}>đã bán {product.Sales}</span>
                                                        </div>
                                                    </div>
                                                    {(product.Visible === 1 ? (
                                                    <div ref = {e => indexCardProduct.current[index] = e} className="button-container">
                                                        <button onClick={() => handleClickDetailProduct(product.Id,product.Star,products)} className='detailproduct_button'>Xem chi tiết</button>
                                                        <button ref = {e => cardButton.current[index] = e} onClick={() => handleClickAddCard(index,product.Img,product.Id)} className="cart-button button">
                                                            <FontAwesomeIcon icon={faCartShopping} />
                                                        </button>
                                                    </div>
                                                    ) : <span>Hết món</span>)}
                                            </div>
                                            <div ref={el => buttonFakeAddCard.current[index] = el} className='button_container-fake'>
                                                <img src={`http://localhost:8080/api/v12/showimgproduct/${product.Img}`} style={{width: '100%', height: '100%',objectFit: 'cover', zIndex: '100'}} />
                                            </div>
                                </div>    
                                ) : null)
                                ))}
                        </div>
                        {/* <!-- Phân Trang --> */}
                        <ReactPaginate className='home-product_pagination'
                        pageCount={productPage[1]} // Tổng số trang
                        pageRangeDisplayed={3} // Số lượng trang hiển thị trên thanh phân trang
                        marginPagesDisplayed={1}
                        onPageChange={handlePageChange}// Số lượng trang trước và sau trang hiện tại // Hàm xử lý khi chuyển trang
                        activeClassName="active"
                        previousLabel={<FontAwesomeIcon style={{color:'#333'}} icon={faChevronLeft} />}
                        nextLabel={<FontAwesomeIcon style={{color:'#333'}} icon={faChevronRight} />}
                        />          
                        </div>  
                    </div>
                <div onClick={handleClickRemoveDetailProduct} ref={modalDetailProduct} className='modal_detailproduct'>                      
                            <div className='detailproduct_containet'>
                                    <div ref={cardDetailProduct} onClick={e => e.stopPropagation()} style={{height: '500px', width: '25%'}} className="card card_detailproduct">
                                    <div style={{height: '45%',borderTopRightRadius: '10rem'}} className="image-container">
                                    <img className='ImgProductDetail' src={`http://localhost:8080/api/v12/showimgproduct/${productDetail.Img}`} style={{width: '100%', height: '100%',objectFit: 'cover', zIndex: '100'}} />
                                    </div>
                                    <label className="favorite">
                                        <input type="checkbox"/>
                                        <FontAwesomeIcon className={'heart_product'} icon={faHeart} style={{fontSize: '25px'}} />
                                    </label>
                                    <div className="content">
                                        <div style={{fontSize: '20px', height: '70px'}} className="brand">{productDetail.Name}</div>
                                        <div style={{marginBottom: '40px'}} className="color-size-container">
                                            <div className="colors">
                                                <ul className="colors-container">
                                                    <span style={{marginTop: '2px',padding: '0',fontSize: '18px'}}>Giá</span>
                                                            <span className='price_product' style={{fontSize: '10px'}}>{productDetail.Price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫'}</span>
                                                </ul>
                                            </div>
                                            <div className="sizes">
                                                Size
                                                <ul className="size-container">
                                                    <li className="size">
                                                        <label className="size-radio">
                                                            <input type="radio"/>
                                                            <span style={{fontSize: '16px'}} className="name">S</span>
                                                        </label>
                                                    </li>
                                                    <li className="size">
                                                        <label className="size-radio">
                                                            <input type="radio"/>
                                                            <span style={{fontSize: '16px'}} className="name">M</span>
                                                        </label>
                                                    </li>
                                                    <li className="size">
                                                        <label className="size-radio">
                                                            <input  type="radio"/>
                                                            <span style={{fontSize: '16px'}} className="name">L</span>
                                                        </label>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="rating_detail">
                                        <RenderStar Star={productDetail.Star} />                                                                            
                                                    <span className='rating_detail-sales' style={{fontSize: '12px'}}>đã bán {productDetail.Sales}</span>
                                                </div>
                                    <div className="button-container_detail">        
                                        <div className='button_showcomment'>
                                            <div className="buttons">
                                            <button onClick={() => handleClickShowComment(productDetail.Id)} className="btn"><span></span><p  datatext="start!" datatitle="Xem Đánh Giá"></p></button>
                                            </div>
                                        </div>
                                        <button onClick={() => handleClickAddCard(null,productDetail.Img,productDetail.Id)} style={{height: '50px',width: '25%',borderRadius: ' 3.4rem 3.4rem 2.7rem 2.7rem' }} className="cart-button_detail button">
                                            <FontAwesomeIcon icon={faCartShopping} />
                                        </button>
                                    </div>
                                        </div>
                                        <div ref={commentShow} className='comment_show-content'>
                                                <h2 className='header_showcomment'>Đánh Giá Sản Phẩm</h2>
                                            <div className='comment_show-content_container'>
                                                <div className='navbar_showcomment'>
                                                    <div className='navbar_showcomment-start'>
                                                            <h1 ref={allStar}></h1>
                                                        <div className='start-item'>
                                                    <div className="rating_detail-comment">
                                                        <RenderStar Star={productDetail.Star} />                                                                            
                                                    </div>
                                                        </div>
                                                    </div>
                                                    <ul className='navbar_showcomment-item'>
                                                        <li>Tất Cả</li>
                                                        <li>5 Sao</li>
                                                        <li>4 Sao</li>
                                                        <li>3 Sao</li>
                                                        <li>2 Sao</li>
                                                        <li>1 Sao</li>
                                                    </ul>
                                                </div>
                                                <div className='content_showcomment'>
                                                {(cmtContent !== null ? (
                                                    (cmtContent.map((cmt,index) => (
                                                    <div key={index} className='content_showcomment-item'>
                                                        <div className='content_showcomment-info'>
                                                            <div className='content_showcomment-item-img'>
                                                            <img style={{width: '100%',height: '100%',borderRadius: '50%',objectFit: 'cover', zIndex: '100'}} src={cmt.Classify === 'user' ? `http://localhost:8080/api/v12/avtuser/${cmt.Avt}`: `${cmt.Avt}` }/>
                                                            </div>
                                                            <div className='content_showcomment-user'>
                                                                <div className='content_showcomment-item-name'>
                                                                    <h2 style={{margin: '0',fontSize:'12px'}}>{cmt.UserName}</h2>
                                                                </div>
                                                                <div className='content_showcomment-item-start'>
                                                                <RenderStar Star={cmt.Star}/>
                                                                </div>
                                                                <div className='content_showcomment-item-date'>
                                                                        <span>2024-04-01 10:59 </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className='content_showcomment-item_comment'>
                                                            <p style={{opacity: '1',marginBottom:'0'}}>{cmt.Containt}</p>
                                                            {cmt.RepComment.length === 0 ? (null) : (
                                                                <div className='content_showcomment-item_comment_repcomment'><span style={{color:'#000'}}>Từ người bán: </span>{cmt.RepComment}</div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    )))
                                                ) : (
                                                    <div className='no_comment'>
                                                        <h1>Chưa có đánh giá</h1>
                                                    </div>
                                                ))}
                                                </div>
                                            </div>
                                        </div>
                            </div>
                        </div>
                    {/* <!--  --> */}
                </div>
                <div className={`backround_youtube ${darkMode ? 'darkmode' : ''}`}>
                    <div className={'youtube_container'}>
                        <div ref={(e) => youtubeRef.current[0] = e} style={{transform: 'translateX(-114px)',transition: 'transform .5s ease-in-out,opacity .5s ease-in-out',opacity:'0'}} className={'youtube_content'}>
                            <iframe width="640" height="360" src={(bodyimg.length !== 0 ? (youtubelink) : (null))} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                        </div>
                        <div className={'youtube_img'}>
                            <div ref={(e) => youtubeRef.current[1] = e} className={'youtube_img-item'}>
                                <img style={{filter: 'brightness(80%)'}} src={(bodyimg.length !== 0 ? (`http://localhost:8080/api/v12/bodyimg/${bodyimg[0].Img}`) : (null))}/>
                                <div className={'overflow'}>
                                    <h1>Đại Tiệc Nướng Lẩu Hàn Quốc</h1>
                                </div>
                            </div>
                            <div  ref={(e) => youtubeRef.current[2] = e}  className={'youtube_img-item-f'}>
                                <img className={'youtube_img-item-img'} src={(bodyimg.length !== 0 ? (`http://localhost:8080/api/v12/bodyimg/${bodyimg[1].Img}`) : (null))} />
                                <img className={'youtube_img-item-img'} src={(bodyimg.length !== 0 ? (`http://localhost:8080/api/v12/bodyimg/${bodyimg[2].Img}`) : (null))} />
                            </div>
                        </div>
                    </div>

                </div>
                {/* Nhan Sự */}
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
                <div className={'backround_tintuc'}>
                    <div className={'tintuc grid wide'}>
                        <div className={'header_tintuc'}>                        
                            <h3 className={'blog'}>Blog</h3>
                            <h1 className={'title'}>TIN TỨC</h1>
                        </div>
                        <div className={'body_tintuc'}>
                            <div className={'body_tintuc-img'}>
                                <div className={'body_tintuc-img-new-icon'}>
                                    <span style={{color: '#fff', textAlign: 'center',fontStyle: 'italic', fontSize: '17px'}}>NEW</span>
                                </div>
                                <div className={'body_tintuc-img-item'}>
                                        <PageNew />
                                </div>
                            </div>
                            <div className={'body_tintuc-container'}>
                                <h2 className={'body_tintuc-container-tips'}>TIPS ẨM THỰC</h2>
                                <h1 className={'body_tintuc-container-header'}>[MN] KING BBQ BUFFET 179K – DUY NHẤT TẠI 11 TỈNH MIỀN NAM</h1>
                                <h3 className={'body_tintuc-container-time'}>18 MARCH</h3>
                                <p className={'body_tintuc-container-contain'}>🔥 Chào các đồng nướng! Tất cả mọi người đã sẵn sàng cho một cơn sốt ẩm thực tại King BBQ  chưa nào? MENU BUFFET MỚI – CHỈ 179.000 VNĐ Tặng thêm 01 phần lẩu Tokbokki cực “HOT” Buffet 179k tại King BBQ cũng là một lựa chọn tuyệt vời cho mọi dịp họp mặt, […]</p>
                                <a href="" className={'body_tintuc-container-button'}>READ MORE</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
                <div datacount={Amount} ref={cartProduct} onClick={cookies.get('AccessToken') !== undefined ? () => navigate('/card') : () => navigate('/loginuser') } className='cart_product-container'>
                    <FontAwesomeIcon className='cart_product-icon' icon={faBagShopping} />
                    <img ref={imgAddCard} className='Img_AddCard'/>
                </div>
                <div onClick={() => handleClickOpenChat(socket)} style={chat ? {opacity:'0'} : {opacity:'1',transition:'opacity 1s .2s ease-in-out'}} className='chat_container'>
                    <span>Chat</span>
                    <FontAwesomeIcon icon={faRocketchat} />
                </div>
                <div style={chat ? {opacity:'1',transform:'scale(1)'} : {opacity:'0',transform:'scale(0)'}} className='massage_content'>
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
                                <ul key={index} style={index === message.length - 1 ? {marginBottom:'8px'} : null} className={ms.IdReceiver !== 1 ? "message-list-rep" : "message-list-user"}>
                                    <li>
                                        {index === 0 ? (
                                            <FontAwesomeIcon className={ms.IdReceiver !== 1 ? 'massage_list-icon' : 'massage_list-icon-user'} icon={faCaretDown} />
                                        ) : (
                                            message[index - 1].IdSend !== ms.IdSend ? <FontAwesomeIcon className={ms.IdReceiver !== 1 ? 'massage_list-icon' : 'massage_list-icon-user'} icon={faCaretDown} /> : null
                                        )}
                                        <p>{ms.containt}<span className='massage_list-time'>{ms.time}</span></p>
                                    </li>
                                </ul>
                                {(index === message.length - 1 && ms.IdSend !== 1)  ? (
                                    <div className='massage_content_body-content_status'>{ms.Status === 1 ? (<span><FontAwesomeIcon style={{marginBottom:'1px'}} icon={faCheckDouble} />Đã Xem</span>) : (<span><FontAwesomeIcon style={{marginBottom:'1px'}} icon={faCheckDouble} />Đã Nhận</span>)}</div>
                                ) : null}
                            </div>

                            ))}
                        </div>
                    </div>
                    <form onSubmit={(e) => handleClickSendChat(e)} className="chat-input">
                        <input ref={valueChat} type="text" className="message-input" spellCheck={false} placeholder="Type your message here"/>
                        <button type='submit' className="send-button">Send</button>
                    </form>
                    </div>
                </div>
        </>
     );
}
export default memo(Body);