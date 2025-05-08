const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Employee = require("../models/employeeSchema");
const asyncHandler = require("express-async-handler");
// const profileStorage = require("../utils/pictureStore");
const { sendEmail } = require("../utils/nodeMailer");
const saltRounds = 10;

//=============================== Route -> api/employeeRegister ==================================
exports.employeeRegister = asyncHandler(async (req, res) => {
  console.log(req.body);
  
  try {
    //============checking mandatory fields with for Loop=========
    const {
      firstName,
      lastName,
      email,
      password,
      role,
      mobileNo,
      jobType,
      address,
      salary,
      joinDate,
      imagePath,
      pinCode,
    } = req.body;

    const mandatoryFields = [
      "firstName",
      "lastName",
      "email",
      "password",
      "role",
      "mobileNo",
      "jobType",
      "salary",
      "address",
      "joinDate",
      "pinCode",
      "imagePath",
    ];
    for (const field of mandatoryFields) {
      if (!req.body[field]) {
        return res.status(400).json({ success: false, message: `${field} is required.` });
      }
    }

    //===========================EMAIL CHECK =====================

    const existingUser = await Employee.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "Email already exists" });
    }

    //=================EMPLOYEE ID GENTRATE=======================
    const lastempId = (await Employee.findOne({}, { empId: 1 }, { sort: { empId: -1 } })) || {
      empId: 1000,
    };
    const empId = Number(lastempId.empId) + 1;
    //===============encrypt password and store data==============
    const hash = await bcrypt.hash(password, saltRounds);
    await Employee.create({
      empId,
      firstName,
      lastName,
      email,
      password: hash,
      role,
      mobileNo,
      jobType,
      salary,
      address,
      image: imagePath,
      joinDate,
      pinCode,
    });
    //===============send employee cedentials to mail=============
    await sendEmail(
      email,
      `🌟 Your Account Credentials 🌟`,
      `
 Dear ${firstName + "" + lastName} ,

Welcome  We're thrilled to have you join our team. Below are your account credentials and essential details:

🔐 **Account Credentials:**
   - **Employee ID:** ${empId}
   - **Email:** ${email}
   - **Password:** ${password}
   - **Job Type:** ${jobType}
   - **Salary:** ${salary} 

Please ensure to keep this information confidential and do not share it with anyone. If you have any questions or need assistance,
don't hesitate to reach out to the HR department.

`
    );
    
    return res.status(200).json({ success: true, message: "Employee registered successfully." });
  } catch (error) {
    console.error("Error during employee registration:", error);
    return res.status(500).json({ success: false, message: `Server Error: ${error.message || error}` });
  }
});

//================================== Route -> api/adminLogin =====================================
exports.adminLogin = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    //============checking mandatory fields with for Loop=========
    const mandatoryFields = ["email", "password"];
    for (const field of mandatoryFields) {
      if (!req.body[field]) {
        return res.status(400).json({ success: false, message: `${field} is required.` });
      }
    }

    //===================EMAIL and ROLE Check ====================
    const existingUser = await Employee.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ success: false, message: `account not found! check email! ` });
    } else if (!existingUser.role || existingUser.role.toLowerCase() !== "admin") {
      return res.status(404).json({ success: false, message: `Not an Admin account. Check your email. ` });
    } else if (!existingUser.isWorking) {
      return res
        .status(404)
        .json({ success: false, message: `Account not active. Please contact the administrator for assistance.` });
    }

    //======================password check========================
    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch) {
      return res.status(403).json({ success: false, message: "Incorrect password!" });
    }
    //==============JWT token genrate and send response===========
    const token = jwt.sign({ user: { _id: existingUser._id, role: existingUser.role } }, process.env.SECRET_KEY);
    return res.status(201).json({ success: true, token, message: "Admin logged successfully!" });
  } catch (error) {
    console.error("Error during admin login:", error);
    return res.status(500).json({ success: false, message: `Server Error: ${error.message || error}` });
  }
});

