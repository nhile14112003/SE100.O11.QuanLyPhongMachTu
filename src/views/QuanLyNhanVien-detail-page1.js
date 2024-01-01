import React, { useState, useEffect, useRef } from "react";
import moment from "moment";
import "./style.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Api from "../api/Api";
import LuongThuong from "./QuanLyNhanVien-LuongThuong";

const XemBangLuong = (props) => {
  const [table, setTable] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(
    moment().format("YYYY-MM")
  );
  const CHAMCONG = useRef();
  useEffect(() => {
    getWorkTimes();
  }, []);

  const getWorkTimes = async () => {
    const endpoint = "/StaffManagement/getAll/ChamCong";
    const worktimes = await Api.getDocs(endpoint);
    CHAMCONG.current = worktimes;
    calSalary();
  };

  const calSalary = async () => {
    const parsedDate = moment(selectedMonth, "YYYY-MM");
    const selectedyear = parsedDate.format("YYYY");
    const selectedmonth = parsedDate.format("M");

    const currentWorkTimesTable = CHAMCONG.current.find(
      (item) => item.Thang == selectedmonth && item.Nam == selectedyear
    );
    console.log(currentWorkTimesTable);
    if (currentWorkTimesTable) {
      const totalHoursPerEmployee = [];
      Object.keys(currentWorkTimesTable)
        .filter((key) => key !== "Thang" && key !== "Nam" && key != "Id")
        .forEach((date) => {
          currentWorkTimesTable[date].forEach((employee) => {
            const { MaNV, TenNV, SoGioLam } = employee;

            const existingEmployee = totalHoursPerEmployee.find(
              (item) => item.MaNV === MaNV
            );

            if (!existingEmployee) {
              totalHoursPerEmployee.push({
                MaNV,
                TenNV,
                SoGioLam: parseInt(SoGioLam),
              });
            } else {
              existingEmployee.SoGioLam += parseInt(SoGioLam);
            }
          });
        });

      const staffs = await Api.getAllStaffs();
      const bonuses = await Api.getDocs("/StaffManagement/getAll/LuongThuong");
      bonuses.filter(
        (item) => item.Thang == selectedmonth && item.Nam == selectedyear
      );
      const result = totalHoursPerEmployee
        .map((employee) => {
          const { MaNV, TenNV, SoGioLam } = employee;
          const employeeInfo = staffs.find((e) => e.maNhanVien === MaNV);

          if (employeeInfo) {
            const bonus = bonuses.filter(
              (item) =>
                item.LoaiNhanVien === "Tất cả" ||
                item.LoaiNhanVien === employeeInfo.chucVu ||
                item.MaNV === MaNV
            );
            const totalBonus = bonus.reduce(
              (sum, bonus) => sum + parseInt(bonus.Tien),
              0
            );
            return {
              ...employee,
              LuongGio: employeeInfo.luongCoBan,
              LuongThuong: totalBonus,
              TongLuong:
                parseInt(employeeInfo.luongCoBan) * parseInt(SoGioLam) +
                parseInt(totalBonus),
            };
          }
          return null;
        })
        .filter(Boolean);
      console.log(result);
      setTable(result);
    } else setTable([]);
  };
  return (
    <div>
      {/* <form name="xemBangLuong" action="/action_page.php"> */}
      <div class="mb-3 mt-3">
        <label for="nameNhanVien">
          <b>Chọn tháng muốn xem</b>
        </label>{" "}
        <br />
        <input
          type="month"
          class="customBox"
          name="nameNhanVien"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        />
      </div>

      <button
        type="submit"
        className="btn pb-2 pt-2 mt-2"
        style={{ backgroundColor: "#0096FF", color: "#FFFFFF" }}
        // class="bluecolor block m-2 bg-0096FF hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
        onClick={calSalary}
      >
        Xem
      </button>
      {/* </form> */}
      <h1 class="noteVND">**Tính theo đơn vị VNĐ</h1>
      <table class="table">
        <thead>
          <tr class="table-secondary">
            <th>Mã nhân viên</th>
            <th>Tên nhân viên</th>
            <th>Lương cơ bản/giờ</th>
            <th>Số giờ làm</th>
            <th>Lương thưởng</th>
            <th>Tổng lương</th>
          </tr>
        </thead>
        <tbody>
          {table.map((item, index) => (
            <tr key={index}>
              <td>{item.MaNV}</td>
              <td>{item.TenNV}</td>
              <td>{item.LuongGio}</td>
              <td>{item.SoGioLam}</td>
              <td>{item.LuongThuong}</td>
              <td>{item.TongLuong}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default XemBangLuong;
