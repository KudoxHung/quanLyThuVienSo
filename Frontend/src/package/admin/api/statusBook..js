import axiosClient from "./axiosClient";

export const statusBook = {
  GetAll: (pageSize, pageNumber) => {
    const url = `/StatusBook/GetAll?pageSize=${pageSize}&pageNumber=${pageNumber}`;
    return axiosClient.get(url);
  },
  GetAllStatusBook: (pageSize, pageNumber, type) => {
    const url = `/StatusBook/GetAllStatusBook?pageSize=${pageSize}&pageNumber=${pageNumber}&type=${type}`;
    return axiosClient.get(url);
  },
  GetListStatusBook: (pageSize, pageNumber) => {
    const url = `/StatusBook/GetListStatusBook?pageSize=${pageSize}&pageNumber=${pageNumber}`;
    return axiosClient.get(url);
  },
  GetStatusBookByIdDocument: (IdDocument) => {
    const url = `/StatusBook/GetStatusBookByIdDocument?idDocument=${IdDocument}`;
    return axiosClient.get(url);
  },
  getAllNotPagination: async () => {
    return await axiosClient.get(
      `/StatusBook/GetAllListStatusBookNotPagination`,
    );
  },
  getById: async (idStatusBook) => {
    return await axiosClient.get(
      `/StatusBook/getStatusBookById?idStatusBook=${idStatusBook}`,
    );
  },
  insert: async (statusBook) => {
    return await axiosClient.post(`/StatusBook/insertStatusBook`, statusBook);
  },
  delete: async (statusBook) => {
    return await axiosClient.post(
      `/StatusBook/deleteStatusBookById`,
      statusBook,
    );
  },
  update: async (statusBook) => {
    return await axiosClient.post(`/StatusBook/updateStatusBook`, statusBook);
  },
};
