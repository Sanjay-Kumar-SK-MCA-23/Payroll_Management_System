import React, { useEffect, useState } from "react";
import defaultProfile from "../../../../../images/defaultProfile.jpg";
import { ChevronRight, GanttChartSquare, Pencil, X } from "lucide-react";
import { ShowPopUpButton } from "../../../../Common/Pages/buttons";
import { decodeTokenRole, getToken } from "../../../../utils/decryptToken";
import toast from "react-hot-toast";
import { instance as axios, baseURL_Image } from "../../../../utils/axiosConfig";
import { EmployeeEditForm } from "./EmployeeEditForm";
import { useLocation } from "react-router-dom";
import { EmpSalaryDetail } from "../SalaryHelper/salaryDetailPopUp";
import { EmpAttendDetail } from "../AttendanceHelper/attendancePopupComponents";
import { EmpLeaveDetail } from "../LeaveHelper/leavePopupComponents";

export const EmployeeDetailView = ({ employeeId, trigger }) => {
  const [showModal, setShowModal] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showSalary, setShowSalary] = useState(false);
  const [showLeave, setShowLeave] = useState(false);
  const [showAttendance, setShowAttendance] = useState(false);
  const [employee, setEmployee] = useState({});
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
      

        let response = await axios.get(`/getEmployeeDetail/${employeeId}`, {
          headers: {
            Authorization: `Bearer ${getToken}`,
          },
        });
      
        if (response.data.success) {
          setEmployee(response.data.data);
        }
      } catch (err) {
       

        setEmployee({});
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
    if (showModal) {
      fetchData();
    }
  }, [employeeId, showModal, showEditForm]);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handleButtonClick = async (id, value) => {
    try {
      toast.loading("please wait..");

      const response = await axios.put(
        `/updateEmployeeDetail/${id}`,
        {
          isWorking: value,
        },
        {
          headers: {
            Authorization: `Bearer ${getToken}`,
          },
        }
      );

      toast.dismiss(); // Dismiss loading toast
      if (response.data.success) {
        setEmployee(response.data.data);
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

  return (
    <>
      <button
        onClick={toggleModal}
        className="text-white bg-gradient-to-r from-dark via-blue-900 to-dark hover:bg-gradient-to-br focus:ring-2 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-sm shadow-green-500/50 dark:shadow-sm dark:shadow-blue-800/80 font-medium rounded-lg text-xs md:text-sm px-3 md:px-4 py-1 md:py-2 text-center"
      >
        <GanttChartSquare />
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
                  trigger();
                  setShowEditForm(false);
                  setShowSalary(false);
                  setShowLeave(false);
                  setShowAttendance(false);
                }}
                type="button"
                className="inline-flex items-center justify-center w-8 h-8 float-right mt-0 rounded-full px-2 py-2  font-medium tracking-wide text-black transition duration-200 hover:bg-red "
              >
                <X className="h-6 w-6" aria-hidden="true" />
              </button>

              {!showEditForm && location.pathname === "/EmployeeDetails" ? (
                <button
                  className="mt-11 float-right rounded-full px-2 py-2  bg-black mr-[-1.9rem] text-white"
                  onClick={() => setShowEditForm(true)}
                >
                  <Pencil className="w-4  h-4" />
                </button>
              ) : null}

              {!showEditForm && !showSalary && !showLeave && !showAttendance ? (
                <div className="container mx-auto justify-center">
                  <h1 className="text-3xl font-bold mt-0 text-center mb-4">Employee Details</h1>

                  <div className="flex items-center  gap-3  mb-4 ">
                    {employee.image == null ? (
                      <img src={defaultProfile} alt="profile" className="w-16 h-16 rounded-full" />
                    ) : (
                      <img
                        src={`${baseURL_Image}/images/${employee.image.split("\\")[1]}?${new Date().getTime()}`}
                        alt="Employee"
                        className="w-16 h-16 rounded-md"
                      />
                    )}

                    <div className="flex flex-col">
                      <span className="font-semibold">
                        {employee.firstName} {employee.lastName}
                      </span>
                      <span className="text-sm text-gray-500">{employee.email}</span>
                      {decodeTokenRole() !== "Admin" && location.pathname === "/EmployeeDetails" ? (
                        <div>
                          Working status:
                          {employee.isWorking ? (
                            <ShowPopUpButton
                              title="Active"
                              StatusBtn="mt-2 md:mb-0  bg-green-500 border border-green-500 px-1 py-0 text-sm shadow-sm font-medium tracking-wider text-white rounded-full hover:shadow-lg hover:bg-green-600 block md:inline-block"
                              onClick={() => handleButtonClick(employee._id, false)}
                              question="Do you want to deactivate this employee?"
                              yes="Deactivate"
                            />
                          ) : (
                            <ShowPopUpButton
                              title="Inactive"
                              StatusBtn="mt-2 md:mb-0 bg-red-500  border border-red-500 px-1 py-0 text-sm shadow-sm font-medium tracking-wider text-white rounded-full hover:shadow-lg hover:bg-red-600"
                              onClick={() => handleButtonClick(employee._id, true)}
                              className="mb-2 md:mb-0 bg-green-500 border border-green-500 px-5 py-2 text-sm shadow-sm font-medium tracking-wider text-white rounded-full hover:shadow-lg hover:bg-green-600"
                              question="Do you want to activate this employee?"
                              yes="Activate"
                            />
                          )}
                        </div>
                      ) : (
                        <div>
                          {employee.isWorking ? (
                            <span className="text-green font-semibold">active</span>
                          ) : (
                            <span className="text-red font-semibold">Unactive</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {!showSalary && location.pathname === "/SalaryDetails" ? (
                    <ChevronRight
                      onClick={() => setShowSalary(true)}
                      className="float-right mt-12 mr-[-1rem] w-10 h-10  text-white text-center bg-gradient-to-br from-dark to-blue-500 hover:bg-gradient-to-bl rounded-full focus:ring-4 focus:outline-none focus:ring-blue-400 dark:focus:ring-blue-800 font-medium hover:cursor-pointer"
                    />
                  ) : null}
                  {!showLeave && location.pathname === "/LeaveDetails" ? (
                    <ChevronRight
                      onClick={() => setShowLeave(true)}
                      className="float-right mt-12 mr-[-1rem] w-10 h-10  text-white text-center bg-gradient-to-br from-dark to-blue-500 hover:bg-gradient-to-bl rounded-full focus:ring-4 focus:outline-none focus:ring-blue-400 dark:focus:ring-blue-800 font-medium hover:cursor-pointer"
                    />
                  ) : null}

                  {!showAttendance && location.pathname === "/AttendanceDetails" ? (
                    <ChevronRight
                      onClick={() => setShowAttendance(true)}
                      className="float-right mt-12 mr-[-1rem] w-10 h-10  text-white text-center bg-gradient-to-br from-dark to-blue-500 hover:bg-gradient-to-bl rounded-full focus:ring-4 focus:outline-none focus:ring-blue-400 dark:focus:ring-blue-800 font-medium hover:cursor-pointer"
                    />
                  ) : null}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-semibold">Employee ID:</p>
                      <p>{employee.empId}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Job Type:</p>
                      <p>{employee.jobType}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Salary:</p>
                      <p>{employee.salary}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Join Date:</p>
                      <p>{employee.joinDate}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Address:</p>
                      <p>{employee.address}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Mobile No:</p>
                      <p>{employee.mobileNo}</p>
                    </div>

                    <div>
                      <p className="font-semibold">Role:</p>
                      <p>{employee.role}</p>
                    </div>
                    <div className="top-0">
                      <p className="font-semibold">Termination Date:</p>
                      <p>{employee.terminationDate || ""}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {showEditForm && !showSalary && !showAttendance && !showLeave && (
                    <EmployeeEditForm employeeData={employee} back={() => setShowEditForm(false)} />
                  )}
                  {showSalary && !showEditForm && !showAttendance && !showLeave && (
                    <EmpSalaryDetail employeeData={employee} back={() => setShowSalary(false)} />
                  )}
                  {!showSalary && !showEditForm && showAttendance && !showLeave && (
                    <EmpAttendDetail employeeData={employee} back={() => setShowAttendance(false)} />
                  )}
                  {!showSalary && !showEditForm && !showAttendance && showLeave && (
                    <EmpLeaveDetail employeeData={employee} back={() => setShowLeave(false)} />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
