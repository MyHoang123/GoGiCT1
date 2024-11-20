
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MobileContext } from '../../components/Layout/MobileLayout'
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import { faAngleLeft,faHeart,faStar,faMedal,faCalendarMinus } from '@fortawesome/free-solid-svg-icons';
// FakeImg
import { RenderStar } from '~/hooks'

// Scss
import "./DetailProductMobile.scss"
import { useEffect, useState, useContext } from 'react';
import { Link, useParams, useNavigate} from 'react-router-dom';

function App() {
    const navigate = useNavigate();
    const [productsMobile, setProductsMobile] = useState([
        {
            Name: '',
            Price: 0,
            Img: '',
        }
    ])
    const [comment,setComment] = useState(null)
    const { IdProduct } = useParams();
    // Các hàm xử lý


// Hàm
// const handleClickOrder = () => {
//     if(localStorage.getItem('Table')) {
//         const newArr = JSON.parse(localStorage.getItem('card')) || []
//         if(newArr.length === 0) {
//             const swalWithBootstrapButtons = Swal.mixin({
//                 customClass: {
//                   confirmButton: "btn btn-success",
//                   cancelButton: "btn btn-danger"
//                 },
//                 buttonsStyling: false
//               });
//               swalWithBootstrapButtons.fire({
//                 title: "Are you sure?",
//                 text: "You won't be able to revert this!",
//                 icon: "warning",
//                 showCancelButton: true,
//                 confirmButtonText: "Đồng Ý!",
//                 cancelButtonText: "Tư Chối!",
//                 reverseButtons: true
//               }).then((result) => {
//                 if (result.isConfirmed) {
//                     newArr.push(productsMobile[0])
//                     localStorage.setItem('card', JSON.stringify(newArr))   
                    
//                   swalWithBootstrapButtons.fire({
//                     title: "Thành Công!",
//                     text: "Bạn Đã Đặt Món Thành Công !",
//                     icon: "success"
//                   }).then((result) => {
//                     if(result.isConfirmed) {
//                         navigate(`/mobile/buffe/${JSON.parse(localStorage.getItem('Table')).Table}/mobile/card`)
//                         }
//                         else {
//                         navigate(`/mobile/buffe/${JSON.parse(localStorage.getItem('Table')).Table}/mobile/card`)
//                         }
//                   });
//                 }
//                 else if (
//                   /* Read more about handling dismissals below */
//                   result.dismiss === Swal.DismissReason.cancel
//                 ) {
//                   swalWithBootstrapButtons.fire({
//                     title: "Cancelled",
//                     text: "Your imaginary file is safe :)",
//                     icon: "error"
//                   });
//                 }
//               });

           
//         }
//         else {
//             for(let i in newArr) {
//                 if(parseInt(IdProduct) === newArr[i].Id) {
//                     console.log('hihi')
//                     Swal.fire({
//                         icon: "error",
//                         title: "Oops...",
//                         text: "Sản phẩm đã tồn tại trong giỏ hàng !",
//                         footer: '<a href="#">Why do I have this issue?</a>'
//                       });
//                       break
//                 }
//                 else {
//                     const swalWithBootstrapButtons = Swal.mixin({
//                         customClass: {
//                           confirmButton: "btn btn-success",
//                           cancelButton: "btn btn-danger"
//                         },
//                         buttonsStyling: false
//                       });
//                       swalWithBootstrapButtons.fire({
//                         title: "Are you sure?",
//                         text: "You won't be able to revert this!",
//                         icon: "warning",
//                         showCancelButton: true,
//                         confirmButtonText: "Đồng Ý!",
//                         cancelButtonText: "Tư Chối!",
//                         reverseButtons: true
//                       }).then((result) => {
//                         if (result.isConfirmed) {
//                             newArr.push(productsMobile[0])
//                             localStorage.setItem('card', JSON.stringify(newArr))                        
//                           swalWithBootstrapButtons.fire({
//                             title: "Thành Công!",
//                             text: "Bạn Đã Đặt Món Thành Công !",
//                             icon: "success"
//                           }).then((result) => {
//                             if(result.isConfirmed) {
//                                 navigate(`/mobile/buffe/${JSON.parse(localStorage.getItem('Table')).Table}/mobile/card`)
//                                 }
//                                 else {
//                                 navigate(`/mobile/buffe/${JSON.parse(localStorage.getItem('Table')).Table}/mobile/card`)
//                                 }
//                           });
//                         }
//                         else if (
//                           /* Read more about handling dismissals below */
//                           result.dismiss === Swal.DismissReason.cancel
//                         ) {
//                           swalWithBootstrapButtons.fire({
//                             title: "Cancelled",
//                             text: "Your imaginary file is safe :)",
//                             icon: "error"
//                           });
//                         }
//                       });
//                 }
//             }
//          }
//     }
//     else {
//         Swal.fire({
//             icon: "error",
//             title: "Oops...",
//             text: "Không tìm thấy thông tin !",
//             footer: '<a href="#">Why do I have this issue?</a>'
//           });
//     }
    
// }
    useEffect(() => {
        const Id = {
            IdProduct: IdProduct
        }
        axios.all([
            axios.post('http://localhost:8080/api/v12/showproductid', Id),
            axios.post('http://localhost:8080/api/v12/showcommentorder', Id),
        ])
        .then(axios.spread((Product,Comment) => {
            setProductsMobile(Product.data.data)
            if(Comment.data.data !== undefined) {
                setComment(Comment.data.data)
            }
        }))
        .catch (err => {
            console.error()
        })
        // axios.all([
        //     axios.post(`${process.env.REACT_APP_IP_SEVER}/api/v12/showproductid`, Id),
        //     axios.post(`${process.env.REACT_APP_IP_SEVER}/api/v12/showcommentorder`, Id),
        // ])
        // .then(axios.spread((Product,Comment) => {
        //     setProductsMobile(Product.data.data)
        //     if(Comment.data.data !== undefined) {
        //         setComment(Comment.data.data)
        //     }
        // }))
        // .catch (err => {
        //     console.error()
        // })
    },[])
    return ( 
        <>
            <div className="Card_mobile_detail">
                <div className='layout_gid_detail' >
                    <header className="Card_mobile-header_detail">
                        <Link to='/'>
                            <FontAwesomeIcon style={{fontSize: '16px'}} icon={faAngleLeft} />
                        </Link>
                        <span>Detail</span>
                            <FontAwesomeIcon style={{fontSize: '16px',color: 'rgb(255, 95, 95)'}} icon={faHeart} />
                    </header>
                    {(parseInt(IdProduct) !== null ? (
                        <>
                        {productsMobile.map((product,i)=> (
                            (product.Id === parseInt(IdProduct) ? (
                                <div key={i}>
                                    <div className='Detail_mobile-img'>
                                            <img src={`http://localhost:8080/api/v12/showimgproduct/${product.Img}`} style={{width: '100%', height: '100%',objectFit: 'cover',borderRadius:'50%'}} />
                                    </div>
                                    <div className='Detail_mobile-noti'>
                                        <h2>{product.Name}</h2>
                                        <span>Size L</span>
                                    <div className='Detail_mobile-star'>
                                        <div className='Detail_mobile-star-left'>
                                            <FontAwesomeIcon style={{color: 'rgb(255, 204, 0)'}} icon={faStar} />
                                            <span>
                                            {product.Star}
                                            {(comment !== null ? (`(${comment.length})`) : '0')}
                                            </span>
                                        </div>
                                        <div className='Detail_mobile-star-right'>
                                            <FontAwesomeIcon style={{color: 'rgba(199, 125, 77, 1)',fontSize:'16px',paddingRight:'30px'}} icon={faMedal} />
                                            <FontAwesomeIcon style={{color: 'rgba(199, 125, 77, 1)',fontSize:'16px'}} icon={faCalendarMinus} />
                                        </div>
                                    </div>
                                    <div className='Detail_mobile-descrip'>
                                        <h2>Description</h2>
                                        <span>Thịt bò là thịt của con bò (thông dụng là loại bò thịt). Đây là thực phẩm gia súc phổ biến trên thế giới</span>
                                    </div>
                                    <div className='Detail_mobile-size'>
                                        <h2>Size</h2>
                                        <div className='Detail_mobile-size-container'>
                                            <span>S</span>
                                            <span>M</span>
                                            <span>L</span>
                                        </div>
                                    </div>
                                    <div className='Detail_mobile-showcomment'>
                                    <div className='content_showcomment'>
                                        {(comment !== null ? (
                                            (comment.map((cmt,index) => (
                                            <div key={index} className='content_showcomment-item'>
                                                <div className='content_showcomment-info'>
                                                    <div className='content_showcomment-item-img'>
                                                        <img style={{width: '100%',height: '100%',borderRadius: '50%',objectFit: 'cover', zIndex: '100'}} src={cmt.Classify === 'user' ? `http://localhost:8080/api/v12/avtuser/${cmt.Avt}`: `${cmt.Avt}` } />
                                                    </div>
                                                    <div className='content_showcomment-user'>
                                                        <div className='content_showcomment-item-name'>
                                                            <h2 style={{margin: '0'}}>{cmt.NameUser}</h2>
                                                        </div>
                                                        <div className='content_showcomment-item-start'>
                                                                <RenderStar Star = {cmt.Star}/>
                                                        </div>
                                                        <div className='content_showcomment-item-date'>
                                                                <span>2024-04-01 10:59 </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='content_showcomment-item_comment'>
                                                    <p>{cmt.Containt}</p>
                                                </div>
                                                {cmt.RepComment.length === 0 ? (null) : (
                                                    <div className='content_showcomment-item_rep-comment'>
                                                    <p><strong>Từ người bán: </strong>{cmt.RepComment}</p>
                                                </div>
                                                )}
                                            </div>
                                            )))
                                        ) : (
                                            <div className='no_comment'>
                                                <h1>Chưa có đánh giá</h1>
                                            </div>
                                        ))}
                                        </div>
                                    </div>
                                    <div className='Detail_mobile-pay-container'>
                                            <div className='Detail_mobile-pay-price'>
                                                <span style={{color:'#a5a5a5'}}>Price</span>
                                                <span style={{color: 'rgba(199, 125, 77, 1)'}}>Rp:{product.Price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫'}</span>
                                            </div>
                                            <div className='Detail_mobile-pay'>
                                            <button>Buy Now</button>
                                            </div>
                                    </div>
                                    </div>                             
                                </div>
                            ) : null)
                        ))}
                        </>
                    ) : null)}
                    </div>
                    {/* Coupon */}
            </div>
        
        </>
     );
}

export default App;