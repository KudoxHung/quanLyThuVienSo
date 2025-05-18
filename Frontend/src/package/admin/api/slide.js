import axiosClient from "./axiosClient";

export const slide = {
  readAll: async () => {
    return await axiosClient.get("/Slide/GetAllSlideAdmin");
  },
  create: async (data) => {
    return await axiosClient.post("/Slide/InsertSlide", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  update: async (data) => {
    return await axiosClient.post("/Slide/UpdateSlide", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  delete: async (id) => {
    return await axiosClient.post(`/Slide/DeleteSlideByID?Id=${id}`);
  },
  hide: async (id, check) => {
    return await axiosClient.post(
      `/Slide/HideSlideById?Id=${id}&check=${check}`,
    );
  },
  readById: async (id) => {
    return await axiosClient.get(`/Slide/GetSlideById?Id=${id}`);
  },
};
