import axiosClient from "./axiosClient";

export const GroupVesApis = {
  InsertGroupVes: (data) => {
    const url = `/GroupVes/InsertGroupVes`;
    return axiosClient.post(url, data);
  },
  UpdateGroupVes: (data) => {
    const url = `/GroupVes/UpdateGroupVes`;
    return axiosClient.put(url, data);
  },
  GetAllGroupVes: (pageSize, pageNumber) => {
    const url = `/GroupVes/GetAllGroupVes?pageSize=${pageSize}&pageNumber=${pageNumber}`;
    return axiosClient.get(url);
  },
  GetGroupVesById: (IdGroupVes) => {
    const url = `/GroupVes/GetGroupVesById?IdGroupVes=${IdGroupVes}`;
    return axiosClient.get(url);
  },
  GetAllGroupVesAvailable: (pageNumber, pageSize) => {
    const url = `/GroupVes/GetAllGroupVesAvailable?pageSize=${pageSize}&pageNumber=${pageNumber}`;
    return axiosClient.get(url);
  },
  DeleteGroupVesByList: (listId) => {
    const url = `/GroupVes/DeleteGroupVesByList`;
    return axiosClient.delete(url, { data: listId });
  },
  HideGroupVesByList: (listId, IsHide) => {
    const url = `/GroupVes/HideGroupVesByList?IsHide=${IsHide}`;
    return axiosClient.put(url, listId);
  },
  GetAllGroupVesByIdcategoryVes: (pageSize, pageNumber, IdCategoryVes) => {
    const url = `/GroupVes/GetAllGroupVesByIdcategoryVes?pageSize=${pageSize}&pageNumber=${pageNumber}&IdCategoryVes=${IdCategoryVes}`;
    return axiosClient.get(url);
  },
};
