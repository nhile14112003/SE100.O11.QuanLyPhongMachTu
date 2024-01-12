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
import { AuthContext } from '../hook/AuthProvider'
import TopNav from "../components/TopNav";
import Footer from '../components/Footer';

const XemHSDT = (props) => {
    const { user } = useContext(AuthContext);
    const [customers, setCustomers] = useState(null)
    const [imageFile1, setImageFile1] = useState(null);



    const [searchCriteria, setSearchCriteria] = useState({
        maBenhNhan: "",
        tenBenhNhan: "",
        CCCD: "",
        soDienThoai: ""
    })
    const onSearch1 = async () => {

        const searchResults = await api.getCTHSDTsBySeacrh({ ...searchCriteria1, HSDTid: selectedPatient.IDhsdt });
        // console.log(searchResults);
        setListCTHSDT(searchResults);
    }
    const [searchCriteria1, setSearchCriteria1] = useState({
        MaNhaSi: '',
        TenNhaSi: '',
        NgayDieuTri: '',
    })

    const handleChange1 = (e) => {
        setSearchCriteria1({ ...searchCriteria1, [e.target.name]: e.target.value });
    };

    const [selectedPatient, setSelectedPatient] = useState(null);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [page, setPage] = useState(2);
    const [state, setState] = useState("");

    const [recordRowToEdit, setRecordRowToEdit] = useState(null);
    const [hsdt, setHSDT] = useState(null);
    const [cthsdt, setCTHSDT] = useState({
        MaNhaSi: '',
        ChuanDoan: '',
        GhiChu: '',
        DichVu: [],
        Thuoc: []
    })
    const [listcthsdt, setListCTHSDT] = useState(null);
    const getlistCTHSDT = async (id) => {
        const res = await api.getListCTHSDT(id)
        console.log(res)
        setListCTHSDT(res)
    }
    useEffect(() => {
        getPatient();
    }, []);

    const getPatient = async () => {
        const patients = await api.getPatientsBySeacrh({
            maBenhNhan: "",
            tenBenhNhan: "",
            CCCD: user.CCCD,
            soDienThoai: ""
        })
        console.log(patients)
        setSelectedPatient(patients[0])
        getHSDT(patients[0].IDhsdt)
        getlistCTHSDT(patients[0].IDhsdt)
    }
    const getHSDT = async (id) => {
        const res = await api.getHSDT(id)
        setHSDT(res)
    }
    const nextPage = () => {
        setPage(page + 1);
        window.scrollTo(0, 0);
    }
    const prevPage = () => {
        setPage(page - 1);
        window.scrollTo(0, 0);
    }
    const handleEditRecordRow = (item, index) => {
        setSelectedRecord(item);
        setRecordRowToEdit(index)
        setCTHSDT(item)
        setPage(3);
        setState("edit");
    }

    const onSearch = async () => {

        const searchResults = await api.getPatientsBySeacrh(searchCriteria);
        // console.log(searchResults);
        setCustomers(searchResults);
    }



    const getTuoi = (ngaysinh) => {
        try {
            let tuoi = ngaysinh.split('-')
            var now = new Date();
            var currentYear = now.getFullYear();
            return currentYear - tuoi[0]
        }
        catch (e) {
            return ''
        }

    }
    const ThanhTien = () => {
        let tien = 0
        for (let i = 0; i < cthsdt.DichVu.length; i++) {
            tien = tien + parseInt(cthsdt.DichVu[i].DonGia) * parseInt(cthsdt.DichVu[i].SL)
        }
        for (let i = 0; i < cthsdt.Thuoc.length; i++) {
            tien = tien + parseInt(cthsdt.Thuoc[i].donGia) * parseInt(cthsdt.Thuoc[i].SL)
        }
        return tien
    }


    return (
        <div>
            <TopNav />
            <div className='m-4'>
                <div style={{ minHeight: "600px" }}>
                    {(page === 2 && selectedPatient !== null) ?
                        <div className='pe-2 ps-2'>
                            <div align="center" style={{ fontSize: "25px", fontWeight: "bold" }}>HỒ SƠ ĐIỀU TRỊ</div>
                            <div className='mt-3 row'>
                                <div className='col-lg-4 col-md-auto mb-2'>
                                    <span style={{ fontWeight: "600" }}>Mã hồ sơ điều trị: </span>{hsdt?.MaHSDT}
                                </div>
                                <div className='col-lg-4 col-md-auto mb-2'>
                                    <span style={{ fontWeight: "600" }}>Mã BN: </span>{hsdt?.MaBenhNhan}
                                </div>
                                <div className='col-lg-4 col-md-auto mb-2'><span style={{ fontWeight: "600" }}>Tên BN: </span>{selectedPatient?.tenBenhNhan}</div>
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
                            <div className="row mt-2">
                                <div className="row" style={{ fontWeight: "600" }}>
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
                                        <input type="date" className="form-control pb-2 pt-2 mb-2" id="NgaySuDung" name="NgaySuDung" onChange={handleChange1} />
                                    </div>
                                    <div className="text-end">
                                        <button type="submit" className="btn pb-2 pt-2 mt-2" style={{ backgroundColor: "#0096FF", color: "#FFFFFF" }} onClick={onSearch1}>
                                            Tìm kiếm
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <table className="table" >
                                <thead>
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
                                            <td>{item.NgayDieuTri}</td>
                                            <td className="fit">
                                                <span className="actions">
                                                    <BsEye
                                                        className="edit-btn"
                                                        onClick={() => handleEditRecordRow(item, index)}
                                                    />
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
                            <div align="center" style={{ fontStyle: "italic", fontSize: "14px", color: "#6b6b6b" }}>
                                Ngày {cthsdt?.NgayDieuTri.split("-")[2]} tháng {cthsdt?.NgayDieuTri.split("-")[1]} năm {cthsdt?.NgayDieuTri.split("-")[0]}
                            </div>
                            <div className='mt-3 row'>
                                <div className='col-lg-4 col-md-auto mb-2'>
                                    <span style={{ fontWeight: "600" }}>Mã hồ sơ điều trị: </span>{hsdt?.MaHSDT}
                                </div>
                                <div className='col-lg-4 col-md-auto mb-2'>
                                    <span style={{ fontWeight: "600" }}>Mã BN: </span>{hsdt?.MaBenhNhan}
                                </div>
                                <div className='col-lg-4 col-md-auto mb-2'>
                                    <span style={{ fontWeight: "600" }}>Tên BN: </span>{selectedPatient?.tenBenhNhan}
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
                                <div className='col-md-auto mt-auto mb-auto' style={{ fontWeight: "600" }}>Nha sĩ điều trị:</div>
                                <div>
                                    <input type="text" className="form-control signature" id="MaNV" name="MaNhaSi" placeholder='Nhập mã nha sĩ' value={cthsdt?.TenNhaSi} />
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-md-auto mt-auto mb-auto' style={{ fontWeight: "600" }}>Chuẩn đoán:</div>
                                <div>
                                    <input type="text" className="form-control signature" id="MaNV" name="ChuanDoan" value={cthsdt?.ChuanDoan} />
                                </div>
                            </div>
                            <div>
                                <div className='col-md-auto mt-auto mb-auto' style={{ fontWeight: "600" }}>Ghi chú:</div>
                                <div>
                                    <input type="text" className="form-control signature" id="MaNV" name="GhiChu" value={cthsdt?.GhiChu} />
                                </div>
                            </div>
                            <div style={{ fontWeight: "600" }}>Ảnh sau khi điều trị:</div>
                            <div className='col-md-4 col-sm-6 m-auto'>
                                <img src={cthsdt.AnhSauDieuTri != null ? cthsdt.AnhSauDieuTri : "/images/after_treatment.png"} style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover"
                                }} id="imagePreview" />
                            </div>

                            <table className="table" >
                                <thead>
                                    <tr className="table-secondary">
                                        <th>STT</th>
                                        <th>Dịch vụ</th>
                                        <th>Đơn giá</th>
                                        <th>Số lượng</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cthsdt?.DichVu?.map((item, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{item.tenDichVu}</td>
                                            <td>{item.DonGia}</td>
                                            <td>{item.SL}</td>
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
                                            <td>{item.donGia}/viên</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className='text-end mb-2'><b>Thành tiền: {ThanhTien()}</b></div>
                        </div>

                        : null}
                </div>
                <div className="text-end">
                    {page !== 2 ? <button type="button"
                        className='btn'
                        style={{ border: "none" }}
                        onClick={() => prevPage()}>
                        <i className="fa-solid fa-chevron-left next_prevBtn"></i>
                    </button> : <button className='btn' style={{ border: "none" }}><i className="fa-solid fa-chevron-left next_prevBtn_disabled"></i></button>}
                    {((page === 3) || (page === 2 && selectedRecord === null)) ?
                        <button className='btn' style={{ border: "none" }}><i className="fa-solid fa-chevron-right next_prevBtn_disabled"></i></button>
                        : <button type="button"
                            className='btn'
                            style={{ border: "none" }}
                            onClick={() => nextPage()}>
                            <i className="fa-solid fa-chevron-right next_prevBtn"></i>
                        </button>}
                </div>

            </div>
            <Footer style={{ marginTop: 0 }} />
        </div >
    );
}

export default XemHSDT;