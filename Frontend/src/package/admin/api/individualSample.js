import axiosClient from "./axiosClient";

export const individualSample = {
  resetIndi: async () => {
    return await axiosClient.get(`/IndividualSample/Reset`);
  },
  getAll: async (pageSize, pageNumber) => {
    return await axiosClient.get(
      `/IndividualSample/GetAllIndividualSample?pageSize=${pageSize}&pageNumber=${pageNumber}`
    );
  },
  getById: async (id) => {
    return await axiosClient.get(`/IndividualSample/GetIndividualSampleById?Id=${id}`);
  },
  getByIdDocument: async (id) => {
    return await axiosClient.get(`/IndividualSample/GetIndividualSampleByIdDocument?Id=${id}`);
  },
  create: async (individualSample) => {
    return await axiosClient.post(`/IndividualSample/InsertIndividualSample`, individualSample);
  },
  update: async (individualSample) => {
    return await axiosClient.post(`/IndividualSample/UpdateIndividualSample`, individualSample);
  },
  delete: async (id) => {
    return await axiosClient.post(`/IndividualSample/DeleteIndividualSample?id=${id}`);
  },
  GetBookAndIndividual: async (id) => {
    return await axiosClient.get(`/Book/GetBookAndIndividual?id=${id}`);
  },
  GetIndividualSampleIsLost: async (pageNumber, pageSize) => {
    return await axiosClient.get(
      `/IndividualSample/GetAllIndividualSampleIsLost?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
  },
  changeLostPhysicalVersion: async (IdDocument, IdIndividual, isLost) => {
    return await axiosClient.post(
      `/IndividualSample/ChangeLostPhysicalVersion?IdDocument=${IdDocument}&IdIndividual=${IdIndividual}&isLost=${isLost}`
    );
  },
  GetIndividualStockNotRepeat: async (id) => {
    return await axiosClient.get(`/IndividualSample/GetIndividualStockNotRepeat?IdDocument=${id}`);
  },
  GetIndividualByDateNotRepeat: async (id) => {
    return await axiosClient.get(`/IndividualSample/GetIndividualByDateNotRepeat?IdDocument=${id}`);
  },
  GetBookAndIndividualManyParam: async (id, param) => {
    return await axiosClient.post(`/Book/GetBookAndIndividualManyParam`, {
      ...param,
      id
    });
  },
  GetSpineByIdIndividual: async (IdDocument, IdIndividual, ListIdIndividual) => {
    return await axiosClient.get(
      `/IndividualSample/GetSpineByIdIndividual?IdIndividual=${IdIndividual}&IdDocument=${IdDocument}&ListIdIndividual=${ListIdIndividual}`
    );
  },
  GetSpineByBarcode: async (barcode) => {
    return await axiosClient.get(`/IndividualSample/GetSpineByBarcode?barcode=${barcode}`);
  },
  GetSpineByListIdIndividual: async (ListIdIndividual) => {
    return await axiosClient.get(`/IndividualSample/GetSpineByListIdIndividual?ListIdIndividual=${ListIdIndividual}`);
  },
  DeleteIndividualSampleByList: async (ListIdIndividual) => {
    return await axiosClient.post(`/IndividualSample/DeleteIndividualSampleByList`, ListIdIndividual);
  },
  CheckIdIndividualExitsInDocumentInvoice: async (ListIdIndividual) => {
    return await axiosClient.post(`/IndividualSample/CheckIdIndividualExitsInDocumentInvoice`, ListIdIndividual);
  }
};
