const express = require("express");
const router = express.Router();
const {
  setUserInfo,
  addUser,
  SignIn,
  sendEmail,
  checkUserName,
  updateUser,
  getUserData,
  findStaffbymaNV,
  deleteUser,
} = require("../controllers/User");
const {
  getAllServices,
  addService,
  updateService,
  deleteService,
  getServicesBySearch,
} = require("../controllers/Service");
const {
  getAllMaterials,
  addMaterial,
  updateMaterial,
  deleteMaterial,
  getMaterialsBySearch,
  getAllDrugs,
  addDrug,
  updateDrug,
  deleteDrug,
  getDrugsBySearch,
} = require("../controllers/Iventory");
const {
  getAllBranchs,
  addBranch,
  updateBranch,
  deleteBranch,
  getBranchsBySearch,
} = require("../controllers/Branch");
const { getAllFeedbacks, addFeedback } = require("../controllers/Feedback");
const {
  getAllStaffs,
  addStaff,
  updateStaff,
  deleteStaff,
  getStaffsBySearch,
} = require("../controllers/Staff");
const {
  getAllDiscount,
  addDiscount,
  updateDiscount,
  deleteDiscount,
  getDiscountsBySearch,
} = require("../controllers/Discount");
const {
  getAllBills,
  addBill,
  updateBill,
  deleteBill,
  getBillsBySearch,
} = require("../controllers/Bill");
const {
  getTreatmentRecordDetailById,
} = require("../controllers/TreatmentRecordDetail");
const {
  getAppointmentsBySearch,
  addDocument,
  deleteDocument,
  updateDocument,
  getAllDocuments,
  getDocument,
  addDoctorSchedule,
  getDocumentByField,
  updateDoctorSchedule,
} = require("../controllers/Schedule");
const {
  getAllPatients,
  addPatient,
  updatePatient,
  deletePatient,
  getPatientsBySearch,
  getHSDT,
  addchitietHSDT,
  updateCTHSDT,
  getListCTHSDT,
  getPatientData,
  deleteCTHSDT,
  getCTHSDTsBySearch,
  checktinhtrang
} = require("../controllers/Patient");
const {
  getMaterialUsedBySearch,
  getMaterialsUsed,
  updateMaterialUsed,
  deleteMaterialUsed,
  addMaterialUsed,
} = require("../controllers/MaterialUsed");

