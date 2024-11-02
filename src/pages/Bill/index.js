import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { Cookies } from 'react-cookie'
import React, {useState, useEffect,useRef,useContext,useCallback } from 'react';
import { useParams } from 'react-router-dom';
import './Bill.scss'
import DataGrid, {Scrolling, Pager, Column, Editing, Paging,Lookup,} from 'devextreme-react/data-grid';
import { ElementContextAdmin } from '../../components/Layout/AdminLayout/index'
const App = () => {
  const cookies = new Cookies()
  const { Bill } = useParams()
// State
  const [billApi, setBillApi] = useState({})
  const [bill, setBill] = useState([])
	const [idNoti,setIdnoti] = useState(null)
  const [products, setProducts] = useState([])
  const { socket } = useContext(ElementContextAdmin)
// Ref
const modelBill = useRef()
  // Dev Express
    // Gửi dữ liệu lên API
    async function updateBill(Bill) {
        try {
        const response =  await axios.put('http://localhost:8080/api/v12/updatebill', Bill);
            if(response.data.massege === 'Thanh cong') {
              const newArr = [...bill]
              for(let i in newArr) {
                if(newArr[i].Id === Bill.Id) {
                  newArr[i].Status = Bill.Status
                }
              }
              setBill(newArr)
              if(Bill.Status === 'Đã Nhận') {
                socket.emit('confirm', response.data.data,billApi.IdAcc)
              }else if (Bill.Status === 'Đang Giao') {
                socket.emit('ship',Bill.IdAcc)
              }
            }
        } catch (error) {
          console.error('Lỗi khi thêm sản phẩm:', error);
          // Xử lý lỗi tại đây.
        }
      }
      async function getProduct(product) {
        const Id = product.reduce((acc,curr) => {
          return [...acc,curr.Id]
      },[])
      const data = {IdProduct:Id,token:cookies.get('AccessTokenAdmin')}
        try {
        const response =  await axios.post('http://localhost:8080/api/v12/showproductbill', data);
        const newData = []
            for(let i in product) {
                const PriceProduct = response.data.data.find((price => price.Id === product[i].Id))
                const newArr = PriceProduct
                const sl = product[i].Price / PriceProduct.Price
                newArr.Price = product[i].Price
                newArr.sl = sl
                newArr.Note = product[i].Note !== undefined ? product[i].Note : null
                newData.push(newArr)
            }           
            setProducts(newData)
            modelBill.current.classList.add('open')
        } catch (error) {
          console.error('Lỗi khi thêm sản phẩm:', error);
          // Xử lý lỗi tại đây.
        }
      }
    // Dev Express
    useEffect(() => {})
    const customizeColumns = useCallback((columns) => {
      columns[0].width = 70;
    },[])
    // Các hàm xử lý
    const handleClickShowDetail = useCallback((e) => {
      console.log(JSON.parse(e.data.Data))
      if(e) {
        setBillApi({IdBill:e.data.Id,Note:e.data.Note,IdAcc:e.data.IdAcc})
        setProducts(JSON.parse(e.data.Data))
        modelBill.current.classList.add('open')
      }
    },[])
    const handleClickRemoveDetailBill = useCallback(() => {
        modelBill.current.classList.remove('open')
    },[])
    const handleUpdateBill = (Id,IdAcc,data,Status) => {
      if(Status === 3) {
        const newArr = JSON.parse(data).reduce((arr,cur) => {
                return [...arr,{Id:cur.Id,Sl:cur.sl}]
        },[])
        if(socket !== null && Id >= 0) {
          socket.emit('updatebill',Id,IdAcc,Status,newArr,(IdBill) => {
            if(IdBill !== null) {
                  const newArr = [...bill]
                  for(let i in newArr) {
                    if(newArr[i].Id === IdBill) {
                      newArr[i].Status = Status
                    }
                  }
                  setBill(newArr)
                }
                else {
                  alert('Đã xảy ra lõi vui lòng thử lại')
                }
              })
            }
      }
      else {
        if(socket !== null && Id >= 0) {
          socket.emit('updatebill',Id,IdAcc,Status,null,(IdBill) => {
            if(IdBill !== null) {
                  const newArr = [...bill]
                  for(let i in newArr) {
                    if(newArr[i].Id === IdBill) {
                      newArr[i].Status = Status
                    }
                  }
                  setBill(newArr)
                }
                else {
                  alert('Đã xảy ra lõi vui lòng thử lại')
                }
              })
            }
      }
    }
  // API
  const handleLickOpenLocation = (data) => {
    const startLocation = `${10.045260},${105.780017}`; // Có thể thay đổi theo địa điểm bắt đầu
    const destination = data.value;
    const url = `https://www.google.com/maps/dir/?api=1&origin=${startLocation}&destination=${destination}&travelmode=driving`;
    window.open(url, '_blank'); // Mở Google Maps trong tab mới
  }
  useEffect(() => {
    if(cookies.get('AccessTokenAdmin') !== undefined) {
      if(socket !== null) {
        socket.on('repNewbill', (data) => {
          setIdnoti(data)
        })
      }
      const Account = {
        token: cookies.get('AccessTokenAdmin')
      }
      axios.all([
        axios.post('http://localhost:8080/api/v12/showallbill',Account),
      ])
        .then(axios.spread((Bill) => {
          setBill(Bill.data.data)
        }))
        .catch (err => {
          console.error()
        })
    }
  }, [idNoti])
  useEffect(()=> {
    if(Bill !== undefined) {
      handleClickShowDetail(Bill)
    }
  },[bill])
  return (
    <div className='container_categori'>
        <div onClick={handleClickRemoveDetailBill} ref={modelBill} className='modal_shodetail-bill'>
            <div onClick={e => e.stopPropagation()} className='detailbill'>
                <div className='bill_content'>           
                                        {products.map((pd,index) => (
                                                <div key={index} className='bill'>                                      
                                                    <div  className='bill_content-item'>
                                                        <div className='bill_content-item-img'>
                                                            <img style={{width: '100%', height: '100%',objectFit: 'cover', zIndex: '100'}} src={`http://localhost:8080/api/v12/showimgproduct/${pd.Img}`} />
                                                        </div>
                                                        <div className='bill_content-item-product'>  
                                                            <div className='Information'>
                                                                <h2>{pd.Name}</h2>
                                                                <h3>Phân Loại Size: M</h3>
                                                                <span>x{pd.sl}</span>
                                                            </div>
                                                            <div className='price'>
                                                                <span>{pd.Price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫'}</span>
                                                            </div>                                   
                                                        </div>             
                                                    </div>
                                                    {pd.Note !== null ? (
                                                       <div className='note_bill'><FontAwesomeIcon icon={faPen} />{pd.Note}</div>
                                                    ) : null }
                                                </div>
                                        ))}
                                </div>
                                <div className='button_bill'>
                                    <div className='note_bill_content'>
                                  {billApi.Note !== '' ? (
                                      <p className='note_bill_content-item'>{billApi.Note}</p>
                                  ) : null}
                                    </div>
                                    <div className='button_check'>
                                        <button  onClick={() => handleUpdateBill(billApi.IdBill,billApi.IdAcc,null,1)} className="button">
                                          Xác nhận đơn hàng
                                        </button>
                                    </div>
                                </div>
            </div>
        </div>
    <React.Fragment>
      <DataGrid
        id="gridContainer"
        dataSource={bill}
        customizeColumns={customizeColumns}
        showRowLines={true}
        showBorders={true}
        rowAlternationEnabled={true}
      >
        <Scrolling rowRenderingMode="virtual"></Scrolling>
        <Paging defaultPageSize={7} />
        <Pager
          visible={true}
          displayMode={'full'}
          // showPageSizeSelector={showPageSizeSelector}
          showInfo={true}
          showNavigationButtons={true}
        />
        <Editing
          mode="row"
        />
        <Column 
          cellRender={(data) => <span>{data.rowIndex + 1}</span>}
           caption="STT" 
           alignment='center'
           />
        <Column
          dataField="Name"
          caption="Tên"
          width={120}
          alignment="center"
        >
        </Column>
        <Column
        dataField="Address"
        caption="Địa Chỉ"
        width={600}
        alignment="center"
        >
        </Column>
        <Column 
            dataField="TotalPrice"
            alignment="center" 
            caption="Tổng Giá"
            cellRender={(data) => {
                const formattedPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(data.value);
                return <span>{formattedPrice}</span>;
             }}
        />
        <Column
         dataField='Data'
          cellRender={(data) => 
            <>
            <div className='button_container'>
                <div className='showdetail'><button onClick={() => handleClickShowDetail(data)} className="button">Xem chi tiết</button></div>
                {(data.data.Status === 0 ? (<div className='delete'><button className="button">Từ chối</button></div>) : (
                  data.data.Status === 1 ? (<div onClick={() => handleUpdateBill(data.data.Id,data.data.IdAcc,null,2)} className='ship'><button className="button">Giao Hàng</button></div>) : 
                  (data.data.Status === 2 ? (<div onClick={() => handleUpdateBill(data.data.Id,data.data.IdAcc,data.data.Data,3)} className='ship'><button className="button">Đã Xong</button></div>) : null)
                ))}
            </div>
            </>
          }
           caption="Thao Tác"
           alignment='center'
           width={220}
           />
        <Column
         dataField='Destination'
           cellRender={(data) => 
            <>
            <div onClick={() => handleLickOpenLocation(data)} className='location_container'>
                 <div className="loader"></div>
            </div>
            </>
          }
          caption="Vị trí"
          width={80}
          alignment="center"
        ></Column>
      </DataGrid>
    </React.Fragment>
    </div>
  );
};
export default App;