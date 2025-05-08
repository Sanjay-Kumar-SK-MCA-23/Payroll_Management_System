import { useEffect, useState } from "react";
import { getToken } from "../../../../utils/decryptToken";
import { instance as axios } from "../../../../utils/axiosConfig";

import { CustomButton } from "../../../../Common/Pages/buttons";
import toast from "react-hot-toast";

import { X } from "lucide-react";

export const EmployeeEditForm = ({ employeeData, back }) => {
  const [employee, setEmployee] = useState({ ...employeeData });
  const [jobData, setJobData] = useState([]);
  const [image, setImage] = useState(null);
  const [showImageInput, setShowImageInput] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        toast.loading("Please wait..."); 
        const response = await axios.get(`/getJobDetails`, {
          headers: {
            Authorization: `Bearer ${getToken}`,
          },
        });
          toast.dismiss(); 
        if (response.data.success) {
          setJobData(response.data.data);
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

    fetchData();
  }, []);

  const handleUpdate = async (id) => {
    try {
      toast.loading("Updating employee...");

      const updatedEmployeeData = { ...employee }; // Create a copy of the employee data

      // Add modified fields to the form data
      const formData = new FormData();
      for (const key in updatedEmployeeData) {
        if (updatedEmployeeData.hasOwnProperty(key) && updatedEmployeeData[key] !== employeeData[key]) {
          formData.append(key, updatedEmployeeData[key]);
        }
      }

      // Check if a new image is uploaded
      if (image) {
        formData.append("image", image, `${employee.email}.jpg`);
      }

      const response = await axios.put(`/updateEmployeeDetail/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${getToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.dismiss(); // Dismiss loading toast
      if (response.data.success) {
        setEmployee({});
        setImage(null); // Reset image state after update
        toast.success(response.data.message);
        back();
      }
    } catch (err) {
      toast.dismiss();
      toast.error(err.response ? err.response.data.message : "Error updating employee. Please try again later.");
    }
    // Dismiss loading toast on error
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setShowImageInput(true);
  };
  const removeImage = () => {
    setImage(null);
    setShowImageInput(false);
  };
  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold text-center my-4">Employee Update</h1>
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
          <label className="font-semibold">Role:</label>
          <select
            value={employee.role}
            onChange={(e) => setEmployee({ ...employee, role: e.target.value })}
            className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-black w-full"
          >
            <option value="Admin">Admin</option>
            <option value="Employee">Employee</option>
          </select>
        </div>
        <div>
          <label className="font-semibold">Job Type:</label>
          <select
            value={employee.jobType}
            onChange={(e) => {
              const selectedOption = e.target.options[e.target.selectedIndex];
              setEmployee({
                ...employee,
                jobType: e.target.value,
                salary: selectedOption.getAttribute("salary"),
              });
            }}
            className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-black w-full"
          >
            <option value="" salary="0">
              Select Job Type
            </option>
            {jobData.map((job) => (
              <option value={job.jobTitle} salary={job.salary} key={job._id}>
                {job.jobTitle}
              </option>
            ))}
          </select>
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
          <label className="font-semibold">Salary:</label>
          <input
            type="number"
            value={employee.salary}
            onChange={(e) => setEmployee({ ...employee, salary: e.target.value })}
            className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-black w-full"
          />
        </div>

        <div>
          <label className="font-semibold">Join Date:</label>
          <input
            type="date"
            value={employee.joinDate}
            onChange={(e) => setEmployee({ ...employee, joinDate: e.target.value })}
            className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-black w-full"
          />
        </div>
        <div>
          <label className="font-semibold">Termination Date:</label>
          <input
            type="date"
            value={employee.terminationDate}
            onChange={(e) => setEmployee({ ...employee, terminationDate: e.target.value })}
            className="border border-gray-300 rounded px-2 h-9 py-1 mb-0 focus:outline-none focus:border-black w-full"
          />
        </div>
        <div>
          <label htmlFor="image" className="font-semibold">
            Image Upload:
          </label>
          {showImageInput ? null : (
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              placeholder="You can't touch this"
              className="w-full cursor-pointer rounded-md border h-9 border-stroke dark:border-dark-3 text-dark-6 outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke dark:file:border-dark-3 file:bg-gray-2 dark:file:bg-light-3 file:py-3 file:px-5 file:text-body-color dark:file:text-dark-6 file:hover:bg-primary file:hover:bg-opacity-30 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-gray-2"
            />
          )}
          {image && (
            <div className="relative">
              <img
                src={URL.createObjectURL(image)}
                className="float-left ml-16 border-2 rounded-full w-14 h-14 "
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
          <label className="font-semibold">Address:</label>

          <textarea
            placeholder="Enter address"
            required
            className="w-full sm:min-h-9  sm:max-h-[5rem]   px-4 py-2 mb-2 transition duration-200 bg-white border border-gray-300 rounded shadow-sm appearance-none focus:border-black focus:outline-none focus:shadow-outline"
            id="address"
            name="address"
            value={employee.address}
            onChange={(e) => setEmployee({ ...employee, address: e.target.value })}
          ></textarea>
        </div>
      </div>
      <CustomButton name="back" className=" float-left" onClick={back} />
      <CustomButton
        onClick={() => handleUpdate(employee._id)}
        className="float-right top-2"
        name="Submit"
        type="submit"
      />
    </div>
  );
};
