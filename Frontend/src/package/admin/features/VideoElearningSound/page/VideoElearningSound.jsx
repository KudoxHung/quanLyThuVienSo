import { useEffect, useState } from "react";

import WithErrorBoundaryCustom from "../../../../../units/errorBounDary/WithErrorBoundaryCustom";
import { openNotificationWithIcon } from "../../../../client/utils";
import { GroupVesApis } from "../../../api/GroupVesApis";
import { VESApis } from "../../../api/VESApis";
import { ModalContent } from "../../../components";
import { EditVideoElearningSound } from "../components/EditVideoElearningSound";
import { NewVideoElearningSound } from "../components/NewVideoElearningSound";
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

function _VideoElearningSound() {
  const [dataGroupVes, setDataGroupVes] = useState([]);
  const [dataVes, setDataVes] = useState([]);
  const [dataVesSelected, setDataVesSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [postLength, setPostLength] = useState(0);
  const [filteredInfo, setFilteredInfo] = useState({});
  const [isOpenModalNew, setIsOpenModalNew] = useState(false);
  const [isOpenModalEdit, setIsOpenModalEdit] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        const res = await VESApis.GetAllVES(0, 0);
        setDataVes(res);
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
        const res = await GroupVesApis.GetAllGroupVes(0, 0);
        setDataGroupVes(res);
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
            setDataVesSelected(record);
          }}
        >
          Chỉnh sửa
        </Menu.Item>
      </Menu>
    );
  };

  const columns = [
    {
      title: "Tiêu đề",
      dataIndex: "mediaTitle",
      key: "mediaTitle",
    },
    {
      title: "Nhóm bài",
      dataIndex: "idGroupVes",
      key: "idGroupVes",
      filters: dataGroupVes.map((x) => ({
        text: x.groupName,
        value: x.id,
      })),
      filteredValue: filteredInfo.idGroupVes || null,
      filterMode: "search",
      filterSearch: true,
      onFilter: (value, record) => record.idGroupVes?.startsWith(value),
      render: (text) => {
        const data = dataGroupVes.find((x) => x.id === text);
        return data ? data.groupName : "";
      },
    },
    {
      title: "Sắp xếp",
      dataIndex: "number",
      key: "number",
    },
    {
      title: "Loại link",
      dataIndex: "mediaLinkType",
      key: "mediaLinkType",
      render: (text) => (text === 1 ? "Youtube" : ""),
    },
    {
      title: "Loại media",
      dataIndex: "mediaType",
      key: "mediaType",
      filters: [
        { text: "Video", value: 0 },
        { text: "Bài giảng điện tử - Dạng PDF", value: 1 },
        { text: "Bài giảng điện tử - Dạng Video", value: 2 },
        { text: "Sound - Sách nói dạng MP3", value: 3 },
        { text: "Sound - Sách nói dạng video", value: 4 },
      ],
      filteredValue: filteredInfo.mediaType || null,
      filterMode: "search",
      filterSearch: true,
      onFilter: (value, record) => record.mediaType === value,
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
      const res = await VESApis.DeleteVESByList(ListId);
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
      const res = await VESApis.HideVESByList(ListId, isHide);
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
    <div className="VideoElearningSound">
      <ModalContent
        visible={isOpenModalNew}
        setVisible={setIsOpenModalNew}
        title={"Thêm nội dung bài học"}
        width={"1200px"}
      >
        <NewVideoElearningSound
          setVisible={setIsOpenModalNew}
          setPostLength={setPostLength}
        />
      </ModalContent>
      <ModalContent
        visible={isOpenModalEdit}
        setVisible={setIsOpenModalEdit}
        title={"Sửa nội dung bài học"}
        width={"1200px"}
      >
        <EditVideoElearningSound
          Data={dataVesSelected}
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
                Nội dung bài học điện tử
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
                Thêm nội dung
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
              scroll={{ x: window.screen.width }}
              rowKey={(record) => record.id}
              columns={columns.map((col) =>
                col.title !== "Thao tác"
                  ? { ...col, ellipsis: true, width: 200 }
                  : col,
              )}
              rowSelection={rowSelection}
              dataSource={dataVes}
              onChange={handleChange}
              loading={loading}
              bordered={true}
              pagination={{
                total: dataVes?.length,
                pageSize: 10,

                showSizeChanger: false,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} items`,
              }}
              footer={() => (
                <Space direction={"vertical"}>
                  <Typography.Text strong>Chú thích loại media</Typography.Text>
                  <Typography.Text type="secondary">0: Video</Typography.Text>
                  <Typography.Text type="secondary">
                    1: Bài giảng điện tử - Dạng PDF
                  </Typography.Text>
                  <Typography.Text type="secondary">
                    2: Bài giảng điện tử - Dạng Video
                  </Typography.Text>
                  <Typography.Text type="secondary">
                    3: Sound - Sách nói dạng MP3
                  </Typography.Text>
                  <Typography.Text type="secondary">
                    4: Sound - Sách nói dạng video
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

export const VideoElearningSound =
  WithErrorBoundaryCustom(_VideoElearningSound);
