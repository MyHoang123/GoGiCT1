

import { Link } from 'react-router-dom'
import { getBill, resetPurchase, filterStatus } from '../../components/Layout/PurchaseLayout/reduxPurchase/PurchaseSlice'
import { useDispatch, useSelector } from 'react-redux'
import { listBillSelector } from '../../components/Layout/PurchaseLayout/reduxPurchase/PurchaseSelector'
import { Cookies } from 'react-cookie'
import { memo, useContext, useEffect, useState } from 'react'
import { ContextPurchase } from '../../components/Layout/PurchaseLayout'
import BillNull from '../../Asset/images/5fafbb923393b712b964.png'
import StatusBill from './StatusBill'
import classNames from "classnames/bind"
import styles from './Purchase.module.scss'
const cx = classNames.bind(styles)
function Purchase() {
    const cookies = new Cookies()
    const dispatch = useDispatch()
    const ListBill = useSelector(listBillSelector)
    const { handleClickShowComment } = useContext(ContextPurchase)
    const [Active, setActive] = useState(null)
    const [AmountStatus, setAmountStatus] = useState([
        { dadat: 0 },
        { chogiao: 0 },
        { danggiao: 0 },
        { dagiao: 0 },
    ])
    useEffect(() => {
        if (cookies.get('AccessToken') !== undefined) {
            dispatch(getBill(cookies.get('AccessToken')))
            return () => {
                dispatch(resetPurchase())
            }
        }
    }, [])
    useEffect(() => {
        dispatch(filterStatus(Active))
    }, [Active])
    useEffect(() => {
        if (ListBill[0] !== null) {
            let dadat = 0
            let chogiao = 0
            let danggiao = 0
            let dagiao = 0
            for (let i in ListBill[0]) {
                if (ListBill[0][i].Status === 0) {
                    dadat = dadat + 1
                }
                else if (ListBill[0][i].Status === 1) {
                    chogiao = chogiao + 1
                }
                else if (ListBill[0][i].Status === 2) {
                    danggiao = danggiao + 1
                }
                else if (ListBill[0][i].Status === 3) {
                    dagiao = dagiao + 1
                }
            }
            const newAmount = [
                { dadat: dadat },
                { chogiao: chogiao },
                { danggiao: danggiao },
                { dagiao: dagiao },
            ]
            setAmountStatus(newAmount)
        }
    }, [ListBill])
    return (
        <div className={cx('Purchase_content')}>
            <ul className={cx('Purchase_content_header')}>
                <li onClick={() => setActive(null)} className={Active === null ? cx('active') : null}>Tất cả</li>
                <li onClick={() => setActive(0)} className={Active === 0 ? cx('active') : null}>Chờ xác nhận
                    {AmountStatus[0].dadat !== 0 ? (
                        <span className={cx('Purchase_content_header_noti')}>{AmountStatus[0].dadat}</span>
                    ) : null}
                </li>
                <li onClick={() => setActive(1)} className={Active === 1 ? cx('active') : null}>Chờ giao hàng
                    {AmountStatus[1].chogiao !== 0 ? (
                        <span className={cx('Purchase_content_header_noti')}>{AmountStatus[1].chogiao}</span>
                    ) : null}
                </li>
                <li onClick={() => setActive(2)} className={Active === 2 ? cx('active') : null}>Đang giao
                    {AmountStatus[2].danggiao !== 0 ? (
                        <span className={cx('Purchase_content_header_noti')}>{AmountStatus[2].danggiao}</span>
                    ) : null}
                </li>
                <li onClick={() => setActive(3)} className={Active === 3 ? cx('active') : null}>Hoàng thành
                    {AmountStatus[3].dagiao !== 0 ? (
                        <span className={cx('Purchase_content_header_noti')}>{AmountStatus[3].dagiao}</span>
                    ) : null}
                </li>
                <li onClick={() => setActive(5)} className={Active === 5 ? cx('active') : null}>Đã hủy</li>
            </ul>
            {ListBill[1] ? (
                (ListBill[0].map((Bill) => (
                    (Bill.Filter === 'visible' ? (
                        <div key={Bill.Id} className={cx('Purchase_content_body')}>
                            <div className={cx('Purchase_content_body_container')}>
                                <div className={cx('Purchase_content_body_container_header')}>
                                    <div className={cx('Purchase_content_body_container_header-item')}>
                                        <StatusBill cx={cx} Status={Bill.Status} />
                                        <Link to={`/purchase/detail/${Bill.Id}`} className={cx('Purchase_content_body_container_header-item_comment')}>Xem chi tiết</Link>
                                    </div>
                                </div>
                                {JSON.parse(Bill.Data).map((product) => (
                                    <div key={product.Id} className={cx('Purchase_content_body_container_body')}>
                                        <div className={cx('Purchase_content_body_container_body-left')}>
                                            <div className={cx('Purchase_content_body_container_body-left-img')}>
                                                <img style={{ width: '100%', objectFit: 'cover' }} src={`${process.env.REACT_APP_CALL_API}/api/v12/showimgproduct/${product.Img}`} />
                                            </div>
                                            <div className={cx('Purchase_content_body_container_body-left-content')}>
                                                <h3>{product.Name}</h3>
                                                <h3 style={{ color: 'rgba(0, 0, 0, .54)', fontSize: '.8vw' }}>Phân loại: {product.NameCate}</h3>
                                                <h3 style={{ fontSize: '.7vw' }}>x{product.sl}</h3>
                                            </div>
                                        </div>
                                        <div className={cx('Purchase_content_body_container_body-right')}>
                                            <h3>{product.Price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫'}</h3>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className={cx('Purchase_content_body_footer')}>
                                <div className={cx('Purchase_content_body_footer-totalpay')}>
                                    <div className={cx('Purchase_content_body_footer-totalpay_container')}>
                                        <div className={cx('Purchase_content_body_footer-totalpay_container-text')}>
                                            <svg width="1vw" height=".8vw" viewBox="0 0 253 263" fill="none" xmlns="http://www.w3.org/2000/svg"><title>Shopee Guarantee</title><path fillRule="evenodd" clipRule="evenodd" d="M126.5 0.389801C126.5 0.389801 82.61 27.8998 5.75 26.8598C5.08763 26.8507 4.43006 26.9733 3.81548 27.2205C3.20091 27.4677 2.64159 27.8346 2.17 28.2998C1.69998 28.7657 1.32713 29.3203 1.07307 29.9314C0.819019 30.5425 0.688805 31.198 0.689995 31.8598V106.97C0.687073 131.07 6.77532 154.78 18.3892 175.898C30.003 197.015 46.7657 214.855 67.12 227.76L118.47 260.28C120.872 261.802 123.657 262.61 126.5 262.61C129.343 262.61 132.128 261.802 134.53 260.28L185.88 227.73C206.234 214.825 222.997 196.985 234.611 175.868C246.225 154.75 252.313 131.04 252.31 106.94V31.8598C252.31 31.1973 252.178 30.5414 251.922 29.9303C251.667 29.3191 251.292 28.7649 250.82 28.2998C250.35 27.8358 249.792 27.4696 249.179 27.2225C248.566 26.9753 247.911 26.852 247.25 26.8598C170.39 27.8998 126.5 0.389801 126.5 0.389801Z" fill="#990009"></path><path fillRule="evenodd" clipRule="evenodd" d="M207.7 149.66L119.61 107.03C116.386 105.472 113.914 102.697 112.736 99.3154C111.558 95.9342 111.772 92.2235 113.33 88.9998C114.888 85.7761 117.663 83.3034 121.044 82.1257C124.426 80.948 128.136 81.1617 131.36 82.7198L215.43 123.38C215.7 120.38 215.85 117.38 215.85 114.31V61.0298C215.848 60.5592 215.753 60.0936 215.57 59.6598C215.393 59.2232 215.128 58.8281 214.79 58.4998C214.457 58.1705 214.063 57.909 213.63 57.7298C213.194 57.5576 212.729 57.4727 212.26 57.4798C157.69 58.2298 126.5 38.6798 126.5 38.6798C126.5 38.6798 95.31 58.2298 40.71 57.4798C40.2401 57.4732 39.7735 57.5602 39.3376 57.7357C38.9017 57.9113 38.5051 58.1719 38.1709 58.5023C37.8367 58.8328 37.5717 59.2264 37.3913 59.6604C37.2108 60.0943 37.1186 60.5599 37.12 61.0298V108.03L118.84 147.57C121.591 148.902 123.808 151.128 125.129 153.884C126.45 156.64 126.797 159.762 126.113 162.741C125.429 165.72 123.755 168.378 121.363 170.282C118.972 172.185 116.006 173.221 112.95 173.22C110.919 173.221 108.915 172.76 107.09 171.87L40.24 139.48C46.6407 164.573 62.3785 186.277 84.24 200.16L124.49 225.7C125.061 226.053 125.719 226.24 126.39 226.24C127.061 226.24 127.719 226.053 128.29 225.7L168.57 200.16C187.187 188.399 201.464 170.892 209.24 150.29C208.715 150.11 208.2 149.9 207.7 149.66Z" fill="#fff"></path></svg>
                                            <h3 style={{ fontSize: '.9vw' }}>Thành tiền:</h3>
                                        </div>
                                        <div className={cx('Purchase_content_body_footer-totalpay_container-price')}>
                                            <h2>{Bill.TotalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫'}</h2>
                                        </div>
                                    </div>
                                </div>
                                <div className={cx('Purchase_content_body_footer-button')}>
                                    <div className={cx('Purchase_content_body_footer-button-left')}>
                                        <h3>Chờ bạn đánh giá</h3>
                                    </div>
                                    <div className={cx('Purchase_content_body_footer-button-right')}>
                                        {Bill.Status === 3 ? (
                                            <button onClick={() => handleClickShowComment(Bill.Id, Bill.Data, cookies.get('AccessToken'))} className={cx('active')}>Đánh giá</button>
                                        ) : null}
                                        {Bill.Status === 4 ? (
                                            <button onClick={() => handleClickShowComment(Bill.Id, Bill.Data, cookies.get('AccessToken'))} className={cx('active')}>Xem đánh giá</button>
                                        ) : null}
                                        <Link to='/card' className={cx('replay','active')}>Mua lại</Link>
                                        <button>Liên Hệ Người Bán</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : null)
                )))
            ) : (
                <div className={cx('Bill_null_content')}>
                    <img src={BillNull} />
                    <h2>Chưa có đơn hàng</h2>
                </div>
            )}



        </div>
    );
}

export default memo(Purchase);