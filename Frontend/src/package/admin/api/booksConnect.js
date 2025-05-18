import axiosClient from "./axiosClientConnect";

export const books = {
  getAll: async (pageSize, pageNumber, DocumentType = 1) => {
    //DocumentType = 1 => Books
    //DocumentType = 2 => newspaper, magazine
    return await axiosClient.get(
      `/Book/GetBookAdminSite?pageSize=${pageSize}&pageNumber=${pageNumber}&DocumentType=${DocumentType}`
    );
  },
  GetListDocumentManyParam: async (books) => {
    return await axiosClient.post(`/Book/GetListDocument`, books);
  },
  GetListDocumentManyParamConnect: async (books) => {
    return await axiosClient.post(`/Book/GetListDocumentConnect`, books);
  },
  apporeBook: async (id, isAppore) => {
    return await axiosClient.post(`/Book/ApporeBook?id=${id}&&isApprove=${isAppore}`);
  },
  delete: async (id) => {
    return await axiosClient.post(`/Book/DeleteBookByID?id=${id}`);
  },
  DeleteBookByListId: async (ListId) => {
    return await axiosClient.post(`/Book/DeleteBookByListId`, ListId);
  },
  create: async (book) => {
    return await axiosClient.post(`/Book/InsertDocument`, book, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  },
  InsertDocumentAndIndividualSample: async (book) => {
    return await axiosClient.post(`/Book/InsertDocumentAndIndividualSample`, book, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  },
  GetEncryptDocumentName: async (bookName) => {
    return await axiosClient.get(`/Book/GetEncryptDocumentName?bookName=${bookName}`);
  },
  update: async (book) => {
    return await axiosClient.post(`/Book/UpdateDocument`, book, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  },
  getById: async (id) => {
    return await axiosClient.get(`/Book/GetBookByIdAdminSite?id=${id}`);
  },
  getFilePdfSiteAdmin: async (id) => {
    return await axiosClient.get(`/Book/GetFilePdfSiteAdmin?id=${id}`);
  },
  async getBookByCategory(pageNumber, pageSize = 10, idCategory) {
    return await axiosClient.get(
      `/Book/GetBookByCategoryAdminSite?pageNumber=${pageNumber}&pageSize=${pageSize}&IdDocumentType=${idCategory}`
    );
  },
  GetFileExcelImportBook: async () => {
    return await axiosClient.get(`/Book/GetFileExcelImportBook`, {
      responseType: "blob"
    });
  },
  GetFileExcelImportBookAndIndividual: async () => {
    return await axiosClient.get(`/Book/GetFileExcelImportBookAndIndividual`, {
      responseType: "blob"
    });
  },
  GetFileExcelImportDocumentDigital: async () => {
    return await axiosClient.get(`/Book/GetFileExcelImportDocumentDigital`, {
      responseType: "blob"
    });
  },
  GetFileImageWordInsertBook: async (type) => {
    return await axiosClient.get(`/Book/GetFileImageWordInsertBook?type=${type}`, { responseType: "blob" });
  },
  InsertBookAndIndividualByExcel: async (file) => {
    return await axiosClient.post(`/Book/InsertBookAndIndividualByExcel`, file, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  },
  GetBookExistIndividualCode: async (DocumentType) => {
    return await axiosClient.get(`/Book/GetBookExistIndividualCode?DocumentType=${DocumentType}`);
  },
  GetSpineBookByMultipleDocumentType: async (DocumentType) => {
    return await axiosClient.get(`/Book/GetSpineBookByMultipleDocumentType`);
  }
};
