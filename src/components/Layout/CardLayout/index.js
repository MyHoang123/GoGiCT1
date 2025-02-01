

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { Navbar } from "../DefaultLayout/Header"
import { memo, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { checkCard, getProductCard, search, deleteProductCard, resetCard } from './reduxCard/CardSlice'
import { Cookies } from 'react-cookie'
import { listProductCard, listCheckCard } from './reduxCard/CardSelector'
import { useDebounce } from '../../../hooks'
import Footer from '../DefaultLayout/Footer'
import YourCard from './YourCard'
import Suggest from './Suggest'
import classNames from "classnames/bind"
import styles from './CardLayout.module.scss'
const cx = classNames.bind(styles)
function CardLayout() {
    const ProductCard = useSelector(listProductCard)
    const Youcard = useSelector(listCheckCard)
    const dispatch = useDispatch()
    const cookies = new Cookies()
    const [socket, setSocket] = useState(null)
    const [searchValue, setSearchValue] = useState('')
    const debounce = useDebounce(searchValue, 500)
    const LoadSearch = useRef()
    const getSocket = (socket) => {
        setSocket(socket)
    }
    const handleChangeSearch = (e) => {
        LoadSearch.current.classList.add(cx('active'))
        setSearchValue(e)
    }
    const handleClickCheckCard = (Id,Name,Price,Img) => {
        const CheckCard = {
            Id,
            Name,
            Price,
            Img,
            Amount: 1
        }
        dispatch(checkCard(CheckCard))
    }
    const handleClickDeleteCard = (Id) => {
        const Product = {
            IdProduct: Id,
            token: cookies.get('AccessToken')
        }
        dispatch(deleteProductCard(Product))
    }
    useEffect(() => {
        if (cookies.get('AccessToken') !== undefined) {
            dispatch(getProductCard(cookies.get('AccessToken')))
            return () => {
                dispatch(resetCard())
            }
        }
    }, [])
    useEffect(() => {
        dispatch(search(debounce))
        LoadSearch.current.classList.remove(cx('active'))
    }, [debounce])
    return (
        <div className={cx('Card_Container')}>
            <Navbar getSocket = { getSocket } />
            <div className={cx('content')}>
                <div className={cx('body_card')}>
                    <div className={cx('header_body_card')}>
                        <div className={cx('header_body_card-left')}>
                            <div className={cx('header_body_card-lef_content')}>
                                <div className={cx('header_body_card-left_item')}>
                                    <h1>Giỏ hàng</h1>
                                </div>
                            </div>
                        </div>
                        <div className={cx('header_body_card-right')}>
                            <div className={cx('header_body_card-right_content')}>
                                <div className={cx('header_body-card-right_input')}>
                                    <input onChange={(e) => handleChangeSearch(e.target.value)} type='text' placeholder='Tìm kiếm' />
                                    <div ref={LoadSearch} className={cx('search_load_contain')}>
                                        <FontAwesomeIcon className={cx('search_load_card')} icon={faSpinner} />
                                    </div>
                                </div>
                                <div className={cx('header_body_card-right_icon')}>
                                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*  */}
                    <div className={cx('body_card_content')}>
                        <div className={cx('body_card_content_container')}>
                            <div className={cx('body_card_content_container-item-product')}>
                                <div className={cx('body_card_content_container-item-product_header')}>
                                    <div className={cx('body_card_content_container-item-product_header-left')}>
                                        <div className={cx('body_card_content_container-item-product_header-left-checkbox')}>
                                        </div>
                                        <h2>Sản phẩm</h2>
                                    </div>
                                    <div className={cx('body_card_content_container-item-product_header-right')}>
                                        <h2>Giá</h2>
                                        <h2>Hình Ảnh</h2>
                                        <h2>Xóa</h2>
                                    </div>
                                </div>
                                {ProductCard !== undefined ? (
                                    (ProductCard.map((product) => (
                                        (product.Status === 'visible' ? (
                                            <label key={product.Id} className={cx('body_card_content_container-item-product_body')} htmlFor={`checkedProduct${product.Id}`}>
                                                <div className={cx('body_card_content_container-item-product_body-name')}>
                                                    <div className={cx('body_card_content_container-item-product_body-name-checkbox')}>
                                                        <input checked={Youcard.some((card) => card.Id == product.Id)} onChange={() => handleClickCheckCard(product.Id,product.Name,product.Price,product.Img)} id={`checkedProduct${product.Id}`} name='product' type="checkbox" className={cx('cyberpunk-checkbox')} />
                                                    </div>
                                                    <h2>{product.Name}</h2>
                                                </div>
                                                <div className={cx('body_card_content_container-item-product_body-sl-price-img')}>
                                                    <h2>{product.Price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫'}</h2>
                                                    <div className={cx('body_card_content_container-item-product_body-sl-price-img-item')}>
                                                        <img src={`${process.env.REACT_APP_CALL_API}/api/v12/showimgproduct/${product.Img}`} />
                                                    </div>
                                                    <div className={cx('body_card_content_container-item-product_body-delete')}>
                                                        <button onClick={() => handleClickDeleteCard(product.Id)} className={cx('button_delete')}>
                                                            <svg viewBox="0 0 448 512" className={cx('svgIcon_delete')}><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path></svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </label>
                                        ) : null)
                                    )))
                                ) : null}
                            </div>
                            <div className={cx('body_card_content_container-item-checkout')}>
                                <YourCard socket = {socket} cx={cx} />
                            </div>
                        </div>
                    </div>
                    <Suggest cx={cx} />
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default memo(CardLayout);