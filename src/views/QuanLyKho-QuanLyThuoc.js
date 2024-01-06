import React, { useState, useEffect, useContext } from 'react'
import './mistyles.css'
import { BsFillTrashFill, BsFillPencilFill } from "react-icons/bs";
import { FormThuoc } from '../components/FormThuoc';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import api from '../api/Api';
import { AuthContext } from '../hook/AuthProvider'

const QuanLyThuoc = (props) => {
    const {user} = useContext(AuthContext);
    const [modalOpen, setModalOpen] = useState(false);
    const [drugs, setDrugs] = useState([]);
    const [rowToEdit, setRowToEdit] = useState(null);
    const [branches, setBranches] = useState([]);
    const [searchCriteria, setSearchCriteria] = useState({
        maThuoc: '',
        tenThuoc: '',
        slnDau: '',
        slnCuoi: '',
        sltkDau: '',
        sltkCuoi: '',
        giaNhapDau: '',
        giaNhapCuoi: '',
        giaDau: '',
        giaCuoi: '',
        hsdDau: '',
        hsdCuoi: '',
        ngayDau: '',
        ngayCuoi: '',
        chiNhanh:'',
    })

    useEffect(() => {
        getDrugs();
        getBranches();
    }, []);
    const getBranches = async () => {
        const branches = await api.getAllBranchs();
        setBranches([{ tenChiNhanh: "Tất cả" }, ...branches]);
      };
    const getDrugs = async () => {
        const drugs = await api.getAllDrugs()
        if(user?.Loai!=='ChuHeThong'){
        const fil = drugs.filter((item, idx)=>item.chiNhanh===user?.chinhanh)
        setDrugs(fil);
        }
        else{
            setDrugs(drugs)
        }
    }

    const handleDeleteRow = (targetIndex) => {
        const shouldDelete = window.confirm('Are you sure you want to delete this drug?');
        if (shouldDelete) {
            setDrugs(drugs.filter((_, idx) => idx !== targetIndex));
            api.deleteDrug(drugs[targetIndex].Id);
        }
    };

    const handleEditRow = (idx) => {
        setRowToEdit(idx);
        setModalOpen(true);
    };

    const handleSubmit = async (newRow) => {
        console.log(newRow);
        if (rowToEdit == null) {
            if(user?.Loai==='ChuHeThong'){
                const id = await api.addDrug(newRow);
                newRow.Id = id;
                setDrugs([...drugs, newRow]);
            }
            else{
                const id = await api.addDrug({...newRow,chiNhanh:user?.chinhanh});
                newRow.Id = id;
                setDrugs([...drugs, newRow]);
            }
           
        }
        else {
            api.updateDrug(newRow, newRow.Id);
            let updatedDrugs = drugs.map((currRow, idx) => {
                if (idx !== rowToEdit) return currRow;
                return newRow;
            })
            setDrugs(updatedDrugs);
        }
    };

    const handleChange = (e) => {
        setSearchCriteria({ ...searchCriteria, [e.target.name]: e.target.value });
    };

    const onSearch = async () => {
        console.log(searchCriteria)

        const searchResults = await api.getDrugsBySeacrh(searchCriteria);
        console.log(searchResults);
        if(user?.Loai!=='ChuHeThong'){
        const fil = searchResults.filter((item, idx)=>item.chiNhanh===user?.chinhanh)
        setDrugs(fil);
        }
        else{
            setDrugs(searchResults)
        }
    }
    return (
      <div>
        <div className="mb-3 mt-3">
          <input
            className="block m-2 customBox"
            type="text"
            id="maThuoc"
            placeholder="Mã thuốc"
            name="maThuoc"
            onChange={handleChange}
          />
          <input
            className="block m-2 customBox"
            type="text"
            id="tenThuoc"
            placeholder="Tên thuốc"
            name="tenThuoc"
            onChange={handleChange}
          />
          <div>
            <text>Số lượng nhập: Từ </text>
            <input
              className="block m-2 px-4 customBox"
              type="number"
              placeholder="0"
              name="slnDau"
              onChange={handleChange}
            />
            <text>đến</text>
            <input
              className="block m-2 px-4 customBox"
              type="number"
              placeholder="1000000000"
              name="slnCuoi"
              onChange={handleChange}
            />
          </div>
          <div>
            <text>Số lượng tồn kho: Từ </text>
            <input
              className="block m-2 px-4 customBox"
              type="number"
              placeholder="0"
              name="sltkDau"
              onChange={handleChange}
            />
            <text>đến</text>
            <input
              className="block m-2 px-4 customBox"
              type="number"
              placeholder="1000000000"
              name="sltkCuoi"
              onChange={handleChange}
            />
          </div>
          <div>
            <text>Giá nhập: Từ </text>
            <input
              className="block m-2 px-4 customBox"
              type="number"
              placeholder="0"
              name="giaNhapDau"
              onChange={handleChange}
            />
            <text>đến</text>
            <input
              className="block m-2 px-4 customBox"
              type="number"
              placeholder="1000000000"
              name="giaNhapCuoi"
              onChange={handleChange}
            />
          </div>
          <div>
            <text>Đơn giá: Từ </text>
            <input
              className="block m-2 px-4 customBox"
              type="number"
              placeholder="0"
              name="giaDau"
              onChange={handleChange}
            />
            <text>đến</text>
            <input
              className="block m-2 px-4 customBox"
              type="number"
              placeholder="1000000000"
              name="giaCuoi"
              onChange={handleChange}
            />
          </div>
          <div>
            <text>Hạn sử dụng: Từ </text>
            <input
              className="block m-2 px-4 customBox"
              type="date"
              name="hsdDau"
              onChange={handleChange}
            />
            <text>đến</text>
            <input
              className="block m-2 px-4 customBox"
              type="date"
              name="hsdCuoi"
              onChange={handleChange}
            />
          </div>
          <div>
            <text>Ngày nhập: Từ </text>
            <input
              className="block m-2 px-4 customBox"
              type="date"
              name="ngayDau"
              onChange={handleChange}
            />
            <text>đến</text>
            <input
              className="block m-2 px-4 customBox"
              type="date"
              name="ngayCuoi"
              onChange={handleChange}
            />
          </div>
          <div>
            <text>Chi nhánh: </text>
            <select
              className="customBox"
              id="type"
              name="chiNhanh"
              onChange={handleChange}
            >
              {user?.Loai==='ChuHeThong'?branches.map((item, index) => (
                <option key={index} value={item.tenChiNhanh}>
                  {item.tenChiNhanh}
                </option>
              )):
              <option value={user?.chinhanh}>
              {user?.chinhanh}
            </option>
              }
            </select>
          </div>
        </div>
        <button
          type="submit"
          className="bluecolor block m-2 bg-0096FF hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
          onClick={onSearch}
        >
          Tìm kiếm
        </button>
        <button
          onClick={() => setModalOpen(true)}
          className="bluecolor block m-2 bg-0096FF hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
        >
          Thêm
        </button>

        <h1 className="noteVND">
          **Nếu thuốc dạng viên đơn vị tính là viên, còn lại hộp
        </h1>
        <br />
        <h1 className="noteVND">**Tính theo đơn vị VNĐ</h1>
        <table className="table">
          <thead>
            <tr className="table-secondary">
              <th>Mã Thuốc</th>
              <th>Tên thuốc</th>
              <th>Số lượng nhập</th>
              <th>Số lượng tồn kho</th>
              <th>Đơn giá nhập</th>
              <th>Đơn giá</th>
              <th>Hạn sử dụng</th>
              <th>Ngày nhập</th>
              <th></th>
            </tr>
          </thead>
          {drugs.map((row, idx) => {
            return (
              <tr key={row.Id}>
                <td>{row.maThuoc}</td>
                <td>{row.tenThuoc}</td>
                <td>{row.soLuongNhap}</td>
                <td>{row.soLuongTonKho}</td>
                <td>{new Intl.NumberFormat("en-DE").format(row.donGiaNhap)}</td>
                <td>{new Intl.NumberFormat("en-DE").format(row.donGia)}</td>
                <td>{row.hanSuDung}</td>
                <td>{row.ngayNhap}</td>
                <td className="fit">
                  <span className="actions">
                    <BsFillTrashFill
                      className="delete-btn"
                      onClick={() => handleDeleteRow(idx)}
                    />
                    <BsFillPencilFill
                      className="edit-btn"
                      onClick={() => handleEditRow(idx)}
                    />
                  </span>
                </td>
              </tr>
            );
          })}
          <tbody></tbody>
        </table>
        {modalOpen && (
          <FormThuoc
            closeModal={() => {
              setModalOpen(false);
              setRowToEdit(null);
            }}
            onSubmit={handleSubmit}
            defaultValue={rowToEdit !== null && drugs[rowToEdit]}
            branches = {branches}
          />
        )}
      </div>
    );
}
export default QuanLyThuoc;