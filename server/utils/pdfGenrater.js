 const PDFDocument = require("pdfkit");
const fs = require("fs");
const asyncHandler = require("express-async-handler");
const path = require("path");





const generatePayslip = asyncHandler(async (data) => {
  const outputPath = path.resolve(__dirname, "../PDF/payslips", `${data.employeeId}_payslip.pdf`);
  const doc = new PDFDocument();
  const outputStream = fs.createWriteStream(outputPath);
  doc.pipe(outputStream);

  doc.font("Helvetica-Bold").fontSize(18).text("Employee Payslip", { align: "center" }).moveDown(0.5);
  doc.font("Helvetica").fontSize(12);

  doc.text(`Employee ID: ${data.employeeId}`);
  doc.text(`Employee Name: ${data.employeeName}`);
  doc.text(`Pay Period: ${data.payPeriod}`);
  doc.text(`Date of Payment: ${data.date}`).moveDown(0.5);

  doc.font("Helvetica-Bold").text("Earnings:", { underline: true }).font("Helvetica");

  doc.text(`Gross Salary (including overtime): $${data.salary.toFixed(2)}`).moveDown(0.5);
  doc.text(`Net Salary: $${data.salary.toFixed(2)}`).moveDown(1);

  doc.font("Helvetica-Oblique").fontSize(10).text("Thank you!");

  doc.end();
  return outputPath;
});

module.exports = { generatePayslip };
