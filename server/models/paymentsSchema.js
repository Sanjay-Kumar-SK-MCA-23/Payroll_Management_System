const mongoose = require("mongoose");

const paymentsSchema = new mongoose.Schema({
  empId: {
    type: String,
    required: [true, "enter emp id"],
  },
  empObjectId: {
    type: String,
    required: [true, "enter emp ObjectId"],
  },
  salary: {
    type: Number,
    required: [true, "enter salary "],
  },
  presentDays: {
    type: Number,
    required: [true, "present Days required"],
  },
  halfDays: {
    type: Number,
    default: 0,
  },
  absentDays: {
    type: Number,
    default: 0,
  },
  WorkingDays: {
    type: Number,
    required: true,
  },
  date: {
    type: String,
    required: [true, "date required"],
  },
  payPeriod: {
    type: String,
    required: [true, "payperiod required"],
  },
});

module.exports = mongoose.model("payment", paymentsSchema);
