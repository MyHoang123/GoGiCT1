
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
function createBill(response,socket) {
    if(response.data.massege === 'Thanh cong') {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
              confirmButton: "btn btn-success",
              cancelButton: "btn btn-danger"
            },
            buttonsStyling: false
          });
        swalWithBootstrapButtons.fire({
            title: "Success!",
            text: "Cảm ơn bạn đã đặt hàng",
            icon: "success"
          }).then((result) => {
            if(result.isConfirmed) {
                socket.emit('newBill')
                window.location.href = '/purchase'
            }
            else {
                socket.emit('newBill')
                window.location.href = '/purchase'
            }
          })
    } else if (response.data.massege === 'Thanh Toan') {
        socket.emit('newBill')
        window.location.href = response.data.url
    }
    else if(response.data.massege === 'OFF') {
        Swal.fire({
            icon: "error",
            title: "Nhà hàng chưa mở cửa",
            text: "Open 9h30-23h !",
            footer: '<a href="#">Why do I have this issue?</a>'
          });
    }
    else if(response.data.massege === 'Sai so dien thoai') {
        Swal.fire({
            icon: "error",
            title: "Số điện thoại sai !",
            text: "Số điện thoại không bao gòm số 0",
            footer: '<a href="#">Why do I have this issue?</a>'
          });
    }
    else if(response.data.massege === 'Vi tri sai') {
        Swal.fire({
            icon: "error",
            title: "Không tìm thấy địa chỉ",
            text: "Vui lòng cho phép truy cập vị trí",
            footer: '<a href="#">Why do I have this issue?</a>'
          });
    }
}

export default createBill;