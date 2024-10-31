import * as Icon from 'react-feather';
import {useRef, useState,useEffect, useCallback, memo } from 'react';
import { Link } from 'react-router-dom';


function Sidebar() {
    const [check, setCheck] = useState(true);
    // const [showScrollbar, setShowScrollbar] = useState(false);

    const sideBar = useRef()
    const sideBarActive = useRef([])

      const handleButtonClick = useCallback((id) => {
        for(let i = 0; i < sideBarActive.current.length; i++) {
            if(sideBarActive.current[i] !==  sideBarActive.current[id]){
                sideBarActive.current[i].classList.remove('active')
            }
        }
         sideBarActive.current[id].classList.add('active')
      },[])
    return (  

        <nav ref={sideBar} id="sidebar" className="sidebar js-sidebar" 
            style={{
                overflowY:  'scroll'
            }}
        >
        <div className="sidebar-content js-simplebar">
            <Link to="/" className="sidebar-brand">
                <span className="align-middle">Hello Admin</span>
               </Link>
            <ul className="sidebar-nav">
                <li className="sidebar-header">
                    Pages
                </li>

                <li onClick={()=>handleButtonClick(0)} ref={el => sideBarActive.current[0] = el} className="sidebar-item">
                    <Link to="/admin" className="sidebar-link">
                        <Icon.Sliders className="align-middle"/> 
                        <span className="align-middle">Dashboard</span>
                     </Link>
                </li>

                <li onClick={()=>handleButtonClick(1)} ref={el => sideBarActive.current[1] = el} className="sidebar-item">
                    <a className="sidebar-link">
                    <Icon.User className="align-middle"/> 
                     <span className="align-middle">Profile</span>
                </a>
                </li>

                <li className="sidebar-header">
                    Tools & Components
                </li>

                <li onClick={()=>handleButtonClick(2)} ref={el => sideBarActive.current[2] = el} className="sidebar-item">
                    <Link to="/showbill" className="sidebar-link">
                            <Icon.AlignLeft style={{width: '24px'}} className="align-middle"/> 
                            <span className="align-middle">Đơn Hàng</span>  
                        </Link>                                
                </li>

                <li onClick={()=>handleButtonClick(3)} ref={el => sideBarActive.current[3] = el} className="sidebar-item">
                    <Link to="/showtable" className="sidebar-link">
                                <Icon.Plus style={{width: '24px'}} className="align-middle"/> 
                                <span className="align-middle">Bàn</span>  
                            </Link>               
                </li>

                <li onClick={()=>handleButtonClick(4)} ref={el => sideBarActive.current[4] = el} className="sidebar-item">
                    <Link to="/open" className="sidebar-link" href="">
                        <Icon.Grid className="align-middle"/> 
                        <span className="align-middle">Hoạt động</span>
                    </Link>
                </li>

                <li onClick={()=>handleButtonClick(5)} ref={el => sideBarActive.current[5] = el} className="sidebar-item">
                    <Link to="/showslider" className="sidebar-link">
                    <Icon.AlignLeft className="align-middle"/> 
                     <span className="align-middle">Slider</span>
                     </Link>
                </li>

                <li onClick={()=>handleButtonClick(6)} ref={el => sideBarActive.current[6] = el} className="sidebar-item">
                    <Link to="/createqr" className="sidebar-link">
                                <Icon.Plus style={{width: '24px'}} className="align-middle"/> 
                                <span className="align-middle">Tạo QR</span>  
                            </Link>               
                </li>
                <li onClick={()=>handleButtonClick(7)} ref={el => sideBarActive.current[7] = el} className="sidebar-item">
                    <Link to="/comment" className="sidebar-link">
                                <Icon.Plus style={{width: '24px'}} className="align-middle"/> 
                                <span className="align-middle">Đánh giá</span>  
                            </Link>               
                </li>
                <li className="sidebar-header">
                    Web Data
                </li>
                <li onClick={()=>handleButtonClick(8)} ref={el => sideBarActive.current[8] = el} className="sidebar-item">
                     <Link to="/showacc" className="sidebar-link">    
                            <Icon.Plus className="align-middle"/> 
                            <span className="align-middle">Tài Khoản</span>                              
                        </Link>
                </li>

                <li onClick={()=>handleButtonClick(9)} ref={el => sideBarActive.current[9] = el} className="sidebar-item">
                    <Link to="/showtypes" className="sidebar-link">                                  
                            <Icon.Plus className="align-middle"/>
                            <span className="align-middle">Nhóm Sản Phẩm</span>
                        </Link>     
                </li>

                <li onClick={()=>handleButtonClick(10)} ref={el => sideBarActive.current[10] = el} className="sidebar-item">
                    <Link to="/showdetailtype" className="sidebar-link">                               
                            <Icon.Plus className="align-middle"/>
                            <span className="align-middle">Chi Tiết Nhóm Sản Phẩm</span>
                        </Link>     
                </li>


                <li onClick={()=>handleButtonClick(11)} ref={el => sideBarActive.current[11] = el} className="sidebar-item">
                    <Link to="/showcategori" className="sidebar-link">
                            <Icon.Plus className="align-middle"/>                                                               
                            <span className="align-middle">Loại Sản Phẩm</span>
                        </Link>
                </li>

                <li onClick={()=>handleButtonClick(12)} ref={el => sideBarActive.current[12] = el} className="sidebar-item">
                    <Link to="/showproduct" className="sidebar-link">
                            <Icon.Plus style={{width: '24px'}} className="align-middle"/> 
                            <span className="align-middle">Sản Phẩm</span>  
                        </Link>                                
                </li>
                <li onClick={()=>handleButtonClick(13)} ref={el => sideBarActive.current[13] = el} className="sidebar-item">
                    <Link to="/showdetailproduct" className="sidebar-link">
                            <Icon.Plus style={{width: '24px'}} className="align-middle"/> 
                            <span className="align-middle">Chi Tiết Sản Phẩm</span>  
                        </Link>                                
                </li>
                <li onClick={()=>handleButtonClick(14)} ref={el => sideBarActive.current[14] = el} className="sidebar-item">
                    <Link to="/showmenu" className="sidebar-link">
                            <Icon.Plus style={{width: '24px'}} className="align-middle"/> 
                            <span className="align-middle">Menu</span>  
                        </Link>                                
                </li>
                <li onClick={()=>handleButtonClick(15)} ref={el => sideBarActive.current[15] = el} className="sidebar-item">
                    <Link to="/showvoucher" className="sidebar-link">
                            <Icon.Plus style={{width: '24px'}} className="align-middle"/> 
                            <span className="align-middle">Voucher</span>  
                        </Link>                                
                </li>
            </ul>

            <div className="sidebar-cta">
                <div className="sidebar-cta-content">
                    <strong className="d-inline-block mb-2">Upgrade to Pro</strong>
                    <div className="mb-3 text-sm">
                        Are you looking for more components? Check out our premium version.
                    </div>
                    <div className="d-grid">
                        <a href="upgrade-to-pro.html" className="btn btn-primary">Upgrade to Pro</a>
                    </div>
                </div>
            </div>
        </div>
    </nav>

    );
}

export default memo(Sidebar);