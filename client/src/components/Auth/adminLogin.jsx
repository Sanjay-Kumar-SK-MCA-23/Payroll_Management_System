import { instance as axios } from "../utils/axiosConfig";
import { useEffect, useState } from "react";
import { Navbar } from "../Common/Header/Navbar";
import { isEmailValid } from "../utils/patternVerify";
import { toast } from "react-hot-toast";
import { CustomButton } from "../Common/Pages/buttons";


export const AdminLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [serverOtp, setServerOtp] = useState("");
  const [check, setCheck] = useState({
    emailCheck: false,
    otpSented: false,
    otpVerifyed: false,
  });

  //======================email verification==============================
  const handleVerifyEmail = async (e) => {
    e.preventDefault();

    try {
      if (!email || !isEmailValid(email)) {
        toast.error("Please enter a valid email address");
        return;
      }
      setCheck({ ...check, emailCheck: true });
      toast.loading("please wait..");
      const response = await axios.post(`/otp`, {
        email,
        page: "Admin",
      });

      toast.dismiss();
      if (response.data.success) {
        toast.success(response.data.message);
        setServerOtp(response.data.otp);
        setCheck({ ...check, otpSented: true });
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

  //======================otp verification================================
  useEffect(() => {
    if (check.otpSented && otp.length === 6) {
      if (Number(otp) === Number(serverOtp)) {
        toast.success("OTP verified successfully");
        setCheck((prev) => {
          return { ...prev, otpVerifyed: true };
        });
      } else {
        toast.error("Invalid OTP. Please try again.");
      }
    }
  }, [check.otpSented, otp, serverOtp]);
  //======================account login===================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!email || !isEmailValid(email)) {
        toast.error("Please enter a valid email address");
        return;
      } else if (!password) {
        toast.error("Please enter password");
        return;
      }
      if (!check.otpVerifyed) {
        toast.error("Please verify email");
        return;
      }
      toast.loading("please wait..");
      const response = await axios.post(`/adminLogin`, {
        email,
        password,
      });
      toast.dismiss();
      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        window.location = "/";
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
    <div className="relative h-screen ">
      <Navbar />
      <div className="absolute inset-0">
        <div className="relative  bg-dark  h-full">
          <svg className="absolute inset-x-0 bottom-0  text-white  w-full" viewBox="0 0 1160 163">
            <path
              fill="currentColor"
              d="M-164 13L-104 39.7C-44 66 76 120 196 141C316 162 436 152 556 119.7C676 88 796 34 916 13C1036 -8 1156 2 1216 7.7L1276 13V162.5H1216C1156 162.5 1036 162.5 916 162.5C796 162.5 676 162.5 556 162.5C436 162.5 316 162.5 196 162.5C76 162.5 -44 162.5 -104 162.5H-164V13Z"
            />
          </svg>
          <div className="relative px-4 py-16 mx-auto overflow-hidden sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-18">
            <div className="flex flex-col items-center justify-between xl:flex-row">
              <div className="w-full max-w-xl mb-12 xl:mb-0 xl:pr-16 xl:w-7/12">
                <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold tracking-tight text-white sm:text-4xl sm:leading-none">
                  Payroll Management Admin Login
                </h2>
                <p className="max-w-xl mb-4 text-base text-gray-200 md:text-lg">
                  Access the payroll management system with confidence! Your financial data is our top priority. We
                  implement advanced security measures to ensure the confidentiality and integrity of your payroll
                  information.
                </p>
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M21 12.79A10 10 0 1 0 11.21 21 9.93 9.93 0 0 0 21 12.79zM12 2a1 1 0 0 0-1 1v4a1 1 0 0 0 2 0V3a1 1 0 0 0-1-1zM12 18a8 8 0 0 0 0-16V1a1 1 0 1 0-2 0v1a8 8 0 0 0 0 16v1a1 1 0 1 0 2 0v-1z"></path>
                  </svg>
                  <a
                    href="mailto:balavigneshmani13@gmail.com"
                    className="ml-2 font-semibold text-white hover:text-white"
                  >
                    payroll.support@example.com
                  </a>
                </div>
              </div>

              <div className="w-full max-w-xl xl:px-8 xl:w-5/12">
                <div className="bg-white rounded shadow-2xl p-7 sm:p-10 sm:mt-10 ">
                  {" "}
                  {/* sm:m-4 to fix height */}
                  <h3 className="mb-4 text-xl font-semibold sm:text-center sm:mb-6 sm:text-2xl">Sign In to continue</h3>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-1 sm:mb-2">
                      <label htmlFor="email" className="inline-block mb-1 font-medium">
                        E-mail
                      </label>
                      <input
                        placeholder="john.doe@example.org"
                        required
                        type="text"
                        className="flex-grow w-full h-11 px-4 mb-2 transition duration-200 bg-white border border-gray-300 rounded shadow-sm appearance-none focus:border-black focus:outline-none focus:shadow-outline"
                        id="email"
                        name="email"
                        value={email}
                        disabled={check.otpVerifyed}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="mt-4 mb-2 sm:mb-4">
                      <CustomButton
                        style={check.otpVerifyed ? { display: "none" } : { display: "block" }}
                        onClick={(e) => handleVerifyEmail(e)}
                        
                        
                      name = "send otp"
                      />
                      
                    </div>
                    <div
                      className="mb-1 sm:mb-2"
                      style={check.otpSented && !check.otpVerifyed ? { display: "block" } : { display: "none" }}
                    >
                      <label htmlFor="email" className="inline-block mb-1 font-medium">
                        Verify-otp
                      </label>
                      <input
                        placeholder="enter otp"
                        required
                        type="Number"
                        className="flex-grow w-full h-11 px-4 mb-2 transition duration-200 bg-white border border-gray-300 rounded shadow-sm appearance-none focus:border-black focus:outline-none focus:shadow-outline"
                        id="otp"
                        name="otp"
                        maxLength={6}
                        minLength={6}
                        min={0}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                      />
                    </div>
                    <div className="mb-1 sm:mb-2">
                      <label htmlFor="password" className="inline-block mb-1 font-medium">
                        Password
                      </label>
                      <input
                        placeholder="Enter your password"
                        required
                        type="password"
                        className="flex-grow w-full h-11 px-4 mb-2 transition duration-200 bg-white border border-gray-300 rounded shadow-sm appearance-none focus:border-black focus:outline-none focus:shadow-outline"
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    <div
                      className="mt-4 mb-2 sm:mb-4"
                      style={check.otpVerifyed ? { display: "block" } : { display: "none" }}
                    >
                      <CustomButton
                        type="submit"
                     
                     name ="  Sign In"
                      />
                     
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};
