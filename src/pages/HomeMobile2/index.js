import ReactPaginate from 'react-paginate';
import { useEffect, useState,useMemo, useRef, useCallback } from "react";
import { MobileContext } from '../../components/Layout/MobileLayout'
import * as Icon from 'react-feather';
import axios from 'axios'
import Hihi from "~/Asset/Vidoe/gogi.mp4"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSliders,faHouse,faHeart,faBasketShopping,faBell,faStar,faPlus, faClipboard,faAnglesRight, } from '@fortawesome/free-solid-svg-icons';
import { Link, useParams, useSearchParams,useNavigate, json   } from 'react-router-dom';
import Avt from "../../Asset/images/avt.jpg"
import classNames from "classnames/bind"
import styles from './HomeMobile.module.scss'
const cx = classNames.bind(styles)

function AppMobile() {
    const [products, setProducts] = useState([])
    const [categoris, setCategoris] = useState([])
    const [page, setPage] = useState(1)
    const videoRef = useRef()
    const bntvideoRef = useRef()
    const cateAllRef = useRef()
    const cardButton = useRef([])
    const cartProduct = useRef([])
    const buttonFakeAddCard = useRef([])
    const handlePageChange = (selectedItem) => {
        setPage(selectedItem.selected + 1)
      };
      const handleClickAddCard =  useCallback(async(button,Id) => {
        if(button !== null) {
        buttonFakeAddCard.current[button].style.display = 'block'
        let x = 0
        let y = 0
        const speed = 0.4;
        let lastTime = 0;
        const animateAddcard = (timestamp) => {
            if (!lastTime) lastTime = timestamp;
            const deltaTime = timestamp - lastTime;
            lastTime = timestamp;
            const indexCard = cartProduct.current[2].getBoundingClientRect()
            const icardProduct = cardButton.current[button].getBoundingClientRect()
            const xTo = indexCard.left -  icardProduct.left
            const yTo = indexCard.top - icardProduct.top
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
                requestAnimationFrame(animateAddcard);
            }else {
                buttonFakeAddCard.current[button].style.display = 'none'
            }
        };
        requestAnimationFrame(animateAddcard)
}

    },[])
    useEffect(() => {
        axios.all([
            axios.get('http://localhost:8080/api/v12/showproduct'),
            axios.get('http://localhost:8080/api/v12/showcategori'),
          ])
            .then(axios.spread((Product, Categori, ) => { 
              setProducts(Product.data.data)
              setCategoris(Categori.data.data)
            }))
            .catch (err => {
                console.error()
            })
            // bntvideoRef.current.click()
        },[])
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
    return ( 
        <div className={cx('Layout_mobile')}>
        <div className={cx('layout_gid')}>
            <header>
                <div className={cx('header_content')}>
                    <span>Location</span>
                    <h2>Trần Hoàng Mỹ</h2>
                </div>
                <div className={cx('header_img')}>
                        <img style={{width: '30px', height: '30px',borderRadius: '6px',objectFit: 'cover'}} src={Avt}/>
                </div>
            </header>
            <div className={cx('header_search')}>
                <div className={cx('icon-search')}>
                    <Icon.Search style={{width: '15%',marginRight: '4px'}} />
                    <input placeholder='Tìm kiếm sản phẩm' />
                </div>
                <div className={cx('header_search-listIcon')}>
                    <FontAwesomeIcon style={{fontSize:'20px'}} icon={faSliders} />
                </div>
            </div>
        </div>
        <div className={cx('slider')}>
            {/* <Slider children={SliderImg} /> */}
            <video ref={videoRef} className={cx('video_mobile')} style={{width:'100%',height:'100%',pointerEvents:'none'}} muted autoPlay loop>
                <source src={'http://localhost:8080/api/v12/video/gogi.mp4'} type="video/mp4" />
                <source src="/video.webm" type="video/webm" />
                Trình duyệt của bạn không hỗ trợ thẻ video.
            </video>
            {/* <button ref={bntvideoRef} onClick={() => videoRef.current.play()}>text</button>  */}
        </div>
            <div className={cx('mobile_content')}>
                    <div className={cx('navbar_content')}>
                    <span ref={cateAllRef}  style={{fontWeight: '400'}} className={cx('ActiveCate')}>Tất Cả</span>
                    {categoris.map((valuaCate,indexCate) => (
                        <span style={{fontWeight: '400'}} key={indexCate}>{valuaCate.Name}</span>
                    ))}                                                                                                                                                                                 
                    </div>
                <div className={cx('product_container_mobile')}>
                {productPage[0].map((product,index) => (
                    <div key={index} className={cx('product_content_mobile')}>
                        <Link to={`/mobile/detail/${product.Id}`}>
                        <div className={cx('product_content_mobile-img')}>
                            <span className={cx('product_content_mobile-star')}>
                                 <FontAwesomeIcon style={{color: 'rgb(255, 204, 0)'}} icon={faStar} />
                                 <span style={{fontWeight:'700',color:'#333'}}>{product.Star}</span>
                            </span>
                            <div className={cx('product_content_mobile-img-item')}>
                                 <img src={`http://localhost:8080/api/v12/showimgproduct/${product.Img}`} style={{width: '100%', height: '100%',objectFit: 'cover', zIndex: '100'}} />
                            </div>
                        </div>
                        </Link>
                        <div className={cx('product_noti')}>
                            <div className={cx('product_name')}>
                                <h2>{product.Name}</h2>
                            </div>
                            <div className={cx('product_size')}>
                                <h2>size lớn</h2>
                            </div>
                            <div className={cx('product_price')}>
                                {
                                (JSON.parse(localStorage.getItem('Table')) && JSON.parse(localStorage.getItem('Table')).Buffe !== 'All') ? (
                                    <h2>00.000đ</h2>
                                ) : (
                                    <h2>{product.Price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫'}</h2>
                                )
                                }
                                <button ref = {e => cardButton.current[index] = e} onClick={() => handleClickAddCard(index,product.Id)} className={cx('button_addcard')}><FontAwesomeIcon icon={faPlus} />
                                </button>
                                <div ref={el => buttonFakeAddCard.current[index] = el} className={cx('button_img-fake')}>
                                    <img src={`http://localhost:8080/api/v12/showimgproduct/${product.Img}`} style={{width: '100%', height: '100%',objectFit: 'cover', zIndex: '100'}} />
                                </div>
                            </div>
                        </div>
                    </div>

                ))}
                    {/*  */}
                    
                    {/*  */}
                </div>
                <ReactPaginate className={cx('product_page')}
                pageCount={productPage[1]} // Tổng số trang
                pageRangeDisplayed={productPage[2]} // Số lượng trang hiển thị trên thanh phân trang
                marginPagesDisplayed={productPage[3]}
                onPageChange={handlePageChange}// Số lượng trang trước và sau trang hiện tại // Hàm xử lý khi chuyển trang
                activeClassName={cx('active')}
                previousLabel={false} // Bỏ nút "Previous"
                nextLabel={false} // Bỏ nút "Next" // Lớp CSS cho trang hiện tại
                />
            </div>
            <div className={cx('navbar_footer')}>
                <div className={cx('navbar_footer-content')}>
                    <Link datacount = {0} ref={e => cartProduct.current[0] = e} to='/' className={cx('Active')}>
                            <FontAwesomeIcon icon={faHouse} />
                    </Link>
                    <div datacount = {0} ref={e => cartProduct.current[1] = e}>
                        <FontAwesomeIcon icon={faBell} />
                    </div>
                    <Link to='mobile/card' ref={e => cartProduct.current[2] = e}>
                        <FontAwesomeIcon icon={faBasketShopping} /> 
                    </Link>
                    <Link to='mobile/billorder' datacount = {0} ref={e => cartProduct.current[3] = e}>
                        <FontAwesomeIcon icon={faClipboard} />
                    </Link>
                </div>
            </div>
    </div>
     );
}

export default AppMobile;