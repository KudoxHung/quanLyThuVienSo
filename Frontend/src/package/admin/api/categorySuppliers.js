import axiosClient from "./axiosClient";

export const categorySuppliers = {
  getAll: async () => {
    return await axiosClient.get("/CategorySuppliers/NotPagination");
  },
  getById: async (id) => {
    return await axiosClient.get(`/CategorySuppliers/${id}`);
  },
  create: async (categorySupplier) => {
    return await axiosClient.post("/CategorySuppliers", categorySupplier);
  },
  update: async (id, categorySupplier) => {
    return await axiosClient.put(`/CategorySuppliers/${id}`, categorySupplier);
  },
  delete: async (id) => {
    return await axiosClient.delete(`/CategorySuppliers/${id}`);
  },
};
