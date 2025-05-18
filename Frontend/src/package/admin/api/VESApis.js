import axiosClient from "./axiosClient";

export const VESApis = {
  InsertVES: (data) => {
    const url = `/VES/InsertVES`;
    return axiosClient.post(url, data);
  },
  UpdateVES: (data) => {
    const url = `/VES/UpdateVES`;
    return axiosClient.put(url, data);
  },
  GetAllVES: (pageSize, pageNumber) => {
    const url = `/VES/GetAllVES?pageSize=${pageSize}&pageNumber=${pageNumber}`;
    return axiosClient.get(url);
  },
  GetVESById: (IdVES) => {
    const url = `/VES/GetVESById?IdVES=${IdVES}`;
    return axiosClient.get(url);
  },
  GetAllVESAvailable: (pageNumber, pageSize) => {
    const url = `/VES/GetAllVESAvailable?pageSize=${pageSize}&pageNumber=${pageNumber}`;
    return axiosClient.get(url);
  },
  GetAllVESByIdGroup: (IdGroup) => {
    const url = `/VES/GetAllVESByIdGroup?IdGroup=${IdGroup}`;
    return axiosClient.get(url);
  },
  DeleteVESByList: (listId) => {
    const url = `/VES/DeleteVESByList`;
    return axiosClient.delete(url, { data: listId });
  },
  HideVESByList: (listId, IsHide) => {
    const url = `/VES/HideVESByList?IsHide=${IsHide}`;
    return axiosClient.put(url, listId);
  },
  UploadImage: (data) => {
    const url = `/VES/UploadImage`;
    return axiosClient.post(url, data);
  },
  GetFile: (fileName) => {
    const url = `/VES/GetFile?fileName=${fileName}`;
    return axiosClient.get(url);
  },
  GetAllVESByMediaType: (pageSize, pageNumber, ListIdMediaType) => {
    const url = `/VES/GetAllVESByMediaType?pageSize=${pageSize}&pageNumber=${pageNumber}`;
    return axiosClient.post(url, ListIdMediaType);
  },
  GetAllCategoryVesByVesVideo: (pageSize, pageNumber) => {
    const url = `/VES/GetAllCategoryVesByVesVideo?pageSize=${pageSize}&pageNumber=${pageNumber}`;
    return axiosClient.get(url);
  },
  GetAllCategoryVesByVesSound: (pageSize, pageNumber) => {
    const url = `/VES/GetAllCategoryVesByVesSound?pageSize=${pageSize}&pageNumber=${pageNumber}`;
    return axiosClient.get(url);
  }
};
