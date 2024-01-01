import moment from "moment";
import { useState, useEffect, useRef } from "react";
import Api from "../api/Api";
import NotificationModal from "../components/NotificationModal";

const ChamCong = () => {
  const BANGCHAMCONG = useRef();
  const [table, setTable] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    moment().format("YYYY-MM-DD")
  );
  const [showNoti, setShowNoti] = useState(false);
  const [notiBody, setNotiBody] = useState("");

  useEffect(() => {
    getWorkTimes();
  }, []);

  const getWorkTimes = async () => {
    const endpoint = "/StaffManagement/getAll/ChamCong";
    const worktimes = await Api.getDocs(endpoint);

    const staffs = await Api.getAllStaffs();

    const currentDate = new Date();
    BANGCHAMCONG.current = worktimes.find(
      (item) =>
        item.Thang == currentDate.getMonth() + 1 &&
        item.Nam == currentDate.getFullYear()
    );
    if (BANGCHAMCONG.current) {
      const result = [
        ...BANGCHAMCONG.current[selectedDate],
        // item in staffs that not in BANGCHAMCONG
        ...staffs
          .filter((item1) => {
            const item2 = BANGCHAMCONG.current[selectedDate].find(
              (item2) => item2.MaNV === item1.maNhanVien
            );

            return !item2;
          })
          .map((item1) => {
            return {
              MaNV: item1.maNhanVien,
              TenNV: item1.tenNhanVien,
              SoGioLam: 0,
            };
          }),
      ];
      setTable(result);
    } else {
      const currentDate = moment();
      const firstDayOfMonth = moment(currentDate).startOf("month");
      const lastDay = moment(currentDate).endOf("month");

      const chamcongthang = {
        Thang: currentDate.month() + 1,
        Nam: currentDate.year(),
      };
      for (
        let day = firstDayOfMonth;
        day.isSameOrBefore(lastDay);
        day.add(1, "day")
      ) {
        chamcongthang[day.format("YYYY-MM-DD")] = staffs.map((item) => ({
          MaNV: item.maNhanVien,
          TenNV: item.tenNhanVien,
          SoGioLam: 0,
        }));
      }
      const id = await Api.addDoc(
        "/StaffManagement/add/ChamCong",
        chamcongthang
      );
      setTable(chamcongthang[selectedDate]);
      BANGCHAMCONG.current = { ...chamcongthang, Id: id };
    }
  };

  const handleChange = (e, row) => {
    setTable(
      table.map((item) =>
        item.MaNV === row.MaNV
          ? {
              ...item,
              SoGioLam: e.target.value,
            }
          : item
      )
    );
  };

  const onSave = async () => {
    console.log(table);
    BANGCHAMCONG.current[selectedDate] = table;
    console.log(BANGCHAMCONG.current);
    const endpoint =
      "/StaffManagement/ChamCong/update/" + BANGCHAMCONG.current.Id;
    const success = await Api.updateDoc(endpoint, BANGCHAMCONG.current);
    if (success) {
      setNotiBody("Đã lưu thành công!");
      setShowNoti(true);
    }
  };

  const onSee = async () => {
    if (
      new Date(selectedDate).getMonth() == new Date().getMonth() &&
      new Date(selectedDate).getFullYear() == new Date().getFullYear()
    ) {
      setTable(BANGCHAMCONG.current[selectedDate]);
    }
  };
  return (
    <div>
      <div className="col-lg-4 col-md-6 mt-2">
        <input
          type="date"
          className="form-control pb-2 pt-2"
          id="Ngay"
          name="Ngay"
          min={moment().startOf("month").format("YYYY-MM-DD")}
          max={moment().format("YYYY-MM-DD")}
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
        <div className="text-start">
          <button
            type="submit"
            className="btn pb-2 pt-2 mt-2"
            style={{ backgroundColor: "#0096FF", color: "#FFFFFF" }}
            onClick={onSee}
          >
            Xem
          </button>
        </div>
      </div>
      <table className="table">
        <thead>
          <tr className="table-secondary">
            <th>Mã nhân viên</th>
            <th>Họ và tên</th>
            <th>Số giờ làm</th>
          </tr>
        </thead>
        {table.map((row, idx) => {
          return (
            <tr>
              <td>{row.MaNV}</td>
              <td>{row.TenNV}</td>
              <td>
                <input
                  className="signature"
                  type="text"
                  value={row.SoGioLam}
                  onChange={(e) => handleChange(e, row)}
                />
              </td>
            </tr>
          );
        })}
        <tbody></tbody>
      </table>
      <div className="text-end">
        <button
          type="submit"
          className="btn pb-2 pt-2 mt-2"
          style={{ backgroundColor: "#0096FF", color: "#FFFFFF" }}
          onClick={onSave}
        >
          Lưu
        </button>
      </div>
      <NotificationModal
        show={showNoti}
        onHide={() => setShowNoti(false)}
        title="LOGOIPSUM"
        message={notiBody}
      />
    </div>
  );
};
export default ChamCong;
