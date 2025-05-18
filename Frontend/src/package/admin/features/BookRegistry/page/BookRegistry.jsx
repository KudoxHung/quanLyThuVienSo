import React, { useEffect, useState } from "react";

import WithErrorBoundaryCustom from "../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { openNotificationWithIcon } from "../../../../client/utils";
import { analyst } from "../../../api/analyst";
import { ContactAndIntroduction } from "../../../api/contactAndIntroduction";
import { documentType } from "../../../api/documentType";
import { schoolYear } from "../../../api/schoolYear";
import { generateDocument } from "../../../components/generateDocument/generateDocument";
import ThongKeSoDangKyCaBiet from "./../../../asset/files/So_Albums_Theo_ChuCaiABC.docx";
import {
  BookOutlined,
  NodeExpandOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
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

function _BookRegistry() {
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
    } catch (error) {
      console.error("Lấy tên loại thất bại...", error);
    }
  };
  function sortByNumIndividual(a, b, propName) {
    const docNameA = a[propName].toUpperCase();
    const docNameB = b[propName].toUpperCase();

    if (docNameA < docNameB) {
      return -1;
    }
    if (docNameA > docNameB) {
      return 1;
    }
    return 0;
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
    data.dTN = DocumenTypeNamex || "";
    data.DistrictName = InfoAppseting.districtName;
    data.SchoolName = InfoAppseting.schoolName;
    data.NameFooter = InfoAppseting.nameFooter;
    let currentIndex = 1;

    data.atable = data
      .filter((item) => item.documentName.charAt(0).toUpperCase() === "A") // Lọc các mục có documentName bắt đầu bằng chữ cái "G"
      .map((item, index) => ({
        aindex: index + 1,
        anumIndividual: item.nameIndividual.split("/")[0],
        adateIn: moment(item.dateIn).format("DD/MM/YYYY"),
        adocumentName: item.documentName,
        aauthor: item.author || "",
        asignCode:
          (item.colorName === null ? item.signCode : item.colorName) || "",
      }))
      .sort((a, b) => sortByNumIndividual(a, b, "anumIndividual"));
    let aprevDocumentName = null;
    data.atable.forEach((item) => {
      if (item.adocumentName !== aprevDocumentName) {
        item.aindex = currentIndex++;
        aprevDocumentName = item.adocumentName;
      } else {
        item.aindex = " ";
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
        bsignCode:
          (item.colorName === null ? item.signCode : item.colorName) || "",
      }))
      .sort((a, b) => sortByNumIndividual(a, b, "bnumIndividual"));
    let prevDocumentName = null;
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
        csignCode:
          (item.colorName === null ? item.signCode : item.colorName) || "",
      }))
      .sort((a, b) => sortByNumIndividual(a, b, "cnumIndividual"));
    let cprevDocumentName = null;
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
        dsignCode:
          (item.colorName === null ? item.signCode : item.colorName) || "",
      }))
      .sort((a, b) => sortByNumIndividual(a, b, "dnumIndividual"));
    let dprevDocumentName = null;
    data.dtable.forEach((item) => {
      if (item.ddocumentName !== dprevDocumentName) {
        item.dindex = currentIndex++;
        dprevDocumentName = item.ddocumentName;
      } else {
        item.dindex = " ";
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
        esignCode:
          (item.colorName === null ? item.signCode : item.colorName) || "",
      }))
      .sort((a, b) => sortByNumIndividual(a, b, "enumIndividual"));
    let eprevDocumentName = null;
    data.etable.forEach((item) => {
      if (item.edocumentName !== eprevDocumentName) {
        item.eindex = currentIndex++;
        eprevDocumentName = item.edocumentName;
      } else {
        item.eindex = " ";
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
        fsignCode:
          (item.colorName === null ? item.signCode : item.colorName) || "",
      }))
      .sort((a, b) => sortByNumIndividual(a, b, "fnumIndividual"));
    let fprevDocumentName = null;
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
        gsignCode:
          (item.colorName === null ? item.signCode : item.colorName) || "",
      }))
      .sort((a, b) => sortByNumIndividual(a, b, "gnumIndividual"));
    let gprevDocumentName = null;
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
        hsignCode:
          (item.colorName === null ? item.signCode : item.colorName) || "",
      }))
      .sort((a, b) => sortByNumIndividual(a, b, "hnumIndividual"));
    let hprevDocumentName = null;
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
        isignCode:
          (item.colorName === null ? item.signCode : item.colorName) || "",
      }))
      .sort((a, b) => sortByNumIndividual(a, b, "inumIndividual"));
    let iprevDocumentName = null;
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
        jsignCode:
          (item.colorName === null ? item.signCode : item.colorName) || "",
      }))
      .sort((a, b) => sortByNumIndividual(a, b, "jnumIndividual"));
    let jprevDocumentName = null;
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
        ksignCode:
          (item.colorName === null ? item.signCode : item.colorName) || "",
      }))
      .sort((a, b) => sortByNumIndividual(a, b, "knumIndividual"));
    let kprevDocumentName = null;
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
        lsignCode:
          (item.colorName === null ? item.signCode : item.colorName) || "",
      }))
      .sort((a, b) => sortByNumIndividual(a, b, "lnumIndividual"));
    let lprevDocumentName = null;
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
        msignCode:
          (item.colorName === null ? item.signCode : item.colorName) || "",
      }))
      .sort((a, b) => sortByNumIndividual(a, b, "mnumIndividual"));
    let mprevDocumentName = null;
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
        nsignCode:
          (item.colorName === null ? item.signCode : item.colorName) || "",
      }))
      .sort((a, b) => sortByNumIndividual(a, b, "nnumIndividual"));
    let nprevDocumentName = null;
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
        osignCode:
          (item.colorName === null ? item.signCode : item.colorName) || "",
      }))
      .sort((a, b) => sortByNumIndividual(a, b, "onumIndividual"));
    let oprevDocumentName = null;
    data.otable.forEach((item) => {
      if (item.odocumentName !== oprevDocumentName) {
        item.oindex = currentIndex++;
        oprevDocumentName = item.odocumentName;
      } else {
        item.oindex = " ";
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
        psignCode:
          (item.colorName === null ? item.signCode : item.colorName) || "",
      }))
      .sort((a, b) => sortByNumIndividual(a, b, "pnumIndividual"));
    let pprevDocumentName = null;
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
        qsignCode:
          (item.colorName === null ? item.signCode : item.colorName) || "",
      }))
      .sort((a, b) => sortByNumIndividual(a, b, "qnumIndividual"));
    let qprevDocumentName = null;
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
        rsignCode:
          (item.colorName === null ? item.signCode : item.colorName) || "",
      }))
      .sort((a, b) => sortByNumIndividual(a, b, "rnumIndividual"));
    let rprevDocumentName = null;
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
        ssignCode:
          (item.colorName === null ? item.signCode : item.colorName) || "",
      }))
      .sort((a, b) => sortByNumIndividual(a, b, "snumIndividual"));
    let spreviousDocumentName = null;
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
        tsignCode:
          (item.colorName === null ? item.signCode : item.colorName) || "",
      }))
      .sort((a, b) => sortByNumIndividual(a, b, "tnumIndividual"));
    let tprevDocumentName = null;
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
        usignCode:
          (item.colorName === null ? item.signCode : item.colorName) || "",
      }))
      .sort((a, b) => sortByNumIndividual(a, b, "unumIndividual"));
    let uprevDocumentName = null;
    data.utable.forEach((item) => {
      if (item.udocumentName !== uprevDocumentName) {
        item.uindex = currentIndex++;
        uprevDocumentName = item.udocumentName;
      } else {
        item.uindex = " ";
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
        vsignCode:
          (item.colorName === null ? item.signCode : item.colorName) || "",
      }))
      .sort((a, b) => sortByNumIndividual(a, b, "vnumIndividual"));
    let vprevDocumentName = null;
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
        wsignCode:
          (item.colorName === null ? item.signCode : item.colorName) || "",
      }))
      .sort((a, b) => sortByNumIndividual(a, b, "wnumIndividual"));
    let wprevDocumentName = null;
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
        xsignCode:
          (item.colorName === null ? item.signCode : item.colorName) || "",
      }))
      .sort((a, b) => sortByNumIndividual(a, b, "xnumIndividual"));
    let xprevDocumentName = null;
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
        ysignCode:
          (item.colorName === null ? item.signCode : item.colorName) || "",
      }))
      .sort((a, b) => sortByNumIndividual(a, b, "ynumIndividual"));
    let yprevDocumentName = null;
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
        zsignCode:
          (item.colorName === null ? item.signCode : item.colorName) || "",
      }))
      .sort((a, b) => sortByNumIndividual(a, b, "znumIndividual"));
    let zprevDocumentName = null;
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
    console.log(InfoAppseting);
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
                    t="1661919181496"
                    className="icon"
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="8531"
                    width="20"
                    height="20"
                  >
                    <path
                      d="M943.5 179.7H643.2v55.6h88.5v87.9h-88.5v28h88.5v88h-88.5V468h88.5v83.2h-88.5v33.4h88.5V668h-88.5v33.4h88.5v83.9h-88.5v61.2h300.3c4.7-1.4 8.7-7 11.9-16.7 3.2-9.8 4.8-17.7 4.8-23.8V189.8c0-4.8-1.6-7.7-4.8-8.7-3.9-1-7.9-1.5-11.9-1.4z m-39 605.5h-144v-83.8h144.1l-0.1 83.8z m0-117.2h-144v-83.5h144.1l-0.1 83.5z m0-116.8h-144v-82.9h144.1l-0.1 82.9z m0-112h-144v-87.9h144.1l-0.1 87.9z m0-116.5h-144v-87.4h144.1v88l-0.1-0.6zM63.8 165.8v694.7L592.7 952V72L63.8 166.1v-0.3z m313.5 525.5c-2-5.5-11.5-28.6-28.3-69.6-9.7-23.9-19.7-47.8-29.8-71.6h-0.9l-56.7 135-75.8-5.1 89.8-168-82.4-168 77.3-4.1 51.1 131.5h1l57.7-137.5 79.9-5-95.1 181.9 98 185.5-85.8-5z"
                      fill="#fff"
                      p-id="8532"
                    ></path>
                  </svg>,
                ]}
                onClick={(e) => {
                  handleExportWord(Data);
                }}
                style={{ background: "#327936" }}
                loading={btnLoading}
              >
                Xuất báo cáo
              </Button>
            </Space>
          </Card>
        </Spin>
      </Col>
      <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
        <Card bordered={false} className="criclebox h-full">
          <Typography.Title level={5}>Sổ đăng ký</Typography.Title>
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
    </Row>
  );
}

export const BookRegistry = WithErrorBoundaryCustom(_BookRegistry);
