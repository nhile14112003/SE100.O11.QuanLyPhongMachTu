import axios from "axios";

const client = axios.create({
  baseURL: "http://localhost:3001/api",
});

const getAllServices = async () => {
  try {
    const response = await client.get("/ServiceManagement/getServices");
    if (response.data.success) {
      return response.data.services;
    } else {
      console.log("not get services");
    }
  } catch (error) {
    console.log("error: ", error.message);
    return [];
  }
};
const addService = async (data) => {
  const endpoint = "/ServiceManagement/add";
  try {
    const response = await client.post(endpoint, data);
    return response.data.docId;
  } catch (error) {
    console.log("error: ", error.message);
  }
};
const deleteService = async (id) => {
  try {
    await client.delete("/ServiceManagement/delete/" + id);
  } catch (error) {
    console.log("error: ", error.message);
  }
};
const updateService = async (data, id) => {
  const endpoint = "/ServiceManagement/update/" + id;
  try {
    const response = await client.put(endpoint, data);
  } catch (error) {
    console.error("error: ", error.message);
  }
};
const getServicesBySeacrh = async (searchCriteria) => {
  try {
    const queryParams = new URLSearchParams(searchCriteria).toString();
    const response = await client.get(
      `/ServiceManagement/Services?${queryParams}`
    );

    if (response.data.success) {
      return response.data.services;
    } else {
      console.log("not get services");
    }
  } catch (error) {
    console.log("error: ", error.message);
    return [];
  }
};

const getAllMaterials = async () => {
  try {
    const response = await client.get(
      "/IventoryManagement/Material/getMaterials"
    );
    if (response.data.success) {
      return response.data.materials;
    } else {
      console.log("not get materials");
    }
  } catch (error) {
    console.log("error: ", error.message);
    return [];
  }
};
const addMaterial = async (data) => {
  const endpoint = "/IventoryManagement/Material/add";
  try {
    const response = await client.post(endpoint, data);
    return response.data.docId;
  } catch (error) {
    console.log("error: ", error.message);
  }
};
const deleteMaterial = async (id) => {
  try {
    await client.delete("/IventoryManagement/Material/delete/" + id);
  } catch (error) {
    console.log("error: ", error.message);
  }
};
const updateMaterial = async (data, id) => {
  const endpoint = "/IventoryManagement/Material/update/" + id;
  console.log(id);
  try {
    const response = await client.put(endpoint, data);
  } catch (error) {
    console.error("error: ", error.message);
  }
};
const getMaterialsBySeacrh = async (searchCriteria) => {
  try {
    const queryParams = new URLSearchParams(searchCriteria).toString();
    const response = await client.get(
      `/IventoryManagement/Material/Materials?${queryParams}`
    );

    if (response.data.success) {
      return response.data.materials;
    } else {
      console.log("not get materials");
    }
  } catch (error) {
    console.log("error: ", error.message);
    return [];
  }
};

const getAllDrugs = async () => {
  try {
    const response = await client.get("/IventoryManagement/Drug/getDrugs");
    if (response.data.success) {
      return response.data.drugs;
    } else {
      console.log("not get drugs");
    }
  } catch (error) {
    console.log("error: ", error.message);
    return [];
  }
};
const addDrug = async (data) => {
  const endpoint = "/IventoryManagement/Drug/add";
  try {
    const response = await client.post(endpoint, data);
    return response.data.docId;
  } catch (error) {
    console.log("error: ", error.message);
  }
};
const deleteDrug = async (id) => {
  try {
    await client.delete("/IventoryManagement/Drug/delete/" + id);
  } catch (error) {
    console.log("error: ", error.message);
  }
};
const updateDrug = async (data, id) => {
  const endpoint = "/IventoryManagement/Drug/update/" + id;
  try {
    const response = await client.put(endpoint, data);
  } catch (error) {
    console.error("error: ", error.message);
  }
};
const getDrugsBySeacrh = async (searchCriteria) => {
  try {
    const queryParams = new URLSearchParams(searchCriteria).toString();
    const response = await client.get(
      `/IventoryManagement/Drug/Drugs?${queryParams}`
    );

    if (response.data.success) {
      return response.data.drugs;
    } else {
      console.log("not get drugs");
    }
  } catch (error) {
    console.log("error: ", error.message);
    return [];
  }
};

