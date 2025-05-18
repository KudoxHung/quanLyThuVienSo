import axiosClient from "./axiosClient";

export const banner = {
  readAll: async () => {
    return await axiosClient.get("/Slide/GetAllSlideClient");
  },
};
