import axiosClient from "./axiosClient";

export const categoryUnits = {
  getAll: async () => {
    return await axiosClient.get(`/ContactAndIntroduction/ListUnitNotPagination`);
  },
  create: async (categoryUnit) => {
    return await axiosClient.post(`/Unit/InsertUnit`, categoryUnit);
  },
  update: async (categoryUnit) => {
    return await axiosClient.post(`/Unit/UpdateUnit`, categoryUnit);
  },
  delete: async (id) => {
    return await axiosClient.post(`/Unit/DeleteUnit?Id=${id}`);
  },
  getById: async (id) => {
    return await axiosClient.get(`/ContactAndIntroduction/LoadUnitByID?Id=${id}`);
  }
};
