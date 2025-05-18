import axiosClient from "./axiosClient";

export const users = {
  getVersion: async () => {
    return await axiosClient.get(`/User/getVersion`);
  },
  ChangePasswordAllUserByUnit: async (IdUnit) => {
    return await axiosClient.get(
      `/User/ChangePasswordAllUserByUnit?IdUnit=${IdUnit}`,
    );
  },
  ChangePasswordAllUserByListUser: async (ListIdUser) => {
    return await axiosClient.post(
      `/User/ChangePasswordAllUserByListUser`,
      ListIdUser,
    );
  },

  getUsers: async () => {
    return await axiosClient.get("/User/GetUser");
  },
  GetListUserManyParam: async (user) => {
    return await axiosClient.post("/User/GetListUser", { ...user });
  },
  getAllUsers: async (pageSize, pageNumber = 10) => {
    return await axiosClient.get(
      `/User/GetAllUser?pageNumber=${pageNumber}&pageSize=${pageSize}`,
    );
  },
  getAllUsersNotInDocumentInvoice: async (pageSize, pageNumber = 10) => {
    return await axiosClient.get(
      `/User/GetAllUsersNotInDocumentInvoice?pageNumber=${pageNumber}&pageSize=${pageSize}`,
    );
  },
  getAllUsersNotBlock: async (pageSize, pageNumber = 10) => {
    return await axiosClient.get(
      `/User/GetAllUserNotBlocked?pageNumber=${pageNumber}&pageSize=${pageSize}`,
    );
  },
  getUserById: async (id) => {
    return await axiosClient.get(`/User/GetUserById?Id=${id}`);
  },
  addUser: async (user) => {
    return await axiosClient.post("/User/InsertUser", user, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  removeUser: async (id) => {
    return await axiosClient.post(`/User/RemoveUser?Id=${id}`);
  },
  blockAccountUser: async (id, isLock) => {
    return await axiosClient.post(
      `/User/LockUserAccount?Id=${id}&&isLock=${isLock}`,
    );
  },
  deleteUserRole: async (id) => {
    return await axiosClient.post(`/User/DeleteUserRole?Id=${id}`);
  },
  updateUser: async (user) => {
    return await axiosClient.post(`/User/UpdateUser`, user, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  addRoleUser: async (idRole, idUser) => {
    return await axiosClient.post(`/User/AddRoleUser`, { idRole, idUser });
  },
  getAllUserType: async () => {
    return await axiosClient.get(`/User/GetAllUserType`);
  },
  getAllUserRole: async () => {
    return await axiosClient.get(`/User/GetAllRole`);
  },
  getAllUnit: async () => {
    return await axiosClient.get(`/User/GetAllUnit`);
  },
  activeUserByCode: async (email, code) => {
    return await axiosClient.post(
      `/User/ActiveUserByCode?email=${email}&code=${code}`,
    );
  },
  InsertUserByExcel: async (file) => {
    return await axiosClient.post(`/User/InsertUserByExcel`, file, {
      responseType: "blob",
    });
  },
  GetFileExcelImportExcel: async () => {
    return await axiosClient.get(`/User/GetFileExcelImportExcel`, {
      responseType: "blob",
    });
  },
  GetListRoleOfUser: async (idUser) => {
    return await axiosClient.get(`/User/GetListRoleOfUser?idUser=${idUser}`);
  },
  AddRoleUser: async (idRole, idUser) => {
    return await axiosClient.post(`/User/AddRoleUser`, { idRole, idUser });
  },
  DeleteUserRole: async (idRole, idUser) => {
    return await axiosClient.post(`/User/DeleteUserRole`, { idRole, idUser });
  },
  ForgotPassWord: async (email, newPassword) => {
    return await axiosClient.post(
      `/User/ForgotPassWord?email=${email}&newPassword=${newPassword}`,
    );
  },
  UpdateImageUsers: async (lstIdUser) => {
    return await axiosClient.post(`/User/UpdateImageUsers`, lstIdUser, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  GetFileExcelUserByIdUnit: async (idUnit) => {
    return await axiosClient.get(
      `/User/GetFileExcelUserByIdUnit?idUnit=${idUnit}`,
      { responseType: "blob" },
    );
  },
  UpdateActiveAndExpireDateUser: async (file) => {
    return await axiosClient.post(`/User/UpdateActiveAndExpireDateUser`, file, {
      responseType: "blob",
    });
  },
  UpdateUserExpireDateByUnit: async (value) => {
    return await axiosClient.post(`/User/UpdateUserExpireDateByUnit`, value);
  },
  MutiplePrintLibraryCards: async (lstIdUser) => {
    return await axiosClient.post(`/User/MutiplePrintLibraryCards`, lstIdUser);
  },
  GetAllUserByIdUnit: async (idUnit, pageSize, pageNumber) => {
    return await axiosClient.get(
      `/User/GetAllUserByIdUnit?idUnit=${idUnit}&pageSize=${pageSize}&pageNumber=${pageNumber}`,
    );
  },
  UpdateListUserByIdUnit: async (idUser, idUnit) => {
    return await axiosClient.put(`/User/UpdateListUserByIdUnit`, {
      idUser,
      idUnit,
    });
  },
};
