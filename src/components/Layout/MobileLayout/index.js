
import { useState, createContext, useEffect,useRef } from "react";
import io from 'socket.io-client';
import './Mobile.scss'
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import { useNavigate } from 'react-router-dom'
export  const MobileContext = createContext()
function App( {Children} ) {
    const [table, setTable] = useState(null);
    const navigate = useNavigate();
    // ref
    const timeoutIdRef = useRef({});
    const timeouModal = useRef(null);
    const modalHello = useRef()
    // All Mobile,CreateQR
    const checkout = (newSocket) => {
        Swal.fire({
            title: "Cảm Ơn Bạn Đã Thanh Toán. Đánh Giá",
            html: `
                <div class="TitleCheckout" style="background-color: #f1f1f1; padding: 10px 20px; border-radius: 5px;">
                    <div class="rating">
                    <input type="radio" id="star-1" name="star-radio" value="star-1">
                    <label for="star-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path pathLength="360" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path></svg>
                    </label>
                    <input type="radio" id="star-2" name="star-radio" value="star-1">
                    <label for="star-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path pathLength="360" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path></svg>
                    </label>
                    <input type="radio" id="star-3" name="star-radio" value="star-1">
                    <label for="star-3">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path pathLength="360" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path></svg>
                    </label>
                    <input type="radio" id="star-4" name="star-radio" value="star-1">
                    <label for="star-4">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path pathLength="360" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path></svg>
                    </label>
                    <input type="radio" id="star-5" name="star-radio" value="star-1">
                    <label for="star-5">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path pathLength="360" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path></svg>
                    </label>
                </div>
            </div>
                `,
            icon: "success"
          }).then((result) => {
            if(result.isConfirmed) {
                // Xử lý sự kiện khi kết nối bị đóng
                const IdClient = JSON.parse(localStorage.getItem('Table')).Table
                newSocket.emit('disconnection', IdClient);
                newSocket.disconnect();
                localStorage.removeItem('Table')
                localStorage.removeItem('card')
                navigate('/')
                }
                else {
                // Xử lý sự kiện khi kết nối bị đóng
                const IdClient = JSON.parse(localStorage.getItem('Table')).Table
                newSocket.emit('disconnection', IdClient);
                newSocket.disconnect();
                localStorage.removeItem('Table')
                localStorage.removeItem('card')
                navigate('/')
                }
          });
    }
    const handleClickStar = () => {
        modalHello.current.classList.add('open')
        timeouModal.current = setTimeout(() => {
        modalHello.current.classList.remove('open')
        modalHello.current.style.display = 'none'
        }, 1990);
    }
    useEffect(() => {
        if(JSON.parse(localStorage.getItem('Table')) !== null) {
        const IdClient = JSON.parse(localStorage.getItem('Table')).Table
        const newSocket = io(`${process.env.REACT_APP_IP_SEVER}`,{
            auth: {
                token: 2
            }
           })
        setTable(IdClient)
        // Lắng nghe các sự kiện từ máy chủ
        newSocket.on('repcheckoutsuccess', () => {
            checkout(newSocket)
        });
        return () => {
            newSocket.disconnect()
        }
    }
    },[])
    const data = {
        timeoutIdRef,
    }
    return ( 
        <MobileContext.Provider value={data}>
            {/* <div className="mobile">
            <div ref={modalHello} className='Modal_hellogogi'>
            <div className='Modale_content'>
                <h1>Gogi sizzling delight, igniting tradition masterfully.</h1>
                <p>The best grain, the finest roast, the powerful flavor.</p>
                <button onClick={handleClickStar} className='button_pay_mobile'>Get Started</button>
            </div>
        </div>
            </div> */}
                {Children}
        </MobileContext.Provider>
     );
}

export default App;