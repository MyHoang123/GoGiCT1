

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRocketchat } from '@fortawesome/free-brands-svg-icons';
import { faSquareCaretDown, faCaretDown, faCheckDouble } from '@fortawesome/free-solid-svg-icons';
import { useState, useRef, useEffect, memo } from "react";
function Chat({ cx, socket }) {
    const [chat, setChat] = useState(false)
    const [message, setMessage] = useState([])
    const valueChat = useRef()

    const handleClickSendChat = (e) => {
        e.preventDefault()
        const check = valueChat.current.value.split('').some(char => char !== ' ')
        if (check) {
            const now = new Date()
            const time = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`
            const data = {
                IdReceiver: 1,
                time: time,
                containt: valueChat.current.value
            }
            socket.emit('chat', data, (response) => {
                if (response === 'Thanh cong') {
                    data.Status = 0
                    setMessage(prev => [...prev, data])
                    valueChat.current.value = ''
                    valueChat.current.focus()
                    socket.on('repchat', (status) => {
                        if (status === null) {
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
    }
    const handleClickOpenChat = () => {
        if (socket) {
            setChat(true)
            socket.emit('sendMessage', { IdSend: 1 }, (response) => {
                if (response.message === 'Thanh Cong') {
                    setMessage(response.Data)
                }
            })
        }
    }
    useEffect(() => {
        if (socket !== null) {
            socket.on('chat', (data) => {
                const newArr = {
                    IdSend: data.IdSend,
                    IdReceiver: data.IdReceiver,
                    time: data.time,
                    containt: data.containt
                }
                if (data !== null) {
                    const repMessage = {
                        IdSend: newArr.IdSend,
                        Status: chat ? 1 : 0
                    }
                    socket.emit('repchat', repMessage)
                    setMessage(prev => [...prev, newArr])
                }
            })
            socket.on('sendMessage', (data) => {
                if (data !== null) {
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
    }, [socket, chat, message])
    return (
        <>
            <div onClick={() => handleClickOpenChat()} style={chat ? { opacity: '0' } : { opacity: '1', transition: 'opacity 1s .2s ease-in-out' }} className={cx('chat_container')}>
                <span>Chat</span>
                <FontAwesomeIcon icon={faRocketchat} />
            </div>
            <div style={chat ? { opacity: '1', transform: 'scale(1)' } : { opacity: '0', transform: 'scale(0)' }} className={cx('massage_content')}>
                <div className={cx('card_chat')}>
                    <div className={cx('chat-header')}>
                        <span>Chat</span>
                        <div onClick={() => setChat(false)}>
                            <FontAwesomeIcon icon={faSquareCaretDown} />
                        </div>
                    </div>
                    <div className={cx('chat-window')}>
                        <div>
                            {message.map((ms, index) => (
                                <div key={index}>
                                    <ul key={index} style={index === message.length - 1 ? { marginBottom: '8px' } : null} className={ms.IdReceiver !== 1 ? cx('message-list-rep') : cx('message-list-user')}>
                                        <li>
                                            {index === 0 ? (
                                                <FontAwesomeIcon className={ms.IdReceiver !== 1 ? cx('massage_list-icon') : cx('massage_list-icon-user')} icon={faCaretDown} />
                                            ) : (
                                                message[index - 1].IdSend !== ms.IdSend ? <FontAwesomeIcon className={ms.IdReceiver !== 1 ? cx('massage_list-icon') : cx('massage_list-icon-user')} icon={faCaretDown} /> : null
                                            )}
                                            <p>{ms.containt}<span className={cx('massage_list-time')}>{ms.time}</span></p>
                                        </li>
                                    </ul>
                                    {(index === message.length - 1 && ms.IdSend !== 1) ? (
                                        <div className={cx('massage_content_body-content_status')}>{ms.Status === 1 ? (<span><FontAwesomeIcon style={{ marginBottom: '1px' }} icon={faCheckDouble} />Đã Xem</span>) : (<span><FontAwesomeIcon style={{ marginBottom: '1px' }} icon={faCheckDouble} />Đã Nhận</span>)}</div>
                                    ) : null}
                                </div>

                            ))}
                        </div>
                    </div>
                    <form onSubmit={(e) => handleClickSendChat(e)} className={cx('chat-input')}>
                        <input ref={valueChat} type="text" className={cx('message-input')} spellCheck={false} placeholder="Type your message here" />
                        <button type='submit' className={cx('send-button')}>Send</button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default memo(Chat);