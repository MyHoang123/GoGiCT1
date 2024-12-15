import './Table.scss'
import axios from 'axios'
import imgTable from '../../Asset/images/table.jpg';
import { ElementContextAdmin } from '../../components/Layout/AdminLayout'
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

function App() {
    const [bill, setBill] = useState(null);
    const [checkEdit, setCheckEdit] = useState(false);
    const [tables, setTables] = useState([])
    const [productsTable, setProductTable] = useState([])
    const [tableId, setTablesId] = useState()
    const [notiTable, setNotiTable] = useState([])
    const [notiContent, setnotiContent] = useState(null)
    // Ref
    const RefTable = useRef()
    const nameTable = useRef()
    const IdDelete = useRef()
    const headerDetalTable = useRef()
    const notificeRefTable = useRef([])
    const notiContentRef = useRef([])
    const { socketOrder, cookies } = useContext(ElementContextAdmin)
    // Các hàm xử lý
    const handleClickOpenTable = async (Id,Status) => {
        if(Status === 'Đang Dùng') {
            RefTable.current.classList.add('open')
            setTablesId(Id)
            try {
                const response =  await axios.get(`http://localhost:8000/api/v12/getproductbillordertable/${Id}?token=${cookies.get('AccessTokenAdmin')}`);
                if(response.data.massege === "Thanh cong") {
                    const {Data, ...resolve} = response.data.data
                    setBill(resolve)
                    setProductTable(JSON.parse(response.data.data.Data))    
                    notificeRefTable.current[Id].classList.remove('open')
                }
              } catch (error) {
                  console.error('Lỗi khi thêm sản phẩm:', error);
                  // Xử lý lỗi tại đây.
              }
        }
    }
    const handleClickRemoveShowBill = () => {
        RefTable.current.classList.remove('open')
    }
    const handleClickCheckBill = (IdDetail,Status) => {
        if(tableId !== null) {
            socketOrder.emit('updateProduct',IdDetail,tableId,Status)
            if(productsTable.length > 0) {
                const newArr = [...productsTable]
                newArr.forEach((product)=> {
                    if(product.IdDetail === IdDetail) {
                        product.Status = Status
                    }
                })
                setProductTable(newArr)
            }
        }
    }
    const handleSubmitCreateTable = useCallback(async (e) => {
        e.preventDefault()
        if(nameTable.current.value !== '') {
            try {
                const response =  await axios.post(`https://severgogi.onrender.com/api/v12/createtable`,{name: nameTable.current.value,token: cookies.get('AccessTokenAdmin')});
              if(response.data.massege === 'Thanh cong') {
                const newArr = [...tables]
                const table = {Id: response.data.data, Name: `Bàn Số ${nameTable.current.value}`,Status: 'Bàn Trống'}
                newArr.push(table)
                setTables(newArr)
              }
              } catch (error) {
                  console.error('Lỗi khi thêm sản phẩm:', error);
                  // Xử lý lỗi tại đây.
              }
            
        }
        else {
            alert('Vui lòng nhập số bàn')
        }
    },[tables])
    const handleSubmitDeleteTable = useCallback(async (e) => {
        e.preventDefault()
        if(IdDelete.current.value !== 0) {
            try {
                const response =  await axios.post(`https://severgogi.onrender.com/api/v12/deletetable`,{IdTable: IdDelete.current.value,token: cookies.get('AccessTokenAdmin')});
              if(response.data.massege === 'Thanh cong') {
                const result = tables.filter((table) => table.Id !== parseInt(IdDelete.current.value))
                setTables(result)
              }
              } catch (error) {
                  console.error('Lỗi khi thêm sản phẩm:', error);
                  // Xử lý lỗi tại đây.
              }
            
        }
        else {
            alert('Vui lòng chọn số bàn')
        }
    },[tables])
    const handleClickCheckout = () => {
        const newPrice = bill !== null ? bill.Price : 0
        socketOrder.emit('checkoutsuccess',newPrice, tableId,(data) => {
            if(data === 'Thanh cong') {
                handleClickRemoveShowBill()
                const newTable = [...tables]
                newTable.forEach((table) => {
                    if(table.Id === tableId) {
                        table.Status = 'Bàn Trống'
                    }
                })
                 setTables(newTable)
            }
        })
    }
    useEffect(() => {
        axios.all([
          axios.get('https://severgogi.onrender.com/api/v12/showtable'),
        ])
          .then(axios.spread((Table,) => {
            setTables(Table.data.data)
          }))
          .catch (err => {
              console.error()
            })
        },[notiContent])
    useEffect(() => {
        for(let i = 0 ; i < tables.length; i++) {
            for(let j = 0; j < notiTable.length; j++) {
                if(tables[i].Id === notiTable[j]) {
                    if(notiContent !== null) {
                        notiContentRef.current[tables[i].Id].innerText = `${notiContent}`
                        notificeRefTable.current[tables[i].Id].classList.add('open')
                    }
                }
                else {
                    notificeRefTable.current[tables[i].Id].classList.remove('open')
                }
            }
        }
    },[tables,notiTable])
    useEffect(() => {
        if(socketOrder !== null) {
            socketOrder.on('connectuser',(IdTable) => {
            const newArr = [...tables]
            newArr.forEach((table) => {
                if(table.Id === parseInt(IdTable)) {
                    table.Status = 'Đang Dùng'
                }
            })
            setTables(newArr)
            })
            socketOrder.on('repNewbill',(IdTable) => {
                const newId = parseInt(IdTable)
                if(notiContentRef.current[newId] !== null) {
                    notiContentRef.current[newId].innerText = `Có đơn hàng mới !`
                    notificeRefTable.current[newId].classList.add('open')
                }
            })
            return () => {
                socketOrder.off('connectuser')
            }
        }
    },[tables])
    useEffect(() => {
        if(socketOrder !== null) {
            socketOrder.on('checkoutuser',(IdTable) => {
                const newId = parseInt(IdTable)
                if(notiContentRef.current[newId] !== null) {
                    notiContentRef.current[newId].innerText = `Gọi thanh toán !`
                    notificeRefTable.current[newId].classList.add('open')
                }
            })
            return () => {
                socketOrder.off('checkoutuser')
            }
        }
    },[tables])
    const tableUser = useMemo(() => {
        let Count = 0
        for(let i = 0 ; i < tables.length; i++) {
            if(tables[i].Status === 'Bàn Trống') {
                Count += 1
            }
        }
        return Count
    },[notiContent,tables,notiTable])
    const totalPay = useMemo(() => {
        let totalAll = 0
        const VAT = 0.08
        if(bill !== null) {
            if(bill.nameType === '') {
                productsTable.forEach(product => {
                    if(product.Status === 1) {
                        totalAll = totalAll + product.Price
                    }
                });
                return [totalAll + (totalAll * VAT),totalAll]
            }
            else if (bill.Price > 0) {
                return [bill.Price + (bill.Price * 0.08),bill.Price]
            }
        }
        return [0,0]
     },[productsTable])
    return ( 
        <>
            <div className="Table_Container">
                <h1>Bàn</h1>
                <span className='Table_Container-qualitytable'>{tableUser}/{tables.length}</span>
                    <div className='Table_content'>
                        {tables.map((table,index) => (
                            <div onClick={() => handleClickOpenTable(table.Id,table.Status)} key={index} className='Table_item'>
                                <h2>{table.Name}</h2>
                                <img className='Table-icon' src={imgTable} />
                                <h2>{table.Status}</h2>
                                <div ref={e => notificeRefTable.current[table.Id] = e} className='notificeContent'>
                                    <span ref={e => notiContentRef.current[table.Id] = e} className='notificeBill'></span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className='btn_addtable'>
                        <button onClick={() => setCheckEdit(true)} type="button" className="button">
                        <span className="button__text">Chỉnh sửa</span>
                        <span className="button__icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" stroke="currentColor" height="24" fill="none" className="svg"><line y2="19" y1="5" x2="12" x1="12"></line><line y2="12" y1="12" x2="19" x1="5"></line></svg></span>
                        </button>
                    </div>
            </div>

            <div ref={RefTable} onClick={handleClickRemoveShowBill} className='modal_detailbillorder'>
                    <div onClick={(e) => e.stopPropagation()} className='detailbill_content'>
                        <div className='bill'>                          
                        <h1 ref={headerDetalTable}>{bill !== null ? bill.Name : null}</h1>  
                        <h2>{bill !== null ? bill.Price === 0 ? 'Gọi món': bill.nameType : null}</h2>
                        <div className='detailbill_container_products'>
                        {productsTable.length !== 0 ? (
                            (productsTable.map((product,index) => (
                                        <div key={index} className='bill_content-item'>
                                            <div className='bill_content-item-img'>
                                                <img src={`${process.env.REACT_APP_IP_SEVER}/api/v12/showimgproduct/${product.Img}`}/>
                                            </div>
                                            <div className='bill_content-item-product'>  
                                                <div className='Information'>
                                                    <h2>{product.Name}</h2>
                                                    <h3>Phân Loại: {product.NameCate}</h3>
                                                    <span style={{fontSize: '10px'}}>x{product.Quantity}</span>
                                                </div>
                                                <div className='price'>
                                                    <div className='price_item'>
                                                        {/* <h2 style={{color: product.Status === 0 ? '#3fb800' : product.Status === 0 ? '#afaf00' : '#ba3939'}}>{product.Status}</h2> */}
                                                        <span style={{fontSize: '14px'}}>{product.Price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫'}</span>
                                                    </div>
                                                </div>                    
                                                    <div className='button_detailproductOrder'>
                                                    <div className='button_container'> 
                                                        {(product.Status === 1 ? <div className='showdetail'><h2>Đã giao </h2></div> : null)}
                                                        {(product.Status === 2 ? <div className='showdetail'><h3>Đã hủy</h3></div> : null)}
                                                        {(product.Status === 0 ? <div className='showdetail'><button onClick={() => handleClickCheckBill(product.IdDetail,1)} className="button">Lên Món</button></div> : null)}
                                                        {(product.Status === 0 ? (<div className='delete'><button onClick={() => handleClickCheckBill(product.IdDetail,2)}  className="button">Từ chối</button></div>) : null)}
                                                        </div>
                                                    </div>
                                            </div>             
                                        </div>
                            )))
                        ) : (
                            <h1>Khong tìm thấy sản phẩm</h1>
                        )}
                        </div>
                            </div>
                        <div className='detailbill_content-footer'>
                                        <div className='detailbill_content-footer_price'>
                                            <div className='price_container'>
                                                <span className='price_container-item'>Giá:</span>
                                                <span className='price_container-item'>{totalPay[1].toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫'}</span>
                                            </div>
                                            <div className='price_container'>
                                                <span className='price_container-item'>VAT:</span>
                                                <span className='price_container-item'>8%</span>
                                            </div>
                                            <div className='price_container'>
                                                <span className='price_container-item'>Tổng cộng:</span>
                                                <span className='price_container-item'>{totalPay[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫'}</span>
                                            </div>
                                        </div>
                                    <div onClick={handleClickCheckout} className='button_checkout_billorder'>
                                        <button className="comic-button">Đã Thanh Toán</button>
                                    </div>
                        </div>

                    </div>
            </div>
            <div onClick={() => setCheckEdit(false)} className={checkEdit ? 'modal_edittable open' : 'modal_edittable'}>
                    <div className="wrapper_edittable">
                            <div onClick={e => e.stopPropagation()} className="card-switch">
                                <label className="switch">
                                <input type="checkbox" className="toggle"/>
                                <span className="slider_edittable"></span>
                                <span className="card-side"></span>
                                <div className="flip-card__inner">
                                    <div className="flip-card__front">
                                        <div className="title">Xóa bàn</div>
                                        <form onSubmit={e => handleSubmitDeleteTable(e)} className="flip-card__form" action="">
                                        <select ref={IdDelete} className='createqr_content-type_table'>
                                            <option value='0'>Chọn bàn</option>
                                            {tables.map((table) => (
                                                <option key={table.Id} value={table.Id}>{table.Name}</option>
                                            ))}
                                        </select>
                                            <button type='submit' className="flip-card__btn">Let`s go!</button>
                                        </form>
                                    </div>
                                    <div className="flip-card__back">
                                        <div className="title">Thêm bàn</div>
                                        <form onSubmit={e => handleSubmitCreateTable(e)} className="flip-card__form" action="">
                                            <input ref={nameTable} className="flip-card__input" placeholder="Số bàn" type="number"/>
                                            <button className="flip-card__btn">Confirm!</button>
                                        </form>
                                    </div>
                                </div>
                                </label>
                            </div>   
                    </div>
                </div>

        </>
     );
}

export default App;