
import { memo } from 'react';
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'

function NoticeTopEnd({icon}) {
    return ( 
        Swal.fire({
            position: "top-end",
            icon: `${icon}`,
            title: "Your work has been saved",
            showConfirmButton: false,
            timer: 1500 
          })
     );
}

export default memo(NoticeTopEnd) ;