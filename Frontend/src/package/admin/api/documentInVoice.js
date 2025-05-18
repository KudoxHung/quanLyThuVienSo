import axiosClient from "./axiosClient";

export const documentInVoice = {
  GetDocumentInvoiceDetailById: async (id) => {
    return await axiosClient.get(
      "/DocumentInvoice/GetDocumentInvoiceDetailById?Id=" + id,
    );
  },
  EditNoteContentDocumentInvoiceDetailById: async (data) => {
    return await axiosClient.post(
      "/DocumentInvoice/EditNoteContentDocumentInvoiceDetailById",
      data,
    );
  },
  create: async (data) => {
    return await axiosClient.post(
      "/DocumentInvoice/InsertDocumentInvoice",
      data,
    );
  },

  getAll: async (pageNumber = 0, pageSize = 0) => {
    return await axiosClient.get(
      `/DocumentInvoice/GetDocumentInvoice?pageNumber=${pageNumber}&pageSize=${pageSize}`,
    );
  },
  GetListDocumentInvoiceManyParam: async (documentInvoice) => {
    return await axiosClient.post("/DocumentInvoice/GetDocumentInvoice", {
      ...documentInvoice,
    });
  },
  GetListDocumentInvoiceManyParamTest: async (documentInvoice) => {
    return await axiosClient.post("/DocumentInvoice/GetDocumentInvoiceTest", {
      ...documentInvoice,
    });
  },
  getById: async (id) => {
    return await axiosClient.get(
      "/DocumentInvoice/GetDocumentInvoiceById?id=" + id,
    );
  },
  update: async (data) => {
    return await axiosClient.post(
      "/DocumentInvoice/UpdateDocumentInvoice",
      data,
    );
  },
  changeStatus: async (id, status) => {
    //status: 1: đã trả, 0: đang mượn, 2: Trễ hạn, 3: đã mất
    return await axiosClient.post(
      `/DocumentInvoice/ChangeStatusDocumentInvoice?id=${id}&status=${status}`,
    );
  },
  GetBookAndIndividualNotBorrow: async (id) => {
    return await axiosClient.get(
      `/Book/GetBookAndIndividualNotBorrow?id=${id}`,
    );
  },
  GetListBorrowLate: async (fromDate, todate) => {
    if (fromDate !== "Invalid date" && todate !== "Invalid date") {
      return await axiosClient.get(
        `/DocumentInvoice/GetListBorrowLate?fromDate=${fromDate}&todate=${todate}`,
      );
    } else {
      return await axiosClient.get(`/DocumentInvoice/GetListBorrowLate`);
    }
  },
  ExtendTheExpireDateDocumentInvoiceVer2: async ({ date, listId }) => {
    return await axiosClient.put(
      `/DocumentInvoice/ExtendTheExpireDateDocumentInvoiceVer2?date=${date}`,
      listId,
    );
  },
  ChangeStatusDocumentInvoiceVer2: async ({ status, listId }) => {
    return await axiosClient.put(
      `/DocumentInvoice/ChangeStatusDocumentInvoiceVer2?status=${status}`,
      listId,
    );
  },
};