const getAllBranchs = async () => {
  try {
    const response = await client.get("/BranchManagement/getBranchs");
    if (response.data.success) {
      return response.data.branchs;
    } else {
      console.log("not get branchs");
    }
  } catch (error) {
    console.log("error: ", error.message);
    return [];
  }
};
const addBranch = async (data) => {
  const endpoint = "/BranchManagement/add";
  try {
    const response = await client.post(endpoint, data);
    return response.data.docId;
  } catch (error) {
    console.log("error: ", error.message);
  }
};
const deleteBranch = async (id) => {
  try {
    await client.delete("/BranchManagement/delete/" + id);
  } catch (error) {
    console.log("error: ", error.message);
  }
};
const updateBranch = async (data, id) => {
  const endpoint = "/BranchManagement/update/" + id;
  try {
    const response = await client.put(endpoint, data);
  } catch (error) {
    console.error("error: ", error.message);
  }
};
const getBranchsBySeacrh = async (searchCriteria) => {
  try {
    const queryParams = new URLSearchParams(searchCriteria).toString();
    const response = await client.get(
      `/BranchManagement/Branchs?${queryParams}`
    );

    if (response.data.success) {
      return response.data.branchs;
    } else {
      console.log("not get branchs");
    }
  } catch (error) {
    console.log("error: ", error.message);
    return [];
  }
};

const getAllFeedbacks = async (sortOrder) => {
  try {
    const queryParams = new URLSearchParams({
      sortOrder: sortOrder,
    }).toString();
    const response = await client.get(
      `/FeedbackManagement/getFeedbacks?${queryParams}`
    );
    if (response.data.success) {
      return response.data.feedbacks;
    } else {
      console.log("not get drugs");
    }
  } catch (error) {
    console.log("error: ", error.message);
    return [];
  }
};
const addFeedback = async (data) => {
  const endpoint = "/FeedbackManagement/add";
  try {
    const response = await client.post(endpoint, data);
    return response.data.docId;
  } catch (error) {
    console.log("error: ", error.message);
  }
};

const getAllStaffs = async () => {
  try {
    const response = await client.get("/StaffManagement/getStaffs");
    if (response.data.success) {
      return response.data.staffs;
    } else {
      console.log("not get staffs");
    }
  } catch (error) {
    console.log("error: ", error.message);
    return [];
  }
};
const addStaff = async (data) => {
  const endpoint = "/StaffManagement/add";
  try {
    const response = await client.post(endpoint, data);
    return response.data.docId;
  } catch (error) {
    console.log("error: ", error.message);
  }
};
const deleteStaff = async (id) => {
  try {
    await client.delete("/StaffManagement/delete/" + id);
  } catch (error) {
    console.log("error: ", error.message);
  }
};
const updateStaff = async (data, id) => {
  const endpoint = "/StaffManagement/update/" + id;
  console.log(id);
  console.log(data);
  try {
    const response = await client.put(endpoint, data);
  } catch (error) {
    console.error("error: ", error.message);
  }
};
const getStaffsBySeacrh = async (searchCriteria) => {
  try {
    const queryParams = new URLSearchParams(searchCriteria).toString();
    const response = await client.get(`/StaffManagement/Staffs?${queryParams}`);

    if (response.data.success) {
      return response.data.staffs;
    } else {
      console.log("not get staffs");
    }
  } catch (error) {
    console.log("error: ", error.message);
    return [];
  }
};

const getAllDiscounts = async () => {
  try {
    const response = await client.get("/DiscountManagement/getDiscounts");
    if (response.data.success) {
      return response.data.discounts;
    } else {
      console.log("not get discounts");
    }
  } catch (error) {
    console.log("error: ", error.message);
    return [];
  }
};
const addDiscount = async (data) => {
  const endpoint = "/DiscountManagement/add";
  try {
    const response = await client.post(endpoint, data);
    return response.data.docId;
  } catch (error) {
    console.log("error: ", error.message);
  }
};
const updateDiscount = async (data, id) => {
  const endpoint = "/DiscountManagement/update/" + id;
  try {
    await client.put(endpoint, data);
  } catch (error) {
    console.error("error: ", error.message);
  }
};
const deleteDiscount = async (id) => {
  try {
    await client.delete("/DiscountManagement/delete/" + id);
  } catch (error) {
    console.log("error: ", error.message);
  }
};
const getDiscountsBySearch = async (searchCriteria) => {
  try {
    const queryParams = new URLSearchParams(searchCriteria).toString();
    const response = await client.get(
      `/DiscountManagement/Discounts?${queryParams}`
    );

    if (response.data.success) {
      return response.data.discounts;
    } else {
      console.log("not get discounts");
    }
  } catch (error) {
    console.log("error: ", error.message);
    return [];
  }
};

