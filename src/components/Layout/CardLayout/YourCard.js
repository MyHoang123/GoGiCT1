

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPhone, faPlus, faLocationDot } from '@fortawesome/free-solid-svg-icons'
import { faUser as faUserRegular } from '@fortawesome/free-regular-svg-icons';
import { infoUser } from '../DefaultLayout/Header/reduxBody/HeaderSelector';
import { useSelector } from "react-redux";
import { listYourCard, voucher } from './reduxCard/CardSelector'
import { inCrease, deCrease, checkVoucher, createBill } from './reduxCard/CardSlice'
import { useDispatch } from "react-redux";
import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { Cookies } from 'react-cookie';
import { Notice } from '../../../hooks'
import Map from './map'
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import VNPAY from '../../../Asset/images/R.png'
import MOMO from '../../../Asset/images/MOMO.png'
import HERE from '../../../Asset/images/HEREPAY.jpg'
function YourCard({ cx, socket }) {
    const cookies = new Cookies()
    const dispatch = useDispatch()
    let YourCard = useSelector(listYourCard)
    const User = useSelector(infoUser)
    const Voucher = useSelector(voucher)
    const [editUser, setEditUser] = useState(false)
    const [payMethod, setPaymethod] = useState(null)
    const [userName, setUserName] = useState(null)
    const [phone, setPhone] = useState(0)
    const [ll, setLl] = useState(null)
    const [destination, setDestination] = useState(null)
    const modalCheckoutRef = useRef()
    const ModalForm = useRef()
    const ContentVoucher = useRef()
    const noteBill = useRef()
    const ModalMapRef = useRef()
    const valueName = useRef()
    const valuePhone = useRef()

    const handleClickIncrease = (Id) => {
        dispatch(inCrease(Id))
    }
    const handleClickDecrease = (Id) => {
        dispatch(deCrease(Id))
    }
    const handleClickEditInfo = () => {
        setEditUser(true)
        modalCheckoutRef.current.style.transform = 'translateX(-13vw)'
        ModalMapRef.current.classList.add('open')
    }
    const handleClickRemoveEdit = () => {
        setEditUser(false)
        modalCheckoutRef.current.style.transform = 'translateX(0px)'
        ModalMapRef.current.classList.remove('open')
    }
    const handleClickPay = () => {
        if (YourCard.length > 0) {
            ModalForm.current.classList.add(cx('open'))
        }
        else {
            Notice('error', 'Thất Bại', `Vui lòng chọn sản phẩm !`, '')
        }
    }
    const handleClickCheckOut = () => {
        if (payMethod !== null) {
            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                    confirmButton: "btn btn-success",
                    cancelButton: "btn btn-danger"
                },
                buttonsStyling: false
            });
            swalWithBootstrapButtons.fire({
                title: "Giao tại",
                text: `${sessionStorage.getItem('Address')}`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Đồng ý",
                cancelButtonText: "Từ chối",
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    const result = YourCard.reduce((acc, curr) => {
                        const temporary = {
                            Id: curr.Id,
                            Price: curr.Price * curr.Amount
                        }
                        return [...acc, temporary]
                    }, [])
                    const bill = {
                        TotalPrice: TotalPrice,
                        Data: result,
                        Address: sessionStorage.getItem('Address'),
                        Name: userName,
                        Sdt: phone,
                        Destination: destination,
                        Note: noteBill.current.value,
                        PayMethod: payMethod,
                        PriceVoucher: Voucher,
                        token: cookies.get('AccessToken'),
                        socket
                    }
                    dispatch(createBill(bill))
                }
            })
        }
        else {
            Notice('error', 'Thất Bại', `Vui lòng chọn phương thức thanh toán !`, '')

        }
    }
    const handleClickRemovePay = () => {
        ModalForm.current.classList.remove(cx('open'))
        ModalMapRef.current.classList.remove('open')
        modalCheckoutRef.current.style.transform = 'translateX(0px)'
        setEditUser(false)
    }
    const handleClickCheckVoucher = () => {
        const Voucher = {
            voucher: ContentVoucher.current.value,
            token: cookies.get('AccessToken')
        }
        dispatch(checkVoucher(Voucher))
    }
    const handleClickSaveInfo = (ll) => {
        if(ll !== null && valueName.current.value.length > 0 && valuePhone.current.value.length > 0) {
            sessionStorage.setItem('Address',ll)
            setUserName(valueName.current.value)
            setPhone(valuePhone.current.value)
            setEditUser(false)
            ModalMapRef.current.classList.remove('open')
            modalCheckoutRef.current.style.transform = 'translateX(0px)'
        }
        else {
            Notice('error', 'Thất Bại', `Vui lòng nhập đầy đủ thông tin !`, '')
        }
    }
    useEffect(() => {
        setUserName(User.UserName)
        setPhone(User.Sdt)
        setDestination(sessionStorage.getItem('destination'))
    }, [User])
    const TotalPrice = useMemo(() => {
        let Total = 0
        YourCard.forEach(element => {
            Total += (element.Price * element.Amount)
        });
        return Total - Voucher
    }, [YourCard, Voucher])
    return (
        <div className={cx('master-container')}>
            <div className={cx('card', 'cart')}>
                <label className={cx('title')}>Your cart</label>
                <div className={cx('products')}>
                    {YourCard !== undefined ? (
                        (YourCard.map((product) => (
                            <div key={product.Id} className={cx('product')}>
                                <img src={`${process.env.REACT_APP_CALL_API}/api/v12/showimgproduct/${product.Img}`} />
                                <div className={cx('your_card_name')}>
                                    <span>{product.Name}</span>
                                </div>
                                <div className={cx('quantity')}>
                                    <button onClick={() => handleClickDecrease(product.Id)}>
                                        <svg fill="none" viewBox="0 0 24 24" height=".7vw" width=".7vw" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinejoin="round" strokeLinecap="2.5" stroke="#47484b" d="M20 12L4 12"></path>
                                        </svg>
                                    </button>
                                    <label>{product.Amount}</label>
                                    <button onClick={() => handleClickIncrease(product.Id)}>
                                        <svg fill="none" viewBox="0 0 24 24" height=".7vw" width=".7vw" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinejoin="round" strokeLinecap="2.5" stroke="#47484b" d="M12 4V20M20 12H4"></path>
                                        </svg>
                                    </button>
                                </div>
                                <label className={cx('price', 'small')}>{product.Price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫'}</label>
                            </div>
                        )))
                    ) : null}
                </div>
            </div>
            <div className={cx('card', 'checkout')}>
                <div className={cx('checkout--footer')}>
                    <label className={cx('price')}>{TotalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫'}</label>
                    <button onClick={() => handleClickPay()} className={cx('Btn')}>
                        Pay
                        <svg className={cx('svgIcon')} viewBox="0 0 576 512"><path d="M512 80c8.8 0 16 7.2 16 16v32H48V96c0-8.8 7.2-16 16-16H512zm16 144V416c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V224H528zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm56 304c-13.3 0-24 10.7-24 24s10.7 24 24 24h48c13.3 0 24-10.7 24-24s-10.7-24-24-24H120zm128 0c-13.3 0-24 10.7-24 24s10.7 24 24 24H360c13.3 0 24-10.7 24-24s-10.7-24-24-24H248z"></path></svg>
                    </button>
                </div>
            </div>
            <div onClick={handleClickRemovePay} ref={ModalForm} className={cx('modal_form')}>
                <div ref={modalCheckoutRef} onClick={(e) => e.stopPropagation(e)} className={cx('modal_form_container')}>
                    <div className={cx('card_cart')}>
                        <label className={cx('title')}>THANH TOÁN</label>
                        <div className={cx('steps')}>
                            <div className={cx('step')}>
                                <div className={cx('step-item')}>
                                    <div className={cx('Info_user')}>
                                        <h2>Thông tin nhận hàng</h2>
                                        {editUser ? (
                                            <h3 onClick={handleClickRemoveEdit}>Trở lại</h3>
                                        ) : (
                                            <h3 onClick={handleClickEditInfo}>Thay đổi</h3>
                                        )}
                                    </div>
                                    {editUser ? (
                                        <>
                                            <div className={cx('edit_infouser_container_name')}><FontAwesomeIcon style={{ paddingRight: '.8vw' }} icon={faUserRegular} />
                                                <input ref={valueName} placeholder="Tên" className={cx('input-style')} type="text" />
                                            </div>
                                            <p style={{ width: '100%' }}><FontAwesomeIcon style={{ paddingRight: '.8vw' }} icon={faPhone} /><input ref={valuePhone} placeholder="Số điện thoại" className={cx('input-style')} type="text" /></p>
                                            {ll === null ? (
                                                <div className={cx('address_content')}>
                                                    <FontAwesomeIcon style={{ paddingRight: '3.vư' }} icon={faLocationDot} />
                                                    <h4>Vui lòng chọn vị trí từ bản đồ !</h4>
                                                </div>
                                            ) : (
                                                <div className={cx('address_content')}>
                                                    <FontAwesomeIcon style={{ paddingRight: '.3vw' }} icon={faLocationDot} />
                                                    <h4>{ll}</h4>
                                                </div>
                                            )}
                                             <div className={cx('button_save_info')}>
                                  <button onClick={() => handleClickSaveInfo(ll)}>Lưu</button>
                              </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className={cx('edit_infouser_container_name')}><FontAwesomeIcon icon={faUserRegular} />
                                                <span style={{ marginLeft: '.4vw' }}>{userName}</span>
                                            </div>
                                            <p><FontAwesomeIcon style={{ marginRight: '.3vw' }} className={cx('icon_phone_plus')} icon={faPhone} />(84<FontAwesomeIcon className={cx('icon_phone_plus')} icon={faPlus} />){phone}</p>
                                            <p><FontAwesomeIcon icon={faLocationDot} style={{ marginRight: '.3vw' }} />{sessionStorage.getItem('Address')}</p>
                                        </>
                                    )}

                                </div>
                                <hr />
                                <>
                                    <span>Voucher</span>
                                    <div className={cx('check_voucher_container')}>
                                        <input ref={ContentVoucher} type="text" placeholder="Nhập mã giảm giá nếu có" className={cx('check_voucher_input')} />
                                        <button onClick={handleClickCheckVoucher} className={cx('btn_check')}> Check
                                        </button>
                                    </div>
                                    <hr />
                                    <div>
                                        <span>Phương Thức Thanh Toán</span>
                                        <div className={cx('pay_method_container')}>
                                            <input onChange={(e) => setPaymethod(e.target.value)} className={cx('pay_method_item_check')} type='radio' id="vnpay" name="paymethod" value="1" />
                                            <label htmlFor='vnpay' className={cx('pay_method_item')}>
                                                <img className={cx('pay_method_item_logo')} src={VNPAY} />
                                            </label>
                                            <input onChange={(e) => setPaymethod(e.target.value)} className={cx('pay_method_item_check')} type='radio' id="momo" name="paymethod" value="1" />
                                            <label htmlFor='momo' className={cx('pay_method_item')}>
                                                <img className={cx('pay_method_item_logo')} src={MOMO} />
                                            </label>
                                            <input onChange={(e) => setPaymethod(e.target.value)} className={cx('pay_method_item_check')} type='radio' id="here" name="paymethod" value="3" />
                                            <label htmlFor='here' className={cx('pay_method_item')}>
                                                <img className={cx('pay_method_item_logo')} src={HERE} />
                                            </label>
                                        </div>
                                        <div className={cx('pay_method_container')}>
                                            <div className={cx('pay_method_item_noti')}>
                                                <span>ZALO PAY</span>
                                            </div>
                                            <div className={cx('pay_method_item_noti')}>
                                                <span>MOMO</span>
                                            </div>
                                            <div className={cx('pay_method_item_noti')}>
                                                <span>Nhận Hàng</span>
                                            </div>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className={cx('promo')}>
                                        <span>Ghi chú</span>
                                        <form className={cx('form')}>
                                            <textarea ref={noteBill} style={{ resize: 'none' }} spellCheck={false} className={cx('input_field_note')} placeholder="Thêm ghi chú" type="text" />
                                        </form>
                                    </div>
                                    <hr />
                                </>
                                <div className={cx('check_out_info')}>
                                    <div className={cx('check_out_info_item')}>
                                        <span>Tổng tiền hàng:</span>
                                        <p>{TotalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫'}</p>
                                    </div>
                                    <div className={cx('check_out_info_item')}>
                                        <span>Voucher giảm giá:</span>
                                        <p>{Voucher.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫'}</p>
                                    </div>
                                    <div className={cx('check_out_info_item')}>
                                        <span>Phí vận chuyển:</span>
                                        <p>15.000đ</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={cx('card_checkout')}>
                            <div className={cx('footer')}>
                                <label className={cx('price')}>{TotalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫'}</label>
                                <div className={cx('container')}>
                                    <button onClick={handleClickCheckOut} className={cx('button')}>Đặt Hàng</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div onClick={(e) => e.stopPropagation()} className={cx('modal_map_container')}>
                <Map mapContainerRef={ModalMapRef} children={setLl} setDestination={setDestination} />
            </div>
        </div>
    );
}

export default memo(YourCard);