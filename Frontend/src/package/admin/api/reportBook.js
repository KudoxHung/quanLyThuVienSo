import axiosClient from "./axiosClient";

export const reportBook = {
  GetAllSchoolYear: async () => {
    return axiosClient.get(`/ReportBook/GetAllSchoolYear`);
  },
  GetAllSchoolGrade: async () => {
    return axiosClient.get(`/ReportBook/GetAllSchoolGrade`);
  },
  GetAllSchool: async () => {
    return await axiosClient.post(`/ReportBook/GetAllSchool`);
  },
  GetAllSchoolByGradeId: async (ids) => {
    return await axiosClient.post(`/ReportBook/GetAllSchoolByGradeId`, ids);
  },
  SeachReportBookTotal: async (fillter) => {
    return await axiosClient.post(`/ReportBook/SeachReportBookTotal`, fillter);
  },
  SeachReportDetailTotal: async (fillter) => {
    return await axiosClient.post(`/ReportBook/SeachReportDetailTotal`, fillter);
  },
  ExportExcelReportBookTotal: async (fillter) => {
    return await axiosClient.post(`/ReportBook/ExportExcelReportBookTotal`, fillter, { responseType: "blob" });
  },
  ExportExcelReportDetailTotal: async (fillter) => {
    return await axiosClient.post(`/ReportBook/ExportExcelReportDetailTotal`, fillter, { responseType: "blob" });
  },
  GetStatisticsOfPaperBooksAndDigitalBooksOfEachSchool: async (
    idSchoolYear = "00000000-0000-0000-0000-000000000000"
  ) => {
    return await axiosClient.get(
      "/ReportBook/GetStatisticsOfPaperBooksAndDigitalBooksOfEachSchool?idSchoolYear=" + idSchoolYear
    );
  },
  GetStatisticsOfDocumentTypeOfAllSchoolsBySchoolYear: async (
    idSchoolYear = "00000000-0000-0000-0000-000000000000"
  ) => {
    return await axiosClient.get(
      "/ReportBook/GetStatisticsOfDocumentTypeOfAllSchoolsBySchoolYear?idSchoolYear=" + idSchoolYear
    );
  },
  GetStatisticsOfBookConditionBySchoolYear: async (idSchoolYear = "00000000-0000-0000-0000-000000000000") => {
    return await axiosClient.get("/ReportBook/GetStatisticsOfBookConditionBySchoolYear?idSchoolYear=" + idSchoolYear);
  }
};
