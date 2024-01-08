import { useState } from "react";
import Select from 'react-select';

export const FormPatient = ({ closeModal, onSubmit, defaultValue, customers }) => {
    const [formState, setFormState] = useState(
        defaultValue || {
            maBenhNhan: "",
            tenBenhNhan: "",
            CCCD: "",
            GioiTinh: "Nam",
            NgaySinh: "",
            soDienThoai: "",
            DiaChi: ""
        }
    );
    const [errors, setErrors] = useState("");
    function isPositiveInteger(A) {
      // && Number.isInteger(A)
        if (A > 0) {
          return true; // A là số nguyên dương
        } else {
          return false; // A không phải là số nguyên dương
        }
      }
    const validateForm = () => {
        console.log(formState)
    if (formState.maBenhNhan!='' && formState.tenBenhNhan!='' && formState.soDienThoai!='' && formState.CCCD!='' && formState.NgaySinh!='' && formState.DiaChi!='') {
      const isIdExists = customers?.some(customer => customer.maBenhNhan == formState.maBenhNhan);
      const isIdExists1 = customers?.some(customer => customer.CCCD== formState.CCCD);
      const S = formState.NgaySinh.split('-')
      const namS = parseInt(S[0])
      const thangS = parseInt(S[1])
      const ngayS = parseInt(S[2])
      const currentDate = new Date();
      const Day = currentDate.getDate(); 
      const Month = currentDate.getMonth() + 1; 
      const Year = currentDate.getFullYear();
      if( isIdExists == true){
        setErrors("Mã bệnh nhân này đã tồn tại! Vui lòng nhập một mã bệnh nhân khác.");
        return false;
      }
      else if(!formState.maBenhNhan.startsWith('BN')){
        setErrors("Mã bệnh nhân phải bắt đầu bằng 'BN'.");
        return false
      }
      else if(namS > Year - 3){
        setErrors("Năm sinh phải nhỏ hơn năm hiện tại ít nhất "+Year-3+" năm");
        return false
      }
      else if(isIdExists1 == true){
        setErrors("Căn cước công dân này đã tồn tại! Vui lòng nhập một căn cước công dân khác.");
        return false;
      }
      else if(formState.CCCD.length != 12){
        setErrors("Căn cước công dân này không hợp lệ! Vui lòng nhập căn cước công dân có 12 chữ số.");
        return false;
      }
      else if(formState.soDienThoai.length != 10){
        setErrors("Số điện thoại này không hợp lệ! Vui lòng nhập số điện thoại có 10 chữ số.");
        return false;
      }
      else if(!isPositiveInteger(formState.CCCD)){
        setErrors("Căn cước công dân này không hợp lệ! Vui lòng nhập căn cước công dân là số nguyên dương.");
        return false;
      }
      else if(!isPositiveInteger(formState.soDienThoai)){
        setErrors("Số điện thoại này không hợp lệ! Vui lòng nhập số điện thoại là số nguyên dương.");
        return false;
      }
      else {
        setErrors("");
        return true;
      }
    } else {
      let errorFields = [];
      for (const [key, value] of Object.entries(formState)) {
        if (value == "") {
          switch (key){
            case 'maBenhNhan': 
              errorFields.push("Mã Bệnh Nhân"); break;
            case 'tenNhanVien': 
              errorFields.push("Tên Bệnh Nhân"); break;
            case 'soDienThoai': 
              errorFields.push("Số điện thoại"); break;
            case 'CCCD': 
              errorFields.push("CCCD"); break;
            case 'NgaySinh': 
              errorFields.push("Ngày sinh"); break;  
            case 'DiaChi': 
              errorFields.push("Địa chỉ"); break;  
            default: break;         
          }
        }
      }
      setErrors("Vui lòng nhập: " + errorFields.join(", "));
      return false;
    }
    };

    const handleChange = (e) => {
       
        setFormState({ ...formState, [e.target.name]: e.target.value })

    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        onSubmit(formState);
    
        closeModal();
    };
    const handleGioiTinhChange = (event) => {
        const selectedValue = event.target.value;
        setFormState({
          ...formState,
          GioiTinh: selectedValue, 
        });
      };
    return (
        <div
            className="modal-container"
            onClick={(e) => {
                if (e.target.className === "modal-container") closeModal();
            }}
        >
            <div className="col-sm-4 modal1">
                <form>
                    <div className="mb-2"><b>Mã bệnh nhân</b></div>
                    <input type="text" className="form-control pb-2 pt-2 mb-2" value={formState.maBenhNhan} id="MaBN" name="maBenhNhan" onChange={handleChange} />
                    <div className="mb-2"><b>Tên bệnh nhân</b></div>
                    <input type="text" className="form-control pb-2 pt-2 mb-2" value={formState.tenBenhNhan} id="TenBN" name="tenBenhNhan" onChange={handleChange} />
                    <div className="mb-2"><b>Giới tính</b></div>
                    <select className="form-select pb-2 pt-2 mb-2" aria-label="Chọn chi nhánh" value={formState.GioiTinh} onChange={handleGioiTinhChange}>
                        <option selected value="nam">Nam</option>
                        <option value="nữ">Nữ</option>
                    </select>
                    <div className="mb-2"><b>CCCD</b></div>
                    <input type="number" className="form-control pb-2 pt-2 mb-2" value={formState.CCCD} id="CCCD" name="CCCD" onChange={handleChange} />
                    <div className="mb-2"><b>Ngày sinh</b></div>
                    <input type="date" className="form-control pb-2 pt-2 mb-2" value={formState.NgaySinh} id="NgaySinh" name="NgaySinh" onChange={handleChange} />
                    <div className="mb-2"><b>SĐT</b></div>
                    <input type="number" className="form-control pb-2 pt-2 mb-2" value={formState.soDienThoai} id="SDT" name="soDienThoai" onChange={handleChange} />
                    <div className="mb-2"><b>Địa chỉ</b></div>
                    <input type="text" className="form-control pb-2 pt-2 mb-2" id="DiaChi" name="DiaChi" value={formState.DiaChi} onChange={handleChange} />
                    {errors && <div className="error">{errors}</div>}
                    <div className="text-end">
                        <button type="submit" className="btn pb-2 pt-2 ps-3 pe-3 mt-2" style={{ backgroundColor: "#0096FF", color: "#FFFFFF" }} onClick={(e) => handleSubmit(e)}>
                            Lưu
                        </button>

                    </div>
                </form>
            </div>
        </div>
    );
};
