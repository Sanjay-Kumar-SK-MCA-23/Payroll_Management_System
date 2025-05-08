const { DateSpliter, TimeSpliter, calculateDurationInHours } = require("../utils/dateTimeFetch&Calculator");
const Attendance = require("../models/attendanceSchema");
const asyncHandler = require("express-async-handler");
const Employee = require("../models/employeeSchema");

//==================================== Route -> api/checkIn ======================================
exports.checkIn = asyncHandler(async (req, res) => {
  try {
    //===========================EMAIL CHECK =====================
    const { _id } = req.user;

    const existingUser = await Employee.findById(_id);
    if (!existingUser) {
      return res.status(409).json({ success: false, message: "Something went wrong, please login again!" });
    }

    //================== find already checked in =================
    const existingAttendance = await Attendance.findOne({ empId: existingUser.empId }).sort({ empId: -1 }).limit(1);

    if (existingAttendance && existingAttendance.date === (await DateSpliter())) {
      return res
        .status(409)
        .json({ success: false, message: `You already checked in today at ${existingAttendance.checkInTime}!` });
    }
    //========================= store data========================

    await Attendance.create({
      empObjectId: existingUser._id,
      empId: existingUser.empId,
      status: "Present",
      date: await DateSpliter(),
      checkInTime: await TimeSpliter(),
    });

    return res.status(200).json({ success: true, message: "Employee check-in was successful! " });
  } catch (error) {
    console.error("Error during employee attendance adding:", error);
    return res.status(500).json({ success: false, message: `Server Error: ${error.message || error}` });
  }
});

//==================================== Route -> api/checkOut =====================================
exports.checkOut = asyncHandler(async (req, res) => {
  try {
    //===========================EMAIL CHECK =====================
    const { _id } = req.user;

    const existingUser = await Employee.findById(_id);
    if (!existingUser) {
      return res.status(409).json({ success: false, message: "Something went wrong, please login again!" });
    }
    //================== find checked in && out  =================
    const existingAttendance = await Attendance.findOne({ empId: existingUser.empId }).sort({ _id: -1 }).limit(1);

    if (existingAttendance && existingAttendance.date !== (await DateSpliter())) {
      return res.status(409).json({ success: false, message: `You are not checked in today!` });
    } else if (existingAttendance.checkOutTime) {
      return res
        .status(409)
        .json({ success: false, message: `You already checked out today at ${existingAttendance.checkOutTime}!` });
    }
    //============= calculate present/off-day/absent  ============
    const checkInTime = existingAttendance.checkInTime;
    const checkOutTime = await TimeSpliter();
    const durationInHours = await calculateDurationInHours(checkInTime, checkOutTime);

    let status = "";

    // Determine status based on the duration
    if (durationInHours >= 8) {
      status = "Present";
    } else if (durationInHours >= 3 && durationInHours < 8) {
      status = "Half-Day";
    } else if (durationInHours < 3) {
      status = "Absent";
    }

    //========================= store data========================

    await Attendance.findOneAndUpdate(
      { empId: existingAttendance.empId, _id: existingAttendance._id },
      {
        status,
        checkOutTime,
        totalHours: durationInHours,
      }
    );

    return res.status(200).json({ success: true, message: "Employee check-out was successful! " });
  } catch (error) {
    console.error("Error during employee attendance checkout:", error);
    return res.status(500).json({ success: false, message: `Server Error: ${error.message || error}` });
  }
});

//============================== Route -> api/attendanceDetails ==================================
exports.attendanceDetails = asyncHandler(async (req, res) => {
  try {
    //================= Retrieve query parameters=================
    const { status, startDate, endDate, empId, empObjectId } = req.body;
    // Build the filter object based on the provided parameters
    const filter = {};
    if (status) {
      filter.status = status;
    }
    if (empObjectId) {
      filter.empObjectId = empObjectId;
    }
    if (startDate && endDate) {
      filter.date = { $gte: startDate, $lte: endDate };
    } else {
      if (startDate) {
        filter.date = { $gte: startDate };
      }
      if (endDate) {
        filter.date = { $lte: endDate };
      }
    }
    if (empId) {
      filter.empId = empId;
    }

    // ==========Find attendance data based on the filter=========
    const attendanceData = await Attendance.find(filter);

    // Check if attendance data is found
    if (attendanceData.length === 0) {
      return res.status(404).json({ success: false, message: "Attendance not found!" });
    }

    // Send the filtered attendance data in the response
    return res.status(200).json({ success: true, data: attendanceData });
  } catch (error) {
    console.error("Error during attendance data fetch:", error);
    return res.status(500).json({ success: false, message: `Server Error: ${error.message || error}` });
  }
});

//============================== Route -> api/getAttendanceDetail/:id ============================
exports.getAttendanceDetail = asyncHandler(async (req, res) => {
  try {
    const { id, filter } = req.params;

    const existingUser = await Employee.findById(id);
    if (!existingUser) {
      return res.status(409).json({ success: false, message: "Something went wrong, please login again!" });
    }

    // ==========Find attendance data based on the filter=========
    const attendanceFilter = { empObjectId: { $in: id } };
    if (filter) {
      attendanceFilter.date = await DateSpliter();
    }
    const attendanceData = await Attendance.find(attendanceFilter);

    // Check if attendance data is found
    if (attendanceData.length === 0) {
      return res.status(404).json({ success: false, message: "Attendance not found!" });
    }

    // Send the filtered attendance data in the response
    return res.status(200).json({ success: true, data: attendanceData });
  } catch (error) {
    console.error("Error during attendance data fetch:", error);
    return res.status(500).json({ success: false, message: `Server Error: ${error.message || error}` });
  }
});
