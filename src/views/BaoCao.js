import React, { useContext } from "react";
import "./mistyles.css";
import {
  Route,
  Router,
  Switch,
} from "react-router-dom/cjs/react-router-dom.min";
import XemBaoCaoTheoThoiGian from "./BaoCao-ThoiGian";
import { NavLink } from "react-router-dom";
import XemBaoCaoTheoDichVu from "./BaoCao-DichVu";
import XemBaoCaoTheoBacSi from "./BaoCao-Bacsi";
import XemBaoCaoTheoCPPK from "./BaoCao-ChiPhiPK";
import XemBaoCaoTheoChiNhanh from "./BaoCao-ChiNhanh";
import { AuthContext } from "../hook/AuthProvider";

const BaoCao = (props) => {
  const { user } = useContext(AuthContext);
  return (
    <div>
      <div className="container mt-3">
        <p>
          <b>Xem báo cáo theo:</b>
        </p>
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <NavLink
              className="nav-link"
              to="/manager/baocao/baocaotheothoigian"
            >
              Thời gian
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/manager/baocao/baocaotheodichvu">
              Dịch vụ
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/manager/baocao/baocaotheobacsi">
              Bác sĩ
            </NavLink>
          </li>
          {user?.Loai === "ChuHeThong" && (
            <li className="nav-item">
              <NavLink
                className="nav-link"
                to="/manager/baocao/baocaotheochinhanh"
              >
                Chi nhánh
              </NavLink>
            </li>
          )}
          <li className="nav-item">
            <NavLink
              className="nav-link"
              to="/manager/baocao/baocaotheochiphiphongkham"
            >
              Chi phí phòng khám
            </NavLink>
          </li>
        </ul>
      </div>
      <div className="container mt-3">
        <Switch>
          <Route path="/manager/baocao/baocaotheothoigian">
            <XemBaoCaoTheoThoiGian />
          </Route>
          <Route path="/manager/baocao/baocaotheodichvu">
            <XemBaoCaoTheoDichVu />
          </Route>
          <Route path="/manager/baocao/baocaotheobacsi">
            <XemBaoCaoTheoBacSi />
          </Route>
          <Route path="/manager/baocao/baocaotheochinhanh">
            <XemBaoCaoTheoChiNhanh />
          </Route>
          <Route path="/manager/baocao/baocaotheochiphiphongkham">
            <XemBaoCaoTheoCPPK />
          </Route>
        </Switch>
      </div>
    </div>
  );
};

export default BaoCao;
