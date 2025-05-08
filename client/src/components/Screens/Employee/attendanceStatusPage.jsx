import React, { useState, useEffect } from "react";
import { instance as axios } from "../../utils/axiosConfig";
import BackgroundLayout from "../../Common/Pages/background";
import { decodeTokenId, getToken } from "../../utils/decryptToken";

import toast from "react-hot-toast";

const AttendanceStatusPage = () => {
  const [attendanceData, setAttendanceData] = useState([]);

  const [filters, setFilters] = useState({ status: "", startDate: null, endDate: null, empObjectId: null });

  useEffect(() => {
    const fetchData = async () => {
      try {
        
        const decodedEmpId = await decodeTokenId();
        const response = await axios.post(
          `/attendanceDetails`,
          { ...filters, empObjectId: decodedEmpId },
          {
            headers: {
              Authorization: `Bearer ${getToken}`,
            },
          }
        );
          
        if (response.data.success) {
          setAttendanceData(response.data.data);
        }
      } catch (err) {
          toast.dismiss(); 
        // Handle the error without logging
        setAttendanceData([]);
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

  const handleInputChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <BackgroundLayout>
      <h1 className="text-3xl font-bold text-white mt-6 mb-6 text-center">Attendance Details</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 m-6">
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
            <option value="Absent">Absent</option>
            <option value="Half-Day">Half-Day</option>
            <option value="Present">Present</option>
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
      </div>
      <div className="overflow-x-auto border-4 ml-6 mr-6 rounded-2xl ">
        <div className="max-h-80 overflow-y-scroll scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar scrollbar-thumb-slate-700 scrollbar-track-slate-300">
          <table className="w-full table-auto bg-white divide-y divide-gray-200">
            <thead className=" bg-gray-200 sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase">Employee ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase">Check-in Time</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase">Check-out Time</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {attendanceData.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-2">
                    No data found
                  </td>
                </tr>
              ) : (
                attendanceData.map((item) => (
                  <tr key={item._id}>
                    <td className="px-4 py-3 border-r-2 border-b-2">{item.empId}</td>
                    <td className="px-4 py-3 border-r-2 border-b-2">{item.date}</td>
                    <td className="px-4 py-3 border-r-2 border-b-2">{item.status}</td>
                    <td className="px-4 py-3 border-r-2 border-b-2">{item.checkInTime}</td>
                    <td className="px-4 py-3 border-r-2 border-b-2">{item.checkOutTime}</td>
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

export default AttendanceStatusPage;
