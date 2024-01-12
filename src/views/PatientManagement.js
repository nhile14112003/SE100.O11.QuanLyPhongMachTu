import React, { useState, useEffect, useContext } from 'react'
import './style.css'
import moment from 'moment';
import { BsFillTrashFill, BsFillPencilFill, BsEye } from "react-icons/bs";
import { FormPatient } from '../components/FormPatient';
import { FormRecordMedicine } from '../components/FormRecordMedicine';
import { FormRecordService } from '../components/FormRecordService';
import api from '../api/Api';
import upload from '../api/upload';
import axios from 'axios';
import Select from 'react-select';
import { AuthContext } from '../hook/AuthProvider'


const PatientManagement = (props) => {

    const [customers, setCustomers] = useState([])
    const [imageFile1, setImageFile1] = useState(null);
    const { user } = useContext(AuthContext);
    const [errors, setErrors] = useState("");
    const [medicines, setMedicines] = useState(null)

    const [services, setServices] = useState(null);
    const getService = async () => {
        const services = await api.getAllServices();
        setServices(services);
    }

    const [searchCriteria, setSearchCriteria] = useState({
        maBenhNhan: "",
        tenBenhNhan: "",
        CCCD: "",
        soDienThoai: ""
    })
    const [searchCriteria1, setSearchCriteria1] = useState({
        MaNhaSi: '',
        TenNhaSi: '',
        NgayDieuTri: '',
    })

    const handleChange = (e) => {
        setSearchCriteria({ ...searchCriteria, [e.target.name]: e.target.value });
    };
    const handleChange1 = (e) => {
        setSearchCriteria1({ ...searchCriteria1, [e.target.name]: e.target.value });
    };
    const handleImageChange = (e) => {

        setImageFile1(e.target.files[0]);
        var file = e.target.files[0]
        if (file) {
            var reader = new FileReader();

            // Đọc file như là một URL Data (base64) và hiển thị ảnh
            reader.readAsDataURL(file);
            reader.onload = function (e) {
                var preview = document.getElementById('imagePreview');
                preview.src = e.target.result; // Hiển thị ảnh trong thẻ img
            };

        }
    };
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [page, setPage] = useState(1);
    const [state, setState] = useState("");
    const [patientModalOpen, setPatientModalOpen] = useState(false);
    const [patientRowToEdit, setPatientRowToEdit] = useState(null);
    const [serviceModalOpen, setServiceModalOpen] = useState(false);
    const [serviceRowToEdit, setServiceRowToEdit] = useState(null);
    const [medicineModalOpen, setMedicineModalOpen] = useState(false);
    const [medicineRowToEdit, setMedicineRowToEdit] = useState(null);
    const [recordRowToEdit, setRecordRowToEdit] = useState(null);
    const [khoiphucSL, setKhoiPhucSL] = useState(null);
    const [nhasi, setNhaSi] = useState(user?.Loai === 'Phụ tá' ? [] : user?.ten);
    const [hsdt, setHSDT] = useState(null);
    const [cthsdt, setCTHSDT] = useState({
        MaNhaSi: user?.Loai === 'Phụ tá' ? '' : user?.maNV,
        ChuanDoan: '',
        GhiChu: '',
        DichVu: [],
        Thuoc: []
    })
    const [listcthsdt, setListCTHSDT] = useState(null);
    const getlistCTHSDT = async (item) => {
        const res = await api.getListCTHSDT(item.IDhsdt)
        console.log(res)
        setListCTHSDT(res)
    }
    const getNhaSi = async () => {
        // const response = await api.getStaffsBySeacrh({chucVu:'Nha sĩ',maNhanVien:'', tenNhanVien:'', chiNhanh:'', luongDau:'', luongCuoi:''})
        // console.log(response)
        if (user?.Loai === 'Phụ tá') {
            const response = await api.getAllStaffs();
            var nhasi1 = response.filter((ns) => {
                return ns.chucVu === 'Nha sĩ';
            });
            const fil = nhasi1.filter((item, idx) => item.chiNhanh === user?.chinhanh)
            setNhaSi(fil)
        }
    }
    useEffect(() => {
        getPatients();
        getService();
        getMedicine();
        getNhaSi()
    }, []);
    const getMedicine = async () => {
        const medicine = await api.getAllDrugs()
        const fil = medicine.filter((item, idx) => item.chiNhanh === user?.chinhanh)
        setMedicines(fil)
    }
    const getPatients = async () => {
        const patients = await api.getAllPatients()
        // const fil = patients.filter((item, idx)=>item.chiNhanh===user?.chinhanh)
        setCustomers(patients)
    }
    const nextPage = () => {
        setPage(page + 1);
        window.scrollTo(0, 0);
    }
    const prevPage = () => {
        setPage(page - 1);
        window.scrollTo(0, 0);
    }
    const handleEditRecordRow = async (item, index) => {
        let list = []
        for (let i = 0; i < item.Thuoc.length; i++) {
            const result = medicines.filter((item1, idx) => item1.maThuoc === item.Thuoc[i].maThuoc)
            if (result.length > 0) {
                let lamlai = parseInt(result[0].soLuongTonKho) + parseInt(item.Thuoc[i].SL)
                list.push({ ...result[0], soLuongTonKho: lamlai.toString() })
            }
        }
        const res = await api.Checkpayment(item.Id)

        setKhoiPhucSL(list)
        setSelectedRecord({ ...item, edit: res });
        setRecordRowToEdit(index)
        setCTHSDT({ ...item, edit: res })
        setPage(3);
        setState("edit");
    }
    const handleSubmit = async (newRow) => {
        console.log(newRow);
        if (patientRowToEdit == null) {
            const id = await api.addPatient({ ...newRow, congNo: 0 });
            newRow.Id = id.docId;
            newRow.IDhsdt = id.hsdtId
            setCustomers([...customers, newRow]);
        }
        else {
            await api.updatePatient(newRow, newRow.Id);
            let updatedPatients = customers.map((currRow, idx) => {
                if (idx !== patientRowToEdit) return currRow;
                return newRow;
            })
            setCustomers(updatedPatients)
        }
    }
    const onSearch = async () => {

        const searchResults = await api.getPatientsBySeacrh(searchCriteria);
        console.log(searchResults);
        // const fil = searchResults.filter((item, idx)=>item.chiNhanh===user?.chinhanh)
        setCustomers(searchResults);
        // setSearchCriteria({
        //     maBenhNhan: "",
        //     tenBenhNhan: "",
        //     CCCD: "",
        //     soDienThoai: ""
        // })
    }
    const onSearch1 = async () => {

        const searchResults = await api.getCTHSDTsBySeacrh({ ...searchCriteria1, HSDTid: selectedPatient.IDhsdt });
        // console.log(searchResults);
        setListCTHSDT(searchResults);
    }
    const handleDeleteRecordRow = (targetIndex) => {
        const shouldDelete = window.confirm('Bạn có chắc muốn xóa hồ sơ điều trị này không?');
        console.log('h1')
        if (shouldDelete) {
            console.log('h2')
            api.deleteCTHSDT(listcthsdt[targetIndex].Id, listcthsdt[targetIndex].IdHoaDon)
            setListCTHSDT(listcthsdt.filter((_, idx) => idx !== targetIndex));
            setCTHSDT({
                MaNhaSi: '',
                ChuanDoan: '',
                GhiChu: '',
                DichVu: [],
                Thuoc: []
            })
        }
    }
    const setSelectedPatientRow = async (item) => {
        setSelectedPatient(item);
        const response = await api.getHSDT(item.IDhsdt)
        setHSDT(response)
        getlistCTHSDT(item)
        setPage(2);
    }
    const createNewRecord = () => {

        setPage(3);
        setCTHSDT({
            MaNhaSi: user?.Loai === 'Phụ tá' ? '' : user?.maNV,
            ChuanDoan: '',
            GhiChu: '',
            DichVu: [],
            Thuoc: []
        })
        setState("create")
        setSelectedRecord(null)

    }
    const handleEditPatientRow = (index) => {
        setPatientRowToEdit(index);
        setPatientModalOpen(true);
    }
    const handleDeletePatientRow = async (targetIndex) => {
        const res = await api.getListCTHSDT(customers[targetIndex].IDhsdt)
        console.log('xóa' + res.length + customers[targetIndex].IDhsdt)
        if (res.length > 0) window.confirm('Bệnh nhân này không thể xóa!');
        else if (res.length == 0) {
            const shouldDelete = window.confirm('Bạn có chắc muốn xóa bệnh nhân này không?');
            if (shouldDelete) {
                api.deletePatient(customers[targetIndex].Id, customers[targetIndex].IDhsdt);
                setCustomers(customers.filter((_, idx) => idx !== targetIndex));
                setListCTHSDT(null)
            }
        }
    }
    const handleEditMedicineRow = (index) => {
        setMedicineRowToEdit(index);
        setMedicineModalOpen(true);
    }
    const handleDeleteMedicineRow = (index) => {
        const fil = cthsdt.Thuoc.filter((_, idx) => idx !== index)
        setCTHSDT({ ...cthsdt, Thuoc: fil });
        api.updateCTHSDT({ Thuoc: fil }, cthsdt.Id);
    }
    const handleEditServiceRow = (index) => {
        setServiceRowToEdit(index);
        setServiceModalOpen(true);
    }
    const handleDeleteServiceRow = (index) => {
        const fil = cthsdt.DichVu.filter((_, idx) => idx !== index)
        setCTHSDT({ ...cthsdt, DichVu: fil });
        api.updateCTHSDT({ DichVu: fil }, cthsdt.Id);
    }
    const getTuoi = (ngaysinh) => {
        let tuoi = ngaysinh.split('-')
        var now = new Date();
        var currentYear = now.getFullYear();
        return currentYear - tuoi[0]
    }
    const ThanhTien = () => {
        let tien = 0
        for (let i = 0; i < cthsdt.DichVu.length; i++) {
            if (cthsdt.DichVu[i].taiKham === false)
                tien = tien + parseInt(cthsdt.DichVu[i].DonGia) * parseInt(cthsdt.DichVu[i].SL)
        }
        for (let i = 0; i < cthsdt.Thuoc.length; i++) {
            tien = tien + parseInt(cthsdt.Thuoc[i].donGia) * parseInt(cthsdt.Thuoc[i].SL)
        }
        return tien
    }
    const handlechangeformCTHSDT = (e) => {
        if (cthsdt.edit !== true || state === 'create') {
            setCTHSDT({ ...cthsdt, [e.target.name]: e.target.value })
        }
    }
    const validateForm = () => {
        if (cthsdt.MaNhaSi != '' && cthsdt.ChuanDoan != '' && cthsdt.DichVu.length > 0) {
            return true
        }
        else {
            let errorFields = [];
            for (const [key, value] of Object.entries(cthsdt)) {
                if (value == "" || value == []) {
                    switch (key) {
                        case 'MaNhaSi':
                            errorFields.push("Nha sĩ"); break;
                        case 'ChuanDoan':
                            errorFields.push("Chuẩn đoán"); break;
                        case 'DichVu':
                            errorFields.push("Dịch vụ"); break;
                        default: break;
                    }
                }
            }
            setErrors("Vui lòng nhập: " + errorFields.join(", "));
            return false;
        }
    }
    const saveCTHSDT = async () => {
        if (!validateForm()) return;
        const maNS = cthsdt.MaNhaSi;
        const response = await api.getAllStaffs();
        var nhasi = response.find(function (ns) {
            return ns.maNhanVien === maNS;
        });
        let image = imageFile1;
        if (imageFile1 != null && typeof imageFile1 !== 'string') {
            try {
                const formData = new FormData();
                formData.append('image', imageFile1);
                const response = await axios.post(upload.upImage, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                image = response.data.photo
                console.log(image)
            }
            catch (e) {
            }
        }

        if (selectedRecord == null) {

            var now = new Date();

            var year = now.getFullYear();
            var month = ("0" + (now.getMonth() + 1)).slice(-2); // Thêm '0' ở trước nếu tháng < 10
            var day = ("0" + now.getDate()).slice(-2); // Thêm '0' ở trước nếu ngày < 10
            var formattedDate = year + "-" + month + "-" + day;
            const branchdiachi = await api.getBranchsBySeacrh({ tenChiNhanh: user?.chinhanh, maChiNhanh: '', slpDau: '', slpCuoi: '' })
            console.log(branchdiachi)
            const data = {
                chitietHSDT: {
                    ...cthsdt,
                    TenNhaSi: nhasi.tenNhanVien,
                    IDhsdt: selectedPatient?.IDhsdt,
                    NgayDieuTri: formattedDate,
                    AnhSauDieuTri: image,
                    IdHoaDon: '',
                    tenChiNhanh: branchdiachi[0].tenChiNhanh,
                },
                HoaDon: {
                    maBenhNhan: selectedPatient.maBenhNhan,
                    tenBenhNhan: selectedPatient.tenBenhNhan,
                    soDienThoai: selectedPatient.soDienThoai,
                    ngayLap: formattedDate,
                    DiaChi: selectedPatient.DiaChi,
                    GioiTinh: selectedPatient.GioiTinh,
                    maHoaDon: '',
                    CCCD: selectedPatient.CCCD,
                    NgaySinh: selectedPatient.NgaySinh,
                    maCTHSDT: '',
                    tinhTrang: "Chưa thanh toán",
                    Id: '',
                    conNo: 0,
                    daThanhToan: 0,
                    maGiamGia: '',
                    maNhanVien: '',
                    tuoi: '',
                    tenNhanVien: '',
                    phanTram: 0,
                    tenChiNhanh: branchdiachi[0].tenChiNhanh,
                    diaChiChiNhanh: branchdiachi[0].diaChi,
                    dsThanhToan: [],
                    IdBenhNhan: selectedPatient?.Id,
                    congNo: 0,
                }
            };
            for (let i = 0; i < cthsdt.Thuoc.length; i++) {
                const result = medicines.filter((item, idx) => item.maThuoc === cthsdt.Thuoc[i].maThuoc)
                let conlai = parseInt(result[0].soLuongTonKho) - parseInt(cthsdt.Thuoc[i].SL)
                let updated2 = medicines.map((item, idx) => {
                    if (item.maThuoc !== cthsdt.Thuoc[i].maThuoc) return item;
                    return { ...item, soLuongTonKho: conlai.toString() };
                })
                setMedicines(updated2)
                await api.updateDrug({ soLuongTonKho: conlai.toString() }, result[0].Id)
            }
            const res = await api.addCTHSDT(data);
            let newRow = data.chitietHSDT;
            newRow.Id = res.id;
            newRow.AnhSauDieuTri = res.image;
            setListCTHSDT([...listcthsdt, newRow]);
        }
        else {
            const data = {
                ...cthsdt,
                TenNhaSi: nhasi.tenNhanVien,
                AnhSauDieuTri: image
            };
            for (let i = 0; i < khoiphucSL.length; i++) {
                await api.updateDrug({ soLuongTonKho: khoiphucSL[i].soLuongTonKho }, khoiphucSL[i].Id)
                let updated2 = medicines.map((item, idx) => {
                    if (item.maThuoc !== khoiphucSL[i].maThuoc) return item;
                    return { ...item, soLuongTonKho: khoiphucSL[i].soLuongTonKho };
                })
                setMedicines(updated2)
            }
            for (let i = 0; i < cthsdt.Thuoc.length; i++) {
                const result = medicines.filter((item, idx) => item.maThuoc === cthsdt.Thuoc[i].maThuoc)
                let conlai = parseInt(result[0].soLuongTonKho) - parseInt(cthsdt.Thuoc[i].SL)
                let updated2 = medicines.map((item, idx) => {
                    if (item.maThuoc !== cthsdt.Thuoc[i].maThuoc) return item;
                    return { ...item, soLuongTonKho: conlai.toString() };
                })
                setMedicines(updated2)
                await api.updateDrug({ soLuongTonKho: conlai.toString() }, result[0].Id)
            }
            await api.updateCTHSDT(data, data.Id)
            let updated = listcthsdt.map((currRow, idx) => {
                if (idx !== recordRowToEdit) return currRow;
                return data;
            })
            setListCTHSDT(updated)
        }
        setPage(2)
    };
    return (
        <div>
            <div style={{ minHeight: "630px" }}>
                {page === 1 ? <div>
                    <div className="row">
                        <div className="row ms-0 me-0" style={{ fontWeight: "500" }}>
                            <div className="col-md-6">
                                <div className="mb-2 col-md-6">Mã bệnh nhân</div>
                                <input type="text" className="form-control pb-2 pt-2 mb-2" id="MaBN" name="maBenhNhan" onChange={handleChange} />
                            </div>
                            <div className="col-md-6">
                                <div className="mb-2">Họ tên</div>
                                <input type="text" className="form-control pb-2 pt-2 mb-2" id="TenBN" name="tenBenhNhan" onChange={handleChange} />
                            </div>
                            <div className="col-md-6">
                                <div className="mb-2">Số điện thoại</div>
                                <input type="tel" className="form-control pb-2 pt-2 mb-2" id="SDT" name="soDienThoai" onChange={handleChange} />
                            </div>
                            <div className="col-md-6">
                                <div className="mb-2">Căn cước công dân</div>
                                <input type="text" className="form-control pb-2 pt-2 mb-2" id="CCCD" name="CCCD" onChange={handleChange} />
                            </div>
                            <div className="text-end">
                                <button type="submit" className="btn pb-2 pt-2 mt-2" style={{ backgroundColor: "#0096FF", color: "#FFFFFF" }} onClick={onSearch}>
                                    Tìm kiếm
                                </button>
                                <button type="submit" className="btn pb-2 pt-2 mt-2 ms-3" style={{ backgroundColor: "#0096FF", color: "#FFFFFF" }} onClick={() => { setErrors(""); setPatientModalOpen(true) }}>
                                    Thêm bệnh nhân
                                </button>
                            </div>
                        </div>
                    </div>

                    <table className="table" >
                        <thead style={{ verticalAlign: "middle" }}>
                            <tr className="table-secondary">
                                <th>STT</th>
                                <th>Mã bệnh nhân</th>
                                <th>Tên bệnh nhân</th>
                                <th>CCCD</th>
                                <th>Giới tính</th>
                                <th>Ngày sinh</th>
                                <th>SĐT</th>
                                <th>Địa chỉ</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers?.map((item, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item.maBenhNhan}</td>
                                    <td>{item.tenBenhNhan}</td>
                                    <td>{item.CCCD}</td>
                                    <td>{item.GioiTinh}</td>
                                    <td>{moment(new Date(item.NgaySinh)).format("DD/MM/YYYY")}</td>
                                    <td>{item.soDienThoai}</td>
                                    <td>{item.DiaChi}</td>
                                    <td className="fit">
                                        <span className="actions">
                                            <BsEye
                                                size={19}
                                                color='#0096FF'
                                                onClick={() => setSelectedPatientRow(item)}
                                            />
                                            <BsFillPencilFill
                                                className="edit-btn"
                                                onClick={() => handleEditPatientRow(index)}
                                            />
                                            <BsFillTrashFill
                                                className="delete-btn"
                                                onClick={() => { handleDeletePatientRow(index) }}
                                            />

                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                </div> : null}
                {(page === 2 && selectedPatient !== null) ?
                    <div className='pe-2 ps-2'>
                        <div align="center" style={{ fontSize: "25px", fontWeight: "bold" }}>HỒ SƠ ĐIỀU TRỊ</div>
                        <div className='mt-3 row'>
                            <div className='col-lg-4 col-md-auto mb-2'>
                                <span style={{ fontWeight: "600" }}>Mã hồ sơ điều trị: </span>{hsdt?.MaHSDT}
                            </div>
                            <div className='col-lg-4 col-md-auto mb-2'>
                                <span style={{ fontWeight: "600" }}>Mã bệnh nhân: </span>{hsdt?.MaBenhNhan}
                            </div>
                            <div className='col-lg-4 col-md-auto mb-2'>
                                <span style={{ fontWeight: "600" }}>Tên bệnh nhân: </span>{selectedPatient?.tenBenhNhan}
                            </div>
                            <div className='mb-2'><span style={{ fontWeight: "600" }}>Địa chỉ: </span>{selectedPatient?.DiaChi}</div>
                            <div className='col-lg-4 col-md-auto mb-2'><span style={{ fontWeight: "600" }}>Tuổi: </span>{getTuoi(selectedPatient?.NgaySinh)}
                            </div>
                            <div className='col-lg-4 col-md-auto mb-2'><span style={{ fontWeight: "600" }}>Giới tính: </span>{selectedPatient?.GioiTinh}
                            </div>
                            <div className='col-lg-4 col-md-auto mb-2'><span style={{ fontWeight: "600" }}>Số điện thoại: </span>{selectedPatient?.soDienThoai}
                            </div>
                        </div>
                        <div className="row mt-2">
                            <div className="row" style={{ fontWeight: "500" }}>
                                <div className="col-lg-4 col-md-10">
                                    <div className="mb-2 col-md-6">Mã nha sĩ</div>
                                    <input type="text" className="form-control pb-2 pt-2 mb-2" id="MaBN" name="MaNhaSi" onChange={handleChange1} />
                                </div>
                                <div className="col-lg-4 col-md-10">
                                    <div className="mb-2">Tên nha sĩ</div>
                                    <input type="text" className="form-control pb-2 pt-2 mb-2" id="TenBN" name="TenNhaSi" onChange={handleChange1} />
                                </div>
                                <div className="col-lg-4 col-md-10">
                                    <div className="mb-2">Ngày điều trị</div>
                                    <input type="date" className="form-control pb-2 pt-2 mb-2" id="NgaySuDung" name="NgayDieuTri" onChange={handleChange1} />
                                </div>
                                <div className="text-end">
                                    <button type="submit" className="btn pb-2 pt-2 mt-2" style={{ backgroundColor: "#0096FF", color: "#FFFFFF" }} onClick={onSearch1}>
                                        Tìm kiếm
                                    </button>
                                    <button type="submit" className="btn pb-2 pt-2 mt-2 ms-3" style={{ backgroundColor: "#0096FF", color: "#FFFFFF" }} onClick={() => createNewRecord()}>
                                        Thêm
                                    </button>
                                </div>
                            </div>
                        </div>

                        <table className="table" >
                            <thead style={{ verticalAlign: "middle" }}>
                                <tr className="table-secondary">
                                    <th>STT</th>
                                    <th>Mã nha sĩ điều trị</th>
                                    <th>Tên nha sĩ điều trị</th>
                                    <th>Ngày điều trị</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {listcthsdt?.map((item, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.MaNhaSi}</td>
                                        <td>{item.TenNhaSi}</td>
                                        <td>{moment(new Date(item.NgayDieuTri)).format("DD/MM/YYYY")}</td>
                                        <td className="fit">
                                            <span className="actions">
                                                <BsEye
                                                    className="edit-btn"
                                                    onClick={() => handleEditRecordRow(item, index)}
                                                />
                                                {item?.edit !== true && <BsFillTrashFill
                                                    className="delete-btn"
                                                    onClick={() => handleDeleteRecordRow(index)}
                                                />}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    : null}
                {(page === 3) ?
                    <div className='pe-2 ps-2'>
                        <div align="center" style={{ fontSize: "25px", fontWeight: "bold" }}>CHI TIẾT HỒ SƠ ĐIỀU TRỊ</div>
                        <div align="center" style={{ fontStyle: "italic", fontSize: "14px", color: "#6b6b6b" }}>{(cthsdt?.NgayDieuTri) ?
                            <div align="center" style={{ fontStyle: "italic", fontSize: "14px", color: "#6b6b6b" }}>
                                Ngày {cthsdt?.NgayDieuTri.split("-")[2]} tháng {cthsdt?.NgayDieuTri.split("-")[1]} năm {cthsdt?.NgayDieuTri.split("-")[0]}
                            </div>
                            : <div align="center" style={{ fontStyle: "italic", fontSize: "14px", color: "#6b6b6b" }}>
                                Ngày {new Date().getDate()} tháng {parseInt(new Date().getMonth()) + 1} năm {new Date().getFullYear()}
                            </div>}
                        </div>
                        <div className='mt-3 row'>
                            <div className='col-lg-4 col-md-auto mb-2'>
                                <span style={{ fontWeight: "600" }}>Mã hồ sơ điều trị: </span>{hsdt?.MaHSDT}
                            </div>
                            <div className='col-lg-4 col-md-auto mb-2'>
                                <span style={{ fontWeight: "600" }}>Mã bệnh nhân: </span>{hsdt?.MaBenhNhan}
                            </div>
                            <div className='col-lg-4 col-md-auto mb-2'>
                                <span style={{ fontWeight: "600" }}>Tên bệnh nhân: </span>{selectedPatient?.tenBenhNhan}
                            </div>
                            <div className='mb-2'><span style={{ fontWeight: "600" }}>Địa chỉ: </span>{selectedPatient?.DiaChi}</div>
                            <div className='col-lg-4 col-md-auto mb-2'>
                                <span style={{ fontWeight: "600" }}>Tuổi: </span>{getTuoi(selectedPatient?.NgaySinh)}
                            </div>
                            <div className='col-lg-4 col-md-auto mb-2'>
                                <span style={{ fontWeight: "600" }}>Giới tính: </span>{selectedPatient?.GioiTinh}
                            </div>
                            <div className='col-lg-4 col-md-auto mb-2'>
                                <span style={{ fontWeight: "600" }}>Số điện thoại: </span>{selectedPatient?.soDienThoai}
                            </div>
                        </div>
                        <div>
                            <div className='mb-2' style={{ fontWeight: "600" }}>Nha sĩ điều trị:</div>
                            {user?.Loai === 'Nha sĩ' && <div className='col-md-auto'>
                                <input type="text" className="form-control signature" id="MaNV" name="MaNhaSi" value={state === 'create' ? user?.ten : cthsdt.TenNhaSi} />
                            </div>}
                            {user?.Loai === 'Phụ tá' && <Select className="mb-2"
                                value={nhasi.find(item => item.maNhanVien === cthsdt.MaNhaSi) || ''}
                                onChange={(value) => value !== null ? setCTHSDT({ ...cthsdt, MaNhaSi: value.maNhanVien }) : setCTHSDT({ ...cthsdt, MaNhaSi: '' })}
                                options={nhasi}
                                isClearable
                                getOptionLabel={(item) => item.maNhanVien + '-' + item.tenNhanVien}
                                getOptionValue={(item) => item}
                                placeholder=""
                            />}
                        </div>
                        <div>
                            <div className='col-md-auto mt-auto mb-auto' style={{ fontWeight: "600" }}>Chuẩn đoán:</div>
                            <div>
                                <input type="text" className="form-control signature" id="MaNV" name="ChuanDoan" onChange={handlechangeformCTHSDT} value={cthsdt?.ChuanDoan} />
                            </div>
                        </div>
                        <div>
                            <div className='col-md-auto mt-auto mb-auto' style={{ fontWeight: "600" }}>Ghi chú:</div>
                            <div>
                                <input type="text" className="form-control signature" id="MaNV" name="GhiChu" onChange={handlechangeformCTHSDT} value={cthsdt?.GhiChu} />
                            </div>
                        </div>
                        <div style={{ fontWeight: "600" }}>Ảnh sau khi điều trị:</div>
                        <div className='col-md-4 col-sm-6 m-auto'>
                            {/* cthsdt.AnhSauDieuTri!=null?cthsdt.AnhSauDieuTri:"/images/ava.png */}
                            <img src={cthsdt.AnhSauDieuTri != null ? cthsdt.AnhSauDieuTri : "/images/after_treatment.png"} style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover"
                            }} id="imagePreview" />
                            <input type="file" hidden accept="image/*" name="HinhAnhSauDieuTri" id="HinhAnhSauDieuTri" onChange={handleImageChange} />
                            {(cthsdt.edit !== true || state === 'create') && <div className="mt-3" align="center">
                                <label for="HinhAnhSauDieuTri" className='btn d-flex btn-primary' style={{ width: "fit-content" }}>
                                    <div><i className="fa-solid fa-cloud-arrow-up me-2" style={{ color: "#FFF", fontSize: "35px" }}></i></div>
                                    <div className='m-auto'>Đăng ảnh</div>

                                </label>
                            </div>}
                        </div>
                        {(cthsdt?.edit !== true || state == "create") && <div className="text-end">
                            <button type="submit" className="btn pb-2 pt-2 ps-3 mt-2 pe-3" style={{ backgroundColor: "#0096FF", color: "#FFFFFF" }} onClick={() => setServiceModalOpen(true)}>
                                Thêm dịch vụ
                            </button>
                            <button type="submit" className="btn pb-2 pt-2 ps-3 mt-2 pe-3 ms-3" style={{ backgroundColor: "#0096FF", color: "#FFFFFF" }} onClick={() => setMedicineModalOpen(true)}>
                                Thêm thuốc
                            </button>
                        </div>}
                        <table className="table" >
                            <thead style={{ verticalAlign: "middle" }}>
                                <tr className="table-secondary">
                                    <th>STT</th>
                                    <th>Dịch vụ</th>
                                    <th>Đơn giá</th>
                                    <th>Số lượng</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {cthsdt?.DichVu?.map((item, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.tenDichVu}</td>
                                        <td>{new Intl.NumberFormat("en-DE").format(
                                            item.DonGia
                                        )}</td>
                                        <td>{item.SL}</td>
                                        <td className="fit">
                                            {cthsdt?.edit != true && <span className="actions">
                                                <BsFillTrashFill
                                                    className="delete-btn"
                                                    onClick={() => handleDeleteServiceRow(index)}
                                                />
                                                <BsFillPencilFill
                                                    className="edit-btn"
                                                    onClick={() => handleEditServiceRow(index)}
                                                />
                                            </span>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <table className="table table-borderless" >
                            <tbody>
                                {cthsdt?.Thuoc?.map((item, index) => (
                                    <tr key={index}>
                                        <td>
                                            <div>
                                                <div><b>{index + 1}/ {item.tenThuoc}</b></div>
                                                <div className='ms-3' style={{ fontStyle: "italic" }}>{item.GhiChu}</div>
                                            </div>
                                        </td>
                                        <td>{item.SL} viên</td>
                                        <td>{new Intl.NumberFormat("en-DE").format(
                                            item.donGia
                                        )}/viên
                                        </td>
                                        <td className="fit">
                                            {cthsdt?.edit != true && <span className="actions">
                                                <BsFillTrashFill
                                                    className="delete-btn"
                                                    onClick={() => handleDeleteMedicineRow(index)}
                                                />
                                                <BsFillPencilFill
                                                    className="edit-btn"
                                                    onClick={() => handleEditMedicineRow(index)}
                                                />
                                            </span>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className='text-end mb-2'><b>Thành tiền: {Intl.NumberFormat("en-DE").format(ThanhTien())}</b></div>
                        {errors && <div className="error">{errors}</div>}
                        {(cthsdt.edit != true || state == "create") && <div className="text-end">
                            <button type="submit" className="btn pb-2 pt-2 mt-3 mb-3" style={{ backgroundColor: "#0096FF", color: "#FFFFFF" }} onClick={saveCTHSDT}>
                                Lưu
                            </button>
                        </div>}
                    </div>

                    : null}

            </div>
            <div className="text-end">
                {page !== 1 ? <button type="button"
                    className='btn'
                    style={{ border: "none" }}
                    onClick={() => prevPage()}>
                    <i className="fa-solid fa-chevron-left next_prevBtn"></i>
                </button> : <button className='btn' style={{ border: "none" }}><i className="fa-solid fa-chevron-left next_prevBtn_disabled"></i></button>}
                {((page === 3) || (page === 1 && selectedPatient === null) || (page === 2 && selectedRecord === null)) ?
                    <button className='btn' style={{ border: "none" }}><i className="fa-solid fa-chevron-right next_prevBtn_disabled"></i></button>
                    : <button type="button"
                        className='btn'
                        style={{ border: "none" }}
                        onClick={() => nextPage()}>
                        <i className="fa-solid fa-chevron-right next_prevBtn"></i>
                    </button>}
            </div>
            {
                patientModalOpen && (
                    <FormPatient
                        closeModal={() => {
                            setPatientModalOpen(false);
                            setPatientRowToEdit(null);
                        }}
                        onSubmit={handleSubmit}
                        defaultValue={patientRowToEdit !== null && customers[patientRowToEdit]}
                        medicines={medicines}
                    />
                )
            }

            {
                medicineModalOpen && (
                    <FormRecordMedicine
                        closeModal={() => {
                            setMedicineModalOpen(false);
                            setMedicineRowToEdit(null);
                        }}
                        onSubmit={async (item) => {
                            if (medicineRowToEdit == null) {
                                let list = cthsdt
                                list.Thuoc.push(item)
                                setCTHSDT(list)
                            }
                            else {
                                let updated = cthsdt.Thuoc.map((currRow, idx) => {
                                    if (idx !== medicineRowToEdit) return currRow;
                                    return item;
                                })
                                let list = cthsdt
                                list.Thuoc = updated
                                setCTHSDT(list)
                            }
                        }}
                        defaultValue={medicineRowToEdit !== null && cthsdt?.Thuoc[medicineRowToEdit]}
                        medicines={medicines}
                    />
                )
            }
            {
                serviceModalOpen && services && (
                    <FormRecordService
                        closeModal={() => {
                            setServiceModalOpen(false);
                            setServiceRowToEdit(null);
                        }}
                        onSubmit={async (item) => {
                            if (serviceRowToEdit == null) {
                                let list = cthsdt
                                list.DichVu.push(item)
                                setCTHSDT(list)
                            }
                            else {
                                let updated = cthsdt.DichVu.map((currRow, idx) => {
                                    if (idx !== serviceRowToEdit) return currRow;
                                    return item;
                                })
                                let list = cthsdt
                                list.DichVu = updated
                                setCTHSDT(list)
                            }
                        }}
                        defaultValue={serviceRowToEdit !== null && cthsdt?.DichVu[serviceRowToEdit]}
                        services={services}
                    />
                )
            }
        </div >
    );
}

export default PatientManagement;