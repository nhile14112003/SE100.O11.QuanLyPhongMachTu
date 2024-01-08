import React, { useState, useEffect, useRef } from "react";
import "./mistyles.css";
import Api from "../api/Api";
import moment from "moment";

const XemBaoCaoTheoDichVuTheoNam = (props) => {
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
            let tienThuoc =
              tcDetails.current.Thuoc?.reduce(
                (total, thuoc) =>
                  total + parseInt(thuoc.donGia) * parseInt(thuoc.SL),
                0
              ) || 0;
            if (Array.isArray(CTHSDT.DichVu))
              CTHSDT.DichVu.forEach((dv) => {
                revenueTable.push({
                  dichVu: dv.tenDichVu + " - " + dv.loaiDichVu,
                  soLuongDaBan: index === 0 && !dv.taiKham ? 1 : 0,
                  maBN: index === 0 ? HSDT.IDBenhNhan : null,
                  tienTT:
                    index === 0
                      ? parseInt(item.tienThanhToan) - tienThuoc
                      : parseInt(item.tienThanhToan),
                });
              });
          }
        });

      const revenueSummary = {};
      const tongDoanhThu = revenueTable.reduce(
        (total, row) => total + row.tienTT,
        0
      );
      revenueTable.forEach((item) => {
        const { dichVu, soLuongDaBan, maBN, tienTT } = item;

        if (!revenueSummary[dichVu]) {
          revenueSummary[dichVu] = {
            dichVu: dichVu,
            soLuongDaBan: 0,
            soBenhNhan: 0,
            doanhThu: 0,
            tyLe: 0,
          };
        }

        revenueSummary[dichVu].soLuongDaBan += soLuongDaBan;

        // Kiểm tra xem bệnh nhân đã được tính vào bảng thống kê chưa
        if (maBN !== null) {
          if (!revenueSummary[dichVu][maBN]) {
            revenueSummary[dichVu].soBenhNhan += 1;
            revenueSummary[dichVu][maBN] = true;
          }
        }

        revenueSummary[dichVu].doanhThu += tienTT;
        revenueSummary[dichVu].tyLe =
          (revenueSummary[dichVu].doanhThu * 100) / tongDoanhThu;
        revenueSummary[dichVu].tyLe = parseFloat(
          revenueSummary[dichVu].tyLe.toFixed(1)
        );
      });

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
            <th>Dịch vụ</th>
            <th>Doanh số (Số lượng đã bán)</th>
            <th>Số lượng bệnh nhân</th>
            <th>Doanh thu</th>
            <th>Tỷ lệ (%)</th>
          </tr>
        </thead>
        <tbody>
          {table.map((item, index) => (
            <tr key={index}>
              <td>{item.dichVu}</td>
              <td>{item.soLuongDaBan}</td>
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
export default XemBaoCaoTheoDichVuTheoNam;
