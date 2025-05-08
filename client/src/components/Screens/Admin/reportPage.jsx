import { useEffect, useState } from "react";
import BackgroundLayout from "../../Common/Pages/background";

import { getToken } from "../../utils/decryptToken";
import { instance as axios } from "../../utils/axiosConfig";
import toast from "react-hot-toast";
import { fetchEmpData, salaryArrayValues } from "../../utils/values";
import { generateReportPDF } from "../../utils/reportGenrator";

export const ReportPage = () => {
  const [employeefilters, setEmployeeFilters] = useState({
    jobType: "",
    isWorking: "",
    startDate: "",
    endDate: "",
    minSalary: "",
    maxSalary: "",
    empId: "",
  });
  const [salaryfilters, setSalaryFilters] = useState({
    empId: "",
    date: "",
    minSalary: "",
    maxSalary: "",
  });

  const [attendancefilters, setAttendanceFilters] = useState({
    empId: "",
    status: "",
    startDate: "",
    endDate: "",
  });

  const [leavefilters, setLeaveFilters] = useState({
    empId: "",
    status: "",
    startDate: "",
    endDate: "",
    isFullDay: "",
    reason: "",
  });

  const [employeeData, setEmployeeData] = useState([]);
  const [lInfo, setLInfoData] = useState([]);
  const [jobData, setJobData] = useState([]);
  const [selectedView, setSelectedView] = useState("Employee");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setEmployeeData(await fetchEmpData());
        let jobDatas = await axios.get(`/getJobDetails`, {
          headers: {
            Authorization: `Bearer ${getToken}`,
          },
        });

        if (jobDatas.data.success) {
          setJobData(jobDatas.data.data);
        }
        let lInfoResponse = await axios.get(`/getLeaveInfoDetails`, {
          headers: {
            Authorization: `Bearer ${getToken}`,
          },
        });
        if (lInfoResponse.data.success) {
          setLInfoData(lInfoResponse.data.data);
        }
      } catch (err) {
        toast.dismiss(); // Dismiss loading toast on error

        if (err.response) {
          toast.error(err.response.data.message);
        } else if (err.request) {
          toast.error("Server not responding, please try again later!");
        } else {
          toast.error("An error occurred, please try again later!");
        }
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    switch (selectedView) {
      case "Employee":
        setEmployeeFilters((prevFilters) => ({
          ...prevFilters,
          [name]: value,
        }));
        break;
      case "Salary":
        setSalaryFilters((prevFilters) => ({
          ...prevFilters,
          [name]: value,
        }));
        break;
      case "Attendance":
        setAttendanceFilters((prevFilters) => ({
          ...prevFilters,
          [name]: value,
        }));
        break;
      case "Leave":
        setLeaveFilters((prevFilters) => ({
          ...prevFilters,
          [name]: value,
        }));
        break;
      default:
        break;
    }
  };

  const handleGetReport = async () => {
    try {
      toast.loading("Please wait...");

      let response;

      switch (selectedView) {
        case "Employee":
          response = await axios.post(`/employeeDetails`, employeefilters, {
            headers: {
              Authorization: `Bearer ${getToken}`,
            },
          });
          toast.dismiss(); // Dismiss loading toast
          if (response.data.success) {
            const filteredData = response.data.data.map((employee) => ({
              EmployeeId: employee.empId,
              firstName: employee.firstName,
              lastName: employee.lastName,
              Email: employee.email,
              Address: employee.address,
              MobileNo: employee.mobileNo,
              JobType: employee.jobType,
              Salary: employee.salary,
            }));

            await generateReportPDF({
              title: `${selectedView} Report`,
              type: filteredData,
            });
            toast.success("report downloaded !");
          }
          break;
        case "Attendance":
          response = await axios.post(`/attendanceDetails`, attendancefilters, {
            headers: {
              Authorization: `Bearer ${getToken}`,
            },
          });
          toast.dismiss(); // Dismiss loading toast

          if (response.data.success) {
            const filteredData = response.data.data.map((attendance) => ({
              EmployeeId: attendance.empId,
              Date: attendance.date,
              Status: attendance.status,
              CheckInTime: attendance.checkInTime,
              TotalHours: attendance.totalHours,
              CheckOutTime: attendance.checkOutTime,
            }));
            console.log(filteredData);
            await generateReportPDF({
              title: `${selectedView} Report`,
              type: filteredData,
            });
            toast.success("report downloaded !");
          }
          break;
        case "Leave":
          response = await axios.post(`/viewLeaveDetails`, leavefilters, {
            headers: {
              Authorization: `Bearer ${getToken}`,
            },
          });
          toast.dismiss(); // Dismiss loading toast

          if (response.data.success) {
            const filteredData = response.data.data.map((leave) => ({
              EmployeeId: leave.empId,
              Reason: leave.reason,
              StartDate: leave.startDate,
              EndDate: leave.endDate,
              Status: leave.status,
              IsFullDay: leave.isFullDay,
            }));

            await generateReportPDF({
              title: `${selectedView} Report`,
              type: filteredData,
            });
            toast.success("report downloaded !");
          }
          break;
        case "Salary":
          response = await axios.post(`/SalaryDetails`, salaryfilters, {
            headers: {
              Authorization: `Bearer ${getToken}`,
            },
          });
          toast.dismiss(); // Dismiss loading toast

          if (response.data.success) {
            const filteredData = response.data.data.map((salary) => ({
              EmployeeId: salary.empId,
              Salary: salary.salary,
              PresentDays: salary.presentDays,
              HalfDays: salary.halfDays,
              AbsentDays: salary.absentDays,
              WorkingDays: salary.WorkingDays,
              Date: salary.date,
              PayPeriod: salary.payPeriod,
            }));

            await generateReportPDF({
              title: `${selectedView} Report`,
              type: filteredData,
            });
            toast.success("report downloaded !");
          }
          break;
        default:
          break;
      }
    } catch (err) {
      console.log(err);
      toast.dismiss(); // Dismiss loading toast on error
      if (err.response) {
        toast.error(err.response.data.message);
      } else if (err.request) {
        toast.error("Server not responding, please try again later!");
      } else {
        toast.error("An error occurred, please try again later!");
      }
    }
  };

  return (
    <BackgroundLayout>
      <div className="m-6 bg-white text-black rounded-md p-6 flex flex-col">
        <label htmlFor="empId" className="text-black">
          Report Section:
        </label>
        <select
          value={selectedView}
          onChange={(e) => setSelectedView(e.target.value)}
          className="w-full h-8 px-2 py-1 border border-gray-300 rounded shadow-sm focus:border-black focus:outline-none focus:shadow-outline mb-4"
        >
          <option value="Employee">Employee</option>
          <option value="Attendance">Attendance</option>
          <option value="Salary">Salary</option>
          <option value="Leave">Leave</option>
        </select>
        {selectedView === "Employee" && (
          <section className="p-4 rounded-lg border-2 mb-4 border-gray-400">
            <h2 className="font-bold text-black mb-4">Employee Section : </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label htmlFor="empId" className="text-black">
                  Employee ID:
                </label>
                <select
                  id="empId"
                  className="w-full h-8 px-2 py-1 border border-gray-300 rounded shadow-sm focus:border-black focus:outline-none focus:shadow-outline"
                  name="empId"
                  value={employeefilters.empId}
                  onChange={handleInputChange}
                >
                  <option value="">Select Emp ID</option>
                  {employeeData.map((item) => (
                    <option value={item.empId} key={item._id}>
                      {item.empId}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="isWorking" className="text-black">
                  Status:
                </label>
                <select
                  id="isWorking"
                  className="w-full h-8 px-2 py-1 border border-gray-300 rounded shadow-sm focus:border-black focus:outline-none focus:shadow-outline"
                  name="isWorking"
                  value={employeefilters.isWorking}
                  onChange={handleInputChange}
                >
                  <option value="">Select Status</option>
                  <option value="true">Working</option>
                  <option value="false">Not Working</option>
                </select>
              </div>
              <div>
                <label htmlFor="jobType" className="text-black">
                  Job:
                </label>
                <select
                  id="jobType"
                  className="w-full h-8 px-2 py-1 border border-gray-300 rounded shadow-sm focus:border-black focus:outline-none focus:shadow-outline"
                  name="jobType"
                  value={employeefilters.jobType}
                  onChange={handleInputChange}
                >
                  <option value="">Select Job Type</option>
                  {jobData.map((item) => (
                    <option value={item.jobTitle} key={item._id}>
                      {item.jobTitle}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="minSalary" className="text-black">
                  Minimum Salary:
                </label>
                <select
                  id="minSalary"
                  className="w-full h-8 px-2 border border-gray-300 rounded shadow-sm focus:border-black focus:outline-none focus:shadow-outline"
                  name="minSalary"
                  value={employeefilters.minSalary}
                  onChange={handleInputChange}
                >
                  <option value="">Select minimum salary</option>
                  {salaryArrayValues.map((salary, index) => (
                    <option key={index} value={salary}>
                      {salary}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="maxSalary" className="text-black">
                  Maximum Salary:
                </label>
                <select
                  id="maxSalary"
                  className="w-full h-8 px-2 border border-gray-300 rounded shadow-sm focus:border-black focus:outline-none focus:shadow-outline"
                  name="maxSalary"
                  value={employeefilters.maxSalary}
                  onChange={handleInputChange}
                >
                  <option value="">Select maximum salary</option>
                  {salaryArrayValues.map((salary, index) => (
                    <option key={index} value={salary}>
                      {salary}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="startDate" className="text-black">
                  Join Date Start:
                </label>
                <input
                  id="startDate"
                  className="w-full h-8 px-2 border border-gray-300 rounded shadow-sm focus:border-black focus:outline-none focus:shadow-outline"
                  name="startDate"
                  type="date"
                  value={employeefilters.startDate}
                  onChange={handleInputChange}
                  placeholder="Enter start date to search!"
                />
              </div>
              <div>
                <label htmlFor="endDate" className="text-black">
                  Join Date End:
                </label>
                <input
                  id="endDate"
                  className="w-full h-8 px-2 border border-gray-300 rounded shadow-sm focus:border-black focus:outline-none focus:shadow-outline"
                  name="endDate"
                  type="date"
                  value={employeefilters.endDate}
                  onChange={handleInputChange}
                  placeholder="Enter end date to search!"
                />
              </div>
            </div>
          </section>
        )}
        {selectedView === "Leave" && (
          <section className="p-4 rounded-lg border-2 mb-4 border-gray-400">
            <h2 className="font-bold text-black mb-4">Leave Section :</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label htmlFor="empId" className="text-black">
                  Employee ID:
                </label>
                <select
                  id="empId"
                  className="w-full h-8 px-2 py-1 border border-gray-300 rounded shadow-sm focus:border-black focus:outline-none focus:shadow-outline"
                  name="empId"
                  value={leavefilters.empId}
                  onChange={handleInputChange}
                >
                  <option value="">Select Emp ID</option>
                  {employeeData.map((item) => (
                    <option value={item.empId} key={item._id}>
                      {item.empId}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="status" className="text-black">
                  Status:
                </label>
                <select
                  id="status"
                  className="w-full h-8 px-2 py-1 border border-gray-300 rounded shadow-sm focus:border-black focus:outline-none focus:shadow-outline"
                  name="status"
                  value={leavefilters.status}
                  onChange={handleInputChange}
                >
                  <option value="">Select Status</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                </select>
              </div>
              <div>
                <label htmlFor="startDate" className="text-black">
                  Start Date:
                </label>
                <input
                  id="startDate"
                  className="w-full h-8 px-2 border border-gray-300 rounded shadow-sm focus:border-black focus:outline-none focus:shadow-outline"
                  name="startDate"
                  type="date"
                  value={leavefilters.startDate}
                  onChange={handleInputChange}
                  placeholder="Enter start date"
                />
              </div>
              <div>
                <label htmlFor="endDate" className="text-black">
                  End Date:
                </label>
                <input
                  id="endDate"
                  className="w-full h-8 px-2 border border-gray-300 rounded shadow-sm focus:border-black focus:outline-none focus:shadow-outline"
                  name="endDate"
                  type="date"
                  value={leavefilters.endDate}
                  onChange={handleInputChange}
                  placeholder="Enter end date"
                />
              </div>
              <div>
                <label htmlFor="isFullDay" className="text-black">
                  Leave Type:
                </label>
                <select
                  id="isFullDay"
                  className="w-full h-8 px-2 py-1 border border-gray-300 rounded shadow-sm focus:border-black focus:outline-none focus:shadow-outline"
                  name="isFullDay"
                  value={leavefilters.isFullDay}
                  onChange={handleInputChange}
                >
                  <option value="">Select Leave Type</option>
                  <option value={true}>Full Day</option>
                  <option value={false}>Half Day</option>
                </select>
              </div>
              <div>
                <label htmlFor="reason" className="text-black">
                  Reason:
                </label>
                <select
                  id="reason"
                  className="w-full h-8 px-2 py-1 border border-gray-300 rounded shadow-sm focus:border-black focus:outline-none focus:shadow-outline"
                  name="reason"
                  value={leavefilters.reason}
                  onChange={handleInputChange}
                >
                  <option value="">Select Reason</option>
                  {lInfo.map((item) => (
                    <option value={item.leaveTitle} key={item._id}>
                      {item.leaveTitle}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>
        )}
        {selectedView === "Salary" && (
          <section className="p-4 rounded-lg border-2 mb-4 border-gray-400">
            <h2 className="font-bold text-black mb-4">Salary Section: </h2>
            <div className="grid grid-cols-1 md:grid-cols-3  gap-6">
              <div>
                <label htmlFor="empId" className="text-black">
                  Employee ID:
                </label>
                <select
                  id="empId"
                  className="w-full h-8 px-2 py-1 border border-gray-300 rounded shadow-sm focus:border-black focus:outline-none focus:shadow-outline"
                  name="empId"
                  value={salaryfilters.empId}
                  onChange={handleInputChange}
                >
                  <option value="">Select Emp ID</option>
                  {employeeData.map((item) => (
                    <option value={item.empId} key={item._id}>
                      {item.empId}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="date" className="text-black">
                  Date:
                </label>
                <input
                  id="date"
                  className="w-full h-8 px-2 border border-gray-300 rounded shadow-sm focus:border-black focus:outline-none focus:shadow-outline"
                  name="date"
                  type="date"
                  value={salaryfilters.date}
                  onChange={handleInputChange}
                  placeholder="Select date"
                />
              </div>
              <div>
                <label htmlFor="minSalary" className="text-black">
                  Minimum Salary:
                </label>
                <select
                  id="minSalary"
                  className="w-full h-8 px-2 border border-gray-300 rounded shadow-sm focus:border-black focus:outline-none focus:shadow-outline"
                  name="minSalary"
                  value={salaryfilters.minSalary}
                  onChange={handleInputChange}
                >
                  <option value="">Select minimum salary</option>
                  {salaryArrayValues.map((salary, index) => (
                    <option key={index} value={salary}>
                      {salary}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="maxSalary" className="text-black">
                  Maximum Salary:
                </label>
                <select
                  id="maxSalary"
                  className="w-full h-8 px-2 border border-gray-300 rounded shadow-sm focus:border-black focus:outline-none focus:shadow-outline"
                  name="maxSalary"
                  value={salaryfilters.maxSalary}
                  onChange={handleInputChange}
                >
                  <option value="">Select maximum salary</option>
                  {salaryArrayValues.map((salary, index) => (
                    <option key={index} value={salary}>
                      {salary}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>
        )}

        {selectedView === "Attendance" && (
          <section className="p-4 rounded-lg border-2 mb-4 border-gray-400">
            <h2 className="font-bold text-black mb-4">Attendance Section :</h2>
            <div className="grid grid-cols-1 md:grid-cols-3  gap-6">
              <div>
                <label htmlFor="empId" className="text-black">
                  Employee ID:
                </label>
                <select
                  id="empId"
                  className="w-full h-8 px-2 py-1 border border-gray-300 rounded shadow-sm focus:border-black focus:outline-none focus:shadow-outline"
                  name="empId"
                  value={attendancefilters.empId}
                  onChange={handleInputChange}
                >
                  <option value="">Select Emp ID</option>
                  {employeeData.map((item) => (
                    <option value={item.empId} key={item._id}>
                      {item.empId}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="status" className="text-black">
                  Status:
                </label>
                <select
                  id="status"
                  className="w-full h-8 px-2 py-1 border border-gray-300 rounded shadow-sm focus:border-black focus:outline-none focus:shadow-outline"
                  name="status"
                  value={attendancefilters.status}
                  onChange={handleInputChange}
                >
                  <option value="">Select Status</option>
                  <option value="Absent">Absent</option>
                  <option value="Half-Day">Half-Day</option>
                  <option value="Present">Present</option>
                </select>
              </div>
              <div>
                <label htmlFor="startDate" className="text-black">
                  Start Date:
                </label>
                <input
                  id="startDate"
                  className="w-full h-8 px-2 border border-gray-300 rounded shadow-sm focus:border-black focus:outline-none focus:shadow-outline"
                  name="startDate"
                  type="date"
                  value={attendancefilters.startDate}
                  onChange={handleInputChange}
                  placeholder="Enter start date"
                />
              </div>
              <div>
                <label htmlFor="endDate" className="text-black">
                  End Date:
                </label>
                <input
                  id="endDate"
                  className="w-full h-8 px-2 border border-gray-300 rounded shadow-sm focus:border-black focus:outline-none focus:shadow-outline"
                  name="endDate"
                  type="date"
                  value={attendancefilters.endDate}
                  onChange={handleInputChange}
                  placeholder="Enter end date"
                />
              </div>
            </div>
          </section>
        )}
        <button
          onClick={handleGetReport}
          className="text-white bg-gradient-to-r from-dark  via-blue-900 to-dark hover:bg-gradient-to-br focus:ring-2 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-sm shadow-green-500/50 dark:shadow-sm dark:shadow-blue-800/80 font-medium rounded-lg text-xs md:text-sm px-4 py-2 self-end"
        >
          PDF
        </button>
      </div>
    </BackgroundLayout>
  );
};

export default ReportPage;
