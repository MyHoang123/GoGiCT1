
import {MemoizedHeaderBody, MemoizedLogoResource} from "./HeaderBody";
import Categoris from "./products/Categories";
import Products from "./products/Products"
import DetailProduct from "./DetailProduct";
import SlideImgPage from "./SlideImgPage";
import PageNews from "./PageNews";
import classNames from "classnames/bind";
import styles from "./BodyLayout.module.scss";
import { memo, useRef } from "react";
const cx = classNames.bind(styles);

function Body( {Animation} ) {
    const ModalDetail = useRef()
    const ALLStar = useRef()
    return (
        <div ref={e => Animation.current[1] = e} className={cx('Body_container')}>
            <MemoizedHeaderBody cx={cx} />
            <div className={cx('Body_container_contain')}>
                <div className={cx('Body_container_contain_categories')}>
                    <Categoris cx = {cx} />
                </div>
                <div className={cx('Body_container_contain_products')}>
                    <Products ALLStar = {ALLStar} ModalDetail = {ModalDetail} cx = {cx} />
                </div>
            </div>
            <SlideImgPage cx = {cx} />
            <MemoizedLogoResource cx = {cx} />
            <PageNews cx = {cx} />
            <DetailProduct ALLStar = {ALLStar} ModalDetail = {ModalDetail} cx = {cx} />
        </div>
    );
}

export default memo(Body);