import { getToken } from "./decryptToken";
import { instance as axios } from "./axiosConfig";

export const salaryArrayValues = [
  5000, 15000, 25000, 35000, 45000, 55000, 65000, 75000, 85000, 95000, 105000, 115000, 125000, 135000, 145000, 155000,
  165000, 175000, 185000, 195000, 205000, 215000, 225000, 235000, 245000, 255000, 265000, 275000, 285000, 295000,
  305000, 315000, 325000, 335000, 345000, 355000, 365000, 375000, 385000, 395000, 405000, 415000, 425000, 435000,
  445000, 455000, 465000, 475000, 485000, 495000, 505000, 515000, 525000, 535000, 545000, 555000, 565000, 575000,
  585000, 595000, 605000,
];

export const fetchEmpData = async () => {
  try {
    let response = await axios.post(
      `/employeeDetails`,
      {},
      {
        headers: {
          Authorization: `Bearer ${getToken}`,
        },
      }
    );
    if (response.data.success) {
      return response.data.data;
    }
  } catch (err) {}
};
