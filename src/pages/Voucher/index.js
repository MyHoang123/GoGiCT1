import axios from 'axios';
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import React, {useState, useEffect,useRef, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import DataGrid, {Scrolling, Pager, Column, Editing, Paging,} from 'devextreme-react/data-grid';
import { ElementContextAdmin } from '../../components/Layout/AdminLayout';
const App = () => {
  const [voucherApi, setVoucherApi] = useState({});
  const [voucher, setVouCher] = useState([]);
  const [voucherBackup, setVoucherBackup] = useState([])
// Ref
const { socket } = useContext(ElementContextAdmin)
  // Dev Express
  // Gửi dữ liệu lên API
  async function createVoucher(voucher) {
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Your work has been saved",
      showConfirmButton: false,
      timer: 1500
    });
    try {
      await axios.post('http://localhost:8080/api/v12/createvoucher', voucher);
      setVoucherApi(voucher)
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
    createVoucher(data)
    setVoucherApi(data)
  }
  // API
  useEffect(() => {
    axios.all([
      axios.get('http://localhost:8080/api/v12/showallvoucher'),
    ])
      .then(axios.spread((Voucher) => {
        const Vouchers = Voucher.data.data;
        setVouCher(Vouchers)
        setVoucherBackup(Vouchers)
      }))
      .catch (err => {
          console.error()
      })
  }, [voucherApi])
  return (
    <div className='container_categori'>
    <React.Fragment>
      <DataGrid
        id="gridContainer"
        dataSource={voucher}
        onRowInserted={handleCreate}
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
          allowUpdating={true}
          allowDeleting={true}
          allowAdding={true}
        />
        <Column 
          cellRender={(data) => <span>{data.rowIndex + 1}</span>}
           caption="STT"
           alignment='center'
           />
        <Column dataField="Voucher"
        alignment="center" />
          <Column dataField="PriceVoucher"
        alignment="center" />
      </DataGrid>
      
    </React.Fragment>
    </div>
  );
};
export default App;