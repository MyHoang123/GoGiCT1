

import axios from 'axios'
import * as Icon from 'react-feather'
import './product.scss'
import { Cookies } from 'react-cookie'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import React, {useState, useEffect, useRef, useCallback } from 'react'
import DataGrid, {Column, Editing, Paging, Lookup, Scrolling, Pager,} from 'devextreme-react/data-grid'
import CheckBox from 'devextreme-react/check-box'
import SelectBox from 'devextreme-react/select-box';
const App = () => {
  const cookies = new Cookies()
  const [products, setProducts] = useState([])
  const [productBackup, setProductBackup] = useState([])
  const [productapi, setProductapi] = useState([])
  const [categori, setCategori] = useState([])
  const [categoriBackup, setCategoriBackup] = useState([])
  const [categoriApi, setCategoriApi] = useState(1)
  const [name, setName] = useState('')
  const [price, setPrice] = useState()
  const [dscip, setDscip] = useState('')
  const [img, setImg] = useState('')
  const [nameUpdate, setNameUpdate] = useState('')
  const [priceUpdate, setPriceUpdate] = useState(1)
  const [dscipUpdate, setDscipUpdate] = useState('')
  const [imgUpdate, setImgUpdate] = useState('')
  const [IdUpdate, setIdUpdate] = useState('')
  const [ImgOld, setImgOld] = useState('')
// Dev Express
  const [displayMode, setDisplayMode] = useState('full');
  const [showPageSizeSelector, setShowPageSizeSelector] = useState(true);
  const [showInfo, setShowInfo] = useState(true);
  const [showNavButtons, setShowNavButtons] = useState(true);

  const [isAdding, setIsAdding] = useState(false);
  // Ref
  const modelForm = useRef()
  const inputName = useRef([])
  const inputFile = useRef([])
  const inputDsrip = useRef([])
  const inputIdCate = useRef([])

  const inputPrice = useRef([])
  
  const modelFormUpdate = useRef()
  const cartFile = useRef()
  const cartFileUpdate = useRef()
  const inputFileImageUpdate = useRef()
  const dataGidRef = useRef()
  const notificeRef = useRef()
  //DevExpress  
  const onInitNewRow = (e) => {
    if (isAdding) {
      e.component.editRow(e.dataIndex); // Mở chế độ chỉnh sửa cho hàng mới
      setIsAdding(false); // Đặt lại trạng thái thêm hàng mới
    }
  };
  const displayModes = [
    { text: "Display Mode 'full'", value: 'full' },
    { text: "Display Mode 'compact'", value: 'compact' },
  ];
  const allowedPageSizes = [4, 6, 8];
  const customizeColumns = (columns) => {
    columns[0].width = 70;
  };
  const displayModeChange = useCallback((value) => {
    setDisplayMode(value);
  }, []);
  const showPageSizeSelectorChange = useCallback((value) => {
    setShowPageSizeSelector(value);
  }, []);
  const showInfoChange = useCallback((value) => {
    setShowInfo(value);
  }, []);
  const showNavButtonsChange = useCallback((value) => {
    setShowNavButtons(value);
  }, []);
  const isCompactMode = useCallback(() => displayMode === 'compact', [displayMode]);
  // Các hàm xử lý
  // Hàm type
   const typeArray = (array,i) => {
    const Array = [...array];
    const productFilter = Array.filter((product) => product.IdCategoris === i )
    return productFilter
      }
  const cellRender = (data) => <div style={{backgroundImage: `url(http://localhost:8080/api/v12/showimgproduct/${data.value})`,width: '80px',height: '50px',backgroundPosition: 'center center',backgroundSize: 'cover' }} ></div>
  const handleClickOpenModelCreate = () => {
    modelForm.current.classList.add('open')
  }
  const handleClickOpenModelUpdate = (e) => {
    setIdUpdate(e.data.Id)
    setImgOld(e.data.Img)
    inputName.current[1].value = e.data.Name
    inputPrice.current[1].value = e.data.Price
    inputDsrip.current[1].value = e.data.Dsription
    inputIdCate.current[1].value = e.data.IdCategoris
    cartFileUpdate.current.style.backgroundImage = `url(http://localhost:8080/api/v12/showimgproduct/${e.data.Img})`
    modelFormUpdate.current.classList.add('open')
  }
  const handleClickRemoveModel = useCallback((i) => {
    if(i === 0) {
      inputName.current[i].value = ''
      inputPrice.current[i].value = ''
      inputFile.current[i].files = null
      inputDsrip.current[i].value = ''
      inputIdCate.current[i].value = ''
     modelForm.current.classList.remove('open')
     cartFile.current.style.backgroundImage = `url()`
    }else if(i === 1) {
      inputName.current[i].value = ''
      inputPrice.current[i].value = ''
      inputFile.current[i].files = null
      inputDsrip.current[i].value = ''
      inputIdCate.current[i].value = ''
      dataGidRef.current.instance.cancelEditData() 
      modelFormUpdate.current.classList.remove('open')
      cartFile.current.style.backgroundImage = `url()`
    }
  },[])
  const handleSelect = (e) => {
    setCategoriApi(e.target.value)
  }
  const handleUploadFile = (e) => { 
    if(e.target.files[0] !== undefined) {
      const img = e.target.files[0]
      cartFile.current.style.backgroundImage = `url(${URL.createObjectURL(img)})`
    }
  }
  const handleUploadFileUpdate = (e) => { 
    if(e.target.files[0] !== undefined) {
      const img = e.target.files[0]
      setImgUpdate(img)
      cartFileUpdate.current.style.backgroundImage = `url(${URL.createObjectURL(img)})`
    }
  }
  const handleSubmit = useCallback((e,i) => {
    e.preventDefault()
    const product = {
        Name: inputName.current[i].value,
        Price: inputPrice.current[i].value,
        Img: inputFile.current[i].files[0],
        Dsription: inputDsrip.current[i].value,
        IdCategoris: inputIdCate.current[i].value,
      }
      addProduct(product)
  },[])
  const handleSubmitUpdate = useCallback((e,Id,img) => {
    e.preventDefault();
    const product = {       
        Name: inputName.current[1].value,
        Price: inputPrice.current[1].value,
        Img: inputFile.current[1].files.length > 0 ? inputFile.current[1].files[0] : null,
        Dsription: inputDsrip.current[1].value,
        IdCategoris: inputIdCate.current[1].value,
        Id: Id,
        ImgOld: img
      }
      updateProduct(product)
      // handleClickRemoveModelUpdate()
  },[])
  const handleUpdateProduct = (e) => {
    e.component.cancelEditData();
  }
  const handleFilterProduct = (e) => {
    if(e.value === 0) {
      setProducts(productBackup)
    }
    else {
      setProducts(typeArray(productBackup,e.value))
    }
  }
  // Gửi dữ liệu lên API Create
  async function addProduct(product) {
    try {
      const formData = new FormData();
      formData.append('file', product.Img, `${product.Img.name}_sp`);
      formData.append('Name', product.Name)
      formData.append('Price', product.Price)
      formData.append('Dsription', product.Dsription)
      formData.append('IdCategoris', product.IdCategoris)
      const response = await axios.post('http://localhost:8080/api/v12/createproduct', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': cookies.get('AccessTokenAdmin')
        }
      })
      if(response.data.massege === 'Thanh cong') {
        setProductapi(product)
        notificeRef.current.classList.add('open')
        handleClickRemoveModel(0)
      }else {
        alert('Đã xảy ra lõi vui lòng thử lại')
      }
    } catch (error) {
      console.error('Lỗi khi thêm sản phẩm:', error);
   
    }
  }
  //   // Gửi dữ liệu lên API Update
  async function updateProduct(product) {
    if(product.Img === null) {
      product.token = cookies.get('AccessTokenAdmin')
     const respone = await axios.put('http://localhost:8080/api/v12/editproduct', product);
      if(respone.data.massege === 'Thanh cong') {
        notificeRef.current.classList.add('open')
        setProductapi(product)
        handleClickRemoveModel(1)
      }
      else {
        alert('lõi')
      }
    }
    else {
      try {
        const formData = new FormData();
        formData.append('fileupdate', product.Img, `${product.Img.name}_sp`);
        formData.append('Name', product.Name)
        formData.append('Price', product.Price)
        formData.append('Dsription', product.Dsription)
        formData.append('IdCategoris', product.IdCategoris)
        formData.append('Id', product.Id)
        formData.append('ImgOld', product.ImgOld)
        const respone = await axios.put('http://localhost:8080/api/v12/updateproduct', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': cookies.get('AccessTokenAdmin')
          }
        })
        if(respone.data.massege === 'Thanh cong') {
          setProductapi(product)
          notificeRef.current.classList.add('open')
          handleClickRemoveModel(1)
        }
        else {
          alert('lõi')
        }
      } catch (error) {
        console.error('Lỗi khi thêm sản phẩm:', error);
      }
    }
  }
  // API
  useEffect(() => {
    axios.all([
      axios.get('http://localhost:8080/api/v12/showproductadmin'),
      axios.get('http://localhost:8080/api/v12/showcategori')
    ])
      .then(axios.spread((Product, Categori) => {
        const products = Product.data.data;
        const customers = Categori.data.data;
        setProductBackup(products)
        setProducts(products)
        setCategori(customers)
        setCategoriBackup([{Id: 0,Name:'All'},...customers])
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
  }, [productapi])
  return (
    <div className='container_showproduct'>
          <div className="filter_content">
            <SelectBox
              dataSource={categoriBackup}
              valueExpr="Id"
              displayExpr="Name"
              placeholder="Lọc Theo Loại"
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
                  </div>;
          </div>
        
      <div ref={modelForm} onClick={() => handleClickRemoveModel(0)} className='model_form'>
               <div onClick={(e) => {e.stopPropagation()}} className="form-container">
                <h1 className='title'>Create Product</h1>
                            <form className="form" onSubmit={(e) => handleSubmit(e,0)}>
                                <div className="formField">
                                    <input ref={e => inputName.current[0] = e}  type="text" className="input" required=" "/>
                                    <span className="span_bar"></span>
                                    <span className='span_name'>Tên Sản Phẩm</span>
                                </div>
                               <div className="formField">
                                    <input ref={e => inputPrice.current[0] = e} type="number" className="input" required=" " />
                                    <span className="span_bar"></span>
                                    <span className='span_name'>Giá</span>
                                </div>
                                <div className="formField">
                                  <label style={{fontSize: '13px' ,marginBottom: '12px',marginLeft: '10px'}}>Hình Ảnh</label>
                                        <div ref={cartFile} className="card_showproduct">
                                          <div className="img">
                                            <Icon.Image/>
                                          </div>
                                            <input ref={e => inputFile.current[0] = e} onChange={(e) => handleUploadFile(e)} className='input_Img' type='file' required=" " />
                                        </div>
                                </div>
                                <div className="formField">
                                    <input ref={e => inputDsrip.current[0] = e} className="input" type='text' required=" " />
                                    <span className="span_bar"></span>
                                    <span className='span_name'>Mô Tả</span>
                                </div>
                                <select ref={e => inputIdCate.current[0] = e} className="input">
                                  {categori.map(( data, i)=> (
                                     <option key={i} value={data.Id}>{data.Name}</option>
                                  ))}
                                </select>
                                <button type='submit' className="form-btn">Create Product</button>
                            </form>
                          
                            </div>
                </div>
                {/* ModelUpdate */}
        <div ref={modelFormUpdate} onClick={() => handleClickRemoveModel(1)} className='model_form'>
            <div onClick={(e) => {e.stopPropagation()}} className="form-container">
            <h1 className='title'>Update Product</h1>
                        <form className="form" onSubmit={(e) => handleSubmitUpdate(e,IdUpdate,ImgOld)}>
                            <div className="formField">
                              <input ref={e => inputName.current[1] = e}  type="text" className="input" required=" "/>
                                <span className="span_bar"></span>
                                <span className='span_name'>Tên Sản Phẩm</span>
                            </div>
                            <div className="formField">
                             <input ref={e => inputPrice.current[1] = e} type="number" className="input" required=" " />
                                <span className="span_bar"></span>
                                <span className='span_name'>Giá</span>
                            </div>
                            <div className="formField">
                              <label style={{fontSize: '13px' ,marginBottom: '12px',marginLeft: '10px'}}>Hình Ảnh</label>
                                    <div ref={cartFileUpdate} className="card_showproduct">
                                      <div className="img">
                                        <Icon.Image/>
                                      </div>
                                        <input ref={e => inputFile.current[1] = e} onChange={(e) => handleUploadFileUpdate(e)} className='input_Img' type='file' />
                                    </div>
                            </div>
                            <div className="formField">
                             <input ref={e => inputDsrip.current[1] = e} className="input" type='text' required=" " />
                                <span className="span_bar"></span>
                                <span className='span_name'>Mô Tả</span>
                            </div>
                            <select ref={e => inputIdCate.current[1] = e} className="input">
                              {categori.map(( data, i)=> (
                                  <option key={i} value={data.Id}>{data.Name}</option>
                              ))}
                            </select>
                            <button type='submit' className="form-btn">Update Product</button>
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
<div className='content'>
    <React.Fragment>
      <DataGrid
        id="gridContainer"
        ref={dataGidRef}
        dataSource={products}
        allowColumnReordering={true}
        showRowLines={true}
        showBorders={true}
        rowAlternationEnabled={true}
        onRowUpdated={handleUpdateProduct}
        onEditingStart={handleClickOpenModelUpdate}
        customizeColumns={customizeColumns}
        onInitNewRow={onInitNewRow}
      >
         <Scrolling rowRenderingMode="virtual"></Scrolling>
         <Paging defaultPageSize={8} />
          <Pager
            visible={true}
            allowedPageSizes={allowedPageSizes}
            displayMode={displayMode}
            showPageSizeSelector={showPageSizeSelector}
            showInfo={showInfo}
            showNavigationButtons={showNavButtons}
          />
        <Editing
          mode="row"
          allowUpdating = {true}
          allowDeleting = {true}
        />
        <Column 
      cellRender={(data) => <span>{data.rowIndex + 1}</span>}
       caption="STT"
       alignment='center'
           />
        <Column dataField="Name"
        alignment="center"
        caption='Tên'
        />
        <Column
          dataField="Price"
          width={130}
          alignment="center"
          caption='Giá'
        />
        <Column
          dataField="Img"
          width={100}
          alignment="center"
          caption='Hình Ảnh'
          cellRender={cellRender}
        />
        <Column
          dataField="Dsription"
          alignment="center"
          caption='Mô Tả'
        />
          <Column
          dataField="Sales"
          alignment="center"
          caption='Lượt Bán'
        />
        <Column
          dataField="IdCategoris"
          caption="Loại"
          width={150}
          alignment="center"
        >
          <Lookup
            dataSource={categori}
            displayExpr="Name"
            valueExpr="Id"
          />
        </Column>
      </DataGrid>
      {/*  */}     
      <div className="options" style={{display: 'none'}}>
        <div className="caption">Options</div>
        <div className="option-container">
          <div className="option">
            <SelectBox
              id="displayModes"
              items={displayModes}
              displayExpr="text"
              valueExpr="value"
              value={displayMode}
              onValueChange={displayModeChange}
            />
          </div>
          <div className="option">
            <CheckBox
              id="showPageSizes"
              text="Show Page Size Selector"
              value={showPageSizeSelector}
              onValueChange={showPageSizeSelectorChange}
            />
          </div>
          <div className="option">
            <CheckBox
              id="showInfo"
              text="Show Info Text"
              value={showInfo}
              onValueChange={showInfoChange}
            />
          </div>
          <div className="option">
            <CheckBox
              id="showNavButtons"
              text="Show Navigation Buttons"
              value={showNavButtons}
              onValueChange={showNavButtonsChange}
              disabled={isCompactMode()}
            />
          </div>
        </div>
      </div>
    </React.Fragment>
    
  </div>
    </div>
  );
};
export default App;