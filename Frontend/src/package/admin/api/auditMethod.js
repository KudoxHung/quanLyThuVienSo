import axiosClient from "./axiosClient";

export const auditMethod = {
  GetAllAuditMethod: (pageSize, pageNumber) => {
    const url = `/AuditMethod/GetAllAuditMethod?pageSize=${pageSize}&pageNumber=${pageNumber}`;
    return axiosClient.get(url);
  },
};
