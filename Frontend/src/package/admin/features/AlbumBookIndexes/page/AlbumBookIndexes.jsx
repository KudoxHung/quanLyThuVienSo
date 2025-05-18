import React, { useEffect, useState } from "react";

import WithErrorBoundaryCustom from "../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { openNotificationWithIcon } from "../../../../client/utils";
import { analyst } from "../../../api/analyst";
import { ContactAndIntroduction } from "../../../api/contactAndIntroduction";
import { documentType } from "../../../api/documentType";
import { schoolYear } from "../../../api/schoolYear";
import { generateDocument } from "../../../components/generateDocument/generateDocument";
import ThongKeSoDangKyCaBiet from "./../../../asset/files/So_Albums_Theo_ChuCaiABC.docx";
import { NodeExpandOutlined, ReloadOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Row,
  Select,
  Space,
  Spin,
  Table,
  Typography,
} from "antd";
import moment from "moment";

function _AlbumBookIndexes() {
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [DocumentTypes, setDocumentTypes] = useState([]);
  const [DocumentTypeId, setDocumentTypeId] = useState(null);
  const [ContractAndIntroduction, setContractAndIntroduction] = useState([]);
  const [SchoollYear, setSchoollYear] = useState([]);
  const [DocumenTypeNamex, setDocumenTypeNamex] = useState("");

  const [btnLoading, setBtnLoading] = useState(false);
  const [Data, setData] = useState([]);
  const [InfoAppseting, setInfoAppseting] = useState({});
  const { Option } = Select;

  useEffect(() => {
    analyst.getInfoAppseting().then((res) => {
      setInfoAppseting(res);
    });
    document.title = "Thống kê mã cá biệt";
  }, []);
  const fechingData = async (DocumentTypeId) => {
    try {
      const response = await documentType.getById(DocumentTypeId);
      setDocumenTypeNamex(response.docTypeName);
      console.log(response.docTypeName);
    } catch (error) {
      console.error("Lấy tên loại thất bại...", error);
    }
  };
  function sortByProperty(array, propName) {
    return array.sort((a, b) => {
      const propA = a[propName].toUpperCase();
      const propB = b[propName].toUpperCase();

      if (propA < propB) {
        return -1;
      }
      if (propA > propB) {
        return 1;
      }
      return 0;
    });
  }
  // Trường fix bug
  // function sortByNumIndividual(a, b, propName) {
  //     const getParts = (str) => {
  //         const match = str.match(/([a-zA-Z]+)(\d+)$/); // Tách phần chữ và số từ cuối chuỗi
  //         return {
  //             prefix: match ? match[1] : str,
  //             number: match ? parseInt(match[2], 10) : 0
  //         };
  //     };
  //
  //     const partA = getParts(a[propName].toUpperCase());
  //     const partB = getParts(b[propName].toUpperCase());
  //
  //     if (partA.prefix < partB.prefix) {
  //         return -1;
  //     }
  //     if (partA.prefix > partB.prefix) {
  //         return 1;
  //     }
  //     return partA.number - partB.number;
  // }
  function sortByNumIndividual(a, b, propName) {
    const getParts = (str) => {
      const match = str.match(/([a-zA-Z0-9]+?)(\d+)$/); // Tách phần chữ và phần số từ cuối chuỗi
      return {
        prefix: match ? match[1] : str,
        number: match ? parseInt(match[2], 10) : 0,
      };
    };

    const partA = getParts(a[propName].toUpperCase());
    const partB = getParts(b[propName].toUpperCase());
    if (partA.prefix < partB.prefix) {
      return -1;
    }
    if (partA.prefix > partB.prefix) {
      return 1;
    }
    return partA.number - partB.number;
  }
  // Hàm tách số và chữ từ documentName
  function splitDocumentName(documentName) {
    if (!documentName) {
      console.log("documentName không tồn tại");
      return { number: 0, text: "" };
    }
    const match = documentName.match(/^(\d+)?\s*(.*)$/);
    if (!match) {
      console.error("Không thể phân tích documentName:", documentName);
      return { number: 0, text: "" }; // Trả về đối tượng mặc định nếu không khớp
    }
    return {
      number: match[1] ? parseInt(match[1], 10) : 0, // Nếu có số, chuyển thành số nguyên
      text: match[2] ? match[2].trim() : "", // Phần chữ, loại bỏ khoảng trắng thừa
    };
  }
  function sortByDocumentName(array, documentNameField) {
    return array.sort((a, b) => {
      const docA = splitDocumentName(a[documentNameField]);
      const docB = splitDocumentName(b[documentNameField]);

      // So sánh phần số trước
      if (docA.number !== docB.number) {
        return docA.number - docB.number;
      }

      // Nếu phần số giống nhau, so sánh phần chữ
      return docA.text.localeCompare(docB.text);
    });
  }
  function splitText(numIndividual) {
    // Tìm chữ cái trước số
    const match = numIndividual.match(/^(\D+)\s*\d+/);

    return {
      text: match ? match[1].trim() : "",
    };
  }

  function isSpecialCharacter(str) {
    const trimmedStr = str.trimStart();

    if (trimmedStr.length === 0) {
      return false;
    }

    const firstChar = trimmedStr[0];
    return !/^[\p{L}\d]$/u.test(firstChar); // Kiểm tra ký tự đầu tiên nếu không phải chữ cái hoặc số
  }
  const handleExportWord = (data) => {
    if (data.length === 0) {
      openNotificationWithIcon(
        "warning",
        "Không có dữ liệu để xuất báo cáo vui lòng lọc trước khi xuất báo cáo",
      );
      return;
    }
    setBtnLoading(true);
    data.schoolYear = `${moment(SchoollYear[0]?.startSemesterI).format("YYYY")} - ${moment(
      SchoollYear[0]?.startSemesterII,
    ).format("YYYY")}`;
    data.Contact = ContractAndIntroduction[0]?.col10;
    data.dTN = DocumenTypeNamex;
    data.DistrictName = InfoAppseting.districtName;
    data.SchoolName = InfoAppseting.schoolName;
    data.NameFooter = InfoAppseting.nameFooter;
    let currentIndex = 1;
    console.log(data.dTN);
    // lọc số 0
    data.table_0 = data
      .filter((item) => item.documentName.charAt(0).toUpperCase() === "0") // Lọc các mục có documentName bắt đầu bằng số "0"
      .map((item, index) => ({
        index_0: index + 1,
        numIndividual_0: item.nameIndividual.split("/")[0],
        dateIn_0: moment(item.dateIn).format("DD/MM/YYYY"),
        documentName_0: item.documentName,
        author_0: item.author || "",
        signCode_0: item.nameIndividual.split("/")[0].toString().includes("STN")
          ? item.colorName || ""
          : item.signCode || "",
      }))
      .sort((a, b) => sortByNumIndividual(a, b, "numIndividual_0"));

    let pv0DocumentName = null;
    sortByDocumentName(data.table_0, "documentName_0");
    data.table_0.forEach((item) => {
      if (item.documentName_0 !== pv0DocumentName) {
        item.index_0 = currentIndex++;
        pv0DocumentName = item.documentName_0;
      } else {
        item.index_0 = " ";
      }
    });

    // lọc số 1
    data.table_1 = data
      .filter((item) => item.documentName.charAt(0).toUpperCase() === "1") // Lọc các mục có documentName bắt đầu bằng số "1"
      .map((item, index) => ({
        index_1: index + 1,
        numIndividual_1: item.nameIndividual.split("/")[0],
        dateIn_1: moment(item.dateIn).format("DD/MM/YYYY"),
        documentName_1: item.documentName,
        author_1: item.author || "",
        signCode_1: item.nameIndividual.split("/")[0].toString().includes("STN")
          ? item.colorName || ""
          : item.signCode || "",
      }))
      .sort((a, b) => sortByNumIndividual(a, b, "numIndividual_1")); // Sắp xếp theo số và chữ trong documentName

    let pv1DocumentName = null;
    sortByDocumentName(data.table_1, "documentName_1");
    data.table_1.forEach((item) => {
      if (item.documentName_1 !== pv1DocumentName) {
        item.index_1 = currentIndex++;
        pv1DocumentName = item.documentName_1;
      } else {
        item.index_1 = " ";
      }
    });

    // lọc số 2
    data.table_2 = data
      .filter((item) => item.documentName.charAt(0).toUpperCase() === "2") // Lọc các mục có documentName bắt đầu bằng số "1"
      .map((item, index) => ({
        index_2: index + 1,
        numIndividual_2: item.nameIndividual.split("/")[0],
        dateIn_2: moment(item.dateIn).format("DD/MM/YYYY"),
        documentName_2: item.documentName,
        author_2: item.author || "",
        signCode_2: item.nameIndividual.split("/")[0].toString().includes("STN")
          ? item.colorName || ""
          : item.signCode || "",
      }))
      .sort((a, b) => sortByNumIndividual(a, b, "numIndividual_2"));
    let pv2DocumentName = null;
    sortByDocumentName(data.table_2, "documentName_2");
    data.table_2.forEach((item) => {
      if (item.documentName_2 !== pv2DocumentName) {
        item.index_2 = currentIndex++;
        pv2DocumentName = item.documentName_2;
      } else {
        item.index_2 = " ";
      }
    });
    data.table_3 = data
      .filter((item) => item.documentName.charAt(0).toUpperCase() === "3") // Lọc các mục có documentName bắt đầu bằng số "1"
      .map((item, index) => ({
        index_3: index + 1,
        numIndividual_3: item.nameIndividual.split("/")[0],
        dateIn_3: moment(item.dateIn).format("DD/MM/YYYY"),
        documentName_3: item.documentName,
        author_3: item.author || "",
        signCode_3: item.nameIndividual.split("/")[0].toString().includes("STN")
          ? item.colorName || ""
          : item.signCode || "",
      }))
      .sort((a, b) => sortByNumIndividual(a, b, "numIndividual_3"));
    let pv3DocumentName = null;
    sortByDocumentName(data.table_3, "documentName_3");
    data.table_3.forEach((item) => {
      if (item.documentName_3 !== pv3DocumentName) {
        item.index_3 = currentIndex++;
        pv3DocumentName = item.documentName_3;
      } else {
        item.index_3 = " ";
      }
    });
    // lọc số 4
    data.table_4 = data
      .filter((item) => item.documentName.charAt(0).toUpperCase() === "4") // Lọc các mục có documentName bắt đầu bằng số "1"
      .map((item, index) => ({
        index_4: index + 1,
        numIndividual_4: item.nameIndividual.split("/")[0],
        dateIn_4: moment(item.dateIn).format("DD/MM/YYYY"),
        documentName_4: item.documentName,
        author_4: item.author || "",
        signCode_4: item.nameIndividual.split("/")[0].toString().includes("STN")
          ? item.colorName || ""
          : item.signCode || "",
      }))
      .sort((a, b) => sortByNumIndividual(a, b, "numIndividual_4"));
    let pv4DocumentName = null;
    sortByDocumentName(data.table_4, "documentName_4");
    data.table_4.forEach((item) => {
      if (item.documentName_4 !== pv4DocumentName) {
        item.index_4 = currentIndex++;
        pv4DocumentName = item.documentName_4;
      } else {
        item.index_4 = " ";
      }
    });
    //lọc số 5
    data.table_5 = data
      .filter((item) => item.documentName.charAt(0).toUpperCase() === "5") // Lọc các mục có documentName bắt đầu bằng số "5"
      .map((item, index) => ({
        index_5: index + 1,
        numIndividual_5: item.nameIndividual.split("/")[0],
        dateIn_5: moment(item.dateIn).format("DD/MM/YYYY"),
        documentName_5: item.documentName,
        author_5: item.author || "",
        signCode_5: item.nameIndividual.split("/")[0].toString().includes("STN")
          ? item.colorName || ""
          : item.signCode || "",
      }))
      .sort((a, b) => sortByNumIndividual(a, b, "numIndividual_5")); // Sắp xếp theo số và chữ trong documentName

    let pv5DocumentName = null;
    sortByDocumentName(data.table_5, "documentName_5");
    data.table_5.forEach((item) => {
      if (item.documentName_5 !== pv5DocumentName) {
        item.index_5 = currentIndex++;
        pv5DocumentName = item.documentName_5;
      } else {
        item.index_5 = " ";
      }
    });
    //lọc số 6
    data.table_6 = data
      .filter((item) => item.documentName.charAt(0).toUpperCase() === "6") // Lọc các mục có documentName bắt đầu bằng số "1"
      .map((item, index) => ({
        index_6: index + 1,
        numIndividual_6: item.nameIndividual.split("/")[0],
        dateIn_6: moment(item.dateIn).format("DD/MM/YYYY"),
        documentName_6: item.documentName,
        author_6: item.author || "",
        signCode_6: item.nameIndividual.split("/")[0].toString().includes("STN")
          ? item.colorName || ""
          : item.signCode || "",
      }))
      .sort((a, b) => sortByNumIndividual(a, b, "numIndividual_6"));
    let pv6DocumentName = null;
    sortByDocumentName(data.table_6, "documentName_6");
    data.table_6.forEach((item) => {
      if (item.documentName_6 !== pv6DocumentName) {
        item.index_6 = currentIndex++;
        pv6DocumentName = item.documentName_6;
      } else {
        item.index_6 = " ";
      }
    });
    //lọc số 7
    data.table_7 = data
      .filter((item) => item.documentName.charAt(0).toUpperCase() === "7") // Lọc các mục có documentName bắt đầu bằng số "1"
      .map((item, index) => ({
        index_7: index + 1,
        numIndividual_7: item.nameIndividual.split("/")[0],
        dateIn_7: moment(item.dateIn).format("DD/MM/YYYY"),
        documentName_7: item.documentName,
        author_7: item.author || "",
        signCode_7: item.nameIndividual.split("/")[0].toString().includes("STN")
          ? item.colorName || ""
          : item.signCode || "",
      }))
      .sort((a, b) => sortByNumIndividual(a, b, "numIndividual_7"));
    let pv7DocumentName = null;
    sortByDocumentName(data.table_7, "documentName_7");
    data.table_7.forEach((item) => {
      if (item.documentName_7 !== pv7DocumentName) {
        item.index_7 = currentIndex++;
        pv7DocumentName = item.documentName_7;
      } else {
        item.index_7 = " ";
      }
    });

    //lọc số 8
    data.table_8 = data
      .filter((item) => item.documentName.charAt(0).toUpperCase() === "8") // Lọc các mục có documentName bắt đầu bằng số "1"
      .map((item, index) => ({
        index_8: index + 1,
        numIndividual_8: item.nameIndividual.split("/")[0],
        dateIn_8: moment(item.dateIn).format("DD/MM/YYYY"),
        documentName_8: item.documentName,
        author_8: item.author || "",
        signCode_8: item.nameIndividual.split("/")[0].toString().includes("STN")
          ? item.colorName || ""
          : item.signCode || "",
      }))
      .sort((a, b) => sortByNumIndividual(a, b, "numIndividual_8"));
    let pv8DocumentName = null;
    sortByDocumentName(data.table_8, "documentName_8");
    data.table_8.forEach((item) => {
      if (item.documentName_8 !== pv8DocumentName) {
        item.index_8 = currentIndex++;
        pv8DocumentName = item.documentName_8;
      } else {
        item.index_8 = " ";
      }
    });

    //lọc số 9
    data.table_9 = data
      .filter((item) => item.documentName.charAt(0).toUpperCase() === "9") // Lọc các mục có documentName bắt đầu bằng số "1"
      .map((item, index) => ({
        index_9: index + 1,
        numIndividual_9: item.nameIndividual.split("/")[0],
        dateIn_9: moment(item.dateIn).format("DD/MM/YYYY"),
        documentName_9: item.documentName,
        author_9: item.author || "",
        signCode_9: item.nameIndividual.split("/")[0].toString().includes("STN")
          ? item.colorName || ""
          : item.signCode || "",
      }))
      .sort((a, b) => sortByNumIndividual(a, b, "numIndividual_9"));
    let pv9DocumentName = null;
    sortByDocumentName(data.table_9, "documentName_9");
    data.table_9.forEach((item) => {
      if (item.documentName_9 !== pv9DocumentName) {
        item.index_9 = currentIndex++;
        pv9DocumentName = item.documentName_9;
      } else {
        item.index_9 = " ";
      }
    });
    // lọc ký tự đặc biệt
    data.table_char = data
      .filter((item) =>
        isSpecialCharacter(item.documentName.charAt(0).toUpperCase()),
      ) // Lọc các mục có documentName bắt đầu bằng số "1"
      .map((item, index) => ({
        index_char: index + 1,
        numIndividual_char: item.nameIndividual.split("/")[0],
        dateIn_char: moment(item.dateIn).format("DD/MM/YYYY"),
        documentName_char: item.documentName,
        author_char: item.author || "",
        signCode_char: item.nameIndividual
          .split("/")[0]
          .toString()
          .includes("STN")
          ? item.colorName || ""
          : item.signCode || "",
      }))
      .sort((a, b) => sortByNumIndividual(a, b, "numIndividual_char"));
    let characterDocumentName = null;
    sortByProperty(data.table_char, "documentName_char");
    data.table_char.forEach((item) => {
      if (item.documentName_char !== characterDocumentName) {
        item.index_char = currentIndex++;
        characterDocumentName = item.documentName_char;
      } else {
        item.index_char = " ";
      }
    });

    // lọc chữ
    data.atable = data
      .filter((item) => item.documentName.charAt(0).toUpperCase() === "A") // Lọc các mục có documentName bắt đầu bằng chữ cái "G"
      .map((item, index) => ({
        aindex: index + 1,
        anumIndividual: item.nameIndividual.split("/")[0],
        adateIn: moment(item.dateIn).format("DD/MM/YYYY"),
        adocumentName: item.documentName,
        aauthor: item.author || "",
        asignCode: item.nameIndividual.split("/")[0].toString().includes("STN")
          ? item.colorName || ""
          : item.signCode || "",
      }))
      .sort((a, b) => sortByNumIndividual(a, b, "anumIndividual"));
    let aprevDocumentName = null;
    sortByProperty(data.atable, "adocumentName");
    data.atable.forEach((item) => {
      if (item.adocumentName !== aprevDocumentName) {
        item.aindex = currentIndex++;
        aprevDocumentName = item.adocumentName;
      } else {
        item.aindex = " ";
      }
    });
    //aa = ă
    data.aatable = data
      .filter(
        (item) =>
          item.documentName.charAt(0).toUpperCase().indexOf("Ă") !== -1 ||
          item.documentName.charAt(0).toUpperCase().indexOf("Ắ") !== -1 ||
          item.documentName.charAt(0).toUpperCase().indexOf("Ằ") !== -1 ||
          item.documentName.charAt(0).toUpperCase().indexOf("Ẳ") !== -1 ||
          item.documentName.charAt(0).toUpperCase().indexOf("Ẵ") !== -1 ||
          item.documentName.charAt(0).toUpperCase().indexOf("Ặ") !== -1,
      ) // Lọc các mục có documentName bắt đầu bằng chữ cái "ă"
      .map((item, index) => ({
        aaindex: index + 1,
        aanumIndividual: item.nameIndividual.split("/")[0],
        aadateIn: moment(item.dateIn).format("DD/MM/YYYY"),
        aadocumentName: item.documentName,
        aaauthor: item.author || "",
        aasignCode: item.nameIndividual.split("/")[0].toString().includes("STN")
          ? item.colorName || ""
          : item.signCode || "",
      }))
      .sort((a, b) => sortByNumIndividual(a, b, "aanumIndividual"));
    let aaprevDocumentName = null;
    if (data.aatable != null) {
      sortByProperty(data.aatable, "aadocumentName");
    }
    data.aatable.forEach((item) => {
      if (item.aadocumentName !== aaprevDocumentName) {
        item.aaindex = currentIndex++;
        aaprevDocumentName = item.aadocumentName;
      } else {
        item.aaindex = " ";
      }
    });
    //aaa = â
    data.aaatable = data
      .filter(
        (item) =>
          item.documentName.charAt(0).toUpperCase().indexOf("Â") !== -1 ||
          item.documentName.charAt(0).toUpperCase().indexOf("Ấ") !== -1 ||
          item.documentName.charAt(0).toUpperCase().indexOf("Ầ") !== -1 ||
          item.documentName.charAt(0).toUpperCase().indexOf("Ẩ") !== -1 ||
          item.documentName.charAt(0).toUpperCase().indexOf("Ẫ") !== -1 ||
          item.documentName.charAt(0).toUpperCase().indexOf("Ậ") !== -1,
      ) // Lọc các mục có documentName bắt đầu bằng chữ cái ""
      .map((item, index) => ({
        aaaindex: index + 1,
        aaanumIndividual: item.nameIndividual.split("/")[0],
        aaadateIn: moment(item.dateIn).format("DD/MM/YYYY"),
        aaadocumentName: item.documentName,
        aaaauthor: item.author || "",
        aaasignCode: item.nameIndividual
          .split("/")[0]
          .toString()
          .includes("STN")
          ? item.colorName || ""
          : item.signCode || "",
      }))
      .sort((a, b) => sortByNumIndividual(a, b, "aaanumIndividual"));
    console.log(data.aaatable);
    let aaaprevDocumentName = null;
    sortByProperty(data.aaatable, "aaadocumentName");
    data.aaatable.forEach((item) => {
      if (item.aaadocumentName !== aaaprevDocumentName) {
        item.aaaindex = currentIndex++;
        aaaprevDocumentName = item.aaadocumentName;
      } else {
        item.aaaindex = " ";
      }
    });

    data.btable = data
      .filter((item) => item.documentName.charAt(0).toUpperCase() === "B") // Lọc các mục có documentName bắt đầu bằng chữ cái "G"
      .map((item, index) => ({
        bindex: index + 1,
        bnumIndividual: item.nameIndividual.split("/")[0],
        bdateIn: moment(item.dateIn).format("DD/MM/YYYY"),
        bdocumentName: item.documentName,
        bauthor: item.author || "",
        bsignCode: item.nameIndividual.split("/")[0].toString().includes("STN")
          ? item.colorName || ""
          : item.signCode || "",
      }))
      .sort((a, b) => sortByNumIndividual(a, b, "bnumIndividual"));
    let prevDocumentName = null;
    sortByProperty(data.btable, "bdocumentName");
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
        csignCode: item.nameIndividual.split("/")[0].toString().includes("STN")
          ? item.colorName || ""
          : item.signCode || "",
      }))
      .sort((a, b) => sortByNumIndividual(a, b, "cnumIndividual"));
    let cprevDocumentName = null;
    sortByProperty(data.ctable, "cdocumentName");
    data.ctable.forEach((item) => {
      if (item.cdocumentName !== cprevDocumentName) {
        item.cindex = currentIndex++;
        cprevDocumentName = item.cdocumentName;
      } else {
        item.cindex = " ";
      }
    });

    data.dtable = data
      .filter((item) => item.documentName.charAt(0).toUpperCase() === "D") // Lọc các mục có documentName bắt đầu bằng chữ cái "G"
      .map((item, index) => ({
        dindex: index + 1,
        dnumIndividual: item.nameIndividual.split("/")[0],
        ddateIn: moment(item.dateIn).format("DD/MM/YYYY"),
        ddocumentName: item.documentName,
        dauthor: item.author || "",
        dsignCode: item.nameIndividual.split("/")[0].toString().includes("STN")
          ? item.colorName || ""
          : item.signCode || "",
      }))
      .sort((a, b) => sortByNumIndividual(a, b, "dnumIndividual"));
    let dprevDocumentName = null;
    sortByProperty(data.dtable, "ddocumentName");
    data.dtable.forEach((item) => {
      if (item.ddocumentName !== dprevDocumentName) {
        item.dindex = currentIndex++;
        dprevDocumentName = item.ddocumentName;
      } else {
        item.dindex = " ";
      }
    });
    //dd = Đ
    data.ddtable = data
      .filter(
        (item) => item.documentName.charAt(0).toUpperCase().indexOf("Đ") !== -1,
      ) // Lọc các mục có documentName bắt đầu bằng chữ cái "Đ"
      .map((item, index) => ({
        ddindex: index + 1,
        ddnumIndividual: item.nameIndividual.split("/")[0],
        dddateIn: moment(item.dateIn).format("DD/MM/YYYY"),
        dddocumentName: item.documentName,
        ddauthor: item.author || "",
        ddsignCode: item.nameIndividual.split("/")[0].toString().includes("STN")
          ? item.colorName || ""
          : item.signCode || "",
      }))
      .sort((a, b) => sortByNumIndividual(a, b, "ddnumIndividual"));
    console.log(data.ddtable);
    let ddprevDocumentName = null;
    sortByProperty(data.ddtable, "dddocumentName");
    data.ddtable.forEach((item) => {
      if (item.dddocumentName !== ddprevDocumentName) {
        item.ddindex = currentIndex++;
        ddprevDocumentName = item.dddocumentName;
      } else {
        item.ddindex = " ";
      }
    });
    data.etable = data
      .filter((item) => item.documentName.charAt(0).toUpperCase() === "E") // Lọc các mục có documentName bắt đầu bằng chữ cái "G"
      .map((item, index) => ({
        eindex: index + 1,
        enumIndividual: item.nameIndividual.split("/")[0],
        edateIn: moment(item.dateIn).format("DD/MM/YYYY"),
        edocumentName: item.documentName,
        eauthor: item.author || "",
        esignCode: item.nameIndividual.split("/")[0].toString().includes("STN")
          ? item.colorName || ""
          : item.signCode || "",
      }))
      .sort((a, b) => sortByNumIndividual(a, b, "enumIndividual"));
    let eprevDocumentName = null;
    sortByProperty(data.etable, "edocumentName");
    data.etable.forEach((item) => {
      if (item.edocumentName !== eprevDocumentName) {
        item.eindex = currentIndex++;
        eprevDocumentName = item.edocumentName;
      } else {
        item.eindex = " ";
      }
    });
    //ee = ê
    data.eetable = data
      .filter(
        (item) =>
          item.documentName.charAt(0).toUpperCase().indexOf("Ê") !== -1 ||
          item.documentName.charAt(0).toUpperCase().indexOf("Ế") !== -1 ||
          item.documentName.charAt(0).toUpperCase().indexOf("Ề") !== -1 ||
          item.documentName.charAt(0).toUpperCase().indexOf("Ẻ") !== -1 ||
          item.documentName.charAt(0).toUpperCase().indexOf("Ẽ") !== -1 ||
          item.documentName.charAt(0).toUpperCase().indexOf("Ẹ") !== -1,
      ) // Lọc các mục có documentName bắt đầu bằng chữ cái "Ê"
      .map((item, index) => ({
        eeindex: index + 1,
        eenumIndividual: item.nameIndividual.split("/")[0],
        eedateIn: moment(item.dateIn).format("DD/MM/YYYY"),
        eedocumentName: item.documentName,
        eeauthor: item.author || "",
        eesignCode: item.nameIndividual.split("/")[0].toString().includes("STN")
          ? item.colorName || ""
          : item.signCode || "",
      }))
      .sort((a, b) => sortByNumIndividual(a, b, "eenumIndividual"));
    console.log(data.eetable);
    let eeprevDocumentName = null;
    sortByProperty(data.eetable, "eedocumentName");
    data.eetable.forEach((item) => {
      if (item.eedocumentName !== eeprevDocumentName) {
        item.eeindex = currentIndex++;
        eeprevDocumentName = item.eedocumentName;
      } else {
        item.eeindex = " ";
      }
    });
    data.ftable = data
      .filter((item) => item.documentName.charAt(0).toUpperCase() === "F") // Lọc các mục có documentName bắt đầu bằng chữ cái "G"
      .map((item, index) => ({
        findex: index + 1,
        fnumIndividual: item.nameIndividual.split("/")[0],
        fdateIn: moment(item.dateIn).format("DD/MM/YYYY"),
        fdocumentName: item.documentName,
        fauthor: item.author || "",
        //fsignCode: (item.colorName === null ? item.signCode : item.colorName) || "",
        fsignCode: item.nameIndividual.split("/")[0].toString().includes("STN")
          ? item.colorName || ""
          : item.signCode || "",
      }))
      .sort((a, b) => sortByNumIndividual(a, b, "fnumIndividual"));
    let fprevDocumentName = null;
    sortByProperty(data.ftable, "fdocumentName");
    data.ftable.forEach((item) => {
      if (item.fdocumentName !== fprevDocumentName) {
        item.findex = currentIndex++;
        fprevDocumentName = item.fdocumentName;
      } else {
        item.findex = " ";
      }
    });
    data.gtable = data
      .filter((item) => item.documentName.charAt(0).toUpperCase() === "G") // Lọc các mục có documentName bắt đầu bằng chữ cái "G"
      .map((item, index) => ({
        gindex: index + 1,
        gnumIndividual: item.nameIndividual.split("/")[0],
        gdateIn: moment(item.dateIn).format("DD/MM/YYYY"),
        gdocumentName: item.documentName,
        gauthor: item.author || "",
        gsignCode: item.nameIndividual.split("/")[0].toString().includes("STN")
          ? item.colorName || ""
          : item.signCode || "",
      }))
      .sort((a, b) => sortByNumIndividual(a, b, "gnumIndividual"));
    let gprevDocumentName = null;
    sortByProperty(data.gtable, "gdocumentName");
    data.gtable.forEach((item) => {
      if (item.gdocumentName !== gprevDocumentName) {
        item.gindex = currentIndex++;
        gprevDocumentName = item.gdocumentName;
      } else {
        item.gindex = " ";
      }
    });
    data.htable = data
      .filter((item) => item.documentName.charAt(0).toUpperCase() === "H") // Lọc các mục có documentName bắt đầu bằng chữ cái "G"
      .map((item, index) => ({
        hindex: index + 1,
        hnumIndividual: item.nameIndividual.split("/")[0],
        hdateIn: moment(item.dateIn).format("DD/MM/YYYY"),
        hdocumentName: item.documentName,
        hauthor: item.author || "",
        hsignCode: item.nameIndividual.split("/")[0].toString().includes("STN")
          ? item.colorName || ""
          : item.signCode || "",
      }))
      .sort((a, b) => sortByNumIndividual(a, b, "hnumIndividual"));
    let hprevDocumentName = null;
    sortByProperty(data.htable, "hdocumentName");
    data.htable.forEach((item) => {
      if (item.hdocumentName !== hprevDocumentName) {
        item.hindex = currentIndex++;
        hprevDocumentName = item.hdocumentName;
      } else {
        item.hindex = " ";
      }
    });
    data.itable = data
      .filter((item) => item.documentName.charAt(0).toUpperCase() === "I") // Lọc các mục có documentName bắt đầu bằng chữ cái "G"
      .map((item, index) => ({
        iindex: index + 1,
        inumIndividual: item.nameIndividual.split("/")[0],
        idateIn: moment(item.dateIn).format("DD/MM/YYYY"),
        idocumentName: item.documentName,
        iauthor: item.author || "",
        isignCode: item.nameIndividual.split("/")[0].toString().includes("STN")
          ? item.colorName || ""
          : item.signCode || "",
      }))
      .sort((a, b) => sortByNumIndividual(a, b, "inumIndividual"));
    let iprevDocumentName = null;
    sortByProperty(data.itable, "idocumentName");
    data.itable.forEach((item) => {
      if (item.idocumentName !== iprevDocumentName) {
        item.iindex = currentIndex++;
        iprevDocumentName = item.idocumentName;
      } else {
        item.iindex = " ";
      }
    });
    data.jtable = data
      .filter((item) => item.documentName.charAt(0).toUpperCase() === "J") // Lọc các mục có documentName bắt đầu bằng chữ cái "G"
      .map((item, index) => ({
        jindex: index + 1,
        jnumIndividual: item.nameIndividual.split("/")[0],
        jdateIn: moment(item.dateIn).format("DD/MM/YYYY"),
        jdocumentName: item.documentName,
        jauthor: item.author || "",
        jsignCode: item.nameIndividual.split("/")[0].toString().includes("STN")
          ? item.colorName || ""
          : item.signCode || "",
      }))
      .sort((a, b) => sortByNumIndividual(a, b, "jnumIndividual"));
    let jprevDocumentName = null;
    sortByProperty(data.jtable, "jdocumentName");
    data.jtable.forEach((item) => {
      if (item.jdocumentName !== jprevDocumentName) {
        item.jindex = currentIndex++;
        jprevDocumentName = item.jdocumentName;
      } else {
        item.jindex = " ";
      }
    });
    data.ktable = data
      .filter((item) => item.documentName.charAt(0).toUpperCase() === "K") // Lọc các mục có documentName bắt đầu bằng chữ cái "G"
      .map((item, index) => ({
        kindex: index + 1,
        knumIndividual: item.nameIndividual.split("/")[0],
        kdateIn: moment(item.dateIn).format("DD/MM/YYYY"),
        kdocumentName: item.documentName,
        kauthor: item.author || "",
        ksignCode: item.nameIndividual.split("/")[0].toString().includes("STN")
          ? item.colorName || ""
          : item.signCode || "",
      }))
      .sort((a, b) => sortByNumIndividual(a, b, "knumIndividual"));
    let kprevDocumentName = null;
    sortByProperty(data.ktable, "kdocumentName");
    data.ktable.forEach((item) => {
      if (item.kdocumentName !== kprevDocumentName) {
        item.kindex = currentIndex++;
        kprevDocumentName = item.kdocumentName;
      } else {
        item.kindex = " ";
      }
    });
    data.ltable = data
      .filter((item) => item.documentName.charAt(0).toUpperCase() === "L") // Lọc các mục có documentName bắt đầu bằng chữ cái "G"
      .map((item, index) => ({
        lindex: index + 1,
        lnumIndividual: item.nameIndividual.split("/")[0],
        ldateIn: moment(item.dateIn).format("DD/MM/YYYY"),
        ldocumentName: item.documentName,
        lauthor: item.author || "",
        lsignCode: item.nameIndividual.split("/")[0].toString().includes("STN")
          ? item.colorName || ""
          : item.signCode || "",
      }))
      .sort((a, b) => sortByNumIndividual(a, b, "lnumIndividual"));
    let lprevDocumentName = null;
    sortByProperty(data.ltable, "ldocumentName");
    data.ltable.forEach((item) => {
      if (item.ldocumentName !== lprevDocumentName) {
        item.lindex = currentIndex++;
        lprevDocumentName = item.ldocumentName;
      } else {
        item.lindex = " ";
      }
    });
    data.mtable = data
      .filter((item) => item.documentName.charAt(0).toUpperCase() === "M  ") // Lọc các mục có documentName bắt đầu bằng chữ cái "G"
      .map((item, index) => ({
        mindex: index + 1,
        mnumIndividual: item.nameIndividual.split("/")[0],
        mdateIn: moment(item.dateIn).format("DD/MM/YYYY"),
        mdocumentName: item.documentName,
        mauthor: item.author || "",
        msignCode: item.nameIndividual.split("/")[0].toString().includes("STN")
          ? item.colorName || ""
          : item.signCode || "",
      }))
      .sort((a, b) => sortByNumIndividual(a, b, "mnumIndividual"));
    let mprevDocumentName = null;
    sortByProperty(data.mtable, "mdocumentName");
    data.mtable.forEach((item) => {
      if (item.mdocumentName !== mprevDocumentName) {
        item.mindex = currentIndex++;
        mprevDocumentName = item.mdocumentName;
      } else {
        item.mindex = " ";
      }
    });
    data.ntable = data
      .filter((item) => item.documentName.charAt(0).toUpperCase() === "N") // Lọc các mục có documentName bắt đầu bằng chữ cái "G"
      .map((item, index) => ({
        nindex: index + 1,
        nnumIndividual: item.nameIndividual.split("/")[0],
        ndateIn: moment(item.dateIn).format("DD/MM/YYYY"),
        ndocumentName: item.documentName,
        nauthor: item.author || "",
        nsignCode: item.nameIndividual.split("/")[0].toString().includes("STN")
          ? item.colorName || ""
          : item.signCode || "",
      }))
      .sort((a, b) => sortByNumIndividual(a, b, "nnumIndividual"));
    let nprevDocumentName = null;
    sortByProperty(data.ntable, "ndocumentName");
    data.ntable.forEach((item) => {
      if (item.ndocumentName !== nprevDocumentName) {
        item.nindex = currentIndex++;
        nprevDocumentName = item.ndocumentName;
      } else {
        item.nindex = " ";
      }
    });
    data.otable = data
      .filter((item) => item.documentName.charAt(0).toUpperCase() === "O") // Lọc các mục có documentName bắt đầu bằng chữ cái "G"
      .map((item, index) => ({
        oindex: index + 1,
        onumIndividual: item.nameIndividual.split("/")[0],
        odateIn: moment(item.dateIn).format("DD/MM/YYYY"),
        odocumentName: item.documentName,
        oauthor: item.author || "",
        osignCode: item.nameIndividual.split("/")[0].toString().includes("STN")
          ? item.colorName || ""
          : item.signCode || "",
      }))
      .sort((a, b) => sortByNumIndividual(a, b, "onumIndividual"));
    let oprevDocumentName = null;
    sortByProperty(data.otable, "odocumentName");
    data.otable.forEach((item) => {
      if (item.odocumentName !== oprevDocumentName) {
        item.oindex = currentIndex++;
        oprevDocumentName = item.odocumentName;
      } else {
        item.oindex = " ";
      }
    });
    //oo = ô
    data.ootable = data
      .filter(
        (item) =>
          item.documentName.charAt(0).toUpperCase().indexOf("Ô") !== -1 ||
          item.documentName.charAt(0).toUpperCase().indexOf("Ố") !== -1 ||
          item.documentName.charAt(0).toUpperCase().indexOf("Ồ") !== -1 ||
          item.documentName.charAt(0).toUpperCase().indexOf("Ổ") !== -1 ||
          item.documentName.charAt(0).toUpperCase().indexOf("Ỗ") !== -1 ||
          item.documentName.charAt(0).toUpperCase().indexOf("Ộ") !== -1,
      ) // Lọc các mục có documentName bắt đầu bằng chữ cái "Ô"
      .map((item, index) => ({
        ooindex: index + 1,
        oonumIndividual: item.nameIndividual.split("/")[0],
        oodateIn: moment(item.dateIn).format("DD/MM/YYYY"),
        oodocumentName: item.documentName,
        ooauthor: item.author || "",
        oosignCode: item.nameIndividual.split("/")[0].toString().includes("STN")
          ? item.colorName || ""
          : item.signCode || "",
      }))
      .sort((a, b) => sortByNumIndividual(a, b, "oonumIndividual"));
    console.log(data.ootable);
    let ooprevDocumentName = null;
    sortByProperty(data.ootable, "oodocumentName");
    data.ootable.forEach((item) => {
      if (item.oodocumentName !== ooprevDocumentName) {
        item.ooindex = currentIndex++;
        ooprevDocumentName = item.oodocumentName;
      } else {
        item.ooindex = " ";
      }
    });
    //ooo = ơ
    data.oootable = data
      .filter(
        (item) =>
          item.documentName.charAt(0).toUpperCase().indexOf("Ơ") !== -1 ||
          item.documentName.charAt(0).toUpperCase().indexOf("Ớ") !== -1 ||
          item.documentName.charAt(0).toUpperCase().indexOf("Ờ") !== -1 ||
          item.documentName.charAt(0).toUpperCase().indexOf("Ở") !== -1 ||
          item.documentName.charAt(0).toUpperCase().indexOf("Ỡ") !== -1 ||
          item.documentName.charAt(0).toUpperCase().indexOf("Ợ") !== -1,
      ) // Lọc các mục có documentName bắt đầu bằng chữ cái "Ơ"
      .map((item, index) => ({
        oooindex: index + 1,
        ooonumIndividual: item.nameIndividual.split("/")[0],
        ooodateIn: moment(item.dateIn).format("DD/MM/YYYY"),
        ooodocumentName: item.documentName,
        oooauthor: item.author || "",
        ooosignCode: item.nameIndividual
          .split("/")[0]
          .toString()
          .includes("STN")
          ? item.colorName || ""
          : item.signCode || "",
      }))
      .sort((a, b) => sortByNumIndividual(a, b, "ooonumIndividual"));
    console.log(data.oootable);
    let oooprevDocumentName = null;
    sortByProperty(data.oootable, "ooodocumentName");
    data.oootable.forEach((item) => {
      if (item.ooodocumentName !== oooprevDocumentName) {
        item.oooindex = currentIndex++;
        oooprevDocumentName = item.ooodocumentName;
      } else {
        item.oooindex = " ";
      }
    });
    data.ptable = data
      .filter((item) => item.documentName.charAt(0).toUpperCase() === "P") // Lọc các mục có documentName bắt đầu bằng chữ cái "G"
      .map((item, index) => ({
        pindex: index + 1,
        pnumIndividual: item.nameIndividual.split("/")[0],
        pdateIn: moment(item.dateIn).format("DD/MM/YYYY"),
        pdocumentName: item.documentName,
        pauthor: item.author || "",
        psignCode: item.nameIndividual.split("/")[0].toString().includes("STN")
          ? item.colorName || ""
          : item.signCode || "",
      }))
      .sort((a, b) => sortByNumIndividual(a, b, "pnumIndividual"));
    let pprevDocumentName = null;
    sortByProperty(data.ptable, "pdocumentName");
    data.ptable.forEach((item) => {
      if (item.pdocumentName !== pprevDocumentName) {
        item.pindex = currentIndex++;
        pprevDocumentName = item.pdocumentName;
      } else {
        item.pindex = " ";
      }
    });
    data.qtable = data
      .filter((item) => item.documentName.charAt(0).toUpperCase() === "Q") // Lọc các mục có documentName bắt đầu bằng chữ cái "G"
      .map((item, index) => ({
        qindex: index + 1,
        qnumIndividual: item.nameIndividual.split("/")[0],
        qdateIn: moment(item.dateIn).format("DD/MM/YYYY"),
        qdocumentName: item.documentName,
        qauthor: item.author || "",
        qsignCode: item.nameIndividual.split("/")[0].toString().includes("STN")
          ? item.colorName || ""
          : item.signCode || "",
      }))
      .sort((a, b) => sortByNumIndividual(a, b, "qnumIndividual"));
    let qprevDocumentName = null;
    sortByProperty(data.qtable, "qdocumentName");
    data.qtable.forEach((item) => {
      if (item.qdocumentName !== qprevDocumentName) {
        item.qindex = currentIndex++;
        qprevDocumentName = item.qdocumentName;
      } else {
        item.qindex = " ";
      }
    });
    data.rtable = data
      .filter((item) => item.documentName.charAt(0).toUpperCase() === "R") // Lọc các mục có documentName bắt đầu bằng chữ cái "G"
      .map((item, index) => ({
        rindex: index + 1,
        rnumIndividual: item.nameIndividual.split("/")[0],
        rdateIn: moment(item.dateIn).format("DD/MM/YYYY"),
        rdocumentName: item.documentName,
        rauthor: item.author || "",
        rsignCode: item.nameIndividual.split("/")[0].toString().includes("STN")
          ? item.colorName || ""
          : item.signCode || "",
      }))
      .sort((a, b) => sortByNumIndividual(a, b, "rnumIndividual"));
    let rprevDocumentName = null;
    sortByProperty(data.rtable, "rdocumentName");
    data.rtable.forEach((item) => {
      if (item.rdocumentName !== rprevDocumentName) {
        item.rindex = currentIndex++;
        rprevDocumentName = item.rdocumentName;
      } else {
        item.rindex = " ";
      }
    });
    data.stable = data
      .filter((item) => item.documentName.charAt(0).toUpperCase() === "S") // Lọc các mục có documentName bắt đầu bằng chữ cái "G"
      .map((item, index) => ({
        sindex: index + 1,
        snumIndividual: item.nameIndividual.split("/")[0],
        sdateIn: moment(item.dateIn).format("DD/MM/YYYY"),
        sdocumentName: item.documentName,
        sauthor: item.author || "",
        ssignCode: item.nameIndividual.split("/")[0].toString().includes("STN")
          ? item.colorName || ""
          : item.signCode || "",
      }))
      .sort((a, b) => sortByNumIndividual(a, b, "snumIndividual"));
    let spreviousDocumentName = null;
    sortByProperty(data.stable, "sdocumentName");
    data.stable.forEach((item) => {
      if (item.sdocumentName !== spreviousDocumentName) {
        item.sindex = currentIndex++;
        spreviousDocumentName = item.sdocumentName;
      } else {
        item.sindex = " ";
      }
    });
    data.ttable = data
      .filter((item) => item.documentName.charAt(0).toUpperCase() === "T") // Lọc các mục có documentName bắt đầu bằng chữ cái "G"
      .map((item, index) => ({
        tindex: index + 1,
        tnumIndividual: item.nameIndividual.split("/")[0],
        tdateIn: moment(item.dateIn).format("DD/MM/YYYY"),
        tdocumentName: item.documentName,
        tauthor: item.author || "",
        tsignCode: item.nameIndividual.split("/")[0].toString().includes("STN")
          ? item.colorName || ""
          : item.signCode || "",
      }))
      .sort((a, b) => sortByNumIndividual(a, b, "tnumIndividual"));
    let tprevDocumentName = null;
    sortByProperty(data.ttable, "tdocumentName");
    data.ttable.forEach((item) => {
      if (item.tdocumentName !== tprevDocumentName) {
        item.tindex = currentIndex++;
        tprevDocumentName = item.tdocumentName;
      } else {
        item.tindex = " ";
      }
    });
    data.utable = data
      .filter((item) => item.documentName.charAt(0).toUpperCase() === "U") // Lọc các mục có documentName bắt đầu bằng chữ cái "G"
      .map((item, index) => ({
        uindex: index + 1,
        unumIndividual: item.nameIndividual.split("/")[0],
        udateIn: moment(item.dateIn).format("DD/MM/YYYY"),
        udocumentName: item.documentName,
        uauthor: item.author || "",
        usignCode: item.nameIndividual.split("/")[0].toString().includes("STN")
          ? item.colorName || ""
          : item.signCode || "",
      }))
      .sort((a, b) => sortByNumIndividual(a, b, "unumIndividual"));
    let uprevDocumentName = null;
    sortByProperty(data.utable, "udocumentName");
    data.utable.forEach((item) => {
      if (item.udocumentName !== uprevDocumentName) {
        item.uindex = currentIndex++;
        uprevDocumentName = item.udocumentName;
      } else {
        item.uindex = " ";
      }
    });
    //uu = ư
    data.uutable = data
      .filter(
        (item) =>
          item.documentName.charAt(0).toUpperCase().indexOf("Ư") !== -1 ||
          item.documentName.charAt(0).toUpperCase().indexOf("Ứ") !== -1 ||
          item.documentName.charAt(0).toUpperCase().indexOf("Ừ") !== -1 ||
          item.documentName.charAt(0).toUpperCase().indexOf("Ử") !== -1 ||
          item.documentName.charAt(0).toUpperCase().indexOf("Ữ") !== -1 ||
          item.documentName.charAt(0).toUpperCase().indexOf("Ự") !== -1,
      ) // Lọc các mục có documentName bắt đầu bằng chữ cái "Ư"
      .map((item, index) => ({
        uuindex: index + 1,
        uunumIndividual: item.nameIndividual.split("/")[0],
        uudateIn: moment(item.dateIn).format("DD/MM/YYYY"),
        uudocumentName: item.documentName,
        uuauthor: item.author || "",
        uusignCode: item.nameIndividual.split("/")[0].toString().includes("STN")
          ? item.colorName || ""
          : item.signCode || "",
      }))
      .sort((a, b) => sortByNumIndividual(a, b, "uunumIndividual"));
    console.log(data.uutable);
    let uuprevDocumentName = null;
    sortByProperty(data.uutable, "uudocumentName");
    data.uutable.forEach((item) => {
      if (item.uudocumentName !== uuprevDocumentName) {
        item.uuindex = currentIndex++;
        uuprevDocumentName = item.uudocumentName;
      } else {
        item.uuindex = " ";
      }
    });
    data.vtable = data
      .filter((item) => item.documentName.charAt(0).toUpperCase() === "V") // Lọc các mục có documentName bắt đầu bằng chữ cái "G"
      .map((item, index) => ({
        vindex: index + 1,
        vnumIndividual: item.nameIndividual.split("/")[0],
        vdateIn: moment(item.dateIn).format("DD/MM/YYYY"),
        vdocumentName: item.documentName,
        vauthor: item.author || "",
        vsignCode: item.nameIndividual.split("/")[0].toString().includes("STN")
          ? item.colorName || ""
          : item.signCode || "",
      }))
      .sort((a, b) => sortByNumIndividual(a, b, "vnumIndividual"));
    let vprevDocumentName = null;
    sortByProperty(data.vtable, "vdocumentName");
    data.vtable.forEach((item) => {
      if (item.vdocumentName !== vprevDocumentName) {
        item.vindex = currentIndex++;
        vprevDocumentName = item.vdocumentName;
      } else {
        item.vindex = " ";
      }
    });
    data.wtable = data
      .filter((item) => item.documentName.charAt(0).toUpperCase() === "W") // Lọc các mục có documentName bắt đầu bằng chữ cái "G"
      .map((item, index) => ({
        windex: index + 1,
        wnumIndividual: item.nameIndividual.split("/")[0],
        wdateIn: moment(item.dateIn).format("DD/MM/YYYY"),
        wdocumentName: item.documentName,
        wauthor: item.author || "",
        wsignCode: item.nameIndividual.split("/")[0].toString().includes("STN")
          ? item.colorName || ""
          : item.signCode || "",
      }))
      .sort((a, b) => sortByNumIndividual(a, b, "wnumIndividual"));
    let wprevDocumentName = null;
    sortByProperty(data.wtable, "wdocumentName");
    data.wtable.forEach((item) => {
      if (item.wdocumentName !== wprevDocumentName) {
        item.windex = currentIndex++;
        wprevDocumentName = item.wdocumentName;
      } else {
        item.windex = " ";
      }
    });
    data.xtable = data
      .filter((item) => item.documentName.charAt(0).toUpperCase() === "X") // Lọc các mục có documentName bắt đầu bằng chữ cái "G"
      .map((item, index) => ({
        xindex: index + 1,
        xnumIndividual: item.nameIndividual.split("/")[0],
        xdateIn: moment(item.dateIn).format("DD/MM/YYYY"),
        xdocumentName: item.documentName,
        xauthor: item.author || "",
        xsignCode: item.nameIndividual.split("/")[0].toString().includes("STN")
          ? item.colorName || ""
          : item.signCode || "",
      }))
      .sort((a, b) => sortByNumIndividual(a, b, "xnumIndividual"));
    let xprevDocumentName = null;
    sortByProperty(data.xtable, "xdocumentName");
    data.xtable.forEach((item) => {
      if (item.xdocumentName !== xprevDocumentName) {
        item.xindex = currentIndex++;
        xprevDocumentName = item.xdocumentName;
      } else {
        item.xindex = " ";
      }
    });
    data.ytable = data
      .filter((item) => item.documentName.charAt(0).toUpperCase() === "Y") // Lọc các mục có documentName bắt đầu bằng chữ cái "G"
      .map((item, index) => ({
        yindex: index + 1,
        ynumIndividual: item.nameIndividual.split("/")[0],
        ydateIn: moment(item.dateIn).format("DD/MM/YYYY"),
        ydocumentName: item.documentName,
        yauthor: item.author || "",
        ysignCode: item.nameIndividual.split("/")[0].toString().includes("STN")
          ? item.colorName || ""
          : item.signCode || "",
      }))
      .sort((a, b) => sortByNumIndividual(a, b, "ynumIndividual"));
    let yprevDocumentName = null;
    sortByProperty(data.ytable, "ydocumentName");
    data.ytable.forEach((item) => {
      if (item.ydocumentName !== yprevDocumentName) {
        item.yindex = currentIndex++;
        yprevDocumentName = item.ydocumentName;
      } else {
        item.yindex = " ";
      }
    });
    data.ztable = data
      .filter((item) => item.documentName.charAt(0).toUpperCase() === "Z") // Lọc các mục có documentName bắt đầu bằng chữ cái "G"
      .map((item, index) => ({
        zindex: index + 1,
        znumIndividual: item.nameIndividual.split("/")[0],
        zdateIn: moment(item.dateIn).format("DD/MM/YYYY"),
        zdocumentName: item.documentName,
        zauthor: item.author || "",
        zsignCode: item.nameIndividual.split("/")[0].toString().includes("STN")
          ? item.colorName || ""
          : item.signCode || "",
      }))
      .sort((a, b) => sortByNumIndividual(a, b, "znumIndividual"));
    let zprevDocumentName = null;
    sortByProperty(data.ztable, "zdocumentName");
    data.ztable.forEach((item) => {
      if (item.zdocumentName !== zprevDocumentName) {
        item.zindex = currentIndex++;
        zprevDocumentName = item.zdocumentName;
      } else {
        item.zindex = " ";
      }
    });

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

  const handleChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };
  useEffect(() => {
    const fechingData = async () => {
      Promise.all([
        documentType
          .getAllNotPage(1)
          .then((res) => {
            setDocumentTypes(res);
            setLoading(false);
          })
          .catch((err) => {
            openNotificationWithIcon(
              "error",
              "Lấy loại sách thất bại",
              err?.response?.data?.message || err?.message,
            );
          }),
        ContactAndIntroduction.read(0, 0, 2)
          .then((res) => {
            setContractAndIntroduction(res);
          })
          .catch((err) => {
            openNotificationWithIcon("error", "Lỗi", err?.message);
          }),
        schoolYear
          .getAll(0, 0)
          .then((res) => {
            setSchoollYear(res);
          })
          .catch((err) => {
            openNotificationWithIcon("error", "Lỗi", err?.message);
          }),
      ]);
    };
    fechingData();
  }, []);

  const handleSearch = (fromDate, toDate, DocumentTypeId) => {
    console.log(DocumentTypeId);
    fechingData(DocumentTypeId);
    console.log(DocumenTypeNamex);
    setBtnLoading(true);
    setLoading(true);
    const _fromDate = moment(fromDate).format("YYYY-MM-DD");
    const _toDate = moment(toDate).format("YYYY-MM-DD");
    if (DocumentTypeId === null) {
      DocumentTypeId = "00000000-0000-0000-0000-000000000000";
    }

    analyst
      .GetLedgerIndividual(_fromDate, _toDate, DocumentTypeId)
      .then((res) => {
        console.log(res);
        setData(res);
        setLoading(false);
        setBtnLoading(false);
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Lấy thống kê thất bại",
          err?.response?.data?.message || err?.message,
        );
        setLoading(false);
        setBtnLoading(false);
      });
  };

  const columns = [
    {
      title: "Nhan đề",
      dataIndex: "documentName",
      key: "documentName",
      filters: Data.map((item) => ({
        text: item.documentName,
        value: item.documentName,
      })),

      filterSearch: true,
      filteredValue: filteredInfo.documentName || null,
      sorter: (a, b) => a.documentName.length - b.documentName.length,
      sortOrder:
        sortedInfo.columnKey === "documentName" ? sortedInfo.order : null,

      onFilter: (value, record) => record.documentName.startsWith(value),
    },
    {
      title: "Số ĐKCB",
      dataIndex: "nameIndividual",
      key: "nameIndividual",
      filters: Data.map((item) => ({
        text: item.nameIndividual.split("/")[0],
        value: item.nameIndividual,
      })),
      filterSearch: true,
      filteredValue: filteredInfo.nameIndividual || null,
      onFilter: (value, record) => record.nameIndividual.startsWith(value),
      render: (text, record) => record.nameIndividual.split("/")[0],
    },
    {
      title: "Tác giả",
      dataIndex: "author",
      key: "author",
      filters: Data.map((item) => ({
        text: item.author,
        value: item.author,
      })),

      filterSearch: true,
      filteredValue: filteredInfo.author || null,
      sorter: (a, b) => a.author.length - b.author.length,
      sortOrder: sortedInfo.columnKey === "author" ? sortedInfo.order : null,

      onFilter: (value, record) => record.author.startsWith(value),
    },
    {
      title: "Ngày nhập",
      dataIndex: "dateIn",
      key: "dateIn",
      filters: Data.map((item) => ({
        text: moment(item.dateIn).format("DD/MM/YYYY"),
        value: item.dateIn,
      })),
      filterSearch: true,
      filteredValue: filteredInfo.dateIn || null,
      sorter: (a, b) => a.dateIn.length - b.dateIn.length,
      sortOrder: sortedInfo.columnKey === "dateIn" ? sortedInfo.order : null,
      onFilter: (value, record) => record.dateIn.startsWith(value),
      render: (text, record) => moment(record.dateIn).format("DD/MM/YYYY"),
    },
  ];

  return (
    <Row gutter={[24, 0]}>
      <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
        <Spin spinning={loading}>
          <Card bordered={false} className="criclebox h-full">
            <Space direction="horizontal" size={24} style={{ width: "100%" }}>
              <Button
                icon={<ReloadOutlined />}
                onClick={(e) => {
                  setFromDate(null);
                  setToDate(null);
                  setDocumentTypeId(null);

                  handleSearch(
                    null,
                    null,
                    "00000000-0000-0000-0000-000000000000",
                  );
                }}
              >
                Cài lại
              </Button>
              <DatePicker.RangePicker
                placeholder={["Từ ngày", "Đến ngày"]}
                format={["DD/MM/YYYY", "DD/MM/YYYY"]}
                allowClear={false}
                onChange={(value) => {
                  setFromDate(value[0]);
                  setToDate(value[1]);
                }}
                value={[fromDate, toDate]}
              />
              <Select
                showSearch
                style={{
                  width: 200,
                }}
                onChange={(value) => {
                  setDocumentTypeId(value);
                }}
                value={DocumentTypeId}
                placeholder="Loại sách"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
                filterSort={(optionA, optionB) =>
                  optionA.children
                    .toLowerCase()
                    .localeCompare(optionB.children.toLowerCase())
                }
              >
                {DocumentTypes.map((item) => (
                  <Option key={item?.id} value={item?.id}>
                    {item?.docTypeName}
                  </Option>
                ))}
                <Option
                  key={"00000000-0000-0000-0000-000000000000"}
                  value={"00000000-0000-0000-0000-000000000000"}
                >
                  Tất cả loại sách
                </Option>
              </Select>

              <Button
                type="primary"
                icon={<NodeExpandOutlined />}
                onClick={(e) => {
                  handleSearch(fromDate, toDate, DocumentTypeId);
                }}
                loading={btnLoading}
              >
                Lọc
              </Button>
              <Button
                type="primary"
                icon={[
                  <svg
                    className="icon"
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                  >
                    <path
                      d="M535.119473 0h69.599248v95.247413C729.226717 96.331138 853.614299 93.92286 977.881468 96.331138a40.459078 40.459078 0 0 1 44.914393 45.516463c2.047037 234.566322 0 469.614299 1.204139 703.819379-1.204139 24.082785 2.287865 50.694262-11.318909 72.248354-16.978363 12.041392-38.893697 10.837253-58.761994 12.041392h-349.200376V1023.518344h-72.248354C354.980245 990.886171 177.490122 960.541863 0 928.752587V95.488241C178.33302 63.578551 356.786453 32.511759 535.119473 0z"
                      fill="#2A5699"
                    ></path>
                    <path
                      d="M604.718721 131.010348H988.598307v761.979304H604.718721v-95.247413h302.479774v-48.165569H604.718721v-59.002822h302.479774v-48.16557H604.718721v-59.002822h302.479774v-48.165569H604.718721v-60.206961h302.479774V428.673565H604.718721v-60.206961h302.479774v-46.96143H604.718721v-59.604892h302.479774V214.336783H604.718721zM240.827846 341.373471c22.156162-1.324553 44.19191-2.287865 66.348071-3.492003 15.533396 80.4365 31.30762 160.632173 48.165569 240.827845 13.125118-82.724365 27.695202-165.087488 41.783632-247.571025 23.239887-0.842897 46.479774-2.167451 69.719661-3.612418-26.370649 115.356538-49.369708 231.796802-78.148636 346.430856-19.386642 10.355597-48.165569 0-71.52587 1.204139C301.034807 596.169332 283.093133 517.779868 269.245532 438.667921c-13.606773 76.944497-31.30762 153.16651-46.841016 229.508937-22.39699-1.204139-44.793979-2.528692-67.311383-4.094073-19.266228-104.760113-42.024459-208.918156-60.206962-313.919097 19.868297-0.963311 39.857008-1.806209 60.206962-2.528693 12.041392 75.860771 25.648166 151.360301 36.124177 227.341487 16.135466-77.907808 32.873001-155.695202 49.610536-233.603011z"
                      fill="#FFFFFF"
                    ></path>
                  </svg>,
                ]}
                onClick={(e) => {
                  handleExportWord(Data);
                }}
                style={{ background: "#2A5699" }}
                loading={btnLoading}
              >
                Xuất báo cáo
              </Button>
              {/*<Button*/}
              {/*  icon={<BookOutlined />}*/}
              {/*  onClick={ExportGeneralRegisterWord}*/}
              {/*  style={{ background: "#0f6a01", color: "white" }}*/}
              {/*>*/}
              {/*  Sổ đăng ký tổng quát*/}
              {/*</Button>*/}
            </Space>
          </Card>
        </Spin>
      </Col>
      <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
        <Card bordered={false} className="criclebox h-full">
          <Typography.Title level={5}>Sổ albums mục lục sách</Typography.Title>

          <Table
            scroll={{
              x: window.screen.width,
            }}
            columns={columns.map((col) =>
              col.title !== "Thao tác"
                ? { ...col, ellipsis: true, width: 160 }
                : col,
            )}
            dataSource={Data}
            onChange={handleChange}
            loading={loading}
            pagination={{
              showTotal: (total, range) => `Tổng số: ${total} phiếu`,
              defaultPageSize: 6,
            }}
          />
        </Card>
      </Col>
      {/*<Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">*/}
      {/*    <Card bordered={false} className="criclebox h-full">*/}
      {/*        <Button*/}
      {/*            icon={<BookOutlined  />}*/}
      {/*            onClick={ExportGeneralRegisterWord}*/}
      {/*            style={{ background: "#327936", color:'white' }}*/}
      {/*        >*/}
      {/*            Sổ đăng ký tổng quát*/}
      {/*        </Button>*/}
      {/*    </Card>*/}
      {/*</Col>*/}
    </Row>
  );
}

export const AlbumBookIndexes = WithErrorBoundaryCustom(_AlbumBookIndexes);
