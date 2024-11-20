import ReactPaginate from 'react-paginate';
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import { useEffect, useState,useMemo, useRef, useContext } from "react";
import { MobileContext } from '../../components/Layout/MobileLayout'
import { Cookies } from 'react-cookie';
import * as Icon from 'react-feather';
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSliders,faHouse,faHeart,faBasketShopping,faBell,faStar,faPlus, faClipboard,faAnglesRight, } from '@fortawesome/free-solid-svg-icons';
import { Link, useParams, useSearchParams,useNavigate, json   } from 'react-router-dom';
import Slider from "./Slider/index"
import SliderImg from "../../Asset/images/102557336_3097466270292175_2765808264509443624_n.jpg"
// scss
import './HomeMobile.scss'

function App() {
    const cookies = new Cookies
    // Parem
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    // State
    const [products, setProducts] = useState([])
    const [categoris, setCategoris] = useState([])
    const [productsBackup, setProductsBackup] = useState([])
    const [cardProduct, setCardProduct] = useState([])
    const [page, setPage] = useState(1)
    const [checkActiveCate, setCheckActiveCate] = useState(0)
    const [amountCard, setAmountCard] = useState(0)
    // context
    const cateRef = useRef([])
    const cateAllRef = useRef()
    const cardButton = useRef([])
    const cartProduct = useRef([])
    const buttonFakeAddCard = useRef([])
    // 
    const { timeoutIdRef } = useContext(MobileContext)
    // Param
    const { IdType } = useParams()
    // Call Api
  // Gửi dữ liệu lên API
  async function fillterpProductCate(IdCate) {
    setCheckActiveCate(IdCate)
    try {
        const response = await axios.post(`${process.env.REACT_APP_IP_SEVER}/api/v12/filterproductcate`, {IdCate:IdCate,token:cookies.get('AccessTokenOrder')});
       if(response.data.massege === 'Thanh cong') {
            setProducts(response.data.data)
       }
    } catch (error) {   
        console.error('Lỗi khi thêm sản phẩm:', error);
        // Xử lý lỗi tại đây.
    }
    }
      // Gửi dữ liệu lên API
  async function addDetailProduct(detailproduct) {  
    try {
    const response =  await axios.post('http://localhost:8080/api/v12/createdetailproduct', detailproduct);
    if(response.data.massege === 'Thanh cong') {
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Your work has been saved",
        showConfirmButton: false,
        timer: 1500
      });
    }
    } catch (error) {
      alert('Có lõi xảy ra vui lòng thử lại')
    }
  }
    const handlePageChange = (selectedItem) => {
        setPage(selectedItem.selected + 1)
      };
      const handleClickAddCard = async (i,IdProduct) => {
        if(i !== null) {
        const indexCard = cartProduct.current[2].getBoundingClientRect()
        const icardProduct = cardButton.current[i].getBoundingClientRect()
        const xTo = indexCard.left -  icardProduct.left
        const yTo = indexCard.top - icardProduct.top
      const keyframes = [
        { transform: 'translate(0px, 0px)' ,
        opacity: '1'   
        },
        { transform: `translate(${xTo.toFixed(0)}px, ${yTo.toFixed(0)}px)`,
        opacity: '.5'   
        }
      ]
      const options = {
        duration: 2000,
        iterations: 1
      };
      for (let key in timeoutIdRef.current) {
        if(i === parseInt(key)) {
            return
        }
      }
      buttonFakeAddCard.current[i].animate(keyframes, options)
      buttonFakeAddCard.current[i].classList.add('open')
      timeoutIdRef.current[i] = setTimeout(() => {
            if(i !== null) {
                buttonFakeAddCard.current[i].classList.remove('open')       
                delete timeoutIdRef.current[i]
            }
   }, 2000);
   const newArr = JSON.parse(localStorage.getItem('card')) || []
   for(let i = 0 ; i < products.length; i++) {
        if(products[i].Id === IdProduct) {
            if(newArr.length === 0) {
                newArr.push(products[i])
                localStorage.setItem('card', JSON.stringify(newArr))
                setAmountCard(prev => prev + 1)
            }
            else {
                const carNew = newArr.filter((productsCard) => productsCard.Id !== IdProduct)
                carNew.push(products[i])
                localStorage.setItem('card', JSON.stringify(carNew))
                setAmountCard(prev => prev + 1)
                }
                }
                }
                }  
     }
    const handleClickAllproducts = async () => {
        setCheckActiveCate(0)
        try {
            const response = await axios.get(`${process.env.REACT_APP_IP_SEVER}/api/v12/getproductorder?token=${cookies.get('AccessTokenOrder')}`);
           if(response.data.massege === 'Thanh cong') {
                setProducts(response.data.data)
           }
        } catch (error) {   
            console.error('Lỗi khi thêm sản phẩm:', error);
        }
    }
    useEffect(() => {
            if(cookies.get('AccessTokenOrder') !== undefined) {
                axios.all([
                    axios.get(`${process.env.REACT_APP_IP_SEVER}/api/v12/getproductorder?token=${cookies.get('AccessTokenOrder')}`),
                    axios.get(`${process.env.REACT_APP_IP_SEVER}/api/v12/getcateorder?token=${cookies.get('AccessTokenOrder')}`),
                    ])
                    .then(axios.spread((Product,Categoris) => {
                        setProducts(Product.data.data)
                        setCategoris(Categoris.data.data)
                    }))
                    .catch (err => {
                        console.error()
                    })
            }
        },[])
    //     cateAllRef.current.classList.add('active')
    //     if(IdType && IdType !== 'All') {
    //         const table = searchParams.get('table')
    //         const Id = {
    //             IdType: IdType
    //         }
    //         const Table = {
    //             Status: 'Đang Dùng',
    //             Id: parseInt(table)
    //         }
    //         const User = {
    //             Buffe: IdType,
    //             Table: parseInt(table)
    //         }
    //         updateTable(Table)
    //         localStorage.setItem('Table',JSON.stringify(User))
    //         axios.all([
    //             axios.get(`${process.env.REACT_APP_IP_SEVER}/api/v12/showproduct`),
    //             axios.post(`${process.env.REACT_APP_IP_SEVER}/api/v12/showproducttypes`,Id),
    //             axios.get(`${process.env.REACT_APP_IP_SEVER}/api/v12/showcategori`),
    //           ])
    //             .then(axios.spread((Product, ProductType, Categori) => {
    //               setCategoris(Categori.data.data)
    //               const newProduct = []
    //               for(let i = 0; i < ProductType.data.data.length; i++) {
    //                   for(let j = 0; j < Product.data.data.length;j++) {
    //                       if(ProductType.data.data[i].IdProduct === Product.data.data[j].Id) {
    //                           newProduct.push(Product.data.data[j])
    //                       }
    //                     }
    //                 }
    //               setProducts(newProduct)
    //               setProductsBackup(newProduct)
    //             }))
    //             .catch (err => {
    //                 console.error()
    //             })
    //         }
    //         else if(IdType && IdType === 'All') {
    //             const table = searchParams.get('table')
    //             const Table = {
    //                 Status: 'Đang Dùng',
    //                 Id: parseInt(table)
    //             }
    //             const User = {
    //                 Buffe: IdType,
    //                 Table: parseInt(table)
    //             }
    //             updateTable(Table)
    //             localStorage.setItem('Table',JSON.stringify(User))
    //             axios.all([
    //                 axios.get(`${process.env.REACT_APP_IP_SEVER}/api/v12/showproduct`),
    //                 axios.get(`${process.env.REACT_APP_IP_SEVER}/api/v12/showcategori`),
    //               ])
    //                 .then(axios.spread((Product, Categori) => {
    //                   setCategoris(Categori.data.data)
    //                   setProducts(Product.data.data)
    //                   setProductsBackup(Product.data.data)
    //                 }))
    //                 .catch (err => {
    //                     console.error()
    //                 })
    //         }
    //         else {
    //             if(JSON.parse(localStorage.getItem('card')) !== null) {
    //                 setCardProduct(JSON.parse(localStorage.getItem('card')).card)
    //                 setAmountCard(JSON.parse(localStorage.getItem('card')).length)
    //             }
    //             else {
    //                 setCardProduct([])
    //                 setAmountCard(0)
    //             }
    //             if(localStorage.getItem('Table')) {
    //                 navigate(`/mobile/buffe/${JSON.parse(localStorage.getItem('Table')).Buffe}?table=${JSON.parse(localStorage.getItem('Table')).Table}`);
    //             }
    //             axios.all([
    //                 axios.get(`${process.env.REACT_APP_IP_SEVER}/api/v12/showproduct`),
    //                 axios.get(`${process.env.REACT_APP_IP_SEVER}/api/v12/showcategori`),
    //               ])
    //                 .then(axios.spread((Product, Categori) => {
    //                   setProducts(Product.data.data)
    //                   setProductsBackup(Product.data.data)
    //                   setCategoris(Categori.data.data)
    //                 }))
    //                 .catch (err => {
    //                     console.error()
    //                 })
    //         }
    //         return () => {
    //             for(let key in timeoutIdRef.current) {
    //                 clearTimeout(timeoutIdRef.current[key]);
    //                 delete timeoutIdRef.current[key]
    //             }
    //           }
    //     },[IdType])

    // useEffect(() => {
    //     for(let i = 0; i < cartProduct.current.length; i++) {
    //         if(cartProduct.current[i].getAttribute('datacount') !== '0') {
    //             cartProduct.current[i].classList.add('open')
    //         }
    //         else {
    //             cartProduct.current[i].classList.remove('open')
    //         }
    //     }
    // },[amountCard])
      // Phân trang
      const productPage = useMemo(() => {
        const count = products.filter(item => typeof item === 'object').length
        let trang = Math.ceil(count / 6)
        let from = (page - 1) * 6;
        let to = from + 5;
        let productPage = [];
        const pageRangeDisplayed = 3; // Số lượng trang hiển thị trên thanh phân trang
        const marginPagesDisplayed = 1; // Số lượng trang trước và sau trang hiện tại
       for (let i = from; i <= to; i++) {
           if (!products[i]) {
               break
           }
           productPage.push(products[i])
       }
       return [productPage,trang,pageRangeDisplayed,marginPagesDisplayed]
    },[products,page])
    const Amount = useMemo(() => {
        let sl = 0
        if(JSON.parse(localStorage.getItem('card') !== null)) {
             sl = JSON.parse(localStorage.getItem('card')).length
        }
        return sl
    },[amountCard])
    return ( 
        <>
            <div className="Layout_mobile">
                <div className="layout_gid">
                    <header>
                        <div className="header_content">
                            <span>Location</span>
                            <h2>Khách hàng</h2>
                        </div>
                    </header>
                    <div className="header_search">
                        <div className='icon-search'>
                            <Icon.Search style={{width: '15%',marginRight: '4px'}} />
                            <input placeholder='Tìm kiếm sản phẩm' />
                        </div>
                        <div className='header_search-listIcon'>
                            <FontAwesomeIcon style={{fontSize:'20px'}} icon={faSliders} />
                        </div>
                    </div>
                </div>
                <div className='slider'>
                    <Slider children={SliderImg} />
                </div>
                    <div className="mobile_content">
                            <div className='navbar_content'>
                            <span onClick={() => handleClickAllproducts()} className={checkActiveCate === 0 ? 'active' : null}>Tất Cả</span>
                                {categoris.map((valuaCate,indexCate) => (
                                            <span className={checkActiveCate === valuaCate.Id ? 'active' : null} onClick={() => fillterpProductCate(valuaCate.Id)} key={indexCate}>{valuaCate.Name}</span>
                                        ))}                                                                                                                                                                                                                                              
                            </div>
                        <div className='product_container_mobile'>
                        {productPage[0].map((product,index) => (
                            <div key={index} className='product_content_mobile'>
                                <Link to={`/order/detail/${product.Id}`}>
                                <div className='product_content_mobile-img'>
                                    <span className='product_content_mobile-star'>
                                         <FontAwesomeIcon style={{color: 'rgb(255, 204, 0)'}} icon={faStar} />
                                         <span style={{fontWeight:'700',color:'#333'}}>{product.Star}</span>
                                    </span>
                                    <div className='product_content_mobile-img-item'>
                                        <img src={`${process.env.REACT_APP_IP_SEVER}/api/v12/showimgproduct/${product.Img}`} style={{width: '100%', height: '100%',objectFit: 'cover'}} />
                                    </div>
                                </div>
                                </Link>
                                <div className='product_noti'>
                                    <div className='product_name'>
                                        <h2>{product.Name}</h2>
                                    </div>
                                    <div className='product_size'>
                                        <h2>size lớn</h2>
                                    </div>
                                    <div className='product_price'>
                                        {
                                        (JSON.parse(localStorage.getItem('Table')) && JSON.parse(localStorage.getItem('Table')).Buffe !== 'All') ? (
                                            <h2>00.000đ</h2>
                                        ) : (
                                            <h2>{product.Price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫'}</h2>
                                        )
                                        }
                                        <button ref = {e => cardButton.current[index] = e} onClick={() => handleClickAddCard(index,product.Id)} className='button_addcard'><FontAwesomeIcon icon={faPlus} />
                                        </button>
                                        <div ref={el => buttonFakeAddCard.current[index] = el} className='button_img-fake'>
                                                <img src={`${process.env.REACT_APP_IP_SEVER}/api/v12/showimgproduct/${product.Img}`} style={{width: '100%', height: '100%',objectFit: 'cover'}} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                        ))}
                            {/*  */}
                            
                            {/*  */}
                        </div>
                        <ReactPaginate className='product_page'
                        pageCount={productPage[1]} // Tổng số trang
                        pageRangeDisplayed={productPage[2]} // Số lượng trang hiển thị trên thanh phân trang
                        marginPagesDisplayed={productPage[3]}
                        onPageChange={handlePageChange}// Số lượng trang trước và sau trang hiện tại // Hàm xử lý khi chuyển trang
                        activeClassName="active"
                        previousLabel={false} // Bỏ nút "Previous"
                        nextLabel={false} // Bỏ nút "Next" // Lớp CSS cho trang hiện tại
                        />
                    </div>
                    <div className='navbar_footer'>
                        <div className='navbar_footer-content'>
                            <Link datacount = {0} ref={e => cartProduct.current[0] = e} to='/' className='navbar_footer-content-icon active'>
                                    <FontAwesomeIcon icon={faHouse} />
                            </Link>
                            <div datacount = {0} ref={e => cartProduct.current[1] = e} className='navbar_footer-content-icon'>
                                <FontAwesomeIcon icon={faBell} />
                            </div>
                            <Link to={`/order/card?token=${cookies.get('AccessTokenOrder')}`} datacount = {Amount} ref={e => cartProduct.current[2] = e} className='navbar_footer-content-icon cardmobile'>
                                <FontAwesomeIcon icon={faBasketShopping} /> 
                            </Link>
                            <Link to={`/order/billorder?token=${cookies.get('AccessTokenOrder')}`} datacount = {0} ref={e => cartProduct.current[3] = e} className='navbar_footer-content-icon'>
                                <FontAwesomeIcon icon={faClipboard} />
                            </Link>
                        </div>
                    </div>
            </div>
        </>
     );
}

export default App;