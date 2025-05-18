import axiosClient from "./axiosClient";
export const categoryPublishers = {
  getAll: async () => {
    return await axiosClient.get("/CategoryPublishers/NotPagination");
  },
  getById: async (id) => {
    return await axiosClient.get(`/CategoryPublishers/${id}`);
  },
  create: async (categoryPublisher) => {
    return await axiosClient.post("/CategoryPublishers", categoryPublisher);
  },
  update: async (id, categoryPublisher) => {
    return await axiosClient.put(`/CategoryPublishers/${id}`, categoryPublisher);
  },
  delete: async (id) => {
    return await axiosClient.delete(`/CategoryPublishers/${id}`);
  },
  GetFileExcelCategoryPublish: async () => {
    return await axiosClient.get(`/CategoryPublishers/GetFileExcelCategoryPublish`, { responseType: "blob" });
  },
  InsertCategoryPublish: async () => {
    return await axiosClient.post(`/CategoryPublishers/InsertCategoryPublish`);
  }
};
