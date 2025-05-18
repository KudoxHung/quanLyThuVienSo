import axiosClient from "./axiosClient";

export const holidaySchedule = {
  getRestDays: async (pageSize, pageNumber) => {
    return await axiosClient.get(
      `/RestDay/GetAllRestDay?pageSize=${pageSize}&pageNumber=${pageNumber}`,
    );
  },
  getRestDay: async (id) => {
    return await axiosClient.get(`/RestDay/GetRestDayById?id=${id}`);
  },
  create: async (restDay) => {
    return await axiosClient.post(`/RestDay/InsertRestDay`, restDay);
  },
  update: async (restDay) => {
    return await axiosClient.post(`/RestDay/UpdateRestDay`, restDay);
  },
  delete: async (id) => {
    return await axiosClient.post(`/RestDay/DeleteRestDay?id=${id}`);
  },
  active: async (id, isActive) => {
    return await axiosClient.post(
      `/RestDay/ActiveRestDay?id=${id}&isActive=${isActive}`,
    );
  },
};
