import axiosClient from "./axiosClient";

export const CalculateFolderApis = {
  CalculateFolder: async () => {
    return await axiosClient.get("/CalculateFolder/CalculateFolder");
  },
};