//user
router.put("/setUserInfo/:userId", setUserInfo);
router.post("/addUser", addUser);
router.post("/sendEmail", sendEmail);
router.get("/SignIn/:name/:pass", SignIn);
router.get("/checkUserName/:name", checkUserName);
router.get("/UserData/:userId", getUserData);
router.put("/updateUser/:userId", updateUser);
router.get("/findAccountofStaff/:maNV", findStaffbymaNV);
router.delete("/deleteUserAccount/:Id", deleteUser);
//service
router.get("/ServiceManagement/getServices", getAllServices);
router.get("/ServiceManagement/Services", getServicesBySearch);
router.post("/ServiceManagement/add", addService);
router.put("/ServiceManagement/update/:serviceId", updateService);
router.delete("/ServiceManagement/delete/:serviceId", deleteService);
//Iventory
router.get("/IventoryManagement/Material/getMaterials", getAllMaterials);
router.get("/IventoryManagement/Material/Materials", getMaterialsBySearch);
router.post("/IventoryManagement/Material/add", addMaterial);
router.put("/IventoryManagement/Material/update/:materialId", updateMaterial);
router.delete(
  "/IventoryManagement/Material/delete/:materialId",
  deleteMaterial
);
router.get("/IventoryManagement/Drug/getDrugs", getAllDrugs);
router.get("/IventoryManagement/Drug/Drugs", getDrugsBySearch);
router.post("/IventoryManagement/Drug/add", addDrug);
router.put("/IventoryManagement/Drug/update/:drugId", updateDrug);
router.delete("/IventoryManagement/Drug/delete/:drugId", deleteDrug);
//Branch
router.get("/BranchManagement/getBranchs", getAllBranchs);
router.get("/BranchManagement/Branchs", getBranchsBySearch);
router.post("/BranchManagement/add", addBranch);
router.put("/BranchManagement/update/:branchId", updateBranch);
router.delete("/BranchManagement/delete/:branchId", deleteBranch);
//Feedback
router.get("/FeedbackManagement/getFeedbacks", getAllFeedbacks);
router.post("/FeedbackManagement/add", addFeedback);
//Staff
router.get("/StaffManagement/getStaffs", getAllStaffs);
router.get("/StaffManagement/Staffs", getStaffsBySearch);
router.post("/StaffManagement/add", addStaff);
router.put("/StaffManagement/update/:staffId", updateStaff);
router.delete("/StaffManagement/delete/:staffId", deleteStaff);
router.get("/StaffManagement/getAll/:dataName", getAllDocuments);
router.post("/StaffManagement/add/:dataName", addDocument);
router.put("/StaffManagement/:dataName/update/:id", updateDocument);
router.delete("/StaffManagement/:dataName/delete/:id", deleteDocument);
//Discount
router.get("/DiscountManagement/getDiscounts", getAllDiscount);
router.post("/DiscountManagement/add", addDiscount);
router.put("/DiscountManagement/update/:discountId", updateDiscount);
router.delete("/DiscountManagement/delete/:discountId", deleteDiscount);
router.get("/DiscountManagement/Discounts", getDiscountsBySearch);
//Bill
router.get("/BillManagement/getBills", getAllBills);
router.post("/BillManagement/add", addBill);
router.put("/BillManagement/update/:billId", updateBill);
router.delete("/BillManagement/delete/:billId", deleteBill);
router.get("/BillManagement/Bills", getBillsBySearch);
//TreatmentRecordDetail
router.get(
  "/TreatmentRecordDetailManagement/getTreatmentRecordDetailById/:cthsdtId",
  getTreatmentRecordDetailById
);
//Schedule
router.get("/ScheduleManagement/getAppointments", getAppointmentsBySearch);
router.get("/ScheduleManagement/getAll/:dataName", getAllDocuments);
router.post("/ScheduleManagement/add/:dataName", addDocument);
router.put("/ScheduleManagement/update/:dataName/:id", updateDocument);
router.delete("/ScheduleManagement/delete/:dataName/:id", deleteDocument);
router.get("/ScheduleManagement/get/:dataName/:id", getDocument);
router.get(
  "/ScheduleManagement/getByField/:dataName/:fieldName",
  getDocumentByField
);

router.post("/ScheduleManagement/DoctorSchedule/add", addDoctorSchedule);
router.put(
  "/ScheduleManagement/DoctorSchedule/update/:id",
  updateDoctorSchedule
);
//Patient
router.get("/PatientManagement/getPatients", getAllPatients);
router.get("/PatientManagement/Patients", getPatientsBySearch);
router.post("/PatientManagement/add", addPatient);
router.put("/PatientManagement/update/:patientId", updatePatient);
router.delete("/PatientManagement/delete/:patientId/:HSId", deletePatient);
router.get("/PatientManagement/getHSDT/:IDhsdt", getHSDT);
router.post("/PatientManagement/chitietHSDT/add", addchitietHSDT);
router.put("/PatientManagement/chitietHSDT/update/:Id", updateCTHSDT);
router.get("/PatientManagement/getCTHSDT/:HSId", getListCTHSDT);
router.get("/PatientManagement/PatientData/:Id", getPatientData);
router.delete("/PatientManagement/deleteCTHSDT/:Id/:IdHD", deleteCTHSDT);
router.get("/PatientManagement/Search/CTHSDT", getCTHSDTsBySearch);
router.get("/PatientManagement/Checkpayment/:Id", checktinhtrang);
//materialused
router.get("/MaterialUsed/get", getMaterialsUsed);
router.get("/MaterialUsed/search", getMaterialUsedBySearch);
router.post("/MaterialUsed/add", addMaterialUsed);
router.put("/MaterialUsed/update/:Id", updateMaterialUsed);
router.delete("/MaterialUsed/delete/:Id", deleteMaterialUsed);

//StatisticalReport
router.get("/StatisticalReport/getAll/:dataName", getAllDocuments);
router.get("/StatisticalReport/get/:dataName/:id", getDocument);
router.get(
  "/StatisticalReport/getByField/:dataName/:fieldName",
  getDocumentByField
);
module.exports = router;
