import axiosClient from "./axiosClient";

export const dashboard = {
  runProcedure: async () => {
    return await axiosClient.post(`/Dashboard/RunProcedure`);
  }
};
