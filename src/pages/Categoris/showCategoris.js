import axios from 'axios';
import React, {useState, useEffect,useRef, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import DataGrid, {Scrolling, Pager, Column, Editing, Paging,} from 'devextreme-react/data-grid';
const App = () => {
  const [categoriapi, setCategoriapi] = useState({});
  const [categoris, setCategoris] = useState([]);
  const [categoriBackup, setCategoriBackup] = useState([])
// Ref
const notificeRef = useRef()
  // Dev Express
          // Gửi dữ liệu lên API Create
          async function deleteCategoris(e) {
            try {
               await axios.post('https://severgogi.onrender.com/api/v12/deletecategoris',{IdCategoris:e.data.Id})
            } catch (error) {
              alert('Đã xảy ra lõi')
            }
          }
  // Gửi dữ liệu lên API
  async function addCategori(categori) {
    try {
      await axios.post('https://severgogi.onrender.com/api/v12/createcategori', categori);
         setCategoriapi(categori)
        notificeRef.current.classList.add('open')
    } catch (error) {
      console.error('Lỗi khi thêm sản phẩm:', error);
      // Xử lý lỗi tại đây.
   
    }
  }
    //   // Gửi dữ liệu lên API Update
    async function updateCategori(categori) {
      try {
         await axios.put('https://severgogi.onrender.com/api/v12/updatecategori', categori);
          notificeRef.current.classList.add('open')
          setCategoriapi(categori)
        // alert('Thêm mới thành công một nhóm sản phẩm')
        // Thực hiện các hành động bổ sung tại đây sau khi sản phẩm được thêm thành công.
      } catch (error) {
        console.error('Lỗi khi thêm sản phẩm:', error);
        // Xử lý lỗi tại đây.
     
      }
    }
    // Dev Express
    const customizeColumns = useCallback((columns) => {
      columns[0].width = 70;
    },[])
    // Các hàm xử lý
      // Hàm type
   const typeArray = (array,i) => {
    const Array = [...array];
    const productFilter = Array.filter((product) => product.IdType === i )
    return productFilter
    }
  const handleCreate = useCallback((e) => {
    const data = e.data
    delete data.Id
    setCategoriapi(data)
    addCategori(data)
  },[])
  const handleUpdateCategori = useCallback((e) => {
    const data = e.data
    updateCategori(data)
  },[])
  // API
  useEffect(() => {
    axios.all([
      axios.get('https://severgogi.onrender.com/api/v12/showcategori'),
    ])
      .then(axios.spread((Categori) => {
        const products = Categori.data.data;
        setCategoris(products)
        setCategoriBackup(products)
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
  }, [categoriapi])
  return (
    <div className='container_categori'>
        <div ref={notificeRef} className='notifications'>
                <div className="toast success">
                 <FontAwesomeIcon className='icon_Check_Notifice' icon={faCircleCheck} />
                      <div className="content_notifice">
                          <div className="title_notifice">Success</div>
                          <span style={{fontSize: '14px'}}>This is a success toast.</span>
                      </div>
                  </div>;
          </div>
    <React.Fragment>
      <DataGrid
        id="gridContainer"
        dataSource={categoris}
        onRowInserted={handleCreate}
        onRowUpdated={handleUpdateCategori}
        customizeColumns={customizeColumns}
        onRowRemoved={deleteCategoris}
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
          allowUpdating={true}
          allowDeleting={true}
          allowAdding={true}
          
        />

        <Column 
          cellRender={(data) => <span>{data.rowIndex + 1}</span>}
           caption="STT"
           alignment='center'
           />
        <Column dataField="Name"
        alignment="center" />
      </DataGrid>
      
    </React.Fragment>
    </div>
  );
};
export default App;