import axiosClient from "./axiosClient";

export const auth = {
  login: async (email, password) => {
    return await axiosClient.post("/User/login", { email, password });
  },
  logout: async () => {
    return await axiosClient.post("/User/Logout");
  },
  register: async (fullname, email, password) => {
    return await axiosClient.post("/User/register", {
      fullname,
      email,
      password
    });
  },
  async ActiveCode(email, code) {
    return await axiosClient.post(`/User/ActiveUserByCode?email=${email}&code=${code}`);
  },
  sendActiveCode: async (email) => {
    return await axiosClient.post(`/User/SendAgainCode?email=${email}`);
  },
  sendCodeWithEmail: async (email) => {
    return await axiosClient.post(`/User/SendCodeWithAccountActive?email=${email}`);
  },
  verifyCode: async (email, code) => {
    return await axiosClient.post(`/User/VerifyCode?email=${email}&code=${code}`);
  },
  forgotPassword: async (email, newPassword) => {
    return await axiosClient.post(`/User/ForgotPassword?email=${email}&newPassword=${newPassword}`);
  }
};
