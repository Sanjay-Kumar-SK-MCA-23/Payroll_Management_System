import { useEffect, useState } from "react";
import { decodeTokenId, getToken } from "../../utils/decryptToken";
import { instance as axios } from "../../utils/axiosConfig";

import { CustomButton } from "../../Common/Pages/buttons";
import toast from "react-hot-toast";

import { X } from "lucide-react";

export const ProfileEditForm = ({ refresh, employeeData }) => {
  const [employee, setEmployee] = useState();
  const [showModal, setShowModal] = useState(false);
  console.log(employee);
  const toggleModal = () => {
    setShowModal(!showModal);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/getEmployeeDetail/${await decodeTokenId()}`, {
          headers: {
            Authorization: `Bearer ${getToken}`,
          },
        });
        if (response.data.success) {
          setEmployee(response.data.data);
        }
      } catch (err) {
        toast.dismiss();
        setEmployee(null);
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
  }, []);
  const handleUpdate = async () => {
    try {
      toast.loading("Please wait...");

      const Data = {};
      const updatedData = { ...employee };

      // Add modified fields to the form data
      for (const key in updatedData) {
        if (updatedData.hasOwnProperty(key) && updatedData[key] !== employeeData[key]) {
          Data[key] = updatedData[key];
        }
      }

      if (Object.keys(Data).length === 0) {
        toast.dismiss();
        return toast.error("No changes made.");
      }
      console.log(Data);
      const response = await axios.put(`/updateEmployee/${employee._id}`, Data, {
        headers: {
          Authorization: `Bearer ${getToken}`,
        },
      });

      toast.dismiss(); // Dismiss loading toast
      if (response.data.success) {
        setEmployee({});
        toast.success(response.data.message);
      }
      for (const key in Data) {
        delete Data[key];
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

  return (
    <>
      <button
        onClick={toggleModal}
        className="text-white bg-gradient-to-r from-dark via-blue-900 to-dark hover:bg-gradient-to-br focus:ring-2 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-sm shadow-green-500/50 dark:shadow-sm dark:shadow-blue-800/80 font-medium rounded-lg text-xs md:text-sm px-3 md:px-4 py-1 md:py-2 text-center"
      >
        Update information
      </button>

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
                  refresh();
                }}
                type="button"
                className="inline-flex items-center justify-center w-8 h-8 float-right mt-0 rounded-full px-2 py-2  font-medium tracking-wide text-black transition duration-200 hover:bg-red "
              >
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
              <div className="container mx-auto">
                <h1 className="text-3xl font-bold text-center my-4">Profile Update</h1>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="font-semibold">First Name:</label>
                    <input
                      type="text"
                      value={employee.firstName}
                      onChange={(e) => setEmployee({ ...employee, firstName: e.target.value })}
                      className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-black w-full"
                    />
                  </div>
                  <div>
                    <label className="font-semibold">Last Name:</label>
                    <input
                      type="text"
                      value={employee.lastName}
                      onChange={(e) => setEmployee({ ...employee, lastName: e.target.value })}
                      className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-black w-full"
                    />
                  </div>
                  <div>
                    <label className="font-semibold">Email:</label>
                    <input
                      type="email"
                      value={employee.email}
                      onChange={(e) => setEmployee({ ...employee, email: e.target.value })}
                      className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-black w-full"
                    />
                  </div>

                  <div>
                    <label className="font-semibold">Mobile No:</label>
                    <input
                      type="text"
                      value={employee.mobileNo}
                      onChange={(e) => setEmployee({ ...employee, mobileNo: e.target.value })}
                      className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-black w-full"
                    />
                  </div>

                  <div>
                    <label className="font-semibold">Password:</label>
                    <input
                      type="password"
                      onChange={(e) => setEmployee({ ...employee, password: e.target.value })}
                      className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-black w-full"
                    />
                  </div>

                  <div>
                    <label className="font-semibold">Address:</label>

                    <textarea
                      placeholder="Enter address"
                      required
                      className="w-full sm:min-h-[2.6rem]  sm:max-h-[2rem]   px-4 py-2 mb-2 transition duration-200 bg-white border border-gray-300 rounded shadow-sm appearance-none focus:border-black focus:outline-none focus:shadow-outline"
                      id="address"
                      name="address"
                      value={employee.address}
                      onChange={(e) => setEmployee({ ...employee, address: e.target.value })}
                    ></textarea>
                  </div>
                </div>

                <CustomButton
                  onClick={() => handleUpdate(employee._id)}
                  className="float-right top-2"
                  name="Submit"
                  type="submit"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
