
import VideoDemo from "../../../../Asset/Video/gogi.mp4"
import { RenderStar } from "../../../../hooks";
import { useSelector, useDispatch } from "react-redux";
import { listBestSeller } from "./reduxBody/HeaderSelector";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { addCard } from '../Body/reduxBody/BodySlice'
import { Cookies } from "react-cookie";
import { faCartShopping, faStar, faStarHalfStroke } from '@fortawesome/free-solid-svg-icons'
import { memo } from "react";
function BestSeller({ cx, Animation, indexSlide }) {
    const Products = useSelector(listBestSeller)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const cookies = new Cookies()
        const handleClickAddCard = (Id) => {
            if(cookies.get('AccessToken') !== undefined) {
                const Product = {
                    IdProduct: Id,
                    token: cookies.get('AccessToken')
                }
                dispatch(addCard(Product))
            }else {
                navigate('/login')
            }
        }
    return (
        <div ref = {e => Animation.current[2] = e} className={cx('Bestseller_Container')}>
            <h1>BestSeller</h1>
            <div className={cx('Bestseller_Container_contain')}>
                <div className={cx('Bestseller_Container_contain_left')}>
                    <div className={cx('Bestseller_Container_contain_left-item')}>
                        <div className={cx('card')}>
                            <div className={cx('image_container')}>
                                <img className={cx('image')} src={`${process.env.REACT_APP_CALL_API}/api/v12/showimgproduct/${(Products.length !== 0 ? (Products[indexSlide[5]].Img) : (null))}`}/>
                            </div>
                            <div className={cx('title_bestseller')}>
                                <span>{(Products.length !== 0 ? (Products[indexSlide[5]].Name) : (null)) }</span>
                            </div>
                            <div className={cx('price')}>
                                <span>{(Products.length !== 0 ? (Products[indexSlide[5]].Price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫') : (null)) }</span>
                            </div>
                            <div className={cx('sales')}>
                                <div>
                                    <RenderStar Star = {(Products.length !== 0 ? (Products[indexSlide[5]].Star) : (null)) } />
                                </div>
                                <span>Đã bán: {Products.length !== 0 ? (Products[indexSlide[5]].Sales) : null}</span>
                            </div>
                            <div className={cx('action')}>
                                <button onClick={() => handleClickAddCard(Products[indexSlide[5]].Id)} className={cx('cart-button')}>
                                    <FontAwesomeIcon icon={faCartShopping} />
                                    <span> Add to cart</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className={cx('Bestseller_Container_contain_left-item')}>
                        <div className={cx('card')}>
                            <div className={cx('image_container')}>
                            {/* <img className={cx('image')} src={NacVaiCay}/> */}
                            </div>
                            <div className={cx('title_bestseller')}>
                                <span>{(Products.length !== 0 ? (Products[indexSlide[0]].Name) : (null)) }</span>
                            </div>
                            <div className={cx('price')}>
                                <span>{(Products.length !== 0 ? (Products[indexSlide[0]].Price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫') : (null)) }</span>
                            </div>
                            <div className={cx('sales')}>
                                <div>
                                <RenderStar Star = {(Products.length !== 0 ? (Products[indexSlide[0]].Star) : (null)) } />
                                </div>
                                <span>Đã bán: {Products.length !== 0 ? (Products[indexSlide[0]].Sales) : null}</span>
                            </div>
                            <div className={cx('action')}>
                                <button onClick={() => handleClickAddCard(Products[indexSlide[0]].Id)} className={cx('cart-button')}>
                                    <FontAwesomeIcon icon={faCartShopping} />
                                    <span> Add to cart</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className={cx('Bestseller_Container_contain_left-item')}>
                        <div className={cx('card')}>
                            <div className={cx('image_container')}>
                            <img className={cx('image')} src={`${process.env.REACT_APP_CALL_API}/api/v12/showimgproduct/${(Products.length !== 0 ? (Products[indexSlide[1]].Img) : (null))}`}/>
                            </div>
                            <div className={cx('title_bestseller')}>
                                <span>{(Products.length !== 0 ? (Products[indexSlide[1]].Name) : (null)) }</span>
                            </div>
                            <div className={cx('price')}>
                                <span>{(Products.length !== 0 ? (Products[indexSlide[1]].Price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫') : (null)) }</span>
                            </div>
                            <div className={cx('sales')}>
                                <div>
                                <RenderStar Star = {(Products.length !== 0 ? (Products[indexSlide[1]].Star) : (null)) } />
                                </div>
                                <span>Đã bán: {Products.length !== 0 ? (Products[indexSlide[1]].Sales) : null}</span>
                            </div>
                            <div className={cx('action')}>
                                <button onClick={() => handleClickAddCard(Products[indexSlide[1]].Id)} className={cx('cart-button')}>
                                    <FontAwesomeIcon icon={faCartShopping} />
                                    <span> Add to cart</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className={cx('Bestseller_Container_contain_left-item')}>
                        <div className={cx('card')}>
                            <div className={cx('image_container')}>
                            <img className={cx('image')} src={`${process.env.REACT_APP_CALL_API}/api/v12/showimgproduct/${(Products.length !== 0 ? (Products[indexSlide[2]].Img) : (null))}`}/>
                            </div>
                            <div className={cx('title_bestseller')}>
                                <span>{(Products.length !== 0 ? (Products[indexSlide[2]].Name) : (null)) }</span>
                            </div>
                            <div className={cx('price')}>
                                <span>{(Products.length !== 0 ? (Products[indexSlide[2]].Price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫') : (null)) }</span>
                            </div>
                            <div className={cx('sales')}>
                                <div>
                                <RenderStar Star = {(Products.length !== 0 ? (Products[indexSlide[2]].Star) : (null)) } />
                                </div>
                                <span>Đã bán: {Products.length !== 0 ? (Products[indexSlide[2]].Sales) : null}</span>
                            </div>
                            <div className={cx('action')}>
                                <button onClick={() => handleClickAddCard(Products[indexSlide[2]].Id)} className={cx('cart-button')}>
                                    <FontAwesomeIcon icon={faCartShopping} />
                                    <span> Add to cart</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className={cx('Bestseller_Container_contain_left-item')}>
                        <div className={cx('card')}>
                            <div className={cx('image_container')}>
                            <img className={cx('image')} src={`${process.env.REACT_APP_CALL_API}/api/v12/showimgproduct/${(Products.length !== 0 ? (Products[indexSlide[3]].Img) : (null))}`}/>
                            </div>
                            <div className={cx('title_bestseller')}>
                                <span>{(Products.length !== 0 ? (Products[indexSlide[3]].Name) : (null)) }</span>
                            </div>
                            <div className={cx('price')}>
                                <span>{(Products.length !== 0 ? (Products[indexSlide[3]].Price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫') : (null)) }</span>
                            </div>
                            <div className={cx('sales')}>
                                <div>
                                <RenderStar Star = {(Products.length !== 0 ? (Products[indexSlide[3]].Star) : (null)) } />
                                </div>
                                <span>Đã bán: {Products.length !== 0 ? (Products[indexSlide[3]].Sales) : null}</span>
                            </div>
                            <div className={cx('action')}>
                                <button onClick={() => handleClickAddCard(Products[indexSlide[3]].Id)} className={cx('cart-button')}>
                                    <FontAwesomeIcon icon={faCartShopping} />
                                    <span> Add to cart</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className={cx('Bestseller_Container_contain_left-item')}>
                        <div className={cx('card')}>
                            <div className={cx('image_container')}>
                            <img className={cx('image')} src={`${process.env.REACT_APP_CALL_API}/api/v12/showimgproduct/${(Products.length !== 0 ? (Products[indexSlide[4]].Img) : (null))}`}/>
                            </div>
                            <div className={cx('title_bestseller')}>
                                <span>{(Products.length !== 0 ? (Products[indexSlide[4]].Name) : (null)) }</span>
                            </div>
                            <div className={cx('price')}>
                                <span>{(Products.length !== 0 ? (Products[indexSlide[4]].Price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫') : (null)) }</span>
                            </div>
                            <div className={cx('sales')}>
                                <div>
                                <RenderStar Star = {(Products.length !== 0 ? (Products[indexSlide[4]].Star) : (null)) } />
                                </div>
                                <span>Đã bán: {Products.length !== 0 ? (Products[indexSlide[4]].Sales) : null}</span>
                            </div>
                            <div className={cx('action')}>
                                <button onClick={() => handleClickAddCard(Products[indexSlide[4]].Id)} className={cx('cart-button')}>
                                    <FontAwesomeIcon icon={faCartShopping} />
                                    <span> Add to cart</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={cx('Bestseller_Container_contain_right')}>
                    <video className={cx('bestseller_video-item')} muted autoPlay loop>
                        <source src={VideoDemo} type="video/mp4" />
                    </video>
                    <div className={cx('bestseller_modal_video')}></div>
                </div>
            </div>
        </div>
    );
}

export default memo(BestSeller);