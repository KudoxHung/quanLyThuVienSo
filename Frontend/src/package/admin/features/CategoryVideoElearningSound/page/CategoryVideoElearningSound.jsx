import { useEffect, useState } from "react";

import WithErrorBoundaryCustom from "../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { openNotificationWithIcon } from "../../../../client/utils";
import { CategoryVesApis } from "../../../api/CategoryVesApis";
import { ModalContent } from "../../../components";
import { EditCategoryVideoElearningSound } from "../components/EditCategoryVideoElearningSound";
import { NewCategoryVideoElearningSound } from "../components/NewCategoryVideoElearningSound";
import {
  BarsOutlined,
  DeleteOutlined,
  EditOutlined,
  SafetyCertificateOutlined,
  StopOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Dropdown,
  Menu,
  Popconfirm,
  Row,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";
import moment from "moment";

function _CategoryVideoElearningSound() {
  const [dataCategory, setDataCategory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [postLength, setPostLength] = useState(0);
  const [filteredInfo, setFilteredInfo] = useState({});
  const [isOpenModalNew, setIsOpenModalNew] = useState(false);
  const [isOpenModalEdit, setIsOpenModalEdit] = useState(false);
  const [RecordCategory, setRecordCategory] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 6,
    total: dataCategory?.length ?? 0,
    showTotal: (total) => `Tổng số: ${total} bản ghi`,
    showSizeChanger: true,
    showQuickJumper: true,
  });
  useEffect(() => {
    (async () => {
      try {
        const res = await CategoryVesApis.GetAllCategoryVes(0, 0);
        setDataCategory(res);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [postLength]);
  const handleChange = (pagination, filters) => {
    setFilteredInfo(filters);
    setPagination({ ...pagination, total: dataCategory?.length ?? 0 });
  };
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const menuAction = (record) => {
    return (
      <Menu>
        <Menu.Item
          key="1"
          icon={<EditOutlined />}
          onClick={() => {
            setIsOpenModalEdit(true);
            setRecordCategory(record);
          }}
        >
          Chỉnh sửa
        </Menu.Item>
      </Menu>
    );
  };

  const columns = [
    {
      title: "Tên danh mục",
      dataIndex: "categoryVesName",
      key: "categoryVesName",
    },
    {
      title: "Trạng thái",
      dataIndex: "isHide",
      key: "isHide",
      render: (text) =>
        text ? (
          <Tag color={"warning"}>Đang ẩn</Tag>
        ) : (
          <Tag color={"success"}>Đang hiện</Tag>
        ),
    },
    {
      title: "Loại",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Bài giảng điện tử", value: 1 },
        { text: "Video", value: 2 },
        { text: "Sách nói", value: 3 },
      ],
      filteredValue: filteredInfo.status || null,
      filterMode: "search",
      filterSearch: true,
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (text) => moment(text).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Thao tác",
      dataIndex: "Action",
      key: "Action",
      fixed: "right",
      render: (_, record) => (
        <Dropdown overlay={menuAction(record)} trigger={["click"]}>
          <BarsOutlined style={{ fontSize: 24 }} />
        </Dropdown>
      ),
      width: 50,
    },
  ];
  const handleDelete = async (ListId) => {
    try {
      const res = await CategoryVesApis.DeleteCategoryVesByList(ListId);
      if (res.success) {
        setPostLength((prevState) => prevState + 1);
        openNotificationWithIcon("success", res.message);
        setSelectedRowKeys([]);
      } else {
        openNotificationWithIcon("warning", res.message);
      }
    } catch (e) {
      console.log(e);
    }
  };
  const handleShow = async (ListId, isHide) => {
    try {
      const res = await CategoryVesApis.HideCategoryVesByList(ListId, isHide);
      if (res.success) {
        setPostLength((prevState) => prevState + 1);
        openNotificationWithIcon("success", res.message);
      } else {
        openNotificationWithIcon("warning", res.message);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="CategoryVideoElearningSound">
      <ModalContent
        visible={isOpenModalNew}
        setVisible={setIsOpenModalNew}
        title={"Thêm danh mục"}
        width={"400px"}
      >
        <NewCategoryVideoElearningSound
          setVisible={setIsOpenModalNew}
          setPostLength={setPostLength}
        />
      </ModalContent>
      <ModalContent
        visible={isOpenModalEdit}
        setVisible={setIsOpenModalEdit}
        title={"Sửa danh mục"}
        width={"400px"}
      >
        <EditCategoryVideoElearningSound
          Data={RecordCategory}
          setVisible={setIsOpenModalEdit}
          setPostLength={setPostLength}
        />
      </ModalContent>

      <Row>
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <Card
            bordered={false}
            className="criclebox h-full"
            title={
              <Typography.Title level={3}>
                Danh mục bài học điện tử
              </Typography.Title>
            }
          >
            <Space
              style={{
                marginBottom: 16,
              }}
              wrap
            >
              <Button
                size="small"
                type="default"
                onClick={() => setIsOpenModalNew(true)}
              >
                Thêm danh mục
              </Button>
              <Popconfirm
                title="Bạn có chắc chắn không ?"
                okText="Có"
                disabled={!(selectedRowKeys.length > 0)}
                cancelText="Không"
                onConfirm={() => handleShow(selectedRowKeys, false)}
              >
                <Button
                  type="primary"
                  disabled={!(selectedRowKeys.length > 0)}
                  ghost
                  icon={<SafetyCertificateOutlined />}
                >
                  Hiện {selectedRowKeys.length} mục
                </Button>
              </Popconfirm>
              <Popconfirm
                title="Bạn có chắc chắn không ?"
                okText="Có"
                disabled={!(selectedRowKeys.length > 0)}
                cancelText="Không"
                onConfirm={() => handleShow(selectedRowKeys, true)}
              >
                <Button
                  danger
                  type="default"
                  disabled={!(selectedRowKeys.length > 0)}
                  icon={<StopOutlined />}
                >
                  Ẩn {selectedRowKeys.length} mục
                </Button>
              </Popconfirm>
              <Popconfirm
                title="Bạn có chắc chắn không ?"
                okText="Có"
                cancelText="Không"
                disabled={!(selectedRowKeys.length > 0)}
                onConfirm={() => handleDelete(selectedRowKeys)}
              >
                <Button
                  danger
                  type="primary"
                  disabled={!(selectedRowKeys.length > 0)}
                  icon={<DeleteOutlined />}
                >
                  Xóa {selectedRowKeys.length} mục
                </Button>
              </Popconfirm>
            </Space>
            <Table
              scroll={{ x: 400 }}
              rowKey={(record) => record.id}
              columns={columns.map((col) =>
                col.title !== "Thao tác"
                  ? { ...col, ellipsis: true, width: 160 }
                  : col,
              )}
              rowSelection={rowSelection}
              dataSource={dataCategory}
              onChange={handleChange}
              loading={loading}
              bordered={true}
              pagination={pagination}
              footer={() => (
                <Space direction={"vertical"}>
                  <Typography.Text strong>Chú thích loại</Typography.Text>
                  <Typography.Text type="secondary">
                    1: Bài giảng điện tử
                  </Typography.Text>
                  <Typography.Text type="secondary">2: Video</Typography.Text>
                  <Typography.Text type="secondary">
                    3: Sách nói
                  </Typography.Text>
                </Space>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export const CategoryVideoElearningSound = WithErrorBoundaryCustom(
  _CategoryVideoElearningSound,
);
