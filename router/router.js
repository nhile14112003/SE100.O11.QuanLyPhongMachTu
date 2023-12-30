const express = require("express");
const router = express.Router();
const {
  setUserInfo,
  addUser,
  SignIn,
  sendEmail,
  checkUserName,
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
const { getAllBills, addBill, updateBill } = require("../controllers/Bill");
const {
  getTreatmentRecordDetailById,
} = require("../controllers/TreatmentRecordDetail");
//user
router.put("/setUserInfo/:userId", setUserInfo);
router.post("/addUser", addUser);
router.post("/sendEmail", sendEmail);
router.get("/SignIn/:name/:pass", SignIn);
router.get("/checkUserName/:name", checkUserName);
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
//TreatmentRecordDetail
router.get(
  "/TreatmentRecordDetailManagement/getTreatmentRecordDetailById/:cthsdtId",
  getTreatmentRecordDetailById
);

module.exports = router;
