import { Navbar } from "../../Common/Header/Navbar";
import { jwtDecode } from "jwt-decode";
import { CustomButton, ShowPopUpButtonForCheckInAndCheckOut } from "../../Common/Pages/buttons";
import { useEffect, useState } from "react";
import { instance as axios } from "../../utils/axiosConfig";

import { decodeTokenId, getToken } from "../../utils/decryptToken";
import toast from "react-hot-toast";

export const Dashboard = () => {
  let token = localStorage.getItem("token");

  const decoded = jwtDecode(token);
  const [checkIn, setCheckIn] = useState(false);
  const [checkOut, setCheckOut] = useState(false);
  useEffect(() => {
    async function fetchData() {
      try {
        let response = await axios.get(`/getAttendanceDetail/${await decodeTokenId()}/${true}`, {
          headers: {
            Authorization: `Bearer ${getToken}`,
          },
        });
        if (response.data.success) {
          setCheckIn(true);
        }
      } catch (error) {
        setCheckIn(false);
      }
    }
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      toast.loading("Please wait..."); // Add loading toast here
      let response;
      if (!checkIn) {
        response = await axios.post(
          `/checkIn`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        response = await axios.put(
          `/checkOut`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
      toast.dismiss(); // Dismiss loading toast
      if (response.data.success) {
        toast.success(response.data.message);
        if (checkIn) {
          setCheckOut(true);
        }
        setCheckIn(true);
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
    <div className="relative flex flex-col h-screen w-screen">
      <Navbar />
      <div className="flex-1 px-4 py-16 md:px-24 lg:px-8 lg:py-20  bg-dark">
        <div className="grid gap-5 row-gap-8 lg:grid-cols-2 lg:w-full">
          <div className="flex flex-col justify-center">
            <div className="max-w-xl mb-0">
              <CustomButton
                className="rounded-full text-sm font-semibold px-5 border mt-[-2rem] "
                name="Contact Us"
                onClick={() => (window.location = "#")}
              />
              <ShowPopUpButtonForCheckInAndCheckOut
                handleSubmit={(e) => handleSubmit(e)}
                yes={`${checkIn ? "check Out" : "check In"}`}
                title={`${checkIn ? "check Out Today" : "check In Today"}`}
                className="text-white bg-gradient-to-r from-dark via-blue-900 to-dark hover:bg-gradient-to-br 
                focus:ring-2 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-sm shadow-green-500/50 dark:shadow-sm dark:shadow-blue-800/80 font-medium rounded-lg text-xs md:text-sm px-3 md:px-4 py-1 md:py-2 text-center"
                StatusBtn="inline-flex items-center justify-center h-9 px-3 mr-6 font-medium tracking-wide text-white transition 
                duration-200 rounded-md bg-gradient-to-r from-black via-gray-800 to-gray-900 
                 rounded-full text-sm font-semibold px-5 border mt-[-2rem] mb-3"
              />
              <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold tracking-tight text-white sm:text-4xl sm:leading-none">
                welcome to {`${decoded.user.role} Home`}
              </h2>
              <p className="max-w-xl mb-4 text-base text-gray-200 md:text-lg">
                {checkOut
                  ? "Today you already checked Out! See you tomorrow."
                  : checkIn
                  ? "Hello there! Before you leave the office, check out here!"
                  : "Hello there! Before you start, check in here!"}
              </p>
            </div>
          </div>
          <div className="relative w-full h-full mb-[-2rem]">
            <svg className="absolute w-full h-full text-white/90" fill="currentColor" viewBox="0 0 600 392">
              <rect x="0" y="211" width="75" height="181" rx="8" />
              <rect x="525" y="260" width="75" height="132" rx="8" />
              <rect x="105" y="83" width="75" height="309" rx="8" />
              <rect x="210" y="155" width="75" height="237" rx="8" />
              <rect x="420" y="129" width="75" height="263" rx="8" />
              <rect x="315" y="0" width="75" height="392" rx="8" />
            </svg>
            <svg className="relative w-full h-full text-black" fill="currentColor" viewBox="0 0 600 392">
              <rect x="0" y="311" width="75" height="81" rx="8" />
              <rect x="525" y="351" width="75" height="41" rx="8" />
              <rect x="105" y="176" width="75" height="216" rx="8" />
              <rect x="210" y="237" width="75" height="155" rx="8" />
              <rect x="420" y="205" width="75" height="187" rx="8" />
              <rect x="315" y="83" width="75" height="309" rx="8" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
