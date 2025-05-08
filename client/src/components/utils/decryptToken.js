import { jwtDecode } from "jwt-decode";

export const getToken = localStorage.getItem("token");

export const decodeTokenRole = async () => {
  let userRole;

  if (getToken) {
    const decoded = await jwtDecode(getToken);
    userRole = decoded.user.role;
  }

  return userRole;
};

export const decodeTokenId = async () => {
  let userId;

  if (getToken) {
    const decoded = await jwtDecode(getToken);
    userId = decoded.user._id;
  }

  return userId;
};



 