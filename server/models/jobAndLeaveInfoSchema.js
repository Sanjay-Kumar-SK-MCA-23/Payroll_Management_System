const mongoose = require("mongoose");

//=======================job Schema=======================
const jobSchema = new mongoose.Schema({
  jobId: {
    type: String,
    required: [true, "Please enter job ID"],
  },
  jobTitle: {
    type: String,
    required: [true, "enter job title"],
  },
  salary: {
    type: Number,
    required: true,
  },
});

// Exporting the JobDetail model
const JobDetail = mongoose.model("JobDetail", jobSchema);

//=====================Leave info Schema==================
const LeaveInfoSchema = new mongoose.Schema({
  lInfoId: {
    type: String,
    required: [true, "Please enter LInfo ID"],
  },
  leaveTitle: {
    type: String,
    required: [true, "enter leave title"],
    
  },
});

// Exporting the LeaveInfoDetail model
const LeaveInfoDetail = mongoose.model("LeaveInfoDetail", LeaveInfoSchema);

module.exports = {
  JobDetail,
  LeaveInfoDetail,
};
