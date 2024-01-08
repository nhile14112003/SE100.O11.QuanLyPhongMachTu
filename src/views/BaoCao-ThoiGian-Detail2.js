import React, { useState, useEffect, useRef } from "react";
import "./mistyles.css";
import Api from "../api/Api";

const XemBaoCaoTheoNam = (props) => {
  const [table, setTable] = useState([]);
  const [selectedYear, setSelectedYear] = useState("2024");
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
          if (item.ngayThanhToan?.startsWith(selectedYear)) {
            let CTHSDT = tcDetails.current.find(
              (item) => item.Id === bill.maCTHSDT
            );
            let HSDT = treatmentRecords.current.find(
              (item) => item.Id === CTHSDT.IDhsdt
            );
            revenueTable.push({
              thang: new Date(item.ngayThanhToan).getMonth() + 1,
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
        const { thang, soLuongCaThucHien, soDichVuThucHien, maBN, tienTT } =
          item;

        // Kiểm tra xem tháng đã được thêm vào bảng thống kê chưa
        if (!revenueSummary[thang]) {
          revenueSummary[thang] = {
            thang: thang,
            soLuongCaThucHien: 0,
            soDichVuThucHien: 0,
            soBenhNhan: 0,
            doanhThu: 0,
            tyLe: 0,
          };
        }

        revenueSummary[thang].soLuongCaThucHien += soLuongCaThucHien;
        revenueSummary[thang].soDichVuThucHien += soDichVuThucHien;

        // Kiểm tra xem bệnh nhân đã được tính vào bảng thống kê chưa
        if (maBN !== null) {
          if (!revenueSummary[thang][maBN]) {
            revenueSummary[thang].soBenhNhan += 1;
            revenueSummary[thang][maBN] = true;
          }
        }

        revenueSummary[thang].doanhThu += tienTT;
        revenueSummary[thang].tyLe =
          (revenueSummary[thang].doanhThu * 100) / tongDoanhThu;
        revenueSummary[thang].tyLe = parseFloat(
          revenueSummary[thang].tyLe.toFixed(1)
        );
      });

      // Chuyển đối tượng thành mảng
      const result = Object.values(revenueSummary);

      setTable(result);
      setTotalRevenue(tongDoanhThu);
    });
  };

  return (
    <div>
      <div class="mb-3 mt-3">
        <label for="year1">
          <b>Chọn năm:</b>
        </label>{" "}
        <br />
        <input
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
            <th>Tháng</th>
            <th>Số ca thực hiện</th>
            <th>Số dịch vụ thực hiện</th>
            <th>Số bệnh nhân</th>
            <th>Tổng doanh thu</th>
            <th>Tỷ lệ (%)</th>
          </tr>
        </thead>
        <tbody>
          {table.map((item, index) => (
            <tr key={index}>
              <td>{item.thang}</td>
              <td>{item.soLuongCaThucHien}</td>
              <td>{item.soDichVuThucHien}</td>
              <td>{item.soBenhNhan}</td>
              <td>{item.doanhThu}</td>
              <td>{item.tyLe}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h1 class="noteVND" style={{ fontWeight: "bold" }}>
        Tổng doanh thu: {totalRevenue}
      </h1>
    </div>
  );
};

export default XemBaoCaoTheoNam;
