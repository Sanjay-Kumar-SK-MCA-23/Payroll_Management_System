const { DateSpliter, YearAndMonthSpliter } = require("../utils/dateTimeFetch&Calculator");
const asyncHandler = require("express-async-handler");
const Attendance = require("../models/attendanceSchema");
const Employee = require("../models/employeeSchema");
const Payment = require("../models/paymentsSchema");
const { generatePayslip } = require("../utils/pdfGenrater");
const { sendEmail } = require("../utils/nodeMailer");

//================================ Route -> api/calculateSalary/:workingDays =====================
exports.calculateSalary = asyncHandler(async (req, res) => {
  try {
    // Function to get the name of the month based on its index
    function getMonthName(monthIndex) {
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      return months[monthIndex];
    }
    //=================== Find Attendance details ================
    // Function to convert "DD-MM-YYYY" to "YYYYMMDD" for string-based comparison
    function formatDateForComparison(dateStr) {
      const [day, month, year] = dateStr.split("-");
      return `${year}${month}${day}`; // Format: "YYYYMMDD"
    }

    // Get current date from DateSpliter
    const currentDateStr = await DateSpliter();

    // Convert "DD-MM-YYYY" to "YYYY-MM-DD" (ISO format)
    function convertToISODate(dateStr) {
      const [day, month, year] = dateStr.split("-");
      return `${year}-${month}-${day}`;
    }
    const isoDateStr = convertToISODate(currentDateStr);
    const currentDate = new Date(isoDateStr);

    // Calculate first and last day of the previous month
    const previousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    const lastDayOfPreviousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);

    // Convert dates to "DD-MM-YYYY" format
    const firstDayOfMonth = `01-${("0" + (previousMonth.getMonth() + 1)).slice(-2)}-${previousMonth.getFullYear()}`;
    const lastDayOfMonth = `${("0" + lastDayOfPreviousMonth.getDate()).slice(-2)}-${("0" + (lastDayOfPreviousMonth.getMonth() + 1)).slice(-2)}-${lastDayOfPreviousMonth.getFullYear()}`;

    // Convert dates to "YYYYMMDD" format for MongoDB filtering
    const firstDayComparable = formatDateForComparison(firstDayOfMonth);
    const lastDayComparable = formatDateForComparison(lastDayOfMonth);

    // Generate Pay Period (e.g., "Feb 1, 2025 - Feb 28, 2025")
    const payPeriod = `${getMonthName(previousMonth.getMonth())} ${previousMonth.getDate()}, ${previousMonth.getFullYear()} - ${getMonthName(lastDayOfPreviousMonth.getMonth())} ${lastDayOfPreviousMonth.getDate()}, ${lastDayOfPreviousMonth.getFullYear()}`;

    console.log("First Day of Month:", firstDayOfMonth);
    console.log("Last Day of Month:", lastDayOfMonth);
    console.log("Comparable First Date:", firstDayComparable);
    console.log("Comparable Last Date:", lastDayComparable);

    // MongoDB Query using Aggregation to filter attendance records
    const attendanceDetails = await Attendance.aggregate([
      {
        $addFields: {
          dateComparable: {
            $concat: [
              { $substr: ["$date", 6, 4] }, // Year
              { $substr: ["$date", 3, 2] }, // Month
              { $substr: ["$date", 0, 2] }  // Day
            ]
          }
        }
      },
      {
        $match: {
          dateComparable: { $gte: firstDayComparable, $lte: lastDayComparable }
        }
      }
    ]);

    // console.log("Fetched Attendance Records:", attendanceDetails);

    if (!attendanceDetails || attendanceDetails.length === 0) {
      return res.status(409).json({ success: false, message: `Attendance data not found!` });
    }
    //==================== Get total working days ================
    const workingDays = req.params.workingDays || 20;

    //====================== Calculate Salary ====================
    let salaryDetails = [];

    // Loop through all attendance details
    for (const attendance of attendanceDetails) {
      const empId = attendance.empId;

      // Calculate total present and half-day counts for each employee
      let totalPresentDays = 0;
      let totalHalfDays = 0;

      for (const att of attendanceDetails) {
        if (att.empId === empId) {
          if (att.status === "Present") {
            totalPresentDays++;
          } else if (att.status === "Half-Day") {
            totalHalfDays++;
          }
        }
      }

      // Calculate total absent days for each employee
      const totalAbsentDays = workingDays - totalPresentDays - totalHalfDays;

      // Check if payment details already exist for the employee and date combination
      const existingPayment = salaryDetails.find(
        (payment) => payment.empId === empId && payment.date === currentDateStr
      );

      if (!existingPayment) {
        // If payment details do not exist, create a new entry
        const newPayment = {
          empId,
          salary: 0,
          totalHours: attendance.totalHours, // Adding totalHours field
          presentDays: totalPresentDays,
          halfDays: totalHalfDays,
          absentDays: totalAbsentDays,
          date: currentDateStr,
          empObjectId: attendance.empObjectId,
          WorkingDays: workingDays,
          payPeriod,
        };
        salaryDetails.push(newPayment);
      } else {
        // If payment details exist, update the present, half-day, and absent days
        existingPayment.presentDays = totalPresentDays;
        existingPayment.halfDays = totalHalfDays;
        existingPayment.absentDays = totalAbsentDays;
      }
    }

    //==================== Get employee salaries =================
    for (const salaryDetail of salaryDetails) {
      const employee = await Employee.findById(salaryDetail.empObjectId);

      if (employee) {
        const regularDaySalary = employee.salary / workingDays; // Regular daily salary
        const halfDaySalary = regularDaySalary / 2; // Half-day salary
        const hourlyRate = employee.salary / workingDays / 8; // Hourly rate based on 8-hour workday

        // Calculate salary for total present days
        let totalSalary = salaryDetail.presentDays * regularDaySalary;

        // Calculate salary for half-days
        totalSalary += salaryDetail.halfDays * halfDaySalary;

        // Calculate overtime salary if applicable
        if (salaryDetail.totalHours > 8) {
          const overtimeHours = salaryDetail.totalHours - 8; // Calculate overtime hours
          const overtimeRate = 1.5 * hourlyRate; // Overtime rate is 1.5 times regular rate
          const overtimeSalary = overtimeHours * overtimeRate; // Calculate overtime salary
          totalSalary += overtimeSalary; // Add overtime salary to total salary
        }

        // Update the salary field in salaryDetail
        salaryDetail.salary = Math.floor(totalSalary);
      }
    }

    // ================= Remove existing payments ================
    const existingPayments = await Payment.find({
      empId: { $in: salaryDetails.map((detail) => detail.empId) },
      date: currentDateStr,
    });
    for (const existingPayment of existingPayments) {
      const index = salaryDetails.findIndex(
        (detail) => detail.empId === existingPayment.empId && detail.date === currentDateStr
      );
      if (index !== -1) {
        salaryDetails.splice(index, 1);
      }
    }

    //================ Save payments and response ================
    const payments = await Payment.create(salaryDetails);
    if (payments.length === 0) {
      // Check if payments are empty
      return res.status(409).json({ success: false, message: `Salary already calculated for this month!` });
    }
    return res.status(200).json({ success: true, data: payments, message: `Salary calculated successfully!` });
  } catch (error) {
    console.error("Error during fetching employee payments :", error);
    return res.status(500).json({ success: false, message: `Server Error: ${error.message || error}` });
  }
});

