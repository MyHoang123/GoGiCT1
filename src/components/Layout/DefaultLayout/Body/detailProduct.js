import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faHeart,faCartShopping} from '@fortawesome/free-solid-svg-icons';
import { useRef, useState, memo } from 'react';
import { RenderStar } from '~/hooks'
import { Cookies } from 'react-cookie';

function DetailProduct( {productDetail, modalDetail, handleClickRemoveDetailProduct} ) {
    const cookies = new Cookies()
    const [cmtContent,setCmtContent] = useState(null)
    const modalDetailProduct = useRef()
    const cardDetailProduct = useRef()
    const commentShow = useRef()
    const showComment = async (Id) => {
        try {
            const response = await axios.post('https://severgogi.onrender.com/api/v12/showcomment', Id);
            if(response.data.massege === "Thanh Cong") {
                setCmtContent(response.data.data)
            }
           else {
                setCmtContent(null)
           }
        } catch (error) {
            console.error('Lỗi khi thêm sản phẩm:', error);
        }
    }
    const filterComment = async (Comment) => {
        try {
            const response = await axios.post('https://severgogi.onrender.com/api/v12/filtercomment', Comment);
            if(response.data.massege === "Thanh cong") {
                setCmtContent(response.data.data)
            }
            else {
                setCmtContent([])
            }
        } catch (error) {
            console.error('Lỗi khi thêm sản phẩm:', error);
        }
    }
    const handleClickShowComment = (Id) => {
        const IdProduct = {
            IdProduct: Id,
            token: cookies.get('AccessToken')
        }
        showComment(IdProduct)
        cardDetailProduct.current.classList.add('open')
        commentShow.current.classList.add('open')
    }
    const handleClickFilterComment = (IdProduct,Star) => {
        if(IdProduct !== null && Star !== null) {
            const ProductFilter = {
                    IdProduct: IdProduct,
                    Star: Star,
                    token: cookies.get('AccessToken')
                }
                filterComment(ProductFilter)
        }
    }
    return ( 
        <div onClick={() => handleClickRemoveDetailProduct(cardDetailProduct,commentShow)} ref={modalDetailProduct} className={modalDetail ? 'modal_detailproduct open' : 'modal_detailproduct'}>
        {productDetail !== null ? (
            <div className='detailproduct_containet'>
                    <div ref={cardDetailProduct} onClick={e => e.stopPropagation()} style={{height: '500px', width: '25%'}} className="card card_detailproduct">
                    <div style={{height: '45%',borderTopRightRadius: '10rem'}} className="image-container">
                    <img className='ImgProductDetail' src={`https://severgogi.onrender.com/api/v12/showimgproduct/${productDetail.Img}`} style={{width: '100%', height: '100%',objectFit: 'cover', zIndex: '100'}} />
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
                                LOAI
                                <ul className="size-container">
                                    <span>{productDetail.NameCate}</span>
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
                        <button style={{height: '50px',width: '25%',borderRadius: ' 3.4rem 3.4rem 2.7rem 2.7rem' }} className="cart-button_detail button">
                            <FontAwesomeIcon icon={faCartShopping} />
                        </button>
                    </div>
                        </div>
                        <div onClick={(e) => e.stopPropagation()} ref={commentShow} className='comment_show-content'>
                                <h2 className='header_showcomment'>ĐÁNH GIÁ SẢN PHẨM</h2>
                            <div className='comment_show-content_container'>
                                <div className='navbar_showcomment'>
                                    <div className='navbar_showcomment-start'>
                                            <h1>{productDetail.Star}/5</h1>
                                        <div className='start-item'>
                                    <div className="rating_detail-comment">
                                        <RenderStar Star={productDetail.Star} />                                                                            
                                    </div>
                                        </div>
                                    </div>
                                    <ul className='navbar_showcomment-item'>
                                        <li onClick={() => handleClickShowComment(productDetail.Id)}>Tất Cả</li>
                                        <li onClick={() => handleClickFilterComment(productDetail.Id,5)}>5 Sao</li>
                                        <li onClick={() => handleClickFilterComment(productDetail.Id,4)}>4 Sao</li>
                                        <li onClick={() => handleClickFilterComment(productDetail.Id,3)}>3 Sao</li>
                                        <li onClick={() => handleClickFilterComment(productDetail.Id,2)}>2 Sao</li>
                                        <li onClick={() => handleClickFilterComment(productDetail.Id,1)}>1 Sao</li>
                                    </ul>
                                </div>
                                <div className='content_showcomment'>
                                {(cmtContent !== null ? (
                                    (cmtContent.map((cmt,index) => (
                                    <div key={index} className='content_showcomment-item'>
                                        <div className='content_showcomment-info'>
                                            <div className='content_showcomment-item-img'>
                                            <img style={{width: '100%',height: '100%',borderRadius: '50%',objectFit: 'cover', zIndex: '100'}} src={cmt.Classify === 'user' ? `https://severgogi.onrender.com/api/v12/avtuser/${cmt.Avt}`: `${cmt.Avt}` }/>
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
        ) : null}                      
</div>

     );
}

export default memo(DetailProduct);