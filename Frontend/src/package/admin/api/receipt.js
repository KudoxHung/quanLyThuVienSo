import axiosClient from "./axiosClient";

export const receipt = {
  create: async (data) => {
    return await axiosClient.post("/Receipt/InsertReceipt", data);
  },
  InsertReceiptExportBooks: async (data) => {
    return await axiosClient.post("/Receipt/InsertReceiptExportBooks", data);
  },
  getById: async (id) => {
    return await axiosClient.get(`/Receipt/GetReceiptById?id=${id}`);
  },
  GetReceiptExportBooksById: async (id) => {
    return await axiosClient.get(`/Receipt/GetReceiptExportBooksById?id=${id}`);
  },
  delete: async (id) => {
    return await axiosClient.post(`/Receipt/DeleteReceiptById?id=${id}`);
  },
  getAll: async () => {
    return await axiosClient.get("/Receipt/GetAllReceipt");
  },
  GetListReceiptManyParam: async (data) => {
    return await axiosClient.post("/Receipt/GetListReceipt", data);
  },
  GetListReceiptExportManyParam: async (data) => {
    return await axiosClient.post("/Receipt/GetListReceiptExport", data);
  },
  GetListOriginal: async () => {
    return await axiosClient.get("/Receipt/GetListOriginal");
  },
  GetListBookStatus: async () => {
    return await axiosClient.get("/Receipt/GetListBookStatus");
  },
  UpdateReceipt: async (data) => {
    return await axiosClient.post("/Receipt/UpdateReceipt", data);
  },
  UpdateReceiptExportBooks: async (data) => {
    return await axiosClient.post("/Receipt/UpdateReceiptExportBooks", data);
  },
  exportBooksToWord: async (id, type) => {
    return await axiosClient.get(
      `/Receipt/ExportBooksToWord?id=${id}&typeExport=${type}`,
      {
        responseType: "blob",
      },
    );
  },
  GetListBookToReceiptExportBooks: (
    filter,
    IdDocumentType,
    pageSize,
    pageNumber,
  ) => {
    const url = `/Receipt/GetListBookToReceiptExportBooks?filter=${filter}&IdDocumentType=${IdDocumentType}&pageSize=${pageSize}&pageNumber=${pageNumber}`;
    return axiosClient.get(url);
  },
  ConfirmExportBooks: async (id) => {
    return await axiosClient.get(`/Receipt/ConfirmExportBooks?idReceipt=${id}`);
  },
};
