
import classNames from "classnames/bind"
import styles from "./DefaultLayout.module.scss"
import { IdElementProvider } from "./IdElementContext"
import { useLocation } from 'react-router-dom'
import Body from "./Body"
import Header1 from "./Head"
import Footer from "./Footer"
import { useCallback, useState, useEffect, useRef } from "react"

const cx = classNames.bind(styles)

function DefaultLayout() {
    const location = useLocation()
    const [Loading, setLoading] = useState(false)
    const loading = cx('loading_clien', {
        unactive: Loading
    })
    useEffect(() => {
        if(sessionStorage.getItem('load') !== undefined) {
            setLoading(sessionStorage.getItem('load'))
        }
        const handleLoad = () => {
            setLoading(true)
            sessionStorage.setItem('load',true)
          };
          window.addEventListener('load', handleLoad);
          // Dọn dẹp event listener khi component unmount
          return () => {
            window.removeEventListener('load', handleLoad);
          };
    },[location])
    return (
        <>
        <div className={loading}>
            <div className={cx('loading_container')}>
                <div className={cx('loader')}>
                <div className={cx('panWrapper')}>
                    <div className={cx('pan')}>
                    <div className={cx('food')}></div>
                    <div className={cx('panBase')}></div>
                    <div className={cx('panHandle')}></div>
                    </div>
                    <div className={cx('panShadow')}></div>
                </div>
            </div>
        </div>
        </div>
        <IdElementProvider>
            <div className={cx('Defaul')}>
                <div className={cx('header')}>
                    <Header1 />
                    </div>
                <div className={cx('body')}>
                    <Body/>
                </div>
                <div className={cx('footer')}>
                    <Footer />
                </div>
            </div>
        </IdElementProvider>
        </>
    )
}

export default DefaultLayout;