//====================================== Route -> api/SalaryDetails ==============================
exports.salaryDetails = asyncHandler(async (req, res) => {
  try {
    //================= Retrieve query parameters=================
    const { date, minSalary, maxSalary, empId, empObjectId } = req.body;
    // Build the filter object based on the provided parameters
    const filter = {};
    if (date) {
      filter.date = date;
    }
    if (empObjectId) {
      filter.empObjectId = empObjectId;
    }
    if (minSalary && maxSalary) {
      filter.salary = { $gte: minSalary, $lte: maxSalary };
    } else {
      if (minSalary) {
        filter.salary = { $gte: minSalary };
      }
      if (maxSalary) {
        filter.salary = { $lte: maxSalary };
      }
    }
    if (empId) {
      filter.empId = empId;
    }

    // ==========Find payment data based on the filter=========
    const paymentData = await Payment.find(filter);

    // Check if payment data is found
    if (paymentData.length === 0) {
      return res.status(404).json({ success: false, message: "payment not found!" });
    }

    // Send the filtered payment data in the response
    return res.status(200).json({ success: true, data: paymentData });
  } catch (error) {
    console.error("Error during payment data fetch:", error);
    return res.status(500).json({ success: false, message: `Server Error: ${error.message || error}` });
  }
});

//=================================== Route -> api/SalaryDetailLastMonth =========================
exports.SalaryDetailLastMonth = asyncHandler(async (req, res) => {
  try {
    let CurrentYearAndMonth = await YearAndMonthSpliter(); //2024-03

    // ==========Find payment data based on the filter=========
    const paymentData = await Payment.find({
      date: {
        $regex: `^${CurrentYearAndMonth}`,
      },
    });

    // Check if payment data is found
    if (paymentData.length === 0) {
      return res.status(404).json({ success: false, message: "payment not found!" });
    }

    // Send the filtered payment data in the response
    return res.status(200).json({ success: true, data: paymentData });
  } catch (error) {
    console.error("Error during payment data fetch:", error);
    return res.status(500).json({ success: false, message: `Server Error: ${error.message || error}` });
  }
});

