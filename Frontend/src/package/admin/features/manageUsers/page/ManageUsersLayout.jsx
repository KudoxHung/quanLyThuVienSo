import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import WithErrorBoundaryCustom from "../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import avatar from "../../../../admin/asset/images/Avatar.png";
import { getCookie, openNotificationWithIcon } from "../../../../client/utils";
import { users } from "../../../api";
import { ContactAndIntroduction } from "../../../api/contactAndIntroduction";
import {
  DeleteOutlined,
  EditOutlined,
  PrinterOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  Tooltip,
  Typography,
  Upload,
} from "antd";
import ImgCrop from "antd-img-crop";
import JsBarcode from "jsbarcode";
import moment from "moment";

import "./style.css";

function _ManageUsersLayout() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [Users, setUsers] = useState([]);
  const [idUnitSelect, setIdUnitSelect] = useState("");
  const [idUnitSelectForChangePassword, setIdUnitSelectForChangePassword] =
    useState("");
  const [userUnits, setUserUnits] = useState([]);
  const [userTypes, setUserTypes] = useState([]);
  const [btnLoading, setBtnLoading] = useState(false);
  const [postLength, setPostLength] = useState(0);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [UserRecord, setUserRecord] = useState({});
  const [filters, setFilters] = useState(null);
  const [sorters, setSorters] = useState(null);
  const [filtersState, setFiltersState] = useState({
    filteredInfo: null,
    sortedInfo: null,
    pagination: null,
  });
  const [isOpenModalUpdateCardToUnit, setIsOpenModalUpdateCardToUnit] =
    useState(false);
  const [IsOpenModalChangePasswordByUnit, setIsOpenModalChangePasswordByUnit] =
    useState(false);

  const getRandomuserParams = (params) => ({
    results: params.pagination?.pageSize,
    page: params.pagination?.current,
    ...params,
  });
  const searchInput = useRef(null);
  const handleSearch = (confirm) => {
    confirm();
  };
  const handleReset = (clearFilters) => {
    clearFilters();
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div
        style={{
          padding: 8,
        }}
      >
        <Input
          ref={searchInput}
          placeholder={`Tìm theo ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(confirm)}
            icon={<SearchOutlined />}
            size="small"
          >
            Tìm
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
          >
            Cài lại
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
            }}
          >
            Lọc
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
  });
  // getColumnSearchDateProps
  const getColumnSearchDateProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div
        style={{
          padding: 8,
        }}
      >
        <DatePicker
          ref={searchInput}
          placeholder={`Tìm theo ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e ? [e] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(confirm)}
            icon={<SearchOutlined />}
            size="small"
          >
            Tìm
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
          >
            Cài lại
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
            }}
          >
            Lọc
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
  });

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 6,
    showTotal: (total) => `Tổng số: ${total} bản ghi`,
    showSizeChanger: true,
    showQuickJumper: true,
  });

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const fetchData = (params = {}) => {
    setLoading(true);
    users
      .GetListUserManyParam(getRandomuserParams(params))
      .then((res) => {
        setUsers(res);
        setPagination({
          ...params.pagination,
          total: res[0]?.total ?? 0,
          showTotal: (total) => `Tổng số: ${total} bản ghi`,
          pageSizeOptions: ["6", "10", "20", "50", "100", res[0]?.total ?? 0],
        });
        setLoading(false);
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Thất bại",
          err?.response?.data?.message || err?.message,
        );
      });
  };

  const handleTableChange = (newPagination, newFilters, sorter) => {
    console.log("newPagination", newPagination);

    // Gộp bộ lọc cũ và mới, chỉ ghi đè nếu giá trị mới không phải null
    const combinedFilters = { ...newFilters };
    // Cập nhật bộ lọc, sắp xếp và phân trang
    setFilters(combinedFilters);
    setSorters(sorter);

    fetchData({
      sortField: sorter.field,
      sortOrder: sorter.order,
      pagination: newPagination,
      ...combinedFilters,
    });

    const filtersState = {
      filteredInfo: combinedFilters,
      sortedInfo: sorter,
      pagination: newPagination,
    };
    setFiltersState(filtersState);

    // Lưu trạng thái vào localStorage
    localStorage.setItem(
      "filters",
      JSON.stringify({
        filteredInfo: combinedFilters,
        sortedInfo: sorter,
        pagination: newPagination,
      }),
    );

    console.log("Updated filters:", combinedFilters);
  };

  useEffect(() => {
    const savedFilters = JSON.parse(localStorage.getItem("filters"));
    console.log("savedFilters", savedFilters);

    setFiltersState(savedFilters);

    if (savedFilters?.filteredInfo) {
      console.log("alo", savedFilters?.filteredInfo);
      setFilters(savedFilters.filteredInfo);
    }

    if (savedFilters?.sortedInfo) {
      setSorters(savedFilters.sortedInfo);
    }

    if (savedFilters?.pagination) {
      setPagination(savedFilters.pagination);
    }
    fetchData({
      sortField: savedFilters?.sortedInfo?.field || sorters?.field,
      sortOrder: savedFilters?.sortedInfo?.order || sorters?.order,
      pagination: savedFilters?.pagination ?? pagination,
      ...(savedFilters?.filteredInfo || filters),
    });
  }, [postLength]);

  useEffect(() => {
    const fetchData = async () => {
      Promise.all([
        users
          .getAllUnit()
          .then((res) => {
            setUserUnits(res);
          })
          .catch((err) => {
            openNotificationWithIcon(
              "error",
              "Lấy danh sách đơn vị thất bại",
              err?.response?.data?.message || err?.message,
            );
          }),
        users
          .getAllUserType()
          .then((res) => {
            setUserTypes(res);
          })
          .catch((err) => {
            openNotificationWithIcon(
              "error",
              "Lấy danh sách loại tài khoản thất bại",
              err?.response?.data?.message || err?.message,
            );
          }),
      ]);
    };
    fetchData();
  }, []);
  useEffect(() => {
    document.title = "Quản lý tài khoản";
  }, []);

  const handleDelete = (id) => {
    setBtnLoading(true);
    users
      .removeUser(id)
      .then((res) => {
        openNotificationWithIcon("success", "Xóa thành công", res?.message);
        setBtnLoading(false);
        console.log("kt", res);
        fetchData({
          sortField: sorters?.field ?? "defaultField",
          sortOrder: sorters?.order ?? "ascend",
          pagination: pagination,
          ...filters,
        });
        // setPostLength(postLength - 1);
      })
      .catch((err) => {
        console.log("kt", 1);
        openNotificationWithIcon(
          "error",
          "Xóa thất bại",
          err?.response?.data?.message || err?.message,
        );
      })
      .finally(() => {
        setBtnLoading(false);
        fetchData({
          sortField: sorters?.field ?? "defaultField",
          sortOrder: sorters?.order ?? "ascend",
          pagination: pagination,
          ...filters,
        });
      });
  };
  const handleActive = (email, code) => {
    setBtnLoading(true);
    users
      .activeUserByCode(email, code)
      .then((res) => {
        openNotificationWithIcon(
          "success",
          "kích hoạt thành công",
          res?.message,
        );
        setBtnLoading(false);
        setPostLength(postLength - 1);
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Kích hoạt thất bại",
          err?.response?.data?.message || err?.message,
        );
        setBtnLoading(false);
      });
  };
  const handleBlocked = (id) => {
    setBtnLoading(true);
    users
      .blockAccountUser(id, true)
      .then((res) => {
        openNotificationWithIcon("success", "Chặn thành công", res?.message);
        setBtnLoading(false);
        setPostLength(postLength - 1);
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Chặn thất bại",
          err?.response?.data?.message || err?.message,
        );
        setBtnLoading(false);
      });
  };
  const handleUnBlocked = (id) => {
    setBtnLoading(true);
    users
      .blockAccountUser(id, false)
      .then((res) => {
        openNotificationWithIcon(
          "success",
          "Hủy chặn thành công",
          res?.message,
        );
        setBtnLoading(false);
        setPostLength(postLength - 1);
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Hủy chặn thất bại",
          err?.response?.data?.message || err?.message,
        );
        setBtnLoading(false);
      });
  };
  const handleCancel = () => setPreviewVisible(false);

  const handleUpdateManyCardByUnit = async (values) => {
    setBtnLoading(true);
    try {
      values.effectiveDate = moment(values.effectiveDate).format("DD/MM/YYYY");
      values.expirationDate = moment(values.expirationDate).format(
        "DD/MM/YYYY",
      );
      const res = await users.UpdateUserExpireDateByUnit(values);
      if (res.success) {
        openNotificationWithIcon("success", "Thành công", res?.message);
        setPostLength(postLength + 1);
        setIsOpenModalUpdateCardToUnit(false);
      }
    } catch (error) {
      openNotificationWithIcon(
        "error",
        "Thất bại",
        error?.response?.data?.message || error?.message,
      );
    } finally {
      setBtnLoading(false);
    }
  };

  const handleUpdateManyPasswordByUnit = async (values) => {
    // Chỗ này dùng để xử lý thay đổi mật khẩu hàng loạt

    for (const selectedRowKey of selectedRowKeys) {
      console.log("Id User:" + selectedRowKey);
    }
    users
      .ChangePasswordAllUserByListUser(selectedRowKeys)
      .then((res) => {
        openNotificationWithIcon("success", "Thành công", res?.message);
        setPostLength(postLength + 1);
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Lỗi",
          err?.response?.data?.message || err?.message,
        );
      })
      .finally(() => {
        setBtnLoading(false);
      });
  };

  const handlePrintManyLibraryCard = () => {
    navigate("/Print/PrintLibraryCard", {
      state: { listIdUser: selectedRowKeys },
    });
  };

  // const props = {
  //   name: "file",
  //   customRequest: async (options) => {
  //     try {
  //       setBtnLoading(true);
  //       const formData = new FormData();
  //       formData.append("file", options.file);
  //      const res = await users.InsertUserByExcel(formData);

  //       if (res.type === "application/json") {
  //         console.log("kt", res.data.text());
  //         openNotificationWithIcon("success", "Lấy mẫu excel thêm người dùng thành công");
  //       } else {
  //         const blob = new Blob([res], {
  //           type: "application/vnd.ms-excel"
  //         });
  //         const url = window.URL.createObjectURL(blob);
  //         const link = document.createElement("a");
  //         link.href = url;
  //         link.setAttribute("download", `Danh sách tài khoản không được thêm vào hệ thống.xlsx`);
  //         document.body.appendChild(link);
  //         link.click();
  //         link.remove();
  //         openNotificationWithIcon(
  //           "info",
  //           "Thông báo",
  //           "Có 1 số email trùng với email đã có trong hệ thống bị từ chối, dưới đây là danh sách email bị từ chối",
  //           0
  //         );
  //       }
  //       options.onSuccess(res, options.file);
  //       setPostLength(postLength + 1);
  //     } catch (error) {
  //       openNotificationWithIcon("error", "Thêm thất bại", error?.response?.data?.message || error?.message);
  //     }
  //     setBtnLoading(false);
  //   }
  // };
  const apiUrl = window._env_.REACT_APP_URl_SERVER_APIS;

  const props = {
    accept: ".xlsx, .xls, .xlsm",
    name: "file",
    action: `${apiUrl}/api/User/InsertUserByExcel`,
    headers: {
      Authorization: `Bearer ${getCookie("jwt")}`,
    },
    showUploadList: false,
    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }

      if (info.file.status === "done") {
        console.log("result", info.file.response);
        if (info.file.response.success == false) {
          // openNotificationWithIcon(info.file.response.message);
          openNotificationWithIcon("error", info.file.response.message);
        } else {
          openNotificationWithIcon(
            "success",
            "Lấy biểu mẫu excel thêm mới sách thành công",
          );
        }

        setPostLength(postLength + 1);
      } else if (info.file.status === "error") {
        openNotificationWithIcon(
          "error",
          "Lấy biểu mẫu excel thêm mới sách không thành công.",
        );
      }
    },
    progress: {
      strokeColor: {
        "0%": "#108ee9",
        "100%": "#87d068",
      },
      strokeWidth: 3,
      format: (percent) => percent && `${parseFloat(percent.toFixed(2))}%`,
    },
  };
  const columns = [
    {
      title: "Họ và tên",
      dataIndex: "fullname",
      key: "fullname",
      fixed: "left",
      ...getColumnSearchProps("fullname"),
      filteredValue: filtersState?.filteredInfo?.fullname || null, // Thiết lập giá trị từ state
    },
    {
      title: "Ảnh đại diện",
      render: (text, record) => (
        <ImgCrop
          rotate
          modalTitle="Chỉnh ảnh"
          modalOk="Xác nhận"
          modalCancel="Hủy"
          aspect={3 / 4}
          grid={true}
        >
          <Upload
            accept="image/png, image/jpeg, image/jpg"
            name="avatar"
            maxCount={1}
            showUploadList={false}
            customRequest={(options) => {
              setBtnLoading(true);
              const data = new FormData();
              data.append("lstIdUser", record.id);
              data.append("File", options.file);
              users
                .UpdateImageUsers(data)
                .then((res) => {
                  openNotificationWithIcon(
                    "success",
                    "Thành công",
                    res?.message,
                  );
                  setPostLength(postLength + 1);
                })
                .catch((err) => {
                  openNotificationWithIcon(
                    "error",
                    "Lỗi",
                    err?.response?.data?.message || err?.message,
                  );
                })
                .finally(() => {
                  setBtnLoading(false);
                });
            }}
          >
            <Button
              style={{ borderColor: "blue", color: "blue" }}
              icon={[
                <svg
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                >
                  <path
                    fill="blue"
                    d="M512 85.333333c235.52 0 426.666667 191.146667 426.666667 426.666667s-191.146667 426.666667-426.666667 426.666667S85.333333 747.52 85.333333 512 276.48 85.333333 512 85.333333z m0 85.333334c-188.373333 0-341.333333 152.96-341.333333 341.333333s152.96 341.333333 341.333333 341.333333 341.333333-152.96 341.333333-341.333333-152.96-341.333333-341.333333-341.333333z m0 597.333333c-84.010667 0-161.450667-34.858667-213.333333-93.098667 26.154667-39.68 121.941333-77.568 213.333333-77.568s187.178667 37.888 213.333333 77.568C673.450667 733.141333 596.010667 768 512 768z m0-469.333333c70.826667 0 128 57.173333 128 128s-57.173333 128-128 128-128-57.173333-128-128 57.173333-128 128-128z"
                  ></path>
                </svg>,
              ]}
              loading={btnLoading}
            >
              Tải ảnh lên
            </Button>
          </Upload>
        </ImgCrop>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ...getColumnSearchProps("email"),
      filteredValue: filtersState?.filteredInfo?.email || null,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      ...getColumnSearchProps("phone"),
      filteredValue: filtersState?.filteredInfo?.phone || null,
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      ellipsis: true,
      render: (address) => (
        <Tooltip placement="topLeft" title={address}>
          {address}
        </Tooltip>
      ),
      ...getColumnSearchProps("address"),
      filteredValue: filtersState?.filteredInfo?.address || null,
    },
    {
      title: "Ngày Tạo",
      dataIndex: "createdDate",
      key: "createdDate",
      ...getColumnSearchDateProps("createdDate"),
      sorter: true,

      render: (createdDate) =>
        moment(createdDate).format("DD/MM/YYYY HH:mm:ss"),
    },
    {
      title: "Ngày hiệu lực",
      dataIndex: "acitveUser",
      key: "acitveUser",
      render: (x) => moment(x).format("DD/MM/YYYY"),
    },
    {
      title: "Ngày hết hạn",
      dataIndex: "expireDayUser",
      key: "expireDayUser",
      render: (x) => moment(x).format("DD/MM/YYYY"),
    },
    {
      title: "Mã kích hoạt",
      dataIndex: "activeCode",
      key: "activeCode",
    },
    {
      title: "Loại tài khoản",
      dataIndex: "userTypeId",
      key: "userTypeId",
      render: (userTypeId) => {
        return userTypes.find((userType) => userType.id === userTypeId)
          ?.typeName;
      },
      filters: userTypes.map((type) => ({
        text: type.typeName,
        value: type.id,
      })),
      filteredValue: filtersState?.filteredInfo?.userTypeId || null,
      filterSearch: true,
    },
    {
      title: "Đơn vị lớp học, phòng ban",
      dataIndex: "unitId",
      key: "unitId",
      render: (unitId) => {
        return userUnits.find((userType) => userType.id === unitId)?.unitName;
      },
      filters: userUnits.map((unit) => ({
        text: unit.unitName,
        value: unit.id,
      })),
      filteredValue: filtersState?.filteredInfo?.unitId || null,
      filterSearch: true,
    },
    {
      title: "Xem thẻ",
      render: (_, record) => {
        return (
          <Button
            type="dashed"
            onClick={(e) => {
              setPreviewVisible(true);
              setUserRecord(record);
            }}
            loading={btnLoading}
          >
            Xem thẻ
          </Button>
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "isActive",

      render: (_, record) => {
        return !record.isActive ? (
          <Button
            type="primary"
            onClick={(e) => handleActive(record.email, record.activeCode)}
            loading={btnLoading}
          >
            Kích hoạt
          </Button>
        ) : (
          <Typography.Title level={5} type="success">
            Đã kích hoạt
          </Typography.Title>
        );
      },
    },
    {
      title: "Phân quyền",
      render: (_, record) => {
        return record.email !== "admin@gmail.com" ? (
          <Button
            type="dashed"
            onClick={(e) => {
              navigate(`/admin/tai-khoan/phan-quyen/${record.id}`, {
                state: { userName: record.fullname, email: record.email },
              });
            }}
            loading={btnLoading}
          >
            Phân quyền
          </Button>
        ) : (
          <Button type="dashed" loading={btnLoading} disabled>
            Phân quyền
          </Button>
        );
      },
    },
    {
      title: "Thao tác",
      render: (_, record) => {
        return record.email !== "admin@gmail.com" ? (
          <Space size="small">
            <Button
              type="primary"
              onClick={(e) => {
                e.preventDefault();
                navigate(`/admin/tai-khoan/edit/${record.id}`);
              }}
              icon={<EditOutlined />}
            >
              Chỉnh sửa
            </Button>
            <Popconfirm
              title="Bạn có chắc chắn không ?"
              okText="Có"
              cancelText="Không"
              onConfirm={() => handleDelete(record.id)}
            >
              <Button
                type="danger"
                loading={btnLoading}
                icon={<DeleteOutlined />}
              >
                Xóa
              </Button>
            </Popconfirm>
            {!record.isLocked ? (
              <Button
                type="default"
                loading={btnLoading}
                onClick={(e) => {
                  handleBlocked(record.id);
                }}
              >
                Chặn
              </Button>
            ) : (
              <Button
                type="default"
                loading={btnLoading}
                onClick={(e) => {
                  handleUnBlocked(record.id);
                }}
              >
                Bỏ Chặn
              </Button>
            )}
          </Space>
        ) : (
          <Space size="small">
            <Button type="primary" icon={<EditOutlined />} disabled>
              Chỉnh sửa
            </Button>
            <Button type="danger" icon={<DeleteOutlined />} disabled>
              Xóa
            </Button>
            <Button type="default" disabled>
              Chặn
            </Button>
          </Space>
        );
      },
    },
  ];
  const { Title } = Typography;

  return (
    <div className="layout-content">
      <ModalLibraryCard
        previewVisible={previewVisible}
        handleCancel={handleCancel}
        UserRecord={UserRecord}
        userUnits={userUnits}
      />
      <Modal
        title="Cập nhật thời hạn thẻ theo đơn vị"
        visible={isOpenModalUpdateCardToUnit}
        onCancel={() => setIsOpenModalUpdateCardToUnit(false)}
        footer={null}
      >
        <Typography.Title level={5}>
          Đồng bộ thời hạn thẻ cho tất cả người dùng theo đơn vị
        </Typography.Title>

        <Form layout="vertical" onFinish={handleUpdateManyCardByUnit}>
          <Form.Item label="Đơn vị" name="idUnit">
            <Select
              width={200}
              showSearch
              placeholder="Chọn đơn vị"
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              onChange={(value) => setIdUnitSelect(value)}
              options={userUnits.map((item) => ({
                label: item?.unitName,
                value: item?.id,
              }))}
            />
          </Form.Item>
          <Space wrap>
            <Form.Item
              name="effectiveDate"
              label="Ngày hiệu lực"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập ngày hiệu lực",
                },
              ]}
            >
              <DatePicker format={"DD/MM/YYYY"} />
            </Form.Item>
            <Form.Item
              name="expirationDate"
              label="Ngày hết hạn"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập Ngày hết hạn",
                },
              ]}
            >
              <DatePicker format={"DD/MM/YYYY"} />
            </Form.Item>
          </Space>
          <Form.Item>
            <Button
              style={{ float: "right" }}
              type="primary"
              loading={btnLoading}
              htmlType="submit"
            >
              Xác nhận
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      {/* Bắt đầu modal thay mật khẩu */}
      <Modal
        title="Đặt lại mật khẩu mặc định"
        visible={IsOpenModalChangePasswordByUnit}
        onCancel={() => setIsOpenModalChangePasswordByUnit(false)}
        footer={null}
      >
        <Typography.Title level={5}>
          Bấm xác nhận để thực hiện thay đổi mật khẩu các tài khoản đã chọn
        </Typography.Title>
        <Form layout="vertical" onFinish={handleUpdateManyPasswordByUnit}>
          {/*<Form.Item label="Đơn vị" name="idUnit">*/}
          {/*  <Select*/}
          {/*      width={200}*/}
          {/*      showSearch*/}
          {/*      placeholder="Chọn đơn vị"*/}
          {/*      optionFilterProp="children"*/}
          {/*      filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}*/}
          {/*      onChange={(value) =>*/}
          {/*          setIdUnitSelectForChangePassword(value)*/}
          {/*  }*/}
          {/*      options={userUnits.map((item) => ({*/}
          {/*        label: item?.unitName,*/}
          {/*        value: item?.id,*/}
          {/*      }))}*/}
          {/*  />*/}
          {/*</Form.Item>*/}
          <Form.Item>
            <Space>
              <p style={{ color: "red" }}>
                *Chú ý: Mật khẩu mặc định sẽ được đặt lại là: 12345678
              </p>
              <Button
                style={{ float: "right" }}
                type="primary"
                loading={btnLoading}
                htmlType="submit"
              >
                Xác nhận
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
      {/* Kết thúc modal thay mật khẩu */}
      <Row gutter={[24, 0]}>
        <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
          <Card bordered={false} className="criclebox h-full">
            <Title level={5}>Danh sách người dùng </Title>
            <Space
              style={{
                marginBottom: 16,
              }}
              wrap
            >
              <Button onClick={(e) => navigate("/admin/tai-khoan/newUser")}>
                Thêm người dùng mới
              </Button>
              <Upload {...props}>
                <Button
                  style={{ color: "green", borderColor: "green" }}
                  icon={[
                    <svg
                      viewBox="0 0 1024 1024"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                    >
                      <path
                        d="M943.5 179.7H643.2v55.6h88.5v87.9h-88.5v28h88.5v88h-88.5V468h88.5v83.2h-88.5v33.4h88.5V668h-88.5v33.4h88.5v83.9h-88.5v61.2h300.3c4.7-1.4 8.7-7 11.9-16.7 3.2-9.8 4.8-17.7 4.8-23.8V189.8c0-4.8-1.6-7.7-4.8-8.7-3.9-1-7.9-1.5-11.9-1.4z m-39 605.5h-144v-83.8h144.1l-0.1 83.8z m0-117.2h-144v-83.5h144.1l-0.1 83.5z m0-116.8h-144v-82.9h144.1l-0.1 82.9z m0-112h-144v-87.9h144.1l-0.1 87.9z m0-116.5h-144v-87.4h144.1v88l-0.1-0.6zM63.8 165.8v694.7L592.7 952V72L63.8 166.1v-0.3z m313.5 525.5c-2-5.5-11.5-28.6-28.3-69.6-9.7-23.9-19.7-47.8-29.8-71.6h-0.9l-56.7 135-75.8-5.1 89.8-168-82.4-168 77.3-4.1 51.1 131.5h1l57.7-137.5 79.9-5-95.1 181.9 98 185.5-85.8-5z"
                        fill="green"
                      ></path>
                    </svg>,
                  ]}
                  loading={btnLoading}
                >
                  Lấy biểu mẫu excel
                </Button>
              </Upload>
              <Button
                onClick={(e) =>
                  users
                    .GetFileExcelImportExcel()
                    .then((res) => {
                      openNotificationWithIcon(
                        "success",
                        "Tải biểu mẫu excel thêm người dùng thành công",
                        res?.message,
                      );
                      const url = window.URL.createObjectURL(new Blob([res]));
                      const link = document.createElement("a");

                      link.href = url;
                      link.setAttribute("download", "Mau_ImportUser.xlsx");
                      document.body.appendChild(link);
                      link.click();
                    })
                    .catch((err) => {
                      openNotificationWithIcon(
                        "error",
                        "Lỗi",
                        err?.response?.data?.message || err?.message,
                      );
                    })
                }
                style={{ color: "green", borderColor: "green" }}
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
                      fill="green"
                      p-id="8532"
                    ></path>
                  </svg>,
                ]}
              >
                Tải biểu mẫu excel
              </Button>
              <ImgCrop
                rotate
                modalTitle="Chỉnh ảnh"
                modalOk="Xác nhận"
                modalCancel="Hủy"
                aspect={3 / 4}
                grid={true}
              >
                <Upload
                  accept="image/png, image/jpeg, image/jpg"
                  name="avatar"
                  maxCount={1}
                  showUploadList={false}
                  customRequest={(options) => {
                    setBtnLoading(true);
                    const data = new FormData();
                    data.append("lstIdUser", selectedRowKeys.join(","));
                    data.append("File", options.file);
                    users
                      .UpdateImageUsers(data)
                      .then((res) => {
                        openNotificationWithIcon(
                          "success",
                          "Thành công",
                          res?.message,
                        );
                        setPostLength(postLength + 1);
                      })
                      .catch((err) => {
                        openNotificationWithIcon(
                          "error",
                          "Lỗi",
                          err?.response?.data?.message || err?.message,
                        );
                      })
                      .finally(() => {
                        setBtnLoading(false);
                      });
                  }}
                >
                  <Button
                    disabled={selectedRowKeys.length === 0}
                    style={{ borderColor: "blue", color: "blue" }}
                    icon={[
                      <svg
                        viewBox="0 0 1024 1024"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                      >
                        <path
                          fill="blue"
                          d="M512 85.333333c235.52 0 426.666667 191.146667 426.666667 426.666667s-191.146667 426.666667-426.666667 426.666667S85.333333 747.52 85.333333 512 276.48 85.333333 512 85.333333z m0 85.333334c-188.373333 0-341.333333 152.96-341.333333 341.333333s152.96 341.333333 341.333333 341.333333 341.333333-152.96 341.333333-341.333333-152.96-341.333333-341.333333-341.333333z m0 597.333333c-84.010667 0-161.450667-34.858667-213.333333-93.098667 26.154667-39.68 121.941333-77.568 213.333333-77.568s187.178667 37.888 213.333333 77.568C673.450667 733.141333 596.010667 768 512 768z m0-469.333333c70.826667 0 128 57.173333 128 128s-57.173333 128-128 128-128-57.173333-128-128 57.173333-128 128-128z"
                        ></path>
                      </svg>,
                    ]}
                    loading={btnLoading}
                  >
                    Cập nhật ảnh {selectedRowKeys.length} người
                  </Button>
                </Upload>
              </ImgCrop>
              {/* <Select
                width={200}
                showSearch
                placeholder='Chọn đơn vị'
                optionFilterProp='children'
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                onChange={(value) => setIdUnitSelect(value)}
                options={userUnits.map((item) => ({
                  label: item?.unitName,
                  value: item?.id,
                }))}
              />
              <Button
                disabled={!idUnitSelect}
                onClick={(e) =>
                  users
                    .GetFileExcelUserByIdUnit(idUnitSelect)
                    .then((res) => {
                      openNotificationWithIcon(
                        "success",
                        "Tải excel đơn vị chỉnh sửa thành công",
                        res?.message
                      );
                      const url = window.URL.createObjectURL(new Blob([res]));
                      const link = document.createElement("a");
                      link.href = url;
                      link.setAttribute(
                        "download",
                        `Mẫu dữ liệu người dùng theo đơn vị - ${
                          userUnits.find((x) => x.id === idUnitSelect)?.unitName
                        }.xlsx`
                      );
                      document.body.appendChild(link);
                      link.click();
                    })
                    .catch((err) => {
                      openNotificationWithIcon(
                        "error",
                        "Lỗi",
                        err?.response?.data?.message || err?.message
                      );
                    })
                }
                style={{ color: "green", borderColor: "green" }}
                icon={[
                  <svg
                    t='1661919181496'
                    className='icon'
                    viewBox='0 0 1024 1024'
                    version='1.1'
                    xmlns='http://www.w3.org/2000/svg'
                    p-id='8531'
                    width='20'
                    height='20'
                  >
                    <path
                      d='M943.5 179.7H643.2v55.6h88.5v87.9h-88.5v28h88.5v88h-88.5V468h88.5v83.2h-88.5v33.4h88.5V668h-88.5v33.4h88.5v83.9h-88.5v61.2h300.3c4.7-1.4 8.7-7 11.9-16.7 3.2-9.8 4.8-17.7 4.8-23.8V189.8c0-4.8-1.6-7.7-4.8-8.7-3.9-1-7.9-1.5-11.9-1.4z m-39 605.5h-144v-83.8h144.1l-0.1 83.8z m0-117.2h-144v-83.5h144.1l-0.1 83.5z m0-116.8h-144v-82.9h144.1l-0.1 82.9z m0-112h-144v-87.9h144.1l-0.1 87.9z m0-116.5h-144v-87.4h144.1v88l-0.1-0.6zM63.8 165.8v694.7L592.7 952V72L63.8 166.1v-0.3z m313.5 525.5c-2-5.5-11.5-28.6-28.3-69.6-9.7-23.9-19.7-47.8-29.8-71.6h-0.9l-56.7 135-75.8-5.1 89.8-168-82.4-168 77.3-4.1 51.1 131.5h1l57.7-137.5 79.9-5-95.1 181.9 98 185.5-85.8-5z'
                      fill='green'
                      p-id='8532'
                    ></path>
                  </svg>,
                ]}
              >
                Tải excel đơn vị chỉnh sửa
              </Button>
              <Upload
                maxCount={1}
                accept='.xlsx, .xls'
                name='file'
                customRequest={async (option) => {
                  try {
                    const formData = new FormData();
                    formData.append("file", option.file);
                    const res = await users.UpdateActiveAndExpireDateUser(
                      formData
                    );
                    if (res.type === "application/json") {
                      openNotificationWithIcon(
                        "success",
                        "Lấy excel đơn vị chỉnh sửa thành công",
                        res?.message
                      );
                    } else {
                      const blob = new Blob([res], {
                        type: "application/vnd.ms-excel",
                      });
                      const url = window.URL.createObjectURL(blob);
                      const link = document.createElement("a");
                      link.href = url;
                      link.setAttribute(
                        "download",
                        `Danh sách tài khoản không thể chỉnh sửa.xlsx`
                      );
                      document.body.appendChild(link);
                      link.click();
                      link.remove();
                      openNotificationWithIcon(
                        "info",
                        "Thông báo",
                        "Có 1 số tài khoản không thể chỉnh sửa, dưới đây là danh sách",
                        0
                      );
                    }
                    option.onSuccess(res, option.file);
                    setPostLength(postLength + 1);
                  } catch (error) {
                    openNotificationWithIcon(
                      "error",
                      "Thêm thất bại",
                      error?.response?.data?.message || error?.message
                    );
                  }
                  setBtnLoading(false);
                }}
              >
                <Button
                  style={{ color: "green", borderColor: "green" }}
                  icon={[
                    <svg
                      viewBox='0 0 1024 1024'
                      version='1.1'
                      xmlns='http://www.w3.org/2000/svg'
                      width='20'
                      height='20'
                    >
                      <path
                        d='M943.5 179.7H643.2v55.6h88.5v87.9h-88.5v28h88.5v88h-88.5V468h88.5v83.2h-88.5v33.4h88.5V668h-88.5v33.4h88.5v83.9h-88.5v61.2h300.3c4.7-1.4 8.7-7 11.9-16.7 3.2-9.8 4.8-17.7 4.8-23.8V189.8c0-4.8-1.6-7.7-4.8-8.7-3.9-1-7.9-1.5-11.9-1.4z m-39 605.5h-144v-83.8h144.1l-0.1 83.8z m0-117.2h-144v-83.5h144.1l-0.1 83.5z m0-116.8h-144v-82.9h144.1l-0.1 82.9z m0-112h-144v-87.9h144.1l-0.1 87.9z m0-116.5h-144v-87.4h144.1v88l-0.1-0.6zM63.8 165.8v694.7L592.7 952V72L63.8 166.1v-0.3z m313.5 525.5c-2-5.5-11.5-28.6-28.3-69.6-9.7-23.9-19.7-47.8-29.8-71.6h-0.9l-56.7 135-75.8-5.1 89.8-168-82.4-168 77.3-4.1 51.1 131.5h1l57.7-137.5 79.9-5-95.1 181.9 98 185.5-85.8-5z'
                        fill='green'
                      ></path>
                    </svg>,
                  ]}
                  loading={btnLoading}
                >
                  Lấy excel đơn vị chỉnh sửa
                </Button>
              </Upload> */}
              <Tooltip title="Cập nhật thời hạn thẻ theo đơn vị">
                <Button onClick={() => setIsOpenModalUpdateCardToUnit(true)}>
                  Cập nhật thời hạn thẻ
                </Button>
              </Tooltip>
              <Tooltip title="Thay đổi mật khẩu về mặc định theo đơn vị">
                <Button
                  disabled={
                    selectedRowKeys.length < 1 || selectedRowKeys.length > 50
                  }
                  onClick={() => setIsOpenModalChangePasswordByUnit(true)}
                >
                  Cập nhật mật khẩu {selectedRowKeys?.length} tài khoản
                </Button>
              </Tooltip>
              <Tooltip title="In nhiều thẻ thư viện cùng lúc (Vui lòng in khổ ngang)">
                <Button
                  type="default"
                  disabled={
                    selectedRowKeys.length < 1 || selectedRowKeys.length > 50
                  }
                  onClick={() => handlePrintManyLibraryCard()}
                  icon={<PrinterOutlined />}
                >
                  In {selectedRowKeys?.length} thẻ
                </Button>
              </Tooltip>
            </Space>
            <Table
              scroll={{ x: 400 }}
              rowSelection={{
                selectedRowKeys,
                onChange: onSelectChange,
              }}
              rowKey={(record) => record.id}
              columns={columns.map((col) =>
                col.title !== "Thao tác"
                  ? {
                      ...col,
                      ellipsis: true,
                      width: 170,
                    }
                  : { ...col, width: "auto" },
              )}
              dataSource={Users}
              onChange={handleTableChange}
              loading={loading}
              pagination={pagination}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

