import Accordion from 'react-bootstrap/Accordion';
import {memo, useRef} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { listCategoris } from './BodySelector';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListUl, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { filterCategoris } from './BodySlice';
function Categoris() {
    const dispatch = useDispatch()
    const categoris = useSelector(listCategoris)
    const iconMenuArrow = useRef([])
    const handleClickFilterCategori = (Id) => {
        const Filter = {
            IdType: null,
            IdCate: Id
        }
         dispatch(filterCategoris(Filter))
    }
    const handleClickFilterProduct = (IdType,Idcate) => {
        const Filter = {
            IdType: IdType,
            IdCate:Idcate
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
        <nav className={`category`}>
        <h3 className={`category_heading`}>
          <FontAwesomeIcon className={'category_heading-icon'} icon={faListUl} />
            Danh mục Sản Phẩm
        </h3>
        <ul className={'category-list'}>
                 <Accordion>
                {categoris.Menu.map((value,index)=>(
                <Accordion.Item style={{width: '100%',position:'relative', border:'none'}} key={index} eventKey={index}>
                    <Accordion.Header style={{position: 'relative'}}  className={'category-item__link'}> <span style={{fontWeight: '500',zIndex: '10'}}>{value.Name}</span> </Accordion.Header>
                        <Accordion.Body>
                            <ul key={index} className={'category-list-item'}>
                                <Accordion  key={value.Id}>
                                {categoris.Type.map((valueType,indexType) => {
                                    if(value.Id === valueType.IdMenu) {
                                        if(!valueType.Name.trim()) {
                                            return (
                                            <ul key={indexType} className={'category-list-item'}>
                                                    {categoris.categori.map((valueCate,IndexCate) => (
                                                        <li onClick={() => handleClickFilterCategori(valueCate.Id)} style={{fontWeight: '400'}} key={IndexCate}>{valueCate.Name}</li>
                                                    ))}
                                                </ul>
                                            )
                                        }
                                        else {
                                       return (
                                                    <Accordion.Item key={indexType} eventKey={indexType} style={{border:'none'}}>
                                                        <Accordion.Header className={'category-item__link'}><span style={{fontSize: '12px',fontWeight: '600'}} key={indexType}>{valueType.Name}</span></Accordion.Header>
                                                            <Accordion.Body>
                                                            <ul key={indexType} className={'category-list-item'}>
                                                                    {categoris.detailType.map((valueDetailType,IndexDetailType) => (
                                                                        (valueType.Id === valueDetailType.IdType ? (                                                                                 
                                                                              <ul key={IndexDetailType} style={{fontSize: '10px'}} className={'category-list-item'}>
                                                                                {categoris.categori.map((valuaCate,indexCate) => (
                                                                                    (valuaCate.Id === valueDetailType.IdCategoris ? (
                                                                                            <li onClick={() => handleClickFilterProduct(valueDetailType.IdType,valuaCate.Id)} style={{fontWeight: '400'}} key={indexCate}>{valuaCate.Name}</li>
                                                                                    ) : null )
                                                                                     ))}
                                                                               </ul>                                                                      
                                                                        ) : null)
                                                                    ))}                                                                                                                                                        
                                                                </ul>
                                                            </Accordion.Body>
                                                    </Accordion.Item>
                                                )          
                                            }                                                                 
                                        }else {
                                            return null
                                        }
                                      })}                                                                                                   
                                    </Accordion>
                                </ul>
                                                    
                            </Accordion.Body>
                    </Accordion.Item>
                        ))}
                </Accordion>
                <li className={'category-item'}>     
                    <h3 onClick={handleClickAll} className={'category-item__link'}>Tất cả</h3>
                </li>                            
            </ul>
    </nav>

     );
}

export default memo(Categoris);