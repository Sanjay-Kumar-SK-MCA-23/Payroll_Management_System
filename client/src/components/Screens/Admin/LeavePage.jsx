import { instance as axios } from "../../utils/axiosConfig";

import React, { useState, useEffect } from "react";
import BackgroundLayout from "../../Common/Pages/background";
import { EmployeeDetailView } from "./AdminResources/EmployeeHelper/MainPopupComponents";
import toast from "react-hot-toast";
import { getToken } from "../../utils/decryptToken";

import { LeaveStatusEditForm } from "./AdminResources/LeaveHelper/leaveStatusEditForm";
import { fetchEmpData } from "../../utils/values";

const LeaveDetailsPage = () => {
  const [employeeId, setEmployeeId] = useState([]);

  const [lInfo, setLInfoData] = useState([]);
  const [popClose, setPopClose] = useState(false);
  const [leaveData, setLeaveData] = useState([]);
  const [filters, setFilters] = useState({
    status: "",
    startDate: null,
    endDate: null,
    empId: null,
    isFullDay: "",
    reason: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setEmployeeId(await fetchEmpData());

        let leaveResponse = await axios.post(`/viewLeaveDetails`, filters, {
          headers: {
            Authorization: `Bearer ${getToken}`,
          },
        });
        if (leaveResponse.data.success) {
          setLeaveData(leaveResponse.data.data);
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

        setLeaveData([]);

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
      <>
        <h1 className="text-3xl font-bold text-white mt-6 mb-6 text-center">Leave Details </h1>
        <LeaveStatusEditForm
          trigger={() => {
            if (!popClose) {
              setPopClose(true);
            } else {
              setPopClose(false);
            }
          }}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 m-6">
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
            <label htmlFor="status" className="text-white">
              Status:
            </label>
            <select
              id="status"
              className="w-full h-8 px-2 py-1 border border-gray-300 rounded shadow-sm focus:border-black focus:outline-none focus:shadow-outline"
              name="status"
              onChange={handleInputChange}
              defaultValue=""
            >
              <option value="">Select Status</option>
              <option value="Rejected">Rejected</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
            </select>
          </div>
          <div>
            <label htmlFor="startDate" className="text-white">
              Start Date:
            </label>
            <input
              id="startDate"
              className="w-full h-8 px-2 border border-gray-300 rounded shadow-sm focus:border-black focus:outline-none focus:shadow-outline"
              name="startDate"
              type="date"
              onChange={handleInputChange}
              placeholder="Enter startDate to search!"
            />
          </div>
          <div>
            <label htmlFor="endDate" className="text-white">
              End Date:
            </label>
            <input
              id="endDate"
              className="w-full h-8 px-2 border border-gray-300 rounded shadow-sm focus:border-black focus:outline-none focus:shadow-outline"
              name="endDate"
              type="date"
              onChange={handleInputChange}
              placeholder="Enter endDate to search!"
            />
          </div>
          <div>
            <label htmlFor="isFullDay" className="text-white">
              LeaveType:
            </label>
            <select
              id="isFullDay"
              className="w-full h-8 px-2 py-1 border border-gray-300 rounded shadow-sm focus:border-black focus:outline-none focus:shadow-outline"
              name="isFullDay"
              value={filters.isFullDay}
              onChange={handleInputChange}
            >
              <option value="">Select LeaveType</option>
              <option value={true}>FullDay</option>
              <option value={false}>half-Day</option>
            </select>
          </div>
          <div>
            <label htmlFor="reason" className="text-white">
              Reason:
            </label>
            <select
              id="reason"
              className="w-full h-8 px-2 py-1 border border-gray-300 rounded shadow-sm focus:border-black focus:outline-none focus:shadow-outline"
              name="reason"
              value={filters.reason}
              onChange={handleInputChange}
              defaultValue=""
            >
              <option value="">Select Reason</option>
              {lInfo.map((item) => {
                return (
                  <option value={item.leaveTitle} key={item._id}>
                    {item.leaveTitle}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        <div className="overflow-x-auto border-4 ml-6 mr-6 rounded-2xl ">
          <div className="max-h-80 overflow-y-scroll scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar scrollbar-thumb-slate-700 scrollbar-track-slate-300">
            <table className="w-full table-auto bg-white divide-y divide-gray-200">
              <thead className=" bg-gray-200 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase">Employee ID</th>

                  <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase">reason</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase">start date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase">end Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase">status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase">view</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leaveData.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="  text-center  py-2">
                      No data found
                    </td>
                  </tr>
                ) : (
                  leaveData.map((item) => (
                    <tr key={item._id}>
                      <td className="px-4 py-3 border-r-2 border-b-2">{item.empId}</td>

                      <td className="px-4 py-3 border-r-2 border-b-2">{item.reason}</td>
                      <td className="px-4 py-3 border-r-2 border-b-2">{item.startDate}</td>
                      <td className="px-4 py-3 border-r-2 border-b-2">{item.endDate}</td>
                      <td className="px-4 py-3 border-r-2 border-b-2">{item.status}</td>

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

export default LeaveDetailsPage;
