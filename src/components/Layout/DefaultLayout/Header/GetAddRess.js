
import { memo, useEffect } from "react";
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'

function GetAddress() {
    useEffect(() => {
            Swal.fire({
                title: "Truy cập vị trí?",
                text: "Vui lòng cho phép truy cập vị trí!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3ec59d",
                cancelButtonColor: "#d33",
                confirmButtonText: "Cho phép"
            }).then((result) => {
                if (result.isConfirmed) {
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(
                            (position) => {
                                const { latitude, longitude } = position.coords
                                getAddress(latitude, longitude)
                            },
                            (err) => {
                                console.log(err.message);
                            }
                        );
                    } else {
                        console.log("Trình duyệt của bạn không hỗ trợ Geolocation.");
                    }
                }
                else {
                    console.log("Bạn đã từ chối quyền truy cập vị trí.");
                }
                const getAddress = async (latitude, longitude) => {
                    const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
                    try {
                        const response = await fetch(url);
                        const data = await response.json();
                        if (data && data.display_name) {
                            sessionStorage.setItem('Address', data.display_name)
                            sessionStorage.setItem('destination', `${latitude},${longitude}`)
                        } else {
                            console.log("Không tìm thấy địa chỉ.");
                        }
                    } catch (error) {
                        console.log("Lỗi khi lấy địa chỉ.");
                    }
                }
            });
    }, [])
}

export default memo(GetAddress);