//================================= Route -> api/SalaryDetail/:id ================================
exports.salaryDetailById = asyncHandler(async (req, res) => {
  try {
    //===========================EMAIL CHECK =====================
    const { id } = req.params;

    const existingUser = await Employee.findById(id);
    if (!existingUser) {
      return res.status(409).json({ success: false, message: "Something went wrong, please login again!" });
    }

    //==================== find salary details ===================
    const salaryDetail = await Payment.find({ empObjectId: { $in: id } });

    if (salaryDetail === 0) {
      return res.status(409).json({ success: false, message: `payments not found in this account!` });
    }
    //====================== response details=====================

    return res.status(200).json({ success: true, data: salaryDetail });
  } catch (error) {
    console.error("Error during fetching employee payments :", error);
    return res.status(500).json({ success: false, message: `Server Error: ${error.message || error}` });
  }
});

//==================================== Route -> api/SentPaySlips =================================
exports.sentPaySlips = asyncHandler(async (req, res) => {
  try {
    const paymentData = req.body;
    let payslipData = [];

    // Loop through each payment entry
    for (const payment of paymentData) {
      const existingUser = await Employee.findById(payment.empObjectId);

      if (existingUser) {
        // Construct payslip data for the employee
        const payslip = {
          employeeId: payment.empId,
          email: existingUser.email,
          employeeName: `${existingUser.firstName} ${existingUser.lastName} `,
          payPeriod: payment.payPeriod,
          date: payment.date,
          salary: payment.salary,
          presentDays: payment.presentDays,
          halfDays: payment.halfDays,
          absentDays: payment.absentDays,
          workingDays: payment.WorkingDays,
        };

        payslipData.push(payslip);
      }
    }

    // Loop through each payslip data
    for (const payslip of payslipData) {
      try {
        // Generate payslip PDF
        const pdfPath = await generatePayslip(payslip);

        // Send email with payslip attachment
        await sendEmail(
          payslip.email,
          `🌟 Your Payslip🌟`,
          `
            Dear ${payslip.employeeName},
            
            Please find attached your payslip for the period ${payslip.payPeriod}.
            
            If you have any questions or need assistance, don't hesitate to reach out to the HR department.
          `,
          pdfPath // Attach the PDF file
        );
      } catch (error) {
        console.error("Error sending payslip:", error);
      }
    }

    return res.status(200).json({ success: true, message: "Successfully sent payslip data.", data: payslipData });
  } catch (error) {
    console.error("Error during generating payslips:", error);
    return res.status(500).json({ success: false, message: `Server Error: ${error.message || error}` });
  }
});

