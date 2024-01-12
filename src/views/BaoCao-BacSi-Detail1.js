import React, { useState, useEffect, useRef, useContext } from "react";
import "./mistyles.css";
import Api from "../api/Api";
import moment from "moment";
import { AuthContext } from "../hook/AuthProvider";
import ExcelJS from "exceljs"

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
  const handleExport = () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Báo cáo");
    sheet.columns = [
      { header: "STT", key: "stt", width: 10 },
      { header: "Mã nha sĩ", key: "maNhaSi", width: 20, },
      { header: "Tên nha sĩ", key: "tenNhaSi", width: 25 },
      { header: "Số bệnh nhân", key: "soBenhNhan", width: 20 },
      { header: "Số ca thực hiện", key: "soLuongCaThucHien", width: 20 },
      { header: "Tỉ lệ(%)", key: "tyLe", width: 20 },
    ];
    sheet.getRow(1).font = { bold: true }
    for (let i = 1; i <= 6; i++) {
      if (i !== 5)
        sheet.getColumn(i).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    }
    sheet.getCell('E1').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }

    const promise = Promise.all(table.map((item, index) => {
      sheet.addRow({
        stt: index + 1,
        maNhaSi: item?.maNhaSi,
        tenNhaSi: item?.tenNhaSi,
        soLuongCaThucHien: item?.soLuongCaThucHien,
        soBenhNhan: item?.soBenhNhan,
        tyLe: item?.tyLe,
      })
    })
    );
    promise.then(() => {
      sheet.addRow({
        stt: "",
        maNhaSi: "",
        tenNhaSi: "",
        soLuongCaThucHien: totalCases,
        soBenhNhan: "",
        tyLe: "",
      })
      sheet.getCell('E' + (table.length + 2)).font = { bold: true }
      workbook.xlsx.writeBuffer().then(function (data) {
        const blob = new Blob([data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = "Báo cáo theo bác sĩ " + moment(new Date(selectedMonth)).format("MM/YYYY") + " của " + (selectedBranch === "Tất cả" ? "tất cả chi nhánh" : selectedBranch) + ".xlsx";
        anchor.click();
        window.URL.revokeObjectURL(url);
      });
    })
  }

  return (
    <div>
      <div className="row">
        <div className="col-lg-5 col-md-8">
          <div className="mb-2">
            <b>Chi nhánh</b>
          </div>
          <select
            className="form-select pb-2 pt-2 mb-3"
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
        <div className="col-md-4">
          <div className="mb-2">
            <b>Chọn tháng, năm</b>
          </div>
          <input
            className="form-control pb-2 pt-2 mb-3"
            type="month"
            id="month"
            placeholder="Chọn tháng năm"
            name="month"
            max={moment().format("YYYY-MM")}
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          />
          <div className="text-end">
            <button onClick={handleExport}
              className="btn pb-2 pt-2 mb-3 me-3"
              style={{ backgroundColor: "#0096FF", color: "#FFFFFF" }}>
              Xuất Excel
              <i className="fa fa-download ms-2"></i>
            </button>
            <button
              className="btn pb-2 pt-2 mb-3"
              style={{ backgroundColor: "#0096FF", color: "#FFFFFF" }}
              onClick={updateTable}
            >
              Xem
            </button>
          </div>
        </div>
      </div>
      <div className="text-end">
        <h1 class="noteVND">**Tính theo đơn vị VNĐ</h1>
      </div>
      <table class="table">
        <thead style={{ verticalAlign: "middle" }}>
          <tr class="table-secondary">
            <th>STT</th>
            <th>Mã nha sĩ</th>
            <th>Tên nha sĩ</th>
            <th>Số ca thực hiện</th>
            <th>Số bệnh nhân</th>
            <th>Tỷ lệ ca thực hiện (%)</th>
          </tr>
        </thead>
        <tbody>
          {table.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.maNhaSi}</td>
              <td>{item.tenNhaSi}</td>
              <td>{item.soLuongCaThucHien}</td>
              <td>{item.soBenhNhan}</td>
              <td>{new Intl.NumberFormat("en-DE").format(
                item.tyLe
              )}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="text-end">
        <h1 class="noteVND" style={{ fontWeight: "bold", fontSize: "17px" }}>
          Tổng số ca thực hiện: {totalCases}
        </h1>
      </div>
    </div>
  );
};

export default XemBaoCaoNhaSiTheoThang;
