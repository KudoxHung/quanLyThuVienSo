import axiosClient from "./axiosClient";

export const categorySignParents = {
  readAll: async () => {
    return await axiosClient.get(`/CategorySignParents/GetCategorySignParentWithPage`);
  },
  readById: async (id) => {
    return await axiosClient.get(`/CategorySignParents/GetCategorySignParentById?id=${id}`);
  },
  create: async (categorySign) => {
    return await axiosClient.post(`/CategorySignParents/InsertCategoryParent`, categorySign);
  },
  update: async (categorySign) => {
    return await axiosClient.post(`/CategorySignParents/UpdateCategorySignParent`, categorySign);
  },
  delete: async (id) => {
    return await axiosClient.post(`/CategorySignParents/DeleteCategorySignParentByID?id=${id}`);
  },
  GetFileExcelCategorySign: async () => {
    return await axiosClient.get(`/CategorySign_V1/GetFileExcelCategorySign`, {
      responseType: "blob"
    });
  },
  hided: async (id, check) => {
    return await axiosClient.post(`/CategorySignParents/HideCategoryParentById?id=${id}&check=${check}`);
  }
};
