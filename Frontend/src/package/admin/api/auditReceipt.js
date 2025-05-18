// import { filter } from "lodash";
import axiosClient from "./axiosClient";

export const auditReceipt = {
  GetAllAuditReceipt: (
    pageSize,
    pageNumber,
    reportCreateDate,
    reportToDate,
  ) => {
    const url = `/AuditReceipt/GetAllAuditReceipt?pageSize=${pageSize}&pageNumber=${pageNumber}&reportCreateDate=${reportCreateDate}&reportToDate=${reportToDate}`;
    return axiosClient.get(url);
  },
  GetAuditReceiptById: (IdAuditReceipt) => {
    const url = `/AuditReceipt/GetAuditReceiptById?IdAuditReceipt=${IdAuditReceipt}`;
    return axiosClient.get(url);
  },
  InsertAuditReceipt: (auditReceipt) => {
    const url = `/AuditReceipt/InsertAuditReceipt`;
    return axiosClient.post(url, auditReceipt);
  },
  InsertRedundantDocument: (auditReceipt) => {
    const url = `/AuditReceipt/InsertRedundantDocument`;
    return axiosClient.post(url, auditReceipt);
  },
  UpdateAuditReceipt: (auditReceipt) => {
    const url = `/AuditReceipt/UpdateAuditReceipt`;
    return axiosClient.put(url, auditReceipt);
  },
  GetInformationBookByBarCode: async (barCode) => {
    const url = `/AuditReceipt/GetInformationBookByBarCode?barCode=${barCode}`;
    return await axiosClient.get(url);
  },
  LiquidationAuditReceipt: (data) => {
    const url = `/AuditReceipt/LiquidationAuditReceipt`;
    return axiosClient.put(url, data);
  },
  DeleteAuditReceiptByList: (listId) => {
    const url = `/AuditReceipt/DeleteAuditReceiptByList`;
    return axiosClient.delete(url, { data: listId });
  },
  ConfirmLostBook: (pageSize, pageNumber, listId) => {
    const url = `/AuditReceipt/ConfirmLostBook?pageSize=${pageSize}&pageNumber=${pageNumber}`;
    return axiosClient.post(url, listId);
  },
  ReportAuditReceipt: (IdAuditReceipt) => {
    const url = `/AuditReceipt/ReportAuditReceipt?IdAuditReceipt=${IdAuditReceipt}`;
    return axiosClient.get(url);
  },
  PrintListDataDocument: (IdDocumentType, sortByCondition) => {
    const url = `/AuditReceipt/PrintListDataDocument?IdDocumentType=${IdDocumentType}&sortByCondition=${sortByCondition}`;
    return axiosClient.get(url);
  },
  CountAllNumberOfBook: () => {
    const url = `/AuditReceipt/CountAllNumberOfBook`;
    return axiosClient.get(url);
  },
  GetListBookToAuditReceipt: (filter, IdDocumentType, pageSize, pageNumber) => {
    const url = `/AuditReceipt/GetListBookToAuditReceipt?filter=${filter}&IdDocumentType=${IdDocumentType}&pageSize=${pageSize}&pageNumber=${pageNumber}`;
    return axiosClient.get(url);
  },
  GetAuditReceiptByIdForLiquid: (IdAuditReceipt) => {
    const url = `/AuditReceipt/GetAuditReceiptByIdForLiquid?IdAuditReceipt=${IdAuditReceipt}`;
    return axiosClient.get(url);
  },
};
