import { instance as axios, baseURL_Image } from "../../utils/axiosConfig";

import React, { useState, useEffect } from "react";
import BackgroundLayout from "../../Common/Pages/background";
import { EmployeeDetailView } from "./AdminResources/EmployeeHelper/MainPopupComponents";
import toast from "react-hot-toast";
import { getToken } from "../../utils/decryptToken";

import defaultProfile from "../../../images/defaultProfile.jpg";
import { fetchEmpData, salaryArrayValues } from "../../utils/values";

const EmployeeDetailsPage = () => {
  const [employeeData, setEmployeeData] = useState([]);
  const [employeeId, setEmployeeId] = useState([]);
  const [jobData, setJobData] = useState([]);
  const [popClose, setPopClose] = useState(false);
  const [filters, setFilters] = useState({
    jobType: "",
    isWorking: "",
    startDate: "",
    endDate: "",
    minSalary: "",
    maxSalary: "",
    empId: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setEmployeeId(await fetchEmpData());
        let response = await axios.post(`/employeeDetails`, filters, {
          headers: {
            Authorization: `Bearer ${getToken}`,
          },
        });
        if (response.data.success) {
          setEmployeeData(response.data.data);
        }

        let jobDatas = await axios.get(`/getJobDetails`, {
          headers: {
            Authorization: `Bearer ${getToken}`,
          },
        });

        if (jobDatas.data.success) {
          setJobData(jobDatas.data.data);
        }
      } catch (err) {
        toast.dismiss(); // Dismiss loading toast on error

        setEmployeeData([]);
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
  }, [filters, popClose]);

  const handleInputChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <BackgroundLayout>
      <h1 className="text-3xl font-bold text-white mt-6 mb-6 text-center">Employee Details</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4 m-6">
        <div>
          <label htmlFor="empId" className="text-white">
            Employee ID:
          </label>
          <select
            id="empId"
            className="w-full h-8 px-2 border border-gray-300 rounded shadow-sm focus:border-black focus:outline-none focus:shadow-outline"
            name="empId"
            value={filters.empId}
            onChange={handleInputChange}
          >
            <option value="">Select Employee ID</option>
            {employeeId.map((item) => (
              <option value={item.empId} key={item._id}>
                {item.empId}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="isWorking" className="text-white">
            Status:
          </label>
          <select
            id="isWorking"
            className="w-full h-8 px-2 py-1 border border-gray-300 rounded shadow-sm focus:border-black focus:outline-none focus:shadow-outline"
            name="isWorking"
            value={filters.isWorking}
            onChange={handleInputChange}
          >
            <option value="">Select Status</option>
            <option value={true}>Working</option>
            <option value={false}>Not Working</option>
          </select>
        </div>
        <div>
          <label htmlFor="jobType" className="text-white">
            Job:
          </label>
          <select
            id="jobType"
            className="w-full h-8 px-2 py-1 border border-gray-300 rounded shadow-sm focus:border-black focus:outline-none focus:shadow-outline"
            name="jobType"
            value={filters.jobType}
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
          <label htmlFor="minSalary" className="text-white">
            Minimum Salary:
          </label>
          <select
            id="minSalary"
            className="w-full h-8 px-2 py-1 border border-gray-300 rounded shadow-sm focus:border-black focus:outline-none focus:shadow-outline"
            name="minSalary"
            value={filters.minSalary}
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
          <label htmlFor="maxSalary" className="text-white">
            Maximum Salary:
          </label>
          <select
            id="maxSalary"
            className="w-full h-8 px-2 py-1 border border-gray-300 rounded shadow-sm focus:border-black focus:outline-none focus:shadow-outline"
            name="maxSalary"
            value={filters.maxSalary}
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
          <label htmlFor="startDate" className="text-white">
            Join Date Start:
          </label>
          <input
            id="startDate"
            className="w-full h-8 px-2 border border-gray-300 rounded shadow-sm focus:border-black focus:outline-none focus:shadow-outline"
            name="startDate"
            type="date"
            value={filters.startDate}
            onChange={handleInputChange}
            min={0}
            placeholder="Enter start date to search!"
          />
        </div>
        <div>
          <label htmlFor="endDate" className="text-white">
            Join Date End:
          </label>
          <input
            id="endDate"
            className="w-full h-8 px-2 border border-gray-300 rounded shadow-sm focus:border-black focus:outline-none focus:shadow-outline"
            name="endDate"
            type="date"
            value={filters.endDate}
            onChange={handleInputChange}
            placeholder="Enter end date to search!"
          />
        </div>
      </div>
      <div className="overflow-x-auto border-4 ml-6 mr-6 rounded-2xl ">
        <div className="max-h-80 overflow-y-scroll scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar scrollbar-thumb-slate-700 scrollbar-track-slate-300">
          <table className="w-full table-auto bg-white divide-y divide-gray-200">
            <thead className=" bg-gray-200 sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase">Employee</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase">Employee ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase">Job Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase">Salary</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase">Join Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase">View</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {employeeData.length === 0 ? (
                <tr>
                  <td colSpan="8" className="  text-center py-2">
                    No data found
                  </td>
                </tr>
              ) : (
                employeeData.map((item) => (
                  <tr key={item._id}>
                    <td className="px-1 py-1 border-b">
                      <div className="flex items-center gap-3">
                        {item.image === null || item.image === undefined ? (
                          <img src={defaultProfile} alt="profile" className="w-12 h-12 rounded-full" />
                        ) : 
                        (
                          <img
                            src={`${baseURL_Image}/images/${item.image.split("\\")[1]}?${new Date().getTime()}`}
                            alt="profile not found"
                            className="w-12 h-12 rounded-md"
                          />
                        )
                        }
                        <div className="flex flex-col">
                          <span className="font-semibold">
                            {item.firstName} {item.lastName}
                          </span>
                          <span className="text-sm text-gray-500">{item.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 border-r-2 border-b-2">{item.empId}</td>
                    <td className="px-4 py-3 border-r-2 border-b-2">{item.jobType}</td>
                    <td className="px-4 py-3 border-r-2 border-b-2">{item.salary}</td>
                    <td className="px-4 py-3 border-r-2 border-b-2">{item.joinDate}</td>
                    <td className="px-4 py-3 border-r-2 border-b-2">
                      <EmployeeDetailView
                        employeeId={item._id}
                        trigger={() => {
                          if (!popClose) {
                            setPopClose(true);
                          } else {
                            setPopClose(false);
                          }
                        }}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </BackgroundLayout>
  );
};

export default EmployeeDetailsPage;
