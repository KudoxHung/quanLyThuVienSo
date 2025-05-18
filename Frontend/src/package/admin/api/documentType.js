import axiosClient from "./axiosClient";

export const documentType = {
  getAll: async (pageSize, pageNumber) => {
    return axiosClient.get(`/DocumentType/GetAllDocumentType?pageSize=${pageSize}&pageNumber=${pageNumber}`);
  },
  getAllNotPage: async (status = 1) => {
    //status = 1 is books, status = 2 is magazines
    return await axiosClient.get(`/DocumentType/GetAllTypeNotPage?status=${status}`);
  },
  getById: async (id) => {
    return await axiosClient.get(`/DocumentType/GetDocumentTypeById?id=${id}`);
  },
  getDocumentById: async (id) => {
    return await axiosClient.get(`/DocumentType/GetDocumentById?id=${id}`);
  },
  getParentId: async (id) => {
    return await axiosClient.get(`/DocumentType/GetAllDocumentTypeByParentId?id=${id}`);
  },
  create: async (documentType) => {
    return await axiosClient.post(`/DocumentType/InsertDocumentType`, documentType);
  },
  update: async (documentType) => {
    return await axiosClient.post(`/DocumentType/UpdateDocumentType`, documentType);
  },
  delete: async (id) => {
    return await axiosClient.post(`/DocumentType/DeleteDocumentType?id=${id}`);
  },
  checkParent: async (id) => {
    return await axiosClient.post(`/DocumentType/CheckParent?id=${id}`);
  }
};
