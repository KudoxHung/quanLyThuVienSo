import axiosClient from "./axiosClient";

export const categoryColor = {
  getAll: async (pageNumber, pageSize) => {
    return await axiosClient.get(
      `/v1/CatagoryColor/GetAllListCategoryColor?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
  },
  getAllNotPagination: async () => {
    return await axiosClient.get(`/v1/CatagoryColor/GetAllListCategoryColorNotPagination`);
  },
  getById: async (idCategoryNationality) => {
    return await axiosClient.get(
      `/v1/CatagoryColor/getCategoryColorById?idCategoryNationality=${idCategoryNationality}`
    );
  },
  insert: async (categoryColor) => {
    return await axiosClient.post(`/v1/CatagoryColor/insertCategoryColor`, categoryColor);
  },
  delete: async (categoryColor) => {
    return await axiosClient.post(`/v1/CatagoryColor/deleteCategoryColorById`, categoryColor);
  },
  update: async (categoryColor) => {
    return await axiosClient.post(`/v1/CatagoryColor/updateCategoryColor`, categoryColor);
  }
};