const getAllBills = async () => {
  try {
    const response = await client.get("/BillManagement/getBills");
    if (response.data.success) {
      return response.data.bills;
    } else {
      console.log("not get bills");
    }
  } catch (error) {
    console.log("error: ", error.message);
    return [];
  }
};
const addBill = async (data) => {
  const endpoint = "/BillManagement/add";
  try {
    const response = await client.post(endpoint, data);
    return response.data.docId;
  } catch (error) {
    console.log("error: ", error.message);
  }
};
const updateBill = async (data, id) => {
  const endpoint = "/BillManagement/update/" + id;
  try {
    await client.put(endpoint, data);
  } catch (error) {
    console.error("error: ", error.message);
  }
};
const deleteBill = async (id) => {
  try {
    await client.delete("/BillManagement/delete/" + id);
  } catch (error) {
    console.log("error: ", error.message);
  }
};
const getBillsBySearch = async (searchCriteria) => {
  try {
    const queryParams = new URLSearchParams(searchCriteria).toString();
    const response = await client.get(`/BillManagement/Bills?${queryParams}`);

    if (response.data.success) {
      return response.data.bills;
    } else {
      console.log("not get bills");
    }
  } catch (error) {
    console.log("error: ", error.message);
    return [];
  }
};

const getTreatmentRecordDetailById = async (id) => {
  try {
    const response = await client.get(
      "/TreatmentRecordDetailManagement/getTreatmentRecordDetailById/" + id
    );
    if (response.data.success) {
      console.log(response.data.cthsdtById);
      return response.data.cthsdtById;
    } else {
      console.log("not get treatment record detail");
    }
  } catch (error) {
    console.log("error: ", error.message);
    return [];
  }
};

const addDoctorSchedule = async (data) => {
  const endpoint = "/ScheduleManagement/DoctorSchedule/add";
  try {
    const response = await client.post(endpoint, data);
    return response.data.docId;
  } catch (error) {
    console.log("error: ", error.message);
  }
};
const updateDoctorSchedule = async (endpoint, data) => {
  try {
    const response = await client.put(endpoint, data);
    return response.data.success;
  } catch (error) {
    console.error("error: ", error.message);
  }
};
const addDoc = async (endpoint, data) => {
  try {
    const response = await client.post(endpoint, data);
    return response.data.docId;
  } catch (error) {
    console.log("error: ", error.message);
  }
};

