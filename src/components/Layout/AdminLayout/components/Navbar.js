import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell,faMessage } from '@fortawesome/free-solid-svg-icons';
import { memo, useEffect, useRef, useState, useContext  } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import { Cookies } from 'react-cookie'

function Navbar( {socket,handleOnclick } ) {
const cookies = new Cookies()
const navigate = useNavigate()
	const [notifis,setNotifis] = useState([])
	const [Amount,setAmount] = useState(0)
	const [idNoti,setIdnoti] = useState(null)
	const notifice = useRef()
	async function updateNoti(Token) {
        try {
                const response = await axios.post('https://severgogi.onrender.com/api/v12/updatenoti', Token);
                if(response.data.massege === 'thanh cong') {
					setAmount(0)
                }
        
            } catch (error) {
             	alert('Có lói xảy ra vui lòng thử lại')
                // Xử lý lỗi tại đây.
            }
        }
	const handleMouseEnter = () => {
		notifice.current.classList.add('show')
		if(Amount !== 0) {
			if(cookies.get('AccessTokenAdmin') !== undefined) {
				const Token = {
					token: cookies.get('AccessTokenAdmin')
				}
				updateNoti(Token)
			}
		}
		// Thực hiện các hành động khác khi hover
	  };
	  const handleMouseLeave = () => {
		  try {
			  axios.post('https://severgogi.onrender.com/api/v12/sendnoti', {token: cookies.get('AccessTokenAdmin')});
		  } catch (error) {
				  alert('Có lói xảy ra vui lòng thử lại')
			  // Xử lý lỗi tại đây.
		  }
		if(notifice.lenght !== 0) {
			const result = notifis.reduce((acc,curr) => {
				const temp = {...curr}
				temp.Status = 1
				return [...acc,temp]
			},[])
			setNotifis(result)
		}
		notifice.current.classList.remove('show')
		// Thực hiện các hành động khác khi rời chuột ra khỏi phần tử
	  };
	  const handleLickOpenNotiBill = (data) => {
		navigate(`/showbill/${data}`)
	  }
 // API
 useEffect(() => {
	if(cookies.get('AccessTokenAdmin') !== undefined) {	
		if(socket !== null) {
			socket.on('repNewbill', (data) => {
				setIdnoti(data)
			});
		const Account = {
			token: cookies.get('AccessTokenAdmin')
		}
		axios.all([
		  axios.post('https://severgogi.onrender.com/api/v12/shownotifi',Account),
		])
		  .then(axios.spread((Noti) => {
			if(Noti.data.massege === 'Thanh cong') {
				setNotifis(Noti.data.data)
				setAmount(Noti.data.lenght)
			}
		  }))
		  .catch (err => {
			  console.error()
		  })
		  return () => socket.off('repNewbill')
		}
	}
  }, [idNoti,socket])
    return ( 
        <>
			<nav className="navbar navbar-expand navbar-light navbar-bg">
				<a onClick={handleOnclick} className="sidebar-toggle js-sidebar-toggle">
          <i className="hamburger align-self-center"></i>
        </a>
				<div className="navbar-collapse">
					<ul className="navbar-nav navbar-align">
						<li onMouseEnter={handleMouseEnter}
								onMouseLeave={handleMouseLeave} className="nav-item dropdown">
							<a className="nav-icon dropdown-toggle" href="#" id="alertsDropdown" data-bs-toggle="dropdown">
								<div style={{top: '6px'}} className="position-relative">
								<FontAwesomeIcon icon={faBell} />
								{Amount === 0 ? null : (
									<span className="indicator">{Amount}</span>
								)}
								</div>
							</a>
							<div ref={notifice} className="dropdown-menu dropdown-menu-lg dropdown-menu-end py-0" aria-labelledby="alertsDropdown">
								<div className="dropdown-menu-header">
									Thông báo
								</div>
								<div className="list-group">
									{notifis.map((noti,i) => (
									<a onClick={() => handleLickOpenNotiBill(noti.IdBill)} key={i} style={noti.Status === 1 ? {backgroundColor:'#fff'} : null} className="list-group-item">
										<div className="row g-0 align-items-center">
											<div className="col-2">
												<i className="text-danger" data-feather="alert-circle"></i>
											</div>
											<div className="col-10">
												<div className="text-dark">{noti.Containt}</div>
												<div className="text-muted small mt-1">Thông báo sẽ tự biến mất sau 24h.</div>
												<div className="text-muted small mt-1">{noti.Time}</div>
											</div>
										</div>
									</a>
									))}
								</div>
								<div className="dropdown-menu-footer">
									<a href="#" className="text-muted">Show all notifications</a>
								</div>
							</div>
						</li>
						<li className="nav-item dropdown">
							<a className="nav-icon dropdown-toggle" href="#" id="messagesDropdown" data-bs-toggle="dropdown">
								<div style={{top: '6px'}} className="position-relative">
								<FontAwesomeIcon icon={faMessage} />
								</div>
							</a>
							<div className="dropdown-menu dropdown-menu-lg dropdown-menu-end py-0" aria-labelledby="messagesDropdown">
								<div className="dropdown-menu-header">
									<div style={{top: '6px'}} className="position-relative">
										4 New Messages
									</div>
								</div>
								<div className="list-group">
									<a href="#" className="list-group-item">
										<div className="row g-0 align-items-center">
											<div className="col-2">
												<img src="img/avatars/avatar-5.jpg" className="avatar img-fluid rounded-circle" alt="Vanessa Tucker"/>
											</div>
											<div className="col-10 ps-2">
												<div className="text-dark">Vanessa Tucker</div>
												<div className="text-muted small mt-1">Nam pretium turpis et arcu. Duis arcu tortor.</div>
												<div className="text-muted small mt-1">15m ago</div>
											</div>
										</div>
									</a>
									<a href="#" className="list-group-item">
										<div className="row g-0 align-items-center">
											<div className="col-2">
												<img src="img/avatars/avatar-2.jpg" className="avatar img-fluid rounded-circle" alt="William Harris"/>
											</div>
											<div className="col-10 ps-2">
												<div className="text-dark">William Harris</div>
												<div className="text-muted small mt-1">Curabitur ligula sapien euismod vitae.</div>
												<div className="text-muted small mt-1">2h ago</div>
											</div>
										</div>
									</a>
									<a href="#" className="list-group-item">
										<div className="row g-0 align-items-center">
											<div className="col-2">
												<img src="img/avatars/avatar-4.jpg" className="avatar img-fluid rounded-circle" alt="Christina Mason"/>
											</div>
											<div className="col-10 ps-2">
												<div className="text-dark">Christina Mason</div>
												<div className="text-muted small mt-1">Pellentesque auctor neque nec urna.</div>
												<div className="text-muted small mt-1">4h ago</div>
											</div>
										</div>
									</a>
									<a href="#" className="list-group-item">
										<div className="row g-0 align-items-center">
											<div className="col-2">
												<img src="img/avatars/avatar-3.jpg" className="avatar img-fluid rounded-circle" alt="Sharon Lessman"/>
											</div>
											<div className="col-10 ps-2">
												<div className="text-dark">Sharon Lessman</div>
												<div className="text-muted small mt-1">Aenean tellus metus, bibendum sed, posuere ac, mattis non.</div>
												<div className="text-muted small mt-1">5h ago</div>
											</div>
										</div>
									</a>
								</div>
								<div className="dropdown-menu-footer">
									<a href="#" className="text-muted">Show all messages</a>
								</div>
							</div>
						</li>
						<li className="nav-item dropdown">
							<a className="nav-icon dropdown-toggle d-inline-block d-sm-none" href="#" data-bs-toggle="dropdown">
                <i className="align-middle" data-feather="settings"></i>
              </a>
							{/* <a className="nav-link dropdown-toggle d-none d-sm-inline-block" href="#" data-bs-toggle="dropdown">
                <img src={avt} className="avatar img-fluid rounded me-1" alt="Charles Hall" /> <span style={{fontSize: '14px'}} className="text-dark">Hoàng Mỹ</span>
              						</a> */}
							<div className="dropdown-menu dropdown-menu-end">
								<a className="dropdown-item" href="pages-profile.html"><i className="align-middle me-1" data-feather="user"></i> Profile</a>
								<a className="dropdown-item" href="#"><i className="align-middle me-1" data-feather="pie-chart"></i> Analytics</a>
								<div className="dropdown-divider"></div>
								<a className="dropdown-item" href="index.html"><i className="align-middle me-1" data-feather="settings"></i> Settings & Privacy</a>
								<a className="dropdown-item" href="#"><i className="align-middle me-1" data-feather="help-circle"></i> Help Center</a>
								<div className="dropdown-divider"></div>
								<a className="dropdown-item" href="#">Log out</a>
							</div>
						</li>
					</ul>
				</div>
			</nav>
        </>
     );
}

export default memo(Navbar);