import { useEffect, useState } from "react";
import BackgroundLayout from "../../Common/Pages/background";
import { instance as axios } from "../../utils/axiosConfig";

import { getToken } from "../../utils/decryptToken";
import toast from "react-hot-toast";
import { CustomButton } from "../../Common/Pages/buttons";

export const LeaveRequestPage = () => {
  const [lInfo, setLInfoData] = useState([]);
  const [leaveData, setLeaveData] = useState({
    startDate: "",
    endDate: "",
    reason: "",
    isFullDay: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        
        const lInfoResponse = await axios.get(`/getLeaveInfoDetails`, {
          headers: {
            Authorization: `Bearer ${getToken}`,
          },
        });
          
        if (lInfoResponse.data.success) {
          setLInfoData(lInfoResponse.data.data);
        }
      } catch (err) {
        handleRequestError(err);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.loading("Please wait...");

    try {
      // Check if any field is empty
      for (const key in leaveData) {
        if (!leaveData[key]) {
          toast.error("Please fill in all fields.");
          return;
        }
      }

      const response = await axios.post(`/createLeaveRequest`, leaveData, {
        headers: {
          Authorization: `Bearer ${getToken}`,
        },
      });

      toast.dismiss();

      if (response.data.success) {
        toast.success(response.data.message);
        setLeaveData({
          startDate: "",
          endDate: "",
          reason: "",
          isFullDay: "",
        });
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      handleRequestError(err);
    }
  };

  const handleInputChange = (e) => {
    setLeaveData({ ...leaveData, [e.target.name]: e.target.value });
  };

  const handleRequestError = (err) => {
    toast.dismiss();
    if (err.response) {
      toast.error(err.response.data.message);
    } else if (err.request) {
      toast.error("Server not responding, please try again later!");
    } else {
      toast.error("An error occurred, please try again later!");
    }
  };

  return (
    <BackgroundLayout>
      <div className="flex flex-col items-center justify-center w-full h-full mt-24 ">
        <div className="bg-white rounded shadow-xl p-8 sm:p-12 w-[80%]">
          <h2 className="mb-8 text-2xl font-semibold text-center">Leave Request Form</h2>
          <form className="grid sm:grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="startDate" className="block mb-1 font-medium">
                Start Date
              </label>
              <input
                id="startDate"
                type="date"
                name="startDate"
                value={leaveData.startDate}
                onChange={handleInputChange}
                className="w-full h-10 px-4 mb-2 border border-gray-300 rounded shadow-sm focus:border-black focus:outline-none focus:shadow-outline"
                placeholder="Enter start date"
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block mb-1 font-medium">
                End Date
              </label>
              <input
                id="endDate"
                type="date"
                name="endDate"
                value={leaveData.endDate}
                onChange={handleInputChange}
                className="w-full h-10 px-4 mb-2 border border-gray-300 rounded shadow-sm focus:border-black focus:outline-none focus:shadow-outline"
                placeholder="Enter end date"
              />
            </div>
            <div>
              <label htmlFor="reason" className="block mb-1 font-medium">
                Reason
              </label>
              <select
                id="reason"
                name="reason"
                value={leaveData.reason}
                onChange={handleInputChange}
                className="w-full h-10 px-4 mb-2 border border-gray-300 rounded shadow-sm focus:border-black focus:outline-none focus:shadow-outline"
              >
                <option value="">Select reason</option>
                {lInfo.map((item) => (
                  <option key={item._id} value={item.leaveTitle}>
                    {item.leaveTitle}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="isFullDay" className="block mb-1 font-medium">
                Leave Type
              </label>
              <select
                id="isFullDay"
                name="isFullDay"
                value={leaveData.isFullDay}
                onChange={handleInputChange}
                className="w-full h-10 px-4 mb-2 border  border-gray-300 rounded shadow-sm focus:border-black focus:outline-none focus:shadow-outline"
              >
                <option value="">Select leave type</option>
                <option value={true}>Full Day</option>
                <option value={false}>Half Day</option>
              </select>
            </div>
          </form>

          <CustomButton
            type="submit"
            className=" py-3 mt-4 w-full font-semibold text-white bg-gray-800 rounded shadow hover:bg-gray-700"
            name="Make a request!"
            onClick={(e) => handleSubmit(e)}
            disabled={!Object.values(leaveData).every((value) => value)}
          />
        </div>
      </div>
      
    </BackgroundLayout>
  );
};
