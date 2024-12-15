import axios from 'axios';
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import React, {useState, useEffect } from 'react';
import DataGrid, {Scrolling, Pager, Column, Editing, Paging,} from 'devextreme-react/data-grid';
const App = () => {
  const [voucherApi, setVoucherApi] = useState({});
  const [voucher, setVouCher] = useState([]);
// Ref
  // Dev Express
        // Gửi dữ liệu lên API Create
        async function deleteVoucher(e) {
          try {
              await axios.delete(`https://severgogi.onrender.com/api/v12/deletevoucher/${e.data.Id}`)
          } catch (error) {
            alert('Đã xảy ra lõi')
          }
        }
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
      await axios.post('https://severgogi.onrender.com/api/v12/createvoucher', voucher);
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
  const handleCreate = (e) => {
    const data = e.data
    delete data.Id
    createVoucher(data)
    setVoucherApi(data)
  }
  // API
  useEffect(() => {
    axios.all([
      axios.get('https://severgogi.onrender.com/api/v12/showallvoucher'),
    ])
      .then(axios.spread((Voucher) => {
        const Vouchers = Voucher.data.data;
        setVouCher(Vouchers)
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
        onRowRemoved={deleteVoucher}
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