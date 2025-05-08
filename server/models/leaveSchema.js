const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema({
  empId: {
    type: String,
    required: [true, "Enter employee id"],
  },
  empObjectId: {
    type: String,
    required: [true, "Enter employee empObject id"],
  },
  reason: {
    type: String,
    required: [true, "Reason field required"],
  },
  startDate: {
    type: String,
    required: [true, "Start date required"],
  },
  status: {
    type: String,
    enum: ["Approved", "Pending", "Rejected"],
    default: "Pending",
  },
  endDate: {
    type: String,
    required: [true, "End date required"],
  },

  isFullDay: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("Leave", leaveSchema);
