import axiosClient from "./axiosClient";
// using only update profiles users
export const usersClient = {
  getUserById: async (id) => {
    return await axiosClient.get(`/User/GetUserById/?id=${id}`);
  },
  changePassword: async (email, oldPassword, newPassword) => {
    return await axiosClient.post(
      `/User/ChangePassWord?email=${email}&oldPassword=${oldPassword}&newPassword=${newPassword}`,
    );
  },
};
export const users = {
  getUser: async () => {
    return await axiosClient.get("/User/GetUser");
  },
};
