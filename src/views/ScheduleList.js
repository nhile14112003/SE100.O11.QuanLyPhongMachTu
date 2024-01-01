import React, { useState, useEffect } from "react";
import Select from "react-select";
import { BsFillTrashFill } from "react-icons/bs";
import Api from "../api/Api";
import moment from "moment";

const ScheduleList = () => {
  const [appointments, setAppointments] = useState([]);
  const [searchCriteria, setSearchCriteria] = useState({
    MaBN: "",
    TenBN: "",
    MaNS: "",
    TenNS: "",
    NgayHen: "",
    DichVu: "",
  });
  const [selectedDate, setSelectedDate] = useState(
    moment().format("YYYY-MM-DD")
  );

  useEffect(() => {
    getAppointments();
  }, []);

  const getAppointments = async () => {
    const endpoint = "/ScheduleManagement/getAll/LichHen?sortOrder=asc";
    const appointments = await Api.getDocs(endpoint);

    setAppointments(
      appointments.filter(
        (item) => item.NgayHen == moment().format("YYYY-MM-DD")
      )
    );
  };

  const onSearch = async () => {
    const endpoint = "/ScheduleManagement/getAppointments";
    const appointments = await Api.getDocsBySeacrh(endpoint, searchCriteria);
    setAppointments(appointments);
  };

  const handleChange = (e) => {
    setSearchCriteria({
      ...searchCriteria,
      [e.target.name]: e.target.value,
    });
    if (e.target.name == "NgayHen") setSelectedDate(e.target.value);
  };

  return (
    <div>
      <div className="row">
        <div className="col-lg-4 col-md-6">
          <div className="mb-2">
            <b>Mã bệnh nhân</b>
          </div>
          <input
            className="form-control pb-2 pt-2 mb-3"
            name="MaBN"
            onChange={handleChange}
            value={searchCriteria.MaBN}
          ></input>
        </div>
        <div className="col-lg-4 col-md-6">
          <div className="mb-2">
            <b>Tên bệnh nhân</b>
          </div>
          <input
            className="form-control pb-2 pt-2 mb-3"
            name="TenBN"
            onChange={handleChange}
            value={searchCriteria.TenBN}
          ></input>
        </div>
        <div className="col-lg-4 col-md-6">
          <div className="mb-2">
            <b>Mã nha sĩ</b>
          </div>
          <input
            className="form-control pb-2 pt-2 mb-3"
            name="MaNS"
            onChange={handleChange}
            value={searchCriteria.MaNS}
          ></input>
        </div>
        <div className="col-lg-4 col-md-6">
          <div className="mb-2">
            <b>Tên nha sĩ</b>
          </div>
          <input
            className="form-control pb-2 pt-2 mb-3"
            name="TenNS"
            onChange={handleChange}
            value={searchCriteria.TenNS}
          ></input>
        </div>
        <div className="col-lg-4 col-md-6">
          <div className="mb-2">
            <b>Dịch vụ</b>
          </div>
          <input
            className="form-control pb-2 pt-2 mb-3"
            name="DichVu"
            onChange={handleChange}
            value={searchCriteria.DichVu}
          ></input>
        </div>
        <div className="col-lg-4 col-md-6">
          <div className="mb-2">
            <b>Ngày hẹn</b>
          </div>
          <input
            type="date"
            className="form-control pb-2 pt-2"
            id="NgayHen"
            name="NgayHen"
            value={selectedDate}
            onChange={handleChange}
          />
        </div>
        <div className="text-end">
          <button
            type="submit"
            className="btn pb-2 pt-2 mt-3"
            style={{ backgroundColor: "#0096FF", color: "#FFFFFF" }}
            onClick={onSearch}
          >
            Tìm kiếm
          </button>
        </div>
      </div>

      <table className="table">
        <thead>
          <tr className="table-secondary">
            <th>Mã bệnh nhân</th>
            <th>Tên bệnh nhân</th>
            <th>Số điện thoại</th>
            <th>Mã nha sĩ</th>
            <th>Tên nha sĩ</th>
            <th>Ngày hẹn</th>
            <th>Giờ hẹn</th>
            <th>Dịch vụ</th>
            <th>Ghi chú</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((item, index) => (
            <tr key={index}>
              <td>{item.MaBN}</td>
              <td>{item.TenBN}</td>
              <td>{item.SDT}</td>
              <td>{item.MaNS}</td>
              <td>{item.TenNS}</td>
              <td>{item.NgayHen}</td>
              <td>{item.Gio}</td>
              <td>{item.DichVu}</td>
              <td>{item.GhiChu}</td>
              <td className="fit">
                {/* <span className="actions">
                  <BsFillTrashFill className="delete-btn" />
                </span> */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default ScheduleList;
