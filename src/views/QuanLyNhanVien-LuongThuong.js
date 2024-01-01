import { BsFillTrashFill, BsFillPencilFill, BsEye } from "react-icons/bs";
import { useState, useEffect } from "react";
import { FormLuongThuong } from "../components/FormLuongThuong";
import Api from "../api/Api";

const LuongThuong = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [rowToEdit, setRowToEdit] = useState(null);
  const [bonuses, setBonuses] = useState([]);

  useEffect(() => {
    getBonuses();
  }, []);

  const getBonuses = async () => {
    const endpoint = "/StaffManagement/getAll/LuongThuong";
    const bonuses = await Api.getDocs(endpoint);
    const currentDate = new Date();
    setBonuses(
      bonuses.filter(
        (item) =>
          item.Thang == currentDate.getMonth() + 1 &&
          item.Nam == currentDate.getFullYear()
      )
    );
  };

  const handleSubmit = async (newRow) => {
    if (rowToEdit == null) {
      const endpoint = "/StaffManagement/add/LuongThuong";
      const id = await Api.addDoc(endpoint, newRow);
      newRow.Id = id;
      setBonuses([...bonuses, newRow]);
    } else {
      const endpoint = "/StaffManagement/LuongThuong/update/" + newRow.Id;
      await Api.updateDoc(endpoint, newRow);
      let updatedBonuses = bonuses.map((currRow, idx) => {
        if (idx !== rowToEdit) return currRow;
        return newRow;
      });
      setBonuses(updatedBonuses);
    }
  };

  const handleDeleteRow = async (targetIndex) => {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this bonus?"
    );
    if (shouldDelete) {
      const endpoint =
        "/StaffManagement/LuongThuong/delete/" + bonuses[targetIndex].Id;
      await Api.deleteDoc(endpoint);
      setBonuses(bonuses.filter((_, idx) => idx !== targetIndex));
    }
  };

  const handleEditRow = (idx) => {
    setRowToEdit(idx);
    setModalOpen(true);
  };
  return (
    <div>
      <div className="text-end">
        <button
          type="submit"
          className="btn pb-2 pt-2 mt-2 ms-3"
          style={{ backgroundColor: "#0096FF", color: "#FFFFFF" }}
          onClick={() => setModalOpen(true)}
        >
          Thêm
        </button>
      </div>
      <table className="table">
        <thead>
          <tr className="table-secondary">
            <th>Loại lương thưởng</th>
            <th>Tiền</th>
            <th>Ghi chú</th>
            <th>Tháng</th>
            <th>Năm</th>
            <th>Loại nhân viên</th>
            <th>Mã nhân viên</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {bonuses.map((item, index) => (
            <tr key={index}>
              <td>{item.LoaiLuongThuong}</td>
              <td>{item.Tien}</td>
              <td>{item.GhiChu}</td>
              <td>{item.Thang}</td>
              <td>{item.Nam}</td>
              <td>{item.LoaiNhanVien}</td>
              <td>{item.MaNV}</td>
              <td className="fit">
                <span className="actions">
                  <BsFillPencilFill
                    className="edit-btn"
                    onClick={() => handleEditRow(index)}
                  />
                  <BsFillTrashFill
                    className="delete-btn"
                    onClick={() => handleDeleteRow(index)}
                  />
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {modalOpen && (
        <FormLuongThuong
          closeModal={() => {
            setModalOpen(false);
            setRowToEdit(null);
          }}
          defaultValue={rowToEdit !== null && bonuses[rowToEdit]}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};
export default LuongThuong;
