  import axios from 'axios';
  import React, {useState, useEffect,useRef } from 'react';
  import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
  import {faCircleCheck } from '@fortawesome/free-solid-svg-icons';
  import DataGrid, {Scrolling, Pager, Column, Editing, Paging, Lookup} from 'devextreme-react/data-grid';
  const App = () => {
    const [typeapi, setTypesapi] = useState({});
    const [types, setTypes] = useState([]);
    const [menu, setMenu] = useState([]);
  // Ref
  const notificeRef = useRef()
      // Gửi dữ liệu lên API Create
      async function deleteType(e) {
        try {
           await axios.post('http://localhost:8080/api/v12/deletetype',{IdType: e.data.Id})
        } catch (error) {
          alert('Đã xảy ra lõi')
        }
      }
    // Gửi dữ liệu lên API
    async function addType(type) {
      try {
        await axios.post('http://localhost:8080/api/v12/createtypes', type);
        setTypesapi(type)
        notificeRef.current.classList.add('open')
      } catch (error) {
        console.error('Lỗi khi thêm sản phẩm:', error);
    
      }
    }
      //   // Gửi dữ liệu lên API Update
      async function updateType(type) {
        try {
          await axios.put('http://localhost:8080/api/v12/updatetype', type);
          setTypesapi(type)
          notificeRef.current.classList.add('open')
        } catch (error) {
          console.error('Lỗi khi thêm sản phẩm:', error);
        }
      }
      // Dev Express
      // Các hàm xử lý
    const handleCreate = (e) => {
      const data = e.data
      delete data.Id
      setTypesapi(data)
      addType(data)
    }
    const handleUpdateCategori = (e) => {
      const data = e.data
      updateType(data)
    }
    // API
    useEffect(() => {
      axios.all([
        axios.get('http://localhost:8080/api/v12/showtypeadmin'),
        axios.get('http://localhost:8080/api/v12/showmenu')
      ])
        .then(axios.spread((Type,Menu,) => {
          const type = Type.data.data
          const menu = Menu.data.data
          setMenu(menu)
          setTypes(type)
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
    }, [typeapi])
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
          dataSource={types}
          onRowInserted={handleCreate}
          onRowUpdated={handleUpdateCategori}
          onRowRemoved={deleteType}
          showRowLines={true}
          showBorders={true}
          rowAlternationEnabled={true}
        >
          <Scrolling rowRenderingMode="virtual"></Scrolling>
          <Paging defaultPageSize={7} />
          <Pager
            visible={true}
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
          alignment="center" 
          />
          <Column dataField="IdMenu"
          alignment="center" 
          caption='Menu'
          >
                <Lookup
              dataSource={menu}
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