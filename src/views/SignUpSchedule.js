import { useState, useEffect, useContext } from "react";
import Api from "../api/Api";
import NotificationModal from "../components/NotificationModal";
import { AuthContext } from "../hook/AuthProvider";
import moment from "moment";

const table = [
  {
    Thu: "Chủ nhật",
    Sang: false,
    Chieu: false,
    Toi: false,
  },
  {
    Thu: "Thứ hai",
    Sang: false,
    Chieu: false,
    Toi: false,
  },
  {
    Thu: "Thứ ba",
    Sang: false,
    Chieu: false,
    Toi: false,
  },
  {
    Thu: "Thứ tư",
    Sang: false,
    Chieu: false,
    Toi: false,
  },
  {
    Thu: "Thứ năm",
    Sang: false,
    Chieu: false,
    Toi: false,
  },
  {
    Thu: "Thứ sáu",
    Sang: false,
    Chieu: false,
    Toi: false,
  },
  {
    Thu: "Thứ bảy",
    Sang: false,
    Chieu: false,
    Toi: false,
  },
];
const SignUpSchedule = () => {
  // const doctorId = "NV023";
  // const doctorName = "Phan Nguyễn Cao Trí";
  const { user } = useContext(AuthContext);
  const [doctorId, setDoctorId] = useState(user?.maNV);
  const [doctorName, setDoctorName] = useState(user?.ten);
  const [scheduleSignedUp, setScheduleSignUp] = useState(table);
  const [currentSchedule, setCurrentSchedule] = useState(table);
  const [doctorSchedule, setDoctorSchedule] = useState(null);
  const [showNoti, setShowNoti] = useState(false);
  const [showNoti2, setShowNoti2] = useState(false);
  const [notiBody, setNotiBody] = useState("");
  const [flag, setFlag] = useState("Save");
  const [selectedMonth, setSelectedMonth] = useState("current");

  useEffect(() => {
    getDoctorSchedule();
  }, []);

  const getDoctorSchedule = async () => {
    console.log(doctorId);
    const dataName = "LichBacSi";
    const fieldName = "maNS";
    const fieldValue = doctorId;
    const endpoint = `/ScheduleManagement/getByField/${dataName}/${fieldName}?fieldValue=${fieldValue}`;
    const schedules = await Api.getDocByField(endpoint);

    const currentDate = new Date();
    let Month = currentDate.getMonth();
    let Year = currentDate.getFullYear();

    const currentSchedule = schedules.find((schedule) => {
      return schedule.thang === Month + 1 && schedule.nam === Year;
    });

    if (currentSchedule) setCurrentSchedule(currentSchedule.lichTuan);

    //Next month schedule
    Month += 1;
    if (Month > 11) {
      Month = 0;
      Year += 1;
    }
    const doctorSchedule = schedules.find((schedule) => {
      return schedule.thang === Month + 1 && schedule.nam === Year;
    });
    if (doctorSchedule) {
      setScheduleSignUp(doctorSchedule.lichTuan);
      setDoctorSchedule(doctorSchedule);
      setFlag("Update");
    }
  };

  const onSave = async () => {
    const countTrue = scheduleSignedUp.reduce((count, day) => {
      return (
        count + (day.Sang ? 1 : 0) + (day.Chieu ? 1 : 0) + (day.Toi ? 1 : 0)
      );
    }, 0);

    if (countTrue < 7) {
      setNotiBody("Phải đăng ký ít nhất 7 buổi trong 1 tuần!");
      setShowNoti(true);
      return;
    }
    console.log(scheduleSignedUp);
    const id = await Api.addDoctorSchedule({
      doctorId: doctorId,
      doctorName: doctorName,
      weekTable: scheduleSignedUp,
    });
    if (id) {
      setNotiBody("Đăng ký lịch thành công!");
      setShowNoti(true);
      setFlag("Update");
    }
  };

  const onUpdate = async () => {
    const countTrue = scheduleSignedUp.reduce((count, day) => {
      return (
        count + (day.Sang ? 1 : 0) + (day.Chieu ? 1 : 0) + (day.Toi ? 1 : 0)
      );
    }, 0);

    if (countTrue < 7) {
      setNotiBody("Phải đăng ký ít nhất 7 buổi trong 1 tuần!");
      setShowNoti(true);
      return;
    }

    setNotiBody("Bạn có chắc muốn thay đổi lịch không?");
    setShowNoti2(true);
  };

  const handleUpdate = async () => {
    setShowNoti2(false);
    console.log(scheduleSignedUp);
    const endpoint =
      "/ScheduleManagement/DoctorSchedule/update/" + doctorSchedule.Id;
    const success = await Api.updateDoctorSchedule(endpoint, {
      doctorId: doctorId,
      doctorName: doctorName,
      weekTable: scheduleSignedUp,
    });
  };

  const onDefault = () => {
    setScheduleSignUp(currentSchedule);
  };

  const handleChange = (Thu, Buoi, GiaTri) => {
    setScheduleSignUp(
      scheduleSignedUp.map((item) =>
        item.Thu === Thu
          ? {
            ...item,
            [Buoi]: !GiaTri,
          }
          : item
      )
    );
  };

  return (
    <div>
      <div>
        <div className="d-flex">
          <h1 className="noteVND me-3 col-auto ms-auto">**Sáng: 8h-12h</h1>
          <h1 className="noteVND me-3 col-auto">**Chiều: 13h-17h </h1>
          <h1 className="noteVND me-3 col-auto">**Tối: 17h-20h </h1>
        </div>
        <div className="col-lg-5 col-md-8 mt-3 mb-3">
          <select
            className="form-select pb-2 pt-2"
            name="thang"
            onChange={(e) => setSelectedMonth(e.target.value)}
            value={selectedMonth}
          >
            <option value="current">Lịch tháng này</option>
            <option value="next">Đăng ký lịch tháng sau ({moment().add(1, "month").format('MM/YYYY')})</option>
          </select>
        </div>
      </div>
      <div className="row g-0">
        {selectedMonth === "current" &&
          currentSchedule.map((item, index) => (
            <div
              className="col-lg col-auto seven-color text-center"
              style={{ color: "#FFF" }}
            >
              <div
                className="wrapcolor d-flex align-items-center justify-content-center"
                style={{ height: "65px" }}
              >
                <b>{item.Thu}</b>
              </div>
              <div className="p-3">
                <div
                  className="mb-3 p-2"
                  style={{
                    backgroundColor: item.Sang ? "#bfbfbf" : "#0096FF",
                    borderRadius: "10px",
                  }}
                >
                  Sáng
                </div>
                <div
                  className="mb-3 p-2"
                  style={{
                    backgroundColor: item.Chieu ? "#bfbfbf" : "#0096FF",
                    borderRadius: "10px",
                  }}
                >
                  Chiều
                </div>
                <div
                  className="mb-3 p-2"
                  style={{
                    backgroundColor: item.Toi ? "#bfbfbf" : "#0096FF",
                    borderRadius: "10px",
                  }}
                >
                  Tối
                </div>
              </div>
            </div>
          ))}
      </div>
      <div className="row g-0">
        {selectedMonth === "next" &&
          scheduleSignedUp.map((item, index) => (
            <div
              className="col-lg col-auto seven-color text-center"
              style={{ color: "#FFF" }}
            >
              <div
                className="wrapcolor d-flex align-items-center justify-content-center"
                style={{ height: "65px" }}
              >
                <b>{item.Thu}</b>
              </div>
              <div className="p-3">
                <div
                  className="mb-3 p-2"
                  style={{
                    backgroundColor: item.Sang ? "#bfbfbf" : "#0096FF",
                    borderRadius: "10px",
                  }}
                  onClick={() => handleChange(item.Thu, "Sang", item.Sang)}
                >
                  Sáng
                </div>
                <div
                  className="mb-3 p-2"
                  style={{
                    backgroundColor: item.Chieu ? "#bfbfbf" : "#0096FF",
                    borderRadius: "10px",
                  }}
                  onClick={() => handleChange(item.Thu, "Chieu", item.Chieu)}
                >
                  Chiều
                </div>
                <div
                  className="mb-3 p-2"
                  style={{
                    backgroundColor: item.Toi ? "#bfbfbf" : "#0096FF",
                    borderRadius: "10px",
                  }}
                  onClick={() => handleChange(item.Thu, "Toi", item.Toi)}
                >
                  Tối
                </div>
              </div>
            </div>
          ))}
      </div>
      {selectedMonth === "next" && (
        <div className="text-end">
          <button
            type="button"
            className="btn pb-2 pt-2 ps-3 pe-3 mt-2 me-2"
            style={{ color: "#0096FF", border: "1px solid #0096FF" }}
            onClick={onDefault}
          >
            Mặc định
          </button>
          {flag == "Save" ? (
            <button
              type="submit"
              className="btn pb-2 pt-2 mt-2"
              style={{ backgroundColor: "#0096FF", color: "#FFFFFF" }}
              onClick={onSave}
            >
              Lưu
            </button>
          ) : (
            <button
              type="submit"
              className="btn pb-2 pt-2 mt-2"
              style={{ backgroundColor: "#0096FF", color: "#FFFFFF" }}
              onClick={onUpdate}
            >
              Lưu thay đổi
            </button>
          )}
        </div>
      )}

      <NotificationModal
        show={showNoti}
        onHide={() => setShowNoti(false)}
        title="LOGOIPSUM"
        message={notiBody}
      />
      <NotificationModal
        show={showNoti2}
        onHide={() => {
          setShowNoti2(false);
          setScheduleSignUp(doctorSchedule.lichTuan);
        }}
        title="LOGOIPSUM"
        message={notiBody}
        onConfirm={handleUpdate}
      />
    </div>
  );
};
export default SignUpSchedule;
