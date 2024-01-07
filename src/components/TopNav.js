// import { NavLink, Link, useHistory} from "react-router-dom"
// import React, { useState,useEffect, useContext} from 'react';
// import { AuthContext } from '../hook/AuthProvider'
// import nav from '../hook/PhanQuyen'
// const TopNav = () => {
//     const {logout,user,scope} = useContext(AuthContext);
//     const handleSignout = ()=>{
//         logout()
//     }
//     return (
//       <nav className="navbar navbar-expand-sm bg-light navbar-light">
//         <div className="container" id="topNav">
//           <div>
//             <img
//               src="/images/logo1.png"
//               alt="Avatar Logo"
//               style={{ width: "100%" }}
//             />
//           </div>
//           <button
//             className="navbar-toggler"
//             type="button"
//             data-bs-toggle="collapse"
//             data-bs-target="#collapsibleNavbar"
//           >
//             Menu
//             <i className="fa-solid fa-caret-down"></i>
//           </button>

//           <div className="mx-3"></div>

//           <div className="collapse navbar-collapse" id="collapsibleNavbar">
//             <ul className="navbar-nav me-auto">
//               {/* <li className="nav-item me-4">
//                             <NavLink className="nav-link" to="/" exact>Giới thiệu</NavLink>
//                         </li>
//                         <li className="nav-item me-4" >
//                             <NavLink className="nav-link" to="/doctors">Bác sĩ</NavLink>
//                         </li>
//                         <li className="nav-item me-4">
//                             <NavLink className="nav-link" to="/services">Dịch vụ</NavLink>
//                         </li>
//                         <li className="nav-item me-4">
//                             <NavLink className="nav-link" to="/contacts">Liên lạc</NavLink>
//                         </li>
//                         <li className="nav-item me-4">
//                             <NavLink className="nav-link" to="/booking">Đặt lịch</NavLink>
//                         </li>
//                         <li className="nav-item me-4">
//                             <NavLink className="nav-link" to="/manager">Quản lý</NavLink>
//                         </li> */}
//               {scope?.map((val, idx) => {
//                 return (
//                   <li className="nav-item me-4">
//                     <NavLink className="nav-link" to={val.path} exact>
//                       {val.name}
//                     </NavLink>
//                   </li>
//                 );
//               })}
//             </ul>
//           </div>
//           <div className="nav-item" align="right">
//             {user == null && (
//               <NavLink className="nav-link" to="/sign_in">
//                 Đăng nhập
//               </NavLink>
//             )}
//             {user != null && <text className="nav-link">{user.ten}</text>}
//           </div>
//           <div className="dropdown">
//             <button
//               className="d-flex align-items-center justify-content-center link-dark text-decoration-none dropdown-toggle"
//               style={{ border: "none", backgroundColor: "transparent" }}
//               id="dropdownUser1"
//               data-bs-toggle="dropdown"
//               aria-expanded="false"
//             >
//               <img
//                 src="/images/ava.png"
//                 alt="hugenerd"
//                 width="40"
//                 height="40"
//                 style={{ borderRadius: "50%" }}
//               />
//             </button>
//             <ul
//               className="dropdown-menu dropdown-menu-dark text-small shadow"
//               style={{ backgroundColor: "#007cd4" }}
//               aria-labelledby="dropdownUser1"
//             >
//               <li>
//                 <Link className="dropdown-item" to="/profile">
//                   Hồ sơ
//                 </Link>
//               </li>
//               <hr className="dropdown-divider" />
//               <li>
//                 <button className="dropdown-item" onClick={handleSignout}>
//                   Đăng xuất
//                 </button>
//               </li>
//             </ul>
//           </div>
//           <div className="nav-item d-none d-lg-block ms-5">
//             <NavLink className="nav-link" to="/sign_up">
//               Đăng ký
//             </NavLink>
//           </div>
//         </div>
//       </nav>
//     );
// }
// export default TopNav;
import { NavLink, Link, useHistory } from "react-router-dom"
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../hook/AuthProvider'
import nav from '../hook/PhanQuyen'
const TopNav = () => {
  const { logout, user, scope } = useContext(AuthContext);
  const handleSignout = () => {
    logout()
  }
  return (
    <nav className="navbar navbar-expand-sm bg-light navbar-light">
      <div className="container" id="topNav">
        <div>
          <img
            src="/images/logo1.png"
            alt="Avatar Logo"
            style={{ width: "100%" }}
          />
        </div>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#collapsibleNavbar"
        >
          Menu
          <i className="fa-solid fa-caret-down"></i>
        </button>

        <div className="mx-3"></div>

        <div className="collapse navbar-collapse" id="collapsibleNavbar">
          <ul className="navbar-nav me-auto">
            {/* <li className="nav-item me-4">
                            <NavLink className="nav-link" to="/" exact>Giới thiệu</NavLink>
                        </li>
                        <li className="nav-item me-4" >
                            <NavLink className="nav-link" to="/doctors">Bác sĩ</NavLink>
                        </li>
                        <li className="nav-item me-4">
                            <NavLink className="nav-link" to="/services">Dịch vụ</NavLink>
                        </li>
                        <li className="nav-item me-4">
                            <NavLink className="nav-link" to="/contacts">Liên lạc</NavLink>
                        </li>
                        <li className="nav-item me-4">
                            <NavLink className="nav-link" to="/booking">Đặt lịch</NavLink>
                        </li>
                        <li className="nav-item me-4">
                            <NavLink className="nav-link" to="/manager">Quản lý</NavLink>
                        </li> */}
            {scope?.map((val, idx) => {
              return (
                <li className="nav-item me-4">
                  <NavLink className="nav-link" to={val.path} exact>
                    {val.name}
                  </NavLink>
                </li>
              );
            })}
           {(user===null||user?.Loai==='KhachHang')&&<div className="dropdown">
              <button
                className="d-flex align-items-center justify-content-center link-dark text-decoration-none dropdown-toggle mt-2"
                style={{ border: "none", backgroundColor: "transparent", fontWeight: "bold", marginLeft: "-6px", fontSize: "16px" }}
                id="dropdownUser1"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >Đặt lịch
              </button>
              <ul
                className="dropdown-menu dropdown-menu-dark text-small shadow"
                style={{ backgroundColor: "#007cd4" }}
                aria-labelledby="dropdownUser1"
              >
                <li>
                  <Link className="dropdown-item" to="/booking">
                    Nhân viên liên hệ
                  </Link>
                </li>
                <hr className="dropdown-divider" />
                <li>
                  <Link className="dropdown-item" to="/bookingOnline">
                    Đặt online
                  </Link>
                </li>
              </ul>
            </div>}
          </ul>
        </div>
        <div className="nav-item" align="right">
          {user == null && (
            <NavLink className="nav-link" to="/sign_in">
              Đăng nhập
            </NavLink>
          )}
          {user != null && <text className="nav-link">{user.ten}</text>}
        </div>
        {user!==null&&<div className="dropdown">
          <button
            className="d-flex align-items-center justify-content-center link-dark text-decoration-none dropdown-toggle"
            style={{ border: "none", backgroundColor: "transparent" }}
            id="dropdownUser1"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <img
              src="/images/ava.png"
              alt="hugenerd"
              width="40"
              height="40"
              style={{ borderRadius: "50%" }}
            />
          </button>
          <ul
            className="dropdown-menu dropdown-menu-dark text-small shadow"
            style={{ backgroundColor: "#007cd4" }}
            aria-labelledby="dropdownUser1"
          >
            <li>
              <Link className="dropdown-item" to="/profile">
                Hồ sơ
              </Link>
            </li>
            <hr className="dropdown-divider" />
            {/* <li>
              <Link className="dropdown-item" to="/profile">
                Hồ sơ điều trị
              </Link>
            </li> */}
            {/* <hr className="dropdown-divider" /> */}
            <li>
              <button className="dropdown-item" onClick={handleSignout}>
                Đăng xuất
              </button>
            </li>
          </ul>
        </div>}
        <div className="nav-item d-none d-lg-block ms-5">
          <NavLink className="nav-link" to="/sign_up">
            Đăng ký
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
export default TopNav;