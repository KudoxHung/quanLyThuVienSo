import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import WithErrorBoundaryCustom from "../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { openNotificationWithIcon } from "../../../../client/utils";
import { getImageFilterForSizeImage } from "../../../../client/utils/filterImage";
import { users } from "../../../api";
import { books } from "../../../api/books";
import { documentInVoice } from "../../../api/documentInVoice";
import { individualSample } from "../../../api/individualSample";
import { ModalContent } from "../../../components";
import { generateDocument } from "../../loanSlip";
import { BookLost } from "../components/BookLost";
import { BookRenewal } from "../components/BookRenewal";
import { BookReturn } from "../components/BookReturn";
import { AuditOutlined, FileSyncOutlined, FrownOutlined, PrinterOutlined } from "@ant-design/icons";
import { Avatar, Button, Card, Col, Drawer, Image, List, Popconfirm, Row, Space, Table, Tag, Typography } from "antd";
import moment from "moment";

function _GiveBooksBackLayout() {
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const [Units, setUnits] = useState([]);
  const [ListIdDocument, setListIdDocument] = useState("");
  const [visibleListBooks, setVisibleListBooks] = useState(false);
  const [BooksRecord, setBooksRecord] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingAll, setLoadingAll] = useState(false);
  const [DocumentInVoice, setDocumentInVoice] = useState([]);
  const [Users, setUsers] = useState([]);
  const [UsersNotInDocumentInvoice, setUsersNotInDocumentInvoice] = useState([]);
  const [IndividualSample, setIndividualSample] = useState([]);
  const [Books, setBooks] = useState([]);
  const [btnLoading, setBtnLoading] = useState(false);
  const [postLength, setPostLength] = useState(0);
  const [OpenModalBookRenewal, setOpenModalBookRenewal] = useState(false);
  const [OpenModalBookReturn, setOpenModalBookReturn] = useState(false);
  const [OpenModalBookLost, setOpenModalBookLost] = useState(false);
  const [idSelected, setIdSelected] = useState(null);
  const navigate = useNavigate();
  const [filtersState, setFiltersState] = useState({
    filteredInfo: null,
    sortedInfo: null,
    pagination: null
  });

  const [pagination, setPagination] = useState({
    current: 1, // Trang hiện tại
    pageSize: 6, // Kích thước trang (số lượng mục dữ liệu trên mỗi trang)
    showTotal: (total) => `Tổng số: ${total} bản ghi`,
    showSizeChanger: true,
    showQuickJumper: true,
    total: 0 // Tổng số lượng dữ liệu
  });

  // Hàm gọi API để lấy dữ liệu dựa trên số trang và kích thước trang
  const fetchDocumentInvoice = async (params = {}) => {
    setLoading(true);
    try {
      // documentInVoice
      //   .GetListDocumentInvoiceManyParam(getRandomDocumentInoviceParams(params))
      //   .then((res) => {
      //     setDocumentInVoice(res);
      //     setPagination({
      //       ...params.pagination,
      //       total: res[0]?.total,
      //       showTotal: (total) => `Tổng số: ${total} bản ghi`,
      //       pageSizeOptions: ["6", "10", "20", "50", "100", res[0]?.total]
      //     });
      //     // if (pagination.total === 0) {
      //     //   openNotificationWithIcon("warning", "User này chưa muợn sách");
      //     // }
      //     setLoading(false);
      //   })
      //   .catch((err) => {
      //     openNotificationWithIcon("error", "Lấy phiếu mượn thất bại", err?.response?.data?.message || err?.message);
      //   });
      documentInVoice
        .GetListDocumentInvoiceManyParamTest(getRandomDocumentInoviceParams(params))
        .then((res) => {
          setDocumentInVoice(res.listDocumentInvoice);
          setUsers(res.listUser);
          console.log("res", res);
          setPagination({
            ...params.pagination,
            total: res?.listDocumentInvoice?.[0]?.total ?? 0,
            showTotal: (total) => `Tổng số: ${total} bản ghi`,
            pageSizeOptions: ["6", "10", "20", "50", "100", res?.listDocumentInvoice?.[0]?.total]
          });
          // if (pagination.total === 0) {
          //   openNotificationWithIcon("warning", "User này chưa muợn sách");
          // }
          setLoading(false);
        })
        .catch((err) => {
          openNotificationWithIcon("error", "Lấy phiếu mượn thất bại", err?.response?.data?.message || err?.message);
          setLoading(false);
        });
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setLoading(false);
    }
  };

  const handleTableChange = (newPagination, filters, sorter) => {
    const combinedFilters = { ...filters };

    setFilteredInfo(combinedFilters);
    setSortedInfo(sorter);
    // Lọc dữ liệu dựa trên bộ lọc đã áp dụng (filters)
    const filteredUsers = Users.filter((user) => {
      let isValid = true;

      // Lọc theo userId (hoặc các filters khác nếu có)
      if (combinedFilters.userId) {
        isValid = combinedFilters.userId.includes(user.id);
      }

      return isValid;
    });

    // Cập nhật total sau khi lọc
    const newTotal = filteredUsers.length;

    // Cập nhật pagination với total mới
    const updatedPagination = {
      ...newPagination,
      total: newTotal
    };

    // Gọi fetchDocumentInvoice với các tham số đã Cập nhật
    fetchDocumentInvoice({
      sortField: sorter.field,
      sortOrder: sorter.order,
      pagination: updatedPagination,
      ...filters
    });

    const filtersState = {
      filteredInfo: combinedFilters,
      sortedInfo: sorter,
      pagination: updatedPagination
    };
    setFiltersState(filtersState);

    // Lưu trạng thái vào localStorage
    localStorage.setItem(
      "filtersTraSach",
      JSON.stringify({
        filteredInfo: combinedFilters,
        sortedInfo: sorter,
        pagination: newPagination
      })
    );
  };

  useEffect(() => {
    const savedFilters = JSON.parse(localStorage.getItem("filtersTraSach"));
    console.log("savedFilters", savedFilters);

    setFiltersState(savedFilters);

    if (savedFilters?.filteredInfo) {
      console.log("alo", savedFilters?.filteredInfo);
      setFilteredInfo(savedFilters.filteredInfo);
    }

    if (savedFilters?.sortedInfo) {
      setSortedInfo(savedFilters.sortedInfo);
    }

    if (savedFilters?.pagination) {
      setPagination(savedFilters.pagination);
    }
    fetchDocumentInvoice({
      sortField: savedFilters?.sortedInfo?.field || sortedInfo?.field,
      sortOrder: savedFilters?.sortedInfo?.order || sortedInfo?.order,
      pagination: savedFilters?.pagination ?? pagination,
      ...(savedFilters?.filteredInfo || filteredInfo)
    });
  }, [postLength]);

  // Lấy dữ liệu lần đầu khi component được render
  useEffect(() => {
    fetchDocumentInvoice({ pagination });
  }, [postLength]);

  useEffect(() => {
    document.title = "Trả sách";
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      Promise.allSettled([
        users
          .getAllUnit()
          .then((res) => {
            setUnits(res);
          })
          .catch((err) => {
            openNotificationWithIcon(
              "error",
              "Lấy danh sách đơn vị thất bại",
              err?.reponese?.data?.message || err?.message
            );
          }),

        // users
        //   .getAllUsers(0, 0)
        //   .then((res) => {
        //     setUsers(res);
        //   })
        //   .catch((err) => {
        //     openNotificationWithIcon("error", "Lấy người dùng thất bại", err?.reponese?.data?.message || err?.message);
        //   })
        //   .finally(() => {}),
        // users
        //   .getAllUsersNotInDocumentInvoice(0, 0)
        //   .then((res) => {
        //     setUsers(res);
        //   })
        //   .catch((err) => {
        //     openNotificationWithIcon("error", "Không có người nào mượn", err?.reponese?.data?.message || err?.message);
        //   })
        //   .finally(() => {}),
        individualSample
          .getAll(0, 0)
          .then((res) => {
            setIndividualSample(res);
          })
          .catch((err) => {
            openNotificationWithIcon("error", "Lấy mã cá biệt thất bại", err?.reponese?.data?.message || err?.message);
          })
        // books
        //   .getAll(0, 0, 1)
        //   .then((res) => {
        //     setBooks(res);
        //   })
        //   .catch((err) => {
        //     openNotificationWithIcon("error", "Lấy sách thất bại", err?.reponese?.data?.message || err?.message);
        //   })
        //   .finally(() => {})
      ]).then(() => {
        setLoadingAll(false);
      });
    };
    fetchData();
  }, [postLength]);

  const LoadBookByIdDocument = () => {
    books
      .getAll(0, 0, 1)
      .then((res) => {
        setBooks(res);
        console.log(res);
      })
      .catch((err) => {
        openNotificationWithIcon("error", "Lấy sách thất bại", err?.reponese?.data?.message || err?.message);
      })
      .finally(() => {});
  };
  const getRandomDocumentInoviceParams = (params) => ({
    results: params.pagination?.pageSize,
    page: params.pagination?.current,
    ...params
  });

  const handlePrint = (id) => {
    setBtnLoading(true);
    let tmpListIdDocument = "";
    documentInVoice
      .getById(id)
      .then((respone) => {
        openNotificationWithIcon("success", "Thao tác thành công", "Xuất phiếu mượn thành công");
        // setBooksRecord(respone);
        console.log(respone);
        respone.fullname = Users.find((el) => el.id === respone.userId)?.fullname;
        respone.userCode = Users.find((el) => el.id === respone.userId)?.userCode;
        respone.unitName = Units.find((el) => el.id === Users.find((el) => el.id === respone.userId)?.unitId)?.unitName;
        respone.dateOutEdit = moment(respone.dateOut).format("DD/MM/YYYY HH:mm");
        respone.dateInEdit = moment(respone.dateIn).format("DD/MM/YYYY HH:mm");
        respone.documentAndIndividualView.sort(
          (a, b) =>
            Books.find((el) => el.document.id === a.idDocument)?.document?.docName.length -
            Books.find((el) => el.document.id === b.idDocument)?.document?.docName.length
        );
        respone.table = [
          ...respone.documentAndIndividualView.map((item, index) => ({
            index: index + 1,
            documentName: item?.docName,
            Individual: IndividualSample.find((el) => el.id === item.idIndividual)?.numIndividual.split("/")[0],
            DateIn: moment(respone.documentInvoiceDetail[index].dateIn, "YYYY-MM-DDTHH:mm:ss").format(
              "DD/MM/YYYY HH:mm"
            ),
            DateOut: moment(respone.documentInvoiceDetail[index].dateOut, "YYYY-MM-DDTHH:mm:ss").format(
              "DD/MM/YYYY HH:mm"
            )
          }))
        ];
        setBooksRecord(respone);
        respone.documentAndIndividualView.forEach((item) => {
          tmpListIdDocument = tmpListIdDocument + `,${item.idDocument}`;
        });
        setListIdDocument(tmpListIdDocument);
        books
          .getAll(0, 0, 1, ListIdDocument)
          .then((res) => {
            setBooks(res);
            console.log(res);
          })
          .catch((err) => {
            openNotificationWithIcon("error", "Lấy sách thất bại", err?.reponese?.data?.message || err?.message);
          })
          .finally(() => {});
        console.log("response", respone);
        generateDocument(respone);
      })
      .catch((err) => {
        openNotificationWithIcon("error", "Xuất phiếu mượn thất bại", err?.response?.data?.message || err?.message);
      })
      .finally(() => {
        setBtnLoading(false);
      });
  };
  const seeAvatar = (id) => {
    setBtnLoading(true);
    let tmpListIdDocument = "";
    documentInVoice
      .getById(id)
      .then((respone) => {
        respone.fullname = Users.find((el) => el.id === respone.userId)?.fullname;
        respone.userCode = Users.find((el) => el.id === respone.userId)?.userCode;
        respone.unitName = Units.find((el) => el.id === Users.find((el) => el.id === respone.userId)?.unitId)?.unitName;
        respone.dateOutEdit = moment(respone.dateOut).format("DD/MM/YYYY HH:mm");
        respone.dateInEdit = moment(respone.dateIn).format("DD/MM/YYYY HH:mm");
        respone.documentAndIndividualView.sort(
          (a, b) =>
            Books.find((el) => el.document.id === a.idDocument)?.document?.docName.length -
            Books.find((el) => el.document.id === b.idDocument)?.document?.docName.length
        );
        respone.table = [
          ...respone.documentAndIndividualView.map((item, index) => ({
            index: index + 1,
            documentName: Books.find((el) => el.document.id === item.idDocument)?.document?.docName,
            Individual: IndividualSample.find((el) => el.id === item.idIndividual)?.numIndividual.split("/")[0],
            DateIn: moment(respone.documentInvoiceDetail[index].dateIn, "YYYY-MM-DDTHH:mm:ss").format(
              "DD/MM/YYYY HH:mm"
            ),
            DateOut: moment(respone.documentInvoiceDetail[index].dateOut, "YYYY-MM-DDTHH:mm:ss").format(
              "DD/MM/YYYY HH:mm"
            )
          }))
        ];
        setBooksRecord(respone);

        respone.documentAndIndividualView.forEach((item) => {
          tmpListIdDocument = tmpListIdDocument + `,${item.idDocument}`;
        });

        books
          .getAll(0, 0, 1, tmpListIdDocument)
          .then((res) => {
            setBooks(res);
            console.log(res);
          })
          .catch((err) => {
            openNotificationWithIcon("error", "Lấy sách thất bại", err?.reponese?.data?.message || err?.message);
          })
          .finally(() => {});
        setListIdDocument(tmpListIdDocument);
      })
      .finally(() => setBtnLoading(false));
  };
  const columns = [
    {
      title: "Người mượn",
      dataIndex: "userId",
      key: "userId",
      fixed: "left",
      filters: Users
        ? Array.from(new Set(Users.map((user) => user.id))).map((userId) => ({
            text: Users.find((user) => user.id === userId)?.fullname,
            value: userId
          }))
        : [],
      filteredValue: filtersState?.filteredInfo?.userId || null,
      filterMode: "search",
      filterSearch: true,
      onFilter: (value, record) => {
        return record.userId === value;
      },
      render: (text, record) => Users.find((user) => user.id === record.userId)?.fullname
    },
    {
      title: "Mã người dùng",
      dataIndex: "userCode",
      key: "userCode",
      //filters:uniqueArrayFilterUserCodes,
      filters: Users
        ? Array.from(new Set(Users.map((user) => user.id))).map((userId) => ({
            text: Users.find((user) => user.id === userId)?.userCode,
            value: userId
          }))
        : [],
      filteredValue: filtersState?.filteredInfo?.userCode || null,
      filterMode: "search",
      filterSearch: true,
      onFilter: (value, record) => record.userId?.startsWith(value),

      render: (text, record) => {
        return Users.find((user) => user.id === record.userId)?.userCode;
      }
    },
    {
      title: "Số chứng từ",
      dataIndex: "invoiceCode",
      key: "invoiceCode",
      filters: DocumentInVoice
        ? DocumentInVoice.map((document) => ({
            text: document.invoiceCode,
            value: document.invoiceCode
          }))
        : [],
      filteredValue: filtersState?.filteredInfo?.invoiceCode || null,
      filterMode: "search",
      filterSearch: true,
      onFilter: (value, record) => String(record.invoiceCode) === String(value)
    },
    {
      title: "Sách mượn",
      dataIndex: "documentAndIndividualView",
      key: "documentAndIndividualView",
      render: (text, record) => (
        <Button
          type="dashed"
          onClick={(e) => {
            // LoadBookByIdDocument();
            // console.log("record", record);
            //alert(record.id);
            setVisibleListBooks(true);
            // console.log(record);
            seeAvatar(record.id);
          }}
        >
          Xem sách
        </Button>
      )
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      onFilter: (value, record) => record.note?.startsWith(value)
    },
    {
      title: "Ngày Tạo",
      dataIndex: "createDate",
      key: "createDate",
      filters: DocumentInVoice
        ? DocumentInVoice.map((document) => ({
            text: document.createDate,
            value: document.createDate
          }))
        : [],
      filteredValue: filtersState?.filteredInfo?.createDate || null,
      sorter: (a, b) => a.createDate.length - b.createDate.length,
      sortOrder: sortedInfo.columnKey === "createDate" ? sortedInfo.order : null,
      filterMode: "search",
      filterSearch: true,
      onFilter: (value, record) => record.createDate?.startsWith(value),

      render: (text, record) => moment(record.createDate).format("DD/MM/YYYY HH:mm:ss")
    },
    {
      title: "Tình trạng",
      dataIndex: "status",
      key: "status",
      filters: [
        {
          text: <Tag color="green">Đã trả</Tag>,
          value: 1
        },
        {
          text: <Tag color="yellow">Đang mượn</Tag>,
          value: 0
        },
        {
          text: <Tag color="orange">Đã trả trễ hạn</Tag>,
          value: 2
        },
        {
          text: <Tag color="red">Đã mất</Tag>,
          value: 3
        },
        {
          text: <Tag color="#d62c2c">Đã trả có sách mất</Tag>,
          value: 4
        }
      ],
      filteredValue: filtersState?.filteredInfo?.status || null,
      sorter: (a, b) => a.status.length - b.status.length,
      sortOrder: sortedInfo.columnKey === "status" ? sortedInfo.order : null,
      filterMode: "search",
      filterSearch: true,
      onFilter: (value, record) => Number(record.status) === Number(value),
      render: (text, record) => {
        const obj = {
          0: <Tag color="yellow">Đang mượn</Tag>,
          1: <Tag color="green">Đã trả</Tag>,
          2: <Tag color="orange">Đã trả trễ hạn</Tag>,
          3: <Tag color="red">Đã mất</Tag>,
          4: <Tag color="#d62c2c">Đã trả có sách mất</Tag>
        };
        // const currentDate = moment();
        // //console.log(currentDate);
        // const daysLate = currentDate.diff(record?.dateOut, "days");
        // console.log(rdaysLate);
        const isOutDate = moment().isAfter(record?.dateOut);
        //console.log(isOutDate);
        return isOutDate && record.status === 0 ? <Tag color="#d8b92c">Đang mượn trễ hạn</Tag> : obj[record.status];
      }
    },
    {
      title: "Thao tác",
      render: (_, record) => {
        return (
          <Space size="small">
            <Button
              disabled={record.status === 1 || record.status === 3 || record.status === 2 || record.status === 4}
              type="primary"
              icon={<FileSyncOutlined />}
              onClick={() => {
                setOpenModalBookRenewal(true);
                setIdSelected(record.id);
              }}
              loading={btnLoading}
            >
              Gia hạn
            </Button>

            <Button
              disabled={record.status === 1 || record.status === 3 || record.status === 2 || record.status === 4}
              type="dashed"
              loading={btnLoading}
              icon={<AuditOutlined />}
              onClick={() => {
                setOpenModalBookReturn(true);
                setIdSelected(record.id);
              }}
            >
              Đã trả
            </Button>
            <Button
              disabled={record.status === 1 || record.status === 3 || record.status === 2}
              type="danger"
              loading={btnLoading}
              icon={<FrownOutlined />}
              onClick={() => {
                setOpenModalBookLost(true);
                setIdSelected(record.id);
              }}
            >
              Báo mất sách
            </Button>
            <Popconfirm
              title="Bạn có chắc chắn không ?"
              okText="Có"
              cancelText="Không"
              onConfirm={() => handlePrint(record.id)}
            >
              <Button
                type="primary"
                style={{ backgroundColor: "green" }}
                loading={btnLoading}
                icon={<PrinterOutlined />}
              >
                In phiếu mượn
              </Button>
            </Popconfirm>
          </Space>
        );
      }
    }
  ];

  const { Title } = Typography;

  return (
    <div className="layout-content">
      <ModalContent
        setVisible={setOpenModalBookRenewal}
        visible={OpenModalBookRenewal}
        title={"Gia hạn sách"}
        afterClose={() => {
          setIdSelected(null);
        }}
      >
        <BookRenewal
          id={idSelected}
          setVisiable={setOpenModalBookRenewal}
          postLength1={postLength}
          setPostLength1={setPostLength}
        />
      </ModalContent>
      <ModalContent
        setVisible={setOpenModalBookReturn}
        visible={OpenModalBookReturn}
        title={"Trả sách"}
        afterClose={() => {
          setIdSelected(null);
        }}
      >
        <BookReturn
          id={idSelected}
          setVisiable={setOpenModalBookReturn}
          postLength1={postLength}
          setPostLength1={setPostLength}
        />
      </ModalContent>
      <ModalContent
        setVisible={setOpenModalBookLost}
        visible={OpenModalBookLost}
        title={"Báo mất sách"}
        afterClose={() => {
          setIdSelected(null);
        }}
      >
        <BookLost
          id={idSelected}
          setVisiable={setOpenModalBookLost}
          postLength1={postLength}
          setPostLength1={setPostLength}
        />
      </ModalContent>
      <ListBooks
        setVisibleListBooks={setVisibleListBooks}
        visibleListBooks={visibleListBooks}
        BooksRecord={BooksRecord}
        Books={Books}
        IndividualSample={IndividualSample}
      />
      <Row gutter={[24, 0]}>
        <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
          <Card bordered={false} className="criclebox h-full">
            <Title level={5}>Quản lý lưu thông sách</Title>
            <Table
              scroll={{ x: 400 }}
              columns={columns.map((col) =>
                col.title !== "Thao tác"
                  ? {
                      ...col,
                      ellipsis: true,
                      width: 170
                    }
                  : { ...col, width: "auto" }
              )}
              dataSource={DocumentInVoice}
              loading={loadingAll || loading}
              pagination={pagination}
              onChange={handleTableChange} // Sự kiện thay đổi trang
              rowKey={(record) => record.id} // Khóa duy nhất cho mỗi hàng
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

function ListBooks({ setVisibleListBooks, visibleListBooks, BooksRecord, Books, IndividualSample }) {
  return (
    <Drawer
      title="Danh sách mượn"
      width={520}
      placement="right"
      onClose={(e) => {
        setVisibleListBooks(false);
      }}
      visible={visibleListBooks}
      BooksRecord={BooksRecord}
    >
      <Typography.Title level={5}>Tổng số sách: {BooksRecord?.documentAndIndividualView?.length}</Typography.Title>
      <List
        itemLayout="horizontal"
        dataSource={BooksRecord.documentAndIndividualView}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={
                BooksRecord.documentAndIndividualView.length > 0 ? (
                  <Avatar
                    size={100}
                    shape="square"
                    alt="avatar book"
                    src={
                      <Image
                        src={getImageFilterForSizeImage(
                          Books.find((book) => book.document.id === item.idDocument)?.listAvatar
                        )}
                      ></Image>
                    }
                  ></Avatar>
                ) : (
                  <Avatar />
                )
              }
              title={
                <Link to={`/detail-page/${item.idDocument}`} target="_blank">
                  {Books.find((book) => book.document.id === item.idDocument)?.document?.docName}
                </Link>
              }
              description={`Mã đăng ký cá biệt sách: ${
                IndividualSample.find((indi) => indi.id === item.idIndividual)?.numIndividual.split("/")[0]
              }`}
            />
          </List.Item>
        )}
      />
    </Drawer>
  );
}

export const GiveBooksBackLayout = WithErrorBoundaryCustom(_GiveBooksBackLayout);
