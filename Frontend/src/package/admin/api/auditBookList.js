import axiosClient from "./axiosClient";

export const auditBookList = {
  getAllAuditBookList: (pageSize, pageNumber) => {
    const url = `/AuditBookList/GetAllAuditBookList?pageSize=${pageSize}&pageNumber=${pageNumber}`;
    return axiosClient.get(url);
  }
};
