const moment = require("moment-timezone");

//==================== Get Indian Time ===================
function getIndianTime() {
  return moment().tz("Asia/Kolkata"); // Get current time in IST
}

//==================== Split Date Only ===================
function DateSpliter() {
  return getIndianTime().format("DD-MM-YYYY"); // Format: "dd-mm-yyyy"
}

//==================== Split Time Only ===================
function TimeSpliter() {
  return getIndianTime().format("HH:mm:ss"); // Format: "hh:mm:ss"
}

//================= Split Year and Month =================
function YearAndMonthSpliter() {
  return getIndianTime().format("YYYY-MM"); // Format: "yyyy-mm"
}

//============= Calculate How Many Hours User Worked =============
function calculateDurationInHours(startTime, endTime) {
  const timeZone = "Asia/Kolkata";
  const currentDate = moment().tz(timeZone).format("YYYY-MM-DD");

  // Parse start and end times in IST
  const start = moment.tz(`${currentDate} ${startTime}`, "YYYY-MM-DD HH:mm:ss", timeZone);
  const end = moment.tz(`${currentDate} ${endTime}`, "YYYY-MM-DD HH:mm:ss", timeZone);

  const durationInHours = moment.duration(end.diff(start)).asHours();
  return durationInHours;
}

module.exports = { DateSpliter, TimeSpliter, calculateDurationInHours, YearAndMonthSpliter };
