import axiosClient from "./axiosClient";

export const books = {
  async getAllBooks() {},
  async getNewBooks(pageNumber, pageSize = 10, path = "GetBookNew") {
    return await axiosClient.get(
      `Book/${path}?pageNumber=${pageNumber}&pageSize=${pageSize}`,
    );
  },
  async getMostPopularBooks(
    pageNumber,
    pageSize = 10,
    path = "GetBookByNumberView",
  ) {
    return await axiosClient.get(
      `Book/${path}?pageNumber=${pageNumber}&pageSize=${pageSize}`,
    );
  },
  async getBookById(id) {
    return await axiosClient.get(`Book/GetBookById?Id=${id}`);
  },
  async getNumberBooks() {
    return await axiosClient.get(`/Book/GetNumberBook`);
  },
  async getBooksEspecially(pageNumber, pageSize = 12, path) {
    return await axiosClient.get(
      `Book/${path}?pageNumber=${pageNumber}&pageSize=${pageSize}`,
    );
  },
  async getTypeBooks(status = 1) {
    return await axiosClient.get(
      `/DocumentType/GetAllTypeNotPage?status=${status}`,
    );
  },
  async getBookByCategory(pageNumber = 1, pageSize = 12, idCategory) {
    return await axiosClient.get(
      `Book/GetBookByCategory?pageNumber=${pageNumber}&pageSize=${pageSize}&IdDocumentType=${idCategory}`,
    );
  },
  async searchBook(pageNumber = 1, pageSize = 12, keyWord) {
    return await axiosClient.get(
      `Book/SearchBook?pageNumber=${pageNumber}&pageSize=${pageSize}&values=${keyWord}`,
    );
  },
  async getFileImage(id, extensition) {
    return await axiosClient.get(
      `Book/GetFileImage?fileNameId=${id}.${extensition}`,
    );
  },
  SuggestBook: async (keyWord) => {
    return await axiosClient.get(`/Book/SuggestBook?values=${keyWord}`);
  },
};
