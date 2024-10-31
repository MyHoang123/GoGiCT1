import axios from 'axios';
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar,faArrowTurnDown } from '@fortawesome/free-solid-svg-icons';
import { Cookies } from 'react-cookie';
import { RenderStar } from '~/hooks'

import classNames from "classnames/bind"
import styles from './comment.module.scss'
import { useCallback, useEffect, useRef, useState } from 'react';
const cx = classNames.bind(styles)



function Comment() {
  const cookies = new Cookies()
    const [checkRep,setCheckRep] = useState(null)
    const [StarAllCmt,setStarAllCmt] = useState(null)
    const [commentAll,setCommentAll] = useState([])
    const [comment,setComment] = useState([])
    const inputRef = useRef([])
           // Gửi dữ liệu lên API
   async function showComment(Comment) {
    try {
        const response = await axios.post('http://localhost:8080/api/v12/showcomment', Comment);
        if(response.data.massege === "Thanh Cong") {
            setComment(response.data.data)
        }
       else {
        setComment([])
        inputRef.current[Comment.index].value = ''
       }
    } catch (error) {
        console.error('Lỗi khi thêm sản phẩm:', error);
        // Xử lý lỗi tại đây.
    }
    }
               // Gửi dữ liệu lên API
   async function createRepComment(Comment) {
    try {
        const response = await axios.post('http://localhost:8080/api/v12/repcomment', Comment);
        if(response.data.massege === "Thanh cong") {
            setComment(prev => {
            const newArr = [...prev]
            newArr[Comment.index].RepComment = `${Comment.RepComment}`
            return newArr
            })
            setCheckRep(null)
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Your work has been saved",
                showConfirmButton: false,
                timer: 1500
                });
        }
    } catch (error) {
        alert('Có lõi xảy ra vui lòng thử lại')
    }
    }
    const handleClickShowComment = useCallback((IdProduct,Star) => {
        const Comment = {
            IdProduct: IdProduct,
            token: cookies.get('AccessTokenAdmin')
        }
        setStarAllCmt(Star)
        showComment(Comment)
    },[])
    const handleClickCreateRepComment = useCallback((i,Id,checkRep,value) => {
        if(i === checkRep) {
            if(value.trim().length > 0) {
                    const Comment = {
                        index: i,
                        RepComment: value,
                        Id: Id,
                        token: cookies.get('AccessTokenAdmin')
                    }
                    createRepComment(Comment)
            }
            else {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "VUi lòng nhập đánh giá !",
                    footer: '<a href="#">Why do I have this issue?</a>'
                  });
            }
        }
    },[])
    useEffect(() => {
        axios.all([
            axios.post('http://localhost:8080/api/v12/showcommentadmin',{
                token: cookies.get('AccessTokenAdmin')
            }),
        ])
            .then(axios.spread((comments,) => {
                setCommentAll(comments.data.data)
            }))
            .catch (err => {
                console.error()
            })
    },[])
    return ( 
        <div className={cx('Comment_container')}>
            <div className={cx('Comment_product')}>
                <div className={cx('Comment_product_header')}>
                    <h2>Sản phẩm</h2>
                </div>
                {commentAll.map((comment,i) => (
                    <div key={i} onClick={() => handleClickShowComment(comment.Id,comment.Star)} className={cx('Comment_product_container')}>
                        <div className={cx('Comment_product_container_img')}>
                            <img src={`http://localhost:8080/api/v12/showimgproduct/${comment.Img}`} />
                        </div>
                        <div className={cx('Comment_product_container_info')}>
                            <h2>{comment.Name}</h2>
                            <h3>{comment.Price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '₫'}</h3>
                            <div className={cx('Comment_product_container_footer')}>
                                <div className={cx('Comment_product_container_start')}>
                                    <RenderStar Star={comment.Star} />
                                </div>
                                <div className={cx('Comment_product_container_sale')}>
                                    <span>Đã bán: {comment.Sales}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className={cx('Comment_containt')}>
                    <h1>Đánh giá</h1>
                    <div className={cx('Comment_containt_nav')}>
                        {StarAllCmt !== null ? (
                        <div className={cx('Comment_containt_nav_allstart')}>
                                <span>{StarAllCmt}/5</span>
                                <div className={cx('Comment_product_container_start')}>
                                <RenderStar Star={StarAllCmt} />
                            </div>
                        </div>
                        ) : null}
                        <div className={cx('Comment_containt_nav_filterstart')}>
                            <div className={cx('Comment_containt_nav_filterstart_btn')}>5 Sao</div>
                            <div className={cx('Comment_containt_nav_filterstart_btn')}>4 Sao</div>
                            <div className={cx('Comment_containt_nav_filterstart_btn')}>3 Sao</div>
                            <div className={cx('Comment_containt_nav_filterstart_btn')}>2 Sao</div>
                            <div className={cx('Comment_containt_nav_filterstart_btn')}>1 Sao</div>
                        </div>
                    </div>
                    <div className={cx('Comment_containt_body')}>
                        {comment.map((cmt,i) => (
                            <div key={i} className={cx('Comment_containt_body-item')}>
                                <div className={cx('Comment_containt_body-item_user')}>
                                    <div className={cx('Comment_containt_body-user_img')}>
                                    <img style={{borderRadius:'50%',width:'100%',height:'100%',objectFit:'cover'}} src={cmt.Classify === 'user' ? `http://localhost:8080/api/v12/avtuser/${cmt.Avt}`: `${cmt.Avt}` }/>
                                    </div>
                                    <div className={cx('Comment_containt_body-user_infouser')}>
                                        <h4 style={{margin:'0'}}>{cmt.UserName}</h4>
                                        <div className={cx('Comment_product_container_start')}>
                                            <RenderStar Star={cmt.Star} />
                                            {/* <FontAwesomeIcon style={{color: '#fc0',paddingLeft:'0'}} icon={faStar} />
                                            <FontAwesomeIcon style={{color: '#fc0',paddingLeft:'0'}} icon={faStar} />
                                            <FontAwesomeIcon style={{color: '#fc0',paddingLeft:'0'}} icon={faStar} />
                                            <FontAwesomeIcon style={{color: '#fc0',paddingLeft:'0'}} icon={faStar} />
                                            <FontAwesomeIcon style={{color: '#fc0',paddingLeft:'0'}} icon={faStar} /> */}
                                        </div>
                                        <span>2024-04-01 10:59</span>
                                    </div>
                                </div>
                                <div className={cx('Comment_containt_body-item_content')}>
                                    <p>{cmt.Containt}</p>
                                    {cmt.RepComment.length === 0 ? (
                                        <div className={cx('Comment_containt_body-item_content-time')}>
                                            {checkRep === i ? (
                                            <div onClick={() => setCheckRep(null)} className={cx('Comment_containt_body-item_content_repcoment')}>
                                            <span style={{marginRight:'8px'}}>Trở lại</span>
                                            <FontAwesomeIcon style={{transform:'rotate(90deg)'}} icon={faArrowTurnDown} />
                                            </div>
                                            ) : (
                                            <div onClick={() => setCheckRep(i)} className={cx('Comment_containt_body-item_content_repcoment')}>
                                            <span style={{marginRight:'8px'}}>Phản hồi</span>
                                            <FontAwesomeIcon style={{transform:'rotate(90deg)'}} icon={faArrowTurnDown} />
                                            </div>
                                            )}
                                            <div style={checkRep === i ? {display:'flex'}:{display:'none'}} className={cx('Comment_containt_body-item_content_repcoment_input')}>
                                                <textarea ref={e => inputRef.current[i] = e} placeholder='Trả lời đánh giá của người dùng' spellCheck={false}></textarea>
                                                <span onClick={() => handleClickCreateRepComment(i,cmt.Id,checkRep,inputRef.current[i].value)}>Lưu</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className={cx('RepComment_container')}>
                                            <span>Phản hồi: {cmt.RepComment}</span>
                                            <div className={cx('RepComment_container_edit')}>
                                                <span>Chỉnh sửa</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
            </div>
        </div>
     );
}

export default Comment;