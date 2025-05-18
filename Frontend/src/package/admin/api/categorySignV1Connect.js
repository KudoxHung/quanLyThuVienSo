import axiosClient from "./axiosClientConnect";

export const categorySignV1 = {
  readAll: async () => {
    return await axiosClient.get(`/CategorySign_V1/GetCategorySignWithPage`);
  },
  readById: async (id) => {
    return await axiosClient.get(
      `/CategorySign_V1/GetCategorySignById?id=${id}`,
    );
  },
  create: async (categorySign) => {
    return await axiosClient.post(
      `/CategorySign_V1/InsertCategory`,
      categorySign,
    );
  },
  update: async (categorySign) => {
    return await axiosClient.post(
      `/CategorySign_V1/UpdateCategorySign`,
      categorySign,
    );
  },
  delete: async (id) => {
    return await axiosClient.post(
      `/CategorySign_V1/DeleteCategoryByID?id=${id}`,
    );
  },
  GetFileExcelCategorySign: async () => {
    return await axiosClient.get(`/CategorySign_V1/GetFileExcelCategorySign`, {
      responseType: "blob",
    });
  },
  hided: async (id, check) => {
    return await axiosClient.post(
      `/CategorySign_V1/HideCategoryById?id=${id}&check=${check}`,
    );
  },
};
