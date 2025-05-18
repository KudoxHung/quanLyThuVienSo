import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useReactToPrint } from "react-to-print";

import avatar from "../../../admin/asset/images/Avatar.png";
import { openNotificationWithIcon } from "../../../client/utils";
import Loading from "../../../client/utils/loading";
import { users } from "../../api";
import { ContactAndIntroduction } from "../../api/contactAndIntroduction";
import { PrinterOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Card, Modal, Progress, Space, Typography } from "antd";
import JsBarcode from "jsbarcode";
import moment from "moment";

import "./PrintLibraryCard.css";

export function PrintLibraryCard() {
  const location = useLocation();
  const { listIdUser } = location.state;

  const [User, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const imageRef = useRef(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [pecent, setPercent] = useState(0);
  const [barCode, setBarCode] = useState(true);
  const [ManagingUnit, setManagingUnit] = useState("");
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  useEffect(() => {
    document.title = "In thẻ thư viện";
  }, []);

  useEffect(() => {
    if (!loading) {
      User?.map((item) => {
        return JsBarcode(`#User_${item?.userCode}`, item?.userCode || "null", {
          format: "CODE128",
          displayValue: true,
          fontSize: 10,
          textMargin: 2,
          fontOptions: "bold",
          textAlign: "center",
          textPosition: "bottom",
          font: "monospace",
          lineColor: "#000",
          width: 0.9,
          height: 18,
        });
      });
    }
    //hùng sửa
    // if (!loading) {
    //   setTimeout(() => {
    //     User?.forEach((item) => {
    //       const userCode = item?.userCode || "null";

    //       // Kiểm tra xem ký tự đầu tiên có phải là số không
    //       const startsWithNumber = /^\d/.test(userCode);
    //       const sanitizedUserCode = startsWithNumber ? `user_${userCode}` : userCode; // Thêm tiền tố nếu cần
    //       const validUserCode = `#${sanitizeId(sanitizedUserCode)}`;

    //       console.log(validUserCode); // Xem ID đã được sửa đổi

    //       const element = document.querySelector(validUserCode);

    //       if (element) {
    //         JsBarcode("abc", userCode, {
    //           format: "CODE128",
    //           displayValue: true,
    //           fontSize: 10,
    //           textMargin: 2,
    //           fontOptions: "bold",
    //           textAlign: "center",
    //           textPosition: "bottom",
    //           font: "monospace",
    //           lineColor: "#000",
    //           width: 0.9,
    //           height: 18
    //         });
    //       } else {
    //         console.error(`Element with ID ${validUserCode} not found`);
    //       }
    //     });
    //   }, 100); // Delay 100ms
    // }
    setBarCode(false);
  }, [User, loading]);
  useEffect(() => {
    if (listIdUser) {
      users
        .MutiplePrintLibraryCards(listIdUser)
        .then((res) => {
          console.log(res);
          setUser(res);
          setLoading(false);
        })
        .catch((err) => {
          openNotificationWithIcon(
            "error",
            "MutiplePrintLibraryCards error",
            err?.response?.data?.message || err?.message,
          );
        });
    }
  }, [listIdUser]);

  useEffect(() => {
    ContactAndIntroduction.read(1, 1, 2)
      .then((res) => {
        setManagingUnit(res[0].col10);
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Lấy thông tin đơn vị thất bại",
          err?.response?.data?.message || err?.message,
        );
      });
  }, []);

  useEffect(() => {
    if (barCode) {
      setIsModalVisible(true);
    }
  }, [barCode]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPercent((percent) => percent + 1);
    }, 500);
    return () => {
      clearInterval(interval);
    };
  });
  const apiUrl = window._env_.REACT_APP_URl_SERVER_APIS;

  if (loading) {
    return (
      <div className="loading">
        <Loading />
      </div>
    );
  } else {
    return (
      <div className="PrintLibraryCard">
        <Modal
          title="Vui lòng chờ..."
          visible={isModalVisible}
          footer={<></>}
          closeIcon={<></>}
        >
          <Typography.Title level={3}>
            {barCode ? "Đang in gáy sách..." : "Đã sẵn sàng in"}
          </Typography.Title>

          <Progress
            strokeColor={{
              from: "#108ee9",
              to: "#87d068",
            }}
            percent={!barCode ? 100 : pecent - 1}
            status={!barCode ? "success" : "active"}
          />
          <Button
            disabled={barCode}
            type="primary"
            icon={<PrinterOutlined />}
            onClick={(e) => {
              setIsModalVisible(false);
              handlePrint();
            }}
          >
            In
          </Button>
        </Modal>
        <div className="PrintLibraryCard-wrapper" ref={componentRef}>
          {User?.map((item, index) => (
            <div className={"group-of-books"} style={{ paddingTop: "20px" }}>
              {/*{index % 9 === 0 && index !== 0 && <div className="page-break"></div>}*/}
              <Card
                key={item.id}
                className="criclebox h-full PrintLibraryCard-card"
              >
                <Space
                  direction="vertical"
                  size="small"
                  style={{
                    width: "100%",
                  }}
                >
                  <p
                    style={{
                      textAlign: "center",
                      fontWeight: 900,
                      fontSize: 10,
                      margin: 0,
                    }}
                  >
                    {ManagingUnit}
                  </p>
                  <p
                    style={{
                      textAlign: "center",
                      fontWeight: 700,
                      fontSize: 16,
                      margin: 0,
                    }}
                  >
                    THẺ THƯ VIỆN
                  </p>
                  <Space
                    direction="horizontal"
                    size="small"
                    style={{
                      width: "100%",
                    }}
                    align="start"
                  >
                    <Space size="small" direction={"vertical"}>
                      <Avatar
                        ref={imageRef}
                        src={
                          item.avatar
                            ? `${apiUrl}/api/Book/GetFileAvatar?fileNameId=${item?.avatar}`
                            : avatar
                        }
                        style={{ marginLeft: 10, border: "1px solid #0a0a0a" }}
                        size={80}
                        shape="square"
                        alt="avatar"
                        icon={<UserOutlined />}
                      />
                      <svg id={`User_${item?.userCode}`}></svg>
                    </Space>
                    <Space
                      direction="vertical"
                      size="small"
                      style={{ marginLeft: 10, gap: 0 }}
                    >
                      <span>Họ tên: {item?.fullName}</span>
                      <span>Lớp: {item?.unitName}</span>
                      <span>
                        Năm học:{" "}
                        {` ${moment(new Date()).format("YYYY")} - ${Number(moment(new Date()).format("YYYY")) + 1}`}
                      </span>
                    </Space>
                  </Space>
                </Space>
              </Card>
            </div>
          ))}
        </div>
        <Space
          style={{ marginTop: 10, width: "100%", justifyContent: "center" }}
        >
          <Button
            type={"primary"}
            onClick={() => handlePrint()}
            icon={<PrinterOutlined />}
          >
            In tất cả thẻ
          </Button>
        </Space>
      </div>
    );
  }
}
