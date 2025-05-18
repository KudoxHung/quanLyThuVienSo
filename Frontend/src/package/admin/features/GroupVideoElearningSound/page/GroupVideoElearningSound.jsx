import { useEffect, useState } from "react";

import WithErrorBoundaryCustom from "../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { openNotificationWithIcon } from "../../../../client/utils";
import { CategoryVesApis } from "../../../api/CategoryVesApis";
import { GroupVesApis } from "../../../api/GroupVesApis";
import { ModalContent } from "../../../components";
import { EditGroupVideoElearningSound } from "../components/EditGroupVideoElearningSound";
import { NewGroupVideoElearningSound } from "../components/NewGroupVideoElearningSound";
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

function _GroupVideoElearningSound() {
  const [dataCategory, setDataCategory] = useState([]);
  const [dataGroup, setDataGroup] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [postLength, setPostLength] = useState(0);
  const [filteredInfo, setFilteredInfo] = useState({});
  const [isOpenModalNew, setIsOpenModalNew] = useState(false);
  const [isOpenModalEdit, setIsOpenModalEdit] = useState(false);
  const [dataGroupVes, setDataGroupVes] = useState(null);
  useEffect(() => {
    (async () => {
      try {
        const res = await GroupVesApis.GetAllGroupVes(0, 0);
        setDataGroup(res);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [postLength]);
  useEffect(() => {
    (async () => {
      try {
        const res = await CategoryVesApis.GetAllCategoryVes(0, 0);
        setDataCategory(res);
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);
  const handleChange = (pagination, filters) => {
    pagination = pagination || {};
    setFilteredInfo(filters);
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
            setDataGroupVes(record);
          }}
        >
          Chỉnh sửa
        </Menu.Item>
      </Menu>
    );
  };

  const columns = [
    {
      title: "Tên nhóm",
      dataIndex: "groupName",
      key: "groupName",
    },
    {
      title: "Danh mục",
      dataIndex: "idcategoryVes",
      key: "idcategoryVes",
      filters: dataCategory.map((x) => ({
        text: x.categoryVesName,
        value: x.id,
      })),
      filteredValue: filteredInfo.idcategoryVes || null,
      filterMode: "search",
      filterSearch: true,
      onFilter: (value, record) => record.idcategoryVes?.startsWith(value),
      render: (text) => {
        const data = dataCategory.find((x) => x.id === text);
        return data ? data.categoryVesName : "";
      },
    },
    {
      title: "Loại danh mục",
      dataIndex: "idcategoryVes",
      key: "idcategoryVes",
      render: (text) => {
        const data = dataCategory.find((x) => x.id === text);
        return data
          ? data.status === 1
            ? "Bài giảng điện tử"
            : data.status === 2
              ? "Video"
              : "Sách nói"
          : "";
      },
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
      const res = await GroupVesApis.DeleteGroupVesByList(ListId);
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
      const res = await GroupVesApis.HideGroupVesByList(ListId, isHide);
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
    <div className="GroupVideoElearningSound">
      <ModalContent
        visible={isOpenModalNew}
        setVisible={setIsOpenModalNew}
        title={"Thêm nhóm bài học"}
        width={"400px"}
      >
        <NewGroupVideoElearningSound
          setVisible={setIsOpenModalNew}
          setPostLength={setPostLength}
        />
      </ModalContent>
      <ModalContent
        visible={isOpenModalEdit}
        setVisible={setIsOpenModalEdit}
        title={"Sửa nhóm bài học"}
        width={"400px"}
      >
        <EditGroupVideoElearningSound
          Data={dataGroupVes}
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
                Nhóm bài học điện tử
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
                Thêm nhóm
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
              dataSource={dataGroup}
              onChange={handleChange}
              loading={loading}
              bordered={true}
              pagination={{
                total: dataGroup?.length,
                pageSize: 10,

                showSizeChanger: false,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} items`,
              }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export const GroupVideoElearningSound = WithErrorBoundaryCustom(
  _GroupVideoElearningSound,
);
