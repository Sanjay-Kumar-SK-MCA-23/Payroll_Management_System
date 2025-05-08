const Leave = require("../models/leaveSchema");
const Employee = require("../models/employeeSchema");
const asyncHandler = require("express-async-handler");
const { DateSpliter } = require("../utils/dateTimeFetch&Calculator");

//=============================== Route -> api/createLeaveRequest ================================
exports.createLeaveRequest = asyncHandler(async (req, res) => {
  try {
    const { _id } = req.user;

    const { reason, startDate, endDate, isFullDay } = req.body;

    //============checking mandatory fields with for Loop=========
    const mandatoryFields = ["reason", "startDate", "endDate", "isFullDay"];
    for (const field of mandatoryFields) {
      if (!req.body[field]) {
        return res.status(400).json({ success: false, message: `${field} is required.` });
      }
    }

    //===========================EMAIL CHECK =====================
    const existingUser = await Employee.findById(_id);
    if (!existingUser) {
      return res.status(409).json({ success: false, message: "Something went wrong, please login again!" });
    }

    //============== Check if leave already applied ==============
    const existingLeave = await Leave.findOne({
      empId: existingUser.empId,
      empObjectId: _id,
      status: { $in: ["Pending", "Approved"] },
      $and: [{ startDate: { $lte: req.body.endDate } }, { endDate: { $gte: req.body.startDate } }],
    });

    if (existingLeave) {
      return res
        .status(409)
        .json({ success: false, message: "You already have a pending or approved leave request for this period!" });
    }
    //== Check if start and end are equal or greater than today ==
    const today = Date.now();
    const sDate = new Date(startDate);
    const eDate = new Date(endDate);

    if (sDate < today || eDate < today) {
      return res
        .status(409)
        .json({ success: false, message: "Start and end dates should be equal to or greater than today's date!" });
    }
    //========================= store data========================
    await Leave.create({
      empId: existingUser.empId,
      empObjectId: _id,
      reason,
      startDate,
      endDate,
      isFullDay,
    });

    return res.status(200).json({ success: true, message: "Leave request created successfully!" });
  } catch (error) {
    console.error("Error during employee Leave adding:", error);
    return res.status(500).json({ success: false, message: `Server Error: ${error.message || error}` });
  }
});

//============================= Route -> api/cancelLeaveRequest/:id ==============================
exports.cancelLeaveRequest = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const { _id } = req.user;

    //=========Find leave data based on ID and employee ID========
    const leaveData = await Leave.findOne({ _id: id, empObjectId: _id });

    //================Check if leave request exists===============
    if (!leaveData) {
      return res.status(404).json({ success: false, message: "Leave request not found. Refresh the page!" });
    }

    // ==================Delete the leave request=================
    await leaveData.deleteOne();

    return res.status(200).json({ success: true, message: "Leave request deleted" });
  } catch (error) {
    console.error("Error during leave deletion:", error);
    return res.status(500).json({ success: false, message: "Server Error: Unable to delete leave request." });
  }
});

//========================= Route -> api/updateLeaveRequest/:id/:status ==========================
exports.updateLeaveRequest = asyncHandler(async (req, res) => {
  try {
    const { id, status } = req.params;

    //=================Find leave data based on ID================
    const leaveData = await Leave.findById(id);

    //================Check if leave request exists===============
    if (!leaveData) {
      return res.status(404).json({ success: false, message: "Leave request not found. Refresh the page!" });
    }

    //==================update the leave request==================
    await leaveData.updateOne({ status });

    return res.status(200).json({ success: true, message: "leave request updated!" });
  } catch (error) {
    console.error("Error during leave update:", error);
    return res.status(500).json({ success: false, message: "Server Error: Unable to update leave request." });
  }
});

//============================== Route -> api/viewLeaveDetails ===================================
exports.viewLeaveDetails = asyncHandler(async (req, res) => {
  try {
    //================= Retrieve query parameters=================
    const { status, startDate, endDate, empId, isFullDay, reason, empObjectId } = req.body;
    // Build the filter object based on the provided parameters
    const filter = {};
    if (status) {
      filter.status = status;
    }
    if (empObjectId) {
      filter.empObjectId = empObjectId;
    }
    if (reason) {
      filter.reason = reason;
    }
    if (startDate) {
      filter.startDate = startDate;
    }
    if (endDate) {
      filter.endDate = endDate;
    }
    if (empId) {
      filter.empId = empId;
    }
    if (isFullDay) {
      filter.isFullDay = isFullDay;
    }

    // ==========Find Leave data based on the filter=========

    const LeaveData = await Leave.find(filter);

    // Check if Leave data is found
    if (LeaveData.length === 0) {
      return res.status(404).json({ success: false, message: "Leave Requests not found!" });
    }

    // Send the filtered Leave data in the response
    return res.status(200).json({ success: true, data:LeaveData });
  } catch (error) {
    console.error("Error during Leave data fetch:", error);
    return res.status(500).json({ success: false, message: `Server Error: ${error.message || error}` });
  }
});

//============================== Route -> api/LeaveDetailsToEdit =================================
exports.LeaveDetailsToEdit = asyncHandler(async (req, res) => {
  try {
    let currentDate = await DateSpliter();
    if (!currentDate) {
      return res.status(404).json({ success: false, message: "server Error please Contact support team!" });
    }
    // ==========Find Leave data based on the filter=========
    const LeaveData = await Leave.find({
      $or: [{ startDate: { $gte: currentDate } }, { endDate: { $gte: currentDate } }],
    });
    // Check if Leave data is found
    if (LeaveData.length === 0) {
      return res.status(404).json({ success: false, message: "Leave Requests not found!" });
    }

    // Send the filtered Leave data in the response
    return res.status(200).json({ success: true, data:LeaveData });
  } catch (error) {
    console.error("Error during Leave data fetch:", error);
    return res.status(500).json({ success: false, message: `Server Error: ${error.message || error}` });
  }
});
