import axiosClient from "./axiosClient";

export const authAdmin = {
  login: async (email, password) => {
    return await axiosClient.post("/User/login", { email, password });
  },
};
