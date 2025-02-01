
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartShopping } from '@fortawesome/free-solid-svg-icons'
import { Cookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { listProductSuggest } from './reduxCard/CardSelector'
import { addCardCard } from './reduxCard/CardSlice'
import { RenderStar } from '../../../hooks';
import { memo } from 'react';

function Suggest({ cx }) {
    const cookies = new Cookies()
    const dispatch = useDispatch()
    const ProductSuggest = useSelector(listProductSuggest)
    const navigate = useNavigate()
    const handleClickAddCard = (Id) => {
        if (cookies.get('AccessToken') !== undefined) {
            const Product = {
                IdProduct: Id,
                token: cookies.get('AccessToken')
            }
            dispatch(addCardCard(Product))
        } else {
            navigate('/login')
        }
    }
    return (
        <div className={cx('Suggest_container')}>
            <h2>có thể bạn cũng thích</h2>
            <div className={cx('Suggest_content')}>
                {ProductSuggest !== undefined ? (
                    (ProductSuggest.map((product) => (
                        <div key={product.Id} className={cx('Bestseller_Container_contain_left-item')}>
                            <div className={cx('card')}>
                                <div className={cx('image_container')}>
                                    <img className={cx('image')} src={`${process.env.REACT_APP_CALL_API}/api/v12/showimgproduct/${product.Img}`} />
                                </div>
                                <div className={cx('title_bestseller')}>
                                    <span>{product.Name}</span>
                                </div>
                                <div className={cx('price')}>
                                <span>Giá:</span>
                    
                                    <span>{product.Price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫'}</span>
                                </div>
                                <div className={cx('sales')}>
                                    <div>
                                        <RenderStar Star={product.Star} />
                                    </div>
                                    <span>Đã bán: {product.Sales}</span>
                                </div>
                                <div className={cx('action')}>
                                    <button onClick={() => handleClickAddCard(product.Id)} className={cx('cart-button')}>
                                        <FontAwesomeIcon icon={faCartShopping} />
                                        <span>Add to cart</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )))
                ) : null}
            </div>
        </div>
    );
}

export default memo(Suggest);