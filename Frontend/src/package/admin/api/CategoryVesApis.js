import axiosClient from "./axiosClient";

export const CategoryVesApis = {
  InsertCategoryVes: (data) => {
    const url = `/CategoryVes/InsertCategoryVes`;
    return axiosClient.post(url, data);
  },
  UpdateCategoryVes: (data) => {
    const url = `/CategoryVes/UpdateCategoryVes`;
    return axiosClient.put(url, data);
  },
  GetAllCategoryVes: (pageSize, pageNumber) => {
    const url = `/CategoryVes/GetAllCategoryVes?pageSize=${pageSize}&pageNumber=${pageNumber}`;
    return axiosClient.get(url);
  },
  GetCategoryVesById: (IdCategoryVes) => {
    const url = `/CategoryVes/GetCategoryVesById?IdCategoryVes=${IdCategoryVes}`;
    return axiosClient.get(url);
  },
  GetAllCategoryVesAvailable: (pageNumber, pageSize) => {
    const url = `/CategoryVes/GetAllCategoryVesAvailable?pageSize=${pageSize}&pageNumber=${pageNumber}`;
    return axiosClient.get(url);
  },
  DeleteCategoryVesByList: (listId) => {
    const url = `/CategoryVes/DeleteCategoryVesByList`;
    return axiosClient.delete(url, { data: listId });
  },
  HideCategoryVesByList: (listId, IsHide) => {
    const url = `/CategoryVes/HideCategoryVesByList?IsHide=${IsHide}`;
    return axiosClient.put(url, listId);
  },
  GetAllCategoryVesByELecture: (pageSize, pageNumber) => {
    const url = `/CategoryVes/GetAllCategoryVesByELecture?pageSize=${pageSize}&pageNumber=${pageNumber}`;
    return axiosClient.get(url);
  },
  GetAllCategoryVesByVideo: (pageSize, pageNumber) => {
    const url = `/CategoryVes/GetAllCategoryVesByVideo?pageSize=${pageSize}&pageNumber=${pageNumber}`;
    return axiosClient.get(url);
  },
  GetAllCategoryVesBySound: (pageSize, pageNumber) => {
    const url = `/CategoryVes/GetAllCategoryVesBySound?pageSize=${pageSize}&pageNumber=${pageNumber}`;
    return axiosClient.get(url);
  },
};
