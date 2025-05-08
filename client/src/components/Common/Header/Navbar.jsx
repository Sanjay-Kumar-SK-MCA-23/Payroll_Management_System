import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-hot-toast";
import { CustomButton } from "../Pages/buttons";
// import { Button } from "@material-tailwind/react";

export function Navbar() {
  let token = localStorage.getItem("token");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    try {
      let decoded;
      if (token) {
        decoded = jwtDecode(token);
      }

      if (!token) {
        setMenuItems([
          { name: "Home", href: "/" },
          { name: "Employee Login", href: "/employeeLogin" },
          { name: "Admin Login", href: "/adminLogin" },
        ]);
      } else if (decoded.user.role.toLowerCase() === "admin") {
        setMenuItems([
          { name: "Add Employee", href: "/EmployeeRegister" },
          { name: "Attendance", href: "/AttendanceDetails" },
          { name: "Employee Details", href: "/EmployeeDetails" },
          { name: "Salary Details", href: "/SalaryDetails" },
          { name: "Leave Details", href: "/LeaveDetails" },
          { name: "Report", href: "/ReportPage" },
        ]);
      } else if (decoded.user.role.toLowerCase() === "employee") {
        setMenuItems([
          { name: "Leave request", href: "/LeaveRequst" },
          { name: "Leave status", href: "/LeaveStatus" },
          { name: "Salary Details", href: "/SalaryStatus" },
          { name: "Attendance Details", href: "/AttendanceStatus" },
        ]);
      }
    } catch (error) {
      toast.error("please try to  login again");
    }
  }, [token]);

  return (
    <div className="relative z-20 pt-2 w-full bg-dark	text-white">
      <div className="mx-auto flex max-w-8xl items-center justify-between px-4 py-2 sm:px-6 lg:px-10">
        <div className="inline-flex items-center space-x-2">
          <span className="font-bold cursor-pointer" onClick={() => (window.location = "/")} title="dashboard">
            Payroll Management
          </span>
        </div>
        <div className="hidden lg:block">
          <ul className={`inline-flex space-x-8 cursor-pointer`}>
            {menuItems.map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  className={`text-sm font-semibold text-white hover:text-gray-400 ${
                    location.pathname === item.href ? "underline" : ""
                  }`}
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="hidden lg:block">
          {token ? (
            <CustomButton
              className="rounded-full text-sm font-semibold px-5"
              name="Profile"
              onClick={() => (window.location = "/profile")}
            />
          ) : (
            <CustomButton
              className="rounded-full text-sm font-semibold px-5 "
              name="Contact Us"
              onClick={() => (window.location = "#")}
            />
          )}
        </div>
        <div className="lg:hidden">
          <Menu onClick={toggleMenu} className="h-6 w-6 cursor-pointer" />
        </div>
        {isMenuOpen && (
          <div className="absolute inset-x-0 top-0 z-50 origin-top-right transform p-2 transition lg:hidden">
            <div className="divide-y-2 divide-gray-50 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="px-5 pb-6 pt-5">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center space-x-2">
                    <span>
                      <svg
                        width="30"
                        height="30"
                        viewBox="0 0 50 56"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      ></svg>
                    </span>
                    <span className="font-bold">Payroll Management</span>
                  </div>
                  <div className="-mr-2">
                    <button
                      onClick={toggleMenu}
                      type="button"
                      className="inline-flex items-center justify-center h-9 rounded-full px-3 mr-6 font-medium tracking-wide text-white transition duration-200  bg-black/100 "
                    >
                      <X className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                </div>
                <div className="mt-6">
                  <nav className="grid gap-y-4">
                    {menuItems.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={`-m-3 flex items-center rounded-md p-3 text-sm font-semibold hover:bg-gray-50 ${
                          location.pathname === item.href ? "underline" : ""
                        }`}
                      >
                        <span className="ml-3 text-base font-medium text-gray-900">{item.name}</span>
                      </a>
                    ))}
                  </nav>
                </div>
                {token && (
                  <CustomButton
                    className="rounded-full text-sm font-semibold px-5"
                    name="Profile"
                    onClick={() => (window.location = "/profile")}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
