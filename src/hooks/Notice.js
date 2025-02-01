
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
function Notice(Icon, Title, Text, Footer) {
    return ( 
        Swal.fire({
            icon: `${Icon}`,
            title: `${Title}`,
            text: `${Text}`,
            footer: `${Footer}`
          })
     );
}

export default Notice;