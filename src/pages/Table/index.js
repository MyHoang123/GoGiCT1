import './Table.scss'
import axios from 'axios'
import imgTable from '../../Asset/images/table.jpg';
import { ElementContextAdmin } from '../../components/Layout/AdminLayout'
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { tab } from '@testing-library/user-event/dist/tab';
import { Details } from 'devextreme-react/cjs/file-manager';
function App() {
    const [socket, setSocket] = useState(null);
    const [tables, setTables] = useState([])
    const [productsTable, setProductTable] = useState([])
    const [tableId, setTablesId] = useState()
    const [checkTable, setCheckTable] = useState()
    const [detailProductTable, setDetailProductTable] = useState([])
    const [notiTable, setNotiTable] = useState([])
    const [notiContent, setnotiContent] = useState(null)
    // Ref
    const RefTable = useRef()
    const headerDetalTable = useRef()
    const notificeRefTable = useRef([])
    const notiContentRef = useRef([])
    const { socketOrder, cookies } = useContext(ElementContextAdmin)
    // Gửi dữ liệu lên API
async function showProductTable() {
    try {
      const response =  await axios.get(`http://localhost:8080/api/v12/getproductbillorder?token=${cookies.get('AccessTokenAdmin')}`);
      console.log("🚀 ~ showProductTable ~ response:", response)
      if(response.data.massege === "Không tìm thấy đơn hàng") {
        setProductTable(response.data.data)
      }
    } catch (error) {
        console.error('Lỗi khi thêm sản phẩm:', error);
        // Xử lý lỗi tại đây.
    }
}
// Gửi dữ liệu lên API
async function updateTable(Table) {
    try {
        await axios.put('http://localhost:8080/api/v12/updatetable', Table);
    } catch (error) {
        console.error('Lỗi khi thêm sản phẩm:', error);
        // Xử lý lỗi tại đây.
    }
    }// Gửi dữ liệu lên API
async function deleteTableProduct(Table) {
    try {
        const response = await axios.put('http://localhost:8080/api/v12/deleteproductorder', Table);
        if(response.data.massege === "success CreateBill") {
            socket.emit('successproduct', Table.IdTable,Table.Id)
            }
    } catch (error) {
        console.error('Lỗi khi thêm sản phẩm:', error);
        // Xử lý lỗi tại đây.
    }
    }
    // Gửi dữ liệu lên API
async function updateproduct(Table) {
    try {
       const response = await axios.put('http://localhost:8080/api/v12/updateproductorder', Table);
        if(response.data.massege === "success CreateBill") {
        socket.emit('successproduct', Table.IdTable,Table.Id)
        }
    } catch (error) {
        console.error('Lỗi khi thêm sản phẩm:', error);
        // Xử lý lỗi tại đây.
    }
    }
    // Gửi dữ liệu lên API
async function updateBillOrder(Table) {
    try {
        await axios.put('http://localhost:8080/api/v12/updatebillorder', Table);
    } catch (error) {
        console.error('Lỗi khi thêm sản phẩm:', error);
        // Xử lý lỗi tại đây.
    }
    }
    // Các hàm xử lý
    const handleClickOpenTable = async (Id,Name) => {
        try {
            const response =  await axios.get(`http://localhost:8000/api/v12/getproductbillordertable/${Id}?token=${cookies.get('AccessTokenAdmin')}`);
            if(response.data.massege === "Thanh cong") {
                setProductTable(response.data.data)    
                setTablesId(Id)
                notificeRefTable.current[Id].classList.remove('open')
                RefTable.current.classList.add('open')
                headerDetalTable.current.innerText = `${Name}`
            }
          } catch (error) {
              console.error('Lỗi khi thêm sản phẩm:', error);
              // Xử lý lỗi tại đây.
          }
    }
    const handleClickRemoveShowBill = () => {
        RefTable.current.classList.remove('open')
    }
    const handleClickCheckBill = (Id,IdDetail,Status) => {
        if(tableId !== null) {
            socketOrder.emit('updateProduct',Id,IdDetail,tableId,Status)
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
    const handleClickCheckout = () => {
        socketOrder.emit('checkoutsuccess', tableId,(data) => {
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
          axios.get('http://localhost:8080/api/v12/showtable'),
        ])
          .then(axios.spread((Table,) => {
            setTables(Table.data.data)
          }))
          .catch (err => {
              console.error()
            })
        },[notiContent,checkTable])
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
    },[checkTable,notiContent,tables,notiTable])
    return ( 
        <>
            <div className="Table_Container">
                <h1>Bàn</h1>
                <span className='Table_Container-qualitytable'>{tableUser}/{tables.length}</span>
                    <div className='Table_content'>
                        {tables.map((table,index) => (
                            <div onClick={() => handleClickOpenTable(table.Id,table.Name)} key={index} className='Table_item'>
                                <h2>{table.Name}</h2>
                                <img className='Table-icon' src={imgTable} />
                                <h2>{table.Status}</h2>
                                <div ref={e => notificeRefTable.current[table.Id] = e} className='notificeContent'>
                                    <span ref={e => notiContentRef.current[table.Id] = e} className='notificeBill'></span>
                                </div>
                            </div>
                        ))}
                    </div>
            </div>
            <div ref={RefTable} onClick={handleClickRemoveShowBill} className='modal_detailbillorder'>
                <div onClick={(e) => e.stopPropagation()} className='detailbill_content'>
                    <div className='bill'>                          
                    <h1 ref={headerDetalTable}>Bàn Số 1</h1>  
                    <h2>(Gọi Món)</h2>
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
                                                <h3>Phân Loại Size: M</h3>
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
                                                    {(product.Status === 0 ? <div className='showdetail'><button onClick={() => handleClickCheckBill(product.Id,product.IdDetail,1)} className="button">Lên Món</button></div> : null)}
                                                    {(product.Status === 0 ? (<div className='delete'><button onClick={() => handleClickCheckBill(product.Id,product.IdDetail,2)}  className="button">Từ chối</button></div>) : null)}
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
                                <div onClick={handleClickCheckout} className='button_checkout_billorder'>
                                    <button className="comic-button">Đã Thanh Toán</button>
                                </div>
                    </div>

                </div>
            </div>
        </>
     );
}

export default App;