function ModalLibraryCard({
  previewVisible,
  handleCancel,
  UserRecord,
  userUnits,
}) {
  const navigate = useNavigate();
  const [btnLoading] = useState(false);
  const [ManagingUnit, setManagingUnit] = useState();

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
    JsBarcode("#code128", UserRecord.userCode, {
      format: "CODE128",
      displayValue: true,
      fontSize: 20,
      textMargin: 2,
      fontOptions: "bold",
      textAlign: "center",
      textPosition: "bottom",
      font: "monospace",
      lineColor: "#000",
      width: 1.5,
      height: 30,
    });
  }, [UserRecord.userCode]);

  const handlePrint = () => {
    navigate(`/Print/PrintLibraryCard`, {
      state: { listIdUser: [UserRecord.id] },
    });
  };
  const apiUrl = window._env_.REACT_APP_URl_SERVER_APIS;

  return (
    <Modal
      visible={previewVisible}
      title="Thẻ Thư viện"
      footer={null}
      onCancel={handleCancel}
    >
      <Card
        className="criclebox h-full"
        style={{ border: "4px double #0a0a0a" }}
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
              fontSize: 16,
            }}
          >
            {ManagingUnit}
          </p>
          <p
            style={{
              textAlign: "center",
              fontWeight: 900,
              fontSize: 25,
            }}
          >
            THẺ THƯ VIỆN
          </p>
          <Space
            direction="horizontal"
            size="small"
            style={{
              width: "100%",
              gap: 30,
            }}
            align="start"
          >
            <Avatar
              src={
                UserRecord.avatar
                  ? `${apiUrl}/api/Book/GetFileAvatar?fileNameId=${UserRecord?.avatar}`
                  : avatar
              }
              size={130}
              shape="square"
              alt="avatar"
              icon={<UserOutlined />}
            />
            <Space direction="vertical" size="small">
              <p>Họ và tên: {UserRecord?.fullname}</p>
              <p>
                Lớp:{" "}
                {
                  userUnits.find(
                    (userType) => userType.id === UserRecord?.unitId,
                  )?.unitName
                }
              </p>
              <p>
                Năm học:{" "}
                {` ${moment(new Date()).format("YYYY")} - ${Number(moment(new Date()).format("YYYY")) + 1}`}
              </p>
            </Space>
          </Space>
          <Space
            style={{
              justifyContent: "space-between",
              width: "100%",
              marginBottom: 30,
            }}
          >
            <svg id="code128"></svg>
            <Typography.Title
              level={4}
              style={{
                marginRight: 20,
              }}
            >
              {/* Ban Giám hiệu */}
            </Typography.Title>
          </Space>
        </Space>
      </Card>
      <Button
        type="primary"
        onClick={(e) => handlePrint()}
        style={{
          marginTop: 30,
          textAlign: "center",
        }}
        icon={<PrinterOutlined />}
        loading={btnLoading}
      >
        In
      </Button>
    </Modal>
  );
}

export const ManageUsersLayout = WithErrorBoundaryCustom(_ManageUsersLayout);
