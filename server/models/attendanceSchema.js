const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  empId: {
    type: String,
    required: [true, "Enter employee id"],
  },
  empObjectId: {
    type: String,
    required: [true, "enter emp ObjectId"],
  },
  date: {
    type: String,
    required: [true, "Enter date"],
  },
  totalHours: {
    type: Number
    
  },
  status: {
    type: String,
    enum: ["Present", "Absent", "Half-Day"],
    required: [true, " status filed required "],
  },
  checkInTime: {
    type: String,
    required: [true, " check In time required "],
  },
  checkOutTime: {
    type: String,
  },
});

module.exports = mongoose.model("Attendance", attendanceSchema);
