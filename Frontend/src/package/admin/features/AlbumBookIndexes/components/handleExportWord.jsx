import WithErrorBoundaryCustom from "../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { openNotificationWithIcon } from "../../../../client/utils";
import { analyst } from "../../../api/analyst";
import ThongKeSoDangKyCaBiet from "../../../asset/files/So_Albums_Theo_ChuCaiABC.docx";
import { generateDocument } from "../../../components/generateDocument/generateDocument";
import moment from "moment/moment";

function _handleExportWord() {
  const handleExportWord = (data) => {
    setBtnLoading(true);
    // data.sort((a, b) => moment(a.dateIn) - moment(b.dateIn));
    data.sort((a, b) => {
      const docNameA = a.documentName.toUpperCase();
      const docNameB = b.documentName.toUpperCase();

      if (docNameA < docNameB) {
        return -1;
      }
      if (docNameA > docNameB) {
        return 1;
      }
      return 0;
    });
    data.schoolYear = `${moment(SchoollYear[0]?.startSemesterI).format("YYYY")} - ${moment(
      SchoollYear[0]?.startSemesterII,
    ).format("YYYY")}`;
    data.Contact = ContractAndIntroduction[0]?.col10;
    data.dTN = DocumenTypeNamex;
    data.atable = data
      .filter((item) => item.documentName.charAt(0).toUpperCase() === "A") // Lọc các mục có documentName bắt đầu bằng chữ cái "G"
      .map((item, index) => ({
        aindex: index + 1,
        anumIndividual: item.nameIndividual.split("/")[0],
        adateIn: moment(item.dateIn).format("DD/MM/YYYY"),
        adocumentName: item.documentName,
        aauthor: item.author || "",
        asignCode: item.signCode || "",
      }));
    data.atable.sort((a, b) => sortByNumIndividual(a, b, "anumIndividual"));
    data.btable = data
      .filter((item) => item.documentName.charAt(0).toUpperCase() === "B") // Lọc các mục có documentName bắt đầu bằng chữ cái "G"
      .map((item, index) => ({
        bindex: index + 1,
        bnumIndividual: item.nameIndividual.split("/")[0],
        bdateIn: moment(item.dateIn).format("DD/MM/YYYY"),
        bdocumentName: item.documentName,
        bauthor: item.author || "",
        bsignCode: item.signCode || "",
      }))
      .sort((a, b) => sortByNumIndividual(a, b, "bnumIndividual"));
    let prevDocumentName = null;
    let currentIndex = 1;
    data.btable.forEach((item) => {
      if (item.bdocumentName !== prevDocumentName) {
        item.bindex = currentIndex++;
        prevDocumentName = item.bdocumentName;
      } else {
        item.bindex = " ";
      }
    });
    data.ctable = data
      .filter((item) => item.documentName.charAt(0).toUpperCase() === "C") // Lọc các mục có documentName bắt đầu bằng chữ cái "G"
      .map((item, index) => ({
        cindex: index + 1,
        cnumIndividual: item.nameIndividual.split("/")[0],
        cdateIn: moment(item.dateIn).format("DD/MM/YYYY"),
        cdocumentName: item.documentName,
        cauthor: item.author || "",
        csignCode: item.signCode || "",
      }));
    generateDocument(ThongKeSoDangKyCaBiet, `albums mục lục sách`, data);
    openNotificationWithIcon(
      "success",
      "Xuất báo cáo thông kê albums mục lục thành công",
    );
    setBtnLoading(false);
  };
  const ExportGeneralRegisterWord = () => {
    if (toDate === null || fromDate === null) {
      openNotificationWithIcon(
        "warning",
        "Vui lòng chọn thời gian cần thống kê",
      );
    } else {
      analyst
        .getFileExcelGeneralRegister(
          moment(fromDate).format("YYYY/MM/DD"),
          moment(toDate).format("YYYY/MM/DD"),
        )
        .then((res) => {
          openNotificationWithIcon(
            "success",
            "Xuất báo cáo thông kê thành công",
          );
          const url = window.URL.createObjectURL(new Blob([res]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "Sổ đăng ký tổng quát.xlsx");
          document.body.appendChild(link);
          link.click();
        })
        .catch((error) => {
          openNotificationWithIcon("error", "Xảy ra lỗi khi tải file Excel");
          console.error("Error downloading Excel file:", error);
        });
    }
  };
}
export const HandleExportWord = WithErrorBoundaryCustom(_handleExportWord);
