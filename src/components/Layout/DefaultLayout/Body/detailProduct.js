
import { RenderStar } from "../../../../hooks";
import { useDispatch, useSelector } from 'react-redux';
import { resetDetailProduct } from './reduxBody/BodySlice'
import { listComment } from "./reduxBody/BodySelector";
import { memo } from "react";
function DetailProduct({ ALLStar, ModalDetail, cx }) {
    const dispatch = useDispatch()
    const Comments = useSelector(listComment)
    const handleClickRemoveDetail = () => {
        ModalDetail.current.classList.remove(cx('active'))
        ALLStar.current.innerText = '0/5'
        dispatch(resetDetailProduct())
    }
    return (
        <div onClick={handleClickRemoveDetail} ref={ModalDetail} className={cx('modal_detailproduct')}>
            <div className={cx('detailproduct_containet')}>
                <div onClick={(e) => e.stopPropagation()} className={cx('comment_show-content')}>
                    <h2 className={cx('header_showcomment')}>ĐÁNH GIÁ SẢN PHẨM</h2>
                    <div className={cx('comment_show-content_container')}>
                        <div className={cx('navbar_showcomment')}>
                            <div className={cx('navbar_showcomment-start')}>
                                <h1 ref={ALLStar}></h1>
                                <div className={cx('rating_detail-comment')}>
                                    <RenderStar Star={4} />
                                </div>
                            </div>
                            <ul className={cx('navbar_showcomment-item')}>
                                <li>Tất Cả</li>
                                <li>5 Sao</li>
                                <li>4 Sao</li>
                                <li>3 Sao</li>
                                <li>2 Sao</li>
                                <li>1 Sao</li>
                            </ul>
                        </div>
                        <div className={cx('content_showcomment')}>
                            {Comments !== undefined ? (
                                (Comments.map((cmt) => (
                                    <div key={cmt.Id} className={cx('content_showcomment-item')}>
                                        <div className={cx('content_showcomment-info')}>
                                            <div className={cx('content_showcomment-item-img')}>
                                                <img src={`${process.env.REACT_APP_CALL_API}/api/v12/avtuser/${cmt.Avt}`} />
                                            </div>
                                            <div className={cx('content_showcomment-user')}>
                                                <div className={cx('content_showcomment-item-name')}>
                                                    <h2>{cmt.UserName}</h2>
                                                </div>
                                                <div className={cx('content_showcomment-item-start')}>
                                                    <RenderStar Star={cmt.Star} />
                                                </div>
                                                <div className={cx('content_showcomment-item-date')}>
                                                    <span>2024-04-01 10:59 </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={cx('content_showcomment-item_comment')}>
                                            <p>{cmt.Containt}</p>
                                            {cmt.RepComment.length === 0 ? null : (
                                                <div className={cx('content_showcomment-item_comment_repcomment')}><div>Từ người bán: <span>{cmt.RepComment}</span> </div></div>
                                            )}
                                        </div>
                                    </div>
                                )))
                            ) : (
                                <div className={cx('no_comment')}>
                                    <h1>Chưa có đánh giá</h1>
                                </div>
                            )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default memo(DetailProduct);