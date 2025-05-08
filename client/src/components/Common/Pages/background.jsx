import React from "react";
import { Navbar } from "../../Common/Header/Navbar";
import { useLocation } from "react-router-dom";

const BackgroundLayout = ({ children }) => {
  const location = useLocation();
  const showBackground =
    location.pathname === "/adminLogin" ||
    location.pathname === "/employeeLogin" ||
    location.pathname === "/EmployeeRegister";

  return (
    <div className={`relative max-hit-max min-h-screen`}>
      <Navbar />
      <div className={`absolute inset-0 overflow-hidden z-0`}>
        <div className={`relative  bg-dark h-full pt-16`}>
          {/* Add padding top to accommodate the Navbar */}
          {showBackground && (
            <svg className={`absolute inset-x-0 bottom-0 mb-0 text-white w-full`} viewBox="0 0 1160 163">
              <path
                fill="currentColor"
                d="M-164 13L-104 39.7C-44 66 76 120 196 141C316 162 436 152 556 119.7C676 88 796 34 916 13C1036 -8 1156 2 1216 7.7L1276 13V162.5H1216C1156 162.5 1036 162.5 916 162.5C796 162.5 676 162.5 556 162.5C436 162.5 316 162.5 196 162.5C76 162.5 -44 162.5 -104 162.5H-164V13Z"
              />
            </svg>
          )}
        </div>
      </div>
      <div className={`relative z-10`}>{children}</div>
    </div>
  );
};

export default BackgroundLayout;
