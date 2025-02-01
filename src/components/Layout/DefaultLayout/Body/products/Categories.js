
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListUl } from '@fortawesome/free-solid-svg-icons';
import { Fragment, useRef, useState, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listCategoris, listTypes } from '../reduxBody/BodySelector';
import { filterCategoris } from '../reduxBody/BodySlice';
function Categoris({ cx }) {
    const dispatch = useDispatch()
    const categoris = useSelector(listCategoris)
    const types = useSelector(listTypes)
    const [Active, setActive] = useState(null)
    const [ActiveType, setActiveTye] = useState(null)
    const CheckCategori = useRef([])
    const CheckType = useRef([])
    const handleOnClickCategori = (cate) => {
        CheckCategori.current.forEach((element, index) => {
            if (index === cate) {
                element.classList.add(cx('active'))
                setActive(cate)
            }
            else {
                element.classList.remove(cx('active'))
            }
            if (cate === Active) {
                element.classList.remove(cx('active'))
                setActive(null)
            }
        });
    }
    const handleOnClickType = (type) => {
        CheckType.current.forEach((element, index) => {
            if (index === type) {
                element.classList.add(cx('active'))
                setActiveTye(type)
            }
            else {
                element.classList.remove(cx('active'))
            }
            if (type === ActiveType) {
                element.classList.remove(cx('active'))
                setActiveTye(null)
            }
        });
    }
    const handleClickFilterCategori = (Id) => {
        const Filter = {
            IdType: null,
            IdCate: Id
        }
        dispatch(filterCategoris(Filter))
    }
    const handleClickFilterProduct = (IdType, Idcate) => {
        const Filter = {
            IdType: IdType,
            IdCate: Idcate
        }
        dispatch(filterCategoris(Filter))
    }
    const handleClickAll = () => {
        const Filter = {
            IdType: null,
            IdCate: null,
        }
        dispatch(filterCategoris(Filter))
    }
    return (
        <div className={cx('Categoris_Container')}>
            <div className={cx('Categoris_Container_header')}>
                <FontAwesomeIcon className={cx('Categoris_Container_header-icon')} icon={faListUl} />
                <h2>DANH MỤC SẢN PHẨM</h2>
            </div>
            <div className={cx('Categoris_Container_header-body')}>
                <div className={cx('panel')}>
                    <label onClick={() => handleOnClickCategori(0)} className={cx('accordion')} htmlFor='Title_categori'>Gọi món</label>
                    <input className={cx('panel_title')} id='Title_categori' type='checkbox' />
                    <ul ref={e => CheckCategori.current[0] = e} className={cx('panel_item')}>
                        {categoris.map((cate) => (
                            <Fragment key={cate.Id}>
                                <li onClick={() => handleClickFilterCategori(cate.Id)}>{cate.Name}</li>
                            </Fragment>
                        ))}
                    </ul>
                </div>
                <div className={cx('panel')}>
                    <label onClick={() => handleOnClickCategori(1)} className={cx('accordion')} htmlFor='Title_categori'>Buffet</label>
                    <input className={cx('panel_title')} id='Title_categori' type='checkbox' />
                    <ul ref={e => CheckCategori.current[1] = e} className={cx('panel_item')}>
                        {Object.keys(types).map((key, i) => (
                            <div key={i} className={cx('panel')}>
                                <label  onClick={() => handleOnClickType(i)} style={{ paddingLeft: '2vw' }} className={cx('accordion')} htmlFor='Title_categori'>{key}</label>
                                <input className={cx('panel_title')} id='Title_categori' type='checkbox' />
                                <ul ref={e => CheckType.current[i] = e} className={cx('panel_item')}>
                                    {types[key].map((cate,i) => (
                                        <Fragment key={i}>
                                            <li onClick={() => handleClickFilterProduct(cate.IdType,cate.IdCate)}>{cate.NameCate}</li>
                                        </Fragment>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </ul>
                </div>
                <div className={cx('panel')}>
                    <label onClick={() => handleOnClickCategori(2)} className={cx('accordion')} htmlFor='Title_categori'>Combo</label>
                    <input className={cx('panel_title')} id='Title_categori' type='checkbox' />
                    <ul ref={e => CheckCategori.current[2] = e} className={cx('panel_item')}>
                        <li>...</li>
                        <li>...</li>
                        <li>...</li>
                    </ul>
                </div>
                <div className={cx('panel')}>
                    <label onClick={handleClickAll} className={cx('accordion')} htmlFor='Title_categori'>Tất cả</label>
                    <input className={cx('panel_title')} id='Title_categori' type='checkbox' />
                </div>
            </div>
        </div>
    );
}

export default memo(Categoris);