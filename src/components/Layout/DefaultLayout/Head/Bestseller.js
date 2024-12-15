

import Hihi from "~/Asset/Vidoe/gogi.mp4"
import { useContext } from "react"
import { IdElementContext } from '../IdElementContext'
import { faHeart,faCartShopping } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { RenderStar } from '~/hooks'
function Betseller({cx, products}) {
    const {modalVideoBest, videoBest, listProductBest, imgBestSeller, indexSlide } = useContext(IdElementContext)
    return ( 
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
                    <img ref={e => imgBestSeller.current[0] = e} className={cx('image_animate_best')} src={`https://severgogi.onrender.com/api/v12/showimgproduct/${(products.length !== 0 ? (products[indexSlide[5]].Img) : (null))}`} style={{width: '100%', height: '100%',objectFit: 'cover'}} />
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
                     <img ref={e => imgBestSeller.current[1] = e} className={cx('image_animate_best')} src={`https://severgogi.onrender.com/api/v12/showimgproduct/${(products.length !== 0 ? (products[indexSlide[1]].Img) : (null))}`} style={{width: '100%', height: '100%',objectFit: 'cover'}} />
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
                    <img  className={cx('image_animate_best')} ref={e => listProductBest.current[0] = e} src={`https://severgogi.onrender.com/api/v12/showimgproduct/${(products.length !== 0 ? (products[indexSlide[2]].Img) : (null))}`} style={{width: '100%', height: '100%',objectFit: 'cover'}} />
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
                        <img  className={cx('image_animate_best')} ref={e => listProductBest.current[1] = e} src={`https://severgogi.onrender.com/api/v12/showimgproduct/${(products.length !== 0 ? (products[indexSlide[3]].Img) : (null))}`} style={{width: '100%', height: '100%',objectFit: 'cover'}} />
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
                    <img className={cx('image_animate_best')} ref={e => listProductBest.current[2] = e} src={`https://severgogi.onrender.com/api/v12/showimgproduct/${(products.length !== 0 ? (products[indexSlide[4]].Img) : (null))}`} style={{width: '100%', height: '100%',objectFit: 'cover'}} />
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
     );
}

export default Betseller;