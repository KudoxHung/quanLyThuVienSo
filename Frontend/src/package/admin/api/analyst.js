import axiosClient from "./axiosClient";

export const analyst = {
  getInfoAppseting: async () => {
    return await axiosClient.get("/Analyst/GetInfoAppseting");
  },
  getDocumentByType: async () => {
    return await axiosClient.get("/Analyst/GetDocumentByType");
  },
  getNumberUserByType: async () => {
    return await axiosClient.get("/Analyst/GetNumberUserByType");
  },
  analystUserAndBook: async () => {
    return await axiosClient.get("/Analyst/AnalystUserAndBook");
  },
  analystBorrowBookByType: async (fromDate, todate) => {
    if (fromDate !== "Invalid date" && todate !== "Invalid date") {
      return await axiosClient.get(`/Analyst/AnalystBorrowBookByType?fromDate=${fromDate}&todate=${todate}`);
    } else {
      return await axiosClient.get(`/Analyst/AnalystBorrowBookByType`);
    }
  },
  getFileExcelGeneralRegister: async (fromDate, todate, documentTypeId = "") => {
    return await axiosClient.get(
      `/Analyst/GetFileExcelGeneralRegister?fromDate=${fromDate}&todate=${todate}&documentTypeId=${documentTypeId}`,
      {
        responseType: "blob"
      }
    );
  },
  getFileExcelGeneralRegister_v1: async (fromDate, todate) => {
    return await axiosClient.get(`/Analyst/GetFileExcelGeneralRegister_v1?fromDate=${fromDate}&todate=${todate}`, {
      responseType: "blob"
    });
  },
  getFileExcelGeneralRegisterBySchoolName: async (schoolYearId) => {
    return await axiosClient.get(`/Analyst/GetFileExcelGeneralRegisterByShoolYear?IdSchoolYear=${schoolYearId}`, {
      responseType: "blob"
    });
  },
  analystBookByDocumentType: async (id) => {
    return await axiosClient.get("/Analyst/AnalystBookByDocumentType?IdDocument=" + id);
  },
  GetNumberDocumentByIdStock: async (id) => {
    return await axiosClient.get("/Analyst/GetNumberDocumentByIdStock?id=" + id);
  },
  GetExceLAnalystBorowLateByUserType: async (fromDate, todate) => {
    if (fromDate !== "Invalid date" && todate !== "Invalid date") {
      return await axiosClient.get(
        `/Analyst/GetExceLAnalystBorowLateByUserType?fromDate=${fromDate}&todate=${todate}`,
        { responseType: "blob" }
      );
    } else {
      return await axiosClient.get(`/Analyst/GetExceLAnalystBorowLateByUserType`, { responseType: "blob" });
    }
  },
  GetExceLAnalystBorowLateByUserType2: async (fromDate, todate) => {
    if (fromDate !== "Invalid date" && todate !== "Invalid date") {
      return await axiosClient.get(
        `/Analyst/GetExceLAnalystBorowLateByUserType2?fromDate=${fromDate}&todate=${todate}`
      );
    } else {
      return await axiosClient.get(`/Analyst/GetExceLAnalystBorowLateByUserType2`);
    }
  },
  GetExceLAnalystBorowByUserType: async (fromDate, todate) => {
    if (fromDate !== "Invalid date" && todate !== "Invalid date") {
      return await axiosClient.get(`/Analyst/GetExceLAnalystBorowByUserType?fromDate=${fromDate}&todate=${todate}`, {
        responseType: "blob"
      });
    } else {
      return await axiosClient.get(`/Analyst/GetExceLAnalystBorowByUserType`, {
        responseType: "blob"
      });
    }
  },
  GetExceLAnalystBorowByUserType2: async (fromDate, todate) => {
    if (fromDate !== "Invalid date" && todate !== "Invalid date") {
      return await axiosClient.get(`/Analyst/GetExceLAnalystBorowByUserType2?fromDate=${fromDate}&todate=${todate}`);
    } else {
      return await axiosClient.get(`/Analyst/GetExceLAnalystBorowByUserType2`);
    }
  },
  GetExceLAnalystByDocumentType: async (IdDocument) => {
    return await axiosClient.get("/Analyst/GetExceLAnalystByDocumentType?IdDocumentType=" + IdDocument, {
      responseType: "blob"
    });
  },
  GetExceLAnalystByDocumentType2: async (IdDocument) => {
    return await axiosClient.get("/Analyst/GetExceLAnalystByDocumentType2?IdDocumentType=" + IdDocument);
  },
  AnalystListBorrowByUserType: async (IdUnit, IdUserType, fromDate, todate) => {
    if (fromDate !== "Invalid date" && todate !== "Invalid date") {
      return await axiosClient.get(
        `/Analyst/AnalystListBorrowByUserType?IdUnit=${IdUnit}&IdUserType=${IdUserType}&fromDate=${fromDate}&todate=${todate}`
      );
    } else {
      return await axiosClient.get(`/Analyst/AnalystListBorrowByUserType?IdUnit=${IdUnit}&IdUserType=${IdUserType}`);
    }
  },
  AnalystListBorrowByUserTypeDetail: async (IdUnit, IdUser, fromDate, todate) => {
    if (fromDate !== "Invalid date" && todate !== "Invalid date") {
      return await axiosClient.get(
        `/Analyst/AnalystListBorrowByUserTypeDetail?IdUnit=${IdUnit}&IdUser=${IdUser}&fromDate=${fromDate}&todate=${todate}`
      );
    } else {
      return await axiosClient.get(`/Analyst/AnalystListBorrowByUserTypeDetail?IdUnit=${IdUnit}&IdUser=${IdUser}`);
    }
  },
  GetFileExcelAnalystListBorrowByUserTypeDetail: async (IdUnit, IdUser, fromDate, todate) => {
    if (fromDate !== "Invalid date" && todate !== "Invalid date") {
      return await axiosClient.get(
        `/Analyst/GetFileExcelAnalystListBorrowByUserTypeDetail?IdUnit=${IdUnit}&IdUser=${IdUser}&fromDate=${fromDate}&todate=${todate}`,
        { responseType: "blob" }
      );
    } else {
      return await axiosClient.get(
        `/Analyst/GetFileExcelAnalystListBorrowByUserTypeDetail?IdUnit=${IdUnit}&IdUser=${IdUser}`,
        { responseType: "blob" }
      );
    }
  },
  GetFileExcelAnalystListBorrowByUserType: async (IdUnit, IdUserType, fromDate, todate) => {
    if (fromDate !== "Invalid date" && todate !== "Invalid date") {
      return await axiosClient.get(
        `/Analyst/GetFileExcelAnalystListBorrowByUserType?IdUnit=${IdUnit}&IdUserType=${IdUserType}&fromDate=${fromDate}&todate=${todate}`,
        { responseType: "blob" }
      );
    } else {
      return await axiosClient.get(
        `/Analyst/GetFileExcelAnalystListBorrowByUserType?IdUnit=${IdUnit}&IdUserType=${IdUserType}`,
        { responseType: "blob" }
      );
    }
  },
  GetFileExcelAnalystListBorrowByUserType2: async (IdUnit, IdUserType, fromDate, todate) => {
    if (fromDate !== "Invalid date" && todate !== "Invalid date") {
      return await axiosClient.get(
        `/Analyst/GetFileExcelAnalystListBorrowByUserType2?IdUnit=${IdUnit}&IdUserType=${IdUserType}&fromDate=${fromDate}&todate=${todate}`
      );
    } else {
      return await axiosClient.get(
        `/Analyst/GetFileExcelAnalystListBorrowByUserType2?IdUnit=${IdUnit}&IdUserType=${IdUserType}`
      );
    }
  },
  GetListBorrowLateByUserType: async (IdUserType, todate) => {
    if (todate !== "Invalid date") {
      return await axiosClient.get(`/Analyst/GetListBorrowLateByUserType?IdUserType=${IdUserType}&todate=${todate}`);
    } else {
      return await axiosClient.get(`/Analyst/GetListBorrowLateByUserType?IdUserType=${IdUserType}`);
    }
  },
  GetLedgerIndividual: async (fromDate, todate, DocumentType) => {
    if (fromDate !== "Invalid date" && todate !== "Invalid date") {
      return await axiosClient.get(
        `/Analyst/GetLedgerIndividual?fromDate=${fromDate}&toDate=${todate}&DocumentType=${DocumentType}`
      );
    } else {
      return await axiosClient.get(`/Analyst/GetLedgerIndividual?DocumentType=${DocumentType}`);
    }
  },
  GetFileExcelAnalystListBorrowLateByUserType: async (IdUserType, todate) => {
    if (todate !== "Invalid date") {
      return await axiosClient.get(
        `/Analyst/GetFileExcelAnalystListBorrowLateByUserType?IdUserType=${IdUserType}&todate=${todate}`,
        { responseType: "blob" }
      );
    } else {
      return await axiosClient.get(`/Analyst/GetFileExcelAnalystListBorrowLateByUserType?IdUserType=${IdUserType}`, {
        responseType: "blob"
      });
    }
  },
  GetFileExcelAnalystListBorrowLateByUserType2: async (IdUserType, todate) => {
    if (todate !== "Invalid date") {
      return await axiosClient.get(
        `/Analyst/GetFileExcelAnalystListBorrowLateByUserType2?IdUserType=${IdUserType}&todate=${todate}`
      );
    } else {
      return await axiosClient.get(`/Analyst/GetFileExcelAnalystListBorrowLateByUserType2?IdUserType=${IdUserType}`);
    }
  },
  Demo: async (uploadedFile) => {
    return await axiosClient.post(`/Analyst/UploadFileToCloudDianary`, uploadedFile);
  },
  GetFileExcelAnalystListBorrowLedgerIndividual: async (fromDate, toDate, DocumentType) => {
    if (fromDate !== "Invalid date" && toDate !== "Invalid date") {
      return await axiosClient.get(
        `/Analyst/GetFileExcelAnalystListBorrowLedgerIndividual?fromDate=${fromDate}&toDate=${toDate}&DocumentType=${DocumentType}`,
        { responseType: "blob" }
      );
    } else {
      return await axiosClient.get(
        `/Analyst/GetFileExcelAnalystListBorrowLedgerIndividual?DocumentType=${DocumentType}`,
        { responseType: "blob" }
      );
    }
  },
  GetFileExcelAnalystListBorrowLedgerIndividual2: async (fromDate, toDate, DocumentType) => {
    if (fromDate !== "Invalid date" && toDate !== "Invalid date") {
      return await axiosClient.get(
        `/Analyst/GetFileExcelAnalystListBorrowLedgerIndividual2?fromDate=${fromDate}&toDate=${toDate}&DocumentType=${DocumentType}`
      );
    } else {
      return await axiosClient.get(
        `/Analyst/GetFileExcelAnalystListBorrowLedgerIndividual2?DocumentType=${DocumentType}`
      );
    }
  },
  GetFileExcelAnalystListReadingLevel: async (fromDate, toDate) => {
    if (fromDate !== "Invalid date" && toDate !== "Invalid date") {
      return await axiosClient.get(
        `/Analyst/GetFileExcelAnalystListReadingLevel?fromDate=${fromDate}&toDate=${toDate}`,
        { responseType: "blob" }
      );
    } else {
      return await axiosClient.get(`/Analyst/GetFileExcelAnalystListReadingLevel`, {
        responseType: "blob"
      });
    }
  },
  GetFileExcelAnalystListReadingLevel2: async (fromDate, toDate) => {
    if (fromDate !== "Invalid date" && toDate !== "Invalid date") {
      return await axiosClient.get(
        `/Analyst/GetFileExcelAnalystListReadingLevel2?fromDate=${fromDate}&toDate=${toDate}`
      );
    } else {
      return await axiosClient.get(`/Analyst/GetFileExcelAnalystListReadingLevel2`);
    }
  },
  GetExceLAnalystListTextBook: async (fromDate, toDate) => {
    if (fromDate !== "Invalid date" && toDate !== "Invalid date") {
      return await axiosClient.get(`/Analyst/GetExceLAnalystListTextBook?fromDate=${fromDate}&toDate=${toDate}`, {
        responseType: "blob"
      });
    } else {
      return await axiosClient.get(`/Analyst/GetExceLAnalystListTextBook`, {
        responseType: "blob"
      });
    }
  },
  GetExceLAnalystListTextBook2: async (fromDate, toDate) => {
    if (fromDate !== "Invalid date" && toDate !== "Invalid date") {
      return await axiosClient.get(`/Analyst/GetExceLAnalystListTextBook2?fromDate=${fromDate}&toDate=${toDate}`);
    } else {
      return await axiosClient.get(`/Analyst/GetExceLAnalystListTextBook2`);
    }
  },
  AnalystListBorrowByUserTypeAndUnit: async (IdUnit, IdUserType, fromDate, todate) => {
    if (fromDate !== "Invalid date" && todate !== "Invalid date") {
      return await axiosClient.get(
        `/Analyst/AnalystListBorrowByUserTypeAndUnit?IdUnit=${IdUnit}&IdUserType=${IdUserType}&fromDate=${fromDate}&todate=${todate}`
      );
    } else {
      return await axiosClient.get(
        `/Analyst/AnalystListBorrowByUserTypeAndUnit?IdUnit=${IdUnit}&IdUserType=${IdUserType}`
      );
    }
  },
  GetFileExcelListIndividualLiquidated: async (nameAuditReceipt, idsIndividual, idAuditReceipt) => {
    return await axiosClient.post(
      `/Analyst/GetFileExcelListIndividualLiquidated`,
      { idsIndividual, idAuditReceipt, nameAuditReceipt },
      { responseType: "blob" }
    );
  },
  GetFileExcelAnalystBorrowBookMonthly: async (values) => {
    return await axiosClient.post(`/Analyst/GetFileExcelAnalystBorrowBookMonthly`, values, { responseType: "blob" });
  },
  GetFileExcelAnalystBorrowBookByQuarter: async (values) => {
    return await axiosClient.post(`/Analyst/GetFileExcelAnalystBorrowBookByQuarter`, values, { responseType: "blob" });
  },
  GetExceLAnalystMagazine: async (values) => {
    return await axiosClient.post(`/Analyst/GetExceLAnalystMagazine`, values, {
      responseType: "blob"
    });
  },
  GetAnalystMagazine: async (values) => {
    return await axiosClient.post(`/Analyst/GetAnalystMagazine`, values);
  }
};
