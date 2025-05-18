import axiosClient from "./axiosClient";

export const document = {
  getById: async (id) => {
    return await axiosClient.get(`/Document/GetDocumentById?id=${id}`);
  }
};
