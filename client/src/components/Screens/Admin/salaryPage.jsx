import { instance as axios } from "../../utils/axiosConfig";
import React, { useState, useEffect } from "react";
import BackgroundLayout from "../../Common/Pages/background";
import { EmployeeDetailView } from "./AdminResources/EmployeeHelper/MainPopupComponents";
import toast from "react-hot-toast";
import { getToken } from "../../utils/decryptToken";

import { SalaryCalculationForm } from "./AdminResources/SalaryHelper/salaryCalculation";
import { CustomButton } from "../../Common/Pages/buttons";
import { fetchEmpData, salaryArrayValues } from "../../utils/values";

const SalaryDetailsPage = () => {
  const [paymentData, setPaymentData] = useState([]);
    const [employeeId, setEmployeeId] = useState([]);


  const [popClose, setPopClose] = useState(false);
  const [filters, setFilters] = useState({
    date: "",
    minSalary: "",
    maxSalary: "",
    empId: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
                setEmployeeId(await fetchEmpData());

        let response = await axios.post(`/SalaryDetails`, filters, {
          headers: {
            Authorization: `Bearer ${getToken}`,
          },
        });

        if (response.data.success) {
          setPaymentData(response.data.data);
        }
      } catch (err) {
        toast.dismiss(); // Dismiss loading toast on error

        setPaymentData([]);
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

  const sentPayslips = async () => {
    try {
      toast.loading("please wait..");
      let response = await axios.post(`/SentPaySlips`, paymentData, {
        headers: {
          Authorization: `Bearer ${getToken}`,
        },
      });
      toast.dismiss();
      if (response.data.success) {
        toast.success(response.data.message);
      }
    } catch (err) {
      toast.dismiss();
      if (err.response) {
        toast.error(err.response.data.message);
      } else if (err.request) {
        toast.error("Server not responding, please try again later!");
      } else {
        toast.error("An error occurred, please try again later!");
      }
    }
  };

  const handleInputChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <BackgroundLayout>
      <>
        <h1 className="text-3xl font-bold text-white mt-6 mb-6 text-center">Salary Details </h1>
        <SalaryCalculationForm
          trigger={() => {
            if (!popClose) {
              setPopClose(true);
            } else {
              setPopClose(false);
            }
          }}
        />
        <CustomButton
          name="sent payslips"
          title="click to sent payslips to email"
          className="mt-[-20rem] w-40 rounded-full border"
          onClick={() => sentPayslips()}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 m-6">
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
              Date:
            </label>
            <input
              id="date"
              className="w-full h-8 px-2 border border-gray-300 rounded shadow-sm focus:border-black focus:outline-none focus:shadow-outline"
              name="date"
              type="date"
              value={filters.date}
              onChange={handleInputChange}
              min={0}
              placeholder="Enter date to search!"
            />
          </div>

          <div>
            <label htmlFor="minSalary" className="text-white">
              Minimum Salary:
            </label>
            <select
              id="minSalary"
              className="w-full h-8 px-2 border border-gray-300 rounded shadow-sm focus:border-black focus:outline-none focus:shadow-outline"
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
              className="w-full h-8 px-2 border border-gray-300 rounded shadow-sm focus:border-black focus:outline-none focus:shadow-outline"
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
        </div>
        <div className="overflow-x-auto border-4 ml-6 mr-6 rounded-2xl ">
          <div className="max-h-80 overflow-y-scroll scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar scrollbar-thumb-slate-700 scrollbar-track-slate-300">
            <table className="w-full table-auto bg-white divide-y divide-gray-200">
              <thead className=" bg-gray-200 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase">Employee ID</th>

                  <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase">present Days</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase">absent Days</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase">half Days</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase">Salary</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase ">Total Working Days</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase">view</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paymentData.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="  text-center  py-2">
                      No data found
                    </td>
                  </tr>
                ) : (
                  paymentData.map((item) => (
                    <tr key={item._id}>
                      <td className="px-4 py-3 border-r-2 border-b-2">{item.empId}</td>

                      <td className="px-4 py-3 border-r-2 border-b-2">{item.presentDays}</td>
                      <td className="px-4 py-3 border-r-2 border-b-2">{item.absentDays}</td>
                      <td className="px-4 py-3 border-r-2 border-b-2">{item.halfDays}</td>
                      <td className="px-4 py-3 border-r-2 border-b-2">{item.salary}</td>
                      <td className="px-4 py-3 border-r-2 border-b-2">{item.date}</td>
                      <td className="px-4 py-3 border-r-2 border-b-2 w-14">{item.WorkingDays}</td>
                      <td className="px-4 py-3 border-r-2 border-b-2">
                        <EmployeeDetailView
                          employeeId={item.empObjectId}
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
      </>
    </BackgroundLayout>
  );
};

export default SalaryDetailsPage;
