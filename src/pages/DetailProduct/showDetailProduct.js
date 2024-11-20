import axios from 'axios';
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import React, {useState, useEffect,useRef } from 'react';
import DataGrid , {Scrolling, Pager, Column, Editing, Paging, Lookup} from 'devextreme-react/data-grid';

import SelectBox from 'devextreme-react/select-box';
const App = () => {
  const [detailProductapi, setDetailProductapi] = useState({});
  const [products, setProducts] = useState([]);
  const [types, setTypes] = useState([]);
  const [productSelects, setProductSelects] = useState(null);
  const [productSelect, setProductSelect] = useState();
  const [type, setType] = useState();

  const [detailProducts, setDetailProducts] = useState([]);
  const [detailProductsBackup, setdetailProductsBackup] = useState([])
  const [typeFillter, setTypeFillter] = useState([])
// Rèf
  const modelForm = useRef()
  const notificeRef = useRef()

  // Dev Express
  // Gửi dữ liệu lên API
  async function addDetailProduct(detailproduct) {  
    try {
    const response =  await axios.post('http://localhost:8080/api/v12/createdetailproduct', detailproduct);
    if(response.data.massege === 'Thanh cong') {
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Your work has been saved",
        showConfirmButton: false,
        timer: 1500
      });
    }
      // Thực hiện các hành động bổ sung tại đây sau khi sản phẩm được thêm thành công.
    } catch (error) {
      alert('Có lõi xảy ra vui lòng thử lại')
      // Xử lý lỗi tại đây.
   
    }
  }
        // Gửi dữ liệu lên API Create
        async function deleteDetailProduct(e) {
          try {
             await axios.post('http://localhost:8080/api/v12/deletedetailproducts',{IdType: e.data.IdType,IdProduct:e.data.IdProduct})
          } catch (error) {
            alert('Đã xảy ra lõi')
          }
        }
      // Gửi dữ l
    // Gửi dữ liệu lên API
    async function showproductcate(IdType) {  
      try {
       const response = await axios.post('http://localhost:8080/api/v12/showproductcate', IdType);
        for(let i in response.data.data) {
          for(let j in detailProducts) {
            if(response.data.data[i].Id === detailProducts[j].IdProduct) {
              response.data.data.splice(i,1)
            }
          }
        }
        setProductSelects(response.data.data)
        // Thực hiện các hành động bổ sung tại đây sau khi sản phẩm được thêm thành công.
      } catch (error) {
        console.error('Lỗi khi thêm sản phẩm:', error);
        // Xử lý lỗi tại đây.
      }
    }
    // Dev Express
    const customizeColumns = (columns) => {
      columns[0].width = 70;
    };
    // Các hàm xử lý
      // Hàm type
   const typeArray = (array,i) => {
    const Array = [...array];
    const productFilter = Array.filter((product) => product.IdType === i )
    return productFilter
      }
    const handleClickOpenModelCreate = () => {
      modelForm.current.classList.add('open')
    }
  const handleCreate = (e) => {
    const data = e.data
    delete data.Id
    setDetailProductapi(data)
    addDetailProduct(data)
  }
  const handleFilterProduct = (e) => {
    if(e.value === 0) {
        setDetailProducts(detailProductsBackup)
    }
    else {
        setDetailProducts(typeArray(detailProductsBackup,e.value))
    }
  }
  const handleClickRemoveModel = () => {
    modelForm.current.classList.remove('open')
  }
  const handleChangeType = (e) => {
    const IdType = {
      IdType: e.target.value
    }
    showproductcate(IdType)
    setType(e.target.value)
  }
  const handleSubmitForm = (e) => {
    e.preventDefault();
    const detailProduct = {
      IdType: type,
      IdProduct: productSelect
    }
    addDetailProduct(detailProduct)
    setDetailProducts((prev) => [...prev,detailProduct])
  }
  // API
  useEffect(() => {
    axios.all([
      axios.get('http://localhost:8080/api/v12/showproduct'),
      axios.get('http://localhost:8080/api/v12/showtypeadmin'),
      axios.get('http://localhost:8080/api/v12/showdetailproduct')
    ])
      .then(axios.spread((Products, Type, detailProducts,) => {
        const Product = Products.data.data
        const customers = Type.data.data
        const detailProduct = detailProducts.data.data
        setProducts(Product)
        setTypes(customers)
        setDetailProducts(detailProduct)
        setdetailProductsBackup(detailProduct)
        setTypeFillter([{Id: 0,Name:'All'},...customers])
      }))
      .catch (err => {
          console.error()
      })
      const timeout = setTimeout(() => {
        notificeRef.current.classList.remove('open')
        },3000)
        return () => {
          clearTimeout(timeout)
        }
  }, [detailProductapi])
  return (
    <div className='container_categori'>
      <div className="filter_content">
            <SelectBox
              dataSource={typeFillter}
              // inputAttr={filterData}
              valueExpr="Id"
              displayExpr="Name"
              placeholder="Lọc Theo Nhóm"
              onValueChanged={handleFilterProduct}
            />
          </div>
          <div ref={notificeRef} className='notifications'>
                <div className="toast success">
                 <FontAwesomeIcon className='icon_Check_Notifice' icon={faCircleCheck} />
                      <div className="content_notifice">
                          <div className="title_notifice">Success</div>
                          <span style={{fontSize: '14px'}}>This is a success toast.</span>
                      </div>
                      <i className="close fa-solid fa-xmark"
                      ></i>
                  </div>;
          </div>
          <div ref={modelForm} onClick={handleClickRemoveModel} className='model_form'>
               <div onClick={(e) => {e.stopPropagation()}} className="form-container">
                <h1 style={{fontSize: '20px'}} className='title'>Chọn Sản Phẩm Theo Gói Buffe</h1>
                            <form className="form" onSubmit={(e) => handleSubmitForm(e)}>
                                <select className="input" onChange={(e) => handleChangeType(e)}>
                                {types.map(( data, i)=> (
                                  <option key={i} value={data.Id}>{data.Name}</option>
                              ))}
                                </select>
                                {productSelects !== null ? (
                                   <select className="input" onChange={(e) => setProductSelect(e.target.value)} required>
                                   {productSelects.map((data, i)=> (
                                     <option key={i} value={data.Id}>{data.Name}</option>
                                 ))}
                                   </select>
                                ) : null }
                                <button type='submit' className="form-btn">Create Product</button>
                            </form>
                            </div>
                </div>
          <div className='button_create'>
          <button onClick={handleClickOpenModelCreate} className="learn-more">
                <span className="circle">
                <span className="icon arrow"></span>
                </span>
                <span className="button-text-createproduct">Thêm Sản Phẩm</span>
              </button>


    </div>
    <React.Fragment>
      <DataGrid
        id="gridContainer"
        dataSource={detailProducts}
        onRowInserted={handleCreate}
        customizeColumns={customizeColumns}
        onRowRemoved={deleteDetailProduct}
        showRowLines={true}
        showBorders={true}
        rowAlternationEnabled={true}
        
      >
        <Scrolling rowRenderingMode="virtual"></Scrolling>
        <Paging defaultPageSize={9} />
        <Pager
          visible={true}
          displayMode={'full'}
          // showPageSizeSelector={showPageSizeSelector}
          showInfo={true}
          showNavigationButtons={true}
        />
        <Editing
          mode="row"
          allowDeleting={true}
          allowAdding={true}
        />
        <Column 
          cellRender={(data) => <span>{data.rowIndex + 1}</span>}
           caption="STT"
           alignment='center'
           />
        <Column dataField="IdType"
        alignment="center" 
        caption='Nhóm'
        >
              <Lookup
            dataSource={types}
            displayExpr="Name"
            valueExpr="Id"
          />
        </Column>

        <Column dataField="IdProduct"
        caption='Sản Phẩm'
        alignment="center"  
        >
            <Lookup
            dataSource={products}
            displayExpr="Name"
            valueExpr="Id"
             />
            </Column>
      </DataGrid>
      
    </React.Fragment>
    </div>
  );
};
export default App;