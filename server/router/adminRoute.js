const {
  employeeRegister,
  adminLogin,
  employeeDetails,
  otpToMail,
  reportGenrate,
} = require("../controllers/adminController");
const { attendanceDetails } = require("../controllers/attendanceController");
const {
  createJob,
  getJobDetail,
  getjobDetails,
  deleteJobDetail,
  getLeaveInfoDetails,
  createLeaveInfo,
  deleteLeaveInfoDetail,
  getLeaveInfoDetail,
} = require("../controllers/jobAndLeaveInfoController");
const { updateLeaveRequest, viewLeaveDetails, LeaveDetailsToEdit } = require("../controllers/leaveController");
const {
  calculateSalary,
  salaryDetails,
  salaryDetailById,
  SalaryDetailLastMonth,
  sentPaySlips,
  createPayment,
  getAttendanceByEmpId,
  addAttendanceRecords,
} = require("../controllers/paymentsController");
const { tokenVerify, roleVerify } = require("../middleware/userVerify");
const uploadImage = require("../utils/pictureStore");
const Route = require("express").Router();

//=========================ADMIN ROUTES ==========================
Route.route("/AdminRegister").post(uploadImage, employeeRegister); //this route for add admin first time using postman

Route.route("/adminLogin").post(adminLogin);
Route.route("/employeeRegister").post(tokenVerify, roleVerify("Admin"), uploadImage, employeeRegister);
Route.route("/employeeDetails").post(tokenVerify, roleVerify("Admin"),employeeDetails);

//=========job Schema routes=========
Route.route("/createJob").post(createJob);
Route.route("/deleteJobDetail/:id").delete(tokenVerify, roleVerify("Admin"), deleteJobDetail);
Route.route("/getJobDetail/:id").get(tokenVerify, roleVerify("Admin"), getJobDetail);
Route.route("/getJobDetails").get(tokenVerify, roleVerify("Admin"), getjobDetails);

//=========leaveInfo Schema routes=========
Route.route("/createLeaveInfo").post(tokenVerify, roleVerify("Admin"), createLeaveInfo);
Route.route("/deleteLeaveInfoDetail/:id").delete(tokenVerify, roleVerify("Admin"), deleteLeaveInfoDetail);
Route.route("/getLeaveInfoDetail/:id").get(tokenVerify, roleVerify("Admin"), getLeaveInfoDetail);
Route.route("/getLeaveInfoDetails").get(tokenVerify, roleVerify(["Employee", "Admin"]), getLeaveInfoDetails);

//=========attendance Routes=========
Route.route("/attendanceDetails").post(tokenVerify, roleVerify(["Employee", "Admin"]), attendanceDetails);
//now
Route.get("/getAttendanceByEmpId",getAttendanceByEmpId);
Route.post("/addAttendanceRecords",addAttendanceRecords);


//===========leave Routes============
Route.route("/updateLeaveRequest/:id/:status").put(tokenVerify, roleVerify("Admin"), updateLeaveRequest);
Route.route("/viewLeaveDetails").post(tokenVerify, roleVerify(["Employee", "Admin"]), viewLeaveDetails);
Route.route("/LeaveDetailsToEdit").get(tokenVerify, roleVerify("Admin"), LeaveDetailsToEdit);

//==========payments Routes==========
Route.post("/payments",createPayment);//now
Route.route("/calculateSalary/:workingDays").get(tokenVerify, roleVerify("Admin"), calculateSalary);
Route.route("/SalaryDetails").post(tokenVerify, roleVerify(["Employee", "Admin"]), salaryDetails);
Route.route("/SalaryDetailLastMonth").get(tokenVerify, roleVerify("Admin"), SalaryDetailLastMonth);
Route.route("/SalaryDetail/:id").get(tokenVerify, roleVerify(["Employee", "Admin"]), salaryDetailById);
Route.route("/SentPaySlips").post(tokenVerify, roleVerify("Admin"), sentPaySlips);

//========Report Routes ============
Route.route("/reportGenrate").post(reportGenrate);

//===========nodemailer Routes=======
Route.route("/otp").post(otpToMail);

module.exports = Route;
