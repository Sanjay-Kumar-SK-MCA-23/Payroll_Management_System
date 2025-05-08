const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  empId: {
    type: String,
    required: [true, "Please enter employee ID"],
  },
  firstName: {
    type: String,
    trim: true,
    required: [true, "Please enter employee first name"],
    maxLength: [100, "Name cannot exceed 100 characters"],
  },
  lastName: {
    type: String,
    required: [true, "Please enter employee last name"],
    trim: true,
    maxLength: [100, "Name cannot exceed 100 characters"],
  },
  email: {
    type: String,
    required: [true, "Please enter employee email"],
    unique: true,
    lowercase: true,
    validate: [isEmailValid, "Please enter a valid email address"],
  },
  password: {
    type: String,
    required: [true, "Please enter employee password"],
  },
  image: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: [true, "Please enter adresss"],
    trim: true,
    maxLength: [150, "address cannot exceed 100 characters"],
  },
  mobileNo: {
    type: String,
    required: [true, "Please enter the employee's mobile number"],
    validate: [isMobileNoValid, "Please enter a valid mobile number"],
  },
  role: {
    type: String,

    enum: {
      values: ["Admin", "Employee"],
      message: "Please select the correct category",
    },
    default: "Employee",
  },
  jobType: {
    type: String,
    required: [true, "please enter job type"],
  },
  salary: {
    type: Number,
    required: [true, "enter salary "],
  },
  isWorking: {
    type: Boolean,
    default: true,
  },
  joinDate: {
    type: String,
    default: Date.now(),
  },
  terminationDate: {
    type: Date,
    default: null,
  },
  pinCode: {
    type: Number,
    required:true
  },
});

// Custom Validation Functions
function isEmailValid(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Basic mobile number format validation (allowing only digits)
function isMobileNoValid(mobileNo) {
  const mobileNoRegex = /^\d+$/;
  return mobileNoRegex.test(mobileNo);
}

module.exports = mongoose.model("Employee", employeeSchema);
