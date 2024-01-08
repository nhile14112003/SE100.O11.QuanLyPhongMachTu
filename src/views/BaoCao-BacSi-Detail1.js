import React, { useState, useEffect, useRef, useContext } from "react";
import "./mistyles.css";
import Api from "../api/Api";
import moment from "moment";
import { AuthContext } from "../hook/AuthProvider";

const XemBaoCaoNhaSiTheoThang = (props) => {
  const { user } = useContext(AuthContext);
  const [table, setTable] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(
    moment().format("YYYY-MM")
  );

  const tcDetails = useRef();
  const treatmentRecords = useRef();
  const [totalCases, setTotalCases] = useState();
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(
    user?.Loai === "ChuHeThong" ? "Tất cả" : user?.chinhanh
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user?.Loai === "ChuHeThong") await getBranches();
        await getTreatmentRecordDetails();
        await getTreatmentRecords();
        updateTable();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const getTreatmentRecordDetails = async () => {
    if (user?.Loai === "ChuHeThong" && selectedBranch === "Tất cả")
      tcDetails.current = await Api.getDocs(
        "/StatisticalReport/getAll/ChiTietHSDT"
      );
    else
      tcDetails.current = await Api.getDocs(
        `/StatisticalReport/getByField/ChiTietHSDT/tenChiNhanh?fieldValue=${selectedBranch}`
      );
  };

  const getTreatmentRecords = async () => {
    treatmentRecords.current = await Api.getDocs(
      "/StatisticalReport/getAll/HoSoDieuTri"
    );
  };

  const getBranches = async () => {
    const branches = await Api.getAllBranchs();
    setBranches([{ tenChiNhanh: "Tất cả" }, ...branches]);
  };

  const updateTable = async () => {
    if (user?.Loai === "ChuHeThong") await getTreatmentRecordDetails();

    const doctorTable = [];

    tcDetails.current.forEach(async (CTHSDT) => {
      if (CTHSDT.NgayDieuTri.startsWith(selectedMonth)) {
        let HSDT = treatmentRecords.current.find(
          (item) => item.Id === CTHSDT.IDhsdt
        );
        doctorTable.push({
          maNhaSi: CTHSDT.MaNhaSi,
          tenNhaSi: CTHSDT.TenNhaSi,
          soLuongCaThucHien: 1,
          maBN: HSDT.MaBenhNhan,
        });
      }

      const doctorReport = {};

      doctorTable.forEach((item) => {
        const { maNhaSi, tenNhaSi, soLuongCaThucHien, maBN } = item;

        if (!doctorReport[maNhaSi]) {
          doctorReport[maNhaSi] = {
            maNhaSi: maNhaSi,
            tenNhaSi: tenNhaSi,
            soLuongCaThucHien: 0,
            soBenhNhan: 0,
            tyLe: 0,
          };
        }

        doctorReport[maNhaSi].soLuongCaThucHien += soLuongCaThucHien;
        if (!doctorReport[maNhaSi][maBN]) {
          doctorReport[maNhaSi].soBenhNhan += 1;
          doctorReport[maNhaSi][maBN] = true;
        }

        doctorReport[maNhaSi].tyLe =
          (doctorReport[maNhaSi].soLuongCaThucHien * 100) / doctorTable.length;
        doctorReport[maNhaSi].tyLe = parseFloat(
          doctorReport[maNhaSi].tyLe.toFixed(1)
        );
      });

      // Chuyển đối tượng thành mảng
      const result = Object.values(doctorReport);

      setTable(result);
      setTotalCases(doctorTable.length);
    });
  };

  return (
    <div>
      <div class="mb-3 mt-3">
        <label for="month">
          <b>Chi nhánh:</b>
        </label>
        <br />
        <select
          className="customBox"
          id="type"
          name="chiNhanh"
          onChange={(e) => setSelectedBranch(e.target.value)}
        >
          {user?.Loai === "ChuHeThong" ? (
            branches.map((item, index) => (
              <option key={index} value={item.tenChiNhanh}>
                {item.tenChiNhanh}
              </option>
            ))
          ) : (
            <option value={user?.chinhanh}>{user?.chinhanh}</option>
          )}
        </select>
      </div>
      <div class="mb-3 mt-3">
        <label for="month">
          <b>Chọn tháng, năm:</b>
        </label>{" "}
        <br />
        <input
          class="customBox"
          type="month"
          id="month"
          placeholder="Chọn tháng năm"
          name="month"
          max={moment().format("YYYY-MM")}
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        />
      </div>

      <button
        class="bluecolor block m-2 bg-0096FF hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
        onClick={updateTable}
      >
        Xem
      </button>

      <h1 class="noteVND">**Tính theo đơn vị VNĐ</h1>
      <table class="table">
        <thead>
          <tr class="table-secondary">
            <th>Mã bác sĩ</th>
            <th>Tên bác sĩ</th>
            <th>Số ca thực hiện</th>
            <th>Số bệnh nhân</th>
            <th>Tỷ lệ ca thực hiện (%)</th>
          </tr>
        </thead>
        <tbody>
          {table.map((item, index) => (
            <tr key={index}>
              <td>{item.maNhaSi}</td>
              <td>{item.tenNhaSi}</td>
              <td>{item.soLuongCaThucHien}</td>
              <td>{item.soBenhNhan}</td>
              <td>{item.tyLe}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h1 class="noteVND" style={{ fontWeight: "bold" }}>
        Tổng số ca thực hiện: {totalCases}
      </h1>
    </div>
  );
};

export default XemBaoCaoNhaSiTheoThang;
