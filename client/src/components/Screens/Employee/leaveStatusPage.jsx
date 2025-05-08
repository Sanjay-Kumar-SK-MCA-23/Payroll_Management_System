import { useEffect, useState } from "react";
import BackgroundLayout from "../../Common/Pages/background";
import { instance as axios } from "../../utils/axiosConfig";

import { decodeTokenId, getToken } from "../../utils/decryptToken";
import toast from "react-hot-toast";
import { ShowPopUpButtonForLeaveCancel } from "../../Common/Pages/buttons";

export const LeaveStatusPage = () => {
  const [pop, setPop] = useState(false);
  const [lInfo, setLInfoData] = useState([]);
  const [leaveData, setLeaveData] = useState([]);
  const [filters, setFilters] = useState({
    status: "",
    startDate: null,
    endDate: null,
    empObjectId: null,
    isFullDay: "",
    reason: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        
        const decodedEmpId = await decodeTokenId();
        const leaveResponse = await axios.post(
          `/viewLeaveDetails`,
          { ...filters, empObjectId: decodedEmpId },
          {
            headers: {
              Authorization: `Bearer ${getToken}`,
            },
          }
        );
           
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
  }, [filters, pop]);

  const handleButtonDelete = async (id) => {
    try {
      toast.loading("Please Wait...");
      const response = await axios.delete(`/cancelLeaveRequest/${id}`, {
        headers: {
          Authorization: `Bearer ${getToken}`,
        },
      });
      toast.dismiss();
      if (response.data.success) {
        toast.success(response.data.meesage);
        setPop(false);
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

  const handleInputChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };
  return (
    <BackgroundLayout>
      <>
        <h1 className="text-3xl font-bold text-white mt-6 mb-6 text-center">Leave Details </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 m-6">
          <div>
            <label htmlFor="status" className="text-white">
              Status:
            </label>
            <select
              id="status"
              className="w-full h-8 px-2 py-1 border border-gray-300 rounded shadow-sm focus:border-black focus:outline-none focus:shadow-outline"
              name="status"
              value={filters.status}
              onChange={handleInputChange}
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
                  <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase">Cancel</th>
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
                        {item.status === "Pending" ? (
                          <ShowPopUpButtonForLeaveCancel
                            title="Cancel"
                            StatusBtn={`mt-2 md:mb-0 border px-1 py-0 text-sm shadow-sm font-medium tracking-wider shadow-lg shadow-gray-500/50 dark:shadow-lg dark:shadow-gray-800/80 text-sm shadow-sm font-medium tracking-wider text-white rounded-full px-5 py-2 ${"bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80"}`}
                            handleSubmit={() => {
                              handleButtonDelete(item._id);
                              setPop(true);
                            }}
                            className="mb-2 md:mb-0 text-white text-center bg-gradient-to-br from-dark to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-400 dark:focus:ring-blue-800  px-5 py-2 text-sm shadow-sm font-medium tracking-wider rounded-full hover:shadow-lg hover:bg-blue-600"
                            question="Do you want to cancel the leave Request?"
                            yes="Submit"
                          />
                        ) : (
                          <button
                            className={`mt-2 md:mb-0 border py-2  shadow-gray-500/50 dark:shadow-lg dark:shadow-gray-800/80 text-sm shadow-sm font-medium tracking-wider text-white rounded-full px-5 ${"bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300  focus:ring-4 focus:outline-none focus:ring-gray-300 dark:focus:ring-gray-800 shadow-lg shadow-gray-500/50 dark:shadow-lg dark:shadow-gray-800/80"}`}
                            disabled={true}
                          >
                            cancel
                          </button>
                        )}
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
