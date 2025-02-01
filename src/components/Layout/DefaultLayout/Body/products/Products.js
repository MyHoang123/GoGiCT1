import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faCartShopping, faHeart, faChevronLeft, faChevronRight,faSpinner } from '@fortawesome/free-solid-svg-icons';
import { RenderStar,useDebounce } from '../../../../../hooks';
import { useDispatch, useSelector } from 'react-redux';
import { Cookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { Fragment, memo, useEffect, useRef, useState } from 'react';
import { getProduct, getComment, addCard, resetBody } from '../reduxBody/BodySlice';
import { listProductSelectorAll } from '../reduxBody/BodySelector';
import BodySlice from '../reduxBody/BodySlice';
function Pages({ cx, numPage, PageAll, dispatch }) {
    const handlePageChange = (page) => {
        dispatch(BodySlice.actions.changePage(page))
    }
    const handlePageChangeButton = (btn) => {
        if(btn === 0) {
            dispatch(BodySlice.actions.prevPage())
        }else if(btn === 1) {
            dispatch(BodySlice.actions.nextPage())

        }
    }
    const createPapge = () => {
        const ArrPage = []
        let prev = numPage - 1
        let next = numPage + 1
            if(numPage === 1) {
                next = next += 1
            }
            if(numPage === PageAll) {
                prev = prev +- 1
            }
            for(let i = 1; i <= PageAll; i ++) {
                if(i >= prev && i <= next) {
                    ArrPage.push(i)
                }
            }
        return ArrPage
    }
    const newArr = createPapge()
    if(newArr !== undefined ) {
        return (
            <ul className={cx('Products_Container_page-list')}>
                <li onClick={()=> handlePageChangeButton(0)}><FontAwesomeIcon icon={faChevronLeft} /></li>
                    {newArr.map((page) => (
                        <Fragment key={page}>
                            <li onClick={() => handlePageChange(page)} className={page === numPage ? cx('active') : null}>{page}</li>
                        </Fragment>
                    ))}
                <li onClick={()=> handlePageChangeButton(1)}><FontAwesomeIcon icon={faChevronRight} /></li>
            </ul>
        )
    }
}
function Products({ ALLStar, ModalDetail, cx }) {
    const productAll = useSelector(listProductSelectorAll)
    const dispatch = useDispatch()
    const cookies = new Cookies()
    const navigate = useNavigate()
    const [searchValue, setSearchValue] = useState('')
    const loadSearch = useRef()
    const debounce = useDebounce(searchValue, 500)
    const hanldeClickRanDom = () => {
        dispatch(BodySlice.actions.randomProduct())
    }
    const handleClickNewProduct = () => {
        dispatch(BodySlice.actions.newProduct())
    }
    const handleClickMinProduct = () => {
        dispatch(BodySlice.actions.minProduct())
    }
    const handleClickMaxProduct = () => {
        dispatch(BodySlice.actions.maxProduct())
    }
    const handleChangeSearch = (e) => {
        loadSearch.current.classList.add(cx('active'))
        setSearchValue(e)
    }
    const handleClickShowDetail = (Id,Star) => {
        dispatch(getComment(Id))
        ModalDetail.current.classList.add(cx('active'))
        ALLStar.current.innerText = `${Star !== null ? Star : 0}/5`
    }
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
    useEffect(() => {
        dispatch(getProduct())
        return () => {
            dispatch(resetBody())
        }
    }, [])
    useEffect(() => {
        dispatch(BodySlice.actions.search(debounce))
        loadSearch.current.classList.remove(cx('active'))
    }, [debounce])
    return (
        <div className={cx('Products_Container')}>
            <div className={cx('Products_Container_header')}>
                <h2>SẢN PHẨM NỔI BẬT</h2>
                <div className={cx('Products_Container_header-filter')}>
                    <div className={cx('group')}>
                        <FontAwesomeIcon className={cx('icon')} icon={faMagnifyingGlass} />
                        <input onChange={(e) => handleChangeSearch(e.target.value)} className={cx('input')} type="text" placeholder="Search" />
                        <div ref={loadSearch} className={cx('load_contain')}>
                              <FontAwesomeIcon  className={cx('icon_load')} icon={faSpinner} />
                        </div>
                    </div>
                </div>
                <div className={cx('Products_Container_header_button')}>
                    <button className={cx('Products_Container_header_button_icon')} onClick={hanldeClickRanDom}>Ngẫu nhiên</button>
                    <button className={cx('Products_Container_header_button_icon')} onClick={handleClickNewProduct}>Mới nhất</button>
                    <button className={cx('Products_Container_header_button_icon')} onClick={handleClickMinProduct}>Giá thấp</button>
                    <button className={cx('Products_Container_header_button_icon')} onClick={handleClickMaxProduct}>Giá cao</button>
                </div>
                <div className={cx('Products_Container_header-page')}>
                    {productAll[2]}/{productAll[1]}
                </div>
            </div>
            <div className={cx('Products_Container_contain')}>
                {productAll[0].map((product) => (
                    (product.Status === 'visible' ? (
                        <div key={product.Id} className={cx('card')}>
                            <div className={cx('image-container')}>
                                <img src={`${process.env.REACT_APP_CALL_API}/api/v12/showimgproduct/${product.Img}`} />
                            </div>
                            <FontAwesomeIcon className={cx('heart_product')} icon={faHeart} />
                            <div className={cx('content')}>
                                <div className={cx('brand')}>{product.Name}</div>
                                <div className={cx('color-size-container')}>
                                    <div className={cx('colors')}>
                                        <ul className={cx('colors-container')}>
                                            <span>Giá:</span>
                                            <span className={cx('price_product')}>{product.Price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫'}</span>
                                        </ul>
                                    </div>
                                    <div className={cx('sizes')}>
                                        <span className={cx('title_cate')}>LOẠI</span>
                                        <div className={cx('size-container')}>
                                            <span className={cx('name')}>{product.NameCate}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className={cx('rating')}>
                                    <RenderStar Star={product.Star} />
                                    <span className={cx('sales')}>đã bán {product.Sales}</span>
                                </div>
                            </div>
                            {product.Visible === 1 ? (
                                <div className={cx('button-container')}>
                                    <button onClick={() => handleClickShowDetail(product.Id,product.Star)} className={cx('detailproduct_button')}>Xem chi tiết</button>
                                    <button onClick={() => handleClickAddCard(product.Id)} className={cx('cart-button', 'button')}>
                                        <FontAwesomeIcon className={cx('cart_icon')} icon={faCartShopping} />
                                    </button>
                                </div>
                            ) : (
                                <div className={cx('container_product_off')}><span>Hết món</span></div>
                            )}
                        </div>
                    ) : null)
                ))}
            </div>
            <div className={cx('Products_Container_page')}>
                <Pages cx = {cx} numPage={productAll[2]} PageAll = {productAll[1]} dispatch = {dispatch} />
            </div>
        </div>
    );
}

export default memo(Products);