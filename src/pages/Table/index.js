import './Table.scss'
import axios from 'axios'
import io from 'socket.io-client';
import imgTable from '../../Asset/images/table.jpg';
import { useEffect, useMemo, useRef, useState } from 'react';
import ImgProduct from '../CardMobile/imgCard';
function App() {
    const [socket, setSocket] = useState(null);
    const [tables, setTables] = useState([])
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

    // Gửi dữ liệu lên API
async function showProductTable(table) {
    try {
      const response =  await axios.post('http://localhost:8080/api/v12/showbillorderuser', table);
      if(response.data.massege === "Không tìm thấy đơn hàng") {
        setDetailProductTable([])
      }
      else {
          setDetailProductTable(JSON.parse(response.data.data.Data))
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
    const handleClickOpenTable = (Id,Name) => {
        notificeRefTable.current[Id].classList.remove('open')
        setTablesId(Id)
        const table = {
            IdTable: Id
        }
        RefTable.current.classList.add('open')
        showProductTable(table)
        headerDetalTable.current.innerText = `${Name}`
    }
    const handleClickRemoveShowBill = () => {
        RefTable.current.classList.remove('open')
    }
    const handleClickCheckBill = (Id) => {
        const newArr = [...detailProductTable]
        for(let i = 0 ; i < newArr.length; i++) {
            if(newArr[i].Id === Id) {
                newArr[i].Status ='Đã Giao'
                setDetailProductTable(newArr)
            }
        }
        const productbill = {
            Id: Id,
            IdTable: tableId
        }
       updateproduct(productbill)
    }
    const handleClickDeleteProduct = (Id) => {
        const newArr = [...detailProductTable]
        for(let i = 0 ; i < newArr.length; i++) {
            if(newArr[i].Id === Id) {
                newArr[i].Status ='Đã Hủy'
                setDetailProductTable(newArr)
            }
        }
        const productbill = {
            Id: Id,
            IdTable: tableId
        }
        deleteTableProduct(productbill)
    }
    const handleClickCheckout = () => {
        const Table = {
            Status: 'Bàn Trống',
            Id: tableId
        }
        updateTable(Table)
            const TableId = {
                Id: tableId
            }
        updateBillOrder(TableId)
        setnotiContent(null)
        RefTable.current.classList.remove('open')
        socket.emit('checkoutsuccess', TableId.Id)
    }
    useEffect(() => {
        const newSocket = io(`${process.env.REACT_APP_IP_SEVER}`,{
            auth: {
                token: 1
            }
        });
        setSocket(newSocket);
        // Lắng nghe các sự kiện từ sever
        newSocket.emit('connection', 'Admin');
        newSocket.on('notiBillTable', (data,mess) => {
            setnotiContent(mess)
            setNotiTable(prev => [...prev,data])
        });
        newSocket.on('repcheckout', (data,mess) => {
            setnotiContent(mess)
            setNotiTable(prev => [...prev,data])
        });
        newSocket.on('repconnectclient', (data) => {
            setCheckTable(data)
        });
        newSocket.on('repcheckoutsuccessadmin', (data) => {
            const datan = [...tables]
            for(let i in datan) {
                if(datan[i].Id === data) {
                    datan[i].Status = 'Bàn Trống'
                }
            }
            setTables(datan)
        });
        axios.all([
          axios.get('http://localhost:8080/api/v12/showtable'),
        ])
          .then(axios.spread((Table,) => {
            setTables(Table.data.data)
          }))
          .catch (err => {
              console.error()
            })
            return () => {
                // Xử lý sự kiện khi kết nối bị đóng
                newSocket.emit('disconnection', 'Admin');
                newSocket.disconnect();
            }
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
                    {detailProductTable.length !== 0 ? (
                        (detailProductTable.map((product,index) => (
                                    <div key={index} className='bill_content-item'>
                                        <div className='bill_content-item-img'>
                                            <ImgProduct children={product.Img} />
                                        </div>
                                        <div className='bill_content-item-product'>  
                                            <div className='Information'>
                                                <h2>{product.Name}</h2>
                                                <h3>Phân Loại Size: M</h3>
                                                <span style={{fontSize: '10px'}}>x{product.sl}</span>
                                            </div>
                                            <div className='price'>
                                                <div className='price_item'>
                                                    <h2 style={{color: product.Status === 'Đã Giao' ? '#3fb800' : product.Status === 'Chờ Lên Món !' ? '#afaf00' : '#ba3939'}}>{product.Status}</h2>
                                                    <span style={{fontSize: '14px'}}>{product.Price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫'}</span>
                                                </div>
                                            </div>                    
                                                <div className='button_detailproductOrder'>
                                                <div className='button_container'>    
                                                {(product.Status === 'Chờ Lên Món !' ? <div className='showdetail'><button onClick={() => handleClickCheckBill(product.Id)} className="button">Lên Món</button></div> : null)}
                                                        {(product.Status === 'Chờ Lên Món !' ? (<div className='delete'><button onClick={() => handleClickDeleteProduct(product.Id)}  className="button">Từ chối</button></div>) : null)}
                                                    </div>
                                                </div>
                                        </div>             
                                    </div>
                        )))
                    ) : (
                        <h1>Khong tìm thấy sản phẩm</h1>
                    )}
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