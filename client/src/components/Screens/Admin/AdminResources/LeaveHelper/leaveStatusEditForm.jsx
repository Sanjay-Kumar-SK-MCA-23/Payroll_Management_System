import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { CustomButton, ShowPopUpButtonForLeave } from "../../../../Common/Pages/buttons";
import { getToken } from "../../../../utils/decryptToken";
import toast from "react-hot-toast";
import { instance as axios } from "../../../../utils/axiosConfig";



export const LeaveStatusEditForm = ({ trigger }) => {
  const [showModal, setShowModal] = useState(false);
  const [refreshData, setRefreshData] = useState(false);
  const [sortOrder, setSortOrder] = useState("All"); // Default sorting order

  const [leaveData, setLeaveData] = useState([]);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response = await axios.get(`/LeaveDetailsToEdit`, {
          headers: {
            Authorization: `Bearer ${getToken}`,
          },
        });
        if (response.data.success) {
          setLeaveData(response.data.data);
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
    if (showModal) {
      fetchData();
      setRefreshData(false);
    }
  }, [showModal, refreshData]);

  const handleButtonClick = async (id, value) => {
    try {
      toast.loading("please wait..");

      const response = await axios.put(
        `/updateLeaveRequest/${id}/${value}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getToken}`,
          },
        }
      );

      toast.dismiss(); // Dismiss loading toast
      if (response.data.success) {
        setRefreshData(true);
        toast.success(response.data.message);
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

  // Filter leaveData based on sorting order
  let filteredLeaveData = leaveData;
  if (sortOrder !== "All") {
    filteredLeaveData = leaveData.filter((item) => item.status === sortOrder);
  }

  // Define sorting orders for different status types
  const sortingOrders = {
    All: "All",
    A: "Approved",
    P: "Pending",
    R: "Rejected",
  };

  const sortByStatus = () => {
    // Get the current sorting order
    const currentOrder = Object.keys(sortingOrders).find((key) => sortingOrders[key] === sortOrder);

    // Get the next sorting order
    const statusKeys = Object.keys(sortingOrders);
    const currentIndex = statusKeys.indexOf(currentOrder);
    const nextIndex = (currentIndex + 1) % statusKeys.length;
    const nextSortOrder = statusKeys[nextIndex];

    // Update sorting order state
    setSortOrder(sortingOrders[nextSortOrder]);
  };

  return (
    <>
      <CustomButton
        title="Leave StatusManage Leave Requests"
        name="Manage Leave Requests"
        className="mt-[-20rem] ml-6 rounded-full border"
        onClick={() => toggleModal()}
      />
      {showModal && (
        <div
          className="min-w-screen h-screen animated fadeIn faster  fixed left-0 top-8 flex justify-center items-center inset-0 z-50 outline-none focus:outline-none bg-no-repeat bg-center bg-cover"
          id="modal-id"
        >
          <div className="absolute bg-black opacity-80 inset-0 z-0 "></div>
          <div className="w-full max-w-3xl p-5 relative mx-auto my-auto rounded-xl shadow-lg bg-white">
            <div className="">
              <button
                onClick={() => {
                  toggleModal();
                  trigger();
                }}
                type="button"
                className="inline-flex items-center justify-center w-8 h-8 float-right mt-0 rounded-full px-2 py-2  font-medium tracking-wide text-black transition duration-200 hover:bg-red "
              >
                <X className="h-6 w-6" aria-hidden="true" />
              </button>

              <h1 className="text-3xl font-bold my-4  text-center">Leave Request Status </h1>

              <>
                <h2 className="font-bold my-4 text-center mr-[-20rem] mt-12">
                  {" "}
                  click the status title to sort requests 👇
                </h2>
                <div className="overflow-x-auto border-4 ml-6 mr-6 rounded-2xl ">
                  <div className="max-h-80 overflow-y-scroll scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar scrollbar-thumb-slate-700 scrollbar-track-slate-300">
                    <table className="w-full table-auto bg-white divide-y divide-gray-200">
                      <thead className=" bg-gray-200 sticky top-0">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase">Employee ID</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase">reason</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase">start date</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase">end Date</th>
                          <th
                            className={`px-4 py-3 text-left text-xs font-bold uppercase cursor-pointer shadow-black ${
                              sortOrder === "Rejected"
                                ? "text-red-500"
                                : sortOrder === "Approved"
                                ? "text-green-500"
                                : sortOrder === "Pending"
                                ? "text-yellow-500"
                                : "text-blue-500"
                            }`}
                            onClick={sortByStatus}
                          >
                            Status {sortOrder && `(${sortOrder})`}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredLeaveData && filteredLeaveData.length === 0 ? (
                          <tr>
                            <td colSpan="8" className="  text-center  py-2">
                              No data found
                            </td>
                          </tr>
                        ) : (
                          filteredLeaveData.map((item) => (
                            <tr key={item._id}>
                              <td className="px-4 py-3 border-r-2 border-b-2">{item.empId}</td>
                              <td className="px-4 py-3 border-r-2 border-b-2">{item.reason}</td>
                              <td className="px-4 py-3 border-r-2 border-b-2">{item.startDate}</td>
                              <td className="px-4 py-3 border-r-2 border-b-2">{item.endDate}</td>
                              <td className="px-4 py-3 border-r-2 border-b-2">
                                <ShowPopUpButtonForLeave
                                  title={item.status}
                                  StatusBtn={`mt-2 md:mb-0 border px-1 py-0 text-sm shadow-sm font-medium tracking-wider shadow-lg shadow-gray-500/50 dark:shadow-lg dark:shadow-gray-800/80 text-sm shadow-sm font-medium tracking-wider text-white rounded-full px-5 py-2 ${
                                    item.status === "Pending"
                                      ? "bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-yellow-300 dark:focus:ring-yellow-800 shadow-lg shadow-yellow-500/50 dark:shadow-lg dark:shadow-yellow-800/80"
                                      : item.status === "Approved"
                                      ? "bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80"
                                      : "bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80"
                                  }`}
                                  handleSubmit={(selectedValue) => handleButtonClick(item._id, selectedValue)}
                                  className="mb-2 md:mb-0 text-white text-center bg-gradient-to-br from-dark to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-400 dark:focus:ring-blue-800  px-5 py-2 text-sm shadow-sm font-medium tracking-wider rounded-full hover:shadow-lg hover:bg-blue-600"
                                  question="Do you want to change the leave Request?"
                                  yes="Submit"
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
            </div>
          </div>
        </div>
      )}
    </>
  );
};
