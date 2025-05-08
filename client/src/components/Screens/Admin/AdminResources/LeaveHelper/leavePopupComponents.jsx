import { useEffect, useState } from "react";
import { getToken } from "../../../../utils/decryptToken";
import { instance as axios } from "../../../../utils/axiosConfig";
import toast from "react-hot-toast";

import { ChevronLeft } from "lucide-react";

export const EmpLeaveDetail = ({ employeeData, back }) => {
  const [leave, setLeave] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
       
        const response = await axios.post(
          `/viewLeaveDetails`,
          { empObjectId: employeeData._id },
          {
            headers: {
              Authorization: `Bearer ${getToken}`,
            },
          }
        );
       
        if (response.data.success) {
          setLeave(response.data.data);
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
  }, [employeeData._id]);

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold text-center my-4">
        Leave Details of {employeeData.firstName + employeeData.lastName}
      </h1>

      <ChevronLeft
        onClick={back}
        className=" text-white float-left mt-24 ml-[-1rem] mr-4 w-10 h-10 text-center bg-gradient-to-br from-dark to-blue-500 hover:bg-gradient-to-bl rounded-full focus:ring-4 focus:outline-none focus:ring-blue-400 dark:focus:ring-blue-800 font-medium hover:cursor-pointer"
      />
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
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leave && leave.length === 0 ? (
                <tr>
                  <td colSpan="8" className="  text-center  py-2">
                    No data found
                  </td>
                </tr>
              ) : (
                leave.map((item) => (
                  <tr key={item._id}>
                    <td className="px-4 py-3 border-r-2 border-b-2">{item.empId}</td>

                    <td className="px-4 py-3 border-r-2 border-b-2">{item.reason}</td>
                    <td className="px-4 py-3 border-r-2 border-b-2">{item.startDate}</td>
                    <td className="px-4 py-3 border-r-2 border-b-2">{item.endDate}</td>
                    <td className="px-4 py-3 border-r-2 border-b-2">{item.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
