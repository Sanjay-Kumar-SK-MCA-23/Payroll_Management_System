import { useEffect, useState } from "react";
import { decodeTokenId, getToken } from "../../utils/decryptToken";
import toast from "react-hot-toast";
import { instance as axios, baseURL } from "../../utils/axiosConfig";

import BackgroundLayout from "../../Common/Pages/background";
import defaultProfile from "../../../images/defaultProfile.jpg";
import { ProfileEditForm } from "./ProfileEditForm";

export const ProfilePage = () => {
  const [employee, setEmployee] = useState(null);
  const [refresh, setRefresh] = useState(false);

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
  }, [refresh]);

  const LogOut = async () => {
    localStorage.clear("token");
    window.location.href = "/";
  };
  return (
    <BackgroundLayout>
      <div className="container mx-auto py-4 px-4 mt-16 sm:px-10">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-4 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">My account</h3>
                {employee && employee.isWorking ? (
                  <span className="text-green-600 font-semibold md:ml-16 sm:ml-0 md:mr-[-4rem] ">active</span>
                ) : (
                  <span className="text-red-600 font-semibold  md:ml-16 sm:ml-0 md:mr-[-4rem] ">Inactive</span>
                )}
                <div>
                  <ProfileEditForm employeeData={employee} refresh={() => setRefresh(true)} />
                  <button
                    onClick={() => LogOut()}
                    className="text-white bg-gradient-to-r ml-4 sm:float-right from-dark via-blue-900 to-dark hover:bg-gradient-to-br focus:ring-2 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-sm shadow-green-500/50 dark:shadow-sm dark:shadow-blue-800/80 font-medium rounded-lg text-xs md:text-sm px-3 md:px-4 py-1 md:py-2 text-center"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 items-center">
                {employee && (
                  <div className="mb-6 sm:col-span-1">
                    {employee.image == null ? (
                      <img src={defaultProfile} alt="profile" className="w-64 h-64 rounded-full" />
                    ) : (
                      <img
                        src={`${baseURL}/images/${employee.image.split("\\")[1]}`}
                        alt="Employee"
                        className="w-64 h-64 rounded-full"
                      />
                    )}
                  </div>
                )}
                {employee && (
                  <div className="sm:col-span-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
                      <div className="mb-4 flex">
                        <span className="font-semibold mr-2">Name:</span>
                        <span>
                          {employee.firstName} {employee.lastName}
                        </span>
                      </div>
                      <div className="mb-4 flex">
                        <span className="font-semibold mr-2">Email:</span>
                        <span>{employee.email}</span>
                      </div>
                      <div className="mb-4 flex">
                        <span className="font-semibold mr-2">Employee ID:</span>
                        <span>{employee.empId}</span>
                      </div>
                      <div className="mb-4 flex">
                        <span className="font-semibold mr-2">Job Type:</span>
                        <span>{employee.jobType}</span>
                      </div>
                      <div className="mb-4 flex">
                        <span className="font-semibold mr-2">Salary:</span>
                        <span>{employee.salary}</span>
                      </div>
                      <div className="mb-4 flex">
                        <span className="font-semibold mr-2">Join Date:</span>
                        <span>{employee.joinDate}</span>
                      </div>
                      <div className="mb-4 flex">
                        <span className="font-semibold mr-2">Address:</span>
                        <span>{employee.address}</span>
                      </div>
                      <div className="mb-4 flex">
                        <span className="font-semibold mr-2">Mobile No:</span>
                        <span>{employee.mobileNo}</span>
                      </div>
                      <div className="mb-4 flex">
                        <span className="font-semibold mr-2">Role:</span>
                        <span>{employee.role}</span>
                      </div>
                      <div className="mb-4 flex">
                        <span className="font-semibold mr-2">Termination Date:</span>
                        <span>{employee.terminationDate || "null"}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </BackgroundLayout>
  );
};

export default ProfilePage;
