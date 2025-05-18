import axiosClient from "./axiosClient";

export const ContactAndIntroduction = {
  create: async (contactAndIntroduction) => {
    return await axiosClient.post(
      `/ContactAndIntroduction/InsertRule`,
      contactAndIntroduction,
    );
  },
  update: async (contactAndIntroduction) => {
    return await axiosClient.post(
      `/ContactAndIntroduction/UpdateRule`,
      contactAndIntroduction,
    );
  },
  read: async (pageNumber, pageSize, type) => {
    return await axiosClient.get(
      `/ContactAndIntroduction/GetAllRules?pageNumber=${pageNumber}&pageSize=${pageSize}&type=${type}`,
    );
  },
  SaveImageIntroduction: async (image) => {
    return await axiosClient.post(
      `/ContactAndIntroduction/SaveImageIntroduction`,
      image,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
  },
};
