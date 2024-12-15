
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import io from 'socket.io-client';
import {  useNavigate } from 'react-router-dom'
import axios from 'axios'
import classNames from "classnames/bind"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faMessage,faAngleDown,faMagnifyingGlass,faCaretDown, faCheckDouble,faTrashCan } from '@fortawesome/free-solid-svg-icons';
import {faSquareCaretRight as faSquareCaretRightRegular,faSquareCaretDown as faSquareCaretDownRegular,faPaperPlane as faPaperPlaneRegular, faSquareCaretLeft as faSquareCaretLeftRegular  } from '@fortawesome/free-regular-svg-icons'; 
import styles from './Admin.module.scss'
import { Cookies } from 'react-cookie'
import  './scss/app.scss';
import {useCallback, useEffect, useRef, useState, createContext} from 'react';
export const ElementContextAdmin = createContext()
const cx = classNames.bind(styles)
function AdminLayout( {Children} ) {
    const cookies = new Cookies()
    const navigate = useNavigate()
    const [chat,setChat] = useState(false)
    const [socket, setSocket] = useState(null)
    const [socketOrder, setSocketOrder] = useState(null)
    const [chatHiden,setChatHiden] = useState(false)
    const [filterChat,setFilterChat] = useState(false)
    const [notiuser,setNotiuser] = useState(false)
    const [message, setMessage] = useState([])
    const [activeUser,setActiveUser] = useState({})
    const [listMessage, setListMessage] = useState([])
    const mainRef = useRef()
    const valueChat = useRef()
    const bodyMassageRef = useRef()
    // Api
    async function getMessageList() {
        try {
                const response = await axios.post('https://severgogi.onrender.com/api/v12/showallchat', {
                    token: cookies.get('AccessTokenAdmin')
                });
                if(response.data.massege === 'Thanh cong') {
                    setListMessage(response.data.data)
                }
                else {
                }
            } catch (error) {
             alert('Có lói xảy ra vui lòng thử lại')
                // Xử lý lỗi tại đây.
            }
        }
    const handleAddClass = useCallback(() => {
        if(mainRef.current.classList.length === 1) {
            mainRef.current.classList.add('collapsed');
        }
        else {
            mainRef.current.classList.remove('collapsed');
        }
    },[])
    const handleClickSendChat = (e) => {
        e.preventDefault()
        if(Object.keys(activeUser).length !== 0) {
            const check = valueChat.current.value.split('').some(char => char !== ' ')
             if(check) {
                 const now = new Date()
                 const time = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`
                 if(message.length !== 0 ){
                     const data = {
                         IdReceiver: activeUser.Id,
                         time: time,
                         containt: valueChat.current.value
                     }
                     socket.emit('chat',data,(response) => {
                        if(response === 'Thanh cong') {
                            data.Status = 0
                            setMessage(prev => [...prev,data])
                            valueChat.current.value = ''
                            valueChat.current.focus()
                            bodyMassageRef.current.scrollTop = bodyMassageRef.current.scrollHeight
                            socket.on('repchat',(status) => {
                                if(status === null) {
                                    alert('Đã xảy ra lõi vui lòng thử lại')
                                }
                                else {
                                    setMessage(prev => {
                                        const newArr = [...prev]
                                        newArr[newArr.length - 1].Status = status.Status
                                        return newArr
                                    })
                                    valueChat.current.value = ''
                                    valueChat.current.focus()
                                    socket.off('repchat')
                                }
                            })
                        }
                        else {
                            alert('Gửi lõi')
                        }
                    })
                 }
                //  else {
                //      const data = {
                //          IdReceiver: activeUser.Id,
                //          time: time,
                //          containt: valueChat.current.value
                //      }
                //      setMessage(prev => [...prev,data])
                //         socket.emit('chat',data)
                //         valueChat.current.value = ''
                //         valueChat.current.focus()
                //         bodyMassageRef.current.scrollTop = bodyMassageRef.current.scrollHeight
                        
                //  }
        }
        else {
            alert('Có lõi xảy ra vui lòng thử lại !')
        }
                
        }
    }
    const handleClickOpenChat = useCallback((listMessage) => {
            if(listMessage.length === 0) {
                getMessageList()
            }
            setChat(true)
        },[])
    const handleClickUser = useCallback((Name,Iduser,socket,listMessage) => {
        if(Name !== null) {
            socket.emit('sendMessage',{IdSend:Iduser},(response)=> {
                if(response.message === 'Thanh Cong') {
                    const result = listMessage.reduce((acc,curr) => {
                        if(curr.IdSend === Iduser) {
                            const newOb = curr
                            newOb.Count = 0
                            return [...acc,newOb]
                        }
                        return [...acc,curr]
                  },[])
                    setListMessage(result)
                    setMessage(response.Data)
                    setActiveUser({Name:Name,Id:Iduser})
                }
                else {
                    alert('Có lõi xảy ra vui lòng thử lại')
                }
            })
        }
    },[])
    const handleClickFilterChat = (e) => {
        e.stopPropagation()
        setFilterChat(true)
    }
    const handleClickOffNoti = () => {
        if(filterChat) {
            setFilterChat(false)
        }
        if(notiuser) {
            setNotiuser(false)
        }
    }
    const handleClickShowNotiuser = (e) => {
        e.stopPropagation()
        setNotiuser(true)
    }
    useEffect(() => {
        if(cookies.get('AccessTokenAdmin') !== undefined) {
           const newSocket = io('https://severgogi.onrender.com',{
            auth: {
                token: cookies.get('AccessTokenAdmin')
            }
           })
           const newSocketOrder = io(`${process.env.REACT_APP_IP_SEVER}`,{
            auth: {
                token: cookies.get('AccessTokenAdmin')
            }
           })
           setSocket(newSocket)
           setSocketOrder(newSocketOrder)
            return () => {
                newSocket.disconnect()
                newSocketOrder.disconnect()
            }
        }
        else {
            navigate('/admin/login')
        }
    },[])
    useEffect(() => {
        if(socket !== null) {
            socket.on('chat',(data) => {
                if(data.IdSend === activeUser.Id) {
                    setMessage(prev => [...prev,data])
                    const result = listMessage.reduce((acc,curr) => {
                                if(curr.IdSend === data.IdSend) {
                                        const newOb = {
                                            ...curr,
                                            containt: data.containt,
                                        }
                                      return  [newOb,...acc]
                                }
                                return [...acc,curr]
                    },[])
                    if(chat) {
                        const repMessage = {
                            IdSend: data.IdSend,
                            Status: 1
                        }
                        socket.emit('repchat',repMessage)
                        setListMessage(result)
                    }
                    else {
                        const repMessage = {
                            IdSend: data.IdSend,
                            Status: 0
                        }
                        socket.emit('repchat',repMessage)
                        setListMessage(result)
                    }
                }    
                else {
                    let check = 0
                    const result = listMessage.reduce((acc,curr) => {
                        if(curr.IdSend === data.IdSend) {
                            check = 1
                            const newOb = {
                                ...curr,
                                containt: data.containt,
                                Count: curr.Count + 1
                            }
                          return  [newOb,...acc]
                        }
                        return  [...acc,curr]
                        },[])
                        if(check === 1) {
                                const repMessage = {
                                    IdSend: data.IdSend,
                                    Status: 0
                                }
                                socket.emit('repchat',repMessage)
                            setListMessage(result)
                        }
                        else {
                            const repMessage = {
                                IdSend: data.IdSend,
                                Status: 0
                            }
                            socket.emit('repchat',repMessage)
                            getMessageList() 
                        }
                }
             })
             socket.on('sendMessage',(data)=> {
                if(data === activeUser.Id && message.length > 0) {
                    const newArr = [...message]
                    newArr[newArr.length - 1].Status = 1
                    setMessage(newArr)
                }
             })
             return () => {
                socket.off('chat')
                socket.off('sendMessage')
             }
            }
    },[socket,activeUser,listMessage,message,chat])
    // useEffect(() => {
    //     const handleLoad = () => {
    //       };
    //       window.addEventListener('load', handleLoad);
    //       return () => {
    //         window.removeEventListener('load', handleLoad);
    //       };
    // },[location])
    if(cookies.get('AccessTokenAdmin') !== undefined) {
        return ( 
            <div className='body_admin'>
                {/* <div className='load_admin'>

                </div> */}
                <div className='Sidebar_container'>
            <Sidebar cookies = {cookies}  />
                </div>
            <div ref={mainRef} className='main'>
                <Navbar socket={socket !== null ? socket : null} handleOnclick={handleAddClass} />
                <main className='content'>
                    <div className='container-fluid p-0'>
                        <ElementContextAdmin.Provider value={{socket,socketOrder,cookies}}>
                               {Children}
                        </ElementContextAdmin.Provider>
                    </div>
                </main>
            </div>
                    <div onClick={() => handleClickOpenChat(listMessage)} style={chat ? {opacity:'0'} : {opacity:'1',transition:'opacity 1s .3s ease-in-out'}} className={cx('chat_container-admin')}>
                        <span>Chat</span>
                        <FontAwesomeIcon icon={faMessage} />
                    </div>
                    <div onClick={handleClickOffNoti} style={chat ? {opacity:'1',transform:'scale(1)',width: chatHiden ? '226px' : '642px'} : {opacity:'0',transform:'scale(0)',width: chatHiden ? '226px' : '642px'}} className={cx('massage_content')}>
                        <div className={cx('massage_content_header')}>
                            <h2>Chat</h2>
                            <div className={cx('massage_content_header-icon')}>
                                {chatHiden ? (
                                    <FontAwesomeIcon onClick={() => setChatHiden(false)} icon={faSquareCaretLeftRegular} />
                                ) : (
                                    <FontAwesomeIcon onClick={() => setChatHiden(true)} icon={faSquareCaretRightRegular} />
                                )}
                                 <FontAwesomeIcon onClick={() => setChat(false)} icon={faSquareCaretDownRegular} />
                            </div>
                        </div>
                        <div className={cx('massage_content_sidebar')}>
                            <div className={cx('massage_content_sidebar_find')}>
                                <div className={cx('massage_content_sidebar_find-input')}>
                                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                                    <input type='text' placeholder='Tìm kiếm'/>
                                </div>
                                <div onClick={(e) => handleClickFilterChat(e)} className={cx('massage_content_sidebar_find-filter')}>
                                    <h3 style={{marginBottom:'0'}}>Tất cả</h3>
                                    <FontAwesomeIcon icon={faAngleDown} />
                                </div>
                                <div >
                                    <ul style={filterChat ? {display:'block'}  : {display:'none'}} className={cx('massage_content_sidebar_find-filter_list')}>
                                        <li>Tất cả</li>
                                        <li>Chưa đọc</li>
                                    </ul>
                                </div>
                            </div>
                            <div className={cx('massage_content_sidebar_list_1')}>
                            {listMessage.map((ls,index) => (
                                <div onClick={() => handleClickUser(ls.Name,ls.IdSend,socket,listMessage)} key={index} style={activeUser.Name === ls.Name ? {background:'rgba(0, 0, 0, 0.08)'} : null} className={cx('massage_content_sidebar_list')}>
                                    <div className={cx('massage_content_sidebar_list-avt')}>
                                        <img style={{borderRadius:'50%',width:'35px',height:'35px',objectFit:'cover'}} src={ls.Name.length === 10 ? `https://severgogi.onrender.com/api/v12/avtuser/${ls.Avt}`: `${ls.Avt}` }/>
                                    </div>
                                    <div className={cx('massage_content_sidebar_list-user')}>
                                        <h2>{ls.Name}</h2>
                                        <h3>{ls.containt}</h3>
                                    </div>
                                    <span style={ls.Count === 0 ? {display:'none'}: null} className={cx('massage_content_sidebar_list_count')}>{ls.Count}</span>
                                    <div className={cx('massage_content_sidebar_list-time')}>
                                        <h3>{ls.Date}</h3>
                                        <FontAwesomeIcon className={cx('massage_content_sidebar_list-time-icon')} icon={faTrashCan} />
                                    </div>
                                </div>
                            ))}
                            </div>
                        </div>
                        <div style={chatHiden ? {opacity:'0'} : null} className={cx('massage_content_body')}>
                            {activeUser.length !== 0 ? (
                                    <nav className={cx('massage_content_body-nav')}>
                                        <h2 onClick={(e) => handleClickShowNotiuser(e)}>{activeUser.Name} </h2><FontAwesomeIcon style={{marginBottom:'0',height:'11px',color:'#888'}} icon={faAngleDown} />
                                        <div style={notiuser ? {display:'block'}:{display:'none'}} className={cx('massage_content_body-nav-list')}>
                                            <div className={cx('massage_content_body-nav-list_item')}>
                                                <h4>Tắt thông báo</h4>
                                                <label className={cx('switch')}>
                                                     <input type="checkbox"/>
                                                </label>
                                            </div>
                                            <div className={cx('massage_content_body-nav-list_item')}>
                                                <h4>Chặn người dùng</h4>
                                                <label className={cx('switch')}>
                                                     <input type="checkbox"/>
                                                </label>
                                            </div>
                                            <div style={{borderTop:'1px solid #f5f5f5'}} className={cx('massage_content_body-nav-list_item')}>
                                                <h4>Xem thông tin cá nhân</h4>
                                            </div>
                                        </div>
                                    </nav>
                            ):null} 
                            {activeUser.Id === undefined ? (
                                    <div className={cx('message_img_no')}>
                                    <svg width="301" height="180" viewBox="0 0 301 180" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.5 162C4.5 160.895 5.39543 160 6.5 160H282.5C283.605 160 284.5 160.895 284.5 162C284.5 163.105 283.605 164 282.5 164H6.5C5.39543 164 4.5 163.105 4.5 162Z" fill="#666666"></path><path d="M69.6355 28.0653C70.1235 21.8195 75.3341 17 81.5991 17H239.627C246.585 17 252.085 22.9 251.597 29.8417L243.5 145H60.5L69.6355 28.0653Z" fill="#B7B7B7"></path><path d="M78.2114 33.6879C78.3743 31.6062 80.1111 30 82.1992 30H237.212C239.531 30 241.363 31.9648 241.202 34.2776L233.5 145H69.5L78.2114 33.6879Z" fill="white"></path><path d="M56.5 148H243.5L243.171 149.973C242.207 155.759 237.201 160 231.334 160H56.5V148Z" fill="#666666"></path><path d="M27.5 150.4C27.5 149.075 28.5745 148 29.9 148H221.5C221.5 154.627 216.127 160 209.5 160H37.1C31.7981 160 27.5 155.702 27.5 150.4Z" fill="#B7B7B7"></path><path d="M96.5 148H152.5C152.5 151.866 149.366 155 145.5 155H103.5C99.634 155 96.5 151.866 96.5 148Z" fill="#666666"></path><path fillRule="evenodd" clipRule="evenodd" d="M98.0769 44C94.933 44 92.3223 46.4267 92.0929 49.5621L89.9709 78.5621C89.7165 82.039 92.4687 85 95.9549 85H176.923C180.067 85 182.677 82.5733 182.907 79.4379L185.029 50.4379C185.283 46.961 182.531 44 179.045 44H98.0769ZM103.5 59.5C103.5 58.6716 104.171 58 105 58H166C166.828 58 167.5 58.6716 167.5 59.5C167.5 60.3284 166.828 61 166 61H105C104.171 61 103.5 60.3284 103.5 59.5ZM102.5 69.5C102.5 68.6716 103.171 68 104 68H141C141.828 68 142.5 68.6716 142.5 69.5C142.5 70.3284 141.828 71 141 71H104C103.171 71 102.5 70.3284 102.5 69.5Z" fill="#2673DD"></path><path d="M90.5 98.5C90.5 97.6716 91.1716 97 92 97H167C167.828 97 168.5 97.6716 168.5 98.5C168.5 99.3284 167.828 100 167 100H92C91.1716 100 90.5 99.3284 90.5 98.5Z" fill="#B7B7B7"></path><path d="M89.5 108.5C89.5 107.672 90.1716 107 91 107H152C152.828 107 153.5 107.672 153.5 108.5C153.5 109.328 152.828 110 152 110H91C90.1716 110 89.5 109.328 89.5 108.5Z" fill="#B7B7B7"></path><path d="M90 117C89.1716 117 88.5 117.672 88.5 118.5C88.5 119.328 89.1716 120 90 120H118C118.828 120 119.5 119.328 119.5 118.5C119.5 117.672 118.828 117 118 117H90Z" fill="#B7B7B7"></path><path d="M202.239 80C198.129 80 194.688 83.1144 194.279 87.204L193.266 97.3377L184.954 100.455C184.273 100.71 184.084 101.584 184.598 102.098L192.045 109.545L190.879 121.204C190.408 125.913 194.107 130 198.839 130H264.614C268.785 130 272.256 126.796 272.589 122.638L275.309 88.638C275.681 83.983 272.004 80 267.334 80H202.239Z" fill="#EE4D2D"></path><path d="M218 104C218 106.209 216.209 108 214 108C211.791 108 210 106.209 210 104C210 101.791 211.791 100 214 100C216.209 100 218 101.791 218 104Z" fill="white"></path><path d="M235 104C235 106.209 233.209 108 231 108C228.791 108 227 106.209 227 104C227 101.791 228.791 100 231 100C233.209 100 235 101.791 235 104Z" fill="white"></path><path d="M249 108C251.209 108 253 106.209 253 104C253 101.791 251.209 100 249 100C246.791 100 245 101.791 245 104C245 106.209 246.791 108 249 108Z" fill="white"></path></svg>    
                                    <h2>Chào mừng bạn đến với GoGi Chat</h2>
                                    <h3>Bất đầu trả lời người mua</h3>
                                    </div>
                            ) :
                            (
                                <div ref={bodyMassageRef} className={cx('massage_content_body-content')}>
                                <div>
                                    {message.map((ms,index) => (
                                        <div key={index}>
                                        <ul className={ms.IdReceiver === 1 ? cx('massage_content_body-content-rep') : cx('massage_content_body-content-user')}>
                                            <li style={index === message.length - 1 ? {marginBottom:'8px'}: null}> 
                                            {index === 0 ? (
                                            <FontAwesomeIcon className={ms.IdReceiver === 1 ? cx('massage_content_body-content-rep-icon') : cx('massage_content_body-content-user-icon')} icon={faCaretDown} />
                                        ) : (
                                            message[index - 1].IdSend !== ms.IdSend ? <FontAwesomeIcon className={ms.IdReceiver === 1 ? cx('massage_content_body-content-rep-icon') : cx('massage_content_body-content-user-icon')} icon={faCaretDown} /> : null
                                        )}
 
                                                <p>{ms.containt} <span className={cx('massage_content_body-content-time')}>{ms.time}</span></p>
                                            </li>
                                        </ul>
                                        {(index === message.length - 1 && ms.IdReceiver !== 1)  ? (
                                                <div className={cx('massage_content_body-content_status')}>{ms.Status === 1 ? (<span><FontAwesomeIcon style={{marginBottom:'1px',height:'0.9em'}} icon={faCheckDouble} />Đã Xem</span>) : (<span><FontAwesomeIcon style={{marginBottom:'1px',height:'0.9em'}} icon={faCheckDouble} />Đã Nhận</span>)}</div>
                                        ) : null}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            )
                            }
                           
                            <div className={cx('massage_content_body-massage')}>
                                <div className={cx('wrapper')}>
                                    <span className={cx('circle')}></span>
                                    <span className={cx('circle')}></span>
                                    <span className={cx('circle')}></span>
                                </div>
                                <form className={cx('massage_content_body-massage-containt')} onSubmit={(e) => handleClickSendChat(e)}>
                                        <input ref={valueChat} type='text' placeholder='Nhập nội dung tin nhấn' spellCheck={false} required/>
                                            <FontAwesomeIcon className={cx('massage_content_body-massage-select_send')} icon={faPaperPlaneRegular} />
                                        <button type='submit'>
                                        </button>
                                </form>
                                <div className={cx('massage_content_body-massage-select')}>
                                    <div className={cx('massage_content_body-massage-select-icon')}></div>
                                </div>
                            </div>
                        </div>
                    </div>
            </div>
         );
    }
}

export default AdminLayout;