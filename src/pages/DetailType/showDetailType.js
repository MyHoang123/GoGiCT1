import axios from 'axios';
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import React, {useState, useEffect,useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import DataGrid, {Scrolling, Pager, Column, Editing, Paging, Lookup} from 'devextreme-react/data-grid';
import SelectBox from 'devextreme-react/select-box';
const App = () => {
  const [detailTypeapi, setDetailTypesapi] = useState({});
  const [categoris, setCategoris] = useState([]);
  const [types, setTypes] = useState([]);
  const [detailTypes, setTyDetailtypes] = useState([]);
  const [detailTypesBackup, setdetailTypesBackup] = useState([])
  const [categoriFillter, setCategoriFillter] = useState([])
// Ref
const notificeRef = useRef()

  // Dev Express
          // Gửi dữ liệu lên API Create
          async function deleteDetailType(e) {
            try {
               await axios.post('https://severgogi.onrender.com/api/v12/deletedetailtype',{IdType: e.data.IdType,IdCategoris:e.data.IdCategoris})
            } catch (error) {
              alert('Đã xảy ra lõi')
            }
          }
  // Gửi dữ liệu lên API
  async function addDetailType(detailtype) {
    try {
      await axios.post('https://severgogi.onrender.com/api/v12/createdetailtypes', detailtype);
        notificeRef.current.classList.add('open')
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
  const handleCreate = (e) => {
    const data = e.data
    delete data.Id
    const result = detailTypesBackup.find(type => type.IdCategoris === data.IdCategoris && type.IdType === data.IdType)
    if(result === undefined) {
      setDetailTypesapi(data)
      addDetailType(data)
    }
    else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Sản Phẩm Đã Tồn Tại !",
        footer: '<a href="#">Why do I have this issue?</a>'
      });
      e.cancel = true; // Hủy bỏ việc thêm hàng mới
    return;
    }
  }
  const handleFilterProduct = (e) => {
    if(e.value === 0) {
        setTyDetailtypes(detailTypesBackup)
    }
    else {
        setTyDetailtypes(typeArray(detailTypesBackup,e.value))
    }
  }
  // API
  useEffect(() => {
    axios.all([
      axios.get('https://severgogi.onrender.com/api/v12/showcategori'),
      axios.get('https://severgogi.onrender.com/api/v12/showtypeadmin'),
      axios.get('https://severgogi.onrender.com/api/v12/showdetailtypes')
    ])
      .then(axios.spread((Categori, Type, detailType,) => {
        const categori = Categori.data.data
        const customers = Type.data.data
        const detailype = detailType.data.data
        setCategoris(categori)
        setTypes(customers)
        setTyDetailtypes(detailype)
        setdetailTypesBackup(detailype)
        setCategoriFillter([{Id: 0,Name:'All'},...customers])
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
  }, [detailTypeapi])
  return (
    <div className='container_categori'>
      <div className="filter_content">
            <SelectBox
              dataSource={categoriFillter}
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
    <React.Fragment>
      <DataGrid
        id="gridContainer"
        dataSource={detailTypes}
        onRowInserting={handleCreate}
        customizeColumns={customizeColumns}
        onRowRemoved={deleteDetailType}
        showRowLines={true}
        showBorders={true}
        rowAlternationEnabled={true}
      >
        <Scrolling rowRenderingMode="virtual"></Scrolling>
        <Paging defaultPageSize={9} />
        <Pager
          visible={true}
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

        <Column dataField="IdCategoris"
        caption='Loại'
        alignment="center"  
        >
            <Lookup
            dataSource={categoris}
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