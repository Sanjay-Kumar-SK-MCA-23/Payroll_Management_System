const Employee = require("../models/employeeSchema");
const { JobDetail,LeaveInfoDetail } = require("../models/jobAndLeaveInfoSchema");
const asyncHandler = require("express-async-handler");

//JOB CONTROLLER
//================================== Route -> api/createJob ======================================
exports.createJob = asyncHandler(async (req, res) => {
  try {
    const { jobTitle, salary } = req.body;

    //============checking mandatory fields with for Loop=========
    const mandatoryFields = ["jobTitle", "salary"];
    for (const field of mandatoryFields) {
      if (!req.body[field]) {
        return res.status(400).json({ success: false, message: `${field} is required.` });
      }
    }
    //===========================TITLE CHECK =====================

    const existingTitle = await JobDetail.findOne({ jobTitle });
    if (existingTitle) {
      return res.status(409).json({ success: false, message: "Job already exists" });
    }
    //======================JOB ID GENTRATE=======================
    const lastJobId = (await JobDetail.findOne({}, { jobId: 1 }, { sort: { jobId: -1 } })) || {
      jobId: 1000,
    };
    const jobId = Number(lastJobId.jobId) + 1;
    //=========================store data=========================

    await JobDetail.create({ jobTitle, salary, jobId });

    return res.status(200).json({ success: true, message: "job created successfully." });
  } catch (error) {
    console.error("Error during job creation:", error);
    return res.status(500).json({ success: false, message: `Server Error: ${error.message || error}` });
  }
});

//=============================== Route -> api/getJobDetail/:id ==================================
exports.getJobDetail = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    //================find job data in collection ================

    const jobDetail = await JobDetail.findById(id);
    if (!jobDetail) {
      return res.status(404).json({ success: false, message: "selected job not found!" });
    }
    //=========================if found send response=============

    return res.status(200).json({ success: true, data:jobDetail });
  } catch (error) {
    console.error("Error during job creation:", error);
    return res.status(500).json({ success: false, message: `Server Error: ${error.message || error}` });
  }
});

//=============================== Route -> api/getJobDetail =====================================
exports.getjobDetails = asyncHandler(async (req, res) => {
  try {
    //================find job data in collection ================

    const jobDetails = await JobDetail.find();
    if (!jobDetails) {
      return res.status(404).json({ success: false, message: " job details not found!" });
    }
    //=========================if found send response=============
    return res.status(200).json({ success: true, data:jobDetails });
  } catch (error) {
    console.error("Error during geting job Details :", error);
    return res.status(500).json({ success: false, message: `Server Error: ${error.message || error}` });
  }
});

//=============================== Route -> api/deleteJobDetail/:id ===============================
exports.deleteJobDetail = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const jobDetail = await JobDetail.findById(id);

    if (!jobDetail) {
      return res.status(404).json({ success: false, message: "Selected job not found!" });
    }

    const employeeData = await Employee.find({ jobType: { $eq: jobDetail.jobTitle } });

    if (employeeData.length > 0) {
      return res.status(404).json({
        success: false,
        message: "Some users are associated with this job. Check before deleting.",
        employeeData,
      });
    }

    await jobDetail.deleteOne();

    return res.status(200).json({ success: true, message: `${jobDetail.jobTitle} job detail was deleted!` });
  } catch (error) {
    console.error("Error during job deletion:", error);
    return res.status(500).json({ success: false, message: `Server Error: ${error.message || error}` });
  }
});

//LEAVEINFO CONTROLLER

//================================== Route -> api/createLeaveInfo ======================================
exports.createLeaveInfo = asyncHandler(async (req, res) => {
  try {
    const { leaveTitle } = req.body;

    //============checking mandatory fields with for Loop=========
    const mandatoryFields = ["leaveTitle"];
    for (const field of mandatoryFields) {
      if (!req.body[field]) {
        return res.status(400).json({ success: false, message: `${field} is required.` });
      }
    }
    //===========================TITLE CHECK =====================

    const existingTitle = await LeaveInfoDetail.findOne({ leaveTitle });
    if (existingTitle) {
      return res.status(409).json({ success: false, message: "Leave Title already exists" });
    }
    //=================LEAVEINFO ID GENTRATE======================
    const lastlInfoId = (await LeaveInfoDetail.findOne({}, { lInfoId: 1 }, { sort: { lInfoId: -1 } })) || {
      lInfoId: 1000,
    };
    const lInfoId = Number(lastlInfoId.lInfoId) + 1;
    //=========================store data=========================

    await LeaveInfoDetail.create({ leaveTitle, lInfoId });

    return res.status(200).json({ success: true, message: "LeaveInfo created successfully." });
  } catch (error) {
    console.error("Error during LeaveInfo creation:", error);
    return res.status(500).json({ success: false, message: `Server Error: ${error.message || error}` });
  }
});

//=============================== Route -> api/getLeaveInfoDetail/:id ==================================
exports.getLeaveInfoDetail = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    //================find LeaveInfo data in collection ================

    const getLeaveInfoDetail = await LeaveInfoDetail.findById(id);
    if (!getLeaveInfoDetail) {
      return res.status(404).json({ success: false, message: "selected LeaveInfo not found!" });
    }
    //=========================if found send response=============

    return res.status(200).json({ success: true, data:getLeaveInfoDetail });
  } catch (error) {
    console.error("Error during LeaveInfo creation:", error);
    return res.status(500).json({ success: false, message: `Server Error: ${error.message || error}` });
  }
});

//=============================== Route -> api/getLeaveInfoDetails =====================================
exports.getLeaveInfoDetails = asyncHandler(async (req, res) => {
  try {
    //================find LeaveInfo data in collection ================

    const getLeaveInfoDetails = await LeaveInfoDetail.find();
    if (!getLeaveInfoDetails.length > 0) {
      return res.status(404).json({ success: false, message: " LeaveInfo details not found!" });
    }
    //=========================if found send response=============
    return res.status(200).json({ success: true, data:getLeaveInfoDetails });
  } catch (error) {
    console.error("Error during geting LeaveInfo Details :", error);
    return res.status(500).json({ success: false, message: `Server Error: ${error.message || error}` });
  }
});

//=============================== Route -> api/deleteLeaveInfoDetail/:id ===============================
exports.deleteLeaveInfoDetail = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const getLeaveInfoDetail = await LeaveInfoDetail.findById(id);

    if (!getLeaveInfoDetail) {
      return res.status(404).json({ success: false, message: "Selected LeaveInfo not found!" });
    }

    const employeeData = await Employee.find({ LeaveInfoType: { $eq: LeaveInfoDetail.LeaveInfoTitle } });

    if (employeeData.length > 0) {
      return res.status(404).json({
        success: false,
        message: "Some users are associated with this LeaveInfo. Check before deleting.",
        employeeData,
      });
    }

    await getLeaveInfoDetail.deleteOne();

    return res
      .status(200)
      .json({ success: true, message: `${getLeaveInfoDetail.LeaveInfoTitle} LeaveInfo detail was deleted!` });
  } catch (error) {
    console.error("Error during LeaveInfo deletion:", error);
    return res.status(500).json({ success: false, message: `Server Error: ${error.message || error}` });
  }
});
