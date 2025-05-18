import axiosClient from "./axiosClient";

export const documentStock = {
  getAll: async () => {
    return await axiosClient.get("/DocumentStock/GetAllStockNotPage");
  },
  getAllStock: async (pageSize, pageNumber) => {
    return await axiosClient.get(
      "/DocumentStock/GetAllStock?pageSize=" +
        pageSize +
        "&pageNumber=" +
        pageNumber,
    );
  },
  getAllDocumentStocksByParentId: async (id) => {
    return await axiosClient.get(
      `/DocumentStock/GetAllDocumentStocksByParentId?id=${id}`,
    );
  },
  create: async (documentStock) => {
    return await axiosClient.post("/DocumentStock/InsertStock", documentStock);
  },
  update: async (documentStock) => {
    return await axiosClient.post(
      "/DocumentStock/UpdateDocumentStock",
      documentStock,
    );
  },
  delete: async (id) => {
    return await axiosClient.post(
      `/DocumentStock/DeleteDocumentStock?id=${id}`,
    );
  },
  getById: async (id) => {
    return await axiosClient.get(
      `/DocumentStock/GetAllDocumentStockId?id=${id}`,
    );
  },
  GetAllDocumentStockId: async (id) => {
    return await axiosClient.get(
      `/DocumentStock/GetAllDocumentStockId?id=${id}`,
    );
  },
};
