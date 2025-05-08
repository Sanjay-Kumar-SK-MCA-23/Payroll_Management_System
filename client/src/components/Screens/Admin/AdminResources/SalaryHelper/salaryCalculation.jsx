import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { CustomButton, ShowPopUpButton } from "../../../../Common/Pages/buttons";
import { getToken } from "../../../../utils/decryptToken";
import toast from "react-hot-toast";
import { instance as axios } from "../../../../utils/axiosConfig";

export const SalaryCalculationForm = ({ trigger }) => {
  const [showModal, setShowModal] = useState(false);
  const [workingDays, setWorkingDays] = useState("");
  const [calacuatedSalary, setCalacuatedSalary] = useState([]);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        toast.loading("Please wait...");
        let response = await axios.get(
          `/SalaryDetailLastMonth`,

          {
            headers: {
              Authorization: `Bearer ${getToken}`,
            },
          }
        );
        toast.dismiss();
        if (response.data.success) {
          setCalacuatedSalary(response.data.data);
        }
      } catch (err) {
        toast.dismiss(); // Dismiss loading toast on error

        setCalacuatedSalary([]);
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
    }
  }, [showModal]);

  const handleSubmit = async () => {
    try {
      toast.loading("Please wait...");

      if (!workingDays) {
        return toast.error("Enter working days!", 3000);
      }

      const response = await axios.get(`/calculateSalary/${workingDays}`, {
        headers: {
          Authorization: `Bearer ${getToken}`,
        },
      });

      toast.dismiss(); // Dismiss loading toast
      if (response.data.success) {
        setCalacuatedSalary(response.data.data);
        toast.success(response.data.message);
        setWorkingDays("");
      }
    } catch (err) {
      toast.dismiss(); // Dismiss loading toast on error
      if (err.response) {
        toast.error(err.response.data.message);
        setWorkingDays("");
      } else if (err.request) {
        toast.error("Server not responding, please try again later!");
      } else {
        toast.error("An error occurred, please try again later!");
      }
    }
  };

  return (
    <>
      <CustomButton
        title="salary calculation"
        name="Salary calculation"
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

              <h1 className="text-3xl font-bold my-4  text-center">Salary Calculation Form</h1>

              <span className="text-red font-semibold ">
                *Note: salary can calculate only once per month, so please enter the correct number of working days.
              </span>
              <div className="grid md:grid-cols-2 sm:grid-cols-1 ml-6 mb-4 gap-4">
                <div>
                  <label className="font-semibold">Working Days:</label>

                  <input
                    type="Number"
                    max={31}
                    min={1}
                    value={workingDays}
                    onChange={(e) => setWorkingDays(e.target.value)}
                    placeholder="Enter working days"
                    className="border border-gray-300 rounded px-2 py-1 focus:outline-none h-9 focus:border-black w-full"
                  />
                </div>
                <ShowPopUpButton
                  title="Calculate Salary for this Month"
                  className="mb-2 md:mb-0 text-white text-center bg-gradient-to-br from-dark to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-400 dark:focus:ring-blue-800  px-5 py-2 text-sm shadow-sm font-medium tracking-wider rounded-full hover:shadow-lg hover:bg-blue-600"
                  etcClassName="mt-6"
                  onClick={(e) => handleSubmit(e)}
                  question={`the previous month  working days is ${workingDays} check before clicking calculate?`}
                  yes="Calaculate"
                  disabled={!workingDays || workingDays > 31}
                />
              </div>

              {calacuatedSalary.length > 0 && (
                <>
                  <h2 className="font-bold my-4 text-center mt-12"> previous month calculation 👇</h2>
                  <div className="overflow-x-auto border-4 ml-6 mr-6 rounded-2xl ">
                    <div className="max-h-80 overflow-y-scroll scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar scrollbar-thumb-slate-700 scrollbar-track-slate-300">
                      <table className="w-full table-auto bg-white divide-y divide-gray-200">
                        <thead className=" bg-gray-200 sticky top-0">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase">
                              Employee ID
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase">
                              Present Days
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase">
                              Absent Days
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase">Half Days</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase">Salary</th>
                            <th className="px-4  py-3 text-left text-xs font-medium text-black uppercase">Date</th>
                            <th className="px-4  py-3 text-left text-xs font-medium text-black uppercase">
                              Total Working Days
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {calacuatedSalary.map((item) => (
                            <tr key={item._id}>
                              <td className="px-4 py-3 border-r-2 border-b-2">{item.empId}</td>
                              <td className="px-4 py-3 border-r-2 border-b-2">{item.presentDays}</td>
                              <td className="px-4 py-3 border-r-2 border-b-2">{item.absentDays}</td>
                              <td className="px-4 py-3 border-r-2 border-b-2">{item.halfDays}</td>
                              <td className="px-4 py-3 border-r-2 border-b-2">{item.salary}</td>
                              <td className="px-4 py-3 w-32  border-r-2 border-b-2">{item.date}</td>
                              <td className="px-4 py-3 border-r-2 border-b-2">{item.WorkingDays}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