//==================================== Route -> api/SentPaySlipEmp/ ==============================
exports.sentPaySlipEmp = asyncHandler(async (req, res) => {
  try {
    const paymentData = req.body;
    let payslipData = [];

    // Loop through each payment entry
    for (const payment of paymentData) {
      const existingUser = await Employee.findById(payment.empObjectId);

      if (existingUser) {
        // Construct payslip data for the employee
        const payslip = {
          employeeId: payment.empId,
          email: existingUser.email,
          employeeName: `${existingUser.firstName} ${existingUser.lastName} `,
          payPeriod: payment.payPeriod,
          date: payment.date,
          salary: payment.salary,
          presentDays: payment.presentDays,
          halfDays: payment.halfDays,
          absentDays: payment.absentDays,
          workingDays: payment.WorkingDays,
        };

        payslipData.push(payslip);
      }
    }

    // Loop through each payslip data
    for (const payslip of payslipData) {
      try {
        // Generate payslip PDF
        const pdfPath = await generatePayslip(payslip);

        // Send email with payslip attachment
        await sendEmail(
          payslip.email,
          `🌟 Your Payslip🌟`,
          `
            Dear ${payslip.employeeName},
            
            Please find attached your payslip for the period ${payslip.payPeriod}.
            
            If you have any questions or need assistance, don't hesitate to reach out to the HR department.
          `,
          pdfPath // Attach the PDF file
        );

      } catch (error) {
        console.error("Error sending payslip:", error);
      }
    }

    return res.status(200).json({ success: true, message: "Successfully sent payslip data." });
  } catch (error) {
    console.error("Error during generating payslips:", error);
    return res.status(500).json({ success: false, message: `Server Error: ${error.message || error}` });
  }
});



exports.createPayment = async (req, res) => {
  try {
    const {
      empId,
      empObjectId,
      salary,
      presentDays,
      halfDays,
      absentDays,
      WorkingDays,
      date,
      payPeriod,
    } = req.body;

    if (!empId || !empObjectId || !salary || !presentDays || !WorkingDays || !date || !payPeriod) {
      return res.status(400).json({ message: "All required fields must be filled." });
    }

    const newPayment = new Payment({
      empId,
      empObjectId,
      salary,
      presentDays,
      halfDays,
      absentDays,
      WorkingDays,
      date,
      payPeriod,
    });

    const savedPayment = await newPayment.save();
    res.status(201).json({ message: "Payment record created successfully", data: savedPayment });
  } catch (error) {
    res.status(500).json({ message: "Error creating payment record", error: error.message });
  }
};



exports.getAttendanceByEmpId = async (req, res) => {
  try {
    const { empId } = req.query;

    if (!empId) {
      return res.status(400).json({ message: "Employee ID is required" });
    }

    const attendanceRecords = await Attendance.find({ empId });

    if (attendanceRecords.length === 0) {
      return res.status(404).json({ message: "No attendance records found for this employee" });
    }

    res.status(200).json({ message: "Attendance records retrieved successfully", data: attendanceRecords });
  } catch (error) {
    res.status(500).json({ message: "Error fetching attendance records", error: error.message });
  }
};
exports.addAttendanceRecords = async (req, res) => {
  try {
    const attendanceData = req.body;
    if (!Array.isArray(attendanceData) || !attendanceData.length) {
      return res.status(400).json({ message: "Invalid attendance data" });
    }

    const insertedRecords = await Attendance.insertMany(attendanceData);
    res.status(201).json({
      message: "Attendance records added successfully",
      data: insertedRecords,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};