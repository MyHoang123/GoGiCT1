import styles from './Card.module.scss'
import classNames from "classnames/bind"
import { memo, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import {RenderStar } from '../../../hooks'
import { useSelector } from 'react-redux';
import {listProductSuggest} from './CardSelector'
const cx = classNames.bind(styles)
function Suggest({CheckCard, setCheckCard}) {
    const Suggest = useSelector(listProductSuggest)
    const btnBuyCheckbox = useRef([])
    const btnBuy = useRef([])
    const handleChangeCheckSuggest = (i,Id,Price,Name,Img,CheckCard) => {
        const productCard = CheckCard.filter((card) => card.Id === Id)
        if(productCard.length > 0) {
            btnBuyCheckbox.current[i].style.width = '100%'
            btnBuyCheckbox.current[i].style.padding = '.5rem'
            btnBuy.current[i].style.opacity = 1
            setCheckCard(prev => prev.filter((card) => card.Id !== Id))
        }
        else {
            btnBuyCheckbox.current[i].style.width = '0'
            btnBuyCheckbox.current[i].style.padding = '0'
            btnBuy.current[i].style.opacity = 0

            setCheckCard((prev) => [...prev,{Id:Id,Price:Price,Name:Name,Img:Img}])
        }
    }
    return ( 
        <div className={cx('Suggest_container')}>
        <h2>có thể bạn cũng thích</h2>
        <div className={cx('Suggest_content')}>
            {Suggest.map((products,i) => (
            <div key={i} className={cx('Suggest_content-item')}>
                <div title={products.Sales < 999 ? 'TRENDING' : 'BEST SELLER'} className={cx('card')}>
                <label className={cx('favorite')}>
                    <FontAwesomeIcon className={cx('heart_product')} icon={faHeart} style={{fontSize: '15px'}} />
                </label>
                <div className={cx('image_container')}>
                    <img  className={cx('image_animate_best')} src={`https://severgogi.onrender.com/api/v12/showimgproduct/${products.Img}`} style={{width: '100%', height: '100%',objectFit: 'cover'}} />
                </div>
                <div className={cx('title_card')}>
                    <span>{products.Name}</span>
                </div>
                <ul style={{paddingLeft: '0',color:'#D9D9D9',marginBottom:'0'}} className="colors-container">
                    <span style={{marginTop: '2px',fontSize: '14px',marginRight:'10px'}}>Giá:</span>
                    <span className='price_product' style={{fontSize: '6px'}}>{products.Price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫'}</span>
                </ul>
                <div className={cx('size')}>
                    <div className='svg four-star-svg'>
                        <RenderStar Star = {products.Star}/>
                    </div>
                    <div style={{color:'#a8a8a8'}} className={cx('Sales_product')}> Đã bán:  {products.Sales}</div>
                </div>
                {products.Visible === 1 ? (
                        <div className={cx('action')}>
                        <label ref={e => btnBuyCheckbox.current[i] = e} htmlFor={`checkProduct${i}`} className={cx('cart-button')}>
                            <span ref={e => btnBuy.current[i] = e}>Mua</span>
                        </label>
                            <div className={cx('checkbox-wrapper-33')}>
                            <label className={cx('checkbox')}>
                                <input checked={CheckCard.some((product) => product.Id === products.Id)} onChange={() => handleChangeCheckSuggest(i,products.Id,products.Price,products.Name,products.Img,CheckCard)} id={`checkProduct${i}`}  name='product' className={cx('checkbox__trigger','visuallyhidden')} type="checkbox" />
                                <span className={cx('checkbox__symbol')}>
                                <svg
                                    aria-hidden="true"
                                    className={cx('icon-checkbox')}
                                    viewBox="0 0 28 28"
                                    version="1"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M4 14l8 7L24 7"></path>
                                </svg>
                                </span>
                            </label>
                            </div>
                    </div> 
                ) : (
                        <span className={cx('products_off_card')}>Hết món</span>
                ) }
                </div>
            </div>
            ))}
        </div>
    </div>
     );
}

export default memo(Suggest);