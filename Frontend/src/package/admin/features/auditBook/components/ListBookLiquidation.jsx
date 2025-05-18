import React, { useEffect, useState } from "react";

import WithErrorBoundaryCustom from "../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { readMoney } from "../../../../../units/Read_money";
import { openNotificationWithIcon } from "../../../../client/utils";
import { analyst } from "../../../api/analyst";
import { auditReceipt } from "../../../api/auditReceipt";
import { ContactAndIntroduction } from "../../../api/contactAndIntroduction";
import BienBanThanhLySach from "../../../asset/files/02._BIEN_BAN_THANH_LY_SACH.docx";
import { generateDocument } from "../../../components/generateDocument/generateDocument";
import { CheckOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Col,
  Input,
  InputNumber,
  Popconfirm,
  Row,
  Select,
  Space,
  Spin,
  Table,
  Typography,
} from "antd";
import moment from "moment";

import "./style.css";

function _ListBookLiquidation(props) {
  const { idReceipt, setVisible, setRefreshData } = props;
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [listData, setListData] = useState([]);
  const [auditReceiptData, setAuditReceiptData] = useState({});
  const [selectedData, setSelectedData] = useState([]);
  const [filteredInfo, setFilteredInfo] = useState({});
  const [refresh, setRefresh] = useState(false);
  const [totalSelectedCount, setTotalSelectedCount] = useState(0);
  useEffect(() => {
    if (!idReceipt) return;
    setLoading(true);
    auditReceipt
      .GetAuditReceiptByIdForLiquid(idReceipt)
      .then((res) => {
        let filterBefore = [];
        if (res.status === 1) {
          const getArrayIsLiquidation = (data) => {
            return data?.filter((item) => item?.isLiquidation === true);
          };
          filterBefore = res.data
            .map((item) =>
              getArrayIsLiquidation(item?.data)?.map(
                (item) => item?.idIndividual,
              )?.length > 0
                ? {
                    ...item,
                    ListIdIndividualSelected: getArrayIsLiquidation(
                      item?.data,
                    )?.map((item) => item?.idIndividual),
                  }
                : null,
            )
            .filter((item) => item !== null);
        } else if (res.status !== 1) {
          const getArrayIsLiquidation = (data) => {
            return data?.filter((item) => item?.isLiquidation === false);
          };
          filterBefore = res.data
            .map((item) =>
              getArrayIsLiquidation(item?.data)?.map(
                (item) => item?.idIndividual,
              )?.length > 0
                ? {
                    ...item,
                    ListIdIndividualSelected: getArrayIsLiquidation(
                      item?.data,
                    )?.map((item) => item?.idIndividual),
                  }
                : null,
            )
            .filter((item) => item !== null);
        }
        setListData(filterBefore);
        setAuditReceiptData(res);
        setSelectedData([]);
      })
      .catch((err) => {
        openNotificationWithIcon("error", "Thất bại", "Lấy dữ liệu thất bại");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [idReceipt, refresh]);
  const handleQuantityChange = (id, price) => {
    setTimeout(() => {
      const updatedData = listData?.map((item) => {
        if (item.documentId === id) {
          const total = item.data?.length * price;
          return { ...item, price, total };
        }
        return item;
      });
      setListData(updatedData);
    }, 300);
  };
  const handleNoteChange = (id, note) => {
    setTimeout(() => {
      const updatedData = listData?.map((item) => {
        if (item.documentId === id) {
          return { ...item, note };
        }
        return item;
      });
      setListData(updatedData);
    }, 300);
  };
  const handleListIdIndividualChange = (id, ListIdIndividualSelected) => {
    const updatedData = listData?.map((item) => {
      if (item.documentId === id) {
        return { ...item, ListIdIndividualSelected };
      }
      return item;
    });
    if (selectedData.length > 0) {
      const oldItem = listData.find((item) => item.documentId === id);
      const oldList = Array.isArray(oldItem?.ListIdIndividualSelected)
        ? oldItem.ListIdIndividualSelected
        : [];
      const oldCount = oldList.length;
      const newCount = ListIdIndividualSelected.length;
      //console.log(oldCount);
      //console.log(newCount);
      const addCount = newCount - oldCount;
      setTotalSelectedCount((prevCount) => Math.max(prevCount + addCount, 0));
    } else {
      setTotalSelectedCount(0);
    }
    setListData(updatedData);
  };
  // const handleProductSelect = (id) => {
  //   setSelectedData((prevSelectedProducts) => {
  //     if (prevSelectedProducts.includes(id)) {
  //       return prevSelectedProducts.filter((productId) => productId !== id);
  //     } else {
  //       return [...prevSelectedProducts, id];
  //     }
  //   });
  // };
  const handleProductSelect = (id) => {
    setSelectedData((prevSelectedProducts) => {
      let updatedSelectedProducts;
      setTotalSelectedCount(0);
      if (prevSelectedProducts.includes(id)) {
        updatedSelectedProducts = prevSelectedProducts.filter(
          (productId) => productId !== id,
        );

        const removedItem = listData.find((item) => item.documentId === id);
        if (removedItem) {
          setTotalSelectedCount((prevTotal) =>
            Math.max(
              prevTotal - removedItem.ListIdIndividualSelected.length,
              0,
            ),
          );
        }
      } else {
        updatedSelectedProducts = [...prevSelectedProducts, id];
        console.log(updatedSelectedProducts);
        const addedItem = listData.find((item) => item.documentId === id);
        if (addedItem) {
          setTotalSelectedCount(
            (prevTotal) =>
              prevTotal + addedItem.ListIdIndividualSelected.length,
          );
        }
      }
      //console.log(updatedSelectedProducts);
      // if (updatedSelectedProducts.length === 0) {
      //   setTotalSelectedCount(0);
      // }
      return updatedSelectedProducts;
    });
  };

  const columns = [
    {
      title: "Tên sách",
      dataIndex: "bookName",
      key: "bookName",
      filteredValue: filteredInfo.bookName || null,
      filterMode: "search",
      filterSearch: true,
      onFilter: (value, record) => record.bookName.startsWith(value),
      filters: listData.map((item) => ({
        text: item.bookName,
        value: item.bookName,
      })),
    },
    {
      title: "Tác giả",
      dataIndex: "author",
      key: "author",
    },
    {
      title: "Loại sách",
      dataIndex: "typeBook",
      key: "typeBook",
    }, // {
    //   title: "Trạng thái",
    //   dataIndex: "wasLost",
    //   key: "wasLost",
    //   render: (text) => (text !== null ? text ? <Tag color="error">Mất</Tag> : <Tag color="processing">Còn</Tag> : "")
    // },
    // {
    //   title: "Thừa ?",
    //   dataIndex: "redundant",
    //   key: "redundant",
    //   render: (text) => (text ? "Thừa" : "không")
    // },
    // {
    //   title: "Tình trạng",
    //   dataIndex: "nameStatusBook",
    //   key: "nameStatusBook"
    // },
    {
      title: auditReceiptData?.status !== 1 ? "Chọn mã ĐKCB" : "Danh sách ĐKCB",
      dataIndex: "ListIdIndividualSelected",
      key: "ListIdIndividualSelected",
      render: (ListIdIndividualSelected, record) => {
        const arrayIsLiquidation = record?.data?.filter(
          (item) => item?.isLiquidation === false,
        );
        const arrayLiquidation = record?.data?.filter(
          (item) => item?.isLiquidation,
        );
        return auditReceiptData?.status !== 1 ? (
          <Select
            placeholder={"Chọn mã ĐKCB"}
            mode={"multiple"}
            value={ListIdIndividualSelected}
            options={arrayIsLiquidation.map((item) => ({
              label: item?.numIndividual?.split("/")?.at(0),
              value: item?.idIndividual,
            }))}
            dropdownMatchSelectWidth={200}
            maxTagCount={"responsive"}
            style={{
              width: "150px",
            }}
            optionFilterProp={"label"}
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? "")
                .toLowerCase()
                .localeCompare((optionB?.label ?? "").toLowerCase())
            }
            onChange={(value) =>
              handleListIdIndividualChange(record?.documentId, value)
            }
          />
        ) : (
          arrayLiquidation
            ?.map((item) => item?.numIndividual?.split("/")?.at(0))
            .join(", ")
        );
      },
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      key: "price",
      render: (text, record) =>
        auditReceiptData?.status !== 1 ? (
          <InputNumber
            value={text}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            onChange={(value) =>
              handleQuantityChange(record?.documentId, value)
            }
            style={{ width: "100%" }}
          />
        ) : (
          text?.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })
        ),
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      render: (text, record) =>
        auditReceiptData?.status !== 1 ? (
          <Input
            defaultValue={text}
            onChange={(e) =>
              handleNoteChange(record.documentId, e.target.value)
            }
          />
        ) : (
          text
        ),
    },
    {
      title: "Xác nhận",
      render: (_, record) =>
        auditReceiptData?.status !== 1 ? (
          <Checkbox
            checked={selectedData.includes(record?.documentId)}
            onChange={() => {
              handleProductSelect(record?.documentId);
              handleQuantityChange(record?.documentId, record?.price);
            }}
            disabled={
              record?.ListIdIndividualSelected?.length === 0 ||
              !record?.ListIdIndividualSelected?.length
            }
          >
            Xác nhận{" "}
          </Checkbox>
        ) : (
          <Typography.Link>Đã thanh lý</Typography.Link>
        ),
    },
  ];
  const handleLiquidationAuditReceipt = async () => {
    try {
      setBtnLoading(true);
      const data = listData?.filter((item) =>
        selectedData.includes(item?.documentId),
      );
      const formatData = data?.map((item) => ({
        idIndividual: [...item?.ListIdIndividualSelected],
        price: item?.price,
        note: item?.note,
        idAuditReceipt: idReceipt,
      }));
      const result = await auditReceipt.LiquidationAuditReceipt(formatData);
      if (result?.success) {
        setVisible(false);
        setRefreshData((prev) => prev + 1);
        setTotalSelectedCount(0);
        setSelectedData([]);
        setRefresh(!refresh);
        openNotificationWithIcon("success", result?.message);
      } else openNotificationWithIcon("warning", result?.message);
    } catch (e) {
      console.log("err :>> ", e);
    } finally {
      setBtnLoading(false);
    }
  };
  const handleDownloadFileExcel = async () => {
    try {
      setBtnLoading(true);
      const { auditNumber, idAuditReceipt, data } = auditReceiptData;
      const idIndividual = [];
      for (const item of data) {
        for (const nestedItem of item.data) {
          if (nestedItem.isLiquidation === true) {
            idIndividual.push(nestedItem.idIndividual);
          }
        }
      }
      const fileExcel = await analyst.GetFileExcelListIndividualLiquidated(
        auditNumber,
        idIndividual,
        idAuditReceipt,
      );
      const url = window.URL.createObjectURL(new Blob([fileExcel]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "BANG KE THANH LY SACH.xlsx");
      document.body.appendChild(link);
      link.click();
    } catch (e) {
      console.log("err :>> ", e);
    } finally {
      setBtnLoading(false);
    }
  };
  const handleDownloadFileWord = async () => {
    try {
      setBtnLoading(true);
      const [nameSchool, nameDistrict] = await ContactAndIntroduction.read(
        1,
        1,
        2,
      ).then((res) => [res?.at(0)?.col10, res?.at(0)?.col9]);
      const { auditNumber, dataAuditor, reportCreateDate, data } =
        auditReceiptData;
      let quantityBookLiquidation = 0;
      let totalMoney = 0;
      for (const item of data) {
        for (const nestedItem of item.data) {
          if (nestedItem.isLiquidation === true) {
            quantityBookLiquidation++;
            totalMoney += nestedItem.price;
          }
        }
      }
      const reportDate = moment.utc(reportCreateDate);
      const newData = {
        nameSchool: String(nameSchool || "...").toUpperCase(),
        nameDistrict: String(nameDistrict || "...").toUpperCase(),
        numberAudit: auditNumber?.slice(3) || "",
        auditNumber,
        hour: "9",
        minute: "15",
        day: reportDate.format("DD"),
        month: reportDate.format("MM"),
        year: reportDate.format("YYYY"),
        auditorLists: dataAuditor?.map((item, index) => ({
          index: index + 1,
          name: item.name || "",
          position: item.position || "",
          role: item.role || "",
          note: item.note || "",
        })),
        principal: "",
        secretary: "",
        quantityBookLiquidation: quantityBookLiquidation,
        totalMoney: totalMoney?.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        }),
        totalMoneyText: readMoney(totalMoney + ""),
      };
      generateDocument(
        BienBanThanhLySach,
        `Biên bản thanh lý sách ${reportDate.format("DD/MM/YYYY")}.docx`,
        newData,
      );
    } catch (e) {
      console.log("err :>> ", e);
    } finally {
      setBtnLoading(false);
    }
  };
  return (
    <div className="ListBookLiquidation">
      <Spin spinning={loading} size={"large"}>
        <Row>
          <Col span={24}>
            <Table
              scroll={{
                y: 400,
              }}
              rowKey={(record) => record.documentId}
              columns={columns.map((col) =>
                col.title !== "Thao tác"
                  ? { ...col, ellipsis: true, width: 150 }
                  : col,
              )}
              dataSource={listData}
              rowClassName={(record) =>
                selectedData.find((x) => x === record?.documentId)
                  ? "ant-table-row-selected"
                  : ""
              }
              size="small"
              bordered
              loading={loading}
              pagination={{
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} của ${total} kết quả`,
                position: ["bottomCenter"],
                pageSizeOptions: ["10", "20", "30", "50", "100"],
              }}
              onChange={(pagination, filters) => {
                setFilteredInfo(filters);
              }}
            />
            <Space
              direction={"horizontal"}
              style={{
                width: "100%",
                justifyContent: "flex-end",
              }}
              wrap
            >
              <Button
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
                      d="M943.5 179.7H643.2v55.6h88.5v87.9h-88.5v28h88.5v88h-88.5V468h88.5v83.2h-88.5v33.4h88.5V668h-88.5v33.4h88.5v83.9h-88.5v61.2h300.3c4.7-1.4 8.7-7 11.9-16.7 3.2-9.8 4.8-17.7 4.8-23.8V189.8c0-4.8-1.6-7.7-4.8-8.7-3.9-1-7.9-1.5-11.9-1.4z m-39 605.5h-144v-83.8h144.1l-0.1 83.8z m0-117.2h-144v-83.5h144.1l-0.1 83.5z m0-116.8h-144v-82.9h144.1l-0.1 82.9z m0-112h-144v-87.9h144.1l-0.1 87.9z m0-116.5h-144v-87.4h144.1v88l-0.1-0.6zM63.8 165.8v694.7L592.7 952V72L63.8 166.1v-0.3z m313.5 525.5c-2-5.5-11.5-28.6-28.3-69.6-9.7-23.9-19.7-47.8-29.8-71.6h-0.9l-56.7 135-75.8-5.1 89.8-168-82.4-168 77.3-4.1 51.1 131.5h1l57.7-137.5 79.9-5-95.1 181.9 98 185.5-85.8-5z"
                      fill="#327936"
                    ></path>
                  </svg>,
                ]}
                loading={btnLoading}
                disabled={auditReceiptData?.status === 0}
                onClick={() => handleDownloadFileExcel()}
              >
                In biên bản
              </Button>
              <Button
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
                loading={btnLoading}
                disabled={auditReceiptData?.status === 0}
                onClick={() => handleDownloadFileWord()}
              >
                In biên bản
              </Button>
              <Popconfirm
                title={
                  "Bạn có chắc chắn muốn xác nhận thanh lý biên bản này không?"
                }
                onConfirm={() => handleLiquidationAuditReceipt()}
              >
                <Button
                  type={"primary"}
                  icon={<CheckOutlined />}
                  loading={btnLoading}
                  hidden={auditReceiptData?.status === 1}
                  disabled={selectedData.length <= 0}
                >
                  Xác nhận thanh lý {totalSelectedCount} sách
                </Button>
              </Popconfirm>
              {auditReceiptData?.status === 1 && (
                <Button type={"link"}>Biên bản đã được thanh lý</Button>
              )}
            </Space>
          </Col>
        </Row>
      </Spin>
    </div>
  );
}

export const ListBookLiquidation =
  WithErrorBoundaryCustom(_ListBookLiquidation);
