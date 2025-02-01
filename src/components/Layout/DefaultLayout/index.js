
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBagShopping} from '@fortawesome/free-solid-svg-icons';
import { Header } from "./Header";
import { useState, useRef, useEffect, memo } from "react";
import { useSelector } from 'react-redux';
import { lenghtCard } from './Body/reduxBody/BodySelector';
import { Link } from 'react-router-dom';
import Chat from './chat'
import BodyLayout from "./Body"
import Footer from "./Footer"
import LogoMenu from '../../../Asset/images/gia-menu-gogi-house-221122-removebg-preview.png'
import classNames from "classnames/bind";
import styles from "./DefaultLayout.module.scss";
import styles2 from "./Header/Header.module.scss"
import styles3 from "./Body/BodyLayout.module.scss"
const cx = classNames.bind(styles);
const cv = classNames.bind(styles2);
const cb = classNames.bind(styles3);

function DefaultLayout() {
    const LenghtCard = useSelector(lenghtCard)
    const [indexSlide, setIndexSlide] = useState([0, 1, 2, 3, 4, 5])
    const [socket, setSocket] = useState(null)
    const Animation = useRef([])
    const anchoring = useRef()
    const buttonAction = useRef()
    const getSocket = (socket) => {
        setSocket(socket)
    }
    useEffect(() => {
        function pxToVw(px) {
            const viewportWidth = window.innerWidth;
            return (px / viewportWidth) * 100;
        }
        const handleScroll = () => {
            const top = Math.abs(anchoring.current.getBoundingClientRect().top)
            const value = pxToVw(top)
            if (value < 52 && value > 1) {
                buttonAction.current.style.pointerEvents = 'none'
                Animation.current[0].classList.add(cv('animation_medium'))
                Animation.current[0].classList.remove(cv('animation_low'))
            }
            else if (value > 52) {
                if (value > 119) {
                    Animation.current[1].classList.add(cb('animation_heighlow'))
                }
                Animation.current[2].classList.add(cv('animation_low'))
                Animation.current[0].classList.add(cv('animation_low'))
            }
            else {
                Animation.current[0].classList.remove(cv('animation_low'))
                Animation.current[0].classList.remove(cv('animation_medium'))
                Animation.current[1].classList.remove(cb('animation_heighlow'))
                Animation.current[2].classList.remove(cv('animation_low'))
                buttonAction.current.style.pointerEvents = 'auto'
            }
        }
        window.addEventListener('scroll', handleScroll)
        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])
    return (
        <div className={cx('wrapper')}>
                <Header getSocket = { getSocket } setIndexSlide={setIndexSlide} indexSlide={indexSlide} Animation={Animation} anchoring={anchoring} buttonAction={buttonAction} />
                <img style={{ width: '100%' }} className={cx('Logo_Menu')} src={LogoMenu} />
                <BodyLayout Animation={Animation} />
                <Footer />
                <div datacount={LenghtCard} className={cx('cart_product-container')}>
                    <Link to="/card">
                        <FontAwesomeIcon className={cx('cart_product-icon')} icon={faBagShopping} />
                    </Link>
                </div>
                <Chat cx = {cx} socket = {socket} />
        </div>
    )
}

export default memo(DefaultLayout);