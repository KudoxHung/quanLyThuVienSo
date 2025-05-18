import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

import WithErrorBoundaryCustom from "../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { openNotificationWithIcon } from "../../../../client/utils";
import { users } from "../../../api";
import { Button, Card, Col, Row, Space, Table, Tag, Typography } from "antd";

function _ManageUserDecentralization() {
  const param = useParams();
  const location = useLocation();
  const [filteredInfo, setFilteredInfo] = useState({});
  const [permission, setPermission] = useState([]);
  const [UserListRole, setUserListRole] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingUserListRole, setLoadingUserListRole] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [postLength, setPostLength] = useState(0);
  const handleChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
  };
  const columns = [
    {
      title: "Quyền danh mục",
      dataIndex: "roleName",
      key: "roleName",
      filters: permission.map((permission) => ({
        text: permission.roleName,
        value: permission.roleName,
      })),
      fixed: "left",
      filteredValue: filteredInfo.roleName || null,
      filterSearch: true,
      onFilter: (value, record) => record.roleName.startsWith(value),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (text, record) => {
        return (
          <Typography.Text type="danger">
            {Boolean(UserListRole.find((item) => item.idRole === record.id)) ? (
              <Tag color="green">Đã cấp</Tag>
            ) : (
              <Tag color="red">Chưa cấp</Tag>
            )}
          </Typography.Text>
        );
      },
    },
    {
      title: "Thao tác",
      render: (_, record) => {
        return (
          <Space size="small">
            {Boolean(UserListRole.find((item) => item.idRole === record.id)) ? (
              <Button
                type="dashed"
                loading={btnLoading}
                onClick={(e) => handleRemoveRole(record.id)}
                disabled={record.roleName === "Tài khoản"}
              >
                Bỏ Kích hoạt
              </Button>
            ) : (
              <Button
                type="default"
                loading={btnLoading}
                onClick={(e) => handleAddRole(record.id)}
                disabled={record.roleName === "Tài khoản"}
              >
                Kích hoạt
              </Button>
            )}
          </Space>
        );
      },
    },
  ];

  const handleAddRole = (id) => {
    setBtnLoading(true);
    users
      .AddRoleUser(id, param.id)
      .then((res) => {
        setBtnLoading(false);
        openNotificationWithIcon(
          "success",
          "Cấp quyền thành công",
          res.message,
        );
        setPostLength(postLength + 1);
      })
      .catch((err) => {
        setBtnLoading(false);
        openNotificationWithIcon(
          "error",
          "Cấp quyền thất bại",
          err?.response?.data?.message || err?.message,
        );
      });
  };

  const handleRemoveRole = (id) => {
    setBtnLoading(true);
    users
      .DeleteUserRole(id, param.id)
      .then((res) => {
        setBtnLoading(false);
        openNotificationWithIcon(
          "success",
          "Hủy quyền thành công",
          res.message,
        );
        setPostLength(postLength + 1);
      })
      .catch((err) => {
        setBtnLoading(false);
        openNotificationWithIcon(
          "error",
          "Hủy quyền thất bại",
          err?.response?.data?.message || err?.message,
        );
      });
  };

  useEffect(() => {
    const fetchData = async () => {
      Promise.all([
        users
          .getAllUserRole()
          .then((res) => {
            setPermission(res);
            setLoading(false);
          })
          .catch((err) => {
            openNotificationWithIcon(
              "error",
              "Lỗi",
              err?.response?.data?.message || err?.message,
            );
          }),
        users
          .GetListRoleOfUser(param.id)
          .then((res) => {
            setUserListRole(res);
            setLoadingUserListRole(false);
          })
          .catch((err) => {
            openNotificationWithIcon(
              "error",
              "Lỗi",
              err?.response?.data?.message || err?.message,
            );
          }),
      ]);
    };
    fetchData();
  }, [param.id, postLength]);

  const { Title, Text } = Typography;
  return (
    <div className="layout-content">
      <Row gutter={[24, 0]}>
        <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
          <Card bordered={false} className="criclebox h-full">
            <Title level={5}>
              Danh sách quyền{" "}
              <Space direction="vertical" style={{ float: "right" }}>
                <Text>Họ và tên : {location?.state?.userName}</Text>
                <Text>Email : {location?.state?.email}</Text>
              </Space>
            </Title>

            <Table
              columns={columns.map((col) =>
                col.title !== "Thao tác"
                  ? { ...col, ellipsis: true, width: 160 }
                  : col,
              )}
              dataSource={permission}
              onChange={handleChange}
              loading={loading && loadingUserListRole}
              pagination={{
                pageSize: 6,
                showTotal: (total) => `Tổng  ${total} bản ghi`,
              }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export const ManageUserDecentralization = WithErrorBoundaryCustom(
  _ManageUserDecentralization,
);
