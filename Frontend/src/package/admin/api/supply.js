import axiosClient from "./axiosClient";

export const supply = {
  getSupply: async (pageSize, pageNumber = 10) => {
    return await axiosClient.get(
      `/Supply/GetSupply?pageNumber=${pageNumber}&pageSize=${pageSize}`,
    );
  },
};
