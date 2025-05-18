import axiosClient from "./axiosClient";

export const categorySign = {
  getAll: async () => {
    return await axiosClient.get(`/categorysign/getAllCategorySign`);
  },
  getById: async (id) => {
    return await axiosClient.get(`/categorysign/getCategorySignById?id=${id}`);
  },
  create: async (categorySign) => {
    return await axiosClient.post(`/CategorySign/InsertCategory`, categorySign);
  },
  update: async (categorySign) => {
    return await axiosClient.post(
      `/CategorySign/UpdateCategorySign`,
      categorySign,
    );
  },
  delete: async (id) => {
    return await axiosClient.post(`/CategorySign/DeleteCategoryByID?id=${id}`);
  },
  hided: async (id, isHide) => {
    return await axiosClient.post(
      `/CategorySign/HideCategoryById?id=${id}&&check=${isHide}`,
    );
  },
  GetFileExcelCategorySign: async () => {
    return await axiosClient.get(`/CategorySign/GetFileExcelCategorySign`, {
      responseType: "blob",
    });
  },
  InsertCategorySignByExcel: async () => {
    return await axiosClient.post(`/CategorySign/InsertCategorySignByExcel`);
  },
  CategorySignByDocument: async (id) => {
    return await axiosClient.get(
      `/CategorySign/CategorySignByDocument?idDocument=${id}`,
    );
  },
};
