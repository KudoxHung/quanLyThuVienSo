import React, { Fragment, useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";

import { openNotificationWithIcon } from "../../../client/utils";
import { ContactAndIntroduction } from "../../api/contactAndIntroduction";
import { individualSample } from "../../api/individualSample";
import { PrinterOutlined } from "@ant-design/icons";
import { Button, Modal, Progress, Skeleton, Typography } from "antd";
import JsBarcode from "jsbarcode";

import "./PrintSpineOld.css";
import "./PrintSpine.css";

export function PrintSpineAll() {
  const param = useParams();
  const location = useLocation();
  const [listIndividualSample, setListIndividualSample] = useState([
    ...Array(25 * 2),
  ]);
  const [arrBarCode, setArrBarCode] = useState([]);
  const [barCode, setBarCode] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [pecent, setPercent] = useState(0);
  const [ManagingUnit, setManagingUnit] = useState("");
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  useEffect(() => {
    document.title = "In gáy sách";
  }, []);

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
    setLoading(true);
    const ListID = location?.state?.ListIdIndividual.join(",");
    individualSample
      .GetSpineByListIdIndividual(ListID)
      .then((res) => {
        const arrTemp = [];
        // res.forEach((item, index, arr) => {
        //   if (index % 30 === 0) {
        //     arrTemp.push(arr.slice(index, index + 30));
        //   }
        // });
        console.log(res);
        setListIndividualSample(res);
        setArrBarCode(res);
        setLoading(false);
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "getAllUnit error",
          err?.response?.data?.message || err?.message,
        );
        setLoading(false);
      });
  }, [param, location.state]);

  useEffect(() => {
    if (!loading) {
      const arr = [];
      arrBarCode.forEach((items) => {
        items.listSpine.forEach((item) => {
          arr.push(item);
        });
      });
      arr.forEach((item) => {
        JsBarcode(`#codeSpine-${item?.barcode}`, item?.barcode, {
          format: "CODE128",
          displayValue: true,
          fontSize: 8,
          textMargin: 2,
          fontOptions: "bold",
          textAlign: "center",
          textPosition: "bottom",
          font: "monospace",
          lineColor: "#000",
          width: 0.7,
          height: 17,
          background: "transparent",
        });
      });

      setBarCode(false);
    }
  }, [loading, arrBarCode]);

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

  return (
    <div>
      <div style={{ width: 1000, height: 842, padding: 35 }}>
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
              setTimeout(() => {
                window.print();
              }, 2000);
            }}
          >
            In (vui lòng in khổ Ngang)
          </Button>
        </Modal>
        {/* Spine old */}
        {param.typeSpine === "101" &&
          listIndividualSample.map((items, index) => (
            <div>
              <div
                className={"group-of-books"}
                key={index}
                style={{ marginBottom: 15 }}
              >
                <Typography.Title
                  className={"printTitle"}
                  level={5}
                  style={{ marginLeft: 10 }}
                >
                  {items?.title} ({items?.listSpine?.length} quyển)
                </Typography.Title>
                <div
                  className="PrintSpineOld"
                  style={{
                    //display: "grid",
                    //gridTemplateColumns: "repeat(5, 1fr)",
                    gap: "15px",
                    padding: 5,
                    marginTop: 5,
                  }}
                >
                  {items?.listSpine?.map((item) => (
                    <div className="book-spine-old">
                      <Skeleton
                        active
                        avatar
                        paragraph={{ rows: 1 }}
                        loading={loading}
                      >
                        <div className="book-spine-old-left">
                          <div className="book-spine-old-left-top">
                            <div className="book-spine-old-left-barcode">
                              <svg id={`codeSpine-${item?.barcode}`}></svg>
                            </div>
                          </div>
                        </div>
                        <div className="book-spine-old-right">
                          <div className="book-spine-old-right-top">
                            <p className="book-spine-old-right-schoolName">
                              {ManagingUnit}
                            </p>
                            <p className="book-spine-old-right-number">
                              {item?.numIndividual.split("/")[0]}
                            </p>
                            <p className="book-spine-old-right-line"></p>
                            <p className="book-spine-old-right-code">
                              {item?.nametypeBook}
                            </p>
                            <p className="book-spine-old-right-nameCategorySign">
                              {item?.nameCategorySign}
                            </p>
                          </div>
                        </div>
                      </Skeleton>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        {/* Spine old */}
        {param.typeSpine === "102" &&
          listIndividualSample.map((items, index) => (
            <div>
              <div
                className={"group-of-books"}
                key={index}
                style={{ marginBottom: 15 }}
              >
                <Typography.Title level={5} style={{ marginLeft: 10 }}>
                  {items?.title} ({items?.listSpine?.length} quyển)
                </Typography.Title>
                <div
                  className="PrintSpineOld"
                  style={{
                    //display: "grid",
                    //gridTemplateColumns: "repeat(5, 1fr)",
                    gap: "15px",
                    padding: 5,
                    marginTop: 5,
                  }}
                >
                  {items?.listSpine?.map((item) => (
                    <div className="book-spine-old">
                      <Skeleton
                        active
                        avatar
                        paragraph={{ rows: 1 }}
                        loading={loading}
                      >
                        <div className="book-spine-old-left">
                          <div className="book-spine-old-left-top">
                            <div className="book-spine-old-left-barcode">
                              <svg id={`codeSpine-${item?.barcode}`}></svg>
                            </div>
                          </div>
                        </div>
                        <div className="book-spine-old-right">
                          <div className="book-spine-old-right-top">
                            <p className="book-spine-old-right-schoolName">
                              {ManagingUnit}
                            </p>
                            <p
                              className="book-spine-old-right-nameCategorySign"
                              style={{
                                marginBottom: "14px",
                                padding: 0,
                                fontWeight: "800",
                                fontSize: "12px",
                              }}
                            >
                              {item?.nameCategorySign}
                            </p>
                            <p className="book-spine-old-right-line"></p>
                            <p className="book-spine-old-right-code">
                              {item?.nametypeBook}
                            </p>
                            <p
                              className="book-spine-old-right-number"
                              style={{
                                marginBottom: 0,
                                fontWeight: "bold",
                                fontSize: "10px",
                              }}
                            >
                              {item?.numIndividual.split("/")[0]}
                            </p>
                          </div>
                        </div>
                      </Skeleton>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}{" "}
        {/* Spine old */}
        {param.typeSpine === "103" &&
          listIndividualSample.map((items, index) => (
            <div>
              <div
                className={"group-of-books"}
                key={index}
                style={{ marginBottom: 15 }}
              >
                <Typography.Title level={5} style={{ marginLeft: 10 }}>
                  {items?.title} ({items?.listSpine?.length} quyển)
                </Typography.Title>
                <div
                  className="PrintSpineOld"
                  style={{
                    //display: "grid",
                    //gridTemplateColumns: "repeat(5, 1fr)",
                    gap: "15px",
                    padding: 5,
                    marginTop: 5,
                  }}
                >
                  {items?.listSpine?.map((item) => (
                    <div className="book-spine-old2">
                      <Skeleton
                        active
                        avatar
                        paragraph={{ rows: 1 }}
                        loading={loading}
                      >
                        <div className="book-spine-old-right2">
                          <p className="book-spine-old-right-schoolName">
                            {ManagingUnit}
                          </p>
                          <p
                            className="book-spine-old-right-nameCategorySign"
                            style={{
                              marginBottom: "14px",
                              padding: 0,
                              fontWeight: "800",
                              fontSize: "12px",
                            }}
                          >
                            {item?.nameCategorySign}
                          </p>
                          <p className="book-spine-old-right2-line"></p>
                          <p className="book-spine-old-right-code">
                            {item?.nametypeBook}
                          </p>
                          <p
                            className="book-spine-old-right-number"
                            style={{
                              marginBottom: 0,
                              fontWeight: "bold",
                              fontSize: "10px",
                            }}
                          >
                            {item?.numIndividual.split("/")[0]}
                          </p>
                          <svg id={`codeSpine-${item?.barcode}`}></svg>
                        </div>
                      </Skeleton>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}{" "}
        {/* Spine old */}
        {param.typeSpine === "104" &&
          listIndividualSample.map((items, index) => (
            <div>
              <div
                className={"group-of-books"}
                key={index}
                style={{ marginBottom: 15 }}
              >
                <Typography.Title level={5} style={{ marginLeft: 10 }}>
                  {items?.title} ({items?.listSpine?.length} quyển)
                </Typography.Title>
                <div
                  className="PrintSpineOld"
                  style={{
                    //display: "grid",
                    //gridTemplateColumns: "repeat(5, 1fr)",
                    gap: "15px",
                    padding: 5,
                    marginTop: 5,
                  }}
                >
                  {items?.listSpine?.map((item) => (
                    <div className="book-spine-old">
                      <Skeleton
                        active
                        avatar
                        paragraph={{ rows: 1 }}
                        loading={loading}
                      >
                        <div className="book-spine-old-left">
                          <div className="book-spine-old-left-top">
                            <div className="book-spine-old-left-barcode">
                              <svg id={`codeSpine-${item?.barcode}`}></svg>
                            </div>
                          </div>
                        </div>
                        <div className="book-spine-old-right">
                          <div className="book-spine-old-right-top">
                            <p className="book-spine-old-right-schoolName">
                              {ManagingUnit}
                            </p>
                            <p className="book-spine-old-right-number">
                              {item?.numIndividual.split("/")[0]}
                            </p>
                            <p className="book-spine-old-right-line"></p>
                            <p className="book-spine-old-right-code">
                              {item?.nametypeBook}
                            </p>
                            <p className="book-spine-old-right-nameCategorySign">
                              {item?.colorName ?? item?.nameCategorySign}
                            </p>
                          </div>
                        </div>
                      </Skeleton>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        {/* Spine new */}
        {param.typeSpine === "2" &&
          listIndividualSample.map((items, index) => (
            <div>
              <div
                className={"group-of-books"}
                key={index}
                style={{ marginBottom: 15 }}
              >
                <Typography.Title level={5} style={{ marginLeft: 10 }}>
                  {items?.title} ({items?.listSpine?.length} quyển)
                </Typography.Title>
                <div
                  className="PrintSpine"
                  style={{
                    //display: "grid",
                    //gridTemplateColumns: "repeat(5, 1fr)",
                    gap: "15px",
                    padding: 5,
                    marginTop: 5,
                  }}
                  key={index}
                >
                  {items?.listSpine?.map((item) => (
                    <div className="book-spine">
                      <Skeleton
                        active
                        avatar
                        paragraph={{ rows: 1 }}
                        loading={loading}
                      >
                        <div className="book-spine-left">
                          <div className="book-spine-left-top">
                            <div className="book-spine-left-barcode">
                              {item?.numIndividual.split("/")[0]}
                            </div>
                          </div>
                        </div>
                        <div className="book-spine-right">
                          <div className="book-spine-right-top">
                            {/* <p className='book-spine-right-schoolName'>
                      {ManagingUnit}
                    </p> */}
                            <p className="book-spine-right-nameCategorySign">
                              {item?.nameCategorySign}
                            </p>
                            <p className="book-spine-right-code">
                              {item?.encryptCode}
                            </p>

                            <p className="book-spine-right-line"></p>
                            <p className="book-spine-right-number">
                              <svg id={`codeSpine-${item?.barcode}`}></svg>
                            </p>
                          </div>
                        </div>
                      </Skeleton>
                    </div>
                  ))}
                </div>
                {/* <Divider /> */}
              </div>
            </div>
          ))}
        {/*<Space style={{ marginTop: 10, width: "100%", justifyContent: "center" }}>*/}
        {/*  <Button type={"primary"} onClick={() => handlePrint()} icon={<PrinterOutlined />}>*/}
        {/*    In tất cả thẻ*/}
        {/*  </Button>*/}
        {/*</Space>*/}
      </div>
    </div>
  );
}
