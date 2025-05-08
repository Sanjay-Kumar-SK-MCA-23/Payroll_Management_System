import { instance as axios } from "../../utils/axiosConfig";

import React, { useState, useEffect } from "react";
import BackgroundLayout from "../../Common/Pages/background";

import toast from "react-hot-toast";
import { decodeTokenId, getToken } from "../../utils/decryptToken";

import { GanttChartSquare } from "lucide-react";


const SalaryStatusPage = () => {
  const [paymentData, setPaymentData] = useState([]);

  
  const [filters, setFilters] = useState({
    date: "",
    minSalary: "",
    maxSalary: "",
    empObjectId: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        
        const decodedEmpId = await decodeTokenId();

        let response = await axios.post(
          `/SalaryDetails`,
          { ...filters, empObjectId: decodedEmpId },
          {
            headers: {
              Authorization: `Bearer ${getToken}`,
            },
          }
        );
        
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
  }, [filters]);

   
 const sentPaySlipEmp = async (item) => {
   try {
     toast.loading("please wait..");
     let response = await axios.post(`/SentPaySlipEmp`, [item], {
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

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 m-6">
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
            <input
              id="minSalary"
              className="w-full h-8 px-2 border border-gray-300 rounded shadow-sm focus:border-black focus:outline-none focus:shadow-outline"
              name="minSalary"
              type="number"
              value={filters.minSalary}
              onChange={handleInputChange}
              placeholder="Enter minimum salary!"
              min={0}
            />
          </div>
          <div>
            <label htmlFor="maxSalary" className="text-white">
              Maximum Salary:
            </label>
            <input
              id="maxSalary"
              className="w-full h-8 px-2 border border-gray-300 rounded shadow-sm focus:border-black focus:outline-none focus:shadow-outline"
              name="maxSalary"
              type="number"
              value={filters.maxSalary}
              onChange={handleInputChange}
              placeholder="Enter maximum salary!"
            />
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
                  <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase ">payslip</th>
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
                      <td className="px-4 py-3 border-r-2 border-b-2 w-14">
                        {" "}
                        <button
                          onClick={()=>sentPaySlipEmp(item)}
                          className="text-white bg-gradient-to-r from-dark via-blue-900 to-dark hover:bg-gradient-to-br focus:ring-2 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-sm shadow-green-500/50 dark:shadow-sm dark:shadow-blue-800/80 font-medium rounded-lg text-xs md:text-sm px-3 md:px-4 py-1 md:py-2 text-center"
                        >
                          <GanttChartSquare />
                        </button>
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

export default SalaryStatusPage;