//=============================== Route -> api/employeeDetails/ ==================================
exports.employeeDetails = asyncHandler(async (req, res) => {
  try {
    // =================Retrieve query parameters=================
    const { jobType, isWorking, startDate, endDate, minSalary, maxSalary, empId } = req.body;

    // Build the filter object based on the provided parameters
    const filter = {  };

    if (jobType) {
      filter.jobType = jobType;
    }

    if (isWorking) {
      filter.isWorking = isWorking;
    }

    if (empId) {
      filter.empId = empId;
    }

    if (startDate && endDate) {
      filter.joinDate = { $gte: startDate, $lte: endDate };
    } else {
      if (startDate) {
        filter.joinDate = { $gte: startDate };
      }

      if (endDate) {
        filter.joinDate = { $lte: endDate };
      }
    }

    if (minSalary && maxSalary) {
      filter.salary = { $gte: parseInt(minSalary), $lte: parseInt(maxSalary) };
    } else {
      if (minSalary) {
        filter.salary = { $gte: minSalary };
      }

      if (maxSalary) {
        filter.salary = { $lte: maxSalary };
      }
    }

    // ==========Find employee data based on the filter===========
    const employeeData = await Employee.find(filter);

    // Check if employee data is found
    if (employeeData.length === 0) {
      return res.status(404).json({ success: false, message: "Employees not found!" });
    }

    // Send the filtered employee data in the response
    return res.status(200).json({ success: true, data:employeeData });
  } catch (error) {
    console.error("Error during employee data fetch:", error);
    return res.status(500).json({ success: false, message: `Server Error: ${error.message || error}` });
  }
});

//==================================== otp email verification ====================================
// Middleware function to handle OTP generation and email sending
exports.otpToMail = asyncHandler(async (req, res) => {
  try {
    // Set up the filter object
    let filter = { email: req.body.email };
   
    console.log(req.body);
    
    

    // Add role filter based on the page
    if (req.body.page === "Admin") {
      filter.role = "Admin";
    } else if (req.body.page === "Employee") {
      filter.role = "Employee";
    }

    // Handle registration page
    if (req.body.page === "Register") {
      // Check if the email already exists in the database
      const existingUser = await Employee.findOne(filter);
      if (existingUser) {
        return res.status(409).json({ success: false, message: "This Email already registered!" });
      }
    } else {
      // For login pages (Admin or Employee), ensure email exists in the database
      const existingUser = await Employee.findOne(filter);
      if (!existingUser) {
        return res.status(409).json({ success: false, message: "Email not found!" });
      }
    }

    const generateOTP = () => Math.floor(100000 + Math.random() * 900000);
    // Generate OTP
    const otp = generateOTP();

    // Send email with OTP
    const mail = await sendEmail(req.body.email, "PAYROLL APPLICATION VERIFY", `DON'T SHARE THIS OTP: ${otp}`);

    // Respond with success message and OTP
    res.status(201).json({
      success: true,
      otp,
      message: "Successfully OTP sent to email",
    });
  } catch (error) {
    console.error(error);

    // Handle errors
    let errorMessage = "Something went wrong while processing the request.";
    if (error.response && error.response.statusCode) {
      errorMessage = `Error sending email: ${error.response.statusCode}`;
    }
    res.status(500).json({ success: false, message: errorMessage });
  }
});

//================================ Route -> api/reportGenrate ====================================
exports.reportGenrate = asyncHandler(async (req, res) => {
  try {
    // =================Retrieve query parameters=================
    const { jobType, isWorking, startDate, endDate, minSalary, maxSalary, empId } = req.body;

    // Build the filter object based on the provided parameters
    const filter = {};

    if (jobType) {
      filter.jobType = jobType;
    }

    if (isWorking) {
      filter.isWorking = isWorking;
    }

    if (empId) {
      filter.empId = empId;
    }

    if (startDate && endDate) {
      filter.joinDate = { $gte: startDate, $lte: endDate };
    } else {
      if (startDate) {
        filter.joinDate = { $gte: startDate };
      }

      if (endDate) {
        filter.joinDate = { $lte: endDate };
      }
    }

    if (minSalary && maxSalary) {
      console.log(maxSalary ,minSalary)
      filter.salary = { $gte: parseInt(minSalary), $lte: parseInt(maxSalary) }
      console.log(filter.salary, "hggggvgvg");
    } else {
      if (minSalary) {
        filter.salary = { $gte: minSalary };
      }

      if (maxSalary) {
        filter.salary = { $lte: maxSalary };
      }
    }

    // ==========Find employee data based on the filter===========
    const employeeData = await Employee.find(filter);

    // Check if employee data is found
    if (employeeData.length === 0) {
      return res.status(404).json({ success: false, message: "Employees not found!" });
    }

    // Send the filtered employee data in the response
    return res.status(200).json({ success: true, data:employeeData });
  } catch (error) {
    console.error("Error during employee data fetch:", error);
    return res.status(500).json({ success: false, message: `Server Error: ${error.message || error}` });
  }
});