const { checkIn, checkOut, getAttendanceDetail } = require("../controllers/attendanceController");
const { employeeLogin, getEmployeeDetail, updateEmployeeDetail } = require("../controllers/employeeController");
const { createLeaveRequest, cancelLeaveRequest } = require("../controllers/leaveController");
const { sentPaySlipEmp } = require("../controllers/paymentsController");
const { tokenVerify, roleVerify } = require("../middleware/userVerify");
const uploadImage = require("../utils/pictureStore");
const Route = require("express").Router();

//=======EMPLOYEE ROUTES ==========
Route.route("/employeeLogin").post(employeeLogin);
Route.route("/getEmployeeDetail/:id").get(tokenVerify, roleVerify(["Employee", "Admin"]), getEmployeeDetail);
Route.route("/updateEmployeeDetail/:id").put(
  tokenVerify,
  roleVerify(["Employee", "Admin"]),
  uploadImage,
  updateEmployeeDetail
);
Route.route("/updateEmployee/:id").put(
  tokenVerify,
  roleVerify(["Employee", "Admin"]),
  updateEmployeeDetail
);

//=======ATTENDANCE ROUTES=========
Route.route("/checkIn").post(tokenVerify, roleVerify(["Employee", "Admin"]), checkIn);
Route.route("/checkOut").put(tokenVerify, roleVerify(["Employee", "Admin"]), checkOut);
Route.route("/getAttendanceDetail/:id/:filter?").get(
  tokenVerify,
  roleVerify(["Employee", "Admin"]),
  getAttendanceDetail
);

//=========LEAVE ROUTES============
Route.route("/createLeaveRequest").post(tokenVerify, roleVerify("Employee"), createLeaveRequest);
Route.route("/cancelLeaveRequest/:id").delete(tokenVerify, roleVerify("Employee"), cancelLeaveRequest);

//=========PAYMENT ROUTES============
Route.route("/sentPaySlipEmp").post(tokenVerify, roleVerify("Employee"), sentPaySlipEmp);



module.exports = Route;
