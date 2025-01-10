import axios from 'axios'
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import Map from './map'
import VNPAY from '../../../Asset/images/R.png'
import MOMO from '../../../Asset/images/MOMO.png'
import HERE from '../../../Asset/images/HEREPAY.jpg'
import { Cookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom'
import { memo, useRef, useState, useEffect, useMemo } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faMinus, faLocationDot, faPhone } from '@fortawesome/free-solid-svg-icons'
import { faUser as faUserRegular } from '@fortawesome/free-regular-svg-icons';
function Youcard({ CheckCard, setCheckCard, cards, noteRef, cx, socket }) {
    const cookie = new Cookies
    const navigate = useNavigate()
    const [distance, setDistance] = useState(0);
    const [voucher, setVoucher] = useState(0)
    const [modalCheckout, setModalCheckout] = useState(false)
    const [ll, setLl] = useState(null)
    const [modalMap, setModalMap] = useState(false)
    const [payMethod, setPaymethod] = useState(null)
    const [editInfo, setEditInfo] = useState(false);
    const [address, setAddress] = useState(sessionStorage.getItem('Address') !== null ? sessionStorage.getItem('Address') : '')
    const [userName, setUserName] = useState(cookie.get('AccessToken') !== undefined ? JSON.parse(localStorage.getItem('Account')).UserName : '')
    const [phone, setPhone] = useState(cookie.get('AccessToken') !== undefined ? JSON.parse(localStorage.getItem('Account')).Sdt : '')
    const [destination, setDestination] = useState(sessionStorage.getItem('destination') !== null ? sessionStorage.getItem('destination') : '')
    const quantityProductPay = useRef([])
    const valuePhone = useRef()
    const valuePhoneNew = useRef()
    const valueName = useRef()
    const vouchertext = useRef()
    const modalCheckoutRef = useRef()
    const noteBill = useRef()
    async function checkvoucher(voucher) {
        try {
            const response = await axios.post(`${process.env.REACT_APP_CALL_API}/api/v12/checkvoucher`, voucher)
            if (response.data.massege === "voucher khong ton tai") {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Voucher không hợp lệ !",
                    footer: '<a href="#">Why do I have this issue?</a>'
                });
                setVoucher(0)
            }
            else {
                Swal.fire({
                    icon: "success",
                    title: "Thành công",
                    text: `- ${response.data.data[0].PriceVoucher.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫'}`,
                    footer: '<a href="#">Why do I have this issue?</a>'
                });
                setVoucher(response.data.data[0].PriceVoucher)
            }
        } catch (error) {
            console.error('Lỗi khi thêm sản phẩm:', error);
        }
    }
    async function CreateBill(Bill) {
        try {
            const response = await axios.post(`${process.env.REACT_APP_CALL_API}/api/v12/createbill`, Bill)
            console.log("🚀 ~ CreateBill ~ response:", response)
            if (response.data.massege === 'Thanh cong') {
                const swalWithBootstrapButtons = Swal.mixin({
                    customClass: {
                        confirmButton: "btn btn-success",
                        cancelButton: "btn btn-danger"
                    },
                    buttonsStyling: false
                });
                swalWithBootstrapButtons.fire({
                    title: "Success!",
                    text: "Cảm ơn bạn đã đặt hàng",
                    icon: "success"
                }).then((result) => {
                    if (result.isConfirmed) {
                        socket.emit('newBill')
                        navigate('/purchase')
                    }
                    else {
                        socket.emit('newBill')
                        navigate('/purchase')
                    }
                })
            } else if (response.data.massege === 'Thanh Toan') {
                socket.emit('newBill')
                window.location.href = response.data.url
            }
            else if (response.data.massege === 'OFF') {
                Swal.fire({
                    icon: "error",
                    title: "Nhà hàng chưa mở cửa",
                    text: "Open 9h30-23h !",
                    footer: '<a href="#">Why do I have this issue?</a>'
                });
            }
            else if (response.data.massege === 'Sai so dien thoai') {
                Swal.fire({
                    icon: "error",
                    title: "Số điện thoại sai !",
                    text: "Số điện thoại không bao gòm số 0",
                    footer: '<a href="#">Why do I have this issue?</a>'
                });
            }
            else if (response.data.massege === 'Vi tri sai') {
                Swal.fire({
                    icon: "error",
                    title: "Không tìm thấy địa chỉ",
                    text: "Vui lòng cho phép truy cập vị trí",
                    footer: '<a href="#">Why do I have this issue?</a>'
                });
            }
        } catch (error) {
            alert('Có lõi xảy ra vui lòng thử lại')
        }
    }
    const handleClickRemoveModalCheckout = () => {
        setModalCheckout(false)
        setModalMap(false)
        modalCheckoutRef.current.style.transform = ''
    }
    const handleClickNextPay = (id, i, CheckCard, cards) => {
        let quantity = parseInt(quantityProductPay.current[i].innerText)
        quantity += 1
        quantityProductPay.current[i].innerText = `${quantity}`
        const newArr = [...CheckCard]
        for (let j = 0; j < cards.length; j++) {
            if (id === cards[j].Id) {
                newArr[i].Price = quantity * cards[j].Price
            }
        }
        setCheckCard(newArr)
    }
    const handleClickEditInfo = () => {
        setEditInfo(true)
        setModalMap(true)
        modalCheckoutRef.current.style.transform = 'translateX(-210px)'
    }
    const handleClickRemoveEdit = () => {
        setEditInfo(false)
        setModalMap(false)
        setAddress(sessionStorage.getItem('Address'))
        setDestination(sessionStorage.getItem('destination'))
        modalCheckoutRef.current.style.transform = 'translateX(0px)'
    }
    const handleClickSaveInfo = (ll) => {
        if (ll !== null) {
            setAddress(ll)
        }
        setUserName(valueName.current.value)
        setPhone(valuePhone.current.value)
        setEditInfo(false)
        setModalMap(false)
        modalCheckoutRef.current.style.transform = 'translateX(0px)'
    }
    const handleClickCheckOut = () => {
        if (payMethod === '3') {
            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                    confirmButton: "btn btn-success",
                    cancelButton: "btn btn-danger"
                },
                buttonsStyling: false
            });
            swalWithBootstrapButtons.fire({
                title: "Giao tại",
                text: `${address}`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Đồng ý",
                cancelButtonText: "Từ chối",
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    const result = CheckCard.reduce((acc, curr, index) => {
                        if (noteRef.current[index].value.length === 0) {
                            const temporary = {
                                Id: curr.Id,
                                Price: curr.Price
                            }
                            return [...acc, temporary]
                        }
                        else {
                            const temporary = {
                                Id: curr.Id,
                                Price: curr.Price,
                                Note: noteRef.current[index].value
                            }
                            return [...acc, temporary]
                        }
                    }, [])
                    const bill = {
                        TotalPrice: totalPay[1],
                        Data: result,
                        Address: address,
                        Name: userName,
                        Sdt: valuePhoneNew.current === undefined ? phone : valuePhoneNew.current.value,
                        Destination: destination,
                        Note: noteBill.current.value,
                        PayMethod: payMethod,
                        token: cookie.get('AccessToken')
                    }
                    CreateBill(bill)
                }
            })
        }
        else {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Đang bảo trì !",
                footer: '<a href="#">Why do I have this issue?</a>'
            });
        }
    }
    const handleClickPrevPay = (id, i, CheckCard, cards) => {
        let quantity = parseInt(quantityProductPay.current[i].innerText)
        if (quantity <= 1) {
            quantity = 1
        }
        else {
            quantity -= 1
        }
        quantityProductPay.current[i].innerHTML = `${quantity}`
        const newArr = [...CheckCard]
        for (let j = 0; j < cards.length; j++) {
            if (id === cards[j].Id) {
                newArr[i].Price = quantity * cards[j].Price
            }
        }
        setCheckCard(newArr)
    }
    const handleClickPay = (Check) => {
        if (JSON.parse(localStorage.getItem('Account')) !== null) {
            if (Check > 0) {
                setModalCheckout(true)
            }
            else {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Vui lòng chọn sản phẩm !",
                    footer: '<a href="#">Why do I have this issue?</a>'
                });
            }
        }
        else {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Vui lòng đăng nhập",
                footer: '<a href="#">Why do I have this issue?</a>'
            });
        }
    }
    const handleCheckVoucher = () => {
        const voucher = {
            voucher: vouchertext.current.value,
            token: cookie.get('AccessToken')
        }
        checkvoucher(voucher)
    }
    useEffect(() => {
        if (destination !== '') {
            const start = destination.split(',')
            const end = ['10.045260', '105.780017']
            axios.all([
                axios.get(`https://api.mapbox.com/directions/v5/mapbox/driving/${start[1]}%2C${start[0]}%3B${end[1]}%2C${end[0]}?alternatives=true&geometries=geojson&language=en&overview=full&steps=true&access_token=pk.eyJ1IjoibXlob2FuZzEyMyIsImEiOiJjbTFlZzF2d2cydWR0MmtvajFwYnB5OW42In0.-CeNZom6cnNBEsAWVumPuQ`),
            ])
                .then(axios.spread((Distance) => {
                    if (Distance.data.code === "Ok") {
                        setDistance(Distance.data.routes[Distance.data.routes.length - 1].distance)
                    }
                }))
                .catch(err => {
                    console.error()
                })
        }
    }, [destination])
    const totalPay = useMemo(() => {
        let total = 0
        let totalAll = 0
        let totalShip = 0
        for (let i = 0; i < CheckCard.length; i++) {
            total = total + CheckCard[i].Price
        }
        totalShip = Math.round(distance / 1000) * 4500
        totalAll = (total + totalShip) - voucher
        return [total, totalAll, totalShip]
    }, [CheckCard, voucher, distance])
    return (
        <>
            <div className='model_pay'>
                <div className="master-container">
                    <div className="card_pay cart_pay">
                        <label className="title_cartpay">Your cart</label>
                        {CheckCard.map((product, i) => (
                            <div key={i} className="products_cartpay">
                                <div className="product_cartpay">
                                    <div className='product_cartpay_img'>
                                        <img className="product_cartpay_img" src={`${process.env.REACT_APP_CALL_API}/api/v12/showimgproduct/${product.Img}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <div>
                                        <div className='name_pay'>
                                            <span>{product.Name}</span>
                                        </div>
                                    </div>

                                    <div className="quantity_cartpay">
                                        <button onClick={() => handleClickPrevPay(product.Id, i, CheckCard, cards)}>
                                            <FontAwesomeIcon icon={faMinus} />
                                        </button>
                                        <label ref={e => quantityProductPay.current[i] = e}>1</label>
                                        <button onClick={() => handleClickNextPay(product.Id, i, CheckCard, cards)}>
                                            <FontAwesomeIcon icon={faPlus} />
                                        </button>
                                    </div>
                                    <label className="price_cartpay small_cartpay">{product.Price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫'}</label>
                                    <textarea ref={(e) => noteRef.current[i] = e} className={cx('note_card')} placeholder='Thêm ghi chú'></textarea>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="card_pay checkout_cartpay">

                        <div className="checkout--footer_cartpay">
                            <label className="price_cartpay">{totalPay[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫'}
                            </label>
                            <button onClick={() => handleClickPay(CheckCard.length)} style={{ fontSize: '16px' }} className="Btn">
                                Pay
                                <svg className="svgIcon" viewBox="0 0 576 512"><path d="M512 80c8.8 0 16 7.2 16 16v32H48V96c0-8.8 7.2-16 16-16H512zm16 144V416c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V224H528zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm56 304c-13.3 0-24 10.7-24 24s10.7 24 24 24h48c13.3 0 24-10.7 24-24s-10.7-24-24-24H120zm128 0c-13.3 0-24 10.7-24 24s10.7 24 24 24H360c13.3 0 24-10.7 24-24s-10.7-24-24-24H248z"></path></svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div onClick={handleClickRemoveModalCheckout} className={modalCheckout ? cx('modal_form_open') : cx('modal_form')}>
                <div className={cx('modal_form_container')}>
                    <div ref={modalCheckoutRef} onClick={(e) => e.stopPropagation()} className={modalMap ? cx('container_open') : cx('container')}>
                        <div className={cx('card_cart')}>
                            <label className={cx('title')}>THANH TOÁN</label>
                            <div className={cx('steps')}>
                                <div className={cx('step')}>
                                    <div className={cx('step-item')}>
                                        <div className={cx('Info_user')}>
                                            <span>Thông tin nhận hàng</span>
                                            {editInfo ? (
                                                <h3 onClick={() => handleClickRemoveEdit()}>Trở lại</h3>
                                            ) : (
                                                <h3 onClick={() => handleClickEditInfo()}>Thay đổi</h3>
                                            )}
                                        </div>
                                        {editInfo ? (
                                            <>
                                                <div className={cx('edit_infouser_container_name')}><FontAwesomeIcon style={{ paddingRight: '10px' }} icon={faUserRegular} />
                                                    <input ref={valueName} placeholder="Tên" className={cx('input-style')} type="text" />
                                                </div>
                                                <p style={{ width: '100%' }}><FontAwesomeIcon style={{ paddingRight: '8px' }} icon={faPhone} /><input ref={valuePhone} placeholder="Số điện thoại" className={cx('input-style')} type="text" /></p>
                                                {ll === null ? (
                                                    <div className={cx('address_content')}>
                                                        <FontAwesomeIcon style={{ paddingRight: '8px' }} icon={faLocationDot} />
                                                        <h4>Vui lòng chọn vị trí từ bản đồ !</h4>
                                                    </div>
                                                ) : (
                                                    <div className={cx('address_content')}>
                                                        <FontAwesomeIcon style={{ paddingRight: '8px' }} icon={faLocationDot} />
                                                        <h4>{ll}</h4>
                                                    </div>
                                                )}
                                                <div className={cx('button_save_info')}>
                                                    <button onClick={() => handleClickSaveInfo(ll)}>Lưu</button>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className={cx('edit_infouser_container_name')}><FontAwesomeIcon style={{ paddingRight: '10px' }} icon={faUserRegular} />
                                                    <span>{userName}</span>
                                                </div>
                                                <p style={{ width: '100%' }}><FontAwesomeIcon style={{ paddingRight: '8px' }} icon={faPhone} />(84<FontAwesomeIcon style={{ padding: '0', fontSize: '8px', paddingBottom: '1px' }} icon={faPlus} />){phone !== 0 ? phone : (<input ref={valuePhoneNew} placeholder="Số điện thoại" className={cx('input-style')} type="text" />)}</p>
                                                <p><FontAwesomeIcon style={{ paddingRight: '8px' }} icon={faLocationDot} />{address}</p>
                                            </>
                                        )}
                                    </div>
                                    <hr />
                                    <>
                                        <span>Voucher</span>
                                        <div className={cx('check_voucher_container')}>
                                            <input ref={vouchertext} type="text" placeholder="Nhập mã giảm giá nếu có" className={cx('check_voucher_input')} />
                                            <button onClick={() => handleCheckVoucher()} className={cx('btn_check')}> Check
                                            </button>
                                        </div>
                                        <hr />
                                        <div>
                                            <span>Phương Thức Thanh Toán</span>
                                            <div className={cx('pay_method_container')}>
                                                <input checked={payMethod === '1'} onChange={(e) => setPaymethod(e.target.value)} className={cx('pay_method_item_check')} type='radio' id="vnpay" name="paymethod" value="1" />
                                                <label htmlFor='vnpay' className={cx('pay_method_item')}>
                                                    <img className={cx('pay_method_item_logo')} src={VNPAY} />
                                                </label>
                                                <input checked={payMethod === '2'} onChange={(e) => setPaymethod(e.target.value)} className={cx('pay_method_item_check')} type='radio' id="momo" name="paymethod" value="2" />
                                                <label htmlFor='momo' className={cx('pay_method_item')}>
                                                    <img style={{ height: '30px' }} className={cx('pay_method_item_logo')} src={MOMO} />
                                                </label>
                                                <input checked={payMethod === '3'} onChange={(e) => setPaymethod(e.target.value)} className={cx('pay_method_item_check')} type='radio' id="here" name="paymethod" value="3" />
                                                <label htmlFor='here' className={cx('pay_method_item')}>
                                                    <img style={{ height: '30px', width: '50px' }} className={cx('pay_method_item_logo')} src={HERE} />
                                                </label>
                                            </div>
                                            <div style={{ margin: '0' }} className={cx('pay_method_container')}>
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
                                        <div className="promo">
                                            <span>Ghi chú</span>
                                            <form className="form">
                                                <textarea spellCheck={false} ref={noteBill} className={cx('input_field_note')} placeholder="Thêm ghi chú" type="text" />
                                            </form>
                                        </div>
                                        <hr />
                                    </>
                                    <div className={cx('check_out_info')}>
                                        <div className={cx('check_out_info_item')}>
                                            <span>Tổng tiền hàng:</span>
                                            <p>{totalPay[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫'}</p>
                                        </div>
                                        <div className={cx('check_out_info_item')}>
                                            <span>Voucher giảm giá:</span>
                                            <p>{voucher.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫'}</p>
                                        </div>
                                        <div className={cx('check_out_info_item')}>
                                            <span>Phí vận chuyển:</span>
                                            <p>{totalPay[2].toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={cx('card_checkout')}>
                                <div className={cx('footer')}>
                                    <label className={cx('price')}>{totalPay[1].toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫'} </label>
                                    <div className={cx('container')}>
                                        <button onClick={handleClickCheckOut} className={cx('button')}>Đặt Hàng</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {modalCheckout ? (
                        <div onClick={(e) => e.stopPropagation()} style={modalMap ? { display: 'block' } : { display: 'none' }} className={cx('modal_map_container')}>
                            <Map children={setLl} setDestination={setDestination} />
                        </div>
                    ) : null}
                </div>
            </div>
        </>
    );
}

export default memo(Youcard);