const updateDoc = async (endpoint, data) => {
  try {
    const response = await client.put(endpoint, data);
    return response.data.success;
  } catch (error) {
    console.error("error: ", error.message);
  }
};
const deleteDoc = async (endpoint) => {
  try {
    const response = await client.delete(endpoint);
    return response.data.success;
  } catch (error) {
    console.log("error: ", error.message);
  }
};
const getDoc = async (endpoint) => {
  try {
    const response = await client.get(endpoint);
    if (response.data.success) {
      return response.data.item;
    } else return null;
  } catch (error) {
    console.log("error: ", error.message);
    return null;
  }
};
const getDocs = async (endpoint) => {
  try {
    const response = await client.get(endpoint);
    if (response.data.success) {
      return response.data.list;
    } else {
      console.log("not get list");
    }
  } catch (error) {
    console.log("error: ", error.message);
    return [];
  }
};
const getDocByField = async (endpoint) => {
  try {
    const response = await client.get(endpoint);
    if (response.data.success) {
      return response.data.list;
    } else {
      console.log("not get list");
      return [];
    }
  } catch (error) {
    console.log("error: ", error.message);
    return [];
  }
};
const getDocsBySeacrh = async (endpoint, searchCriteria) => {
  try {
    const queryParams = new URLSearchParams(searchCriteria).toString();
    const response = await client.get(`${endpoint}?${queryParams}`);

    if (response.data.success) {
      return response.data.list;
    }
    return [];
  } catch (error) {
    console.log("error: ", error.message);
    return [];
  }
};
const getAllPatients = async () => {
  try {
    const response = await client.get("/PatientManagement/getPatients");
    if (response.data.success) {
      return response.data.patients;
    } else {
      console.log("not get patients");
    }
  } catch (error) {
    console.log("error: ", error.message);
    return [];
  }
};
const addPatient = async (data) => {
  const endpoint = "/PatientManagement/add";
  try {
    const response = await client.post(endpoint, data);
    return { docId: response.data.docId, hsdtId: response.data.IDhsdt };
  } catch (error) {
    console.log("error: ", error.message);
  }
};
const deletePatient = async (id, HSId) => {
  try {
    await client.delete("/PatientManagement/delete/" + id + '/' + HSId);
  } catch (error) {
    console.log("error: ", error.message);
  }
};
const updatePatient = async (data, id) => {
  const endpoint = "/PatientManagement/update/" + id;
  try {
    const response = await client.put(endpoint, data);
  } catch (error) {
    console.error("error: ", error.message);
  }
};
const getPatientsBySeacrh = async (searchCriteria) => {
  try {
    const queryParams = new URLSearchParams(searchCriteria).toString();
    const response = await client.get(
      `/PatientManagement/Patients?${queryParams}`
    );

    if (response.data.success) {
      return response.data.patients;
    } else {
      console.log("not get patients");
    }
  } catch (error) {
    console.log("error: ", error.message);
    return [];
  }
};
const getHSDT = async (id) => {
  try {
    const response = await client.get("/PatientManagement/getHSDT/" + id);
    if (response.data.success) {
      return response.data.HSDT;
    } else {
      console.log("not get HSDT");
    }
  } catch (error) {
    console.log("error: ", error.message);
    return {};
  }
};
// router.post('/PatientManagement/chitietHSDT/add', addchitietHSDT);
// router.put('/PatientManagement/chitietHSDT/update/:Id', updateCTHSDT);
const addCTHSDT = async (data) => {
  const endpoint = "/PatientManagement/chitietHSDT/add";
  try {
    const response = await client.post(endpoint, data);
    return { id: response.data.docId, image: response.data.image };
  } catch (error) {
    console.log("error: ", error.message);
  }
};
const updateCTHSDT = async (data, id) => {
  const endpoint = "/PatientManagement/chitietHSDT/update/" + id;
  try {
    const response = await client.put(endpoint, data);
  } catch (error) {
    console.error("error: ", error.message);
  }
};
// router.get('/PatientManagement/getCTHSDT/:HSId', getCTHSDT);
const getListCTHSDT = async (id) => {
  try {
    const response = await client.get("/PatientManagement/getCTHSDT/" + id);
    if (response.data.success) {
      return response.data.cthsdt;
    } else {
      console.log("not get list CTHSDT");
    }
  } catch (error) {
    console.log("error: ", error.message);
    return [];
  }
};
const updateUser = async (userData) => {
  const endpoint = "/updateUser/" + userData.id;
  console.log(endpoint);
  try {
    const response = await client.put(endpoint, userData);
    console.log(response.data);
  } catch (error) {
    console.log("error: ", error.message);
  }
};
const getUserData = async (userId) => {
  const endpoint = "/UserData/" + userId;
  try {
    const response = await client.get(endpoint);
    if (response.data.success) {
      return response.data.userData;
    } else {
      console.log("not get user data");
    }
  } catch (error) {
    console.log("error: ", error.message);
    return 0;
  }
};
const setUserInfo = async (userData) => {
  const endpoint = "/setUserInfo/" + userData.id;
  console.log(endpoint);
  try {
    const response = await client.put(endpoint, userData);
    console.log(response.data);
  } catch (error) {
    console.log("error: ", error.message);
  }
};
const addUser = async (data) => {
  try {
    const response = await client.post("/addUser", data);
    return response.data;
  } catch (error) {
    console.log("error: ", error.message);
  }
};
const getPatientData = async (Id) => {
  const endpoint = "/PatientManagement/PatientData/" + Id;
  try {
    const response = await client.get(endpoint);
    if (response.data.success) {
      return response.data.patientData;
    } else {
      console.log("not get patient data");
    }
  } catch (error) {
    console.log("error: ", error.message);
    return {};
  }
};
// router.delete('/PatientManagement/deleteCTHSDT/:Id', deleteCTHSDT);
const deleteCTHSDT = async (id, idHD) => {
  try {
    await client.delete("/PatientManagement/deleteCTHSDT/" + id + "/" + idHD);
  } catch (error) {
    console.log("error: ", error.message);
  }
};
// router.get('/PatientManagement/Search/CTHSDT', getCTHSDTsBySearch);
const getCTHSDTsBySeacrh = async (searchCriteria) => {
  try {
    const queryParams = new URLSearchParams(searchCriteria).toString();
    const response = await client.get(
      `/PatientManagement/Search/CTHSDT?${queryParams}`
    );

    if (response.data.success) {
      return response.data.cthsdts;
    } else {
      console.log("not get cthsdts");
    }
  } catch (error) {
    console.log("error: ", error.message);
    return [];
  }
};
// router.get('/MaterialUsed/get', getMaterialsUsed);
// router.get('/MaterialUsed/search', getMaterialUsedBySearch);
// router.post('/MaterialUsed/add', addMaterialUsed);
// router.put('/MaterialUsed/update/:Id', updateMaterialUsed);
// router.delete('/MaterialUsed/delete/:Id', deleteMaterialUsed);
const getMaterialsUsed = async () => {
  try {
    const response = await client.get("/MaterialUsed/get");
    if (response.data.success) {
      return response.data.MU;
    } else {
      console.log("not get material use");
    }
  } catch (error) {
    console.log("error: ", error.message);
    return [];
  }
};
const addMaterialUsed = async (data) => {
  const endpoint = "/MaterialUsed/add";
  try {
    const response = await client.post(endpoint, data);
    return response.data.docId;
  } catch (error) {
    console.log("error: ", error.message);
  }
};
const deleteMaterialUsed = async (id) => {
  try {
    await client.delete("/MaterialUsed/delete/" + id);
  } catch (error) {
    console.log("error: ", error.message);
  }
};
const updateMaterialUsed = async (data, id) => {
  const endpoint = "/MaterialUsed/update/" + id;
  try {
    const response = await client.put(endpoint, data);
  } catch (error) {
    console.error("error: ", error.message);
  }
};
const getMaterialUsedBySearch = async (searchCriteria) => {
  try {
    const queryParams = new URLSearchParams(searchCriteria).toString();
    const response = await client.get(`/MaterialUsed/search?${queryParams}`);

    if (response.data.success) {
      return response.data.VatTuDaSuDung;
    } else {
      console.log("not get VatTuDaSuDung");
    }
  } catch (error) {
    console.log("error: ", error.message);
    return [];
  }
};
// router.get('/findAccountofStaff/:maNV',findStaffbymaNV)
const findAccountofStaff = async (maNV) => {
  try {
    const response = await client.get("/findAccountofStaff/" + maNV);
    if (response.data.success) {
      return response.data.idTK;
    } else {
      console.log("not get");
    }
  } catch (error) {
    console.log("error: ", error.message);
    return {};
  }
};
// router.delete("/deleteUserAccount/:Id", deleteUser);
const deleteUserAccount = async (id) => {
  try {
    await client.delete("/deleteUserAccount/" + id);
  } catch (error) {
    console.log("error: ", error.message);
  }
};
const Checkpayment = async (Id) => {
  try {
    const response = await client.get("/PatientManagement/Checkpayment/" + Id);
    if (response.data.success) {
      return response.data.edit;
    } else {
      console.log("not check payment");
    }
  } catch (error) {
    console.log("error: ", error.message);
  }
};
export default {
  getAllServices,
  addService,
  updateService,
  deleteService,
  getServicesBySeacrh,
  getAllMaterials,
  addMaterial,
  updateMaterial,
  deleteMaterial,
  getMaterialsBySeacrh,
  getAllDrugs,
  addDrug,
  updateDrug,
  deleteDrug,
  getDrugsBySeacrh,
  getAllBranchs,
  addBranch,
  updateBranch,
  deleteBranch,
  getBranchsBySeacrh,
  getAllFeedbacks,
  addFeedback,
  getAllStaffs,
  addStaff,
  updateStaff,
  deleteStaff,
  getStaffsBySeacrh,
  getAllDiscounts,
  addDiscount,
  updateDiscount,
  deleteDiscount,
  getDiscountsBySearch,
  getAllBills,
  addBill,
  updateBill,
  getTreatmentRecordDetailById,
  getBillsBySearch,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocByField,
  getDocsBySeacrh,
  addDoctorSchedule,
  updateDoctorSchedule,
  getAllPatients,
  addPatient,
  updatePatient,
  deletePatient,
  getPatientsBySeacrh,
  getHSDT,
  addCTHSDT,
  updateCTHSDT,
  getListCTHSDT,
  getPatientData,
  deleteCTHSDT,
  getCTHSDTsBySeacrh,
  addUser,
  updateUser,
  setUserInfo,
  getUserData,
  addMaterialUsed,
  getMaterialsUsed,
  updateMaterialUsed,
  deleteMaterialUsed,
  getMaterialUsedBySearch,
  findAccountofStaff,
  deleteUserAccount,
  Checkpayment
};
