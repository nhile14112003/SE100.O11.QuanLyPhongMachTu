import React, { useState, useEffect, useRef } from "react";
import "./mistyles.css";
import Api from "../api/Api";
import moment from "moment";
import ExcelJS from "exceljs"

const XemBaoCaoChiNhanhTheoThang = (props) => {
  const [table, setTable] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(
    moment().format("YYYY-MM")
  );
  const bills = useRef();
  const tcDetails = useRef();
  const treatmentRecords = useRef();
  const [totalRevenue, setTotalRevenue] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getBills();
        await getTreatmentRecordDetails();
        await getTreatmentRecords();
        updateTable();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const getBills = async () => {
    bills.current = await Api.getDocs("/StatisticalReport/getAll/HoaDon");
  };
  const getTreatmentRecordDetails = async () => {
    tcDetails.current = await Api.getDocs(
      "/StatisticalReport/getAll/ChiTietHSDT"
    );
  };

  const getTreatmentRecords = async () => {
    treatmentRecords.current = await Api.getDocs(
      "/StatisticalReport/getAll/HoSoDieuTri"
    );
  };

  const updateTable = async () => {
    const revenueTable = [];

    bills.current.forEach(async (bill) => {
      if (Array.isArray(bill.dsThanhToan))
        bill.dsThanhToan?.forEach((item, index) => {
          if (item.ngayThanhToan?.startsWith(selectedMonth)) {
            let CTHSDT = tcDetails.current.find(
              (item) => item.Id === bill.maCTHSDT
            );
            let HSDT = treatmentRecords.current.find(
              (item) => item.Id === CTHSDT.IDhsdt
            );
            revenueTable.push({
              chiNhanh: CTHSDT.tenChiNhanh,
              soLuongCaThucHien: index === 0 ? 1 : 0,
              soDichVuThucHien: index === 0 ? CTHSDT.DichVu.length : 0,
              maBN: index === 0 ? HSDT.IDBenhNhan : null,
              tienTT: parseInt(item.tienThanhToan),
            });
          }
        });

      const revenueSummary = {};

      const tongDoanhThu = revenueTable.reduce(
        (total, row) => total + row.tienTT,
        0
      );
      revenueTable.forEach((item) => {
        const { chiNhanh, soLuongCaThucHien, soDichVuThucHien, maBN, tienTT } =
          item;

        if (!revenueSummary[chiNhanh]) {
          revenueSummary[chiNhanh] = {
            chiNhanh: chiNhanh,
            soLuongCaThucHien: 0,
            soDichVuThucHien: 0,
            soBenhNhan: 0,
            doanhThu: 0,
            tyLe: 0,
          };
        }

        revenueSummary[chiNhanh].soLuongCaThucHien += soLuongCaThucHien;
        revenueSummary[chiNhanh].soDichVuThucHien += soDichVuThucHien;

        // Kiểm tra xem bệnh nhân đã được tính vào bảng thống kê chưa
        if (maBN !== null) {
          if (!revenueSummary[chiNhanh][maBN]) {
            revenueSummary[chiNhanh].soBenhNhan += 1;
            revenueSummary[chiNhanh][maBN] = true;
          }
        }

        revenueSummary[chiNhanh].doanhThu += tienTT;
        revenueSummary[chiNhanh].tyLe =
          (revenueSummary[chiNhanh].doanhThu * 100) / tongDoanhThu;
        revenueSummary[chiNhanh].tyLe = parseFloat(
          revenueSummary[chiNhanh].tyLe.toFixed(1)
        );
      });

      // Chuyển đối tượng thành mảng
      const result = Object.values(revenueSummary);
      console.log(result);

      setTable(result);
      setTotalRevenue(tongDoanhThu);
    });
  };
  const handleExport = () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Báo cáo");
    sheet.columns = [
      { header: "STT", key: "stt", width: 10 },
      { header: "Chi nhánh", key: "chiNhanh", width: 30 },
      { header: "Số ca thực hiện", key: "soLuongCaThucHien", width: 20, },
      { header: "Số dịch vụ thực hiện", key: "soDichVuThucHien", width: 20 },
      { header: "Số bệnh nhân", key: "soBenhNhan", width: 20 },
      { header: "Doanh thu", key: "doanhThu", width: 20 },
      { header: "Tỉ lệ(%)", key: "tyLe", width: 20 },
    ];
    sheet.getRow(1).font = { bold: true }
    for (let i = 1; i <= 7; i++) {
      if (i !== 6)
        sheet.getColumn(i).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    }
    sheet.getColumn(6).numFmt = '#,##0'
    sheet.getCell('F1').alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }

    const promise = Promise.all(table.map((item, index) => {
      sheet.addRow({
        stt: index + 1,
        chiNhanh: item?.chiNhanh,
        soLuongCaThucHien: item?.soLuongCaThucHien,
        soDichVuThucHien: item?.soDichVuThucHien,
        soBenhNhan: item?.soBenhNhan,
        doanhThu: item?.doanhThu,
        tyLe: item?.tyLe,
      })
    })
    );
    promise.then(() => {
      sheet.addRow({
        stt: "",
        chiNhanh: "",
        soLuongCaThucHien: "",
        soDichVuThucHien: "",
        soBenhNhan: "",
        doanhThu: totalRevenue,
        tyLe: "",
      })
      sheet.getCell('F' + (table.length + 2)).font = { bold: true }
      workbook.xlsx.writeBuffer().then(function (data) {
        const blob = new Blob([data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = "Báo cáo theo chi nhánh " + moment(new Date(selectedMonth)).format("MM/YYYY") + ".xlsx";
        anchor.click();
        window.URL.revokeObjectURL(url);
      });
    })
  }

  return (
    <div>
      <div className="row">
        <div className="col-lg-4 col-md-6">
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
              type="submit"
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
      <table class="table" >
        <thead style={{ verticalAlign: "middle" }}>
          <tr class="table-secondary">
            <th>STT</th>
            <th>Chi nhánh</th>
            <th>Số ca thực hiện</th>
            <th>Số dịch vụ thực hiện</th>
            <th>Số bệnh nhân</th>
            <th>Doanh thu</th>
            <th>Tỷ lệ (%)</th>
          </tr>
        </thead>
        <tbody>
          {table.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.chiNhanh}</td>
              <td>{item.soLuongCaThucHien}</td>
              <td>{item.soDichVuThucHien}</td>
              <td>{item.soBenhNhan}</td>
              <td>{new Intl.NumberFormat("en-DE").format(
                item.doanhThu
              )}</td>
              <td>{new Intl.NumberFormat("en-DE").format(
                item.tyLe
              )}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="text-end">
        <h1 class="noteVND" style={{ fontWeight: "bold", fontSize: "17px" }}>
          Tổng doanh thu: {totalRevenue ? new Intl.NumberFormat("en-DE").format(totalRevenue) : null}
        </h1>
      </div>
    </div>
  );
};

export default XemBaoCaoChiNhanhTheoThang;
