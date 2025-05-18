import axiosClient from "./axiosClient";

export const schoolYear = {
  getAll: async (pageSize, pageNumber) => {
    return await axiosClient.get(`/SchoolYear/GetAllSchoolYear?pageSize=${pageSize}&pageNumber=${pageNumber}`);
  },
  create: async (restDay) => {
    return await axiosClient.post("/SchoolYear/InsertSchoolYear", restDay);
  },
  update: async (restDay) => {
    return await axiosClient.post("/SchoolYear/UpdateSchoolDay", restDay);
  },
  delete: async (id) => {
    return await axiosClient.post(`/SchoolYear/DeleteSchoolDay?id=${id}`);
  },
  getById: async (id) => {
    return await axiosClient.get(`/SchoolYear/GetSchoolYearById?id=${id}`);
  },
  active: async (id, isActive) => {
    return await axiosClient.post(`/SchoolYear/ActiveSchoolYear?id=${id}&IsActive=${isActive}`);
  }
};
