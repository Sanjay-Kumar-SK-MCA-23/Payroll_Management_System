import { useState, useEffect } from "react";
import { instance as axios } from "../../utils/axiosConfig";

import { isEmailValid, isPasswordValid } from "../../utils/patternVerify";

import { X } from "lucide-react";

import { toast } from "react-hot-toast";
import BackgroundLayout from "../../Common/Pages/background";
import { CustomButton } from "../../Common/Pages/buttons";

export const EmployeeRegisterPage = () => {
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "",
    mobileNo: "",
    jobType: "",
    salary: 0,
    address: "",
    pinCode: "",
    image: null,
    joinDate: "",
  });

  const [jobData, setJobData] = useState([]);
  const [otp, setOtp] = useState("");
  const [serverOtp, setServerOtp] = useState("");
  const [next, setNext] = useState(false);
  const [check, setCheck] = useState({
    emailCheck: false,
    otpSented: false,
    otpVerified: false,
  });

  const token = localStorage.getItem("token");
  const [showImageInput, setShowImageInput] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get(`/getJobDetails`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        setJobData(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    }
    fetchData();
  }, [token]);

  useEffect(() => {
    if (check.otpSented && otp.length === 6 && !check.otpVerified) {
      if (Number(otp) === Number(serverOtp)) {
        toast.success("OTP verified successfully");
        setCheck((prev) => {
          return { ...prev, otpVerified: true };
        });
      } else {
        toast.error("Invalid OTP. Please try again.");
      }
    }
  }, [check.otpSented, check.otpVerified, otp, serverOtp]);

  const handleVerifyEmail = async (e) => {
    e.preventDefault();

    try {
      if (!data.email || !isEmailValid(data.email)) {
        toast.error("Please enter a valid email address");
        return;
      }
      setCheck({ ...check, emailCheck: true });
      toast.loading("Please wait..."); // Add loading toast here

      const response = await axios.post(`/otp`, {
        email: data.email,
        page: "Register",
      });

      toast.dismiss(); // Dismiss loading toast
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
  console.log(serverOtp);
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!data.email || !isEmailValid(data.email)) {
        toast.error("Please enter a valid email address");
        return;
      } else if (!isPasswordValid(data.password).success) {
        const validationResult = isPasswordValid(data.password);
        toast.error(validationResult.message);
        return;
      }
      if (!check.otpVerified) {
        toast.error("Please verify email");
        return;
      }

      toast.loading("Please wait..."); // Add loading toast here

      const formData = new FormData();
      formData.append("firstName", data.firstName);
      formData.append("lastName", data.lastName);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("role", data.role);
      formData.append("mobileNo", data.mobileNo);
      formData.append("jobType", data.jobType);
      formData.append("salary", data.salary);
      formData.append("address", data.address);
      formData.append("pinCode", data.pinCode);
      formData.append("joinDate", data.joinDate);

      // Check if an image is uploaded before appending it to formData
      if (data.image) {
        formData.append("image", data.image, `${data.email}.jpg`);
      }
      const response = await axios.post(`/employeeRegister`, formData, {
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data", // Change this line
          Authorization: `Bearer ${token}`,
        },
      });

      toast.dismiss(); // Dismiss loading toast
      if (response.data.success) {
        toast.success(response.data.message);
        setData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          role: "",
          mobileNo: "",
          jobType: "",
          salary: 0,
          address: "",
          pinCode: "",
          image: null,
          joinDate: "",
        });
        setShowImageInput(false);
        setCheck({
          emailCheck: false,
          otpSented: false,
          otpVerified: false,
        });
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setData({ ...data, image: file });
    setShowImageInput(true);
  };
  const removeImage = () => {
    setData({ ...data, image: null });
    setShowImageInput(false);
  };
  return (
    <BackgroundLayout>
      <div className="relative px-4 py-16 mx-auto overflow-hidden sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24  lg:px-6 lg:py-16">
        <div className={`flex flex-col items-center justify-between ${check.otpVerified ? "" : "mt-10"} xl:flex-row`}>
          <div className="w-2/4 max-w-xl mb-10 xl:mb-0 xl:pr-14  xl:w-3/4">
            <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold tracking-tight text-white sm:text-4xl sm:leading-none">
              Secure Registration
            </h2>
            <p className="max-w-xl mb-4 text-base text-gray-200 md:text-lg">
              Register with confidence! Your data is our top priority. We use state-of-the-art encryption to ensure the
              safety and security of your information.
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
              <a href="mailto:balavigneshmani13@gmail.com" className="ml-2 font-semibold text-white hover:text-white">
                support@payroll.com
              </a>
            </div>
          </div>
          <div className="md:w-[130%]  max-w-screen-xl   xl:w-8/10 ">
            <div className="bg-white rounded shadow-2xl p-6 sm:p-10 mt-4 ">
              <h3 className="mb-4 text-xl font-semibold sm:text-center sm:mb-6 sm:text-2xl">Employee Registeration</h3>
              {check.otpVerified ? null : (
                <form onSubmit={(e) => handleVerifyEmail(e)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="inline-block mb-1 font-medium">
                      E-mail
                    </label>
                    <input
                      placeholder="john.doe@example.org"
                      required
                      type="text"
                      className="w-full h-10 px-4 mb-4 transition duration-200 bg-white border border-gray-300 rounded shadow-sm appearance-none focus:border-black focus:outline-none focus:shadow-outline"
                      id="email"
                      name="email"
                      value={data.email}
                      disabled={check.otpVerified}
                      onChange={(e) => setData({ ...data, email: e.target.value })}
                    />
                  </div>

                  <CustomButton onClick={(e) => handleVerifyEmail(e)} className="mt-7 " name="Send Otp" />
                </form>
              )}
              <form className="grid grid-cols-1 md:grid-cols-2  gap-6">
                {check.otpSented && !check.otpVerified ? (
                  <div>
                    <label htmlFor="otp" className="inline-block mb-1 mt-2 font-medium">
                      Verify OTP
                    </label>
                    <input
                      placeholder="Enter OTP"
                      required
                      type="number"
                      className="w-full h-10 px-4 mb-4 transition duration-200 bg-white border border-gray-300 rounded shadow-sm appearance-none focus:border-black focus:outline-none focus:shadow-outline"
                      id="otp"
                      name="otp"
                      maxLength={6}
                      minLength={6}
                      min={0}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                    />
                  </div>
                ) : null}

                {check.otpVerified ? (
                  <>
                    {!next && (
                      <>
                        <div>
                          <label htmlFor="firstName" className="inline-block  mb-1 font-medium">
                            First Name
                          </label>
                          <input
                            placeholder="paul"
                            required
                            type="text"
                            className="w-full h-9  px-4 mb-0 transition duration-200 bg-white border border-gray-300 rounded shadow-sm appearance-none focus:border-black focus:outline-none focus:shadow-outline"
                            id="firstName"
                            name="firstName"
                            value={data.firstName}
                            onChange={(e) => setData({ ...data, firstName: e.target.value })}
                          />
                        </div>
                        <div>
                          <label htmlFor="lastName" className="inline-block mb-1 font-medium">
                            Last Name
                          </label>
                          <input
                            placeholder="Walker"
                            required
                            type="text"
                            className="w-full h-9 px-4 mb-0 transition duration-200 bg-white border border-gray-300 rounded shadow-sm appearance-none focus:border-black focus:outline-none focus:shadow-outline"
                            id="lastName"
                            name="lastName"
                            value={data.lastName}
                            onChange={(e) => setData({ ...data, lastName: e.target.value })}
                          />
                        </div>

                        <div>
                          <label htmlFor="address" className="inline-block mb-1 font-medium">
                            Address
                          </label>
                          <textarea
                            placeholder="Enter address"
                            required
                            className="w-full min-h-16 max-h-20 px-4 py-2 mb-0 transition duration-200 bg-white border border-gray-300 rounded shadow-sm appearance-none focus:border-black focus:outline-none focus:shadow-outline"
                            id="address"
                            name="address"
                            value={data.address}
                            onChange={(e) => setData({ ...data, address: e.target.value })}
                          ></textarea>
                        </div>
                        <div>
                          <label htmlFor="image" className="inline-block mb-1 font-medium">
                            Image Upload
                          </label>
                          {showImageInput ? null : (
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              placeholder="You can't touch this"
                              className="w-full cursor-pointer rounded-md border border-stroke dark:border-dark-3 text-dark-6 outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke dark:file:border-dark-3 file:bg-gray-2 dark:file:bg-light-3 file:py-3 file:px-5 file:text-body-color dark:file:text-dark-6 file:hover:bg-primary file:hover:bg-opacity-30 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2"
                            />
                          )}
                          {data.image && (
                            <div className="relative">
                              <img
                                src={URL.createObjectURL(data.image)}
                                className="float-left w-24 h-24 rounded-full"
                                alt="avatar"
                              />
                              <button
                                onClick={removeImage}
                                className="absolute top-0  rounded-lg bg-transparent float-right  border-none cursor-pointer transition duration-300 hover:bg-red-500 z-10 transform translate-x-2/3 -translate-y-1/3"
                              >
                                <X className="h-6 w-6" aria-hidden="true" />
                              </button>
                            </div>
                          )}
                        </div>
                        <div>
                          <label htmlFor="pincode" className="inline-block mb-0 font-medium">
                            Pin Code
                          </label>
                          <input
                            placeholder="Enter your pincode"
                            required
                            type="Number"
                            className="w-full h-9 px-4 mb-2 transition duration-200 bg-white border border-gray-300 rounded shadow-sm appearance-none focus:border-black focus:outline-none focus:shadow-outline"
                            id="pincode"
                            name="pincode"
                            value={data.pinCode}
                            min={0}
                            onChange={(e) => setData({ ...data, pinCode: e.target.value })}
                          />
                        </div>
                        <CustomButton onClick={(e) => setNext(true)} className="mt-6 " name="Next" />
                      </>
                    )}
                    {next && (
                      <>
                        <div>
                          <label htmlFor="mobileNo" className="inline-block mb-1 font-medium">
                            Mobile Number
                          </label>
                          <input
                            placeholder="Enter mobile number"
                            required
                            type="tel"
                            className="w-full h-9 px-4 mb-0 transition duration-200 bg-white border border-gray-300 rounded shadow-sm appearance-none focus:border-black focus:outline-none focus:shadow-outline"
                            id="mobileNo"
                            name="mobileNo"
                            value={data.mobileNo}
                            onChange={(e) => setData({ ...data, mobileNo: e.target.value })}
                          />
                        </div>
                        <div>
                          <label htmlFor="role" className="inline-block mb-1 font-medium">
                            Role ▼
                          </label>
                          <select
                            required
                            className="w-full h-9 px-4 mb-0 transition duration-200 bg-white border border-gray-300 rounded shadow-sm appearance-none focus:border-black focus:outline-none focus:shadow-outline"
                            id="role"
                            name="role"
                            value={data.role}
                            onChange={(e) => setData({ ...data, role: e.target.value })}
                          >
                            <option value="">Select role</option>
                            <option value="Admin">Admin</option>
                            <option value="Employee">Employee</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor="jobType" className="inline-block mb-1 font-medium">
                            Job Type ▼
                          </label>
                          <select
                            required
                            className="w-full h-9 px-4 mb-0 transition duration-200 bg-white border border-gray-300 rounded shadow-sm appearance-none focus:border-black focus:outline-none focus:shadow-outline"
                            id="jobType"
                            name="jobType"
                            value={data.jobType}
                            onChange={(e) => {
                              const selectedOption = e.target.options[e.target.selectedIndex];
                              setData({
                                ...data,
                                jobType: e.target.value,
                                salary: selectedOption.getAttribute("salary"),
                              });
                            }}
                          >
                            <option value="" salary="0">
                              Select job type
                            </option>
                            {jobData.map((item) => (
                              <option key={item._id} value={item.jobTitle} salary={item.salary}>
                                {item.jobTitle}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label htmlFor="salary" className="inline-block mb-1 font-medium">
                            Salary
                          </label>
                          <input
                            placeholder="Enter salary"
                            required
                            type="number"
                            className="w-full h-9 px-4 mb-0 transition duration-200 bg-white border border-gray-300 rounded shadow-sm appearance-none focus:border-black focus:outline-none focus:shadow-outline"
                            id="salary"
                            name="salary"
                            min={0}
                            value={data.salary}
                            onChange={(e) => setData({ ...data, salary: e.target.value })}
                          />
                        </div>
                        <div>
                          <label htmlFor="joinDate" className="inline-block mb-1 font-medium">
                            Join Date
                          </label>
                          <input
                            type="date"
                            required
                            className="w-full h-9 px-4 mb-0 transition duration-200 bg-white border border-gray-300 rounded shadow-sm appearance-none focus:border-black focus:outline-none focus:shadow-outline"
                            id="joinDate"
                            name="joinDate"
                            value={data.joinDate}
                            onChange={(e) => setData({ ...data, joinDate: e.target.value })}
                          />
                        </div>
                        <div>
                          <label htmlFor="password" className="inline-block mb-1 font-medium">
                            Password
                          </label>
                          <input
                            placeholder="Enter your password"
                            required
                            type="password"
                            className="w-full h-9 px-4 mb-0 transition duration-200 bg-white border border-gray-300 rounded shadow-sm appearance-none focus:border-black focus:outline-none focus:shadow-outline"
                            id="password"
                            name="password"
                            value={data.password}
                            onChange={(e) => setData({ ...data, password: e.target.value })}
                          />
                        </div>
                        <CustomButton onClick={() => setNext(false)} name="back" />
                        <CustomButton
                          onClick={(e) => handleSubmit(e)}
                          name="Register"
                          type="submit"
                          className="bg-black"
                          disabled={!Object.values(data).every((value) => value)}
                        />
                      </>
                    )}
                  </>
                ) : null}
              </form>
            </div>
          </div>
        </div>
      </div>

      
    </BackgroundLayout>
  );
};
