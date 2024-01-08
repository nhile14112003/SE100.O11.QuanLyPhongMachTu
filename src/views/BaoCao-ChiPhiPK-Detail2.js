import React, { useState, useEffect, useRef } from "react";
import "./mistyles.css";
import Api from "../api/Api";
import moment from "moment";

const XemBaoCaoCPPKTheoThang = (props) => {
  const [table, setTable] = useState([]);
  const [selectedYear, setSelectedYear] = useState("2024");
  const drugs = useRef();
  const materials = useRef();
  const [totalExpenses, setTotalExpenses] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        drugs.current = await Api.getAllDrugs();
        materials.current = await Api.getAllMaterials();
        CHAMCONG.current = await Api.getDocs(
          "/StaffManagement/getAll/ChamCong"
        );
        updateTable();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const updateTable = async () => {
    let totalSalaryExpense = 0;
    for (let i = 1; i <= 12; i++) {
      const salaries = await calSalary(i, selectedYear);
      totalSalaryExpense += salaries.reduce((sum, salary) => {
        return sum + parseInt(salary.TongLuong);
      }, 0);
    }

    const totalDrugExpense = drugs.current.reduce((sum, drug) => {
      if (drug.ngayNhap.startsWith(selectedYear)) {
        return sum + parseInt(drug.donGiaNhap) * parseInt(drug.soLuongNhap);
      }
      return sum;
    }, 0);
    const totalMaterialExpense = materials.current.reduce((sum, material) => {
      if (material.ngayNhap.startsWith(selectedYear)) {
        return (
          sum + parseInt(material.donGiaNhap) * parseInt(material.soLuongNhap)
        );
      }
      return sum;
    }, 0);

    const totalExpenses =
      totalDrugExpense + totalMaterialExpense + totalSalaryExpense;
    const expenseTable = [
      {
        tenChiPhi: "Tiền vật tư thiết bị",
        soTien: totalMaterialExpense,
        tyLe: parseFloat(
          ((totalMaterialExpense * 100) / totalExpenses).toFixed(1)
        ),
      },
      {
        tenChiPhi: "Tiền thuốc",
        soTien: totalDrugExpense,
        tyLe: parseFloat(((totalDrugExpense * 100) / totalExpenses).toFixed(1)),
      },
      {
        tenChiPhi: "Tiền lương nhân viên",
        soTien: totalSalaryExpense,
        tyLe: parseFloat(
          ((totalSalaryExpense * 100) / totalExpenses).toFixed(1)
        ),
      },
    ];
    setTable(expenseTable);
    setTotalExpenses(totalExpenses);
  };

  const CHAMCONG = useRef();
  const calSalary = async (selectedmonth, selectedyear) => {
    const currentWorkTimesTable = CHAMCONG.current.find(
      (item) => item.Thang == selectedmonth && item.Nam == selectedyear
    );
    //console.log(currentWorkTimesTable);
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
      return result;
    } else return [];
  };
  return (
    <div>
      <div class="mb-3 mt-3">
        <label for="month">
          <b>Chọn năm:</b>
        </label>{" "}
        <br />
        <input
          class="customBox"
          type="number"
          min="2010"
          max="2024"
          step="1"
          value={selectedYear}
          id="year"
          placeholder="Chọn năm bắt đầu"
          name="year"
          onChange={(e) => setSelectedYear(e.target.value)}
        />
      </div>

      <button
        type="submit"
        class="bluecolor block m-2 bg-0096FF hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
        onClick={updateTable}
      >
        Xem
      </button>

      <h1 class="noteVND">**Tính theo đơn vị VNĐ</h1>
      <table class="table">
        <thead>
          <tr class="table-secondary">
            <th>Tên chi phí</th>
            <th>Số tiền đã chi trả</th>
            <th>Tỷ lệ</th>
          </tr>
        </thead>
        <tbody>
          {table.map((item, index) => (
            <tr key={index}>
              <td>{item.tenChiPhi}</td>
              <td>{item.soTien}</td>
              <td>{item.tyLe}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h1 class="noteVND" style={{ fontWeight: "bold" }}>
        Tổng chi phí: {totalExpenses}
      </h1>
    </div>
  );
};

export default XemBaoCaoCPPKTheoThang;
