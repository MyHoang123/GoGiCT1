
import classNames from "classnames/bind"
import styles from "./DefaultLayout.module.scss"
import { IdElementProvider } from "./IdElementContext"
import Body from "./Body"
import Header1 from "./Head"
import Footer from "./Footer"
const cx = classNames.bind(styles)
function DefaultLayout() {
    return (
        <>
            <IdElementProvider>
                <div className={cx('Defaul')}>
                    <div className={cx('header')}>
                        <Header1 />
                    </div>
                    <div className={cx('body')}>
                        <Body />
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