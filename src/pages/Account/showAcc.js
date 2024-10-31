import axios from 'axios';
import React, {useState, useEffect,useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import DataGrid, {
  Column, Editing, Paging,
} from 'devextreme-react/data-grid';
const App = () => {
  const [users, setUsers] = useState([]);
  // REF
const notificeRef = useRef()
  // API
  useEffect(() => {
      axios.get('http://localhost:8080/api/v12/showaccount')
      .then(res => {
          setUsers(res.data.data)
      })
      .catch (err => {
          console.error()
      })
  }, [])
  return (
    <React.Fragment>
      <DataGrid
        id="gridContainer"
        dataSource={users}
        keyExpr="Id"
        allowColumnReordering={true}
        showBorders={true}
        showDataErrors = {false}
      >
        <Paging enabled={true} />
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
        caption='Tài Khoản'
        />
        <Column dataField="Pass"
        alignment="center"
        caption='Mật Khẩu'
        />
        <Column
          dataField="Access"
          width={130}
          alignment="center"
          caption='Quyền'
        />
      </DataGrid>
    </React.Fragment>
  );
};
export default App;