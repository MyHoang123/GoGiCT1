import axios from 'axios';
import React, {useState, useEffect,useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import DataGrid, {Scrolling, Pager, Column, Editing, Paging,} from 'devextreme-react/data-grid';
const App = () => {
  const [menuapi, setMenuApi] = useState({});
  const [menu, setMenu] = useState([]);
  const [menuBackup, setMenuBackup] = useState([])
// Ref
const notificeRef = useRef()
  // Dev Express
      // Gửi dữ liệu lên API Create
      async function deleteMenu(e) {
        try {
            await axios.delete(`http://localhost:8080/api/v12/deletemenu/${e.data.Id}`)
        } catch (error) {
          alert('Đã xảy ra lõi')
        }
      }
  // Gửi dữ liệu lên API
  async function addMenu(e) {
    try {
      await axios.post('http://localhost:8080/api/v12/createmenu', {Name:e.data.Name});
    } catch (error) {
      console.error('Lỗi khi thêm sản phẩm:', error);
      // Xử lý lỗi tại đây.
   
    }
  }
    //   // Gửi dữ liệu lên API Update
    async function updateMenu(menu) {
      try {
         await axios.put('http://localhost:8080/api/v12/updatecategori', menu);
          notificeRef.current.classList.add('open')
          setMenuApi(menu)
        // alert('Thêm mới thành công một nhóm sản phẩm')
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
  const handleUpdateCategori = (e) => {
    // const data = e.data
    // updateMenu(data)
  }
  // API
  useEffect(() => {
    axios.all([
      axios.get('http://localhost:8080/api/v12/showmenu'),
    ])
      .then(axios.spread((Categori) => {
        const products = Categori.data.data;
        setMenu(products)
        setMenuBackup(products)
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
  }, [menuapi])
  return (
    <div className='container_categori'>
      {/* Notifi */}
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
        dataSource={menu}
        onRowInserted={addMenu}
        onRowUpdated={handleUpdateCategori}
        customizeColumns={customizeColumns}
        onRowRemoved={deleteMenu}
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