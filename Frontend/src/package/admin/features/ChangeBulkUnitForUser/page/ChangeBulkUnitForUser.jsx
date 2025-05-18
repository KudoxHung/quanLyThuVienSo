import React, { useEffect, useState } from "react";

import WithErrorBoundaryCustom from "../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { openNotificationWithIcon } from "../../../../client/utils";
import { users } from "../../../api";
import { categoryUnits } from "../../../api/categoryUnits";
import {
  Button,
  Card,
  Col,
  Divider,
  Popconfirm,
  Popover,
  Row,
  Select,
  Space,
  Table,
  Tooltip,
  Typography,
} from "antd";
import moment from "moment/moment";

function _ChangeBulkUnitForUser() {
  const [ListUser, setListUser] = useState([]);
  const [userTypes, setUserTypes] = useState([]);
  const [ListUnit, setListUnit] = useState([]);
  const [idUnitSelect, setIdUnitSelect] = useState(null);
  const [idUnitSelectToFilerListUser, setIdUnitSelectToFilerListUser] =
    useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingChangeUnit, setLoadingChangeUnit] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [filteredInfo, setFilteredInfo] = useState({});
  const [pagination, setPagination] = useState({
    total: 0,
    pageSize: 6,
    showSizeChanger: false,
    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
  });
  const [originalData, setOriginalData] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const [unit, userType] = await Promise.all([
          categoryUnits.getAll(),
          users.getAllUserType(),
        ]);
        setListUnit(unit);
        setUserTypes(userType);
      } catch (e) {
        console.log("error at _ChangeBulkUnitForUser: ", e);
      }
    })();
  }, []);
  const handleFindListUser = async (value) => {
    try {
      setLoading(true);
      setIdUnitSelectToFilerListUser(value);
      const res = await users.GetAllUserByIdUnit(value, 0, 0);
      setListUser(res);
      setOriginalData(res); // Lưu lại dữ liệu gốc
      setPagination((prev) => ({ ...prev, total: res.length })); // Cập nhật số lượng item
    } catch (e) {
      console.log("error at handleFindListUser: ", e);
    } finally {
      setLoading(false);
    }
  };
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  // const handleChange = (pagination, filters) => {
  //   pagination = pagination || {};
  //   setFilteredInfo(filters);
  // };

  const handleChange = (pagination, filters) => {
    setFilteredInfo(filters);

    let filteredData = originalData;

    // Nếu không có bộ lọc nào, hiển thị lại tất cả dữ liệu gốc
    if (Object.keys(filters).length === 0) {
      filteredData = originalData;
    }

    console.log("filters", filters);
    console.log("originalData", originalData);

    // Áp dụng các bộ lọc
    if (filters.fullname && filters.fullname.length > 0) {
      filteredData = filteredData.filter((user) =>
        filters.fullname.some((value) => user.fullname.includes(value)),
      );
    }
    if (filters.email && filters.email.length > 0) {
      filteredData = filteredData.filter((user) =>
        filters.email.some((value) => user.email.includes(value)),
      );
    }
    if (filters.phone && filters.phone.length > 0) {
      filteredData = filteredData.filter((user) =>
        filters.phone.some((value) => user.phone.includes(value)),
      );
    }
    if (filters.userTypeId && filters.userTypeId.length > 0) {
      filteredData = filteredData.filter((user) =>
        filters.userTypeId.includes(user.userTypeId),
      );
    }

    // Cập nhật danh sách và số lượng item
    setListUser(filteredData);
    setPagination((prev) => ({
      ...prev,
      total: filteredData.length,
      current: pagination.current, // Cập nhật trang hiện tại
    }));
  };

  const handleBulkChangeUnit = async (value) => {
    try {
      if (!value)
        return openNotificationWithIcon(
          "warn",
          "Thông báo",
          "Vui lòng chọn đơn vị",
        );
      setLoadingChangeUnit(true);
      const res = await users.UpdateListUserByIdUnit(selectedRowKeys, value);
      if (res) {
        setSelectedRowKeys([]);
        setIdUnitSelect(null);
        await handleFindListUser(value);
        setIdUnitSelectToFilerListUser(value);
        openNotificationWithIcon(
          "success",
          "Thành công",
          "Đổi đơn vị thành công",
        );
      }
    } catch (e) {
      console.log("error at handleBulkChangeUnit: ", e);
    } finally {
      setLoadingChangeUnit(false);
    }
  };
  const columns = [
    {
      title: "Họ và tên",
      dataIndex: "fullname",
      key: "fullname",
      fixed: "left",
      filters: originalData.map((x) => ({
        text: x.fullname,
        value: x.fullname,
      })),
      filteredValue: filteredInfo.fullname || null,
      filterSearch: true,
      onFilter: (value, record) => record.fullname.indexOf(value) === 0,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      filters: originalData.map((x) => ({ text: x.email, value: x.email })),
      filteredValue: filteredInfo.email || null,
      filterSearch: true,
      onFilter: (value, record) => record.email.indexOf(value) === 0,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      filters: originalData.map((x) => ({ text: x.phone, value: x.phone })),
      filteredValue: filteredInfo.phone || null,
      filterSearch: true,
      onFilter: (value, record) => record.phone.indexOf(value) === 0,
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
    },
    {
      title: "Ngày Tạo",
      dataIndex: "createdDate",
      key: "createdDate",
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
      filterSearch: true,
      filteredValue: filteredInfo.userTypeId || null, // Thêm || null để tránh lỗi khi không có bộ lọc
      onFilter: (value, record) => record.userTypeId === value,
    },
  ];

  return (
    <div className="ChangeBulkUnitForUser">
      <Row>
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <Typography.Title level={3}>Chuyển đơn vị hàng loạt</Typography.Title>
          <Divider />
          <Card bordered={false} className="criclebox h-full">
            <Space
              size={"large"}
              wrap
              style={{
                width: "100%",
                marginBottom: 16,
              }}
            >
              <Select
                style={{
                  width: 500,
                }}
                showSearch
                optionFilterProp={"label"}
                options={ListUnit.map((item) => ({
                  value: item.id,
                  label: item.unitName,
                }))}
                placeholder={"Chọn đơn vị bạn muốn tương tác"}
                onChange={handleFindListUser}
                value={idUnitSelectToFilerListUser}
              />
              <Popover
                trigger="click"
                content={
                  <Card
                    bordered={false}
                    style={{ width: 300 }}
                    title={
                      <Typography.Title level={5}>
                        Chọn đơn vị bạn muốn chuyển
                      </Typography.Title>
                    }
                  >
                    <Select
                      style={{ width: "100%" }}
                      placeholder={"Chọn đơn vị bạn muốn chuyển"}
                      loading={loadingChangeUnit}
                      options={ListUnit.map((item) => ({
                        value: item.id,
                        label: item.unitName,
                      }))}
                      optionFilterProp={"label"}
                      value={idUnitSelect}
                      onChange={(value) => setIdUnitSelect(value)}
                    />
                    <Divider />
                    <Popconfirm
                      title={
                        "Bạn có chắc chắn muốn chuyển đơn vị cho các đối tượng đã chọn?"
                      }
                      onConfirm={async () =>
                        await handleBulkChangeUnit(idUnitSelect)
                      }
                      disabled={!selectedRowKeys.length}
                    >
                      <Button
                        type={"primary"}
                        style={{ marginTop: 16 }}
                        loading={loadingChangeUnit}
                        disabled={!selectedRowKeys.length}
                      >
                        Chuyển đơn vị {selectedRowKeys.length} đối tượng
                      </Button>
                    </Popconfirm>
                  </Card>
                }
              >
                <Button
                  type={"primary"}
                  disabled={!selectedRowKeys.length}
                  loading={loadingChangeUnit}
                >
                  Chuyển đơn vị {selectedRowKeys.length} đối tượng
                </Button>
              </Popover>
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
              dataSource={ListUser}
              loading={loading}
              onChange={handleChange}
              // pagination={{
              //   total: ListUser?.length,
              //   pageSize: 6,
              //   showSizeChanger: false,
              //   showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
              // }}
              pagination={pagination}
            />
          </Card>
        </Col>
      </Row>
      ;
    </div>
  );
}
export const ChangeBulkUnitForUser = WithErrorBoundaryCustom(
  _ChangeBulkUnitForUser,
);
